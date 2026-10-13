/* ARSENAL.materials · drawn — how a mark is drawn, as swappable modules.
   One interface per material:
     mark(p, kind, x, y, w, h, state, tokens)   kind: rect | dot | bar | line | arrow | label-underline
     texture(p, box, tokens)                    box: { x, y, w, h, seed? }  (the material's ground / paper)
   Geometry per kind (all in canvas px):
     rect  x,y,w,h = the box outline            dot   x,y = centre, w = diameter
     bar   x,y,w,h = filled block, grows L->R   line  (x,y) -> (x+w, y+h)
     arrow (x,y) -> (x+w, y+h), head at tip     label-underline  x,y = text baseline-left, w = underline length, h = font px
   state: { seed, i, u (0..1 draw fraction), role ('ink'|'accent'|'accent2'|'muted'|'line'|'chalk'), a (alpha), text }
   Every random draw comes from mulberry32(state.seed + state.i): the same mark wobbles the same way on re-seek.
   Inspired by p5.scribble (bowing + roughness), rough.js (hachure, double stroke) and p5.grain (seeded speckle);
   no library code. Reads token ROLES only (blueprint owns its blue ground: the one material-intrinsic hue). */
(function (root) {
  'use strict';
  const A = root.ARSENAL = root.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} };
  const TAU = Math.PI * 2, clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const gauss = r => (r() + r() + r() - 1.5) / 0.75;
  // smooth 1-D offset along a stroke: three sines of random phase (long bow, mid wobble, short tremor)
  function wobble(r, amp) {
    const k = [[60, 1], [24, 0.5], [9, 0.22]].map(([lam, a]) => ({ f: TAU / (lam * (0.8 + r() * 0.5)), p: r() * TAU, a: amp * a }));
    return s => k[0].a * Math.sin(s * k[0].f + k[0].p) + k[1].a * Math.sin(s * k[1].f + k[1].p) + k[2].a * Math.sin(s * k[2].f + k[2].p);
  }
  const MIXER = { ink: 'ink', accent: 'accent', accent2: 'accent2', muted: 'muted', line: 'line', chalk: 'chalk' };
  const frame = (x1, y1, x2, y2) => { const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1; return { len, ux: dx / len, uy: dy / len, nx: -dy / len, ny: dx / len }; };

  /* ── the six kinds, composed once from three primitives: seg, area, disc ── */
  const KIND = {
    rect(M, x, y, w, h, P) {
      const L = [w, h, w, h], tot = 2 * (w + h), pts = [[x, y, x + w, y], [x + w, y, x + w, y + h], [x + w, y + h, x, y + h], [x, y + h, x, y]];
      let acc = 0;
      for (let k = 0; k < 4; k++) { const uu = clamp((M.u * tot - acc) / L[k]); acc += L[k]; if (uu > 0) P.seg(M, ...pts[k], uu, {}); }
    },
    dot(M, x, y, w, h, P) { P.disc(M, x, y, w / 2, M.u); },
    bar(M, x, y, w, h, P) { P.area(M, x, y, w, h, M.u); },
    line(M, x, y, w, h, P) { P.seg(M, x, y, x + w, y + h, M.u, {}); },
    arrow(M, x, y, w, h, P) {
      const x2 = x + w, y2 = y + h, f = frame(x, y, x2, y2), hs = clamp(f.len * 0.14, 9, 16), su = clamp(M.u / 0.82);
      P.seg(M, x, y, x2, y2, su, {});
      const hu = clamp((M.u - 0.78) / 0.22);
      if (hu > 0) for (const sg of [1, -1]) {
        const bx = x2 - f.ux * hs + sg * f.nx * hs * 0.5, by = y2 - f.uy * hs + sg * f.ny * hs * 0.5;
        P.seg(M, x2, y2, bx, by, hu, { noTick: true, over: 0, w: 1.4 });
      }
    },
    'label-underline'(M, x, y, w, h, P) {
      const c = M.c, ty = M.tk.type.mono;
      c.font = `${ty.weight} ${h}px "${ty.family}", monospace`; c.textBaseline = 'alphabetic';
      c.globalAlpha = M.a * clamp(M.u * 3); c.fillStyle = M.col; P.text(M, M.st.text || '', x, y, h);
      c.globalAlpha = M.a; P.seg(M, x, y + 5, x + w, y + 5, M.u, {});
    },
  };

  function make(id, P, over, tex) {
    const colorOf = P.colorOf || ((tk, role) => tk.color[MIXER[role] || 'ink']);
    return {
      id, kinds: Object.keys(KIND),
      mark(p, kind, x, y, w, h, st, tk) {
        st = st || {}; const u = st.u == null ? 1 : st.u; if (u <= 0) return;
        const c = p.drawingContext, r = mulberry32((st.seed | 0) + (st.i | 0));
        const M = { c, r, u, a: st.a == null ? 1 : st.a, col: colorOf(tk, st.role || 'ink'), tk, st };
        c.save(); c.globalAlpha = M.a; c.strokeStyle = M.col; c.fillStyle = M.col; c.lineCap = 'round'; c.lineJoin = 'round';
        (over && over[kind] || KIND[kind])(M, x, y, w, h, P);
        c.restore();
      },
      texture(p, box, tk) { const c = p.drawingContext; c.save(); c.beginPath(); c.rect(box.x, box.y, box.w, box.h); c.clip(); tex(p, c, box, tk, mulberry32((box.seed | 0) + 90001)); c.restore(); },
    };
  }
  const text = (M, s, x, y) => M.c.fillText(s, x, y);

  /* ── INK · clean typeset default ── */
  const ink = {
    text,
    seg(M, x1, y1, x2, y2, u, o) { const c = M.c; c.lineWidth = o.w || 1.6; c.lineCap = 'butt'; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x1 + (x2 - x1) * u, y1 + (y2 - y1) * u); c.stroke(); },
    area(M, x, y, w, h, u) { M.c.fillRect(x, y, w * u, h); },
    disc(M, x, y, r, u) { M.c.beginPath(); M.c.arc(x, y, Math.max(0.01, r * u), 0, TAU); M.c.fill(); },
  };

  /* ── PENCIL · seeded wobble, pressure, double stroke, 3 px overshoot, hachure fills ── */
  const pencil = {
    text,
    seg(M, x1, y1, x2, y2, u, o) {
      const c = M.c, r = M.r, f = frame(x1, y1, x2, y2), ov = o.over == null ? 3 : o.over, L = f.len + 2 * ov, n = Math.max(4, Math.round(L / 4)), m = Math.max(1, Math.round(n * u)), w = o.w || 1.5;
      for (let pass = 0; pass < 2; pass++) {
        const wob = wobble(r, pass ? 1.3 : 0.8), ph = r() * TAU, off = pass ? (r() - 0.5) * 1.4 : 0;
        c.globalAlpha = M.a * (pass ? 0.42 : 0.88); let px, py;
        for (let i = 0; i <= m; i++) {
          const s = i / n * L, q = wob(s) + off, X = x1 - f.ux * ov + f.ux * s + f.nx * q, Y = y1 - f.uy * ov + f.uy * s + f.ny * q;
          if (i) { c.lineWidth = w * (pass ? 0.6 : 1) * (0.78 + 0.32 * Math.sin(s * 0.045 + ph)); c.beginPath(); c.moveTo(px, py); c.lineTo(X, Y); c.stroke(); }
          px = X; py = Y;
        }
      }
    },
    area(M, x, y, w, h, u) {
      const c = M.c, r = M.r, ww = w * u;
      c.save(); c.beginPath(); c.rect(x - 1, y - 1, ww + 2, h + 2); c.clip(); c.lineWidth = 1;
      for (let k = -h; k < w; k += 4) { c.globalAlpha = M.a * (0.35 + 0.35 * r()); c.beginPath(); c.moveTo(x + k + (r() - 0.5), y + h); c.lineTo(x + k + h + (r() - 0.5), y); c.stroke(); }
      c.restore();
      pencil.seg(M, x, y, x + ww, y, 1, { over: 2 }); pencil.seg(M, x, y + h, x + ww, y + h, 1, { over: 2 });
      if (u >= 1) pencil.seg(M, x + w, y - 2, x + w, y + h + 2, 1, { over: 1 });
    },
    disc(M, x, y, rad, u) {
      const c = M.c, r = M.r, turns = 2.4, n = Math.max(14, Math.round(rad * 6)), m = Math.round(n * clamp(u)), ph = r() * TAU, wob = wobble(r, 0.5);
      c.lineWidth = 1.2; c.globalAlpha = M.a * 0.85; c.beginPath();
      for (let i = 0; i <= m; i++) {
        const k = i / n, th = ph + k * turns * TAU, rr = rad * (0.2 + 0.8 * Math.min(1, k * 1.15)) + wob(i * 3);
        const X = x + Math.cos(th) * rr, Y = y + Math.sin(th) * rr; i ? c.lineTo(X, Y) : c.moveTo(X, Y);
      }
      c.stroke();
    },
  };

  /* ── STITCH · dashed thread with knots; running-stitch fills; stitched rings ── */
  const stitch = {
    text,
    seg(M, x1, y1, x2, y2, u, o) {
      const c = M.c, r = M.r, f = frame(x1, y1, x2, y2), dash = 7, gap = 3.6, per = dash + gap, wob = wobble(r, 0.5), end = f.len * u;
      c.lineWidth = o.w || 2; c.lineCap = 'round';
      for (let s = 0; s < end; s += per) {
        const s2 = Math.min(s + dash, end), q1 = wob(s), q2 = wob(s2);
        c.beginPath(); c.moveTo(x1 + f.ux * s + f.nx * q1, y1 + f.uy * s + f.ny * q1); c.lineTo(x1 + f.ux * s2 + f.nx * q2, y1 + f.uy * s2 + f.ny * q2); c.stroke();
        if (!o.noTick && s2 - s > dash - 0.1) { c.beginPath(); c.arc(x1 + f.ux * s + f.nx * q1, y1 + f.uy * s + f.ny * q1, 1.5, 0, TAU); c.fill(); }
      }
    },
    area(M, x, y, w, h, u) {
      const c = M.c, r = M.r, rows = Math.max(2, Math.round(h / 5)), gy = rows > 1 ? h / (rows - 1) : 0, ww = w * u;
      c.lineWidth = 1.8; c.lineCap = 'round';
      for (let j = 0; j < rows; j++) {
        const yy = y + j * gy, off = (j % 2) * 4.5 + r() * 1.5;
        for (let s = -off; s < ww; s += 9) {
          const a = Math.max(0, s), b = Math.min(ww, s + 6.5); if (b - a < 1.2) continue;
          c.beginPath(); c.moveTo(x + a, yy + (r() - 0.5) * 0.5); c.lineTo(x + b, yy + (r() - 0.5) * 0.5); c.stroke();
        }
      }
    },
    disc(M, x, y, rad, u) {
      const c = M.c, r = M.r; c.lineWidth = 1.7; c.lineCap = 'round';
      for (let rr = rad; rr > 1.2; rr -= 3.6) {
        const circ = TAU * rr, k = Math.max(3, Math.round(circ / 6.2)), ph = r() * TAU, lim = TAU * clamp(u);
        for (let i = 0; i < k; i++) { const a0 = i / k * TAU, a1 = a0 + TAU / k * 0.66; if (a0 > lim) break; c.beginPath(); c.arc(x, y, rr, ph + a0, ph + Math.min(a1, lim)); c.stroke(); }
      }
      c.beginPath(); c.arc(x, y, Math.max(0.01, 1.4 * u), 0, TAU); c.fill();
    },
  };

  /* ── CHALK · grainy dust over a soft base, edges fall off ── */
  function dust(M, x, y, spread, n, sz, aMax) {
    const c = M.c, r = M.r;
    for (let i = 0; i < n; i++) { c.globalAlpha = M.a * (0.18 + (aMax - 0.18) * r()); const s = sz * (0.5 + r()); c.fillRect(x + gauss(r) * spread, y + gauss(r) * spread, s, s); }
  }
  const chalk = {
    colorOf: (tk, role) => tk.color[role === 'ink' ? 'chalk' : (MIXER[role] || 'chalk')],
    text(M, s, x, y) { const c = M.c; c.fillText(s, x, y); c.globalAlpha = M.a * 0.28; c.fillText(s, x + 0.8, y + 0.6); dust(M, x + 6, y - 4, 7, 22, 1.1, 0.5); },
    seg(M, x1, y1, x2, y2, u, o) {
      const c = M.c, r = M.r, f = frame(x1, y1, x2, y2), end = f.len * u, wob = wobble(r, 0.9);
      c.lineWidth = 3.4; c.globalAlpha = M.a * 0.14; c.beginPath();
      for (let s = 0; s <= end; s += 3) { const q = wob(s); const X = x1 + f.ux * s + f.nx * q, Y = y1 + f.uy * s + f.ny * q; s ? c.lineTo(X, Y) : c.moveTo(X, Y); }
      c.stroke();
      for (let s = 0; s < end; s += 0.7) { if (r() < 0.16) continue; const q = wob(s); dust(M, x1 + f.ux * s + f.nx * q, y1 + f.uy * s + f.ny * q, 1.1, 3, 1.1, 0.85); }
    },
    area(M, x, y, w, h, u) {
      const c = M.c, r = M.r, ww = w * u; c.globalAlpha = M.a * 0.1; c.fillRect(x, y, ww, h);
      const n = Math.round(ww * h * 0.42); for (let i = 0; i < n; i++) { c.globalAlpha = M.a * (0.15 + 0.6 * r()); const s = 0.8 + r() * 1.1; c.fillRect(x + r() * ww, y + r() * h, s, s); }
      for (let s = 0; s < ww; s += 1.6) { if (r() < 0.2) continue; dust(M, x + s, y, 1.1, 1, 1.1, 0.8); dust(M, x + s, y + h, 1.1, 1, 1.1, 0.8); }
      dust(M, x + ww, y + h / 2, 1.6, Math.round(h * 0.8), 1.1, 0.8);
    },
    disc(M, x, y, rad, u) {
      const c = M.c, r = M.r, R = rad * clamp(u); if (R <= 0.05) return;
      c.globalAlpha = M.a * 0.16; c.beginPath(); c.arc(x, y, R, 0, TAU); c.fill();
      const n = Math.round(R * R * 3.4 + 8); for (let i = 0; i < n; i++) { const a = r() * TAU, d = R * Math.sqrt(r()) + gauss(r) * 0.5; c.globalAlpha = M.a * (0.2 + 0.7 * r()); c.fillRect(x + Math.cos(a) * d, y + Math.sin(a) * d, 1.1, 1.1); }
    },
  };

  /* ── MARKER · overlapping translucent strokes, squarish chisel tip ── */
  const marker = {
    text,
    seg(M, x1, y1, x2, y2, u, o) {
      const c = M.c, r = M.r, f = frame(x1, y1, x2, y2), tw = o.w ? o.w * 3 : clamp(f.len * 0.2, 3, 6); c.lineCap = 'butt'; c.lineWidth = tw; c.globalAlpha = M.a * 0.34;
      for (let k = 0; k < 3; k++) {
        const a0 = -(2 + r() * 3) * (k ? 1 : 0), a1 = f.len + (2 + r() * 4) * (k ? 1 : 0), off = (k - 1) * 1.7 + (r() - 0.5), wob = wobble(r, 0.9), end = (a1 - a0) * u, n = Math.max(3, Math.round(end / 5));
        c.beginPath();
        for (let i = 0; i <= n; i++) { const s = a0 + end * i / n, q = off + wob(s); const X = x1 + f.ux * s + f.nx * q, Y = y1 + f.uy * s + f.ny * q; i ? c.lineTo(X, Y) : c.moveTo(X, Y); }
        c.stroke();
      }
    },
    area(M, x, y, w, h, u) {
      const c = M.c, r = M.r, tw = 7, rows = Math.max(2, Math.ceil((h - tw) / (tw * 0.7)) + 1), gy = rows > 1 ? (h - tw) / (rows - 1) : 0, ww = w * u;
      c.lineCap = 'butt'; c.lineWidth = tw; c.globalAlpha = M.a * 0.36;
      for (let j = 0; j < rows; j++) { const yy = y + tw / 2 + j * gy, a = x - 1 + r() * 2, b = Math.max(a, x + ww + (r() - 0.5) * 3); c.beginPath(); c.moveTo(a, yy + (r() - 0.5)); c.lineTo(b, yy + (r() - 0.5)); c.stroke(); }
    },
    disc(M, x, y, rad, u) {
      const c = M.c, r = M.r, R = Math.max(0.05, rad * clamp(u)); c.globalAlpha = M.a * 0.4;
      for (let k = 0; k < 2; k++) { c.beginPath(); c.arc(x + (r() - 0.5) * 1.6, y + (r() - 0.5) * 1.6, R * (0.93 + 0.07 * k), 0, TAU); c.fill(); }
      c.globalAlpha = M.a * 0.5; c.lineWidth = 1; c.beginPath(); c.arc(x, y, R, 0, TAU); c.stroke();
    },
  };

  /* ── BLUEPRINT · white on blue, dimension ticks ── */
  const bpGround = tk => 'hsl(214,62%,29%)';
  const tick = (M, x, y, f, len) => { const c = M.c; c.beginPath(); c.moveTo(x - f.nx * len, y - f.ny * len); c.lineTo(x + f.nx * len, y + f.ny * len); c.moveTo(x - (f.ux - f.nx) * len * 0.55, y - (f.uy - f.ny) * len * 0.55); c.lineTo(x + (f.ux - f.nx) * len * 0.55, y + (f.uy - f.ny) * len * 0.55); c.stroke(); };
  const blueprint = {
    colorOf: (tk, role) => tk.color[role === 'ink' ? 'chalk' : (MIXER[role] || 'chalk')],
    text,
    seg(M, x1, y1, x2, y2, u, o) {
      const c = M.c, f = frame(x1, y1, x2, y2), ov = o.over == null ? 3 : o.over; c.lineWidth = o.w || 1; c.lineCap = 'butt';
      c.beginPath(); c.moveTo(x1 - f.ux * ov, y1 - f.uy * ov); c.lineTo(x1 + (x2 - x1) * u, y1 + (y2 - y1) * u); c.stroke();
      if (!o.noTick) { c.lineWidth = 0.9; tick(M, x1, y1, f, 3.2); if (u >= 0.999) tick(M, x2, y2, f, 3.2); }
    },
    area(M, x, y, w, h, u) {
      const c = M.c, ww = w * u; c.lineWidth = 1; c.lineCap = 'butt';
      c.save(); c.beginPath(); c.rect(x, y, ww, h); c.clip(); c.globalAlpha = M.a * 0.4; c.lineWidth = 0.8;
      for (let k = -h; k < ww; k += 5) { c.beginPath(); c.moveTo(x + k, y + h); c.lineTo(x + k + h, y); c.stroke(); } c.restore();
      c.globalAlpha = M.a; c.strokeRect(x + 0.5, y + 0.5, Math.max(0, ww - 1), h - 1);
      const dy = y + h + 9, f = { ux: 1, uy: 0, nx: 0, ny: 1 };   // dimension line below the block
      c.lineWidth = 0.8; c.beginPath(); c.moveTo(x, dy); c.lineTo(x + ww, dy); c.stroke(); tick(M, x, dy, f, 3.4); tick(M, x + ww, dy, f, 3.4);
      c.font = `400 8px "${M.tk.type.mono.family}", monospace`; c.textAlign = 'center'; c.fillText(String(Math.round(w * u)), x + ww / 2, dy - 2.5); c.textAlign = 'left';
    },
    disc(M, x, y, rad, u) {
      const c = M.c, R = Math.max(0.05, rad * clamp(u)); c.lineWidth = 1; c.beginPath(); c.arc(x, y, R, 0, TAU); c.stroke();
      c.lineWidth = 0.7; c.globalAlpha = M.a * 0.8; c.beginPath(); c.moveTo(x - R - 3, y); c.lineTo(x + R + 3, y); c.moveTo(x, y - R - 3); c.lineTo(x, y + R + 3); c.stroke();
    },
  };
  const bpOver = {
    rect(M, x, y, w, h, P) { const o = { over: 4, noTick: true }; const u = M.u, tot = 2 * (w + h), L = [w, h, w, h], pts = [[x, y, x + w, y], [x + w, y, x + w, y + h], [x + w, y + h, x, y + h], [x, y + h, x, y]]; let acc = 0; for (let k = 0; k < 4; k++) { const uu = clamp((u * tot - acc) / L[k]); acc += L[k]; if (uu > 0) P.seg(M, ...pts[k], uu, o); } },
    arrow(M, x, y, w, h, P) {
      const c = M.c, x2 = x + w, y2 = y + h, f = frame(x, y, x2, y2), hs = 10, su = clamp(M.u / 0.85);
      P.seg(M, x, y, x2, y2, su, { noTick: true, over: 0 }); tick(M, x, y, f, 4);
      if (M.u > 0.85) { c.beginPath(); c.moveTo(x2, y2); c.lineTo(x2 - f.ux * hs + f.nx * hs * 0.3, y2 - f.uy * hs + f.ny * hs * 0.3); c.lineTo(x2 - f.ux * hs - f.nx * hs * 0.3, y2 - f.uy * hs - f.ny * hs * 0.3); c.closePath(); c.fill(); }
    },
  };

  /* ── textures · each material's ground (the demo fills tokens.color.bg first; blueprint covers it) ── */
  const speck = (c, r, box, n, col, a, s) => { c.fillStyle = col; for (let i = 0; i < n; i++) { c.globalAlpha = a * (0.4 + 0.6 * r()); c.fillRect(box.x + r() * box.w, box.y + r() * box.h, s, s); } };
  const T = {
    ink(p, c, box, tk, r) { if (tk.texture === 'grain') speck(c, r, box, Math.round(box.w * box.h / 220), tk.color.ink, 0.06, 1); },
    pencil(p, c, box, tk, r) {
      c.strokeStyle = tk.color.line; c.globalAlpha = 0.5; c.lineWidth = 1;
      for (let y = box.y + 24; y < box.y + box.h; y += 24) { c.beginPath(); c.moveTo(box.x, y); c.lineTo(box.x + box.w, y); c.stroke(); }
      speck(c, r, box, Math.round(box.w * box.h / 140), tk.color.ink, 0.07, 1);
    },
    stitch(p, c, box, tk, r) {
      c.strokeStyle = tk.color.ink; c.globalAlpha = 0.07; c.lineWidth = 1; c.beginPath();
      for (let y = box.y + 4; y < box.y + box.h; y += 8) for (let x = box.x + 4 + ((y / 8 | 0) % 2) * 4; x < box.x + box.w; x += 8) { c.moveTo(x - 1.5, y - 1.5); c.lineTo(x + 1.5, y + 1.5); c.moveTo(x + 1.5, y - 1.5); c.lineTo(x - 1.5, y + 1.5); }
      c.stroke();
    },
    chalk(p, c, box, tk, r) {
      for (let i = 0; i < 26; i++) { const x = box.x + r() * box.w, y = box.y + r() * box.h, R = 60 + r() * 140, g = c.createRadialGradient(x, y, 0, x, y, R); g.addColorStop(0, 'rgba(255,255,255,0.035)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.globalAlpha = 1; c.fillStyle = g; c.fillRect(x - R, y - R, 2 * R, 2 * R); }
      speck(c, r, box, Math.round(box.w * box.h / 260), tk.color.chalk, 0.1, 1);
    },
    marker(p, c, box, tk, r) { c.fillStyle = tk.color.line; c.globalAlpha = 0.7; for (let y = box.y + 20; y < box.y + box.h; y += 24) for (let x = box.x + 20; x < box.x + box.w; x += 24) { c.beginPath(); c.arc(x, y, 0.9, 0, TAU); c.fill(); } },
    blueprint(p, c, box, tk) {
      c.fillStyle = bpGround(tk); c.globalAlpha = 1; c.fillRect(box.x, box.y, box.w, box.h);
      c.strokeStyle = tk.color.chalk; c.lineWidth = 0.5;
      for (const [step, a] of [[12, 0.06], [60, 0.14]]) { c.globalAlpha = a; c.beginPath(); for (let x = box.x; x <= box.x + box.w; x += step) { c.moveTo(x + 0.5, box.y); c.lineTo(x + 0.5, box.y + box.h); } for (let y = box.y; y <= box.y + box.h; y += step) { c.moveTo(box.x, y + 0.5); c.lineTo(box.x + box.w, y + 0.5); } c.stroke(); }
    },
  };

  A.materials.ink = make('ink', ink, null, T.ink);
  A.materials.pencil = make('pencil', pencil, null, T.pencil);
  A.materials.stitch = make('stitch', stitch, null, T.stitch);
  A.materials.chalk = make('chalk', chalk, null, T.chalk);
  A.materials.marker = make('marker', marker, null, T.marker);
  A.materials.blueprint = make('blueprint', blueprint, bpOver, T.blueprint);
  A.mulberry32 = mulberry32;
})(typeof window !== 'undefined' ? window : globalThis);
