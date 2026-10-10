/* THE MARGIN · shared film — "What an AI agent actually does" (glance) · revision 1.
   One notebook page. Fifty agent runs are written as fifty full-width lines, longest first: one line = one run, one
   loop = one step; where a run slips the pen lifts mid-loop and a peach × marks the address. The ends of the lines
   ARE the survival curve: the author's copper pencil traces the envelope through them, over the dashed exact
   curve 50·0.95^j, and carries it to a ruler in the margin where the viewer's own pencil mark is waiting.
   Twin worlds in ONE object (common random numbers make it exact): a run is identical in both worlds up to its
   first slip, so the check's world is drawn as the same line carried on — the slip ringed in sage, the step done
   twice (a doubled loop), the line written onward. Every doubled loop pushes the line further right: the check's
   cost is the overrun past the finish. */
Atelier.film({
  id: 'margin-shared',
  title: 'The Margin — what an AI agent actually does',
  direction: 'E · The Margin · field notebook',
  level: 'glance',
  duration: 34.5,
  size: [960, 540],
  renderer: 'p2d',
  fps: 30,
  seed: 1,
  ground: '#DCE4D6',
  chapters: [
    { t: 0, label: 'The loop' }, { t: 4.5, label: 'Your mark' }, { t: 10.0, label: '50 runs' }, { t: 14.7, label: 'The curve' },
    { t: 19.6, label: 'Add a check' }, { t: 24.3, label: 'Same runs, checked' }, { t: 32, label: 'The price' },
  ],
  captions: [
    { t0: 0.2, t1: 4.5, text: 'An AI agent works in a loop: plan, act, observe, check. One loop is one step.' },
    { t0: 4.5, t1: 7.0, text: 'A job takes 20 steps, and each step goes right 95% of the time.' },
    { t0: 7.0, t1: 10.0, text: 'Before the pen runs: what share of runs will finish? Mark it on the ruler.' },
    { t0: 10.0, t1: 14.7, text: 'Fifty runs, one line each, longest first. Where a line stops, that step slipped.' },
    { t0: 14.7, t1: 19.6, text: 'The line ends trace the curve: about 36% of runs make it to the end.' },
    { t0: 19.6, t1: 24.3, text: 'Now a check after every step catches 4 slips in 5 and redoes the step. Guess again.' },
    { t0: 24.3, t1: 29.4, text: 'Same runs, same slips. Each sage ring is a slip the check caught; the line carries on.' },
    { t0: 29.4, t1: 32.0, text: 'About 79% now. Compare your pencil mark with where the curve lands.' },
    { t0: 32.0, t1: 34.5, text: 'Each redo costs time: the lines run past the finish. The check is not free.' },
  ],
  state: { guess1: 75, guess2: 90 },
  controls: [
    { key: 'guess1', type: 'commit', label: 'Share of runs that finish, no check (%)', min: 0, max: 100, step: 1, jump: 10.0, countdown: 3,
      hint: '20 steps, each right 95 %. Your pencil marks it on the ruler.', format: v => Math.round(v) + ' %' },
    { key: 'guess2', type: 'commit', label: 'With a check after every step (%)', min: 0, max: 100, step: 1, jump: 24.3, countdown: 3,
      hint: 'The check catches 4 of 5 slips and redoes the step once.', format: v => Math.round(v) + ' %' },
  ],
  engine: ctx => {
    if (ctx.mode === 'live' && ctx.state.guess1$committed) Margin.storeGuess(ctx.state.guess1);
    return Atelier.AgentLoop({ N: 50, k: 20, p: 0.95, c: 0.8, retry: 1, seed: ctx.seed });
  },

  setup(p, ctx) {
    ctx.page = Margin.Page(p, ctx, { seed: ctx.seed, marginX: 792 });
  },
  draw(p, t, ctx) {
    const P = plan(ctx);
    ctx.page.use(P.pl).draw(t, Margin.camera(P.cam, t));
  },
  score(ctx) {
    const P = plan(ctx), ev = Margin.scratchScore(P.pl, { skip: s => s.tag === 'row' });
    P.rowT.forEach(rt => ev.push({ t: rt, kind: 'tick', freq: 4600, gain: 0.5, pan: -0.2 }));
    P.marks.forEach(m => ev.push(Object.assign({ gain: 0.5 }, m)));
    return ev;
  },
  meta(ctx) {
    const A = ctx.engine, g1 = Math.round(ctx.state.guess1), g2 = Math.round(ctx.state.guess2);
    return [
      { label: 'Runs that finish · no check (of 50)', value: A.survivors.off[20], check: { world: 'off', k: 20, p: 0.95, c: 0.8, N: 50 } },
      { label: 'Runs that finish · with check (of 50)', value: A.survivors.on[20], check: { world: 'on', k: 20, p: 0.95, c: 0.8, N: 50 } },
      { label: 'Expected share · 0.95^20', value: A.exact.off[20], check: { world: 'off', k: 20, p: 0.95, c: 0.8 } },
      { label: 'Expected share · 0.988^20', value: A.exact.on[20], check: { world: 'on', k: 20, p: 0.95, c: 0.8 } },
      { label: 'Runs the check saved', value: A.saved.length },
      { label: 'Steps done twice (the price)', value: plan(ctx).redos },
      { label: 'Your gap 1 (points)', value: g1 - Math.round(100 * A.exact.off[20]) },
      { label: 'Your gap 2 (points)', value: g2 - Math.round(100 * A.exact.on[20]) },
    ];
  },
});

/* ── the page plan: every stroke of the film, from (state, seed, engine) ── */
function plan(ctx) {
  const g1 = Math.round(ctx.state.guess1), g2 = Math.round(ctx.state.guess2), key = ctx.seed + '|' + g1 + '|' + g2 + '|' + ctx.mode;
  ctx.plans = ctx.plans || new Map();
  if (ctx.plans.has(key)) return ctx.plans.get(key);
  const A = ctx.engine, Gs = Margin.G, W = Margin.Writer(ctx.seed), film = ctx.mode === 'film';
  const C1 = ctx.commits.guess1, C2 = ctx.commits.guess2, marks = [], rowT = [];
  const K = 20, N = 50, top = 124, rh = 7, x0 = 70, dx = 32.5, xf = x0 + K * dx, RX = 836, RH = N * rh;
  const ry = pct => top + pct / 100 * RH;

  // title + the loop, once, large: one loop = one step
  const ti = W.text('A', 'ink', 'What an AI agent actually does', 64, 46, 12.5, { t0: 0.3, dur: 1.9, maxW: 560 });
  W.marks('ink', Gs.underline(62, ti.x1 + 4, 54, 3), 8, { t0: 2.25, dur: 0.25 });
  const lc = { x: 872, y: 60, r: 22 };
  const big = Gs.row({ x0: lc.x - 0.72 * 70, yb: lc.y + lc.r, dx: 70, a: lc.r, seed: 5, from: 0, to: 1, k: 1 });
  W.marks('ink', [big.path], 9, { t0: 2.75, dur: 0.55 });
  W.text('A', 'ink', 'plan', lc.x - 12, lc.y - lc.r - 7, 6.6, { t0: 3.35, dur: 0.18 });
  W.text('A', 'ink', 'act', lc.x + lc.r + 7, lc.y + 2, 6.6, { t0: 3.55, dur: 0.14 });
  W.text('A', 'ink', 'observe', lc.x - 22, lc.y + lc.r + 16, 6.6, { t0: 3.72, dur: 0.26 });
  const ck = W.text('A', 'ink', 'check', lc.x - lc.r - 40, lc.y - 12, 6.6, { t0: 4.0, dur: 0.2 });
  W.marks('sage', Gs.underline(lc.x - lc.r - 42, ck.x1 + 1, lc.y - 8, 9), 6, { t0: 4.22, dur: 0.12 });
  W.text('A', 'ink', '1 loop = 1 step', 806, 112, 6.2, { t0: 4.38, dur: 0.3 });

  // question 1, the finish line and the ruler (structure in the author's slate pencil; the ruler in ink)
  W.text('A', 'ink', '20 steps, each right 95% of the time.', 64, 80, 8, { t0: 4.75, dur: 0.85, maxW: 380 });
  W.text('A', 'ink', 'What share of runs finish?', 64, 102, 8, { t0: 5.65, dur: 0.6, maxW: 380 });
  W.marks('slate', Gs.line(xf + 1, top - 8, xf + 1, top + RH + 6, 71, 0.3), 6, { t0: 6.3, dur: 0.25 });
  W.text('A', 'ink', 'end', xf - 8, top + RH + 18, 6, { t0: 6.56, dur: 0.12 });
  W.marks('ink', Gs.line(RX, top, RX, top + RH, 72, 0.25), 6, { t0: 6.7, dur: 0.22 });
  const tks = []; for (let q = 0; q <= 10; q++) tks.push([RX - (q % 5 ? 2.5 : 4.5), ry(q * 10), RX + (q % 5 ? 2.5 : 4.5), ry(q * 10) + 0.2]);
  W.marks('ink', tks, 5, { t0: 6.93, dur: 0.18 });
  W.text('A', 'ink', '0%', RX + 7, ry(0) + 3, 5.4, { t0: 7.12, dur: 0.06 });
  W.text('A', 'ink', '100%', RX + 7, ry(100) + 3, 5.4, { t0: 7.2, dur: 0.1 });

  // the commit beat as a pencil act: the viewer's pencil taps the margin three times (one per second), then marks
  const commitAct = (C, g, i) => {
    for (let q = 0; q < 3; q++) {
      const tx = RX + 44 + q * 6, ty = top + 70 + i * 140;
      W.marks('graphite', [[tx, ty - 3.5, tx + 0.8, ty + 3.5]], 6, { t0: C.hold + 0.15 + q, dur: 0.05, tag: 'tap' });
      marks.push({ t: C.hold + 0.15 + q, kind: 'tick', freq: 1500, gain: 0.55 });
    }
    const y = ry(g);
    W.marks('graphite', [[RX - 9, y + 0.6, RX + 9, y - 0.6]], 7, { t0: C.jump, dur: 0.1, tag: 'guess' });
    const gt = W.text('B', 'graphite', g + '%', RX + 14, y + 4, 8.5, { t0: C.jump + 0.12, dur: 0.38, slant: -0.3, tag: 'guess' });
    if (film) W.text('B', 'graphite', 'a sample guess', RX + 14, y + 15, 4.4, { t0: C.jump + 0.52, dur: 0.16, slant: -0.3 });
    marks.push({ t: C.jump, kind: 'tick', freq: 1200, gain: 0.7 });
  };
  commitAct(C1, g1, 0);

  // fifty runs, one line each, longest first (rows are sorted by how far the run got without a check)
  const order = Array.from({ length: N }, (_, r) => r).sort((a, b) => {
    const fa = A.failStep.off[a] < 0 ? K : A.failStep.off[a], fb = A.failStep.off[b] < 0 ? K : A.failStep.off[b]; return fb - fa || a - b; });
  const rows = order.map((r, i) => ({ r, i, yb: top + i * rh + 5.6, f: A.failStep.off[r], fOn: A.failStep.on[r] }));
  const t0 = 10.6, t1 = 14.6;
  const p1x = [];
  rows.forEach(R => {
    const to = R.f < 0 ? K : R.f;
    const L = Gs.row({ x0, yb: R.yb, dx, a: 2.5, seed: 1000 + R.r, from: 0, to, k: K, stumbleAt: R.f < 0 ? null : R.f });
    R.geo = L;
    const ta = t0 + (t1 - t0) * Math.pow(R.i / N, 0.6), tb = t0 + (t1 - t0) * Math.pow((R.i + 1) / N, 0.6);
    W.marks('ink', [L.path], 5, { t0: ta, dur: (tb - ta) * 0.92, tag: 'row', thirst: 0.45, weight: 1.7 });
    rowT.push(ta);
    if (R.f >= 0) p1x.push(...Gs.cross(L.end.x + 0.5, L.end.y + 0.3, 5.6, 300 + R.r));
  });
  W.marks('peach', p1x, 6, { t0: 14.68, dur: 0.45, tag: 'x' });
  marks.push({ t: 14.68, kind: 'clack', gain: 0.75, pan: -0.2 });

  // the envelope: a staircase through the line ends, the dashed exact curve under it, carried to the ruler
  const stair = (S, lift) => {
    const pts = [x0 - 8, top + S[0] * rh - lift];
    for (let j = 0; j < K; j++) { const x = x0 + (j + 0.72) * dx, y0 = top + S[j] * rh - lift, y1 = top + S[j + 1] * rh - lift; pts.push(x - 2, y0, x + 2, y1); }
    pts.push(xf + 2, top + S[K] * rh - lift); return pts;
  };
  const exactPts = q => { const o = []; for (let j = 0; j <= K; j++) o.push(j === 0 ? x0 - 8 : x0 + (j - 0.28) * dx, top + N * Math.pow(q, j) * rh); o.push(xf + 2, top + N * Math.pow(q, K) * rh); return o; };
  const result = (w, tool, tA, gNum, i) => {
    const S = A.survivors[w], q = w === 'off' ? 0.95 : A.pPrime, E = A.exact[w][K], pc = Math.round(100 * E), y = ry(100 * E), yr = top + S[K] * rh - 1.2;
    W.marks(tool, [stair(S, 1.2)], 7, { t0: tA, dur: 0.7, tag: 'envelope', weight: 1.25 });
    W.marks(tool, Gs.dashes(exactPts(q), 4, 4), 5, { t0: tA + 0.72, dur: 0.4, alpha: 0.75 });
    W.marks(tool, Gs.dashes([xf + 4, yr, RX - 6, yr], 2.5, 3), 5, { t0: tA + 1.15, dur: 0.18 });
    W.marks(tool, [[RX - 6, y, RX + 6, y]], 7, { t0: tA + 1.35, dur: 0.08, weight: 1.4 });
    // the truth sits left of the ruler, on the leader; the viewer's pencil mark sits right of it
    const vx = RX - 14 - Margin.plainWidth('A', pc + '%', 10), v = W.text('A', 'ink', pc + '%', vx, y - 2, 10, { t0: tA + 1.45, dur: 0.42, dip: true, weight: 1.1 });
    W.marks(tool, Gs.ring((vx + v.x1) / 2, y - 7, (v.x1 - vx) / 2 + 7, 12, 61 + i), 6, { t0: tA + 1.9, dur: 0.22, tag: 'ring' });
    // this run's realised count lands as a dot where the staircase meets the ruler, beside the expected tick
    W.marks(tool, [[RX - 1.2, yr - 0.6, RX + 1, yr + 0.8, RX - 0.8, yr + 0.5, RX + 0.6, yr - 0.7]], 7, { t0: tA + 2.15, dur: 0.06, weight: 2.4 });
    const gap = Math.abs(gNum - pc);
    if (gap >= 3) {
      const ya = ry(Math.min(gNum, pc)) + 2, yb = ry(Math.max(gNum, pc)) - 2;
      W.marks('peach', [[RX + 5, ya, RX + 8, ya + 1, RX + 8, yb - 1, RX + 5, yb]], 6, { t0: tA + 2.5, dur: 0.22, tag: 'gap' });
    }
    marks.push({ t: tA + 1.45, kind: 'tone', freq: w === 'off' ? 392 : 523, dur: 1.2, gain: 0.55 });
  };
  result('off', 'copper', 15.2, g1, 0);

  // question 2 → commit 2 → the same lines carried on by the check
  W.text('A', 'ink', 'Add a check after every step: it catches', 440, 80, 7.6, { t0: 19.75, dur: 0.85, maxW: 340 });
  W.text('A', 'ink', '4 slips in 5 and redoes the step. Now?', 440, 102, 7.6, { t0: 20.65, dur: 0.7, maxW: 340 });
  commitAct(C2, g2, 1);
  const cont = rows.filter(R => R.f >= 0 && R.fOn !== R.f);
  const u0 = 24.9, u1 = 28.3, rings = [], p2x = [];
  let redos = 0;
  cont.forEach((R, ci) => {
    const retries = new Set(); for (let j = R.f; j < K; j++) if (A.slip(R.r, j) && A.retryOk(R.r, j) && A.alive(R.r, 'on', j)) retries.add(j);
    const fOn = R.fOn, failRetryAt = fOn >= 0 && A.caught(R.r, fOn) ? fOn : null;
    const L = Gs.row({ x0, yb: R.yb, dx, a: 2.5, seed: 1000 + R.r, from: R.f, resume: true, to: fOn < 0 ? K : fOn, k: K, stumbleAt: fOn < 0 ? null : fOn, retries, failRetryAt });
    const ta = u0 + (u1 - u0) * Math.pow(ci / cont.length, 0.65), tb = u0 + (u1 - u0) * Math.pow((ci + 1) / cont.length, 0.65);
    W.marks('ink', [L.path], 5, { t0: ta, dur: (tb - ta) * 0.92, tag: 'row', thirst: 0.45, weight: 1.7 });
    rowT.push(ta);
    for (const j of retries) rings.push(...Gs.ring(L.pos(j) + 4.5, R.yb - 2.6, 9.5, 4.6, 500 + R.r * 20 + j, 1.05));
    if (failRetryAt != null) rings.push(...Gs.ring(L.pos(fOn) + 4.5, R.yb - 2.6, 9.5, 4.6, 900 + R.r, 1.05));
    if (fOn >= 0) p2x.push(...Gs.cross(L.end.x + 0.5, L.end.y + 0.3, 5.6, 600 + R.r));
  });
  rows.forEach(R => { for (let j = 0; j < K; j++) if (A.slip(R.r, j) && A.retryOk(R.r, j) && A.alive(R.r, 'on', j)) redos++; });
  W.marks('sage', rings, 5, { t0: 28.35, dur: 0.5, tag: 'caught' });
  marks.push({ t: 28.35, kind: 'click', gain: 0.85, freq: 2093, pan: 0.1 });
  if (p2x.length) { W.marks('peach', p2x, 6, { t0: 28.9, dur: 0.2, tag: 'x' }); marks.push({ t: 28.9, kind: 'clack', gain: 0.5 }); }
  result('on', 'sage', 29.2, g2, 1);

  // the price: one gate per step done twice
  const gates = Gs.gates(redos, 72, 516, 10, 88, 3.4);
  W.marks('sage', gates, 6, { t0: 32.05, dur: 0.6 });
  const gx = 72 + Math.ceil(redos / 5) * 20 + 10;
  W.text('A', 'ink', 'steps done twice: the price of the check', gx, 516, 7.4, { t0: 32.7, dur: 0.9 });
  marks.push({ t: 32.05, kind: 'click', gain: 0.4, freq: 1568 });

  const pl = W.build();
  const cam = [
    { t: 0, x: 330, y: 70, z: 1.8 }, { t: 2.35, x: 340, y: 70, z: 1.75 }, { t: 2.85, x: 820, y: 82, z: 1.8 }, { t: 4.4, x: 820, y: 82, z: 1.8 },
    { t: 4.9, x: 260, y: 92, z: 1.7 }, { t: 6.1, x: 270, y: 92, z: 1.7 }, { t: 6.9, x: 503, y: 240, z: 1.05 }, { t: 9.9, x: 503, y: 245, z: 1.05 },
    { t: 11.2, x: 480, y: 270, z: 1.0 }, { t: 14.9, x: 480, y: 270, z: 1.0 }, { t: 16.2, x: 700, y: 250, z: 1.42 }, { t: 19.4, x: 705, y: 250, z: 1.42 },
    { t: 20.0, x: 600, y: 92, z: 1.6 }, { t: 21.2, x: 610, y: 92, z: 1.6 }, { t: 22.0, x: 503, y: 245, z: 1.05 }, { t: 24.4, x: 503, y: 250, z: 1.05 },
    { t: 25.2, x: 480, y: 270, z: 1.0 }, { t: 29.3, x: 480, y: 270, z: 1.0 }, { t: 30.3, x: 700, y: 360, z: 1.42 }, { t: 31.9, x: 705, y: 360, z: 1.42 },
    { t: 32.5, x: 330, y: 440, z: 1.3 }, { t: 33.5, x: 330, y: 440, z: 1.3 }, { t: 34.4, x: 480, y: 270, z: 1.0 },
  ];
  const P = { pl, cam, marks, rowT, redos };
  ctx.plans.set(key, P);
  return P;
}
