/* factory/films/simpsons-3d/drafts/a/film.js · "Worse Overall, in 3D" · draft A, the architectural model.
   Simpson's paradox on Berkeley 1973 as a city of 4,526 boxes on a ground plane, under a slow orbit, calm.
   One clock: render(t, s, K) draws frame t from t alone (renderer webgl, kit2). The boxes are baked once with
   buildGeometry (lib/scene3d.js); the camera is keyed with arsenal camera.js sample() (log zoom) and drawn with an
   orthographic p5.Camera into a framebuffer; the headline number morphs by glyph outline (lib/morph.js); the neon post
   pass (lib/neon.js) runs on the reveal frame only. Text is the kit's SVG on top, pinned to 3D points with worldToScreen.
   Every tunable is a knob in film.json (knobs_doc), read through K.knob with a default. */
(function () {
'use strict';
const F = window.FILM, PR = F.params, K0 = window.KIT;
const S3 = window.FILM_S3D, MORPH = window.FILM_MORPH, NEON = window.FILM_NEON, CAMAPI = window.ARSENAL.patterns.camera.api;
const DEFS = {};   // knob defaults; film.json carries the values and the documented ranges
(F.knobs_doc || []).forEach((d) => { DEFS[d.name] = (F.knobs || {})[d.name]; });
const KN = new Proxy({}, { get: (_, n) => K0.knob(n, DEFS[n]) });   // pure: film.json is fixed for the page
const DEPT = ['A', 'B', 'C', 'D', 'E', 'F'];
const arr = (pre, post) => DEPT.map((d) => PR[pre + d + (post || '')]);
const MEN = arr('m'), MENA = arr('m', 'a'), WOM = arr('w'), WOMA = arr('w', 'a');
const sum = (a) => a.reduce((x, y) => x + y, 0);
const NM = sum(MEN), NW = sum(WOM), AM = sum(MENA), AW = sum(WOMA);
const pct = (a, n) => Math.round(100 * a / n);
const WOMEN_AHEAD = DEPT.map((_, i) => WOMA[i] / WOM[i] > MENA[i] / MEN[i]);
const DEG = Math.PI / 180;

/* ── colours: the pack's roles as 0..1 triples ── */
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const mixc = (a, b, u) => a.map((v, i) => v + (b[i] - v) * u);
const scl = (a, k) => a.map((v) => v * k);
const B = K0.BRAND.color;
const BG = hex(B.bg), INK = hex(B.ink), LAV = hex(B.accent), PEACH = hex(B.accent2), MUTED = hex(B.muted), PANEL = hex(B.panel);
const SEXC = [PEACH, LAV];                                   // men = ember, women = violet; lit = full, rest = a quiet tint
const SEXDIM = SEXC.map((c) => mixc(BG, c, 0.3));
const OLDC = mixc(BG, INK, 0.38), NEWC = mixc(BG, INK, 0.7);
const PLATE = mixc(PANEL, MUTED, 0.16);
const c255 = (c) => c.map((v) => Math.round(v * 255));

/* ── timeline (seconds), from the knobs ── */
function timeline() {
  const T = {
    hookKill: KN.hookKill, arrive0: KN.arriveT0, arriveDur: KN.arriveDur, ink0: KN.inkT0, inkDur: KN.inkDur, split0: KN.splitT0,
    rise: KN.riseDur, pairs0: KN.pairsT0, pairStep: KN.pairStep, reveal: KN.revealT, mix: KN.mixT, fly0: KN.flyT0, fly1: KN.flyT1,
    head0: 36.4, head1: 38.3, monday: 62.4,
  };
  return T;
}
const T = timeline();

/* ── the camera: arsenal camera.js sample() on the channels x = azimuth, y = elevation, zoom (log), fx fy fw = look point,
      fh fa = where the look point sits on the sheet (screen offset from the centre) ── */
const ORBIT0 = 14.5;
function camKeys() {
  const key = (t, az, el, zoom, tx, ty, tz, ox, oy, ease) => ({ t, x: az, y: el, zoom, fx: tx, fy: ty, fw: tz, fh: ox, fa: oy, label: '', ease: ease || 'cubic' });
  const mx = KN.modelX - 480, my = KN.modelY - 270;
  return [
    key(0, -34, 21, 1.18, 0, -55, 0, mx, my - 6),
    key(8, -16, 13, 1.05, 0, -75, 0, mx, my),
    key(14.5, 0, KN.frontEl, KN.zoomFront, 0, -92, 0, mx, my),
    key(T.fly0, 0, KN.frontEl, KN.zoomFront, 0, -92, 0, mx, my),
    key(T.fly1, KN.sideAz, KN.sideEl, KN.zoomSide, 0, -48, 0, mx - 40, my + 6),
    key(75, KN.sideAz, KN.sideEl, KN.zoomSide * 0.97, 0, -48, 0, mx - 40, my + 6),
  ];
}
let KEYS = null;
function camAt(t) {
  const c = CAMAPI.sample(KEYS, t, 'cubic');
  return { az: c.x + KN.orbit * Math.max(0, t - ORBIT0), el: c.y, zoom: c.zoom, tx: c.fx, ty: c.fy, tz: c.fw, ox: c.fh, oy: c.fa };
}

/* ── headline words: [text, token] parts; token 0 men, 1 women, 2 neutral ── */
const WORDS = [
  [[pct(AM, NM) + '%', 0]], [[pct(AW, NW) + '%', 1]],
  ...DEPT.map((_, i) => [[pct(MENA[i], MEN[i]) + '%', 0], [pct(WOMA[i], WOM[i]) + '%', 1]]),
  [[String(WOMEN_AHEAD.filter((x) => !x).length), 2]],
  [[pct(MEN[0] + MEN[1], NM) + '%', 0], [pct(WOM[0] + WOM[1], NW) + '%', 1]],
];
const HLX = 40, HLY = 58, HLW = 520, HLH = 150, HLBASE = 120;   // headline layer on the sheet; baseline within it

let S = null;
const fmt = (n) => K0.fmtK(Math.round(n));

window.FILM_RENDER = {
  captions: false,                       // drawn here so the capShift knob can move them

  async setup(p, K) {
    KEYS = camKeys();
    const L = S3.layout({ C: KN.cell, gap: KN.boxGap, foot: 12, layers: KN.slabLayers, slabGap: KN.slabGap, aisle: KN.aisle, men: MEN, menA: MENA, women: WOM, womenA: WOMA });
    S3.bake(p, L);
    const sh = p.createShader(S3.VERT, S3.FRAG), neon = p.createFilterShader(NEON.FRAG);
    const fb = p.createFramebuffer({ density: 2, antialias: true });
    const HL = p.createGraphics(HLW, HLH); HL.pixelDensity(2);
    const times = [T.head0, T.head1];
    DEPT.forEach((_, i) => times.push(T.pairs0 + i * T.pairStep));
    times.push(T.reveal - 0.9, T.mix);
    for (let i = 1; i < times.length; i++) times[i] = Math.max(times[i], times[i - 1] + KN.morphS + 0.35);   // knobs can never cross two morphs
    const morph = MORPH.build(window.FILM_GLYPHS, { em: KN.headSize, maxW: 470, ls: -0.01, gap: 0.34, step: 3, words: WORDS, times, morph: KN.morphS, stagger: 0.35, lift: 7 });
    S = { L, sh, neon, fb, HL, morph, cam: fb.createCamera(), times };
    p.setCamera(K.cam0);
    window.__film3d = { boxes: NM + NW, tiers: L.cols.reduce((n, c) => n + c.tiers.length, 0), blocks: L.depts.length * 2, em: morph.em, headTimes: times };
  },

  render(t, s, K) {
    const p = K.p, C = K.C, { seg, ease } = K, L = S.L, ch = K.chapterAt(t);
    const cam = camAt(t);
    /* ── 1 · camera (orthographic, keyed) ── */
    const az = cam.az * DEG, el = cam.el * DEG, R = 2600, z = cam.zoom;
    S.cam.camera(cam.tx + R * Math.sin(az) * Math.cos(el), cam.ty - R * Math.sin(el), cam.tz + R * Math.cos(az) * Math.cos(el), cam.tx, cam.ty, cam.tz, 0, 1, 0);
    S.cam.ortho((-480 - cam.ox) * z, (480 - cam.ox) * z, (-270 - cam.oy) * z, (270 - cam.oy) * z, -6000, 6000);

    /* ── 2 · the scene into the framebuffer ── */
    const pins = {};
    S.fb.begin();
    p.background(B.bg); p.setCamera(S.cam); p.noStroke(); p.shader(S.sh);
    const sh = S.sh;
    sh.setUniform('uAmb', [0.46, 0.45, 0.5]); sh.setUniform('uKey', [0.72, 0.7, 0.66]); sh.setUniform('uKeyDir', norm([-0.32, 0.5, -0.8]));
    const col = (c, k) => sh.setUniform('uColor', k == null || k === 1 ? c : scl(c, k));
    const at = (x, y, zz, fn) => { p.push(); p.translate(x, y, zz); fn(); p.pop(); };
    // ortho projection to the sheet, written out (worldToScreen under a framebuffer camera comes back mirrored in y)
    const fx = -Math.sin(az) * Math.cos(el), fy = Math.sin(el), fz = -Math.cos(az) * Math.cos(el), rx = Math.cos(az), rz = -Math.sin(az);
    const ux = fy * rz, uy = fz * rx - fx * rz, uz = -fy * rx;   // up = forward x right
    const proj = (name, x, y, zz) => {
      const dx = x - cam.tx, dy = y - cam.ty, dz = zz - cam.tz;
      pins[name] = [480 + cam.ox + (dx * rx + dz * rz) / z, 270 + cam.oy - (dx * ux + dy * uy + dz * uz) / z];
    };
    const C_ = L.C, bw = L.bw;

    // the plinth: the model's base, top face on y = 0
    col(mixc(BG, PANEL, 0.85)); at(0, L.plinth.h / 2, 0, () => p.box(L.plinth.w, L.plinth.h, L.plinth.d));

    // outline of a footprint on the plinth: four thin bars
    const frame = (cx, cz, w, d, h, c) => {
      col(c); const th = 1.6;
      at(cx, -h / 2, cz - d / 2, () => p.box(w + th, h, th)); at(cx, -h / 2, cz + d / 2, () => p.box(w + th, h, th));
      at(cx - w / 2, -h / 2, cz, () => p.box(th, h, d)); at(cx + w / 2, -h / 2, cz, () => p.box(th, h, d));
    };
    const FW = L.foot * C_;
    // a thin rectangular bar-frame at height y (the waterline of a column or a block)
    const bar = (cx, cz, w, d, y, c, k) => {
      col(c, k); const th = 1.5, h = 1.3;
      at(cx, -y, cz - d / 2, () => p.box(w, h, th)); at(cx, -y, cz + d / 2, () => p.box(w, h, th));
      at(cx - w / 2, -y, cz, () => p.box(th, h, d)); at(cx + w / 2, -y, cz, () => p.box(th, h, d));
    };

    /* HOOK: two plain towers, the old process and the new one; the new one is stamped and lowered */
    const out = ease(seg(t, 6.9, 7.9));
    if (t < 8.1) {
      const upO = ease(seg(t, 0.3, 1.8)), upN = ease(seg(t, 0.9, 2.4)), kill = ease(seg(t, T.hookKill + 0.5, T.hookKill + 2.4));
      const hO = 17 * C_ * upO * (1 - out), hN = 12 * C_ * upN * (1 - 0.55 * kill) * (1 - out), W2 = FW * 0.9;
      if (hO > 0.5) { col(OLDC); at(L.cols[0].cx, -hO / 2, 0, () => p.box(W2, hO, W2)); proj('oldTop', L.cols[0].cx, -hO, 0); }
      if (hN > 0.5) { col(kill > 0 ? mixc(NEWC, BG, 0.45 * kill) : NEWC); at(L.cols[1].cx, -hN / 2, 0, () => p.box(W2, hN, W2)); proj('newTop', L.cols[1].cx, -hN, 0); }
    }

    /* COMMIT and after: the two footprints on the plinth */
    const fo = ease(seg(t, 7.4, 8.4)) * (1 - ease(seg(t, T.split0 + 1.0, T.split0 + 2.2)));
    if (fo > 0.01) L.cols.forEach((c) => frame(c.cx, 0, FW, FW, 0.8 * fo + 0.1, mixc(BG, MUTED, 0.75)));
    proj('footM', L.cols[0].cx, 0, FW / 2 + 4); proj('footW', L.cols[1].cx, 0, FW / 2 + 4);

    /* CASE: both columns fill at one rate, layer by layer; then the admitted boxes light, bottom up */
    const rate = NM / T.arriveDur, built = Math.max(0, (t - T.arrive0) * rate);
    const inkU = ease(seg(t, T.ink0, T.ink0 + T.inkDur));
    const sink = ease(seg(t, T.split0, T.split0 + 1.8));
    let colTop = [0, 0], litTop = [0, 0], shown = [0, 0], lit = [0, 0];
    if (built > 0 && sink < 0.995) {
      L.cols.forEach((c) => {
        const a = Math.min(c.n, built), k = inkU * c.A, men = c.sex === 0;
        shown[c.sex] = a; lit[c.sex] = k;
        p.push(); p.scale(1, 1 - sink, 1); p.translate(c.cx, 0, c.cz);
        for (let j = 0; j < c.tiers.length; j++) {
          const lo = j * L.cap, up = Math.min(c.n, lo + L.cap);
          if (lo >= a) break;
          if (up <= a && (up <= k || lo >= k)) { col(up <= k ? SEXC[c.sex] : SEXDIM[c.sex]); p.model(c.tiers[j]); continue; }
          for (let m = lo; m < Math.min(up, Math.ceil(a)); m++) {   // the layer being built, or the layer the light is crossing
            const q = S3.blockPos(L, L.foot, L.foot, m, true), g = Math.min(1, a - m);
            col(m < k ? SEXC[c.sex] : SEXDIM[c.sex]);
            at(q[0], q[1], q[2], () => { if (g < 1) p.scale(g); p.box(bw, bw, bw); });
          }
        }
        p.pop();
        colTop[c.sex] = (a / L.cap) * C_ * (1 - sink); litTop[c.sex] = (k / L.cap) * C_;
        void men;
      });
    }
    // the waterline: a bar round each column at the level the admitted boxes reach
    if (inkU > 0.001 && sink < 0.95) L.cols.forEach((c) => bar(c.cx, 0, FW + 2.4, FW + 2.4, litTop[c.sex] * (1 - sink), INK, 1));
    // COUNT: six slabs rise; each is a plate and two blocks (men, women); lit boxes = admitted
    const mixU = ease(seg(t, T.mix - 0.2, T.mix + 0.6)) * (1 - ease(seg(t, T.monday, T.monday + 0.8)));
    const rv0 = Math.max(0, 1 - Math.abs(t - T.reveal) / KN.neonWidth), hv = 0.5 - 0.5 * Math.cos(Math.PI * rv0);   // a bump 0..1 around the reveal frame
    const hold = ease(seg(t, T.reveal - 0.4, T.reveal + 0.4)) * (1 - ease(seg(t, T.mix - 0.3, T.mix + 0.3)));   // leaders stay a little brighter
    const slabs = [];
    L.depts.forEach((D, i) => {
      const ru = ease(seg(t, T.split0 + 0.8 + 0.45 * i, T.split0 + 0.8 + 0.45 * i + T.rise));
      slabs.push(ru);
      if (ru < 0.004) return;
      const act = Math.max(0, 1 - Math.abs((t - (T.pairs0 + i * T.pairStep + T.pairStep * 0.5)) / (T.pairStep * 0.75)));
      const dimF = i >= 2 ? 0.62 * mixU : 0;
      p.push(); p.translate(0, 0, D.zc); p.scale(1, ru, 1);
      col(mixc(mixc(PLATE, LAV, 0.32 * act), BG, dimF)); at((D.x0 + D.x1) / 2, -L.plateH / 2, 0, () => p.box(D.x1 - D.x0, L.plateH, D.pz));
      D.blocks.forEach((b) => {
        const lead = (b.sex === 1) === WOMEN_AHEAD[i];                 // this block holds the higher rate of its pair
        const boost = (lead ? 0.12 * hold + 0.14 * hv : 0) + 0.08 * act;
        const base = L.plateH;
        p.push(); p.translate(b.cx, -base, 0);
        col(mixc(SEXC[b.sex], BG, dimF), 1 + boost); p.model(b.litGeo);
        col(mixc(SEXDIM[b.sex], BG, dimF * 0.8)); p.model(b.dimGeo);
        p.pop();
      });
      p.pop();
    });
    // waterlines of the six pairs: a bar round each block at its admitted level (ru scales it with the slab)
    L.depts.forEach((D, i) => {
      if (slabs[i] < 0.5) return;
      D.blocks.forEach((b) => {
        const lead = (b.sex === 1) === WOMEN_AHEAD[i], dimF = i >= 2 ? 0.62 * mixU : 0;
        const y = (L.plateH + b.lit * C_) * slabs[i];
        bar(b.cx, D.zc, b.w * C_ + 2.4, b.r * C_ + 2.4, y, mixc(INK, BG, dimF), 1 + (lead ? 0.1 * hold + 0.25 * hv : 0));
      });
    });
    p.resetShader();

    /* pins: 3D points → sheet units while the camera is set */
    L.cols.forEach((c) => proj('top' + c.sex, c.cx, -Math.max(colTop[c.sex], 2), 0));
    L.depts.forEach((D, i) => {
      proj('dept' + i, D.x1 + 8, 0, D.zc);
      D.blocks.forEach((b) => proj('blk' + i + b.sex, b.cx, -(L.plateH + Math.max(b.lit, 0.6) * C_) * slabs[i], D.zc));
    });
    S.fb.end();

    /* ── 3 · the framebuffer, the headline layer, then the neon post pass ── */
    p.setCamera(K.cam0); p.resetMatrix(); p.imageMode(p.CORNER);
    p.image(S.fb, -K.W / 2, -K.H / 2, K.W, K.H);
    const hAlpha = ease(seg(t, T.head0, T.head0 + 0.3)) * (1 - ease(seg(t, T.monday - 0.6, T.monday)));
    const hctx = S.HL.drawingContext;
    hctx.clearRect(0, 0, HLW, HLH);
    if (hAlpha > 0) {
      MORPH.paint(hctx, S.morph, t, 2, HLBASE, [c255(PEACH), c255(LAV), c255(INK)], hAlpha);
      K.gl.clear(K.gl.DEPTH_BUFFER_BIT);
      p.image(S.HL, HLX - K.W / 2, HLY - K.H / 2, HLW, HLH);
    }
    const glow = KN.neonGain * hv;
    if (glow > 0.01) {
      S.neon.setUniform('uRes', [K.W, K.H]); S.neon.setUniform('uGain', 0.5 * glow); S.neon.setUniform('uRadius', KN.neonRadius);
      S.neon.setUniform('uThresh', 0.5); S.neon.setUniform('uCore', 0.5 * glow);
      p.filter(S.neon);
    }

    /* ── 4 · the kit's SVG on top: text pinned to the model, the commit box, captions ── */
    text(K, t, s, ch, pins, { slabs, shown, lit, T });
    K.caption(t + KN.capShift);
  },
};

function norm(v) { const l = Math.hypot(v[0], v[1], v[2]); return v.map((x) => x / l); }

/* ───────────────────────────── text ───────────────────────────── */
function text(K, t, s, ch, pins, st) {
  const C = K.C, { seg, ease } = K, L = S.L;
  const tx = (key, x, y, s, o, role) => K.tx(key, 'labels', x, y, s, role ? Object.assign({ role }, o) : o);
  K.tx('eb', 'labels', 48, 40, ch ? ch.eyebrow : '', { size: 14, fill: C.muted, ls: '0.14em', role: 'secondary' });
  const pin = (key, name, dx, dy, big, small, op, fill) => {          // a leader from a 3D point to a label
    const q = pins[name]; if (!q || op <= 0) return;
    K.ln(key + '.l', 'labels', q[0], q[1], q[0] + dx, q[1] + dy, { stroke: C.muted, w: 1.1, op: op * 0.8 });
    if (big) tx(key + '.b', q[0] + dx + (dx < 0 ? -6 : 6), q[1] + dy + 8, big, { size: 28, weight: 500, anchor: dx < 0 ? 'end' : 'start', fill: fill || C.ink, op }, 'must-read');
    if (small) tx(key + '.s', q[0] + dx + (dx < 0 ? -6 : 6), q[1] + dy - (big ? 22 : -4), small, { size: 14, anchor: dx < 0 ? 'end' : 'start', fill: C.muted, ls: '0.1em', op }, 'secondary');
  };

  /* HOOK and MONDAY: the verdict, left of the model */
  const hk = t < 17 ? 1 - seg(t, 7.4, 8.2) : seg(t, st.T.monday, st.T.monday + 0.8);
  if (hk > 0) {
    const late = t >= 17;
    tx('hk.h', 48, 128, late ? 'Same mix of leads?' : t >= 0.6 ? K.typed('New sales process', t, 0.6, 30) : '', { fam: 'disp', size: late ? 44 : 48, op: hk, fill: late ? C.accent : C.ink }, 'must-read');
    tx('hk.v', 48, 172, late ? K.typed('Split by segment. Then compare.', t, st.T.monday + 1.2, 30) : K.typed('Converts worse overall.', t, 1.4, 30), { size: 28, weight: 500, op: hk }, 'must-read');
    if (!late) {
      if (t >= st.T.hookKill) { const k = K.eout(seg(t, st.T.hookKill, st.T.hookKill + 0.25)); K.stamp('hk.st', 'marks', 150, 236, K.lerp(1.15, 1, k), 'KILLED', { op: hk * seg(t, st.T.hookKill, st.T.hookKill + 0.1), rim: C.soft, rot: -6, fs: 30, h: 48 }); }
      const po = hk * seg(t, 1.9, 2.5);
      pin('pn.old', 'oldTop', -26, -34, null, 'OLD PROCESS', po); pin('pn.new', 'newTop', 26, -34, null, 'NEW PROCESS', po);
    } else {
      const k = seg(t, st.T.monday + 0.4, st.T.monday + 1.0);
      K.stamp('hk.st', 'marks', 150, 236, 1, 'KILLED', { op: hk * 0.55, rim: C.soft, rot: -6, fs: 30, h: 48 });
      K.ln('hk.k', 'marks', 70, 248, 70 + 160 * K.ease(k), 248 - 24 * K.ease(k), { stroke: C.ink, w: 3, op: k > 0 ? hk : 0 });
    }
  }

  /* COMMIT: names on the footprints (words only), then the box */
  const nm = seg(t, 8.0, 8.6) * (1 - seg(t, 17.2, 17.8));
  if (nm > 0) { pin('pn.m', 'footM', 0, 28, null, 'MEN', nm); pin('pn.w', 'footW', 0, 28, null, 'WOMEN', nm); }
  if (t >= F.commit.at - 1.2 && t < 16.6) K.commitBox(t, s, { x: 660, y: 120, w: 270, title: F.commit.title, prompt: 'OF 6 DEPARTMENTS', out: 16.0 });

  /* CASE: counters riding the tops of the two columns (counts only; no percentage before 36 s) */
  const cu = seg(t, st.T.arrive0, st.T.arrive0 + 0.4) * (1 - seg(t, st.T.split0, st.T.split0 + 0.9));
  if (cu > 0) {
    const sexes = [['MEN', NM, AM], ['WOMEN', NW, AW]];
    sexes.forEach(([name, n, a], i) => {
      const q = pins['top' + i]; if (!q) return;
      const admitted = t >= st.T.ink0 + st.T.inkDur - 0.2;
      const big = admitted ? fmt(a) : fmt(Math.min(n, Math.ceil(st.shown[i])));
      const small = admitted ? name + ' · OF ' + fmt(n) : name + ' · APPLIED';
      tx('cn.s' + i, q[0], q[1] - 40, small, { size: 14, anchor: 'middle', fill: C.muted, ls: '0.08em', op: cu }, 'secondary');
      tx('cn.b' + i, q[0], q[1] - 12, big, { size: 28, weight: 500, anchor: 'middle', fill: i ? C.accent : C.soft, op: cu }, 'must-read');
    });
  }

  /* COUNT: department letters on the slabs, the headline's sub-labels, the reveal, the A-and-B share */
  L.depts.forEach((D, i) => {
    const o = seg(st.slabs[i], 0.55, 1) * (1 - seg(t, st.T.monday - 0.4, st.T.monday + 0.2));
    const q = pins['dept' + i]; if (!q || o <= 0) return;
    tx('dp.' + DEPT[i], q[0] + 14, q[1] + 20, DEPT[i], { fam: 'disp', size: 24, anchor: 'middle', fill: C.ink, op: o }, 'secondary');
  });
  headLabels(K, t, tx, st);
  const rv = ease(seg(t, st.T.reveal - 0.5, st.T.reveal + 0.1)) * (1 - ease(seg(t, st.T.mix - 0.4, st.T.mix)));
  if (rv > 0) {
    const g = K.answered(s) ? s.answer : null;
    tx('gs.y', 690, 96, g != null ? 'YOU SAID ' + g : 'NO ANSWER', { size: 28, weight: 500, fill: C.accent, op: rv }, 'must-read');
    tx('gs.n', 690, 132, 'TRUTH · 2 OF 6', { size: 28, weight: 500, op: rv }, 'must-read');
    // the two departments where men led, pinned on the men's blocks
    pin('pn.c', 'blk20', -30, -52, 'MEN +' + (pct(MENA[2], MEN[2]) - pct(WOMA[2], WOM[2])), null, rv, C.soft);
    pin('pn.e', 'blk40', 30, -50, 'MEN +' + (pct(MENA[4], MEN[4]) - pct(WOMA[4], WOM[4])), null, rv, C.soft);
  }
  const mx = ease(seg(t, st.T.mix, st.T.mix + 0.6)) * (1 - ease(seg(t, st.T.monday, st.T.monday + 0.6)));
  if (mx > 0) pin('pn.ab', 'blk10', 40, -46, null, 'THE EASY TWO', mx);
}

const HEADLAB = (() => {              // sub-labels per headline word: [department label, [line1, line2] under men, [line1, line2] under women]
  const f = (n) => K0.fmtK(n);
  const labs = [
    { head: 'OVERALL · SIX DEPARTMENTS', m: ['MEN', f(AM) + ' ÷ ' + f(NM)] },
    { head: 'OVERALL · SIX DEPARTMENTS', w: ['WOMEN', f(AW) + ' ÷ ' + f(NW)] },
  ];
  DEPT.forEach((d, i) => labs.push({ head: 'DEPARTMENT ' + d, m: ['MEN', f(MENA[i]) + ' ÷ ' + f(MEN[i])], w: ['WOMEN', f(WOMA[i]) + ' ÷ ' + f(WOM[i])] }));
  labs.push({ head: 'WOMEN DID WORSE IN', n: 'OF 6 DEPARTMENTS' });
  labs.push({ head: 'APPLIED TO A OR B', m: ['MEN', f(MEN[0] + MEN[1]) + ' ÷ ' + f(NM)], w: ['WOMEN', f(WOM[0] + WOM[1]) + ' ÷ ' + f(NW)] });
  return labs;
})();

function headLabels(K, t, tx, st) {
  const C = K.C, w = MORPH.where(S.morph, t); if (w.i < 0) return;
  const fade = 1 - K.ease(K.seg(t, st.T.monday - 0.6, st.T.monday));
  const useIdx = w.u < 1 && w.e < 0.5 ? w.i - 1 : w.i;
  const op = (w.u < 1 ? Math.abs(2 * w.e - 1) : 1) * fade;
  if (useIdx < 0 || op <= 0.01) return;
  const lab = HEADLAB[useIdx];
  tx('hl.h', 48, 84, lab.head, { size: 14, fill: C.muted, ls: '0.12em', op }, 'secondary');
  const place = (tok, pair, key) => {
    const cx = MORPH.tokCentre(S.morph, t, tok); if (cx == null || !pair) return;
    const x = HLX + 2 + cx;
    tx('hl.' + key + '1', x, HLY + HLBASE + 24, pair[0], { size: 14, anchor: 'middle', fill: tok ? C.accent : C.soft, ls: '0.12em', op }, 'secondary');
    tx('hl.' + key + '2', x, HLY + HLBASE + 44, pair[1], { size: 14, anchor: 'middle', op: op * 0.9 }, 'secondary');
  };
  place(0, lab.m, 'm'); place(1, lab.w, 'w');
  if (lab.n) { const cx = MORPH.tokCentre(S.morph, t, 2); if (cx != null) tx('hl.n', HLX + 2 + cx + 74, HLY + HLBASE - 2, lab.n, { size: 28, weight: 500, op }, 'must-read'); }
}

})();
