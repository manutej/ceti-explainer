/* text-reveal · masked rise, line stagger, label attach, counters, landing beat (Wave WOW B2; WOW-MOTION 4.1-4.3; P6 P10 P14 P15 P22). Pure in t.
   Returns PRIMS {k:'text'|'line'|'dot'|'ring', key, x, y, op, fill|stroke (pack role or colour)}: R.paint (scenes.js) draws p2d, kit2/text-reveal.js draws kit SVG. */
(function () {
'use strict';
const A = window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} };
const FPS = 30, clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), seg = (t, a, b) => clamp((t - a) / ((b - a) || 1e-9));
const outE = (u, k = 6) => (1 - Math.pow(2, -k * u)) / (1 - Math.pow(2, -k));   // expo-out, 1 at u = 1, no overshoot on text
const inE = (u) => Math.pow(u, 2.2);
/* dur: one line's rise; step: stagger; wave: cap on an entrance; travel: em (> 1 = full mask); exit: 0.6x; dot/lead/lab: attach phases (lead 9 frames);
   k: expo steepness; r: dot radius; pulse: landing pulse s; wt: faux-weight stroke, em; dir: 'below' | 'above' */
const D = { dur: 0.32, step: 0.1, wave: 0.8, travel: 1.05, exit: 0.6, dot: 0.18, lead: 0.3, lab: 0.3, k: 6, r: 3.5, pulse: 0.35, wt: 0.045, dir: 'below', subGap: 3 };
const O = (o) => Object.assign({}, D, o);

function shape(n, o) {   // n lines: rise d, stagger s (>= 2 frames while the cap allows), total <= wave
  o = O(o); let d = o.dur, s = n > 1 ? Math.min(o.step, (o.wave - d) / (n - 1)) : 0;
  if (n > 1 && s < 2 / FPS) { d = Math.max(0.2, o.wave - (n - 1) * 2 / FPS); s = Math.min(o.step, Math.max(0, (o.wave - d) / (n - 1))); }
  return { d, s, total: d + (n - 1) * s };
}
function lineP(t, t0, i, n, o, t1) {   // progress of line i of n in at t0, out at t1 (reverse order, 0.6x, ease-in)
  o = O(o); const w = shape(n, o);
  let p = (o.ease || outE)(seg(t, t0 + i * w.s, t0 + i * w.s + w.d), o.k);
  if (t1 != null && t >= t1) { const a = t1 + (n - 1 - i) * w.s * o.exit; p = Math.min(p, 1 - inE(seg(t, a, a + w.d * o.exit))); }
  return p;
}
function rise(it, p, o) {   // one text in its mask band [y - .95 size, y + .3 size], rising from below (or dropping from above)
  const sz = it.size || 14;
  return Object.assign({ k: 'text' }, it, { y: it.y + (o.dir === 'above' ? -1 : 1) * o.travel * sz * (1 - p), op: (it.op == null ? 1 : it.op) * clamp(p * 3),
    clip: p < 1 ? [it.y - 0.95 * sz, it.y + 0.3 * sz] : null });
}
function lines(t, t0, items, o, t1) {   // items [{key, s, x, y, size, fam, anchor, fill, role}]; o.i / o.n place a group inside a longer stagger
  o = O(o); const n = o.n || items.length, out = [];
  items.forEach((it, j) => { const p = lineP(t, t0, (o.i || 0) + j, n, o, t1); if (p > 0) out.push(rise(it, p, o)); });
  return out;
}
const span = (o) => { o = O(o); const s = o.dot + o.lead + o.lab; return { in: s, out: s * o.exit }; };
/* attach(t, t0, q, o, t1): q = a gl-labels placement {id, ax, ay, lead[x1,y1,x2,y2], tx, ty, sy, text, sub, size, fam, color, dataRole, align, callout}.
   dot, leader draws on, label rises; removal: label, leader, dot at 0.6x */
function attach(t, t0, q, o, t1) {
  o = O(o); const f = o.ease || outE, X = o.exit, key = 'ta.' + q.id + (q.callout ? '.co' : ''), col = q.color || 'ink', a = t0 + o.dot, b = a + o.lead;
  let pd = f(seg(t, t0, a), o.k), pl = f(seg(t, a, b), o.k), pt = f(seg(t, b, b + o.lab), o.k);
  if (t1 != null && t >= t1) { const e1 = t1 + o.lab * X, e2 = e1 + o.lead * X;
    pt = Math.min(pt, 1 - inE(seg(t, t1, e1))); pl = Math.min(pl, 1 - inE(seg(t, e1, e2))); pd = Math.min(pd, 1 - inE(seg(t, e2, e2 + o.dot * X))); }
  const out = [], L = q.lead, an = q.align === 'right' ? 'end' : q.align === 'center' ? 'middle' : 'start', tw = Object.assign({}, o, { travel: o.ltravel || 0.6 });
  if (pd > 0) out.push({ k: 'dot', key: key + '.d', x: q.ax, y: q.ay, r: o.r * pd, fill: col });
  if (pl > 0) out.push({ k: 'line', key: key + '.l', x1: L[0], y1: L[1], x2: L[0] + (L[2] - L[0]) * pl, y2: L[1] + (L[3] - L[1]) * pl, stroke: q.callout ? col : 'muted', w: q.callout ? 1.6 : 1 });
  if (pt > 0) {
    out.push(rise({ key: key + '.t', s: q.text, x: q.tx, y: q.ty, size: q.size, fam: q.fam, anchor: an, fill: col, role: q.dataRole }, pt, tw));
    if (q.sub) out.push(rise({ key: key + '.s', s: q.sub, x: q.tx, y: q.sy + o.subGap, size: q.subSize, fam: q.subFam, anchor: an, fill: 'muted', role: q.subDataRole }, pt, tw));
  }
  return out;
}

/* counters. A count-in rolls REAL counts only: integers, each the number of units landed. Rate = power-out 1 - (1-u)^ck, ck 2.6: the last 10 %
   of the count takes 41 % of the time, speed 0 at the landing. A ratio or percent never rolls: land(). cdur = count-in length. */
const pulse = (dt, d) => { const u = dt / d; return u < 0 || u > 1 ? 0 : u < 0.2 ? u / 0.2 : Math.pow(1 - (u - 0.2) / 0.8, 2); };
function fmt(v, o) { const [a, b] = Math.abs(v).toFixed((o && o.dec) || 0).split('.'); return (v < 0 ? '−' : '') + (o && o.group === false ? a : a.replace(/\B(?=(\d{3})+(?!\d))/g, ',')) + (b ? '.' + b : '') + ((o && o.unit) || ''); }
function cfg(o) {
  o = Object.assign({}, D, { from: 0, cdur: 1.2, ck: 2.6 }, o);
  if (!o.claim) throw new Error('text-reveal counter: pass claim (formula or source of `to`; every digit on screen is a claim)');
  if (!Number.isInteger(o.from) || !Number.isInteger(o.to)) throw new Error('text-reveal counter: a count-in rolls integer counts; a ratio or percent uses land()');
  return o;
}
function arrivals(t0, o) {   // landing time of unit 1..N: land marks at these and the counter is a real count
  o = cfg(o); const N = o.to - o.from; return Array.from({ length: N }, (_, i) => t0 + o.cdur * (1 - Math.pow(1 - (i + 1) / N, 1 / o.ck)));
}
function counter(t, t0, o) {   // o.arrivals (sorted times of the real units) wins over the schedule
  o = cfg(o); const N = o.to - o.from, u = clamp((t - t0) / o.cdur);
  const v = o.from + (o.arrivals ? o.arrivals.filter((a) => a <= t).length : Math.floor(N * (1 - Math.pow(1 - u, o.ck)) + 1e-9));
  const tl = o.arrivals ? o.arrivals[o.arrivals.length - 1] : t0 + o.cdur;
  return { value: v, text: fmt(v, o), landed: t >= tl, tl, pulse: pulse(t - tl, o.pulse), claim: o.claim };
}
function counterText(t, t0, it, o, t1) {   // tabular digits (mono default), faux weight on the landing pulse, rise at t0
  const c = counter(t, t0, o), p = lineP(t, t0, 0, 1, o, t1); o = O(o);
  return p <= 0 ? null : Object.assign(rise(Object.assign({ fam: 'mono' }, it, { s: c.text }), p, o), { tnum: true, wt: c.pulse * o.wt * (it.size || 14) });
}
function land(t, t0, it, o, t1) {   // a ratio / percent: masked rise, then the weight pulse; never rolled
  o = O(o); const p = lineP(t, t0, 0, 1, o, t1); if (p <= 0) return null;
  return Object.assign(rise(it, p, o), { tnum: true, wt: pulse(t - (t0 + shape(1, o).d), o.pulse) * o.wt * (it.size || 14) });
}
function beat(t, tl, x, y, o) {   // silent beat at a landing: one 3-frame ring on the mark (never over a digit) + a nudge scale
  o = Object.assign({ frames: 3, r0: 6, r1: 22 }, o); const u = (t - tl) * FPS / o.frames;
  if (!(u >= 0 && u < 0.999)) return { prims: [], nudge: 1 };
  return { prims: [{ k: 'ring', key: 'ta.ring.' + (o.id || ''), x, y, r: o.r0 + (o.r1 - o.r0) * outE(u), stroke: o.stroke || 'accent', w: 1.5, op: 0.9 * (1 - u) }], nudge: 1 + 0.05 * Math.sin(Math.PI * u) };
}

const R = A.patterns['text-reveal'] = {
  id: 'text-reveal', atlas: ['kinetic-typography', 'easing-functions', 'beats-and-captions', 'explainer-clock'], renderer: 'p2d',
  FPS, D, ease: { out: outE, in: inE, seg, clamp }, shape, lineP, lines, span, attach, arrivals, counter, counterText, land, beat, fmt, pulse, scenes: {},
  params: { dur: 6, scene: 'rise' },
  variants: [{ name: 'rise-stagger', params: { scene: 'rise' } }, { name: 'attach-leader', params: { scene: 'attach' } }, { name: 'counter-land', params: { scene: 'counter' } }],
  setup(p, ctx) { return { tk: ctx.tokens }; },
  draw(p, t, st, params, tk) {   // the scenes and the p2d painter (R.paint) are demo-only: scenes.js
    tk = tk || st.tk; p.drawingContext.fillStyle = tk.color.bg; p.drawingContext.fillRect(0, 0, 960, 540);
    if (R.scenes[params.scene]) return R.scenes[params.scene](p, t, tk);
  },
};
})();
