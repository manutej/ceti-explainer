// bench.mjs: ms per frame for N x implementation, headless chromium (software GL!). Writes bench.json.
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
import { writeFileSync } from 'node:fs'; import { resolve, dirname } from 'node:path'; import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const pg = await b.newPage({ viewport: { width: 960, height: 540 }, deviceScaleFactor: 2 });
pg.on('pageerror', e => console.log('E', String(e).slice(0, 200)));
await pg.goto('file://' + here + '/demo.html'); await pg.evaluate(() => window.__film.ready());
const rows = [], Ns = [1000, 10000, 50000];
for (const N of Ns) for (const impl of ['canvas2d', 'shape', 'webgl', 'instances']) {
  if (impl === 'shape' && N > 10000) { /* still measure; may be slow */ }
  let r; try { r = await pg.evaluate(s => window.__film.bench(s), { N, impl, structure: 'grid', hlFrac: 0.04, guess: 0.3 * N }); } catch (e) { r = { spec: { N, impl }, err: String(e).slice(0, 160) }; }
  rows.push(r); console.log(N, impl, r.err || (r.resolved + ' mean ' + r.mean.toFixed(1) + ' ms, setup ' + r.setup_ms.toFixed(0) + ' ms'));
}
for (const N of Ns) { const r = await pg.evaluate(n => window.__film.probeModelN(n), N); rows.push({ probe: 'model(g,n)+instanceID', ...r }); console.log('model-n', N, r.ok ? r.mean.toFixed(1) + ' ms' : r.err); }
writeFileSync(here + '/bench.json', JSON.stringify(rows, null, 1)); await b.close();
