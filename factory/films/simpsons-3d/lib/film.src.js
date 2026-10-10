/* simpsons-3d / draft C · "the instrument" · Worse Overall, turned on a turntable.
   Renderer webgl (kit2). One clock: render(t, state) draws frame t from t alone. 4,526 boxes (one per applicant) are baked
   once with buildGeometry into ONE p5.Geometry; a role-lit vertex shader moves, lights and dims them from t (uniforms only).
   Per-box data rides in the geometry's own uv and vertex-colour channels (see packBox). Labels are SVG, pinned in screen
   space with worldToScreen; the morphing headline is arsenal morph-type on a P2D layer; the extruded numeral is the
   webgl-scene textToModel headline; the neon pass is a bloom filter built on the arsenal shader material's GLSL header.
   Every tunable is a KNOB (film.json knobs, read through K.knob). No Math.random / Date / performance. */
(function () {
'use strict';
const K = window.KIT, F = window.FILM, PR = F.params, ARS = window.ARSENAL;
const { seg, ease, lerp, clamp, fmtK, C } = K;
const kn = (n, d) => K.knob(n, d);
const D = ['A', 'B', 'C', 'D', 'E', 'F'];
const SEX = {
  m: { n: D.map(d => PR['m' + d]), a: D.map(d => PR['m' + d + 'a']), label: 'MEN' },
  w: { n: D.map(d => PR['w' + d]), a: D.map(d => PR['w' + d + 'a']), label: 'WOMEN' },
};
const sum = (a) => a.reduce((x, y) => x + y, 0);
const pct = (a, n) => Math.round(100 * a / n);
const NM = sum(SEX.m.n), NW = sum(SEX.w.n), AM = sum(SEX.m.a), AW = sum(SEX.w.a);
const rate = (s, d) => pct(SEX[s].a[d], SEX[s].n[d]);
const womenUp = D.map((_, d) => SEX.w.a[d] / SEX.w.n[d] > SEX.m.a[d] / SEX.m.n[d]);
const EZ = {
  linear: (u) => u, quad: (u) => (u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2),
  cubic: (u) => (u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2),
  expo: (u) => (u <= 0 ? 0 : u >= 1 ? 1 : u < .5 ? Math.pow(2, 20 * u - 10) / 2 : (2 - Math.pow(2, -20 * u + 10)) / 2),
  sine: (u) => -(Math.cos(Math.PI * u) - 1) / 2,
};
const smoother = (u) => { u = clamp(u); return u * u * u * (u * (u * 6 - 15) + 10); };

/* ── knobs, read once ── */
const Z = {};
[['boxSize', 6.4], ['boxGap', 0.8], ['colW', 12], ['colD', 10], ['colGap', 4], ['slabLayers', 20], ['slabDepth', 4], ['slabGap', 16], ['pairGap', 5],
  ['platterR', 330], ['elev0', 27], ['elev1', 15], ['zoom0', 0.56], ['zoom1', 0.86], ['lookY0', -96], ['lookY1', -84], ['turn0', 40], ['turn1', 46],
  ['turnDeg', 90], ['turnEase', 'cubic'], ['idleDeg', 3], ['split0', 40.3], ['split1', 45.4], ['splitStagger', 0.55], ['splitLift', 22], ['arr0', 16.8],
  ['arrSec', 7], ['lit0', 24.6], ['lit1', 26.6], ['pinCount', 28], ['pinSub', 14], ['pinRate', 22], ['headSize', 92], ['headX', 44], ['headY', 34],
  ['hlStart', 36.4], ['hlMorph', 38.1], ['hlMorphDur', 0.9], ['hlStagger', 0.35], ['hlEase', 'cubic'], ['dv0', 46.5], ['dvStep', 1.3], ['revealT', 55.6],
  ['revealDur', 2.6], ['neonGain', 0.9], ['neonRadius', 18], ['neonThr', 0.3], ['revealSize', 150], ['revealX', 480], ['revealY', 112], ['mixT', 58.8], ['mixPct', 60.6],
].forEach(([n, d]) => { Z[n] = kn(n, d); });
const PITCH = Z.boxSize + Z.boxGap;
const COLW = 2 * Math.round(Z.colW / 2), COLD = 2 * Math.round(Z.colD / 2), COLG = 2 * Math.round(Z.colGap / 2);
const FIELD_OUT = 62.0;
const turnAt = (t) => Z.turnDeg * Math.PI / 180 * EZ[Z.turnEase](seg(t, Z.turn0, Z.turn1));

/* ── geometry of the two arrangements ──
   pooled: two columns, admitted boxes at the bottom (sorted), so the front view reads as one bar per sex.
   split:  twelve slabs (6 departments x 2 sexes) side by side along z, each normalised to slabLayers layers high, so the
           lit height of a slab is its rate. Pooled centres sit on a lattice ((i + 0.5) * pitch) so the vertex shader can
           recover a box centre from any of its corners. */
function layout() {
  const SH = { m: [], w: [] };
  for (const s of ['m', 'w']) SEX[s].n.forEach((n, d) => {
    const Fl = Math.ceil(n / Z.slabLayers), a = Math.min(Math.round(Z.slabDepth), Fl), b = Math.ceil(Fl / a);
    SH[s][d] = { n, Fl, a, b, rows: Math.ceil(n / Fl) };
  });
  let w = 5 * Z.slabGap;
  D.forEach((_, d) => { w += SH.m[d].b * PITCH + Z.pairGap + SH.w[d].b * PITCH; });
  let z = -w / 2;
  D.forEach((_, d) => { SH.m[d].z0 = z; z += SH.m[d].b * PITCH + Z.pairGap; SH.w[d].z0 = z; z += SH.w[d].b * PITCH + Z.slabGap; });
  const bnd = [0, 1, 2, 3, 4].map(d => SH.w[d].z0 + SH.w[d].b * PITCH + Z.slabGap / 2);
  return { SH, bnd, rowW: w };
}
const LAY = layout();

const BOX = { vertsPer: 24 };
function packBoxes() {
  const F0 = COLW * COLD, list = [];
  let dmax = 1;
  for (const [si, s] of ['m', 'w'].entries()) {
    const S = SEX[s], A = sum(S.a), offA = [], offR = [];
    let ca = 0, cr = 0;
    S.n.forEach((n, d) => { offA[d] = ca; ca += S.a[d]; offR[d] = cr; cr += n - S.a[d]; });
    S.n.forEach((n, d) => {
      const sh = LAY.SH[s][d];
      for (let k = 0; k < n; k++) {
        const adm = k < S.a[d], slot = adm ? offA[d] + k : A + offR[d] + (k - S.a[d]);
        const layer = Math.floor(slot / F0), r = slot % F0, ix = r % COLW, iz = Math.floor(r / COLW);
        const sg = si === 0 ? -1 : 1;
        const px = (ix + 0.5 - COLW / 2) * PITCH + sg * (COLW / 2 + COLG / 2) * PITCH, py = -(layer + 0.5) * PITCH, pz = (iz + 0.5 - COLD / 2) * PITCH;
        const lay = Math.floor(k / sh.Fl), rr = k % sh.Fl, jx = rr % sh.a, jz = Math.floor(rr / sh.a);
        const tx = (jx + 0.5 - sh.a / 2) * PITCH, ty = -(lay + 0.5) * PITCH, tz = sh.z0 + (jz + 0.5) * PITCH;
        const dx = tx - px, dy = ty - py, dz = tz - pz;
        dmax = Math.max(dmax, Math.abs(dx), Math.abs(dy), Math.abs(dz));
        list.push({ px, py, pz, dx, dy, dz, lt: adm ? (slot + 1) / A : 2, ms: (d + 0.8 * k / n) / 5.8, ar: slot / NM });
      }
    });
  }
  return { list, dmax: Math.ceil(dmax * 1.02) };
}

/* ── shaders (roles arrive as uniforms; no hex in a shader) ── */
const VERT = `precision highp float;
attribute vec3 aPosition; attribute vec3 aNormal; attribute vec2 aTexCoord; attribute vec4 aVertexColor;
uniform mat4 uModelViewMatrix; uniform mat4 uProjectionMatrix; uniform mat3 uNormalMatrix;
uniform float uPitch, uDmax, uMove, uStag, uLift, uArr, uArrW, uDrop, uSweep, uOut;
uniform float uMask[6]; uniform float uMaskOn; uniform float uB[5];
varying vec3 vN; varying vec4 vInfo;
void main(){
  vec3 c0 = (floor(aPosition / uPitch) + 0.5) * uPitch;
  vec3 dl = (vec3(aTexCoord, aVertexColor.x) - 0.5) * 2.0 * uDmax;
  float pk = aVertexColor.y, mq = floor(pk / 4.0), ms = mq / 31.0, lt = pk - mq * 4.0, ar = aVertexColor.z;
  float a = clamp((uArr - ar) / uArrW, 0.0, 1.0);
  float u = clamp(uMove * (1.0 + uStag) - ms * uStag, 0.0, 1.0);
  float e = u * u * u * (u * (u * 6.0 - 15.0) + 10.0);
  vec3 c = c0 + dl * e;
  c.y -= sin(3.14159265 * u) * uLift + (1.0 - a) * (1.0 - a) * uDrop;
  float tz = c0.z + dl.z, dept = 0.0, m = 0.0;
  for (int i = 0; i < 5; i++) dept += step(uB[i], tz);
  for (int i = 0; i < 6; i++) m += uMask[i] * step(abs(dept - float(i)), 0.5);
  float sc = (0.35 + 0.65 * a) * (1.0 - uOut);
  vec3 pos = c + (aPosition - c0) * sc;
  vN = normalize(uNormalMatrix * aNormal);
  float lit = step(lt, uSweep), fr = (lt < 1.5) ? 1.0 - smoothstep(0.0, 0.035, abs(uSweep - lt)) : 0.0;
  vInfo = vec4(step(0.0, aPosition.x), lit, uMaskOn * (1.0 - m), fr * step(0.001, uSweep) * (1.0 - step(0.999, uSweep)));
  gl_Position = (a <= 0.0 || sc <= 0.0) ? vec4(3.0, 3.0, 3.0, 1.0) : uProjectionMatrix * uModelViewMatrix * vec4(pos, 1.0);
}`;
const FRAG = `precision highp float;
varying vec3 vN; varying vec4 vInfo;
uniform vec3 uMen, uWom, uMenD, uWomD, uAmb, uKey, uRim, uKeyDir, uRimDir, uBg, uChalk;
void main(){
  vec3 n = normalize(vN);
  vec3 hue = mix(uMen, uWom, vInfo.x), dimc = mix(uMenD, uWomD, vInfo.x);
  vec3 base = mix(dimc, hue, vInfo.y);
  base = mix(base, uChalk, vInfo.w * 0.6);
  vec3 l = uAmb + uKey * max(dot(n, -uKeyDir), 0.0) + uRim * max(dot(n, -uRimDir), 0.0);
  vec3 col = base * l;
  col = mix(col, uBg, vInfo.z * 0.7);
  gl_FragColor = vec4(col, 1.0);
}`;
/* neon post: the arsenal shader material's GLSL header (tex0, helpers) plus its two golden-angle spirals; here the source is the
   rendered frame, so bright pixels bloom in the accent roles instead of a coverage layer being recoloured. */
function neonSource() {
  const head = ARS.materials.shader.shaders.neon.split('uniform float uRadius')[0];
  return head + `uniform float uRadius, uGain, uThr;
void main(){
  vec2 uv = vTexCoord; vec3 c = S(uv); vec3 tight = vec3(0.), wide = vec3(0.);
  for(int k=0;k<14;k++){
    float fk = float(k); float a = fk*2.39996; float rr = sqrt((fk+.5)/14.);
    vec2 d = vec2(cos(a),sin(a))*rr/uRes;
    vec3 s1 = S(uv + d*uRadius*.35), s2 = S(uv + d*uRadius);
    tight += max(s1 - uThr, 0.); wide += max(s2 - uThr, 0.);
  }
  tight /= 14.; wide /= 14.;
  float gl = lum(tight)*0.9 + lum(wide)*1.4;
  vec3 tint = mix(uAccent2, uAccent, 0.35 + 0.65*clamp(lum(wide)*3.,0.,1.));
  vec3 col = c + tint * gl * uGain * 2.2 + uChalk * lum(tight) * uGain * 0.5;
  gl_FragColor = vec4(col, 1.);
}`;
}

/* ── cameras: keyed, slerped, orthographic (webgl-scene api) ── */
function camKeys() {
  const dist = 1400, mk = (t, elev, zoom, lookY) => {
    const el = elev * Math.PI / 180;
    return { t, eye: [0, lookY - dist * Math.sin(el), dist * Math.cos(el)], look: [0, lookY, 0], zoom };
  };
  return [mk(0, Z.elev0, Z.zoom0, Z.lookY0), mk(Z.turn0 - 0.4, Z.elev0, Z.zoom0, Z.lookY0), mk(Z.turn1, Z.elev1, Z.zoom1, Z.lookY1),
    mk(Z.revealT + Z.revealDur, Z.elev1, Z.zoom1, Z.lookY1), mk(FIELD_OUT, Z.elev1, Z.zoom1 * 0.97, Z.lookY1)];
}

let ST = null;
const tkOf = (c) => ({ color: { bg: c.paper, ink: c.ink, accent: c.accent, accent2: c.soft, muted: c.muted, chalk: c.ink, panel: c.chalk } });

window.FILM_RENDER = {
  async setup(p, kk) {
    const SW = ARS.patterns['webgl-scene'].api, st = { SW };
    const pk = packBoxes();
    const geo = p.buildGeometry(() => {
      p.noStroke();
      for (const b of pk.list) { p.push(); p.translate(b.px, b.py, b.pz); p.box(Z.boxSize, Z.boxSize, Z.boxSize); p.pop(); }
    });
    const nv = geo.vertices.length;
    if (nv !== pk.list.length * BOX.vertsPer) throw new Error('box geometry: ' + nv + ' vertices for ' + pk.list.length + ' boxes');
    const uv = new Array(nv * 2), vc = new Array(nv * 4), enc = (v) => 0.5 + v / (2 * pk.dmax);
    pk.list.forEach((b, i) => {
      const packed = b.lt + 4 * Math.round(clamp(b.ms) * 31);
      for (let v = 0; v < BOX.vertsPer; v++) {
        const j = i * BOX.vertsPer + v;
        uv[2 * j] = enc(b.dx); uv[2 * j + 1] = enc(b.dy);
        vc[4 * j] = enc(b.dz); vc[4 * j + 1] = packed; vc[4 * j + 2] = b.ar; vc[4 * j + 3] = 1;
      }
    });
    geo.uvs = uv; geo.vertexColors = vc;
    st.geo = geo; st.dmax = pk.dmax; st.sh = p.createShader(VERT, FRAG);
    st.keys = camKeys(); const prm = { proj: 'ortho' };
    st.prm = prm; st.cams = st.keys.map((k) => SW.mkCam(p, k, prm)); st.work = p.createCamera();
    try { st.neon = p.createFilterShader(neonSource()); } catch (e) { st.neon = null; st.neonErr = String(e).slice(0, 160); }
    /* extruded numeral: the webgl-scene headline machinery on the brand's mono face */
    const mono = kk.font3d('mono');
    st.hl = { fonts: { disp: mono } };
    st.hp = { mode: 'headline', headline: '2', extrude: 30, sampleFactor: 0.25, forceOutline: false, headW: Z.revealSize, headY: 0, p5lights: true };
    SW.buildHeadline(p, st.hl, st.hp);
    /* morphing headline: arsenal morph-type, drawn on a P2D layer, composited as an image */
    window.MORPH_FONTS = window.KIT2_FONTS3D || window.MORPH_FONTS || {};
    const MT = ARS.patterns['morph-type'], pairs = D.map((_, d) => rate('m', d) + ' ' + rate('w', d));
    const hw = 360, hh = 150;
    st.mt = {
      pat: MT, W: hw, H: hh, g: p.createGraphics(hw, hh), words: [String(pct(AM, NM)), String(pct(AW, NW))].concat(pairs),
      tok: { color: { bg: 'rgba(0,0,0,0)', ink: C.ink, accent: C.accent, muted: C.muted, line: C.line }, type: { disp: { family: 'Space Mono', weight: 400 }, mono: { family: 'Space Mono', weight: 400 } }, tempo: { ease: Z.hlEase } },
    };
    st.mt.g.pixelDensity(2);
    st.mt.params = Object.assign({}, MT.params, { mode: 'words', font: 'disp', render: 'fill', words: st.mt.words, hold_s: 1, morph_s: 1, size: Z.headSize, maxW: 300, step: 3, stagger: Z.hlStagger, lift: 6, kicker: '', caption: '', guides: false });
    st.mt.st = await MT.setup(p, { tokens: st.mt.tok, seed: F.seed, W: hw, H: hh }, st.mt.params);
    const g = st.mt.g;
    st.mt.proxy = new Proxy(g, { get(t, k2) { if (k2 === 'text') return () => {}; const own = k2 in t, v = own ? t[k2] : p[k2]; return typeof v === 'function' ? v.bind(own ? t : p) : v; } });
    st.tk = tkOf(C);
    ST = st;
  },

  render(t, s, kk) {
    const p = kk.p, st = ST; if (!st) return;
    const SW = st.SW;
    const th = turnAt(t), pooledT = t < Z.split0;
    const arrN = clamp((t - Z.arr0) * NM / Z.arrSec, 0, NM), out = seg(t, FIELD_OUT, FIELD_OUT + 0.6);
    const idle = (t < Z.arr0 || t >= FIELD_OUT) ? t * Z.idleDeg * Math.PI / 180 : 0;
    const platterOp = (t < 16 ? 0.55 : 0.55 + 0.45 * seg(t, 16, 17.5)) * (1 - out * 0.65);
    /* ── camera ── */
    const path = SW.pathAt(st.keys, t), w = st.work;
    w.slerp(st.cams[path.i], st.cams[path.i + 1], path.amt);
    SW.project(p, w, st.prm, lerp(path.a.zoom, path.b.zoom, path.amt));
    p.setCamera(w); p.noLights(); p.noStroke();
    const bgc = p.color(C.paper);
    const lerpC = (a, b, u) => p.lerpColor(p.color(a), p.color(b), u);
    const rgb = (c) => { c = p.color(c); return [p.red(c) / 255, p.green(c) / 255, p.blue(c) / 255]; };
    const nrm = (v) => { const l = Math.hypot(...v); return v.map(x => x / l); };

    /* ── platter: the turntable ring, ticks and a front mark; it turns with the sculpture ── */
    p.push(); p.rotateY(th + idle);
    const R = Z.platterR, col = p.color(C.muted); col.setAlpha(255 * 0.55 * platterOp);
    p.noFill(); p.stroke(col); p.strokeWeight(1.2);
    p.beginShape(p.LINES);
    const NSEG = 144;
    for (let i = 0; i < NSEG; i++) { const a0 = i / NSEG * p.TWO_PI, a1 = (i + 1) / NSEG * p.TWO_PI; p.vertex(R * Math.sin(a0), 1, R * Math.cos(a0)); p.vertex(R * Math.sin(a1), 1, R * Math.cos(a1)); }
    for (let i = 0; i < 72; i++) { const a0 = i / 72 * p.TWO_PI, L = i % 6 === 0 ? 16 : 7; p.vertex((R - L) * Math.sin(a0), 1, (R - L) * Math.cos(a0)); p.vertex(R * Math.sin(a0), 1, R * Math.cos(a0)); }
    p.endShape();
    const ac = p.color(C.accent); ac.setAlpha(255 * platterOp); p.stroke(ac); p.strokeWeight(2);
    p.beginShape(p.LINES);
    p.vertex(0, 1, R - 4); p.vertex(0, 1, R + 22); p.vertex(-8, 1, R + 12); p.vertex(0, 1, R + 22); p.vertex(8, 1, R + 12); p.vertex(0, 1, R + 22);
    p.endShape();
    p.pop();

    /* ── the sculpture ── */
    const show = t >= Z.arr0 - 0.2 && t < FIELD_OUT + 0.7 && out < 1;
    const pins = { th };
    if (show) {
      const sh = st.sh, move = seg(t, Z.split0, Z.split1);
      const sweep = seg(t, Z.lit0, Z.lit1);
      /* dept mask: one department at a time during the call-outs, then all, then women-higher at the reveal, A and B in the mix */
      const lastEnd = Z.dv0 + 6 * Z.dvStep, w1 = seg(t, lastEnd - 0.15, lastEnd + 0.35), w2 = seg(t, Z.revealT - 0.4, Z.revealT);
      const w3 = seg(t, Z.mixT - 0.3, Z.mixT + 0.2), w4 = seg(t, FIELD_OUT - 1.2, FIELD_OUT - 0.4);
      const maskOn = seg(t, Z.dv0 - 0.3, Z.dv0 - 0.1), mask = D.map((_, d) => {
        const v0 = Z.dv0 + d * Z.dvStep, vis = seg(t, v0 - 0.15, v0 + 0.15) * (1 - seg(t, v0 + Z.dvStep - 0.15, v0 + Z.dvStep + 0.15));
        let m = lerp(vis, 1, w1);
        m = lerp(m, womenUp[d] ? 1 : 0.2, w2); m = lerp(m, d < 2 ? 1 : 0.2, w3); m = lerp(m, 1, w4);
        return m;
      });
      p.push(); p.rotateY(th);
      p.shader(sh);
      const U = (k2, v) => sh.setUniform(k2, v);
      const bg = C.paper;
      U('uPitch', PITCH); U('uDmax', st.dmax); U('uMove', move); U('uStag', Z.splitStagger); U('uLift', Z.splitLift);
      U('uArr', arrN / NM * (1 + 90 / NM)); U('uArrW', 90 / NM); U('uDrop', 46); U('uSweep', sweep); U('uOut', out);
      U('uMask', mask); U('uMaskOn', maskOn); U('uB', LAY.bnd);
      U('uMen', rgb(C.accent)); U('uWom', rgb(C.soft));
      U('uMenD', rgb(lerpC(C.chalk, C.accent, 0.32))); U('uWomD', rgb(lerpC(C.chalk, C.soft, 0.32)));
      U('uAmb', rgb(lerpC(bg, C.muted, 0.5))); U('uKey', rgb(C.ink).map(x => x * 0.62)); U('uRim', rgb(lerpC(bg, C.soft, 0.6)));
      U('uKeyDir', nrm([-0.45, 0.8, -0.4])); U('uRimDir', nrm([0.7, 0.3, 0.6])); U('uBg', rgb(bg)); U('uChalk', rgb(C.ink));
      p.noStroke(); p.model(st.geo);
      p.resetShader();
      /* slab frames: the capacity of each slab (slabLayers high), drawn in as the boxes arrive */
      const fo = seg(t, Z.split0 + 1.5, Z.split1) * (1 - out);
      if (fo > 0.01) {
        const fc = p.color(C.muted); fc.setAlpha(255 * 0.5 * fo); p.stroke(fc); p.strokeWeight(1); p.noFill();
        p.beginShape(p.LINES);
        ['m', 'w'].forEach((sx) => D.forEach((_, d) => {
          const q = LAY.SH[sx][d], x0 = -q.a * PITCH / 2, x1 = q.a * PITCH / 2, z0 = q.z0, z1 = q.z0 + q.b * PITCH, y1 = -Z.slabLayers * PITCH;
          const V = [[x0, 0, z0], [x1, 0, z0], [x1, 0, z1], [x0, 0, z1], [x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]];
          [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]].forEach(([a, b]) => { p.vertex(...V[a]); p.vertex(...V[b]); });
        }));
        p.endShape();
      }
      /* pin anchors, projected while the camera and the turntable matrix are set */
      const sc = (x, y, z) => { const v = p.worldToScreen(p.createVector(x, y, z)); return [v.x, v.y]; };
      pins.cols = ['m', 'w'].map((sx, si) => {
        const n = Math.min(arrN, sx === 'm' ? NM : NW), top = -Math.ceil(n / (COLW * COLD)) * PITCH, x = (si === 0 ? -1 : 1) * (COLW / 2 + COLG / 2) * PITCH;
        return sc(x, top, 0);
      });
      pins.slabs = D.map((_, d) => {
        const m = LAY.SH.m[d], wm = LAY.SH.w[d], xf = -Math.max(m.a, wm.a) * PITCH / 2 - 7;
        return {
          m: sc(0, -m.rows * PITCH, m.z0 + m.b * PITCH / 2), w: sc(0, -wm.rows * PITCH, wm.z0 + wm.b * PITCH / 2),
          floor: sc(xf, 0, (m.z0 + wm.z0 + wm.b * PITCH) / 2), ab: [sc(0, -Z.slabLayers * PITCH, m.z0), sc(0, -Z.slabLayers * PITCH, wm.z0 + wm.b * PITCH)],
        };
      });
      p.pop();
    }

    /* ── extruded numeral (webgl-scene headline machinery) at the reveal ── */
    const ru = seg(t, Z.revealT - 0.5, Z.revealT - 0.5 + Z.revealDur);
    const revOp = seg(t, Z.revealT - 0.5, Z.revealT - 0.1) * (1 - seg(t, Z.mixT + 0.4, Z.mixT + 1.0));
    if (revOp > 0.01 && st.hl.head && st.hl.head.kind !== 'none') {
      kk.flat(() => {
        p.setCamera(kk.cam0); p.resetMatrix(); p.noLights();
        p.push(); p.translate(Z.revealX - 480, Z.revealY - 270, 0);
        st.hp.headW = Z.revealSize * (0.4 + 0.6 * revOp);
        SW.p5lights(p, st.tk, st.hl, st.hp); SW.headline3d(p, st.hl, st.tk, 0.12 + 0.76 * ru, st.hp); p.noLights();
        p.pop();
      });
    }

    /* ── morphing headline (arsenal morph-type) on its P2D layer ── */
    const hlOp = seg(t, Z.hlStart, Z.hlStart + 0.5) * (1 - seg(t, Z.revealT - 0.5, Z.revealT - 0.1)) * (1 - seg(t, Z.mixT - 0.4, Z.mixT));
    let hlStep = -1, hlU = 0;
    if (hlOp > 0.01) {
      const M = st.mt, ms = [Z.hlMorph].concat(D.map((_, d) => Z.dv0 + d * Z.dvStep - 0.25));
      let s0 = -1; ms.forEach((m, i) => { if (t >= m) s0 = i; });
      const per = M.params.hold_s + M.params.morph_s, md = Z.hlMorphDur;
      let tm = 0;
      if (s0 >= 0) { const u = clamp((t - ms[s0]) / md); tm = s0 * per + M.params.hold_s + u * M.params.morph_s; hlStep = s0; hlU = u; }
      M.g.clear(); M.pat.draw(M.proxy, tm, M.st, M.params, M.tok);
      kk.flat(() => { p.imageMode(p.CORNER); p.tint(255, 255 * hlOp); p.image(M.g, Z.headX, Z.headY, M.W, M.H); p.noTint(); });
    }

    /* ── neon post: only on the reveal frame ── */
    const pulse = Z.neonGain * Math.sin(Math.PI * seg(t, Z.revealT - Z.revealDur * 0.35, Z.revealT + Z.revealDur * 0.65));
    ST.neonNow = pulse > 0.02 ? pulse : 0;
    if (pulse > 0.02 && st.neon) {
      p.setCamera(kk.cam0); p.resetMatrix(); p.noLights();
      const u2 = (k2, v) => st.neon.setUniform(k2, v), cc = (c) => { c = p.color(c); return [p.red(c) / 255, p.green(c) / 255, p.blue(c) / 255]; };
      u2('uRes', [960, 540]); u2('uT', t); u2('uSeed', 1); u2('uBg', cc(C.paper)); u2('uInk', cc(C.ink)); u2('uAccent', cc(C.accent)); u2('uAccent2', cc(C.soft));
      u2('uMuted', cc(C.muted)); u2('uPanel', cc(C.chalk)); u2('uChalk', cc(C.ink)); u2('uDark', 1);
      u2('uRadius', Z.neonRadius); u2('uGain', pulse); u2('uThr', Z.neonThr);
      p.filter(st.neon);
    }

    /* ── SVG: sheets, commit box, pins, readouts ── */
    labels(kk, t, s, th, pins, hlStep, hlU, ru);
  },
};

/* ───────────────────────────── SVG layer ───────────────────────────── */
function T_(kk, key, layer, x, y, str, o, role) {
  const el = kk.tx(key, layer, x, y, str, o);
  if (role && el.getAttribute('data-role') !== role) el.setAttribute('data-role', role);
  return el;
}

function labels(kk, t, s, th, pins, hlStep, hlU, ru) {
  const { typed, stamp } = kk;
  const cM = C.accent, cW = C.soft;
  kk.roll(t, 0, 1.0);

  /* S1 verdict sheet: HOOK and MONDAY (digit-free) */
  const sheetOp = t < 17 ? 1 - seg(t, 7.4, 8.0) : seg(t, FIELD_OUT + 0.4, FIELD_OUT + 1.2);
  if (sheetOp > 0) {
    const e0 = t < 17 ? seg(t, 0.3, 0.7) : 1;
    T_(kk, 'hk.e', 'labels', 74, 150, 'SALES REVIEW', { size: 14, ls: '0.2em', weight: 500, op: sheetOp * e0, fill: cM }, 'secondary');
    kk.ln('hk.r', 'labels', 74, 160, 600, 160, { w: 0.9, op: sheetOp * 0.7, stroke: C.muted });
    T_(kk, 'hk.h', 'labels', 74, 214, t < 17 ? typed('New sales process', t, 0.6, 30) : 'New sales process', { fam: 'disp', size: 48, op: sheetOp }, 'must-read');
    T_(kk, 'hk.v', 'labels', 74, 258, t < 17 ? typed('Converts worse overall.', t, 1.4, 30) : 'Converts worse overall.', { size: 28, weight: 500, op: sheetOp }, 'must-read');
    if (t >= 4.4 && t < 17 || t >= FIELD_OUT + 0.4) {
      const u = t < 17 ? seg(t, 4.4, 4.65) : 1;
      stamp('hk.st', 'marks', 520, 214, lerp(1.15, 1, 1 - Math.pow(1 - u, 3)), 'KILLED', { op: sheetOp * (t < 17 ? seg(t, 4.4, 4.5) : 1), rim: cW, rot: -6, fs: 30, h: 48, fam: 'mono' });
    }
    if (t >= 63.0) {
      const su = seg(t, 63.0, 63.6); kk.ln('mo.k', 'marks', 428, 220, 428 + 190 * su, 220 - 14 * su, { stroke: cW, w: 3, op: sheetOp, cap: 'butt' });
      T_(kk, 'mo.q', 'labels', 74, 320, typed('Same mix of leads?', t, 63.6, 24), { fam: 'disp', size: 44, fill: cW }, 'must-read');
      T_(kk, 'mo.s', 'labels', 74, 364, typed('Split by segment. Then compare.', t, 64.6, 30), { size: 28, weight: 500 }, 'must-read');
    }
  }

  /* S2 commit box */
  if (t >= F.commit.at - 1.2 && t < 16.6) kk.commitBox(t, s, { title: F.commit.title, prompt: 'OF 6 DEPARTMENTS', out: 16.0 });

  if (t < Z.arr0 - 0.3 || t >= FIELD_OUT + 0.3) return;
  const fo = 1 - seg(t, FIELD_OUT, FIELD_OUT + 0.5);

  /* instrument readout: view name and a dial that turns with the platter */
  const sideness = seg(th, 0, Z.turnDeg * Math.PI / 180);
  T_(kk, 'rd.v', 'labels', 884, 44, sideness < 0.5 ? 'VIEW · FRONT' : 'VIEW · SIDE', { size: 12, ls: '0.14em', anchor: 'end', op: 0.9 * fo, fill: C.muted }, 'chrome');
  kk.E('rd.dc', 'circle', 'labels', { cx: 908, cy: 40, r: 11, fill: 'none', stroke: C.muted, 'stroke-width': 1, opacity: fo * 0.9 });
  kk.ln('rd.dn', 'labels', 908, 40, 908 + 9 * Math.sin(th), 40 - 9 * Math.cos(th), { stroke: C.accent, w: 1.6, op: fo });
  T_(kk, 'rd.e', 'labels', 48, 520, 'ONE BOX · ONE APPLICANT', { size: 12, ls: '0.16em', op: 0.8 * fo * seg(t, Z.arr0, Z.arr0 + 0.6), fill: C.muted }, 'chrome');

  /* column pins: counts first, rates from 36 s (pooled arrangement only) */
  const pOp = seg(t, Z.arr0 + 0.3, Z.arr0 + 0.9) * (1 - seg(t, Z.split0 - 0.5, Z.split0 - 0.1));
  if (pOp > 0 && pins.cols) {
    const nArr = clamp((t - Z.arr0) * NM / Z.arrSec, 0, NM), sw = seg(t, Z.lit0, Z.lit1);
    ['m', 'w'].forEach((sx, i) => {
      const N = sx === 'm' ? NM : NW, A = sx === 'm' ? AM : AW, hue = sx === 'm' ? cM : cW;
      const [ax, ay] = pins.cols[i];
      let l1, l2;
      const cnt = Math.min(N, Math.floor(nArr) + (nArr > 0 ? 1 : 0));
      if (t < Z.lit0) { l1 = fmtK(cnt); l2 = 'APPLIED'; }
      else if (t < 36.0) { l1 = fmtK(Math.round(A * sw)); l2 = 'ADMITTED OF ' + fmtK(N); }
      else { l1 = pct(A, N) + ' %'; l2 = fmtK(A) + ' ÷ ' + fmtK(N); }
      const flip = [Z.lit0 - 0.1, 36.0].reduce((o, a) => (t >= a - 0.2 && t < a + 0.4 ? Math.min(o, Math.abs(t - a - 0.1) / 0.3) : o), 1);
      const op = pOp * Math.max(0.2, flip), y2 = ay - 22, y1 = y2 - 24, y0 = y1 - 32;
      kk.ln('pc.l' + sx, 'labels', ax, ay - 3, ax, ay - 16, { stroke: hue, w: 1.2, op: pOp });
      T_(kk, 'pc.0' + sx, 'labels', ax, y0, sx === 'm' ? 'MEN' : 'WOMEN', { size: Z.pinSub, ls: '0.14em', anchor: 'middle', fill: hue, weight: 500, op: pOp }, 'secondary');
      T_(kk, 'pc.1' + sx, 'labels', ax, y1, l1, { size: Z.pinCount, anchor: 'middle', weight: 500, op }, 'must-read');
      T_(kk, 'pc.2' + sx, 'labels', ax, y2, l2, { size: Z.pinSub, anchor: 'middle', op: pOp * 0.9, fill: C.muted }, 'secondary');
    });
  }

  /* headline label under the morphing number */
  const hlOp = seg(t, Z.hlStart, Z.hlStart + 0.5) * (1 - seg(t, Z.revealT - 0.5, Z.revealT - 0.1)) * (1 - seg(t, Z.mixT - 0.4, Z.mixT));
  if (hlOp > 0.01) {
    const hx = Z.headX + 180;
    let a, b, c0 = C.ink;
    if (hlStep < 0) { a = 'MEN · ADMITTED %'; }
    else if (hlStep === 0) { a = hlU < 0.5 ? 'MEN · ADMITTED %' : 'WOMEN · ADMITTED %'; }
    else { a = null; }
    if (a) T_(kk, 'hl.a', 'labels', hx, Z.headY + 134, a, { size: 14, ls: '0.12em', anchor: 'middle', op: hlOp, fill: hlStep === 0 && hlU >= 0.5 ? cW : cM, weight: 500 }, 'secondary');
    else {
      const d = clamp(hlStep - 2 + (hlU > 0.5 ? 1 : 0), 0, 5), cell = 0.612 * ST.mt.st.S;
      T_(kk, 'hl.d', 'labels', hx, Z.headY + 22, 'DEPARTMENT ' + D[d], { size: 14, ls: '0.14em', anchor: 'middle', op: hlOp, fill: C.muted, weight: 500 }, 'secondary');
      T_(kk, 'hl.m', 'labels', hx - 1.5 * cell, Z.headY + 134, 'MEN', { size: 14, ls: '0.14em', anchor: 'middle', op: hlOp, fill: cM, weight: 500 }, 'secondary');
      T_(kk, 'hl.w', 'labels', hx + 1.5 * cell, Z.headY + 134, 'WOMEN', { size: 14, ls: '0.14em', anchor: 'middle', op: hlOp, fill: cW, weight: 500 }, 'secondary');
    }
    void c0;
  }

  /* department pins in the side view: letters on the floor, rates above, counts for the one in focus */
  const sOp = seg(t, Z.split1 - 0.6, Z.split1 + 0.2) * fo;
  if (sOp > 0 && pins.slabs) {
    D.forEach((dl, d) => {
      const S_ = pins.slabs[d], v0 = Z.dv0 + d * Z.dvStep;
      T_(kk, 'dl.' + dl, 'labels', S_.floor[0], S_.floor[1] + 18, dl, { size: 18, anchor: 'middle', weight: 500, ls: '0.1em', op: sOp * 0.9 }, 'secondary');
      const vis = seg(t, v0 - 0.1, v0 + 0.25) * fo;
      if (vis <= 0) return;
      const foc = seg(t, v0 - 0.1, v0 + 0.2) * (1 - seg(t, v0 + Z.dvStep - 0.1, v0 + Z.dvStep + 0.25));
      const cx = (S_.m[0] + S_.w[0]) / 2, by = Math.min(S_.m[1], S_.w[1]) - 12 - 16 * foc;
      const rm = rate('m', d), rw = rate('w', d), up = womenUp[d];
      const lead = Math.max(0.55, vis * (0.55 + 0.45 * foc));
      T_(kk, 'dr.m' + dl, 'labels', cx - 5, by, rm + '%', { size: Z.pinRate, anchor: 'end', weight: up ? 400 : 700, fill: cM, op: lead }, 'secondary');
      T_(kk, 'dr.w' + dl, 'labels', cx + 5, by, rw + '%', { size: Z.pinRate, anchor: 'start', weight: up ? 700 : 400, fill: cW, op: lead }, 'secondary');
      const ux = up ? cx + 5 : cx - 5 - String(rm + '%').length * Z.pinRate * 0.612, uw = String((up ? rw : rm) + '%').length * Z.pinRate * 0.612;
      kk.ln('dr.u' + dl, 'labels', ux, by + 4, ux + uw, by + 4, { stroke: up ? cW : cM, w: 1.6, op: lead * seg(t, v0 + 0.15, v0 + 0.5) });
      if (foc > 0.01) {
        T_(kk, 'dc.m' + dl, 'labels', cx - 5, by - 20, SEX.m.a[d] + ' ÷ ' + SEX.m.n[d], { size: 14, anchor: 'end', fill: C.muted, op: foc }, 'secondary');
        T_(kk, 'dc.w' + dl, 'labels', cx + 5, by - 20, SEX.w.a[d] + ' ÷ ' + SEX.w.n[d], { size: 14, anchor: 'start', fill: C.muted, op: foc }, 'secondary');
        T_(kk, 'dt.' + dl, 'labels', cx, by - 42, up ? 'WOMEN HIGHER' : 'MEN HIGHER', { size: 14, anchor: 'middle', ls: '0.12em', weight: 500, fill: up ? cW : cM, op: foc }, 'secondary');
      }
    });
  }

  /* the reveal: 2 of 6, and the sealed guess against it */
  const gOp = seg(t, Z.revealT - 0.3, Z.revealT + 0.3) * (1 - seg(t, Z.mixT - 0.3, Z.mixT + 0.1));
  if (gOp > 0) {
    const worse = D.reduce((n, _, i) => n + (womenUp[i] ? 0 : 1), 0);
    T_(kk, 'rv.a', 'labels', Z.revealX + Z.revealSize * 0.62, Z.revealY + 14, 'OF 6', { fam: 'disp', size: 44, fill: C.ink, op: gOp }, 'must-read');
    T_(kk, 'rv.b', 'labels', Z.revealX - Z.revealSize * 0.62, Z.revealY - 18, 'WOMEN DID', { size: 14, ls: '0.14em', anchor: 'end', fill: C.muted, op: gOp }, 'secondary');
    T_(kk, 'rv.c', 'labels', Z.revealX - Z.revealSize * 0.62, Z.revealY + 2, 'WORSE IN', { size: 14, ls: '0.14em', anchor: 'end', fill: C.muted, op: gOp }, 'secondary');
    const bx = 700, by = 74, bw = 232, nx = (k) => bx + 22 + 31 * k, ny = by + 56, g = kk.answered(s) ? s.answer : null;
    kk.rc('gs.o', 'marks', bx, by - 4, bw, 94, { stroke: C.muted, w: 1, dash: '5 4', op: gOp });
    for (let k = 0; k <= 6; k++) {
      if (k === worse) kk.rc('gs.tb', 'marks', nx(k) - 11, ny - 20, 22, 27, { fill: C.ink, op: gOp });
      T_(kk, 'gs.n' + k, 'labels', nx(k), ny, String(k), { size: 20, weight: 500, anchor: 'middle', fill: k === worse ? C.paper : C.ink, op: gOp }, 'secondary');
    }
    const gr = seg(t, Z.revealT, Z.revealT + 0.6);
    if (g != null) {
      const cx = nx(g), cy = ny - 7, R = 15, a = 2 * Math.PI * Math.min(0.999, gr), p1 = [cx + R * Math.sin(a), cy - R * Math.cos(a)];
      kk.path('gs.ring', 'labels', `M ${cx} ${cy - R} A ${R} ${R} 0 ${a > Math.PI ? 1 : 0} 1 ${p1[0].toFixed(2)} ${p1[1].toFixed(2)}`, { stroke: cM, w: 2.2, op: gOp * (gr > 0 ? 1 : 0) });
      T_(kk, 'gs.you', 'labels', cx, ny - 30, 'YOU', { size: 14, weight: 500, anchor: 'middle', fill: cM, op: gOp * gr }, 'secondary');
    } else T_(kk, 'gs.you', 'labels', bx + 12, ny - 30, 'NO ANSWER', { size: 14, weight: 500, fill: cM, op: gOp * gr }, 'secondary');
    T_(kk, 'gs.tr', 'labels', nx(worse), ny + 24, 'TRUTH', { size: 14, weight: 500, anchor: 'middle', op: gOp * seg(t, Z.revealT + 0.2, Z.revealT + 0.7) }, 'secondary');
  }

  /* the mix: A and B bracketed, 51 % of men against 7 % of women */
  const mOp = seg(t, Z.mixT, Z.mixT + 0.5) * fo;
  if (mOp > 0 && pins.slabs) {
    const a = pins.slabs[0].ab[0], b = pins.slabs[1].ab[1], y = Math.min(a[1], b[1]) - 46, x0 = a[0] - 6, x1 = b[0] + 6;
    kk.path('mx.br', 'labels', `M ${x0.toFixed(1)} ${(y + 10).toFixed(1)} L ${x0.toFixed(1)} ${y.toFixed(1)} L ${x1.toFixed(1)} ${y.toFixed(1)} L ${x1.toFixed(1)} ${(y + 10).toFixed(1)}`, { stroke: C.ink, w: 1.6, op: mOp * seg(t, Z.mixT, Z.mixT + 0.7), cap: 'square' });
    const pc = t >= Z.mixPct, flip = pc ? Math.max(0.15, Math.min(1, Math.abs(t - Z.mixPct - 0.15) / 0.25)) : 1;
    const px = 700, py = 74;
    T_(kk, 'mx.h', 'labels', px, py, 'APPLIED TO A OR B', { size: 14, ls: '0.14em', weight: 500, fill: C.muted, op: mOp }, 'secondary');
    [['m', cM, 0, PR.mA + PR.mB, NM], ['w', cW, 1, PR.wA + PR.wB, NW]].forEach(([sx, hue, i, n, N]) => {
      const yy = py + 34 + i * 58;
      T_(kk, 'mx.s' + sx, 'labels', px, yy - 16, sx === 'm' ? 'MEN' : 'WOMEN', { size: 14, ls: '0.14em', weight: 500, fill: hue, op: mOp }, 'secondary');
      T_(kk, 'mx.n' + sx, 'labels', px, yy + 16, pc ? pct(n, N) + ' %' : fmtK(n) + ' / ' + fmtK(N), { size: 28, weight: 500, op: mOp * flip }, 'must-read');
    });
    kk.ln('mx.l', 'labels', x1, y, px - 8, py + 40, { stroke: C.muted, w: 0.9, op: mOp * 0.6, dash: '3 3' });
  }
}
})();
