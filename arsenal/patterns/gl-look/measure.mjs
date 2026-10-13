// measure.mjs [--variant boxes-hero] [--t 9] [--n 5] [--out shots/cost-<variant>.json]
// s/frame (1920x1080 = 960x540 x dsf 2, SwiftShader, seek incl. a 1-px readPixels sync, median of n) for the stock ink picture, the bare look
// (HDR frame + tone map only), each block alone over bare, the full look, and the full look minus each block.
// Two numbers per row: wall s/frame (median, min) and CPU-s/frame of the browser's process tree (utime + stime from /proc: software GL is CPU work, and this
// number does not inflate when other jobs share the 4 cores; wall does). On the idle 4-core host wall is about CPU / 3 to CPU / 4.
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
import { writeFileSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const a = process.argv.slice(2), arg = (k, d) => (a.includes(k) ? a[a.indexOf(k) + 1] : d);
const variant = arg('--variant', 'boxes-hero'), t = +arg('--t', 9), n = +arg('--n', 5);
const dir = dirname(fileURLToPath(import.meta.url)), out = resolve(arg('--out', `${dir}/shots/cost-${variant}.json`));
const B = ['floor', 'rig', 'rim', 'ao', 'shadow', 'grain', 'bloom'];
const spec = (on) => 'blocks=' + B.map((k) => `${k}:${on.includes(k) ? 1 : 0}`).join(',');
const cfg = [['ink (exec, stock picture)', `variant=${variant.replace('hero', 'ink')}`], ['bare look (HDR + tone map)', `variant=${variant}&${spec([])}`]];
for (const k of B) cfg.push([`+ ${k} only`, `variant=${variant}&${spec([k])}`]);
cfg.push(['full look', `variant=${variant}&${spec(B)}`]);
for (const k of B) cfg.push([`full - ${k}`, `variant=${variant}&${spec(B.filter((x) => x !== k))}`]);
function cpu(root) {   // CPU seconds (user + system) of root and all its descendants
  const ch = new Map(), st = new Map();
  for (const d of readdirSync('/proc').filter((x) => /^\d+$/.test(x))) {
    try { const t = readFileSync(`/proc/${d}/stat`, 'utf8'), r = t.slice(t.lastIndexOf(')') + 2).split(' '); const pp = +r[1]; st.set(+d, (+r[11] + +r[12]) / 100); (ch.get(pp) || ch.set(pp, []).get(pp)).push(+d); } catch {}
  }
  let sum = 0; const q = [...(ch.get(root) || [])]; while (q.length) { const x = q.pop(); sum += st.get(x) || 0; q.push(...(ch.get(x) || [])); } return sum;
}
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const rows = [];
for (const [name, q] of cfg) {
  const pg = await b.newPage({ viewport: { width: 960, height: 540 }, deviceScaleFactor: 2 });
  await pg.goto('file://' + dir + '/demo.html?' + q, { waitUntil: 'load' }); await pg.evaluate(() => window.__film.ready());
  const v = new URLSearchParams(q).get('variant'); await pg.evaluate(([v, t]) => window.__film.seek(t, v), [v, t]);   // warm-up (compiles, uploads)
  const ms = [], c0 = cpu(process.pid);
  for (let i = 0; i < n; i++) { const t0 = Date.now(); await pg.evaluate(([v, t, i]) => window.__film.seek(t + i * 0.01, v), [v, t, i]); ms.push(Date.now() - t0); }
  const c = (cpu(process.pid) - c0) / n; ms.sort((x, y) => x - y);
  rows.push({ name, median: ms[n >> 1] / 1000, min: ms[0] / 1000, cpu: c }); console.log(name.padEnd(30), 'wall', (ms[n >> 1] / 1000).toFixed(2), `(min ${(ms[0] / 1000).toFixed(2)})`, ' cpu', c.toFixed(2));
  await pg.close();
}
await b.close(); mkdirSync(dirname(out), { recursive: true }); writeFileSync(out, JSON.stringify({ variant, t, n, rows }, null, 1));
