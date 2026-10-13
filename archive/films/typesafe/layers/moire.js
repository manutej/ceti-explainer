/* ════════════════════════════════════════════════════════════════════
   layer: moire — two vendors' gauges, 1 % apart (M6)
   means:  "each line is one rail" — set A: rail pairs at pitch G.moire.pitch (12); set B at pitch2 (12.12),
           the second vendor. Where the pairs coincide the band is calm; where they drift apart it shimmers.
   z:      6 (under the SVG strip text and cards)
   scenes: M6, ≈101–106: in 101.0–101.6, set B translates G.moire.shift units LINEARLY over 102.0–105.0
           (the film's one linear move: a measurement, not a gesture), out 105.6–106.2.
   cost:   see report (2 Path2D strokes, ~280 lines)
   ──────────────────────────────────────────────────────────────────── */
(function () {
  const touch = (c) => { c.fillStyle = 'rgba(0,0,0,0.004)'; c.fillRect(0, 0, 0.5, 0.5); };
  const W = [101.0, 101.6, 102.0, 105.0, 105.6, 106.2];
  let A, sA, sB;
  function rails(pitch, x0, x1, y0, y1, dx) {
    const P = new Path2D(), g = TS.G.gauge;
    for (let x = x0 + dx; x <= x1 + 1e-6; x += pitch) for (const o of [0, g]) { const xx = x + o; if (xx < x0 || xx > x1) continue; P.moveTo(xx, y0); P.lineTo(xx, y1); }
    return P;
  }
  P5Film.layer('moire', {
    z: 6,
    setup(p, L) {
      const M = TS.G.moire; A = rails(M.pitch, M.x0, M.x1, M.y0, M.y1, 0);
      sA = L.rgba(L.pal.ink, 0.2); sB = L.rgba(L.pal.peach, 0.26);
    },
    draw(p, t, L, ctx) {
      const c = L.ctx; touch(c);
      if (t < W[0] || t > W[5]) return;
      const M = TS.G.moire, ex = ctx.ex;
      const a = ex.prog(t, W[0], W[1]) * (1 - ex.prog(t, W[4], W[5]));
      const dx = ctx.rm ? 0 : M.shift * ex.prog(t, W[2], W[3]);    // linear
      c.lineWidth = 0.55;
      c.globalAlpha = a; c.strokeStyle = sA; c.stroke(A);
      c.strokeStyle = sB; c.stroke(rails(M.pitch2, M.x0, M.x1, M.y0, M.y1, dx));
      c.globalAlpha = 1;
    },
  });
})();
