/* ════════════════════════════════════════════════════════════════════════════════════════════════════════════
   pedagogy/transfer-beats.js — the far-transfer question (TRF), the worked example with fading (WE), and the
   non-degenerate inverse problem (INV, Wield). Sources: PEDAGOGY-MAP §2 TRF/WE/INV, §5 (minimal transfer pattern,
   evidence row), PEDAGOGY-CRIT defect 10 (degenerate Wield).
   ════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';
  const AM = root.AM, H = AM.P, L = AM.layout;
  const U = () => root.Atelier.U;
  const tmpR = new Map(); const tmp = (key, n) => { let a = tmpR.get(key); if (!a || a.length !== n) { a = new Float32Array(n); tmpR.set(key, a); } return a; };

  /* ── TRF: a new skin, the same structure, no cue; commit, then the engine answers ── */
  AM.module({
    id: 'transferQuestion', structure: 'TRF', cls: 'content', grade: 'B', layer: 'stage', levels: ['grasp', 'wield', 'master'],
    in: {}, out: { commit: 'Commit', n: 'Number' }, commits: ['transfer@{kFar}'], reveals: ['count:transfer@{kFar}'], chapter: 'A new case', durDefault: 19,
    doc: 'NEAR is implicit (the film itself); FAR = a new domain with the same multiplicative structure and no mention of agents (MAP §5: expense approval, 14 sign-offs at 97 %, computed 65.3 %). COMMIT in the material, then a fresh engine draw of the far case lands on its own rack with exact curve and realised beside expected. Live page adds the LEVER choice (logged as model_consistent).',
    dur: () => 19,
    evidence: { structure_id: 'TRF', fields: ['value', 'truth', 'signed_error', 'lever', 'model_consistent'] },
    build(P, ins, ctx, M) {
      const kF = P.kFar ?? 14, pF = P.pFar ?? 0.97, NF = P.NFar ?? 100;
      const A = root.Atelier.AgentLoop({ N: NF, k: kF, p: pF, c: P.c ?? 0.8, retry: 1, seed: ctx.seed + (P.seedOffset ?? 97) });
      const g = H.grid(M, NF, kF), rect = H.rackRect(M), order = L.survivalOrder(A, 'off'), rack = L.rack(order, kF, rect, M.axis);
      const pos = new Float32Array(NF); order.forEach((r, i) => (pos[r] = i / NF));
      const n = AM.Number({ q: `transfer@${kF}`, realised: A.survivors.off[kF], exact: A.expected.off[kF], sd: A.sd.off[kF], N: NF, source: 'engine', unit: 'claims' });
      const key = P.key || 'transfer';
      return { out: { commit: { key, q: `transfer@${kF}`, N: NF, rect }, n }, self: { A, g, rect, rack, pos, n, key, P, kF, pF, NF } };
    },
    controls(self, P, t0) {
      return [{ key: self.key, type: 'commit', label: P.label || `Claims of ${self.NF} that clear every sign-off`, min: 0, max: self.NF, step: 1, jump: t0 + 8, countdown: 4,
        hint: 'A new case. Commit before it runs.', format: v => AM.fmt(Math.round(v)), default: P.sample ?? Math.round(self.NF * 0.8) },
      { key: self.key + 'Lever', type: 'select', label: 'Which lever would you pull first?', options: [['shorten', 'fewer sign-offs'], ['check', 'a check after each one'], ['gate', 'a person at the riskiest one']], default: 'shorten' }];
    },
    draw(env) {
      const { M, S, u, self, ctx } = env, { A, g, rect, rack, pos, n, key, P, kF, pF, NF } = self;
      const a = H.env(u, 0.1, 99, 0.5, 0.5), film = ctx.mode === 'film', C = ctx.commits[key];
      const lines = P.farLines || [`An expense claim needs ${kF} sign-offs.`, `Each sign-off is right ${Math.round(pF * 100)} % of the time.`, `Of ${NF} claims, how many clear every sign-off?`];
      lines.forEach((s, i) => M.text(S, s, 56, 42 + i * 23, { role: i ? 'text' : 'head', screen: true, alpha: a * U().clamp((u - 0.3 - i * 0.7) / 0.5), given: true }));
      const run = U().clamp((u - 8.6) / 4.2) * kF, m = U().seg(u, 13.2, 15.4, 'linear');
      const rects = m <= 0 ? g.rects : m >= 1 ? rack.rects : L.lerpRects(g.rects, rack.rects, m, tmp('trf', g.rects.length), 0.4, i => pos[i]);
      if (m <= 0) H.bandRules(env, g, a * U().clamp((u - 1.2) / 1.0));
      H.drawRuns(env, A, 'off', run, { rects, lost: m <= 0, secPerStep: 4.2 / kF, alpha: () => U().clamp((u - 1.2) / 1.0) });
      M.line(S, [H.edgePoint(M, rect, 0, NF, 10), H.edgePoint(M, rect, NF, NF, 10)], 'rule', { alpha: a * U().clamp((u - 2) / 0.6) });
      const hold = 4;
      for (let i = 0; i < 3; i++) { const ti = hold + 0.4 + i * 1.1; if (u >= ti && u < 8.6) { const q = H.edgePoint(M, rect, NF * (0.03 + i * 0.022), NF, 10); M.mark(S, 'tick', q[0], q[1], { alpha: a * U().clamp((u - ti) / 0.2) }); } }
      if (u >= 7.75 && (film || (C && C.committed))) {
        const v = ctx.state[key], q = H.edgePoint(M, rect, v, NF, 10);
        M.mark(S, 'guess', q[0], q[1], { alpha: a, dir: -1, s: 8 });
        M.text(S, film ? 'sample guess' : 'your guess', q[0] + (M.axis === 'y' ? 0 : -14), q[1] + (M.axis === 'y' ? -40 : -14), { role: 'note', size: 13, align: M.axis === 'y' ? 'center' : 'right', alpha: a * U().clamp((u - 7.75) / 0.4) });
        const gp = U().seg(u, 17.4, 18.2);
        if (gp > 0) { const r0 = H.edgePoint(M, rect, n.realised, NF, 10); M.line(S, [q, [q[0] + (r0[0] - q[0]) * gp, q[1] + (r0[1] - q[1]) * gp]], 'gap', { alpha: a, w: 3 }); }
      }
      const ce = U().seg(u, 15.4, 16.6, 'inOut');
      if (ce > 0) M.line(S, H.curve(M, rect, H.exactFracs(A, 'off'), kF, ce), 'exact', { alpha: 0.95 });
      const ca = U().seg(u, 16.6, 17.2);
      if (ca > 0) { const [top, bot] = H.band(M, rect, n.exact, n.sd, NF, 16); M.area(S, top, bot, 'band', { alpha: ca }); H.countAt(env, rect, n, ca); }
    },
    captions(self) {
      return [{ t0: 0.3, t1: 4.0, text: `A new case: an expense claim with ${self.kF} sign-offs, each right ${Math.round(self.pF * 100)} % of the time.` },
        { t0: 4.0, t1: 8.6, text: `Commit first: of ${self.NF} claims, how many clear every sign-off untouched?` },
        { t0: 8.6, t1: 15.4, text: `Run ${self.NF} claims. Line them up by how far each got.` },
        { t0: 15.4, t1: 19, text: `Computed: ${self.pF} multiplied ${self.kF} times. Shorter chains and checks both move this edge.` }];
    },
    score(self) { const ev = [{ t: 4.4, kind: 'commit', gain: 0.4 }, { t: 5.5, kind: 'commit', gain: 0.4 }, { t: 6.6, kind: 'commit', gain: 0.4 }, { t: 8, kind: 'commit', gain: 0.8 }];
      for (let j = 0; j < self.kF; j++) ev.push({ t: 8.6 + (j + 1) * 4.2 / self.kF, kind: 'step', gain: 0.45 }); ev.push({ t: 16.7, kind: 'reveal', gain: 0.9 }); return ev; },
    meta(self) { const A = self.A; return [{ label: `Claims that clear all ${self.kF} sign-offs`, value: A.survivors.off[self.kF], check: { world: 'off', k: self.kF, p: self.pF, c: A.params.c, retry: 1, N: self.NF } }]; },
  });

  /* ── WE: worked example → backward fading (FULL → GAP1 → TWO-GAPS) ── */
  AM.module({
    id: 'workedExampleFade', structure: 'WE', cls: 'content', grade: 'A', layer: 'stage', levels: ['grasp', 'wield'],
    in: { ens: 'Ensemble' }, out: {}, chapter: 'Worked example', durDefault: 26,
    doc: 'FULL: one run drawn large with the running product written at each step (p, p², … computed). GAP1: a new case (params.case2) with the last product left for the viewer, held, then filled. TWO-GAPS: a third case with the last two left blank, then filled. Procedures, not concepts (MAP §4 conflicts).',
    dur: () => 26,
    build(P, ins, ctx, M) {
      const A = ins.ens.A, cases = [{ k: A.k, p: A.params.p, gaps: 0 }, Object.assign({ k: 10, p: 0.9, gaps: 1 }, P.case2 || {}), Object.assign({ k: 6, p: 0.8, gaps: 2 }, P.case3 || {})];
      const stage = H.rackRect(M);
      cases.forEach(c => { c.rect = L.macro(c.k, stage, M.axis, M.cell, 0.7); c.prod = Array.from({ length: c.k + 1 }, (_, j) => Math.pow(c.p, j)); });
      return { out: {}, self: { cases } };
    },
    draw(env) {
      const { M, S, u, self } = env, segs = [[0, 10], [10, 18], [18, 26]];
      self.cases.forEach((c, ci) => {
        const [t0, t1] = segs[ci]; if (u < t0 || u >= t1) return;
        const v = u - t0, a = H.env(v, 0, t1 - t0, 0.5, 0.5), s = U().clamp((v - 0.8) / ((t1 - t0) * 0.45)) * c.k;
        M.units(S, [{ r: ci, x: c.rect.x, y: c.rect.y, w: c.rect.w, h: c.rect.h, k: c.k, rows: Math.ceil(s), done: s, failAt: -1, age: 0, caught: [], world: 'off', alpha: a, emph: 'focus', lost: false }], env.t);
        M.text(S, ci === 0 ? 'Worked through: the chance a run is still going' : ci === 1 ? 'Your turn: the last one is blank' : 'Now two are blank', 56, 60, { role: 'head', screen: true, alpha: a });
        M.text(S, `${c.k} steps, each right ${Math.round(c.p * 100)} % of the time`, 56, 86, { role: 'note', size: 14, screen: true, alpha: a, given: true });
        for (let j = 1; j <= c.k; j++) {
          if (s < j) break;
          const blank = j > c.k - c.gaps, fill = blank ? U().seg(v, (t1 - t0) - 2.4, (t1 - t0) - 1.6) : 1, P = M.anchor(c.rect, j - 1, c.k);
          const off = M.axis === 'y' ? [24, 5] : [0, -16 - (j % 2) * 16];
          if (blank && fill <= 0) M.text(S, '?', P[0] + off[0], P[1] + off[1], { role: 'num', size: 16, alpha: a, align: M.axis === 'y' ? 'left' : 'center' });
          else M.num(S, AM.Number({ q: `product@${j}`, exact: c.prod[j], source: 'engine' }), P[0] + off[0], P[1] + off[1], { show: 'exact', decimals: 2, role: 'num', size: 15, alpha: a * fill, align: M.axis === 'y' ? 'left' : 'center' });
        }
      });
    },
    captions() { return [{ t0: 0.2, t1: 10, text: 'Worked through: after each step, multiply by the chance that step goes right.' }, { t0: 10, t1: 18, text: 'Your turn. Work out the last product before it appears.' }, { t0: 18, t1: 26, text: 'Now the last two are blank.' }]; },
    score() { return [{ t: 16.2, kind: 'reveal', gain: 0.6 }, { t: 24.2, kind: 'reveal', gain: 0.6 }]; },
  });

  /* ── INV: place a limited number of checks on steps of unequal reliability; forecast; one run ── */
  AM.module({
    id: 'inverseProblemWield', structure: 'INV', cls: 'content', grade: 'C', layer: 'stage', levels: ['wield', 'master'],
    in: {}, out: { commit: 'Commit', n: 'Number' }, commits: ['inverse@{budget}'], reveals: ['count:inverse@{budget}'], chapter: 'Place the checks', durDefault: 16,
    doc: 'GOAL (target count) → PLACE (toggles, budget binds; extras ignored in step order) → FORECAST (commit) → RUN (one seeded draw with per-step p, sketch) → GAP, plus the expected count of the viewer’s placement vs the best placement. Non-degenerate by law: per-step p must vary and budget < k (laws.js INV). Logs first_move, n_moves, final placement, forecast error.',
    dur: () => 16,
    evidence: { structure_id: 'INV', fields: ['first_move', 'n_moves', 'final', 'value', 'truth', 'signed_error'] },
    build(P, ins, ctx, M) {
      const ps = P.pSteps, k = ps.length, N = P.NInv ?? 200, c = P.c ?? 0.8, budget = P.budget ?? 3, h = root.Atelier.U.h, seed = ctx.seed + 313;
      const pPrime = p => p + (1 - p) * c * p;
      const exactFor = set => ps.reduce((acc, p, j) => acc * (set.has(j) ? pPrime(p) : p), 1);
      // the best placement: checks where (p' − p)/p is largest (independent steps → greedy is exact for a product)
      const gain = ps.map((p, j) => [Math.log(pPrime(p) / p), j]).sort((a, b) => b[0] - a[0]);
      const best = new Set(gain.slice(0, budget).map(g => g[1]));
      const sim = set => { const fail = new Int16Array(N).fill(-1), caught = Array.from({ length: N }, () => []);
        for (let r = 0; r < N; r++) for (let j = 0; j < k; j++) { if (h(seed, r, j, 0) <= ps[j]) continue; if (set.has(j) && h(seed, r, j, 1) < c && h(seed, r, j, 2) < ps[j]) { caught[r].push(j); continue; } fail[r] = j; break; }
        return { fail, caught }; };
      const keys = ps.map((_, j) => `${P.key || 'inv'}Check${j + 1}`);
      const placement = st => { const s = new Set(); keys.forEach((kk, j) => { if (st[kk] && s.size < budget) s.add(j); }); return s; };
      // a pseudo-engine so AM.items can draw it (fail override; caught override)
      const pseudo = { N, k, failStep: { off: new Int16Array(N).fill(-1), on: new Int16Array(N).fill(-1) }, slip: () => false, caught: () => false, retryOk: () => false };
      const rect = H.rackRect(M);
      return { out: { commit: { key: P.key || 'inv', q: `inverse@${budget}`, N, rect }, n: AM.Number({ q: `inverse.best@${budget}`, exact: N * exactFor(best), source: 'engine', N }) },
        self: { ps, k, N, c, budget, best, exactFor, sim, keys, placement, pseudo, rect, P, cache: new Map() } };
    },
    controls(self, P, t0) {
      const cs = self.keys.map((key, j) => ({ key, type: 'toggle', label: `Check after step ${j + 1} (${Math.round(self.ps[j] * 100)} % reliable, sketch)`, default: [...self.best].includes(j) && j % 2 === 0 }));
      cs.push({ key: P.key || 'inv', type: 'commit', label: `Your forecast: runs of ${self.N} that finish`, min: 0, max: self.N, step: 1, jump: t0 + 7, countdown: 3, default: P.sample ?? Math.round(self.N * 0.6), format: v => AM.fmt(Math.round(v)) });
      return cs;
    },
    draw(env) {
      const { M, S, u, self, ctx } = env, { k, N, budget, exactFor, sim, placement, pseudo, rect, cache, ps } = self;
      const set = placement(ctx.state), sig = [...set].join(','), a = H.env(u, 0.1, 99, 0.5, 0.5);
      let R = cache.get(sig); if (!R) { R = sim(set); cache.set(sig, R); }
      const order = Int32Array.from(Array.from({ length: N }, (_, r) => r).sort((x, y) => ((R.fail[y] < 0 ? k : R.fail[y]) - (R.fail[x] < 0 ? k : R.fail[x])) || x - y));
      const rack = L.rack(order, k, rect, M.axis), run = U().clamp((u - 7.4) / 4) * k;
      AM.runs(pseudo);   // facts cache (empty); the overrides below carry this placement's draws
      M.units(S, AM.items(pseudo, 'on', run, { rects: rack.rects, fail: R.fail, caughtOf: r => R.caught[r], lost: false }), env.t);
      M.text(S, `Place up to ${budget} checks. The steps are not equally reliable (sketch).`, 56, 60, { role: 'head', screen: true, alpha: a, given: true });
      ps.forEach((p, j) => { const P = M.anchor({ x: rect.x, y: rect.y, w: M.axis === 'x' ? rect.w : rect.w, h: rect.h }, j, k); if (set.has(j)) M.mark(S, 'save', M.axis === 'y' ? rect.x - 10 : P[0], M.axis === 'y' ? P[1] : rect.y - 10, { r: 6, alpha: a }); });
      const exp = AM.Number({ q: `inverse.exp@${budget}`, exact: N * exactFor(set), source: 'engine', N });
      if (u > 11.6) {
        let real = 0; for (let r = 0; r < N; r++) if (R.fail[r] < 0) real++;
        const n = AM.Number({ q: `inverse@${budget}`, realised: real, exact: exp.exact, sd: Math.sqrt(N * (exp.exact / N) * (1 - exp.exact / N)), N, source: 'engine' });
        H.countAt(env, rect, n, U().seg(u, 11.6, 12.4));
      }
    },
    captions() { return [{ t0: 0.2, t1: 7, text: 'Place your checks where they buy the most. Then forecast how many runs finish.' }, { t0: 7, t1: 16, text: 'One run of your plan. The expected count is what your placement buys on average.' }]; },
  });
})(typeof window !== 'undefined' ? window : globalThis);
