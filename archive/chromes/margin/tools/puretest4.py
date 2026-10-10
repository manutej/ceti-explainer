import sys, base64, io
from playwright.sync_api import sync_playwright
from PIL import Image, ImageChops
FLAGS = ["--use-gl=angle", "--disable-accelerated-2d-canvas", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--font-render-hinting=none"]
html, t, out = sys.argv[1], float(sys.argv[2]), sys.argv[3]
with sync_playwright() as pw:
    b = pw.chromium.launch(args=FLAGS); pg = b.new_page(viewport={"width": 960, "height": 540})
    pg.goto("file://" + html + "?film=1"); pg.wait_for_function("window.__atelier !== undefined"); pg.evaluate("() => window.__atelier.ready")
    pg.evaluate("() => { globalThis.__mdbg = {nopen:1}; }")
    def shot(tt):
        pg.evaluate("(t) => window.__atelier.seek(t)", tt)
        return Image.open(io.BytesIO(base64.b64decode(pg.evaluate("() => window.__atelier.capture('png')").split(',')[1]))).convert('RGB')
    a = shot(t); c = shot(t); d = ImageChops.difference(a, c); bb = d.getbbox(); print(bb)
    W = bb[2]-bb[0]; Hh = bb[3]-bb[1]; im = Image.new('RGB', (W*3, Hh*9))
    for k, x in enumerate([a, c, d.point(lambda v: min(255, v*6))]): im.paste(x.crop(bb).resize((W*3, Hh*3)), (0, k*Hh*3))
    im.save(out); b.close()
