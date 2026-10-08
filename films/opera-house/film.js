/* ════════════════════════════════════════════════════════════════════
   The Opera House — "The Tender Set" chrome. One clock: every frame is
   render(t, state). SVG = type, labels, drawn lines (built once, then only
   mutated). p5 2.x Canvas2D = ground texture, the 1,000-bar wall, red pencil.
   ════════════════════════════════════════════════════════════════════ */
(function () {
'use strict';
const FILM = window.FILM, T = FILM.T, DUR = FILM.dur;
const C = { manila: '#E8DCC2', prussian: '#1E3A5C', red: '#C8452E', concrete: '#8E887C', chalk: '#F2ECDD', sail: '#B9A277', black: '#0A0D12' };
const RGB = { prussian: [30, 58, 92], red: [200, 69, 46], sail: [185, 162, 119], chalk: [242, 236, 221], concrete: [142, 136, 124], black: [10, 13, 18] };
const rgba = (k, a) => `rgba(${RGB[k][0]},${RGB[k][1]},${RGB[k][2]},${a})`;
const FILM_MODE = /[?&]film=1/.test(location.search);

/* ── maths: the one function, P(done by m) = Φ((ln(m/plan) − μ)/σ) ── */
const MU = FILM.wall.mu, SIG = FILM.wall.sigma, N = FILM.wall.n;
function PhiInv(p) {   // Acklam
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
// the wall: the k-th bar is the k/(n+1) quantile — identical on every device, the count is exact
const RAT = Array.from({ length: N }, (_, i) => Math.exp(MU + SIG * PhiInv((i + 1) / (N + 1))));
const countBy = (m, plan) => { let k = 0; for (const r of RAT) if (r * plan <= m + 1e-9) k++; return k; };
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const rnd = mulberry32(23);
const ARRIVE = [...Array(N).keys()];   // ARRIVE[j] = sorted index of the j-th bar to arrive
for (let i = N - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [ARRIVE[i], ARRIVE[j]] = [ARRIVE[j], ARRIVE[i]]; }

/* ── easing ── */
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const seg = (t, a, b) => clamp((t - a) / (b - a));
const ease = (u) => u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
const eout = (u) => 1 - Math.pow(1 - u, 3);
const lerp = (a, b, u) => a + (b - a) * u;
const typed = (s, t, t0, cps = 40) => s.slice(0, Math.max(0, Math.floor((t - t0) * cps)));
const fmtK = (k) => k.toLocaleString('en-US');
const inTen = (k) => Math.round(k / 100);

/* ── state ── */
const state = { date: FILM_MODE ? FILM.defaultDate : null, keep: 'keep', side: null,
                tryOn: false, tryExtra: 0, tryDate: 24, tryCls: 'theses' };

/* ── retained SVG: build once, then mutate ── */
const NS = 'http://www.w3.org/2000/svg';
let svg, L = {}, FR = 0;
const POOL = new Map();
function E(key, tag, layer, attrs, text) {
  let el = POOL.get(key);
  if (!el) { el = document.createElementNS(NS, tag); el._a = {}; (L[layer] || layer).appendChild(el); POOL.set(key, el); }
  el._f = FR;
  for (const k in attrs) { const v = attrs[k]; if (el._a[k] !== v) { el._a[k] = v; if (v === null) el.removeAttribute(k); else el.setAttribute(k, v); } }
  if (text !== undefined && el._t !== text) { el._t = text; el.textContent = text; }
  return el;
}
function endFrame() { for (const el of POOL.values()) { const v = el._f === FR; if (el._vis !== v) { el._vis = v; el.style.display = v ? '' : 'none'; } } }
const FONT = { mono: "'Plex Mono', 'IBM Plex Mono', monospace", disp: "'BSD', 'Big Shoulders Display', sans-serif" };
function tx(key, layer, x, y, s, o = {}) {
  const a = { x: x.toFixed(2), y: y.toFixed(2), 'font-family': FONT[o.fam || 'mono'], 'font-size': o.size || 12, fill: o.fill || C.prussian,
    'text-anchor': o.anchor || 'start', 'letter-spacing': o.ls != null ? o.ls : 0, opacity: o.op != null ? +o.op.toFixed(3) : 1,
    'font-weight': o.weight || (o.fam === 'disp' ? 600 : 400), transform: o.rot ? `rotate(${o.rot} ${x.toFixed(1)} ${y.toFixed(1)})` : null };
  return E(key, 'text', layer, a, s);
}
function ln(key, layer, x1, y1, x2, y2, o = {}) {
  return E(key, 'line', layer, { x1: x1.toFixed(2), y1: y1.toFixed(2), x2: x2.toFixed(2), y2: y2.toFixed(2), stroke: o.stroke || C.prussian,
    'stroke-width': o.w || 0.75, opacity: o.op != null ? +o.op.toFixed(3) : 1, 'stroke-dasharray': o.dash || null, 'stroke-linecap': 'square' });
}
function rc(key, layer, x, y, w, h, o = {}) {
  return E(key, 'rect', layer, { x: x.toFixed(2), y: y.toFixed(2), width: Math.max(0, w).toFixed(2), height: Math.max(0, h).toFixed(2),
    fill: o.fill || 'none', 'fill-opacity': o.fo != null ? o.fo : 1, stroke: o.stroke || 'none', 'stroke-width': o.w || 0, rx: o.rx || 0,
    opacity: o.op != null ? +o.op.toFixed(3) : 1, 'stroke-dasharray': o.dash || null, transform: o.tr || null });
}
// architectural dimension line: oblique ticks, label centred
function dim(key, layer, x1, x2, y, label, op = 1, o = {}) {
  if (op <= 0) return;
  const col = o.stroke || C.prussian;
  ln(key + 'l', layer, x1, y, x2, y, { op, stroke: col, w: o.w || 0.75 });
  ln(key + 'a', layer, x1 - 4, y + 4, x1 + 4, y - 4, { op, stroke: col, w: 1.1 });
  ln(key + 'b', layer, x2 - 4, y + 4, x2 + 4, y - 4, { op, stroke: col, w: 1.1 });
  ln(key + 'c', layer, x1, y - 7, x1, y + 7, { op: op * 0.6, stroke: col });
  ln(key + 'd', layer, x2, y - 7, x2, y + 7, { op: op * 0.6, stroke: col });
  if (label) {
    const w = label.length * (o.size || 12) * 0.6 + 10;
    rc(key + 'bg', layer, (x1 + x2) / 2 - w / 2, y - 8, w, 16, { fill: C.manila, op });
    tx(key + 't', layer, (x1 + x2) / 2, y + 4.3, label, { anchor: 'middle', size: o.size || 12, op, fill: col, weight: 500, ls: '0.06em' });
  }
}
// rubber stamp (chalk face, prussian rim)
function stamp(key, layer, cx, cy, s, text, o = {}) {
  const op = o.op != null ? o.op : 1; if (op <= 0) return;
  const w = (o.w || 120) * s, h = (o.h || 44) * s, rot = o.rot != null ? o.rot : -7;
  const tr = `rotate(${rot} ${cx.toFixed(1)} ${cy.toFixed(1)})`;
  const rim = o.rim || C.prussian;
  rc(key + 'f', layer, cx - w / 2, cy - h / 2, w, h, { fill: C.chalk, stroke: rim, w: 2.4 * s, rx: 5 * s, op, tr });
  rc(key + 'i', layer, cx - w / 2 + 4 * s, cy - h / 2 + 4 * s, w - 8 * s, h - 8 * s, { stroke: rim, w: 0.9 * s, rx: 3 * s, op, tr });
  const t = tx(key + 't', layer, cx, cy + (o.fs || 26) * s * 0.36, text, { fam: 'disp', size: (o.fs || 26) * s, anchor: 'middle', fill: rim, op, ls: '0.08em' });
  t.setAttribute('transform', tr);
}

/* ── layout ── */
const G = { x0: 200, axisY: 360 };                     // Gantt sheet (Ch 0–3, 6)
const W = { x0: 70, x1: 646, top: 116, bot: 372, planY: 380, planH: 12, axisY: 402 };   // the wall sheet
W.ppm = (W.x1 - W.x0) / 42; W.gap = 0.5; W.rowH = (W.bot - W.top - (N / 50 - 1) * W.gap) / N;   // a 1 px gap (at 1080p) every 50 bars: countable
const wx = (m) => W.x0 + m * W.ppm;
const RC = { x: 700, w: 230 };                          // right column
const TASKS = [['DISCOVERY', 1], ['DESIGN', 2], ['BUILD', 5], ['TEST', 2], ['LAUNCH', 2]];
const EXTRA = [['SECURITY', 1], ['DATA', 1], ['TRAINING', 1], ['MIGRATION', 1], ['AUDIT', 1], ['HANDOVER', 1]];

/* ── p5 layer ── */
let P = null, ctx = null, ground = null, readyRes, readyP = new Promise(r => (readyRes = r));
function makeGround(p) {
  const g = p.createGraphics(960, 540); g.pixelDensity(2);
  const gc = g.drawingContext;
  gc.fillStyle = C.manila; gc.fillRect(0, 0, 960, 540);
  // diazo bloom: two large soft blotches (noise, 2 %), print-roller banding (1.5 %), the tender-envelope crease at x = 640 (3 %)
  p.noiseSeed(1959);
  const lo = p.createGraphics(240, 135); lo.pixelDensity(1); lo.loadPixels();
  for (let y = 0; y < 135; y++) for (let x = 0; x < 240; x++) {
    const n = p.noise(x * 0.012, y * 0.012);
    const b1 = Math.exp(-(((x - 70) ** 2) / 3000 + ((y - 40) ** 2) / 1400)), b2 = Math.exp(-(((x - 185) ** 2) / 2600 + ((y - 100) ** 2) / 1200));
    const a = (0.55 * (b1 + b2) + 0.45 * n) * 0.05;
    const i = 4 * (y * 240 + x); lo.pixels[i] = 120; lo.pixels[i + 1] = 95; lo.pixels[i + 2] = 50; lo.pixels[i + 3] = Math.round(a * 255);
  }
  lo.updatePixels();
  gc.imageSmoothingEnabled = true; gc.drawImage(lo.elt, 0, 0, 960, 540);
  for (let y = 0; y < 540; y += 3) { gc.fillStyle = `rgba(90,70,40,${0.015 * (0.5 + 0.5 * Math.sin(y * 0.21))})`; gc.fillRect(0, y, 960, 1); }
  const cg = gc.createLinearGradient(634, 0, 646, 0);
  cg.addColorStop(0, 'rgba(70,50,20,0)'); cg.addColorStop(0.5, 'rgba(70,50,20,0.03)'); cg.addColorStop(0.55, 'rgba(255,250,235,0.05)'); cg.addColorStop(1, 'rgba(70,50,20,0)');
  gc.fillStyle = cg; gc.fillRect(634, 0, 12, 540);
  return g;
}
// red pencil: straightedge stroke, 1.6 px, noise wobble ±0.6, 3 px overshoot, drawn to fraction u
function pencil(x1, y1, x2, y2, u = 1, seed = 0, o = {}) {
  if (u <= 0) return;
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
  const ov = o.over != null ? o.over : 3;
  const ax = x1 - ux * ov, ay = y1 - uy * ov, L2 = len + 2 * ov;
  const n = Math.max(6, Math.round(L2 / 6)), m = Math.max(1, Math.round(n * u));
  ctx.save(); ctx.strokeStyle = o.col || rgba('red', o.a != null ? o.a : 0.85); ctx.lineWidth = o.w || 1.6; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath();
  for (let i = 0; i <= m; i++) {
    const s = i / n, w = (P.noise(seed * 7.13 + i * 0.35) - 0.5) * 1.2;
    const x = ax + ux * L2 * s - uy * w, y = ay + uy * L2 * s + ux * w;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.stroke(); ctx.restore();
}
// a red-pencil overrun block: outline + diagonal hatching, drawn to fraction u
function hatch(x, y, w, h, u, seed) {
  if (u <= 0 || w <= 0) return;
  const ww = w * u;
  ctx.save(); ctx.beginPath(); ctx.rect(x - 1, y - 1, ww + 2, h + 2); ctx.clip();
  ctx.strokeStyle = rgba('red', 0.55); ctx.lineWidth = 1;
  for (let k = -h; k < w; k += 4) { ctx.beginPath(); ctx.moveTo(x + k, y + h); ctx.lineTo(x + k + h, y); ctx.stroke(); }
  ctx.restore();
  pencil(x, y, x + ww, y, 1, seed, { over: 2 }); pencil(x, y + h, x + ww, y + h, 1, seed + 0.5, { over: 2 });
  if (u >= 1) pencil(x + w, y - 2, x + w, y + h + 2, 1, seed + 0.8, { over: 1 });
}

/* ── which chapter / card ── */
const CH = FILM.chapters, CARDS = FILM.cards;
const chapterAt = (t) => { let c = CH[0]; for (const x of CH) if (t >= x.t0) c = x; return c; };
const cardAt = (t) => CARDS.find(c => t >= c.t0 && t < c.t1) || null;
const capAt = (t) => { for (const c of FILM.captions) if (t >= c[0] && t < c[1]) return c; return null; };

/* ═════════════ the wall ═════════════ */
// rows: sorted index k sits at y(k) (k = 0 bottom). Before the sort, arrival j sits at y(j).
const rowY = (i) => W.bot - (i + 0.5) * W.rowH - Math.floor(i / 50) * W.gap;
const rowTop = (k) => W.bot - k * W.rowH - Math.floor(Math.max(0, k - 1) / 50) * W.gap;   // top edge of the first k rows
function drawWall(t, o) {
  const plan = o.plan || 12, alpha = o.alpha != null ? o.alpha : 1;
  if (alpha <= 0) return;
  const sortU = o.sortU != null ? o.sortU : 1;
  const cut = o.cut;                 // month cursor: bars finished by it are 'below'
  const hiK = o.hiK != null ? o.hiK : -1;   // highlight the first hiK sorted rows (the count)
  const ribs = o.ribs;               // {t0} — ribs phase
  ctx.save(); ctx.globalAlpha = alpha;
  // one circle through the pivot (Thales): every rib is a chord from the same point, spanning the full plot height
  const R = (W.bot - W.top) - 6, cx = W.x0 + R, cy = W.bot;
  for (let j = 0; j < N; j++) {
    const k = ARRIVE[j], r = RAT[k];
    let y = lerp(rowY(j), rowY(k), ease(sortU));
    const xEnd = Math.min(wx(r * plan), W.x1 + 4), xPlan = Math.min(wx(Math.min(r, 1) * plan), xEnd);
    if (ribs) {
      // fan: ribs sweep out across 6 s (empty field), then drop into rows over the next 6 s
      const f = j / N, ta = ribs.t0 + 5.6 * f, td = ribs.t0 + 6.0 + 5.4 * f;
      if (t < ta) continue;
      const u = ease(seg(t, td, td + 0.6));
      if (u < 1) {
        const a = Math.PI + Math.PI * (0.06 + 0.88 * ((j * 0.6180339887) % 1));   // golden-ratio spread: the shell fills evenly
        const px = W.x0, py = cy, qx = cx + R * Math.cos(a), qy = cy + R * Math.sin(a);
        const x1 = lerp(px, W.x0, u), y1 = lerp(py, y, u), x2 = lerp(qx, xEnd, u), y2 = lerp(qy, y, u);
        const fade = seg(t, ta, ta + 0.25);
        ctx.strokeStyle = u > 0.02 ? rgba('sail', 0.95) : rgba('prussian', 0.32 * fade);
        ctx.lineWidth = u > 0.02 ? 0.6 : 0.45;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        continue;
      }
    }
    const h = W.rowH + 0.06, yy = y - h / 2;
    const below = cut != null && r * plan <= cut + 1e-9;
    const lit = hiK >= 0 && k < hiK;
    ctx.fillStyle = (lit || (cut != null && below && o.litCut !== false)) ? rgba('prussian', 0.52) : (cut != null ? rgba('sail', 0.6) : rgba('sail', 0.95));
    ctx.fillRect(W.x0, yy, xPlan - W.x0, h);
    if (xEnd > xPlan) { ctx.fillStyle = (cut != null && !below) ? rgba('red', 0.42) : rgba('red', 0.5); ctx.fillRect(xPlan, yy, xEnd - xPlan, h); }
  }
  ctx.restore();
}
function wallFrameSvg(t, op, mode) {
  // left label, field ticks
  if (op <= 0) return;
  tx('wl.v', 'labels', 56, (W.top + W.bot) / 2, '1,000 PROJECTS · ONE BAR EACH', { size: 11, anchor: 'middle', op: op * 0.8, rot: -90, ls: '0.12em' });
  tx('wl.n1', 'labels', RC.x, 206, 'THE WALL IS CONSTRUCTED: 1,000 DRAWS', { size: 10.5, op: op * 0.75, ls: '0.02em' });
  tx('wl.n2', 'labels', RC.x, 220, 'FROM A LOG-NORMAL FITTED TO TWO', { size: 10.5, op: op * 0.75, ls: '0.02em' });
  tx('wl.n3', 'labels', RC.x, 234, 'PUBLISHED NUMBERS [BGR 1994]', { size: 10.5, op: op * 0.75, ls: '0.02em' });
}
function wallAxis(t, op, kind, plan = 12) {
  if (op <= 0) return;
  ln('wa.l', 'field', W.x0, W.axisY, W.x1, W.axisY, { op, w: 0.9 });
  for (let m = 0; m <= 42; m += 3) {
    const big = m % 6 === 0;
    ln('wa.t' + m, 'field', wx(m), W.axisY, wx(m), W.axisY + (big ? 6 : 3), { op });
  }
  if (kind === 'ratio') {
    [[0, '0'], [12, '×1'], [24, '×2'], [36, '×3']].forEach(([m, s]) => tx('wa.r' + m, 'field', wx(m), W.axisY + 18, s, { size: 12, anchor: 'middle', op }));
    tx('wa.u', 'field', W.x1, W.axisY + 34, 'TIME TAKEN ÷ TIME PLANNED', { size: 11, anchor: 'end', op: op * 0.8, ls: '0.1em' });
  } else {
    for (let m = 0; m <= 42; m += 6) tx('wa.m' + m, 'field', wx(m), W.axisY + 18, String(m), { size: 12, anchor: 'middle', op });
    tx('wa.u', 'field', W.x1, W.axisY + 34, 'MONTHS', { size: 11, anchor: 'end', op: op * 0.8, ls: '0.14em' });
  }
}
// the plan as a Gantt bar on the wall sheet
function wallPlan(key, t, y, tasks, op, o = {}) {
  if (op <= 0) return;
  let acc = 0;
  tasks.forEach(([nm, d], i) => {
    const u = o.prog ? o.prog[i] : 1;
    rc(key + 's' + i, 'marks', wx(acc), y, d * W.ppm * u, W.planH, { fill: i >= 5 ? C.chalk : C.chalk, fo: 0.9, stroke: C.prussian, w: i >= 5 ? 1.2 : 1.6, op });
    acc += d * u;
  });
  tx(key + 'lbl', 'labels', W.x0 - 6, y + 10, 'PLAN', { size: 11, anchor: 'end', op: op * 0.9, ls: '0.1em', weight: 500 });
  return acc;
}
function cursor(key, t, m, t0, label, o = {}) {
  const u = eout(seg(t, t0, t0 + 0.7)); if (u <= 0) return;
  const x = wx(m);
  pencil(x, W.top - 4, x, lerp(W.top - 4, W.axisY + 2, u), 1, m * 3.1, { a: (o.a || 0.9) * (o.op != null ? o.op : 1), w: o.w || 1.6 });
  const anc = o.anchor || 'start', lx = anc === 'start' ? x + 5 : anc === 'end' ? x - 5 : x;
  if (label && u >= 1) tx(key, 'labels', lx, W.top - 8, label, { size: 12, anchor: anc, fill: C.red, op: seg(t, t0 + 0.6, t0 + 0.9) * (o.op != null ? o.op : 1), weight: 500, rot: 1.5 });
}

/* ═════════════ the Gantt sheet (Ch 0–3) ═════════════ */
const gx = (v, ppu) => G.x0 + v * ppu;
function ganttAxis(t, op, unit, ppu, max, step, extra) {
  if (op <= 0) return;
  ln('ga.l', 'field', G.x0, G.axisY, gx(max, ppu), G.axisY, { op, w: 0.9 });
  for (let v = 0; v <= max; v++) ln('ga.t' + v, 'field', gx(v, ppu), G.axisY, gx(v, ppu), G.axisY + (v % step === 0 ? 6 : 3), { op });
  for (let v = 0; v <= max; v += step) tx('ga.n' + v, 'field', gx(v, ppu), G.axisY + 19, String(v), { size: 12, anchor: 'middle', op });
  tx('ga.u', 'field', gx(max, ppu) + 10, G.axisY + 4, unit, { size: 11, op: op * 0.8, ls: '0.14em' });
  if (extra) extra();
}
const ROWY = [132, 162, 192, 222, 252], SUMY = 296;
function taskRows(t, op, prog, ppu) {
  let acc = 0;
  TASKS.forEach(([nm, d], i) => {
    const u = prog[i], y = ROWY[i];
    const o2 = op * (u > 0 ? 1 : 0.35);
    tx('tr.n' + i, 'labels', G.x0 - 12, y + 4, nm, { size: 12, anchor: 'end', op: o2, ls: '0.08em', weight: 500 });
    ln('tr.g' + i, 'field', G.x0, y, gx(18, ppu), y, { op: op * 0.18, dash: '1 5' });
    if (u > 0) {
      rc('tr.b' + i, 'marks', gx(acc, ppu), y - 7, d * ppu * eout(u), 14, { fill: C.chalk, fo: 0.75, stroke: C.prussian, w: 1.6, op });
      tx('tr.d' + i, 'labels', gx(acc + d, ppu) + 7, y + 4, d + ' MO', { size: 12, op: op * seg(u, 0.6, 1) });
      ln('tr.k' + i, 'field', gx(acc + d, ppu), y + 7, gx(acc + d, ppu), SUMY - 11, { op: op * 0.35 * seg(u, 0.8, 1), dash: '2 3' });
    }
    acc += d;
  });
}
function summaryBar(t, op, prog, ppu, label = 'THE PLAN') {
  tx('sb.n', 'labels', G.x0 - 12, SUMY + 5, label, { size: 12, anchor: 'end', op, ls: '0.08em', weight: 500 });
  let acc = 0, any = false;
  TASKS.forEach(([nm, d], i) => {
    const u = eout(prog[i]);
    if (u > 0) { any = true; rc('sb.s' + i, 'marks', gx(acc, ppu), SUMY - 11, d * ppu * u, 22, { fill: C.chalk, fo: 0.85, stroke: C.prussian, w: 2, op }); }
    acc += d * u;
  });
  if (!any) rc('sb.e', 'marks', G.x0, SUMY - 11, ppu * 0.35, 22, { stroke: C.prussian, w: 2, op, dash: '3 2' });
  return acc;
}
function signatures(t, op) {
  const roles = ['PM', 'ENG', 'DESIGN', 'QA', 'SPONSOR'];
  roles.forEach((r, i) => {
    const ta = T.sig + i * 0.6, u = seg(t, ta, ta + 0.18); if (u <= 0) return;
    const x = G.x0 + i * 92, y = 404, s = lerp(1.25, 1, eout(u));
    const tr = `translate(${x + 40} ${y + 18}) scale(${s.toFixed(3)}) rotate(${(i % 2 ? 2 : -2)}) translate(${-(x + 40)} ${-(y + 18)})`;
    rc('sg.b' + i, 'marks', x, y, 80, 36, { stroke: C.prussian, w: 1, op: op * u, tr, rx: 2 });
    const tt = tx('sg.r' + i, 'labels', x + 6, y + 13, r, { size: 11, op: op * u, ls: '0.1em', weight: 500 }); tt.setAttribute('transform', tr);
    // a signature: a quick looped scrawl, deterministic per role
    let d = `M ${x + 8} ${y + 28}`; const R = mulberry32(31 + i);
    for (let k = 0; k < 7; k++) { const xx = x + 12 + k * 9, yy = y + 22 + R() * 8; d += ` Q ${xx - 3} ${yy - 9 * R()} ${xx} ${yy} T ${xx + 4} ${y + 27}`; }
    E('sg.p' + i, 'path', 'marks', { d, fill: 'none', stroke: C.prussian, 'stroke-width': 1, opacity: op * u, transform: tr });
  });
}
// the stretch: a bar extended in revision steps — hold 0.25, straightedge stroke 0.3, stamp 0.15; never eased
function stretch(key, t, x0, ppu, y, h, from, to, t0, period, stampY, labelFn) {
  const steps = Math.round(to - from); let end = from;
  for (let i = 0; i < steps; i++) {
    const tb = t0 + i * period; if (t < tb + 0.25) break;
    const u = seg(t, tb + 0.25, tb + 0.55);
    hatch(x0 + (from + i) * ppu, y, ppu, h, u, i * 1.7 + 3);
    if (t >= tb + 0.55) {
      end = from + i + 1;
      const sx = x0 + (from + i + 0.5) * ppu, k = seg(t, tb + 0.55, tb + 0.7);
      const s = lerp(1.5, 1, k);
      rc(key + 'st' + i, 'marks', sx - 10, stampY, 20, 15, { fill: C.chalk, stroke: C.red, w: 1.1, rx: 2, op: k, tr: `translate(${sx} ${stampY + 7}) scale(${s.toFixed(3)}) rotate(${i % 2 ? 4 : -4}) translate(${-sx} ${-(stampY + 7)})` });
      tx(key + 'sl' + i, 'labels', sx, stampY + 11.5, labelFn(i), { size: 10.5, anchor: 'middle', fill: C.red, op: k, weight: 500 });
    } else end = from + i + u;
  }
  return end;
}

/* ═════════════ chrome: eyebrow, title block, revision table, caption ═════════════ */
function chrome(t, ch, o = {}) {
  tx('ch.eb', 'chrome', 48, 44, ch.eyebrow, { size: 11.5, ls: '0.2em', op: 0.75, weight: 500 });
  tx('ch.ti', 'chrome', 47, 80, ch.title, { fam: 'disp', size: 31, ls: '0.02em' });
  // trim marks
  [[16, 16, 1, 1], [944, 16, -1, 1], [16, 524, 1, -1], [944, 524, -1, -1]].forEach(([x, y, sx, sy], i) => {
    ln('tm.a' + i, 'chrome', x, y, x + 10 * sx, y, { op: 0.6 }); ln('tm.b' + i, 'chrome', x, y, x, y + 10 * sy, { op: 0.6 });
  });
  // title block 230 × 96
  const bx = RC.x, by = 420, bw = RC.w, bh = 96;
  rc('tb.o', 'chrome', bx, by, bw, bh, { stroke: C.prussian, w: 1.2 });
  ln('tb.v', 'chrome', bx + 150, by, bx + 150, by + bh, { w: 0.75 });
  ln('tb.h1', 'chrome', bx, by + 32, bx + 150, by + 32, { w: 0.75 });
  const open = o.open != null ? o.open : 99;
  tx('tb.p', 'chrome', bx + 8, by + 24, typed('PROJECT SAIL', t, open), { fam: 'disp', size: 21, ls: '0.06em' });
  tx('tb.s', 'chrome', bx + 8, by + 50, typed('SHEET 23 · SCHEDULE', t, open + 0.5), { size: 11, ls: '0.04em' });
  tx('tb.i', 'chrome', bx + 8, by + 67, typed('ISSUED FOR TENDER', t, open + 1.0), { size: 11, ls: '0.04em' });
  tx('tb.c', 'chrome', bx + 8, by + 84, typed('SCALE 1 : 12 MO', t, open + 1.5), { size: 11, ls: '0.04em' });
  tx('tb.d', 'chrome', bx + 190, by + 13, 'DATE', { size: 9.5, anchor: 'middle', op: 0.7, ls: '0.2em' });
  // revision table: 8 rows, typed by each chapter's name phase
  const ry = 256;
  tx('rv.h', 'chrome', bx, ry, 'REVISIONS', { size: 11, ls: '0.2em', op: 0.8, weight: 500 });
  ln('rv.hl', 'chrome', bx, ry + 6, bx + bw, ry + 6, { w: 0.9 });
  FILM.rev.forEach(([tr, s], i) => {
    const y = ry + 24 + i * 18.5;
    ln('rv.l' + i, 'chrome', bx, y + 6, bx + bw, y + 6, { op: 0.3 });
    if (i === 7) return;   // REV H types on the black card
    const txt = typed(s, t, tr, 50);
    const hl = o.readback != null ? seg(t, o.readback + i * 0.7, o.readback + i * 0.7 + 0.25) * (1 - seg(t, o.readback + i * 0.7 + 0.9, o.readback + i * 0.7 + 1.2)) : 0;
    if (hl > 0) rc('rv.hl' + i, 'field', bx - 3, y - 11, bw + 6, 16, { fill: C.chalk, op: hl });
    if (txt) tx('rv.t' + i, 'chrome', bx, y, txt, { size: 11, ls: '0.02em', weight: hl > 0.5 ? 500 : 400 });
  });
}
function caption(t, extraHide) {
  const c = capAt(t); if (!c || extraHide || window.NOCAP) return;
  const op = seg(t, c[0], c[0] + 0.25) * (1 - seg(t, c[1] - 0.25, c[1]));
  rc('cp.r', 'cap', 48, 478, 7, 1.5, { fill: C.red, op });
  tx('cp.t', 'cap', 48, 500, c[2], { size: 14.5, op, weight: 500 });
}
// the seal glyph in the title block slot
const SLOT = { x: RC.x + 190, y: 470 };
function slotStamp(t, op, label) {
  stamp('slot', 'chrome', SLOT.x, SLOT.y + 2, 0.5, label || 'SEALED', { op, w: 120, h: 50, fs: 28 });
}
const dateStr = () => state.date == null ? '?' : (state.date === 'none' ? '—' : String(state.date));

/* ═════════════ scenes ═════════════ */
function sceneGantt(t, ch) {
  // Ch 0–2 (months, 24 px / mo) and Ch 3 (years)
  if (ch.id !== 'ch3') {
    const ppu = 24;
    const axU = seg(t, T.axis, T.axis + 1.5);
    ganttAxis(t, axU, 'MONTHS', ppu, 18, 3);
    const dimp = ch.id === 'ch2' ? lerp(1, 0.5, seg(t, T.dimPlan, T.dimPlan + 0.6)) : 1;
    const prog = TASKS.map((_, i) => seg(t, T.task[i], T.task[i] + 0.8));
    taskRows(t, seg(t, T.axis + 0.6, T.axis + 1.6) * dimp, prog, ppu);
    const end = summaryBar(t, seg(t, 5.0, 5.6) * dimp, prog, ppu);
    if (t >= T.total) tx('sb.tot', 'labels', G.x0, SUMY + 32, typed('1 + 2 + 5 + 2 + 2 = 12 MONTHS', t, T.total, 30), { size: 13, op: dimp, weight: 500 });
    dim('d12', 'labels', gx(0, ppu), gx(12, ppu), SUMY - 24, '12 MO', seg(t, T.dim12, T.dim12 + 0.5) * dimp);
    if (ch.id === 'ch0' || t < 15) signatures(t, 1);
    if (ch.id === 'ch1' && t < 15.6) signatures(t, 1 - seg(t, 15, 15.5));
    if (ch.id === 'ch2') commitBox(t);
  } else {
    const ppu = 27;
    ganttAxis(t, 1, 'YEARS', ppu, 16, 2, () => {
      tx('ga.y0', 'field', gx(0, ppu), G.axisY + 34, '1959', { size: 11, anchor: 'middle', op: 0.75 });
      tx('ga.y1', 'field', gx(14, ppu), G.axisY + 34, '1973', { size: 11, anchor: 'middle', fill: C.red, op: seg(t, T.dim14, T.dim14 + 0.5), weight: 500 });
    });
    // your plan, dim, for scale
    tx('op.pn', 'labels', G.x0 - 12, 154, 'YOUR PLAN', { size: 12, anchor: 'end', op: 0.55, ls: '0.08em', weight: 500 });
    rc('op.pb', 'marks', G.x0, 143, ppu, 14, { fill: C.chalk, fo: 0.8, stroke: C.prussian, w: 1.6, op: 0.55 });
    tx('op.pl', 'labels', G.x0 + ppu + 7, 154, '1 YR', { size: 12, op: 0.55 });
    // the opera house
    const y = 239, h = 22, u = seg(t, T.opera, T.opera + 1.2);
    tx('op.n1', 'labels', G.x0 - 12, y + 9, 'OPERA HOUSE', { size: 12, anchor: 'end', op: u, ls: '0.08em', weight: 500 });
    tx('op.n2', 'labels', G.x0 - 12, y + 24, 'SYDNEY · PLAN', { size: 11, anchor: 'end', op: u * 0.7, ls: '0.08em' });
    rc('op.b', 'marks', G.x0, y, 4 * ppu * eout(u), h, { fill: C.chalk, fo: 0.85, stroke: C.prussian, w: 2, op: 1 });
    const end = stretch('os', t, G.x0, ppu, y, h, 4, 14, T.stretch3, T.stretch3Step, y + h + 7, (i) => 'R' + (i + 1));
    dim('d4', 'labels', gx(0, ppu), gx(4, ppu), y - 18, '4 YR', seg(t, T.opera + 1.2, T.opera + 1.6) * (1 - seg(t, T.stretch3, T.stretch3 + 0.3)));
    dim('d14', 'labels', gx(0, ppu), gx(14, ppu), y - 18, '14 YR', seg(t, T.dim14, T.dim14 + 0.5), { stroke: C.red });
    // cost: $7M, struck in red pencil at the end, $102M written beside
    const cu = seg(t, T.opera + 1.0, T.opera + 1.4);
    tx('op.c0', 'labels', G.x0, y + 66, 'COST', { size: 11, op: cu * 0.8, ls: '0.14em' });
    tx('op.c1', 'labels', G.x0 + 44, y + 67, 'A$7M', { size: 16, op: cu, weight: 500 });
    if (t >= T.cost) {
      pencil(G.x0 + 40, y + 61, G.x0 + 86, y + 61, seg(t, T.cost, T.cost + 0.3), 9);
      tx('op.c2', 'labels', G.x0 + 98, y + 67, 'A$102M', { size: 17, fill: C.red, op: seg(t, T.cost + 0.3, T.cost + 0.6), weight: 500, rot: 2 });
    }
    // right column: the two ratios, with their arithmetic
    const ru = seg(t, T.ratio, T.ratio + 0.5);
    if (ru > 0) {
      tx('op.r1', 'labels', RC.x, 150, '3.5×', { fam: 'disp', size: 54, op: ru });
      tx('op.r1b', 'labels', RC.x + 100, 150, 'THE TIME', { size: 12, op: ru, ls: '0.12em', weight: 500 });
      tx('op.r2', 'labels', RC.x, 214, '14.6×', { fam: 'disp', size: 54, op: ru, fill: C.red });
      tx('op.r2b', 'labels', RC.x + 122, 214, 'THE MONEY', { size: 12, op: ru, ls: '0.12em', weight: 500, fill: C.red });
      tx('op.r3', 'labels', RC.x, 236, '14 ÷ 4 = 3.5 · 102 ÷ 7 = 14.6', { size: 11, op: ru * 0.8 });
    }
  }
}
function commitBox(t) {
  const x = RC.x, y = 104, w = RC.w, h = 128;
  const u = seg(t, T.ask, T.ask + 0.8), slide = ease(seg(t, T.slide, T.slide + 1.2));
  const boxOp = u * (1 - slide);
  rc('cb.o', 'marks', x, y, w, h, { stroke: C.prussian, w: 1.4, dash: '6 4', op: boxOp, fill: C.chalk, fo: 0.35 });
  tx('cb.h', 'labels', x + 14, y + 30, 'YOUR DATE', { fam: 'disp', size: 24, op: boxOp, ls: '0.06em' });
  tx('cb.s', 'labels', x + 14, y + 50, 'DONE IN MONTH …', { size: 11.5, op: boxOp * 0.8, ls: '0.1em' });
  // ruling-pen ring un-draws, 5…1
  const ru = seg(t, T.ring, T.ringEnd);
  if (t >= T.ring && t < T.seal) {
    const cx = x + w - 26, cy = y + 26, R = 14, a = 2 * Math.PI * (1 - ru);
    const p0 = [cx, cy - R], p1 = [cx + R * Math.sin(a), cy - R * Math.cos(a)];
    E('cb.ring', 'path', 'marks', { d: `M ${p0[0]} ${p0[1]} A ${R} ${R} 0 ${a > Math.PI ? 1 : 0} 1 ${p1[0].toFixed(2)} ${p1[1].toFixed(2)}`, fill: 'none', stroke: C.prussian, 'stroke-width': 1.4, opacity: boxOp });
    tx('cb.n', 'labels', cx, cy + 5, String(Math.max(1, 5 - Math.floor((t - T.ring)))), { size: 14, anchor: 'middle', op: boxOp, weight: 500 });
  }
  // the number: in film mode the default is typed; on the page it is the viewer's
  const ds = dateStr();
  let shown = ds;
  if (FILM_MODE && t < T.seal) shown = typed(ds, t, T.typeDate, 2.5) || '__';
  if (!FILM_MODE && state.date == null && t < T.seal) shown = '__';
  tx('cb.v', 'labels', x + w / 2, y + 108, shown, { fam: 'disp', size: 56, anchor: 'middle', op: boxOp * seg(t, T.ask + 0.4, T.ask + 0.8) });
  // the stamp lands, then slides to the title block slot
  if (t >= T.seal) {
    const k = seg(t, T.seal, T.seal + 0.22);
    const sx = lerp(x + w / 2, SLOT.x, slide), sy = lerp(y + 84, SLOT.y + 2, slide), s = lerp(lerp(1.5, 1, eout(k)), 0.5, slide);
    stamp('seal', 'marks', sx, sy, s, 'SEALED', { op: k, w: 120, h: 50, fs: 28 });
  }
}
// the wall sheet: Ch 4, 5, 7, 8
function sceneWall(t, ch) {
  const id = ch.id;
  if (id === 'ch4') {
    wallAxis(t, 1, 'ratio');
    wallFrameSvg(t, seg(t, T.ribs, T.ribs + 1), 'ratio');
    // revise checkpoint: the stamp glows; keep · change
    const gl = seg(t, T.keep, T.keep + 0.4) * (1 - seg(t, T.ribs - 0.4, T.ribs));
    if (gl > 0) rc('kc.g', 'marks', SLOT.x - 40, SLOT.y - 34, 80, 70, { stroke: C.red, w: 1.6, rx: 4, op: gl * (0.6 + 0.4 * Math.sin((t - T.keep) * 6)) });
    chips(t, 'kc', ['KEEP', 'CHANGE'], RC.x, 128, T.keep + 1.0, T.ribs - 0.3, state.keep === 'change' ? 1 : 0, T.keepPick);
    // the opera house, one row on the wall, before the others arrive
    const oo = seg(t, T.keep, T.keep + 0.5) * (1 - seg(t, T.ribs, T.ribs + 1.0));
    if (oo > 0) {
      ctx.save(); ctx.globalAlpha = oo; ctx.fillStyle = rgba('sail', 1); ctx.fillRect(W.x0, W.top + 20, wx(12) - W.x0, 2);
      ctx.fillStyle = rgba('red', 0.6); ctx.fillRect(wx(12), W.top + 20, wx(42) - wx(12), 2); ctx.restore();
      tx('kc.op', 'labels', wx(42), W.top + 13, 'OPERA HOUSE · ×3.5', { size: 11.5, anchor: 'end', fill: C.red, op: oo, weight: 500 });
    }
    const sortU = seg(t, T.sort, T.sort + 1.2);
    drawWall(t, { ribs: t < T.ribs + 12.2 ? { t0: T.ribs } : null, sortU, hiK: t >= T.count300 ? Math.round(300 * eout(seg(t, T.count300, T.count300 + 2.2))) : -1 });
    // ratio 1.0 line
    const lu = seg(t, T.line1, T.line1 + 0.6);
    if (lu > 0) {
      ln('w1.l', 'marks', wx(12), W.top - 2, wx(12), lerp(W.top - 4, W.axisY, lu), { stroke: C.prussian, w: 1.4, dash: '5 3' });
      tx('w1.t', 'labels', wx(12) + 5, W.top - 8, 'ON PLAN ×1', { size: 11.5, anchor: 'start', op: lu, weight: 500 });
    }
    const cu = seg(t, T.count300, T.count300 + 2.2);
    if (cu > 0) {
      const k = Math.round(300 * eout(cu));
      const yk = rowTop(k);
      ln('w3.b', 'marks', wx(12) + 8, W.bot, wx(12) + 8, yk, { stroke: C.prussian, w: 1.4 });
      ln('w3.c', 'marks', wx(12) + 4, yk, wx(12) + 12, yk, { stroke: C.prussian, w: 1.4 });
      tx('w3.t', 'labels', wx(12) + 16, (W.bot + yk) / 2 + 5, String(k), { fam: 'disp', size: 26, op: 1 });
      tx('w3.s', 'labels', wx(12) + 16, (W.bot + yk) / 2 + 20, 'ON OR BEFORE PLAN', { size: 11, op: seg(cu, 0.8, 1) * 0.85, ls: '0.06em' });
    }
    const hu = seg(t, T.hold4, T.hold4 + 0.5);
    if (hu > 0) {
      tx('w4.a', 'labels', RC.x, 126, '300 ON PLAN', { fam: 'disp', size: 30, op: hu });
      tx('w4.b', 'labels', RC.x, 158, '700 PAST IT', { fam: 'disp', size: 30, op: hu, fill: C.red });
    }
    if (t >= T.side - 0.2) chips(t, 'sd', ['THE 300', 'THE 700'], RC.x, 186, T.side, 999, state.side === '300' ? 0 : 1, FILM_MODE ? T.side + 2.4 : 1e9, state.side == null && !FILM_MODE);
    return;
  }
  if (id === 'ch5') {
    wallAxis(t, 1, 'months');
    wallFrameSvg(t, 1);
    const cut = t >= T.count ? 12 : null;
    drawWall(t, { cut, litCut: t >= T.countEnd, hiK: (t >= T.count && t < T.countEnd) ? Math.round(300 * eout(seg(t, T.count, T.countEnd))) : -1 });
    // the plan lowers onto the wall
    const pu = ease(seg(t, T.lower, T.lower + 2.0));
    wallPlan('wp', t, lerp(70, W.planY, pu), TASKS, seg(t, T.lower, T.lower + 0.4));
    cursor('cu12', t, 12, T.cursor, 'MONTH 12', { anchor: 'end' });
    // the count, rounded on top, exact beneath
    const cu = seg(t, T.count, T.countEnd);
    if (cu > 0) {
      const k = Math.round(300 * eout(cu));
      tx('c5.eb', 'labels', RC.x, 100, 'DONE BY MONTH 12', { size: 11.5, ls: '0.14em', op: seg(cu, 0, 0.2), weight: 500 });
      const big = seg(t, T.big - 0.15, T.big + 0.05);
      if (big > 0) tx('c5.big', 'labels', RC.x - 2, 168, '3 IN 10', { fam: 'disp', size: 72, op: big, ls: '0.02em' });
      tx('c5.ex', 'labels', RC.x, big > 0 ? 190 : 140, fmtK(k) + ' ÷ 1,000', { size: big > 0 ? 13 : 22, op: 1, weight: 500 });
    }
    // the seal breaks: the viewer's stamp rides to the axis
    sealReveal(t);
    // two more cursors
    cursor('cu15', t, 15.5, T.cur155, '15½ · HALF');
    cursor('cu23', t, 23, T.cur23, '23 · 8 IN 10');
    const cc = seg(t, T.cur23 + 0.6, T.cur23 + 1.0);
    if (cc > 0) {
      tx('cx15', 'labels', wx(15.5) + 5, W.bot - 58, fmtK(countBy(15.5, 12)) + ' ÷ 1,000', { size: 11, fill: C.red, op: seg(t, T.cur155 + 0.6, T.cur155 + 1), weight: 500 });
      tx('cx23', 'labels', wx(23) + 5, W.bot - 58, fmtK(countBy(23, 12)) + ' ÷ 1,000', { size: 11, fill: C.red, op: cc, weight: 500 });
    }
    dim('d23', 'labels', wx(0), wx(23), W.top + 128, '23 MO', seg(t, T.dim23, T.dim23 + 0.5) * (1 - seg(t, 165.4, 166)), { stroke: C.red });
    return;
  }
  if (id === 'ch7') { sceneVariations(t); return; }
  if (id === 'ch8') { sceneMonday(t); return; }
}
function sealReveal(t) {
  if (t < T.breakSeal) { slotStamp(t, 1); return; }
  const k = seg(t, T.breakSeal, T.breakSeal + 0.3), ride = ease(seg(t, T.ride, T.ride + 1.2));
  const d = state.date, has = typeof d === 'number';
  const m = has ? Math.min(42, Math.max(0, d)) : 12;
  const sx = lerp(SLOT.x, has ? wx(m) : RC.x + 115, ride), sy = lerp(SLOT.y + 2, W.axisY + 46, ride);
  if (ride < 1) { stamp('slot', 'chrome', SLOT.x, SLOT.y + 2, 0.5, 'SEALED', { op: 1 - k }); pencil(SLOT.x - 26, SLOT.y - 10, SLOT.x + 22, SLOT.y + 16, k, 4); }
  stamp('you', 'marks', sx, sy, lerp(0.5, 0.42, ride), has ? 'YOU · ' + d : 'NO DATE', { op: k, w: 120, h: 44, fs: 30, rot: -4, rim: has ? C.prussian : C.concrete });
  if (has && ride >= 1) ln('you.k', 'marks', wx(m), W.axisY + 1, wx(m), W.axisY + 34, { stroke: C.prussian, w: 1.2, op: seg(t, T.ride + 1.2, T.ride + 1.5) });
  // most of us: the plan
  const mu = seg(t, T.most, T.most + 0.5);
  if (mu > 0) tx('most', 'labels', wx(12) + 5, W.top - 22, '← MOST OF US WRITE THE PLAN', { size: 11, fill: C.red, op: mu, weight: 500, rot: 1.5 });
  // red bracket if outside ±2 months of 15½, chalk tick if inside
  const bu = seg(t, T.bracket, T.bracket + 0.6);
  if (has && bu > 0) {
    const inside = Math.abs(d - 15.5) <= 2;
    if (!inside) {
      const y = W.axisY + 58;
      pencil(wx(d), y, wx(15.5), y, bu, 6); pencil(wx(d), y - 5, wx(d), y, bu, 7, { over: 0 }); pencil(wx(15.5), y - 5, wx(15.5), y, bu, 8, { over: 0 });
      const gap = Math.abs(15.5 - d), gs = (gap % 1 === 0.5 ? (Math.floor(gap) || '') + '½' : String(+gap.toFixed(1)));
      tx('gap', 'labels', Math.max(wx(d), wx(15.5)) + (d > 15.5 ? 30 : 8), y + 4, gs + ' MO ' + (d < 15.5 ? 'SHORT OF HALF' : 'PAST HALF'), { size: 11, fill: C.red, op: seg(bu, 0.7, 1), weight: 500 });
    } else tx('gap', 'labels', wx(d) + 30, W.axisY + 50, '✓ WITHIN 2 MO OF HALF', { size: 11, op: seg(bu, 0.5, 1), weight: 500 });
  }
}
function chips(t, key, labels, x, y, t0, t1, pick, pickT, live) {
  const op = seg(t, t0, t0 + 0.4) * (1 - seg(t, t1, t1 + 0.3)); if (op <= 0) return;
  let xx = x;
  labels.forEach((s, i) => {
    const w = s.length * 7.2 + 22, on = t >= pickT && pick === i;
    rc(key + 'c' + i, 'marks', xx, y - 15, w, 22, { stroke: on ? C.red : C.prussian, w: on ? 1.6 : 1, rx: 11, fill: on ? C.chalk : 'none', op });
    tx(key + 't' + i, 'labels', xx + w / 2, y + 0.5, s, { size: 12, anchor: 'middle', op, fill: on ? C.red : C.prussian, weight: 500, ls: '0.06em' });
    xx += w + 10;
  });
}
function sceneTurn(t) {
  // the wall stays (P12: never hidden), tinted to a ghost behind the years sheet
  drawWall(t, { alpha: 0.1 });
  const ppu = 36;
  ganttAxis(t, 1, 'YEARS', ppu, 12, 2);
  const y = 140, h = 20, u = seg(t, T.team, T.team + 1.2);
  tx('tm.n1', 'labels', G.x0 - 12, y + 9, 'TEXTBOOK TEAM', { size: 12, anchor: 'end', op: u, ls: '0.06em', weight: 500 });
  tx('tm.n2', 'labels', G.x0 - 12, y + 24, 'KAHNEMAN ET AL.', { size: 11, anchor: 'end', op: u * 0.7, ls: '0.06em' });
  rc('tm.b', 'marks', G.x0, y, 2 * ppu * eout(u), h, { fill: C.chalk, fo: 0.85, stroke: C.prussian, w: 2 });
  // estimates 1.5–2.5 yr
  const eu = seg(t, T.team + 1.2, T.team + 1.8) * (1 - seg(t, T.stretch6, T.stretch6 + 0.3));
  dim('est', 'labels', gx(1.5, ppu), gx(2.5, ppu), y - 14, '', eu);
  tx('est.t', 'labels', gx(2.5, ppu) + 10, y - 10, 'ESTIMATES 1.5–2.5 YR', { size: 11.5, op: eu, weight: 500 });
  // Fox's sentence as a picture: 10 bars, 6 run 7–10 years, 4 never finish
  const fu = seg(t, T.fox, T.fox + 0.6);
  if (fu > 0) {
    tx('fx.a', 'labels', G.x0, 214, 'SEYMOUR FOX, CURRICULUM EXPERT: TEAMS LIKE THIS · 7–10 YR · 40 % NEVER', { size: 11.5, op: fu, weight: 500 });
    const ends = [7, null, 7.5, 8, null, 9, 9.5, null, 10, null];
    ends.forEach((e, i) => {
      const bu = eout(seg(t, T.tbars + i * 0.3, T.tbars + i * 0.3 + 0.8)); if (bu <= 0) return;
      const yy = 226 + i * 10, len = (e || 12) * ppu * bu;
      rc('fx.b' + i, 'marks', G.x0, yy, len, 6, { fill: C.concrete, fo: e ? 0.75 : 0.35, op: 1 });
      if (!e && bu >= 1) { pencil(G.x0 + len + 2, yy - 2, G.x0 + len + 2, yy + 8, 1, 20 + i, { over: 0 }); pencil(G.x0 + len + 2, yy - 2, G.x0 + len - 3, yy - 2, 1, 30 + i, { over: 0 }); pencil(G.x0 + len + 2, yy + 8, G.x0 + len - 3, yy + 8, 1, 40 + i, { over: 0 }); }
    });
    const nu = seg(t, T.tbars + 3.6, T.tbars + 4.2);
    tx('fx.nv', 'labels', gx(12, ppu) + 10, 262, 'NEVER', { size: 11.5, fill: C.red, op: nu, weight: 500 });
    tx('fx.nt', 'labels', G.x0, 336, 'A PICTURE OF ONE SENTENCE, NOT DATA', { size: 10.5, op: nu * 0.7, ls: '0.08em' });
  }
  // the stretch: 2 → 8 years, in red stamps
  stretch('ts', t, G.x0, ppu, y, h, 2, 8, T.stretch6, T.stretch6Step, y + h + 6, (i) => 'R' + (i + 1));
  dim('d8', 'labels', gx(0, ppu), gx(8, ppu), y - 14, 'IT TOOK 8 YR', seg(t, T.dim8, T.dim8 + 0.5), { stroke: C.red });
  // name the turn
  const su = seg(t, T.story, T.story + 0.5);
  if (su > 0) {
    rc('st.b', 'marks', RC.x, 104, RC.w, 110, { fill: C.chalk, fo: 0.7, stroke: C.prussian, w: 1.2, op: su });
    tx('st.1', 'labels', RC.x + 14, 138, 'THE PLAN', { fam: 'disp', size: 26, op: su });
    tx('st.2', 'labels', RC.x + 14, 156, 'IS A STORY ABOUT US', { size: 11.5, op: su, weight: 500 });
    tx('st.3', 'labels', RC.x + 14, 188, 'THE WALL', { fam: 'disp', size: 26, op: su, fill: C.red });
    tx('st.4', 'labels', RC.x + 14, 206, 'IS A COUNT OF THEM', { size: 11.5, op: su, fill: C.red, weight: 500 });
  }
}
function planWith(extra) { return TASKS.concat(EXTRA.slice(0, extra)); }
function sceneVariations(t) {
  const tryOn = state.tryOn && !FILM_MODE;
  wallAxis(t, 1, 'months');
  wallFrameSvg(t, 1);
  let extra, planM, date, phase;
  if (tryOn) {
    extra = state.tryExtra; planM = 12 + extra; date = state.tryDate; phase = state.tryCls === 'megaprojects' ? 'mega' : 'try';
  } else {
    const a = [0, 1, 2].map(i => seg(t, T.addTasks + 0.6 + i * 0.8, T.addTasks + 1.2 + i * 0.8));
    const reset = seg(t, T.padReset, T.padReset + 0.6);
    extra = (a[0] + a[1] + a[2]) * (1 - reset);
    planM = 12 + extra;
    date = t < T.padReset ? planM : lerp(12, 24, ease(seg(t, T.padA, T.padB)));
    phase = t < T.padReset ? 'tasks' : (t < T.mega ? 'pad' : 'mega');
  }
  const progs = TASKS.map(() => 1).concat(EXTRA.map((_, i) => clamp(extra - i)));
  const tasksAll = TASKS.concat(EXTRA);
  // the wall rescales with the plan (ratio 1 = plan): the count is invariant
  const wallA = phase === 'mega' ? 0.25 : 1;
  const k = countBy(date, planM);
  drawWall(t, { plan: planM, cut: date, alpha: wallA });
  wallPlan('vp', t, W.planY, tasksAll, 1, { prog: progs });
  if (phase === 'tasks' && !tryOn) {
    chips(t, 'vt', ['+ 3 TASKS'], 420, 318, T.addTasks, T.padReset - 0.3, 0, T.addTasks + 0.4);
    const nu = seg(t, T.addTasks + 0.6, T.addTasks + 1.2);
    tx('vt.n', 'labels', 420, 344, 'SECURITY 1 · DATA 1 · TRAINING 1', { size: 11, op: nu * (1 - seg(t, T.padReset - 0.3, T.padReset)), weight: 500 });
  }
  // cursor at the promised date
  const x = wx(date);
  if (phase === 'mega') { const mu = tryOn ? 1 : seg(t, T.mega, T.mega + 0.6);
    pencil(x, W.top - 4, x, lerp(W.axisY + 2, 147, mu), 1, 77, {}); if (mu > 0) pencil(x, 303, x, W.axisY + 2, mu, 78, {}); }
  else pencil(x, W.top - 4, x, W.axisY + 2, 1, 77, {});
  tx('vc.l', 'labels', x + 5, W.top - 8, (Math.round(date * 2) / 2 % 1 ? Math.floor(date) + '½' : String(Math.round(date))) + (phase === 'tasks' && !tryOn ? ' · THE PLAN' : ''), { size: 12, fill: C.red, weight: 500, rot: 1.5 });
  if (phase === 'pad' || (tryOn && phase === 'try')) {
    // ghost cursors stay
    [12, 23].forEach((m, i) => { pencil(wx(m), W.top - 2, wx(m), W.axisY, 1, 90 + i, { a: 0.3, w: 1.1 }); });
  }
  if (phase !== 'mega') {
    const rounded = inTen(k);
    tx('v.eb', 'labels', RC.x, 100, (tryOn ? 'PLAN ' + planM + ' · ' : '') + 'DONE BY MONTH ' + (Math.round(date * 2) / 2), { size: 11.5, ls: '0.12em', weight: 500 });
    tx('v.big', 'labels', RC.x - 2, 168, rounded + ' IN 10', { fam: 'disp', size: 72 });
    tx('v.ex', 'labels', RC.x, 190, fmtK(k) + ' ÷ 1,000', { size: 13, weight: 500 });
    if (!tryOn && phase === 'pad') {
      const su = seg(t, T.padA, T.padA + 0.4);
      // padding slider, drawn on the sheet
      const sx0 = 430, sx1 = 636, sy = 340;
      ln('ps.l', 'marks', sx0, sy, sx1, sy, { op: su * 0.7, w: 1 });
      [6, 12, 24, 36].forEach(m => { const xx = lerp(sx0, sx1, (m - 6) / 30); ln('ps.m' + m, 'marks', xx, sy - 3, xx, sy + 3, { op: su * 0.6 }); tx('ps.n' + m, 'labels', xx, sy + 17, String(m), { size: 11, anchor: 'middle', op: su * 0.8 }); });
      const kx = lerp(sx0, sx1, (date - 6) / 30);
      rc('ps.k', 'marks', kx - 5, sy - 8, 10, 16, { fill: C.chalk, stroke: C.red, w: 1.6, op: su });
      tx('ps.t', 'labels', sx0, sy - 14, 'PADDING · THE DATE YOU PROMISE', { size: 11, op: su * 0.85, ls: '0.08em', weight: 500 });
    }
  } else {
    const mu = tryOn ? 1 : seg(t, T.mega, T.mega + 0.6);
    if (!tryOn) chips(t, 'vm', ['THESES', 'TEXTBOOKS', 'MEGAPROJECTS'], 300, 344, T.mega - 0.4, 999, 2, T.mega);
    const bx = 150, by = 150, bw = 420, bh = 150;
    rc('mg.b', 'marks', bx, by, bw, bh, { fill: C.chalk, fo: 0.94, stroke: C.prussian, w: 1.4, op: mu });
    tx('mg.1', 'labels', bx + 20, by + 32, 'MEGAPROJECTS · 16,000 IN THE DATABASE', { size: 12, op: mu, ls: '0.06em', weight: 500 });
    tx('mg.2', 'labels', bx + 20, by + 82, '8.5 %', { fam: 'disp', size: 50, op: mu });
    tx('mg.3', 'labels', bx + 130, by + 74, 'ON TIME AND ON BUDGET', { size: 12, op: mu, weight: 500 });
    tx('mg.4', 'labels', bx + 20, by + 118, '0.5 %  + ON BENEFITS', { size: 14, op: mu, fill: C.red, weight: 500 });
    tx('mg.5', 'labels', bx + 20, by + 138, 'NO DISTRIBUTION DRAWN: WE DO NOT HAVE ONE [FG23]', { size: 10.5, op: mu * 0.75, ls: '0.04em' });
  }
}
function sceneMonday(t) {
  wallAxis(t, 1, 'months');
  wallFrameSvg(t, 1);
  const qa = seg(t, T.q1 - 0.5, T.q1);
  drawWall(t, { cut: 12, alpha: lerp(1, 0.4, qa) });
  wallPlan('mp', t, W.planY, TASKS, 1);
  cursor('m12', t, 12, -10, 'MONTH 12', { anchor: 'end' });
  cursor('m15', t, 15.5, -10, '15½ · HALF', { a: 0.7 });
  cursor('m23', t, 23, -10, '23 · 8 IN 10', { a: 0.7 });
  const d = state.date;
  if (typeof d === 'number') stamp('you', 'marks', wx(Math.min(42, d)), W.axisY + 46, 0.42, 'YOU · ' + d, { w: 120, h: 44, fs: 30, rot: -4 });
  const side = state.side || (FILM_MODE ? '700' : null);
  if (side && typeof d === 'number') {
    const su = seg(t, T.yousaid, T.yousaid + 0.4), x0 = wx(Math.min(42, d)) + 34, s = 'YOU SAID: THE ' + side, w = s.length * 6.6 + 20;
    rc('ys.c', 'marks', x0, W.axisY + 36, w, 20, { stroke: side === '700' ? C.red : C.prussian, w: 1.6, rx: 10, fill: C.chalk, op: su });
    tx('ys.t', 'labels', x0 + w / 2, W.axisY + 50, s, { size: 11, anchor: 'middle', fill: side === '700' ? C.red : C.prussian, op: su, weight: 500, ls: '0.04em' });
  }
  tx('m.eb', 'labels', RC.x, 100, 'DONE BY MONTH 12', { size: 11.5, ls: '0.14em', weight: 500 });
  tx('m.big', 'labels', RC.x - 2, 168, '3 IN 10', { fam: 'disp', size: 72 });
  tx('m.ex', 'labels', RC.x, 190, '300 ÷ 1,000', { size: 13, weight: 500 });
  // the term, named last
  const ou = seg(t, T.outside, T.outside + 0.5);
  if (ou > 0) {
    rc('ov.b', 'marks', W.x0 + 300, W.top + 150, 240, 34, { fill: C.chalk, stroke: C.prussian, w: 1.6, rx: 3, op: ou * (1 - qa) });
    tx('ov.t', 'labels', W.x0 + 420, W.top + 175, 'THE OUTSIDE VIEW', { fam: 'disp', size: 26, anchor: 'middle', op: ou * (1 - qa), ls: '0.06em' });
    tx('ov.s', 'labels', W.x0 + 420, W.top + 200, 'TASK BY TASK = THE INSIDE VIEW', { size: 11, anchor: 'middle', op: ou * (1 - qa) * 0.85, ls: '0.06em' });
  }
  // red pencil writes the two questions
  if (t >= T.q1 - 0.5) {
    const bx = W.x0 + 10, by = W.top + 30;
    rc('q.b', 'marks', bx, by, 560, 104, { fill: C.chalk, fo: 0.93, stroke: C.red, w: 1, op: qa, rx: 2 });
    const q1 = '1 · WHAT IS THIS A CASE OF, AND HOW DID THOSE GO?', q2 = '2 · WHERE ON THAT WALL DOES OUR PLAN SIT?';
    tx('q.1', 'labels', bx + 18, by + 38, typed(q1, t, T.q1, 17), { size: 14.5, fill: C.red, weight: 500, rot: -1 });
    tx('q.2', 'labels', bx + 18, by + 78, typed(q2, t, T.q2, 15), { size: 14.5, fill: C.red, weight: 500, rot: -1 });
    if (t > T.q1 + 3) pencil(bx + 18, by + 45, bx + 18 + q1.length * 8.7, by + 44, seg(t, T.q1 + 3, T.q1 + 3.3), 51, { a: 0.6, w: 1.2 });
    if (t > T.q2 + 2.9) pencil(bx + 18, by + 85, bx + 18 + q2.length * 8.7, by + 84, seg(t, T.q2 + 2.9, T.q2 + 3.2), 52, { a: 0.6, w: 1.2 });
  }
  // the opening sentence returns
  const ru = seg(t, T.ret, T.ret + 0.6);
  if (ru > 0) {
    tx('ret.a', 'labels', W.x0 + 28, W.top + 172, 'FIVE PEOPLE SIGNED 12 MONTHS.', { fam: 'disp', size: 28, op: ru });
    tx('ret.b', 'labels', W.x0 + 28, W.top + 200, 'THE WALL SAID 3 IN 10.', { fam: 'disp', size: 28, op: seg(t, T.ret + 0.8, T.ret + 1.4), fill: C.red });
    rc('ret.bg', 'field', W.x0 + 18, W.top + 145, 330, 66, { fill: C.chalk, fo: 0.92, op: ru });
  }
}

/* ═════════════ cards ═════════════ */
function card(t, c) {
  const a = seg(t, c.t0, c.t0 + 0.4);
  rc('cd.bg', 'card', 0, 0, 960, 540, { fill: C.black, op: a });
  ln('cd.tm1', 'card', 22, 22, 38, 22, { op: a }); ln('cd.tm2', 'card', 22, 22, 22, 38, { op: a });
  const out = 1 - seg(t, c.t1 - 0.35, c.t1);
  const qa = seg(t, c.t0 + 0.3, c.t0 + 0.8) * out;
  const lines = c.q, lh = 54, y0 = 270 - (lines.length - 1) * lh / 2 + 14;
  lines.forEach((s, i) => tx('cd.q' + i, 'card', 480, y0 + i * lh, s, { fam: 'disp', size: 46, anchor: 'middle', fill: C.chalk, op: qa, ls: '0.02em' }));
  if (c.sub) tx('cd.s', 'card', 480, y0 + (lines.length - 1) * lh + 44, c.sub, { size: 13, anchor: 'middle', fill: C.red, op: 0.85 * seg(t, c.t0 + c.subAt, c.t0 + c.subAt + 0.4) * out, ls: '0.18em', weight: 500 });
  if (c.device === 'stamp') stamp('cd.st', 'card', 840, 456, 0.6, 'SEALED', { op: seg(t, c.t0 + 1.2, c.t0 + 1.6) * out, w: 120, h: 50, fs: 28 });
  if (c.device === 'oneof') {
    const blink = (t - c.t0 > 4.0 && t - c.t0 < 4.35) ? 0.15 : 1;
    tx('cd.o1', 'card', 860, 470, '1 of ', { fam: 'disp', size: 34, anchor: 'end', fill: C.chalk, op: seg(t, c.t0 + 1.2, c.t0 + 1.6) * out * 0.85 });
    tx('cd.o2', 'card', 862, 470, '?', { fam: 'disp', size: 34, fill: C.red, op: seg(t, c.t0 + 1.2, c.t0 + 1.6) * out * blink });
  }
  if (c.device === 'count') {
    const u = seg(t, c.t1 - 3, c.t1 - 0.2), n = Math.round(1000 * Math.pow(u, 1.6));
    tx('cd.ct', 'card', 900, 474, fmtK(n), { size: 32, anchor: 'end', fill: C.chalk, op: seg(t, c.t1 - 3.2, c.t1 - 3) * out, weight: 500 });
  }
  if (c.device === 'close') {
    const txt = typed(FILM.rev[7][1], t, FILM.rev[7][0], 30);
    tx('cd.rv', 'card', 900, 478, txt, { size: 12, anchor: 'end', fill: C.chalk, op: 0.8 * (1 - seg(t, T.rollup, T.rollup + 0.3)), ls: '0.04em' });
  }
}
// the sheet roll: black → sheet from the left with a curl shadow
function roll(t, t0, dur = 0.5) {
  const u = seg(t, t0, t0 + dur); if (u >= 1) return;
  const x = 960 * ease(u);
  rc('rl.bk', 'top', x, 0, 960 - x + 2, 540, { fill: C.black });
  E('rl.sh', 'rect', 'top', { x: (x - 14).toFixed(2), y: 0, width: 14, height: 540, fill: 'url(#curl)', opacity: u > 0 ? 1 : 0 });
}

/* ═════════════ render(t) ═════════════ */
let lastT = 0;
function render(t) {
  t = clamp(t, 0, DUR - 1e-6); lastT = t; FR++;
  // canvas
  ctx.setTransform(P.pixelDensity(), 0, 0, P.pixelDensity(), 0, 0);
  ctx.globalAlpha = 1; ctx.clearRect(0, 0, 960, 540);
  ctx.drawImage(ground.elt, 0, 0, 960, 540);
  const c = cardAt(t), ch = chapterAt(t);
  const closing = t >= T.rollup;
  if (closing) sceneClosed(t);
  else {
    // the sheet is drawn under a card until the card is opaque; the card's black hides it
    const sheetVisible = !c || t < c.t0 + 0.4;
    if (sheetVisible) {
      const open = ch.id === 'ch0' ? 0.6 : -99;
      chrome(t, ch, { open, readback: ch.id === 'ch8' ? T.readback : null });
      if (['ch0', 'ch1', 'ch2', 'ch3'].includes(ch.id)) sceneGantt(t, ch);
      else if (ch.id === 'ch6') sceneTurn(t);
      else sceneWall(t, ch);
      if (['ch3', 'ch4'].includes(ch.id)) slotStamp(t, 1);
      if (['ch6', 'ch7', 'ch8'].includes(ch.id)) slotStamp(t, 1, 'OPENED');
      if (ch.id === 'ch8' && t >= T.honesty) honesty(t);
      caption(t, ch.id === 'ch8' && t >= T.honesty);
    }
    if (c) card(t, c);
    // the sheet unrolls at the open and after every card
    if (t < 1.2) roll(t, 0.15, 1.0);
    const prev = CARDS.find(k => t >= k.t1 && t < k.t1 + 0.5);
    if (prev && !c) roll(t, prev.t1, 0.5);
  }
  endFrame();
}
function honesty(t) {
  const u = seg(t, T.honesty, T.honesty + 0.5);
  tx('hn.1', 'cap', 48, 486, '[the wall is fitted to two published numbers (BGR 1994); opera houses,', { size: 12, op: u * 0.85 });
  tx('hn.2', 'cap', 48, 503, ' theses and software are not one class; the Opera House opened scaled down]', { size: 12, op: u * 0.85 });
}
function sceneClosed(t) {
  // CASE CLOSED holds on black; the sheet rolls up over it: a clean sheet, the title block stamped
  const u = ease(seg(t, T.rollup, T.rollup + 1.2));
  const ch = { eyebrow: 'CASE 23 · CLOSED', title: 'Case closed' };
  chrome(t, ch, {});
  tx('cl.r7', 'chrome', RC.x, 256 + 24 + 7 * 18.5, FILM.rev[7][1], { size: 11, ls: '0.02em', fill: C.red, weight: 500 });
  stamp('cl.st', 'marks', 380, 250, 1.4, 'CASE CLOSED', { op: seg(t, T.rollup + 1.0, T.rollup + 1.3), w: 190, h: 54, fs: 34, rim: C.red, rot: -6 });
  tx('cl.s', 'labels', 380, 330, '12 MONTHS: 3 IN 10 · ASK HOW THE LAST THOUSAND WENT', { size: 12, anchor: 'middle', op: seg(t, T.rollup + 1.2, T.rollup + 1.6), ls: '0.1em', weight: 500 });
  slotStamp(t, 1, 'OPENED');
  const x = 960 * u;
  rc('rl.bk', 'top', x, 0, 960 - x + 2, 540, { fill: C.black });
  E('rl.sh', 'rect', 'top', { x: (x - 14).toFixed(2), y: 0, width: 14, height: 540, fill: 'url(#curl)', opacity: u < 1 ? 1 : 0 });
  if (u < 1) {
    tx('cl.q', 'top', 480, 284, 'CASE CLOSED', { fam: 'disp', size: 46, anchor: 'middle', fill: C.chalk, op: 1 - seg(u, 0.2, 0.55) });
    tx('cl.qs', 'top', 480, 328, CARDS[8].sub, { size: 13, anchor: 'middle', fill: C.red, op: 0.85 * (1 - seg(u, 0.1, 0.4)), ls: '0.18em', weight: 500 });
  }
}

/* ═════════════ boot ═════════════ */
function build(stageEl) {
  svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 960 540'); svg.setAttribute('class', 'ex-svg');
  svg.innerHTML = `<defs><linearGradient id="curl" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="0.7" stop-color="#3a2a12" stop-opacity="0.28"/><stop offset="1" stop-color="#E8DCC2" stop-opacity="0.9"/></linearGradient></defs>`;
  ['field', 'marks', 'labels', 'chrome', 'cap', 'card', 'top'].forEach(k => { const g = document.createElementNS(NS, 'g'); g.setAttribute('data-layer', k); svg.appendChild(g); L[k] = g; });
  stageEl.appendChild(svg);
  new p5((p) => {
    p.setup = () => {
      const cnv = p.createCanvas(960, 540); p.pixelDensity(2); p.noLoop();
      cnv.elt.classList.add('ex-canvas');
      cnv.parent(stageEl); stageEl.insertBefore(cnv.elt, svg);
      P = p; ctx = p.drawingContext; p.noiseSeed(23);
      ground = makeGround(p); p.noiseSeed(23);
      readyRes(true);
    };
    p.draw = () => {};
  });
}
window.OPERA = { build, render, state, ready: () => readyP, DUR, countBy, RAT, T, FILM, chapterAt, cardAt, capAt, get t() { return lastT; } };
})();
