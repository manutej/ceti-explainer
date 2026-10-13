/* ════════════════════════════════════════════════════════════════════
   layer: pour — invoices handed across the couplers, and the spill at a break of gauge (M5 composition)
   means:  "each mark is one invoice handed from one step to the next" (200 per coupler, per row)
   z:      6 (under the SVG cards, rails, couplers, chips, stamps)
   scenes: M5 composition (TS.T.m5.typedRun / untypedRun / untypedFail)
   cost:   see report (≤ 800 marks, ≤ 4 fills)
   --------------------------------------------------------------------
   Line per row (the SVG lane's): y = row.y + h + 14 (typed 264, untyped 414). Coupler i runs from
   blocks[i].x + w to blocks[i+1].x. Marks ride it as a 4-row ribbon ON the rails (y ±3.6), stagger
   0.006 s, 0.8 s each, coupler 2 starting 0.7 s after coupler 1 (the second step works while the first hands off).
   Typed row: inject 'ok' → both couplers pour; a mark disappears into the next card as it arrives. inject ≠ 'ok' → the batch is held at the
   first joint: it stacks as a 4-row ribbon ending at the coupler's midpoint, peach — stopped, not spilled.
   Untyped row: the failing step is pay (ok / 'string amount') or approve ('missing due'). The rails should
   stop 3 units apart in the middle of the coupler INTO that step (SVG lane); the marks reach the gap and
   pile up on the rails at the gap, rising between the two cards (rows 28, 26, … at 2.2 pitch, base y ax − 3),
   clear of the caption line below the rail.
   ──────────────────────────────────────────────────────────────────── */
(function () {
  const SN = (v) => Math.round(v * 2) / 2;   // snap to the film's device pixels (2 px / unit): AA-free, so the raster can't vary with GPU cache state
  const touch = (c) => { c.fillStyle = 'rgba(0,0,0,0.004)'; c.fillRect(0, 0, 0.5, 0.5); };
  const parse = (css) => css.match(/[\d.]+/g).map(Number);
  const col = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${Math.max(0, a).toFixed(4)})`;
  const NB = 200, STG = 0.006, DUR = 0.8, LAG = 0.7, MK = 1.5;
  let C, heap;

  P5Film.layer('pour', {
    z: 6,
    setup(p, L) {
      C = { ink: parse(L.rgba(L.pal.ink, 1)), dim: parse(L.rgba(L.pal.dim, 1)), sage: parse(L.rgba(L.pal.accent2, 1)), peach: parse(L.rgba(L.pal.peach, 1)) };
      heap = []; let w = 28, r = 0; while (heap.length < NB) { for (let k = 0; k < w && heap.length < NB; k++) heap.push([(k - (w - 1) / 2) * 2.2, -r * 2.2]); r++; w = Math.max(2, w - 2); }   // ≤ 62 wide: fits the 70-unit gap between the cards
    },
    draw(p, t, L, ctx) {
      const T = TS.T.m5, SC = TS.SC.s5, G = TS.G, B = G.blocks, ex = ctx.ex, E = ex.ease, c = L.ctx;
      touch(c);
      if (t < T.couplers - 0.05 || t > SC[1] + 0.05) return;
      const st = ctx.state || TS.STATE, bad = st.inject !== 'ok', missDue = st.inject === 'missing due';
      const scene = ex.fade(t, SC), rm = ctx.rm;
      const rows = [{ ax: B[0].y + B[0].h + 14, run: T.typedRun, typed: true }, { ax: G.untypedY + B[0].h + 14, run: T.untypedRun, typed: false }];
      const out = { ink: [], sage: [], peach: [], dim: [] };
      const tt = rm ? 1e9 : t;
      for (const R of rows) {
        for (let ci = 0; ci < 2; ci++) {
          const x0 = B[ci].x + B[ci].w, x1 = B[ci + 1].x, xm = (x0 + x1) / 2;
          const tc = R.run[0] + ci * LAG;
          // typed + bad: held at the first joint; nothing reaches coupler 2
          if (R.typed && bad && ci === 1) continue;
          // untyped: the break is in the coupler into the failing step
          const failC = missDue ? 0 : 1, breaks = !R.typed && ci === failC, after = !R.typed && ci > failC;
          if (after) continue;
          for (let n = 0; n < NB; n++) {
            const a = tc + n * STG, u = ex.prog(tt, a, a + DUR); if (u <= 0) continue;
            const lane = ((n % 4) - 1.5) * 2.4;   // 4-row ribbon straddling the rails
            if (R.typed && bad && ci === 0) {   // held: stack back from the midpoint, 4 rows
              const q = Math.floor(n / 4), r = n % 4, hx = xm - 1 - q * 2.2, hy = R.ax + (r - 1.5) * 2.0;
              const x = x0 + (hx - x0) * E.glaser(u); out.peach.push(Math.min(x, hx), hy); continue;
            }
            if (breaks) {   // ride to the gap, then fall into the heap
              const gx = xm, d = (gx - x0) / (x1 - x0), u1 = Math.min(1, u / d);
              if (u < d) { out.ink.push(x0 + (gx - x0) * u1, R.ax + lane); continue; }
              const fall = E.glaser(Math.min(1, (u - d) / (1 - d))), hp = heap[n];
              const fx = gx + hp[0], fy = R.ax - 3 + hp[1];        // piles up ON the rails, into the gap between the cards
              out.dim.push(gx + (fx - gx) * fall, R.ax + (fy - R.ax) * fall); continue;
            }
            const x = x0 + (x1 - x0) * u;
            if (u < 1) out.ink.push(x, R.ax + lane);   // arrived marks have entered the next card
          }
        }
      }
      const h = MK / 2, fill = (arr, style) => { if (!arr.length) return; c.beginPath(); for (let n = 0; n < arr.length; n += 2) c.rect(SN(arr[n] - h), SN(arr[n + 1] - h), MK, MK); c.fillStyle = style; c.fill(); };
      fill(out.ink, col(C.ink, 0.8 * scene));
      fill(out.peach, col(C.peach, 0.85 * scene));
      fill(out.dim, col(C.peach, 0.6 * scene));
    },
  });
})();
