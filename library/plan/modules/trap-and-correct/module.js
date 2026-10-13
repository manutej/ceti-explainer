/* ════════════════════════════════════════════════════════════════════
   modules/trap-and-correct — combinator M_wrong × M_right → M (the wrong model runs first)
   --------------------------------------------------------------------
   MODULE-OPERAD §2 (PED #4, #5: Muller et al. 2008; Posner 1982; Kendeou co-activation).
   The wrong model is a lightweight model given in params ({name, steelman, works, says}),
   drawn in ghost style on the SAME persistent object as the right module (slot "right"),
   so the correction is a state change of one picture, never a second picture:
     r.<first spliceAfter phases>   the right module sets the scene (the shared object appears)
     steelman   the wrong model, fairly stated, and where it works (credited)
     run-wrong  it runs: a meter fills, confidently, to its answer (judgement colour)
     break      payoff — the fact it ignored is cued on the object; its meter gets the dashed error outline
     hold       declared, 2 s
     r.<rest>   the right module plays on the same anchors and counts the answer
     fruitful   a fresh case: the right model's count beside the wrong model's unchanged answer
   The right module is frozen (Clock.freeze) during the trap's own phases.
   Interface for CPR: reveal(P) commits before "steelman" and reveals after the right's payoff;
   answerAxis(P) is the meter, so the viewer's guess, the wrong model and the count share one axis.
   Colour variables: wrongModel (judgement) · gapMark (what it ignored) · answer (the count).
   Aspects: composes itself wherever its right module does. Portrait: the card sits at the top of the right
   column, the meter at its foot (the right module gets lay.reserve for it), the ring wraps the PO's own bounds.
   ──────────────────────────────────────────────────────────────────── */
(function () {
  const W = (typeof Wrap !== 'undefined' ? Wrap : globalThis.Wrap);
  const root = typeof window !== 'undefined' ? window : globalThis;
  const STEEL = 3.5, RUN = 3.5, BRK = 2.5, HOLD = 2, FRESH = 3.5;
  const ALL_PO = ['track', 'grid', 'stack', 'axis', 'vessel', 'frontier', 'timeline', 'population', 'chain', 'cutaway', 'form', 'field'];
  const fmtV = (v, unit, d) => (Math.round(v * Math.pow(10, d || 0)) / Math.pow(10, d || 0)).toFixed(d || 0) + unit;

  Module.define('trap-and-correct', {
    kind: 'combinator', arity: 2, slots: ['right'],
    types: ['T1', 'T3', 'T5', 'T6', 'T7', 'T8'],
    evidence: 'PED #4 confront-the-misconception, #5 run-the-wrong-model (Muller et al. 2008; Posner 1982; Kendeou; Lewandowsky fact-myth-fallacy-fact); NAR A2, device 18 steel-man',
    ports: { needs: ['gap'], gives: ['wrong', 'dissatisfied', 'instance'], consumes: [], po: { in: ALL_PO, out: 'same' }, regions: ['body'] },
    params: {
      wrong: { type: 'object', required: true },        // {name, steelman ≤ 90, works, says (in the meter's units before scale)}
      observed: { type: 'object', required: true },     // {line, box:{x,y,w,h}} the fact the wrong model ignored, and where it is on the object
      read: { type: 'object', default: {} },            // W.read spec: the right module's counted answer
      fresh: { type: 'object', required: true },        // {label, read (W.read spec), line ({top} {of} {value}), wrongSays?} a second case
      scale: { type: 'num', default: 100 },             // wrong.says × scale = meter units
      unit: { type: 'string', default: ' %' },
      meter: { type: 'object', default: {} },           // {x0, x1, y, min, max}
      card: { type: 'object', default: {} },            // {x, y, w}
      spliceAfter: { type: 'int', default: 1, range: [0, 3] },
      notes: { type: 'array', default: [] },
    },
    duration: () => 0, phases: () => [], numbers: () => ({}), audit: () => ({ ok: false, msg: 'unwrapped' }), honesty: () => ['(combinator)'],

    wrap([R], P) {
      if (R.def.combinator === 'trap-and-correct') throw new Error('trap-and-correct: trap∘trap is illegal');
      const right = W.nest('r.', W.secs(R.def, R.P));
      const pi = W.payoffIndex(right);
      if (pi < P.spliceAfter) throw new Error('trap-and-correct: the right module pays off before the wrong model could run');
      const own = {
        steel: { id: 'steelman', s: STEEL, introduces: ['wrong model'], marks: [{ term: 'wrong model', at: 0.2 }], labels: [{ term: 'wrong model', at: 0.8 }] },
        run: { id: 'run-wrong', s: RUN, introduces: ['meter'], marks: [{ term: 'meter', at: 0.2 }], labels: [{ term: 'meter', at: 1.6 }], shows: ['wrongSays'] },
        brk: { id: 'break', s: BRK, payoff: true, introduces: ['ignored'], marks: [{ term: 'ignored', at: 0.1 }], labels: [{ term: 'ignored', at: 1.0 }], cue: { target: 'ignored', at: 0.2, dur: 1.0 } },
        hold: { id: 'break-hold', s: HOLD, hold: true },
        fresh: { id: 'fruitful', s: FRESH, introduces: ['fresh'], marks: [{ term: 'fresh', at: 0.2 }], labels: [{ term: 'fresh', at: 0.9 }], shows: ['freshRight', 'freshWrong'] },
      };
      const list = [].concat(right.slice(0, P.spliceAfter), [own.steel, own.run, own.brk, own.hold], right.slice(P.spliceAfter), [own.fresh]);
      const clock = W.clock(list), D = W.total(list), T = (id) => W.startOf(list, id), TE = (id) => W.endOf(list, id);
      const nums = R.def.numbers(R.P), truthR = W.read(nums, P.read), freshR = W.read(nums, P.fresh.read || {});
      const truth = truthR.value, says = P.wrong.says * P.scale, fSays = (P.fresh.wrongSays != null ? P.fresh.wrongSays : P.wrong.says) * P.scale;
      const M16 = Object.assign({ x0: 560, x1: 860, y: 420, min: 0, max: 100 }, P.meter);
      const RESERVE = 176;
      /** the right column of a portrait layout (the grid PO's plan, else the right 55 % of the figure) */
      const rcOf = (lay, po) => (po && po.kind === 'grid' ? root.Layout.gridPlan(po.geom.n, lay.F).RC
        : { x0: lay.F.x0 + lay.F.w * 0.45, x1: lay.F.x1, y0: lay.F.y0 + 56, y1: lay.F.y1, w: lay.F.w * 0.55, h: lay.F.h - 56 });
      const meterOf = (lay, po) => { if (!lay || lay.wide) return M16; const RC = rcOf(lay, po);
        return Object.assign({}, M16, { x0: RC.x0 + 44, x1: RC.x1 - 72, y: RC.y1 - 96, RC, portrait: true }); };
      let M = M16;
      const resume = right[P.spliceAfter].id, payId = right[pi].id;

      return {
        types: W.inter(['T1', 'T3', 'T5', 'T6', 'T7', 'T8'], R.def.types),
        ports: { needs: W.union(['gap'], R.def.ports.needs), gives: W.union(['wrong', 'dissatisfied', 'instance'], R.def.ports.gives), consumes: R.def.ports.consumes,
          po: R.def.ports.po, regions: W.union(R.def.ports.regions, ['body']) },
        uses: () => W.union(['wrongModel', 'gapMark', 'answer'], R.def.uses(R.P)),
        duration: () => D,
        phases: () => W.fractions(list),
        numbers: () => Object.assign({ wrongSays: () => says, truth: () => truth, freshRight: () => freshR.value, freshWrong: () => fSays }, W.numbers('r.', nums)),
        out: (P2, po) => R.def.out(R.P, po),
        reveal: () => ({ commitBefore: 'steelman', revealAfter: payId, value: truth }),
        answerAxis: (P2, lay, po) => { const A = meterOf(lay, po); return { x0: A.x0, y0: A.y, x1: A.x1, y1: A.y, min: A.min, max: A.max, portrait: !!A.portrait, RC: A.RC }; },
        aspects: (P2, po) => !!(R.def.aspects && R.def.aspects(R.P, po)),
        controls: () => W.controls('r.', R.def, R.P),
        audit: () => {
          const a = R.def.audit(R.P) || {}, msgs = [];
          if (!a.ok) msgs.push('right: ' + a.msg);
          if (!P.wrong.steelman || P.wrong.steelman.length > 90) msgs.push('steelman missing or > 90 chars (no strawmen)');
          if (!P.wrong.works) msgs.push('credit where the wrong model works (wrong.works)');
          if (!Number.isFinite(truth)) msgs.push('the right answer is not derivable: ' + (truthR.msg || ''));
          if (!Number.isFinite(freshR.value)) msgs.push('the fresh case is not derivable: ' + (freshR.msg || ''));
          if (Number.isFinite(truth) && Math.abs(says - truth) < 1e-9) msgs.push('the wrong model is right on the case: nothing breaks');
          if (!P.observed.line) msgs.push('observed.line missing');
          return { ok: !msgs.length, msg: msgs.join('; '),
            note: [a.note, 'trap: wrong ' + fmtV(says, P.unit) + ' vs counted ' + fmtV(truth, P.unit) + '; fresh ' + fmtV(freshR.value, P.unit) + (freshR.of ? ' (' + freshR.top + '/' + freshR.of + ')' : '')].filter(Boolean).join(' · ') };
        },
        honesty: () => ['the wrong model is credited where it works: ' + P.wrong.works].concat(R.def.honesty(R.P), P.notes),

        build(svg, ctx) {
          const K = ctx.K, S = (ctx.S = {}), Lw = ctx.lay.wide;
          const kid = (ctx.kid = ctx.sub('r', R, { seed: '', lay: Lw ? undefined : ctx.lay.sub({ reserve: RESERVE }) }));
          R.def.build(svg, kid, R.P);
          M = S.M = meterOf(ctx.lay, ctx.po);
          const wC = ctx.role('wrongModel'), gm = ctx.role('gapMark'), aC = ctx.role('answer'), ink = ctx.base('ink'), dim = ctx.base('dim');
          const RC = M.RC, lab = Lw ? 13 : ctx.lay.fs.label;
          const g = ctx.root('body'), cx = Lw ? (P.card.x != null ? P.card.x : 590) : RC.x0, cy = Lw ? (P.card.y != null ? P.card.y : 196) : RC.y0 - 6, cw = Lw ? (P.card.w || 320) : RC.w;
          const pad = Lw ? 18 : 24, Q = Lw ? { s: 19, lh: 23, y1: 54 } : { s: 32, lh: 38, y1: 88 }, B = Lw ? { lh: 18, gap: 26 } : { lh: 34, gap: 40 };
          /* the wrong model, fairly stated (ghost: dashed, judgement colour) */
          S.card = K.el('g', { opacity: 0 }, g);
          const box = K.el('rect', { x: cx, y: cy, width: cw, height: 120, rx: Lw ? 10 : 16, fill: ctx.base('panel').css, stroke: wC.css, 'stroke-width': Lw ? 1.1 : 1.8, 'stroke-dasharray': Lw ? '2 4' : '3 6' }, S.card);
          K.tx(S.card, P.wrong.name.toUpperCase(), cx + pad, cy + (Lw ? 26 : 42), { size: lab, ls: Lw ? 2 : 1.5, fill: wC.css });
          const st = K.wrap(S.card, P.wrong.steelman, cx + pad, cy + Q.y1, cw - 2 * pad, Q.lh, { size: Q.s, cls: 'd', fill: ink.css });
          let y = cy + Q.y1 + (st.n - 1) * Q.lh + B.gap;
          S.works = K.wrap(S.card, 'fair when ' + P.wrong.works, cx + pad, y, cw - 2 * pad, B.lh, { size: lab, cls: Lw ? undefined : 's', fill: dim.css, op: 0 });
          y += (S.works.n - 1) * B.lh + B.gap;
          S.obs = K.wrap(S.card, P.observed.line, cx + pad, y, cw - 2 * pad, B.lh, { size: lab, cls: Lw ? undefined : 's', fill: gm.css, op: 0 });
          y += (S.obs.n - 1) * B.lh + (Lw ? 16 : 26);
          box.setAttribute('height', (y - cy).toFixed(0));
          /* the cue on what it ignored: a ring around that region of the shared object */
          const pg = kid.po.geom;
          const bx = Lw ? (P.observed.box || { x: 60, y: 160, w: 400, h: 220 })
            : (pg && pg.x0 != null && pg.x1 != null ? { x: pg.x0 - 18, y: pg.y0 - 18, w: pg.x1 - pg.x0 + 36, h: pg.y1 - pg.y0 + 36 } : { x: ctx.lay.F.x0, y: ctx.lay.F.y0 + 50, w: ctx.lay.F.w * 0.42, h: ctx.lay.F.h - 60 });
          S.ring = K.el('rect', { x: bx.x, y: bx.y, width: bx.w, height: bx.h, rx: 12, fill: 'none', stroke: gm.css, 'stroke-width': Lw ? 1.4 : 2.4, 'stroke-dasharray': Lw ? '6 5' : '10 8', opacity: 0 }, g);
          /* the meter: the wrong model's answer, filled with confidence */
          S.m = K.el('g', { opacity: 0 }, g);
          const sx = (v) => M.x0 + (M.x1 - M.x0) * (v - M.min) / (M.max - M.min);
          S.sx = sx;
          const tk = Lw ? 4 : 8;
          K.el('line', { x1: M.x0, y1: M.y, x2: M.x1, y2: M.y, stroke: dim.css, 'stroke-width': Lw ? 1.2 : 2 }, S.m);
          [M.min, (M.min + M.max) / 2, M.max].forEach((v, i) => { K.el('line', { x1: sx(v), y1: M.y - tk, x2: sx(v), y2: M.y + tk, stroke: dim.css, 'stroke-width': Lw ? 1 : 1.6 }, S.m);
            if (Lw) K.tx(S.m, fmtV(v, ''), sx(v), M.y + 18, { size: 13, fill: dim.css, anchor: 'middle' });
            else if (i !== 1) K.tx(S.m, fmtV(v, ''), i ? M.x1 + 14 : M.x0 - 14, M.y + lab * 0.36, { size: lab, fill: dim.css, anchor: i ? 'start' : 'end' }); });
          const fh = Lw ? 10 : 16, oh = Lw ? 16 : 26;
          S.fill = K.el('rect', { x: M.x0, y: M.y - fh / 2, height: fh, width: 0, rx: 2, fill: wC.a(0.85) }, g);
          S.fillOut = K.el('rect', { x: M.x0 - 3, y: M.y - oh / 2, height: oh, width: 0, rx: 4, fill: 'none', stroke: gm.css, 'stroke-width': Lw ? 1.2 : 2, 'stroke-dasharray': Lw ? '4 3' : '7 5', opacity: 0 }, g);
          const above = { x: Lw ? M.x0 - 16 : RC.x0, y: Lw ? M.y + 5 : M.y - 44, anchor: Lw ? 'end' : 'start' };
          S.mTitle = K.tx(g, P.wrong.name.toUpperCase() + ' · ' + fmtV(says, P.unit), above.x, above.y, { size: lab, ls: Lw ? 1.5 : 0.8, fill: wC.css, anchor: above.anchor, op: 0 });
          /* fruitful: a fresh case on the same meter */
          S.fTitle = K.tx(g, P.fresh.label.toUpperCase(), above.x, above.y, { size: lab, ls: Lw ? 1.5 : 0.8, fill: ink.css, anchor: above.anchor, op: 0 });
          S.fWrong = K.tx(g, P.wrong.name + (fSays === says ? ' · still ' : ' · ') + fmtV(fSays, P.unit), Lw ? M.x0 - 16 : RC.x0, Lw ? M.y + 25 : M.y + 50, { size: lab, fill: wC.css, anchor: Lw ? 'end' : 'start', op: 0 });
          S.fTick = K.el('line', { x1: sx(freshR.value), x2: sx(freshR.value), y1: M.y - (Lw ? 10 : 16), y2: M.y + (Lw ? 10 : 16), stroke: aC.css, 'stroke-width': Lw ? 2.4 : 3.6, 'stroke-linecap': 'round', opacity: 0 }, g);
          const fl = (P.fresh.line || 'counted').split('{top}').join((freshR.top || 0).toLocaleString('en-US')).split('{of}').join((freshR.of || 0).toLocaleString('en-US'));
          S.fLab = K.tx(g, fl.includes('{value}') ? fl.split('{value}').join(fmtV(freshR.value, P.unit)) : fl + ' = ' + fmtV(freshR.value, P.unit),
            Lw ? sx(freshR.value) - 4 : RC.x1, Lw ? M.y - 16 : M.y + 88, { size: lab, weight: 700, fill: aC.css, anchor: 'end', op: 0 });
          if (!Lw) { K.fitLine(S.fWrong, S.fWrong.textContent, RC.w); K.fitLine(S.fLab, S.fLab.textContent, RC.w); K.fitLine(S.mTitle, S.mTitle.textContent, RC.w); }
        },

        render(lt, ctx) {
          const K = ctx.K, S = ctx.S, kid = W.step(ctx.kid, clock(lt), ctx), ex = ctx.ex;
          R.def.render(kid.t, kid, R.P);
          const s0 = T('steelman'), r0 = T('run-wrong'), b0 = T('break'), back = T(resume), f0 = T('fruitful');
          /* the card: steelman, credit, then (at the break) the fact it ignored */
          const out = ctx.go(back, 0.6, 'collect');
          K.show(S.card, ctx.go(s0 + 0.2, 0.5, 'defer') * (1 - out)); K.tr(S.card, 0, (1 - ctx.go(s0 + 0.2, 0.5)) * 10);
          K.setOp(S.works.e, ctx.go(s0 + 1.6, 0.5) * 0.95);
          K.setOp(S.obs.e, ctx.go(ctx.label('ignored'), 0.5));
          /* the meter fills with confidence (run-wrong) */
          const mOn = ctx.go(r0 + 0.2, 0.5), fresh = ctx.go(f0 + 0.2, 0.5);
          const ghost = 1 - 0.45 * ctx.go(back, 0.6);
          K.setOp(S.m, mOn * (0.55 + 0.45 * ghost));
          const fp = ctx.go(r0 + 0.5, 1.3, 'rest');
          const fv = ex.lerp(says, fSays, ctx.go(f0 + 0.3, 0.8, 'rest'));
          S.fill.setAttribute('width', Math.max(0, S.sx(M.min + (fv - M.min) * fp) - M.x0).toFixed(1)); K.setOp(S.fill, (lt >= r0 + 0.5 ? 1 : 0) * ghost);
          K.setOp(S.mTitle, ctx.go(ctx.label('meter'), 0.5) * ghost * (1 - fresh) * (ctx.lay.wide ? 1 : 1 - ctx.go(back, 0.6)));   // portrait: the row above the meter is the gap label's next
          /* break: the ring on what it ignored (the cue), then the dashed error outline on its answer */
          const cue = ctx.cue('ignored'), cueP = cue ? ex.clamp((lt - cue.a) / (cue.b - cue.a)) : 0;
          const ringO = (lt >= b0 + 0.1 ? 1 : 0) * (cueP < 1 ? 0.55 + 0.45 * Math.sin(Math.PI * cueP * 2) * (1 - cueP) : 0.5) * (1 - ctx.go(back, 0.6));
          K.setOp(S.ring, ctx.rm ? (lt >= b0 && lt < back ? 0.8 : 0) : ringO);
          S.fillOut.setAttribute('width', (S.sx(says) - M.x0 + 6).toFixed(1)); K.setOp(S.fillOut, ctx.go(b0 + 0.6, 0.4) * (1 - fresh));
          /* fruitful: the same meter, a fresh case: the count moves, the wrong model does not */
          K.setOp(S.fTitle, fresh); K.setOp(S.fWrong, ctx.go(f0 + 0.6, 0.4));
          K.setOp(S.fTick, ctx.go(ctx.mark('fresh') + 0.4, 0.4)); K.setOp(S.fLab, ctx.go(ctx.label('fresh'), 0.5));
        },

        p5Layer: R.def.p5Layer ? {
          z: R.def.p5Layer.z, costMs: R.def.p5Layer.costMs || 0, means: R.def.p5Layer.means,
          setup(p, L, ctx) { return R.def.p5Layer.setup ? R.def.p5Layer.setup(p, L, ctx.kid, R.P) : null; },
          draw(p, lt, L, ctx) { R.def.p5Layer.draw(p, clock(lt), L, ctx.kid, R.P); },
        } : undefined,
      };
    },
  });
})();
