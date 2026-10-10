/* gl-pointcloud · PATCHED COPY for noether-symmetry draft A ("the observatory").
   Original: arsenal/patterns/gl-pointcloud/pattern.js (kept from it: ONE p5.Geometry with 4 billboard corners per point, ONE model() call per
   cloud under a custom billboard shader, per-point data in vertex properties, size-by-depth cue and fog toward the ground, round hard-edged discs,
   fill() set before model(), the p5.Geometry bake). The film owns the camera (gl-camera-rig) and the type (gl-labels + the kit), so the module's
   camera, HUD, pins, axes, synthetic data and DoF are removed.
   THE PATCH (what the original lacks: an id-stable morph, pure of t):
     - every point carries its HOME (aPosition) and two more places (aTo, aTo2) and a per-point delay (aInfo.y); the draw takes m1, m2 in [0,1]
       (the film computes them from t with its knob-timed windows) and moves each point along its OWN straight path home -> aTo -> aTo2
       (smootherstep, stagger <= 0.25). Same marks, same count: no point is added, removed or faded; `at()` is the CPU twin of the shader.
     - a colour table indexed by level (uCol[6]), a count-in order (uShown), a feature rank (uF lights a subset one point at a time, uFDim sinks the rest),
       a cut flag (uCut dims everything outside the flagged set, never removes it), a ring mode (uRing: the fluids plate, positions from t).
   Pure of t: draw(p, st, o) reads only o (computed from t by the film) and the baked arrays. */
(function () {
  const A = (window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} });
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const sm = (x) => { x = clamp(x); return x * x * x * (x * (x * 6 - 15) + 10); };
  const VERT = `precision highp float;
attribute vec3 aPosition; attribute vec3 aNormal; attribute vec2 aTexCoord; attribute vec3 aTo; attribute vec3 aTo2; attribute vec4 aInfo;
uniform mat4 uModelViewMatrix; uniform mat4 uProjectionMatrix;
uniform float uR, uSizeCue, uZRef, uShown, uM1, uM2, uStag, uDim, uFDim, uFog, uF, uCut, uCutDim, uGrow, uRing, uT, uRingR, uTube, uRingW, uRingV, uSwap;
uniform vec2 uFogZ; uniform vec3 uBg, uHi, uCol[6];
varying vec3 vCol; varying vec2 vC; varying float vFog;
float sm(float x){ x = clamp(x, 0.0, 1.0); return x * x * x * (x * (x * 6.0 - 15.0) + 10.0); }
void main(){
  float d = aInfo.y * uStag;
  vec3 q = mix(mix(aPosition, aTo, sm(uM1 * (1.0 + uStag) - d)), aTo2, sm(uM2 * (1.0 + uStag) - d));
  float lv = floor(aNormal.z); float sz = 0.6 + 0.8 * fract(aNormal.z);
  if (uRing > 0.5) {
    float th = aTo.y + uT * uRingW; float rr = uRingR + uTube * cos(th);
    q = vec3(rr * cos(aTo.x), uTube * sin(th) + uRingV * uT, rr * sin(aTo.x)); lv = mod(lv + uSwap, 2.0);
  }
  vec4 mv = uModelViewMatrix * vec4(q, 1.0);
  float z = max(-mv.z, 1.0);
  float fa = aInfo.x >= 0.0 ? clamp(uF - aInfo.x, 0.0, 1.0) : 0.0;
  float inb = aTexCoord.x >= 0.0 ? 1.0 : 0.0;
  vec3 c = uCol[int(lv + 0.5)];
  c = mix(c, uHi, fa);
  c = mix(c, uBg, uDim);
  c = mix(c, uBg, uFDim * (1.0 - fa));
  c = mix(c, uBg, uCut * uCutDim * (1.0 - inb));
  float vis = aTexCoord.y < uShown ? 1.0 : 0.0;
  float r = vis * uR * sz * pow(uZRef / z, uSizeCue) * (1.0 + uGrow * max(fa, uCut * inb));
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
        a1.set(t1, v * 3); a2.set(t2, v * 3); inf[v * 4] = r.feat == null ? -1 : r.feat; inf[v * 4 + 1] = r.delay || 0;
      }
      const b = i * 4; g.faces.push([b, b + 1, b + 2], [b, b + 2, b + 3]);
    }
    const prop = (name, arr, size) => { g._userVertexPropertyHelper(name, [], size); g[name + 'Src'] = Array.from(arr); };
    prop('aTo', a1, 3); prop('aTo2', a2, 3); prop('aInfo', inf, 4);
    return g;
  }
  const DEF = { off: [0, 0, 0], r: 2.6, sizeCue: 0.5, zRef: 1000, shown: 1e9, m1: 0, m2: 0, stag: 0, dim: 0, fdim: 0, fog: 0, fogZ: [0, 1e5], f: 0, cut: 0, cutDim: 0.8, grow: 0.6,
    ring: 0, t: 0, ringR: 60, tube: 22, ringW: 1, ringV: 0, swap: 0 };
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
      U('uRing', o.ring); U('uT', o.t); U('uRingR', o.ringR); U('uTube', o.tube); U('uRingW', o.ringW); U('uRingV', o.ringV); U('uSwap', o.swap);
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
