/* The Winner's Curse · 75-second case · film.js
   Four structures: S1 bid sheet (HOOK, MONDAY), S2 commit (COMMIT), S3 ruler bars (CASE), S4 auction rows (COUNT).
   Pure: every frame is render(t, state); the 400 estimates are drawn once in setup from mulberry32(1971). */
(function () {
'use strict';
const F = window.FILM, P = F.params;
let EST = null, WIN = null, WIX = null, HI_CUM = null, MEANW = 0;   // estimates [a][b], winner value, winner index, cumulative high count
const LET = 'ABCDEFGHIJ';

function draw(K, seed, A, N, V, E) {
  const r = K.mulberry32(seed), est = [];
  for (let a = 0; a < A; a++) { const w = []; for (let b = 0; b < N; b++) w.push(V * (1 + E * (2 * r() - 1))); est.push(w); }
  return est;
}

window.FILM_RENDER = {
  setup(p, K) {
    EST = draw(K, P.seed, P.A, P.N, P.V, P.E);
    WIN = EST.map(w => Math.max(...w));
    WIX = EST.map((w, i) => w.indexOf(WIN[i]));
    MEANW = WIN.reduce((x, y) => x + y, 0) / WIN.length;   // 12.364… (claim mean_win)
    HI_CUM = []; let c = 0;
    EST.forEach(w => { c += w.filter(x => x > P.V).length; HI_CUM.push(c); });
  },

  render(t, s, K) {
    const { tx, ln, rc, stamp, seg, ease, eout, lerp, typed, fmtK, C } = K;
    const sealAt = F.commit.at + 4.5, sealed = t >= sealAt;
    // chrome: chapter eyebrow/title; the case swaps its sub-title at the jar
    let ch = K.chapterAt(t);
    if (t >= 29 && t < 36) ch = { eyebrow: 'CLASSROOM · 48 AUCTIONS · JARS OF COINS', title: 'A jar of coins' };
    K.chrome(t, ch, {
      ledger: { title: 'BID LOG', rows: F.ledger.filter(r => t >= r[0]), hl: t >= 36 && t < 62 ? 4 : null },
      block: { title: "WINNER'S CURSE", lines: ['CASE · SEALED BIDS', 'TEN BIDS · ONE LOT'], open: 0.4, slotLabel: 'GUESS', slot: sealed ? (s.answer === 'none' ? 'NONE' : 'SEALED') : null },
    });
    K.roll(t, 0, 1.0);

    /* ── S1 · the bid sheet (HOOK 0–8, MONDAY 62–72) ── */
    const sheet = (key, op, mon) => {
      for (let i = 0; i < 10; i++) {
        const y = 132 + i * 26, rowOp = op * (mon ? 1 : seg(t, 0.2 + 0.2 * i, 0.5 + 0.2 * i));
        if (rowOp <= 0) continue;
        const ours = i === 3, second = i === 6, lit = !mon || ours || second;
        const o = rowOp * (lit ? 1 : 0.35);
        const lab = mon && ours ? 'US' : mon && second ? 'SECOND' : 'BIDDER ' + LET[i];
        tx(key + 'l' + i, 'labels', 60, y, lab, { size: 16, weight: 500, ls: '0.06em', op: o, fill: mon && ours ? C.accent : C.ink });
        rc(key + 'e' + i, 'marks', 180, y - 13, 150, 17, { fill: C.chalk, stroke: mon && ours ? C.accent : C.ink, w: 0.8, op: o });
        tx(key + 's' + i, 'labels', 255, y - 0.5, 'SEALED', { size: 14, anchor: 'middle', op: o * 0.6, ls: '0.2em' });
        ln(key + 'u' + i, 'marks', 60, y + 7, 330, y + 7, { op: o * 0.3 });
      }
    };
    if (t < 8.2) {
      const out = 1 - seg(t, 7.6, 8.2);
      sheet('hk', out, false);
      stamp('hk.won', 'marks', 255, 206, 0.8, 'WON', { op: seg(t, 3.0, 3.15) * out, rim: C.accent });
      tx('hk.h1', 'labels', 380, 214, typed('WE WON.', t, 3.4, 14), { fam: 'disp', size: 56, op: out, fill: C.accent });
      tx('hk.h2', 'labels', 380, 262, typed('SO WE GOT', t, 4.6, 16), { fam: 'disp', size: 36, op: out });
      tx('hk.h3', 'labels', 380, 304, typed('A GOOD PRICE?', t, 5.2, 16), { fam: 'disp', size: 36, op: out });
    }
    if (t >= 62) {
      const a = seg(t, 62.2, 62.8);
      sheet('mo', a, true);
      tx('mo.q1', 'labels', 380, 176, typed('WHAT WAS THE', t, 62.8, 18), { fam: 'disp', size: 36 });
      tx('mo.q2', 'labels', 380, 216, typed('SECOND BID?', t, 63.5, 18), { fam: 'disp', size: 36, fill: C.accent });
      tx('mo.q3', 'labels', 380, 276, typed('WHY WERE WE', t, 64.4, 18), { fam: 'disp', size: 36 });
      tx('mo.q4', 'labels', 380, 316, typed('HIGHER?', t, 65.1, 18), { fam: 'disp', size: 36 });
      tx('mo.src', 'labels', 60, 394, 'Capen et al. 1971 · Thaler 1988 · Bazerman & Samuelson 1983', { size: 14, op: 0.8 * seg(t, 67.8, 68.4) });
    }

    /* ── S2 · the commit (8–16) ── */
    if (t >= 8 && t < 16.2) {
      const out = 1 - seg(t, 15.6, 16.1);
      ['BLOCK WORTH $10M', '10 BIDDERS', 'EACH OFF BY UP TO $3M', 'HIGHEST GUESS WINS', 'AND PAYS ITS GUESS.'].forEach((s1, i) =>
        tx('cm.l' + i, 'labels', 60, 160 + i * 46, typed(s1, t, 8.2 + 0.55 * i, 30), { size: 28, weight: 500, op: out, fill: i >= 3 ? C.accent : C.ink }));
      K.commitBox(t, s, { title: F.commit.title, prompt: F.commit.unit, out: 15.6 });
    }

    /* ── S3 · the ruler bars (CASE 16–36) ── */
    if (t >= 16 && t < 29) {
      const out = 1 - seg(t, 28.4, 29.0), X = (m) => 60 + m * 0.56;
      ln('ns.base', 'marks', 60, 140, 60, lerp(140, 310, ease(seg(t, 16.4, 17.0))), { w: 1.5, op: out });
      const u1 = ease(seg(t, 20.2, 21.4)), u2 = ease(seg(t, 22.0, 23.0));
      tx('ns.l1', 'labels', 66, 152, 'WINNING BIDS · SUMMED', { size: 16, weight: 500, ls: '0.06em', op: seg(t, 20.0, 20.4) * out });
      rc('ns.b1', 'marks', 60, 160, X(P.ns_win * u1) - 60, 40, { fill: C.accent, op: out * 0.92 });
      tx('ns.v1', 'labels', X(P.ns_win) + 10, 190, '$900M', { fam: 'disp', size: 32, op: seg(t, 21.2, 21.5) * out, fill: C.accent });
      tx('ns.l2', 'labels', 66, 246, 'NEXT-BEST BIDS · SAME TRACTS', { size: 16, weight: 500, ls: '0.06em', op: seg(t, 21.8, 22.2) * out });
      rc('ns.b2', 'marks', 60, 254, X(P.ns_second * u2) - 60, 40, { fill: C.ink, op: out * 0.85 });
      tx('ns.v2', 'labels', X(P.ns_second) + 10, 284, '$370M', { fam: 'disp', size: 32, op: seg(t, 22.8, 23.1) * out });
      const g = seg(t, 23.6, 24.0) * out;
      if (g > 0) {
        const x1 = X(P.ns_second), x2 = X(P.ns_win), y = 318;
        ln('ns.g', 'marks', x1, y, x2, y, { stroke: C.accent, w: 1.4, op: g });
        ln('ns.ga', 'marks', x1, y - 8, x1, y + 8, { stroke: C.accent, w: 1.4, op: g });
        ln('ns.gb', 'marks', x2, y - 8, x2, y + 8, { stroke: C.accent, w: 1.4, op: g });
        tx('ns.gv', 'labels', (x1 + x2) / 2, y + 36, '$530M MORE', { fam: 'disp', size: 32, anchor: 'middle', fill: C.accent, op: g });
        tx('ns.gr', 'labels', (x1 + x2) / 2, y + 60, '2.4× · 900 ÷ 370', { size: 16, anchor: 'middle', op: seg(t, 24.4, 24.8) * out });
      }
    }
    if (t >= 29 && t < 36.4) {
      const out = 1 - seg(t, 35.8, 36.3), X = (v) => 60 + v * 46, x8 = X(P.jar_value);
      const u1 = ease(seg(t, 29.4, 30.2)), u2 = ease(seg(t, 32.8, 33.6));
      ln('jr.base', 'marks', 60, 150, 60, 310, { w: 1.5, op: out * seg(t, 29.0, 29.3) });
      ln('jr.tru', 'marks', x8, lerp(320, 140, ease(seg(t, 29.2, 29.7))), x8, 320, { w: 1.5, op: out });
      tx('jr.trl', 'labels', x8, 132, 'WORTH $8.00', { fam: 'disp', size: 28, anchor: 'middle', op: seg(t, 29.5, 29.8) * out });
      tx('jr.l1', 'labels', 66, 168, 'AVERAGE GUESS', { size: 16, weight: 500, ls: '0.06em', op: seg(t, 29.3, 29.6) * out });
      rc('jr.b1', 'marks', 60, 176, X(P.jar_est * u1) - 60, 36, { fill: C.ink, op: out * 0.85 });
      tx('jr.v1', 'labels', X(P.jar_est) + 10, 204, '$5.13', { fam: 'disp', size: 30, op: seg(t, 30.0, 30.3) * out });
      const v2 = P.jar_winbid * u2;
      tx('jr.l2', 'labels', 66, 254, 'AVERAGE WINNING BID', { size: 16, weight: 500, ls: '0.06em', op: seg(t, 32.6, 32.9) * out });
      rc('jr.b2', 'marks', 60, 262, X(Math.min(v2, P.jar_value)) - 60, 36, { fill: C.ink, op: out * 0.85 });
      if (v2 > P.jar_value) rc('jr.b2r', 'marks', x8, 262, X(v2) - x8, 36, { fill: C.accent, op: out * 0.95 });
      tx('jr.v2', 'labels', X(P.jar_winbid) + 10, 290, '$10.01', { fam: 'disp', size: 30, op: seg(t, 33.4, 33.7) * out, fill: C.accent });
      tx('jr.ls', 'labels', (x8 + X(P.jar_winbid)) / 2, 334, '−$2.01', { fam: 'disp', size: 30, anchor: 'middle', fill: C.accent, op: seg(t, 33.8, 34.2) * out });
    }

    /* ── S4 · the auction rows (COUNT 36–62) ── */
    if (t >= 36 && t < 62.5) {
      const out = 1 - seg(t, 61.8, 62.4);
      const XV = (v) => 60 + (v - 7) * 70, xT = XV(P.V), yAx = 380, Y = (a) => 188 + a * 4.6;
      const ctx = K.ctx;
      // ruler
      ln('ct.ax', 'marks', 60, yAx, lerp(60, 480, eout(seg(t, 36.0, 37.2))), yAx, { w: 1.2, op: out });
      [7, 8, 9, 10, 11, 12, 13].forEach((v, i) => ln('ct.tk' + i, 'marks', XV(v), yAx, XV(v), yAx + 5, { op: out * seg(t, 36.2 + 0.1 * i, 36.4 + 0.1 * i) }));
      tx('ct.t7', 'labels', 60, 397, '$7M', { size: 14, anchor: 'middle', op: out * seg(t, 36.3, 36.6) });
      tx('ct.t13', 'labels', 480, 397, '$13M', { size: 14, anchor: 'middle', op: out * seg(t, 36.9, 37.2) });
      // truth line
      ln('ct.tr', 'marks', xT, yAx, xT, lerp(yAx, 130, ease(seg(t, 37.2, 38.0))), { w: 1.6, op: out });
      tx('ct.trl', 'labels', xT - 6, 124, 'TRUE $10M', { fam: 'disp', size: 28, anchor: 'end', op: out * seg(t, 37.6, 38.0) });

      // column
      const col = (i, eb, val, o, fill) => {
        if (o <= 0) return;
        const y = 186 + i * 60;
        tx('ct.ce' + i, 'labels', 512, y, eb, { size: 14, weight: 500, ls: '0.08em', op: o * 0.85 });
        tx('ct.cv' + i, 'labels', 512, y + 30, val, { fam: 'disp', size: 30, op: o, fill: fill || C.ink });
      };

      if (t < 44.0) {
        // phase B: auction 1 enlarged
        const yc = 276;
        let hi = 0;
        for (let b = 0; b < 10; b++) {
          const t0 = 38.4 + 0.32 * b, u = eout(seg(t, t0, t0 + 0.25));
          if (t < t0) continue;
          const v = EST[0][b], x = XV(v), win = b === WIX[0] && t >= 41.8;
          const y = lerp(yc - 40, yc, u);
          rc('ct.b' + b, 'marks', x - (win ? 2.5 : 1.5), y - 28, win ? 5 : 3, 56, { fill: win ? C.accent : C.ink, op: out * (0.4 + 0.6 * u) });
          if (u >= 1 && v > P.V) { hi++; rc('ct.bd' + b, 'marks', x - 2, yc + 34, 4, 4, { fill: C.ink, op: out }); }
        }
        if (t >= 38.6) col(0, 'GUESSES HIGH', hi + ' of 10', out * seg(t, 38.6, 38.9));
        if (t >= 41.8) tx('ct.w1', 'labels', XV(WIN[0]) + 4, 238, '$13.0M · WINS', { fam: 'disp', size: 28, anchor: 'end', fill: C.accent, op: out * seg(t, 41.8, 42.2) });
      } else {
        // phase C: row 0 collapses into the stack, rows 1..39 land
        const cu = ease(seg(t, 44.0, 44.6));
        let landed = 0;
        for (let a = 0; a < P.A; a++) {
          const ta = a === 0 ? 44.0 : 44.6 + 0.18 * (a - 1);
          if (t < ta) break;
          landed = a + 1;
          const fa = a === 0 ? 1 : seg(t, ta, ta + 0.15);
          const yc = a === 0 ? lerp(276, Y(0), cu) : Y(a), h = a === 0 ? lerp(56, 3.8, cu) : 3.8;
          for (let b = 0; b < P.N; b++) {
            const win = b === WIX[a], x = XV(EST[a][b]), w = win ? 2.6 : 1.6;
            ctx.fillStyle = win ? K.rgba('accent', 0.95 * fa * out) : K.rgba('ink', 0.55 * fa * out);
            ctx.fillRect(x - w / 2, yc - h / 2, w, win ? h : h * 0.8);
          }
        }
        const k = t >= 44.6 ? landed : 1;
        const gh = HI_CUM[k - 1];
        col(0, 'GUESSES HIGH', fmtK(gh) + ' of ' + fmtK(k * P.N), out);
        col(1, 'WINNERS HIGH', fmtK(k) + ' of ' + fmtK(k), out * seg(t, 44.6, 45.0), C.accent);
        // phase D: settle
        if (t >= 52.0) {
          rc('ct.wash', 'field', xT, 132, 480 - xT, yAx - 132, { fill: C.ink, op: 0.06 * out * seg(t, 52.0, 52.4) });
          col(2, 'AVERAGE GUESS', '$10.0M', out * seg(t, 53.2, 53.6));
        }
        // phase E: the average win, your guess, the overpay
        if (t >= 56.0) {
          const xw = XV(MEANW), u = ease(seg(t, 56.0, 56.8));
          ln('ct.aw', 'marks', xw, 130, xw, lerp(130, yAx, u), { stroke: C.accent, w: 1.8, dash: '6 4', op: out });
          tx('ct.awl', 'labels', xw + 6, 124, 'AVG WIN $12.4M', { fam: 'disp', size: 28, fill: C.accent, op: out * seg(t, 56.6, 57.0) });
        }
        if (t >= 57.4 && t >= sealAt) {
          const o = out * seg(t, 57.4, 57.8);
          if (K.answered(s)) {
            const g = +s.answer, gx = XV(Math.max(7, Math.min(13, g)));
            ln('ct.you', 'marks', gx, 132, gx, yAx + 6, { stroke: C.dark, w: 2.5, op: o });
            tx('ct.youl', 'labels', gx, 397, (g < 7 ? '‹ ' : '') + 'YOU' + (g > 13 ? ' ›' : ''), { size: 14, weight: 500, anchor: 'middle', op: o });
            col(3, 'YOU SAID', '$' + g + 'M', o, C.dark);
          } else col(3, 'YOU SAID', 'NO GUESS', o, C.dark);
        }
        if (t >= 59.0) {
          const o = out * seg(t, 59.0, 59.4), x1 = xT, x2 = XV(MEANW), y = 138;
          ln('ct.ov', 'marks', x1, y, x2, y, { stroke: C.accent, w: 1.4, op: o });
          ln('ct.ova', 'marks', x1, y - 6, x1, y + 6, { stroke: C.accent, w: 1.4, op: o });
          ln('ct.ovb', 'marks', x2, y - 6, x2, y + 6, { stroke: C.accent, w: 1.4, op: o });
          const lab = t >= 60.6 ? '+$2.4M · 24 %' : '+$2.4M A DEAL';
          rc('ct.ovbg', 'marks', (x1 + x2) / 2 - 88, y + 9, 176, 30, { fill: C.paper, op: o });
          tx('ct.ovl', 'labels', (x1 + x2) / 2, y + 34, lab, { fam: 'disp', size: 28, anchor: 'middle', fill: C.accent, op: o });
        }
      }
    }
  },

  tryit(v, s, K) {
    const n = Math.round(v.n), e = v.e / 100, seed = Math.round(v.seed), V = 10, A = 40;
    const est = draw(K, seed, A, n, V, e), win = est.map(w => Math.max(...w));
    const hi = est.flat().filter(x => x > V).length, wh = win.filter(x => x > V).length;
    const mw = win.reduce((a, b) => a + b, 0) / A, th = V * (1 + e * (n - 1) / (n + 1));
    const all = Math.pow(2, n);
    return `<div class="ex">40 AUCTIONS · ${n} BIDDERS · ±${v.e} % · SEED ${seed}</div>` +
      `<div class="big">${wh} OF ${A} WINNERS HIGH</div>` +
      `<p>${hi} of ${A * n} guesses were above $10M. The winner paid $${mw.toFixed(1)}M on average (theory: $${th.toFixed(1)}M). ` +
      `A winner is high unless every guess is low: ${(all - 1).toLocaleString('en-US')} of ${all.toLocaleString('en-US')} auctions.</p>` +
      (typeof s.answer === 'number' ? `<p>You sealed $${s.answer}M.</p>` : '');
  },
};
})();
