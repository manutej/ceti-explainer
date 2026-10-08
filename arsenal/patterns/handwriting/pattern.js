// handwriting: single-stroke glyphs written by a simulated hand. Atlas: arc-length-reveal, spline-vertex, shape-curves,
// p5-scribble (seeded wobble lineage), text-to-contours (the typeset foil for annotation), seeded-determinism.
// Pure of (params, ctx.seed, ctx.tokens) in setup and of t in draw. Colours are token ROLES only.
(function () {
  window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} };

  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const TAU = Math.PI * 2, clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const smooth = (a, b, x) => { const u = clamp((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
  // smooth 1-D offset along a stroke: three sines of random phase (copied from materials/drawn)
  function wobble(r, amp) {
    const k = [[60, 1], [24, 0.5], [9, 0.22]].map(([lam, a]) => ({ f: TAU / (lam * (0.8 + r() * 0.5)), p: r() * TAU, a: amp * a }));
    return s => k[0].a * Math.sin(s * k[0].f + k[0].p) + k[1].a * Math.sin(s * k[1].f + k[1].p) + k[2].a * Math.sin(s * k[2].f + k[2].p);
  }

  // ---- the glyph set: 100-unit cap height, y down, baseline y=100. 's' = Catmull-Rom spline, 'l' = polyline (corners).
  // Strokes are listed in WRITING ORDER. l/r = side bearings (template units).
  const S = (...p) => ['s', p], L = (...p) => ['l', p];
  const G = {
    '0': { st: [S([34, 1], [14, 10], [4, 50], [12, 90], [30, 100], [50, 88], [57, 50], [50, 12], [32, 0], [26, 2])] },
    '1': { st: [L([10, 26], [30, 0], [30, 100])] },
    '2': { st: [S([6, 24], [16, 5], [32, 0], [48, 10], [50, 30], [38, 54], [6, 97]), L([6, 99], [56, 100])] },
    '3': { st: [S([8, 14], [24, 0], [44, 6], [46, 26], [24, 46], [46, 64], [49, 88], [28, 100], [6, 90])] },
    '4': { st: [L([42, 100], [42, 0], [3, 68], [58, 68])] },
    '5': { st: [L([50, 0], [12, 0], [8, 46]), S([8, 46], [26, 38], [46, 48], [52, 70], [40, 94], [22, 100], [4, 90])] },
    '6': { st: [S([46, 6], [26, 0], [10, 26], [5, 64], [14, 94], [30, 100], [48, 88], [50, 64], [34, 50], [12, 60], [7, 74])] },
    '7': { st: [L([4, 2], [56, 2], [22, 100])] },
    '8': { st: [S([30, 48], [48, 34], [46, 10], [30, 0], [14, 10], [12, 34], [30, 48], [52, 68], [48, 92], [30, 100], [12, 92], [8, 68], [30, 48])] },
    '9': { st: [S([50, 36], [32, 50], [10, 40], [8, 16], [28, 0], [48, 10], [52, 36], [50, 70], [38, 96], [18, 100], [8, 92])] },
    '+': { st: [L([6, 50], [54, 50]), L([30, 24], [30, 76])], l: 10, r: 10 },
    '−': { st: [L([6, 50], [54, 50])], l: 10, r: 10 },
    '-': { st: [L([6, 50], [54, 50])], l: 10, r: 10 },
    '=': { st: [L([6, 38], [54, 38]), L([6, 62], [54, 62])], l: 10, r: 10 },
    '×': { st: [L([12, 30], [48, 70]), L([48, 30], [12, 70])], l: 10, r: 10 },
    '÷': { st: [L([6, 50], [54, 50]), L([30, 25], [30, 27]), L([30, 73], [30, 75])], l: 10, r: 10 },
    '≈': { st: [S([6, 36], [18, 28], [30, 38], [42, 28], [54, 36]), S([6, 62], [18, 54], [30, 64], [42, 54], [54, 62])], l: 10, r: 10 },
    '%': { st: [L([50, 4], [10, 96]), S([14, 10], [5, 21], [14, 32], [23, 21], [14, 10]), S([46, 68], [37, 79], [46, 90], [55, 79], [46, 68])], l: 8, r: 8 },
    '.': { st: [L([4, 97], [4.5, 99])], l: 2, r: 8 },
    ',': { st: [L([6, 94], [6, 98], [1, 111])], l: 2, r: 8 },
    'i': { st: [L([8, 48], [8, 100]), L([8, 28], [8, 30])], l: 8, r: 8 },
    'n': { st: [L([8, 46], [8, 100]), S([8, 66], [18, 48], [34, 44], [42, 58], [42, 100])], l: 8, r: 8 },
    'o': { st: [S([26, 42], [8, 52], [6, 74], [14, 96], [26, 100], [40, 92], [44, 70], [36, 48], [26, 42], [20, 44])], l: 8, r: 8 },
    'x': { st: [L([6, 44], [40, 100]), L([40, 44], [6, 100])], l: 8, r: 8 },
    't': { st: [L([18, 18], [18, 90], [30, 100]), L([4, 46], [34, 46])], l: 8, r: 8 }
  };
  const KERN = { '71': -5, '11': 5, '1,': -5, '1.': -3, '47': -4, '74': -4, '2.': -2, '÷ ': 0 };   // pair adjustments, template units
  const LC = 'inoxt';                                                                                  // lowercase: x-height boxes

  // ---- path sampling (spline via p5 splinePoint; polyline passthrough) -> dense point list
  function sampleStroke(p, kind, P) {
    const out = [];
    if (kind === 's') {
      for (let s = 0; s < P.length - 1; s++) {
        const a = P[Math.max(0, s - 1)], b = P[s], c = P[s + 1], d = P[Math.min(P.length - 1, s + 2)];
        const n = clamp(Math.ceil(Math.hypot(c[0] - b[0], c[1] - b[1]) / 3), 6, 40);
        for (let i = (s ? 1 : 0); i <= n; i++) { const t = i / n; out.push([p.splinePoint(a[0], b[0], c[0], d[0], t), p.splinePoint(a[1], b[1], c[1], d[1], t)]); }
      }
    } else {
      for (let s = 0; s < P.length - 1; s++) {
        const a = P[s], b = P[s + 1], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 3));
        for (let i = (s ? 1 : 0); i <= n; i++) out.push([a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n]);
      }
    }
    return out;
  }
  function templates(p) {                          // sampled once per setup
    const T = {};
    for (const ch in G) {
      const st = G[ch].st.map(([k, P]) => sampleStroke(p, k, P));
      let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
      for (const s of st) for (const q of s) { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); }
      T[ch] = { st, x0, x1, y0, y1, l: G[ch].l == null ? 9.5 : G[ch].l, r: G[ch].r == null ? 9.5 : G[ch].r };
    }
    return T;
  }

  // ---- the hand: turn a point list into a timed, pressure-weighted stroke (speed -> width, slow = thick)
  function timeStroke(pts, o) {
    const n = pts.length, ds = [0], cum = [0];
    for (let i = 1; i < n; i++) { ds.push(Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); cum.push(cum[i - 1] + ds[i]); }
    const total = cum[n - 1] || 1e-6, kap = new Array(n).fill(0);
    for (let i = 1; i < n - 1; i++) {
      const a1 = Math.atan2(pts[i][1] - pts[i - 1][1], pts[i][0] - pts[i - 1][0]), a2 = Math.atan2(pts[i + 1][1] - pts[i][1], pts[i + 1][0] - pts[i][0]);
      let th = Math.abs(a2 - a1); if (th > Math.PI) th = TAU - th;
      kap[i] = th / Math.max(1, (ds[i] + ds[i + 1]) / 2);
    }
    const ks = kap.map((_, i) => (kap[Math.max(0, i - 1)] + kap[i] + kap[Math.min(n - 1, i + 1)]) / 3);
    const vb = o.vb, v = ks.map((k, i) => Math.max(0.12 * vb, vb * (0.35 + 0.65 * Math.pow(Math.sin(Math.PI * clamp(cum[i] / total, 0, 1)), 0.7)) / (1 + o.curve * k)));
    const tt = [0];
    for (let i = 1; i < n; i++) tt.push(tt[i - 1] + ds[i] / ((v[i - 1] + v[i]) / 2));
    if (tt[n - 1] < 0.045) { const k = 0.045 / Math.max(tt[n - 1], 1e-6); for (let i = 0; i < n; i++) tt[i] *= k; }
    let w = v.map((vi, i) => o.w * (1.5 - 0.8 * clamp(vi / vb, 0, 1)) * (1 - 0.35 * smooth(0.92, 1, cum[i] / total)));
    w = w.map((_, i) => (w[Math.max(0, i - 1)] + 2 * w[i] + w[Math.min(n - 1, i + 1)]) / 4);
    return { pts, w, tt, dur: tt[n - 1], total };
  }

  // ---- composition: ops -> timed strokes -------------------------------------------------------------
  function compose(p, T, ops, seed, prm) {
    const TP = templates(p), strokes = [], decor = [], REF = {}, pk = ((T.tempo && T.tempo.beat_s) || 4) / 4, typeset = [];
    const vb0 = prm.speed * (prm.fit ? 1 : 1 / pk);
    let cur = 0, last = null;                                      // natural clock; last pen position
    const lift = (pt, vb) => last && pt ? 0.05 * pk + Math.hypot(pt[0] - last[0], pt[1] - last[1]) / (vb * 2.5) : 0;
    function put(pts, o, meta) {
      const s = timeStroke(pts, o);
      cur += lift(pts[0], o.vb);
      Object.assign(s, meta, { n0: cur, role: o.role, pen: o.w * 0.75 + 1 });
      cur += s.dur; last = pts[pts.length - 1]; strokes.push(s);
    }
    function boxOf(id, i0, i1) {
      const R = REF[id]; if (!R) return { x0: 0, x1: 0, y0: 0, y1: 0 };
      const cs = R.chars.filter((c, i) => c && (i0 == null || i >= i0) && (i1 == null || i <= i1));
      if (!cs.length) return R;
      return { x0: Math.min(...cs.map(c => c.x0)), x1: Math.max(...cs.map(c => c.x1)), y0: Math.min(...cs.map(c => c.y0)), y1: Math.max(...cs.map(c => c.y1)) };
    }
    function pt(d) {
      if (Array.isArray(d)) return d;
      const b = boxOf(d.ref, d.i0, d.i1), at = d.at || 'center';
      const x = at === 'left' ? b.x0 : at === 'right' ? b.x1 : (b.x0 + b.x1) / 2, y = at === 'top' ? b.y0 : at === 'bottom' ? b.y1 : (b.y0 + b.y1) / 2;
      return [x + (d.dx || 0), y + (d.dy || 0)];
    }
    ops.forEach((op, oi) => {
      const r = mulberry32(((seed | 0) * 2654435761 + oi * 40503) >>> 0), size = op.size || 70, sc = size / 100;
      const role = op.role || 'ink', base = (op.pen || prm.pen) * size / 70, wob = (op.wob == null ? prm.wobble : op.wob);
      if (op.op === 'type') {
        p.textFont(T.type[op.font || 'disp'].family); p.textSize(size);
        const chars = [], str = [...op.s]; let acc = 0;
        for (let i = 0; i < str.length; i++) {
          const a0 = p.textWidth(str.slice(0, i).join('')), a1 = p.textWidth(str.slice(0, i + 1).join(''));
          chars.push(str[i] === ' ' ? null : { x0: op.x + a0, x1: op.x + a1, y0: op.y - size * 0.7, y1: op.y }); acc = a1;
        }
        REF[op.id] = { x0: op.x, x1: op.x + acc, y0: op.y - size * 0.7, y1: op.y, chars };
        typeset.push({ s: op.s, x: op.x, y: op.y, size, role, font: op.font || 'disp', fade: op.fade == null ? 0.5 : op.fade });
        return;
      }
      cur += (op.pause == null ? 0.22 : op.pause) * pk; last = null;
      if (op.op === 'text') {
        const str = [...op.s], seq = []; let w = 0, prev = null;
        for (const ch of str) {
          if (ch === ' ') { w += size * 0.5; seq.push(null); prev = null; continue; }
          const tp = TP[ch]; if (!tp) { w += size * 0.5; seq.push(null); prev = null; continue; }
          if (prev) w += (TP[prev].r + tp.l + (KERN[prev + ch] || 0)) * sc;
          seq.push({ ch, tp, x: w }); w += (tp.x1 - tp.x0) * sc; prev = ch;
        }
        const ox = (op.align === 'center' ? op.x - w / 2 : op.x), oy = op.y, chars = [], o = { vb: vb0 * (op.vb || 1), curve: 10, w: base, role };
        const pen0 = cur;
        for (let ci = 0; ci < seq.length; ci++) {
          const g = seq[ci]; if (!g) { chars.push(null); cur += 0.1 * pk; continue; }
          const tp = g.tp, rot = (r() - 0.5) * 0.08 * wob, scl = 1 + (r() - 0.5) * 0.06 * wob, dy = (r() - 0.5) * 0.03 * size * wob, sh = prm.slant + (r() - 0.5) * 0.06 * wob;
          const cr = Math.cos(rot), sr = Math.sin(rot), gx = ox + g.x;
          chars.push({ x0: gx - 2, x1: gx + (tp.x1 - tp.x0) * sc + 2 + sh * (100 - tp.y0) * sc * 0.5, y0: oy - (100 - tp.y0) * sc, y1: oy + (tp.y1 - 100) * sc });
          cur += 0.025 * pk;
          tp.st.forEach((samp, si) => {
            const wx = wobble(r, 0.9 * wob * sc / 0.7), wy = wobble(r, 0.9 * wob * sc / 0.7);
            let sl = 0, pp = null;
            const pts = samp.map(q => {
              let lx = (q[0] - tp.x0) * sc * scl, ly = (q[1] - 100) * sc * scl; lx += -ly * sh;
              const X = gx + lx * cr - ly * sr, Y = oy + dy + lx * sr + ly * cr;
              if (pp) sl += Math.hypot(X - pp[0], Y - pp[1]); pp = [X, Y];
              return [X + wx(sl), Y + wy(sl)];
            });
            put(pts, o, { glyph: oi * 100 + ci, sn: si + 1, ns: tp.st.length });
          });
        }
        REF[op.id || ('t' + oi)] = { x0: ox, x1: ox + w, y0: oy - size, y1: oy, chars };
        if (op.guide) decor.push({ x: op.guide.x, w: op.guide.w, base: oy, cap: oy - size, first: strokes.length ? pen0 : cur, gi: strokes.length });
        return;
      }
      // emphasis: underline | circle | arrow, drawn as quick single-stroke flicks in the same hand
      const o = { vb: vb0 * 1.2, curve: 6, w: base * (op.thick || 1.05), role }, wo = wobble(r, 1.1 * wob + 0.3);
      if (op.op === 'underline') {
        const b = boxOf(op.ref, op.i0, op.i1), gap = op.gap == null ? 12 : op.gap, w = b.x1 - b.x0 + 16, tilt = (r() - 0.6) * 5;
        const line = (x0, x1, y, bow) => { const n = 46, a = []; for (let i = 0; i <= n; i++) { const f = i / n; a.push([x0 + (x1 - x0) * f, y + tilt * f + bow * Math.sin(Math.PI * f) + wo(f * w)]); } return a; };
        put(line(b.x0 - 8, b.x1 + 8, b.y1 + gap, 2.2), o, { sn: 0 });
        if (op.twice !== false) { cur += 0.03 * pk; put(line(b.x0 + 0.1 * w, b.x1 + 2 - 0.06 * w, b.y1 + gap + 6.5, 1.4), Object.assign({}, o, { w: o.w * 0.8 }), { sn: 0 }); }
      } else if (op.op === 'circle') {
        const b = boxOf(op.ref, op.i0, op.i1), pad = op.pad == null ? 12 : op.pad, cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2;
        const rx = (b.x1 - b.x0) / 2 + pad * 1.15, ry = (b.y1 - b.y0) / 2 + pad, th0 = -2.35, turns = 1.13, tilt = -0.07 - r() * 0.05, n = 84, a = [];
        for (let i = 0; i <= n; i++) {
          const f = i / n, th = th0 + f * turns * TAU, g = 1 + 0.07 * f + 0.02 * wo(f * 300) / 1.1, x = Math.cos(th) * rx * g, y = Math.sin(th) * ry * g;
          a.push([cx + x * Math.cos(tilt) - y * Math.sin(tilt) + wo(f * 500) * 0.5, cy + x * Math.sin(tilt) + y * Math.cos(tilt) + wo(f * 500 + 40) * 0.5]);
        }
        put(a, o, { sn: 0 });
      } else if (op.op === 'arrow') {
        const A = pt(op.from), B = pt(op.to), dx = B[0] - A[0], dy = B[1] - A[1], len = Math.hypot(dx, dy) || 1, bend = (op.bend == null ? 0.22 : op.bend) * len, nx = -dy / len, ny = dx / len;
        const C = [(A[0] + B[0]) / 2 + nx * bend, (A[1] + B[1]) / 2 + ny * bend], n = 40, a = [];
        for (let i = 0; i <= n; i++) { const f = i / n, m = 1 - f; a.push([m * m * A[0] + 2 * m * f * C[0] + f * f * B[0] + wo(f * len) * 0.6, m * m * A[1] + 2 * m * f * C[1] + f * f * B[1] + wo(f * len + 30) * 0.6]); }
        put(a, o, { sn: 0 });
        const tx = B[0] - (2 * (1 - 0.97) * (C[0] - B[0]) + (a[n - 1][0] - B[0])), ang = Math.atan2(B[1] - a[n - 3][1], B[0] - a[n - 3][0]), hs = op.head || 15;
        for (const sg of [1, -1]) { cur += 0.02 * pk; put([[B[0] - Math.cos(ang + sg * 0.5) * hs, B[1] - Math.sin(ang + sg * 0.5) * hs], B], Object.assign({}, o, { w: o.w * 0.9 }), { sn: 0 }); }
      }
    });
    // fit the natural clock to the film clock, then bake absolute times
    const lead = prm.lead, avail = prm.dur * (1 - prm.hold) - lead, k = prm.fit ? avail / Math.max(cur, 1e-6) : 1;
    strokes.forEach(s => { s.t0 = lead + s.n0 * k; s.tt = s.tt.map(x => lead + (s.n0 + x) * k); s.t1 = s.tt[s.tt.length - 1]; });
    decor.forEach(d => { d.t0 = strokes[Math.min(d.gi, strokes.length - 1)].t0; });
    return { strokes, decor, typeset, total: strokes.length, k, nat: cur, REF };
  }

  // ---- drawing ----------------------------------------------------------------------------------------
  function drawStroke(c, T, s, t, pen) {
    if (t < s.tt[0]) return;
    const n = s.pts.length; let m = n - 1, fr = 1;
    if (t < s.t1) { let lo = 0, hi = n - 2; while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (s.tt[mid] <= t) lo = mid; else hi = mid - 1; } m = lo + 1; fr = (t - s.tt[lo]) / Math.max(1e-9, s.tt[lo + 1] - s.tt[lo]); }
    c.strokeStyle = T.color[s.role] || T.color.ink; c.lineCap = 'round';
    const tipX = s.pts[m - 1][0] + (s.pts[m][0] - s.pts[m - 1][0]) * fr, tipY = s.pts[m - 1][1] + (s.pts[m][1] - s.pts[m - 1][1]) * fr;
    for (let i = 1; i <= m; i++) {
      const b = i === m ? [tipX, tipY] : s.pts[i];
      c.lineWidth = s.w[i]; c.beginPath(); c.moveTo(s.pts[i - 1][0], s.pts[i - 1][1]); c.lineTo(b[0], b[1]); c.stroke();
    }
    if (pen) {                                                   // pen tip: dot + halo, lifts away as the stroke completes
      const done = t >= s.t1 ? smooth(0, 0.12, t - s.t1) : 0, a = 1 - done; if (a <= 0.01) return;
      const r = s.pen, ac = T.color.accent, ch = T.color.chalk;
      c.globalAlpha = 0.22 * a; c.fillStyle = ac; c.beginPath(); c.arc(tipX, tipY, r * 2.1, 0, TAU); c.fill();
      c.globalAlpha = a; c.beginPath(); c.arc(tipX, tipY, r, 0, TAU); c.fill();
      c.fillStyle = ch; c.beginPath(); c.arc(tipX, tipY, r * 0.4, 0, TAU); c.fill(); c.globalAlpha = 1;
    }
  }

  // ---- script layouts (the variants' content; every x,y in the 960x540 basis) ---------------------------
  const LAYOUTS = {
    'glyph-sheet'() {
      const rows = [['0123456789', 'digits 0-9'], ['+−×÷=%≈.,', 'signs'], ['inoxt', 'letters']], ops = [], cw = 92, x0 = 20;
      rows.forEach(([s, cap], ri) => {
        const base = 172 + ri * 150;
        [...s].forEach((ch, ci) => ops.push({ op: 'text', s: ch, x: x0 + ci * cw + cw / 2, y: base, size: 62, align: 'center', role: 'ink', pause: 0.07, guide: { x: x0 + ci * cw, w: cw - 8 } }));
      });
      return { ops, rows, cw, x0, order: true, counter: true };
    },
    arithmetic() {
      const ops = [
        { op: 'text', id: 'l1', s: '21 ÷ 1,000 = 0.021', x: 120, y: 150, size: 70, role: 'ink' },
        { op: 'text', id: 'l2', s: '0.021 × 100 = 2.1 %', x: 120, y: 275, size: 70, role: 'ink', pause: 0.5 },
        { op: 'text', id: 'l3', s: '≈ 2 in 100', x: 120, y: 410, size: 96, role: 'accent', pause: 0.6 },
        { op: 'circle', ref: 'l3', i0: 2, i1: 2, pad: 14, role: 'accent2', pause: 0.3 },
        { op: 'underline', ref: 'l3', i0: 4, i1: 9, gap: 16, role: 'accent2', pause: 0.12 }
      ];
      return { ops };
    },
    annotation(p, T) {
      const ops = [
        { op: 'type', id: 'head', s: '2 in 100', x: 110, y: 400, size: 230, role: 'ink', font: 'disp', fade: 0.6 },
        { op: 'text', id: 'note', s: '21 ÷ 1,000', x: 560, y: 150, size: 56, role: 'accent', pause: 0.5 },
        { op: 'arrow', from: { ref: 'note', at: 'left', dx: -14, dy: 8 }, to: { ref: 'head', i0: 0, i1: 0, at: 'top', dx: 0, dy: -46 }, bend: -0.3, role: 'accent', pause: 0.2 },
        { op: 'circle', ref: 'head', i0: 0, i1: 0, pad: 20, role: 'accent2', pause: 0.25 },
        { op: 'underline', ref: 'head', i0: 5, i1: 7, gap: 26, role: 'accent2', pause: 0.2 },
        { op: 'text', id: 'eq', s: '≈ 2.1 %', x: 590, y: 500, size: 50, role: 'accent', pause: 0.3 }
      ];
      return { ops };
    }
  };

  const DEFAULTS = {
    layout: 'arithmetic',      // 'glyph-sheet' | 'arithmetic' | 'annotation'; or pass params.ops (see card)
    ops: null,                 // optional [{op:'text'|'type'|'underline'|'circle'|'arrow', ...}]
    speed: 520,                // nominal pen speed, px/s at 960 basis (ratio only when fit is on)
    fit: true,                 // scale the writing to fill dur*(1-hold); false = absolute pen speed / tempo
    dur: 8,                    // seconds in the film
    hold: 0.1,                 // trailing fraction held at full reveal
    lead: 0.25,                // seconds before the first stroke
    pen: 3.4,                  // base pen width, px at size 70
    slant: 0.14,               // shear, ~8 degrees
    wobble: 1,                 // per-glyph seeded jitter: 0 = ruled, 2 = shaky
    penTip: true,              // pen-tip dot on the live stroke
    order: false,              // stroke-order numerals at each stroke start
    guides: true               // baseline + cap line behind each ruled glyph
  };

  ARSENAL.patterns.handwriting = {
    id: 'handwriting', atlas: ['arc-length-reveal', 'spline-vertex', 'shape-curves', 'p5-scribble', 'text-to-contours', 'seeded-determinism'], renderer: 'p2d',
    params: DEFAULTS, GLYPHS: G,
    variants: [
      { name: 'glyph-sheet', params: { layout: 'glyph-sheet', wobble: 0.6, order: true, pen: 3.2 } },
      { name: 'arithmetic',  params: { layout: 'arithmetic', wobble: 1, pen: 3.6 } },
      { name: 'annotation',  params: { layout: 'annotation', wobble: 1.5, pen: 3.4, slant: 0.2 } }
    ],
    compose,
    setup(p, ctx, params) {
      const prm = Object.assign({}, DEFAULTS, params), T = (ctx && ctx.tokens) || (ARSENAL.brands && ARSENAL.brands['ceti-dark']);
      const lay = prm.ops ? { ops: prm.ops } : LAYOUTS[prm.layout](p, T);
      const comp = compose(p, T, lay.ops, (ctx && ctx.seed) || 7, prm);
      return Object.assign({ prm, lay }, comp);
    },
    draw(p, t, state, params, T) {
      const prm = state.prm, c = p.drawingContext;
      p.background(T.color.bg);
      c.save();
      if (state.lay.rows) {                                         // sheet furniture: row captions, ruled guides, counter
        p.noStroke(); p.textFont(T.type.mono.family); p.textSize(11); p.textAlign(p.LEFT, p.BASELINE);
        state.lay.rows.forEach(([s, cap], ri) => { const a = smooth(0, 0.5, t); p.fill(T.color.muted); c.globalAlpha = a; p.text(cap, 28, 172 + ri * 150 - 86); });
        c.globalAlpha = 1;
      }
      if (prm.guides) for (const d of state.decor) {
        const a = smooth(d.t0 - 0.3, d.t0, t); if (a <= 0) continue;
        c.globalAlpha = a; c.strokeStyle = T.color.line; c.lineWidth = 1; c.setLineDash([]);
        c.beginPath(); c.moveTo(d.x, d.base); c.lineTo(d.x + d.w, d.base); c.stroke();
        c.setLineDash([2, 5]); c.beginPath(); c.moveTo(d.x, d.cap); c.lineTo(d.x + d.w, d.cap); c.stroke(); c.setLineDash([]);
      }
      c.globalAlpha = 1;
      for (const ty of state.typeset) {                              // typeset foil (annotation)
        p.noStroke(); p.textFont(T.type[ty.font].family); p.textSize(ty.size); p.textAlign(p.LEFT, p.BASELINE);
        c.globalAlpha = smooth(0, ty.fade, t); p.fill(T.color[ty.role] || T.color.ink); p.text(ty.s, ty.x, ty.y); c.globalAlpha = 1;
      }
      let written = 0;
      for (const s of state.strokes) {
        if (t < s.tt[0]) continue;
        const live = t >= s.t0 - 1e-9 && t < s.t1 + 0.12;
        drawStroke(c, T, s, t, prm.penTip && live);
        if (t >= s.t1) written++;
        if (prm.order && s.sn) {                                     // stroke-order numeral
          const a = smooth(s.t0, s.t0 + 0.25, t); c.globalAlpha = 0.9 * a; c.fillStyle = T.color.muted; c.font = '10px "' + T.type.mono.family + '"'; c.textAlign = 'right';
          c.fillText(String(s.sn), s.pts[0][0] - 6, s.pts[0][1] - 5); c.globalAlpha = 1;
        }
      }
      if (state.lay.counter) {
        p.noStroke(); p.fill(T.color.muted); p.textFont(T.type.mono.family); p.textSize(13); p.textAlign(p.CENTER, p.BASELINE);
        p.text(written + ' / ' + state.total + ' strokes', 480, 520);
      }
      c.restore();
    }
  };
})();
