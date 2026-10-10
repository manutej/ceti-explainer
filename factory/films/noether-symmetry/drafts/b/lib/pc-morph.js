  /* [noether-symmetry draft B] REPLACES the module body from `const VERT` to the end (assembled copy only; this file is the patch).
     What it adds to gl-pointcloud, per the brief's finding F4: per-point home coordinates and a `mix` knob, pure of t.
       aPosition          = home A (xyz), the position-space home
       aVertexColor       = home B (xyz) + w = the dot's stagger 0..1, the conserved-space home
       aNormal            = corner.xy + z = class + size fraction (class 0..7 picks a palette colour)
       aTexCoord          = (orbit id, reveal order)
     uM1 mixes A -> B (the cut), uM2 mixes B -> C where C is derived in the shader from B and the class: radius |B|, angle
     atan(B.z, B.x), height = the class (energy level) layer. The same 3,000 vertices all along: id-stable, no fade, no add.
     The brush is a band on B (|B.y| < band |B|), so every dot of one orbit is lit or dimmed together. */
  const VERT = `precision highp float;
attribute vec3 aPosition; attribute vec3 aNormal; attribute vec2 aTexCoord; attribute vec4 aVertexColor;
uniform mat4 uModelViewMatrix; uniform mat4 uProjectionMatrix;
uniform float uR, uSizeCue, uZRef, uFog, uShown, uM1, uM2, uStag, uDim, uBand, uCutOn, uCutDim, uHiOrb, uHiGrow, uLyr;
uniform vec2 uFogZ; uniform vec3 uOff, uBg, uHi, uLit, uC0, uC1, uC2, uC3, uC4, uC5, uC6, uC7;
varying vec3 vCol; varying vec2 vC; varying float vFog;
float ez(float x){ x = clamp(x, 0.0, 1.0); return x*x*x*(x*(x*6.0-15.0)+10.0); }
void main(){
  vec3 A = aPosition; vec3 B = aVertexColor.xyz; float s = aVertexColor.w;
  float k1 = ez(uM1*(1.0+uStag) - s*uStag), k2 = ez(uM2*(1.0+uStag) - s*uStag);
  float cl = floor(aNormal.z); float sz = 0.6 + 0.8*fract(aNormal.z);
  float rr = length(B); float ph = atan(B.z, B.x);
  vec3 C = vec3(rr*cos(ph), -(cl-2.0)*uLyr, rr*sin(ph));
  vec3 P = mix(mix(A, B, k1), C, k2) + uOff;
  vec4 mv = uModelViewMatrix * vec4(P, 1.0);
  float z = max(-mv.z, 1.0);
  vec3 c = cl < 0.5 ? uC0 : (cl < 1.5 ? uC1 : (cl < 2.5 ? uC2 : (cl < 3.5 ? uC3 : (cl < 4.5 ? uC4 : (cl < 5.5 ? uC5 : (cl < 6.5 ? uC6 : uC7))))));
  float hi = abs(aTexCoord.x - uHiOrb) < 0.5 ? 1.0 : 0.0;
  float inb = abs(B.y) < uBand * rr ? 1.0 : 0.0;
  float dim = uDim;
  if (uCutOn > 0.0) { dim = max(dim, uCutDim * uCutOn * (1.0 - inb)); c = mix(c, uLit, uCutOn * inb); }
  dim *= (1.0 - hi);
  c = mix(c, uHi, hi);
  c = mix(c, uBg, dim);
  float vis = aTexCoord.y < uShown ? 1.0 : 0.0;
  float r = vis * uR * sz * pow(uZRef / z, uSizeCue) * (1.0 + (uHiGrow - 1.0) * hi);
  mv.xy += aNormal.xy * r;
  vFog = uFog * smoothstep(uFogZ.x, uFogZ.y, z);
  vCol = c; vC = aNormal.xy;
  gl_Position = uProjectionMatrix * mv;
}`;
  const FRAG = `precision highp float;
varying vec3 vCol; varying vec2 vC; varying float vFog; uniform vec3 uBg;
void main(){ float r2 = dot(vC, vC); if (r2 > 1.0) discard; vec3 c = vCol * (1.0 - 0.22 * r2); gl_FragColor = vec4(mix(c, uBg, vFog), 1.0); }`;
  const rgb = (p, c) => { c = p.color(c); return [p.red(c) / 255, p.green(c) / 255, p.blue(c) / 255]; };
  /* o = {N, A, B (Float32Array 3N), cls (Uint8), orb (Uint16), stag, order (Float32), size (Float32 0..1) | null} -> one p5.Geometry */
  function build(p, o) {
    const g = new p5.Geometry(1, 1, null, p._renderer), C = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
    g.vertexColors = [];
    for (let i = 0; i < o.N; i++) {
      const sz = clamp(o.size ? o.size[i] : 0.4, 0, 0.999);
      for (const c of C) {
        g.vertices.push(p.createVector(o.A[3 * i], o.A[3 * i + 1], o.A[3 * i + 2]));
        g.vertexNormals.push(p.createVector(c[0], c[1], o.cls[i] + sz));
        g.uvs.push(o.orb[i], o.order[i]);
        g.vertexColors.push(o.B[3 * i], o.B[3 * i + 1], o.B[3 * i + 2], o.stag[i]);
      }
      const b = i * 4; g.faces.push([b, b + 1, b + 2], [b, b + 2, b + 3]);
    }
    return g;
  }
  const make = (p) => p.createShader(VERT, FRAG);
  function draw(p, sh, geom, u) {
    p.noStroke(); p.fill(255); p.shader(sh);
    for (const k in u) sh.setUniform(k, u[k]);
    p.model(geom); p.resetShader();
  }
  A.patterns['gl-pointcloud'] = { id: 'gl-pointcloud', renderer: 'webgl', api: { VERT, FRAG, build, make, draw, rgb } };
