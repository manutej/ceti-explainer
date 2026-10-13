/* a-bell-from-dice draft A · the camera script (gl-camera-rig). Absolute film seconds; ortho throughout, so the side
   elevation is a true histogram (no perspective) and the push into the tail is a zoom with the eye kept far off.
   Every scalar below is a knob through rig.toKnobs / rig.fromKnobs (lib/knobs.mjs writes the rows into film.json).
   Scene points (data targets): 0..25 = the top centre of the stack of sum 5..30; 26 = the bell's centre. */
window.BELL_RIG = {
  proj: 'ortho', dur: 123, near: 10, far: 9000,
  start: { zoom: 1.05 },
  moves: [
    { id: 'oblique', move: 'orbit', t0: 26.0, t1: 31.0, az: -18, el: 24, around: [0, -70, 0], zoom: 1.5, ease: 'inout' },
    { id: 'plan', move: 'orbit', t0: 40.0, t1: 43.0, az: 18, el: 89, around: [0, -130, 0], zoom: 1.0, ease: 'inout' },
    { id: 'side', move: 'orbit', t0: 50.0, t1: 55.0, el: 4, ease: 'inout' },
    { id: 'tail', move: 'lookat', t0: 58.0, t1: 63.0, target: 21, dist: 2400, zoom: 2.0, ease: 'inout' },
    { id: 'wide', move: 'lookat', t0: 66.6, t1: 70.0, target: 26, dist: 2400, zoom: 1.0, ease: 'inout' },
    { id: 'tilt', move: 'orbit', t0: 70.0, t1: 76.0, az: -20, el: 14, ease: 'inout' },
    { id: 'flat', move: 'orbit', t0: 86.0, t1: 91.5, az: 20, el: 3, ease: 'inout' },
  ],
};
