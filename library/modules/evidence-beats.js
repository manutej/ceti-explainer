/* ════════════════════════════════════════════════════════════════════════════════════════════════════════════
   pedagogy/evidence-beats.js — the ensemble (ENS + NF), the failure address, truth under the evidence (rack +
   exact field + √N band + realised beside expected), twin worlds as a correction of one object (TW), the cost of
   the check as marks (TW · COST), and the independence caveat (honesty).
   Sources: AD-v1 §0.1–0.3, §0.6; PEDAGOGY-MAP §2 ENS/NF/TW; PEDAGOGY-CRIT §1 (cost as a mark), defect 2 (expected).
   ════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';
  const AM = root.AM, H = AM.P, L = AM.layout;
  const U = () => root.Atelier.U;
  const W = w => (w === 'on' ? 'on' : 'off');
  const tmpRects = new Map();
  const tmp = (key, n) => { let a = tmpRects.get(key); if (!a || a.length !== n) { a = new Float32Array(n); tmpRects.set(key, a); } return a; };

  /* ── grid layout: the material's folded grid as an Arrangement (for graphs without a Trace) ── */
  AM.module({
    id: 'gridLayout', structure: 'LAY', cls: 'scaffold', grade: '—', layer: 'none', levels: ['glance', 'grasp', 'wield', 'master'],
    in: { ens: 'Ensemble' }, out: { arr: 'Arrangement' }, dur: 0,
    doc: 'Packs N runs of k steps into the material\'s folded grid (its natural aspect, cell and capacity) — the Arrangement an ensemble lands on when no Trace precedes it.',
    build(P, ins, ctx, M) { const A = ins.ens.A, g = H.grid(M, A.N, A.k); return { out: { arr: { kind: 'grid', rects: g.rects, world: 'off' } }, self: {} }; },
    draw() {},
  });

  /* ── ENS: N runs land, step by step; each stops at its address; a live natural-frequency count ── */
  AM.module({
    id: 'ensembleRun', structure: 'ENS', cls: 'content', grade: 'B', layer: 'stage', levels: ['glance', 'grasp', 'wield', 'master'],
    in: { ens: 'Ensemble', arr: 'Arrangement', run: 'Run?' }, out: { arr: 'Arrangement', ens: 'Ensemble' },
    reveals: ['count:survival.{world}@step'], chapter: 'Many runs', durDefault: 14,
    doc: 'SAMPLE → LAND → STACK: every run advances one step per beat in its own place; a failed run stops at its address and stays (persistent trace). The count is natural frequency ("still going: 812"), read from the marks.',
    dur: P => 0.8 + (P.k || 20) * (P.stepDur || 0.55) + 1.8,
    build(P, ins, ctx, M) { const A = ins.ens.A, g = ins.arr.kind === 'grid' ? H.grid(M, A.N, A.k) : null; return { out: { arr: ins.arr, ens: ins.ens }, self: { A, g, rects: ins.arr.rects, w: W(P.world), sd: P.stepDur || 0.55, focus: ins.run ? ins.run.r : -1 } }; },
    draw(env) {
      const { M, S, u, self } = env, { A, rects, w, sd, focus } = self, k = A.k, s = U().clamp((u - 0.8) / sd, 0, k);
      if (self.g) H.bandRules(env, self.g, 1);
      H.drawRuns(env, A, w, s, { rects, lost: true, secPerStep: sd, emph: r => (r === focus ? 'focus' : null) });
      const j = Math.floor(s), standing = A.survivors[w][j];
      const a = H.env(u, 0.1, 99, 0.5, 0.5);
      H.head(env, w === 'off' ? `${AM.fmt(A.N)} runs, no check` : `${AM.fmt(A.N)} runs, a check after every step`, a, { given: true });
      M.num(env.S, AM.Number({ q: `standing.${w}`, realised: standing, N: A.N, source: 'marks', unit: 'runs' }), 56, 88, { show: 'realised', format: v => `still going after step ${j}: ${v}`, role: 'num', size: 16, screen: true, alpha: a });
      if (focus >= 0 && A.failStep[w][focus] >= 0 && s > A.failStep[w][focus]) {
        const f = A.failStep[w][focus], R = { x: rects[focus * 4], y: rects[focus * 4 + 1], w: rects[focus * 4 + 2], h: rects[focus * 4 + 3] }, P = M.anchor(R, f, k);
        M.mark(S, 'address', P[0], P[1], { r: 9, alpha: H.env(u, 0.8 + (f + 0.6) * sd, 0.8 + (f + 6) * sd, 0.3, 1.2) });
      }
    },
    captions(self) {
      const sd = self.sd, k = self.A.k, t1 = 0.8 + k * sd;
      return [{ t0: 0.2, t1: 0.8 + 7.5 * sd, text: `${AM.fmt(self.A.N)} runs, no check. Each one stops at the step where it slips.` },
        { t0: 0.8 + 7.5 * sd, t1: t1 + 1.8, text: 'The run from the sketch is in here too. Without the check, it stops at step 7.' }];
    },
    score(self) {
      const { A, w, sd } = self, ev = [];
      for (let j = 0; j < A.k; j++) { ev.push({ t: 0.8 + (j + 1) * sd, kind: 'step', gain: 0.55 }); const n = A.failedAt(w, j); if (n) ev.push({ t: 0.8 + (j + 0.55) * sd, kind: 'fail', gain: Math.min(1, 0.25 + Math.sqrt(n) / 10) }); }
      return ev;
    },
  });

  /* ── the failure address: point at where a few runs failed (pairs with the addressZoom camera) ── */
  AM.module({
    id: 'failureAddress', structure: 'ENS', stage: 'address', cls: 'scaffold', grade: 'C', layer: 'overlay', levels: ['glance', 'grasp', 'wield', 'master'],
    in: { ens: 'Ensemble', arr: 'Arrangement' }, out: { focus: 'Focus' }, chapter: 'Where it failed', durDefault: 5,
    doc: '"The number has an address" (AD §2): rings three failed runs at an early, a middle and a late step and names each step, then outputs a Focus on the first for an address zoom.',
    dur: () => 5,
    build(P, ins, ctx, M) {
      const A = ins.ens.A, w = W(P.world), f = A.failStep[w], rects = ins.arr.rects, pick = [];
      for (const target of [1, Math.floor(A.k / 2), A.k - 2]) { let best = -1; for (let r = 0; r < A.N; r++) if (f[r] >= 0 && Math.abs(f[r] - target) < (best < 0 ? 99 : Math.abs(f[best] - target))) best = r; if (best >= 0 && !pick.includes(best)) pick.push(best); }
      const R0 = pick.length ? { x: rects[pick[0] * 4], y: rects[pick[0] * 4 + 1], w: rects[pick[0] * 4 + 2], h: rects[pick[0] * 4 + 3] } : { x: 0, y: 0, w: 960, h: 540 };
      return { out: { focus: R0 }, self: { A, w, pick, rects } };
    },
    draw(env) {
      const { M, S, u, self } = env, { A, w, pick, rects } = self;
      pick.forEach((r, i) => {
        const a = H.env(u, 0.3 + i * 0.6, 5, 0.3, 0.4), f = A.failStep[w][r], R = { x: rects[r * 4], y: rects[r * 4 + 1], w: rects[r * 4 + 2], h: rects[r * 4 + 3] }, P = M.anchor(R, f, A.k);
        M.mark(S, 'address', P[0], P[1], { r: 8, alpha: a });
        M.num(S, AM.Number({ q: 'address', realised: f + 1, source: 'engine', unit: 'step' }), P[0] + 12, P[1] - 10, { show: 'realised', format: v => `step ${v}`, role: 'num', size: 15, alpha: a });
      });
    },
    captions() { return [{ t0: 0, t1: 5, text: 'Every stop has an address: the step where that run failed.' }]; },
  });

  /* ── truth under the evidence: rack by survival, exact field under it, √N band, realised beside expected ── */
  AM.module({
    id: 'truthUnderEvidence', structure: 'ENS', stage: 'overlay', cls: 'content', grade: 'B', layer: 'stage', levels: ['glance', 'grasp', 'wield', 'master'],
    in: { ens: 'Ensemble', arr: 'Arrangement', commit: 'Commit?' }, out: { arr: 'Arrangement', n: 'Number' },
    reveals: ['count:survival.{world}@{k}'], chapter: 'Truth under the evidence', durDefault: 13,
    doc: 'RACK (identity kept, units slide to their survival order: the silhouette is the survival curve — the ruler test) → EXACT (the computed curve p^j drawn over the edge) → BAND (expected ± 2 sd at the count edge) → COUNT (realised beside expected, as marks on the edge) → GAP (the committed guess, still on the edge, and the distance to the truth).',
    dur: () => 13,
    build(P, ins, ctx, M) {
      const A = ins.ens.A, w = W(P.world), k = A.k, rect = H.rackRect(M), order = L.survivalOrder(A, w), rack = L.rack(order, k, rect, M.axis);
      const pos = new Float32Array(A.N); order.forEach((r, i) => (pos[r] = i / A.N));
      const n = AM.Number({ q: `survival.${w}@${k}`, realised: A.survivors[w][k], exact: A.expected[w][k], sd: A.sd[w][k], N: A.N, source: 'engine', unit: 'runs' });
      return { out: { arr: Object.assign(rack, { world: w }), n }, self: { A, w, rect, rack, from: ins.arr.rects, pos, n, commit: ins.commit || null } };
    },
    draw(env) {
      const { M, S, u, self, ctx } = env, { A, w, rect, rack, from, pos, n, commit } = self, k = A.k, N = A.N;
      const m = U().seg(u, 0.3, 3.0, 'linear'), rects = m >= 1 ? rack.rects : L.lerpRects(from, rack.rects, m, tmp('truth' + w, from.length), 0.45, i => pos[i]);
      H.drawRuns(env, A, w, k, { rects, lost: false });
      const a = H.env(u, 0.2, 99, 0.5, 0.5);
      H.head(env, `Line the runs up by how far each one got`, a);
      H.sub(env, `the ${M.nouns.edge} is the survival curve`, a * U().clamp((u - 3) / 0.6), { role: 'note', size: 14 });
      // exact curve (computed), drawn on over the evidence
      const ce = U().seg(u, 3.2, 5.0, 'inOut');
      if (ce > 0) M.line(S, H.curve(M, rect, H.exactFracs(A, w), k, ce), 'exact', { alpha: 0.95 });
      if (ce >= 1) M.text(S, 'computed', ...H.curve(M, rect, H.exactFracs(A, w), k, 1)[Math.round(k * 0.35)].map((v, i) => v + (M.axis === 'y' ? (i ? -6 : 10) : (i ? -8 : 6))), { role: 'note', size: 13, color: 'copper', alpha: a });
      // the √N band at the count edge
      const ba = U().seg(u, 5.2, 6.2);
      if (ba > 0) { const [top, bot] = H.band(M, rect, n.exact, n.sd, N, 16); M.area(S, top, bot, 'band', { alpha: ba }); }
      // the count edge rule
      M.line(S, [H.edgePoint(M, rect, 0, N, 10), H.edgePoint(M, rect, N, N, 10)], 'rule', { alpha: a });
      // realised beside expected
      const ca = U().seg(u, 6.4, 7.2);
      if (ca > 0) H.countAt(env, rect, n, ca);
      // the guess, kept from the commit, and its gap
      if (commit) {
        const C = ctx.commits[commit.key], film = ctx.mode === 'film';
        if (film || (C && C.committed)) {
          const v = ctx.state[commit.key], q = H.edgePoint(M, rect, v, N, 10), ga = a * (1 - 0.0 * U().seg(u, 12, 13));
          M.mark(S, 'guess', q[0], q[1], { alpha: ga, dir: -1, s: 8 });
          const gp = U().seg(u, 8.2, 9.2);
          if (gp > 0) { const r0 = H.edgePoint(M, rect, n.realised, N, 10), q2 = [q[0] + (r0[0] - q[0]) * gp, q[1] + (r0[1] - q[1]) * gp]; M.line(S, [q, q2], 'gap', { alpha: ga, w: 3 }); }
          if (gp >= 1) M.num(S, AM.Number({ q: 'gap', realised: Math.round(Math.abs(v - n.realised)), source: 'marks', N }), (q[0] + H.edgePoint(M, rect, n.realised, N, 10)[0]) / 2 + (M.axis === 'y' ? 0 : 26), (q[1] + H.edgePoint(M, rect, n.realised, N, 10)[1]) / 2 + (M.axis === 'y' ? -14 : 4), { show: 'realised', format: x => `${film ? 'sample guess' : 'your guess'} was ${x} off`, role: 'num', size: 15, align: M.axis === 'y' ? 'center' : 'left', alpha: ga * U().seg(u, 9.2, 9.8) });
        }
      }
    },
    captions(self) {
      const p = self.A.params.p, k = self.A.k;
      return [{ t0: 0.2, t1: 3.2, text: 'Line them up by how far each run got before it stopped.' },
        { t0: 3.2, t1: 6.4, text: `The dashed line is computed: ${p} multiplied by itself, once per step.` },
        { t0: 6.4, t1: 9.0, text: `These runs and the computed answer land within each other's noise band.` },
        { t0: 9.0, t1: 13, text: `Most guesses land well above the truth: ${k} steps at ${Math.round(p * 100)} % sounds safe, and isn't.` }];
    },
    score(self) { return [{ t: 0.6, kind: 'step', gain: 0.6 }, { t: 3.4, kind: 'reveal', gain: 0.4 }, { t: 6.5, kind: 'reveal', gain: 0.9 }]; },
    meta(self) { const A = self.A, w = self.w; return [{ label: w === 'off' ? 'Runs that finish, no check' : 'Runs that finish, checked', value: A.survivors[w][A.k], check: { world: w, k: A.k, p: A.params.p, c: A.params.c, retry: A.params.retry, N: A.N } }]; },
  });

  /* ── twin worlds as a correction of one object (TW) ── */
  AM.module({
    id: 'contrastingTwins', structure: 'TW', stage: 'diff', cls: 'content', grade: 'C', layer: 'stage', levels: ['glance', 'grasp', 'wield', 'master'],
    in: { ens: 'Ensemble', arr: 'Arrangement', mix: 'Mix?' }, out: { arr: 'Arrangement', n: 'Number', saved: 'Number' },
    reveals: ['count:survival.on@{k}', 'count:saved@{k}'], chapter: 'Same runs, with a check', durDefault: 16,
    doc: 'RUN-A stays as a ghost edge (onion skin) → RUN-B on the same draws: every run keeps its place, the check marks appear at the old addresses and saved runs carry on → re-rack by the new survival (identity kept) → exact curve for the checked world, realised beside expected, saved count. No side-by-side panels.',
    dur: () => 16,
    build(P, ins, ctx, M) {
      const A = ins.ens.A, k = A.k, rect = H.rackRect(M), R = AM.runs(A);
      const orderOn = L.survivalOrder(A, 'on'), rackOn = L.rack(orderOn, k, rect, M.axis), pos = new Float32Array(A.N); orderOn.forEach((r, i) => (pos[r] = i / A.N));
      const base = Float32Array.from(R, q => (q.fOff < 0 ? k : q.fOff + 0.5));   // + 0.5: a run that failed stays failed until the check is switched on
      const n = AM.Number({ q: `survival.on@${k}`, realised: A.survivors.on[k], exact: A.expected.on[k], sd: A.sd.on[k], N: A.N, source: 'engine', unit: 'runs' });
      const saved = AM.Number({ q: `saved@${k}`, realised: A.saved.length, exact: A.expected.on[k] - A.expected.off[k], N: A.N, source: 'engine', unit: 'runs' });
      return { out: { arr: Object.assign(rackOn, { world: 'on' }), n, saved }, self: { A, rect, rackOff: ins.arr.rects, rackOn, pos, base, n, saved } };
    },
    draw(env) {
      const { M, S, u, self } = env, { A, rect, rackOff, rackOn, pos, base, n, saved } = self, k = A.k, N = A.N;
      const a = H.env(u, 0.1, 99, 0.5, 0.5);
      // the old edge stays as a ghost line (onion skin) until the new count lands
      M.line(S, H.curve(M, rect, H.realisedFracs(A, 'off'), k, 1), 'ghost', { alpha: a * (1 - 0.6 * U().seg(u, 13, 15)) });
      const sg = U().seg(u, 1.4, 8.4, 'linear') * k;
      const m = U().seg(u, 8.8, 11.2, 'linear'), rects = m <= 0 ? rackOff : m >= 1 ? rackOn.rects : L.lerpRects(rackOff, rackOn.rects, m, tmp('twins', rackOff.length), 0.45, i => pos[i]);
      if (u < 1.2) H.drawRuns(env, A, 'off', k, { rects: rackOff, lost: false });   // the hand-off: the unchecked world as it was left
      else H.drawRuns(env, A, 'on', 0, { rects, lost: false, sOf: r => Math.max(base[r], Math.min(k, sg)), emph: r => (A.failStep.off[r] >= 0 && A.failStep.on[r] < 0 ? 'saved' : null) });
      H.head(env, 'The same runs, the same draws, now with a check after every step', a);
      H.sub(env, `the check catches ${Math.round(A.params.c * 100)} % of slips and retries once`, a, { role: 'note', size: 14, given: true });
      const ce = U().seg(u, 11.4, 12.8, 'inOut');
      if (ce > 0) M.line(S, H.curve(M, rect, H.exactFracs(A, 'on'), k, ce), 'exact', { alpha: 0.95 });
      if (ce > 0.5) { const [top, bot] = H.band(M, rect, n.exact, n.sd, N, 16); M.area(S, top, bot, 'band', { alpha: U().seg(u, 12, 12.8) }); }
      M.line(S, [H.edgePoint(M, rect, 0, N, 10), H.edgePoint(M, rect, N, N, 10)], 'rule', { alpha: a });
      const ca = U().seg(u, 12.8, 13.6);
      if (ca > 0) {
        H.countAt(env, rect, n, ca);
        const off = H.edgePoint(M, rect, A.survivors.off[k], N, 10), on = H.edgePoint(M, rect, n.realised, N, 10);
        M.line(S, [off, [off[0] + (on[0] - off[0]) * ca, off[1] + (on[1] - off[1]) * ca]], 'link', { alpha: ca, w: 2 });
        M.num(S, saved, (off[0] + on[0]) / 2 + (M.axis === 'y' ? 0 : 30), (off[1] + on[1]) / 2 + (M.axis === 'y' ? 30 : 4), { show: 'realised', format: v => `${v} runs saved`, role: 'num', size: 15, color: 'sage', align: M.axis === 'y' ? 'center' : 'left', alpha: ca });
      }
    },
    captions(self) {
      return [{ t0: 0.2, t1: 4.6, text: 'Same runs, same random draws. Now a check after every step catches 4 slips in 5.' },
        { t0: 4.6, t1: 8.8, text: 'Each sage mark is a slip the check caught at the old address. That run carries on.' },
        { t0: 8.8, t1: 12.8, text: 'Line them up again. The dashed line is the new computed curve.' },
        { t0: 12.8, t1: 16, text: 'The old edge stays as a ghost. The gap between the edges is the runs the check saved.' }];
    },
    score(self) { const ev = []; for (let i = 0; i < 6; i++) ev.push({ t: 1.4 + i * 1.1, kind: 'save', gain: 0.5 }); ev.push({ t: 12.9, kind: 'reveal', gain: 0.9 }); return ev; },
    meta(self) { const A = self.A; return [{ label: 'Runs that finish, checked', value: A.survivors.on[A.k], check: { world: 'on', k: A.k, p: A.params.p, c: A.params.c, retry: A.params.retry, N: A.N } }, { label: 'Runs the check saved', value: A.saved.length }]; },
  });

  /* ── the cost of the check, as marks (TW · COST) ── */
  AM.module({
    id: 'costOfCheck', structure: 'TW', stage: 'cost', cls: 'content', grade: 'C', layer: 'overlay', levels: ['glance', 'grasp', 'wield', 'master'],
    in: { ens: 'Ensemble', arr: 'Arrangement' }, out: { cost: 'Cost', n: 'Number' }, reveals: ['count:redone@{k}', 'percent:redone@{k}'], chapter: 'What the check costs', durDefault: 9,
    doc: 'Every caught slip is a step done twice: one cost mark per redo at its address (from the engine flags), then the count, then the share of extra work. The check’s own review time is named as not counted (no invented unit).',
    dur: () => 9,
    build(P, ins, ctx, M) {
      const A = ins.ens.A, R = AM.runs(A), c = AM.costOf(A), list = [];
      for (const q of R) for (const j of q.caught.concat(q.caughtFail)) list.push([q.r, j]);
      list.sort((a, b) => a[1] - b[1] || a[0] - b[0]);
      const n = AM.Number({ q: `redone@${A.k}`, realised: c.redone, N: c.executed, source: 'engine', unit: 'steps' });
      const fr = AM.Number({ q: `redone.share@${A.k}`, exact: c.frac * 100, source: 'engine', unit: '%' });
      return { out: { cost: { redone: c.redone, executed: c.executed, frac: c.frac }, n }, self: { A, rects: ins.arr.rects, list, n, fr } };
    },
    draw(env) {
      const { M, S, u, self } = env, { A, rects, list, n, fr } = self, k = A.k;
      const a = H.env(u, 0.1, 9, 0.4, 0.5);
      for (let i = 0; i < list.length; i++) {
        const [r, j] = list[i], ti = 0.6 + (j / k) * 3.2; if (u < ti) break;
        const R = { x: rects[r * 4], y: rects[r * 4 + 1], w: rects[r * 4 + 2], h: rects[r * 4 + 3] }, P = M.anchor(R, j, k);
        M.mark(S, 'cost', P[0], P[1], { alpha: a * U().clamp((u - ti) / 0.3) });
      }
      const c1 = U().seg(u, 4.2, 4.8), c2 = U().seg(u, 5.6, 6.2), c3 = U().seg(u, 6.8, 7.4);
      const X = 56, Y = M.axis === 'y' ? 486 : 470;
      if (c1 > 0) M.num(S, n, X, Y, { show: 'realised', format: v => `${v} steps done twice`, role: 'num', size: 20, color: 'sage', screen: true, alpha: a * c1 });
      if (c2 > 0) M.num(S, fr, X, Y + 26, { show: 'exact', decimals: 1, format: v => `${v} % more work than the unchecked runs`, role: 'num', size: 15, screen: true, alpha: a * c2 });
      if (c3 > 0) M.text(S, 'and every check also takes review time, which this count leaves out', X, Y + 50, { role: 'text', size: 15, screen: true, alpha: a * c3 });
    },
    captions() { return [{ t0: 0.2, t1: 4.2, text: 'Checks are not free. Every caught slip is a step done twice.' }, { t0: 4.2, t1: 9, text: 'Count the redone steps. The review time for each check comes on top.' }]; },
    score(self) { const ev = []; for (let i = 0; i < 8; i++) ev.push({ t: 0.6 + i * 0.4, kind: 'cost', gain: 0.4 }); ev.push({ t: 4.3, kind: 'reveal', gain: 0.5 }); return ev; },
  });

  /* ── honesty: independence was an assumption (sketch) ── */
  AM.module({
    id: 'correlatedCaveat', structure: 'HON', cls: 'honesty', grade: 'C', layer: 'stage', levels: ['grasp', 'wield', 'master'],
    in: { ens: 'Ensemble', arr: 'Arrangement' }, out: {}, chapter: 'One shared bad source', durDefault: 12,
    doc: 'Sketch, labelled: a share ρ of runs read one bad shared source at step s*; they all fail there, and a check that reads the same source passes the mistake. The silhouette grows a cliff at s*. Wording per PEDAGOGY-CRIT §3 C: "checks that read the same source".',
    dur: () => 12,
    build(P, ins, ctx, M) {
      const A = ins.ens.A, k = A.k, N = A.N, s = P.sStar ?? 9, rho = P.rho ?? 0.3, h = root.Atelier.U.h, R = AM.runs(A);
      const fail = new Int16Array(N), shared = new Uint8Array(N);
      for (let r = 0; r < N; r++) { const f = A.failStep.on[r]; shared[r] = h(ctx.seed, r, 4242, 7) < rho ? 1 : 0; fail[r] = shared[r] && (f < 0 || f > s) ? s : f; }
      const order = Int32Array.from(Array.from({ length: N }, (_, r) => r).sort((a, b) => ((fail[b] < 0 ? k : fail[b]) - (fail[a] < 0 ? k : fail[a])) || a - b));
      const rect = H.rackRect(M), rack = L.rack(order, k, rect, M.axis), pos = new Float32Array(N); order.forEach((r, i) => (pos[r] = i / N));
      let real = 0; for (let r = 0; r < N; r++) if (fail[r] < 0) real++;
      const n = AM.Number({ q: 'correlated.sketch', realised: real, exact: N * (1 - rho) * A.exact.on[k], N, source: 'sketch', unit: 'runs' });
      return { out: {}, self: { A, s, rho, fail, shared, rect, rack, from: ins.arr.rects, pos, n, caught: r => R[r].caught.filter(j => j < s || !shared[r]) } };
    },
    draw(env) {
      const { M, S, u, self } = env, { A, s, rho, fail, shared, rect, rack, from, pos, n, caught } = self, k = A.k, N = A.N;
      const a = H.env(u, 0.1, 99, 0.5, 0.5), cut = U().seg(u, 1.6, 3.6, 'linear'), m = U().seg(u, 4.4, 6.8, 'linear');
      const rects = m <= 0 ? from : m >= 1 ? rack.rects : L.lerpRects(from, rack.rects, m, tmp('cor', from.length), 0.45, i => pos[i]);
      const f2 = cut >= 1 ? fail : Int16Array.from(fail, (f, r) => (shared[r] && pos[r] > cut ? A.failStep.on[r] : f));
      H.drawRuns(env, A, 'on', k, { rects, fail: f2, caughtOf: caught, lost: false });
      H.head(env, 'Sketch: what if many runs read one bad shared source?', a, { role: 'sketch', size: 22 });
      H.sub(env, `a share of the runs (${Math.round(rho * 100)} %, sketch) reads the same vendor file at step ${s + 1}`, a, { role: 'note', size: 14, sketch: true });
      const ta = U().seg(u, 7.2, 8.0);
      if (ta > 0) {
        H.countAt(env, rect, n, ta, { expA: 0 });
        const X = 56, Y = M.axis === 'y' ? 490 : 482;
        M.text(S, 'The numbers so far assumed independent slips.', X, Y, { role: 'text', size: 16, screen: true, alpha: ta });
        M.text(S, 'A check that reads the same source passes the same mistake.', X, Y + 24, { role: 'text', size: 16, screen: true, alpha: U().seg(u, 8.4, 9.2) });
      }
    },
    captions(self) { return [{ t0: 0.2, t1: 4.4, text: 'A sketch. So far every run had its own luck. What if many runs share one bad source?' },
      { t0: 4.4, t1: 8.4, text: 'They all fail at the same step, and a check that reads the same source cannot see it.' },
      { t0: 8.4, t1: 12, text: 'Correlated errors are worse than the curve says. Checks need a second, independent source.' }]; },
    score() { return [{ t: 1.7, kind: 'fail', gain: 1 }, { t: 2.4, kind: 'fail', gain: 0.8 }, { t: 7.3, kind: 'reveal', gain: 0.5 }]; },
  });
})(typeof window !== 'undefined' ? window : globalThis);
