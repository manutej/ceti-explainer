import sys
from playwright.sync_api import sync_playwright
FLAGS = ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--font-render-hinting=none"]
INIT = """
window.__prof = {};
const P = CanvasRenderingContext2D.prototype;
for (const k of ['drawImage','fill','stroke','fillRect','clearRect','arc','lineTo','putImageData','getImageData']) {
  const f = P[k]; P[k] = function() { const s = performance.now(); const r = f.apply(this, arguments); const d = performance.now() - s;
    const key = k + (this.canvas && this.canvas.isConnected ? '@main' : '@off'); const o = window.__prof[key] || (window.__prof[key] = [0,0]); o[0] += d; o[1]++; return r; };
}"""
html, t0, n = sys.argv[1], float(sys.argv[2]), int(sys.argv[3])
with sync_playwright() as pw:
    b = pw.chromium.launch(args=FLAGS); pg = b.new_page(viewport={"width": 960, "height": 540}); pg.add_init_script(INIT)
    pg.goto("file://" + html + "?film=1"); pg.wait_for_function("window.__atelier !== undefined"); pg.evaluate("() => window.__atelier.ready")
    pg.evaluate("(t) => window.__atelier.seek(t)", t0)
    pg.evaluate("() => { window.__prof = {}; }")
    tot = pg.evaluate("""async ([t0, n]) => { const s = performance.now(); for (let i = 0; i < n; i++) await window.__atelier.seek(t0 + (i+1)/30); return (performance.now() - s) / n; }""", [t0, n])
    prof = pg.evaluate("() => window.__prof")
    print('ms/frame', round(tot, 1))
    for k, (ms, c) in sorted(prof.items(), key=lambda kv: -kv[1][0]): print(f'  {k:22s} {ms/n:8.2f} ms/frame  {c/n:8.1f} calls/frame')
    b.close()
