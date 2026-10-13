/* arsenal/patterns/gl-instances · 10k-100k marks as ONE instanced draw (renderer: webgl)
   Route: p5 2.3.4 `model(geom, n)` -> gl.drawElementsInstanced, with a custom GLSL 300 es shader that reads per-mark data
   (x, y, z, size, height, colour, alpha, rank+pick) from an RGBA32F data texture via texelFetch(gl_InstanceID). The data
   texture is a p5.Framebuffer (format FLOAT, NEAREST) filled once in setup with updatePixels(). In 'arrival' draw order
   the rows are stored in arrival order, so the count-in IS the instance count: model(geom, k), k = count(t), exact. In
   'depth' order (opaque 3D fields) rows are sorted front-to-back for early-z and marks with rank >= k collapse.
   'density' render: additive blend into a HALF_FLOAT framebuffer, tone-mapped by `exposure` (order-independent).
   No instances() (unreleased in 2.3.4), no strands, no raw GL buffers. draw(t) is pure of t; seeds in setup. */
(function () {
  const A = (window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} });
  function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const smooth = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
  const lerp = (a, b, u) => a + (b - a) * u;
  const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const F = Math.fround;
  const TEXW = 1024;                                  // data texture width (texels); 2 texels per mark
  const MARK = { dot: 0, box: 1, bar: 2, square: 3 };
  const STEP = 4;                                     // x spacing of the marks baked into one chunk geometry

  const VERT = `#version 300 es
precision highp float; precision highp int;
in vec3 aPosition; in vec3 aNormal; in vec2 aTexCoord;
uniform mat4 uModelViewMatrix; uniform mat4 uProjectionMatrix;
uniform sampler2D uData; uniform int uTexW; uniform int uMark; uniform int uChunk; uniform int uN; uniform float uStep;
uniform float uK; uniform float uKc; uniform float uWin; uniform float uSize; uniform float uAlpha; uniform float uRamp; uniform float uGrow;
uniform vec3 uPal[6]; uniform vec3 uBg; uniform vec3 uHot; uniform vec3 uDim;
uniform vec4 uBrush; uniform float uBrushOn; uniform float uBrushRole; uniform float uPickOn; uniform float uPickRole;
out vec3 vN; out vec2 vUV; out vec4 vCol;
vec4 fetch(int j){ return texelFetch(uData, ivec2(j % uTexW, j / uTexW), 0); }
void main(){
  // one instance = one CHUNK of uChunk marks baked side by side at x = j * uStep (SwiftShader pays per instance, not per vertex)
  float j = floor(aPosition.x / uStep + 0.5); vec3 aPos = vec3(aPosition.x - j * uStep, aPosition.yz);
  int id = gl_InstanceID * uChunk + int(j);
  if (id >= uN) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); vCol = vec4(0.0); vN = vec3(0.0); vUV = vec2(0.0); return; }
  vec4 d0 = fetch(2 * id), d1 = fetch(2 * id + 1);           // d0 = x y z s ; d1 = h c a (rank + 0.5 * picked)
  float rank = floor(d1.w); bool picked = fract(d1.w) > 0.25;
  if (rank >= uKc) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); vCol = vec4(0.0); vN = vec3(0.0); vUV = vec2(0.0); return; }   // not arrived: collapsed (depth order only)
  float age = clamp((uK - rank) / uWin, 0.0, 1.0);           // 0 = just arrived, 1 = settled
  float e = age * age * (3.0 - 2.0 * age);
  vec3 col = uRamp > 0.5 ? mix(uPal[0], uPal[1], clamp(d1.y, 0.0, 1.0)) : uPal[int(d1.y + 0.5)];
  float a = d1.z * uAlpha, s = d0.w * uSize;
  if (uBrushOn > 0.0) {
    bool inside = d0.x >= uBrush.x && d0.x <= uBrush.z && d0.y >= uBrush.y && d0.y <= uBrush.w;
    col = inside ? mix(col, uPal[int(uBrushRole)], uBrushOn) : mix(col, uDim, uBrushOn);
    a = inside ? mix(a, 1.0, uBrushOn) : mix(a, a * 0.35, uBrushOn);
    s = inside ? s * (1.0 + 0.35 * uBrushOn) : s;
  }
  if (uPickOn > 0.0) { col = picked ? mix(col, uPal[int(uPickRole)], uPickOn) : mix(col, uDim, uPickOn); }
  col = mix(uHot, col, e);
  vUV = aTexCoord; vN = aNormal;
  vec4 p;
  if (uMark == 0 || uMark == 3) {                             // dot / square: camera-facing quad in view space
    vec4 c = uModelViewMatrix * vec4(d0.xyz, 1.0);
    c.xy += aPos.xy * s * mix(uGrow, 1.0, e);
    p = uProjectionMatrix * c;
    vCol = vec4(col, a);
  } else {
    vec3 q;
    if (uMark == 1) {                                         // box: drops 40 units into its slot
      q = d0.xyz + aPos * vec3(s, d1.x, s) + vec3(0.0, -40.0 * (1.0 - e), 0.0);
    } else {                                                  // bar: base on y = 0, grows up (-y) by e
      float h = max(d1.x * e, 0.25);
      q = vec3(d0.x, 0.0, d0.z) + vec3(aPos.x * s, (aPos.y - 0.5) * h, aPos.z * s);
    }
    p = uProjectionMatrix * uModelViewMatrix * vec4(q, 1.0);
    vCol = vec4(mix(uBg, col, clamp(a, 0.0, 1.0)), 1.0);      // opaque marks: alpha mixes toward bg (no sorting)
  }
  gl_Position = p;
}`;
  const FRAG = `#version 300 es
precision highp float; precision highp int;
in vec3 vN; in vec2 vUV; in vec4 vCol;
uniform int uMark; uniform float uWeight; uniform vec3 uAmb; uniform vec3 uKey; uniform vec3 uRim; uniform vec3 uKeyDir; uniform vec3 uRimDir;
out vec4 outColor;
void main(){
  if (uMark == 0) {
    vec2 q = vUV * 2.0 - 1.0; float r = dot(q, q);
    if (r > 1.0) discard;
    float a = vCol.a * (uWeight > 0.0 ? exp(-3.0 * r) : 1.0 - smoothstep(0.62, 1.0, r));
    outColor = vec4(vCol.rgb * a, a);                         // premultiplied: p5 BLEND is (ONE, ONE_MINUS_SRC_ALPHA); ADD is (ONE, ONE)
  } else if (uMark == 3) {
    outColor = vec4(vCol.rgb * vCol.a, vCol.a);               // flat square: no lighting, no discard
  } else {
    vec3 n = normalize(vN);
    vec3 l = uAmb + uKey * max(dot(n, -uKeyDir), 0.0) + uRim * max(dot(n, -uRimDir), 0.0);
    outColor = vec4(vCol.rgb * l, 1.0);
  }
}`;
  // tone map of the density buffer: v = 1 - exp(-exposure * weight); colour = weighted mean of the marks' roles
  const TVERT = `#version 300 es
precision highp float; in vec3 aPosition; in vec2 aTexCoord; uniform mat4 uModelViewMatrix; uniform mat4 uProjectionMatrix; out vec2 vUV;
void main(){ vUV = aTexCoord; gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0); }`;
  const TFRAG = `#version 300 es
precision highp float; in vec2 vUV; uniform sampler2D uAcc; uniform float uExposure; uniform vec3 uBg; uniform vec3 uHot; uniform float uFlip; out vec4 outColor;
void main(){ vec4 a = texture(uAcc, vec2(vUV.x, uFlip > 0.5 ? 1.0 - vUV.y : vUV.y)); float d = a.a;
  vec3 mean = a.rgb / max(d, 1e-6); float v = 1.0 - exp(-uExposure * d);
  vec3 c = mix(mean, uHot, 0.45 * smoothstep(0.80, 1.0, v));
  outColor = vec4(mix(uBg, c, v), 1.0); }`;
  const rgb = (p, c) => { c = p.color(c); return [p.red(c) / 255, p.green(c) / 255, p.blue(c) / 255]; };
  const norm = (v) => { const l = Math.hypot(...v); return v.map((x) => x / l); };
  function gauss(rng) { const u = Math.max(rng(), 1e-12), v = rng(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.283185307 * v); }
  function shuffle(a, rng) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); const x = a[i]; a[i] = a[j]; a[j] = x; } return a; }

  /* ---------- data: a film passes params.data; otherwise a seeded synthetic set of the same shape ---------- */
  function synth(params, rng) {
    const n = params.n, L = params.layout;
    if (L === 'scatter') {                                     // rows {x, y in [0,1], c, s, a}
      const rows = new Array(n);
      for (let i = 0; i < n; i++) {
        const b = rng() < params.mix;                          // cluster B (role 1) with share `mix`
        const x = b ? 0.70 + 0.07 * gauss(rng) : 0.42 + 0.17 * gauss(rng);
        const y = b ? 0.68 + 0.06 * gauss(rng) : 0.42 + 0.15 * gauss(rng);
        rows[i] = { x: clamp(x, 0, 1), y: clamp(y, 0, 1), c: b ? 1 : 0, s: 0.7 + 0.6 * rng(), a: 1 };
      }
      return rows;
    }
    if (L === 'stack') {                                       // rows {k: category}
      const w = params.shares, tot = w.reduce((s, x) => s + x, 0), rows = [];
      let acc = 0;
      w.forEach((x, k) => { const m = k === w.length - 1 ? n - acc : Math.round(n * x / tot); for (let i = 0; i < m; i++) rows.push({ k }); acc += m; });
      return rows;
    }
    if (L === 'waffle') { const rows = new Array(n); for (let i = 0; i < n; i++) rows[i] = { c: 0 }; return rows; }
    // field: a matrix rows x cols of values in [0,1]
    const R = params.rows, C = Math.round(n / R), ph = [rng() * 6.28, rng() * 6.28, rng() * 6.28], M = [];
    for (let r = 0; r < R; r++) {
      const row = new Array(C);
      for (let c = 0; c < C; c++) {
        const u = c / (C - 1), v = r / (R - 1);
        const b = 0.45 + 0.25 * Math.sin(u * 6.1 + ph[0]) * Math.cos(v * 4.3 + ph[1]) + 0.16 * Math.sin((u * 1.7 + v) * 9 + ph[2]);
        row[c] = clamp(0.8 * (b + 0.07 * gauss(rng)) + 0.16 * Math.exp(-((u - 0.72) ** 2 + (v - 0.35) ** 2) / 0.004), 0.01, 1);
      }
      M.push(row);
    }
    return M;
  }

  /* layout: data -> marks in world units (p5 WEBGL: origin centre, y down, 1 unit = 1 css px at the default ortho camera).
     Every mark keeps `id` = its index in the data (row-major for a matrix): pick(ids) addresses marks by it. */
  function layout(params, data, rng) {
    const L = params.layout, marks = [];
    if (L === 'scatter') {
      const [x0, y0, x1, y1] = params.plot;
      data.forEach((d, id) => {
        const r = Array.isArray(d) ? { x: d[0], y: d[1], c: d[2], s: d[3], a: d[4] } : d;
        marks.push({ id, x: F(lerp(x0, x1, r.x)), y: F(lerp(y1, y0, r.y)), z: 0, s: params.dot * (r.s == null ? 1 : r.s), h: 0, c: r.c || 0, a: r.a == null ? 1 : r.a, v: r.y, dx: F(r.x), dy: F(r.y) });
      });
    } else if (L === 'waffle') {                               // id -> fixed cell (row-major), so a 2D film can address it
      const C = params.wcols, R = Math.ceil(data.length / C), pt = params.pitch;
      data.forEach((d, id) => {
        const r = typeof d === 'number' ? { c: d } : d, cx = id % C, cy = Math.floor(id / C);
        marks.push({ id, x: (cx - (C - 1) / 2) * pt + params.offset[0], y: (cy - (R - 1) / 2) * pt + params.offset[1], z: 0, s: pt * params.fill, h: 0, c: r.c || 0, a: r.a == null ? 1 : r.a, v: 0 });
      });
    } else if (L === 'stack') {
      const K = params.shares.length, fp = params.footprint, pitch = params.cube + params.cubeGap, colW = fp * pitch, gapX = params.colGap;
      const span = K * colW + (K - 1) * gapX;
      data.forEach((d, id) => marks.push({ id, k: typeof d === 'number' ? d : d.k }));
      orderMarks(marks, params, rng);
      const fill = new Array(K).fill(0);
      for (const m of marks) {                                 // slot by arrival rank within category: stacks fill bottom-up
        const j = fill[m.k]++, layer = Math.floor(j / (fp * fp)), cell = j % (fp * fp), cx = cell % fp, cz = Math.floor(cell / fp);
        const left = -span / 2 + m.k * (colW + gapX);
        Object.assign(m, { x: left + (cx + 0.5) * pitch, y: -(layer + 0.5) * pitch, z: (cz - (fp - 1) / 2) * pitch, s: params.cube, h: params.cube, c: params.catRole[m.k] || 0, a: 1 });
      }
      return { marks, ordered: true };
    } else {                                                    // field of bars from a matrix
      const R = data.length, C = data[0].length, pitch = params.pitch;
      for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
        const v = data[r][c];
        marks.push({ id: r * C + c, x: (c - (C - 1) / 2) * pitch, y: 0, z: (r - (R - 1) / 2) * pitch, s: pitch * params.barFill, h: params.hmin + v * params.hmax, c: v, a: 1, v, r, col: c });
      }
    }
    return { marks, ordered: false };
  }
  function orderMarks(marks, params, rng) {
    if (params.order === 'seeded') shuffle(marks, rng);
    else if (params.order === 'value') marks.sort((a, b) => (b.v || 0) - (a.v || 0) || a.id - b.id);
    return marks;                                              // 'given' keeps the data order
  }

  function makeTexture(p, st) {
    const N = st.N, TH = Math.max(1, Math.ceil((2 * N) / TEXW));
    st.fb = p.createFramebuffer({ width: TEXW, height: TH, density: 1, format: p.FLOAT, channels: p.RGBA, antialias: false, depth: false, textureFiltering: p.NEAREST });
    st.buf = new Float32Array(TEXW * TH * 4);
    const buf = st.buf;
    st.drawn.forEach((m, i) => {
      const o = i * 8;
      buf[o] = m.x; buf[o + 1] = m.y; buf[o + 2] = m.z; buf[o + 3] = m.s;
      buf[o + 4] = m.h; buf[o + 5] = m.c; buf[o + 6] = m.a; buf[o + 7] = m.rank + (st.picked[m.rank] ? 0.5 : 0);
    });
    upload(p, st);
  }
  function upload(p, st) {
    // p5 leaves UNPACK_PREMULTIPLY_ALPHA_WEBGL = true, and it also hits ArrayBuffer uploads: rgb *= a would corrupt the data
    const gl = p._renderer.GL, pre = gl.getParameter(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL), flip = gl.getParameter(gl.UNPACK_FLIP_Y_WEBGL);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    st.fb.loadPixels(); st.fb.pixels = st.buf; st.fb.updatePixels();
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, pre); gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flip);
  }
  function setPicked(st, ids) {                                // ids = data indices; picked[] and its prefix are by arrival rank
    st.picked = new Uint8Array(st.N); let n = 0;
    for (const id of ids || []) { const r = st.rankOf[id]; if (r != null && r >= 0 && !st.picked[r]) { st.picked[r] = 1; n++; } }
    st.pickN = n; st.pickPre = new Uint32Array(st.N + 1);
    for (let i = 0; i < st.N; i++) st.pickPre[i + 1] = st.pickPre[i] + st.picked[i];
  }

  /* a box is up to 6 unit planes; 'auto' keeps only the faces whose outward normal can face the eye anywhere on the camera
     path (sampled at 9 points) from any corner of the marks' bounding box: fewer vertices, no culling needed */
  const FACE = {
    '+z': (p) => p.translate(0, 0, 0.5), '-z': (p) => { p.translate(0, 0, -0.5); p.rotateY(Math.PI); },
    '+x': (p) => { p.translate(0.5, 0, 0); p.rotateY(Math.PI / 2); }, '-x': (p) => { p.translate(-0.5, 0, 0); p.rotateY(-Math.PI / 2); },
    '-y': (p) => { p.translate(0, -0.5, 0); p.rotateX(Math.PI / 2); }, '+y': (p) => { p.translate(0, 0.5, 0); p.rotateX(-Math.PI / 2); } };
  const NRM = { '+z': [0, 0, 1], '-z': [0, 0, -1], '+x': [1, 0, 0], '-x': [-1, 0, 0], '-y': [0, -1, 0], '+y': [0, 1, 0] };
  function facesFor(params, marks) {
    if (Array.isArray(params.faces)) return params.faces.filter((fc) => FACE[fc]);
    if (params.faces !== 'auto') return Object.keys(FACE);
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9, z0 = 1e9, z1 = -1e9;
    for (const m of marks) { const h = m.h || m.s; x0 = Math.min(x0, m.x); x1 = Math.max(x1, m.x); z0 = Math.min(z0, m.z); z1 = Math.max(z1, m.z);
      y0 = Math.min(y0, params.mark === 'bar' ? -h : m.y - h / 2); y1 = Math.max(y1, params.mark === 'bar' ? 0 : m.y + h / 2); }
    const keep = new Set();
    for (let i = 0; i <= 8; i++) {
      const e = camPose(params, i / 8).eye, ortho = params.cam.proj === 'ortho', L = params.cam.look;
      for (const cx of [x0, x1]) for (const cy of [y0, y1]) for (const cz of [z0, z1]) for (const fc in NRM) {
        const n = NRM[fc], v = ortho ? [e[0] - L[0], e[1] - L[1], e[2] - L[2]] : [e[0] - cx, e[1] - cy, e[2] - cz];
        if (n[0] * v[0] + n[1] * v[1] + n[2] * v[2] > 0) keep.add(fc);
      }
    }
    return Object.keys(FACE).filter((fc) => keep.has(fc));
  }

  /* camera: azimuth / elevation / distance (persp) or zoom (ortho), eased between two keys on t */
  function camPose(params, u) {
    const c = params.cam, e = smooth((u - c.span[0]) / (c.span[1] - c.span[0]));
    const az = lerp(c.az[0], c.az[1], e) * Math.PI / 180, el = lerp(c.el[0], c.el[1], e) * Math.PI / 180;
    const L = c.look, d = c.proj === 'ortho' ? 2000 : lerp(c.dist[0], c.dist[1], e);
    return { eye: [L[0] + d * Math.sin(az) * Math.cos(el), L[1] - d * Math.sin(el), L[2] + d * Math.cos(az) * Math.cos(el)], look: L, e };
  }
  function camAt(p, w, params, u) {
    const c = params.cam, P = camPose(params, u), L = P.look, W = p.width, H = p.height;
    w.camera(P.eye[0], P.eye[1], P.eye[2], L[0], L[1], L[2], 0, 1, 0);
    if (c.proj === 'ortho') { const s = lerp(c.zoom[0], c.zoom[1], P.e); w.ortho(-W / 2 * s, W / 2 * s, -H / 2 * s, H / 2 * s, 1, 6000); }
    else w.perspective(c.fov, W / H, 10, 8000);
    p.setCamera(w);
    return P;
  }

  /* the arrival front (float): runs to N + window so the last arrivals settle by countIn[1]; count = min(N, floor(front)) */
  function frontAt(params, N, t) {
    const u = clamp(t / params.dur), [a, b] = params.countIn, x = clamp((u - a) / (b - a));
    return (N + Math.max(1, N * params.win)) * (params.countEase === 'linear' ? x : smooth(x));
  }
  function countAt(params, N, t) { return Math.min(N, Math.floor(frontAt(params, N, t) + 1e-9)); }
  const onAt = (span, u) => (span ? smooth((u - span[0]) / (span[1] - span[0])) : 0);
  function brushAt(params, u) {
    const B = params.brush; if (!B) return null;
    const on = onAt(B.span, u); if (on <= 0) return null;
    const cx = (B.rect[0] + B.rect[2]) / 2, cy = (B.rect[1] + B.rect[3]) / 2;
    return { on, r: [lerp(cx, B.rect[0], on), lerp(cy, B.rect[1], on), lerp(cx, B.rect[2], on), lerp(cy, B.rect[3], on)].map(F) };   // data units [0,1]
  }

  function bindMarks(p, st, params, tk, k, front, brush, pickOn) {
    const sh = st.sh, bg = p.color(tk.color.bg), pal = [];
    for (let i = 0; i < 6; i++) pal.push(...rgb(p, tk.color[params.roles[i] || params.roles[0]]));
    p.shader(sh);
    sh.setUniform('uData', st.fb); sh.setUniform('uTexW', TEXW); sh.setUniform('uChunk', st.chunk); sh.setUniform('uN', st.N); sh.setUniform('uStep', STEP); sh.setUniform('uMark', MARK[params.mark]);
    sh.setUniform('uK', front); sh.setUniform('uKc', k); sh.setUniform('uWin', Math.max(1, st.N * params.win));
    sh.setUniform('uSize', params.size); sh.setUniform('uAlpha', params.alpha); sh.setUniform('uRamp', params.layout === 'field' ? 1 : 0);
    sh.setUniform('uGrow', params.grow); sh.setUniform('uWeight', params.render === 'density' ? 1 : 0);
    sh.setUniform('uPal', pal); sh.setUniform('uBg', rgb(p, tk.color.bg)); sh.setUniform('uHot', rgb(p, tk.color.chalk));
    sh.setUniform('uDim', rgb(p, p.lerpColor(bg, p.color(tk.color.muted), params.dim)));
    if (brush) {                                               // brush rect in world units, same f32 values as the JS count
      const [x0, y0, x1, y1] = params.plot, r = brush.r;
      sh.setUniform('uBrush', [F(lerp(x0, x1, r[0])), F(lerp(y1, y0, r[3])), F(lerp(x0, x1, r[2])), F(lerp(y1, y0, r[1]))]);
      sh.setUniform('uBrushOn', brush.on); sh.setUniform('uBrushRole', params.brush.role);
    } else sh.setUniform('uBrushOn', 0);
    sh.setUniform('uPickOn', pickOn); sh.setUniform('uPickRole', params.pick ? params.pick.role : 1);
    sh.setUniform('uAmb', rgb(p, p.lerpColor(bg, p.color(tk.color.muted), 0.45)));
    sh.setUniform('uKey', rgb(p, tk.color.chalk).map((x) => x * 0.85));
    sh.setUniform('uRim', rgb(p, p.lerpColor(bg, p.color(tk.color.accent2), 0.5)));
    sh.setUniform('uKeyDir', norm([-0.45, 0.8, -0.4])); sh.setUniform('uRimDir', norm([0.7, 0.3, 0.6]));
    p.noStroke();
  }
  function drawMarks(p, st, params, k) {                       // ONE draw call
    const gl = p._renderer.GL, flat = params.mark === 'dot' || params.mark === 'square', solid = params.mark === 'box' || params.mark === 'bar';
    if (flat) gl.disable(gl.DEPTH_TEST);
    if (solid && params.cull) { gl.enable(gl.CULL_FACE); gl.cullFace(params.cull === 'front' ? gl.FRONT : gl.BACK); }
    const n = params.drawOrder === 'depth' ? st.N : k;
    if (n > 0) p.model(st.geom, Math.ceil(n / st.chunk));       // instances = chunks; marks past n collapse in the shader
    if (flat) gl.enable(gl.DEPTH_TEST);
    if (solid && params.cull) gl.disable(gl.CULL_FACE);
    p.resetShader();
  }

  function hud(p, st, params, tk, k, brush, pins, readout) {
    const W = p.width, H = p.height, ox = -W / 2, oy = -H / 2, f = st.fonts;
    const pts = pins.map((q) => { const v = p.worldToScreen(new p5.Vector(q.p[0], q.p[1], q.p[2])); return Object.assign({ x: v.x, y: v.y }, q); });
    let frame = null, brect = null;
    if (params.layout === 'scatter') {
      const [x0, y0, x1, y1] = params.plot, S = (x, y) => { const v = p.worldToScreen(new p5.Vector(x, y, 0)); return [v.x, v.y]; };
      frame = [S(x0, y0), S(x1, y1)];
      if (brush) { const r = brush.r; brect = [S(lerp(x0, x1, r[0]), lerp(y1, y0, r[3])), S(lerp(x0, x1, r[2]), lerp(y1, y0, r[1]))]; }
    }
    p.push(); p.resetMatrix(); p.setCamera(st.hud); p.drawingContext.clear(p.drawingContext.DEPTH_BUFFER_BIT);
    const col = (c, op) => { c = p.color(c); c.setAlpha(255 * (op == null ? 1 : op)); return c; };
    if (frame) {
      p.noFill(); p.stroke(col(tk.color.muted, 0.5)); p.strokeWeight(1);
      p.line(frame[0][0] + ox, frame[1][1] + oy, frame[0][0] + ox, frame[0][1] + oy);
      p.line(frame[0][0] + ox, frame[1][1] + oy, frame[1][0] + ox, frame[1][1] + oy);
    }
    if (brect) {
      p.noFill(); p.stroke(col(tk.color[params.roles[params.brush.role]], brush.on)); p.strokeWeight(1.5);
      p.rect(brect[0][0] + ox, brect[0][1] + oy, brect[1][0] - brect[0][0], brect[1][1] - brect[0][1]);
    }
    if (!f) { p.pop(); return; }
    const txt = (s, x, y, size, c, font, al, op) => { p.noStroke(); p.fill(col(c, op)); p.textFont(font); p.textSize(size); p.textAlign(al || p.LEFT, p.BASELINE);
      p.text(s, x + ox - (al === p.RIGHT ? 2000 : al === p.CENTER ? 1000 : 0), y + oy, 2000); };   // maxWidth stops WEBGL text wrapping at spaces
    for (const q of pts) {
      if (q.op != null && q.op <= 0.01) continue;
      const op = q.op == null ? 1 : q.op, lx = q.x + (q.lx || 0), ly = q.y + (q.ly == null ? -30 : q.ly), al = q.al === 'c' ? p.CENTER : p.LEFT;
      if (q.lead !== false) { p.stroke(col(q.col, op)); p.strokeWeight(1.2); p.line(q.x + ox, q.y + oy, lx + ox, ly + 6 + oy); p.noStroke(); p.fill(col(q.col, op)); p.circle(q.x + ox, q.y + oy, 5); }
      txt(q.big, lx, ly - 4, q.size || 24, q.col, f.disp, al, op);
      if (q.small) txt(q.small, lx, ly + 12, 12, tk.color.muted, f.mono, al, op);
    }
    txt(fmt(readout.n), 36, H - 66, 66, readout.col, f.disp, p.LEFT, 1);   // counts first; the result is never in the smallest face
    txt(readout.line, 38, H - 40, 12, tk.color.muted, f.mono, p.LEFT, 1);
    txt(params.mark.toUpperCase() + ' · ONE DRAW · ' + (params.render === 'density' ? 'ADDITIVE DENSITY · ' : '') + (params.cam.proj === 'ortho' ? 'ORTHOGRAPHIC' : 'PERSPECTIVE'), W - 36, 40, 12, tk.color.muted, f.mono, p.RIGHT, 1);
    p.pop();
  }

  A.patterns['gl-instances'] = {
    id: 'gl-instances', atlas: ['gpu-instancing', 'build-geometry', 'webgl-mode', 'p5-framebuffer', 'world-to-screen', 'p5-strands', 'frontier-2026', 'capability-map'],
    renderer: 'webgl',
    params: {
      dur: 10, layout: 'scatter', mark: 'dot', render: 'marks', n: 10000, data: null, order: 'seeded', drawOrder: 'arrival', cull: null, faces: 'auto', chunk: 0,
      countIn: [0.06, 0.70], countEase: 'smooth', win: 0.04, grow: 1.6, size: 1, alpha: 1, dim: 0.55,
      roles: ['muted', 'accent', 'accent2', 'ink', 'chalk', 'panel'], noun: 'MARKS', caption: 'ARRIVING IN SEEDED ORDER',
      plot: [-330, -215, 430, 135], dot: 5.5, mix: 0.28, brush: null, pick: null,
      wcols: 500, pitch: 1.5, fill: 0.6667, offset: [40.25, -49.75],   // pitch x density = 3 px, square 2 px, edges on the pixel grid
      shares: [0.31, 0.22, 0.17, 0.13, 0.10, 0.07], catRole: [1, 0, 0, 0, 0, 0], catNames: ['A', 'B', 'C', 'D', 'E', 'F'], footprint: 14, cube: 4.2, cubeGap: 1.2, colGap: 34,
      rows: 250, pitch3: 2.1, barFill: 0.82, hmin: 2, hmax: 120,
      exposure: 0.9, accDensity: 1,
      cam: { proj: 'ortho', az: [0, 0], el: [0, 0], zoom: [1, 1], dist: [900, 900], fov: 0.8, look: [0, 0, 0], span: [0, 1] },
    },
    variants: [
      { name: 'dots-10k', params: { n: 10000, noun: 'PEOPLE', caption: 'ONE DOT EACH, SEEDED ARRIVAL' } },
      { name: 'flat-100k', params: { layout: 'waffle', mark: 'square', n: 100000, grow: 1, win: 0.02, countIn: [0.04, 0.55], noun: 'ACCOUNTS', caption: 'ONE SQUARE EACH, 500 x 200',
        pick: { ids: null, n: 1250, span: [0.62, 0.78], role: 1, label: 'FLAGGED' } } },
      { name: 'boxes-30k', params: { layout: 'stack', mark: 'box', n: 30000, noun: 'CASES', caption: 'ONE BOX EACH, STACKED BY CATEGORY', countIn: [0.04, 0.72],
        cam: { proj: 'ortho', az: [38, 58], el: [30, 22], zoom: [1.12, 1.04], look: [0, -110, 0], span: [0, 1], fov: 0.8, dist: [0, 0] } } },
      { name: 'bars-100k', params: { layout: 'field', mark: 'bar', n: 100000, rows: 250, faces: ['-y', '+z'], barFill: 0.96, noun: 'BARS', caption: '400 x 250 FIELD, HEIGHT = VALUE',
        pitch3: 1.7, cam: { proj: 'persp', az: [-24, 14], el: [48, 38], dist: [1000, 900], fov: 0.8, look: [0, 50, 30], span: [0, 1], zoom: [1, 1] } } },
      { name: 'brushed-50k', params: { n: 50000, dot: 3.6, mix: 0.22, countIn: [0.04, 0.42], noun: 'PEOPLE', caption: 'SEEDED ARRIVAL',
        brush: { rect: [0.58, 0.52, 0.86, 0.84], span: [0.50, 0.80], role: 1 } } },
      { name: 'density-100k', params: { n: 100000, render: 'density', dot: 4, alpha: 0.18, mix: 0.22, grow: 1, countIn: [0.04, 0.70], noun: 'PEOPLE', caption: 'ADDITIVE, TONE-MAPPED (NO SORT)' } },
    ],
    /* fonts for the flat labels: the pack's disp + mono TTF from arsenal/fonts/fonts.js; the first lock face if absent */
    async load(p, tk) {
      const FT = window.ARSENAL_FONTS || {}, key = (r) => tk.type[r].family + '|' + tk.type[r].weight;
      const pick = (r, dflt) => (FT[key(r)] ? [key(r), false] : [dflt, true]);
      const [dk, dfb] = pick('disp', 'Big Shoulders Display|600'), [mk, mfb] = pick('mono', 'IBM Plex Mono|400');
      return { disp: await p.loadFont(FT[dk]), mono: await p.loadFont(FT[mk]), keys: [dk, mk], fallback: dfb || mfb };
    },
    /* count(t): exact number of marks shown at t; picked(t): exact picked marks among them */
    count(t, st, params) { return countAt(params, st.N, t); },
    picked(t, st, params) { return st.pickPre[countAt(params, st.N, t)]; },
    /* pick(p, st, ids): highlight a subset by data id (re-uploads the rank+pick channel; call outside draw, then re-seek) */
    pick(p, st, ids) { setPicked(st, ids); st.drawn.forEach((m, i) => { st.buf[i * 8 + 7] = m.rank + (st.picked[m.rank] ? 0.5 : 0); }); upload(p, st); return st.pickN; },
    setup(p, ctx, params) {
      const st = { seed: ctx.seed == null ? 7 : ctx.seed, fonts: ctx.fonts || null };
      const rng = mulberry32(st.seed);
      const P = Object.assign({}, params, params.layout === 'field' ? { pitch: params.pitch3 } : {});
      const data = params.data || synth(params, rng);
      const lay = layout(P, data, rng);
      const arr = lay.ordered ? lay.marks : orderMarks(lay.marks, params, rng);   // arrival order
      st.N = arr.length; st.rankOf = new Int32Array(st.N).fill(-1);
      arr.forEach((m, r) => { m.rank = r; st.rankOf[m.id] = r; });
      let ids = params.pick && params.pick.ids;
      if (params.pick && !ids) { const pr = mulberry32(st.seed ^ 0x9e3779b9), all = Array.from({ length: st.N }, (_, i) => i); ids = shuffle(all, pr).slice(0, params.pick.n); }
      setPicked(st, ids);
      st.drawn = arr;
      if (params.drawOrder === 'depth') {                       // front-to-back for the mid-path eye: early-z rejects hidden bars
        const e = camPose(params, 0.5).eye, d2 = (m) => (m.x - e[0]) ** 2 + (-m.h / 2 - e[1]) ** 2 + (m.z - e[2]) ** 2;
        st.drawn = arr.slice().sort((a, b) => d2(a) - d2(b) || a.rank - b.rank);
      }
      makeTexture(p, st);
      const quad = params.mark === 'dot' || params.mark === 'square';
      st.chunk = params.chunk || (quad ? 1024 : 256);
      st.faces = quad ? [] : facesFor(params, arr);
      st.geom = p.buildGeometry(() => { p.noStroke(); for (let j = 0; j < st.chunk; j++) { p.push(); p.translate(j * STEP, 0, 0);
        if (quad) p.plane(1, 1); else for (const fc of st.faces) { p.push(); FACE[fc](p); p.plane(1, 1); p.pop(); } p.pop(); } });
      st.sh = p.createShader(VERT, FRAG); st.work = p.createCamera(); st.hud = p.createCamera();
      if (params.render === 'density') {
        st.acc = p.createFramebuffer({ format: p.HALF_FLOAT, channels: p.RGBA, density: params.accDensity, antialias: false, depth: false, textureFiltering: p.LINEAR });
        st.accCam = st.acc.createCamera(); st.tone = p.createShader(TVERT, TFRAG);
      }
      if (params.brush) { st.bx = new Float32Array(st.N); st.by = new Float32Array(st.N); arr.forEach((m, r) => { st.bx[r] = m.dx; st.by[r] = m.dy; }); }
      if (params.layout === 'stack') { st.cat = Uint8Array.from(arr, (m) => m.k); st.K = params.shares.length;
        const fp = params.footprint, pitch = params.cube + params.cubeGap, colW = fp * pitch, span = st.K * colW + (st.K - 1) * params.colGap;
        st.colX = Array.from({ length: st.K }, (_, k) => -span / 2 + k * (colW + params.colGap) + colW / 2); st.layerN = fp * fp; st.pitch = pitch; }
      if (params.layout === 'field') { let mi = 0; for (let i = 1; i < st.N; i++) if (arr[i].v > arr[mi].v) mi = i;
        st.maxI = mi; st.maxM = { x: arr[mi].x, z: arr[mi].z, h: arr[mi].h, v: arr[mi].v, r: arr[mi].r, c: arr[mi].col }; }
      return st;
    },
    draw(p, t, st, params, tk) {
      const u = clamp(t / params.dur), k = countAt(params, st.N, t), front = frontAt(params, st.N, t), brush = brushAt(params, u);
      const pickOn = params.pick ? onAt(params.pick.span, u) : 0;
      p.background(tk.color.bg); p.noLights();
      if (params.render === 'density') {                        // order-independent: sum weights, then tone-map
        st.acc.begin(); p.clear(); camAt(p, st.accCam, params, u);
        bindMarks(p, st, params, tk, k, front, brush, pickOn); p.blendMode(p.ADD); drawMarks(p, st, params, k); p.blendMode(p.BLEND);
        st.acc.end();
        p.push(); p.setCamera(st.hud); p.resetMatrix(); p.shader(st.tone);
        st.tone.setUniform('uAcc', st.acc); st.tone.setUniform('uExposure', params.exposure); st.tone.setUniform('uFlip', 0);
        st.tone.setUniform('uBg', rgb(p, tk.color.bg)); st.tone.setUniform('uHot', rgb(p, tk.color.chalk));
        p.noStroke(); p.plane(p.width, p.height); p.resetShader(); p.pop();
        camAt(p, st.work, params, u);
      } else {
        camAt(p, st.work, params, u);
        bindMarks(p, st, params, tk, k, front, brush, pickOn); drawMarks(p, st, params, k);
      }
      const pins = [], role = (i) => tk.color[params.roles[i]];
      let readout = { n: k, col: k > 0 ? tk.color.accent : tk.color.ink, line: 'OF ' + fmt(st.N) + ' ' + params.noun + ' · ' + params.caption };
      let bcount = null, pcount = null;
      if (brush) {                                             // exact: arrived marks (rank < k) whose data point is inside the box
        const r = brush.r; bcount = 0;
        for (let i = 0; i < k; i++) { const x = st.bx[i], y = st.by[i]; if (x >= r[0] && x <= r[2] && y >= r[1] && y <= r[3]) bcount++; }
        readout = { n: bcount, col: role(params.brush.role), line: 'IN THE BOX · OF ' + fmt(k) + ' ' + params.noun + ' SHOWN' };
      }
      if (params.pick && pickOn > 0) {
        pcount = st.pickPre[k];
        readout = { n: pcount, col: role(params.pick.role), line: params.pick.label + ' · OF ' + fmt(k) + ' ' + params.noun + ' SHOWN' };
      }
      if (params.layout === 'stack') {
        const seen = new Array(st.K).fill(0); for (let i = 0; i < k; i++) seen[st.cat[i]]++;
        for (let c = 0; c < st.K; c++) {
          if (!seen[c]) continue;
          const top = -Math.ceil(seen[c] / st.layerN) * st.pitch - 10;
          pins.push({ p: [st.colX[c], top, 0], big: fmt(seen[c]), small: params.catNames[c], col: c === 0 ? tk.color.accent : tk.color.ink, size: c === 0 ? 26 : 20, lead: false, ly: -16, al: 'c' });
        }
      }
      if (params.layout === 'field' && st.maxI < k) {
        const m = st.maxM, op = smooth((front - st.maxI) / Math.max(1, st.N * params.win));
        pins.push({ p: [m.x, -m.h, m.z], big: 'max ' + m.v.toFixed(2), small: 'ROW ' + (m.r + 1) + ' · COL ' + (m.c + 1), col: tk.color.chalk, op, lx: 26, ly: -44 });
      }
      hud(p, st, params, tk, k, brush, pins, readout);
      return { k, n: st.N, brushed: bcount, picked: pcount };
    },
  };
})();
