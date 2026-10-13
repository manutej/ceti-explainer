/* volatility-drag · "The average is not your outcome" (75 s case).
   HOOK the bet · COMMIT what is left of £100 · CASE one player, ×0.9 a pair · COUNT 100 players × 100 rounds
   under the expected-value line · MONDAY the question and the limit. Brand card drawn by the kit at 72 s.
   Pure: render(t, state) reads only t, state and tables built once in setup from a seeded mulberry32. */
(function () {
'use strict';
const F = window.FILM, P = F.params;
const N = P.players, R = P.rounds;
const LOG_UP = Math.log10(P.up), LOG_DN = Math.log10(P.down), LOG_S = Math.log10(P.start), LOG_EV = Math.log10((P.up + P.down) / 2);

/* ── tables (setup) ── */
let LG = null;      // log10 stake, LG[q * (R + 1) + r]
let FINAL = null;   // final stake per player (same arithmetic as claims.json)
let RANK = null;    // rank of player q at round R (ascending by stake, ties by q)
let NLOST = 0, NUNDER1 = 0;

/* ── layout (design units; structure inside x 48–664, y 104–400) ── */
const BY = 390, SC = 1.4;                                   // S1: linear, 1.4 units per £
const FX0 = 108, SLOT = 5.4, BW = 3.8, GG = 0.9;           // S3: 100 bars
const slotX = (i) => FX0 + SLOT * i + GG * Math.floor(i / 10);
const YT = 160, YB = 390, DEC = (YB - YT) / 8;              // log axis: 1p (390) to £1M (160)
const yLog = (lg) => Math.max(YT, Math.min(YB, YB - DEC * (lg + 2)));
const T_ROUNDS = 37.8, DT = 0.12, T_SORT = 49.8, T_LOST = 51.8, T_UNDER = 53.6, T_TYP = 55.6, T_GUESS = 57.6, T_RATES = 60.6, T_MON = 62;

function role(el, r) { if (el && el.getAttribute('data-role') !== r) el.setAttribute('data-role', r); return el; }
function M(K, key, x, y, s, o) { return role(K.tx(key, 'labels', x, y, s, Object.assign({ size: 28, weight: 500 }, o)), 'must-read'); }
function S2(K, key, x, y, s, o) { return role(K.tx(key, 'labels', x, y, s, Object.assign({ size: 16, ls: '0.06em' }, o)), 'secondary'); }
const money = (v) => (v >= 100 || Math.abs(v - Math.round(v)) < 1e-6) ? '£' + Math.round(v).toLocaleString('en-US') : '£' + v.toFixed(2);
function guessStr(a) { return Number.isInteger(a) ? a.toLocaleString('en-US') : (+a).toFixed(2); }

// a stamp whose text carries a role (the kit's stamp does not return its text element)
function seal(K, key, cx, cy, s, text, op) {
  if (op <= 0) return;
  const { rc, tx, C } = K, w = 150 * s, h = 46 * s, tr = `rotate(-7 ${cx.toFixed(1)} ${cy.toFixed(1)})`;
  rc(key + 'f', 'marks', cx - w / 2, cy - h / 2, w, h, { fill: C.chalk, stroke: C.ink, w: 2.4 * s, rx: 5 * s, op, tr });
  rc(key + 'i', 'marks', cx - w / 2 + 4 * s, cy - h / 2 + 4 * s, w - 8 * s, h - 8 * s, { stroke: C.ink, w: 0.9 * s, rx: 3 * s, op, tr });
  role(tx(key + 't', 'marks', cx, cy + 10 * s, text, { fam: 'disp', size: 28 * s, anchor: 'middle', fill: C.ink, op, ls: '0.08em', tr }), 'secondary');
}

/* ═════════ HOOK + COMMIT: the bet (S1) and the commit (S2) ═════════ */
function hook(t, s, K) {
  const { seg, ease, ln, rgba, ctx } = K;
  const dimB = 1 - 0.75 * seg(t, 8.4, 9.2), out = 1 - seg(t, 15.6, 16.0);
  const lab = (1 - seg(t, 8.4, 9.0)) * out;                 // labels leave for the commit
  const bar = (x, v, u) => { const h = v * SC * ease(u); ctx.fillStyle = rgba('ink', 0.88 * dimB * out); ctx.fillRect(x, BY - h, 70, h); };
  bar(64, P.start, seg(t, 0.2, 1.2));
  bar(250, P.start * P.up, seg(t, 1.4, 2.4));
  bar(400, P.start * P.down, seg(t, 1.8, 2.8));
  ln('h.base', 'marks', 56, BY + 0.5, 480, BY + 0.5, { op: 0.6 * dimB * out });
  M(K, 'h.s', 99, BY - 100 * SC - 12, money(P.start), { anchor: 'middle', op: lab * seg(t, 0.6, 1.0) });
  const lu = seg(t, 1.2, 1.6) * lab;
  ln('h.l1', 'marks', 134, BY - 140, 250, BY - 210, { op: 0.45 * lu });
  ln('h.l2', 'marks', 134, BY - 140, 400, BY - 84, { op: 0.45 * lu });
  const hu = seg(t, 2.0, 2.4) * lab, tu = seg(t, 2.4, 2.8) * lab;
  S2(K, 'h.hl', 285, 140, 'HEADS ×' + P.up, { anchor: 'middle', op: hu });
  M(K, 'h.hv', 285, 172, money(P.start * P.up), { anchor: 'middle', op: hu });
  S2(K, 'h.tl', 435, 268, 'TAILS ×' + P.down, { anchor: 'middle', op: tu });
  M(K, 'h.tv', 435, 298, money(P.start * P.down), { anchor: 'middle', op: tu });
  const au = seg(t, 3.4, 4.0) * lab, ya = BY - P.start * (P.up + P.down) / 2 * SC;
  ln('h.avg', 'marks', 240, ya, 240 + 240 * ease(seg(t, 3.4, 4.0)), ya, { op: au, dash: '6 4', w: 1.4 });
  S2(K, 'h.al', 490, ya - 10, 'AVERAGE', { op: au });
  M(K, 'h.av', 490, ya + 22, money(P.start * (P.up + P.down) / 2), { op: au });
  // COMMIT: the question on the sheet, the box in the right column
  const qa = seg(t, 8.6, 9.2) * out;
  if (qa > 0) {
    role(K.tx('q.h', 'labels', 64, 168, 'WHAT IS LEFT OF £100?', { fam: 'disp', size: 44, op: qa, ls: '0.02em' }), 'must-read');
    S2(K, 'q.s1', 64, 200, 'HEADS ×' + P.up + ' · TAILS ×' + P.down + ' · ' + R + ' ROUNDS', { op: qa });
    S2(K, 'q.s2', 64, 224, 'ALL REINVESTED · THE TYPICAL PLAYER', { op: qa });
  }
  if (t >= 8.8 && t < 16.2) {
    const A = F.commit.at, at = A + 4.5;
    const cb = K.commitBox(t, s, { title: F.commit.title, prompt: 'THE TYPICAL PLAYER', seal: 1e9, out: 15.6 });
    if (t >= at && cb.op > 0) { const k = seg(t, at, at + 0.22); seal(K, 'cs.', 815, 252, K.lerp(1.3, 0.9, K.eout(k)), s.answer === 'none' || s.answer == null ? 'NO ANSWER' : 'SEALED', k * cb.op); }
  }
}

/* ═════════ CASE: one player (S1 again) ═════════ */
function caseScene(t, s, K) {
  const { seg, ease, rc, ln, rgba, ctx, C } = K;
  const op = seg(t, 16.0, 16.6) * (1 - seg(t, 36.0, 36.6));
  if (op <= 0) return;
  const pf = P.up * P.down;
  // the bar's value, piecewise in t
  let v = P.start;
  if (t >= 16.8) v = K.lerp(P.start, P.start * P.up, ease(seg(t, 16.8, 17.6)));
  if (t >= 18.6) v = K.lerp(P.start * P.up, P.start * pf, ease(seg(t, 18.6, 19.4)));
  if (t >= 20.6) v = K.lerp(P.start * pf, P.start, ease(seg(t, 20.6, 21.0)));
  if (t >= 21.2) v = K.lerp(P.start, P.start * P.down, ease(seg(t, 21.2, 21.8)));
  if (t >= 22.4) v = K.lerp(P.start * P.down, P.start * pf, ease(seg(t, 22.4, 23.0)));
  let n = 0;
  if (t >= 25.6) { const x = Math.min(R / 2, (t - 25.6) / 0.1), k = Math.floor(x); n = Math.min(R / 2, k + ease(Math.min(1, (x - k) / 0.7))); v = P.start * Math.pow(pf, n); }
  const h = v * SC, fin = t >= 30.6;
  ctx.fillStyle = fin ? rgba('accent', 0.95 * op) : rgba('ink', 0.88 * op);
  ctx.fillRect(64, BY - h, 80, h);                                       // true scale: £0.52 is 0.72 units
  rc('c.ghost', 'marks', 64, BY - P.start * SC, 80, P.start * SC, { stroke: C.ink, w: 1, dash: '5 4', op: 0.7 * op });
  ln('c.base', 'marks', 56, BY + 3, 180, BY + 3, { op: 0.6 * op });   // below the bar, so the 0.72-unit hairline shows
  S2(K, 'c.gl', 104, BY - P.start * SC - 8, 'START £' + P.start, { anchor: 'middle', op: op * seg(t, 16.2, 16.6) * (1 - seg(t, 25.0, 25.4)) });
  // −£10 against the ghost
  const gl = seg(t, 19.4, 19.8) * (1 - seg(t, 20.2, 20.6)) * op;
  S2(K, 'c.gap', 150, BY - P.start * SC + 18, '−£' + Math.round((1 - pf) * P.start), { op: gl, fill: C.accent });
  // ledger, first set
  const o1 = op * (1 - seg(t, 25.0, 25.4)), X = 200;
  M(K, 'c.r1', X, 170, 'HEADS ×' + P.up + ': ' + money(P.start * P.up), { op: o1 * seg(t, 16.8, 17.2) });
  M(K, 'c.r2', X, 214, 'TAILS ×' + P.down + ': ' + money(P.start * pf), { op: o1 * seg(t, 18.6, 19.0) });
  M(K, 'c.r3', X, 258, 'TAILS FIRST: ' + money(P.start * P.down) + ', ' + money(P.start * pf), { op: o1 * seg(t, 21.2, 21.6) });
  M(K, 'c.r4', X, 302, 'EACH PAIR: ×' + (Math.round(pf * 1e9) / 1e9), { op: o1 * seg(t, 23.6, 24.0), fill: C.accent });
  // second set: fifty pairs
  const o2 = op * seg(t, 25.4, 25.8);
  if (o2 > 0) {
    M(K, 'c.r5', X, 170, (R / 2) + ' HEADS · ' + (R / 2) + ' TAILS', { op: o2 });
    M(K, 'c.r6', X, 214, 'PAIR ' + Math.min(R / 2, Math.floor(Math.max(0, (t - 25.6) / 0.1))) + ' / ' + (R / 2), { op: o2 * seg(t, 25.6, 25.9) });
    role(K.tx('c.v', 'labels', X, 296, money(fin ? P.start * Math.pow(pf, R / 2) : v), { fam: 'disp', size: 64, op: o2 * seg(t, 25.6, 25.9), fill: fin ? C.accent : C.ink }), 'must-read');
    const fu = seg(t, 30.8, 31.3) * op;
    M(K, 'c.ts', X, 340, 'TRUE SCALE', { op: fu });
    ln('c.lead', 'marks', X - 6, 332, 146, BY - 1, { op: fu, stroke: C.accent, w: 1 });
    S2(K, 'c.src', X, 384, 'PETERS 2019 · NATURE PHYSICS', { op: fu, size: 14 });
  }
}

/* ═════════ COUNT: one hundred players (S3) ═════════ */
function countScene(t, s, K) {
  const { seg, ease, ln, rc, rgba, ctx, C, fmtK } = K;
  const op = seg(t, 36.0, 36.6) * (1 - seg(t, T_MON, T_MON + 0.6));   // Monday stands on clean paper
  if (op <= 0) return;
  // axis
  [[6, '£1M'], [4, '£10,000'], [2, '£100'], [0, '£1'], [-2, '1p']].forEach(([lg, lab], i) => {
    const y = yLog(lg);
    ln('k.g' + i, 'field', 104, y, 660, y, { op: (lg === 2 ? 0.55 : 0.25) * op, w: lg === 2 ? 1.2 : 0.6 });
    S2(K, 'k.a' + i, 100, y + 5, lab, { anchor: 'end', size: 14, ls: 0, op });
  });
  // the rounds
  const rho = Math.max(0, Math.min(R, (t - T_ROUNDS) / DT));
  const r = Math.min(R - 1, Math.floor(rho)), u = rho >= R ? 1 : ease(Math.min(1, (rho - r) / 0.7));
  const ans = s.answer, hasG = typeof ans === 'number', g = hasG ? ans : null;
  const nLostShown = t >= T_LOST ? Math.min(NLOST, Math.floor((t - T_LOST) / 0.02) + 1) : 0;
  for (let q = 0; q < N; q++) {
    const rk = RANK[q], b = q * (R + 1);
    let top;
    if (t < T_ROUNDS) top = K.lerp(YB, yLog(LOG_S), ease(seg(t, 36.4 + 0.004 * q, 36.8 + 0.004 * q)));
    else top = yLog(K.lerp(LG[b + r], LG[b + r + 1], u));
    const st = T_SORT + 0.004 * rk, x = K.lerp(slotX(q), slotX(rk), ease(seg(t, st, st + 1.2)));
    const h = Math.max(t >= 36.4 + 0.004 * q ? 2 : 0, YB - top);
    let col = rgba('ink', 0.85 * op);
    if (rk < nLostShown) col = rgba('ink', 0.3 * op);
    if (t >= T_TYP && (rk === N / 2 - 1 || rk === N / 2)) col = rgba('accent', 0.95 * op);
    ctx.fillStyle = col; ctx.fillRect(x, YB - h, BW, h);
    if (hasG && t >= T_GUESS + 0.6 && FINAL[q] >= g) { ctx.strokeStyle = rgba('accent', op); ctx.lineWidth = 1; ctx.strokeRect(x - 0.8, YB - h - 0.8, BW + 1.6, h + 1.6); }
  }
  ln('k.floor', 'marks', 104, YB + 0.5, 660, YB + 0.5, { op: 0.6 * op });
  // the expected-value line
  const lu = ease(seg(t, 37.0, 37.4));
  const yev = yLog(LOG_S + rho * LOG_EV);
  if (lu > 0) {
    ln('k.ev', 'marks', 104, yev, 104 + 556 * lu, yev, { op, w: 1.6 });
    const big = t >= T_TYP, evr = P.start * Math.pow((P.up + P.down) / 2, Math.floor(rho));
    const s1 = 'EXPECTED ' + money(evr), sz = big ? 28 : 16;
    rc('k.evb', 'marks', 108, yev - sz - 2, s1.length * sz * 0.6 + 8, sz + 2, { fill: C.paper, op: 0.9 * op * lu });
    const el = K.tx('k.evl', 'labels', 112, yev - 5, s1, { size: sz, weight: 500, op: op * lu });
    role(el, big ? 'must-read' : 'secondary');
  }
  // headline slot (48, 136) and round counter
  const H = (key, str, a, o) => M(K, key, 48, 136, str, Object.assign({ op: a * op }, o));
  H('k.h0', N + ' PLAYERS · £' + P.start + ' EACH', seg(t, 36.4, 36.8) * (1 - seg(t, 38.0, 38.4)));
  if (t >= T_ROUNDS - 0.2 && t < T_SORT + 0.6) M(K, 'k.rd', 664, 136, 'ROUND ' + Math.floor(rho) + ' / ' + R, { anchor: 'end', op: op * seg(t, T_ROUNDS - 0.2, T_ROUNDS) * (1 - seg(t, T_SORT + 0.2, T_SORT + 0.6)) });
  H('k.h1', 'LOST MONEY: ' + nLostShown + ' OF ' + N, seg(t, T_LOST, T_LOST + 0.2) * (1 - seg(t, T_UNDER - 0.2, T_UNDER)));
  H('k.h2', 'UNDER £1: ' + NUNDER1 + ' OF ' + N, seg(t, T_UNDER, T_UNDER + 0.2) * (1 - seg(t, T_TYP - 0.2, T_TYP)));
  const bu = seg(t, T_UNDER, T_UNDER + 0.5) * (1 - seg(t, T_TYP - 0.2, T_TYP)) * op;
  if (bu > 0) {
    const x0 = slotX(0), x1 = slotX(NUNDER1 - 1) + BW;
    ln('k.b0', 'marks', x0, YB + 6, x0 + (x1 - x0) * seg(t, T_UNDER, T_UNDER + 0.5), YB + 6, { stroke: C.accent, w: 1.6, op: bu });
    ln('k.b1', 'marks', x0, YB + 2, x0, YB + 6, { stroke: C.accent, w: 1.6, op: bu });
    ln('k.b2', 'marks', x1, YB + 2, x1, YB + 6, { stroke: C.accent, w: 1.6, op: bu * seg(t, T_UNDER + 0.4, T_UNDER + 0.5) });
  }
  // the typical player
  const tu = seg(t, T_TYP, T_TYP + 0.4) * op;
  if (tu > 0) {
    const xm = slotX(N / 2 - 1), med = FINAL.slice().sort((a, b) => a - b), mv = (med[N / 2 - 1] + med[N / 2]) / 2;
    M(K, 'k.ty', 120, 318, 'TYPICAL ' + money(mv), { op: tu, fill: C.accent });
    ln('k.tyl', 'marks', 342, 312, xm + 2, yLog(Math.log10(mv)) - 3, { stroke: C.accent, w: 1, op: tu });
  }
  // the viewer's number against the hundred
  if (t >= T_GUESS) {
    const gu = seg(t, T_GUESS, T_GUESS + 0.4);
    let line;
    if (hasG) {
      const gl = g > 0 ? Math.log10(g) : -9, yg = yLog(gl), arrow = gl > 6 ? ' ↑' : gl < -2 ? ' ↓' : '';
      K.pencil(104, yg, 660, yg, seg(t, T_GUESS, T_GUESS + 0.6), 5, { w: 2 });
      const sg = 'YOUR £' + guessStr(g) + arrow;
      rc('k.gb', 'marks', 108, yg - 30, sg.length * 16.8 + 8, 30, { fill: C.paper, op: 0.9 * gu * op });
      M(K, 'k.gl', 112, yg - 6, sg, { op: gu * op, fill: C.accent });
      const nG = FINAL.reduce((a, w) => a + (w >= g ? 1 : 0), 0);
      line = nG + ' OF ' + N + ' GOT TO YOUR £' + guessStr(g);
    } else line = 'NO GUESS · THE LINE SAID ' + money(P.start * Math.pow((P.up + P.down) / 2, R));
    H('k.h3', line, seg(t, T_GUESS + 0.4, T_GUESS + 0.7) * (1 - seg(t, T_RATES - 0.2, T_RATES)));
  }
  const ev = Math.round(((P.up + P.down) / 2 - 1) * 100), tr = (Math.sqrt(P.up * P.down) - 1) * 100;
  H('k.h4', 'AVERAGE +' + ev + ' % · TYPICAL −' + Math.abs(tr).toFixed(1) + ' %/ROUND', seg(t, T_RATES, T_RATES + 0.3));
}

/* ═════════ MONDAY (S4) ═════════ */
function monday(t, s, K) {
  const { seg, rc, C } = K;
  const a = seg(t, T_MON, T_MON + 0.6);
  if (a <= 0) return;
  rc('m.bg', 'marks', 56, 104, 604, 294, { stroke: C.ink, w: 1, op: a });
  S2(K, 'm.e', 76, 134, 'MONDAY · ASK', { op: a, size: 14, ls: '0.2em' });
  K.wrap(F.monday.q, 520, 34, 'disp').slice(0, 3).forEach((ln_, i) =>
    role(K.tx('m.q' + i, 'labels', 76, 176 + i * 40, ln_, { fam: 'disp', size: 34, op: a * seg(t, T_MON + 0.3, T_MON + 0.8), ls: '0.02em' }), 'must-read'));
  const b = seg(t, 67.4, 67.9);
  if (b > 0) {
    S2(K, 'm.he', 76, 292, 'HONEST LIMIT', { op: b, size: 14, ls: '0.2em', fill: C.accent });
    K.wrap(F.monday.limit, 560, 28, 'mono').slice(0, 3).forEach((ln_, i) => M(K, 'm.l' + i, 76, 324 + i * 31, ln_, { op: b, weight: 400 }));
  }
}

window.FILM_RENDER = {
  setup(p, K) {
    const rnd = K.mulberry32(P.seed), H = new Int16Array(N);
    LG = new Float64Array(N * (R + 1));
    for (let q = 0; q < N; q++) LG[q * (R + 1)] = LOG_S;
    for (let r = 1; r <= R; r++) for (let q = 0; q < N; q++) {
      if (rnd() < P.p) H[q]++;
      LG[q * (R + 1) + r] = LOG_S + H[q] * LOG_UP + (r - H[q]) * LOG_DN;
    }
    FINAL = Array.from(H, (k) => P.start * Math.pow(P.up, k) * Math.pow(P.down, R - k));
    const order = [...Array(N).keys()].sort((a, b) => FINAL[a] - FINAL[b] || a - b);
    RANK = new Int16Array(N); order.forEach((q, i) => (RANK[q] = i));
    NLOST = FINAL.filter((w) => w < P.start).length;
    NUNDER1 = FINAL.filter((w) => w < 1).length;
  },
  render(t, s, K) {
    const ch = K.chapterAt(t), sealed = t >= F.commit.at + 4.5;
    let hl = 0; F.ledger.forEach(([tr], i) => { if (t >= tr) hl = i; });
    K.chrome(t, ch, {
      ledger: { title: 'LEDGER', rows: F.ledger, hl },
      block: { title: 'VOLATILITY DRAG', lines: ['THE COIN GAME', 'AFTER PETERS'], open: 0.3, slotLabel: 'GUESS',
               slot: sealed ? (typeof s.answer === 'number' ? 'SEALED' : 'NONE') : null },
    });
    K.roll(t, 0, 1.0);
    if (t < 16.2) hook(t, s, K);
    if (t >= 16 && t < 36.6) caseScene(t, s, K);
    if (t >= 36) countScene(t, s, K);
    if (t >= T_MON) monday(t, s, K);
  },
  tryit(v, s, K) {
    const n = v.rounds, f = v.share / 100, up = 1 + f * (P.up - 1), dn = 1 - f * (1 - P.down);
    const ev = P.start * Math.pow(1 + f * ((P.up + P.down) / 2 - 1), n);
    const typ = P.start * Math.pow(up, Math.round(n / 2)) * Math.pow(dn, n - Math.round(n / 2));
    const rnd = K.mulberry32(P.seed), h = new Array(N).fill(0);
    for (let r = 1; r <= n; r++) for (let q = 0; q < N; q++) if (rnd() < P.p) h[q]++;
    const lost = h.filter((k) => P.start * Math.pow(up, k) * Math.pow(dn, n - k) < P.start).length;
    const m = (x) => '£' + (x >= 100 ? Math.round(x).toLocaleString('en-US') : x.toFixed(2));
    return `<div class="ex">${n} ROUNDS · ${v.share} % OF THE POT</div><div class="big">${lost} OF 100 LOST MONEY</div>` +
      `<div class="ex">TYPICAL ${m(typ)} · EXPECTED ${m(ev)}</div>` + (typeof s.answer === 'number' ? `<p>You sealed £${s.answer}.</p>` : '');
  },
};
})();
