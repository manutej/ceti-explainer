/* gl-pointcloud · PATCHED COPY for noether-applied draft B ("the ledger of error"), derived from part 1's patched copy
   (factory/films/noether-symmetry/lib/gl-pointcloud.js), which is itself derived from arsenal/patterns/gl-pointcloud/pattern.js.
   Kept from the original: ONE p5.Geometry with 4 billboard corners per point, ONE model() call per cloud under a custom billboard shader, per-point data in
   vertex properties, size-by-depth cue and fog toward the ground, round hard-edged discs, fill() set before model(). The film owns the camera and the type.
   KEPT FROM PART 1 (id-stable morph, pure of t): every point carries its HOME (aPosition) and two more places (aTo, aTo2) and a per-point delay; the draw takes
   m1, m2 in [0,1] (the film computes them from t) and moves each point along its OWN straight path home -> aTo -> aTo2. Same marks, same count: no point is added,
   removed or faded. A colour table by level (uCol[6]), a count-in order (uShown), a cut flag (uCut dims everything outside the flagged set, never removes it).
   NEW FOR DRAFT B:
     - uLin: the morph is linear in m instead of smootherstep (a frame-to-frame interpolation must not stop at every keyframe);
     - a frame id per point (aInfo.y) and uFr: only the points of the frame uFr are drawn (a time-stacked cloud: the stirred loop, 16 frames x 1,000 parcels
       in ONE geometry, home = this frame's place, aTo = the next frame's place; the film sets uFr = frame, m1 = the fraction);
     - uSc: a per-draw scale of the places (ONE unit-disc lattice of ghost dots serves every zero sheet, any radius, any height by the draw's offset);
     - bake: the four corners of a point share one position vector and the corner vectors are cached by (corner, level, size): about one p5.Vector per point instead of eight
       (setup time: the page must be ready in under 5 s);
     - removed: the ring mode, the shell light and the feature rank of part 1 (the film no longer uses them).
   Pure of t: draw(p, sh, st, o) reads only o (computed from t by the film) and the baked arrays. */
(function () {
  const A = (window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} });
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const VERT = `precision highp float;
attribute vec3 aPosition; attribute vec3 aNormal; attribute vec2 aTexCoord; attribute vec3 aTo; attribute vec3 aTo2; attribute vec2 aInfo;
uniform mat4 uModelViewMatrix; uniform mat4 uProjectionMatrix;
uniform float uR, uSizeCue, uZRef, uShown, uM1, uM2, uStag, uLin, uDim, uFog, uCut, uCutDim, uFr; uniform vec3 uSc;
uniform vec2 uFogZ; uniform vec3 uBg, uCol[6];
varying vec3 vCol; varying vec2 vC; varying float vFog;
float sm(float x){ x = clamp(x, 0.0, 1.0); return x * x * x * (x * (x * 6.0 - 15.0) + 10.0); }
float ez(float x){ return uLin > 0.5 ? clamp(x, 0.0, 1.0) : sm(x); }
void main(){
  float d = aInfo.x * uStag;
  vec3 q = mix(mix(aPosition, aTo, ez(uM1 * (1.0 + uStag) - d)), aTo2, ez(uM2 * (1.0 + uStag) - d));
  q *= uSc;
  float lv = floor(aNormal.z); float sz = 0.6 + 0.8 * fract(aNormal.z);
  vec4 mv = uModelViewMatrix * vec4(q, 1.0);
  float z = max(-mv.z, 1.0);
  float inb = aTexCoord.x >= 0.0 ? 1.0 : 0.0;
  vec3 c = uCol[int(lv + 0.5)];
  c = mix(c, uBg, uDim);
  c = mix(c, uBg, uCut * uCutDim * (1.0 - inb));
  float vis = (aTexCoord.y < uShown ? 1.0 : 0.0) * ((aInfo.y < -0.5 || abs(aInfo.y - uFr) < 0.5) ? 1.0 : 0.0);
  float r = vis * uR * sz * pow(uZRef / z, uSizeCue);
  mv.xy += aNormal.xy * r;
  vFog = uFog * smoothstep(uFogZ.x, uFogZ.y, z);
  vCol = c; vC = aNormal.xy;
  gl_Position = uProjectionMatrix * mv;
}`;
  const FRAG = `precision highp float;
varying vec3 vCol; varying vec2 vC; varying float vFog; uniform vec3 uBg;
void main(){ float r2 = dot(vC, vC); if (r2 > 1.0) discard; vec3 c = vCol * (1.0 - 0.22 * r2); gl_FragColor = vec4(mix(c, uBg, vFog), 1.0); }`;

  /* rows: [{h:[x,y,z] home, t1, t2 (default: home), lvl 0..5, size 0..1, order, cut (1 = in the flagged set), delay 0..1, fr (frame id, -1 = always)}] */
  function bake(p, rows) {
    const N = rows.length, g = new p5.Geometry(1, 1, null, p._renderer), C = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
    const V = N * 4, a1 = new Float32Array(V * 3), a2 = new Float32Array(V * 3), inf = new Float32Array(V * 2), nc = {};
    const nv = (c, z) => { const k = c + ':' + z; return nc[k] || (nc[k] = p.createVector(C[c][0], C[c][1], z)); };
    for (let i = 0; i < N; i++) {
      const r = rows[i], t1 = r.t1 || r.h, t2 = r.t2 || t1, sz = clamp(r.size == null ? 0.5 : r.size, 0, 0.999);
      const hv = p.createVector(r.h[0], r.h[1], r.h[2]);
      for (let c = 0; c < 4; c++) {
        const v = i * 4 + c;
        g.vertices.push(hv); g.vertexNormals.push(nv(c, (r.lvl || 0) + sz));
        g.uvs.push(r.cut ? 0 : -1, r.order == null ? i : r.order);
        a1.set(t1, v * 3); a2.set(t2, v * 3); inf[v * 2] = r.delay || 0; inf[v * 2 + 1] = r.fr == null ? -1 : r.fr;
      }
      const b = i * 4; g.faces.push([b, b + 1, b + 2], [b, b + 2, b + 3]);
    }
    const prop = (name, arr, size) => { g._userVertexPropertyHelper(name, [], size); g[name + 'Src'] = Array.from(arr); };
    prop('aTo', a1, 3); prop('aTo2', a2, 3); prop('aInfo', inf, 2);
    return g;
  }
  const DEF = { off: [0, 0, 0], r: 1.1, sizeCue: 0.5, zRef: 1000, shown: 1e9, m1: 0, m2: 0, stag: 0, lin: 0, dim: 0, fog: 0, fogZ: [0, 1e5], cut: 0, cutDim: 0.8, fr: -1, sc: [1, 1, 1] };
  A.patterns['gl-pointcloud'] = {
    id: 'gl-pointcloud', renderer: 'webgl',
    shader(p) { return p.createShader(VERT, FRAG); },
    make(p, rows) { return { N: rows.length, rows, geom: bake(p, rows) }; },
    /* o: off, r, sizeCue, zRef, shown, m1, m2, stag, lin, dim, fog, fogZ, cut, cutDim, fr, col (flat 6 x rgb 0-1), bg */
    draw(p, sh, st, o) {
      o = Object.assign({}, DEF, o); const U = (n, v) => sh.setUniform(n, v);
      p.push(); p.translate(o.off[0], o.off[1], o.off[2]); p.noStroke(); p.fill(255); p.shader(sh);
      U('uR', o.r); U('uSizeCue', o.sizeCue); U('uZRef', o.zRef); U('uShown', o.shown); U('uM1', o.m1); U('uM2', o.m2); U('uStag', o.stag); U('uLin', o.lin);
      U('uDim', o.dim); U('uFog', o.fog); U('uFogZ', o.fogZ); U('uCut', o.cut); U('uCutDim', o.cutDim); U('uFr', o.fr); U('uSc', o.sc); U('uCol', o.col); U('uBg', o.bg);
      p.model(st.geom); p.resetShader(); p.pop();
    },
  };
})();
