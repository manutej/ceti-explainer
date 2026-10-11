/* text-reveal · demo scenes, the p2d painter and the rule checks (demo only; a film uses factory/kit2/text-reveal.js).
   The scenes use the pass-every-time field as real data: 460 tries, 278 passed, 278 / 460 = 60.4 %. */
(function () {
'use strict';
const R = ARSENAL.patterns['text-reveal'], clamp = R.ease.clamp, seg = R.ease.seg, ctx = () => document.createElement('canvas').getContext('2d');

R.paint = function paint(p, prims, tk) {   // prims -> Canvas2D; clip = the mask band, wt = faux weight stroke
  const g = p.drawingContext, C = tk.color;
  prims.forEach((q) => {
    if (!q) return; g.save(); g.globalAlpha = clamp(q.op == null ? 1 : q.op);
    const col = C[q.fill] || q.fill || C.ink, st = C[q.stroke] || q.stroke || col;
    if (q.k === 'text') {
      const f = tk.type[q.fam || 'mono']; if (q.clip) { g.beginPath(); g.rect(0, q.clip[0], 960, q.clip[1] - q.clip[0]); g.clip(); }
      g.font = (f.weight || 400) + ' ' + q.size + 'px "' + f.family + '"'; g.letterSpacing = (q.ls || 0) + 'px';
      g.textAlign = q.anchor === 'middle' ? 'center' : q.anchor === 'end' ? 'right' : 'left';
      g.fillStyle = col; g.fillText(q.s, q.x, q.y); if (q.wt > 0.01) { g.lineWidth = q.wt; g.lineJoin = 'round'; g.strokeStyle = col; g.strokeText(q.s, q.x, q.y); }
    } else if (q.k === 'line') { g.lineWidth = q.w || 1; g.strokeStyle = st; g.beginPath(); g.moveTo(q.x1, q.y1); g.lineTo(q.x2, q.y2); g.stroke(); }
    else { g.beginPath(); g.arc(q.x, q.y, Math.max(0, q.r), 0, 6.2832); if (q.k === 'dot') { g.fillStyle = col; g.fill(); } else { g.lineWidth = q.w || 1.5; g.strokeStyle = st; g.stroke(); } }
    g.restore();
  });
};

/* the field: 23 x 20 = 460 tries; 278 lit (a seeded shuffle, exactly 278) */
const COLS = 23, ROWS = 20, N = 460, PITCH = 12, FX = 470, FY = 140;
const mark = (i) => ({ x: FX + (i % COLS) * PITCH, y: FY + Math.floor(i / COLS) * PITCH });
const rng = (a) => () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const shuf = (seed) => { const r = rng(seed), a = Array.from({ length: N }, (_, i) => i); for (let i = N - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const ORDER = shuf(11);                                              // landing order of the 460 tries (seeded)
const LITSET = new Set(shuf(7).slice(0, 278));                       // 278 of 460 lit
const lit = (i) => LITSET.has(i);
const LITS = Array.from({ length: N }, (_, i) => i).filter(lit);
const field = (g, tk, show) => {   // show(i) -> 0..1 : alpha of mark i
  for (let i = 0; i < N; i++) { const a = show(i); if (a <= 0) continue; const m = mark(i); g.globalAlpha = a; g.fillStyle = lit(i) && show.lit && show.lit(i) ? tk.color.accent : tk.color.line; g.fillRect(m.x, m.y, 9, 9); }
  g.globalAlpha = 1;
};

const S = R.scenes;
const T = (key, s, x, y, size, fam, fill, role, extra) => Object.assign({ key, s, x, y, size, fam, fill, role }, extra);

/* 1 · masked rise and per-line stagger: a five-line panel (in 0.4, out 4.4), a panel that drops from above, an eight-line wave capped at 0.8 s */
S.rise = (p, t, tk) => {
  const L = (a) => a.map((r, i) => T(r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7], r[8]));
  const left = L([['a0', 'CASE · THE TEST FLOOR', 60, 120, 12, 'mono', 'muted', 'chrome', { ls: 2 }], ['a1', 'One cube is one try', 60, 176, 44, 'disp', 'ink', 'must-read'],
    ['a2', 'Each cube is one run of the agent.', 60, 222, 16, 'mono', 'ink', 'secondary'], ['a3', 'Gold means the run passed the tests.', 60, 248, 16, 'mono', 'ink', 'secondary'],
    ['a4', 'Dark means it did not.', 60, 274, 16, 'mono', 'ink', 'secondary']]);
  const right = L([['b0', 'DROPS FROM ABOVE', 520, 120, 12, 'mono', 'muted', 'chrome', { ls: 2 }], ['b1', 'Same mask, other way', 520, 164, 36, 'disp', 'accent', 'must-read'], ['b2', 'for text that sits above its slot.', 520, 196, 16, 'mono', 'ink', 'secondary']]);
  const names = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
  const wave = L(names.map((n, i) => ['c' + i, 'line ' + n, 60, 330 + i * 22, 14, 'mono', i === 7 ? 'accent' : 'muted', 'secondary']));
  R.paint(p, R.lines(t, 0.4, left, {}, 4.4).concat(R.lines(t, 1.2, right, { dir: 'above' }, 5.0), R.lines(t, 2.2, wave, {}, 5.6)), tk);
};

/* 2 · label attach: dot, draw-on leader (9 frames), label; positions come from the gl-labels solver (static ortho camera, hold 0) */
const AT = {};
function placements(tk) {
  if (AT[tk.id]) return AT[tk.id];
  const g = ctx(), meas = (s, z, f) => { const ty = tk.type[f] || tk.type.mono; g.font = (ty.weight || 400) + ' ' + z + 'px "' + ty.family + '"'; return g.measureText(s).width; };
  const w = (i) => { const m = mark(i); return [m.x + 4.5 - 480, m.y + 4.5 - 270, 0]; };
  const an = [{ id: 'try', i: 0, text: 'TRY 1', role: 'secondary' }, { id: 'pass', i: 206, text: '278', sub: 'passed the tests', role: 'result' }, { id: 'last', i: 459, text: 'LAST TRY · 460', role: 'chrome' }]
    .map((a) => Object.assign(a, { x: w(a.i)[0], y: w(a.i)[1], z: 0, priority: 1 }));
  const cam = { eye: [0, 0, 100], look: [0, 0, 0], up: [0, 1, 0], ortho: 1 };
  const q = ARSENAL.patterns['gl-labels'].solve(0, cam, an, { occlusion: false, hold: 0, measure: meas, measureKey: tk.id, leader: 26 }).placements;
  return (AT[tk.id] = new Map(q.map((x) => [x.id, x])));
}
S.attach = (p, t, tk) => {
  const Q = placements(tk), g = p.drawingContext;
  field(g, tk, Object.assign(() => 1, { lit: (i) => lit(i) }));
  const T0 = { try: 0.5, pass: 1.5, last: 2.5 }, T1 = { try: 4.6, pass: 4.9, last: 5.2 };
  const prims = []; ['try', 'pass', 'last'].forEach((id) => { const q = Q.get(id); if (q) prims.push(...R.attach(t, T0[id], q, {}, T1[id])); });
  R.paint(p, prims, tk);
  R.paint(p, R.lines(t, 0.4, [T('h0', 'LABEL ATTACH · GL-LABELS POSITIONS', 60, 120, 12, 'mono', 'muted', 'chrome', { ls: 2 }), T('h1', 'Dot, leader, label', 60, 176, 44, 'disp', 'ink', 'must-read'),
    T('h2', 'The leader draws on in nine frames.', 60, 222, 16, 'mono', 'ink', 'secondary'), T('h3', 'The label rises at its end.', 60, 248, 16, 'mono', 'ink', 'secondary')], {}, 5.6), tk);
};

/* 3 · counters: the 460 tries land at counter-schedule times (the count is the number of marks on screen), then the 278 passes, then 278 / 460 lands as a
   figure with a weight pulse (never rolled); one ring on the last pass at its landing */
S.counter = (p, t, tk) => {
  const g = p.drawingContext, A1 = R.arrivals(0.3, { to: N, claim: 'cubes landed', cdur: 1.6 }), A2 = R.arrivals(2.6, { to: 278, claim: 'passed tries landed', cdur: 1.3 });
  const idx = new Map(ORDER.map((i, k) => [i, k]));            // try i lands as unit idx(i)
  const lk = new Map(LITS.map((i, k) => [i, k]));                // pass i lights as unit lk(i), in field order mixed by ORDER
  const lorder = LITS.slice().sort((a, b) => idx.get(a) - idx.get(b)); lorder.forEach((i, k) => lk.set(i, k));
  const show = (i) => clamp((t - A1[idx.get(i)]) * 15);   // a 2-frame fade-in per mark
  show.lit = (i) => t >= A2[lk.get(i)];
  field(g, tk, show);
  const y1 = 215, y2 = 327, y3 = 450, o1 = { to: N, claim: 'S1: 460 tries, one per cube', cdur: 1.6, arrivals: A1 }, o2 = { to: 278, claim: 'passed tries, recompute.py', cdur: 1.3, arrivals: A2 };
  const prims = [R.counterText(t, 0.3, T('n1', '', 60, y1, 72, 'mono', 'ink', 'must-read'), o1, 6.2), R.counterText(t, 2.6, T('n2', '', 60, y2, 72, 'mono', 'accent', 'must-read'), o2, 6.2),
    R.land(t, 4.3, T('n3', '60.4 %', 60, y3, 72, 'mono', 'accent', 'must-read'), {}, 6.2)];
  [['k1', 'TRIES · ONE CUBE EACH', y1 - 70, 0.3], ['k2', 'PASSED · LIT GOLD', y2 - 70, 2.6], ['k3', '278 / 460 · SHARE THAT PASSED', y3 - 70, 4.3]]
    .forEach((r) => prims.push(...R.lines(t, r[3], [T(r[0], r[1], 60, r[2], 12, 'mono', 'muted', 'chrome', { ls: 2 })], {}, 6.2)));
  const last = mark(lorder[277]), b = R.beat(t, A2[277], last.x + 4.5, last.y + 4.5, { id: 'pass', stroke: 'accent' });
  R.paint(p, prims.concat(b.prims), tk);
};

/* the rule checks the card quotes (the demo's __film.check()) */
R.check = function (tk) {
  const out = {}, e = 1e-9, fr = 30;
  out.wave = [1, 2, 3, 5, 8, 9].map((n) => [n, +R.shape(n).total.toFixed(3)]);   // <= 0.8 for n <= 9
  out.waveOk = out.wave.every((w) => w[1] <= 0.8 + e);
  out.stepFrames = +(R.shape(5).s * fr).toFixed(2);                              // 3 frames
  const exitSum = (n) => { const w = R.shape(n); return w.total * R.D.exit; }; out.exitRatio = R.D.exit; out.exitFor5 = +exitSum(5).toFixed(3);
  const sp = R.span({}); out.attach = { in: +sp.in.toFixed(3), out: +sp.out.toFixed(3), ratio: +(sp.out / sp.in).toFixed(3) };
  const q = { id: 'x', ax: 0, ay: 0, lead: [0, 0, 100, 0], tx: 100, ty: 0, text: 'x', size: 14, fam: 'mono' };
  let lf = 0; for (let k = 0; k <= 60; k++) { const l = R.attach(k / fr, 0, q, {}).find((r) => r.k === 'line'); if (l && l.x2 > 0 && l.x2 < 100 - 1e-6) lf++; }
  out.leaderFrames = lf;                                                         // >= 6
  const o = { to: 460, claim: 'x', cdur: 1.2 }, a = R.arrivals(0, o), n90 = a[Math.floor(460 * 0.9) - 1];
  out.last10Share = +((1.2 - n90) / 1.2).toFixed(3);                             // >= 0.40
  let mono = true, prev = -1, ints = true; for (let k = 0; k <= 1.3 * 600; k++) { const v = R.counter(k / 600, 0, o).value; if (v < prev) mono = false; if (!Number.isInteger(v)) ints = false; prev = v; }
  out.countMonotoneInteger = mono && ints; out.countEnds = R.counter(1.2, 0, o).value;
  let thrown = false; try { R.counter(0, 0, { to: 60.4, claim: 'ratio' }); } catch (x) { thrown = true; } out.ratioRollRefused = thrown;
  const txt = new Set(); for (let k = 0; k <= 90; k++) { const l = R.land(k / fr, 0, { key: 'r', s: '60.4 %', x: 0, y: 0, size: 20 }, {}); if (l) txt.add(l.s); } out.landTextValues = txt.size;   // 1: never rolls
  const rings = []; for (let k = 0; k <= 30; k++) if (R.beat(k / fr, 0.2, 0, 0).prims.length) rings.push(k); out.ringFrames = rings.length; // 3
  const g = ctx(), W = (fam) => { const f = tk.type[fam]; g.font = (f.weight || 400) + ' 40px "' + f.family + '"'; return '0123456789'.split('').map((d) => +g.measureText(d).width.toFixed(2)); };
  const wm = W('mono'), wd = W('disp'); out.digitWidth = { mono: [Math.min(...wm), Math.max(...wm)], disp: [Math.min(...wd), Math.max(...wd)] };
  return out;
};
})();
