/* lib/scene3d.js · the box city: layout (pure numbers), baking, role-Lambert shader.
   Derived from arsenal/patterns/webgl-scene/pattern.js: buildGeometry tiers (colour per model() call through a
   uniform, so geometry is baked without fill) and its one custom Lambert shader (p5's own lights are 10-50x slower per
   fragment on software GL). Changes: the light is a fixed key + ambient fed from the pack roles by the film;
   columns are tiered by LAYER (so a counter can light layers bottom-up), slabs are two models per block (lit, dim).
   No random numbers: every position is a function of the counts. */
(function () {
  'use strict';
  const VERT = 'precision highp float; attribute vec3 aPosition; attribute vec3 aNormal; uniform mat4 uModelViewMatrix; uniform mat4 uProjectionMatrix; varying vec3 vN;' +
    'void main(){ vN = aNormal; gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0); }';
  const FRAG = 'precision highp float; varying vec3 vN; uniform vec3 uColor, uAmb, uKey, uKeyDir;' +
    'void main(){ vec3 n = normalize(vN); float d = max(dot(n, -uKeyDir), 0.0); gl_FragColor = vec4(uColor * (uAmb + uKey * d), 1.0); }';

  /* block shape for n boxes in about `layers` layers: a w x r footprint (w <= r, near square) whose capacity gives
     ceil(n / cap) closest to `layers`. cap = boxes per layer. */
  function shape(n, layers) {
    let best = null;
    for (let a = 1; a <= 40; a++) for (let b = a; b <= 40; b++) {
      const cap = a * b, L = Math.ceil(n / cap), cost = Math.abs(L - layers) * 100 + (b - a) * 3 + (cap > n ? 40 : 0);
      if (!best || cost < best.cost) best = { w: a, r: b, cap, cost };
    }
    return best;
  }

  /* layout(spec): spec = { C, gap, foot, layers, slabGap, aisle, men: [n per dept], menA: [...], women: [...], womenA: [...] }
     -> { C, bw, foot, cap, cols[2], depts[6], Z, plinth } ; y is up-negative (p5): boxes sit on y = 0 */
  function layout(s) {
    const C = s.C, bw = C - s.gap, cap = s.foot * s.foot, sum = (a) => a.reduce((x, y) => x + y, 0);
    const colN = [sum(s.men), sum(s.women)], colA = [sum(s.menA), sum(s.womenA)];
    const colX = [-s.aisle / 2 - s.foot * C / 2, s.aisle / 2 + s.foot * C / 2];
    const cols = [0, 1].map((i) => ({ sex: i, n: colN[i], A: colA[i], layers: Math.ceil(colN[i] / cap), cx: colX[i], cz: 0 }));
    const depts = s.men.map((_, d) => {
      const blocks = [0, 1].map((i) => {
        const n = (i ? s.women : s.men)[d], A = (i ? s.womenA : s.menA)[d], sh = shape(n, s.layers);
        return { sex: i, d, n, A, w: sh.w, r: sh.r, cap: sh.cap, layers: Math.ceil(n / sh.cap), lit: A / sh.cap };
      });
      return { d, depth: Math.max(blocks[0].r, blocks[1].r) * C, blocks };
    });
    const Z = sum(depts.map((x) => x.depth)) + (depts.length - 1) * s.slabGap;
    let z = Z / 2;                                    // A at +z (nearest the front camera), F at -z
    depts.forEach((D) => {
      D.zc = z - D.depth / 2; z -= D.depth + s.slabGap;
      D.blocks.forEach((b) => { b.cz = D.zc; b.cx = b.sex ? s.aisle / 2 + b.w * C / 2 : -s.aisle / 2 - b.w * C / 2; });
      D.x0 = -s.aisle / 2 - D.blocks[0].w * C - 5; D.x1 = s.aisle / 2 + D.blocks[1].w * C + 5; D.pz = D.depth + 8;
    });
    const wMax = Math.max(...depts.map((D) => Math.max(-D.x0, D.x1)), s.foot * C + s.aisle / 2);
    return { C, bw, foot: s.foot, cap, cols, depts, Z, plinth: { w: 2 * (wMax + 46), d: Z + 150, h: 14 }, plateH: 3 };
  }

  // local position of box i in a block of footprint w x r (layer capacity w*r), centred on the block, base on y = 0
  function blockPos(L, w, r, i, front) {
    const cap = w * r, layer = Math.floor(i / cap), q = i % cap, ix = q % w, iz = Math.floor(q / w);
    const z = front ? ((r - 1) / 2 - iz) * L.C : (iz - (r - 1) / 2) * L.C;     // fill from the front row back
    return [(ix - (w - 1) / 2) * L.C, -(layer + 0.5) * L.C, z];
  }

  function bake(p, L) {
    const mk = (fn) => p.buildGeometry(() => { p.noStroke(); fn(); });
    const boxes = (w, r, from, to) => () => { for (let i = from; i < to; i++) { const q = blockPos(L, w, r, i, true); p.push(); p.translate(q[0], q[1], q[2]); p.box(L.bw, L.bw, L.bw); p.pop(); } };
    L.cols.forEach((c) => {
      c.tiers = [];
      for (let j = 0; j < c.layers; j++) c.tiers.push(mk(boxes(L.foot, L.foot, j * L.cap, Math.min(c.n, (j + 1) * L.cap))));
    });
    L.depts.forEach((D) => D.blocks.forEach((b) => {
      b.litGeo = mk(boxes(b.w, b.r, 0, b.A)); b.dimGeo = mk(boxes(b.w, b.r, b.A, b.n));
    }));
    return L;
  }

  window.FILM_S3D = { VERT, FRAG, layout, bake, blockPos, shape };
})();
