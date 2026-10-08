/* ════════════════════════════════════════════════════════════════════════════
   marbling.kit.js — MK: ebru as exact, composable, invertible maps (Jaffer & Lu,
   "Mathematical Marbling", IEEE CG&A 2012). No simulation: a pixel's colour is
   the pigment found by pulling the pixel back through the inverse of every
   operation, newest first. Partial operations (a drop landing, a comb mid-drag,
   a skimmer lifting) are the same maps at progress s ∈ [0,1], so any t is exact.

     drop   x' = c + (x−c)·√(1 + r²/|x−c|²)          inverse √(1 − r²/|x'−c|²); inside ⇒ this pigment
     pdrop  the same with r = r(θ) (a shaped drop)     area-preserving in each angular wedge
     comb   x' = x + z·φ(q)·M,  q = x·N invariant      ⇒ inverse subtracts (φ: exact sum of tine kernels)
     wave   x' = x + A·sin(ω·q + φ)·M                  (q invariant) ⇒ inverse subtracts
     swirl  rotate by a·exp(−r²/σ²) about c           (r invariant) ⇒ inverse rotates back
     sweep  a comb/wave mid-drag: points the tines have passed are displaced, those ahead are not:
            a' = a + F(q)·g((front − a)/w), g = smoothstep. Monotone in a when 1.5·|F|/w < 1, so the inverse
            is a 1-D Newton solve along M (q is still invariant). At s = 1 it is exactly the full map.

   Pure, deterministic, no globals besides MK. Shared by shared.film.js and native.film.js.
   ════════════════════════════════════════════════════════════════════════════ */
const MK = (() => {
  'use strict';
  const DROP = 0, COMB = 1, WAVE = 2, SWIRL = 3, PDROP = 4, DRAG = 5, NONE = 9;

  /* tiny counter hash (lowbias32) — the kit is standalone */
  function mix32(x) { x = Math.imul(x ^ (x >>> 16), 0x21f0aaad); x = Math.imul(x ^ (x >>> 15), 0x735a2d97); return (x ^ (x >>> 15)) >>> 0; }
  const hh = (s, a, b) => mix32(mix32(mix32((s | 0) ^ 0x9e3779b9) ^ ((a | 0) + 0x632be5ab)) ^ ((b | 0) + 0x85ebca6b)) / 4294967296;

  /* 64×64 periodic value-noise table (three octaves) for pigment mottle, sampled bilinearly in PRE-IMAGE space,
     so the mottle is carried by the maps exactly like the pigment is (it combs into streaks — the paper look). */
  const NT = 64, NTAB = new Float32Array(NT * NT);
  (() => {
    const lat = (s, n) => { const a = new Float32Array(n * n); for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) a[j * n + i] = hh(s, i, j); return a; };
    const L1 = lat(11, 8), L2 = lat(12, 16), L3 = lat(13, 32);
    const smp = (L, n, x, y) => { x = x * n / NT; y = y * n / NT; const xi = Math.floor(x), yi = Math.floor(y), u = x - xi, v = y - yi;
      const i0 = ((xi % n) + n) % n, j0 = ((yi % n) + n) % n, i1 = (i0 + 1) % n, j1 = (j0 + 1) % n;
      const su = u * u * (3 - 2 * u), sv = v * v * (3 - 2 * v);
      return (L[j0 * n + i0] * (1 - su) + L[j0 * n + i1] * su) * (1 - sv) + (L[j1 * n + i0] * (1 - su) + L[j1 * n + i1] * su) * sv; };
    for (let j = 0; j < NT; j++) for (let i = 0; i < NT; i++) NTAB[j * NT + i] = 0.5 * smp(L1, 8, i, j) + 0.3 * smp(L2, 16, i, j) + 0.2 * smp(L3, 32, i, j);
  })();
  function mottle(x, y) {
    x = x * 9.0; y = y * 9.0;
    const xi = Math.floor(x), yi = Math.floor(y), u = x - xi, v = y - yi;
    const i0 = xi & 63, j0 = yi & 63, i1 = (i0 + 1) & 63, j1 = (j0 + 1) & 63;
    return (NTAB[j0 * NT + i0] * (1 - u) + NTAB[j0 * NT + i1] * u) * (1 - v) + (NTAB[j1 * NT + i0] * (1 - u) + NTAB[j1 * NT + i1] * u) * v;
  }

  /* ── operations ── */
  const op = o => Object.assign({ k: NONE, cx: 0, cy: 0, r: 0, ink: 0, n: 0, e: 0, ph: 0, mx: 1, my: 0, nx: 0, ny: 1, z: 0, sp: 0, lam: 1, q0: 0,
    A: 0, w: 0, a: 0, sig: 1, sw: 0, a0: 0, a1: 0, tag: 0 }, o);
  /** an ink drop of radius r at (cx,cy) */
  const drop = (cx, cy, r, ink, o = {}) => op(Object.assign({ k: DROP, cx, cy, r, ink }, o));
  /** a shaped drop: r(θ) = r·(1 + e·cos(n(θ−ph))) */
  const pdrop = (cx, cy, r, ink, n, e, ph = 0, o = {}) => op(Object.assign({ k: PDROP, cx, cy, r, ink, n, e, ph }, o));
  /** set the sweep of a comb/wave so its front crosses domain {W,H} (enters at s≈0, leaves at s≈1) */
  function sweepOver(o, dom, fmax) {
    const xs = [0, dom.W, 0, dom.W], ys = [0, 0, dom.H, dom.H];
    let lo = Infinity, hi = -Infinity;
    for (let i = 0; i < 4; i++) { const a = xs[i] * o.mx + ys[i] * o.my; lo = Math.min(lo, a); hi = Math.max(hi, a); }
    o.sw = Math.max(1.6 * Math.abs(fmax), 0.12);
    o.a0 = lo - 0.05; o.a1 = hi + o.sw + Math.abs(fmax) + 0.05;
    return o;
  }
  /** a comb drawn in direction `ang` (radians, y down): tines every `sp` across it (sp=0: one tine through q0), displacement z, decay length lam.
   *  o.dom = {W,H} makes it a sweeping (travelling) comb. */
  function comb(ang, z, sp, lam, q0 = 0, o = {}) {
    const c = op(Object.assign({ k: COMB, mx: Math.cos(ang), my: Math.sin(ang), nx: -Math.sin(ang), ny: Math.cos(ang), z, sp, lam, q0 }, o));
    if (o.dom) sweepOver(c, o.dom, z);
    return c;
  }
  /** one needle stroke through (x0,y0) in direction ang */
  const tine = (x0, y0, ang, z, lam, o = {}) => comb(ang, z, 0, lam, -Math.sin(ang) * x0 + Math.cos(ang) * y0, o);
  /** a needle stroke that starts at (x0,y0) and HALTS at (x1,y1) (a finite stroke: points the needle passed are
   *  dragged by z, points ahead are not). At progress s the needle is at lerp(start − run-up, stop, s). */
  function stroke(x0, y0, x1, y1, z, lam, o = {}) {
    const ang = Math.atan2(y1 - y0, x1 - x0), c = comb(ang, z, 0, lam, -Math.sin(ang) * x0 + Math.cos(ang) * y0, o);
    c.sw = Math.max(1.6 * z, o.soft || 0.05); c.stop = 1;
    c.aS = x0 * c.mx + y0 * c.my; c.a1 = x1 * c.mx + y1 * c.my; c.a0 = c.aS;
    return c;
  }
  /** sinusoidal shear: displacement A·sin(w·q + ph) along ang, q = coordinate across ang */
  function wave(ang, A, w, ph = 0, o = {}) {
    const c = op(Object.assign({ k: WAVE, mx: Math.cos(ang), my: Math.sin(ang), nx: -Math.sin(ang), ny: Math.cos(ang), A, w, ph }, o));
    if (o.dom) sweepOver(c, o.dom, A);
    return c;
  }
  /** a drag: tines every `sp` across direction ang (first at q0), carried from a0 to a1 (s = progress); material at
   *  cross-offset d from a tine that the tine has passed is carried a fraction c = c0·φ(d) of the way to the tine:
   *  a' = a + c·(front − a). Exact inverse a = front − (front − a')/(1 − c). o.fronts (per tine) overrides the front
   *  (a tine that lags, e.g. a lane that paused for a check). */
  function drag(ang, sp, lam, q0, a0, a1, c0 = 0.985, o = {}) {
    return op(Object.assign({ k: DRAG, mx: Math.cos(ang), my: Math.sin(ang), nx: -Math.sin(ang), ny: Math.cos(ang), sp, lam, q0, a0, a1, z: c0 }, o));
  }
  const dragC = (o, q) => (o.gauss ? Math.exp(-(((q - o.q0) / o.lam) ** 2)) : combF(o, q));
  const dragFront = (o, q, s) => (o.fx !== undefined ? o.fx : o.fronts ? o.fronts[Math.max(0, Math.min(o.fronts.length - 1, Math.floor((q - o.q0) / o.sp + 0.5)))] : o.a0 + s * (o.a1 - o.a0));
  /** swirl about (cx,cy) by angle a·exp(−r²/sig²) */
  const swirl = (cx, cy, a, sig, o = {}) => op(Object.assign({ k: SWIRL, cx, cy, a, sig }, o));

  /** comb displacement profile at cross-coordinate q: one tine → exp(−|q−q0|/λ); periodic → exact Σ over all tines,
   *  normalised to 1 on a tine (cusp on each tine, smooth between) */
  const LUTN = 1024;
  function combF(o, q) {
    if (o.sp > 0) {
      let L = o.lut;
      if (!L) { L = o.lut = new Float32Array(LUTN + 1); const hs = o.sp / 2, c = Math.cosh(hs / o.lam);
        for (let i = 0; i <= LUTN; i++) L[i] = Math.cosh((i / LUTN * o.sp - hs) / o.lam) / c; }
      const u = (q - o.q0) / o.sp; let f = (u - Math.floor(u)) * LUTN; if (!(f < LUTN)) f = 0; const i = f | 0;   // u−⌊u⌋ can round to 1
      return L[i] + (L[i + 1] - L[i]) * (f - i);
    }
    return Math.exp(-Math.abs(q - o.q0) / o.lam);
  }
  /** displacement magnitude F(q) of a comb/wave (full pass) */
  const shearF = (o, q) => (o.k === COMB ? o.z * combF(o, q) : o.A * Math.sin(o.w * q + o.ph));
  /** sweep blend g(u) and g'(u) */
  const sg = u => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u));
  const sdg = u => (u <= 0 || u >= 1 ? 0 : 6 * u * (1 - u));
  /** front position (along M) of a sweeping op at progress s */
  const frontAt = (o, s) => o.a0 + s * (o.a1 - o.a0);

  /* forward map of one op (used to place things that ride on the pattern) */
  function fwd(o, s, P) {
    const x = P[0], y = P[1];
    switch (o.k) {
      case DROP: case PDROP: {
        const dx = x - o.cx, dy = y - o.cy, d2 = dx * dx + dy * dy || 1e-12;
        let r = o.r; if (o.k === PDROP) r *= 1 + o.e * Math.cos(o.n * (Math.atan2(dy, dx) - o.ph));
        const f = Math.sqrt(1 + r * r * s / d2); P[0] = o.cx + dx * f; P[1] = o.cy + dy * f; return P; }
      case COMB: case WAVE: {
        const q = x * o.nx + y * o.ny, F = shearF(o, q);
        let d;
        if (o.sw > 0 && (s < 1 || o.stop || o.fx !== undefined)) { const a = x * o.mx + y * o.my, fr = o.fx !== undefined ? o.fx : frontAt(o, s); d = F * (sg((fr - a) / o.sw) - (o.aS !== undefined ? sg((o.aS - a) / o.sw) : 0)); }
        else d = F * Math.min(1, s);
        P[0] = x + d * o.mx; P[1] = y + d * o.my; return P; }
      case SWIRL: { const dx = x - o.cx, dy = y - o.cy, th = o.a * s * Math.exp(-(dx * dx + dy * dy) / (o.sig * o.sig)), c = Math.cos(th), sn = Math.sin(th);
        P[0] = o.cx + dx * c - dy * sn; P[1] = o.cy + dx * sn + dy * c; return P; }
      case DRAG: { const q = x * o.nx + y * o.ny, a = x * o.mx + y * o.my, fr = dragFront(o, q, s);
        if (a < fr) { const d = o.z * dragC(o, q) * (fr - a); P[0] = x + d * o.mx; P[1] = y + d * o.my; } return P; }
    }
    return P;
  }
  /** forward-map a point through ops[0..n) at progresses S */
  function forward(ops, S, x, y) { const P = [x, y]; for (let i = 0; i < ops.length; i++) if (S[i] > 0) fwd(ops[i], S[i], P); return P; }

  /**
   * Pull (x,y) back through ops (newest last) at progresses S. Returns the index of the drop whose pigment the
   * point lands in (or −1 for whatever lies beneath all ops). R receives: q (radius fraction at the hit, for the
   * rim), px,py (pre-image position, for mottle / the baked ground), d (index).
   */
  function pull(ops, S, n, x, y, R) {
    for (let i = n - 1; i >= 0; i--) {
      const s = S[i]; if (s <= 0) continue;
      const o = ops[i];
      switch (o.k) {
        case DROP: {
          const dx = x - o.cx, dy = y - o.cy, d2 = dx * dx + dy * dy, r2 = o.r * o.r * s;
          if (d2 < r2) { R.q = Math.sqrt(d2 / r2); R.px = dx / o.r; R.py = dy / o.r; R.d = i; return i; }
          const f = Math.sqrt(1 - r2 / d2); x = o.cx + dx * f; y = o.cy + dy * f; break; }
        case PDROP: {
          const dx = x - o.cx, dy = y - o.cy, d2 = dx * dx + dy * dy;
          const rr = o.r * (1 + o.e * Math.cos(o.n * (Math.atan2(dy, dx) - o.ph))), r2 = rr * rr * s;
          if (d2 < r2) { R.q = Math.sqrt(d2 / r2); R.px = dx / o.r; R.py = dy / o.r; R.d = i; return i; }
          const f = Math.sqrt(1 - r2 / d2); x = o.cx + dx * f; y = o.cy + dy * f; break; }
        case COMB: case WAVE: {
          const q = x * o.nx + y * o.ny, F = shearF(o, q);
          if (o.sw > 0 && (s < 1 || o.stop || o.fx !== undefined)) {
            const ap = x * o.mx + y * o.my, fr = o.fx !== undefined ? o.fx : frontAt(o, s), w = o.sw;
            const aS = o.aS;
            if (aS === undefined) {
              let a = ap - F * sg((fr - ap) / w);                  // one fixed-point step, then Newton
              for (let it = 0; it < 4; it++) { const u = (fr - a) / w, ph = a + F * sg(u) - ap, dp = 1 - F * sdg(u) / w; a -= ph / dp; }
              const d = ap - a; x -= d * o.mx; y -= d * o.my; break;
            }
            let a = ap - F * (sg((fr - ap) / w) - sg((aS - ap) / w));   // finite stroke: dragged between start and needle
            for (let it = 0; it < 5; it++) { const u = (fr - a) / w, v = (aS - a) / w, ph = a + F * (sg(u) - sg(v)) - ap, dp = 1 - F * (sdg(u) - sdg(v)) / w; a -= ph / dp; }
            const d = ap - a; x -= d * o.mx; y -= d * o.my;
          } else { const d = F * (s < 1 ? s : 1); x -= d * o.mx; y -= d * o.my; }
          break; }
        case SWIRL: { const dx = x - o.cx, dy = y - o.cy, th = -o.a * s * Math.exp(-(dx * dx + dy * dy) / (o.sig * o.sig)), c = Math.cos(th), sn = Math.sin(th);
          x = o.cx + dx * c - dy * sn; y = o.cy + dx * sn + dy * c; break; }
        case DRAG: {
          const q = x * o.nx + y * o.ny, ap = x * o.mx + y * o.my, fr = dragFront(o, q, s);
          if (ap < fr) { const c = o.z * dragC(o, q), a = fr - (fr - ap) / (1 - c), d = ap - a; x -= d * o.mx; y -= d * o.my; }
          break; }
      }
    }
    R.q = 0; R.px = x; R.py = y; R.d = -1; return -1;
  }

  /* ── colour ── */
  const hex = h => { h = h.replace('#', ''); const n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  /** palette entry: {c:[r,g,b], rim:[r,g,b] (edge tone), mot: mottle amplitude, rw: rim width (fraction of r)} */
  const ink = (c, rimc, mot = 0.10, rw = 0.16) => ({ c: hex(c), rim: hex(rimc), mot, rw });

  /** colour of one sample → acc (adds). Shared by paint() and bake(). */
  function shade1(ops, S, n, pal, tex, x, y, R, acc, w) {
    const d = pull(ops, S, n, x, y, R);
    if (d < 0 && tex) {                                         // the baked ground at the pre-image (bilinear)
      let fx = (R.px - tex.x0) * tex.ppu - 0.5, fy = (R.py - tex.y0) * tex.ppu - 0.5;
      fx = fx < 0 ? 0 : fx > tex.W - 1.001 ? tex.W - 1.001 : fx; fy = fy < 0 ? 0 : fy > tex.H - 1.001 ? tex.H - 1.001 : fy;
      const xi = fx | 0, yi = fy | 0, u = fx - xi, v = fy - yi, T = tex.rgb, a0 = (yi * tex.W + xi) * 3, a1 = a0 + tex.W * 3;
      for (let c = 0; c < 3; c++) acc[c] += w * ((T[a0 + c] * (1 - u) + T[a0 + 3 + c] * u) * (1 - v) + (T[a1 + c] * (1 - u) + T[a1 + 3 + c] * u) * v);
      return -1;
    }
    if (d < 0) {
      const wat = pal.water, m = 1 + wat.mot * (mottle(R.px * 0.6, R.py * 0.6) - 0.5);
      acc[0] += w * wat.c[0] * m; acc[1] += w * wat.c[1] * m; acc[2] += w * wat.c[2] * m; return -1;
    }
    const P = pal[ops[d].ink];
    const m = 1 + P.mot * (mottle(R.px + d * 3.17, R.py + d * 1.91) - 0.5) * 2;
    let u = (R.q - (1 - P.rw)) / P.rw; u = u < 0 ? 0 : u > 1 ? 1 : u; u = u * u * (3 - 2 * u);
    acc[0] += w * (P.c[0] + (P.rim[0] - P.c[0]) * u) * m; acc[1] += w * (P.c[1] + (P.rim[1] - P.c[1]) * u) * m; acc[2] += w * (P.c[2] + (P.rim[2] - P.c[2]) * u) * m;
    return d;
  }

  /**
   * Paint ops into a rectangle of an RGBA frame F = {data, W, H} (pixels). rect = {x, y, w, h} in F pixels
   * (fractional ok; clipped to F); view = {x0, y0, w, h} domain rect shown in it.
   * opt: ss (1|2) supersample · n (ops[0..n)) · tex (baked ground) · shade(x, y, rgb) final hook (domain coords) ·
   *      clip {x0,y0,x1,y1} (F pixels) · alpha (blend over what is there)
   */
  function paint(F, rect, view, ops, S, pal, opt = {}) {
    const ss = opt.ss || 1, n = opt.n ?? ops.length, R = { q: 0, px: 0, py: 0, d: -1 }, tex = opt.tex || null;
    const cl = opt.clip || { x0: 0, y0: 0, x1: F.W, y1: F.H }, al = opt.alpha ?? 1;
    const i0 = Math.max(0, cl.x0, Math.floor(rect.x)), i1 = Math.min(F.W, cl.x1, Math.ceil(rect.x + rect.w));
    const j0 = Math.max(0, cl.y0, Math.floor(rect.y)), j1 = Math.min(F.H, cl.y1, Math.ceil(rect.y + rect.h));
    if (i1 <= i0 || j1 <= j0 || al <= 0) return;
    const sx = view.w / rect.w, sy = view.h / rect.h, wgt = 1 / (ss * ss), acc = [0, 0, 0], D = F.data;
    for (let j = j0; j < j1; j++) {
      for (let i = i0; i < i1; i++) {
        acc[0] = acc[1] = acc[2] = 0;
        for (let b = 0; b < ss; b++) for (let a = 0; a < ss; a++)
          shade1(ops, S, n, pal, tex, view.x0 + (i - rect.x + (a + 0.5) / ss) * sx, view.y0 + (j - rect.y + (b + 0.5) / ss) * sy, R, acc, wgt);
        if (opt.shade) opt.shade(view.x0 + (i - rect.x + 0.5) * sx, view.y0 + (j - rect.y + 0.5) * sy, acc);
        const k = (j * F.W + i) * 4;
        if (al < 1) { D[k] += (acc[0] - D[k]) * al; D[k + 1] += (acc[1] - D[k + 1]) * al; D[k + 2] += (acc[2] - D[k + 2]) * al; continue; }
        D[k] = acc[0]; D[k + 1] = acc[1]; D[k + 2] = acc[2]; D[k + 3] = 255;
      }
    }
  }
  /** copy a rect of F into another place of F (pixel-aligned; pristine trays share one render) */
  function copyRect(F, sx, sy, w, h, dx, dy) {
    const D = F.data, W = F.W;
    for (let j = 0; j < h; j++) {
      const ys = sy + j, yd = dy + j; if (ys < 0 || ys >= F.H || yd < 0 || yd >= F.H) continue;
      let a = sx, b = dx, len = w;
      if (a < 0) { b -= a; len += a; a = 0; } if (b < 0) { a -= b; len += b; b = 0; }
      len = Math.min(len, W - a, W - b); if (len <= 0) continue;
      D.copyWithin((yd * W + b) * 4, (ys * W + a) * 4, (ys * W + a + len) * 4);
    }
  }

  /** Bake a static op list (the battal ground) into an RGB Float32 texture over domain {x0,y0,w,h} at ppu
   *  pixels per unit. paint(…, {tex}) then reads it at the pre-image instead of re-pulling. */
  function bake(ops, pal, dom, ppu, ss = 1) {
    const W = Math.ceil(dom.w * ppu), H = Math.ceil(dom.h * ppu), F = { W, H, data: new Uint8ClampedArray(W * H * 4) };
    paint(F, { x: 0, y: 0, w: W, h: H }, { x0: dom.x0, y0: dom.y0, w: W / ppu, h: H / ppu }, ops, new Float32Array(ops.length).fill(1), pal, { ss });
    const rgb = new Float32Array(W * H * 3);
    for (let i = 0; i < W * H; i++) { rgb[i * 3] = F.data[i * 4]; rgb[i * 3 + 1] = F.data[i * 4 + 1]; rgb[i * 3 + 2] = F.data[i * 4 + 2]; }
    return { W, H, x0: dom.x0, y0: dom.y0, ppu, rgb };
  }

  /** a CPU frame that can be blitted onto the p5 canvas (browser) or written to disk (node) */
  function frame(W, H) {
    if (typeof document === 'undefined') return { W, H, data: new Uint8ClampedArray(W * H * 4) };
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d', { willReadFrequently: true }), img = g.createImageData(W, H);
    return { W, H, canvas: c, g, img, data: img.data, flush() { g.putImageData(img, 0, 0); return c; } };
  }
  /** fill a rect of F with an rgb (ints) */
  function fill(F, x, y, w, h, rgb) {
    const D = F.data;
    for (let j = Math.max(0, y | 0); j < Math.min(F.H, (y + h) | 0); j++) for (let i = Math.max(0, x | 0); i < Math.min(F.W, (x + w) | 0); i++) {
      const k = (j * F.W + i) * 4; D[k] = rgb[0]; D[k + 1] = rgb[1]; D[k + 2] = rgb[2]; D[k + 3] = 255; }
  }

  return { DROP, COMB, WAVE, SWIRL, PDROP, DRAG, NONE, drag, dragFront, bake, drop, pdrop, comb, tine, stroke, wave, swirl, fwd, forward, pull, paint, copyRect, fill,
    frame, ink, hex, mottle, hh, combF, shearF, frontAt };
})();
if (typeof module !== 'undefined') module.exports = MK;
