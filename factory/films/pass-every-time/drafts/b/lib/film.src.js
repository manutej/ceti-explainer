/* pass-every-time / draft B · "the scoreboard" · film header (read before the code).
   Look: brand midnight-ink as the film-local copy brand.midnight-ink.json (Newsreader 600 display, DM Mono numbers; Cormorant is
   not used because kit2 embeds only style-normal faces), chrome none, material ink, level manager, renderer webgl, format
   feature-long, dur 153 (150 s of material + the 3 s CETI card), commit off (D11). Chain: gl-instances, gl-camera-rig, gl-volume,
   gl-labels; no gl-post. One ortho camera for the whole film, so every number is read on a flat, still pose (R-E P10, I5).
   Register: the 460 tries are one board of cubes, a scoreboard. It lies on the floor as 115 tiles of four (the belief: 60 % lit),
   stands up as columns of four (M1, tilt + restack), is re-sorted by passes into five rows whose lengths are the counts (M2:
   the 44 all-four columns gather at the front and are the longest row), is cut by a volume that asks for every one of k tries
   (the thin end), becomes the same wall of 296 PRs re-partitioned by merge (M4), and ends on one row of minutes the camera
   dollies along. The 8-try model is NOT drawn (director's choice, brief.md): the paper's own sentence stands in its place.
   One clock: render(t, state) draws frame t from t alone. Every mark is ONE instance with three homes stored as texels; the
   vertex shader (lib/gl-instances.vert.js) moves it on t. Words and digits are SVG (K.tx, roled); every digit is computed from
   film.json params by the claim formulas (checked at load). Every tunable is a knob. No Math.random / Date / performance. */
(function () {
'use strict';
const K = window.KIT, F = window.FILM, P = F.params, A = window.ARSENAL;
const GI = A.patterns['gl-instances'].api, RIGM = A.patterns['gl-camera-rig'].rig, VOL = A.patterns['gl-volume'], LAB = A.patterns['gl-labels'];
const { seg, clamp, lerp, fmtK, C } = K;
const CH = K.BRAND.color.chalk || C.ink;
const kn = (n, d) => K.knob(n, d);
const ez = (u) => { u = clamp(u, 0, 1); return u * u * (3 - 2 * u); };
const sm5 = (u) => { u = clamp(u, 0, 1); return u * u * u * (u * (u * 6 - 15) + 10); };
const fade = (t, a, b, c, d) => Math.min(seg(t, a, b), 1 - seg(t, c, d));       // up over [a,b], down over [c,d]
const r1 = (x) => Math.round(x * 10) / 10;

/* ── knobs, read once (name, default); documented in lib/knobs.mjs ── */
const Z = {};
[['hookA', 0.9], ['hookB', 3.2], ['hookOut', 10.8], ['tagAt', 12.4],
  ['tileT0', 13.0], ['tileSpan', 7.0], ['tileDur', 0.8], ['cubeT0', 23.5], ['cubeSpan', 3.8], ['cubeDur', 0.9],
  ['litT0', 31.0], ['litSpan', 2.4], ['litFlash', 0.5], ['seedLit', 7], ['ratioAt', 36.5], ['hudOut', 39.6],
  ['m1Spread', 2.5], ['m1Lift', 5], ['m2T0', 60.0], ['m2T1', 66.0], ['m2Spread', 1.8], ['m2Lift', 4],
  ['wordsAt', 52.0], ['wordsOut', 59.4], ['p44At', 68.0], ['p22At', 70.5], ['pinsOut', 72.8], ['cutDimAt', 68.0], ['cutDimAmt', 0.65], ['cutDimOffAt', 72.9],
  ['cellPitch', 1.0], ['tilePitch', 2.5], ['plateW', 1.0], ['planCubeW', 0.82], ['flatH', 0.1],
  ['towerPitch', 1.25], ['cubeW', 1.0], ['cubeVPitch', 1.35], ['cubeH', 1.2], ['tierZ', 7.0], ['ghostMix', 0.38],
  ['bar1At', 74.8], ['bar2At', 77.6], ['bar3At', 80.4], ['bar4At', 83.2], ['ratio4At', 85.7], ['paperAt', 88.6], ['cutMove', 0.6], ['cutOffAt', 88.3],
  ['volBuild', 0.9], ['volStagger', 0.6], ['volAlpha', 0.58], ['volCutDim', 0.5], ['volW', 60], ['volH', 18], ['volD', 6], ['volGap', 0.3], ['dashLen', 0.9], ['dashGap', 0.6],
  ['prLead', 0.6], ['prSpan', 3.6], ['prDur', 0.6], ['prPitch', 1.25], ['prCols', 37], ['prGap', 5], ['prH', 1.0],
  ['m4T0', 110.5], ['m4T1', 117.5], ['m4Spread', 1.5], ['m4Lift', 3], ['sweAt', 107.5], ['sweOut', 110.2], ['halfAt', 118.0],
  ['minLeadA', 0.8], ['minSpanA', 1.6], ['minPitch', 1.2], ['minH', 1.0], ['minDur', 0.5], ['m27At', 124.0], ['m27Out', 126.4], ['m289At', 129.5], ['m289Out', 131.9], ['tenAt', 132.0],
  ['legendAt', 121.2], ['qAt', 135.3], ['qOut', 141.0], ['honestAt', 141.5], ['monLife', 0.6],
  ['hudSize', 52], ['resultSize', 36], ['pinSub', 14], ['labHold', 4], ['labLeader', 24], ['labPlate', 0.72], ['flagH', 4.5], ['gridOp', 0.15], ['floorMargin', 5],
].forEach(([n, d]) => { Z[n] = kn(n, d); });

/* ── the data: 115 tasks x 4 tries as one hex digit per task (bit j = try j passed), tau-bench gpt-4o retail trajectories, S2 ── */
const MASKS = '9fffb00000fffe3fcff20087bfee0fbf600dfffff04fff7fe7ffff14abffffff5f7ffff10f0b3dd0b812f3e9fdf074f44820200f20d7f40001f';
const TASKS = P.tasks, TRIES = P.triesPer, NT = TASKS * TRIES, COLS = 23, ROWS = TASKS / COLS;
const PASS = [], PC = [], HIST = [0, 0, 0, 0, 0];
for (let i = 0; i < TASKS; i++) { const m = parseInt(MASKS[i], 16); PASS.push([0, 1, 2, 3].map((j) => (m >> j) & 1)); PC.push(PASS[i].reduce((a, b) => a + b, 0)); HIST[PC[i]]++; }
const PASSED = P.n1 + 2 * P.n2 + 3 * P.n3 + 4 * P.n4;
const PCT = [r1(100 * PASSED / NT), r1(100 * (P.n2 + 3 * P.n3 + 6 * P.n4) / 6 / TASKS), r1(100 * (P.n3 + 4 * P.n4) / 4 / TASKS), r1(100 * P.n4 / TASKS)];
const CHECK = (() => {
  const bad = [];
  if (MASKS.length !== TASKS || ROWS !== 5) bad.push('tasks');
  [P.n0, P.n1, P.n2, P.n3, P.n4].forEach((v, k) => { if (HIST[k] !== v) bad.push('n' + k); });
  if (PASS.reduce((a, r) => a + r.reduce((x, y) => x + y, 0), 0) !== PASSED) bad.push('passed');
  if (PCT.join() !== [60.4, 49.1, 43.0, 38.3].join()) bad.push('pct ' + PCT.join('/'));
  return { ok: !bad.length, bad };
})();
window.__tau = CHECK;
const NPR = P.prs, NMIN = P.h50h * 60 + P.h50m, NMIN0 = P.h80, N = NT + NPR + NMIN;
const pct = (v) => v.toFixed(1) + ' %';

/* ── layout (world units, p5 y is down: the floor is y = 0, columns rise to -y; tier 0 is the front, z > 0) ── */
const TP = Z.tilePitch, CP = Z.cellPitch, CPX = Z.towerPitch, CVP = Z.cubeVPitch, TZ = Z.tierZ, MP = Z.minPitch, PP = Z.prPitch;
const planXZ = (i, j) => { const c = i % COLS, r = Math.floor(i / COLS); return [(c - (COLS - 1) / 2) * TP + ((j % 2) - 0.5) * CP, (((ROWS - 1) / 2) - r) * TP + (Math.floor(j / 2) - 0.5) * CP]; };
const towerXZ = (i) => [((i % COLS) - (COLS - 1) / 2) * CPX, (((ROWS - 1) / 2) - Math.floor(i / COLS)) * TZ];
const CLS = [4, 3, 2, 1, 0], ORDER = [], TIER = new Array(TASKS), JJ = new Array(TASKS), SIDX = new Array(TASKS);
CLS.forEach((c, k) => { let jj = 0; for (let i = 0; i < TASKS; i++) if (PC[i] === c) { TIER[i] = k; JJ[i] = jj++; ORDER.push(i); } });
ORDER.forEach((i, r) => { SIDX[i] = r; });
const LONG = Math.max(...HIST);
const sortXZ = (i) => [(JJ[i] - (LONG - 1) / 2) * CPX, (((ROWS - 1) / 2) - TIER[i]) * TZ];
const topY = -((TRIES - 1) * CVP + Z.cubeH);
const prSheet = (m) => [((m % Z.prCols) - (Z.prCols - 1) / 2) * PP, (((Math.ceil(NPR / Z.prCols) - 1) / 2) - Math.floor(m / Z.prCols)) * PP];

/* ── the camera: the rig script with every scalar a knob ── */
const SCENE = { points: [] };
const SCRIPT = RIGM.fromKnobs(window.PASS_RIG, (n, v) => K.knob(n, v), SCENE);
const RIG = RIGM.compile(SCRIPT, SCENE);
const MV = (id) => SCRIPT.moves.find((m) => m.id === id);
const T_STAND = MV('stand'), T_VOL = MV('volcut').t0, T_PR = MV('prcut').t0, T_MIN = MV('mincut').t0, T_DOLLY = MV('dolly'), T_MON = MV('moncut').t0;
const poseAt = (t) => RIGM.at(RIG, t);
const LABCAM = (tt) => { const q = RIGM.at(RIG, tt); return { eye: q.eye, look: q.center, up: q.up, ortho: 1 / (q.zoom || 1) }; };
const scr = (q, pt) => RIGM.worldToScreen(q, pt, K.W, K.H);

/* ── the marks: tries 0..459, PRs 460..755, minutes 756..1044; six texels each (see the vertex shader) ── */
const LITRANK = (() => { const ids = []; for (let i = 0; i < TASKS; i++) for (let j = 0; j < TRIES; j++) if (PASS[i][j]) ids.push(i * TRIES + j); const o = K.shuffle(ids, F.seed ^ (Z.seedLit * 7919)); const rk = new Array(NT).fill(-1); o.forEach((id, r) => { rk[id] = r; }); return rk; })();
const MERGE = (() => { const o = K.shuffle(Array.from({ length: NPR }, (_, m) => m), F.seed + 11), noMerge = new Array(NPR).fill(0); o.slice(NPR / 2).forEach((m) => { noMerge[m] = 1; }); return noMerge; })();
const tileIn = (i) => Z.tileT0 + (i / (TASKS - 1)) * Z.tileSpan, cubeIn = (i) => Z.cubeT0 + (i / (TASKS - 1)) * Z.cubeSpan, litIn = (id) => Z.litT0 + (LITRANK[id] / (PASSED - 1)) * Z.litSpan;
function marks() {
  const buf = new Float32Array(GI.TEXW * Math.ceil(6 * N / GI.TEXW) * 4);
  const put = (id, a, b, c, t, s, g) => { const o = id * 24; for (let k = 0; k < 4; k++) { buf[o + k] = a[k]; buf[o + 4 + k] = b[k]; buf[o + 8 + k] = c[k]; buf[o + 12 + k] = t[k]; buf[o + 16 + k] = s[k]; buf[o + 20 + k] = g[k]; } };
  const NEVER = 1e6;
  for (let i = 0; i < TASKS; i++) for (let j = 0; j < TRIES; j++) {
    const id = i * TRIES + j, pa = planXZ(i, j), pb = towerXZ(i), pc = sortXZ(i), yb = -j * CVP, ps = PASS[i][j];
    put(id, [pa[0], 0, pa[1], ps ? litIn(id) : NEVER], [pb[0], yb, pb[1], ps], [pc[0], yb, pc[1], PC[i]],
      [tileIn(i), Z.tileDur, T_VOL, 0], [i / (TASKS - 1), SIDX[i] / (TASKS - 1), T_MON, Z.monLife], [cubeIn(i), Z.cubeDur, 0, 0]);
  }
  const half = NPR / 2, gi = [0, 0];
  for (let m = 0; m < NPR; m++) {
    const sa = prSheet(m), nm = MERGE[m], g = gi[nm]++, row = Math.floor(g / Z.prCols), col = g % Z.prCols;
    const zc = (nm ? -1 : 1) * (Z.prGap / 2 + (Math.ceil(half / Z.prCols) / 2) * PP) + (((Math.ceil(half / Z.prCols) - 1) / 2) - row) * PP;
    const sb = [(col - (Z.prCols - 1) / 2) * PP, zc];
    put(NT + m, [sa[0], 0, sa[1], 0], [sb[0], 0, sb[1], 1], [sb[0], 0, sb[1], nm],
      [T_PR + Z.prLead + (m / (NPR - 1)) * Z.prSpan, Z.prDur, T_MIN, 1], [(m % Z.prCols) / (Z.prCols - 1), 0, 1e6, 1], [0, 1, 0, 0]);
  }
  for (let m = 0; m < NMIN; m++) {
    const x = m * MP, tin = m < NMIN0 ? T_MIN + Z.minLeadA + (m / (NMIN0 - 1)) * Z.minSpanA : T_DOLLY.t0 + ((m - NMIN0) / (NMIN - NMIN0 - 1)) * (T_DOLLY.t1 - T_DOLLY.t0 - Z.minDur);
    put(NT + NPR + m, [x, 0, 0, 0], [x, 0, 0, m < NMIN0 ? 1 : 0], [x, 0, 0, 0], [tin, Z.minDur, T_MON, 2], [0, 0, 1e6, 1], [0, 1, 0, 0]);
  }
  return buf;
}
const GP = { dur: F.dur, countIn: [0, 1], countEase: 'smooth', win: 0.02, layout: 'stack', mark: 'box', render: 'marks', roles: ['ink', 'accent', 'accent2', 'muted', 'chalk', 'panel'],
  size: 1, alpha: 1, grow: 1, dim: 0.22, brush: null, pick: null, drawOrder: 'arrival' };

/* ── the volume: pass every one of k tries (the claims pass^1..pass^4, in tenths of a percent), k = 1..8 slots; slot 8 is the paper's ── */
const VCOUNTS = [0, 1, 2, 3].map((k) => Math.round(PCT[k] * 10)).concat([0, 0, 0, 0]);
const VNB = VCOUNTS.length, VMAX = Math.max(...VCOUNTS);
const vbw = Z.volW / VNB, vx = (k) => -Z.volW / 2 + (k + 0.5) * vbw, vh = (c) => Z.volH * c / VMAX;
const VP = { dur: F.dur, data: VCOUNTS, dataKind: 'counts', range: [[0.5, VNB + 0.5]], axisNames: ['TRIES'], size: [Z.volW, Z.volH, Z.volD], gap: Z.volGap, alpha: [Z.volAlpha, Z.volAlpha],
  tail: 3.5, tailAxis: 'x', tailIn: [Z.bar4At / F.dur, (Z.bar4At + 0.8) / F.dur], ratioAt: 2,
  build: [T_VOL / F.dur, (T_VOL + Z.volBuild) / F.dur], stagger: Z.volStagger, cutDim: Z.volCutDim, orbit: [0, 0], elev: [4, 4], dist: 2400, fov: 0.8, look: [0, -9, 0], inset: [0, 0, 1, 1], pin: false };
const BARS = [Z.bar1At, Z.bar2At, Z.bar3At, Z.bar4At];
function cutS(t) {                                                   // the cut plane: rests on bar k from BARS[k]-cutMove to BARS[k]
  let k = 0, u = 0;
  for (let q = 0; q < 4; q++) { if (t >= BARS[q] - Z.cutMove) k = q; }
  if (k > 0) u = sm5((t - (BARS[k] - Z.cutMove)) / Z.cutMove); else u = 1;
  const s = (q) => (q + 0.5) / VNB;
  return k === 0 ? s(0) : lerp(s(k - 1), s(k), u);
}
const PAPER_H = vh(P.paperPass8Upper * 10);

/* ── labels (gl-labels): one anchors array and one options object per beat, the same objects every frame ── */
const firstTask = (c) => { for (let i = 0; i < COLS; i++) if (PC[i] === c) return i; return 0; };
const ALL = firstTask(4), NONE = firstTask(0);
const AN = {
  plan: [{ id: 'ratio', x: 22, y: 0, z: -7, text: pct(PCT[0]), sub: 'OF TRIES PASS', role: 'result', priority: 1, color: 'accent' }],
  pooled: [ALL, NONE].map((i, k) => { const xz = towerXZ(i); return { id: 'w' + k, x: xz[0], y: topY - 0.3, z: xz[1], text: k ? 'NONE LIT' : 'ALL LIT', role: 'secondary', priority: 2 - k, color: 'ink' }; }),
  p44: [{ id: 'p44', x: sortXZ(ORDER[HIST[4] - 1])[0], y: topY - Z.flagH, z: sortXZ(ORDER[HIST[4] - 1])[1], text: fmtK(P.n4) + ' pass all four', role: 'result', priority: 2, color: 'accent' }],
  p22: [{ id: 'p22', x: sortXZ(ORDER[TASKS - 1])[0], y: topY - 0.3, z: sortXZ(ORDER[TASKS - 1])[1], text: fmtK(P.n0) + ' never pass', role: 'result', priority: 1, color: 'ink' }],
  volBars: [0, 1, 2, 3].map((k) => ({ id: 'b' + (k + 1), x: vx(k), y: -vh(VCOUNTS[k]) - 0.6, z: 0, text: pct(PCT[k]), role: 'result', priority: 2, color: 'accent' })),
  volPaper: { id: 'p8', x: vx(VNB - 1), y: -PAPER_H - 0.6, z: 0, text: 'under ' + P.paperPass8Upper + ' %', sub: 'THE PAPER\'S OWN 8-TRY RUN', role: 'result', priority: 1, color: 'ink' },
  pr: [{ id: 'swe', x: prSheet(Z.prCols - 1)[0], y: -Z.prH, z: prSheet(Z.prCols - 1)[1], text: P.swe.toFixed(1) + ' %', sub: 'TOP SWE-BENCH VERIFIED SCORE', role: 'result', priority: 3, color: 'accent' }],
  prs: [{ id: 'half', x: 0, y: -Z.prH, z: -(Z.prGap / 2 + PP * Math.ceil(NPR / 2 / Z.prCols)), text: 'about half', sub: 'WOULD NOT BE MERGED', role: 'result', priority: 3, color: 'accent' },
    { id: 'wm', x: -(Z.prCols - 1) / 2 * PP, y: -Z.prH, z: Z.prGap / 2 + PP * 1.5, text: 'WOULD MERGE', role: 'secondary', priority: 2, color: 'ink' },
    { id: 'wn', x: -(Z.prCols - 1) / 2 * PP, y: -Z.prH, z: -(Z.prGap / 2 + PP * 1.5), text: 'WOULD NOT MERGE', role: 'secondary', priority: 1, color: 'ink' }],
  m27: [{ id: 'm27', x: (NMIN0 - 1) * MP, y: -Z.minH - 0.2, z: 0, text: P.h80 + ' min', sub: 'AT THE ' + P.r80 + ' % BAR', role: 'result', priority: 1, color: 'accent' }],
  m289: [{ id: 'm289', x: (NMIN - 1) * MP, y: -Z.minH - 0.2, z: 0, text: P.h50h + ' h ' + P.h50m + ' min', sub: 'AT THE ' + P.r50 + ' % BAR', role: 'result', priority: 1, color: 'ink' }],
  x10: [{ id: 'x10', x: 144 * MP, y: -Z.minH - 0.2, z: 0, text: 'about ' + Math.round(NMIN / P.h80 / 10) * 10 + 'x longer', role: 'result', priority: 1, color: 'accent' }],
};
AN.vol = (t) => { let k = 0; for (let q = 0; q < 4; q++) if (t >= BARS[q]) k = q; return t >= Z.paperAt ? [AN.volBars[k], AN.volPaper] : [AN.volBars[k]]; };   // one bar's callout at a time, then the paper's
const MEASURE = (str, z, fam) => String(str).length * z * (fam === 'disp' ? 0.56 : 0.62);
const LBASE = { w: K.W, h: K.H, fps: 30, hold: Math.round(Z.labHold), leader: Z.labLeader, margin: 14, sticky: 'window', occlusion: false, measure: MEASURE,
  reserve: [[0, 438, 960, 540], [24, 40, 440, 160]] };
const RES_TOP = [[0, 438, 960, 540], [24, 44, 430, 78]];            // vol / PR / minutes: only the one-line tag at the top left
const mk = (extra) => Object.assign({}, LBASE, extra);
const LOPT = {
  plan: mk({ measureKey: 'pe-plan', callout: { size: Z.resultSize, leader: 56, schedule: [{ t: Z.ratioAt, id: 'ratio' }] } }),
  pooled: mk({ measureKey: 'pe-pooled' }),
  p44: mk({ measureKey: 'pe-p44' }),
  p22: mk({ measureKey: 'pe-p22' }),
  vol: mk({ measureKey: 'pe-vol', reserve: RES_TOP, callout: { size: Z.resultSize, leader: 40, schedule: [
    { t: Z.bar1At, id: 'b1', sub: 'ONE TRY' }, { t: Z.bar2At, id: 'b2', sub: 'TWO TRIES, BOTH PASS' }, { t: Z.bar3At, id: 'b3', sub: 'THREE TRIES, ALL PASS' },
    { t: Z.bar4At, id: 'b4', text: fmtK(P.n4) + ' of ' + fmtK(TASKS), sub: 'TASKS PASS ALL FOUR' }, { t: Z.ratio4At, id: 'b4', sub: 'ALL FOUR TRIES PASS' }] } }),
  pr: mk({ measureKey: 'pe-pr', reserve: RES_TOP }),
  prs: mk({ measureKey: 'pe-prs', reserve: RES_TOP }),
  m27: mk({ measureKey: 'pe-m27', reserve: [[0, 438, 960, 540], [24, 44, 430, 100]] }),
  m289: mk({ measureKey: 'pe-m289', reserve: [[0, 438, 960, 540], [24, 44, 430, 100]] }),
  x10: mk({ measureKey: 'pe-x10', reserve: [[0, 438, 960, 540], [24, 44, 430, 100]], callout: { size: Z.resultSize, leader: 60, schedule: [{ t: Z.tenAt, id: 'x10' }] } }),
};
LOPT.vol.callout.schedule[4].text = pct(PCT[3]);
function pins(t, set, op, key) {
  if (op <= 0.01) return;
  const sol = LAB.solve(t, LABCAM, AN[set], LOPT[set]);
  for (const q of sol.placements) {
    const k = 'pin.' + key + '.' + q.id, col = q.color === 'accent' ? C.accent : C.ink, anc = q.align === 'right' ? 'end' : q.align === 'center' ? 'middle' : 'start';
    K.rc(k + '.p', 'labels', q.box[0], q.box[1], q.box[2] - q.box[0], q.box[3] - q.box[1], { fill: C.paper, fo: Z.labPlate * op, rx: 3 });
    K.ln(k + '.l', 'labels', q.lead[0], q.lead[1], q.lead[2], q.lead[3], { stroke: col, w: q.callout ? 1.6 : 1.2, op });
    K.E(k + '.d', 'circle', 'labels', { cx: q.ax.toFixed(1), cy: q.ay.toFixed(1), r: q.callout ? 3.4 : 2.6, fill: col, opacity: op.toFixed(3) });
    K.tx(k + '.t', 'labels', q.tx, q.ty, q.text, { fam: q.fam, size: q.size, anchor: anc, fill: col, role: q.dataRole === 'must-read' ? 'must-read' : 'secondary', op });
    if (q.sub) K.tx(k + '.s', 'labels', q.tx, q.sy + 2, q.sub, { fam: 'mono', size: Z.pinSub, anchor: anc, fill: C.muted, role: 'secondary', op });
  }
}

/* ── the scoreboard digits (top left): running counts that land on the claims ── */
const nTiles = (t) => { let n = 0; for (let i = 0; i < TASKS; i++) if (t >= tileIn(i)) n++; return n; };
const nCubes = (t) => { let n = 0; for (let i = 0; i < TASKS; i++) if (t >= cubeIn(i)) n += TRIES; return n; };
const nLit = (t) => { let n = 0; for (let id = 0; id < NT; id++) if (LITRANK[id] >= 0 && t >= litIn(id)) n++; return n; };
const nPr = (t) => { let n = 0; for (let m = 0; m < NPR; m++) if (t >= T_PR + Z.prLead + (m / (NPR - 1)) * Z.prSpan) n++; return n; };
function board(key, n, sub, op, fill) {
  if (op <= 0.01) return;
  K.tx(key + 'N', 'labels', 40, 112, fmtK(n), { fam: 'disp', size: Z.hudSize, anchor: 'start', fill: fill || C.ink, role: 'must-read', op });
  K.tx(key + 'S', 'labels', 42, 134, sub, { fam: 'mono', size: 14, anchor: 'start', fill: C.muted, role: 'secondary', op });
}
const ST = { v: null };
const tkOf = () => ({ color: Object.assign({}, K.BRAND.color), type: K.BRAND.type });
const rgbOf = (p, c) => { const q = p.color(c); return [p.red(q) / 255, p.green(q) / 255, p.blue(q) / 255]; };

/* ── floors and rules (p5 primitives, flat colour) ── */
function floor(p, cx, cz, hx, hz, grid, op, lw) {
  p.push(); p.translate(cx, 0.35, cz); p.rotateX(Math.PI / 2); p.noStroke(); p.fill(C.panel); p.plane(2 * hx, 2 * hz); p.pop();
  const c = p.color(C.muted); c.setAlpha(255 * op); p.stroke(c); p.strokeWeight(lw); p.noFill();
  p.beginShape(p.LINES);
  for (let x = Math.ceil((cx - hx) / grid) * grid; x <= cx + hx + 1e-6; x += grid) { p.vertex(x, 0.2, cz - hz); p.vertex(x, 0.2, cz + hz); }
  for (let z = Math.ceil((cz - hz) / grid) * grid; z <= cz + hz + 1e-6; z += grid) { p.vertex(cx - hx, 0.2, z); p.vertex(cx + hx, 0.2, z); }
  p.endShape();
}
function dashed(p, a, b, on, off) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]); if (L < 1e-6) return;
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L, (b[2] - a[2]) / L];
  for (let s = 0; s < L; s += on + off) { const e = Math.min(L, s + on); p.line(a[0] + d[0] * s, a[1] + d[1] * s, a[2] + d[2] * s, a[0] + d[0] * e, a[1] + d[1] * e, a[2] + d[2] * e); }
}

window.FILM_RENDER = {
  async setup(p, kk) {
    if (!CHECK.ok) throw new Error('pass-every-time: the data disagrees with the claims: ' + CHECK.bad.join(', '));
    const st = { tk: tkOf(), cam: p.createCamera() };
    const TH = Math.ceil(6 * N / GI.TEXW);
    st.gi = { N, chunk: 128, buf: marks() };
    st.gi.fb = p.createFramebuffer({ width: GI.TEXW, height: TH, density: 1, format: p.FLOAT, channels: p.RGBA, antialias: false, depth: false, textureFiltering: p.NEAREST });
    GI.upload(p, st.gi);
    st.gi.geom = p.buildGeometry(() => { p.noStroke(); for (let j = 0; j < st.gi.chunk; j++) { p.push(); p.translate(j * GI.STEP, 0, 0);
      for (const fc of ['-y', '+z', '-x', '+x']) { p.push(); GI.FACE[fc](p); p.plane(1, 1); p.pop(); } p.pop(); } });
    st.gi.sh = p.createShader(GI.VERT, GI.FRAG);
    st.vol = await VOL.setup(p, { tokens: st.tk, seed: F.seed, fonts: {} }, VP);
    st.volA = st.vol.marks.map((m) => m.a);
    if (st.vol.tailSamples !== VCOUNTS[3]) throw new Error('pass-every-time: volume tail ' + st.vol.tailSamples);
    ST.v = st;
  },

  render(t, s, kk) {
    const p = kk.p, st = ST.v; if (!st) return;
    const q = poseAt(t), cam = st.cam, lw = (px) => px / (q.zoom || 1);        // ortho stroke weights are world units
    RIGM.apply(p, cam, q, RIG); p.setCamera(cam); p.noLights();
    const scene = t < T_VOL ? 'tau' : t < T_PR ? 'vol' : t < T_MIN ? 'pr' : t < T_MON ? 'min' : 'tau';

    /* the floor of each scene */
    const fm = Z.floorMargin;
    if (scene === 'tau') floor(p, 0, 0, 90 + fm, 90 + fm, 5, Z.gridOp, lw(1.2));
    else if (scene === 'pr') floor(p, 0, 0, 90 + fm, 90 + fm, 5, Z.gridOp, lw(1.2));
    else if (scene === 'min') {
      const L = (NMIN - 1) * MP; floor(p, L / 2, 0, L / 2 + 6, 6, 1e6, 0, lw(1));
      const c = p.color(C.muted); c.setAlpha(255 * 0.55); p.stroke(c); p.strokeWeight(lw(1.2));
      p.beginShape(p.LINES);
      for (let h = 0; h * 60 * MP <= L + 1e-6; h++) { const x = (h * 60 - 0.5) * MP; p.vertex(x, 0.2, -3.4); p.vertex(x, 0.2, 3.4); }
      p.endShape();
    }

    /* the marks: one instanced draw (tries, PRs, minutes; the shader hides what is not in this scene) */
    if (scene !== 'vol') {
      const g = st.gi, sh = g.sh;
      GI.bindMarks(p, g, GP, st.tk, N, N + 1, null, 0);
      const stand = T_STAND;
      sh.setUniform('uT', t);
      sh.setUniform('uW1', [stand.t0, Z.m1Spread, (stand.t1 - stand.t0) - Z.m1Spread, Z.m1Lift]);
      sh.setUniform('uW2', [Z.m2T0, Z.m2Spread, (Z.m2T1 - Z.m2T0) - Z.m2Spread, Z.m2Lift]);
      sh.setUniform('uW3', [Z.m4T0, Z.m4Spread, (Z.m4T1 - Z.m4T0) - Z.m4Spread, Z.m4Lift]);
      sh.setUniform('uD1', [Z.plateW, Z.planCubeW, Z.cubeW, Z.flatH]);
      sh.setUniform('uD2', [Z.cubeH, Z.prH, Z.minH, 0]);
      sh.setUniform('uGhost', rgbOf(p, p.lerpColor(p.color(C.paper), p.color(K.BRAND.color.accent2), Z.ghostMix)));
      sh.setUniform('uCut', Z.cutDimAmt * seg(t, Z.cutDimAt, Z.cutDimAt + 1.0) * (1 - seg(t, Z.cutDimOffAt, Z.cutDimOffAt + 0.2)));
      sh.setUniform('uFlash', Z.litFlash);
      p.fill(255);                                                      // a leaked noFill() makes model() draw nothing
      GI.drawMarks(p, g, GP, N);
    }

    /* the volume (gl-volume): pass every one of k tries; the cut rests on each bar in turn; the paper's slot is an outline */
    let vc = null;
    if (scene === 'vol') {
      const on = Z.bar1At - Z.cutMove - 0.2, cs = cutS(t), off = t >= Z.cutOffAt;
      const vp = Object.assign({}, VP, { cutIn: off ? [2, 3] : [on / F.dur, on / F.dur + 1e-4], cutFrom: cs, cutTo: cs, lw: lw(1), camAt: () => ({ eye: q.eye, c: q.center }), applyCam: (cm) => RIGM.apply(p, cm, q, RIG) });
      vc = VOL.draw(p, t, st.vol, vp, st.tk);
      p.setCamera(cam);
      const po = seg(t, Z.paperAt, Z.paperAt + 0.8);
      if (po > 0.01) {
        const c = p.color(C.ink); c.setAlpha(255 * 0.8 * po); p.stroke(c); p.strokeWeight(lw(1.4)); p.noFill();
        const x0 = vx(VNB - 1) - vbw * (1 - Z.volGap) / 2, x1 = x0 + vbw * (1 - Z.volGap), z0 = -Z.volD / 2, z1 = Z.volD / 2, h = -PAPER_H;
        const cor = [[x0, z0], [x1, z0], [x1, z1], [x0, z1]];
        for (let i = 0; i < 4; i++) { const a = cor[i], b = cor[(i + 1) % 4]; dashed(p, [a[0], h, a[1]], [b[0], h, b[1]], Z.dashLen, Z.dashGap); dashed(p, [a[0], 0, a[1]], [a[0], h, a[1]], Z.dashLen, Z.dashGap); }
      }
    }

    /* ══ SVG: words and digits (all claims), pinned to the scene through the rig's own projection ══ */
    /* HOOK: the belief, set in type over the empty floor; no digit, no cube */
    if (t < Z.hookOut + 0.8) {
      const ho = 1 - seg(t, Z.hookOut, Z.hookOut + 0.8);
      K.tx('eyebrow', 'labels', 480, 70, 'AGENT RELIABILITY · THE SCOREBOARD', { fam: 'mono', size: 12, anchor: 'middle', fill: C.muted, role: 'chrome', ls: 1.5, op: seg(t, 0.4, 1.2) * ho });
      K.tx('hookA', 'labels', 480, 236, 'usually right', { fam: 'disp', size: 76, anchor: 'middle', fill: C.ink, role: 'must-read', op: seg(t, Z.hookA, Z.hookA + 1.0) * ho });
      K.tx('hookB', 'labels', 480, 318, '= most of the work?', { fam: 'disp', size: 76, anchor: 'middle', fill: CH, role: 'must-read', op: seg(t, Z.hookB, Z.hookB + 1.0) * ho });
    }

    /* CASE / COUNT on the tau board: the tag, the scoreboard counts, the pins */
    if (scene === 'tau' && t < T_VOL) {
      const tagOp = seg(t, Z.tagAt, Z.tagAt + 0.8) * (1 - seg(t, T_VOL - 0.4, T_VOL));
      K.tx('tag', 'labels', 40, 62, 'GPT-4o · TAU-BENCH RETAIL · ' + P.year, { fam: 'mono', size: 14, anchor: 'start', fill: C.muted, role: 'secondary', op: tagOp });
      const hud = 1 - seg(t, Z.hudOut, Z.hudOut + 0.4);
      if (t >= Z.tileT0 && t < Z.cubeT0 - 0.1) board('hA', nTiles(t), 'TASKS · ONE TILE EACH', 1);
      else if (t >= Z.cubeT0 - 0.1 && t < Z.litT0 - 0.1) board('hB', nCubes(t), 'TRIES · ONE CUBE EACH', 1);
      else if (t >= Z.litT0 - 0.1 && t < Z.hudOut + 0.4) board('hC', nLit(t), 'PASSED · A LIT CUBE IS A PASS', hud);
      pins(t, 'plan', fade(t, Z.ratioAt, Z.ratioAt + 0.25, Z.hudOut, Z.hudOut + 0.3), 'plan');
      pins(t, 'pooled', fade(t, Z.wordsAt, Z.wordsAt + 0.4, Z.wordsOut, Z.wordsOut + 0.4), 'pooled');
      const f44 = fade(t, Z.p44At, Z.p44At + 0.25, Z.p22At - 0.1, Z.p22At);
      pins(t, 'p44', f44, 'p44');
      if (f44 > 0.01) { const a = AN.p44[0], v0 = scr(q, [a.x, a.y, a.z]), v1 = scr(q, [a.x, topY, a.z]); K.ln('pole.p44', 'labels', v0.x, v0.y, v1.x, v1.y, { stroke: C.accent, w: 1.2, op: f44 }); }
      pins(t, 'p22', fade(t, Z.p22At, Z.p22At + 0.25, Z.pinsOut, Z.pinsOut + 0.2), 'p22');
    }
    /* COUNT: the volume's readouts (callout hard-cuts between bars) */
    if (scene === 'vol') {
      const tag = fade(t, T_VOL + 0.2, T_VOL + 0.8, T_PR - 0.5, T_PR - 0.1);
      K.tx('vtag', 'labels', 40, 62, 'THE SAME TASKS · PASS EVERY ONE OF THE TRIES', { fam: 'mono', size: 14, anchor: 'start', fill: C.muted, role: 'secondary', op: tag });
      const ax = [['ONE', 0], ['TWO', 1], ['THREE', 2], ['FOUR', 3]];
      ax.forEach(([w, k]) => {
        const v = scr(q, [vx(k), 0, Z.volD / 2 + 3]);
        const o = seg(t, T_VOL + 0.9, T_VOL + 1.6) * (1 - seg(t, T_PR - 0.4, T_PR - 0.1));
        K.tx('vax' + k, 'labels', v.x, v.y + 18, w, { fam: 'mono', size: 14, anchor: 'middle', fill: C.muted, role: 'secondary', op: o });
      });
      pins(t, 'vol', fade(t, Z.bar1At, Z.bar1At + 0.25, T_PR - 0.4, T_PR - 0.1), 'vol');
    }
    /* COUNT: the PR board */
    if (scene === 'pr') {
      const tag = fade(t, T_PR + 0.2, T_PR + 0.8, T_MIN - 0.5, T_MIN - 0.1);
      K.tx('ptag', 'labels', 40, 62, 'PULL REQUESTS THAT PASS THE TESTS · ONE CUBE EACH', { fam: 'mono', size: 14, anchor: 'start', fill: C.muted, role: 'secondary', op: tag });
      if (t >= T_PR + Z.prLead && t < Z.sweAt) board('pN', nPr(t), 'PULL REQUESTS', 1);
      pins(t, 'pr', fade(t, Z.sweAt, Z.sweAt + 0.25, Z.sweOut, Z.sweOut + 0.3), 'swe');
      pins(t, 'prs', fade(t, Z.halfAt, Z.halfAt + 0.25, T_MIN - 0.5, T_MIN - 0.1), 'prs');
    }
    /* COUNT: the minutes */
    if (scene === 'min') {
      const lg = fade(t, Z.legendAt, Z.legendAt + 0.6, T_MIN + 14, T_MIN + 14.4);
      K.tx('lg1', 'labels', 40, 62, 'ONE CUBE = ONE MINUTE', { fam: 'mono', size: 14, anchor: 'start', fill: C.ink, role: 'secondary', op: lg });
      K.tx('lg2', 'labels', 40, 82, 'EACH TICK ON THE FLOOR = AN HOUR', { fam: 'mono', size: 14, anchor: 'start', fill: C.muted, role: 'secondary', op: lg });
      pins(t, 'm27', fade(t, Z.m27At, Z.m27At + 0.25, Z.m27Out, Z.m27Out + 0.2), 'm27');
      pins(t, 'm289', fade(t, Z.m289At, Z.m289At + 0.25, Z.m289Out, Z.m289Out + 0.2), 'm289');
      pins(t, 'x10', seg(t, Z.tenAt, Z.tenAt + 0.25), 'x10');
    }
    /* MONDAY */
    if (t >= T_MON) {
      const qo = fade(t, Z.qAt, Z.qAt + 0.8, Z.qOut, Z.qOut + 0.6);
      if (qo > 0.01) {
        K.tx('q1', 'labels', 480, 80, 'How often does it pass when it has to pass every time,', { fam: 'disp', size: 32, anchor: 'middle', fill: C.ink, role: 'must-read', op: qo });
        K.tx('q2', 'labels', 480, 124, 'and who checks the merge?', { fam: 'disp', size: 32, anchor: 'middle', fill: CH, role: 'must-read', op: qo });
      }
      const ho = seg(t, Z.honestAt, Z.honestAt + 0.8);
      if (ho > 0.01) {
        K.tx('h1', 'labels', 480, 84, 'One ' + P.year + ' model, and agents that could not revise:', { fam: 'disp', size: 32, anchor: 'middle', fill: C.ink, role: 'must-read', op: ho });
        K.tx('h2', 'labels', 480, 126, 'newer ones may do better.', { fam: 'disp', size: 32, anchor: 'middle', fill: C.ink, role: 'must-read', op: ho });
      }
    }
  },
};
})();
