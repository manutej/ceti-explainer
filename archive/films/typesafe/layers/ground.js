/* ════════════════════════════════════════════════════════════════════
   layer: ground — the calm ground (structural no-op, by decision)
   means:  "each mark is one ___" — none. This layer draws nothing.
   z:      1 (under every figure and under the SVG)
   scenes: all (but paints nothing)
   cost:   ~0 ms (early return)
   --------------------------------------------------------------------
   Why a no-op: the page already paints --ex-ground (#0E1014) flat under the
   stage. A baked grain tile (rms ≤ 0.04) was considered and rejected:
   · there is no gradient on this film to band, so grain fixes nothing;
   · on a near-black ground it reads as sensor noise, not paper;
   · H.264 spends bitrate on static noise and then smears it, softening the
     1 px rails it sits under — the hairlines are the film;
   · every mark on canvas must answer "each mark is one ___"; grain can't.
   The layer stays registered so the z-order (ground 1 · figures 6 · SVG 10)
   and the frame workers' group list are stable if a texture is ever earned.
   ──────────────────────────────────────────────────────────────────── */
(function () {
  P5Film.layer('ground', {
    z: 1,
    setup() {},
    draw() { /* intentionally empty: the ground is the page's flat --ex-ground */ },
  });
})();
