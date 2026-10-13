/* arsenal/patterns/gl-volume · a distribution as a cloud of counted cells (renderer: webgl)
   data (samples or a binned 1D/2D/3D histogram) -> cells with exact integer counts -> transparent slabs or cubes,
   sorted back to front for the current camera every frame (distance to the eye, ties by cell index: deterministic),
   faces inside each box ordered back faces first, all in ONE drawArrays on raw GL (p._renderer.GL) with a tiny
   unlit shader (per-face Lambert precomputed in JS from token roles). A cut plane travels on t and is drawn in the
   sorted stream (cells behind it, the plane, cells in front); the slice it cuts is drawn flat as a 2D histogram with
   the pack's faces. Cells beyond a tail threshold light in accent. draw(t) is pure of t; seeds only in setup. */
(function () {
  const A = (window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} });
  function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const smooth = (x) => { x = clamp(x); return x * x * x * (x * (x * 6 - 15) + 10); };
  const lerp = (a, b, u) => a + (b - a) * u;
  const fmt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const win = (u, w) => smooth((u - w[0]) / (w[1] - w[0]));
  const AX = ['X', 'Y', 'Z'];

  /* ---------- data: seeded demo samples, binning, counts ---------- */
  function gauss(rng) { const u = 1 - rng(), v = rng(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.283185307 * v); }
  // a body plus a skewed lobe toward +x (+y +z): the tail the module is built to show
  function demoSamples(D, n, seed, tailFrac) {
    const rng = mulberry32(seed), out = [];
    for (let m = 0; m < n; m++) {
      const g1 = gauss(rng), g2 = gauss(rng), g3 = gauss(rng), lobe = rng() < tailFrac;
      let x, y, z;
      if (!lobe) { x = g1; y = 0.55 * g1 + 0.83 * g2; z = 0.9 * g3; }
      else { const s = 1.4 + 1.5 * Math.exp(0.42 * gauss(rng)); x = 0.85 * s + 0.35 * g1; y = 0.5 * s + 0.45 * g2; z = 0.35 * s + 0.5 * g3; }
      out.push(D === 1 ? x : D === 2 ? [x, z] : [x, y, z]);
    }
    return out;
  }
  function depthOf(a) { let d = 0; while (Array.isArray(a)) { d++; a = a[0]; } return d; }
  // -> { D, n:[nx,ny,nz], counts:Int32Array, total, range:[[lo,hi]...], outside, kind }
  function binData(data, params, seed) {
    let kind = params.dataKind, D, n, counts, total = 0, outside = 0, range;
    if (data == null) { data = demoSamples(params.dims, params.n, seed, params.tailFrac); kind = 'samples'; }
    if (kind === 'counts') {
      D = depthOf(data); n = [data.length, D > 1 ? data[0].length : 1, D > 2 ? data[0][0].length : 1];
      counts = new Int32Array(n[0] * n[1] * n[2]);
      for (let i = 0; i < n[0]; i++) for (let j = 0; j < n[1]; j++) for (let k = 0; k < n[2]; k++) {
        const c = Math.max(0, Math.round(D === 1 ? data[i] : D === 2 ? data[i][j] : data[i][j][k]));
        counts[i + n[0] * (j + n[1] * k)] = c; total += c;
      }
      range = params.range || n.slice(0, D).map((m) => [0, m]);
    } else {
      D = typeof data[0] === 'number' ? 1 : data[0].length;
      n = [0, 1, 2].map((a) => (a < D ? params.bins[a] : 1));
      range = params.range ? params.range.slice(0, D) : null;
      if (!range) {   // min/max of the data, per axis
        range = []; for (let a = 0; a < D; a++) { let lo = Infinity, hi = -Infinity; for (const s of data) { const v = D === 1 ? s : s[a]; if (v < lo) lo = v; if (v > hi) hi = v; } range.push([lo, hi]); }
      }
      counts = new Int32Array(n[0] * n[1] * n[2]);
      for (const s of data) {
        const ix = [0, 0, 0]; let ok = true;
        for (let a = 0; a < D; a++) {
          const v = D === 1 ? s : s[a], f = (v - range[a][0]) / (range[a][1] - range[a][0]);
          if (!(f >= 0 && f <= 1)) { ok = false; break; }
          ix[a] = Math.min(n[a] - 1, Math.floor(f * n[a]));
        }
        if (!ok) { outside++; continue; }
        counts[ix[0] + n[0] * (ix[1] + n[1] * ix[2])]++; total++;
      }
    }
    return { D, n, counts, total, range, outside, kind };
  }

  /* ---------- world layout: one mark per occupied cell ---------- */
  function layout(st, params) {
    const G = st.grid, D = G.D, n = G.n, S = params.size, max = Math.max(1, ...G.counts);
    const cw = [S[0] / n[0], D === 3 ? S[1] / n[1] : S[1], D === 1 ? S[2] : S[2] / (D === 2 ? n[1] : n[2])];
    const marks = [];
    for (let k = 0; k < n[2]; k++) for (let j = 0; j < n[1]; j++) for (let i = 0; i < n[0]; i++) {
      const id = i + n[0] * (j + n[1] * k), c = G.counts[id]; if (c <= 0) continue;
      const f = c / max, x = -S[0] / 2 + (i + 0.5) * cw[0];
      let m;
      if (D === 3) {
        const s = lerp(params.cubeMin, params.cubeMax, Math.cbrt(f));
        m = { cx: x, cy: -(j + 0.5) * cw[1], cz: -S[2] / 2 + (k + 0.5) * cw[2], hx: cw[0] * s / 2, hy: cw[1] * s / 2, hz: cw[2] * s / 2,
          a: lerp(params.alpha[0], params.alpha[1], Math.sqrt(f)) };
      } else {
        const h = S[1] * f, z = D === 1 ? 0 : -S[2] / 2 + (j + 0.5) * cw[2];
        m = { cx: x, cy: -h / 2, cz: z, hx: cw[0] * (1 - params.gap) / 2, hy: h / 2, hz: (D === 1 ? cw[2] : cw[2] * (1 - params.gap)) / 2, a: params.alpha[1] };
      }
      Object.assign(m, { id, i, j, k, c, f });
      marks.push(m);
    }
    // tail: per cell, from the data coordinate of the cell (x lower edge vs a bin-edge-snapped threshold, or centre radius)
    const lo = (a) => G.range[a][0], bw = (a) => (G.range[a][1] - G.range[a][0]) / n[a];
    let tau = params.tail;
    if (params.tailAxis === 'x') tau = lo(0) + Math.round((params.tail - lo(0)) / bw(0)) * bw(0);   // snapped: lit cells sum == exact samples beyond
    let tailCells = 0, tailSamples = 0;
    for (const m of marks) {
      const cen = [lo(0) + (m.i + 0.5) * bw(0), D > 1 ? lo(1) + ((D === 2 ? m.j : m.j) + 0.5) * bw(1) : 0, D > 2 ? lo(2) + (m.k + 0.5) * bw(2) : 0];
      m.tail = params.tailAxis === 'x' ? lo(0) + m.i * bw(0) >= tau - 1e-9
        : Math.hypot(cen[0] - params.tailCenter[0], cen[1] - params.tailCenter[1], cen[2] - params.tailCenter[2]) > tau;
      if (m.tail) { tailCells++; tailSamples += m.c; }
    }
    // reveal order: D=3 densest first (count desc, then id); D<3 left to right
    const order = marks.map((m, q) => q).sort((a, b) => (D === 3 ? marks[b].c - marks[a].c : marks[a].i - marks[b].i) || marks[a].id - marks[b].id);
    order.forEach((q, r) => (marks[q].rank = r));
    let peak = marks[0]; for (const m of marks) if (m.c > peak.c) peak = m;
    Object.assign(st, { marks, max, cw, tau, tailCells, tailSamples, peak });
  }

  /* ---------- raw GL: one program, one dynamic buffer ---------- */
  const VS = 'precision highp float; attribute vec3 aP; attribute vec4 aC; uniform mat4 uV; uniform mat4 uP; varying vec4 vC;' +
    'void main(){ vC = aC; gl_Position = uP * uV * vec4(aP, 1.0); }';
  const FS = 'precision mediump float; varying vec4 vC; void main(){ gl_FragColor = vC; }';
  function glInit(p, st) {
    const gl = p._renderer.GL, sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
    const prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    st.gl = { gl, prog, buf: gl.createBuffer(), aP: gl.getAttribLocation(prog, 'aP'), aC: gl.getAttribLocation(prog, 'aC'),
      uV: gl.getUniformLocation(prog, 'uV'), uP: gl.getUniformLocation(prog, 'uP'), data: new Float32Array((st.marks.length + 1) * 36 * 7) };
  }
  // faces of an axis box: normal, and the 4 corners (sign patterns)
  const FACES = [
    { n: [1, 0, 0], c: [[1, -1, -1], [1, 1, -1], [1, 1, 1], [1, -1, 1]] }, { n: [-1, 0, 0], c: [[-1, -1, -1], [-1, -1, 1], [-1, 1, 1], [-1, 1, -1]] },
    { n: [0, 1, 0], c: [[-1, 1, -1], [-1, 1, 1], [1, 1, 1], [1, 1, -1]] }, { n: [0, -1, 0], c: [[-1, -1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1]] },
    { n: [0, 0, 1], c: [[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]] }, { n: [0, 0, -1], c: [[-1, -1, -1], [-1, 1, -1], [1, 1, -1], [1, -1, -1]] }];
  const KEY = (() => { const v = [-0.45, 0.8, -0.4], l = Math.hypot(...v); return v.map((x) => x / l); })();   // p5 y is down: light from above-left-front
  const RIM = (() => { const v = [0.7, 0.3, 0.6], l = Math.hypot(...v); return v.map((x) => x / l); })();
  function shade(L, rgb, nrm) {
    const k = Math.max(0, -(nrm[0] * KEY[0] + nrm[1] * KEY[1] + nrm[2] * KEY[2])), r = Math.max(0, -(nrm[0] * RIM[0] + nrm[1] * RIM[1] + nrm[2] * RIM[2]));
    return [0, 1, 2].map((c) => Math.min(1, rgb[c] * (L.amb[c] + L.key[c] * k) + L.rim[c] * r * 0.35));
  }
  function pushBox(buf, o, L, eye, b, rgb, a) {
    // back faces first (seen through the front), then front faces: correct inside one convex box
    for (let pass = 0; pass < 2; pass++) for (const F of FACES) {
      const fc = [b.x + F.n[0] * b.hx, b.y + F.n[1] * b.hy, b.z + F.n[2] * b.hz];
      const front = F.n[0] * (eye[0] - fc[0]) + F.n[1] * (eye[1] - fc[1]) + F.n[2] * (eye[2] - fc[2]) > 0;
      if (front !== (pass === 1)) continue;
      const nrm = front ? F.n : F.n.map((x) => -x), col = shade(L, rgb, nrm), al = front ? a : a * 0.55;
      for (const q of [0, 1, 2, 0, 2, 3]) {
        const s = F.c[q];
        buf[o++] = b.x + s[0] * b.hx; buf[o++] = b.y + s[1] * b.hy; buf[o++] = b.z + s[2] * b.hz;
        buf[o++] = col[0]; buf[o++] = col[1]; buf[o++] = col[2]; buf[o++] = al;
      }
    }
    return o;
  }
  function pushQuad(buf, o, pts, rgb, a) { for (const q of [0, 1, 2, 0, 2, 3]) { const s = pts[q]; buf[o++] = s[0]; buf[o++] = s[1]; buf[o++] = s[2]; buf[o++] = rgb[0]; buf[o++] = rgb[1]; buf[o++] = rgb[2]; buf[o++] = a; } return o; }
  function glDraw(p, st, cam, nFloats) {
    const G = st.gl, gl = G.gl, reg = p._renderer.registerEnabled;
    const save = { prog: gl.getParameter(gl.CURRENT_PROGRAM), ab: gl.getParameter(gl.ARRAY_BUFFER_BINDING), blend: gl.isEnabled(gl.BLEND), cull: gl.isEnabled(gl.CULL_FACE),
      sR: gl.getParameter(gl.BLEND_SRC_RGB), dR: gl.getParameter(gl.BLEND_DST_RGB), sA: gl.getParameter(gl.BLEND_SRC_ALPHA), dA: gl.getParameter(gl.BLEND_DST_ALPHA),
      eqR: gl.getParameter(gl.BLEND_EQUATION_RGB), eqA: gl.getParameter(gl.BLEND_EQUATION_ALPHA), mask: gl.getParameter(gl.DEPTH_WRITEMASK) };
    gl.useProgram(G.prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, G.buf); gl.bufferData(gl.ARRAY_BUFFER, G.data.subarray(0, nFloats), gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(G.aP); gl.vertexAttribPointer(G.aP, 3, gl.FLOAT, false, 28, 0);
    gl.enableVertexAttribArray(G.aC); gl.vertexAttribPointer(G.aC, 4, gl.FLOAT, false, 28, 12);
    gl.uniformMatrix4fv(G.uV, false, cam.cameraMatrix.mat4 || cam.cameraMatrix.matrix);
    gl.uniformMatrix4fv(G.uP, false, cam.projMatrix.mat4 || cam.projMatrix.matrix);
    gl.enable(gl.BLEND); gl.blendEquation(gl.FUNC_ADD); gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.disable(gl.CULL_FACE); gl.depthMask(false);
    gl.drawArrays(gl.TRIANGLES, 0, nFloats / 7);
    // restore what p5 caches: program, buffer, blend, depth mask, attribute enables it does not know about
    gl.depthMask(save.mask); if (save.cull) gl.enable(gl.CULL_FACE); if (!save.blend) gl.disable(gl.BLEND);
    gl.blendEquationSeparate(save.eqR, save.eqA); gl.blendFuncSeparate(save.sR, save.dR, save.sA, save.dA);
    for (const l of [G.aP, G.aC]) if (!reg.has(l)) gl.disableVertexAttribArray(l);
    gl.bindBuffer(gl.ARRAY_BUFFER, save.ab); gl.useProgram(save.prog);
  }

  /* ---------- fonts: the pack's faces from arsenal/fonts/fonts.js (TTF data URLs), cached ---------- */
  const FONTS = {};
  function faceKey(tk, role) { const f = tk.type[role]; return f.family + '|' + f.weight; }
  async function font(p, key, fb) {
    const src = window.ARSENAL_FONTS || {}, k = src[key] ? key : fb;
    if (!src[k]) return { f: null, key: k };
    if (!FONTS[k]) FONTS[k] = p.loadFont(src[k]);
    return { f: await FONTS[k], key: k, fell: k !== key };
  }

  /* ---------- camera on t ---------- */
  function cameraAt(st, params, u) {
    const o = params.orbit, a = (lerp(o[0], o[1], smooth(u)) * Math.PI) / 180, e = (lerp(params.elev[0], params.elev[1], smooth(u)) * Math.PI) / 180;
    const c = [params.look[0], params.look[1], params.look[2]], d = params.dist;
    return { eye: [c[0] + d * Math.cos(e) * Math.sin(a), c[1] - d * Math.sin(e), c[2] + d * Math.cos(e) * Math.cos(a)], c };
  }

  /* ---------- the counts a film captions: pure of (t, st, params) ---------- */
  function countAt(st, params, t) {
    const u = clamp(t / params.dur), D = st.grid.D, M = st.marks.length;
    let cells = 0, samples = 0;
    for (const m of st.marks) if (grow(st, params, m, u) > 0) { cells++; samples += m.c; }
    const tailOn = win(u, params.tailIn) > 0, cut = cutAt(st, params, u);
    return { cells, occupied: M, samples, total: st.grid.total, outside: st.grid.outside, tailOn, tailCells: st.tailCells, tailSamples: st.tailSamples, tau: st.tau,
      cutOn: cut.on, slice: cut.slice, slices: cut.slices, sliceSamples: cut.on ? cut.sum : 0, dims: D };
  }
  function grow(st, params, m, u) {   // staggered build: each mark 0 -> 1 inside the build window
    const N = st.marks.length, b = params.build, span = (b[1] - b[0]), w = Math.min(span, span * params.stagger);
    const t0 = b[0] + (span - w) * (N > 1 ? m.rank / (N - 1) : 0);
    return smooth((u - t0) / w);
  }
  function cutAt(st, params, u) {
    const G = st.grid, D = G.D, ax = D === 1 ? 0 : D === 2 ? 1 : 2, nAx = G.n[ax];   // the cut runs along the last data axis (world x for 1D, world z otherwise)
    const on = u >= params.cutIn[0], s = lerp(params.cutFrom, params.cutTo, smooth((u - params.cutIn[0]) / (params.cutIn[1] - params.cutIn[0])));
    const slice = Math.min(nAx - 1, Math.max(0, Math.floor(s * nAx)));
    let sum = 0; const key = (m) => (ax === 0 ? m.i : ax === 1 ? m.j : m.k);
    for (const m of st.marks) if (key(m) === slice) sum += m.c;
    return { on, s, slice, slices: nAx, ax, sum, key };
  }

  /* ---------- flat drawing helpers (after the camera is released) ---------- */
  function flatBegin(p, st) { p.push(); p.resetMatrix(); p.setCamera(st.hud); p.drawingContext.clear(p.drawingContext.DEPTH_BUFFER_BIT); }
  function mkTxt(p, st) {
    const W = p.width, H = p.height, ox = -W / 2, oy = -H / 2;
    return (s, x, y, size, col, role, al, op) => {
      const f = st.fonts[role]; if (!f) return; const c = p.color(col); c.setAlpha(255 * (op == null ? 1 : op));
      p.noStroke(); p.fill(c); p.textFont(f); p.textSize(size); p.textAlign(al || p.LEFT, p.BASELINE);
      const R = al === p.RIGHT, C = al === p.CENTER; p.text(s, x + ox - (R ? 2000 : C ? 1000 : 0), y + oy, 2000);
    };
  }
  function rectF(p, x, y, w, h, col, op) { const W = p.width, H = p.height, c = p.color(col); c.setAlpha(255 * (op == null ? 1 : op)); p.noStroke(); p.fill(c); p.rect(x - W / 2, y - H / 2, w, h); }
  function lineF(p, x0, y0, x1, y1, col, wgt, op) { const W = p.width, H = p.height, c = p.color(col); c.setAlpha(255 * (op == null ? 1 : op)); p.stroke(c); p.strokeWeight(wgt || 1); p.line(x0 - W / 2, y0 - H / 2, x1 - W / 2, y1 - H / 2); }
  const axisVal = (G, a, f) => G.range[a][0] + (G.range[a][1] - G.range[a][0]) * f;
  const num = (v) => (Math.abs(v) >= 100 || Number.isInteger(v) ? fmt(v) : v.toFixed(Math.abs(v) >= 10 ? 1 : 2));

  // the cut, drawn flat: D=3 -> a 2D grid of the slice (x across, y up); D=2 -> the row profile; D=1 -> the whole 1D histogram with the cut line
  function drawInset(p, st, params, tk, txt, cut, op, tailU) {
    const G = st.grid, D = G.D, n = G.n, B = params.inset, x0 = B[0], y0 = B[1], w = B[2], h = B[3];
    rectF(p, x0, y0, w, h, tk.color.panel, 0.92 * op); lineF(p, x0, y0, x0 + w, y0, tk.color.line, 1, op); lineF(p, x0, y0 + h, x0 + w, y0 + h, tk.color.line, 1, op);
    const pad = 16, ax = cut.ax, lo = G.range[ax][0], bw = (G.range[ax][1] - lo) / n[ax];
    const nm = D === 3 ? AX[ax] : D === 2 ? (params.axisNames[1] || 'Z') : (params.axisNames[0] || 'X');
    txt('THE CUT · SLICE ' + (cut.slice + 1) + ' OF ' + cut.slices, x0 + pad, y0 + 24, 12, tk.color.muted, 'mono', p.LEFT, op);
    txt(fmt(cut.sum), x0 + pad, y0 + 64, 34, tk.color.ink, 'disp', p.LEFT, op);
    txt('SAMPLES WITH ' + nm + ' IN [' + num(lo + cut.slice * bw) + ', ' + num(lo + (cut.slice + 1) * bw) + ')', x0 + pad, y0 + 82, 12, tk.color.muted, 'mono', p.LEFT, op);
    const gx = x0 + pad, gy = y0 + 98, gw = w - 2 * pad, gh = h - 98 - 30;
    const inSlice = st.marks.filter((m) => cut.key(m) === cut.slice), mx = Math.max(1, ...inSlice.map((m) => m.c));
    const ink = tk.color.ink, acc = tk.color.accent;
    if (D === 3) {
      const cx = n[0], cy = n[1], cs = Math.floor(Math.min(gw / cx, gh / cy)), ox = gx, oy = gy + gh - (gh - cs * cy);
      for (let i = 0; i <= cx; i++) lineF(p, ox + i * cs, oy - cs * cy, ox + i * cs, oy, tk.color.line, 1, op);
      for (let j = 0; j <= cy; j++) lineF(p, ox, oy - j * cs, ox + cs * cx, oy - j * cs, tk.color.line, 1, op);
      const label = cs >= 18;
      for (const m of inSlice) {
        const f = m.c / mx, col = m.tail && tailU > 0 ? p.lerpColor(p.color(ink), p.color(acc), tailU) : p.color(ink);
        rectF(p, ox + m.i * cs + 1, oy - (m.j + 1) * cs + 1, cs - 2, cs - 2, col, op * (0.12 + 0.78 * f));
        if (label) txt(String(m.c), ox + (m.i + 0.5) * cs, oy - m.j * cs - cs * 0.32, Math.min(11, cs * 0.46), f > 0.5 ? tk.color.bg : tk.color.ink, 'mono', p.CENTER, op);
      }
      if (label) txt('X ACROSS · Y UP', ox, oy + 18, 11, tk.color.muted, 'mono', p.LEFT, op);
      txt('MAX CELL ' + fmt(mx) + (label ? '' : ' · X ACROSS, Y UP · NO DIGITS'), ox + cs * cx, oy + 18, 11, tk.color.muted, 'mono', p.RIGHT, op);
    } else {
      const bars = D === 2 ? inSlice : st.marks, top = Math.max(1, ...bars.map((m) => m.c)), bwp = gw / n[0], label = bwp >= 3 * 7.2;
      lineF(p, gx, gy + gh, gx + gw, gy + gh, tk.color.ink, 1.5, op);
      for (const m of bars) {
        const bh = (gh - 16) * m.c / top, here = D === 1 && m.i === cut.slice;
        const col = here ? p.color(tk.color.chalk) : m.tail && tailU > 0 ? p.lerpColor(p.color(tk.color.muted), p.color(acc), tailU) : p.color(tk.color.muted);
        rectF(p, gx + m.i * bwp + 0.5, gy + gh - bh, Math.max(1, bwp - 1), bh, col, op * (here ? 1 : 0.85));
        if (label) txt(String(m.c), gx + (m.i + 0.5) * bwp, gy + gh - bh - 4, 10, tk.color.ink, 'mono', p.CENTER, op);
      }
      if (D === 1) {   // the cut line and the counts either side of it, exact
        const cxp = gx + (cut.s * n[0]) * bwp; lineF(p, cxp, gy - 4, cxp, gy + gh + 4, tk.color.accent2, 2, op);
        let left = 0; for (const m of st.marks) if (m.i < cut.slice) left += m.c;
        txt(fmt(left) + ' LEFT', cxp - 6, gy + 8, 11, tk.color.ink, 'mono', p.RIGHT, op);
        txt(fmt(G.total - left - cut.sum) + ' RIGHT', cxp + 6, gy + 8, 11, tk.color.ink, 'mono', p.LEFT, op);
      }
      txt(num(G.range[0][0]), gx, gy + gh + 18, 11, tk.color.muted, 'mono', p.LEFT, op);
      txt((params.axisNames[0] || 'X') + (label ? '' : ' · PEAK ' + fmt(top)), gx + gw / 2, gy + gh + 18, 11, tk.color.muted, 'mono', p.CENTER, op);
      txt(num(G.range[0][1]), gx + gw, gy + gh + 18, 11, tk.color.muted, 'mono', p.RIGHT, op);
    }
  }

  A.patterns['gl-volume'] = {
    id: 'gl-volume', atlas: ['webgl-mode', 'p5-camera', 'world-to-screen', 'blend-mode', 'build-geometry', 'gpu-instancing', 'p5-shader', 'p5-framebuffer', 'frontier-2026'],
    renderer: 'webgl',
    params: {
      dur: 12, data: null, dataKind: 'samples', dims: 3, n: 20000, tailFrac: 0.12, bins: [12, 10, 12], range: [[-3.5, 6.5], [-3.5, 5.5], [-3.5, 4.5]],
      axisNames: ['X', 'Y', 'Z'], size: [430, 330, 430], gap: 0.12, cubeMin: 0.38, cubeMax: 0.94, alpha: [0.10, 0.62],
      tail: 2.6, tailAxis: 'r', tailCenter: [0, 0, 0], tailIn: [0.34, 0.44], ratioAt: 0.48,
      build: [0.03, 0.30], stagger: 0.35,
      cutIn: [0.50, 0.94], cutFrom: 0.04, cutTo: 0.74, cutDim: 0.35,
      orbit: [-38, -18], elev: [24, 30], dist: 980, fov: 0.78, look: [150, -150, 0],
      inset: [624, 96, 300, 352], pin: true, source: null,
    },
    variants: [
      { name: 'hist-1d-extruded', params: { dims: 1, bins: [48], range: [[-3.5, 8.5]], size: [560, 250, 70], gap: 0.14, alpha: [0.5, 0.58], tail: 2.0, tailAxis: 'x',
        orbit: [-30, -14], elev: [18, 22], dist: 900, look: [170, -110, 0], cutFrom: 0.04, cutTo: 0.62 } },
      { name: 'hist-2d-slabs', params: { data: null, dataKind: 'counts', size: [440, 220, 400], gap: 0.16, alpha: [0.5, 0.5], tail: 2.0, tailAxis: 'x',
        axisNames: ['X', 'Z'], orbit: [-44, -24], elev: [30, 34], dist: 960, look: [160, -80, 0], cutFrom: 0.04, cutTo: 0.72 } },
      { name: 'cloud-3d-cut', params: {} },
      { name: 'cloud-3d-fine', params: { n: 60000, bins: [24, 20, 24], alpha: [0.06, 0.55], cubeMin: 0.3, cubeMax: 0.95, orbit: [-50, -10] } },
      { name: 'cloud-3d-stress', params: { n: 300000, bins: [40, 32, 40], alpha: [0.04, 0.5], cubeMin: 0.3, cubeMax: 0.95, orbit: [-50, -10], pin: true } },
    ],
    setup: async function (p, ctx, params) {
      const tk = ctx.tokens || (A.brands && A.brands['ceti-dark']);
      const st = { seed: ctx.seed == null ? 7 : ctx.seed };
      st.grid = binData(params.data, params, st.seed);
      layout(st, params);
      glInit(p, st);
      st.cam = p.createCamera(); st.hud = p.createCamera();   // hud keeps p5's default camera: 1 unit = 1 css px at z = 0
      const fs = ctx.fonts || {};
      const d = fs.disp ? { f: fs.disp } : await font(p, faceKey(tk, 'disp'), 'Big Shoulders Display|600');
      const m = fs.mono ? { f: fs.mono } : await font(p, faceKey(tk, 'mono'), 'IBM Plex Mono|400');
      st.fonts = { disp: d.f, mono: m.f }; st.fontWarn = [d, m].filter((x) => x.fell).map((x) => x.key);
      return st;
    },
    count(t, st, params) { return countAt(st, params, t); },
    draw(p, t, st, params, tk) {
      const u = clamp(t / params.dur), G = st.grid, D = G.D, W = p.width, H = p.height, S = params.size;
      p.background(tk.color.bg);
      const cv = cameraAt(st, params, u), eye = cv.eye, cam = st.cam;
      cam.camera(eye[0], eye[1], eye[2], cv.c[0], cv.c[1], cv.c[2], 0, 1, 0); cam.perspective(params.fov, W / H, 10, 8000);
      p.setCamera(cam); p.noLights();

      // opaque furniture first (p5 draws, depth written): floor, frame, threshold line on the floor
      const bg = p.color(tk.color.bg), floorY = 0.5, hx = S[0] / 2 + 14, hz = (D === 1 ? S[2] : S[2]) / 2 + 14;
      p.noStroke(); p.fill(p.lerpColor(bg, p.color(tk.color.panel), 0.9)); p.push(); p.translate(0, floorY + 1, 0); p.box(hx * 2, 2, hz * 2); p.pop();
      p.stroke(tk.color.line); p.strokeWeight(1);
      const lo0 = G.range[0][0], span0 = G.range[0][1] - lo0, xw = (v) => -S[0] / 2 + ((v - lo0) / span0) * S[0];
      for (let q = 0; q <= 4; q++) { const x = -S[0] / 2 + S[0] * q / 4; p.line(x, -0.5, -hz, x, -0.5, hz); }
      if (D === 3) {   // wire frame of the volume
        const y1 = -S[1], c = [[-S[0] / 2, -S[2] / 2], [S[0] / 2, -S[2] / 2], [S[0] / 2, S[2] / 2], [-S[0] / 2, S[2] / 2]];
        for (let q = 0; q < 4; q++) { const a = c[q], b = c[(q + 1) % 4]; p.line(a[0], y1, a[1], b[0], y1, b[1]); p.line(a[0], 0, a[1], a[0], y1, a[1]); }
      }
      const tailU = win(u, params.tailIn);
      if (tailU > 0 && params.tailAxis === 'x') { const c = p.color(tk.color.accent); c.setAlpha(255 * tailU); p.stroke(c); p.strokeWeight(2); const x = xw(st.tau); p.line(x, -1, -hz, x, -1, hz); }

      // transparent cells: sorted back to front for THIS camera, cut plane in the stream
      const L = { amb: null, key: null, rim: null }, rgb = (c) => { c = p.color(c); return [p.red(c) / 255, p.green(c) / 255, p.blue(c) / 255]; };
      L.amb = rgb(p.lerpColor(bg, p.color(tk.color.muted), 0.55)).map((x) => 0.35 + x * 0.6); L.key = rgb(tk.color.chalk).map((x) => x * 0.55); L.rim = rgb(p.lerpColor(bg, p.color(tk.color.accent2), 0.6));
      const cBase = rgb(p.lerpColor(p.color(tk.color.muted), p.color(tk.color.ink), D === 3 ? 0.35 : 0.2)), cTail = rgb(tk.color.accent), cSlice = rgb(tk.color.chalk), cCut = rgb(tk.color.accent2);
      const cut = cutAt(st, params, u), ax = cut.ax, wAx = D === 1 ? 0 : 2;   // world axis of the cut: x for 1D, z otherwise
      const cutW = (wAx === 0 ? -S[0] / 2 + cut.s * S[0] : -S[2] / 2 + cut.s * S[2]), eyeSide = Math.sign(eye[wAx] - cutW) || 1;
      const vis = [];
      for (let q = 0; q < st.marks.length; q++) {
        const m = st.marks[q], g = grow(st, params, m, u); if (g <= 0) continue;
        const b = D === 3 ? { x: m.cx, y: m.cy, z: m.cz, hx: m.hx * g, hy: m.hy * g, hz: m.hz * g } : { x: m.cx, y: m.cy * g, z: m.cz, hx: m.hx, hy: Math.max(0.5, m.hy * g), hz: m.hz };
        const dx = b.x - eye[0], dy = b.y - eye[1], dz = b.z - eye[2];
        const inSl = cut.on && cut.key(m) === cut.slice, cpos = wAx === 0 ? b.x : b.z, side = inSl ? -1 : Math.sign(cpos - cutW) === eyeSide ? 1 : -1;
        vis.push({ m, b, g, d: dx * dx + dy * dy + dz * dz, side, inSl, passed: cut.on && !inSl && (cpos - cutW) * (params.cutTo - params.cutFrom) < 0 });
      }
      vis.sort((a, b) => a.side - b.side || b.d - a.d || a.m.id - b.m.id);   // behind-the-plane group, then far to near; ties by cell id
      const buf = st.gl.data; let o = 0, planeDone = !cut.on;
      const planeAt = () => {   // the cut plane, translucent, spanning the volume
        const yTop = -(D === 3 ? S[1] : S[1] * 1.04) - 6, e = 10;
        const pts = wAx === 0 ? [[cutW, 0, -hz], [cutW, 0, hz], [cutW, yTop, hz], [cutW, yTop, -hz]] : [[-S[0] / 2 - e, 0, cutW], [S[0] / 2 + e, 0, cutW], [S[0] / 2 + e, yTop, cutW], [-S[0] / 2 - e, yTop, cutW]];
        o = pushQuad(buf, o, pts, cCut, 0.16); planeDone = true; return pts;
      };
      let planePts = null;
      for (const v of vis) {
        if (!planeDone && v.side > 0) planePts = planeAt();
        const m = v.m, tl = m.tail ? tailU : 0;
        let col = [0, 1, 2].map((c) => lerp(cBase[c], cTail[c], tl)), a = m.a * (D === 3 ? 1 : 1) * (0.25 + 0.75 * Math.min(1, v.g * 1.5));
        if (m.tail) a = lerp(a, Math.min(0.9, a * 1.35 + 0.12), tl);
        if (v.inSl) { col = [0, 1, 2].map((c) => lerp(col[c], cSlice[c], m.tail && tl > 0 ? 0.25 : 0.6)); a = Math.min(0.92, a + 0.25); }
        else if (v.passed) a *= params.cutDim;
        o = pushBox(buf, o, L, eye, v.b, col, a);
      }
      if (!planeDone) planePts = planeAt();
      if (o) glDraw(p, st, cam, o);
      if (planePts) {   // plane rim, depth-tested against the furniture only (cells write no depth)
        const c = p.color(tk.color.accent2); p.stroke(c); p.strokeWeight(1.5); p.noFill();
        for (let q = 0; q < 4; q++) { const a = planePts[q], b = planePts[(q + 1) % 4]; p.line(a[0], a[1], a[2], b[0], b[1], b[2]); }
      }

      // pins: world points -> screen while the camera is set
      const scr = (x, y, z) => { const v = p.worldToScreen(new p5.Vector(x, y, z)); return [v.x, v.y]; };
      const ticks = []; for (let q = 0; q <= 4; q++) ticks.push({ s: scr(-S[0] / 2 + S[0] * q / 4, 0, hz + 6), v: axisVal(G, 0, q / 4) });
      const pk = st.peak, pkG = grow(st, params, pk, u), pkS = scr(pk.cx, D === 3 ? pk.cy - pk.hy : 2 * pk.cy, pk.cz);
      const cutS = planePts ? scr(planePts[2][0], planePts[2][1], planePts[2][2]) : null;

      // flat layer: readouts with the pack's faces
      flatBegin(p, st); const txt = mkTxt(p, st), cnt = countAt(st, params, t);
      const dimsTxt = G.n.slice(0, D).join(' × ');
      txt('DISTRIBUTION · ' + fmt(G.total) + ' SAMPLES IN ' + fmt(G.n[0] * G.n[1] * G.n[2]) + ' BINS (' + dimsTxt + ')' + (G.outside ? ' · ' + fmt(G.outside) + ' OUTSIDE THE RANGE, NOT DRAWN' : ''), 36, 44, 12, tk.color.muted, 'mono');
      txt((params.source || (params.data == null ? 'SEEDED DEMO DATA' : 'DATA')) + ' · ' + 'CELLS DRAWN BACK TO FRONT · ' + (D === 3 ? 'CUBE SIZE AND OPACITY = COUNT' : 'HEIGHT = COUNT'), 36, 62, 12, tk.color.muted, 'mono');
      for (const tq of ticks) if (!(tq.s[1] > H - 112 && tq.s[0] < 640)) txt(num(tq.v), tq.s[0], tq.s[1] + 16, 11, tk.color.muted, 'mono', p.CENTER, cnt.cells ? 1 : 0.5);
      txt(fmt(cnt.samples), 36, H - 62, 52, tk.color.ink, 'disp');
      txt('SAMPLES IN ' + fmt(cnt.cells) + ' OCCUPIED CELLS', 38, H - 38, 12, tk.color.muted, 'mono');
      if (tailU > 0) {
        const tx = 350, tdesc = params.tailAxis === 'x' ? (params.axisNames[0] || 'X') + ' >= ' + num(st.tau) : 'CELL CENTRE BEYOND r = ' + num(st.tau);
        txt(fmt(st.tailSamples), tx, H - 62, 52, tk.color.accent, 'disp', p.LEFT, tailU);
        txt('IN THE TAIL · ' + tdesc + ' · ' + fmt(st.tailCells) + ' CELLS', tx + 2, H - 38, 12, tk.color.muted, 'mono', p.LEFT, tailU);
        const ru = clamp((u - params.ratioAt) / 0.04);
        if (ru > 0) txt('OF ' + fmt(G.total) + ' = ' + (100 * st.tailSamples / G.total).toFixed(1) + ' %', tx + 2, H - 20, 12, tk.color.muted, 'mono', p.LEFT, ru);
      }
      if (params.pin && pkG >= 1 && pkS[0] > 20 && pkS[0] < W - 20) {   // the densest cell, pinned
        const lx = pkS[0] - 30, ly = pkS[1] - 46, op = clamp((u - params.build[1]) / 0.04);
        lineF(p, pkS[0], pkS[1], lx, ly + 6, tk.color.chalk, 1.5, op); rectF(p, pkS[0] - 3, pkS[1] - 3, 6, 6, tk.color.chalk, op);
        txt(fmt(pk.c), lx, ly, 22, tk.color.chalk, 'disp', p.RIGHT, op); txt('DENSEST CELL', lx, ly + 14, 11, tk.color.muted, 'mono', p.RIGHT, op);
      }
      if (cut.on) {
        const op = clamp((u - params.cutIn[0]) / 0.03);
        if (cutS) txt('CUT', cutS[0] + 6, cutS[1] - 6, 12, tk.color.accent2, 'mono', p.LEFT, op);
        drawInset(p, st, params, tk, txt, cut, op, tailU);
      }
      p.pop();
      return cnt;
    },
  };
  // hist-2d-slabs takes its data as a counts matrix (the path a film uses to feed binned claims): 20 x 16, from seeded samples
  (function () {
    const v = A.patterns['gl-volume'].variants[1].params, g = binData(demoSamples(2, 16000, 21, 0.14), { bins: [20, 16], range: [[-3.5, 6.5], [-3.5, 4.5]], dataKind: 'samples' }, 21);
    v.data = Array.from({ length: 20 }, (_, i) => Array.from({ length: 16 }, (_, j) => g.counts[i + 20 * j]));
    v.range = [[-3.5, 6.5], [-3.5, 4.5]]; v.source = 'SEEDED DEMO COUNTS, FED AS A 20 × 16 MATRIX';
  })();
})();
