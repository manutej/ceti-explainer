/* arsenal/patterns/gl-heightfield · a matrix as a lit terrain on the pure clock (renderer: webgl)
   data (rows x cols matrix) -> one p5.Geometry (vertices, faces, normals built by hand, no buildGeometry loop),
   one draw with a custom GLSL shader: Lambert from fixed intensities, colour ramp from pack ROLES (uniforms, so a
   pack swap needs no rebake), contour lines and the wireframe grid computed per fragment from world height and the
   normal's slope, a travelling section cut (band, or clip + section face), a row-by-row count-in.
   Camera: spherical keys (az, el, dist) eased on t; pins through worldToScreen, drawn flat with the pack's faces.
   draw(t) is pure of t; synthetic data is seeded in setup (mulberry32). No fetch. */
(function () {
  const A = (window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} });
  function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const smooth = (x) => { x = clamp(x); return x * x * x * (x * (x * 6 - 15) + 10); };
  const lerp = (a, b, u) => a + (b - a) * u;
  const fmtInt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const D2R = Math.PI / 180;

  const VERT = 'precision highp float; attribute vec3 aPosition; attribute vec3 aNormal; attribute vec4 aVertexColor;' +
    'uniform mat4 uModelViewMatrix; uniform mat4 uProjectionMatrix; varying vec3 vN; varying vec3 vP; varying float vV;' +
    'void main(){ vN = aNormal; vP = aPosition; vV = aVertexColor.r; gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0); }';
  // vV = colour value 0..1 (stored in the vertex colour's red channel); ramp R0 -> R1 -> R2 from roles
  const FRAG = 'precision highp float; varying vec3 vN; varying vec3 vP; varying float vV;' +
    'uniform vec3 uR0, uR1, uR2, uFill, uLine, uCut, uRim, uKeyDir; uniform float uAmb, uKey, uRimK;' +
    'uniform float uStep, uCW, uWire, uCell, uGW, uCutX, uCutW, uClipX, uRevZ; uniform vec2 uOrigin;' +
    'void main(){' +
    ' if (vP.z > uRevZ) discard;' +
    ' if (vP.x < uClipX) discard;' +
    ' vec3 n = normalize(vN); float lam = max(dot(n, -uKeyDir), 0.0); float rim = 1.0 - abs(n.y); rim = rim * rim;' +
    ' vec3 ramp = vV < 0.5 ? mix(uR0, uR1, vV * 2.0) : mix(uR1, uR2, vV * 2.0 - 1.0);' +
    ' vec3 base = uWire > 0.5 ? uFill : ramp;' +
    ' vec3 col = base * (uAmb + uKey * lam) + uRim * (uRimK * rim);' +
    ' float h = -vP.y; float s = length(n.xz) / max(abs(n.y), 0.05);' +
    ' if (uStep > 0.0) { float f = h / uStep; float d = abs(fract(f + 0.5) - 0.5) * uStep;' +
    '   float major = 1.0 - step(0.5, abs(mod(floor(f + 0.5), 5.0)));' +
    '   float w = uCW * (1.0 + 0.9 * major); float dh = d / max(s, 0.03);' +
    '   float a = (1.0 - smoothstep(w * 0.5, w * 0.5 + 0.7, dh)) * step(0.5 * uStep, h);' +
    '   col = mix(col, uLine, a * (0.55 + 0.35 * major)); }' +
    ' if (uWire > 0.5) { vec2 g = (vP.xz - uOrigin) / uCell; vec2 dg = abs(fract(g + 0.5) - 0.5) * uCell;' +
    '   float a = 1.0 - smoothstep(uGW * 0.5, uGW * 0.5 + 0.6, min(dg.x, dg.y)); col = mix(col, ramp, a); }' +
    ' if (uCutW > 0.0) { float a = 1.0 - smoothstep(uCutW * 0.5, uCutW * 0.5 + 0.8, abs(vP.x - uCutX)); col = mix(col, uCut, a); }' +
    ' gl_FragColor = vec4(col, 1.0); }';

  const rgb = (p, c) => { c = p.color(c); return [p.red(c) / 255, p.green(c) / 255, p.blue(c) / 255]; };
  const mixC = (p, a, b, u) => p.lerpColor(p.color(a), p.color(b), u);
  const norm = (v) => { const l = Math.hypot(...v); return v.map((x) => x / l); };

  /* ---- data: a plain matrix (array of rows) or {cols, rows, values}; null -> seeded synthetic terrain ---- */
  function toMatrix(d) {
    if (!d) return null;
    if (Array.isArray(d)) return d.map((r) => Array.from(r, Number));
    if (d.values) { const m = []; for (let r = 0; r < d.rows; r++) m.push(Array.from(d.values.slice(r * d.cols, (r + 1) * d.cols), Number)); return m; }
    return null;
  }
  function synth(cols, rows, seed, range) {
    const rng = mulberry32(seed), K = 7, bumps = [];
    for (let k = 0; k < K; k++) bumps.push({ x: 0.1 + 0.8 * rng(), y: 0.1 + 0.8 * rng(), s: 0.07 + 0.16 * rng(), a: (k === 0 ? 1 : 0.25 + 0.6 * rng()) * (k === 5 ? -0.5 : 1) });
    const ph = [rng() * 6.283, rng() * 6.283], G = 9, lat = [];
    for (let i = 0; i < G * G; i++) lat.push(rng());
    const vn = (u, v) => {   // bilinear value noise on a 9x9 lattice
      const x = u * (G - 1), y = v * (G - 1), i = Math.min(G - 2, Math.floor(x)), j = Math.min(G - 2, Math.floor(y)), fx = smooth(x - i), fy = smooth(y - j);
      return lerp(lerp(lat[j * G + i], lat[j * G + i + 1], fx), lerp(lat[(j + 1) * G + i], lat[(j + 1) * G + i + 1], fx), fy);
    };
    const m = [];
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        const u = c / (cols - 1), v = r / (rows - 1); let z = 0.12;
        for (const b of bumps) z += b.a * Math.exp(-((u - b.x) ** 2 + ((v - b.y) * 1.3) ** 2) / (2 * b.s * b.s));
        z += 0.10 * Math.sin(u * 9 + ph[0]) * Math.cos(v * 7 + ph[1]) + 0.22 * (vn(u, v) - 0.5);
        row.push(z);
      }
      m.push(row);
    }
    let lo = Infinity, hi = -Infinity; for (const row of m) for (const z of row) { lo = Math.min(lo, z); hi = Math.max(hi, z); }
    return m.map((row) => row.map((z) => +(range[0] + (range[1] - range[0]) * (z - lo) / (hi - lo)).toFixed(3)));
  }

  /* ---- the mesh: vertices at cell centres, y = -height (p5 y is down), normals by central differences ---- */
  function buildMesh(p, st, params) {
    const M = st.M, rows = M.length, cols = M[0].length, XW = params.size, cell = XW / (cols - 1), ZD = cell * (rows - 1);
    const x0 = -XW / 2, z0 = -ZD / 2, H = params.hscale, vmin = st.vmin, span = st.vmax - st.vmin || 1;
    const C = st.CM, cmin = st.cmin, cspan = st.cmax - st.cmin || 1;
    const hgt = new Float32Array(rows * cols);
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) hgt[r * cols + c] = H * clamp((M[r][c] - vmin) / span);
    const g = new p5.Geometry(1, 1, undefined, p._renderer);
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      g.vertices.push(new p5.Vector(x0 + c * cell, -hgt[i], z0 + r * cell));
      const hx = (hgt[r * cols + Math.min(cols - 1, c + 1)] - hgt[r * cols + Math.max(0, c - 1)]) / (cell * ((c > 0 && c < cols - 1) ? 2 : 1));
      const hz = (hgt[Math.min(rows - 1, r + 1) * cols + c] - hgt[Math.max(0, r - 1) * cols + c]) / (cell * ((r > 0 && r < rows - 1) ? 2 : 1));
      const n = norm([-hx, -1, -hz]); g.vertexNormals.push(new p5.Vector(n[0], n[1], n[2]));
      g.vertexColors.push(clamp((C[r][c] - cmin) / cspan), 0, 0, 1);
    }
    for (let r = 0; r < rows - 1; r++) for (let c = 0; c < cols - 1; c++) {
      const a = r * cols + c, b = a + 1, d = a + cols, e = d + 1;
      g.faces.push([a, d, b], [b, d, e]);
    }
    let imax = 0; for (let i = 1; i < rows * cols; i++) if (M[Math.floor(i / cols)][i % cols] > M[Math.floor(imax / cols)][imax % cols]) imax = i;
    Object.assign(st, { g, rows, cols, N: rows * cols, cell, XW, ZD, x0, z0, hgt, imax, tris: g.faces.length });
  }

  /* ---- faces: pack face if vendored (arsenal/fonts/fonts.js keys 'Family|weight'), else the same family at another
     weight, else Big Shoulders Display|600 / IBM Plex Mono|400. The substitution is reported in state.fontNote. ---- */
  const FONTCACHE = new WeakMap();
  async function faces(p, tk, given) {
    if (given && given.disp && given.mono) return { disp: given.disp, mono: given.mono, note: 'host fonts' };
    const lib = window.ARSENAL_FONTS || {}, keys = Object.keys(lib);
    const pick = (role, dflt) => {
      const f = tk.type && tk.type[role]; if (!f) return [dflt, 'no role'];
      const k = f.family + '|' + f.weight; if (lib[k]) return [k, null];
      const same = keys.find((x) => x.split('|')[0] === f.family); if (same) return [same, k + ' -> ' + same];
      return [dflt, k + ' -> ' + dflt];
    };
    const [dk, dn] = pick('disp', 'Big Shoulders Display|600'), [mk, mn] = pick('mono', 'IBM Plex Mono|400');
    let cache = FONTCACHE.get(p); if (!cache) { cache = {}; FONTCACHE.set(p, cache); }
    const load = async (k) => { if (!lib[k]) return null; if (!cache[k]) cache[k] = p.loadFont(lib[k]); return cache[k]; };
    return { disp: await load(dk), mono: await load(mk), note: [dn, mn].filter(Boolean).join('; ') || 'pack faces' };
  }

  /* ---- time -> state (all derived, never stored) ---- */
  function revealRows(u, st, params) { if (!params.reveal) return st.rows; return Math.max(1, Math.round(st.rows * smooth((u - params.reveal[0]) / (params.reveal[1] - params.reveal[0])))); }
  function cutAt(u, st, params) {
    if (!params.cut || params.cutMode === 'off') return null;
    const a = (u - params.cut[0]) / (params.cut[1] - params.cut[0]); if (a < 0) return null;
    const col = Math.round(lerp(params.cutMargin, st.cols - 1 - params.cutMargin, smooth(a)));   // snapped: the profile is a real column, never interpolated
    const prof = []; let pk = 0;
    for (let r = 0; r < st.rows; r++) { prof.push(st.M[r][col]); if (st.M[r][col] > st.M[pk][col]) pk = r; }
    return { col, x: st.x0 + col * st.cell, prof, pk };
  }
  function keyed(arr, u) {   // evenly spaced keys over [0,1], eased per segment
    if (!Array.isArray(arr)) return arr; if (arr.length === 1) return arr[0];
    const s = clamp(u) * (arr.length - 1), i = Math.min(arr.length - 2, Math.floor(s));
    return lerp(arr[i], arr[i + 1], smooth(s - i));
  }
  function camAt(u, st, params, cut) {
    const cu = clamp((u - params.camT[0]) / (params.camT[1] - params.camT[0]));
    const az = keyed(params.camAz, cu) * D2R, el = clamp(keyed(params.camEl, cu), 1, 89) * D2R, dist = keyed(params.camDist, cu) * st.XW;
    const fx = params.camLook === 'cut' && cut ? cut.x * params.follow : 0;
    const look = [fx, -params.hscale * 0.35, 0];
    const eye = [look[0] + dist * Math.cos(el) * Math.sin(az), look[1] - dist * Math.sin(el), look[2] + dist * Math.cos(el) * Math.cos(az)];
    return { eye, look, az: az / D2R, el: el / D2R };
  }
  const valStr = (v, params) => v.toFixed(params.dp) + (params.unit || '');

  function terrain(p, st, tk, params, cut, revZ) {
    const sh = st.sh, c = tk.color, R = params.ramp.map((role) => rgb(p, c[role]));
    p.shader(sh); p.noStroke(); p.fill(255);   // fill state persists across draws: a noFill() left by the last frame would skip the mesh
    sh.setUniform('uR0', R[0]); sh.setUniform('uR1', R[1]); sh.setUniform('uR2', R[2]);
    sh.setUniform('uFill', rgb(p, mixC(p, c.bg, c.panel, 0.7)));
    sh.setUniform('uLine', rgb(p, params.wire ? c.accent : c[params.contourRole]));
    sh.setUniform('uCut', rgb(p, c.accent2)); sh.setUniform('uRim', rgb(p, c.chalk));
    sh.setUniform('uKeyDir', norm([-0.5, 0.75, -0.35])); sh.setUniform('uAmb', params.amb); sh.setUniform('uKey', params.key); sh.setUniform('uRimK', params.rim);
    sh.setUniform('uStep', params.contours > 0 ? params.hscale / params.contours : 0); sh.setUniform('uCW', params.contourW);
    sh.setUniform('uWire', params.wire ? 1 : 0); sh.setUniform('uCell', st.cell); sh.setUniform('uGW', params.gridW); sh.setUniform('uOrigin', [st.x0, st.z0]);
    sh.setUniform('uCutX', cut ? cut.x : -1e6); sh.setUniform('uCutW', cut && params.cutMode === 'band' ? params.cutW : 0);
    sh.setUniform('uClipX', cut && params.cutMode === 'section' ? cut.x - 0.02 : -1e6); sh.setUniform('uRevZ', revZ);
    p.model(st.g); p.resetShader();
  }

  function section3d(p, st, tk, params, cut, rowsShown) {
    const c = tk.color, x = cut.x, n = Math.min(rowsShown, st.rows), slab = params.slab;
    if (params.cutMode === 'section') {   // the cut face: profile down to the slab floor, flat in accent2
      p.noStroke(); p.fill(mixC(p, c.bg, c.accent2, 0.85));
      p.beginShape(p.TRIANGLE_STRIP);
      for (let r = 0; r < n; r++) { const z = st.z0 + r * st.cell, h = st.hgt[r * st.cols + cut.col]; p.vertex(x - 0.05, -h, z); p.vertex(x - 0.05, slab, z); }
      p.endShape();
      p.noFill(); p.stroke(c.chalk); p.strokeWeight(2);
      p.beginShape(); for (let r = 0; r < n; r++) p.vertex(x - 0.3, -st.hgt[r * st.cols + cut.col], st.z0 + r * st.cell); p.endShape();
    } else {   // band mode: a faint vertical plane through the cut
      const pl = p.color(c.ink); pl.setAlpha(255 * 0.07); p.noStroke(); p.fill(pl);
      p.beginShape(p.TRIANGLE_STRIP);
      p.vertex(x, 0, st.z0); p.vertex(x, -params.hscale * 1.15, st.z0); p.vertex(x, 0, st.z0 + (n - 1) * st.cell); p.vertex(x, -params.hscale * 1.15, st.z0 + (n - 1) * st.cell);
      p.endShape();
    }
  }

  /* ---- flat layer: pins, the count, the 2D profile; drawn after the camera is released ---- */
  function txtFn(p, ox, oy) {
    return (s, x, y, size, col, font, al, op) => {
      const k = p.color(col); k.setAlpha(255 * (op == null ? 1 : op)); p.noStroke(); p.fill(k); p.textFont(font); p.textSize(size);
      p.textAlign(al || p.LEFT, p.BASELINE); const R = al === p.RIGHT; p.text(s, x + ox - (R ? 2000 : 0), y + oy, 2000);
    };
  }
  function flat(p, st, tk, params, pts, cut, rowsShown, cam) {
    const W = p.width, H = p.height, ox = -W / 2, oy = -H / 2, f = st.fonts, c = tk.color;
    p.push(); p.resetMatrix(); p.noLights(); p.setCamera(st.hud); p.drawingContext.clear(p.drawingContext.DEPTH_BUFFER_BIT);
    if (!f.disp || !f.mono) { p.pop(); return; }
    const txt = txtFn(p, ox, oy);
    for (const q of pts) {
      if (q.op <= 0.01 || q.x < 30 || q.x > W - 30 || q.y < 50 || q.y > H - 40) continue;
      const lx = q.x + (q.dx || 26), ly = q.y - 40 + (q.dy || 0), k = p.color(q.col); k.setAlpha(255 * q.op);
      p.stroke(k); p.strokeWeight(1.5); p.line(q.x + ox, q.y + oy, lx + ox, ly + oy);
      p.noStroke(); p.fill(k); p.circle(q.x + ox, q.y + oy, 7);
      txt(q.big, lx + 4, ly - 5, 24, q.col, f.disp, p.LEFT, q.op); txt(q.small, lx + 5, ly + 12, 12, c.muted, f.mono, p.LEFT, q.op);
    }
    if (params.hud) {   // count before ratio: the cells shown, of the matrix
      const shown = rowsShown * st.cols;
      txt(fmtInt(shown), 36, H - 66, 64, c.ink, f.disp, p.LEFT, 1);
      const cs = params.contours > 0 ? ' · CONTOUR EVERY ' + valStr((st.vmax - st.vmin) / params.contours, params) : '';
      txt('CELLS OF ' + fmtInt(st.N) + ' · ' + st.cols + ' × ' + st.rows + ' MATRIX' + cs, 38, H - 40, 12, c.muted, f.mono, p.LEFT, 1);
      txt((params.wire ? 'WIREFRAME' : cut && params.cutMode === 'section' ? 'SECTION CUT' : 'LIT TERRAIN') + (cut ? ' · CUT AT COL ' + (cut.col + 1) + ' OF ' + st.cols : ''), W - 36, 40, 12, c.muted, f.mono, p.RIGHT, 1);
    }
    if (cut && params.profile) profile2d(p, st, tk, params, cut, rowsShown, txt, ox, oy);
    p.pop();
  }

  function profile2d(p, st, tk, params, cut, rowsShown, txt, ox, oy) {
    const c = tk.color, f = st.fonts, P = params.profileBox, x0 = P[0], y0 = P[1], w = P[2], h = P[3];
    const pad = [44, 24, 16, 30], gx = x0 + pad[0], gy = y0 + pad[1], gw = w - pad[0] - pad[2], gh = h - pad[1] - pad[3];
    const bgc = p.color(c.panel); bgc.setAlpha(235); p.noStroke(); p.fill(bgc); p.rect(x0 + ox, y0 + oy, w, h);
    const X = (r) => gx + gw * r / (st.rows - 1), Y = (v) => gy + gh * (1 - clamp((v - st.vmin) / (st.vmax - st.vmin || 1)));
    p.stroke(c.muted); p.strokeWeight(1); p.line(gx + ox, gy + gh + oy, gx + gw + ox, gy + gh + oy); p.line(gx + ox, gy + oy, gx + ox, gy + gh + oy);
    const mx = p.color(c.ink); mx.setAlpha(90); p.stroke(mx); p.line(gx + ox, Y(st.vmax) + oy, gx + gw + ox, Y(st.vmax) + oy);   // the matrix max, for scale
    const n = Math.min(rowsShown, st.rows), fillc = p.color(c.accent2); fillc.setAlpha(70);
    p.noStroke(); p.fill(fillc); p.beginShape(p.TRIANGLE_STRIP);
    for (let r = 0; r < n; r++) { p.vertex(X(r) + ox, Y(cut.prof[r]) + oy); p.vertex(X(r) + ox, gy + gh + oy); }
    p.endShape();
    p.noFill(); p.stroke(c.accent2); p.strokeWeight(2); p.beginShape(); for (let r = 0; r < n; r++) p.vertex(X(r) + ox, Y(cut.prof[r]) + oy); p.endShape();
    if (cut.pk < n) { p.noStroke(); p.fill(c.accent2); p.circle(X(cut.pk) + ox, Y(cut.prof[cut.pk]) + oy, 8);
      txt(valStr(cut.prof[cut.pk], params), X(cut.pk) + 8, Y(cut.prof[cut.pk]) - 6, 20, c.ink, f.disp, p.LEFT, 1); }
    txt('SECTION · COL ' + (cut.col + 1) + ' OF ' + st.cols, x0 + 12, y0 + 16, 11, c.muted, f.mono, p.LEFT, 1);
    txt(valStr(st.vmax, params), gx - 6, Y(st.vmax) + 4, 11, c.muted, f.mono, p.RIGHT, 1);
    txt(valStr(st.vmin, params), gx - 6, gy + gh + 4, 11, c.muted, f.mono, p.RIGHT, 1);
    txt('ROW 1', gx, gy + gh + 18, 11, c.muted, f.mono, p.LEFT, 1); txt('ROW ' + st.rows, gx + gw, gy + gh + 18, 11, c.muted, f.mono, p.RIGHT, 1);
  }

  A.patterns['gl-heightfield'] = {
    id: 'gl-heightfield', atlas: ['webgl-mode', 'build-geometry', 'p5-strands', 'lights-and-materials', 'world-to-screen', 'camera-slerp', 'camera-choreography', 'gpu-instancing', 'frontier-2026', 'derived-geometry'],
    renderer: 'webgl',
    params: {
      data: null, colorData: null, cols: 80, rows: 50, synthRange: [0, 100], vmin: null, vmax: null, dp: 1, unit: '',
      dur: 12, size: 760, hscale: 170, slab: 14,
      wire: false, gridW: 1.1, contours: 10, contourW: 1.1, contourRole: 'chalk', ramp: ['panel', 'muted', 'accent'], amb: 0.42, key: 0.72, rim: 0.10,
      reveal: [0.02, 0.28], cut: [0.32, 0.92], cutMode: 'band', cutW: 2.4, cutMargin: 1, profile: false, profileBox: [560, 330, 370, 170],
      camT: [0, 1], camAz: [-38, 8, 42], camEl: [40, 30, 26], camDist: [1.45, 1.25, 1.12], camLook: 'centre', follow: 0.6, fov: 0.78,
      pins: true, hud: true,
    },
    variants: [
      { name: 'wire-40x25', params: { cols: 40, rows: 25, wire: true, contours: 0, cut: null, gridW: 1.4, camAz: [32, -6, -34], camEl: [42, 34], camDist: [1.4, 1.2], reveal: [0.02, 0.45] } },
      { name: 'lit-200x120', params: { cols: 200, rows: 120, contours: 12, contourW: 0.9, cutW: 2.0 } },
      { name: 'section-120x80', params: { cols: 120, rows: 80, cutMode: 'section', profile: true, contours: 8, reveal: [0.0, 0.2], cut: [0.24, 0.94], cutMargin: 4,
        camAz: [-62, -54, -46], camEl: [30, 24, 22], camDist: [1.3, 1.1, 1.0], camLook: 'cut', follow: 0.55 } },
      { name: 'plan-80x50', params: { cols: 80, rows: 50, contours: 10, cut: null, reveal: null, camT: [0.12, 0.8], camAz: [0, 0, 24], camEl: [89, 60, 34], camDist: [1.5, 1.3, 1.15] } },
    ],
    setup: async function (p, ctx, params) {
      const seed = ctx.seed == null ? 7 : ctx.seed, tk = ctx.tokens || A.brands['ceti-dark'];
      const st = { seed };
      st.M = toMatrix(params.data) || synth(params.cols, params.rows, seed, params.synthRange);
      st.CM = toMatrix(params.colorData) || st.M;
      let lo = Infinity, hi = -Infinity, clo = Infinity, chi = -Infinity;
      for (const row of st.M) for (const v of row) { lo = Math.min(lo, v); hi = Math.max(hi, v); }
      for (const row of st.CM) for (const v of row) { clo = Math.min(clo, v); chi = Math.max(chi, v); }
      st.vmin = params.vmin == null ? lo : params.vmin; st.vmax = params.vmax == null ? hi : params.vmax; st.cmin = clo; st.cmax = chi;
      buildMesh(p, st, params);
      st.sh = p.createShader(VERT, FRAG); st.work = p.createCamera(); st.hud = p.createCamera();   // hud = p5's default camera: 1 unit = 1 css px at z = 0
      st.fonts = await faces(p, tk, ctx.fonts); st.fontNote = st.fonts.note;
      return st;
    },
    /* how many marks are shown at t (for a film's caption): cells = cols x rows revealed */
    count(t, st, params) {
      const u = clamp(t / params.dur), rows = revealRows(u, st, params), cut = cutAt(u, st, params);
      return { cells: rows * st.cols, of: st.N, rows, cols: st.cols, contours: params.contours, cutCol: cut ? cut.col + 1 : null, cutPeak: cut ? st.M[cut.pk][cut.col] : null };
    },
    draw(p, t, st, params, tk) {
      const u = clamp(t / params.dur), c = tk.color;
      p.push();   // style state (fill, stroke, shader) never leaks into the next seek
      p.background(c.bg); p.drawingContext.clear(p.drawingContext.DEPTH_BUFFER_BIT);   // a host may not clear depth between seeks
      const rowsShown = revealRows(u, st, params), cut = cutAt(u, st, params), cam = camAt(u, st, params, cut), w = st.work;
      w.camera(cam.eye[0], cam.eye[1], cam.eye[2], cam.look[0], cam.look[1], cam.look[2], 0, 1, 0);
      w.perspective(params.fov, p.width / p.height, 5, 8000);
      p.setCamera(w); p.noLights();
      const revZ = rowsShown >= st.rows ? 1e6 : st.z0 + (rowsShown - 0.5) * st.cell;
      terrain(p, st, tk, params, cut, revZ);
      if (cut) section3d(p, st, tk, params, cut, rowsShown);
      // pins: on the matrix maximum and on the cut's peak (screen points taken while the camera is set)
      const pts = [];
      if (params.pins) {
        const ri = Math.floor(st.imax / st.cols), ci = st.imax % st.cols;
        const shown = ri < rowsShown, away = cut && params.cutMode === 'section' && ci < cut.col;
        const op = shown ? (away ? 0.35 : 1) * clamp((u - (params.reveal ? params.reveal[1] : 0)) / 0.06 + 1) : 0;
        const v = p.worldToScreen(new p5.Vector(st.x0 + ci * st.cell, -st.hgt[st.imax], st.z0 + ri * st.cell));
        pts.push({ x: v.x, y: v.y, op, col: c.accent, big: valStr(st.M[ri][ci], params), small: 'MAX · ROW ' + (ri + 1) + ', COL ' + (ci + 1) + (away ? ' · CUT AWAY' : '') });
        if (cut && cut.pk < rowsShown) {
          const q = p.worldToScreen(new p5.Vector(cut.x, -st.hgt[cut.pk * st.cols + cut.col], st.z0 + cut.pk * st.cell));
          const same = cut.pk === ri && cut.col === ci;
          pts.push({ x: q.x, y: q.y, op: same ? 0 : 1, col: c.accent2, dx: -150, dy: -18, big: valStr(st.M[cut.pk][cut.col], params), small: 'PEAK ON CUT · ROW ' + (cut.pk + 1) });
        }
      }
      flat(p, st, tk, params, pts, cut, rowsShown, cam);
      p.pop();
      return { cells: rowsShown * st.cols, of: st.N, cut: cut ? cut.col + 1 : null, az: +cam.az.toFixed(1), el: +cam.el.toFixed(1) };
    },
  };
})();
