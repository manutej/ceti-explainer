// reveal: arc-length draw-on. Atlas: arc-length-reveal, shape-curves, shape-custom-shapes, easing-functions.
// Pure of (params, seed) in setup and of t in draw. Colours are token ROLES only.
(function () {
  window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} };

  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const smooth = (a, b, x) => { const u = clamp((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };

  // ---- easing families (easing-functions) -------------------------------------------------------
  const C1 = 1.70158, C3 = C1 + 1, C2 = C1 * 1.525;
  const EASE = {
    cubic: { inOut: x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2, out: x => 1 - Math.pow(1 - x, 3) },
    expo:  { inOut: x => x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2,
             out: x => x >= 1 ? 1 : 1 - Math.pow(2, -10 * x) },
    back:  { inOut: x => x < 0.5 ? (Math.pow(2 * x, 2) * ((C2 + 1) * 2 * x - C2)) / 2 : (Math.pow(2 * x - 2, 2) * ((C2 + 1) * (x * 2 - 2) + C2) + 2) / 2,
             out: x => 1 + C3 * Math.pow(x - 1, 3) + C1 * Math.pow(x - 1, 2) }
  };
  function ease(family, mode, x) { x = clamp(x, 0, 1); return (EASE[family] || EASE.cubic)[mode] ? (EASE[family] || EASE.cubic)[mode](x) : x; }

  // ---- path sampling: bezier (bezierOrder 3 chain) and spline (Catmull-Rom) -> points + length table
  function sample(p, spec) {
    const P = spec.pts, out = [];
    if (spec.kind === 'bezier') {                 // P = a0,c,c,a1,c,c,a2 ...
      for (let s = 0; s + 3 < P.length; s += 3) {
        const [a, b, c, d] = [P[s], P[s + 1], P[s + 2], P[s + 3]];
        const chord = Math.hypot(d[0] - a[0], d[1] - a[1]) + Math.hypot(b[0] - a[0], b[1] - a[1]) + Math.hypot(d[0] - c[0], d[1] - c[1]);
        const n = clamp(Math.ceil(chord / 5), 12, 90);
        for (let i = (s ? 1 : 0); i <= n; i++) { const t = i / n; out.push([p.bezierPoint(a[0], b[0], c[0], d[0], t), p.bezierPoint(a[1], b[1], c[1], d[1], t)]); }
      }
    } else if (spec.kind === 'spline') {          // Catmull-Rom through every point, end points doubled
      for (let s = 0; s < P.length - 1; s++) {
        const a = P[Math.max(0, s - 1)], b = P[s], c = P[s + 1], d = P[Math.min(P.length - 1, s + 2)];
        const n = clamp(Math.ceil(Math.hypot(c[0] - b[0], c[1] - b[1]) / 4), 8, 60);
        for (let i = (s ? 1 : 0); i <= n; i++) { const t = i / n; out.push([p.splinePoint(a[0], b[0], c[0], d[0], t), p.splinePoint(a[1], b[1], c[1], d[1], t)]); }
      }
    } else { for (const q of P) out.push([q[0], q[1]]); }
    const pts = [], L = [0];
    for (const q of out) {
      const last = pts[pts.length - 1];
      if (last && Math.hypot(q[0] - last[0], q[1] - last[1]) < 1e-6) continue;   // guard zero-length segments
      if (last) L.push(L[L.length - 1] + Math.hypot(q[0] - last[0], q[1] - last[1]));
      pts.push(q);
    }
    return { spec, pts, L, total: L[L.length - 1] || 1e-6 };
  }
  function seg(path, s) {                          // index i such that L[i] <= s < L[i+1]
    const L = path.L; let lo = 0, hi = L.length - 2;
    while (lo < hi) { const m = (lo + hi + 1) >> 1; if (L[m] <= s) lo = m; else hi = m - 1; }
    return lo;
  }
  function pointAt(path, s) {
    s = clamp(s, 0, path.total); const i = seg(path, s), a = path.pts[i], b = path.pts[Math.min(i + 1, path.pts.length - 1)];
    const k = (path.L[i + 1] - path.L[i]) > 0 ? (s - path.L[i]) / (path.L[i + 1] - path.L[i]) : 0;
    return { x: a[0] + (b[0] - a[0]) * k, y: a[1] + (b[1] - a[1]) * k, a: Math.atan2(b[1] - a[1], b[0] - a[0]) };
  }
  function slice(path, s0, s1) {                   // points of the path between arc positions s0..s1
    const o = [], A = pointAt(path, s0), B = pointAt(path, s1);
    o.push([A.x, A.y]);
    for (let i = seg(path, s0) + 1; i < path.pts.length && path.L[i] < s1; i++) if (path.L[i] > s0) o.push(path.pts[i]);
    o.push([B.x, B.y]); return o;
  }

  // ---- drawing helpers --------------------------------------------------------------------------
  function col(p, T, role, a) { const c = p.color(T.color[role]); c.setAlpha(p.alpha(c) * (a === undefined ? 1 : a)); return c; }
  function poly(p, pts) { p.beginShape(); for (const q of pts) p.vertex(q[0], q[1]); p.endShape(); }
  function head(p, x, y, ang, size) {
    p.push(); p.translate(x, y); p.rotate(ang); p.noStroke();
    p.triangle(0, 0, -size, -size * 0.42, -size, size * 0.42); p.pop();
  }
  // native guide: the full path with bezierOrder/bezierVertex or splineVertex (p5 2.x custom shapes)
  function guide(p, spec) {
    p.noFill(); const P = spec.pts;
    if (spec.kind === 'bezier') {
      p.bezierOrder(3); p.beginShape(); p.vertex(P[0][0], P[0][1]);
      for (let i = 1; i < P.length; i++) p.bezierVertex(P[i][0], P[i][1]);
      p.endShape();
    } else if (spec.kind === 'spline') {
      p.beginShape(); for (const q of P) p.splineVertex(q[0], q[1]); p.endShape();
    } else poly(p, P);
  }

  // Draw one path at eased fraction u. style: {role, w, dash:[d,g]|null, head, pen, taper, alpha}
  function drawPath(p, T, path, u, st, prm) {
    if (u <= 0) return;
    const target = u * path.total, role = st.role || 'ink', w = st.w || prm.lineW, al = st.alpha === undefined ? 1 : st.alpha;
    p.noFill(); p.stroke(col(p, T, role, al)); p.strokeWeight(w); p.strokeCap(p.ROUND); p.strokeJoin(p.ROUND);
    const dash = st.dash === undefined ? (prm.dashed ? prm.dash : null) : st.dash;
    if (dash) {
      const per = dash[0] + dash[1];
      for (let s0 = 0; s0 < target; s0 += per) poly(p, slice(path, s0, Math.min(s0 + dash[0], target)));
    } else if (st.taper) {
      const pts = slice(path, 0, target); let s = 0;
      for (let i = 1; i < pts.length; i++) {
        s += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
        const f = s / path.total, wt = w * (0.35 + 0.95 * Math.pow(Math.sin(Math.PI * clamp(f * 0.96 + 0.02, 0, 1)), 0.6));
        p.strokeWeight(wt); p.line(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1]);
      }
    } else poly(p, slice(path, 0, target));
    const tip = pointAt(path, target);
    if (st.head && u > 0.02) { p.fill(col(p, T, role, al)); head(p, tip.x, tip.y, tip.a, st.head); }
    if (prm.pen && st.pen) {                        // pen tip: dot + halo, lifts off as the stroke completes
      const lift = 1 - smooth(0.94, 1, u), r = st.pen;
      p.noStroke(); p.fill(col(p, T, st.penRole || 'accent', 0.22 * lift)); p.circle(tip.x, tip.y, r * 4.2);
      p.fill(col(p, T, st.penRole || 'accent', lift)); p.circle(tip.x, tip.y, r * 2);
      p.fill(col(p, T, 'chalk', lift)); p.circle(tip.x, tip.y, r * 0.8);
    }
  }
  function label(p, T, txt, x, y, a, size, role, align) {
    if (a <= 0.01) return; p.noStroke(); p.fill(col(p, T, role || 'muted', a));
    p.textFont(T.type.mono.family); p.textSize(size || 13); p.textAlign(align || p.LEFT, p.BASELINE); p.text(txt, x, y);
  }

  // ---- layouts ----------------------------------------------------------------------------------
  const LAYOUTS = {
    diagram() {
      const ox = 140, oy = 430, ex = 850, ty = 80;
      const paths = [
        { spec: { kind: 'line', pts: [[ox, oy], [ex, oy]] }, st: { role: 'ink', w: 2, head: 11 } },
        { spec: { kind: 'line', pts: [[ox, oy], [ox, ty]] }, st: { role: 'ink', w: 2, head: 11 } },
        { spec: { kind: 'line', pts: [[ox, 222], [ex - 10, 222]] }, st: { role: 'muted', w: 1.4, dash: [7, 6] } },
        { spec: { kind: 'line', pts: [[380, 150], [380, oy]] }, st: { role: 'muted', w: 1.4, dash: [3, 6] } },
        { spec: { kind: 'spline', pts: [[ox, oy], [260, 352], [400, 292], [540, 252], [700, 233], [820, 227]] }, st: { role: 'accent2', w: 2.2, dash: [12, 7] } },
        { spec: { kind: 'bezier', pts: [[ox, oy], [220, 420], [280, 150], [380, 150], [470, 150], [560, 262], [640, 236], [720, 212], [770, 222], [830, 222]] }, st: { role: 'accent', w: 3.4, pen: 4.5 } }
      ];
      return { paths, decor(p, T, lu) {
        p.stroke(col(p, T, 'line')); p.strokeWeight(1);
        for (let i = 1; i <= 6; i++) { const x = ox + i * 110; if (x < ex - 20) { const a = smooth(i / 8, i / 8 + 0.12, lu[0]); p.stroke(col(p, T, 'muted', a)); p.line(x, oy - 5, x, oy + 5); label(p, T, String(i * 10), x, oy + 24, a, 12, 'muted', p.CENTER); } }
        for (let i = 1; i <= 4; i++) { const y = oy - i * 85; const a = smooth(i / 6, i / 6 + 0.12, lu[1]); p.stroke(col(p, T, 'muted', a)); p.line(ox - 5, y, ox + 5, y); label(p, T, String(i * 25), ox - 14, y + 4, a, 12, 'muted', p.RIGHT); }
        label(p, T, 't (s)', ex - 6, oy + 44, lu[0], 13, 'ink', p.RIGHT);
        label(p, T, 'y(t)', ox + 12, ty + 10, lu[1], 13, 'ink');
        label(p, T, 'steady state', ex - 20, 212, lu[2], 12, 'muted', p.RIGHT);
        label(p, T, 'peak', 392, 140, smooth(0.5, 0.65, lu[5]), 13, 'accent');
        label(p, T, 'model', 760, 262, lu[4], 12, 'accent2', p.CENTER);
      } };
    },
    signature() {
      const S = [[190, 336], [214, 262], [252, 196], [296, 190], [304, 246], [268, 318], [226, 372], [262, 360], [326, 296], [368, 252], [380, 302], [362, 352], [404, 332], [452, 272], [482, 244], [490, 292], [478, 342], [532, 322], [584, 262], [612, 254], [620, 304], [608, 350], [676, 332], [738, 284], [790, 262], [842, 258]];
      const paths = [
        { spec: { kind: 'line', pts: [[150, 392], [820, 392]] }, st: { role: 'line', w: 1.2, alpha: 1 } },
        { spec: { kind: 'spline', pts: S }, st: { role: 'ink', w: 5.4, taper: true, pen: 5, penRole: 'accent' } },
        { spec: { kind: 'spline', pts: [[196, 410], [330, 396], [520, 404], [700, 388], [832, 372]] }, st: { role: 'accent', w: 3, taper: true, pen: 4 } }
      ];
      return { paths, decor(p, T, lu) {
        label(p, T, 'x', 150, 384, 1, 18, 'muted'); label(p, T, 'signed', 820, 424, smooth(0.6, 0.9, lu[2]), 12, 'muted', p.RIGHT);
      } };
    },
    network(seed) {
      const R = mulberry32(seed), X = [160, 480, 800], N = [6, 8, 6];
      const nodes = X.map((x, l) => Array.from({ length: N[l] }, (_, i) => ({ x, y: 90 + (360 * i) / (N[l] - 1), l, i, inc: [] })));
      const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
      const edges = [];
      nodes[1].forEach(b => shuffle([0, 1, 2, 3, 4, 5]).slice(0, 3).sort().forEach(a => edges.push([nodes[0][a], b])));
      nodes[2].forEach((c, i) => shuffle([0, 1, 2, 3, 4, 5, 6, 7]).slice(0, i < 4 ? 3 : 2).sort().forEach(b => edges.push([nodes[1][b], c])));
      const paths = edges.map(([a, b], k) => {
        const mx = (a.x + b.x) / 2;
        a.inc.push(k); b.inc.push(k);
        return { spec: { kind: 'bezier', pts: [[a.x, a.y], [mx, a.y], [mx, b.y], [b.x, b.y]] },
                 st: { role: a.l === 0 ? 'accent' : 'ink', w: 1.7, alpha: a.l === 0 ? 1 : 0.85, pen: 2.6, dash: (k % 5 === 4) ? [9, 5] : null } };
      });
      return { paths, nodes, top: true, decor(p, T, lu) {
        for (const col2 of nodes) for (const n of col2) {
          const a = n.inc.reduce((m, k) => Math.max(m, smooth(0.9, 1, lu[k])), 0);
          p.stroke(col(p, T, 'line')); p.strokeWeight(1.5); p.fill(col(p, T, 'panel')); p.circle(n.x, n.y, 17);
          if (a > 0) { p.noStroke(); p.fill(col(p, T, n.l === 2 ? 'accent2' : 'accent', a)); p.circle(n.x, n.y, 17 * (0.55 + 0.45 * a)); }
        }
        const done = lu.filter(u => u >= 1).length;
        label(p, T, done + ' / ' + lu.length + ' connectors', 480, 500, 1, 14, 'muted', p.CENTER);
      } };
    }
  };

  // ---- the pattern ------------------------------------------------------------------------------
  const DEFAULTS = {
    layout: 'diagram',          // 'diagram' | 'signature' | 'network'; or pass params.paths (see card)
    paths: null,                // optional custom [{spec:{kind,pts}, st:{...}}]
    ease: 'cubic',              // 'cubic' | 'expo' | 'back'
    easeMode: 'inOut',          // 'inOut' | 'out'
    stagger: 0.5,               // 0 = all paths together, 1 = strictly one after another
    dur: 4,                     // seconds in the film
    hold: 0.15,                 // trailing fraction held at full reveal
    lineW: 2.5,                 // px at 960 basis
    dashed: false,              // dash every path without its own dash style
    dash: [10, 6],              // dash, gap in px of arc length
    pen: true,                  // pen-tip marker where a style asks for one
    guide: 0                    // 0..1 alpha of the native full-path ghost (bezierVertex / splineVertex)
  };

  ARSENAL.patterns.reveal = {
    id: 'reveal', atlas: ['arc-length-reveal', 'shape-curves', 'shape-custom-shapes', 'easing-functions'], renderer: 'p2d',
    params: DEFAULTS,
    variants: [
      { name: 'diagram',   params: { layout: 'diagram', ease: 'cubic', easeMode: 'inOut', stagger: 0.55, guide: 0.12 } },
      { name: 'signature', params: { layout: 'signature', ease: 'expo', easeMode: 'inOut', stagger: 0.8, pen: true } },
      { name: 'network',   params: { layout: 'network', ease: 'back', easeMode: 'out', stagger: 0.35, lineW: 1.7 } }
    ],
    setup(p, ctx, params) {
      const prm = Object.assign({}, DEFAULTS, params), seed = (ctx && ctx.seed) || 7;
      const lay = prm.paths ? { paths: prm.paths, decor() {} } : LAYOUTS[prm.layout](seed);
      const paths = lay.paths.map(d => Object.assign(sample(p, d.spec), { st: d.st || {} }));
      return { prm, lay, paths };
    },
    draw(p, t, state, params, T) {
      const prm = state.prm, n = state.paths.length;
      p.background(T.color.bg);
      const g = clamp(t / (prm.dur * (1 - prm.hold)), 0, 1);
      const d = 1 / (1 + (n - 1) * prm.stagger);                 // each path's window, as a fraction of the timeline
      const lu = state.paths.map((_, i) => ease(prm.ease, prm.easeMode, (g - i * prm.stagger * d) / d));
      if (prm.guide > 0) {                                        // faint native full-path ghost
        p.strokeWeight(1.2); p.strokeCap(p.ROUND); p.strokeJoin(p.ROUND);
        state.paths.forEach(pa => { p.stroke(col(p, T, 'line', prm.guide * 4)); guide(p, pa.spec); });
      }
      if (!state.lay.top) state.lay.decor(p, T, lu);
      state.paths.forEach((pa, i) => drawPath(p, T, pa, lu[i], pa.st, prm));
      if (state.lay.top) state.lay.decor(p, T, lu);
    }
  };
})();
