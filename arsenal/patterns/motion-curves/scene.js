/* arsenal/patterns/motion-curves/scene.js · the demo scene only (not shipped in a film). Loaded after pattern.js; attaches draw().
   lanes: the same box, same travel, moved by each token at its own designed duration; frame ghosts at 30 fps; position vs time beside it.
   grid:  stagger.linear, stagger.centre and stagger.grid (row/col distance) on spring-hero rises (position overshoots; opacity rides emph, never overshoots). Pure of t. */
(function () {
'use strict';
const P = ARSENAL.patterns['motion-curves'], L = P.lib, W = 960, H = 540, FPS = 30;
const font = (tk, role, size, w) => (w || tk.type[role].weight) + ' ' + size + 'px "' + tk.type[role].family + '"';
const txt = (ctx, s, x, y, f, col, al) => { ctx.font = f; ctx.fillStyle = col; ctx.textAlign = al || 'left'; ctx.textBaseline = 'alphabetic'; ctx.fillText(s, x, y); };
const pct = (x) => (x * 100).toFixed(1) + ' %';

function lanes(ctx, t, params, tk) {
  const c = tk.color, names = params.tokens, n = names.length, top = 84, rowH = Math.min(86, (H - top - 56) / n);
  const X0 = 330, X1 = 470, PX0 = 540, PX1 = 930, tw0 = -0.2, tw1 = 2.2, v0 = -0.12, v1 = 1.14;
  for (let i = 0; i < n; i++) {
    const f = L.ease(names[i]), dur = f.dur || 1, y = top + i * rowH, mv = L.move(t, params.t0, dur, f), base = !f.id;
    const yy = (v, h) => y + 6 + (h - 12) * (1 - (v - v0) / (v1 - v0)), h = rowH - 4;
    txt(ctx, names[i], 24, y + 24, font(tk, 'mono', 13, 700), base ? c.muted : c.ink);
    txt(ctx, base ? 'baseline: every film today' : 'dur ' + dur.toFixed(2) + ' s · over ' + pct(f.over), 24, y + 42, font(tk, 'mono', 11), c.muted);
    if (!base) txt(ctx, '2 % band ' + f.s2.toFixed(2) + ' s', 24, y + 58, font(tk, 'mono', 11), c.muted);
    txt(ctx, mv.settled ? 'settled' : mv.u > 0 ? 'moving' : 'at rest', 24, y + (base ? 58 : 74), font(tk, 'mono', 11, 700), mv.settled ? c.accent : c.muted);
    // track: start tick, target tick, frame ghosts (30 fps), the box
    ctx.strokeStyle = c.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X0 - 14, y + 34.5); ctx.lineTo(X1 + 14, y + 34.5); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(X1 + 0.5, y + 20); ctx.lineTo(X1 + 0.5, y + 50); ctx.stroke();
    for (let k = 0; k <= Math.ceil(dur * FPS); k++) { const tg = params.t0 + k / FPS; if (tg > t) break; ctx.globalAlpha = 0.16; ctx.fillStyle = c.accent; ctx.fillRect(X0 + (X1 - X0) * L.move(tg, params.t0, dur, f).x - 5, y + 29, 10, 10); }
    ctx.globalAlpha = 1; ctx.fillStyle = base ? c.muted : c.accent; ctx.fillRect(X0 + (X1 - X0) * mv.x - 9, y + 25, 18, 18);
    // plot: position vs time, target and 2 % band, full curve, the part played, playhead
    ctx.fillStyle = c.panel; ctx.fillRect(PX0, y + 2, PX1 - PX0, h - 2);
    const tx = (s) => PX0 + (PX1 - PX0) * (s - tw0) / (tw1 - tw0);
    ctx.fillStyle = c.line; ctx.globalAlpha = 0.5; ctx.fillRect(PX0, yy(1.02, h), PX1 - PX0, yy(0.98, h) - yy(1.02, h)); ctx.globalAlpha = 1;
    ctx.strokeStyle = c.line; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(PX0, yy(1, h)); ctx.lineTo(PX1, yy(1, h)); ctx.moveTo(PX0, yy(0, h)); ctx.lineTo(PX1, yy(0, h)); ctx.stroke(); ctx.setLineDash([]);
    const curve = (upTo, col, lw) => { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath(); let st = false;
      for (let s = tw0; s <= upTo + 1e-9; s += 1 / 60) { const x = tx(s), v = L.move(params.t0 + s, params.t0, dur, f).x; if (!st) { ctx.moveTo(x, yy(v, h)); st = true; } else ctx.lineTo(x, yy(v, h)); } ctx.stroke(); };
    curve(tw1, c.muted, 1.25); const rel = Math.min(t - params.t0, tw1); if (rel > tw0) curve(rel, c.accent, 2.25);
    if (rel > tw0 && rel <= tw1) { ctx.strokeStyle = c.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(tx(rel) + 0.5, y + 2); ctx.lineTo(tx(rel) + 0.5, y + h); ctx.stroke();
      ctx.fillStyle = c.accent; ctx.beginPath(); ctx.arc(tx(rel), yy(mv.x, h), 3.5, 0, 6.2832); ctx.fill(); }
  }
  txt(ctx, '0 s', 540, top + n * rowH + 12, font(tk, 'mono', 11), c.muted); txt(ctx, '2 s after the move starts', 930, top + n * rowH + 12, font(tk, 'mono', 11), c.muted, 'right');
}

function grid(ctx, t, params, tk) {
  const c = tk.color, hero = L.tokens['spring-hero'], R = params.rows, C = params.cols, gap = params.gap, t0 = params.t0;
  const cell = (x, y, s, off, label) => {                                   // a mark rises 16 px on spring-hero; its opacity rides emph (never overshoots)
    const m = L.move(t, t0 + off, hero.dur, hero), a = L.move(t, t0 + off, 0.4, 'emph').x;
    ctx.globalAlpha = Math.max(0, Math.min(1, a)); ctx.fillStyle = label ? c.accent2 : c.accent; ctx.fillRect(x, y + 16 * (1 - m.x), s, s); ctx.globalAlpha = 1; };
  const strip = (y, name, o, note) => { txt(ctx, name, 24, y + 20, font(tk, 'mono', 12, 700), c.ink); txt(ctx, note, 24, y + 36, font(tk, 'mono', 11), c.muted);
    for (let i = 0; i < o.length; i++) cell(214 + i * 46, y + 4, 34, o[i]); };
  const lin = L.stagger.linear(C, gap), ctr = L.stagger.centre(C, gap);
  strip(78, 'linear', lin, 'span ' + lin.span.toFixed(2) + ' s · gap ' + (lin.gap * 1000).toFixed(0) + ' ms');
  strip(138, 'centre-out', ctr, 'span ' + ctr.span.toFixed(2) + ' s');
  const g = L.stagger.grid(R, C, gap, { from: params.from, metric: params.metric });
  txt(ctx, 'grid · ' + params.metric, 24, 214, font(tk, 'mono', 12, 700), c.ink); txt(ctx, 'from ' + (Array.isArray(params.from) ? params.from.join(',') : params.from), 24, 230, font(tk, 'mono', 11), c.muted);
  txt(ctx, 'span ' + g.span.toFixed(2) + ' s · gap ' + (g.gap * 1000).toFixed(0) + ' ms', 24, 246, font(tk, 'mono', 11), c.muted);
  for (let r = 0; r < R; r++) for (let q = 0; q < C; q++) cell(214 + q * 46, 200 + r * 40, 34, g[r * C + q]);
  txt(ctx, 'wave <= 0.8 s; entrances only, tracked marks never stagger', 214, 200 + R * 40 + 22, font(tk, 'mono', 11), c.muted);
}

P.draw = function (p, t, st, params, tk) {
  p.resetMatrix(); p.background(tk.color.bg); const ctx = p.drawingContext;
  txt(ctx, 'motion-curves', 24, 36, font(tk, 'disp', 26), tk.color.ink);
  txt(ctx, params.mode === 'grid' ? 'stagger: one curve, offset in time' : 'same box, same travel; ghosts every frame at 30 fps; position vs time beside it', 24, 58, font(tk, 'body', 13), tk.color.muted);
  if (params.mode === 'grid') grid(ctx, t, params, tk); else lanes(ctx, t, params, tk);
  txt(ctx, 'overshoot on marks only: never on numbers, text, colour or opacity', 936, 526, font(tk, 'mono', 11), tk.color.muted, 'right');
};
})();
