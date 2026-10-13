import sys, time
from playwright.sync_api import sync_playwright
html, t0, n = sys.argv[1], float(sys.argv[2]), int(sys.argv[3])
FLAGS = ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--font-render-hinting=none"]
with sync_playwright() as pw:
    b = pw.chromium.launch(args=FLAGS); pg = b.new_page(viewport={"width": 960, "height": 540})
    pg.goto("file://" + html + "?film=1"); pg.wait_for_function("window.__atelier !== undefined"); pg.evaluate("() => window.__atelier.ready")
    s = time.time(); pg.evaluate("(t) => window.__atelier.seek(t)", t0); print("first seek", round(time.time() - s, 2))
    s = time.time()
    for i in range(n): pg.evaluate("(t) => window.__atelier.seek(t)", t0 + (i + 1) / 30)
    print("seq per frame", round((time.time() - s) / n, 3))
    s = time.time()
    for i in range(n): pg.evaluate("() => window.__atelier.capture('jpg', 0.93)")
    print("capture per frame", round((time.time() - s) / n, 3))
    print(pg.evaluate("() => window.__atelier.errors"))
    b.close()
