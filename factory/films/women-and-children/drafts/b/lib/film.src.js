/* women-and-children · draft B · "the deck plan". Renderer webgl (kit2), one clock: render(t, state) draws frame t from t.
   2,201 boxes (one per person aboard, Dawson 1995) are baked once by gl-stack-city with both homes per box. The film
   reads them first as a PLAN: a top-down view of three one-layer carpets (women, children, men) whose areas are the
   counts and whose lit rows are the survivors. Only at the split does the plan tilt into 3D (the boxes rise into twelve
   rate slabs, lit height = rate), under one hard key light from one side. The camera drops to deck level for the
   third-class children, pans along the deck to the first-class men, and the reveal is the one emissive claim: the lit
   27 and the lit 57 bloom through gl-post (tone map every frame). Pins are gl-labels (analytic camera, slab occluders,
   a hard-cut callout); every word and digit is kit SVG with a data-role. Every tunable is a knob (film.json). */
(function () {
'use strict';
const K = window.KIT, F = window.FILM, P = F.params, AR = window.ARSENAL;
const SC = AR.patterns['gl-stack-city'], LB = AR.patterns['gl-labels'], PO = AR.post['gl-post'];
const { seg, clamp, lerp, fmtK } = K;
const Z = {}; (F.knobs_doc || []).forEach((d) => { Z[d.name] = K.knob(d.name, F.knobs[d.name]); });
const W = 960, H = 540, BC = K.BRAND.color, R = K.C, DEG = Math.PI / 180;
const sm = (u) => { u = clamp(u, 0, 1); return u * u * u * (u * (u * 6 - 15) + 10); };
const sg = (t, a, d) => sm((t - a) / Math.max(1e-6, d));
const rd = Math.round;

/* ── data: the 12 cells from film.json params (= claims.json ids), never retyped ── */
const CATS = ['FIRST', 'SECOND', 'THIRD', 'CREW'], CK = ['p1', 'p2', 'p3', 'cr'];
const GRP = ['WOMEN', 'CHILDREN', 'MEN'], GK = ['Women', 'Child', 'Men'], PK = ['women', 'child', 'men'];
const N = GK.map((g) => CK.map((c) => P[c + g + 'N'])), Y = GK.map((g) => CK.map((c) => P[c + g + 'Y']));
const RATE = GK.map((g) => CK.map((c) => P[c + g + 'Rate']));
const GTOT = N.map((r) => r.reduce((a, b) => a + b, 0));
const COLS = rd(Z.poolCols), ROWS = Math.ceil(Math.max(...GTOT) / COLS);
const T120 = 120;   // gl-stack-city reads beats as fractions of its dur: dur 120 makes them absolute film seconds
const SP = {
  data: { groups: GRP, cats: CATS, n: N, hit: Y, unit: 'PERSON', units: 'PEOPLE', hitWord: 'LIVED', source: '' },
  layout: 'bars', split: 'rate', arrange: 'row', k: Z.k, budget: Z.budget, size: Z.boxSize, gap: Z.boxGap,
  foot: [COLS, ROWS], slabFoot: [4, 4], layers: rd(Z.layers), depth: rd(Z.depth), slabGap: Z.slabGap, pairGap: Z.pairGap,
  groupGap: Z.groupGap, poolX: 0, pooledSort: 'hit-cat', colorBy: 'group', dur: T120, ratioDelay: Z.ratioDelay,
  beats: { arrive: [Z.arr0 / T120, Z.arr1 / T120], lit: [Z.lit0 / T120, Z.lit1 / T120], move: [Z.move0 / T120, Z.move1 / T120], reveal: [0.99, 1] },
  arrW: Z.arrW, drop: Z.drop, stagger: Z.stagger, lift: Z.lift, orderMix: Z.orderMix,
  reveal: 'none', labels: 'none', checkLine: false, tag: ['CHILDREN/THIRD/0', 'MEN/FIRST/0'],
};
const CELL = [];   // the counted group: lit boxes of CHILDREN/THIRD and MEN/FIRST (cell index g * 4 + c)
for (let i = 0; i < 12; i++) CELL.push(i === 1 * 4 + 2 || i === 2 * 4 + 0 ? 1 : 0);

/* ── the vertex shader: gl-stack-city's motion (same formula as its CPU twin boxAt), colours in LINEAR scene light
      (gl-post toScene), one hard key + ambient + rim, a per-cell mask and an emission gain for the reveal ── */
const VERT = `precision highp float;
attribute vec3 aPosition; attribute vec3 aNormal; attribute vec3 aFrom; attribute vec3 aTo; attribute vec4 aInfo; attribute vec2 aArr;
uniform mat4 uModelViewMatrix; uniform mat4 uProjectionMatrix;
uniform float uSize, uMove, uStag, uLift, uArr, uArrW, uDrop, uLit, uMaskOn, uMaskDim, uEmit;
uniform vec3 uPal[3]; uniform vec3 uDim[3]; uniform float uCell[12];
uniform vec3 uAmb, uKey, uRim, uKeyDir, uRimDir, uBg, uTag;
varying vec3 vCol;
void main(){
  float a = clamp((uArr - aArr.x) / uArrW, 0.0, 1.0);
  float u = clamp(uMove * (1.0 + uStag) - aInfo.w * uStag, 0.0, 1.0);
  float e = u * u * u * (u * (u * 6.0 - 15.0) + 10.0);
  vec3 c = mix(aFrom, aTo, e);
  c.y -= sin(3.14159265 * u) * uLift + (1.0 - a) * (1.0 - a) * uDrop;
  vec3 pos = c + aPosition * uSize * (0.35 + 0.65 * a);
  int gi = int(aInfo.x + 0.5), ci = int(aInfo.y + 0.5);
  float lit = step(aInfo.z, uLit), tg = step(0.5, aArr.y);
  vec3 base = mix(uDim[gi], uPal[gi], lit);
  base = mix(base, uTag, tg * lit);
  float m = uCell[gi * 4 + ci];
  vec3 l = uAmb + uKey * max(dot(aNormal, uKeyDir), 0.0) + uRim * max(dot(aNormal, uRimDir), 0.0);
  vec3 col = base * l * mix(1.0, uEmit, m * lit);
  vCol = mix(col, uBg, uMaskOn * (1.0 - m) * uMaskDim);   // the counted cells keep their whole slab (the rate needs its height)
  gl_Position = (a <= 0.0) ? vec4(3.0, 3.0, 3.0, 1.0) : uProjectionMatrix * uModelViewMatrix * vec4(pos, 1.0);
}`;
const FRAG = 'precision highp float; varying vec3 vCol; void main(){ gl_FragColor = vec4(vCol, 1.0); }';
const dirOf = (az, el) => [Math.cos(el * DEG) * Math.sin(az * DEG), -Math.sin(el * DEG), Math.cos(el * DEG) * Math.cos(az * DEG)];

let st, ps, cam, sh, TK, SCN, ANCH, OCC, LBO, TAGS, SEQ, PX, CLS;

/* ── camera: keyed (az, el, ortho zoom, look) on absolute times; the SAME function feeds p5 and the label solver ── */
function keys() {
  const sl = (c, g) => st.split[c][g], z3c = sl(2, 1).cz, z1m = sl(0, 2).cz;
  const K_ = (az, el, s, look) => ({ az, el, s, look });
  const PLAN = K_(Z.planAz, Z.planEl, Z.planZoom, [0, 0, Z.planLookZ]);
  const SPLIT = K_(Z.splitAz, Z.splitEl, Z.splitZoom, [0, Z.splitLookY, 0]);
  const D3 = K_(Z.deckAz, Z.deckEl, Z.deckZoom, [0, Z.deckLookY, z3c]), D1 = K_(Z.deckAz, Z.deckEl, Z.deckZoom, [0, Z.deckLookY, z1m]);
  const REV = K_(Z.revAz, Z.revEl, Z.revZoom, [0, Z.revLookY, lerp(z1m, z3c, Z.revMix)]);
  const CREW = K_(Z.revAz, Z.crewEl, Z.crewZoom, [0, Z.revLookY, 0]), MON = K_(Z.revAz, Z.monEl, Z.monZoom, [0, Z.monLookY, 0]);
  const s = [[0, PLAN], [Z.tilt0, PLAN], [Z.tilt1, SPLIT], [Z.deckT0, SPLIT], [Z.deckT0 + Z.deckDur, D3], [Z.menT0, D3], [Z.menT0 + Z.menDur, D1],
    [Z.revT0, D1], [Z.revT0 + Z.revDur, REV], [Z.crewT0, REV], [Z.crewT0 + Z.crewDur, CREW], [Z.monT0, CREW], [Z.monT0 + Z.monDur, MON]];
  for (let i = 1; i < s.length; i++) s[i][0] = Math.max(s[i][0], s[i - 1][0]);   // knob moves can never reorder the keys
  return s;
}
function keyAt(t) {
  let i = 0; while (i < SEQ.length - 1 && SEQ[i + 1][0] <= t) i++;
  if (i >= SEQ.length - 1) return SEQ[SEQ.length - 1][1];
  const [t0, a] = SEQ[i], [t1, b] = SEQ[i + 1], u = sm((t - t0) / Math.max(1e-6, t1 - t0));
  return { az: lerp(a.az, b.az, u), el: lerp(a.el, b.el, u), s: lerp(a.s, b.s, u), look: a.look.map((x, j) => lerp(x, b.look[j], u)) };
}
function camAt(t) {
  const k = keyAt(t), dr = Z.hookDrift * Math.sin(Math.PI * Math.min(t, Z.tilt0) / 24) * (1 - sg(t, Z.tilt0, Z.tilt1 - Z.tilt0));
  const az = (k.az + dr) * DEG, el = k.el * DEG, d = 3000, L = k.look;
  return { eye: [L[0] + d * Math.cos(el) * Math.sin(az), L[1] - d * Math.sin(el), L[2] + d * Math.cos(el) * Math.cos(az)], look: L, up: [0, 1, 0], ortho: k.s };
}
const camEl = (t) => keyAt(t).el;
function setCam(p, c) {
  cam.camera(c.eye[0], c.eye[1], c.eye[2], c.look[0], c.look[1], c.look[2], 0, 1, 0);
  cam.ortho(-W / 2 * c.ortho, W / 2 * c.ortho, -H / 2 * c.ortho, H / 2 * c.ortho, 1, 8000);
  p.setCamera(cam);
}

/* ── timing helpers (all pure of t) ── */
const revRamp = (t) => sg(t, Z.glow0, Z.glowUp) * (1 - sg(t, Z.glow2, Z.glowDown));
const monRamp = (t) => sg(t, Z.monT0, Z.monDur);
const glowAt = (t) => Math.max(revRamp(t), Z.monGlow * monRamp(t));
const maskAt = (t) => Math.max(sg(t, Z.mask0, Z.maskDur) * (1 - sg(t, Z.mask2, Z.maskDur)), Z.monMask * monRamp(t));
function postAt(t) {
  const r = revRamp(t);
  return { level: Z.postLevel, bloomGain: Z.bloomGain * glowAt(t), vignetteGain: Z.vignetteGain * Math.max(r, monRamp(t)), dofGain: Z.dofGain * r,
    dofFocus: Z.dofFocus, ortho: true, near: 1, far: 8000, grainGain: Z.grainGain * r, chromaGain: Z.chromaGain * r,
    exposure: Z.exposure * lerp(1, Z.monExposure, monRamp(t)) };
}

/* ── scene (inside gl-post's linear framebuffer) ── */
const U = (k, v) => sh.setUniform(k, v);
const f255 = (c, a) => [clamp(c[0], 0, 1) * 255, clamp(c[1], 0, 1) * 255, clamp(c[2], 0, 1) * 255, a == null ? 255 : a * 255];
function drawGround(p, t) {
  p.resetShader(); p.noStroke(); p.fill(...f255(SCN.ground));
  p.push(); p.translate(0, 0.6, 0); p.rotateX(Math.PI / 2); p.plane(SCN.gw, SCN.gd); p.pop();
  const go = Z.gridOp * sm(camEl(t) / 30);   // the plan grid fades as the camera drops toward deck level
  if (go <= 0.01) return;
  const gs = st.P * Z.gridStep, hw = SCN.gw / 2, hd = SCN.gd / 2;
  p.stroke(...f255(SCN.grid, go)); p.strokeWeight(1);
  for (let x = -Math.floor(hw / gs) * gs; x <= hw + 1e-6; x += gs) p.line(x, 0.2, -hd, x, 0.2, hd);
  for (let z = -Math.floor(hd / gs) * gs; z <= hd + 1e-6; z += gs) p.line(-hw, 0.2, z, hw, 0.2, z);
  p.noStroke();
}
function drawBoxes(p, ph, t) {
  p.shader(sh); p.noStroke();
  U('uSize', SP.size); U('uMove', ph.move); U('uStag', SP.stagger); U('uLift', SP.lift); U('uArr', ph.arr); U('uArrW', SP.arrW); U('uDrop', SP.drop);
  U('uLit', ph.lit); U('uPal', SCN.pal); U('uDim', SCN.dim); U('uCell', CELL); U('uMaskOn', maskAt(t)); U('uMaskDim', Z.maskDim);
  U('uEmit', 1 + (Z.revealEmit - 1) * glowAt(t));
  U('uAmb', [Z.ambGain, Z.ambGain, Z.ambGain]); U('uKey', [Z.keyGain, Z.keyGain, Z.keyGain]); U('uRim', SCN.rim);
  U('uKeyDir', dirOf(Z.keyAz, Z.keyEl)); U('uRimDir', dirOf(Z.keyAz + 180, 20)); U('uBg', SCN.bg); U('uTag', SCN.tag);
  p.model(st.geo); p.resetShader();
}
function drawTags(p, ph, t, pr) {
  const op = seg(t, Z.arr1, Z.arr1 + 0.6) * (1 - seg(t, Z.tagOut, Z.tagOut + 0.8)), out = [];
  if (op <= 0) return out;
  p.drawingContext.clear(p.drawingContext.DEPTH_BUFFER_BIT); p.resetShader(); p.noFill();
  for (const b of TAGS) {
    const q = SC.api.boxAt(st, SP, ph, b);
    if (q.a < 1) continue;
    if (q.u > 0) {   // its own path so far, and a ghost of the pooled home it left
      p.stroke(...f255(SCN.tag, 0.55 * op)); p.strokeWeight(1.5); p.beginShape();
      for (let i = 0; i <= 32; i++) { const r = SC.api.boxAt(st, SP, ph, b, q.u * i / 32); p.vertex(r.c[0], r.c[1], r.c[2]); }
      p.endShape();
      p.strokeWeight(1); p.push(); p.translate(b.from[0], b.from[1], b.from[2]); p.box(SP.size); p.pop();
    }
    p.stroke(...f255(SCN.tag, op)); p.strokeWeight(2); p.push(); p.translate(q.c[0], q.c[1], q.c[2]); p.box(SP.size * 1.3); p.pop();
    const s = pr([q.c[0], q.c[1] - SP.size, q.c[2]]); out.push({ b, x: s[0], y: s[1], op });
  }
  return out;
}

/* ── SVG (kit): every word and digit, with a data-role ── */
function tx(key, x, y, s, o) { K.tx(key, 'labels', x, y, s, o); }
function pinOut(q, op, subOp, dimmed) {
  if (op <= 0.01) return;
  const key = 'pin.' + q.id + (q.callout ? '.co' : ''), fill = q.callout ? R.accent : dimmed ? R.muted : R.ink;
  const an = q.align === 'right' ? 'end' : q.align === 'center' ? 'middle' : 'start';
  if (!dimmed) K.rc(key + '.p', 'labels', q.box[0], q.box[1], q.box[2] - q.box[0], q.box[3] - q.box[1], { fill: R.paper, fo: Z.plateOp * op });
  K.ln(key + '.l', 'labels', q.lead[0], q.lead[1], q.lead[2], q.lead[3], { stroke: fill, w: q.callout ? 1.6 : 1.1, op });
  K.rc(key + '.d', 'labels', q.ax - 2, q.ay - 2, 4, 4, { fill, fo: op });
  tx(key + '.t', q.tx, q.ty, q.text, { fam: q.fam, size: q.size, anchor: an, fill, role: q.dataRole, op });
  if (q.sub && subOp > 0.01) tx(key + '.s', q.tx, q.sy, q.sub, { fam: q.subFam, size: q.subSize, anchor: an, fill: q.callout ? R.ink : fill, role: q.subDataRole, op: op * subOp });
}
function legend(t) {
  const op = seg(t, Z.arr1, Z.arr1 + 0.8) * (1 - seg(t, Z.monT0, Z.monT0 + 1));
  if (op <= 0) return;
  let x = Z.legendX; const y = 40, items = GRP.map((g, i) => [g, SCN.gcol[i]]);
  items.forEach(([g, col], i) => { K.rc('lg.s' + i, 'labels', x, y - 10, 10, 10, { fill: col, fo: op }); tx('lg.t' + i, x + 15, y, g, { fam: 'mono', size: 12, fill: R.muted, role: 'chrome', op }); x += 30 + g.length * 7.4; });
  K.rc('lg.sd', 'labels', x, y - 10, 10, 10, { fill: SCN.dimHex, fo: op, stroke: R.muted, w: 0.6 });
  tx('lg.td', x + 15, y, 'DIM = DID NOT LIVE', { fam: 'mono', size: 12, fill: R.muted, role: 'chrome', op });
}
function typeSheet(t) {
  const hk = 1 - seg(t, Z.hookOut, Z.hookOut + 0.8);
  if (hk > 0) {
    tx('hk.rule', 480, Z.ruleY, K.typed('“Women and children first.”', t, Z.hookRule, Z.cps), { fam: 'disp', size: Z.ruleSize, anchor: 'middle', fill: R.ink, role: 'must-read', op: hk });
    if (t >= Z.hookQ) tx('hk.q', 480, Z.ruleY + Z.ruleSize * 1.25, K.typed('Did it hold for every child aboard?', t, Z.hookQ, Z.cps), { fam: 'disp', size: Z.qSize, anchor: 'middle', fill: R.accent, role: 'must-read', op: hk });
  }
  if (t >= Z.monQ) {
    const q = K.typed('Your “on average” result: which group does it leave out?', t, Z.monQ, Z.cps);
    K.wrap(q, 860, Z.monQSize, 'disp').forEach((ln, i) => tx('mo.q' + i, 480, Z.monY + i * Z.monQSize * 1.2, ln, { fam: 'disp', size: Z.monQSize, anchor: 'middle', fill: R.ink, role: 'must-read' }));
    if (t >= Z.monHonest) {
      const hy = Z.monY + 2 * Z.monQSize * 1.2 + 14, hop = seg(t, Z.monHonest, Z.monHonest + 0.8);
      K.wrap('One night, one inquiry’s count: it shows who lived, not why.', 860, 28, 'disp').forEach((ln, i) => tx('mo.h' + i, 480, hy + i * 34, ln, { fam: 'disp', size: 28, anchor: 'middle', fill: R.muted, role: 'must-read', op: hop }));
    }
  }
}
function readout(t, ph) {
  const op = seg(t, Z.arr0, Z.arr0 + 0.5) * (1 - seg(t, Z.poolOut, Z.poolOut + 0.6));
  if (op <= 0) return;
  if (ph.boxes > 0) tx('ro.n', 48, 82, fmtK(ph.boxes), { fam: 'disp', size: Z.countSize, fill: R.accent, role: 'must-read', op });
  tx('ro.u', 48, 106, P.perBox + ' BOX = ' + P.perBox + ' PERSON ABOARD', { fam: 'mono', size: 14, fill: R.ink, role: 'secondary', op });
  const lo = op * seg(t, Z.lit1, Z.lit1 + 0.6);
  if (lo > 0) tx('ro.l', 48, 142, fmtK(P.survived) + ' LIVED', { fam: 'disp', size: 28, fill: R.ink, role: 'must-read', op: lo });
}
function pooled(t, pr) {
  const out = 1 - seg(t, Z.poolOut, Z.poolOut + 0.6), opN = seg(t, Z.arr1 + 0.2, Z.arr1 + 1) * out;
  if (opN <= 0) return;
  const opC = seg(t, Z.pinPool, Z.pinPool + 0.5) * out, opR = seg(t, Z.pinPool + Z.ratioDelay, Z.pinPool + Z.ratioDelay + 0.5) * out;
  for (let g = 0; g < 3; g++) {
    const s = st.pooled[g], zb = s.cz + s.b * st.P / 2, zt = zb - Math.ceil(GTOT[g] / s.a) * st.P;
    const b = pr([s.cx, 0, zb + 4]), top = pr([s.cx, 0, zt - 4]);
    tx('po.n' + g, b[0], b[1] + 18, GRP[g], { fam: 'mono', size: 14, anchor: 'middle', fill: SCN.gcol[g], role: 'secondary', op: opN });
    if (opC > 0) tx('po.c' + g, top[0], top[1] - 10, fmtK(P[PK[g] + 'Y']) + ' OF ' + fmtK(P[PK[g] + 'N']), { fam: 'disp', size: Z.poolCount, anchor: 'middle', fill: R.ink, role: 'must-read', op: opC });
    if (opR > 0) tx('po.r' + g, top[0], top[1] - 10 - Z.poolCount * 1.15, P[PK[g] + 'Rate'] + ' %', { fam: 'disp', size: Z.poolCount, anchor: 'middle', fill: R.accent, role: 'must-read', op: opR });
  }
}
function classAxis(t, pr) {
  const op = seg(t, Z.move1, Z.move1 + 0.8) * (1 - seg(t, Z.monT0, Z.monT0 + 1));
  if (op <= 0) return;
  CLS.forEach((c, i) => {
    const s = pr([SCN.front, 0, c.z]); if (!(s[0] > 30 && s[0] < 930 && s[1] > 20 && s[1] < 440)) return;
    tx('ax.' + i, s[0], s[1] + 16, CATS[i], { fam: 'mono', size: 14, anchor: 'middle', fill: R.muted, role: 'secondary', op });
  });
}
function tagText(t, tags) {
  const op = seg(t, Z.move0, Z.move0 + 0.6) * (1 - seg(t, Z.tagOut - 0.6, Z.tagOut));
  if (op <= 0) return;
  tags.forEach((q, i) => tx('tg.' + i, q.x + 14, q.y - 14, i === 0 ? 'ONE THIRD-CLASS CHILD · LIVED' : 'ONE FIRST-CLASS MAN · LIVED', { fam: 'mono', size: 14, fill: R.accent, role: 'secondary', op: op * q.op }));
}
function pins(t) {
  if (t < Z.pinIn - 0.1 || t >= Z.coEnd + 0.6) return;
  const sol = LB.solve(t, camAt, ANCH, LBO), out = 1 - seg(t, Z.coEnd, Z.coEnd + 0.5);
  const inCo = t >= Z.co1 && t < Z.coOff, inRev = t >= Z.coOff && t < Z.co5, inCrew = t >= Z.co5;
  const revOut = 1 - seg(t, Z.coOff, Z.coOff + 0.5), crewIn = seg(t, Z.co5, Z.co5 + 0.5);
  for (const q of sol.placements) {
    const a = ANCH.byId[q.id], t0 = Z.pinIn + a.rank * Z.pinStep;
    let op = seg(t, t0, t0 + 0.4) * out, subOp = seg(t, t0 + Z.ratioDelay, t0 + Z.ratioDelay + 0.4);
    if (q.callout) { op = out * (inRev ? 0 : 1); subOp = 1; }
    else if (inRev) op *= revOut;
    else if (inCrew) op *= q.id === 'CREW/WOMEN' ? crewIn : 0;
    pinOut(q, q.callout ? op : op * (inCo && !inCrew ? Z.pinDimOp : 1), subOp, inCo && !q.callout);
  }
}
function reveal(t, pr) {
  const op = seg(t, Z.res0, Z.res0 + 0.6) * (1 - seg(t, Z.co5 - 0.6, Z.co5));
  if (op <= 0) return;
  const two = [[2, 1, P.p3ChildRate, fmtK(P.p3ChildY) + ' OF ' + fmtK(P.p3ChildN), 'THIRD-CLASS CHILDREN', P.p3ChildPer10],
    [0, 2, P.p1MenRate, fmtK(P.p1MenY) + ' OF ' + fmtK(P.p1MenN), 'FIRST-CLASS MEN', P.p1MenPer10]];
  const o10 = op * seg(t, Z.per10, Z.per10 + 0.6);
  two.forEach(([c, g, rate, cnt, name, per], i) => {
    const s = st.split[c][g], top = pr([s.cx, -s.layers * st.P, s.cz]), x = top[0], y = top[1] - 14;
    tx('rv.n' + i, x, y, name, { fam: 'mono', size: 14, anchor: 'middle', fill: R.ink, role: 'secondary', op });
    tx('rv.c' + i, x, y - 20, cnt, { fam: 'mono', size: 14, anchor: 'middle', fill: R.ink, role: 'secondary', op });
    tx('rv.r' + i, x, y - 42, rate + ' %', { fam: 'disp', size: Z.resultSize, anchor: 'middle', fill: R.accent, role: 'must-read', op });
    if (o10 > 0) tx('rv.p' + i, x, y - 42 - Z.resultSize * 1.05, per + ' IN ' + P.perTen, { fam: 'disp', size: 28, anchor: 'middle', fill: R.ink, role: 'must-read', op: o10 });
  });
}

window.FILM_RENDER = {
  async setup(p) {
    TK = { color: BC, type: K.BRAND.type };
    st = await SC.setup(p, { seed: K.SEED, tokens: TK }, SP);
    ps = PO.setup(p, { seed: K.SEED, w: W, h: H, tokens: TK });
    cam = ps.hdr.createCamera(); sh = p.createShader(VERT, FRAG);
    const lin = PO.linear, mixL = (a, b, u) => lin(a).map((x, i) => x + (lin(b)[i] - x) * u), S = (l3, e) => PO.toSceneLinear(l3, e, ps);
    const gcol = [BC.ink, BC.accent2, BC.muted];   // women cream, children ember (the film's subject), men lavender
    const hex = (l3) => '#' + l3.map((v) => rd(255 * (v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055)).toString(16).padStart(2, '0')).join('');
    const P_ = st.P, ext = st.split.flat().filter((s) => s.n > 0);
    SCN = { gcol, pal: gcol.map((h) => S(lin(h), 1)).flat(), dim: gcol.map((h) => S(mixL(h, BC.bg, Z.dim), 1)).flat(), dimHex: hex(mixL(BC.muted, BC.bg, Z.dim)),
      bg: S(lin(BC.bg), 1), tag: S(lin(BC.accent), 1), ground: S(mixL(BC.bg, BC.panel, Z.deckTone), 1), grid: S(mixL(BC.bg, BC.muted, 0.3), 1),
      rim: S(lin(BC.accent2), 1).map((v) => v * Z.rimGain),
      gw: Math.max(...st.pooled.map((s) => Math.abs(s.cx) + s.a * P_ / 2)) * 2 + Z.deckPad * 2,
      gd: Math.max(st.pooled[0].b * P_, ...ext.map((s) => Math.abs(s.cz) * 2 + s.b * P_)) + Z.deckPad * 2, front: Math.max(...ext.map((s) => s.cx + s.a * P_ / 2)) + 6 };
    TAGS = [1, 2].map((g) => st.box.find((b) => b.tag && b.g === g)).filter(Boolean);   // [the third-class child, the first-class man]
    SEQ = keys();
    CLS = CATS.map((_, c) => { const ss = st.split[c].filter((s) => s.n > 0), lo = Math.min(...ss.map((s) => s.cz - s.b * P_ / 2)), hi = Math.max(...ss.map((s) => s.cz + s.b * P_ / 2)); return { z: (lo + hi) / 2 }; });
    // gl-labels: one anchor per non-empty slab (CREW/CHILDREN has 0 boxes: no anchor, no pin), slab AABBs as occluders
    ANCH = []; OCC = [];
    for (let c = 0; c < 4; c++) for (let g = 0; g < 3; g++) {
      if (!(N[g][c] > 0)) continue;
      const s = st.split[c][g], hh = s.layers * P_;
      ANCH.push({ id: CATS[c] + '/' + GRP[g], x: s.cx, y: -hh - 3, z: s.cz, text: fmtK(Y[g][c]) + ' OF ' + fmtK(N[g][c]), sub: RATE[g][c] + ' %', role: 'secondary', priority: (g === 1 ? 5000 : 0) + N[g][c] });
      OCC.push({ min: [s.cx - s.a * P_ / 2, -hh, s.cz - s.b * P_ / 2], max: [s.cx + s.a * P_ / 2, 0, s.cz + s.b * P_ / 2] });
    }
    ANCH.byId = {}; ANCH.slice().sort((a, b) => b.priority - a.priority).forEach((a, i) => { a.rank = i; ANCH.byId[a.id] = a; });
    const co = (id, y, n, sub) => ({ t: 0, id, text: fmtK(y) + ' OF ' + fmtK(n), sub });
    const SCHED = [Object.assign(co('FIRST/CHILDREN', P.p1ChildY, P.p1ChildN, 'CHILDREN · FIRST CLASS · ' + P.p1ChildRate + ' %'), { t: Z.co1 }),
      Object.assign(co('SECOND/CHILDREN', P.p2ChildY, P.p2ChildN, 'CHILDREN · SECOND CLASS · ' + P.p2ChildRate + ' %'), { t: Z.co2 }),
      Object.assign(co('THIRD/CHILDREN', P.p3ChildY, P.p3ChildN, 'CHILDREN · THIRD CLASS · ' + P.p3ChildLost + ' DID NOT LIVE'), { t: Z.co3 }),
      Object.assign(co('FIRST/MEN', P.p1MenY, P.p1MenN, 'MEN · FIRST CLASS · ' + P.p1MenRate + ' %'), { t: Z.co4 }),
      { t: Z.coOff, id: null },
      Object.assign(co('CREW/MEN', P.crMenY, P.crMenN, 'CREW ' + fmtK(P.crN) + ' · ' + fmtK(P.crY) + ' LIVED'), { t: Z.co5 }),
      { t: Z.coEnd, id: null }];
    const adv = (s, z, f) => String(s).length * z * (f === 'disp' ? 0.5 : 0.62);
    LBO = { w: W, h: H, fps: 30, hold: Z.hold, leader: Z.leader, margin: 14, occlusion: true, occluders: OCC, maxShown: Z.maxShown, sticky: Z.sticky,
      reserve: [[0, 418, 960, 540], [Z.legendX - 8, 22, 950, 50]], callout: { leader: Z.calloutLeader, size: Z.calloutSize, schedule: SCHED }, measure: adv, measureKey: 'adv' };
    PX = (t) => LB.project(camAt(t), W, H);
    window.__wc = { check: (t) => SC.api.check(st, SP, SC.api.phase(st, SP, t)), cam: camAt, boxes: st.boxes, k: st.k };
  },
  render(t, s, Kk) {
    const p = Kk.p, ph = SC.api.phase(st, SP, t), c = camAt(t), pr = PX(t);
    ps.hdr.begin();
    p.clear(SCN.bg[0], SCN.bg[1], SCN.bg[2], 1); p.noLights();
    setCam(p, c);
    drawGround(p, t);
    drawBoxes(p, ph, t);
    const tags = drawTags(p, ph, t, pr);
    ps.hdr.end();
    PO.apply(p, ps.hdr, t, postAt(t), TK, ps);
    typeSheet(t); readout(t, ph); legend(t); pooled(t, pr); classAxis(t, pr); tagText(t, tags); pins(t); reveal(t, pr);
  },
};
})();
