/* ═══════════════════════════════════════════════════════════════════════════════════════════════════════════
   margin.kit.js — THE MARGIN (Field Notebook) · shared kit for both films. Canvas2D, p5 2.3.4 instance mode.

   Every mark is a pen or pencil gesture made at a time on this page:
     glyphs   single-line strokes (hand A author ink, hand B viewer graphite) + hand-made marks (✓ × → ≈ ≠ ↺)
     hand     two-thirds power law speed  v = K·κ^(−1/3)  along each path, pen-up air travel between paths
     nib      Dynadraw spring-mass tip following the hand; a pointed flexible dip nib: pressure-shaded downstrokes,
              hairline upstrokes, pooling where it slows; the reservoir depletes along each stroke (paler, then
              dry-nib skips through the paper tooth) → re-dip (blot that feathers out); the nib is drawn, carrying
              its visible load of ink
     bleed    Washburn capillary law r(t) = r∞·√(min(1, age/τ)) — halo + feathers along a seeded fibre field
     ink      iron-gall blue-black: written vivid blue, oxidises to blue-black while drying (function of age)
     bake     dry strokes (sorted by dry time) are drawn once into the paper layer; snapshots for backward seeks
   Clock law: everything is precomputed from (state, seed); rendering is a pure function of t.
   ═══════════════════════════════════════════════════════════════════════════════════════════════════════════ */
const Margin = (() => {
  'use strict';
  const U = Atelier.U, H = U.h, clamp = U.clamp, lerp = U.lerp, sstep = U.smoothstep;
  const DW = 960, DH = 540, TAU = Math.PI * 2;

  /* ── palette: green-grey engineering paper, teal-grey print, iron-gall ink, graphite ── */
  const PAL = {
    paper: '#DCE4D6', print: '#5E8C87', inkWet: '#2D52B4', inkDry: '#18213A', bleed: '#4F6FC4',
    sheen: '#B8C8F0', graphite: '#55595F', shadow: 'rgba(18,34,30,1)',
  };
  const SEM = U.tokensFor(PAL.paper, { chroma: 1.25 });   // CETI semantics retuned for a light ground (hue kept)
  // coloured pencils: CETI hues, lightness/chroma re-tuned for paper so copper (amber) and peach (orange-red) stay apart
  const PENCIL = { sage: '#4A7A43', peach: '#C5552A', copper: '#B27C2C', slate: '#46698F', graphite: '#3E4247' };
  const INK_LUT = Array.from({ length: 17 }, (_, i) => U.color.mix(PAL.inkWet, PAL.inkDry, Math.pow(i / 16, 0.8)));
  const INK_RGB = INK_LUT.map(hx => U.color.hex2rgb(hx).map(v => v * 255));

  /* ── glyphs ─────────────────────────────────────────────────────────────────────────────────────────────── */
  const GL = MARGIN_GLYPHS;
  /** hand-made marks in the hand's own units (quarter-units, y down, baseline 0) */
  function custom(hand, ch) {
    const x = GL[hand].m.xh;
    switch (ch) {
      case '→': return [x * 2.3, [0, -x * .48, x * .7, -x * .55, x * 1.9, -x * .5], [x * 1.42, -x * .9, x * 1.95, -x * .5, x * 1.38, -x * .1]];
      case '≈': return [x * 1.8, [x * .1, -x * .55, x * .45, -x * .78, x * .9, -x * .6, x * 1.3, -x * .4, x * 1.65, -x * .62],
                                 [x * .1, -x * .15, x * .45, -x * .38, x * .9, -x * .2, x * 1.3, 0, x * 1.65, -x * .22]];
      case '≠': return [x * 1.7, [x * .1, -x * .66, x * 1.55, -x * .66], [x * .1, -x * .22, x * 1.55, -x * .22], [x * 1.15, -x * 1.05, x * .5, x * .2]];
      case '✓': return [x * 1.7, [0, -x * .55, x * .3, -x * .3, x * .55, -x * .02, x * .95, -x * .75, x * 1.55, -x * 1.35]];
      case '×': return [x * 1.3, [x * .1, -x * .9, x * 1.1, x * .05], [x * 1.1, -x * .9, x * .1, x * .05]];
      case '↺': { const pts = []; for (let i = 0; i <= 14; i++) { const a = -0.9 + i / 14 * 5.2; pts.push(x * .75 + Math.cos(a) * x * .7, -x * .55 + Math.sin(a) * x * .7); }
        return [x * 1.7, pts, [pts[pts.length - 2] - x * .38, pts[pts.length - 1] - x * .02, pts[pts.length - 2], pts[pts.length - 1], pts[pts.length - 2] + x * .05, pts[pts.length - 1] - x * .4]]; }
      // a plain cursive s: Allure's swash s reads as "&" at notebook sizes
      case '9': return hand === 'A' ? [151, [117, -118, 118, -127, 116, -135, 111, -143, 105, -149, 97, -153, 88, -154, 79, -154, 70, -150, 63, -145, 58, -138, 55, -130, 54, -121, 56, -113, 61, -105, 67, -99, 75, -95, 84, -94, 93, -94, 102, -98, 109, -103, 114, -110, 117, -118, 118, -112, 112, -80, 100, -48, 88, -22, 80, -2]] : null;   // Allure's open 9 reads as a 3 at small sizes
      case 's': return hand === 'A' ? [60, [50, -76, 40, -86, 24, -86, 14, -76, 16, -62, 30, -52, 46, -42, 54, -28, 50, -10, 36, 0, 18, 1, 6, -6]] : null;
      default: return null;
    }
  }
  const glyphOf = (hand, ch) => custom(hand, ch) || GL[hand].g[ch] || GL[hand].g['?'];
  const isLetter = ch => /[A-Za-z]/.test(ch);
  /** "0.95^{20}" → runs [{s:'0.95'}, {s:'20', sup:true}] */
  const NORM = { '’': "'", '‘': "'", '…': '...', '“': '"', '”': '"' };
  function runs(str) {
    str = str.replace(/[’‘…]/g, c => NORM[c]);
    const out = []; const re = /\^\{([^}]*)\}/g; let i = 0, m;
    while ((m = re.exec(str))) { if (m.index > i) out.push({ s: str.slice(i, m.index) }); out.push({ s: m[1], sup: true }); i = m.index + m[0].length; }
    if (i < str.length) out.push({ s: str.slice(i) });
    return out;
  }
  function plainWidth(hand, str, size, track = 0) {
    const s = size / GL[hand].m.xh; let w = 0;
    for (const r of runs(str)) for (const ch of r.s) w += glyphOf(hand, ch)[0] * s * (r.sup ? 0.62 : 1) + track * size;
    return w;
  }
  /**
   * Lay out handwriting. size = x-height (px). Returns { paths: [[x,y,…]], x1, w }.
   * Seeded per-glyph slant/scale/baseline jitter, baseline drift; hand A joins letters into cursive pen paths and
   * defers small strokes (i-dots, t-bars) to the end of the word, as people do.
   */
  function text(hand, str, x, y, size, opt = {}) {
    const G = GL[hand], m = G.m, seed = opt.seed ?? 1, jit = opt.jitter ?? 1, slant = opt.slant ?? (hand === 'A' ? 0 : -0.02);
    if (opt.maxW) { const w = plainWidth(hand, str, size, opt.track); if (w > opt.maxW) size *= opt.maxW / w; }
    const s0 = size / m.xh, drift = u => size * (opt.drift ?? 0.10) * (U.noise1(seed + 77, u / 140) - 0.5) * 2 + (opt.slope || 0) * (u - x);
    const paths = []; let cx = x, gi = 0, chain = null, deferred = [], prevLetter = false;
    const endWord = () => { for (const d of deferred) paths.push(d); deferred = []; chain = null; prevLetter = false; };
    for (const r of runs(str)) {
      for (const ch of r.s) {
        gi++;
        const g = glyphOf(hand, ch), sup = !!r.sup;
        if (ch === ' ') { endWord(); cx += g[0] * s0 * (0.9 + 0.25 * H(seed, gi, 9)); continue; }
        const r1 = H(seed, gi, 1) * 2 - 1, r2 = H(seed, gi, 2) * 2 - 1, r3 = H(seed, gi, 3) * 2 - 1, r4 = H(seed, gi, 4) * 2 - 1;
        const ss = s0 * (sup ? 0.6 : 1) * (1 + 0.055 * r1 * jit), sh = slant + 0.07 * r2 * jit, rot = 0.035 * r4 * jit;
        const by = y + drift(cx) + 0.06 * size * r3 * jit - (sup ? size * 1.15 : 0), cr = Math.cos(rot), sr = Math.sin(rot);
        const tf = (px, py) => { const X = ss * (px - py * sh), Y = ss * py; return [cx + X * cr - Y * sr, by + X * sr + Y * cr]; };
        const strokes = g.slice(1).map(st => { const o = []; for (let i = 0; i < st.length; i += 2) { const q = tf(st[i], st[i + 1]); o.push(q[0], q[1]); } return o; });
        strokes.forEach((st, k) => {
          let len = 0; for (let i = 2; i < st.length; i += 2) len += Math.hypot(st[i] - st[i - 2], st[i + 1] - st[i - 1]);
          const small = k > 0 && len < size * 1.25;
          if (small && isLetter(ch)) { deferred.push(st); return; }
          if (k === 0 && hand === 'A' && chain && prevLetter && isLetter(ch) && !sup) {
            const ex = chain[chain.length - 2], ey = chain[chain.length - 1];
            if (Math.hypot(st[0] - ex, st[1] - ey) < size * 1.1) { for (let i = 0; i < st.length; i++) chain.push(st[i]); return; }
          }
          paths.push(st); if (k === 0) chain = st;
        });
        prevLetter = isLetter(ch) && !sup;
        if (!isLetter(ch)) { endWord(); }
        cx += g[0] * ss + (opt.track || 0) * size;
      }
    }
    endWord();
    return { paths, x1: cx, w: cx - x, size };
  }

  /* ── gestures (page px) ── */
  const G = {
    /** imperfect ellipse, overlapping ~1.12 turns, starting upper-left (as a hand rings things) */
    ring(cx, cy, rx, ry, seed = 1, turns = 1.12) {
      const n = 40, o = [], a0 = -2.2 + 0.3 * H(seed, 1);
      for (let i = 0; i <= n; i++) { const u = i / n, a = a0 + u * turns * TAU, k = 1 + 0.06 * (U.noise1(seed, u * 4) - 0.5) + 0.05 * u;
        o.push(cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k); }
      return [o];
    },
    line(x0, y0, x1, y1, seed = 1, bow = 0.6) {
      const o = [], n = Math.max(4, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 6)), nx = -(y1 - y0), ny = x1 - x0, L = Math.hypot(nx, ny) || 1;
      const b = bow * (H(seed, 3) - 0.3);
      for (let i = 0; i <= n; i++) { const u = i / n, d = b * Math.sin(Math.PI * u) + 0.35 * (U.noise1(seed, u * 5) - 0.5);
        o.push(lerp(x0, x1, u) + nx / L * d, lerp(y0, y1, u) + ny / L * d); }
      return [o];
    },
    underline(x0, x1, y, seed = 1) { const p = G.line(x0, y, x1, y + 0.8, seed, 1.4)[0]; p.unshift(x0 - 2, y + 1.6); return [p]; },
    tick(x, y, s, seed = 1) { const j = H(seed, 5) * 0.3; return [[x, y - s * .45, x + s * .28, y - s * (.15 + j * .2), x + s * .48, y + s * .05, x + s * .85, y - s * .7, x + s * 1.25, y - s * (1.2 + j)]]; },
    cross(x, y, s, seed = 1) { const j = (k) => (H(seed, k) - 0.5) * s * 0.25;
      return [[x - s / 2 + j(1), y - s / 2 + j(2), x + s / 2 + j(3), y + s / 2 + j(4)], [x + s / 2 + j(5), y - s / 2 + j(6), x - s / 2 + j(7), y + s / 2 + j(8)]]; },
    arrowHead(x, y, ang, s) { return [[x + Math.cos(ang + 2.6) * s, y + Math.sin(ang + 2.6) * s, x, y, x + Math.cos(ang - 2.6) * s, y + Math.sin(ang - 2.6) * s]]; },
    /** five-bar gates: n marks; returns individual strokes in counting order */
    gates(n, x, y, hgt, seed = 1, gap = 3.2) {
      const out = []; let cx = x;
      for (let i = 0; i < n; i++) {
        const k = i % 5, j = (a) => (H(seed, i, a) - 0.5);
        if (k < 4) { const xx = cx + k * gap; out.push([xx + j(1), y - hgt + j(2), xx + 0.6 + j(3) * 1.5, y + j(4)]); }
        else { out.push([cx - 1.6, y - hgt * 0.2 + j(5), cx + 3 * gap + 1.8, y - hgt * 0.85 + j(6)]); cx += 4 * gap + 6.5; }
      }
      return out;
    },
    /**
     * One run as one cursive line: a long joining stroke, then a small loop, per step ("e-l-e-l…").
     * pos(i) gives the loop centre of step i (retries before i shift it right by rs). A part of a row is written
     * from step `from` to step `to` (exclusive); the slip is a half loop where the pen lifts (`stumbleAt`);
     * `resume` starts by completing a stumbled loop; retries draw a second loop at the same step.
     */
    row(o) {
      const { x0, yb, dx, a, seed } = o, rs = o.rs ?? 9, pts = [];
      const retrySet = o.retries || new Set(), shift = i => { let n = 0; for (const r of retrySet) if (r < i) n++; return n * rs; };
      const pos = i => x0 + (i + 0.72) * dx + shift(i);
      const rad = i => a * (1 + 0.1 * (H(seed, i, 11) * 2 - 1));
      const loop = (xc, r, f0, f1) => { const n = Math.max(5, Math.round((f1 - f0) / TAU * 18)); for (let q = 0; q <= n; q++) { const f = f0 + (f1 - f0) * q / n; pts.push(xc + r * Math.cos(f), yb - r - r * Math.sin(f)); } };
      const join = (xc, r) => {   // joining stroke from the current point to the loop's entry (lower right of the loop)
        const ex = xc + r * Math.cos(-0.85), ey = yb - r - r * Math.sin(-0.85), sx = pts[pts.length - 2], sy = pts[pts.length - 1];
        const n = Math.max(3, Math.round(Math.hypot(ex - sx, ey - sy) / 5)), sag = 0.6 + 0.5 * H(seed, xc | 0, 13);
        for (let q = 1; q <= n; q++) { const u = q / n; pts.push(lerp(sx, ex, u), lerp(sy, ey, u) + sag * Math.sin(Math.PI * u)); }
      };
      const F0 = -0.85, F1 = TAU - 0.45, FS = 2.35;
      let i = o.from || 0;
      if (o.resume) { const r = rad(i); const xc = pos(i); pts.push(xc + r * Math.cos(FS), yb - r - r * Math.sin(FS)); loop(xc, r, FS, F1); if (retrySet.has(i)) { join(xc + rs, r * 0.92); loop(xc + rs, r * 0.92, F0, F1); } i++; }
      else pts.push(o.x0 - 5, yb + 0.4);
      for (; i < o.to; i++) {
        const r = rad(i), xc = pos(i); join(xc, r); loop(xc, r, F0, F1);
        if (retrySet.has(i) && i !== o.failRetryAt) { join(xc + rs, r * 0.92); loop(xc + rs, r * 0.92, F0, F1); }
      }
      let end = null;
      if (o.stumbleAt != null) {
        const j = o.stumbleAt, r = rad(j), xc = pos(j); join(xc, r);
        if (o.failRetryAt === j) { loop(xc, r, F0, F1); join(xc + rs, r * 0.92); loop(xc + rs, r * 0.92, F0, FS); end = { x: xc + rs, y: yb - r }; }
        else { loop(xc, r, F0, FS); end = { x: xc, y: yb - r }; }
      } else if (o.to === o.k) {   // finished: a tail past the last loop
        const sx = pts[pts.length - 2], sy = pts[pts.length - 1]; pts.push(sx + 4, sy + 1.5, sx + 9, yb - 0.5, sx + 15, yb - 2.5);
        end = { x: sx + 15, y: yb - 2.5 };
      }
      return { path: pts, pos, rad, end };
    },
    /** a dashed line through points (pencil), as separate short strokes */
    dashes(pts, dash = 5, gap = 4) {
      const out = []; let cur = [pts[0], pts[1]], acc = 0, on = true;
      for (let i = 2; i < pts.length; i += 2) {
        const ax = pts[i - 2], ay = pts[i - 1], bx = pts[i], by = pts[i + 1], L = Math.hypot(bx - ax, by - ay); let u = 0;
        while (u < L) { const need = (on ? dash : gap) - acc, step = Math.min(need, L - u); u += step; acc += step;
          const x = ax + (bx - ax) * u / L, y = ay + (by - ay) * u / L;
          if (on) cur.push(x, y);
          if (acc >= (on ? dash : gap) - 1e-9) { if (on && cur.length >= 4) out.push(cur); on = !on; acc = 0; cur = on ? [x, y] : null; } }
      }
      if (on && cur && cur.length >= 4) out.push(cur);
      return out;
    },
  };

  /* ── pen simulation ─────────────────────────────────────────────────────────────────────────────────────── */
  const TOOLS = {
    // pointed flexible dip nib: hairline upstrokes, pressure-shaded downstrokes
    ink: { family: 'pen', K: 15, vmax: 3.4, f: 26, zeta: 0.72, w: s => 0.25 * s + 0.55, bleed: true, dry: 1.15 },
    graphite: { family: 'pencilB', K: 17, vmax: 3.6, f: 22, zeta: 0.75, w: s => 0.10 * s + 0.95, color: PENCIL.graphite, alpha: 0.92, dry: 0 },
    sage: { family: 'pencil', K: 19, vmax: 4, f: 22, zeta: 0.75, w: s => 0.09 * s + 1.2, color: PENCIL.sage, alpha: 0.9, dry: 0 },
    peach: { family: 'pencil', K: 19, vmax: 4, f: 22, zeta: 0.75, w: s => 0.09 * s + 1.25, color: PENCIL.peach, alpha: 0.92, dry: 0 },
    copper: { family: 'pencil', K: 19, vmax: 4, f: 22, zeta: 0.75, w: s => 0.09 * s + 1.3, color: PENCIL.copper, alpha: 0.92, dry: 0 },
    slate: { family: 'pencil', K: 19, vmax: 4, f: 22, zeta: 0.75, w: s => 0.09 * s + 1.0, color: PENCIL.slate, alpha: 0.88, dry: 0 },
    crumb: { family: 'crumb', K: 40, vmax: 4, f: 22, zeta: 0.75, w: () => 1.5, color: '#9A8C88', alpha: 0.7, dry: 0 },
  };
  const S5 = 5;   // sample stride: x, y, width, film time, ink density

  /** resample a flat polyline at ds px → {X, Y, L} */
  function resample(pts, ds) {
    const X = [pts[0]], Y = [pts[1]]; let carry = 0, acc = 0;
    for (let i = 2; i < pts.length; i += 2) {
      const ax = pts[i - 2], ay = pts[i - 1], bx = pts[i], by = pts[i + 1], L = Math.hypot(bx - ax, by - ay);
      let d = ds - carry;
      while (d <= L) { X.push(ax + (bx - ax) * d / L); Y.push(ay + (by - ay) * d / L); d += ds; }
      carry = L - (d - ds); acc += L;
    }
    const lx = pts[pts.length - 2], ly = pts[pts.length - 1];
    if (Math.hypot(lx - X[X.length - 1], ly - Y[Y.length - 1]) > ds * 0.2) { X.push(lx); Y.push(ly); }
    if (X.length < 2) { X.push(X[0] + 0.3); Y.push(Y[0] + 0.2); }
    return { X, Y, L: acc };
  }
  /**
   * One pen-down path → samples (x, y, τ natural seconds, speed, direction).
   * hand: 2/3 power law with start/stop ramps (+ tremor and hesitation from `flu` ∈ [0,1]);
   * nib: spring-mass tip following the hand (fixed step 1/1500 s).
   */
  function simPath(pts, size, tool, seed, flu = 1) {
    const T = TOOLS[tool], ds = 0.45, R = resample(pts, ds), n = R.X.length, X = R.X, Y = R.Y;
    const K = T.K * size * (0.45 + 0.55 * flu), vmax = T.vmax * K;
    const kap = new Float64Array(n);
    for (let i = 1; i < n - 1; i++) {
      const a1 = Math.atan2(Y[i] - Y[i - 1], X[i] - X[i - 1]), a2 = Math.atan2(Y[i + 1] - Y[i], X[i + 1] - X[i]);
      let d = a2 - a1; while (d > Math.PI) d -= TAU; while (d < -Math.PI) d += TAU; kap[i] = Math.abs(d) / ds;
    }
    const v = new Float64Array(n), L = (n - 1) * ds;
    for (let i = 0; i < n; i++) {
      let s = 0, c = 0; for (let j = Math.max(0, i - 4); j <= Math.min(n - 1, i + 4); j++) { s += kap[j]; c++; }
      const k = Math.max(s / c, 1e-4), si = i * ds;
      v[i] = Math.min(vmax, K * Math.pow(k * size / 6, -1 / 3)) * (0.22 + 0.78 * sstep(0, 2.6, si) * sstep(0, 2.6, L - si));
    }
    const tau = new Float64Array(n); for (let i = 1; i < n; i++) tau[i] = tau[i - 1] + 2 * ds / (v[i] + v[i - 1]);
    const Tend = tau[n - 1], dt = 1 / 1500, w0 = 2 * Math.PI * T.f * clamp(Math.sqrt(7 / size), 0.8, 1.5), z = T.zeta;
    const trem = (1 - flu) * size * 0.2;
    const target = (t) => {
      let lo = 0, hi = n - 1; if (t <= 0) lo = hi = 0; else if (t >= Tend) lo = hi = n - 1;
      else { while (hi - lo > 1) { const m = (lo + hi) >> 1; if (tau[m] <= t) lo = m; else hi = m; } }
      const f = hi > lo ? (t - tau[lo]) / (tau[hi] - tau[lo]) : 0;
      let x = X[lo] + (X[hi] - X[lo]) * f, y = Y[lo] + (Y[hi] - Y[lo]) * f;
      if (trem > 0) { x += trem * (U.noise1(seed + 3, t * 7) - 0.5) * 2; y += trem * (U.noise1(seed + 5, t * 8) - 0.5) * 2; }
      return [x, y];
    };
    let px = X[0], py = Y[0], vx = 0, vy = 0; const out = [];
    const steps = Math.ceil((Tend + 0.008) / dt);
    for (let s = 0; s <= steps; s++) {
      const t = s * dt, [hx, hy] = target(t);
      const ax = w0 * w0 * (hx - px) - 2 * z * w0 * vx, ay = w0 * w0 * (hy - py) - 2 * z * w0 * vy;
      vx += ax * dt; vy += ay * dt; px += vx * dt; py += vy * dt;
      if (s % 3 === 0 || s === steps) out.push(px, py, t, Math.hypot(vx, vy), Math.atan2(vy, vx));
    }
    return { raw: out, T: Tend + 0.008, K, L };
  }

  /* ── the script: writes → strokes ───────────────────────────────────────────────────────────────────────── */
  /**
   * Writer: collect writes { t0, dur, tool, size, paths, flu, tag, erase:{t0,t1} } then .build() simulates every
   * write in time order (ink reservoir carried across ink writes; re-dip when it runs low) and returns
   * { strokes (sorted by t0), bakeOrder (sorted by dry time), writes, dips }.
   */
  function Writer(seed = 1) {
    const writes = [];
    const W = {
      writes,
      add(w) { w.i = writes.length; writes.push(w); return w; },
      text(hand, tool, str, x, y, size, opt = {}) {
        const L = text(hand, str, x, y, size, Object.assign({ seed: seed * 977 + writes.length * 31 }, opt));
        L.write = W.add(Object.assign({ tool, size: L.size, paths: L.paths }, opt)); return L;
      },
      marks(tool, paths, size, opt = {}) { return W.add(Object.assign({ tool, size, paths }, opt)); },
      build() {
        const order = writes.slice().sort((a, b) => a.t0 - b.t0 || a.i - b.i);
        const strokes = [], dips = []; let ink = 1;
        for (const w of order) {
          if (!w.paths.length) continue;
          const T = TOOLS[w.tool], flu = w.flu ?? 1;
          const sims = w.paths.map((p, k) => simPath(p, w.size, w.tool, seed * 131 + w.i * 17 + k, flu));
          let D = 0; const air = [];
          for (let k = 0; k < sims.length; k++) {
            if (k > 0) { const a = w.paths[k - 1], b = w.paths[k], d = Math.hypot(b[0] - a[a.length - 2], b[1] - a[a.length - 1]);
              const ta = 0.035 + d / (sims[k].K * 2.6); air.push(ta); D += ta; } else air.push(0);
            D += sims[k].T;
          }
          const lapse = w.dur ? Math.max(w.minLapse ?? 1, D / w.dur) : 1;
          let t = w.t0 + (w.pause || 0);
          w.lapse = lapse; w.t1 = w.t0 + (w.pause || 0) + D / lapse;
          let ex0 = 1e9, ex1 = -1e9;
          for (const pa of w.paths) for (let i = 0; i < pa.length; i += 2) { ex0 = Math.min(ex0, pa[i]); ex1 = Math.max(ex1, pa[i]); }
          for (let k = 0; k < sims.length; k++) {
            t += air[k] / lapse;
            const S = sims[k], raw = S.raw, m = raw.length / 5;
            let dip = false;
            if (T.bleed && (ink < 0.22 || (w.dip && k === 0))) { dip = true; ink = 1; dips.push(t); }
            const inkStart = ink, pts = new Float32Array(m * S5);
            let wsum = 0;
            for (let i = 0; i < m; i++) {
              const x = raw[i * 5], y = raw[i * 5 + 1], tt = raw[i * 5 + 2], sp = raw[i * 5 + 3], dir = raw[i * 5 + 4];
              const pr = (0.55 + 0.45 * sstep(0, 0.02, tt)) * (0.45 + 0.55 * sstep(0, 0.025, S.T - tt));
              let wd, dn = 1;
              if (T.bleed) {
                // flexible pointed nib: pressure opens the tines on downstrokes; upstrokes are hairlines; slow = pooling
                const down = Math.pow(Math.max(0, Math.sin(dir)), 1.3), slow = Math.exp(-sp / (0.4 * S.K));
                wd = T.w(w.size) * pr * (0.24 + 0.95 * down * (0.7 + 0.3 * slow) + 0.3 * slow) * (0.7 + 0.3 * Math.sqrt(ink)) * (w.weight ?? 1);
                dn = clamp((0.42 + 0.58 * Math.sqrt(ink)) * (0.94 + 0.12 * slow), 0.25, 1);
                if (i > 0) { const dd = Math.hypot(x - raw[i * 5 - 5], y - raw[i * 5 - 4]); ink = Math.max(0.03, ink - dd * Math.max(0.6, wd) * 0.00034 * (w.thirst ?? 1)); }
              } else wd = T.w(w.size) * (0.8 + 0.2 * pr) * (w.weight ?? 1);
              const o = i * S5; pts[o] = x; pts[o + 1] = y; pts[o + 2] = wd; pts[o + 3] = t + tt / lapse; pts[o + 4] = dn; wsum += wd;
            }
            const t0 = pts[3], t1 = pts[(m - 1) * S5 + 3];
            const st = { tool: w.tool, family: T.family, pts, n: m, t0, t1, tDry: t1 + (T.dry || 0), write: w, k, seed: seed * 7919 + w.i * 101 + k,
              wMean: wsum / m, ink: inkStart, inkEnd: ink, dip, tag: w.tag, color: w.color || T.color, alpha: (T.alpha ?? 1) * (w.alpha ?? 1), size: w.size };
            if (w.erase) {   // erased left→right: each stroke fades when the eraser passes its middle
              let cx = 0; for (let i = 0; i < m; i++) cx += pts[i * S5]; cx /= m;
              const X0 = w.erase.x0 ?? ex0, X1 = w.erase.x1 ?? ex1, u = clamp((cx - X0) / Math.max(1, X1 - X0)), te = lerp(w.erase.t0, w.erase.t1 - 0.2, u);
              st.erase = [te, te + 0.2]; st.tDry = Math.max(t1, te + 0.2); st.ghost = w.erase.ghost ?? 0.13;
            }
            prepStroke(st);
            strokes.push(st);
            t = t + S.T / lapse;
          }
        }
        strokes.sort((a, b) => a.t0 - b.t0);
        strokes.forEach((s, i) => (s.id = i));
        const bakeOrder = strokes.slice().sort((a, b) => a.tDry - b.tDry || a.id - b.id);
        bakeOrder.forEach((s, i) => (s.bi = i));
        return { strokes, bakeOrder, writes: order, dips };
      },
    };
    return W;
  }

  /* ── fibre field (shared by paper texture and ink feathering) ── */
  const fibreAngle = (seed, x, y) => 0.18 + (U.fbm(seed + 5, 2, x / 70, y / 70) - 0.5) * 2.2;
  const capillary = (seed, x, y) => U.fbm(seed + 9, 2, x / 23, y / 23);

  /** normals, bbox, bleed radius, feathers — once per stroke */
  function prepStroke(s) {
    const P = s.pts, n = s.n, nx = new Float32Array(n), ny = new Float32Array(n);
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (let i = 0; i < n; i++) {
      const a = Math.max(0, i - 1), b = Math.min(n - 1, i + 1);
      const dx = P[b * S5] - P[a * S5], dy = P[b * S5 + 1] - P[a * S5 + 1], L = Math.hypot(dx, dy) || 1;
      nx[i] = -dy / L; ny[i] = dx / L;
      x0 = Math.min(x0, P[i * S5]); x1 = Math.max(x1, P[i * S5]); y0 = Math.min(y0, P[i * S5 + 1]); y1 = Math.max(y1, P[i * S5 + 1]);
    }
    s.nx = nx; s.ny = ny;
    s.rInf = s.family === 'pen' ? 0.35 + 0.32 * s.wMean + (s.dip ? 0.9 : 0) : 0;
    const pad = 7 + s.wMean * 1.5 + s.rInf * 4; s.bbox = [x0 - pad, y0 - pad, x1 + pad, y1 + pad];
    s.feathers = [];
    if (s.family === 'pen') {
      const F = s.feathers, fs = 9103;
      for (let i = 2; i < n - 2; i += 3) {
        const x = P[i * S5], y = P[i * S5 + 1], c = capillary(fs, x, y);
        if (c < 0.54 || H(s.seed, i, 41) > 0.5 + (c - 0.54) * 3) continue;
        const side = H(s.seed, i, 42) < 0.5 ? -1 : 1, a = fibreAngle(fs, x, y);
        let dx = Math.cos(a), dy = Math.sin(a); if (dx * nx[i] * side + dy * ny[i] * side < 0) { dx = -dx; dy = -dy; }
        const len = (0.9 + 3.6 * (c - 0.54) / 0.46) * (0.6 + 0.8 * H(s.seed, i, 43)) * (0.6 + 0.45 * P[i * S5 + 2]);
        F.push(i, side, dx, dy, len);
      }
      if (s.dip) for (let q = 0; q < 9; q++) {   // a re-dip blot feathers out in all directions
        const a = TAU * q / 9 + H(s.seed, q, 44), L = 2.5 + 3 * H(s.seed, q, 45); F.unshift(0, 1, Math.cos(a), Math.sin(a), L);
      }
    }
  }

  /** index count of samples laid down by film time t */
  function laid(s, t) {
    if (t >= s.t1) return s.n; if (t < s.t0) return 0;
    let lo = 0, hi = s.n - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (s.pts[m * S5 + 3] <= t) lo = m; else hi = m; }
    return lo + 1;
  }
  /** outline of samples [a, b] (inclusive), widened by `extra`; round caps where asked */
  function outline(c, s, a, b, extra, capA, capB) {
    const P = s.pts, nx = s.nx, ny = s.ny;
    c.beginPath();
    for (let i = a; i <= b; i++) { const r = P[i * S5 + 2] / 2 + extra; c.lineTo(P[i * S5] + nx[i] * r, P[i * S5 + 1] + ny[i] * r); }
    if (capB) { const re = P[b * S5 + 2] / 2 + extra, ae = Math.atan2(ny[b], nx[b]); c.arc(P[b * S5], P[b * S5 + 1], re, ae, ae - Math.PI, false); }
    for (let i = b; i >= a; i--) { const r = P[i * S5 + 2] / 2 + extra; c.lineTo(P[i * S5] - nx[i] * r, P[i * S5 + 1] - ny[i] * r); }
    if (capA) { const r0 = P[a * S5 + 2] / 2 + extra, a0 = Math.atan2(-ny[a], -nx[a]); c.arc(P[a * S5], P[a * S5 + 1], r0, a0, a0 - Math.PI, false); }
    c.closePath();
  }

  /* ── page: paper (with light), bake layer, scratch, snapshots, instruments ── */
  function Page(p, ctx, opt = {}) {
    const seed = opt.seed ?? 1, marginX = opt.marginX ?? null;
    let d = 0, frame = null, paper = null, bake = null, scratch = null, scratchB = null, scratchL = null, tooth = null, toothPat = null, plan = null, baked = 0, snaps = [];
    // CPU-backed canvases (willReadFrequently): software Skia raster, one blit to the main canvas per frame
    const mk = (w, h) => { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; cv.getContext('2d', { willReadFrequently: true }); return cv; };
    function buildPaper() {
      const W = Math.round(DW * d), Hh = Math.round(DH * d);
      paper = mk(W, Hh); const c = paper.getContext('2d', { willReadFrequently: true });
      const img = c.createImageData(W, Hh), D = img.data, base = U.color.hex2rgb(PAL.paper);
      tooth = mk(W, Hh); const tc = tooth.getContext('2d'), timg = tc.createImageData(W, Hh), TD = timg.data;
      // height field of the paper's tooth → relief lit from the lamp (upper left): the sheet is an object
      const hf = new Float32Array(W * Hh);
      for (let y = 0; y < Hh; y++) for (let x = 0; x < W; x++) { const px = x / d, py = y / d; hf[y * W + x] = U.noise2(seed + 3, px / 1.1, py / 1.6) - 0.5 + (H(seed, x, y, 7) - 0.5) * 0.35; }
      for (let y = 0; y < Hh; y++) for (let x = 0; x < W; x++) {
        const px = x / d, py = y / d, i = y * W + x, o = i * 4;
        const mot = (U.noise2(seed + 1, px / 150, py / 150) - 0.5) * 0.035 + (U.noise2(seed + 2, px / 40, py / 40) - 0.5) * 0.018;
        const xa = Math.max(0, x - 1), ya = Math.max(0, y - 1), xb = Math.min(W - 1, x + 1), yb = Math.min(Hh - 1, y + 1);
        const relief = (hf[ya * W + xa] - hf[yb * W + xb]) * 0.085;   // light from upper left
        const lamp = 1.035 - 0.085 * Math.hypot(px / DW - 0.12, (py / DH - 0.05) * 0.8);   // warm lamp falloff
        const L = (1 + mot + relief + hf[i] * 0.012) * lamp;
        D[o] = base[0] * 255 * L * 1.006; D[o + 1] = base[1] * 255 * L; D[o + 2] = base[2] * 255 * L * 0.985; D[o + 3] = 255;
        const kn = clamp(0.5 - hf[i] * 1.6 + (H(seed, x, y, 8) - 0.5) * 0.4, 0, 1);
        TD[o] = TD[o + 1] = TD[o + 2] = 255; TD[o + 3] = Math.round(255 * Math.pow(kn, 1.7) * 0.55);
      }
      c.putImageData(img, 0, 0); tc.putImageData(timg, 0, 0);
      c.setTransform(d, 0, 0, d, 0, 0);
      for (let i = 0; i < 2600; i++) {
        const x = H(seed, i, 21) * DW, y = H(seed, i, 22) * DH, a = fibreAngle(9103, x, y) + (H(seed, i, 23) - 0.5) * 0.9;
        const L = 3 + 14 * Math.pow(H(seed, i, 24), 2), bend = (H(seed, i, 25) - 0.5) * L * 0.5, light = H(seed, i, 26) < 0.6;
        c.strokeStyle = light ? 'rgba(246,250,242,0.55)' : 'rgba(120,140,128,0.22)'; c.lineWidth = light ? 0.55 : 0.4;
        c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + Math.cos(a) * L / 2 - Math.sin(a) * bend, y + Math.sin(a) * L / 2 + Math.cos(a) * bend, x + Math.cos(a) * L, y + Math.sin(a) * L); c.stroke();
      }
      // show-through of the previous page, mirrored, blurred once
      const sh = mk(W, Hh), sc = sh.getContext('2d'); sc.setTransform(d, 0, 0, d, 0, 0); sc.translate(DW, 0); sc.scale(-1, 1);
      sc.strokeStyle = '#33405A'; sc.lineCap = 'round'; sc.lineJoin = 'round'; sc.lineWidth = 1.3;
      const words = ['retry', 'tool call', 'observe', 'p = 0.95', 'k steps', 'run 12', 'ok', 'fail @ 7', 'vendor id', 'ACME', 'check', 'total', 'matched'];
      for (let ln = 0; ln < 13; ln++) {
        let x = 70 + H(seed, ln, 31) * 60; const y = 96 + ln * 32 + H(seed, ln, 32) * 6;
        while (x < 860) { const wd = words[Math.floor(H(seed, ln, x | 0, 33) * words.length)]; const T = text('A', wd, x, y, 6.5, { seed: ln * 50 + (x | 0) });
          sc.beginPath(); for (const pa of T.paths) { sc.moveTo(pa[0], pa[1]); for (let i = 2; i < pa.length; i += 2) sc.lineTo(pa[i], pa[i + 1]); } sc.stroke();
          x = T.x1 + 9 + H(seed, ln, x | 0, 34) * 14; }
      }
      c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 0.02; c.filter = 'blur(' + (0.8 * d).toFixed(2) + 'px)'; c.drawImage(sh, 0, 0); c.restore();
      // printed grid, bending slightly into the gutter (the page curves into the binding)
      const bendX = x => x - 7 * Math.pow(Math.max(0, 1 - x / 70), 2);
      c.strokeStyle = PAL.print;
      for (let x = 0; x <= DW; x += 8) { const maj = x % 40 === 0; c.globalAlpha = maj ? 0.42 : 0.2; c.lineWidth = maj ? 0.75 : 0.45; c.beginPath(); c.moveTo(bendX(x) + 0.25, 0); c.lineTo(bendX(x) + 0.25, DH); c.stroke(); }
      for (let y = 0; y <= DH; y += 8) { const maj = y % 40 === 0; c.globalAlpha = maj ? 0.42 : 0.2; c.lineWidth = maj ? 0.75 : 0.45; c.beginPath();
        for (let x = 0; x <= DW; x += 8) c.lineTo(bendX(x), y + 0.25 + 2.2 * Math.pow(Math.max(0, 1 - x / 70), 2) * (y / DH - 0.5)); c.stroke(); }
      if (marginX != null) { c.globalAlpha = 0.55; c.lineWidth = 0.8; c.beginPath(); c.moveTo(marginX + 0.5, 0); c.lineTo(marginX + 0.5, DH); c.moveTo(marginX + 3.5, 0); c.lineTo(marginX + 3.5, DH); c.stroke(); }
      c.globalAlpha = 1;
      if (opt.decorate) opt.decorate(c, { DW, DH, PAL, text });
      // gutter: the sheet curves down into the binding — shadow, then a highlight where it rises to meet the light
      const gr = c.createLinearGradient(0, 0, 64, 0);
      gr.addColorStop(0, 'rgba(28,44,38,0.55)'); gr.addColorStop(0.18, 'rgba(28,44,38,0.22)'); gr.addColorStop(0.42, 'rgba(255,255,248,0.10)'); gr.addColorStop(0.6, 'rgba(255,255,248,0.05)'); gr.addColorStop(1, 'rgba(255,255,248,0)');
      c.fillStyle = gr; c.fillRect(0, 0, 64, DH);
      // the far edges of the page block: stacked sheets, then the desk
      c.fillStyle = '#1B2421'; c.fillRect(DW - 6, 0, 6, DH); c.fillRect(0, DH - 5, DW, 5);
      for (let q = 0; q < 4; q++) { c.strokeStyle = q % 2 ? 'rgba(210,218,204,0.9)' : 'rgba(150,162,148,0.9)'; c.lineWidth = 0.7;
        c.beginPath(); c.moveTo(DW - 6 + q * 1.2, 0); c.lineTo(DW - 6 + q * 1.2, DH - 5 + q * 1.1); c.lineTo(0, DH - 5 + q * 1.1); c.stroke(); }
      const sg = c.createLinearGradient(DW - 30, 0, DW - 6, 0); sg.addColorStop(0, 'rgba(20,32,28,0)'); sg.addColorStop(1, 'rgba(20,32,28,0.10)'); c.fillStyle = sg; c.fillRect(DW - 30, 0, 24, DH - 5);
      // two scratch sheets: one for baking, one for live strokes
      bake = mk(W, Hh); scratchB = mk(W, Hh); scratchL = mk(W, Hh); scratch = scratchL;
      toothPat = scratchL.getContext('2d').createPattern(tooth, 'no-repeat');
      resetBake();
    }
    function resetBake() { const c = bake.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'copy'; c.drawImage(paper, 0, 0); c.globalCompositeOperation = 'source-over'; baked = 0; }
    function sbox(s) {
      const b = s.bbox, bx = Math.max(0, Math.floor(b[0] * d)), by = Math.max(0, Math.floor(b[1] * d));
      return [bx, by, Math.min(scratch.width, Math.ceil(b[2] * d)) - bx, Math.min(scratch.height, Math.ceil(b[3] * d)) - by];
    }
    function blit(c, bx, by, bw, bh, toMain, alpha) {
      c.globalCompositeOperation = 'multiply'; c.globalAlpha = alpha;
      if (toMain) c.drawImage(scratch, bx, by, bw, bh, bx / d, by / d, bw / d, bh / d);
      else { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(scratch, bx, by, bw, bh, bx, by, bw, bh); c.restore(); }
      c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
    }
    /**
     * ink: the core is painted opaque in scratch chunk by chunk (density varies along the stroke as the nib runs
     * dry), dry-nib skips knocked out by the paper tooth, then multiplied onto the page; halo + feathers bleed by
     * Washburn r = r∞·√(age/τ); wet sheen and blue→black oxidation by age.
     */
    function drawInk(c, s, t, m, toMain) {
      if (m < 2) return;
      const age = t - Math.min(t, s.t1), done = m >= s.n, tau = s.tDry - s.t1;
      const g = done ? Math.sqrt(clamp(age / tau)) : Math.sqrt(clamp((t - s.t0) / tau)) * 0.5;
      const dryU = done ? clamp(age / tau) : 0, P = s.pts, ink = INK_RGB[Math.round(dryU * 16)], wa = s.write.alpha ?? 1;
      // halo
      if (g > 0) { c.globalCompositeOperation = 'multiply'; c.globalAlpha = 0.15 * wa; c.fillStyle = PAL.bleed; outline(c, s, 0, m - 1, s.rInf * g, true, true); c.fill(); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; }
      const [bx, by, bw, bh] = sbox(s); if (bw <= 0 || bh <= 0) return;
      const sc = scratch.getContext('2d');
      sc.setTransform(1, 0, 0, 1, 0, 0); sc.globalCompositeOperation = 'source-over'; sc.globalAlpha = 1; sc.clearRect(bx - 3, by - 3, bw + 6, bh + 6);   // + a border: smoothed blits sample just outside the rect
      sc.setTransform(d, 0, 0, d, 0, 0);
      const col = dn => 'rgb(' + Math.round(255 - dn * (255 - ink[0])) + ',' + Math.round(255 - dn * (255 - ink[1])) + ',' + Math.round(255 - dn * (255 - ink[2])) + ')';
      for (let a = 0; a < m - 1; a += 6) {
        const b = Math.min(m - 1, a + 7); let dn = 0; for (let i = a; i <= b; i++) dn += P[i * S5 + 4]; dn /= (b - a + 1);
        sc.fillStyle = col(dn); outline(sc, s, a, b, 0, a === 0, b === m - 1); sc.fill();
      }
      // pooling: the nib lands heavy and lifts with a bead; a fresh dip leaves a blot
      sc.fillStyle = col(1); sc.beginPath(); sc.arc(P[0], P[1], P[2] * (s.dip ? 1.35 : 0.62) + (s.dip ? 0.6 : 0), 0, TAU); sc.fill();
      if (done) { const e = (m - 1) * S5; sc.beginPath(); sc.arc(P[e], P[e + 1], P[e + 2] * 0.55 + 0.15, 0, TAU); sc.fill(); }
      const dry = clamp((0.3 - s.inkEnd) / 0.25);
      if (dry > 0) { sc.setTransform(1, 0, 0, 1, 0, 0); sc.globalAlpha = dry; sc.globalCompositeOperation = 'destination-out'; sc.fillStyle = toothPat; sc.fillRect(bx, by, bw, bh); sc.globalCompositeOperation = 'source-over'; sc.globalAlpha = 1; }
      blit(c, bx, by, bw, bh, toMain, 0.96 * wa);
      // feathers along the fibres
      if (g > 0 && s.feathers.length) {
        c.globalCompositeOperation = 'multiply'; c.globalAlpha = 0.36 * wa; c.strokeStyle = INK_LUT[Math.round(dryU * 16)]; c.lineCap = 'round';
        const F = s.feathers; c.beginPath();
        for (let q = 0; q < F.length; q += 5) {
          const i = F[q]; if (i >= m) break;
          const r = P[i * S5 + 2] / 2 * 0.8, x = P[i * S5] + s.nx[i] * r * F[q + 1], y = P[i * S5 + 1] + s.ny[i] * r * F[q + 1], L = F[q + 4] * g;
          c.moveTo(x, y); c.lineTo(x + F[q + 2] * L, y + F[q + 3] * L);
        }
        c.lineWidth = 0.45; c.stroke();
      }
      // wet sheen: a highlight that sinks in as the ink is absorbed
      if (dryU < 1) {
        c.globalCompositeOperation = 'screen'; c.globalAlpha = 0.5 * (1 - dryU); c.strokeStyle = PAL.sheen; c.lineCap = 'round'; c.lineJoin = 'round';
        c.beginPath(); for (let i = 0; i < m; i++) { const w = P[i * S5 + 2]; c.lineTo(P[i * S5] - w * 0.2, P[i * S5 + 1] - w * 0.24); }
        c.lineWidth = Math.max(0.3, s.wMean * 0.3); c.stroke();
      }
      c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
    }
    /** pencil: draw into scratch, knock the tooth out, composite (multiply); fades under the eraser */
    function drawPencil(c, s, t, m, toMain) {
      if (m < 2) return;
      let fade = 1; if (s.erase) fade = 1 - (1 - s.ghost) * U.ease.inOut(clamp((t - s.erase[0]) / (s.erase[1] - s.erase[0])));
      const sc = scratch.getContext('2d'), P = s.pts, [bx, by, bw, bh] = sbox(s);
      if (bw <= 0 || bh <= 0) return;
      sc.setTransform(1, 0, 0, 1, 0, 0); sc.globalCompositeOperation = 'source-over'; sc.clearRect(bx - 3, by - 3, bw + 6, bh + 6);   // + a border: smoothed blits sample just outside the rect
      sc.setTransform(d, 0, 0, d, 0, 0); sc.strokeStyle = s.color; sc.lineCap = 'round'; sc.lineJoin = 'round';
      sc.globalAlpha = 1; sc.beginPath(); for (let i = 0; i < m; i++) sc.lineTo(P[i * S5], P[i * S5 + 1]); sc.lineWidth = s.wMean; sc.stroke();
      sc.globalAlpha = 0.7; sc.beginPath(); for (let i = 0; i < m; i++) sc.lineTo(P[i * S5] + 0.25, P[i * S5 + 1] + 0.3); sc.lineWidth = s.wMean * 0.5; sc.stroke();
      sc.setTransform(1, 0, 0, 1, 0, 0); sc.globalAlpha = s.family === 'crumb' ? 0.3 : 1; sc.globalCompositeOperation = 'destination-out'; sc.fillStyle = toothPat; sc.fillRect(bx, by, bw, bh);
      sc.globalCompositeOperation = 'source-over'; sc.globalAlpha = 1;
      blit(c, bx, by, bw, bh, toMain, s.alpha * fade);
    }
    function bakeTo(n) {
      const order = plan.bakeOrder;
      if (n < baked) {
        let best = null; for (const sn of snaps) if (sn.n <= n && (!best || sn.n > best.n)) best = sn;
        const c = bake.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'copy';
        if (best) { c.drawImage(best.cv, 0, 0); baked = best.n; } else { c.drawImage(paper, 0, 0); baked = 0; }
        c.globalCompositeOperation = 'source-over';
      }
      const c = bake.getContext('2d'); c.setTransform(d, 0, 0, d, 0, 0);
      scratch = scratchB;
      while (baked < n) {
        const s = order[baked];
        if (s.family === 'pen') drawInk(c, s, s.tDry + 10, s.n, false); else drawPencil(c, s, s.tDry + 10, s.n, false);
        c.setTransform(d, 0, 0, d, 0, 0);
        baked++;
        if (baked % 260 === 0 && !snaps.some(sn => sn.n === baked)) { const cv = mk(bake.width, bake.height); cv.getContext('2d').drawImage(bake, 0, 0); snaps.push({ n: baked, cv }); }
      }
      scratch = scratchL;
    }

    /* instruments — drawn, not just shadowed: a dip pen (steel nib carrying a visible load of ink, brass ferrule,
       lacquered holder) for the author; hexagonal pencils for annotations and for the viewer. */
    const NIB = [[0, 0.15], [2.5, 0.9], [7, 2.2], [12, 3.1], [17, 3.5], [21, 3.3], [23, 3.0]];
    function quad(c, x, y, ca, sa, prof, sc) {
      const nx = -sa, ny = ca; c.beginPath();
      prof.forEach(([L, w]) => c.lineTo(x + ca * L * sc + nx * w * sc, y + sa * L * sc + ny * w * sc));
      for (let i = prof.length - 1; i >= 0; i--) { const [L, w] = prof[i]; c.lineTo(x + ca * L * sc - nx * w * sc, y + sa * L * sc - ny * w * sc); }
      c.closePath();
    }
    function instrument(c, fam, x, y, z, color, load) {
      const pen = fam === 'pen', left = fam === 'pencilB', ang = pen ? 0.98 : left ? 2.2 : 1.12, ca = Math.cos(ang), sa = Math.sin(ang), nx = -sa, ny = ca;
      const sc = 1 + 0.07 * z;
      // shadow (cast down-right by the lamp; further and softer as the tip lifts)
      const lift = 1.5 + z * 10, sx = x + lift * 0.9, sy = y + lift * 0.75;
      const sprof = pen ? [[0, 0.3], [10, 2.2], [23, 3.2], [36, 4.8], [330, 8]] : [[0, 0.4], [6, 1.4], [18, 4.2], [330, 5]];
      c.save(); c.globalCompositeOperation = 'multiply';
      const a0 = 0.26 - z * 0.08, gs = c.createLinearGradient(sx, sy, sx + ca * 260, sy + sa * 260);
      gs.addColorStop(0, 'rgba(26,42,36,' + a0.toFixed(3) + ')'); gs.addColorStop(0.5, 'rgba(26,42,36,' + (a0 * 0.6).toFixed(3) + ')'); gs.addColorStop(1, 'rgba(26,42,36,0)');
      c.fillStyle = gs; c.filter = 'blur(' + (0.7 + z * 2.4).toFixed(2) + 'px)'; quad(c, sx, sy, ca, sa, sprof, 1); c.fill(); c.restore();
      c.save();
      if (pen) {
        // holder (lacquer), ferrule (brass), nib (steel with slit, vent hole and a wet load of ink)
        const hold = [[34, 4.4], [80, 5.6], [180, 7.2], [340, 9.5]];
        quad(c, x, y, ca, sa, hold, sc);
        const gh = c.createLinearGradient(x + nx * 8, y + ny * 8, x - nx * 8, y - ny * 8);
        gh.addColorStop(0, '#0F0D0C'); gh.addColorStop(0.42, '#3A332D'); gh.addColorStop(0.55, '#6B6158'); gh.addColorStop(0.7, '#2A2420'); gh.addColorStop(1, '#0E0C0B');
        c.fillStyle = gh; c.fill();
        quad(c, x, y, ca, sa, [[21, 3.6], [24, 4.3], [35, 4.6], [37, 4.4]], sc);
        const gf = c.createLinearGradient(x + nx * 5, y + ny * 5, x - nx * 5, y - ny * 5);
        gf.addColorStop(0, '#5C4421'); gf.addColorStop(0.4, '#C9A45C'); gf.addColorStop(0.55, '#F1DDA2'); gf.addColorStop(1, '#6E5226'); c.fillStyle = gf; c.fill();
        quad(c, x, y, ca, sa, NIB, sc);
        const gn = c.createLinearGradient(x + nx * 4, y + ny * 4, x - nx * 4, y - ny * 4);
        gn.addColorStop(0, '#5D646B'); gn.addColorStop(0.35, '#C9D0D6'); gn.addColorStop(0.5, '#F4F7F9'); gn.addColorStop(0.7, '#8C949B'); gn.addColorStop(1, '#4C5258'); c.fillStyle = gn; c.fill();
        // the ink load: wet blue-black on the nib from the tip back, shrinking as the reservoir empties
        const il = 2 + 12 * clamp(load);
        c.save(); quad(c, x, y, ca, sa, NIB, sc); c.clip();
        quad(c, x, y, ca, sa, [[0, 0.3], [il * 0.6, 3], [il, 3.6], [il + 1.5, 0.5]], sc); c.fillStyle = 'rgba(24,32,62,0.92)'; c.fill();
        c.strokeStyle = 'rgba(200,215,255,0.55)'; c.lineWidth = 0.35; c.beginPath(); c.moveTo(x + nx * 0.9, y + ny * 0.9); c.lineTo(x + ca * il * 0.8 * sc + nx * 1.6, y + sa * il * 0.8 * sc + ny * 1.6); c.stroke();
        c.restore();
        c.strokeStyle = '#1A1E22'; c.lineWidth = 0.45; c.beginPath(); c.moveTo(x, y); c.lineTo(x + ca * 12 * sc, y + sa * 12 * sc); c.stroke();
        c.fillStyle = '#1A1E22'; c.beginPath(); c.arc(x + ca * 13 * sc, y + sa * 13 * sc, 0.9, 0, TAU); c.fill();
      } else {
        // pencil: painted hexagonal body (three faces), sharpened wood cone, lead tip
        const body = fam === 'pencilB' ? '#B48A57' : (color || PENCIL.graphite), lead = fam === 'pencilB' ? '#2B2D30' : color;   // the viewer's: bare cedar
        const faces = [[-1, -0.33, 0.78], [-0.33, 0.33, 1], [0.33, 1, 0.62]];
        for (const [w0, w1, k] of faces) {
          c.beginPath();
          const pts = [[17, 4.2], [340, 6.4]];
          c.lineTo(x + ca * 17 * sc + nx * 4.2 * w0 * sc, y + sa * 17 * sc + ny * 4.2 * w0 * sc); c.lineTo(x + ca * 340 * sc + nx * 6.4 * w0 * sc, y + sa * 340 * sc + ny * 6.4 * w0 * sc);
          c.lineTo(x + ca * 340 * sc + nx * 6.4 * w1 * sc, y + sa * 340 * sc + ny * 6.4 * w1 * sc); c.lineTo(x + ca * 17 * sc + nx * 4.2 * w1 * sc, y + sa * 17 * sc + ny * 4.2 * w1 * sc);
          c.closePath(); c.fillStyle = U.color.mix(body, k > 0.9 ? '#FFFFFF' : '#000000', k > 0.9 ? 0.25 : 1 - k); c.fill(); void pts;
        }
        quad(c, x, y, ca, sa, [[3.2, 1.0], [17, 4.25]], sc);
        const gw = c.createLinearGradient(x + nx * 4, y + ny * 4, x - nx * 4, y - ny * 4); gw.addColorStop(0, '#B08A5C'); gw.addColorStop(0.5, '#E6CC9E'); gw.addColorStop(1, '#A57E52');
        c.fillStyle = gw; c.fill();
        quad(c, x, y, ca, sa, [[0, 0.2], [3.4, 1.05]], sc); c.fillStyle = lead; c.fill();
      }
      c.restore();
    }
    const api = {
      PAL, PENCIL,
      use(pl) {
        const nd = ctx.size.k * (opt.density ?? 2);
        if (Math.abs(nd - d) > 1e-6) { d = nd; buildPaper(); snaps = []; }
        if (plan !== pl) { plan = pl; resetBake(); snaps = []; }
        return api;
      },
      draw(t, cam) {
        const order = plan.bakeOrder; let n = 0;
        { let lo = 0, hi = order.length; while (lo < hi) { const m = (lo + hi) >> 1; if (order[m].tDry <= t) lo = m + 1; else hi = m; } n = lo; }
        bakeTo(n);
        const k = ctx.size.k, fw = Math.round(DW * k), fh = Math.round(DH * k);
        if (!frame || frame.width !== fw || frame.height !== fh) frame = mk(fw, fh);
        const c = frame.getContext('2d'); c.setTransform(k, 0, 0, k, 0, 0); c.globalCompositeOperation = 'copy'; c.fillStyle = '#1B2421'; c.fillRect(0, 0, DW, DH);
        c.globalCompositeOperation = 'source-over'; c.save();
        if (cam) { c.translate(DW / 2, DH / 2); c.scale(cam.z, cam.z); c.translate(-cam.x, -cam.y); }
        c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high';
        c.drawImage(bake, 0, 0, bake.width, bake.height, 0, 0, DW, DH);
        for (const s of plan.strokes) {
          if (s.t0 > t) break;
          if (s.tDry <= t) continue;
          const m = laid(s, t);
          if (s.family === 'pen') drawInk(c, s, t, m, true); else drawPencil(c, s, t, m, true);
        }
        if (opt.onPage) opt.onPage(c, t);
        api.pen(c, t);
        c.restore();
        p.drawingContext.drawImage(frame, 0, 0, fw, fh, 0, 0, DW, DH);
      },
      /** where the active instrument is at t: on a stroke, in the air between strokes, or travelling to/from rest */
      pen(c, t) {
        const S = plan.strokes.filter(s => s.family !== 'crumb'); if (!S.length) return;
        let cur = null, prev = null, next = null;
        for (const s of S) { if (s.t0 <= t && t <= s.t1) cur = s; if (s.t1 < t && (!prev || s.t1 > prev.t1)) prev = s; if (s.t0 > t && (!next || s.t0 < next.t0)) next = s; }
        let x, y, z, st;
        const rest = f => (f === 'pencilB' ? [-120, 640] : [1100, 680]);
        if (cur) { const m = laid(cur, t), i = Math.max(0, m - 1); x = cur.pts[i * S5]; y = cur.pts[i * S5 + 1]; z = 0; st = cur; }
        else {
          const pe = prev ? [prev.pts[(prev.n - 1) * S5], prev.pts[(prev.n - 1) * S5 + 1]] : null, ns = next ? [next.pts[0], next.pts[1]] : null;
          const same = prev && next && prev.family === next.family && (prev.family === 'pen' || prev.tool === next.tool);
          if (same && next.t0 - prev.t1 < 1.4) {
            const u = U.ease.hand((t - prev.t1) / (next.t0 - prev.t1)); st = next;
            if (next.dip && next.t0 - prev.t1 > 0.35) { const w = [1010, -60], uu = u < 0.5 ? u * 2 : (u - 0.5) * 2, a = u < 0.5 ? pe : w, b = u < 0.5 ? w : ns; x = lerp(a[0], b[0], U.ease.hand(uu)); y = lerp(a[1], b[1], U.ease.hand(uu)); z = 1; st = u < 0.5 ? prev : next; }
            else { x = lerp(pe[0], ns[0], u); y = lerp(pe[1], ns[1], u); z = Math.min(1, Math.sin(Math.PI * u) * (0.35 + (next.t0 - prev.t1) * 1.4)); }
          } else {
            const outU = prev ? clamp((t - prev.t1) / 0.45) : 1, inU = next ? clamp((next.t0 - t) / 0.45) : 1;
            if (prev && outU < 1) { const r = rest(prev.family), u = U.ease.exit(outU); x = lerp(pe[0], r[0], u); y = lerp(pe[1], r[1], u); z = Math.min(1, outU * 3); st = prev; }
            else if (next && inU < 1) { const r = rest(next.family), u = U.ease.enter(1 - inU); x = lerp(r[0], ns[0], u); y = lerp(r[1], ns[1], u); z = Math.min(1, inU * 3); st = next; }
            else return;
          }
        }
        let load = 0;
        if (st.family === 'pen') { const m = laid(st, t), i = Math.max(0, Math.min(st.n - 1, m - 1)); load = cur ? Math.pow(st.pts[i * S5 + 4], 1.6) : (t < st.t0 ? (st.dip ? 1 : Math.pow(st.pts[4], 1.6)) : st.inkEnd); }
        instrument(c, st.family, x, y, z, st.color, load);
      },
    };
    return api;
  }

  /* ── camera keyframes ── */
  function camera(keys, t) {
    if (t <= keys[0].t) return clampCam(keys[0]);
    for (let i = 1; i < keys.length; i++) if (t < keys[i].t) {
      const a = keys[i - 1], b = keys[i], u = U.ease.inOut((t - a.t) / (b.t - a.t));
      return clampCam({ x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), z: lerp(a.z, b.z, u) });
    }
    return clampCam(keys[keys.length - 1]);
  }
  function clampCam(c) { const hw = DW / 2 / c.z, hh = DH / 2 / c.z; return { x: clamp(c.x, hw, DW - hw), y: clamp(c.y, hh, DH - hh), z: c.z }; }

  /** score events from a plan: a soft scratch per pen stroke, lighter for pencil; merged by the runtime */
  function scratchScore(plan, opt = {}) {
    const ev = [];
    for (const s of plan.strokes) {
      if (opt.skip && opt.skip(s)) continue;
      const pen = s.family === 'pen';
      ev.push({ t: s.t0, kind: 'tick', freq: pen ? 5200 : 3000, gain: (pen ? 0.5 : 0.36) * (opt.gain ?? 1), pan: (s.pts[0] / DW - 0.5) * 0.6 });
    }
    for (const t of plan.dips || []) ev.push({ t: t - 0.05, kind: 'click', freq: 880, gain: 0.35 });   // nib against the inkwell rim
    return ev;
  }

  /** eraser crumbs along a sweep (little rolled worms of rubber and graphite) */
  function crumbs(x0, x1, y0, y1, n, seed) {
    const out = [];
    for (let i = 0; i < n; i++) {
      const x = lerp(x0, x1, (i + H(seed, i, 1)) / n), y = lerp(y0, y1, H(seed, i, 2)), a = H(seed, i, 3) * TAU, L = 1.5 + 2.5 * H(seed, i, 4);
      out.push([x, y, x + Math.cos(a) * L * 0.5, y + Math.sin(a) * L * 0.5 + 0.5, x + Math.cos(a) * L, y + Math.sin(a) * L]);
    }
    return out;
  }

  /** the viewer's first guess travels between the two pages (live only; the film always uses a labelled sample) */
  const GKEY = 'atelier-margin-guess1';
  function storeGuess(v) { try { localStorage.setItem(GKEY, String(Math.round(v))); } catch (e) { /* private mode */ } }
  function storedGuess() {
    try { if (new URLSearchParams(location.search).get('film') === '1') return null; const v = localStorage.getItem(GKEY); return v == null ? null : +v; }
    catch (e) { return null; }
  }
  const fluency = P => clamp((P - 0.5) / 0.45, 0, 1);

  return { PAL, PENCIL, TOOLS, text, plainWidth, G, Writer, Page, camera, laid, scratchScore, crumbs, storeGuess, storedGuess, fluency, DW, DH, S5 };
})();
