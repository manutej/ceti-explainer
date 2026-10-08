/* ════════════════════════════════════════════════════════════════════
   modules/commit-predict-reveal (CPR) — combinator M⟨payoff⟩ → M
   --------------------------------------------------------------------
   MODULE-OPERAD §1 (PED #2: Crouch et al. 2004; Brod 2021). The wrapper splices
   two freezes into the inner's clock, both on inner phase boundaries:
     … inner … │ ask · commit │ … inner up to its reveal … │ gap (· hold) │ … inner …
   ask     the dashed card draws, the question rises (the card is the picture, the words follow)
   commit  a countdown ring un-draws (4…1). FILM: "pause and guess", then the card fills with the
           cited common answer. PAGE: core/gates.js pauses the clock and asks for a guess (8 s timeout).
           The guess then rides from the card to the answer axis.
   reveal  the inner plays to its payoff (untouched)
   gap     the counted answer lands on the same axis; a bracket shows the distance
           (error role outside the tolerance, remedy role inside); "most of us land here"
   The inner tells the wrapper where to splice through an optional interface:
     inner.reveal(P)     → { commitBefore, revealAfter, value }  (phase ids, the answer in axis units)
     inner.answerAxis(P) → { x0, y0, x1, y1, min, max }           (draw the guess on the inner's own axis)
   Without them: commit before the first payoff phase, reveal after it, value = W.read(numbers, P.read),
   and the wrapper draws its own axis (P.axis). If the inner's next phase is a declared hold the
   wrapper adds none (one hold per module, L9); otherwise it adds a 2 s hold.
   Colour variables: guess (the viewer's judgement) · answer (the counted value) · gapMark · closeMark.
   Aspects: composes wherever its inner does. Portrait: the card at the top of the inner's right column (the
   inner's answerAxis(P, lay, po) says where); the guess and the count label on two rows under the axis.
   ──────────────────────────────────────────────────────────────────── */
(function () {
  const W = (typeof Wrap !== 'undefined' ? Wrap : globalThis.Wrap);
  const ASK = 1.2, GAP = 2.5, HOLD = 2;
  const fmtV = (v, P) => { const d = P.decimals || 0, r = Math.round(v * Math.pow(10, d)) / Math.pow(10, d); return (Math.abs(r) >= 1000 ? Math.round(r).toLocaleString('en-US') : r.toFixed(d)) + P.unit; };
  const ALL_PO = ['track', 'grid', 'stack', 'axis', 'vessel', 'frontier', 'timeline', 'population', 'chain', 'cutaway', 'form', 'field'];

  Module.define('commit-predict-reveal', {
    kind: 'combinator', arity: 1, slots: ['inner'],
    types: ['T1', 'T4', 'T5', 'T7', 'T8'],
    evidence: 'PED #2 commit-a-prediction (Crouch et al. 2004; Kestin & Miller 2022; Brod 2021); NAR device 2 predict-then-reveal; NB §3',
    ports: { needs: ['gap'], gives: ['committed'], consumes: [], po: { in: ALL_PO, out: 'same' }, regions: ['inset'] },
    params: {
      question: { type: 'string', required: true },                  // ≤ 70 chars
      answerKind: { type: 'enum', of: ['number'], default: 'number' },
      range: { type: 'array', default: [0, 100] },
      step: { type: 'num', default: 1 },
      unit: { type: 'string', default: ' %' },
      decimals: { type: 'int', default: 0, range: [0, 2] },
      filmDefault: { type: 'object', required: true },               // {value, label, src?, illus?} — cited, or labelled illustrative
      countdown: { type: 'num', default: 4, range: [2, 6] },
      tolerance: { type: 'num', default: 5 },
      read: { type: 'object', default: {} },                         // W.read spec over the inner's numbers (when the inner has no reveal())
      card: { type: 'object', default: {} },                         // {x, y, w} the commit card
      axis: { type: 'object', default: {} },                         // {x0, x1, y, label} own axis (only when the inner has no answerAxis)
      gapLine: { type: 'string', default: 'most of us land here' },
      notes: { type: 'array', default: [] },
    },
    duration: () => 0, phases: () => [], numbers: () => ({}), audit: () => ({ ok: false, msg: 'unwrapped' }), honesty: () => ['(combinator)'],

    wrap([I], P) {
      if (I.def.combinator === 'commit-predict-reveal' || I.def.hasCPR) throw new Error('commit-predict-reveal: CPR∘CPR is illegal (two commits for one reveal)');
      const inner = W.nest('in.', W.secs(I.def, I.P));
      const rv = I.def.reveal ? I.def.reveal(I.P) : null;
      const pi = W.payoffIndex(inner);
      if (pi < 0 && !rv) throw new Error('commit-predict-reveal: the inner has no payoff to reveal');
      const cb = 'in.' + (rv ? rv.commitBefore : inner[pi].id.slice(3)), ra = 'in.' + (rv ? rv.revealAfter : inner[pi].id.slice(3));
      const ci = inner.findIndex(p => p.id === cb), ri = inner.findIndex(p => p.id === ra);
      if (ci < 0 || ri < ci) throw new Error('commit-predict-reveal: bad splice ' + cb + ' → ' + ra);
      const nextHold = inner[ri + 1] && inner[ri + 1].hold;
      const own = {
        ask: { id: 'ask', s: ASK, introduces: ['guess'], marks: [{ term: 'guess', at: 0.1 }], labels: [{ term: 'guess', at: 0.5 }] },
        commit: { id: 'commit', s: P.countdown, shows: ['guess'] },
        gap: { id: 'gap', s: GAP, payoff: true, introduces: ['gap'], marks: [{ term: 'gap', at: 0.3 }], labels: [{ term: 'gap', at: 1.0 }],
          cue: { target: 'gap', at: 0.3, dur: 0.8 }, shows: ['guess', 'truth'] },
        hold: { id: 'hold', s: HOLD, hold: true },
      };
      const list = [].concat(inner.slice(0, ci), [own.ask, own.commit], inner.slice(ci, ri + 1), [own.gap], nextHold ? [] : [own.hold], inner.slice(ri + 1));
      const clock = W.clock(list), D = W.total(list);
      const innerNums = I.def.numbers(I.P);
      const truth = rv ? rv.value : W.read(innerNums, P.read).value;
      const axisOf = (ctx) => (I.def.answerAxis ? I.def.answerAxis(I.P, ctx.lay, ctx.po)
        : { x0: P.axis.x0 != null ? P.axis.x0 : 560, x1: P.axis.x1 != null ? P.axis.x1 : 860, y0: P.axis.y != null ? P.axis.y : 430, y1: P.axis.y != null ? P.axis.y : 430, min: P.range[0], max: P.range[1], own: true });
      const T = (id) => W.startOf(list, id), TE = (id) => W.endOf(list, id);
      const fadeAt = TE(nextHold ? inner[ri + 1].id : 'hold');      // the ticks stay through the hold, then step back

      return {
        hasCPR: true,
        types: W.inter(['T1', 'T4', 'T5', 'T7', 'T8'], I.def.types),
        ports: { needs: W.union(['gap'], I.def.ports.needs), gives: W.union(I.def.ports.gives, ['dissatisfied']), consumes: I.def.ports.consumes.filter(f => f !== 'committed'),
          po: I.def.ports.po, regions: W.union(I.def.ports.regions, ['inset']) },
        uses: () => W.union(['guess', 'answer', 'gapMark', 'closeMark'], I.def.uses(I.P)),
        duration: () => D,
        phases: () => W.fractions(list),
        numbers: () => Object.assign({ guess: () => P.filmDefault.value, truth: () => truth }, W.numbers('in.', innerNums)),
        out: (P2, po) => I.def.out(I.P, po),
        reveal: I.def.reveal ? () => ({ commitBefore: 'ask', revealAfter: 'gap', value: truth }) : undefined,
        aspects: (P2, po) => !!(I.def.aspects && I.def.aspects(I.P, po)),
        controls: () => [{ key: 'guess', kind: 'number', default: '', step: P.step, jumpPhase: 'ask', label: 'Your guess', question: P.question,
          result: (v) => (v === '' || v == null || Number.isNaN(+v) ? 'the film’s answer stays hidden until you guess' : 'you ' + fmtV(+v, P) + ' · counted ' + fmtV(truth, P) + ' · off by ' + fmtV(Math.abs(+v - truth), P).replace(P.unit, '') + (P.unit.trim() === '%' ? ' points' : '')) }]
          .concat(W.controls('in.', I.def, I.P)),
        gates: () => [{ phase: 'commit', key: 'guess', timeout: 8, min: P.range[0], max: P.range[1], step: P.step, unit: P.unit, question: P.question, at: 0.05 }],
        audit: () => {
          const a = I.def.audit(I.P) || {}, msgs = [];
          if (!a.ok) msgs.push('inner: ' + a.msg);
          if (P.question.length > 70) msgs.push('question > 70 chars');
          const fd = P.filmDefault;
          if (typeof fd.value !== 'number') msgs.push('filmDefault.value must be a number');
          if (!fd.src && !fd.illus) msgs.push('filmDefault needs a source or illus:true (never an invented answer)');
          if (!Number.isFinite(truth)) msgs.push('the reveal value is not derivable from the inner');
          else if (truth < P.range[0] || truth > P.range[1]) msgs.push('the reveal ' + truth + ' lies outside the range');
          return { ok: !msgs.length, msg: msgs.join('; '), note: [a.note, 'CPR: card ' + fmtV(fd.value, P) + ' → counted ' + fmtV(truth, P)].filter(Boolean).join(' · ') };
        },
        honesty: () => ['the video fills the card with ' + (P.filmDefault.illus ? 'an illustrative answer' : 'a cited common answer (' + P.filmDefault.src + ')') + '; only the page uses your own guess',
          'a prediction helps only when you had a prior to commit'].concat(I.def.honesty(I.P), P.notes),

        build(svg, ctx) {
          const K = ctx.K, S = (ctx.S = {}), kid = (ctx.kid = ctx.sub('in', I, { seed: '' }));
          I.def.build(svg, kid, I.P);
          const gC = ctx.role('guess'), aC = ctx.role('answer'), ink = ctx.base('ink'), dim = ctx.base('dim');
          const A = (S.A = axisOf(ctx)), Lw = ctx.lay.wide || !A.portrait, lab = Lw ? 13 : ctx.lay.fs.label;
          const RC = A.RC || { x0: ctx.lay.F.x0 + ctx.lay.F.w * 0.45, x1: ctx.lay.F.x1, y0: ctx.lay.F.y0 + 56, w: ctx.lay.F.w * 0.55 };
          S.Lw = Lw; S.RC = RC; S.lab = lab;
          const g = ctx.root('inset'), cx = Lw ? (P.card.x != null ? P.card.x : 590) : RC.x0, cy = Lw ? (P.card.y != null ? P.card.y : 196) : RC.y0 - 6, cw = Lw ? (P.card.w || 320) : RC.w;
          const pad = Lw ? 18 : 24, Q = Lw ? { s: 19, lh: 23, y1: 56 } : { s: ctx.lay.fs.cardQ, lh: ctx.lay.fs.cardQ * 1.18, y1: 92 };
          /* the card: dashed, the question, a ring, an answer slot */
          S.card = K.el('g', { opacity: 0 }, g);
          const box = K.el('rect', { x: cx, y: cy, width: cw, height: 100, rx: Lw ? 10 : 16, fill: ctx.base('panel').css, stroke: gC.css, 'stroke-width': Lw ? 1.2 : 1.8, 'stroke-dasharray': Lw ? '5 4' : '8 6' }, S.card);
          S.predict = K.tx(S.card, 'PREDICT FIRST', cx + pad, cy + (Lw ? 26 : 42), { size: lab, ls: Lw ? 2 : 1.5, fill: gC.css });
          S.q = K.wrap(S.card, P.question, cx + pad, cy + Q.y1, cw - 2 * pad - (Lw ? 0 : 8), Q.lh, { size: Q.s, cls: 'd', fill: ink.css });
          const qy = cy + Q.y1 + (S.q.n - 1) * Q.lh;
          S.ring = Lw ? K.countRing(S.card, cx + cw - 28, cy + 22, 13) : K.countRing(S.card, cx + cw - 42, cy + 40, 22);
          S.ans = K.tx(S.card, '', cx + pad, qy + (Lw ? 34 : 56), { size: Lw ? 22 : 44, weight: 700, fill: gC.css, op: 0 });
          S.ansSub = K.tx(S.card, '', cx + pad, qy + (Lw ? 53 : 94), { size: lab, cls: Lw ? undefined : 's', fill: dim.css, op: 0 });
          box.setAttribute('height', (qy + (Lw ? 66 : 150) - cy).toFixed(0));
          S.subW = cw - 2 * pad;
          S.pause = Lw ? K.tx(S.card, 'PAUSE AND GUESS', cx + cw - 50, cy + 26, { size: 13, ls: 1.5, fill: dim.css, anchor: 'end', op: 0 })   // on the card's own eyebrow row
                       : K.tx(S.card, 'PAUSE AND GUESS', cx + pad, cy + 42, { size: lab, ls: 1.5, fill: dim.css, op: 0 });             // portrait: it replaces PREDICT FIRST
          S.cardAns = { x: cx + pad + 6, y: qy + (Lw ? 28 : 44) };
          /* the axis (the inner's, or our own), the riding guess, the counted tick, the gap bracket */
          S.pos = (v) => { const u = (v - A.min) / (A.max - A.min); return { x: A.x0 + (A.x1 - A.x0) * u, y: A.y0 + (A.y1 - A.y0) * u }; };
          if (A.own) {
            S.axis = K.el('g', { opacity: 0 }, g);
            K.el('line', { x1: A.x0, y1: A.y0, x2: A.x1, y2: A.y1, stroke: dim.css, 'stroke-width': 1.2 }, S.axis);
            [A.min, A.max].forEach(v => { const p = S.pos(v); K.el('line', { x1: p.x, y1: p.y - 5, x2: p.x, y2: p.y + 5, stroke: dim.css, 'stroke-width': 1 }, S.axis);
              K.tx(S.axis, fmtV(v, P), p.x, p.y + 18, { size: 13, fill: dim.css, anchor: 'middle' }); });
            if (P.axis.label) K.tx(S.axis, P.axis.label, A.x0 - 14, A.y0 + 5, { size: 13, ls: 1.5, fill: dim.css, anchor: 'end' });
          }
          S.rider = K.el('circle', { r: Lw ? 5 : 9, fill: gC.css, opacity: 0 }, g);
          S.gTick = K.el('line', { stroke: gC.css, 'stroke-width': Lw ? 2.2 : 3.6, 'stroke-linecap': 'round', opacity: 0 }, g);
          S.gLab = K.tx(g, '', 0, 0, { size: lab, fill: gC.css, op: 0 });
          S.tTick = K.el('line', { stroke: aC.css, 'stroke-width': Lw ? 2.2 : 3.6, 'stroke-linecap': 'round', opacity: 0 }, g);
          S.tLab = K.tx(g, '', 0, 0, { size: lab, weight: 700, fill: aC.css, op: 0 });
          S.br = K.el('path', { fill: 'none', 'stroke-width': Lw ? 1.4 : 2.4, 'stroke-linecap': 'round', opacity: 0 }, g);
          S.brLab = K.tx(g, '', 0, 0, { size: lab, anchor: 'middle', op: 0 });
        },

        render(lt, ctx) {
          const K = ctx.K, S = ctx.S, kid = W.step(ctx.kid, clock(lt), ctx), ex = ctx.ex, gC = ctx.role('guess');
          I.def.render(kid.t, kid, I.P);
          const a0 = T('ask'), c0 = T('commit'), c1 = TE('commit'), g0 = T('gap');
          const guessRaw = ctx.ctl('guess', ''), mine = !(guessRaw === '' || guessRaw == null || Number.isNaN(+guessRaw));
          const guess = mine ? +guessRaw : P.filmDefault.value;
          /* ask → commit: the card, the ring, the answer slot */
          const collapse = ctx.go(c1 + 0.7, 0.6, 'collect');
          K.show(S.card, ctx.go(a0 + 0.1, 0.5, 'defer') * (1 - collapse)); K.tr(S.card, 0, (1 - ctx.go(a0 + 0.1, 0.5)) * 10);
          K.setOp(S.q.e, ctx.go(ctx.label('guess'), 0.5));
          const cp = ex.clamp((lt - c0) / P.countdown), live = lt >= c0 && lt < c1;
          S.ring.set(cp, live ? Math.max(1, Math.ceil(P.countdown - (lt - c0))) : '', gC.css, live ? 1 : 0);
          K.setOp(S.pause, (lt >= c0 ? 0.9 : 0) * (S.Lw ? 1 - ctx.go(c1 - 0.3, 0.3) : (lt < c1 ? 1 : 0)) * (1 - collapse));
          if (!S.Lw) K.setOp(S.predict, lt >= c0 && lt < c1 ? 0 : 1);
          const filled = ctx.go(c1 - 0.5, 0.4);
          K.setText(S.ans, '→ ' + fmtV(guess, P)); K.setOp(S.ans, filled);
          const sub = mine ? 'your guess' : P.filmDefault.label + (P.filmDefault.src ? ' · ' + P.filmDefault.src : '') + (P.filmDefault.illus ? ' · illus.' : '');
          if (S.Lw) K.setText(S.ansSub, sub); else K.fitLine(S.ansSub, sub, S.subW);
          K.setOp(S.ansSub, filled * 0.95);
          /* the guess rides from the card to the axis, and stays there through the reveal */
          const A = S.A, gp = S.pos(guess), tp = S.pos(truth), horiz = Math.abs(A.y1 - A.y0) < 1;
          const ride = ctx.go(c1 + 0.2, 0.9, 'rest'), after = 1 - ctx.go(fadeAt, 0.6);
          if (S.axis) K.setOp(S.axis, ctx.go(c1 + 0.2, 0.5) * (0.4 + 0.6 * after));
          const rx = ex.lerp(S.cardAns.x, gp.x, ride), ry = ex.lerp(S.cardAns.y, gp.y, ride) - Math.sin(Math.PI * ride) * 30;
          S.rider.setAttribute('cx', rx.toFixed(1)); S.rider.setAttribute('cy', ry.toFixed(1)); K.setOp(S.rider, lt >= c1 + 0.2 && ride < 1 ? 1 : 0);
          const th = S.Lw ? 9 : 16;
          const tick = (e, p, o) => { e.setAttribute('x1', p.x); e.setAttribute('x2', p.x); e.setAttribute('y1', p.y - (horiz ? th : 0)); e.setAttribute('y2', p.y + (horiz ? th : 0)); K.setOp(e, o); };
          /* portrait: two label rows under the axis (count, then guess), each kept inside the right column */
          const place = (e, x, y, anchor) => { e.setAttribute('y', y.toFixed(1));
            if (S.Lw) { e.setAttribute('x', x.toFixed(1)); e.setAttribute('text-anchor', anchor); return; }
            let w = K.tw(e); try { w = e.getBBox().width || w; } catch (er) { /* before layout */ }
            const lo = S.RC.x0, hi = S.RC.x1; let x0 = anchor === 'end' ? x - w : (anchor === 'middle' ? x - w / 2 : x);
            x0 = Math.max(lo, Math.min(hi - w, x0)); e.setAttribute('x', x0.toFixed(1)); e.setAttribute('text-anchor', 'start');
            e.querySelectorAll('tspan').forEach(t => t.setAttribute('x', x0.toFixed(1))); };
          const gOn = (ride >= 1 ? 1 : 0) * after, lowG = guess <= truth;
          tick(S.gTick, gp, gOn);
          K.setText(S.gLab, (mine ? 'you ' : P.filmDefault.short || 'common answer ') + fmtV(guess, P));
          place(S.gLab, gp.x + (lowG ? 4 : -4), gp.y + (S.Lw ? 36 : 88), lowG ? 'end' : 'start');
          K.setOp(S.gLab, gOn);
          /* gap: the counted answer arrives on the same axis, then the bracket */
          const tOn = ctx.go(g0 + 0.2, 0.5) * after;
          tick(S.tTick, tp, tOn);
          K.setText(S.tLab, 'counted ' + fmtV(truth, P));
          place(S.tLab, tp.x + (lowG ? -4 : 4), tp.y + (S.Lw ? 36 : 50), lowG ? 'start' : 'end');
          K.setOp(S.tLab, tOn);
          const d = Math.abs(guess - truth), inside = d <= P.tolerance, bc = ctx.role(inside ? 'closeMark' : 'gapMark');
          const bp = ctx.go(ctx.mark('gap'), 0.7) * after, by = Math.min(gp.y, tp.y) - (S.Lw ? 18 : 26);
          const xa = Math.min(gp.x, tp.x), xb = ex.lerp(xa, Math.max(gp.x, tp.x), bp);
          const bt = S.Lw ? 6 : 10;
          S.br.setAttribute('d', 'M' + xa.toFixed(1) + ' ' + (by + bt) + ' V' + by + ' H' + xb.toFixed(1) + ' V' + (by + bt));
          S.br.setAttribute('stroke', bc.css); K.setOp(S.br, bp > 0 ? 1 : 0);
          const brl = inside ? 'close: within ' + fmtV(P.tolerance, P).trim() : fmtV(d, P).replace(P.unit, '') + (P.unit.trim() === '%' ? ' points off' : ' off') + ' · ' + P.gapLine;
          if (S.Lw) K.setText(S.brLab, brl); else K.fitLine(S.brLab, brl, S.RC.w, { up: true });
          S.brLab.setAttribute('fill', bc.css); place(S.brLab, (xa + Math.max(gp.x, tp.x)) / 2, by - (S.Lw ? 10 : 16), 'middle');
          K.setOp(S.brLab, ctx.go(ctx.label('gap'), 0.5) * after);
        },

        p5Layer: I.def.p5Layer ? {
          z: I.def.p5Layer.z, costMs: I.def.p5Layer.costMs || 0, means: I.def.p5Layer.means,
          setup(p, L, ctx) { return I.def.p5Layer.setup ? I.def.p5Layer.setup(p, L, ctx.kid, I.P) : null; },
          draw(p, lt, L, ctx) { I.def.p5Layer.draw(p, clock(lt), L, ctx.kid, I.P); },
        } : undefined,
      };
    },
  });
})();
