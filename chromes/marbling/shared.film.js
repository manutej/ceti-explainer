/* B · MARBLING · shared — "What an AI agent actually does" (glance, 34.5 s) · revision 1.
   ONE tray, 50 lanes. Mark rule: each lane is one agent run; the comb's needle in that lane is the agent; each ruled
   column is one step. The needle draws a nonpareil through the battal as it goes. A stray peach drop = a slip: it
   lands in the column of its step, the needle runs through it and carries its ink along the rest of the lane — the
   head of the stray is the ADDRESS, the thread behind the needle is the PROPAGATION. Cut into strips and stacked by
   where the stray fell, the threads' heads draw the survival curve (with the expected curve laid on it).
   Twin world = the same tray replayed with the same strays and a check at every step: each needle pauses to be
   inspected, a sage paper strip lifts a caught stray (drop map run backwards: exact), and the needle backs up and
   redoes the step — so checked needles lag a no-check pace marker, and the time each run spent checking is laid out
   beside its lane. Re-stacked, the saved lanes carry sage rings at their old addresses: the old curve, inside the new.
   Numbers: Atelier.AgentLoop (N = 50, k = 20); counts are read from the lanes. Kit: MK (maps) + MP (recipes). */
(function () {
  const N = 50, K = 20, W = 660, LH = 8.6, H = N * LH, CW = W / K;
  const TX = 96, TY = 64, STONE_SEED = 7, R_STRAY = 4.6;
  const DOMV = { W, H };
  // timeline (s)
  const T_ST0 = 0.3, T_ST1 = 2.3, T_GEL1 = 3.7, T_Z0 = 3.7, T_Z1 = 4.9, T_ZO0 = 9.4, T_ZO1 = 11.2, HOLD = 11.4, JUMP = 14.4;
  const T_SORT0 = 21.4, T_SORT1 = 23.2, T_REW0 = 24.2, T_REW1 = 25.0, T_REP0 = 25.0, T_REP1 = 30.0, T_RS0 = 30.2, T_RS1 = 31.7, DUR = 34.5;
  const stepT = j => (j <= 5 ? { t0: 4.9 + (j - 1) * 0.9, d: 0.9 } : { t0: JUMP + (j - 6) * 0.45, d: 0.45 });
  const INSPECT = 0.25, LIFT = 0.35, BACK = 0.3;          // sketch costs, in steps
  const EX = Atelier.AgentLoop.exact(K, 0.95, 0.8, 1);
  const COL = { ground: '#D2D4CA', zinc: '#3E5A78', zincHi: '#7F97B0', pin: '#2F4A66', peach: '#CC5B34', sageDeep: '#2C5233', paper: '#E4ECDF' };
  const U0 = Atelier.U;
  const ZM = 4.2;

  /* ── model: lanes, strays, replay timelines; pure in (seed, engine) ── */
  const _memo = new Map();
  function model(ctx) {
    const A = ctx.engine, key = ctx.seed + '|' + A.N;
    if (_memo.has(key)) return _memo.get(key);
    const L = [];
    for (let r = 0; r < N; r++) {
      const fOff = A.failStep.off[r], fOn = A.failStep.on[r];
      // replay (checks on): travel 1 · inspect ¼ · on a catch: lift, back up, redo the step
      const seg = [], drops = [];
      let tau = 0;
      const ev = new Map(); for (const e of A.events(r, 'on')) ev.set(e.step + 1, e);
      let lifts = 0, redo = 0;
      for (let j = 1; j <= K; j++) {
        const e = ev.get(j);
        seg.push({ t0: tau, t1: tau + 1, u0: j - 1, u1: j });
        if (e) drops.push({ j, land: tau, lift: e.caught ? tau + 1 + INSPECT : null, stay: !e.caught, c: 0 });
        tau += 1;
        seg.push({ t0: tau, t1: tau + INSPECT, u0: j, u1: j }); tau += INSPECT;
        if (e && e.caught) {
          seg.push({ t0: tau, t1: tau + LIFT, u0: j, u1: j }); tau += LIFT; lifts++;
          seg.push({ t0: tau, t1: tau + BACK, u0: j, u1: j - 1 }); tau += BACK;
          seg.push({ t0: tau, t1: tau + 1, u0: j - 1, u1: j, redo: true });
          if (!e.retryOk) drops.push({ j, land: tau, lift: null, stay: true, c: 1 });
          tau += 1; redo++;
        }
      }
      L.push({ r, fOff: fOff >= 0 ? fOff + 1 : 0, fOn: fOn >= 0 ? fOn + 1 : 0, seg, drops, T: tau, lifts, redo,
        x0: c => (c ? 0.72 : 0.5), saved: fOff >= 0 && fOn < 0 });
    }
    const Tmax = Math.max(...L.map(l => l.T));
    // stacks: B by where the (no-check) stray fell; C: failed-with-checks, then saved (by old address), then clean
    const byB = L.slice().sort((a, b) => (a.fOff === 0) - (b.fOff === 0) || a.fOff - b.fOff || a.r - b.r);
    byB.forEach((l, i) => (l.sB = i));
    const grp = l => (l.fOn ? 0 : l.saved ? 1 : 2);
    const byC = L.slice().sort((a, b) => grp(a) - grp(b) || (grp(a) === 0 ? a.fOn - b.fOn : grp(a) === 1 ? a.fOff - b.fOff : a.r - b.r) || a.r - b.r);
    byC.forEach((l, i) => (l.sC = i));
    let star = -1;                                          // the opening lane: first saved run whose stray falls at step 2
    for (const l of L) if (star < 0 && l.fOff === 2 && l.saved) star = l.r;
    for (const l of L) if (star < 0 && l.fOff >= 1 && l.fOff <= 4 && l.saved) star = l.r;
    if (star < 0) star = 0;
    const M = { L, Tmax, RU: (T_REP1 - T_REP0) / Tmax, star,
      clean: { off: L.filter(l => !l.fOff).length, on: L.filter(l => !l.fOn).length },
      lifts: L.reduce((n, l) => n + l.lifts, 0), extra: L.reduce((n, l) => n + l.T - K, 0) / N };
    _memo.set(key, M);
    return M;
  }

  /* ── where things are at time t ── */
  function needleOff(t) {                                   // the no-check comb (all lanes together), in columns
    if (t < stepT(1).t0) return 0;
    if (t >= T_REW0) return K * (1 - U0.ease.inOut(U0.seg(t, T_REW0, T_REW1)));
    for (let j = 1; j <= K; j++) { const { t0, d } = stepT(j); if (t < t0) return j - 1; if (t < t0 + d) return j - 1 + U0.ease.inOut((t - t0) / d); }
    return K;
  }
  function needleOn(l, tau) {                               // a checked needle, in columns, at replay time tau (steps)
    for (const s of l.seg) if (tau < s.t1) return tau <= s.t0 ? s.u0 : s.u0 + (s.u1 - s.u0) * U0.ease.inOut((tau - s.t0) / (s.t1 - s.t0));
    return K;
  }
  const tauAt = (M, t) => (t - T_REP0) / M.RU;
  function slotY(l, t) {                                    // lane row (0 = top), sliding between stacks
    const dB = 0.9 * l.sB / N, dC = 0.9 * l.sC / N;
    const uB = U0.seg(t, T_SORT0 + dB, T_SORT0 + dB + 0.9, 'inOut'), uC = U0.seg(t, T_RS0 + dC, T_RS0 + dC + 0.6, 'inOut');
    return l.r + (l.sB - l.r) * uB + (l.sC - l.sB) * uC;
  }
  function camera(t, M) {                                   // tray px → screen px
    const zi = U0.ease.inOut(U0.seg(t, T_Z0, T_Z1)), zo = U0.ease.inOut(U0.seg(t, T_ZO0, T_ZO1)), e = zi * (1 - zo);
    const z = Math.pow(ZM, e), cx = 3.2 * CW, cy = (M.star + 0.5) * LH;
    // blend the anchor: at e=0 identity (tray at TX,TY); at e=1 (cx,cy) sits at screen (480,290)
    const ax = TX + cx + (480 - TX - cx) * e, ay = TY + cy + (290 - TY - cy) * e;
    return { z, e, X: x => ax + z * (x - cx), Y: y => ay + z * (y - cy) };
  }

  Atelier.film({
    id: 'marbling-shared',
    title: 'Marbling — what an AI agent actually does',
    direction: 'B · Marbling · invertible comb maps',
    level: 'glance',
    duration: DUR,
    size: [960, 540],
    renderer: 'p2d',
    fps: 30,
    seed: 1,
    ground: COL.ground,
    chapters: [{ t: 0, label: 'The tray' }, { t: T_Z1, label: 'One lane, one run' }, { t: HOLD, label: 'Your guess' },
      { t: JUMP, label: '50 runs, 20 steps' }, { t: T_SORT0, label: 'Stacked by where it fell' }, { t: T_REW0, label: 'Again, with checks' },
      { t: T_RS0, label: 'Both in one stack' }],
    captions: [
      { t0: 0.2, t1: T_Z0, text: 'An AI agent works in a loop: plan, act with a tool, look at the result, check, repeat.' },
      { t0: T_Z1, t1: 7.0, text: 'Each lane of this tray is one run. The needle is the agent: one column per step.' },
      { t0: 7.0, t1: T_ZO0, text: 'A stray drop is a slip. The needle runs through it and drags it into every later step.' },
      { t0: T_ZO0, t1: HOLD, text: 'Fifty runs, the same twenty steps, each step right 95 % of the time.' },
      { t0: HOLD, t1: JUMP, text: 'Your call: how many of the 50 lanes reach step 20 with no stray?' },
      { t0: JUMP, t1: T_SORT0, text: 'Where a stray fell is the step that failed; its thread is everything that came after.' },
      { t0: T_SORT0, t1: T_REW0, text: 'Stack the lanes by where the stray fell: their heads trace how fast clean runs run out.' },
      { t0: T_REW0, t1: T_REP0 + 2.4, text: 'Same tray, same strays, now with a check: the needle waits, a paper strip lifts the stray.' },
      { t0: T_REP0 + 2.4, t1: T_RS0, text: 'Every check costs time, and every catch means doing the step again.' },
      { t0: T_RS0, t1: DUR, text: 'Restacked: sage rings mark the runs the checks saved, at the step where each was caught.' },
    ],
    state: { guess: 34 },
    controls: [{ key: 'guess', type: 'commit', label: 'Lanes of 50 with no stray, no checks', min: 0, max: 50, step: 1, jump: JUMP, countdown: 3,
      hint: '20 steps, each right 95 % of the time. Commit before the needles go on.', format: v => Math.round(v) + ' of 50' }],
    engine: ctx => Atelier.AgentLoop({ N, k: K, p: 0.95, c: 0.8, retry: 1, seed: ctx.seed }),

    setup(p, ctx) {
      const pal = MP.palette(); pal[MP.PIG.peach] = MK.ink(COL.peach, '#8A3216', 0.10, 0.28);
      const G = MP.laneGround(STONE_SEED, W, H);
      ctx.M = model(ctx); ctx.pal = pal; ctx.G = G; ctx.gOps = G.stones.concat(G.gel);
      ctx.tex = MK.bake(ctx.gOps, pal, { x0: -40, y0: -70, w: W + 80, h: H + 140 }, 1.5, 1);
      ctx.comb = MK.comb(0, 12, LH, 2.2, LH / 2, { dom: DOMV });
      ctx.gS = new Float32Array(ctx.gOps.length);
      ctx.buf = null;
    },

    draw(p, t, ctx) {
      const { M } = ctx, Tk = ctx.tokens;
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
      const cam = camera(t, M), z = cam.z, replay = t >= T_REW1, tau = tauAt(M, t);
      const uOff = needleOff(t);

      /* tray shadow + pigment */
      const tx0 = cam.X(0), ty0 = cam.Y(0), tw = W * z, th = H * z;
      shadow(F, { x: tx0, y: ty0, w: tw, h: th }, kb, 3);
      if (t < T_GEL1) {                                     // the battal is laid and gel-git combed: pull through every op
        const S = ctx.gS, ns = ctx.G.stones.length;
        for (let i = 0; i < ns; i++) { const a = T_ST0 + (i / ns) * (T_ST1 - T_ST0 - 0.3); S[i] = U0.seg(t, a, a + 0.3, 'enter'); }
        for (let g = 0; g < 4; g++) S[ns + g] = U0.seg(t, T_ST1 + g * 0.35, T_ST1 + (g + 1) * 0.35, 'inOut');
        MK.paint(F, { x: tx0 * kb, y: ty0 * kb, w: tw * kb, h: th * kb }, { x0: 0, y0: 0, w: W, h: H }, ctx.gOps, S, ctx.pal, { ss: 1 });
      } else {
        const analytic = z > 1.6;
        for (const l of M.L) {
          const row = slotY(l, t), sy = cam.Y(row * LH);
          if (sy > 540 || sy + LH * z < 0) continue;
          const st = laneState(l, t, tau, uOff, replay);
          const ops = [], S = [];
          for (const d of st.drops) { ops.push(d.op); S.push(d.s); }
          const u = st.u;
          if (u > 0) { ctx.comb.fx = u * CW + 0.5 * ctx.comb.sw; ops.push(ctx.comb); S.push(1); }
          const view = { x0: 0, y0: l.r * LH, w: W, h: LH }, rect = { x: tx0 * kb, y: sy * kb, w: tw * kb, h: LH * z * kb };
          if (analytic) MK.paint(F, rect, view, ctx.gOps.concat(ops), Float32Array.from(Array(ctx.gOps.length).fill(1).concat(S)), ctx.pal, { ss: 1, n: ctx.gOps.length + ops.length });
          else MK.paint(F, rect, view, ops, Float32Array.from(S), ctx.pal, { ss: 2, tex: ctx.tex });
        }
      }
      const vl = 0.58 * U0.seg(t, T_SORT0, T_SORT1);
      if (vl > 0) veil(F, { x: tx0 * kb, y: ty0 * kb, w: tw * kb, h: th * kb }, vl, ctx.M, t, cam, kb);
      F.flush();
      const c = p.drawingContext; c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high';
      c.drawImage(F.canvas, 0, 0, c.canvas.width, c.canvas.height); c.restore();

      overlays(p, ctx, t, cam, uOff, tau, replay);
      words(p, ctx, t, cam);
    },

    score(ctx) {
      const M = model(ctx), ev = [];
      ev.push({ t: 0.25, kind: 'tone', freq: 293.7, dur: 2.2, gain: 0.5 });
      for (let i = 0; i < 24; i++) ev.push({ t: T_ST0 + i * 0.08, kind: 'tick', freq: 5200 - i * 60, gain: 0.2 });
      for (let g = 0; g < 4; g++) ev.push({ t: T_ST1 + g * 0.35, kind: 'tick', freq: 1300, gain: 0.35 });
      for (let j = 1; j <= K; j++) {
        const { t0 } = stepT(j);
        ev.push({ t: t0, kind: 'tick', freq: 1500, gain: j <= 5 ? 0.5 : 0.35 });
        const n = M.L.filter(l => l.fOff === j && (j > 5 || l.r === M.star)).length;
        if (n) ev.push({ t: t0 + 0.03, kind: 'clack', freq: 170, gain: Math.min(1.3, 0.45 + 0.2 * n), pan: -0.3 });
      }
      for (let i = 0; i < 3; i++) ev.push({ t: HOLD + i, kind: 'tick', freq: 900, gain: 0.6 });
      for (let i = 0; i < 10; i++) ev.push({ t: T_SORT0 + 0.15 * i, kind: 'tick', freq: 2600, gain: 0.18 });
      ev.push({ t: T_SORT1, kind: 'tone', freq: 392, dur: 1.1, gain: 0.5 });
      for (const l of M.L) for (const d of l.drops) {
        if (d.lift !== null) ev.push({ t: T_REP0 + d.lift * M.RU, kind: 'click', freq: 1760, gain: 0.35, pan: 0.3 });
        else ev.push({ t: T_REP0 + d.land * M.RU, kind: 'clack', freq: 170, gain: 0.5, pan: -0.3 });
      }
      for (let j = 1; j <= K; j++) ev.push({ t: T_REP0 + j * M.RU, kind: 'tick', freq: 1500, gain: 0.25 });
      ev.push({ t: T_RS1, kind: 'tone', freq: 392, dur: 1.6, gain: 0.55 });
      ev.push({ t: T_RS1 + 0.12, kind: 'tone', freq: 587.3, dur: 1.4, gain: 0.35 });
      return ev;
    },

    meta(ctx) {
      const M = model(ctx), A = ctx.engine;
      return [
        { label: 'Clean lanes · no checks (read from the lanes)', value: M.clean.off, check: { world: 'off', k: K, p: 0.95, c: 0.8, N } },
        { label: 'Clean lanes · checks (read from the lanes)', value: M.clean.on, check: { world: 'on', k: K, p: 0.95, c: 0.8, N } },
        { label: 'Engine survivors · off / on', value: A.survivors.off[K] + ' / ' + A.survivors.on[K] },
        { label: 'P(clean) · no checks, expected', value: EX.off[K], check: { world: 'off', k: K, p: 0.95, c: 0.8 } },
        { label: 'P(clean) · checks, expected', value: EX.on[K], check: { world: 'on', k: K, p: 0.95, c: 0.8 } },
        { label: 'Runs saved by the checks', value: A.saved.length },
        { label: 'Strays lifted · steps redone', value: M.lifts },
        { label: 'Extra time per run, steps (sketch: inspect ¼, lift + back-up + redo ≈ 1.65)', value: +M.extra.toFixed(2) },
      ];
    },
  });

  /* lane state: needle position (columns) and stray drops with progress */
  function laneState(l, t, tau, uOff, replay) {
    const drops = [];
    if (!replay) {
      if (l.fOff) {
        const { t0, d } = stepT(l.fOff);
        let s = U0.seg(t, t0, t0 + 0.3 * d);
        if (t >= T_REW0) s *= 1 - U0.seg(t, T_REW0 + 0.35, T_REW1);
        if (s > 0) drops.push({ op: dropOp(l, l.fOff, 0), s, j: l.fOff, c: 0 });
      }
      return { u: uOff, drops };
    }
    const u = needleOn(l, Math.max(0, tau));
    for (const d of l.drops) {
      let s = Math.max(0, Math.min(1, (tau - d.land) / 0.3));
      if (d.lift !== null) s *= 1 - U0.ease.inOut(U0.clamp((tau - d.lift - 0.1) / (LIFT * 0.6)));
      if (s > 0) drops.push({ op: dropOp(l, d.j, d.c), s, j: d.j, c: d.c });
    }
    return { u, drops };
  }
  const _drops = new Map();
  function dropOp(l, j, c) {
    const key = l.r * 64 + j * 2 + c;
    if (!_drops.has(key)) _drops.set(key, MK.drop((j - 1 + (c ? 0.72 : 0.5)) * CW, (l.r + 0.5) * LH, R_STRAY, MP.PIG.peach));
    return _drops.get(key);
  }

  /** a pale wash over the stacked sheet (the stray pigment is kept at full strength so heads stay legible) */
  function veil(F, r, v, M, t, cam, kb) {
    const D = F.data, g = MK.hex('#E9E7DE'), pe = MK.hex(COL.peach);
    const i0 = Math.max(0, Math.floor(r.x)), i1 = Math.min(F.W, Math.ceil(r.x + r.w)), j0 = Math.max(0, Math.floor(r.y)), j1 = Math.min(F.H, Math.ceil(r.y + r.h));
    for (let j = j0; j < j1; j++) for (let i = i0; i < i1; i++) {
      const k = (j * F.W + i) * 4, R = D[k], G = D[k + 1], B = D[k + 2];
      const isPe = R > 150 && R - G > 60 && R - B > 90;      // stray pigment
      if (isPe) continue;
      D[k] = R + (g[0] - R) * v; D[k + 1] = G + (g[1] - G) * v; D[k + 2] = B + (g[2] - B) * v;
    }
  }
  function shadow(F, r, kb, off) {
    const x0 = (r.x + off * 0.5) * kb, y0 = (r.y + off) * kb, w = r.w * kb, h = r.h * kb, s = 4 * kb, D = F.data;
    const i0 = Math.max(0, Math.floor(x0 - s)), i1 = Math.min(F.W, Math.ceil(x0 + w + s)), j0 = Math.max(0, Math.floor(y0 - s)), j1 = Math.min(F.H, Math.ceil(y0 + h + s));
    for (let j = j0; j < j1; j++) for (let i = i0; i < i1; i++) {
      const dx = Math.max(x0 - i, 0, i - (x0 + w)), dy = Math.max(y0 - j, 0, j - (y0 + h)), dd = Math.hypot(dx, dy) / s;
      if (dd >= 1 || (dx === 0 && dy === 0)) continue;
      const m = 1 - 0.18 * (1 - dd) * (1 - dd), k = (j * F.W + i) * 4; D[k] *= m; D[k + 1] *= m; D[k + 2] *= m;
    }
  }

  function overlays(p, ctx, t, cam, uOff, tau, replay) {
    const { M } = ctx, Tk = ctx.tokens, U = U0, z = cam.z, X = cam.X, Y = cam.Y;
    if (t < T_GEL1) return;
    const sw = Math.max(1.6, 2.5 * Math.sqrt(z));
    // stray threads (ink carried on the needle) and landing rings, skimmer strips, sage rings
    for (const l of M.L) {
      const row = slotY(l, t), yc = Y((row + 0.5) * LH);
      if (yc < -10 || yc > 550) continue;
      const st = laneState(l, t, tau, uOff, replay), xn = st.u * CW;
      for (const d of st.drops) {
        const x0 = (d.j - 1 + (d.c ? 0.72 : 0.5)) * CW;
        if (xn > x0 + 0.5) { p.stroke(U.rgba(COL.peach, d.s)); p.strokeWeight(sw); p.strokeCap(p.ROUND); p.line(X(x0), yc, X(Math.min(xn, W - 1)), yc); }
      }
      if (!replay && l.fOff) {                              // landing ring
        const { t0, d } = stepT(l.fOff), a = U.seg(t, t0, t0 + 0.35 * d);
        if (a > 0 && a < 1) { p.noFill(); p.stroke(U.rgba(COL.peach, 0.9 * (1 - a))); p.strokeWeight(Math.max(1, 0.5 * Math.sqrt(z))); p.circle(X((l.fOff - 0.5) * CW), yc, z * R_STRAY * (2 + 3 * a)); }
      }
      if (replay) for (const d of l.drops) if (d.lift !== null) {
        const L = U.clamp((tau - d.lift) / LIFT), x0 = X((d.j - 0.5) * CW);
        if (L > 0 && L < 1) {                               // a sage paper strip laid on the stray and peeled away with it
          const down = U.ease.enter(U.clamp(L / 0.35)), up = U.ease.exit(U.clamp((L - 0.6) / 0.4)), al = down * (1 - up);
          const w2 = 0.9 * CW * z, h2 = 1.7 * LH * z, lift = -up * 2.2 * LH * z;
          p.push(); p.translate(x0, yc + lift); p.rotate(-0.12 - 0.25 * up);
          p.noStroke(); p.fill(U.rgba('#1E2124', 0.12 * al)); p.rect(-w2 / 2 + 2, -h2 / 2 + 3, w2, h2, 1.5);
          p.fill(U.rgba(COL.paper, 0.95 * al)); p.rect(-w2 / 2, -h2 / 2, w2, h2, 1.5);
          p.fill(U.rgba(Tk.sage, 0.9 * al)); p.rect(-w2 / 2, -h2 / 2, w2, Math.max(1.5, 0.18 * h2), 1.5);
          if (up > 0) { p.fill(U.rgba(COL.peach, al)); p.circle(0, 0, z * R_STRAY * 1.5); }
          p.pop();
        }
        if (L >= 1) { p.noFill(); p.stroke(Tk.sage); p.strokeWeight(Math.max(1.6, 0.7 * Math.sqrt(z))); p.circle(x0, yc, z * R_STRAY * 2.1); }
      }
    }
    // needles: the no-check comb (one back, 50 pins) / the checked needles (each on its own)
    if (!replay && uOff > 0 && uOff < K) {
      const xs = X(uOff * CW);
      p.noStroke(); p.fill(U.rgba(COL.zinc, 0.28)); p.rect(xs - 2.5 * Math.sqrt(z), Y(0) - 6, 5 * Math.sqrt(z), H * z + 12, 2);
      p.fill(COL.pin);
      for (const l of M.L) { const yc = Y((slotY(l, t) + 0.5) * LH); if (yc > -5 && yc < 545) p.circle(xs, yc, Math.max(2.4, 1.5 * z)); }
    }
    if (replay && t < T_RS0) {
      p.noStroke(); p.fill(COL.pin);
      for (const l of M.L) { const u = needleOn(l, Math.max(0, tau)); if (u > 0 && u < K) p.circle(X(u * CW), Y((slotY(l, t) + 0.5) * LH), 2.6); }
      const ug = Math.min(K, Math.max(0, tau));             // the no-check pace, for comparison
      if (ug > 0 && ug < K) { p.noFill(); p.stroke(COL.zinc); p.strokeWeight(2); p.line(X(ug * CW), Y(0) - 14, X(ug * CW), Y(0) - 2); p.triangle(X(ug * CW) - 5, Y(0) - 18, X(ug * CW) + 5, Y(0) - 18, X(ug * CW), Y(0) - 12); }
    }
    // cost: the time each run spent checking, beside its lane (sage = inspections, zinc = steps redone)
    if (replay) {
      const x1 = X(W) + 14, sc = 13;
      for (const l of M.L) {
        const yc = Y((slotY(l, t) + 0.5) * LH), done = Math.max(0, tau) >= l.T ? 1 : 0;
        const insp = Math.min(K * INSPECT, inspectedBy(l, Math.max(0, tau))), red = redoneBy(l, Math.max(0, tau));
        p.noStroke(); p.fill(U.rgba(Tk.sage, 0.85)); p.rect(x1, yc - 2.6, insp * sc, 5.2);
        p.fill(U.rgba(COL.zinc, 0.9)); p.rect(x1 + insp * sc, yc - 2.6, red * sc, 5.2);
      }
    }
    // stacked: the expected curve under the heads (truth under evidence)
    const eB = U.seg(t, T_SORT1 - 0.4, T_SORT1 + 0.4) * (1 - U.seg(t, T_REW0, T_REW0 + 0.3));
    const eC = U.seg(t, T_RS1 - 0.3, T_RS1 + 0.4);
    if (eB > 0) curve(p, cam, EX.off, Tk.copper, eB, false);
    if (eC > 0) { curve(p, cam, EX.off, Tk.copper, 0.7 * eC, true); curve(p, cam, EX.on, Tk.copper, eC, false); }
  }
  function inspectedBy(l, tau) { let n = 0; for (const s of l.seg) if (s.u0 === s.u1 && s.t1 - s.t0 === INSPECT) n += U0.clamp((tau - s.t0) / INSPECT) * INSPECT; return n; }
  function redoneBy(l, tau) { let n = 0; for (const s of l.seg) { const d = s.t1 - s.t0; if (s.redo || (s.u0 === s.u1 && d === LIFT) || s.u1 < s.u0) n += U0.clamp((tau - s.t0) / d) * d; } return n; }
  function curve(p, cam, E, col, a, dashed) {
    p.noFill(); p.stroke(U0.rgba('#F3F1EA', 0.8 * a)); p.strokeWeight(dashed ? 4 : 5.5);
    if (dashed) p.drawingContext.setLineDash([6, 5]);
    p.beginShape(); p.vertex(cam.X(0), cam.Y(0));
    for (let j = 1; j <= K; j++) p.vertex(cam.X((j - 0.5) * CW), cam.Y(N * (1 - E[j]) * LH));
    p.vertex(cam.X(W), cam.Y(N * (1 - E[K]) * LH)); p.endShape();
    if (dashed) p.drawingContext.setLineDash([]);
    p.stroke(U0.rgba(col, a)); p.strokeWeight(dashed ? 2 : 3);
    if (dashed) p.drawingContext.setLineDash([6, 5]);
    p.beginShape(); p.vertex(cam.X(0), cam.Y(0));
    for (let j = 1; j <= K; j++) p.vertex(cam.X((j - 0.5) * CW), cam.Y(N * (1 - E[j]) * LH));
    p.vertex(cam.X(W), cam.Y(N * (1 - E[K]) * LH)); p.endShape();
    if (dashed) p.drawingContext.setLineDash([]);
  }

  function words(p, ctx, t, cam) {
    const { M } = ctx, Tk = ctx.tokens, U = U0, A = ctx.engine;
    p.noStroke();
    const ti = 1 - U.seg(t, T_GEL1 - 0.5, T_GEL1);             // title, set on the size above the tray
    if (ti > 0) { p.fill(U.rgba(Tk.ink, ti)); p.textFont('IM Fell English'); p.textSize(34); p.textAlign(p.CENTER, p.BASELINE); p.text('What an AI agent actually does', 480, 44); }
    // the step ruler (columns), and the lane rail
    const ru = U.seg(t, T_GEL1 - 0.2, T_GEL1 + 0.3);
    if (ru > 0) {
      p.textFont('DM Mono'); p.textSize(14); p.textAlign(p.CENTER, p.BASELINE);
      const y = Math.max(22, cam.Y(0) - 10);
      for (let j = 1; j <= K; j++) { const x = cam.X((j - 0.5) * CW); if (x < -20 || x > 980) continue; p.fill(U.rgba(j <= Math.ceil(needleOff(t) - 1e-6) && t < T_REW0 ? Tk.ink : Tk.dim, ru)); p.text(j, x, y); }
      p.textFont('Alegreya Sans'); p.textSize(15); p.textAlign(p.RIGHT, p.BASELINE); p.fill(U.rgba(Tk.dim, ru * (1 - cam.e)));
      p.text('step', TX - 10, cam.Y(0) - 10);
    }
    const macroL = U.seg(t, T_Z1, T_Z1 + 0.4) * (1 - U.seg(t, T_ZO0, T_ZO0 + 0.4));
    if (macroL > 0) {                                        // labels at their marks, in the macro
      const yc = cam.Y((M.star + 0.5) * LH);
      p.fill(U.rgba('#F1EFE7', 0.9 * macroL)); p.rect(30, yc + 34, 300, 54, 4);
      p.fill(U.rgba(Tk.ink, macroL)); p.textFont('IM Fell English'); p.textSize(20); p.textAlign(p.LEFT, p.BASELINE);
      p.text('one lane = one run', 42, yc + 56); p.textFont('Alegreya Sans'); p.textSize(16); p.fill(U.rgba(Tk.dim, macroL));
      p.text('the needle = the agent, one column per step', 42, yc + 78);
    }
    // rail: clean lanes settle at the bottom of the stack; the level is the count
    const ra = U.seg(t, T_ZO1 - 0.4, T_ZO1);
    if (ra > 0) rail(p, ctx, t, ra);
    // the commit beat, set in the margin: the question and three pins the comb waits on
    const C = ctx.commit, cd = C.countdown(t);
    if (cd !== null) {
      const x = 776;
      p.fill(Tk.ink); p.textFont('IM Fell English'); p.textSize(23); p.textAlign(p.LEFT, p.BASELINE);
      ['How many of', 'the 50 lanes', 'reach step 20', 'with no stray?'].forEach((s, i) => p.text(s, x, 150 + i * 28));
      p.textFont('Alegreya Sans'); p.textSize(15); p.fill(Tk.dim);
      p.text(C.auto ? 'guess, then the needles go on' : C.committed ? 'committed' : 'commit in the panel', x, 286);
      for (let i = 0; i < 3; i++) { const on = (C.auto || C.committed) && cd <= 3 - i; p.fill(on ? COL.pin : U.rgba(COL.zinc, 0.25)); p.circle(x + 8 + i * 22, 312, 12); }
    }
    // counts, top right (read from the lanes); cost legend
    const cB = U.seg(t, T_SORT1 - 0.3, T_SORT1 + 0.3), cC = U.seg(t, T_RS1 - 0.3, T_RS1 + 0.3);
    if (cB > 0) {                                            // the count block: realised, read from the lanes; expected beneath
      p.textAlign(p.LEFT, p.BASELINE); p.textFont('DM Mono');
      p.textSize(20); p.fill(U.rgba(Tk.ink, cB * (1 - cC))); p.text(M.clean.off + ' of 50 clean', 772, 30);
      p.fill(U.rgba(Tk.sage, cC)); p.text(M.clean.on + ' of 50 clean', 772, 30);
      p.textSize(14.5); p.fill(U.rgba(Tk.copper, cB * (1 - cC))); p.text('expected ' + A.expected.off[K].toFixed(1), 772, 50);
      p.fill(U.rgba(Tk.copper, cC)); p.text('expected ' + A.expected.on[K].toFixed(1), 772, 50);
    }
    const lg = U.seg(t, T_REP0 + 0.3, T_REP0 + 0.8);
    if (lg > 0) {
      p.textFont('Alegreya Sans'); p.textSize(15); p.textAlign(p.LEFT, p.BASELINE);
      p.fill(U.rgba(Tk.dim, lg)); p.text('↑ time spent checking', 772, TY + H + 20);
      p.text('sketch: ¼ step a check', 772, TY + H + 38);
      if (t < T_RS0) { const ug = Math.min(K, Math.max(0, tauAt(M, t))); if (ug > 0 && ug < K) { p.textAlign(p.CENTER, p.BASELINE); p.text('no-check pace', cam.X(ug * CW), cam.Y(0) - 22); } }
    }
  }

  function rail(p, ctx, t, a) {
    const { M } = ctx, Tk = ctx.tokens, U = U0, A = ctx.engine, cam = camera(t, M);
    const x = TX - 18, yN = n => TY + (N - n) * LH;          // n clean lanes fill n rows from the bottom
    if (cam.e > 0.01) return;
    p.noStroke(); p.fill(U.rgba(COL.zinc, 0.5 * a)); p.rect(x, TY, 5, H, 2.5);
    const showB = U.seg(t, T_SORT1 - 0.4, T_SORT1 + 0.3), showC = U.seg(t, T_RS1 - 0.3, T_RS1 + 0.3);
    const marks = [];
    if (t >= HOLD && t < T_REW1) marks.push(Math.round(ctx.commit.value));
    p.textFont('DM Mono'); p.textSize(14); p.textAlign(p.RIGHT, p.CENTER);
    for (let n = 0; n <= N; n += 10) {
      p.fill(U.rgba(COL.zinc, a)); p.rect(x - 5, yN(n) - 0.75, 5, 1.5);
      if (marks.every(m => Math.abs(yN(m) - yN(n)) > 16) && !(showB > 0 && Math.abs(n - M.clean.off) < 4) && !(showC > 0 && Math.abs(n - M.clean.on) < 4)) { p.fill(U.rgba(Tk.dim, a)); p.text(n, x - 8, yN(n)); }
    }
    if (showB > 0) {                                         // the clean block's level, read from the lanes
      const n = showC > 0 ? M.clean.off + (M.clean.on - M.clean.off) * showC : M.clean.off;
      p.fill(Tk.sage); p.rect(x, yN(n), 5, yN(0) - yN(n), 2.5);
      p.fill(U.rgba(Tk.ink, showB)); p.textSize(14); p.text(M.clean.off, x - 8, yN(M.clean.off));
      if (showC > 0) {
        p.fill(U.rgba(Tk.sage, showC)); p.text(M.clean.on, x - 8, yN(M.clean.on));
        p.textFont('Alegreya Sans'); p.textSize(15); p.text('+' + A.saved.length, x - 8, (yN(M.clean.on) + yN(M.clean.off)) / 2 - 8);
        p.text('saved', x - 8, (yN(M.clean.on) + yN(M.clean.off)) / 2 + 8); p.textFont('DM Mono'); p.textSize(14);
      }
    }
    const ga = t >= HOLD ? 1 - U.seg(t, T_REW0, T_REW1) : 0;
    if (ga > 0) {                                            // the guess: a pencil tick on the rail (kept until the replay)
      const C = ctx.commit, g = Math.round(C.value), y = yN(g);
      p.stroke(U.rgba(Tk.ink, ga)); p.strokeWeight(2); p.line(x - 12, y, x + 9, y); p.noStroke();
      p.fill(U.rgba(Tk.ink, ga)); p.textFont('Alegreya Sans'); p.textSize(14); p.textAlign(p.RIGHT, p.BOTTOM);
      p.text((C.auto ? 'guess ' : 'you ') + g, x + 8, y - 2);
    }
  }
})();
