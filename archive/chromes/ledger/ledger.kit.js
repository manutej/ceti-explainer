/* ledger.kit.js — THE LEDGER IN MOTION (direction D): shared kit for both films.
   Pure helpers only (no clock reads). Isotype units with persistent identity; crossing-free re-packing by
   Hungarian assignment on Euclidean distance; a density-matched pictogram atlas; ledger typography. */
(function (root) {
  'use strict';
  const U = root.Atelier.U;
  const LG = {};

  /* ── palette: CETI semantics on the CETI panel ground (meaning invariant) ── */
  LG.PAL = {
    ground: '#171B23', ink: '#F5EFE3', dim: '#A39A89', faint: '#6F6A61',
    copper: '#CE9A6A', sage: '#8FA985', peach: '#D88B5C', slate: '#7C98B3',
    rule: 'rgba(124,152,179,0.30)', ruleLo: 'rgba(124,152,179,0.13)', ruleHi: 'rgba(245,239,227,0.55)',
    band: 'rgba(124,152,179,0.10)',
  };
  LG.SERIF = 'Newsreader';
  LG.SANS = 'IBM Plex Sans Condensed';

  /* ── typography through the 2D context (tabular by default in both faces) ── */
  LG.text = function (c, s, x, y, o) {
    o = o || {};
    c.font = (o.italic ? 'italic ' : '') + (o.w || 400) + ' ' + (o.size || 12) + 'px "' + (o.f || LG.SANS) + '", "DM Sans", serif';
    c.letterSpacing = (o.ls || 0) + 'px';
    c.textAlign = o.align || 'left';
    c.textBaseline = o.base || 'alphabetic';
    c.fillStyle = o.color || LG.PAL.ink;
    const a0 = c.globalAlpha;
    if (o.alpha != null) c.globalAlpha = a0 * U.clamp(o.alpha);
    let dx = 0;
    if (o.ls && (o.align === 'right' || o.align === 'end')) dx = o.ls;      // no trailing tracking at the right edge
    if (c.globalAlpha > 0.002) c.fillText(s, x + dx, y);
    const w = c.measureText(s).width - (o.ls || 0);
    c.globalAlpha = a0; c.letterSpacing = '0px';
    return w;
  };
  LG.caps = (c, s, x, y, o) => LG.text(c, s.toUpperCase(), x, y, Object.assign({ f: LG.SANS, w: 600, size: 9.5, ls: 1.3, color: LG.PAL.dim }, o));
  LG.width = function (c, s, o) {
    o = o || {};
    c.font = (o.italic ? 'italic ' : '') + (o.w || 400) + ' ' + (o.size || 12) + 'px "' + (o.f || LG.SANS) + '", "DM Sans", serif';
    c.letterSpacing = (o.ls || 0) + 'px';
    const w = c.measureText(s).width; c.letterSpacing = '0px'; return w;
  };
  /** greedy word wrap; returns the number of lines set */
  LG.wrap = function (c, s, x, y, maxW, lh, o) {
    const words = s.split(' '); let line = '', n = 0;
    for (const w of words) {
      const t = line ? line + ' ' + w : w;
      if (line && LG.width(c, t, o) > maxW) { LG.text(c, line, x, y + n * lh, o); n++; line = w; } else line = t;
    }
    if (line) { LG.text(c, line, x, y + n * lh, o); n++; }
    return n;
  };
  /** thousands with a comma, real minus sign */
  LG.num = (n, dec) => U.tabular(n, 0, { decimals: dec || 0, pad: '' });
  LG.hrule = function (c, x0, x1, y, col, w) { c.fillStyle = col; c.fillRect(Math.min(x0, x1), y, Math.abs(x1 - x0), w || 1); };
  LG.vrule = function (c, x, y0, y1, col, w) { c.fillStyle = col; c.fillRect(x, Math.min(y0, y1), w || 1, Math.abs(y1 - y0)); };

  /* ── Hungarian (Kuhn–Munkres with potentials), n ≤ m: a[i] = column of row i. O(n²m). ── */
  LG.hungarian = function (n, m, cost) {
    const INF = 1e18, u = new Float64Array(n + 1), v = new Float64Array(m + 1), p = new Int32Array(m + 1), way = new Int32Array(m + 1);
    for (let i = 1; i <= n; i++) {
      p[0] = i; let j0 = 0;
      const minv = new Float64Array(m + 1).fill(INF), used = new Uint8Array(m + 1);
      do {
        used[j0] = 1; const i0 = p[j0]; let delta = INF, j1 = 0;
        for (let j = 1; j <= m; j++) if (!used[j]) {
          const cur = cost(i0 - 1, j - 1) - u[i0] - v[j];
          if (cur < minv[j]) { minv[j] = cur; way[j] = j0; }
          if (minv[j] < delta) { delta = minv[j]; j1 = j; }
        }
        for (let j = 0; j <= m; j++) { if (used[j]) { u[p[j]] += delta; v[j] -= delta; } else minv[j] -= delta; }
        j0 = j1;
      } while (p[j0] !== 0);
      do { const j1 = way[j0]; p[j0] = p[j1]; j0 = j1; } while (j0);
    }
    const a = new Int32Array(n);
    for (let j = 1; j <= m; j++) if (p[j]) a[p[j] - 1] = j - 1;
    return a;
  };
  /** Minimum-sum Euclidean matching from points to slots (|from| ≤ |to|). Such a matching has no crossing segments,
   *  so straight-line moves between the two sets never cross (identity is kept, nothing tangles). */
  LG.assign = (from, to) => LG.hungarian(from.length, to.length, (i, j) => Math.hypot(from[i][0] - to[j][0], from[i][1] - to[j][1]));

  /* ── unit tracks: straight eased moves + timed state events. Pure in t. ── */
  LG.track = function (x, y) {
    const T = { x, y, seg: [], ev: [] };
    T.end = () => (T.seg.length ? [T.seg[T.seg.length - 1].x1, T.seg[T.seg.length - 1].y1] : [T.x, T.y]);
    T.move = (t0, t1, x1, y1, e) => { const [x0, y0] = T.end(); if (x0 === x1 && y0 === y1) return T; T.seg.push({ t0, t1, x0, y0, x1, y1, e: e || U.ease.inOut }); return T; };
    T.at = t => {
      let x = T.x, y = T.y, m = 0;
      for (const s of T.seg) {
        if (t < s.t0) break;
        if (t >= s.t1) { x = s.x1; y = s.y1; continue; }
        const q = s.e((t - s.t0) / (s.t1 - s.t0)); x = s.x0 + (s.x1 - s.x0) * q; y = s.y0 + (s.y1 - s.y0) * q; m = 1; break;
      }
      return [x, y, m];
    };
    T.set = (t, key, val) => { T.ev.push({ t, key, val }); return T; };
    T.get = (t, key, d) => { let v = d, best = -Infinity; for (const e of T.ev) if (e.key === key && e.t <= t && e.t >= best) { v = e.val; best = e.t; } return v; };
    T.when = (key) => { for (const e of T.ev) if (e.key === key) return e.t; return Infinity; };
    return T;
  };

  /* ── pictograms (designed on a pixel grid; drawn once into a density-matched atlas) ── */
  const CELL = [16, 20];
  function slipPath(c, w, h, teeth) {
    const z = h - 2, p = w / teeth;
    c.beginPath(); c.moveTo(0, 0); c.lineTo(w, 0); c.lineTo(w, z);
    for (let i = 0; i < teeth; i++) { c.lineTo(w - p * (i + 0.5), h); c.lineTo(w - p * (i + 1), z); }
    c.closePath();
  }
  const knock = (c, f) => { c.save(); c.globalCompositeOperation = 'destination-out'; c.fillStyle = '#000'; f(); c.restore(); };
  /** job = a batch slip (40 invoices): tear-off foot, two item lines, the total with an accountant's double rule */
  function job(c, col, o) {
    o = o || {};
    c.fillStyle = col; slipPath(c, 12, 16, 4); c.fill();
    if (o.void) { knock(c, () => { c.fillRect(0, 7, 12, 2); c.fillRect(2, 3, 8, 1); c.fillRect(6, 11, 4, 1); }); return; }  // struck through, as a voided entry
    knock(c, () => { c.fillRect(2, 3, 8, 1); c.fillRect(2, 5, 5, 1); c.fillRect(6, 9, 4, 1); c.fillRect(6, 11, 4, 1); });  // items; total's double rule
    if (o.ear) dogEar(c, 12, o.ear);
  }
  /** a single invoice: smaller sheet, one item line and a total */
  function invoice(c, col, o) {
    o = o || {};
    c.fillStyle = col; slipPath(c, 10, 14, 3); c.fill();
    if (o.void) { knock(c, () => { c.fillRect(0, 6, 10, 2); c.fillRect(2, 3, 6, 1); }); return; }
    knock(c, () => { c.fillRect(2, 3, 6, 1); c.fillRect(5, 8, 3, 1); c.fillRect(5, 10, 3, 1); });
    if (o.ear) dogEar(c, 10, o.ear);
  }
  /** dog-ear: the corner a checker folded over — cut the corner, lay the flap in sage */
  function dogEar(c, w, col) {
    const e = 4;
    knock(c, () => { c.beginPath(); c.moveTo(w - e, 0); c.lineTo(w + 1, 0); c.lineTo(w + 1, e + 1); c.lineTo(w, e); c.closePath(); c.fill(); });
    c.fillStyle = col; c.beginPath(); c.moveTo(w - e, 0); c.lineTo(w, e); c.lineTo(w - e, e); c.closePath(); c.fill();
  }
  /** hourglass: caps, glass, sand run through (upper bulb hollow, lower bulb full) */
  function glass(c, col, o) {
    o = o || {};
    c.fillStyle = col;
    c.fillRect(0, 0, 10, 2); c.fillRect(0, 14, 10, 2);
    c.beginPath(); c.moveTo(1, 2); c.lineTo(9, 2); c.lineTo(5.7, 8); c.lineTo(9, 14); c.lineTo(1, 14); c.lineTo(4.3, 8); c.closePath(); c.fill();
    knock(c, () => { c.beginPath(); c.moveTo(2.7, 3.2); c.lineTo(7.3, 3.2); c.lineTo(5, 7.2); c.closePath(); c.fill(); });
    if (o.strike) knock(c, () => { c.fillRect(0, 7.5, 10, 1); });
  }
  function outline(c, col, kind) {
    c.strokeStyle = col; c.lineWidth = 1;
    if (kind === 'glass') { c.beginPath(); c.moveTo(0.5, 0.5); c.lineTo(9.5, 0.5); c.lineTo(5.6, 8); c.lineTo(9.5, 15.5); c.lineTo(0.5, 15.5); c.lineTo(4.4, 8); c.closePath(); c.stroke(); return; }
    const w = kind === 'invoice' ? 10 : 12, h = kind === 'invoice' ? 14 : 16, teeth = kind === 'invoice' ? 3 : 4;
    c.save(); c.translate(0.5, 0.5); slipPath(c, w - 1, h - 1, teeth); c.restore(); c.stroke();
  }
  /* ── 2× designs: Arntz-grade sheets (three item rules, the total and its double rule, a tear-off foot) ── */
  function sheet2(c, col, w, h, teeth, rules, total, o) {
    o = o || {};
    c.fillStyle = col; slipPath(c, w, h, teeth); c.fill();
    knock(c, () => {
      for (const [x, y, rw] of rules) c.fillRect(x, y, rw, 2);
      c.fillRect(total[0], total[1], total[2], 2.5); c.fillRect(total[0], total[1] + 4.5, total[2], 1); c.fillRect(total[0], total[1] + 6.5, total[2], 1);
      if (o.void) c.fillRect(0, h * 0.42, w, 3.2);                       // struck through, as a voided entry
    });
    if (o.ear) { const e = 7;
      knock(c, () => { c.beginPath(); c.moveTo(w - e, 0); c.lineTo(w + 1, 0); c.lineTo(w + 1, e + 1); c.lineTo(w, e); c.closePath(); c.fill(); });
      c.fillStyle = o.ear; c.beginPath(); c.moveTo(w - e, 0); c.lineTo(w, e); c.lineTo(w - e, e); c.closePath(); c.fill(); }
  }
  const job2 = (c, col, o) => sheet2(c, col, 24, 32, 6, [[4, 5, 16], [4, 10, 11], [4, 15, 14]], [12, 20, 8], o);
  const inv2 = (c, col, o) => sheet2(c, col, 20, 27, 5, [[3, 4, 12], [3, 8, 9]], [10, 13, 7], o);
  function outline2(c, col, w, h, teeth) { c.strokeStyle = col; c.lineWidth = 1.2; c.save(); c.translate(0.6, 0.6); slipPath(c, w - 1.2, h - 1.2, teeth); c.restore(); c.stroke(); }
  /** a rubber stamp: one check (1 review-hour on the 40 invoices) */
  function stamp(c, col) {
    c.fillStyle = col;
    c.beginPath(); c.ellipse(10, 4, 4.5, 4, 0, 0, Math.PI * 2); c.fill();
    c.fillRect(8, 6, 4, 9); c.fillRect(2, 14, 16, 6); c.fillRect(0, 21, 20, 5);
    knock(c, () => c.fillRect(0, 20, 20, 1));
  }
  LG.SPRITES2 = function (P) {
    const g2 = (col, o) => c => { c.scale(2, 2); glass(c, col, o); };
    return [
      ['job', c => job2(c, P.copper)], ['job.clean', c => job2(c, P.sage)], ['job.fail', c => job2(c, P.peach, { void: 1 })],
      ['job.ear', c => job2(c, P.copper, { ear: P.sage })], ['job.clean.ear', c => job2(c, P.sage, { ear: '#DCE7D5' })],
      ['job.ghost', c => outline2(c, P.dim, 24, 32, 6)],
      ['inv', c => inv2(c, P.copper)], ['inv.clean', c => inv2(c, P.sage)], ['inv.fail', c => inv2(c, P.peach, { void: 1 })],
      ['inv.ear', c => inv2(c, P.copper, { ear: P.sage })], ['inv.clean.ear', c => inv2(c, P.sage, { ear: '#DCE7D5' })],
      ['inv.ghost', c => outline2(c, P.dim, 20, 27, 5)], ['inv.risk', c => outline2(c, P.peach, 20, 27, 5)],
      ['hr.review', g2(P.slate)], ['stamp', c => stamp(c, P.slate)], ['stamp.ghost', c => { c.globalAlpha = 0.35; stamp(c, P.slate); }],
    ];
  };
  LG.SPRITES = function (P) {
    return [
      ['job', c => job(c, P.copper)], ['job.clean', c => job(c, P.sage)], ['job.fail', c => job(c, P.peach, { void: 1 })],
      ['job.ear', c => job(c, P.copper, { ear: P.sage })], ['job.clean.ear', c => job(c, P.sage, { ear: '#D9E4D3' })],
      ['job.dim', c => job(c, P.faint)], ['job.ghost', c => outline(c, P.faint, 'job')],
      ['inv', c => invoice(c, P.copper)], ['inv.clean', c => invoice(c, P.sage)], ['inv.fail', c => invoice(c, P.peach, { void: 1 })],
      ['inv.ear', c => invoice(c, P.copper, { ear: P.sage })], ['inv.clean.ear', c => invoice(c, P.sage, { ear: '#D9E4D3' })],
      ['inv.target', c => outline(c, P.dim, 'invoice')],
      ['hr', c => glass(c, P.copper)], ['hr.review', c => glass(c, P.slate)], ['hr.redo', c => glass(c, P.dim)],
      ['hr.fail', c => glass(c, P.peach, { strike: 1 })], ['hr.net', c => glass(c, P.sage)], ['hr.budget', c => outline(c, P.slate, 'glass')],
      ['hr.over', c => outline(c, P.peach, 'glass')], ['hr.ghost', c => outline(c, P.faint, 'glass')],
    ];
  };
  /** atlas: one row of cells; rebuilt by ctx.layer whenever the render scale changes. scale 2 = the 2× designs */
  LG.atlas = function (p, ctx, scale) {
    const sc = scale || 1, list = sc === 2 ? LG.SPRITES2(LG.PAL) : LG.SPRITES(LG.PAL), CW = CELL[0] * sc, CH = CELL[1] * sc, W = CW * list.length;
    const g = ctx.layer('lg-atlas' + sc, {
      w: W, h: CH, build: g => {
        const c = g.drawingContext, d = ctx.size.k;
        c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W * d, CH * d);
        list.forEach(([, f], i) => { c.save(); c.setTransform(d, 0, 0, d, i * CW * d, 0); f(c); c.restore(); });
      },
    });
    const idx = {}; list.forEach(([n], i) => (idx[n] = i));
    return { g, el: g.elt || g.canvas, idx, d: ctx.size.k, cw: CW, ch: CH };
  };
  /** draw sprite `name` with its top-left at (x, y); frac < 1 cuts it (Isotype partial symbol), never scales it */
  LG.blit = function (c, A, name, x, y, frac, w, h) {
    const i = A.idx[name]; if (i === undefined) return;
    const cw = w || A.cw || CELL[0], ch = h || A.ch || CELL[1], f = frac == null ? 1 : U.clamp(frac);
    if (f <= 0) return;
    c.drawImage(A.el, i * (A.cw || CELL[0]) * A.d, 0, cw * f * A.d, ch * A.d, x, y, cw * f, ch);
  };
  /** draw only the [f0, f1] slice of sprite `name` (a piece of a cut unit), in place */
  LG.blitPart = function (c, A, name, x, y, f0, f1, w, h) {
    const i = A.idx[name]; if (i === undefined || f1 <= f0) return;
    const cw = w || CELL[0], ch = h || CELL[1];
    c.drawImage(A.el, (i * (A.cw || CELL[0]) + f0 * cw) * A.d, 0, (f1 - f0) * cw * A.d, ch * A.d, x + f0 * cw, y, (f1 - f0) * cw, ch);
  };
  LG.CELL = CELL;

  /* ── exact binomial tail (for "chance of hitting the target"), log-space ── */
  LG.binomTail = function (n, q, kmin) {
    if (q <= 0) return kmin <= 0 ? 1 : 0; if (q >= 1) return kmin <= n ? 1 : 0;
    let lf = [0]; for (let i = 1; i <= n; i++) lf[i] = lf[i - 1] + Math.log(i);
    let s = 0; for (let k = Math.max(0, kmin); k <= n; k++) s += Math.exp(lf[n] - lf[k] - lf[n - k] + k * Math.log(q) + (n - k) * Math.log(1 - q));
    return Math.min(1, s);
  };

  root.LG = LG;
})(typeof window !== 'undefined' ? window : globalThis);
