import sys, time
from playwright.sync_api import sync_playwright
FLAGS = ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--font-render-hinting=none"]
INIT = """
const t0 = performance.now(); const L = (m) => console.log('[' + ((performance.now()-t0)/1000).toFixed(2) + '] ' + m);
document.addEventListener('DOMContentLoaded', () => L('DCL')); addEventListener('load', () => L('load'));
const P = CanvasRenderingContext2D.prototype; const f = P.putImageData; P.putImageData = function() { L('putImageData ' + this.canvas.width + 'x' + this.canvas.height); return f.apply(this, arguments); };
const ri = requestAnimationFrame; let n = 0; window.requestAnimationFrame = function(cb) { if (n++ < 3) L('raf requested'); return ri.call(window, cb); };
setTimeout(function tick(){ L('tick'); }, 50);
"""
with sync_playwright() as pw:
    b = pw.chromium.launch(args=FLAGS); pg = b.new_page(viewport={"width": 1280, "height": 900}); pg.add_init_script(INIT)
    pg.on("console", lambda m: print(m.text[:160]))
    t = time.time(); pg.goto("file://" + sys.argv[1], timeout=120000); print('goto', round(time.time() - t, 1))
    pg.wait_for_function("window.__atelier !== undefined", timeout=120000, polling=100); print('atelier', round(time.time() - t, 1))
    pg.evaluate("() => window.__atelier.ready"); print('ready', round(time.time() - t, 1))
    b.close()
