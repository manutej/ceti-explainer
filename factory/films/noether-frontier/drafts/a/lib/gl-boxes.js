/* gl-boxes · a small instanced-box module for noether-frontier draft A (the toy's rows and the question tree on a plate).
   Written for this film from the idea of arsenal/patterns/gl-instances (marks as boxes, data-given x/y, ids kept) but for tens of marks, not
   thousands: ONE baked unit box (p5.Geometry, 24 vertices, face normals), ONE flat shader (colour x face shade, mix toward the ground by `dim`),
   one model() call per mark, each placed by translate / rotateY / scale from the film's data (so a swap of two ids and a ring on one id are
   positions and a drawn loop, pure of t). Pure: draw reads only its arguments. */
(function () {
  const A = (window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} });
  const VERT = `precision highp float;
attribute vec3 aPosition; attribute vec3 aNormal; uniform mat4 uModelViewMatrix; uniform mat4 uProjectionMatrix; varying float vL;
void main(){ vL = aNormal.y < -0.5 ? 1.0 : (abs(aNormal.x) > 0.5 ? 0.66 : 0.5); gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0); }`;
  const FRAG = `precision highp float;
varying float vL; uniform vec3 uCol; uniform vec3 uBg; uniform float uDim;
void main(){ gl_FragColor = vec4(mix(uCol * vL, uBg, uDim), 1.0); }`;
  function unit(p) {
    const g = new p5.Geometry(1, 1, null, p._renderer);
    const F = [[[1, 0, 0], [[.5, -.5, -.5], [.5, .5, -.5], [.5, .5, .5], [.5, -.5, .5]]], [[-1, 0, 0], [[-.5, -.5, .5], [-.5, .5, .5], [-.5, .5, -.5], [-.5, -.5, -.5]]],
      [[0, -1, 0], [[-.5, -.5, -.5], [.5, -.5, -.5], [.5, -.5, .5], [-.5, -.5, .5]]], [[0, 1, 0], [[-.5, .5, .5], [.5, .5, .5], [.5, .5, -.5], [-.5, .5, -.5]]],
      [[0, 0, 1], [[-.5, -.5, .5], [.5, -.5, .5], [.5, .5, .5], [-.5, .5, .5]]], [[0, 0, -1], [[.5, -.5, -.5], [-.5, -.5, -.5], [-.5, .5, -.5], [.5, .5, -.5]]]];
    F.forEach((f, i) => { f[1].forEach((v) => { g.vertices.push(p.createVector(v[0], v[1], v[2])); g.vertexNormals.push(p.createVector(f[0][0], f[0][1], f[0][2])); g.uvs.push(0, 0); }); const b = i * 4; g.faces.push([b, b + 1, b + 2], [b, b + 2, b + 3]); });
    return g;
  }
  A.patterns['gl-boxes'] = {
    id: 'gl-boxes', renderer: 'webgl',
    make(p) { return { geom: unit(p), sh: p.createShader(VERT, FRAG) }; },
    /* b: {pos [x,y,z] = centre, size [sx,sy,sz], col [r,g,b] 0-1, dim 0-1 (mix toward bg), rot (radians about the vertical axis)}; y is DOWN (p5): a box standing on y = 0 has pos[1] = -sy/2 */
    draw(p, st, b, bg) {
      if (!(b.size[0] > 1e-4 && b.size[1] > 1e-4 && b.size[2] > 1e-4)) return;
      p.push(); p.translate(b.pos[0], b.pos[1], b.pos[2]); if (b.rot) p.rotateY(b.rot); p.scale(b.size[0], b.size[1], b.size[2]);
      p.noStroke(); p.fill(255); p.shader(st.sh); st.sh.setUniform('uCol', b.col); st.sh.setUniform('uBg', bg); st.sh.setUniform('uDim', b.dim || 0);
      p.model(st.geom); p.resetShader(); p.pop();
    },
  };
})();
