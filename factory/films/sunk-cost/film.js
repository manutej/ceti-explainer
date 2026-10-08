/* sunk-cost · "The Season Ticket" · the 75-second case.
   Arkes & Blumer (1985): 54 season-ticket holders, three prices, the first five plays.
   One clock: render(t, state, K) is pure. The only randomness is seeded (mulberry32 via K.shuffle) and runs in setup. */
(function () {
'use strict';
const F = window.FILM;

/* ── geometry (design units; content box x 48–664, y 104–400) ── */
const SQ = 12, P = 14, GX = 140, RX = 420;          // square, pitch, grid left, right-hand text column
const TOP = { g15: 122, g8: 214, g13: 306 };          // band tops: $15, $8 ($7 off), $13 ($2 off)
const TIM = {                                         // reveal start, sweep per play, sort start, sort spread/len
  g15: { T0: 36.4, D: 1.0, Ts: 47.0, sp: 0.3, sl: 0.7 },
  g8: { T0: 42.0, D: 1.0, Ts: 47.0, sp: 0.3, sl: 0.7 },
  g13: { T0: 54.0, D: 0.44, Ts: 56.4, sp: 0.15, sl: 0.45 },
};
const STRUCK = { g15: [6, 13], g13: [9], g8: [4, 11, 16] };   // couples (which ones is not reported: fixed, not data)
let G = null, DEAL = null;

window.FILM_RENDER = {
  setup(p, K) {
    G = {};
    for (const g of F.groups) {
      const N = g.n * 5, E = N - g.used;
      const ord = K.shuffle([...Array(N).keys()], g.seed);
      const empty = new Set(ord.slice(0, E));
      const sorted = new Array(N); let u = 0, e = g.used;
      for (let k = 0; k < N; k++) sorted[k] = empty.has(k) ? e++ : u++;
      G[g.key] = { ...g, N, E, empty, sorted, top: TOP[g.key], tm: TIM[g.key] };
    }
    // the 60 buyers: a seeded deal of 20 × each ticket
    const list = [].concat(Array(20).fill('g15'), Array(20).fill('g13'), Array(20).fill('g8'));
    const sh = K.shuffle(list, F.params.season);
    const rank = { g15: 0, g13: 0, g8: 0 };
    DEAL = sh.map((key) => {
      const r = rank[key]++, struck = STRUCK[key].includes(r);
      const h = r - STRUCK[key].filter(x => x < r).length;   // holder index after the couples close ranks
      return { key, r, struck, h };
    });
  },

  render(t, s, K) {
    const { tx, ln, rc, seg, ease, eout, lerp, C, ctx } = K;
    const role = (el, r) => { if (el) el.setAttribute('data-role', r); return el; };
    const MR = (k, l, x, y, str, o) => role(tx(k, l, x, y, str, o), 'must-read');
    const SE = (k, l, x, y, str, o) => role(tx(k, l, x, y, str, o), 'secondary');
    const A = F.commit.at, seal = A + 4.5, sealed = t >= seal;

    /* chrome: eyebrow, title, ledger (rows appear as they are typed), title block */
    const rows = F.ledger.filter(r => r[0] <= t);
    K.chrome(t, K.chapterAt(t), {
      ledger: { title: 'CASE FILE', rows, hl: rows.length - 1 },
      block: { title: 'CASE · SUNK COST', lines: ['ARKES & BLUMER', 'OHIO · 1982–83'], open: 0.4, slotLabel: 'GUESS',
        slot: sealed && K.answered(s) ? 'SEALED' : null },
    });
    K.roll(t, 0, 1.0);

    /* ── S1 · the spend bar (HOOK 0–8, MONDAY 62–72) ── */
    const hookA = 1 - seg(t, 7.6, 8.2), monA = seg(t, 62.4, 63.4);
    if (t < 8.2 || t >= 62.4) {
      const mon = t >= 62.4, a = mon ? monA : hookA;
      const grow = mon ? 1 : ease(seg(t, 0.6, 1.8));
      const drop = mon ? ease(seg(t, 63.4, 64.4)) : 0;
      const x0 = 48, xs = 380, x1 = 640, y = 212 + 50 * drop, h = 36;
      rc('s1.sp', 'marks', x0, y, (xs - x0) * grow, h, { fill: C.ink, op: a * lerp(0.92, 0.25, drop) });
      const la = a * seg(t, mon ? 62.6 : 1.0, mon ? 63.0 : 1.5) * (1 - seg(t, 63.4, 63.8));
      if (la > 0) MR('s1.spl', 'labels', x0, 196, 'SPENT · $4M', { size: 32, weight: 500, op: la });
      const ra = a * seg(t, mon ? 62.6 : 1.6, mon ? 63.2 : 2.2);
      rc('s1.rm', 'marks', xs + 6, 212, x1 - xs - 6, h, { stroke: C.ink, w: 1.4, dash: '6 5', op: ra });
      MR('s1.rml', 'labels', xs + 6, 196, 'TO FINISH · ?', { size: 28, op: ra });
      if (!mon) {
        const ca = a * seg(t, 2.4, 2.9);
        MR('s1.go', 'labels', 48, 316, 'CONTINUE', { fam: 'disp', size: 36, op: ca, ls: '0.06em' });
        MR('s1.st', 'labels', 300, 316, 'STOP', { fam: 'disp', size: 36, op: ca * 0.55, ls: '0.06em' });
        const u = eout(seg(t, 4.0, 5.0));
        if (u > 0) ln('s1.tk', 'marks', 48, 328, 48 + 150 * u, 328, { w: 2.4, op: a });
      } else {
        const ga = seg(t, 63.8, 64.4);
        if (ga > 0) MR('s1.gone', 'labels', 48, 254, 'GONE EITHER WAY', { size: 28, op: ga * 0.8 });
        const qa = seg(t, 64.4, 65.2);
        if (qa > 0) {
          MR('s1.q1', 'labels', 48, 344, 'If the $4M were not already spent,', { size: 28, weight: 500, op: qa });
          MR('s1.q2', 'labels', 48, 380, 'would we fund the rest today?', { size: 28, weight: 500, op: qa });
        }
      }
    }

    /* ── S2 · the season tickets (COMMIT 8–16, CASE 16–23) ── */
    const ticket = (key, x, y, w, h, price, op, extra) => {
      if (op <= 0) return;
      rc(key + '.o', 'marks', x, y, w, h, { fill: C.chalk, fo: 0.6, stroke: C.ink, w: 1.2, op });
      ln(key + '.p', 'marks', x + w - 34, y + 6, x + w - 34, y + h - 6, { dash: '3 3', op: op * 0.7 });
      SE(key + '.s', 'labels', x + 12, y + 22, 'SEASON 1982–83', { size: 14, op, ls: '0.06em' });
      MR(key + '.v', 'labels', x + 12, y + h - 16, price, { fam: 'disp', size: 48, op });
      if (extra) extra(op);
    };
    if (t >= 7.6 && t < 16.4) {
      const a = seg(t, 7.8, 8.4) * (1 - seg(t, 15.8, 16.3));
      ticket('t2a', 60, 140, 220, 104, '$15', a, (op) => SE('t2a.f', 'labels', 150, 222, 'FIVE PLAYS', { size: 14, op }));
      ticket('t2b', 320, 140, 220, 104, '$8', a, (op) => {
        SE('t2b.f', 'labels', 410, 198, '$15', { size: 14, op: op * 0.7 });
        ln('t2b.x', 'labels', 408, 193, 438, 193, { w: 1.4, op });
        SE('t2b.o', 'labels', 410, 222, '$7 OFF', { size: 14, op, weight: 500 });
      });
      const b = seg(t, 11.0, 11.5) * (1 - seg(t, 15.8, 16.3));
      if (b > 0) {
        MR('t2.n', 'labels', 320, 296, '17 PEOPLE', { size: 28, weight: 500, op: b });
        MR('t2.k', 'labels', 320, 332, '85 TICKETS', { size: 28, weight: 500, op: b });
      }
    }
    if (t >= 7 && t < 16.6) K.commitBox(t, s, { title: F.commit.title, prompt: 'UNUSED OF 85 TICKETS', out: 16 });

    /* ── CASE 16–36: three tickets, 60 buyers, the deal, the couples, the grid grows ── */
    if (t >= 16 && t < 23.2) {
      const a = seg(t, 16.0, 16.6) * (1 - seg(t, 22.4, 23.2));
      ticket('t3a', 60, 128, 170, 92, '$15', a);
      ticket('t3b', 250, 128, 170, 92, '$13', a);
      ticket('t3c', 440, 128, 170, 92, '$8', a);
    }
    const labA = seg(t, 22.4, 23.2) * (1 - seg(t, 62.0, 62.6));
    if (t >= 22.4 && t < 62.6) for (const g of F.groups) {
      const gg = G[g.key], dimG = g.key === 'g13' && t >= 33.8 ? lerp(0.4, 1, seg(t, 53.6, 54.0)) : 1;
      const sub = t < 30.4 ? '20 BUYERS' : g.n + ' PEOPLE';
      MR('lb.' + g.key, 'labels', 48, gg.top + 30, g.label, { size: 32, weight: 500, op: labA * dimG });
      SE('lb.n.' + g.key, 'labels', 48, gg.top + 50, sub, { size: 14, op: labA * dimG });
      if (t >= 31.2) SE('lb.k.' + g.key, 'labels', 48, gg.top + 66, gg.N + ' TICKETS', { size: 14, op: labA * dimG * seg(t, 31.2, 31.8) });
    }
    if (t >= 16.2 && t < 34) {
      for (let i = 0; i < 60; i++) {
        const d = DEAL[i], gg = G[d.key];
        const ap = seg(t, 16.2 + i * 0.09, 16.5 + i * 0.09);
        if (ap <= 0) continue;
        const mv = ease(seg(t, 22.2 + i * 0.05, 23.0 + i * 0.05));
        const close = ease(seg(t, 30.4, 31.2));
        const qx = 60 + i * 10, qy = 300;
        const bx = lerp(GX + d.r * P, GX + d.h * P, close), by = gg.top;
        const x = lerp(qx, bx, mv), y = lerp(qy, by, mv), sz = lerp(8, SQ, mv);
        let op = ap;
        if (d.struck) op *= lerp(1, 0.25, seg(t, 28.8, 29.6)) * (1 - seg(t, 30.0, 30.4));
        if (op <= 0) continue;
        ctx.fillStyle = K.rgba('ink', 0.85 * op); ctx.fillRect(x, y, sz, sz);
        if (d.struck && t >= 28.8) {
          const u = seg(t, 28.8, 29.2);
          ctx.strokeStyle = K.rgba('ink', op); ctx.lineWidth = 1.4;
          ctx.beginPath(); ctx.moveTo(x - 3, y + sz + 3); ctx.lineTo(x - 3 + (sz + 6) * u, y + sz + 3 - (sz + 6) * u); ctx.stroke();
        }
      }
      const ca = seg(t, 28.8, 29.4) * (1 - seg(t, 35.4, 36.0));
      if (ca > 0) SE('cs.cp', 'labels', 48, 396, '6 BOUGHT AS COUPLES · SET ASIDE · 54 COUNTED', { size: 14, op: ca, weight: 500 });
    }

    /* ── S3 · the ticket grid: CASE 31.2 → COUNT 36–62. One square = one person's ticket for one play. ── */
    if (t >= 31.2 && t < 62.6) {
      const out = 1 - seg(t, 62.0, 62.6);
      const ha = seg(t, 31.6, 32.4) * out;
      if (ha > 0) SE('gr.h', 'labels', GX, 114, '1 COLUMN = 1 PERSON, 5 PLAYS', { size: 14, op: ha * (1 - seg(t, 56.8, 57.2)) });
      for (const g of F.groups) {
        const gg = G[g.key], tm = gg.tm, n = g.n, N = gg.N;
        const dimG = g.key === 'g13' ? lerp(0.4, 1, seg(t, 53.6, 54.0)) : 1;
        let usedNow = 0;
        const su = (k) => ease(clamp01((t - tm.Ts - tm.sp * k / N) / tm.sl));
        for (let k = 0; k < N; k++) {
          const h = Math.floor(k / 5), p = k % 5;
          const grow = p === 0 ? 1 : seg(t, 31.2 + p * 0.4 + h * 0.02, 31.5 + p * 0.4 + h * 0.02);
          if (grow <= 0) continue;
          const tr = tm.T0 + p * tm.D + (h / n) * 0.6 * tm.D, rv = seg(t, tr, tr + 0.15);
          const isE = gg.empty.has(k);
          if (!isE && t >= tr) usedNow++;
          const u = su(k), j = gg.sorted[k];
          const x = lerp(GX + h * P, GX + Math.floor(j / 5) * P, u), y = lerp(gg.top + p * P, gg.top + (j % 5) * P, u);
          const op = grow * out * dimG;
          // hollow (not yet revealed)
          if (rv < 1) { ctx.strokeStyle = K.rgba('ink', 0.35 * op * (1 - rv)); ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, SQ - 1, SQ - 1); }
          if (rv > 0) {
            if (isE) { ctx.strokeStyle = K.rgba('ink', op * rv); ctx.lineWidth = 1.5; ctx.strokeRect(x + 0.75, y + 0.75, SQ - 1.5, SQ - 1.5); }
            else { ctx.fillStyle = K.rgba('ink', 0.92 * op * rv); ctx.fillRect(x, y, SQ, SQ); }
          }
        }
        // the empties get dotted, in sorted order, after the sort
        const sortedDone = t >= tm.Ts + tm.sp + tm.sl;
        let dotted = 0;
        if (g.key !== 'g13') {
          const t0 = 48.8, t1 = 51.2;
          dotted = Math.min(gg.E, Math.floor(gg.E * seg(t, t0, t1) + 1e-9));
        } else dotted = t >= 57.0 ? gg.E : 0;
        for (let i = 0; i < dotted; i++) {
          const j = g.used + i, x = GX + Math.floor(j / 5) * P, y = gg.top + (j % 5) * P;
          ctx.fillStyle = K.rgba('ink', out); ctx.fillRect(x + SQ / 2 - 1.5, y + SQ / 2 - 1.5, 3, 3);
        }
        // the viewer's guess, red pencil, on the $8 band only, after the seal
        if (g.key === 'g8' && t >= 48.0 && t >= seal) {
          const ga = seg(t, 48.0, 48.6) * out;
          if (K.answered(s)) {
            const gv = Math.max(0, Math.min(N, Math.round(s.answer)));
            ctx.strokeStyle = K.rgba('accent', 0.95 * ga); ctx.lineWidth = 2;
            for (let i = 0; i < gv; i++) {
              const j = N - 1 - i, x = GX + Math.floor(j / 5) * P, y = gg.top + (j % 5) * P;
              ctx.strokeRect(x - 1.5, y - 1.5, SQ + 3, SQ + 3);
            }
            MR('gs.v', 'labels', RX, gg.top + 88, 'YOU SAID ' + gv, { size: 28, weight: 500, fill: C.accent, op: ga });
          } else {
            MR('gs.v', 'labels', RX, gg.top + 88, 'NO GUESS', { size: 28, weight: 500, fill: C.muted, op: ga });
          }
        }
        // right-hand counts: used (ticks), then empty, then per person (counts first, ratio after)
        if (t >= tm.T0) {
          const per = seg(t, 57.2, 58.0);
          const ua = (1 - per) * out;
          if (ua > 0) MR('ct.u.' + g.key, 'labels', RX, gg.top + 26, usedNow + ' USED', { size: 28, weight: 500, op: ua });
          if (per > 0) MR('ct.p.' + g.key, 'labels', RX, gg.top + 26, g.mean + ' = ' + g.used + ' ÷ ' + n, { size: 28, weight: 500, op: per * out });
          if (sortedDone && (g.key === 'g13' || t >= 48.8)) {
            const shown = g.key === 'g13' ? gg.E : dotted;
            MR('ct.e.' + g.key, 'labels', RX, gg.top + 58, shown + ' EMPTY', { size: 28, op: out * (g.key === 'g13' ? seg(t, 56.8, 57.2) : 1) });
          }
        }
      }
      const pa = seg(t, 57.2, 58.0) * out;
      if (pa > 0) SE('ct.ph', 'labels', RX, 114, 'PER PERSON, OF 5 PLAYS', { size: 14, op: pa, weight: 500 });
    }
  },
};
function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
})();
