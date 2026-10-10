// stills.mjs <out-dir> <t1,t2,...> <page.html>...  · film-mode stills (960×540 CSS px, density 1) named <page>.t<t>.png
// Also prints per page: load errors and a re-seek purity check (SVG + canvas) at the first time.
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
import path from 'node:path';
import fs from 'node:fs';
const [out, ts, ...pages] = process.argv.slice(2);
const times = ts.split(',').map(Number);
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--font-render-hinting=none'] });
for (const p of pages) {
  const errs = [];
  const pg = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 0.5 });
  pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await pg.goto('file://' + path.resolve(p) + '?film=1');
  await pg.evaluate(() => window.__film.ready());
  const snap = (t) => pg.evaluate((t) => { const r = window.__film.seek(t); return { e: r.error, s: document.querySelector('#stage svg').innerHTML, c: document.querySelector('#stage canvas').toDataURL() }; }, t);
  const name = path.basename(p, '.html');
  for (const t of times) { await snap(t); await pg.screenshot({ path: path.join(out, `${name}.t${t}.png`) }); }
  const a = await snap(times[0]); await snap(times[times.length - 1] * 0.7); await snap(3); const c = await snap(times[0]);
  console.log(name, JSON.stringify({ errs, pure: a.s === c.s && a.c === c.c }));
  await pg.close();
}
await b.close();
