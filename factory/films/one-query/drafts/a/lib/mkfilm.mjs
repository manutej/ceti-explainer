// lib/mkfilm.mjs · writes film.json: the film's fields, the captions, the knobs (the film's own table + the two camera scripts through
// gl-camera-rig's toKnobs). Deterministic. Run: node lib/mkfilm.mjs   (from anywhere). Then: python3 lib/assemble.py && build.
import fs from 'node:fs'; import path from 'node:path'; import vm from 'node:vm'; import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url)), DIR = path.join(HERE, '..');
const ctx = { window: {} }; ctx.window.window = ctx.window; vm.createContext(ctx);
for (const f of ['gl-camera-rig.js', 'rig-script.js']) vm.runInContext(fs.readFileSync(path.join(HERE, f), 'utf8'), ctx);
const RIG = ctx.window.ARSENAL.patterns['gl-camera-rig'].rig, RIGS = ctx.window.ONEQ_RIGS;
const claims = JSON.parse(fs.readFileSync(path.join(DIR, 'claims.json'), 'utf8'));

// [name, value, range | options, step, what]
const OWN = [
  /* the hook */
  ['hookScale0', 0.34, [0.2, 0.6], 0.02, 'the lit mark at the start, as a fraction of its size at the end of the push-in'],
  ['pushT0', 8.0, [7.0, 9.0], 0.1, 's: the 4 s push toward the mark starts (the camera is still before it)'],
  ['pushT1', 12.0, [11.0, 12.4], 0.1, 's: the push-in ends on the mark at its full size'],
  ['hookEnd', 9.0, [8.7, 11.0], 0.1, 's: the headline words are gone by this second (they fade over 0.7 s before it)'],
  ['hookSize', 64, [40, 88], 2, 'sheet units: the two headline words (display face, must-read)'],
  ['hookY', 132, [100, 180], 2, 'sheet units: baseline of the headline words'],
  ['glowR', 1.4, [0.8, 2.0], 0.05, 'the lit mark\'s glow radius, in mark widths (kept inside the panel)'],
  ['litT0', 0.0, [0.0, 1.5], 0.1, 's: the mark starts to light'],
  ['litT1', 0.8, [0.4, 2.0], 0.1, 's: the mark is fully lit'],
  /* the case: one query beside a microwave-second */
  ['ruler0', 13.0, [12.4, 16.0], 0.1, 's: the microwave-second ruler draws under the mark'],
  ['rulerDy', 84, [60, 110], 2, 'sheet units: the ruler sits this far below the mark\'s centre'],
  ['q0', 17.2, [17.0, 18.0], 0.1, 's: the 0.24 Wh readout lands (the first count)'],
  ['q0Size', 44, [32, 56], 2, 'sheet units: the 0.24 Wh readout (display face, must-read)'],
  ['micro0', 23.0, [22.6, 24.0], 0.1, 's: the microwave row of the legend and the filled part of the ruler appear'],
  ['bulb0', 28.8, [28.4, 30.0], 0.1, 's: the bulb row of the legend appears'],
  /* the ladder (scale-anchor) and the second tile tier */
  ['ladT0', 32.0, [31.5, 32.5], 0.1, 's: the log zoom starts (rung 10^0 holds first)'],
  ['dwell', 2.6, [2.5, 2.7], 0.1, 's: hold per rung (a caption lands in it)'],
  ['move', 1.3, [1.2, 1.4], 0.1, 's: time between rungs (ease cubic on log10 n)'],
  ['budget', 2500, [400, 4000], 100, 'marks drawn one by one up to this many; past it, tiles (module LOD)'],
  ['tile', 4, [3, 6], 1, 'cells per tile side past the budget (the module\'s batch factor is its square)'],
  ['rungLag', 0.4, [0.2, 1.0], 0.1, 's: after a rung arrives, the energy readout lands (the count is read first)'],
  ['cntSize', 56, [40, 72], 2, 'sheet units: the running count (display face, must-read)'],
  ['enSize', 36, [28, 48], 2, 'sheet units: the energy readouts (display face, must-read)'],
  ['panelSize', 320, [280, 340], 4, 'sheet units: the square panel the crowd lives in (the ruler is a third of it)'],
  ['panelY', 56, [46, 70], 2, 'sheet units: top of the panel'],
  ['panelDensity', 2, [1, 2], 1, 'pixel density of the panel texture (1 = softer, cheaper)'],
  ['swapT0', 56.0, [56.0, 57.0], 0.1, 's: the whole 10^5 field starts to shrink into ONE tile (the tile swap)'],
  ['swapDur', 1.2, [0.8, 2.0], 0.1, 's: length of the swap'],
  ['t2T0', 57.4, [57.0, 58.0], 0.1, 's: second tier zoom starts (one tile to 100,000 tiles)'],
  ['t2T1', 60.0, [59.0, 60.4], 0.1, 's: second tier zoom ends on the full site-day'],
  ['tileFill', 0.82, [0.6, 0.95], 0.01, 'share of a cell a tile mark fills in the second tier'],
  ['siteAt', 58.0, [57.4, 59.0], 0.1, 's: the 100 MW site-day readout (2.4 GWh) lands'],
  ['billionAt', 61.4, [60.6, 63.0], 0.1, 's: the 10 billion queries readout lands (after the 100,000 tiles)'],
  /* the cuts and the world scene */
  ['worldT0', 66.0, [65.5, 66.5], 0.1, 's: hard cut to the world\'s grid'],
  ['terrT0', 99.0, [98.5, 99.6], 0.1, 's: hard cut to the terrain'],
  ['plateCols', 190, [170, 220], 5, 'cells across the world\'s grid plate (rows follow from the grid size, one cell per TWh)'],
  ['cell', 3, [2.5, 4], 0.1, 'world units: one cell of the plate (and the edge of a mark\'s box)'],
  ['boxFill', 0.84, [0.5, 0.95], 0.02, 'share of a cell a mark\'s box fills'],
  ['blockCols', 20, [14, 30], 1, 'marks per row of the block of 415 (rows follow)'],
  ['towerFoot', 3, [2, 4], 1, 'boxes along one side of a tower\'s square footprint'],
  ['towerGap', 88, [50, 120], 2, 'world units: spacing of the four towers'],
  ['plateRes', 8, [4, 8], 1, 'texture pixels per plate cell'],
  ['gridAlpha', 0.3, [0.15, 0.7], 0.02, 'opacity of the grey cells of the rest of the world\'s grid'],
  ['ambient', 120, [60, 200], 5, 'ambient light on the boxes (0-255)'],
  ['keyLight', 190, [100, 255], 5, 'key light on the boxes (0-255)'],
  ['wLeg0', 66.4, [66.2, 68.0], 0.1, 's: the legend (one mark = one TWh; grey = the rest) appears'],
  ['cinT0', 66.6, [66.2, 67.4], 0.1, 's: the first of the 415 marks lands in the block'],
  ['cinT1', 70.6, [69.5, 71.0], 0.1, 's: the last mark lands (the count reads 415 by then)'],
  ['cinGrow', 0.35, [0.2, 0.8], 0.05, 's: a mark takes this long to rise to its height'],
  ['pctAt', 77.4, [77.0, 78.5], 0.1, 's: the share pin appears on the block (after the pull-back settles; 6 s after the count)'],
  ['regStagger', 0.2, [0.0, 0.25], 0.05, 'share of the regroup the last mark waits before leaving'],
  ['regLift', 14, [0, 40], 1, 'world units: the hop a mark makes in flight'],
  ['towT0', 88.6, [88.0, 90.0], 0.1, 's: the first tower count pins (after the turn settles)'],
  ['towStep', 0.9, [0.6, 1.5], 0.1, 's: between one tower\'s pin and the next'],
  ['pctRegAt', 94.2, [93.6, 95.0], 0.1, 's: the first share replaces a tower count (counts first)'],
  ['checkAt', 96.6, [95.0, 98.0], 0.1, 's: the check line (187 + 104 + 62 + 62 = 415) appears'],
  /* the terrain */
  ['terrSize', 700, [500, 860], 20, 'world units: width of the terrain (40 columns)'],
  ['terrZ', 0.6, [0.3, 1.0], 0.05, 'the terrain\'s depth (rows) as a share of its width scale; a view choice, no cell changes'],
  ['terrH', 170, [100, 240], 10, 'world units: height of the taller end of the fixed scale'],
  ['terrMax', 25, [22, 30], 1, 'percent at the top of the fixed height scale (the same for every mesa)'],
  ['terrSlab', 14, [0, 30], 1, 'world units: depth of the section\'s floor under the terrain'],
  ['contours', 0, [0, 20], 1, 'contour intervals over the height scale (0 = off; unlabelled)'],
  ['terrAmb', 0.42, [0.3, 0.6], 0.02, 'ambient light on the terrain'],
  ['terrKey', 0.72, [0.5, 0.9], 0.02, 'key light on the terrain'],
  ['revealDur', 2.4, [1.0, 4.0], 0.1, 's: the terrain\'s rows count in over this long after the cut'],
  ['namesAt', 103.4, [103.0, 104.4], 0.1, 's: the place names pin (after the crane settles)'],
  ['cutStartCol', 0, [0, 1], 1, 'column the section cut starts at (the left edge)'],
  ['cutIeT0', 104.5, [104.0, 105.5], 0.1, 's: the section cut starts to travel to Ireland'],
  ['cutIeT1', 106.8, [106.0, 107.6], 0.1, 's: the cut stops at Ireland (a real column)'],
  ['ieGwhAt', 107.6, [107.0, 109.0], 0.1, 's: Ireland\'s GWh pins at the cut'],
  ['iePctAt', 113.0, [111.5, 114.0], 0.1, 's: Ireland\'s share replaces the GWh (5 s after it)'],
  ['ieTimesAt', 117.4, [116.0, 119.0], 0.1, 's: the "15 times" pin replaces the share'],
  ['cutUsT0', 121.0, [120.5, 122.0], 0.1, 's: the cut starts to travel to the United States (the Ireland pin is off one second before)'],
  ['cutUsT1', 124.2, [123.0, 125.0], 0.1, 's: the cut stops at the United States'],
  ['usTwhAt', 124.6, [124.0, 126.0], 0.1, 's: the US TWh pins at the cut'],
  ['usPctAt', 128.6, [127.0, 129.5], 0.1, 's: the US share replaces the TWh'],
  ['usHalfAt', 132.4, [131.0, 133.5], 0.1, 's: the "about half of 2025 growth" pin replaces the share'],
  ['dimT0', 135.6, [135.0, 136.0], 0.1, 's: the terrain dims for Monday and the pins go'],
  ['dim', 0.7, [0.3, 0.85], 0.02, 'how far the terrain dims on Monday (share of the ground colour laid over it)'],
  ['endFade', 149.2, [148.0, 149.4], 0.1, 's: the Monday text fades out (gone 0.5 s later, before the CETI card at 150 s covers the page)'],
  ['monQ0', 135.8, [135.2, 137.0], 0.1, 's: the question appears'],
  ['monY', 100, [80, 160], 2, 'sheet units: baseline of "Per what?" (the second line is 56 below it)'],
  ['monSize', 60, [40, 88], 2, 'sheet units: "Per what?" (display face)'],
  ['monSize2', 38, [28, 56], 2, 'sheet units: the second line of the question (display face)'],
  ['honestAt', 139.0, [138.0, 141.0], 0.1, 's: the honest-limits line appears on stage'],
  ['honestY', 356, [270, 380], 2, 'sheet units: baseline of the first honest line (it is three lines)'],
  ['honestSize', 16, [14, 20], 1, 'sheet units: the honest-limits line (mono, secondary: floor 14)'],
  /* labels */
  ['labHold', 6, [0, 12], 1, 'frames a pin must be pushed before it hides (gl-labels hysteresis)'],
  ['labLeader', 22, [12, 40], 2, 'sheet units: pin leader length'],
  ['labMax', 8, [3, 12], 1, 'most pins on screen at once (gl-labels maxShown)'],
];
const knobs = {}, knobs_doc = [], names = new Set();
const addDoc = (name, value, r, step, what) => { if (names.has(name)) throw new Error('dup knob ' + name); names.add(name); knobs[name] = value; const d = { name }; if (typeof r[0] === 'number') d.range = r; else d.options = r; d.step = step; d.what = what; knobs_doc.push(d); };
for (const [name, value, r, step, what] of OWN) addDoc(name, value, r, step, what);
// the two camera scripts: narrow each time range to a window around its value so a retune cannot break the beat order
const scene = { points: [[0, 0, 0]] };
for (const [key, prefix] of [['world', 'cw'], ['terrain', 'ct']]) {
  const cam = RIG.toKnobs(RIGS[key], scene, { prefix });
  for (const d of cam.knobs_doc) {
    const v = cam.knobs[d.name], m = d.name.match(/^c[wt](Pull|Rise|Lift|Drift|Us)(T0|T1|Ease|Az|El|R|Dist|Rise|Follow)$/);
    const f = m ? m[2] : null;
    if (f === 'T0' || f === 'T1') d.range = [Math.max(0, v - 1.5), v + 1.5];
    else if (f === 'Az') d.range = [v - 40, v + 40];
    else if (f === 'El') d.range = [Math.min(v, 3), Math.max(v, 60)];
    else if (f === 'R') d.range = [0.3, 2];
    else if (f === 'Dist') d.range = [200, 1200];
    else if (f === 'Rise') d.range = [100, 900];
    if (d.range) d.range = [Math.min(d.range[0], v), Math.max(d.range[1], v)].map((x) => Math.round(x * 100) / 100);
    addDoc(d.name, v, d.range || d.options, d.step, d.what);
    if (!d.range) { knobs_doc[knobs_doc.length - 1].options = d.options; delete knobs_doc[knobs_doc.length - 1].range; }
  }
}
const HON = [
  'Assumed: a 1,000 W microwave, a 60 W bulb, 10 prompts a day,',
  'a 100 MW site at full load. Per-query figures: one vendor\'s',
  'median text prompt (Google, 2025), not independently verified.',
];
const CAP = [
  [0.6, 4.6, 'AI is using far too much energy.'], [4.8, 8.6, 'AI is using almost no energy.'], [8.8, 11.8, 'Both come with true numbers. Count them.'],
  [12.4, 16.8, 'One question to a chatbot. One mark.'], [17.2, 22.6, 'Google, 2025: a median text prompt takes 0.24 Wh.'],
  [23.0, 28.4, 'A 1,000 W microwave runs 0.86 s on that.'], [28.8, 34.2, 'A 60 W bulb: 14 s. A fraction of a minute.'],
  [35.6, 41.0, 'Ask 10 a day: 2.4 Wh, 8.6 s of microwave.'], [41.4, 50.8, 'Zoom out: each step is ten times the queries.'],
  [51.0, 55.8, '100,000 queries: 24 kWh.'], [56.2, 57.8, '100,000 queries become one tile.'], [58.0, 60.0, 'A 100 MW site, 24 hours: 2.4 GWh.'],
  [60.4, 65.8, '100,000 tiles of 100,000 queries: 10 billion.'],
  [66.2, 71.0, 'Now the world. One mark is one TWh.'], [71.4, 77.0, 'Data centres, all kinds, 2024: 415 TWh.'], [77.4, 81.6, 'Against the world\'s electricity: 1.5 %.'],
  [82.0, 87.6, 'Same marks, now by region.'], [88.8, 93.8, 'US about 187 TWh, China 104, Europe 62.'], [94.2, 99.0, '45 %, 25 %, 15 % of the world\'s data-centre power.'],
  [99.4, 104.4, 'Now each country against its own grid.'], [105.0, 112.6, 'Cut at Ireland, 2025: 7,663 GWh.'], [113.0, 117.0, '23 % of Ireland\'s metered electricity.'],
  [117.4, 120.6, '15 times the world\'s 1.5 %.'], [121.6, 128.4, 'Cut at the US, 2023: 176 TWh.'], [128.8, 132.2, '4.4 % of its grid.'],
  [132.6, 135.4, 'Yet about half of 2025\'s US demand growth.'], [135.8, 141.6, 'Monday: for any AI energy figure, ask: per what?'], [142.0, 149.6, 'Per query? Per site? Per grid?'],
];
const SRC = [
  ['S1', 'Google (2025). Measuring the environmental impact of delivering AI at Google Scale; blog: Measuring the environmental impact of AI inference. cloud.google.com/blog/products/infrastructure/measuring-the-environmental-impact-of-ai-inference'],
  ['S2', 'IEA (2025). Energy and AI, World Energy Outlook Special Report, "Energy demand from AI". iea.org/reports/energy-and-ai/energy-demand-from-ai'],
  ['S3', 'IEA (2026). Electricity 2026 (executive summary, demand) and Global Energy Review 2026. iea.org/reports/electricity-2026'],
  ['S4', 'Shehabi et al. (2024). 2024 United States Data Center Energy Usage Report, Lawrence Berkeley National Laboratory. eta-publications.lbl.gov/publications/2024-lbnl-data-center-energy-usage-report'],
  ['S5', 'Central Statistics Office Ireland (2026). Data Centres Metered Electricity Consumption 2025. cso.ie/en/releasesandpublications/ep/p-dcmec/datacentresmeteredelectricityconsumption2025/keyfindings/'],
  ['S6', 'Ember (2025). Grids for data centres: ambitious grid planning can win Europe\'s AI race. ember-energy.org'],
  ['S7', 'EPRI (2026). Powering Intelligence: updated U.S. data center scenarios. powering-intelligence.epri.com/load-growth.html'],
  ['input', 'Stated assumption of the film: a definition (1,000 W microwave, 60 W bulb, ten prompts a day, a 100 MW site at full load), not a measurement.'],
];
const fj = {
  id: 'one-query', title: 'One query', eyebrow: 'CETI · AI and energy, by the numbers',
  lede: 'One median AI prompt is 0.24 Wh, less than a second of a microwave. Counted up, the same energy is 1.5 % of the world\'s electricity and 23 % of Ireland\'s. Small per query, large per grid: the picture depends on what you divide by.',
  format: 'feature-long', level: 'manager', renderer: 'webgl', look: { brand: 'ceti-boardwalk-dark', chrome: 'none', material: 'ink' }, dur: 153, seed: 2310,
  params: claims.params, commit: { enabled: false }, count: { at: 17.2 },
  chapters: [
    { id: 'hook', beat: 'HOOK', t0: 0, t1: 12, eyebrow: 'HOOK', title: 'Two true sentences' },
    { id: 'case', beat: 'CASE', t0: 12, t1: 60, eyebrow: 'CASE', title: 'One query, then a site-day' },
    { id: 'count', beat: 'COUNT', t0: 60, t1: 135, eyebrow: 'COUNT', title: 'The same energy, three denominators' },
    { id: 'monday', beat: 'MONDAY', t0: 135, t1: 150, eyebrow: 'MONDAY', title: 'Per what?' },
  ],
  captions: CAP, brand: { takeaway: 'Small per query, large per grid. Divided by what?', at: 150 },
  sources: SRC, honest: HON.join(' '), honestLines: HON, libs: ['lib/arsenal.gen.js'], knobs, knobs_doc,
};
for (const c of CAP) if (c[2].length > 60) throw new Error('caption over 60 chars: ' + c[2]);
fs.writeFileSync(path.join(DIR, 'film.json'), JSON.stringify(fj, null, 1) + '\n');
console.log('film.json: knobs', Object.keys(knobs).length, 'captions', CAP.length);
