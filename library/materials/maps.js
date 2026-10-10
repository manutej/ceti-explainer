/* ════════════════════════════════════════════════════════════════════════════════════════════════════════════
   Material · MAPS — marbling (ebru) as exact, composable, invertible maps.
   Kernel: chromes/marbling/marbling.kit.js (vendored verbatim): Jaffer & Lu's closed-form maps — drop
   x' = c + (x−c)·√(1 + r²/|x−c|²), comb x' = x + z·φ(q)·M with q invariant (φ an exact sum of tine kernels) — and
   MK.pull, which carries every pixel back through the inverse of every operation, newest first. No simulation:
   any frame is exact at any t. Credit: B · Marbling team (marbling/NOTES.md).
   Mark rule: a tray strip = one run; each comb pass = one step (the pattern grows pass by pass along the strip);
   a peach stray drop lands at the failing pass (the address) — while the run is still being worked (lost), later
   passes drag it, so how combed it is tells you when it fell; a caught slip = the skimmer lifted the drop (sage);
   pigment stripes = the work. Ground: size-water grey-green (not cream; no hairlines).
   ════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';
  const AM = root.AM;
  const K = () => (typeof MK !== 'undefined' ? MK : root.MK);   // the kernel declares a script-level const
  const PIG = [[142, 106, 78], [63, 83, 103], [169, 179, 162], [232, 228, 214], [116, 128, 92]];
  const WATER = [210, 212, 202], STRAY = [216, 120, 74];
  const ROLE = { title: ['"IM Fell English"', 400, 32], head: ['"IM Fell English"', 400, 25], text: ['"Alegreya Sans"', 500, 17], num: ['"DM Mono"', 400, 16], note: ['"Alegreya Sans"', 400, 13], sketch: ['"Alegreya Sans"', 500, 15] };
  const PAL = { ink: '#2C3440', dim: '#5F6A66', copper: '#9C6516', sage: '#3F7046', peach: '#B8432A', slate: '#36597D', zinc: '#5D676E' };
  const _ops = new Map();
  /** the op list for one tray: one comb per pass (alternating, tines varying), the stray inserted at its pass */
  function opsFor(k, f, Lx) {
    const key = k + '|' + f + '|' + Lx.toFixed(1); let o = _ops.get(key); if (o) return o; if (_ops.size > 4000) _ops.clear();
    const MK = K(), ops = [], tag = [];
    for (let j = 0; j < k; j++) {
      if (j === f) { ops.push(MK.drop(((j + 0.5) / k) * Lx, 0.5, 0.32, 'stray')); tag.push(j); }
      ops.push(MK.comb(0, (j % 2 ? 1 : -1) * 0.22, 0.5 / (1 + (j % 3)), 0.1, 0.13 * j)); tag.push(j);
    }
    o = { ops, tag, S: new Float32Array(ops.length).fill(1) }; _ops.set(key, o); return o;
  }
  const tf = (S, o) => (o.screen ? (q => q) : (q => [AM.cam.X(S.cam, q[0]), AM.cam.Y(S.cam, q[1])]));
  const M = AM.material({
    id: 'maps', title: 'Maps — marbling on size-water', source: ['chromes/marbling/marbling.kit.js', 'chromes/marbling/NOTES.md'],
    markRule: { unit: 'one tray strip = one run', step: 'one comb pass = one step', address: 'a peach stray drop at its pass, combed by every later pass', save: 'the sage skimmer lifted the drop', cost: 'a sage skim line per pass redone' },
    nouns: { unit: 'tray', units: 'trays', step: 'pass', steps: 'passes', edge: 'edge of the combed pattern', check: 'skimmer' },
    axis: 'x', cell: { along: 0.9, across: 1, maxAcross: 40 }, nRange: [1, 120], ground: '#D2D4CA',
    fonts: [['IM Fell English', 'im-fell-english-latin-400-normal.woff2', 400], ['Alegreya Sans', 'alegreya-sans-latin-400-normal.woff2', 400], ['Alegreya Sans', 'alegreya-sans-latin-500-normal.woff2', 500], ['DM Mono', 'dm-mono-latin-400-normal.woff2', 400]],
    setup() {},
    begin(p, ctx, t, cam) {
      const k = AM.renderScale(ctx), F = AM.canvas('maps-frame', k), c = F.c;
      if (!M._img || M._img.width !== F.W) M._img = c.createImageData(F.W, F.H);
      const D = M._img.data, U = root.Atelier.U;
      if (!M._ground || M._ground.length !== D.length) {   // size-water with a slow mottle, built once per scale
        M._ground = new Uint8ClampedArray(D.length);
        for (let y = 0; y < F.H; y++) for (let x = 0; x < F.W; x++) { const n = (U.fbm(5, 3, x / k / 120, y / k / 90) - 0.5) * 14, i = (y * F.W + x) * 4; M._ground[i] = WATER[0] + n; M._ground[i + 1] = WATER[1] + n; M._ground[i + 2] = WATER[2] + n * 0.8; M._ground[i + 3] = 255; }
      }
      D.set(M._ground);
      return { F, c, k, cam, D, W: F.W, H: F.H, q: [], t };
    },
    units(S, items) {
      const MK = K(), R = { q: 0, px: 0, py: 0, d: -1 }, D = S.D, W = S.W, H = S.H, k = S.k;
      for (const it of items) {
        const [sx, sy, sw, sh] = AM.cam.rect(S.cam, it.x, it.y, it.w, it.h); if (sy > 545 || sy + sh < -5 || sh <= 0.05) continue;
        const ext = (it.failAt >= 0 ? (it.lost ? Math.max(it.failAt + 1, it.rows) : it.failAt + 1) : it.done) / it.k; if (ext <= 0) continue;
        const Lx = Math.max(1, sw / Math.max(sh, 0.5)), O = opsFor(it.k, it.failAt, Lx);
        const x0 = Math.max(0, Math.floor(sx * k)), x1 = Math.min(W, Math.ceil((sx + sw * ext) * k)), y0 = Math.max(0, Math.floor(sy * k)), y1 = Math.min(H, Math.max(y0 + 1, Math.ceil((sy + sh) * k)));
        // the passes made so far act (newest last); a run still being worked keeps dragging its stray
        const passes = it.failAt >= 0 ? (it.lost ? Math.max(it.failAt + 1, it.rows) : it.failAt + 1) : it.done;
        let done = 0; while (done < O.ops.length && O.tag[done] < passes) done++;
        const cov = Math.min(1, sh * k);   // sub-pixel strips blend with the water
        for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
          const ux = ((x + 0.5) / k - sx) / sh, uy = sh * k >= 1 ? ((y + 0.5) / k - sy) / sh : 0.5;
          const d = MK.pull(O.ops, O.S, done, ux, uy, R);
          let c;
          if (d >= 0) c = STRAY;
          else { const band = Math.floor(R.px * 3.2 + 0.4 * Math.sin(R.py * 6.3)), ci = ((band % PIG.length) + PIG.length) % PIG.length, m = 1 + 0.12 * (MK.mottle(R.px, R.py) - 0.5); c = [PIG[ci][0] * m, PIG[ci][1] * m, PIG[ci][2] * m]; }
          const i = (y * W + x) * 4, a = cov * it.alpha; D[i] += (c[0] - D[i]) * a; D[i + 1] += (c[1] - D[i + 1]) * a; D[i + 2] += (c[2] - D[i + 2]) * a;
        }
        if (sh >= 4) for (const j of it.caught) { const xx = sx + sw * (j + 0.5) / it.k; S.q.push(c => { c.strokeStyle = PAL.sage; c.globalAlpha = it.alpha; c.lineWidth = 1.6; c.beginPath(); c.moveTo(xx, sy + 1); c.lineTo(xx, sy + sh - 1); c.stroke(); }); }
      }
    },
    anchor(rect, j, k) { return AM.stepPoint(rect, 'x', j, k); },
    mark(S, kind, x, y, o = {}) {
      S.q.push(c => {
        const [X, Y] = tf(S, o)([x, y]), a = o.alpha ?? 1, r = o.r || 7; if (a <= 0.003) return; c.globalAlpha = a;
        if (kind === 'address') { c.strokeStyle = PAL.peach; c.lineWidth = 1.8; c.beginPath(); c.arc(X, Y, r, 0, 6.2832); c.stroke(); }
        else if (kind === 'save') { c.strokeStyle = PAL.sage; c.lineWidth = 3; c.beginPath(); c.moveTo(X - r, Y + r * 0.8); c.lineTo(X + r, Y - r * 0.8); c.stroke(); }   // the skimmer: a paper strip lifting the drop
        else if (kind === 'cost') { c.strokeStyle = PAL.sage; c.lineWidth = 1; c.beginPath(); c.moveTo(X, Y - 2.5); c.lineTo(X, Y + 2.5); c.stroke(); }
        else if (kind === 'guess') { c.strokeStyle = PAL.ink; c.lineWidth = 2; c.beginPath(); c.moveTo(X - 6, Y - 6); c.lineTo(X + 6, Y + 6); c.moveTo(X + 6, Y - 6); c.lineTo(X - 6, Y + 6); c.stroke(); }
        else if (kind === 'truth' || kind === 'expected' || kind === 'realised') { c.fillStyle = kind === 'realised' ? PAL.ink : PAL.copper; const d = o.dir || 1; c.beginPath(); c.moveTo(X, Y); c.lineTo(X + d * 9, Y - 5); c.lineTo(X + d * 9, Y + 5); c.closePath(); c.fill(); }
        else if (kind === 'tick') { c.fillStyle = PAL.zinc; c.beginPath(); c.arc(X, Y, 3, 0, 6.2832); c.fill(); }
      });
    },
    line(S, pts, role, o = {}) {
      S.q.push(c => {
        const Q = pts.map(tf(S, o)), a = o.alpha ?? 1; if (a <= 0.003 || Q.length < 2) return; c.globalAlpha = a; c.lineCap = 'round';
        c.beginPath(); Q.forEach((q, i) => (i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])));
        if (role === 'exact') { c.strokeStyle = PAL.copper; c.lineWidth = 2; c.setLineDash([7, 4]); }
        else if (role === 'rule') { c.strokeStyle = PAL.zinc; c.lineWidth = o.w ? Math.min(4.5, o.w) : 2.5; }   // the tray rim: 2–4.5 px zinc
        else if (role === 'guess') { c.strokeStyle = PAL.ink; c.lineWidth = 2; }
        else if (role === 'gap') { c.strokeStyle = PAL.peach; c.lineWidth = 3; }
        else if (role === 'ghost') { c.strokeStyle = PAL.dim; c.lineWidth = 1.2; c.setLineDash([3, 3]); }
        else { c.strokeStyle = PAL.dim; c.lineWidth = 1; }
        c.stroke(); c.setLineDash([]);
      });
    },
    area(S, top, bot, role, o = {}) { S.q.push(c => { const T = tf(S, o); c.globalAlpha = (o.alpha ?? 1) * 0.3; c.fillStyle = PAL.copper; c.beginPath(); top.forEach((q, i) => { const P = T(q); i ? c.lineTo(P[0], P[1]) : c.moveTo(P[0], P[1]); }); for (let i = bot.length - 1; i >= 0; i--) { const P = T(bot[i]); c.lineTo(P[0], P[1]); } c.closePath(); c.fill(); }); },
    text(S, str, x, y, o = {}) { S.q.push(c => set(c, S, str, x, y, o)); },
    num(S, n, x, y, o = {}) { S.q.push(c => set(c, S, o.str, x, y, Object.assign({ role: 'num' }, o))); },
    end(p, S) {
      const c = S.c; c.setTransform(1, 0, 0, 1, 0, 0); c.putImageData(M._img, 0, 0); c.setTransform(S.k, 0, 0, S.k, 0, 0);
      for (const f of S.q) { c.save(); f(c); c.restore(); }
      p.drawingContext.drawImage(S.F.cv, 0, 0, 960, 540);
    },
    voice: { step: { kind: 'tick', freq: 1800, gain: 0.3 }, fail: { kind: 'clack', freq: 240, gain: 0.4 }, save: { kind: 'click', freq: 1200, gain: 0.5 },
      reveal: { kind: 'tone', freq: 294, gain: 0.45, dur: 1.2 }, commit: { kind: 'click', freq: 760, gain: 0.4 }, cost: { kind: 'tick', freq: 1400, gain: 0.25 } },
  });
  function set(c, S, str, x, y, o) {
    if (!str) return; const role = o.role || 'text', [f, w, s] = ROLE[role] || ROLE.text, [X, Y] = tf(S, o)([x, y]), a = o.alpha ?? 1; if (a <= 0.003) return;
    c.globalAlpha = a; c.font = `${o.weight || w} ${o.size || s}px ${f}, Georgia, serif`; c.textAlign = o.align || 'left'; c.textBaseline = 'alphabetic';
    c.fillStyle = o.color ? (PAL[o.color] || o.color) : role === 'note' ? PAL.dim : role === 'sketch' ? PAL.copper : PAL.ink; c.fillText(str, X, Y);
  }
})(typeof window !== 'undefined' ? window : globalThis);
