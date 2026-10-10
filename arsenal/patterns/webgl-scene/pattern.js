/* arsenal/patterns/webgl-scene · a 3D explainer scene on the pure clock (renderer: webgl)
   keyed cameras + slerp, ortho/perspective, token-role lights, 1,000 boxes baked with buildGeometry,
   textToModel headline (flat textToContours outline fallback), worldToScreen labels after the camera is released.
   draw(t) is a pure function of t. Fonts come from ctx.fonts (see load()). */
(function () {
  const A = (window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} });
  function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const smooth = (x) => { x = clamp(x); return x * x * x * (x * (x * 6 - 15) + 10); };
  const lerp = (a, b, u) => a + (b - a) * u;
  const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // keyed cameras, per mode: t = fraction of dur, eye, look, zoom (ortho extent multiplier) or fov (persp, radians)
  const KEYS = {
    iso: [
      { t: 0.00, eye: [620, -560, 620], look: [0, -30, 0], zoom: 1.30 },
      { t: 0.45, eye: [620, -560, 620], look: [0, -30, 0], zoom: 1.30 },
      { t: 1.00, eye: [880, -300, 330], look: [60, -40, -20], zoom: 1.02 }],
    fly: [
      { t: 0.00, eye: [-560, -360, 470], look: [0, -40, 0], fov: 0.80 },
      { t: 0.22, eye: [-430, -62, 14], look: [-120, -62, 0], fov: 0.95 },
      { t: 0.58, eye: [90, -56, 0], look: [300, -70, 0], fov: 1.00 },
      { t: 0.84, eye: [400, -125, 6], look: [720, -105, 0], fov: 0.95 },
      { t: 1.00, eye: [330, -420, 520], look: [0, -40, 0], fov: 0.80 }],
    headline: [
      { t: 0.00, eye: [0, -150, 640], look: [0, -80, 0], fov: 0.72 },
      { t: 1.00, eye: [140, -190, 600], look: [0, -80, 0], fov: 0.72 }],
  };

  const VERT = 'precision highp float; attribute vec3 aPosition; attribute vec3 aNormal; uniform mat4 uModelViewMatrix; uniform mat4 uProjectionMatrix; varying vec3 vN;' +
    'void main(){ vN = aNormal; gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0); }';
  const FRAG = 'precision highp float; varying vec3 vN; uniform vec3 uColor, uAmb, uKey, uRim, uKeyDir, uRimDir;' +
    'void main(){ vec3 n = normalize(vN); vec3 l = uAmb + uKey * max(dot(n, -uKeyDir), 0.0) + uRim * max(dot(n, -uRimDir), 0.0); gl_FragColor = vec4(uColor * l, 1.0); }';
  const rgb = (p, c) => { c = p.color(c); return [p.red(c) / 255, p.green(c) / 255, p.blue(c) / 255]; };
  const norm = (v) => { const l = Math.hypot(...v); return v.map((x) => x / l); };

  function buildField(p, st, params) {
    const rng = mulberry32(st.seed), cols = params.cols, rows = params.rows, N = cols * rows;
    const ph = [rng() * 6.283, rng() * 6.283, rng() * 6.283];
    const pos = [], val = new Float32Array(N), hh = new Float32Array(N), S = params.street, cell = params.cell;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const i = r * cols + c, u = c / (cols - 1), v = r / (rows - 1);
      const b = 0.5 + 0.28 * Math.sin(u * 5.2 + ph[0]) * Math.cos(v * 4.1 + ph[1]) + 0.18 * Math.sin((u + v) * 7 + ph[2]);
      val[i] = clamp(b + (rng() - 0.5) * 0.30, 0.03, 1);
      hh[i] = params.hmin + val[i] * params.hmax;
      pos[i] = [(c - (cols - 1) / 2) * cell + (c >= cols / 2 ? S / 2 : -S / 2), (r - (rows - 1) / 2) * cell + (r >= rows / 2 ? S / 2 : -S / 2) - 8];
    }
    const order = Array.from({ length: N }, (_, i) => i).sort((a, b) => val[b] - val[a] || a - b); // highest first
    const bw = cell - params.gap, T = params.tier, tiers = [];
    for (let j = 0; j < N / T; j++) {
      tiers.push(p.buildGeometry(() => {
        p.noStroke();
        for (let m = j * T; m < (j + 1) * T; m++) { const i = order[m]; p.push(); p.translate(pos[i][0], -hh[i] / 2, pos[i][1]); p.box(bw, hh[i], bw); p.pop(); }
      }));
    }
    Object.assign(st, { N, pos, val, hh, order, bw, tiers, T });
  }

  function buildHeadline(p, st, params) {
    st.head = { kind: 'none' };
    const f = st.fonts && st.fonts.disp; if (!f || params.mode !== 'headline') return;
    p.textFont(f); p.textSize(100);
    if (!params.forceOutline) {
      try {
        const g = f.textToModel(params.headline, 0, 0, { extrude: params.extrude, sampleFactor: params.sampleFactor });
        const v = g && g.vertices; if (v && v.length) {
          let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9, z0 = 1e9, z1 = -1e9;
          for (const q of v) { x0 = Math.min(x0, q.x); x1 = Math.max(x1, q.x); y0 = Math.min(y0, q.y); y1 = Math.max(y1, q.y); z0 = Math.min(z0, q.z); z1 = Math.max(z1, q.z); }
          st.head = { kind: 'model', g, c: [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], w: x1 - x0, h: y1 - y0, verts: v.length };
          return;
        }
      } catch (e) { st.headError = String(e).slice(0, 120); }
    }
    try {   // fallback: flat textToContours outlines, stacked in z so they read as a shell
      const cs = f.textToContours(params.headline, 0, 0, { sampleFactor: params.sampleFactor });
      let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
      for (const c of cs) for (const q of c) { x0 = Math.min(x0, q.x); x1 = Math.max(x1, q.x); y0 = Math.min(y0, q.y); y1 = Math.max(y1, q.y); }
      st.head = { kind: 'outline', cs, c: [(x0 + x1) / 2, (y0 + y1) / 2, 0], w: x1 - x0, h: y1 - y0 };
    } catch (e) { st.headError2 = String(e).slice(0, 120); }
  }

  function mkCam(p, k, params) {
    const c = p.createCamera(); c.camera(k.eye[0], k.eye[1], k.eye[2], k.look[0], k.look[1], k.look[2], 0, 1, 0);
    project(p, c, params, k.zoom, k.fov); return c;
  }
  function project(p, c, params, zoom, fov) {
    const W = p.width, H = p.height;
    if (params.proj === 'ortho') { const s = zoom || 1; c.ortho(-W / 2 * s, W / 2 * s, -H / 2 * s, H / 2 * s, -4000, 4000); }
    else c.perspective(fov || 0.8, W / H, 8, 6000);
  }

  function pathAt(keys, u) {
    let i = 0; while (i < keys.length - 2 && u > keys[i + 1].t) i++;
    const a = keys[i], b = keys[i + 1], x = clamp((u - a.t) / (b.t - a.t));
    return { i, amt: lerp(x, smooth(x), 0.6), a, b };
  }
  function highlightK(u, N, params) { return Math.floor(N * smooth((u - params.sweep[0]) / (params.sweep[1] - params.sweep[0])) + 1e-9); }

  /* cheap lights from token roles: one custom Lambert shader (ambient=muted/bg, key=chalk, rim=accent2). p5's own lights are ~10-50x
     slower per fragment on software GL; params.p5lights switches the headline to the real p5 light API (see headline3d). */
  function useRoleShader(p, st, tk) {
    const sh = st.sh, bg = p.color(tk.color.bg);
    p.shader(sh);
    sh.setUniform('uAmb', rgb(p, p.lerpColor(bg, p.color(tk.color.muted), 0.55)));
    sh.setUniform('uKey', rgb(p, tk.color.chalk).map((x) => x * 0.95));
    sh.setUniform('uRim', rgb(p, p.lerpColor(bg, p.color(tk.color.accent2), 0.6)));
    sh.setUniform('uKeyDir', norm([-0.45, 0.8, -0.4])); sh.setUniform('uRimDir', norm([0.7, 0.3, 0.6]));
    return (c) => sh.setUniform('uColor', rgb(p, c));
  }

  function drawField(p, st, k, tk, params) {
    const base = p.lerpColor(p.color(tk.color.bg), p.color(tk.color.muted), 0.65), hi = p.color(tk.color.accent), T = st.T;
    const col = useRoleShader(p, st, tk); p.noStroke();
    const one = (i, c, g) => { col(c); p.push(); p.translate(st.pos[i][0], -st.hh[i] / 2, st.pos[i][1]); p.box(st.bw + g, st.hh[i] + g, st.bw + g); p.pop(); };
    for (let j = 0; j < st.tiers.length; j++) {
      const lo = j * T, up = lo + T;
      if (up <= k) { col(hi); p.model(st.tiers[j]); }
      else if (lo >= k) { col(base); p.model(st.tiers[j]); }
      else for (let m = lo; m < up; m++) one(st.order[m], m < k ? hi : base, 0);
    }
    if (k > 0) one(st.order[k - 1], tk.color.chalk, 2);
    col(p.lerpColor(p.color(tk.color.bg), p.color(tk.color.panel), 0.9));
    p.push(); p.translate(0, 1, 0); p.box(2600, 2, 2600); p.pop();
    p.resetShader();
  }

  function p5lights(p, tk, st, params) {    // real p5 lights, roles only; used where the lit area is small (the headline)
    const bg = p.color(tk.color.bg);
    p.ambientLight(p.lerpColor(bg, p.color(tk.color.muted), 0.5));
    p.directionalLight(p.color(tk.color.chalk), -0.45, 0.6, -0.7);
    p.lightFalloff(1, 0.0012, 0);
    p.pointLight(p.color(tk.color.accent), 160, -params.headY - 120, 220);
  }

  function headline3d(p, st, tk, u, params) {
    const h = st.head; if (h.kind === 'none') return;
    const s = params.headW / h.w, a = p.TAU * smooth((u - 0.12) / 0.76);
    p.push(); p.translate(0, -params.headY, 0); p.rotateY(a); p.scale(s); p.translate(-h.c[0], -h.c[1], -h.c[2]);
    if (h.kind === 'model') { p.noStroke(); p.fill(tk.color.chalk); p.model(h.g); }
    else {
      p.noFill(); p.stroke(tk.color.chalk); p.strokeWeight(1.4);
      const E = params.extrude, L = 6;
      for (let l = 0; l <= L; l++) for (const c of h.cs) { p.beginShape(); for (const q of c) p.vertex(q.x, q.y, -E * l / L); p.endShape(p.CLOSE); }
      p.stroke(tk.color.accent);
      for (const c of h.cs) for (let m = 0; m < c.length; m += 4) p.line(c[m].x, c[m].y, 0, c[m].x, c[m].y, -E);
    }
    p.pop();
  }

  function labels(p, st, tk, t, u, k, work, params, pins) {
    // screen points computed while the camera is set, then drawn after the matrix and camera are released (hud = default camera)
    const eye = [work.eyeX, work.eyeY, work.eyeZ], ctr = [work.centerX, work.centerY, work.centerZ];
    let d = [ctr[0] - eye[0], ctr[1] - eye[1], ctr[2] - eye[2]]; const dl = Math.hypot(...d) || 1; d = d.map((x) => x / dl);
    const pts = pins.map((q) => {
      const v = p.worldToScreen(new p5.Vector(q.p[0], q.p[1], q.p[2]));
      const depth = (q.p[0] - eye[0]) * d[0] + (q.p[1] - eye[1]) * d[1] + (q.p[2] - eye[2]) * d[2];
      return { q, x: v.x, y: v.y, depth };
    });
    p.push(); p.resetMatrix(); p.noLights(); p.setCamera(st.hud); p.drawingContext.clear(p.drawingContext.DEPTH_BUFFER_BIT);
    const W = p.width, H = p.height, ox = -W / 2, oy = -H / 2, f = st.fonts;
    if (!f) { p.pop(); return; }
    const txt = (s, x, y, size, col, font, al, op) => { const c = p.color(col); c.setAlpha(255 * (op == null ? 1 : op)); p.noStroke(); p.fill(c); p.textFont(font); p.textSize(size); p.textAlign(al || p.LEFT, p.BASELINE); const R = al === p.RIGHT; p.text(s, x + ox - (R ? 2000 : 0), y + oy, 2000); };
    for (const q of pts) {
      if (q.depth < 40) continue;
      const near = params.mode === 'fly' ? clamp(1 - (q.depth - 260) / 520) * clamp((q.depth - 40) / 80) : 1;
      const inb = q.x > 40 && q.x < W - 40 && q.y > 60 && q.y < H - 60, op = (inb ? 1 : 0) * (q.q.op == null ? near : q.q.op * near);
      if (op <= 0.01) continue;
      const lx = q.x + 24, ly = q.y - 34 + (q.q.dy || 0), c = p.color(q.q.col); c.setAlpha(255 * op);
      p.stroke(c); p.strokeWeight(1.5); p.line(q.x + ox, q.y + oy, lx + ox, ly + oy);
      p.noStroke(); p.fill(c); p.circle(q.x + ox, q.y + oy, 7);
      txt(q.q.big, lx + 4, ly - 4, 22, q.q.col, f.disp, p.LEFT, op); txt(q.q.small, lx + 4, ly + 13, 12, tk.color.muted, f.mono, p.LEFT, op);
    }
    // fixed readout: the count
    const cnt = fmt(k);
    txt(cnt, 36, H - 70, params.mode === 'headline' ? 52 : 74, k > 0 ? tk.color.accent : tk.color.ink, f.disp, p.LEFT, 1);
    txt('OF 1,000 BOXES · SORTED BY VALUE, HIGHEST FIRST', 38, H - 42, 12, tk.color.muted, f.mono, p.LEFT, 1);
    txt((params.proj === 'ortho' ? 'ORTHOGRAPHIC' : 'PERSPECTIVE') + ' · CAMERA ' + work._amtLabel, W - 36, 44, 12, tk.color.muted, f.mono, p.RIGHT, 1);
    p.pop();
  }

  A.patterns['webgl-scene'] = {
    id: 'webgl-scene', atlas: ['webgl-mode', 'p5-camera', 'camera-slerp', 'text-to-model', 'lights-and-materials', 'shape-3d-primitives', 'build-geometry', 'world-to-screen'],
    renderer: 'webgl',
    params: { mode: 'iso', proj: 'ortho', dur: 12, cols: 40, rows: 25, cell: 16, gap: 2.5, street: 44, hmin: 8, hmax: 118, tier: 50, sweep: [0.10, 0.84],
      p5lights: true, headline: '1,000', extrude: 34, sampleFactor: 0.25, headW: 330, headY: 150, forceOutline: false },
    variants: [
      { name: 'iso-sorted', params: { mode: 'iso', proj: 'ortho' } },
      { name: 'iso-perspective', params: { mode: 'iso', proj: 'persp' } },
      { name: 'fly-through', params: { mode: 'fly', proj: 'persp', hmax: 150, sweep: [0.05, 0.9] } },
      { name: 'headline-extrude', params: { mode: 'headline', proj: 'persp', hmax: 60, hmin: 6 } },
      { name: 'headline-outline', params: { mode: 'headline', proj: 'persp', hmax: 60, hmin: 6, forceOutline: true } },
    ],
    /* async helper: load the two vendored fonts (data URIs from font.js; loadFont cannot fetch file://) */
    async load(p) {
      return { disp: await p.loadFont(window.WEBGL_SCENE_FONT), mono: await p.loadFont(window.WEBGL_SCENE_MONO) };
    },
    setup(p, ctx, params) {
      const st = { seed: ctx.seed == null ? 7 : ctx.seed, fonts: ctx.fonts || null };
      buildField(p, st, params); buildHeadline(p, st, params);
      const keys = KEYS[params.mode]; st.keys = keys; st.cams = keys.map((k) => mkCam(p, k, params));
      st.sh = p.createShader(VERT, FRAG); st.work = p.createCamera(); st.hud = p.createCamera();   // hud keeps p5's default camera: 1 unit = 1 css px at z = 0
      const ts = st.order; st.top = [ts[0], ts[1], ts[2], ts[Math.floor(st.N / 2)]];
      return st;
    },
    draw(p, t, st, params, tk) {
      const u = clamp(t / params.dur), W = p.width, H = p.height;
      p.background(tk.color.bg);
      const path = pathAt(st.keys, u), w = st.work;
      w.slerp(st.cams[path.i], st.cams[path.i + 1], path.amt);
      project(p, w, params, lerp(path.a.zoom || 1, path.b.zoom || 1, path.amt), lerp(path.a.fov || 0.8, path.b.fov || 0.8, path.amt));
      w._amtLabel = (path.i + 1) + '>' + (path.i + 2) + ' · ' + path.amt.toFixed(2);
      p.setCamera(w);
      const k = highlightK(u, st.N, params);
      p.noLights();
      drawField(p, st, k, tk, params);
      if (params.mode === 'headline') { if (params.p5lights) p5lights(p, tk, st, params); headline3d(p, st, tk, u, params); p.noLights(); }
      // pins: anchored to 3D points
      const pins = [];
      const top = (i) => [st.pos[i][0], -st.hh[i], st.pos[i][1]];
      if (params.mode === 'iso') { if (k > 0) { const i = st.order[k - 1]; pins.push({ p: top(i), big: 'v = ' + st.val[i].toFixed(2), small: 'RANK ' + fmt(k) + ' OF 1,000', col: tk.color.chalk }); } }
      else if (params.mode === 'fly') {
        const names = ['HIGHEST', 'SECOND', 'THIRD', 'MEDIAN'];
        st.top.forEach((i, n) => pins.push({ p: top(i), big: 'v = ' + st.val[i].toFixed(2), small: names[n] + ' · RANK ' + (st.order.indexOf(i) + 1), col: n === 3 ? tk.color.accent2 : tk.color.accent }));
      } else if (st.head.kind !== 'none') {
        pins.push({ p: [params.headW / 2 + 16, -params.headY, 0], dy: 40, big: 'one thousand', small: 'EVERY BOX COUNTED ONCE', col: tk.color.accent, op: 1 });
      }
      labels(p, st, tk, t, u, k, w, params, pins);
      return { k, kind: st.head && st.head.kind };
    },
  };
})();
