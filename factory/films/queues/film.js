/* queues · utilisation and waiting. One clock: render(t, state) draws frame t; the two desks are a
   seeded M/M/1 run computed once in setup (mulberry32, seed and params from film.json). */
(function () {
'use strict';
const F = window.FILM, P = F.params;
let DESK = null;            // [{rho, ahead[100], tau[100], cum[101], jobs:[{a, d}], mean}]

// geometry (design units; content x 48-664, y 104-400)
const LX = 48, SX = 166, SW = 20, FX = 194, PX = 4.18, MW = 3.2, VP = 7.5, MH = 5.5, GX = 616;
const BASE = [190, 392];
const T0 = 38, T1 = 48;     // arrivals play from T0 to T1

function simDesk(K, rho) {
  const r = K.mulberry32(P.seed), N = P.warm + P.n;
  const A = new Array(N), D = new Array(N), ahead = [];
  let a = 0, dp = 0, p = 0;
  for (let k = 0; k < N; k++) {
    const ea = -Math.log(1 - r()), es = -Math.log(1 - r());
    a += ea / rho; A[k] = a;
    while (p < k && D[p] <= a) p++;
    if (k >= P.warm) ahead.push(k - p);
    const st = Math.max(a, dp); dp = st + es; D[k] = dp;
  }
  const a0 = A[P.warm], a1 = A[N - 1], tau = (x) => T0 + (T1 - T0) * (x - a0) / (a1 - a0);
  const jobs = [];
  for (let k = 0; k < N; k++) if (D[k] > a0) jobs.push({ a: tau(A[k]), d: tau(D[k]) });
  const ta = []; for (let i = 0; i < P.n; i++) ta.push(tau(A[P.warm + i]));
  const cum = [0]; for (let i = 0; i < P.n; i++) cum.push(cum[i] + ahead[i]);
  return { rho, ahead, tau: ta, cum, jobs, total: cum[P.n], mean: cum[P.n] / P.n };
}

function role(el, r) { if (el && el.getAttribute('data-role') !== r) el.setAttribute('data-role', r); return el; }

window.FILM_RENDER = {
  setup(p, K) { DESK = [simDesk(K, P.rhoA), simDesk(K, P.rhoB)]; },

  render(t, s, K) {
    const { tx, ln, rc, seg, ease, eout, lerp, C } = K, ctx = K.ctx;
    const seal = F.commit.at + 4.5;
    const M = (key, x, y, str, o) => role(tx(key, 'labels', x, y, str, o), 'must-read');
    const S2 = (key, x, y, str, o) => role(tx(key, 'labels', x, y, str, o), 'secondary');
    const CH = (key, x, y, str, o) => role(tx(key, 'labels', x, y, str, o), 'chrome');
    let hl = null; F.ledger.forEach((r, i) => { if (t >= r[0]) hl = i; });
    K.chrome(t, null, {
      ledger: { title: 'REVISIONS', rows: F.ledger, hl },
      block: { title: 'QUEUES', lines: ['TWO DESKS', 'FOR REVIEW'], open: 0.4, slotLabel: 'GUESS',
               slot: t >= seal ? (s.answer === 'none' ? 'NONE' : 'SEALED') : null },
    });
    K.roll(t, 0, 1.0);

    /* ── HOOK + COMMIT: a day as 10 hour blocks ── */
    if (t < 16.5) {
      const out = 1 - seg(t, 16.0, 16.5);
      const strip = (key, y, inked, u, op) => {
        for (let i = 0; i < 10; i++) {
          const x = LX + i * 56, on = u * inked > i;
          rc(key + i, 'marks', x, y, 50, 40, on ? { fill: C.ink, op: op * 0.88 } : { fill: 'none', stroke: C.ink, w: 1, op: op * 0.7 });
        }
      };
      const mv = ease(seg(t, 8.0, 8.8)), yB = lerp(210, 272, mv);
      const hookOp = (1 - seg(t, 8.0, 8.5)) * seg(t, 0.2, 0.6);
      strip('hb', yB, P.rhoB * P.hoursPerDay, seg(t, 0.4, 2.2), seg(t, 0.2, 0.5) * out);
      if (hookOp > 0) {
        M('h.t', LX, 196, 'YOUR TEAM', { fam: 'disp', size: 28, op: hookOp, ls: '0.04em' });
        M('h.b', LX, 300, 'BUSY ' + P.rhoB * P.hoursPerDay + ' HOURS OF ' + P.hoursPerDay, { fam: 'disp', size: 40, op: hookOp * seg(t, 2.4, 2.8) });
        M('h.q', LX, 350, 'FULLY USED = EFFICIENT?', { size: 28, op: hookOp * seg(t, 4.5, 5.0) });
      }
      if (t >= 8) {
        const op = seg(t, 8.3, 8.8) * out;
        S2('c.al', LX, 132, 'HALF-BUSY TEAM · ' + P.rhoA * P.hoursPerDay + ' HOURS OF ' + P.hoursPerDay, { size: 16, weight: 500, ls: '0.06em', op });
        strip('ha', 142, P.rhoA * P.hoursPerDay, seg(t, 8.4, 9.4), op);
        M('c.aw', LX, 220, 'A NEW JOB WAITS ≈ ' + Math.round(P.rhoA / (1 - P.rhoA)) + ' JOB-LENGTH', { size: 28, op: op * seg(t, 9.0, 9.4) });
        S2('c.bl', LX, 262, 'YOUR TEAM · ' + P.rhoB * P.hoursPerDay + ' HOURS OF ' + P.hoursPerDay, { size: 16, weight: 500, ls: '0.06em', op });
        M('c.bw', LX, 350, 'A NEW JOB WAITS ≈ ?', { size: 28, op: out * seg(t, 10.6, 11.0) });
      }
    }
    if (t >= 9.5 && t < 16.6) K.commitBox(t, s, { title: F.commit.title, prompt: 'JOB-LENGTHS, 9 OF 10', out: 16.0 });

    /* ── CASE: a ward of 100 beds ── */
    if (t >= 16.0 && t < 36.6) {
      const op = seg(t, 16.2, 16.6) * (1 - seg(t, 36.0, 36.5));
      const gx = 48, gy = 112, pc = 27, sq = 22;
      const full = t < 22 ? 0 : t < 28 ? Math.round(P.bagustRisk * seg(t, 22.0, 23.5))
        : t < 32 ? P.bagustRisk + Math.round((P.bagustCrisis - P.bagustRisk) * seg(t, 28.0, 28.5))
        : P.bagustCrisis + Math.round((Math.round(P.nhsOcc) - P.bagustCrisis) * seg(t, 32.0, 32.3));
      for (let i = 0; i < P.bedsShown; i++) {
        const row = Math.floor(i / 10), col = i % 10, ro = op * seg(t, 16.4 + 0.2 * row, 16.6 + 0.2 * row);
        if (ro <= 0) continue;
        const x = gx + col * pc, y = gy + row * pc;
        if (i < full) { ctx.fillStyle = K.rgba('ink', 0.85 * ro); ctx.fillRect(x, y, sq, sq); }
        else { ctx.strokeStyle = K.rgba('ink', 0.6 * ro); ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, sq - 1, sq - 1); }
      }
      const RX = 360;
      const stage = t < 22 ? 0 : t < 28 ? 1 : t < 32 ? 2 : 3;
      if (stage === 0) S2('k.pre', RX, 262, P.bedsShown + ' BEDS · ONE MODEL HOSPITAL', { size: 16, weight: 500, ls: '0.06em', op: op * seg(t, 18.0, 18.5) });
      else {
        const big = [0, P.bagustRisk, P.bagustCrisis, Math.round(P.nhsOcc)][stage];
        const so = op * seg(t, [0, 22.0, 28.0, 32.0][stage], [0, 22.4, 28.4, 32.4][stage]);
        M('k.big', RX, 220, String(big), { fam: 'disp', size: 96, op: so });
        M('k.of', RX, 262, 'OF ' + P.bedsShown + ' BEDS FULL', { size: 28, op: so });
        const sub = [[], ['THE RISK OF NO BED', 'APPEARS'], ['REGULAR SHORTAGES,', 'PERIODIC CRISES'], ['ENGLAND, ALL HOSPITALS', 'OCT–DEC ' + P.nhsYear]][stage];
        S2('k.s1', RX, 300, sub[0], { size: 16, weight: 500, ls: '0.06em', op: so });
        S2('k.s2', RX, 322, sub[1], { size: 16, weight: 500, ls: '0.06em', op: so });
      }
      CH('k.src', RX, 380, t < 32 ? 'BAGUST ET AL. · BMJ ' + P.bagustYear + ' · MODEL' : 'NHS ENGLAND · BED RETURNS', { size: 12, ls: '0.08em', op: op * 0.85 });
    }

    /* ── COUNT + MONDAY: two desks, 100 arrivals each ── */
    if (t >= 36.0) {
      const op = seg(t, 36.0, 37.0);
      const dimK = 1 - 0.62 * seg(t, 62.0, 62.6);          // MONDAY dims the structure
      const rOut = 1 - seg(t, 62.0, 62.5);                 // readouts leave for the question
      const tc = Math.min(Math.max(t, T0 - 1e-4), T1);     // the desks' clock (frozen outside 38-48)
      const fieldW = P.n * PX;
      const names = ['DESK A', 'DESK B'], busy = [P.rhoA, P.rhoB].map((r) => 'BUSY ' + r * P.hoursPerDay + ' OF ' + P.hoursPerDay);
      const labY = [[164, 184], [300, 320]], cntY = [[116, 152], [206, 244]];
      let last = -1; DESK[0].tau.forEach((x, i) => { if (t >= x) last = i; });
      DESK.forEach((d, j) => {
        const b = BASE[j];
        M('q.n' + j, LX, labY[j][0], names[j], { fam: 'disp', size: 28, op: op * dimK, ls: '0.04em' });
        S2('q.b' + j, LX, labY[j][1], busy[j], { size: 14, weight: 500, ls: '0.06em', op: op * dimK });
        ln('q.base' + j, 'marks', FX - 2, b + 1.5, FX + fieldW, b + 1.5, { stroke: C.ink, w: 1, op: op * dimK });
        ln('q.sb' + j, 'marks', SX - 3, b + 1.5, SX + SW + 3, b + 1.5, { stroke: C.ink, w: 1.6, op: op * dimK });
        // the desk: jobs in the system now (bottom one in service, solid; the rest waiting, lighter)
        let nIn = 0; for (const jb of d.jobs) if (jb.a <= tc && jb.d > tc) nIn++;
        for (let k = 0; k < nIn; k++) {
          ctx.fillStyle = K.rgba('ink', (k === 0 ? 0.9 : 0.45) * op * dimK);
          ctx.fillRect(SX, b - (k + 1) * VP + (VP - MH), SW, MH);
        }
        // the count: one column per arrival, one mark per job found ahead
        let arrived = 0;
        for (let i = 0; i < P.n; i++) {
          const ta = d.tau[i]; if (t < ta) break;
          arrived = i + 1;
          const m = Math.min(d.ahead[i], Math.floor((t - ta) / 0.02) + 1);
          ctx.fillStyle = K.rgba('ink', 0.8 * dimK);
          for (let k = 0; k < m; k++) ctx.fillRect(FX + i * PX, b - (k + 1) * VP + (VP - MH), MW, MH);
        }
        // counters, then the division
        const run = d.cum[arrived], dv = seg(t, 55.0, 55.4);
        if (dv < 1) {
          S2('q.cl' + j, FX, cntY[j][0], 'JOBS FOUND AHEAD', { size: 14, weight: 500, ls: '0.08em', op: op * (1 - dv) * rOut });
          M('q.cv' + j, FX, cntY[j][1], K.fmtK(run), { fam: 'disp', size: 40, op: op * (1 - dv) * rOut });
        }
        if (dv > 0) {
          const each = j === 0 ? '≈ ' + Math.round(d.mean) : '= ' + d.mean.toFixed(1);
          S2('q.dl' + j, FX, cntY[j][0], 'JOBS AHEAD, PER ARRIVAL', { size: 14, weight: 500, ls: '0.08em', op: dv * rOut * dimK });
          M('q.dv' + j, FX, cntY[j][1] - 4, d.total + ' ÷ ' + P.n + ' ' + each, { size: 28, weight: 500, op: dv * rOut });
          ln('q.mean' + j, 'marks', FX - 2, b - d.mean * VP, FX + fieldW, b - d.mean * VP, { stroke: C.ink, w: 1.2, dash: '3 3', op: dv * dimK });
        }
        if (t >= T0 && t < T1 + 0.3 && last >= 0) {
          const x = FX + last * PX + MW / 2;
          ln('q.ph' + j, 'marks', x, b + 5, x, b - (j ? 160 : 60), { stroke: C.muted, w: 0.8, op: 0.7 * (1 - seg(t, T1, T1 + 0.3)) });
        }
      });

      // the viewer's number on desk B, against this run and the long run
      const bB = BASE[1], gO = seg(t, 57.5, 58.0);
      if (gO > 0) {
        if (K.answered(s)) {
          const g = s.answer, gy = bB - Math.min(g, 20) * VP;
          ln('q.g', 'marks', FX - 2, gy, FX + fieldW, gy, { stroke: C.accent, w: 2, op: gO });
          S2('q.gl', LX, 352, 'YOUR GUESS', { size: 14, weight: 500, ls: '0.08em', fill: C.accent, op: gO });
          M('q.gv', LX, 392, (g > 20 ? '↑ ' : '') + K.answerStr(s), { fam: 'disp', size: 40, fill: C.accent, op: gO });
        } else {
          S2('q.gl', LX, 352, 'NO GUESS', { size: 14, weight: 500, ls: '0.08em', fill: C.accent, op: gO });
        }
        const lr = P.rhoB / (1 - P.rhoB), ly = bB - lr * VP;
        ln('q.lr', 'marks', FX - 2, ly, FX + fieldW, ly, { stroke: C.ink, w: 1.8, op: gO });
        M('q.lrv', GX + 8, ly + 10, String(Math.round(lr)), { size: 28, weight: 500, op: gO });
        const lo = gO * (1 - seg(t, 60.0, 60.4));
        if (lo > 0) S2('q.lrl', GX + 8, ly + 28, 'LONG RUN', { size: 14, weight: 500, op: lo });
      }
      // the ladder: 50 / 80 / 95 % on the same axis (90 % is the long-run rule above)
      const la = seg(t, 60.0, 61.0);
      if (la > 0) {
        [[P.rhoA, 'a'], [P.rho80, 'b'], [P.rho95, 'd']].forEach(([r, k], i) => {
          const v = Math.round(r / (1 - r)), y = bB - v * VP, o = la * seg(t, 60.0 + 0.25 * i, 60.4 + 0.25 * i);
          ln('q.lt' + k, 'marks', FX + fieldW, y, GX + 4, y, { stroke: C.ink, w: 1, op: o });
          S2('q.lv' + k, GX + 8, y + 7, String(v), { size: 20, weight: 500, op: o });
          S2('q.lp' + k, GX + 40, y + 6, Math.round(r * 100) + ' %', { size: 14, op: o });
        });
        S2('q.lpc', GX + 40, bB - 9 * VP + 6, Math.round(P.rhoB * 100) + ' %', { size: 14, op: la });
      }
      // MONDAY: one question over the dimmed count
      const mo = seg(t, 62.4, 63.0);
      if (mo > 0) M('m.q', LX, 238, 'WHO RUNS ABOVE ' + P.bagustRisk + ' % BUSY?', { fam: 'disp', size: 36, op: mo, ls: '0.03em' });
    }
  },

  tryit(v, s, K) {
    const r = Math.min(0.98, Math.max(0.1, v.busy / 100)), m = r / (1 - r);
    return `<div class="ex">ONE DESK · LONG RUN</div><div class="big">${v.busy} % → ${m.toFixed(1)}</div>` +
      `<div class="ex">jobs found ahead per arrival = wait in job-lengths · ρ/(1−ρ)</div>` +
      (typeof s.answer === 'number' ? `<p>You sealed ${s.answer} for 90 %; the long run is 9.</p>` : '');
  },
};
})();
