/* ════════════════════════════════════════════════════════════════════
   layer: contract — the reply's characters find the shape (M2)
   means:  "each mark is one character of the model's raw reply" (TS.RAW, every character incl. spaces)
   z:      6 (under the SVG well, stamps, schema track, slots, values)
   scenes: M2 (TS.SC.s2): characters fall out of the well as they type (TS.T.m2.type), drift and settle
           in a loose band under the well (still from ≈21 s); at the schema beat (24.5–25.9) the four
           field lines' characters snap onto the track as ribbons ON the rails just before their station;
           the prose lines ("Sure! …", "Let me know …") have no station: they sink and fade. As the car
           passes a station (same clock as the SVG car: rest-eased over TS.T.m2.car), its ribbon turns sage.
   cost:   see report (≤ 180 marks, ≤ 4 fills)
   --------------------------------------------------------------------
   Ribbon at station x: 3 rows at 2.6 pitch centred on the track y (straddling the rails), columns at
   2.6 pitch running left from x − 18 (clear of a 28-wide slot).
   ──────────────────────────────────────────────────────────────────── */
(function () {
  const SN = (v) => Math.round(v * 2) / 2;   // snap to the film's device pixels (2 px / unit): AA-free, so the raster can't vary with GPU cache state
  const touch = (c) => { c.fillStyle = 'rgba(0,0,0,0.004)'; c.fillRect(0, 0, 0.5, 0.5); };
  const parse = (css) => css.match(/[\d.]+/g).map(Number);
  const col = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${Math.max(0, a).toFixed(4)})`;
  const MK = 2, RP = 2.6;
  let C, marks;

  P5Film.layer('contract', {
    z: 6,
    setup(p, L) {
      const G = TS.G, W = G.well, S = G.schemaTrack, rs = L.stream('chars');
      C = { ink: parse(L.rgba(L.pal.ink, 1)), dim: parse(L.rgba(L.pal.dim, 1)), sage: parse(L.rgba(L.pal.accent2, 1)) };
      const lines = TS.RAW, total = lines.reduce((a, l) => a + l.length, 0);
      const station = [-1, 0, 1, 2, 3, -1];   // RAW line → schema station (prose lines: none)
      marks = []; let n = 0;
      lines.forEach((line, li) => {
        for (let k = 0; k < line.length; k++, n++) {
          const f = n / total, st = station[li];
          const m = {
            st, tType: TS.T.m2.type[0] + (TS.T.m2.type[1] - TS.T.m2.type[0]) * f,
            x0: W.x + 14 + (W.w - 28) * ((k + 0.5) / 40), y0: W.y + W.h - 6,                            // where it leaves the well
            x1: W.x + 10 + (W.w - 20) * f + rs.gauss(0, 7), y1: W.y + W.h + 14 + rs.uniform(0, 34),     // its seat in the band
            drift: rs.uniform(2.2, 3.4), bow: rs.gauss(0, 0.2), sink: rs.uniform(18, 40),
          };
          if (st >= 0) {
            const kk = k, rows = 3, c_ = Math.floor(kk / rows), r = kk % rows;
            m.x2 = S.stations[st] - 18 - RP * c_; m.y2 = S.y + (r - 1) * RP; m.stg = st * 0.12 + 0.3 * (c_ / 12);
          }
          marks.push(m);
        }
      });
    },
    draw(p, t, L, ctx) {
      const T = TS.T.m2, SC = TS.SC.s2, G = TS.G, S = G.schemaTrack, ex = ctx.ex, E = ex.ease, c = L.ctx;
      touch(c);
      if (t < T.type[0] - 0.05 || t > SC[1] + 0.05) return;
      const scene = ex.fade(t, SC), rm = ctx.rm;
      const cp = E.rest(ex.prog(t, T.car[0], T.car[1])), cx = ex.lerp(S.x0 + 8, S.x1 - 8, cp);
      const A = [], Bd = [], lit = [[], [], [], []], seat = [[], [], [], []];
      const snap0 = T.track[0] - 0.5;
      for (const m of marks) {
        if (t < m.tType && !rm) continue;
        // fall + drift into the band (closed form, still after `drift` s)
        const u = rm ? 1 : E.glaser(ex.prog(t, m.tType, m.tType + m.drift));
        let x = m.x0 + (m.x1 - m.x0) * u + Math.sin(Math.PI * u) * m.bow * 40, y = m.y0 + (m.y1 - m.y0) * u, a = 0.7;
        if (m.st < 0) {
          const k = rm ? (t >= snap0 ? 1 : 0) : E.collect(ex.prog(t, snap0, snap0 + 1.2));
          y += m.sink * k; a *= 1 - k; if (a <= 0.01) continue;
          A.push(x, y, a); continue;
        }
        const s0 = snap0 + m.stg, k = rm ? (t >= snap0 + 1.4 ? 1 : 0) : E.glaser(ex.prog(t, s0, s0 + 0.95));
        if (k > 0) { const v = 1 - k; const mx = (x + m.x2) / 2, my = Math.min(y, m.y2) - 30;
          x = v * v * x + 2 * v * k * mx + k * k * m.x2; y = v * v * y + 2 * v * k * my + k * k * m.y2; }
        if (k >= 1) (cx >= S.stations[m.st] ? lit : seat)[m.st].push(x, y); else Bd.push(x, y);
      }
      const h = MK / 2;
      // loose characters: alpha varies (prose fading) → small per-mark fills grouped in 4 alpha steps
      for (let q = 0; q < 4; q++) {
        c.beginPath(); let any = false;
        for (let n = 0; n < A.length; n += 3) if (Math.min(3, Math.floor(A[n + 2] / 0.7 * 4)) === q) { c.rect(SN(A[n] - h), SN(A[n + 1] - h), MK, MK); any = true; }
        if (any) { c.fillStyle = col(C.ink, 0.7 * (q + 0.5) / 4 * scene); c.fill(); }
      }
      const fill = (arr, style) => { if (!arr.length) return; c.beginPath(); for (let n = 0; n < arr.length; n += 2) c.rect(SN(arr[n] - h), SN(arr[n + 1] - h), MK, MK); c.fillStyle = style; c.fill(); };
      fill(Bd, col(C.ink, 0.7 * scene));
      fill([].concat(...seat), col(C.ink, 0.92 * scene));
      fill([].concat(...lit), col(C.sage, 0.95 * scene));
    },
  });
})();
