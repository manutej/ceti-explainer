/* ════════════════════════════════════════════════════════════════════
   modules/recap-retrieve — ask first, pause, answer from the persistent object, recap, return
   --------------------------------------------------------------------
   MODULE-OPERAD §14 (retrieve-once: Roediger & Karpicke 2006; re-see / the ladder return).
   The question is about content ≥ 30 s earlier (L13). The answer is never a literal:
   it is read off the PO by a canonical fn (chain: round(N0·r^k); axis: the pile under
   the asked anchor). Recap = 3–5 small glyphs of earlier frames (never a bullet list).
   Return = the opening instance re-seen with the new model.
   PO adapters: chain (line of k steps, a counted train) · axis (number line with anchored piles)
   Phases: ask .22 (countdown; "pause and answer") · answer .17 (payoff) · hold .09 · recap .30 · return .22
   Aspects: the grid figure composes itself at every aspect (portrait: the card spans the figure, the new city
   and its counted block sit under it, the arithmetic on two lines; recap cards stay three across; the return
   card spans the figure). The chain and axis figures have no portrait composition yet: compile FITs them.
   ──────────────────────────────────────────────────────────────────── */
(function () {
  const fmtN = (n) => Math.round(n).toLocaleString('en-US');
  const ASK = 5, ANS = 4, HOLD = 2, REC = 7, RET = 5, D = ASK + ANS + HOLD + REC + RET;

  const MODEL = {
    chain(P) { const M = P.model, series = Array.from({ length: M.k + 1 }, (_, i) => Math.round(M.N0 * Math.pow(M.r, i)));
      return { series, answer: series[M.k], share: Math.pow(M.r, M.k), fmt: (v) => fmtN(v) }; },
    grid(P) {   // Bayes as natural frequencies, counted: base × reliability (hits) and the false alarms
      const M = P.model, blue = Math.round(M.N * M.base), green = M.N - blue, hit = Math.round(blue * M.reliability), fa = Math.round(green * (1 - M.reliability));
      return { blue, green, hit, fa, kept: hit + fa, answer: 100 * hit / (hit + fa), exact: 100 * M.base * M.reliability / (M.base * M.reliability + (1 - M.base) * (1 - M.reliability)),
        fmt: (v) => Math.round(v) + ' %' };
    },
    axis(P) { const M = P.model, g = M.groups.find(x => x.anchor === M.ask);
      return { group: g, answer: g ? g.mean : NaN, fmt: (v) => Math.round(v) + ' %' }; },
  };
  const figOf = (P) => (P.model.N0 != null ? 'chain' : (P.model.base != null ? 'grid' : 'axis'));

  Module.define('recap-retrieve', {
    kind: 'scene',
    aspects: (P) => figOf(P) === 'grid',
    types: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
    evidence: 'PED #20 retrieve-once (Roediger & Karpicke 2006; Adesope 2017 g ≈ 0.61), #21 re-see; NAR device 9, 23',
    ports: { needs: ['instance', 'rule'], gives: ['retrieved'], consumes: [], po: { in: ['chain', 'axis', 'grid', 'track'], out: 'same' }, regions: ['body', 'foot', 'inset'] },
    params: {
      question: { type: 'string', required: true },
      answerKind: { type: 'enum', of: ['number', 'choice'], default: 'number' },
      options: { type: 'array', default: [] },
      model: { type: 'object', required: true },        // chain: {N0, r, k} · axis: {groups:[{anchor, mean, n, sd}], ask}
      recap: { type: 'array', required: true, len: [3, 5] },
      returnLines: { type: 'array', required: true },
      returnFigure: { type: 'bool', default: false },
      contentT: { type: 'num' },                        // when the question's content was shown (film seconds) — L13
      eyebrow: { type: 'string', default: 'RETRIEVE · FROM EARLIER' },
      foot: { type: 'object', default: {} },
      figure: { type: 'object', default: {} },          // labels for the figure (start, rate, axis…)
      notes: { type: 'array', default: [] },
    },
    uses: (P) => ['answer', 'card', 'neutralMark', 'returnInstance'].concat(figOf(P) === 'grid' ? ['witness', 'blueCab', 'greenCab'] : []),
    question: (P) => ({ contentT: P.contentT != null ? P.contentT : null, text: P.question }),
    duration: () => D,
    phases: () => [
      { id: 'ask', f: ASK / D, marks: [{ term: 'question', at: 0.2 }], labels: [{ term: 'question', at: 0.6 }] },
      { id: 'answer', f: ANS / D, payoff: true, cue: { target: 'answer', at: 0.2, dur: 0.8 }, shows: ['answer'] },
      { id: 'hold', f: HOLD / D, hold: true },
      { id: 'recap', f: REC / D },
      { id: 'return', f: RET / D, shows: ['answer'] },
    ],
    numbers: (P) => ({ answer: () => MODEL[figOf(P)](P).answer, model: () => MODEL[figOf(P)](P) }),
    controls: (P) => [P.answerKind === 'choice'
      ? { key: 'guess', kind: 'select', default: '', options: [['', 'choose…']].concat(P.options.map(o => [o, o])), jumpPhase: 'answer',
          label: 'Your answer', question: 'Answer before the film does: retrieval is the point.',
          result: (v) => (v ? (v === MODEL.axis(P).fmt(MODEL.axis(P).answer) ? 'right — ' : 'the film says ') + MODEL.axis(P).fmt(MODEL.axis(P).answer) : '') }
      : { key: 'guess', kind: 'number', default: '', jumpPhase: 'answer', label: 'Your answer', question: 'Answer before the film does: retrieval is the point.',
          result: (v) => { const m = MODEL[figOf(P)](P); return v === '' || v == null || Number.isNaN(+v) ? '' : 'the film’s answer: ' + m.fmt(m.answer) + ' (yours ' + fmtN(+v) + ')'; } }],
    audit: (P) => {
      const msgs = [], fig = figOf(P), m = MODEL[fig](P);
      if (!Number.isFinite(m.answer)) msgs.push('the answer is not derivable from the model');
      if (P.question.length > 90) msgs.push('question > 90 chars');
      if (fig === 'grid' && Math.abs(m.answer - m.exact) > 1) msgs.push('the counted grid answer drifts > 1 point from Bayes (rounding)');
      if (P.answerKind === 'choice' && !P.options.includes(m.fmt(m.answer))) msgs.push('the derived answer is not one of the options');
      P.recap.forEach((r, i) => { if (!r.glyph) msgs.push('recap ' + i + ' has no glyph (a recap is pictures, not a list)'); if ((r.line || '').length > 48) msgs.push('recap ' + i + ' line > 48 chars'); });
      return { ok: !msgs.length, msg: msgs.join('; '), note: 'recap-retrieve ' + fig + ': answer ' + m.fmt(m.answer) };
    },
    honesty: (P) => ['one retrieval question is a small dose; its benefit is measured after a delay'].concat(P.notes),
    expertise: 'novice',

    build(svg, ctx, P) {
      const K = ctx.K, S = (ctx.S = {}), g = ctx.root('body'), ink = ctx.base('ink'), dim = ctx.base('dim'), line = ctx.base('line');
      const cardC = ctx.role('card'), ansC = ctx.role('answer'), Lw = ctx.lay.wide, F = ctx.lay.F, lab = Lw ? 13 : ctx.lay.fs.label;
      /* the question card */
      S.card = K.el('g', { opacity: 0 }, g);
      if (Lw) {
        S.cardBox = K.el('rect', { x: 60, y: 110, width: 840, height: 84, rx: 10, fill: 'none', stroke: cardC.css, 'stroke-width': 1.2, 'stroke-dasharray': '5 4' }, S.card);
        S.eb = K.tx(S.card, P.eyebrow, 84, 134, { size: 13, ls: 3, fill: cardC.css });
        S.q = K.tx(S.card, P.question, 84, 172, { size: 25, cls: 'd', fill: ink.css });
        K.fit(S.q, 690);
        S.ring = K.countRing(S.card, 862, 152, 20);
        S.pause = K.tx(g, 'pause and answer', 900, 214, { size: 13, ls: 1.5, fill: dim.css, anchor: 'end', op: 0 });
        S.yours = K.tx(g, '', 84, 214, { size: 13, ls: 1, fill: cardC.css, op: 0 });
        S.ans = K.tx(S.card, '', 880, 172, { size: 26, weight: 700, fill: ansC.css, anchor: 'end', op: 0 });
        S.cardY1 = 194;
      } else {
        const x = F.x0, y = F.y0, w = F.w, qs = 36, lh = 42;
        S.cardBox = K.el('rect', { x, y, width: w, height: 100, rx: 16, fill: 'none', stroke: cardC.css, 'stroke-width': 1.8, 'stroke-dasharray': '8 6' }, S.card);
        S.eb = K.tx(S.card, P.eyebrow, x + 26, y + 44, { size: lab, ls: 1.2, fill: cardC.css });
        K.fitLine(S.eb, P.eyebrow, w - 130);
        const qw = K.wrap(S.card, P.question, x + 26, y + 96, w - 52, lh, { size: qs, cls: 'd', fill: ink.css });
        S.q = qw.e;
        const h = 96 + (qw.n - 1) * lh + 92;
        S.cardBox.setAttribute('height', h);
        S.ring = K.countRing(S.card, x + w - 46, y + 46, 24);
        S.cardY1 = y + h;
        S.pause = K.tx(g, 'pause and answer', x + w, y + h + 40, { size: lab, ls: 0.8, fill: dim.css, anchor: 'end', op: 0 });
        S.yours = K.tx(g, '', x, y + h + 40, { size: lab, ls: 0.6, fill: cardC.css, op: 0 });
        S.ans = K.tx(S.card, '', x + w - 26, y + h - 26, { size: 52, weight: 700, fill: ansC.css, anchor: 'end', op: 0 });
      }
      /* figure (the PO, re-shown) */
      S.fig = K.el('g', { opacity: 0 }, g);
      FIG[figOf(P)].build(ctx, P, S, S.fig);
      /* recap cards */
      S.rec = P.recap.map((r, i) => {
        const n = P.recap.length, cg = K.el('g', { opacity: 0 }, g);
        if (Lw) {
          const w = 840 / n, x = 60 + w * i;
          K.tx(cg, String(i + 1).padStart(2, '0'), x + 12, 250, { size: 13, ls: 2, fill: cardC.css, weight: 700 });
          K.el('rect', { x: x + 12, y: 262, width: w - 36, height: 96, rx: 6, fill: 'none', stroke: line.css, 'stroke-width': 1 }, cg);
          K.glyph(cg, r.glyph, x + 12 + (w - 36) / 2 - 60, 274, 120, 72, ink.css);
          K.wrap(cg, r.line, x + 12, 384, w - 40, 20, { size: 15, fill: ink.css });
        } else {
          const gap = 22, w = (F.w - gap * (n - 1)) / n, x = F.x0 + (w + gap) * i, y = F.y0 + 30;
          K.tx(cg, String(i + 1).padStart(2, '0'), x, y + 10, { size: lab, ls: 1.5, fill: cardC.css, weight: 700 });
          K.el('rect', { x, y: y + 30, width: w, height: 176, rx: 10, fill: 'none', stroke: line.css, 'stroke-width': 1.6 }, cg);
          K.glyph(cg, r.glyph, x + w / 2 - 80, y + 30 + 40, 160, 96, ink.css);
          K.wrap(cg, r.line, x, y + 250, w - 4, 35, { size: lab, cls: 's', fill: ink.css });
        }
        return cg;
      });
      /* return card */
      S.retG = K.el('g', { opacity: 0 }, g);
      const RC = Lw ? (P.returnFigure ? { x: 60, y: 110, w: 840 } : { x: 200, y: 232, w: 560 }) : { x: F.x0, y: F.y0 + 40, w: F.w };
      const lh = Lw ? 26 : 50, h = (Lw ? 62 : 104) + P.returnLines.length * lh, rC = ctx.role('returnInstance');
      K.el('rect', { x: RC.x, y: RC.y, width: RC.w, height: h, rx: Lw ? 10 : 16, fill: 'none', stroke: rC.css, 'stroke-width': Lw ? 1.2 : 2 }, S.retG);
      K.tx(S.retG, P.figure.returnEyebrow || 'THE OPENING CASE, AGAIN', RC.x + (Lw ? 24 : 30), RC.y + (Lw ? 26 : 48), { size: lab, ls: Lw ? 3 : 1.5, fill: rC.css });
      S.retLines = P.returnLines.map((l, i) => {
        const ok = typeof l === 'object' && l.ok, y = RC.y + (Lw ? 58 : 108) + i * lh;
        const t = K.tx(S.retG, typeof l === 'string' ? l : l.text, RC.x + (Lw ? 24 : 30), y, { size: Lw ? (P.returnFigure ? 18 : 16) : 32, cls: Lw ? (P.returnFigure ? 'd' : 'm') : 's', fill: ok ? rC.css : ink.css, op: 0 });
        if (!Lw) { let fs = 32; while (K.tw(t) > RC.w - 100 && fs > 28) { fs -= 1; t.setAttribute('font-size', fs); } }
        if (ok) K.Check(S.retG, RC.x + RC.w - (Lw ? 30 : 44), y - (Lw ? 5 : 10), Lw ? 8 : 14, rC.css);
        return t;
      });
      S.foot = K.foot(ctx.root('foot'), 486);
      void dim;
    },

    render(lt, ctx, P) {
      const K = ctx.K, S = ctx.S, T = ctx.T, ex = ctx.ex, m = MODEL[figOf(P)](P);
      const cardC = ctx.role('card');
      /* ask: the card draws (dashed, like a commit card), the question rises, a 3-2-1 ring */
      K.setOp(S.card, ctx.go(0.1, 0.6, 'defer') * (1 - 0.55 * ctx.go(T.recap[0], 0.6)) * (1 - ctx.go(T.return[0], 0.5)));
      K.tr(S.q, 0, (1 - ctx.go(ctx.label('question'), 0.6)) * 8); K.setOp(S.q, ctx.go(ctx.label('question'), 0.6));
      const c0 = 1.4, cp = ex.clamp((lt - c0) / 3), live = lt >= c0 && lt < c0 + 3.2;
      S.ring.set(cp, live ? Math.max(1, 3 - Math.floor(lt - c0)) : '', cardC.css, live ? 1 : 0);
      K.setOp(S.pause, ctx.go(1.2, 0.4) * (1 - ctx.go(T.answer[0], 0.4)) * 0.9);
      const guess = ctx.ctl('guess', '');
      K.setText(S.yours, guess !== '' && guess != null ? 'YOUR ANSWER · ' + (P.answerKind === 'number' && !Number.isNaN(+guess) ? fmtN(+guess) : guess) : '');
      K.setOp(S.yours, guess !== '' && guess != null ? ctx.go(c0, 0.4) * (1 - ctx.go(T.recap[0], 0.5)) : 0);
      /* answer: read off the PO (the figure's own count), then written on the card */
      const ap = ctx.go(T.answer[1] - 0.6, 0.5);
      K.setText(S.ans, '→ ' + m.fmt(m.answer).replace(' %', '%')); K.setOp(S.ans, ap);
      const figVis = ctx.go(0.4, 0.6, 'defer') * (1 - ctx.go(T.recap[0], 0.6, 'collect')) + (P.returnFigure ? ctx.go(T.return[0] + 0.4, 0.6) : 0);
      K.setOp(S.fig, figVis);
      FIG[figOf(P)].render(lt, ctx, P, S, m);
      /* recap: one glyph card at a time */
      S.rec.forEach((cg, i) => { const a = T.recap[0] + 0.6 + i * 1.3, p = ctx.go(a, 0.6); K.setOp(cg, p * (1 - ctx.go(T.return[0], 0.5))); K.tr(cg, 0, (1 - p) * 12); });
      /* return: the opening instance, re-seen */
      K.setOp(S.retG, ctx.go(T.return[0] + 0.5, 0.6));
      S.retLines.forEach((t, i) => K.setOp(t, ctx.go(T.return[0] + 0.8 + i * 0.35, 0.4)));
      /* foot */
      const F = P.foot, at = { ask: 1.2, answer: T.answer[1] - 0.4, recap: T.recap[0] + 0.6, return: T.return[0] + 1.0 };
      const cur = ['return', 'recap', 'answer', 'ask'].find(id => lt >= at[id]);
      const fill = (s) => s.split('{answer}').join(m.fmt(m.answer)).split('{share}').join(m.share != null ? (m.share * 100).toFixed(1) + ' %' : '');
      S.foot.set(cur && F[cur] ? fill(F[cur]) : '', cur ? ctx.go(at[cur], 0.4, 'defer') * 0.95 : 0);
    },
  });

  const FIG = {};
  /* ---- chain: k steps on one line; a counted train passes each junction ---- */
  FIG.chain = {
    build(ctx, P, S, g) {
      const K = ctx.K, G = ctx.po.geom, dim = ctx.base('dim'), ink = ctx.base('ink'), ans = ctx.role('answer'), M = P.model, m = MODEL.chain(P);
      S.line = K.Rails(g, [K.P(G.x0, G.y), K.P(G.x1, G.y)], dim.a(0.7));
      S.js = G.xs.slice(0, M.k).map((x, i) => {
        const jg = K.el('g', null, g);
        K.el('line', { x1: x, y1: G.y - 6, x2: x, y2: G.y + 6, stroke: dim.css, 'stroke-width': 1.2 }, jg);
        K.el('path', { d: 'M' + x + ' ' + G.y + ' q 14 0 22 26', fill: 'none', stroke: dim.a(0.5), 'stroke-width': 1 }, jg);
        const t = K.tx(jg, fmtN(m.series[i + 1]), x, G.y - 18, { size: 13, fill: ink.css, anchor: 'middle', op: 0 });
        return { x, t };
      });
      S.n0 = K.tx(g, fmtN(M.N0), G.x0 - 10, G.y + 5, { size: 15, fill: ink.css, anchor: 'end' });
      S.rate = K.tx(g, P.figure.rate || ('×' + M.r + ' per step'), G.x0, G.y + 44, { size: 13, ls: 1, fill: dim.css });
      S.car = K.Car(g, ans.css, 16, 6);
      S.big = K.tx(g, '', G.x1, G.y + 64, { size: 34, weight: 700, fill: ans.css, anchor: 'end', op: 0 });
      S.sub = K.tx(g, '', G.x1, G.y + 88, { size: 13, ls: 1, fill: dim.css, anchor: 'end', op: 0 });
    },
    render(lt, ctx, P, S, m) {
      const K = ctx.K, T = ctx.T, G = ctx.po.geom, M = P.model;
      S.line.draw(ctx.go(0.4, 0.9));
      const a = T.answer[0] + 0.3, per = (ANS - 1.4) / M.k, u = ctx.rm ? (lt >= a + per * M.k ? 1 : 0) : ctx.ex.clamp((lt - a) / (per * M.k));
      const x = G.x0 + (S.js[M.k - 1].x - G.x0) * u;
      K.placeCar(S.car, { x, y: G.y, a: 0 }, lt >= a && lt < T.recap[0] + 0.6 ? 1 : 0);
      let passed = 0; S.js.forEach((j, i) => { const on = x >= j.x - 0.5; if (on) passed = i + 1; K.setOp(j.t, on ? 1 : 0); j.t.setAttribute('fill', i === M.k - 1 && on ? ctx.role('answer').css : ctx.base('ink').css); });
      K.setText(S.big, fmtN(passed ? m.series[passed] : M.N0)); K.setOp(S.big, lt >= a ? 1 : 0);
      K.setText(S.sub, passed === M.k ? (m.share * 100).toFixed(1) + ' % ARRIVE' : 'STILL RUNNING'); K.setOp(S.sub, lt >= a ? 0.9 : 0);
    },
  };

  /* ---- axis: a number line, two anchors, and the piles of estimates they pulled ---- */
  FIG.axis = {
    build(ctx, P, S, g) {
      const K = ctx.K, AX = PO.get('axis'), G = ctx.po.geom, sx = AX.map(G).sx, y = G.box.y1, dim = ctx.base('dim'), ink = ctx.base('ink');
      const ans = ctx.role('answer'), mk = ctx.role('neutralMark');
      S.sx = sx; S.y = y;
      S.line = K.Rails(g, [K.P(G.box.x0, y), K.P(G.box.x1, y)], dim.a(0.8));
      [0, 25, 50, 75, 100].forEach(v => { K.el('line', { x1: sx(v), y1: y, x2: sx(v), y2: y + 6, stroke: dim.css, 'stroke-width': 1 }, g); K.tx(g, String(v), sx(v), y + 24, { size: 13, fill: dim.css, anchor: 'middle' }); });
      K.tx(g, G.x.label, G.box.x1, y + 50, { size: 13, ls: 2, fill: dim.css, anchor: 'end' });
      /* the piles: seeded, binned by 2.5 points, stacked dots (illustrative spread around the published mean) */
      const rng = ctx.rng('piles'), bins = {};   // one histogram: the second pile stacks on the first where they meet
      S.groups = P.model.groups.map((gr, gi) => {
        const gg = K.el('g', null, g), n = gr.n || 24, sd = gr.sd || 7;
        const dots = [];
        for (let i = 0; i < n; i++) {
          let z = 0; for (let k = 0; k < 6; k++) z += rng(); z = (z - 3) / Math.sqrt(0.5);   // ≈ N(0,1), Irwin–Hall
          const v = Math.max(1, Math.min(99, gr.mean + z * sd)), b = Math.round(v / 2.5) * 2.5; bins[b] = (bins[b] || 0) + 1;
          dots.push(K.el('circle', { cx: sx(b), cy: y - 8 - (bins[b] - 1) * 9, r: 3.4, fill: mk.css, opacity: 0 }, gg));
        }
        const anchorG = K.el('g', { opacity: 0 }, g);
        K.glyph(anchorG, 'wheel', sx(gr.anchor) - 16, G.box.y0 - 6, 32, 32, ink.css);
        K.tx(anchorG, 'wheel ' + gr.anchor, sx(gr.anchor), G.box.y0 + 46, { size: 13, ls: 1, fill: ink.css, anchor: 'middle' });
        const link = K.el('path', { d: 'M' + sx(gr.anchor) + ' ' + (G.box.y0 + 56) + ' C ' + sx(gr.anchor) + ' ' + (y - 70) + ', ' + sx(gr.mean) + ' ' + (G.box.y0 + 60) + ', ' + sx(gr.mean) + ' ' + (y - 70),
          fill: 'none', stroke: ans.css, 'stroke-width': 1.2, 'stroke-dasharray': '3 4', opacity: 0 }, g);
        const meanL = K.el('line', { x1: sx(gr.mean), y1: y - 62, x2: sx(gr.mean), y2: y + 4, stroke: ans.css, 'stroke-width': 1.6, opacity: 0 }, g);
        const meanT = K.tx(g, 'mean ' + gr.mean + ' %', sx(gr.mean) + 8, y - 64, { size: 15, weight: 700, fill: ans.css, op: 0 });
        return { gr, gg, dots, anchorG, link, meanL, meanT, asked: gr.anchor === P.model.ask, gi };
      });
    },
    render(lt, ctx, P, S, m) {
      const K = ctx.K, T = ctx.T, a = T.answer[0];
      S.line.draw(ctx.go(0.4, 0.9));
      S.groups.forEach(G => {
        K.setOp(G.anchorG, ctx.go(0.8 + G.gi * 0.3, 0.5));
        const ask = G.asked, rise = ctx.go(a + 0.2 + (ask ? 0 : 0.5), 1.2, 'defer'), dimK = ask ? 0 : ctx.go(a + 1.6, 0.5);
        G.dots.forEach((d, i) => { const p = ctx.ex.clamp(rise * G.dots.length - i); K.setOp(d, p * (1 - 0.6 * dimK)); d.setAttribute('fill', ask && lt >= a + 1.2 ? ctx.role('answer').css : ctx.role('neutralMark').css); });
        const lk = ask ? ctx.go(a + 1.2, 0.6) : (P.returnFigure ? ctx.go(T.return[0] + 1.0, 0.6) * 0.6 : 0);
        K.setOp(G.link, lk);
        const mo = ask ? ctx.go(a + 1.8, 0.5) : (P.returnFigure ? ctx.go(T.return[0] + 1.4, 0.5) : 0);
        K.setOp(G.meanL, mo); K.setOp(G.meanT, mo);
        const col = ask ? ctx.role('answer').css : ctx.base('ink').css; G.meanL.setAttribute('stroke', col); G.meanT.setAttribute('fill', col); G.link.setAttribute('stroke', col);
        if (!ask && lt >= T.return[0]) G.dots.forEach(d => K.setOp(d, ctx.go(T.return[0] + 0.6, 0.6) * 0.9));
      });
      void m;
    },
  };

  /* ---- grid: a fresh city, counted — the witness's "Blue" calls gather into the denominator ---- */
  FIG.grid = {
    build(ctx, P, S, g) {
      const K = ctx.K, m = MODEL.grid(P), M = P.model, rng = ctx.rng('recap-grid'), ink = ctx.base('ink'), dim = ctx.base('dim');
      const bC = ctx.role('blueCab'), hC = ctx.role('greenCab'), wC = ctx.role('witness'), ans = ctx.role('answer');
      const Lw = ctx.lay.wide, F = ctx.lay.F, lab = Lw ? 13 : ctx.lay.fs.label;
      let G, B;
      if (Lw) { G = { cols: 50, pitch: 6.4, x0: 104, y0: 266 }; B = { cols: 20, pitch: 9, x0: 520, y0: 266 }; }
      else {
        const top = S.cardY1 + 90, gp = Math.min(11, (F.w * 0.5) / 39, (F.y1 - top - 84) / 24), gx0 = F.x0 + 8;
        G = { cols: 40, pitch: gp, x0: gx0, y0: top };
        const bx0 = gx0 + 39 * gp + 52, bp = Math.min(14, (F.x1 - bx0 - 160) / 19);
        B = { cols: 20, pitch: bp, x0: bx0, y0: top };
      }
      const dr = Lw ? 1 : Math.max(1, G.pitch / 6.4 * 0.85);
      const pick = (n, k) => { const a = Array.from({ length: n }, (_, i) => i); for (let i = n - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return new Set(a.slice(0, k)); };
      const hitSet = pick(m.blue, m.hit), faSet = pick(m.green, m.fa);
      S.gd = { G, B, dots: [] }; let kept = 0;
      const order = [];   // the block: the Blue hits first, then the false alarms
      for (let i = 0; i < M.N; i++) { const filled = i < m.blue, says = filled ? hitSet.has(i) : faSet.has(i - m.blue);
        const from = { x: G.x0 + (i % G.cols) * G.pitch, y: G.y0 + Math.floor(i / G.cols) * G.pitch };
        const e = K.el('circle', { cx: from.x, cy: from.y, r: (filled ? 1.9 : 1.6) * dr, fill: filled ? bC.css : 'none', stroke: filled ? 'none' : hC.css, 'stroke-width': Lw ? 0.9 : 1.2 }, g);
        const d = { e, from, filled, says, ring: null }; S.gd.dots.push(d); if (says) order.push(d); }
      order.sort((a, b) => (b.filled - a.filled));
      order.forEach((d, n) => { d.to = { x: B.x0 + (n % B.cols) * B.pitch, y: B.y0 + Math.floor(n / B.cols) * B.pitch }; d.k = n / order.length; kept++;
        d.ring = K.el('circle', { cx: d.from.x, cy: d.from.y, r: 3.3 * dr, fill: 'none', stroke: wC.css, 'stroke-width': Lw ? 0.8 : 1.2, opacity: 0 }, g); });
      S.gd.order = order;
      S.gLab = K.tx(g, (P.figure.city || 'A NEW CITY') + ' · ' + m.blue + ' BLUE · ' + fmtN(m.green) + ' GREEN', G.x0, G.y0 - (Lw ? 18 : 30), { size: lab, ls: Lw ? 1.5 : 0.6, fill: dim.css });
      const rowsF = Math.ceil(m.hit / B.cols), rowsK = Math.ceil(kept / B.cols), bx1 = B.x0 + (B.cols - 1) * B.pitch;
      S.brF = K.bracket(g); S.brAll = K.bracket(g);
      S.gd.yF = B.y0 + (rowsF - 1) * B.pitch; S.gd.yK = B.y0 + (rowsK - 1) * B.pitch; S.gd.bx1 = bx1;
      const nl = Lw ? 15 : lab, lx = bx1 + (Lw ? 22 : 30);
      S.nF = K.tx(g, m.hit + ' Blue', lx, Lw ? (B.y0 + S.gd.yF) / 2 + 5 : Math.max(B.y0 + nl * 0.7, (B.y0 + S.gd.yF) / 2 + nl * 0.35), { size: nl, fill: ans.css, op: 0 });
      S.nAll = K.tx(g, 'of ' + m.kept, lx, Lw ? S.gd.yK - 2 : Math.max(S.gd.yK - 2, S.gd.yF + nl * 1.6), { size: nl, fill: dim.css, op: 0 });
      const t1 = m.blue + ' × ' + M.reliability + ' = ' + m.hit, t2 = fmtN(m.green) + ' × ' + (Math.round((1 - M.reliability) * 100) / 100) + ' = ' + m.fa,
        t3 = m.hit + ' ÷ (' + m.hit + ' + ' + m.fa + ') = ' + m.fmt(m.answer);
      if (Lw) {
        S.big = K.tx(g, m.fmt(m.answer).replace(' %', '%'), 800, (B.y0 + S.gd.yK) / 2 + 14, { size: 40, weight: 700, fill: ans.css, op: 0 });
        S.bayes = K.tx(g, t1 + '   ·   ' + t2 + '   ·   ' + t3, 104, 438, { size: 15, fill: ink.css, op: 0 });
      } else {   // portrait: the number under the block; the arithmetic on two lines under the city
        S.big = K.tx(g, '', B.x0, B.y0, { op: 0 });   // portrait: the card's own "→ 17%" is the number (one number, one size per frame)
        S.bayes = K.el('g', { opacity: 0 }, g);
        const by = Math.max(G.y0 + 24 * G.pitch, S.gd.yK) + 46;
        K.tx(S.bayes, t1 + '   ·   ' + t2, G.x0 - 2, by, { size: lab, fill: ink.css });
        K.tx(S.bayes, t3, G.x0 - 2, by + 37, { size: lab, fill: ink.css });
      }
    },
    render(lt, ctx, P, S, m) {
      const K = ctx.K, T = ctx.T, ex = ctx.ex, a = T.answer[0], D = S.gd;
      const rings = ctx.go(a + 0.1, 0.5), gather = (d) => (ctx.rm ? (lt >= a + 2.4 ? 1 : 0) : ctx.E.rest(ex.prog(lt, a + 0.8 + 1.2 * d.k, a + 1.6 + 1.2 * d.k)));
      const dimK = ctx.go(a + 0.6, 0.6), tint = ctx.go(a + 2.6, 0.6) > 0.5, ansC = ctx.role('answer').css, bC = ctx.role('blueCab').css;
      D.dots.forEach(d => {
        if (d.says) { const u = gather(d), x = ex.lerp(d.from.x, d.to.x, u), y = ex.lerp(d.from.y, d.to.y, u) - Math.sin(Math.PI * u) * 24;
          d.e.setAttribute('cx', x.toFixed(1)); d.e.setAttribute('cy', y.toFixed(1)); d.ring.setAttribute('cx', x.toFixed(1)); d.ring.setAttribute('cy', y.toFixed(1));
          K.setOp(d.ring, rings * 0.85); K.setOp(d.e, 1); if (d.filled) d.e.setAttribute('fill', tint ? ansC : bC); }
        else K.setOp(d.e, 1 - 0.7 * dimK);
      });
      const c = ctx.go(a + 2.6, 0.8);
      S.brF.set(D.bx1 + 10, D.B.y0 - 4, D.yF + 4, ctx.role('answer').css, c * 0.9); S.brAll.set(D.bx1 + 10, D.yF + 8, D.yK + 4, ctx.base('dim').css, c * 0.6);
      K.setOp(S.nF, c); K.setOp(S.nAll, c * 0.95); K.setOp(S.big, ctx.go(a + 3.0, 0.6));
      K.setOp(S.bayes, ctx.go(a + 3.0, 0.6) * (1 - ctx.go(T.recap[0], 0.4)));
      void m;
    },
  };
})();
