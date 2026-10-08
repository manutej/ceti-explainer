"""shot.py <film.html> <t> <out.png> [extra query]  — one frame, film mode 960, optional extra URL params."""
import sys, base64
from playwright.sync_api import sync_playwright
FLAGS = ["--use-gl=angle", "--disable-accelerated-2d-canvas", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"]
with sync_playwright() as pw:
    b = pw.chromium.launch(args=FLAGS); pg = b.new_page(viewport={"width": 960, "height": 540})
    errs = []; pg.on("pageerror", lambda e: errs.append(str(e))); pg.on("console", lambda m: m.type == "error" and errs.append(m.text))
    q = "?film=1" + ("&" + sys.argv[4] if len(sys.argv) > 4 else "")
    pg.goto("file://" + sys.argv[1] + q); pg.wait_for_function("window.__atelier !== undefined"); pg.evaluate("() => window.__atelier.ready")
    if len(sys.argv) > 5: pg.evaluate("(o) => window.__atelier.setState(o)", __import__("json").loads(sys.argv[5]))
    pg.evaluate("async (t) => window.__atelier.seek(t)", float(sys.argv[2]))
    url = pg.evaluate("() => window.__atelier.capture('png')")
    open(sys.argv[3], "wb").write(base64.b64decode(url.split(",", 1)[1]))
    print("errors", errs[:5]); b.close()
