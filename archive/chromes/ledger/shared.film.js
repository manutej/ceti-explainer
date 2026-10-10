/* THE LEDGER IN MOTION · shared film, revision 1 — "What an AI agent actually does" (glance, 35 s, Canvas2D).
   One ledger page, 2× Isotype units. Slip = one job (an agent reconciling 40 invoices in ten turns); sheet = one
   invoice; hourglass = 20 review-hours; stamp = one check (1 review-hour on 40 invoices). Never scaled.
   Twin worlds are one book kept twice: the month is posted without checks, then CORRECTED as if a check had stood
   at every turn — rescued jobs are reversed out of the exceptions back into the clean block, the hours each check
   cost are debited in the margin on the line where it stood. Same draws (the engine's common random numbers). */
(function () {
  const U = Atelier.U;

  /* ── timeline ── */
  const T = { rule: 0.4, post: 1.2, hold: 2.9, run: 5.9, dt: 0.7, close1: 12.95, corr: 14.4, cdt: 0.55, close2: 20.0,
    w0: 21.6, wOpen: 22.0, wPlan: 22.9, wHold: 24.0, wRun: 27.0, wDt: 0.36, wRes: 30.7, wCorr: 31.4, wMove: 32.2, end: 35.0 };

  /* ── geometry: one page; lines are the ten turns ── */
  const G = { L0: 100, LP: 34, base: 440, UX: 26, bx: 120, spine: 410, ex: 440, mx: 718, x1: 896 };
  const lineY = j => G.L0 + G.LP * j;
  const slotXY = (s, cols) => { cols = cols || 10; const b = Math.floor(s / cols); return [G.bx + G.UX * (s % cols), lineY(9 - b) + 1]; };
  const excXY = (j, i) => [G.ex + G.UX * i, lineY(j) + 1];
  const PENCIL = '#B8B2A6';

  /* ── act 1: one month posted, then corrected ── */
  function month(ctx) {
    const A = ctx.engine, key = 'm|' + ctx.seed;
    if (ctx._m && ctx._m.key === key) return ctx._m;
    const N = 100, K = 10, tr = [], slot = new Int32Array(N);
    for (let r = 0; r < N; r++) {
      const [x, y] = slotXY(r), tp = T.post + 0.1 * Math.floor(r / 10) + 0.007 * (r % 10);
      tr[r] = LG.track(x, y - 9).set(tp, 'on', 1).move(tp, tp + 0.26, x, y, U.ease.enter); slot[r] = r;
    }
    let alive = Array.from({ length: N }, (_, r) => r);
    const rows = Array.from({ length: K }, () => []);           // exceptions row occupants, by slot order
    for (let j = 0; j < K; j++) {
      const Tj = T.run + j * T.dt, fails = alive.filter(r => A.failStep.off[r] === j);
      if (fails.length) {
        const a = LG.assign(fails.map(r => tr[r].end()), fails.map((_, i) => excXY(j, i)));
        fails.forEach((r, i) => { const [x, y] = excXY(j, a[i]); tr[r].set(Tj + 0.05, 'fail', 1).move(Tj + 0.05, Tj + 0.4, x, y); rows[j][a[i]] = r; });
      }
      alive = alive.filter(r => A.failStep.off[r] !== j);
      const a = LG.assign(alive.map(r => slotXY(slot[r])), alive.map((_, i) => slotXY(i)));
      alive.forEach((r, i) => { if (a[i] !== slot[r]) { const [x, y] = slotXY(a[i]); tr[r].move(Tj + 0.42, Tj + 0.66, x, y); slot[r] = a[i]; } });
    }
    const n1 = alive.length;
    /* the correction: a check at every turn, line by line */
    let nB = n1;
    const review = [];
    for (let j = 0; j < K; j++) {
      const Tj = T.corr + j * T.cdt, here = rows[j].filter(r => r !== undefined);
      review.push(A.survivors.on[j]);
      const back = here.filter(r => A.failStep.on[r] < 0), down = here.filter(r => A.failStep.on[r] > j), stay = here.filter(r => A.failStep.on[r] === j);
      if (back.length) {
        const to = back.map((_, i) => slotXY(nB + i)), a = LG.assign(back.map(r => tr[r].end()), to);
        back.forEach((r, i) => { const [x, y] = to[a[i]]; tr[r].set(Tj + 0.08, 'fail', 0).set(Tj + 0.08, 'ear', 1).move(Tj + 0.08, Tj + 0.46, x, y); slot[r] = nB + a[i]; });
        nB += back.length;
      }
      down.forEach(r => { const jj = A.failStep.on[r], i = rows[jj].filter(q => q !== undefined).length; rows[jj].push(r);
        const [x, y] = excXY(jj, i); tr[r].set(Tj + 0.08, 'ear', 1).move(Tj + 0.08, Tj + 0.46, x, y); });
      const a = LG.assign(stay.map(r => tr[r].end()), stay.map((_, i) => excXY(j, i)));
      stay.forEach((r, i) => { const [x, y] = excXY(j, a[i]); tr[r].move(Tj + 0.47, Tj + 0.6, x, y); });
      rows[j] = stay;
    }
    const cleanB = []; for (let r = 0; r < N; r++) if (A.failStep.on[r] < 0) cleanB.push(r);
    cleanB.forEach(r => tr[r].set(T.close2 + 0.06 * Math.floor(slot[r] / 10), 'clean', 1));
    let reviewH = 0; review.forEach(h => (reviewH += h));
    const jr = cleanB.find(r => slot[r] === 0);
    return (ctx._m = { key, tr, n1, nB, review, reviewH, jr, saved: A.saved });
  }

  /* ── act 2 · Wield: per-turn reliabilities differ (sketch); 5 checks of budget ── */
  const PW = [0.99, 0.97, 0.98, 0.85, 0.98, 0.90, 0.99, 0.92, 0.985, 0.96], CW = 0.8, BUDGET = 5;
  const pPrime = p => p + (1 - p) * CW * p;
  const RISKIEST = PW.map((p, j) => [p, j]).sort((a, b) => a[0] - b[0]).slice(0, BUDGET).map(x => x[1]).sort((a, b) => a - b);
  function planOf(st) { const on = []; for (let j = 0; j < 10; j++) if (st['c' + j]) on.push(j); return { S: on.slice(0, BUDGET), over: on.length > BUDGET }; }
  function outcome(seed, S) {
    const set = new Set(S), f = new Int16Array(40).fill(-1), caught = [];
    for (let r = 0; r < 40; r++) for (let j = 0; j < 10; j++) {
      if (!(U.h(seed, r, j, 0) > PW[j])) continue;
      if (set.has(j) && U.h(seed, r, j, 1) < CW && U.h(seed, r, j, 2) < PW[j]) { caught.push([r, j]); continue; }
      f[r] = j; break;
    }
    let q = 1; for (let j = 0; j < 10; j++) q *= set.has(j) ? pPrime(PW[j]) : PW[j];
    let clean = 0; for (let r = 0; r < 40; r++) if (f[r] < 0) clean++;
    return { f, caught, q, clean, expected: 40 * q, hit: LG.binomTail(40, q, 32), S: [...S] };
  }
  function wield(ctx) {
    const st = ctx.state, plan = planOf(st), key = 'w|' + ctx.seed + '|' + plan.S.join(',');
    if (ctx._w && ctx._w.key === key) return ctx._w;
    const sw = ctx.seed + 1000, Aout = outcome(sw, plan.S), Bout = outcome(sw, RISKIEST), same = plan.S.join() === RISKIEST.join();
    const M = month(ctx), J = M.tr[M.jr].end(), tr = [], slot = new Int32Array(40), wxy = s => slotXY(s, 8);
    for (let r = 0; r < 40; r++) { const [x, y] = wxy(r), tp = T.wOpen + 0.012 * r; tr[r] = LG.track(J[0] + 2, J[1] + 2).set(tp, 'on', 1).move(tp, tp + 0.55, x, y, U.ease.enter); slot[r] = r; }
    let alive = Array.from({ length: 40 }, (_, r) => r);
    const rowsA = Array.from({ length: 10 }, () => []), Sa = new Set(plan.S);
    for (let j = 0; j < 10; j++) {
      const Tj = T.wRun + j * T.wDt, fails = alive.filter(r => Aout.f[r] === j);
      const caught = Sa.has(j) ? alive.filter(r => U.h(sw, r, j, 0) > PW[j] && Aout.f[r] !== j) : [];
      if (fails.length) { const a = LG.assign(fails.map(r => tr[r].end()), fails.map((_, i) => excXY(j, i)));
        fails.forEach((r, i) => { const [x, y] = excXY(j, a[i]); tr[r].set(Tj + 0.03, 'fail', 1).move(Tj + 0.03, Tj + 0.22, x, y); rowsA[j].push(r); }); }
      if (caught.length) { const a = LG.assign(caught.map(r => tr[r].end()), caught.map((_, i) => excXY(j, fails.length + i)));
        caught.forEach((r, i) => { const [x, y] = excXY(j, fails.length + a[i]), home = tr[r].end(); tr[r].move(Tj + 0.04, Tj + 0.15, x, y).set(Tj + 0.16, 'ear', 1).move(Tj + 0.19, Tj + 0.3, home[0], home[1]); }); }
      alive = alive.filter(r => Aout.f[r] !== j);
      const a = LG.assign(alive.map(r => wxy(slot[r])), alive.map((_, i) => wxy(i)));
      alive.forEach((r, i) => { if (a[i] !== slot[r]) { const [x, y] = wxy(a[i]); tr[r].move(Tj + 0.24, Tj + 0.35, x, y); slot[r] = a[i]; } });
    }
    /* stamps: budget pool → the plan's lines → (correction) the riskiest lines */
    const stamps = [], pool = i => [G.mx + 22 * i, G.base + 8];
    for (let i = 0; i < BUDGET; i++) { const [x, y] = pool(i), tp = T.wOpen + 0.3 + 0.05 * i; stamps[i] = LG.track(x, y - 6).set(tp, 'on', 1).move(tp, tp + 0.2, x, y, U.ease.enter); }
    const lineStamp = j => [G.mx, lineY(j) + 4];
    if (plan.S.length) { const a = LG.assign(plan.S.map(j => lineStamp(j)), stamps.map(s => s.end()));
      plan.S.forEach((j, i) => { const t0 = T.wPlan + 0.1 * i; stamps[a[i]].move(t0, t0 + 0.5, ...lineStamp(j)).set(t0 + 0.5, 'line', j); }); }
    if (!same) {
      const a = LG.assign(RISKIEST.map(j => lineStamp(j)), stamps.map(s => s.end()));
      RISKIEST.forEach((j, i) => { stamps[a[i]].move(T.wCorr, T.wCorr + 0.6, ...lineStamp(j)).set(T.wCorr + 0.6, 'line', j); });
      // every invoice re-packs at once into the riskiest-five outcome: one simultaneous crossing-free move
      const passB = [], failB = Array.from({ length: 10 }, () => []);
      for (let r = 0; r < 40; r++) { if (Bout.f[r] < 0) passB.push(r); else failB[Bout.f[r]].push(r); }
      const ends = [];
      const pA = passB.map(r => tr[r].end()), aP = LG.assign(pA, passB.map((_, i) => wxy(i)));
      passB.forEach((r, i) => ends.push([r, wxy(aP[i]), Aout.f[r] >= 0]));
      for (let j = 0; j < 10; j++) if (failB[j].length) { const a = LG.assign(failB[j].map(r => tr[r].end()), failB[j].map((_, i) => excXY(j, i)));
        failB[j].forEach((r, i) => ends.push([r, excXY(j, a[i]), false, true])); }
      for (const [r, [x, y], rescued, fails] of ends) {
        if (rescued) tr[r].set(T.wMove, 'fail', 0).set(T.wMove, 'ear', 1);
        if (fails) tr[r].set(T.wMove, 'fail', 1);
        tr[r].move(T.wMove, T.wMove + 0.9, x, y);
      }
    }
    const hk = same ? Aout : Bout;
    for (let r = 0; r < 40; r++) if (hk.f[r] < 0) { const yy = tr[r].end()[1]; tr[r].set((same ? T.wRes : T.wMove + 1.0) + 0.05 * (9 - (yy - G.L0) / G.LP), 'clean', 1); }
    return (ctx._w = { key, plan, A: Aout, B: Bout, same, tr, stamps });
  }

  /* ── drawing helpers ── */
  const fade = (t, t0, d) => U.seg(t, t0, t0 + (d || 0.35), 'linear');
  const win = (t, t0, t1, d) => Math.min(fade(t, t0, d || 0.3), 1 - fade(t, t1 - (d || 0.3), d || 0.3));
  function spriteFor(T1, t, base) {
    if (T1.get(t, 'fail', 0)) return base + '.fail';
    const ear = T1.get(t, 'ear', 0);
    if (T1.get(t, 'clean', 0)) return base + (ear ? '.clean.ear' : '.clean');
    return ear ? base + '.ear' : base;
  }
  function drawUnits(c, AT, tracks, t, base, skip) {
    const moving = [];
    for (let r = 0; r < tracks.length; r++) {
      if (r === skip) continue;
      const T1 = tracks[r]; if (!T1.get(t, 'on', 0)) continue;
      const [x, y, m] = T1.at(t);
      if (m) moving.push([T1, x, y]); else LG.blit(c, AT, spriteFor(T1, t, base), x, y);
    }
    for (const [T1, x, y] of moving) LG.blit(c, AT, spriteFor(T1, t, base), x, y);
  }
  const inBlock = (y, x) => x < G.spine - 10;
  function tally(tracks, t) {
    let blk = 0, exc = 0;
    for (const T1 of tracks) { if (!T1.get(t, 'on', 0)) continue; const [x, y, m] = T1.at(t); if (m) continue; if (inBlock(y, x)) blk++; else exc++; }
    return { blk, exc };
  }
  function dashed(c, x0, x1, y, col) { c.save(); c.strokeStyle = col; c.lineWidth = 1.2; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(x0, y + 0.5); c.lineTo(x1, y + 0.5); c.stroke(); c.restore(); }
  /** the bookkeeper's pencil: a rule across the block, the figure in the margin, and (while held) a tally of strokes */
  function pencil(c, t, C, value, cols, rowsPer, label) {
    const y = Math.round(G.base - G.LP * value / cols), xe = G.bx + G.UX * cols - 2;
    c.save(); c.strokeStyle = PENCIL; c.lineWidth = 1.6; c.beginPath(); c.moveTo(G.bx - 8, y + 0.5);
    for (let x = G.bx - 8; x <= xe + 6; x += 6) c.lineTo(x, y + 0.5 + 0.6 * Math.sin(x * 0.7)); c.stroke(); c.restore();
    LG.text(c, String(Math.round(value)), G.bx - 14, y + 6, { f: LG.SERIF, italic: true, w: 500, size: 20, align: 'right', color: PENCIL });
    LG.text(c, label, G.bx - 14, y - 12, { f: LG.SERIF, italic: true, size: 14, align: 'right', color: PENCIL });
    const cd = C ? C.countdown(t) : null;
    if (cd !== null && (C.auto || C.committed)) {                       // three pencil strokes, one a second
      const n = 3 - Math.ceil(cd) + 1;
      c.save(); c.strokeStyle = PENCIL; c.lineWidth = 2;
      for (let i = 0; i < Math.min(3, n); i++) { const x = G.bx - 40 + 8 * i; c.beginPath(); c.moveTo(x, y + 12); c.lineTo(x + 2, y + 30); c.stroke(); }
      c.restore();
    }
  }
  /** a figure corrected the bookkeeper's way: the old one struck in pencil, the new one beside it in ink */
  function corrected(c, x, y, oldV, newV, u, col, align) {
    const o = { f: LG.SERIF, w: 600, size: 30, align: align || 'left' };
    if (u <= 0) { LG.text(c, LG.num(oldV), x, y, Object.assign({ color: col }, o)); return; }
    const w = LG.width(c, LG.num(oldV), o);
    LG.text(c, LG.num(oldV), x, y, Object.assign({}, o, { color: PENCIL, w: 500, size: 22 }));
    const ws = LG.width(c, LG.num(oldV), Object.assign({}, o, { w: 500, size: 22 }));
    c.fillStyle = PENCIL; c.fillRect(x - 2, y - 8, (ws + 4) * Math.min(1, u * 2), 1.6);
    if (u > 0.4) LG.text(c, LG.num(newV), x + ws + 12, y, Object.assign({ color: col, alpha: (u - 0.4) / 0.6 }, o));
  }

  Atelier.film({
    id: 'ledger-shared',
    title: 'What an AI agent actually does — the ledger',
    direction: 'D · The Ledger in Motion',
    level: 'glance',
    duration: T.end,
    size: [960, 540],
    renderer: 'p2d',
    fps: 30,
    seed: 1,
    ground: '#171B23',
    chapters: [
      { t: 0, label: 'The page' }, { t: T.hold - 0.5, label: 'Your estimate' }, { t: T.run, label: 'Ten turns' },
      { t: T.corr, label: 'Corrected: checks' }, { t: T.w0, label: 'Your turn' }, { t: T.wRun, label: 'One run' }, { t: T.wCorr, label: 'The riskiest five' },
    ],
    captions: [
      { t0: 0.3, t1: T.post, text: 'An AI agent works in turns: plan, call a tool, read what came back. Ten turns per job.' },
      { t0: T.post, t1: T.run, text: 'Each turn comes out right 95 % of the time. Of 100 jobs, how many get through clean?' },
      { t0: T.run, t1: T.close1, text: 'A job that slips at any turn is filed, whole, on the line of the turn where it failed.' },
      { t0: T.close1, t1: T.corr, text: 'Expected: 60 of 100 (0.95 to the 10th). This month ran a little lucky.' },
      { t0: T.corr, t1: 17.6, text: 'Now correct the books as if a check stood at every turn. Same jobs, same slips.' },
      { t0: 17.6, t1: T.close2, text: 'Rescued jobs are reversed back into the clean block. Each check costs review time.' },
      { t0: T.close2, t1: T.w0, text: 'With checks: about 89 of 100 expected. The price: nearly a thousand review-hours.' },
      { t0: T.w0, t1: T.wHold, text: 'Your turn: one job, 40 invoices, only 5 checks. Some turns are riskier than others.' },
      { t0: T.wHold, t1: T.wRun, text: 'The outlines show where exceptions are expected. How many invoices come through?' },
      { t0: T.wRun, t1: T.wCorr, text: 'One run with your checks. Target: 32 clean.' },
      { t0: T.wCorr, t1: T.end, text: 'Same invoices, checks moved to the five riskiest turns. Where you check matters.' },
    ],
    state: { guess: 85, guess2: 32, c0: true, c1: true, c2: true, c3: true, c4: true, c5: false, c6: false, c7: false, c8: false, c9: false },
    controls: [
      { key: 'guess', type: 'commit', label: 'Your estimate: clean jobs of 100, no checks', min: 0, max: 100, step: 1, jump: T.run, countdown: 3,
        hint: 'Ten turns, each right 95 % of the time.', format: v => Math.round(v) },
      ...PW.map((p, j) => ({ key: 'c' + j, type: 'toggle', label: `Wield · check turn ${j + 1} (${Math.round((1 - p) * 1000) / 10} % slip)` })),
      { key: 'guess2', type: 'commit', label: 'Clean invoices you predict (of 40)', min: 0, max: 40, step: 1, jump: T.wRun, countdown: 3,
        hint: 'Budget: 5 checks. Target: 32 clean.', format: v => Math.round(v) },
    ],
    engine: ctx => Atelier.AgentLoop({ N: 100, k: 10, p: 0.95, c: 0.8, retry: 1, seed: ctx.seed }),

    setup(p, ctx) { month(ctx); wield(ctx); LG.atlas(p, ctx, 2); },

    draw(p, t, ctx) {
      const c = p.drawingContext, P = LG.PAL, AT = LG.atlas(p, ctx, 2);
      c.save();
      const a1 = 1 - fade(t, T.w0, 0.4), a2 = fade(t, T.w0 + 0.3, 0.4);
      /* headline: the one sentence on the page; the key beside it */
      c.globalAlpha = fade(t, 0.1, 0.5);
      LG.text(c, 'What an AI agent actually does', G.bx, 52, { f: LG.SERIF, w: 500, size: 30, ls: -0.3 });
      /* ruling */
      const ru = U.seg(t, T.rule, T.rule + 0.7, 'inOut');
      c.globalAlpha = 1;
      if (ru > 0) {
        const x0 = G.bx - 4, w = (G.x1 - x0) * ru;
        LG.hrule(c, x0, x0 + w, G.L0 - 6, P.ruleHi);
        for (let j = 1; j < 10; j++) LG.hrule(c, x0, x0 + w, lineY(j) - 1, P.ruleLo);
        LG.hrule(c, x0, x0 + w, G.base, P.ruleHi);
        const h = (G.base - G.L0 + 6) * ru;
        LG.vrule(c, G.spine - 18, G.L0 - 6, G.L0 - 6 + h, P.rule); LG.vrule(c, G.spine + 18, G.L0 - 6, G.L0 - 6 + h, P.rule);
        LG.vrule(c, G.mx - 10, G.L0 - 6, G.L0 - 6 + h, P.rule);
      }
      for (let j = 0; j < 10; j++) { c.globalAlpha = fade(t, T.rule + 0.3 + 0.04 * j, 0.3); LG.text(c, String(j + 1).padStart(2, '0'), G.spine, lineY(j) + 22, { w: 600, size: 14, align: 'center', color: P.dim }); }
      if (a1 > 0) drawMonth(c, t, ctx, AT, a1);
      if (a2 > 0) drawWield(c, t, ctx, AT, a2);
      c.restore();
    },

    score(ctx) {
      const A = ctx.engine, M = month(ctx), W = wield(ctx), ev = [];
      for (let b = 0; b < 10; b++) ev.push({ t: T.post + 0.1 * b, kind: 'tick', gain: 0.35, freq: 2600 });
      for (let i = 0; i < 3; i++) ev.push({ t: T.hold + i, kind: 'tick', gain: 0.5, freq: 900 });          // pencil strokes
      for (let j = 0; j < 10; j++) {
        const Tj = T.run + j * T.dt, fo = A.failedAt('off', j);
        ev.push({ t: Tj, kind: 'tick', gain: 0.6, freq: 2200 });
        if (fo) ev.push({ t: Tj + 0.4, kind: 'clack', gain: Math.min(1.4, 0.45 + fo / 6), freq: 170 });
      }
      for (let j = 0; j < 10; j++) {
        const Tj = T.corr + j * T.cdt; ev.push({ t: Tj, kind: 'tick', gain: 0.45, freq: 1500, pan: 0.4 });
        let back = 0; for (let r = 0; r < 100; r++) if (A.failStep.off[r] === j && A.failStep.on[r] !== j) back++;
        if (back) ev.push({ t: Tj + 0.46, kind: 'click', gain: Math.min(1.3, 0.4 + back / 4), freq: 1568 });
      }
      ev.push({ t: T.close2 + 0.5, kind: 'tone', freq: 392, dur: 1.0, gain: 0.8 }, { t: T.close2 + 0.52, kind: 'tone', freq: 587, dur: 1.0, gain: 0.5 });
      W.plan.S.forEach((j, i) => ev.push({ t: T.wPlan + 0.1 * i + 0.5, kind: 'clack', gain: 0.5, freq: 260 }));
      for (let i = 0; i < 3; i++) ev.push({ t: T.wHold + i, kind: 'tick', gain: 0.5, freq: 900 });
      for (let j = 0; j < 10; j++) {
        const Tj = T.wRun + j * T.wDt; ev.push({ t: Tj, kind: 'tick', gain: 0.5, freq: 2200 });
        let f = 0; for (let r = 0; r < 40; r++) if (W.A.f[r] === j) f++;
        if (f) ev.push({ t: Tj + 0.22, kind: 'clack', gain: 0.45 + f / 5, freq: 170 });
      }
      if (!W.same) { ev.push({ t: T.wCorr + 0.6, kind: 'clack', gain: 0.6, freq: 260 }); ev.push({ t: T.wMove + 0.9, kind: 'click', gain: 0.9, freq: 1568 }); }
      ev.push({ t: T.wMove + 1.1, kind: 'tone', freq: (W.same ? W.A : W.B).clean >= 32 ? 523 : 330, dur: 1.2, gain: 0.7 });
      return ev;
    },

    meta(ctx) {
      const A = ctx.engine, M = month(ctx), W = wield(ctx);
      return [
        { label: 'Clean jobs · no checks (of 100)', value: A.survivors.off[10], check: { world: 'off', k: 10, p: 0.95, c: 0.8, N: 100 } },
        { label: 'Clean jobs · check every turn', value: A.survivors.on[10], check: { world: 'on', k: 10, p: 0.95, c: 0.8, N: 100 } },
        { label: 'P(clean job) · no checks', value: A.exact.off[10], check: { world: 'off', k: 10, p: 0.95, c: 0.8 } },
        { label: 'P(clean job) · check every turn', value: A.exact.on[10], check: { world: 'on', k: 10, p: 0.95, c: 0.8 } },
        { label: 'Review-hours (1 h per job per checked turn)', value: M.reviewH },
        { label: 'Jobs reversed back by the check', value: A.saved.length },
        { label: `Wield · your checks (turns ${W.plan.S.map(j => j + 1).join(', ') || 'none'}) · clean`, value: W.A.clean },
        { label: 'Wield · your plan, expected (sketch p)', value: +W.A.expected.toFixed(1) },
        { label: 'Wield · your plan, chance of 32+', value: +W.A.hit.toFixed(3) },
        { label: `Wield · riskiest five (${RISKIEST.map(j => j + 1).join(', ')}) · clean`, value: W.B.clean },
        { label: 'Wield · riskiest five, expected', value: +W.B.expected.toFixed(1) },
        { label: 'Wield · riskiest five, chance of 32+', value: +W.B.hit.toFixed(3) },
        { label: 'Seed', value: ctx.seed },
      ];
    },
  });

  /* ═════════════ act 1: the month, posted and corrected ═════════════ */
  function drawMonth(c, t, ctx, AT, ga) {
    const P = LG.PAL, A = ctx.engine, M = month(ctx), st = ctx.state, C1 = ctx.commits.guess;
    const A_ = v => (c.globalAlpha = ga * v);
    /* key + heads */
    A_(fade(t, T.post - 0.3, 0.4));
    LG.blit(c, AT, 'job', 548, 24);
    LG.text(c, '= one job: 40 invoices, ten turns', 580, 48, { size: 14, color: P.dim });
    LG.caps(c, t >= T.close2 ? 'Clean' : 'In process', G.bx, 88, { size: 13, color: P.ink });
    LG.caps(c, 'Turn', G.spine, 88, { size: 13, align: 'center' });
    LG.caps(c, 'Exceptions', G.ex, 88, { size: 13, color: P.ink });
    A_(fade(t, T.corr, 0.4));
    LG.caps(c, 'Review time', G.mx, 88, { size: 13, color: P.ink });
    LG.blit(c, AT, 'hr.review', 774, 24, 1, 20, 32);
    LG.text(c, '= 20 h of review', 800, 48, { size: 14, color: P.dim });

    /* the ruler on the current line (posting, then correcting) */
    const ruler = (t0, dt, t1) => {
      if (t < t0 - 0.15 || t > t1 + 0.3) return;
      const s = U.clamp((t - t0) / dt, 0, 9.999), j = Math.floor(s), u = U.ease.inOut(U.clamp((s - j) / 0.25));
      const y = j === 0 ? lineY(0) : lineY(j - 1) + G.LP * u;
      A_(Math.min(fade(t, t0 - 0.15, 0.15), 1 - fade(t, t1, 0.3)));
      c.fillStyle = P.band; c.fillRect(G.bx - 6, y - 1, G.x1 - G.bx + 6, G.LP - 1);
      LG.text(c, String(j + 1).padStart(2, '0'), G.spine, lineY(j) + 22, { w: 600, size: 14, align: 'center', color: P.ink });
    };
    ruler(T.run, T.dt, T.close1); ruler(T.corr, T.cdt, T.close2);

    /* truth under the evidence: the expected level, dashed across the block (60 without checks → 88.6 with) */
    if (t >= T.run) {
      const u = fade(t, T.corr, 0.6), e = U.lerp(A.expected.off[10], A.expected.on[10], u), y = Math.round(G.base - G.LP * e / 10);
      A_(0.9 * fade(t, T.run, 0.4)); dashed(c, G.bx - 6, G.bx + 10 * G.UX, y, P.ink);
      LG.text(c, 'expected', G.bx - 14, y + 5, { size: 14, align: 'right', color: P.dim });
    }
    /* the review time: hourglasses debited on the line where each check stood */
    if (t >= T.corr) {
      for (let j = 0; j < 10; j++) {
        const Tj = T.corr + j * T.cdt; if (t < Tj) continue;
        const h = M.review[j], whole = Math.floor(h / 20), part = (h % 20) / 20;
        for (let i = 0; i <= whole; i++) { const f = i < whole ? 1 : part, ti = Tj + 0.04 * i; if (f <= 0 || t < ti) continue;
          A_(fade(t, ti, 0.12)); LG.blit(c, AT, 'hr.review', G.mx + 22 * i, lineY(j) + 1 - 5 * (1 - fade(t, ti, 0.12)), f, 20, 32); }
        A_(fade(t, Tj + 0.2, 0.2)); LG.text(c, h + ' h', G.x1, lineY(j) + 22, { size: 14, align: 'right', color: P.slate });
      }
    }
    /* the jobs */
    A_(1);
    drawUnits(c, AT, M.tr, t, 'job', t >= T.w0 ? M.jr : -1);
    /* your estimate, in pencil */
    if (t >= T.hold - 0.5 && t < T.corr + 0.5) { A_(fade(t, T.hold - 0.5, 0.4) * (1 - fade(t, T.corr, 0.5))); pencil(c, t, C1, st.guess, 10, 10, C1 && C1.auto ? 'a typical guess' : 'your guess'); }

    /* the folio: totals counted from the units, corrected in place */
    A_(fade(t, T.post, 0.3));
    const k = tally(M.tr, t), cu = fade(t, T.corr, 0.01) * U.clamp((t - T.corr) / (T.close2 - T.corr));
    if (t < T.corr) {
      LG.text(c, LG.num(k.blk), G.bx, 482, { f: LG.SERIF, w: 600, size: 30, color: P.ink });
      if (t >= T.run) LG.text(c, LG.num(k.exc), G.ex, 482, { f: LG.SERIF, w: 600, size: 30, color: k.exc ? P.peach : P.faint });
    } else {
      corrected(c, G.bx, 482, M.n1, k.blk, Math.min(1, (t - T.corr) / 0.8), t >= T.close2 ? P.sage : P.ink);
      corrected(c, G.ex, 482, 100 - M.n1, k.exc, Math.min(1, (t - T.corr) / 0.8), P.peach);
      let hrs = 0; for (let j = 0; j < 10; j++) if (t >= T.corr + j * T.cdt + 0.2) hrs += M.review[j];
      LG.text(c, '−' + LG.num(hrs) + ' h', G.mx, 482, { f: LG.SERIF, w: 600, size: 30, color: P.slate });
    }
    if (t >= T.close2) {                                            /* the book balances: double rule */
      A_(fade(t, T.close2 + 0.4, 0.3));
      LG.hrule(c, G.bx - 4, G.x1, G.base + 4, P.ruleHi); LG.hrule(c, G.bx - 4, G.x1, G.base + 7, P.ruleHi);
    }
    c.globalAlpha = 1;
  }

  /* ═════════════ act 2 · Wield ═════════════ */
  function drawWield(c, t, ctx, AT, ga) {
    const P = LG.PAL, W = wield(ctx), st = ctx.state, C2 = ctx.commits.guess2;
    const A_ = v => (c.globalAlpha = ga * v);
    A_(1);
    LG.blit(c, AT, 'inv', 550, 26, 1, 20, 32);
    LG.text(c, '= one invoice', 580, 48, { size: 14, color: P.dim });
    LG.blit(c, AT, 'stamp', 680, 24, 1, 20, 32);
    LG.text(c, '= one check: 1 review-hour', 708, 48, { size: 14, color: P.dim });
    LG.caps(c, 'Invoices', G.bx, 88, { size: 13, color: P.ink });
    LG.caps(c, 'Turn', G.spine, 88, { size: 13, align: 'center' });
    LG.caps(c, 'Exceptions', G.ex, 88, { size: 13, color: P.ink });
    LG.caps(c, 'Checks · budget 5', G.mx, 88, { size: 13, color: P.ink });
    /* where exceptions are expected without checks (sketch reliabilities): outlined, cut at the fraction */
    let surv = 1;
    for (let j = 0; j < 10; j++) {
      const e = 40 * surv * (1 - PW[j]); surv *= PW[j];
      A_(fade(t, T.wOpen + 0.3 + 0.05 * j, 0.3) * 0.9);
      for (let i = 0; i < Math.ceil(e - 1e-9); i++) LG.blit(c, AT, 'inv.risk', G.ex + G.UX * i, lineY(j) + 1, Math.min(1, e - i), 20, 32);
    }
    /* target: 32 outlined places, four rows of eight */
    A_(0.9);
    for (let s = 0; s < 32; s++) { const [x, y] = slotXY(s, 8); LG.blit(c, AT, 'inv.ghost', x, y, 1, 20, 32); }
    /* stamps */
    A_(1);
    for (const s of W.stamps) { if (!s.get(t, 'on', 0)) continue; const [x, y] = s.at(t); LG.blit(c, AT, 'stamp', x, y, 1, 20, 32); }
    if (W.plan.over) { A_(fade(t, T.wPlan, 0.3)); LG.text(c, 'over budget: first five used', G.mx, G.base + 50, { f: LG.SERIF, italic: true, size: 14, color: PENCIL }); }
    /* the invoices */
    A_(1);
    drawUnits(c, AT, W.tr, t, 'inv');
    /* prediction in pencil */
    if (t >= T.wHold - 0.4 && t < T.wRes + 0.5) { A_(fade(t, T.wHold - 0.4, 0.4) * (1 - fade(t, T.wRes, 0.4))); pencil(c, t, C2, st.guess2, 8, 5, C2 && C2.auto ? 'a sample guess' : 'your guess'); }
    /* folio: while running, counts from the units; at the close it leads with the expectation, the run is one draw */
    const k = tally(W.tr, t), pct = q => Math.round(q * 100) + ' %';
    A_(1);
    if (t < T.wRes) {
      LG.text(c, LG.num(k.blk), G.bx, 482, { f: LG.SERIF, w: 600, size: 30, color: P.ink });
      if (t >= T.wRun) LG.text(c, LG.num(k.exc), G.ex, 482, { f: LG.SERIF, w: 600, size: 30, color: k.exc ? P.peach : P.faint });
    }
    /* truth under the evidence: the expected count for the checks as placed — it climbs past the target when they move */
    const yT = G.base - 4 * G.LP;
    LG.hrule(c, G.bx - 6, G.bx + 8 * G.UX, yT, P.dim, 1.2);
    LG.text(c, 'target 32', G.bx + 8 * G.UX + 4, yT + 5, { size: 14, color: P.dim });
    if (t >= T.wRes) {
      const u = W.same ? 0 : U.ease.inOut(U.clamp((t - T.wMove) / 0.9)), e = U.lerp(W.A.expected, W.B.expected, u), y = Math.round(G.base - G.LP * e / 8);
      A_(fade(t, T.wRes, 0.3)); c.save(); c.strokeStyle = P.ink; c.lineWidth = 2; c.setLineDash([5, 3]); c.beginPath(); c.moveTo(G.bx - 8, y + 0.5); c.lineTo(G.bx + 8 * G.UX, y + 0.5); c.stroke(); c.restore();
      LG.text(c, 'expected', G.bx - 14, y + 5, { size: 14, align: 'right', color: P.ink });
      const v = fade(t, T.wMove, 0.01) * U.clamp((t - T.wMove) / 0.9);
      LG.caps(c, 'Expected clean, of 40', G.bx, 462, { size: 13 });
      LG.caps(c, 'Chance of 32 or more', G.ex, 462, { size: 13 });
      LG.caps(c, 'This run', G.mx, 462, { size: 13 });
      if (W.same) {
        LG.text(c, W.A.expected.toFixed(1), G.bx, 494, { f: LG.SERIF, w: 600, size: 30, color: W.A.expected >= 32 ? P.sage : P.peach });
        LG.text(c, pct(W.A.hit), G.ex, 494, { f: LG.SERIF, w: 600, size: 30, color: W.A.hit > 0.5 ? P.sage : P.peach });
        LG.text(c, LG.num(W.A.clean) + ' clean', G.mx, 494, { f: LG.SERIF, italic: true, size: 20, color: PENCIL });
      } else {
        const fx = (x, a, b, good) => { if (v <= 0) { LG.text(c, a, x, 494, { f: LG.SERIF, w: 600, size: 30, color: P.peach }); return; }
          const o = { f: LG.SERIF, w: 500, size: 22, color: PENCIL }, w = LG.width(c, a, o); LG.text(c, a, x, 494, o);
          c.fillStyle = PENCIL; c.fillRect(x - 2, 486, (w + 4) * Math.min(1, v * 2), 1.6);
          if (v > 0.4) LG.text(c, b, x + w + 12, 494, { f: LG.SERIF, w: 600, size: 30, color: good ? P.sage : P.peach, alpha: (v - 0.4) / 0.6 }); };
        fx(G.bx, W.A.expected.toFixed(1), W.B.expected.toFixed(1), W.B.expected >= 32);
        fx(G.ex, pct(W.A.hit), pct(W.B.hit), W.B.hit > 0.5);
        LG.text(c, LG.num(W.A.clean) + (v > 0.4 ? ' → ' + LG.num(W.B.clean) : '') + ' clean', G.mx, 494, { f: LG.SERIF, italic: true, size: 20, color: PENCIL });
      }
    }
    c.globalAlpha = 1;
  }
})();
