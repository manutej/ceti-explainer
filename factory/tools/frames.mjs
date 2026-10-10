#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════
   factory/tools/frames.mjs · the frame strip an evaluator reads instead of film.js
   --------------------------------------------------------------------
   node factory/tools/frames.mjs <page.html | film-dir> [--every 0.5] [--out dir] [--brand id] [--per-row 12]

   Seeks the film (window.__film.seek, film mode ?film=1, 1920 x 1080 stage) every --every seconds from 0 to dur,
   writes a 480 x 270 thumbnail per time with the timestamp burned into the top-left corner
   (thumbs/t-0012.50.jpg), assembles them into contact strips of --per-row thumbnails (strip-01.png, strip-02.png …,
   one row each, timestamps in order), and frames.json:
     { page, film, dur, every, brand, axes, knobs, ms_per_frame, s_per_frame, purity: {...},
       frames: [{ t, file, strip, cell, caption, chapter }] }
   caption = the film.json caption live at t (text or null); chapter = the chapter id and title live at t.
   Purity: three times (0.2, 0.5, 0.8 of dur) are captured (canvas pixels + SVG), re-seeked after a detour and
   compared; frames.json records identical / DIFFERS (exit 1 when it differs).
   <film-dir> picks <film-dir>/build/<id>.<brand>.*.html (newest when several; --brand narrows it).
   --out default: <film-dir>/frames (a page in <film-dir>/build counts as that film's; else <page dir>/frames). s_per_frame is seek + render + GPU sync (headless,
   SwiftShader); the screenshot and thumbnail encode are not in it.
   ──────────────────────────────────────────────────────────────────── */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';

const EXE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const argv = process.argv.slice(2), opt = { every: 0.5, perRow: 12 }, pos = [];
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--every') opt.every = +argv[++i];
  else if (a === '--out') opt.out = argv[++i];
  else if (a === '--brand') opt.brand = argv[++i];
  else if (a === '--per-row') opt.perRow = +argv[++i];
  else if (a === '-h' || a === '--help') usage(0);
  else pos.push(a);
}
function usage(code) { console.log('usage: node factory/tools/frames.mjs <page.html | film-dir> [--every 0.5] [--out dir] [--brand id] [--per-row 12]'); process.exit(code); }
if (!pos[0] || !(opt.every > 0) || !(opt.perRow >= 1)) usage(2);

let PAGE = pos[0], FILMDIR = null;
if (fs.existsSync(PAGE) && fs.statSync(PAGE).isDirectory()) {
  FILMDIR = PAGE;
  const id = JSON.parse(fs.readFileSync(path.join(FILMDIR, 'film.json'), 'utf8')).id;
  const bdir = path.join(FILMDIR, 'build');
  const cands = (fs.existsSync(bdir) ? fs.readdirSync(bdir) : []).filter(f => f.endsWith('.html') && f.startsWith(id + '.') && (!opt.brand || f.startsWith(`${id}.${opt.brand}.`)))
    .map(f => path.join(bdir, f)).sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
  if (!cands.length) { console.error(`frames.mjs: no build/${id}.${opt.brand || '*'}.*.html in ${FILMDIR}; build it first`); process.exit(2); }
  PAGE = cands[0];
}
if (!fs.existsSync(PAGE)) { console.error('frames.mjs: no such page ' + PAGE); process.exit(2); }
if (!FILMDIR && path.basename(path.dirname(path.resolve(PAGE))) === 'build' && fs.existsSync(path.join(path.dirname(path.resolve(PAGE)), '..', 'film.json')))
  FILMDIR = path.join(path.dirname(path.resolve(PAGE)), '..');   // <film-dir>/build/<page>.html → <film-dir>/frames
const OUT = path.resolve(opt.out || path.join(FILMDIR || path.dirname(PAGE), 'frames'));
fs.mkdirSync(path.join(OUT, 'thumbs'), { recursive: true });
for (const f of fs.readdirSync(OUT)) if (/^strip-\d+\.png$/.test(f)) fs.unlinkSync(path.join(OUT, f));
for (const f of fs.readdirSync(path.join(OUT, 'thumbs'))) if (/^t-[\d.]+\.jpg$/.test(f)) fs.unlinkSync(path.join(OUT, 'thumbs', f));

const TW = 480, TH = 270;
const browser = await chromium.launch({ executablePath: EXE, args: ['--font-render-hinting=none', '--disable-gpu', '--no-first-run', '--disable-background-networking'] });
const errs = [];
try {
  // film mode at 1920 x 1080 CSS px, device scale 0.25: the stage screenshot is already 480 x 270
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 0.25 });
  const pg = await ctx.newPage();
  pg.on('pageerror', e => errs.push('pageerror: ' + String(e.message || e).slice(0, 200)));
  pg.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text().slice(0, 200)); });
  await pg.goto('file://' + path.resolve(PAGE) + '?film=1', { waitUntil: 'load', timeout: 60000 });
  await pg.waitForFunction(() => window.__film && typeof window.__film.ready === 'function', null, { timeout: 20000 });
  await pg.evaluate(() => window.__film.ready());
  const info = await pg.evaluate(() => { const i = window.__film.info || {};
    return { id: i.id, dur: +(i.dur ?? window.__ctrl?.duration), captions: i.captions || [], chapters: i.chapters || [], axes: i.axes || null, knobs: i.knobs || [] }; });
  const DUR = info.dur;
  const stage = pg.locator('#stage, .ex-stage-frame').first();
  const seekSync = (t) => pg.evaluate(async (t) => {   // seek, then force the GPU to finish (toDataURL syncs), then one rAF
    const r = window.__film.seek(t); const c = (window.KIT && window.KIT.canvas) || document.querySelector('#stage canvas');
    if (c && window.KIT && window.KIT.GL) { const g = window.KIT.gl; const px = new Uint8Array(4); g.readPixels(0, 0, 1, 1, g.RGBA, g.UNSIGNED_BYTE, px); }
    await new Promise(res => requestAnimationFrame(() => res())); return r; }, t);
  const capture = () => pg.evaluate(() => { const st = document.querySelector('#stage') || document.body;
    return { canvas: [...st.querySelectorAll('canvas')].map(c => { try { return c.toDataURL('image/png'); } catch (e) { return 'ERR'; } }).join('|'),
             svg: [...st.querySelectorAll('svg')].map(s => s.innerHTML).join('|') }; });
  const h = (s) => crypto.createHash('sha1').update(s).digest('hex').slice(0, 12);

  // helper page: burn the timestamp, encode thumbnails, assemble strips
  const helper = await browser.newPage();
  const burn = (b64, label) => helper.evaluate(async ([b64, label, TW, TH]) => {
    const bin = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    const bmp = await createImageBitmap(new Blob([bin], { type: 'image/png' }));
    const c = new OffscreenCanvas(TW, TH), x = c.getContext('2d'); x.drawImage(bmp, 0, 0, TW, TH);
    x.font = 'bold 15px monospace'; const w = x.measureText(label).width + 12;
    x.fillStyle = 'rgba(0,0,0,0.72)'; x.fillRect(0, 0, w, 22); x.fillStyle = '#FFE14D'; x.textBaseline = 'middle'; x.fillText(label, 6, 11.5);
    const blob = await c.convertToBlob({ type: 'image/jpeg', quality: 0.86 }); const u8 = new Uint8Array(await blob.arrayBuffer());
    let s = ''; for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode(...u8.subarray(i, i + 0x8000)); return btoa(s);
  }, [b64, label, TW, TH]);
  const strip = (list) => helper.evaluate(async ([list, TW, TH, per]) => {
    const c = new OffscreenCanvas(TW * per, TH), x = c.getContext('2d'); x.fillStyle = '#000'; x.fillRect(0, 0, c.width, c.height);
    for (let i = 0; i < list.length; i++) {
      const bin = Uint8Array.from(atob(list[i]), ch => ch.charCodeAt(0));
      x.drawImage(await createImageBitmap(new Blob([bin], { type: 'image/jpeg' })), i * TW, 0, TW, TH);
      if (i) { x.fillStyle = '#000'; x.fillRect(i * TW - 1, 0, 2, TH); }
    }
    const u8 = new Uint8Array(await (await c.convertToBlob({ type: 'image/png' })).arrayBuffer());
    let s = ''; for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode(...u8.subarray(i, i + 0x8000)); return btoa(s);
  }, [list, TW, TH, opt.perRow]);

  const capAt = (t) => { const c = info.captions.find(c => t >= +c[0] && t < +c[1]); return c ? String(c[2]) : null; };
  const chapAt = (t) => { let c = null; for (const x of info.chapters) if (t >= +(x.t0 ?? 0)) c = x; return c ? { id: c.id, title: c.title || '' } : null; };
  const fmtT = (t) => { const m = Math.floor(t / 60), s = t - 60 * m; return `${m}:${s.toFixed(1).padStart(4, '0')}`; };

  const times = []; for (let k = 0; ; k++) { const t = +(k * opt.every).toFixed(3); if (t > DUR + 1e-9) break; times.push(Math.min(t, +(DUR - 0.01).toFixed(3))); }
  const frames = [], thumbs = []; let seekMs = 0;
  for (const [i, t] of times.entries()) {
    const a = Date.now(); const r = await seekSync(t); seekMs += Date.now() - a;
    if (r && r.error) errs.push(`seek ${t}: ${r.error}`);
    const png = await stage.screenshot({ type: 'png' });
    const jpg = await burn(png.toString('base64'), fmtT(t) + '  ' + t.toFixed(2) + ' s');
    const file = `thumbs/t-${t.toFixed(2).padStart(7, '0')}.jpg`;
    fs.writeFileSync(path.join(OUT, file), Buffer.from(jpg, 'base64'));
    thumbs.push(jpg);
    frames.push({ t, file, strip: `strip-${String(Math.floor(i / opt.perRow) + 1).padStart(2, '0')}.png`, cell: i % opt.perRow, caption: capAt(t), chapter: chapAt(t) });
  }
  for (let s = 0; s * opt.perRow < thumbs.length; s++) {
    const b64 = await strip(thumbs.slice(s * opt.perRow, (s + 1) * opt.perRow));
    fs.writeFileSync(path.join(OUT, `strip-${String(s + 1).padStart(2, '0')}.png`), Buffer.from(b64, 'base64'));
  }

  // purity: three times, re-seeked after a detour
  const pts = [0.2, 0.5, 0.8].map(f => +(DUR * f).toFixed(2)), pur = {};
  for (const [i, t] of pts.entries()) {
    await seekSync(t); const A = await capture();
    await seekSync(pts[(i + 1) % 3]); await seekSync(t); const B = await capture();
    pur[t] = { canvas: h(A.canvas) === h(B.canvas) ? 'identical' : 'DIFFERS', svg: h(A.svg) === h(B.svg) ? 'identical' : 'DIFFERS' };
  }
  const pure = Object.values(pur).every(x => x.canvas === 'identical' && x.svg === 'identical');
  const msf = seekMs / Math.max(1, frames.length);
  const brand = opt.brand || info.axes?.brand || null;
  const report = { page: path.relative(process.cwd(), path.resolve(PAGE)), film: info.id, dur: DUR, every: opt.every, per_row: opt.perRow, brand,
    axes: info.axes, knobs: info.knobs, ms_per_frame: Math.round(msf), s_per_frame: +(msf / 1000).toFixed(3),
    purity: { pass: pure, at: pur }, errors: errs, strips: [...new Set(frames.map(f => f.strip))], frames };
  fs.writeFileSync(path.join(OUT, 'frames.json'), JSON.stringify(report, null, 1));
  console.log(`frames ${info.id}: ${frames.length} frames every ${opt.every} s → ${report.strips.length} strip(s) in ${path.relative(process.cwd(), OUT)}; ` +
    `${report.s_per_frame} s/frame; purity ${pure ? 'identical' : 'DIFFERS'} at ${pts.join(', ')} s; errors ${errs.length}`);
  await browser.close();
  process.exit(pure && !errs.length ? 0 : 1);
} catch (e) {
  console.error('frames.mjs: ' + String(e.message || e).split('\n')[0]);
  try { await browser.close(); } catch (_) { /* ignore */ }
  process.exit(1);
}
