/* THE LEDGER IN MOTION · native film, revision 1 — "The honest ROI of an AI pilot" (glance, 28 s, Canvas2D).
   Leads with the expectation: an AVERAGE month (exact) is kept on one page — 100 hourglasses = the vendor's 2,000 h
   claim, one hourglass = 20 h (as in the shared film). Without checks the debits (redone by hand, find and fix) use
   the whole claim. Then the page is re-kept with a check at every turn: all hundred units re-pack AT ONCE, along
   crossing-free paths, into review / redone / fix / kept — the double entry as one motion. Then twelve real months
   (one draw each from the engine) fall around the expectation, so no single lucky month can stand for the year.
   Control: hours to find and fix one failure (sketch). Hours are sketch; job counts come from the engine. */
(function () {
  const U = Atelier.U;
  const H = 20, MANUAL = 20, MONTHS = 12;
  const T = { rule: 0.4, claim: 1.1, redo: 2.6, fix: 4.9, keptA: 7.2, B: 8.6, move: 9.2, keptB: 10.6, year: 12.2, m0: 12.8, mdt: 0.45, you: 18.6, be: 20.4, end: 28 };
  const NG = { L0: 100, LP: 19, base: 290, UX: 14, bx: 120, dx: 290, sx: 476, c1: 730, c2: 836, ax0: 150, ax1: 880 };
  const lineY = j => NG.L0 + NG.LP * j;
  const blockXY = s => [NG.bx + NG.UX * (s % 10), lineY(9 - Math.floor(s / 10)) + 2];
  const debXY = d => (d >= 100 ? blockXY(99 - Math.min(99, d - 100)) : [NG.dx + NG.UX * (d % 10), lineY(Math.floor(d / 10)) + 2]);
  const SPR = { claim: 'hr', review: 'hr.review', redo: 'hr.redo', fix: 'hr.fail', kept: 'hr', over: 'hr.over' };
  const fade = (t, t0, d) => U.seg(t, t0, t0 + (d || 0.35), 'linear');
  const fmtH = v => (v < -0.5 ? '−' : '') + LG.num(Math.round(Math.abs(v)));

  /** exact expected hours for an average month: without checks (A) and with a check at every turn (B) */
  function expectedBooks(f) {
    const E = Atelier.AgentLoop.exact(10, 0.95, 0.8, 1); let rev = 0;
    for (let j = 0; j < 10; j++) rev += 100 * E.on[j];
    const fa = 100 * (1 - E.off[10]), fb = 100 * (1 - E.on[10]);
    const A = { review: 0, redo: fa * MANUAL, fix: fa * f }, B = { review: rev, redo: fb * MANUAL, fix: fb * f };
    for (const X of [A, B]) X.kept = 100 * MANUAL - X.review - X.redo - X.fix;
    return { A, B, be: rev / (fa - fb) - MANUAL };
  }
  /** largest-remainder rounding of hours to whole 20-h units, conserving the hundred */
  function units(X) {
    const keys = ['review', 'redo', 'fix'], u = keys.map(k => X[k] / H), deb = u.reduce((a, b) => a + b, 0);
    const total = Math.max(100, Math.round(deb)), parts = deb <= 100 ? u.concat([100 - deb]) : u;
    const fl = parts.map(Math.floor); let left = (deb <= 100 ? 100 : total) - fl.reduce((a, b) => a + b, 0);
    parts.map((v, i) => [v - fl[i], i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if (left > 0) { fl[i]++; left--; } });
    return { review: fl[0], redo: fl[1], fix: fl[2], kept: deb <= 100 ? fl[3] : 0, over: deb <= 100 ? 0 : total - 100 };
  }
  /** the page: per unit, its slot and account in state A (no checks) and B (checks), and the moves between */
  function page(ctx) {
    const f = ctx.state.fix, key = 'p|' + f;
    if (ctx._pg && ctx._pg.key === key) return ctx._pg;
    const X = expectedBooks(f), ua = units(X.A), ub = units(X.B);
    const tr = [];
    for (let u = 0; u < 100; u++) {
      const [x, y] = blockXY(u), tp = T.claim + 0.1 * Math.floor(u / 10) + 0.006 * (u % 10);
      tr[u] = LG.track(x, y - 6).set(tp, 'on', 1).set(tp, 'acct', 'claim').move(tp, tp + 0.22, x, y, U.ease.enter);
    }
    // state A: entries posted from the top of the claim
    const posA = Array.from({ length: 100 }, (_, u) => blockXY(u)), acctA = new Array(100).fill('kept');
    let top = 99, d = 0;
    [['redo', T.redo], ['fix', T.fix]].forEach(([k, te]) => {
      const n = Math.min(ua[k], top + 1), movers = [], slots = [];
      for (let i = 0; i < n; i++) { movers.push(top--); slots.push(d++); }
      d += ua[k] - n;
      if (!movers.length) return;
      const to = slots.map(debXY), a = LG.assign(movers.map(u => posA[u]), to);
      movers.forEach((u, i) => { const t0 = te + 0.2 + 1.5 * (i / Math.max(1, n - 1)) * Math.min(1, n / 40);
        tr[u].set(t0, 'acct', k).move(t0, t0 + 0.5, ...to[a[i]]); posA[u] = to[a[i]]; acctA[u] = k; });
    });
    // overdraft (A): owed units appear in outline in the emptied claim column
    const overA = []; for (let i = 0; i < ua.over; i++) overA.push(blockXY(99 - i));
    // state B: all hundred re-pack at once (one Hungarian, crossing-free)
    const targets = [], accts = []; let dd = 0;
    for (const k of ['review', 'redo', 'fix']) for (let i = 0; i < ub[k]; i++) { targets.push(debXY(dd++)); accts.push(k); }
    for (let i = 0; i < ub.kept; i++) { targets.push(blockXY(i)); accts.push('kept'); }
    const a = LG.assign(posA, targets);
    for (let u = 0; u < 100; u++) { const q = a[u]; if (accts[q] !== acctA[u]) tr[u].set(T.move, 'acct', accts[q]);
      const dl = 0.35 * Math.hypot(targets[q][0] - posA[u][0], targets[q][1] - posA[u][1]) / 260; tr[u].move(T.move + dl, T.move + dl + 0.9, ...targets[q]); if (accts[q] === 'kept') tr[u].set(T.keptB + 0.05 * (9 - Math.floor((targets[q][1] - NG.L0) / NG.LP)), 'acct', 'net'); }
    const overB = []; for (let i = 0; i < ub.over; i++) overB.push(blockXY(99 - i));
    return (ctx._pg = { key, X, ua, ub, tr, overA, overB });
  }
  /** twelve real months: one engine draw of 1,200 jobs, a hundred a month (month 1 is the shared film's month) */
  function year(ctx) {
    const f = ctx.state.fix, key = 'y|' + ctx.seed + '|' + f;
    if (ctx._yr && ctx._yr.key === key) return ctx._yr;
    if (!ctx._eng || ctx._eng.seed !== ctx.seed) ctx._eng = { seed: ctx.seed, A: Atelier.AgentLoop({ N: 100 * MONTHS, k: 10, seed: ctx.seed }) };
    const A = ctx._eng.A, off = [], on = [];
    for (let m = 0; m < MONTHS; m++) {
      let fo = 0, fn = 0, rev = 0;
      for (let r = 100 * m; r < 100 * m + 100; r++) { if (A.failStep.off[r] >= 0) fo++; const s = A.failStep.on[r]; if (s >= 0) fn++; rev += s < 0 ? 10 : s + 1; }
      off.push(100 * MANUAL - fo * (MANUAL + f)); on.push(100 * MANUAL - rev - fn * (MANUAL + f));
    }
    const all = off.concat(on), X = expectedBooks(f);
    const lo = Math.min(-400, Math.floor(Math.min(...all, X.A.kept) / 200) * 200), hi = Math.max(800, Math.ceil(Math.max(...all, X.B.kept) / 200) * 200);
    return (ctx._yr = { key, off, on, lo, hi, A });
  }

  Atelier.film({
    id: 'ledger-native',
    title: 'The honest ROI of an AI pilot — the ledger',
    direction: 'D · The Ledger in Motion',
    level: 'glance',
    duration: T.end,
    size: [960, 540],
    renderer: 'p2d',
    fps: 30,
    seed: 1,
    ground: '#171B23',
    chapters: [{ t: 0, label: 'The claim' }, { t: T.redo, label: 'No checks' }, { t: T.B, label: 'Re-kept with checks' }, { t: T.year, label: 'Twelve months' }, { t: T.be, label: 'Break-even' }],
    captions: [
      { t0: 0.3, t1: T.redo, text: 'The vendor slide: the pilot saves 2,000 hours a month. Keep an average month honestly.' },
      { t0: T.redo, t1: T.fix, text: 'Without checks about 40 of 100 jobs fail, and each is done again by hand: 20 hours.' },
      { t0: T.fix, t1: T.B, text: 'Then each failure has to be found and fixed. On average nothing of the claim is left.' },
      { t0: T.B, t1: T.keptB, text: 'Re-keep the same month with a check at every turn. Every hour moves; none is lost.' },
      { t0: T.keptB, t1: T.year, text: 'Review costs about 950 hours, but far fewer failures. About 480 hours are really kept.' },
      { t0: T.year, t1: T.you, text: 'Twelve real months, one draw each. Single months scatter around the expectation.' },
      { t0: T.you, t1: T.be, text: 'The month in the first film was a lucky one. Judge a pilot on the expectation.' },
      { t0: T.be, t1: T.end, text: 'Checks pay when a failure costs more than the review it takes to catch it.' },
    ],
    state: { fix: 30 },
    controls: [
      { key: 'fix', type: 'range', label: 'Hours to find and fix one failed job (sketch, on top of the 20 h redo)', min: 0, max: 40, step: 5, jump: T.fix,
        hint: 'Re-keeps the average month and the twelve real months.', format: v => Math.round(v) + ' h' },
    ],
    engine: ctx => Atelier.AgentLoop({ N: 100, k: 10, p: 0.95, c: 0.8, retry: 1, seed: ctx.seed }),

    setup(p, ctx) { page(ctx); year(ctx); LG.atlas(p, ctx, 1); },

    draw(p, t, ctx) {
      const c = p.drawingContext, P = LG.PAL, AT = LG.atlas(p, ctx, 1), Pg = page(ctx), Y = year(ctx), f = ctx.state.fix, X = Pg.X;
      c.save();
      c.globalAlpha = fade(t, 0.1, 0.5);
      LG.text(c, 'The honest ROI of an AI pilot', NG.bx, 52, { f: LG.SERIF, w: 500, size: 30, ls: -0.3 });
      c.globalAlpha = fade(t, T.claim - 0.3, 0.4);
      LG.blit(c, AT, 'hr', 600, 34, 1, 10, 16);
      LG.text(c, '= 20 hours: one job done by hand', 618, 48, { size: 14, color: P.dim });

      /* ruling */
      const ru = U.seg(t, T.rule, T.rule + 0.7, 'inOut');
      c.globalAlpha = 1;
      if (ru > 0) {
        const x0 = NG.bx - 4, w = (896 - x0) * ru;
        LG.hrule(c, x0, x0 + w, NG.L0 - 4, P.ruleHi);
        for (let j = 1; j < 10; j++) LG.hrule(c, x0, x0 + w, lineY(j) - 1, P.ruleLo);
        LG.hrule(c, x0, x0 + w, NG.base, P.ruleHi);
        LG.vrule(c, NG.sx - 20, NG.L0 - 4, NG.L0 - 4 + (NG.base - NG.L0 + 4) * ru, P.rule); LG.vrule(c, NG.dx - 14, NG.L0 - 4, NG.L0 - 4 + (NG.base - NG.L0 + 4) * ru, P.rule);
      }
      c.globalAlpha = fade(t, T.rule + 0.3, 0.4);
      LG.caps(c, t >= T.keptB ? 'Kept' : 'Claimed', NG.bx, 88, { size: 13, color: P.ink });
      LG.caps(c, 'An average month · hours', NG.sx, 88, { size: 13, color: P.ink });
      LG.caps(c, 'Debited', NG.dx, 88, { size: 13, color: P.ink });

      /* the statement: two columns of the same account — no checks, then with a check at every turn */
      const cA = t >= T.B ? P.faint : null;
      c.globalAlpha = fade(t, T.redo - 0.4, 0.3);
      LG.text(c, 'no checks', NG.c1, lineY(0) - 0 + 14, { size: 13, align: 'right', color: P.dim });
      c.globalAlpha = fade(t, T.B, 0.3);
      LG.text(c, 'checks', NG.c2, lineY(0) + 14, { size: 13, align: 'right', color: P.dim });
      const rows = [['claimed', 'claim'], ['review time', 'review'], ['redone by hand', 'redo'], ['find and fix', 'fix']];
      rows.forEach(([lab, k], i) => {
        const y = lineY(i + 1) + 15, tA = k === 'claim' ? T.claim : k === 'review' ? T.redo : k === 'redo' ? T.redo : T.fix;
        c.globalAlpha = fade(t, tA, 0.3);
        LG.text(c, lab, NG.sx, y, { f: LG.SERIF, italic: true, size: 15, color: P.dim });
        const vA = k === 'claim' ? 2000 : -X.A[k], vB = k === 'claim' ? 2000 : -X.B[k];
        const kc = k === 'review' ? P.slate : k === 'fix' ? P.peach : k === 'claim' ? P.copper : P.dim;
        LG.text(c, k === 'review' ? 'nil' : fmtH(vA), NG.c1, y, { f: LG.SERIF, w: 500, size: 15, align: 'right', italic: k === 'review', color: cA || (k === 'review' ? P.faint : kc) });
        if (t >= T.B) { c.globalAlpha = fade(t, T.move + 0.2 * i, 0.3); LG.text(c, fmtH(vB), NG.c2, y, { f: LG.SERIF, w: 500, size: 15, align: 'right', color: kc }); }
      });
      c.globalAlpha = fade(t, T.keptA - 0.3, 0.3);
      LG.hrule(c, NG.sx, NG.c2 + 4, lineY(5) + 3, P.ruleHi);
      LG.text(c, 'kept', NG.sx, lineY(5) + 20, { f: LG.SERIF, italic: true, w: 500, size: 16, color: P.ink });
      LG.text(c, fmtH(X.A.kept), NG.c1, lineY(5) + 20, { f: LG.SERIF, w: 600, size: 18, align: 'right', color: cA || (X.A.kept > 0 ? P.sage : P.peach) });
      if (t >= T.keptB) {
        c.globalAlpha = fade(t, T.keptB, 0.3);
        LG.text(c, fmtH(X.B.kept), NG.c2, lineY(5) + 20, { f: LG.SERIF, w: 600, size: 18, align: 'right', color: X.B.kept > 0 ? P.sage : P.peach });
        LG.hrule(c, NG.sx, NG.c2 + 4, lineY(6) + 10, P.ruleHi); LG.hrule(c, NG.sx, NG.c2 + 4, lineY(6) + 13, P.ruleHi);
      }
      /* break-even, said once, in the statement */
      if (t >= T.be) {
        c.globalAlpha = fade(t, T.be, 0.4);
        const tot = Math.round(MANUAL + X.be), fx = Math.round(X.be);
        LG.text(c, `Checks pay when a failure costs more than ${tot} h:`, NG.sx, lineY(7) + 18, { f: LG.SERIF, size: 15, color: P.ink });
        LG.text(c, `20 h to redo it + ${fx} h to find and fix it.`, NG.sx, lineY(8) + 18, { f: LG.SERIF, size: 15, color: P.ink });
        LG.text(c, `This sketch assumes ${f} h.`, NG.sx, lineY(9) + 18, { f: LG.SERIF, italic: true, size: 15, color: P.dim });
      }

      /* the hundred units */
      c.globalAlpha = 1;
      const moving = [];
      for (const T1 of Pg.tr) {
        if (!T1.get(t, 'on', 0)) continue;
        const [x, y, m] = T1.at(t), a = T1.get(t, 'acct', 'claim'), spr = a === 'net' ? 'hr.net' : SPR[a];
        if (m) moving.push([spr, x, y]); else LG.blit(c, AT, spr, x, y, 1, 10, 16);
      }
      for (const [spr, x, y] of moving) LG.blit(c, AT, spr, x, y, 1, 10, 16);
      if (Pg.overA.length) { c.globalAlpha = Math.min(fade(t, T.fix + 1.8, 0.3), 1 - fade(t, T.move, 0.4)); for (const [x, y] of Pg.overA) LG.blit(c, AT, 'hr.over', x, y, 1, 10, 16); }
      if (Pg.overB.length) { c.globalAlpha = fade(t, T.move + 1.0, 0.3); for (const [x, y] of Pg.overB) LG.blit(c, AT, 'hr.over', x, y, 1, 10, 16); }

      /* twelve real months: one tick per month, scattered around the expectation (drawn first) */
      if (t >= T.year) drawYear(c, t, ctx, Y, X);
      c.restore();
    },

    score(ctx) {
      const Pg = page(ctx), ev = [];
      for (let b = 0; b < 10; b++) ev.push({ t: T.claim + 0.1 * b, kind: 'tick', gain: 0.45, freq: 2600 });
      [T.redo, T.fix].forEach((te, e) => { ev.push({ t: te, kind: 'tick', gain: 0.6, freq: 2000 }); for (let i = 0; i < 8; i++) ev.push({ t: te + 0.4 + 0.2 * i, kind: 'tick', gain: 0.35, freq: e ? 1500 : 2400 }); ev.push({ t: te + 1.9, kind: 'clack', gain: 0.9, freq: 170 }); });
      ev.push({ t: T.keptA, kind: 'tone', freq: 247, dur: 0.9, gain: 0.7 });
      ev.push({ t: T.move, kind: 'click', gain: 0.8, freq: 1318 }, { t: T.move + 1.1, kind: 'clack', gain: 1.0, freq: 220 });
      ev.push({ t: T.keptB, kind: 'tone', freq: 392, dur: 1.0, gain: 0.9 }, { t: T.keptB + 0.02, kind: 'tone', freq: 587, dur: 1.0, gain: 0.6 });
      for (let m = 0; m < MONTHS; m++) ev.push({ t: T.m0 + m * T.mdt, kind: 'tick', gain: 0.55, freq: 1800 + 60 * m });
      ev.push({ t: T.be, kind: 'tone', freq: 440, dur: 1.2, gain: 0.7 });
      return ev;
    },

    meta(ctx) {
      const Y = year(ctx), X = expectedBooks(ctx.state.fix), A = Y.A, avg = a => a.reduce((s, v) => s + v, 0) / a.length;
      return [
        { label: 'Clean jobs in 12 months · no checks (of 1,200)', value: A.survivors.off[10], check: { world: 'off', k: 10, p: 0.95, c: 0.8, N: 1200 } },
        { label: 'Clean jobs in 12 months · checks', value: A.survivors.on[10], check: { world: 'on', k: 10, p: 0.95, c: 0.8, N: 1200 } },
        { label: 'Kept, average month · no checks (exact, h)', value: +X.A.kept.toFixed(1) },
        { label: 'Kept, average month · checks (exact, h)', value: +X.B.kept.toFixed(1) },
        { label: 'Kept, mean of the 12 months · no checks', value: +avg(Y.off).toFixed(1) },
        { label: 'Kept, mean of the 12 months · checks', value: +avg(Y.on).toFixed(1) },
        { label: 'Months kept below zero · no checks', value: Y.off.filter(v => v < 0).length },
        { label: 'Break-even: total hours per failure', value: +(MANUAL + X.be).toFixed(1) },
        { label: 'Seed', value: ctx.seed },
      ];
    },
  });

  /* the year strip: two rows (no checks, checks) on one hours axis; dashed = the exact expectation */
  function drawYear(c, t, ctx, Y, X) {
    const P = LG.PAL, x = v => NG.ax0 + (NG.ax1 - NG.ax0) * (v - Y.lo) / (Y.hi - Y.lo);
    const rows = [['no checks', Y.off, X.A.kept, 352], ['checks at every turn', Y.on, X.B.kept, 410]];
    c.globalAlpha = fade(t, T.year, 0.4);
    LG.caps(c, 'Twelve real months · hours kept', NG.bx, 322, { size: 13, color: P.ink });
    const y0 = 340, y1 = 432;
    LG.hrule(c, NG.ax0, NG.ax1, y1, P.rule);
    for (let v = Y.lo; v <= Y.hi; v += 200) { LG.vrule(c, x(v), y1, y1 + 5, P.rule); if (v % 400 === 0) LG.text(c, fmtH(v), x(v), y1 + 20, { size: 13, align: 'center', color: v === 0 ? P.ink : P.faint }); }
    LG.vrule(c, x(0), y0, y1, P.ruleHi, 1.5);
    for (const [lab, vals, e, yy] of rows) {
      c.globalAlpha = fade(t, T.year, 0.4);
      LG.text(c, lab, NG.bx, yy - 14, { size: 14, color: P.dim });
      /* the expectation first: a dashed rule with its figure */
      c.save(); c.strokeStyle = P.ink; c.lineWidth = 1.4; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(x(e) + 0.5, yy - 8); c.lineTo(x(e) + 0.5, yy + 22); c.stroke(); c.restore();
      LG.text(c, 'expected ' + fmtH(e), x(e) + 6, yy - 10, { size: 14, color: P.ink });
      vals.forEach((v, m) => {
        const tm = T.m0 + m * T.mdt; if (t < tm) return;
        c.globalAlpha = fade(t, tm, 0.15);
        const yy2 = yy - 4 * (1 - fade(t, tm, 0.15));
        c.fillStyle = v >= 0 ? P.sage : P.peach; c.fillRect(Math.round(x(v)) - 1.5, yy2, 3, 18);
      });
      /* the month the shared film showed (month 1), in pencil */
      if (t >= T.you) {
        c.globalAlpha = fade(t, T.you, 0.4);
        const xv = Math.round(x(vals[0]));
        c.strokeStyle = '#B8B2A6'; c.lineWidth = 1.4; c.strokeRect(xv - 5.5, yy - 3.5, 11, 25);
      }
    }
    if (t >= T.you) {
      c.globalAlpha = fade(t, T.you, 0.4);
      const xv = Math.round(x(Y.on[0]));
      const right = xv > 700;
      LG.text(c, 'the month you saw', right ? xv - 10 : xv + 10, 452 + 12, { f: LG.SERIF, italic: true, size: 15, color: '#B8B2A6', align: right ? 'right' : 'left' });
    }
    c.globalAlpha = 1;
  }
})();
