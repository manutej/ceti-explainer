#!/usr/bin/env python3
"""
channels/scenes.py — designed channel scenes built from FIGURE STATES (round 2).

A figure state is a crop of the film at one time (or over a window), rendered at 2–3 px per unit with the paper grid
off (core/build_plan.py --scale --nogrid --bare head,foot,chip), so it can be set large and blended (darken) onto the
scene's own paper. Scenes are laid out for the channel's SAFE box, not re-cropped frames of the film:

    reel      1080×1920, safe x 48–880, y 120–1150 px (the coordinator's reel rule; IG UI below and right)
    carousel  1080×1350, safe x 54–1026, y 54–1242 px
    pdf       same as carousel (LinkedIn document pages)

Each scene declares its dominant element (QA rule a), each sequence is checked for repeated figure states by a
perceptual hash of its figure crops (rule b), every type box is measured against the channel minimums (rule c),
and the brand line is counted (rule d). See qa.py.
"""
import os
from PIL import Image, ImageChops

import compose as C

EXPORT = {"16x9": (1920, 1080), "1x1": (1080, 1080), "4x5": (1080, 1350), "9x16": (1080, 1920)}
LABEL_U = {"16x9": 13, "4x5": 28, "1x1": 28, "9x16": 28}       # the smallest film label (u) in each source layout
BARE = "head,foot,chip"

# name → source aspect, render scale, time (frame-bank name or seconds), crop box in u (x0, y0, x1, y1)
FIG = {
    "city":        dict(aspect="16x9", scale=1.5, t="po.first", box=(218, 166, 534, 394)),
    "city.ghost":  dict(aspect="16x9", scale=1.5, t="count", box=(218, 166, 534, 362)),
    "strip":       dict(aspect="16x9", scale=1.5, t=9.0, box=(592, 166, 884, 392)),
    "wrong.rc":    dict(aspect="4x5", scale=2, t="wrong", box=(468, 282, 912, 936)),
    "wrongbreak":  dict(aspect="4x5", scale=2, t="break", box=(68, 283, 912, 936)),
    "break":       dict(aspect="16x9", scale=1.5, t="break", box=(204, 150, 550, 400)),
    "ringed":      dict(aspect="16x9", scale=1.5, t=53.4, box=(218, 144, 590, 394)),
    "block":       dict(aspect="4x5", scale=2, t="count", box=(468, 286, 912, 548)),
    "denominator": dict(aspect="4x5", scale=2, t="gap", box=(468, 548, 912, 936)),
    "contrast":    dict(aspect="4x5", scale=2, t="contrast", box=(68, 240, 900, 936)),
    "city.mark":   dict(aspect="16x9", scale=1.5, t="po.first", box=(222, 170, 530, 362)),
    "sources":     dict(aspect="4x5", scale=2, t=21.3, box=(52, 283, 912, 936)),
}

REEL_SAFE = (48, 120, 880, 1150)
SLIDE_SAFE = (54, 54, 1026, 1242)


def kpx(aspect, scale):
    return EXPORT[aspect][0] / 960.0 * scale


def crop(img, spec):
    k = kpx(spec["aspect"], spec["scale"])
    x0, y0, x1, y1 = spec["box"]
    return img.crop((int(x0 * k), int(y0 * k), int(x1 * k), int(y1 * k))).convert("RGB")


def fig_still(job, name):
    s = FIG[name]
    p = job.stills(s["aspect"], [s["t"]], bare=BARE, scale=s["scale"], nogrid=True)[s["t"]]
    out = os.path.join(job.work, "figs", name + ".png")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    crop(Image.open(p), s).save(out)
    return out


def fit(w, h, bw, bh):
    s = min(bw / w, bh / h)
    return s, int(round(w * s)), int(round(h * s))


def label_px(name, s):
    """the smallest film label of a crop once scaled by s into the scene (rule c)"""
    f = FIG[name]
    return LABEL_U[f["aspect"]] * kpx(f["aspect"], f["scale"]) * s


# ───────────────────────────── HTML scenes (Chromium, brand faces) ─────────────────────────────

CSS = """
.k {{ position:absolute; font-family:"Space Mono"; font-size:30px; letter-spacing:0.14em; color:var(--accent); }}
.h {{ position:absolute; font-family:"Fraunces"; font-style:italic; font-weight:300; color:var(--ink); line-height:1.04; letter-spacing:-0.012em; text-wrap:balance; }}
.b {{ position:absolute; font-family:"DM Sans"; font-size:38px; line-height:1.24; color:var(--ink); text-wrap:pretty; }}
.dim {{ color:var(--dim); }}
.n {{ position:absolute; font-family:"Space Mono"; font-weight:700; color:var(--machine); line-height:0.9; letter-spacing:-0.04em; }}
.l {{ position:absolute; font-family:"Space Mono"; font-size:30px; color:var(--dim); white-space:nowrap; }}
.fig {{ position:absolute; mix-blend-mode:darken; }}
.row {{ position:absolute; display:flex; gap:28px; align-items:baseline; font-family:"Space Mono"; font-size:30px; color:var(--dim); }}
.row .sw {{ color:var(--accent); }} .row .ctr {{ margin-left:auto; }}
"""


def el(cls, x, y, w, text, qa, size=None, extra=""):
    st = f"left:{x}px; top:{y}px;" + (f" width:{w}px;" if w else "") + (f" font-size:{size}px;" if size else "") + extra
    return f'<div class="{cls}" style="{st}" data-qa="{qa}">{text}</div>'


def img(path, x, y, w, h, opacity=1.0):
    return f'<img class="fig" src="file://{path}" style="left:{x}px; top:{y}px; width:{w}px; height:{h}px; opacity:{opacity};">'


def meter(x0, x1, y, wrong=80, right=41, size=34, labels=True):
    """the 0–100 axis with the common answer and the count (an HTML/SVG figure drawn at the scene's own size)"""
    w = x1 - x0
    X = lambda v: x0 + w * v / 100.0
    t = C.TOK["notebook"]
    svg = (f'<svg style="position:absolute; left:0; top:0; overflow:visible" width="1080" height="1920">'
           f'<line x1="{x0}" y1="{y}" x2="{x1}" y2="{y}" stroke="{t["dim"]}" stroke-width="4"/>'
           f'<rect x="{x0}" y="{y - 14}" width="{X(wrong) - x0:.1f}" height="28" rx="4" fill="{t["accent"]}" opacity="0.30"/>'
           + "".join(f'<line x1="{X(v):.1f}" y1="{y - 18}" x2="{X(v):.1f}" y2="{y + 18}" stroke="{t["dim"]}" stroke-width="3"/>' for v in (0, 50, 100))
           + f'<line x1="{X(wrong):.1f}" y1="{y - 34}" x2="{X(wrong):.1f}" y2="{y + 34}" stroke="{t["accent"]}" stroke-width="8" stroke-linecap="round"/>'
           + f'<line x1="{X(right):.1f}" y1="{y - 34}" x2="{X(right):.1f}" y2="{y + 34}" stroke="{t["machine"]}" stroke-width="8" stroke-linecap="round"/>'
           + f'<path d="M{X(right):.1f} {y - 52} V{y - 72} H{X(wrong):.1f} V{y - 52}" fill="none" stroke="{t["error"]}" stroke-width="4"/></svg>')
    if not labels:
        return svg
    gap = wrong - right
    return (svg + el("l", int(X(right) + 10), y + 46, None, f"the count {right} %", "label", size, f" color:{t['machine']}; font-weight:700; transform:translateX(-100%);")
            + el("l", int(x1), y + 46 + int(size * 1.35), None, f"most people {wrong} %", "label", size, f" color:{t['accent']}; transform:translateX(-100%);")
            + el("l", int((X(right) + X(wrong)) / 2), y - 122, None, f"{gap} points off", "label", size, f" color:{t['error']}; transform:translateX(-50%);"))


def page(job, body, w, h, path, extra_css=""):
    return job.comp.shot(body, w, h, path, job.chrome, css=CSS.format() + extra_css)


# ───────────────────────────── reel ─────────────────────────────

def reel_overlay(job, beat, path):
    """transparent text layer for a moving beat: the headline at y≈140 (serif 80 px, ≤ 2 lines), optional numeral"""
    x0, y0, x1, _ = REEL_SAFE
    body = el("h", x0, 132, x1 - x0, C.esc(beat["headline"]), "headline", 80)
    return job.comp.shot(body, 1080, 1920, path, job.chrome, transparent=True, css=CSS.format())


def reel_numeral(job, text, y, path, label=None):
    x0 = REEL_SAFE[0]
    body = el("n", x0, y, None, C.esc(text), "numeral", 250)
    if label:
        body += el("l", x0, y + 240, None, C.esc(label), "label", 36, " color:var(--machine);")
    return job.comp.shot(body, 1080, 1920, path, job.chrome, transparent=True, css=CSS.format())


def reel_cold(job, beat, path):
    x0, y0, x1, y1 = REEL_SAFE
    body = (el("h", x0, 150, x1 - x0, C.esc(beat["headline"]), "hook", 92)
            + el("n", x0, 330, None, C.esc(beat["numeral"]), "numeral", 300)
            + el("l", x0, 640, x1 - x0, C.esc(beat["numeralLabel"]), "label", 40, " color:var(--machine); white-space:normal;")
            + meter(x0 + 10, x1 - 10, 900, size=34))
    boxes = page(job, body, 1080, 1920, path)
    return boxes, (x0, 330, x1 - x0, 1150 - 330)       # dominant: the numeral + its axis (+ the city it was counted on)


def reel_end(job, beat, path):
    x0, y0, x1, y1 = REEL_SAFE
    t = C.TOK["notebook"]
    panel = f'<div style="position:absolute; left:{x0}px; top:370px; width:{x1 - x0}px; height:520px; border:3px solid {t["ink"]}; border-radius:24px;"></div>'
    body = (el("h", x0, 140, x1 - x0, C.esc(beat["headline"]), "headline", 92)
            + panel
            + el("n", x0 + 40, 400, None, '<span style="color:var(--accent); text-decoration:line-through; text-decoration-thickness:10px">80%</span>', "numeral", 200)
            + el("n", x0 + 40, 580, None, "41%", "numeral", 230)
            + el("b", x0, 920, x1 - x0, C.esc(beat["cta"]), "cta", 44)
            + el("l", x0, 1040, x1 - x0, C.esc(job.copy["brand"]), "brand", 34, " color:var(--ink);")
            + el("l", x0, 1092, x1 - x0, C.esc(job.copy["url"]), "label", 30))
    boxes = page(job, body, 1080, 1920, path)
    return boxes, (x0, 370, x1 - x0, 520)


# ───────────────────────────── carousel / pdf slides ─────────────────────────────

def slide_scene(job, s, i, n, path, li=False):
    """1080×1350: kicker + headline (≥ 72 px) on top, the figure state large in the middle, body (≥ 36 px) and the
    counter row at the bottom. Returns (boxes, dominant box, crops used [(fig, scale)])"""
    x0, y0, x1, y1 = SLIDE_SAFE
    W = x1 - x0
    body, crops, dom = "", [], None
    sc = s["scene"]
    has_body = bool(s.get("body"))
    fig_top, fig_bot = 330, (1040 if li else 1080) if has_body else 1150
    if sc == "reveal":
        body += el("k", x0, 66, W, C.esc(s["kicker"]), "kicker")
        body += el("h", x0, 106, W, C.esc(s["headline"]), "headline", 84)
        body += el("n", x0, 326, None, C.esc(s["numeral"]), "numeral", 330)
        body += meter(x0 + 10, x1 - 10, 800, size=34)
        cw, ch = 250, 180
        body += img(job.figs["city.mark"], x1 - cw, 1000, cw, ch, 0.8) + el("l", x1 - cw - 290, 1148, 270, "1,000 cabs, counted", "label", 28, " text-align:right;")
        dom = (x0, 320, W, 940 - 320)
    elif sc == "cta":
        t = C.TOK["notebook"]
        body += el("k", x0, 66, W, C.esc(s["kicker"]), "kicker")
        body += el("h", x0, 112, W, C.esc(s["headline"]), "headline", 78)
        body += f'<div style="position:absolute; left:{x0}px; top:330px; width:{W}px; height:560px; border:3px solid {t["ink"]}; border-radius:24px;"></div>'
        body += el("n", x0 + 44, 372, None, '<span style="color:var(--accent); text-decoration:line-through; text-decoration-thickness:10px">80%</span>', "numeral", 200)
        body += el("n", x0 + 44, 570, None, "41%", "numeral", 230)
        body += el("h", x0 + 500, 640, W - 540, "the denominator decides", "body", 64, " color:var(--machine);")
        body += el("l", x0, 940, W, C.esc(job.copy["brand"]), "brand", 40, " color:var(--ink);")
        body += el("l", x0, 1004, W, C.esc(job.copy["url"]), "label", 32)
        body += el("b", x0, 1070, W, C.esc(job.copy["honestyLine"]), "honesty", 30, " color:var(--dim);")
        dom = (x0, 330, W, 560)
    else:
        body += el("k", x0, 66, W, C.esc(s["kicker"]), "kicker")
        body += el("h", x0, 112, W, C.esc(s["headline"]), "headline", 76)
        bh = fig_bot - fig_top
        if sc == "count":
            gw, gh = Image.open(job.figs["city.ghost"]).size
            gs, gw2, gh2 = fit(gw, gh, W, bh)
            body += img(job.figs["city.ghost"], x0 + (W - gw2) // 2, fig_top + (bh - gh2) // 2, gw2, gh2, 0.3)
            fw, fh = Image.open(job.figs["block"]).size
            s1, w1, h1 = fit(fw, fh, W, bh - 250)
            body += img(job.figs["block"], x0, fig_top, w1, h1)
            crops.append(("block", s1))
            body += el("n", x0, fig_top + h1 + 18, None, C.esc(s["numeral"]), "numeral", 230)
            body += el("l", x0 + 470, fig_top + h1 + 120, None, "= 120 ÷ 290", "label", 48, " color:var(--machine);")
            dom = (x0, fig_top, W, h1 + 250)
        else:
            name = {"city": "city", "wrongbreak": "wrongbreak", "denominator": "sources", "contrast": "contrast"}[sc]
            fw, fh = Image.open(job.figs[name]).size
            s1, w1, h1 = fit(fw, fh, W, bh)
            body += img(job.figs[name], x0 + (W - w1) // 2, fig_top, w1, h1)
            crops.append((name, s1))
            dom = (x0 + (W - w1) // 2, fig_top, w1, h1)
        if has_body:
            by = fig_bot + 16
            body += el("b", x0, by, W, C.esc(s["body"]), "body", 38 if not li else 36)
            if s.get("honesty"):
                body += el("b", x0, by + 100, W, C.esc(job.copy["honestyLine"]), "honesty", 30, " color:var(--dim);")
    left = ""
    if s.get("swipe"):
        left += f'<span class="sw" data-qa="swipe">{C.esc(s["swipe"])}</span>'
    if s.get("source"):
        left += f'<span data-qa="source">[{C.esc(s["source"])}]</span>'
    body += f'<div class="row" style="left:{x0}px; width:{W}px; top:{y1 - 48}px;">{left}<span class="ctr" data-qa="counter">{i + 1} / {n}</span></div>'
    boxes = page(job, body, 1080, 1350, path)
    return boxes, dom, crops


def compose_frame(bg, fig, box, overlays):
    """reel frame: the figure darkened onto the paper (no box edge), then the text layers"""
    im = bg.copy()
    if fig is not None:
        x, y, w, h = box
        f = fig.resize((w, h), Image.LANCZOS)
        reg = im.crop((x, y, x + w, y + h))
        im.paste(ImageChops.darker(reg, f), (x, y))
    for ov, a in overlays:
        if a <= 0:
            continue
        if a < 1:
            ov = ov.copy()
            ov.putalpha(ov.getchannel("A").point(lambda v, a=a: int(v * a)))
        im.paste(ov, (0, 0), ov)
    return im
