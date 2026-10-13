// lib/knobs.mjs · writes film.json knobs + knobs_doc: the film's own tunables (table below) and the camera script's
// scalars through gl-camera-rig's toKnobs (ranges narrowed so a retune cannot break the beat order). Deterministic.
// Run: node lib/knobs.mjs   (from the draft dir or anywhere)
import fs from 'node:fs'; import path from 'node:path'; import vm from 'node:vm'; import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url)), FJ = path.join(HERE, '..', 'film.json');
const ctx = { window: {} }; ctx.window.window = ctx.window; vm.createContext(ctx);
for (const f of ['gl-camera-rig.js', 'rig-script.js']) vm.runInContext(fs.readFileSync(path.join(HERE, f), 'utf8'), ctx);
const RIG = ctx.window.ARSENAL.patterns['gl-camera-rig'].rig, BASE = ctx.window.BELL_RIG;
const scene = { points: Array.from({ length: 27 }, () => [0, 0, 0]) };
const cam = RIG.toKnobs(BASE, scene);
// [name, value, range | options, step, what]
const OWN = [
  ['countT0', 12.4, [12.2, 13.0], 0.1, 's: second the first roll lands on the table (the lane is empty before it)'],
  ['countT1', 23.6, [21.5, 23.8], 0.1, 's: second the last of the rolls lands (the count reads all of them by 24.0)'],
  ['countWin', 0.02, [0.005, 0.06], 0.005, 'share of the rolls that are still settling at once during the count-in (larger = softer front)'],
  ['hotFlash', 1, [0.5, 2], 0.1, 'how long a newly landed roll stays bright, as a factor of the settling window'],
  ['waffPitch', 1.5, [1.2, 1.8], 0.05, 'world units: spacing of the 500 x 200 field of rolls on the table'],
  ['waffFill', 0.7, [0.4, 0.95], 0.05, 'share of the field spacing a mark fills (smaller = more felt between marks)'],
  ['cubePitch', 2.0, [1.6, 2.6], 0.1, 'world units: spacing of the stacked marks (one box per roll); scales every stack'],
  ['cubeFill', 0.8, [0.5, 0.95], 0.05, 'share of the stack spacing a box fills (smaller = a visible seam between rolls)'],
  ['fdW', 20, [12, 28], 1, 'boxes across one first-die stack (the six stacks)'],
  ['fdD', 12, [6, 16], 1, 'boxes deep in one first-die stack'],
  ['fdGap', 24, [10, 60], 2, 'world units: air between the six first-die stacks'],
  ['sumW', 12, [8, 16], 1, 'boxes across one sum stack (26 stacks; with sumGap it sets the width of the bell)'],
  ['sumD', 5, [3, 8], 1, 'boxes deep in one sum stack (fewer = taller bell)'],
  ['sumGap', 8, [4, 16], 1, 'world units: air between the 26 sum stacks'],
  ['fd0', 28.0, [27.0, 29.0], 0.1, 's: the first roll leaves the field for its first-die stack (arrival order)'],
  ['fdSpread', 3.4, [1.0, 4.0], 0.1, 's: from the first roll leaving to the last roll leaving (fd0 + fdSpread + fdFly <= 33.6)'],
  ['fdFly', 1.6, [0.6, 2.4], 0.1, 's: flight time of one roll from the field to its stack'],
  ['fdLift', 34, [0, 80], 2, 'world units: hop height of a roll in flight to the first-die stacks'],
  ['sum0', 44.0, [43.2, 45.0], 0.1, 's: the first roll leaves its first-die stack for its sum stack'],
  ['sumSpread', 1.8, [0.8, 2.4], 0.1, 's: from the first roll leaving to the last (sum0 + sumSpread + sumFly <= 47.4)'],
  ['sumFly', 1.2, [0.5, 2.0], 0.1, 's: flight time of one roll to its sum stack'],
  ['sumLift', 46, [0, 100], 2, 'world units: hop height of a roll in flight to the sum stacks'],
  ['diceT0', 2.0, [1.4, 2.6], 0.1, 's: the first of the five dice lands'],
  ['diceStep', 0.4, [0.2, 0.6], 0.05, 's: between one die landing and the next'],
  ['diceSize', 62, [44, 80], 2, 'sheet units: edge of a die in the hook'],
  ['sumAt', 4.2, [4.0, 5.0], 0.1, 's: the sum of the throw appears'],
  ['flatAt', 8.2, [8.0, 9.0], 0.1, 's: the belief\'s flat line appears over the empty 5-30 axis'],
  ['hookOut', 11.4, [10.8, 11.8], 0.1, 's: the hook throw starts to fade (gone 0.8 s later)'],
  ['landAt', 24.0, [24.0, 24.4], 0.1, 's: the running counter is replaced by the landed count (never before the count-in ends)'],
  ['pinsFirstAt', 34.0, [33.6, 35.0], 0.1, 's: the six first-die counts pin on their stacks'],
  ['pinsFirstOut', 39.6, [38.5, 40.0], 0.1, 's: the first-die pins start to fade'],
  ['equalAt', 47.0, [46.5, 48.0], 0.1, 's: the equal-odds line (3,846 per sum) appears over the sum stacks'],
  ['pinsSumAt', 55.4, [55.0, 56.0], 0.1, 's: the peak and end counts pin on their stacks (after the side view lands)'],
  ['tailLitAt', 58.4, [58.0, 59.5], 0.1, 's: the five tail stacks start to turn accent (1.2 s ramp)'],
  ['pinsTailAt', 60.4, [59.5, 62.0], 0.1, 's: the five tail counts pin on their stacks'],
  ['volIn', 66.0, [66.0, 66.6], 0.1, 's: the cross-fade from the stacks to the counted cells starts'],
  ['volFade', 0.6, [0.3, 1.2], 0.1, 's: length of that cross-fade'],
  ['volBuild', 0.9, [0.4, 2.0], 0.1, 's: the cells grow in over this long, left to right'],
  ['volStagger', 0.6, [0.1, 1.0], 0.05, 'share of the build window one cell takes (1 = all at once)'],
  ['volAlpha', 0.55, [0.3, 0.85], 0.05, 'opacity of a counted cell (the cut plane shows through lower values)'],
  ['volCutDim', 0.45, [0.1, 1.0], 0.05, 'opacity factor of the cells the cut has passed'],
  ['cutT0', 70.0, [69.0, 71.0], 0.1, 's: the cut starts at sum 5'],
  ['cutT1', 76.0, [75.0, 76.0], 0.1, 's: the cut reaches the 25 / 26 edge (the tail count lands at tailAt)'],
  ['tailAt', 76.0, [76.0, 77.0], 0.1, 's: the tail cells light and the tail count lands (count 2)'],
  ['ratioAt', 82.0, [80.0, 84.0], 0.1, 's: the share appears under the tail count (always after it)'],
  ['beliefAt', 86.0, [85.0, 88.0], 0.1, 's: the equal-odds line and its tail box return'],
  ['timesAt', 88.0, [87.0, 90.0], 0.1, 's: "about 12 times too many" appears'],
  ['exactT0', 92.0, [91.5, 93.0], 0.1, 's: the exact bell (expected rolls per sum) starts drawing, left to right'],
  ['exactT1', 96.0, [94.0, 97.0], 0.1, 's: the exact bell is drawn'],
  ['waysAt', 96.0, [95.0, 97.0], 0.1, 's: the ways of 7,776 appear'],
  ['tailExactAt', 98.0, [97.5, 99.0], 0.1, 's: the exact tail (126 ways predict 1,620) appears'],
  ['agreeAt', 102.0, [101.5, 103.0], 0.1, 's: the agreement lines (largest gap, mean, sd) appear'],
  ['cutOffAt', 80.0, [78.0, 84.0], 0.1, 's: the cut plane is put away (the passed cells undim; the tail stays lit)'],
  ['mondayAt', 107.6, [107.0, 108.0], 0.1, 's: the cells fade and the rolls return for Monday'],
  ['bandAt', 109.0, [108.5, 111.0], 0.1, 's: the middle band (sums 14 to 21) lights'],
  ['bandDim', 0.72, [0.3, 1.0], 0.02, 'how far rolls outside the band fade toward muted (1 = all the way)'],
  ['feltMargin', 70, [20, 160], 5, 'world units: felt around the field of rolls'],
  ['readSize', 56, [40, 80], 2, 'sheet units: the tail count (must-read, display face)'],
  ['ratioSize', 32, [28, 44], 2, 'sheet units: the share under the tail count (must-read)'],
  ['pinSub', 14, [14, 18], 1, 'sheet units: small line under a pin (secondary floor 14)'],
  ['labHold', 4, [0, 12], 1, 'frames a pin must be pushed before it hides (gl-labels hysteresis)'],
  ['labLeader', 22, [12, 40], 2, 'sheet units: pin leader length'],
  ['exactW', 2.2, [1, 4], 0.2, 'sheet units: stroke of the exact bell line'],
];
const knobs = {}, knobs_doc = [];
for (const [name, value, r, step, what] of OWN) { knobs[name] = value; const d = { name }; if (typeof r[0] === 'number') d.range = r; else d.options = r; d.step = step; d.what = what; knobs_doc.push(d); }
const BEAT = { oblique: [24.5, 34], plan: [39, 44], side: [48, 58], tail: [58, 66], wide: [66, 70.5], tilt: [70, 77], flat: [84, 92] };
for (const d of cam.knobs_doc) {
  const v = cam.knobs[d.name], m = d.name.match(/^cam([A-Z][a-z]+)(T0|T1|Ease|Az|El|Zoom|Target|Dist|R)$/);
  const id = m ? m[1].toLowerCase() : null, f = m ? m[2] : null;
  if (f === 'T0' || f === 'T1') d.range = BEAT[id] || [Math.max(0, v - 2), v + 2];
  else if (f === 'Az') d.range = [v - 40, v + 40];
  else if (f === 'El') d.range = id === 'plan' ? [70, 89] : id === 'side' || id === 'flat' ? [0, 20] : [5, 45];
  else if (f === 'Zoom') d.range = [0.6, 3];
  else if (f === 'Dist') d.range = [1500, 4000];
  else if (f === 'Target') d.range = [0, 26];
  if (d.range) d.range = [Math.min(d.range[0], v), Math.max(d.range[1], v)].map((x) => Math.round(x * 100) / 100);
  knobs[d.name] = v; knobs_doc.push(d);
}
const fj = JSON.parse(fs.readFileSync(FJ, 'utf8'));
fj.knobs = knobs; fj.knobs_doc = knobs_doc;
fs.writeFileSync(FJ, JSON.stringify(fj, null, 1) + '\n');
console.log('knobs', Object.keys(knobs).length, '(camera', cam.knobs_doc.length + ')', cam.knobs_doc.map((d) => d.name).join(' '));
