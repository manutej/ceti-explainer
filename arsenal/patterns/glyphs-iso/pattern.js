// glyphs-iso: a geometric glyph vocabulary (one stroke weight, build(u) draw-on) and an isometric 2.5D helper.
// Atlas: shape-custom-shapes (beginShape/vertex partial polylines), push-pop (scoped glyph placement),
// math-trigonometry (arcs, iso projection), triangle-subdivision (seeded organic jitter, fixed depth).
// Pure of (params, seed) in setup and of t in draw. Colours are token ROLES only.
(function () {
  window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} };

  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const TAU = Math.PI * 2;
  const EASE = {
    linear: x => x,
    cubic: x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
    out: x => 1 - Math.pow(1 - x, 3),
    expo: x => x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2
  };
  const ease = (name, x) => (EASE[name] || EASE.cubic)(clamp(x, 0, 1));

  // ---- colour helpers (roles only) -------------------------------------------------------------
  function col(p, T, role, a) { const c = p.color(T.color[role] || role); if (a != null && a < 1) c.setAlpha(clamp(a, 0, 1) * 255); return c; }
  const mix = (p, a, b, k) => p.lerpColor(a, b, k);
  function isDark(p, T) { const c = p.color(T.color.bg); return (0.3 * p.red(c) + 0.59 * p.green(c) + 0.11 * p.blue(c)) < 128; }

  // ---- stroke tables: points + cumulative arc length -------------------------------------------
  function stroke(pts, o) {
    o = o || {};
    const P = o.closed ? pts.concat([pts[0]]) : pts, cum = [0];
    for (let i = 1; i < P.length; i++) cum.push(cum[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
    return { pts: P, cum, total: cum[cum.length - 1] || 1e-6, dot: !!o.dot, hi: !!o.hi };
  }
  const arc = (cx, cy, rx, ry, a0, a1, n) => { n = n || Math.max(8, Math.ceil(Math.abs(a1 - a0) / TAU * 56)); const o = []; for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; o.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]); } return o; };
  const circle = (cx, cy, r) => arc(cx, cy, r, r, 0, TAU, 56).slice(0, -1);
  const rect = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
  const line = (x0, y0, x1, y1) => [[x0, y0], [x1, y1]];
  const head = (ex, ey, dx, dy, s) => { const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l; return [[ex - dx * s - dy * s * 0.62, ey - dy * s + dx * s * 0.62], [ex, ey], [ex - dx * s + dy * s * 0.62, ey - dy * s - dx * s * 0.62]]; };
  const dot = (x, y) => stroke([[x, y]], { dot: true });
  const S = (pts, o) => stroke(pts, o);

  // union outline of overlapping circles resting on a flat base (cloud-as-circles)
  function cloudPath() {
    const C = [[-22, 9, 13], [-4, -6, 20], [17, 4, 18]], out = [], ranges = [[Math.PI / 2, TAU], [Math.PI, TAU], [1.5 * Math.PI, 2.5 * Math.PI]];
    C.forEach((c, i) => {
      for (let k = 0; k <= 90; k++) {
        const a = ranges[i][0] + (ranges[i][1] - ranges[i][0]) * k / 90, x = c[0] + c[2] * Math.cos(a), y = c[1] + c[2] * Math.sin(a);
        if (y > 22.001) continue;
        if (C.some((d, j) => j !== i && Math.hypot(x - d[0], y - d[1]) < d[2] - 0.05)) continue;
        out.push([x, y]);
      }
    });
    out.push([-22, 22]);
    return out;
  }

  // ---- the vocabulary: 100-unit box centred on 0; every glyph is a list of strokes (+ optional dyn(t)) ----
  const GLYPHS = {
    node: { label: 'node', strokes: () => [S(circle(0, 0, 16)), S(line(-13, 11, -32, 26)), S(line(15, 8, 33, 18)), S(line(0, -16, 0, -33)), dot(-34, 28, 1), dot(36, 19), dot(0, -36)] },
    document: { label: 'document', strokes: () => [S([[-24, -36], [8, -36], [24, -20], [24, 36], [-24, 36]], { closed: true }), S([[8, -36], [8, -20], [24, -20]]), S(line(-14, -4, 14, -4), { hi: true }), S(line(-14, 8, 14, 8)), S(line(-14, 20, 4, 20))] },
    server: { label: 'server', strokes: () => [S(rect(-32, -36, 64, 20), { closed: true }), S(rect(-32, -10, 64, 20), { closed: true }), S(rect(-32, 16, 64, 20), { closed: true }), dot(-22, -26), dot(-22, 0), dot(-22, 26), S(line(-8, -26, 20, -26), { hi: true }), S(line(-8, 0, 20, 0)), S(line(-8, 26, 20, 26))] },
    person: { label: 'person', strokes: () => [S(circle(0, -16, 14), { hi: true }), S(arc(0, 38, 30, 34, Math.PI, TAU))] },
    arrow: { label: 'arrow', strokes: () => [S(line(-36, 0, 34, 0)), S(head(34, 0, 1, 0, 15), { hi: true })] },
    arrow2: { label: 'both ways', strokes: () => [S(line(-34, 0, 34, 0)), S(head(34, 0, 1, 0, 14), { hi: true }), S(head(-34, 0, -1, 0, 14))] },
    bend: { label: 'bend', strokes: () => [S(line(-30, 34, -30, 4).concat(arc(-16, 4, 14, 14, Math.PI, 1.5 * Math.PI, 14).slice(1), [[34, -10]])), S(head(34, -10, 1, 0, 15), { hi: true })] },
    cycle: { label: 'cycle', strokes: () => { const a1 = 1.78 * Math.PI, ex = 28 * Math.cos(a1), ey = 28 * Math.sin(a1); return [S(arc(0, 0, 28, 28, 0.32 * Math.PI, a1)), S(head(ex, ey, -Math.sin(a1), Math.cos(a1), 15), { hi: true })]; } },
    lock: { label: 'lock', strokes: () => [S(rect(-24, -4, 48, 40), { closed: true }), S([[-14, -4], [-14, -16]].concat(arc(0, -16, 14, 14, Math.PI, TAU, 20).slice(1), [[14, -4]]), { hi: true }), S(circle(0, 12, 5)), S(line(0, 17, 0, 26))] },
    clock: {
      label: 'clock', strokes: () => [S(circle(0, 0, 32)), S(line(0, -27, 0, -32)), S(line(27, 0, 32, 0)), S(line(0, 27, 0, 32)), S(line(-27, 0, -32, 0)), dot(0, 0)],
      dyn: t => { const m = -Math.PI / 2 + t * TAU / 3, h = -Math.PI / 2 + 0.9 + t * TAU / 36; return [S(line(0, 0, 24 * Math.cos(m), 24 * Math.sin(m)), { hi: true }), S(line(0, 0, 15 * Math.cos(h), 15 * Math.sin(h)))]; }
    },
    gear: {
      label: 'gear', strokes: () => [S(circle(0, 0, 22)), S(circle(0, 0, 9), { hi: true })],
      dyn: t => { const o = []; for (let i = 0; i < 12; i++) { const a = i * TAU / 12 + t * 0.35; o.push(S(line(22 * Math.cos(a), 22 * Math.sin(a), 32 * Math.cos(a), 32 * Math.sin(a)))); } return o; }
    },
    database: { label: 'database', strokes: () => [S(arc(0, -26, 28, 10, 0, TAU, 48).slice(0, -1), { closed: true }), S(line(-28, -26, -28, 26)), S(line(28, -26, 28, 26)), S(arc(0, 26, 28, 10, 0, Math.PI, 28)), S(arc(0, -6, 28, 10, 0, Math.PI, 28), { hi: true }), S(arc(0, 10, 28, 10, 0, Math.PI, 28))] },
    cloud: { label: 'cloud', strokes: () => [S(cloudPath(), { closed: true }), S(line(-8, 8, 8, 8), { hi: true })] },
    magnifier: { label: 'search', strokes: () => [S(circle(-6, -6, 24)), S(line(11, 11, 34, 34), { hi: true })] },
    check: { label: 'check', strokes: () => [S(circle(0, 0, 30)), S([[-13, 1], [-4, 11], [14, -10]], { hi: true })] }
  };
  const ORDER = ['node', 'document', 'server', 'person', 'arrow', 'arrow2', 'bend', 'cycle', 'lock', 'clock', 'gear', 'database', 'cloud', 'magnifier', 'check'];
  Object.values(GLYPHS).forEach(g => { g._cache = null; });
  const gStrokes = g => g._cache || (g._cache = g.strokes());

  // ---- partial draw of a stroke by fraction of arc length (custom shape, vertex per call) ----------
  function posAt(st, f) {
    const target = clamp(f, 0, 1) * st.total, P = st.pts, c = st.cum;
    for (let i = 1; i < P.length; i++) if (c[i] >= target) { const k = (target - c[i - 1]) / ((c[i] - c[i - 1]) || 1); return { x: P[i - 1][0] + (P[i][0] - P[i - 1][0]) * k, y: P[i - 1][1] + (P[i][1] - P[i - 1][1]) * k, dx: P[i][0] - P[i - 1][0], dy: P[i][1] - P[i - 1][1] }; }
    const n = P.length - 1; return { x: P[n][0], y: P[n][1], dx: P[n][0] - P[n - 1][0], dy: P[n][1] - P[n - 1][1] };
  }
  function partial(p, st, f) {
    if (f <= 0) return;
    const target = f * st.total, P = st.pts, c = st.cum;
    p.beginShape();
    for (let i = 0; i < P.length; i++) {
      if (c[i] <= target) p.vertex(P[i][0], P[i][1]);
      else { const k = (target - c[i - 1]) / ((c[i] - c[i - 1]) || 1); p.vertex(P[i - 1][0] + (P[i][0] - P[i - 1][0]) * k, P[i - 1][1] + (P[i][1] - P[i - 1][1]) * k); break; }
    }
    p.endShape();
  }

  // build(u): one glyph, u in 0..1 (linear in; eased here). Strokes run in parallel with a stagger window.
  function drawGlyph(p, T, name, cx, cy, size, u, t, o) {
    o = o || {};
    const g = GLYPHS[name]; if (!g || u <= 0) return;
    const k = size / 100, E = ease(o.ease || 'cubic', u), lw = o.lineW || 3, stag = o.glyphStagger == null ? 0.5 : o.glyphStagger;
    const list = gStrokes(g).concat(g.dyn ? g.dyn(t || 0) : []), n = list.length, w = 1 - stag * (n - 1) / n;
    const base = col(p, T, o.role || 'ink', o.alpha), hi = col(p, T, o.hiRole || 'accent', o.alpha);
    p.push(); p.translate(cx, cy); p.scale(k); p.strokeWeight(lw / k); p.strokeCap(p.ROUND); p.strokeJoin(p.ROUND); p.noFill();
    list.forEach((st, i) => {
      const f = clamp((E - stag * i / n) / w, 0, 1); if (f <= 0) return;
      const c = st.hi ? hi : base;
      if (st.dot) { p.noStroke(); p.fill(c); p.circle(st.pts[0][0], st.pts[0][1], (lw * 1.9 / k) * f); p.noFill(); return; }
      p.stroke(c); partial(p, st, f);
    });
    p.pop();
  }

  // dashes marching along a polyline (arrow with a growing tip); screen-space points
  function flowArrow(p, T, pts, u, t, o) {
    o = o || {};
    const st = stroke(pts), f = ease(o.ease || 'cubic', u); if (f <= 0) return;
    const c = col(p, T, o.role || 'accent', o.alpha), ctx = p.drawingContext, dash = o.dash || [9, 7];
    p.push(); p.noFill(); p.stroke(c); p.strokeWeight(o.lineW || 3); p.strokeCap(p.ROUND); p.strokeJoin(p.ROUND);
    ctx.setLineDash(dash); ctx.lineDashOffset = -(t || 0) * (o.speed == null ? 36 : o.speed) * (o.dir || 1);
    partial(p, st, f);
    ctx.setLineDash([]); ctx.lineDashOffset = 0;
    const e = posAt(st, f), h = head(e.x, e.y, e.dx, e.dy, o.headS || 11);
    p.beginShape(); h.forEach(v => p.vertex(v[0], v[1])); p.endShape();
    p.pop();
  }

  // ---- isometric helper (2.5D on Canvas2D) -----------------------------------------------------
  // x runs down-right, y down-left, z up. Larger x, y, z are nearer the viewer (painter order: sort by x+y+z).
  const ISO = {
    make(o) {
      const ang = o.ang == null ? Math.PI / 6 : o.ang, ca = Math.cos(ang), sa = Math.sin(ang), s = o.s || 50, ox = o.ox || 0, oy = o.oy || 0;
      return { s, ox, oy, ang, project: (x, y, z) => [ox + (x - y) * ca * s, oy + (x + y) * sa * s - (z || 0) * s] };
    },
    // face colours for a base colour: top lighter, left base, right shadowed (direction follows the brand's luminance)
    shades(p, T, base) {
      const dk = isDark(p, T), bg = col(p, T, 'bg'), ink = col(p, T, 'ink'), chalk = col(p, T, 'chalk');
      return dk ? { top: mix(p, base, ink, 0.16), left: base, right: mix(p, base, bg, 0.5) } : { top: mix(p, base, chalk, 0.45), left: base, right: mix(p, base, ink, 0.2) };
    },
    quad(p, I, pts) { p.beginShape(); pts.forEach(v => { const q = I.project(v[0], v[1], v[2]); p.vertex(q[0], q[1]); }); p.endShape(p.CLOSE); },
    // box at corner (x,y,z), size (w,d,h); faces = {top,left,right} colours; edge = stroke colour; grow 0..1 scales height
    box(p, I, b, faces, edge, sw, grow) {
      const g = grow == null ? 1 : grow; if (g <= 0) return;
      const x = b.x, y = b.y, z = b.z, w = b.w, d = b.d, h = b.h * g;
      p.push(); p.stroke(edge); p.strokeWeight(sw || 1.5); p.strokeJoin(p.ROUND);
      p.fill(faces.left); ISO.quad(p, I, [[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]]);
      p.fill(faces.right); ISO.quad(p, I, [[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]]);
      p.fill(faces.top); ISO.quad(p, I, [[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]]);
      p.pop();
    },
    // floor grid of nx*ny cells at height z, drawn on by u (line count), as faint lines
    grid(p, I, x0, y0, nx, ny, z, c, u) {
      p.push(); p.stroke(c); p.strokeWeight(1); p.noFill();
      for (let i = 0; i <= nx; i++) { const f = clamp(u * 1.6 - i / (nx + 1) * 0.6, 0, 1); if (f > 0) { const a = I.project(x0 + i, y0, z), b = I.project(x0 + i, y0 + ny * f, z); p.line(a[0], a[1], b[0], b[1]); } }
      for (let j = 0; j <= ny; j++) { const f = clamp(u * 1.6 - j / (ny + 1) * 0.6, 0, 1); if (f > 0) { const a = I.project(x0, y0 + j, z), b = I.project(x0 + nx * f, y0 + j, z); p.line(a[0], a[1], b[0], b[1]); } }
      p.pop();
    },
    // a path on the floor: world points -> screen polyline for flowArrow / stroke tables
    path(I, pts) { return pts.map(q => I.project(q[0], q[1], q[2] || 0)); },
    // a ring (circle in the floor plane) = flattened ellipse in screen space
    ring(p, I, cx, cy, z, r, c, sw) { p.push(); p.noFill(); p.stroke(c); p.strokeWeight(sw || 2); p.beginShape(); for (let i = 0; i < 40; i++) { const a = i * TAU / 40, q = I.project(cx + r * Math.cos(a), cy + r * Math.sin(a), z); p.vertex(q[0], q[1]); } p.endShape(p.CLOSE); p.pop(); }
  };

  // ---- text ------------------------------------------------------------------------------------
  function label(p, T, txt, x, y, size, c, align) { p.push(); p.noStroke(); p.fill(c); p.textFont(T.type.mono.family); p.textSize(size || 11); p.textAlign(align || p.CENTER, p.BASELINE); p.text(txt, x, y); p.pop(); }

  // ---- layouts ---------------------------------------------------------------------------------
  const seg = (t, a, b) => clamp((t - a) / (b - a), 0, 1);

  function sheet(p, t, st, P, T) {
    label(p, T, 'GLYPHS  ·  one stroke weight  ·  build(u)', 40, 44, 12, col(p, T, 'muted'), p.LEFT);
    const cols = 5, X0 = 96, DX = 192, Y0 = 130, DY = 164;
    ORDER.forEach((n, i) => {
      const cx = X0 + (i % cols) * DX, cy = Y0 + Math.floor(i / cols) * DY, u = seg(t, i * P.stagger, i * P.stagger + P.buildS);
      p.push(); p.noFill(); p.stroke(col(p, T, 'line')); p.strokeWeight(1);
      p.line(cx - 6, cy, cx + 6, cy); p.line(cx, cy - 6, cx, cy + 6); p.pop();
      drawGlyph(p, T, n, cx, cy, P.size, u, Math.max(0, t - i * P.stagger - P.buildS), { lineW: P.lineW, ease: P.ease });
      label(p, T, GLYPHS[n].label, cx, cy + P.size * 0.5 + 24, 11, col(p, T, 'muted', ease('out', seg(u, 0.5, 1))));
    });
  }

  function system(p, t, st, P, T) {
    label(p, T, 'SYSTEM  ·  client → service → database', 40, 44, 12, col(p, T, 'muted'), p.LEFT);
    const Y = 262, XS = [150, 480, 810], G = 132, names = ['person', 'server', 'database'], lab = ['client', 'service', 'database'];
    names.forEach((n, i) => {
      const u = seg(t, 0.2 + i * 0.35, 1.2 + i * 0.35);
      drawGlyph(p, T, n, XS[i], Y, G, u, t, { lineW: P.lineW, ease: P.ease });
      label(p, T, lab[i], XS[i], Y + G * 0.5 + 32, 13, col(p, T, 'ink', ease('out', seg(u, 0.6, 1))));
    });
    const hw = G * 0.5 + 12, yq = Y - 16, yr = Y + 20;
    [[0, 1.7, 'GET /rows'], [1, 2.2, 'SELECT *']].forEach(([i, a, txt]) => {
      const u = seg(t, a, a + 0.9), x0 = XS[i] + hw, x1 = XS[i + 1] - hw;
      flowArrow(p, T, [[x0, yq], [x1, yq]], u, Math.max(0, t - a), { role: 'accent', lineW: P.lineW, speed: P.speed, dash: P.dash });
      label(p, T, txt, (x0 + x1) / 2, yq - 18, 11, col(p, T, 'accent', ease('out', seg(u, 0.5, 1))));
    });
    [[1, 3.0, 'rows'], [0, 3.5, '200 · json']].forEach(([i, a, txt]) => {
      const u = seg(t, a, a + 0.9), x0 = XS[i + 1] - hw, x1 = XS[i] + hw;
      flowArrow(p, T, [[x0, yr], [x1, yr]], u, Math.max(0, t - a), { role: 'accent2', lineW: P.lineW, speed: P.speed, dash: P.dash });
      label(p, T, txt, (x0 + x1) / 2, yr + 28, 11, col(p, T, 'accent2', ease('out', seg(u, 0.5, 1))));
    });
    drawGlyph(p, T, 'lock', (XS[1] + XS[2]) / 2, Y - 74, 44, seg(t, 4.1, 5.0), t, { lineW: P.lineW * 0.8, ease: P.ease, role: 'muted' });
  }

  // 3x3x3 stack that lights up by t: grow-in wave, then a diagonal light sweep with seeded jitter
  function stack(p, t, st, P, T) {
    label(p, T, 'STACK  ·  3 × 3 × 3  ·  light(t)', 40, 44, 12, col(p, T, 'muted'), p.LEFT);
    const I = ISO.make({ ox: 480, oy: 292, s: P.isoS, ang: Math.PI / 6 });
    ISO.grid(p, I, -1, -1, 5, 5, 0, col(p, T, 'line'), seg(t, 0, 1.2));
    // path on the floor, wrapping the near corner
    const fp = ISO.path(I, [[-1, 3.7], [3.7, 3.7], [3.7, -1]]);
    const pu = seg(t, 0.8, 2.6);
    flowArrow(p, T, fp, pu, t, { role: 'accent2', lineW: P.lineW, speed: P.speed, dash: P.dash, headS: 12 });
    const base = col(p, T, 'panel'), lit = col(p, T, 'accent'), edge = col(p, T, 'muted', 0.9), gap = (1 - P.fill) / 2;
    const order = st.boxes.slice().sort((a, b) => (a.i + a.j + a.k) - (b.i + b.j + b.k) || a.k - b.k);
    const sweep = seg(t, P.litStart, P.litStart + P.litS) * 7.6 - 1.2;
    order.forEach(b => {
      const grow = ease('out', seg(t, 0.4 + b.k * 0.45 + (b.i + b.j) * 0.12 + b.jit * 0.2, 1.3 + b.k * 0.45 + (b.i + b.j) * 0.12 + b.jit * 0.2));
      const L = ease('cubic', clamp(sweep - (b.i + b.j + b.k) + b.jit * 0.9, 0, 1));
      const c = mix(p, base, lit, L), faces = ISO.shades(p, T, c);
      ISO.box(p, I, { x: b.i + gap, y: b.j + gap, z: b.k + gap * 0.0, w: P.fill, d: P.fill, h: P.fill }, faces, mix(p, edge, col(p, T, 'chalk'), L * 0.6), 1.4, grow);
    });
    const done = seg(t, P.litStart + P.litS, P.litStart + P.litS + 0.8);
    drawGlyph(p, T, 'check', 880, 90, 52, done, t, { lineW: P.lineW * 0.8, ease: P.ease });
    label(p, T, 'all 27 lit', 880, 140, 11, col(p, T, 'accent', done));
  }

  // two floors, racks, a path on the lower floor with a travelling packet, and a hovering glyph
  function floors(p, t, st, P, T) {
    label(p, T, 'WORLD  ·  two floors, racks, one path', 40, 44, 12, col(p, T, 'muted'), p.LEFT);
    const I = ISO.make({ ox: 480, oy: 306, s: P.isoS, ang: Math.PI / 6 }), Z1 = 2.7, N = 5;
    const base = col(p, T, 'panel'), lit = col(p, T, 'accent'), edge = col(p, T, 'muted', 0.9), line = col(p, T, 'line');
    // lower floor
    ISO.grid(p, I, 0, 0, N, N, 0, line, seg(t, 0, 1.2));
    // posts
    [[0, 0], [N - 0.18, 0], [0, N - 0.18], [N - 0.18, N - 0.18]].forEach(([x, y], i) => {
      const g = ease('out', seg(t, 0.8 + i * 0.1, 1.7 + i * 0.1));
      ISO.box(p, I, { x, y, z: 0, w: 0.18, d: 0.18, h: Z1 }, ISO.shades(p, T, mix(p, base, col(p, T, 'line'), 0.8)), mix(p, edge, base, 0.4), 1, g);
    });
    const racks = (list, z0, t0) => list.slice().sort((a, b) => (a.x + a.y) - (b.x + b.y)).forEach((r, i) => {
      const g = ease('out', seg(t, t0 + i * 0.35, t0 + 0.9 + i * 0.35));
      const L = ease('cubic', seg(t, P.litStart + r.lit, P.litStart + r.lit + 0.8));
      for (let k = 0; k < r.h; k++) {
        const gk = ease('out', seg(t, t0 + i * 0.35 + k * 0.18, t0 + 0.7 + i * 0.35 + k * 0.18)), Lk = clamp(L * (r.h + 0.5) - k, 0, 1);
        const c = mix(p, base, lit, Lk);
        ISO.box(p, I, { x: r.x, y: r.y, z: z0 + k * 0.9, w: 0.84, d: 0.84, h: 0.8 }, ISO.shades(p, T, c), mix(p, edge, col(p, T, 'chalk'), Lk * 0.6), 1.3, gk);
      }
    });
    // lower racks behind the path vs in front: draw back racks, path, front racks
    racks([{ x: 0.5, y: 0.6, h: 2, lit: 0.0 }, { x: 2.2, y: 0.5, h: 1, lit: 0.5 }, { x: 0.6, y: 2.2, h: 2, lit: 1.0 }], 0, 1.0);
    const fp = ISO.path(I, [[N - 0.4, 3.1], [2.9, 3.1], [2.9, 1.9], [1.7, 1.9], [1.7, 3.9], [N - 0.4, 3.9]]);
    const pu = seg(t, 2.4, 4.0);
    flowArrow(p, T, fp, pu, t, { role: 'accent2', lineW: P.lineW, speed: P.speed, dash: P.dash, headS: 11 });
    // packet travelling the finished path, looping (pure of t)
    if (pu >= 1) {
      const stp = stroke(fp), f = ((t - 4.0) * 0.16) % 1, q = posAt(stp, f);
      p.push(); p.noStroke(); p.fill(col(p, T, 'chalk')); p.circle(q.x, q.y, 9); p.noFill(); p.stroke(col(p, T, 'accent2')); p.strokeWeight(1.5); p.circle(q.x, q.y, 15); p.pop();
    }
    racks([{ x: 3.6, y: 3.3, h: 1, lit: 1.6 }], 0, 1.8);
    // upper floor: translucent slab
    const su = ease('cubic', seg(t, 3.2, 4.4));
    if (su > 0) {
      p.push(); p.stroke(col(p, T, 'muted', su)); p.strokeWeight(1.4); p.fill(col(p, T, 'panel', 0.28 * su));
      ISO.quad(p, I, [[0, 0, Z1], [N * su, 0, Z1], [N * su, N * su, Z1], [0, N * su, Z1]]); p.pop();
      ISO.grid(p, I, 0, 0, N, N, Z1, line, seg(t, 3.6, 4.8));
    }
    racks([{ x: 0.7, y: 0.7, h: 2, lit: 2.0 }, { x: 2.6, y: 2.4, h: 2, lit: 2.6 }, { x: 3.6, y: 0.6, h: 1, lit: 3.0 }], Z1, 4.6);
    // vertical link from the lower path end to the upper floor, marching up
    const a = I.project(2.9, 1.9, 0.8), b = I.project(2.9, 1.9, Z1 + 0.05);
    flowArrow(p, T, [[a[0], a[1]], [b[0], b[1]]], seg(t, 5.6, 6.4), t, { role: 'accent', lineW: P.lineW * 0.8, speed: P.speed, dash: [6, 6], dir: 1, headS: 9 });
    const tp = I.project(3.0, 2.8, Z1 + 2 * 0.9 + 0.3);
    drawGlyph(p, T, 'cloud', tp[0], tp[1] - 40, 70, seg(t, 6.0, 7.0), t, { lineW: P.lineW * 0.9, ease: P.ease });
  }

  const LAYOUT = { sheet, system, stack, floors };

  // ---- pattern ---------------------------------------------------------------------------------
  ARSENAL.glyphs = { defs: GLYPHS, order: ORDER, draw: drawGlyph, flowArrow, stroke, partial, posAt };
  ARSENAL.iso = ISO;

  const PAT = ARSENAL.patterns['glyphs-iso'] = {
    id: 'glyphs-iso', atlas: ['shape-custom-shapes', 'push-pop', 'math-trigonometry', 'triangle-subdivision'], renderer: 'p2d',
    params: { layout: 'sheet', lineW: 3, ease: 'cubic', size: 92, stagger: 0.28, buildS: 1.0, speed: 36, dash: [9, 7], isoS: 56, fill: 0.86, litStart: 2.6, litS: 4.4, dur: 6 },
    variants: [
      { name: 'sheet', params: { layout: 'sheet', dur: 6, size: 92, stagger: 0.28, buildS: 1.0, lineW: 3 } },
      { name: 'system', params: { layout: 'system', dur: 6, lineW: 3.4, speed: 40 } },
      { name: 'stack', params: { layout: 'stack', dur: 8, isoS: 58, fill: 0.84, litStart: 2.6, litS: 4.6, lineW: 3 } },
      { name: 'floors', params: { layout: 'floors', dur: 8, isoS: 42, litStart: 3.0, lineW: 3, speed: 30 } }
    ],
    setup(p, ctx, params) {
      const R = mulberry32(ctx.seed || 1), boxes = [];
      for (let k = 0; k < 3; k++) for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) boxes.push({ i, j, k, jit: R() });
      return { boxes };
    },
    draw(p, t, state, params, tokens) {
      const P = Object.assign({}, PAT.params, params), T = tokens;
      p.push();
      p.background(T.color.bg);
      p.strokeCap(p.ROUND); p.strokeJoin(p.ROUND);
      LAYOUT[P.layout](p, t, state, P, T);
      p.pop();
    }
  };
})();
