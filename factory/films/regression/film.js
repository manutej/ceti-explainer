/* regression · "The Flight Instructors" · regression to the mean, a 75-second case.
   One clock: render(t, state, K) draws frame t from the frozen sample in FILM.params (skill, luck1, luck2).
   Marks are canvas mass; every word and number is retained SVG. No randomness at render time. */
(function () {
'use strict';
const F = window.FILM, P = F.params;
const N = P.skill.length, TOPK = P.topK;
const CX_T = 200, CX_M = 420, MW = 14, STEP = 16;          // the two columns (S1)
const yOf = (s) => 396 - (s - 24) * 4.6;                    // shared score scale, 83 -> 124.6, 50 -> 276.4, 26 -> 386.8
const PX = 506;                                             // right panel of the content area (x 506 to 664)
let T, M, XT, XM, TOP, BOT, RANK, ARR, TOPAVG_T, TOPAVG_M;

function swarm(scores, cx) {                               // ties sit side by side, by pilot index
  const g = {}, x = [];
  scores.forEach((s, i) => (g[s] = g[s] || []).push(i));
  Object.keys(g).forEach((s) => g[s].forEach((i, k) => (x[i] = cx + (k - (g[s].length - 1) / 2) * STEP)));
  return x;
}
const avg = (a) => a.reduce((x, y) => x + y, 0) / a.length;

window.FILM_RENDER = {
  setup(p, K) {
    T = P.skill.map((s, i) => s + P.luck1[i]);
    M = P.skill.map((s, i) => s + P.luck2[i]);
    const ord = [...Array(N).keys()].sort((a, b) => T[b] - T[a] || a - b);
    TOP = ord.slice(0, TOPK); BOT = ord.slice(N - TOPK);
    RANK = []; ord.forEach((i, k) => (RANK[i] = k));
    XT = swarm(T, CX_T); XM = swarm(M, CX_M);
    ARR = []; K.shuffle([...Array(N).keys()], 36).forEach((i, j) => (ARR[i] = j));
    TOPAVG_T = avg(TOP.map((i) => T[i])); TOPAVG_M = avg(TOP.map((i) => M[i]));
  },

  render(t, s, K) {
    const { ln, rc, path, seg, ease, eout, lerp, C } = K;
    const tx = (key, layer, x, y, str, o, role) => { const el = K.tx(key, layer, x, y, str, o); el.setAttribute('data-role', role || ((o && o.size) >= 28 ? 'must-read' : 'secondary')); return el; };
    const A = F.commit.at, seal = A + 4.5;
    const lab = s.answer === 'none' ? 'NO ANSWER' : 'SEALED';
    K.chrome(t, null, {
      ledger: { title: 'CASE LOG', rows: F.ledger.filter((r) => t >= 16 || r[0] < 16), hl: t >= 62.4 ? 4 : t >= 36.4 ? 3 : t >= 16.4 ? 2 : null },
      block: { title: 'REGRESSION', lines: ['FLIGHT SCHOOL', 'PILOTS · TWO DAYS'], open: 0.4, slotLabel: 'GUESS', slot: t >= seal ? lab : null },
    });
    K.roll(t, 0, 1.0);
    const ctx = K.ctx;

    /* ── HOOK 0–8: ten regions, one quarter on (S1, no digits) ── */
    const ho = 1 - seg(t, 7.6, 8.2);
    if (ho > 0) {
      ln('hk.avg', 'marks', 120, yOf(50), 500, yOf(50), { dash: '4 4', op: 0.5 * ho * seg(t, 0, 0.6) });
      tx('hk.h0', 'labels', CX_T, 112, 'LAST QUARTER', { size: 14, anchor: 'middle', op: ho * seg(t, 0.2, 0.7), weight: 500, ls: '0.12em' });
      tx('hk.h1', 'labels', CX_M, 112, 'THIS QUARTER', { size: 14, anchor: 'middle', op: ho * seg(t, 0.2, 0.7), weight: 500, ls: '0.12em' });
      F.regions.forEach(([a, b], k) => {
        const u = eout(seg(t, 0.3 + k * 0.12, 0.7 + k * 0.12)); if (u <= 0) return;
        const m = ease(seg(t, 3.8 + k * 0.05, 5.8 + k * 0.05));
        const worst = k === F.regions.length - 1, lit = worst ? seg(t, 1.8, 2.4) : 0;
        const x = lerp(CX_T, CX_M, m), y = lerp(yOf(a), yOf(b), m) - 30 * (1 - u);
        if (worst && m > 0) ln('hk.tr', 'marks', CX_T, yOf(a), x, y, { stroke: C.accent, w: 1.5, op: ho });
        rc('hk.r' + k, 'marks', x - 20, y - 2, 40, 4, { fill: lit > 0 ? C.accent : C.ink, op: u * ho * (worst ? 1 : 0.85) });
      });
      tx('hk.nm', 'labels', CX_T - 30, yOf(34) + 5, 'NEW MANAGER', { size: 14, anchor: 'end', fill: C.accent, weight: 500, ls: '0.08em', op: ho * seg(t, 1.8, 2.6) });
    }

    /* ── COMMIT 8–16: the question; the kit's sealed box on the right ── */
    if (t >= 7 && t < 16.2) {
      K.commitBox(t, s, { title: F.commit.title, prompt: "OF TODAY'S TOP 10", out: 15.6 });
      const qo = seg(t, 8.2, 8.8) * (1 - seg(t, 15.6, 16.1));
      if (qo > 0) {
        tx('cm.q0', 'labels', 48, 196, "Of today's 10 best landings,", { fam: 'disp', size: 36, op: qo });
        tx('cm.q1', 'labels', 48, 240, 'how many land worse tomorrow?', { fam: 'disp', size: 36, op: qo, fill: C.accent });
        tx('cm.s', 'labels', 48, 288, '100 PILOTS · NOBODY PRAISES OR SHOUTS', { size: 14, op: qo * 0.9, weight: 500, ls: '0.08em' });
      }
    }

    /* ── CASE 16–36: the flight log (S3) ── */
    const co = seg(t, 16.0, 16.4) * (1 - seg(t, 35.8, 36.1));
    if (co > 0) {
      const qa = 1 - seg(t, 25.8, 26.2);
      if (qa > 0) {
        const dim1 = 1 - 0.6 * seg(t, 25.0, 25.4);
        tx('cs.q0', 'labels', 48, 160, 'Praise a smooth landing: the next is worse.', { fam: 'disp', size: 32, op: co * qa * seg(t, 16.4, 16.9) * dim1 });
        tx('cs.q1', 'labels', 48, 205, 'Shout at a rough one: the next is better.', { fam: 'disp', size: 32, op: co * qa * seg(t, 21.2, 21.7) * dim1 });
        tx('cs.v', 'labels', 48, 262, 'Verdict: punishment works.', { fam: 'disp', size: 32, fill: C.accent, op: co * qa * seg(t, 23.4, 23.9) });
        const su = ease(seg(t, 25.0, 25.6));
        if (su > 0) ln('cs.vx', 'labels', 46, 251, 46 + 300 * su, 251, { stroke: C.accent, w: 2.4, op: co * qa });
      }
      if (t < 30.4) {
        const so = co * seg(t, 16.4, 17) * (1 - seg(t, 30.0, 30.4)) * 0.85;
        tx('cs.src0', 'labels', 48, 326, 'TVERSKY & KAHNEMAN, SCIENCE, 1974', { size: 14, op: so, ls: '0.02em' });
        tx('cs.src1', 'labels', 48, 346, 'KAHNEMAN, THINKING, FAST AND SLOW, 2011, CH. 17', { size: 14, op: so, ls: '0.02em' });
      }
      // the equation: centre, then up to the top as the bars arrive
      const eo = seg(t, 26.0, 26.5) * co;
      if (eo > 0) {
        const big = 1 - seg(t, 29.9, 30.3), small = seg(t, 30.3, 30.7);
        if (big > 0) tx('cs.eq', 'labels', 356, 232, 'LANDING = SKILL + LUCK', { fam: 'disp', size: 52, anchor: 'middle', op: eo * big, ls: '0.04em' });
        if (small > 0) tx('cs.eq2', 'labels', 48, 126, 'LANDING = SKILL + LUCK', { fam: 'disp', size: 28, op: eo * small, ls: '0.04em' });
        tx('cs.eqs', 'labels', 356, 286, 'skill stays · luck is redrawn', { size: 28, anchor: 'middle', op: eo * (1 - seg(t, 30.0, 30.4)), weight: 500 });
      }
      if (t >= 30.4) {
        const X0 = 160, SC = 5.2, xs = (v) => X0 + v * SC, bo = co * seg(t, 30.4, 30.8);
        ln('cs.avg', 'marks', xs(50), 136, xs(50), 330, { dash: '4 4', op: 0.6 * bo });
        tx('cs.avgl', 'labels', xs(50) + 6, 146, 'AVG · 50', { size: 14, op: bo, weight: 500, ls: '0.06em' });
        const rows = [['BEST TODAY', 166, 65, 18, 30.6], ['NEXT DAY', 212, 65, -6, 31.8], ['WORST TODAY', 268, 32, -6, 33.0], ['NEXT DAY', 318, 32, 5, 34.2]];
        rows.forEach(([name, y, sk, lu, t0], r) => {
          const u1 = ease(seg(t, t0, t0 + 0.5)), u2 = ease(seg(t, t0 + 0.5, t0 + 0.9)), ro = bo * seg(t, t0 - 0.2, t0);
          if (ro <= 0) return;
          tx('cs.rl' + r, 'labels', X0 - 8, y + 5, name, { size: 14, anchor: 'end', op: ro, weight: 500, ls: '0.06em' });
          const inkW = (lu < 0 ? sk + lu * u2 : sk) * SC * u1;
          rc('cs.bk' + r, 'marks', X0, y - 11, inkW, 22, { fill: C.ink, op: ro });
          if (lu > 0) rc('cs.bl' + r, 'marks', xs(sk), y - 11, lu * SC * u2, 22, { fill: C.accent, op: ro });
          else if (u2 > 0) rc('cs.bl' + r, 'marks', xs(sk + lu), y - 11, -lu * SC, 22, { fill: C.accent, fo: 0.25, stroke: C.accent, w: 1.2, op: ro * u2, dash: '3 2' });
          if (u1 > 0.6) tx('cs.sk' + r, 'labels', X0 + 8, y + 7, String(sk), { size: 20, fill: C.chalk, op: ro, weight: 500 });
          if (u2 > 0) {
            const lx = lu > 0 ? xs(sk + lu / 2) : xs(sk + lu / 2);
            tx('cs.lu' + r, 'labels', lx, y - 16, (lu > 0 ? '+' : '−') + Math.abs(lu), { size: 20, anchor: 'middle', fill: C.accent, op: ro * u2, weight: 500 });
            tx('cs.end' + r, 'labels', xs(Math.max(sk, sk + lu)) + 10, y + 10, String(sk + lu), { size: 28, op: ro * u2, weight: 500 });
          }
        });
      }
    }

    /* ── COUNT 36–62: a hundred landings, twice (S1) ── */
    const ko = seg(t, 36.0, 36.4) * (1 - seg(t, 61.8, 62.2));
    if (ko > 0) {
      tx('ct.h0', 'labels', CX_T, 112, 'TODAY', { size: 14, anchor: 'middle', op: ko, weight: 500, ls: '0.14em' });
      tx('ct.h1', 'labels', CX_M, 112, 'TOMORROW', { size: 14, anchor: 'middle', op: ko * seg(t, 40.8, 41.2), weight: 500, ls: '0.14em' });
      ln('ct.avg', 'marks', 120, yOf(50), 496, yOf(50), { dash: '4 4', op: 0.55 * ko });
      tx('ct.avgl', 'labels', 48, yOf(50) + 5, 'AVG · 50', { size: 14, op: ko, weight: 500, ls: '0.04em' });

      const dimU = seg(t, 39.6, 40.4), botU = seg(t, 56.0, 56.4);
      const isTop = new Set(TOP), isBot = new Set(BOT);
      // ghosts: where the lit pilots stood today
      const ghost = (i, col, a) => { ctx.strokeStyle = K.rgba(col, a); ctx.lineWidth = 1; ctx.strokeRect(XT[i] - MW / 2, yOf(T[i]) - 1.5, MW, 3); };
      for (let i = 0; i < N; i++) {
        const ta = 36.4 + ARR[i] * 0.028, ua = eout(seg(t, ta, ta + 0.35));
        if (ua <= 0) continue;
        let mv;
        if (isTop.has(i)) { const tq = 42.4 + RANK[i] * 0.45; mv = ease(seg(t, tq, tq + 0.6)); }
        else mv = ease(seg(t, 41.0 + i * 0.002, 42.0 + i * 0.002));
        const x0 = XT[i], y0 = yOf(T[i]) - 40 * (1 - ua), x = lerp(x0, XM[i], mv), y = lerp(y0, yOf(M[i]), mv);
        let col = 'ink', a = ua * ko * lerp(0.85, 0.3, dimU);
        if (isTop.has(i)) { col = dimU > 0 ? 'accent' : 'ink'; a = ua * ko * (0.85 + 0.15 * dimU); if (botU > 0) a *= 1 - 0.5 * botU; }
        if (isBot.has(i) && botU > 0) a = ko * lerp(0.3, 1, botU);
        if (mv > 0 && !isTop.has(i) && !(isBot.has(i) && botU > 0)) { ctx.fillStyle = K.rgba('ink', 0.22 * ko * mv); ctx.fillRect(x0 - MW / 2, yOf(T[i]) - 1.5, MW, 3); }
        if (isTop.has(i) && mv > 0) {
          ghost(i, 'accent', 0.5 * ko * (botU > 0 ? 1 - 0.5 * botU : 1));
          ctx.strokeStyle = K.rgba('accent', 0.75 * ko * (botU > 0 ? 1 - 0.5 * botU : 1)); ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(x0 + MW / 2, yOf(T[i])); ctx.lineTo(x - MW / 2, y); ctx.stroke();
        }
        if (isBot.has(i) && botU > 0) {
          const qb = N - 1 - RANK[i], lu = ease(seg(t, 56.0 + qb * 0.08, 56.8 + qb * 0.08));
          ghost(i, 'ink', 0.6 * ko);
          if (lu > 0) {
            ctx.strokeStyle = K.rgba('ink', 0.8 * ko); ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(x0 + MW / 2, yOf(T[i])); ctx.lineTo(lerp(x0 + MW / 2, XM[i] - MW / 2, lu), lerp(yOf(T[i]), yOf(M[i]), lu)); ctx.stroke();
          }
        }
        ctx.fillStyle = K.rgba(col, a);
        ctx.fillRect(x - MW / 2, y - 1.5, MW, 3);
      }

      // right panel: landings counter
      const cu = 1 - seg(t, 39.4, 39.8);
      if (t >= 36.4 && cu > 0) {
        const n = Math.max(0, Math.min(N, Math.floor((t - 36.4 - 0.35) / 0.028) + 1));
        tx('ct.n', 'labels', PX, 170, String(n), { size: 48, op: ko * cu, weight: 500 });
        tx('ct.nl', 'labels', PX, 194, 'LANDINGS', { size: 14, op: ko * cu, weight: 500, ls: '0.12em' });
      }
      // top-10 tally
      const to = seg(t, 39.6, 40.0) * (1 - seg(t, 56.0, 56.3)) * ko;
      if (to > 0) {
        tx('ct.tl', 'labels', PX, 128, 'TOP 10 TODAY', { size: 14, op: to, weight: 500, ls: '0.1em', fill: C.accent });
        let worse = 0;
        TOP.forEach((i, q) => {
          const landed = t >= 42.4 + q * 0.45 + 0.6, w = M[i] < T[i];
          if (landed && w) worse++;
          rc('ct.b' + q, 'marks', PX + q * 15.5, 138, 12, 12, { stroke: C.accent, w: 1, fill: landed ? (w ? C.accent : C.paper) : C.paper, op: to });
          if (landed && !w) ln('ct.bu' + q, 'marks', PX + q * 15.5 + 6, 147, PX + q * 15.5 + 6, 141, { stroke: C.ink, w: 1.4, op: to });
        });
        const ru = seg(t, 42.6, 42.9) * (1 - seg(t, 46.9, 47.2));
        if (ru > 0) tx('ct.run', 'labels', PX, 186, 'WORSE ' + worse, { fam: 'disp', size: 28, op: to * ru, fill: C.accent, ls: '0.04em' });
        const hu = seg(t, 47.0, 47.4) * to;
        if (hu > 0) {
          tx('ct.big', 'labels', PX, 250, String(worse), { fam: 'disp', size: 80, op: hu, fill: C.accent });
          tx('ct.of', 'labels', PX + 46, 216, 'OF 10', { fam: 'disp', size: 28, op: hu, ls: '0.04em' });
          tx('ct.lw', 'labels', PX + 46, 248, 'LAND WORSE', { fam: 'disp', size: 28, op: hu, ls: '0.04em' });
        }
        // the committed number against the count
        const gu = seg(t, 52.0, 52.4) * to;
        if (gu > 0) {
          const rx = (v) => PX + 6 + v * 14, ry = 352;
          ln('ct.rail', 'marks', rx(0), ry, rx(10), ry, { w: 1.2, op: gu });
          for (let v = 0; v <= 10; v++) ln('ct.tk' + v, 'marks', rx(v), ry - 3, rx(v), ry + 3, { w: 1, op: gu * 0.7 });
          tx('ct.r0', 'labels', rx(0), ry + 20, '0', { size: 14, anchor: 'middle', op: gu });
          tx('ct.r1', 'labels', rx(10), ry + 20, '10', { size: 14, anchor: 'middle', op: gu });
          if (K.answered(s)) {
            const g = Math.max(0, Math.min(10, s.answer));
            path('ct.ym', 'marks', `M ${rx(g) - 5} ${ry - 12} L ${rx(g) + 5} ${ry - 12} L ${rx(g)} ${ry - 5} Z`, { fill: C.ink, stroke: C.ink, w: 1, op: gu });
            tx('ct.yl', 'labels', Math.max(PX, Math.min(rx(g), 600)), ry - 18, 'YOU ' + g, { fam: 'disp', size: 28, anchor: rx(g) < PX + 40 ? 'start' : 'middle', op: gu, ls: '0.04em' });
          } else tx('ct.yl', 'labels', PX, ry - 18, 'YOU —', { fam: 'disp', size: 28, op: gu * 0.6, ls: '0.04em' });
          const cw = seg(t, 52.6, 53.0) * to;
          path('ct.cm', 'marks', `M ${rx(worse) - 5} ${ry + 12} L ${rx(worse) + 5} ${ry + 12} L ${rx(worse)} ${ry + 5} Z`, { fill: C.accent, stroke: C.accent, w: 1, op: cw });
          tx('ct.cl', 'labels', 662, ry + 44, 'COUNT ' + worse, { fam: 'disp', size: 28, anchor: 'end', fill: C.accent, op: cw, ls: '0.04em' });
        }
      }
      // bottom-10 tally
      const bo = seg(t, 56.3, 56.6) * (1 - seg(t, 59.2, 59.5)) * ko;
      if (bo > 0) {
        tx('ct.bl', 'labels', PX, 128, 'BOTTOM 10 TODAY', { size: 14, op: bo, weight: 500, ls: '0.1em' });
        let better = 0;
        BOT.forEach((i, q) => {
          const qb = N - 1 - RANK[i], done = t >= 56.8 + qb * 0.08, b = M[i] > T[i];
          if (done && b) better++;
          rc('ct.bb' + q, 'marks', PX + q * 15.5, 138, 12, 12, { stroke: C.ink, w: 1, fill: done && b ? C.ink : C.paper, op: bo });
        });
        const hb = seg(t, 57.6, 58.0) * bo;
        if (hb > 0) {
          tx('ct.bbig', 'labels', PX, 250, String(better), { fam: 'disp', size: 80, op: hb });
          tx('ct.bof', 'labels', PX + 46, 216, 'OF 10', { fam: 'disp', size: 28, op: hb, ls: '0.04em' });
          tx('ct.blb', 'labels', PX + 46, 248, 'LAND BETTER', { fam: 'disp', size: 28, op: hb, ls: '0.04em' });
        }
      }
      // halfway, only after every count
      const fo = seg(t, 59.4, 59.9) * ko;
      if (fo > 0) {
        const yT = yOf(TOPAVG_T), yM = yOf(TOPAVG_M), y5 = yOf(50);
        ln('ct.at', 'labels', CX_T - 66, yT, CX_T + 66, yT, { stroke: C.accent, w: 1.6, op: fo });
        ln('ct.am', 'labels', CX_M - 66, yM, CX_M + 66, yM, { stroke: C.accent, w: 1.6, op: fo });
        [['ct.kt', 124, yT], ['ct.km', 494, yM]].forEach(([k, x, y]) => {
          ln(k + 'v', 'labels', x, y5, x, y, { stroke: C.accent, w: 1.4, op: fo });
          ln(k + 'a', 'labels', x - 4, y, x + 4, y, { stroke: C.accent, w: 1.4, op: fo });
          ln(k + 'b', 'labels', x - 4, y5, x + 4, y5, { stroke: C.accent, w: 1.4, op: fo });
        });
        tx('ct.ft', 'labels', PX, 128, 'TOP 10 · ABOVE AVG', { size: 14, op: fo, weight: 500, ls: '0.06em', fill: C.accent });
        tx('ct.f0', 'labels', PX, 170, '+' + Math.round(TOPAVG_T - 50) + ' TODAY', { fam: 'disp', size: 28, op: fo, ls: '0.04em' });
        tx('ct.f1', 'labels', PX, 204, '+' + Math.round(TOPAVG_M - 50) + ' TOMORROW', { fam: 'disp', size: 28, op: fo, ls: '0.04em' });
        const hu2 = seg(t, 60.2, 60.6) * fo;
        tx('ct.h2a', 'labels', PX, 262, 'HALF THE GAP', { fam: 'disp', size: 28, op: hu2, fill: C.accent, ls: '0.04em' });
        tx('ct.h2b', 'labels', PX, 294, 'WAS LUCK', { fam: 'disp', size: 28, op: hu2, fill: C.accent, ls: '0.04em' });
        tx('ct.h2c', 'labels', PX, 320, 'MODEL r = ' + P.r + ', DECLARED', { size: 14, op: hu2, weight: 500 });
      }
    }

    /* ── MONDAY 62–72: one question, one limit (S4) ── */
    const mo = seg(t, 62.2, 62.8);
    if (mo > 0) {
      tx('mo.q0', 'labels', 48, 160, 'The worst region improved.', { fam: 'disp', size: 34, op: mo });
      tx('mo.q1', 'labels', 48, 205, 'What did the other worst regions', { fam: 'disp', size: 34, op: mo * seg(t, 62.8, 63.3), fill: C.accent });
      tx('mo.q2', 'labels', 48, 245, 'do with no new manager?', { fam: 'disp', size: 34, op: mo * seg(t, 62.8, 63.3), fill: C.accent });
      const lo = seg(t, 67.6, 68.1);
      if (lo > 0) {
        tx('mo.lh', 'labels', 48, 296, 'HONEST LIMIT', { size: 14, op: lo * 0.85, weight: 500, ls: '0.16em' });
        tx('mo.l0', 'labels', 48, 330, 'These are 100 model pilots, not flight data.', { fam: 'disp', size: 30, op: lo });
        tx('mo.l1', 'labels', 48, 366, 'And one quarter cannot judge a manager.', { fam: 'disp', size: 30, op: lo });
      }
    }
  },

  // try-it: the model lines for another r; the drawn sample never changes
  tryit(v, s, K) {
    const r = +v.r, z = 1.2815515655, k = Math.sqrt(1 - r * r);
    const pdf = (x) => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
    const cdf = (x) => { const tt = 1 / (1 + 0.2316419 * Math.abs(x)), d = pdf(x) * tt * (0.31938153 + tt * (-0.356563782 + tt * (1.781477937 + tt * (-1.821255978 + tt * 1.330274429)))); return x >= 0 ? 1 - d : d; };
    let w = 0, st = 0; const h = 0.002;
    for (let x = z + h / 2; x < z + 10; x += h) { const g = pdf(x) * h / 0.1; w += g * cdf((1 - r) * x / k); st += g * (1 - cdf((z - r * x) / k)); }
    const gap = 10 * pdf(z) / 0.1;
    return `<div class="ex">THE MODEL AT r = ${r.toFixed(1)}</div>` +
      `<div class="big">${(10 * w).toFixed(1)} OF 10 LAND WORSE</div>` +
      `<p>Top tenth today: +${gap.toFixed(1)} above average. Expected next time: +${(r * gap).toFixed(1)}. Expected still in the top 10: ${(10 * st).toFixed(1)}.</p>` +
      `<p>The drawn sample (r = 0.5): 8 of 10 worse, 3 stayed top 10, bottom 10 averaged 33 → 42.</p>` +
      (typeof s.answer === 'number' ? `<p>You sealed ${s.answer}.</p>` : '');
  },
};
})();
