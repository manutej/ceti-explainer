/* ════════════════════════════════════════════════════════════════════
   modules/contrast-split — combinator M × M → M (one module, two rules, side by side)
   --------------------------------------------------------------------
   MODULE-OPERAD §3 (PED #14 contrast-two-cases: Alfieri et al. 2013; Gentner 2003;
   #15 name-it-last). Slot "inner" is instance A; B is the SAME spec with exactly one
   parameter changed (params.vary = {param, b}), so the two halves can differ in one
   thing only. Both halves draw from one seed (identical marks) on one clock.
     clone   the one persistent object shrinks into the left half; a copy appears on the right
     flip    the rule flips on the right: a continuous wipe from A's picture to B's (same seed,
             same cells), then B's tag is written (picture before words)
     a.*     the inner's phases from startPhase on, both halves at once (pace ×P.pace; holds keep 2 s)
     align   what is the same is tied first (similarities before differences)
     differ  payoff — the one difference is cued on both answers
     name    the principle, last
   The p5 layers are the inner's own, drawn twice under a translate+scale (and a clip while
   the wipe runs). Page control: mirror (swap the halves: no derived number may change —
   the equivariance check of METHOD §4, also run in audit()).
   Colour variables: tie (what is the same) · answer (the counted results) · principle.
   Aspects (CHANNELS §3.3 "contrast-split at 9:16: stack"): at 1:1, 4:5 and 9:16 the halves stack (A on top,
   B below) and each inner is laid out natively in its half (ctx.sub with a sub-layout, mode 'side', and the PO
   re-laid by PO.refit) — no scaling, so every label keeps the phone floor. The tie runs down the left lane
   between the two "she would say" rows; the ≠ sits on the divider between the two answers.
   ──────────────────────────────────────────────────────────────────── */
(function () {
  const W = (typeof Wrap !== 'undefined' ? Wrap : globalThis.Wrap);
  const root = typeof window !== 'undefined' ? window : globalThis;
  const CLONE = 2.0, FLIP = 2.0, ALIGN = 3.0, DIFF = 3.0, NAME = 2.5;
  const ALL_PO = ['track', 'grid', 'stack', 'axis', 'vessel', 'frontier', 'timeline', 'population', 'chain', 'cutaway', 'form', 'field'];
  const fmtV = (v, unit, d) => (Math.round(v * Math.pow(10, d || 0)) / Math.pow(10, d || 0)).toFixed(d || 0) + unit;
  const HALF = { L: { x: 40, w: 430 }, R: { x: 490, w: 430 } };

  Module.define('contrast-split', {
    kind: 'combinator', arity: 2, slots: ['inner'],
    types: ['T2', 'T3', 'T5', 'T6', 'T7', 'T8'],
    evidence: 'PED #14 contrast-two-cases (Alfieri et al. 2013; Gentner 2003; Schwartz & Bransford 1998), #15 name-it-last; NAR device 7, 17; A12',
    ports: { needs: ['instance'], gives: ['rule'], consumes: [], po: { in: ALL_PO, out: 'same' }, regions: ['left', 'right', 'foot'] },
    params: {
      vary: { type: 'object', required: true },          // {param, b, tagA, tagB}: B = A with params[param] = b
      read: { type: 'object', default: {} },             // W.read spec: each half's answer
      scale: { type: 'num', default: 100 },
      unit: { type: 'string', default: ' %' },
      decimals: { type: 'int', default: 0, range: [0, 2] },
      pace: { type: 'num', default: 1.4, range: [1, 2.5] },
      startPhase: { type: 'int', default: 1, range: [0, 4] },
      box: { type: 'object', default: { x0: 40, y0: 100, x1: 930, y1: 505 } },   // the inner's content box (its own coords)
      top: { type: 'num', default: 168 },
      align: { type: 'object', required: true },         // {at:{x,y}, line} a matched anchor (inner coords): what is the same
      differ: { type: 'object', required: true },        // {at:{x,y}, line with {left} {right}} the one difference
      principle: { type: 'object', required: true },     // {term, line}
      hideLabel: { type: 'bool', default: true },
      notes: { type: 'array', default: [] },
    },
    duration: () => 0, phases: () => [], numbers: () => ({}), audit: () => ({ ok: false, msg: 'unwrapped' }), honesty: () => ['(combinator)'],

    wrap([A], P, Rz) {
      if (A.def.combinator === 'contrast-split') throw new Error('contrast-split: no nesting (no 4-way split)');
      const specB = JSON.parse(JSON.stringify(A.spec)); specB.params = Object.assign({}, specB.params, { [P.vary.param]: P.vary.b });
      const B = Rz.resolve(specB, 'b');
      const secsA = W.secs(A.def, A.P), secsB = W.secs(B.def, B.P);
      if (JSON.stringify(secsA.map(p => [p.id, +p.s.toFixed(6)])) !== JSON.stringify(secsB.map(p => [p.id, +p.s.toFixed(6)]))) throw new Error('contrast-split: A and B must share one phase table (one clock)');
      const it0 = secsA.slice(0, P.startPhase).reduce((a, p) => a + p.s, 0);
      const inner = W.nest('a.', secsA.slice(P.startPhase), P.pace);
      const own = {
        clone: { id: 'clone', s: CLONE, introduces: ['split'], marks: [{ term: 'split', at: 0.1 }], labels: [{ term: 'split', at: 1.2 }] },
        flip: { id: 'flip', s: FLIP, introduces: ['rule'], marks: [{ term: 'rule', at: 0.2 }], labels: [{ term: 'rule', at: 1.4 }] },
        align: { id: 'align', s: ALIGN, introduces: ['same'], marks: [{ term: 'same', at: 0.2 }], labels: [{ term: 'same', at: 0.9 }] },
        differ: { id: 'differ', s: DIFF, payoff: true, introduces: ['difference'], marks: [{ term: 'difference', at: 0.2 }], labels: [{ term: 'difference', at: 1.0 }],
          cue: { target: 'difference', at: 0.3, dur: 1.0 }, shows: ['left', 'right'] },
        name: { id: 'name', s: NAME, names: [{ term: P.principle.term, principle: true, at: 0.3 }] },
      };
      const list = [own.clone, own.flip].concat(inner, [own.align, own.differ, own.name]);
      const clock = W.clock(list, it0), D = W.total(list), T = (id) => W.startOf(list, id);
      const nA = A.def.numbers(A.P), nB = B.def.numbers(B.P);
      const left = W.read(nA, Object.assign({ scale: P.scale }, P.read)).value, right = W.read(nB, Object.assign({ scale: P.scale }, P.read)).value;
      const bx = P.box, s = Math.min(1, HALF.L.w / (bx.x1 - bx.x0));
      const placeOf = (h) => ({ s, tx: h.x + (h.w - (bx.x1 - bx.x0) * s) / 2 - bx.x0 * s, ty: P.top - bx.y0 * s });
      const PL = placeOf(HALF.L), PR = placeOf(HALF.R), ID = { s: 1, tx: 0, ty: 0 };
      const lerpPl = (a, b, u) => ({ s: a.s + (b.s - a.s) * u, tx: a.tx + (b.tx - a.tx) * u, ty: a.ty + (b.ty - a.ty) * u });
      const map = (pl, pt) => ({ x: pl.tx + pt.x * pl.s, y: pl.ty + pt.y * pl.s });
      const fill = (str) => String(str || '').split('{left}').join(fmtV(left, P.unit, P.decimals)).split('{right}').join(fmtV(right, P.unit, P.decimals));
      /** the frame's layout: where each half sits, how far the wipe has run, how present the right half is */
      function layout(lt, ctx) {
        const mirror = !!ctx.ctl('mirror', false), m = ctx.go(0.15, 1.2, 'rest');
        const wipe = ctx.rm ? (lt >= T('flip') + 1.2 ? 1 : 0) : ctx.ex.eio(ctx.ex.clamp((lt - T('flip') - 0.2) / 1.0));
        const Lp = lerpPl(ID, mirror ? PR : PL, m), Rp = mirror ? PL : PR;
        return { mirror, m, wipe, Lp, Rp, rightO: ctx.go(0.6, 0.8, 'defer'), wx: bx.x0 + (bx.x1 - bx.x0) * wipe };
      }
      const xfm = (pl) => 'translate(' + pl.tx.toFixed(2) + ' ' + pl.ty.toFixed(2) + ') scale(' + pl.s.toFixed(4) + ')';
      /** portrait: two stacked half boxes in lay.F (A above B), the gap between them holds the divider and the ≠ */
      const halvesOf = (lay) => { const F = lay.F, gap = 34, h = (F.h - gap) / 2, mk = (y0) => ({ x0: F.x0, y0, x1: F.x1, y1: y0 + h, w: F.w, h });
        return { A: mk(F.y0), B: mk(F.y0 + h + gap), midY: F.y0 + h + gap / 2 }; };
      function layoutP(lt, ctx, H) {
        const mirror = !!ctx.ctl('mirror', false), dy = H.B.y0 - H.A.y0, F = ctx.lay.F;
        const wipe = ctx.rm ? (lt >= T('flip') + 1.2 ? 1 : 0) : ctx.ex.eio(ctx.ex.clamp((lt - T('flip') - 0.2) / 1.0));
        return { mirror, m: 1, wipe, Lp: mirror ? { s: 1, tx: 0, ty: dy } : ID, Rp: mirror ? { s: 1, tx: 0, ty: -dy } : ID, rightO: ctx.go(0.6, 0.8, 'defer'),
          wx: F.x0 - 10 + (F.w + 20) * wipe, portrait: true };
      }

      return {
        types: W.inter(['T2', 'T3', 'T5', 'T6', 'T7', 'T8'], A.def.types),
        ports: { needs: A.def.ports.needs, gives: W.union(A.def.ports.gives, ['rule']), consumes: A.def.ports.consumes, po: A.def.ports.po, regions: W.union(A.def.ports.regions, ['left', 'right', 'foot']) },
        uses: () => W.union(['tie', 'answer', 'principle'], W.union(A.def.uses(A.P), B.def.uses(B.P))),
        duration: () => D,
        phases: () => W.fractions(list),
        numbers: () => Object.assign({ left: (sw) => (sw ? right : left), right: (sw) => (sw ? left : right) }, W.numbers('a.', nA)),
        out: (P2, po) => A.def.out(A.P, po),
        aspects: (P2, po) => !!(A.def.aspects && A.def.aspects(A.P, po)),
        controls: () => [{ key: 'mirror', kind: 'toggle', default: false, jumpPhase: 'align', label: 'Mirror the halves', question: 'Swap the two halves: does any counted number change?',
          on: 'B | A', off: 'A | B', result: (v) => (v ? 'B left, A right' : 'A left, B right') + ' · ' + fmtV(left, P.unit, P.decimals) + ' and ' + fmtV(right, P.unit, P.decimals) + ' either way' }]
          .concat(W.controls('a.', A.def, A.P)),
        audit: () => {
          const msgs = [], a = A.def.audit(A.P) || {}, b = B.def.audit(B.P) || {};
          if (!a.ok) msgs.push('A: ' + a.msg); if (!b.ok) msgs.push('B: ' + b.msg);
          const keys = [...new Set(Object.keys(A.P).concat(Object.keys(B.P)))].filter(k => JSON.stringify(A.P[k]) !== JSON.stringify(B.P[k]));
          if (keys.length !== 1 || keys[0] !== P.vary.param) msgs.push('A and B must differ in exactly "' + P.vary.param + '" (differ in: ' + (keys.join(', ') || 'nothing') + ')');
          const sw = [W.read(nB, Object.assign({ scale: P.scale }, P.read)).value, W.read(nA, Object.assign({ scale: P.scale }, P.read)).value];
          if (sw[0] !== right || sw[1] !== left) msgs.push('equivariance: a derived number changed under the swap');
          if (!Number.isFinite(left) || !Number.isFinite(right)) msgs.push('a half has no derivable answer');
          else if (left === right) msgs.push('the halves give the same answer: nothing to contrast');
          if (s * 15 < 6.5) msgs.push('halves too small to read (type < 13 px at 1080p)');
          return { ok: !msgs.length, msg: msgs.join('; '), note: [a.note, b.note, 'contrast: ' + P.vary.param + ' → ' + fmtV(left, P.unit, P.decimals) + ' | ' + fmtV(right, P.unit, P.decimals) + ' (scale ' + s.toFixed(2) + ')'].filter(Boolean).join(' · ') };
        },
        honesty: () => ['held fixed: everything but ' + P.vary.param + ' (one difference, same seed)'].concat(W.union(A.def.honesty(A.P), B.def.honesty(B.P)), P.notes),

        build(svg, ctx) {
          const K = ctx.K, S = (ctx.S = {}), ink = ctx.base('ink'), dim = ctx.base('dim'), tieC = ctx.role('tie'), aC = ctx.role('answer');
          const Lw = (S.Lw = ctx.lay.wide);
          const poOf = () => (P.hideLabel ? PO.with(ctx.po, { label: '' }) : ctx.po);
          S.gL = K.el('g', null, ctx.root('left')); S.gR = K.el('g', null, ctx.root('right'));
          if (Lw) {
            ctx.kids = {
              a: ctx.sub('a', A, { parent: S.gL, po: poOf(), seed: 'h' }),
              a2: ctx.sub('a2', A, { parent: S.gR, po: poOf(), seed: 'h' }),
              b: ctx.sub('b', B, { parent: S.gR, po: poOf(), seed: 'h' }),
            };
          } else {
            const H = (S.H = halvesOf(ctx.lay)), lab = ctx.lay.fs.label;
            const inner = (h) => ({ x0: h.x0, y0: h.y0 + 44 + lab * 1.4, x1: h.x1, y1: h.y1, w: h.w, h: h.h - 44 - lab * 1.4 });
            const po = (h) => { const b = inner(h), g = root.Layout.gridSide(ctx.po.geom.n || 1000, Object.assign({}, b, { x0: b.x0 + 40 }), h.w - 520);
              return PO.refit(poOf(), { cols: g.cols, pitch: g.pitch, x0: g.x0, y0: g.y0, r: g.r }); };
            const sl = (h) => ctx.lay.sub({ F: h, mode: 'side' });
            ctx.kids = {
              a: ctx.sub('a', A, { parent: S.gL, po: po(H.A), seed: 'h', lay: sl(H.A) }),
              a2: ctx.sub('a2', A, { parent: S.gR, po: po(H.B), seed: 'h', lay: sl(H.B) }),
              b: ctx.sub('b', B, { parent: S.gR, po: po(H.B), seed: 'h', lay: sl(H.B) }),
            };
          }
          A.def.build(svg, ctx.kids.a, A.P); A.def.build(svg, ctx.kids.a2, A.P); B.def.build(svg, ctx.kids.b, B.P);
          /* the wipe: two clip rects (16:9: the inner's own coordinates; portrait: the bottom half, absolute) */
          const defs = K.el('defs', null, ctx.g), id = 'cs' + ctx.k;
          const clip = (nm) => { const c = K.el('clipPath', { id: id + nm, clipPathUnits: 'userSpaceOnUse' }, defs);
            return Lw ? K.el('rect', { x: bx.x0 - 20, y: -50, width: 0, height: 700 }, c) : K.el('rect', { x: S.H.B.x0 - 20, y: S.H.B.y0 - 8, width: 0, height: S.H.B.h + 16 }, c); };
          S.clipB = clip('b'); S.clipA = clip('a');
          ctx.kids.b.g.setAttribute('clip-path', 'url(#' + id + 'b)'); ctx.kids.a2.g.setAttribute('clip-path', 'url(#' + id + 'a)');
          S.wipeLine = K.el('line', { stroke: aC.css, 'stroke-width': Lw ? 1.2 : 2, opacity: 0 }, ctx.root('right'));
          const g = ctx.root('foot');
          if (Lw) {
            /* tags: the varied parameter on each half */
            const ty = P.top + (bx.y1 - bx.y0) * s + 24;   // tags sit under the halves: the space above belongs to the tie
            S.tagL = K.tx(g, P.vary.tagA || 'A', HALF.L.x + 6, ty, { size: 15, fill: ink.css, op: 0 });
            S.tagR = K.tx(g, P.vary.tagA || 'A', HALF.R.x + 6, ty, { size: 15, fill: ink.css, op: 0 });
            S.tagRB = K.tx(g, P.vary.tagB || 'B', HALF.R.x + 6, ty, { size: 15, fill: ink.css, op: 0 });
            S.divider = K.el('line', { x1: 480, x2: 480, y1: P.top - 6, y2: P.top + (bx.y1 - bx.y0) * s, stroke: ctx.base('line').css, 'stroke-width': 1, opacity: 0 }, g);
            /* align: a tie between matched anchors; differ: brackets on both answers and a ≠ */
            S.tie = K.el('path', { fill: 'none', stroke: tieC.css, 'stroke-width': 1.2, 'stroke-dasharray': '3 4', opacity: 0 }, g);
            S.tieDots = [K.el('circle', { r: 4, fill: 'none', stroke: tieC.css, 'stroke-width': 1.2, opacity: 0 }, g), K.el('circle', { r: 4, fill: 'none', stroke: tieC.css, 'stroke-width': 1.2, opacity: 0 }, g)];
            S.tieLab = K.tx(g, P.align.line || 'the same', 480, 0, { size: 13, ls: 0.5, fill: tieC.css, anchor: 'middle', op: 0 });
            S.dBox = [0, 1].map(() => K.el('rect', { rx: 6, fill: 'none', stroke: aC.css, 'stroke-width': 1.4, opacity: 0 }, g));
            S.neq = K.tx(g, '≠', 480, 0, { size: 26, weight: 700, fill: aC.css, anchor: 'middle', op: 0 });
            S.dLab = K.tx(g, fill(P.differ.line), 480, 452, { size: 15, fill: aC.css, anchor: 'middle', op: 0 });
            S.chip = K.chip(g, P.principle.term + '  ·  ' + P.principle.line, 480, 486, ctx.role('principle').css);
          } else {
            const H = S.H, F = ctx.lay.F, lab = ctx.lay.fs.label, tagY = (h) => h.y0 + 30;
            const tx0 = F.x0 + 24;   // inside the lane: the stacked composition spans ≤ 832 u (crops keep the 28 px floor)
            S.tagL = K.tx(g, P.vary.tagA || 'A', tx0, tagY(H.A), { size: lab, ls: 0.6, fill: ink.css, op: 0 });
            S.tagR = K.tx(g, P.vary.tagA || 'A', tx0, tagY(H.B), { size: lab, ls: 0.6, fill: ink.css, op: 0 });
            S.tagRB = K.tx(g, P.vary.tagB || 'B', tx0, tagY(H.B), { size: lab, ls: 0.6, fill: ink.css, op: 0 });
            [S.tagL, S.tagR, S.tagRB].forEach(e => K.fitLine(e, e.textContent, F.w - 24));
            S.tieLab = K.tx(g, P.align.line || 'the same', F.x0 + 44, H.midY + lab * 0.36, { size: lab, ls: 0.3, fill: tieC.css, op: 0 });
            const tlw = K.tw(S.tieLab);
            S.divider = K.el('line', { x1: F.x0 + 44 + tlw + 18, x2: F.x1, y1: H.midY, y2: H.midY, stroke: ctx.base('line').css, 'stroke-width': 1.4, opacity: 0 }, g);
            S.tie = K.el('path', { fill: 'none', stroke: tieC.css, 'stroke-width': 2, 'stroke-dasharray': '5 6', opacity: 0 }, g);
            S.tieDots = [0, 1].map(() => K.el('circle', { r: 7, fill: 'none', stroke: tieC.css, 'stroke-width': 2, opacity: 0 }, g));
            S.dBox = [0, 1].map(() => K.el('rect', { rx: 10, fill: 'none', stroke: aC.css, 'stroke-width': 2.4, opacity: 0 }, g));
            S.neq = K.tx(g, '≠', 480, 0, { size: 48, weight: 700, fill: aC.css, anchor: 'middle', op: 0 });
            S.dLab = K.tx(g, '', 480, ctx.lay.foot.y, { size: lab, fill: aC.css, anchor: 'middle', op: 0 }); S.dLab.setAttribute('data-role', 'foot');
            K.fitLine(S.dLab, fill(P.differ.line), ctx.lay.foot.x1 - ctx.lay.foot.x0, { up: true });
            S.chip = K.chip(g, P.principle.term + '  ·  ' + P.principle.line, 480, K.footY(486), ctx.role('principle').css);
          }
        },

        render(lt, ctx) {
          const K = ctx.K, S = ctx.S, it = clock(lt), Ly = S.Lw ? layout(lt, ctx) : layoutP(lt, ctx, S.H), kids = ctx.kids;
          const footOut = 1 - ctx.go(T('align'), 0.5);   // the halves' own foot lines and chips step back: the contrast names last
          [['a', A], ['a2', A], ['b', B]].forEach(([k, X]) => { W.step(kids[k], it, ctx); X.def.render(it, kids[k], X.P); K.setOp(kids[k].root('foot'), footOut); });
          S.gL.setAttribute('transform', xfm(Ly.Lp)); S.gR.setAttribute('transform', xfm(Ly.Rp));
          K.show(S.gR, Ly.rightO);
          if (S.Lw) {
            S.clipB.setAttribute('width', Math.max(0, Ly.wx - (bx.x0 - 20)).toFixed(1));
            S.clipA.setAttribute('x', Ly.wx.toFixed(1)); S.clipA.setAttribute('width', Math.max(0, bx.x1 + 40 - Ly.wx).toFixed(1));
            const wl = map(Ly.Rp, { x: Ly.wx, y: bx.y0 }), wl2 = map(Ly.Rp, { x: Ly.wx, y: bx.y1 });
            S.wipeLine.setAttribute('x1', wl.x); S.wipeLine.setAttribute('x2', wl2.x); S.wipeLine.setAttribute('y1', wl.y); S.wipeLine.setAttribute('y2', wl2.y);
          } else {
            const HB = S.H.B;
            S.clipB.setAttribute('width', Math.max(0, Ly.wx - (HB.x0 - 20)).toFixed(1));
            S.clipA.setAttribute('x', Ly.wx.toFixed(1)); S.clipA.setAttribute('width', Math.max(0, HB.x1 + 40 - Ly.wx).toFixed(1));
            const yy = Ly.mirror ? S.H.A : HB;
            S.wipeLine.setAttribute('x1', Ly.wx); S.wipeLine.setAttribute('x2', Ly.wx); S.wipeLine.setAttribute('y1', yy.y0); S.wipeLine.setAttribute('y2', yy.y1);
          }
          K.setOp(S.wipeLine, Ly.wipe > 0 && Ly.wipe < 1 ? 0.8 : 0);
          /* tags (the mirror swaps the halves; the numbers do not change) */
          if (S.Lw) { S.tagL.setAttribute('x', (Ly.mirror ? HALF.R.x : HALF.L.x) + 6); S.tagR.setAttribute('x', HALF.R.x + 6); S.tagRB.setAttribute('x', (Ly.mirror ? HALF.L.x : HALF.R.x) + 6); }
          else { const dy = S.H.B.y0 - S.H.A.y0; S.tagL.setAttribute('transform', Ly.mirror ? 'translate(0 ' + dy + ')' : ''); S.tagRB.setAttribute('transform', Ly.mirror ? 'translate(0 ' + -dy + ')' : ''); }
          K.setOp(S.tagL, ctx.go(ctx.label('split'), 0.5)); K.setOp(S.tagR, ctx.go(ctx.label('split'), 0.5) * (1 - ctx.go(T('flip') + 0.4, 0.4)) * (Ly.mirror ? 0 : 1));
          K.setOp(S.tagRB, ctx.go(ctx.label('rule'), 0.5));
          K.setOp(S.divider, ctx.go(0.8, 0.6) * 0.8);
          /* align: what is the same, first */
          const al = ctx.go(ctx.mark('same'), 0.8, 'rest'), alOut = 1 - 0.6 * ctx.go(T('differ'), 0.5);
          let pa, pb, da, db, bw, bh;
          const cue = ctx.cue('difference'), pulse = cue && lt >= cue.a && lt < cue.b && !ctx.rm ? 1 + 0.18 * Math.sin(Math.PI * (lt - cue.a) / (cue.b - cue.a)) : 1;
          if (S.Lw) {
            pa = map(Ly.Lp, P.align.at); pb = map(Ly.Rp, P.align.at);
            const top = P.align.arcY != null ? P.align.arcY : P.top - 56;
            S.tie.setAttribute('d', 'M' + pa.x.toFixed(1) + ' ' + pa.y.toFixed(1) + ' C ' + pa.x.toFixed(1) + ' ' + top + ', ' + pb.x.toFixed(1) + ' ' + top + ', ' + pb.x.toFixed(1) + ' ' + pb.y.toFixed(1));
            S.tieLab.setAttribute('y', (top + 2).toFixed(1));
            da = map(Ly.Lp, P.differ.at); db = map(Ly.Rp, P.differ.at);
            bw = (P.differ.w || 150) * Ly.Lp.s * pulse; bh = (P.differ.h || 80) * Ly.Lp.s * pulse;
          } else {
            const an = (k, pl) => { const a = kids[k].S.anch; const mp = (q) => ({ x: q.x + pl.tx, y: q.y + pl.ty }); return { same: mp(a.same), answer: mp(a.answer) }; };
            const qa = an('a', Ly.Lp), qb = an('b', Ly.Rp);
            pa = qa.same; pb = qb.same; da = qa.answer; db = qb.answer;
            const lx = pa.x - 12;   // the tie runs straight down the lane, inside the 832-u composition
            S.tie.setAttribute('d', 'M' + (pa.x - 10).toFixed(1) + ' ' + pa.y.toFixed(1) + ' H' + lx + ' V' + pb.y.toFixed(1) + ' H' + (pb.x - 10).toFixed(1));
            pa = { x: pa.x - 10, y: pa.y }; pb = { x: pb.x - 10, y: pb.y };
            bw = 240 * pulse; bh = 142 * pulse;
          }
          S.tie.setAttribute('pathLength', 1); S.tie.setAttribute('stroke-dasharray', al < 1 ? al.toFixed(3) + ' 1' : (S.Lw ? '0.012 0.012' : '0.01 0.012'));
          K.setOp(S.tie, (al > 0 ? 1 : 0) * alOut);
          S.tieDots[0].setAttribute('cx', pa.x); S.tieDots[0].setAttribute('cy', pa.y); S.tieDots[1].setAttribute('cx', pb.x); S.tieDots[1].setAttribute('cy', pb.y);
          S.tieDots.forEach(d => K.setOp(d, ctx.go(ctx.mark('same'), 0.3) * alOut));
          K.setOp(S.tieLab, ctx.go(ctx.label('same'), 0.5) * alOut);
          /* differ: the one difference, on both answers */
          const dp = ctx.go(ctx.mark('difference'), 0.5);
          [da, db].forEach((p, i) => { const r = S.dBox[i]; r.setAttribute('x', (p.x - bw / 2).toFixed(1)); r.setAttribute('y', (p.y - bh / 2).toFixed(1)); r.setAttribute('width', bw.toFixed(1)); r.setAttribute('height', bh.toFixed(1)); K.setOp(r, dp); });
          if (!S.Lw) S.neq.setAttribute('x', da.x.toFixed(1));
          S.neq.setAttribute('y', ((da.y + db.y) / 2 + (S.Lw ? 9 : 16)).toFixed(1)); K.setOp(S.neq, dp);
          const nameP = ctx.go(ctx.named(P.principle.term), 0.6);
          K.setOp(S.dLab, ctx.go(ctx.label('difference'), 0.5) * (1 - nameP));
          S.chip.set(nameP);
        },

        p5Layer: A.def.p5Layer ? {
          z: A.def.p5Layer.z, costMs: 3 * (A.def.p5Layer.costMs || 0), means: A.def.p5Layer.means + ' (both halves: one seed, one mark table)',
          setup(p, L, ctx) { const f = A.def.p5Layer.setup; if (f) { f(p, L, ctx.kids.a, A.P); f(p, L, ctx.kids.a2, A.P); B.def.p5Layer.setup(p, L, ctx.kids.b, B.P); } return null; },
          draw(p, lt, L, ctx) {
            const c = L.ctx, it = clock(lt), Sx = ctx.S, Ly = Sx.Lw ? layout(lt, ctx) : layoutP(lt, ctx, Sx.H), a0 = c.globalAlpha;
            const half = (pl, kid, X, x0, x1, alpha, y0, y1) => {
              if (alpha <= 0.002 || x1 <= x0) return;
              c.save(); c.translate(pl.tx, pl.ty); c.scale(pl.s, pl.s); c.globalAlpha = a0 * alpha;
              c.beginPath(); c.rect(x0, y0 == null ? -50 : y0, x1 - x0, y1 == null ? 700 : y1 - y0); c.clip();
              X.def.p5Layer.draw(p, it, L, kid, X.P); c.restore();
            };
            if (Sx.Lw) {
              half(Ly.Lp, ctx.kids.a, A, -2000, 3000, 1);
              half(Ly.Rp, ctx.kids.b, B, bx.x0 - 20, Ly.wx, Ly.rightO);
              half(Ly.Rp, ctx.kids.a2, A, Ly.wx, bx.x1 + 40, Ly.rightO);
            } else {
              const HB = Sx.H.B;
              half(Ly.Lp, ctx.kids.a, A, -2000, 3000, 1, -2000, 4000);
              half(Ly.Rp, ctx.kids.b, B, HB.x0 - 20, Ly.wx, Ly.rightO, HB.y0 - 8, HB.y1 + 8);
              half(Ly.Rp, ctx.kids.a2, A, Ly.wx, HB.x1 + 40, Ly.rightO, HB.y0 - 8, HB.y1 + 8);
            }
          },
        } : undefined,
      };
    },
  });
})();
