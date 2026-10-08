import sys, time
from playwright.sync_api import sync_playwright
FLAGS = ["--use-gl=angle", "--disable-accelerated-2d-canvas", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--disable-gpu-vsync", "--disable-frame-rate-limit", "--font-render-hinting=none", "--autoplay-policy=no-user-gesture-required"]
with sync_playwright() as pw:
    b = pw.chromium.launch(args=FLAGS); pg = b.new_page(viewport={"width": 640, "height": 360}, device_scale_factor=1)
    pg.on("console", lambda m: print("console", m.type, m.text[:200])); pg.on("pageerror", lambda e: print("pageerror", e))
    pg.goto("file://" + sys.argv[1] + "?film=1"); pg.wait_for_function("window.__atelier !== undefined", timeout=60000); pg.evaluate("() => window.__atelier.ready")
    info = pg.evaluate("() => window.__atelier.info()"); pg.set_viewport_size({"width": info["size"][0], "height": info["size"][1]})
    for t in [float(x) for x in sys.argv[2].split(",")]:
        t0 = time.time(); r = pg.evaluate("async (t) => window.__atelier.seek(t)", t); u = pg.evaluate("() => window.__atelier.capture('png').length")
        print(t, round(time.time() - t0, 2), r, u, flush=True)
    b.close()
