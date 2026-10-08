import sys, base64, io, json
from playwright.sync_api import sync_playwright
from PIL import Image, ImageChops
FLAGS = ["--use-gl=angle", "--disable-accelerated-2d-canvas", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--font-render-hinting=none"]
html, t, u, flags = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), sys.argv[4]
with sync_playwright() as pw:
    b = pw.chromium.launch(args=FLAGS); pg = b.new_page(viewport={"width": 960, "height": 540})
    pg.goto("file://" + html + "?film=1"); pg.wait_for_function("window.__atelier !== undefined"); pg.evaluate("() => window.__atelier.ready")
    pg.evaluate("(f) => { globalThis.__mdbg = JSON.parse(f); }", flags)
    def shot(tt):
        pg.evaluate("(t) => window.__atelier.seek(t)", tt)
        return Image.open(io.BytesIO(base64.b64decode(pg.evaluate("() => window.__atelier.capture('png')").split(',')[1]))).convert('RGB')
    a = shot(t); shot(u); c = shot(t)
    print(flags, 'diff bbox', ImageChops.difference(a, c).getbbox())
    b.close()
