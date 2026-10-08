/* streaks · "Three bad months" · 75 s case. One clock: render(t, state) is a pure function of t and state.answer.
   All data precomputed in setup from seeded streams (mulberry32 1985 for the rows and the tally, 140 for the strip). */
(function () {
'use strict';
const F = window.FILM, P = F.params;
const N = P.n, WN = P.wallN;
let SEQ, LEN, COLOF, KIN, ARR, STRIP, BOXES, RUN0, ROWL;

/* ── geometry ── */
const HX = (m) => 80 + 50 * m, HY = 230;                     // hook strip
const RY = (i) => 116 + 30 * i, FX = (j) => 56 + 7.2 * j;    // count rows
const RCOL = 904;                                            // right column (ledger and block are off)
const TB = 356, CX = (c) => 64 + 72 * c;                     // tally baseline, column left
const colOf = (L) => Math.min(9, Math.max(0, L - 4));
const ROW0 = 36.6, ROWS_AT = (i) => 40.2 + 0.28 * (i - 1);   // row i >= 1 start
const LAND = (m) => m < 10 ? 47.0 + 0.08 * m + 1.2 : 49.0 + (m - 10) * 4.0 / 990 + 0.25;

function longestRuns(a) {
  let best = 1, c = 1; for (let j = 1; j < a.length; j++) { c = a[j] === a[j - 1] ? c + 1 : 1; if (c > best) best = c; }
  const runs = []; let s = 0;
  for (let j = 1; j <= a.length; j++) if (j === a.length || a[j] !== a[j - 1]) { if (j - s === best) runs.push(s); s = j; }
  return { best, runs };
}

window.FILM_RENDER = {
  setup(p, K) {
    const r = K.mulberry32(P.wallSeed);
    SEQ = []; LEN = []; BOXES = [];
    for (let m = 0; m < WN; m++) {
      const a = new Uint8Array(N); for (let j = 0; j < N; j++) a[j] = r() < 0.5 ? 1 : 0;   // 1 = up (heads), 0 = down
      const lr = longestRuns(a); SEQ.push(a); LEN.push(lr.best); if (m < 10) BOXES.push(lr.runs);
    }
    ROWL = LEN.slice(0, 10);
    COLOF = LEN.map(colOf);
    const seen = new Array(10).fill(0); KIN = COLOF.map(c => seen[c]++);
    ARR = LEN.map((_, m) => LAND(m));
    RUN0 = []; { let c = 0; for (let j = 0; j < N; j++) { c = j > 0 && SEQ[0][j] === SEQ[0][j - 1] ? c + 1 : 1; RUN0.push(c); } }
    const h = K.mulberry32(P.hookSeed); STRIP = []; for (let m = 0; m < P.months; m++) STRIP.push(h() < 0.5 ? 1 : 0);
  },

  render(t, s, K) {
    const { tx, ln, rc, path, stamp, seg, ease, eout, lerp, typed, fmtK, C, ctx } = K;
    const role = (el, r) => { if (el) el.setAttribute('data-role', r); return el; };
    const T = (key, layer, x, y, str, o, r) => role(tx(key, layer, x, y, str, o), r || 'secondary');
    const ch = K.chapterAt(t);
    K.chrome(t, ch, { ledger: false, block: false });
    K.roll(t, 0, 0.8);
    const A = F.commit.at, SEAL = A + 4.5;
    const g = K.answered(s) ? Math.round(s.answer) : null;

    /* ═════ S1 · the 12-month strip (HOOK, dim under COMMIT, back in MONDAY) ═════ */
    const stripOp = t < 8 ? 1 : t < 16 ? lerp(1, 0.3, seg(t, 8, 8.6)) * (1 - seg(t, 15.6, 16)) : t >= 62 ? seg(t, 62, 62.6) : 0;
    if (stripOp > 0) {
      ln('h.base', 'marks', 60, HY, 660, HY, { op: 0.35 * stripOp });
      const mon = 'JFMAMJJASOND';
      for (let m = 0; m < P.months; m++) {
        const t0 = 0.5 + 0.35 * m, u = t >= 62 ? 1 : eout(seg(t, t0, t0 + 0.25));
        if (u <= 0) continue;
        const up = STRIP[m] === 1, hgt = 68 * u, red = m >= 9 && (t >= 62 || t >= 4.6 + 0.2 * (m - 9));
        rc('h.t' + m, 'marks', HX(m) - 9, up ? HY - 2 - hgt : HY + 2, 18, hgt, { fill: red ? C.accent : C.ink, op: t >= 62 ? stripOp : stripOp * seg(t, t0, t0 + 0.15) });
        T('h.m' + m, 'labels', HX(m), 322, mon[m], { size: 14, anchor: 'middle', op: stripOp * 0.8 }, 'secondary');
      }
      const bu = t >= 62 ? 1 : seg(t, 5.2, 5.5);
      if (bu > 0) path('h.br', 'marks', `M ${HX(9) - 12} 328 L ${HX(9) - 12} 334 L ${lerp(HX(9) - 12, HX(11) + 12, bu)} 334` + (bu >= 1 ? ` L ${HX(11) + 12} 328` : ''), { stroke: C.accent, w: 1.6, op: stripOp });
      if (t < 8.6) T('h.tag', 'labels', HX(11) + 12, 372, '3 MONTHS DOWN', { size: 28, weight: 500, anchor: 'end', fill: C.accent, op: seg(t, 5.6, 5.9) * (1 - seg(t, 8, 8.6)) }, 'must-read');
      if (t < 8) T('h.sub', 'labels', 60, 140, 'MONTHLY SALES · UP OR DOWN', { size: 14, ls: '0.12em', op: seg(t, 0.4, 0.8) }, 'secondary');
    }

    /* ═════ S2 · the commit box ═════ */
    if (t >= A - 1.2 && t < 16.4) K.commitBox(t, s, { title: F.commit.title, prompt: 'IN 100 FAIR FLIPS', out: 15.9 });

    /* ═════ S3 · the fans (CASE) ═════ */
    if (t >= 16 && t < 36) {
      const op = seg(t, 16, 16.4) * (1 - seg(t, 35.4, 36));
      T('c.top', 'labels', 56, 104, '100 FANS · CORNELL AND STANFORD', { size: 14, ls: '0.08em', op }, 'secondary');
      const filled = Math.max(0, Math.min(91, Math.floor((t - 20.8) / 0.022) + 1));
      for (let k = 0; k < 100; k++) {
        const r = Math.floor(k / 10), c = k % 10, a = seg(t, 16.6 + 0.14 * r, 16.8 + 0.14 * r) * op;
        if (a <= 0) continue;
        const x = 56 + 22 * c, y = 112 + 22 * r;
        if (k < filled) { ctx.fillStyle = K.rgba('ink', 0.9 * op); ctx.fillRect(x, y, 16, 16); }
        else { ctx.strokeStyle = K.rgba('ink', 0.8 * a); ctx.lineWidth = 1.2; ctx.strokeRect(x + 0.6, y + 0.6, 14.8, 14.8); }
      }
      if (t >= 20.8) {
        T('c.n', 'labels', 292, 176, String(filled), { fam: 'disp', size: 64, op }, 'must-read');
        T('c.of', 'labels', 292, 210, 'OF 100', { size: 28, weight: 500, op }, 'must-read');
        const la = seg(t, 21.0, 21.4) * op;
        T('c.l1', 'labels', 56, 352, 'SAY: BETTER CHANCE AFTER 2 OR 3 HITS', { size: 14, ls: '0.04em', op: la }, 'secondary');
        T('c.l2', 'labels', 56, 370, 'THAN AFTER 2 OR 3 MISSES', { size: 14, ls: '0.04em', op: la }, 'secondary');
      }
      const BX = 440, SC = 3.6, BY = [160, 230, 300];
      const bars = [[P.shooterPct, 'SHOOTS 50 OF 100', C.ink], [P.afterHitGuess, "FANS' GUESS AFTER A HIT", C.muted], [P.afterMissGuess, "FANS' GUESS AFTER A MISS", C.muted]];
      bars.forEach(([v, lab, col], i) => {
        const u = ease(seg(t, 25.8 + 0.8 * i, 26.4 + 0.8 * i)); if (u <= 0) return;
        const dimmed = i > 0 ? lerp(1, 0.45, seg(t, 31.4, 31.8)) : 1;
        T('c.bl' + i, 'labels', BX, BY[i] - 8, lab, { size: 14, ls: '0.06em', op: op * seg(t, 25.8 + 0.8 * i, 26.1 + 0.8 * i) }, 'secondary');
        rc('c.b' + i, 'marks', BX, BY[i], v * SC * u, 20, { fill: col, op: op * dimmed });
        if (u >= 1) T('c.bv' + i, 'labels', BX + v * SC + 10, BY[i] + 19, String(v), { size: 28, weight: 500, op: op * dimmed }, 'must-read');
      });
      BY.forEach((y, i) => { if (t >= 25.8 + 0.8 * i) ln('c.fifty' + i, 'marks', BX + 50 * SC, y - 4, BX + 50 * SC, y + 24, { op: 0.8 * op, w: 1.2 }); });
      if (t >= 30.8) {
        const a = seg(t, 30.8, 31.4) * op;
        T('c.76', 'labels', BX, 372, '76ERS 1980–81: NO LINK', { size: 28, weight: 500, op: a }, 'must-read');
        T('c.76s', 'labels', BX, 392, 'NO POSITIVE CORRELATION, SHOT TO SHOT', { size: 14, ls: '0.04em', op: a }, 'secondary');
      }
    }

    /* ═════ S4 · rows of 100, then the tally (COUNT) ═════ */
    if (t >= 36.4 && t < 62.6) {
      const out = 1 - seg(t, 62, 62.6);
      // rows: canvas ticks; fade out 46.8 to 47.6
      const rowOp = (1 - seg(t, 46.8, 47.6)) * out;
      if (rowOp > 0) {
        if (t < 47) T('r.hd', 'labels', RCOL, 100, 'LONGEST RUN', { size: 14, anchor: 'end', ls: '0.1em', op: seg(t, 36.6, 37) * (1 - seg(t, 44, 44.3)) }, 'secondary');
        for (let i = 0; i < 10; i++) {
          const st = i === 0 ? ROW0 : ROWS_AT(i), dt = i === 0 ? 0.03 : 0.012, done = st + dt * 100;
          if (t < st) continue;
          const y = RY(i), vis = Math.min(N, Math.floor((t - st) / dt) + 1);
          ctx.strokeStyle = K.rgba('ink', 0.25 * rowOp); ctx.lineWidth = 0.75;
          ctx.beginPath(); ctx.moveTo(52, y); ctx.lineTo(776, y); ctx.stroke();
          ctx.fillStyle = K.rgba('ink', 0.88 * rowOp);
          for (let j = 0; j < vis; j++) { const up = SEQ[i][j] === 1; ctx.fillRect(FX(j), up ? y - 11 : y + 1, 3.2, 10); }
          const bt0 = i === 0 ? 39.6 : done, bt1 = bt0 + (i === 0 ? 0.5 : 0.3);
          const L = ROWL[i];
          BOXES[i].forEach((s0, q) => {
            const u = seg(t, bt0, bt1); if (u <= 0) return;
            const x0 = FX(s0) - 2, w = FX(s0 + L - 1) + 5.2 - x0, per = 2 * (w + 28);
            rc('r.bx' + i + '_' + q, 'marks', x0, y - 14, w, 28, { stroke: C.accent, w: 1.6, op: rowOp, dash: u < 1 ? `${(per * u).toFixed(1)} ${per.toFixed(1)}` : null });
          });
          let lab = null, col = C.ink;
          if (i === 0 && t < 40.1) { lab = String(RUN0[vis - 1]); col = C.muted; }
          else if (t >= (i === 0 ? 40.1 : bt1)) lab = String(L);
          if (lab != null && t < 47.0 + 0.08 * i) {
            const low = g != null && t >= 44 && L <= g;
            T('r.v' + i, 'labels', RCOL, y + 10, lab, { size: 28, weight: 500, anchor: 'end', fill: low ? C.muted : col, op: rowOp }, 'must-read');
            if (low) ln('r.u' + i, 'marks', RCOL - 40, y + 14, RCOL, y + 14, { stroke: C.accent, w: 1.6, op: rowOp });
          }
        }
        if (t >= 44 && t < 47) {
          const a = seg(t, 44, 44.4) * rowOp;
          if (g != null) {
            const k = ROWL.filter(L => L > g).length;
            T('r.g', 'labels', RCOL, 92, `${k} OF 10 BEAT YOUR ${g}`, { size: 28, weight: 500, anchor: 'end', op: a }, 'must-read');
          }
        }
      }
      // labels in flight: rows -> tally (47.0 to 49.0)
      for (let i = 0; i < 10; i++) {
        const t0 = 47.0 + 0.08 * i, t1 = t0 + 1.2;
        if (t < t0 || t >= t1) continue;
        const u = ease(seg(t, t0, t1)), c = COLOF[i], k = KIN[i];
        const xe = CX(c) + 6 * (k % 10), ye = TB - 6 * (Math.floor(k / 10) + 1) + 1;
        const x = lerp(RCOL - 14, xe + 2.5, u), y = lerp(RY(i) + 10, ye + 5, u);
        T('f.v' + i, 'labels', x, y, String(ROWL[i]), { size: 28, weight: 500, anchor: 'middle', op: (1 - seg(t, t1 - 0.2, t1)) * out }, 'must-read');
      }
      // the tally
      if (t >= 46.8) {
        const ta = seg(t, 46.8, 47.4) * out;
        ln('t.ax', 'marks', 60, TB + 1.5, 776, TB + 1.5, { op: ta, w: 1 });
        const cg = g == null ? null : g < 4 ? -1 : Math.min(9, g - 4);
        const dimAt = seg(t, 53.6, 54.0);
        const nC = new Array(10).fill(0);
        for (let m = 0; m < WN; m++) {
          const c = COLOF[m], k = KIN[m], land = ARR[m];
          if (t < land - (m < 10 ? 0.2 : 0.25)) continue;
          const xe = CX(c) + 6 * (k % 10), ye = TB - 6 * (Math.floor(k / 10) + 1) + 1;
          let y = ye, a = 1;
          if (m < 10) a = seg(t, land - 0.2, land);
          else if (t < land) { y = lerp(120, ye, eout(seg(t, land - 0.25, land))); a = 0.85; }
          if (t >= land) nC[c]++;
          const low = cg != null && c <= cg && LEN[m] <= g;
          ctx.fillStyle = low ? K.rgba('muted', lerp(0.9, 0.55, dimAt) * a * out) : K.rgba('ink', 0.9 * a * out);
          ctx.fillRect(xe, y, 5, 5);
        }
        for (let c = 0; c < 10; c++) {
          T('t.al' + c, 'labels', CX(c) + 30, 388, c === 9 ? '13+' : String(c + 4), { size: 28, weight: 500, anchor: 'middle', op: ta }, 'must-read');
          if (nC[c] > 0) T('t.n' + c, 'labels', CX(c) + 30, TB - 6 * Math.ceil(nC[c] / 10) - 8, String(nC[c]), { size: 28, weight: 500, anchor: 'middle', op: out }, 'must-read');
        }
        const landed = nC.reduce((a, b) => a + b, 0);
        T('t.rh', 'labels', RCOL, 200, 'ROWS', { size: 14, anchor: 'end', ls: '0.12em', op: ta }, 'secondary');
        T('t.rn', 'labels', RCOL, 244, fmtK(landed), { fam: 'disp', size: 48, anchor: 'end', op: ta }, 'must-read');
        // your number on the tally
        if (t >= 53) {
          const a = seg(t, 53, 53.4) * out;
          if (g != null) {
            const xr = 64 + 72 * (cg + 1) - 6, u = seg(t, 53, 53.6);
            ln('t.gr', 'marks', xr, 120, xr, lerp(120, 360, u), { stroke: C.accent, w: 2, op: out });
            const c = LEN.filter(L => L <= g).length, right = g >= 9;
            const x = right ? xr - 8 : xr + 8, an = right ? 'end' : 'start';
            T('t.gl', 'labels', x, 132, `YOUR ${g} · ${fmtK(c)} AT OR BELOW`, { size: 28, weight: 500, anchor: an, fill: C.accent, op: a }, 'must-read');
            T('t.gs', 'labels', x, 150, `${fmtK(WN - c)} RAN LONGER`, { size: 14, weight: 500, anchor: an, ls: '0.06em', op: a }, 'secondary');
          } else T('t.gn', 'labels', 64, 132, 'NO GUESS', { size: 28, weight: 500, fill: C.muted, op: a }, 'must-read');
        }
        if (t >= 56) {
          const u = seg(t, 56, 56.5), x0 = CX(3), x1 = CX(9) + 60;
          path('t.b7', 'marks', `M ${x0} 176 L ${x0} 168 L ${lerp(x0, x1, u)} 168` + (u >= 1 ? ` L ${x1} 176` : ''), { stroke: C.ink, w: 1.4, op: out });
          const ge7 = LEN.filter(L => L >= 7).length;
          T('t.b7l', 'labels', (x0 + x1) / 2, 158, `7 OR MORE: ${ge7} OF ${fmtK(WN)}`, { size: 28, weight: 500, anchor: 'middle', op: seg(t, 56.3, 56.7) * out }, 'must-read');
        }
        if (t >= 59) {
          const a = seg(t, 59, 59.4) * out;
          T('t.e1', 'labels', RCOL, 280, 'EXACT · ALL 100-FLIP', { size: 14, anchor: 'end', ls: '0.04em', op: a }, 'secondary');
          T('t.e2', 'labels', RCOL, 296, 'SEQUENCES', { size: 14, anchor: 'end', ls: '0.04em', op: a }, 'secondary');
          T('t.p7', 'labels', RCOL, 336, '54 %', { fam: 'disp', size: 40, anchor: 'end', op: a }, 'must-read');
          T('t.p7l', 'labels', RCOL, 352, 'RUN OF 7+', { size: 14, anchor: 'end', op: a }, 'secondary');
          T('t.p5', 'labels', RCOL, 390, '97 %', { fam: 'disp', size: 40, anchor: 'end', op: a }, 'must-read');
          T('t.p5l', 'labels', RCOL, 406, 'RUN OF 5+', { size: 14, anchor: 'end', op: a }, 'secondary');
        }
      }
    }

    /* ═════ MONDAY: the strip is coin flips ═════ */
    if (t >= 62.8) {
      const k = seg(t, 63.0, 63.22);
      if (k > 0) stamp('m.st', 'marks', 480, 124, lerp(1.4, 0.9, eout(k)), '12 COIN FLIPS', { op: k, fs: 32 });
      const a = seg(t, 63.6, 64.0);
      T('m.r', 'labels', 56, 372, '58 OF 100 COIN-FLIP YEARS HAVE ONE', { size: 28, weight: 500, op: a }, 'must-read');
      T('m.rs', 'labels', 56, 392, 'A 3-MONTH FALL SOMEWHERE IN 12 MONTHS · EXACT', { size: 14, ls: '0.04em', op: a }, 'secondary');
      const b = seg(t, 64.4, 64.8);
      if (b > 0) {
        path('m.ub', 'marks', `M ${HX(0) - 12} 156 L ${HX(0) - 12} 150 L ${HX(2) + 12} 150 L ${HX(2) + 12} 156`, { stroke: C.muted, w: 1.4, op: b });
        T('m.ul', 'labels', HX(0) - 12, 142, 'NOBODY CALLED THIS A TREND', { size: 14, ls: '0.04em', fill: C.muted, op: b }, 'secondary');
      }
    }
  },

  tryit(v, s, K) {
    const n = Math.max(2, Math.round(v.n || 100)), k = Math.max(2, Math.round(v.k || 7));
    const pLess = (K_) => {               // P(longest run of the same side < K_) in n fair flips
      let st = new Float64Array(K_ + 1); st[1] = 1;
      for (let i = 1; i < n; i++) { const x = new Float64Array(K_ + 1); for (let r = 1; r < K_; r++) { x[1] += st[r] / 2; if (r + 1 < K_) x[r + 1] += st[r] / 2; } st = x; }
      let a = 0; for (let r = 1; r < K_; r++) a += st[r]; return a;
    };
    const p = 1 - pLess(k);
    let E = 0; for (let K_ = 1; K_ <= Math.min(n, 60); K_++) E += 1 - pLess(K_);
    return `<div class="ex">EXACT, EVERY POSSIBLE SEQUENCE OF ${n}</div><div class="big">${(100 * p).toFixed(1)} %</div>` +
      `<div class="ex">chance of a run of ${k} or more in a row · expected longest run ${E.toFixed(2)}</div>` +
      (typeof s.answer === 'number' ? `<p>You sealed ${s.answer}. In 100 flips the chance the longest run is ${s.answer} or less is ${(100 * pLess(Math.round(s.answer) + 1)).toFixed(1)} %.</p>` : '');
  },
};
})();
