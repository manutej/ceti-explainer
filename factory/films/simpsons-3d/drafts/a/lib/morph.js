/* lib/morph.js · morph-type for a WEBGL page: the headline number morphs between words by glyph outline.
   Derived from arsenal/patterns/morph-type/pattern.js: describe / makeShape / xform / resample / buildPlan are that
   module's pairing code (contours paired by area and position, resampled to equal point counts by arc length, start
   index rotated to minimise travel, lerped as a pure function of t). Differences:
   - outlines come from lib/glyphs.js (baked from the brand face by lib/bake_glyphs.py), not p.loadFont / textToContours,
     so there is no async font load and no 55 KB font in the page;
   - a word is a list of parts [text, token]; every contour carries its token, and a pair is painted in the colour of its
     source token blending to its destination token (token 0 men, 1 women, 2 neutral);
   - painting is Canvas2D with the even-odd rule into a p5.Graphics that the film draws as an image in the WEBGL frame
     (the WEBGL path tessellator has no even-odd fill, which the glyph counters need).
   Pure: a function of t and the plans built once in setup. */
(function () {
  'use strict';
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, u) => a + (b - a) * u;
  const EASE = { cubic: (u) => (u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2), sine: (u) => -(Math.cos(Math.PI * u) - 1) / 2 };

  function describe(pts) {
    let a2 = 0, cx = 0, cy = 0, per = 0, x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i], q = pts[(i + 1) % pts.length];
      a2 += p[0] * q[1] - q[0] * p[1]; per += Math.hypot(q[0] - p[0], q[1] - p[1]);
      cx += p[0]; cy += p[1]; x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]);
    }
    return { sgn: a2 < 0 ? -1 : 1, area: Math.abs(a2) / 2, cx: cx / pts.length, cy: cy / pts.length, perim: per, x0, x1, y0, y1 };
  }
  function makeShape(contours) {            // contours: [{pts:[[x,y]..], tok}]
    const cs = [];
    for (const raw of contours) {
      let pts = raw.pts.slice(); if (pts.length < 3) continue;
      let d = describe(pts); const sgn = d.sgn;
      if (sgn < 0) { pts = pts.reverse(); d = describe(pts); }          // one winding for every contour
      cs.push({ pts, sgn, area: d.area, cx: d.cx, cy: d.cy, perim: d.perim, x0: d.x0, x1: d.x1, y0: d.y0, y1: d.y1, tok: raw.tok, hole: false });
    }
    if (cs.length) { const ref = cs.reduce((m, c) => (c.area > m.area ? c : m), cs[0]); cs.forEach((c) => { c.hole = c.sgn !== ref.sgn; }); }
    let x0 = 1e9, x1 = -1e9;
    for (const c of cs) { x0 = Math.min(x0, c.x0); x1 = Math.max(x1, c.x1); }
    if (!cs.length) { x0 = x1 = 0; }
    const tokx = {};                                                      // x range of each token's contours
    for (const c of cs) { const r = tokx[c.tok] || (tokx[c.tok] = [1e9, -1e9]); r[0] = Math.min(r[0], c.x0); r[1] = Math.max(r[1], c.x1); }
    return { cs, x0, x1, tokx };
  }
  function resample(pts, n) {               // closed polyline -> n points equally spaced by arc length
    const m = pts.length, cum = new Float64Array(m + 1);
    for (let i = 0; i < m; i++) { const p = pts[i], q = pts[(i + 1) % m]; cum[i + 1] = cum[i] + Math.hypot(q[0] - p[0], q[1] - p[1]); }
    const L = cum[m], out = []; let j = 0;
    for (let k = 0; k < n; k++) {
      const d = (L * k) / n; while (j < m - 1 && cum[j + 1] < d) j++;
      const p = pts[j], q = pts[(j + 1) % m], seg = cum[j + 1] - cum[j] || 1, u = (d - cum[j]) / seg;
      out.push([lerp(p[0], q[0], u), lerp(p[1], q[1], u)]);
    }
    return out;
  }
  function buildPlan(SA, SB, step, ref) {
    const A = SA.cs, B = SB.cs, tiny = ref * ref * 0.002, cand = [];
    for (let i = 0; i < A.length; i++) for (let j = 0; j < B.length; j++) {
      const dpos = Math.hypot(A[i].cx - B[j].cx, A[i].cy - B[j].cy) / ref;
      const dar = Math.abs(Math.log((A[i].area + tiny) / (B[j].area + tiny)));
      cand.push({ i, j, c: dpos * 2.2 + dar * 0.5 + (A[i].hole !== B[j].hole ? 3 : 0) });
    }
    cand.sort((p, q) => p.c - q.c || p.i - q.i || p.j - q.j);
    const ua = new Set(), ub = new Set(), pr = [];
    for (const k of cand) if (!ua.has(k.i) && !ub.has(k.j)) { ua.add(k.i); ub.add(k.j); pr.push([A[k.i], B[k.j]]); }
    A.forEach((c, i) => { if (!ua.has(i)) pr.push([c, null]); });      // shrinks to a point
    B.forEach((c, j) => { if (!ub.has(j)) pr.push([null, c]); });      // grows from a point
    const pairs = pr.map(([a, b]) => {
      const n = clamp(Math.round(Math.max(a ? a.perim : 0, b ? b.perim : 0) / step), 24, 240);
      const pa = a ? resample(a.pts, n) : Array.from({ length: n }, () => [b.cx, b.cy]);
      let pb = b ? resample(b.pts, n) : Array.from({ length: n }, () => [a.cx, a.cy]);
      if (a && b) {                                                    // rotate start index of B to minimise travel
        let best = 0, bs = 1e30;
        for (let s = 0; s < n; s++) { let acc = 0; for (let k = 0; k < n; k++) { const q = pb[(k + s) % n], p = pa[k]; acc += (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2; if (acc >= bs) break; } if (acc < bs) { bs = acc; best = s; } }
        pb = pb.map((_, k) => pb[(k + best) % n]);
      }
      const buf = new Float32Array(n * 4);
      for (let k = 0; k < n; k++) { buf[4 * k] = pa[k][0]; buf[4 * k + 1] = pa[k][1]; buf[4 * k + 2] = pb[k][0]; buf[4 * k + 3] = pb[k][1]; }
      const ta = a ? a.tok : b.tok, tb = b ? b.tok : a.tok;
      return { n, buf, grow: !a, shrink: !b, ta, tb, key: ta * 4 + tb, x: ((a ? a.cx : b.cx) + (b ? b.cx : a.cx)) / 2, d: 0 };
    });
    const xs = pairs.map((p) => p.x), lo = Math.min(...xs, 0), hi = Math.max(...xs, 1);
    pairs.forEach((p) => { p.d = hi > lo ? (p.x - lo) / (hi - lo) : 0; });  // left-to-right stagger rank
    return { pairs };
  }

  /* wordShape(G, em, parts, ls): parts = [[text, token], ...] -> a Shape left-aligned at x = 0, baseline y = 0 (y down) */
  function wordShape(G, em, parts, ls, gap) {
    const k = em / G.upm, cs = []; let pen = 0;
    parts.forEach((part, pi) => {
      for (const ch of part[0]) {
        const g = G.g[ch]; if (!g) { pen += 0.3 * em; continue; }
        for (const c of g.c) { const pts = []; for (let i = 0; i < c.length; i += 2) pts.push([pen + c[i] * k, c[i + 1] * k]); cs.push({ pts, tok: part[1] }); }
        pen += g.a * k + ls * em;
      }
      if (pi < parts.length - 1) pen += gap * em;
    });
    const sh = makeShape(cs); sh.w = pen; return sh;
  }

  /* build(G, opts): opts = { em, maxW, ls, gap, step, words: [parts...] } -> { em, shapes, plans } ; plan i leads from word i-1 (empty for 0) to word i */
  function build(G, o) {
    let em = o.em;
    const widths = o.words.map((w) => wordShape(G, em, w, o.ls, o.gap).w);
    const wmax = Math.max(...widths); if (wmax > o.maxW) em = em * o.maxW / wmax;
    const shapes = o.words.map((w) => wordShape(G, em, w, o.ls, o.gap));
    const plans = shapes.map((s, i) => buildPlan(i ? shapes[i - 1] : { cs: [], tokx: {} }, s, o.step, em));
    return { em, shapes, plans, ease: o.ease || 'cubic', morph: o.morph, times: o.times, stagger: o.stagger == null ? 0.35 : o.stagger, lift: o.lift == null ? 8 : o.lift };
  }

  /* where(st, t) -> { i: index of the word in force (-1 before the first), u: morph progress 0..1 (1 = settled), e: eased u } */
  function where(st, t) {
    let i = -1; for (let k = 0; k < st.times.length; k++) if (t >= st.times[k]) i = k;
    if (i < 0) return { i: -1, u: 0, e: 0 };
    const u = clamp((t - st.times[i]) / st.morph); return { i, u, e: EASE[st.ease](u) };
  }
  // x centre of token `tok` at t (interpolated between the words), or null
  function tokCentre(st, t, tok) {
    const w = where(st, t); if (w.i < 0) return null;
    const cur = st.shapes[w.i].tokx[tok], prev = w.i ? st.shapes[w.i - 1].tokx[tok] : null;
    const c = (r) => (r[0] + r[1]) / 2;
    if (cur && prev) return lerp(c(prev), c(cur), w.e); return cur ? c(cur) : prev ? c(prev) : null;
  }

  /* paint(ctx, st, t, ox, oy, cols, alpha): cols = [css, css, css] per token (the colour of a token as an [r,g,b] 0..255) */
  function paint(ctx, st, t, ox, oy, cols, alpha) {
    const w = where(st, t); if (w.i < 0 || alpha <= 0) return;
    const plan = st.plans[w.i], groups = new Map();
    for (const pr of plan.pairs) {
      const lu = clamp(w.u * (1 + st.stagger) - pr.d * st.stagger), e = EASE[st.ease](lu);
      if (pr.grow && e < 0.004) continue;
      if (pr.shrink && e > 0.996) continue;
      let g = groups.get(pr.key); if (!g) { g = []; groups.set(pr.key, g); }
      g.push([pr, e, -Math.sin(Math.PI * lu) * st.lift * (w.u > 0 && w.u < 1 ? 1 : 0)]);
    }
    ctx.save(); ctx.globalAlpha = alpha;
    for (const [key, list] of groups) {
      const ta = key >> 2, tb = key & 3, ca = cols[ta], cb = cols[tb];
      ctx.beginPath();
      for (const [pr, e, lift] of list) {
        const b = pr.buf;
        for (let k = 0; k < pr.n; k++) {
          const x = ox + lerp(b[4 * k], b[4 * k + 2], e), y = oy + lift + lerp(b[4 * k + 1], b[4 * k + 3], e);
          if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.closePath();
      }
      ctx.fillStyle = 'rgb(' + [0, 1, 2].map((i) => Math.round(lerp(ca[i], cb[i], w.e))).join(',') + ')';
      ctx.fill('evenodd');
    }
    ctx.restore();
  }

  window.FILM_MORPH = { build, where, tokCentre, paint, wordShape };
})();
