import sys
from playwright.sync_api import sync_playwright
FLAGS = ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--font-render-hinting=none"]
JS = """() => {
 const main = document.querySelector('canvas'), c = main.getContext('2d');
 const mk = (wrf) => { const cv = document.createElement('canvas'); cv.width = 1440; cv.height = 810; const g = cv.getContext('2d', wrf ? {willReadFrequently:true} : undefined); g.fillStyle='#abc'; g.fillRect(0,0,1440,810); return cv; };
 const out = {}; const T = (name, f, n=20) => { const s = performance.now(); for (let i=0;i<n;i++) f(i); c.getImageData(0,0,1,1); out[name] = +((performance.now()-s)/n).toFixed(2); };
 const A = mk(false), B = mk(true);
 T('drawImage gpu->main', () => c.drawImage(A,0,0,1440,810,0,0,960,540));
 T('drawImage cpu->main', () => c.drawImage(B,0,0,1440,810,0,0,960,540));
 T('drawImage cpu->main (dirty)', (i) => { B.getContext('2d').fillRect(i,i,5,5); c.drawImage(B,0,0,1440,810,0,0,960,540); });
 T('blur shape', () => { c.save(); c.filter='blur(2px)'; c.fillRect(100,100,300,200); c.restore(); });
 T('no-blur shape', () => { c.save(); c.fillRect(100,100,300,200); c.restore(); });
 T('multiply path 300pts', () => { c.save(); c.globalCompositeOperation='multiply'; c.beginPath(); for(let i=0;i<300;i++) c.lineTo(100+i, 200+Math.sin(i)*5); c.fill(); c.restore(); }, 50);
 return out; }"""
with sync_playwright() as pw:
    b = pw.chromium.launch(args=FLAGS); pg = b.new_page(viewport={"width": 960, "height": 540})
    pg.goto("file://" + sys.argv[1] + "?film=1"); pg.wait_for_function("window.__atelier !== undefined"); pg.evaluate("() => window.__atelier.ready")
    print(pg.evaluate(JS)); b.close()
