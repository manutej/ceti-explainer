/* gl-pointcloud · PATCHED COPY #2 for noether-frontier draft A ("the observatory, continued").
   Origin: factory/films/noether-symmetry/lib/gl-pointcloud.js (Part 1's patched copy of arsenal/patterns/gl-pointcloud/pattern.js). Kept: ONE
   p5.Geometry with 4 billboard corners per point, ONE model() call per cloud under a custom billboard shader, per-point data in vertex properties,
   size-by-depth cue and fog toward the ground, round hard-edged discs, the id-stable morph (every point carries HOME aPosition and two more places
   aTo, aTo2 and a delay; m1, m2 in [0,1] move it along its OWN straight path home -> aTo -> aTo2, smootherstep, stagger <= 0.25), a colour table by
   level (uCol[6]), a count-in order (uShown), a cut flag (uCut dims everything outside the flagged set, never removes it).
   Frontier patch: (1) COMET: the feature rank (aInfo.x) lights a point by how far a head uF has swept past it; uFLen > 0 makes the light a moving
   trail of uFLen ranks (a dot slides along its arc, then goes dark), uFBase keeps every ranked point a little lit (the followed orbit, a bit brighter,
   not bigger); (2) uDim is the GHOST of a whole group; (3) removed: ring mode, shell sweep, DoF, HUD, pins, axes, synthetic data, module camera.
   Pure of t: draw reads only o (computed from t by the film) and the baked arrays. Same marks, same count: no point is added, removed or faded. */
(function () {
  const A = (window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} });
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const sm = (x) => { x = clamp(x); return x * x * x * (x * (x * 6 - 15) + 10); };
  const VERT = `precision highp float;
attribute vec3 aPosition; attribute vec3 aNormal; attribute vec2 aTexCoord; attribute vec3 aTo; attribute vec3 aTo2; attribute vec4 aInfo;
uniform mat4 uModelViewMatrix; uniform mat4 uProjectionMatrix;
uniform float uR, uSizeCue, uZRef, uShown, uM1, uM2, uStag, uDim, uFDim, uFog, uF, uFLen, uFBase, uCut, uCutDim, uGrow;
uniform vec2 uFogZ; uniform vec3 uBg, uHi, uCol[6];
varying vec3 vCol; varying vec2 vC; varying float vFog;
float sm(float x){ x = clamp(x, 0.0, 1.0); return x * x * x * (x * (x * 6.0 - 15.0) + 10.0); }
void main(){
  float d = aInfo.y * uStag;
  vec3 q = mix(mix(aPosition, aTo, sm(uM1 * (1.0 + uStag) - d)), aTo2, sm(uM2 * (1.0 + uStag) - d));
  float lv = floor(aNormal.z); float sz = 0.6 + 0.8 * fract(aNormal.z);
  vec4 mv = uModelViewMatrix * vec4(q, 1.0);
  float z = max(-mv.z, 1.0);
  float fa = 0.0;
  if (aInfo.x >= 0.0) {
    float h = uF - aInfo.x;
    float cm = uFLen > 0.0 ? (h >= 0.0 ? 1.0 - clamp(h / uFLen, 0.0, 1.0) : clamp(1.0 + h, 0.0, 1.0)) : clamp(h, 0.0, 1.0);
    fa = max(cm, uFBase);
  }
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

  /* rows: [{h:[x,y,z] home, t1:[..] second place, t2:[..] third place, lvl 0..5, size 0..1, order, cut (1 = in the flagged set), feat (rank or -1), delay 0..1}] */
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
  const DEF = { off: [0, 0, 0], r: 1.1, sizeCue: 0.5, zRef: 1000, shown: 1e9, m1: 0, m2: 0, stag: 0, dim: 0, fdim: 0, fog: 0, fogZ: [0, 1e5], f: -1e3, fLen: 0, fBase: 0, cut: 0, cutDim: 0.5, grow: 0 };
  A.patterns['gl-pointcloud'] = {
    id: 'gl-pointcloud', renderer: 'webgl', sm,
    shader(p) { return p.createShader(VERT, FRAG); },
    make(p, rows) { return { N: rows.length, rows, geom: bake(p, rows) }; },
    /* o: off, r, sizeCue, zRef, shown, m1, m2, stag, dim (ghost), fdim, fog, fogZ, f, fLen, fBase, cut, cutDim, grow, col (flat 6 x rgb 0-1), bg, hi */
    draw(p, sh, st, o) {
      o = Object.assign({}, DEF, o); const U = (n, v) => sh.setUniform(n, v);
      p.push(); p.translate(o.off[0], o.off[1], o.off[2]); p.noStroke(); p.fill(255); p.shader(sh);
      U('uR', o.r); U('uSizeCue', o.sizeCue); U('uZRef', o.zRef); U('uShown', o.shown); U('uM1', o.m1); U('uM2', o.m2); U('uStag', o.stag); U('uDim', o.dim); U('uFDim', o.fdim);
      U('uFog', o.fog); U('uFogZ', o.fogZ); U('uF', o.f); U('uFLen', o.fLen); U('uFBase', o.fBase); U('uCut', o.cut); U('uCutDim', o.cutDim); U('uGrow', o.grow);
      U('uCol', o.col); U('uBg', o.bg); U('uHi', o.hi);
      p.model(st.geom); p.resetShader(); p.pop();
    },
    /* CPU twin of the vertex shader's place for a row-like {h, t1, t2} with delay d: world position at (m1, m2) */
    at(r, m1, m2, stag, delay) {
      const d = (delay || 0) * (stag || 0), e1 = sm(m1 * (1 + (stag || 0)) - d), e2 = sm(m2 * (1 + (stag || 0)) - d), t1 = r.t1 || r.h, t2 = r.t2 || t1;
      return [0, 1, 2].map((k) => { const a = r.h[k] + (t1[k] - r.h[k]) * e1; return a + (t2[k] - a) * e2; });
    },
    count(st, o) { const n = Math.min(st.N, Math.max(0, Math.ceil((o.shown == null ? 1e9 : o.shown) - 1e-9))); return { shown: n, total: st.N }; },
  };
})();
