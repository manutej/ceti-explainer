/* ════════════════════════════════════════════════════════════════════
   modules/ladder-build — climb from the concrete case, one part per rung, and come back down
   --------------------------------------------------------------------
   MODULE-OPERAD §4 (pre-train-the-parts, cue-the-cause, segment-and-pause) with
   Bret Victor's ladder of abstraction: rung 0 is the concrete case, running; each
   rung adds ONE part (picture → cue → label → behave); "integrate" runs every part
   together and the emergent property is the payoff; then the ladder steps back DOWN
   and the concrete case is re-seen with the new model ("return").
   The ladder itself is drawn on the left (a hairline rail pair, one rung per part,
   a marker that climbs and descends). The figure is a PO adapter:
     axis   a measured plane — kinds: bet (rung 0) · gains · losses · emergent bet-value
     chain  an agent loop    — kinds: call (rung 0) · act · observe · budget · emergent budget-run
     grid   a counted city   — kinds: city (rung 0) · witness · both-ways · emergent two-sources
   New figures add an adapter (FIG.<po kind>), never a new module.
   Phases: rung0 · rung1…n · integrate (payoff) · hold · name · return
   Aspects: the grid figure composes itself at every aspect (portrait: the ladder is a bare rail in the grid's
   lane — its rung words drop, the foot names each part —, the witness strip, the two rows and the "Blue" bubble
   stack in the right column). The axis and chain figures have no portrait composition yet: compile FITs them.
   ──────────────────────────────────────────────────────────────────── */
(function () {
  const fmtN = (n) => Math.round(n).toLocaleString('en-US');
  const sgn = (v) => (v < 0 ? '−' : '+');
  const R0 = 4, RUNG = 6, HOLD = 2, NAME = 2, RET = 4.5;
  const integ = (P) => (P.emergent.dur || 6);
  const secs = (P) => R0 + RUNG * P.rungs.length + integ(P) + HOLD + NAME + RET;

  /* ---------- the figures' canonical numbers ---------- */
  const MODEL = {
    axis(P, drop) {
      const M = P.model, a = M.alpha, lam = drop === 'losses' ? 1 : M.lambda, aG = M.alpha;
      const v = (x) => (x >= 0 ? Math.pow(x, aG) : -lam * Math.pow(-x, a));
      const win = v(M.win), lose = v(-M.lose), felt = 0.5 * win + 0.5 * lose, ev = 0.5 * M.win - 0.5 * M.lose;
      return { v, win, lose, felt, ev, refuse: felt < 0, lam };
    },
    grid(P) {
      const M = P.model, green = M.N - M.blue, right = Math.round(100 * M.reliability);
      return { N: M.N, blue: M.blue, green, right, wrong: 100 - right, perTen: Math.round(10 * M.reliability) };
    },
    chain(P, drop) {
      const M = P.model, grow = drop === 'observe' || drop === 'act' ? 0 : 1;
      const perTurn = (n) => M.perTurn * (grow ? n : 1);
      const spent = (n) => { let s = 0; for (let i = 1; i <= n; i++) s += perTurn(i); return s; };
      let empty = null; if (drop !== 'budget') for (let n = 1; n <= 500; n++) if (spent(n) >= M.budget) { empty = n; break; }
      return { perTurn, spent, empty, linear: Math.floor(M.budget / M.perTurn), context: (n) => M.perTurn * (grow ? n : 1), grow };
    },
  };

  const figOf = (P) => (P.model.perTurn != null ? 'chain' : (P.model.reliability != null ? 'grid' : 'axis'));

  const root = typeof window !== 'undefined' ? window : globalThis;
  Module.define('ladder-build', {
    kind: 'scene',
    aspects: (P, po) => figOf(P) === 'grid' && po.kind === 'grid',
    types: ['T1', 'T2', 'T3', 'T9', 'T11', 'T8', 'T5'],
    evidence: 'PED #6 pre-train-the-parts (Pollock), #8 cue-the-cause, #7 segment-and-pause; NAR A7, device 22; Victor, Up and Down the Ladder of Abstraction',
    ports: { needs: ['gap'], gives: ['parts', 'instance'], consumes: [], po: { in: ['axis', 'chain', 'grid'], out: 'same' }, regions: ['body', 'left', 'foot'] },
    params: {
      rung0: { type: 'object', required: true },            // {part, label, kind, note}
      rungs: { type: 'array', required: true, len: [2, 4] }, // [{part, label, kind, note, droppable?}]
      emergent: { type: 'object', required: true },         // {term, kind, label, dur?}
      model: { type: 'object', required: true },            // axis: {alpha, lambda, win, lose} · chain: {perTurn, budget}
      principle: { type: 'object', required: true },        // {term, line}
      returnLine: { type: 'string', required: true },
      foot: { type: 'object', default: {} },
      ladder: { type: 'object', default: { bottom: 'CONCRETE', top: 'ABSTRACT' } },
      control: { type: 'object', default: {} },
      figure: { type: 'object', default: {} },               // grid: {x, strip} — where the witness strip sits, its title
      notes: { type: 'array', default: [] },
    },
    uses: (P) => ['rung', 'answer'].concat({ chain: ['call', 'context', 'budget', 'verdict'], axis: ['outcome', 'felt', 'verdict'], grid: ['witness', 'blueCab', 'greenCab'] }[figOf(P)]),
    duration: (P) => secs(P),
    phases: (P) => {
      const D = secs(P), f = (s) => s / D, out = [];
      out.push({ id: 'rung0', f: f(R0), introduces: [P.rung0.part], marks: [{ term: P.rung0.part, at: 0.3 }], labels: [{ term: P.rung0.part, at: 1.4 }] });
      P.rungs.forEach((r, k) => out.push({ id: 'rung' + (k + 1), f: f(RUNG), introduces: [r.part], marks: [{ term: r.part, at: 0 }],
        cue: { target: r.part, at: 0.6, dur: 0.5 }, labels: [{ term: r.part, at: 1.2 }], shows: k === 0 ? ['part'] : [] }));
      out.push({ id: 'integrate', f: f(integ(P)), introduces: [P.emergent.term], payoff: true, marks: [{ term: P.emergent.term, at: 0.4 }],
        labels: [{ term: P.emergent.term, at: integ(P) - 1.4 }], shows: ['emergent'] });
      out.push({ id: 'hold', f: f(HOLD), hold: true });
      out.push({ id: 'name', f: f(NAME), names: [{ term: P.principle.term, principle: true, at: 0.2 }] });
      out.push({ id: 'return', f: f(RET), shows: ['emergent'] });
      return out;
    },
    numbers: (P) => {
      const fig = figOf(P);
      return { part: (drop) => MODEL[fig](P, drop), emergent: (drop) => MODEL[fig](P, drop) };
    },
    controls: (P) => {
      const opts = [['none', 'all parts']].concat(P.rungs.filter(r => r.droppable).map(r => [r.part, 'remove “' + r.label + '”']));
      if (opts.length < 2) return [];
      return [{ key: 'drop', kind: 'select', default: 'none', options: opts, jumpPhase: 'integrate',
        label: P.control.label || 'Remove one part', question: P.control.question || 'What breaks when this part is gone?',
        result: (v) => { const fig = figOf(P), m = MODEL[fig](P, v === 'none' ? null : v);
          return fig === 'chain' ? (m.empty ? 'budget empty at turn ' + m.empty : 'never empties: no limit') : 'felt value ' + sgn(m.felt) + Math.abs(Math.round(m.felt)) + (m.refuse ? ' → refuse' : ' → accept'); } }];
    },
    audit: (P) => {
      const msgs = [];
      const parts = [P.rung0.part].concat(P.rungs.map(r => r.part));
      if (new Set(parts).size !== parts.length) msgs.push('two rungs introduce the same part');
      let note = '';
      if (figOf(P) === 'grid') {
        const m = MODEL.grid(P);
        if (m.blue <= 0 || m.green <= 0) msgs.push('the city needs both kinds of cab');
        if (!(P.model.reliability > 0.5 && P.model.reliability < 1)) msgs.push('reliability must be in (0.5, 1)');
        if (Math.abs(m.right / 100 - P.model.reliability) > 1e-9) msgs.push('reliability is not a whole number of the 100 tests');
        note = 'ladder-build grid: ' + m.blue + ' + ' + m.green + ' = ' + m.N + ' · witness ' + m.right + '/100 right';
      } else if (P.model.perTurn != null) {
        const m = MODEL.chain(P, null);
        if (m.empty == null) msgs.push('budget never empties');
        if (m.spent(m.empty) < P.model.budget || m.spent(m.empty - 1) >= P.model.budget) msgs.push('empty turn is not the first turn over budget');
        note = 'ladder-build chain: spent ' + fmtN(m.spent(m.empty)) + ' at turn ' + m.empty + ' (linear guess ' + m.linear + ')';
      } else {
        const m = MODEL.axis(P, null);
        if (Math.abs(m.felt - (0.5 * m.v(P.model.win) + 0.5 * m.v(-P.model.lose))) > 1e-9) msgs.push('felt ≠ ½v(win)+½v(−lose)');
        if (!(m.ev > 0 && m.felt < 0)) msgs.push('the example should be a positive-EV bet that feels negative');
        note = 'ladder-build axis: v(' + P.model.win + ')=' + m.win.toFixed(1) + ' v(−' + P.model.lose + ')=' + m.lose.toFixed(1) + ' felt ' + m.felt.toFixed(1) + ' EV +' + m.ev;
      }
      return { ok: !msgs.length, msg: msgs.join('; '), note };
    },
    honesty: (P) => (figOf(P) === 'grid' ? ['the 100 night scenes stand for the court’s test of the witness; the dots draw the stated proportions']
      : P.model.perTurn != null
      ? ['one loop, one agent: real agents summarise, cache and truncate their context', 'token counts are illustrative']
      : ['median parameters (α 0.88, λ 2.25; Tversky & Kahneman 1992): individuals vary', 'small stakes are where loss aversion is most contested'])
      .concat(['the simplest version omits everything not on a rung'], P.notes),
    expertise: 'novice',

    build(svg, ctx, P) {
      const K = ctx.K, S = (ctx.S = {}), ink = ctx.base('ink'), dim = ctx.base('dim'), rungC = ctx.role('rung');
      const n = P.rungs.length, levels = n + 2;
      /* the ladder: a vertical rail pair, one rung per level, words at both ends */
      const Lw = ctx.lay.wide, GP = Lw ? null : root.Layout.gridPlan(ctx.po.geom.n, ctx.lay.F);
      const L = ctx.root('left'), lx = Lw ? 70 : GP.lane.x, yb = Lw ? 420 : GP.y1, yt = Lw ? 168 : GP.y0, ly = (i) => yb - (yb - yt) * i / (levels - 1);
      const rw = Lw ? 22 : 16;
      S.ly = ly;
      S.rails = [K.Rails(L, [K.P(lx, yb + 10), K.P(lx, yt - 10)], dim.a(0.6)), K.Rails(L, [K.P(lx + rw, yb + 10), K.P(lx + rw, yt - 10)], dim.a(0.6))];
      const names = [P.rung0.label].concat(P.rungs.map(r => r.label), [P.emergent.term]);
      S.rungs = names.map((nm, i) => {
        const y = ly(i), g = K.el('g', { opacity: 0 }, L);
        K.el('line', { x1: lx, y1: y, x2: lx + rw, y2: y, stroke: dim.css, 'stroke-width': 1.2 }, g);
        K.el('line', { x1: lx, y1: y + 3, x2: lx + rw, y2: y + 3, stroke: dim.css, 'stroke-width': 1.2 }, g);
        const t = K.tx(g, Lw ? nm : '', lx + 34, y + 6, { size: 13, fill: dim.css, ls: 0.4 });   // portrait: no room for rung words beside the grid
        return { g, t, y };
      });
      S.bot = K.tx(L, Lw ? P.ladder.bottom : '', lx - 6, yb + 34, { size: 13, ls: 3, fill: dim.css, op: 0 });
      S.top = K.tx(L, Lw ? P.ladder.top : '', lx - 6, yt - 22, { size: 13, ls: 3, fill: dim.css, op: 0 });
      S.marker = K.el('rect', { x: lx - 4, y: -3.5, width: rw + 8, height: 7, rx: 1.5, fill: rungC.css, opacity: 0 }, L);
      S.foot = K.foot(ctx.root('foot'), 486);
      S.chip = K.chip(ctx.root('foot'), P.principle.term + '  ·  ' + P.principle.line, 480, K.footY(492), ctx.role('answer').css);
      FIG[ctx.po.kind].build(ctx, P, S, ctx.root('body'));
      void ink;
    },

    render(lt, ctx, P) {
      const K = ctx.K, S = ctx.S, T = ctx.T, n = P.rungs.length, ex = ctx.ex;
      const drop = ctx.ctl('drop', 'none'), dr = drop === 'none' ? null : drop;
      /* which level the learner stands on: climbs one per rung, tops out at integrate, descends at return */
      const climb = [T.rung0[0]].concat(P.rungs.map((r, k) => T['rung' + (k + 1)][0]), [T.integrate[0]]);
      let lvl = 0; climb.forEach((a, i) => { lvl = ex.lerp(lvl, i, ctx.go(a + (i ? 0 : 0.3), 0.6, 'rest')); });
      const down = ctx.go(T.return[0] + 0.2, 1.4, 'rest');
      lvl = ex.lerp(lvl, 0, down);
      const y = S.ly(0) + (S.ly(n + 1) - S.ly(0)) * lvl / (n + 1);
      S.marker.setAttribute('y', (y - 2).toFixed(2)); K.setOp(S.marker, ctx.go(0.1, 0.4, 'defer'));
      S.rails.forEach(r => r.draw(ctx.go(0, 0.9)));
      K.setOp(S.bot, ctx.go(0.4, 0.5) * 0.9); K.setOp(S.top, ctx.go(T.integrate[0], 0.6) * 0.9);
      S.rungs.forEach((r, i) => {
        const a = climb[i]; K.setOp(r.g, ctx.go(a + (i ? 1.2 : 1.4), 0.4));
        const here = Math.abs(lvl - i) < 0.5;
        r.t.setAttribute('fill', here ? ctx.base('ink').css : ctx.base('dim').css);
        const dropped = dr && P.rungs[i - 1] && P.rungs[i - 1].part === dr;
        r.t.setAttribute('text-decoration', dropped ? 'line-through' : 'none');
      });
      /* foot: plan words per phase (+ canonical numbers); the chip replaces it at the name */
      const F = P.foot, ids = ['rung0'].concat(P.rungs.map((r, k) => 'rung' + (k + 1)), ['integrate', 'return']);
      const at = (id) => (id === 'rung0' ? ctx.label(P.rung0.part) + 0.2 : id === 'integrate' ? ctx.label(P.emergent.term) + 0.1 : id === 'return' ? T.return[0] + 1.6 : T[id][0] + 1.6);
      const cur = ids.slice().reverse().find(id => lt >= at(id));
      const nameP = ctx.go(ctx.named(P.principle.term), 0.6), retFade = 1 - ctx.go(T.return[0], 0.4);
      const txt = cur && F[cur] ? FIG[ctx.po.kind].fill(F[cur], ctx, P, dr) : '';
      S.foot.set(txt, (cur ? ctx.go(at(cur), 0.4, 'defer') : 0) * 0.95 * (1 - nameP * retFade));
      S.chip.set(nameP * retFade);
      FIG[ctx.po.kind].render(lt, ctx, P, S, dr);
    },
  });

  /* ═════════════ figure adapters ═════════════ */
  const FIG = {};

  /* ---- axis: a measured plane (prospect-theory value curve) ---- */
  FIG.axis = {
    fill(s, ctx, P, dr) { const m = MODEL.axis(P, dr); return s.split('{win}').join(String(Math.round(m.win))).split('{lose}').join('−' + Math.abs(Math.round(m.lose)))
      .split('{felt}').join(sgn(m.felt) + Math.abs(Math.round(m.felt))).split('{ev}').join('+$' + m.ev).split('{lambda}').join(String(m.lam)); },
    build(ctx, P, S, g) {
      const K = ctx.K, AX = PO.get('axis'), G = ctx.po.geom, mp = AX.map(G), sx = mp.sx, sy = mp.sy, o = G.origin, b = G.box;
      const dim = ctx.base('dim'), ink = ctx.base('ink'), outC = ctx.role('outcome'), feltC = ctx.role('felt'), verC = ctx.role('verdict'), ansC = ctx.role('answer');
      S.ax = { sx, sy, o };
      S.xAxis = K.Rails(g, [K.P(b.x0, o.y), K.P(b.x1, o.y)], dim.a(0.7));
      S.xLab = K.tx(g, G.x.label, b.x1, o.y + 40, { size: 13, ls: 1.5, fill: dim.css, anchor: 'end', op: 0 });
      S.zero = K.tx(g, '$0', o.x, o.y + 22, { size: 13, fill: dim.css, anchor: 'middle', op: 0 });
      S.ref = K.el('circle', { cx: o.x, cy: o.y, r: 4, fill: ink.css, opacity: 0 }, g);
      S.yAxis = K.Rails(g, [K.P(o.x, b.y1), K.P(o.x, b.y0)], dim.a(0.7));
      S.yLab = K.tx(g, G.y.label, o.x - 10, b.y0 + 4, { size: 13, ls: 1.5, fill: dim.css, anchor: 'end', op: 0 });
      const M = P.model;
      const tick = (x, lab, below) => { const tg = K.el('g', { opacity: 0 }, g);
        K.el('line', { x1: sx(x), y1: o.y - 7, x2: sx(x), y2: o.y + 7, stroke: outC.css, 'stroke-width': 1.6 }, tg);
        const t = K.tx(tg, lab, sx(x), below ? o.y + 26 : o.y - 14, { size: 15, fill: outC.css, anchor: 'middle', weight: 700 });
        return { g: tg, t, x: sx(x) }; };
      S.win = tick(M.win, '+$' + M.win, false); S.lose = tick(-M.lose, '−$' + M.lose, true);
      S.coin = K.el('circle', { r: 9, fill: 'none', stroke: outC.css, 'stroke-width': 1.2, opacity: 0 }, g);
      S.r0lab = K.wrap(g, P.rung0.note, b.x0 + 4, b.y0 + 30, o.x - b.x0 - 24, 20, { size: 15, fill: ink.css, op: 0 }).e;
      S.retG = K.el('g', { opacity: 0 }, g);
      S.retLab = K.wrap(S.retG, P.returnLine.split('{felt}').join(sgn(MODEL.axis(P, null).felt) + Math.abs(Math.round(MODEL.axis(P, null).felt))), b.x0 + 4, b.y0 + 80, o.x - b.x0 - 24, 20, { size: 15, fill: verC.css }).e;
      const curve = (sgnX) => { let d = ''; for (let i = 0; i <= 80; i++) { const x = sgnX * (i / 80) * (G.x.max), v = MODEL.axis(P, null).v(x); if (v < G.y.min) break; d += (i ? 'L' : 'M') + sx(x).toFixed(1) + ' ' + sy(v).toFixed(1); }
        return K.el('path', { d, fill: 'none', stroke: feltC.css, 'stroke-width': 1.8, pathLength: 1, 'stroke-dasharray': '1 2', 'stroke-dashoffset': 1, opacity: 0, 'stroke-linecap': 'round' }, g); };
      S.cG = curve(1); S.cL = curve(-1);
      S.cL1 = K.el('path', { fill: 'none', stroke: feltC.css, 'stroke-width': 1.2, 'stroke-dasharray': '3 4', opacity: 0 }, g);   // λ = 1 ghost (the dropped part)
      { let d = ''; for (let i = 0; i <= 80; i++) { const x = -(i / 80) * G.x.max, v = -Math.pow(-x, M.alpha); if (v < G.y.min) break; d += (i ? 'L' : 'M') + sx(x).toFixed(1) + ' ' + sy(v).toFixed(1); } S.cL1.setAttribute('d', d); }
      const rider = () => ({ dot: K.el('circle', { r: 4.5, fill: feltC.css, opacity: 0 }, g),
        dx: K.el('line', { stroke: dim.css, 'stroke-width': 1, 'stroke-dasharray': '2 3', opacity: 0 }, g),
        dy: K.el('line', { stroke: dim.css, 'stroke-width': 1, 'stroke-dasharray': '2 3', opacity: 0 }, g),
        t: K.tx(g, '', 0, 0, { size: 15, fill: feltC.css, op: 0 }) });
      S.rG = rider(); S.rL = rider();
      S.gLab = K.tx(g, P.rungs[0].note, sx(M.win) - 6, sy(MODEL.axis(P, null).win) - 30, { size: 13, ls: 0.4, fill: feltC.css, anchor: 'end', op: 0 });
      S.lLab = K.wrap(g, P.rungs[1].note, o.x + 24, b.y1 - 22, 250, 18, { size: 13, fill: feltC.css, op: 0 }).e;
      S.chord = K.el('line', { stroke: dim.css, 'stroke-width': 1.2, 'stroke-dasharray': '4 4', opacity: 0 }, g);
      S.mid = K.el('circle', { r: 5.5, fill: verC.css, opacity: 0 }, g);
      S.evT = K.el('g', { opacity: 0 }, g);
      K.el('line', { x1: 0, y1: -8, x2: 0, y2: 8, stroke: ansC.css, 'stroke-width': 1.6 }, S.evT);
      S.evTx = K.tx(S.evT, '', 0, -14, { size: 15, fill: ansC.css, anchor: 'middle' });
      S.feltT = K.tx(g, '', 0, 0, { size: 15, fill: verC.css, weight: 700, op: 0 });
      S.verdict = K.tx(g, '', 0, 0, { size: 13, ls: 1.5, fill: verC.css, op: 0 });
      S.midDrop = K.el('line', { stroke: verC.css, 'stroke-width': 1, 'stroke-dasharray': '2 3', opacity: 0 }, g);
    },
    render(lt, ctx, P, S, dr) {
      const K = ctx.K, T = ctx.T, ex = ctx.ex, M = P.model, A = S.ax, m = MODEL.axis(P, dr), m0 = MODEL.axis(P, null);
      const ret = ctx.go(T.return[0] + 0.3, 1.0, 'rest'), ghost = 1 - 0.75 * ret;
      /* rung 0: the money axis, the reference point, the coin's two outcomes, flipping */
      S.xAxis.draw(ctx.go(0.1, 0.9)); K.setOp(S.zero, ctx.go(0.6, 0.4) * 0.9); K.setOp(S.ref, ctx.go(0.4, 0.4));
      K.setOp(S.xLab, ctx.go(ctx.label(P.rung0.part), 0.5) * 0.9);
      K.setOp(S.win.g, ctx.go(0.3, 0.5)); K.setOp(S.lose.g, ctx.go(0.5, 0.5));
      K.setOp(S.r0lab, ctx.go(ctx.label(P.rung0.part), 0.5) * (1 - 0.6 * ctx.go(T.rung1[0], 0.5) + 0.6 * ret));
      const flipOn = lt < T.rung1[0] + 0.5 || lt > T.return[0] + 1.2;
      const heads = Math.floor(lt / 0.8) % 2 === 0, cx = heads ? S.win.x : S.lose.x;
      S.coin.setAttribute('cx', cx); S.coin.setAttribute('cy', A.o.y); K.setOp(S.coin, flipOn && !ctx.rm ? ctx.go(1.0, 0.3) * 0.9 : 0);
      /* rung 1: gains — the felt axis and the concave branch; a rider climbs to v(win) */
      const r1 = T.rung1[0], r2 = T.rung2[0];
      S.yAxis.draw(ctx.go(r1, 0.6)); K.setOp(S.yLab, ctx.go(r1 + 0.4, 0.5) * 0.9);
      S.cG.setAttribute('stroke-dashoffset', (1 - ctx.go(r1 + 0.5, 1.0, 'defer')).toFixed(4)); K.setOp(S.cG, (lt >= r1 + 0.5 ? 1 : 0) * ghost);
      K.setOp(S.gLab, ctx.go(ctx.label(P.rungs[0].part), 0.5) * (1 - 0.5 * ctx.go(T.integrate[0], 0.5)) * ghost);
      const rideG = ctx.go(r1 + 1.6, 2.0, 'rest');
      placeRider(K, S.rG, A, rideG * M.win, m0.v(rideG * M.win), (lt >= r1 + 1.6 ? 1 : 0) * ghost, 'v(' + Math.round(rideG * M.win) + ') ≈ ' + Math.round(m0.v(rideG * M.win)), 'up', ctx);
      /* rung 2: losses — the steeper branch (× λ); a rider falls to v(−lose) */
      const lossOn = lt >= r2 + 0.5;
      S.cL.setAttribute('stroke-dashoffset', (1 - ctx.go(r2 + 0.5, 1.0, 'defer')).toFixed(4)); K.setOp(S.cL, (lossOn ? 1 : 0) * ghost * (dr === 'losses' ? 0.2 : 1));
      K.setOp(S.cL1, dr === 'losses' && lossOn ? 0.9 * ghost : 0);
      K.setOp(S.lLab, ctx.go(ctx.label(P.rungs[1].part), 0.5) * (1 - 0.5 * ctx.go(T.integrate[0], 0.5)) * ghost);
      const rideL = ctx.go(r2 + 1.6, 2.0, 'rest');
      placeRider(K, S.rL, A, -rideL * M.lose, m.v(-rideL * M.lose), (lt >= r2 + 1.6 ? 1 : 0) * ghost, 'v(−' + Math.round(rideL * M.lose) + ') ≈ −' + Math.abs(Math.round(m.v(-rideL * M.lose))), 'down', ctx);
      /* integrate: the bet's two points, the chord, its midpoint = (EV, felt value) */
      const I = T.integrate[0], ch = ctx.go(I + 0.4, 1.2, 'defer');
      const x1 = A.sx(M.win), y1 = A.sy(m.win), x2 = A.sx(-M.lose), y2 = A.sy(m.lose);
      S.chord.setAttribute('x1', x2); S.chord.setAttribute('y1', y2); S.chord.setAttribute('x2', ex.lerp(x2, x1, ch).toFixed(1)); S.chord.setAttribute('y2', ex.lerp(y2, y1, ch).toFixed(1));
      K.setOp(S.chord, (lt >= I + 0.4 ? 0.9 : 0) * (1 - 0.4 * ret));
      const mp = ctx.go(I + 1.8, 0.6), mx = A.sx(m.ev), my = A.sy(m.felt);
      S.mid.setAttribute('cx', mx); S.mid.setAttribute('cy', my); K.setOp(S.mid, mp);
      S.evT.setAttribute('transform', 'translate(' + mx.toFixed(1) + ' ' + A.o.y + ')'); K.setText(S.evTx, 'EV +$' + m.ev); K.setOp(S.evT, ctx.go(I + 2.4, 0.5));
      S.midDrop.setAttribute('x1', mx); S.midDrop.setAttribute('x2', mx); S.midDrop.setAttribute('y1', A.o.y); S.midDrop.setAttribute('y2', my); K.setOp(S.midDrop, ctx.go(I + 2.4, 0.5) * 0.8);
      S.feltT.setAttribute('x', mx + 14); S.feltT.setAttribute('y', my + 24);
      K.setText(S.feltT, 'felt ' + sgn(m.felt) + Math.abs(Math.round(m.felt))); K.setOp(S.feltT, ctx.go(I + 3.0, 0.5));
      S.verdict.setAttribute('x', mx + 14); S.verdict.setAttribute('y', my + 44);
      K.setText(S.verdict, m.refuse ? P.emergent.label.toUpperCase() : 'ACCEPTED');
      K.setOp(S.verdict, ctx.go(ctx.label(P.emergent.term), 0.5));
      /* return: the concrete case again, seen through the model */
      K.setOp(S.retG, ctx.go(T.return[0] + 1.4, 0.6));
    },
  };
  function placeRider(K, R, A, x, v, o, txt, dir, ctx) {
    const px = A.sx(x), py = A.sy(v);
    R.dot.setAttribute('cx', px.toFixed(1)); R.dot.setAttribute('cy', py.toFixed(1)); K.setOp(R.dot, o);
    R.dx.setAttribute('x1', px); R.dx.setAttribute('x2', px); R.dx.setAttribute('y1', A.o.y); R.dx.setAttribute('y2', py); K.setOp(R.dx, o * 0.8);
    R.dy.setAttribute('x1', A.o.x); R.dy.setAttribute('x2', px); R.dy.setAttribute('y1', py); R.dy.setAttribute('y2', py); K.setOp(R.dy, o * 0.8);
    K.setText(R.t, txt); R.t.setAttribute('x', (px + (dir === 'up' ? -12 : 12)).toFixed(1)); R.t.setAttribute('y', (py + (dir === 'up' ? -12 : 22)).toFixed(1));
    R.t.setAttribute('text-anchor', dir === 'up' ? 'end' : 'start'); K.setOp(R.t, o);
    void ctx;
  }

  /* ---- chain (loop): an agent loop — context, model, tool, budget ---- */
  FIG.chain = {
    fill(s, ctx, P, dr) { const m = MODEL.chain(P, dr);
      return s.split('{perTurn}').join(fmtN(P.model.perTurn)).split('{budget}').join(fmtN(P.model.budget)).split('{empty}').join(m.empty ? String(m.empty) : '—')
        .split('{linear}').join(String(m.linear)).split('{spentEmpty}').join(m.empty ? fmtN(m.spent(m.empty)) : '—').split('{context}').join(fmtN(m.context(m.empty || 8))); },
    build(ctx, P, S, g) {
      const K = ctx.K, A = ctx.po.anchors, dim = ctx.base('dim'), ink = ctx.base('ink');
      const callC = ctx.role('call'), ctxC = ctx.role('context'), budC = ctx.role('budget'), verC = ctx.role('verdict');
      const C = A.context, Mo = A.model, To = A.tool, R = { x0: 300, x1: 860, y: 392, h: 14 };
      S.L = { C, Mo, To, R };
      S.pages = Array.from({ length: 12 }, (_, i) => K.el('rect', { x: C.x - 26, y: C.y + 12 - (i + 1) * 9.5, width: 52, height: 7, rx: 1, fill: ctxC.css, opacity: 0 }, g));
      S.cLab = K.tx(g, 'CONTEXT', C.x - 36, C.y + 4, { size: 13, ls: 1.5, fill: dim.css, anchor: 'end', op: 0 });
      S.cTok = K.tx(g, '', C.x - 36, C.y + 24, { size: 15, fill: ctxC.css, anchor: 'end', op: 0 });
      S.e1 = K.Rails(g, [K.P(C.x + 34, Mo.y), K.P(Mo.x - 34, Mo.y)], dim.a(0.7));
      S.model = K.el('g', { opacity: 0 }, g);
      K.el('circle', { cx: Mo.x, cy: Mo.y, r: 30, fill: 'none', stroke: callC.css, 'stroke-width': 1.4 }, S.model);
      K.tx(S.model, 'model', Mo.x, Mo.y + 5, { size: 13, fill: callC.css, anchor: 'middle', ls: 0.5 });
      S.ans = K.Rails(g, [K.P(Mo.x + 34, Mo.y), K.P(Mo.x + 110, Mo.y)], dim.a(0.7));
      S.ansT = K.tx(g, 'answer', Mo.x + 118, Mo.y + 5, { size: 13, fill: ink.css, op: 0 });
      S.r0note = K.tx(g, P.rung0.note, C.x + 50, Mo.y - 62, { size: 15, fill: ink.css, op: 0 });
      S.e2 = K.Rails(g, [K.P(Mo.x + 34, Mo.y), K.P(To.x - 40, To.y)], dim.a(0.7));
      S.tool = K.el('g', { opacity: 0 }, g);
      K.el('rect', { x: To.x - 40, y: To.y - 20, width: 80, height: 40, rx: 6, fill: 'none', stroke: callC.css, 'stroke-width': 1.4 }, S.tool);
      K.tx(S.tool, 'tool', To.x, To.y + 5, { size: 13, fill: callC.css, anchor: 'middle', ls: 0.5 });
      S.r1note = K.tx(g, P.rungs[0].note, To.x, To.y - 36, { size: 13, fill: dim.css, anchor: 'middle', op: 0 });
      const back = K.cat(K.cub(K.P(To.x, To.y + 22), K.P(To.x, To.y + 70), K.P(To.x - 30, To.y + 84), K.P(To.x - 70, To.y + 84), 14),
        [K.P(C.x + 60, To.y + 84)], K.cub(K.P(C.x + 60, To.y + 84), K.P(C.x + 20, To.y + 84), K.P(C.x, To.y + 74), K.P(C.x, C.y + 14), 14));
      S.e3 = K.Rails(g, back, dim.a(0.7)); S.backPl = K.poly(back);
      S.r2note = K.tx(g, P.rungs[1].note, (C.x + To.x) / 2, To.y + 106, { size: 13, fill: dim.css, anchor: 'middle', op: 0 });
      S.fwd = K.poly([K.P(C.x + 30, Mo.y), K.P(Mo.x, Mo.y), K.P(To.x - 40, To.y)]);
      S.car = K.Car(g, callC.css, 12, 5);
      /* budget reservoir */
      S.res = K.el('g', { opacity: 0 }, g);
      K.el('rect', { x: R.x0, y: R.y - R.h / 2, width: R.x1 - R.x0, height: R.h, rx: 2, fill: 'none', stroke: dim.css, 'stroke-width': 1 }, S.res);
      S.full = K.el('rect', { x: R.x0, y: R.y - R.h / 2 + 2, width: R.x1 - R.x0, height: R.h - 4, fill: budC.a(0.35) }, S.res);
      S.segs = Array.from({ length: 12 }, () => K.el('rect', { y: R.y - R.h / 2 + 2, height: R.h - 4, width: 0, fill: callC.css, opacity: 0 }, S.res));
      S.over = K.el('rect', { y: R.y - R.h / 2 - 2, height: R.h + 4, width: 0, fill: verC.css, opacity: 0 }, S.res);
      S.resLab = K.tx(S.res, P.rungs[2] ? P.rungs[2].note : '', R.x0, R.y - 16, { size: 13, ls: 1, fill: budC.css });
      S.res0 = K.tx(S.res, '0', R.x0, R.y + 26, { size: 13, fill: dim.css, anchor: 'middle' });
      S.res1 = K.tx(S.res, fmtN(P.model.budget), R.x1, R.y + 26, { size: 13, fill: dim.css, anchor: 'middle' });
      S.ghost = K.el('g', { opacity: 0 }, g);
      K.el('line', { x1: R.x1, y1: R.y - 16, x2: R.x1, y2: R.y + 10, stroke: dim.css, 'stroke-width': 1, 'stroke-dasharray': '2 3' }, S.ghost);
      S.ghostT = K.tx(S.ghost, '', R.x1, R.y + 46, { size: 13, fill: dim.css, anchor: 'end' });
      S.counter = K.tx(g, '', R.x1, 150, { size: 15, fill: ink.css, anchor: 'end', op: 0 });
      S.verdict = K.tx(g, '', 0, R.y - 16, { size: 15, fill: verC.css, weight: 700, op: 0 });
    },
    render(lt, ctx, P, S, dr) {
      const K = ctx.K, T = ctx.T, ex = ctx.ex, L = S.L, m = MODEL.chain(P, dr), nR = P.rungs.length;
      const callC = ctx.role('call'), ctxC = ctx.role('context');
      const r1 = T.rung1[0], r2 = T.rung2[0], r3 = T.rung3 ? T.rung3[0] : T.integrate[0], I = T.integrate[0], ret = T.return[0];
      const dropAct = dr === 'act', dropObs = dr === 'observe' || dropAct, dropBud = dr === 'budget';
      /* rung 0: one call — the context page, the model, an answer */
      K.setOp(S.model, ctx.go(0.3, 0.5)); S.e1.draw(ctx.go(0.2, 0.7));
      K.setOp(S.cLab, ctx.go(0.5, 0.5) * 0.9);
      const toolOn = lt >= r1;
      S.ans.draw(toolOn ? 0 : ctx.go(0.8, 0.6)); K.setOp(S.ansT, toolOn ? 0 : ctx.go(1.2, 0.4));
      K.setText(S.r0note, lt >= ret ? FIG.chain.fill(P.returnLine, ctx, P, dr) : P.rung0.note);
      S.r0note.setAttribute('font-size', lt >= ret ? 13 : 15);
      S.r0note.setAttribute('fill', lt >= ret ? ctx.role('verdict').css : ctx.base('ink').css);
      K.setOp(S.r0note, ctx.go(ctx.label(P.rung0.part), 0.5) * (1 - ctx.go(r1, 0.4)) + ctx.go(ret + 1.4, 0.6));
      /* rung 1: act */
      S.e2.draw(ctx.go(r1, 0.6)); K.setOp(S.tool, ctx.go(r1, 0.5) * (dropAct ? 0.25 : 1));
      K.setOp(S.r1note, ctx.go(ctx.label(P.rungs[0].part), 0.5) * (1 - ctx.go(I, 0.5)));
      /* rung 2: observe (the way back into the context) */
      S.e3.draw(ctx.go(r2, 0.9)); S.e3.op(dropObs ? 0.25 : 1);
      K.setOp(S.r2note, ctx.go(ctx.label(P.rungs[1].part), 0.5) * (1 - ctx.go(I, 0.5)));
      /* rung 3: budget */
      K.setOp(S.res, ctx.go(r3, 0.6) * (dropBud ? 0.25 : 1));
      /* how many pages the context holds, and where the call token is */
      let pages = 1, carPos = null, reading = 0, turn = 0, spentNow = 0;
      const loop = (a, period, count) => { const k = Math.floor((lt - a) / period); return { k: Math.max(0, Math.min(count - 1, k)), u: ex.clamp((lt - a) / period - Math.max(0, Math.min(count - 1, k))) }; };
      const fwdLen = S.fwd.len, backLen = S.backPl.len;
      if (lt < r1) { const q = loop(1.0, 1.4, 3); carPos = lt >= 1.0 ? K.at(K.poly([K.P(L.C.x + 30, L.Mo.y), K.P(L.Mo.x + 110, L.Mo.y)]), q.u * (L.Mo.x + 80 - L.C.x)) : null; reading = q.u < 0.15 ? 1 : 0; }
      else if (lt < r2) { if (lt >= r1 + 1.6) { const q = loop(r1 + 1.6, 1.5, 3); carPos = K.at(S.fwd, q.u * fwdLen); reading = q.u < 0.12 ? 1 : 0; } }
      else if (lt < I) {
        const q = loop(r2 + 1.6, 2.0, 3), lap = lt >= r2 + 1.6;
        if (lap) { carPos = q.u < 0.55 ? K.at(S.fwd, (q.u / 0.55) * fwdLen) : K.at(S.backPl, ((q.u - 0.55) / 0.45) * backLen); reading = q.u < 0.08 ? 1 : 0;
          pages = Math.min(3, 1 + q.k + (q.u > 0.97 ? 1 : 0)); if (dropObs) pages = 1; }
        if (lt >= r3) pages = dropObs ? 1 : 3;
      } else {
        const per = (integ(P) - 1.4) / Math.max(1, (m.empty || 8)), nT = m.empty || 8, q = loop(I + 0.4, per, nT);
        const going = lt >= I + 0.4 && lt < I + 0.4 + per * nT;
        turn = lt >= I + 0.4 ? q.k + 1 : 0;
        pages = Math.max(1, dropObs ? 1 : turn);
        if (going) { carPos = q.u < 0.55 ? K.at(S.fwd, (q.u / 0.55) * fwdLen) : K.at(S.backPl, ((q.u - 0.55) / 0.45) * backLen); reading = q.u < 0.2 ? 1 : 0; }
        spentNow = turn ? m.spent(turn - 1) + (q.u >= 0.3 || !going ? m.perTurn(turn) : 0) : 0;
        if (lt >= ret + 1.4) { const u = ex.clamp((lt - ret - 1.4) / 1.6); carPos = u < 1 ? K.at(S.fwd, u * (L.Mo.x - L.C.x - 30)) : null; reading = u < 0.25 ? 1 : 0; }
      }
      S.pages.forEach((r, i) => { K.setOp(r, i < pages ? ctx.go(0.4, 0.5) * (reading ? 0.95 : 0.6) : 0); r.setAttribute('fill', reading ? callC.css : ctxC.css); });
      K.setText(S.cTok, fmtN(pages * P.model.perTurn) + ' tokens'); K.setOp(S.cTok, lt >= r2 + 1.0 ? ctx.go(r2 + 1.0, 0.4) : 0);
      if (carPos) K.placeCar(S.car, carPos, 1, callC.css); else K.show(S.car, 0);
      /* integrate: the reservoir drains by the turn's whole-context read; segments grow as a staircase */
      const R = L.R, W = R.x1 - R.x0, B = P.model.budget;
      let acc = 0;
      S.segs.forEach((r, i) => {
        const n = i + 1, on = lt >= I && turn >= n && (n < turn || spentNow >= m.spent(n));
        const w = W * m.perTurn(n) / B, x = R.x0 + W * acc / B; acc += m.perTurn(n);
        const vis = on && x < R.x1;
        r.setAttribute('x', x.toFixed(1)); r.setAttribute('width', Math.max(0, Math.min(w, R.x1 - x) - 1.5).toFixed(1));
        r.setAttribute('fill', callC.a(0.55 + 0.4 * (n % 2))); K.setOp(r, vis ? 1 : 0);
      });
      const spentAll = turn ? Math.min(spentNow, m.spent(turn)) : 0;
      S.full.setAttribute('x', (R.x0 + W * Math.min(1, spentAll / B)).toFixed(1)); S.full.setAttribute('width', Math.max(0, W * (1 - spentAll / B)).toFixed(1));
      const overW = spentAll > B ? Math.min(60, W * (spentAll - B) / B) : 0;
      S.over.setAttribute('x', R.x1); S.over.setAttribute('width', overW.toFixed(1)); K.setOp(S.over, overW > 0 ? 0.85 : 0);
      K.setText(S.counter, turn ? 'turn ' + turn + ' · reads ' + fmtN(m.perTurn(turn)) + ' · spent ' + fmtN(spentAll) : '');
      K.setOp(S.counter, turn && lt < ret + 1.0 ? 1 : 0);
      const done = ctx.go(ctx.label(P.emergent.term), 0.5);
      K.setText(S.verdict, m.empty ? P.emergent.label.split('{empty}').join(String(m.empty)) : 'no limit: it never stops spending');
      S.verdict.setAttribute('x', R.x1 + 8); S.verdict.setAttribute('y', R.y + 5); S.verdict.setAttribute('text-anchor', 'start');
      K.setOp(S.verdict, 0);
      K.setText(S.ghostT, 'if every turn cost ' + fmtN(P.model.perTurn) + ': ' + m.linear + ' turns');
      K.setOp(S.ghost, done * 0.9);
      /* the verdict sits above the reservoir's end, in the verdict role */
      S.counter.setAttribute('fill', done > 0.5 ? ctx.role('verdict').css : ctx.base('ink').css);
      if (done > 0) { K.setText(S.counter, m.empty ? P.emergent.label.split('{empty}').join(String(m.empty)) + ' · spent ' + fmtN(m.spent(m.empty)) : 'no limit: it never stops spending'); K.setOp(S.counter, done); }
    },
  };

  /* ---- grid: a counted city (PO grid) — the base rate and the witness, as parts ---- */
  FIG.grid = {
    fill(s, ctx, P) { const m = MODEL.grid(P);
      return s.split('{N}').join(fmtN(m.N)).split('{blue}').join(fmtN(m.blue)).split('{green}').join(fmtN(m.green))
        .split('{right}').join(String(m.right)).split('{wrong}').join(String(m.wrong)).split('{perTen}').join(String(m.perTen)).split('{wrongTen}').join(String(10 - m.perTen)); },
    build(ctx, P, S, g) {
      const K = ctx.K, G = ctx.po.geom, GK = PO.get('grid'), m = MODEL.grid(P), ink = ctx.base('ink'), dim = ctx.base('dim');
      const bC = ctx.role('blueCab'), hC = ctx.role('greenCab'), wC = ctx.role('witness');
      const Lw = ctx.lay.wide, F = ctx.lay.F, GP = Lw ? null : root.Layout.gridPlan(G.n, F), RC = Lw ? null : GP.RC, lab = Lw ? 13 : ctx.lay.fs.label;
      const ctxText = (str, fill) => { const e = Lw ? K.tx(g, str, G.x0 - 4, 126, { size: 15, fill, op: 0 }) : K.tx(g, str, F.x0, GP.ctxY, { size: 30, cls: 's', fill, op: 0 });
        if (!Lw) { let fs = 30; while (K.tw(e) > F.w && fs > 28) { fs -= 1; e.setAttribute('font-size', fs); } } return e; };
      /* the city: one row group per grid row (cast row by row); filled first, like mass-reseat's cell order */
      S.label = ctxText(ctx.po.state.label || '', ink.css);
      S.rows = []; const tmp = {};
      for (let r = 0; r < G.rows; r++) S.rows.push(K.el('g', { opacity: 0 }, g));
      for (let i = 0; i < m.N; i++) {
        GK.cell(G, i, tmp); const filled = i < m.blue, row = S.rows[Math.floor(i / G.cols)];
        K.el('circle', { cx: tmp.x, cy: tmp.y, r: filled ? G.r : G.r - 0.4, fill: filled ? bC.css : 'none', stroke: filled ? 'none' : hC.css, 'stroke-width': Lw ? 1 : 1.3 }, row);
      }
      S.legend = K.el('g', { opacity: 0 }, g);
      if (Lw) {
        const ly = G.y1 + 32;
        K.el('circle', { cx: G.x0, cy: ly - 5, r: 3.6, fill: bC.css }, S.legend);
        const t1 = K.tx(S.legend, fmtN(m.blue) + ' Blue cabs', G.x0 + 10, ly, { size: 15, fill: ink.css });
        const x2 = G.x0 + 10 + K.tw(t1) + 28;
        K.el('circle', { cx: x2, cy: ly - 5, r: 3.6, fill: 'none', stroke: hC.css, 'stroke-width': 1.2 }, S.legend);
        K.tx(S.legend, fmtN(m.green) + ' Green cabs', x2 + 10, ly, { size: 15, fill: ink.css });
      } else {   // portrait: stacked, under the grid
        const lx = GP.x0 - 4, ly = GP.legendY;
        K.el('circle', { cx: lx + 7, cy: ly - 9.5, r: 7, fill: bC.css }, S.legend);
        K.tx(S.legend, fmtN(m.blue) + ' Blue cabs', lx + 26, ly, { size: lab, fill: ink.css });
        K.el('circle', { cx: lx + 7, cy: ly + 36.4 - 9.5, r: 7, fill: 'none', stroke: hC.css, 'stroke-width': 2 }, S.legend);
        K.tx(S.legend, fmtN(m.green) + ' Green cabs', lx + 26, ly + 36.4, { size: lab, fill: ink.css });
      }
      /* rung 1: the witness, tested on 100 night scenes — a strip of 100 verdicts (✓ right, ✗ wrong) */
      const W0 = Lw ? (P.figure && P.figure.x != null ? P.figure.x : 600) : RC.x0, Y0 = Lw ? 200 : RC.y0 + 44;
      const pitch = Lw ? 16 : Math.min(40, (RC.w - 4) / 10, (RC.h - 130) / 10), k = pitch / 16;
      S.strip = K.el('g', { opacity: 0 }, g);
      S.stripTitle = K.tx(g, (P.figure && P.figure.strip) || 'TESTED ON 100 NIGHT SCENES', W0, Lw ? Y0 - 18 : RC.y0 + 12, { size: lab, ls: Lw ? 1.5 : 0.6, fill: wC.css, op: 0 });
      if (!Lw) K.fitLine(S.stripTitle, S.stripTitle.textContent, RC.w);
      S.marks = [];
      for (let i = 0; i < 100; i++) {
        const x = W0 + (i % 10) * pitch + 5 * k, y = Y0 + Math.floor(i / 10) * pitch + 5 * k, ok = i < m.right, mg = K.el('g', { opacity: 0 }, S.strip);
        if (ok) K.el('path', { d: 'M' + (x - 4 * k) + ' ' + y + ' l' + 3 * k + ' ' + 3.5 * k + ' l' + 5.5 * k + ' ' + -7 * k, fill: 'none', stroke: wC.css, 'stroke-width': Lw ? 1.5 : 2.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, mg);
        else K.el('path', { d: 'M' + (x - 3.5 * k) + ' ' + (y - 3.5 * k) + ' l' + 7 * k + ' ' + 7 * k + ' M' + (x + 3.5 * k) + ' ' + (y - 3.5 * k) + ' l' + -7 * k + ' ' + 7 * k, fill: 'none', stroke: wC.css, 'stroke-width': Lw ? 1.3 : 2.3, 'stroke-linecap': 'round', opacity: 0.75 }, mg);
        S.marks.push(mg);
      }
      S.stripCount = K.tx(g, m.right + ' right · ' + m.wrong + ' wrong', W0, Y0 + 10 * pitch + (Lw ? 22 : 34), { size: Lw ? 15 : lab, fill: wC.css, op: 0 });
      /* rung 2: errors go both ways — two rows of ten reports: amber filled square = says “Blue”, hollow = says “Green” */
      S.both = K.el('g', { opacity: 0 }, g);
      const sq = Lw ? 10 : Math.min(30, (RC.w - 80) / 10), sp = Lw ? 15 : sq + 8, rowH = Lw ? 62 : 36 + sq + 78;
      const rowY = Lw ? [Y0 + 30, Y0 + 92] : [RC.y0 + 30, RC.y0 + 30 + rowH];
      S.bothRows = [0, 1].map(r => {
        const rg = K.el('g', { opacity: 0 }, S.both), y = rowY[r], blue = r === 0;
        const says = blue ? m.perTen : 10 - m.perTen;
        if (Lw) {
          K.el('circle', { cx: W0 + 5, cy: y, r: 5, fill: blue ? bC.css : 'none', stroke: blue ? 'none' : hC.css, 'stroke-width': 1.3 }, rg);
          K.tx(rg, blue ? 'shown a Blue cab' : 'shown a Green cab', W0 + 18, y + 5, { size: 13, fill: ink.css });
          for (let i = 0; i < 10; i++) { const x = W0 + 18 + i * 15, sb = i < says;
            K.el('rect', { x, y: y + 16, width: 10, height: 10, rx: 1.5, fill: sb ? wC.css : 'none', stroke: wC.css, 'stroke-width': 1.1 }, rg); }
          K.tx(rg, 'says “Blue” ' + says + ' in 10', W0 + 18 + 10 * 15 + 10, y + 25, { size: 13, fill: wC.css, weight: blue ? 400 : 700 });
        } else {
          K.el('circle', { cx: W0 + 9, cy: y - 9.5, r: 9, fill: blue ? bC.css : 'none', stroke: blue ? 'none' : hC.css, 'stroke-width': 2 }, rg);
          K.tx(rg, blue ? 'shown a Blue cab' : 'shown a Green cab', W0 + 30, y, { size: lab, fill: ink.css });
          for (let i = 0; i < 10; i++) { const x = W0 + i * sp, sb = i < says;
            K.el('rect', { x, y: y + 20, width: sq, height: sq, rx: 3, fill: sb ? wC.css : 'none', stroke: wC.css, 'stroke-width': 2 }, rg); }
          K.tx(rg, 'says “Blue” ' + says + ' in 10', W0, y + 20 + sq + 38, { size: lab, fill: wC.css, weight: blue ? 400 : 700 });
        }
        return rg;
      });
      S.bothKey = K.tx(S.both, '■ says “Blue”   □ says “Green”', W0, Lw ? rowY[1] + 58 : rowY[1] + 20 + sq + 84, { size: lab, fill: dim.css });
      if (!Lw) K.fitLine(S.bothKey, S.bothKey.textContent, RC.w);
      /* integrate: one report, two possible sources */
      const bx = Lw ? W0 + 40 : W0 + 18, by = Lw ? rowY[1] + 100 : rowY[1] + 20 + sq + 160;
      S.bub = K.el('g', { opacity: 0 }, g);
      if (Lw) {
        K.el('rect', { x: bx - 10, y: by - 20, width: 120, height: 32, rx: 16, fill: 'none', stroke: wC.css, 'stroke-width': 1.3 }, S.bub);
        K.el('rect', { x: bx + 2, y: by - 9, width: 10, height: 10, rx: 1.5, fill: wC.css }, S.bub);
        K.tx(S.bub, '“Blue”', bx + 20, by + 1, { size: 15, fill: wC.css });
      } else {
        K.el('rect', { x: bx - 18, y: by - 34, width: 196, height: 52, rx: 26, fill: 'none', stroke: wC.css, 'stroke-width': 2 }, S.bub);
        K.el('rect', { x: bx + 2, y: by - 18, width: 18, height: 18, rx: 3, fill: wC.css }, S.bub);
        K.tx(S.bub, '“Blue”', bx + 34, by + 2, { size: 30, fill: wC.css });
      }
      const edge = (i) => { const r = Math.floor(i / G.cols); return GK.cell(G, r * G.cols + G.cols - 1, {}); };   // the source rings sit on the grid's right edge: arrows never cross the dots
      const aBlue = edge(Math.floor(m.blue / 2)), aGreen = edge(Math.floor((m.blue + m.N) / 2));
      const ax0 = Lw ? bx - 10 : bx - 18, ay0 = Lw ? by - 4 : by - 8;
      const arrow = (to) => K.el('path', { d: 'M' + ax0 + ' ' + ay0 + ' C ' + (ax0 - 60) + ' ' + ay0 + ', ' + (to.x + 60) + ' ' + to.y + ', ' + (to.x + 8) + ' ' + to.y,
        fill: 'none', stroke: wC.css, 'stroke-width': Lw ? 1.2 : 2, 'stroke-dasharray': '1 0', pathLength: 1, opacity: 0 }, g);
      S.arrows = [arrow(aBlue), arrow(aGreen)];
      S.srcRings = [aBlue, aGreen].map((p, i) => K.el('circle', { cx: p.x, cy: p.y, r: Lw ? 7 : 12, fill: 'none', stroke: wC.css, 'stroke-width': Lw ? 1.3 : 2.2, opacity: 0 }, g));
      S.emLab = Lw ? K.wrap(g, P.emergent.label, bx - 10, by + 42, 300, 19, { size: 15, fill: wC.css, op: 0 }).e
                   : K.wrap(g, P.emergent.label, bx - 18, by + 66, RC.w - 10, 36, { size: 30, cls: 's', fill: wC.css, op: 0 }).e;
      /* return: back down to the case */
      S.retLab = ctxText(FIG.grid.fill(P.returnLine, ctx, P), ctx.role('answer').css);
      void dim;
    },
    render(lt, ctx, P, S) {
      const K = ctx.K, T = ctx.T, ex = ctx.ex, G = ctx.po.geom;
      const r1 = T.rung1[0], r2 = T.rung2[0], I = T.integrate[0], ret = T.return[0];
      const back = ctx.go(ret + 0.2, 0.8);
      /* rung 0: the city, cast row by row; counts after the dots (L4) */
      K.setOp(S.label, ctx.go(0, 0.5, 'defer') * (1 - back));
      S.rows.forEach((r, i) => K.setOp(r, ctx.go(0.3 + 1.6 * i / G.rows, 0.35) * (0.9 + 0.1 * back)));
      K.setOp(S.legend, ctx.go(ctx.label(P.rung0.part), 0.5));
      /* rung 1: the strip of 100 verdicts */
      const out1 = ctx.go(r2, 0.5, 'collect');
      K.setOp(S.strip, ctx.go(r1, 0.3) * (1 - out1));
      S.marks.forEach((mg, i) => K.setOp(mg, ctx.go(r1 + 0.1 + 0.9 * Math.floor(i / 10) / 10, 0.3)));
      K.setOp(S.stripTitle, ctx.go(r1 + 0.2, 0.4) * (1 - out1));
      K.setOp(S.stripCount, ctx.go(ctx.label(P.rungs[0].part), 0.5) * (1 - out1));
      /* rung 2: both ways */
      K.setOp(S.both, ctx.go(r2 + 0.3, 0.3) * (1 - 0.55 * ctx.go(I, 0.5)) * (1 - back));
      S.bothRows.forEach((rg, i) => K.setOp(rg, ctx.go(r2 + 0.3 + i * 0.5, 0.4)));
      K.setOp(S.bothKey, ctx.go(ctx.label(P.rungs[1].part), 0.5) * 0.9);
      /* integrate: one report, two sources */
      K.setOp(S.bub, ctx.go(I + 0.3, 0.4) * (1 - back));
      S.arrows.forEach((a, i) => { const p = ctx.go(I + 0.8 + i * 0.9, 0.9, 'rest'); a.setAttribute('stroke-dasharray', p.toFixed(3) + ' 1'); K.setOp(a, (p > 0 ? 0.9 : 0) * (1 - back)); });
      S.srcRings.forEach((r, i) => K.setOp(r, ctx.go(I + 1.6 + i * 0.9, 0.3) * (1 - back)));
      K.setOp(S.emLab, ctx.go(ctx.label(P.emergent.term), 0.5) * (1 - back));
      /* return: the case again, with its parts named */
      K.setOp(S.retLab, back);
      void ex;
    },
  };
})();
