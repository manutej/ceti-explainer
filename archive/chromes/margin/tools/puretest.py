import sys, base64, io
from playwright.sync_api import sync_playwright
from PIL import Image, ImageChops
FLAGS = ["--use-gl=angle", "--disable-accelerated-2d-canvas", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--font-render-hinting=none"]
html, t, u = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
with sync_playwright() as pw:
    b = pw.chromium.launch(args=FLAGS); pg = b.new_page(viewport={"width": 960, "height": 540})
    pg.goto("file://" + html + "?film=1"); pg.wait_for_function("window.__atelier !== undefined"); pg.evaluate("() => window.__atelier.ready")
    def shot(tt):
        pg.evaluate("(t) => window.__atelier.seek(t)", tt)
        return Image.open(io.BytesIO(base64.b64decode(pg.evaluate("() => window.__atelier.capture('png')").split(',')[1]))).convert('RGB')
    a = shot(t); shot(u); c = shot(t)
    d = ImageChops.difference(a, c); print('bbox of diff', d.getbbox())
    if d.getbbox():
        bb = d.getbbox(); a.crop(bb).resize(((bb[2]-bb[0])*3, (bb[3]-bb[1])*3)).save(sys.argv[4] + '_a.png'); c.crop(bb).resize(((bb[2]-bb[0])*3, (bb[3]-bb[1])*3)).save(sys.argv[4] + '_c.png')
        print('max diff', max(d.getextrema(), key=lambda e: e[1]))
    b.close()
