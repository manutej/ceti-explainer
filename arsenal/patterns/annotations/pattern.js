// annotations: the vocabulary of pointing. Callouts (elbow / curved / straight) that route around what they point at,
// curly and square brackets, dimension lines with oblique ticks, hand-drawn circles and underlines, numbered pins and a
// dimming spotlight label. Every mark reveals by arc length and retracts the same way; labels are >= 14 units.
// Atlas: arc-length-reveal, shape-custom-shapes, bezier-vertex, text-width, derived-geometry.
// Pure of (params, seed) in setup and of t in draw. Colours are token ROLES only. Geometry is derived in a per-brand
// layout cache (text metrics need the brand font) and never depends on t.
(function () {
  window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} };

  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const smooth = (a, b, x) => { const u = clamp((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };

  // ---- easing (copied from reveal) ----------------------------------------------------------------
  const C1 = 1.70158, C3 = C1 + 1, C2 = C1 * 1.525;
  const EASE = {
    cubic: { inOut: x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2, out: x => 1 - Math.pow(1 - x, 3) },
    expo:  { inOut: x => x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2, out: x => x >= 1 ? 1 : 1 - Math.pow(2, -10 * x) },
    back:  { inOut: x => x < 0.5 ? (Math.pow(2 * x, 2) * ((C2 + 1) * 2 * x - C2)) / 2 : (Math.pow(2 * x - 2, 2) * ((C2 + 1) * (x * 2 - 2) + C2) + 2) / 2, out: x => 1 + C3 * Math.pow(x - 1, 3) + C1 * Math.pow(x - 1, 2) }
  };
  function ease(family, mode, x) { x = clamp(x, 0, 1); const f = EASE[family] || EASE.cubic; return f[mode] ? f[mode](x) : x; }

  // ---- arc-length path sampling (copied from reveal) ----------------------------------------------
  function sample(p, spec) {
    const P = spec.pts, out = [];
    if (spec.kind === 'bezier') {                 // a0,c,c,a1,c,c,a2 ... (bezierOrder 3 chain)
      for (let s = 0; s + 3 < P.length; s += 3) {
        const [a, b, c, d] = [P[s], P[s + 1], P[s + 2], P[s + 3]];
        const chord = Math.hypot(d[0] - a[0], d[1] - a[1]) + Math.hypot(b[0] - a[0], b[1] - a[1]) + Math.hypot(d[0] - c[0], d[1] - c[1]);
        const n = clamp(Math.ceil(chord / 5), 10, 70);
        for (let i = (s ? 1 : 0); i <= n; i++) { const t = i / n; out.push([p.bezierPoint(a[0], b[0], c[0], d[0], t), p.bezierPoint(a[1], b[1], c[1], d[1], t)]); }
      }
    } else if (spec.kind === 'spline') {          // Catmull-Rom through every point, end points doubled
      for (let s = 0; s < P.length - 1; s++) {
        const a = P[Math.max(0, s - 1)], b = P[s], c = P[s + 1], d = P[Math.min(P.length - 1, s + 2)];
        const n = clamp(Math.ceil(Math.hypot(c[0] - b[0], c[1] - b[1]) / 4), 6, 40);
        for (let i = (s ? 1 : 0); i <= n; i++) { const t = i / n; out.push([p.splinePoint(a[0], b[0], c[0], d[0], t), p.splinePoint(a[1], b[1], c[1], d[1], t)]); }
      }
    } else { for (const q of P) out.push([q[0], q[1]]); }
    const pts = [], L = [0];
    for (const q of out) {
      const last = pts[pts.length - 1];
      if (last && Math.hypot(q[0] - last[0], q[1] - last[1]) < 1e-6) continue;
      if (last) L.push(L[L.length - 1] + Math.hypot(q[0] - last[0], q[1] - last[1]));
      pts.push(q);
    }
    return { pts, L, total: L[L.length - 1] || 1e-6 };
  }
  function seg(path, s) { const L = path.L; let lo = 0, hi = Math.max(0, L.length - 2); while (lo < hi) { const m = (lo + hi + 1) >> 1; if (L[m] <= s) lo = m; else hi = m - 1; } return lo; }
  function pointAt(path, s) {
    s = clamp(s, 0, path.total); const i = seg(path, s), a = path.pts[i], b = path.pts[Math.min(i + 1, path.pts.length - 1)];
    const d = path.L[i + 1] - path.L[i], k = d > 0 ? (s - path.L[i]) / d : 0;
    return { x: a[0] + (b[0] - a[0]) * k, y: a[1] + (b[1] - a[1]) * k, a: Math.atan2(b[1] - a[1], b[0] - a[0]) };
  }
  function slice(path, s0, s1) {
    const o = [], A = pointAt(path, s0), B = pointAt(path, s1); o.push([A.x, A.y]);
    for (let i = seg(path, s0) + 1; i < path.pts.length && path.L[i] < s1; i++) if (path.L[i] > s0) o.push(path.pts[i]);
    o.push([B.x, B.y]); return o;
  }

  // ---- drawing helpers ----------------------------------------------------------------------------
  function col(p, T, role, a) { const c = p.color(T.color[role]); c.setAlpha(p.alpha(c) * (a === undefined ? 1 : a)); return c; }
  function poly(p, pts) { p.beginShape(); for (const q of pts) p.vertex(q[0], q[1]); p.endShape(); }
  function head(p, x, y, ang, size) { p.push(); p.translate(x, y); p.rotate(ang); p.noStroke(); p.triangle(0, 0, -size, -size * 0.42, -size, size * 0.42); p.pop(); }
  function lumHex(p, hex) { const c = p.color(hex), f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(p.red(c)) + 0.7152 * f(p.green(c)) + 0.0722 * f(p.blue(c)); }
  const cr = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  // ink for text sitting ON an accent-coloured fill: whichever of bg / chalk contrasts more
  function onRole(p, T, role) { const l = lumHex(p, T.color[role]); return cr(l, lumHex(p, T.color.bg)) >= cr(l, lumHex(p, T.color.chalk)) ? 'bg' : 'chalk'; }

  // ---- geometry ----------------------------------------------------------------------------------
  const R = (x, y, w, h) => ({ x, y, w, h });
  const hitSeg = (a, b, r) => {                      // Liang-Barsky: does a->b cross rect r (shrunk 1px)?
    const x0 = r.x + 1, y0 = r.y + 1, x1 = r.x + r.w - 1, y1 = r.y + r.h - 1, dx = b[0] - a[0], dy = b[1] - a[1];
    let t0 = 0, t1 = 1; const P = [-dx, dx, -dy, dy], Q = [a[0] - x0, x1 - a[0], a[1] - y0, y1 - a[1]];
    for (let i = 0; i < 4; i++) { if (P[i] === 0) { if (Q[i] < 0) return false; } else { const t = Q[i] / P[i]; if (P[i] < 0) { if (t > t1) return false; if (t > t0) t0 = t; } else { if (t < t0) return false; if (t < t1) t1 = t; } } }
    return t0 <= t1;
  };
  const hitPoly = (pts, rects) => { for (const r of rects) for (let i = 1; i < pts.length; i++) if (hitSeg(pts[i - 1], pts[i], r)) return true; return false; };
  const overlap = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
  const OPP = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
  const NORM = { top: [0, -1], bottom: [0, 1], left: [-1, 0], right: [1, 0] };
  function roundRect(x, y, w, h, r) {
    const o = []; const c = [[x + w - r, y + r, -90], [x + w - r, y + h - r, 0], [x + r, y + h - r, 90], [x + r, y + r, 180]];
    for (const [cx, cy, a0] of c) for (let i = 0; i <= 6; i++) { const a = (a0 + 90 * i / 6) * Math.PI / 180; o.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
    return o;
  }

  // ---- labels (token roles; size never below 14) --------------------------------------------------
  const MIN_LABEL = 14;
  function mkLabel(p, T, text, cx, cy, size, role, font) {
    const sz = Math.max(MIN_LABEL, size || 15), lines = String(text).split('\n'), lh = sz * 1.25;
    p.textFont((font || T.type.mono).family); p.textSize(sz);
    const tw = Math.max(...lines.map(s => p.textWidth(s))), w = tw + 16, h = lines.length * lh + 10;
    cx = clamp(cx, 8 + w / 2, 952 - w / 2); cy = clamp(cy, 8 + h / 2, 532 - h / 2);
    return { text, lines, sz, lh, w, h, cx, cy, role: role === 'secondary' ? 'muted' : 'ink', dataRole: role === 'secondary' ? 'secondary' : 'must-read', box: R(cx - w / 2, cy - h / 2, w, h), font: font || T.type.mono };
  }
  function labelAnchor(lb, facing) {
    return facing === 'bottom' ? [lb.cx, lb.cy + lb.h / 2] : facing === 'top' ? [lb.cx, lb.cy - lb.h / 2] : facing === 'left' ? [lb.cx - lb.w / 2, lb.cy] : [lb.cx + lb.w / 2, lb.cy];
  }
  function drawLabel(p, T, lb, alpha, slide, opaque) {
    if (!lb || alpha <= 0.01) return;
    p.push(); p.translate(slide ? slide[0] * (1 - alpha) : 0, slide ? slide[1] * (1 - alpha) : 0);
    p.stroke(col(p, T, 'accent', 0.5 * alpha)); p.strokeWeight(1); p.fill(col(p, T, 'panel', (opaque ? 1 : 0.94) * alpha));
    p.rect(lb.box.x, lb.box.y, lb.w, lb.h, 4);
    p.noStroke(); p.fill(col(p, T, lb.role, alpha)); p.textFont(lb.font.family); p.textSize(lb.sz); p.textAlign(p.CENTER, p.BASELINE);
    lb.lines.forEach((s, i) => p.text(s, lb.cx, lb.cy - lb.h / 2 + 5 + lb.lh * i + lb.sz * 0.9));
    p.pop();
  }
  // label centred on the far side of a span: n is the outward unit normal
  function labelBeyond(p, T, A, anchor, n, gap) {
    const lb = mkLabel(p, T, A.text, 0, 0, A.size, A.role);
    const off = gap + Math.abs(n[0]) * lb.w / 2 + Math.abs(n[1]) * lb.h / 2;
    return mkLabel(p, T, A.text, anchor[0] + n[0] * off, anchor[1] + n[1] * off, A.size, A.role);
  }

  // ---- annotation compilers ----------------------------------------------------------------------
  // Each returns { layer, parts:[{path,st,w:[w0,w1]}], label, labelW, extras(p,T,fx,prm) , targets:[rect], labelBox }.
  // w = window in [0,1] of the annotation's own reveal; out plays the windows in reverse.
  const K = {};

  K.callout = function (p, T, A, env, prm, seedBase) {
    const lb = mkLabel(p, T, A.text, A.at[0], A.at[1], A.size, A.role);
    const tg = A.target.w === undefined ? R(A.target.x, A.target.y, 0, 0) : A.target;
    const tcx = tg.x + tg.w / 2, tcy = tg.y + tg.h / 2, dx = lb.cx - tcx, dy = lb.cy - tcy;
    const side = A.side || (Math.abs(dy) * 0.6 > Math.abs(dx) * 0.5 && true ? (dy < 0 ? 'top' : 'bottom') : (dx < 0 ? 'left' : 'right'));
    const vert = side === 'top' || side === 'bottom', fr = A.frac === undefined ? 0.5 : A.frac, gap = prm.gap, nn = NORM[side];
    let E = vert ? [tg.x + tg.w * fr, side === 'top' ? tg.y : tg.y + tg.h] : [side === 'left' ? tg.x : tg.x + tg.w, tg.y + tg.h * fr];
    E = [E[0] + nn[0] * gap, E[1] + nn[1] * gap];
    const S = labelAnchor(lb, OPP[side]), shape = A.shape || 'elbow';
    const obst = env.obstacles.filter(o => o !== A.target), lbls = env.labelBoxes.filter(b => b !== lb.box);
    const blockers = obst.concat(lbls);
    let spec, miss = false;
    if (shape === 'straight') spec = { kind: 'line', pts: [S, E] };
    else if (shape === 'curve') {
      const k = (vert ? Math.abs(E[1] - S[1]) : Math.abs(E[0] - S[0])) * 0.55, sgn = vert ? Math.sign(E[1] - S[1]) || 1 : Math.sign(E[0] - S[0]) || 1;
      spec = { kind: 'bezier', pts: vert ? [S, [S[0], S[1] + sgn * k], [E[0], E[1] - sgn * k], E] : [S, [S[0] + sgn * k, S[1]], [E[0] - sgn * k, E[1]], E] };
    } else {                                           // elbow: three segments, mid-run searched until clear
      let pick = null;
      for (const f of [0.5, 0.35, 0.65, 0.2, 0.8]) {
        const pts = vert ? [S, [S[0], S[1] + (E[1] - S[1]) * f], [E[0], S[1] + (E[1] - S[1]) * f], E] : [S, [S[0] + (E[0] - S[0]) * f, S[1]], [S[0] + (E[0] - S[0]) * f, E[1]], E];
        if (!hitPoly(pts, blockers)) { pick = pts; break; }
      }
      if (!pick) { miss = true; pick = vert ? [S, [S[0], (S[1] + E[1]) / 2], [E[0], (S[1] + E[1]) / 2], E] : [S, [(S[0] + E[0]) / 2, S[1]], [(S[0] + E[0]) / 2, E[1]], E]; }
      spec = { kind: 'line', pts: pick };
    }
    const path = sample(p, spec);
    if (shape !== 'elbow') miss = hitPoly(path.pts, blockers);
    const slide = [-(S[0] - E[0]) / (Math.hypot(S[0] - E[0], S[1] - E[1]) || 1) * 7, -(S[1] - E[1]) / (Math.hypot(S[0] - E[0], S[1] - E[1]) || 1) * 7];
    return {
      layer: 1, parts: [{ path, st: { role: A.lineRole || 'accent', w: prm.lineW, head: A.end === 'arrow' ? 10 : 0 }, w: [0, 0.62] }],
      label: lb, labelW: [0.5, 1], slide, targets: [tg], miss,
      extras(p, T, fx) {
        if (A.end === 'arrow') return;
        const m = fx.win(0.58, 0.72), v = m.i * (1 - m.o); if (v <= 0.01) return;
        p.noStroke(); p.fill(col(p, T, A.lineRole || 'accent', v)); p.circle(E[0], E[1], 8 * (0.4 + 0.6 * v));
      }
    };
  };

  K.bracket = function (p, T, A, env, prm) {
    const f = A.from, t = A.to, L = Math.hypot(t[0] - f[0], t[1] - f[1]), u = [(t[0] - f[0]) / L, (t[1] - f[1]) / L], n0 = [u[1], -u[0]], sd = A.side === undefined ? 1 : A.side, n = [n0[0] * sd, n0[1] * sd];
    const P = (a, b) => [f[0] + u[0] * a + n[0] * b, f[1] + u[1] * a + n[1] * b], wd = A.depth || 10, tip = A.tip || 13;
    const parts = []; let tipPt;
    if ((A.style || 'curly') === 'curly') {
      const a = Math.min(18, L / 4), h = L / 2, k = 0.45;
      const chain = [P(0, 0), P(0, wd * 0.55), P(a * k, wd), P(a, wd),
                     P(a + (h - 2 * a) / 3, wd), P(a + 2 * (h - 2 * a) / 3, wd), P(h - a, wd),
                     P(h - a * k, wd), P(h, wd + tip * k), P(h, wd + tip),
                     P(h, wd + tip * k), P(h + a * k, wd), P(h + a, wd),
                     P(h + a + (h - 2 * a) / 3, wd), P(h + a + 2 * (h - 2 * a) / 3, wd), P(L - a, wd),
                     P(L - a * k, wd), P(L, wd * 0.55), P(L, 0)];
      parts.push({ path: sample(p, { kind: 'bezier', pts: chain }), st: { role: A.lineRole || 'accent', w: prm.lineW }, w: [0, 0.72] });
      tipPt = P(h, wd + tip);
    } else {
      parts.push({ path: sample(p, { kind: 'line', pts: [P(0, 0), P(0, wd), P(L, wd), P(L, 0)] }), st: { role: A.lineRole || 'accent', w: prm.lineW }, w: [0, 0.7] });
      parts.push({ path: sample(p, { kind: 'line', pts: [P(L / 2, wd), P(L / 2, wd + tip)] }), st: { role: A.lineRole || 'accent', w: prm.lineW }, w: [0.55, 0.78] });
      tipPt = P(L / 2, wd + tip);
    }
    const lb = labelBeyond(p, T, A, tipPt, n, 8);
    return { layer: 1, parts, label: lb, labelW: [0.6, 1], slide: [n[0] * 6, n[1] * 6], targets: [], extras() {} };
  };

  K.dim = function (p, T, A, env, prm) {
    const a = A.a, b = A.b, L = Math.hypot(b[0] - a[0], b[1] - a[1]), u = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n0 = [u[1], -u[0]], sd = A.side === undefined ? 1 : A.side, n = [n0[0] * sd, n0[1] * sd];
    const off = A.offset || 30, ext = 7, g = 4, a2 = [a[0] + n[0] * off, a[1] + n[1] * off], b2 = [b[0] + n[0] * off, b[1] + n[1] * off];
    const lw = Math.max(1.2, prm.lineW * 0.6), role = A.lineRole || 'accent';
    const tk = (q) => { const d = [Math.cos(-Math.PI / 4) * u[0] - Math.sin(-Math.PI / 4) * u[1], Math.sin(-Math.PI / 4) * u[0] + Math.cos(-Math.PI / 4) * u[1]]; return [[q[0] - d[0] * 7, q[1] - d[1] * 7], [q[0] + d[0] * 7, q[1] + d[1] * 7]]; };
    const parts = [
      { path: sample(p, { kind: 'line', pts: [[a[0] + n[0] * g, a[1] + n[1] * g], [a2[0] + n[0] * ext, a2[1] + n[1] * ext]] }), st: { role: 'muted', w: 1.2 }, w: [0, 0.3] },
      { path: sample(p, { kind: 'line', pts: [[b[0] + n[0] * g, b[1] + n[1] * g], [b2[0] + n[0] * ext, b2[1] + n[1] * ext]] }), st: { role: 'muted', w: 1.2 }, w: [0, 0.3] },
      { path: sample(p, { kind: 'line', pts: [a2, b2] }), st: { role, w: lw + 0.6 }, w: [0.22, 0.8] },
      { path: sample(p, { kind: 'line', pts: tk(a2) }), st: { role, w: lw + 0.6 }, w: [0.2, 0.32] },
      { path: sample(p, { kind: 'line', pts: tk(b2) }), st: { role, w: lw + 0.6 }, w: [0.7, 0.82] }
    ];
    const mid = [(a2[0] + b2[0]) / 2, (a2[1] + b2[1]) / 2];
    const lb = A.labelAt === 'mid' ? mkLabel(p, T, A.text, mid[0], mid[1], A.size, A.role) : labelBeyond(p, T, A, mid, n, 10);
    return { layer: 1, parts, label: lb, labelW: [0.65, 1], opaque: A.labelAt === 'mid', slide: [0, 0], targets: [], extras() {} };
  };

  // hand-drawn circle: ~1.1 turns of a Catmull-Rom spline with seeded wobble, the tail overshooting the start
  K.circle = function (p, T, A, env, prm, seed) {
    const r = mulberry32(seed), b = A.box, pad = A.pad === undefined ? 8 : A.pad, cx = b.x + b.w / 2, cy = b.y + b.h / 2;
    const rx = b.w / 2 + pad * 0.5 + 3, ry = b.h / 2 + pad, a0 = -2.5 + (r() - 0.5) * 0.5, turns = 1.12 * Math.PI * 2, N = 16, tilt = (-3 - r() * 3) * Math.PI / 180, wob = prm.wobble;
    const pts = [];
    for (let i = 0; i <= N; i++) {
      const f = i / N, th = a0 + turns * f, k = 1 + (0.075 * f + (r() - 0.5) * 0.05 * wob);
      const x = Math.cos(th) * rx * k, y = Math.sin(th) * ry * k;
      pts.push([cx + x * Math.cos(tilt) - y * Math.sin(tilt), cy + x * Math.sin(tilt) + y * Math.cos(tilt)]);
    }
    const lb = A.text ? mkLabel(p, T, A.text, A.at[0], A.at[1], A.size, A.role) : null;
    return { layer: 1, parts: [{ path: sample(p, { kind: 'spline', pts }), st: { role: A.lineRole || 'accent', w: prm.lineW + 0.6, taper: true, pen: 4.5 }, w: [0, 0.85] }], label: lb, labelW: [0.7, 1], slide: [0, 6], targets: [], extras() {} };
  };

  K.underline = function (p, T, A, env, prm, seed) {
    const r = mulberry32(seed), b = A.box, y = b.y + b.h + (A.drop === undefined ? 5 : A.drop), x0 = b.x - 3, x1 = b.x + b.w + 3, wob = prm.wobble, pts = [];
    const n = Math.max(3, Math.round((x1 - x0) / 26)), slope = (r() - 0.35) * 1.6, wave = A.style === 'wave';
    for (let i = 0; i <= n; i++) {
      const f = i / n, jx = i === 0 || i === n ? 0 : (r() - 0.5) * 5 * wob;
      pts.push([x0 + (x1 - x0) * f + jx, y + slope * f * 3 + (wave ? Math.sin(f * (x1 - x0) / 7) * 2.6 : (r() - 0.5) * 1.8 * wob + Math.sin(f * 3.1) * 0.9)]);
    }
    const parts = [{ path: sample(p, { kind: 'spline', pts }), st: { role: A.lineRole || 'accent2', w: prm.lineW + 0.4, taper: true, pen: 4 }, w: [0, 0.9] }];
    if (A.double) { const q = pts.map((c, i) => [c[0] + (i === 0 ? 4 : i === n ? -3 : 0), c[1] + 4.5 + (r() - 0.5) * 1.5]); parts.push({ path: sample(p, { kind: 'spline', pts: q }), st: { role: A.lineRole || 'accent2', w: prm.lineW, taper: true }, w: [0.3, 1] }); }
    const lb = A.text ? mkLabel(p, T, A.text, A.at[0], A.at[1], A.size, A.role) : null;
    return { layer: 1, parts, label: lb, labelW: [0.7, 1], slide: [0, 6], targets: [], extras() {} };
  };

  K.pin = function (p, T, A, env, prm) {
    const q = A.at, o = A.off || [20, -36], c = [q[0] + o[0], q[1] + o[1]], rad = 13, d = Math.hypot(o[0], o[1]), u = [o[0] / d, o[1] / d];
    const stem = sample(p, { kind: 'line', pts: [[q[0] + u[0] * 4, q[1] + u[1] * 4], [c[0] - u[0] * rad, c[1] - u[1] * rad]] });
    let lb = null;
    if (A.text) { lb = mkLabel(p, T, A.text, 0, 0, A.size, A.role); const right = o[0] >= 0; lb = mkLabel(p, T, A.text, c[0] + (right ? 1 : -1) * (rad + 6 + lb.w / 2), c[1], A.size, A.role); }
    const num = String(A.n);
    return {
      layer: 1, parts: [{ path: stem, st: { role: A.lineRole || 'accent', w: 1.8 }, w: [0, 0.45] }], label: lb, labelW: [0.72, 1], slide: [(o[0] >= 0 ? -1 : 1) * 6, 0], targets: [],
      extras(p, T, fx) {
        const m = fx.win(0.4, 0.8), v = m.i * (1 - m.o);
        const d0 = fx.win(0, 0.2), dv = d0.i * (1 - d0.o);
        if (dv > 0.01) { p.noStroke(); p.fill(col(p, T, A.lineRole || 'accent', dv)); p.circle(q[0], q[1], 7 * (0.4 + 0.6 * dv)); }
        if (v <= 0.01) return;
        const sc = m.o > 0 ? 1 - m.o : ease('back', 'out', m.i); p.noStroke(); p.fill(col(p, T, A.lineRole || 'accent', Math.min(1, v * 1.6)));
        p.circle(c[0], c[1], rad * 2 * Math.max(0, sc));
        p.fill(col(p, T, onRole(p, T, A.lineRole || 'accent'), clamp(v * 1.6 - 0.2, 0, 1))); p.textFont(T.type.mono.family); p.textSize(15); p.textAlign(p.CENTER, p.BASELINE); p.text(num, c[0], c[1] + 5 * Math.max(0.2, sc));
      }
    };
  };

  K.spot = function (p, T, A, env, prm) {
    const pad = A.pad === undefined ? 10 : A.pad, b = A.box, hx = b.x - pad, hy = b.y - pad, hw = b.w + pad * 2, hh = b.h + pad * 2, rr = roundRect(hx, hy, hw, hh, 12);
    const ring = sample(p, { kind: 'line', pts: rr.concat([rr[0]]) });
    const lb = mkLabel(p, T, A.text, A.at ? A.at[0] : hx + hw / 2, A.at ? A.at[1] : hy + hh + 14 + 18, A.size, A.role);
    return {
      layer: 0, parts: [{ path: ring, st: { role: A.lineRole || 'accent', w: prm.lineW + 0.6 }, w: [0.1, 0.7] }], label: lb, labelW: [0.55, 1], slide: [0, 8], targets: [], hole: R(hx, hy, hw, hh),
      extras(p, T, fx) {
        const m = fx.win(0, 0.55), v = m.i * (1 - m.o) * prm.dim; if (v <= 0.005) return;
        p.noStroke(); p.fill(col(p, T, 'bg', v)); p.beginShape();
        p.vertex(-10, -10); p.vertex(970, -10); p.vertex(970, 550); p.vertex(-10, 550);
        p.beginContour(); for (let i = rr.length - 1; i >= 0; i--) p.vertex(rr[i][0], rr[i][1]); p.endContour();
        p.endShape(p.CLOSE);
      }
    };
  };

  // ---- scenes: an underlay (drawn static) plus the annotation list and the rects the marks must avoid -----
  const SCENES = {};

  SCENES.diagram = function (p, T, state, variant) {
    const names = ['Client', 'Gateway', 'Auth', 'Queue', 'Worker', 'Store'], nodes = {};
    names.forEach((n, i) => { nodes[n] = R(65 + i * 144, 250, 110, 70); });
    function draw(p, T) {
      p.textAlign(p.CENTER, p.BASELINE); p.textFont(T.type.body.family); p.textSize(18);
      for (let i = 0; i < names.length; i++) {
        const b = nodes[names[i]];
        p.stroke(col(p, T, 'ink', 0.7)); p.strokeWeight(1.6); p.fill(col(p, T, 'panel')); p.rect(b.x, b.y, b.w, b.h, 6);
        p.noStroke(); p.fill(col(p, T, 'ink')); p.text(names[i], b.x + b.w / 2, b.y + b.h / 2 + 6);
        if (i) { const a = nodes[names[i - 1]], y = b.y + b.h / 2; p.stroke(col(p, T, 'muted')); p.strokeWeight(1.6); p.line(a.x + a.w + 3, y, b.x - 9, y); p.fill(col(p, T, 'muted')); head(p, b.x - 3, y, 0, 8); }
      }
      p.noStroke(); p.fill(col(p, T, 'muted')); p.textFont(T.type.mono.family); p.textSize(14); p.textAlign(p.LEFT, p.BASELINE); p.text('request path', 65, 62);
    }
    const N = nodes;
    let annos;
    if (variant === 'spotlight') {
      annos = [
        { kind: 'spot', box: N.Auth, pad: 12, text: 'Auth is the only hop\nthat can refuse', role: 'must-read', t0: 0.4, t1: 3.7 },
        { kind: 'pin', n: 1, at: [N.Client.x + 55, N.Client.y], off: [22, -40], text: 'ingress', role: 'secondary', t0: 4.1 },
        { kind: 'pin', n: 2, at: [N.Queue.x + 55, N.Queue.y + N.Queue.h], off: [22, 40], text: 'buffer', role: 'secondary', t0: 4.6 },
        { kind: 'pin', n: 3, at: [N.Store.x + 55, N.Store.y], off: [-22, -40], text: 'persist', role: 'secondary', t0: 5.1 }
      ];
    } else {
      annos = [
        { kind: 'callout', target: N.Client, at: [215, 112], side: 'top', frac: 0.4, shape: 'elbow', text: 'retry on 429', role: 'must-read' },
        { kind: 'callout', target: N.Gateway, at: [150, 448], side: 'bottom', frac: 0.3, shape: 'curve', text: 'rate limit 100/s', role: 'must-read' },
        { kind: 'callout', target: N.Auth, at: [520, 108], side: 'top', frac: 0.6, shape: 'curve', text: 'JWT check, 2 ms', role: 'secondary' },
        { kind: 'callout', target: N.Queue, at: [575, 450], side: 'bottom', frac: 0.5, shape: 'elbow', text: 'depth capped at 5k', role: 'must-read' },
        { kind: 'callout', target: N.Worker, at: [745, 108], side: 'top', frac: 0.5, shape: 'straight', text: 'idempotent by key', role: 'secondary' },
        { kind: 'callout', target: N.Store, at: [795, 458], side: 'bottom', frac: 0.6, shape: 'straight', text: 'write once, read many', role: 'must-read' }
      ];
    }
    return { draw, annos, obstacles: names.map(n => nodes[n]) };
  };

  SCENES.bars = function (p, T, state) {
    const v = state.data.bars, base = 420, k = 3.0, bx = i => 130 + i * 90, bw = 62, yv = x => base - x * k, goal = 100;
    const rects = v.map((x, i) => R(bx(i), yv(x), bw, x * k));
    function draw(p, T) {
      p.noStroke(); p.fill(col(p, T, 'ink')); p.textFont(T.type.disp.family); p.textSize(32); p.textAlign(p.LEFT, p.BASELINE); p.text('Weekly throughput, k requests', 110, 66);
      p.stroke(col(p, T, 'line')); p.strokeWeight(1); p.line(110, base, 860, base);
      p.stroke(col(p, T, 'muted', 0.8)); p.strokeWeight(1.2);
      for (let s = 0; s < 750; s += 14) p.line(110 + s, yv(goal), Math.min(110 + s + 7, 860), yv(goal));
      p.noStroke(); p.fill(col(p, T, 'muted')); p.textFont(T.type.mono.family); p.textSize(14); p.textAlign(p.LEFT, p.BASELINE); p.text('goal ' + goal, 114, yv(goal) - 7);
      v.forEach((x, i) => {
        p.fill(col(p, T, 'muted', 0.3)); p.stroke(col(p, T, 'muted', 0.85)); p.strokeWeight(1.4); p.rect(bx(i), yv(x), bw, x * k, 3, 3, 0, 0);
        p.noStroke(); p.fill(col(p, T, 'muted')); p.textAlign(p.CENTER, p.BASELINE); p.text('W' + (i + 1), bx(i) + bw / 2, base + 22);
      });
    }
    const top = Math.min(v[4], v[5], v[6]);
    const annos = [
      { kind: 'bracket', style: 'square', from: [bx(0), base + 38], to: [bx(2) + bw, base + 38], side: -1, depth: 8, tip: 12, text: 'baseline weeks', role: 'secondary' },
      { kind: 'callout', target: rects[3], at: [230, 214], side: 'top', frac: 0.5, shape: 'straight', text: 'launch week', role: 'must-read' },
      { kind: 'bracket', style: 'curly', from: [bx(4), yv(Math.max(v[4], v[5], v[6])) - 20], to: [bx(6) + bw, yv(Math.max(v[4], v[5], v[6])) - 20], side: 1, depth: 9, tip: 13, text: 'ramp +' + (v[6] - v[3]) + ' vs W4', role: 'must-read' },
      { kind: 'dim', a: [bx(7) + bw, yv(v[7])], b: [bx(7) + bw, yv(goal)], offset: 28, side: -1, text: 'gap ' + (goal - v[7]), role: 'must-read' }
    ];
    return { draw, annos, obstacles: rects };
  };

  const TEXT = 'Attention is a lookup. Each token asks a question, every other token offers a key, and the best match decides how much of its value flows through. Nothing here is recurrent, so the whole sequence is compared at once, and the cost grows with the square of its length. That quadratic term is what long contexts pay for.';
  SCENES.text = function (p, T, state) {
    p.textFont(T.type.body.family); p.textSize(23);
    const x0 = 90, x1 = 870, y0 = 168, lead = 42, sp = p.textWidth('a a') - p.textWidth('aa'), words = [];
    let x = x0, y = y0;
    TEXT.split(' ').forEach(s => {
      const w = p.textWidth(s); if (x + w > x1) { x = x0; y += lead; }
      const core = s.replace(/[.,;:!?]+$/, ''); words.push({ s, core, x, y, w, cw: p.textWidth(core) }); x += w + sp;
    });
    const find = c => words.find(w => w.core === c);
    const boxOf = (...cs) => { const ws = cs.map(find), a = ws[0], b = ws[ws.length - 1]; return R(a.x, a.y - 18, b.x + b.cw - a.x, 26); };
    function draw(p, T) {
      p.noStroke(); p.fill(col(p, T, 'ink')); p.textFont(T.type.disp.family); p.textSize(40); p.textAlign(p.LEFT, p.BASELINE); p.text('Why long contexts are expensive', x0, 100);
      p.textFont(T.type.body.family); p.textSize(23);
      words.forEach(w => p.text(w.s, w.x, w.y));
    }
    const sq = boxOf('square');
    const annos = [
      { kind: 'circle', box: boxOf('question'), pad: 8, lineRole: 'accent' },
      { kind: 'underline', box: boxOf('key'), lineRole: 'accent2' },
      { kind: 'underline', box: boxOf('value'), style: 'wave', lineRole: 'accent' },
      { kind: 'underline', box: boxOf('recurrent'), double: true, lineRole: 'accent2' },
      { kind: 'circle', box: sq, pad: 8, lineRole: 'accent2' },
      { kind: 'callout', target: R(sq.x - 12, sq.y - 8, sq.w + 24, sq.h + 16), at: [330, 440], side: 'bottom', frac: 0.5, shape: 'curve', text: 'n tokens: n x n comparisons', role: 'must-read', lineRole: 'accent2' },
      { kind: 'underline', box: boxOf('quadratic', 'term'), drop: 6, lineRole: 'accent' }
    ];
    return { draw, annos, obstacles: [] };
  };

  // ---- pattern -----------------------------------------------------------------------------------
  const DEFAULTS = {
    scene: 'diagram',        // 'diagram' | 'bars' | 'text'; or pass params.annos (+ params.underlay(p,T)) for your own scene
    variant: 'callouts',     // 'callouts' | 'spotlight' (diagram scene only)
    annos: null,             // optional custom list, see card
    underlay: null,          // optional function(p, T) drawing what the marks point at
    obstacles: [],           // rects {x,y,w,h} leaders must route around (custom scenes)
    dur: 8,                  // seconds in the film
    lead: 0.35,              // s before the first mark starts
    inEnd: 0.62,             // fraction of dur by which the last staggered mark has fully arrived
    inDur: 0.9,              // s each mark takes to draw on
    outStart: 0.8,           // fraction of dur at which the first mark starts to retract
    outEnd: 0.96,            // fraction of dur by which the last has retracted
    outDur: 0.55,            // s each mark takes to retract
    ease: 'cubic', easeMode: 'inOut',
    lineW: 2.2,              // px at the 960 basis
    wobble: 1,               // 0..2 hand tremor on circles and underlines
    gap: 7,                  // stand-off between a leader tip and the thing it points at
    dim: 0.72,               // 0..1 how far the spotlight dims everything else
    pen: true                // pen-tip marker on hand-drawn strokes
  };

  function build(p, state, T) {
    const prm = state.prm, sc = prm.annos ? { draw: prm.underlay || (() => {}), annos: prm.annos, obstacles: prm.obstacles } : SCENES[prm.scene](p, T, state, prm.variant);
    const env = { obstacles: sc.obstacles.slice(), labelBoxes: [] };
    // pass 1: labels first so leaders can avoid each other; pass 2: leaders.
    const pre = sc.annos.map(a => (a.kind === 'callout' ? mkLabel(p, T, a.text, a.at[0], a.at[1], a.size, a.role).box : null));
    env.labelBoxes = pre.filter(Boolean);
    const comp = sc.annos.map((a, i) => {
      if (a.kind === 'callout') { const lb = mkLabel(p, T, a.text, a.at[0], a.at[1], a.size, a.role); env.labelBoxes[env.labelBoxes.findIndex(b => b.x === lb.box.x && b.y === lb.box.y)] = lb.box; }
      const c = K[a.kind](p, T, a, env, prm, state.seed * 131 + i * 977); c.a = a; return c;
    });
    // schedule
    const n = comp.length, st = n > 1 ? (prm.inEnd * prm.dur - prm.lead - prm.inDur) / (n - 1) : 0, ot = n > 1 ? (prm.outEnd * prm.dur - prm.outDur - prm.outStart * prm.dur) / (n - 1) : 0;
    comp.forEach((c, i) => { c.t0 = c.a.t0 !== undefined ? c.a.t0 : prm.lead + i * st; c.t1 = c.a.t1 !== undefined ? c.a.t1 : prm.outStart * prm.dur + i * ot; });
    // audit: label legibility and collisions
    const audit = { labels: 0, minLabelSize: 99, roles: { 'must-read': 0, secondary: 0 }, labelOverlapsLabel: 0, labelOverlapsTarget: 0, leaderCrossings: 0 };
    const lbs = comp.filter(c => c.label);
    lbs.forEach((c, i) => {
      audit.labels++; audit.minLabelSize = Math.min(audit.minLabelSize, c.label.sz); audit.roles[c.label.dataRole]++;
      lbs.slice(i + 1).forEach(d => { if (overlap(c.label.box, d.label.box)) audit.labelOverlapsLabel++; });
      sc.obstacles.concat(c.targets || []).forEach(o => { if (c.a.kind !== 'underline' && c.a.kind !== 'circle' && overlap(c.label.box, o)) audit.labelOverlapsTarget++; });
      if (c.miss) audit.leaderCrossings++;
    });
    return { sc, comp, audit };
  }

  ARSENAL.patterns.annotations = {
    id: 'annotations', atlas: ['arc-length-reveal', 'shape-custom-shapes', 'bezier-vertex', 'text-width', 'derived-geometry'], renderer: 'p2d',
    params: DEFAULTS,
    variants: [
      { name: 'callouts',  params: { scene: 'diagram', variant: 'callouts', ease: 'cubic', easeMode: 'inOut' } },
      { name: 'bars',      params: { scene: 'bars', ease: 'expo', easeMode: 'inOut', lineW: 2.4 } },
      { name: 'handmarks', params: { scene: 'text', ease: 'cubic', easeMode: 'inOut', wobble: 1.3, inDur: 1.1, lineW: 2.4 } },
      { name: 'spotlight', params: { scene: 'diagram', variant: 'spotlight', ease: 'back', easeMode: 'out', inDur: 0.8 } }
    ],
    setup(p, ctx, params) {
      const prm = Object.assign({}, DEFAULTS, params), seed = (ctx && ctx.seed) || 7, r = mulberry32(seed);
      const base = [32, 38, 36, 49, 61, 72, 68, 78];
      return { prm, seed, cache: {}, data: { bars: base.map(x => Math.round(x + (r() - 0.5) * 4)) } };
    },
    draw(p, t, state, params, T) {
      const prm = state.prm, L = state.cache[T.id] || (state.cache[T.id] = build(p, state, T));
      p.background(T.color.bg);
      p.push(); L.sc.draw(p, T); p.pop();
      const fxs = L.comp.map(c => {
        const a = ease(prm.ease, prm.easeMode, (t - c.t0) / prm.inDur), b = ease('cubic', 'inOut', (t - c.t1) / prm.outDur);
        const win = (w0, w1) => ({ i: clamp((a - w0) / (w1 - w0), 0, 1), o: clamp((b - (1 - w1)) / (w1 - w0), 0, 1) });
        return { a, b, win };
      });
      for (let layer = 0; layer <= 1; layer++) L.comp.forEach((c, k) => {
        if (c.layer !== layer) return; const fx = fxs[k];
        if (fx.a <= 0 || fx.b >= 1) return;
        p.push(); c.extras && layer === 0 && c.extras(p, T, fx, prm);
        c.parts.forEach(pt => {
          const w = fx.win(pt.w[0], pt.w[1]), s0 = w.o * pt.path.total, s1 = w.i * pt.path.total, st = pt.st;
          if (s1 - s0 < 0.4) return;
          p.noFill(); p.stroke(col(p, T, st.role)); p.strokeWeight(st.w); p.strokeCap(p.ROUND); p.strokeJoin(p.ROUND);
          if (st.taper) {
            const pts = slice(pt.path, s0, s1); let s = s0;
            for (let q = 1; q < pts.length; q++) {
              s += Math.hypot(pts[q][0] - pts[q - 1][0], pts[q][1] - pts[q - 1][1]);
              p.strokeWeight(st.w * (0.4 + 0.9 * Math.pow(Math.sin(Math.PI * clamp(s / pt.path.total * 0.96 + 0.02, 0, 1)), 0.6))); p.line(pts[q - 1][0], pts[q - 1][1], pts[q][0], pts[q][1]);
            }
          } else poly(p, slice(pt.path, s0, s1));
          if (st.head && w.i > 0.9 && w.o < 0.1) { const tip = pointAt(pt.path, s1); p.fill(col(p, T, st.role)); head(p, tip.x, tip.y, tip.a, st.head); }
          if (prm.pen && st.pen && w.o === 0) {
            const lift = 1 - smooth(0.94, 1, w.i), tip = pointAt(pt.path, s1), r = st.pen;
            p.noStroke(); p.fill(col(p, T, 'accent', 0.22 * lift)); p.circle(tip.x, tip.y, r * 4.2); p.fill(col(p, T, 'accent', lift)); p.circle(tip.x, tip.y, r * 2); p.fill(col(p, T, 'chalk', lift)); p.circle(tip.x, tip.y, r * 0.8);
          }
        });
        p.pop();
      });
      // layer 1 extras (dots, badges) and labels sit above every line
      L.comp.forEach((c, k) => {
        if (c.layer !== 1) return; const fx = fxs[k]; if (fx.a <= 0 || fx.b >= 1) return;
        p.push(); c.extras(p, T, fx, prm); p.pop();
        if (c.label) { const w = fx.win(c.labelW[0], c.labelW[1]); drawLabel(p, T, c.label, smooth(0, 1, w.i) * (1 - smooth(0, 1, w.o)), c.slide, c.opaque); }
      });
      // spotlight labels (layer 0) sit above the dimming overlay
      L.comp.forEach((c, k) => { if (c.layer === 0 && c.label) { const fx = fxs[k]; if (fx.a <= 0 || fx.b >= 1) return; const w = fx.win(c.labelW[0], c.labelW[1]); drawLabel(p, T, c.label, smooth(0, 1, w.i) * (1 - smooth(0, 1, w.o)), c.slide); } });
    },
    audit(p, state, T) { const L = state.cache[T.id] || (state.cache[T.id] = build(p, state, T)); return L.audit; }
  };
})();
