/* factory/kit2/text-reveal.js · K.reveal: masked rise, per-line stagger, label attach, counters, landing ring (Wave WOW lane B2). OPT-IN.
   film.json: "libs": ["arsenal/patterns/text-reveal/pattern.js", "factory/kit2/text-reveal.js"]   (a film without them builds byte-identical)
   A thin adapter: arsenal/patterns/text-reveal/pattern.js computes prims as a pure function of t; this file draws them through the kit's own
   K.tx / K.ln / K.rc (same signatures, same data-role rules), so G5/G6/G7/G11 read them like any film text. Pure of t: nothing is stored.
   Time: o.t, else K.t (the clock the player seeks). Text drawn here keeps the kit's floors and display-face compensation (K.tx).
   K.reveal.tx(key, layer, x, y, s, o)            o: at (enter, s), out (exit start), i / n (place in a longer stagger), dir 'below'|'above', travel (em)
   K.reveal.block(key, layer, x, y, lines[], o)   one stagger wave, o.lh line height (default 1.3 x size), a line every 3 frames, <= 0.8 s
   K.reveal.label(q, o)                           q = a gl-labels placement (GLL.solve(...).placements[i]); o.at, o.out, o.layer; dot, leader, label
   K.reveal.count(key, layer, x, y, o)            o: at, to, from, claim (required), cdur, arrivals; REAL integer counts only; returns {value, landed, tl}
   K.reveal.land(key, layer, x, y, s, o)          a ratio / percent / final figure: rise then weight pulse, never rolled
   K.reveal.ring(key, layer, x, y, o)             o.at = the landing time; one 3-frame ring on the mark; returns the nudge scale (1 .. 1.05)
   K.reveal.arrivals(t0, o)                       the landing times a count-in implies: land your marks at these; K.reveal.R = the pattern */
(function () {
'use strict';
const K = window.KIT, R = window.ARSENAL && window.ARSENAL.patterns['text-reveal'];
if (!K) throw new Error('K.reveal: window.KIT missing (inline after kit2.js)');
if (!R) throw new Error('K.reveal: inline arsenal/patterns/text-reveal/pattern.js first (film.json libs)');
const C = K.C, NS = 'http://www.w3.org/2000/svg';
const col = (r) => C[r] || r || C.ink;
const T = (o) => (o && o.t != null ? o.t : K.t);
const roleOf = (o, size) => (o && o.role) || (size >= 28 ? 'must-read' : size >= 14 ? 'secondary' : 'chrome');   // the gate's own fallback classes
function clipOf(key, band, layer) {   // a <clipPath> in the same layer, drawn through K.E like every kit element (it leaves the DOM when unused: no history in the page)
  const id = 'rv-' + key.replace(/[^\w-]/g, '_'), cp = K.E('rv.c.' + key, 'clipPath', layer, { id });
  let r = cp.firstChild; if (!r) { r = document.createElementNS(NS, 'rect'); cp.appendChild(r); }
  r.setAttribute('x', -200); r.setAttribute('width', 1360); r.setAttribute('y', band[0].toFixed(2)); r.setAttribute('height', (band[1] - band[0]).toFixed(2));
  return id;
}
function paint(prims, layer, shapes) {
  prims.forEach((q) => {
    if (!q) return; const key = 'rv.' + q.key, c = col(q.fill || q.stroke);
    if (q.k === 'text') {
      const el = K.tx(key, layer, q.x, q.y, q.s, { fam: q.fam, size: q.size, anchor: q.anchor, fill: c, op: q.op, role: roleOf(q, q.size), ls: q.ls, weight: q.weight });
      // the same attributes in the same order every frame (SVG attribute order is part of G2b's byte compare): never add or remove one
      el.setAttribute('clip-path', q.clip ? 'url(#' + clipOf(key, q.clip, layer) + ')' : 'none');
      el.setAttribute('stroke', q.wt > 0.01 ? c : 'none'); el.setAttribute('stroke-width', (q.wt > 0.01 ? q.wt : 0).toFixed(3)); el.setAttribute('stroke-linejoin', 'round');   // faux weight: smooth on any face
      el.setAttribute('style', q.tnum ? 'font-variant-numeric:tabular-nums;font-feature-settings:"tnum" 1' : 'font-variant-numeric:normal');
    } else if (q.k === 'line') K.ln(key, shapes, q.x1, q.y1, q.x2, q.y2, { stroke: col(q.stroke), w: q.w, op: q.op, cap: 'round' });
    else if (q.k === 'dot') K.rc(key, shapes, q.x - q.r, q.y - q.r, 2 * q.r, 2 * q.r, { fill: c, rx: q.r, op: q.op });
    else K.rc(key, shapes, q.x - q.r, q.y - q.r, 2 * q.r, 2 * q.r, { stroke: col(q.stroke), w: q.w, rx: q.r, op: q.op });
  });
}
const item = (key, x, y, s, o) => ({ key, s, x, y, size: o.size || 14, fam: o.fam || 'mono', anchor: o.anchor, fill: o.fill || 'ink', role: o.role, ls: o.ls, weight: o.weight, op: o.op });

const rev = {
  R, arrivals: R.arrivals,
  tx(key, layer, x, y, s, o) { o = o || {}; paint(R.lines(T(o), o.at, [item(key, x, y, s, o)], o, o.out), layer, layer); },
  block(key, layer, x, y, lines, o) {
    o = o || {}; const lh = o.lh || 1.3 * (o.size || 14);
    paint(R.lines(T(o), o.at, lines.map((s, i) => item(key + i, x, y + i * lh, s, o)), o, o.out), layer, layer);
  },
  label(q, o) { o = o || {}; const L = o.layer || 'labels'; paint(R.attach(T(o), o.at, q, o, o.out), L, L); },
  count(key, layer, x, y, o) {
    const t = T(o), c = R.counter(t, o.at, o); paint([R.counterText(t, o.at, item(key, x, y, '', Object.assign({ size: 56 }, o)), o, o.out)], layer, layer);
    return { value: c.value, text: c.text, landed: c.landed, tl: c.tl, pulse: c.pulse };
  },
  land(key, layer, x, y, s, o) { o = o || {}; paint([R.land(T(o), o.at, item(key, x, y, s, Object.assign({ size: 56 }, o)), o, o.out)], layer, layer); },
  ring(key, layer, x, y, o) { o = o || {}; const b = R.beat(T(o), o.at, x, y, Object.assign({ id: key }, o)); paint(b.prims, layer, layer); return b.nudge; },
};
K.reveal = Object.assign(function (kind) { return rev[kind].apply(rev, Array.prototype.slice.call(arguments, 1)); }, rev);
})();
