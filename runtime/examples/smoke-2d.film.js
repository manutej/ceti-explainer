/* smoke-2d — Canvas2D runtime test (plain on purpose).
   Twin worlds, 2 × 200 run columns × 20 steps. A column grows one cell per step; a failed run stops at its step
   (peach cell = the address of the failure). The 'on' world shares every random draw; a sage cell marks a slip
   the check caught and retried. Counters are read from the marks. One commit control (predict → commit → reveal). */
Atelier.film({
  id: 'smoke-2d',
  title: 'Smoke 2D — twin worlds, counted from the marks',
  direction: 'Runtime test · Canvas2D',
  level: 'glance',
  duration: 12,
  size: [960, 540],
  renderer: 'p2d',
  fps: 30,
  seed: 1,
  chapters: [{ t: 0, label: 'Setup' }, { t: 1.5, label: 'Your guess' }, { t: 4.5, label: 'Run' }, { t: 10.5, label: 'Count' }],
  captions: [
    { t0: 0.2, t1: 1.5, text: '200 agent runs, 20 steps each, every step right 95 % of the time.' },
    { t0: 1.5, t1: 4.5, text: 'Before it runs: how many of the 200 finish all 20 steps without checks?' },
    { t0: 4.5, t1: 10.5, text: 'Same random draws in both worlds. Below, a check catches 80 % of slips and retries once.' },
    { t0: 10.5, t1: 12, text: 'Count the full columns: the check saved the runs that end in sage.' },
  ],
  state: { guess: 100 },
  controls: [
    { key: 'guess', type: 'commit', label: 'Full runs, checks off (of 200)', min: 0, max: 200, step: 1, jump: 4.5, countdown: 3,
      hint: 'Commit before the run plays.', format: v => Math.round(v) },
  ],
  engine: ctx => Atelier.AgentLoop({ N: 200, k: 20, p: 0.95, c: 0.8, retry: 1, seed: ctx.seed }),

  setup(p, ctx) {
    p.textFont('DM Sans');
    const N = 200, k = 20, x0 = 60, x1 = 900, cw = (x1 - x0) / N, ch = 7.6;
    ctx.L = { N, k, x0, cw, ch, top: { y: 128, w: 'off' }, bot: { y: 338, w: 'on' } };
  },

  draw(p, t, ctx) {
    const { U, tokens: T, engine: A, L } = ctx;
    const s = 20 * U.seg(t, 4.5, 10.5, 'linear');          // steps completed (continuous)
    const sFull = Math.floor(s + 1e-9);
    const count = { off: 0, on: 0 };
    for (const P of [L.top, L.bot]) {
      p.noStroke(); p.fill(T.panel); p.rect(L.x0 - 8, P.y - 8, L.N * L.cw + 16, L.k * L.ch + 16, 4);
      for (let r = 0; r < L.N; r++) {
        const f = A.failStep[P.w][r], x = L.x0 + r * L.cw;
        const grown = f < 0 ? sFull : Math.min(sFull, f);   // healthy cells drawn
        p.fill(T.copper);
        if (grown > 0) p.rect(x, P.y, L.cw - 1, grown * L.ch - 1);
        if (P.w === 'on') for (let j = 0; j < grown; j++) if (A.slip(r, j)) { p.fill(T.sage); p.rect(x, P.y + j * L.ch, L.cw - 1, L.ch - 1); }
        if (f >= 0 && sFull > f) { p.fill(T.peach); p.rect(x, P.y + f * L.ch, L.cw - 1, L.ch - 1); }
        if (grown >= L.k) count[P.w]++;                      // the counter is read from the marks
      }
    }
    // labels + counters
    p.fill(T.ink); p.textSize(15); p.textAlign(p.LEFT, p.BASELINE);
    p.text('Checks off', L.x0, L.top.y - 16); p.text('Checks on · catch 80 %, retry once', L.x0, L.bot.y - 16);
    p.textFont('Space Mono'); p.textSize(13); p.textAlign(p.RIGHT, p.BASELINE); p.fill(T.dim);
    p.text('step ' + U.tabular(sFull, 2) + ' / 20', 900, L.top.y - 16);
    p.textAlign(p.LEFT, p.CENTER); p.textSize(22);
    if (s > 0) {
      p.fill(T.copper); p.text(U.tabular(count.off, 3), 912, L.top.y + 76);
      p.fill(T.sage); p.text(U.tabular(count.on, 3), 912, L.bot.y + 76);
    }
    // the commit beat (countdown drawn by the film itself) and the guess
    const C = ctx.commit, cd = C.countdown(t);
    p.textFont('DM Sans'); p.textAlign(p.CENTER, p.CENTER);
    if (cd !== null) {
      p.fill(T.ink); p.textSize(26); p.text('How many of 200 finish all 20 steps, checks off?', 480, 52);
      p.fill(T.dim); p.textSize(14);
      p.text(C.auto ? 'Pause and guess — revealing in' : (C.committed ? 'Committed — revealing in' : 'Commit a guess in the panel'), 480, 84);
      if (C.auto || C.committed) { p.textFont('Space Mono'); p.fill(T.copper); p.textSize(30); p.text(Math.ceil(cd), 690, 82); }
    } else if (t < 1.5) {
      p.fill(T.ink); p.textSize(26); p.text('Per-step reliability compounds over whole runs', 480, 60);
    } else if (sFull >= 20) {
      p.fill(T.dim); p.textSize(14);
      p.text('realised ' + count.off + ' · expected ' + (200 * A.exact.off[20]).toFixed(1) + ' ± ' + A.sd.off[20].toFixed(1) + '  (sd)', 480, 60);
    }
    if (t >= 1.5) {
      const gx = L.x0 + C.value / 200 * (L.N * L.cw);
      p.stroke(T.ink); p.strokeWeight(1.5); p.line(gx, L.top.y - 4, gx, L.top.y + L.k * L.ch + 4); p.noStroke();
      p.fill(T.ink); p.textFont('Space Mono'); p.textSize(11); p.textAlign(p.CENTER, p.TOP);
      p.text((C.auto ? 'default ' : 'guess ') + Math.round(C.value), gx, L.top.y + L.k * L.ch + 10);
    }
    if (t >= 10.5) {
      p.fill(T.ink); p.textFont('DM Sans'); p.textSize(16); p.textAlign(p.CENTER, p.BASELINE);
      p.text(A.saved.length + ' runs saved by the check (failed above, full below)', 480, 528);
    }
  },

  score(ctx) {
    const A = ctx.engine, ev = [];
    for (let i = 0; i < 3; i++) ev.push({ t: 1.5 + i, kind: 'tone', freq: 660, dur: 0.18, gain: 0.5 });
    for (let j = 0; j < 20; j++) {
      const t = 4.5 + (j + 1) * 0.3;
      ev.push({ t, kind: 'tick', gain: 0.7 });
      const fo = A.failedAt('off', j);
      if (fo) ev.push({ t: t + 0.01, kind: 'clack', gain: Math.min(1.4, 0.4 + fo / 6), pan: -0.3 });
      let caught = 0; for (let r = 0; r < A.N; r++) if (A.slip(r, j) && A.retryOk(r, j) && A.alive(r, 'on', j)) caught++;
      if (caught) ev.push({ t: t + 0.03, kind: 'click', gain: Math.min(1.2, 0.3 + caught / 8), pan: 0.3 });
    }
    ev.push({ t: 10.6, kind: 'tone', freq: 392, dur: 1.2, gain: 0.8 });
    return ev;
  },

  meta(ctx) {
    const A = ctx.engine;
    return [
      { label: 'Full runs · checks off', value: A.survivors.off[20], check: { world: 'off', k: 20, p: 0.95, c: 0.8, N: 200 } },
      { label: 'Full runs · checks on', value: A.survivors.on[20], check: { world: 'on', k: 20, p: 0.95, c: 0.8, N: 200 } },
      { label: 'P(full run) · off', value: A.exact.off[20], check: { world: 'off', k: 20, p: 0.95, c: 0.8 } },
      { label: 'Saved by the check', value: A.saved.length },
    ];
  },
});
