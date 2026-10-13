// shoot.mjs <demo.html> [--out dir] [--times 0,0.33,0.67,1] [--query brand=swiss-grid]: render every variant at fractions of its duration,
// check re-seek purity on the canvas, write stills, a contact sheet (via Pillow if available) and report.json.
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { execSync } from 'node:child_process';
const args = process.argv.slice(2); const html = resolve(args[0]);
const out = resolve(args.includes('--out') ? args[args.indexOf('--out') + 1] : dirname(html) + '/shots');
const fr = (args.includes('--times') ? args[args.indexOf('--times') + 1] : '0,0.33,0.67,1').split(',').map(Number);
const qs = args.includes('--query') ? '?' + args[args.indexOf('--query') + 1].replace(/^\?/, '') : '';   // e.g. brand=swiss-grid
mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const pg = await b.newPage({ viewport: { width: 960, height: 540 }, deviceScaleFactor: 2 });
const errs = []; pg.on('console', m => m.type() === 'error' && errs.push(m.text())); pg.on('pageerror', e => errs.push(String(e)));
await pg.goto('file://' + html + qs, { waitUntil: 'load' });
await pg.evaluate(() => window.__film.ready());
const info = await pg.evaluate(() => window.__film.info);
const variants = info.variants || ['default']; const dur = info.dur || 4;
const report = { html, errors: errs, variants: {}, ms_per_frame: null };
const files = []; let frames = 0, ms = 0;
for (const v of variants) {
  report.variants[v] = { stills: [], purity: 'n/a' };
  for (const f of fr) {
    const t = +(f * dur).toFixed(3); const t0 = Date.now();
    await pg.evaluate(([v, t]) => window.__film.seek(t, v), [v, t]); ms += Date.now() - t0; frames++;
    const fn = `${out}/${v}-t${t.toFixed(2)}.png`; await pg.locator('canvas').first().screenshot({ path: fn }); files.push(fn);
    report.variants[v].stills.push(fn);
  }
  const tm = +(0.5 * dur).toFixed(3);
  const a = await pg.evaluate(([v, t]) => { window.__film.seek(t, v); return document.querySelector('canvas').toDataURL(); }, [v, tm]);
  await pg.evaluate(([v]) => window.__film.seek(0, v), [v]);
  const c = await pg.evaluate(([v, t]) => { window.__film.seek(t, v); return document.querySelector('canvas').toDataURL(); }, [v, tm]);
  report.variants[v].purity = a === c ? 'identical' : 'DIFF';
}
report.ms_per_frame = +(ms / frames).toFixed(1); report.errors = errs;
await b.close();
try { execSync(`python3 - <<'PY'\nfrom PIL import Image\nimport json,math\nfiles=${JSON.stringify(files)}\nims=[Image.open(f) for f in files]\ncols=${fr.length}; rows=math.ceil(len(ims)/cols); w,h=ims[0].size; s=0.5\nsheet=Image.new('RGB',(int(w*s)*cols,int(h*s)*rows),'white')\nfor i,im in enumerate(ims): sheet.paste(im.resize((int(w*s),int(h*s))),((i%cols)*int(w*s),(i//cols)*int(h*s)))\nsheet.save('${out}/contact.png')\nPY`); report.contact = `${out}/contact.png`; } catch (e) { report.contact_error = String(e).slice(0, 200); }
writeFileSync(`${out}/report.json`, JSON.stringify(report, null, 1));
console.log(JSON.stringify({ errors: errs.length, variants: Object.fromEntries(Object.entries(report.variants).map(([k, v]) => [k, v.purity])), ms_per_frame: report.ms_per_frame, contact: report.contact || null }));
process.exit(errs.length ? 1 : 0);
