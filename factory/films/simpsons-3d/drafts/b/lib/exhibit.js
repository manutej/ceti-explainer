/* lib/exhibit.js · DRAFTER B · "the exhibit": the 3D gallery for the Simpson's film.
   Techniques adapted from arsenal/patterns/webgl-scene (baked buildGeometry boxes, one role-fed Lambert shader, keyed cameras,
   worldToScreen pins) and arsenal/materials/shader (the two-spiral neon glow); keyed camera tracks go through
   ARSENAL.patterns.camera.api.sample; the headline contour morph is arsenal/patterns/morph-type's kernel (P.kit).
   Everything here is a pure function of t and the knobs. Nothing reads a clock. Units: one box cell = 10 world units,
   p5 WEBGL axes (y DOWN: up is negative y), floor at y = 0, camera = target + dist * (az, el). */
(function () {
  'use strict';
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, u) => a + (b - a) * u;
  const sstep = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); };
  const eio = (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
  const DEG = Math.PI / 180;
  const D6 = ['A', 'B', 'C', 'D', 'E', 'F'];
  const FX = 10, FZ = 6, PL = FX * FZ;           // footprint of every slab: 10 x 6 boxes = 60 per layer
  const CELL = 10, PAD = 6;                      // box pitch; plinth height

  /* ───────────── shaders (GLSL ES 1.00; roles come in as uniforms, no hex in a shader) ───────────── */
  const VERT = 'precision highp float; attribute vec3 aPosition; attribute vec3 aNormal; uniform mat4 uModelViewMatrix; uniform mat4 uProjectionMatrix;' +
    'uniform vec3 uOff; varying vec3 vN; varying vec3 vW; varying float vD;' +
    'void main(){ vN = aNormal; vW = aPosition + uOff; vec4 v = uModelViewMatrix * vec4(aPosition, 1.0); vD = -v.z; gl_Position = uProjectionMatrix * v; }';
  const FRAG_COMMON = 'precision highp float; varying vec3 vN; varying vec3 vW; varying float vD;' +
    'uniform vec3 uColor, uHotCol, uAmb, uKey, uFill, uLP, uBg, uFloorCol;' +
    'uniform float uClip, uGlowY, uHotBand, uHot, uEmis, uLR, uFogK, uFocusZ, uFocusAmt, uFocusR, uMirror, uReflect, uAlpha, uSurf, uBoost;' +
    'float hash(vec2 p){ p = fract(p * vec2(443.897, 441.423)); p += dot(p, p.yx + 19.19); return fract((p.x + p.y) * p.x * p.y * 43.758); }';
  const FRAG = FRAG_COMMON +
    'void main(){' +
    '  float wy = -vW.y; if (wy > uClip) discard;' +
    '  vec3 n = normalize(vN); vec3 ld = uLP - vW; float dl = length(ld); ld /= dl;' +
    '  float att = 1.0 / (1.0 + (dl * dl) / (uLR * uLR));' +
    '  float fo = mix(1.0, mix(0.34, 1.12, exp(-pow((vW.z - uFocusZ) / uFocusR, 2.0))), uFocusAmt);' +
    '  float key = max(dot(n, ld), 0.0) * att * fo;' +
    '  float fill = max(dot(n, normalize(vec3(-0.6, -0.25, 0.5))), 0.0);' +
    '  float hot = uHot * (1.0 - smoothstep(uGlowY - uHotBand, uGlowY, wy));' +
    '  vec3 base = mix(uColor, uHotCol, hot);' +
    '  vec3 col = base * (uAmb + uKey * key + uFill * fill * fo) + uHotCol * hot * uEmis * uBoost * (0.30 + 0.30 * max(n.y * -1.0, 0.0) + 0.15 * fill);' +
    '  col += uHotCol * uEmis * uBoost * 0.16 * (1.0 - uHot) * 0.0;' +
    '  float fg = 1.0 - exp(-vD * uFogK); col = mix(col, uBg, clamp(fg, 0.0, 0.92));' +
    '  if (uMirror > 0.5) { float f = uReflect * exp(-wy / 120.0); col = mix(uFloorCol, col, f); }' +
    '  col += (hash(gl_FragCoord.xy) - 0.5) / 160.0;' +
    '  gl_FragColor = vec4(col, 1.0); }';
  /* room surfaces: floor, walls. Same light, a soft board pattern on the floor, the floor is translucent so the reflection shows through */
  const FRAG_SURF = FRAG_COMMON +
    'void main(){' +
    '  vec3 n = normalize(vN); vec3 ld = uLP - vW; float dl = length(ld); ld /= dl;' +
    '  float att = 1.0 / (1.0 + (dl * dl) / (uLR * uLR * 0.8));' +
    '  float fo = mix(1.0, mix(0.30, 1.1, exp(-pow((vW.z - uFocusZ) / (uFocusR * 1.6), 2.0))), uFocusAmt);' +
    '  float k = max(dot(n, ld), 0.0) * att * fo;' +
    '  float board = 1.0 - 0.10 * smoothstep(0.92, 1.0, abs(fract(vW.x / 56.0) - 0.5) * 2.0) - 0.06 * smoothstep(0.96, 1.0, abs(fract(vW.z / 230.0) - 0.5) * 2.0);' +
    '  vec3 col = uColor * (uAmb * 0.7 + uKey * 0.85 * k) * mix(1.0, board, uSurf);' +
    '  float fg = 1.0 - exp(-vD * uFogK); col = mix(col, uBg, clamp(fg, 0.0, 0.95));' +
    '  col += (hash(gl_FragCoord.xy) - 0.5) / 130.0;' +
    '  gl_FragColor = vec4(col * uAlpha, uAlpha); }';
  /* neon post (adapted from arsenal/materials/shader NEON: two golden-angle spirals, tight + wide, hot core). Input here is the finished frame, so the
     glow mask is its own bright pass instead of the coded P2D layer. */
  const NEON = 'precision highp float; varying vec2 vTexCoord; uniform sampler2D tex0; uniform vec2 uRes; uniform float uRadius; uniform float uGain; uniform float uThresh; uniform float uCore; uniform vec3 uTint;' +
    'vec3 S(vec2 uv){ vec3 c = texture2D(tex0, uv).rgb; float l = max(max(c.r, c.g), c.b); return c * smoothstep(uThresh, uThresh + 0.35, l); }' +
    'void main(){ vec2 uv = vTexCoord; vec3 c0 = texture2D(tex0, uv).rgb; vec3 tight = vec3(0.0), wide = vec3(0.0);' +
    '  for (int k = 0; k < 14; k++) { float fk = float(k); float a = fk * 2.39996; float rr = sqrt((fk + 0.5) / 14.0); vec2 d = vec2(cos(a), sin(a)) * rr / uRes; tight += S(uv + d * uRadius * 0.35); wide += S(uv + d * uRadius); }' +
    '  tight /= 14.0; wide /= 14.0; vec3 g = (tight * 0.9 + wide * 1.5) * uGain * 0.22; float m = max(max(c0.r, c0.g), c0.b);' +
    '  float m0 = smoothstep(uThresh, uThresh + 0.35, m); vec3 col = c0 + g * (1.0 - m0) * (0.9 + 0.3 * uTint) * (1.0 + uCore); '+
    'gl_FragColor = vec4(col, 1.0); }';

  const rgb = (p, c) => { const k = p.color(c); return [p.red(k) / 255, p.green(k) / 255, p.blue(k) / 255]; };
  const mixc = (p, a, b, u) => rgb(p, p.lerpColor(p.color(a), p.color(b), clamp(u)));
  const scl = (v, s) => v.map((x) => x * s);

  /* ───────────── layout: slabs, layers, exact per-layer counts ───────────── */
  function layout(PR) {
    const out = {};
    for (const sx of ['m', 'w']) {
      const slabs = []; let base = 0;
      D6.forEach((d, i) => {
        const n = PR[sx + d], a = PR[sx + d + 'a'], L = Math.ceil(n / PL);
        slabs.push({ d: i, n, a, L, base });
        base += L;
      });
      const perLayer = []; slabs.forEach((s) => { for (let j = 0; j < s.L; j++) perLayer.push(Math.min(PL, s.n - j * PL)); });
      const cum = [0]; perLayer.forEach((c) => cum.push(cum[cum.length - 1] + c));
      out[sx] = { slabs, H: base, perLayer, cum, N: cum[cum.length - 1] };
    }
    return out;
  }

  /* ───────────── the scene object ───────────── */
  function make(p, K, PR, kn) {
    const S = { kn, PR };
    const C = K.C;
    S.lay = layout(PR);
    S.bs = kn('boxSize', 8.4);
    S.sh = p.createShader(VERT, FRAG);
    S.shS = p.createShader(VERT, FRAG_SURF);
    try { S.neon = p.createFilterShader(NEON); } catch (e) { S.neon = null; S.neonErr = String(e).slice(0, 160); }
    // colours from roles: men = accent2 (ember), women = accent (violet), everything else from bg / panel / muted / ink
    S.col = {
      bg: rgb(p, C.paper), ink: rgb(p, C.ink), men: rgb(p, C.soft), wom: rgb(p, C.accent), muted: rgb(p, C.muted),
      floor: mixc(p, C.paper, C.ink, 0.50), wall: mixc(p, C.paper, C.ink, 0.42), pad: mixc(p, C.paper, C.ink, 0.55),
    };
    S.models = {};
    const bs = S.bs;
    for (const sx of ['m', 'w']) {
      S.models[sx] = S.lay[sx].slabs.map((sl) => {
        const mk = (k0, k1) => (k1 <= k0 ? null : p.buildGeometry(() => {
          p.noStroke();
          for (let k = k0; k < k1; k++) {
            const j = Math.floor(k / PL), r = k % PL, ix = r % FX, iz = Math.floor(r / FX);
            p.push(); p.translate((ix - (FX - 1) / 2) * CELL, -(j + 0.5) * CELL, (iz - (FZ - 1) / 2) * CELL); p.box(bs, bs, bs); p.pop();
          }
        }));
        return { lit: mk(0, sl.a), dim: mk(sl.a, sl.n) };
      });
    }
    S.unit = {};   // a unit box for pads, rails and room surfaces
    return S;
  }

  /* slab world position (centre of its footprint at its floor level), pooled -> split with a hop; e = 0..1 */
  function slabPos(S, sx, d, e, kn) {
    const MX = kn('towerX', 85), SX = kn('splitX', 62), P = kn('slabGap', 170), hop = kn('liftArc', 70);
    const sl = S.lay[sx].slabs[d], sgn = sx === 'm' ? -1 : 1;
    const zc = (2.5 - d) * P + (sx === 'm' ? 36 : -36);
    return [lerp(sgn * MX, sgn * SX, e), -(PAD + lerp(sl.base * CELL, 0, e)) - Math.sin(Math.PI * e) * hop, lerp(0, zc, e)];
  }
  const pairZ = (kn, d) => (2.5 - d) * kn('slabGap', 170);

  function eSlab(kn, t, d) {
    const t0 = kn('tUnstack0', 40.0) + kn('unstackStagger', 0.45) * d, dur = kn('unstackDur', 1.9);
    return eio(clamp((t - t0) / dur));
  }

  /* ───────────── camera rig: keys on two tracks through camera.api.sample ───────────── */
  function rigKeys(kn) {
    const f = (t, x, y, z, ease) => ({ t, x, y, zoom: z, fx: 0, fy: 0, fw: 1, fh: 1, fa: 0, label: '', ease });
    const A = [], B = [];       // A: az, el, dist (log) · B: target x, target y (up, negative), target z + 4000
    const push = (t, az, el, dist, tx, th, tz, ease) => { A.push(f(t, az, el, dist, ease)); B.push(f(t, tx, -th, tz + 4000, ease)); };
    const fAz = kn('camFrontAz', 0), fEl = kn('camFrontEl', 7), fD = kn('camFrontDist', 900), hD = kn('camHookDist', 1150);
    const sAz = kn('camSideAz', 82), sEl = kn('camSideEl', 13), sD = kn('camSideDist', 380), wD = kn('camWideDist', 1250);
    const tD0 = kn('tDollyStart', 40.0), tD1 = kn('tDollyEnd', 46.0), tr0 = kn('trackStart', 46.2), step = kn('pairStep', 1.9), hold = kn('pairHold', 1.15);
    const tW0 = kn('tWide', 57.0), tW1 = kn('tWideEnd', 59.0), ease = kn('dollyEase', 'cubic');
    const P = kn('slabGap', 170), z = (d) => (2.5 - d) * P;
    push(0, fAz + 24, fEl + 3, hD, 0, 40, 0, 'sine');
    push(kn('tHookEnd', 8.0), fAz + 9, fEl + 1, lerp(hD, fD, 0.55), 0, 110, 0, 'sine');
    push(16.5, fAz, fEl, fD * 1.04, 0, 190, 0, 'sine');
    push(tD0 - 4.0, fAz - 4, fEl, fD * 0.97, 0, 195, 0, 'sine');
    push(tD0, fAz - 5, fEl, fD * 0.95, 0, 190, 0, 'sine');
    push((tD0 + tD1) / 2, (fAz + sAz) / 2, sEl + 3, wD * 0.95, 0, 95, z(0) * 0.35, 'sine');   // the dolly swings wide of the row, then closes in on pair A
    for (let d = 0; d < 6; d++) {
      const ta = d === 0 ? tD1 : tr0 + d * step;
      push(ta, sAz - (d % 2 ? 3 : -2), sEl, sD, 0, 52, z(d), d === 0 ? ease : 'sine');
      push((d === 0 ? tr0 : ta) + hold, sAz - (d % 2 ? 3 : -2), sEl, sD, 0, 52, z(d), 'sine');
    }
    push(tW0, sAz - 2, sEl, sD, 0, 52, z(5), 'sine');
    push(tW1, sAz - 8, sEl + 9, wD, 0, 40, 0, 'cubic');
    push(62.0, sAz - 8, sEl + 9, wD * 1.02, 0, 40, 0, 'sine');
    push(72.0, sAz - 20, sEl + 13, wD * 1.2, 0, 44, 0, 'sine');
    return { A, B };
  }
  function rigAt(S, t) {
    const sample = window.ARSENAL.patterns.camera.api.sample;
    if (!S.keys) S.keys = rigKeys(S.kn);
    const a = sample(S.keys.A, t, 'cubic'), b = sample(S.keys.B, t, 'cubic');
    return { az: a.x * DEG, el: a.y * DEG, dist: a.zoom, tx: b.x, ty: b.y, tz: b.zoom - 4000, moving: a.moving || b.moving };
  }
  function eyeOf(r) {
    return [r.tx + r.dist * Math.sin(r.az) * Math.cos(r.el), r.ty - r.dist * Math.sin(r.el), r.tz + r.dist * Math.cos(r.az) * Math.cos(r.el)];
  }

  /* ───────────── draw one frame of the gallery. returns the state the film needs for pins ───────────── */
  function draw(p, S, t, o) {
    const kn = S.kn, c = S.col, lay = S.lay;
    const rig = rigAt(S, t), eye = eyeOf(rig);
    p.perspective(kn('camFov', 0.78), p.width / p.height, 6, 9000);
    p.camera(eye[0], eye[1], eye[2], rig.tx, rig.ty, rig.tz, 0, 1, 0);
    const gl = p.drawingContext;
    // light: azimuth from the front toward +x, elevation, a pool that follows the rail
    const laz = kn('lightAz', 42) * DEG, lel = kn('lightEl', 38) * DEG, LD = 1100;
    const fa = o.focusAmt;
    const LP = [Math.sin(laz) * Math.cos(lel) * LD, -Math.sin(lel) * LD, Math.cos(laz) * Math.cos(lel) * LD + rig.tz * 0.85 * fa];
    const keyS = kn('keyStrength', 1.25) * (o.keyMul == null ? 1 : o.keyMul), amb = kn('ambient', 0.14);
    const sh = S.sh, uni = (k, v) => sh.setUniform(k, v);
    const setCommon = (shd) => {
      const u = (k, v) => shd.setUniform(k, v);
      u('uAmb', scl(c.muted, amb * 1.1)); u('uKey', scl(mixc(p, '#ffffff', '#FBF7EE', 0.5), keyS)); u('uFill', scl(c.wom, 0.10));
      u('uLP', LP); u('uBg', c.bg); u('uFloorCol', c.floor); u('uLR', kn('lightReach', 1300)); u('uFogK', kn('fogDensity', 0.00018));
      u('uFocusZ', rig.tz); u('uFocusAmt', fa); u('uFocusR', 190); u('uReflect', 0); u('uMirror', 0); u('uAlpha', 1); u('uSurf', 0); u('uBoost', 1);
      u('uClip', 1e6); u('uGlowY', 1e6); u('uHotBand', 40); u('uHot', 0); u('uEmis', 0); u('uHotCol', c.ink); u('uColor', c.bg); u('uOff', [0, 0, 0]);
    };
    const refl = kn('reflect', 0.5);
    const hotE = kn('glowStrength', 1.1);
    const paintBox = (g, x, y, z, w, h, d) => { p.push(); p.translate(x, y, z); p.box(w, h, d); p.pop(); };
    const room = () => {
      p.shader(S.shS); setCommon(S.shS);
      const u = (k, v) => S.shS.setUniform(k, v), RD = kn('roomSize', 760);
      // walls first (opaque), then the translucent floor
      u('uColor', c.wall); u('uAlpha', 1); u('uSurf', 0);
      u('uOff', [0, -800, -RD]); paintBox(0, 0, -800, -RD, 5000, 1600, 2);
      u('uOff', [-RD, -800, 0]); paintBox(0, -RD, -800, 0, 2, 1600, 5000);
      u('uColor', c.floor); u('uAlpha', refl > 0.01 ? 0.74 : 1); u('uSurf', 1);
      u('uOff', [0, 1.5, 0]); paintBox(0, 0, 1.5, 0, 5000, 3, 5000);
    };

    p.noStroke(); p.noLights();
    const build = o.build;      // {mClip, wClip}: build clip heights (world units, up positive)
    const admit = o.admit;      // {y: sweep line, amt: 0..1}
    const e = (d) => eSlab(kn, t, d);

    const drawCast = (mirror) => {
      p.shader(sh); setCommon(sh);
      uni('uMirror', mirror ? 1 : 0); uni('uReflect', refl);
      for (const sx of ['m', 'w']) {
        const hue = sx === 'm' ? c.men : c.wom, sl = lay[sx].slabs;
        const appl = mixc(p, o.bgHex, sx === 'm' ? o.menHex : o.womHex, 0.46), rej = mixc(p, o.bgHex, sx === 'm' ? o.menHex : o.womHex, 0.26);
        const dimCol = [lerp(appl[0], rej[0], admit.amt), lerp(appl[1], rej[1], admit.amt), lerp(appl[2], rej[2], admit.amt)];
        // pad
        const sgn = sx === 'm' ? -1 : 1, eAll = e(2);
        const padW = lerp(130, 112, eAll), padD = lerp(92, 6 * kn('slabGap', 170) + 40, eAll), padX = lerp(sgn * kn('towerX', 85), sgn * kn('splitX', 62), eAll);
        uni('uColor', c.pad); uni('uHot', 0); uni('uEmis', 0); uni('uClip', 1e6); uni('uOff', [padX, -PAD / 2, 0]);
        paintBox(0, padX, -PAD / 2, 0, padW, PAD, padD);
        for (let d = 0; d < 6; d++) {
          const ee = e(d), pos = slabPos(S, sx, d, ee, kn);
          const mdl = S.models[sx][d];
          const clip = ee > 0 ? 1e6 : (sx === 'm' ? build.mClip : build.wClip);
          uni('uOff', pos); uni('uClip', clip);
          const boost = o.boost ? (o.boost[sx][d] || 1) : 1;
          uni('uBoost', boost);
          uni('uGlowY', ee > 0 || admit.y > 9e5 ? 1e6 : admit.y); uni('uHotBand', ee > 0 ? 1 : 46);
          uni('uHotCol', scl(hue, 1.0)); uni('uEmis', hotE);
          if (mdl.dim) { uni('uHot', 0); uni('uColor', dimCol); p.push(); p.translate(pos[0], pos[1], pos[2]); p.model(mdl.dim); p.pop(); }
          if (mdl.lit) { uni('uHot', 1); uni('uColor', appl); p.push(); p.translate(pos[0], pos[1], pos[2]); p.model(mdl.lit); p.pop(); }
          uni('uBoost', 1);
        }
      }
      uni('uHot', 0); uni('uEmis', 0);
      // the rail: two thin lit strips along z, the track the camera rides in the side shots
      if (o.railAmt > 0.01) {
        const rx = kn('railX', 330);
        uni('uColor', scl(c.ink, 0.5)); uni('uHotCol', c.ink); uni('uHot', 1); uni('uEmis', 0.5 * o.railAmt); uni('uGlowY', 1e6); uni('uBoost', 1);
        for (const dz of [-6, 6]) { uni('uOff', [rx + dz, -0.6, 0]); paintBox(0, rx + dz, -0.6, 0, 1.2, 1.2, 3400); }
        uni('uHot', 0); uni('uEmis', 0);
      }
    };

    // reflections first (mirrored about the floor), then room, then the real cast
    if (refl > 0.01) {
      p.push(); p.scale(1, -1, 1); drawCast(true); p.pop();
    }
    room();
    drawCast(false);
    p.resetShader();
    return { rig, eye, LP };
  }

  window.EXHIBIT = { make, draw, layout, slabPos, pairZ, eSlab, rigAt, eyeOf, rigKeys, D6, CELL, PAD, FX, FZ, PL, NEON, clamp, lerp, sstep, eio };
})();
