/* cost-of-delay · "The Cost of Waiting": three features on six month columns; one mark = £50k not yet earned.
   One clock: every frame is render(t, state). Marks are canvas mass, type and lines are pooled SVG. */
(function () {
'use strict';
const F = window.FILM, T = F.T, P = F.params;
const FE = {}; F.features.forEach(f => (FE[f.id] = f));
const GX = 160, CW = 72, ROWY = { A: 124, B: 154, C: 184 }, BH = 22;   // board
const MK = { w: 44, h: 8, step: 11, base: 330 };                         // mark area (k-th mark top = base − step·k)
const TL = { x: 160, pitch: 12, w: 9, y: 348, h: 18, n: 36 };            // tally row: one slot per £50k
const CS = { x: 56, pitch: 13, w: 10, y: 196, h: 30 };                   // Maersk strip: one cell per week
let ORD = null;   // per order: {starts: {A: month0,...}, ship: {A: month}, marks: [{m, k, f, at, slot}], end}

function plan(o) {
  const starts = {}, ship = {}; let t = 0;
  o.seq.forEach(id => { starts[id] = t; t += FE[id].dur; ship[id] = t; });
  const marks = []; let slot = 0;
  for (let m = 1; m <= 6; m++) {
    let k = 0;
    for (const f of F.features) if (ship[f.id] >= m) for (let j = 0; j < f.cod / P.unit; j++) {
      marks.push({ m, k, f: f.id, at: o.t0 + o.step * (m - 1) + o.stag * k, slot: slot++ }); k++;
    }
  }
  const total = o.seq.reduce((s, id) => s + FE[id].cod * ship[id], 0);
  return Object.assign({}, o, { starts, ship, marks, total, end: marks[marks.length - 1].at + 0.12 });
}

window.FILM_RENDER = {
  setup() { ORD = F.orders.map(plan); },

  render(t, s, K) {
    const { tx, ln, rc, path, stamp, seg, ease, eout, lerp, typed, fmtK, C } = K;
    const ctx = K.ctx;
    const role = (el, r) => { if (el) el.setAttribute('data-role', r); return el; };
    const A = F.commit.at, SEAL = A + 4.5;
    const ans = s.answer, answered = K.answered(s);

    // ── chrome: eyebrow, title, ledger (rows appear at their time), title block with the viewer's slot
    const rows = F.ledger.filter(r => t >= r[0]);
    const last = rows.length - 1;
    let slot = null;
    if (t >= SEAL) slot = ans === 'none' ? 'NO ANSWER' : (ans == null ? null : (t >= T.unseal && answered ? '£' + fmtK(ans) + 'k' : 'SEALED'));
    K.chrome(t, null, {
      ledger: { title: 'REVISIONS', rows, hl: last >= 0 && t < rows[last][0] + 3 ? last : null },
      block: { title: 'COST OF DELAY', lines: ['ONE TEAM, ONE ITEM', 'FOR DECISION'], open: 0.4, slotLabel: 'YOURS', slot },
    });
    K.roll(t, 0, 1.0);

    // ── which order is on the board, and the board's opacity
    const oi = t < ORD[1].reset ? 0 : t < ORD[2].reset ? 1 : 2;
    const O = ORD[oi], prev = ORD[Math.max(0, oi - 1)];
    const slide = oi === 0 ? 1 : ease(seg(t, O.reset, O.reset + 0.6));
    let bop = 1;
    if (t >= T.dimBoard && t < T.caseIn) bop = lerp(1, 0.45, seg(t, T.dimBoard, T.dimBoard + 0.4));
    else if (t >= T.caseIn && t < T.countIn) bop = 0.45 * (1 - seg(t, T.caseIn, T.caseIn + 0.4));
    else if (t >= T.countIn) bop = lerp(0.45, 1, seg(t, T.countIn, T.countIn + 0.4)) * lerp(1, 0.35, seg(t, T.monday, T.monday + 0.4));
    const inCount = t >= T.countIn;

    if (bop > 0.01) {
      // month heads
      for (let m = 1; m <= 6; m++) {
        const a = bop * seg(t, T.heads + 0.08 * m, T.heads + 0.08 * m + 0.3);
        role(tx('bd.h' + m, 'labels', GX + CW * (m - 0.5), 116, String(m), { size: 14, anchor: 'middle', op: a, weight: 500 }), 'secondary');
        ln('bd.r' + m, 'field', GX + CW * m, 106, GX + CW * m, inCount ? 340 : 208, { op: 0.22 * a, w: 0.75 });
      }
      ln('bd.r0', 'field', GX, 106, GX, inCount ? 340 : 208, { op: 0.22 * bop * seg(t, T.heads, T.heads + 0.3), w: 0.75 });
      // rows: letter, value a month, months of work; bars
      F.features.forEach((f, i) => {
        const y = ROWY[f.id], a = bop * seg(t, T.rows[i], T.rows[i] + 0.4);
        role(tx('bd.l' + f.id, 'labels', 48, y + 21, f.id, { fam: 'disp', size: 28, op: a }), 'must-read');
        role(tx('bd.v' + f.id, 'labels', 76, y + 9, '£' + f.cod + 'k/mo', { size: 14, op: a, weight: 500 }), 'secondary');
        role(tx('bd.d' + f.id, 'labels', 76, y + 23, f.dur + ' mo', { size: 14, op: a }), 'secondary');
        const s0 = lerp(prev.starts[f.id], O.starts[f.id], slide);
        let w = CW * f.dur;
        if (t < T.dimBoard) { const b0 = T.bars[O.seq.indexOf(f.id)]; w *= ease(seg(t, b0, b0 + 0.5)); }
        const x = GX + CW * s0;
        if (w > 0.5) rc('bd.b' + f.id, 'marks', x, y, w, BH, { fill: C.ink, fo: f.tone, stroke: C.ink, w: 1, op: bop });
        // ship tick: hollow until the playhead passes the ship point
        const shipAt = inCount ? O.t0 + O.step * O.ship[f.id] : Infinity;
        const tickOp = bop * seg(t, T.ticks, T.ticks + 0.3) * (t >= shipAt && slide >= 1 ? 1 : 0.35);
        if (tickOp > 0) rc('bd.k' + f.id, 'marks', x + CW * f.dur - 1, y - 3, 2.5, BH + 6, { fill: C.accent, op: tickOp });
        // value ÷ months, inside the bar, only after every count is drawn
        if (t >= T.cd3) {
          const v = Math.round(f.cod / f.dur), ca = seg(t, T.cd3 + 0.4 * ['B', 'A', 'C'].indexOf(f.id), T.cd3 + 0.4 * ['B', 'A', 'C'].indexOf(f.id) + 0.3);
          role(tx('bd.c' + f.id, 'top', x + CW * f.dur / 2, y + 16, String(v), { size: 16, weight: 500, anchor: 'middle', op: ca, fill: f.tone > 0.5 ? C.chalk : C.ink }), 'secondary');
        }
      });
      if (t < T.dimBoard) role(tx('bd.pl', 'labels', GX, 228, 'PLAN · BIGGEST FIRST', { size: 14, ls: '0.12em', weight: 500, op: seg(t, T.plan, T.plan + 0.4) }), 'secondary');
    }

    // ── COMMIT: the kit's box (its own stamp suppressed) + a full-size SEALED stamp
    if (t >= A - 1.2 && t < T.boxOut + 0.6) {
      K.commitBox(t, s, { title: F.commit.title, prompt: F.commit.unit, seal: Infinity, out: T.boxOut });
      if (t >= SEAL) {
        const k = seg(t, SEAL, SEAL + 0.22), op = 1 - seg(t, T.boxOut, T.boxOut + 0.5);
        stamp('cm.st', 'marks', 815, 256, lerp(1.4, 1.0, eout(k)), ans === 'none' ? 'NO ANSWER' : 'SEALED', { op: k * op, h: 50, fs: 28 });
      }
    }

    // ── CASE: Maersk Line, one feature, 46 week cells, 38 waiting, one $200k mark per waiting week
    const cop = seg(t, T.caseIn, T.caseIn + 0.4) * (1 - seg(t, T.countIn - 0.2, T.countIn + 0.2));
    if (cop > 0 && t < T.countIn + 0.2) {
      role(tx('cs.src', 'chrome', 664, 82, 'ARNOLD & YÜCE · AGILE 2013', { size: 12, anchor: 'end', ls: '0.1em', op: 0.8 * cop }), 'chrome');
      role(tx('cs.h', 'labels', CS.x, 160, typed('82 hours of work.', t, T.hours, 30), { size: 32, weight: 500, op: cop }), 'must-read');
      const nOn = Math.min(P.mWeeks, Math.floor((t - T.cells) / 0.04) + 1);
      const nQ = Math.min(P.mWait, Math.max(0, Math.floor((t - T.wait) / 0.04) + 1));
      const nChip = Math.min(P.mWait, Math.max(0, Math.floor((t - T.chips) / 0.1) + 1));
      ctx.globalAlpha = cop;
      for (let i = 0; i < nOn; i++) {
        const x = CS.x + CS.pitch * i;
        if (i < nQ) { ctx.fillStyle = K.rgba('soft', 0.55); ctx.fillRect(x, CS.y, CS.w, CS.h); }
        if (i < nChip) { ctx.fillStyle = K.rgba('ink', 0.9); ctx.fillRect(x + 1, CS.y + 1, CS.w - 2, CS.h - 2); }
        ctx.strokeStyle = K.rgba('ink', 0.8); ctx.lineWidth = 0.8; ctx.strokeRect(x + 0.4, CS.y + 0.4, CS.w - 0.8, CS.h - 0.8);
      }
      ctx.globalAlpha = 1;
      const e46 = CS.x + CS.pitch * (P.mWeeks - 1) + CS.w, e38 = CS.x + CS.pitch * (P.mWait - 1) + CS.w;
      const ra = cop * seg(t, T.cells + 1.8, T.cells + 2.2);
      if (ra > 0) role(tx('cs.r', 'labels', e46, 256, P.mWeeks + ' WEEKS', { size: 14, anchor: 'end', weight: 500, op: ra }), 'secondary');
      const qa = cop * seg(t, T.wait + 1.4, T.wait + 1.8);
      if (qa > 0) {
        path('cs.br', 'marks', `M ${CS.x} 234 L ${CS.x} 240 L ${e38} 240 L ${e38} 234`, { stroke: C.ink, w: 1, op: qa });
        role(tx('cs.q', 'labels', (CS.x + e38) / 2, 258, P.mWait + ' WEEKS WAITING IN QUEUES', { size: 14, anchor: 'middle', weight: 500, op: qa }), 'secondary');
      }
      const la = cop * seg(t, T.legend, T.legend + 0.4);
      if (la > 0) {
        rc('cs.lg', 'marks', CS.x, 276, CS.w, 20, { fill: C.ink, fo: 0.9, op: la });
        role(tx('cs.lt', 'labels', CS.x + 18, 291, '= over $200,000 not earned, that week', { size: 14, op: la }), 'secondary');
      }
      if (t >= T.chips - 0.3) role(tx('cs.n', 'labels', 654, 160, String(nChip), { fam: 'disp', size: 40, anchor: 'end', op: cop }), 'must-read');
      role(tx('cs.p', 'labels', CS.x, 346, typed('38 × $200k = $7.6M', t, T.product, 30), { size: 32, weight: 500, op: cop }), 'must-read');
      role(tx('cs.e', 'labels', CS.x, 378, typed("Maersk's own estimate: nearly $8M", t, T.estimate, 40), { size: 16, op: cop }), 'secondary');
    }

    // ── COUNT: legend, marks per month column (canvas), tally row, counter, the viewer's pin
    if (inCount) {
      const mop = lerp(1, 0.35, seg(t, T.monday, T.monday + 0.4));   // mark area dims on Monday; tally stays
      const la = bop * seg(t, T.countLegend, T.countLegend + 0.4);
      if (t < T.cd3) rc('ct.lg', 'marks', GX, 221, 26, 7, { fill: C.ink, fo: FE.A.tone, op: la });
      const legend = t < T.cd3 ? '= £50k not yet earned, that month' : 'in each bar: £k a month ÷ months of work';
      role(tx('ct.lt', 'labels', t < T.cd3 ? GX + 34 : GX, 229, legend, { size: 14, op: la }), 'secondary');
      // tally slots
      for (let i = 0; i < TL.n; i++) {
        const a = seg(t, T.slots + 0.02 * i, T.slots + 0.02 * i + 0.2);
        if (a > 0) { ctx.strokeStyle = K.rgba('ink', 0.35 * a); ctx.lineWidth = 0.6; ctx.strokeRect(TL.x + TL.pitch * i + 0.3, TL.y + 0.3, TL.w - 0.6, TL.h - 0.6); }
      }
      // marks of the current order; the previous order's fade during the reset
      const drawMarks = (Q, fade) => {
        let n = 0;
        for (const mk of Q.marks) {
          if (t < mk.at) continue;
          n++;
          const a = seg(t, mk.at, mk.at + 0.12) * fade, sc = lerp(0.6, 1, a), f = FE[mk.f];
          const cx = GX + CW * (mk.m - 0.5), cy = MK.base - MK.step * mk.k + MK.h / 2;
          const w = MK.w * sc, h = MK.h * sc;
          ctx.fillStyle = K.rgba('ink', f.tone * a * mop); ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
          ctx.strokeStyle = K.rgba('ink', 0.8 * a * mop); ctx.lineWidth = 0.7; ctx.strokeRect(cx - w / 2, cy - h / 2, w, h);
          const sx = TL.x + TL.pitch * mk.slot;
          ctx.fillStyle = K.rgba('ink', f.tone * a); ctx.fillRect(sx, TL.y, TL.w, TL.h);
          ctx.strokeStyle = K.rgba('ink', 0.8 * a); ctx.strokeRect(sx, TL.y, TL.w, TL.h);
        }
        return n;
      };
      if (oi > 0 && t < O.reset + 0.3) drawMarks(prev, 1 - seg(t, O.reset, O.reset + 0.3));
      const n = drawMarks(O, 1);
      // ghost tick where the first count ended
      if (t >= ORD[1].reset) ln('ct.gh', 'marks', TL.x + TL.pitch * 29 - 1.5, TL.y - 4, TL.x + TL.pitch * 29 - 1.5, TL.y + TL.h + 4, { op: 0.5, w: 1 });
      // playhead while filling
      if (t >= O.t0 - 0.6 && t < O.end + 0.3 && slide >= 1) {
        const px = GX + CW * Math.min(6, Math.max(0, (t - O.t0) / O.step));
        ln('ct.ph', 'marks', px, 106, px, 340, { op: 0.6, w: 0.9, stroke: C.accent });
      }
      // counter and money
      const done = t >= O.end;
      role(tx('ct.n', 'labels', 604, 368, String(n), { fam: 'disp', size: 32, op: seg(t, T.slots, T.slots + 0.4) }), 'must-read');
      const mAt = [T.money1, T.money2, T.money3][oi];
      if (done && t >= mAt) role(tx('ct.m', 'labels', 664, 394, typed('£' + fmtK(O.total) + 'k', t, mAt, 30), { size: 16, anchor: 'end', weight: 500 }), 'secondary');
      // the viewer's number on the tally (after the unseal)
      if (t >= T.unseal) {
        if (answered) {
          const truth = ORD[0].total, slots = ans / P.unit;
          const px = Math.min(TL.x + TL.pitch * TL.n, TL.x + TL.pitch * slots) - 1.5;
          const pa = seg(t, T.unseal, T.unseal + 0.4), drop = lerp(-14, 0, eout(pa));
          ln('ct.pin', 'top', px, TL.y - 6 + drop, px, TL.y + TL.h + 6 + drop, { stroke: C.accent, w: 2.5, op: pa });
          const gapOn = t < ORD[1].reset;
          const youRight = ans > truth && gapOn;
          role(tx('ct.you', 'top', youRight ? px + 6 : px - 6, 392, 'YOU £' + fmtK(ans) + 'k', { size: 14, anchor: youRight ? 'start' : 'end', fill: C.accent, weight: 500, op: pa }), 'secondary');
          if (gapOn && t >= T.gap) {
            const ga = seg(t, T.gap, T.gap + 0.5), x29 = TL.x + TL.pitch * 29 - 1.5;
            const lo = Math.min(px, x29), hi = Math.max(px, x29);
            if (hi - lo > 1) path('ct.gb', 'top', `M ${lo.toFixed(1)} 369 L ${lo.toFixed(1)} 375 L ${hi.toFixed(1)} 375 L ${hi.toFixed(1)} 369`, { stroke: C.accent, w: 1.2, op: ga });
            const gap = truth - ans;
            const lab = gap === 0 ? 'exactly what you said' : '£' + fmtK(Math.abs(gap)) + 'k ' + (gap > 0 ? 'more' : 'less') + ' than you said';
            role(tx('ct.gl', 'top', youRight ? px - 6 : px + 6, 392, lab, { size: 16, anchor: youRight ? 'end' : 'start', fill: C.accent, weight: 500, op: seg(t, T.gap + 0.4, T.gap + 0.8) }), 'secondary');
          }
        } else if (t < ORD[1].reset) {
          role(tx('ct.none', 'top', TL.x, 392, 'no number sealed', { size: 14, fill: C.accent, op: seg(t, T.unseal, T.unseal + 0.4) }), 'secondary');
        }
      }
      // the five marks the reorder saves
      if (oi === 2 && t >= T.saved) {
        const sa = seg(t, T.saved, T.saved + 0.5), x0 = TL.x + TL.pitch * 24, x1 = TL.x + TL.pitch * 28 + TL.w;
        for (let i = 24; i < 29; i++) rc('ct.sv' + i, 'marks', TL.x + TL.pitch * i, TL.y, TL.w, TL.h, { stroke: C.accent, w: 1.4, dash: '2 2', op: sa });
        path('ct.sb', 'top', `M ${x0} 369 L ${x0} 375 L ${x1} 375 L ${x1} 369`, { stroke: C.accent, w: 1.2, op: sa });
        role(tx('ct.sl', 'top', (x0 + x1) / 2 + 20, 392, '5 marks · £250k', { size: 16, anchor: 'middle', fill: C.accent, weight: 500, op: seg(t, T.saved + 0.3, T.saved + 0.7) }), 'secondary');
      }
    }
  },

  tryit(v, s, K) {
    const fs = ['A', 'B', 'C'].map(id => ({ id, c: +v['cod' + id], d: Math.max(1, +v['dur' + id]) }));
    const perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
    const res = perms.map(p => { let tm = 0, tot = 0; p.forEach(i => { tm += fs[i].d; tot += fs[i].c * tm; }); return { o: p.map(i => fs[i].id).join(' '), tot }; });
    const best = Math.min(...res.map(r => r.tot));
    const rule = fs.slice().sort((a, b) => b.c / b.d - a.c / a.d).map(f => f.id).join(' ');
    const rows = res.map(r => `<div${r.tot === best ? ' style="font-weight:600"' : ''}>${r.o} · £${r.tot.toLocaleString('en-US')}k${r.tot === best ? ' · cheapest bill' : ''}</div>`).join('');
    return `<div class="ex">TOTAL COST OF WAITING, BY ORDER</div>${rows}<div class="ex">VALUE ÷ MONTHS, HIGHEST FIRST: ${rule}</div>` +
      (typeof s.answer === 'number' ? `<p>You sealed £${s.answer.toLocaleString('en-US')}k for biggest first.</p>` : '');
  },
};
})();
