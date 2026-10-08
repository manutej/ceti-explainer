import sys, base64, io
from playwright.sync_api import sync_playwright
from PIL import Image, ImageChops
FLAGS = ["--use-gl=angle", "--disable-accelerated-2d-canvas", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"]
t, other = float(sys.argv[2]), float(sys.argv[3])
with sync_playwright() as pw:
    b = pw.chromium.launch(args=FLAGS); pg = b.new_page(viewport={"width": 960, "height": 540})
    pg.goto("file://" + sys.argv[1] + "?film=1"); pg.wait_for_function("window.__atelier !== undefined"); pg.evaluate("() => window.__atelier.ready")
    def cap(tt):
        pg.evaluate("async (t) => window.__atelier.seek(t)", tt)
        return Image.open(io.BytesIO(base64.b64decode(pg.evaluate("() => window.__atelier.capture('png')").split(",", 1)[1]))).convert("RGB")
    a = cap(t); cap(other); c = cap(t)
    d = ImageChops.difference(a, c); print("bbox", d.getbbox())
    if d.getbbox(): d.point(lambda v: min(255, v * 20)).save("/tmp/diff.png"); a.save("/tmp/a.png"); c.save("/tmp/c.png")
    b.close()
