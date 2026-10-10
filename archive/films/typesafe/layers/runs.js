/* ════════════════════════════════════════════════════════════════════
   layer: runs — the 2,000-run train through ten junctions, twice
   means:  "each mark is one run" (2,000 marks; a mark in a pile is one run that failed at that step)
   z:      6 (under the SVG mainline/siding rails, blades, step labels, tallies, counter, foot)
   scenes: M4 (TS.SC.s4): pass 1 TS.T.m4.release / travel; pass 2 from TS.T.m4.typed, release2 / travel2
   cost:   see report (2,000 closed-form positions, ≤7 fills)
   --------------------------------------------------------------------
   The train: run order is a release position q ∈ (0,1); runs leave TS.G.main.x0 at release[0] + q·span and
   move at constant speed (main length / travel). On the line they ride a 3-row ribbon ON the rails
   (lane = order mod 3, y ±1.8), ~0.54 units apart — the whole mainline is one train, thinning after
   each junction.
   Identity: survivors sit at q = (j + ½)/S (S = arrivals[10]), so the pen holds exactly
   TS.runsArrived(t, state).arrived marks at every t (the SVG counter's number); the runs that fail at
   junction k sit at q = (j + ½)/d_k, so the pile at k holds exactly round(d_k · progress) — the SVG
   tally. (A seeded key per run only breaks ties in the merged order.) Itineraries cached by `${rate}|${steps}`.
   Siding k (the SVG lane's rails): cubic (xk,220)(xk+12,225)(sx,246)(sx,278), straight down to (sx,420),
   sx = xk + TS.G.siding.dx. Pile k stands at the foot, right of the drop: W = max(8, ⌈d1/40⌉) columns at
   pitch 3 from x sx+3, rows from y 418.5 upward, mark 2.4 — 100 runs = 13 rows = 39 units: the
   0.95^k staircase. A failing run rides the siding down to its row, then steps into its slot.
   Pen (TS.G.pen): survivors leave the line end and fill 35 × 58 slots (pitch 1.7, mark 1.2) bottom-up.
   Pass 2: the pass-1 piles stay as dim ghosts; all 2,000 fill the pen in sage.
   ──────────────────────────────────────────────────────────────────── */
(function () {
  const SN = (v) => Math.round(v * 2) / 2;   // snap to the film's device pixels (2 px / unit): AA-free, so the raster can't vary with GPU cache state
  const touch = (c) => { c.fillStyle = 'rgba(0,0,0,0.004)'; c.fillRect(0, 0, 0.5, 0.5); };
  const parse = (css) => css.match(/[\d.]+/g).map(Number);
  const col = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${Math.max(0, a).toFixed(4)})`;
  const N = 2000, LANE = [-2, 0, 2], ML = 1;
  const PP = 3, PM = 2.5, PY = 418.5, PX = 3, PEN_P = 1.7, PEN_M = 1, ENTER = 0.25, STEP = 0.3;
  let C, keys, lut, sidLen, sidVert, cache = {};

  function sidingLUT() {
    const G = TS.G, dx = G.siding.dx, P = [[0, 0], [12, 5], [dx, 26], [dx, 58]], yEnd = G.siding.y - G.main.y;
    const at = (u) => { const v = 1 - u; return [0, 1].map(k => v * v * v * P[0][k] + 3 * v * v * u * P[1][k] + 3 * v * u * u * P[2][k] + u * u * u * P[3][k]); };
    const d = []; for (let i = 0; i <= 200; i++) d.push(at(i / 200));
    const L = [0]; for (let i = 1; i < d.length; i++) L.push(L[i - 1] + Math.hypot(d[i][0] - d[i - 1][0], d[i][1] - d[i - 1][1]));
    sidVert = L[L.length - 1]; d.push([dx, yEnd]); L.push(sidVert + (yEnd - 58));
    const tot = L[L.length - 1], M = 256, out = new Float32Array((M + 1) * 2); let j = 0;
    for (let k = 0; k <= M; k++) { const s = tot * k / M; while (j < L.length - 2 && L[j + 1] < s) j++; const f = (s - L[j]) / Math.max(1e-9, L[j + 1] - L[j]);
      out[2 * k] = d[j][0] + (d[j + 1][0] - d[j][0]) * f; out[2 * k + 1] = d[j][1] + (d[j + 1][1] - d[j][1]) * f; }
    sidLen = tot; return out;
  }
  function onSiding(s, out) { const M = lut.length / 2 - 1, q = Math.max(0, Math.min(M, s / sidLen * M)), k = Math.min(M - 1, q | 0), f = q - k;
    out[0] = lut[2 * k] + (lut[2 * k + 2] - lut[2 * k]) * f; out[1] = lut[2 * k + 1] + (lut[2 * k + 3] - lut[2 * k + 1]) * f; }

  function plan(rate, steps) {
    const key = rate + '|' + steps; if (cache[key]) return cache[key];
    const a = TS.arrivals(rate, steps), S = a[10], D = N - S;
    // runs 0..S-1 survive, S..N-1 fail; release positions interleave two even grids
    // every group (survivors; failures at junction k) sits on its own even grid of release positions, so the
    // number past any point is round(count · progress) — exactly the SVG lane's counter and tallies
    const q = new Float32Array(N), jk = new Int8Array(N), slotIx = new Int32Array(N), lane = new Int8Array(N);
    let i0 = 0;
    for (let j = 0; j < S; j++) q[i0++] = (j + 0.5) / S;
    for (let k = 1; k <= 10; k++) { const d = a[k - 1] - a[k]; for (let j = 0; j < d; j++) { q[i0] = (j + 0.5) / d + keys[i0] * 1e-6; jk[i0] = k; i0++; } }
    const order = Array.from({ length: N }, (_, i) => i).sort((x, y) => q[x] - q[y]);
    const seen = new Int32Array(11);
    order.forEach((i, r) => { lane[i] = r % 3; slotIx[i] = seen[jk[i]]++; });
    const W = Math.max(8, Math.ceil((a[0] - a[1]) / 40));
    const out = { a, S, q, jk, slotIx, lane, W };
    const ks = Object.keys(cache); if (ks.length > 24) delete cache[ks[0]];
    return (cache[key] = out);
  }
  function penXY(n, out) { const P = TS.G.pen, cols = Math.floor((P.x1 - P.x0) / PEN_P), r = Math.floor(n / cols), c = n % cols;
    out[0] = P.x0 + PEN_P * (c + 0.5); out[1] = P.y1 - PEN_P * (r + 0.5); }

  /* where run i is (pass 1) → bucket: 0 hidden · 1 line · 2 siding · 3 pile · 4 pen */
  function where1(i, t, P, E, out) {
    const T = TS.T.m4, G = TS.G, x0 = G.main.x0, y0 = G.main.y, len = G.main.x1 - x0, v = len / T.travel;
    const r = T.release[0] + (T.release[1] - T.release[0]) * P.q[i], s = (t - r) * v;
    if (s <= 0) return 0;
    const k = P.jk[i];
    if (k === 0) {
      if (s < len) { out[0] = x0 + s; out[1] = y0 + LANE[P.lane[i]]; return 1; }
      const sx = G.main.x1, sy = y0 + LANE[P.lane[i]]; penXY(P.slotIx[i], out);
      const u = E.glaser(Math.min(1, (s - len) / v / ENTER)); out[0] = sx + (out[0] - sx) * u; out[1] = sy + (out[1] - sy) * u; return 4;
    }
    const xk = G.junctions[k - 1].x, d = xk - x0;
    if (s < d) { out[0] = x0 + s; out[1] = y0 + LANE[P.lane[i]]; return 1; }
    const j = P.slotIx[i], row = Math.floor(j / P.W), cl = j % P.W, sx = xk + G.siding.dx;
    const px = sx + PX + PP * (cl + 0.5), py = PY - row * PP, sExit = sidVert + (py - (y0 + 58)), s2 = s - d;
    if (s2 < sExit) { onSiding(s2, out); out[0] += xk; out[1] += y0; return 2; }
    const u = E.glaser(Math.min(1, (s2 - sExit) / v / STEP)); out[0] = sx + (px - sx) * u; out[1] = py; return u >= 1 ? 3 : 2;
  }
  function where2(i, t, E, out) {
    const T = TS.T.m4, G = TS.G, x0 = G.main.x0, y0 = G.main.y, len = G.main.x1 - x0, v = len / T.travel2;
    const r = T.release2[0] + (T.release2[1] - T.release2[0]) * (i + 0.5) / N, s = (t - r) * v;
    if (s <= 0) return 0;
    if (s < len) { out[0] = x0 + s; out[1] = y0 + LANE[i % 3]; return 1; }
    const sx = G.main.x1, sy = y0 + LANE[i % 3]; penXY(i, out);
    const u = E.glaser(Math.min(1, (s - len) / v / ENTER)); out[0] = sx + (out[0] - sx) * u; out[1] = sy + (out[1] - sy) * u; return 4;
  }

  /* kept for compatibility: the canonical counter lives in data.js */
  window.__RUNS_ARRIVED = (t, state) => TS.runsArrived(t, state || TS.STATE);
  /* audit hook: marks in the pen at t (must equal TS.runsArrived(t, state).arrived) */
  window.__RUNS_PEN = (t, state) => { const st = state || TS.STATE, P = plan(st.stepRate, Math.round(st.steps)), E = CetiFeature.ex.ease, o = [0, 0]; let n = 0;
    if (t >= TS.T.m4.typed) { for (let i = 0; i < N; i++) if (where2(i, t, E, o) === 4) n++; } else { for (let i = 0; i < N; i++) if (where1(i, t, P, E, o) === 4) n++; } return n; };

  P5Film.layer('runs', {
    z: 6,
    setup(p, L) {
      const rk = L.stream('fail-keys');
      C = { ink: parse(L.rgba(L.pal.ink, 1)), dim: parse(L.rgba(L.pal.dim, 1)), acc: parse(L.rgba(L.pal.accent, 1)), sage: parse(L.rgba(L.pal.accent2, 1)) };
      keys = new Float32Array(N); for (let i = 0; i < N; i++) keys[i] = rk.next();
      lut = sidingLUT();
      plan(TS.STATE.stepRate, TS.STATE.steps);
    },
    draw(p, t, L, ctx) {
      const T = TS.T.m4, SC = TS.SC.s4, ex = ctx.ex, E = ex.ease, c = L.ctx;
      touch(c);
      if (t < T.release[0] - 0.05 || t > SC[1] + 0.05) return;
      const st = ctx.state || TS.STATE, P = plan(st.stepRate, Math.round(st.steps));
      const scene = ex.fade(t, SC), tt = ctx.rm ? (t < T.typed ? T.typed - 0.01 : T.release2[1] + T.travel2 + 1) : t;
      const pass2 = t >= T.typed;
      const ghost = pass2 ? 1 - 0.6 * E.rest(ex.prog(t, T.typed, T.typed + 0.6)) : 1;         // piles → dim ghosts
      const pen1 = pass2 ? 1 - E.warmIn(ex.prog(t, T.typed, T.typed + 0.6)) : 1;               // pass-1 pen clears
      const B = [null, [], [], [], []], B2 = [null, [], [], [], []], o = [0, 0];
      const t1 = pass2 ? T.typed - 0.001 : tt;                                                   // pass 1 frozen at its end
      for (let i = 0; i < N; i++) { const k = where1(i, t1, P, E, o); if (k) B[k].push(o[0], o[1]); }
      if (pass2) for (let i = 0; i < N; i++) { const k = where2(i, tt, E, o); if (k) B2[k].push(o[0], o[1]); }
      const fill = (arr, m, style) => { if (!arr.length) return; c.beginPath(); const h = m / 2; for (let n = 0; n < arr.length; n += 2) c.rect(SN(arr[n] - h), SN(arr[n + 1] - h), m, m); c.fillStyle = style; c.fill(); };
      fill(B[1], ML, col(C.ink, 0.72 * scene));
      fill(B[2], 1.5, col(C.dim, 0.85 * scene));
      fill(B[3], PM, col(C.dim, 0.72 * scene * ghost));
      fill(B[4], PEN_M, col(C.acc, 0.92 * scene * pen1));
      fill(B2[1], ML, col(C.ink, 0.72 * scene));
      fill(B2[4], PEN_M, col(C.sage, 0.92 * scene));
    },
  });
})();
