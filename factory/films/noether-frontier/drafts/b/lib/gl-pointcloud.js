/* gl-pointcloud · PATCHED COPY for noether-frontier draft B ("the laboratory bench"), second generation: starts from noether-symmetry's
   lib/gl-pointcloud.js (Part 1: id-stable morph), which started from arsenal/patterns/gl-pointcloud/pattern.js.
   KEPT from Part 1: one p5.Geometry with 4 billboard corners per point, one model() call per cloud; per-point HOME (aPosition) and two more places
   (aTo, aTo2) and a per-point delay (aInfo.y); m1, m2 in [0,1] (computed by the film from t) move every point along its OWN straight path
   home -> aTo -> aTo2 (smootherstep, stagger <= 0.25); colour table by level (uCol[6]); count-in order (uShown); feature rank (uF); cut flag
   (uCut dims the rest, never removes); `at()` is the CPU twin. Same marks, same count: no point is added, removed or faded in a move.
   ADDED here (brief F7, the gaps Part 1 did not close):
     - uFLen: the feature rank becomes a WINDOW [rank, rank + uFLen] (a comet: each neuron's dots light in step order and go dark again).
       uFLen = 0 keeps Part 1's behaviour (lit from the rank on). No dot moves, none is added.
     - uFlat, uPlate: the contact shadow. Every point is flattened onto the bench plate (model-space y = uPlate) and dimmed by uDim; the film calls it
       a second time per cloud, so a cloud sits on the plate as a specimen. A guide, not data; the same 4 vertices, no new marks.
     - ghost for a whole group = uDim (exists): a cloud dimmed toward the ground, nothing removed.
   REMOVED (as in Part 1): the module camera, HUD, pins, axes, synthetic data, DoF, the smoke-ring mode. */
(function () {
  const A = (window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} });
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const sm = (x) => { x = clamp(x); return x * x * x * (x * (x * 6 - 15) + 10); };
  const VERT = `precision highp float;
attribute vec3 aPosition; attribute vec3 aNormal; attribute vec2 aTexCoord; attribute vec3 aTo; attribute vec3 aTo2; attribute vec4 aInfo;
uniform mat4 uModelViewMatrix; uniform mat4 uProjectionMatrix;
uniform float uR, uSizeCue, uZRef, uShown, uM1, uM2, uStag, uDim, uFDim, uFog, uF, uCut, uCutDim, uGrow, uShL, uShA, uShDim, uFLen, uFlat, uPlate;
uniform vec2 uFogZ; uniform vec3 uBg, uHi, uCol[6];
varying vec3 vCol; varying vec2 vC; varying float vFog;
float sm(float x){ x = clamp(x, 0.0, 1.0); return x * x * x * (x * (x * 6.0 - 15.0) + 10.0); }
void main(){
  float d = aInfo.y * uStag;
  vec3 q = mix(mix(aPosition, aTo, sm(uM1 * (1.0 + uStag) - d)), aTo2, sm(uM2 * (1.0 + uStag) - d));
  float lv = floor(aNormal.z); float sz = 0.6 + 0.8 * fract(aNormal.z);
  q.y = mix(q.y, uPlate, uFlat);
  vec4 mv = uModelViewMatrix * vec4(q, 1.0);
  float z = max(-mv.z, 1.0);
  float fa = aInfo.x >= 0.0 ? clamp(uF - aInfo.x, 0.0, 1.0) * (uFLen > 0.0 ? 1.0 - clamp((uF - aInfo.x - uFLen) / 1.0, 0.0, 1.0) : 1.0) : 0.0;
  float inb = aTexCoord.x >= 0.0 ? 1.0 : 0.0;
  vec3 c = uCol[int(lv + 0.5)];
  c = mix(c, uHi, fa);
  c = mix(c, uBg, uDim);
  c = mix(c, uBg, uFDim * (1.0 - fa));
  c = mix(c, uBg, uCut * uCutDim * (1.0 - inb));
  float shOn = (aInfo.z > -0.5 && abs(aInfo.z - uShL) < 0.5) ? 1.0 : 0.0;
  c = mix(c, uBg, uShA * uShDim * (1.0 - shOn));
  float vis = aTexCoord.y < uShown ? 1.0 : 0.0;
  float r = vis * uR * sz * pow(uZRef / z, uSizeCue) * (1.0 + uGrow * max(max(fa, uCut * inb), uShA * shOn));
  mv.xy += aNormal.xy * r;
  vFog = uFog * smoothstep(uFogZ.x, uFogZ.y, z);
  vCol = c; vC = aNormal.xy;
  gl_Position = uProjectionMatrix * mv;
}`;
  const FRAG = `precision highp float;
varying vec3 vCol; varying vec2 vC; varying float vFog; uniform vec3 uBg;
void main(){ float r2 = dot(vC, vC); if (r2 > 1.0) discard; vec3 c = vCol * (1.0 - 0.22 * r2); gl_FragColor = vec4(mix(c, uBg, vFog), 1.0); }`;

  /* rows: [{h:[x,y,z] home, t1:[..] spin place, t2:[..] layer place, lvl 0..5, size 0..1, order, cut (1 = in the flagged set), feat (rank or -1), delay 0..1}] */
  function bake(p, rows) {
    const N = rows.length, g = new p5.Geometry(1, 1, null, p._renderer), C = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
    const V = N * 4, a1 = new Float32Array(V * 3), a2 = new Float32Array(V * 3), inf = new Float32Array(V * 4);
    for (let i = 0; i < N; i++) {
      const r = rows[i], t1 = r.t1 || r.h, t2 = r.t2 || t1, sz = clamp(r.size == null ? 0.5 : r.size, 0, 0.999);
      for (let c = 0; c < 4; c++) {
        const v = i * 4 + c;
        g.vertices.push(p.createVector(r.h[0], r.h[1], r.h[2])); g.vertexNormals.push(p.createVector(C[c][0], C[c][1], (r.lvl || 0) + sz));
        g.uvs.push(r.cut ? 0 : -1, r.order == null ? i : r.order);
        a1.set(t1, v * 3); a2.set(t2, v * 3); inf[v * 4] = r.feat == null ? -1 : r.feat; inf[v * 4 + 1] = r.delay || 0; inf[v * 4 + 2] = r.sh == null ? -1 : r.sh;
      }
      const b = i * 4; g.faces.push([b, b + 1, b + 2], [b, b + 2, b + 3]);
    }
    const prop = (name, arr, size) => { g._userVertexPropertyHelper(name, [], size); g[name + 'Src'] = Array.from(arr); };
    prop('aTo', a1, 3); prop('aTo2', a2, 3); prop('aInfo', inf, 4);
    return g;
  }
  const DEF = { off: [0, 0, 0], r: 2.6, sizeCue: 0.5, zRef: 1000, shown: 1e9, m1: 0, m2: 0, stag: 0, dim: 0, fdim: 0, fog: 0, fogZ: [0, 1e5], f: 0, cut: 0, cutDim: 0.8, grow: 0.6,
    shL: -1, shA: 0, shDim: 0.7, fLen: 0, flat: 0, plate: 0 };
  A.patterns['gl-pointcloud'] = {
    id: 'gl-pointcloud', renderer: 'webgl', sm,
    shader(p) { return p.createShader(VERT, FRAG); },
    make(p, rows) { return { N: rows.length, rows, geom: bake(p, rows) }; },
    /* o: off, r, sizeCue, zRef, shown, m1, m2, stag, dim, fog, fogZ, f, cut, cutDim, grow, col (flat 6 x rgb 0-1), bg, hi, + ring fields */
    draw(p, sh, st, o) {
      o = Object.assign({}, DEF, o); const U = (n, v) => sh.setUniform(n, v);
      p.push(); p.translate(o.off[0], o.off[1], o.off[2]); p.noStroke(); p.fill(255); p.shader(sh);
      U('uR', o.r); U('uSizeCue', o.sizeCue); U('uZRef', o.zRef); U('uShown', o.shown); U('uM1', o.m1); U('uM2', o.m2); U('uStag', o.stag); U('uDim', o.dim); U('uFDim', o.fdim);
      U('uFog', o.fog); U('uFogZ', o.fogZ); U('uF', o.f); U('uCut', o.cut); U('uCutDim', o.cutDim); U('uGrow', o.grow); U('uCol', o.col); U('uBg', o.bg); U('uHi', o.hi);
      U('uFLen', o.fLen); U('uFlat', o.flat); U('uPlate', o.plate); U('uShL', o.shL); U('uShA', o.shA); U('uShDim', o.shDim);
      p.model(st.geom); p.resetShader(); p.pop();
    },
    /* CPU twin of the vertex shader's place (for pins): world position of point i at (m1, m2) */
    at(st, i, m1, m2, stag) {
      const r = st.rows[i], d = (r.delay || 0) * (stag || 0), e1 = sm(m1 * (1 + (stag || 0)) - d), e2 = sm(m2 * (1 + (stag || 0)) - d), t1 = r.t1 || r.h, t2 = r.t2 || t1;
      return [0, 1, 2].map((k) => (r.h[k] + (t1[k] - r.h[k]) * e1) + ((t2[k] - (r.h[k] + (t1[k] - r.h[k]) * e1)) * e2));
    },
    count(st, o) { const n = Math.min(st.N, Math.max(0, Math.ceil((o.shown == null ? 1e9 : o.shown) - 1e-9))); return { shown: n, total: st.N }; },
  };
})();
