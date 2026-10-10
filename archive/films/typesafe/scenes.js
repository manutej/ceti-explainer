/* ════════════════════════════════════════════════════════════════════
   Type-safe AI — SVG scenes (the classic ceti-explainer feature cut) · v2
   --------------------------------------------------------------------
   window.FEATURE for feature-engine.js. Seven movements on one clock.
   Governing picture: the switchyard. The schema compiles to a grammar and a
   grammar is a railroad diagram (Wirth; json.org) — position on the track is
   automaton state, open points are the tokens allowed next, the model's odds
   are load queued on each track, sampling is the car taking one track, type
   is gauge, validation is an inspection shed.
   Never: subway map, circuit board, toy train, flowchart. A track is always a
   PAIR of hairline rails TS.G.gauge apart; a car is a short dash between them.

   v2 (crit round): 1.3× type scale (headline 40, stage mono 15 / 13 min,
   DM Sans 18, counters 40), figures fill the Body (TS.G.body), payoff pulses
   are rect "stamps" around their own label so no ring ever crosses text.

   Law: every number, geometry and key time comes from data.js (window.TS).
   render(t, ctx) is a pure function of (t, ctx.state). Seeded rng in build only.
   Progressive enhancement: with window.P5Film present the p5 lane draws the
   counted marks (whale, load, comb stubs, runs); this file then skips those
   fallbacks and draws everything else.
   Constants introduced here (not in data.js) live in K and FS below.
   ──────────────────────────────────────────────────────────────────── */
window.FEATURE = (function () {
  'use strict';
  const TS = window.TS, G = TS.G, T = TS.T, SC = TS.SC;
  const NS = 'http://www.w3.org/2000/svg';

  /* ---------- type scale (v2: 1.3×) ---------- */
  const FS = { eyebrow: 13, small: 13, mono: 15, sans: 18, title: 58, counter: 40 };
  /* ---------- constants introduced by the SVG lane ---------- */
  const K = {
    RAIL_W: 1.25,           // rail stroke (viewBox units)
    CAR_W: 13, CAR_H: 5,    // the car (1.3× of 10×4)
    BLADE: 16,              // switch-blade length
    BLADE_SHUT: 14,         // M3 closed-point swing (degrees)
    SIDING_OPEN: 22.6,      // M4 blade angle while points are free (= siding start tangent, atan(5/12))
    REP: 40,                // M4 representative cars in the SVG cut (each = 50 runs)
    TOK_ACCEL: 0.6,         // M3 token cadence exponent (<1 = accelerating)
    BAR_H: 9,               // M3 fallback load bar height (≈ the p5 ribbon band)
    COMB_COLS: 128, COMB_ROWS: 20,   // M3 fallback comb: 2,560 stubs, each ≈ 50 tokens
    SLOT_W: 28, SLOT_H: 18, // M2 station slots
    STUB_DY: 15,            // M2 currency-station stubs (fan upward, one pitch apart)
    WHALE_LINES: 48,        // M1 ambient proximity-line budget
  };

  let ex, E, RM = false, HAS_P5 = false;
  const C = {}, RGB = {};

  /* ---------- DOM + math helpers ---------- */
  function el(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  /** text: o = { size, cls:'m'|'s'|'d', fill, anchor, ls, weight, op } */
  function tx(parent, str, x, y, o) {
    o = o || {};
    const a = { x, y, 'font-size': o.size || FS.mono, fill: o.fill || C.ink, class: 'ts-' + (o.cls || 'm') };
    if (o.anchor) a['text-anchor'] = o.anchor;
    if (o.ls != null) a['letter-spacing'] = o.ls;
    if (o.weight) a['font-weight'] = o.weight;
    if (o.op != null) a.opacity = o.op;
    const e = el('text', a, parent);
    e.textContent = str;
    return e;
  }
  function tspan(parent, str, attrs) { const s = el('tspan', attrs, parent); s.textContent = str; return s; }
  function tw(e, perChar) {
    try { const w = e.getComputedTextLength(); if (w > 0) return w; } catch (err) { /* headless gate */ }
    return (e.textContent || '').length * (perChar || 9);
  }
  function sub(e, i, n) { if (n <= 0) return 0; try { return e.getSubStringLength(i, n); } catch (err) { return n * 9; } }
  /** shrink font-size until the text fits maxW (never below FS.small) */
  function fit(e, maxW) {
    let fs = parseFloat(e.getAttribute('font-size'));
    while (tw(e) > maxW && fs > FS.small) { fs -= 0.5; e.setAttribute('font-size', fs); }
    return e;
  }
  function wrap(parent, str, x, y, maxW, lh, o) {
    const e = tx(parent, '', x, y, o), words = str.split(' '), lines = [];
    let cur = '';
    for (const w of words) { const cand = cur ? cur + ' ' + w : w; e.textContent = cand; if (tw(e) > maxW && cur) { lines.push(cur); cur = w; } else cur = cand; }
    if (cur) lines.push(cur);
    e.textContent = '';
    lines.forEach((l, i) => tspan(e, l, { x, dy: i ? lh : 0 }));
    return { e, n: lines.length };
  }
  const setOp = (n, o) => { n.setAttribute('opacity', (+o).toFixed(3)); };
  const show = (n, o) => { n.setAttribute('opacity', (+o).toFixed(3)); n.setAttribute('visibility', o <= 0.001 ? 'hidden' : 'visible'); };
  const tr = (n, x, y) => n.setAttribute('transform', 'translate(' + (+x).toFixed(2) + ' ' + (+y).toFixed(2) + ')');
  function rise(n, t, t0, d, dy) { const p = E.glaser(ex.prog(t, t0, t0 + (d || 0.55))); show(n, p); tr(n, 0, (1 - p) * (dy == null ? 16 : dy)); return p; }
  function setText(e, s) { if (e.textContent !== s) e.textContent = s; }
  const mulberry = (s) => () => { s |= 0; s = (s + 0x6D2B79F5) | 0; let z = Math.imul(s ^ (s >>> 15), 1 | s); z = (z + Math.imul(z ^ (z >>> 7), 61 | z)) ^ z; return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
  const fmtN = (n) => Math.round(n).toLocaleString('en-US');
  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const sup = (n) => String(n).split('').map(d => SUP[d]).join('');
  const rateStr = (r) => String(+(+r).toFixed(3));

  /* ---------- colour roles (read once from --ex-*) ---------- */
  function readTokens() {
    const cs = getComputedStyle(document.documentElement);
    const roles = { ground: '--ex-ground', panel: '--ex-panel', cell: '--ex-cell', ink: '--ex-ink', dim: '--ex-dim',
      line: '--ex-line', line2: '--ex-line-2', accent: '--ex-accent', sage: '--ex-accent2', slate: '--ex-support',
      peach: '--ex-peach', fill: '--ex-accent-fill' };
    const cv = document.createElement('canvas').getContext('2d');
    for (const k in roles) {
      const v = cs.getPropertyValue(roles[k]).trim();
      C[k] = v; cv.fillStyle = v; const s = String(cv.fillStyle);
      let r = 128, g = 128, b = 128, a = 1;
      if (s.charAt(0) === '#') { r = parseInt(s.substr(1, 2), 16); g = parseInt(s.substr(3, 2), 16); b = parseInt(s.substr(5, 2), 16); }
      else { const m = s.match(/[\d.]+/g); if (m) { r = +m[0]; g = +m[1]; b = +m[2]; a = m[3] != null ? +m[3] : 1; } }
      RGB[k] = [r, g, b, a];
    }
  }
  const A = (role, a) => { const c = RGB[role]; return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (c[3] * a).toFixed(3) + ')'; };

  /* ---------- track geometry ---------- */
  function cub(p0, p1, p2, p3, n) {
    const out = []; n = n || 24;
    for (let i = 0; i <= n; i++) { const u = i / n, v = 1 - u;
      out.push({ x: v * v * v * p0.x + 3 * v * v * u * p1.x + 3 * v * u * u * p2.x + u * u * u * p3.x,
                 y: v * v * v * p0.y + 3 * v * v * u * p1.y + 3 * v * u * u * p2.y + u * u * u * p3.y }); }
    return out;
  }
  const P = (x, y) => ({ x, y });
  const cat = (...arrs) => arrs.reduce((acc, a) => acc.concat(acc.length ? a.slice(1) : a), []);
  function poly(pts) { const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y)); return { pts, cum, len: cum[cum.length - 1] }; }
  function at(Pl, s) {
    s = ex.clamp(s, 0, Pl.len);
    let lo = 0, hi = Pl.cum.length - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (Pl.cum[m] <= s) lo = m; else hi = m; }
    const a = Pl.pts[lo], b = Pl.pts[hi], f = (s - Pl.cum[lo]) / Math.max(1e-9, Pl.cum[hi] - Pl.cum[lo]);
    return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f, a: Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI };
  }
  function offD(pts, o) {
    return pts.map((p, i) => {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
      const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1;
      return (i ? 'L' : 'M') + (p.x - dy / L * o).toFixed(2) + ' ' + (p.y + dx / L * o).toFixed(2);
    }).join(' ');
  }
  /** a rail PAIR along a centreline polyline; draw(p) reveals it start→end */
  function Rails(parent, pts, stroke) {
    const g = el('g', null, parent), h = G.gauge / 2;
    const mk = (o) => el('path', { d: offD(pts, o), fill: 'none', stroke, 'stroke-width': K.RAIL_W, pathLength: 1, 'stroke-dasharray': '1 2', 'stroke-dashoffset': 0 }, g);
    const a = mk(-h), b = mk(h);
    let lastC = stroke, lastP = -1;
    return {
      g, Pl: poly(pts),
      draw(p) { p = ex.clamp(p); if (p === lastP) return; lastP = p; const o = (1 - p).toFixed(4); a.setAttribute('stroke-dashoffset', o); b.setAttribute('stroke-dashoffset', o); },
      col(c) { if (c === lastC) return; lastC = c; a.setAttribute('stroke', c); b.setAttribute('stroke', c); },
      op(o) { setOp(g, o); },
    };
  }
  function Blade(parent, x, y, len, stroke) {
    const g = el('g', null, parent), h = G.gauge / 2;
    const a = el('line', { x1: 0, y1: -h, x2: len, y2: -h, stroke, 'stroke-width': K.RAIL_W * 1.4 }, g);
    const b = el('line', { x1: 0, y1: h, x2: len, y2: h, stroke, 'stroke-width': K.RAIL_W * 1.4 }, g);
    return { g, set(ang, c, o) { g.setAttribute('transform', 'translate(' + x + ' ' + y + ') rotate(' + ang.toFixed(2) + ')'); a.setAttribute('stroke', c); b.setAttribute('stroke', c); setOp(g, o == null ? 1 : o); } };
  }
  function Car(parent, fill) { return el('rect', { x: -K.CAR_W / 2, y: -K.CAR_H / 2, width: K.CAR_W, height: K.CAR_H, fill, opacity: 0 }, parent); }
  function placeCar(c, pos, o, fill) {
    c.setAttribute('transform', 'translate(' + pos.x.toFixed(2) + ' ' + pos.y.toFixed(2) + ') rotate(' + (pos.a || 0).toFixed(2) + ')');
    show(c, o == null ? 1 : o); if (fill) c.setAttribute('fill', fill);
  }
  /** expanding circle (only where nothing is written within its reach) */
  function Ring(parent, stroke) { return el('circle', { r: 0, fill: 'none', stroke, 'stroke-width': 1.3, opacity: 0 }, parent); }
  function ring(c, t, w, x, y, r0, r1, a) {
    const p = ex.prog(t, w[0], w[1]);
    if (p <= 0 || p >= 1) { c.setAttribute('opacity', 0); return; }
    c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', (r0 + (r1 - r0) * E.glaser(p)).toFixed(2));
    c.setAttribute('opacity', ((a || 0.6) * (1 - p)).toFixed(3));
  }
  /** a "stamp": a rounded rect that grows out from a label's own box — never crosses other text */
  function Stamp(parent, stroke) { return el('rect', { fill: 'none', stroke, 'stroke-width': 1.3, rx: 4, opacity: 0 }, parent); }
  function stamp(s, t, w, box, grow, a) {
    const p = ex.prog(t, w[0], w[1]);
    if (p <= 0 || p >= 1 || !box) { s.setAttribute('opacity', 0); return; }
    const g = 2 + (grow || 8) * E.glaser(p);
    s.setAttribute('x', (box.x - g).toFixed(1)); s.setAttribute('y', (box.y - g).toFixed(1));
    s.setAttribute('width', (box.w + 2 * g).toFixed(1)); s.setAttribute('height', (box.h + 2 * g).toFixed(1));
    s.setAttribute('opacity', ((a || 0.8) * (1 - p)).toFixed(3));
  }
  function Check(parent, x, y, r, col) {
    const g = el('g', null, parent);
    el('circle', { cx: x, cy: y, r, fill: 'none', stroke: col, 'stroke-width': 1.4 }, g);
    el('path', { d: 'M' + (x - r * 0.45) + ' ' + (y + r * 0.02) + ' l ' + (r * 0.32) + ' ' + (r * 0.36) + ' l ' + (r * 0.6) + ' ' + (-r * 0.72), fill: 'none', stroke: col, 'stroke-width': 1.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    return g;
  }
  function Cross(parent, x, y, r, col) {
    const g = el('g', null, parent), q = r * 0.42;
    el('circle', { cx: x, cy: y, r, fill: 'none', stroke: col, 'stroke-width': 1.4 }, g);
    el('path', { d: 'M' + (x - q) + ' ' + (y - q) + ' L' + (x + q) + ' ' + (y + q) + ' M' + (x + q) + ' ' + (y - q) + ' L' + (x - q) + ' ' + (y + q), fill: 'none', stroke: col, 'stroke-width': 1.6, 'stroke-linecap': 'round' }, g);
    return g;
  }
  function Warn(parent, x, y, col) {
    const g = el('g', null, parent);
    el('path', { d: 'M' + x + ' ' + (y - 16) + ' l 10 18 h -20 z', fill: 'none', stroke: col, 'stroke-width': 1.4, 'stroke-linejoin': 'round' }, g);
    el('line', { x1: x, y1: y - 10, x2: x, y2: y - 4, stroke: col, 'stroke-width': 1.6, 'stroke-linecap': 'round' }, g);
    el('circle', { cx: x, cy: y - 0.6, r: 1.1, fill: col }, g);
    return g;
  }

  /* ---------- scene scaffolding ---------- */
  const groups = {};
  function sceneHead(g, eyebrow, title) {
    const e1 = tx(g, eyebrow, G.head.cx, G.head.eyebrowY, { size: FS.eyebrow, ls: 4, fill: C.dim, anchor: 'middle', op: 0 });
    const hg = el('g', { opacity: 0 }, g);
    tx(hg, title, G.head.cx, G.head.titleY, { size: G.head.titleSize, cls: 'd', anchor: 'middle' });
    return { set(t, a) { setOp(e1, E.defer(ex.prog(t, a, a + 0.6)) * 0.9); const p = E.glaser(ex.prog(t, a + 0.25, a + 0.95)); setOp(hg, p); tr(hg, 0, (1 - p) * 14); } };
  }
  function gate(g, t, r) { const o = ex.fade(t, r); show(g, o); return o > 0; }
  function footLine(g, y, anchor, x) { return tx(g, '', x == null ? G.head.cx : x, y, { size: FS.small, fill: C.dim, anchor: anchor || 'middle', op: 0 }); }

  /* ════════════════ BUILD ════════════════ */
  const N = {};
  let rng;
  function build(svg, ctx) {
    ex = ctx.ex; E = ex.ease; RM = !!ctx.rm; HAS_P5 = !!window.P5Film;
    rng = mulberry(20261007);
    readTokens();
    const style = el('style', null, svg);
    style.textContent = '.ts-m{font-family:var(--font-mono);white-space:pre} .ts-s{font-family:var(--font-sans)} .ts-d{font-family:var(--font-display);font-style:italic;font-weight:300}';
    N.wh = el('g', { opacity: 0 }, svg);
    ['s1', 's2', 's3', 's4', 's5', 's6', 's7'].forEach(k => (groups[k] = el('g', { opacity: 0, visibility: 'hidden' }, svg)));
    buildWhale(); buildM1(); buildM2(); buildM3(); buildM4(); buildM5(); buildM6(); buildM7();
  }

  /* ════════════════ M1 + M7 · the whale bookend ════════════════
     SVG cut (!HAS_P5): ~70 circles sampled with TS.samplePath at TS.G.TF1 / TF7.
     p5 cut: 1,200 marks (whale layer). SVG always: streaks, eye ring. */
  const STREAKS = [
    ['M148 78 C 196 92, 250 122, 312 158', 'accent', 2.0, 0.85], ['M168 86 C 222 102, 282 132, 348 168', 'sage', 1.6, 0.8],
    ['M188 92 C 246 110, 310 142, 380 178', 'peach', 2.2, 0.85], ['M210 98 C 270 116, 336 148, 410 184', 'slate', 1.3, 0.7],
    ['M232 104 C 292 122, 358 152, 434 186', 'accent', 1.1, 0.6], ['M256 110 C 314 126, 376 152, 452 184', 'sage', 1.4, 0.55],
    ['M280 116 C 332 130, 388 150, 462 178', 'dim', 1.0, 0.45],
  ];
  function buildWhale() {
    const W = N.W = { parts: [], segs: [], lines: [] };
    W.gStreak = el('g', { opacity: 0 }, N.wh);
    W.streaks = STREAKS.map((s, i) => ({ e: el('path', { d: s[0], fill: 'none', stroke: C[s[1]], 'stroke-width': s[2], 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': '1 2', 'stroke-dashoffset': 1 }, W.gStreak), w: s[2], op: s[3], i }));
    if (!HAS_P5) {
      const base = [];
      G.WPATHS.forEach(wp => TS.samplePath(wp.d, wp.n).forEach((p, k) => { const idx = base.length; base.push(p); if (k) W.segs.push([idx - 1, idx]); }));
      base.push({ x: G.EYE.x, y: G.EYE.y });
      W.T1 = base.map(p => TS.tf(G.TF1, p)); W.T7 = base.map(p => TS.tf(G.TF7, p));
      const gl = el('g', null, N.wh);
      for (let i = 0; i < W.segs.length + K.WHALE_LINES; i++) W.lines.push(el('line', { stroke: C.dim, 'stroke-width': 0.9, opacity: 0 }, gl));
      base.forEach(() => {
        const p = { x: rng() * G.W, y: G.body.y0 + rng() * (G.body.y1 - G.body.y0), dx: (rng() - 0.5) * 14, dy: (rng() - 0.5) * 10, r: 1.1 + rng() * 1.4, cx: 0, cy: 0 };
        p.e = el('circle', { r: p.r.toFixed(2), fill: C.ink, opacity: 0.3 }, N.wh);
        W.parts.push(p);
      });
    }
    W.eye = el('circle', { r: 5, fill: 'none', stroke: C.accent, 'stroke-width': 1.4, opacity: 0 }, N.wh);
    W.eyeDot = el('circle', { r: 2.2, fill: C.accent, opacity: 0 }, N.wh);
    W.ring = Ring(N.wh, C.accent);
    W.mode = 0;
  }
  function uWhale(t) {
    const W = N.W, o = Math.max(ex.fade(t, SC.s1), ex.fade(t, SC.s7));
    show(N.wh, o); if (o <= 0) return;
    const m7 = t > SC.s4[0], TF = m7 ? G.TF7 : G.TF1;
    const conv = m7 ? E.glaser(ex.prog(t, T.m7.conv[0], T.m7.conv[1]))
                    : E.glaser(ex.prog(t, T.m1.conv[0], T.m1.conv[1])) * (1 - E.collect(ex.prog(t, T.m1.disperse[0], T.m1.disperse[1])));
    W.gStreak.setAttribute('transform', 'translate(' + TF.tx + ' ' + TF.ty + ') scale(' + TF.s + ')');
    if (W.mode !== (m7 ? 7 : 1)) { W.mode = m7 ? 7 : 1; W.streaks.forEach(s => s.e.setAttribute('stroke-width', (s.w * 1.3 / TF.s).toFixed(3))); }
    setOp(W.gStreak, conv);
    const s0 = m7 ? T.m7.conv[1] - 2.4 : T.m1.title[0] - 1.2;
    W.streaks.forEach(s => { const p = E.glaser(ex.prog(t, s0 + s.i * 0.15, s0 + s.i * 0.15 + 1.2)); s.e.setAttribute('stroke-dashoffset', (1 - p).toFixed(4)); setOp(s.e, s.op * p); });
    if (!HAS_P5) {
      const Tg = m7 ? W.T7 : W.T1, drift = RM ? 0 : t, rs = 1.3 * Math.sqrt(TF.s);
      W.parts.forEach((p, i) => {
        let x = (p.x + p.dx * drift) % G.W; if (x < 0) x += G.W;
        let y = G.body.y0 + (((p.y - G.body.y0 + p.dy * drift) % (G.body.y1 - G.body.y0)) + (G.body.y1 - G.body.y0)) % (G.body.y1 - G.body.y0);
        p.cx = ex.lerp(x, Tg[i].x, conv); p.cy = ex.lerp(y, Tg[i].y, conv);
        p.e.setAttribute('cx', p.cx.toFixed(1)); p.e.setAttribute('cy', p.cy.toFixed(1)); p.e.setAttribute('r', (p.r * rs).toFixed(2));
        setOp(p.e, ex.lerp(0.22, 0.92, conv));
      });
      const NSEG = W.segs.length;
      for (let k = 0; k < NSEG; k++) {
        const L = W.lines[k], [i, j] = W.segs[k];
        if (conv > 0.02) { L.setAttribute('x1', W.parts[i].cx.toFixed(1)); L.setAttribute('y1', W.parts[i].cy.toFixed(1)); L.setAttribute('x2', W.parts[j].cx.toFixed(1)); L.setAttribute('y2', W.parts[j].cy.toFixed(1)); setOp(L, conv * 0.55); }
        else setOp(L, 0);
      }
      let li = NSEG; const amb = 0.3 * (1 - conv);
      if (amb > 0.01) for (let i = 0; i < W.parts.length && li < W.lines.length; i++) for (let j = i + 1; j < W.parts.length && li < W.lines.length; j++) {
        const dx = W.parts[i].cx - W.parts[j].cx, dy = W.parts[i].cy - W.parts[j].cy, d2 = dx * dx + dy * dy;
        if (d2 < 5200) { const L = W.lines[li++]; L.setAttribute('x1', W.parts[i].cx.toFixed(1)); L.setAttribute('y1', W.parts[i].cy.toFixed(1)); L.setAttribute('x2', W.parts[j].cx.toFixed(1)); L.setAttribute('y2', W.parts[j].cy.toFixed(1)); setOp(L, amb * (1 - Math.sqrt(d2) / 72)); }
      }
      while (li < W.lines.length) setOp(W.lines[li++], 0);
    }
    const eye = TS.tf(TF, G.EYE), te = m7 ? T.m7.ring[0] : T.m1.eye;
    const pe = E.glaser(ex.prog(t, te - 0.4, te + 0.2)) * conv;
    [W.eye, W.eyeDot].forEach(c => { c.setAttribute('cx', eye.x); c.setAttribute('cy', eye.y); setOp(c, pe); });
    ring(W.ring, t, m7 ? T.m7.ring : [T.m1.eye, T.m1.eye + 0.8], eye.x, eye.y, 6, 22, 0.7);
  }

  /* ════════════════ M1 · Hook (0–12) ════════════════ */
  function buildM1() {
    const g = groups.s1, M = N.m1 = {};
    M.k = tx(g, 'CETI EXPLAINERS · TWO MINUTES', G.head.cx, G.head.eyebrowY, { size: FS.eyebrow, ls: 4, fill: C.dim, anchor: 'middle', op: 0 });
    M.title = el('g', { opacity: 0 }, g);
    const ty = 400;   // title sits under the big whale (tail/flipper end ≈ y 300)
    const tt = tx(M.title, 'Type-safe ', G.head.cx, ty, { size: FS.title, cls: 'd', anchor: 'middle' });
    tspan(tt, 'AI', { fill: C.accent });
    M.half = Math.max(190, tw(tt) / 2 + 36); M.ry = ty + 26;
    M.rail = Rails(g, [P(480 - M.half, M.ry), P(480 + M.half, M.ry)], C.accent);
    M.car = Car(g, C.ink);
    M.sub = tx(g, 'How a model is made to keep its promises.', G.head.cx, M.ry + 40, { size: 22, cls: 's', fill: C.dim, anchor: 'middle', op: 0 });
  }
  function u1(t) {
    const M = N.m1; if (!gate(groups.s1, t, SC.s1)) return;
    setOp(M.k, E.defer(ex.prog(t, 0.3, 1.0)) * 0.9);
    const p = E.glaser(ex.prog(t, T.m1.title[0], T.m1.title[1])); setOp(M.title, p); tr(M.title, 0, (1 - p) * 18);
    M.rail.draw(E.glaser(ex.prog(t, T.m1.title[1] - 0.3, T.m1.title[1] + 0.9)));
    const pp = E.glaser(ex.prog(t, T.m1.sub[0], T.m1.sub[1])); setOp(M.sub, pp); tr(M.sub, 0, (1 - pp) * 12);
    const c0 = T.m1.sub[1] + 0.6, c1 = T.m1.disperse[0] - 0.2, cp = E.rest(ex.prog(t, c0, c1));
    placeCar(M.car, { x: 480 - M.half + 8 + (2 * M.half - 16) * cp, y: M.ry, a: 0 }, ex.prog(t, c0, c0 + 0.3) * (1 - ex.prog(t, c1 - 0.3, c1)));
  }

  /* ════════════════ M2 · The contract (12–32) ════════════════
     12–24 the raw reply and four failures (peach) fill the body;
     24–32 the schema as written, then as track: four 28×18 slots, values seated above;
     at ~28.5 the currency slot sprouts USD│EUR│MXN — the junction of M3, small. */
  function buildM2() {
    const g = groups.s2, M = N.m2 = {};
    M.head = sceneHead(g, '01 — THE CONTRACT', 'Mostly right is the problem');
    M.A = el('g', null, g);
    // the well fills the body (x, y, w from data; height runs to the body's foot)
    const W = { x: G.well.x, y: G.body.y0 + 8, w: G.well.w }; W.h = G.body.y1 - W.y;
    const ix = W.x + 24, iw = W.w - 48;
    M.W = W; M.ix = ix;
    M.well = el('g', { opacity: 0 }, M.A);
    el('rect', { x: W.x, y: W.y, width: W.w, height: W.h, rx: 6, fill: C.panel, stroke: C.line, 'stroke-width': 1 }, M.well);
    tx(M.well, 'INPUT', ix, W.y + 30, { size: FS.small, ls: 2.5, fill: C.dim });
    const inp = wrap(M.well, TS.INPUT, ix, W.y + 56, iw, 24, { size: FS.sans, cls: 's', fill: C.ink });
    const dy = W.y + 56 + (inp.n - 1) * 24 + 20;
    el('line', { x1: ix, y1: dy, x2: W.x + W.w - 24, y2: dy, stroke: C.line2, 'stroke-width': 1 }, M.well);
    M.replyLab = tx(M.well, 'MODEL REPLY', ix, dy + 28, { size: FS.small, ls: 2.5, fill: C.dim, op: 0 });
    M.ry0 = dy + 56; M.rlh = 24;
    M.raw = TS.RAW.map((s, i) => { const e = tx(M.well, s, ix, M.ry0 + i * M.rlh, { size: FS.mono, fill: i === 0 || i === TS.RAW.length - 1 ? C.dim : C.ink }); fit(e, iw); return { e, s }; });
    const cul = [[0, TS.RAW[0]], [2, '"$1,200.00"'], [3, '"dollars"'], [4, '"15 Nov 2026"']];
    M.under = cul.map(([li, s]) => {
      const e = M.raw[li].e, i0 = TS.RAW[li].indexOf(s), x0 = ix + sub(e, 0, i0), w = sub(e, i0, s.length), y = M.ry0 + li * M.rlh + 5;
      return { ln: el('line', { x1: x0, y1: y, x2: x0, y2: y, stroke: C.peach, 'stroke-width': 1.4, opacity: 0 }, M.well), x0, w };
    });
    M.total = TS.RAW.reduce((a, s) => a + s.length, 0);
    M.raw.forEach(r => (r.e.textContent = ''));
    M.caret = el('rect', { width: 9, height: 16, fill: C.dim, opacity: 0 }, M.well);
    // the failures fill the right column (x from data; rows spread over the body)
    const F = G.fails, fy0 = G.body.y0 + 66, fdy = (G.body.y1 - 26 - fy0) / 3;
    M.fHead = tx(M.A, 'WHAT YOUR CODE DOES NEXT', F.x, G.body.y0 + 30, { size: FS.small, ls: 2.5, fill: C.dim, op: 0 });
    M.fails = TS.FAILURES.map((f, i) => {
      const y = fy0 + i * fdy, gi = el('g', { opacity: 0 }, M.A);
      tx(gi, String(i + 1), F.x, y, { size: FS.small, fill: C.dim });
      const code = tx(gi, f.code, F.x + 26, y, { size: FS.mono, fill: C.ink });
      tx(gi, f.result, F.x + 26, y + 27, { size: FS.sans, cls: 's', fill: f.silent ? C.ink : C.peach });
      let box = null;
      if (f.silent) {
        const x = F.x + 26 + tw(code) + 16, tg = el('g', null, gi);
        const tt = tx(tg, 'SILENT', x + 9, y, { size: FS.small, ls: 1.8, fill: C.peach, weight: 700 });
        const w = tw(tt) + 18;
        el('rect', { x, y: y - 13, width: w, height: 18, rx: 2, fill: 'none', stroke: C.peach, 'stroke-width': 1.2 }, tg);
        box = { x, y: y - 13, w, h: 18 };
      }
      return { g: gi, box };
    });
    M.stamp = Stamp(M.A, C.peach);
    // phase B — the schema as written, then as track
    M.B = el('g', { opacity: 0 }, g);
    const S = G.schemaTrack;
    M.code = el('g', { opacity: 0 }, M.B);
    tx(M.code, 'THE SCHEMA, AS WRITTEN — AND AS TRACK', G.head.cx, G.body.y0 + 34, { size: FS.small, ls: 2.5, fill: C.dim, anchor: 'middle' });
    const ce = tx(M.code, '', G.head.cx, G.body.y0 + 70, { size: FS.mono, fill: C.dim, anchor: 'middle' });
    tspan(ce, 'type Invoice = { ');
    M.codeF = TS.FIELDS.map((f, i) => {
      const ty = f.key === 'currency' ? TS.ENUM.map(v => '"' + v + '"').join(' | ') : f.type;
      const sp = tspan(ce, f.key + ': ' + ty, { fill: C.ink });
      if (i < TS.FIELDS.length - 1) tspan(ce, '; ');
      return sp;
    });
    tspan(ce, ' }');
    fit(ce, S.x1 - S.x0 + 40);
    M.track = Rails(M.B, [P(S.x0, S.y), P(S.x1, S.y)], A('dim', 0.6));
    M.rowHead = el('g', { opacity: 0 }, M.B);
    tx(M.rowHead, 'Invoice', S.x0, S.y + 40, { size: FS.sans, cls: 's', fill: C.ink });
    tx(M.rowHead, 'type', S.x0, S.y + 62, { size: FS.small, fill: C.dim });
    M.st = TS.FIELDS.map((f, i) => {
      const x = S.stations[i], sg = el('g', { opacity: 0 }, M.B);
      const slot = el('rect', { x: x - K.SLOT_W / 2, y: S.y - K.SLOT_H / 2, width: K.SLOT_W, height: K.SLOT_H, rx: 2, fill: C.ground, stroke: C.dim, 'stroke-width': 1.2 }, sg);
      const key = tx(sg, f.key, x, S.y + 40, { size: FS.mono, fill: C.ink, anchor: 'middle' });
      tx(sg, f.type, x, S.y + 62, { size: FS.small, fill: C.dim, anchor: 'middle' });
      const vg = el('g', { opacity: 0 }, M.B);
      tx(vg, f.value, x, S.y - 26, { size: FS.sans, cls: 's', fill: C.sage, anchor: 'middle' });
      return { x, sg, slot, key, vg };
    });
    // the currency slot sprouts three stubs: the grammar's junction, small
    const cs = M.st[TS.FIELDS.findIndex(f => f.key === 'currency')];
    M.stubs = TS.ENUM.map((v, i) => {
      const dy = -(i + 1) * K.STUB_DY, x0 = cs.x + K.SLOT_W / 2;
      const pts = cub(P(x0, S.y), P(x0 + 22, S.y), P(x0 + 30, S.y + dy), P(x0 + 60, S.y + dy), 16);
      const sgp = el('g', { opacity: 0 }, M.B);
      const r = Rails(sgp, pts, A('dim', 0.7));
      const lab = tx(sgp, v, x0 + 66, S.y + dy + 4, { size: FS.small, fill: C.dim });
      return { g: sgp, r, lab, v };
    });
    M.car = Car(M.B, C.ink);
    // before / after: the raw reply's broken values strike through as the car passes; typed values seat in
    M.ba = el('g', { opacity: 0 }, M.B);
    const yB = S.y + 106, yA = S.y + 134;
    el('line', { x1: S.x0, y1: S.y + 82, x2: S.x1, y2: S.y + 82, stroke: C.line2, 'stroke-width': 1 }, M.ba);
    tx(M.ba, 'reply', G.well.x, yB, { size: FS.small, fill: C.dim });     // row labels in the left margin, clear of the customer column
    tx(M.ba, 'typed', G.well.x, yA, { size: FS.small, fill: C.sage });
    const BEFORE = ['Sure! Here is…', '"$1,200.00"', '"dollars"', '"15 Nov 2026"'];   // leading prose broke the parse before customer
    M.ba2 = TS.FIELDS.map((f, i) => {
      const x = S.stations[i];
      const b = tx(M.ba, BEFORE[i], x, yB, { size: FS.mono, fill: C.dim, anchor: 'middle' });
      const w = tw(b);
      const strike = el('line', { x1: x - w / 2 - 2, y1: yB - 5, x2: x - w / 2 - 2, y2: yB - 5, stroke: C.peach, 'stroke-width': 1.4, opacity: 0 }, M.ba);
      const ag = el('g', { opacity: 0 }, M.ba);
      tx(ag, f.value, x, yA, { size: FS.mono, fill: C.sage, anchor: 'middle' });
      return { x, b, w, strike, ag };
    });
  }
  function u2(t) {
    const M = N.m2; if (!gate(groups.s2, t, SC.s2)) return;
    M.head.set(t, T.m2.head);
    const col = E.rest(ex.prog(t, T.m2.collapse[0], T.m2.collapse[1]));
    show(M.A, 1 - col); tr(M.A, 0, -12 * col);
    if (col < 1) {
      const pw = E.glaser(ex.prog(t, T.m2.well, T.m2.well + 0.7)); setOp(M.well, pw); tr(M.well, 0, (1 - pw) * 16);
      setOp(M.replyLab, ex.prog(t, T.m2.type[0] - 0.4, T.m2.type[0]));
      const tp = ex.prog(t, T.m2.type[0], T.m2.type[1]), n = Math.floor(M.total * (0.35 * tp + 0.65 * tp * tp));
      let left = n, cx = M.ix, cy = M.ry0;
      M.raw.forEach((r, i) => {
        const k = Math.max(0, Math.min(r.s.length, left)); left -= r.s.length;
        setText(r.e, r.s.slice(0, k));
        if (k > 0 && (k < r.s.length || left <= 0)) { cx = M.ix + tw(r.e); cy = M.ry0 + i * M.rlh; }
      });
      M.caret.setAttribute('x', (cx + 2).toFixed(1)); M.caret.setAttribute('y', (cy - 13).toFixed(1));
      setOp(M.caret, ex.prog(t, T.m2.type[0] - 0.3, T.m2.type[0]) * (1 - ex.prog(t, T.m2.stamps[0] - 0.4, T.m2.stamps[0])) * 0.8);
      setOp(M.fHead, ex.prog(t, T.m2.stamps[0] - 0.5, T.m2.stamps[0]) * 0.9);
      M.fails.forEach((f, i) => {
        const p = E.glaser(ex.prog(t, T.m2.stamps[i], T.m2.stamps[i] + 0.45)); show(f.g, p); tr(f.g, (1 - p) * 18, 0);
        const u = M.under[i], q = E.glaser(ex.prog(t, T.m2.stamps[i] + 0.1, T.m2.stamps[i] + 0.6));
        u.ln.setAttribute('x2', (u.x0 + u.w * q).toFixed(1)); setOp(u.ln, q * 0.9);
      });
      stamp(M.stamp, t, T.m2.silentRing, M.fails.find(f => f.box).box, 9, 0.85);
    }
    const pb = ex.prog(t, T.m2.track[0] - 0.4, T.m2.track[0] + 0.2); show(M.B, pb);
    if (pb <= 0) return;
    const S = G.schemaTrack;
    const pc = E.glaser(ex.prog(t, T.m2.track[0] - 0.4, T.m2.track[0] + 0.4)); setOp(M.code, pc); tr(M.code, 0, (1 - pc) * 10);
    M.track.draw(E.glaser(ex.prog(t, T.m2.track[0], T.m2.track[1])));
    const ph = E.glaser(ex.prog(t, T.m2.stationLabel0 - 0.4, T.m2.stationLabel0 + 0.2)); setOp(M.rowHead, ph); tr(M.rowHead, 0, (1 - ph) * 12);
    const cp = E.rest(ex.prog(t, T.m2.car[0], T.m2.car[1])), cx = ex.lerp(S.x0 + 8, S.x1 - 8, cp);
    placeCar(M.car, { x: cx, y: S.y, a: 0 }, ex.prog(t, T.m2.car[0] - 0.4, T.m2.car[0]));
    M.st.forEach((s, i) => {
      const p = rise(s.sg, t, T.m2.stationLabel0 + i * 0.18, 0.55, 14);
      const lit = cx >= s.x - 2;
      s.slot.setAttribute('stroke', lit ? C.sage : C.dim); s.slot.setAttribute('fill', lit ? A('sage', 0.16) : C.ground);
      s.key.setAttribute('fill', lit ? C.sage : C.ink); M.codeF[i].setAttribute('fill', lit ? C.sage : C.ink);
      const pv = E.glaser(ex.clamp((cx - s.x) / 60)); show(s.vg, pv * p); tr(s.vg, 0, (1 - pv) * 10);
    });
    // the currency junction: sprouts between the car's start and its arrival there
    const ci = TS.FIELDS.findIndex(f => f.key === 'currency');
    const sp0 = T.m2.car[0] + (T.m2.car[1] - T.m2.car[0]) * 0.42;   // ≈ 28.5
    const curLit = cx >= M.st[ci].x - 2;
    M.stubs.forEach((s, i) => {
      const p = E.glaser(ex.prog(t, sp0 + i * 0.12, sp0 + 0.5 + i * 0.12)); show(s.g, p); if (s.r) s.r.draw(p);
      const chosen = s.v === 'USD';
      const c = curLit ? (chosen ? C.sage : A('dim', 0.6)) : C.dim;
      s.lab.setAttribute('fill', c); if (s.r) s.r.col(curLit ? (chosen ? C.sage : A('dim', 0.35)) : A('dim', 0.7));
    });
    setOp(M.ba, E.glaser(ex.prog(t, T.m2.stationLabel0 + 0.6, T.m2.stationLabel0 + 1.2)));
    M.ba2.forEach(r => {
      const q = E.glaser(ex.clamp((cx - r.x + 4) / 50));
      r.strike.setAttribute('x2', (r.x - r.w / 2 - 2 + (r.w + 4) * q).toFixed(1)); setOp(r.strike, q > 0 ? 1 : 0);
      r.b.setAttribute('fill', q > 0 ? A('peach', 0.85) : C.dim);
      show(r.ag, q); tr(r.ag, 0, (1 - q) * 8);
    });
  }

  /* ════════════════ M3 · The mask (32–56) ════════════════ */
  function buildM3() {
    const g = groups.s3, M = N.m3 = {};
    M.head = sceneHead(g, '02 — THE MASK', 'Only the open tracks');
    const L = G.lockup, F = G.fan, Q = G.queue, J = G.J;
    M.lock = el('g', { opacity: 0 }, g);
    M.lockT = tx(M.lock, '', L.x, L.y, { size: FS.mono, fill: C.ink });
    M.toks = TS.PREFIX_TOKENS.map(s => tspan(M.lockT, s, { visibility: 'hidden' }));
    fit(M.lockT, (G.W - 2 * L.x) * 0.7);
    M.prefixW = tw(M.lockT);
    M.tokX = []; { TS.PREFIX_TOKENS.forEach((s, i) => M.tokX.push(L.x + sub(M.lockT, 0, TS.PREFIX_TOKENS.slice(0, i).join('').length))); }
    M.tail = tx(M.lock, '', L.x + M.prefixW, L.y, { size: parseFloat(M.lockT.getAttribute('font-size')), fill: C.accent, op: 0 });
    M.curTok = el('line', { x1: 0, y1: L.y + 6, x2: 0, y2: L.y + 6, stroke: C.accent, 'stroke-width': 1.4, opacity: 0 }, M.lock);
    M.stamp = Stamp(M.lock, C.accent);
    // the automaton state, named
    M.state = tx(g, '', L.x, L.y + 24, { size: FS.small, fill: C.dim, op: 0 });
    M.stateW = G.labels.tokX - L.x - 16;
    // the yard
    M.yard = el('g', { opacity: 0 }, g);
    M.entry = Rails(M.yard, [P(G.entry.x0, G.entry.y), P(G.entry.x1, G.entry.y)], A('dim', 0.65));
    const xEnd = G.labels.probX - 14;
    M.tr = TS.CANDS.map((c, i) => {
      const y = F.ys[i];
      const curve = cub(P(J.x, J.y), P(J.x + 64, J.y), P(J.x + 86, y), P(F.xBend, y), 26);
      const tg = el('g', null, M.yard);
      const appr = Rails(tg, curve, A('dim', 0.55));
      const beyond = Rails(tg, [P(F.xBend + K.BLADE, y), P(xEnd, y)], A('dim', 0.55));
      const blade = Blade(tg, F.xBend, y, K.BLADE, C.accent);
      const lab = tx(tg, c.tok, G.labels.tokX + 6, y - 9, { size: FS.mono, fill: C.ink, op: 0 });
      const strike = el('line', { x1: G.labels.tokX + 4, y1: y - 14, x2: G.labels.tokX + 8 + tw(lab), y2: y - 14, stroke: C.dim, 'stroke-width': 1.2, opacity: 0 }, tg);
      const bar = HAS_P5 ? null : el('rect', { x: Q.x0, y: y - K.BAR_H / 2, width: 0, height: K.BAR_H, fill: A('ink', 0.4) }, tg);
      const prob = tx(tg, '', G.labels.probX, y + 5, { size: FS.mono, fill: C.ink, op: 0 });
      return { i, y, tg, appr, beyond, blade, lab, strike, bar, prob, Pl: poly(cat(curve, [P(F.xBend, y), P(xEnd, y)])) };
    });
    M.odds = tx(M.yard, '', G.labels.probX + 40, F.ys[F.ys.length - 1] + 24, { size: FS.small, ls: 1.5, fill: C.dim, anchor: 'end', op: 0 });
    M.car = Car(M.yard, C.ink);
    // second junction on the US track: only "D" opens (real if the draw took US, a ghost otherwise)
    M.ghost = el('g', { opacity: 0 }, M.yard);
    const J2 = G.ghost.J2;
    M.gStubs = [-14, 14].map(d => ({ r: Rails(M.ghost, cub(P(J2.x, J2.y), P(J2.x + 30, J2.y), P(J2.x + 42, J2.y + d), P(J2.x + 74, J2.y + d), 18), A('dim', 0.6)) }));
    M.gOpen = Rails(M.ghost, [P(J2.x, J2.y - 0.01), P(J2.x + 110, J2.y - 0.01)], C.accent);
    M.gLab = tx(M.ghost, 'D', J2.x + 118, J2.y + 5, { size: FS.mono, fill: C.accent, weight: 700 });
    M.gCar = el('rect', { x: -K.CAR_W / 2, y: -K.CAR_H / 2, width: K.CAR_W, height: K.CAR_H, fill: 'none', stroke: C.ink, 'stroke-width': 1, opacity: 0 }, M.ghost);
    M.foot = footLine(g, G.foot.y);
    // the vocabulary
    M.vocab = el('g', { opacity: 0 }, g);
    const CB = G.comb;
    M.vCount = tx(M.vocab, '', CB.x1, L.y + 24, { size: FS.mono, fill: C.ink, anchor: 'end' });
    M.vLab = tx(M.vocab, HAS_P5 ? 'THE WHOLE VOCABULARY · ONE STUB PER TOKEN' : 'THE WHOLE VOCABULARY · EACH STUB ≈ ' + Math.round(TS.VOCAB / (K.COMB_COLS * K.COMB_ROWS)) + ' TOKENS', CB.x0, CB.y1 + 20, { size: FS.small, ls: 1.5, fill: C.dim });
    M.vAllow = tx(M.vocab, '', CB.x1, CB.y1 + 20, { size: FS.mono, fill: C.accent, anchor: 'end', op: 0 });
    M.cols = []; M.litA = []; M.litB = [];
    if (!HAS_P5) {
      const cw = (CB.x1 - CB.x0) / K.COMB_COLS, ch = (CB.y1 - CB.y0) / K.COMB_ROWS;
      for (let c = 0; c < K.COMB_COLS; c++) {
        let d = ''; const x = (CB.x0 + (c + 0.5) * cw).toFixed(2);
        for (let r = 0; r < K.COMB_ROWS; r++) d += 'M' + x + ' ' + (CB.y0 + r * ch + 2).toFixed(2) + 'v' + (ch - 4).toFixed(2);
        M.cols.push(el('path', { d, stroke: C.dim, 'stroke-width': 1.1, opacity: 0 }, M.vocab));
      }
      const pick = (n) => Array.from({ length: n }, () => [Math.floor(rng() * K.COMB_COLS), Math.floor(rng() * K.COMB_ROWS)]);
      const mk = ([c, r]) => el('rect', { x: (CB.x0 + c * cw + cw / 2 - 2).toFixed(2), y: (CB.y0 + r * ch + 1).toFixed(2), width: 4, height: (ch - 2).toFixed(2), fill: C.accent, opacity: 0 }, M.vocab);
      M.litA = pick(TS.ALLOWED_AT_STEP).map(mk); M.litB = pick(1).map(mk);
    } else {
      el('rect', { x: CB.x0, y: CB.y0, width: CB.x1 - CB.x0, height: CB.y1 - CB.y0, fill: 'none', stroke: C.line2, 'stroke-width': 1 }, M.vocab);
    }
    M.sweep = el('line', { x1: CB.x0, y1: CB.y0 - 4, x2: CB.x0, y2: CB.y1 + 4, stroke: C.accent, 'stroke-width': 1.3, opacity: 0 }, M.vocab);
  }
  function u3(t, st) {
    const M = N.m3; if (!gate(groups.s3, t, SC.s3)) return;
    M.head.set(t, T.m3.head);
    const R = TS.renorm(st.constrain), F = G.fan, J = G.J;
    const u = Number.isFinite(+st.u) ? ex.clamp(+st.u, 0, 0.999) : TS.U;
    const pick = TS.sample(R.pp, u), tokS = TS.CANDS[pick].tok;
    const usI = TS.CANDS.findIndex(c => c.tok === 'US'), tookUS = pick === usI && st.constrain;
    const takeC = st.constrain ? C.accent : C.peach;
    // lockup: tokens arrive, accelerating
    setOp(M.lock, ex.prog(t, T.m3.tokens[0] - 0.4, T.m3.tokens[0]));
    const nT = TS.PREFIX_TOKENS.length, tp = ex.prog(t, T.m3.tokens[0], T.m3.tokens[1]);
    const shown = tp <= 0 ? 0 : Math.min(nT, Math.floor(nT * Math.pow(tp, 1 / K.TOK_ACCEL)) + 1);
    M.toks.forEach((s, i) => { s.setAttribute('visibility', i < shown ? 'visible' : 'hidden'); s.setAttribute('fill', i === shown - 1 && tp < 1 ? C.accent : C.ink); });
    if (shown > 0 && tp < 1) { const i = shown - 1; M.curTok.setAttribute('x1', M.tokX[i].toFixed(1)); M.curTok.setAttribute('x2', (i + 1 < nT ? M.tokX[i + 1] : G.lockup.x + M.prefixW).toFixed(1)); setOp(M.curTok, 0.9); } else setOp(M.curTok, 0);
    // what the car has written so far
    const landed = t >= T.m3.take[1] - 0.05, dIn = tookUS && t >= T.m3.ghost[0] + 2.2, closed = st.constrain && t >= T.m3.step2;
    const tail = (landed ? tokS : '') + (dIn ? 'D' : '') + (closed ? '"' : '');
    setText(M.tail, tail); M.tail.setAttribute('fill', takeC);
    setOp(M.tail, landed ? E.glaser(ex.prog(t, T.m3.take[1] - 0.05, T.m3.take[1] + 0.3)) : 0);
    const tailBox = { x: G.lockup.x + M.prefixW - 2, y: G.lockup.y - 13, w: tw(M.tail) + 4, h: 18 };
    stamp(M.stamp, t, T.m3.pulse, landed ? tailBox : null, 8, 0.8);
    M.stamp.setAttribute('stroke', takeC);
    // the state line
    let stS = 'STATE · inside "currency", after the quote';
    if (closed) stS = 'STATE · string closed · next key';
    else if (dIn) stS = 'STATE · after "USD" · quote next';
    else if (landed) stS = st.constrain ? (tookUS ? 'STATE · after "US" · only "D" fits' : 'STATE · after "' + tokS + '" · quote next') : 'STATE · after "' + tokS + '" · off the schema';
    if (M.state.textContent !== stS) { M.state.textContent = stS; M.state.setAttribute('font-size', FS.small); fit(M.state, M.stateW); } M.state.setAttribute('fill', !st.constrain && landed ? C.peach : C.dim);
    setOp(M.state, E.glaser(ex.prog(t, T.m3.state, T.m3.state + 0.5)) * 0.95);
    // the yard, folding away at the vocabulary beat (the p5 yard mirrors this transform)
    const fold = E.collect(ex.prog(t, T.m3.fold[0], T.m3.fold[1]));
    show(M.yard, ex.prog(t, T.m3.tokens[0] - 0.4, T.m3.tokens[0] + 0.2) * (1 - fold));
    M.yard.setAttribute('transform', 'translate(0 ' + (J.y * fold * 0.5).toFixed(2) + ') scale(1 ' + (1 - 0.5 * fold).toFixed(3) + ')');
    M.entry.draw(E.glaser(ex.prog(t, T.m3.tokens[0] - 0.3, T.m3.tokens[0] + 0.5)));
    const ce = E.collect(ex.prog(t, T.m3.car[0], T.m3.car[1]));
    const takeP = E.warmIn(ex.prog(t, T.m3.take[0], T.m3.take[1]));
    let carPos = { x: ex.lerp(G.entry.x0 + 8, J.x - 9, ce), y: J.y, a: 0 };
    const chosen = M.tr[pick], takeEnd = chosen.Pl.len - (G.labels.probX - 14 - (G.queue.x0 - 12));
    if (takeP > 0) { const s = ex.lerp(-9, takeEnd, takeP); carPos = s < 0 ? { x: J.x + s, y: J.y, a: 0 } : at(chosen.Pl, s); }
    // a real US: the car continues to the second junction and takes D
    const gp = ex.prog(t, T.m3.ghost[0], T.m3.ghost[0] + 1.2), gp4 = E.glaser(ex.prog(t, T.m3.ghost[0] + 2.2, T.m3.ghost[1] - 0.4));
    const sJ2 = chosen.Pl.len - (G.labels.probX - 14 - G.ghost.J2.x);
    if (tookUS && gp > 0) carPos = gp4 > 0 ? { x: G.ghost.J2.x + 80 * gp4, y: G.ghost.J2.y, a: 0 } : at(chosen.Pl, ex.lerp(takeEnd, sJ2 - 7, E.glaser(gp)));
    placeCar(M.car, carPos, ex.prog(t, T.m3.car[0] - 0.3, T.m3.car[0]), takeP > 0.98 ? takeC : C.ink);
    // fan, blades, labels, load, numbers
    const ghostOn = st.constrain ? ex.seg(t, T.m3.ghost[0], T.m3.ghost[1], 0.5) : 0;
    let closedIdx = 0;
    M.tr.forEach((r, i) => {
      const fp = E.glaser(ex.prog(t, T.m3.fan[0] + i * 0.08, T.m3.fan[0] + i * 0.08 + 0.8));
      r.appr.draw(Math.min(1, fp * 1.6)); r.beyond.draw(Math.max(0, fp * 1.6 - 0.6));
      const open = R.allow[i];
      let cp = 0;
      if (!open) { const c0 = T.m3.close + closedIdx * T.m3.closeStagger; cp = E.rest(ex.prog(t, c0, c0 + T.m3.closeDur)); closedIdx++; }
      r.blade.set(K.BLADE_SHUT * cp, cp > 0.5 ? C.dim : C.accent, ex.clamp(fp * 3 - 1.5));
      const taken = i === pick ? ex.prog(t, T.m3.take[0], T.m3.take[0] + 0.3) : 0;
      r.beyond.col(taken > 0 ? takeC : (cp > 0.5 ? A('dim', 0.22) : A('dim', 0.55)));
      r.appr.col(taken > 0 ? takeC : (cp > 0.5 ? A('dim', 0.3) : A('dim', 0.55)));
      const lp = E.glaser(ex.prog(t, T.m3.probs[0] + i * 0.1, T.m3.probs[0] + i * 0.1 + 0.5));
      setOp(r.lab, lp * (1 - 0.6 * cp)); tr(r.lab, 0, (1 - lp) * 6);
      r.strike.setAttribute('x2', (G.labels.tokX + 4 + (tw(r.lab) + 4) * cp).toFixed(1)); setOp(r.strike, cp > 0 ? 0.9 : 0);
      const qp = E.glaser(ex.prog(t, T.m3.queue[0] + i * 0.06, T.m3.queue[0] + i * 0.06 + 0.9));
      const rp = st.constrain ? E.glaser(ex.prog(t, T.m3.reseat[0], T.m3.reseat[1])) : 0;
      const v = ex.lerp(R.p[i], R.pp[i], rp) * qp;
      if (r.bar) { r.bar.setAttribute('width', ((G.queue.x1 - G.queue.x0) * v).toFixed(2)); r.bar.setAttribute('fill', open && rp > 0 ? A('accent', 0.4 + 0.45 * rp) : A('ink', cp > 0 ? 0.25 : 0.4)); }
      const np = E.defer(ex.prog(t, T.m3.pprime[0], T.m3.pprime[1]));
      setText(r.prob, np > 0 && st.constrain ? ex.lerp(R.p[i], R.pp[i], np).toFixed(3) : R.p[i].toFixed(2));
      r.prob.setAttribute('fill', open && st.constrain && np > 0.5 ? C.accent : (cp > 0.5 ? C.dim : C.ink));
      setOp(r.prob, lp * (cp > 0.5 ? 0.55 : 1));
      setOp(r.tg, 1 - 0.65 * ghostOn * (i === usI ? 0 : 1));
    });
    // what the bars are
    const masked = st.constrain && t >= T.m3.close + 0.5;
    setText(M.odds, masked ? 'AFTER THE MASK · RENORMALISED' : 'MODEL’S NEXT-TOKEN ODDS, UNMASKED');
    setOp(M.odds, E.glaser(ex.prog(t, T.m3.oddsLabel, T.m3.oddsLabel + 0.5)) * (st.constrain ? 1 - 0.7 * ex.seg(t, T.m3.close, T.m3.close + 1.0, 0.5) : 1) * 0.95);
    // second junction (ghost, or real if the draw took US)
    show(M.ghost, ghostOn);
    if (ghostOn > 0) {
      const J2 = G.ghost.J2, U = M.tr[usI];
      const gp2 = E.glaser(ex.prog(t, T.m3.ghost[0] + 1.0, T.m3.ghost[0] + 1.8)), gp3 = E.rest(ex.prog(t, T.m3.ghost[0] + 1.8, T.m3.ghost[0] + 2.1));
      if (!tookUS) placeCar(M.gCar, gp4 > 0 ? { x: J2.x + 80 * gp4, y: J2.y, a: 0 } : at(U.Pl, ex.lerp(0, sJ2 - 7, E.glaser(gp))), 0.9);
      else show(M.gCar, 0);
      M.gStubs.forEach(s => { s.r.draw(gp2); s.r.op(1 - 0.6 * gp3); });
      M.gOpen.draw(gp2); setOp(M.gLab, gp3);
    }
    // foot
    const fp = E.glaser(ex.prog(t, T.m3.pprime[0], T.m3.foot)) * (1 - ex.prog(t, T.m3.fold[0], T.m3.fold[0] + 0.4));
    const vf = ex.prog(t, T.m3.fold[1] + 0.3, T.m3.fold[1] + 0.8);
    let foot;
    if (vf > 0 && fp <= 0) foot = 'mask precomputed per grammar state — Outlines, XGrammar [S2][S3] · < 40 µs per token';
    else if (!st.constrain) foot = takeP >= 1 ? 'valid JSON · invalid against the schema' : 'no mask · every token may follow · illustrative logits';
    else if (ghostOn > 0.5) foot = tookUS ? 'it took "US": the next junction opens one track, "D" — tokens aren’t letters' : 'had it taken "US", only "D" could follow — tokens aren’t letters';
    else foot = 'allowed mass ' + R.mass.toFixed(2) + ' · p′ = p ÷ ' + R.mass.toFixed(2) + ' · ratios kept · illustrative logits';
    setText(M.foot, foot);
    M.foot.setAttribute('fill', !st.constrain && takeP >= 1 && vf <= 0 ? C.peach : C.dim);
    setOp(M.foot, Math.max(fp, vf) * 0.95);
    // the vocabulary: swept, masked, then the next step
    const vo = ex.prog(t, T.m3.fold[0] + 0.4, T.m3.comb[0] + 0.2);
    show(M.vocab, vo);
    if (vo > 0) {
      const cp = ex.prog(t, T.m3.comb[0], T.m3.comb[1]), sw = E.defer(ex.prog(t, T.m3.sweep[0], T.m3.sweep[1]));
      const CB = G.comb, sx = ex.lerp(CB.x0, CB.x1, sw);
      M.sweep.setAttribute('x1', sx.toFixed(1)); M.sweep.setAttribute('x2', sx.toFixed(1));
      setOp(M.sweep, sw > 0 && sw < 1 ? 0.7 : 0);
      const nc = M.cols.length;
      M.cols.forEach((c, i) => { const xi = CB.x0 + (i + 0.5) * (CB.x1 - CB.x0) / nc; setOp(c, ex.clamp(cp * nc * 1.15 - i) * (xi <= sx ? 0.75 : 0.4)); });
      const step2 = st.constrain && t >= T.m3.step2;
      const lp = E.glaser(ex.prog(t, T.m3.lit, T.m3.lit + 0.5)) * (st.constrain ? 1 : 0);
      M.litA.forEach(r => setOp(r, lp * (step2 ? 0 : 1))); M.litB.forEach(r => setOp(r, step2 ? 1 : 0));
      const n = Math.round(TS.VOCAB * sw), nOpen = R.allow.filter(Boolean).length;
      setText(M.vCount, !st.constrain ? 'no mask · all ' + fmtN(TS.VOCAB) + ' open'
        : fmtN(n) + ' masked · ' + (step2 ? '1 open: "' : nOpen + ' of the top ' + TS.CANDS.length + ' open'));
      setOp(M.vCount, ex.prog(t, T.m3.counter[0] - 0.3, T.m3.counter[0]));
      setText(M.vAllow, step2 ? 'open now: "' : 'open now: ' + TS.CANDS.filter((c, i) => R.allow[i]).map(c => c.tok).join(' · '));
      setOp(M.vAllow, st.constrain ? lp : 0);
    }
  }

  /* ════════════════ M4 · Compounding (56–75) ════════════════ */
  function buildM4() {
    const g = groups.s4, M = N.m4 = {};
    M.head = sceneHead(g, '03 — COMPOUNDING', 'Ninety-five percent, ten times');
    const Mn = G.main, Pn = G.pen;
    M.main = Rails(g, [P(Mn.x0, Mn.y), P(Mn.x1, Mn.y)], A('dim', 0.65));
    M.hRate = tx(g, 'SHAPE PASS', Mn.x0, Mn.y - 66, { size: FS.small, ls: 1.5, fill: C.dim, op: 0 });
    M.j = G.junctions.map((jn, k) => {
      const jg = el('g', { opacity: 0 }, g), sx = jn.x + G.siding.dx;
      // same siding shape as the p5 runs layer: cubic (0,0)(12,5)(dx,26)(dx,58), then straight down
      const pts = cat(cub(P(jn.x, jn.y), P(jn.x + 12, jn.y + 5), P(sx, jn.y + 26), P(sx, jn.y + 58), 20), [P(sx, jn.y + 58), P(sx, G.siding.y)]);
      const rails = Rails(jg, pts, A('dim', 0.45));
      const blade = Blade(jg, jn.x, jn.y, K.BLADE, C.accent);
      const num = tx(jg, String(k + 1), jn.x, jn.y - 16, { size: FS.small, fill: C.dim, anchor: 'middle' });
      const rate = tx(jg, '', jn.x, jn.y - 42, { size: FS.mono, fill: C.dim, anchor: 'middle' });
      const tally = tx(jg, '', sx - 7, G.siding.y - 2, { size: FS.small, fill: C.dim, anchor: 'end' });
      return { jg, rails, blade, num, rate, tally, Pl: poly(pts), x: jn.x };
    });
    // the pen: survivors collect on the line's end
    M.pen = el('g', { opacity: 0 }, g);
    el('rect', { x: Pn.x0, y: Pn.y0, width: Pn.x1 - Pn.x0, height: Pn.y1 - Pn.y0, rx: 2, fill: 'none', stroke: A('dim', 0.6), 'stroke-width': 1.1 }, M.pen);
    el('line', { x1: Mn.x1, y1: Mn.y, x2: Pn.x0, y2: Mn.y, stroke: A('dim', 0.6), 'stroke-width': K.RAIL_W }, M.pen);
    tx(M.pen, 'ARRIVED', (Pn.x0 + Pn.x1) / 2, Pn.y0 - 10, { size: FS.small, ls: 1.5, fill: C.dim, anchor: 'middle' });
    M.penN = tx(M.pen, '', (Pn.x0 + Pn.x1) / 2, Pn.y1 + 20, { size: FS.mono, fill: C.accent, anchor: 'middle' });
    M.cars = []; M.cars2 = []; M.perm = [];
    if (!HAS_P5) {
      const perm = Array.from({ length: K.REP }, (_, i) => i);
      for (let i = perm.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [perm[i], perm[j]] = [perm[j], perm[i]]; }
      M.perm = perm;
      for (let j = 0; j < K.REP; j++) { M.cars.push(Car(g, C.ink)); M.cars2.push(Car(g, C.ink)); }
    }
    // counter: bottom-left of the figure (TS.G.counter), 40 mono
    M.cg = el('g', { opacity: 0 }, g);
    M.cNum = tx(M.cg, '', G.counter.x, G.counter.y, { size: FS.counter, fill: C.accent, anchor: G.counter.anchor, weight: 700 });
    M.cLab = tx(M.cg, '', G.counter.x, G.counter.y + 24, { size: FS.small, ls: 1.5, fill: C.dim });
    M.cUnder = el('line', { x1: G.counter.x, y1: G.counter.y + 8, x2: G.counter.x, y2: G.counter.y + 8, stroke: C.accent, 'stroke-width': 1.6, opacity: 0 }, g);
    M.foot1 = footLine(g, G.counter.y, 'end', Mn.x1 + 50); M.foot2 = footLine(g, G.counter.y + 24, 'end', Mn.x1 + 50);
  }
  function penSlot(i) { const Pn = G.pen, cols = 4, pw = (Pn.x1 - Pn.x0) / cols; return { x: Pn.x0 + pw * (i % cols + 0.5), y: Pn.y1 - 7 - Math.floor(i / cols) * 8, a: 0 }; }
  function u4(t, st) {
    const M = N.m4; if (!gate(groups.s4, t, SC.s4)) return;
    M.head.set(t, T.m4.head);
    const Mn = G.main, rate = st.stepRate, steps = Math.round(st.steps);
    const Ar = TS.arrivals(rate, steps), RA = TS.runsArrived(t, st);
    const v = (Mn.x1 - Mn.x0) / T.m4.travel, rel = T.m4.release;
    M.main.draw(E.glaser(ex.prog(t, T.m4.line[0], T.m4.line[1])));
    setOp(M.hRate, ex.prog(t, T.m4.line[0] + 0.3, T.m4.line[0] + 0.8) * 0.9);
    rise(M.pen, t, T.m4.line[1] - 0.3, 0.6, 10);
    const typed = E.rest(ex.prog(t, T.m4.typed, T.m4.typed + 0.6));
    const front = Mn.x0 + (t - rel[0]) * v;
    M.j.forEach((J, k) => {
      const live = k < steps;
      const jp = E.glaser(ex.prog(t, T.m4.line[0] + 0.25 + k * 0.08, T.m4.line[0] + 0.85 + k * 0.08));
      show(J.jg, jp * (live ? 1 : 0.28)); J.rails.draw(jp);
      const bt = E.rest(ex.prog(t, T.m4.typed + k * 0.06, T.m4.typed + 0.3 + k * 0.06));
      J.blade.set(K.SIDING_OPEN * (1 - bt), bt > 0.5 ? C.sage : C.accent, 1);
      setText(J.rate, bt > 0.5 ? '1.00' : (live ? rateStr(rate) : '1'));
      J.rate.setAttribute('fill', bt > 0.5 ? C.sage : (front >= J.x && t < T.m4.typed ? C.accent : C.dim));
      J.rails.col(A('dim', 0.45 * (1 - 0.5 * typed)));
      const der = live ? Ar[k] - Ar[k + 1] : 0, dk = (J.x - Mn.x0) / v, n = Math.round(der * ex.prog(t, rel[0] + dk, rel[1] + dk));
      setText(J.tally, n > 0 ? '−' + fmtN(n) : '');
      setOp(J.tally, 1 - 0.5 * typed);   // the staircase stays as a ghost for comparison
    });
    if (!HAS_P5) {
      const slots = new Array(11).fill(0); let penI = 0;
      M.cars.forEach((c, j) => {
        const rank = (M.perm[j] + 0.5) * TS.RUNS / K.REP;
        let dk = 0; for (let k = 1; k <= 10; k++) if (rank >= Ar[k]) { dk = k; break; }
        const r0 = rel[0] + j * (rel[1] - rel[0]) / (K.REP - 1), s = (t - r0) * v;
        const myPen = dk ? -1 : penI++;
        if (dk) { const slot = slots[dk]++; if (s <= 0) { show(c, 0); return; }
          const J = M.j[dk - 1], sj = J.x - Mn.x0, park = J.Pl.len - 5 - slot * (K.CAR_W + 3);
          const pos = s < sj ? { x: Mn.x0 + s, y: Mn.y, a: 0 } : at(J.Pl, Math.min(s - sj, park));
          placeCar(c, pos, 1 - 0.65 * typed, s - sj > 8 ? C.dim : C.ink); return; }
        if (s <= 0) { show(c, 0); return; }
        const L = Mn.x1 - Mn.x0;
        const pos = s < L ? { x: Mn.x0 + s, y: Mn.y, a: 0 } : (() => { const q = E.glaser(ex.clamp((s - L) / 40)), ps = penSlot(myPen); return { x: ex.lerp(Mn.x1, ps.x, q), y: ex.lerp(Mn.y, ps.y, q), a: 0 }; })();
        placeCar(c, pos, 1 - typed, C.ink);
      });
      const r2 = T.m4.release2, v2 = (Mn.x1 - Mn.x0) / T.m4.travel2;
      M.cars2.forEach((c, j) => {
        const r0 = r2[0] + j * (r2[1] - r2[0]) / (K.REP - 1), s = (t - r0) * v2, L = Mn.x1 - Mn.x0;
        if (s <= 0) { show(c, 0); return; }
        const pos = s < L ? { x: Mn.x0 + s, y: Mn.y, a: 0 } : (() => { const q = E.glaser(ex.clamp((s - L) / 60)), ps = penSlot(j); return { x: ex.lerp(Mn.x1, ps.x, q), y: ex.lerp(Mn.y, ps.y, q), a: 0 }; })();
        placeCar(c, pos, 1, C.ink);
      });
    }
    // the canonical counter (TS.runsArrived — the p5 pen reads the same function)
    const pass2 = RA.pass === 2;
    show(M.cg, ex.prog(t, T.m4.counter[0] - 0.4, T.m4.counter[0]));
    setText(M.cNum, fmtN(RA.arrived) + ' / ' + fmtN(RA.of));
    M.cNum.setAttribute('fill', pass2 ? C.sage : C.accent);
    const pct = (100 * RA.arrived / RA.of).toFixed(1) + ' %';
    setText(M.cLab, pass2 ? 'WELL-FORMED · ' + pct + ' · WAS ' + fmtN(RA.survivors) : 'MAKE IT THROUGH · ' + pct);
    setText(M.penN, fmtN(RA.arrived)); M.penN.setAttribute('fill', pass2 ? C.sage : C.accent);
    // payoff: the last free run lands → a copper rule draws under the number
    const land = rel[1] + T.m4.travel, up = E.glaser(ex.prog(t, land, land + 0.6)) * (1 - ex.prog(t, T.m4.typed - 0.3, T.m4.typed));
    M.cUnder.setAttribute('x2', (G.counter.x + tw(M.cNum) * up).toFixed(1)); setOp(M.cUnder, up > 0 ? 1 : 0);
    const f1 = rateStr(rate) + sup(steps) + ' = ' + TS.pow(rate, steps).toFixed(3) + '  ·  0.99' + sup(10) + ' = ' + TS.pow(0.99, 10).toFixed(3) + '  ·  0.999' + sup(10) + ' = ' + TS.pow(0.999, 10).toFixed(3);
    setText(M.foot1, f1); setOp(M.foot1, ex.prog(t, rel[1], rel[1] + 0.6) * 0.95);
    setText(M.foot2, 'OpenAI’s own eval, two models: < 40 % → 100 % [S1]');
    setOp(M.foot2, ex.prog(t, T.m4.typed + 0.4, T.m4.typed + 1.0) * 0.95);
  }

  /* ════════════════ M5 · Enforcement (75–96) ════════════════ */
  function buildM5() {
    const g = groups.s5, M = N.m5 = {};
    M.head = sceneHead(g, '04 — ENFORCEMENT', 'Hope, check, or constrain');
    const Ln = G.lanes;
    M.lanesG = el('g', null, g);
    const names = [['Hope', 'ask, then parse'], ['Check & retry', 'validate, retry'], ['Constrain', 'mask as it writes']];
    M.lanes = Ln.ys.map((y, i) => {
      const lg = el('g', { opacity: 0 }, M.lanesG);
      tx(lg, names[i][0], Ln.labelX, y + 2, { size: 22, cls: 's', fill: C.ink });
      fit(tx(lg, names[i][1], Ln.labelX, y + 26, { size: FS.small, fill: C.dim }), Ln.x0 - Ln.labelX - 16);
      return { lg, rails: Rails(lg, [P(Ln.x0, y), P(Ln.x1, y)], A('dim', 0.6)), car: Car(lg, C.ink), y };
    });
    M.ticks = [];
    for (let x = Ln.x0 + 30; x < Ln.x1 - 10; x += 30) M.ticks.push({ x, e: el('line', { x1: x, y1: Ln.ys[2] - 7, x2: x, y2: Ln.ys[2] + 7, stroke: A('dim', 0.5), 'stroke-width': 1.1 }, M.lanes[2].lg) });
    const y2 = Ln.ys[1], sx = Ln.shedX;
    M.shed = el('rect', { x: sx - Ln.shedW / 2, y: y2 - Ln.shedH / 2, width: Ln.shedW, height: Ln.shedH, rx: 2, fill: C.ground, stroke: C.dim, 'stroke-width': 1.2 }, M.lanes[1].lg);
    el('line', { x1: sx - Ln.shedW / 2, y1: y2, x2: sx + Ln.shedW / 2, y2: y2, stroke: A('dim', 0.35), 'stroke-width': 1 }, M.lanes[1].lg);
    tx(M.lanes[1].lg, 'validate', sx, y2 - Ln.shedH / 2 - 8, { size: FS.small, fill: C.dim, anchor: 'middle' });
    M.note = tx(M.lanes[1].lg, '3 errors: amount · currency · due', sx, y2 + 36, { size: FS.mono, fill: C.peach, anchor: 'middle', op: 0 });
    M.att = tx(M.lanes[1].lg, 'attempt 2', Ln.x0, y2 - 14, { size: FS.small, fill: C.dim, op: 0 });
    const rx = Ln.x1 + 22, rr = 10;
    M.res = [
      { mark: Cross(M.lanes[0].lg, rx, Ln.ys[0], rr, C.peach), text: tx(M.lanes[0].lg, 'JSON.parse: unexpected token S', Ln.x1, Ln.ys[0] + 32, { size: FS.mono, fill: C.peach, anchor: 'end' }), at: T.m5.fail1 },
      { mark: Check(M.lanes[1].lg, rx, Ln.ys[1], rr, C.sage), text: tx(M.lanes[1].lg, 'passes on attempt 2', Ln.x1, Ln.ys[1] + 32, { size: FS.mono, fill: C.sage, anchor: 'end' }), at: T.m5.ok2 },
      { mark: Check(M.lanes[2].lg, rx, Ln.ys[2], rr, C.sage), text: tx(M.lanes[2].lg, 'first try · schema compiled once, cached 24 h [S6]', Ln.x1, Ln.ys[2] + 32, { size: FS.mono, fill: C.sage, anchor: 'end' }), at: T.m5.ok3 },
    ];
    M.res.forEach(r => { setOp(r.mark, 0); setOp(r.text, 0); fit(r.text, Ln.x1 - Ln.x0); });
    M.calls = [['1 call', C.dim], ['2 calls', C.dim], ['1 call', C.sage]].map((c, i) => tx(M.lanes[i].lg, c[0], Ln.x1, Ln.ys[i] - 14, { size: FS.small, fill: c[1], anchor: 'end', op: 0 }));
    M.ring3 = Ring(M.lanesG, C.sage);
    M.foot1 = footLine(M.lanesG, G.foot.y - 18); M.foot2 = footLine(M.lanesG, G.foot.y);
    M.foot1.textContent = 'Instructor · PydanticAI · TypeChat retry with the error [S9][S10][S12]';
    M.foot2.textContent = 'strict: true — OpenAI, Anthropic [S5][S6]';
    // composition: typed row (in → out types, couplers) and untyped row
    M.comp = el('g', { opacity: 0 }, g);
    const B = G.blocks;
    M.rows = [{ y: B[0].y, typed: true }, { y: G.untypedY, typed: false }].map(row => {
      const rg = el('g', { opacity: 0 }, M.comp);
      tx(rg, row.typed ? 'TYPED' : 'UNTYPED', B[0].x, row.y - 14, { size: FS.small, ls: 2, fill: C.dim });
      const ax = row.y + B[0].h + 14;   // the line runs under the cards
      const rails = Rails(rg, [P(B[0].x, ax), P(B[2].x + B[2].w, ax)], A('dim', 0.5));
      const blocks = B.map((b, i) => {
        const bg = el('g', null, rg);
        const rect = el('rect', { x: b.x, y: row.y, width: b.w, height: b.h, rx: 4, fill: C.panel, stroke: C.line, 'stroke-width': 1.1 }, bg);
        const sig = row.typed ? (b.tool ? b.id + '(' + b.in + ')' : b.in + ' → ' + b.out) : (b.tool ? b.id + '(invoice)' : b.id + '(dict) → dict');
        tx(bg, b.id, b.x + 14, row.y + 24, { size: FS.mono, fill: C.ink, weight: 700 });
        fit(tx(bg, sig, b.x + 14, row.y + 46, { size: FS.small, fill: C.dim }), b.w - 28);
        // a short drop from each card onto the line: the step sits on the track
        el('line', { x1: b.x + b.w / 2, y1: row.y + b.h, x2: b.x + b.w / 2, y2: ax - G.gauge, stroke: A('dim', 0.4), 'stroke-width': 1 }, bg);
        return { rect, b };
      });
      if (row.typed) tx(rg, 'TOOL', B[2].x + B[2].w, row.y - 14, { size: FS.small, ls: 2, fill: C.slate, anchor: 'end' });
      const cps = [];
      for (let i = 0; i < 2; i++) {
        const x0 = B[i].x + B[i].w, x1 = B[i + 1].x;
        if (row.typed) {
          const cg = el('g', { opacity: 0 }, rg);
          const cr = Rails(cg, [P(x0, ax), P(x1, ax)], C.sage);
          const lab = tx(cg, B[i].out, (x0 + x1) / 2, ax + 20, { size: FS.small, fill: C.sage, anchor: 'middle' });
          cps.push({ cg, cr, lab, x0, x1 });
        }
      }
      const car = Car(rg, C.ink);
      const chip = tx(rg, '', B[0].x, ax + (row.typed ? 40 : 30), { size: FS.mono, fill: C.ink, op: 0 });
      return Object.assign(row, { rg, ax, rails, blocks, cps, car, chip });
    });
    M.rows[0].stop = tx(M.rows[0].rg, '', B[0].x, M.rows[0].ax + 40, { size: FS.mono, fill: C.peach, op: 0 });
    const mk = (row, i, F, col) => { const b = B[i]; const m = F(row.rg, b.x + b.w - 18, row.y + 20, 9, col); setOp(m, 0); return m; };
    M.payMark = mk(M.rows[0], 2, Check, C.sage);
    M.uFail = [1, 2].map(i => mk(M.rows[1], i, Cross, C.peach));      // approve, pay
    M.coupMark = Cross(M.rows[0].rg, (B[0].x + B[0].w + B[1].x) / 2, M.rows[0].ax - 16, 8, C.peach); setOp(M.coupMark, 0);
    M.payRing = Ring(M.comp, C.sage);
  }
  function u5(t, st) {
    const M = N.m5; if (!gate(groups.s5, t, SC.s5)) return;
    M.head.set(t, T.m5.head);
    const Ln = G.lanes, out = E.collect(ex.prog(t, T.m5.lanesOut[0], T.m5.lanesOut[1]));
    show(M.lanesG, 1 - out); tr(M.lanesG, 0, -10 * out);
    if (out < 1) {
      M.lanes.forEach((L, i) => { rise(L.lg, t, T.m5.lanes[0] + i * 0.25, 0.6, 14); L.rails.draw(E.glaser(ex.prog(t, T.m5.lanes[0] + i * 0.25, T.m5.lanes[0] + i * 0.25 + 0.8))); });
      const X = (p) => ex.lerp(Ln.x0 + 8, Ln.x1 - 8, p);
      const p1 = E.rest(ex.prog(t, T.m5.lane1[0], T.m5.lane1[1]));
      placeCar(M.lanes[0].car, { x: X(p1), y: Ln.ys[0], a: 0 }, ex.prog(t, T.m5.lane1[0] - 0.3, T.m5.lane1[0]), t >= T.m5.fail1 ? C.peach : C.ink);
      const shedP = (Ln.shedX - Ln.x0 - 8) / (Ln.x1 - Ln.x0 - 16);
      let p2;
      if (t < T.m5.loop[0]) p2 = shedP * E.rest(ex.prog(t, T.m5.lane2[0], T.m5.lane2[1]));
      else if (t < T.m5.lane2b[0]) p2 = shedP * (1 - E.rest(ex.prog(t, T.m5.loop[0], T.m5.loop[1])));
      else p2 = E.rest(ex.prog(t, T.m5.lane2b[0], T.m5.lane2b[1]));
      const inShed = Math.abs(X(p2) - Ln.shedX) < Ln.shedW / 2;
      placeCar(M.lanes[1].car, { x: X(p2), y: Ln.ys[1], a: 0 }, ex.prog(t, T.m5.lane2[0] - 0.3, T.m5.lane2[0]), t >= T.m5.ok2 ? C.sage : (t >= T.m5.note[0] && t < T.m5.lane2b[0] ? C.peach : C.ink));
      M.shed.setAttribute('stroke', inShed && t > T.m5.note[0] && t < T.m5.loop[0] ? C.peach : (inShed && t > T.m5.lane2b[0] ? C.sage : C.dim));
      setOp(M.note, ex.prog(t, T.m5.note[0], T.m5.note[0] + 0.4) * (1 - ex.prog(t, T.m5.ok2 - 0.4, T.m5.ok2)));
      setOp(M.att, ex.prog(t, T.m5.loop[1] - 0.3, T.m5.loop[1]) * (1 - ex.prog(t, T.m5.ok2, T.m5.ok2 + 0.5)) * 0.9);
      const p3 = E.rest(ex.prog(t, T.m5.lane3[0], T.m5.lane3[1])), x3 = X(p3);
      placeCar(M.lanes[2].car, { x: x3, y: Ln.ys[2], a: 0 }, ex.prog(t, T.m5.lane3[0] - 0.3, T.m5.lane3[0]), t >= T.m5.ok3 ? C.sage : C.ink);
      M.ticks.forEach(k => k.e.setAttribute('stroke', t >= T.m5.lane3[0] && x3 >= k.x - 2 ? C.sage : A('dim', 0.5)));
      M.res.forEach(r => { const p = E.glaser(ex.prog(t, r.at, r.at + 0.4)); setOp(r.mark, p); setOp(r.text, p); });
      ring(M.ring3, t, [T.m5.ok3, T.m5.ok3 + 0.8], Ln.x1 + 22, Ln.ys[2], 11, 19, 0.6);
      M.calls.forEach((c, i) => rise(c, t, T.m5.ok2 + 1.0 + i * 0.3, 0.5, 8));
      setOp(M.foot1, ex.prog(t, T.m5.note[0], T.m5.note[0] + 0.5) * 0.95);
      setOp(M.foot2, ex.prog(t, T.m5.ok3, T.m5.ok3 + 0.5) * 0.95);
    }
    const co = ex.prog(t, T.m5.blocks[0] - 0.2, T.m5.blocks[0] + 0.2); show(M.comp, co);
    if (co <= 0) return;
    const B = G.blocks, bad = st.inject !== 'ok', missDue = st.inject === 'missing due';
    M.rows.forEach((row, ri) => {
      rise(row.rg, t, T.m5.blocks[0] + ri * 0.3, 0.7, 16);
      row.rails.draw(E.glaser(ex.prog(t, T.m5.blocks[0] + ri * 0.3, T.m5.blocks[1] + ri * 0.3)));
      row.cps.forEach((c, i) => { const p = E.glaser(ex.prog(t, T.m5.couplers + i * 0.2, T.m5.couplers + i * 0.2 + 0.45)); setOp(c.cg, p); tr(c.cg, 0, (1 - p) * -10); c.cr.draw(1); });
    });
    // typed row: a value that breaks Invoice stops at the first coupler
    const R0 = M.rows[0], R1 = M.rows[1];
    const runX0 = B[0].x + 14, payX = B[2].x + B[2].w / 2, stopAt = B[0].x + B[0].w - 8;
    const tp = E.rest(ex.prog(t, T.m5.typedRun[0], T.m5.typedRun[1]));
    let tx0 = ex.lerp(runX0, payX, tp); const stopped = bad && tx0 >= stopAt; if (stopped) tx0 = stopAt;
    placeCar(R0.car, { x: tx0, y: R0.ax, a: 0 }, ex.prog(t, T.m5.typedRun[0] - 0.3, T.m5.typedRun[0]), stopped ? C.peach : (t >= T.m5.pay && !bad ? C.sage : C.ink));
    setText(R0.chip, st.inject === 'string amount' ? '"amount": "$1,200.00"' : (missDue ? 'due: (missing)' : 'amount: 1200.00'));
    R0.chip.setAttribute('x', Math.min(tx0 - 6, B[2].x + B[2].w - tw(R0.chip)).toFixed(1));
    R0.chip.setAttribute('fill', bad ? C.peach : C.ink);
    setOp(R0.chip, ex.prog(t, T.m5.typedRun[0] - 0.3, T.m5.typedRun[0]) * (stopped ? 0 : 0.95));
    R0.cps.forEach((c, i) => { const hit = stopped && i === 0; c.cr.col(hit ? C.peach : C.sage); c.lab.setAttribute('fill', hit ? C.peach : C.sage); });
    setText(R0.stop, 'stopped at the joint: ' + (missDue ? 'Invoice needs a due date' : 'Invoice.amount must be a number'));
    setOp(R0.stop, stopped ? 1 : 0); setOp(M.coupMark, stopped ? 1 : 0);
    const payP = bad ? 0 : E.glaser(ex.prog(t, T.m5.pay, T.m5.pay + 0.4));
    R0.blocks[2].rect.setAttribute('stroke', payP > 0.5 ? C.sage : C.slate);
    setOp(M.payMark, payP);
    ring(M.payRing, t, bad ? [-2, -1] : T.m5.ring, B[2].x + B[2].w - 18, R0.y + 20, 10, 18, 0.6);
    // untyped row: the value sails on until the first step that uses it — approve (due) or pay (amount)
    const failI = missDue ? 1 : 2, failX = B[failI].x + B[failI].w / 2;
    const up = E.rest(ex.prog(t, T.m5.untypedRun[0], T.m5.untypedRun[1]));
    const ux = ex.lerp(runX0, failX, up), failed = t >= T.m5.untypedFail;
    placeCar(R1.car, { x: ux, y: R1.ax, a: 0 }, ex.prog(t, T.m5.untypedRun[0] - 0.3, T.m5.untypedRun[0]), failed ? C.peach : C.ink);
    const uChip = missDue ? '"due": undefined' : '"amount": "$1,200.00"';
    const uFail = missDue ? '  →  approve: new Date(undefined) is Invalid Date' : '  →  pay: amount × 1.16 = NaN';
    setText(R1.chip, uChip + (failed ? uFail : ''));
    R1.chip.setAttribute('x', failed ? B[0].x : Math.min(ux - 6, B[2].x + B[2].w - tw(R1.chip)).toFixed(1));
    R1.chip.setAttribute('fill', failed ? C.peach : C.ink);
    setOp(R1.chip, ex.prog(t, T.m5.untypedRun[0] - 0.3, T.m5.untypedRun[0]) * 0.95);
    R1.blocks.forEach((b, i) => b.rect.setAttribute('stroke', failed && i === failI ? C.peach : (B[i].tool ? C.slate : C.line)));
    M.uFail.forEach((m, k) => setOp(m, (k + 1 === failI) ? E.glaser(ex.prog(t, T.m5.untypedFail, T.m5.untypedFail + 0.4)) : 0));
  }

  /* ════════════════ M6 · The limits (96–110) ════════════════
     Well-typed and wrong: the model writes due "2026-11-05"; the input said the 15th. */
  function buildM6() {
    const g = groups.s6, M = N.m6 = {};
    M.head = sceneHead(g, '05 — THE LIMITS', 'Shape, not truth');
    const S = G.strip, x0 = G.cards.left.x, xR = G.cards.right.x + G.cards.right.w;
    M.strip = el('g', { opacity: 0 }, g);
    const rec = tx(M.strip, '', x0, S.y, { size: FS.mono, fill: C.ink });
    const pre = '{ customer: "Marisol Ortega", amount: 1200.00, currency: "USD", ' + TS.WRONG.field + ': ';
    tspan(rec, pre); M.recV = tspan(rec, TS.WRONG.written, { fill: C.ink }); tspan(rec, ' }');
    fit(rec, xR - x0);
    const ax = x0 + sub(rec, 0, pre.length), aw = sub(rec, pre.length, TS.WRONG.written.length);
    M.under = el('line', { x1: ax, y1: S.y + 6, x2: ax, y2: S.y + 6, stroke: C.peach, 'stroke-width': 1.4, opacity: 0 }, M.strip);
    M.ax = ax; M.aw = aw;
    M.typeOk = el('g', { opacity: 0 }, M.strip);
    Check(M.typeOk, x0 + 9, S.y + 27, 8, C.sage);
    tx(M.typeOk, 'type check passes', x0 + 26, S.y + 32, { size: FS.mono, fill: C.sage });
    M.manif = el('g', { opacity: 0 }, M.strip);
    const mt = tx(M.manif, 'source: "' + TS.WRONG.source + '"', xR, S.y + 32, { size: FS.mono, fill: C.peach, anchor: 'end' });
    Cross(M.manif, xR - tw(mt) - 16, S.y + 27, 8, C.peach);
    const MO = G.moire;
    M.moLab = el('g', { opacity: 0 }, g);
    const ml = tx(M.moLab, 'two gauges, 1 % apart · not every keyword is enforced the same way', MO.x1, (MO.y0 + MO.y1) / 2 + 4.5, { size: FS.small, fill: C.dim, anchor: 'end' });
    fit(ml, (MO.x1 - MO.x0) * 0.62);
    const mw = tw(ml);
    M.moLab.insertBefore(el('rect', { x: MO.x1 - mw - 8, y: MO.y0 + 2, width: mw + 8, height: MO.y1 - MO.y0 - 4, fill: C.ground }), ml);
    // the paired cards: five rows each, aligned across both, equal weight
    const CD = G.cards;
    const items = {
      L: [['Valid by construction', 'no parse errors'],
          ['No retries for shape', 'the mask works while it writes'],
          ['Mismatches caught at the joint', ''],
          ['Tool arguments typed too [S5][S6]', ''],
          ['Cheap: < 40 µs per token [S3]', '']],
      R: [['Valid ≠ true', 'the 5th passes; the input said the 15th'],
          ['A bad schema can crowd out reasoning', 'GSM8K 86.5 → 23.4 % (Claude 3 Haiku, prompted JSON mode) [S4] · reasoning-first schema: 77 → 78 % [S19]'],
          ['minimum, maxLength… not enforced [S6]', ''],
          ['It can’t see the schema unless shown [S8]', ''],
          ['Refusals, max_tokens: keep an error branch [S1][S6]', '']],
    };
    const tx0 = 46, tw0 = CD.left.w - tx0 - 14;
    // measure the right card's details first: rows are as tall as the taller side
    const probe = tx(g, '', 0, -100, { size: FS.small });
    const lines = (s) => { if (!s) return []; const w = s.split(' '), out = []; let cur = ''; for (const x of w) { const c = cur ? cur + ' ' + x : x; probe.textContent = c; if (tw(probe) > tw0 && cur) { out.push(cur); cur = x; } else cur = c; } if (cur) out.push(cur); return out; };
    const detL = items.L.map(it => lines(it[1])), detR = items.R.map(it => lines(it[1]));
    probe.remove();
    const LH = 15, HEAD = 19, GAP = 9;
    const rowY = []; let y = CD.y + 54;
    for (let i = 0; i < 5; i++) { rowY.push(y); y += HEAD + Math.max(detL[i].length, detR[i].length) * LH + GAP; }
    const card = (side, x, w, title, col, list, det) => {
      const grp = el('g', { opacity: 0 }, g);
      const rect = el('rect', { x, y: CD.y, width: w, height: CD.h, rx: 8, fill: C.panel, stroke: C.line, 'stroke-width': 1 }, grp);
      tx(grp, title, x + 22, CD.y + 30, { size: FS.small, ls: 2, fill: col, weight: 700 });
      const its = list.map((it, i) => {
        const yy = rowY[i], ig = el('g', { opacity: 0 }, grp);
        if (side === 'L') Check(ig, x + 26, yy - 6, 8, col); else Warn(ig, x + 26, yy, col);
        fit(tx(ig, it[0], x + tx0, yy, { size: FS.sans - 1, cls: 's', fill: C.ink }), tw0);
        det[i].forEach((l, k) => tx(ig, l, x + tx0, yy + HEAD - 2 + k * LH, { size: FS.small, fill: C.dim }));
        return { ig };
      });
      return { grp, rect, its, col };
    };
    M.cL = card('L', CD.left.x, CD.left.w, 'WHAT A TYPE GIVES YOU', C.sage, items.L, detL);
    M.cR = card('R', CD.right.x, CD.right.w, 'WHAT IT CANNOT PROMISE', C.peach, items.R, detR);
    M.cardOverflow = y - GAP - (CD.y + CD.h);   // checked in the stills; must be ≤ 0
  }
  function u6(t) {
    const M = N.m6; if (!gate(groups.s6, t, SC.s6)) return;
    M.head.set(t, T.m6.head);
    rise(M.strip, t, T.m6.strip[0], T.m6.strip[1] - T.m6.strip[0], 12);
    setOp(M.typeOk, E.glaser(ex.prog(t, T.m6.strip[1] - 0.6, T.m6.strip[1] - 0.1)));
    const mp = E.glaser(ex.prog(t, T.m6.manifest + 0.3, T.m6.manifest + 0.8));
    M.recV.setAttribute('fill', mp > 0.5 ? C.peach : C.ink);
    M.under.setAttribute('x2', (M.ax + M.aw * mp).toFixed(1)); setOp(M.under, mp);
    setOp(M.manif, mp); tr(M.manif, (1 - mp) * 12, 0);
    const slide = (c, t0, dir) => { const p = E.glaser(ex.prog(t, t0, t0 + 0.8)); show(c.grp, p); tr(c.grp, (1 - p) * 40 * dir, 0); };
    slide(M.cL, T.m6.cardL, -1); slide(M.cR, T.m6.cardR, 1);
    // rows 1–3 alternate L/R; rows 4–5 land just before the payoff, filling the honesty beat
    [M.cL, M.cR].forEach((c, side) => c.its.forEach((it, i) => {
      const t0 = i < 3 ? T.m6.items + (2 * i + side) * T.m6.itemStagger : T.m6.filled - 2.2 + (2 * (i - 3) + side) * T.m6.itemStagger;
      rise(it.ig, t, t0, 0.5, 12);
    }));
    setOp(M.moLab, ex.seg(t, T.m6.items + 0.9, T.m6.filled, 0.4) * 0.95);   // ≈ 101.5–106, while the p5 moiré runs
    const fp = E.glaser(ex.prog(t, T.m6.filled - 0.3, T.m6.filled + 0.5));
    M.cL.rect.setAttribute('stroke', fp > 0 ? A('sage', 0.25 + 0.5 * fp) : C.line);
    M.cR.rect.setAttribute('stroke', fp > 0 ? A('peach', 0.25 + 0.5 * fp) : C.line);
  }

  /* ════════════════ M7 · Land (110–120) ════════════════ */
  function buildM7() {
    const g = groups.s7, M = N.m7 = {};
    // the streaks of the TF7 whale reach up to ≈ y 274: the landing type sits above them
    const top = TS.tf(G.TF7, { x: 0, y: 78 }).y;
    M.setup = tx(g, 'A type is a promise the model can’t break.', G.head.cx, top - 140, { size: 22, cls: 's', fill: C.dim, anchor: 'middle', op: 0 });
    M.l1 = el('g', { opacity: 0 }, g); tx(M.l1, 'Types don’t make it right.', G.head.cx, top - 80, { size: FS.title, cls: 'd', anchor: 'middle' });
    M.l2 = el('g', { opacity: 0 }, g); const e = tx(M.l2, 'They make it ', G.head.cx, top - 20, { size: FS.title, cls: 'd', anchor: 'middle' }); tspan(e, 'checkable', { fill: C.accent }); tspan(e, '.', {});
    M.end = tx(g, 'CETI.AI  ·  cetiai.co', G.head.cx, G.foot.y - 4, { size: FS.mono, ls: 2.5, fill: C.dim, anchor: 'middle', op: 0 });
  }
  function u7(t) {
    const M = N.m7; if (!gate(groups.s7, t, SC.s7)) return;
    const ps = E.glaser(ex.prog(t, T.m7.setup, T.m7.setup + 0.7)); setOp(M.setup, ps * 0.95); tr(M.setup, 0, (1 - ps) * 12);
    const q = (n, a, b) => { const p = E.glaser(ex.prog(t, a, b)); setOp(n, p); n.setAttribute('transform', 'translate(480 0) scale(' + (0.965 + 0.035 * p).toFixed(4) + ') translate(-480 0) translate(0 ' + ((1 - p) * 14).toFixed(2) + ')'); };
    q(M.l1, T.m7.line[0], T.m7.line[1]); q(M.l2, T.m7.line[0] + 0.55, T.m7.line[1] + 0.55);
    setOp(M.end, ex.prog(t, T.m7.end, T.m7.end + 0.6) * 0.9);
  }

  /* ════════════════ RENDER ════════════════ */
  function render(t, ctx) {
    ex = ctx.ex; E = ex.ease; RM = !!ctx.rm;
    const st = ctx.state;
    uWhale(t); u1(t); u2(t); u3(t, st); u4(t, st); u5(t, st); u6(t); u7(t);
  }

  /* ════════════════ MODULE ════════════════ */
  const pct = (v) => (v * 100).toFixed(1) + ' %';
  return {
    meta: {
      id: 'typesafe', title: 'Type-safe AI', titleHTML: 'Type-safe <em>AI</em>', eyebrow: 'CETI Explainers · two minutes',
      lede: 'A schema is a promise about the <em>shape</em> of an answer. Two minutes on how a model is made to keep it — token by token — and what it still can’t promise.',
      synthTitle: 'Types make it <em>checkable</em>',
      synthesis: 'Constrained decoding compiles the schema into a grammar and closes every track that can’t fit, so the reply is well-formed by construction; retries get there later, hope gets there sometimes. Across a chain of steps the difference compounds — 95 % ten times is about 60 %. Typed steps snap together and stop a mismatch at the joint. But a type checks shape, not facts: a due date of the 5th is a valid date even when the invoice said the 15th. Declare types at every boundary, show the model the schema, put the reasoning before the answer, keep an error branch, and still check the values that matter.',
      sources: [
        ['S1', 'OpenAI — Introducing Structured Outputs in the API (6 Aug 2024)', 'https://openai.com/index/introducing-structured-outputs-in-the-api/'],
        ['S2', 'Willard & Louf — Efficient Guided Generation for Large Language Models (2023)', 'https://arxiv.org/abs/2307.09702'],
        ['S3', 'Dong et al. — XGrammar: Flexible and Efficient Structured Generation Engine for LLMs (MLSys ’25)', 'https://arxiv.org/abs/2411.15100'],
        ['S4', 'Tam et al. — Let Me Speak Freely? Format restrictions and LLM performance (2024)', 'https://arxiv.org/abs/2408.02442'],
        ['S5', 'OpenAI — Structured Outputs guide', 'https://developers.openai.com/api/docs/guides/structured-outputs'],
        ['S6', 'Anthropic — Structured outputs (Claude Developer Platform docs)', 'https://platform.claude.com/docs/en/build-with-claude/structured-outputs'],
        ['S8', 'llama.cpp — grammars README (GBNF)', 'https://github.com/ggml-org/llama.cpp/blob/master/grammars/README.md'],
        ['S9', 'Instructor (567-labs) — README', 'https://github.com/567-labs/instructor'],
        ['S10', 'Microsoft TypeChat — README', 'https://github.com/microsoft/TypeChat'],
        ['S12', 'PydanticAI — Output', 'https://pydantic.dev/docs/ai/core-concepts/output/'],
        ['S19', 'Will Kurt (dottxt) — Say What You Mean', 'https://blog.dottxt.ai/say-what-you-mean.html'],
      ],
      dur: TS.DUR, poster: 5.6, vw: 960, vh: 540,
    },
    chapters: TS.CHAPTERS, captions: TS.CAPTIONS,
    state: Object.assign({}, TS.STATE),
    controls: [
      { key: 'constrain', label: 'Constrain decoding', kind: 'toggle', on: 'on', off: 'off', jump: 39.6,
        hint: 'Off: no points close, so the car can take “$” — valid JSON, wrong for the schema.' },
      { key: 'u', label: 'Sampling draw u', kind: 'range', min: 0, max: 0.999, step: 0.001, format: (v) => (+v).toFixed(3), jump: 44.3,
        hint: 'where the car lands on the cumulative odds' },
      { key: 'stepRate', label: 'Success rate per step', kind: 'range', min: 0.80, max: 0.999, step: 0.001, format: pct, jump: 66,
        hint: 'Runs that survive ten steps: rate to the tenth power.' },
      { key: 'steps', label: 'Steps in the chain', kind: 'range', min: 2, max: 10, step: 1, jump: 66,
        hint: 'Junctions that can derail a run; the rest go dim.' },
      { key: 'inject', label: 'Send a bad value', kind: 'select', options: [['ok', 'ok'], ['string amount', 'string amount'], ['missing due', 'missing due']], jump: 93,
        hint: 'Typed: it stops at the first joint. Untyped: it fails where it is first used.' },
    ],
    build, render,
  };
})();
window.__AUDIT = () => window.TS.audit();
