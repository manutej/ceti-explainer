/* materials-demo: ONE scene (10x10 grid of marks, three bars, one arrow, one labelled underline) drawn by whichever
   ARSENAL.materials[params.material] is named. The six variants are the six materials; nothing else changes.
   Needs ../../materials/drawn/materials.js loaded first. */
window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} };
(function () {
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const seg = (t, a, b) => clamp((t - a) / (b - a));
  const ease = u => 1 - Math.pow(1 - u, 3);
  ARSENAL.patterns['materials-demo'] = {
    id: 'materials-demo', atlas: ['p5-scribble', 'rough-js', 'p5-grain', 'p5-brush', 'shape-attributes'], renderer: 'p2d',
    params: { material: 'ink', dur: 4 },
    variants: ['ink', 'pencil', 'stitch', 'chalk', 'marker', 'blueprint'].map(m => ({ name: m, params: { material: m } })),
    setup(p, ctx, params) {
      const marks = [];   // grid cells: 10x10, kind cycles dot / rect / line by (row+col)
      for (let j = 0; j < 10; j++) for (let i = 0; i < 10; i++) {
        const n = j * 10 + i, k = (i + j) % 3, cx = 70 + i * 40, cy = 80 + j * 40;
        const kind = k === 0 ? 'dot' : k === 1 ? 'rect' : 'line', role = i === j ? 'accent' : (i + j === 9 ? 'accent2' : 'ink');
        const g = kind === 'dot' ? [cx, cy, 14, 14] : kind === 'rect' ? [cx - 10, cy - 10, 20, 20] : [cx - 10, cy + 8, 20, -16];
        marks.push({ kind, g, role, i: n, t0: n * 0.014 });
      }
      const bars = [[540, 96, 330, 'accent', 'accent'], [540, 150, 215, 'ink', 'ink'], [540, 204, 120, 'muted', 'muted']].map((b, i) => ({ g: [b[0], b[1], b[2], 28], role: b[3], i: 200 + i, t0: 1.1 + i * 0.3 }));
      return { seed: ctx.seed, marks, bars, arrow: { g: [540, 392, 330, -46], role: 'accent2', i: 300, t0: 2.2 }, under: { g: [540, 310, 300, 18], role: 'accent', i: 301, t0: 2.8, text: '100 marks, 3 bars' } };
    },
    draw(p, t, S, params, tk) {
      const M = ARSENAL.materials[params.material], c = p.drawingContext;
      c.save(); c.setTransform(c.getTransform()); c.fillStyle = tk.color.bg; c.fillRect(0, 0, 960, 540); c.restore();
      M.texture(p, { x: 0, y: 0, w: 960, h: 540, seed: S.seed }, tk);
      const st = (o, extra) => Object.assign({ seed: S.seed, i: o.i, role: o.role, u: 0 }, extra);
      for (const m of S.marks) { const u = ease(seg(t, m.t0, m.t0 + 0.9)); if (u > 0) M.mark(p, m.kind, ...m.g, st(m, { u }), tk); }
      for (const b of S.bars) { const u = ease(seg(t, b.t0, b.t0 + 0.9)); if (u > 0) M.mark(p, 'bar', ...b.g, st(b, { u }), tk); }
      { const a = S.arrow, u = ease(seg(t, a.t0, a.t0 + 0.8)); if (u > 0) M.mark(p, 'arrow', ...a.g, st(a, { u }), tk); }
      { const a = S.under, u = ease(seg(t, a.t0, a.t0 + 0.8)); if (u > 0) M.mark(p, 'label-underline', ...a.g, st(a, { u, text: a.text }), tk); }
    },
  };
})();
