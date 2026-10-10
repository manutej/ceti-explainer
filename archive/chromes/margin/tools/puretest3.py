import sys, base64, io
from playwright.sync_api import sync_playwright
from PIL import Image, ImageChops
FLAGS = ["--use-gl=angle", "--disable-accelerated-2d-canvas", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--font-render-hinting=none"]
html, t = sys.argv[1], float(sys.argv[2])
with sync_playwright() as pw:
    b = pw.chromium.launch(args=FLAGS); pg = b.new_page(viewport={"width": 960, "height": 540})
    pg.goto("file://" + html + "?film=1"); pg.wait_for_function("window.__atelier !== undefined"); pg.evaluate("() => window.__atelier.ready")
    pg.evaluate("(f) => { globalThis.__mdbg = JSON.parse(f); }", sys.argv[3])
    def shot(tt):
        pg.evaluate("(t) => window.__atelier.seek(t)", tt)
        return Image.open(io.BytesIO(base64.b64decode(pg.evaluate("() => window.__atelier.capture('png')").split(',')[1]))).convert('RGB')
    ims = [shot(t) for _ in range(4)]
    for i in range(1, 4): print(i, ImageChops.difference(ims[0], ims[i]).getbbox(), ImageChops.difference(ims[1], ims[i]).getbbox())
    b.close()
