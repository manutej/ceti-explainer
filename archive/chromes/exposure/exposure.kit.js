/* exposure.kit.js — H · EXPOSURE, the light table. Shared material for both films.
   A CPU float plate → H&D characteristic curve (negative) → transmitted UV → cyanotype print → OKLab LUT.
   Static seeded grain in the log-exposure domain; paper fibre in the ground. No bloom: highlights clip at the
   shoulder like film. Everything here is pure in its inputs; caches are keyed by render scale. */
(function (root) {
  'use strict';
  const U = root.Atelier.U;
  const EX = {};

  /* Palette — Prussian ground; semantic colours re-tuned for it (hue/meaning kept, L/C tuned). */
  EX.PAL = Object.freeze({
    ground: '#0E2C4F', cyan: '#4F8EBE', paper: '#EEF0E8',
    copper: '#E2AA70', sage: '#A6CB92', peach: '#F27F52', slate: '#86A6C2',
    ink: '#EEF0E8', dim: '#93AAC0', deep: '#0A223F',
  });
  EX.FONT = { display: '"Sofia Sans Extra Condensed"', mono: '"Red Hat Mono"' };

  /* ── H&D curve + cyanotype print ─────────────────────────────────────────── */
  const L0 = -9, L1 = 7, NL = 1024, LS = (NL - 1) / (L1 - L0);
  EX.HD = { l0: 0.35, w: 0.72, Dmin: 0.07, Dr: 2.45, kappa: 3.0 };
  /** negative density for log2 exposure l (toe · straight line · shoulder) */
  EX.density = l => EX.HD.Dmin + EX.HD.Dr / (1 + Math.exp(-(l - EX.HD.l0) / EX.HD.w));
  /** cyanotype print density P∈[0,1] (1 = full Prussian, 0 = paper) for log2 exposure of the negative */
  EX.printP = l => {
    const H = EX.HD, T = Math.pow(10, -EX.density(l)), Tm = Math.pow(10, -H.Dmin);
    return (1 - Math.exp(-H.kappa * T)) / (1 - Math.exp(-H.kappa * Tm));
  };
  const LAB = hx => U.color.rgb2oklab(U.color.hex2rgb(hx));
  let _lut = null;
  /** 1,024-entry LUT over log2 E ∈ [L0, L1] → packed RGBA (little-endian ABGR). Also .rgb for native drawing. */
  EX.lut = function () {
    if (_lut) return _lut;
    const P = EX.PAL, g = LAB(P.ground), c = LAB(P.cyan), w = LAB(P.paper);
    const u32 = new Uint32Array(NL), css = new Array(NL);
    for (let i = 0; i < NL; i++) {
      const l = L0 + i / LS, q = EX.printP(l);        // q: 1 ground … 0 paper
      let lab;
      if (q > 0.5) { const u = (q - 0.5) / 0.5; lab = [U.lerp(c[0], g[0], u), U.lerp(c[1], g[1], u), U.lerp(c[2], g[2], u)]; }
      else { const u = q / 0.5; lab = [U.lerp(w[0], c[0], u), U.lerp(w[1], c[1], u), U.lerp(w[2], c[2], u)]; }
      const rgb = U.color.oklab2rgb(lab).map(v => Math.round(U.clamp(v) * 255));
      u32[i] = (255 << 24) | (rgb[2] << 16) | (rgb[1] << 8) | rgb[0];
      css[i] = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
    }
    _lut = { u32, css };
    return _lut;
  };
  /** css colour of the print for exposure E (no grain) — for native type that must follow the same curve */
  EX.toneCss = (E, fog = EX.FOG) => EX.lut().css[U.clamp(Math.round((Math.log2(E + fog) - L0) * LS), 0, NL - 1)];

  EX.FOG = Math.pow(2, -3.1);       // base fog of the negative (gives the ground its tooth)
  EX.GRAIN = 0.30;                  // grain, in stops (log2 exposure)

  /* ── Surface: one CPU canvas per render scale, ground + grain precomputed ── */
  const _surf = new Map();
  /** render scale for the CPU plate given the film's pixel scale k */
  EX.scale = k => (k <= 1.1 ? 1 : k <= 1.6 ? 1.5 : 2);
  EX.surface = function (k, seed) {
    const R = EX.scale(k), key = R + '|' + seed;
    if (_surf.has(key)) return _surf.get(key);
    const W = Math.round(960 * R), H = Math.round(540 * R);
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const c2 = cv.getContext('2d', { willReadFrequently: true });
    const img = c2.createImageData(W, H), u32 = new Uint32Array(img.data.buffer);
    // grain: fine + clumped (half-res cell) gaussian, static. Paper fibre: anisotropic low-frequency fbm.
    const grain = new Float32Array(W * H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const gf = U.gauss(seed + 31, x, y, 1, 0), gc = U.gauss(seed + 37, x >> 1, y >> 1, 2, 0);
      const fib = (U.fbm(seed + 41, 3, x / (R * 70), y / (R * 7)) - 0.5) * 2.2;
      grain[y * W + x] = 0.62 * gf + 0.45 * gc + fib;
    }
    const L = EX.lut().u32, ground = new Uint32Array(W * H), lf = Math.log2(EX.FOG);
    // the coated area: brushed sensitiser with ragged edges; beyond it the paper stays white (cyanotype)
    const pap = U.color.hex2rgb('#E9E7DC').map(v => v * 255), coat = new Float32Array(W * H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const dx = x / R, dy = y / R, dl = dx, dr = 960 - dx, dt = dy, db = 540 - dy;
      const m = Math.min(dl, dr, dt, db), along = m === dl || m === dr ? dy : dx;
      const edge = 9 + 7 * U.fbm(seed + 53 + (m === dl ? 0 : m === dr ? 1 : m === dt ? 2 : 3), 4, along / 38) + 2.5 * U.noise1(seed + 59, along / 3.2);
      const streak = U.fbm(seed + 61, 3, m === dl || m === dr ? dx / 14 : dx / 220, m === dl || m === dr ? dy / 220 : dy / 14);
      coat[y * W + x] = U.smoothstep(edge - 2.5, edge + 2.5, m) * (1 - 0.35 * U.smoothstep(edge + 26, edge, m) * streak);
    }
    for (let i = 0; i < W * H; i++) {
      const g = L[U.clamp(((lf + grain[i] * EX.GRAIN) - L0) * LS | 0, 0, NL - 1)], c = coat[i];
      if (c >= 0.999) { ground[i] = g; continue; }
      const n = 1 + 0.03 * grain[i], r = (g & 255) * c + pap[0] * n * (1 - c), gg = ((g >> 8) & 255) * c + pap[1] * n * (1 - c), bb = ((g >> 16) & 255) * c + pap[2] * n * (1 - c);
      ground[i] = (255 << 24) | (Math.min(255, bb) << 16) | (Math.min(255, gg) << 8) | Math.min(255, r);
    }
    const S = { R, W, H, cv, c2, img, u32, grain, ground };
    _surf.set(key, S);
    return S;
  };
  /** start a frame: ground (with grain) everywhere */
  EX.clear = S => S.u32.set(S.ground);
  /**
   * Tone-map a float field into the surface. E: Float32Array (pw×ph) at surface scale, placed at surface px (ox, oy).
   * value = E[i]·scale (+ E2[i]·scale2) ; optional column clip [0, xclip) in field px. Grain/fog as the ground.
   */
  EX.tone = function (S, E, pw, ph, ox, oy, scale, E2, scale2, xclip) {
    const L = EX.lut().u32, G = S.grain, out = S.u32, W = S.W, fog = EX.FOG, gs = EX.GRAIN;
    const xe = Math.min(pw, xclip == null ? pw : Math.max(0, Math.floor(xclip)));
    for (let y = 0; y < ph; y++) {
      const sy = oy + y; if (sy < 0 || sy >= S.H) continue;
      const row = y * pw, srow = sy * W + ox;
      for (let x = 0; x < xe; x++) {
        let e = E[row + x] * scale; if (E2) e += E2[row + x] * scale2;
        if (e <= 0) continue;                                   // the ground is already there
        const si = srow + x, li = ((Math.log2(e + fog) + G[si] * gs) - L0) * LS | 0;
        out[si] = L[li < 0 ? 0 : li >= NL ? NL - 1 : li];
      }
    }
  };
  /** blit the surface onto the p5 canvas (design units) */
  EX.blit = function (p, S) { S.c2.putImageData(S.img, 0, 0); p.drawingContext.drawImage(S.cv, 0, 0, 960, 540); };

  /* ── Type exposed into the plate (photogram) ─────────────────────────────── */
  const _masks = new Map();
  /**
   * Alpha mask of text at surface scale, cropped to its box: {ox, oy, w, h, a: Float32Array}.
   * spec: {text, font, size, x, y, align, spacing}  (design units; baseline y).
   */
  EX.mask = function (S, id, spec) {
    const key = id + '|' + S.R; if (_masks.has(key)) return _masks.get(key);
    const R = S.R, cv = document.createElement('canvas'); cv.width = S.W; cv.height = S.H;
    const c = cv.getContext('2d', { willReadFrequently: true });
    c.scale(R, R); c.fillStyle = '#fff'; c.textBaseline = 'alphabetic';
    const lines = Array.isArray(spec) ? spec : [spec];
    let bx0 = 1e9, by0 = 1e9, bx1 = -1e9, by1 = -1e9;
    for (const s of lines) {
      c.font = s.font; c.textAlign = s.align || 'left'; if ('letterSpacing' in c) c.letterSpacing = (s.spacing || 0) + 'px';
      c.fillText(s.text, s.x, s.y);
      const m = c.measureText(s.text), w = m.width, x0 = s.align === 'center' ? s.x - w / 2 : s.align === 'right' ? s.x - w : s.x;
      bx0 = Math.min(bx0, x0 - 4); bx1 = Math.max(bx1, x0 + w + 4);
      by0 = Math.min(by0, s.y - (m.actualBoundingBoxAscent || s.size) - 4); by1 = Math.max(by1, s.y + (m.actualBoundingBoxDescent || 0) + 4);
    }
    const ox = Math.max(0, Math.floor(bx0 * R)), oy = Math.max(0, Math.floor(by0 * R));
    const w = Math.min(S.W, Math.ceil(bx1 * R)) - ox, h = Math.min(S.H, Math.ceil(by1 * R)) - oy;
    const d = c.getImageData(ox, oy, w, h).data, a = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) a[i] = d[i * 4 + 3] / 255;
    const M = { ox, oy, w, h, a }; _masks.set(key, M); return M;
  };
  /** expose a mask with amplitude A (exposure units) — adds onto whatever is in the surface region (ground) */
  EX.exposeMask = (S, M, A) => { if (A > 1e-4) EX.tone(S, M.a, M.w, M.h, M.ox, M.oy, A); };
  /** amplitude ramp that develops type from the toe to the shoulder: log-linear from 2^lo to 2^hi */
  EX.develop = (t, t0, t1, lo = -5, hi = 5) => Math.pow(2, U.lerp(lo, hi, U.seg(t, t0, t1, 'inOut')));

  /* ── native drawing helpers (design units, raw 2D context) ───────────────── */
  EX.text = function (dc, str, x, y, o = {}) {
    dc.font = `${o.weight || 400} ${o.size || 12}px ${o.family || EX.FONT.mono}`;
    dc.textAlign = o.align || 'left'; dc.textBaseline = o.base || 'alphabetic';
    if ('letterSpacing' in dc) dc.letterSpacing = (o.spacing || 0) + 'px';
    dc.globalAlpha = o.alpha == null ? 1 : o.alpha; dc.fillStyle = o.color || EX.PAL.ink;
    if (o.halo) { dc.strokeStyle = o.halo; dc.lineWidth = 4; dc.lineJoin = 'round'; dc.strokeText(str, x, y); }
    dc.fillText(str, x, y); dc.globalAlpha = 1; if ('letterSpacing' in dc) dc.letterSpacing = '0px';
    return dc.measureText(str).width;
  };
  EX.fmt = (n, d = 0) => U.tabular(n, 0, { decimals: d, sep: ',' });

  /* ── marching squares: iso-lines of a field (pw×ph at scale R) → Path2D in design units ── */
  EX.contours = function (F, pw, ph, R, levels, ox, oy) {
    const out = levels.map(() => new Path2D());
    levels.forEach((lv, li) => {
      const P = out[li];
      for (let y = 0; y < ph - 1; y++) for (let x = 0; x < pw - 1; x++) {
        const a = F[y * pw + x], b = F[y * pw + x + 1], c = F[(y + 1) * pw + x + 1], d = F[(y + 1) * pw + x];
        const idx = (a > lv ? 8 : 0) | (b > lv ? 4 : 0) | (c > lv ? 2 : 0) | (d > lv ? 1 : 0);
        if (idx === 0 || idx === 15) continue;
        const X = v => ox + (v + 0.5) / R, Y = v => oy + (v + 0.5) / R;
        const top = () => [X(x + (lv - a) / (b - a)), Y(y)], right = () => [X(x + 1), Y(y + (lv - b) / (c - b))];
        const bot = () => [X(x + (lv - d) / (c - d)), Y(y + 1)], left = () => [X(x), Y(y + (lv - a) / (d - a))];
        const seg = (p, q) => { P.moveTo(p[0], p[1]); P.lineTo(q[0], q[1]); };
        switch (idx) {
          case 1: case 14: seg(left(), bot()); break;
          case 2: case 13: seg(bot(), right()); break;
          case 3: case 12: seg(left(), right()); break;
          case 4: case 11: seg(top(), right()); break;
          case 6: case 9: seg(top(), bot()); break;
          case 7: case 8: seg(left(), top()); break;
          case 5: seg(left(), top()); seg(bot(), right()); break;
          case 10: seg(top(), right()); seg(left(), bot()); break;
        }
      }
    });
    return out;
  };

  root.EX = EX;
})(typeof window !== 'undefined' ? window : globalThis);
