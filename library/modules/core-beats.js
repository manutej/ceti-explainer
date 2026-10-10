/* ════════════════════════════════════════════════════════════════════════════════════════════════════════════
   pedagogy/core-beats.js — engine, the Trace (CF concrete), concreteness fading (CF morph), predict–commit–reveal.
   Every module is a factory definition: {id, structure, cls, in/out ports, reveals/commits, dur(P), build, draw,
   captions, score, controls, meta, evidence}. draw() only calls Material methods (law HOUSE). Pure in t (law CLOCK).
   Sources: PEDAGOGY-MAP §2 (beat patterns), AD-v1 §0.4 + §4 THE TRACE.
   ════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';
  const AM = root.AM, H = AM.P, L = AM.layout;
  const U = () => root.Atelier.U;

  /* ── engine: the one source of numbers ── */
  AM.module({
    id: 'agentLoop', structure: 'ENG', cls: 'engine', grade: '—', layer: 'none', levels: ['glance', 'grasp', 'wield', 'master'],
    in: {}, out: { ens: 'Ensemble' }, dur: 0,
    doc: 'Atelier.AgentLoop twin worlds on common random numbers (runtime engine). Params N, k, p, c, retry; seed = film seed (+ seedOffset).',
    build(P, ins, ctx) {
      const prm = { N: P.N, k: P.k, p: P.p, c: P.c, retry: P.retry ?? 1, seed: ctx.seed + (P.seedOffset || 0) };
      const E = ctx.engine, same = E && ['N', 'k', 'p', 'c', 'retry', 'seed'].every(q => E.params[q] === prm[q]);
      const A = same ? E : root.Atelier.AgentLoop(prm);
      return { out: { ens: { A, P: prm } }, self: { A } };
    },
    draw() {},
  });

  /* ── THE TRACE: one labelled-sketch run of a real task (CF · concrete) ── */
  AM.module({
    id: 'traceOpener', structure: 'CF', stage: 'concrete', cls: 'content', grade: 'B', layer: 'stage', levels: ['grasp', 'wield', 'master'],
    in: { ens: 'Ensemble' }, out: { trace: 'Trace', run: 'Run', focus: 'Focus' },
    chapter: 'One run', durDefault: 22,
    doc: 'One run of “reconcile 40 invoices” framed large: plan → tool call → observe → match; step 7 slips (Acme Corp ≠ ACME Corporation), the check catches it, the retry passes. Labelled sketch. The run is a real engine run chosen by a declared rule (first run whose checked twin passes after a catch at step 7 and whose unchecked twin fails there).',
    dur: P => H.traceTimes(P.k || 20, AM.TRACE_INVOICES.failAt).end + 2.6,
    build(P, ins, ctx, M) {
      const A = ins.ens.A, R = AM.runs(A), f = AM.TRACE_INVOICES.failAt;
      let r = R.findIndex(q => q.fOff === f && q.fOn < 0 && q.caught.includes(f));
      if (r < 0) r = R.findIndex(q => q.fOff === f && q.fOn < 0); if (r < 0) r = 0;
      const g = H.grid(M, A.N, A.k), rect = { x: g.rects[r * 4], y: g.rects[r * 4 + 1], w: g.rects[r * 4 + 2], h: g.rects[r * 4 + 3] };
      const T = H.traceTimes(A.k, f);
      return { out: { trace: Object.assign({ r, k: A.k }, AM.TRACE_INVOICES), run: { r }, focus: rect }, self: { A, r, rect, T, g } };
    },
    draw(env) {
      const { M, S, u, self } = env, { r, rect, T } = self, k = self.A.k, f = AM.TRACE_INVOICES.failAt;
      const s = T.s(u), slipping = u >= T.slip0 && u < T.slip1, caughtNow = u >= T.slip1;
      const item = { r, x: rect.x, y: rect.y, w: rect.w, h: rect.h, k, rows: Math.min(k, Math.ceil(s)), done: s, failAt: slipping ? f : -1, age: slipping ? u - T.slip0 : 0,
        caught: caughtNow ? [f] : [], world: 'on', alpha: 1, emph: 'focus', lost: false };   // caught before it can unravel
      M.units(S, [item], env.t);
      const a0 = H.env(u, 0.2, T.end + 2.4, 0.6, 0.6);
      H.head(env, AM.TRACE_INVOICES.goal, a0, { given: true });
      M.text(S, 'one run of an agent · a labelled sketch', 56, 88, { role: 'sketch', screen: true, alpha: a0 });
      // step tags: placed beside the unit (axis y) or in a list below the thread (axis x), with a leader to the anchor
      const tags = AM.TRACE_INVOICES.steps, cam = env.cam;
      let shown = 0;
      tags.forEach((g, i) => {
        const at = g.kind === 'fail' ? T.slip0 : g.kind === 'catch' ? T.slip1 : T.done(g.j);
        if (u < at) return;
        const later = tags.slice(i + 1).some(h => u >= (h.kind === 'fail' ? T.slip0 : h.kind === 'catch' ? T.slip1 : T.done(h.j)));
        const a = Math.min(a0, U().clamp((u - at) / 0.4)) * (later ? 0.42 : 1);
        const P = M.anchor(rect, g.j, k), sx = AM.cam.X(cam, P[0]), sy = AM.cam.Y(cam, P[1]);
        let tx, ty;
        if (M.axis === 'y') { tx = sx + 34 + (g.kind === 'catch' ? 0 : 0); ty = sy + 6 + (g.kind === 'catch' ? 24 : 0); }
        else { tx = Math.min(700, Math.max(60, sx - 40)); ty = sy + 52 + (shown % 4) * 26; }
        const role = g.kind === 'fail' || g.kind === 'catch' ? 'text' : 'text';
        M.line(S, [[sx + (M.axis === 'y' ? 14 : 0), sy + (M.axis === 'y' ? 0 : 8)], [tx - 4, ty - 6]], 'link', { screen: true, alpha: a * 0.7 });
        M.text(S, g.text, tx, ty, { role, screen: true, alpha: a, color: g.kind === 'fail' ? 'peach' : g.kind === 'catch' ? 'sage' : null });
        shown++;
      });
      if (slipping) { const P = M.anchor(rect, f, k); M.mark(S, 'address', P[0], P[1], { r: 16 }); }
      if (caughtNow && u < T.slip1 + 2.2) { const P = M.anchor(rect, f, k); M.mark(S, 'save', P[0], P[1], { r: 12, alpha: H.env(u, T.slip1, T.slip1 + 2.2, 0.2, 0.6) }); }
    },
    captions(self) {
      const T = self.T;
      return [{ t0: 0.2, t1: 3.0, text: 'One agent, one real task: reconcile 40 invoices against purchase orders.' },
        { t0: 3.0, t1: T.slip0, text: 'Each step is one turn of the loop: plan, call a tool, read the result, check.' },
        { t0: T.slip0, t1: T.slip1 + 1.6, text: 'Step 7 slips: “Acme Corp” is not “ACME Corporation”. A check catches it; the retry passes.' },
        { t0: T.slip1 + 1.6, t1: T.end + 2.4, text: 'That was one run, drawn as a sketch. The question is what happens across many.' }];
    },
    score(self) {
      const T = self.T, ev = [];
      for (let j = 0; j < self.A.k; j++) ev.push({ t: T.done(j), kind: 'step', gain: j < 8 ? 0.9 : 0.5 });
      ev.push({ t: T.slip0, kind: 'fail' }, { t: T.slip1, kind: 'save' });
      return ev;
    },
  });
  /** the Trace's clock: slow first eight steps, a held slip, a catch, then brisk steps (all closed form) */
  H.traceTimes = function (k, f) {
    const T0 = 3.2, key = [[T0, 0]];
    let t = T0, slip0 = 0, slip1 = 0;
    for (let j = 0; j < k; j++) {
      const dt = j < 8 ? 1.25 : 0.36;
      if (j === f) { t += 0.55; key.push([t, j + 0.45]); slip0 = t; t += 1.9; slip1 = t; key.push([t, j + 0.45]); t += 0.7; key.push([t, j + 1]); continue; }
      t += dt; key.push([t, j + 1]);
    }
    const s = u => { if (u <= key[0][0]) return 0; for (let i = 1; i < key.length; i++) if (u < key[i][0]) { const a = key[i - 1], b = key[i]; return a[1] + (b[1] - a[1]) * U().ease.inOut((u - a[0]) / (b[0] - a[0])); } return k; };
    const done = j => { for (const [tt, ss] of key) if (ss >= j + 1 - 1e-9) return tt; return t; };
    return { s, done, slip0, slip1, end: t };
  };

  /* ── concreteness fading: the one run shrinks into the mass (CF · morph → schematic) ── */
  AM.module({
    id: 'concretenessFade', structure: 'CF', stage: 'morph', cls: 'content', grade: 'B', layer: 'stage', levels: ['grasp', 'wield', 'master'],
    in: { trace: 'Trace', ens: 'Ensemble' }, out: { arr: 'Arrangement' }, chapter: 'One run → many', durDefault: 7,
    doc: 'Same marks persist: the finished trace stays in place while its N−1 siblings fade in around it (staggered by distance), then every unit resets to blank for the ensemble. Pair with the pullBack camera.',
    dur: () => 7,
    build(P, ins, ctx, M) {
      const A = ins.ens.A, g = H.grid(M, A.N, A.k), r = ins.trace.r;
      const cx = g.rects[r * 4] + g.rects[r * 4 + 2] / 2, cy = g.rects[r * 4 + 1] + g.rects[r * 4 + 3] / 2;
      const dist = new Float32Array(A.N); let dmax = 1;
      for (let q = 0; q < A.N; q++) { dist[q] = Math.hypot(g.rects[q * 4] + g.rects[q * 4 + 2] / 2 - cx, g.rects[q * 4 + 1] + g.rects[q * 4 + 3] / 2 - cy); dmax = Math.max(dmax, dist[q]); }
      return { out: { arr: { kind: 'grid', rects: g.rects, world: 'off' } }, self: { A, g, r, dist, dmax } };
    },
    draw(env) {
      const { M, S, u, self } = env, { A, g, r, dist, dmax } = self, k = A.k, f = AM.TRACE_INVOICES.failAt;
      const reset = U().seg(u, 4.6, 5.6, 'inOut');
      // siblings: blank units fading in from the trace outward
      H.drawRuns(env, A, 'off', 0, { rects: g.rects, alpha: q => (q === r ? 0 : U().clamp((u - 0.4 - 2.6 * dist[q] / dmax) / 0.6)) });
      H.bandRules(env, g, U().clamp((u - 0.6) / 1.2));
      // the trace itself: finished (with its sage catch), then reset to blank with everyone else
      const fin = { r, x: g.rects[r * 4], y: g.rects[r * 4 + 1], w: g.rects[r * 4 + 2], h: g.rects[r * 4 + 3], k, rows: k, done: reset < 1 ? k : 0, failAt: -1, age: 0, caught: reset < 1 ? [f] : [], world: 'on', alpha: 1, emph: 'focus', lost: false };
      M.units(S, [fin], env.t);
      const a = H.env(u, 2.2, 7.2, 0.6, 0.4);
      H.head(env, `One run, then ${AM.fmt(A.N)} runs of the same task`, a, { given: true });
      H.sub(env, `each ${M.nouns.unit} is one run · each ${M.nouns.step} is one step`, a, { role: 'note', size: 14 });
    },
    captions(self) { return [{ t0: 0.3, t1: 4.6, text: `Shrink that run to one mark and lay out ${AM.fmt(self.A.N)} of them: the same task, run again and again.` },
      { t0: 4.6, t1: 7, text: 'Every run starts blank. This time there is no check at all.' }]; },
    score() { return [{ t: 0.4, kind: 'reveal', gain: 0.35 }]; },
  });

  /* ── predict → commit → reveal (PCR): the commit is drawn in the material, on the count edge it will be read from ── */
  AM.module({
    id: 'predictCommitReveal', structure: 'PCR', cls: 'content', grade: 'B', layer: 'overlay', levels: ['glance', 'grasp', 'wield', 'master'],
    in: { ens: 'Ensemble' }, out: { commit: 'Commit' }, commits: ['survival.{world}@{k}'], chapter: 'Your guess', durDefault: 8,
    doc: 'PROMPT (parameters only, no anchoring number) → COMMIT (runtime commit control; countdown drawn as three material ticks) → the guess mark stays on the count edge where the truth will land (persistent trace). Reveal belongs to truthUnderEvidence, which takes this Commit.',
    dur: () => 8,
    evidence: { structure_id: 'PCR', fields: ['t_prompt', 't_commit', 'value', 'truth', 'signed_error', 'skipped'] },
    build(P, ins, ctx, M) {
      const A = ins.ens.A, w = P.world || 'off', key = P.key || 'guess', rect = H.rackRect(M);
      return { out: { commit: { key, q: `survival.${w}@${A.k}`, N: A.N, world: w, rect } }, self: { A, key, w, rect, P } };
    },
    controls(self, P, t0, t1) {
      const N = self.A.N;
      return [{ key: self.key, type: 'commit', label: P.label || `Runs of ${AM.fmt(N)} that finish every step`, min: 0, max: N, step: Math.max(1, Math.round(N / 200)), jump: t1, countdown: 4,
        hint: P.hint || 'Commit before the runs play.', format: v => AM.fmt(Math.round(v)), default: P.sample ?? Math.round(N * 0.7) }];
    },
    draw(env) {
      const { M, S, u, self, ctx } = env, { A, key, rect, P } = self, N = A.N;
      const a = H.env(u, 0, 99, 0.5, 0.5), C = ctx.commits[key], film = ctx.mode === 'film';
      H.head(env, P.prompt || `${A.k} steps, each right ${Math.round(A.params.p * 100)} % of the time.`, a, { given: true });
      H.sub(env, P.ask || `Of ${AM.fmt(N)} runs with no check, how many finish?`, a, { given: true });
      // the count edge, drawn now so the guess and the truth will share it
      const e0 = H.edgePoint(M, rect, 0, N, 10), e1 = H.edgePoint(M, rect, N, N, 10), ru = U().seg(u, 0.4, 1.4, 'inOut');
      M.line(S, [e0, [e0[0] + (e1[0] - e0[0]) * ru, e0[1] + (e1[1] - e0[1]) * ru]], 'rule', { alpha: a });
      const lab = (v, s) => { const q = H.edgePoint(M, rect, v, N, M.axis === 'y' ? 34 : 18); M.text(S, s, q[0], q[1] + (M.axis === 'y' ? 0 : 5), { role: 'note', size: 13, align: M.axis === 'y' ? (v ? 'right' : 'left') : 'left', alpha: a * ru, given: true }); };
      lab(0, '0'); lab(N, AM.fmt(N));
      // countdown: three ticks in the material, one per second of the hold
      const hold = env.dur - 4;
      for (let i = 0; i < 3; i++) { const ti = hold + 0.4 + i * 1.1; if (u >= ti) { const q = H.edgePoint(M, rect, N * (0.03 + i * 0.022), N, 10); M.mark(S, 'tick', q[0], q[1], { alpha: a * U().clamp((u - ti) / 0.2) }); } }
      // the guess, once committed (film: the labelled sample)
      if (u >= env.dur - 0.25 && (film || (C && C.committed))) {
        const v = ctx.state[key], q = H.edgePoint(M, rect, v, N, 10), ga = U().clamp((u - env.dur + 0.25) / 0.3);
        M.mark(S, 'guess', q[0], q[1], { alpha: ga, dir: -1, s: 8 });
        M.text(S, film ? 'sample guess' : 'your guess', q[0] + (M.axis === 'y' ? 0 : -14), q[1] + (M.axis === 'y' ? -40 : -14), { role: 'note', size: 13, align: M.axis === 'y' ? 'center' : 'right', alpha: ga });
      }
    },
    captions(self, P) { return [{ t0: 0.2, t1: 8, text: P.caption || `Your call first: ${self.A.k} steps at ${Math.round(self.A.params.p * 100)} % each. How many of ${AM.fmt(self.A.N)} finish?` }]; },
    score(self) { return [{ t: 4.4, kind: 'commit', gain: 0.4 }, { t: 5.5, kind: 'commit', gain: 0.4 }, { t: 6.6, kind: 'commit', gain: 0.4 }, { t: 8, kind: 'commit', gain: 0.8 }]; },
  });
})(typeof window !== 'undefined' ? window : globalThis);
