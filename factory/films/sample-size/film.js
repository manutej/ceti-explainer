/* sample-size · "Thirty Customers" · the 75-second case.
   One clock: render(t, state, K) draws frame t from precomputed, seeded data only.
   Structures: S1 the respondents (row of 30, market of 1,000), S2 the share rail, S3 ballots at true scale,
   S4 the brand card (drawn by the kit). */
(function () {
'use strict';
const F = window.FILM, PR = F.params;

// ── geometry (design units; content box x 48–664, y 104–400) ──
const RX0 = 64, RW = 560, RAIL_Y = 352, ROW2_Y = 398;
const X = (pct) => RX0 + RW * pct / 100;          // share rail: 0–100 %
const XK = (k) => X(100 * k / PR.n30);            // the same rail in yes-out-of-30
const GRID = { x: 50, y: 124, p: 6, cols: 40 };   // market of 1,000
const ROW = { x: 330, y: 140, p: 11, r: 4.5 };    // a survey of 30 (COUNT)
const HROW = { x: 66, y: 252, p: 20, r: 7 };      // the hook's survey of 30

// ── seeded data, computed once in setup (pure afterwards) ──
let POP = null, DRAW = null, S30 = null, S1000 = null, STACK = null, OK = false;

function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a);
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

function build() {
  const P = []; for (let i = 0; i < PR.popN; i++) P.push(i < PR.popYes ? 1 : 0);
  const r = mulberry32(PR.popSeed);
  for (let i = PR.popN - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const x = P[i]; P[i] = P[j]; P[j] = x; }
  const run = (seed, n, keep) => { const q = mulberry32(seed), out = [], idx = [];
    for (let s = 0; s < PR.nSurveys; s++) { let y = 0; const row = [];
      for (let k = 0; k < n; k++) { const c = Math.floor(q() * PR.popN); y += P[c]; if (keep) row.push(c); }
      out.push(y); if (keep) idx.push(row); }
    return { out, idx }; };
  const a = run(PR.seed30, PR.n30, true), b = run(PR.seed1000, PR.n1000, false);
  POP = P; DRAW = a.idx; S30 = a.out; S1000 = b.out;
  const seen = {}; STACK = S30.map(k => { seen[k] = (seen[k] || 0) + 1; return seen[k] - 1; });
  OK = S30.join() === PR.surveys30.join() && S1000.join() === PR.surveys1000.join();
}

// survey timing: three slow, seventeen fast
const T0 = (s) => s < 3 ? 38.0 + 2.2 * s : 44.6 + 0.3 * (s - 3);
const SPAN = (s) => s < 3 ? 2.2 : 0.3;
const DROP = (s) => s < 3 ? [T0(s) + 1.5, T0(s) + 1.9] : [T0(s), T0(s) + 0.25];

window.FILM_RENDER = {
  setup(p, K) { build(); if (!OK) console.warn('sample-size: seeded draw differs from film.json params'); },

  render(t, s, K) {
    const { seg, ease, eout, lerp, C, ctx } = K;
    const T = (key, layer, x, y, str, o, role) => { const el = K.tx(key, layer, x, y, str, o); el.setAttribute('data-role', role || ((o.size || 14) >= 28 ? 'must-read' : 'secondary')); return el; };
    const fade = (a0, a1, b0, b1) => seg(t, a0, a1) * (1 - seg(t, b0, b1));
    const sealed = t >= F.commit.at + 4.5;
    K.chrome(t, K.chapterAt(t), {
      ledger: false,
      block: { title: 'SAMPLE SIZE', lines: ['THE SURVEY SAYS', 'ISSUED FOR MONDAY'], slotLabel: 'GUESS', slot: sealed ? 'SEALED' : null },
    });

    const disc = (x, y, r, yes, a, col) => {
      if (a <= 0) return;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
      if (yes) { ctx.fillStyle = K.rgba(col || 'ink', 0.92 * a); ctx.fill(); }
      else { ctx.strokeStyle = K.rgba(col || 'ink', 0.85 * a); ctx.lineWidth = Math.max(0.8, r * 0.28); ctx.stroke(); }
    };
    const ring = (x, y, r, a, w) => { if (a <= 0) return; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.strokeStyle = K.rgba('accent', a); ctx.lineWidth = w || 1.4; ctx.stroke(); };
    const survey1 = DRAW[0].map(c => POP[c]);

    /* ═════ HOOK 0–8 and COMMIT 8–16: the hook's survey of 30 ═════ */
    if (t < 16) {
      const rowA = t < 8 ? 1 : lerp(1, 0.35, seg(t, 8, 8.4)) * (1 - seg(t, 15.6, 16));
      for (let i = 0; i < 30; i++) {
        const u = eout(seg(t, 0.4 + 0.08 * i, 0.55 + 0.08 * i));
        disc(HROW.x + HROW.p * i, HROW.y, HROW.r * u, survey1[i], rowA * (u > 0 ? 1 : 0));
      }
      const ha = fade(3.0, 3.3, 8.0, 8.4);
      if (ha > 0) T('h.tally', 'labels', 356, 312, `${PR.yesHook} of ${PR.n30}`, { size: 28, anchor: 'middle', weight: 500, op: ha });
      const hb = fade(3.8, 4.2, 8.0, 8.4);
      if (hb > 0) {
        T('h.big', 'labels', 356, 200, `${Math.round(100 * PR.yesHook / PR.n30)} %`, { size: 96, anchor: 'middle', weight: 500, op: hb });
        T('h.sub', 'labels', 356, 230, 'SAID YES', { size: 20, anchor: 'middle', ls: '0.16em', weight: 500, op: hb });
      }
      const ca = fade(8.4, 8.8, 15.6, 16);
      if (ca > 0) {
        T('c.l1', 'labels', 48, 148, `${PR.n30} answered. ${Math.round(100 * PR.yesHook / PR.n30)} % said yes.`, { size: 28, weight: 500, op: ca });
        T('c.l2', 'labels', 48, 184, 'The true share could', { size: 28, op: ca });
        T('c.l3', 'labels', 48, 218, 'plausibly be as low as?', { size: 28, op: ca });
      }
    }
    if (t >= 7.5 && t < 16.5) K.commitBox(t, s, { title: F.commit.title, prompt: 'PERCENT · 0 TO 100', out: 15.6 });

    /* ═════ the share rail (CASE 16–36, COUNT 36–62, MONDAY at low ink) ═════ */
    const railA = t < 20.4 ? 0 : t < 62 ? ease(seg(t, 20.4, 21.0)) : lerp(1, 0.3, seg(t, 62, 62.6));
    if (railA > 0) {
      K.ln('r.ax', 'marks', X(0), RAIL_Y, X(100 * Math.min(1, seg(t, 20.4, 21.0) || 1)), RAIL_Y, { w: 1.4, op: railA });
      const pctMode = t < 36 || t >= 51.0;
      const cnt = fade(36.0, 36.5, 51.0, 51.6), pc = t < 36 ? fade(20.6, 21.0, 35.5, 36.0) : seg(t, 51.0, 51.6) * (t < 62 ? 1 : 0.4);
      [0, 25, 50, 75, 100].forEach((v, i) => { if (pc > 0) {
        K.ln('r.tp' + i, 'marks', X(v), RAIL_Y, X(v), RAIL_Y + 6, { op: pc });
        T('r.lp' + i, 'chrome', X(v), RAIL_Y + 19, String(v), { size: 12, anchor: 'middle', op: pc }, 'chrome'); } });
      [0, 10, 15, 20, 30].forEach((v, i) => { if (cnt > 0 && t < 62) {
        K.ln('r.tc' + i, 'marks', XK(v), RAIL_Y, XK(v), RAIL_Y + 6, { op: cnt });
        T('r.lc' + i, 'chrome', XK(v), RAIL_Y + 19, String(v), { size: 12, anchor: 'middle', op: cnt }, 'chrome'); } });
      if (t < 36) T('r.ti', 'labels', X(100), 336, "ROOSEVELT'S SHARE, %", { size: 14, anchor: 'end', ls: '0.08em', op: fade(20.6, 21.0, 35.5, 36.0) });
      else if (t < 62) {
        if (cnt > 0) T('r.tc', 'labels', X(100), 336, 'YES OUT OF 30', { size: 14, anchor: 'end', ls: '0.08em', op: cnt });
        if (pctMode) T('r.tq', 'labels', X(100), 336, 'SHARE SAYING YES, %', { size: 14, anchor: 'end', ls: '0.08em', op: seg(t, 51.0, 51.6) * (1 - seg(t, 56, 56.5)) });
      }
    }

    /* ═════ CASE 16–36: ballots at true scale, then the rail ═════ */
    if (t >= 16 && t < 36) {
      const out = 1 - seg(t, 35.5, 36.0);
      const SC = RW / PR.mailed;                         // 560 units = 10,000,000 ballots
      const wa = RW * ease(seg(t, 16.3, 17.5)), aA = (t < 18 ? 1 : 0.35) * out;
      K.rc('b.a', 'marks', RX0, 128, wa, 20, { fill: C.ink, op: aA });
      T('b.al', 'labels', RX0, 120, `${K.fmtK(PR.mailed)} MAILED`, { size: 20, weight: 500, op: seg(t, 16.5, 16.9) * out });
      const wb = PR.returned * SC * ease(seg(t, 18.0, 19.2));
      if (t >= 18) {
        K.rc('b.b', 'marks', RX0, 166, wb, 20, { fill: C.ink, op: out });
        T('b.bl', 'labels', RX0 + PR.returned * SC + 10, 183, `${K.fmtK(PR.returned)} RETURNED`, { size: 20, weight: 500, op: seg(t, 18.6, 19.0) * out });
      }
      if (t >= 24) {
        K.rc('b.c', 'marks', RX0, 204, PR.gallupN * SC * ease(seg(t, 24.0, 24.4)), 20, { fill: C.accent, op: out });
        T('b.cl', 'labels', RX0 + 12, 221, `${K.fmtK(PR.gallupN)} GALLUP · ${Math.round(PR.returned / PR.gallupN)}× FEWER`, { size: 20, weight: 500, fill: C.accent, op: seg(t, 24.2, 24.6) * out });
      }
      const dShare = 100 * PR.fdrD / (PR.landonD + PR.fdrD), xd = X(dShare), xg = X(PR.gallupFDR), xr = X(PR.fdrShareAll);
      const da = seg(t, 21.2, 21.6) * out;
      if (da > 0) {
        K.ln('k.ds', 'marks', xd, 288, xd, RAIL_Y, { w: 3, op: da });
        T('k.dl', 'labels', xd - 6, 282, `DIGEST ${Math.round(dShare)}`, { size: 28, anchor: 'end', weight: 500, op: da });
        T('k.dn', 'labels', xd - 6, 306, `LANDON ${Math.round(100 - dShare)}`, { size: 20, anchor: 'end', op: da });
      }
      const ga = seg(t, 25.2, 25.6) * out;
      if (ga > 0) {
        K.ln('k.gs', 'marks', xg, 288, xg, RAIL_Y, { w: 3, stroke: C.accent, op: ga });
        T('k.gl', 'labels', xg + 5, 282, `GALLUP ${PR.gallupFDR}`, { size: 28, weight: 500, fill: C.accent, op: ga });
      }
      const ra = seg(t, 28.4, 28.8) * out;
      if (ra > 0) {
        K.ln('k.rs', 'marks', xr, 316, xr, RAIL_Y, { w: 5, op: ra });
        T('k.rl', 'labels', xr + 6, 312, `RESULT ${Math.round(PR.fdrShareAll)}`, { size: 28, weight: 500, op: ra });
      }
      const ma = seg(t, 29.4, 30.0) * out;
      if (ma > 0) K.dim('k.mi', 'labels', xd, lerp(xd, xr, ease(seg(t, 29.4, 30.4))), 392, `${Math.round(PR.fdrShareAll - dShare)} POINTS OFF`, ma, { size: 20 });
      const na = seg(t, 31.0, 31.4) * out;
      if (na > 0) {
        const half = RW * PR.z * Math.sqrt(PR.p0 * (1 - PR.p0) / PR.returned);   // ±0.064 points = 0.36 units each side
        K.rc('k.nb', 'field', xd - half, 288, 2 * half, RAIL_Y - 288, { fill: C.accent, op: na });
        const moe = Math.round(100 * 100 * PR.z * Math.sqrt(PR.p0 * (1 - PR.p0) / PR.returned)) / 100;
        T('k.nl', 'labels', xd - 6, 330, `NOISE ±${moe.toFixed(2)}`, { size: 20, anchor: 'end', weight: 500, fill: C.accent, op: na });
        T('k.ns', 'labels', xd - 6, 346, 'THINNER THAN THIS LINE', { size: 14, anchor: 'end', op: na });
      }
    }

    /* ═════ COUNT 36–62: the market, twenty surveys of 30, twenty of 1,000, your number ═════ */
    if (t >= 36 && t < 72) {
      const outC = 1 - seg(t, 56.0, 56.5);              // things that leave for the placement
      const mon = t < 62 ? 1 : 1 - seg(t, 62, 62.6);    // things that leave for MONDAY
      // the market of 1,000 (canvas mass)
      const gA = (t < 51.6 ? 1 : lerp(1, 0.25, seg(t, 51.6, 52.0))) * outC;
      if (gA > 0) for (let c = 0; c < PR.popN; c++) {
        const row = Math.floor(c / GRID.cols), a = seg(t, 36.5 + 0.04 * row, 36.7 + 0.04 * row) * gA;
        disc(GRID.x + GRID.p * (c % GRID.cols), GRID.y + GRID.p * row, 2.1, POP[c] === 1, a);
      }
      const pl = fade(37.5, 37.9, 56.0, 56.5);
      if (gA > 0) T('m.n', 'labels', GRID.x - 2, 114, `${K.fmtK(PR.popN)} CUSTOMERS`, { size: 14, ls: '0.1em', weight: 500, op: seg(t, 36.5, 36.9) * outC });
      if (pl > 0) T('m.yn', 'labels', ROW.x, 240, `${PR.popYes} YES · ${PR.popN - PR.popYes} NO`, { size: 20, weight: 500, op: pl });
      // truth line
      const tl = fade(36.5, 37.0, 62.0, 62.6) * (t >= 59.4 ? 1 : 0.6) + (t >= 59.4 && t < 62 ? 0 : 0);
      if (tl > 0) K.ln('m.tl', 'marks', X(50), 276, X(50), RAIL_Y + 6, { dash: '4 3', stroke: C.muted, w: 1.4, op: tl });
      const tc = fade(36.5, 37.0, 51.0, 51.6), tp = fade(51.0, 51.6, 56.0, 56.5);
      if (tc > 0) T('m.tc', 'labels', X(50) + 4, 270, `TRUTH ${PR.n30 * PR.popYes / PR.popN} OF ${PR.n30}`, { size: 14, ls: '0.08em', weight: 500, fill: C.muted, op: tc });
      if (tp > 0) T('m.tp', 'labels', X(50) + 4, 270, `TRUTH ${Math.round(100 * PR.popYes / PR.popN)} %`, { size: 14, ls: '0.08em', weight: 500, fill: C.muted, op: tp });

      // the surveys of 30
      let cur = -1; for (let q = 0; q < PR.nSurveys; q++) if (t >= T0(q) && t < T0(q) + SPAN(q)) cur = q;
      if (cur >= 0 && t < 49.8) {
        const q = cur, base = T0(q), slow = q < 3, ra = slow ? 1 - seg(t, base + 2.05, base + 2.2) : 1;
        let shown = 0, yes = 0;
        for (let i = 0; i < 30; i++) {
          const at = slow ? base + 0.04 * i : base;
          if (t < at) continue;
          const c = DRAW[q][i]; shown++; yes += POP[c];
          disc(ROW.x + ROW.p * i, ROW.y, ROW.r, POP[c] === 1, ra);
          const fl = slow ? 1 - seg(t, at, at + 0.3) : 1 - seg(t, at, at + 0.15);
          if (fl > 0) ring(GRID.x + GRID.p * (c % GRID.cols), GRID.y + GRID.p * Math.floor(c / GRID.cols), 4, fl);
        }
        const fin = !slow || t >= base + 1.3;
        T('m.tal', 'labels', ROW.x, 190, fin ? `${S30[q]} of ${PR.n30}` : `${yes} of ${shown}`, { size: 28, weight: 500, op: ra });
      }
      // dots on the rail
      const dotA = t < 56 ? 1 : lerp(1, 0.25, seg(t, 56, 56.5));
      for (let q = 0; q < PR.nSurveys; q++) {
        const [d0, d1] = DROP(q); if (t < d0) continue;
        const u = eout(seg(t, d0, d1)), tx = XK(S30[q]), ty = RAIL_Y - 6 - 9 * STACK[q];
        const x = lerp(ROW.x + 40, tx, u), y = lerp(196, ty, u);
        disc(x, y, 4, true, dotA * (t < 62 ? 1 : lerp(1, 0.3, seg(t, 62, 62.6)) ));
        if (S30[q] >= PR.yesHook && t >= 50.4 && t < 56.5) ring(tx, ty, 6.5, seg(t, 50.4, 50.7) * outC, 1.6);
      }
      // min / max, then as shares
      const mn = Math.min(...S30), mx = Math.max(...S30);
      const bc = fade(50.0, 50.4, 51.0, 51.6), bp = fade(51.0, 51.6, 56.0, 56.5);
      if (bc > 0) { T('m.mnc', 'labels', XK(mn), 300, `${mn} OF ${PR.n30}`, { size: 20, anchor: 'middle', weight: 500, op: bc });
                    T('m.mxc', 'labels', XK(mx), 300, `${mx} OF ${PR.n30}`, { size: 20, anchor: 'middle', weight: 500, op: bc }); }
      if (bp > 0) { T('m.mnp', 'labels', XK(mn), 300, `${Math.round(100 * mn / PR.n30)} %`, { size: 20, anchor: 'middle', weight: 500, op: bp });
                    T('m.mxp', 'labels', XK(mx), 300, `${Math.round(100 * mx / PR.n30)} %`, { size: 20, anchor: 'middle', weight: 500, op: bp }); }
      const g18 = fade(50.4, 50.8, 56.0, 56.5);
      if (g18 > 0) {
        const n18 = S30.filter(v => v >= PR.yesHook).length;
        T('m.g1', 'labels', 456, 322, `${n18} OF ${PR.nSurveys} SURVEYS`, { size: 20, weight: 500, fill: C.accent, op: g18 });
        T('m.g2', 'labels', 456, 344, `SAID ${PR.yesHook} OR MORE`, { size: 20, weight: 500, fill: C.accent, op: g18 });
      }
      // ±18 band
      const m30 = PR.z * Math.sqrt(PR.p0 * (1 - PR.p0) / PR.n30) * 100, b18 = fade(51.0, 51.6, 56.0, 56.5);
      if (b18 > 0) {
        K.rc('m.b18', 'field', X(50 - m30), 306, X(50 + m30) - X(50 - m30), RAIL_Y - 306 + 4, { fill: C.muted, fo: 0.2, op: b18 });
        T('m.b18l', 'labels', X(50 - m30) - 6, 340, `±${Math.round(m30)}`, { size: 28, anchor: 'end', weight: 500, op: b18 });
      }
      // twenty surveys of 1,000
      const r2 = fade(51.6, 52.0, 56.0, 56.5);
      if (r2 > 0) {
        K.ln('m.r2', 'marks', X(0), ROW2_Y, X(100), ROW2_Y, { w: 0.9, op: r2 });
        T('m.r2l', 'labels', X(0), ROW2_Y - 4, `${K.fmtK(PR.n1000)} ASKED`, { size: 14, ls: '0.08em', weight: 500, op: r2 });
        for (let q = 0; q < PR.nSurveys; q++) {
          const a0 = 51.8 + 0.14 * q; if (t < a0) continue;
          const u = eout(seg(t, a0, a0 + 0.2)), x = X(S1000[q] / 10), y1 = lerp(ROW2_Y - 40, ROW2_Y - 14, u);
          ctx.fillStyle = K.rgba('ink', 0.9 * r2); ctx.fillRect(x - 0.8, y1, 1.6, 14);
        }
        const m1 = PR.z * Math.sqrt(PR.p0 * (1 - PR.p0) / PR.n1000) * 100, bb = seg(t, 55.2, 55.6) * r2;
        if (t >= 54.7) T('m.r2r', 'labels', 372, ROW2_Y - 2, `${Math.min(...S1000)} TO ${Math.max(...S1000)} OF ${K.fmtK(PR.n1000)}`, { size: 20, weight: 500, op: seg(t, 54.7, 55.0) * r2 });
        if (bb > 0) {
          K.rc('m.b3', 'field', X(50 - m1), ROW2_Y - 18, X(50 + m1) - X(50 - m1), 20, { fill: C.muted, fo: 0.25, op: bb });
          T('m.b3l', 'labels', X(50 - m1) - 6, ROW2_Y, `±${(Math.round(10 * m1) / 10).toFixed(1)}`, { size: 28, anchor: 'end', weight: 500, op: bb });
        }
      }
      // the noise ledger (right column), stays through MONDAY
      if (t >= 55.2) {
        const rows = [[PR.n30, PR.n30], [PR.n100, PR.n100], [PR.n1000, PR.n1000], [PR.returned, PR.returned]];
        T('lg.h', 'labels', 700, 120, 'ASKED · NOISE (95 %)', { size: 14, ls: '0.1em', weight: 500, op: seg(t, 55.2, 55.5) });
        K.ln('lg.hl', 'labels', 700, 127, 930, 127, { w: 0.9, op: seg(t, 55.2, 55.5) });
        rows.forEach(([n], i) => {
          const m = 100 * PR.z * Math.sqrt(PR.p0 * (1 - PR.p0) / n);
          const ms = n === PR.n30 || n === PR.n100 ? String(Math.round(m)) : n === PR.n1000 ? (Math.round(10 * m) / 10).toFixed(1) : (Math.round(100 * m) / 100).toFixed(2);
          const a = seg(t, 55.3 + 0.15 * i, 55.6 + 0.15 * i);
          T('lg.n' + i, 'labels', 700, 152 + 28 * i, K.fmtK(n), { size: 20, weight: 500, op: a });
          T('lg.m' + i, 'labels', 930, 152 + 28 * i, '±' + ms, { size: 20, anchor: 'end', weight: 500, fill: i === 3 ? C.accent : C.ink, op: a });
        });
      }

      // placement: your number against the truth
      if (t >= 56.5) {
        const pa = seg(t, 56.5, 56.8) * mon;
        for (let i = 0; i < 30; i++) disc(ROW.x + ROW.p * i, ROW.y, ROW.r, survey1[i], pa);
        if (pa > 0) T('p.tal', 'labels', ROW.x, 190, `${PR.yesHook} of ${PR.n30}`, { size: 28, weight: 500, op: pa });
        const ph = PR.yesHook / PR.n30, hw = PR.z * Math.sqrt(ph * (1 - ph) / PR.n30);
        const lo = Math.round(100 * (ph - hw)), hi = Math.round(100 * (ph + hw));
        const ba = seg(t, 56.6, 57.0) * mon;
        if (ba > 0) K.dim('p.br', 'labels', X(lo), lerp(X(lo), X(hi), ease(seg(t, 56.6, 57.6))), 296, `PLAUSIBLE: ${lo} % TO ${hi} %`, ba, { size: 20 });
        const ya = seg(t, 57.8, 58.2) * mon;
        if (ya > 0) {
          if (K.answered(s)) {
            const g = Math.max(0, Math.min(100, s.answer)), gx = X(g), lab = `YOU ${s.answer} %`, w = lab.length * 28 * 0.6;
            K.ln('p.ys', 'marks', gx, 272, gx, RAIL_Y + 6, { stroke: C.accent, w: 2.5, op: ya });
            T('p.yl', 'labels', Math.max(48 + w / 2, Math.min(664 - w / 2, gx)), 266, lab, { size: 28, anchor: 'middle', weight: 500, fill: C.accent, op: ya });
          } else T('p.yn', 'labels', 470, 266, 'NO ANSWER', { size: 20, weight: 500, fill: C.accent, op: ya });
        }
        const la = seg(t, 58.6, 58.9);
        if (la > 0) {
          K.ln('p.lt', 'marks', X(lo), 306, X(lo), RAIL_Y + 6, { w: 2.5, op: la * (t < 62 ? 1 : lerp(1, 0.3, seg(t, 62, 62.6))) });
          if (mon > 0) T('p.ll', 'labels', 48, 232, `AS LOW AS ${lo} %`, { size: 28, weight: 500, op: la * mon });
        }
        const bh = seg(t, 59.4, 59.8) * mon;
        if (bh > 0) T('p.bh', 'labels', 48, 330, 'BELOW HALF IS INSIDE', { size: 20, weight: 500, op: bh });
      }
    }

    /* ═════ MONDAY 62–72 ═════ */
    if (t >= 62) {
      const qa = seg(t, 62.6, 63.0);
      T('mo.q1', 'labels', 48, 168, 'Out of how many?', { fam: 'disp', size: 44, op: qa });
      T('mo.q2', 'labels', 48, 214, "And who didn't answer?", { fam: 'disp', size: 44, op: qa });
      const ha = seg(t, 66.0, 66.4);
      if (ha > 0) {
        T('mo.h1', 'labels', 48, 262, 'The ± covers chance only,', { size: 28, weight: 500, op: ha });
        T('mo.h2', 'labels', 48, 296, 'not who chose to answer.', { size: 28, weight: 500, op: ha });
      }
    }
  },

  tryit(v, s, K) {
    const n = Math.max(1, +v.n || 30), p = Math.max(0, Math.min(100, +v.yes || 0)) / 100;
    const m = 100 * 1.96 * Math.sqrt(p * (1 - p) / n), lo = Math.max(0, 100 * p - m), hi = Math.min(100, 100 * p + m);
    const fmt = (x) => (m < 1 ? x.toFixed(1) : String(Math.round(x)));
    return `<div class="ex">${K.fmtK(n)} ANSWERED · ${Math.round(100 * p)} % SAID YES</div>` +
      `<div class="big">±${m < 1 ? m.toFixed(2) : m < 10 ? m.toFixed(1) : Math.round(m)} points</div>` +
      `<div class="ex">plausible true share: ${fmt(lo)} % to ${fmt(hi)} % (95 %, random sample)</div>` +
      `<p>Quadruple the sample to halve the noise. No sample size removes bias: if the people who answered differ from your customers, this band is not the error.</p>` +
      (typeof s.answer === 'number' ? `<p>You sealed "as low as ${s.answer} %"; for 18 of 30 the band starts at 42 %.</p>` : '');
  },
};
})();
