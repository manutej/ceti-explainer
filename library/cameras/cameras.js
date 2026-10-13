/* ════════════════════════════════════════════════════════════════════════════════════════════════════════════
   camera/cameras.js — shot and transition modules. Each is a closed-form function of local time u (no integrator,
   no state), so composing cameras can never break the clock law. A shot returns {x, y, z}: the world point at the
   screen centre and the zoom. Cameras never draw (law HOUSE); the Material reads S.cam.
   Sources: INTERVIEW Q3 (run/NOTES log pull-back 48 px → 2.2 px; marbling log-zoom dolly; margin "camera follows
   the pen"; bunraku "the address reads only in the medium shot"; escapement "stay in 3D, no cuts").
   ════════════════════════════════════════════════════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';
  const AM = root.AM, C = AM.cam, U = () => root.Atelier.U;

  /** hold on a focus rect (the macro shot of the Trace) */
  AM.camera({
    id: 'frameFocus', in: { focus: 'Focus' }, out: { shot: 'Shot' }, durDefault: 20, dur: P => P.dur ?? 20,
    doc: 'Frames a focus rect with margin m (default 1.25), optionally placing it at screen point `screenAt` and drifting in by `drift` (1.0 = none) over the shot.',
    build(P, ins) { const f = C.frame(ins.focus, P.margin ?? 1.25); if (P.screenAt) { f.x -= (P.screenAt[0] - 480) / f.z; f.y -= (P.screenAt[1] - 270) / f.z; } return { out: { shot: true }, self: { f, drift: P.drift ?? 1.04 } }; },
    shot(u, self, dur) { const e = U().ease.inOut(U().clamp(u / dur)); return { x: self.f.x, y: self.f.y, z: self.f.z * (1 + (self.drift - 1) * e) }; },
  });

  /** macro → mass: log-zoom from a focus framing to the identity frame */
  AM.camera({
    id: 'pullBack', in: { focus: 'Focus' }, out: { shot: 'Shot' }, durDefault: 6, dur: P => P.dur ?? 6,
    doc: 'Log-space dolly (a pull-back feels linear in log z) from the focus framing to the full stage; the frame centre slides at the rate the extent changes, so the focus never leaves the frame.',
    build(P, ins) { const a = C.frame(ins.focus, P.margin ?? 1.25); if (P.screenAt) { a.x -= (P.screenAt[0] - 480) / a.z; a.y -= (P.screenAt[1] - 270) / a.z; } return { out: { shot: true }, self: { a, b: Object.assign({}, C.I, P.to || {}), hold: P.hold ?? 0.6 } }; },
    shot(u, self, dur) { const e = U().ease.inOut(U().clamp((u - self.hold) / (dur - self.hold))); return C.mix(self.a, self.b, e); },
  });

  /** crane: minimum-jerk move between two framings */
  AM.camera({
    id: 'crane', in: {}, out: { shot: 'Shot' }, durDefault: 4, dur: P => P.dur ?? 4,
    doc: 'Minimum-jerk (Flash & Hogan) move between two explicit framings {x, y, z}; log-zoom when z changes.',
    build(P) { return { out: { shot: true }, self: { a: Object.assign({}, C.I, P.from || {}), b: Object.assign({}, C.I, P.to || {}) } }; },
    shot(u, self, dur) { return C.mix(self.a, self.b, U().ease.hand(U().clamp(u / dur))); },
  });

  /** push in on an address, hold, return */
  AM.camera({
    id: 'addressZoom', in: { focus: 'Focus' }, out: { shot: 'Shot' }, durDefault: 5, dur: P => P.dur ?? 5,
    doc: 'Push in on a focus (a failure address) to zoom z (default: frame it), hold, and return to the identity frame. In 25 %, hold 50 %, out 25 % of the shot.',
    build(P, ins) { const f = C.frame(ins.focus, P.margin ?? 3); return { out: { shot: true }, self: { f: P.z ? Object.assign({}, f, { z: P.z }) : f } }; },
    shot(u, self, dur) { const q = U().clamp(u / dur), e = q < 0.25 ? U().ease.inOut(q / 0.25) : q > 0.75 ? U().ease.inOut((1 - q) / 0.25) : 1; return C.mix(C.I, self.f, e); },
  });

  /** rack focus / onion skin: a transition weight, not a framing (consumed by twins as Mix) */
  AM.camera({
    id: 'rackFocus', in: {}, out: { mix: 'Mix', shot: 'Shot' }, durDefault: 2, dur: P => P.dur ?? 2,
    doc: 'Outputs a weight 0 → 1 (eased) for an onion-skin hand-off between two states of one object (e.g. the unchecked world fading to a ghost as the checked one sharpens). Holds the current framing.',
    build(P) { return { out: { mix: true, shot: true }, self: { hold: Object.assign({}, C.I, P.at || {}) } }; },
    shot(u, self) { return self.hold; },
    mix(u, self, dur) { return U().ease.inOut(U().clamp(u / dur)); },
  });
})(typeof window !== 'undefined' ? window : globalThis);
