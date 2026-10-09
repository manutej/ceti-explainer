#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════════
   factory/tools/gate.mjs · the gate for "the 75-second case" films
   --------------------------------------------------------------------
   node factory/tools/gate.mjs <built-page.html> --film <film-dir>
        [--json out.json] [--shots dir] [--kit file.js|dir ...] [--quick]

   Rows G1..G10 (see factory/tools/README.md). Each row is PASS, FAIL, WARN
   or SKIP with evidence. Exit 1 if any row FAILs (WARN and SKIP do not).
   Hook contract (films/opera-house/page.js): ?film=1 strips the page to the
   bare 1920x1080 stage; window.__film {ready, seek, only, info};
   window.__ctrl {play, pause, seek, setState, state}.
   ──────────────────────────────────────────────────────────────────── */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';

const EXE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const BEATS = ['HOOK', 'COMMIT', 'CASE', 'COUNT', 'MONDAY'];
const W = 960, H = 540;

/* ── args ── */
const argv = process.argv.slice(2);
const opt = { kit: [] };
const pos = [];
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--film') opt.film = argv[++i];
  else if (a === '--json') opt.json = argv[++i];
  else if (a === '--shots') opt.shots = argv[++i];
  else if (a === '--kit') opt.kit.push(argv[++i]);
  else if (a === '--quick') opt.quick = true;
  else if (a === '-h' || a === '--help') { usage(0); }
  else pos.push(a);
}
function usage(code) {
  console.log('usage: node factory/tools/gate.mjs <built-page.html> --film <film-dir> [--json out.json] [--shots dir] [--kit file.js|dir ...]');
  process.exit(code);
}
const PAGE = pos[0];
if (!PAGE || !opt.film) usage(2);
if (!fs.existsSync(PAGE)) { console.error('no such page: ' + PAGE); process.exit(2); }
const FILMDIR = opt.film;
const URL0 = 'file://' + path.resolve(PAGE);

/* ── rows ── */
const rows = [];
const row = (id, name, status, evidence, data) => { rows.push({ id, name, status, evidence, ...(data ? { data } : {}) }); };
const pf = (ok) => ok ? 'PASS' : 'FAIL';
const sha = (s) => crypto.createHash('sha1').update(s).digest('hex').slice(0, 12);
const r2 = (x) => Math.round(x * 100) / 100;
const readJSON = (p) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { return e.code === 'ENOENT' ? undefined : { __error: String(e.message) }; } };

let film = readJSON(path.join(FILMDIR, 'film.json'));
const claimsRaw = readJSON(path.join(FILMDIR, 'claims.json'));
const filmJsPath = path.join(FILMDIR, 'film.js');
const html = fs.readFileSync(PAGE, 'utf8');

/* ── helpers on film.json (tolerant of the old opera-house schema) ── */
function capList(f) {
  return (f?.captions || []).map(c => Array.isArray(c) ? { t0: +c[0], t1: +c[1], text: String(c[2] ?? '') }
    : { t0: +(c.t0 ?? c.t ?? c.at ?? 0), t1: +(c.t1 ?? c.end ?? 0), text: String(c.text ?? c.s ?? '') });
}
function beatOf(c) {
  const keys = [c.beat, c.id, c.name, c.title].filter(Boolean).map(s => String(s).toUpperCase());
  for (const k of keys) for (const b of BEATS) if (k === b || new RegExp('(^|[^A-Z])' + b + '([^A-Z]|$)').test(k)) return b;
  return null;
}
const chT0 = (c) => +(c.t0 ?? c.t ?? c.at ?? 0);
const chT1 = (c) => +(c.t1 ?? c.end ?? NaN);

/* ═════════════ G3 clock scan (static; no browser) ═════════════ */
const BANNED = [
  [/Math\s*\.\s*random/, 'Math.random'], [/\bnew\s+Date\b|\bDate\s*\.\s*now|\bDate\s*\(/, 'Date'],
  [/performance\s*\.\s*now/, 'performance.now'], [/\bframeCount\b/, 'frameCount'], [/\bmillis\s*\(/, 'millis()'],
  [/\brequestAnimationFrame\b/, 'requestAnimationFrame'], [/\bdeltaTime\b/, 'deltaTime'], [/\bp\s*\.\s*random(Gaussian)?\s*\(/, 'p.random'],
];
const PLAYER_OK = new Set(['Date', 'performance.now', 'requestAnimationFrame']);
function blankComments(src) {   // keep line numbers: replace comment bodies with spaces, keep newlines
  let out = '', i = 0, q = null;
  while (i < src.length) {
    const c = src[i], d = src[i + 1];
    if (q) { out += c; if (c === '\\') { out += d ?? ''; i += 2; continue; } if (c === q) q = null; i++; continue; }
    if (c === '"' || c === "'" || c === '`') { q = c; out += c; i++; continue; }
    if (c === '/' && d === '*') { const e = src.indexOf('*/', i + 2); const end = e < 0 ? src.length : e + 2; out += src.slice(i, end).replace(/[^\n]/g, ' '); i = end; continue; }
    if (c === '/' && d === '/') { const e = src.indexOf('\n', i); const end = e < 0 ? src.length : e; out += ' '.repeat(end - i); i = end; continue; }
    out += c; i++;
  }
  return out;
}
function clockScan(file, isPlayer) {
  const src = blankComments(fs.readFileSync(file, 'utf8'));
  const hits = [];
  src.split('\n').forEach((line, i) => {
    for (const [rx, name] of BANNED) {
      if (isPlayer && PLAYER_OK.has(name)) continue;
      if (rx.test(line)) hits.push(`${path.basename(file)}:${i + 1} ${name}`);
    }
  });
  return hits;
}
{
  const files = [];
  if (fs.existsSync(filmJsPath)) files.push([filmJsPath, false]);
  // kit2 film.json libs (inlined between kit2.js and film.js): scanned like film.js
  const ROOT_ = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..');
  for (const rel of (film && Array.isArray(film.libs) ? film.libs : [])) {
    const hit = [path.join(FILMDIR, rel), path.join(ROOT_, rel)].find(f => fs.existsSync(f));
    if (hit) files.push([hit, false]); else row('G3', 'clock scan', 'WARN', `film.json libs ${rel} not found`);
  }
  const kitFiles = [];
  for (const k of opt.kit) {
    if (!fs.existsSync(k)) { row('G3', 'clock scan', 'WARN', `--kit ${k} not found`); continue; }
    if (fs.statSync(k).isDirectory()) { for (const f of fs.readdirSync(k)) if (/\.js$/.test(f)) kitFiles.push(path.join(k, f)); }
    else kitFiles.push(k);
  }
  for (const k of kitFiles) files.push([k, /player/i.test(path.basename(k))]);
  if (!files.length) row('G3', 'clock scan', 'SKIP', `no film.js in ${FILMDIR}`);
  else {
    const hits = files.flatMap(([f, p]) => clockScan(f, p));
    row('G3', 'clock scan', pf(!hits.length),
      hits.length ? `${hits.length} hit(s): ${hits.slice(0, 8).join('; ')}${hits.length > 8 ? ' …' : ''}`
                  : `clean: ${files.map(([f, p]) => path.basename(f) + (p ? ' (player: rAF/Date/perf allowed)' : '')).join(', ')}`, { hits });
  }
}

/* ═════════════ G8 size (static) ═════════════ */
{
  const parts = ['film.js', 'film.json', 'claims.json'].map(n => [n, fs.existsSync(path.join(FILMDIR, n)) ? fs.statSync(path.join(FILMDIR, n)).size : 0]);
  const code = parts.reduce((a, [, s]) => a + s, 0), page = fs.statSync(PAGE).size;
  const ok = code < 120 * 1024 && page < 1.3e6;
  row('G8', 'size', pf(ok), `film code ${(code / 1024).toFixed(1)} KB (${parts.map(([n, s]) => n + ' ' + (s / 1024).toFixed(1)).join(', ')}) < 120 KB; page ${(page / 1e6).toFixed(3)} MB < 1.3 MB`,
    { code, page });
}

/* ═════════════ browser rows ═════════════ */
const browser = await chromium.launch({ executablePath: EXE, args: ['--font-render-hinting=none', '--disable-gpu', '--no-first-run', '--disable-background-networking', '--disable-component-update', '--disable-sync', '--disable-default-apps'] });
const helper = await browser.newPage();            // decodes PNGs for pixel statistics
async function pngStats(buf) {
  return helper.evaluate(async (b64) => {
    const bin = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    const bmp = await createImageBitmap(new Blob([bin], { type: 'image/png' }));
    const c = new OffscreenCanvas(192, 108), x = c.getContext('2d');
    x.drawImage(bmp, 0, 0, 192, 108);
    const d = x.getImageData(0, 0, 192, 108).data; let s = 0, s2 = 0; const n = d.length / 4;
    for (let i = 0; i < d.length; i += 4) { const l = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]; s += l; s2 += l * l; }
    const m = s / n; return { mean: m, sd: Math.sqrt(Math.max(0, s2 / n - m * m)) };
  }, buf.toString('base64'));
}
const BLANK_SD = 2.0;

function watch(pg, sink) {
  pg.on('pageerror', e => sink.push('pageerror: ' + String(e.message || e).slice(0, 200)));
  pg.on('console', m => { if (m.type() === 'error') sink.push('console: ' + m.text().slice(0, 200)); });
}

/* ── film mode ── */
const filmErrs = [];
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
const pg = await ctx.newPage(); watch(pg, filmErrs);
let readyMs = null, bootErr = null, info = null;
const t0 = Date.now();
try {
  await pg.goto(URL0 + '?film=1', { waitUntil: 'load', timeout: 30000 });
  await pg.waitForFunction(() => window.__film && typeof window.__film.ready === 'function', null, { timeout: 15000 });
  await pg.evaluate(() => window.__film.ready());
  readyMs = Date.now() - t0;
} catch (e) { bootErr = String(e.message || e).split('\n')[0]; }

if (bootErr) {
  row('G1', 'load', 'FAIL', 'film mode did not boot: ' + bootErr + (filmErrs.length ? '; ' + filmErrs.slice(0, 3).join('; ') : ''));
  await finish();
}

info = await pg.evaluate(() => { const i = window.__film.info || {}; return { id: i.id, dur: +(i.dur ?? i.duration ?? window.__ctrl?.duration), FILM: window.FILM || null, axes: i.axes || null }; });
if (!film) film = info.FILM || {};
if (film.__error) { row('G4', 'format', 'FAIL', 'film.json does not parse: ' + film.__error); film = info.FILM || {}; }
const DUR = +(info.dur || film.dur || film.duration);
const CAPS = capList(film);

const stageSel = await pg.evaluate(() => ['#stage', '.ex-stage-frame', '[data-stage]'].find(s => document.querySelector(s)) || 'body');
const stage = pg.locator(stageSel).first();
await pg.evaluate((sel) => {
  const st = document.querySelector(sel);
  window.__gate = {
    async seek(t) { const r = await window.__film.seek(t); await new Promise(r => requestAnimationFrame(() => r())); return r; },
    fnv(u8) { let h = 0x811c9dc5; for (let i = 0; i < u8.length; i += 1) { h ^= u8[i]; h = Math.imul(h, 0x01000193); } return (h >>> 0).toString(16); },
    state() {
      const cs = [...st.querySelectorAll('canvas')];
      const canvas = cs.map(c => { try { return c.toDataURL('image/png'); } catch (e) { return 'ERR ' + e; } });
      const svg = [...st.querySelectorAll('svg')].filter(s => !s.parentElement.closest('svg')).map(s => s.innerHTML);
      return { canvas, svg };
    },
    texts() {
      const svgs = [...st.querySelectorAll('svg')].filter(s => !s.parentElement.closest('svg'));
      const root = svgs.sort((a, b) => b.getBoundingClientRect().width - a.getBoundingClientRect().width)[0];
      if (!root) return [];
      const vb = root.viewBox && root.viewBox.baseVal && root.viewBox.baseVal.width ? root.viewBox.baseVal : { x: 0, y: 0, width: 960, height: 540 };
      const k = 960 / vb.width, inv = root.getScreenCTM().inverse(), out = [];
      for (const el of root.querySelectorAll('text')) {
        const s = (el.textContent || '').replace(/\s+/g, ' ').trim(); if (!s) continue;
        if (el.checkVisibility && !el.checkVisibility({ visibilityProperty: true })) continue;
        let op = 1; for (let n = el; n && n !== root; n = n.parentElement) { const c = getComputedStyle(n); if (c.display === 'none') { op = 0; break; } op *= parseFloat(c.opacity); }
        const cs = getComputedStyle(el); op *= parseFloat(cs.fillOpacity || 1);
        if (!(op > 0.3)) continue;
        const M = inv.multiply(el.getScreenCTM()), sc = Math.sqrt(Math.abs(M.a * M.d - M.b * M.c));
        let bb; try { bb = el.getBBox(); } catch (e) { continue; }
        const P = (x, y) => ({ x: (M.a * x + M.c * y + M.e - vb.x) * k, y: (M.b * x + M.d * y + M.f - vb.y) * k });
        const ps = [P(bb.x, bb.y), P(bb.x + bb.width, bb.y), P(bb.x, bb.y + bb.height), P(bb.x + bb.width, bb.y + bb.height)];
        const cx = ps.reduce((a, p) => a + p.x, 0) / 4, cy = ps.reduce((a, p) => a + p.y, 0) / 4;
        if (cx < 0 || cx > 960 || cy < 0 || cy > 540) continue;
        const roleEl = el.closest('[data-role]'), layerEl = el.closest('[data-layer]');
        out.push({ s, size: Math.round(parseFloat(cs.fontSize) * sc * k * 100) / 100, op: Math.round(op * 100) / 100,
          role: roleEl ? roleEl.getAttribute('data-role') : null, layer: layerEl ? layerEl.getAttribute('data-layer') : null });
      }
      return out;
    },
  };
}, stageSel);
const seek = (t) => pg.evaluate((t) => window.__gate.seek(t), t);
async function capState() {
  const s = await pg.evaluate(() => window.__gate.state());
  return { canvas: sha(s.canvas.join('|')), svg: sha(s.svg.join('|')), svgRaw: s.svg.join('|'), nCanvas: s.canvas.length, nSvg: s.svg.length };
}
const shotStage = () => stage.screenshot({ type: 'png' });

/* ═════════════ G1 load ═════════════ */
{
  const charset = /<meta\s+charset\s*=\s*["']?utf-8/i.test(html.slice(0, 2048));
  const samples = [DUR * 0.2, DUR * 0.5, DUR * 0.8];
  const stats = [];
  for (const t of samples) { await seek(t); stats.push({ t: r2(t), ...(await pngStats(await shotStage())) }); }
  const blank = stats.filter(s => s.sd < BLANK_SD);
  // live mode
  const liveErrs = [];
  const lp = await browser.newPage({ viewport: { width: 1280, height: 900 } }); watch(lp, liveErrs);
  let liveOk = true;
  try {
    await lp.goto(URL0, { waitUntil: 'load', timeout: 30000 });
    await lp.waitForFunction(() => window.__film && window.__ctrl, null, { timeout: 15000 });
    await lp.evaluate(() => window.__film.ready());
    await lp.evaluate((d) => { window.__ctrl.seek(d * 0.3); window.__ctrl.seek(d * 0.7); }, DUR);
    await lp.waitForTimeout(300);
  } catch (e) { liveOk = false; liveErrs.push('boot: ' + String(e.message).split('\n')[0]); }
  await lp.close();
  const ok = !filmErrs.length && !liveErrs.length && charset && readyMs < 5000 && !blank.length && liveOk;
  row('G1', 'load', pf(ok),
    [`film errors ${filmErrs.length}`, `live errors ${liveErrs.length}`, `charset ${charset ? 'utf-8' : 'MISSING'}`, `ready ${readyMs} ms`,
     `stage sd ${stats.map(s => s.t + 's:' + s.sd.toFixed(1)).join(' ')}${blank.length ? ' BLANK' : ''}`,
     ...filmErrs.slice(0, 2), ...liveErrs.slice(0, 2)].join('; '), { readyMs, stats, filmErrs, liveErrs });
}

/* ═════════════ G2 purity ═════════════ */
{
  const fr = [0.1, 0.3, 0.5, 0.7, 0.9], ts = fr.map(f => r2(DUR * f));
  const base = {}, badC = [], badS = []; let diffNote = '';
  for (let i = 0; i < ts.length; i++) {
    const t = ts[i];
    await seek(t); const a = await capState(); base[t] = a;
    await seek(ts[(i + 2) % ts.length]); await seek(t); const b = await capState();
    if (a.canvas !== b.canvas) badC.push(t);
    if (a.svg !== b.svg) { badS.push(t); if (!diffNote) diffNote = firstDiff(a.svgRaw, b.svgRaw); }
  }
  // order independence: A→B equals B→A (reach B from A, reach A from B; compare with the base captures)
  const pairs = [[ts[0], ts[3]], [ts[1], ts[4]]], ordC = [], ordS = [];
  for (const [A, B] of pairs) {
    await seek(A); await seek(B); const b1 = await capState();
    await seek(B); await seek(A); const a2 = await capState();
    if (b1.canvas !== base[B].canvas || a2.canvas !== base[A].canvas) ordC.push(`${A}↔${B}`);
    if (b1.svg !== base[B].svg || a2.svg !== base[A].svg) { ordS.push(`${A}↔${B}`); if (!diffNote) diffNote = firstDiff(base[B].svgRaw, b1.svgRaw); }
  }
  const nC = base[ts[0]].nCanvas, nS = base[ts[0]].nSvg;
  row('G2a', 'purity · canvas', nC ? pf(!badC.length && !ordC.length) : 'SKIP',
    nC ? `${nC} canvas; re-seek at ${ts.join(', ')} ${badC.length ? 'DIFFERS at ' + badC.join(', ') : 'identical'}; order ${ordC.length ? 'DIFFERS ' + ordC.join(', ') : 'A→B = B→A (2 pairs)'}` : 'no canvas on the stage');
  row('G2b', 'purity · SVG', nS ? pf(!badS.length && !ordS.length) : 'SKIP',
    nS ? `${nS} svg; re-seek ${badS.length ? 'DIFFERS at ' + badS.join(', ') : 'identical'}; order ${ordS.length ? 'DIFFERS ' + ordS.join(', ') : 'identical (2 pairs)'}${diffNote ? '; first diff ' + diffNote : ''}` : 'no svg on the stage',
    { badS, ordS, diffNote });
}
function firstDiff(a, b) {
  let i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++;
  const cut = (s) => JSON.stringify(s.slice(Math.max(0, i - 50), i + 50));
  return `@${i}: ${cut(a)} vs ${cut(b)}`;
}

/* ═════════════ text timeline (feeds G5 on-screen digits, G7) ═════════════ */
const STEP = opt.quick ? 1.0 : (DUR <= 100 ? 0.5 : 1.0);
const timeline = [];   // {t, texts:[s]}
for (let t = 0; t <= DUR + 1e-6; t += STEP) {
  await seek(Math.min(t, DUR));
  const tx = await pg.evaluate(() => window.__gate.texts());
  timeline.push({ t: r2(t), texts: tx.map(x => x.s) });
}

/* ═════════════ G4 format ═════════════ */
{
  const chs = film.chapters || [];
  const tagged = chs.map(c => ({ c, b: beatOf(c) })).filter(x => x.b);
  const brandDur = +(film.brand?.dur ?? film.brand?.duration ?? (film.brand?.at != null ? DUR - film.brand.at : 3));
  const material = film.brand ? DUR - brandDur : DUR;
  // format 'smoke' (infrastructure tests only, e.g. factory/kit2/smoke-webgl; never shipped): 5-20 s of material
  const fmt = film.format === 'feature' ? { lo: 90, hi: 120, cap: 123 } : film.format === 'smoke' ? { lo: 5, hi: 20, cap: 25 } : { lo: 60, hi: 75, cap: 78 };
  row('G4a', 'format · duration', pf(material >= fmt.lo && material <= fmt.hi && DUR <= fmt.cap),
    `total ${r2(DUR)} s; material ${r2(material)} s (want ${fmt.lo}–${fmt.hi}, format ${film.format || 'case'}) + brand ${film.brand ? brandDur + ' s' : 'none'}; total ≤ ${fmt.cap}`);
  if (!tagged.length) row('G4b', 'format · five beats', 'SKIP', `no chapter carries a beat id/name (${chs.length} chapters: ${chs.slice(0, 4).map(c => c.id + ' ' + (c.title || '')).join(', ')}…); legacy schema`);
  else {
    const seq = tagged.map(x => x.b).filter((b, i, a) => i === 0 || a[i - 1] !== b);
    const okOrder = JSON.stringify(seq) === JSON.stringify(BEATS);
    const okTime = tagged.every((x, i) => i === 0 || chT0(x.c) >= chT0(tagged[i - 1].c));
    row('G4b', 'format · five beats', pf(okOrder && okTime), `order ${seq.join(' → ')}${okOrder ? '' : ' (want ' + BEATS.join(' → ') + ')'}; t0 ${tagged.map(x => x.b[0] + chT0(x.c)).join(' ')}${okTime ? '' : ' NOT ascending'}`);
  }
  const commitCh = tagged.find(x => x.b === 'COMMIT');
  const commitAt = film.commit?.at ?? film.T?.commit ?? film.T?.ask ?? (commitCh ? chT0(commitCh.c) : null);
  if (commitAt == null) row('G4c', 'format · commit time', 'SKIP', 'no film.commit.at, T.commit/T.ask or COMMIT chapter');
  else row('G4c', 'format · commit time', pf(commitAt >= 8 && commitAt <= 16), `commit at ${commitAt} s (want 8–16)` + (film.commit?.default != null || film.defaultGuess != null || film.defaultDate != null ? `; film-mode default ${film.commit?.default ?? film.defaultGuess ?? film.defaultDate}` : '; no film-mode default guess'));
  if (!film.brand) row('G4d', 'format · brand card', 'FAIL', 'film.json.brand missing (decision Q8: 3 s CETI card with the one-line takeaway)');
  else {
    await seek(DUR - 1); const st = await pngStats(await shotStage());
    const tk = String(film.brand.takeaway || '').trim();
    const seen = timeline.filter(x => x.t >= DUR - brandDur - 1e-6).some(x => x.texts.some(s => tk && s.includes(tk.slice(0, Math.min(24, tk.length)))));
    row('G4d', 'format · brand card', pf(!!tk && st.sd >= BLANK_SD), `takeaway "${tk.slice(0, 60)}"; frame at ${r2(DUR - 1)} s sd ${st.sd.toFixed(1)}${st.sd < BLANK_SD ? ' BLANK' : ''}; takeaway text ${seen ? 'visible in SVG' : 'not found in SVG text (may be canvas)'}`);
  }
  const honest = film.honest ?? film.limits ?? film.honesty ?? film.honestLimits;
  const honestS = Array.isArray(honest) ? honest.join(' ') : String(honest || '');
  row('G4e', 'format · honest line', honestS.trim() ? 'PASS' : (film.chapters && !tagged.length ? 'SKIP' : 'FAIL'),
    honestS.trim() ? `"${honestS.slice(0, 80)}"` : 'no film.json.honest / limits' + (film.chapters && !tagged.length ? ' (legacy schema)' : ''));
  const src = film.sources || [];
  row('G4f', 'format · sources', pf(src.length >= 3), `${src.length} sources (want ≥ 3)`);
}

/* ═════════════ G5 claims ═════════════ */
const numRx = /(?<![\w.])[$£€]?\d{1,3}(?:,\d{3})+(?:\.\d+)?|(?<![\w.:])[$£€]?\d+(?:\.\d+)?/g;
function numbersIn(s, renders) {
  let t = s;
  for (const r of renders) if (r) t = t.split(r).join(' ');
  t = t.replace(/\b\d{1,2}:\d{2}\b/g, ' ');                                       // clock times
  const out = [];
  for (const m of t.matchAll(numRx)) {
    const raw = m[0], v = parseFloat(raw.replace(/[$£€,]/g, ''));
    if (/^\d{4}$/.test(raw) && v >= 1800 && v <= 2100) continue;                   // years
    out.push({ raw, v, dec: (raw.split('.')[1] || '').length });
  }
  return out;
}
function covered(n, vals) {
  const tol = 0.5 * Math.pow(10, -n.dec) + 1e-9;
  return vals.map(Math.abs).some(v => Math.abs(n.v - v) <= tol || Math.abs(n.v - v * 100) <= tol || Math.abs(n.v - v / 1e6) <= tol || Math.abs(n.v - v / 1e3) <= tol);
}
let claims = null;
if (claimsRaw === undefined) row('G5', 'claims', 'SKIP', `no ${path.join(FILMDIR, 'claims.json')} (legacy schema); ${CAPS.length} captions unchecked`);
else if (claimsRaw.__error || !(Array.isArray(claimsRaw) || Array.isArray(claimsRaw.claims))) row('G5', 'claims', 'FAIL', 'claims.json is neither an array nor {claims: [...]}: ' + (claimsRaw.__error || typeof claimsRaw));
else {
  claims = Array.isArray(claimsRaw) ? claimsRaw : claimsRaw.claims;
  // formula scope: claim values by id, then numeric fields of film.count, then film.params (params win)
  const byId = Object.fromEntries(claims.filter(c => /^[A-Za-z_$][\w$]*$/.test(String(c.id)) && Number.isFinite(+c.value)).map(c => [c.id, +c.value]));
  const countNums = Object.fromEntries(Object.entries(film.count || {}).filter(([, v]) => typeof v === 'number'));
  const params = { ...byId, ...countNums, ...(film.params || {}) };
  const Phi = (z) => { const t = 1 / (1 + 0.2316419 * Math.abs(z)), d = 0.3989422804014327 * Math.exp(-z * z / 2);
    const p = d * t * (0.31938153 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429)))); return z >= 0 ? 1 - p : p; };
  const PhiInv = (p) => { const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239],
      b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572],
      c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783],
      d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416], pl = 0.02425; let q, r;
    if (p < pl) { q = Math.sqrt(-2 * Math.log(p)); return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    if (p > 1 - pl) { q = Math.sqrt(-2 * Math.log(1 - p)); return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    q = p - 0.5; r = q * q; return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1); };
  const sandbox = { ...Object.fromEntries(Object.getOwnPropertyNames(Math).map(k => [k, Math[k]])), Math, Phi, PhiInv, ln: Math.log,
    sum: (...a) => a.flat().reduce((x, y) => x + y, 0), round: (x, d = 0) => Math.round(x * 10 ** d) / 10 ** d, params, ...params };
  const vctx = vm.createContext(sandbox);
  const bad = [], ok = [], unsourced = [];
  for (const c of claims) {
    const id = c.id ?? '?';
    if ((!c.source || !String(c.source).trim()) && c.formula == null) unsourced.push(id);
    if (c.formula == null) continue;
    let got;
    try { got = vm.runInContext(String(c.formula), vctx, { timeout: 200 }); } catch (e) { bad.push(`${id}: formula throws ${String(e.message).slice(0, 60)}`); continue; }
    const v = +c.value;
    const tol = c.tolerance != null ? +c.tolerance : (Number.isInteger(v) ? 0.5 : Math.max(Math.abs(v) * 0.005, 1e-9));
    if (!(Math.abs(+got - v) <= tol)) bad.push(`${id}: ${c.formula} = ${r2(+got)} ≠ ${v} (±${r2(tol)})`); else ok.push(id);
  }
  const vals = claims.map(c => +c.value).filter(Number.isFinite);
  const renders = claims.flatMap(c => [].concat(c.renders || [], typeof c.render === 'string' ? [c.render] : []));
  const unknown = [];
  for (const c of CAPS) for (const n of numbersIn(c.text, renders)) if (!covered(n, vals)) unknown.push(`${n.raw} @${c.t0}s "${c.text.slice(0, 40)}"`);
  const nForm = claims.filter(c => c.formula != null).length;
  row('G5a', 'claims · formulas', pf(!bad.length && !unsourced.length),
    `${claims.length} claims, ${nForm} with formula, ${ok.length} recompute` + (bad.length ? '; WRONG: ' + bad.slice(0, 5).join('; ') : '') + (unsourced.length ? '; unsourced: ' + unsourced.join(', ') : ''), { bad, unsourced });
  row('G5b', 'claims · caption digits', pf(!unknown.length),
    unknown.length ? `${unknown.length} caption number(s) not in claims: ${unknown.slice(0, 6).join('; ')}` : `every number in ${CAPS.length} captions is a claim value or render`, { unknown });
  // on-screen SVG digits (advisory): any digit visible in SVG text that no claim covers
  const seen = new Map();
  for (const f of timeline) for (const s of f.texts) for (const n of numbersIn(s, renders)) if (!covered(n, vals) && !seen.has(n.raw)) seen.set(n.raw, `${n.raw} @${f.t}s "${s.slice(0, 30)}"`);
  row('G5c', 'claims · on-screen digits', seen.size ? 'WARN' : 'PASS',
    seen.size ? `${seen.size} visible number(s) not in claims (chrome?): ${[...seen.values()].slice(0, 6).join('; ')}` : 'every visible SVG number is a claim value', { unknown: [...seen.values()] });
}

/* ═════════════ G6 legibility ═════════════ */
{
  const ts = [0.08, 0.25, 0.42, 0.58, 0.75, 0.92].map(f => r2(DUR * f));
  const classify = (x) => {
    if (x.role) { const r = x.role.toLowerCase(); return r.startsWith('must') ? 'must-read' : r.startsWith('sec') ? 'secondary' : r.startsWith('chrome') ? 'chrome' : 'secondary'; }
    if (x.layer && /^(cap|caption|captions)$/i.test(x.layer)) return 'must-read';
    return x.size >= 22 ? 'must-read' : x.size >= 12.5 ? 'secondary' : 'chrome';
  };
  const fails = [], warns = [], counts = { 'must-read': 0, secondary: 0, chrome: 0 }; let roles = 0;
  for (const t of ts) {
    await seek(t);
    for (const x of await pg.evaluate(() => window.__gate.texts())) {
      const k = classify(x); counts[k]++; if (x.role) roles++;
      const tag = `${x.size}u "${x.s.slice(0, 32)}" @${t}s`;
      if (k === 'must-read' && x.size < 28) fails.push('must-read ' + tag);
      else if (k === 'secondary' && x.size < 14) fails.push('secondary ' + tag);
      else if (k === 'chrome' && x.size < 12) warns.push('chrome ' + tag);
    }
  }
  const uniq = (a) => [...new Set(a.map(s => s.replace(/ @[\d.]+s$/, '')))];
  const uf = uniq(fails), uw = uniq(warns);
  // phone, live mode
  let phone = '';
  try {
    const pp = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    await pp.goto(URL0, { waitUntil: 'load' }); await pp.waitForFunction(() => window.__film && window.__ctrl);
    await pp.evaluate(() => window.__film.ready());
    const at = +(film.count?.at ?? DUR * 0.6);
    await pp.evaluate((t) => window.__ctrl.seek(t), at + 2);
    const lay = await pp.evaluate((sel) => { const s = document.querySelector(sel); return { sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, stage: s ? Math.round(s.getBoundingClientRect().width) : 0 }; }, stageSel);
    let shotPath = null;
    if (opt.shots) { fs.mkdirSync(opt.shots, { recursive: true }); shotPath = path.join(opt.shots, 'phone-390.png'); await pp.screenshot({ path: shotPath }); }
    phone = `; phone 390: stage ${lay.stage}px (1 unit = ${(lay.stage / 960).toFixed(2)} px), scrollWidth ${lay.sw}/${lay.cw}${lay.sw > lay.cw ? ' OVERFLOW' : ''}${shotPath ? ', shot ' + shotPath : ''}`;
    await pp.close();
  } catch (e) { phone = '; phone shot failed: ' + String(e.message).split('\n')[0]; }
  const status = uf.length ? 'FAIL' : uw.length ? 'WARN' : 'PASS';
  row('G6', 'legibility', status,
    `${counts['must-read']} must-read / ${counts.secondary} secondary / ${counts.chrome} chrome text reads at ${ts.length} times (${roles ? 'data-role' : 'no data-role: classed by layer/size'})` +
    (uf.length ? `; ${uf.length} too small: ${uf.slice(0, 6).join('; ')}${uf.length > 6 ? ' …' : ''}` : '') + (uw.length ? `; chrome < 12: ${uw.slice(0, 3).join('; ')}` : '') + phone,
    { fails: uf, warns: uw, counts });
}

/* ═════════════ G7 counts first ═════════════ */
{
  const ratioRx = /\d+(?:\.\d+)?\s*%|\b\d+\s+in\s+\d+\b|\b\d+\s+out\s+of\s+\d+\b|\b\d+\s*:\s*\d+\s*odds|\bper\s?cent\b/i;
  let first = null;
  for (const f of timeline) { const s = f.texts.find(x => ratioRx.test(x)); if (s) { first = { t: f.t, s, via: 'svg' }; break; } }
  for (const c of CAPS) if (ratioRx.test(c.text) && (!first || c.t0 < first.t)) { first = { t: c.t0, s: c.text, via: 'caption' }; break; }
  const countCh = (film.chapters || []).find(c => beatOf(c) === 'COUNT');
  const countAt = film.count?.at ?? (countCh ? chT0(countCh) : null);
  const countSrc = film.count?.at != null ? 'count.at' : 'COUNT chapter t0 (declare film.count.at to be exact)';
  const fs_ = first ? `first ratio "${first.s.slice(0, 40)}" at ${first.t} s (${first.via})` : 'no percentage or ratio found';
  if (countAt == null) row('G7', 'counts first', 'SKIP', `no film.json.count.at and no COUNT chapter; ${fs_}`);
  else row('G7', 'counts first', pf(!first || first.t >= countAt), `count at ${countAt} s (${countSrc}); ${fs_}`);
}

/* ═════════════ G9 tics ═════════════ */
{
  const chs = film.chapters || [];
  const cardCh = chs.filter(c => c.card === true).length, legacy = (film.cards || []).length;
  const nCards = cardCh + legacy;
  // countdown ring outside the commit window
  const commitCh = chs.find(c => beatOf(c) === 'COMMIT');
  const cw0 = commitCh ? chT0(commitCh) : (film.commit?.at ?? null);
  const cw1 = commitCh && Number.isFinite(chT1(commitCh)) ? chT1(commitCh) : (cw0 != null ? cw0 + 8 + (film.commit?.hold ?? 0) : null);
  const ringT = Object.entries(film.T || film.timings || {}).filter(([k]) => /ring|countdown/i.test(k)).map(([k, v]) => [k, +v]);
  const ringDev = [...chs, ...(film.cards || [])].filter(c => /ring|countdown/i.test(String(c.device || ''))).map(c => [c.id, chT0(c)]);
  const all = [...ringT, ...ringDev];
  const outside = cw0 == null ? all : all.filter(([, v]) => v < cw0 - 0.01 || v > cw1 + 0.01);
  const ringNote = !all.length ? 'no countdown ring' : cw0 == null ? `ring at ${all.map(([k, v]) => k + ' ' + v).join(', ')}, commit window unknown` :
    outside.length ? `ring OUTSIDE commit [${cw0}, ${cw1}]: ${outside.map(([k, v]) => k + ' ' + v).join(', ')}` : `ring only inside commit [${cw0}, ${cw1}]`;
  const st = nCards > 2 ? 'FAIL' : (outside.length ? 'WARN' : 'PASS');
  row('G9', 'tics', st, `${nCards} full-screen card(s) (${cardCh} chapters with card:true${legacy ? ', ' + legacy + ' in film.cards' : ''}; want ≤ 2); ${ringNote}`);
}

/* ═════════════ G10 axes (DECISIONS Q6: exec renders in ink, no sketch texture) ═════════════
   Axes come from the page: window.__film.info.axes (kit2: brand, chrome, material, texture as rendered,
   texture_declared, level), else the <meta name="kit2" content="brand=… material=… texture=… level=…"> tag (texture
   there is the pack's declared one, taken as rendered). Level: film.json level, else axes.level, else 'exec'. */
{
  let ax = info.axes, via = 'window.__film.info.axes';
  if (!ax) {
    const m = /<meta\s+name=["']kit2["']\s+content=["']([^"']*)["']/i.exec(html);
    if (m) { ax = Object.fromEntries(m[1].split(/\s+/).filter(Boolean).map(kv => kv.split('='))); via = 'meta kit2'; }
  }
  const EXEC_MAT = ['ink'], EXEC_TEX = ['none', 'paper'];
  if (!ax) row('G10', 'axes', 'SKIP', 'the page declares no axes (no __film.info.axes, no meta kit2): a factory/kit page, ink by construction');
  else {
    const level = String(film.level ?? ax.level ?? 'exec'), mat = String(ax.material || 'ink'), tex = String(ax.texture || 'none');
    const decl = String(ax.texture_declared || tex);
    const ids = `brand ${ax.brand || '?'}, chrome ${ax.chrome || '?'}, material ${mat}, texture ${tex}${decl !== tex ? ' (declared ' + decl + ')' : ''}; level ${level}${film.level ? '' : ' (default)'}; via ${via}`;
    const bad = [];
    if (level === 'exec' && !EXEC_MAT.includes(mat)) bad.push(`material ${mat} at the exec level (want ink)`);
    if (level === 'exec' && !EXEC_TEX.includes(tex)) bad.push(`texture ${tex} rendered at the exec level (want none or paper)`);
    const dropped = level === 'exec' && !EXEC_TEX.includes(decl) && EXEC_TEX.includes(tex);
    row('G10', 'axes', bad.length ? 'FAIL' : dropped ? 'WARN' : 'PASS',
      (bad.length ? bad.join('; ') + '; ' : dropped ? `the brand's ${decl} texture is drawn flat at the exec level; ` : '') + ids,
      { axes: ax, level, bad });
  }
}

/* ═════════════ stills ═════════════ */
if (opt.shots) {
  fs.mkdirSync(opt.shots, { recursive: true });
  const ts = [...Array(7)].map((_, i) => r2(Math.min(DUR, 1 + i * (DUR - 1) / 7.5))).concat([r2(DUR)]);
  const out = [];
  for (const [i, t] of ts.entries()) {
    await seek(t);
    const p = path.join(opt.shots, `still-${i + 1}-${String(t.toFixed(1)).padStart(5, '0')}s.png`);
    await stage.screenshot({ path: p }); out.push(p);
  }
  row('SHOTS', 'stills', 'INFO', `${out.length} stills at ${ts.join(', ')} s → ${opt.shots}`);
}

await finish();

async function finish() {
  try { await browser.close(); } catch (e) { /* ignore */ }
  const order = (r) => { const m = /^G(\d+)/.exec(r.id); return m ? +m[1] : 99; };
  rows.sort((a, b) => order(a) - order(b) || a.id.localeCompare(b.id));
  const hard = rows.filter(r => r.status === 'FAIL');
  const verdict = hard.length ? 'FAIL' : 'PASS';
  const wi = Math.max(...rows.map(r => (r.id + ' ' + r.name).length));
  console.log(`\nGATE ${film?.id || info?.id || '?'}  ${path.basename(PAGE)}  (film dir ${FILMDIR})`);
  for (const r of rows) console.log(`  ${(r.id + ' ' + r.name).padEnd(wi)}  ${r.status.padEnd(5)} ${r.evidence}`);
  console.log(`  ${'VERDICT'.padEnd(wi)}  ${verdict}${hard.length ? '  (' + hard.map(r => r.id).join(', ') + ')' : ''}\n`);
  if (opt.json) {
    fs.mkdirSync(path.dirname(path.resolve(opt.json)), { recursive: true });
    fs.writeFileSync(opt.json, JSON.stringify({ film: film?.id || null, page: PAGE, filmDir: FILMDIR, date: new Date().toISOString(), pass: !hard.length, rows }, null, 2));
  }
  process.exit(hard.length ? 1 : 0);
}
