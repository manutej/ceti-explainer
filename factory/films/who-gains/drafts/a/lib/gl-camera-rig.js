/* arsenal/patterns/gl-camera-rig · a keyframed camera instrument for p5 WEBGL (renderer: webgl)
   A rig is a SCRIPT: a start pose + moves (orbit, dolly, crane, lookat, focus, key, cut), each with t0/t1 and a timeline ease.
   compile(script, scene) -> keys {t, eye, center, up, fov, zoom, focus, aperture}; at(rig, t) -> pose (pure of t).
   Between keys: 'slerp' (p5.Camera.slerp's own rule, in plain math: pivot point, rotation slerp, geometric distance),
   'orbit' (spherical about the centre, any angle), 'track' (eye and centre on straight lines: the crane).
   toKnobs / fromKnobs: the script as kit2 knobs + knobs_doc rows. worldToScreen(pose, pt, W, H): pins without p5.
   The demo scene (300 baked boxes, Lambert + focus cue shader, plan-view path overlay) is draw(); the rig is .rig. */
(function () {
  const A = (window.ARSENAL = window.ARSENAL || { patterns: {}, structures: {}, materials: {}, brands: {} });
  /* eases: arsenal/core/timeline.js (ARSENAL.core.timeline.ease); the copy below is used only if the core is not loaded */
  const EASE_COPY = {
    linear: (u) => u, smooth: (u) => u * u * (3 - 2 * u), in: (u) => u * u * u, out: (u) => 1 - Math.pow(1 - u, 3),
    inout: (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2), expo: (u) => (u >= 1 ? 1 : 1 - Math.pow(2, -10 * u)),
    back: (u) => 1 + 2.70158 * Math.pow(u - 1, 3) + 1.70158 * Math.pow(u - 1, 2), step: (u) => (u >= 1 ? 1 : 0),
  };
  const EASES = () => (A.core && A.core.timeline && A.core.timeline.ease) || EASE_COPY;
  const EASE_NAMES = ['linear', 'smooth', 'in', 'out', 'inout', 'expo', 'back', 'step'];
  const easeOf = (name) => EASES()[name || 'inout'] || EASES().inout;

  function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, u) => a + (b - a) * u;
  const geo = (a, b, u) => (a > 0 && b > 0 ? a * Math.pow(b / a, u) : lerp(a, b, u));
  const D2R = Math.PI / 180, R2D = 180 / Math.PI;
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const len = (a) => Math.hypot(a[0], a[1], a[2]), nrm = (a) => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const mix = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];
  const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  /* ── camera basis, exactly as p5's camera(): z = eye - centre, x = up × z, y = z × x ─────────────────────────── */
  function basis(eye, center, up) {
    const z = nrm(sub(eye, center)); let x = cross(up, z);
    if (len(x) < 1e-9) x = cross([0, 0, -1], z);
    x = nrm(x); return { x, y: cross(z, x), z };
  }
  function quatOf(B0, B1) {                    // rotation R with R·b0_k = b1_k, as a unit quaternion [w, x, y, z], w >= 0
    const R = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    for (const k of ['x', 'y', 'z']) for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) R[i][j] += B1[k][i] * B0[k][j];
    const tr = R[0][0] + R[1][1] + R[2][2]; let w, x, y, z, S;
    if (tr > 0) { S = Math.sqrt(tr + 1) * 2; w = 0.25 * S; x = (R[2][1] - R[1][2]) / S; y = (R[0][2] - R[2][0]) / S; z = (R[1][0] - R[0][1]) / S; }
    else if (R[0][0] > R[1][1] && R[0][0] > R[2][2]) { S = Math.sqrt(1 + R[0][0] - R[1][1] - R[2][2]) * 2; w = (R[2][1] - R[1][2]) / S; x = 0.25 * S; y = (R[0][1] + R[1][0]) / S; z = (R[0][2] + R[2][0]) / S; }
    else if (R[1][1] > R[2][2]) { S = Math.sqrt(1 + R[1][1] - R[0][0] - R[2][2]) * 2; w = (R[0][2] - R[2][0]) / S; x = (R[0][1] + R[1][0]) / S; y = 0.25 * S; z = (R[1][2] + R[2][1]) / S; }
    else { S = Math.sqrt(1 + R[2][2] - R[0][0] - R[1][1]) * 2; w = (R[1][0] - R[0][1]) / S; x = (R[0][2] + R[2][0]) / S; y = (R[1][2] + R[2][1]) / S; z = 0.25 * S; }
    return w < 0 ? [-w, -x, -y, -z] : [w, x, y, z];
  }
  function rotate(v, k, a) {                   // Rodrigues: v about unit axis k by angle a
    const c = Math.cos(a), s = Math.sin(a), kv = cross(k, v), kd = dot(k, v) * (1 - c);
    return [v[0] * c + kv[0] * s + k[0] * kd, v[1] * c + kv[1] * s + k[1] * kd, v[2] * c + kv[2] * s + k[2] * kd];
  }

  /* ── interpolation schemes between two keys (s = eased progress, may overshoot with 'back') ─────────────────── */
  function scalars(a, b, s) {
    return { fov: 2 * Math.atan(geo(Math.tan(a.fov / 2), Math.tan(b.fov / 2), s)), zoom: geo(a.zoom, b.zoom, s), focus: geo(a.focus, b.focus, s), aperture: lerp(a.aperture, b.aperture, s) };
  }
  function slerpPose(a, b, s) {                // p5.Camera.slerp's rule (2.3.4 source), so a rig move = a webgl-scene key move
    const d0 = len(sub(a.eye, a.center)), d1 = len(sub(b.eye, b.center)), u = geo(d0, d1, s);
    const l = sub(a.eye, b.eye), c = add(sub(l, a.center), b.center), cc = dot(c, c);
    const d = cc > 1e-6 ? clamp(dot(l, c) / cc) : 1;             // pivot: d = 0 pans about the eye, d = 1 orbits the centre
    const f = mix(mix(a.eye, a.center, d), mix(b.eye, b.center, d), s);
    const B0 = basis(a.eye, a.center, a.up), B1 = basis(b.eye, b.center, b.up), q = quatOf(B0, B1);
    const half = Math.acos(clamp(q[0], -1, 1)), sh = Math.sin(half); let z, y;
    if (sh < 1e-7) { z = nrm(mix(B0.z, B1.z, s)); y = nrm(mix(B0.y, B1.y, s)); }
    else { const k = [q[1] / sh, q[2] / sh, q[3] / sh], ang = 2 * half * s; z = rotate(B0.z, k, ang); y = rotate(B0.y, k, ang); }
    return Object.assign({ eye: add(f, mul(z, d * u)), center: add(f, mul(z, (d - 1) * u)), up: y, pivot: d }, scalars(a, b, s));
  }
  function trackPose(a, b, s) { return Object.assign({ eye: mix(a.eye, b.eye, s), center: mix(a.center, b.center, s), up: nrm(mix(a.up, b.up, s)) }, scalars(a, b, s)); }
  const sph = (az, el, r) => [r * Math.cos(el) * Math.sin(az), -r * Math.sin(el), r * Math.cos(el) * Math.cos(az)];
  function sphOf(eye, c) { const v = sub(eye, c), r = len(v) || 1; return { r, az: Math.atan2(v[0], v[2]), el: Math.asin(clamp(-v[1] / r, -1, 1)) }; }
  function orbitPose(a, b, s, o) {
    const center = mix(o.c0, o.c1, s), eye = add(center, sph(o.az0 + o.daz * s, lerp(o.el0, o.el1, s), geo(o.r0, o.r1, s)));
    return Object.assign({ eye, center, up: a.up }, scalars(a, b, s));
  }

  /* ── script -> keys ────────────────────────────────────────────────────────────────────────────────────────────── */
  function resolveIdx(spec, scene) {
    const N = scene && scene.points ? scene.points.length : 0; if (!N) return -1;
    if (typeof spec === 'number') return Math.round(clamp(spec, 0, N - 1));
    const ord = scene.order || scene.points.map((_, i) => i);
    if (spec === 'max') return ord[0]; if (spec === 'min') return ord[ord.length - 1]; if (spec === 'median') return ord[Math.floor(ord.length / 2)];
    return -1;
  }
  function resolvePt(spec, scene) {
    if (Array.isArray(spec)) return spec.slice(0, 3);
    const i = resolveIdx(spec, scene); return i < 0 ? null : scene.points[i].slice(0, 3);
  }
  const depthOf = (pt, pose) => dot(sub(pt, pose.eye), nrm(sub(pose.center, pose.eye)));
  const SCHEME = { orbit: 'orbit', crane: 'track', cut: 'cut', dolly: 'slerp', lookat: 'slerp', focus: 'slerp', key: 'slerp' };

  function endPose(P, m, scene) {
    const Q = { eye: P.eye.slice(), center: P.center.slice(), up: P.up.slice(), fov: P.fov, zoom: P.zoom, focus: P.focus, aperture: P.aperture };
    let orbit = null, target = null;
    if (m.move === 'orbit') {
      const c1 = m.around != null ? resolvePt(m.around, scene) || P.center : P.center, o = sphOf(P.eye, P.center);
      const el1 = m.el != null ? clamp(m.el, -89, 89) * D2R : o.el, r1 = o.r * (m.r == null ? 1 : m.r);
      orbit = { c0: P.center.slice(), c1, az0: o.az, daz: (m.az || 0) * D2R, el0: o.el, el1, r0: o.r, r1 };
      Q.center = c1.slice(); Q.eye = add(c1, sph(o.az + orbit.daz, el1, r1));
    } else if (m.move === 'dolly') {
      const dir = nrm(sub(P.eye, P.center)), d0 = len(sub(P.eye, P.center)), d1 = m.dist != null ? m.dist : d0 * (m.factor == null ? 1 : m.factor);
      Q.eye = add(P.center, mul(dir, d1));
      if (m.vertigo) Q.fov = 2 * Math.atan(Math.tan(P.fov / 2) * d0 / d1);   // subject width at the centre held constant
    } else if (m.move === 'crane') {
      const rise = m.rise || 0, fol = m.follow == null ? 0 : m.follow;
      Q.eye = add(P.eye, [0, -rise, 0]); Q.center = add(P.center, [0, -rise * fol, 0]);
    } else if (m.move === 'lookat') {
      target = resolvePt(m.target, scene); if (!target) throw new Error('gl-camera-rig: lookat ' + m.id + ' has no target');
      Q.center = target.slice();
      if (m.dist) Q.eye = add(target, mul(nrm(sub(P.eye, target)), m.dist));   // dist 0 / absent: pan from the eye
    } else if (m.move === 'focus') {
      const pt = m.target != null ? resolvePt(m.target, scene) : null; target = pt;
      Q.focus = pt ? Math.max(1, depthOf(pt, P)) : m.dist != null ? m.dist : P.focus;
    } else if (m.move === 'key' || m.move === 'cut') {
      if (m.eye) Q.eye = m.eye.slice(); if (m.center) Q.center = m.center.slice(); if (m.up) Q.up = m.up.slice();
    } else throw new Error('gl-camera-rig: unknown move ' + m.move);
    if (m.fov != null && !m.vertigo) Q.fov = m.fov * D2R;
    if (m.zoom != null) Q.zoom = m.zoom;
    if (m.aperture != null) Q.aperture = m.aperture;
    if (m.move !== 'focus') {
      const f = m.focus;
      if (f == null || f === 'center') Q.focus = len(sub(Q.eye, Q.center));
      else if (typeof f === 'number') Q.focus = f;
      else if (f !== 'hold') { const pt = resolvePt(f, scene); if (pt) Q.focus = Math.max(1, depthOf(pt, Q)); }
    }
    return { Q, orbit, target };
  }

  function compile(script, scene) {
    const s0 = script.start || {}, eye = (s0.eye || [0, 0, 800]).slice(), center = (s0.center || [0, 0, 0]).slice();
    const P0 = { eye, center, up: (s0.up || [0, 1, 0]).slice(), fov: (s0.fov == null ? 45 : s0.fov) * D2R, zoom: s0.zoom == null ? 1 : s0.zoom,
      aperture: s0.aperture == null ? 0 : s0.aperture, focus: typeof s0.focus === 'number' ? s0.focus : len(sub(eye, center)) };
    if (s0.focusAt != null) { const pt = resolvePt(s0.focusAt, scene); if (pt) P0.focus = Math.max(1, depthOf(pt, P0)); }   // focusAt: data index | 'max' | [x,y,z]
    const moves = (script.moves || []).map((m, i) => Object.assign({ id: m.move + (i + 1), ease: 'inout' }, m))
      .map((m) => Object.assign(m, { t1: m.move === 'cut' ? m.t0 : m.t1 })).sort((a, b) => a.t0 - b.t0);
    const ids = new Set();
    moves.forEach((m, i) => {
      if (ids.has(m.id)) throw new Error('gl-camera-rig: move id ' + m.id + ' twice'); ids.add(m.id);
      if (!(m.t1 >= m.t0)) throw new Error('gl-camera-rig: move ' + m.id + ' ends before it starts');
      if (i && m.t0 < moves[i - 1].t1 - 1e-9) throw new Error('gl-camera-rig: move ' + m.id + ' overlaps ' + moves[i - 1].id);
    });
    const keys = [Object.assign({ t: 0, move: 'start', id: 'start' }, P0)];
    let P = P0;
    for (const m of moves) {
      const { Q, orbit, target } = endPose(P, m, scene);
      keys.push(Object.assign({ t: m.t1, t0: m.t0, move: m.move, id: m.id, ease: m.ease, scheme: SCHEME[m.move], orbit, target }, Q));
      P = Q;
    }
    return Object.freeze({ script, proj: script.proj || 'persp', dur: script.dur || 12, near: script.near || 10, far: script.far || 9000, moves, keys });
  }

  function at(rig, t) {
    const K = rig.keys, M = rig.moves; let i = -1;
    for (let j = 0; j < M.length; j++) { if (t >= M[j].t0) i = j; else break; }
    const meta = (pose, k, u, s) => Object.assign(pose, { proj: rig.proj, i: k, move: K[k + 1] ? K[k + 1].move : 'hold', id: K[k + 1] ? K[k + 1].id : '', u, s, active: u > 0 && u < 1 });
    const copy = (k) => { const q = K[k]; return { eye: q.eye.slice(), center: q.center.slice(), up: q.up.slice(), fov: q.fov, zoom: q.zoom, focus: q.focus, aperture: q.aperture }; };
    if (i < 0) return meta(copy(0), -1, 0, 0);
    const m = M[i], a = K[i], b = K[i + 1];
    if (t >= m.t1) return meta(copy(i + 1), i, 1, 1);
    const u = (t - m.t0) / (m.t1 - m.t0), s = easeOf(m.ease)(u);
    const pose = b.scheme === 'orbit' ? orbitPose(a, b, s, b.orbit) : b.scheme === 'track' ? trackPose(a, b, s) : b.scheme === 'cut' ? copy(i + 1) : slerpPose(a, b, s);
    return meta(pose, i, u, s);
  }

  /* ── projection: p5's camera + perspective/ortho, and the same maths by hand for pins ────────────────────────── */
  function apply(p, cam, pose, rig) {
    const W = p.width, H = p.height;
    cam.camera(pose.eye[0], pose.eye[1], pose.eye[2], pose.center[0], pose.center[1], pose.center[2], pose.up[0], pose.up[1], pose.up[2]);
    if (rig.proj === 'ortho') { const z = pose.zoom || 1; cam.ortho(-W / 2 / z, W / 2 / z, -H / 2 / z, H / 2 / z, 0, rig.far); }
    else cam.perspective(pose.fov, W / H, rig.near, rig.far);
    return cam;
  }
  function worldToScreen(pose, pt, W, H) {     // sheet px, origin top-left (as p.worldToScreen); depth along the view axis
    const B = basis(pose.eye, pose.center, pose.up), v = sub(pt, pose.eye);
    const cx = dot(v, B.x), cy = dot(v, B.y), depth = -dot(v, B.z);
    let x, y;
    if (pose.proj === 'ortho') { const z = pose.zoom || 1; x = W / 2 + cx * z; y = H / 2 + cy * z; }
    else { const f = 1 / Math.tan(pose.fov / 2); x = W / 2 * (1 + (f * H / W) * cx / depth); y = H / 2 * (1 + f * cy / depth); }
    return { x, y, depth, on: depth > 0 && x >= 0 && x <= W && y >= 0 && y <= H };
  }
  function pxPerUnit(pose, depth, H) { return pose.proj === 'ortho' ? pose.zoom || 1 : (H / 2) / (Math.tan(pose.fov / 2) * Math.max(depth, 1e-6)); }
  /* for a depth-of-field post (gl-post): the focus plane as linear view depth and as the [0,1] value in the depth buffer */
  function dof(pose, rig) {
    const n = rig.near, f = rig.far, z = pose.focus;
    const buf = rig.proj === 'ortho' ? clamp(z / f) : clamp((f / (f - n)) * (1 - n / z));
    return { focus: z, aperture: pose.aperture, near: n, far: f, focusDepth01: buf, proj: rig.proj };
  }
  function sample(rig, n) { const out = []; for (let k = 0; k <= n; k++) { const t = rig.dur * k / n, q = at(rig, t); out.push({ t, eye: q.eye, center: q.center }); } return out; }

  /* ── knobs: the script as kit2 knobs_doc rows (one row per scalar a move carries) ─────────────────────────────── */
  const cap = (s) => String(s).replace(/[^A-Za-z0-9]+(.)?/g, (_, c) => (c ? c.toUpperCase() : '')).replace(/^./, (c) => c.toUpperCase());
  const XYZ = ['X', 'Y', 'Z'], COORD = [-6000, 6000];
  const SPEC = {             // param: [range | options, step, what]
    t0: [null, 0.1, 'start (s)'], t1: [null, 0.1, 'end (s)'], ease: [EASE_NAMES, null, 'ease (arsenal/core/timeline curves)'],
    az: [[-720, 720], 5, 'degrees swept round the centre'], el: [[-10, 89], 1, 'end elevation (deg above the centre)'], r: [[0.2, 5], 0.05, 'end radius as a factor of the start'],
    dist: [[0, 6000], 10, 'distance to the centre / target (world units; lookat 0 = pan from the eye)'], factor: [[0.05, 20], 0.05, 'distance factor'],
    vertigo: [[false, true], null, 'dolly zoom: fov compensates so the subject keeps its size'],
    rise: [[-3000, 3000], 10, 'eye rise (world units, + = up)'], follow: [[0, 1], 0.05, 'how much of the rise the aim follows (0 = keep the subject)'],
    target: [null, 1, 'data index the camera aims or focuses at'], focusAt: [null, 1, 'data index the start focus sits on'], aperture: [[0, 1], 0.05, 'focus blur strength (0 = all sharp)'],
    focus: [[1, 8000], 10, 'focus distance (world units)'], fov: [[5, 120], 1, 'vertical field of view (deg)'], zoom: [[0.1, 10], 0.05, 'ortho magnification'],
    eye: [COORD, 10, 'eye'], center: [COORD, 10, 'aim point'],
  };
  function rows(script, scene, opts) {
    const pre = (opts && opts.prefix) || 'cam', dur = script.dur || 12, N = scene && scene.points ? scene.points.length : 0, out = [];
    const row = (obj, key, idx, base, label) => {
      const sp = SPEC[key]; if (!sp) return;
      let v = idx == null ? obj[key] : obj[key][idx];
      const name = pre + cap(base) + cap(key) + (idx == null ? '' : XYZ[idx]);
      const r = { name, obj, key, idx, step: sp[1], what: label + ': ' + sp[2] + (idx == null ? '' : ' ' + 'xyz'[idx]) };
      if (key === 't0' || key === 't1') r.range = [0, dur];
      else if (key === 'target' || key === 'focusAt') { const i = resolveIdx(v, scene); if (i < 0) return; v = i; r.range = [0, Math.max(0, N - 1)]; r.resolved = true; }
      else if (key === 'focus' && typeof v !== 'number') return;
      else if (sp[0] && typeof sp[0][0] === 'number') r.range = sp[0].slice(); else r.options = sp[0].slice();
      if (r.range) { if (typeof v !== 'number') return; r.range = [Math.min(r.range[0], v), Math.max(r.range[1], v)]; }
      r.value = v; out.push(r);
    };
    const s0 = script.start || {};
    for (const k of ['eye', 'center']) if (s0[k]) for (let j = 0; j < 3; j++) row(s0, k, j, 'start', 'start pose');
    for (const k of ['fov', 'zoom', 'aperture', 'focus']) if (s0[k] != null) row(s0, k, null, 'start', 'start pose');
    if (s0.focusAt != null) row(s0, 'focusAt', null, 'start', 'start pose');
    (script.moves || []).forEach((m, i) => {
      const id = m.id || m.move + (i + 1), lab = id + ' (' + m.move + ')';
      for (const k of ['t0', 't1', 'ease']) if (m[k] != null || k === 'ease') { if (m.move === 'cut' && k === 't1') continue; if (m[k] == null) m[k] = 'inout'; row(m, k, null, id, lab); }
      for (const k in m) if (!['id', 'move', 't0', 't1', 'ease', 'up', 'around'].includes(k)) {
        if (Array.isArray(m[k]) && (k === 'eye' || k === 'center')) for (let j = 0; j < 3; j++) row(m, k, j, id, lab);
        else if (!Array.isArray(m[k])) row(m, k, null, id, lab);
      }
    });
    return out;
  }
  const clone = (o) => JSON.parse(JSON.stringify(o));
  function toKnobs(script, scene, opts) {
    const R = rows(clone(script), scene, opts), knobs = {}, knobs_doc = [];
    for (const r of R) {
      knobs[r.name] = r.value;
      const d = { name: r.name }; if (r.range) d.range = r.range; else d.options = r.options;
      if (r.step != null) d.step = r.step; d.what = 'camera rig · ' + r.what; knobs_doc.push(d);
    }
    return { knobs, knobs_doc };
  }
  function fromKnobs(script, knobs, scene, opts) {   // knobs: {name: value} or a function (name, current) -> value (K.knob)
    const out = clone(script); if (!knobs) return out;
    for (const r of rows(out, scene, opts)) {
      let v = typeof knobs === 'function' ? knobs(r.name, r.value) : knobs[r.name];
      if (v === undefined) continue;
      if (r.range) { if (typeof v !== 'number' || !isFinite(v)) continue; v = clamp(v, r.range[0], r.range[1]); if (r.key === 'target' || r.key === 'focusAt') v = Math.round(v); }
      else if (!r.options.includes(v)) continue;
      if (r.idx == null) r.obj[r.key] = v; else r.obj[r.key][r.idx] = v;
    }
    return out;
  }

  const rig = { compile, at, apply, worldToScreen, pxPerUnit, dof, sample, toKnobs, fromKnobs, rows, basis, slerpPose, eases: EASE_NAMES };

  /* ═════════════ the demo scene: 300 baked boxes, the moves as variants, the path as a flat plan overlay ═════════════ */
  const SCRIPTS = {
    orbit: { proj: 'persp', start: { eye: [-700, -360, 820], center: [0, -40, 0], fov: 40 },
      moves: [{ id: 'orbit', move: 'orbit', t0: 0.8, t1: 10.8, az: 240, el: 46, r: 0.8, ease: 'inout' }] },
    dolly: { proj: 'persp', start: { eye: [-420, -330, 1250], center: [0, -40, 0], fov: 38 },
      moves: [{ id: 'push', move: 'dolly', t0: 0.8, t1: 6.6, dist: 400, ease: 'inout' }, { id: 'pull', move: 'dolly', t0: 7.8, t1: 11.2, dist: 860, ease: 'smooth' }] },
    'dolly-zoom': { proj: 'persp', start: { eye: [0, -150, 1300], center: [0, -60, 0], fov: 18 },
      moves: [{ id: 'vertigo', move: 'dolly', t0: 1, t1: 10.5, dist: 330, vertigo: true, ease: 'inout' }] },
    crane: { proj: 'persp', start: { eye: [0, -14, 560], center: [0, -50, 0], fov: 50 },
      moves: [{ id: 'boom', move: 'crane', t0: 1, t1: 10, rise: 980, follow: 0.12, ease: 'inout' }] },
    'look-at': { proj: 'persp', start: { eye: [-620, -520, 760], center: [0, -40, 0], fov: 42 },
      moves: [{ id: 'aim', move: 'lookat', t0: 1, t1: 5, target: 'max', dist: 320, ease: 'inout' },
        { id: 'pan', move: 'lookat', t0: 6.5, t1: 10, target: 'min', ease: 'inout' }] },
    'focus-pull': { proj: 'persp', start: { eye: [-120, -300, 520], center: [0, -60, -20], fov: 44, aperture: 1, focusAt: 290 },
      moves: [{ id: 'rack', move: 'focus', t0: 2, t1: 5, target: 10, ease: 'inout' }, { id: 'back', move: 'focus', t0: 7.5, t1: 10, target: 150, ease: 'smooth' }] },
    'ortho-orbit': { proj: 'ortho', start: { eye: [600, -520, 600], center: [0, -40, 0], zoom: 0.95 },
      moves: [{ id: 'swing', move: 'orbit', t0: 0.8, t1: 6, az: 90, ease: 'inout' }, { id: 'aim', move: 'lookat', t0: 6.8, t1: 11, target: 'max', zoom: 2.2, ease: 'inout' }] },
    sequence: { proj: 'persp', start: { eye: [0, -16, 640], center: [0, -40, 0], fov: 48, aperture: 0.7 },
      moves: [{ id: 'rise', move: 'crane', t0: 0.4, t1: 3.4, rise: 560, follow: 0, ease: 'inout' },
        { id: 'swing', move: 'orbit', t0: 3.4, t1: 6.8, az: -110, ease: 'inout' },
        { id: 'aim', move: 'lookat', t0: 7, t1: 9.4, target: 'max', dist: 300, ease: 'inout' },
        { id: 'rack', move: 'focus', t0: 9.9, t1: 11.4, dist: 900, ease: 'inout' }] },
  };

  const VERT = 'precision highp float; attribute vec3 aPosition; attribute vec3 aNormal; uniform mat4 uModelViewMatrix; uniform mat4 uProjectionMatrix; varying vec3 vN; varying float vD;' +
    'void main(){ vN = aNormal; vec4 mv = uModelViewMatrix * vec4(aPosition, 1.0); vD = -mv.z; gl_Position = uProjectionMatrix * mv; }';
  const FRAG = 'precision highp float; varying vec3 vN; varying float vD; uniform vec3 uColor, uAmb, uKey, uRim, uKeyDir, uRimDir, uBg; uniform float uFocus, uAperture;' +
    'void main(){ vec3 n = normalize(vN); vec3 l = uAmb + uKey * max(dot(n, -uKeyDir), 0.0) + uRim * max(dot(n, -uRimDir), 0.0);' +
    ' float b = clamp(uAperture * 1.8 * (abs(vD - uFocus) / max(uFocus, 1.0) - 0.08), 0.0, 1.0); gl_FragColor = vec4(mix(uColor * l, uBg, 0.72 * b), 1.0); }';
  const rgb = (p, c) => { c = p.color(c); return [p.red(c) / 255, p.green(c) / 255, p.blue(c) / 255]; };

  function buildField(p, st, params) {
    let vals = params.data, cols = params.cols;
    if (Array.isArray(vals) && Array.isArray(vals[0])) { cols = vals[0].length; vals = [].concat(...vals); }
    if (!Array.isArray(vals) || !vals.length) {
      const rng = mulberry32(st.seed), ph = [rng() * 6.283, rng() * 6.283], n = params.cols * params.rows; vals = [];
      for (let i = 0; i < n; i++) { const u = (i % cols) / (cols - 1), v = Math.floor(i / cols) / (params.rows - 1);
        vals.push(clamp(0.5 + 0.3 * Math.sin(u * 4.4 + ph[0]) * Math.cos(v * 3.6 + ph[1]) + (rng() - 0.5) * 0.34, 0.04, 1)); }
    }
    const N = vals.length, rows = Math.ceil(N / cols), mx = Math.max(...vals.map(Math.abs)) || 1, cell = params.cell, bw = cell - params.gap;
    const val = vals.map((v) => Math.abs(v) / mx), hh = val.map((v) => params.hmin + v * params.hmax), pos = [];
    for (let i = 0; i < N; i++) pos.push([(i % cols - (cols - 1) / 2) * cell, (Math.floor(i / cols) - (rows - 1) / 2) * cell]);
    const order = val.map((_, i) => i).sort((a, b) => val[b] - val[a] || a - b), TIERS = 5, tiers = [];
    for (let j = 0; j < TIERS; j++) tiers.push(p.buildGeometry(() => {
      p.noStroke(); for (let m = Math.floor(j * N / TIERS); m < Math.floor((j + 1) * N / TIERS); m++) { const i = order[m]; p.push(); p.translate(pos[i][0], -hh[i] / 2, pos[i][1]); p.box(bw, hh[i], bw); p.pop(); }
    }));
    const points = pos.map((q, i) => [q[0], -hh[i], q[1]]);
    Object.assign(st, { N, cols, rows, val, hh, pos, bw, order, tiers, scene: { points, values: val, order },
      bounds: { x0: -(cols / 2) * cell, x1: (cols / 2) * cell, z0: -(rows / 2) * cell, z1: (rows / 2) * cell } });
  }

  async function loadFaces(p, tk, ctx) {
    if (ctx.fonts && ctx.fonts.disp) return ctx.fonts;
    const F = window.ARSENAL_FONTS; if (!F) return null;
    const keyOf = (r) => tk.type[r].family + '|' + tk.type[r].weight;
    const pick = (r, fb) => (F[keyOf(r)] ? keyOf(r) : fb);
    const keys = { disp: pick('disp', 'Big Shoulders Display|600'), mono: pick('mono', 'IBM Plex Mono|400') };
    const cache = (p.__glRigFonts = p.__glRigFonts || {}), out = { keys };
    for (const r of ['disp', 'mono']) { const k = keys[r]; if (!cache[k]) cache[k] = await p.loadFont(F[k]); out[r] = cache[k]; }
    out.fallback = keys.disp !== keyOf('disp') || keys.mono !== keyOf('mono');
    return out;
  }

  function drawField(p, st, pose, tk, params, targets) {
    const sh = st.sh, bg = p.color(tk.color.bg); p.shader(sh); p.noStroke();
    sh.setUniform('uAmb', rgb(p, p.lerpColor(bg, p.color(tk.color.muted), 0.55)));
    sh.setUniform('uKey', rgb(p, tk.color.chalk).map((x) => x * 0.9));
    sh.setUniform('uRim', rgb(p, p.lerpColor(bg, p.color(tk.color.accent2), 0.55)));
    sh.setUniform('uKeyDir', nrm([-0.45, 0.8, -0.4])); sh.setUniform('uRimDir', nrm([0.7, 0.3, 0.6]));
    sh.setUniform('uBg', rgb(p, tk.color.bg)); sh.setUniform('uFocus', pose.focus); sh.setUniform('uAperture', pose.aperture * params.focusCue);
    const lo = p.lerpColor(bg, p.color(tk.color.muted), 0.7), hi = p.color(tk.color.ink);
    for (let j = 0; j < st.tiers.length; j++) { sh.setUniform('uColor', rgb(p, p.lerpColor(hi, lo, j / (st.tiers.length - 1)))); p.model(st.tiers[j]); }
    for (const tg of targets) { const i = tg.i; sh.setUniform('uColor', rgb(p, tg.col)); p.push(); p.translate(st.pos[i][0], -st.hh[i] / 2, st.pos[i][1]); p.box(st.bw + 2, st.hh[i] + 2, st.bw + 2); p.pop(); }
    sh.setUniform('uColor', rgb(p, p.lerpColor(bg, p.color(tk.color.panel), 0.9)));
    if (params.ground) { const b = st.bounds, g = params.ground; p.push(); p.translate(0, 1, 0); p.box(b.x1 - b.x0 + 2 * g, 2, b.z1 - b.z0 + 2 * g); p.pop(); }   // a pad, not a horizon: full-screen fill is the cost on software GL
    p.resetShader();
  }

  function count(st, pose, W, H) { let n = 0; for (const q of st.scene.points) if (worldToScreen(pose, q, W, H).on) n++; return n; }

  function overlay(p, st, pose, t, tk, params, targets, nIn) {
    const W = p.width, H = p.height, ox = -W / 2, oy = -H / 2, f = st.fonts, R = st.rig;
    p.push(); p.resetMatrix(); p.noLights(); p.setCamera(st.hud); p.drawingContext.clear(p.drawingContext.DEPTH_BUFFER_BIT);
    const col = (c, a) => { c = p.color(c); c.setAlpha(255 * (a == null ? 1 : a)); return c; };
    const txt = (s, x, y, size, c, font, al, a) => { if (!f) return; p.noStroke(); p.fill(col(c, a)); p.textFont(font); p.textSize(size); p.textAlign(al || p.LEFT, p.BASELINE); p.text(s, x + ox - (al === p.RIGHT ? 2000 : 0), y + oy, 2000); };
    const ln = (x0, y0, x1, y1) => p.line(x0 + ox, y0 + oy, x1 + ox, y1 + oy);
    // pins (rig.worldToScreen, no p5 projection needed)
    for (const tg of targets) {
      const v = worldToScreen(pose, st.scene.points[tg.i], W, H); if (!v.on || (params.overlay && v.x > W - 300 && v.y < 236) || v.x > W - 120) continue;
      const lx = v.x + 22, ly = v.y - 30; p.stroke(col(tg.col)); p.strokeWeight(1.5); ln(v.x, v.y, lx, ly); p.noStroke(); p.fill(col(tg.col)); p.circle(v.x + ox, v.y + oy, 7);
      txt('v = ' + st.val[tg.i].toFixed(2), lx + 4, ly - 4, 22, tg.col, f && f.disp); txt(tg.label, lx + 4, ly + 12, 12, tk.color.muted, f && f.mono);
    }
    if (!params.overlay) { p.pop(); return; }
    p.noStroke(); p.fill(col(tk.color.bg, 0.72)); p.rect(24 + ox, 24 + oy, 400, 118); p.rect(24 + ox, H - 112 + oy, 400, 76);
    // plan inset: the rig's eye path seen from above (x right, z down), traversed part in accent, keys ticked, frustum wedge
    const pw = 236, ph = 176, px = W - 32 - pw, py = 32, B = st.plan;
    p.noStroke(); p.fill(col(tk.color.panel, 0.88)); p.rect(px + ox, py + oy, pw, ph);
    const mp = (q) => [px + B.ox + (q[0] - B.x0) * B.s, py + B.oz + (q[2] - B.z0) * B.s];
    const a0 = mp([st.bounds.x0, 0, st.bounds.z0]), a1 = mp([st.bounds.x1, 0, st.bounds.z1]);
    p.noFill(); p.stroke(col(tk.color.muted, 0.7)); p.strokeWeight(1); p.rect(a0[0] + ox, a0[1] + oy, a1[0] - a0[0], a1[1] - a0[1]);
    const S = st.path, kNow = Math.min(S.length - 1, Math.floor(t / R.dur * (S.length - 1)));
    p.strokeWeight(1.5);
    for (let k = 1; k < S.length; k++) { const q0 = mp(S[k - 1].eye), q1 = mp(S[k].eye); p.stroke(k <= kNow ? col(tk.color.accent) : col(tk.color.muted, 0.6)); ln(q0[0], q0[1], q1[0], q1[1]); }
    for (const k of R.keys) { const q = mp(k.eye); p.noStroke(); p.fill(col(tk.color.ink, 0.9)); p.rect(q[0] - 2 + ox, q[1] - 2 + oy, 4, 4); }
    const e = mp(pose.eye), c = mp(pose.center), fw = nrm([pose.center[0] - pose.eye[0], 0, pose.center[2] - pose.eye[2]]);
    const hf = pose.proj === 'ortho' ? 0.16 : Math.atan(Math.tan(pose.fov / 2) * W / H);
    p.stroke(col(tk.color.ink)); p.strokeWeight(1);
    for (const sg of [-1, 1]) { const ca = Math.cos(hf * sg), sa = Math.sin(hf * sg), d = [fw[0] * ca - fw[2] * sa, fw[0] * sa + fw[2] * ca]; ln(e[0], e[1], e[0] + d[0] * 44, e[1] + d[1] * 44); }
    p.stroke(col(tk.color.accent2)); ln(c[0] - 4, c[1], c[0] + 4, c[1]); ln(c[0], c[1] - 4, c[0], c[1] + 4);
    p.noStroke(); p.fill(col(tk.color.accent)); p.circle(e[0] + ox, e[1] + oy, 7);
    txt('PLAN · EYE PATH', px + 12, py + ph - 10, 11, tk.color.muted, f && f.mono);
    // move strip: one segment per move on the clock, playhead, the active ease curve
    const sx0 = 36, sx1 = W - 36, sy = H - 26, X = (tt) => sx0 + (sx1 - sx0) * tt / R.dur;
    p.stroke(col(tk.color.muted, 0.5)); p.strokeWeight(1); ln(sx0, sy, sx1, sy);
    R.moves.forEach((m, i) => {
      const on = t >= m.t0 && t < Math.max(m.t1, m.t0 + 0.2); p.stroke(col(on ? tk.color.accent : tk.color.ink, on ? 1 : 0.55)); p.strokeWeight(4); ln(X(m.t0), sy, Math.max(X(m.t1), X(m.t0) + 3), sy);
      txt(m.id.toUpperCase(), X(m.t0), sy - 9, 11, on ? tk.color.accent : tk.color.muted, f && f.mono);
    });
    p.stroke(col(tk.color.ink)); p.strokeWeight(1.5); ln(X(t), sy - 7, X(t), sy + 7);
    // readout: the move, its ease, the pose numbers
    const mv = pose.i >= 0 && pose.u < 1 ? R.moves[pose.i] : null, name = mv ? mv.move.toUpperCase() + ' · ' + mv.id : pose.i < 0 ? 'START' : 'HOLD';
    txt(name, 36, 58, 30, tk.color.ink, f && f.disp);
    const ex = 36, ey = 70, ew = 62, eh = 34; p.noFill(); p.stroke(col(tk.color.muted, 0.6)); p.strokeWeight(1);
    p.beginShape(); for (let k = 0; k <= 24; k++) { const u = k / 24, s = easeOf(mv ? mv.ease : 'linear')(u); p.vertex(ex + u * ew + ox, ey + eh - s * eh + oy); } p.endShape();
    if (mv) { p.noStroke(); p.fill(col(tk.color.accent)); p.circle(ex + pose.u * ew + ox, ey + eh - pose.s * eh + oy, 6); }
    txt((mv ? mv.ease : '-').toUpperCase() + ' EASE', ex + ew + 10, ey + eh, 11, tk.color.muted, f && f.mono);
    const dist = len(sub(pose.eye, pose.center));
    txt('EYE HEIGHT ' + Math.round(-pose.eye[1]) + ' · DIST ' + Math.round(dist) + (pose.proj === 'ortho' ? ' · ZOOM ' + pose.zoom.toFixed(2) : ' · FOV ' + Math.round(pose.fov * R2D) + '°') +
      (pose.aperture > 0 ? ' · FOCUS ' + Math.round(pose.focus) : ''), 36, ey + eh + 22, 11, tk.color.muted, f && f.mono);
    // the count: boxes whose top is in frame, of all boxes
    txt(fmt(nIn), 36, H - 62, 54, tk.color.accent, f && f.disp);
    txt('OF ' + fmt(st.N) + ' BOXES IN FRAME · ' + (pose.proj === 'ortho' ? 'ORTHOGRAPHIC' : 'PERSPECTIVE'), 38, H - 44, 12, tk.color.muted, f && f.mono);
    p.pop();
  }

  A.patterns['gl-camera-rig'] = {
    id: 'gl-camera-rig', atlas: ['p5-camera', 'camera-slerp', 'camera-choreography', 'easing-functions', 'world-to-screen', 'build-geometry', 'webgl-mode', 'frontier-2026'],
    renderer: 'webgl', rig, scripts: SCRIPTS,
    params: { rig: 'orbit', script: null, knobs: null, dur: 12, data: null, cols: 20, rows: 15, cell: 34, gap: 6, hmin: 10, hmax: 170,
      focusCue: 1, overlay: true, ground: 40, engine: 'rig' },
    variants: [
      { name: 'orbit', params: { rig: 'orbit' } }, { name: 'dolly', params: { rig: 'dolly' } }, { name: 'dolly-zoom', params: { rig: 'dolly-zoom' } },
      { name: 'crane', params: { rig: 'crane' } }, { name: 'look-at', params: { rig: 'look-at' } }, { name: 'focus-pull', params: { rig: 'focus-pull' } },
      { name: 'ortho-orbit', params: { rig: 'ortho-orbit' } }, { name: 'sequence', params: { rig: 'sequence' } },
      { name: 'orbit-lite', params: { rig: 'orbit', overlay: false, ground: 0, focusCue: 0 } },
    ],
    async setup(p, ctx, params) {
      const tk = ctx.tokens || (A.brands && A.brands['ceti-dark']);
      const st = { seed: ctx.seed == null ? 7 : ctx.seed }; buildField(p, st, params);
      let script = clone(params.script || SCRIPTS[params.rig]); script.dur = params.dur;
      if (params.knobs) script = fromKnobs(script, params.knobs, st.scene);
      st.script = script; st.rig = compile(script, st.scene);
      st.targets = []; const sf = resolveIdx(script.start && script.start.focusAt, st.scene); if (sf >= 0) st.targets.push({ i: sf, move: 'focus' });
      for (const m of st.rig.moves) if (m.target != null) { const i = resolveIdx(m.target, st.scene); if (i >= 0 && !st.targets.some((q) => q.i === i)) st.targets.push({ i, move: m.move }); }
      if (!st.targets.length) st.targets.push({ i: st.scene.order[0], move: 'max' });
      st.path = sample(st.rig, 160);
      let x0 = st.bounds.x0, x1 = st.bounds.x1, z0 = st.bounds.z0, z1 = st.bounds.z1;
      for (const q of st.path) { x0 = Math.min(x0, q.eye[0]); x1 = Math.max(x1, q.eye[0]); z0 = Math.min(z0, q.eye[2]); z1 = Math.max(z1, q.eye[2]); }
      const sc = Math.min((236 - 28) / (x1 - x0), (176 - 44) / (z1 - z0));
      st.plan = { x0, z0, s: sc, ox: (236 - (x1 - x0) * sc) / 2, oz: 10 + (176 - 30 - (z1 - z0) * sc) / 2 };
      st.sh = p.createShader(VERT, FRAG); st.work = p.createCamera(); st.hud = p.createCamera();   // hud = p5's default camera: 1 unit = 1 px at z = 0
      if (params.engine === 'p5') st.kcams = st.rig.keys.map((k) => { const c = p.createCamera(); c.camera(...k.eye, ...k.center, ...k.up); return c; });
      st.fonts = await loadFaces(p, tk, ctx);
      return st;
    },
    count(t, st, W, H) { return count(st, at(st.rig, t), W || 960, H || 540); },
    draw(p, t, st, params, tk) {
      const W = p.width, H = p.height, R = st.rig;
      p.background(tk.color.bg);
      const pose = at(R, t); apply(p, st.work, pose, R);
      if (params.engine === 'p5' && pose.i >= 0 && pose.u > 0 && pose.u < 1 && R.keys[pose.i + 1].scheme === 'slerp') {
        st.work.slerp(st.kcams[pose.i], st.kcams[pose.i + 1], pose.s);       // p5's own slerp for the same segment (cross-check)
        if (R.proj === 'ortho') st.work.ortho(-W / 2 / pose.zoom, W / 2 / pose.zoom, -H / 2 / pose.zoom, H / 2 / pose.zoom, 0, R.far); else st.work.perspective(pose.fov, W / H, R.near, R.far);
      }
      p.setCamera(st.work); p.noLights();
      const targets = st.targets.map((q, n) => ({ i: q.i, col: n === 0 ? tk.color.accent : tk.color.accent2,
        label: (q.move === 'focus' ? 'FOCUS · ' : '') + 'RANK ' + fmt(st.scene.order.indexOf(q.i) + 1) + ' OF ' + fmt(st.N) }));
      drawField(p, st, pose, tk, params, targets);
      const nIn = count(st, pose, W, H);
      overlay(p, st, pose, t, tk, params, targets, nIn);
      return { count: nIn, of: st.N, move: pose.move, id: pose.id, u: pose.u, eye: pose.eye, focus: pose.focus };
    },
  };
})();
