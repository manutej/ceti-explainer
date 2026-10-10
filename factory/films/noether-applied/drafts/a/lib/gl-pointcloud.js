/* gl-pointcloud · PATCHED COPY for noether-applied draft A ("two planets"), from factory/films/noether-symmetry/lib/gl-pointcloud.js (itself the
   id-stable-morph patch of arsenal/patterns/gl-pointcloud/pattern.js). Kept from the original: ONE p5.Geometry with 4 billboard corners per point, ONE
   model() call per cloud under a custom billboard shader, per-point data in vertex properties, size-by-depth cue, fog toward the ground, round
   hard-edged discs, fill() before model(), the p5.Geometry bake. The film owns the camera and the type, so camera, HUD, pins, axes, synthetic data and
   DoF are removed.
   THE PATCH (what the original lacks): every point carries its HOME (aPosition) and ONE other place (aTo) and a per-point delay (aInfo.y); the draw
   takes m1 in [0,1] (the film computes it from t) and moves each point along its OWN straight path home -> aTo (smootherstep, stagger <= 0.25; uLin = 1
   makes the path linear, used for the stirred loop where the film steps through stored frames). Same marks, same count: nothing is added, removed or faded.
   A colour table indexed by level (uCol[6]), a count-in order (uShown), a feature rank (uF lights a subset, uFDim sinks the rest), a ghost dim (uDim).
   Part 1 had a second target (aTo2), a cut flag, a ring mode and a shell sweep: not used here, cut from this copy.
   Pure of t: draw(p, sh, st, o) reads only o (computed from t by the film) and the baked arrays. */
(function () {
  const A = (window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} });
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const sm = (x) => { x = clamp(x); return x * x * x * (x * (x * 6 - 15) + 10); };
  const VERT = `precision highp float;
attribute vec3 aPosition; attribute vec3 aNormal; attribute vec2 aTexCoord; attribute vec3 aTo; attribute vec4 aInfo;
uniform mat4 uModelViewMatrix; uniform mat4 uProjectionMatrix;
uniform float uR, uSizeCue, uZRef, uShown, uM1, uStag, uDim, uFDim, uFog, uF, uGrow, uLin;
uniform vec2 uFogZ; uniform vec3 uBg, uHi, uCol[6];
varying vec3 vCol; varying vec2 vC; varying float vFog;
float sm(float x){ x = clamp(x, 0.0, 1.0); return x * x * x * (x * (x * 6.0 - 15.0) + 10.0); }
void main(){
  float d = aInfo.y * uStag; float x = uM1 * (1.0 + uStag) - d;
  float e = mix(sm(x), clamp(x, 0.0, 1.0), uLin);
  vec3 q = mix(aPosition, aTo, e);
  float lv = floor(aNormal.z); float sz = 0.6 + 0.8 * fract(aNormal.z);
  vec4 mv = uModelViewMatrix * vec4(q, 1.0);
  float z = max(-mv.z, 1.0);
  float fa = aInfo.x >= 0.0 ? clamp(uF - aInfo.x, 0.0, 1.0) : 0.0;
  vec3 c = uCol[int(lv + 0.5)];
  c = mix(c, uHi, fa);
  c = mix(c, uBg, uDim);
  c = mix(c, uBg, uFDim * (1.0 - fa));
  float vis = aTexCoord.y < uShown ? 1.0 : 0.0;
  float r = vis * uR * sz * pow(uZRef / z, uSizeCue) * (1.0 + uGrow * fa);
  mv.xy += aNormal.xy * r;
  vFog = uFog * smoothstep(uFogZ.x, uFogZ.y, z);
  vCol = c; vC = aNormal.xy;
  gl_Position = uProjectionMatrix * mv;
}`;
  const FRAG = `precision highp float;
varying vec3 vCol; varying vec2 vC; varying float vFog; uniform vec3 uBg;
void main(){ float r2 = dot(vC, vC); if (r2 > 1.0) discard; vec3 c = vCol * (1.0 - 0.22 * r2); gl_FragColor = vec4(mix(c, uBg, vFog), 1.0); }`;

  /* rows: [{h:[x,y,z] home, t1:[..] other place, lvl 0..5, size 0..1, order, feat (rank or -1), delay 0..1}] */
  function bake(p, rows) {
    const N = rows.length, g = new p5.Geometry(1, 1, null, p._renderer), C = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
    const V = N * 4, a1 = new Float32Array(V * 3), inf = new Float32Array(V * 4);
    for (let i = 0; i < N; i++) {
      const r = rows[i], t1 = r.t1 || r.h, sz = clamp(r.size == null ? 0.5 : r.size, 0, 0.999), hv = p.createVector(r.h[0], r.h[1], r.h[2]);   // one vector shared by the 4 corners (never mutated)
      for (let c = 0; c < 4; c++) {
        const v = i * 4 + c;
        g.vertices.push(hv); g.vertexNormals.push(p.createVector(C[c][0], C[c][1], (r.lvl || 0) + sz));
        g.uvs.push(0, r.order == null ? i : r.order);
        a1.set(t1, v * 3); inf[v * 4] = r.feat == null ? -1 : r.feat; inf[v * 4 + 1] = r.delay || 0;
      }
      const b = i * 4; g.faces.push([b, b + 1, b + 2], [b, b + 2, b + 3]);
    }
    const prop = (name, arr, size) => { g._userVertexPropertyHelper(name, [], size); g[name + 'Src'] = Array.from(arr); };
    prop('aTo', a1, 3); prop('aInfo', inf, 4);
    return g;
  }
  const DEF = { off: [0, 0, 0], r: 1.2, sizeCue: 0.5, zRef: 1000, shown: 1e9, m1: 0, stag: 0, dim: 0, fdim: 0, fog: 0, fogZ: [0, 1e5], f: 0, grow: 0, lin: 0 };
  A.patterns['gl-pointcloud'] = {
    id: 'gl-pointcloud', renderer: 'webgl', sm,
    shader(p) { return p.createShader(VERT, FRAG); },
    make(p, rows) { return { N: rows.length, rows, geom: bake(p, rows) }; },
    /* o: off, r, sizeCue, zRef, shown, m1, stag, dim, fdim, fog, fogZ, f, grow, lin, col (flat 6 x rgb 0-1), bg, hi */
    draw(p, sh, st, o) {
      o = Object.assign({}, DEF, o); const U = (n, v) => sh.setUniform(n, v);
      p.push(); p.translate(o.off[0], o.off[1], o.off[2]); p.noStroke(); p.fill(255); p.shader(sh);
      U('uR', o.r); U('uSizeCue', o.sizeCue); U('uZRef', o.zRef); U('uShown', o.shown); U('uM1', o.m1); U('uStag', o.stag); U('uDim', o.dim); U('uFDim', o.fdim);
      U('uFog', o.fog); U('uFogZ', o.fogZ); U('uF', o.f); U('uGrow', o.grow); U('uLin', o.lin); U('uCol', o.col); U('uBg', o.bg); U('uHi', o.hi);
      p.model(st.geom); p.resetShader(); p.pop();
    },
    /* CPU twin of the vertex shader's place (for pins): world position of point i at m1 */
    at(st, i, m1, stag, lin) {
      const r = st.rows[i], d = (r.delay || 0) * (stag || 0), x = m1 * (1 + (stag || 0)) - d, e = lin ? clamp(x) : sm(x), t1 = r.t1 || r.h;
      return [0, 1, 2].map((k) => r.h[k] + (t1[k] - r.h[k]) * e);
    },
  };
})();
