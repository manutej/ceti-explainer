/* how-a-network-learns · draft A · "the laboratory" (lib/film.src.js; assembled into ../film.js by lib/assemble.py).
   One clock: render(t, s, K) draws frame t from t alone. Four scenes on three arsenal lanes:
   S1 (0-30 s, 84-120 s) gl-pointcloud: the 150 flowers in a measured box (petal length, petal width, sepal length, cm);
      in COUNT the brush is "right at step k" on a log step clock, decoded per flower in the copied shader.
   S2 (30-58 s) gl-heightfield: the 120 x 80 loss slice, plan view then a crane down; the bead rides the real path
      at its real loss (above the slice at first), with a drop line, an x-ray ghost where the ground hides it,
      a section cut at the bead's column and a flat profile inset.
   S3 (58-84 s) gl-ribbons (shader, splines, slabs): 4 -> 8 -> 3 slabs, band width = |weight| eased between
      checkpoints, 150 marks ride each checkpoint's routes and land as a grid on the predicted species' slab.
   Pins: gl-labels solve (species, START / END, rows 84 and 134), drawn as SVG through K.tx with data-role.
   Every digit on screen comes from params.cl (claims.json values); every tunable is a knob (film.json knobs_doc). */
const F = window.FILM, P = F.params, CL = P.cl, A = window.ARSENAL;
const PC = A.patterns['gl-pointcloud'], HF = A.patterns['gl-heightfield'], RB = A.patterns['gl-ribbons'].api, LB = A.patterns['gl-labels'];
const KN = {}; for (const d of window.KIT.knobs_doc) KN[d.name] = window.KIT.knob(d.name, window.KIT.knobs[d.name]);
const W = 960, H = 540, ASP = W / H, D2R = Math.PI / 180, N = 150, SPR = ['muted', 'accent2', 'ink'];
const NAMES = ['SETOSA', 'VERSICOLOR', 'VIRGINICA'], INPUTS = ['SEPAL LENGTH', 'SEPAL WIDTH', 'PETAL LENGTH', 'PETAL WIDTH'];
const CPK = ['0', '10', '50', '100', '1000'], CPSTEP = [CL.seed, CL.step_10, CL.step_50, CL.step_100, CL.steps_total];
const CPRIGHT = [CL.correct_0, CL.correct_10, CL.correct_50, CL.correct_100, CL.correct_final];
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), lerp = (a, b, u) => a + (b - a) * u;
const DOM = [[0.8, 7.2], [0, 2.6], [4.0, 8.2]];   // cm: the measured box (petal length, petal width, sepal length)
let K, KK, TK, HFTK, RH, PCST, PCP, HFST, HFP, CAM2, CAM3, RST, RP, NET, LAB = {}, MARK, CORR, ROWS, CENT, BAND, OVL;

const hex3 = (c) => window.KIT.hexRgb(c);
const mix = (a, b, u) => { const x = hex3(a), y = hex3(b); return 'rgb(' + [0, 1, 2].map((i) => Math.round(lerp(x[i], y[i], u))).join(',') + ')'; };
const sph = (look, dist, az, el) => [look[0] + dist * Math.cos(el) * Math.sin(az), look[1] - dist * Math.sin(el), look[2] + dist * Math.cos(el) * Math.cos(az)];
const fmt = (n) => window.KIT.fmtK(n);
const STEPLOG = Math.log(1001);
function wrapK(Kit, g) {   // the kit's SVG facade with every opacity scaled by g (SVG fades with the canvas at a scene cut)
  if (g >= 0.999) return Kit;
  const o = Object.create(Kit), sc = (a) => Object.assign({}, a, { op: (a && a.op != null ? a.op : 1) * g });
  o.tx = (key, l, x, y, s, a) => Kit.tx(key, l, x, y, s, sc(a)); o.ln = (key, l, x1, y1, x2, y2, a) => Kit.ln(key, l, x1, y1, x2, y2, sc(a));
  o.rc = (key, l, x, y, w, h, a) => Kit.rc(key, l, x, y, w, h, sc(a)); o.path = (key, l, d, a) => Kit.path(key, l, d, sc(a));
  o.E = (key, tag, l, at, tx) => Kit.E(key, tag, l, Object.assign({}, at, { opacity: ((at.opacity != null ? +at.opacity : 1) * g).toFixed(3) }), tx);
  return o;
}
const dipAt = (t) => { let a = 0; if (KN.cutFade > 0) for (const b of [30, 58, 84]) a = Math.max(a, 1 - Math.abs(t - b) / KN.cutFade); return clamp(a); };

/* ---------- S1: the flower cloud ---------- */
function toW(x, y, z) { const S = KN.cubeSize; return [((x - DOM[0][0]) / (DOM[0][1] - DOM[0][0]) - 0.5) * S, -((y - DOM[1][0]) / (DOM[1][1] - DOM[1][0]) - 0.5) * S, ((z - DOM[2][0]) / (DOM[2][1] - DOM[2][0]) - 0.5) * S]; }
function stepK(t) {   // the brushed cloud's step clock: log (default) or linear, 0 -> 1000 over brushT0 -> brushT1
  const u = window.KIT.seg(t, KN.brushT0, KN.brushT1);
  return KN.brushClock === 'linear' ? 1000 * u : Math.expm1(u * STEPLOG);
}
function camS1(t) {
  let yaw, pitch, dist, look = [0, KN.s1LookY, 0];
  if (t < 84) {
    const y0 = KN.hookYaw0 + KN.camSwing * clamp(Math.min(t, KN.turnT0) / 12), u = window.KIT.ease(window.KIT.seg(t, KN.turnT0, KN.turnT1));
    yaw = lerp(y0, KN.caseYaw, u); pitch = lerp(KN.hookPitch, KN.casePitch, u); dist = lerp(KN.hookDist, KN.caseDist, u);
  } else {
    const u = window.KIT.ease(window.KIT.seg(t, KN.dollyT0, KN.dollyT1));
    yaw = lerp(KN.costYaw + KN.costSwing * window.KIT.seg(t, KN.brushT0, KN.brushT1), KN.dollyYaw, u);
    pitch = KN.costPitch; dist = lerp(KN.costDist, KN.dolly, u);
    look = [lerp(KN.s1bLookX, BAND.focus[0], u), lerp(KN.s1LookY, BAND.focus[1], u), lerp(0, BAND.focus[2], u)];
  }
  const R = KN.cubeSize * 0.87, d = Math.max(8, dist - 2.2 * R);
  return { yaw: yaw * D2R, pitch: pitch * D2R, dist, look, eye: sph(look, dist, yaw * D2R, pitch * D2R), near: d, far: dist + 2.2 * R };
}
const labCam1 = (t) => { const c = camS1(t); return { eye: c.eye, look: c.look, up: [0, 1, 0], fov: 0.72, aspect: ASP }; };

function drawCloud(p, t) {
  const cv = camS1(t), col = window.KIT.ease(window.KIT.seg(t, KN.colorAt, KN.colorAt + KN.colorDur)), cost = t >= 84;
  const tk = { id: TK.id, type: TK.type, color: Object.assign({}, TK.color) };
  SPR.forEach((r, i) => (tk.color['g' + i] = cost ? TK.color[r] : mix(TK.color.muted, TK.color[r], col)));
  tk.color.g3 = TK.color.muted;
  const bs = cost ? window.KIT.ease(window.KIT.seg(t, KN.brushT0 - 0.6, KN.brushT0)) : 0;
  const prm = Object.assign({}, PCP, { cam: { yaw: [cv.yaw, cv.yaw], pitch: [cv.pitch, cv.pitch], dist: [cv.dist, cv.dist], fov: 0.72, follow: 0, look: cv.look },
    uniforms: { uKs: cost ? stepK(t) : 0, uBs: bs, uRs: KN.brushRamp, uDs: KN.dim, uGs: KN.litGrow } });
  PC.draw(p, t, PCST, prm, tk);   // leaves its camera active (hud is cut), depth intact
  // the measured box: whole-cm ticks on three edges (no digits), then the shared band 4.5-5.1 cm
  const S = KN.cubeSize, h = S / 2, tl = 9;
  p.push(); p.stroke(TK.color.muted); p.strokeWeight(1);
  for (let x = 1; x <= 7; x++) { const w = toW(x, 0, 0)[0]; p.line(w, h, h, w, h + tl, h); }
  for (let y = 0; y <= 2; y += 0.5) { const w = toW(0, y, 0)[1]; p.line(-h, w, h, -h - tl * (y % 1 ? 0.5 : 1), w, h); }
  for (let z = 5; z <= 8; z++) { const w = toW(0, 0, z)[2]; p.line(h, h, w, h + tl, h, w); }
  const ba = cost ? (1 - window.KIT.seg(t, KN.mondayAt, KN.mondayAt + 1)) : window.KIT.seg(t, KN.bandAt, KN.bandAt + 0.8);
  if (ba > 0.01 && KN.bandAlpha > 0) {
    const c = hex3(TK.color.accent2), x0 = BAND.x0, x1 = BAND.x1;
    const bk = cost ? 0.55 : 1;
    p.stroke(c[0], c[1], c[2], 200 * ba * bk); p.strokeWeight(1.2); p.fill(c[0], c[1], c[2], 255 * KN.bandAlpha * ba * bk);
    p.translate((x0 + x1) / 2, 0, 0); p.box(x1 - x0, S, S);
  }
  p.pop();
  return cv;
}
function cloudSvg(t, cv) {
  const k = KK, op = (a) => k.seg(t, a, a + 0.6), pr = LB.project({ eye: cv.eye, look: cv.look, up: [0, 1, 0], fov: 0.72, aspect: ASP }, W, H);
  const S = KN.cubeSize, h = S / 2, cost = t >= 84, mo = cost ? (1 - k.seg(t, KN.mondayAt, KN.mondayAt + 1)) * (1 - k.seg(t, KN.dollyT0, KN.dollyT0 + 0.6)) : 1;
  const ax = (key, w, s, o) => { const q = pr(w); if (q[2] > 0) k.tx(key, 'labels', q[0], q[1], s, Object.assign({ size: 12, fill: k.C.muted, role: 'chrome' }, o)); };
  const aop = (cost ? 1 : op(KN.turnT0)) * mo;
  if (aop > 0.01) {
    ax('c1.ax', [toW(4, 0, 0)[0], h + 34, h], 'PETAL LENGTH · CM', { anchor: 'middle', op: aop });
    ax('c1.ay', [-h + 8, -h + 14, h], 'PETAL WIDTH · CM', { anchor: 'start', op: aop });
    ax('c1.az', [h + 18, h + 22, toW(0, 0, 6)[2]], 'SEPAL LENGTH · CM', { anchor: 'start', op: aop });
  }
  const tick = (key, x, at, an, dx) => { const o = (cost ? 1 : op(at)) * mo; if (o > 0.01) ax(key, [toW(x, 0, 0)[0] + dx, h + 20, h], x.toFixed(1), { size: 14, fill: k.C.ink, role: 'secondary', anchor: an, op: o }); };
  tick('c1.t19', CL.setosa_pl_max, KN.tickAt, 'middle', 0);
  tick('c1.t45', CL.virginica_pl_min, KN.bandAt, 'end', -2); tick('c1.t51', CL.versicolor_pl_max, KN.bandAt, 'start', 2);
}

/* ---------- pins (gl-labels solve) drawn as SVG ---------- */
const LOPT = () => ({ w: W, h: H, fps: 30, hold: KN.labelHold, leader: KN.labelLeader, margin: 14, occlusion: false,
  measure: (s, z, f) => String(s).length * z * (window.KIT.ADV[f] || 0.55), measureKey: 'adv' });
function pins(t, key, anchors, cam, reserve, opOf) {
  const k = KK, o = Object.assign(LOPT(), { reserve });
  const res = LB.solve(t, cam, anchors, o);
  for (const q of res.placements) {
    const op = opOf(q.id); if (op <= 0.01) continue;
    const col = RH[q.color] || k.C.ink, anc = q.align === 'right' ? 'end' : q.align === 'center' ? 'middle' : 'start', kk = key + q.id;
    k.rc(kk + '.b', 'labels', q.box[0], q.box[1], q.box[2] - q.box[0], q.box[3] - q.box[1], { fill: k.C.paper, fo: 0.74, op });
    k.ln(kk + '.l', 'labels', q.lead[0], q.lead[1], q.lead[2], q.lead[3], { stroke: col, w: 1.25, op });
    k.E(kk + '.d', 'circle', 'labels', { cx: q.ax.toFixed(1), cy: q.ay.toFixed(1), r: 3.2, fill: col, opacity: op.toFixed(3) });
    k.tx(kk + '.t', 'labels', q.tx, q.ty, q.text, { fam: q.fam, size: q.size, anchor: anc, fill: col, role: q.dataRole, op });
    if (q.sub) k.tx(kk + '.s', 'labels', q.tx, q.sy, q.sub, { fam: q.subFam, size: q.subSize, anchor: anc, fill: k.C.muted, role: q.subDataRole, op });
  }
}
const CAPBAND = [0, 404, W, H];

/* ---------- S2: the loss slice ---------- */
function camS2(t) {
  const k = window.KIT, u = k.ease(k.seg(t, KN.planT1, KN.tiltT1));
  const az = lerp(0, KN.camAz1, u) + KN.camSwing2 * k.ease(k.seg(t, KN.runT0, 58)), el = lerp(89, KN.camEl, u), dist = lerp(KN.camDist0, KN.camDist1, u);
  const look = [0, -KN.hscale * 0.35, 0];
  return { az, el, dist, look, eye: sph(look, dist * HFST.XW, az * D2R, clamp(el, 1, 89) * D2R) };
}
const labCam2 = (tl) => { const c = camS2(tl + 30); return { eye: c.eye, look: c.look, up: [0, 1, 0], fov: 0.78, aspect: ASP }; };
const kAt = (t) => clamp((t - KN.runT0) * KN.stepsPerSec, 0, 1000);
function pathAt(k) {   // packed path: every step to 50, then every 10 (lib/prep.py); linear between kept steps
  const x = k <= 50 ? k : 50 + (k - 50) / 10, i = Math.min(D.pa.length - 2, Math.floor(x)), f = x - i;
  return { c: lerp(D.pa[i], D.pa[i + 1], f), r: lerp(D.pb[i], D.pb[i + 1], f), l: lerp(D.pl[i], D.pl[i + 1], f), i };
}
function world2(q) { return [HFST.x0 + q.c * HFST.cell, -KN.hscale * clamp(q.l / D.vmax), HFST.z0 + q.r * HFST.cell]; }
function ground(c, r) {   // slice height under a fractional cell (bilinear on the mesh heights)
  const C = HFST.cols, c0 = Math.min(C - 2, Math.floor(c)), r0 = Math.min(HFST.rows - 2, Math.floor(r)), fc = c - c0, fr = r - r0, g = HFST.hgt;
  return lerp(lerp(g[r0 * C + c0], g[r0 * C + c0 + 1], fc), lerp(g[(r0 + 1) * C + c0], g[(r0 + 1) * C + c0 + 1], fc), fr);
}
function drawSlice(p, t) {
  const k = KK, cv = camS2(t), kk = kAt(t), q = pathAt(kk), cut = t >= KN.cutStart ? q.c : null;
  HF.draw(p, 0, HFST, Object.assign({}, HFP, { camAz: cv.az, camEl: cv.el, camDist: cv.dist, cutCol: cut }), HFTK);
  CAM2.camera(cv.eye[0], cv.eye[1], cv.eye[2], cv.look[0], cv.look[1], cv.look[2], 0, 1, 0); CAM2.perspective(0.78, ASP, 5, 8000); p.setCamera(CAM2);
  const ro = k.seg(t, KN.planT1, KN.planT1 + 0.6) * (1 - k.seg(t, KN.cutStart, KN.cutStart + 0.5)), mu3 = hex3(TK.color.muted);
  if (ro > 0.01) {   // the loss rule: 0 to 1.4 at the far-left corner, a tick every 0.2 (no digits)
    p.push(); p.stroke(mu3[0], mu3[1], mu3[2], 220 * ro); p.strokeWeight(1); p.line(HFST.x0, 0, HFST.z0, HFST.x0, -KN.hscale, HFST.z0);
    for (let v = 0; v <= 7; v++) { const y = -KN.hscale * v / 7; p.line(HFST.x0, y, HFST.z0, HFST.x0 - 8, y, HFST.z0); } p.pop();
  }
  const ba = k.seg(t, KN.ballAt, KN.ballAt + 0.5);
  if (ba > 0.01) {
    const pts = []; for (let i = 0; i <= q.i; i++) pts.push(world2({ c: D.pa[i], r: D.pb[i], l: D.pl[i] }));
    const b = world2(q); pts.push(b);
    const a2 = hex3(TK.color.accent2), ink = hex3(TK.color.ink);
    const pass = (alpha) => {
      p.push(); p.noFill(); p.stroke(a2[0], a2[1], a2[2], 255 * alpha); p.strokeWeight(KN.trailW);
      if (pts.length > 1) { p.beginShape(); for (const v of pts) p.vertex(v[0], v[1], v[2]); p.endShape(); }
      if (KN.dropLine > 0) { p.stroke(ink[0], ink[1], ink[2], 255 * KN.dropLine * alpha); p.strokeWeight(1); p.line(b[0], b[1], b[2], b[0], -ground(q.c, q.r), b[2]); }
      p.noStroke(); p.fill(a2[0], a2[1], a2[2], 255 * alpha); p.translate(b[0], b[1], b[2]); p.sphere(KN.beadR, 14, 10); p.pop();
    };
    pass(ba);                                               // solid, depth-tested against the slice
    if (KN.ghost > 0) { k.gl.clear(k.gl.DEPTH_BUFFER_BIT); pass(ba * KN.ghost); }   // x-ray where the ground hides it
  }
  if (cut != null) {   // the section's profile, flat: rows x loss at the bead's column, the bead at its real loss
    const col = Math.max(0, Math.min(HFST.cols - 1, Math.round(cut))), x0 = KN.profX, y0 = KN.profY, w = 300, h = 150, gx = x0 + 20, gw = w - 40, gy = y0 + 28, gh = h - 50;
    const X = (r) => gx + gw * r / (HFST.rows - 1), Y = (v) => gy + gh * (1 - clamp(v / D.vmax));
    const op = k.seg(t, KN.cutStart, KN.cutStart + 0.5), a2 = hex3(TK.color.accent2), mu = hex3(TK.color.muted), pn = hex3(TK.color.panel);
    k.flat((g) => {
      g.noStroke(); g.fill(pn[0], pn[1], pn[2], 235 * op); g.rect(x0, y0, w, h);
      g.stroke(mu[0], mu[1], mu[2], 180 * op); g.strokeWeight(1); g.line(gx, gy + gh, gx + gw, gy + gh); g.line(gx, gy, gx, gy + gh);
      g.stroke(mu[0], mu[1], mu[2], 255 * op); g.strokeWeight(1.6); g.noFill(); g.beginShape();
      for (let r = 0; r < HFST.rows; r++) g.vertex(X(r), Y(HFST.M[r][col])); g.endShape();
      g.noStroke(); g.fill(a2[0], a2[1], a2[2], 255 * op); g.circle(X(q.r), Y(q.l), 8);
    });
    k.tx('s2.pt', 'labels', x0 + 12, y0 + 18, 'SECTION AT THE BEAD · LOSS BY WEIGHT B', { size: 12, fill: k.C.muted, role: 'chrome', op });
  }
  return { cv, q, kk };
}
function sliceSvg(t, st) {
  const k = KK, ba = k.seg(t, KN.ballAt, KN.ballAt + 0.5);
  if (ba > 0.01) k.tx('s2.k', 'labels', 48, 70, 'STEP ' + fmt(Math.floor(st.kk + 1e-6)), { size: 18, fill: k.C.ink, role: 'secondary', op: ba });
  const fo = k.seg(t, KN.footAt, KN.footAt + 0.6);
  if (fo > 0.01) k.tx('s2.f', 'labels', 48, 94, 'ground: the other ' + CL.n_params_held + ' held at step ' + fmt(CL.steps_total), { size: 14, fill: k.C.muted, role: 'secondary', op: fo });
  const pr = LB.project(labCam2(t - 30), W, H), ex = HFST.x0 + HFST.XW, ez = HFST.z0 + HFST.ZD, ao = k.seg(t, KN.planT1, KN.planT1 + 0.6) * (1 - k.seg(t, KN.cutStart, KN.cutStart + 0.5));
  const ax = (key, w, s, a) => { const q = pr(w); if (q[2] > 0 && ao > 0.01) k.tx(key, 'labels', q[0], q[1], s, { size: 12, fill: k.C.muted, role: 'chrome', anchor: a, op: ao }); };
  ax('s2.ax', [HFST.x0 + HFST.XW / 2, 6, ez + 24], 'WEIGHT A', 'middle');
  ax('s2.az', [ex + 24, 6, HFST.z0 + HFST.ZD / 2], 'WEIGHT B', 'start');
  ax('s2.ay', [HFST.x0, -KN.hscale - 12, HFST.z0], 'LOSS ↑', 'middle');
  const kend = 1000 / KN.stepsPerSec + KN.runT0;
  if (t < KN.cutStart) pins(t - 30, 's2a.', LAB.s2a, labCam2, [CAPBAND, [40, 40, 440, 104]], () => ba * (1 - k.seg(t, KN.cutStart - 0.4, KN.cutStart)));
  else pins(t - KN.cutStart, 's2b.', LAB.s2b, LAB.cam2b, [CAPBAND, [40, 40, 440, 104], [KN.profX - 6, KN.profY - 6, KN.profX + 306, KN.profY + 156]], () => k.seg(t, kend, kend + 0.5));
}

/* ---------- S3: the network in depth ---------- */
function rideAt(t) { const R = [KN.ride0, KN.ride10, KN.ride50, KN.ride100, KN.ride1000]; let c = -1; for (let i = 0; i < 5; i++) if (t >= R[i]) c = i; return { c, R }; }
function widthsAt(t) {   // |weight| per link, eased to checkpoint c over [ride_c - wEase, ride_c]
  const { R } = rideAt(t); let a = 0, b = 0, u = 0;
  for (let c = 1; c < 5; c++) if (t >= R[c] - KN.wEase) { a = c - 1; b = c; u = window.KIT.ease(window.KIT.seg(t, R[c] - KN.wEase, R[c])); }
  const A1 = NET.cp[a], B1 = NET.cp[b];
  return { w1: A1.w1.map((x, i) => lerp(x, B1.w1[i], u)), w2: A1.w2.map((x, i) => lerp(x, B1.w2[i], u)) };
}
function camS3(t) {
  const az = (KN.az3 + KN.swing3 * window.KIT.ease(window.KIT.seg(t, 58, 84))) * D2R, el = KN.el3 * D2R, look = [KN.netX, 0, 0];
  return { eye: sph(look, KN.dist3, az, el), look, up: [0, 1, 0], fov: 0.7, aspect: ASP };
}
function band(p, sh, l, w, grow, col) {
  const sp = l.sp, S = sp.S, hw = w / 2, hd = Math.min(KN.thick, Math.max(1.2, w)) / 2, add = RB.add;
  sh.setUniform('uColor', col); sh.setUniform('uGrow', grow);
  p.beginShape(p.TRIANGLES);
  const V = (i, off, n) => { const q = add(sp.pos[i], off); p.normal(n[0], n[1], n[2]); p.vertex(q[0], q[1], q[2], i / S, 0); };
  for (let i = 0; i < S; i++) for (const [ax, sg] of [['N', 1]]) {   // the front face only: a flat band, lit by its normal
    const c = (ii, sw, sn) => add(sp.W[ii].map((x) => x * sw * hw), sp.N[ii], sn * hd), nm = (ii) => (ax === 'N' ? sp.N[ii] : sp.W[ii]).map((x) => x * sg);
    const [p0, p1] = ax === 'N' ? [[-1, sg], [1, sg]] : [[sg, -1], [sg, 1]];
    V(i, c(i, p0[0], p0[1]), nm(i)); V(i + 1, c(i + 1, p0[0], p0[1]), nm(i + 1)); V(i + 1, c(i + 1, p1[0], p1[1]), nm(i + 1));
    V(i, c(i, p0[0], p0[1]), nm(i)); V(i + 1, c(i + 1, p1[0], p1[1]), nm(i + 1)); V(i, c(i, p1[0], p1[1]), nm(i));
  }
  p.endShape();
}
function markPos(t, n, c, R) {   // where flower n is during ride c: on L1, on L2, landed (slab grid) or not yet out
  const cp = NET.cp[c], i = cp.r[3 * n], j = cp.r[3 * n + 1], pr = cp.r[3 * n + 2], dep = R[c] + KN.depart * MARK.rank[n] / (N - 1), tr = KN.travel;
  if (t < dep) return null;
  const right = pr === ROWS[n].group, role = right ? SPR[ROWS[n].group] : 'accent';
  const on = (l, s) => { const f = RB.frameAt(l.sp, s), hw = l.w / 2, room = Math.max(0, hw - KN.markSize * 0.7), hd = Math.min(KN.thick, Math.max(1.2, l.w)) / 2;
    return { c: RB.add(RB.add(f.p, f.w, MARK.lane[n] * room), f.n, hd + 0.9), a: f.t, b: f.w, n: f.n, role }; };
  if (t < dep + tr) return on(NET.L1[i * 8 + j], (t - dep) / tr);
  if (t < dep + 2 * tr) return on(NET.L2[j * 3 + pr], (t - dep - tr) / tr);
  const o = NET.out[pr], cell = KN.markSize * 1.5, cols = Math.max(1, Math.floor((o.w - 6) / cell)), sl = cp.slot[n];
  return { c: [o.x - o.w / 2 + 3 + cell * ((sl % cols) + 0.5), o.y0 + o.h - cell * (Math.floor(sl / cols) + 0.5), o.z + 15 + 1.2], a: [1, 0, 0], b: [0, 1, 0], n: [0, 0, 1], role, landed: true };
}
function drawNet(p, t) {
  const k = window.KIT, cam = camS3(t), { c, R } = rideAt(t), wd = widthsAt(t);
  CAM3.camera(cam.eye[0], cam.eye[1], cam.eye[2], cam.look[0], cam.look[1], cam.look[2], 0, 1, 0); CAM3.perspective(cam.fov, ASP, 8, 8000);
  p.setCamera(CAM3); p.noLights(); p.textureMode(p.NORMAL);
  const sh = RB.useShader(p, RST, TK, RP), bg = TK.color.bg, rgb = (s) => RB.rgb(p, s);
  for (const n of NET.inp) RB.slab(p, sh, n, n.h, mix(bg, TK.color.muted, 0.42), 30, 0);
  for (const n of NET.hid) RB.slab(p, sh, n, n.h, mix(bg, TK.color.muted, 0.32), 24, 0);
  NET.out.forEach((n, i) => RB.slab(p, sh, n, n.h, mix(bg, TK.color[SPR[i]], 0.3), 30, 0));
  const g = clamp((t - 58) / KN.grow), rc = rgb(mix(bg, TK.color.muted, KN.ribbonMix));
  sh.setUniform('uStripe', KN.stripes); sh.setUniform('uLen', 6); sh.setUniform('uPhase', t * 0.6);
  NET.L1.forEach((l, q) => { l.w = Math.max(0.6, KN.widthGain * wd.w1[q]); band(p, sh, l, l.w, window.KIT.ease(g) * 1.0001, rc); });
  NET.L2.forEach((l, q) => { l.w = Math.max(0.6, KN.widthGain * wd.w2[q]); band(p, sh, l, l.w, window.KIT.ease(clamp(g * 1.6 - 0.6)) * 1.0001, rc); });
  sh.setUniform('uStripe', 0); sh.setUniform('uGrow', 9);
  let landed = null;
  if (c >= 0) {
    const by = {}, ms = KN.markSize / 2; landed = [0, 0, 0];
    for (let n = 0; n < N; n++) { const m = markPos(t, n, c, R); if (!m) continue; (by[m.role] = by[m.role] || []).push(m); if (m.landed) landed[NET.cp[c].r[3 * n + 2]]++; }
    sh.setUniform('uFlat', 0.6);
    for (const role of Object.keys(by).sort()) {
      sh.setUniform('uColor', rgb(TK.color[role])); p.noStroke(); p.beginShape(p.TRIANGLES);
      for (const m of by[role]) {
        const P_ = (sa, sb) => RB.add(RB.add(m.c, m.a, sa * ms), m.b, sb * ms), q = [P_(-1, -1), P_(1, -1), P_(1, 1), P_(-1, -1), P_(1, 1), P_(-1, 1)];
        p.normal(m.n[0], m.n[1], m.n[2]); for (const v of q) p.vertex(v[0], v[1], v[2], 0, 0);
      }
      p.endShape();
    }
    sh.setUniform('uFlat', 0);
  }
  p.resetShader(); p.textureMode(p.IMAGE);
  return { cam, c, R };
}
function netSvg(t, st) {
  const k = KK, pr = LB.project(st.cam, W, H), { c, R } = st, op0 = k.seg(t, 58.4, 59.2);
  NET.inp.forEach((n, i) => { const q = pr([n.x - n.w / 2 - 10, n.y0 + n.h / 2 + 4, n.z]); k.tx('n.i' + i, 'labels', q[0], q[1], INPUTS[i], { size: 14, anchor: 'end', fill: k.C.muted, role: 'secondary', op: op0 }); });
  const hq = pr([0, NET.hid[0].y0 - 16, NET.hid[0].z]);
  k.tx('n.h', 'labels', hq[0], hq[1], P.hidden + ' HIDDEN UNITS', { size: 14, anchor: 'middle', fill: k.C.muted, role: 'secondary', op: op0 });
  k.tx('n.lg', 'labels', 48, 44, 'ONE MARK, ONE FLOWER · WIDTH = SIZE OF THE WEIGHT · LAVENDER = WRONG NAME', { size: 12, fill: k.C.muted, role: 'chrome', op: op0 });
  const land = (cc) => R[cc] + KN.depart + 2 * KN.travel + 0.05;
  let d = -1; for (let i = 0; i < 5; i++) if (t >= land(i)) d = i;   // the last checkpoint whose ride has landed: its count holds until the next lands
  const riding = c > d, dimP = riding ? lerp(1, 0.5, k.seg(t, R[c], R[c] + 0.4)) : 1;
  const spOp = d === 1 || d === 4 ? k.seg(t, land(d), land(d) + 0.4) * (riding ? 1 - k.seg(t, R[c], R[c] + 0.3) : 1) : 0;
  const SPV = d === 4 ? [CL.setosa_right_final, CL.versicolor_right_final, CL.virginica_right_final] : [CL.setosa_right_10, CL.versicolor_right_10, CL.virginica_right_10];
  NET.out.forEach((n, i) => {
    const q = pr([n.x + n.w / 2 + 12, n.y0 + n.h / 2, n.z]);
    k.tx('n.o' + i, 'labels', q[0], q[1] + (spOp > 0.01 ? 22 : 5), NAMES[i], { size: 16, fill: RH[SPR[i]], role: 'secondary', op: op0 });
    if (spOp > 0.01) k.tx('n.v' + i, 'labels', q[0], q[1] - 2, String(SPV[i]), { fam: 'disp', size: KN.resultSize, fill: RH[SPR[i]], role: 'must-read', op: spOp });
  });
  if (d < 0) return;
  const lo = k.seg(t, land(d), land(d) + 0.3) * dimP, ro = k.seg(t, land(d) + KN.ratioDelay, land(d) + KN.ratioDelay + 0.4) * dimP;
  k.tx('n.st', 'labels', 48, 84, 'STEP ' + fmt(CPSTEP[d]), { size: 18, fill: k.C.ink, role: 'secondary', op: lo });
  k.tx('n.hd', 'labels', 46, 150, String(CPRIGHT[d]), { fam: 'disp', size: 72, fill: k.C.ink, role: 'must-read', op: lo });
  if (d === 1 || d === 4) k.tx('n.r', 'labels', 48, 190, 'OF ' + CL.n_flowers + ' · ' + (d === 1 ? Math.round(CL.acc_10_pct) : CL.acc_final_pct.toFixed(1)) + ' %', { fam: 'disp', size: 30, fill: k.C.ink, role: 'must-read', op: ro });
  else k.tx('n.r', 'labels', 48, 184, 'RIGHT', { size: 16, fill: k.C.muted, role: 'secondary', op: lo });
}

/* ---------- S1b: the cost, a log step chart beside the brushed cloud ---------- */
function costSvg(t) {
  const k = KK, kk = stepK(t), mo = 1 - k.seg(t, KN.mondayAt, KN.mondayAt + 1), op = k.seg(t, KN.brushT0 - 0.4, KN.brushT0 + 0.2) * mo;
  if (op <= 0.01) return;
  const x0 = 48, w = KN.rulerW, yb = 150, hh = 70, X = (s) => x0 + w * Math.log1p(s) / STEPLOG, Y = (c) => yb - hh * c / N;
  k.ln('b.base', 'labels', x0, yb, x0 + w, yb, { stroke: k.C.muted, w: 1, op });
  k.ln('b.top', 'labels', x0, Y(N), x0 + w, Y(N), { stroke: k.C.muted, w: 0.75, dash: '3 4', op: op * 0.7 });
  k.tx('b.topl', 'labels', x0 + w + 6, Y(N) + 4, 'ALL ' + CL.n_flowers, { size: 12, fill: k.C.muted, role: 'chrome', op });
  k.tx('b.lab', 'labels', x0, 44, 'FLOWERS RIGHT BY STEP · LOG STEP CLOCK', { size: 12, fill: k.C.muted, role: 'chrome', op });
  [[CL.step_10, 'b.k10'], [CL.step_90_drop, 'b.k34'], [CL.step_reach_148, 'b.k231'], [CL.steps_total, 'b.k1000']].forEach(([s, key]) => {
    k.ln(key + 'l', 'labels', X(s), yb, X(s), yb + 5, { stroke: k.C.muted, w: 1, op });
    k.tx(key, 'labels', X(s), yb + 18, fmt(s), { size: 12, anchor: 'middle', fill: k.C.muted, role: 'chrome', op });
  });
  let d = '', last = -1; const kn = Math.floor(kk + 1e-6);
  for (let i = 0; i <= 160; i++) { const s = Math.min(kn, Math.round(Math.expm1(i / 160 * STEPLOG))); if (s === last) continue; last = s; d += (d ? 'L' : 'M') + X(s).toFixed(1) + ' ' + Y(CORR[s]).toFixed(1); if (s >= kn) break; }
  k.path('b.tr', 'labels', d, { stroke: k.C.soft, w: 2, op });
  k.E('b.cur', 'circle', 'labels', { cx: X(kk).toFixed(1), cy: Y(CORR[kn]).toFixed(1), r: 4, fill: k.C.soft, opacity: op.toFixed(3) });
  const ms = [[CL.step_90_drop, CL.correct_at_s90, 'b.m34', 212], [CL.step_reach_148, CL.correct_final, 'b.m231', 252]];
  for (const [s, c, key, y] of ms) {
    const o = k.seg(kk, s, s + 0.001) * op; if (o <= 0.01) continue;
    k.tx(key, 'labels', x0, y, String(c), { fam: 'disp', size: KN.resultSize, fill: k.C.soft, role: 'must-read', op: o });
    k.tx(key + 's', 'labels', x0 + 62, y - 2, 'RIGHT AT STEP ' + fmt(s), { size: 16, fill: k.C.ink, role: 'secondary', op: o });
  }
  const po = k.seg(t, KN.rowPinsAt, KN.rowPinsAt + 0.5) * mo;
  pins(t - 84, 's1b.', LAB.s1b, labCamB, [CAPBAND, [40, 30, x0 + w + 60, 262]], () => po);
}
const labCamB = (tl) => labCam1(tl + 84);
const labCamA = (tl) => labCam1(tl);

window.FILM_RENDER = {
  async setup(p, Kit) {
    K = Kit; const B = K.BRAND.color || {};
    TK = { id: K.BRAND.id, type: K.BRAND.type, color: Object.assign({}, B, { bg: K.C.paper, ink: K.C.ink, accent: K.C.accent, accent2: K.C.soft, muted: K.C.muted, line: K.C.line, panel: K.C.panel, chalk: K.C.chalk }) };
    RH = { muted: K.C.muted, accent2: K.C.soft, ink: K.C.ink, accent: K.C.accent, chalk: K.C.chalk };
    // flowers: species, step-0 flags, flip steps -> right count per step and the packed brush attributes
    const Y = [...D.y].map(Number), S0 = [...D.f0].map(Number), flips = Array.from({ length: N }, () => []);
    for (const r of D.tg) flips[r[0]] = r.slice(1);
    const dl = new Int16Array(1001); let c0 = 0;
    for (let i = 0; i < N; i++) { c0 += S0[i]; let s = S0[i]; for (const k of flips[i]) { s = 1 - s; dl[k] += s ? 1 : -1; } }
    CORR = new Int16Array(1001); CORR[0] = c0; for (let k = 1; k <= 1000; k++) CORR[k] = CORR[k - 1] + dl[k];
    const order = K.shuffle(Array.from({ length: N }, (_, i) => i), F.seed), ord = new Array(N); order.forEach((i, j) => (ord[i] = j));
    ROWS = D.cloud.map((q, i) => { const f = flips[i].concat([2000, 2000, 2000]);
      return { x: q[0] / 10, y: q[1] / 10, z: q[2] / 10, group: Y[i], size: 0.5, u: f[0] + 2048 * f[1], v: ord[i] + 256 * (f[2] + 2048 * S0[i]) }; });
    PCP = Object.assign({}, PC.params, { dur: 120, data: ROWS, domain: DOM, size: KN.cubeSize, r: KN.pointR, sizeCue: KN.sizeCue, fog: KN.fog, fogStart: 0.2,
      frame: true, axes: null, groupRoles: ['g0', 'g1', 'g2', 'g3'], reveal: [KN.revealAt0 / 120, KN.revealAt1 / 120], revealBy: 'index', brush: null, pins: false, readout: false, dof: null });
    PCST = await PC.setup(p, { seed: F.seed, tokens: TK, fonts: { disp: null, mono: null } }, PCP);
    // band, centroids, the two flowers it never gets right
    BAND = { x0: toW(CL.virginica_pl_min, 0, 0)[0], x1: toW(CL.versicolor_pl_max, 0, 0)[0] };
    const wr = ROWS.map((r) => toW(r.x, r.y, r.z)), miss = [83, 133];
    BAND.focus = [0, 1, 2].map((a) => (wr[miss[0]][a] + wr[miss[1]][a]) / 2);
    CENT = [0, 1, 2].map((g) => { const m = wr.filter((_, i) => Y[i] === g); return [0, 1, 2].map((a) => m.reduce((s, v) => s + v[a], 0) / m.length); });
    const on1 = (a, i) => (tt) => (tt >= a ? i : NaN);
    LAB.s1a = (tt) => [
      ...CENT.map((c, g) => ({ id: 'sp' + g, x: on1(KN.pinsAt, c[0])(tt), y: c[1] - 10, z: c[2], text: NAMES[g], role: 'secondary', size: KN.pinSize, color: SPR[g], priority: 3 - g })),
      { id: 'band', x: on1(KN.bandAt, (BAND.x0 + BAND.x1) / 2)(tt), y: -KN.cubeSize / 2, z: KN.cubeSize / 2, text: CL.petal_overlap + ' FLOWERS IN THE SHARED BAND', role: 'secondary', size: KN.pinSize, color: 'accent2', priority: 5 },
    ];
    const rowTxt = ['VERSICOLOR, CALLED VIRGINICA', 'VIRGINICA, CALLED VERSICOLOR'], rowN = String(CL.wrong_rows || '').split(/,\s*/);
    LAB.s1b = (tl) => miss.map((m, j) => ({ id: 'row' + j, x: tl + 84 >= KN.rowPinsAt ? wr[m][0] : NaN, y: wr[m][1], z: wr[m][2], text: 'ROW ' + (rowN[j] || ''), sub: rowTxt[j], role: 'result', size: KN.resultSize, color: 'accent', priority: 2 - j }));
    // S2: the slice (uint8 / 255 x vmax, row-major) into gl-heightfield
    const bin = atob(D.sf), M = [];
    for (let r = 0; r < D.rows; r++) { const row = []; for (let c = 0; c < D.cols; c++) row.push(bin.charCodeAt(r * D.cols + c) / 255 * D.vmax); M.push(row); }
    HFP = Object.assign({}, HF.params, { dur: 1, data: M, vmin: 0, vmax: D.vmax, size: KN.hfSize, hscale: KN.hscale, contours: KN.contours, contourRole: KN.contourRole,
      reveal: null, cutMode: 'section', profile: false, pins: false, hud: false, camT: [0, 1], camLook: 'centre', follow: 0, fov: 0.78, slab: 10, cutCol: null });
    HFST = await HF.setup(p, { seed: F.seed, tokens: TK, fonts: null }, HFP);
    HFTK = { id: TK.id, type: TK.type, color: Object.assign({}, TK.color, { accent2: mix(TK.color.bg, TK.color.muted, 0.42) }) };   // the cut face reads as cut material, the bead keeps the amber
    CAM2 = p.createCamera(); CAM3 = p.createCamera(); LAB.cam2b = (tl) => labCam2(tl + KN.cutStart - 30);
    const q0 = world2(pathAt(0)), q1 = world2(pathAt(1000));
    LAB.s2a = [{ id: 'start', x: q0[0], y: q0[1], z: q0[2], text: CL.loss_0.toFixed(3), sub: 'START · LOSS', role: 'result', size: KN.resultSize, color: 'accent2', priority: 2 }];
    LAB.s2b = [{ id: 'end', x: q1[0], y: q1[1], z: q1[2], text: CL.loss_final.toFixed(3), sub: 'END · LOSS · STEP ' + fmt(CL.steps_total), role: 'result', size: KN.resultSize, color: 'accent2', priority: 1 }];
    // S3: slabs, 56 splines, marks (lane, departure rank, landing slot per checkpoint)
    RP = { curv: KN.curv, seg: 20, shape: 'band', thick: KN.thick, tubeMax: 60, amb: 0.62, fog: [500, 1500], fogK: KN.fogK };
    RST = { sh: p.createShader(RB.VERT, RB.FRAG) };
    const stack = (n, x, w) => { const h = (KN.stackH - (n - 1) * KN.slabGap) / n; return Array.from({ length: n }, (_, i) => ({ x, w, h, y0: -KN.stackH / 2 + i * (h + KN.slabGap), z: (i - (n - 1) / 2) * KN.zSpread })); };
    NET = { inp: stack(4, -KN.layerX, 22), hid: stack(8, 0, 16), out: stack(3, KN.layerX, 58), L1: [], L2: [], cp: [] };
    const G = { byId: {} }; NET.inp.forEach((n, i) => (G.byId['i' + i] = n)); NET.hid.forEach((n, i) => (G.byId['h' + i] = n)); NET.out.forEach((n, i) => (G.byId['o' + i] = n));
    for (let i = 0; i < 4; i++) for (let j = 0; j < 8; j++) { const a = NET.inp[i], b = NET.hid[j], l = { s: 'i' + i, t: 'h' + j, ys: a.y0 + (j + 0.5) * a.h / 8, yt: b.y0 + (i + 0.5) * b.h / 4, w: 1 }; l.sp = RB.splineOf(G, l, RP); NET.L1.push(l); }
    for (let j = 0; j < 8; j++) for (let o = 0; o < 3; o++) { const a = NET.hid[j], b = NET.out[o], l = { s: 'h' + j, t: 'o' + o, ys: a.y0 + (o + 0.5) * a.h / 3, yt: b.y0 + (j + 0.5) * b.h / 8, w: 1 }; l.sp = RB.splineOf(G, l, RP); NET.L2.push(l); }
    const rank = new Array(N); K.shuffle(Array.from({ length: N }, (_, i) => i), F.seed + 1).forEach((n, j) => (rank[n] = j));
    MARK = { rank, lane: Array.from({ length: N }, (_, n) => ((n * 0.6180339887) % 1) * 2 - 1) };
    const check = [];
    for (const key of CPK) {
      const c = D.nw[key], r = [...c.r].map(Number), slot = new Array(N), right = [0, 0, 0], cnt = [0, 0, 0], byDep = Array.from({ length: N }, (_, n) => n).sort((a, b) => rank[a] - rank[b] || a - b);
      for (const n of byDep) if (r[3 * n + 2] === Y[n]) slot[n] = right[r[3 * n + 2]]++;
      for (const n of byDep) if (r[3 * n + 2] !== Y[n]) { const o = r[3 * n + 2]; slot[n] = right[o] + cnt[o]++; }
      NET.cp.push({ w1: c.w1, w2: c.w2, r, slot });
      check.push(right.reduce((a, b) => a + b, 0) + '/' + right.join(','));
    }
    window.__hnl = { corr: [CORR[0], CORR[10], CORR[34], CORR[231], CORR[1000]], cp: check };   // data self-check: 13, 135, 143, 148, 148
  },

  render(t, s, Kit) {
    const p = Kit.p, k = Kit; KK = wrapK(Kit, 1 - dipAt(t));
    if (t < 30 || t >= 84) {
      const cv = drawCloud(p, t);
      cloudSvg(t, cv);
      if (t < 30) pins(t, 's1a.', LAB.s1a, labCamA, [CAPBAND], (id) => k.seg(t, id === 'band' ? KN.bandAt : KN.pinsAt, (id === 'band' ? KN.bandAt : KN.pinsAt) + 0.5));
      else costSvg(t);
    } else if (t < 58) {
      const st = drawSlice(p, t); sliceSvg(t, st);
    } else {
      const st = drawNet(p, t); netSvg(t, st);
    }
    // scene cuts dip to the ground; MONDAY holds the cloud at a third
    const a = Math.max(dipAt(t), KN.mondayDim * k.ease(k.seg(t, KN.mondayAt, KN.mondayAt + 1.2)));
    if (a > 0.003) { const g = hex3(TK.color.bg); k.flat((q) => { q.noStroke(); q.fill(g[0], g[1], g[2], 255 * clamp(a)); q.rect(-2, -2, W + 4, H + 4); }); }
  },
};
