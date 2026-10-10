/* F · BUNRAKU — shared concept: "What an AI agent actually does" (glance). Revision 1.
   Mark rule: one cut-paper puppet on one toy stage = one run; one move along the plank = one step (cells 1–20 on the
   stage's move board); three operators in black = the system — copper rod = plan (the model), slate rod = act (the
   tools), sage crook = check (the harness). Where a puppet falls its curtain closes and its copper job slip comes to
   rest on the apron above the cell of the move it fell on (the address). A caught slip costs a move: the puppet is
   lifted back and the move is made again (its stage finishes later; a sage redo mark on the board). One district,
   run twice on the same draws; the closing image is a curtain call — only the lit stages bow — over a chalk ruler
   where every stroke is a lit stage. Counts come only from AgentLoop (Wield plans: same draws, exact expectations). */
Atelier.film({
  id: 'bunraku-shared',
  title: 'Bunraku — what an AI agent actually does',
  direction: 'F · Bunraku',
  level: 'glance',
  duration: 35,
  size: [960, 540],
  renderer: 'webgl',
  fps: 30,
  seed: 1,
  ground: '#0B0908',
  chapters: [
    { t: 0, label: 'Title' }, { t: 3.8, label: 'Who holds the rods' }, { t: 7.8, label: 'One performance' }, { t: 13.7, label: 'Your call' },
    { t: 17.8, label: 'Fifty stages, no check' }, { t: 26.6, label: 'With the check' }, { t: 32.6, label: 'Curtain call' },
  ],
  captions: [
    { t0: 0.3, t1: 3.8, text: 'One stage is one run of a task. The puppet is the work; it cannot move on its own.' },
    { t0: 3.8, t1: 7.8, text: 'Three operators in black: the model plans, the tools act, the harness checks.' },
    { t0: 7.8, t1: 10.6, text: 'Twenty moves along a narrow plank. Each move goes right 95 times in 100.' },
    { t0: 10.6, t1: 13.7, text: 'A slip: the check operator\u2019s crook catches it. The move is made again \u2014 that costs time.' },
    { t0: 13.7, t1: 17.8, text: 'Take the check operator away. Of 50 stages, how many will still be lit after 20 moves?' },
    { t0: 17.8, t1: 24.8, text: 'Fifty runs, no check. A fallen puppet\u2019s curtain closes; its job slip marks the move.' },
    { t0: 24.8, t1: 26.6, text: 'One chalk stroke per stage still lit. Expect about 36 in 100 — 18 of 50.' },
    { t0: 26.6, t1: 31.7, text: 'The same fifty runs and the same slips, with the check operator at every step.' },
    { t0: 31.7, t1: 35, text: 'Each caught slip cost a move. Expect about 79 in 100 — 39 of 50 take a bow.' },
  ],
  state: { guess: 25, plan: 'every' },
  controls: [
    { key: 'guess', type: 'commit', label: 'Stages still lit with no check (of 50)', min: 0, max: 50, step: 1, jump: 17.8, countdown: 3,
      hint: 'Commit before the district runs. Your call is chalked on the ruler.', format: v => Math.round(v) },
    { key: 'plan', type: 'select', label: 'Wield · where the check operator stands', options: [['every', 'every step'], ['mid', 'midway + end'], ['end', 'end only'], ['none', 'nowhere']],
      hint: 'Re-runs the second district on the same draws. A check at a gate re-stages the whole stretch since the last gate: those moves are made again.', jump: 26.6 },
  ],
  fonts: [],
  engine: ctx => Atelier.AgentLoop({ N: 50, k: 20, p: 0.95, c: 0.8, retry: 1, seed: ctx.seed }),

  setup(p, ctx) {
    const A = ctx.engine, T = ctx.tokens;
    const defs = BK.partDefs(ctx, [
      BK.stencilDef(BK.PID.title, [{ text: 'WHAT AN AI AGENT', size: 17, y: -3 }, { text: 'ACTUALLY DOES', size: 17, y: 16 }], 'Bodoni Moda', 156, 48, 7),
      BK.tagDef(BK.PID.tag0, 'PLAN', 'the model', T.copper, 'Instrument Sans'),
      BK.tagDef(BK.PID.tag1, 'ACT', 'the tools', T.slate, 'Instrument Sans'),
      BK.tagDef(BK.PID.tag2, 'CHECK', 'the harness', T.sage, 'Instrument Sans'),
      BK.boardDef('Gloock'),
      BK.chalkDef(BK.PID.card0, 196, 56, [{ text: 'Take the check operator away.', size: 14, y: -9, font: 'Instrument Sans', weight: 600 },
        { text: 'Of 50 stages, how many stay lit?', size: 12.5, y: 11, font: 'Instrument Sans' }]),
      BK.chalkDef(BK.PID.card1, 6, 18, Object.assign([], { strokes: [[0.4, -7, -0.4, 7]] })),
    ]);
    const atlas = BK.buildAtlas(p, ctx, defs);
    const G = { atlas, table: BK.makeTable(p, atlas.table) };
    G.props = BK.buildProps(p, atlas.table, [{ slot: 4, part: BK.PID.title }, { slot: 5, part: BK.PID.tag0 }, { slot: 6, part: BK.PID.tag1 }, { slot: 7, part: BK.PID.tag2 },
      { slot: 8, part: BK.PID.card0 }, { slot: 9, part: BK.PID.card1 }, { slot: 10, part: BK.PID.card1 }, { slot: 11, part: BK.PID.card1 },
      { rod: true, slot: 18 }, { rod: true, slot: 22 }, { rod: true, slot: 24 }, { rod: true, slot: 26 }, { rod: true, slot: 28 }, { rod: true, slot: 30 }]);
    const hero = heroRun(A);
    G.L = BK.district(A.N, hero, [10, 10, 10, 10, 10], 290, 300, 300);
    G.D = BK.makeData(p, A.N + 1);
    BK.initRender(p, G);
    G.hk = heroKnots(A, hero);
    ctx.G = G;
    ctx.layer('hud', { kind: 'p2d' });
  },

  draw(p, t, ctx) {
    const G = ctx.G, A = ctx.engine, U = ctx.U, L = G.L, D = G.D, S = BK.S;
    const plan = BK.PLANS[ctx.state.plan] ? ctx.state.plan : 'every';
    const hero = L.hero, F = L.origin(hero), rowH = L.rowOf[hero];
    const kn = G.hk;
    const heroM = tt => { if (tt <= kn[0][0]) return 0; for (let i = 1; i < kn.length; i++) if (tt <= kn[i][0]) return kn[i - 1][1] + (tt - kn[i - 1][0]) / (kn[i][0] - kn[i - 1][0]); return 20; };
    const heroT = m => { m = BK.clamp(m, 0, 20); const i = Math.min(19, Math.floor(m)); return kn[i][0] + (m - i) * (kn[i + 1][0] - kn[i][0]); };
    const OFF0 = 20.4, ON0 = 27.2, MV = 0.2;
    const W = worlds(G, A, U, plan);
    const district = t >= 17.8, onPhase = t >= 26.6;
    const crane = U.seg(t, 17.8, 20.4, 'inOut');
    // per-stage clocks: a caught move lasts two moves (the cost of the check)
    const clockOf = (t0, ev) => {
      const d = Array.from({ length: 20 }, (_, j) => (ev.some(e => e.step === j && e.kind === 'catch') ? 2 : 1));
      const acc = [0]; for (let j = 0; j < 20; j++) acc.push(acc[j] + d[j]);
      return { m: tt => { const g = (tt - t0) / MV; if (g <= 0) return 0; for (let j = 0; j < 20; j++) if (g < acc[j + 1]) return j + (g - acc[j]) / d[j]; return 20; },
        t: m => { m = BK.clamp(m, 0, 20); const j = Math.min(19, Math.floor(m)); return t0 + MV * (acc[j] + (m - j) * d[j]); }, end: t0 + MV * acc[20] };
    };
    const order = Array.from({ length: A.N }, (_, r) => r).sort((a, b) => L.rowOf[a] - L.rowOf[b]);
    const litOffList = order.filter(r => A.failStep.off[r] < 0), litOnList = order.filter(r => !W.finalFail(W.on[r]));
    const savedList = litOnList.filter(r => A.failStep.off[r] >= 0);
    const swOff = U.seg(t, 25.0, 26.2, 'linear'), swOn = U.seg(t, 31.8, 32.7, 'linear');
    const flashIn = (list, u, r) => { const i = list.indexOf(r); return i >= 0 && u * list.length - i > 0 ? 1 : 0; };
    const bow = U.seg(t, 33.0, 33.5, 'inOut') * (1 - U.seg(t, 33.9, 34.4, 'inOut')) + 0.8 * U.seg(t, 34.4, 34.7, 'inOut');
    for (let r = 0; r < A.N; r++) {
      const row = L.rowOf[r], o = L.origin(r);
      if (!district) {
        if (r === hero) {
          const fly = 260 * (1 - U.seg(t, 3.0, 4.4, 'settle'));
          const curtain = U.seg(t, 13.8, 14.5, 'inOut') * (1 - U.seg(t, 17.6, 18.3, 'inOut'));
          BK.writeStage(D, { row, origin: o, m: heroM(t), t, tOf: heroT, ev: BK.engineEvents(A, hero, 'on'), opA: U.seg(t, 3.9, 6.6, 'inOut'),
            rodA: U.seg(t, 4.6, 7.0, 'inOut'), caret: false, fly, pupA: t < 3.0 ? 0 : 1, curtain });
        } else BK.writeStage(D, { row, origin: o, m: 0, t, tOf: () => 0, ev: [], walk: false, light: 0, caret: false, curtain: 1 });
        continue;
      }
      const ev = onPhase ? W.on[r] : W.off[r];
      const clk = onPhase ? (plan === 'every' ? clockOf(ON0, ev) : clockOf(ON0, [])) : clockOf(OFF0, []);
      const reset = onPhase ? U.seg(t, 26.6, 27.1, 'inOut') : 1;
      const chkA = onPhase ? reset : (r === hero ? 1 - crane : 0);
      const offFail = A.failStep.off[r];
      const saved = onPhase && offFail >= 0 && !W.finalFail(ev) ? U.seg(clk.m(t), offFail + 0.6, offFail + 1.0, 'linear') : 0;
      const flash = onPhase ? 0 : flashIn(litOffList, swOff, r) * (1 - U.seg(t, 26.4, 26.6, 'inOut'));
      const wake = r === hero ? 1 : U.seg(t, 17.9, 19.6, 'inOut');
      const res = BK.writeStage(D, { row, origin: o, m: clk.m(t), t, tOf: clk.t, ev, chkA, caret: false, saved, flash,
        light: onPhase ? U.lerp(0.25, 1, reset) : wake, bow: onPhase && !W.finalFail(ev) ? bow : 0,
        curtain: onPhase ? (t < 27.1 ? 1 - reset : undefined) : (offFail < 0 ? Math.max(r !== hero ? 1 - wake : 0, U.seg(t, 26.0, 26.5, 'inOut')) : (r !== hero && t < 19.6 ? 1 - wake : undefined)) });
    }
    // props: title stencil, tags, the commit chalked on the featured stage's curtain, threads
    const PR = A.N; D.clearRow(PR); D.stage(PR, F[0], F[1], F[2], 1);
    const titleY = -84 - 210 * U.seg(t, 3.0, 4.2, 'exit') - 170 * (1 - U.seg(t, 0.0, 1.4, 'settle'));
    const titleA = t < 4.4 ? 1 : 0;
    D.card(PR, 4, 0, 0, titleY, 25, titleA, 1, 0, BK.PID.title);
    for (const sx of [-1, 1]) D.rod(PR, sx < 0 ? 22 : 24, [sx * 73, -320, 25], [sx * 73, titleY - 19.7, 25], [sx * 73, titleY - 19.7, 25], titleA, 0.35, 3);
    const tagIn = k => U.seg(t, 4.3 + k * 0.7, 5.0 + k * 0.7, 'settle') * (1 - U.seg(t, 7.4, 7.9, 'exit'));
    const tagPos = [[-52 - 62, -82], [-52 + 16, -86], [-52 - 52, 30]];
    for (let k = 0; k < 3; k++) {
      const u = tagIn(k), y = tagPos[k][1] - 150 * (1 - u), x = tagPos[k][0];
      D.card(PR, 5 + k, 0.03 * Math.sin(3 * t + k), x, y, 14, u > 0 ? 1 : 0, 1, 0, BK.PID.tag0 + k);
      D.rod(PR, [26, 28, 30][k], [x, -320, 14], [x, y - 7.6, 14], [x, y - 7.6, 14], u > 0 ? 1 : 0, 0.3, 3);
    }
    { const fl = 260 * (1 - U.seg(t, 3.0, 4.4, 'settle')), on = t >= 2.9 && t < 5.0 ? 1 - U.seg(t, 4.4, 5.0, 'inOut') : 0;
      D.rod(PR, 18, [S.xStep(0) - 3, -330, 0.5], [S.xStep(0) - 3, -66 - fl, 0.5], [S.xStep(0) - 3, -66 - fl, 0.5], on, 0.3, 3); }
    // the commit: chalked on the closed curtain; the countdown is three chalk strokes wiped off one by one
    const C = ctx.commit, cd = C ? C.countdown(t) : null;
    const qa = U.seg(t, 14.4, 14.9, 'inOut') * (1 - U.seg(t, 17.5, 17.9, 'inOut'));
    D.card(PR, 8, 0, 0, -42, S.prosZ - 2.4, qa, 1, 0, BK.PID.card0);
    for (let k = 0; k < 3; k++) {
      const gone = cd == null ? (t >= 17.8 ? 1 : 0) : (C.auto || C.committed ? U.seg(3 - cd, k + 0.6, k + 1.0, 'inOut') : 0);
      D.card(PR, 9 + k, 0.05, -14 + k * 14, 2, S.prosZ - 2.4, qa * (1 - gone), 1.6, 0, BK.PID.card1);
    }
    D.upload();
    // ── camera
    const hx = BK.S.xStep(Math.min(20, heroM(t)));
    const tc = kn[11][0] - (kn[11][0] - kn[10][0]) * 0.7;
    const perfU = U.seg(t, 7.8, 9.0, 'inOut') * (1 - U.seg(t, 13.3, 14.4, 'inOut'));
    const push = U.seg(t, tc - 1.0, tc - 0.25, 'inOut') * (1 - U.seg(t, tc + 0.9, tc + 1.6, 'inOut'));
    const drift = U.seg(t, 3.8, 7.8, 'inOut'), anat = drift * (1 - U.seg(t, 7.8, 9.0, 'inOut'));
    let eye = [F[0] - 6 - 34 * anat + perfU * hx * 0.45, -42 + 24 * anat + perfU * 6, 335 - 40 * anat - 55 * perfU];
    let tgt = [F[0] - 30 * anat + perfU * hx * 0.55, -42 + 24 * anat + perfU * 10, 0];
    eye = [U.lerp(eye[0], F[0] + hx + 22, push), U.lerp(eye[1], -26, push), U.lerp(eye[2], 150, push)];
    tgt = [U.lerp(tgt[0], F[0] + hx + 4, push), U.lerp(tgt[1], -24, push), U.lerp(tgt[2], 0, push)];
    const cmt = U.seg(t, 13.8, 14.6, 'inOut') * (1 - U.seg(t, 17.6, 18.4, 'inOut')); tgt[2] += 44 * cmt; tgt[1] += 10 * cmt; eye[1] += 10 * cmt;
    let fov = 30, K = 22;
    if (crane > 0) {   // crane up to the front row (the featured run, unchecked, falls at its slip), then the long lens on all fifty
      const mEye = [F[0] - 20, -60, 760], mTgt = [F[0] - 10, -10, -30];
      const dEye = [0, -1180, 6200], dTgt = [0, -330, -600], wide = U.seg(t, 23.2, 24.9, 'inOut'), lift = Math.sin(crane * Math.PI / 2);
      const e1 = [U.lerp(eye[0], mEye[0], crane), U.lerp(eye[1], mEye[1], lift), U.lerp(eye[2], mEye[2], crane)], t1 = tgt.map((v, i) => U.lerp(v, mTgt[i], crane));
      const ww = wide * wide * (3 - 2 * wide);
      eye = e1.map((v, i) => U.lerp(v, dEye[i], wide)); tgt = t1.map((v, i) => U.lerp(v, dTgt[i], ww));
      fov = U.lerp(U.lerp(30, 34, crane), 17.7, Math.pow(wide, 0.6)); K = U.lerp(U.lerp(22, 16, crane), 5, wide);
    }
    const house = district ? U.lerp(0.06, 0.34, U.seg(t, 23.2, 24.9, 'inOut')) + 0.45 * U.seg(t, 32.8, 33.6, 'inOut') : 0.05;
    BK.render(p, ctx, G, { eye, tgt, fov, K, house, light: { pos: S.light, aim: S.aim, R: S.lightR }, ranges: L.ranges, props: G.props, propsRow: PR,
      title: titleA > 0 ? [BK.PID.title, 0, titleY, 25] : null, titleRow: rowH });
    hud(p, t, ctx, W, litOffList.length, savedList.length, litOnList.length, swOff, swOn, plan);
  },

  score(ctx) {
    const A = ctx.engine, ev = [];
    ev.push({ t: 0.35, kind: 'tone', freq: 147, dur: 1.6, gain: 0.7 });
    for (let k = 0; k < 3; k++) ev.push({ t: 4.3 + k * 0.7, kind: 'click', freq: [880, 660, 990][k], gain: 0.35 });
    const h = heroRun(A), kn = heroKnots(A, h), slips = A.events(h, 'on').map(e => e.step);
    for (let j = 0; j < 20; j++) {
      const t0 = kn[j][0], dur = kn[j + 1][0] - t0;
      ev.push({ t: t0 + 0.02, kind: 'tick', freq: 2100, gain: 0.5 });
      if (slips.includes(j)) { ev.push({ t: t0 + dur * 0.3, kind: 'clack', gain: 0.8, freq: 170 }); ev.push({ t: t0 + dur * 0.32, kind: 'click', gain: 0.6, freq: 1320 }); ev.push({ t: t0 + dur * 0.7, kind: 'tick', freq: 1500, gain: 0.45 }); }
    }
    for (let k = 0; k < 3; k++) ev.push({ t: 14.8 + k * 1.0 + 0.6, kind: 'tick', freq: 700, gain: 0.35 });
    for (let j = 0; j < 20; j++) {
      const t = 20.4 + j * 0.2; ev.push({ t: t + 0.01, kind: 'tick', freq: 2100, gain: 0.3 });
      const n = A.failedAt('off', j); if (n) ev.push({ t: t + 0.12, kind: 'clack', gain: Math.min(1.2, 0.35 + n * 0.22), freq: 150, pan: -0.2 });
    }
    for (let j = 0; j < 22; j++) ev.push({ t: 27.2 + j * 0.2 + 0.01, kind: 'tick', freq: 2100, gain: 0.26 });
    for (let j = 0; j < 20; j++) { let caught = 0; for (let r = 0; r < A.N; r++) if (A.slip(r, j) && A.retryOk(r, j) && A.alive(r, 'on', j)) caught++; if (caught) ev.push({ t: 27.2 + j * 0.2 + 0.4, kind: 'click', gain: Math.min(1, 0.25 + caught * 0.12), freq: 1320, pan: 0.2 }); }
    const offN = A.survivors.off[20], onN = A.survivors.on[20];
    for (let i = 0; i < offN; i++) ev.push({ t: 25.0 + 1.2 * i / offN, kind: 'tick', freq: 900, gain: 0.28 });
    for (let i = 0; i < onN - offN; i++) ev.push({ t: 31.8 + 0.9 * i / Math.max(1, onN - offN), kind: 'tick', freq: 1100, gain: 0.24 });
    ev.push({ t: 33.0, kind: 'tone', freq: 196, dur: 1.6, gain: 0.5 }); ev.push({ t: 33.02, kind: 'tone', freq: 294, dur: 1.5, gain: 0.35 });
    ev.push({ t: 34.4, kind: 'tone', freq: 247, dur: 0.6, gain: 0.3 });
    return ev;
  },

  meta(ctx) {
    const A = ctx.engine;
    return [
      { label: 'Stages lit · no check', value: A.survivors.off[20], check: { world: 'off', k: 20, N: 50 } },
      { label: 'Stages lit · check every step', value: A.survivors.on[20], check: { world: 'on', k: 20, N: 50 } },
      { label: 'Runs the check saved', value: A.saved.length },
      { label: 'Moves made again (every step)', value: Array.from({ length: A.N }, (_, r) => A.events(r, 'on').filter(e => e.caught && e.retryOk).length).reduce((a, b) => a + b, 0) },
    ];
  },
});

/* the featured run: a saved run with exactly one caught slip, nearest the middle of the plank (illustrative only) */
function heroRun(A) {
  let hero = 0, best = 99;
  for (let r = 0; r < A.N; r++) { const e = A.events(r, 'on'); if (A.failStep.on[r] < 0 && e.length === 1 && Math.abs(e[0].step - 10) < best) { best = Math.abs(e[0].step - 10); hero = r; } }
  return hero;
}
/* its clock: 0.18 s a move; the caught move (slip, catch, made again) held for 2.6 s */
function heroKnots(A, hero) {
  const slips = A.events(hero, 'on').map(e => e.step), kn = [[7.9, 0]]; let tt = 7.9;
  for (let j = 0; j < 20; j++) { tt += slips.includes(j) ? 2.6 : 0.17; kn.push([tt, j + 1]); }
  return kn;
}
function worlds(G, A, U, plan) {
  if (G.worlds && G.worlds.plan === plan) return G.worlds;
  const P = A.params, W = { plan, off: [], on: [], redo: 0 };
  const finalFail = ev => ev.filter(e => e.kind === 'fall').length > ev.filter(e => e.kind === 'restore').length;
  for (let r = 0; r < A.N; r++) {
    W.off.push(BK.engineEvents(A, r, 'off'));
    if (plan === 'every') { W.on.push(BK.engineEvents(A, r, 'on')); W.redo += A.events(r, 'on').filter(e => e.caught).length; }
    else { const g = BK.gateRun(U, P, r, BK.PLANS[plan].gates); W.on.push(g.ev); W.redo += g.redo; }
  }
  W.finalFail = finalFail;
  W.expOn = A.N * BK.gateExact(P, BK.PLANS[plan].gates); W.sdOn = Math.sqrt(W.expOn * (1 - W.expOn / A.N));
  G.worlds = W;
  return W;
}
/* the house's own apron board: a chalk ruler 0–50 where every stroke is one lit stage; expectations are notches on it;
   the moves made again are short peach strokes beside it (the cost) */
function hud(p, t, ctx, W, nOff, nSaved, nOn, swOff, swOn, plan) {
  const U = ctx.U, A = ctx.engine, H = ctx.layer('hud'); H.clear();
  const a = U.seg(t, 24.6, 25.0, 'inOut');
  if (a <= 0) return;
  const g = H.drawingContext;
  g.save(); g.globalAlpha = a;
  const grd = g.createLinearGradient(0, 432, 0, 540); grd.addColorStop(0, 'rgba(9,8,7,0)'); grd.addColorStop(0.18, 'rgba(9,8,7,0.95)'); grd.addColorStop(1, 'rgba(6,5,5,1)');
  g.fillStyle = grd; g.fillRect(0, 432, 960, 108);
  g.fillStyle = 'rgba(214,201,176,0.85)'; g.fillRect(0, 446, 960, 3.2);          // the apron's paper lip
  g.restore();
  const ink = '#EDE8DC', sage = '#A9C69B', peach = '#E09A6D';
  const X0 = 96, X1 = 852, xs = v => X0 + (X1 - X0) * v / 50, base = 500;
  BK.chalk(H, U, c => {
    c.globalAlpha = a; c.lineCap = 'round';
    c.strokeStyle = ink; c.lineWidth = 2; c.beginPath(); c.moveTo(X0, base); c.lineTo(X1, base); c.stroke();
    for (let v = 0; v <= 50; v += 5) { c.lineWidth = v % 25 === 0 ? 2.2 : 1.4; c.beginPath(); c.moveTo(xs(v), base); c.lineTo(xs(v), base + (v % 25 === 0 ? 9 : 5)); c.stroke(); }
    c.fillStyle = ink; c.font = '400 15px "Instrument Sans"'; c.textAlign = 'center';
    for (const v of [0, 50]) c.fillText(String(v), xs(v), base + 25);
    const stroke = (i, col, k) => { c.strokeStyle = col; c.lineWidth = 2.6; const x = xs(i + 0.5) + (U.h(41, i, k) - 0.5) * 2; c.beginPath(); c.moveTo(x, base - 6); c.lineTo(x + 1.5, base - 34 - (U.h(42, i, k) - 0.5) * 4); c.stroke(); };
    const n1 = Math.floor(swOff * nOff + 1e-6);
    for (let i = 0; i < n1; i++) stroke(i, ink, 1);
    const n2 = Math.floor(swOn * (nOn - nOff) + 1e-6);
    for (let i = 0; i < n2; i++) stroke(nOff + i, sage, 2);
    c.textAlign = 'right'; c.font = '400 30px "Gloock"';
    if (n1 > 0) { c.fillStyle = ink; c.fillText(String(n1), 80, 486); }
    if (t >= 31.8) { c.fillStyle = sage; c.fillText(String(nOff + n2), 80, 526); }
    // expectations: a notch under the rail with a ±1 sd bracket, read off the same ruler
    const notch = (e, sd, col, u) => { if (u <= 0) return; c.globalAlpha = a * u; c.strokeStyle = col; c.fillStyle = col; c.lineWidth = 1.6;
      c.beginPath(); c.moveTo(xs(e), base + 3); c.lineTo(xs(e) - 5, base + 12); c.lineTo(xs(e) + 5, base + 12); c.closePath(); c.fill();
      c.beginPath(); c.moveTo(xs(e - sd), base + 15); c.lineTo(xs(e + sd), base + 15); c.stroke(); c.globalAlpha = a; };
    notch(A.expected.off[20], A.sd.off[20], ink, U.seg(t, 26.2, 26.6, 'inOut'));
    notch(W.expOn, W.sdOn, sage, U.seg(t, 32.7, 33.1, 'inOut'));
    if (t >= 26.2) { c.globalAlpha = a * U.seg(t, 26.2, 26.6, 'inOut'); c.fillStyle = ink; c.font = '400 14px "Instrument Sans"'; c.textAlign = 'right'; c.textAlign = 'center'; c.fillText('▲ expected', xs(25), 534); }
    // the cost: one short peach stroke per move made again, in the margin under the rail's left end
    const redoShown = Math.floor(W.redo * U.seg(t, 27.4, 31.6, 'linear') + 1e-6);
    if (t >= 27.2) {
      c.globalAlpha = a; c.strokeStyle = peach; c.lineWidth = 1.8;
      for (let i = 0; i < redoShown; i++) { const x = 880 + (i % 12) * 6, y = 462 + Math.floor(i / 12) * 13; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 0.8, y + 10); c.stroke(); }
      c.fillStyle = peach; c.font = '400 14px "Instrument Sans"'; c.textAlign = 'right'; c.fillText('made again', 952, 532);
    }
    if (ctx.mode === 'live' && ctx.commit && ctx.commit.committed) {
      const v = Math.round(ctx.commit.value); c.globalAlpha = a; c.strokeStyle = peach; c.fillStyle = peach; c.lineWidth = 2;
      c.beginPath(); c.moveTo(xs(v), base - 46); c.lineTo(xs(v) - 6, base - 56); c.lineTo(xs(v) + 6, base - 56); c.closePath(); c.fill();
      c.font = '400 14px "Instrument Sans"'; c.textAlign = 'center'; c.fillText('your call', xs(v), base - 60);
    }
  });
  p.push(); p.resetShader(); p.noLights(); p.camera(); p.perspective(); p.clearDepth(); p.imageMode(p.CORNER); p.image(H, -480, -270, 960, 540); p.pop();
}
