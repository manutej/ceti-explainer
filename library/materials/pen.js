/* ════════════════════════════════════════════════════════════════════════════════════════════════════════════
   Material · PEN — the field notebook (dip pen, iron-gall ink, coloured pencil on green-grey graph paper).
   @kernel margin.glyphs.js
   @kernel margin.kit.js
   Kernel: archive/chromes/margin/margin.kit.js + margin.glyphs.js (vendored verbatim): single-line glyphs (EMS Allure /
   EMS Felix, OFL), hand speed by the two-thirds power law, a Dynadraw spring-mass nib (≈26 Hz, ζ 0.72) with
   pressure-shaded downstrokes and a depleting reservoir, Washburn bleed r = r∞·√(age/τ), iron-gall oxidation from
   blue to blue-black. Credit: E · The Margin team (margin/NOTES.md). The kernel's Writer simulates every row once
   (cached by its geometry); this adapter lays the simulated samples down up to the run's progress.
   Mark rule: one cursive line of loops = one run; one loop = one step; a slip = the pen lifts mid-loop and a
   peach-pencil × marks the address; a caught slip = a doubled loop (the retry) ringed in sage; numbers and words are
   handwritten (results in ink, the viewer's marks in graphite).
   ════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';
  const AM = root.AM;
  const MG = () => (typeof Margin !== 'undefined' ? Margin : root.Margin);   // the kernel declares a script-level const
  const H0 = 10, DX = 16, S5 = 5;                       // reference row height and step pitch (unit-local px)
  const PEN = { sage: '#4A7A43', peach: '#C5552A', copper: '#B27C2C', slate: '#46698F', graphite: '#3E4247', ink: '#18213A', wet: '#2D52B4', bleed: '#4F6FC4' };
  const ROLE = { title: 15, head: 12, text: 8.4, num: 8.6, note: 6.6, sketch: 8 };   // x-heights (px) per role
  const _rows = new Map(), _txt = new Map();

  /** one run's cursive row, simulated once by the kernel's Writer (spring nib, power law, reservoir) */
  function rowStroke(k, f, caught, seed) {
    const key = k + '|' + f + '|' + caught.join(',') + '|' + (seed % 7);
    let s = _rows.get(key); if (s) return s;
    const K = MG(), retries = new Set(caught);
    const R = K.G.row({ x0: 2, yb: H0 * 0.86, dx: DX, a: 3.3, seed: 11 + (seed % 7), k, from: 0, to: f >= 0 ? f : k, stumbleAt: f >= 0 ? f : null, retries, rs: DX * 0.45 });
    const W = K.Writer(5 + (seed % 7)); W.marks('ink', [R.path], 6.5, { t0: 0 });
    const st = W.build().strokes[0];
    s = { st, xs: Float32Array.from({ length: st.n }, (_, i) => st.pts[i * S5]), pos: R.pos }; _rows.set(key, s); return s;
  }
  function paper(k) {
    return AM.canvas('pen-paper', k).cv.__built ? AM.canvas('pen-paper', k) : (function () {
      const o = AM.canvas('pen-paper', k), c = o.c, U = root.Atelier.U, W = o.W, H = o.H;
      const img = c.createImageData(W, H), D = img.data, base = U.color.hex2rgb(MG().PAL.paper);
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const px = x / k, py = y / k, i = (y * W + x) * 4;
        const mot = (U.noise2(3, px / 150, py / 150) - 0.5) * 0.04 + (U.noise2(4, px / 30, py / 30) - 0.5) * 0.02 + (U.h(9, x, y) - 0.5) * 0.025;
        const lamp = 1.035 - 0.09 * Math.hypot(px / 960 - 0.12, (py / 540 - 0.05) * 0.8);
        const L = (1 + mot) * lamp; D[i] = base[0] * 255 * L * 1.006; D[i + 1] = base[1] * 255 * L; D[i + 2] = base[2] * 255 * L * 0.985; D[i + 3] = 255;
      }
      c.putImageData(img, 0, 0); c.setTransform(k, 0, 0, k, 0, 0);
      for (let i = 0; i < 2200; i++) {   // paper fibres along the kernel's fibre direction
        const x = U.h(1, i, 21) * 960, y = U.h(1, i, 22) * 540, a = 0.18 + (U.fbm(9108, 2, x / 70, y / 70) - 0.5) * 2.2, L = 3 + 12 * U.h(1, i, 24) ** 2;
        c.strokeStyle = U.h(1, i, 26) < 0.6 ? 'rgba(246,250,242,0.5)' : 'rgba(120,140,128,0.2)'; c.lineWidth = 0.5;
        c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); c.stroke();
      }
      c.strokeStyle = MG().PAL.print;
      for (let x = 0; x <= 960; x += 8) { const maj = x % 40 === 0; c.globalAlpha = maj ? 0.4 : 0.18; c.lineWidth = maj ? 0.75 : 0.45; c.beginPath(); c.moveTo(x + 0.25, 0); c.lineTo(x + 0.25, 540); c.stroke(); }
      for (let y = 0; y <= 540; y += 8) { const maj = y % 40 === 0; c.globalAlpha = maj ? 0.4 : 0.18; c.lineWidth = maj ? 0.75 : 0.45; c.beginPath(); c.moveTo(0, y + 0.25); c.lineTo(960, y + 0.25); c.stroke(); }
      c.globalAlpha = 1; const g = c.createLinearGradient(0, 0, 60, 0); g.addColorStop(0, 'rgba(28,44,38,0.5)'); g.addColorStop(0.3, 'rgba(28,44,38,0.12)'); g.addColorStop(1, 'rgba(28,44,38,0)'); c.fillStyle = g; c.fillRect(0, 0, 60, 540);
      c.setTransform(1, 0, 0, 1, 0, 0); o.cv.__built = true; return o;
    })();
  }
  /** ink: Washburn halo, then the core chunk by chunk (density from the reservoir, oxidation by age) */
  function drawRow(c, R, m, age, alpha) {
    const st = R.st, P = st.pts, U = root.Atelier.U; if (m < 2) return;
    const outline = (a, b, extra) => { c.beginPath(); for (let i = a; i <= b; i++) { const r = P[i * S5 + 2] / 2 + extra; c.lineTo(P[i * S5] + st.nx[i] * r, P[i * S5 + 1] + st.ny[i] * r); } for (let i = b; i >= a; i--) { const r = P[i * S5 + 2] / 2 + extra; c.lineTo(P[i * S5] - st.nx[i] * r, P[i * S5 + 1] - st.ny[i] * r); } c.closePath(); };
    const g = Math.sqrt(U.clamp(age / 2.5));               // r(t) = r∞·√(age/τ)
    if (g > 0) { c.globalAlpha = 0.16 * alpha; c.fillStyle = PEN.bleed; outline(0, m - 1, st.rInf * g); c.fill(); }
    for (let a = 0; a < m - 1; a += 6) {
      const b = Math.min(m - 1, a + 7), fresh = U.clamp((m - b) / 60); let dn = 0; for (let i = a; i <= b; i++) dn += P[i * S5 + 4]; dn /= (b - a + 1);
      c.globalAlpha = alpha * (0.55 + 0.45 * dn); c.fillStyle = U.color.mix(PEN.wet, PEN.ink, Math.pow(Math.min(1, fresh + age / 3), 0.8));
      outline(a, b, 0); c.fill();
    }
  }
  function pencil(c, pts, col, w, a) { c.globalAlpha = a; c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); for (let i = 0; i < pts.length; i += 2) (i ? c.lineTo(pts[i], pts[i + 1]) : c.moveTo(pts[i], pts[i + 1])); c.stroke(); c.globalAlpha = a * 0.5; c.lineWidth = w * 0.5; c.beginPath(); for (let i = 0; i < pts.length; i += 2) (i ? c.lineTo(pts[i] + 0.3, pts[i + 1] + 0.3) : c.moveTo(pts[i] + 0.3, pts[i + 1] + 0.3)); c.stroke(); }
  const tf = (S, o) => (o.screen ? (q => q) : (q => [AM.cam.X(S.cam, q[0]), AM.cam.Y(S.cam, q[1])]));
  const flat = pts => pts.flat();

  const M = AM.material({
    id: 'pen', title: 'Pen — the field notebook', source: ['archive/chromes/margin/margin.kit.js', 'archive/chromes/margin/margin.glyphs.js', 'archive/chromes/margin/NOTES.md'],
    markRule: { unit: 'one cursive line of loops = one run', step: 'one loop = one step', address: 'the pen lifts mid-loop; a peach-pencil × at the address', save: 'a doubled loop (the retry) ringed in sage pencil', cost: 'a sage pencil tick per loop written twice' },
    nouns: { unit: 'line', units: 'lines', step: 'loop', steps: 'loops', edge: 'ragged margin of the lines', check: 'check' },
    axis: 'x', cell: { along: 1.6, across: 1, maxAcross: 22 }, nRange: [1, 100], ground: '#DCE4D6', fonts: [],
    setup() {},
    begin(p, ctx, t, cam) {
      const k = AM.renderScale(ctx), P = paper(k), F = AM.canvas('pen-frame', k), c = F.c;
      c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.drawImage(P.cv, 0, 0);
      c.setTransform(k, 0, 0, k, 0, 0);
      return { F, c, k, cam, t };
    },
    units(S, items) {
      const c = S.c; c.save(); c.globalCompositeOperation = 'multiply';
      for (const it of items) {
        const [sx, sy, sw, sh] = AM.cam.rect(S.cam, it.x, it.y, it.w, it.h); if (sy > 545 || sy + sh < -5 || sw < 1) continue;
        const R = rowStroke(it.k, it.failAt, it.caught, it.r), shift = it.caught.filter(j => j < it.done).length * DX * 0.45;
        const xl = it.failAt >= 0 ? 1e9 : 2 + (it.done + 0.05) * DX + shift;
        let m = 0; while (m < R.st.n && R.xs[m] <= xl) m++;
        c.save(); c.transform(sw / ((it.k + 0.6) * DX), 0, 0, sh / H0, sx, sy);
        drawRow(c, R, m, it.failAt >= 0 ? 3 : Math.max(0, it.done - 1.5), it.alpha);
        c.restore();
        if (it.failAt >= 0 && sh >= 3) { const x = sx + sw * (it.failAt + 0.75) / (it.k + 0.6), y = sy + sh * 0.55, s = Math.min(7, sh * 0.6); c.globalCompositeOperation = 'source-over'; pencil(c, [x - s / 2, y - s / 2, x + s / 2, y + s / 2], PEN.peach, 1.1, it.alpha * 0.9); pencil(c, [x + s / 2, y - s / 2, x - s / 2, y + s / 2], PEN.peach, 1.1, it.alpha * 0.9); c.globalCompositeOperation = 'multiply'; }
        if (it.caught.length && sh >= 3) for (const j of it.caught) { const x = sx + sw * (j + 0.95) / (it.k + 0.6), y = sy + sh * 0.5; c.globalCompositeOperation = 'source-over'; c.globalAlpha = it.alpha * 0.85; c.strokeStyle = PEN.sage; c.lineWidth = 1; c.beginPath(); c.ellipse(x, y, Math.max(2.5, sw / it.k * 0.7), Math.max(2.2, sh * 0.45), 0, 0, 6.2832); c.stroke(); c.globalCompositeOperation = 'multiply'; }
      }
      c.restore();
    },
    anchor(rect, j, k) { return [rect.x + rect.w * (j + 0.75) / (k + 0.6), rect.y + rect.h * 0.55]; },
    mark(S, kind, x, y, o = {}) {
      const [X, Y] = tf(S, o)([x, y]), a = o.alpha ?? 1, c = S.c, r = o.r || 6; if (a <= 0.003) return;
      c.save();
      if (kind === 'address') pencil(c, MG().G.ring(X, Y, r, r * 0.8, 3)[0], PEN.peach, 1.4, a);
      else if (kind === 'save') pencil(c, MG().G.ring(X, Y, r, r * 0.75, 5)[0], PEN.sage, 1.4, a);
      else if (kind === 'cost') pencil(c, MG().G.tick(X - 2, Y + 2, 4, 3)[0], PEN.sage, 0.9, a);
      else if (kind === 'guess') { pencil(c, [X - 6, Y - 9, X + 1, Y + 1], PEN.graphite, 1.6, a); pencil(c, [X + 1, Y + 1, X + 7, Y - 12], PEN.graphite, 1.6, a); }
      else if (kind === 'truth' || kind === 'expected') pencil(c, [X + 2, Y - 6, X + 10, Y, X + 2, Y + 6], PEN.copper, 1.5, a);
      else if (kind === 'realised') pencil(c, [X + 2, Y - 6, X + 10, Y, X + 2, Y + 6, X + 2, Y - 6], PEN.ink, 1.5, a);
      else if (kind === 'tick') pencil(c, [X, Y - 7, X + 1.5, Y + 7], PEN.graphite, 1.5, a);
      c.restore();
    },
    line(S, pts, role, o = {}) {
      const P = pts.map(tf(S, o)), a = o.alpha ?? 1, c = S.c; if (a <= 0.003 || P.length < 2) return;
      c.save();
      if (role === 'exact') { for (const d of MG().G.dashes(flat(P), 5, 4)) pencil(c, d, PEN.copper, 1.5, a); }
      else if (role === 'rule') pencil(c, flat(P), PEN.graphite, o.w ? Math.min(1.6, o.w * 0.4) : 1.1, a * 0.85);
      else if (role === 'guess') pencil(c, flat(P), PEN.graphite, 1.8, a);
      else if (role === 'gap') pencil(c, flat(P), PEN.peach, 2.2, a);
      else if (role === 'ghost') { for (const d of MG().G.dashes(flat(P), 3, 4)) pencil(c, d, PEN.graphite, 0.9, a * 0.6); }
      else pencil(c, flat(P), PEN.graphite, 0.8, a * 0.6);
      c.restore();
    },
    area(S, top, bot, role, o = {}) {
      const T = tf(S, o), c = S.c, a = o.alpha ?? 1; c.save(); c.globalAlpha = a * 0.28; c.fillStyle = PEN.copper;   // pencil shading
      c.beginPath(); top.forEach((q, i) => { const P = T(q); i ? c.lineTo(P[0], P[1]) : c.moveTo(P[0], P[1]); }); for (let i = bot.length - 1; i >= 0; i--) { const P = T(bot[i]); c.lineTo(P[0], P[1]); } c.closePath(); c.fill(); c.restore();
    },
    text(S, str, x, y, o = {}) { write(S, str, x, y, o); },
    num(S, n, x, y, o = {}) { write(S, o.str, x, y, Object.assign({ role: 'num' }, o)); },
    end(p, S) { p.drawingContext.drawImage(S.F.cv, 0, 0, 960, 540); },
    voice: { step: { kind: 'tick', freq: 5200, gain: 0.3 }, fail: { kind: 'clack', freq: 220, gain: 0.35 }, save: { kind: 'click', freq: 1300, gain: 0.45 },
      reveal: { kind: 'tone', freq: 349, gain: 0.4, dur: 0.9 }, commit: { kind: 'click', freq: 880, gain: 0.35 }, cost: { kind: 'tick', freq: 3000, gain: 0.25 } },
  });
  /** handwriting: hand A (author, ink) for results and words; hand B (graphite) for notes and the viewer */
  function write(S, str, x, y, o) {
    if (!str) return;
    const role = o.role || 'text', a = o.alpha ?? 1; if (a <= 0.003) return;
    const xh = o.size ? o.size * 0.5 : ROLE[role] || ROLE.text, hand = role === 'note' || role === 'sketch' ? 'B' : 'A', K = MG();
    const s = String(str).replace(/·/g, ',').replace(/[‘’]/g, "'");
    const w = K.plainWidth(hand, s, xh), [X0, Y] = tf(S, o)([x, y]);
    const X = o.align === 'center' ? X0 - w / 2 : o.align === 'right' ? X0 - w : X0;
    const key = hand + '|' + s + '|' + xh.toFixed(2);
    let L = _txt.get(key); if (!L) { L = K.text(hand, s, 0, 0, xh, { seed: s.length * 7 + xh * 3 }); _txt.set(key, L); }
    const col = o.color === 'peach' ? PEN.peach : o.color === 'sage' ? PEN.sage : o.color === 'copper' || role === 'sketch' ? PEN.copper : hand === 'B' ? PEN.graphite : PEN.ink;
    const c = S.c; c.save(); c.translate(X, Y); c.globalAlpha = a; c.strokeStyle = col; c.lineWidth = Math.max(0.9, xh * (hand === 'A' ? 0.16 : 0.12)); c.lineCap = 'round'; c.lineJoin = 'round';
    c.beginPath(); for (const pa of L.paths) { c.moveTo(pa[0], pa[1]); for (let i = 2; i < pa.length; i += 2) c.lineTo(pa[i], pa[i + 1]); } c.stroke(); c.restore();
  }
})(typeof window !== 'undefined' ? window : globalThis);
