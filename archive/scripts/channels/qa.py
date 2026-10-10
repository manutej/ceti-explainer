#!/usr/bin/env python3
"""
channels/qa.py — the automatable half of the CHANNELS §5 rubric.

    probe(html, times, w, h) → {t: [{text, x0,y0,x1,y1 (u), px (export), phone (CSS px on a 390-px phone)}]}
        loads the built page (?film=1), seeks each t, and measures every VISIBLE <text> in the SVG
        (effective opacity through its ancestors ≥ 0.05, not hidden): its box and its rendered size.
    safe_zone(boxes, lay)   Q3: no type inside a platform mask zone (core/layout.js lay.mask)
    type_floor(boxes)       Q8: smallest visible type ≥ 11 CSS px at phone size; ≤ 4 sizes per frame
    numbers(texts, ref)     Q6: every number in channel text is a number the film prints
    honesty(texts, needles) Q10: the top honesty item is present
Q1/Q2/Q4/Q5/Q7/Q9 need eyes: qa.json lists them as a checklist with the frames to look at.
"""
import re

PHONE = 390.0

PROBE_JS = r"""(t) => {
  const c = window.__ctrl; c.pause(); c.seek(t);
  const svg = document.getElementById('cv'), R = svg.getBoundingClientRect(), k = R.width / 960, out = [];
  svg.querySelectorAll('text').forEach(e => {
    const txt = (e.textContent || '').trim(); if (!txt) return;
    let o = 1, n = e;
    while (n && n !== svg) { const cs = getComputedStyle(n); if (cs.display === 'none' || cs.visibility === 'hidden') { o = 0; break; } o *= parseFloat(cs.opacity); n = n.parentNode; }
    if (o < 0.05) return;
    const r = e.getBoundingClientRect(); if (r.width < 1) return;
    const m = e.getScreenCTM(), fs = parseFloat(getComputedStyle(e).fontSize) * (m ? m.a : 1);
    out.push({ text: txt.slice(0, 60), x0: (r.left - R.left) / k, y0: (r.top - R.top) / k, x1: (r.right - R.left) / k, y1: (r.bottom - R.top) / k, px: fs, o: +o.toFixed(2) });
  });
  return out;
}"""


def probe(html, times, w, h, browser):
    """browser: a Playwright browser (the compositor's) — one sync Playwright per process"""
    res = {}
    pg = browser.new_page(viewport={"width": w, "height": h}, device_scale_factor=1)
    pg.goto("file://" + html + "?film=1")
    pg.wait_for_function("window.__ctrl !== undefined", timeout=60000)
    pg.evaluate("async () => { if (window.__film) await window.__film.ready(); await document.fonts.ready; }")
    for t in times:
        res[round(t, 3)] = pg.evaluate(PROBE_JS, t)
    pg.close()
    return res


def phone_px(px_export, export_w):
    return px_export * PHONE / export_w


def inside(m, b):
    return not (b["x1"] <= m[0] or b["x0"] >= m[2] or b["y1"] <= m[1] or b["y0"] >= m[3])


def safe_zone(boxes, lay, where=""):
    """boxes in u; returns failures"""
    bad = []
    for b in boxes:
        for m in lay["mask"]:
            # a glyph box overlaps a zone by more than 2 u (antialiasing and line-height slack are not type)
            if inside([m[0] + 2, m[1] + 2, m[2] - 2, m[3] - 2], b):
                bad.append({"where": where, "text": b.get("text", ""), "box": [round(b["x0"]), round(b["y0"]), round(b["x1"]), round(b["y1"])], "zone": m})
                break
    return bad


def type_floor(boxes, export_w, floor=11.0, where=""):
    bad, sizes = [], set()
    for b in boxes:
        p = phone_px(b["px"], export_w)
        sizes.add(round(b["px"]))
        if p < floor - 0.05:
            bad.append({"where": where, "text": b.get("text", ""), "phone_css_px": round(p, 2)})
    return bad, sorted(sizes)


NUM = re.compile(r"(?<![\w.])(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?)(?![\w])")


def numbers_in(text):
    out = []
    for m in NUM.finditer(text):
        out.append(str(float(m.group(1).replace(",", ""))).rstrip("0").rstrip("."))
    return out


def numbers(texts, ref, allow=()):
    """Q6: every number in the channel's text must be one the film prints"""
    refset = {str(float(x)).rstrip("0").rstrip(".") for x in ref} | set(allow)
    stray = {}
    for where, t in texts.items():
        for n in numbers_in(t):
            if n not in refset:
                stray.setdefault(where, []).append(n)
    return stray


def honesty(texts, needles):
    """Q10: the top honesty item survives in every output (any one of the needles, case-insensitive)"""
    miss = []
    for where, t in texts.items():
        tl = t.lower()
        if not any(n.lower() in tl for n in needles):
            miss.append(where)
    return miss


# ───────────────── compiler rules (round 2): enforced for every topic; a violation fails the channel ─────────────────
# (a) dominance: each frame declares its dominant element; its box must cover ≥ 35 % of the channel's SAFE area
# (b) no repeated figure state in a sequence: perceptual hash (dHash 16×16) of the figure region, Hamming ≤ 12/256 = duplicate
# (c) type minimums at native px (1080 wide): headline ≥ 72 · body ≥ 36 · labels ≥ 28 · key numeral ≥ 200
# (d) the brand line appears exactly once per carousel / PDF / reel

TYPE_MIN = {"headline": 72, "hook": 72, "claim": 72, "aha": 72, "body": 36, "caption": 36, "cta": 36, "numeral": 200}
LABEL_MIN = 28


def dhash(img, n=16):
    g = img.convert("L").resize((n + 1, n))
    px = list(g.getdata())
    bits = 0
    for y in range(n):
        for x in range(n):
            bits = (bits << 1) | (1 if px[y * (n + 1) + x] > px[y * (n + 1) + x + 1] else 0)
    return bits


def dedupe(items, thresh=12):
    """items: [(name, PIL image of the figure region)] → list of duplicate pairs"""
    hs = [(n, dhash(im)) for n, im in items]
    dup = []
    for i in range(len(hs)):
        for j in range(i + 1, len(hs)):
            d = bin(hs[i][1] ^ hs[j][1]).count("1")
            if d <= thresh:
                dup.append({"a": hs[i][0], "b": hs[j][0], "hamming": d})
    return dup


def dominance(frames, safe, frac=0.35):
    """frames: [(name, (x, y, w, h) dominant box px)], safe: (x0, y0, x1, y1) px → failures"""
    A = (safe[2] - safe[0]) * (safe[3] - safe[1])
    out = []
    for n, b in frames:
        x0, y0 = max(b[0], safe[0]), max(b[1], safe[1])
        x1, y1 = min(b[0] + b[2], safe[2]), min(b[1] + b[3], safe[3])
        f = max(0, x1 - x0) * max(0, y1 - y0) / A
        out.append({"frame": n, "fraction": round(f, 3), "pass": f >= frac})
    return out


def type_minimums(boxes, where="", crops=()):
    """compositor boxes (data-qa role, px) + film crops [(name, min film label px after scaling)]"""
    bad = []
    for b in boxes:
        need = TYPE_MIN.get(b["qa"], LABEL_MIN)
        if b["px"] < need - 0.5:
            bad.append({"where": where, "role": b["qa"], "px": round(b["px"], 1), "min": need, "text": b.get("text", "")[:40]})
    for name, px in crops:
        if px < LABEL_MIN - 0.5:
            bad.append({"where": where, "role": "film label in crop " + name, "px": round(px, 1), "min": LABEL_MIN})
    return bad


def brand_count(boxes, brand):
    return sum(1 for b in boxes if b["qa"] == "brand" and brand.lower() in b.get("text", "").lower())


def safe_px(boxes, safe, where=""):
    """compositor boxes against a px safe box"""
    bad = []
    for b in boxes:
        if b["x"] < safe[0] - 1 or b["y"] < safe[1] - 1 or b["x"] + b["w"] > safe[2] + 1 or b["y"] + b["h"] > safe[3] + 1:
            bad.append({"where": where, "role": b["qa"], "box": [round(b["x"]), round(b["y"]), round(b["x"] + b["w"]), round(b["y"] + b["h"])], "text": b.get("text", "")[:40]})
    return bad
