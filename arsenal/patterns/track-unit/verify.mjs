// verify.mjs · run after shoot.mjs: merges the congruence lint, a negative control and per-variant s/frame into
// shots/report.json (ceti-dark) and shots/swiss-grid/report.json.  node arsenal/patterns/track-unit/verify.mjs
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url)), html = resolve(here, 'demo.html');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
for (const [brand, dir] of [['ceti-dark', 'shots'], ['swiss-grid', 'shots/swiss-grid']]) {
  const pg = await b.newPage({ viewport: { width: 960, height: 540 }, deviceScaleFactor: 2 });
  const errs = []; pg.on('pageerror', e => errs.push(String(e)));
  await pg.goto('file://' + html + '?brand=' + brand, { waitUntil: 'load' });
  await pg.evaluate(() => window.__film.ready());
  const res = await pg.evaluate(() => {
    const out = { lint: {}, negative_control: {}, bench: {}, count_at: {}, stats: window.__film.stats() };
    for (const v of window.__film.info.variants) {
      out.lint[v] = window.__film.lint(v);
      const n = window.__film.lintWith(v, { sizeMode: 'own' }); out.negative_control[v] = { sizeMode: 'own', ok: n.ok, failures: n.failures, areaErrMax: n.areaErrMax };
      window.__film.bench(v); out.bench[v] = window.__film.bench(v);
      out.count_at[v] = [0, 4, 8, 12].map(t => Object.assign({ t }, window.__film.count(t, v)));
    }
    return out;
  });
  const f = resolve(here, dir, 'report.json'), rep = existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : {};
  Object.assign(rep, res, { verify_errors: errs });
  writeFileSync(f, JSON.stringify(rep, null, 1));
  console.log(brand, JSON.stringify(Object.fromEntries(Object.entries(res.lint).map(([k, v]) => [k, v.ok]))), JSON.stringify(Object.fromEntries(Object.entries(res.bench).map(([k, v]) => [k, +(v.mean_ms / 1000).toFixed(4)]))), errs.length, JSON.stringify(res.stats.fontNotes));
  await pg.close();
}
await b.close();
