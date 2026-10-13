/* structures-demo · the same marks carried through layouts by arsenal/structures. Requires structures.js loaded first.
   Pure of t; seeds only in setup; colours only by token role. */
window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} };
(function () {
  const S = ARSENAL.structures, seg = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)));
  const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const BOX = { x: 60, y: 92, w: 840, h: 360 };
  const DUR = 12;

  /* a staged sequence: layouts[k] held from times[2k] to times[2k+1]; moved to layouts[k+1] by times[2k+1]..times[2k+2] */
  function stage(layouts, times, t, opt) {
    for (let k = 0; k < layouts.length - 1; k++) {
      const t0 = times[k * 2 + 1], t1 = times[k * 2 + 2];
      if (t < t0) return { L: layouts[k], k };
      if (t < t1) return { L: S.transition(layouts[k], layouts[k + 1], seg(t, t0, t1), opt[k] || {}), k: k + (seg(t, t0, t1) > 0.5 ? 1 : 0) };
    }
    return { L: layouts[layouts.length - 1], k: layouts.length - 1 };
  }

  function marks(p, L, T, o) {
    o = o || {}; const c = p.drawingContext, col = T.color, base = o.alpha == null ? 0.82 : o.alpha;
    const pass = (hl) => {
      c.fillStyle = hl ? col.accent2 : col.ink;
      for (const m of L.items) {
        if (m.hl !== hl || m.a <= 0.003) continue;
        c.globalAlpha = (hl ? 1 : base) * m.a * (o.fade == null ? 1 : o.fade);
        const s = hl ? 1.18 : 1;
        if (m.rot != null && o.rotate) { c.save(); c.translate(m.x, m.y); c.rotate(m.rot + Math.PI / 2); c.fillRect(-m.w * s / 2, -m.h * s / 2, m.w * s, m.h * s); c.restore(); }
        else c.fillRect(m.x - m.w * s / 2, m.y - m.h * s / 2, m.w * s, m.h * s);
      }
    };
    c.save(); pass(false); pass(true); c.restore();
  }
  function label(p, T, str, x, y, o) {
    o = o || {}; const f = T.type.mono; p.push(); p.noStroke(); p.fill(o.fill || T.color.muted); p.textFont(f.family); p.textStyle(p.NORMAL);
    p.textSize(o.size || 12); p.textAlign(o.align || p.LEFT, p.BASELINE); p.drawingContext.globalAlpha = o.a == null ? 1 : o.a; p.text(str, x, y); p.pop();
  }
  function head(p, T, name, n, sub) {
    label(p, T, name, 60, 56, { size: 13, fill: T.color.ink });
    label(p, T, fmt(n) + ' marks' + (sub ? ' · ' + sub : ''), 60, 74, { size: 11 });
  }

  /* ------- variant builders ------- */
  function buildThousand(p, ctx, P) {
    const r = S.mulberry32(ctx.seed || 1), n = P.n;
    const key = Array.from({ length: n }, () => (r() + r() + r()) / 3);
    const order = Array.from({ length: n }, (_, i) => i); for (let i = n - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
    const cuts = P.groups, groups = []; let at = 0; cuts.forEach((c) => { groups.push(order.slice(at, at + c)); at += c; });
    const flag = new Set(groups[groups.length - 1]);
    const L = [S.grid(n, 0, BOX), S.wall(n, BOX, key), S.ring(n, 178, { cx: 480, cy: 272 }), S.columns(groups, BOX, { labels: P.names, groupGap: 22 })];
    return { kind: 'thousand', L, flag, names: ['GRID', 'WALL', 'RING', 'COLUMNS'] };
  }
  function buildTree(p, ctx, P) {
    const r = S.mulberry32(ctx.seed || 1), n = P.n, par = [-1];
    for (let i = 1; i < n; i++) par.push(Math.max(0, Math.floor((i - 1) / (1.8 + r() * 1.6))));
    const TR = S.tree(par, { x: 60, y: 100, w: 840, h: 340 }, { maxSize: 20 }), GR = S.grid(n, 0, { x: 60, y: 100, w: 840, h: 340 }, { maxSize: 20 });
    let leaf = 0, bd = -1; TR.items.forEach((m) => { if (m.depth > bd || (m.depth === bd && m.x > TR.items[leaf].x)) { bd = m.depth; leaf = m.i; } });
    const path = new Map(); for (let v = leaf; v >= 0; v = par[v]) path.set(v, TR.items[v].depth);
    return { kind: 'tree', GR, TR, path, bd };
  }
  function buildTimeline(p, ctx, P) {
    const r = S.mulberry32(ctx.seed || 1), ev = []; let t = 1990;
    for (let i = 0; i < P.n; i++) { t += 0.4 + r() * r() * 4.2; ev.push({ t: +t.toFixed(1), label: 'Y' + Math.round(t) }); }
    const W = P.world;
    return { kind: 'timeline', W, TL: S.timeline(ev, { x: 0, y: 130, w: W, h: 280 }, { size: 14, labelW: 44, pad: 70, laneH: 26 }) };
  }
  function buildScatter(p, ctx, P) {
    const n = P.n, r = S.mulberry32(ctx.seed || 1), order = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
    let at = 0; const groups = P.groups.map((c) => order.slice(at, (at += c)));
    return { kind: 'scatter', L: [S.scatter(n, BOX, 7), S.rows(groups, BOX, { labels: P.names, groupGap: 16 }), S.grid(n, 0, BOX)], flag: new Set(groups[groups.length - 1]) };
  }

  /* ------- draw ------- */
  function drawThousand(p, t, st, P, T) {
    const { L, k } = stage(st.L, [0, 2, 3.6, 5.2, 6.8, 8.2, 9.8, 12], t, [{ stagger: 0.5, by: 'x', arc: 40 }, { stagger: 0.5, by: 'y', arc: -30 }, { stagger: 0.4, by: 'x', arc: 0 }]);
    const hl = S.highlight(L, (m) => st.flag.has(m.i) && t > 10.4);
    head(p, T, st.names[k], P.n, 'one set, four structures');
    marks(p, hl, T, { rotate: true });
    if (k === 3 && t >= 9.8) { const a = seg(t, 9.8, 10.6); st.L[3].groups.forEach((g) => { label(p, T, g.label || '', g.cx, g.y + g.h + 18, { align: p.CENTER, a }); label(p, T, fmt(g.n), g.cx, g.y + g.h + 34, { align: p.CENTER, a, fill: g.g === st.L[3].groups.length - 1 ? T.color.accent2 : T.color.ink, size: 12 }); }); }
  }
  function drawTree(p, t, st, P, T) {
    const { GR, TR, path } = st, c = p.drawingContext;
    const u = seg(t, 2, 5), { L } = { L: S.transition(GR, TR, u, { stagger: 0.6, by: 'y', arc: 36 }) };
    const reveal = seg(t, 6, 9) * (st.bd + 0.999), eA = seg(t, 4.4, 5.8);
    c.save(); c.strokeStyle = T.color.line; c.lineWidth = 1; c.globalAlpha = eA;
    TR.edges.forEach((e) => { c.beginPath(); c.moveTo(e.x1, e.y1); c.lineTo(e.x2, e.y2); c.stroke(); });
    c.strokeStyle = T.color.accent2; c.lineWidth = 2.2;
    TR.edges.forEach((e) => { if (path.has(e.to) && path.get(e.to) <= reveal) { c.globalAlpha = 1; c.beginPath(); c.moveTo(e.x1, e.y1); c.lineTo(e.x2, e.y2); c.stroke(); } });
    c.restore();
    head(p, T, u < 0.5 ? 'GRID' : 'TREE', P.n, 'tidy layout, parents centred');
    marks(p, S.highlight(L, (m) => path.has(m.i) && path.get(m.i) <= reveal && t > 6), T, { alpha: 0.9 });
    label(p, T, 'depth ' + TR.depth, 900, 74, { align: p.RIGHT, a: eA });
  }
  function drawTimeline(p, t, st, P, T) {
    const { TL, W } = st, c = p.drawingContext, k = smoothstep(seg(t, 0, DUR)), z = 1.3 - 0.3 * smoothstep(seg(t, 0, DUR));
    const camX = 480 + k * (W - 960), camY = 270;
    c.save(); p.translate(480, 270); p.scale(z); p.translate(-camX, -camY + 40 * (1 - k));
    const ax = TL.axis; c.strokeStyle = T.color.line; c.lineWidth = 1.5; c.beginPath(); c.moveTo(ax.x1, ax.y); c.lineTo(ax.x2, ax.y); c.stroke();
    const edge = camX + 480 / z + 40; let shown = 0;
    TL.items.forEach((m) => {
      const a = seg(edge - m.x, 0, 90); if (a <= 0) return; shown++;
      c.globalAlpha = a; c.strokeStyle = T.color.line; c.beginPath(); c.moveTo(m.stem.x1, m.stem.y1); c.lineTo(m.stem.x2, m.stem.y2); c.stroke();
      const last = m.i === TL.items.length - 1; c.fillStyle = last ? T.color.accent : T.color.ink; c.fillRect(m.x - m.w / 2, m.y - m.h / 2, m.w, m.h);
      label(p, T, m.label, m.x, m.ly + (m.side === 'up' ? 0 : 8), { align: p.CENTER, size: 11, fill: T.color.ink, a });
    });
    c.restore();
    head(p, T, 'TIMELINE', TL.n, 'ken-burns pan · ' + shown + ' in view of the sweep');
  }
  const smoothstep = (u) => u * u * (3 - 2 * u);
  function drawScatter(p, t, st, P, T) {
    const { L, k } = stage(st.L, [0, 2, 3.4, 5, 6.4, 12], t, [{ stagger: 0.5, by: 'index' }, { stagger: 0.5, by: 'x', arc: 24 }]);
    const names = ['SCATTER', 'ROWS', 'GRID'];
    marks(p, S.highlight(L, (m) => st.flag.has(m.i) && t > 4), T, {});
    head(p, T, names[k], P.n, 'seeded blue noise to bands to cells');
    if (k === 1 && t >= 3.4) { const a = seg(t, 3.4, 4.2); st.L[1].groups.forEach((g) => { label(p, T, (g.label || '') + ' ' + g.n, g.x, g.y - 4, { a, size: 11 }); }); }
  }

  const base = { n: 1000, groups: [412, 288, 164, 96, 40], names: ['A', 'B', 'C', 'D', 'FLAGGED'], world: 1700 };
  ARSENAL.patterns['structures-demo'] = {
    id: 'structures-demo', atlas: ['derived-geometry', 'resolution-independence', 'shape-2d-primitives', 'triangle-subdivision'], renderer: 'p2d', dur: DUR,
    params: Object.assign({ mode: 'thousand' }, base),
    variants: [
      { name: 'thousand', params: { mode: 'thousand', n: 1000 } },
      { name: 'tree60', params: { mode: 'tree', n: 60 } },
      { name: 'timeline24', params: { mode: 'timeline', n: 24 } },
      { name: 'scatter-rows', params: { mode: 'scatter', n: 500, groups: [200, 140, 100, 60], names: ['north', 'south', 'east', 'west'] } },
    ],
    setup(p, ctx, P) { P = Object.assign({}, base, P); const f = { thousand: buildThousand, tree: buildTree, timeline: buildTimeline, scatter: buildScatter }[P.mode]; return f(p, ctx, P); },
    draw(p, t, st, P, T) {
      P = Object.assign({}, base, P); p.background(T.color.bg);
      ({ thousand: drawThousand, tree: drawTree, timeline: drawTimeline, scatter: drawScatter })[P.mode](p, t, st, P, T);
    },
  };
})();
