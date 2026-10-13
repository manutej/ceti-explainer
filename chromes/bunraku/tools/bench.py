"""bench.py <film.html> t1,t2,...  — CPU-seconds per frame (browser process tree; load-independent) and wall s."""
import sys, time, psutil, os
from playwright.sync_api import sync_playwright
FLAGS = ["--use-gl=angle", "--disable-accelerated-2d-canvas", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"]
def tree_cpu(pids):
    tot = 0.0
    for pid in pids:
        try:
            pr = psutil.Process(pid); ts = pr.cpu_times(); tot += ts.user + ts.system
        except psutil.Error: pass
    return tot
with sync_playwright() as pw:
    before = set(psutil.pids())
    b = pw.chromium.launch(args=FLAGS); pg = b.new_page(viewport={"width": 960, "height": 540})
    errs = []; pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("console", lambda m: m.type == "error" and errs.append(m.text))
    pg.goto("file://" + sys.argv[1] + "?film=1" + (("&bkdbg=" + sys.argv[3]) if len(sys.argv) > 3 else "")); pg.wait_for_function("window.__atelier !== undefined"); pg.evaluate("() => window.__atelier.ready")
    mine = [p for p in psutil.pids() if p not in before]
    mine = [p for p in mine if 'headless' in ' '.join(psutil.Process(p).cmdline()[:1]) or 'chrom' in ' '.join(psutil.Process(p).cmdline()[:1])]
    for t in [float(x) for x in sys.argv[2].split(",")]:
        pg.evaluate("async (t) => window.__atelier.seek(t)", t)
        c0, w0 = tree_cpu(mine), time.time()
        for k in range(2): pg.evaluate("async (t) => { await window.__atelier.seek(t); return window.__atelier.capture('jpg', 0.9).length }", t + 0.01 * k)
        print("t", t, "cpu-s/frame", round((tree_cpu(mine) - c0) / 2, 2), "wall", round((time.time() - w0) / 2, 2))
    print("errors", errs[:5])
    b.close()
