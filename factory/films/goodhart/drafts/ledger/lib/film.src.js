/* goodhart · draft "ledger" · paper, columns, and a ruler that travels.
   Chain: structures (the 40 x 25 layout, the gather transition, highlight), reveal (the ledger ruling, the guess outline),
   data-marks (a true-zero bar on a 0..8 scale for the household row). One clock: render(t, s, K) is a pure function of
   t and s.answer. The only randomness: the first 21 of K.shuffle([0..999], F.grid.seed) are the flagged marks.
   Coordinates are the kit's film sheet; the ledger chrome maps it by 0.784 into its PARTICULARS column. */
(function () {
'use strict';
const F = window.FILM, P = F.params, A = window.ARSENAL, G = F.grid;
const S = A.structures, REV = A.patterns.reveal, DM = A.dataMarks;
const N = P.gridCols * P.gridRows, NRED = Math.round(P.gridN * (P.reviewOrig_M + P.reviewExtra_M) / P.reviewed_M);
const DEF = {};
(F.knobs_doc || []).forEach((d) => { DEF[d.name] = F.knobs[d.name]; });
let KN = null, TOK = null, LA = null, LB = null, FL = null, FLIDX = null, DEST = null, RANK = null, SC = null, REVL = null, HL = null, GEO = null;
const OUT = new Map();          // memo: guess -> reveal state (a pure function of g, so seeking cannot change it)
const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

/* the travelling ruler: waypoints in film coordinates, (x, y) = left end of the top edge, L = length. */
function rulerKeys() {
  const rx = KN.rowX, L = 8 * KN.slotPitch, gy = GEO.gy1 + 3, gl = GEO.gx1 - GEO.gx0 + 8;
  return [
    { t: 0.0, x: rx, y: 224, L, op: 0 }, { t: 0.5, x: rx, y: 224, L, op: 1 }, { t: 8.0, x: rx, y: 224, L, op: 1 },
    { t: 8.6, x: rx, y: 176, L, op: 0.2 }, { t: 15.9, x: rx, y: 176, L, op: 0.2 }, { t: 16.5, x: rx, y: 176, L, op: 1 },
    { t: 35.4, x: rx, y: 176, L, op: 1 }, { t: 36.4, x: GEO.gx0 - 4, y: GEO.gy0 - 4, L: gl, op: 1 },
    { t: KN.scanT0, x: GEO.gx0 - 4, y: GEO.gy0 - 4, L: gl, op: 1 }, { t: KN.scanT0 + KN.scanDur, x: GEO.gx0 - 4, y: gy, L: gl, op: 1 },
    { t: KN.ratioT0, x: GEO.gx0 - 4, y: gy, L: gl, op: 1 }, { t: KN.ratioT0 + 0.7, x: 640, y: 308, L: 214, op: 1 },
    { t: 62.0, x: 640, y: 308, L: 214, op: 1 }, { t: 62.9, x: 120, y: 276, L: 560, op: 1 }, { t: 75, x: 120, y: 276, L: 560, op: 1 },
  ];
}
let RK = null;
function rulerAt(t, K) {
  let i = 0; while (i + 1 < RK.length && t >= RK[i + 1].t) i++;
  const a = RK[i], b = RK[Math.min(i + 1, RK.length - 1)], u = a === b ? 0 : K.ease(K.seg(t, a.t, b.t));
  return { x: K.lerp(a.x, b.x, u), y: K.lerp(a.y, b.y, u), L: K.lerp(a.L, b.L, u), op: K.lerp(a.op, b.op, u) };
}

window.FILM_RENDER = {
  setup(p, K) {
    KN = {}; Object.keys(DEF).forEach((k) => { KN[k] = K.knob(k, DEF[k]); });
    const fam = (k, w) => ({ family: K.FONT[k].replace(/^'([^']+)'.*$/, '$1'), weight: w });
    const C = K.C;
    TOK = { id: 'goodhart', tempo: { ease: 'cubic' }, color: { bg: 'rgba(0,0,0,0)', ink: C.ink, accent: C.accent, accent2: C.soft, muted: C.muted, line: C.line, chalk: C.chalk, panel: C.panel },
            type: { disp: fam('disp', 600), mono: fam('mono', 400), body: fam('sans', 400) } };
    /* structures: the 1,000-mark layout, then the same marks in their gathered slots */
    const gp = KN.gridPitch, gs = Math.min(KN.gridSize, gp - 0.5), GX = 56, GY = 104;
    LA = S.grid(N, G.cols, { x: GX, y: GY, w: G.cols * gp, h: G.rows * gp }, { gap: 1 - gs / gp, min: 1 });
    GEO = { gp, gs, gx0: LA.items[0].x - gs / 2, gy0: LA.items[0].y - gs / 2 };
    GEO.gx1 = GEO.gx0 + (G.cols - 1) * gp + gs; GEO.gy1 = GEO.gy0 + (G.rows - 1) * gp + gs;
    FL = K.shuffle(Array.from({ length: N }, (_, i) => i), G.seed).slice(0, NRED);       // reveal order
    FLIDX = new Map(FL.map((i, k) => [i, k]));
    HL = S.highlight(LA, (m, i) => FLIDX.has(i));
    const R = FL.slice().sort((a, b) => a - b), RED = new Set(FL), D = [], V = [];
    for (let i = 0; i < NRED; i++) if (!RED.has(i)) D.push(i);       // ink marks displaced from slots 0..20
    for (const i of R) if (i >= NRED) V.push(i);                      // slots the red marks vacate
    DEST = new Int32Array(N); RANK = new Float32Array(N);
    for (let i = 0; i < N; i++) DEST[i] = i;
    R.forEach((i, j) => { DEST[i] = j; RANK[i] = j / (NRED - 1); });
    D.forEach((i, m) => { DEST[i] = V[m]; RANK[i] = m / (NRED - 1); });
    LB = Object.assign({}, LA, { items: LA.items.map((m, i) => Object.assign({}, m, { x: LA.items[DEST[i]].x, y: LA.items[DEST[i]].y })) });
    /* data-marks: the household bar sits on a declared 0..8 scale, drawn through the slots (a piecewise "at": a slot is
       slotSize wide and the gap between slots is skipped, so 6.13 fills 6 slots and 0.13 of the seventh) */
    const rx = KN.rowX, sp = KN.slotPitch, ss = Math.min(KN.slotSize, sp - 2);
    SC = DM.scale(0, P.targetProducts, rx, rx + P.targetProducts * sp);
    SC.at = (v) => { const k = Math.min(P.targetProducts - 1, Math.max(0, Math.floor(v - 1e-9))); return rx + sp * k + ss * (v - k); };
    SC.ss = ss;
    /* reveal: the ledger's ruling in CASE (four rules and the year column), drawn on as the lines are entered */
    const ly = [282, 322, 362, 402], x0 = rx, x1 = rx + 700;
    const line = (pts, o) => ({ spec: { kind: 'line', pts }, st: Object.assign({ role: 'muted', w: 0.9, alpha: 0.7 }, o) });
    const paths = ly.map((y) => line([[x0, y + 9], [x1, y + 9]])).concat([line([[x0 + 108, 250], [x0 + 108, 411]], { alpha: 0.9 })]);
    REVL = REV.setup(p, { seed: F.seed }, { paths, stagger: 0.3, dur: 1.8, hold: 0, ease: 'cubic', easeMode: 'inOut', guide: 0, pen: false, lineW: 0.9 });
    RK = rulerKeys();
  },

  render(t, s, K) {
    const { seg, ease, eout, lerp, C } = K, ctx = K.ctx, p = K.p;
    const TX = (key, x, y, str, o) => K.tx(key, 'labels', x, y, str, Object.assign({ role: (o.size || 14) >= 28 ? 'must-read' : (o.size || 14) >= 14 ? 'secondary' : 'chrome' }, o));
    const rgba = (c, a) => K.rgba(c, clamp(a, 0, 1));
    const SZ = SC.ss, SP = KN.slotPitch, RX = KN.rowX, T8 = P.targetProducts;
    const sealed = t >= 15.8, none = s.answer === 'none';
    K.chrome(t, null, { ledger: { rows: F.ledger }, block: { slot: sealed ? (none ? 'NONE' : 'SEALED') : null } });

    /* ───── the household row: HOOK (fills to eight), faint in COMMIT, CASE (6.13 of eight) ───── */
    const rowOn = t < 36;
    if (rowOn) {
      const caseRow = t >= 16;
      const slide = ease(seg(t, 8.0, 8.6));
      const ry = caseRow ? 104 : lerp(150, 104, slide);
      const op = caseRow ? seg(t, 16.0, 16.5) * (1 - seg(t, 35.4, 36.0)) : 1 - 0.8 * seg(t, 8.0, 8.6);
      let v;
      if (!caseRow) { v = 0; for (let k = 0; k < T8; k++) v += eout(seg(t, KN.hookT0 + KN.hookStep * k, KN.hookT0 + KN.hookStep * k + 0.25)); }
      else v = P.crossSellFeb2015 * ease(seg(t, 20.6, 22.6));
      // fill: data-marks bar on the 0..8 scale, clipped to the slots (true zero, label and value blanked: the words are SVG)
      if (op > 0.004 && v > 0) {
        ctx.save(); ctx.beginPath();
        for (let k = 0; k < T8; k++) ctx.rect(RX + k * SP, ry, SZ, SZ);
        ctx.clip();
        const T2 = Object.assign({}, TOK, { color: Object.assign({}, TOK.color, { ink: K.rgba('ink', op) }) });
        DM.bars({ dir: 'h', thick: SZ, stagger: 0, sc: SC, fmt: () => '', items: [{ v, c: ry + SZ / 2, label: '', hl: false }] }).enter(K.p, 1, T2);
        ctx.restore();
      }
      for (let k = 0; k < T8; k++)
        K.rc('hr.s' + k, 'marks', RX + k * SP, ry, SZ, SZ, { stroke: C.ink, w: 1.5, op, dash: caseRow && k === T8 - 1 ? '4 3' : null });
      if (!caseRow) {
        let kShown = 0; for (let k = 0; k < T8; k++) if (t >= KN.hookT0 + KN.hookStep * k + 0.25) kShown++;
        if (t < 8.6) {
          TX('hr.c', 704, ry + 46, kShown + ' / ' + T8, { fam: 'mono', size: 48, weight: 500, op: op });
          TX('hr.l', RX, 262, 'PRODUCTS PER CUSTOMER · TARGET ' + T8, { size: 14, weight: 500, ls: '0.08em', op: seg(t, 0.5, 1.0) * op });
          if (t >= 5.0) TX('hr.o', 704, ry + 106, 'ON TARGET', { size: 28, weight: 500, op: seg(t, 5.0, 5.4) * op });
        }
        // the ruler's cursor rides the fill front
        if (v > 0) { const cx = SC.at(Math.min(v, T8)); ctx.fillStyle = rgba(C.ink, op * KN.rulerOp); ctx.fillRect(cx - 1, ry + SZ + 3, 2, 22); }
      } else {
        const a = op;
        TX('hr.t', RX + (T8 - 1) * SP + SZ, 222, 'TARGET ' + T8, { size: 28, weight: 500, anchor: 'end', op: a * seg(t, 16.6, 17.2) });
        const u = seg(t, 22.4, 22.9) * a;
        if (u > 0) {
          TX('hr.v', RX, 222, P.crossSellFeb2015.toFixed(2) + ' AVERAGE', { size: 28, weight: 500, op: u });
          TX('hr.vl', RX + 12 * 21.4 + 14, 222, 'FEB ' + P.yXsell, { size: 14, weight: 500, ls: '0.08em', op: u });
        }
        TX('hr.q', RX, 246, 'ONE IN FOUR HOUSEHOLDS AT ' + T8 + '+', { size: 14, ls: '0.06em', op: seg(t, 23.0, 23.4) * a });
        if (v > 0) { const cx = SC.at(v); ctx.fillStyle = rgba(C.ink, a * KN.rulerOp); ctx.fillRect(cx - 1, ry + SZ + 3, 2, 22); }
      }
    }

    /* ───── COMMIT: the question on the paper, the kit's box below it ───── */
    if (t >= 8.4 && t < 16.4) {
      const qo = seg(t, 8.6, 9.2) * (1 - seg(t, 15.6, 16.0));
      TX('cq.1', 489, 214, 'Of every ' + fmt(P.gridN) + ' accounts opened,', { fam: 'disp', size: 30, anchor: 'middle', op: qo, role: 'must-read' });
      TX('cq.2', 489, 252, 'how many did customers never authorise?', { fam: 'disp', size: 30, anchor: 'middle', op: qo, role: 'must-read' });
    }
    if (t >= F.commit.at - 1.2 && t < 16.4)
      K.commitBox(t, s, { x: 209, y: 266, w: 560, h: 140, title: F.commit.title, prompt: '0 TO ' + fmt(P.gridN) + ' · TYPE A NUMBER', seal: 15.8, out: 15.9 });

    /* ───── CASE: the ledger, entered line by line on ruled paper ───── */
    if (t >= 24.8 && t < 36.2) {
      const lo = 1 - seg(t, 35.4, 36.0);
      if (lo > 0.004) {
        ctx.save(); ctx.globalAlpha = lo; K.p.push(); REV.draw(K.p, t - 24.8, REVL, null, TOK); K.p.pop(); ctx.restore(); ctx.globalAlpha = 1;
      }
      const flagM = (Math.round((P.cfpbDeposit + P.cfpbCard) / 1e5) / 10).toFixed(1);
      const rev = (Math.round((P.reviewOrig_M + P.reviewExtra_M) * 10) / 10).toFixed(1);
      const pen = P.penCFPB_M + P.penOCC_M + P.penLA_M;
      const L = [
        [25.6, P.yOrder, flagM + ' M flagged · ' + fmt(P.fired) + ' fired'],
        [27.4, '', '$' + pen + ' M in fines'],
        [30.8, P.yReview, rev + ' M after the full review'],
        [32.8, P.ySettle, '$' + P.doj_B + ' B to settle'],
      ];
      L.forEach(([t0, yr, txt], i) => {
        if (t < t0) return;
        const y = 282 + 40 * i;
        if (yr !== '') TX('lg.y' + i, RX, y, String(yr), { size: 28, weight: 500, op: lo * seg(t, t0, t0 + 0.3), fill: C.accent });
        TX('lg.t' + i, RX + 120, y, K.typed(txt, t, t0, KN.typeCps), { size: 28, weight: 500, op: lo });
      });
    }

    /* ───── COUNT: the 1,000 marks, the metric's view ───── */
    if (t >= 36) {
      const gOp = lerp(1, KN.monGrid, seg(t, 62.0, 62.6));
      const dim = lerp(1, KN.floorOp, seg(t, KN.floorT0, KN.floorT0 + 1.0));
      const u = seg(t, KN.gatherT0, KN.gatherT0 + KN.gatherDur + 0.4);
      const items = u > 0 ? S.transition(LA, LB, u, { stagger: 0.4 / (KN.gatherDur + 0.4), by: (m, i) => RANK[i], ease: K.ease }).items : LA.items;
      const gs = GEO.gs;
      const rowAt = (i) => Math.floor(i / G.cols);
      for (let pass = 0; pass < 2; pass++) {
        for (let i = 0; i < N; i++) {
          const isRed = FLIDX.has(i);
          if ((pass === 1) !== isRed) continue;
          const a = seg(t, 36.0 + 0.16 * rowAt(i), 36.0 + 0.16 * rowAt(i) + 0.12);
          if (a <= 0) continue;
          const m = items[i];
          let sz = gs, red = false;
          if (isRed) {
            const k = FLIDX.get(i), tk = KN.flagT0 + KN.flagStep * k;
            red = t >= tk;
            if (red) sz = gs * (1 + 0.15 * Math.sin(Math.PI * seg(t, tk, tk + 0.1)));
          }
          ctx.fillStyle = red ? rgba(C.soft, a * gOp) : rgba(C.ink, 0.86 * a * gOp * (isRed ? 1 : dim));
          ctx.fillRect(m.x - sz / 2, m.y - sz / 2, sz, sz);
        }
      }
      const cO = 1 - seg(t, 62.0, 62.6);
      if (cO > 0.004) {
        const CX = 548;
        TX('gr.eb', GEO.gx0, 96, '1 MARK = ' + fmt(P.reviewed_M * 1e6 / P.gridN) + ' ACCOUNTS · JAN ' + P.yReviewStart + ' TO SEP ' + P.yReviewEnd, { size: 12, ls: '0.1em', op: seg(t, 36.0, 36.4) * cO });
        const rows = Math.min(G.rows, Math.max(0, Math.floor((t - 36.0) / 0.16) + 1));
        TX('gr.ol', CX, 118, 'ACCOUNTS OPENED', { size: 14, weight: 500, ls: '0.08em', op: cO, fill: C.muted });
        TX('gr.ov', CX, 170, fmt(rows * G.cols), { fam: 'disp', size: 48, op: cO });
        if (t >= 42.2) TX('gr.cn', GEO.gx0, 421, 'COUNTED ' + fmt(P.gridN), { size: 28, weight: 500, op: seg(t, 42.2, 42.7) * (1 - seg(t, KN.floorT0 - 0.4, KN.floorT0)) * cO });
        if (t >= KN.flagT0) {
          const nr = Math.min(NRED, Math.floor((t - KN.flagT0) / KN.flagStep + 1e-6) + 1);
          TX('gr.fl', CX, 208, 'FLAGGED BY THE REVIEW', { size: 14, weight: 500, ls: '0.08em', op: cO, fill: C.muted });
          TX('gr.fv', CX, 258, fmt(nr), { fam: 'disp', size: 48, op: cO, fill: C.soft });
        }
        if (t >= KN.guessT0) {
          const go = seg(t, KN.guessT0, KN.guessT0 + 0.5) * cO;
          const g = K.answered(s) ? clamp(Math.round(s.answer), 0, N) : null;
          TX('gr.gl', CX, 346, 'YOUR GUESS', { size: 14, weight: 500, ls: '0.08em', op: go, fill: C.muted });
          TX('gr.gv', CX, 396, g == null ? '—' : fmt(g), { fam: 'disp', size: 48, op: go, fill: C.muted });
          if (g != null && g > 0) {
            let st = OUT.get(g);
            if (!st) {
              const o = 2, gp = GEO.gp, x0 = GEO.gx0 - o, y0 = GEO.gy0 - o, xR = GEO.gx0 + (G.cols - 1) * gp + gs + o;
              const full = Math.floor(g / G.cols), rem = g % G.cols;
              const yF = GEO.gy0 + (full - 1) * gp + gs + o, xr = GEO.gx0 + (rem - 1) * gp + gs + o, yR = GEO.gy0 + full * gp + gs + o;
              const pts = full === 0 ? [[x0, y0], [xr, y0], [xr, yR], [x0, yR], [x0, y0]]
                : rem === 0 ? [[x0, y0], [xR, y0], [xR, yF], [x0, yF], [x0, y0]]
                : [[x0, y0], [xR, y0], [xR, yF], [xr, yF], [xr, yR], [x0, yR], [x0, y0]];
              st = REV.setup(K.p, { seed: F.seed }, { paths: [{ spec: { kind: 'line', pts }, st: { role: 'muted', w: 2 } }], stagger: 0, dur: KN.guessDur, hold: 0, ease: 'cubic', easeMode: 'inOut', guide: 0, pen: false, lineW: 2 });
              OUT.set(g, st);
            }
            ctx.save(); ctx.globalAlpha = cO; K.p.push(); REV.draw(K.p, t - KN.guessT0, st, null, TOK); K.p.pop(); ctx.restore(); ctx.globalAlpha = 1;
          }
        }
        const ru = seg(t, KN.ratioT0, KN.ratioT0 + 0.4) * cO;
        if (ru > 0) {
          TX('gr.r1', 640, 258, NRED + ' ÷ ' + fmt(P.gridN), { size: 28, weight: 500, op: ru });
          TX('gr.r2', 640, 296, '≈ ' + Math.round(100 * (P.reviewOrig_M + P.reviewExtra_M) / P.reviewed_M) + ' IN 100', { size: 28, weight: 500, op: ru });
        }
        const fo = seg(t, KN.floorT0 + 0.2, KN.floorT0 + 0.8) * cO;
        if (fo > 0) TX('gr.nt', GEO.gx0, 421, 'UNUSED PRODUCTS SOLD WITH CONSENT: COUNTED, NOT FLAGGED', { size: 14, weight: 500, ls: '0.04em', op: fo, fill: C.muted });
      }
    }

    /* ───── MONDAY: the question, ruled off ───── */
    if (t >= 62.2) {
      const mo = seg(t, 62.4, 63.0);
      TX('mo.1', 120, 214, 'What could move this number', { fam: 'disp', size: 32, op: mo, role: 'must-read' });
      TX('mo.2', 120, 254, 'with nothing real behind it?', { fam: 'disp', size: 32, op: mo, role: 'must-read' });
      TX('mo.3', 120, 316, 'AND WHO WOULD NOTICE?', { size: 14, weight: 500, ls: '0.14em', op: seg(t, 63.4, 63.9), fill: C.accent });
    }

    /* ───── the ruler, drawn last so it lies over the marks it measures ───── */
    const r = rulerAt(t, K);
    if (r.op > 0.004) {
      const a = r.op * KN.rulerOp, h = 9, tk = KN.rulerTick;
      ctx.save();
      ctx.fillStyle = rgba(C.ink, 0.1 * r.op); ctx.fillRect(r.x, r.y, r.L, h);
      ctx.strokeStyle = rgba(C.ink, a); ctx.lineWidth = KN.rulerW; ctx.beginPath(); ctx.moveTo(r.x, r.y); ctx.lineTo(r.x + r.L, r.y); ctx.stroke();
      ctx.lineWidth = 0.7; ctx.beginPath();
      for (let i = 0, x = r.x; x <= r.x + r.L + 0.01; i++, x = r.x + i * tk) { const major = i % 5 === 0; ctx.moveTo(x, r.y); ctx.lineTo(x, r.y + (major ? 8 : 4)); }
      ctx.stroke();
      ctx.restore();
    }
  },
};
})();
