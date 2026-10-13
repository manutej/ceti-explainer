/* delta.kit.js — SEDIMENT DELTA shared kit (terrain, rivers, prograding-bar deposition, cartographic type).
   Pure: everything here is a function of its arguments and the seed (counter hash). No p5 state is kept
   between frames except cached offscreen canvases built once. Concatenated before each film by make.sh. */
const DK = (() => {
  const U = Atelier.U, h = U.h, clamp = U.clamp, lerp = U.lerp;

  /* palette: CETI semantics re-tuned (L/C) for an umber survey ground; meaning unchanged */
  const PAL = {
    ground: '#3A2D21',
    ink: '#F3EBDC', dim: '#C9B793', faint: 'rgba(243,235,220,0.55)', inkDark: '#20160F',
    copper: '#E9B27C', copperRim: '#7A4E2C', copperLo: '#C98F5C',
    peach: '#EE9A68', peachRim: '#7C3F22', peachHi: '#F7BE94',
    sage: '#B2D3A3', sageRim: '#3F5A39', sageLine: '#9CC28C',
    slate: '#86A4BF',
    water: '#5C7C97', waterDeep: '#4D6A84', waterEdge: '#9BB4C8',
    bed: '#86704F', bedEdge: '#A48B63',
    sea: '#2C3D4C', seaDeep: '#1F2B37', seaShallow: '#6E8C99',
    weir: '#E4D8C0',
  };
  const rgba = U.rgba;

  /* ───── rivers: Catmull-Rom centrelines resampled at 1 px of arc length; everything is parametrised by s ───── */
  function PathRiver(o) {
    const P = o.pts, dense = [];
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
      for (let k = 0; k < 40; k++) {
        const t = k / 40, t2 = t * t, t3 = t2 * t;
        const f = (a, b, c, d) => 0.5 * ((2 * b) + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
        dense.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
      }
    }
    dense.push(P[P.length - 1]);
    const X = [dense[0][0]], Y = [dense[0][1]]; let acc = 0, need = 1;
    for (let i = 1; i < dense.length; i++) {
      const ax = dense[i - 1][0], ay = dense[i - 1][1], bx = dense[i][0], by = dense[i][1], d = Math.hypot(bx - ax, by - ay);
      while (acc + d >= need) { const u = (need - acc) / d; X.push(ax + (bx - ax) * u); Y.push(ay + (by - ay) * u); need += 1; }
      acc += d;
    }
    const n = X.length, TX = new Float32Array(n), TY = new Float32Array(n);
    for (let i = 0; i < n; i++) { const a = Math.max(0, i - 3), c = Math.min(n - 1, i + 3), dx = X[c] - X[a], dy = Y[c] - Y[a], l = Math.hypot(dx, dy) || 1; TX[i] = dx / l; TY[i] = dy / l; }
    const R = Object.assign({}, o, { X, Y, TX, TY, L: n - 1 });
    const idx = s => clamp(s, 0, n - 1.001);
    R.p = s => { s = idx(s); const i = Math.floor(s), u = s - i; return [X[i] + (X[i + 1] - X[i]) * u, Y[i] + (Y[i + 1] - Y[i]) * u]; };
    R.tan = s => { const i = Math.round(idx(s)); return [TX[i], TY[i]]; };
    /** unit normal to the LEFT of the flow (north for an eastward river) */
    R.nrm = s => { const i = Math.round(idx(s)); return [TY[i], -TX[i]]; };
    R.at = (s, l) => { const q = R.p(s), m = R.nrm(s); return [q[0] + m[0] * l, q[1] + m[1] * l]; };
    const w0 = o.ws0 ?? 40, w1 = R.L - (o.we ?? 30);
    R.weirS = Array.from({ length: o.nW || 0 }, (_, j) => w0 + j * (w1 - w0) / Math.max(1, (o.nW || 1) - 1));
    R.sectionBlend = s => {
      let k = 0; for (let j = 0; j < R.weirS.length; j++) if (s > R.weirS[j]) k = j + 1;
      if (k === 0) return [0, 0, 0];
      return [k - 1, k, U.smoothstep(R.weirS[k - 1] + 1, R.weirS[k - 1] + 11, s)];
    };
    /** coarse samples for terrain carving / nearest-point queries */
    R.samples = step => { const out = []; for (let s = 0; s <= R.L; s += step) out.push(R.p(s)); return out; };
    return R;
  }

  /** meander a sparse course: lateral sine offsets (two wavelengths, hashed phases), tapered at both ends */
  function meander(pts, seed, amp, wl) {
    const B = PathRiver({ pts, nW: 0 }), out = [];
    const p1 = h(seed, 1, 2, 3) * 6.28, p2 = h(seed, 4, 5, 6) * 6.28;
    for (let s = 0; s <= B.L; s += 6) {
      const tp = Math.min(1, s / 40, (B.L - s) / 30), off = tp * amp * (Math.sin(s / wl * 6.2832 + p1) + 0.45 * Math.sin(s / (wl * 0.43) * 6.2832 + p2));
      out.push(B.at(s, off));
    }
    out.push(B.p(B.L));
    return out;
  }
  /** deterministic dendritic tributaries: seeded heads in the uplands walk (meandering) toward the nearest
      channel or an earlier tributary, so the network is a tree that drains into the main rivers. */
  function tributaries(seed, n, mains, W, Hh, okHead) {
    const targets = []; for (const R of mains) for (const q of R.samples(8)) targets.push(q);
    const occ = new Map(), cellKey = (x, y) => Math.floor(x / 6) + ',' + Math.floor(y / 6), out = [];
    for (let i = 0; i < n * 4 && out.length < n; i++) {
      const x0 = h(seed, i, 1, 71) * W, y0 = h(seed, i, 2, 71) * Hh;
      let dmin = 1e9; for (const q of targets) dmin = Math.min(dmin, Math.hypot(q[0] - x0, q[1] - y0));
      if (dmin < 70 || (okHead && !okHead(x0, y0))) continue;
      const pts = [[x0, y0]]; let x = x0, y = y0, joined = false;
      for (let st = 0; st < 260; st++) {
        let best = null, bd = 1e9; for (const q of targets) { const d = Math.hypot(q[0] - x, q[1] - y); if (d < bd) { bd = d; best = q; } }
        if (bd < 14) { pts.push(best); joined = true; break; }
        const a0 = Math.atan2(best[1] - y, best[0] - x) + (U.noise1(seed + i * 13, st / 7) - 0.5) * 1.9;
        x += Math.cos(a0) * 3; y += Math.sin(a0) * 3; pts.push([x, y]);
        const ck = cellKey(x, y); if (st > 6 && occ.has(ck) && occ.get(ck) !== i) { joined = true; break; }
      }
      if (!joined || pts.length < 8) continue;
      for (const q of pts) occ.set(cellKey(q[0], q[1]), i);
      out.push({ pts, w: 0.5 + 0.9 * h(seed, i, 3, 71) });
    }
    return out;
  }

  /* ───── prograding-bar deposition (flat top at Hmax layers, avalanche foreset at repose) ─────
     Grains are added sequentially (arrival order). A grain enters at row 0 (the bank / the mouth) in a
     hashed column, then rolls to the lowest neighbour that is ≥1 layer lower (outward preferred), and is
     pushed outward over a full cell. Prefix-consistent: placement i depends only on grains 0..i-1. */
  function Deposit(o) {
    const C = o.cols, Rm = o.rows || 90, Hm = o.hmax, H = new Int8Array(C * Rm), cell = o.cell;
    const placed = [];
    let maxRow = 0;
    const span = o.span || (() => [0, C - 1]);
    const inSpan = (cc, rr) => { const s = span(rr); return cc >= s[0] && cc <= s[1]; };
    function add(tag) {
      const s0 = span(0);
      let c = s0[0] + Math.floor(h(o.seed, tag, 11, o.key) * (s0[1] - s0[0] + 1)), r = 0, guard = 0;
      // enter near the centre line of the bar more often (a jet leaving the channel)
      if (o.centred) c = clamp(Math.round((s0[0] + s0[1]) / 2 + (h(o.seed, tag, 14, o.key) - 0.5) * (s0[1] - s0[0] + 1) * 0.9), s0[0], s0[1]);
      // 1) carried across the flat top (cells at water level, H = Hm) to the nearest cell that is not full:
      //    breadth-first over the plateau; ties → nearer the bank, then hashed. Rows fill before the bar progrades.
      if (H[c * Rm + r] >= Hm) {
        const seen = new Uint8Array(C * Rm); let frontier = [[c, r]]; seen[c * Rm + r] = 1; let found = null;
        while (frontier.length && !found) {
          const next = [], cand = [];
          for (const [cc, rr] of frontier) for (const [dc_, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const x = cc + dc_, y = rr + dr; if (x < 0 || x >= C || y < 0 || y >= Rm || !inSpan(x, y) || seen[x * Rm + y]) continue;
            seen[x * Rm + y] = 1; if (H[x * Rm + y] >= Hm) next.push([x, y]); else cand.push([x, y]);
          }
          if (cand.length) {
            cand.sort((p, q) => p[1] - q[1] || h(o.seed, tag, p[0] * 131 + p[1], o.key) - h(o.seed, tag, q[0] * 131 + q[1], o.key));
            found = cand[0];
          }
          frontier = next;
        }
        if (found) { c = found[0]; r = found[1]; }
      }
      // 2) avalanche: roll to any neighbour at least one layer lower (the foreset stands at the angle of repose)
      while (guard++ < 200) {
        const hc = H[c * Rm + r];
        let bc = -1, br = -1, bh = hc - 1, bp = 9;
        const tryN = (cc, rr, pri) => {
          if (cc < 0 || cc >= C || rr < 0 || rr >= Rm || !inSpan(cc, rr)) return;
          const hn = H[cc * Rm + rr];
          if (hn > hc - 1) return;
          if (hn < bh || (hn === bh && pri < bp)) { bh = hn; bc = cc; br = rr; bp = pri; }
        };
        const side = h(o.seed, tag, 15 + guard, o.key) < 0.5 ? 1 : -1;
        tryN(c + side, r, 0); tryN(c - side, r, 1); tryN(c, r + 1, 2);
        if (bc < 0) break;
        c = bc; r = br;
      }
      const layer = H[c * Rm + r]; H[c * Rm + r] = layer + 1; if (r > maxRow) maxRow = r;
      const jx = (h(o.seed, tag, 12, o.key) - 0.5) * 0.5, jy = (h(o.seed, tag, 13, o.key) - 0.5) * 0.5;
      const a = (c - (C - 1) / 2) + jx + (r % 2) * 0.5 - 0.25 + layer * 0.28;
      const b = r + 0.5 + jy + layer * 0.22;
      const x = o.ox + o.vx * a * cell + o.ux * b * cell, y = o.oy + o.vy * a * cell + o.uy * b * cell;
      const P = { x, y, layer, c, r, tone: h(o.seed, tag, 16, o.key) };
      placed.push(P); return P;
    }
    /** flat-top-equivalent length (design px) for n grains — the ruler */
    const lengthFor = n => {             // flat-top-equivalent length for n grains (cumulative row capacity)
      let acc = 0;
      for (let r = 0; r < Rm; r++) { const s = span(r), cap = (s[1] - s[0] + 1) * Hm; if (acc + cap >= n) return (r + (n - acc) / cap) * cell; acc += cap; }
      return Rm * cell;
    };
    return { add, placed, lengthFor, o, get rows() { return maxRow + 1; } };
  }

  /* ───── terrain: base relief carved by the drainage network (rivers + tributaries), then hypsometric tint ×
     hillshade, marching-squares contours, coast and bathymetry. The valleys ARE the river network. ───── */
  const _terr = new Map();
  function terrain(key, W, Hh, opt) {
    if (_terr.has(key)) return _terr.get(key);
    const seed = opt.seed | 0, s = 2, gw = Math.ceil(W / s) + 1, gh = Math.ceil(Hh / s) + 1;
    // carve masks: soft strokes of decreasing width, rasterised once at grid resolution
    const mk = (draw) => { const cv = document.createElement('canvas'); cv.width = gw; cv.height = gh; const c = cv.getContext('2d', { willReadFrequently: true });
      c.fillStyle = '#000'; c.fillRect(0, 0, gw, gh); c.scale(1 / s, 1 / s); c.lineCap = 'round'; c.lineJoin = 'round'; draw(c);
      const d = c.getImageData(0, 0, gw, gh).data, m = new Float32Array(gw * gh); for (let i = 0; i < m.length; i++) m[i] = d[i * 4] / 255; return m; };
    const strokeP = (c, pts, w, a) => { c.beginPath(); pts.forEach((q, i) => (i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]))); c.strokeStyle = `rgba(255,255,255,${a})`; c.lineWidth = w; c.stroke(); };
    const valley = mk(c => {
      for (const R of opt.rivers) { const pts = R.samples(3); for (const [w, a] of [[R.valley * 2.2, 0.16], [R.valley * 1.5, 0.2], [R.valley, 0.26], [R.valley * 0.55, 0.38]]) strokeP(c, pts, w, a); }
      for (const T of opt.streams || []) for (const [w, a] of [[26, 0.1], [14, 0.14], [7, 0.2]]) strokeP(c, T.pts, w * (0.7 + T.w * 0.4), a);
    });
    const plain = mk(c => { for (const R of opt.rivers) strokeP(c, R.samples(3), R.plain * 2, 1); });
    const Z = new Float32Array(gw * gh), SEA = new Float32Array(gw * gh);
    for (let gy = 0; gy < gh; gy++) for (let gx = 0; gx < gw; gx++) {
      const x = gx * s, y = gy * s, i = gy * gw + gx;
      const e = U.fbm(seed, 5, x / 160, y / 140), rg = 1 - Math.abs(2 * U.fbm(seed + 31, 4, x / 70 + 3.1, y / 64) - 1);
      let z = (0.62 * e + 0.38 * rg * e) * (opt.base ? opt.base(x, y) : 1);
      z = z * (1 - 0.82 * Math.min(1, valley[i] * 1.1)) + 0.03;
      const fp = U.smoothstep(0.2, 0.9, plain[i]); z = z * (1 - 0.85 * fp) + 0.035 * fp;
      const cd = opt.sea(x, y); SEA[i] = cd;
      if (cd < 0) z = -0.02 + cd / 500; else z *= clamp(cd / 60, 0.2, 1);
      Z[i] = z;
    }
    const cv = document.createElement('canvas'); cv.width = gw; cv.height = gh;
    const c2 = cv.getContext('2d', { willReadFrequently: true }), img = c2.createImageData(gw, gh), D = img.data;
    const ramp = [[0.00, [80, 70, 50]], [0.06, [92, 78, 54]], [0.16, [106, 86, 58]], [0.3, [128, 102, 68]], [0.5, [152, 122, 82]], [1, [184, 152, 106]]];
    const tint = z => { for (let i = 1; i < ramp.length; i++) if (z <= ramp[i][0]) { const u = (z - ramp[i - 1][0]) / (ramp[i][0] - ramp[i - 1][0]); return ramp[i - 1][1].map((v, k) => lerp(v, ramp[i][1][k], u)); } return ramp[ramp.length - 1][1]; };
    const L = [-0.62, -0.62, 0.48], ex = 165;
    const seaA = U.color.hex2rgb(PAL.sea).map(v => v * 255), seaD = U.color.hex2rgb(PAL.seaDeep).map(v => v * 255), seaS = U.color.hex2rgb(PAL.seaShallow).map(v => v * 255);
    for (let gy = 0; gy < gh; gy++) for (let gx = 0; gx < gw; gx++) {
      const i = gy * gw + gx, z = Z[i], o = i * 4;
      if (SEA[i] < 0) {
        const dd = clamp(-SEA[i] / 120), base = dd < 0.14 ? seaS.map((v, k) => lerp(v, seaA[k], dd / 0.14)) : seaA.map((v, k) => lerp(v, seaD[k], (dd - 0.14) / 0.86));
        const nn = U.fbm(seed + 7, 3, gx / 40, gy / 30) - 0.5;
        D[o] = base[0] + nn * 10; D[o + 1] = base[1] + nn * 10; D[o + 2] = base[2] + nn * 12; D[o + 3] = 255; continue;
      }
      const zx = (Z[gy * gw + Math.min(gw - 1, gx + 1)] - Z[gy * gw + Math.max(0, gx - 1)]) * ex / (2 * s);
      const zy = (Z[Math.min(gh - 1, gy + 1) * gw + gx] - Z[Math.max(0, gy - 1) * gw + gx]) * ex / (2 * s);
      const nl = Math.hypot(zx, zy, 1), sh = clamp((-zx * L[0] - zy * L[1] + L[2]) / nl / 0.48, 0, 1.6);
      const t = tint(clamp(z)), kk = 0.62 + 0.4 * sh;
      D[o] = t[0] * kk; D[o + 1] = t[1] * kk; D[o + 2] = t[2] * kk; D[o + 3] = 255;
    }
    c2.putImageData(img, 0, 0);
    const out = document.createElement('canvas'); out.width = W; out.height = Hh;
    const o2 = out.getContext('2d', { willReadFrequently: true }); o2.imageSmoothingEnabled = true; o2.imageSmoothingQuality = 'high';
    o2.drawImage(cv, 0, 0, gw * s, gh * s);
    const gimg = o2.getImageData(0, 0, W, Hh), G = gimg.data;
    for (let y = 0; y < Hh; y++) for (let x = 0; x < W; x++) {
      const o = (y * W + x) * 4, nn = (h(seed, x, y, 5, 9) - 0.5) * 12 + (U.noise2(seed + 3, x / 3.1, y / 3.1) - 0.5) * 9;
      G[o] += nn; G[o + 1] += nn * 0.92; G[o + 2] += nn * 0.8;
    }
    o2.putImageData(gimg, 0, 0);
    for (let lv = 1; lv < 26; lv++) {           // contours, index contour every 5th
      const iso = lv * 0.035; o2.beginPath();
      for (let gy = 0; gy < gh - 1; gy++) for (let gx = 0; gx < gw - 1; gx++) {
        if (SEA[gy * gw + gx] < 0) continue;
        const a = Z[gy * gw + gx], b = Z[gy * gw + gx + 1], c = Z[(gy + 1) * gw + gx + 1], d = Z[(gy + 1) * gw + gx];
        const id = (a > iso ? 8 : 0) | (b > iso ? 4 : 0) | (c > iso ? 2 : 0) | (d > iso ? 1 : 0);
        if (id === 0 || id === 15) continue;
        const X = gx * s, Y = gy * s, f = (p, q) => (iso - p) / (q - p);
        const T = [X + f(a, b) * s, Y], Rr = [X + s, Y + f(b, c) * s], B = [X + f(d, c) * s, Y + s], Lf = [X, Y + f(a, d) * s];
        const sg = (P, Q) => { o2.moveTo(P[0], P[1]); o2.lineTo(Q[0], Q[1]); };
        switch (id) { case 1: case 14: sg(Lf, B); break; case 2: case 13: sg(B, Rr); break; case 3: case 12: sg(Lf, Rr); break;
          case 4: case 11: sg(T, Rr); break; case 6: case 9: sg(T, B); break; case 7: case 8: sg(Lf, T); break;
          case 5: sg(Lf, T); sg(B, Rr); break; case 10: sg(T, Rr); sg(Lf, B); break; }
      }
      const index = lv % 5 === 0; o2.strokeStyle = index ? 'rgba(28,18,10,0.4)' : 'rgba(28,18,10,0.2)'; o2.lineWidth = index ? 0.9 : 0.5; o2.stroke();
    }
    // tributary streams (ground: the drainage that shaped the valleys), thinning toward their heads
    for (const T of opt.streams || []) {
      const n = T.pts.length;
      for (let i = 1; i < n; i++) {
        const u = i / n; o2.beginPath(); o2.moveTo(T.pts[i - 1][0], T.pts[i - 1][1]); o2.lineTo(T.pts[i][0], T.pts[i][1]);
        o2.strokeStyle = `rgba(104,136,162,${0.45 + 0.45 * u})`; o2.lineWidth = (0.5 + 1.4 * u) * (0.7 + T.w * 0.5); o2.lineCap = 'round'; o2.stroke();
      }
    }
    // coast + bathymetry from the sea field (marching squares on the sign of SEA, then offsets)
    for (const [lvl, st, lw] of [[0, 'rgba(214,196,152,0.6)', 1.5], [-10, 'rgba(170,198,214,0.16)', 0.7], [-26, 'rgba(170,198,214,0.13)', 0.7], [-50, 'rgba(170,198,214,0.11)', 0.7], [-84, 'rgba(170,198,214,0.09)', 0.7]]) {
      o2.beginPath();
      for (let gy = 0; gy < gh - 1; gy++) for (let gx = 0; gx < gw - 1; gx++) {
        const a = SEA[gy * gw + gx] - lvl, b = SEA[gy * gw + gx + 1] - lvl, c = SEA[(gy + 1) * gw + gx + 1] - lvl, d = SEA[(gy + 1) * gw + gx] - lvl;
        const id = (a > 0 ? 8 : 0) | (b > 0 ? 4 : 0) | (c > 0 ? 2 : 0) | (d > 0 ? 1 : 0);
        if (id === 0 || id === 15) continue;
        const X = gx * s, Y = gy * s, f = (p, q) => (-p) / (q - p);
        const T = [X + f(a, b) * s, Y], Rr = [X + s, Y + f(b, c) * s], B = [X + f(d, c) * s, Y + s], Lf = [X, Y + f(a, d) * s];
        const sg = (P, Q) => { o2.moveTo(P[0], P[1]); o2.lineTo(Q[0], Q[1]); };
        switch (id) { case 1: case 14: sg(Lf, B); break; case 2: case 13: sg(B, Rr); break; case 3: case 12: sg(Lf, Rr); break;
          case 4: case 11: sg(T, Rr); break; case 6: case 9: sg(T, B); break; case 7: case 8: sg(Lf, T); break;
          case 5: sg(Lf, T); sg(B, Rr); break; case 10: sg(T, Rr); sg(Lf, B); break; }
      }
      o2.strokeStyle = st; o2.lineWidth = lw; o2.stroke();
    }
    _terr.set(key, out);
    return out;
  }

  /* ───── drawing helpers on the raw 2D context (fast batched discs) ───── */
  /** many discs, one colour, as blits of a cached antialiased sprite (Skia scan-converting ~20k arcs per frame
      costs seconds under SwiftShader/CPU load; a drawImage per grain costs microseconds). Colours must be opaque. */
  const _spr = new Map(); let _K = 1;
  function sprite(r, fill) {
    const key = fill + '|' + r + '|' + _K;
    let sp = _spr.get(key); if (sp) return sp;
    const pad = 1, sz = Math.ceil((2 * r + 2 * pad) * _K), cv = document.createElement('canvas'); cv.width = cv.height = sz;
    const c = cv.getContext('2d', { willReadFrequently: true }); c.scale(_K, _K); c.fillStyle = fill; c.beginPath(); c.arc(r + pad, r + pad, r, 0, 6.2832); c.fill();
    sp = { cv, off: r + pad, size: sz / _K }; _spr.set(key, sp); return sp;
  }
  function discs(dc, pts, r, fill, filter) {
    if (fill.startsWith('rgba')) {          // translucent: fall back to paths (rare, small sets)
      dc.fillStyle = fill; dc.beginPath();
      for (const q of pts) { if (filter && !filter(q)) continue; dc.moveTo(q.x + r, q.y); dc.arc(q.x, q.y, r, 0, 6.2832); }
      dc.fill(); return;
    }
    const sp = sprite(r, fill);
    for (let i = 0; i < pts.length; i++) { const q = pts[i]; if (filter && !filter(q)) continue; dc.drawImage(sp.cv, q.x - sp.off, q.y - sp.off, sp.size, sp.size); }
  }
  function discsXY(dc, xs, ys, n, r, fill) {
    dc.beginPath();
    for (let i = 0; i < n; i++) { dc.moveTo(xs[i] + r, ys[i]); dc.arc(xs[i], ys[i], r, 0, 6.2832); }
    dc.fillStyle = fill; dc.fill();
  }
  /** a settled sediment body: rim (wet margin), body, then grains in three tones; layer>0 lighter */
  function sediment(dc, pts, col, opt = {}) {
    if (!pts.length) return;
    const r = opt.r || 1.15, g = opt.grainR || 1;
    if (opt.fringe) { discs(dc, pts, r * 6.2, opt.fringe2 || opt.fringe); discs(dc, pts, r * 3.9, opt.fringe); }
    discs(dc, pts, r * (opt.rimR || 2.1), col.rim);
    discs(dc, pts, r * (opt.bodyR || 1.7), col.body);
    discs(dc, pts, r * g, col.lo, q => q.layer === 0 && q.tone < 0.5);
    discs(dc, pts, r * g, col.mid, q => q.layer === 0 && q.tone >= 0.5);
    discs(dc, pts, r * g * 0.95, col.hi, q => q.layer > 0);
  }
  const TONES = {
    peach: { rim: '#94512F', body: '#D27F52', lo: '#E08C5C', mid: PAL.peach, hi: PAL.peachHi },
    copper: { rim: PAL.copperRim, body: '#B98250', lo: PAL.copperLo, mid: PAL.copper, hi: '#F6CFA3' },
    sage: { rim: PAL.sageRim, body: '#7E9E71', lo: '#9CC08C', mid: PAL.sage, hi: '#D2E8C6' },
  };

  /* ───── CPU surface: SwiftShader GPU raster of thousands of AA paths is slow; a willReadFrequently canvas
     rasterises on the CPU. Everything is drawn here, then blitted once into p5's canvas. ───── */
  let _cpu = null;
  function cpu(k, W = 960, Hh = 540) {
    const w = Math.round(W * k), hh = Math.round(Hh * k);
    if (!_cpu || _cpu.cv.width !== w || _cpu.cv.height !== hh) {
      const cv = document.createElement('canvas'); cv.width = w; cv.height = hh;
      _cpu = { cv, c: cv.getContext('2d', { willReadFrequently: true }) };
    }
    _K = k; const c = _cpu.c; c.setTransform(k, 0, 0, k, 0, 0); c.globalAlpha = 1; c.shadowBlur = 0; c.setLineDash([]);
    return _cpu;
  }

  /* ───── cartographic type (native canvas text: no p5 text pipeline) ───── */
  const FAM = { serif: "'Cormorant Garamond', Georgia, serif", caps: "'IBM Plex Sans Condensed', 'DM Sans', sans-serif", mono: "'IBM Plex Mono', 'Space Mono', monospace" };
  /** font(dc, 'serif'|'caps'|'mono', size, weight, italic) */
  function font(dc, f, size, weight = 500, italic = false) { dc.font = (italic ? 'italic ' : '') + weight + ' ' + size + 'px ' + FAM[f]; dc.textBaseline = 'alphabetic'; }
  const gw = (dc, ch) => ch === ' ' ? Math.max(dc.measureText('n n').width - dc.measureText('nn').width, parseFloat(dc.font.match(/(\d+(\.\d+)?)px/)[1]) * 0.26) : dc.measureText(ch).width;
  /** a halo (knock-out) behind type on terrain, as cartographers do: a soft dark stroke under the fill */
  function glyph(dc, ch, x, y, fill, alpha, halo) {
    dc.globalAlpha = alpha;
    if (halo) { dc.lineJoin = 'round'; dc.strokeStyle = halo; dc.lineWidth = 3.2; dc.strokeText(ch, x, y); }
    dc.fillStyle = fill; dc.fillText(ch, x, y);
    dc.globalAlpha = 1;
  }
  /** letter a string along a river-parallel path pathY(x), centred on xc, letterspaced by track */
  function lettering(dc, str, pathY, xc, track, opt = {}) {
    const chars = [...str], ws = chars.map(ch => gw(dc, ch));
    const total = ws.reduce((a, b) => a + b, 0) + track * (ws.length - 1);
    let x = xc - total / 2;
    const reveal = opt.reveal ?? 1, n = chars.length, alpha = opt.alpha ?? 1, halo = opt.halo === undefined ? 'rgba(20,13,8,0.55)' : opt.halo;
    dc.textAlign = 'center';
    chars.forEach((ch, i) => {
      const cx = x + ws[i] / 2, y = pathY(cx), a = Math.atan2(pathY(cx + 2) - pathY(cx - 2), 4);
      const u = clamp(reveal * (n + 4) - i, 0, 4) / 4;      // letters settle in like a draughtsman's pass
      if (u > 0 && ch !== ' ') { dc.save(); dc.translate(cx, y); dc.rotate(a); glyph(dc, ch, 0, 0, opt.fill || PAL.ink, alpha * u, halo); dc.restore(); }
      x += ws[i] + track;
    });
    return total;
  }
  /** letterspaced text on a straight line; align 'left'|'center'|'right' */
  function caps(dc, str, x, y, track, align, fill, alpha = 1, halo = null) {
    const chars = [...str], ws = chars.map(ch => gw(dc, ch)), total = ws.reduce((a, b) => a + b, 0) + track * (ws.length - 1);
    let cx = align === 'center' ? x - total / 2 : align === 'right' ? x - total : x;
    dc.textAlign = 'left';
    chars.forEach((ch, i) => { if (ch !== ' ') glyph(dc, ch, cx, y, fill || PAL.ink, alpha, halo); cx += ws[i] + track; });
    return total;
  }
  /** plain text */
  function txt(dc, str, x, y, align, fill, alpha = 1, halo = null) { dc.textAlign = align || 'left'; glyph(dc, str, x, y, fill || PAL.ink, alpha, halo); }
  const fmt = n => U.tabular(Math.round(n), 0, { sep: ',' });

  /** sorted Float64Array; count of values ≤ t */
  function countLE(arr, t) { let lo = 0, hi = arr.length; while (lo < hi) { const m = (lo + hi) >> 1; if (arr[m] <= t) lo = m + 1; else hi = m; } return lo; }

  /** draw a water channel along river R from arc sa to sb with half-width hw(s) */
  function channel(dc, R, sa, sb, hw, fill, step = 2) {
    const top = [], bot = [];
    for (let s = sa; s <= sb + 0.01; s += step) { const w = hw(s); top.push(R.at(s, w)); bot.push(R.at(s, -w)); }
    dc.beginPath(); dc.moveTo(top[0][0], top[0][1]); for (const q of top) dc.lineTo(q[0], q[1]);
    for (let i = bot.length - 1; i >= 0; i--) dc.lineTo(bot[i][0], bot[i][1]);
    dc.closePath(); dc.fillStyle = fill; dc.fill();
    return { top, bot };
  }
  /** cartographic name set along a river (arc-length spaced, upright: reversed where the river runs west) */
  function letterAlong(dc, str, R, sc, off, track, opt = {}) {
    const chars = [...str], ws = chars.map(ch => gw(dc, ch)), total = ws.reduce((a, b) => a + b, 0) + track * (ws.length - 1);
    const t = R.tan(sc), dir = t[0] >= 0 ? 1 : -1, alpha = opt.alpha ?? 1, halo = opt.halo === undefined ? 'rgba(20,13,8,0.55)' : opt.halo;
    let s = sc - dir * total / 2; dc.textAlign = 'center';
    chars.forEach((ch, i) => {
      const sm = s + dir * ws[i] / 2, q = R.at(sm, off * dir), tt = R.tan(sm);
      if (ch !== ' ') { dc.save(); dc.translate(q[0], q[1]); dc.rotate(Math.atan2(tt[1] * dir, tt[0] * dir)); glyph(dc, ch, 0, 0, opt.fill || PAL.ink, alpha, halo); dc.restore(); }
      s += dir * (ws[i] + track);
    });
  }
  function polyline(dc, pts, stroke, lw, dash) {
    if (!pts.length) return;
    dc.beginPath(); dc.moveTo(pts[0][0], pts[0][1]); for (const q of pts) dc.lineTo(q[0], q[1]);
    dc.setLineDash(dash || []); dc.strokeStyle = stroke; dc.lineWidth = lw; dc.stroke(); dc.setLineDash([]);
  }

  return { PAL, TONES, PathRiver, meander, tributaries, letterAlong, Deposit, terrain, discs, discsXY, sediment, lettering, caps, txt, font, cpu, fmt, countLE, channel, polyline, rgba };
})();
