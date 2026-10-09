/* factory/kit2/smoke-webgl/film.js · the renderer-webgl smoke film (infrastructure test, never shipped).
   One clock: render(t, s, K) draws frame t from t alone. 120 boxes baked once with buildGeometry, a keyed camera
   swing (front to side), a textToModel headline, a neon post pass (scene → framebuffer → image → filter shader),
   a label pinned with worldToScreen into the kit's SVG layer. Every tunable is a knob (film.json knobs_doc). */
(function () {
'use strict';
const F = window.FILM, PR = F.params, K0 = window.KIT;
const KN = {   // knobs, read once (pure: film.json is fixed for the page)
  camSwing: K0.knob('camSwing', 0.8), boxGap: K0.knob('boxGap', 2), neonGain: K0.knob('neonGain', 1),
  neonAt: K0.knob('neonAt', 6.2), headTurn: K0.knob('headTurn', 0.5),
};
const N = PR.rows * PR.cols, CELL = 26, HEAD_W = 150;

const VERT = 'precision highp float; attribute vec3 aPosition; attribute vec3 aNormal; uniform mat4 uModelViewMatrix; uniform mat4 uProjectionMatrix; varying vec3 vN;' +
  'void main(){ vN = aNormal; gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0); }';
const FRAG = 'precision highp float; varying vec3 vN; uniform vec3 uColor, uAmb, uKey, uKeyDir;' +
  'void main(){ vec3 n = normalize(vN); gl_FragColor = vec4(uColor * (uAmb + uKey * max(dot(n, -uKeyDir), 0.0)), 1.0); }';
// neon: 12-tap golden-angle glow over the canvas, added on a dark ground (constant loop bound)
const NEON = 'precision highp float; varying vec2 vTexCoord; uniform sampler2D tex0; uniform float uGain, uRad; uniform vec2 uRes;' +
  'void main(){ vec3 c = texture2D(tex0, vTexCoord).rgb; vec3 g = vec3(0.);' +
  ' for (int k = 0; k < 12; k++) { float f = float(k); float a = f * 2.39996; float r = sqrt((f + .5) / 12.) * uRad;' +
  '   g += texture2D(tex0, vTexCoord + vec2(cos(a), sin(a)) * r / uRes).rgb; }' +
  ' g /= 12.; gl_FragColor = vec4(c + max(g - .12, 0.) * uGain, 1.); }';

const rgb = (p, c) => { c = p.color(c); return [p.red(c) / 255, p.green(c) / 255, p.blue(c) / 255]; };
let S = null;

window.FILM_RENDER = {
  async setup(p, K) {
    const bw = CELL - KN.boxGap, pos = [];
    for (let r = 0; r < PR.rows; r++) for (let c = 0; c < PR.cols; c++) {
      const h = 14 + 10 * ((r * 7 + c * 3) % 5);                 // fixed pattern, no randomness
      pos.push([(c - (PR.cols - 1) / 2) * CELL, h, (r - (PR.rows - 1) / 2) * CELL]);
    }
    const geo = p.buildGeometry(() => { p.noStroke(); for (const q of pos) { p.push(); p.translate(q[0], -q[1] / 2, q[2]); p.box(bw, q[1], bw); p.pop(); } });
    const sh = p.createShader(VERT, FRAG), neon = p.createFilterShader(NEON);
    const fb = p.createFramebuffer({ density: 2 });
    let head = null; const f = K.font3d('disp');
    if (f) {
      p.textFont(f); p.textSize(100);
      const g = f.textToModel(String(N), 0, 0, { extrude: 24, sampleFactor: 0.3 });
      let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
      for (const v of g.vertices) { x0 = Math.min(x0, v.x); x1 = Math.max(x1, v.x); y0 = Math.min(y0, v.y); y1 = Math.max(y1, v.y); }
      head = { g, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, w: x1 - x0, verts: g.vertices.length };
    }
    S = { geo, sh, neon, fb, head, cam: fb.createCamera() };   // a framebuffer's own camera (p5 flips y for it)
    p.setCamera(K.cam0);
    window.__smoke = { verts: head && head.verts, glAttrs: K.glAttrs };
  },

  render(t, s, K) {
    const p = K.p, C = K.C, { seg, ease } = K;
    // 1 · the scene into the framebuffer, under a keyed camera (front → side by camSwing of a quarter turn)
    const a = KN.camSwing * (Math.PI / 2) * ease(seg(t, 3.2, 7.4)), R = 520;
    S.cam.camera(R * Math.sin(a), -260, R * Math.cos(a), 0, -30, 0, 0, 1, 0);
    S.cam.perspective(0.8, K.W / K.H, 10, 4000);
    S.fb.begin();
    p.background(C.paper);
    p.setCamera(S.cam);
    p.noStroke(); p.shader(S.sh);
    S.sh.setUniform('uAmb', rgb(p, p.lerpColor(p.color(C.paper), p.color(C.muted), 0.5)));
    S.sh.setUniform('uKey', rgb(p, C.ink).map(x => x * 0.8));
    S.sh.setUniform('uKeyDir', [0.45, 0.75, -0.48]);
    S.sh.setUniform('uColor', rgb(p, C.accent)); p.model(S.geo);
    S.sh.setUniform('uColor', rgb(p, C.panel)); p.push(); p.translate(0, 1, 0); p.box(PR.cols * CELL + 60, 2, PR.rows * CELL + 60); p.pop();
    if (S.head) {   // the headline: extruded type above the field, turning by headTurn of a half turn
      const u = ease(seg(t, 6.6, 9.6)), sc = HEAD_W / S.head.w;
      p.push(); p.translate(0, -150, 0); p.rotateY(KN.headTurn * Math.PI * u); p.scale(sc); p.translate(-S.head.cx, -S.head.cy, 0);
      S.sh.setUniform('uColor', rgb(p, C.ink)); p.model(S.head.g); p.pop();
    }
    p.resetShader();
    const pin = p.worldToScreen(p.createVector(0, -76, 0));   // sheet units: the canvas is 960 x 540 css px
    S.fb.end();
    // 2 · the framebuffer onto the canvas, then the neon post pass (only around the reveal)
    p.setCamera(K.cam0); p.resetMatrix(); p.imageMode(p.CORNER);
    p.image(S.fb, -K.W / 2, -K.H / 2, K.W, K.H);
    const glow = KN.neonGain * Math.max(0, 1 - Math.abs(t - KN.neonAt) / 1.2);
    if (glow > 0.01) { S.neon.setUniform('uGain', glow); S.neon.setUniform('uRad', 14); S.neon.setUniform('uRes', [K.W, K.H]); p.filter(S.neon); }
    // 3 · SVG on top: eyebrow, a pin (projected 3D point), the commit box
    const ch = K.chapterAt(t);
    K.tx('eb', 'labels', 40, 56, ch ? ch.eyebrow : '', { size: 14, fill: C.muted, ls: '0.14em', role: 'secondary' });
    const op = seg(t, 1, 1.6) * (1 - seg(t, 6.6, 7));
    if (op > 0) {
      K.ln('pin.l', 'labels', pin.x, pin.y, pin.x + 40, pin.y - 50, { stroke: C.ink, w: 1.4, op });
      K.tx('pin.t', 'labels', pin.x + 46, pin.y - 54, N + ' BOXES', { fam: 'disp', size: 28, fill: C.ink, op, role: 'must-read' });
    }
    K.commitBox(t, s, { x: 660, y: 120, w: 270, title: F.commit.title, prompt: F.commit.prompt, seal: F.commit.at + 1.4, out: 9.6 });
  },
};
})();
