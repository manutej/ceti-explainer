/* ════════════════════════════════════════════════════════════════════
   modules/mass-reseat — counted marks re-seat through a junction, conserved
   --------------------------------------------------------------------
   MODULE-OPERAD §8. Generalised from films/typesafe M3 (scenes.js u3 +
   layers/yard.js): any bins, any probabilities, any kept subset, two variants.
     renormalize  PO track: marks ride back through the junction J and out along
                  the open tracks; p′ = p ÷ Σkept (ratios survive).
     condition    PO grid: the evidence rings the kept marks; the rest dim IN PLACE
                  (the denominator stays visible); the kept marks gather into one
                  new whole; p′ = count(focus) ÷ count(kept).
   Phases: queue .20 · close .10 (cue) · reseat .30 · count .20 (payoff) · hold .10 · name .10
   p5 layer: means P.means (e.g. "each mark is 1/1,000 of the probability mass").
   Colour variables: mass, kept, dropped, answer (+ evidence and each bin group in condition).
   Aspects (CHANNELS §3): condition-on-grid composes itself at every aspect — geo() gives 'wide' (16:9, the
   original constants), 'column' (portrait: the grid left, the counted block, number and arithmetic in the right
   column above ctx.lay.reserve) and 'side' (a stacked contrast half: grid | block | number in one row).
   The track (renormalize) figure has no portrait composition yet: compile FITs it.
   ──────────────────────────────────────────────────────────────────── */
(function () {
  const DUR = 20;
  const counts = (ps, n) => {   // largest remainder (Σ = n exactly) — the conserved split
    const raw = ps.map(p => p * n), fl = raw.map(Math.floor); let left = n - fl.reduce((a, b) => a + b, 0);
    raw.map((r, i) => [r - fl[i], i]).sort((a, b) => b[0] - a[0] || a[1] - b[1]).forEach(([, i]) => { if (left > 0) { fl[i]++; left--; } });
    return fl;
  };
  const pct = (x) => Math.round(x * 100) + ' %';
  const fmtN = (n) => Math.round(n).toLocaleString('en-US');

  /* ---------- canonical numbers (L7): every printed number is one of these ---------- */
  function model(P) {
    const tot = P.bins.reduce((a, b) => a + b.p, 0), p = P.bins.map(b => b.p / tot);
    const keep = P.bins.map(b => P.keep.includes(b.id));
    const mass = p.reduce((a, x, i) => a + (keep[i] ? x : 0), 0);
    const pp = p.map((x, i) => (keep[i] ? x / mass : 0));
    const before = counts(p, P.N);
    const after = P.variant === 'renormalize' ? counts(pp, P.N) : before.slice();
    const fi = P.bins.findIndex(b => b.id === (P.focus || P.keep[0]));
    const keptN = before.reduce((a, c, i) => a + (keep[i] ? c : 0), 0);
    const focusGroup = P.bins[fi].group;
    const groupN = before.reduce((a, c, i) => a + (P.bins[i].group === focusGroup ? c : 0), 0);
    const sample = (ps, u) => { let c = 0; for (let i = 0; i < ps.length; i++) { c += ps[i]; if (u < c) return i; } return ps.length - 1; };
    return { p, pp, keep, mass, before, after, fi, keptN, groupN, sample };
  }

  /* where everything sits, per layout mode (all numbers in viewBox units) */
  function geo(ctx, P, m) {
    const L = ctx.lay, G = ctx.po.geom, K = ctx.K, rowsK = Math.ceil(m.keptN / 20);
    if (L.wide) {
      const B = { cols: 20, pitch: 11, x0: 560, y0: 200 }, blockY1 = B.y0 + (rowsK - 1) * B.pitch, focusY1 = B.y0 + (Math.ceil(m.before[m.fi] / B.cols) - 1) * B.pitch;
      const bigY = blockY1 < 300 ? Math.max(300, blockY1 + 52) : 300;   // a short block keeps its "of N" clear of the big number
      return { mode: 'wide', B, ctx: { x: G.x0 - 4, y: 126, size: 15 }, keep: { x: G.x0 - 4, y: G.y0 - 18, size: 13, ls: 1.5 },
        legend: { x: G.x0 - 4, y: G.y1 + 32, size: 15, r: 3.6, stack: false }, blockLab: { x: B.x0 - 2, y: B.y0 - 22, size: 13 },
        lab: 15, nFY: focusY1 - B.y0 > 100 ? B.y0 + 12 : (B.y0 + focusY1) / 2 + 5, nAllY: blockY1 - 2, labX: B.x0 + (B.cols - 1) * B.pitch + 22,
        big: { x: 820, y: bigY, size: 44 }, eq: { x: 822, y: bigY + 26 }, foot: true };
    }
    const lab = L.fs.label, maxRows = Math.max(rowsK, Math.ceil(P.N / 40));
    if (L.mode === 'side') {   // a stacked contrast half: [grid] [block] [labels] [number]
      const pitch = Math.max(5, Math.min(9, (L.F.y1 - 8 - G.y0) / Math.max(1, maxRows - 1)));
      const B = { cols: 20, pitch, x0: G.x1 + 34, y0: G.y0 };
      const blockY1 = B.y0 + (rowsK - 1) * pitch, focusY1 = B.y0 + (Math.ceil(m.before[m.fi] / 20) - 1) * pitch, labX = B.x0 + 19 * pitch + 44;
      // side: no "120 Blue / of 290" column (the arithmetic under the number says it); the number column follows the bracket
      return { mode: 'side', B, ctx: null, keep: { x: G.x0 - 4, y: G.y0 - 20, size: lab, ls: 0.6 }, legend: null, blockLab: null, lab, noCounts: true,
        nFY: B.y0, nAllY: blockY1, labX,
        big: { x: labX, y: B.y0 + 66, size: 72 }, eq: { x: labX + 2, y: B.y0 + 110 }, foot: false };
    }
    const GP = root.Layout.gridPlan(G.n, L.F), RC = GP.RC, bigH = L.fs.big * 1.05;
    const yTop = RC.y0 + 44, yMax = RC.y1 - (L.reserve || 0) - bigH - 30;
    const pitch = Math.max(8, Math.min(20, (RC.w - 30 - 6 * lab) / 19, (yMax - yTop) / Math.max(1, rowsK - 1)));
    const B = { cols: 20, pitch, x0: RC.x0 + 4, y0: yTop };
    const blockY1 = B.y0 + (rowsK - 1) * pitch, focusY1 = B.y0 + (Math.ceil(m.before[m.fi] / 20) - 1) * pitch;
    const bigY = blockY1 + 26 + L.fs.big * 0.78;
    return { mode: 'column', B, GP, ctx: { x: L.F.x0, y: GP.ctxY, size: 30, cls: 's', maxW: L.F.w }, keep: { x: L.F.x0, y: GP.ctxY, size: lab, ls: 1 },
      legend: { x: GP.x0 - 4, y: GP.legendY, size: lab, r: 7, stack: true }, blockLab: { x: B.x0 - 2, y: RC.y0 + 14, size: lab }, lab,
      nFY: Math.max(B.y0 + lab * 0.7, (B.y0 + focusY1) / 2 + lab * 0.35), nAllY: Math.max(blockY1, focusY1 + lab * 1.6), labX: B.x0 + 19 * pitch + 30,
      big: { x: RC.x0, y: bigY, size: L.fs.big }, eq: null, eqRight: true, foot: true };
  }
  const root = typeof window !== 'undefined' ? window : globalThis;

  Module.define('mass-reseat', {
    kind: 'scene',
    aspects: (P, po) => P.variant === 'condition' && po.kind === 'grid',
    /** anchors other modules read (contrast-split ties and boxes) — set in build, in this ctx's coordinates */
    anchorsOf: (ctx) => ctx.S && ctx.S.anch,
    types: ['T1', 'T2', 'T5'],
    evidence: 'PED #16 count-dont-claim, #8 cue-the-cause; CA §3 #1 (the typesafe throat)',
    ports: { needs: ['parts', 'instance'], gives: ['rule'], consumes: [], po: { in: ['track', 'grid'], out: 'same' }, regions: ['body', 'foot'] },
    params: {
      bins: { type: 'array', required: true, len: [2, 10] },          // [{id, label, p, group?}]
      N: { type: 'int', default: 1000, range: [100, 2000] },
      keep: { type: 'array', required: true },
      variant: { type: 'enum', of: ['renormalize', 'condition'], default: 'renormalize' },
      focus: { type: 'string' },                                       // the bin whose p′ is the answer (default keep[0])
      u: { type: 'num', default: 0.55, range: [0, 0.999] },            // renormalize: the draw (CP §5)
      means: { type: 'string', default: 'each mark is 1/1,000 of the probability mass' },
      legend: { type: 'array', default: [] },                          // condition: [{group, label}] for the group key
      keepLabel: { type: 'string', default: 'kept' },
      answerLabel: { type: 'string', default: '' },
      foot: { type: 'object', default: {} },                           // per-phase foot lines; {N} {kept} {dropped} {mass} {answer} {keptN}
      principle: { type: 'object', required: true },                   // {term, line}
      control: { type: 'object', default: {} },                        // {label, question, on, off}
      notes: { type: 'array', default: [] },                           // honesty additions from the plan
    },
    uses: (P) => ['mass', 'kept', 'dropped', 'answer'].concat(P.variant === 'condition' ? ['evidence'].concat([...new Set(P.bins.map(b => b.group))]) : []),
    duration: () => DUR,
    phases: (P) => [
      { id: 'queue', f: 0.20, introduces: ['mass'], marks: [{ term: 'bins', at: 0.5 }, { term: 'mass', at: 0.9 }], labels: [{ term: 'bins', at: P.variant === 'condition' ? 3.0 : 1.2 }, { term: 'mass', at: 3.3 }], shows: ['p', 'counts'] },
      { id: 'close', f: 0.10, introduces: ['keep'], marks: [{ term: 'keep', at: 0.2 }], labels: [{ term: 'keep', at: 0.9 }], cue: { target: 'keep', at: 0.2, dur: 0.8 }, shows: ['dropped'] },
      { id: 'reseat', f: 0.30, introduces: [], marks: [{ term: 'reseat', at: 0.2 }] },
      { id: 'count', f: 0.20, introduces: ["p'"], payoff: true, marks: [{ term: "p'", at: 0 }], labels: [{ term: "p'", at: 1.8 }], shows: ['pPrime', 'answer', 'keptN'] },
      { id: 'hold', f: 0.10, hold: true },
      { id: 'name', f: 0.10, names: [{ term: P.principle.term, principle: true, at: 0.2 }] },
    ],
    numbers: (P) => {
      const m = model(P);
      return {
        p: (i) => m.p[i], counts: (i) => m.before[i], pPrime: (i, on) => (on === false ? m.p[i] : m.pp[i]),
        after: (i, on) => (on === false ? m.before[i] : m.after[i]),
        dropped: () => 1 - m.mass, keptN: () => m.keptN,
        answer: (on) => (on === false ? (P.variant === 'condition' ? m.groupN / P.N : m.p[m.fi]) : m.pp[m.fi]),
        drawn: (on) => m.sample(on === false ? m.p : m.pp, P.u),
      };
    },
    out: (P, po) => PO.with(po, { reseated: P.keep.slice(), variant: P.variant }),
    controls: (P) => [{ key: 'on', kind: 'toggle', default: true, jumpPhase: 'close',
      label: P.control.label || (P.variant === 'condition' ? 'Use the evidence' : 'Constrain'),
      question: P.control.question || 'What happens to the closed bins’ weight?', on: P.control.on || 'on', off: P.control.off || 'off',
      result: (v) => { const m = model(P), a = v === false ? (P.variant === 'condition' ? m.groupN / P.N : m.p[m.fi]) : m.pp[m.fi];
        return (P.answerLabel || P.bins[m.fi].label) + ' → ' + (P.variant === 'condition' ? pct(a) : a.toFixed(3)); } }],
    audit: (P) => {
      const m = model(P), msgs = [];
      const sumN = (a) => a.reduce((x, y) => x + y, 0);
      if (Math.abs(P.bins.reduce((a, b) => a + b.p, 0) - 1) > 1e-6) msgs.push('Σp ≠ 1');
      if (sumN(m.before) !== P.N || sumN(m.after) !== P.N) msgs.push('marks not conserved');
      if (Math.abs(m.pp.reduce((a, b) => a + b, 0) - 1) > 1e-9) msgs.push("Σp′ ≠ 1");
      const ks = m.keep.map((k, i) => (k ? i : -1)).filter(i => i >= 0);
      for (let a = 1; a < ks.length; a++) if (Math.abs(m.pp[ks[a]] / m.pp[ks[0]] - m.p[ks[a]] / m.p[ks[0]]) > 1e-9) msgs.push('ratio not preserved');
      if (!P.keep.every(id => P.bins.some(b => b.id === id))) msgs.push('keep names an unknown bin');
      if (m.fi < 0 || !m.keep[m.fi]) msgs.push('focus is not kept');
      if (P.variant === 'condition' && Math.abs(m.before[m.fi] / m.keptN - m.pp[m.fi]) > 0.006) msgs.push('counted answer ≠ p′ (grid rounding)');
      return { ok: !msgs.length, msg: msgs.join('; '),
        note: 'mass-reseat ' + P.variant + ': ' + (P.variant === 'condition' ? m.before[m.fi] + '/' + m.keptN + ' = ' + pct(m.pp[m.fi]) : "p′ " + m.pp.filter((x, i) => m.keep[i]).map(x => x.toFixed(3)).join(' ')) };
    },
    honesty: (P) => (P.variant === 'renormalize'
      ? ['illustrative logits', 'per step only: one junction, not a whole answer', 'masked (precomputed), not checked']
      : ['a classroom problem: the dots draw the stated proportions, not data', 'assumes the evidence is independent of everything else']).concat(P.notes),
    expertise: 'novice',

    /* ---------- the marks: one pure function of (lt, on) shared by p5 and the SVG fallback ---------- */
    _plan(ctx, P, on) {
      ctx._mr = ctx._mr || {};
      const key = on ? 'on' : 'off'; if (ctx._mr[key]) return ctx._mr[key];
      const m = model(P), po = ctx.po, out = { m };
      if (po.kind === 'track') {
        const TK = PO.get('track'), TR = ctx._TR || (ctx._TR = TK.tables(po.geom));
        const lab = Math.max.apply(null, P.bins.map(b => b.label.length)) * 9.2;   // ribbons start clear of the longest token label (mono 15)
        const geom = Object.assign({}, po.geom, { queue: Object.assign({}, po.geom.queue, { x0: Math.max(po.geom.queue.x0, po.geom.labels.tokX + 20 + lab) }) });
        const after = on ? m.after : m.before, ncol = Math.ceil(Math.max.apply(null, m.before.concat(m.after)) / geom.queue.rows);
        const marks = [];
        P.bins.forEach((b, i) => { for (let j = 0; j < m.before[i]; j++) { const sl = TK.slot(geom, TR, i, j, ncol); marks.push({ i, j, s: sl.s, off: sl.off }); } });
        for (let i = 0; i < P.bins.length; i++) { const own = marks.filter(q => q.i === i).sort((a, b) => b.j - a.j); own.forEach((q, k) => { q.f0 = k / Math.max(1, own.length); }); }
        if (on) {   // the throat: closed marks (nearest J first) ↔ new open slots (shallowest first, merged by fraction)
          const src = marks.filter(q => !m.keep[q.i]).sort((a, b) => a.s - b.s || a.off - b.off), dst = [];
          P.bins.forEach((b, i) => { if (!m.keep[i]) return; const g = after[i] - m.before[i]; for (let n = 0; n < g; n++) { const sl = TK.slot(geom, TR, i, m.before[i] + n, ncol); dst.push({ i, f: (n + 0.5) / g, s: sl.s, off: sl.off }); } });
          dst.sort((a, b) => a.f - b.f || a.i - b.i);
          src.forEach((q, k) => { q.mv = { k: k / Math.max(1, src.length - 1), to: dst[k] }; });
        }
        Object.assign(out, { TR, TK, marks, ncol });
      } else {
        const GK = PO.get('grid'), g = po.geom, rng = ctx.rng('order');
        const groups = [...new Set(P.bins.map(b => b.group))];
        const cells = [];   // grid order: by group (first group first); kept/unkept shuffled within a group (seeded)
        groups.forEach(gr => {
          const own = []; P.bins.forEach((b, i) => { if (b.group === gr) for (let j = 0; j < m.before[i]; j++) own.push(i); });
          for (let a = own.length - 1; a > 0; a--) { const r = Math.floor(rng() * (a + 1)); const x = own[a]; own[a] = own[r]; own[r] = x; }
          own.forEach(i => cells.push(i));
        });
        const B = geo(ctx, P, m).B;
        const kept = []; groups.forEach(gr => cells.forEach((i, c) => { if (m.keep[i] && P.bins[i].group === gr) kept.push(c); }));
        const dest = GK.block(kept.length, B.cols, B.pitch, B.x0, B.y0), pos = {};
        kept.forEach((c, n) => { pos[c] = { to: dest[n], k: n / Math.max(1, kept.length - 1) }; });
        const dots = cells.map((i, c) => ({ i, c, filled: groups.indexOf(P.bins[i].group) === 0, kept: m.keep[i], focus: P.bins[i].group === P.bins[m.fi].group,
          from: GK.cell(g, c), mv: on && pos[c] ? pos[c] : null }));
        const focusRows = Math.ceil(dest.filter((_, n) => n < m.before[m.fi]).length / B.cols);
        Object.assign(out, { dots, B, rowsK: Math.ceil(kept.length / B.cols), focusRows });
      }
      return (ctx._mr[key] = out);
    },

    /** frame(lt): buckets of marks { v (variable), a (alpha), shape, pts[] } + rings — pure in (lt, on) */
    _frame(ctx, P, lt, on) {
      const self = Module.get('mass-reseat'), pl = self._plan(ctx, P, on), m = pl.m, ex = ctx.ex, E = ctx.E, rm = ctx.rm, T = ctx.T;
      const go = (a, d, e) => (rm ? (lt >= a + d ? 1 : 0) : E[e || 'glaser'](ex.prog(lt, a, a + d)));
      const out = { buckets: [], rings: [], flight: [] };
      if (pl.marks) {
        const TR = pl.TR, TK = pl.TK, tmp = [0, 0], q0 = T.queue[0] + 0.9, fillSpan = 2.1, v0 = 520;
        const closeA = T.close[0] + 0.2, nC = m.keep.filter(k => !k).length;
        const openK = on ? go(closeA + Math.max(0, nC - 1) * 0.12, 0.4, 'rest') : 0;
        let ci = 0; const closeK = m.keep.map(k => (k ? 0 : (on ? go(closeA + (ci++) * 0.12, 0.3, 'rest') : 0)));
        const trem = rm || !on ? 0 : Math.sin(Math.PI * ex.prog(lt, T.close[0], T.reseat[0] + 0.2));
        const bk = P.bins.map((b, i) => ({ i, pts: [] }));
        const RA = T.reseat[0] + 0.2, RD = 2.6, RS = 1.8;
        for (const q of pl.marks) {
          let s, off, i = q.i, flying = false;
          const t0 = q0 + q.f0 * (fillSpan - q.s / v0);
          if (rm) { if (lt < q0 + fillSpan) continue; s = q.s; off = q.off; }
          else { const d = (lt - t0) * v0; if (d <= 0) continue; s = Math.min(q.s, d); off = q.off * lat(q.s - s); }
          let jx = 0, jy = 0;
          if (q.mv) {
            const a = RA + RS * q.mv.k, u = rm ? (lt >= a + RD ? 1 : 0) : ex.prog(lt, a, a + RD);
            if (u > 0) {
              const tot = q.s + q.mv.to.s, d = tot * ex.eio(u);
              if (d < q.s) { s = q.s - d; off = q.off * lat(d); } else { i = q.mv.to.i; s = d - q.s; off = q.mv.to.off * lat(q.mv.to.s - s); }
              flying = u < 1;
              const lb = (lt - (a + RD)) / 0.3;
              if (u >= 1 && lb >= 0 && lb < 1 && !rm) { TK.onTrack(TR, q.mv.to.i, q.mv.to.s, tmp); out.rings.push(tmp[0], tmp[1] + q.mv.to.off, 4.5 * (1 - lb), (1 - lb) * 0.8); }
            } else if (trem > 0) { const id = q.i * 1000 + q.j; jx = 0.6 * trem * Math.sin(lt * 61 + id * 1.7); jy = 0.6 * trem * Math.sin(lt * 47 + id * 2.3); }
          }
          TK.onTrack(TR, i, s, tmp);
          if (flying) out.flight.push(tmp[0], tmp[1] + off); else bk[i].pts.push(tmp[0] + jx, tmp[1] + off + jy);
        }
        bk.forEach(b => {
          const k = m.keep[b.i];
          if (k && on) { out.buckets.push({ v: 'mass', a: 0.66 * (1 - openK), pts: b.pts }, { v: 'kept', a: 0.9 * openK, pts: b.pts }); }
          else out.buckets.push({ v: k || !on ? 'mass' : 'dropped', a: k || !on ? 0.66 : 0.66 - 0.42 * closeK[b.i], pts: b.pts });
        });
        out.mw = 2.5; out.mh = 2;
      } else {
        const castA = T.queue[0] + 0.4, cast = 2.4, n = pl.dots.length, rings = go(T.close[0] + 0.2, 0.8, 'glaser');
        const dimK = on ? go(T.close[0] + 0.5, 0.9, 'rest') : 0, RA = T.reseat[0] + 0.2, RD = 1.3, RS = 3.6;
        const tint = go(T.count[0], 1.4, 'defer');
        const fb = { filled: { pts: [], ptsK: [], ptsT: [] }, hollow: { pts: [], ptsK: [], ptsT: [] } }, ringPts = [];
        for (let c = 0; c < n; c++) {
          const d = pl.dots[c], ap = rm ? (lt >= castA + cast ? 1 : 0) : ex.prog(lt, castA + cast * (c / n) * 0.85, castA + cast * (c / n) * 0.85 + 0.25);
          if (ap <= 0) continue;
          let x = d.from.x, y = d.from.y + (1 - ap) * -6;
          const S = d.filled ? fb.filled : fb.hollow;
          if (d.mv) {
            const a = RA + RS * d.mv.k, u = rm ? (lt >= a + RD ? 1 : 0) : E.rest(ex.prog(lt, a, a + RD));
            x = d.from.x + (d.mv.to.x - d.from.x) * u; y = d.from.y + (d.mv.to.y - d.from.y) * u - Math.sin(Math.PI * u) * 40;
            const ta = d.focus ? tint : 0;
            (ta > 0.5 ? S.ptsT : S.ptsK).push(x, y);
            ringPts.push(x, y);
          } else if (on && d.kept) { S.ptsK.push(x, y); ringPts.push(x, y); }
          else if (!on && d.focus && tint > 0.5) S.ptsT.push(x, y);
          else S.pts.push(x, y);
        }
        const gF = P.bins.find(b => groupsFirst(P) === b.group).group, gH = P.bins.find(b => b.group !== gF).group;
        out.buckets.push({ v: gF, a: 0.85 - 0.62 * dimK, shape: 'filled', pts: fb.filled.pts }, { v: gH, a: 0.8 - 0.58 * dimK, shape: 'hollow', pts: fb.hollow.pts },
          { v: gF, a: 0.9, shape: 'filled', pts: fb.filled.ptsK }, { v: gH, a: 0.9, shape: 'hollow', pts: fb.hollow.ptsK },
          { v: 'answer', a: 0.95, shape: 'filled', pts: fb.filled.ptsT }, { v: 'answer', a: 0.95, shape: 'hollow', pts: fb.hollow.ptsT });
        if (on && rings > 0) out.buckets.push({ v: 'evidence', a: 0.85 * rings * (1 - 0.65 * go(T.count[0], 1, 'defer')), shape: 'ring', pts: ringPts });
        out.r = pl.dots.length ? ctx.po.geom.r : 2.6;
      }
      return out;
    },

    build(svg, ctx, P) {
      const K = ctx.K, g = ctx.root('body'), po = ctx.po, m = model(P), S = (ctx.S = {});
      const ink = ctx.base('ink'), dim = ctx.base('dim'), line = ctx.base('line');
      S.foot = K.foot(ctx.root('foot'), 486);
      S.chip = K.chip(ctx.root('foot'), P.principle.term + '  ·  ' + P.principle.line, 480, K.footY(492), ctx.role('answer').css);
      S.marks = ctx.hasP5 ? null : K.el('g', null, g);   // SVG fallback for the marks (one path per bucket)
      if (S.marks) S.paths = [];
      if (po.kind === 'track') {
        const G = po.geom, J = G.J, F = G.fan, TR = ctx._TR || (ctx._TR = PO.get('track').tables(G));
        S.ctxLine = K.tx(g, po.state.context || '', G.context.x, G.context.y, { size: 15, fill: ink.css, op: 0 });
        S.tail = K.tx(g, '', G.context.x + K.tw(S.ctxLine), G.context.y, { size: 15, fill: ctx.role('kept').css, op: 0 });
        S.entry = K.Rails(g, [K.P(G.entry.x0, J.y), K.P(J.x, J.y)], dim.a(0.65));
        S.tr = P.bins.map((b, i) => {
          const y = F.ys[i], tg = K.el('g', null, g);
          const curve = K.cub(K.P(J.x, J.y), K.P(J.x + 64, J.y), K.P(J.x + 86, y), K.P(F.xBend, y), 26);
          const appr = K.Rails(tg, curve, dim.a(0.55)), beyond = K.Rails(tg, [K.P(F.xBend + 14, y), K.P(G.labels.probX - 14, y)], dim.a(0.55));
          const blade = K.Gate(tg, F.xBend, y, 14);
          const lab = K.tx(tg, b.label, G.labels.tokX + 6, y - 9, { size: 15, fill: ink.css, op: 0 });
          const strike = K.el('line', { x1: G.labels.tokX + 4, y1: y - 14, x2: G.labels.tokX + 4, y2: y - 14, stroke: dim.css, 'stroke-width': 1.2, opacity: 0 }, tg);
          const prob = K.tx(tg, '', G.labels.probX, y + 5, { size: 15, fill: ink.css, op: 0 });
          return { i, y, tg, appr, beyond, blade, lab, strike, prob, labW: K.tw(lab), Pl: K.poly(K.cat(curve, [K.P(F.xBend, y), K.P(G.labels.probX - 14, y)])) };
        });
        S.odds = K.tx(g, '', G.labels.probX + 44, F.ys[F.ys.length - 1] + 26, { size: 13, ls: 1.5, fill: dim.css, anchor: 'end', op: 0 });
        S.car = K.Car(g, ink.css);
        S.TR = TR;
      } else {
        const G = po.geom, Y = (S.geo = geo(ctx, P, m)), B = Y.B, ansC = ctx.role('answer');
        S.ctxLine = Y.ctx ? K.tx(g, po.state.label || '', Y.ctx.x, Y.ctx.y, { size: Y.ctx.size, cls: Y.ctx.cls, fill: ink.css, op: 0 }) : K.tx(g, '', 0, 0, { op: 0 });
        if (Y.ctx && Y.ctx.maxW) { let fs = Y.ctx.size; while (K.tw(S.ctxLine) > Y.ctx.maxW && fs > 28) { fs -= 1; S.ctxLine.setAttribute('font-size', fs); } }
        S.keepLab = K.tx(g, '', Y.keep.x, Y.keep.y, { size: Y.keep.size, ls: Y.keep.ls, fill: ctx.role('evidence').css, op: 0 });
        S.legend = K.el('g', { opacity: 0 }, g);
        if (Y.legend) {
          let lx = Y.legend.x, ly = Y.legend.y; const LG = Y.legend;
          P.legend.forEach((l, n) => {
            const filled = n === 0, c = ctx.role(l.group).css;
            K.el('circle', { cx: LG.stack ? lx + LG.r : lx + 4, cy: LG.stack ? ly - LG.size * 0.34 : ly - 5, r: LG.r, fill: filled ? c : 'none', stroke: c, 'stroke-width': LG.stack ? 2 : 1.2 }, S.legend);
            const tx = K.tx(S.legend, l.label.replace('{n}', fmtN(P.bins.filter(b => b.group === l.group).reduce((a, b) => a + m.before[P.bins.indexOf(b)], 0))), LG.stack ? lx + LG.r * 2 + 12 : lx + 14, ly, { size: LG.size, fill: ink.css });
            if (LG.stack) ly += LG.size * 1.3; else lx += 14 + K.tw(tx) + 28;
          });
        }
        const rowsK = Math.ceil(m.keptN / B.cols), rowsF = Math.ceil(m.before[m.fi] / B.cols);
        S.B = B; S.blockY1 = B.y0 + (rowsK - 1) * B.pitch; S.focusY1 = B.y0 + (rowsF - 1) * B.pitch;
        S.brF = K.bracket(g); S.brAll = K.bracket(g);
        S.nF = K.tx(g, '', Y.labX, Y.nFY, { size: Y.lab, fill: ansC.css, op: 0 });
        S.nAll = K.tx(g, '', Y.labX, Y.nAllY, { size: Y.lab, fill: dim.css, op: 0 });
        S.big = K.tx(g, '', Y.big.x, Y.big.y, { size: Y.big.size, fill: ansC.css, weight: 700, op: 0 });
        if (Y.eqRight) {   // portrait column: the arithmetic sits beside the number, on its baseline
          K.setText(S.big, Math.round(100 * m.pp[m.fi]) + '%'); const bw = K.tw(S.big); K.setText(S.big, '');
          S.eq = K.tx(g, '', Y.big.x + bw + 24, Y.big.y - 6, { size: Y.lab, fill: ansC.css, op: 0 });
        } else S.eq = K.tx(g, '', Y.eq.x, Y.eq.y, { size: Y.mode === 'wide' ? 15 : Y.lab, fill: ansC.css, op: 0 });
        S.blockLab = Y.blockLab ? K.tx(g, '', Y.blockLab.x, Y.blockLab.y, { size: Y.blockLab.size, ls: Y.mode === 'wide' ? 1.5 : 0.6, fill: dim.css, op: 0 }) : K.tx(g, '', 0, 0, { op: 0 });
        if (!Y.blockLab) S.blockLab.setAttribute('visibility', 'hidden');
        if (!Y.ctx) S.ctxLine.setAttribute('visibility', 'hidden');
        const bx1 = B.x0 + (B.cols - 1) * B.pitch;
        S.anch = { same: Y.mode === 'side' ? { x: Y.keep.x - 4, y: Y.keep.y - Y.lab * 0.35 } : { x: Y.labX, y: Y.nFY - Y.lab * 0.35 }, answer: { x: Y.big.x + (Y.mode === 'wide' ? 40 : Y.mode === 'side' ? 92 : Y.big.size * 0.9), y: Y.mode === 'side' ? Y.big.y + 6 : Y.big.y - Y.big.size * 0.18 },
          block: { x0: B.x0, y0: B.y0, x1: bx1, y1: S.blockY1 }, grid: { x0: G.x0, y0: G.y0, x1: G.x1, y1: G.y1 } };
        if (!Y.foot) { S.foot.set = () => {}; S.chip.set = () => {}; }
        if (Y.noCounts) { S.nF.setAttribute('visibility', 'hidden'); S.nAll.setAttribute('visibility', 'hidden'); }
      }
      void line;
    },

    render(lt, ctx, P) {
      const K = ctx.K, S = ctx.S, ex = ctx.ex, E = ctx.E, T = ctx.T, m = model(P), N = ctx.numbers;
      const on = ctx.ctl('on', true) !== false, ink = ctx.base('ink'), dim = ctx.base('dim');
      const keptC = ctx.role('kept'), ansC = ctx.role('answer');
      const nKeep = m.keep.filter(Boolean).length, nDrop = P.bins.length - nKeep;
      const subs = { '{N}': fmtN(P.N), '{kept}': String(nKeep), '{dropped}': String(nDrop), '{mass}': m.mass.toFixed(2), '{droppedPct}': pct(1 - m.mass),
        '{droppedN}': fmtN(P.N - m.keptN), '{keptN}': fmtN(m.keptN), '{focusN}': fmtN(m.before[m.fi]), '{answer}': P.variant === 'condition' ? pct(N.answer(on)) : N.answer(on).toFixed(3),
        '{u}': P.u.toFixed(2), '{drawn}': P.bins[N.drawn(on)].label, '{groupN}': fmtN(m.groupN), '{groupPct}': pct(m.groupN / P.N) };
      const fill = (s) => Object.keys(subs).reduce((acc, k) => acc.split(k).join(subs[k]), s)
        .replace(/\{n:([\w-]+)\}/g, (_, id) => fmtN(m.before[P.bins.findIndex(b => b.id === id)]));
      /* the foot: one line per phase, from the plan's words + canonical numbers; the chip replaces it at the name */
      const F = P.foot || {}, footAt = { queue: ctx.label('mass'), close: ctx.label('keep'), reseat: T.reseat[0] + 0.5, count: ctx.label("p'") };
      const ph = ['count', 'reseat', 'close', 'queue'].find(id => lt >= footAt[id]);
      const key = ph && !on && F[ph + 'Off'] ? ph + 'Off' : ph;
      const nameP = ctx.go(ctx.named(P.principle.term), 0.6);
      const fo = ph ? ctx.go(footAt[ph], 0.4, 'defer') : 0;
      S.foot.set(key && F[key] ? fill(F[key]) : '', fo * 0.95 * (1 - (on ? nameP : 0)));
      S.chip.set(on ? nameP : 0);
      const fr = Module.get('mass-reseat')._frame(ctx, P, lt, on);
      if (S.marks) drawSvgMarks(ctx, S, fr);

      if (ctx.po.kind === 'track') {
        const G = ctx.po.geom, J = G.J;
        K.setOp(S.ctxLine, ctx.go(0, 0.5, 'defer'));
        S.entry.draw(ctx.go(0.1, 0.8));
        const closeA = T.close[0] + 0.2; let ci = 0;
        const allShut = closeA + Math.max(0, nDrop - 1) * 0.12 + 0.3;
        const np = on ? ctx.go(T.count[0], 1.4, 'glaser') : 0;
        const pick = N.drawn(on), takeP = ctx.go(T.count[0] + 2.4, 1.0, 'warmIn');
        S.tr.forEach((r, i) => {
          const fp = ctx.go(0.5 + i * 0.08, 0.8);
          r.appr.draw(Math.min(1, fp * 1.6)); r.beyond.draw(Math.max(0, fp * 1.6 - 0.6));
          const open = m.keep[i] || !on;
          const cp = open ? 0 : ctx.go(closeA + (ci++) * 0.12, 0.3, 'rest');
          r.blade.set(90 * cp, !open ? dim.css : (on && lt >= allShut ? keptC.css : ink.a(0.7)), ex.clamp(fp * 3 - 1.5));
          const taken = i === pick && takeP > 0;
          r.appr.col(taken ? keptC.css : (cp > 0.5 ? dim.a(0.3) : dim.a(0.55)));
          r.beyond.col(taken ? keptC.css : (cp > 0.5 ? dim.a(0.22) : dim.a(0.55)));
          const lp = ctx.go(ctx.label('bins') + i * 0.1, 0.5);
          K.setOp(r.lab, lp * (1 - 0.6 * cp)); K.tr(r.lab, 0, (1 - lp) * 6);
          r.lab.setAttribute('fill', taken && takeP > 0.9 ? keptC.css : ink.css);
          r.strike.setAttribute('x2', (G.labels.tokX + 4 + (r.labW + 4) * cp).toFixed(1)); K.setOp(r.strike, cp > 0 ? 0.9 : 0);
          const v = ex.lerp(m.p[i], N.pPrime(i, on), np);
          K.setText(r.prob, v.toFixed(3));
          r.prob.setAttribute('fill', m.keep[i] && on && np > 0.5 ? keptC.css : (cp > 0.5 ? dim.css : ink.css));
          K.setOp(r.prob, ctx.go(ctx.label('bins') + 0.2 + i * 0.1, 0.5) * (cp > 0.5 ? 0.55 : 1));
        });
        const after = T.count[0] + 0.2;
        K.setText(S.odds, on && lt >= after ? 'AFTER THE MASK · RESCALED TO 100 %' : 'WHAT THE MODEL WANTS NEXT');
        K.setOp(S.odds, ctx.go(ctx.label('bins') + 0.6, 0.5) * 0.9 * (on && lt > T.close[0] && lt < after ? 1 - ex.prog(lt, T.close[0], T.close[0] + 0.3) : 1));
        // the draw: the car takes the sampled track; the context line gains the token (the PO, written)
        const chosen = S.tr[pick], takeEnd = chosen.Pl.len - 40;
        let pos = { x: ex.lerp(G.entry.x0 + 8, J.x - 9, ctx.go(0.3, 1.2, 'collect')), y: J.y, a: 0 };
        if (takeP > 0) { const s = ex.lerp(-9, takeEnd, takeP); pos = s < 0 ? { x: J.x + s, y: J.y, a: 0 } : K.at(chosen.Pl, s); }
        K.placeCar(S.car, pos, ctx.go(0.2, 0.4, 'defer'), takeP > 0.98 ? keptC.css : ink.css);
        K.setText(S.tail, P.bins[pick].label); S.tail.setAttribute('fill', on ? keptC.css : ctx.role('dropped').css);
        K.setOp(S.tail, ctx.go(T.count[0] + 3.4, 0.4));
      } else {
        const G = ctx.po.geom, B = S.B, bx1 = B.x0 + (B.cols - 1) * B.pitch, col = S.geo.mode === 'column';
        K.setOp(S.ctxLine, ctx.go(0, 0.5, 'defer') * (col && on ? 1 - ctx.go(ctx.label('keep') - 0.4, 0.4) : 1));
        K.setOp(S.legend, ctx.go(ctx.label('bins'), 0.5));
        K.setText(S.keepLab, on ? P.keepLabel.toUpperCase() + ' · ' + fmtN(m.keptN) : '');
        K.setOp(S.keepLab, on ? ctx.go(ctx.label('keep'), 0.5) : 0);
        K.setText(S.blockLab, on ? ('ONLY THESE ' + fmtN(m.keptN) + ' COUNT NOW') : '');
        K.setOp(S.blockLab, on ? ctx.go(T.reseat[0] + 4.6, 0.6) * 0.9 : 0);
        const c = on ? ctx.go(T.count[0], 1.4, 'glaser') : 0, cOff = !on ? ctx.go(T.count[0], 1.4, 'glaser') : 0;
        S.brF.set(bx1 + 10, B.y0 - 4, S.focusY1 + 4, ansC.css, c * 0.9);
        S.brAll.set(bx1 + 10, S.focusY1 + 8, S.blockY1 + 4, dim.css, c * 0.6);
        K.setText(S.nF, fmtN(Math.round(m.before[m.fi] * c)) + ' ' + (P.bins[m.fi].short || ''));
        K.setOp(S.nF, c);
        K.setText(S.nAll, 'of ' + fmtN(Math.round(m.keptN * c)));
        K.setOp(S.nAll, c * 0.95);
        const a = on ? N.answer(true) : N.answer(false);
        K.setText(S.big, Math.round(a * (on ? c : cOff) * 100) + '%');
        K.setOp(S.big, Math.max(c, cOff));
        K.setText(S.eq, on ? '= ' + fmtN(m.before[m.fi]) + ' ÷ ' + fmtN(m.keptN) : '= ' + fmtN(Math.round(a * P.N)) + ' ÷ ' + fmtN(P.N));
        K.setOp(S.eq, ctx.go(ctx.label("p'"), 0.5));
        void G;
      }
    },

    p5Layer: {
      z: 6, costMs: 3,
      means: 'P.means — e.g. "each mark is 1/1,000 of the probability mass" or "each mark is one cab"',
      setup(p, L, ctx, P) { const self = Module.get('mass-reseat'); self._plan(ctx, P, true); self._plan(ctx, P, false); },
      draw(p, lt, L, ctx, P) {
        const c = L.ctx, on = ctx.ctl('on', true) !== false, fr = Module.get('mass-reseat')._frame(ctx, P, lt, on);
        const SN = (v) => Math.round(v * 2) / 2;
        for (const b of fr.buckets) {
          if (!b.pts.length || b.a <= 0.003) continue;
          const col = ctx.role(b.v).a(b.a);
          c.beginPath();
          if (!b.shape) { for (let n = 0; n < b.pts.length; n += 2) c.rect(SN(b.pts[n] - fr.mw / 2), SN(b.pts[n + 1] - fr.mh / 2), fr.mw, fr.mh); c.fillStyle = col; c.fill(); continue; }
          const r = b.shape === 'ring' ? fr.r + 2.4 : (b.shape === 'hollow' ? fr.r - 0.4 : fr.r);
          for (let n = 0; n < b.pts.length; n += 2) { c.moveTo(b.pts[n] + r, b.pts[n + 1]); c.arc(b.pts[n], b.pts[n + 1], r, 0, Math.PI * 2); }
          if (b.shape === 'filled') { c.fillStyle = col; c.fill(); } else { c.lineWidth = b.shape === 'ring' ? 0.9 : 1.1; c.strokeStyle = col; c.stroke(); }
        }
        if (fr.flight.length) { c.beginPath(); for (let n = 0; n < fr.flight.length; n += 2) c.rect(SN(fr.flight[n] - 1.1), SN(fr.flight[n + 1] - 1.1), 2.2, 2.2); c.fillStyle = ctx.role('kept').a(0.95); c.fill(); }
        if (fr.rings.length) { c.lineWidth = 0.7; for (let n = 0; n < fr.rings.length; n += 4) { if (fr.rings[n + 2] < 0.3) continue; c.beginPath(); c.arc(fr.rings[n], fr.rings[n + 1], fr.rings[n + 2], 0, Math.PI * 2); c.strokeStyle = ctx.role('kept').a(fr.rings[n + 3]); c.stroke(); } }
      },
    },
  });

  function groupsFirst(P) { return P.bins[0].group; }
  function lat(dist) { const u = Math.max(0, Math.min(1, 1 - dist / 14)); return u * u * (3 - 2 * u); }   // single file in the throat
  /** SVG cut: the same buckets, one path each (no p5 on the page) */
  function drawSvgMarks(ctx, S, fr) {
    const K = ctx.K;
    fr.buckets.forEach((b, n) => {
      let e = S.paths[n]; if (!e) e = S.paths[n] = K.el('path', {}, S.marks);
      let d = '';
      if (!b.shape) for (let q = 0; q < b.pts.length; q += 2) d += 'M' + (b.pts[q] - fr.mw / 2).toFixed(1) + ' ' + (b.pts[q + 1] - fr.mh / 2).toFixed(1) + 'h' + fr.mw + 'v' + fr.mh + 'h-' + fr.mw + 'z';
      else { const r = b.shape === 'ring' ? fr.r + 2.4 : fr.r; for (let q = 0; q < b.pts.length; q += 2) d += 'M' + (b.pts[q] - r).toFixed(1) + ' ' + b.pts[q + 1].toFixed(1) + 'a' + r + ' ' + r + ' 0 1 0 ' + 2 * r + ' 0a' + r + ' ' + r + ' 0 1 0 ' + -2 * r + ' 0'; }
      e.setAttribute('d', d);
      const col = ctx.role(b.v).a(b.a);
      if (!b.shape || b.shape === 'filled') { e.setAttribute('fill', col); e.setAttribute('stroke', 'none'); }
      else { e.setAttribute('fill', 'none'); e.setAttribute('stroke', col); e.setAttribute('stroke-width', b.shape === 'ring' ? 0.9 : 1.1); }
    });
    for (let n = fr.buckets.length; n < S.paths.length; n++) S.paths[n].setAttribute('d', '');
  }
})();
