/* pedagogy/_shared.js — helpers every pedagogy module uses. They compute geometry and call Material methods only
   (they are scanned by the HOUSE law exactly like modules: no raw drawing here). */
(function (root) {
  'use strict';
  const AM = root.AM, L = AM.layout, U = () => root.Atelier.U;
  const H = AM.P = {};
  const _grid = new Map();

  /** the stage rect (world units) a graph composes into; heads live above it, the count edge below/right of it */
  H.STAGE = Object.freeze({ x: 56, y: 100, w: 848, h: 352 });
  /** the material's folded grid for N runs of k steps (cached) */
  H.grid = function (M, N, k, stage) {
    stage = stage || H.rackRect(M);   // the grid fills the same rect as the rack, so the count edge stays clear
    const key = M.id + '|' + N + '|' + k + '|' + stage.x + stage.y + stage.w + stage.h;
    let g = _grid.get(key); if (!g) { g = L.grid(N, k, stage, M.axis, M.cell); _grid.set(key, g); } return g;
  };
  /** the rack rect: the stage, leaving room for the count edge's numbers */
  H.rackRect = (M, stage = H.STAGE) => (M.axis === 'y' ? { x: stage.x + 8, y: stage.y, w: stage.w - 16, h: stage.h - 34 } : { x: stage.x, y: stage.y + 4, w: stage.w - 208, h: stage.h - 8 });
  /** point on the count edge for value v of N (+ an outward offset d) */
  H.edgePoint = (M, rect, v, N, d = 0) => (M.axis === 'y' ? [rect.x + (v / N) * rect.w, rect.y + rect.h + d] : [rect.x + rect.w + d, rect.y + (v / N) * rect.h]);
  /** the outward direction of the count edge (for labels) */
  H.out = M => (M.axis === 'y' ? [0, 1] : [1, 0]);
  /** a survival curve (fracs[j], j = 0..k) as world points on a rack, revealed to u ∈ [0,1] */
  H.curve = function (M, rect, fracs, k, u = 1) {
    const pts = [], top = u * k;
    for (let j = 0; j <= k; j++) {
      if (j > top) { const a = L.rackPoint(rect, M.axis, fracs[j - 1], j - 1, k), b = L.rackPoint(rect, M.axis, fracs[j], j, k), f = top - (j - 1); pts.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]); break; }
      pts.push(L.rackPoint(rect, M.axis, fracs[j], j, k));
    }
    return pts;
  };
  /** realised silhouette of a racked ensemble (survivors[j] / N) */
  H.realisedFracs = (A, w) => Array.from(A.survivors[w], v => v / A.N);
  H.exactFracs = (A, w) => Array.from(A.exact[w]);
  /** ±2 sd band around the expected count at the count edge, as two short polylines for M.area */
  H.band = function (M, rect, exp, sd, N, depth = 18) {
    const lo = Math.max(0, exp - 2 * sd), hi = Math.min(N, exp + 2 * sd);
    const a = H.edgePoint(M, rect, lo, N, 0), b = H.edgePoint(M, rect, hi, N, 0), a2 = H.edgePoint(M, rect, lo, N, depth), b2 = H.edgePoint(M, rect, hi, N, depth);
    return [[a, b], [a2, b2]];
  };
  /** the structure that holds a grid: one rule per band where its runs start (a needle, a slit, a spine) */
  H.bandRules = function (env, g, a) {
    if (a <= 0) return;
    for (let b = 0; b < g.bands; b++) {
      const i = b * g.perBand, n = Math.min(g.perBand, g.rects.length / 4 - i), R = g.rects;
      const x0 = R[i * 4], y0 = R[i * 4 + 1], last = i + n - 1;
      if (g.axis === 'y') env.M.line(env.S, [[x0 - 4, y0 - 2], [R[last * 4] + R[last * 4 + 2] + 4, y0 - 2]], 'rule', { alpha: a, w: 3.4 });
      else env.M.line(env.S, [[x0 - 2, y0 - 3], [x0 - 2, R[last * 4 + 1] + R[last * 4 + 3] + 3]], 'rule', { alpha: a, w: 1.2 });
    }
  };
  /** draw an ensemble at progress s through Material.units */
  H.drawRuns = (env, A, w, s, o) => env.M.units(env.S, AM.items(A, w, s, o), env.t);
  /** a short head line in screen space (top-left), material type */
  /** words belong to their beat: a stage beat keeps drawing its marks after its window, but its words fade */
  H.own = env => 1 - U().seg(env.u, env.dur, env.dur + 0.5);
  H.head = (env, str, a, o = {}) => env.M.text(env.S, str, o.x ?? 56, o.y ?? 60, Object.assign({ role: 'head', screen: true }, o, { alpha: a * H.own(env) }));
  H.sub = (env, str, a, o = {}) => env.M.text(env.S, str, o.x ?? 56, o.y ?? 86, Object.assign({ role: 'text', screen: true }, o, { alpha: a * H.own(env) }));
  /** fade envelope: in over [t0, t0+fi], out over [t1-fo, t1] */
  H.env = (u, t0, t1, fi = 0.5, fo = 0.5) => Math.min(U().clamp((u - t0) / fi), U().clamp((t1 - u) / fo));
  /** a number + its expectation placed on the count edge: realised marker, expected marker, the label pair */
  H.countAt = function (env, rect, n, a, o = {}) {
    const M = env.M, S = env.S, N = n.N, [ox, oy] = H.out(M), rv = H.edgePoint(M, rect, n.realised, N, 6), ex = H.edgePoint(M, rect, n.exact, N, 6);
    M.mark(S, 'expected', ex[0], ex[1], { alpha: a * (o.expA ?? 1), dir: 1 });
    M.mark(S, 'realised', rv[0], rv[1], { alpha: a, dir: 1 });
    const lx = rv[0] + (M.axis === 'y' ? 0 : 34), ly = rv[1] + (M.axis === 'y' ? 52 : 6);
    M.num(S, n, lx, ly, { alpha: a, show: 'realised', align: M.axis === 'y' ? (rv[0] > 700 ? 'right' : rv[0] < 200 ? 'left' : 'center') : 'left' });
    M.num(S, n, lx, ly + 24, { alpha: a * (o.expA ?? 1), show: 'expected', role: 'num', size: 15, weight: 400, align: M.axis === 'y' ? (rv[0] > 700 ? 'right' : rv[0] < 200 ? 'left' : 'center') : 'left' });
    void ox; void oy;
  };
})(typeof window !== 'undefined' ? window : globalThis);
