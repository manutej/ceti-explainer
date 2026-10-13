/* escapement-geometry.js — EXTRACT (verbatim functions) from chromes/escapement/escapement.kit.js (A · The Escapement):
   exact involute gear outlines (20° pressure angle), the mesh-phase rule, and the Graham escape-wheel tooth profile.
   Only the 2D geometry is lifted; the WEBGL extrusion, section clipping and shaders stay in the direction. */
const ESCG = (function () {
  'use strict';
  const TAU = Math.PI * 2, D2R = Math.PI / 180;
  /** involute gear outline (star-shaped about its centre), tooth 0 centred on angle 0. */
  function involute(z, m, pa = 20, samples = 7) {
    const a = pa * D2R, r = m * z / 2, rb = r * Math.cos(a), ra = r + m, rf = r - 1.25 * m;
    const inv = x => Math.tan(x) - x, phi0 = Math.PI / (2 * z) + inv(a), ta = Math.sqrt((ra / rb) ** 2 - 1);
    const thInv = t => t - Math.atan(t), pts = [];
    for (let i = 0; i < z; i++) {
      const c = TAU * i / z, P = (rr, ang) => pts.push([rr * Math.cos(ang), rr * Math.sin(ang)]);
      P(rf, c - phi0 - 0.6 * (Math.PI / z - phi0));
      if (rf < rb) P(rf, c - phi0);
      for (let s = 0; s <= samples; s++) { const t = ta * s / samples; P(rb * Math.sqrt(1 + t * t), c - phi0 + thInv(t)); }
      for (let s = samples; s >= 0; s--) { const t = ta * s / samples; P(rb * Math.sqrt(1 + t * t), c + phi0 - thInv(t)); }
      if (rf < rb) P(rf, c + phi0);
      P(rf, c + phi0 + 0.6 * (Math.PI / z - phi0));
    }
    return { pts, r, ra, rf, rb, z, m };
  }
  /** wheel B's angle so that it meshes with A (A turns θA; line of centres A→B at angle λ) */
  const meshAngle = (thA, zA, zB, lambda) => -(zA / zB) * (thA - lambda) + lambda + Math.PI + Math.PI / zB;

  /** Graham escape-wheel outline: N pointed teeth, tips at radius R on angles k·2π/N; wheel turns +θ (clockwise on
   *  screen). Leading face nearly radial (undercut forward 4°), curved back. */
  function escapeTeeth(N, R, h) {
    const pts = [], pitch = TAU / N;
    for (let k = 0; k < N; k++) {
      const a = k * pitch, P = (rr, ang) => pts.push([rr * Math.cos(ang), rr * Math.sin(ang)]);
      for (let s = 0; s <= 6; s++) { const u = s / 6; P(R - h + h * Math.pow(u, 0.55), a - pitch * 0.62 * (1 - u)); } // curved back up to the tip
      P(R - h * 0.97, a + 4 * D2R);                                                                          // leading face down (undercut)
      P(R - h, a + 0.3 * pitch);
    }
    return pts;
  }

  return { TAU, D2R, involute, meshAngle, escapeTeeth };
})();
