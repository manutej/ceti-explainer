/* run.kit.js — THE RUN (knitted cloth) shared kit. Concatenated before each film by make.sh.
   A procedural stockinette stitch atlas (rip-mapped), a forward column splatter with exact horizontal coverage,
   closed-form drape, a felt ground with a cloth shadow, knitted-chart lettering. Pure: every output is a function
   of its inputs (no clocks, no Math.random). Design: 1 world unit = one column pitch; a row is HU = 0.72 units. */
(function (root) {
  'use strict';
  const SPU = 64;                 // sprite pixels per unit at level 0
  const HU = 0.72;                // row height in units (stockinette: stitches wider than tall)
  const TOP = 0.24, BOT = 0.46;   // sprite margins above / below the cell (units)
  const SHU = TOP + HU + BOT;     // sprite height in units
  const SW = SPU, SH = Math.ceil(SHU * SPU);
  const NL = 7;                   // rip levels per axis (64 → 1)
  const KIND = { EMPTY: 0, KNIT: 1, BAR: 2, CRIMP: 3, LOOP: 4, BIND: 5, LOOSE: 6 };

  /* hashing (pure) */
  function mix32(x) { x |= 0; x ^= x >>> 16; x = Math.imul(x, 0x7feb352d); x ^= x >>> 15; x = Math.imul(x, 0x846ca68b); x ^= x >>> 16; return x >>> 0; }
  const hh = (a, b, c) => mix32(mix32(mix32(a * 73856093) ^ (b * 19349663)) ^ (c * 83492791)) / 4294967296;
  const RT = new Float32Array(8192); for (let i = 0; i < RT.length; i++) RT[i] = hh(i, 77, 5);

  /* ───────── polyline tubes (yarn) ───────── */
  function bez(p0, p1, p2, n = 36) {
    const out = [];
    for (let i = 0; i <= n; i++) { const s = i / n, a = (1 - s) * (1 - s), b = 2 * (1 - s) * s, c = s * s; out.push([a * p0[0] + b * p1[0] + c * p2[0], a * p0[1] + b * p1[1] + c * p2[1]]); }
    return out;
  }
  function prep(pts) { const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return { pts, L, len: L[L.length - 1] }; }
  /* nearest point on polyline: returns [s (0..1 arc), signedDist, tx, ty, arcLen] */
  function nearest(T, x, y) {
    const P = T.pts; let best = 1e9, bs = 0, bd = 0, btx = 1, bty = 0;
    for (let i = 1; i < P.length; i++) {
      const ax = P[i - 1][0], ay = P[i - 1][1], dx = P[i][0] - ax, dy = P[i][1] - ay, l2 = dx * dx + dy * dy || 1e-9;
      let u = ((x - ax) * dx + (y - ay) * dy) / l2; u = u < 0 ? 0 : u > 1 ? 1 : u;
      const qx = ax + u * dx - x, qy = ay + u * dy - y, d2 = qx * qx + qy * qy;
      if (d2 < best) { best = d2; const l = Math.sqrt(l2); btx = dx / l; bty = dy / l; bs = (T.L[i - 1] + u * l) / T.len; bd = (-(x - ax) * bty + (y - ay) * btx) >= 0 ? Math.sqrt(d2) : -Math.sqrt(d2); }
    }
    return [bs, bd, btx, bty, bs * T.len];
  }
  const LX = -0.5, LY = -0.62, LZ = 0.6; const LN = Math.hypot(LX, LY, LZ); const Lx = LX / LN, Ly = LY / LN, Lz = LZ / LN;
  /** shade one yarn tube at (x,y) → [D, S, A] or null. o: {r(s), twist, pitch, ao0, ao1, fuzz, seed} */
  function tubeAt(T, o, x, y, px, py) {
    const n = nearest(T, x, y), s = n[0], r = o.r(s), nd = n[1] / r, ad = Math.abs(nd);
    if (ad > 1.5) return null;
    if (ad <= 1) {
      const nz = Math.sqrt(1 - nd * nd), nx = -n[3] * nd, ny = n[2] * nd;
      const lam = Math.max(0, nx * Lx + ny * Ly + nz * Lz);
      const phase = n[4] / o.pitch + nd * 0.42 * o.twist;
      const pl = 0.5 + 0.5 * Math.cos(2 * Math.PI * phase);
      const groove = 0.66 + 0.34 * Math.pow(pl, 0.55);
      const fib = 0.9 + 0.2 * hh(px, py, o.seed) * (0.6 + 0.4 * hh(Math.floor(n[4] * 40), Math.floor(nd * 6), o.seed + 1));
      let ao = 1 - 0.3 * nd * nd * nd * nd;
      if (o.ao0) ao *= 0.3 + 0.7 * Math.min(1, s / o.ao0);
      if (o.ao1) ao *= 0.45 + 0.55 * Math.min(1, (1 - s) / o.ao1);
      const D = (0.28 + 0.9 * lam) * groove * fib * ao;
      const hv = Math.max(0, 2 * nz * (nx * Lx + ny * Ly + nz * Lz) * nz - Lz);
      const S = 0.09 * Math.pow(hv, 10) * pl * ao;
      return [D, S, 1];
    }
    const f = (ad - 1) / 0.5, streak = hh(Math.floor(n[4] * 55 + nd * 3), Math.floor(ad * 9), o.seed + 7);
    const A = (o.fuzz ?? 0.42) * Math.pow(1 - f, 1.6) * (streak > 0.55 ? 1 : 0.25);
    if (A < 0.01) return null;
    return [0.62 * A, 0, A];
  }
  /* sprite = list of tubes painted in order (later on top), 2×2 supersampled */
  function paintSprite(tubes) {
    const D = new Float32Array(SW * SH), S = new Float32Array(SW * SH), A = new Float32Array(SW * SH);
    for (let py = 0; py < SH; py++) for (let px = 0; px < SW; px++) {
      let d = 0, s = 0, a = 0;
      for (let sy = 0; sy < 2; sy++) for (let sx = 0; sx < 2; sx++) {
        const x = (px + 0.25 + sx * 0.5) / SPU, y = (py + 0.25 + sy * 0.5) / SPU - TOP;
        let cd = 0, cs = 0, ca = 0;
        for (const [T, o] of tubes) {
          const v = tubeAt(T, o, x, y, px * 2 + sx, py * 2 + sy); if (!v) continue;
          cd = v[0] + cd * (1 - v[2]); cs = v[1] + cs * (1 - v[2]); ca = v[2] + ca * (1 - v[2]);
        }
        d += cd; s += cs; a += ca;
      }
      const i = py * SW + px; D[i] = d / 4; S[i] = s / 4; A[i] = a / 4;
    }
    return rip({ w: SW, h: SH, D, S, A });
  }
  function half(L, ax) {
    const w = ax === 0 ? Math.max(1, L.w >> 1) : L.w, h = ax === 1 ? Math.max(1, Math.ceil(L.h / 2)) : L.h;
    const o = { w, h, D: new Float32Array(w * h), S: new Float32Array(w * h), A: new Float32Array(w * h) };
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      let d = 0, s = 0, a = 0, n = 0;
      for (let k = 0; k < 2; k++) {
        const sx = ax === 0 ? Math.min(L.w - 1, x * 2 + k) : x, sy = ax === 1 ? Math.min(L.h - 1, y * 2 + k) : y, j = sy * L.w + sx;
        d += L.D[j]; s += L.S[j]; a += L.A[j]; n++;
      }
      const i = y * w + x; o.D[i] = d / n; o.S[i] = s / n; o.A[i] = a / n;
    }
    return o;
  }
  function rip(L0) {
    const R = []; let col = L0;
    for (let lx = 0; lx < NL; lx++) { const row = []; let cur = col; for (let ly = 0; ly < NL; ly++) { row.push(cur); cur = half(cur, 1); } R.push(row); col = half(col, 0); }
    return R;
  }

  /* ───────── the atlas ───────── */
  let ATLAS = null;
  function atlas() {
    if (ATLAS) return ATLAS;
    const H = HU, S = {};
    const leg = (side, v) => {
      const j = (k) => (RT[(v * 13 + k) & 8191] - 0.5);
      const sx = side < 0 ? 1 : -1, X = x => side < 0 ? x : 1 - x;
      const p0 = [X(0.15 + 0.03 * j(1)), -0.13 + 0.04 * j(2)], p1 = [X(0.12 + 0.03 * j(3)), 0.46 * H + 0.05 * j(4)], p2 = [X(0.47 + 0.015 * j(5)), H + 0.2];
      const rr = 0.2 * (1 + 0.07 * j(6));
      return [prep(bez(p0, p1, p2)), { r: s => rr * (0.78 + 0.22 * Math.sin(Math.PI * Math.min(1, s * 1.15))), twist: side * sx, pitch: 0.105, ao0: 0.32, ao1: 0.12, seed: v * 7 + (side < 0 ? 1 : 2) }];
    };
    const knit = (v, loose) => {
      const L = leg(-1, v), R = leg(1, v);
      if (loose) { [L, R].forEach(t => { const r0 = t[1].r; t[1].r = s => r0(s) * 0.55; t[1].fuzz = 0.75; }); }
      return [R, L];
    };
    S[KIND.KNIT] = [0, 1, 2, 3].map(v => paintSprite(knit(v)));
    S[KIND.LOOSE] = [4, 5].map(v => paintSprite(knit(v, true)));
    const bar = (v, crimp) => {
      const pts = []; for (let i = 0; i <= 48; i++) { const s = i / 48; pts.push([-0.04 + 1.08 * s, 0.34 * H + 0.05 * Math.sin(Math.PI * s) + (crimp ? 0.075 * Math.sin(s * Math.PI * 2 * 3.0 + v) : 0)]); }
      return [[prep(pts), { r: () => (crimp ? 0.07 : 0.06), twist: 1, pitch: crimp ? 0.07 : 0.11, seed: 40 + v, fuzz: crimp ? 0.45 : 0.3 }]];
    };
    S[KIND.BAR] = [0, 1].map(v => paintSprite(bar(v, false)));
    S[KIND.CRIMP] = [0, 1].map(v => paintSprite(bar(v, true)));
    const loop = v => {
      const pts = [], n = 60;
      for (let i = 0; i <= n; i++) {
        const a = Math.PI * (i / n);            // a U: down the left, round the bottom, up the right
        const x = 0.5 - 0.3 * Math.cos(a) * (1 + 0.1 * Math.sin(a * 3 + v)), y = -0.1 + (H + 0.36) * Math.sin(a) ** 0.6;
        pts.push([x, y]);
      }
      return [[prep(pts), { r: s => 0.19 * (0.85 + 0.15 * Math.sin(Math.PI * s)), twist: 1, pitch: 0.1, ao0: 0.1, ao1: 0.1, seed: 60 + v, fuzz: 0.55 }]];
    };
    S[KIND.LOOP] = [0, 1].map(v => paintSprite(loop(v)));
    const bind = v => {
      const k = knit(v + 8), pts = []; for (let i = 0; i <= 40; i++) { const a = 2 * Math.PI * i / 40; pts.push([0.5 + 0.44 * Math.cos(a), -0.02 + 0.13 * Math.sin(a)]); }
      return k.concat([[prep(pts), { r: () => 0.085, twist: -1, pitch: 0.09, seed: 90 + v }]]);
    };
    S[KIND.BIND] = [0].map(v => paintSprite(bind(v)));
    ATLAS = { S, NV: { 1: 4, 2: 2, 3: 2, 4: 2, 5: 1, 6: 2 } };
    return ATLAS;
  }

  /* ───────── renderer ───────── */
  /** R = canvas-sized float accumulator + output. scale = render px per design px. */
  function renderer(DW, DH, scale) {
    const W = Math.max(16, Math.round(DW * scale)), H = Math.max(9, Math.round(DH * scale));
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const c2 = cv.getContext('2d'); const img = c2.createImageData(W, H);
    return { W, H, scale, dw: DW, dh: DH, cv, c2, img, acc: new Float32Array(W * H * 4), tmp: new Float32Array(W * H), sh: new Float32Array(W * H), felt: null };
  }
  function clear(R) { R.acc.fill(0); }
  const lv = v => { const l = Math.round(Math.log2(Math.max(1e-6, v))); return l < 0 ? 0 : l > NL - 1 ? NL - 1 : l; };
  let sD = 0, sS = 0, sA = 0;
  function samp(L, u, yu) {     // bilinear sample of level L at u∈[0,1], yu (units from sprite top)
    const w = L.w, h = L.h;
    let fx = u * w - 0.5, fy = yu / SHU * h - 0.5;
    if (fx < 0) fx = 0; if (fx > w - 1) fx = w - 1; if (fy < 0) fy = 0; if (fy > h - 1) fy = h - 1;
    const x0 = fx | 0, y0 = fy | 0, x1 = x0 + 1 < w ? x0 + 1 : x0, y1 = y0 + 1 < h ? y0 + 1 : y0, ax = fx - x0, ay = fy - y0;
    const i00 = y0 * w + x0, i10 = y0 * w + x1, i01 = y1 * w + x0, i11 = y1 * w + x1;
    const w00 = (1 - ax) * (1 - ay), w10 = ax * (1 - ay), w01 = (1 - ax) * ay, w11 = ax * ay;
    sD = L.D[i00] * w00 + L.D[i10] * w10 + L.D[i01] * w01 + L.D[i11] * w11;
    sS = L.S[i00] * w00 + L.S[i10] * w10 + L.S[i01] * w01 + L.S[i11] * w11;
    sA = L.A[i00] * w00 + L.A[i10] * w10 + L.A[i01] * w01 + L.A[i11] * w11;
  }
  /**
   * Paint one grid of cells. G: { cols, rows, kind:Uint8Array(cols*rows) [c*rows+m, m=0 top row],
   *   col:Uint8Array (palette index), pal:[[r,g,b] 0..1], colX/colW (design px), colA (0..1), sag (design px at hem, opt),
   *   y0 (design px: top of row 0), rowH (design px), clip:[x0,y0,x1,y1] (design px), idBase (row identity: id = idBase - m),
   *   colBase (column identity offset), jit (shade jitter amount) }
   */
  function paint(R, G) {
    const A = atlas(), S = A.S, NV = A.NV, k = R.scale, W = R.W, acc = R.acc;
    const rows = G.rows, rowH = G.rowH * k, Ht = rows * rowH, y0 = G.y0 * k;
    const pxu = rowH / HU, ly = lv(SPU / pxu);
    const cx0 = Math.max(0, Math.floor(G.clip[0] * k)), cy0 = Math.max(0, Math.floor(G.clip[1] * k));
    const cx1 = Math.min(W, Math.ceil(G.clip[2] * k)), cy1 = Math.min(R.H, Math.ceil(G.clip[3] * k));
    const pal = G.pal, jit = G.jit ?? 0.1, idB = G.idBase | 0, cB = G.colBase | 0;
    for (let c = 0; c < G.cols; c++) {
      const ca = G.colA ? G.colA[c] : 1; if (ca <= 0.003) continue;
      const X = G.colX[c] * k, Wc = G.colW[c] * k; if (Wc <= 0 || X + Wc <= cx0 || X >= cx1) continue;
      const lx = lv(SPU / Wc);
      const sag = G.sag ? G.sag[c] * k : 0, aS = sag > 0.01 ? sag / (Ht * Ht) : 0;
      const ya = Math.max(cy0, Math.floor(y0 - TOP * pxu)), yb = Math.min(cy1, Math.ceil(y0 + Ht + sag + BOT * pxu * (1 + sag / Math.max(1, Ht))));
      if (yb <= ya) continue;
      const pa = Math.max(cx0, Math.floor(X)), pb = Math.min(cx1, Math.ceil(X + Wc));
      const base = c * rows;
      for (let px = pa; px < pb; px++) {
        const l = Math.max(px, X), r = Math.min(px + 1, X + Wc), cov = (r - l) * ca; if (cov <= 0) continue;
        const u = ((l + r) * 0.5 - X) / Wc;
        for (let py = ya; py < yb; py++) {
          let yr = py + 0.5 - y0;
          if (aS && yr > 0) yr = (Math.sqrt(1 + 4 * aS * yr) - 1) / (2 * aS);
          const f = yr / rowH, m = Math.floor(f), fr = f - m;
          let rr = 0, gg = 0, bb = 0, aa = 0;
          for (let dm = 1; dm >= -1; dm--) {
            const mm = m + dm; if (mm < 0 || mm >= rows) continue;
            const yu = TOP + (fr - dm) * HU; if (yu < 0 || yu >= SHU) continue;
            const ki = G.kind[base + mm]; if (!ki) continue;
            const id = idB - mm, hv = RT[((c + cB) * 31 + id * 977 + 4096) & 8191];
            const spr = S[ki][((hv * 64) | 0) % NV[ki]];
            samp(spr[lx][ly], u, yu); if (sA < 0.002) continue;
            const pc = pal[G.col[base + mm]], j = 1 + jit * (RT[((c + cB) * 7 + id * 131 + 99) & 8191] - 0.5);
            const cr = pc[0] * sD * j + sS, cg = pc[1] * sD * j + sS, cb = pc[2] * sD * j + sS;
            rr = cr + rr * (1 - sA); gg = cg + gg * (1 - sA); bb = cb + bb * (1 - sA); aa = sA + aa * (1 - sA);
          }
          if (aa <= 0) continue;
          const i = (py * W + px) * 4;
          acc[i] += rr * cov; acc[i + 1] += gg * cov; acc[i + 2] += bb * cov; acc[i + 3] += aa * cov;
        }
      }
    }
  }
  /* felt ground: undyed dark fleece, fibrous, fixed per size */
  function felt(R, U, rgb, seed = 11) {
    if (R.felt && R.feltKey === rgb.join(',') + seed) return R.felt;
    const W = R.W, H = R.H, k = R.scale, F = new Float32Array(W * H * 3);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const X = x / k, Y = y / k;
      const n1 = U.fbm(seed, 4, X / 70, Y / 70), n2 = U.noise2(seed + 3, X / 2.2 + Y / 9, Y / 2.6 - X / 11), n3 = U.noise2(seed + 5, X / 7 - Y / 3, X / 4 + Y / 6);
      const g = hh(x, y, seed) - 0.5;
      const v = 0.86 + 0.22 * n1 + 0.1 * (n2 - 0.5) + 0.08 * (n3 - 0.5) + 0.06 * g;
      const vg = 1 - (R.vig ?? 0.16) * Math.pow(Math.hypot((X - R.dw / 2) / (R.dw * 0.58), (Y - R.dh / 2) / (R.dh * 0.7)), 2.2);
      const i = (y * W + x) * 3; F[i] = rgb[0] * v * vg; F[i + 1] = rgb[1] * v * vg; F[i + 2] = rgb[2] * v * vg;
    }
    R.felt = F; R.feltKey = rgb.join(',') + seed; return F;
  }
  function boxBlur(src, dst, W, H, r) {   // separable, two passes each axis (≈ gaussian)
    const tmp = new Float32Array(W * H);
    const pass = (a, b, horiz) => {
      const n = horiz ? W : H, m = horiz ? H : W, inv = 1 / (2 * r + 1);
      for (let j = 0; j < m; j++) {
        let s = 0; const at = i => (horiz ? a[j * W + Math.min(n - 1, Math.max(0, i))] : a[Math.min(n - 1, Math.max(0, i)) * W + j]);
        for (let i = -r; i <= r; i++) s += at(i);
        for (let i = 0; i < n; i++) { if (horiz) b[j * W + i] = s * inv; else b[i * W + j] = s * inv; s += at(i + r + 1) - at(i - r); }
      }
    };
    pass(src, tmp, true); pass(tmp, dst, false); pass(dst, tmp, true); pass(tmp, dst, false);
  }
  /** composite acc over the felt with a soft cloth shadow; then blit to the p5 canvas (design units). */
  function finish(R, p, opt = {}) {
    const W = R.W, H = R.H, acc = R.acc, F = R.felt, d = R.img.data, k = R.scale;
    const A = R.tmp; for (let i = 0, n = W * H; i < n; i++) A[i] = Math.min(1, acc[i * 4 + 3]);
    const r = Math.max(1, Math.round((opt.blur ?? 3) * k)); boxBlur(A, R.sh, W, H, r);
    const dx = Math.round((opt.dx ?? 2) * k), dy = Math.round((opt.dy ?? 3.5) * k), ks = opt.shadow ?? 0.62;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = y * W + x, sx = x - dx, sy = y - dy;
      const sh = sx >= 0 && sy >= 0 ? R.sh[sy * W + sx] : 0;
      const a = A[i], fm = (1 - a) * (1 - ks * sh);
      const o = i * 4, f = i * 3, ra = acc[o + 3], nm = ra > 1 ? 1 / ra : 1;   // overlapping columns (mid-sort): renormalise
      d[o] = (acc[o] * nm + F[f] * fm) * 255; d[o + 1] = (acc[o + 1] * nm + F[f + 1] * fm) * 255; d[o + 2] = (acc[o + 2] * nm + F[f + 2] * fm) * 255; d[o + 3] = 255;
    }
    R.c2.putImageData(R.img, 0, 0);
    p.drawingContext.drawImage(R.cv, opt.x || 0, opt.y || 0, R.W / k, R.H / k);
  }

  /* ───────── knitted chart lettering ───────── */
  const _charts = new Map();
  /** bitmap chart of `str`: cap height `rows` stitches; returns {w, h, bits} (bits[y*w+x] = 1 for letter). */
  function chart(str, rows, opt = {}) {
    const key = str + '|' + rows + '|' + (opt.weight || 600) + (opt.family || 'Jost');
    if (_charts.has(key)) return _charts.get(key);
    const ss = 8, fam = opt.family || 'Jost', wt = opt.weight || 600;
    const cv = document.createElement('canvas'), g = cv.getContext('2d');
    const fs = rows / 0.7 * ss;                       // cap height ≈ 0.7 em
    g.font = `${wt} ${fs}px "${fam}"`;
    const track = (opt.track ?? 0.06) * fs, wpx = Math.ceil((g.measureText(str).width + track * str.length) * HU) + ss * 2;
    const hpx = Math.ceil(rows * ss / 0.7 * 1.0) + ss * 2;
    cv.width = wpx; cv.height = hpx;
    g.font = `${wt} ${fs}px "${fam}"`; g.fillStyle = '#000'; g.fillRect(0, 0, wpx, hpx); g.fillStyle = '#fff'; g.textBaseline = 'alphabetic';
    g.setTransform(HU, 0, 0, 1, 0, 0);
    let x = ss / HU; for (const ch of str) { g.fillText(ch, x, ss + rows * ss); x += g.measureText(ch).width + track; }
    const im = g.getImageData(0, 0, wpx, hpx).data;
    const w = Math.ceil(wpx / ss), h = Math.ceil(hpx / ss), bits = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) for (let xx = 0; xx < w; xx++) {
      let s = 0, n = 0;
      for (let j = 0; j < ss; j++) for (let i = 0; i < ss; i++) { const X = xx * ss + i, Y = y * ss + j; if (X < wpx && Y < hpx) { s += im[(Y * wpx + X) * 4]; n++; } }
      bits[y * w + xx] = s / (n * 255) > (opt.thresh ?? 0.42) ? 1 : 0;
    }
    // trim empty columns/rows
    let x0 = w, x1 = -1, y0 = h, y1 = -1;
    for (let y = 0; y < h; y++) for (let xx = 0; xx < w; xx++) if (bits[y * w + xx]) { x0 = Math.min(x0, xx); x1 = Math.max(x1, xx); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    const tw = x1 - x0 + 1, th = y1 - y0 + 1, tb = new Uint8Array(Math.max(0, tw * th));
    for (let y = 0; y < th; y++) for (let xx = 0; xx < tw; xx++) tb[y * tw + xx] = bits[(y + y0) * w + xx + x0];
    const out = { w: tw, h: th, bits: tb }; _charts.set(key, out); return out;
  }

  /* ───────── vector props (screen space) ───────── */
  function needle(p, x0, x1, y, th, col) {       // slate knitting needle: a metal rod with a sheen
    const c = p.drawingContext; th = Math.max(1.2, th);
    c.save();
    if (th > 4) { c.fillStyle = 'rgba(0,0,0,0.35)'; c.beginPath(); if (c.roundRect) c.roundRect(x0 + th * 0.2, y - th / 2 + th * 0.35, x1 - x0, th, th / 2); else c.rect(x0, y, x1 - x0, th); c.fill(); }
    const g = c.createLinearGradient(0, y - th / 2, 0, y + th / 2);
    g.addColorStop(0, col.mid); g.addColorStop(0.18, col.hi); g.addColorStop(0.32, col.mid); g.addColorStop(0.8, col.lo); g.addColorStop(1, col.lo);
    c.fillStyle = g; c.beginPath();
    if (c.roundRect) c.roundRect(x0, y - th / 2, x1 - x0, th, th / 2); else c.rect(x0, y - th / 2, x1 - x0, th);
    c.fill(); c.restore();
  }
  function hook(p, x, y, ang, len, th, col, catchU = 0) {   // sage crochet hook: tip at (x,y), shaft along ang
    const c = p.drawingContext; c.save(); c.translate(x, y); c.rotate(ang);
    const g = c.createLinearGradient(0, -th / 2, 0, th / 2); g.addColorStop(0, col.hi); g.addColorStop(0.4, col.mid); g.addColorStop(1, col.lo);
    c.fillStyle = g; c.beginPath();
    c.moveTo(0, -th * 0.35); c.quadraticCurveTo(-th * 0.6, -th * 0.5, -th * 0.55, 0); c.quadraticCurveTo(-th * 0.5, th * 0.5, 0, th * 0.5);
    c.lineTo(th * 0.9, th * 0.5); c.lineTo(th * 1.2, th * 0.05); c.lineTo(th * 1.5, th * 0.5);
    c.lineTo(len * 0.35, th * 0.5); c.lineTo(len * 0.38, th * 0.62); c.lineTo(len, th * 0.62); c.lineTo(len, -th * 0.62); c.lineTo(len * 0.38, -th * 0.62); c.lineTo(len * 0.35, -th * 0.5);
    c.closePath();
    c.save(); c.translate(th * 0.25, th * 0.45); c.fillStyle = 'rgba(0,0,0,0.38)'; c.fill(); c.restore();
    c.fill(); c.lineWidth = Math.max(0.8, th * 0.06); c.strokeStyle = col.lo; c.stroke();
    c.fillStyle = 'rgba(0,0,0,0.28)'; c.beginPath(); c.ellipse(th * 1.2, th * 0.3, th * 0.28, th * 0.18, 0, 0, Math.PI * 2); c.fill();
    c.restore();
  }

  function strand(p, pts, w, col) {   // a plied yarn strand along a screen polyline: shadow, body, ply highlights
    const c = p.drawingContext; c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
    const path = (dx, dy) => { c.beginPath(); pts.forEach((q, i) => (i ? c.lineTo(q[0] + dx, q[1] + dy) : c.moveTo(q[0] + dx, q[1] + dy))); };
    path(w * 0.3, w * 0.55); c.strokeStyle = 'rgba(40,28,18,0.28)'; c.lineWidth = w * 1.1; c.stroke();
    path(0, 0); c.strokeStyle = col.lo; c.lineWidth = w; c.stroke();
    path(0, -w * 0.12); c.strokeStyle = col.mid; c.lineWidth = w * 0.7; c.stroke();
    c.setLineDash([w * 0.9, w * 0.7]); path(-w * 0.1, -w * 0.22); c.strokeStyle = col.hi; c.lineWidth = w * 0.28; c.stroke();
    c.restore();
  }
  const srgb = hx => { hx = hx.replace('#', ''); const n = parseInt(hx, 16); return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]; };
  root.RunKit = { SPU, HU, TOP, BOT, KIND, atlas, renderer, clear, paint, felt, finish, chart, needle, hook, strand, srgb, hh, RT };
})(typeof window !== 'undefined' ? window : globalThis);
