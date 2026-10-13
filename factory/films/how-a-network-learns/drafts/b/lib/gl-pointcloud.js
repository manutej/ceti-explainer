/* arsenal/patterns/gl-pointcloud · a 3D scatter on the pure clock (renderer: webgl)
   data: rows {x, y, z, group, label?, size?, brushed?}. All N points are ONE p5.Geometry (4 corners per point, 2 tris)
   drawn with ONE model() call under a custom billboard shader: corners expand in view space, so perspective, an extra
   size-by-depth cue and fog toward the pack bg are all computed per vertex. Per-point data rides in the stock attributes
   (aNormal = corner.xy + group.size, aTexCoord = brushRank, revealOrder), so no p5 2.4 instances() and no raw GL.
   Brushed subset arrives on t (rank by distance from the brush centre); count(t) is exact. Pins on named rows go through
   worldToScreen and are drawn flat in the pack's faces. Optional depth-of-field post in its own framebuffer (off by
   default). draw(t) is a pure function of t; seeds in setup. */
(function () {
  const A = (window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} });
  function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const smooth = (x) => { x = clamp(x); return x * x * x * (x * (x * 6 - 15) + 10); };
  const lerp = (a, b, u) => a + (b - a) * u;
  const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const gauss = (r) => { let u = 0, v = 0; while (u === 0) u = r(); v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.283185307 * v); };
  const FALLBACK = { disp: 'Big Shoulders Display|600', mono: 'IBM Plex Mono|400' };

  /* ---------- shaders (GLSL ES 1.00) ---------- */
  const VERT = `precision highp float;
attribute vec3 aPosition; attribute vec3 aNormal; attribute vec2 aTexCoord;
uniform mat4 uModelViewMatrix; uniform mat4 uProjectionMatrix;
uniform float uR, uSizeCue, uZRef, uK, uRamp, uDim, uS, uFog, uGrow, uShown;
uniform vec2 uFogZ; uniform vec3 uG0, uG1, uG2, uG3, uHi, uBg;
varying vec3 vCol; varying vec2 vC; varying float vFog;
void main(){
  vec4 mv = uModelViewMatrix * vec4(aPosition, 1.0);
  float z = max(-mv.z, 1.0);
  float g = floor(aNormal.z); float sz = 0.6 + 0.8 * fract(aNormal.z);
  vec3 c = g < 0.5 ? uG0 : (g < 1.5 ? uG1 : (g < 2.5 ? uG2 : uG3));
  float rank = aTexCoord.x;
  float a = rank >= 0.0 ? clamp((uK - rank) / uRamp, 0.0, 1.0) : 0.0;
  c = mix(mix(c, uBg, uDim * uS), uHi, a);
  float vis = aTexCoord.y < uShown ? 1.0 : 0.0;
  float r = vis * uR * sz * pow(uZRef / z, uSizeCue) * (1.0 + uGrow * a);
  mv.xy += aNormal.xy * r;
  vFog = uFog * smoothstep(uFogZ.x, uFogZ.y, z) * (1.0 - 0.6 * a);
  vCol = c; vC = aNormal.xy;
  gl_Position = uProjectionMatrix * mv;
}`;
  const FRAG = `precision highp float;
varying vec3 vCol; varying vec2 vC; varying float vFog; uniform vec3 uBg;
void main(){ float r2 = dot(vC, vC); if (r2 > 1.0) discard; vec3 c = vCol * (1.0 - 0.22 * r2); gl_FragColor = vec4(mix(c, uBg, vFog), 1.0); }`;
  const DOF_VERT = `precision highp float; attribute vec3 aPosition; attribute vec2 aTexCoord;
uniform mat4 uModelViewMatrix; uniform mat4 uProjectionMatrix; varying vec2 vUv;
void main(){ vUv = aTexCoord; gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0); }`;
  // gather blur: 12 golden-angle taps scaled by the centre's circle of confusion; samples weighted by their own CoC so a sharp
  // point does not smear onto the blurred field around it. 12 colour + 13 depth reads per pixel.
  const DOF_FRAG = `precision highp float; varying vec2 vUv; uniform sampler2D uTex; uniform sampler2D uDepth;
uniform vec2 uPx; uniform float uNear, uFar, uFocus, uRange, uMaxR;
float lin(float d){ float z = d * 2.0 - 1.0; return 2.0 * uNear * uFar / (uFar + uNear - z * (uFar - uNear)); }
float coc(vec2 uv){ return clamp(abs(lin(texture2D(uDepth, uv).r) - uFocus) / uRange, 0.0, 1.0); }
void main(){
  float c0 = coc(vUv); vec3 acc = texture2D(uTex, vUv).rgb; float w = 1.0;
  if (c0 > 0.02) {
    for (int i = 0; i < 12; i++) { float fi = float(i); float an = fi * 2.39996; float rr = sqrt((fi + 0.5) / 12.0);
      vec2 suv = vUv + vec2(cos(an), sin(an)) * rr * c0 * uMaxR * uPx; float wt = max(coc(suv), 0.2);
      acc += texture2D(uTex, suv).rgb * wt; w += wt; }
  }
  gl_FragColor = vec4(acc / w, 1.0);
}`;
  const rgb = (p, c) => { c = p.color(c); return [p.red(c) / 255, p.green(c) / 255, p.blue(c) / 255]; };

  /* ---------- fonts: the pack's faces as p5.Fonts (WEBGL text needs a loaded TTF) ---------- */
  const fontCache = new Map();
  async function face(p, tk, role) {
    const F = window.ARSENAL_FONTS || {};
    const want = tk && tk.type && tk.type[role] ? tk.type[role].family + '|' + tk.type[role].weight : '';
    const key = F[want] ? want : FALLBACK[role];
    if (!F[key]) return { font: null, key: null, fallback: true };
    if (!fontCache.has(key)) fontCache.set(key, p.loadFont(F[key]));
    return { font: await fontCache.get(key), key, fallback: key !== want };
  }

  /* ---------- synthetic data (only when params.data is empty); seeded ---------- */
  function synth(params, seed) {
    const r = mulberry32(seed), g = params.gen || {}, N = g.n || 2000, rows = [];
    if (g.kind === 'roll') {        // a noisy swiss roll in four bands: depth is the only way to read it
      for (let i = 0; i < N; i++) {
        const s = r(), th = 1.5 * Math.PI * (1 + 2 * s), h = r();
        const x = 0.5 + (th * Math.cos(th)) / 30 + gauss(r) * 0.016, y = 0.5 + (th * Math.sin(th)) / 30 + gauss(r) * 0.016;
        rows.push({ x: clamp(x), y: clamp(y), z: clamp(0.04 + 0.92 * h), group: Math.min(3, Math.floor(s * 4)), size: 0.3 + 0.4 * r() });
      }
    } else {                        // correlated clusters: group 0 diffuse, group 1 tight and correlated along x=y=z (the risk)
      const G = g.groups || 2;
      for (let i = 0; i < N; i++) {
        const k = i % G;
        if (k === 1) { const s = gauss(r) * 0.1, c = 0.6; rows.push({ x: clamp(c + s + gauss(r) * 0.045), y: clamp(c + s + gauss(r) * 0.045), z: clamp(c + 0.9 * s + gauss(r) * 0.05), group: 1, size: 0.5 }); }
        else rows.push({ x: clamp(0.4 + gauss(r) * 0.17), y: clamp(0.38 + gauss(r) * 0.15), z: clamp(0.45 + gauss(r) * 0.2), group: k, size: 0.35 + 0.3 * r() });
      }
    }
    (g.names || []).forEach((nm, j) => {   // name rows deterministically: the j-th most extreme by x+y+z, or a given index
      const idx = typeof nm.i === 'number' ? nm.i : rankBy(rows, (q) => q.x + q.y + q.z)[nm.rank || 0];
      rows[idx].label = nm.label;
    });
    return rows;
  }
  function rankBy(rows, f) { return rows.map((q, i) => i).sort((a, b) => f(rows[b]) - f(rows[a]) || a - b); }

  /* ---------- data -> world, ranks, geometry ---------- */
  function prepare(rows, params, seed) {
    const N = rows.length, S = params.size, dom = params.domain || ['x', 'y', 'z'].map((k) => {
      let lo = Infinity, hi = -Infinity; for (const q of rows) { lo = Math.min(lo, q[k]); hi = Math.max(hi, q[k]); }
      const pad = (hi - lo) * 0.04 || 0.5; return [lo - pad, hi + pad];
    });
    const toW = (q) => [((q.x - dom[0][0]) / (dom[0][1] - dom[0][0]) - 0.5) * S, -((q.y - dom[1][0]) / (dom[1][1] - dom[1][0]) - 0.5) * S, ((q.z - dom[2][0]) / (dom[2][1] - dom[2][0]) - 0.5) * S];
    const gmap = new Map(), grp = new Uint8Array(N), pos = new Float32Array(N * 3), inB = new Uint8Array(N);
    const B = params.brush;
    for (let i = 0; i < N; i++) {
      const q = rows[i], w = toW(q); pos.set(w, i * 3);
      let gk = q.group == null ? 0 : q.group; if (!gmap.has(gk)) gmap.set(gk, typeof gk === 'number' ? gk : gmap.size); grp[i] = gmap.get(gk) % 4;
      if (B) inB[i] = B.field ? (q[B.field] ? 1 : 0) : B.group != null ? (q.group === B.group ? 1 : 0)
        : B.box ? ((q.x >= B.box[0][0] && q.x <= B.box[0][1] && q.y >= B.box[1][0] && q.y <= B.box[1][1] && q.z >= B.box[2][0] && q.z <= B.box[2][1]) ? 1 : 0) : 0;
    }
    // brush rank: by distance from the brush centre (box centre, else the subset's centroid), nearest first
    let cx = 0, cy = 0, cz = 0, nB = 0; const bi = [];
    for (let i = 0; i < N; i++) if (inB[i]) { bi.push(i); cx += pos[i * 3]; cy += pos[i * 3 + 1]; cz += pos[i * 3 + 2]; nB++; }
    let ctr = nB ? [cx / nB, cy / nB, cz / nB] : [0, 0, 0];
    if (B && B.box) ctr = toW({ x: (B.box[0][0] + B.box[0][1]) / 2, y: (B.box[1][0] + B.box[1][1]) / 2, z: (B.box[2][0] + B.box[2][1]) / 2 });
    const d2 = (i) => (pos[i * 3] - ctr[0]) ** 2 + (pos[i * 3 + 1] - ctr[1]) ** 2 + (pos[i * 3 + 2] - ctr[2]) ** 2;
    bi.sort((a, b) => d2(a) - d2(b) || a - b);
    const brank = new Float32Array(N).fill(-1); bi.forEach((i, k) => (brank[i] = k));
    // reveal order: seeded permutation (count-in spreads over the whole cloud), or row order
    const order = new Float32Array(N), perm = Array.from({ length: N }, (_, i) => i);
    if (params.revealBy === 'random') { const r = mulberry32(seed ^ 0x9e37); for (let i = N - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [perm[i], perm[j]] = [perm[j], perm[i]]; } }
    perm.forEach((i, k) => (order[i] = k));
    const named = []; rows.forEach((q, i) => { if (q.label) named.push({ i, label: q.label, w: [pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]], row: q }); });
    const boxW = B && B.box ? [toW({ x: B.box[0][0], y: B.box[1][0], z: B.box[2][0] }), toW({ x: B.box[0][1], y: B.box[1][1], z: B.box[2][1] })] : null;
    return { N, pos, grp, brank, nB, order, ctr, named, dom, boxW, groups: gmap.size };
  }

  function buildCloud(p, d, rows) {
    const g = new p5.Geometry(1, 1, null, p._renderer), C = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
    for (let i = 0; i < d.N; i++) {
      const x = d.pos[i * 3], y = d.pos[i * 3 + 1], z = d.pos[i * 3 + 2], sz = clamp(rows[i].size == null ? 0.5 : rows[i].size, 0, 0.999);
      for (const c of C) { g.vertices.push(p.createVector(x, y, z)); g.vertexNormals.push(p.createVector(c[0], c[1], d.grp[i] + sz)); g.uvs.push(d.brank[i], d.order[i]); }
      const b = i * 4; g.faces.push([b, b + 1, b + 2], [b, b + 2, b + 3]);
    }
    return g;
  }

  /* ---------- camera on t ---------- */
  function camAt(st, params, u, s) {
    const c = params.cam, k = lerp(u, smooth(u), 0.5);
    const yaw = lerp(c.yaw[0], c.yaw[1], k), pitch = lerp(c.pitch[0], c.pitch[1], k), dist = lerp(c.dist[0], c.dist[1], c.follow ? s : k);
    const f = (c.follow || 0) * s, tg = [st.d.ctr[0] * f, st.d.ctr[1] * f, st.d.ctr[2] * f];
    const eye = [tg[0] + dist * Math.sin(yaw) * Math.cos(pitch), tg[1] - dist * Math.sin(pitch), tg[2] + dist * Math.cos(yaw) * Math.cos(pitch)];
    const R = params.size * 0.87, near = Math.max(8, dist - 2.2 * R), far = dist + 2.2 * R;
    return { eye, tg, dist, near, far, fov: c.fov };
  }
  function setCam(p, cam, cv) {
    cam.camera(cv.eye[0], cv.eye[1], cv.eye[2], cv.tg[0], cv.tg[1], cv.tg[2], 0, 1, 0);
    cam.perspective(cv.fov, p.width / p.height, cv.near, cv.far); p.setCamera(cam);
  }
  const viewZ = (cv, w) => { const d = [cv.tg[0] - cv.eye[0], cv.tg[1] - cv.eye[1], cv.tg[2] - cv.eye[2]], l = Math.hypot(...d); return ((w[0] - cv.eye[0]) * d[0] + (w[1] - cv.eye[1]) * d[1] + (w[2] - cv.eye[2]) * d[2]) / l; };

  /* ---------- the timeline: counts the film can caption ---------- */
  function counts(st, params, t) {
    const u = clamp(t / params.dur), d = st.d, rv = params.reveal;
    const shown = rv ? Math.floor(d.N * smooth((u - rv[0]) / (rv[1] - rv[0])) + 1e-9) : d.N;
    const ba = params.brushAt, s = params.brush && d.nB ? smooth((u - ba[0]) / (ba[1] - ba[0])) : 0;
    const k = Math.floor(d.nB * s + 1e-9);
    return { u, shown, s, brushed: k, nB: d.nB, N: d.N };
  }

  function drawScene(p, st, params, tk, c, cv) {
    p.background(tk.color.bg);
    // frame: the data cube (12 edges) in the line role, and the brush box in accent
    const line = p.color(tk.color.line);
    if (params.frame) {
      p.stroke(line); p.strokeWeight(1); p.noFill();
      p.push(); p.box(params.size); p.pop();
    }
    if (st.d.boxW && c.s > 0) {
      const [a, b] = st.d.boxW, col = p.color(tk.color.accent); col.setAlpha(255 * clamp(c.s * 3));
      p.stroke(col); p.strokeWeight(1.5); p.noFill();
      p.push(); p.translate((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2); p.box(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1]), Math.abs(b[2] - a[2])); p.pop();
    }
    // the cloud: one model() call
    const sh = st.sh, roles = params.groupRoles, R = params.size * 0.87;
    p.noStroke(); p.fill(255); p.shader(sh);
    ['uG0', 'uG1', 'uG2', 'uG3'].forEach((n, i) => sh.setUniform(n, rgb(p, tk.color[roles[i % roles.length]])));
    sh.setUniform('uHi', rgb(p, tk.color[params.hiRole])); sh.setUniform('uBg', rgb(p, tk.color.bg));
    sh.setUniform('uR', params.r); sh.setUniform('uSizeCue', params.sizeCue); sh.setUniform('uZRef', cv.dist);
    sh.setUniform('uK', c.brushed); sh.setUniform('uRamp', Math.max(1, st.d.nB * params.ramp)); sh.setUniform('uDim', params.dim);
    sh.setUniform('uS', c.s); sh.setUniform('uGrow', params.grow); sh.setUniform('uShown', c.shown);
    sh.setUniform('uFog', params.fog); sh.setUniform('uFogZ', [lerp(cv.dist - R, cv.dist + R, params.fogStart), cv.dist + R]);
    p.model(st.geom);
    p.resetShader();
  }

  function dofPass(p, st, params, tk, cv) {
    const sh = st.dofSh, fb = st.fb, W = p.width, H = p.height;
    const fz = params.dof.focus === 'brush' ? viewZ(cv, st.d.ctr) : params.dof.focus === 'pin' && st.d.named[0] ? viewZ(cv, st.d.named[0].w) : cv.dist;
    p.background(tk.color.bg); p.setCamera(st.hud); p.resetMatrix(); p.noStroke(); p.fill(255);
    p.shader(sh);
    sh.setUniform('uTex', fb.color); sh.setUniform('uDepth', fb.depth); sh.setUniform('uPx', [1 / W, 1 / H]);
    sh.setUniform('uNear', cv.near); sh.setUniform('uFar', cv.far); sh.setUniform('uFocus', fz);
    sh.setUniform('uRange', params.size * params.dof.range); sh.setUniform('uMaxR', params.dof.maxR);
    p.plane(W, H); p.resetShader();
    return fz;
  }

  /* ---------- pins and HUD, flat, in the pack's faces ---------- */
  function hud(p, st, params, tk, c, cv, t) {
    const W = p.width, H = p.height, ox = -W / 2, oy = -H / 2, f = st.fonts, u = c.u;
    // screen points first, while the 3D camera is set
    const pinsOn = params.pins && params.pinsAt != null;
    const pins = pinsOn ? st.d.named.map((n, j) => {
      const v = p.worldToScreen(p.createVector(n.w[0], n.w[1], n.w[2]));
      const op = smooth((u - params.pinsAt - j * 0.035) / 0.06);
      const big = [].concat(params.pinField).map((k) => { const val = n.row[k]; return k + ' ' + (typeof val === 'number' ? val.toFixed(params.pinDigits) : String(val)); }).join('  ');
      return { label: n.label, x: v.x, y: v.y, op, big, z: viewZ(cv, n.w) };
    }) : [];
    const hh = params.size / 2, ax = params.axes ? [[[hh, hh, -hh], params.axes[0]], [[-hh, -hh, -hh], params.axes[1]], [[-hh, hh, hh], params.axes[2]]] : [];
    const axS = ax.map(([w, name]) => { const v = p.worldToScreen(p.createVector(w[0], w[1], w[2])); return { x: v.x, y: v.y, name }; });
    // layout: label to the side away from the centre, stacked so labels never overlap (simple sweep on y)
    const lab = pins.filter((q) => q.op > 0.01).map((q) => ({ ...q, side: q.x > W / 2 ? 1 : -1, ly: q.y - 36 }));
    for (const side of [1, -1]) {
      const L = lab.filter((q) => q.side === side).sort((a, b) => a.ly - b.ly);
      for (let i = 1; i < L.length; i++) if (L[i].ly < L[i - 1].ly + 50) L[i].ly = L[i - 1].ly + 50;
    }
    p.push(); p.resetMatrix(); p.setCamera(st.hud); p.drawingContext.clear(p.drawingContext.DEPTH_BUFFER_BIT);
    if (!f.disp || !f.mono) { p.pop(); return pins; }
    const txt = (s, x, y, size, col, font, al, op) => {
      const cc = p.color(col); cc.setAlpha(255 * (op == null ? 1 : op)); p.noStroke(); p.fill(cc); p.textFont(font); p.textSize(size);
      p.textAlign(al === 'right' ? p.RIGHT : p.LEFT, p.BASELINE); p.text(s, x + ox - (al === 'right' ? 2000 : 0), y + oy, 2000);
    };
    for (const a of axS) txt(a.name, a.x + 6, a.y - 6, 12, tk.color.muted, f.mono, 'left', 1);
    for (const q of lab) {
      const lx = q.x + q.side * 30, cc = p.color(tk.color[params.pinRole]); cc.setAlpha(255 * q.op);
      p.stroke(cc); p.strokeWeight(1.25); p.noFill(); p.line(q.x + ox, q.y + oy, lx + ox, q.ly + oy + 6);
      p.noStroke(); p.fill(cc); p.circle(q.x + ox, q.y + oy, 8);
      const al = q.side > 0 ? 'left' : 'right', tx = lx + q.side * 4;
      txt(q.big, tx, q.ly, 22, tk.color.ink, f.disp, al, q.op);
      txt(q.label, tx, q.ly + 16, 12, tk.color.muted, f.mono, al, q.op);
    }
    if (params.readout) {
      const brushing = params.brush && c.s > 0;
      const big = brushing ? c.brushed : c.shown;
      txt(fmt(big), 36, H - 66, 64, brushing ? tk.color[params.hiRole] : tk.color.ink, f.disp, 'left', 1);
      txt(brushing ? ('OF ' + fmt(c.N) + ' POINTS · ' + (params.brushCaption || 'IN THE BRUSH')) : ('OF ' + fmt(c.N) + ' POINTS SHOWN · ' + st.d.groups + ' GROUPS'), 38, H - 40, 12, tk.color.muted, f.mono, 'left', 1);
      if (params.title) txt(params.title, 36, 42, 12, tk.color.muted, f.mono, 'left', 1);
      if (st.dofOn) txt('DEPTH OF FIELD · FOCUS ' + (params.dof.focus || 'centre').toUpperCase(), W - 36, 42, 12, tk.color.muted, f.mono, 'right', 1);
    }
    p.pop();
    return pins;
  }

  A.patterns['gl-pointcloud'] = {
    id: 'gl-pointcloud', atlas: ['webgl-mode', 'build-geometry', 'gpu-instancing', 'p5-shader', 'p5-framebuffer', 'world-to-screen', 'p5-camera', 'frontier-2026'],
    renderer: 'webgl',
    params: {
      dur: 12, data: null, gen: { kind: 'clusters', n: 2000, groups: 2 }, domain: [[0, 1], [0, 1], [0, 1]],
      size: 380, r: 3.2, sizeCue: 0.6, fog: 0, fogStart: 0.2, frame: true, axes: ['X', 'Y', 'Z'],
      groupRoles: ['muted', 'accent2', 'ink', 'chalk'], hiRole: 'accent', pinRole: 'accent',
      reveal: [0.02, 0.22], revealBy: 'random',
      brush: null, brushAt: [0.35, 0.7], ramp: 0.08, dim: 0.55, grow: 0.5, brushCaption: '',
      pins: true, pinsAt: 0.74, pinField: 'z', pinDigits: 2,
      cam: { yaw: [-0.55, 0.65], pitch: [0.42, 0.3], dist: [900, 900], fov: 0.72, follow: 0 },
      dof: null, readout: true, title: '',
    },
    variants: [
      { name: 'two-groups-2k', params: { title: '2,000 POINTS · TWO GROUPS', gen: { kind: 'clusters', n: 2000, groups: 2 }, pins: false } },
      { name: 'fog-20k', params: { title: '20,000 POINTS · FOG TOWARD THE BACKGROUND', gen: { kind: 'roll', n: 20000 }, r: 1.9, fog: 0.85, fogStart: 0.1, sizeCue: 0.9,
        groupRoles: ['accent2', 'accent', 'muted', 'ink'], pins: false, cam: { yaw: [-0.75, 0.75], pitch: [0.22, 0.08], dist: [860, 720], fov: 0.72 } } },
      { name: 'brushed-pins', params: { title: '6,000 POINTS · ONE BRUSH', gen: { kind: 'clusters', n: 6000, groups: 3, names: [{ rank: 0, label: 'HIGHEST X+Y+Z' }, { rank: 1, label: 'SECOND' }, { rank: 2, label: 'THIRD' }] },
        r: 2.6, fog: 0.45, groupRoles: ['muted', 'ink', 'accent2'],
        brush: { box: [[0.55, 1], [0.55, 1], [0.5, 1]] }, brushCaption: 'IN THE BRUSH · X, Y >= 0.55, Z >= 0.50', pinField: ['x', 'y', 'z'],
        cam: { yaw: [-0.4, 0.5], pitch: [0.4, 0.3], dist: [920, 720], fov: 0.72, follow: 0.6 } } },
      { name: 'brushed-dof', params: { title: '6,000 POINTS · ONE BRUSH · DEPTH OF FIELD', gen: { kind: 'clusters', n: 6000, groups: 3, names: [{ rank: 0, label: 'HIGHEST X+Y+Z' }] },
        r: 2.6, fog: 0.3, groupRoles: ['muted', 'ink', 'accent2'],
        brush: { box: [[0.55, 1], [0.55, 1], [0.5, 1]] }, brushCaption: 'IN THE BRUSH · X, Y >= 0.55, Z >= 0.50',
        cam: { yaw: [-0.4, 0.5], pitch: [0.4, 0.3], dist: [920, 720], fov: 0.72, follow: 0.6 }, pinField: ['x', 'y', 'z'], dof: { focus: 'brush', range: 0.9, maxR: 9, density: 2 } } },
    ],
    async load(p, tk) { const d = await face(p, tk, 'disp'), m = await face(p, tk, 'mono'); return { disp: d.font, mono: m.font, keys: [d.key, m.key], fallback: d.fallback || m.fallback }; },
    async setup(p, ctx, params) {
      const seed = ctx.seed == null ? 7 : ctx.seed, tk = ctx.tokens;
      const rows = params.data && params.data.length ? params.data : synth(params, seed);
      const st = { seed, rows, fonts: ctx.fonts || (await this.load(p, tk)) };
      st.d = prepare(rows, params, seed); st.geom = buildCloud(p, st.d, rows);
      st.sh = p.createShader(VERT, FRAG);
      st.cam = p.createCamera(); st.hud = p.createCamera();   // hud keeps p5's default camera: 1 unit = 1 css px at z = 0
      if (params.dof) {
        st.fb = p.createFramebuffer({ density: params.dof.density || p.pixelDensity(), antialias: false });
        st.fbCam = st.fb.createCamera(); st.dofSh = p.createShader(DOF_VERT, DOF_FRAG);
      }
      st.dofOn = !!params.dof;
      return st;
    },
    count(t, st, params) { const c = counts(st, params, t); return { shown: c.shown, brushed: c.brushed, total: c.N, inBrush: c.nB }; },
    draw(p, t, st, params, tk) {
      const c = counts(st, params, t), cv = camAt(st, params, c.u, c.s);
      let focus = null;
      if (st.dofOn) {
        st.fb.begin(); setCam(p, st.fbCam, cv); p.resetMatrix(); drawScene(p, st, params, tk, c, cv); st.fb.end();
        focus = dofPass(p, st, params, tk, cv);
        p.resetMatrix(); setCam(p, st.cam, cv);
      } else {
        setCam(p, st.cam, cv); drawScene(p, st, params, tk, c, cv);
      }
      p.resetMatrix();
      const pins = hud(p, st, params, tk, c, cv, t);
      return { shown: c.shown, brushed: c.brushed, total: c.N, inBrush: c.nB, pins: pins.map((q) => ({ label: q.label, x: +q.x.toFixed(1), y: +q.y.toFixed(1), op: q.op })), focus };
    },
  };
})();
