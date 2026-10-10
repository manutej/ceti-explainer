/* pass-every-time / draft B · "the scoreboard" · the camera script (gl-camera-rig). Absolute film seconds; ortho throughout
   (one lens for the whole film, R-E I5), so every landing is a flat, comparable reading. Every scalar below is a knob through
   rig.toKnobs / rig.fromKnobs (lib/knobs.mjs writes the rows into film.json).
   Scenes (hard cuts between them; a 'cut' is a move of zero length, R-E P13):
     plan  0-40      the board lies on the floor, seen from above (el 89)
     stand 40-47     P1: the board stands up (el 89 -> 38, az 0 -> 16) while the 2 x 2 tiles stack into columns of four
     drift 52-60     ambient az 3 deg, nothing else moves
     volume 73-100   cut: the pass-every-k volume, seen from the front corner
     prs 100-121     cut: 296 cubes, one layer, seen from above
     minutes 121-135 cut: one row of minutes, tight on the first 27; 126.5-129.5 the camera dollies along it and pulls back
     monday 135-150  cut: the sorted board again, lower in the frame to leave the top for type
   Scene points (data targets for lookat): none used; the script is eye/center based. */
(function () {
  const D2R = Math.PI / 180;
  const eye = (c, az, el, r) => [c[0] + r * Math.cos(el * D2R) * Math.sin(az * D2R), c[1] - r * Math.sin(el * D2R), c[2] + r * Math.cos(el * D2R) * Math.cos(az * D2R)];
  const R = 1500, r1 = (v) => Math.round(v * 10) / 10;
  const pose = (c, az, el) => ({ center: c, eye: eye(c, az, el, R).map(r1) });
  const plan = pose([0, -2.7, 0], 0, 89), vol = pose([0, -7.5, 0], 10, 22), prs = pose([0, -1, 0], 6, 56), minA = pose([16.2, -0.6, 0], 8, 18),
    minB = pose([172.8, -0.6, 0], 8, 18), mon = pose([0, -4.7, 0], 12, 38);
  window.PASS_RIG = {
    proj: 'ortho', dur: 153, near: 10, far: 9000,
    start: { zoom: 12.5, eye: plan.eye, center: plan.center },
    moves: [
      { id: 'stand', move: 'orbit', t0: 40.0, t1: 47.0, az: 12, el: 38, around: [0, -2.7, 0], zoom: 12.5, ease: 'inout' },
      { id: 'drift', move: 'orbit', t0: 52.0, t1: 60.0, az: 3, ease: 'inout' },
      { id: 'volcut', move: 'cut', t0: 73.0, eye: vol.eye, center: vol.center, zoom: 12.5 },
      { id: 'prcut', move: 'cut', t0: 100.0, eye: prs.eye, center: prs.center, zoom: 17 },
      { id: 'mincut', move: 'cut', t0: 121.0, eye: minA.eye, center: minA.center, zoom: 24 },
      { id: 'dolly', move: 'key', t0: 126.5, t1: 129.5, eye: minB.eye, center: minB.center, zoom: 2.5, ease: 'inout' },
      { id: 'moncut', move: 'cut', t0: 135.0, eye: mon.eye, center: mon.center, zoom: 8.8 },
      { id: 'monddrift', move: 'orbit', t0: 137.0, t1: 150.0, az: -4, ease: 'inout' },
    ],
  };
})();
