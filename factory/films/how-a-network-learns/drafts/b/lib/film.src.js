/* how-a-network-learns / draft B · "the night garden".
   The 150 irises are a cloud in the dark with fog; the loss surface rises out of the ground as the steps count; the signal
   pulses through the ribbons as light; one travelling callout carries the claims; the right-at-step-k brush arrives like dawn.
   Renderer webgl (kit2). Chain: gl-pointcloud -> gl-heightfield -> gl-ribbons -> gl-pointcloud (brushed), pins through
   gl-labels solve (one solve for the whole film, one callout that hard-cuts between anchors) and K.tx.
   One clock: render(t, state) draws frame t from t alone. Everything seeded or baked in setup; every tunable a knob. */
(function () {
'use strict';
const K0 = window.KIT, F = window.FILM, P = F.params, DA = P.data, AR = window.ARSENAL;
const PC = AR.patterns['gl-pointcloud'], HF = AR.patterns['gl-heightfield'], RB = AR.patterns['gl-ribbons'], LB = AR.patterns['gl-labels'];
const { seg, ease, lerp, clamp } = K0;
const kn = (n, d) => K0.knob(n, d);
const D2R = Math.PI / 180;
const sm = (x) => { x = clamp(x, 0, 1); return x * x * x * (x * (x * 6 - 15) + 10); };

/* ── knobs, read once (film.json is fixed for the page) ── */
const Z = {};
[ // timeline (s)
  ['revealAt0', 0.4], ['revealAt1', 4.0], ['speciesAt', 12.4], ['turnAt0', 17.6], ['turnAt1', 22.4], ['bandAt', 26.6], ['xfade', 0.4],
  ['landAt', 30.0], ['riseAt0', 33.0], ['riseAt1', 40.0], ['ballAt', 40.2], ['runAt', 45.2], ['stepsPerSec', 100], ['cutAt', 50.8],
  ['ribAt', 58.0], ['ride0', 58.2], ['ride10', 63.0], ['ride50', 72.2], ['ride100', 75.2], ['ride1000', 78.4], ['rideDur', 3.0], ['subLag', 1.0],
  ['cloudAt', 84.0], ['clock0', 84.4], ['clock1', 100.0], ['dollyAt0', 101.0], ['dollyAt1', 104.0], ['row134At', 104.6], ['mondayAt', 108.0],
  // S1 the flower cloud
  ['cloudSize', 380], ['pointR', 5.2], ['sizeCue', 0.6], ['fog', 0.3], ['fogStart', 0.15], ['dim', 0.7], ['litGrow', 0.25], ['litMix', 0.2],
  ['camSwing', 40], ['camPitch', 20], ['camDist', 980], ['frontPitch', 4], ['camSwing3', 24], ['pitch3', 14], ['dolly', 620],
  ['bandAlpha', 0.14], ['brushClock', 'log'], ['dawn', 0.32], ['frame', 'on'], ['mondayDim', 0.7],
  // S2 the loss landscape
  ['hscale', 170], ['contours', 8], ['contourRole', 'muted'], ['camEl0', 89], ['camEl', 32], ['camAz0', -14], ['camAz1', -26], ['camAzCut', -58],
  ['camDist2', 1.22], ['liftY2', 70], ['ballR', 7], ['trailW', 2.2], ['dropLine', 1.2], ['cutMode', 'section'], ['insetW', 270], ['insetH', 120],
  // S3 the network in depth
  ['layerX', 600], ['widthGain', 9], ['gap', 9], ['slabW', 16], ['slabD', 26], ['zSpread', 36], ['curv', 0.5], ['thick', 8],
  ['grow', 0.5], ['tail', 0.6], ['markSize', 4.2], ['halo', 0.22], ['fogK', 0.3], ['stripes', 0], ['ribbonMix', 0.5], ['pulse', 0.3],
  ['ribYaw', -16], ['ribPitch', 12], ['ribDist', 900], ['ribDrift', 6], ['ribLookX', 70], ['ribLookY', -40], ['trayCols', 16], ['trayGap', 16],
  // labels
  ['hold', 6], ['leader', 22], ['calloutLeader', 56], ['calloutSize', 32], ['maxShown', 8], ['headSize', 72],
].forEach(([n, d]) => { Z[n] = kn(n, d); });

/* ── data, from params (packed by lib/data_pack.py from the frozen topic data) ── */
const N = DA.X.length, SPN = ['SETOSA', 'VERSICOLOR', 'VIRGINICA'], SPR = ['muted', 'accent2', 'ink'];
const Y = DA.X.map((_, i) => Math.floor(i / 50));                       // 50 per species, in table order
const ROW84 = 83, ROW134 = 133;                                          // 0-based rows of claim wrong_rows "84, 134"
const FLIPS = DA.flips;                                                  // per flower: steps at which right/wrong changes
const rightAt = (i, k) => { let n = 0; for (const s of FLIPS[i]) { if (s <= k) n++; else break; } return n & 1; };
const learnedAt = FLIPS.map((f) => (f.length & 1 ? f[f.length - 1] : null));   // right for good from this step (null = never)
const CK = [0, 10, 50, 100, 1000];

/* ── colours ── */
const C = K0.C, BC = K0.BRAND.color;
const hexRgb = (h) => K0.hexRgb(h);
const mixHex = (a, b, u) => { const x = hexRgb(a), y = hexRgb(b); return 'rgb(' + [0, 1, 2].map((i) => Math.round(x[i] + (y[i] - x[i]) * u)).join(',') + ')'; };
const roleHex = (r) => BC[r] || BC.ink;
const SVGC = { muted: C.muted, accent2: C.soft, ink: C.ink, accent: C.accent };

/* ── S1 geometry: data -> world (the module's mapping, domain fixed so overlays share it) ── */
const DOM = [[0.6, 7.4], [-0.1, 2.7], [4.0, 8.2]];                      // petal length, petal width, sepal length (cm)
const toW1 = (x, y, z) => [((x - DOM[0][0]) / (DOM[0][1] - DOM[0][0]) - 0.5) * Z.cloudSize, -((y - DOM[1][0]) / (DOM[1][1] - DOM[1][0]) - 0.5) * Z.cloudSize, ((z - DOM[2][0]) / (DOM[2][1] - DOM[2][0]) - 0.5) * Z.cloudSize];
const PTS = DA.X.map((r) => toW1(r[2], r[3], r[0]));
const centroid = (ids) => { const s = [0, 0, 0]; ids.forEach((i) => { for (let a = 0; a < 3; a++) s[a] += PTS[i][a]; }); return s.map((v) => v / ids.length); };
const SPC = [0, 1, 2].map((s) => centroid(Y.map((y, i) => (y === s ? i : -1)).filter((i) => i >= 0)));
const SET19 = DA.X.findIndex((r, i) => Y[i] === 0 && r[2] === 1.9);
const KLAST = learnedAt.indexOf(231);                                    // the last flower to come right (claim step_reach_148)
const UNLIT34 = centroid(Y.map((_, i) => i).filter((i) => !rightAt(i, 34)));
const ROWMID = centroid([ROW84, ROW134]);

/* the step clock of the brushed cloud (3b) and its inverse (for the callout schedule) */
const clockU = (t) => seg(t, Z.clock0, Z.clock1);
const stepOf = (u) => (Z.brushClock === 'linear' ? Math.floor(1000 * u + 1e-9) : Math.min(1000, Math.floor(Math.pow(1001, u) - 1 + 1e-9)));
const timeOfStep = (k) => { const u = Z.brushClock === 'linear' ? k / 1000 : Math.log(k + 1) / Math.log(1001); return Z.clock0 + u * (Z.clock1 - Z.clock0) + 1e-3; };
const T34 = timeOfStep(34), T231 = timeOfStep(231);

/* S1 camera on t (yaw, pitch in rad; dist; model offset so a dolly can centre the overlap) */
function cam1(t) {
  let yaw, pitch, dist, off = [0, 0, 0];
  if (t < Z.cloudAt) {
    const a = seg(t, 0, Z.turnAt0), b = ease(seg(t, Z.turnAt0, Z.turnAt1));
    const y0 = lerp(-Z.camSwing / 2, Z.camSwing / 2, a) * D2R;
    yaw = lerp(y0, 0, b); pitch = lerp(Z.camPitch, Z.frontPitch, b) * D2R; dist = lerp(Z.camDist, Z.camDist * 0.94, b);
  } else {
    const a = seg(t, Z.cloudAt, Z.dollyAt0), d = ease(seg(t, Z.dollyAt0, Z.dollyAt1));
    yaw = lerp(-Z.camSwing3 / 2, Z.camSwing3 / 2, a) * D2R * (1 - 0.6 * d); pitch = lerp(Z.pitch3, Z.frontPitch + 4, d) * D2R;
    dist = lerp(Z.camDist * 0.94, Z.dolly, d); off = ROWMID.map((v) => -v * d);
  }
  const eye = [dist * Math.sin(yaw) * Math.cos(pitch), -dist * Math.sin(pitch), dist * Math.cos(yaw) * Math.cos(pitch)];
  return { yaw, pitch, dist, off, eye, look: [0, 0, 0], fov: 0.72 };
}

/* ── S2: the slice, recomputed from the final weights (the brief's surface.json values, to 1e-5) ── */
const SL = DA.slice, COLS = SL.cols, ROWS = SL.rows;
const AXA = (c) => SL.a[0] + (SL.a[1] - SL.a[0]) * c / (COLS - 1), AXB = (r) => SL.b[0] + (SL.b[1] - SL.b[0]) * r / (ROWS - 1);
function sliceMatrix() {
  const W1 = DA.final.W1, b1 = DA.final.b1, W2 = DA.final.W2, b2 = DA.final.b2;
  const Xs = DA.X.map((r) => r.map((v, j) => (v - DA.mu[j]) / DA.sd[j]));
  const M = [];
  for (let r = 0; r < ROWS; r++) {
    const wb = AXB(r), H = Xs.map((x) => { const h = []; for (let j = 0; j < 8; j++) { let s = b1[j]; for (let i = 0; i < 4; i++) s += x[i] * (i === 2 && j === 2 ? wb : W1[i][j]); h.push(Math.tanh(s)); } return h; });
    const base = H.map((h) => [0, 1, 2].map((c) => { let s = b2[c]; for (let j = 0; j < 8; j++) if (!(j === 2 && c === 2)) s += h[j] * W2[j][c]; return s; }));
    const row = [];
    for (let c = 0; c < COLS; c++) {
      const wa = AXA(c); let L = 0;
      for (let n = 0; n < N; n++) {
        const z0 = base[n][0], z1 = base[n][1], z2 = base[n][2] + H[n][2] * wa, m = Math.max(z0, z1, z2);
        const lse = m + Math.log(Math.exp(z0 - m) + Math.exp(z1 - m) + Math.exp(z2 - m));
        L += lse - (Y[n] === 0 ? z0 : Y[n] === 1 ? z1 : z2);
      }
      row.push(L / N);
    }
    M.push(row);
  }
  return M;
}
const VMIN = 0, VMAX = 1.4;                                              // fixed scale: the path starts at 1.393, above the slice max
const PATH = DA.path;                                                    // [k, col, row, loss_true]
function pathAt(kf) {
  kf = clamp(kf, 0, 1000); let j = 0; while (j < PATH.length - 2 && PATH[j + 1][0] <= kf) j++;
  const a = PATH[j], b = PATH[j + 1], u = clamp((kf - a[0]) / (b[0] - a[0]), 0, 1);
  return { col: lerp(a[1], b[1], u), row: lerp(a[2], b[2], u), loss: lerp(a[3], b[3], u) };
}
let HG = null;                                                           // the slice geometry (filled in setup)
const sliceAt = (col, row) => {                                          // bilinear on the grid: the ground under a point
  const c = clamp(col, 0, COLS - 1.001), r = clamp(row, 0, ROWS - 1.001), c0 = Math.floor(c), r0 = Math.floor(r), fc = c - c0, fr = r - r0, M = HG.M;
  return lerp(lerp(M[r0][c0], M[r0][c0 + 1], fc), lerp(M[r0 + 1][c0], M[r0 + 1][c0 + 1], fc), fr);
};
const hOf = (v) => Z.hscale * clamp((v - VMIN) / (VMAX - VMIN), 0, 1);
const toW2 = (col, row, v, rise) => [HG.x0 + col * HG.cell, -Z.liftY2 - hOf(v) * rise, HG.z0 + row * HG.cell];
const stepRun = (t) => clamp((t - Z.runAt) * Z.stepsPerSec, 0, 1000);
const riseOf = (t) => Math.max(0.015, ease(seg(t, Z.riseAt0, Z.riseAt1)));
function cam2(t) {
  const tilt = ease(seg(t, Z.riseAt0, Z.riseAt1)), sw = ease(seg(t, Z.riseAt1, Z.cutAt)), ct = ease(seg(t, Z.cutAt, Z.cutAt + 3));
  const az = lerp(lerp(Z.camAz0 * 0.2, Z.camAz0, tilt), Z.camAz1, sw) * (1 - ct) + Z.camAzCut * ct;
  const el = lerp(Z.camEl0, Z.camEl, tilt), dist = Z.camDist2 * 760 * lerp(1.12, 1, tilt);
  const look = [0, -Z.hscale * 0.35, 0], a = az * D2R, e = el * D2R;
  return { az, el, dist, look, eye: [look[0] + dist * Math.cos(e) * Math.sin(a), look[1] - dist * Math.sin(e), look[2] + dist * Math.cos(e) * Math.cos(a)], fov: 0.78 };
}

/* ── S3: the network, one module state per checkpoint (widths = |weight| at that step) ── */
const INL = ['SEPAL LENGTH', 'SEPAL WIDTH', 'PETAL LENGTH', 'PETAL WIDTH'];
function netData(k) {
  const c = DA.ck[String(k)], nodes = [], links = [];
  for (let i = 0; i < 4; i++) nodes.push({ id: 'i' + i, label: INL[i], layer: 0, role: 'muted' });
  for (let j = 0; j < 8; j++) nodes.push({ id: 'h' + j, label: '', layer: 1, role: 'muted' });
  for (let s = 0; s < 3; s++) nodes.push({ id: 'o' + s, label: SPN[s], layer: 2, role: SPR[s] });
  for (let i = 0; i < 4; i++) for (let j = 0; j < 8; j++) links.push(['i' + i, 'h' + j, Math.abs(c.w1[i][j]), 'muted']);
  for (let j = 0; j < 8; j++) for (let s = 0; s < 3; s++) links.push(['h' + j, 'o' + s, Math.abs(c.w2[j][s]), SPR[s]]);
  const routes = []; for (let n = 0; n < N; n++) routes.push([+c.routes[3 * n], +c.routes[3 * n + 1], +c.routes[3 * n + 2]]);
  return { nodes, links, routes };
}
const RIDES = [[Z.ride0, 0], [Z.ride10, 10], [Z.ride50, 50], [Z.ride100, 100], [Z.ride1000, 1000]];
const rideAt = (t) => { let r = 0; for (let i = 0; i < RIDES.length; i++) if (t >= RIDES[i][0]) r = i; return r; };
const ribParams = () => ({
  model: 'flow', shape: 'band', dur: Z.rideDur, X: Z.layerX, H: 340, gap: Z.gap, k: Z.widthGain, slabW: Z.slabW, slabD: Z.slabD, zSpread: Z.zSpread,
  curv: Z.curv, thick: Z.thick, seg: 32, unit: 1e6, markSize: 0.01, lead: 0, tail: Z.tail, grow: Z.grow, overlap: 0, travel: 0.05, jitter: 0,
  stripes: Z.stripes, amb: 0.62, fog: [500, 1500], fogK: Z.fogK, ribbonMix: Z.ribbonMix, readout: null, labels: 'none', clear: true,
  cam: [{ t: 0, eye: [0, 0, 1], look: [0, 0, 0], fov: 0.62 }, { t: 1, eye: [0, 0, 1], look: [0, 0, 0], fov: 0.62 }],
});
function cam3(t) {
  const yaw = (Z.ribYaw + Z.ribDrift * seg(t, Z.ribAt, Z.cloudAt)) * D2R, pitch = Z.ribPitch * D2R, d = Z.ribDist, look = [Z.ribLookX, Z.ribLookY, 0];
  return { eye: [look[0] + d * Math.sin(yaw) * Math.cos(pitch), look[1] - d * Math.sin(pitch), look[2] + d * Math.cos(yaw) * Math.cos(pitch)], look, fov: 0.62 };
}

/* ── gl-labels: one anchor list and one camera for the whole film; inactive anchors are NaN (off-screen) ── */
const NANP = [NaN, NaN, NaN];
const IN = (t, a, b) => t >= a && t < b;
const add3 = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const ANCH = [
  { id: 'sp0', text: 'SETOSA', role: 'secondary', priority: 3, at: (t) => (IN(t, Z.speciesAt + 1, Z.landAt) ? SPC[0] : NANP) },
  { id: 'sp1', text: 'VERSICOLOR', role: 'secondary', priority: 3, at: (t) => (IN(t, Z.speciesAt + 1, Z.landAt) ? SPC[1] : NANP) },
  { id: 'sp2', text: 'VIRGINICA', role: 'secondary', priority: 3, at: (t) => (IN(t, Z.speciesAt + 1, Z.landAt) ? SPC[2] : NANP) },
  { id: 'set19', text: '1.9 CM', role: 'secondary', at: (t) => (IN(t, 22.8, Z.bandAt) ? PTS[SET19] : NANP) },
  { id: 'band', text: '37 FLOWERS', role: 'secondary', at: (t) => (IN(t, Z.bandAt, Z.landAt) ? toW1(4.8, 2.35, 6.1) : NANP) },
  { id: 'start', text: 'LOSS 1.393', role: 'secondary', at: (t) => (IN(t, Z.ballAt, Z.cutAt) ? toW2(SL.start.col, SL.start.row, PATH[0][3], 1) : NANP) },
  { id: 'end', text: 'LOSS 0.039', role: 'secondary', at: (t) => { if (!IN(t, Z.cutAt, Z.ribAt)) return NANP; const q = pathAt(1000); return toW2(q.col, q.row, q.loss, 1); } },
  { id: 'k34', text: '143 RIGHT', role: 'secondary', at: (t) => (IN(t, T34, T231) ? add3(UNLIT34, cam1(t).off) : NANP) },
  { id: 'k231', text: '148 RIGHT', role: 'secondary', at: (t) => (IN(t, T231, Z.dollyAt0) ? add3(PTS[KLAST], cam1(t).off) : NANP) },
  { id: 'row84', text: 'ROW 84', sub: 'VERSICOLOR → VIRGINICA', role: 'secondary', priority: 2, at: (t) => (IN(t, Z.dollyAt0, Z.row134At) ? add3(PTS[ROW84], cam1(t).off) : NANP) },
  { id: 'row134', text: 'ROW 134', sub: 'VIRGINICA → VERSICOLOR', role: 'secondary', priority: 2, at: (t) => (IN(t, Z.row134At, Z.mondayAt) ? add3(PTS[ROW134], cam1(t).off) : NANP) },
];
const anchors = (t) => ANCH.map((a) => { const w = a.at(t); return { id: a.id, x: w[0], y: w[1], z: w[2], text: a.text, sub: a.sub, role: a.role, priority: a.priority || 1 }; });
const camAll = (t) => (t < Z.landAt || t >= Z.cloudAt ? cam1(t) : t < Z.ribAt ? cam2(t) : cam3(t));
const CALLOUT = { leader: Z.calloutLeader, size: Z.calloutSize, schedule: [
  { t: 22.8, id: 'set19', text: '1.9 CM', sub: 'LONGEST SETOSA PETAL' },
  { t: Z.bandAt, id: 'band', text: '37 FLOWERS', sub: 'SHARE 4.5–5.1 CM OF PETAL' },
  { t: Z.landAt, id: null },
  { t: Z.ballAt, id: 'start', text: 'LOSS 1.393', sub: 'START · RANDOM WEIGHTS' },
  { t: Z.cutAt, id: 'end', text: 'LOSS 0.039', sub: 'END · AFTER 1,000 STEPS' },
  { t: Z.ribAt, id: null },
  { t: T34, id: 'k34', text: '143 RIGHT', sub: 'AT STEP 34' },
  { t: T231, id: 'k231', text: '148 RIGHT', sub: 'AT STEP 231 · THE LAST NEW ONE' },
  { t: Z.dollyAt0, id: 'row84', text: 'ROW 84', sub: 'VERSICOLOR → VIRGINICA' },
  { t: Z.row134At, id: 'row134', text: 'ROW 134', sub: 'VIRGINICA → VERSICOLOR' },
  { t: Z.mondayAt, id: null },
] };
const RESERVE = [[0, 436, 960, 540], [24, 18, 330, 70]];
let LOPT = null;

/* ── state built once ── */
let S1 = null, S2 = null, S3 = [], TOK = null, P1 = null, P2 = null;
const P1base = () => ({
  dur: 1, data: null, domain: DOM, size: Z.cloudSize, r: Z.pointR, sizeCue: Z.sizeCue, fog: Z.fog, fogStart: Z.fogStart,
  frame: Z.frame === 'on', axes: null, groupRoles: ['g0', 'g1', 'g2', 'g0'], hiRole: 'accent', pinRole: 'accent',
  reveal: null, revealBy: 'random', brush: { field: 'b' }, brushAt: [2, 3], ramp: 0.001, dim: Z.dim, grow: Z.litGrow, brushCaption: '',
  pins: false, pinsAt: null, readout: false, title: '', dof: null, cam: { yaw: [0, 0], pitch: [0, 0], dist: [900, 900], fov: 0.72, follow: 0 },
});

window.FILM_RENDER = {
  async setup(p, K) {
    TOK = { id: K.BRAND.id, color: Object.assign({}, BC), type: K.BRAND.type };
    // S1: 150 flowers; x = petal length, y = petal width, z = sepal length (cm); every row 'b' so exact brushing can use rank
    P1 = P1base();
    P1.data = DA.X.map((r, i) => ({ x: r[2], y: r[3], z: r[0], group: Y[i], b: 1, size: 0.5 }));
    S1 = await PC.setup(p, { seed: F.seed, tokens: TOK, fonts: { disp: null, mono: null } }, P1);
    S1.byRank = new Array(N); for (let i = 0; i < N; i++) S1.byRank[S1.d.brank[i]] = i;
    // S2: the slice as terrain, ball and trail drawn on it
    const M = sliceMatrix();
    P2 = { data: M, vmin: VMIN, vmax: VMAX, dp: 3, unit: '', dur: 1, size: 760, hscale: Z.hscale, slab: 14, wire: false, gridW: 1.1,
      contours: Z.contours, contourW: 1.1, contourRole: Z.contourRole, ramp: ['panel', 'muted', 'accent'], amb: 0.42, key: 0.72, rim: 0.1,
      reveal: null, cut: null, cutMode: 'off', cutW: 2.4, cutMargin: 1, profile: false, profileBox: [0, 0, 1, 1],
      camT: [0, 1], camAz: [0, 0], camEl: [60, 60], camDist: [1.2, 1.2], camLook: 'centre', follow: 0, fov: 0.78, pins: false, hud: false };
    S2 = await HF.setup(p, { seed: F.seed, tokens: TOK, fonts: null }, P2);
    HG = S2;
    // S3: one ribbons state per checkpoint
    for (const k of CK) {
      const nd = netData(k), pr = ribParams(); pr.data = { nodes: nd.nodes, links: nd.links };
      const st = await RB.setup(p, { seed: F.seed, tokens: TOK }, pr);
      st.routes = nd.routes; st.k = k; st.params = pr;
      const byPair = {}; for (const l of st.G.links) byPair[l.s + '>' + l.t] = l; st.byPair = byPair;
      S3.push(st);
    }
    // per-flower departure offsets (golden-ratio spread, no randomness needed) and lanes
    S3.dep = Array.from({ length: N }, (_, n) => (n * 0.6180339887) % 1);
    S3.lane = Array.from({ length: N }, (_, n) => (((n * 0.7548776662) % 1) * 2 - 1) * 0.8);
    LOPT = { w: 960, h: 540, fps: 30, hold: Z.hold, leader: Z.leader, maxShown: Z.maxShown, reserve: RESERVE, occlusion: false, callout: CALLOUT,
      measure: (s, z, f) => String(s).length * z * (f === 'disp' ? K.ADV.disp : K.ADV.mono), measureKey: 'adv' };
    p.setCamera(K.cam0);
    window.__nightGarden = { surfaceCheck: [M[SL.start.row][SL.start.col], M[SL.final.row][SL.final.col]], t34: T34, t231: T231 };
  },

  render(t, s, K) {
    const p = K.p;
    if (t < Z.landAt) scene1(p, K, t, 'case');
    else if (t < Z.ribAt) scene2(p, K, t);
    else if (t < Z.cloudAt) scene3(p, K, t);
    else scene1(p, K, t, 'count');
    // cuts between structures: a short fade through the night ground
    const xf = Math.max(0, ...[Z.landAt, Z.ribAt, Z.cloudAt].map((b) => 1 - Math.abs(t - b) / Z.xfade));
    if (xf > 0) K.rc('xfade', 'field', 0, 0, 960, 540, { fill: C.paper, fo: 1, op: clamp(xf, 0, 1) });
    // labels: one solve for the film, one travelling callout
    const sol = LB.solve(t, camAll, anchors, LOPT);
    for (const q of sol.placements) K.rc('gll.' + q.id + (q.callout ? '.co' : '') + '.bg', 'labels', q.box[0], q.box[1], q.box[2] - q.box[0], q.box[3] - q.box[1], { fill: C.paper, fo: 0.72 });
    LB.kit(K, sol.placements, 'labels');
    for (const q of sol.placements) K.E('gll.' + q.id + (q.callout ? '.co' : '') + '.d', 'circle', 'labels', { cx: q.ax.toFixed(2), cy: q.ay.toFixed(2), r: q.callout ? 4 : 3, fill: C[q.color] || C.ink });
  },
};

/* ── S1 · the flower cloud (HOOK, CASE fixture; COUNT cost; MONDAY held) ── */
function scene1(p, K, t, mode) {
  const cv = cam1(t), pr = Object.assign({}, P1);
  const sp = ease(seg(t, Z.speciesAt, Z.speciesAt + 1.6));
  const tk = { id: TOK.id, type: TOK.type, color: Object.assign({}, TOK.color) };
  for (let g = 0; g < 3; g++) tk.color['g' + g] = mixHex(BC.muted, roleHex(SPR[g]), mode === 'count' ? 1 : sp);
  pr.cam = { yaw: [cv.yaw, cv.yaw], pitch: [cv.pitch, cv.pitch], dist: [cv.dist, cv.dist], fov: cv.fov, follow: 0 };
  let k = 1000, s0 = 0;
  if (mode === 'case') {
    pr.dur = 120; pr.reveal = [Z.revealAt0 / 120, Z.revealAt1 / 120]; pr.brushAt = [2, 3];   // u = t / 120; no brush
    S1.sh.setUniform('uExact', 0);
  } else {
    k = t >= Z.mondayAt ? 1000 : stepOf(clockU(t));
    s0 = ease(seg(t, Z.cloudAt + 0.2, Z.clock0 + 0.8));
    pr.reveal = null; pr.dur = 1; pr.brushAt = [-1, 0];                      // brush fully on; lit set by uLit
    const lit = new Array(152).fill(0); for (let r = 0; r < N; r++) lit[r] = rightAt(S1.byRank[r], k);
    S1.sh.setUniform('uExact', 1); S1.sh.setUniform('uLit', lit); S1.sh.setUniform('uHiMix', Z.litMix);
    pr.dim = Z.dim * s0; pr.fog = Z.fog * (1 - 0.6 * clamp((k + 1) / 1001, 0, 1));
  }
  p.push(); p.translate(cv.off[0], cv.off[1], cv.off[2]);
  PC.draw(p, mode === 'case' ? t : 1, S1, pr, tk);
  // overlays in the same camera, depth-tested against the cloud
  const cam = S1.cam; setCam1(p, cam, cv); p.translate(cv.off[0], cv.off[1], cv.off[2]);
  if (mode === 'case') {
    const ba = ease(seg(t, Z.bandAt, Z.bandAt + 1.2)) * (1 - seg(t, Z.landAt - Z.xfade, Z.landAt));
    if (ba > 0) {   // the shared petal-length band, 4.5 to 5.1 cm (claims virginica_pl_min, versicolor_pl_max)
      const a = toW1(4.5, 0, 0)[0], b = toW1(5.1, 0, 0)[0], col = p.color(BC.accent); col.setAlpha(255 * Z.bandAlpha * ba);
      p.noStroke(); p.fill(col); p.push(); p.translate((a + b) / 2, 0, 0); p.box(b - a, Z.cloudSize, Z.cloudSize); p.pop();
    }
  } else {
    const dawn = Z.dawn * clamp((k + 1) / 1001, 0, 1) * (t >= Z.mondayAt ? 1 : 1) + 0.04 * s0;
    glow(p, cv, dawn);
  }
  p.pop();
  if (mode === 'count') {   // the step clock (a running counter; the claims are in the callout)
    const op = seg(t, Z.clock0 - 0.3, Z.clock0) * (1 - seg(t, Z.mondayAt - 0.4, Z.mondayAt));
    if (op > 0) {
      K.tx('clk.k', 'labels', 48, 52, 'STEP ' + K.fmtK(k), { fam: 'mono', size: 14, fill: C.ink, op, role: 'secondary', ls: 1 });
      K.tx('clk.l', 'labels', 48, 70, 'LIT = RIGHT AT THIS STEP · DIM = WRONG', { fam: 'mono', size: 12, fill: C.muted, op, role: 'chrome', ls: 0.5 });
    }
  }
  if (t >= Z.mondayAt) K.rc('mondim', 'field', 0, 0, 960, 540, { fill: C.paper, fo: 1, op: Z.mondayDim * ease(seg(t, Z.mondayAt, Z.mondayAt + 1)) });
}
function setCam1(p, cam, cv) {
  const R = Z.cloudSize * 0.87;
  cam.camera(cv.eye[0], cv.eye[1], cv.eye[2], 0, 0, 0, 0, 1, 0);
  cam.perspective(cv.fov, p.width / p.height, Math.max(8, cv.dist - 2.2 * R), cv.dist + 2.2 * R); p.setCamera(cam);
}
/* dawn: a soft rise of light behind the cloud, a camera-facing gradient plane past the far side (depth-tested, so flowers stay in front) */
function glow(p, cv, g) {
  if (g <= 0.002) return;
  const dir = [-cv.eye[0] / cv.dist, -cv.eye[1] / cv.dist, -cv.eye[2] / cv.dist], up0 = [0, -1, 0];
  const rt = [dir[1] * up0[2] - dir[2] * up0[1], dir[2] * up0[0] - dir[0] * up0[2], dir[0] * up0[1] - dir[1] * up0[0]], rl = Math.hypot(...rt);
  const R = [rt[0] / rl, rt[1] / rl, rt[2] / rl], U = [R[1] * dir[2] - R[2] * dir[1], R[2] * dir[0] - R[0] * dir[2], R[0] * dir[1] - R[1] * dir[0]];
  const c = dir.map((v) => v * Z.cloudSize * 0.95), w = Z.cloudSize * 2.6, h = Z.cloudSize * 1.6;
  const at = (x, y) => [c[0] + R[0] * x + U[0] * y, c[1] + R[1] * x + U[1] * y, c[2] + R[2] * x + U[2] * y];
  const lo = p.color(BC.accent2), hi = p.color(BC.accent2); lo.setAlpha(255 * g); hi.setAlpha(0);
  p.noStroke(); p.beginShape(p.TRIANGLES);
  const v = (q, col) => { p.fill(col); p.vertex(q[0], q[1], q[2]); };
  const a = at(-w, -h), b = at(w, -h), d = at(w, h * 0.4), e = at(-w, h * 0.4);
  v(a, lo); v(b, lo); v(d, hi); v(a, lo); v(d, hi); v(e, hi);
  p.endShape();
}

/* ── S2 · the loss landscape (CASE mechanism) ── */
function scene2(p, K, t) {
  const cv = cam2(t), rise = riseOf(t), kf = stepRun(t), pr = Object.assign({}, P2);
  pr.camAz = [cv.az, cv.az]; pr.camEl = [cv.el, cv.el]; pr.camDist = [cv.dist / 760, cv.dist / 760];
  const q = pathAt(kf), cutOn = t >= Z.cutAt && Z.cutMode !== 'off';
  const col = Math.round(clamp(q.col, 1, COLS - 2));
  if (cutOn) { pr.cutMode = Z.cutMode; pr.cut = [-2, -1]; pr.cutMargin = COLS - 1 - col; }
  p.push(); p.translate(0, -Z.liftY2, 0); p.scale(1, rise, 1);
  HF.draw(p, 0.5, S2, pr, TOK);
  const cam = S2.work;   // same camera the module set (camAt with camLook centre)
  cam.camera(cv.eye[0], cv.eye[1], cv.eye[2], cv.look[0], cv.look[1], cv.look[2], 0, 1, 0); cam.perspective(cv.fov, p.width / p.height, 5, 8000); p.setCamera(cam);
  p.resetMatrix();
  const ballOn = ease(seg(t, Z.ballAt, Z.ballAt + 0.8));
  if (ballOn > 0) {
    // the trail: every step so far at its real height (all 67 weights moving), above the slice it is drawn on
    const pts = []; for (const r of PATH) { if (r[0] > kf) break; pts.push(toW2(r[1], r[2], r[3], rise)); }
    const b = toW2(q.col, q.row, q.loss, rise); pts.push(b);
    const tc = p.color(BC.accent2); tc.setAlpha(255 * 0.9 * ballOn);
    p.noFill(); p.stroke(tc); p.strokeWeight(Z.trailW); p.beginShape(); for (const w of pts) p.vertex(w[0], w[1] - 1.5, w[2]); p.endShape();
    if (Z.dropLine > 0) {   // drop line from the ball to the ground under it (the slice)
      const g = toW2(q.col, q.row, sliceAt(q.col, q.row), rise), dc = p.color(BC.ink); dc.setAlpha(255 * 0.7 * ballOn);
      p.stroke(dc); p.strokeWeight(Z.dropLine); p.line(b[0], b[1], b[2], g[0], g[1], g[2]);
      p.noStroke(); p.fill(dc); p.push(); p.translate(g[0], g[1] - 0.5, g[2]); p.rotateX(Math.PI / 2); p.ellipse(0, 0, Z.ballR * 1.6, Z.ballR * 1.6); p.pop();
    }
    p.noStroke(); const bc = p.color(BC.accent2); p.fill(bc); p.push(); p.translate(b[0], b[1] - Z.ballR, b[2]); p.sphere(Z.ballR * ballOn, 16, 12); p.pop();
  }
  p.pop();
  // flat furniture (SVG): the footnote, axis names, the step clock, the section inset
  const fop = seg(t, Z.riseAt1 - 1, Z.riseAt1) * (1 - seg(t, Z.ribAt - Z.xfade, Z.ribAt));
  K.tx('s2.fn', 'labels', 48, 422, 'GROUND: THE OTHER 65 HELD AT STEP 1,000 · HEIGHT: LOSS', { fam: 'mono', size: 14, fill: C.muted, op: fop, role: 'secondary', ls: 0.4 });
  const ax = (key, colf, rowf, txt) => { const v = LB.project(cv, 960, 540)(toW2(colf, rowf, 0, rise)); if (isFinite(v[0]) && v[1] < 430) K.tx(key, 'labels', v[0], v[1], txt, { fam: 'mono', size: 12, fill: C.muted, op: fop, role: 'chrome', anchor: 'middle', ls: 1 }); };
  ax('s2.ax', COLS / 2, ROWS + 4, 'WEIGHT A →'); ax('s2.bx', -6, ROWS / 2, 'WEIGHT B →');
  const rop = seg(t, Z.runAt - 0.3, Z.runAt) * (1 - seg(t, Z.ribAt - Z.xfade, Z.ribAt));
  if (rop > 0) K.tx('s2.k', 'labels', 48, 52, 'STEP ' + K.fmtK(Math.floor(kf)), { fam: 'mono', size: 14, fill: C.ink, op: rop, role: 'secondary', ls: 1 });
  if (cutOn) inset(K, t, col, q);
}
function inset(K, t, col, q) {
  const op = ease(seg(t, Z.cutAt, Z.cutAt + 0.8)) * (1 - seg(t, Z.ribAt - Z.xfade, Z.ribAt)), W = Z.insetW, H = Z.insetH, x0 = 960 - 40 - W, y0 = 96;
  K.rc('ins.bg', 'labels', x0, y0, W, H, { fill: C.panel, fo: 0.88, stroke: C.line, w: 1, op });
  const gx = x0 + 14, gw = W - 28, gy = y0 + 30, gh = H - 46, X = (r) => gx + gw * r / (ROWS - 1), Yv = (v) => gy + gh * (1 - clamp((v - VMIN) / (VMAX - VMIN), 0, 1));
  let d = 'M' + X(0).toFixed(1) + ' ' + (gy + gh).toFixed(1);
  for (let r = 0; r < ROWS; r++) d += ' L' + X(r).toFixed(1) + ' ' + Yv(HG.M[r][col]).toFixed(1);
  d += ' L' + X(ROWS - 1).toFixed(1) + ' ' + (gy + gh).toFixed(1);
  K.path('ins.p', 'labels', d, { stroke: C.soft, w: 1.6, op });
  K.ln('ins.base', 'labels', gx, gy + gh, gx + gw, gy + gh, { stroke: C.muted, w: 0.8, op });
  K.E('ins.ball', 'circle', 'labels', { cx: X(q.row).toFixed(2), cy: Yv(q.loss).toFixed(2), r: 4, fill: C.soft, opacity: op.toFixed(3) });
  K.tx('ins.t', 'labels', x0 + 14, y0 + 20, 'SECTION THROUGH THE BALL', { fam: 'mono', size: 12, fill: C.muted, op, role: 'chrome', ls: 1 });
}

/* ── S3 · the network in depth (COUNT: the count and the answer) ── */
function scene3(p, K, t) {
  const ri = rideAt(t), st = S3[ri], t0 = RIDES[ri][0], lt = t - t0, pr = Object.assign({}, st.params), cv = cam3(t);
  const span = (Z.rideDur - 0 - Z.tail) / 2;
  pr.ribbonMix = clamp(Z.ribbonMix + Z.pulse * Math.exp(-Math.pow((lt - span) / (0.7 * span), 2)), 0, 1);   // the signal as light
  // the camera: both module keys equal to this frame's camera (pure of t)
  st.cams[0].camera(cv.eye[0], cv.eye[1], cv.eye[2], cv.look[0], cv.look[1], cv.look[2], 0, 1, 0);
  st.cams[1].camera(cv.eye[0], cv.eye[1], cv.eye[2], cv.look[0], cv.look[1], cv.look[2], 0, 1, 0);
  RB.draw(p, Math.max(0, lt), st, pr, TOK);
  const cam = st.work; cam.camera(cv.eye[0], cv.eye[1], cv.eye[2], cv.look[0], cv.look[1], cv.look[2], 0, 1, 0); cam.perspective(cv.fov, p.width / p.height, 8, 8000); p.setCamera(cam);
  p.resetMatrix(); p.resetShader();
  // 150 marks, one per flower: input slab -> hidden unit -> predicted species, then into the tray beside that slab
  const G = st.G, ms = Z.markSize, out = [0, 1, 2].map((s) => G.byId['o' + s]);
  const trays = [[], [], []]; for (let n = 0; n < N; n++) trays[st.routes[n][2]].push(n);
  const slot = {}; trays.forEach((list) => list.forEach((n, j) => (slot[n] = j)));
  const trayAt = (s, j) => { const o = out[s], c = j % Z.trayCols, r = Math.floor(j / Z.trayCols); return [o.x + o.w / 2 + Z.trayGap + c * ms * 1.6, o.yc - 1.5 * ms * 1.6 + r * ms * 1.6, o.z + Z.slabD / 2 + 1]; };
  const batches = { right: [[], [], []], wrong: [] }, halos = [];
  for (let n = 0; n < N; n++) {
    const [i, h, o] = st.routes[n], l1 = st.byPair['i' + i + '>h' + h], l2 = st.byPair['h' + h + '>o' + o];
    const d1 = 0.12 * span + S3.dep[n] * 0.35 * span, a1 = d1 + 0.5 * span, d2 = span + 0.12 * span + S3.dep[n] * 0.35 * span, a2 = d2 + 0.5 * span, a3 = a2 + 0.22 * span;
    if (lt < d1) continue;
    let w;
    if (lt < a1) w = onRib(l1, (lt - d1) / (a1 - d1), S3.lane[n]);
    else if (lt < d2) w = lerp3(onRib(l1, 1, S3.lane[n]), onRib(l2, 0, S3.lane[n]), (lt - a1) / (d2 - a1));
    else if (lt < a2) w = onRib(l2, (lt - d2) / (a2 - d2), S3.lane[n]);
    else w = lerp3(onRib(l2, 1, S3.lane[n]), trayAt(o, slot[n]), ease(clamp((lt - a2) / (a3 - a2), 0, 1)));
    const right = o === Y[n];
    (right ? batches.right[Y[n]] : batches.wrong).push(w); halos.push(w);
  }
  const quad = (c, s) => { p.vertex(c[0] - s, c[1] - s, c[2]); p.vertex(c[0] + s, c[1] - s, c[2]); p.vertex(c[0] + s, c[1] + s, c[2]); p.vertex(c[0] - s, c[1] - s, c[2]); p.vertex(c[0] + s, c[1] + s, c[2]); p.vertex(c[0] - s, c[1] + s, c[2]); };
  const batch = (list, col, s, dz) => { if (!list.length) return; p.noStroke(); p.fill(col); p.beginShape(p.TRIANGLES); for (const c of list) quad([c[0], c[1], c[2] + dz], s); p.endShape(); };
  for (let sp = 0; sp < 3; sp++) batch(batches.right[sp], p.color(roleHex(SPR[sp])), ms / 2, 0);
  batch(batches.wrong, p.color(BC.accent), ms * 0.62, 0.2);
  if (Z.halo > 0) { const hc = p.color(BC.ink); hc.setAlpha(255 * Z.halo); batch(halos, hc, ms * 1.25, -0.6); }
  if (batches.wrong.length) { const rc = p.color(BC.accent); p.noFill(); p.stroke(rc); p.strokeWeight(1.2); for (const c of batches.wrong) { p.push(); p.translate(c[0], c[1], c[2] + 0.4); p.rect(-ms * 1.1, -ms * 1.1, ms * 2.2, ms * 2.2); p.pop(); } }
  // flat furniture (SVG): slab names, per-slab readouts at the claimed checkpoints, the headline count
  const pj = LB.project(cv, 960, 540), op = seg(t, Z.ribAt, Z.ribAt + 0.6) * (1 - seg(t, Z.cloudAt - Z.xfade, Z.cloudAt));
  for (let i = 0; i < 4; i++) { const nd = G.byId['i' + i], v = pj([nd.x - nd.w / 2 - 8, nd.yc, nd.z]); K.tx('s3.in' + i, 'labels', v[0], v[1] + 5, INL[i], { fam: 'mono', size: 14, fill: C.muted, op, role: 'secondary', anchor: 'end', ls: 0.5 }); }
  const landed = lt >= 0.12 * span + 0.35 * span + span + 0.5 * span + 0.22 * span;   // the last mark is in its tray
  const kSlab = st.k === 10 || st.k === 1000;
  for (let sp = 0; sp < 3; sp++) {
    const right = st.routes.filter((r, n) => r[2] === sp && Y[n] === sp).length, o = out[sp];
    const v = pj([o.x + o.w / 2 + Z.trayGap + Z.trayCols * ms * 1.6 + 6, o.yc, o.z + Z.slabD / 2 + 1]);
    K.tx('s3.on' + sp, 'labels', v[0], v[1] + 5, SPN[sp], { fam: 'mono', size: 14, fill: SVGC[SPR[sp]], op, role: 'secondary', ls: 1 });
    if (kSlab && landed) K.tx('s3.or' + sp, 'labels', v[0] + SPN[sp].length * 14 * K.ADV.mono + 22, v[1] + 10, String(right), { fam: 'disp', size: 28, fill: SVGC[SPR[sp]], op, role: 'must-read' });
  }
  const done = landed ? ri : ri - 1;
  if (done >= 0) {
    const kk = S3[done].k, cnt = S3[done].routes.filter((r, n) => r[2] === Y[n]).length, hop = op * (done === ri ? ease(seg(lt, Z.rideDur - 0.25, Z.rideDur)) : 0.35);
    const hx = 48, hy = 128;
    K.tx('s3.hk', 'labels', hx, hy - 64, kk === 0 ? 'RANDOM WEIGHTS' : 'AFTER ' + K.fmtK(kk) + ' STEPS', { fam: 'mono', size: 14, fill: C.muted, op: Math.max(hop, 0.35 * op), role: 'secondary', ls: 1 });
    K.tx('s3.h', 'labels', hx, hy, String(cnt), { fam: 'disp', size: Z.headSize, fill: C.accent, op: Math.max(hop, 0.35 * op), role: 'must-read' });
    K.tx('s3.hl', 'labels', hx, hy + 30, 'LAND ON THE RIGHT NAME', { fam: 'mono', size: 14, fill: C.ink, op: Math.max(hop, 0.35 * op), role: 'secondary', ls: 1 });
    if (kk === 10 && done === ri) K.tx('s3.hr', 'labels', hx, hy + 66, 'OF 150 · 90 %', { fam: 'disp', size: 28, fill: C.ink, op: op * ease(seg(t, Z.ride10 + Z.rideDur + Z.subLag - 0.3, Z.ride10 + Z.rideDur + Z.subLag)), role: 'must-read' });
  }
  const uop = op;
  K.tx('s3.u', 'labels', 912, 52, '1 MARK = 1 FLOWER · RIBBON WIDTH = |WEIGHT|', { fam: 'mono', size: 12, fill: C.muted, op: uop, role: 'chrome', ls: 0.5, anchor: 'end' });
}
const lerp3 = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];
function onRib(l, s, lane) {
  const f = RB.frameAt(l.sp, s), hw = l.w / 2, hd = RB.depthOf(l, { shape: 'band', thick: Z.thick }) / 2, room = Math.max(0, hw - Z.markSize * 0.7);
  return [f.p[0] + f.w[0] * lane * room + f.n[0] * (hd + 0.9), f.p[1] + f.w[1] * lane * room + f.n[1] * (hd + 0.9), f.p[2] + f.w[2] * lane * room + f.n[2] * (hd + 0.9)];
}
})();
