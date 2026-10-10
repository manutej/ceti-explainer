/* correlated-risk · "Ten Bets, One Bet". One clock: render(t, state, K) draws frame t from t alone.
   Marks are canvas mass; type is retained SVG. Every digit drawn is a claims.json id (see NOTES.md). */
(function () {
'use strict';
const F = window.FILM, P = F.params;
const CUT = -1.2815515655446004;          // PhiInv(0.1), the same value the claims' bisection gives
let Z = null, EPS = null;                  // the seeded draw: Z[i] shared shock, EPS[i][j] own shock

// grid geometry (design units)
const GX = 56, GSTRIDE = 155.5, PX = 13.5, MW = 10, MH = 7, GY = 170, PY = 9;
const cellX = (i, j) => GX + Math.floor(i / 25) * GSTRIDE + PX * j;
const cellY = (i) => GY + (i % 25) * PY;
// hook row
const HX = 64, HP = 58, HW = 44, HH = 28, HY = 200;
// scale
const AX0 = 72, AU = 56, AY = 330, ax = (u) => AX0 + AU * u;
const TRUTH = [0.163494, 3.21792, 6.92486];   // claims truth-0, truth-03, truth-06 (per 100 years)
const BAD06 = [33, 49, 55, 57, 65, 91, 95], BAD03 = [33, 57, 91];

const ss = (u) => u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u);
function rhoAt(t) {
  if (t < 47.7) return 0;
  if (t < 50.5) return 0.3 * ss((t - 47.7) / 2.8);
  if (t < 51.8) return 0.3;
  if (t < 54.5) return 0.3 + 0.3 * ss((t - 51.8) / 2.7);
  return 0.6;
}
const stopOf = (t) => (t < 47.7) ? 0 : (t >= 50.5 && t < 51.8) ? 0.3 : (t >= 54.5) ? 0.6 : null;
const fails = (i, j, r) => Math.sqrt(r) * Z[i] + Math.sqrt(1 - r) * EPS[i][j] < CUT;
function rowF(i, r) { let f = 0; for (let j = 0; j < 10; j++) if (fails(i, j, r)) f++; return f; }

// try-it maths (page only): the formula at any rho
function erf(x) { const t = Math.abs(x); let r; if (t < 3) { let s = t, term = t; for (let n = 1; n < 200; n++) { term *= -t * t / n; s += term / (2 * n + 1); } r = 2 / Math.sqrt(Math.PI) * s; } else { let f = 0; for (let q = 60; q >= 1; q--) f = q / 2 / (t + f); r = 1 - Math.exp(-t * t) / Math.sqrt(Math.PI) / (t + f); } return x < 0 ? -r : r; }
const Phi = (x) => 0.5 * (1 + erf(x / Math.SQRT2));
function tail(q, kk) { let s = 0, c = 1; for (let j = 0; j <= 10; j++) { if (j > 0) c = c * (10 - j + 1) / j; if (j >= kk) s += c * q ** j * (1 - q) ** (10 - j); } return s; }
function Pk(r) { if (r === 0) return 100 * tail(0.1, 5); let s = 0; const h = 0.002; for (let z = -8 + h / 2; z < 8; z += h) s += tail(Phi((CUT - Math.sqrt(r) * z) / Math.sqrt(1 - r)), 5) * Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI) * h; return 100 * s; }

window.FILM_RENDER = {
  setup(p, K) {
    const r = K.mulberry32(P.seed);
    const nrm = () => { const u1 = 1 - r(), u2 = r(); return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2); };
    Z = []; EPS = [];
    for (let i = 0; i < P.years; i++) { Z.push(nrm()); const e = []; for (let j = 0; j < P.n; j++) e.push(nrm()); EPS.push(e); }
    window.CR_CHECK = [0, 0.3, 0.6].map(rr => { let tot = 0, bad = 0; for (let i = 0; i < 100; i++) { const f = rowF(i, rr); tot += f; if (f >= 5) bad++; } return [rr, tot, bad]; });
  },

  render(t, s, K) {
    const { tx, ln, rc, path, seg, ease, lerp, typed, C } = K;
    const ctx = K.ctx;
    const T = (key, x, y, str, o, role) => { const el = tx(key, 'labels', x, y, str, o); el.setAttribute('data-role', role || 'must-read'); return el; };
    const A = F.commit.at, sealed = t >= A + 4.5;
    const ch = K.chapterAt(t);
    K.chrome(t, ch, {
      ledger: { title: 'CASE FILE', rows: F.ledger.filter(r => r[0] <= t), hl: null },
      block: { title: 'TEN BETS', lines: ['CORRELATED RISK', 'ISSUED FOR REVIEW'], open: 0.4, slotLabel: 'NUMBER',
               slot: sealed ? (s.answer === 'none' ? 'NONE' : 'SEALED') : null },
    });
    K.roll(t, 0, 1.0);

    /* ── HOOK + COMMIT: ten suppliers, one row ── */
    if (t < 16.8) {
      const out = 1 - seg(t, 16, 16.8);
      for (let j = 0; j < 10; j++) {
        const a = seg(t, 0.4 + 0.12 * j, 0.7 + 0.12 * j) * out;
        if (a <= 0) continue;
        ctx.globalAlpha = a; ctx.strokeStyle = C.ink; ctx.lineWidth = 2;
        ctx.strokeRect(HX + HP * j, HY - 16 * (1 - out), HW, HH);
      }
      ctx.globalAlpha = 1;
      const ho = seg(t, 0.6, 1.0) * out;
      if (ho > 0) T('h.head', HX, 160, "WE'RE DIVERSIFIED ACROSS 10 SUPPLIERS", { fam: 'disp', size: 34, op: ho });
      const so = seg(t, 4.2, 4.6) * out;
      if (so > 0) T('h.sub', HX, 268, 'EACH FAILS ABOUT ONE YEAR IN TEN', { size: 28, op: so, weight: 500 });
      const po = seg(t, 8.2, 8.6) * out;
      if (po > 0) {
        T('c.p1', HX, 320, 'OUT OF 100 YEARS, IN HOW MANY', { size: 28, op: po, weight: 500 });
        T('c.p2', HX, 356, 'DO 5 OR MORE OF THE 10 FAIL?', { size: 28, op: po, weight: 500 });
      }
    }
    if (t >= 7.5 && t < 17) K.commitBox(t, s, { title: 'YOUR NUMBER', prompt: 'BAD YEARS OF 100', out: 16 });

    /* ── CASE: two loans, one senior slice ── */
    if (t >= 16.3 && t < 36) {
      const co = seg(t, 16.3, 16.8) * (1 - seg(t, 35.6, 36));
      const tie = seg(t, 25.7, 26.1);
      [['A', 150], ['B', 236]].forEach(([nm, y]) => {
        rc('k.m' + nm, 'marks', HX, y, HW, HH, { stroke: C.ink, w: 2, fill: C.accent, fo: tie, op: co });
        T('k.l' + nm, HX, y - 8, 'MORTGAGE ' + nm, { size: 14, op: co, weight: 500, ls: '0.06em' }, 'secondary');
      });
      T('k.each', HX, 292, 'EACH FAILS ONE YEAR IN TEN', { size: 14, op: co, weight: 500, ls: '0.04em' }, 'secondary');
      const lu = ease(seg(t, 17.5, 19.5));
      if (lu > 0) {
        ln('k.la', 'marks', HX + HW, 164, lerp(HX + HW, 300, lu), lerp(164, 180, lu), { w: 1.5, op: co });
        ln('k.lb', 'marks', HX + HW, 250, lerp(HX + HW, 300, lu), lerp(250, 235, lu), { w: 1.5, op: co });
        const po = co * seg(t, 18.6, 19.5);
        rc('k.pool', 'marks', 300, 130, 110, 150, { stroke: C.ink, w: 1.6, op: po });
        ln('k.pmid', 'marks', 300, 205, 410, 205, { w: 1.2, op: po });
        rc('k.sen', 'field', 300, 130, 110, 75, { fill: C.chalk, op: po });
        T('k.ps1', 310, 158, 'SENIOR', { size: 14, op: po, weight: 500, ls: '0.06em' }, 'secondary');
        T('k.ps2', 310, 178, 'RATED AAA', { size: 14, op: po, ls: '0.06em' }, 'secondary');
        T('k.pj', 310, 233, 'JUNIOR', { size: 14, op: po, weight: 500, ls: '0.06em' }, 'secondary');
      }
      const ro = co * seg(t, 20.7, 21.2);
      if (ro > 0) {
        T('k.r0', 432, 146, 'FAILS ONLY IF BOTH FAIL', { size: 14, op: ro, weight: 500, ls: '0.04em' }, 'secondary');
        T('k.r1', 432, 186, '1 OF 100 YEARS', { fam: 'disp', size: 30, op: ro * (1 - 0.55 * tie) });
      }
      if (tie > 0) {
        path('k.tie', 'marks', `M ${HX - 4} 164 L ${HX - 10} 164 L ${HX - 10} 250 L ${HX - 4} 250`, { stroke: C.accent, w: 3, op: co * tie, cap: 'square' });
        T('k.tl', HX, 210, 'FAIL TOGETHER', { size: 14, op: co * tie, fill: C.accent, weight: 500, ls: '0.06em' }, 'secondary');
        const su = ease(seg(t, 26.0, 26.5));
        ln('k.strike', 'labels', 430, 176, lerp(430, 600, su), 176, { stroke: C.ink, w: 2, op: co });
        T('k.r2', 432, 230, '10 OF 100 YEARS', { fam: 'disp', size: 30, op: co * seg(t, 26.3, 26.8), fill: C.accent });
      }
      const lo = co * seg(t, 30.2, 30.7);
      if (lo > 0) {
        ln('k.rule', 'marks', 48, 318, 664, 318, { w: 0.9, op: lo });
        T('k.g1', 48, 342, "MOODY'S · 2006 · TRIPLE-A MORTGAGE SECURITIES", { size: 14, op: lo, weight: 500, ls: '0.04em' }, 'secondary');
        T('k.g2', 48, 392, '83', { fam: 'disp', size: 52, op: lo, fill: C.accent });
        T('k.g3', 104, 390, 'OF EVERY 100 LATER DOWNGRADED', { size: 18, op: lo, weight: 500 }, 'secondary');
      }
    }

    /* ── COUNT: a hundred years of ten ── */
    if (t >= 36) {
      const rho = rhoAt(t), stop = stopOf(t);
      const toS4 = seg(t, 54.7, 55.5), mon = seg(t, 62, 62.6);
      const dimAll = 1 - 0.8 * mon;
      const gridOp = (1 - toS4) * dimAll;
      const badNow = [];
      for (let i = 0; i < 100; i++) if (rowF(i, rho) >= 5) badNow.push(i);
      const flying = new Set(t >= 54.7 ? BAD06 : []);
      // grid
      for (let i = 0; i < 100; i++) {
        if (flying.has(i)) continue;
        let a;
        if (i === 0) a = 1; else a = seg(t, 37.4 + 0.04 * i, 37.55 + 0.04 * i);
        a *= gridOp; if (a <= 0) continue;
        const bad = badNow.includes(i);
        if (bad) { ctx.globalAlpha = a * 0.16; ctx.fillStyle = C.accent; ctx.fillRect(cellX(i, 0) - 3, cellY(i) - 1, 136.5, 9); }
        for (let j = 0; j < 10; j++) {
          let x = cellX(i, j), y = cellY(i), w = MW, h = MH;
          if (i === 0 && t < 37.4) {
            const u = ease(seg(t, 36, 37.4));
            x = lerp(HX + HP * j, x, u); y = lerp(HY, y, u); w = lerp(HW, MW, u); h = lerp(HH, MH, u);
          }
          ctx.globalAlpha = a;
          if (fails(i, j, rho)) { ctx.fillStyle = C.accent; ctx.fillRect(x, y, w, h); }
          else { ctx.strokeStyle = C.ink; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1); }
        }
        if (bad) { ctx.globalAlpha = a; ctx.fillStyle = C.accent; ctx.fillRect(cellX(i, 0) + 133, cellY(i), 3, MH); }
      }
      ctx.globalAlpha = 1;
      // header: rho and the two counters (digits only at the three stops)
      const ho = seg(t, 37.4, 37.7) * (1 - toS4) * dimAll;
      if (ho > 0) {
        const rs = stop == null ? 'ρ →' : 'ρ ' + stop;
        const desc = stop == null ? 'SHARED SHOCK RISING' : stop === 0 ? 'NO SHARED SHOCK' : stop === 0.3 ? 'SOME SHARED SHOCK' : 'STRONG SHARED SHOCK';
        T('n.rho', GX, 154, rs, { size: 28, op: ho, weight: 500 });
        T('n.rhod', GX, 124, desc, { size: 14, op: ho, weight: 500, ls: '0.06em' }, 'secondary');
        const co = seg(t, 41.5, 41.8) * ho;
        if (co > 0) {
          let tot = 0; for (let i = 0; i < 100; i++) tot += rowF(i, rho);
          T('n.fl', 330, 124, 'FAILURES', { size: 14, op: co, weight: 500, ls: '0.06em' }, 'secondary');
          T('n.bl', 470, 124, 'YEARS WITH 5+ OF 10', { size: 14, op: co, weight: 500, ls: '0.06em' }, 'secondary');
          T('n.fv', 330, 154, stop == null ? '–' : String(tot), { size: 28, op: co * (stop == null ? 0.4 : 1), weight: 500 });
          T('n.bv', 470, 154, stop == null ? '–' : String(badNow.length), { size: 28, op: co * (stop == null ? 0.4 : 1), weight: 500, fill: C.accent });
        }
      }
      /* S4: the bad-years scale */
      if (t >= 54.7) {
        const so = seg(t, 54.7, 55.3) * dimAll;
        ln('s.ax', 'marks', AX0, AY, ax(10), AY, { w: 1.2, op: so });
        T('s.a0', AX0 - 8, AY + 16, '0', { size: 14, op: so, anchor: 'end' }, 'chrome');
        T('s.a10', ax(10) + 8, AY + 16, '10', { size: 14, op: so }, 'chrome');
        T('s.at', ax(10), 398, 'BAD YEARS PER 100 YEARS', { size: 14, op: so, anchor: 'end', weight: 500, ls: '0.06em' }, 'secondary');
        // stacks: counted rows fly out of the grid
        const SW = 6.5, SH = 4.5, SP = 8, SPY = 7;
        const drawStack = (rows, rr, cx, a0, fly) => {
          rows.forEach((i, m) => {
            const u = fly ? ease(seg(t, a0 + 0.08 * m, a0 + 0.9 + 0.08 * m)) : 1;
            const a = (fly ? 1 : seg(t, a0, a0 + 0.5)) * dimAll; if (a <= 0) return;
            const ty = AY - 16 - m * SPY, tx0 = cx - (9 * SP + SW) / 2;
            for (let j = 0; j < 10; j++) {
              const x = lerp(cellX(i, j), tx0 + SP * j, u), y = lerp(cellY(i), ty, u), w = lerp(MW, SW, u), h = lerp(MH, SH, u);
              ctx.globalAlpha = a;
              if (fails(i, j, rr)) { ctx.fillStyle = C.accent; ctx.fillRect(x, y, w, h); }
              else { ctx.strokeStyle = C.ink; ctx.lineWidth = 0.8; ctx.strokeRect(x + 0.4, y + 0.4, w - 0.8, h - 0.8); }
            }
          });
          ctx.globalAlpha = 1;
        };
        drawStack(BAD06, 0.6, ax(7), 55.0, true);
        drawStack(BAD03, 0.3, ax(3), 55.7, false);
        const ko = seg(t, 56.0, 56.4) * dimAll;
        if (ko > 0) {
          T('s.k6', ax(7), AY - 16 - 6 * SPY - 10, '7', { size: 28, op: ko, anchor: 'middle', weight: 500, fill: C.accent });
          T('s.k3', ax(3), AY - 16 - 2 * SPY - 10, '3', { size: 28, op: ko, anchor: 'middle', weight: 500, fill: C.accent });
          T('s.k0', ax(0), AY - 12, '0', { size: 28, op: ko, anchor: 'middle', weight: 500, fill: C.accent });
          T('s.r6', ax(7) + 46, AY - 10, 'ρ 0.6', { size: 14, op: ko, weight: 500 }, 'secondary');
          T('s.r3', ax(3) + 46, AY - 10, 'ρ 0.3', { size: 14, op: ko, weight: 500 }, 'secondary');
          T('s.r0', ax(0) + 14, AY - 10, 'ρ 0', { size: 14, op: ko, weight: 500 }, 'secondary');
        }
        // YOU: the sealed number, placed on the scale
        const yo = seg(t, 56.5, 57.0) * dimAll;
        if (yo > 0) {
          if (K.answered(s)) {
            const g = +s.answer, gx = g > 10 ? ax(10) : ax(g);
            path('s.you', 'marks', `M ${(gx - 7).toFixed(1)} ${AY - 14} L ${(gx + 7).toFixed(1)} ${AY - 14} L ${gx.toFixed(1)} ${AY - 2} Z`, { fill: C.ink, stroke: C.ink, w: 1, op: yo });
            T('s.yl', gx, AY - 22, 'YOU', { size: 14, op: yo, anchor: 'middle', weight: 500, ls: '0.08em' }, 'secondary');
            T('s.yv', gx, AY - 42, String(g) + (g > 10 ? ' →' : ''), { size: 28, op: yo, anchor: 'middle', weight: 500 });
          } else {
            T('s.yn', ax(0) + 50, AY - 42, 'NO NUMBER HELD', { size: 14, op: yo, weight: 500, ls: '0.06em' }, 'secondary');
          }
        }
        // the formula, below the axis; percentages only after the counts
        const fo = seg(t, 57.5, 58.0) * dimAll, pc = t >= 58.8;
        if (fo > 0) {
          const lab = ['0.16', '3.2', '6.9'];
          TRUTH.forEach((u, q) => {
            ln('s.tr' + q, 'marks', ax(u), AY, ax(u), AY + 20, { stroke: C.accent, w: 1.5, op: fo });
            const first = q === 0;
            T('s.tl' + q, first ? 50 : ax(u), AY + 44, lab[q] + (pc ? ' %' : ''), { size: 28, op: fo, anchor: first ? 'start' : 'middle', weight: 500, fill: C.accent });
          });
        }
        const bo = seg(t, 59.5, 60.0) * dimAll;
        if (bo > 0) {
          const bx0 = ax(TRUTH[0]), bx1 = ax(TRUTH[2]), by = 226;
          path('s.br', 'marks', `M ${bx0.toFixed(1)} ${by + 10} L ${bx0.toFixed(1)} ${by} L ${bx1.toFixed(1)} ${by} L ${bx1.toFixed(1)} ${by + 10}`, { stroke: C.ink, w: 1.2, op: bo, cap: 'square' });
          T('s.bx', (bx0 + bx1) / 2, by - 10, '≈ 42×', { size: 28, op: bo, anchor: 'middle', weight: 500 });
        }
      }
    }

    /* ── MONDAY ── */
    if (t >= 62) {
      const mo = seg(t, 62.0, 62.6);
      rc('m.panel', 'labels', 48, 112, 616, 168, { fill: C.paper, fo: 0.94, op: mo });
      T('m.eb', 64, 144, 'ASK ON MONDAY', { size: 14, op: mo, weight: 500, ls: '0.2em', fill: C.accent }, 'secondary');
      const qo = seg(t, 62.3, 62.9);
      T('m.q1', 64, 196, 'WHAT ONE SHOCK WOULD HIT', { fam: 'disp', size: 42, op: qo });
      T('m.q2', 64, 244, 'FIVE OF OUR TEN AT ONCE?', { fam: 'disp', size: 42, op: qo });
    }
  },

  tryit(v, s, K) {
    const r = Math.min(0.9, Math.max(0, +v.rho || 0));
    let tot = 0, bad = 0, zero = 0;
    for (let i = 0; i < 100; i++) { const f = rowF(i, r); tot += f; if (f >= 5) bad++; if (f === 0) zero++; }
    const pct = Pk(r);
    return `<div class="ex">THE SAME HUNDRED YEARS AT ρ ${r.toFixed(2)}</div>` +
      `<div class="big">${bad} BAD YEARS</div>` +
      `<div class="ex">${tot} failures · ${zero} years with none · formula ${pct.toFixed(2)} %</div>` +
      (typeof s.answer === 'number' ? `<p>You held ${s.answer}.</p>` : '');
  },
};
})();
