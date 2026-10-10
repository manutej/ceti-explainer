/* a-bell-from-dice / draft A · "the table" · a dark felt table seen from above; 100,000 rolls of five dice land as a
   flat field of marks; the camera lowers to the side and the same marks re-partition, by the first die (flat) and then
   by the sum (a bell); the camera pushes into the tail; the counted cells take over and a cut counts the tail; the
   exact bell (ways of 7,776) is drawn as a thin line over the count.
   Renderer webgl (kit2). One clock: render(t, state) draws frame t from t alone. The 500,000 draws are made once at
   load from the brief's generator (mulberry32 seed 1733, one stream, die j of roll i = draw 5i+j) and checked against
   claims.json count for count (a mismatch throws: the film does not render wrong dice). Route a (beats.md): every roll
   is ONE mark carrying three homes (waffle cell, first-die stack slot, sum stack slot) as texels; the vertex shader
   moves it on t. Words and digits are SVG (K.tx, roled); every digit is a claim value from film.json params.
   Every tunable is a knob (film.json knobs; camera keys through rig.toKnobs). No Math.random / Date / performance. */
(function () {
'use strict';
const K = window.KIT, F = window.FILM, P = F.params, A = window.ARSENAL;
const GI = A.patterns['gl-instances'].api, RIGM = A.patterns['gl-camera-rig'].rig, VOL = A.patterns['gl-volume'], LAB = A.patterns['gl-labels'];
const { seg, clamp, lerp, fmtK, C } = K;
const CH = K.BRAND.color.chalk || C.ink;                                 // the pack's chalk role (kit role 'chalk' is the panel surface)
const kn = (n, d) => K.knob(n, d);
const ez = (u) => { u = clamp(u, 0, 1); return u * u * (3 - 2 * u); };
const sm5 = (u) => { u = clamp(u, 0, 1); return u * u * u * (u * (u * 6 - 15) + 10); };   // gl-volume's own ease (the cut position)
const fade = (t, a, b, c, d) => Math.min(seg(t, a, b), 1 - seg(t, c, d));   // up over [a,b], down over [c,d]

/* ── knobs, read once ── */
const Z = {};
[['countT0', 12.4], ['countT1', 23.6], ['countWin', 0.02], ['waffPitch', 1.5], ['waffFill', 0.7],
  ['cubePitch', 2.0], ['cubeFill', 0.8], ['fdW', 20], ['fdD', 12], ['fdGap', 24], ['sumW', 12], ['sumD', 5], ['sumGap', 8],
  ['fd0', 28.0], ['fdSpread', 3.4], ['fdFly', 1.6], ['fdLift', 34], ['sum0', 44.0], ['sumSpread', 1.8], ['sumFly', 1.2], ['sumLift', 46],
  ['diceT0', 2.0], ['diceStep', 0.4], ['diceSize', 62], ['sumAt', 4.2], ['flatAt', 8.2], ['hookOut', 11.4],
  ['landAt', 24.0], ['pinsFirstAt', 34.0], ['pinsFirstOut', 39.6], ['equalAt', 47.0], ['pinsSumAt', 55.4], ['tailLitAt', 58.4], ['pinsTailAt', 60.4],
  ['volIn', 66.0], ['volFade', 0.6], ['volBuild', 0.9], ['volStagger', 0.6], ['volAlpha', 0.55], ['volCutDim', 0.45],
  ['cutT0', 70.0], ['cutT1', 76.0], ['tailAt', 76.0], ['ratioAt', 82.0], ['beliefAt', 86.0], ['timesAt', 88.0],
  ['exactT0', 92.0], ['exactT1', 96.0], ['waysAt', 96.0], ['tailExactAt', 98.0], ['agreeAt', 102.0],
  ['cutOffAt', 80.0], ['mondayAt', 107.6], ['bandAt', 109.0], ['bandDim', 0.72], ['feltMargin', 70], ['hotFlash', 1],
  ['readSize', 56], ['ratioSize', 32], ['pinSub', 14], ['labHold', 4], ['labLeader', 22], ['exactW', 2.2],
].forEach(([n, d]) => { Z[n] = kn(n, d); });

/* ── the generator (brief.md, bit-exact) and the count, checked against the claims ── */
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0;
  let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
  return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const N = P.rolls, NS = P.dice * P.faces - P.dice + 1, SMIN = P.dice, SMAX = P.dice * P.faces;
const FIRST = new Uint8Array(N), SUM = new Uint8Array(N), ROLL0 = [];
{
  const rnd = mulberry32(P.seed);
  for (let i = 0; i < N; i++) {
    let s = 0;
    for (let j = 0; j < P.dice; j++) { const f = 1 + Math.floor(rnd() * P.faces); s += f; if (j === 0) FIRST[i] = f; if (i === 0) ROLL0.push(f); }
    SUM[i] = s;
  }
}
const SIM = new Array(SMAX + 1).fill(0), FD = new Array(P.faces + 1).fill(0), TF = new Array(P.faces + 1).fill(0);
for (let i = 0; i < N; i++) { SIM[SUM[i]]++; FD[FIRST[i]]++; if (SUM[i] > P.tailCut) TF[FIRST[i]]++; }
const CHECK = (() => {
  const bad = [];
  for (let s = SMIN; s <= SMAX; s++) if (SIM[s] !== P['sim' + s]) bad.push('sim' + s);
  for (let f = 1; f <= P.faces; f++) { if (FD[f] !== P['first' + f]) bad.push('first' + f); if (TF[f] !== P['tailFirst' + f]) bad.push('tailFirst' + f); }
  if (ROLL0.reduce((a, b) => a + b, 0) !== P.roll0Sum) bad.push('roll0Sum');
  // data/checkpoints.json: after the first k rolls, [rolls above 25, first die = 6, sum of sums]
  const CK = { 1: [0, 0, 18], 10: [0, 2, 197], 100: [1, 22, 1784], 1000: [16, 178, 17618], 10000: [149, 1694, 175229], 50000: [835, 8275, 875740], 100000: [1655, 16519, 1750158] };
  let tl = 0, f6 = 0, ss = 0;
  for (let i = 0; i < N; i++) { if (SUM[i] > P.tailCut) tl++; if (FIRST[i] === 6) f6++; ss += SUM[i]; const c = CK[i + 1]; if (c && (c[0] !== tl || c[1] !== f6 || c[2] !== ss)) bad.push('checkpoint ' + (i + 1)); }
  return { ok: bad.length === 0, bad, roll0: ROLL0.slice() };
})();
window.__dice = CHECK;
const sumOf = (a, b) => { let n = 0; for (let s = a; s <= b; s++) n += P['sim' + s]; return n; };
const TAIL = sumOf(P.tailCut + 1, SMAX), MID = sumOf(P.midLo, P.midHi);

/* ── the three homes of every roll (world units; p5 y is down, the felt is y = 0, stacks rise to -y) ── */
const PC = Z.cubePitch, CS = PC * Z.cubeFill, WP = Z.waffPitch, WS = WP * Z.waffFill, WC = 500, WR = Math.ceil(N / WC);
const FX1 = Math.round(Z.fdW), FZ1 = Math.round(Z.fdD), FX2 = Math.round(Z.sumW), FZ2 = Math.round(Z.sumD);
const COLP = FX2 * PC + Z.sumGap, SPAN2 = NS * COLP, L2N = FX2 * FZ2;
const colX = (s) => (s - (SMIN + SMAX) / 2) * COLP;                       // centre x of the stack of sum s
const stackH = (c) => Math.ceil(c / L2N) * PC;                           // height of a sum stack holding c rolls
const contH = (c) => c / L2N * PC;                                       // the same count as a continuous height (volume, lines)
const SPAN1 = P.faces * FX1 * PC + (P.faces - 1) * Z.fdGap, L1N = FX1 * FZ1;
const fdX = (f) => -SPAN1 / 2 + (f - 1) * (FX1 * PC + Z.fdGap) + FX1 * PC / 2;
const FRONT2 = FZ2 * PC / 2;                                             // z of the sum stacks' front faces
function homes() {
  const buf = new Float32Array(GI.TEXW * Math.ceil(4 * N / GI.TEXW) * 4);
  const f1 = new Array(P.faces + 1).fill(0), f2 = new Array(SMAX + 1).fill(0);
  for (let i = 0; i < N; i++) {
    const o = i * 16, cx = i % WC, cz = Math.floor(i / WC);
    buf[o] = (cx - (WC - 1) / 2) * WP; buf[o + 1] = -WS / 2; buf[o + 2] = (cz - (WR - 1) / 2) * WP; buf[o + 3] = SUM[i];
    buf[o + 4] = 0; buf[o + 5] = 0; buf[o + 6] = 1; buf[o + 7] = i;      // arrival rank = roll index (order 'given')
    let j = f1[FIRST[i]]++, layer = Math.floor(j / L1N), cell = j % L1N;
    buf[o + 8] = fdX(FIRST[i]) + ((cell % FX1) - (FX1 - 1) / 2) * PC; buf[o + 9] = -(layer + 0.5) * PC; buf[o + 10] = (Math.floor(cell / FX1) - (FZ1 - 1) / 2) * PC; buf[o + 11] = FIRST[i];
    j = f2[SUM[i]]++; layer = Math.floor(j / L2N); cell = j % L2N;
    buf[o + 12] = colX(SUM[i]) + ((cell % FX2) - (FX2 - 1) / 2) * PC; buf[o + 13] = -(layer + 0.5) * PC; buf[o + 14] = (Math.floor(cell / FX2) - (FZ2 - 1) / 2) * PC; buf[o + 15] = 0;
  }
  return buf;
}
const H1 = (f) => Math.ceil(P['first' + f] / L1N) * PC;

/* ── camera: the rig script with every scalar a knob; scene points = sum-stack tops + the bell centre ── */
const SCENE = { points: [] };
for (let s = SMIN; s <= SMAX; s++) SCENE.points.push([colX(s), -stackH(P['sim' + s]), 0]);
SCENE.points.push([0, -130, 0]);
const BASE = window.BELL_RIG;
const SCRIPT = RIGM.fromKnobs(BASE, (n, v) => K.knob(n, v), SCENE);
{ const z0 = SCRIPT.start, el = 89 * Math.PI / 180, r = 2400; z0.center = [0, 0, 0]; z0.eye = [0, -r * Math.sin(el), r * Math.cos(el)]; }
const RIG = RIGM.compile(SCRIPT, SCENE);
const poseAt = (t) => RIGM.at(RIG, t);
const LABCAM = (tt) => { const q = RIGM.at(RIG, tt); return { eye: q.eye, look: q.center, up: q.up, ortho: 1 / (q.zoom || 1) }; };
const scr = (q, pt) => RIGM.worldToScreen(q, pt, K.W, K.H);

/* ── instance params for gl-instances' bindMarks (box marks, arrival order 'given') ── */
const GP = { dur: F.dur, countIn: [Z.countT0 / F.dur, Z.countT1 / F.dur], countEase: 'smooth', win: Z.countWin, layout: 'stack', mark: 'box', render: 'marks',
  roles: ['ink', 'accent', 'accent2', 'muted', 'chalk', 'panel'], size: 1, alpha: 1, grow: 1, dim: Z.bandDim, brush: null, pick: null, drawOrder: 'arrival' };

/* ── volume params: the 26 counted sums as cells, sized so each slab IS its stack (same x, width, height scale) ── */
const SIMS = []; for (let s = SMIN; s <= SMAX; s++) SIMS.push(P['sim' + s]);
const SMAXC = Math.max(...SIMS);
const VP = { dur: F.dur, data: SIMS, dataKind: 'counts', range: [[SMIN - 0.5, SMAX + 0.5]], axisNames: ['SUM'],
  size: [SPAN2, contH(SMAXC), FZ2 * PC], gap: Z.sumGap / COLP, alpha: [Z.volAlpha, Z.volAlpha],
  tail: P.tailCut + 0.5, tailAxis: 'x', tailIn: [Z.tailAt / F.dur, (Z.tailAt + 0.8) / F.dur], ratioAt: Z.ratioAt / F.dur,
  build: [Z.volIn / F.dur, (Z.volIn + Z.volBuild) / F.dur], stagger: Z.volStagger,
  cutIn: [Z.cutT0 / F.dur, Z.cutT1 / F.dur], cutFrom: 0.5 / NS, cutTo: (P.tailCut - SMIN + 1 - 0.02) / NS, cutDim: Z.volCutDim,
  orbit: [0, 0], elev: [4, 4], dist: 2400, fov: 0.8, look: [0, -130, 0], inset: [0, 0, 1, 1], pin: false };

/* ── labels (gl-labels): one anchors array per beat, the same object every frame ── */
const AN = {
  first: [1, 2, 3, 4, 5, 6].map((f) => ({ id: 'f' + f, x: fdX(f), y: -H1(f) - 2, z: 0, text: fmtK(P['first' + f]), role: 'result', priority: 1, color: 'ink' })),
  sums: [[SMIN, 'LOWEST'], [P.modeLo, ''], [P.modeHi, ''], [SMAX, 'HIGHEST']].map(([s, sub], i) => ({ id: 's' + s, x: colX(s), y: -stackH(P['sim' + s]) - 2, z: FRONT2,
    text: fmtK(P['sim' + s]), sub: sub || null, role: 'result', priority: i === 1 || i === 2 ? 3 : 2, color: 'ink' })),
  tail: [26, 27, 28, 29, 30].map((s) => ({ id: 't' + s, x: colX(s), y: -stackH(P['sim' + s]) - 2, z: FRONT2, text: fmtK(P['sim' + s]), role: 'result', priority: 31 - s, color: 'accent' })),
};
const LOPT = { w: K.W, h: K.H, fps: 30, hold: Math.round(Z.labHold), leader: Z.labLeader, margin: 16, sticky: 'chain', occlusion: false,
  measure: (str, z, fam) => String(str).length * z * (fam === 'disp' ? 0.58 : 0.62), measureKey: 'bell-a',
  reserve: [[0, 438, 960, 540], [600, 30, 960, 200]] };
function pins(t, set, op, layerKey, opts) {
  if (op <= 0.01) return;
  const sol = LAB.solve(t, LABCAM, AN[set], opts || LOPT);
  for (const q of sol.placements) {
    const key = 'pin.' + layerKey + '.' + q.id, col = q.color === 'accent' ? C.accent : C.ink, anc = q.align === 'right' ? 'end' : q.align === 'center' ? 'middle' : 'start';
    K.ln(key + '.l', 'labels', q.lead[0], q.lead[1], q.lead[2], q.lead[3], { stroke: col, w: 1.2, op });
    K.E(key + '.d', 'circle', 'labels', { cx: q.ax.toFixed(1), cy: q.ay.toFixed(1), r: 2.6, fill: col, opacity: op.toFixed(3) });
    K.tx(key + '.t', 'labels', q.tx, q.ty, q.text, { fam: 'disp', size: Math.max(28, q.size), anchor: anc, fill: col, role: 'must-read', op });
    if (q.sub) K.tx(key + '.s', 'labels', q.tx, q.sy + 2, q.sub, { fam: 'mono', size: Z.pinSub, anchor: anc, fill: C.muted, role: 'secondary', op });
  }
}

/* ── S1 the throw: five dice as pips (SVG), no digits on the dice ── */
const PIPS = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
  5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] };
function die(key, cx, cy, s, face, op, layer) {
  if (op <= 0.01) return;
  K.rc(key, layer, cx - s / 2, cy - s / 2, s, s, { fill: C.ink, rx: s * 0.16, op });
  PIPS[face].forEach(([u, v], i) => K.E(key + '.p' + i, 'circle', layer, { cx: (cx + u * s * 0.27).toFixed(1), cy: (cy + v * s * 0.27).toFixed(1), r: (s * 0.085).toFixed(2), fill: C.paper, opacity: op.toFixed(3) }));
}
function throwRow(t, x0, y, s, gap, op, landT0, step, layer, keyp) {
  ROLL0.forEach((f, j) => {
    const u = landT0 == null ? 1 : ez((t - landT0 - j * step) / 0.5), dy = (1 - u) * -46;
    die(keyp + j, x0 + j * (s + gap) + s / 2, y + dy, s, f, op * u, layer);
  });
}

/* ── state built in setup ── */
let ST = null;
const tkOf = () => ({ color: Object.assign({}, K.BRAND.color), type: K.BRAND.type });

window.FILM_RENDER = {
  async setup(p, kk) {
    if (!CHECK.ok) throw new Error('a-bell-from-dice: the generator disagrees with claims.json: ' + CHECK.bad.join(', '));
    const st = { tk: tkOf(), cam: p.createCamera() };
    // gl-instances: data texture (4 texels per mark), one chunked box geometry (top, front, left faces), the module's shader
    const TH = Math.ceil(4 * N / GI.TEXW);
    st.gi = { N, chunk: 256, buf: homes() };
    st.gi.fb = p.createFramebuffer({ width: GI.TEXW, height: TH, density: 1, format: p.FLOAT, channels: p.RGBA, antialias: false, depth: false, textureFiltering: p.NEAREST });
    GI.upload(p, st.gi);
    const faces = ['-y', '+z', '-x'];
    st.gi.geom = p.buildGeometry(() => { p.noStroke(); for (let j = 0; j < st.gi.chunk; j++) { p.push(); p.translate(j * GI.STEP, 0, 0);
      for (const fc of faces) { p.push(); GI.FACE[fc](p); p.plane(1, 1); p.pop(); } p.pop(); } });
    st.gi.sh = p.createShader(GI.VERT, GI.FRAG);
    // gl-volume: the counted cells (camera handed in from the rig every frame)
    st.vol = await VOL.setup(p, { tokens: st.tk, seed: F.seed, fonts: {} }, VP);
    st.volA = st.vol.marks.map((m) => m.a);
    if (st.vol.tailSamples !== TAIL || st.vol.grid.total !== N) throw new Error('a-bell-from-dice: volume tail ' + st.vol.tailSamples + ' / total ' + st.vol.grid.total);
    ST = st;
  },

  render(t, s, kk) {
    const p = kk.p, st = ST; if (!st) return;
    const q = poseAt(t), cam = st.cam;
    RIGM.apply(p, cam, q, RIG); p.setCamera(cam); p.noLights();

    /* the felt table */
    const fw = WC * WP + 2 * Z.feltMargin, fd = WR * WP + 2 * Z.feltMargin;
    p.push(); p.translate(0, 3, 0); p.rotateX(Math.PI / 2); p.noStroke(); p.fill(C.panel); p.plane(fw, fd); p.pop();
    { const c = p.color(C.muted); c.setAlpha(255 * 0.35); p.stroke(c); p.strokeWeight(1); p.noFill();
      const x = fw / 2, z = fd / 2; p.beginShape(p.LINES); for (const [a, b] of [[[-x, -z], [x, -z]], [[x, -z], [x, z]], [[x, z], [-x, z]], [[-x, z], [-x, -z]]]) { p.vertex(a[0], 2.5, a[1]); p.vertex(b[0], 2.5, b[1]); } p.endShape(); }

    /* S2/S3 the 100,000 rolls: one instanced draw; out while the cells hold the stage, back for Monday */
    const k = GI.countAt(GP, N, t), front = GI.frontAt(GP, N, t);
    const marksOp = t < Z.volIn + Z.volFade ? 1 - seg(t, Z.volIn, Z.volIn + Z.volFade) : seg(t, Z.mondayAt, Z.mondayAt + 1.0);
    if (k > 0 && marksOp > 0.002) {
      const g = st.gi;
      GI.bindMarks(p, g, Object.assign({}, GP, { alpha: marksOp }), st.tk, k, front, null, 0);
      const sh = g.sh, tailOn = seg(t, Z.tailLitAt, Z.tailLitAt + 1.2) * (1 - seg(t, Z.mondayAt, Z.mondayAt + 0.5)), band = seg(t, Z.bandAt, Z.bandAt + 1.2);
      sh.setUniform('uT', t);
      sh.setUniform('uM1', [Z.fd0, Z.fdSpread, Z.fdFly, Z.fdLift]);
      sh.setUniform('uM2', [Z.sum0, Z.sumSpread, Z.sumFly, Z.sumLift]);
      sh.setUniform('uS', [WS, CS, CS]);
      sh.setUniform('uWin', Math.max(1, N * Z.countWin * Z.hotFlash));
      if (band > 0) { sh.setUniform('uLit', [P.midLo, P.midHi, band, band]); sh.setUniform('uLitRole', 2); }
      else { sh.setUniform('uLit', [P.tailCut + 1, SMAX, tailOn, 0]); sh.setUniform('uLitRole', 1); }
      p.fill(255);                                                       // a leaked noFill() makes model() draw nothing (R18/R20)
      GI.drawMarks(p, g, GP, k);
    }

    /* the belief's flat line (equal odds, 3,846 per sum), in the scene so it turns with the camera */
    const eqOp = Math.max(fade(t, Z.equalAt, Z.equalAt + 0.8, 57.2, 58.0), fade(t, Z.beliefAt, Z.beliefAt + 0.8, Z.exactT0 - 0.6, Z.exactT0));
    const hB = contH(P.beliefEach);
    if (eqOp > 0.01) {
      const c = p.color(C.muted); c.setAlpha(255 * eqOp); p.stroke(c); p.strokeWeight(1.6);
      p.line(-SPAN2 / 2, -hB, FRONT2 + 1, SPAN2 / 2, -hB, FRONT2 + 1);
    }

    /* S4 the counted cells (gl-volume): the 26 sums as slabs, the cut, the tail lit */
    const vOp = Math.min(seg(t, Z.volIn, Z.volIn + Z.volFade), 1 - seg(t, Z.mondayAt, Z.mondayAt + 0.8));
    let vc = null;
    if (t >= Z.volIn && vOp > 0.002) {
      st.vol.marks.forEach((m, i) => { m.a = st.volA[i] * vOp; });                     // set from t every frame (pure)
      vc = VOL.draw(p, t, st.vol, Object.assign({}, VP, t >= Z.cutOffAt ? { cutIn: [2, 3] } : {}, { camAt: () => ({ eye: q.eye, c: q.center }), applyCam: (cm) => RIGM.apply(p, cm, q, RIG) }), st.tk);
      st.vol.marks.forEach((m, i) => { m.a = st.volA[i]; });
    }
    p.setCamera(cam);

    /* ══ SVG: words and digits (all claims), pinned to the scene through the rig's own projection ══ */
    /* HOOK: the throw */
    const hookOp = 1 - seg(t, Z.hookOut, Z.hookOut + 0.8);
    if (t < Z.hookOut + 0.8) {
      K.tx('eyebrow', 'labels', 480, 74, 'THE CENTRAL LIMIT THEOREM, WITH DICE', { fam: 'mono', size: 12, anchor: 'middle', fill: C.muted, role: 'chrome', ls: 1.5, op: seg(t, 0.4, 1.2) * hookOp });
      const s = Z.diceSize, gap = s * 0.3, x0 = 480 - (5 * s + 4 * gap) / 2;
      throwRow(t, x0, 168, s, gap, hookOp, Z.diceT0, Z.diceStep, 'marks', 'd');
      const so = seg(t, Z.sumAt, Z.sumAt + 0.5) * hookOp;
      if (so > 0.01) {
        K.tx('sum18', 'labels', 480, 276, String(P.roll0Sum), { fam: 'disp', size: 72, anchor: 'middle', fill: C.ink, role: 'must-read', op: so });
        K.tx('sum18s', 'labels', 480, 302, 'THE SUM OF THE FIVE DICE', { fam: 'mono', size: 14, anchor: 'middle', fill: C.muted, role: 'secondary', op: so });
      }
      const fo = seg(t, Z.flatAt, Z.flatAt + 0.8) * hookOp;
      if (fo > 0.01) {                                                      // the belief's picture: every sum alike, no counts
        const ax0 = 190, ax1 = 770, ay = 410, xs = (v) => ax0 + (v - SMIN) / (SMAX - SMIN) * (ax1 - ax0);
        K.ln('hax', 'marks', ax0, ay, ax1, ay, { stroke: C.muted, w: 1, op: fo });
        K.ln('hflat', 'marks', ax0, 362, ax1, 362, { stroke: C.muted, w: 2, dash: '6 5', op: fo });
        K.tx('hflatL', 'labels', ax0, 352, 'IF EVERY SUM WERE EQUALLY LIKELY', { fam: 'mono', size: 14, fill: C.muted, role: 'secondary', op: fo });
        K.tx('hx5', 'labels', ax0, ay + 18, String(SMIN), { fam: 'mono', size: 14, anchor: 'middle', fill: C.muted, role: 'secondary', op: fo });
        K.tx('hx30', 'labels', ax1, ay + 18, String(SMAX), { fam: 'mono', size: 14, anchor: 'middle', fill: C.muted, role: 'secondary', op: fo });
        const xt = xs(P.tailCut + 0.5), to = seg(t, Z.flatAt + 1.4, Z.flatAt + 2.2) * hookOp;
        K.rc('htail', 'marks', xt, 362, ax1 - xt, ay - 362, { fill: C.accent, fo: 0.18, op: to });
        K.tx('htailL', 'labels', (xt + ax1) / 2, ay + 18, 'ABOVE ' + P.tailCut, { fam: 'mono', size: 14, anchor: 'middle', fill: C.accent, role: 'secondary', op: to });
      }
    }

    /* CASE: the count-in, then the landing */
    if (t >= Z.countT0 && t < Z.fd0 + 0.5) {
      const land = t >= Z.landAt, op = 1 - seg(t, Z.fd0 - 0.4, Z.fd0 + 0.4);
      K.tx('cnt', 'labels', 86, 82, fmtK(land ? N : k), { fam: 'disp', size: 40, fill: land ? C.ink : C.muted, role: 'must-read', op });
      K.tx('cntS', 'labels', 88, 100, land ? 'ROLLS · ONE MARK = ONE ROLL OF FIVE DICE' : 'ROLLS THROWN, IN ORDER', { fam: 'mono', size: 14, fill: C.muted, role: 'secondary', op });
    }
    /* CASE: the first die */
    const fdOp = fade(t, Z.fd0 - 0.4, Z.fd0 + 0.4, Z.pinsFirstOut, Z.pinsFirstOut + 0.6);
    if (fdOp > 0.01) {
      K.tx('fdH', 'labels', 40, 60, 'THE SAME ROLLS, BY THE FIRST DIE', { fam: 'mono', size: 14, fill: C.muted, role: 'secondary', op: fdOp });
      const po = fade(t, Z.pinsFirstAt, Z.pinsFirstAt + 0.6, Z.pinsFirstOut, Z.pinsFirstOut + 0.6);
      pins(t, 'first', po, 'f');
      if (po > 0.01) {                                                      // the die face under each stack: pips, not digits
        for (let f = 1; f <= P.faces; f++) { const v = scr(q, [fdX(f), 0, FZ1 * PC / 2 + 14]); die('fdd' + f, v.x, v.y + 16, 22, f, po, 'labels'); }
        const a = scr(q, [-SPAN1 / 2 - 10, -Math.round(P.firstExpect) / L1N * PC, FZ1 * PC / 2]), b = scr(q, [SPAN1 / 2 + 10, -Math.round(P.firstExpect) / L1N * PC, FZ1 * PC / 2]);
        K.ln('fdE', 'labels', a.x, a.y, b.x, b.y, { stroke: C.muted, w: 1, dash: '4 4', op: po * 0.9 });
        K.tx('fdEL', 'labels', 40, 84, 'A SIXTH OF ' + fmtK(N) + ' = ' + fmtK(Math.round(P.firstExpect)) + ' · DASHED', { fam: 'mono', size: 14, fill: C.muted, role: 'secondary', op: po });
      }
    }
    /* CASE: by the sum, from above, then from the side */
    const sumOp = fade(t, Z.sum0, Z.sum0 + 0.8, Z.volIn + 0.2, Z.volIn + 0.8);
    if (sumOp > 0.01) {
      const hd = t < 58 ? 'THE SAME ROLLS, BY THE SUM OF FIVE DICE · ' + NS + ' SUMS' : 'THE TAIL · SUMS ABOVE ' + P.tailCut;
      K.tx('smH', 'labels', t < 58 ? 40 : 928, 60, hd, { fam: 'mono', size: 14, anchor: t < 58 ? 'start' : 'end', fill: t < 58 ? C.muted : C.accent, role: 'secondary', op: sumOp });
      const ticks = [SMIN, P.midLo, P.modeLo, P.modeHi, P.midHi, P.tailCut, P.tailCut + 1, SMAX];
      for (const sv of ticks) {
        const v = scr(q, [colX(sv), 0, FRONT2 + 4]); if (v.x < 8 || v.x > 952) continue;
        K.tx('smx' + sv, 'labels', v.x, v.y + 15, String(sv), { fam: 'mono', size: 12, anchor: 'middle', fill: sv > P.tailCut ? C.accent : C.muted, role: 'chrome', op: sumOp * seg(t, Z.equalAt, Z.equalAt + 0.8) });
      }
      const eo = fade(t, Z.equalAt, Z.equalAt + 0.8, 57.2, 58.0);
      if (eo > 0.01) { const v = scr(q, [SPAN2 / 2, -hB, FRONT2 + 1]); K.tx('eqL', 'labels', Math.min(930, v.x), v.y - 8, 'EQUAL ODDS · ' + fmtK(P.beliefEach) + ' EACH', { fam: 'mono', size: 14, anchor: 'end', fill: C.muted, role: 'secondary', op: eo }); }
      pins(t, 'sums', fade(t, Z.pinsSumAt, Z.pinsSumAt + 0.6, 57.6, 58.2), 's');
      pins(t, 'tail', fade(t, Z.pinsTailAt, Z.pinsTailAt + 0.6, Z.volIn + 0.2, Z.volIn + 0.8), 't');
    }

    /* COUNT: the cut, the tail count, the ratio, the belief, the exact bell */
    if (vc) {
      const op = vOp, RX = 928;
      const co = fade(t, Z.cutT0, Z.cutT0 + 0.3, Z.tailAt, Z.tailAt + 0.6);
      if (co > 0.01 && vc.cutOn && t < Z.cutOffAt) {                                          // the cut's own slice, a claim per sum
        const cut = vc.slice, sv = SMIN + cut, cx = -SPAN2 / 2 + (VP.cutFrom + (VP.cutTo - VP.cutFrom) * sm5(seg(t, Z.cutT0, Z.cutT1))) * SPAN2;
        const v = scr(q, [cx, -VP.size[1] * 1.04 - 6, 0]);
        K.tx('cutN', 'labels', v.x, v.y - 26, fmtK(P['sim' + sv]), { fam: 'disp', size: 28, anchor: 'middle', fill: CH, role: 'must-read', op: op * co });
        K.tx('cutS', 'labels', v.x, v.y - 8, 'ROLLS IN THE SUM THE CUT IS ON', { fam: 'mono', size: 14, anchor: 'middle', fill: C.muted, role: 'secondary', op: op * co });
      }
      const to = seg(t, Z.tailAt, Z.tailAt + 0.5) * op;
      if (to > 0.01) {
        K.tx('tailN', 'labels', RX, 96, fmtK(TAIL), { fam: 'disp', size: Z.readSize, anchor: 'end', fill: C.accent, role: 'must-read', op: to });
        K.tx('tailS', 'labels', RX, 120, 'ROLLS ABOVE ' + P.tailCut + ' · OF ' + fmtK(N), { fam: 'mono', size: 14, anchor: 'end', fill: C.ink, role: 'secondary', op: to });
      }
      const ro = seg(t, Z.ratioAt, Z.ratioAt + 0.5) * op;
      if (ro > 0.01) K.tx('ratio', 'labels', RX, 160, '= ' + P.tailPctSim.toFixed(1) + ' %', { fam: 'disp', size: Z.ratioSize, anchor: 'end', fill: C.ink, role: 'must-read', op: ro });
      const bo = fade(t, Z.beliefAt, Z.beliefAt + 0.8, Z.exactT0 - 0.6, Z.exactT0) * op;
      if (bo > 0.01) {                                                      // what equal odds would put in the tail: a dashed box
        const xa = colX(P.tailCut + 0.5), xb = SPAN2 / 2, pts = [[xa, 0], [xa, -hB], [xb, -hB], [xb, 0]].map(([x, y]) => scr(q, [x, y, FRONT2 + 1]));
        K.path('blfB', 'labels', 'M' + pts.map((v) => v.x.toFixed(1) + ' ' + v.y.toFixed(1)).join(' L'), { stroke: C.muted, w: 1.4, dash: '5 4', op: bo });
        K.tx('blfN', 'labels', RX, 236, 'EQUAL ODDS: ' + fmtK(P.beliefTail), { fam: 'disp', size: 28, anchor: 'end', fill: C.muted, role: 'must-read', op: bo });
        K.tx('blfS', 'labels', RX, 256, 'ABOUT ' + P.beliefTimes + ' TIMES TOO MANY', { fam: 'mono', size: 14, anchor: 'end', fill: C.muted, role: 'secondary', op: bo * seg(t, Z.timesAt, Z.timesAt + 0.5) });
      }
      const xo = seg(t, Z.exactT0, Z.exactT0 + 0.3) * op;
      if (xo > 0.01) {                                                      // the exact bell: expected rolls per sum, a step outline
        const u = seg(t, Z.exactT0, Z.exactT1), nIn = NS * u, d = [];
        for (let i = 0; i < NS; i++) {
          if (i > nIn) break;
          const sv = SMIN + i, h = contH(P['expect' + sv]), xa = colX(sv) - COLP / 2, xb = colX(sv) + COLP / 2 * 1, xe = lerp(xa, xb, clamp(nIn - i, 0, 1));
          const a = scr(q, [xa, -h, FRONT2 + 2]), b = scr(q, [xe, -h, FRONT2 + 2]);
          if (i === 0) { const f0 = scr(q, [xa, 0, FRONT2 + 2]); d.push('M' + f0.x.toFixed(1) + ' ' + f0.y.toFixed(1)); }
          d.push('L' + a.x.toFixed(1) + ' ' + a.y.toFixed(1), 'L' + b.x.toFixed(1) + ' ' + b.y.toFixed(1));
        }
        if (d.length > 1) K.path('exact', 'labels', d.join(' '), { stroke: C.soft, w: Z.exactW, op: xo });
        const wo = seg(t, Z.waysAt, Z.waysAt + 0.5) * op;
        if (wo > 0.01) {
          K.tx('waysH', 'labels', 40, 60, 'THE EXACT COUNT · WAYS OF ' + fmtK(P.outcomes) + ' OUTCOMES', { fam: 'mono', size: 14, fill: C.soft, role: 'secondary', op: wo });
          K.tx('waysR', 'labels', 40, 84, [P.ways5, P.ways6, P.ways7].join(' · ') + ' … ' + P.ways17 + ' · ' + P.ways18 + ' … ' + [P.ways28, P.ways29, P.ways30].join(' · '), { fam: 'mono', size: 14, fill: C.soft, role: 'secondary', op: wo });
        }
        const eo = seg(t, Z.tailExactAt, Z.tailExactAt + 0.5) * op;
        if (eo > 0.01) {
          K.tx('tailX', 'labels', RX, 186, P.waysTail + ' WAYS PREDICT ' + fmtK(P.expTailRound) + ' (' + P.tailPctExact.toFixed(1) + ' %)', { fam: 'mono', size: 14, anchor: 'end', fill: C.soft, role: 'secondary', op: eo });
          K.tx('tailX2', 'labels', RX, 206, 'COUNTED ' + fmtK(TAIL), { fam: 'mono', size: 14, anchor: 'end', fill: C.soft, role: 'secondary', op: eo });
        }
        const ao = seg(t, Z.agreeAt, Z.agreeAt + 0.6) * op;
        if (ao > 0.01) {
          K.tx('agree', 'labels', 40, 116, 'LARGEST GAP ' + P.maxGapPts.toFixed(2) + ' POINTS (SUM ' + P.maxGapSum + ')', { fam: 'mono', size: 14, fill: C.ink, role: 'secondary', op: ao });
          K.tx('mean', 'labels', 40, 140, 'MEAN ' + P.meanExact.toFixed(1) + ' · COUNTED ' + P.simMean.toFixed(2), { fam: 'mono', size: 14, fill: C.ink, role: 'secondary', op: ao });
          K.tx('sd', 'labels', 40, 164, 'SD ' + P.sdExact.toFixed(2) + ' · COUNTED ' + P.simSd.toFixed(2), { fam: 'mono', size: 14, fill: C.ink, role: 'secondary', op: ao });
          const m0 = scr(q, [0, 0, FRONT2 + 2]), m1 = scr(q, [0, -VP.size[1] - 14, FRONT2 + 2]);
          K.ln('meanL', 'labels', m0.x, m0.y, m1.x, m1.y, { stroke: C.ink, w: 1, dash: '3 3', op: ao * 0.8 });
          const yS = -contH(P.sim17) * 0.62, sa = scr(q, [-P.sdExact * COLP, yS, FRONT2 + 2]), sb = scr(q, [P.sdExact * COLP, yS, FRONT2 + 2]);
          K.ln('sdL', 'labels', sa.x, sa.y, sb.x, sb.y, { stroke: CH, w: 1.4, op: ao });
          K.ln('sdA', 'labels', sa.x, sa.y - 6, sa.x, sa.y + 6, { stroke: CH, w: 1.4, op: ao });
          K.ln('sdB', 'labels', sb.x, sb.y - 6, sb.x, sb.y + 6, { stroke: CH, w: 1.4, op: ao });
        }
      }
    }

    /* MONDAY: the throw returns; the middle band of the count is the picture to keep */
    const mo = seg(t, Z.mondayAt + 0.4, Z.mondayAt + 1.2);
    if (mo > 0.01) {
      throwRow(t, 40, 76, 36, 10, mo, null, 0, 'marks', 'm');
      K.tx('m18', 'labels', 280, 90, '= ' + P.roll0Sum, { fam: 'disp', size: 28, fill: C.ink, role: 'must-read', op: mo });
      const bo = seg(t, Z.bandAt + 0.6, Z.bandAt + 1.2);
      if (bo > 0.01) {
        K.tx('bandN', 'labels', 928, 120, fmtK(MID) + ' ROLLS · SUMS ' + P.midLo + ' TO ' + P.midHi, { fam: 'mono', size: 16, anchor: 'end', fill: C.soft, role: 'secondary', op: bo });
        K.tx('bandP', 'labels', 928, 92, P.simMidPct.toFixed(1) + ' % OF ROLLS', { fam: 'disp', size: 34, anchor: 'end', fill: C.soft, role: 'must-read', op: bo * seg(t, Z.bandAt + 1.6, Z.bandAt + 2.2) });
      }
    }
  },
};
})();
