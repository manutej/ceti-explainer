import sys, time
from playwright.sync_api import sync_playwright
FLAGS = ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--font-render-hinting=none"]
with sync_playwright() as pw:
    b = pw.chromium.launch(args=FLAGS); pg = b.new_page(viewport={"width": 1280, "height": 900})
    errs = []; pg.on("console", lambda m: errs.append(m.type + ': ' + m.text)); pg.on("pageerror", lambda e: errs.append('pageerror ' + str(e)))
    t = time.time(); pg.goto("file://" + sys.argv[1], timeout=120000); print('goto', round(time.time() - t, 1))
    pg.wait_for_function("window.__atelier !== undefined", timeout=120000); print('atelier', round(time.time() - t, 1))
    pg.evaluate("() => window.__atelier.ready"); print('ready', round(time.time() - t, 1))
    pg.evaluate("() => window.__atelier.seek(20)"); print('seek', round(time.time() - t, 1))
    pg.screenshot(path=sys.argv[2]); print(errs[:5]); b.close()
