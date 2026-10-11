/* arsenal/patterns/motion-curves: closed-form easing tokens, pure in u = elapsed/duration. Overshoot on marks only, never numbers, text, colour, opacity.
   spring-hero z.72 (3.8 %, 2 % band .54 s) · spring-snappy z.85 (.6 %, .23 s) · expo-out · emph (.2,0,0,1) · ramp (time-warp) · settle (z 1) · anticipate (2 %, 4 frames).
   Same maths in core/timeline.js and gl-camera-rig (demo check() proves parity). .lib = { tokens, ease, move, stagger, spring, bezier, ramp, rampK, anticipate }.
   [[easing-functions]] [[pure-function-of-t]] [[seeded-determinism]] */
(function (root) {
'use strict';
const A = (root.ARSENAL = root.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} });
const cl = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x), S = (x) => x * x * (3 - 2 * x);

/* x(u) = 1 - e^(-zWu)(cos(Wd u) + zW/Wd sin(Wd u)), Wd = W sqrt(1-z^2), W = omega*dur; r tapers the 0.1 % residual so f(1) = 1 */
const spring = (z, W) => {                                           
  z = Math.min(z, 1); const a = z * W, d = W * Math.sqrt(1 - z * z), g = z < 1 ? (u) => Math.cos(d * u) + a / d * Math.sin(d * u) : (u) => 1 + a * u,
    e = (u) => 1 - Math.exp(-a * u) * g(u), r = 1 - e(1), f = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : e(u) + r * u * u * u);
  if (z < 1) f.os = 1; return f;
};
const bezier = (x1, y1, x2, y2) => {                                    // CSS cubic-bezier: Newton on x(s)=u, bisection if it stalls
  const B = (a, b, s) => 3 * a * s * (1 - s) * (1 - s) + 3 * b * s * s * (1 - s) + s * s * s, X = (s) => B(x1, x2, s);
  const D = (s) => 3 * x1 * (1 - s) * (1 - 3 * s) + 3 * x2 * s * (2 - 3 * s) + 3 * s * s;
  return (u) => {
    if (u <= 0 || u >= 1) return u <= 0 ? 0 : 1; let s = u;
    for (let i = 0; i < 8 && Math.abs(D(s)) > 1e-6; i++) s = cl(s - (X(s) - u) / D(s));
    if (Math.abs(X(s) - u) > 1e-6) { let lo = 0, hi = 1; for (let k = 0; k < 40; k++) { s = (lo + hi) / 2; if (X(s) < u) lo = s; else hi = s; } }
    return B(y1, y2, s);
  };
};
const ramp = (k = 6, a = 0.55) => {                                     // rate k until a, then eases to 1 (smoothstep); P = integral / total
  const w = 1 - a, G = (u) => { if (u <= a) return k * u; const x = (u - a) / w; return a * k + w * x + (k - 1) * w * (x - x * x * x + x * x * x * x / 2); }, g = G(1);
  return (u) => (u <= 0 ? 0 : u >= 1 ? 1 : G(u) / g);
};
const rampK = (content, real, a = 0.55) => (content / real - (1 - a) / 2) / (a + (1 - a) / 2);   // k that ends at exactly x1
const emph = bezier(0.2, 0, 0, 1);
const anticipate = (c = 0.02, a = 0.15) => { const f = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : u < a ? -c * S(u / a) : -c + (1 + c) * emph((u - a) / (1 - a))); f.os = 1; return f; };
const expoOut = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : (1 - Math.pow(2, -10 * u)) / (1 - Math.pow(2, -10)));

const tail = (f, band = 0.001) => { let r = 0; for (let i = 0; i <= 600; i++) if (Math.abs(f(i / 600) - 1) > band) r = i / 600; return r; };
const tag = (id, f, dur) => { let o = 0; for (let i = 0; i <= 600; i++) o = Math.max(o, f(i / 600) - 1); return Object.assign(f, { id, dur, over: o, s2: tail(f, 0.02) * dur, rest: tail(f) }); };
const T = { 'spring-hero': [spring(0.72, 11), 1], 'spring-snappy': [spring(0.85, 9), 0.5], 'expo-out': [expoOut, 0.9], emph: [emph, 0.7], ramp: [ramp(), 2],
  settle: [spring(1, 9.6), 0.8], anticipate: [anticipate(), 0.9] }, tokens = {};
for (const k in T) tokens[k] = tag(k, T[k][0], T[k][1]);
const ease = (e) => {                                                   // name | fn | [x1,y1,x2,y2]
  if (typeof e === 'function') return e; if (Array.isArray(e)) return bezier(...e);
  const t = tokens[e || 'emph'] || (A.core && A.core.timeline && A.core.timeline.ease[e]); if (!t) throw new Error('motion-curves: ease ' + e); return t;
};
const move = (t, t0, dur, e) => { const f = ease(e), u = cl((t - t0) / dur); return { x: f(u), u, settled: u >= (f.rest || 1) }; };

/* stagger: offsets in s, earliest 0, span capped at 0.8 s. Entrances only, never tracked marks. */
const offs = (d, gap, cap = 0.8) => { const lo = Math.min(...d), hi = Math.max(...d) - lo, g = hi * gap > cap ? cap / hi : gap, o = d.map((x) => (x - lo) * g); o.span = hi * g; o.gap = g; return o; };
const stagger = {
  linear: (n, gap = 0.06, cap) => offs(Array.from({ length: n }, (_, i) => i), gap, cap),
  centre: (n, gap = 0.06, cap) => offs(Array.from({ length: n }, (_, i) => Math.abs(i - (n - 1) / 2)), gap, cap),
  grid: (R, C, gap = 0.05, o = {}) => {                                 // distance from a cell (row/col): manhattan (default) | euclid | chebyshev
    const f = o.from, [r0, c0] = Array.isArray(f) ? f : f === 'centre' ? [(R - 1) / 2, (C - 1) / 2] : f === 'br' ? [R - 1, C - 1] : [0, 0], d = [];
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) { const a = Math.abs(r - r0), b = Math.abs(c - c0); d.push(o.metric === 'euclid' ? Math.hypot(a, b) : o.metric === 'chebyshev' ? Math.max(a, b) : a + b); }
    return offs(d, gap, o.cap);
  },
};
const lib = { tokens, ease, move, stagger, spring, bezier, ramp, rampK, anticipate, tail };

A.patterns['motion-curves'] = {
  id: 'motion-curves', atlas: ['easing-functions', 'pure-function-of-t', 'seeded-determinism'], renderer: 'p2d',
  params: { dur: 4, t0: 0.9, tokens: ['inout', 'spring-hero', 'emph'], mode: 'lanes', rows: 6, cols: 10, gap: 0.05, from: 'tl', metric: 'manhattan' },
  variants: [
    { name: 'springs', params: { tokens: ['inout', 'spring-hero', 'spring-snappy', 'settle'] } },
    { name: 'curves', params: { tokens: ['inout', 'expo-out', 'emph', 'ramp', 'anticipate'] } },
    { name: 'stagger-grid', params: { mode: 'grid', dur: 3.5, t0: 1, rows: 5, from: 'centre', tokens: ['spring-hero'] } },
  ],
  setup(p, ctx, params) { return { seed: ctx.seed, params }; },                                        // tokens are seedless
  draw() {},                                                                                           // the demo scene is scene.js (not shipped)
  lib,
};
if (typeof module !== 'undefined' && module.exports) module.exports = lib;
})(typeof window !== 'undefined' ? window : globalThis);
