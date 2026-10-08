/* marbling.patterns.js — the marbler's recipes, as op lists for MK (needs marbling.kit.js first).
   Every recipe is a pure function of its arguments (seeds are counters into MK.hh). */
const MP = (() => {
  'use strict';
  const H = MK.hh;
  /* pigments (light-ground CETI semantics: copper = what flows (the work), peach = error, sage = verified,
     slate = structure; ink + wash + chalk are the marbler's neutrals) */
  const PIG = { copper: 0, ink: 1, wash: 2, chalk: 3, peach: 4 };
  function palette() {
    const pal = [];
    pal[PIG.copper] = MK.ink('#B9782C', '#7E4A14', 0.16, 0.20);
    pal[PIG.ink] = MK.ink('#34302B', '#1A1714', 0.10, 0.12);
    pal[PIG.wash] = MK.ink('#D9B880', '#B98F4E', 0.14, 0.22);
    pal[PIG.chalk] = MK.ink('#F1ECE1', '#CFC5B1', 0.07, 0.18);
    pal[PIG.peach] = MK.ink('#D2452A', '#8C2412', 0.10, 0.26);
    pal.water = MK.ink('#E7E3D8', '#E7E3D8', 0.05, 0);
    return pal;
  }

  /** taş (battal) ground: rounds of drops over a domain {W,H} (plus margin). Older stones are pushed into polygons. */
  function stones(seed, dom, opt = {}) {
    const ops = [], m = opt.margin ?? 0.25, sc = opt.scale ?? 1;
    const rounds = opt.rounds || [
      { ink: PIG.ink, n: 34, r0: 0.08, r1: 0.13 },
      { ink: PIG.copper, n: 46, r0: 0.08, r1: 0.13 },
      { ink: PIG.wash, n: 40, r0: 0.06, r1: 0.10 },
      { ink: PIG.chalk, n: 30, r0: 0.04, r1: 0.07 },
    ];
    let c = 0;
    rounds.forEach((R, ri) => {
      for (let i = 0; i < R.n; i++, c++) {
        const x = -m + H(seed, c, 1) * (dom.W + 2 * m), y = -m + H(seed, c, 2) * (dom.H + 2 * m);
        const r = (R.r0 + (R.r1 - R.r0) * H(seed, c, 3)) * sc;
        ops.push(MK.drop(x, y, r, R.ink, { tag: ri }));
      }
    });
    return ops;
  }

  /** the 20 comb passes (one per agent step): gel-git → vertical gel-git → fine comb → bouquet waves.
   *  dom: {W,H}; every pass sweeps (the comb travels across the tray). */
  function passes(dom) {
    const P = [], d = { dom }, R = Math.PI / 2, E = Math.PI;
    // 1–6 gel-git: a coarse rake dragged there and back across the tray, each return offset between the last tines
    const g = [[0, 0.22, 0.00], [E, 0.20, 0.125], [0, 0.17, 0.0625], [E, 0.15, 0.1875], [0, 0.12, 0.031], [E, 0.10, 0.156]];
    g.forEach(([a, z, q]) => P.push(MK.comb(a, z, 0.25, 0.045, q, d)));
    // 7–12 the same, top to bottom: the zigzags fold into chevrons
    const v = [[R, 0.16, 0.00], [-R, 0.14, 0.10], [R, 0.12, 0.05], [-R, 0.10, 0.15], [R, 0.08, 0.025], [-R, 0.07, 0.125]];
    v.forEach(([a, z, q]) => P.push(MK.comb(a, z, 0.20, 0.040, q, d)));
    // 13–16 the fine comb (nonpareil), all one way, a hair apart
    [0.00, 0.02, 0.04, 0.06].forEach((q, i) => P.push(MK.comb(R, 0.045 - i * 0.006, 0.08, 0.020, q, d)));
    // 17–20 bouquet: broad waves, then one last wide rake
    P.push(MK.wave(0, 0.035, 2 * E / 0.40, 0.0, d), MK.wave(R, 0.03, 2 * E / 0.50, 1.3, d),
           MK.wave(0, 0.03, 2 * E / 0.40, 2.0, d), MK.comb(R, 0.06, 0.40, 0.08, 0.2, d));
    return P;
  }


  /** the generator's noise: a light battal (pale stones) over domain {W,H} */
  function paleStones(seed, dom) {
    return stones(seed, dom, { margin: 0.2, rounds: [
      { ink: PIG.wash, n: 40, r0: 0.07, r1: 0.11 },
      { ink: PIG.chalk, n: 34, r0: 0.06, r1: 0.10 },
      { ink: PIG.copper, n: 16, r0: 0.03, r1: 0.06 },
      { ink: PIG.ink, n: 12, r0: 0.02, r1: 0.04 },
    ] });
  }
  /** motifs: drops + needle strokes, centred at (cx,cy), size k. v ∈ [0,1) varies the variant (from the noise draw). */
  function motif(kind, cx, cy, k, v = 0) {
    const o = [], j = (a, b) => H(977, a, b) - 0.5, d = (x, y, r, ink) => o.push(MK.drop(cx + x * k, cy + y * k, r * k, ink));
    const st = (x0, y0, x1, y1, z, lam) => o.push(MK.stroke(cx + x0 * k, cy + y0 * k, cx + x1 * k, cy + y1 * k, z * k, lam * k));
    const tn = (x, y, a, z, lam) => o.push(MK.tine(cx + x * k, cy + y * k, a, z * k, lam * k));
    const tilt = 0.25 * (v - 0.5);
    if (kind === 'tulip') {
      // stem and leaves first (they are pushed aside by the bloom)
      for (let i = 0; i < 7; i++) d(0.0 + tilt * 0.1 * i, 0.20 + i * 0.07, 0.035, PIG.ink);
      d(-0.13, 0.42, 0.07, PIG.ink); d(0.14, 0.50, 0.065, PIG.ink);
      st(-0.13, 0.42, -0.30, 0.18, 0.16, 0.035); st(0.14, 0.50, 0.32, 0.26, 0.16, 0.035);
      // the bloom: concentric drops
      d(0, 0, 0.20, PIG.copper); d(0, 0.01, 0.135, PIG.chalk); d(0, 0.02, 0.09, PIG.copper); d(0, 0.03, 0.04, PIG.ink);
      // two strokes up through the bloom make the petal tips, one down draws the stem
      st(-0.065, 0.30, -0.065 + tilt * 0.1, -0.42, 0.13, 0.03); st(0.065, 0.30, 0.065 + tilt * 0.1, -0.42, 0.13, 0.03);
      st(0, -0.05, 0, 0.62, 0.10, 0.02);
    } else if (kind === 'carnation') {
      d(0, 0, 0.24, PIG.copper); d(0, 0, 0.18, PIG.chalk); d(0, 0, 0.13, PIG.copper); d(0, 0, 0.07, PIG.wash); d(0, 0, 0.03, PIG.ink);
      const n = 11 + Math.round(v * 4);
      for (let i = 0; i < n; i++) { const a = (i / n) * 2 * Math.PI + v; st(Math.cos(a) * 0.36, Math.sin(a) * 0.36, Math.cos(a) * 0.05, Math.sin(a) * 0.05, 0.09, 0.012); }
      for (let i = 0; i < 5; i++) d(0, 0.34 + i * 0.07, 0.03, PIG.ink);
      st(0, 0.25, 0, 0.75, 0.09, 0.02);
    } else if (kind === 'wave') {
      // a band of drops, then a swell, then the curl
      const n = 9;
      for (let L = 0; L < 3; L++) for (let i = 0; i < n; i++) d(-0.42 + i * 0.105, 0.05 + L * 0.0, 0.07 - L * 0.022, [PIG.ink, PIG.copper, PIG.chalk][L]);
      o.push(MK.wave(-Math.PI / 2, 0.08 * k, 2 * Math.PI / (0.8 * k), 1.2 + v, {}));
      o.push(MK.swirl(cx + 0.18 * k, cy - 0.06 * k, 4.2 + v, 0.20 * k));
      tn(0, 0.22, 0, 0.06, 0.03);
    }
    return o;
  }


  /** the native film's 10 passes over a portrait tray: enough to hide any picture, each exactly invertible */
  function passes10(dom) {
    // fine first, coarse last: run backwards, the coarse passes come off first, so the picture's layout
    // appears early and its detail sharpens late (coarse-to-fine, as a generator's steps do)
    const P = [], d = { dom }, R = Math.PI / 2, E = Math.PI;
    P.push(MK.wave(R, 0.04, 2 * E / 0.16, 0.4, d), MK.wave(0, 0.035, 2 * E / 0.18, 1.9, d));
    P.push(MK.comb(0.7, 0.07, 0.09, 0.02, 0.02, d), MK.comb(E + 0.7, 0.06, 0.09, 0.02, 0.06, d));
    P.push(MK.comb(R, 0.14, 0.16, 0.035, 0.00, d), MK.comb(-R, 0.13, 0.16, 0.035, 0.08, d), MK.comb(R, 0.10, 0.16, 0.03, 0.04, d));
    P.push(MK.comb(0, 0.22, 0.20, 0.04, 0.00, d), MK.comb(E, 0.20, 0.20, 0.04, 0.10, d), MK.comb(0, 0.16, 0.20, 0.035, 0.05, d));
    return P;
  }


  /** the shared film's tray: battal stones for a W×H tray (design px units) and the four vertical gel-git passes
   *  that prepare it (the nonpareil comb then runs along the lanes) */
  function laneGround(seed, W, H) {
    const st = stones(seed, { W, H }, { margin: 40, rounds: [
      { ink: PIG.ink, n: 26, r0: 22, r1: 40 }, { ink: PIG.copper, n: 44, r0: 24, r1: 44 },
      { ink: PIG.wash, n: 36, r0: 18, r1: 34 }, { ink: PIG.chalk, n: 30, r0: 10, r1: 20 }] });
    const R = Math.PI / 2, SP = 22;
    const gel = [MK.comb(R, 30, SP, 4, 0), MK.comb(-R, 26, SP, 4, SP / 2), MK.comb(R, 18, SP, 3.5, SP / 4), MK.comb(-R, 14, SP, 3.5, 3 * SP / 4)];
    return { stones: st, gel };
  }

  return { PIG, palette, stones, passes, passes10, paleStones, motif, laneGround };
})();
if (typeof module !== 'undefined') module.exports = MP;
