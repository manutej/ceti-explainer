/* ════════════════════════════════════════════════════════════════════
   factory/kit/kit.js · the reusable kit for the 75-second case.
   Derived from films/opera-house/film.js ("The Tender Set").
   One clock: every frame is KIT.render(t, state) → FILM_RENDER.render(t, state, KIT).
   SVG (retained pool) = type, labels, lines. p5 2.3.4 Canvas2D = ground and mass.
   Everything is on window.KIT. No Math.random / Date / performance in here.
   ════════════════════════════════════════════════════════════════════ */
(function () {
'use strict';
const FILM = window.FILM || {};
const FILM_MODE = /[?&]film=1/.test(location.search);
const W = 960, H = 540;
const DUR = FILM.dur || 75;
const SEED = FILM.seed != null ? FILM.seed : 23;

/* ── palette: film.json.palette overrides; keys are fixed so helpers can rely on them ── */
const PAL_DEFAULT = { paper: '#E8DCC2', ink: '#1E3A5C', accent: '#C8452E', muted: '#8E887C', chalk: '#F2ECDD', dark: '#0A0D12', soft: '#B9A277' };
const C = Object.assign({}, PAL_DEFAULT, FILM.palette || {});
function hexRgb(h) { h = String(h).replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
const rgba = (k, a) => { const c = hexRgb(C[k] || k); return `rgba(${c[0]},${c[1]},${c[2]},${a})`; };
const TYPE = Object.assign({ disp: 'Big Shoulders Display', mono: 'IBM Plex Mono' }, FILM.type || {});
const FONT = { mono: `'${TYPE.mono}', monospace`, disp: `'${TYPE.disp}', sans-serif`, sans: `'${TYPE.sans || TYPE.mono}', sans-serif` };
const ADV = { mono: 0.6, disp: 0.46, sans: 0.52 };   // average advance per em, for wrapping and backing boxes

/* ── maths ── */
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const seg = (t, a, b) => clamp((t - a) / (b - a));
const ease = (u) => u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
const eout = (u) => 1 - Math.pow(1 - u, 3);
const lerp = (a, b, u) => a + (b - a) * u;
const typed = (s, t, t0, cps = 40) => String(s).slice(0, Math.max(0, Math.floor((t - t0) * cps)));
const fmtK = (k) => Number(k).toLocaleString('en-US');
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function shuffle(arr, seed) { const r = mulberry32(seed), a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function PhiInv(p) {   // Acklam's inverse normal CDF
  const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
  const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
  const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
  const pl = 0.02425; let q, r;
  if (p < pl) { q = Math.sqrt(-2 * Math.log(p)); return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
  if (p > 1 - pl) { q = Math.sqrt(-2 * Math.log(1 - p)); return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
  q = p - 0.5; r = q * q;
  return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}
// greedy word wrap by estimated width (deterministic; no DOM measuring)
function wrap(s, maxW, size, fam = 'mono') {
  const per = Math.max(4, Math.floor(maxW / (size * (ADV[fam] || 0.55))));
  const out = []; let cur = '';
  for (const w of String(s).split(/\s+/)) { if (!w) continue; const nx = cur ? cur + ' ' + w : w; if (nx.length > per && cur) { out.push(cur); cur = w; } else cur = nx; }
  if (cur) out.push(cur);
  return out;
}

/* ── state: the commit answer lives in state.answer (number | 'none' | null) ── */
const state = { answer: FILM_MODE && FILM.commit ? FILM.commit.default : null };
const answerStr = (s) => { const a = (s || state).answer; return a == null ? '__' : a === 'none' ? '—' : String(a); };
const answered = (s) => typeof (s || state).answer === 'number';

/* ══════════ retained SVG pool ══════════
   E(key, tag, layer, attrs, text): call it every frame an element should be visible.
   endFrame(): elements not touched this frame are stripped (attributes, text) and detached; each layer's
   children are put in this frame's call order. So the SVG after seek(t) is byte-identical however you got there. */
const NS = 'http://www.w3.org/2000/svg';
const LAYERS = ['field', 'marks', 'labels', 'chrome', 'cap', 'card', 'top'];
let svg = null, FR = 0;
const L = {}, POOL = new Map(), SEQ = {};
LAYERS.forEach(k => (SEQ[k] = []));
function E(key, tag, layer, attrs, text) {
  if (!L[layer]) throw new Error('KIT.E: unknown layer ' + layer + ' (use ' + LAYERS.join(', ') + ')');
  let el = POOL.get(key);
  if (!el || el._tag !== tag) { el = document.createElementNS(NS, tag); el._tag = tag; el._a = {}; el._sig = ''; el._t = undefined; POOL.set(key, el); }
  if (el._f !== FR) { el._f = FR; el._layer = layer; SEQ[layer].push(el); }
  let sig = '';
  for (const k in attrs) if (attrs[k] != null) sig += k + '|';
  if (sig !== el._sig) {   // the set of present attributes changed: rebuild in canonical (key) order
    while (el.attributes.length) el.removeAttribute(el.attributes[0].name);
    el._a = {}; el._sig = sig;
    for (const k in attrs) { const v = attrs[k]; if (v != null) { el._a[k] = v; el.setAttribute(k, v); } }
  } else {
    for (const k in attrs) { const v = attrs[k]; if (v != null && el._a[k] !== v) { el._a[k] = v; el.setAttribute(k, v); } }
  }
  if (text !== undefined && el._t !== text) { el._t = text; el.textContent = text; }
  return el;
}
function endFrame() {
  for (const el of POOL.values()) {
    if (el._f !== FR && el._vis) {
      el._vis = false;
      while (el.attributes.length) el.removeAttribute(el.attributes[0].name);
      el._a = {}; el._sig = ''; el._t = undefined; el.textContent = '';
    } else if (el._f === FR) el._vis = true;
  }
  for (const k of LAYERS) {
    const g = L[k], want = SEQ[k], ch = g.childNodes;
    let ok = ch.length === want.length;
    for (let i = 0; ok && i < want.length; i++) if (ch[i] !== want[i]) ok = false;
    if (!ok) g.replaceChildren(...want);
    SEQ[k] = [];
  }
}
const f2 = (v) => (+v).toFixed(2);
const opv = (o) => o.op != null ? +clamp(o.op).toFixed(3) : 1;
function tx(key, layer, x, y, s, o = {}) {
  const fam = o.fam || 'mono';
  const tr = o.rot ? `rotate(${o.rot} ${(+x).toFixed(1)} ${(+y).toFixed(1)})` : (o.tr || null);
  return E(key, 'text', layer, { x: f2(x), y: f2(y), 'font-family': FONT[fam] || fam, 'font-size': o.size || 14, fill: o.fill || C.ink,
    'text-anchor': o.anchor || 'start', 'letter-spacing': o.ls != null ? o.ls : 0, opacity: opv(o),
    'font-weight': o.weight || (fam === 'disp' ? 600 : 400), transform: tr }, String(s));
}
function ln(key, layer, x1, y1, x2, y2, o = {}) {
  return E(key, 'line', layer, { x1: f2(x1), y1: f2(y1), x2: f2(x2), y2: f2(y2), stroke: o.stroke || C.ink,
    'stroke-width': o.w || 0.75, opacity: opv(o), 'stroke-dasharray': o.dash || null, 'stroke-linecap': o.cap || 'square' });
}
function rc(key, layer, x, y, w, h, o = {}) {
  return E(key, 'rect', layer, { x: f2(x), y: f2(y), width: f2(Math.max(0, w)), height: f2(Math.max(0, h)),
    fill: o.fill || 'none', 'fill-opacity': o.fo != null ? o.fo : 1, stroke: o.stroke || 'none', 'stroke-width': o.w || 0, rx: o.rx || 0,
    opacity: opv(o), 'stroke-dasharray': o.dash || null, transform: o.tr || null });
}
function path(key, layer, d, o = {}) {
  return E(key, 'path', layer, { d, fill: o.fill || 'none', stroke: o.stroke || C.ink, 'stroke-width': o.w || 1, opacity: opv(o),
    'stroke-dasharray': o.dash || null, 'stroke-linecap': o.cap || 'round' });
}
// architectural dimension line: oblique ticks, label centred on a paper chip
function dim(key, layer, x1, x2, y, label, op = 1, o = {}) {
  if (op <= 0) return;
  const col = o.stroke || C.ink, sz = o.size || 14;
  ln(key + 'l', layer, x1, y, x2, y, { op, stroke: col, w: o.w || 0.75 });
  ln(key + 'a', layer, x1 - 4, y + 4, x1 + 4, y - 4, { op, stroke: col, w: 1.1 });
  ln(key + 'b', layer, x2 - 4, y + 4, x2 + 4, y - 4, { op, stroke: col, w: 1.1 });
  ln(key + 'c', layer, x1, y - 7, x1, y + 7, { op: op * 0.6, stroke: col });
  ln(key + 'd', layer, x2, y - 7, x2, y + 7, { op: op * 0.6, stroke: col });
  if (label) {
    const w = String(label).length * sz * ADV.mono + 10;
    rc(key + 'bg', layer, (x1 + x2) / 2 - w / 2, y - sz * 0.7, w, sz * 1.4, { fill: o.bg || C.paper, op });
    tx(key + 't', layer, (x1 + x2) / 2, y + sz * 0.36, label, { anchor: 'middle', size: sz, op, fill: col, weight: 500, ls: '0.04em' });
  }
}
// rubber stamp: chalk face, ink rim, rotated
function stamp(key, layer, cx, cy, s, text, o = {}) {
  const op = o.op != null ? o.op : 1; if (op <= 0) return;
  const fs = (o.fs || 26) * s;
  const w = (o.w || Math.max(120, String(text).length * (o.fs || 26) * ADV.disp + 36)) * s, h = (o.h || 44) * s, rot = o.rot != null ? o.rot : -7;
  const tr = `rotate(${rot} ${cx.toFixed(1)} ${cy.toFixed(1)})`;
  const rim = o.rim || C.ink;
  rc(key + 'f', layer, cx - w / 2, cy - h / 2, w, h, { fill: o.face || C.chalk, stroke: rim, w: 2.4 * s, rx: 5 * s, op, tr });
  rc(key + 'i', layer, cx - w / 2 + 4 * s, cy - h / 2 + 4 * s, w - 8 * s, h - 8 * s, { stroke: rim, w: 0.9 * s, rx: 3 * s, op, tr });
  tx(key + 't', layer, cx, cy + fs * 0.36, text, { fam: 'disp', size: fs, anchor: 'middle', fill: rim, op, ls: '0.08em', tr });
}

/* ── film.json lookups ── */
const CH = FILM.chapters || [], CARDS = FILM.cards || [], CAPS = FILM.captions || [];
const chapterAt = (t) => { let c = CH[0] || null; for (const x of CH) if (t >= x.t0) c = x; return c; };
const cardAt = (t) => CARDS.find(c => t >= c.t0 && t < c.t1) || null;
const capAt = (t) => { for (const c of CAPS) if (t >= c[0] && t < c[1]) return c; return null; };
const brandAt = () => FILM.brand ? (FILM.brand.at != null ? FILM.brand.at : DUR - 3) : null;

/* ── layout of the sheet (design units, 960 × 540) ── */
const LAYOUT = {
  W, H,
  content: { x0: 48, y0: 104, x1: 664, y1: 400 },      // where the film draws its structure
  ledger: { x: 700, y: 44, w: 230, row: 19 },           // right-hand ledger (chrome, 12 units, never a result)
  block: { x: 700, y: 312, w: 230, h: 84 },             // title block; slot on its right
  slot: { x: 890, y: 356 },
  cap: { x: 48, y: 480, w: 864, size: 28, lh: 34 },     // captions: must-read, 28 units, at most 2 lines (2 lines: 446 and 480)
};

/* ══════════ chrome: the Tender-Set sheet frame ══════════
   chrome(t, chapter, opts) · chapter {eyebrow, title} (default chapterAt(t))
   opts.ledger {title, rows: [[t, text], ...], cps, hl: index}   false hides it
   opts.block  {title, lines: [..], slotLabel, slot: 'SEALED' | null, open: t}   false hides it
   opts.marks  false hides the corner marks */
function chrome(t, chapter, opts = {}) {
  const ch = chapter || chapterAt(t) || { eyebrow: '', title: '' };
  if (opts.marks !== false) [[16, 16, 1, 1], [944, 16, -1, 1], [16, 524, 1, -1], [944, 524, -1, -1]].forEach(([x, y, sx, sy], i) => {
    ln('ch.ma' + i, 'chrome', x, y, x + 12 * sx, y, { op: 0.6 }); ln('ch.mb' + i, 'chrome', x, y, x, y + 12 * sy, { op: 0.6 });
  });
  if (ch.eyebrow) tx('ch.eb', 'chrome', 48, 44, ch.eyebrow, { size: 12, ls: '0.2em', op: 0.75, weight: 500 });
  if (ch.title) tx('ch.ti', 'chrome', 47, 82, ch.title, { fam: 'disp', size: 32, ls: '0.02em' });
  const lg = opts.ledger, LG = LAYOUT.ledger;
  if (lg) {
    tx('ch.lh', 'chrome', LG.x, LG.y, lg.title || 'LEDGER', { size: 12, ls: '0.2em', op: 0.8, weight: 500 });
    ln('ch.lhl', 'chrome', LG.x, LG.y + 7, LG.x + LG.w, LG.y + 7, { w: 0.9 });
    (lg.rows || []).forEach(([tr, s], i) => {
      const y = LG.y + 27 + i * LG.row;
      ln('ch.ll' + i, 'chrome', LG.x, y + 6, LG.x + LG.w, y + 6, { op: 0.3 });
      const txt = typed(s, t, tr, lg.cps || 50);
      if (lg.hl === i && txt) rc('ch.lb' + i, 'field', LG.x - 3, y - 12, LG.w + 6, 17, { fill: C.chalk });
      if (txt) tx('ch.lt' + i, 'chrome', LG.x, y, txt, { size: 12, ls: '0.02em', weight: lg.hl === i ? 500 : 400, fill: lg.hl === i ? C.accent : C.ink });
    });
  }
  const bk = opts.block, B = LAYOUT.block;
  if (bk) {
    const open = bk.open != null ? bk.open : -99;
    rc('ch.bo', 'chrome', B.x, B.y, B.w, B.h, { stroke: C.ink, w: 1.2 });
    ln('ch.bv', 'chrome', B.x + 150, B.y, B.x + 150, B.y + B.h, { w: 0.75 });
    ln('ch.bh', 'chrome', B.x, B.y + 32, B.x + 150, B.y + 32, { w: 0.75 });
    tx('ch.bt', 'chrome', B.x + 8, B.y + 24, typed(bk.title || FILM.title || '', t, open), { fam: 'disp', size: 20, ls: '0.06em' });
    (bk.lines || []).slice(0, 2).forEach((s, i) => tx('ch.bl' + i, 'chrome', B.x + 8, B.y + 52 + i * 18, typed(s, t, open + 0.5 * (i + 1)), { size: 12, ls: '0.04em' }));
    tx('ch.bs', 'chrome', B.x + 190, B.y + 14, bk.slotLabel || 'DATE', { size: 12, anchor: 'middle', op: 0.7, ls: '0.2em' });
    if (bk.slot) stamp('ch.st', 'chrome', LAYOUT.slot.x, LAYOUT.slot.y + 4, 0.5, bk.slot, { w: 130, h: 50, fs: 28 });
  }
}

/* caption(t, o): the FILM.captions entry live at t, red tick + up to 2 lines at 28 units in the 'cap' layer (CC toggles it) */
function caption(t, o = {}) {
  const c = capAt(t); if (!c || window.NOCAP) return;
  const K = Object.assign({}, LAYOUT.cap, o);
  const op = seg(t, c[0], c[0] + 0.25) * (1 - seg(t, c[1] - 0.25, c[1]));
  const lines = wrap(c[2], K.w, K.size, K.fam || 'mono').slice(0, K.max || 2);
  const y0 = K.y - (lines.length - 1) * K.lh * (K.up === false ? 0 : 1);
  rc('cp.r', 'cap', K.x, y0 - K.size - 6, 10, 2, { fill: C.accent, op });
  lines.forEach((s, i) => tx('cp.t' + i, 'cap', K.x, y0 + i * K.lh, s, { size: K.size, op, weight: 500, fam: K.fam || 'mono', fill: K.fill || C.ink }));
}

/* card(t, c): a dark question card {t0, t1, q: [lines], sub, subAt} over the whole stage ('card' layer) */
function card(t, c) {
  if (!c) return;
  const a = seg(t, c.t0, c.t0 + 0.4), out = 1 - seg(t, c.t1 - 0.35, c.t1);
  rc('cd.bg', 'card', 0, 0, W, H, { fill: C.dark, op: a * (c.fadeOut ? out : 1) });
  ln('cd.m1', 'card', 22, 22, 38, 22, { op: a, stroke: C.chalk }); ln('cd.m2', 'card', 22, 22, 22, 38, { op: a, stroke: C.chalk });
  const qa = seg(t, c.t0 + 0.3, c.t0 + 0.8) * out;
  const lines = c.q || [], lh = 54, y0 = 270 - (lines.length - 1) * lh / 2 + 14;
  lines.forEach((s, i) => tx('cd.q' + i, 'card', 480, y0 + i * lh, s, { fam: 'disp', size: 46, anchor: 'middle', fill: C.chalk, op: qa, ls: '0.02em' }));
  if (c.sub) tx('cd.s', 'card', 480, y0 + (lines.length - 1) * lh + 46, c.sub, { size: 14, anchor: 'middle', fill: C.accent, op: 0.9 * seg(t, c.t0 + (c.subAt || 0.8), c.t0 + (c.subAt || 0.8) + 0.4) * out, ls: '0.18em', weight: 500 });
}

/* roll(t, t0, dur): the sheet unrolls from the left over the dark ground, with a curl shadow ('top' layer).
   Draws nothing before t0 (so a later roll never blacks out earlier frames); use t0 = 0 for the opening. */
function roll(t, t0, dur = 0.5, key = 'rl') {
  if (t < t0 && t0 > 0) return;
  const u = seg(t, t0, t0 + dur); if (u >= 1) return;
  const x = W * ease(u);
  rc(key + '.bk', 'top', x, 0, W - x + 2, H, { fill: C.dark });
  E(key + '.sh', 'rect', 'top', { x: f2(x - 14), y: 0, width: 14, height: H, fill: 'url(#kit-curl)', opacity: u > 0 ? 1 : 0 });
}

/* brandCard(t, t0, line): the CETI end card. [t0, t0+0.6] the material holds; then a plain dark card fades in
   with the CETI wordmark line and the film's one-line takeaway (≥ 30 units). The kit calls it for you at
   FILM.brand.at (default dur − 3) unless FILM_RENDER.brand === false. */
function brandCard(t, t0, line) {
  if (t < t0) return;
  const a = ease(seg(t, t0 + 0.6, t0 + 1.1)), b = ease(seg(t, t0 + 1.0, t0 + 1.5));
  if (a <= 0) return;
  rc('br.bg', 'top', 0, 0, W, H, { fill: C.dark, op: a });
  tx('br.w', 'top', 480 + 0.16 * 60, 214, 'CETI', { fam: 'disp', size: 60, anchor: 'middle', fill: C.chalk, op: a, ls: '0.32em' });
  ln('br.r', 'top', 448, 238, 512, 238, { stroke: C.accent, w: 2, op: a });
  const lines = wrap(line || (FILM.brand && FILM.brand.takeaway) || '', 760, 34, 'disp').slice(0, 2);
  lines.forEach((s, i) => tx('br.t' + i, 'top', 480, 300 + i * 42, s, { fam: 'disp', size: 34, anchor: 'middle', fill: C.chalk, op: b, ls: '0.02em' }));
}

/* ══════════ the commit box ══════════
   commitBox(t, s, o) draws the sealed commit on the sheet. Timing (all from FILM.commit.at = A):
   box fades in [A−1, A−0.2]; film mode types the default from A+1.2; ring counts down A..A+4; the stamp lands
   at o.seal (A+4.5). On the live page the player pauses at A and the HTML input collects s.answer; the SVG box
   shows '__' until then. Returns {op, sealed}. Nothing numeric from the answer should appear before it. */
function commitBox(t, s, o = {}) {
  const cm = FILM.commit || {}, A = o.at != null ? o.at : cm.at;
  const x = o.x != null ? o.x : 700, y = o.y != null ? o.y : 150, w = o.w || 230, h = o.h || 150;
  const seal = o.seal != null ? o.seal : A + 4.5, out = o.out != null ? o.out : Infinity;
  const op = seg(t, A - 1, A - 0.2) * (1 - seg(t, out, out + 0.5));
  if (op <= 0) return { op: 0, sealed: t >= seal };
  rc('cb.o', 'marks', x, y, w, h, { stroke: C.ink, w: 1.4, dash: '6 4', op, fill: C.chalk, fo: 0.45 });
  tx('cb.h', 'labels', x + 14, y + 36, o.title || 'YOUR NUMBER', { fam: 'disp', size: 28, op, ls: '0.05em' });
  tx('cb.s', 'labels', x + 14, y + 58, o.prompt || cm.unitLabel || cm.unit || '', { size: 14, op: op * 0.85, ls: '0.06em' });
  if (t >= A && t < seal) {
    const ru = seg(t, A, A + 4), cx = x + w - 26, cy = y + 28, R = 14, a = 2 * Math.PI * (1 - ru);
    if (ru < 1) {
      const p1 = [cx + R * Math.sin(a), cy - R * Math.cos(a)];
      path('cb.ring', 'marks', `M ${cx} ${cy - R} A ${R} ${R} 0 ${a > Math.PI ? 1 : 0} 1 ${f2(p1[0])} ${f2(p1[1])}`, { stroke: C.ink, w: 1.4, op });
      tx('cb.n', 'labels', cx, cy + 5, String(Math.max(1, 4 - Math.floor(t - A))), { size: 14, anchor: 'middle', op, weight: 500 });
    }
  }
  const sv = s || state, ds = answerStr(sv);
  let shown = ds;
  if (FILM_MODE && t < seal) shown = typed(ds, t, A + 1.2, 2.5) || '__';
  if (!FILM_MODE && sv.answer == null) shown = t < seal ? '__' : '?';
  tx('cb.v', 'labels', x + w / 2, y + h - 26, shown, { fam: 'disp', size: 56, anchor: 'middle', op: op * seg(t, A - 0.6, A - 0.2) });
  if (t >= seal) {
    const k = seg(t, seal, seal + 0.22);
    const lab = sv.answer === 'none' ? 'NO ANSWER' : 'SEALED';
    stamp('cb.st', 'marks', x + w / 2, y + h - 44, lerp(1.4, 0.9, eout(k)), lab, { op: k * op, h: 50, fs: 28 });
  }
  return { op, sealed: t >= seal };
}

/* ══════════ p5 ground & pencil ══════════ */
// makeGround(p, seed, palette): a 960 × 540 paper sheet at density 2: soft noise blotches, roller banding, a crease
function makeGround(p, seed = SEED, pal = C) {
  const g = p.createGraphics(W, H); g.pixelDensity(2);
  const gc = g.drawingContext;
  gc.fillStyle = pal.paper; gc.fillRect(0, 0, W, H);
  p.noiseSeed(seed);
  const r = mulberry32(seed);
  const bx1 = 40 + 80 * r(), by1 = 20 + 50 * r(), bx2 = 150 + 70 * r(), by2 = 70 + 50 * r();
  const ink = hexRgb(pal.ink), paper = hexRgb(pal.paper);
  const dark = (paper[0] + paper[1] + paper[2]) / 3 < 110;   // dark sheet: blotches lighten instead
  const lo = p.createGraphics(240, 135); lo.pixelDensity(1); lo.loadPixels();
  for (let y = 0; y < 135; y++) for (let x = 0; x < 240; x++) {
    const n = p.noise(x * 0.012, y * 0.012);
    const b1 = Math.exp(-(((x - bx1) ** 2) / 3000 + ((y - by1) ** 2) / 1400)), b2 = Math.exp(-(((x - bx2) ** 2) / 2600 + ((y - by2) ** 2) / 1200));
    const a = (0.55 * (b1 + b2) + 0.45 * n) * 0.05;
    const i = 4 * (y * 240 + x);
    lo.pixels[i] = dark ? 255 : 120; lo.pixels[i + 1] = dark ? 250 : 95; lo.pixels[i + 2] = dark ? 235 : 50; lo.pixels[i + 3] = Math.round(a * 255);
  }
  lo.updatePixels();
  gc.imageSmoothingEnabled = true; gc.drawImage(lo.elt, 0, 0, W, H);
  for (let y = 0; y < H; y += 3) { gc.fillStyle = `rgba(${ink[0]},${ink[1]},${ink[2]},${0.012 * (0.5 + 0.5 * Math.sin(y * 0.21))})`; gc.fillRect(0, y, W, 1); }
  const cx = 680;   // the fold between the content and the ledger column
  const cg = gc.createLinearGradient(cx - 6, 0, cx + 6, 0);
  cg.addColorStop(0, 'rgba(70,50,20,0)'); cg.addColorStop(0.5, 'rgba(70,50,20,0.03)'); cg.addColorStop(0.55, 'rgba(255,250,235,0.05)'); cg.addColorStop(1, 'rgba(70,50,20,0)');
  gc.fillStyle = cg; gc.fillRect(cx - 6, 0, 12, H);
  lo.remove && lo.remove();
  return g;
}
// pencil(x1, y1, x2, y2, u, seed, o): a straightedge pencil stroke on the canvas, drawn to fraction u (noise wobble, seeded)
function pencil(x1, y1, x2, y2, u = 1, seed = 0, o = {}) {
  if (u <= 0 || !K.ctx) return;
  const ctx = K.ctx, P = K.p;
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
  const ov = o.over != null ? o.over : 3, ax = x1 - ux * ov, ay = y1 - uy * ov, L2 = len + 2 * ov;
  const n = Math.max(6, Math.round(L2 / 6)), m = Math.max(1, Math.round(n * u));
  ctx.save(); ctx.strokeStyle = o.col || rgba('accent', o.a != null ? o.a : 0.85); ctx.lineWidth = o.w || 1.6; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath();
  for (let i = 0; i <= m; i++) {
    const s = i / n, wv = (P.noise(seed * 7.13 + i * 0.35) - 0.5) * 1.2;
    const x = ax + ux * L2 * s - uy * wv, y = ay + uy * L2 * s + ux * wv;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.stroke(); ctx.restore();
}

/* ══════════ mount & render ══════════ */
let readyRes; const readyP = new Promise(r => (readyRes = r));
let lastT = 0;
const FR_ = () => window.FILM_RENDER || {};
function mount(stageEl) {
  svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('class', 'ex-svg');
  svg.innerHTML = `<defs><linearGradient id="kit-curl" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="0.7" stop-color="#3a2a12" stop-opacity="0.28"/><stop offset="1" stop-color="${C.paper}" stop-opacity="0.9"/></linearGradient></defs>`;
  LAYERS.forEach(k => { const g = document.createElementNS(NS, 'g'); g.setAttribute('data-layer', k); svg.appendChild(g); L[k] = g; });
  stageEl.appendChild(svg);
  K.svg = svg;
  new p5((p) => {
    p.setup = () => {
      const cnv = p.createCanvas(W, H); p.pixelDensity(2); p.noLoop();
      cnv.elt.classList.add('ex-canvas');
      cnv.parent(stageEl); stageEl.insertBefore(cnv.elt, svg);
      K.p = p; K.ctx = p.drawingContext;
      K.ground = FR_().ground === false ? null : makeGround(p, SEED, C);
      p.noiseSeed(SEED);
      if (FR_().setup) FR_().setup(p, K);
      p.noiseSeed(SEED);
      readyRes(true);
    };
    p.draw = () => {};
  });
  return readyP;
}
function render(t, s) {
  if (!K.ctx) return;
  t = clamp(t, 0, DUR - 1e-6); lastT = t; FR++;
  const ctx = K.ctx, d = K.p.pixelDensity();
  ctx.setTransform(d, 0, 0, d, 0, 0); ctx.globalAlpha = 1; ctx.clearRect(0, 0, W, H);
  if (K.ground) ctx.drawImage(K.ground.elt, 0, 0, W, H);
  const R = FR_(), bAt = brandAt(), auto = R.brand !== false && bAt != null;
  const tm = auto && t >= bAt ? bAt - 1e-3 : t;   // the material's last frame holds under the brand card
  ctx.save();
  if (R.render) R.render(tm, s || state, K);
  ctx.restore();
  if (R.captions !== false) caption(tm);
  if (auto && t >= bAt) brandCard(t, bAt, FILM.brand.takeaway);
  endFrame();
}

const K = window.KIT = {
  // constants & data
  FILM, FILM_MODE, DUR, W, H, SEED, C, FONT, LAYOUT, LAYERS, state,
  // maths
  clamp, seg, ease, eout, lerp, typed, fmtK, mulberry32, shuffle, PhiInv, wrap, rgba, hexRgb,
  // pool & primitives
  E, endFrame, tx, ln, rc, path, dim, stamp,
  // chrome & devices
  chrome, caption, card, roll, brandCard, commitBox, answerStr, answered,
  // canvas
  makeGround, pencil,
  // film lookups
  chapterAt, cardAt, capAt, brandAt,
  // lifecycle (the player calls these)
  mount, render, ready: () => readyP, get t() { return lastT; }, poolSize: () => POOL.size,
  p: null, ctx: null, ground: null, svg: null,
};
})();
