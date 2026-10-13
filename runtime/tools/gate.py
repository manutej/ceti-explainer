#!/usr/bin/env python3
"""
gate.py — checks a built Atelier film (the offline <id>.html). PASS/FAIL table; exit 1 on any FAIL.

    python3 gate.py <film.html> [--w 960] [--json report.json]

Checks
  LOAD      the live player and the ?film=1 page boot (__atelier.ready) with zero console errors / pageerrors
  CLOCK     film source has no frameCount / millis() / Date / performance.now / Math.random / p.random;
            runtime guards recorded no clock-law violations while drawing
  PURE-REP  seek t, seek elsewhere, seek t again → identical pixel hash (5 sampled t)
  PURE-ORD  seek A→B vs B→A → identical hashes at 5 sampled t pairs
  META      every meta row that declares `check` matches Atelier.AgentLoop.exact (counts within 4 sd)
  ENGINE    Atelier.AgentLoop.selfTest() passes (realised within 4 sd; twin-world invariants)
  CAPTIONS  every caption ≤ 90 chars, inside [0, duration], ordered
  AUDIO     __atelier.audio() returns a WAV of the film's duration
"""
import argparse, base64, hashlib, json, os, re, struct, sys, time

FLAGS = ["--use-gl=angle", "--disable-accelerated-2d-canvas", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--font-render-hinting=none"]
BANNED = [(r"\bframeCount\b", "frameCount"), (r"\bmillis\s*\(", "millis()"), (r"\bDate\s*[.(]", "Date"), (r"\bnew\s+Date\b", "Date"),
          (r"performance\s*\.\s*now", "performance.now"), (r"Math\s*\.\s*random", "Math.random"),
          (r"\bp\s*\.\s*random(Gaussian)?\s*\(", "p.random"), (r"\bdeltaTime\b", "deltaTime")]


def strip_comments(js):
    js = re.sub(r"/\*.*?\*/", "", js, flags=re.S)
    return re.sub(r"(^|[^:'\"\\])//[^\n]*", r"\1", js)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("html"); ap.add_argument("--w", type=int, default=None); ap.add_argument("--json", default=None)
    a = ap.parse_args()
    from playwright.sync_api import sync_playwright
    rows = []
    add = lambda name, ok, detail: rows.append((name, "PASS" if ok else "FAIL", detail))
    html = open(a.html, encoding="utf-8").read()
    m = re.search(r'<script data-atelier="film">(.*?)</script>', html, flags=re.S)
    film_src = strip_comments(m.group(1)) if m else ""
    url = "file://" + os.path.abspath(a.html)

    with sync_playwright() as pw:
        b = pw.chromium.launch(args=FLAGS)
        # live player
        errs_live = []
        pg = b.new_page(viewport={"width": 1280, "height": 900})
        pg.on("pageerror", lambda e: errs_live.append(f"pageerror: {e}"))
        pg.on("console", lambda msg: msg.type == "error" and errs_live.append(f"console: {msg.text}"))
        t0 = time.time()
        try:
            pg.goto(url); pg.wait_for_function("window.__atelier !== undefined", timeout=60000)
            pg.evaluate("() => window.__atelier.ready")
            pg.evaluate("() => window.__atelier.seek(window.__atelier.info().duration * 0.6)")
            layout = pg.evaluate("() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth })")
            pg.set_viewport_size({"width": 400, "height": 800}); pg.wait_for_timeout(400)
            narrow = pg.evaluate("() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth })")
        except Exception as e:
            errs_live.append(f"boot: {e}"); layout = narrow = {"sw": 0, "cw": 0}
        live_s = time.time() - t0
        pg.close()
        add("LOAD live", not errs_live, f"{live_s:.1f}s boot; " + ("; ".join(errs_live[:3]) or "0 errors"))
        add("LAYOUT 400px", narrow["sw"] <= narrow["cw"], f"scrollWidth {narrow['sw']} vs {narrow['cw']} at 400 px (1280: {layout['sw']}/{layout['cw']})")

        # film mode
        errs = []
        pg = b.new_page(viewport={"width": 960, "height": 540})
        pg.on("pageerror", lambda e: errs.append(f"pageerror: {e}"))
        pg.on("console", lambda msg: msg.type == "error" and errs.append(f"console: {msg.text}"))
        pg.goto(url + "?film=1" + (f"&w={a.w}" if a.w else ""))
        pg.wait_for_function("window.__atelier !== undefined", timeout=60000)
        pg.evaluate("() => window.__atelier.ready")
        info = pg.evaluate("() => window.__atelier.info()")
        dur = info["duration"]

        def shot(t):
            pg.evaluate("(t) => window.__atelier.seek(t)", t)
            return hashlib.sha1(pg.evaluate("() => window.__atelier.capture('png')").encode()).hexdigest()[:12]

        ts = [round(dur * f, 3) for f in (0.07, 0.29, 0.51, 0.73, 0.94)]
        rep_ok, rep_bad = True, []
        for t in ts:
            h1 = shot(t); shot(dur - t); h2 = shot(t)
            if h1 != h2: rep_ok = False; rep_bad.append(t)
        add("PURE-REP", rep_ok, f"5 t re-seeked identical" if rep_ok else f"differs at t={rep_bad}")
        ord_ok, ord_bad = True, []
        for i, t in enumerate(ts):
            u = ts[(i + 2) % len(ts)]
            a1, b1 = shot(t), shot(u)
            b2, a2 = shot(u), shot(t)
            if a1 != a2 or b1 != b2: ord_ok = False; ord_bad.append((t, u))
        add("PURE-ORD", ord_ok, "A→B == B→A at 5 pairs" if ord_ok else f"order-dependent at {ord_bad}")

        viol = pg.evaluate("() => window.__atelier.violations.slice(0, 5)")
        hits = sorted({name for rx, name in BANNED if re.search(rx, film_src)})
        add("CLOCK", not viol and not hits and bool(film_src),
            ("source clean" if not hits else "source uses " + ", ".join(hits)) + ("; runtime: " + "; ".join(viol) if viol else ""))

        meta = pg.evaluate("() => window.__atelier.meta()")
        checked = [m for m in meta if "check" in m]
        bad = [f"{m['label']}={m['value']} (exact {m['result']['expected']:.2f}±{m['result']['sd']:.2f})" for m in checked if not m["result"]["ok"]]
        add("META", not bad, (f"{len(checked)} checked rows vs AgentLoop.exact" if checked else "no checked rows") + ("; " + "; ".join(bad) if bad else ""))

        st = pg.evaluate("() => Atelier.AgentLoop.selfTest({ quiet: true })")
        worst = max(r["worstZ"] for r in st["rows"])
        add("ENGINE", st["pass"], f"selfTest {len(st['rows'])} cases, worst |z| {worst}")

        caps = info["captions"]
        long_ = [c["text"][:40] + "…" for c in caps if len(c["text"]) > 90]
        inside = all(0 <= c["t0"] < c["t1"] <= dur + 1e-6 for c in caps)
        ordered = all(caps[i]["t0"] <= caps[i + 1]["t0"] for i in range(len(caps) - 1))
        add("CAPTIONS", not long_ and inside and ordered,
            f"{len(caps)} captions, max {max([len(c['text']) for c in caps] or [0])} chars" + (f"; too long: {long_}" if long_ else "") +
            ("" if inside else "; outside [0,duration]") + ("" if ordered else "; out of order"))

        t1 = time.time()
        wav = base64.b64decode(pg.evaluate("() => window.__atelier.audio()"))
        ok_wav = wav[:4] == b"RIFF" and wav[8:12] == b"WAVE"
        sr, ch = struct.unpack("<I", wav[24:28])[0], struct.unpack("<H", wav[22:24])[0]
        secs = (len(wav) - 44) / (sr * ch * 2) if ok_wav else 0
        peak = 0
        if ok_wav:
            import array
            s = array.array("h"); s.frombytes(wav[44:44 + (len(wav) - 44) // 2 * 2]); peak = max((abs(x) for x in s), default=0) / 32767
        add("AUDIO", ok_wav and secs >= dur and info["events"] > 0 and peak > 0.01,
            f"{info['events']} events → {secs:.2f}s WAV, peak {peak:.2f}, {time.time() - t1:.1f}s offline")
        add("LOAD film", not errs, "; ".join(errs[:3]) or f"0 errors · {info['renderer']} {info['size'][0]}×{info['size'][1]}")
        b.close()

    w = max(len(r[0]) for r in rows)
    print(f"\nGATE {info['id']}  ({os.path.basename(a.html)})")
    for name, res, detail in rows:
        print(f"  {name:<{w}}  {res}  {detail}")
    verdict = all(r[1] == "PASS" for r in rows)
    print(f"  {'VERDICT':<{w}}  {'PASS' if verdict else 'FAIL'}\n")
    if a.json:
        os.makedirs(os.path.dirname(os.path.abspath(a.json)), exist_ok=True)
        json.dump({"film": info["id"], "pass": verdict, "rows": [dict(zip(("check", "result", "detail"), r)) for r in rows]}, open(a.json, "w"), indent=2)
    sys.exit(0 if verdict else 1)


if __name__ == "__main__":
    main()
