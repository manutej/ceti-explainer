/* B · MARBLING · native — "How image generators work: un-combing" (glance, 30 s) · revision 1.
   Act 1: a tulip is made of drops + needle strokes on a full tray, then combed 10 passes — and every pass also
   sprinkles a few drops of noise that nobody records. Run the combing backwards and a tulip comes back, but not the
   same one: the original's outline is dashed over it. (Combing alone would be exactly invertible; the unrecorded
   noise is what makes the way back a guess — which is what a generator does.)
   Act 2 (sketch): training — many pictures are combed into noise; the generator learns to guess one pass back.
   Act 3: ONE noise in three trays (identical by construction: no motif op has begun). Each prompt's drops and strokes
   grow BENEATH the combing (stones → motif → the prompt's own ghost comb → combs) while the passes come off, coarse
   first: each tray's ghost comb moves differently, and the picture emerges already combed and sharpens.
   Control: the noise draw re-runs every tray (new stones, new variants; same prompts ⇒ same subjects). */
(function () {
  const DOM = { W: 0.8, H: 1.0 }, VIEW = { x0: 0, y0: 0, w: 0.8, h: 1.0 }, NP = 10, CX = 0.4, CY = 0.44, KM = 0.82;
  const DOMH = { W: 1.6, H: 0.9 }, VIEWH = { x0: 0, y0: 0, w: 1.6, h: 0.9 };
  const BAKE = { x0: -0.42, y0: -0.36, w: 1.64, h: 1.72 }, BAKEH = { x0: -0.45, y0: -0.4, w: 2.5, h: 1.7 };
  const COL = { ground: '#D2D4CA', zinc: '#3E5A78', label: '#F1EEE4' };
  // timeline
  const T_MOT0 = 0.7, T_MOT1 = 4.4, T_FWD0 = 4.8, D_FWD = 0.5, T_HOLD = 9.8, T_REV0 = 10.6, D_REV = 0.4, T_BACK = 14.6;
  const T_TR0 = 14.9, T_TRC0 = 15.5, D_TRC = 0.19, T_TR1 = 17.6, T_GEN0 = 17.7, T_TAU0 = 20.0, T_TAU1 = 27.4, DUR = 30;
  const HERO = { x: 0, y: 0, w: 960, h: 540 };
  const SMALL = i => ({ x: 233 + i * 172, y: 92, w: 150, h: 188 });
  const GEN = i => ({ x: 80 + i * 278, y: 104, w: 244, h: 305 });
  const KINDS = ['tulip', 'carnation', 'wave'], PROMPT = ['a tulip', 'a carnation', 'a wave'];
  const TRAIN = ['carnation', 'wave', 'tulip'];
  const HC = { x: 0.54, y: 0.47, k: 0.72 }, GC = { x: 0.64, y: 0.42, k: 0.82 };   // the hero tulip, and the one guessed back
  const U0 = Atelier.U;

  /* scene for a noise draw (memoised) */
  const _scene = new Map();
  function scene(noise, pal) {
    if (_scene.has(noise)) return _scene.get(noise);
    const v = k => MK.hh(noise, k, 5);
    const C = MP.passes10(DOM), CH = MP.passes10(DOMH);
    const pale = (seed, dom, m) => MP.stones(seed, dom, { margin: 0.2, rounds: [
      { ink: MP.PIG.wash, n: Math.round(40 * m), r0: 0.07, r1: 0.11 }, { ink: MP.PIG.chalk, n: Math.round(34 * m), r0: 0.06, r1: 0.10 },
      { ink: MP.PIG.copper, n: Math.round(16 * m), r0: 0.03, r1: 0.06 }, { ink: MP.PIG.ink, n: Math.round(12 * m), r0: 0.02, r1: 0.04 }] });
    const texH = MK.bake(pale(100 + noise, DOMH, 1.9), pal, BAKEH, 260);
    const texA = MK.bake(MP.paleStones(100 + noise, DOM), pal, BAKE, 300);
    const texB = MK.bake(MP.paleStones(200 + noise, DOM), pal, BAKE, 300);
    // hero: original tulip, the guessed tulip, then each pass followed by its unrecorded sprinkle
    const orig = MP.motif('tulip', HC.x, HC.y, HC.k, v(9)), guess = MP.motif('tulip', GC.x, GC.y, GC.k, 1 - v(9));
    const spr = [], heroOps = orig.concat(guess), heroKind = orig.map(() => 'o').concat(guess.map(() => 'g'));
    const PIGS = [MP.PIG.ink, MP.PIG.copper, MP.PIG.chalk, MP.PIG.wash];
    for (let i = 0; i < NP; i++) {
      heroOps.push(CH[i]); heroKind.push('c' + i);
      for (let m = 0; m < 4; m++) {
        heroOps.push(MK.drop(0.08 + 1.44 * MK.hh(noise, i * 8 + m, 31), 0.06 + 0.78 * MK.hh(noise, i * 8 + m, 32), 0.022 + 0.022 * MK.hh(noise, i * 8 + m, 33),
          PIGS[Math.floor(MK.hh(noise, i * 8 + m, 34) * 4)]));
        heroKind.push('s' + i);
      }
    }
    const gSched = schedule(guess, GC.k, [0.12, 0.45], [0.28, 0.6], [0.48, 0.85]);
    // the original's outline (dashed over the guess at the end): marching squares on "inside the original motif"
    const outline = contour(orig, DOMH, 192, 108);
    const tray = (kind, vv) => { const m = MP.motif(kind, CX, CY, KM, vv); return { m, ops: m.concat(C), nm: m.length }; };
    const ghost = [MK.comb(-Math.PI / 2, 0.15, 0.13, 0.035, 0.02, { dom: DOM }), MK.comb(Math.PI / 4, 0.14, 0.12, 0.035, 0.05, { dom: DOM }),
      MK.wave(0, 0.09, 2 * Math.PI / 0.22, 0.6, { dom: DOM })];                // each prompt's own way back (sketch)
    const gen = KINDS.map((k, i) => { const m = MP.motif(k, CX, CY, KM, v(i)); return { m, ops: m.concat([ghost[i]], C), nm: m.length, g: ghost[i],
      sched: schedule(m, KM, [0.0, 0.3], [0.18, 0.48], [0.38, 0.72]) }; });
    const S = { C, CH, texH, texA, texB, heroOps, heroKind, orig, guess, gSched, outline, train: TRAIN.map((k, i) => tray(k, v(20 + i))), gen };
    _scene.set(noise, S);
    return S;
  }
  /** motif growth windows (in units of reverse progress): big drops first, small drops, then strokes (coarse → fine) */
  function schedule(m, k, big, small, strokes) {
    const sc = m.map(o => (o.k === MK.DROP ? (o.r > 0.09 * k ? big.slice() : small.slice()) : strokes.slice()));
    const bigs = m.map((o, i) => i).filter(i => sc[i][0] === big[0] && m[i].k === MK.DROP && m[i].r > 0.09 * k);
    bigs.forEach((i, n) => { const o = 0.12 * n / Math.max(1, bigs.length - 1); sc[i] = [big[0] + o, big[1] + o]; });
    return sc;
  }
  /** marching squares over a domain grid: segments where "inside the motif" changes */
  function contour(ops, dom, gw, gh) {
    const S = new Float32Array(ops.length).fill(1), R = {}, inside = new Uint8Array((gw + 1) * (gh + 1)), seg = [];
    for (let j = 0; j <= gh; j++) for (let i = 0; i <= gw; i++) inside[j * (gw + 1) + i] = MK.pull(ops, S, ops.length, i / gw * dom.W, j / gh * dom.H, R) >= 0 ? 1 : 0;
    const P = (i, j) => [i / gw * dom.W, j / gh * dom.H];
    for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) {
      const a = inside[j * (gw + 1) + i], b = inside[j * (gw + 1) + i + 1], c = inside[(j + 1) * (gw + 1) + i + 1], d = inside[(j + 1) * (gw + 1) + i];
      const code = a * 8 + b * 4 + c * 2 + d; if (code === 0 || code === 15) continue;
      const T = [(i + 0.5), j], Rr = [i + 1, j + 0.5], B = [i + 0.5, j + 1], L = [i, j + 0.5];
      const E = { 1: [[L, B]], 2: [[B, Rr]], 3: [[L, Rr]], 4: [[T, Rr]], 5: [[L, T], [B, Rr]], 6: [[T, B]], 7: [[L, T]], 8: [[L, T]], 9: [[T, B]], 10: [[T, Rr], [L, B]], 11: [[T, Rr]], 12: [[L, Rr]], 13: [[B, Rr]], 14: [[L, B]] }[code];
      for (const [p0, p1] of E) seg.push([P(p0[0], p0[1]), P(p1[0], p1[1])]);
    }
    return seg;
  }

  Atelier.film({
    id: 'marbling-native',
    title: 'Marbling — un-combing: how image generators work',
    direction: 'B · Marbling · invertible comb maps',
    level: 'glance',
    duration: DUR,
    size: [960, 540],
    renderer: 'p2d',
    fps: 30,
    seed: 1,
    ground: COL.ground,
    chapters: [{ t: 0, label: 'A tulip' }, { t: T_FWD0, label: 'Combed, with noise' }, { t: T_REV0, label: 'Back: a guess' },
      { t: T_TR0, label: 'Training (sketch)' }, { t: T_GEN0, label: 'One noise, three prompts' }],
    captions: [
      { t0: 0.2, t1: 4.6, text: 'A marbler makes a tulip from drops of paint on size-water and two strokes of a needle.' },
      { t0: 4.8, t1: T_HOLD, text: 'Comb it ten times, and each pass let a few drops of noise fall in: the tulip is gone.' },
      { t0: T_HOLD, t1: T_REV0 + 1.0, text: 'Combing alone could be run backwards exactly. The noise kept no record.' },
      { t0: T_REV0 + 1.0, t1: T_BACK + 0.3, text: 'Run it back and a tulip appears, but not yours: the dashed line is the one you made.' },
      { t0: T_TR0, t1: T_TR1, text: 'A generator trains on millions of pictures made noisy. It learns to guess one step back.' },
      { t0: T_GEN0, t1: T_TAU0, text: 'Now start from fresh noise: the same noise in all three trays, with no picture in it.' },
      { t0: T_TAU0, t1: T_TAU1, text: 'Each prompt steers its own way back (the copper comb): coarse shapes first, detail last.' },
      { t0: T_TAU1, t1: DUR, text: 'One noise, three prompts, three pictures: learned from training, not hidden in the noise.' },
    ],
    state: { noise: 1 },
    controls: [{ key: 'noise', type: 'select', label: 'Noise draw', options: [1, 2, 3, 4, 5, 6].map(n => [n, 'noise ' + n]),
      hint: 'Draw new noise and every tray re-runs: same prompts, same subjects, new variants. The noise picks the variant; the prompt picks the picture.' }],

    setup(p, ctx) {
      ctx.pal = MP.palette();
      ctx.buf = null;
      scene(ctx.state.noise, ctx.pal);
    },

    draw(p, t, ctx) {
      const Sx = scene(ctx.state.noise, ctx.pal);
      const kb = Math.min(ctx.size.k, 1.25), BW = Math.round(960 * kb), BH = Math.round(540 * kb);
      if (!ctx.buf || ctx.buf.W !== BW) {
        ctx.buf = MK.frame(BW, BH);
        const g = MK.hex(COL.ground), G = new Uint8ClampedArray(BW * BH * 4);
        for (let j = 0; j < BH; j++) for (let i = 0; i < BW; i++) {
          const m = 1 + 0.035 * (MK.mottle(i / BW * 3.1, j / BH * 1.7) - 0.5), k = (j * BW + i) * 4;
          G[k] = g[0] * m; G[k + 1] = g[1] * m; G[k + 2] = g[2] * m; G[k + 3] = 255;
        }
        ctx.ground = G;
      }
      const F = ctx.buf; F.data.set(ctx.ground);
      const trays = [];

      /* Act 1: the full tray */
      const heroA = 1 - U0.seg(t, T_TR0, T_TR0 + 0.6);
      if (heroA > 0) trays.push({ rect: HERO, view: VIEWH, ops: Sx.heroOps, S: heroS(t, Sx), tex: Sx.texH, alpha: heroA, dom: DOMH, hero: 1 });
      /* Act 2: training trays (other pictures, combed into noise) */
      if (t >= T_TR0 && t < T_TR1 + 0.5) {
        const gone = U0.seg(t, T_TR1, T_TR1 + 0.5, 'exit');
        Sx.train.forEach((g, k) => {
          const vis = U0.seg(t, T_TR0 + 0.3 + 0.15 * k, T_TR0 + 0.8 + 0.15 * k, 'enter') * (1 - gone);
          if (vis <= 0) return;
          const S2 = new Float32Array(g.nm + NP); for (let i = 0; i < g.nm; i++) S2[i] = 1;
          for (let i = 0; i < NP; i++) S2[g.nm + i] = U0.seg(t, T_TRC0 + 0.1 * k + i * D_TRC, T_TRC0 + 0.1 * k + (i + 1) * D_TRC, 'inOut');
          trays.push({ rect: scaleR(SMALL(k), vis), view: VIEW, ops: g.ops, S: S2, tex: Sx.texA, dom: DOM });
        });
      }
      /* Act 3: one noise, three prompts */
      if (t >= T_GEN0) {
        const tau = 1 - U0.seg(t, T_TAU0, T_TAU1, 'linear');
        Sx.gen.forEach((g, k) => {
          const vis = U0.seg(t, T_GEN0 + 0.2 + 0.12 * k, T_GEN0 + 0.8 + 0.12 * k, 'enter');
          const S3 = new Float32Array(g.nm + 1 + NP);
          for (let i = 0; i < g.nm; i++) { const [a, b] = g.sched[i]; S3[i] = U0.ease.inOut(U0.clamp((1 - tau - a) / (b - a))); }
          S3[g.nm] = ghostS(tau);
          for (let i = 0; i < NP; i++) S3[g.nm + 1 + i] = U0.ease.inOut(U0.clamp((tau - i / NP) * NP));
          trays.push({ rect: scaleR(GEN(k), vis), view: VIEW, ops: g.ops, S: S3, tex: Sx.texB, dom: DOM, gen: g });
        });
      }

      for (const T of trays) if (!T.hero) shadow(F, T.rect, kb, T.rect.w > 200 ? 4 : 2.5);
      for (const T of trays) MK.paint(F, { x: T.rect.x * kb, y: T.rect.y * kb, w: T.rect.w * kb, h: T.rect.h * kb }, T.view, T.ops, T.S, ctx.pal,
        { tex: T.tex, ss: T.rect.w < 170 ? 2 : 1, alpha: T.alpha ?? 1 });
      F.flush();
      const c = p.drawingContext; c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high';
      c.drawImage(F.canvas, 0, 0, c.canvas.width, c.canvas.height); c.restore();

      for (const T of trays) {
        if (!T.hero) { p.noFill(); p.stroke(COL.zinc); p.strokeWeight(T.rect.w > 200 ? 3.5 : 2.2); p.rect(T.rect.x, T.rect.y, T.rect.w, T.rect.h, 4); }
        if (T.hero && T.alpha < 1) continue;
        const nC = T.hero ? null : T.gen ? T.gen.nm + 1 : T.ops.length - NP;
        if (T.hero) { const i = heroComb(t); if (i) pins(p, Sx.CH[i.i], i.s, T.rect, T.dom, 1); }
        else {
          for (let i = 0; i < NP; i++) { const s = T.S[nC + i]; if (s > 0.001 && s < 0.999) { pins(p, (T.gen ? Sx.C : Sx.C)[i], s, T.rect, T.dom, 1); break; } }
          if (T.gen) { const s = T.S[T.gen.nm]; if (s > 0.001 && s < 0.999) pins(p, T.gen.g, s, T.rect, T.dom, 1, ctx.tokens.copper); }
        }
      }
      words(p, ctx, t, Sx);
    },

    score(ctx) {
      const ev = [];
      ev.push({ t: 0.2, kind: 'tone', freq: 261.6, dur: 2.6, gain: 0.5 });
      for (let i = 0; i < 18; i++) ev.push({ t: T_MOT0 + (i / 18) * (T_MOT1 - T_MOT0 - 0.4), kind: 'tick', freq: 4800 - i * 90, gain: 0.25 });
      for (let i = 0; i < NP; i++) {
        ev.push({ t: T_FWD0 + i * D_FWD + 0.05, kind: 'tick', freq: 1300, gain: 0.55, pan: -0.2 });
        ev.push({ t: T_FWD0 + (i + 0.7) * D_FWD, kind: 'tick', freq: 5200, gain: 0.22, pan: 0.25 });   // the sprinkle
      }
      ev.push({ t: T_HOLD + 0.1, kind: 'tone', freq: 220, dur: 0.9, gain: 0.45 });
      for (let i = 0; i < NP; i++) ev.push({ t: T_REV0 + i * D_REV + 0.05, kind: 'tick', freq: 2400, gain: 0.5, pan: 0.2 });
      ev.push({ t: T_BACK - 0.3, kind: 'tone', freq: 466.2, dur: 1.3, gain: 0.5 });
      for (let i = 0; i < NP; i++) ev.push({ t: T_TRC0 + i * D_TRC, kind: 'tick', freq: 1800, gain: 0.22 });
      [392, 493.9, 587.3].forEach((f, k) => ev.push({ t: T_GEN0 + 1.6 + 0.25 * k, kind: 'tone', freq: f, dur: 0.6, gain: 0.35 }));
      for (let i = NP - 1; i >= 0; i--) ev.push({ t: T_TAU0 + ((NP - 1 - i) / NP) * (T_TAU1 - T_TAU0) + 0.05, kind: 'tick', freq: 2200, gain: 0.4 });
      [261.6, 329.6, 392].forEach((f, k) => ev.push({ t: T_TAU1 + 0.05 * k, kind: 'tone', freq: f, dur: 2.2, gain: 0.45 }));
      return ev;
    },

    meta(ctx) {
      return [
        { label: 'Comb passes', value: NP },
        { label: 'Noise drops sprinkled (unrecorded)', value: NP * 4 },
        { label: 'Prompts · noises', value: '3 · 1' },
        { label: 'Noise draw', value: ctx.state.noise },
        { label: 'Way back (Acts 1–3)', value: 'sketch: drawn, not a trained model' },
      ];
    },
  });

  /* ── Act 1 progress of every hero op ── */
  function combHero(t, i) {                                 // forward pass i during [T_FWD0 + i·D], back during the reverse (last pass first)
    const f = U0.seg(t, T_FWD0 + i * D_FWD, T_FWD0 + (i + 1) * D_FWD, 'inOut');
    const ri = NP - 1 - i, b = U0.seg(t, T_REV0 + ri * D_REV, T_REV0 + (ri + 1) * D_REV, 'inOut');
    return f * (1 - b);
  }
  function heroComb(t) { for (let i = 0; i < NP; i++) { const s = combHero(t, i); if (s > 0.001 && s < 0.999) return { i, s }; } return null; }
  function heroS(t, Sx) {
    const n = Sx.heroOps.length, S = new Float32Array(n), no = Sx.orig.length, rho = U0.seg(t, T_REV0, T_BACK, 'linear');
    let oi = 0, gi = 0;
    for (let i = 0; i < n; i++) {
      const k = Sx.heroKind[i];
      if (k === 'o') { const a = T_MOT0 + (oi / no) * (T_MOT1 - T_MOT0 - 0.4); S[i] = U0.seg(t, a, a + 0.45, 'enter') * (1 - U0.seg(t, T_REV0, T_REV0 + 1.4)); oi++; }
      else if (k === 'g') { const [a, b] = Sx.gSched[gi++]; S[i] = U0.ease.inOut(U0.clamp((rho - a) / (b - a))); }
      else if (k[0] === 'c') S[i] = combHero(t, +k.slice(1));
      else {                                                // a sprinkle: falls at the end of its pass, removed (guessed) as that pass comes off
        const j = +k.slice(1), ri = NP - 1 - j;
        S[i] = U0.seg(t, T_FWD0 + (j + 0.55) * D_FWD, T_FWD0 + (j + 0.95) * D_FWD) * (1 - U0.seg(t, T_REV0 + ri * D_REV, T_REV0 + (ri + 0.5) * D_REV));
      }
    }
    return S;
  }
  const ghostS = tau => U0.ease.inOut(U0.seg(1 - tau, 0.08, 0.4)) * (1 - U0.ease.inOut(U0.seg(1 - tau, 0.5, 0.88)));

  const scaleR = (r, s) => ({ x: r.x + r.w * (1 - s) / 2, y: r.y + r.h * (1 - s) / 2, w: r.w * s, h: r.h * s });
  function shadow(F, r, kb, off) {
    const x0 = (r.x + off * 0.5) * kb, y0 = (r.y + off) * kb, w = r.w * kb, h = r.h * kb, s = 3 * kb, D = F.data;
    const i0 = Math.max(0, Math.floor(x0 - s)), i1 = Math.min(F.W, Math.ceil(x0 + w + s)), j0 = Math.max(0, Math.floor(y0 - s)), j1 = Math.min(F.H, Math.ceil(y0 + h + s));
    for (let j = j0; j < j1; j++) for (let i = i0; i < i1; i++) {
      const dx = Math.max(x0 - i, 0, i - (x0 + w)), dy = Math.max(y0 - j, 0, j - (y0 + h)), dd = Math.hypot(dx, dy) / s;
      if (dd >= 1) continue;
      const m = 1 - 0.16 * (1 - dd) * (1 - dd), k = (j * F.W + i) * 4; D[k] *= m; D[k + 1] *= m; D[k + 2] *= m;
    }
  }
  const toScr = (rect, dom, x, y) => [rect.x + (x / dom.W) * rect.w, rect.y + (y / dom.H) * rect.h];
  function pins(p, o, s, rect, dom, a, col = '#2F4A66') {
    const U = U0, sc = rect.w / 150, fr = MK.frontAt(o, s) - 0.5 * o.sw;
    const sp = o.k === MK.WAVE ? Math.PI / o.w : o.sp, q0 = o.k === MK.WAVE ? (Math.PI / 2 - o.ph) / o.w : o.q0;
    const ends = [];
    for (const [x, y] of [[0, null], [dom.W, null], [null, 0], [null, dom.H]]) {
      let px, py;
      if (x !== null) { if (Math.abs(o.nx) < 1e-6) continue; const q = (x - fr * o.mx) / o.nx; px = x; py = fr * o.my + q * o.ny; }
      else { if (Math.abs(o.ny) < 1e-6) continue; const q = (y - fr * o.my) / o.ny; py = y; px = fr * o.mx + q * o.nx; }
      if (px >= -1e-6 && px <= dom.W + 1e-6 && py >= -1e-6 && py <= dom.H + 1e-6) ends.push(toScr(rect, dom, px, py));
    }
    if (ends.length >= 2) { p.stroke(U.rgba(col === '#2F4A66' ? COL.zinc : col, 0.4 * a)); p.strokeWeight(Math.max(1.6, 3 * Math.min(sc, 2))); p.line(ends[0][0], ends[0][1], ends[1][0], ends[1][1]); }
    const qs = [[0, 0], [dom.W, 0], [0, dom.H], [dom.W, dom.H]].map(([x, y]) => x * o.nx + y * o.ny);
    const qlo = Math.min(...qs), qhi = Math.max(...qs), rad = Math.max(1.3, 2.2 * Math.sqrt(Math.min(sc, 2.5)));
    p.noStroke();
    for (let n = Math.ceil((qlo - q0) / sp); q0 + n * sp <= qhi; n++) {
      const q = q0 + n * sp, x = fr * o.mx + q * o.nx, y = fr * o.my + q * o.ny;
      if (x < 0 || x > dom.W || y < 0 || y > dom.H) continue;
      const [sx, sy] = toScr(rect, dom, x, y);
      p.fill(U.rgba(col, a)); p.circle(sx, sy, rad * 2 * (col === '#2F4A66' ? 1 : 1.25));
    }
  }

  /** an endpaper label set on the tray (the material's own place for words) */
  function label(p, x, y, w, h, a) {
    p.noStroke(); p.fill(U0.rgba('#1E2124', 0.10 * a)); p.rect(x + 3, y + 4, w, h, 3);
    p.fill(U0.rgba(COL.label, 0.96 * a)); p.rect(x, y, w, h, 3);
    p.noFill(); p.stroke(U0.rgba(COL.zinc, 0.8 * a)); p.strokeWeight(2); p.rect(x + 6, y + 6, w - 12, h - 12, 2); p.noStroke();
  }

  function words(p, ctx, t, Sx) {
    const Tk = ctx.tokens, U = U0, X = 676, LW = 260;
    p.noStroke();
    // title label
    const ti = U.seg(t, 0.2, 0.7) * (1 - U.seg(t, T_FWD0 - 0.6, T_FWD0 - 0.2));
    if (ti > 0) {
      label(p, X - 34, 160, LW + 40, 150, ti);
      p.fill(U.rgba(Tk.ink, ti)); p.textFont('IM Fell English'); p.textSize(44); p.textAlign(p.CENTER, p.BASELINE); p.text('Un-combing', X + LW / 2 - 14, 236);
      p.fill(U.rgba(Tk.dim, ti)); p.textFont('Alegreya Sans'); p.textSize(19); p.text('how image generators work', X + LW / 2 - 14, 272);
    }
    // Act 1 ledger label: combing → / back ← ; each pass is a cell; sprinkles marked
    const lg = U.seg(t, T_FWD0 - 0.2, T_FWD0 + 0.2) * (1 - U.seg(t, T_TR0 - 0.2, T_TR0 + 0.2));
    if (lg > 0) {
      const back = t >= T_REV0;
      label(p, X - 20, 140, LW + 10, back ? 250 : 112, lg);
      let done = 0; for (let i = 0; i < NP; i++) if (combHero(t, i) > 0.5) done++;
      p.fill(U.rgba(Tk.ink, lg)); p.textFont('IM Fell English'); p.textSize(27); p.textAlign(p.LEFT, p.BASELINE);
      p.text(back ? 'back  ←' : 'combing  →', X, 180);
      for (let i = 0; i < NP; i++) {
        const s = combHero(t, i), x = X + i * 23;
        p.fill(U.rgba(U.mix(COL.zinc, COL.label, 0.75), lg)); p.rect(x, 194, 19, 11, 2);
        if (s > 0) { p.fill(U.rgba(COL.zinc, lg)); p.rect(x, 194, 19 * s, 11, 2); }
        if (s > 0.6 || (back && combHero(t, i) > 0)) { p.fill(U.rgba(Tk.ink, lg)); for (let m = 0; m < 3; m++) p.circle(x + 4 + m * 5.5, 215, 3.2); }   // the sprinkle
      }
      p.fill(U.rgba(Tk.dim, lg)); p.textFont('Alegreya Sans'); p.textSize(15);
      p.text('+ a sprinkle of noise each pass', X, 238);
      if (back) {
        const a1 = U.seg(t, T_REV0, T_REV0 + 0.5) * lg, a2 = U.seg(t, T_BACK - 0.5, T_BACK) * lg;
        p.fill(U.rgba(Tk.ink, a1)); p.textFont('IM Fell English'); p.textSize(21);
        p.text('The way back is a guess.', X, 280);
        p.fill(U.rgba(Tk.dim, a1)); p.textFont('Alegreya Sans'); p.textSize(15.5);
        p.text('The noise left no record to undo.', X, 304);
        if (a2 > 0) {
          p.stroke(U.rgba(Tk.ink, a2)); p.strokeWeight(2); p.drawingContext.setLineDash([5, 4]); p.line(X, 340, X + 34, 340); p.drawingContext.setLineDash([]); p.noStroke();
          p.fill(U.rgba(Tk.ink, a2)); p.textSize(16); p.text('the tulip you made', X + 44, 345);
          p.text('a tulip, not yours', X + 44, 370); p.fill(U.rgba(Tk.copper, a2)); p.rect(X, 362, 34, 9, 2);
        }
      }
    }
    // the original's outline, dashed over the guess
    const ol = U.seg(t, T_BACK - 0.5, T_BACK) * (1 - U.seg(t, T_TR0, T_TR0 + 0.4));
    if (ol > 0) {
      p.stroke(U.rgba('#1E2124', 0.9 * ol)); p.strokeWeight(2.6); p.noFill();
      const s = 960 / DOMH.W;
      for (const [a, b] of Sx.outline) { const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2; if (Math.floor(mx * 60) % 3 === 0 || Math.floor(my * 60) % 3 === 0) continue; p.line(a[0] * s, a[1] * s, b[0] * s, b[1] * s); }
      p.noStroke();
    }
    // Act 2 — training (sketch)
    const tr = U.seg(t, T_TR0 + 0.5, T_TR0 + 0.9) * (1 - U.seg(t, T_TR1, T_TR1 + 0.4));
    if (tr > 0) {
      p.fill(U.rgba(Tk.ink, tr)); p.textFont('IM Fell English'); p.textSize(30); p.textAlign(p.CENTER, p.BASELINE);
      p.text('Training', 480, 352);
      p.fill(U.rgba(Tk.dim, tr)); p.textFont('Alegreya Sans'); p.textSize(19);
      p.text('Millions of pictures are turned into noise. The generator learns to guess one step back.', 480, 386);
      p.textSize(15); p.text('sketch — three pictures stand in for millions', 480, 414);
      for (let k = 0; k < 3; k++) { const r = SMALL(k); p.fill(U.rgba(Tk.dim, tr)); p.textFont('DM Mono'); p.textSize(14); p.textAlign(p.CENTER, p.TOP); p.text('picture → noise', r.x + r.w / 2, r.y + r.h + 10); }
    }
    // Act 3 — one noise, three prompts
    const g0 = U.seg(t, T_GEN0 + 0.6, T_GEN0 + 1.1);
    if (g0 > 0) {
      const tau = 1 - U.seg(t, T_TAU0, T_TAU1, 'linear'), fin = U.seg(t, T_TAU1 - 0.2, T_TAU1 + 0.4);
      p.textAlign(p.CENTER, p.BASELINE); p.textFont('IM Fell English'); p.textSize(28);
      p.fill(U.rgba(Tk.ink, g0 * (1 - fin))); p.text('One noise, three prompts', 480, 60);
      p.fill(U.rgba(Tk.ink, fin)); p.text('One noise, three prompts, three pictures', 480, 60);
      const br = g0 * (1 - U.seg(t, T_TAU0 + 1.5, T_TAU0 + 2.2));
      if (br > 0) {
        const a = GEN(0), b = GEN(2), y = a.y - 12;
        p.stroke(U.rgba(COL.zinc, br)); p.strokeWeight(2); p.noFill();
        p.line(a.x, y + 6, a.x, y); p.line(a.x, y, b.x + b.w, y); p.line(b.x + b.w, y, b.x + b.w, y + 6); p.noStroke();
        p.fill(U.rgba('#E9E7DE', br)); p.rect(480 - 110, y - 10, 220, 20, 3);
        p.fill(U.rgba(Tk.dim, br)); p.textFont('Alegreya Sans'); p.textSize(15); p.textAlign(p.CENTER, p.CENTER); p.text('the same noise in all three', 480, y);
      }
      const pr = U.seg(t, T_GEN0 + 1.5, T_GEN0 + 2.1);
      for (let k = 0; k < 3; k++) {
        const r = GEN(k), a = U.seg(t, T_GEN0 + 1.5 + 0.25 * k, T_GEN0 + 2.0 + 0.25 * k);
        if (a <= 0) continue;
        p.fill(U.rgba(Tk.ink, a)); p.textFont('IM Fell English'); p.textStyle(p.ITALIC); p.textSize(26); p.textAlign(p.CENTER, p.BASELINE);
        p.text('“' + PROMPT[k] + '”', r.x + r.w / 2, r.y + r.h + 36); p.textStyle(p.NORMAL);
      }
      if (pr > 0) {
        const left = Math.ceil(tau * NP - 1e-6);
        p.fill(U.rgba(Tk.dim, pr)); p.textFont('DM Mono'); p.textSize(14); p.textAlign(p.LEFT, p.BASELINE);
        p.text('steps back left: ' + String(left).padStart(2, '0') + ' / 10', 80, 496);
        p.textFont('Alegreya Sans'); p.textSize(14); p.textAlign(p.RIGHT, p.BASELINE);
        p.text('sketch: a real generator learns these steps; here they are drawn as drops and un-combing', 880, 496);
      }
    }
  }
})();
