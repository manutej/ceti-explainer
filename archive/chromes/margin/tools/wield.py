import sys, base64
from playwright.sync_api import sync_playwright
FLAGS = ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--font-render-hinting=none"]
with sync_playwright() as pw:
    b = pw.chromium.launch(args=FLAGS); pg = b.new_page(viewport={"width": 960, "height": 540})
    errs = []; pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto("file://" + sys.argv[1] + "?film=1"); pg.wait_for_function("window.__atelier !== undefined"); pg.evaluate("() => window.__atelier.ready")
    for v in sys.argv[3:]:
        pg.evaluate("(v) => window.__atelier.setState({ sydney: v })", int(v)); pg.evaluate("() => window.__atelier.seek(29.9)")
        open(sys.argv[2] + f"_{v}.png", "wb").write(base64.b64decode(pg.evaluate("() => window.__atelier.capture('png')").split(',')[1]))
        print(v, [m['label'] + '=' + str(m['value']) for m in pg.evaluate("() => window.__atelier.meta()")][2:6])
    print(errs); b.close()
