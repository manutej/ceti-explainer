/* selection · "Who chose it" · selection into treatment, the 75-second case.
   S1 scoreboard (HOOK) · S2 gap bar (COMMIT, COUNT placement, MONDAY) · S3 risk ruler (CASE) · S4 the hundred (COUNT).
   Pure: every frame is render(t, state). Seeds: people mulberry32(7), coin flip mulberry32(90). */
(function () {
'use strict';
const F = window.FILM, P = F.params;
let TYPE, ADOPT, TREAT, POS1, POS2, STAY1, STAY2, ORD1, ORD2;   // precomputed in setup

// layout (design units, inside LAYOUT.content x 48-664, y 104-400)
const CX = 356;                                  // content centre
const PITCH = 19, SQ = 14, TOP = 180;            // the hundred
const GX = CX - (9 * PITCH + SQ) / 2;            // grid origin x
const OB = { on: 150, off: 400 }, RB = { gets: 150, not: 430 };
const BX0 = 88, BU = 18;                         // gap bar: x(g) = 88 + 18 g, 0..30
const RX = (rr) => 88 + 450 * (rr - 0.4);        // risk ruler 0.4..1.6
const AXY = 360;

function slots(ids, stay) {                       // stayers first (ascending id), then leavers
  const s = ids.filter(i => stay[i]), l = ids.filter(i => !stay[i]);
  return { order: s.concat(l), nStay: s.length, n: ids.length };
}
const blockXY = (bx, k) => [bx + PITCH * Math.floor(k / 10), TOP + PITCH * (9 - (k % 10))];
const gridXY = (id) => [GX + PITCH * (id % 10), TOP + PITCH * Math.floor(id / 10)];

window.FILM_RENDER = {
  setup(p, K) {
    const tok = [].concat(Array(P.A1).fill('A1'), Array(P.P1).fill('P1'), Array(P.N1).fill('N1'),
      Array(P.A0).fill('A0'), Array(P.P0).fill('P0'), Array(P.N0).fill('N0'));
    const ppl = K.shuffle(tok, P.seedPeople);
    TYPE = ppl.map(s => s[0]); ADOPT = ppl.map(s => s[1] === '1');
    const tset = new Set(K.shuffle([...Array(P.N).keys()], P.seedSplit).slice(0, P.half));
    TREAT = [...Array(P.N).keys()].map(i => tset.has(i));
    const ids = [...Array(P.N).keys()];
    STAY1 = ids.map(i => ADOPT[i] ? TYPE[i] !== 'N' : TYPE[i] === 'A');
    STAY2 = ids.map(i => TREAT[i] ? TYPE[i] !== 'N' : TYPE[i] === 'A');
    const on = slots(ids.filter(i => ADOPT[i]), STAY1), off = slots(ids.filter(i => !ADOPT[i]), STAY1);
    const gets = slots(ids.filter(i => TREAT[i]), STAY2), not = slots(ids.filter(i => !TREAT[i]), STAY2);
    ORD1 = { on, off }; ORD2 = { gets, not };
    POS1 = []; POS2 = [];
    on.order.forEach((id, k) => (POS1[id] = { xy: blockXY(OB.on, k), k, side: 0 }));
    off.order.forEach((id, k) => (POS1[id] = { xy: blockXY(OB.off, k), k, side: 1 }));
    gets.order.forEach((id, k) => (POS2[id] = { xy: blockXY(RB.gets, k), k, side: 0 }));
    not.order.forEach((id, k) => (POS2[id] = { xy: blockXY(RB.not, k), k, side: 1 }));
  },

  render(t, s, K) {
    const { tx, ln, rc, E, seg, ease, eout, lerp, C } = K;
    const role = (el, r) => { if (el) el.setAttribute('data-role', r); return el; };
    const M = (k, l, x, y, str, o) => role(tx(k, l, x, y, str, Object.assign({ size: 28, weight: 500 }, o)), 'must-read');
    const S = (k, l, x, y, str, o) => role(tx(k, l, x, y, str, Object.assign({ size: 16, ls: '0.06em' }, o)), 'secondary');
    const seal = F.commit.at + 4.5;
    const rows = t < 16.4 ? F.ledger.slice(0, 2) : F.ledger;
    K.chrome(t, null, {
      ledger: { title: 'REVISIONS', rows, hl: null },
      block: { title: 'SELECTION', lines: ['TEACHING SET', 'SEEDS 7 · 90'], open: 0.4, slotLabel: 'GUESS', slot: t >= seal ? 'SEALED' : null },
    });
    K.roll(t, 0, 1.0);

    /* ── S1 · HOOK 0-8 ── */
    if (t < 8) {
      const out = 1 - seg(t, 7.6, 8.0);
      [[200, 'TURNED THE FEATURE ON', '24 of 30', '80 per 100'], [512, 'LEFT IT OFF', '35 of 70', '50 per 100']].forEach(([x, lab, n, f], i) => {
        S('h.l' + i, 'labels', x, 140, lab, { anchor: 'middle', op: seg(t, 0.3, 0.7) * out });
        M('h.n' + i, 'labels', x, 205, K.typed(n, t, 0.6 + 0.4 * i, 24), { anchor: 'middle', size: 48 , op: out });
        S('h.s' + i, 'labels', x, 234, 'STAYED', { anchor: 'middle', op: seg(t, 1.2, 1.6) * out });
        M('h.f' + i, 'labels', x, 285, f, { anchor: 'middle', op: seg(t, 2.4, 2.8) * out });
      });
      ln('h.rule', 'marks', 356, 130, 356, 300, { op: 0.35 * seg(t, 0.3, 0.7) * out });
      role(tx('h.q', 'labels', CX, 350, '“The data clearly shows the feature drives retention.”',
        { fam: 'sans', size: 20, anchor: 'middle', op: seg(t, 4.4, 4.9) * out }), 'secondary');
    }

    /* ── S2 · the gap bar ── */
    const bar = (y, op, grow, o = {}) => {
      if (op <= 0) return;
      const w = 30 * BU * grow;
      rc('b.o', 'marks', BX0, y, w, 24, { stroke: C.ink, w: 1.4, op });
      [0, 10, 20, 30].forEach((g, i) => {
        const x = BX0 + BU * g, a = op * seg(grow, g / 30 - 0.05, g / 30 + 1e-6);
        ln('b.k' + i, 'marks', x, y + 24, x, y + 32, { op: a, w: 1 });
        role(tx('b.t' + i, 'labels', x, y + 50, String(g), { size: 16, anchor: 'middle', op: a }), 'secondary');
      });
      if (o.ends) {
        S('b.e0', 'labels', BX0, y + 74, 'NONE OF IT', { size: 14, op: op * o.ends });
        S('b.e1', 'labels', BX0 + 30 * BU, y + 74, 'ALL OF IT', { size: 14, anchor: 'end', op: op * o.ends });
      }
      if (o.split) {   // the truth: 10 points the feature, 20 who chose it
        const a = op * o.split, xs = BX0 + 10 * BU;
        rc('b.f', 'marks', BX0, y, 10 * BU, 24, { fill: C.ink, op: a * 0.9 });
        rc('b.h', 'marks', xs, y, 20 * BU, 24, { fill: C.soft, op: a * 0.55 });
        M('b.l0', 'labels', BX0, y - 14, 'THE FEATURE 10', { op: a });
        M('b.l1', 'labels', BX0 + 30 * BU, y - 14, 'WHO CHOSE IT 20', { anchor: 'end', op: a });
        ln('b.tr', 'marks', xs, y - 6, xs, y + 30, { w: 1 + 2 * (o.truth || 0), op: a });
      }
      if (o.guess != null && o.guess > 0) {
        const a = op * o.guess;
        if (K.answered(s)) {
          const g = Math.max(0, Math.min(30, s.answer)), x = BX0 + BU * g;
          ln('b.g', 'marks', x, y - 10, x, y + 36, { stroke: C.accent, w: 3, op: a });
          M('b.gl', 'labels', x, y + 90, 'YOUR GUESS ' + g, { fill: C.accent, anchor: g > 18 ? 'end' : g < 8 ? 'start' : 'middle', op: a });
        } else M('b.gl', 'labels', BX0, y + 90, 'NO ANSWER', { fill: C.accent, op: a });
      }
    };

    /* ── COMMIT 8-16 ── */
    if (t >= 8 && t < 16) {
      const out = 1 - seg(t, 15.6, 16.0);
      const grow = ease(seg(t, 8.0, 8.8));
      bar(250, out, grow, { ends: seg(t, 8.8, 9.2) });
      S('c.br', 'labels', BX0, 236, 'THE GAP · 30 MORE STAY PER 100', { op: seg(t, 8.2, 8.6) * out });
      M('c.q', 'labels', CX, 170, 'How many of the 30 is the feature?', { anchor: 'middle', op: seg(t, 10.0, 10.4) * out });
    }
    if (t >= 9 && t < 16.5) K.commitBox(t, s, { title: F.commit.title, prompt: 'OF THE 30 POINTS', out: 15.9 });

    /* ── S3 · CASE 16-36 ── */
    if (t >= 16 && t < 36) {
      const out = 1 - seg(t, 35.6, 36.0), g = ease(seg(t, 16.0, 16.8));
      const x0 = lerp(RX(1.0), RX(0.4), g), x1 = lerp(RX(1.0), RX(1.6), g);
      ln('r.ax', 'marks', x0, AXY, x1, AXY, { w: 1.4, op: out });
      ln('r.one', 'marks', RX(1.0), AXY - 10, RX(1.0), AXY + 10, { w: 1.2, op: out * g });
      S('r.e0', 'labels', RX(0.4), 396, 'FEWER HEART EVENTS', { size: 14, op: out * g });
      S('r.e1', 'labels', RX(1.0), 396, 'SAME RATE', { size: 14, anchor: 'middle', op: out * g });
      S('r.e2', 'labels', RX(1.6), 396, 'MORE HEART EVENTS', { size: 14, anchor: 'end', op: out * g });
      // 1991 · 16 cohort studies, 15 inked
      S('r.y1', 'labels', 48, 122, '1991 · POOLED REVIEW · STAMPFER & COLDITZ', { size: 14, op: seg(t, 16.3, 16.7) * out });
      let k15 = 0;
      for (let i = 0; i < 16; i++) {
        const a = seg(t, 16.6 + 0.1 * i, 16.8 + 0.1 * i) * out; if (a <= 0) continue;
        const ink = i < 15 && t >= 18.2 + 0.08 * i; if (ink) k15++;
        rc('r.m' + i, 'marks', 48 + 22 * i, 134, 16, 16, { stroke: C.ink, w: 1.4, fill: ink ? C.ink : 'none', op: a });
      }
      if (t >= 16.6) M('r.c1', 'labels', 410, 152, k15 + ' of 16', { op: out });
      // point 1: RR 0.56
      const d1 = eout(seg(t, 20.0, 20.4));
      if (d1 > 0) {
        E('r.p1', 'circle', 'marks', { cx: RX(0.56).toFixed(2), cy: lerp(330, AXY, d1).toFixed(2), r: 8, fill: C.ink, opacity: (d1 * out).toFixed(3) });
        M('r.l1', 'labels', RX(0.56), 330, '56 per 100', { anchor: 'middle', op: seg(t, 20.2, 20.6) * out });
        S('r.s1', 'labels', RX(0.56) + 14, AXY - 8, 'RR 0.56', { size: 14, op: seg(t, 20.2, 20.6) * out });
      }
      // 2002 · WHI, two dot blocks on canvas
      if (t >= 25.8) {
        S('r.y2', 'labels', 48, 186, '2002 · WHI TRIAL · 16,608 WOMEN BY LOT', { size: 14, op: seg(t, 25.8, 26.2) * out });
        const ctx = K.ctx, shown = Math.floor(164 * seg(t, 26.0, 29.0));
        ctx.fillStyle = K.rgba('ink', 0.85 * out);
        [[48, 164], [360, 122]].forEach(([bx, n]) => {
          for (let k = 0; k < Math.min(n, shown); k++) {
            ctx.beginPath(); ctx.arc(bx + 7 * Math.floor(k / 10) + 2.4, 198 + 7 * (k % 10), 2.4, 0, 2 * Math.PI); ctx.fill();
          }
        });
        const kH = Math.min(164, shown), kP = Math.min(122, shown);
        M('r.cH', 'labels', 178, 236, String(kH), { op: out });
        S('r.cHo', 'labels', 238, 236, 'of 8,506', { op: out });
        M('r.cP', 'labels', 462, 236, String(kP), { op: out });
        S('r.cPo', 'labels', 522, 236, 'of 8,102', { op: out });
        S('r.bH', 'labels', 48, 280, 'HORMONES', { size: 14, op: seg(t, 26.0, 26.4) * out });
        S('r.bP', 'labels', 360, 280, 'PLACEBO', { size: 14, op: seg(t, 26.0, 26.4) * out });
      }
      // point 2: HR 1.29
      const d2 = eout(seg(t, 30.0, 30.4));
      if (d2 > 0) {
        E('r.p2', 'circle', 'marks', { cx: RX(1.29).toFixed(2), cy: lerp(330, AXY, d2).toFixed(2), r: 8, fill: C.accent, opacity: (d2 * out).toFixed(3) });
        M('r.l2', 'labels', RX(1.29), 330, '129 per 100', { anchor: 'middle', op: seg(t, 30.2, 30.6) * out });
        S('r.s2', 'labels', RX(1.29) + 14, AXY - 8, 'HR 1.29', { size: 14, op: seg(t, 30.2, 30.6) * out });
      }
      S('r.law', 'labels', 48, 304, 'Who chose hormones: better off since childhood · Lawlor et al. 2004', { size: 14, fam: 'sans', ls: '0', op: seg(t, 33.0, 33.5) * out });
    }

    /* ── S4 · COUNT 36-58 ── */
    if (t >= 36 && t < 58) {
      const out = 1 - seg(t, 57.4, 58.0), ctx = K.ctx;
      let fill1 = [0, 0], fill2 = [0, 0];
      for (let id = 0; id < P.N; id++) {
        const row = Math.floor(id / 10);
        const a = seg(t, 36 + 0.1 * row, 36.15 + 0.1 * row) * out; if (a <= 0) continue;
        const G = gridXY(id), p1 = POS1[id], p2 = POS2[id];
        let xy = G;
        if (t >= 37.5) { const u = ease(seg(t, 37.5 + 0.006 * id, 38.7 + 0.006 * id)); xy = [lerp(G[0], p1.xy[0], u), lerp(G[1], p1.xy[1], u)]; }
        if (t >= 47.5) { const u = ease(seg(t, 47.5 + 0.006 * id, 48.7 + 0.006 * id)); xy = [lerp(p1.xy[0], G[0], u), lerp(p1.xy[1], G[1], u)]; }
        if (t >= 50.0) { const u = ease(seg(t, 50.0 + 0.006 * id, 51.2 + 0.006 * id)); xy = [lerp(G[0], p2.xy[0], u), lerp(G[1], p2.xy[1], u)]; }
        // fills: as chosen (39.5 / 42.0), drained 47.0-47.5; coin flip (51.8 / 53.8)
        let f = 0;
        if (t < 47.5 && STAY1[id]) {
          const t0 = p1.side === 0 ? 39.5 + 0.08 * p1.k : 42.0 + 0.06 * p1.k;
          if (t >= t0) { f = 1 - seg(t, 47.0, 47.5); if (t < 47.0) fill1[p1.side]++; }
        }
        if (t >= 50 && STAY2[id]) {
          const t0 = p2.side === 0 ? 51.8 + 0.06 * p2.k : 53.8 + 0.06 * p2.k;
          if (t >= t0) { f = 1; fill2[p2.side]++; }
        }
        ctx.strokeStyle = K.rgba('ink', 0.9 * a); ctx.lineWidth = 1.4;
        ctx.strokeRect(xy[0] + 0.7, xy[1] + 0.7, SQ - 1.4, SQ - 1.4);
        if (f > 0) { ctx.fillStyle = K.rgba('ink', 0.92 * a * f); ctx.fillRect(xy[0], xy[1], SQ, SQ); }
      }
      // 100 customers
      if (t < 37.9) M('k.n', 'labels', CX, 160, '100 customers', { anchor: 'middle', op: seg(t, 36.0, 36.4) * (1 - seg(t, 37.5, 37.9)) });
      // as chosen
      if (t >= 39.0 && t < 47.5) {
        const a = seg(t, 39.0, 39.4) * (1 - seg(t, 47.0, 47.5)), pc = t >= 45.0;
        const cOn = OB.on + (3 * PITCH - 5) / 2, cOff = OB.off + (7 * PITCH - 5) / 2;
        S('k.l0', 'labels', cOn, 128, 'TURNED IT ON · 30', { anchor: 'middle', op: a });
        S('k.l1', 'labels', cOff, 128, 'LEFT IT OFF · 70', { anchor: 'middle', op: a });
        if (t >= 39.5) M('k.c0', 'labels', cOn, 164, fill1[0] + ' of 30' + (pc ? ' · 80 %' : ''), { anchor: 'middle', op: a });
        if (t >= 42.0) M('k.c1', 'labels', cOff, 164, fill1[1] + ' of 70' + (pc ? ' · 50 %' : ''), { anchor: 'middle', op: a });
        if (pc) M('k.g1', 'labels', (OB.on + 3 * PITCH + OB.off) / 2, 290, '30 points', { anchor: 'middle', op: seg(t, 45.0, 45.4) * a });
      }
      if (t >= 49.3 && t < 51.4) M('k.s', 'labels', CX, 160, 'Same 100 · coin flip', { anchor: 'middle', op: seg(t, 49.3, 49.7) * (1 - seg(t, 51.0, 51.4)) });
      // coin flip
      if (t >= 51.0) {
        const a = seg(t, 51.0, 51.4) * out, pc = t >= 55.6;
        const cG = RB.gets + (5 * PITCH - 5) / 2, cN = RB.not + (5 * PITCH - 5) / 2;
        S('k.r0', 'labels', cG, 128, 'GETS IT · 50', { anchor: 'middle', op: a });
        S('k.r1', 'labels', cN, 128, 'DOES NOT · 50', { anchor: 'middle', op: a });
        if (t >= 51.8) M('k.d0', 'labels', cG, 164, fill2[0] + ' of 50' + (pc ? ' · 66 %' : ''), { anchor: 'middle', op: a });
        if (t >= 53.8) M('k.d1', 'labels', cN, 164, fill2[1] + ' of 50' + (pc ? ' · 56 %' : ''), { anchor: 'middle', op: a });
        if (pc) M('k.g2', 'labels', (RB.gets + 5 * PITCH + RB.not) / 2, 290, '10 points', { anchor: 'middle', op: seg(t, 55.6, 56.0) * a });
      }
    }

    /* ── COUNT placement 58-62, MONDAY 62-72 ── */
    if (t >= 58) {
      const mv = ease(seg(t, 62.0, 62.6));
      const y = lerp(230, 300, mv), op = lerp(1, 0.4, mv);
      bar(y, op, ease(seg(t, 58.0, 58.6)), { split: seg(t, 58.6, 59.0), guess: seg(t, 59.2, 59.6), truth: seg(t, 60.0, 60.6) });
    }
    if (t >= 62) {
      const a = seg(t, 62.3, 62.8);
      M('m.q0', 'labels', CX, 150, 'Who turned it on, and would', { anchor: 'middle', op: a });
      M('m.q1', 'labels', CX, 188, 'they have stayed anyway?', { anchor: 'middle', op: a });
      S('m.s', 'labels', CX, 234, 'Before you credit a feature, hold it back from a random half.', { size: 16, fam: 'sans', ls: '0', anchor: 'middle', op: seg(t, 64.0, 64.5) });
    }
  },
};
})();
