/* ════════════════════════════════════════════════════════════════════
   layer: whale — the CETI whale assembled from counted marks (bookend)
   means:  "each mark is one run through the yard" (1,200 marks; the eye is one more, copper)
   z:      6 (under the SVG title, streaks and eye ring)
   scenes: M1 (TS.SC.s1: field → whale TF1, last 40 straggle in, eye lands TS.T.m1.eye, sinks over disperse)
           M7 (TS.SC.s7: field → whale TF7 under the landing line, eye lands TS.T.m7.ring[0])
   cost:   see report (1,201 closed-form quadratic lerps, 2 fills)
   --------------------------------------------------------------------
   Seats: a full-frame field — a jittered 60 × 20 grid over x 40–920, y 110–440 (Poisson-like, no
   clumps, no floor). M7 uses the same field squeezed to y 290–450, under the landing lines. Targets: TS.samplePath over TS.G.WPATHS, 1,200 split by each path's n weight
   (largest remainder), with a small normal jitter so a stroke reads as a stipple of marks. Seats and
   targets are paired in x order, so the field gathers as a curtain, not a crossing spray. 40 marks
   (seeded) are stragglers: they leave last and land just before the eye, so the eye is an event.
   Motion: q(seat → bow → target) with glaser; no simulation, no state.
   ──────────────────────────────────────────────────────────────────── */
(function () {
  const SN = (v) => Math.round(v * 2) / 2;   // snap to the film's device pixels (2 px / unit): AA-free, so the raster can't vary with GPU cache state
  const touch = (c) => { c.fillStyle = 'rgba(0,0,0,0.004)'; c.fillRect(0, 0, 0.5, 0.5); };
  const parse = (css) => css.match(/[\d.]+/g).map(Number);
  const col = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${Math.max(0, a).toFixed(4)})`;
  const N = 1200, GX = 60, GY = 20, STRAG = 40;
  let seats, seats7, tgt1, tgt7, bow, st, dur, strag, sink, eye, C;

  P5Film.layer('whale', {
    z: 6,
    setup(p, L) {
      const G = TS.G, rs = L.stream('seats'), rt = L.stream('targets'), rm = L.stream('motion');
      C = { ink: parse(L.rgba(L.pal.ink, 1)), acc: parse(L.rgba(L.pal.accent, 1)) };
      // targets (source space), by n weight
      const w = G.WPATHS.map(o => o.n), tot = w.reduce((a, b) => a + b, 0), per = TS.counts(w.map(x => x / tot), N), src = [];
      G.WPATHS.forEach((o, pi) => {
        const pts = TS.samplePath(o.d, per[pi] + 2);
        for (let k = 1; k <= per[pi]; k++) {
          const a = pts[k - 1], b = pts[k + 1], q = pts[k];
          let nx = -(b.y - a.y), ny = b.x - a.x; const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
          const j = rt.gauss(0, 0.55); src.push({ x: q.x + nx * j, y: q.y + ny * j });
        }
      });
      // seats: jittered grid over the frame
      const field = [];
      const cw = 880 / GX, ch = 330 / GY;
      for (let r = 0; r < GY; r++) for (let c = 0; c < GX; c++) field.push({ x: 40 + cw * (c + 0.5 + rs.uniform(-0.42, 0.42)), y: 110 + ch * (r + 0.5 + rs.uniform(-0.42, 0.42)) });
      // M7: the same field squeezed into the band under the landing lines (y 290–450), so nothing sits behind the quote
      const y7 = (y) => 290 + (y - 110) * (160 / 330);
      // pair in x order (targets sorted by their TF1 x; the same order serves TF7 — same shape)
      const ti = src.map((q, i) => i).sort((a, b) => src[a].x - src[b].x);
      const si = field.map((q, i) => i).sort((a, b) => field[a].x - field[b].x);
      seats = new Float32Array(N * 2); seats7 = new Float32Array(N * 2); tgt1 = new Float32Array(N * 2); tgt7 = new Float32Array(N * 2);
      for (let n = 0; n < N; n++) {
        const q = src[ti[n]], f = field[si[n]], a = TS.tf(G.TF1, q), b = TS.tf(G.TF7, q);
        seats[2 * n] = f.x; seats[2 * n + 1] = f.y; seats7[2 * n] = f.x; seats7[2 * n + 1] = y7(f.y); tgt1[2 * n] = a.x; tgt1[2 * n + 1] = a.y; tgt7[2 * n] = b.x; tgt7[2 * n + 1] = b.y;
      }
      bow = new Float32Array(N); st = new Float32Array(N); dur = new Float32Array(N); strag = new Uint8Array(N); sink = new Float32Array(N * 2);
      for (let n = 0; n < N; n++) {
        bow[n] = rm.gauss(0, 0.12);
        const dy = Math.abs(seats[2 * n + 1] - tgt1[2 * n + 1]) / 330;
        st[n] = Math.min(1, 0.55 * rm.uniform() + 0.45 * (1 - dy));   // near marks leave later: the frame closes in
        dur[n] = rm.uniform(1.4, 2.0);
        sink[2 * n] = rm.gauss(0, 5); sink[2 * n + 1] = rm.uniform(30, 90);
      }
      const sh = rm.shuffle(Array.from({ length: N }, (_, i) => i)).slice(0, STRAG);
      sh.forEach((n, k) => { strag[n] = 1; st[n] = k / STRAG; });
      const e1 = TS.tf(G.TF1, G.EYE), e7 = TS.tf(G.TF7, G.EYE);
      eye = { seat: { x: 912, y: 118 }, seat7: { x: 912, y: 296 }, t1: e1, t7: e7 };   // the far corner of the field: the longest flight lands last
    },

    draw(p, t, L, ctx) {
      const T = TS.T, SC = TS.SC, ex = ctx.ex, E = ex.ease, c = L.ctx;
      touch(c);
      const inM1 = t >= SC.s1[0] && t < SC.s1[1], inM7 = t >= SC.s7[0] - 0.1 && t <= SC.s7[1] + 0.1;
      if (!inM1 && !inM7) return;
      const rm = ctx.rm, tgt = inM1 ? tgt1 : tgt7, SE = inM1 ? seats : seats7;
      const conv = inM1 ? T.m1.conv : T.m7.conv, eyeT = inM1 ? T.m1.eye : T.m7.ring[0];
      const appear = inM1 ? ex.prog(t, 0, 0.6) : ex.prog(t, SC.s7[0] + 0.2, SC.s7[0] + 0.9);
      const dsp = inM1 ? ex.prog(t, T.m1.disperse[0], T.m1.disperse[1]) : 0, sinkE = E.collect(dsp);
      const alpha = (1 - dsp) * appear; if (alpha <= 0.001) return;
      const span = conv[1] - conv[0], m = inM1 ? 1.5 : 1, h = m / 2;
      const sA = [], sB = [];   // at rest in the field (dim) / moving or landed (bright)
      for (let n = 0; n < N; n++) {
        const sx = SE[2 * n], sy = SE[2 * n + 1], tx = tgt[2 * n], ty = tgt[2 * n + 1];
        let x, y, u;
        if (rm) u = t >= eyeT ? 1 : 0;
        else {
          const t0 = strag[n] ? conv[1] - 1.1 + 0.45 * st[n] : conv[0] + st[n] * (span - 0.6 - dur[n]);
          const d = strag[n] ? eyeT - 0.12 - t0 : dur[n];
          u = E.glaser(ex.prog(t, t0, t0 + d));
        }
        if (u <= 0) { x = sx; y = sy; }
        else if (u >= 1) { x = tx; y = ty; }
        else { const mx = (sx + tx) / 2 - (ty - sy) * bow[n], my = (sy + ty) / 2 + (tx - sx) * bow[n], v = 1 - u;
          x = v * v * sx + 2 * v * u * mx + u * u * tx; y = v * v * sy + 2 * v * u * my + u * u * ty; }
        if (dsp > 0) { x += sink[2 * n] * sinkE; y += sink[2 * n + 1] * sinkE; }
        (u > 0 ? sB : sA).push(x, y);
      }
      const fill = (arr, style) => { if (!arr.length) return; c.beginPath(); for (let k = 0; k < arr.length; k += 2) c.rect(SN(arr[k] - h), SN(arr[k + 1] - h), m, m); c.fillStyle = style; c.fill(); };
      fill(sA, col(C.ink, 0.42 * alpha));
      fill(sB, col(C.ink, 0.86 * alpha));
      // the eye: one copper mark, from the far corner, lands last
      const et = inM1 ? eye.t1 : eye.t7;
      const ue = rm ? (t >= eyeT ? 1 : 0) : E.glaser(ex.prog(t, eyeT - 1.3, eyeT));
      const es = inM1 ? eye.seat : eye.seat7, v = 1 - ue, mx = (es.x + et.x) / 2, my = Math.min(es.y, et.y) - 30;
      let ex_ = v * v * es.x + 2 * v * ue * mx + ue * ue * et.x, ey = v * v * es.y + 2 * v * ue * my + ue * ue * et.y;
      if (dsp > 0) ey += 50 * sinkE;
      const em = inM1 ? 2.5 : 2;
      c.fillStyle = col(C.acc, alpha * (ue > 0 ? 1 : 0.6));
      c.fillRect(SN(ex_ - em / 2), SN(ey - em / 2), em, em);
    },
  });
})();
