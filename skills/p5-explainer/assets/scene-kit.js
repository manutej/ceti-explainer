
/* ───── scene kit (shared helpers + brand geometry) ───── */
/* ════════════════════════════════════════════════════════════════════
   SceneKit — the helpers every feature-cut film used to re-implement
   --------------------------------------------------------------------
   Inlined by build_feature.py into BOTH cuts, before data.js, as window.SceneKit.
   Pure helpers: no clock, no randomness except the seeded mulberry you create,
   no DOM until you call them from build(). Extracted from films/typesafe/scenes.js
   (which keeps its own copy — it predates the kit; new films use this).

   ── in scenes.js ────────────────────────────────────────────────────
     const K = SceneKit.create({ prefix: 'xx', fs: { eyebrow: 13, small: 13, mono: 15, sans: 18, head: 40, title: 58 },
                                 head: { cx: 480, eyebrowY: 44, titleY: 84 } });
     const { el, tx, tspan, tw, fit, wrap, setOp, show, tr, rise, setText, gate, sceneHead, C, A } = K;
     build(svg, ctx)  { K.bind(ctx); K.readTokens(); K.installStyle(svg); … }   // C/RGB filled once
     render(t, ctx)   { K.bind(ctx); … }                                         // ex/E/RM refreshed

   Text      el(tag, attrs, parent) · tx(parent, str, x, y, {size, cls:'m'|'s'|'d', fill, anchor, ls, weight, op})
             tspan · tw(e) (measured width, guarded) · sub(e,i,n) · fit(e, maxW) · wrap(parent, str, x, y, maxW, lh, o)
   Motion    setOp(n,o) · show(n,o) (also toggles visibility) · tr(n,x,y) · rise(n,t,t0,d,dy) → p
             gate(g, t, [a,b]) → scene fade 0.9 s in/out, returns visible? · sceneHead(g, eyebrow, title).set(t, t0)
             footLine(g, y, anchor, x)
   Colour    readTokens() → K.C[role] (css) and K.RGB[role]; A(role, alpha) → rgba().  Roles: ground panel cell ink dim
             line line2 accent accent2(=sage) support(=slate) peach fill.  The p5 bridge's L.pal uses the same names
             (accent2/support, with sage/slate aliases), so one vocabulary covers both lanes.
   Track     P(x,y) · cub(p0,p1,p2,p3,n) (polyline of a cubic) · cat(...polys) · poly(pts) · at(poly, s) → {x,y,a}
             Rails(parent, pts, stroke) → {g, Pl, draw(p), col(c), op(o)}  — a rail PAIR K.gauge apart, revealed 0→1
             Blade(parent, x, y, len, stroke).set(angle, colour, op) · Gate(parent, x, y, len).set(angle, colour, op)
             Car(parent, fill) · placeCar(car, {x,y,a}, op, fill)
   Payoff    Ring(parent, stroke) + ring(c, t, [a,b], x, y, r0, r1, alpha)  — only where no text is within reach
             Stamp(parent, stroke) + stamp(s, t, [a,b], box{x,y,w,h}, grow, alpha) — grows out of a label's own box
             Check / Cross / Warn (parent, x, y, r|col)
   Numbers   fmtN(n) (1,234) · sup(n) (¹²) · mulberry(seed) (seeded rng — build() only)

   ── shared, no instance needed ──────────────────────────────────────
     SceneKit.counts(ps, n)        largest-remainder integer split (Σ = n exactly) — conserved marks
     SceneKit.whale                the CETI whale: WPATHS (600×360 source space), EYE, TF1 (hero, 960×540),
                                   TF7 (small, under a landing line), samplePath(d, n), tf(T, p), points(n, T)
     SceneKit.touch(c)             p5 layers: call first in draw() — see below
     SceneKit.checkCaptions(caps, dur, max=90) → [] of problems (use inside audit())

   touch(c) — why every layer paints one invisible pixel. The bridge clears each layer canvas before draw().
   A frame in which a layer draws NOTHING after that clear can leave Chromium's compositor presenting the
   previous frame's canvas under SwiftShader/headless (the canvas is "unchanged", so no new frame is pushed):
   a scrub or a worker seek then shows stale marks. One 0.5-unit fill at alpha 0.004 (≈1/255) marks the canvas
   dirty every frame at no visible cost. It is the only pixel a layer touches outside its figure; --layers
   alpha renders show it as alpha ≤ 1 at (0,0).
   ──────────────────────────────────────────────────────────────────── */
window.SceneKit = (function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';

  /* ---------- shared, instance-free ---------- */
  function counts(ps, n) {
    const raw = ps.map(p => p * n), fl = raw.map(Math.floor);
    let left = n - fl.reduce((a, b) => a + b, 0);
    raw.map((r, i) => [r - fl[i], i]).sort((a, b) => b[0] - a[0] || a[1] - b[1]).forEach(([, i]) => { if (left > 0) { fl[i]++; left--; } });
    return fl;
  }
  const mulberry = (s) => () => { s |= 0; s = (s + 0x6D2B79F5) | 0; let z = Math.imul(s ^ (s >>> 15), 1 | s); z = (z + Math.imul(z ^ (z >>> 7), 61 | z)) ^ z; return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
  const fmtN = (n) => Math.round(n).toLocaleString('en-US');
  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', '-': '⁻' };
  const sup = (n) => String(n).split('').map(d => SUP[d] || d).join('');
  const touch = (c) => { c.fillStyle = 'rgba(0,0,0,0.004)'; c.fillRect(0, 0, 0.5, 0.5); };
  function checkCaptions(caps, dur, max) {
    const out = []; max = max || 90;
    caps.forEach((c, i) => {
      if (c[2].length > max) out.push('caption ' + i + ' is ' + c[2].length + ' chars > ' + max);
      if (!(c[0] < c[1])) out.push('caption ' + i + ' has t0 ≥ t1');
      if (i && caps[i - 1][1] > c[0] + 1e-9) out.push('caption ' + i + ' overlaps the previous one');
    });
    if (caps.length && caps[caps.length - 1][1] > dur) out.push('last caption runs past dur');
    return out;
  }

  /* ---------- the CETI whale (brand geometry; from ceti-explainer feature-cut-v2, 600×360 source space) ---------- */
  const whale = (function () {
    const WPATHS = [
      { d: 'M88 168 C 96 152, 118 138, 152 138 C 188 138, 220 148, 252 162 C 292 178, 332 192, 376 198 C 418 204, 456 206, 488 198 C 510 192, 524 184, 532 176', n: 26 },
      { d: 'M88 168 C 92 158, 104 150, 124 148 C 156 144, 196 154, 240 168 C 286 184, 336 196, 388 200', n: 14 },
      { d: 'M232 180 C 248 210, 280 232, 322 238 C 308 224, 290 208, 276 192', n: 10 },
      { d: 'M488 198 C 512 198, 532 192, 548 178 C 562 166, 572 148, 572 130 C 558 138, 542 148, 528 158 C 540 152, 556 142, 568 126 C 552 132, 534 142, 518 154', n: 16 },
      { d: 'M532 176 C 548 172, 562 162, 572 150', n: 4 },
    ];
    /** the streaks that trail the whale's head (source space): [d, role, width, opacity] */
    const STREAKS = [
      ['M148 78 C 196 92, 250 122, 312 158', 'accent', 2.0, 0.85], ['M168 86 C 222 102, 282 132, 348 168', 'accent2', 1.6, 0.8],
      ['M188 92 C 246 110, 310 142, 380 178', 'peach', 2.2, 0.85], ['M210 98 C 270 116, 336 148, 410 184', 'support', 1.3, 0.7],
      ['M232 104 C 292 122, 358 152, 434 186', 'accent', 1.1, 0.6], ['M256 110 C 314 126, 376 152, 452 184', 'accent2', 1.4, 0.55],
      ['M280 116 C 332 130, 388 150, 462 178', 'dim', 1.0, 0.45],
    ];
    const EYE = { x: 150, y: 160 };
    const TF1 = { s: 1.6, tx: -51, ty: -82 };   // hero on 960×540: x 90–864, y 120–300 (title below, y ≈ 400)
    const TF7 = { s: 1.0, tx: 152, ty: 196 };   // small, under a landing line: x 240–724, y 322–434
    function cubics(d) {
      const n = d.replace(/[MC,]/g, ' ').trim().split(/\s+/).map(Number);
      const segs = []; let p = [n[0], n[1]];
      for (let i = 2; i + 5 < n.length; i += 6) { const s = [p, [n[i], n[i + 1]], [n[i + 2], n[i + 3]], [n[i + 4], n[i + 5]]]; segs.push(s); p = s[3]; }
      return segs;
    }
    /** `count` points evenly spaced by arc length along an 'M x y C …' path */
    function samplePath(d, count) {
      const segs = cubics(d), pts = [];
      const at = (s, u) => { const v = 1 - u; return [0, 1].map(k => v * v * v * s[0][k] + 3 * v * v * u * s[1][k] + 3 * v * u * u * s[2][k] + u * u * u * s[3][k]); };
      const dense = []; segs.forEach(s => { for (let i = 0; i <= 64; i++) dense.push(at(s, i / 64)); });
      const L = [0]; for (let i = 1; i < dense.length; i++) L.push(L[i - 1] + Math.hypot(dense[i][0] - dense[i - 1][0], dense[i][1] - dense[i - 1][1]));
      const tot = L[L.length - 1]; let j = 0;
      for (let k = 0; k < count; k++) {
        const target = (k / Math.max(1, count - 1)) * tot; while (j < L.length - 2 && L[j + 1] < target) j++;
        const f = (target - L[j]) / Math.max(1e-9, L[j + 1] - L[j]);
        pts.push({ x: dense[j][0] + (dense[j + 1][0] - dense[j][0]) * f, y: dense[j][1] + (dense[j + 1][1] - dense[j][1]) * f });
      }
      return pts;
    }
    const tf = (T, p) => ({ x: p.x * T.s + T.tx, y: p.y * T.s + T.ty });
    /** n marks over the whole whale, split across paths by their n weights (largest remainder), in stage units under T.
     *  Each point carries {x, y, path}. The eye is NOT included — place it with tf(T, EYE). */
    function points(n, T) {
      const w = WPATHS.map(o => o.n), tot = w.reduce((a, b) => a + b, 0), per = counts(w.map(x => x / tot), n), out = [];
      WPATHS.forEach((o, pi) => samplePath(o.d, per[pi]).forEach(p => { const q = T ? tf(T, p) : p; out.push({ x: q.x, y: q.y, path: pi }); }));
      return out;
    }
    return { WPATHS, STREAKS, EYE, TF1, TF7, cubics, samplePath, tf, points };
  })();

  /* ---------- per-film instance ---------- */
  function create(opts) {
    opts = opts || {};
    const prefix = opts.prefix || 'sk';
    const FS = Object.assign({ eyebrow: 13, small: 13, mono: 15, sans: 18, head: 40, title: 58, counter: 40 }, opts.fs || {});
    const HEAD = Object.assign({ cx: 480, eyebrowY: 44, titleY: 84 }, opts.head || {});
    const KC = Object.assign({ gauge: 3, railW: 1.25, carW: 13, carH: 5 }, opts.track || {});
    const C = {}, RGB = {};
    const K = { FS, HEAD, C, RGB, gauge: KC.gauge, ex: null, E: null, RM: false, HAS_P5: false };

    K.bind = (ctx) => { K.ex = ctx.ex; K.E = ctx.ex.ease; K.RM = !!ctx.rm; K.HAS_P5 = !!window.P5Film; return K; };
    const ex = () => K.ex, E = () => K.E;

    /* text */
    function el(tag, attrs, parent) {
      const e = document.createElementNS(NS, tag);
      if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
      if (parent) parent.appendChild(e);
      return e;
    }
    function tx(parent, str, x, y, o) {
      o = o || {};
      const a = { x, y, 'font-size': o.size || FS.mono, fill: o.fill || C.ink, class: prefix + '-' + (o.cls || 'm') };
      if (o.anchor) a['text-anchor'] = o.anchor;
      if (o.ls != null) a['letter-spacing'] = o.ls;
      if (o.weight) a['font-weight'] = o.weight;
      if (o.op != null) a.opacity = o.op;
      const e = el('text', a, parent); e.textContent = str; return e;
    }
    function tspan(parent, str, attrs) { const s = el('tspan', attrs, parent); s.textContent = str; return s; }
    function tw(e, perChar) {
      try { const w = e.getComputedTextLength(); if (w > 0) return w; } catch (err) { /* headless gate before layout */ }
      return (e.textContent || '').length * (perChar || 9);
    }
    function sub(e, i, n) { if (n <= 0) return 0; try { return e.getSubStringLength(i, n); } catch (err) { return n * 9; } }
    function fit(e, maxW) { let fs = parseFloat(e.getAttribute('font-size')); while (tw(e) > maxW && fs > FS.small) { fs -= 0.5; e.setAttribute('font-size', fs); } return e; }
    function wrap(parent, str, x, y, maxW, lh, o) {
      const e = tx(parent, '', x, y, o), words = str.split(' '), lines = []; let cur = '';
      for (const w of words) { const cand = cur ? cur + ' ' + w : w; e.textContent = cand; if (tw(e) > maxW && cur) { lines.push(cur); cur = w; } else cur = cand; }
      if (cur) lines.push(cur);
      e.textContent = ''; lines.forEach((l, i) => tspan(e, l, { x, dy: i ? lh : 0 }));
      return { e, n: lines.length };
    }
    /** the three font classes (mono / sans / display) — call once in build */
    function installStyle(svg) {
      const s = el('style', null, svg);
      s.textContent = '.' + prefix + '-m{font-family:var(--font-mono);white-space:pre} .' + prefix + '-s{font-family:var(--font-sans)} .' + prefix + '-d{font-family:var(--font-display);font-style:italic;font-weight:300}';
      return s;
    }

    /* motion */
    const setOp = (n, o) => { n.setAttribute('opacity', (+o).toFixed(3)); };
    const show = (n, o) => { n.setAttribute('opacity', (+o).toFixed(3)); n.setAttribute('visibility', o <= 0.001 ? 'hidden' : 'visible'); };
    const tr = (n, x, y) => n.setAttribute('transform', 'translate(' + (+x).toFixed(2) + ' ' + (+y).toFixed(2) + ')');
    function rise(n, t, t0, d, dy) { const p = E().glaser(ex().prog(t, t0, t0 + (d || 0.55))); show(n, p); tr(n, 0, (1 - p) * (dy == null ? 16 : dy)); return p; }
    function setText(e, s) { if (e.textContent !== s) e.textContent = s; }
    function gate(g, t, r) { const o = ex().fade(t, r); show(g, o); return o > 0; }
    /** eyebrow (mono, tracked) + Fraunces headline; .set(t, t0): eyebrow at t0, headline rises from t0 + 0.25 */
    function sceneHead(g, eyebrow, title, o) {
      o = o || {};
      const e1 = tx(g, eyebrow, HEAD.cx, HEAD.eyebrowY, { size: FS.eyebrow, ls: 4, fill: o.eyebrowFill || C.dim, anchor: 'middle', op: 0 });
      const hg = el('g', { opacity: 0 }, g);
      const h = tx(hg, title, HEAD.cx, HEAD.titleY, { size: FS.head, cls: 'd', anchor: 'middle' });
      return { e1, hg, h, set(t, a) { setOp(e1, E().defer(ex().prog(t, a, a + 0.6)) * 0.9); const p = E().glaser(ex().prog(t, a + 0.25, a + 0.95)); setOp(hg, p); tr(hg, 0, (1 - p) * 14); } };
    }
    function footLine(g, y, anchor, x) { return tx(g, '', x == null ? HEAD.cx : x, y, { size: FS.small, fill: C.dim, anchor: anchor || 'middle', op: 0 }); }

    /* colour */
    const ROLES = { ground: '--ex-ground', panel: '--ex-panel', cell: '--ex-cell', ink: '--ex-ink', dim: '--ex-dim', line: '--ex-line',
      line2: '--ex-line-2', accent: '--ex-accent', accent2: '--ex-accent2', support: '--ex-support', peach: '--ex-peach', fill: '--ex-accent-fill' };
    function readTokens() {
      const cs = getComputedStyle(document.documentElement), cv = document.createElement('canvas').getContext('2d');
      for (const k in ROLES) {
        const v = cs.getPropertyValue(ROLES[k]).trim() || '#888'; C[k] = v; cv.fillStyle = '#000'; cv.fillStyle = v; const s = String(cv.fillStyle);
        let r = 128, g = 128, b = 128, a = 1;
        if (s.charAt(0) === '#') { r = parseInt(s.substr(1, 2), 16); g = parseInt(s.substr(3, 2), 16); b = parseInt(s.substr(5, 2), 16); }
        else { const m = s.match(/[\d.]+/g); if (m) { r = +m[0]; g = +m[1]; b = +m[2]; a = m[3] != null ? +m[3] : 1; } }
        RGB[k] = [r, g, b, a];
      }
      C.sage = C.accent2; C.slate = C.support; RGB.sage = RGB.accent2; RGB.slate = RGB.support;   // aliases (typesafe's names)
      return C;
    }
    const A = (role, a) => { const c = RGB[role]; return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (c[3] * a).toFixed(3) + ')'; };

    /* track geometry */
    const P = (x, y) => ({ x, y });
    function cub(p0, p1, p2, p3, n) {
      const out = []; n = n || 24;
      for (let i = 0; i <= n; i++) { const u = i / n, v = 1 - u;
        out.push({ x: v * v * v * p0.x + 3 * v * v * u * p1.x + 3 * v * u * u * p2.x + u * u * u * p3.x,
                   y: v * v * v * p0.y + 3 * v * v * u * p1.y + 3 * v * u * u * p2.y + u * u * u * p3.y }); }
      return out;
    }
    const cat = (...arrs) => arrs.reduce((acc, a) => acc.concat(acc.length ? a.slice(1) : a), []);
    function poly(pts) { const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y)); return { pts, cum, len: cum[cum.length - 1] }; }
    function at(Pl, s) {
      s = Math.min(Pl.len, Math.max(0, s));
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
    /** a rail PAIR along a centreline polyline; draw(p) reveals it start→end (pathLength dash) */
    function Rails(parent, pts, stroke) {
      const g = el('g', null, parent), h = KC.gauge / 2;
      const mk = (o) => el('path', { d: offD(pts, o), fill: 'none', stroke, 'stroke-width': KC.railW, pathLength: 1, 'stroke-dasharray': '1 2', 'stroke-dashoffset': 0 }, g);
      const a = mk(-h), b = mk(h);
      let lastC = stroke, lastP = -1;
      return {
        g, Pl: poly(pts),
        draw(p) { p = Math.min(1, Math.max(0, p)); if (p === lastP) return; lastP = p; const o = (1 - p).toFixed(4); a.setAttribute('stroke-dashoffset', o); b.setAttribute('stroke-dashoffset', o); },
        col(c) { if (c === lastC) return; lastC = c; a.setAttribute('stroke', c); b.setAttribute('stroke', c); },
        op(o) { setOp(g, o); },
      };
    }
    function Blade(parent, x, y, len, stroke) {
      const g = el('g', null, parent), h = KC.gauge / 2;
      const a = el('line', { x1: 0, y1: -h, x2: len, y2: -h, stroke, 'stroke-width': KC.railW * 1.4 }, g);
      const b = el('line', { x1: 0, y1: h, x2: len, y2: h, stroke, 'stroke-width': KC.railW * 1.4 }, g);
      return { g, set(ang, c, o) { g.setAttribute('transform', 'translate(' + x + ' ' + y + ') rotate(' + ang.toFixed(2) + ')'); a.setAttribute('stroke', c); b.setAttribute('stroke', c); setOp(g, o == null ? 1 : o); } };
    }
    /** a solid gate bar lying along the track; closing swings it across the rails */
    function Gate(parent, x, y, len) {
      const g = el('g', null, parent);
      const r = el('rect', { x: 0, y: -3, width: len, height: 6, rx: 1, fill: C.accent }, g);
      return { g, set(ang, c, o) { g.setAttribute('transform', 'translate(' + x + ' ' + y + ') rotate(' + ang.toFixed(2) + ')'); r.setAttribute('fill', c); setOp(g, o == null ? 1 : o); } };
    }
    function Car(parent, fill, w, h) { w = w || KC.carW; h = h || KC.carH; return el('rect', { x: -w / 2, y: -h / 2, width: w, height: h, fill, opacity: 0 }, parent); }
    function placeCar(c, pos, o, fill) {
      c.setAttribute('transform', 'translate(' + pos.x.toFixed(2) + ' ' + pos.y.toFixed(2) + ') rotate(' + (pos.a || 0).toFixed(2) + ')');
      show(c, o == null ? 1 : o); if (fill) c.setAttribute('fill', fill);
    }

    /* payoffs */
    function Ring(parent, stroke) { return el('circle', { r: 0, fill: 'none', stroke, 'stroke-width': 1.3, opacity: 0 }, parent); }
    function ring(c, t, w, x, y, r0, r1, a) {
      const p = ex().prog(t, w[0], w[1]);
      if (p <= 0 || p >= 1) { c.setAttribute('opacity', 0); return; }
      c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', (r0 + (r1 - r0) * E().glaser(p)).toFixed(2));
      c.setAttribute('opacity', ((a || 0.6) * (1 - p)).toFixed(3));
    }
    function Stamp(parent, stroke) { return el('rect', { fill: 'none', stroke, 'stroke-width': 1.3, rx: 4, opacity: 0 }, parent); }
    function stamp(s, t, w, box, grow, a) {
      const p = ex().prog(t, w[0], w[1]);
      if (p <= 0 || p >= 1 || !box) { s.setAttribute('opacity', 0); return; }
      const g = 2 + (grow || 8) * E().glaser(p);
      s.setAttribute('x', (box.x - g).toFixed(1)); s.setAttribute('y', (box.y - g).toFixed(1));
      s.setAttribute('width', (box.w + 2 * g).toFixed(1)); s.setAttribute('height', (box.h + 2 * g).toFixed(1));
      s.setAttribute('opacity', ((a || 0.8) * (1 - p)).toFixed(3));
    }
    /** box of a text node in its parent's units (for stamp): call after fonts are loaded (build runs after) */
    function boxOf(e, pad) { pad = pad || 0; try { const b = e.getBBox(); return { x: b.x - pad, y: b.y - pad, w: b.width + 2 * pad, h: b.height + 2 * pad }; } catch (err) { return null; } }
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

    return Object.assign(K, {
      el, tx, tspan, tw, sub, fit, wrap, installStyle, setOp, show, tr, rise, setText, gate, sceneHead, footLine,
      readTokens, A, P, cub, cat, poly, at, offD, Rails, Blade, Gate, Car, placeCar, Ring, ring, Stamp, stamp, boxOf,
      Check, Cross, Warn, fmtN, sup, mulberry,
    });
  }

  return { create, counts, mulberry, fmtN, sup, touch, whale, checkCaptions, NS };
})();


