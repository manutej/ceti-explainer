/* one-query / draft A · "the kitchen to the grid" · one median prompt as a mark beside a microwave-second ruler; a log zoom climbs
   through a day of prompts to a 100 MW site-day in tiles (a second tile tier); a hard cut to a plate of the world's grid where the
   same 415 TWh marks are re-stacked into four towers; a hard cut to a terrain of national demand, the camera lifting over it
   while a section is cut at Ireland and at the United States. Denominators in turn: per query, per site, per grid.
   Renderer webgl (kit2). One clock: render(t, state) draws frame t from t alone. Every digit is a claim value from film.json params
   (claims.json); the ladder's running counter n = round(10^L) is the module's own formula (G5c WARN). Words and digits are SVG
   (K.tx, roled); the crowd of marks is drawn on a 2-D graphics (scale-anchor's spiral + LOD, with a second tile tier added here)
   and composited flat; the plate, the 415 boxes and the terrain are 3-D. No Math.random / Date / performance. */
(function () {
'use strict';
const K = window.KIT, F = window.FILM, P = F.params, A = window.ARSENAL;
const SAm = A.patterns['scale-anchor'], HF = A.patterns['gl-heightfield'].api, RIGM = A.patterns['gl-camera-rig'].rig, LAB = A.patterns['gl-labels'];
const { seg, clamp, lerp, fmtK, C } = K;
const ACC2 = K.BRAND.color.accent2 || C.accent;
const Z = new Proxy(K.knobs, { get: (o, k) => { if (typeof k === 'string' && !(k in o)) throw new Error('one-query: no knob ' + k); return o[k]; } });
const ez = (u) => { u = clamp(u, 0, 1); return u * u * (3 - 2 * u); };
const eio = (u) => { u = clamp(u, 0, 1); return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
const fade = (t, a, b, c, d) => Math.min(seg(t, a, b), 1 - seg(t, c, d));      // up over [a,b], down over [c,d]
const T = (key, x, y, s, o) => { if ((o.op === undefined ? 1 : o.op) > 0.01) K.tx(key, 'labels', x, y, s, o); };
const fmt1 = (v) => v.toFixed(1);

/* ── the numbers the film draws, all from claims (film.json params) ── */
const MICRO = P.gemWh * 3600 / P.microW;                                   // 0.864: one query is this fraction of one microwave-second
const D = {                                                                 // derived claims, the formulas of claims.json
  microS: Math.round(100 * P.gemWh * 3600 / P.microW) / 100, bulbS: Math.round(P.gemWh * 3600 / P.bulbW),
  dayWh: Math.round(10 * P.promptsDay * P.gemWh) / 10, dayMicroS: Math.round(10 * P.promptsDay * P.gemWh * 3600 / P.microW) / 10,
  tileKwh: Math.round(P.tileQ * P.gemWh / 1000), siteDayGwh: P.siteMW * P.hoursDay / 1000, ieVsWorld: Math.round(P.iePct / P.worldPct),
  usDc: Math.round(P.usPctDc / 100 * P.worldTwh), cnDc: Math.round(P.cnPctDc / 100 * P.worldTwh), euDc: Math.round(P.euPctDc / 100 * P.worldTwh) };
D.restDc = P.worldTwh - D.usDc - D.cnDc - D.euDc;
D.siteDayQ = Math.round(D.siteDayGwh * 1e9 / P.gemWh);
const WN = P.worldTwh, WG = [D.usDc, D.cnDc, D.euDc, D.restDc];
if (D.siteDayQ !== 1e10 || D.tileKwh !== 24 || WG.some((v, i) => v !== [187, 104, 62, 62][i])) throw new Error('one-query: a derived claim disagrees with claims.json');
const GRID = Math.round(P.worldTwh / (P.worldPct / 100));                  // the world's electricity in TWh (back-solved, never printed)
const GS = [0, WG[0], WG[0] + WG[1], WG[0] + WG[1] + WG[2]];
const REGION = ['UNITED STATES', 'CHINA', 'EUROPE', 'REST OF WORLD'];
const PLACES = [['IE', 'IRELAND', P.iePct, P.ieYear], ['NL', 'NETHERLANDS', P.nlPct, P.ieaYear], ['US', 'UNITED STATES', P.usPct23, P.usYear],
  ['DE', 'GERMANY', P.dePct, P.ieaYear], ['UK', 'UNITED KINGDOM', P.ukPct, P.ieaYear], ['FR', 'FRANCE', P.frPct, P.ieaYear], ['WORLD', 'WORLD', P.worldPct, P.ieaYear]];

/* ── layout of the 2-D crowd panel (sheet units) ── */
const PS = Z.panelSize, PX = 480 - PS / 2, PY = Z.panelY, PCX = 480, PCY = PY + PS / 2, T0 = PS / 3;   // T0: the ruler, one microwave-second
const LP = { dwell: Z.dwell, move: Z.move, top: 5, ease: 'cubic', budget: Z.budget, tile: Z.tile, swapW: 0.2, lod: 'auto' };
const LADEND = Z.ladT0 + (LP.top + 1) * LP.dwell + LP.top * LP.move;
const PITCH5 = PS / (Math.pow(10, 2.5) + 2), R5 = Math.ceil((Math.sqrt(1e5) - 1) / 2), E1 = (2 * R5 + 1) * PITCH5;   // the full field's edge at 10^5
const S2 = Z.tileFill * T0;                                                // edge of the single tile at the start of the second tier
const SWAPF = S2 / E1;

/* ── world: the plate, the block of 415 marks, four towers ── */
const COLS = Z.plateCols, ROWS = Math.ceil(GRID / COLS), CELL = Z.cell, PW = COLS * CELL, PD = ROWS * CELL, BH = CELL * Z.boxFill;
const FT = Z.towerFoot, BC = Z.blockCols, BR = Math.ceil(WN / BC), BC0 = Math.floor((COLS - BC) / 2), BR0 = Math.floor((ROWS - BR) / 2);
const MK = [], TWH = [0, 0, 0, 0];
for (let i = 0; i < WN; i++) {
  const g = i < GS[1] ? 0 : i < GS[2] ? 1 : i < GS[3] ? 2 : 3, j = i - GS[g], bc = i % BC, br = Math.floor(i / BC), per = FT * FT, layer = Math.floor(j / per), cc = j % per;
  const tx = (g - 1.5) * Z.towerGap;
  MK.push({ i, g, sx: (BC0 + bc + 0.5 - COLS / 2) * CELL, sz: (BR0 + br + 0.5 - ROWS / 2) * CELL,
    ex: tx + ((cc % FT) - (FT - 1) / 2) * CELL, ez: (Math.floor(cc / FT) - (FT - 1) / 2) * CELL, ey: (layer + 0.5) * CELL });
  TWH[g] = Math.max(TWH[g], (layer + 1) * CELL);
}
const TOWX = [0, 1, 2, 3].map((g) => (g - 1.5) * Z.towerGap);
const RIGS = window.ONEQ_RIGS;
const REG0 = K.knob('cwRiseT0', 82), REG1 = K.knob('cwRiseT1', 87.4);      // the regroup rides the camera's quarter-turn: one source
const SCENE0 = { points: [[0, 0, 0]] };
const RW = RIGM.compile(RIGM.fromKnobs(RIGS.world, (n, v) => K.knob(n, v), SCENE0, { prefix: 'cw' }), SCENE0);
const RT = RIGM.compile(RIGM.fromKnobs(RIGS.terrain, (n, v) => K.knob(n, v), SCENE0, { prefix: 'ct' }), SCENE0);
const camOf = (rig) => (tt) => { const q = RIGM.at(rig, tt); return { eye: q.eye, look: q.center, up: q.up, fov: q.fov }; };
const LABCAM_W = camOf(RW), LABCAM_T = camOf(RT);

/* ── terrain: seven mesas, 40 x 25, 4 columns per place and a gap column (data/terrain-matrix.json, built here from claims) ── */
const TC = 40, TR = 25, TXW = Z.terrSize, TCELL = TXW / (TC - 1), TZD = TCELL * (TR - 1), TX0 = -TXW / 2, TZ0 = -TZD / 2;
const VMAX = Z.terrMax, ZS = Z.terrZ;                                      // ZS: the terrain's depth scale (the rows are shallower than the columns are wide)
const TMAT = []; for (let r = 0; r < TR; r++) { const row = new Array(TC).fill(0); PLACES.forEach((pl, k) => { for (let c = 2 + 5 * k; c <= 5 + 5 * k; c++) row[c] = pl[2]; }); TMAT.push(row); }
const placeCol = (k) => 2 + 5 * k + 1;                                      // the column a cut at place k snaps to
const colX = (c) => TX0 + c * TCELL;
const hOf = (v) => Z.terrH * v / VMAX;
const HFP = { size: TXW, hscale: Z.terrH, slab: Z.terrSlab, wire: false, gridW: 1.1, contours: Z.contours, contourW: 1.1, contourRole: 'chalk', ramp: ['panel', 'muted', 'accent'],
  amb: Z.terrAmb, key: Z.terrKey, rim: 0.1, cutMode: 'section', cutW: 2.4 };

/* ── labels: measure with the pack's advances; one anchors array per phase, the same object every frame (the solver's memo key) ── */
const MEASURE = (s, z, fam) => String(s).length * z * (fam === 'disp' ? 0.5 : 0.612);
const LOPT = (reserve) => ({ w: K.W, h: K.H, fps: 30, hold: Z.labHold, leader: Z.labLeader, margin: 14, pad: 3, sticky: 'window', occlusion: false, maxShown: Z.labMax,
  measure: MEASURE, measureKey: 'oq-a', reserve });
const RES_W = [[0, 436, 960, 540], [20, 46, 600, 104], [640, 60, 960, 170]];
const RES_T = [[0, 436, 960, 540], [20, 46, 620, 104]];
const AN = {
  blk: [{ id: 'blk', x: 0, y: -BH, z: -BR * CELL / 2, text: fmt1(P.worldPct) + ' %', sub: 'OF THE WORLD\'S ELECTRICITY', role: 'result', priority: 1, color: 'accent' }],
  cnt: [0, 1, 2, 3].map((g) => ({ id: 'c' + g, x: TOWX[g], y: -TWH[g] - 2, z: 0, text: fmtK(WG[g]), sub: REGION[g], role: 'result', priority: 4 - g, color: 'ink' })),
  pct: [0, 1, 2].map((g) => ({ id: 'p' + g, x: TOWX[g], y: -TWH[g] - 2, z: 0, text: [P.usPctDc, P.cnPctDc, P.euPctDc][g] + ' %', sub: fmtK(WG[g]) + ' TWh · ' + REGION[g], role: 'result', priority: 4 - g, color: 'accent' })),
  names: PLACES.map((pl, k) => ({ id: 'n' + k, x: colX(2 + 5 * k + 1.5), y: 0, z: (TZ0 + (TR - 1) * TCELL) * ZS + 8, text: pl[1], sub: String(pl[3]), role: 'secondary', priority: 10 - k, color: 'ink' })),
};
const CNTS = [0, 1, 2, 3].map((k) => AN.cnt.slice(0, k + 1));                        // counts, one tower at a time (stable arrays: the solver memoises on them)
const PCTS = [0, 1, 2].map((k) => AN.pct.slice(0, k + 1).concat(AN.cnt.slice(k + 1))); // shares replace counts tower by tower; the last count stays
const NAMES_FROM = PLACES.map((pl, k) => AN.names.slice(k));                        // names of the places not yet cut away (stable arrays)
const PINSET = {};                                                                    // names + the pin at the cut, one fixed array per (step, first place shown)
function pinSet(step, first, txt, sub, place) {
  const key = step + '.' + first; if (PINSET[key]) return PINSET[key];
  if (!txt) return (PINSET[key] = NAMES_FROM[first]);
  const col = placeCol(place), h = hOf(TMAT[0][col]);
  return (PINSET[key] = [{ id: 'cutp' + step, x: TX0 + col * TCELL, y: -h - 2, z: 0, text: txt, sub, role: 'result', priority: 100, color: 'accent' }].concat(NAMES_FROM[first]));
}

function pins(t, set, key, cam, opt, op) {
  if (op <= 0.01) return null;
  const sol = LAB.solve(t, cam, set, opt);
  for (const q of sol.placements) {
    const k = 'pin.' + key + '.' + q.id, col = q.color === 'accent' ? C.accent : q.color === 'muted' ? C.muted : C.ink, anc = q.align === 'right' ? 'end' : q.align === 'center' ? 'middle' : 'start';
    K.rc(k + '.b', 'labels', q.box[0], q.box[1], q.box[2] - q.box[0], q.box[3] - q.box[1], { fill: C.paper, fo: 0.74, op });
    K.ln(k + '.l', 'labels', q.lead[0], q.lead[1], q.lead[2], q.lead[3], { stroke: col, w: 1.2, op });
    K.E(k + '.d', 'circle', 'labels', { cx: q.ax.toFixed(1), cy: q.ay.toFixed(1), r: 2.8, fill: col, opacity: op.toFixed(3) });
    K.tx(k + '.t', 'labels', q.tx, q.ty, q.text, { fam: q.fam, size: q.size, anchor: anc, fill: col, role: q.dataRole, op });
    if (q.sub) K.tx(k + '.s', 'labels', q.tx, q.sy, q.sub, { fam: q.subFam, size: q.subSize, anchor: anc, fill: C.muted, role: q.subDataRole, op });
  }
  return sol;
}

/* ── icons: plain strokes (the anchors are comparisons, never measurements) ── */
function microwave(key, cx, cy, s, op) {
  const o = { stroke: ACC2, w: 1.8, op }, h = (v) => v * s;
  K.rc(key + 'a', 'marks', cx - h(42), cy - h(28), h(84), h(56), Object.assign({ rx: h(6) }, o));
  K.rc(key + 'b', 'marks', cx - h(34), cy - h(20), h(42), h(40), Object.assign({ rx: h(3) }, o));
  K.ln(key + 'c', 'marks', cx + h(18), cy - h(22), cx + h(18), cy + h(22), o);
  K.E(key + 'd', 'circle', 'marks', { cx: (cx + h(30)).toFixed(1), cy: (cy - h(12)).toFixed(1), r: h(4).toFixed(1), fill: 'none', stroke: ACC2, 'stroke-width': 1.5, opacity: op.toFixed(3) });
  K.E(key + 'e', 'circle', 'marks', { cx: (cx + h(30)).toFixed(1), cy: (cy + h(2)).toFixed(1), r: h(4).toFixed(1), fill: 'none', stroke: ACC2, 'stroke-width': 1.5, opacity: op.toFixed(3) });
  K.rc(key + 'f', 'marks', cx + h(23), cy + h(12), h(14), h(7), Object.assign({ rx: 1 }, o));
}
function bulb(key, cx, cy, s, op) {
  const o = { stroke: ACC2, w: 1.8, op }, h = (v) => v * s;
  K.E(key + 'a', 'circle', 'marks', { cx: cx.toFixed(1), cy: (cy - h(8)).toFixed(1), r: h(22).toFixed(1), fill: 'none', stroke: ACC2, 'stroke-width': 1.8, opacity: op.toFixed(3) });
  K.ln(key + 'b', 'marks', cx - h(9), cy + h(12), cx - h(9), cy + h(22), o);
  K.ln(key + 'c', 'marks', cx + h(9), cy + h(12), cx + h(9), cy + h(22), o);
  K.rc(key + 'd', 'marks', cx - h(9), cy + h(22), h(18), h(6), o);
  K.rc(key + 'e', 'marks', cx - h(5), cy + h(28), h(10), h(4), o);
  K.path(key + 'f', 'marks', 'M' + (cx - h(6)).toFixed(1) + ' ' + (cy + h(12)).toFixed(1) + ' L' + (cx - h(6)).toFixed(1) + ' ' + (cy - h(2)).toFixed(1) + ' L' + cx.toFixed(1) + ' ' + (cy + h(4)).toFixed(1) +
    ' L' + (cx + h(6)).toFixed(1) + ' ' + (cy - h(2)).toFixed(1) + ' L' + (cx + h(6)).toFixed(1) + ' ' + (cy + h(12)).toFixed(1), o);
}

/* ═══════════ the 2-D crowd (scale-anchor's spiral and LOD; a second tile tier) ═══════════ */
function panelState(t) {
  const sH = lerp(Z.hookScale0, 1, eio(seg(t, Z.pushT0, Z.pushT1)));
  if (t < Z.ladT0) return { tier: 1, L: 0, n: 1, pitch: T0 * sH, hook: sH };
  if (t < Z.swapT0) { const L = SAm.level(t - Z.ladT0, LP); return { tier: 1, L, n: SAm.countOf(L), pitch: PS / (Math.pow(10, L / 2) + 2), hook: 1 }; }
  if (t < Z.swapT0 + Z.swapDur) return { tier: 'swap', u: eio(seg(t, Z.swapT0, Z.swapT0 + Z.swapDur)), L: 5, n: 1e5, pitch: PITCH5, hook: 1 };
  const L2 = 5 * eio(seg(t, Z.t2T0, Z.t2T1));
  return { tier: 2, L: L2, n: SAm.countOf(L2), pitch: PS / (Math.pow(10, L2 / 2) + 2), hook: 1 };
}
/* n marks of a square spiral at `pitch`: individual squares of `side` up to the budget, s x s tiles past it (cross-faded over swapW decades) */
function field(ctx, S, n, pitch, side, L, color, alpha, accent) {
  const ta = SAm.lodAlpha(L, LP), ma = 1 - ta, ox = PS / 2, oy = PS / 2, s = Math.max(2, LP.tile | 0), f = s * s, spi = SAm.spiralIdx;
  if (ma > 0.001) {
    const pInk = new Path2D(), h = side / 2;
    for (let k = accent ? 1 : 0; k < n; k++) pInk.rect(ox + S.cx[k] * pitch - h, oy + S.cy[k] * pitch - h, side, side);
    ctx.globalAlpha = ma * alpha; ctx.fillStyle = color; ctx.fill(pInk);
  }
  if (ta > 0.001) {
    const ho = s >> 1, r = Math.ceil((Math.sqrt(n) - 1) / 2), a0 = Math.floor((-r + ho) / s), a1 = Math.floor((r + ho) / s), gp = clamp(0.08 * pitch * s, 0.35, 1.6), tw = s * pitch;
    const pFull = new Path2D(), pCell = new Path2D();
    for (let b = a0; b <= a1; b++) for (let a = a0; a <= a1; a++) {
      const i0 = a * s - ho, j0 = b * s - ho; let cnt = 0;
      for (let dj = 0; dj < s; dj++) for (let di = 0; di < s; di++) if (spi(i0 + di, j0 + dj) < n) cnt++;
      if (!cnt) continue;
      const x = ox + (i0 - 0.5) * pitch, y = oy + (j0 - 0.5) * pitch;
      if (cnt === f) pFull.rect(x + gp, y + gp, tw - 2 * gp, tw - 2 * gp);
      else for (let dj = 0; dj < s; dj++) for (let di = 0; di < s; di++) if (spi(i0 + di, j0 + dj) < n) pCell.rect(x + di * pitch + gp, y + dj * pitch + gp, pitch - 2 * gp, pitch - 2 * gp);
    }
    ctx.globalAlpha = ta * alpha * 0.82; ctx.fillStyle = color; ctx.fill(pFull); ctx.globalAlpha = ta * alpha; ctx.fill(pCell);
  }
  ctx.globalAlpha = 1;
}
function drawPanel(t) {
  const g = ST.g, ctx = g.drawingContext, st = panelState(t), S = ST.sa;
  g.clear(); ctx.save();
  const pa = seg(t, Z.ladT0 - 0.8, Z.ladT0 - 0.1);
  if (pa > 0.01) {
    ctx.globalAlpha = pa * 0.6; ctx.fillStyle = C.panel; ctx.fillRect(0, 0, PS, PS);
    ctx.globalAlpha = pa; ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.strokeRect(0.5, 0.5, PS - 1, PS - 1);
  }
  ctx.beginPath(); ctx.rect(0, 0, PS, PS); ctx.clip();
  const cx0 = PS / 2, cy0 = PS / 2;
  if (st.tier === 1) {
    const side = MICRO * st.pitch;
    if (t < Z.ladT0) {                                                   // the hook: one lit mark, a slow breath of light
      const lit = seg(t, Z.litT0, Z.litT1), rad = side * (Z.glowR + 0.1 * Math.sin(t * 1.3));
      const gr = ctx.createRadialGradient(cx0, cy0, side * 0.2, cx0, cy0, rad);
      gr.addColorStop(0, K.rgba(C.accent, 0.34 * lit)); gr.addColorStop(1, K.rgba(C.accent, 0));
      ctx.fillStyle = gr; ctx.fillRect(0, 0, PS, PS);
      ctx.globalAlpha = lit; ctx.fillStyle = C.accent; ctx.fillRect(cx0 - side / 2, cy0 - side / 2, side, side); ctx.globalAlpha = 1;
    } else {
      field(ctx, S, st.n, st.pitch, side, st.L, C.ink, 1, true);
      ctx.fillStyle = C.accent; ctx.fillRect(cx0 - Math.max(side, 1.2) / 2, cy0 - Math.max(side, 1.2) / 2, Math.max(side, 1.2), Math.max(side, 1.2));
      if (st.pitch < 12) { ctx.strokeStyle = C.accent; ctx.lineWidth = 1.2; ctx.globalAlpha = 0.9; ctx.beginPath(); ctx.arc(cx0, cy0, 7 + 2 * Math.sin(t * 2), 0, 6.2832); ctx.stroke(); ctx.globalAlpha = 1; }
    }
  } else if (st.tier === 'swap') {                                       // the whole 10^5 field shrinks into ONE tile (the swap itself is the move)
    const u = st.u, sc = lerp(1, SWAPF, u), tileSide = E1 * sc;
    ctx.globalAlpha = 1 - u; field(ctx, S, 1e5, PITCH5 * sc, MICRO * PITCH5 * sc, 5, C.ink, 1, false); ctx.globalAlpha = 1;
    ctx.globalAlpha = u; ctx.fillStyle = C.accent; ctx.fillRect(cx0 - tileSide / 2, cy0 - tileSide / 2, tileSide, tileSide); ctx.globalAlpha = 1;
  } else {                                                               // tier 2: one mark = one tile of 100,000 queries
    const side = Z.tileFill * st.pitch;
    field(ctx, S, st.n, st.pitch, side, st.L, C.ink, 0.74, true);
    ctx.fillStyle = C.accent; ctx.fillRect(cx0 - side / 2, cy0 - side / 2, Math.max(side, 1.2), Math.max(side, 1.2));
  }
  ctx.restore();
  return st;
}

/* ═══════════ scene 1: HOOK, CASE a, the ladder and the tile swap (2-D crowd + SVG) ═══════════ */
function scene2D(p, t) {
  const st = drawPanel(t);
  K.flat((q) => { q.image(ST.g, PX, PY, PS, PS); });
  const mid = PCX, side = MICRO * T0;
  /* HOOK: the belief, twice, over the same still mark */
  if (t < Z.hookEnd + 0.8) {
    const w1 = fade(t, 0.6, 1.3, 4.0, 4.6), w2 = fade(t, 4.8, 5.5, 8.0, 8.7);
        T('hk.a', mid, Z.hookY, 'TOO MUCH', { fam: 'disp', size: Z.hookSize, anchor: 'middle', fill: C.ink, role: 'must-read', op: w1, ls: '0.04em' });
    T('hk.b', mid, Z.hookY, 'ALMOST NONE', { fam: 'disp', size: Z.hookSize, anchor: 'middle', fill: C.ink, role: 'must-read', op: w2, ls: '0.04em' });
  }
  /* CASE a: one query, one mark; 0.24 Wh above it; the microwave-second ruler below it (constant length, drawn over the crowd later) */
  const rl = seg(t, Z.ruler0, Z.ruler0 + 0.8) * (1 - seg(t, Z.swapT0 + 0.2, Z.swapT0 + 0.9));
  const ry = PCY + Z.rulerDy, rx0 = mid - T0 / 2;
  if (rl > 0.01) {
    const lab = 'ONE SECOND OF MICROWAVE';
    K.rc('rul.bg', 'marks', mid - 108, ry - 16, 216, 50, { fill: C.paper, fo: 0.84, op: rl * seg(t, Z.ladT0 - 0.5, Z.ladT0 + 0.3) });
    K.ln('rul.l', 'marks', rx0, ry, rx0 + T0, ry, { stroke: ACC2, w: 3, op: rl });
    for (let q = 0; q <= 8; q++) K.ln('rul.t' + q, 'marks', rx0 + T0 * q / 8, ry, rx0 + T0 * q / 8, ry - (q === 0 || q === 8 ? 11 : q === 4 ? 8 : 5), { stroke: ACC2, w: 1.4, op: rl });
    const mo = seg(t, Z.micro0, Z.micro0 + 0.9) * (1 - seg(t, Z.ladT0 + 0.2, Z.ladT0 + 1.0));
    if (mo > 0.01) K.ln('rul.f', 'marks', rx0, ry + 6, rx0 + MICRO * T0, ry + 6, { stroke: C.accent, w: 5, op: mo });
    T('rul.t', mid, ry + 26, lab, { fam: 'mono', size: 14, anchor: 'middle', fill: C.muted, role: 'secondary', op: rl });
  }
  const q0 = fade(t, Z.q0, Z.q0 + 0.7, Z.ladT0 - 0.4, Z.ladT0 + 0.4);
  if (q0 > 0.01) {
    T('q0.n', mid, PCY - side / 2 - 40, P.gemWh + ' Wh', { fam: 'disp', size: Z.q0Size, anchor: 'middle', fill: C.accent, role: 'must-read', op: q0 });
    T('q0.s', mid, PCY - side / 2 - 18, 'A MEDIAN TEXT PROMPT · GOOGLE ' + P.gemYear, { fam: 'mono', size: 14, anchor: 'middle', fill: C.muted, role: 'secondary', op: q0 * seg(t, Z.q0 + 0.5, Z.q0 + 1.1) });
  }
  /* the legend (left column): one query, in the kitchen's units, kept through the ladder */
  const lg = (t0, t1) => seg(t, t0, t0 + 0.8) * (1 - seg(t, Z.swapT0 - 0.4, Z.swapT0 + 0.3));
  const hdr = lg(Z.micro0, 0);
  if (hdr > 0.01) T('lg.h', 40, 76, 'ONE QUERY IS', { fam: 'mono', size: 14, fill: C.muted, role: 'secondary', op: hdr });
  const lm = lg(Z.micro0, 0);
  if (lm > 0.01) {
    microwave('lg.mw', 64, 122, 0.7, lm);
    T('lg.m1', 112, 130, D.microS + ' s', { fam: 'disp', size: 30, fill: C.ink, role: 'must-read', op: lm });
    T('lg.m2', 112, 152, 'OF A ' + fmtK(P.microW) + ' W MICROWAVE', { fam: 'mono', size: 14, fill: C.muted, role: 'secondary', op: lm });
  }
  const lb2 = lg(Z.bulb0, 0);
  if (lb2 > 0.01) {
    bulb('lg.bu', 64, 214, 0.7, lb2);
    T('lg.b1', 112, 222, D.bulbS + ' s', { fam: 'disp', size: 30, fill: C.ink, role: 'must-read', op: lb2 });
    T('lg.b2', 112, 244, 'OF A ' + P.bulbW + ' W BULB', { fam: 'mono', size: 14, fill: C.muted, role: 'secondary', op: lb2 });
  }
  /* the ladder: pips (no digits), the running count, the energy readouts at the rungs that are claims */
  const ld = seg(t, Z.ladT0 - 0.6, Z.ladT0 + 0.2) * (1 - seg(t, Z.swapT0, Z.swapT0 + 0.5));
  const L = st.tier === 1 ? st.L : 5;
  if (ld > 0.01) {
    for (let k = 0; k <= 5; k++) {
      const y = PY + PS - k * PS / 5, on = L >= k - 1e-6;
      K.E('pip' + k, 'circle', 'marks', { cx: PX + PS + 16, cy: y.toFixed(1), r: 4, fill: on ? C.accent : 'none', stroke: on ? C.accent : C.muted, 'stroke-width': 1.2, opacity: ld.toFixed(3) });
    }
    K.ln('pip.l', 'marks', PX + PS + 16, PY + PS, PX + PS + 16, PY + PS - L * PS / 5, { stroke: C.accent, w: 2, op: ld });
    T('cnt.n', 928, 118, fmtK(st.n), { fam: 'disp', size: Z.cntSize, anchor: 'end', fill: C.ink, role: 'must-read', op: ld });
    T('cnt.s', 928, 142, 'QUERIES · ONE MARK EACH', { fam: 'mono', size: 14, anchor: 'end', fill: C.muted, role: 'secondary', op: ld });
    const r1 = Z.ladT0 + (LP.dwell + LP.move), r5 = Z.ladT0 + 5 * (LP.dwell + LP.move);
    const e1 = fade(t, r1 + Z.rungLag, r1 + Z.rungLag + 0.5, r1 + LP.dwell, r1 + LP.dwell + 0.3) * ld;
    const e5 = seg(t, r5 + Z.rungLag, r5 + Z.rungLag + 0.5) * (1 - seg(t, Z.siteAt - 0.2, Z.siteAt + 0.4)) * ld;
    if (e1 > 0.01) {
      T('en1.n', 928, 214, fmt1(D.dayWh) + ' Wh', { fam: 'disp', size: Z.enSize, anchor: 'end', fill: C.accent, role: 'must-read', op: e1 });
      T('en1.s', 928, 238, 'A DAY · ' + D.dayMicroS + ' s OF MICROWAVE', { fam: 'mono', size: 14, anchor: 'end', fill: C.muted, role: 'secondary', op: e1 });
    }
    if (e5 > 0.01) {
      T('en5.n', 928, 214, D.tileKwh + ' kWh', { fam: 'disp', size: Z.enSize, anchor: 'end', fill: C.accent, role: 'must-read', op: e5 });
      T('en5.s', 928, 238, fmtK(P.tileQ) + ' QUERIES', { fam: 'mono', size: 14, anchor: 'end', fill: C.muted, role: 'secondary', op: e5 });
    }
  }
  /* the swap and the second tier: one mark = one tile of 100,000 queries; a 100 MW site's day is 100,000 tiles */
  const sw = seg(t, Z.swapT0 + 0.5, Z.swapT0 + 1.2);
  if (st.tier !== 1 && sw > 0.01) {
    const rep = 1 - seg(t, Z.worldT0 - 0.1, Z.worldT0);
    T('t2.k', 928, 118, st.tier === 2 ? fmtK(st.n) : fmtK(1), { fam: 'disp', size: Z.cntSize, anchor: 'end', fill: C.ink, role: 'must-read', op: sw * rep });
    T('t2.s', 928, 142, 'TILES OF ' + fmtK(P.tileQ) + ' QUERIES', { fam: 'mono', size: 14, anchor: 'end', fill: C.muted, role: 'secondary', op: sw * rep });
    const so = seg(t, Z.siteAt, Z.siteAt + 0.6) * rep;
    T('t2.gwh', 928, 214, fmt1(D.siteDayGwh) + ' GWh', { fam: 'disp', size: Z.enSize, anchor: 'end', fill: C.accent, role: 'must-read', op: so });
    T('t2.gwhs', 928, 238, P.siteMW + ' MW SITE · ' + P.hoursDay + ' HOURS', { fam: 'mono', size: 14, anchor: 'end', fill: C.muted, role: 'secondary', op: so });
    const bo = seg(t, Z.billionAt, Z.billionAt + 0.6) * rep;
    T('t2.bil', 928, 296, D.siteDayQ / 1e9 + ' billion', { fam: 'disp', size: Z.enSize, anchor: 'end', fill: C.ink, role: 'must-read', op: bo });
    T('t2.bils', 928, 320, 'QUERIES IN ONE DAY', { fam: 'mono', size: 14, anchor: 'end', fill: C.muted, role: 'secondary', op: bo });
  }
}

/* ═══════════ scene 2: the world's grid, 415 marks, four towers ═══════════ */
function sceneWorld(p, t) {
  const q = RIGM.at(RW, t), cam = ST.cam;
  RIGM.apply(p, cam, q, RW); p.setCamera(cam); p.noLights();
  p.push(); p.rotateX(Math.PI / 2); p.noStroke(); p.texture(ST.plate); p.plane(PW, PD); p.pop();
  p.ambientLight(Z.ambient, Z.ambient, Z.ambient); p.directionalLight(Z.keyLight, Z.keyLight, Z.keyLight, -0.35, 0.8, -0.6);
  p.noStroke(); p.fill(C.accent);
  let landed = 0;
  const dur = (REG1 - REG0) * (1 - Z.regStagger);
  for (let i = 0; i < WN; i++) {
    const m = MK[i], ta = Z.cinT0 + (Z.cinT1 - Z.cinT0) * i / (WN - 1), gr = ez((t - ta) / Z.cinGrow);
    if (gr <= 0) continue;
    if (t >= ta + Z.cinGrow) landed++;
    const u = eio((t - REG0 - (i / (WN - 1)) * Z.regStagger * (REG1 - REG0)) / dur), h = BH * gr;
    const x = lerp(m.sx, m.ex, u), z = lerp(m.sz, m.ez, u), y = lerp(-h / 2, -m.ey, u) - Z.regLift * Math.sin(Math.PI * u);
    p.push(); p.translate(x, y, z); p.box(BH, h, BH); p.pop();
  }
  /* SVG: legend, running count, the pins (hard cuts, never cross-faded) */
  const lgo = seg(t, Z.wLeg0, Z.wLeg0 + 0.6), lg2 = lgo * (1 - seg(t, REG0 - 0.3, REG0));
  K.rc('w.lb', 'marks', 30, 48, 466, 48 - 22 * (1 - lg2) , { fill: C.paper, fo: 0.8, op: lgo });
  T('w.l1', 40, 66, 'ONE MARK = ONE TWh OF DATA-CENTRE ELECTRICITY, ' + P.ieaYear, { fam: 'mono', size: 14, fill: C.ink, role: 'secondary', op: lgo });
  T('w.l2', 40, 88, 'GREY = THE REST OF THE WORLD\'S GRID', { fam: 'mono', size: 14, fill: C.muted, role: 'secondary', op: lg2 });
  const k = clamp(Math.floor((t - Z.cinT0) / (Z.cinT1 - Z.cinT0) * WN) + 1, 0, WN);
  if (t < REG0 - 0.01 && t >= Z.cinT0) {
    T('w.cn', 928, 118, fmtK(t >= Z.cinT1 + 0.4 ? WN : k), { fam: 'disp', size: Z.cntSize, anchor: 'end', fill: C.ink, role: 'must-read', op: seg(t, Z.cinT0, Z.cinT0 + 0.5) });
    T('w.cs', 928, 142, 'TWh · DATA CENTRES, ALL KINDS', { fam: 'mono', size: 14, anchor: 'end', fill: C.muted, role: 'secondary', op: seg(t, Z.cinT1, Z.cinT1 + 0.8) });
  }
  const opt = LOPT(RES_W);
  if (t >= Z.pctAt && t < REG0) pins(t, AN.blk, 'blk', LABCAM_W, opt, 1);
  if (t >= Z.towT0 && t < Z.pctRegAt) pins(t, CNTS[clamp(Math.floor((t - Z.towT0) / Z.towStep), 0, 3)], 'cnt', LABCAM_W, opt, 1);
  if (t >= Z.pctRegAt) pins(t, PCTS[clamp(Math.floor((t - Z.pctRegAt) / Z.towStep), 0, 2)], 'pct', LABCAM_W, opt, 1);
  const ck = seg(t, Z.checkAt, Z.checkAt + 0.6);
  T('w.ck', 40, 412, WG.join(' + ') + ' = ' + P.worldTwh + ' TWh · SAME MARKS', { fam: 'mono', size: 14, fill: C.muted, role: 'secondary', op: ck });
}

/* ═══════════ scene 3: the terrain of national demand, a section cut ═══════════ */
function cutState(t) {
  const a = ez(seg(t, Z.cutIeT0, Z.cutIeT1)), b = ez(seg(t, Z.cutUsT0, Z.cutUsT1));
  if (t < Z.cutIeT0) return null;
  const c0 = Z.cutStartCol, ie = placeCol(0), us = placeCol(2);
  const col = Math.round(t < Z.cutUsT0 ? lerp(c0, ie, a) : lerp(ie, us, b));
  return { col, x: ST.hf.x0 + col * ST.hf.cell, prof: TMAT.map((r) => r[col]), pk: 0 };
}
function sceneTerrain(p, t) {
  const q = RIGM.at(RT, t), cam = ST.cam, hf = ST.hf;
  RIGM.apply(p, cam, q, RT); p.setCamera(cam); p.noLights();
  const rows = Math.max(1, Math.round(TR * ez(seg(t, Z.terrT0, Z.terrT0 + Z.revealDur))));
  const revZ = rows >= TR ? 1e6 : hf.z0 + (rows - 0.5) * hf.cell, cut = cutState(t);
  p.push(); p.scale(1, 1, ZS); HF.terrain(p, hf, ST.tk, HFP, cut, revZ); if (cut) HF.section3d(p, hf, ST.tk, HFP, cut, rows); p.pop();
  if (t >= Z.dimT0) K.flat((qq) => { const c = qq.color(C.paper); c.setAlpha(255 * Z.dim * seg(t, Z.dimT0, Z.dimT0 + 1) * (1 - seg(t, Z.endFade + 0.3, Z.endFade + 0.5))); qq.noStroke(); qq.fill(c); qq.rect(-2, -2, 964, 544); });
  /* header, names, the pins at the cut */
  const ho = seg(t, Z.terrT0 + Z.revealDur, Z.terrT0 + Z.revealDur + 0.6) * (1 - seg(t, Z.dimT0 - 0.9, Z.dimT0 - 0.3));
  T('t.h1', 40, 66, 'HEIGHT = A PLACE\'S DATA-CENTRE SHARE OF ITS OWN GRID', { fam: 'mono', size: 14, fill: C.ink, role: 'secondary', op: ho });
  T('t.h2', 40, 88, 'THE YEAR DIFFERS BY PLACE: PRINTED UNDER EACH NAME', { fam: 'mono', size: 14, fill: C.muted, role: 'secondary', op: ho });
  const opt = LOPT(RES_T);
  const endF = 1 - seg(t, Z.endFade, Z.endFade + 0.5);
  if (t >= Z.dimT0) {
    const mo = seg(t, Z.monQ0, Z.monQ0 + 0.8) * endF;
    T('m.q1', 480, Z.monY, 'Per what?', { fam: 'disp', size: Z.monSize, anchor: 'middle', fill: C.ink, role: 'must-read', op: mo });
    T('m.q2', 480, Z.monY + 56, 'Per query, per site, or per grid?', { fam: 'disp', size: Z.monSize2, anchor: 'middle', fill: C.accent, role: 'must-read', op: seg(t, Z.monQ0 + 1.2, Z.monQ0 + 2.0) * endF });
    const ho2 = seg(t, Z.honestAt, Z.honestAt + 0.8) * endF;
    F.honestLines.forEach((s, i) => T('m.h' + i, 480, Z.honestY + i * 24, s, { fam: 'mono', size: Z.honestSize, anchor: 'middle', fill: C.soft, role: 'secondary', op: ho2 }));
  } else if (t >= Z.namesAt) {
    /* names and the cut's pin in one solve: one result at a time, each new number after the previous had its hold; names of places already cut away drop out */
    const first = cut ? Math.max(0, PLACES.findIndex((pl, k) => 5 + 5 * k >= cut.col)) : 0;
    let step = 'n', txt = null, sub = null, place = 0;
    if (t >= Z.ieGwhAt && t < Z.cutUsT0 - 1.0) {
      place = 0;
      if (t < Z.iePctAt) { step = 'ie0'; txt = fmtK(P.ieGwh) + ' GWh'; sub = 'DATA CENTRES, METERED'; }
      else if (t < Z.ieTimesAt) { step = 'ie1'; txt = P.iePct + ' %'; sub = 'OF ITS GRID · ' + fmtK(P.ieGwh) + ' GWh'; }
      else { step = 'ie2'; txt = D.ieVsWorld + ' times'; sub = 'THE WORLD\'S ' + fmt1(P.worldPct) + ' %'; }
    } else if (t >= Z.usTwhAt) {
      place = 2;
      if (t < Z.usPctAt) { step = 'us0'; txt = fmtK(P.usTwh23) + ' TWh'; sub = 'DATA CENTRES, NO CRYPTO'; }
      else if (t < Z.usHalfAt) { step = 'us1'; txt = fmt1(P.usPct23) + ' %'; sub = 'OF ITS GRID · ' + fmtK(P.usTwh23) + ' TWh'; }
      else { step = 'us2'; txt = 'about half'; sub = 'OF ' + P.growthYear + '\'S US DEMAND GROWTH'; }
    }
    pins(t, pinSet(step, first, txt, sub, place), 'tr', LABCAM_T, opt, 1);
  }
}

/* ═══════════ state built once in setup ═══════════ */
let ST = null;
window.FILM_RENDER = {
  async setup(p, kk) {
    const st = { cam: p.createCamera(), tk: { color: Object.assign({}, K.BRAND.color) } };
    st.sa = SAm.setup(p, { seed: F.seed }, Object.assign({ flagFrac: 0, data: null }, LP));
    st.g = p.createGraphics(PS, PS); st.g.pixelDensity(Z.panelDensity);
    /* the plate: the world's grid, one cell per TWh, drawn once; the block's cells are ghost outlines (they are the marks' home) */
    const R = Z.plateRes, pg = p.createGraphics(COLS * R, ROWS * R); pg.pixelDensity(1);
    const cx = pg.drawingContext; cx.fillStyle = C.panel; cx.fillRect(0, 0, COLS * R, ROWS * R);
    for (let i = 0; i < GRID && i < COLS * ROWS; i++) {
      const c = i % COLS, r = Math.floor(i / COLS), inB = c >= BC0 && c < BC0 + BC && r >= BR0 && r < BR0 + BR && (r - BR0) * BC + (c - BC0) < WN;
      if (inB) { cx.strokeStyle = K.rgba(C.accent, 0.3); cx.lineWidth = 1; cx.strokeRect(c * R + 1.5, r * R + 1.5, R - 3, R - 3); }
      else { cx.fillStyle = K.rgba(C.muted, Z.gridAlpha); cx.fillRect(c * R + 1, r * R + 1, R - 2, R - 2); }
    }
    cx.strokeStyle = K.rgba(C.muted, 0.5); cx.lineWidth = 3; cx.strokeRect(1.5, 1.5, COLS * R - 3, ROWS * R - 3);
    st.plate = pg.get(); pg.remove();
    /* the terrain: gl-heightfield's mesh and shader */
    const hf = { M: TMAT, CM: TMAT, vmin: 0, vmax: VMAX, cmin: 0, cmax: VMAX };
    HF.buildMesh(p, hf, HFP); hf.sh = p.createShader(HF.VERT, HF.FRAG); st.hf = hf;
    ST = st;
  },
  render(t, s, kk) {
    const p = kk.p; if (!ST) return;
    if (t < Z.worldT0) scene2D(p, t);
    else if (t < Z.terrT0) sceneWorld(p, t);
    else sceneTerrain(p, t);
  },
};
})();
