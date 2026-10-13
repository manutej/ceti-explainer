#!/usr/bin/env node
/* factory/tools/rubric.mjs · the deterministic half of WOW-MOTION section 9 (22 properties); method and agreement: factory/research/WOW-RUBRIC-SCRIPT.md
   node factory/tools/rubric.mjs <built-page.html> --film <film-dir> [--mp4 file] [--json out.json] [--stride N] [--workers 3] [--no-pixels] [--keep-raw dir] [--dom-cache file]
   Scores P2 P3 P4 P6 P8 P10 P12 P13 P14 P16 P18 P19 P21 P22 (0/1/2, measurement, evidence in s) and gives raw numbers for P1 P5 P7 P9 P11 P15 P17 P20 (reader).
   Sources: film.json/gate.json (moves = knob pairs ...T0/...T1 + rig moves, beat, captions, effect gains); the page (window.__film.seek at every frame, GL draws
   stubbed, 3 workers: SVG text opacity/clip/box); pixels from --mp4 (ffmpeg, 320x180 once, 1920x1080 on demand) or, without it, from the page itself on a --stride grid
   (software GL, seconds per frame: minutes to run; cut scan covers declared joins only). Same inputs, same JSON. */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';

const EXE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', A = process.argv.slice(2), o = { fps: 30, workers: 3 }, pos = [];
for (let i = 0; i < A.length; i++) { const a = A[i]; if (!a.startsWith('--')) pos.push(a); else { const k = a.slice(2).replace(/-(\w)/g, (_, c) => c.toUpperCase()), v = A[i + 1]; o[k] = v === undefined || v.startsWith('--') ? true : isNaN(+v) ? (i++, v) : (i++, +v); } }
const PAGE = pos[0]; if (!PAGE || !o.film || !fs.existsSync(PAGE)) { console.log('usage: node factory/tools/rubric.mjs <page.html> --film <dir> [--mp4 f] [--json out.json] [--stride N] [--workers 3] [--no-pixels] [--keep-raw dir] [--dom-cache file]'); process.exit(2); }
const rj = (p) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; } };
const film = rj(path.join(o.film, 'film.json')) || {}, gate = rj(path.join(o.film, 'gate.json')), fps = o.fps, dur = +film.dur, N = Math.round(dur * fps), kn = film.knobs || {};
const docs = Object.fromEntries((film.knobs_doc || []).filter((d) => d && d.name).map((d) => [d.name, String(d.what || '')]));
const num = (v) => typeof v === 'number' && isFinite(v), R = (x, d = 2) => (num(x) ? +x.toFixed(d) : null), ts = (i) => R(i / fps), pct = (x) => R(x * 100, 1);
const med = (a) => { const b = a.filter(num).sort((x, y) => x - y); return b.length ? (b.length % 2 ? b[b.length >> 1] : (b[b.length / 2 - 1] + b[b.length / 2]) / 2) : null; };
const mean = (a) => a.reduce((s, x) => s + x, 0) / (a.length || 1), MP4 = !!o.mp4, S = o.stride || (MP4 ? 1 : 3), gi = (i) => Math.round(i / S) * S;
const ARR = /at a time|\b(first|start|starts)\b[^:]*\b(to )?(lands?|arrives?|light|drops?)\b/i;   // knob docs naming an arrival sequence: not a move
const NAMES = 'hero easing|settle|overshoot|anticipation|follow-through|stagger|one hero at a time|shared-element joins|speed ramp|text entrance|rhythm|beat grid|shot scale|number arrival|labels|luminance ladder|shadow and rim|grain|effects restraint|lens and drift|fast-move legibility|silent-film substitutes'.split('|');
const P = {}, prop = (n, x) => (P['P' + n] = { id: 'P' + n, name: NAMES[n - 1], ...x });

/* ── static: moves, beat grid (G12 rules), captions ── */
const MV = [];
for (const n of Object.keys(kn)) { const m = /^(.+)T0$/.exec(n); if (m && num(kn[n]) && num(kn[m[1] + 'T1'])) MV.push({ id: m[1], t0: kn[n], t1: kn[m[1] + 'T1'] }); }
for (const m of (film.rig && film.rig.moves) || []) if (num(+m.t0) && num(+m.t1)) MV.push({ id: 'rig:' + (m.id || m.move), t0: +m.t0, t1: +m.t1 });
MV.sort((a, b) => a.t0 - b.t0 || a.t1 - b.t1);
const CAPS = (film.captions || []).map((c) => (Array.isArray(c) ? { t0: +c[0], t1: +c[1], s: String(c[2] ?? '') } : { t0: +(c.t0 ?? c.t ?? 0), t1: +(c.t1 ?? c.end ?? 0), s: String(c.text ?? c.s ?? '') }));
function rhythm() {
  const set = film.beat > 0, B = set ? film.beat : 0.5, off = (t) => Math.abs(t - Math.round(t / B) * B) <= 2 / fps + 1e-9, inR = (v) => num(v) && v >= 0 && v <= dur, mv = new Map();
  for (const [n, v] of Object.entries(kn)) if (inR(v) && (/T0$/.test(n) || /^t[A-Z0-9]/.test(n)) && !/(\d[eE]|[a-z]E)$/.test(n) && !(/\bends?\b|\bending\b/i.test(docs[n] || '') && !/\bstarts?\b|\blands?\b|\barrives?\b/i.test(docs[n]))) mv.set(Math.round(v * 1000), v);
  for (const m of MV) if (m.id.startsWith('rig:') && inR(m.t0)) mv.set(Math.round(m.t0 * 1000), m.t0);
  const mt = [...mv.values()], on = CAPS.filter((c) => off(c.t0)).length + mt.filter(off).length, n = CAPS.length + mt.length;
  const hold = CAPS.map((c) => ({ t: R(c.t0), hold: R(c.t1 - c.t0), need: R(1.3 + 0.06 * c.s.trim().length) })).filter((c) => c.hold < c.need - 1e-9), g = gate && (gate.rows || []).find((r) => r.id === 'G12');
  return { beat: set ? B : null, ref: B, events: n, onGrid: on, share: n ? on / n : 1, caps: CAPS.length, capsOn: CAPS.filter((c) => off(c.t0)).length, holdFail: hold.length, worst: hold.slice(0, 5), gateG12: g && g.data ? `${g.data.onGrid}/${g.data.events} on grid, ${g.data.captions.holdFail} short` : null };
}

/* ── browser workers; the DOM pass stubs the GL draw calls (about 70 ms a frame) ── */
async function pool(stub, fn) {
  const bs = [], pgs = [];
  for (let k = 0; k < o.workers; k++) {
    const b = await chromium.launch({ executablePath: EXE, args: ['--font-render-hinting=none', '--disable-gpu', '--no-first-run', '--disable-background-networking'] }); bs.push(b);
    const pg = await (await b.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 })).newPage();
    if (stub) await pg.addInitScript(() => { for (const C of [WebGLRenderingContext, WebGL2RenderingContext]) for (const k of ['drawArrays', 'drawElements', 'drawArraysInstanced', 'drawElementsInstanced', 'drawRangeElements']) if (C.prototype[k]) C.prototype[k] = function () {}; });
    await pg.goto('file://' + path.resolve(PAGE) + '?film=1', { waitUntil: 'load', timeout: 60000 });
    await pg.waitForFunction(() => window.__film && window.__film.ready, null, { timeout: 30000 }); await pg.evaluate(() => window.__film.ready()); pgs.push(pg);
  }
  try { return await fn(async (items, f) => { const out = []; await Promise.all(pgs.map(async (pg, k) => { for (let j = k; j < items.length; j += pgs.length) out[j] = await f(pg, items[j]); })); return out; }); } finally { for (const b of bs) await b.close(); }
}
const SAMPLE = (tt) => {   // in the page: per time, every visible SVG text [id, string, visibility, size, x0, y0, x1, y1, role, layer, weight, local width] in 960 x 540 stage units
  const st = document.querySelector('#stage') || document.body, root = [...st.querySelectorAll('svg')].filter((s) => !s.parentElement.closest('svg')).sort((a, b) => b.getBoundingClientRect().width - a.getBoundingClientRect().width)[0]; if (!root) return tt.map(() => []);
  const vb = root.viewBox && root.viewBox.baseVal && root.viewBox.baseVal.width ? root.viewBox.baseVal : { x: 0, y: 0, width: 960, height: 540 }, k = 960 / vb.width;
  const box = (el, M) => { const b = el.getBBox(), q = [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]].map(([x, y]) => [M.a * x + M.c * y + M.e, M.b * x + M.d * y + M.f]); return [Math.min(...q.map((p) => p[0])), Math.min(...q.map((p) => p[1])), Math.max(...q.map((p) => p[0])), Math.max(...q.map((p) => p[1]))]; };
  return tt.map((t) => {
    window.__film.seek(t); const inv = root.getScreenCTM().inverse(), out = [];
    [...root.querySelectorAll('text')].forEach((el) => {
      const id = (el.__rb = el.__rb || (window.__rbn = (window.__rbn || 0) + 1));   // stable id: first-seen order (the warm-up walk fixes it)
      const s = (el.textContent || '').replace(/\s+/g, ' ').trim(); if (!s || (el.checkVisibility && !el.checkVisibility({ visibilityProperty: true }))) return; let vis = 1;
      for (let n = el; n && n !== root; n = n.parentElement) {
        const c = getComputedStyle(n); if (c.display === 'none') return; vis *= parseFloat(c.opacity);
        const m = /url\(#([^)]+)\)/.exec(n.getAttribute('clip-path') || ''), r = m && document.getElementById(m[1]) && document.getElementById(m[1]).querySelector('rect');   // masked rise: the clip rect against the text box
        if (r) { const b = box(el, n.getScreenCTM().inverse().multiply(el.getScreenCTM())), x = +r.getAttribute('x') || 0, y = +r.getAttribute('y') || 0, w = +r.getAttribute('width') || 0, h = +r.getAttribute('height') || 0, a = (b[2] - b[0]) * (b[3] - b[1]);
          vis *= a > 0 ? (Math.max(0, Math.min(b[2], x + w) - Math.max(b[0], x)) * Math.max(0, Math.min(b[3], y + h) - Math.max(b[1], y))) / a : 0; }
      }
      const cs = getComputedStyle(el); vis *= parseFloat(cs.fillOpacity || 1); if (!(vis > 0.01)) return;
      const M = inv.multiply(el.getScreenCTM()), sc = Math.sqrt(Math.abs(M.a * M.d - M.b * M.c)), bb = box(el, { a: M.a, b: M.b, c: M.c, d: M.d, e: M.e - vb.x, f: M.f - vb.y }), ro = el.closest('[data-role]'), la = el.closest('[data-layer]');
      out.push([id, s, Math.round(vis * 1000) / 1000, Math.round(parseFloat(cs.fontSize) * sc * k * 100) / 100, ...bb.map((x) => Math.round(x * k * 10) / 10), ro ? ro.getAttribute('data-role') : null, la ? la.getAttribute('data-layer') : null, cs.fontWeight, Math.round(el.getBBox().width * 100) / 100]);
    });
    return out;
  });
};
async function domPass() {   // D[i] = the texts at frame i. Each worker first walks the film so its pooled text elements exist in one order
  const cache = o.domCache; if (cache && fs.existsSync(cache)) return JSON.parse(fs.readFileSync(cache));
  const ch = []; for (let i = 0; i <= N; i += 40) ch.push(Array.from({ length: Math.min(40, N + 1 - i) }, (_, k) => i + k));
  const res = await pool(true, async (run) => { await run(Array(o.workers).fill(0), (pg) => pg.evaluate(`(${SAMPLE})(${JSON.stringify(Array.from({ length: Math.ceil(dur / 0.5) + 1 }, (_, i) => Math.min(i * 0.5, dur)))})`).then(() => 0)); return run(ch, (pg, c) => pg.evaluate(`(${SAMPLE})(${JSON.stringify(c.map((i) => Math.min(i / fps, dur)))})`)); });
  const D = []; ch.forEach((c, q) => c.forEach((i, k) => (D[i] = res[q][k]))); if (cache) fs.writeFileSync(cache, JSON.stringify(D)); return D;
}

/* ── text: P10 entrance, P6 stagger, P14 number arrival, P15 raw ── */
const capText = (r) => (r[9] && /^cap/i.test(r[9])) || (r[1].length >= 12 && CAPS.some((c) => c.s.trim().startsWith(r[1].slice(0, 24))));
function textProps(D) {
  const ids = new Map(); D.forEach((fr, i) => { for (const r of fr) { if (!ids.has(r[0])) ids.set(r[0], []); ids.get(r[0]).push({ i, r }); } });
  const anyRole = D.some((fr) => fr.some((r) => r[8])), ent = [], counts = [], sk = (x) => x.replace(/[\d.,]+/g, '#');
  for (const [, ser] of ids) {
    if ((anyRole && !ser[0].r[8]) || capText(ser[0].r)) continue;
    ser.forEach((cur, k) => {
      const prev = k ? ser[k - 1] : null, re = prev && prev.i + 1 === cur.i && cur.r[1] !== prev.r[1] && cur.r[2] >= 0.9 && prev.r[2] >= 0.9 && sk(cur.r[1]) !== sk(prev.r[1]);   // in place: a new text at once
      if (prev && prev.i + 1 === cur.i && !re) return;
      let top = 0, b = null; for (let q = k; q < ser.length && ser[q].i <= cur.i + 30; q++) top = Math.max(top, ser[q].r[2]);
      for (let q = k; q < ser.length && ser[q].i <= cur.i + 30; q++) if (ser[q].r[2] >= 0.9 * top) { b = ser[q].i; break; }
      if (top >= 0.3 && cur.i > 0 && !(re && /^chrome/.test(cur.r[8] || ''))) ent.push({ s: cur.r[1], a: cur.i, rise: re ? 0 : b - cur.i, role: cur.r[8] });
    });
  }
  const chrome = (e) => /^chrome/.test(e.role || ''), pops = ent.filter((e) => e.rise === 0 && !chrome(e)), rises = ent.filter((e) => e.rise > 0).map((e) => e.rise);
  prop(10, { star: 1, method: 'script', bar: 'no non-caption text appears in one frame; 2 = median rise >= 4 frames', measure: { entrances: ent.length, pops: pops.length, chromePops: ent.filter((e) => e.rise === 0 && chrome(e)).length, medianRiseFrames: med(rises), minRise: Math.min(...rises) },
    score: ent.length ? (pops.length ? 0 : med(rises) >= 4 ? 2 : 1) : null, evidence: pops.length ? pops.slice(0, 30).map((e) => `pop @${ts(e.a)}s "${e.s.slice(0, 26)}" (${e.role || '-'})`) : [`${ent.length} entrances, no pop, median rise ${med(rises)} frames`] });
  const on = ent.filter((e) => e.rise > 0 || !chrome(e)).sort((x, y) => x.a - y.a), waves = []; let w = [];   // waves: >= 3 entrances closer than 0.4 s
  for (const e of on) { if (w.length && e.a - w[w.length - 1].a > 0.4 * fps) { if (w.length >= 3) waves.push(w); w = []; } w.push(e); } if (w.length >= 3) waves.push(w);
  const wv = waves.map((w) => { const st = w.slice(1).map((e, q) => e.a - w[q].a).filter((x) => x > 0); return { t: ts(w[0].a), items: w.length, stepFrames: med(st), simultaneous: w.length - 1 - st.length, spanS: R((w[w.length - 1].a - w[0].a) / fps) }; }), okW = wv.filter((x) => x.stepFrames >= 2 && x.stepFrames <= 8 && x.spanS <= 0.8);
  prop(6, { method: 'script', bar: 'steps 2-8 frames, wave <= 0.8 s; 2 = every wave and steps >= 4', measure: { waves: wv.length, inBar: okW.length, list: wv.slice(0, 8) }, score: okW.length ? (okW.length === wv.length && okW.every((x) => x.stepFrames >= 4) ? 2 : 1) : 0, evidence: wv.slice(0, 4).map((x) => `wave @${x.t}s ${x.items} items, step ${x.stepFrames} f, span ${x.spanS} s, ${x.simultaneous} at once`) });
  for (const [id, ser] of ids) {   // count-in: one element showing a number that rises through >= 4 values, gaps <= 1 s
    let run = []; const pn = (s) => { const m = /^\s*([\d,]*\.?\d+)\s*([^\d]{0,14})$/.exec(s); return m ? { v: parseFloat(m[1].replace(/,/g, '')), u: m[2].trim() } : null; };
    const flush = () => { const v = run.filter((x, q) => !q || x.v !== run[q - 1].v); if (v.length >= 4 && v.every((x, q) => !q || x.v >= v[q - 1].v)) counts.push({ id, v, ser: ser.filter((x) => x.i >= run[0].i && x.i <= run[run.length - 1].i + 12) }); run = []; };
    for (const x of ser) { const n = pn(x.r[1]); if (!n || (run.length && (n.u !== run[0].u || x.i - run[run.length - 1].i > fps))) flush(); if (n) run.push({ i: x.i, v: n.v, u: n.u, r: x.r }); } flush();
  }
  const cin = counts.map((c) => {
    const v = c.v, vf = v[v.length - 1].v, t0 = v[0].i, tf = v[v.length - 1].i, k90 = v.find((x) => x.v >= 0.9 * vf), holds = v.slice(0, -1).map((x, q) => v[q + 1].i - x.i), gk = {};
    for (const x of c.ser) (gk[[x.r[1].replace(/\D/g, '').length, x.r[3], x.r[10]].join()] ||= []).push(x.r[11]);
    const fin = c.ser.filter((x) => x.i >= tf), h0 = fin[0] ? fin[0].r[7] - fin[0].r[5] : 0, spread = Math.max(0, ...Object.values(gk).map((a) => Math.max(...a) - Math.min(...a)));
    return { id: c.id, from: v[0].v, to: vf, t0: ts(t0), t1: ts(tf), last10: R((tf - k90.i) / (tf - t0), 3), stall: R(Math.max(...holds) / (tf - t0), 3), spreadPx: R(spread), tabular: spread <= 0.6, emphasis: fin.slice(0, 12).some((x) => x.r[10] !== fin[0].r[10] || Math.abs(x.r[7] - x.r[5] - h0) > 0.02 * h0) };
  });
  const g5 = gate && (gate.rows || []).find((r) => r.id === 'G5c'), okC = cin.filter((c) => c.tabular && c.last10 >= 0.4), loose = new Set(ent.filter((e) => /\d/.test(e.s)).map((e) => sk(e.s))).size;
  prop(14, { method: 'script', bar: 'count-in, tabular (<= 0.6 px width spread), last 10 % takes >= 40 % of the time; 2 = also an arrival beat, no hold > 35 %, G5c PASS', measure: { countIns: cin, numberTextsEntering: loose, G5c: g5 ? g5.status : null },
    score: !cin.length ? (loose ? 0 : null) : okC.length < cin.length ? 0 : cin.every((c) => c.emphasis && c.stall <= 0.35) && (!g5 || g5.status === 'PASS') ? 2 : 1,
    evidence: cin.length ? cin.map((c) => `${c.from}->${c.to} @${c.t0}-${c.t1}s: last 10 % = ${pct(c.last10)} % of time, longest hold ${pct(c.stall)} %, width spread ${c.spreadPx} px, arrival beat ${c.emphasis}`) : ['no count-in; numbers appear at once'] });
  prop(15, { method: 'reader', raw: { labelEntrances: ent.filter((e) => /^sec/.test(e.role || '')).length, medianRise: med(rises) } });
}

/* ── source only: P12 P19 P22, raw P5 P17 P20 ── */
function staticProps(rh, MM) {
  const ons = MM.filter((m) => m.hero && m.onset != null).map((m) => Math.abs(m.onset - Math.round(m.onset / rh.ref) * rh.ref) <= 2 / fps + 1e-9), os = ons.length ? ons.filter(Boolean).length / ons.length : null;
  prop(12, { method: 'script', bar: '>= 80 % of caption and move starts within +-2 frames of a beat line; 2 = >= 95 % and >= 80 % of visible onsets', measure: { ...rh, visibleOnsetShare: R(os) }, score: rh.beat == null ? 0 : rh.share >= 0.8 ? (rh.share >= 0.95 && os >= 0.8 ? 2 : 1) : 0, evidence: [`${rh.onGrid}/${rh.events} starts on a ${rh.ref} s grid (${pct(rh.share)} %), captions ${rh.capsOn}/${rh.caps}${rh.beat == null ? ', no beat in film.json' : ''}${os != null ? `, visible onsets ${ons.filter(Boolean).length}/${ons.length}` : ''}`] });
  prop(22, { method: 'partial', bar: 'captions hold >= 1.3 s + 0.06 s/char (script); a visual beat per landing (reader)', measure: { captions: rh.caps, tooShort: rh.holdFail, worst: rh.worst }, score: rh.holdFail ? 0 : 1, evidence: [`${rh.caps - rh.holdFail}/${rh.caps} captions hold long enough`] });
  const fx = (re) => Object.entries(kn).filter(([k, v]) => re.test(k) && num(v)), ex = film.level === 'exec', bl = fx(/bloom/i), ch = fx(/chroma|fringe|aberr/i), dof = fx(/dof|bokeh/i), bad = [...bl.filter(([, v]) => v > 0.35 || (ex && v > 0)), ...ch.filter(([, v]) => v > 1 || (ex && v > 0)), ...dof.filter(([, v]) => ex && v > 0)];
  prop(19, { star: 1, method: 'script', bar: 'bloom <= 0.35, chroma <= 1 px, <= 1 DoF rack per 20 s, none at exec level', measure: { bloom: bl, chroma: ch, dof, level: film.level || null }, score: bad.length ? 0 : 1, evidence: bad.length ? bad.map(([k, v]) => `${k} ${v}`) : ['effect gains inside the bar'] });
  prop(20, { method: 'reader', raw: { fov: fx(/^(cam)?fov$/i), drift: fx(/drift/i) } }); prop(5, { method: 'reader', raw: { lagKnobs: fx(/lag/i) } }); prop(17, { method: 'reader', raw: { knobs: fx(/^look(Rim|Shadow|Amb)$/) } });
}

/* ── main ── */
async function main() {
  const rh = rhythm(); console.error('rubric: DOM pass (GL stubbed)'); const D = await domPass(); textProps(D); let MM = [];
  if (!o.noPixels) { const px = await import('./rubric-px.mjs'), c = { o, fps, dur, N, MP4, S, gi, film, kn, docs, MV, CAPS, D, prop, R, ts, pct, med, mean, num, ARR };
    if (MP4) MM = await px.run(c); else await pool(false, async (run) => { MM = await px.run({ ...c, full: run }); }); }
  staticProps(rh, MM);
  const t = { scored: 0, of: 0, sum: 0, reader: [], notMeasured: [], zeros: [] }, out = {};
  for (let n = 1; n <= 22; n++) { const p = P['P' + n] || { id: 'P' + n, name: NAMES[n - 1], method: 'not measured' }; out[p.id] = p;
    if (p.method === 'reader') t.reader.push(p.id); else if (p.score == null) t.notMeasured.push(p.id); else { t.scored++; t.of += 2; t.sum += p.score; if (!p.score) t.zeros.push(p.id + (p.star ? '*' : '')); } }
  const rep = { tool: 'factory/tools/rubric.mjs', film: film.id || null, page: path.basename(PAGE), dur, fps, source: { dom: 'page seek, GL stubbed', pixels: o.noPixels ? 'none' : MP4 ? 'mp4 ' + path.basename(o.mp4) : 'page render, stride ' + S }, totals: t, props: out, moves: MM.map(({ kp, rest, ...m }) => m) };
  if (o.json) { fs.mkdirSync(path.dirname(path.resolve(o.json)), { recursive: true }); fs.writeFileSync(o.json, JSON.stringify(rep, null, 1)); }
  console.log(`RUBRIC ${rep.film} · ${rep.source.pixels} · scripted ${t.sum}/${t.of} over ${t.scored} properties; zeros ${t.zeros.join(' ') || '-'}; reader ${t.reader.join(' ')}; not measured ${t.notMeasured.join(' ') || '-'}`);
  for (const p of Object.values(out)) console.log(`  ${p.id.padEnd(3)} ${p.star ? '*' : ' '} ${p.name.padEnd(24)} ${p.method === 'reader' ? 'reader' : p.score == null ? 'n/m   ' : 'score ' + p.score} ${(p.evidence || []).slice(0, 2).join(' | ').slice(0, 150)}`);
}
main().catch((e) => { console.error('rubric.mjs: ' + (e.stack || e)); process.exit(1); });
