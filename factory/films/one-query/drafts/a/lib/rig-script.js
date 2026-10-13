/* one-query draft A · the camera scripts (gl-camera-rig), absolute film seconds. Two rigs, because the two 3-D scenes are two
   worlds joined by a hard cut (R-E P13): `world` (the plate of the world's grid, the 415 marks, the four towers; 66-99 s) and
   `terrain` (seven mesas; 99-135 s). Every scalar below becomes a film.json knob through rig.toKnobs (lib/mkfilm.mjs), so the
   camera is retuned without code. Poses are written as spherical (az, el, r) about a centre; p5's y is down, up is -y. */
(function () {
  const D = Math.PI / 180;
  const sph = (az, el, r) => [r * Math.cos(el * D) * Math.sin(az * D), -r * Math.sin(el * D), r * Math.cos(el * D) * Math.cos(az * D)];
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const WC = [0, 0, 0], TC = [0, 40, 0];
  window.ONEQ_RIGS = {
    /* plan view, close on the block of 415 marks (the 'anchor mark keeps its screen place' cut); pull back (74-77 s) to the whole
       plate; then the quarter turn + tilt (82-87.4 s) while the marks travel to four towers: re-stack under a tilt (R-E P1 + P2) */
    world: {
      proj: 'persp', dur: 153, near: 10, far: 6000,
      start: { center: WC, eye: add(WC, sph(0, 89, 150)), fov: 38 },
      moves: [
        { id: 'pull', move: 'dolly', t0: 74.0, t1: 77.0, dist: 740, ease: 'inout' },
        { id: 'rise', move: 'orbit', t0: 82.0, t1: 87.4, az: 24, el: 19, r: 0.66, around: [0, -40, 0], ease: 'inout' },
      ],
    },
    /* street level, skimming the mesas, then a straight crane rise (R-E P7); the cut to Ireland and to the United States are slow
       orbits (<= 1 deg/s) about the place the section is cut at */
    terrain: {
      proj: 'persp', dur: 153, near: 10, far: 6000,
      start: { center: TC, eye: add(TC, sph(-50, 5, 900)), fov: 38 },
      moves: [
        { id: 'lift', move: 'crane', t0: 99.0, t1: 103.2, rise: 470, follow: 0, ease: 'inout' },
        { id: 'drift', move: 'orbit', t0: 104.6, t1: 120.6, az: -10, ease: 'inout' },
        { id: 'us', move: 'orbit', t0: 121.0, t1: 131.0, az: 28, el: 15, r: 0.5, around: [-40, 20, 0], ease: 'inout' },
      ],
    },
  };
})();
