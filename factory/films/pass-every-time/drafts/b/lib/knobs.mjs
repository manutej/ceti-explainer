// lib/knobs.mjs · writes film.json = lib/film.base.json + knobs + knobs_doc: the film's own tunables (table below) and the camera
// script's scalars through gl-camera-rig's toKnobs (ranges narrowed so a retune cannot break the beat order). Deterministic.
// Also checks that every [name, default] in lib/film.src.js's knob list is documented here with the same default.
// Run: node lib/knobs.mjs   (from the draft dir or anywhere)
import fs from 'node:fs'; import path from 'node:path'; import vm from 'node:vm'; import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url)), FJ = path.join(HERE, '..', 'film.json');
const ctx = { window: {} }; ctx.window.window = ctx.window; vm.createContext(ctx);
for (const f of ['gl-camera-rig.js', 'rig-script.js']) vm.runInContext(fs.readFileSync(path.join(HERE, f), 'utf8'), ctx);
const RIG = ctx.window.ARSENAL.patterns['gl-camera-rig'].rig, BASE = ctx.window.PASS_RIG;
const cam = RIG.toKnobs(BASE, { points: [] });
// [name, value, range | options, step, what]
const OWN = [
  ['hookA', 0.9, [0.5, 2.0], 0.1, 's: the first line of the belief fades in over the empty floor'],
  ['hookB', 3.2, [2.5, 5.0], 0.1, 's: the second line of the belief fades in'],
  ['hookOut', 10.8, [10.0, 11.4], 0.1, 's: the belief starts to fade (gone 0.8 s later); the board is empty until 13 s'],
  ['tagAt', 12.4, [12.0, 13.0], 0.1, 's: the label GPT-4o, tau-bench retail, 2024 appears top left'],
  ['tileT0', 13.0, [12.6, 14.0], 0.1, 's: the first of the 115 tiles lands on the floor'],
  ['tileSpan', 7.0, [5.0, 7.4], 0.1, 's: from the first tile landing to the last (tileT0 + tileSpan + tileDur <= 21.0, where the count lands)'],
  ['tileDur', 0.8, [0.4, 1.2], 0.1, 's: how long one tile takes to grow in'],
  ['cubeT0', 23.5, [23.0, 24.0], 0.1, 's: the first tile splits into its four cubes'],
  ['cubeSpan', 3.8, [2.5, 4.4], 0.1, 's: from the first tile splitting to the last (the 460 count holds until the passes light)'],
  ['cubeDur', 0.9, [0.4, 1.4], 0.1, 's: how long a tile takes to rise into four cubes'],
  ['litT0', 31.0, [30.6, 31.6], 0.1, 's: the first passing cube lights gold'],
  ['litSpan', 2.4, [1.5, 3.0], 0.1, 's: from the first cube lighting to the last (278 lit by litT0 + litSpan)'],
  ['litFlash', 0.5, [0.2, 1.0], 0.05, 's: how long a newly lit cube stays bright'],
  ['seedLit', 7, [0, 99], 1, 'seed of the order in which the passing cubes light (the passes themselves are data, not random)'],
  ['ratioAt', 36.5, [36.3, 37.5], 0.1, 's: the share of tries that pass is called out (after the 278 count has held)'],
  ['hudOut', 39.6, [38.8, 39.8], 0.1, 's: the scoreboard digits and the share go away before the board stands up'],
  ['m1Spread', 2.5, [0.5, 4.0], 0.1, 's: stand-up: from the first tile moving to the last (the move length is the camera rig stand t0 to t1)'],
  ['m1Lift', 5, [0, 12], 0.5, 'world units: how high a mark hops while its tile restacks into a column'],
  ['m2T0', 60.0, [59.0, 62.0], 0.1, 's: the columns start to re-sort by passes (camera still)'],
  ['m2T1', 66.0, [64.0, 67.0], 0.1, 's: the re-sort is done'],
  ['m2Spread', 1.8, [0.5, 3.0], 0.1, 's: re-sort: from the first column moving to the last'],
  ['m2Lift', 4, [0, 12], 0.5, 'world units: hop height of a column during the re-sort'],
  ['wordsAt', 52.0, [51.0, 53.0], 0.1, 's: two hard-cut words appear on two columns: ALL LIT, NONE LIT'],
  ['wordsOut', 59.4, [57.0, 59.6], 0.1, 's: the two words go away before the re-sort'],
  ['p44At', 68.0, [67.6, 69.0], 0.1, 's: the count of columns lit all four tries is pinned on the longest row'],
  ['p22At', 70.5, [70.0, 71.5], 0.1, 's: the count of columns that never pass is pinned on the last row'],
  ['pinsOut', 72.8, [72.0, 72.9], 0.1, 's: the pins go away before the cut to the volume'],
  ['cutDimAt', 68.0, [66.0, 69.0], 0.1, 's: columns that did not pass every try start to dim (dims, never removes)'],
  ['cutDimAmt', 0.65, [0.2, 0.9], 0.05, 'how far those columns dim toward the dim colour'],
  ['cutDimOffAt', 72.9, [72.0, 72.95], 0.05, 's: the dimming is put away just before the cut'],
  ['cellPitch', 1.0, [0.8, 1.3], 0.05, 'world units: spacing of the four cubes inside one tile (plan view)'],
  ['tilePitch', 2.5, [2.2, 3.0], 0.05, 'world units: spacing of the 115 tiles on the floor'],
  ['plateW', 1.0, [0.9, 1.3], 0.05, 'world units: width of a plate while four plates form a solid tile (match cellPitch)'],
  ['planCubeW', 0.82, [0.5, 1.0], 0.02, 'world units: edge of a cube once its tile has split (smaller = more air between the four)'],
  ['flatH', 0.1, [0.05, 0.4], 0.05, 'world units: thickness of a plate'],
  ['towerPitch', 1.25, [1.1, 1.6], 0.05, 'world units: spacing of the columns across the board'],
  ['cubeW', 1.0, [0.7, 1.2], 0.05, 'world units: width of a cube in a column'],
  ['cubeVPitch', 1.35, [1.1, 1.6], 0.05, 'world units: spacing of the four cubes up a column'],
  ['cubeH', 1.2, [0.8, 1.4], 0.05, 'world units: height of a cube in a column'],
  ['tierZ', 7.0, [5.5, 9.0], 0.5, 'world units: depth between the five rows (less hides the lower cubes of the rows behind)'],
  ['ghostMix', 0.38, [0.15, 0.5], 0.02, 'how bright an unlit cube is (0 = ground, 1 = the second accent)'],
  ['bar1At', 74.8, [74.0, 75.6], 0.1, 's: the cut rests on the first bar (one try); its share is called out'],
  ['bar2At', 77.6, [77.0, 78.4], 0.1, 's: the cut rests on the second bar (two tries)'],
  ['bar3At', 80.4, [79.8, 81.2], 0.1, 's: the cut rests on the third bar (three tries)'],
  ['bar4At', 83.2, [82.6, 84.0], 0.1, 's: the cut rests on the fourth bar; the count of tasks is called out (the share follows 2.5 s later)'],
  ['ratio4At', 85.7, [85.0, 86.6], 0.1, 's: the share of tasks that pass all four tries replaces the count (at least 1.5 s after it)'],
  ['paperAt', 88.6, [87.8, 89.6], 0.1, 's: the paper\'s own 8-try run is drawn as a dashed outline in the eighth slot'],
  ['cutMove', 0.6, [0.3, 1.2], 0.1, 's: how long the cut plane takes to move from one bar to the next'],
  ['cutOffAt', 88.3, [87.0, 99.5], 0.1, 's: the cut plane is put away'],
  ['volBuild', 0.9, [0.4, 2.0], 0.1, 's: the bars grow in over this long, left to right'],
  ['volStagger', 0.6, [0.1, 1.0], 0.05, 'share of the build window one bar takes (1 = all at once)'],
  ['volAlpha', 0.58, [0.3, 0.85], 0.02, 'opacity of a bar (the cut plane shows through lower values)'],
  ['volCutDim', 0.5, [0.1, 1.0], 0.05, 'opacity factor of the bars the cut has passed'],
  ['volW', 60, [40, 80], 2, 'world units: width of the eight slots'],
  ['volH', 18, [12, 30], 1, 'world units: height of the tallest bar'],
  ['volD', 6, [3, 12], 1, 'world units: depth of a bar'],
  ['volGap', 0.3, [0.05, 0.5], 0.05, 'share of a slot left empty between bars'],
  ['dashLen', 0.9, [0.4, 2.0], 0.1, 'world units: length of a dash in the paper\'s outline'],
  ['dashGap', 0.6, [0.3, 1.5], 0.1, 'world units: gap between dashes in the paper\'s outline'],
  ['prLead', 0.6, [0.2, 1.0], 0.1, 's: after the cut to the PR board, the first PR lands'],
  ['prSpan', 3.6, [2.0, 4.2], 0.1, 's: from the first PR landing to the last (the 296 count lands by prLead + prSpan + prDur)'],
  ['prDur', 0.6, [0.3, 1.0], 0.1, 's: how long one PR takes to grow in'],
  ['prPitch', 1.25, [1.0, 1.6], 0.05, 'world units: spacing of the PR cubes'],
  ['prCols', 37, [20, 74], 1, 'cubes across the PR board (296 = 37 x 8; keep a divisor of 296: 8, 37, 74)'],
  ['prGap', 5, [2, 10], 0.5, 'world units: air between the two blocks after the merge filter'],
  ['prH', 1.0, [0.6, 1.4], 0.05, 'world units: height of a PR cube'],
  ['m4T0', 110.5, [109.5, 111.5], 0.1, 's: the merge filter starts: PRs travel to the two blocks'],
  ['m4T1', 117.5, [115.0, 118.0], 0.1, 's: the merge filter is done'],
  ['m4Spread', 1.5, [0.5, 3.0], 0.1, 's: merge filter: from the first PR moving to the last'],
  ['m4Lift', 3, [0, 8], 0.5, 'world units: hop height of a PR during the merge filter'],
  ['sweAt', 107.5, [107.0, 108.4], 0.1, 's: the top SWE-bench Verified score is called out on the PR board'],
  ['sweOut', 110.2, [109.5, 110.4], 0.1, 's: that callout goes away before the merge filter'],
  ['halfAt', 118.0, [117.6, 119.0], 0.1, 's: about half would not be merged is called out'],
  ['minLeadA', 0.8, [0.2, 1.4], 0.1, 's: after the cut to the minutes, the first cube lands'],
  ['minSpanA', 1.6, [0.8, 2.2], 0.1, 's: from the first minute landing to the 27th'],
  ['minPitch', 1.2, [1.05, 1.6], 0.05, 'world units: spacing of the minute cubes along the row'],
  ['minH', 1.0, [0.6, 1.4], 0.05, 'world units: height of a minute cube'],
  ['minDur', 0.5, [0.2, 0.9], 0.1, 's: how long one minute cube takes to grow in'],
  ['m27At', 124.0, [123.6, 125.0], 0.1, 's: the 80 % bar (27 minutes) is pinned on the last gold cube'],
  ['m27Out', 126.4, [125.8, 126.5], 0.1, 's: that pin goes away before the camera moves'],
  ['m289At', 129.5, [129.4, 130.4], 0.1, 's: the 50 % bar (4 h 49 min) is pinned on the end of the row (after the camera has landed)'],
  ['m289Out', 131.9, [131.0, 132.0], 0.1, 's: that pin goes away'],
  ['tenAt', 132.0, [131.8, 133.0], 0.1, 's: about 10 times longer is called out'],
  ['legendAt', 121.2, [121.0, 122.0], 0.1, 's: the legend (one cube = one minute; one tick = an hour) appears'],
  ['qAt', 135.3, [135.0, 136.0], 0.1, 's: Monday\'s question appears over the returned board'],
  ['qOut', 141.0, [140.0, 141.2], 0.1, 's: the question goes away'],
  ['honestAt', 141.5, [141.2, 142.5], 0.1, 's: the one honest line is set in type (no caption sits in the band during it)'],
  ['monLife', 0.6, [0.3, 1.2], 0.1, 's: the board grows back in at Monday'],
  ['hudSize', 52, [40, 72], 2, 'sheet units: the scoreboard digits (must-read, display face)'],
  ['resultSize', 36, [32, 48], 2, 'sheet units: a called-out result (must-read floor 28)'],
  ['pinSub', 14, [14, 18], 1, 'sheet units: small line under a pin (secondary floor 14)'],
  ['labHold', 4, [0, 12], 1, 'frames a pin must be pushed before it hides (gl-labels hysteresis)'],
  ['labLeader', 24, [12, 40], 2, 'sheet units: pin leader length'],
  ['labPlate', 0.72, [0, 0.95], 0.02, 'opacity of the ground-colour plate behind a pin (0 = none)'],
  ['flagH', 4.5, [1, 8], 0.5, 'world units: how far above the end of the longest row the "44 pass all four" flag floats (keeps its label off the cubes)'],
  ['gridOp', 0.15, [0, 0.4], 0.01, 'opacity of the floor grid'],
  ['floorMargin', 5, [1, 16], 1, 'world units: floor shown around the board'],
];
// cross-check with film.src.js
const src = fs.readFileSync(path.join(HERE, 'film.src.js'), 'utf8');
const blk = src.slice(src.indexOf('const Z = {};'), src.indexOf('.forEach(([n, d]) => { Z[n]'));
const found = [...blk.matchAll(/\['(\w+)', (-?[\d.]+)\]/g)].map((m) => [m[1], +m[2]]);
const own = new Map(OWN.map((r) => [r[0], r[1]]));
const bad = [];
for (const [n, v] of found) { if (!own.has(n)) bad.push('undocumented ' + n); else if (own.get(n) !== v) bad.push('default differs ' + n + ' ' + v + ' vs ' + own.get(n)); }
for (const n of own.keys()) if (!found.some((f) => f[0] === n)) bad.push('not in film.src.js ' + n);
if (bad.length) { console.error(bad.join('\n')); process.exit(1); }
const knobs = {}, knobs_doc = [];
for (const [name, value, r, step, what] of OWN) { knobs[name] = value; const d = { name }; if (typeof r[0] === 'number') d.range = r; else d.options = r; d.step = step; d.what = what; knobs_doc.push(d); }
const BEAT = { stand: [38, 42], drift: [50, 54], volcut: [70, 76], prcut: [98, 102], mincut: [119, 123], dolly: [124, 128.5], moncut: [133, 136], monddrift: [136, 140] };
for (const d of cam.knobs_doc) {
  const v = cam.knobs[d.name], m = d.name.match(/^cam([A-Z][a-z]+)(T0|T1|Ease|Az|El|Zoom|Dist|R|Rise|Follow|EyeX|EyeY|EyeZ|CenterX|CenterY|CenterZ|Fov|Aperture)$/);
  const id = m ? m[1].toLowerCase() : null, f = m ? m[2] : null;
  if (f === 'T0') d.range = BEAT[id] || [Math.max(0, v - 2), v + 2];
  else if (f === 'T1') d.range = [Math.max(0, v - 2), v + 2];
  else if (f === 'Az') d.range = [v - 40, v + 40];
  else if (f === 'El') d.range = id === 'stand' ? [20, 60] : [0, 89];
  else if (f === 'Zoom') d.range = [Math.max(0.3, v / 3), v * 3];
  else if (f && f.startsWith('Eye')) d.range = [v - 500, v + 500];
  else if (f && f.startsWith('Center')) d.range = [v - 200, v + 200];
  if (d.range) d.range = [Math.min(d.range[0], v), Math.max(d.range[1], v)].map((x) => Math.round(x * 100) / 100);
  knobs[d.name] = v; knobs_doc.push(d);
}
const fj = JSON.parse(fs.readFileSync(path.join(HERE, 'film.base.json'), 'utf8'));
fj.knobs = knobs; fj.knobs_doc = knobs_doc;
fs.writeFileSync(FJ, JSON.stringify(fj, null, 1) + '\n');
console.log('knobs', Object.keys(knobs).length, '(camera', cam.knobs_doc.length + ')', cam.knobs_doc.map((d) => d.name).join(' '));
