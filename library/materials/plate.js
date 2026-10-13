/* ════════════════════════════════════════════════════════════════════════════════════════════════════════════
   Material · PLATE — the light table (cyanotype exposure).
   Kernel: archive/chromes/exposure/exposure.kit.js (vendored verbatim as materials/kernels/exposure.kit.js): a CPU float
   plate, the H&D characteristic curve (toe · straight line · shoulder) → negative density → transmitted UV →
   cyanotype print through a 1,024-entry OKLab LUT, static seeded grain in the log-exposure domain, a brushed ragged
   sensitiser edge, display type exposed into the plate. Credit: H · Exposure team (exposure/NOTES.md).
   Mark rule: each thread of light is one run (axis x: steps run left → right); exposure is frequency — every run
   deposits light in proportion to the share of the plate it owns, so more runs sharpen the plate and never brighten
   it; a failed run stops at its step and a peach dot marks the address; a catch jogs the thread (the retry happens
   later) and leaves a sage bead. Highlights clip at the shoulder like film: no bloom.
   ════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';
  const AM = root.AM;
  const EX = () => root.EX;
  const FONT = { display: '"Sofia Sans Extra Condensed", "DM Sans", sans-serif', mono: '"Red Hat Mono", "Space Mono", monospace' };
  const ROLE = { title: ['display', 600, 44], head: ['display', 600, 32], text: ['display', 500, 21], num: ['mono', 500, 17], note: ['mono', 400, 13], sketch: ['display', 500, 20] };
  const GAIN = 0.5;   // metered: a full rack sits on the straight line of the H&D curve, not the shoulder

  const _disc = new Map();
  function disc(col, r, k) {   // cached antialiased disc sprite (thousands of address dots per frame cost microseconds)
    const key = col + r.toFixed(2) + '|' + k; let d = _disc.get(key); if (d) return d;
    const pad = 1, sz = Math.ceil((2 * r + 2 * pad) * k), cv = document.createElement('canvas'); cv.width = cv.height = sz;
    const c = cv.getContext('2d'); c.scale(k, k); c.fillStyle = col; c.beginPath(); c.arc(r + pad, r + pad, r, 0, 6.2832); c.fill();
    d = { cv, off: r + pad, size: sz / k }; _disc.set(key, d); return d;
  }

  const M = AM.material({
    id: 'plate', title: 'Plate — cyanotype light table', source: ['archive/chromes/exposure/exposure.kit.js', 'archive/chromes/exposure/NOTES.md'],
    markRule: { unit: 'thread of light = one run', step: 'a step = one slit along the thread', address: 'the thread stops; a peach dot at the slit', save: 'the thread jogs (retry later) and a sage bead', cost: 'a sage bead per step exposed twice' },
    nouns: { unit: 'thread of light', units: 'threads', step: 'slit', steps: 'slits', edge: 'rim of the plate', check: 'catch' },
    axis: 'x', cell: { along: 1, across: 0.12, maxAcross: 14 }, nRange: [1, 4000], ground: '#0E2C4F',
    fonts: [['Sofia Sans Extra Condensed', 'sofia-sans-extra-condensed-latin-500-normal.woff2', 500], ['Sofia Sans Extra Condensed', 'sofia-sans-extra-condensed-latin-600-normal.woff2', 600],
      ['Red Hat Mono', 'red-hat-mono-latin-400-normal.woff2', 400], ['Red Hat Mono', 'red-hat-mono-latin-500-normal.woff2', 500]],
    tokens: null,
    setup() { EX().lut(); },
    begin(p, ctx, t, cam) {
      const X = EX(), S0 = X.surface(ctx.size.k, ctx.seed);
      X.clear(S0);
      if (!M._E || M._E.length !== S0.W * S0.H) M._E = new Float32Array(S0.W * S0.H); else M._E.fill(0);
      return { X: S0, E: M._E, R: S0.R, cam, q: [], dots: [], titles: [], t };
    },
    units(S, items) {
      const E = S.E, W = S.X.W, H = S.X.H, R = S.R, cam = S.cam;
      for (const it of items) {
        const [sx, sy, sw, sh] = AM.cam.rect(cam, it.x, it.y, it.w, it.h);
        if (sy + sh < -4 || sy > 544 || sx > 964 || sx + sw < -4) continue;
        const k = it.k, f = it.failAt, len = f >= 0 ? f + 0.5 : it.done;
        if (len <= 0.02) continue;
        const hpx = sh * R, energy = Math.min(14, Math.max(0.05, hpx)) * GAIN * it.alpha, sig = Math.max(0.45, hpx * 0.17);
        const rad = Math.ceil(sig * 2.6), wts = [];
        let wsum = 0; for (let d = -rad; d <= rad; d++) { const w = Math.exp(-0.5 * (d / sig) ** 2); wts.push(w); wsum += w; }
        const jog = Math.max(0.35, sh * 0.32);
        // the thread, segment by segment (a catch jogs the rest of the thread down: the retry happened later)
        let yOff = 0, x0 = sx;
        const xEnd = sx + sw * Math.min(len, k) / k;
        const cuts = it.caught.map(j => sx + sw * (j + 0.5) / k).filter(x => x < xEnd).concat([xEnd]);
        for (const xc of cuts) {
          const yc = (sy + sh / 2 + yOff) * R, fy = yc - 0.5, y0 = Math.floor(fy), fr = fy - y0;
          const px0 = Math.max(0, Math.floor(x0 * R)), px1 = Math.min(W, Math.ceil(xc * R));
          for (let px = px0; px < px1; px++) {
            const cov = Math.min(px + 1, xc * R) - Math.max(px, x0 * R); if (cov <= 0) continue;   // exact column coverage
            const a = energy * cov / wsum;
            for (let d = -rad; d <= rad; d++) {
              const w = wts[d + rad] * a, yy = y0 + d;
              if (yy >= 0 && yy < H) E[yy * W + px] += w * (1 - fr);
              if (yy + 1 >= 0 && yy + 1 < H) E[(yy + 1) * W + px] += w * fr;
            }
          }
          if (xc < xEnd) S.dots.push(['#A6CB92', xc, sy + sh / 2 + yOff, Math.min(3.2, Math.max(0.9, sh * 0.42))]);
          x0 = xc; yOff += jog;
        }
        if (f >= 0) S.dots.push(['#F27F52', sx + sw * (f + 0.5) / k, sy + sh / 2 + yOff, Math.min(4.2, Math.max(0.8, sh * 0.5)) * (it.emph === 'focus' ? 1.6 : 1)]);
      }
    },
    anchor(rect, j, k) { return AM.stepPoint(rect, 'x', j, k); },
    mark(S, kind, x, y, o = {}) { S.q.push(c => markOp(c, S, kind, x, y, o)); },
    line(S, pts, role, o = {}) { S.q.push(c => lineOp(c, S, pts, role, o)); },
    area(S, top, bot, role, o = {}) {
      S.q.push(c => {
        const T = tf(S, o); c.globalAlpha = (o.alpha ?? 1) * (role === 'band' ? 0.32 : 0.15); c.fillStyle = role === 'band' ? '#E2AA70' : '#93AAC0';
        c.beginPath(); top.forEach((q, i) => { const P = T(q); i ? c.lineTo(P[0], P[1]) : c.moveTo(P[0], P[1]); }); for (let i = bot.length - 1; i >= 0; i--) { const P = T(bot[i]); c.lineTo(P[0], P[1]); }
        c.closePath(); c.fill();
      });
    },
    text(S, str, x, y, o = {}) {
      if ((o.role || 'text') === 'title') { S.titles.push([str, x, y, o]); return; }   // exposed into the plate, develops along the H&D curve
      S.q.push(c => textOp(c, S, str, x, y, o));
    },
    num(S, n, x, y, o = {}) { S.q.push(c => textOp(c, S, o.str, x, y, Object.assign({ role: 'num' }, o))); },
    end(p, S) {
      const X = EX(), S0 = S.X;
      for (const [str, x, y, o] of S.titles) {             // photogram type: a mask exposed with a developing amplitude
        const [, w, size] = ROLE.title, [sx, sy] = o.screen ? [x, y] : [AM.cam.X(S.cam, x), AM.cam.Y(S.cam, y)];
        const Mk = X.mask(S0, 'am-title|' + str + '|' + Math.round(sx) + '|' + Math.round(sy) + '|' + (o.size || size), { text: str, font: `${w} ${o.size || size}px ${FONT.display}`, size: o.size || size, x: sx, y: sy, align: o.align || 'left' });
        const A = X.develop(o.develop ?? 1, 0, 1, -5, 3.2) * (o.alpha ?? 1);
        for (let yy = 0; yy < Mk.h; yy++) for (let xx = 0; xx < Mk.w; xx++) { const v = Mk.a[yy * Mk.w + xx]; if (v > 0) S.E[(Mk.oy + yy) * S0.W + Mk.ox + xx] += v * A; }
      }
      X.tone(S0, S.E, S0.W, S0.H, 0, 0, 1);
      S0.c2.putImageData(S0.img, 0, 0);
      const c = S0.c2; c.save(); c.setTransform(S0.R, 0, 0, S0.R, 0, 0);
      for (const [col, x, y, r] of S.dots) { const d = disc(col, r, S0.R); c.drawImage(d.cv, x - d.off, y - d.off, d.size, d.size); }
      for (const f of S.q) { c.save(); f(c); c.restore(); }
      c.restore();
      p.drawingContext.drawImage(S0.cv, 0, 0, 960, 540);
    },
    voice: { step: { kind: 'tick', freq: 5200, gain: 0.32 }, fail: { kind: 'clack', freq: 140, gain: 0.5 }, save: { kind: 'click', freq: 2200, gain: 0.5 },
      reveal: { kind: 'tone', freq: 262, gain: 0.5, dur: 1.3 }, commit: { kind: 'click', freq: 900, gain: 0.45 }, cost: { kind: 'tick', freq: 3600, gain: 0.25 } },
  });

  const tf = (S, o) => (o.screen ? (q => q) : (q => [AM.cam.X(S.cam, q[0]), AM.cam.Y(S.cam, q[1])]));
  const PAL = { copper: '#E2AA70', sage: '#A6CB92', peach: '#F27F52', slate: '#86A6C2', ink: '#EEF0E8', dim: '#93AAC0', grease: '#F4F1E6' };
  function grease(c, P, w, col, a) {   // grease pencil on glass: a waxy, slightly broken double stroke
    c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = col;
    for (let pass = 0; pass < 2; pass++) {
      c.globalAlpha = a * (pass ? 0.55 : 0.9); c.lineWidth = w * (pass ? 0.55 : 1);
      c.beginPath(); P.forEach((q, i) => { const o = pass ? 0.6 : 0; i ? c.lineTo(q[0] + o, q[1] - o) : c.moveTo(q[0] + o, q[1] - o); }); c.stroke();
    }
  }
  function lineOp(c, S, pts, role, o) {
    const P = pts.map(tf(S, o)), a = o.alpha ?? 1; if (a <= 0.003 || P.length < 2) return;
    c.globalAlpha = a; c.lineCap = 'round'; c.lineJoin = 'round';
    const path = () => { c.beginPath(); P.forEach((q, i) => (i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]))); };
    if (role === 'exact') { path(); c.strokeStyle = PAL.copper; c.lineWidth = o.w || 1.1; c.setLineDash([5, 3]); c.stroke(); c.setLineDash([]); }   // latent contour of the exact field
    else if (role === 'rule') { path(); c.strokeStyle = PAL.slate; c.lineWidth = o.w || 1; c.stroke(); }
    else if (role === 'guess') grease(c, P, o.w || 3, PAL.grease, a);
    else if (role === 'gap') grease(c, P, o.w || 3, PAL.peach, a);
    else if (role === 'ghost') { path(); c.strokeStyle = 'rgba(238,240,232,0.55)'; c.lineWidth = o.w || 1; c.setLineDash([2, 3]); c.stroke(); c.setLineDash([]); }
    else { path(); c.strokeStyle = PAL.dim; c.lineWidth = o.w || 1; c.stroke(); }
  }
  function markOp(c, S, kind, x, y, o) {
    const [X, Y] = tf(S, o)([x, y]), a = o.alpha ?? 1, r = o.r || 7; if (a <= 0.003) return;
    c.globalAlpha = a;
    if (kind === 'address') { c.beginPath(); c.arc(X, Y, r, 0, 6.2832); c.strokeStyle = PAL.peach; c.lineWidth = 1.6; c.stroke(); }
    else if (kind === 'save') { c.beginPath(); c.arc(X, Y, r * 0.55, 0, 6.2832); c.fillStyle = PAL.sage; c.fill(); }
    else if (kind === 'cost') { c.beginPath(); c.arc(X, Y, o.r || 1.3, 0, 6.2832); c.fillStyle = PAL.sage; c.fill(); }
    else if (kind === 'guess') {   // a grease-pencil cross on the glass
      const s = o.s || 7; grease(c, [[X - s, Y - s], [X + s, Y + s]], 2.6, PAL.grease, a); grease(c, [[X + s, Y - s], [X - s, Y + s]], 2.6, PAL.grease, a);
    } else if (kind === 'truth' || kind === 'expected') { const s = o.s || 9, d = o.dir || 1; c.beginPath(); c.moveTo(X, Y); c.lineTo(X + d * s, Y - s * 0.6); c.lineTo(X + d * s, Y + s * 0.6); c.closePath(); c.fillStyle = PAL.copper; c.fill(); }
    else if (kind === 'realised') { const s = o.s || 9, d = o.dir || 1; c.beginPath(); c.moveTo(X, Y); c.lineTo(X + d * s, Y - s * 0.6); c.lineTo(X + d * s, Y + s * 0.6); c.closePath(); c.fillStyle = PAL.ink; c.fill(); }
    else if (kind === 'tick') grease(c, [[X, Y - 7], [X + 2, Y + 7]], 2.6, PAL.grease, a);   // the enlarger timer's three strokes
  }
  function textOp(c, S, str, x, y, o) {
    const role = o.role || 'text', [fam, w, s] = ROLE[role] || ROLE.text, size = o.size || s, a = o.alpha ?? 1; if (a <= 0.003 || !str) return;
    const [X, Y] = tf(S, o)([x, y]);
    c.globalAlpha = a; c.font = `${o.weight || w} ${size}px ${FONT[fam]}`; c.textAlign = o.align || 'left'; c.textBaseline = o.base || 'alphabetic';
    if ('letterSpacing' in c) c.letterSpacing = '0px';
    const col = o.color ? (PAL[o.color] || o.color) : role === 'note' ? PAL.dim : role === 'sketch' ? PAL.copper : PAL.ink;
    c.lineJoin = 'round'; c.strokeStyle = 'rgba(8,26,48,0.75)'; c.lineWidth = Math.max(3, size * 0.2); c.strokeText(str, X, Y);
    c.fillStyle = col; c.fillText(str, X, Y);
  }
})(typeof window !== 'undefined' ? window : globalThis);
