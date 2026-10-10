/* ════════════════════════════════════════════════════════════════════
   core/scene-kit.js — the library's kit: SceneKit (assets/scene-kit.js) + module parts
   --------------------------------------------------------------------
   LibKit.create(chrome) → K: every SceneKit helper (el, tx, rise, show, Rails, …)
   plus the parts the modules share, so no module re-implements them:
     head(g, eyebrow, title).set(t, t0)        dark: centred; notebook: left, like the field notebook
     chip(g, text, x, y, colour, anchor).set(p) the name-it-last chip (hairline box, mono)
     foot(g, y).set(text, opacity, colour)      the foot line (mono 13, dim)
     bracket(g).set(x, y0, y1, colour, o, side) a hairline ratio/gap bracket
     countRing(g, x, y, r).set(p, digit, colour, o)   commit/ask countdown: the ring un-draws
     glyph(g, kind, x, y, w, h, colour)          a small drawing of an earlier frame (recap cards)
   Colours are passed in (from ctx.roles) — the kit never resolves a role.
   Layout: LibKit.create(chrome, lay) — lay = Layout.make(aspect). At 16:9 (lay.wide) every part is exactly the
   pre-layout kit. At 1:1, 4:5 and 9:16 the head sits in lay.head, the foot and the chip at lay.foot.y, sizes come
   from lay.fs (the phone floor is 28 u), and K.footY(y16) / K.fs(role, size16) give modules the per-aspect value.
   ──────────────────────────────────────────────────────────────────── */
(function (root) {
  'use strict';
  function create(chrome, lay) {
    const nb = chrome === 'notebook';
    lay = lay || (root.Layout ? root.Layout.make('16x9') : { wide: true });
    const W = lay.wide !== false;
    const K = root.SceneKit.create({ prefix: 'lk', fs: { eyebrow: 13, small: 13, mono: 15, sans: 18, head: 40, title: 58 },
      head: nb ? { cx: 60, eyebrowY: 44, titleY: 88 } : { cx: 480, eyebrowY: 44, titleY: 84 } });
    const { el, tx, setOp, tr } = K;
    K.chrome = chrome; K.lay = lay; K.wide = W;
    /** a size by role: the 16:9 size when wide, else the aspect's phone size (never below the floor) */
    K.fs = (role, size16) => (W ? size16 : Math.max(lay.fs[role] || 28, 28));
    K.footY = (y16) => (W ? y16 : lay.foot.y);
    /** fit a one-line text to maxW: mono → sans → two lines (tspans), never below the floor; cached per string */
    const fitCache = new WeakMap();
    K.fitLine = function (e, s, maxW, o) {
      o = o || {};
      let c = fitCache.get(e); if (!c) { c = { s: null, cls: e.getAttribute('class') }; fitCache.set(e, c); }
      if (c.s === s) return e; c.s = s;
      e.setAttribute('class', c.cls); e.textContent = s;
      if (!s || K.tw(e) <= maxW) return e;
      e.setAttribute('class', 'lk-s');
      if (K.tw(e) <= maxW) return e;
      const words = s.split(' '), x = e.getAttribute('x'), lh = (parseFloat(e.getAttribute('font-size')) || 28) * 1.18;
      let a = '', i = 0; for (; i < words.length; i++) { const cand = a ? a + ' ' + words[i] : words[i]; e.textContent = cand; if (K.tw(e) > maxW && a) break; a = cand; }
      e.textContent = ''; K.tspan(e, a, { x, dy: o.up ? -lh / 2 : 0 }); K.tspan(e, words.slice(i).join(' '), { x, dy: lh });
      return e;
    };

    K.head = function (g, eyebrow, title) {
      const anchor = nb ? 'start' : 'middle';
      if (!W) {
        const H = lay.head, cx = nb ? H.x0 : 480, maxW = H.x1 - H.x0;
        const e1 = H.eyebrowY != null ? tx(g, eyebrow, cx, H.eyebrowY, { size: lay.fs.eyebrow, ls: 3, fill: K.C.dim, anchor, op: 0 }) : null;
        const hg = el('g', { opacity: 0 }, g);
        const ht = tx(hg, title, cx, H.titleY, { size: lay.fs.title, cls: 'd', anchor, fill: K.C.ink });
        let fs = lay.fs.title; while (K.tw(ht) > maxW && fs > 40) { fs -= 2; ht.setAttribute('font-size', fs); }
        return { set(t, a) { if (e1) setOp(e1, K.E.defer(K.ex.prog(t, a, a + 0.6)) * 0.9); const p = K.E.glaser(K.ex.prog(t, a + 0.25, a + 0.95)); setOp(hg, p); tr(hg, 0, (1 - p) * 14); } };
      }
      const e1 = tx(g, eyebrow, K.HEAD.cx, K.HEAD.eyebrowY, { size: 13, ls: 4, fill: K.C.dim, anchor, op: 0 });
      const hg = el('g', { opacity: 0 }, g);
      tx(hg, title, K.HEAD.cx, K.HEAD.titleY, { size: nb ? 44 : 40, cls: 'd', anchor, fill: K.C.ink });
      return { set(t, a) { setOp(e1, K.E.defer(K.ex.prog(t, a, a + 0.6)) * 0.9); const p = K.E.glaser(K.ex.prog(t, a + 0.25, a + 0.95)); setOp(hg, p); tr(hg, 0, (1 - p) * 14); } };
    };

    K.chip = function (g, text, x, y, col, anchor) {
      const cg = el('g', { opacity: 0, 'data-role': 'chip' }, g), cs = W ? 15 : lay.fs.chip;
      const t = tx(cg, text, 0, 0, { size: cs, fill: col, anchor: anchor || 'middle', ls: W ? 0.5 : 0.2 });
      if (!W && K.tw(t) + 40 > lay.F.w) t.setAttribute('class', 'lk-s');
      const pad = W ? 14 : 22, w = K.tw(t) + 2 * pad, h = W ? 30 : cs * 1.75, x0 = anchor === 'start' ? -pad : (anchor === 'end' ? -w + pad : -w / 2);
      const box = el('rect', { x: x0, y: W ? -20 : -cs * 1.16, width: w, height: h, rx: h / 2, fill: 'none', stroke: col, 'stroke-width': W ? 1.1 : 1.6 }, cg);
      cg.insertBefore(box, t);
      return { g: cg, w, set(p) { K.show(cg, p); cg.setAttribute('transform', 'translate(' + x + ' ' + (y + (1 - p) * 8).toFixed(2) + ')'); } };
    };

    K.foot = function (g, y) {
      if (!W) {
        const f = tx(g, '', 480, lay.foot.y, { size: lay.fs.foot, fill: K.C.dim, anchor: 'middle', op: 0, ls: 0.2 }), maxW = lay.foot.x1 - lay.foot.x0;
        f.setAttribute('data-role', 'foot');
        return { e: f, set(s, o, col) { if (o > 0.001 || f.textContent !== '') K.fitLine(f, s, maxW, { up: true }); setOp(f, o); if (col) f.setAttribute('fill', col); } };
      }
      const f = tx(g, '', 480, y || 486, { size: 13, fill: K.C.dim, anchor: 'middle', op: 0, ls: 0.4 });
      f.setAttribute('data-role', 'foot');
      return { e: f, set(s, o, col) { K.setText(f, s); setOp(f, o); if (col) f.setAttribute('fill', col); } };
    };

    K.bracket = function (g) {
      const p = el('path', { fill: 'none', 'stroke-width': W ? 1.2 : 2, opacity: 0, 'stroke-linecap': 'round' }, g);
      return { e: p, set(x, y0, y1, col, o, side) { const d = (side === 'left' ? -1 : 1) * (W ? 6 : 10);
        p.setAttribute('d', 'M' + x + ' ' + y0 + ' h' + d + ' V' + y1 + ' h' + (-d)); p.setAttribute('stroke', col); setOp(p, o); } };
    };

    K.countRing = function (g, x, y, r) {
      const cg = el('g', { opacity: 0 }, g);
      const base = el('circle', { cx: x, cy: y, r, fill: 'none', 'stroke-width': 1, opacity: 0.25 }, cg);
      const ring = el('circle', { cx: x, cy: y, r, fill: 'none', 'stroke-width': W ? 1.6 : 2.4, pathLength: 1, 'stroke-dasharray': '1 1',
        transform: 'rotate(-90 ' + x + ' ' + y + ')', 'stroke-linecap': 'round' }, cg);
      const dig = tx(cg, '', x, y + (W ? 6 : 10), { size: W ? 18 : 28, anchor: 'middle', weight: 700 });
      return { g: cg, set(p, digit, col, o) {
        ring.setAttribute('stroke-dashoffset', (-p).toFixed(4)); ring.setAttribute('stroke', col); base.setAttribute('stroke', col);
        K.setText(dig, digit == null ? '' : String(digit)); dig.setAttribute('fill', col); K.show(cg, o); } };
    };

    /** a recap glyph: a small, hairline drawing of an earlier frame (w × h box at x, y) */
    K.glyph = function (g, kind, x, y, w, h, col, sub) {
      const G = el('g', { transform: 'translate(' + x + ' ' + y + ')', fill: 'none', stroke: col, 'stroke-width': W ? 1.2 : 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
      const P = (d, o) => el('path', Object.assign({ d }, o || {}), G);
      const dot = (cx, cy, r, filled) => el('circle', { cx, cy, r: W ? r : r * 1.8, fill: filled ? col : 'none' }, G);
      const mx = w / 2, my = h / 2;
      if (kind === 'fan') {
        P('M2 ' + my + ' H' + (w * 0.3));
        [-0.4, -0.13, 0.13, 0.4].forEach((k, i) => P('M' + (w * 0.3) + ' ' + my + ' C ' + (w * 0.45) + ' ' + my + ', ' + (w * 0.5) + ' ' + (my + k * h) + ', ' + (w * 0.62) + ' ' + (my + k * h) + ' H' + (w - 2), { opacity: i % 2 ? 0.35 : 1 }));
      } else if (kind === 'staircase') {
        let d = 'M2 ' + (h * 0.15); const n = 6; for (let i = 0; i < n; i++) { const x1 = 2 + (w - 4) * (i + 1) / n; d += ' H' + x1.toFixed(1) + ' V' + (h * 0.15 + (h * 0.7) * (i + 1) / n).toFixed(1); } P(d);
      } else if (kind === 'check') {
        el('rect', { x: w * 0.12, y: h * 0.12, width: w * 0.76, height: h * 0.76, rx: 4 }, G);
        P('M' + (w * 0.3) + ' ' + my + ' l ' + (w * 0.12) + ' ' + (h * 0.18) + ' l ' + (w * 0.26) + ' ' + (-h * 0.38));
      } else if (kind === 'grid' || kind === 'block') {
        const c = kind === 'grid' ? 8 : 5, r = kind === 'grid' ? 4 : 4, px = (w - 8) / c, py = (h - 8) / r;
        for (let i = 0; i < c * r; i++) dot(4 + px * (i % c + 0.5), 4 + py * (Math.floor(i / c) + 0.5), 1.6, kind === 'grid' ? i < 6 : i < 8);
      } else if (kind === 'outline') {
        for (let i = 0; i < 12; i++) { const cx = 6 + (w - 12) * (i % 6) / 5, cy = h * (i < 6 ? 0.32 : 0.68); dot(cx, cy, 1.6, i < 3); if (i % 3 === 0) dot(cx, cy, 4, false); }
      } else if (kind === 'curve') {
        P('M2 ' + my + ' H' + (w - 2), { opacity: 0.35 }); P('M' + mx + ' 2 V' + (h - 2), { opacity: 0.35 });
        P('M4 ' + (h - 3) + ' C ' + (mx * 0.7) + ' ' + (my + 6) + ', ' + (mx - 4) + ' ' + (my + 2) + ', ' + mx + ' ' + my + ' C ' + (mx + 8) + ' ' + (my - 8) + ', ' + (w * 0.75) + ' ' + (h * 0.25) + ', ' + (w - 4) + ' ' + (h * 0.2));
      } else if (kind === 'loop') {
        el('circle', { cx: mx, cy: my, r: Math.min(w, h) * 0.32 }, G); dot(mx, my - Math.min(w, h) * 0.32, 3, true); dot(mx + Math.min(w, h) * 0.32, my, 3, false);
      } else if (kind === 'wheel') {
        const R = Math.min(w, h) * 0.4; el('circle', { cx: mx, cy: my, r: R }, G);
        for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; P('M' + (mx + Math.cos(a) * R * 0.8).toFixed(1) + ' ' + (my + Math.sin(a) * R * 0.8).toFixed(1) + ' L' + (mx + Math.cos(a) * R).toFixed(1) + ' ' + (my + Math.sin(a) * R).toFixed(1)); }
        P('M' + mx + ' ' + my + ' L' + (mx + R * 0.55) + ' ' + (my - R * 0.55));
      } else if (kind === 'piles') {
        P('M2 ' + (h - 4) + ' H' + (w - 2));
        [[0.3, 4], [0.36, 6], [0.42, 3], [0.6, 3], [0.66, 6], [0.72, 4]].forEach(([fx, n]) => { for (let i = 0; i < n; i++) dot(w * fx, h - 8 - i * 4.2, 1.5, true); });
      } else if (kind === 'arrow') {
        P('M4 ' + my + ' H' + (w - 8)); P('M' + (w - 14) + ' ' + (my - 6) + ' L' + (w - 6) + ' ' + my + ' L' + (w - 14) + ' ' + (my + 6));
      } else if (kind === 'ladder') {
        P('M' + (w * 0.3) + ' 2 V' + (h - 2)); P('M' + (w * 0.7) + ' 2 V' + (h - 2));
        for (let i = 0; i < 4; i++) P('M' + (w * 0.3) + ' ' + (6 + i * (h - 12) / 3) + ' H' + (w * 0.7));
      } else if (kind === 'reservoir') {
        el('rect', { x: 2, y: my - 7, width: w - 4, height: 14, rx: 2 }, G); el('rect', { x: 2, y: my - 7, width: (w - 4) * 0.25, height: 14, rx: 2, fill: col, stroke: 'none', opacity: 0.6 }, G);
      }
      if (sub) tx(g, sub, x + w / 2, y + h + (W ? 18 : 34), { size: W ? 13 : lay.fs.label, anchor: 'middle', fill: K.C.dim });
      return G;
    };
    return K;
  }
  root.LibKit = { create };
})(typeof window !== 'undefined' ? window : globalThis);
