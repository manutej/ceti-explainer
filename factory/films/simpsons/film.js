/* factory/films/simpsons/film.js · "Worse Overall" · Simpson's paradox, Berkeley 1973.
   One clock: render(t, state) draws frame t from t alone. 4,526 marks (one per applicant) are canvas mass;
   type and lines are retained SVG. Seeded shuffles (mulberry32 1973 / 1975) are computed once in setup. */
(function () {
'use strict';
const F = window.FILM, PR = F.params;
const D = ['A', 'B', 'C', 'D', 'E', 'F'];
const P = 3.6, SQ = 2.8, COLS = 50, Y0 = 146, GAP = 3;
const X = { m: 74, w: 272 };                       // column left edges (180 wide each)
const LX = { m: 476, w: 540, hi: 604 };            // department ledger columns
const SEX = {
  m: { n: D.map(d => PR['m' + d]), a: D.map(d => PR['m' + d + 'a']), seed: 1973, label: 'MEN' },
  w: { n: D.map(d => PR['w' + d]), a: D.map(d => PR['w' + d + 'a']), seed: 1975, label: 'WOMEN' },
};
const sum = (a) => a.reduce((x, y) => x + y, 0);
const pct = (a, n) => Math.round(100 * a / n);
// band rows: max of ceil(men/50), ceil(women/50) per department -> [17, 12, 12, 9, 8, 8]
const ROWS = D.map((_, i) => Math.max(Math.ceil(SEX.m.n[i] / COLS), Math.ceil(SEX.w.n[i] / COLS)));
const TOP = []; { let y = Y0; ROWS.forEach((r, i) => { TOP.push(y); y += r * P + GAP; }); }
const MID = TOP.map((y, i) => y + ROWS[i] * P / 2);

// timings (s)
const T = { arrive0: 17.0, arriveDur: 7.0, ink0: 24.5, ink1: 26.0, sort0: 26.5, sortDur: 2.0, under0: 31.0,
  pct: 36.0, dimHdr: 39.6, split0: 40.0, ledger0: 46.0, guess0: 52.0, higher0: 52.6, mix0: 56.0, mixPct: 58.5,
  fieldOut: 62.0, monday0: 62.4 };
const RATE = sum(SEX.m.n) / T.arriveDur;           // marks per second, same for both columns

let M = null;   // per sex: arrays of mark data
function build(K, key) {
  const S = SEX[key], N = sum(S.n);
  const dep = new Int8Array(N), adm = new Uint8Array(N), j = new Int16Array(N);
  let i = 0;
  S.n.forEach((n, d) => { for (let k = 0; k < n; k++, i++) { dep[i] = d; adm[i] = k < S.a[d] ? 1 : 0; j[i] = k; } });
  const perm = K.shuffle([...Array(N).keys()], S.seed);          // perm[k] = mark at pooled slot k
  const pooled = new Int32Array(N), sorted = new Int32Array(N);
  const A = sum(S.a); let ra = 0, rr = A;
  perm.forEach((m, k) => { pooled[m] = k; sorted[m] = adm[m] ? ra++ : rr++; });
  return { N, A, dep, adm, j, pooled, sorted, x0: X[key] };
}
const gx = (x0, s) => x0 + P * (s % COLS);
const gy = (y0, s) => y0 + P * Math.floor(s / COLS);

function T_(K, key, layer, x, y, s, o, role) {          // tx + data-role for the gate's legibility classes
  const el = K.tx(key, layer, x, y, s, o);
  if (role && el.getAttribute('data-role') !== role) el.setAttribute('data-role', role);
  return el;
}

window.FILM_RENDER = {
  setup(p, K) {
    M = { m: build(K, 'm'), w: build(K, 'w') };
    const g = K.svg && K.svg.querySelector('[data-layer=marks]');
    if (g) g.setAttribute('data-role', 'secondary');   // stamps and box frames: labels, never results
  },

  render(t, s, K) {
    const { seg, ease, eout, lerp, typed, fmtK, C } = K;
    const ch = K.chapterAt(t), sealed = t >= F.commit.at + 4.5;
    K.chrome(t, ch, {
      ledger: { title: 'REVISIONS', rows: F.ledger.filter(r => t >= r[0]), hl: F.ledger.filter(r => t >= r[0]).length - 1 },
      block: { title: 'CASE · BERKELEY', lines: ['SIX DEPARTMENTS', 'FALL 1973'], open: 0.4, slotLabel: 'GUESS', slot: sealed ? 'SEALED' : null },
    });
    K.roll(t, 0, 1.0);

    /* ── S1 verdict sheet: HOOK and MONDAY ── */
    const sheetOp = t < 17 ? 1 - seg(t, 16.0, 16.6) : seg(t, T.monday0, T.monday0 + 0.8);
    if (sheetOp > 0) {
      T_(K, 'hk.e', 'labels', 74, 150, 'SALES REVIEW', { size: 14, ls: '0.2em', weight: 500, op: sheetOp * (t < 17 ? seg(t, 0.3, 0.7) : 1) }, 'secondary');
      K.ln('hk.r', 'labels', 74, 160, 600, 160, { w: 0.9, op: sheetOp * 0.7 });
      T_(K, 'hk.h', 'labels', 74, 214, t < 17 ? typed('New sales process', t, 0.6, 30) : 'New sales process', { fam: 'disp', size: 48, op: sheetOp }, 'must-read');
      T_(K, 'hk.v', 'labels', 74, 258, t < 17 ? typed('Converts worse overall.', t, 1.4, 30) : 'Converts worse overall.', { size: 28, weight: 500, op: sheetOp }, 'must-read');
      if (t >= 4.4) {
        const k = eout(seg(t, 4.4, 4.65));
        K.stamp('hk.st', 'marks', 500, 214, lerp(1.15, 1, k), 'KILLED', { op: sheetOp * seg(t, 4.4, 4.5), rim: C.accent, rot: -6, fs: 30, h: 48 });
      }
      if (t >= 63.0) {
        K.pencil(420, 218, 584, 206, seg(t, 63.0, 63.6), 9, { w: 2.6 });
        T_(K, 'mo.q', 'labels', 74, 320, typed('Same mix of leads?', t, 63.6, 24), { fam: 'disp', size: 44, fill: C.accent }, 'must-read');
        T_(K, 'mo.s', 'labels', 74, 364, typed('Split by segment. Then compare.', t, 64.6, 30), { size: 28, weight: 500 }, 'must-read');
      }
    }

    /* ── S2 commit box ── */
    if (t >= F.commit.at - 1.2 && t < 16.6) {
      K.commitBox(t, s, { title: F.commit.title, prompt: 'OF 6 DEPARTMENTS', out: 16.0 });
    }

    /* ── S3 mark field: CASE and COUNT ── */
    if (t >= T.arrive0 && t < T.fieldOut + 1) {
      const fo = 1 - seg(t, T.fieldOut, T.fieldOut + 0.8);
      const ctx = K.ctx, mix = seg(t, T.mix0, T.mix0 + 0.6);
      for (const key of ['m', 'w']) {
        const G = M[key];
        const ink = [], pale = [], inkDim = [], paleDim = [];
        for (let i = 0; i < G.N; i++) {
          const k = G.pooled[i], ta = T.arrive0 + k / RATE;
          if (t < ta) continue;
          let x = gx(G.x0, k), y = gy(Y0, k);
          if (t >= T.sort0) {
            const so = G.sorted[i], u = ease(seg(t, T.sort0 + 0.6 * so / G.N, T.sort0 + 0.6 * so / G.N + T.sortDur));
            x = lerp(x, gx(G.x0, so), u); y = lerp(y, gy(Y0, so), u);
            if (t >= T.split0) {
              const d = G.dep[i], nd = (key === 'm' ? SEX.m : SEX.w).n[d];
              const t0 = T.split0 + 0.5 * d + 0.3 * G.j[i] / nd, v = ease(seg(t, t0, t0 + 2.0));
              x = lerp(x, gx(G.x0, G.j[i]), v); y = lerp(y, gy(TOP[d], G.j[i]), v);
            }
          }
          const isInk = G.adm[i] && t >= T.ink0 + (T.ink1 - T.ink0) * k / G.N;
          const dimmed = mix > 0 && G.dep[i] >= 2;
          (isInk ? (dimmed ? inkDim : ink) : (dimmed ? paleDim : pale)).push(x, y);
        }
        const fade = seg(t, T.arrive0, T.arrive0 + 0.3) * fo;
        const draw = (arr, style) => { ctx.fillStyle = style; for (let q = 0; q < arr.length; q += 2) ctx.fillRect(arr[q] + 0.4, arr[q + 1] + 0.4, SQ, SQ); };
        draw(pale, K.rgba('muted', 0.42 * fade)); draw(ink, K.rgba('ink', 0.92 * fade));
        draw(paleDim, K.rgba('muted', lerp(0.42, 0.16, mix) * fade)); draw(inkDim, K.rgba('ink', lerp(0.92, 0.3, mix) * fade));
      }

      // column headers: counts first, the percentage only from 36 s
      const hop = fo * (t < T.dimHdr ? 1 : t < T.mix0 ? lerp(1, 0.4, seg(t, T.dimHdr, T.dimHdr + 0.4)) : lerp(0.4, 1, mix));
      for (const key of ['m', 'w']) {
        const S = SEX[key], G = M[key], x = G.x0, N = G.N, A = G.A;
        const ab = S.n[0] + S.n[1];
        let l1, l2;
        if (t < T.sort0) { l1 = S.label + ' ' + fmtK(Math.min(N, Math.max(0, Math.floor((t - T.arrive0) * RATE) + 1))); l2 = 'APPLIED'; }
        else if (t < T.pct) { l1 = S.label + ' ' + fmtK(A); l2 = 'ADMITTED OF ' + fmtK(N); }
        else if (t < T.mix0) { l1 = S.label + ' ' + pct(A, N) + ' %'; l2 = fmtK(A) + ' ÷ ' + fmtK(N); }
        else if (t < T.mixPct) { l1 = S.label + ' ' + fmtK(ab); l2 = 'OF ' + fmtK(N) + ' TO A OR B'; }
        else { l1 = S.label + ' ' + pct(ab, N) + ' %'; l2 = fmtK(ab) + ' ÷ ' + fmtK(N); }
        const fl = [T.sort0 + 0.5, T.pct, T.mix0, T.mixPct].reduce((o, a) => (t >= a - 0.2 && t < a + 0.4 ? Math.min(o, Math.abs(t - a - 0.1) / 0.3) : o), 1);
        T_(K, 'hd.1' + key, 'labels', x, 128, l1, { size: 28, weight: 500, op: hop * Math.max(0.15, Math.min(1, fl)) }, 'must-read');
        T_(K, 'hd.2' + key, 'labels', x, 142, l2, { size: 14, op: hop * 0.9 }, 'secondary');
      }
      // women's admitted block, underlined while pooled
      if (t >= T.under0 && t < T.split0) {
        const yy = Y0 + P * Math.ceil(M.w.A / COLS) + 2;
        K.pencil(X.w, yy, X.w + COLS * P, yy, seg(t, T.under0, T.under0 + 1.2), 4, { w: 1.6 });
      }
      // band letters
      const bl = seg(t, T.dimHdr, T.dimHdr + 0.5) * fo;
      if (bl > 0) D.forEach((d, i) => T_(K, 'bl.' + d, 'labels', 58, MID[i] + 6, d, { fam: 'disp', size: 18, anchor: 'middle', op: bl * (mix > 0 && i >= 2 ? lerp(1, 0.4, mix) : 1) }, 'secondary'));

      /* ── S4 department ledger: rates per band (marks first, rates after) ── */
      const lo = seg(t, T.ledger0 - 0.4, T.ledger0) * fo;
      if (lo > 0) {
        T_(K, 'lg.hm', 'labels', LX.m, 142, 'MEN', { size: 14, ls: '0.08em', op: lo * 0.85 }, 'secondary');
        T_(K, 'lg.hw', 'labels', LX.w, 142, 'WOMEN', { size: 14, ls: '0.08em', op: lo * 0.85 }, 'secondary');
        if (t >= T.higher0) T_(K, 'lg.hh', 'labels', LX.hi, 142, 'HIGHER', { size: 14, ls: '0.08em', op: lo * 0.85 * seg(t, T.higher0, T.higher0 + 0.3) }, 'secondary');
        D.forEach((d, i) => {
          const ro = seg(t, T.ledger0 + 0.6 * i, T.ledger0 + 0.6 * i + 0.4) * fo * (mix > 0 && i >= 2 ? lerp(1, 0.45, mix) : 1);
          if (ro <= 0) return;
          const mr = pct(SEX.m.a[i], SEX.m.n[i]), wr = pct(SEX.w.a[i], SEX.w.n[i]);
          const y = MID[i] + 7, menUp = SEX.w.a[i] / SEX.w.n[i] < SEX.m.a[i] / SEX.m.n[i];
          T_(K, 'lg.m' + d, 'labels', LX.m, y, mr + ' %', { size: 20, weight: 500, op: ro }, 'secondary');
          T_(K, 'lg.w' + d, 'labels', LX.w, y, wr + ' %', { size: 20, weight: 500, op: ro }, 'secondary');
          const ho = seg(t, T.higher0 + 0.3 * i, T.higher0 + 0.3 * i + 0.3) * ro;
          if (ho > 0) {
            T_(K, 'lg.h' + d, 'labels', LX.hi, y - 2, menUp ? 'MEN' : 'WOMEN', { size: 14, weight: 500, ls: '0.06em', fill: menUp ? C.accent : C.ink, op: ho }, 'secondary');
            if (menUp) K.pencil(LX.m - 4, y + 5, 660, y + 5, seg(t, T.higher0 + 0.3 * i, T.higher0 + 0.3 * i + 0.5), 20 + i, { w: 1.4 });
          }
        });
      }
      // the mix: A and B bracketed
      if (mix > 0) {
        const y1 = TOP[0], y2 = TOP[1] + ROWS[1] * P;
        K.pencil(66, y1, 66, y2, seg(t, T.mix0, T.mix0 + 0.6), 31, { w: 1.8 });
        K.pencil(66, y1, 70, y1, mix, 32, { w: 1.8, over: 0 }); K.pencil(66, y2, 70, y2, mix, 33, { w: 1.8, over: 0 });
      }
    }

    /* ── S4 guess strip: the sealed number placed against the truth (right column, where it was sealed) ── */
    const go = seg(t, T.guess0, T.guess0 + 0.6) * (1 - seg(t, T.fieldOut, T.fieldOut + 0.6));
    if (go > 0) {
      const bx = 700, by = 150, bw = 230, bh = 150;
      const worse = D.reduce((n, d, i) => n + (SEX.w.a[i] / SEX.w.n[i] < SEX.m.a[i] / SEX.m.n[i] ? 1 : 0), 0);
      K.rc('gs.o', 'marks', bx, by, bw, bh, { stroke: C.ink, w: 1.4, dash: '6 4', op: go, fill: C.chalk, fo: 0.45 });
      T_(K, 'gs.h', 'labels', bx + 14, by + 34, 'YOUR GUESS', { fam: 'disp', size: 28, ls: '0.05em', op: go }, 'must-read');
      const nx = (k) => bx + 22 + 31 * k, ny = by + 84;
      const g = K.answered(s) ? s.answer : null;
      for (let k = 0; k <= 6; k++) {
        if (k === worse) K.rc('gs.tb', 'marks', nx(k) - 11, ny - 20, 22, 27, { fill: C.ink, op: go });
        T_(K, 'gs.n' + k, 'labels', nx(k), ny, String(k), { size: 20, weight: 500, anchor: 'middle', fill: k === worse ? C.chalk : C.ink, op: go }, 'secondary');
      }
      const ru = seg(t, T.guess0 + 0.4, T.guess0 + 1.0);
      if (g != null) {
        const cx = nx(g), cy = ny - 7, R = 15, a = 2 * Math.PI * Math.min(0.999, ru);
        const p1 = [cx + R * Math.sin(a), cy - R * Math.cos(a)];
        K.path('gs.ring', 'labels', `M ${cx} ${cy - R} A ${R} ${R} 0 ${a > Math.PI ? 1 : 0} 1 ${p1[0].toFixed(2)} ${p1[1].toFixed(2)}`, { stroke: C.accent, w: 2.2, op: go * (ru > 0 ? 1 : 0) });
        T_(K, 'gs.you', 'labels', cx, ny - 30, 'YOU', { size: 14, weight: 500, anchor: 'middle', fill: C.accent, op: go * ru }, 'secondary');
      } else T_(K, 'gs.you', 'labels', bx + 14, ny - 30, 'NO ANSWER', { size: 14, weight: 500, fill: C.accent, op: go * ru }, 'secondary');
      T_(K, 'gs.tr', 'labels', nx(worse), ny + 22, 'TRUTH', { size: 14, weight: 500, anchor: 'middle', op: go * seg(t, T.guess0 + 0.8, T.guess0 + 1.2) }, 'secondary');
      const hv = seg(t, T.guess0 + 1.0, T.guess0 + 1.4) * go;
      T_(K, 'gs.l', 'labels', bx + 14, by + bh - 12, worse + ' OF 6', { size: 28, weight: 500, op: hv }, 'must-read');
      T_(K, 'gs.l2', 'labels', bx + 126, by + bh - 24, 'WOMEN', { size: 14, op: hv, ls: '0.04em' }, 'secondary');
      T_(K, 'gs.l3', 'labels', bx + 126, by + bh - 10, 'DID WORSE', { size: 14, op: hv, ls: '0.04em' }, 'secondary');
    }
  },

  tryit(v, s, K) {
    // women applying to A or B, kept in A:B proportion; the rest across C-F in their original proportion;
    // every department keeps its 1973 admission rate for women
    const W = SEX.w, N = sum(W.n), ab = Math.max(0, Math.min(N, +v.ab));
    const rate = W.a.map((a, i) => a / W.n[i]);
    const nAB = W.n[0] + W.n[1], nCF = N - nAB;
    let adm = 0;
    [0, 1].forEach(i => (adm += ab * W.n[i] / nAB * rate[i]));
    [2, 3, 4, 5].forEach(i => (adm += (N - ab) * W.n[i] / nCF * rate[i]));
    const wr = Math.round(100 * adm / N), mr = pct(sum(SEX.m.a), sum(SEX.m.n));
    return `<div class="ex">WOMEN TO A OR B</div><div class="big">${K.fmtK(ab)} of ${K.fmtK(N)}</div>` +
      `<div class="ex">women admitted overall ${wr} % · men ${mr} % · department rates unchanged</div>` +
      (typeof s.answer === 'number' ? `<p>You sealed ${s.answer} of 6.</p>` : '');
  },
};
})();
