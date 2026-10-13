# one-query · draft A · "the kitchen to the grid"

Wave AI-STORIES, drafter A. Brief: factory/topics/one-query/{brief.md, beats.md, claims.json, data/, sources.md}. Look: brand
ceti-boardwalk-dark, chrome none, material ink, level manager, renderer webgl, format feature-long, dur 153 (150 s + the 3 s CETI
card), `commit: {enabled: false}` (D11), chapters HOOK 0 · CASE 12 · COUNT 60 · MONDAY 135. claims.json is copied unchanged.

## Register
Human scale first, then the grid. One median prompt is ONE square mark beside a microwave-second ruler: the mark's edge is
0.864 of the ruler (gemWh x 3600 / microW), so "0.86 s" is a length you can see. The legend keeps the kitchen units
(0.86 s of a 1,000 W microwave, 14 s of a 60 W bulb) on screen through the ladder. A log zoom (scale-anchor) climbs through a day
of prompts (10) to 100,000 queries (24 kWh); the whole field then shrinks into ONE tile (the second tile tier) and the zoom runs
again: 100,000 tiles = a 100 MW site's day (2.4 GWh, 10 billion queries). Hard cut to a plate of the world's grid, one cell per
TWh (the grey cells are the rest of the grid, never counted aloud): the 415 TWh of data centres land as a block of marks (1.5 %),
then the SAME marks re-stack into four towers (US, China, Europe, rest) under a plan-to-elevation tilt and a quarter turn.
Hard cut to a terrain of national demand (seven mesas): the camera lifts (crane) and a section is cut at Ireland, then the United
States. Denominators in turn: per query, per site, per grid; the film ends on "Per what?" with the honest line on stage.

## Chain (narrowed, never widened) and what was cut, no module copy edited
scale-anchor, gl-heightfield, gl-camera-rig, gl-labels. lib/*.js are verbatim copies; lib/assemble.py (CUTS, deterministic: run
twice, identical) writes lib/arsenal.gen.js (rides film.json `libs`) and ../film.js (rig-script.js + film.src.js).
- scale-anchor: kept setup (the spiral tables), timeline/level/lodAlpha/countOf/spiralIdx. CUT its demo draw (panel, readout
  column, silhouettes). The film draws the field itself on a 2-D graphics (`field()`: the module's marks-then-tiles LOD) and
  composites it flat. SECOND TILE TIER = a documented patch in the film, not the module: past 10^5 the whole field shrinks into one
  tile (`tier: 'swap'`, 1.2 s) and the same engine runs again with 1 mark = 100,000 queries (`tier 2`, edge fill 0.82).
  Module limit left: below ~1.3 px pitch the picture is a texture (the count is the claim).
- gl-heightfield: kept VERT/FRAG, buildMesh, terrain (the shader), section3d (the cut face). CUT its synthetic data, fonts,
  camera, pins, HUD and 2-D profile. The film passes the 40 x 25 matrix built from claims (4 columns per place + a gap column) and
  applies a depth scale `terrZ` with p.scale (view only; clip, section and heights are unchanged).
- gl-camera-rig: two rigs (world, terrain) joined by hard cuts; every scalar is a knob (prefixes cw, ct) through toKnobs/fromKnobs.
- gl-labels: one solve per beat, `sticky: 'window'` (long film), reserve rects for the caption band (y >= 436), the legend and the
  counter; results at 28 (display face), subs at 14; plates behind pins.
Not in the chain on purpose: gl-instances (the 415 boxes are plain p5 `box` calls, one per mark; the plate is one textured plane).

## Moves (R-E section 0: operation under camera, holding an invariant, landing on a view)
| move | start | sentence | I1 same marks | I2 same count | I3 same scale | I4 same world | I5 same lens |
|---|---|---|---|---|---|---|---|
| M1 re-scale | 32.0 | the crowd of queries 1 to 10^5 under a log zoom, then the field into one tile and 1 to 10^5 tiles; lands on 100,000 tiles | spiral cell k never moves | n printed at every rung (running count), tile sums = n (module) | 1 mark = 1 query until the swap; the swap is printed ("TILES OF 100,000 QUERIES") | ruler and legend constant | the zoom is the camera |
| cut | 66.0 | hard cut to the plan view of the plate (match: a centred field of squares) | | | | | |
| pull-back (re-scale, view) | 74.0 | dolly out from the block to the whole plate; 1.5 % lands at 77.4 | same 415 boxes | 415 printed (count-in 66.6-70.6) | 1 mark = 1 TWh (legend) | the grey plate does not change | fov 38 fixed |
| M2 re-stack + re-partition | 82.0 | the 415 marks fly from the block into four towers (187 / 104 / 62 / 62) under a tilt 89 to 19 degrees and a 24 degree turn; counts first, shares 5.6 s later | ids keep their path (start cell to tower slot) | 187+104+62+62 = 415 printed (check line) | box edge constant | the plate and the holes they left stay | fov 38 fixed |
| cut | 99.0 | hard cut to the terrain at street level | | | | | |
| lift (P7 crane) | 99.0 | straight rise over seven mesas; rows count in | seven mesas | seven places | vmax 25 fixed (terrMax) | no cell re-valued | fov fixed |
| M3 section | 104.5 | a section cut travels to Ireland, then to the United States (a real column each time) | same cells | pin: GWh, then % 5.4 s later, then "15 times" | hscale constant | mesas piecewise constant (no interpolation) | fov fixed |
Camera starts: 74.0, 82.0 (gap 8), 99.0 cut, 104.6 slow drift (0.6 deg/s), 121.0 (gap 22). Holds >= 2.5 s on every new number
(rung readouts land 0.4 s after the rung: 2.5 s; tower counts one per 0.9 s, so the four are read as one bar chart: R2's "at
most two results" is relaxed there on purpose, boxes disjoint and >= 56 apart; the solver enforces it).

## Gate (final run: gate.json) and warnings left
See the verdict block at the end of this file (written after the last run).
- G5c WARN: the ladder's running counter n = round(10^L) (module formula), the world count-in counter: counts in progress,
  final values are claims (100,000 and 415 are).
- G6 phone overflow is the shell, not the film.
- Captions are 28 units, <= 50 characters (one line each); the caption band (y >= 436) is a `reserve` rect for every pin.
- G11 clean in the final run (the first run failed at 151.5 s: Monday text standing under the CETI card; fixed by an end fade
  before brand.at, plus the terrain header now leaves before "Per what?" arrives).

## Honest limits (on stage, MONDAY, roled SVG text, 3 lines of one sentence)
"Assumed: a 1,000 W microwave, a 60 W bulb, 10 prompts a day, a 100 MW site at full load. Per-query figures: one vendor's median
text prompt (Google, 2025), not independently verified." Second limit (IEA 415 TWh is ALL data centres, not AI alone) is in the
words on stage: "DATA CENTRES, ALL KINDS". The terrain mixes years (Ireland 2025, US 2023, others 2024): printed under each name.
The mesas are the data file's full-depth bands (every row of a place has its value); only their drawn depth is scaled.

## Choices a selector may want to reverse
- the 415 marks are a block of 20 x 21 that becomes four 3 x 3 towers (a bar chart in cubes); a flat waffle regroup was the other option.
- the ruler is a microwave-second and the mark is 0.864 of it; the bulb is an icon and a number, not a second ruler.
- captions 8, 9, 10, 11 and 23 were re-timed to the rungs and split (11a/11b, 23a/23b); caption 26 is "Per query? Per site? Per grid?"
  because the on-stage line carries the honest limit; no digit outside claims.json.
- s/frame, bytes and knob count: see the end of this file.

## Verdict block (final run, 2026-10-10, machine load average 12-27 from other lanes)
- gate.json: VERDICT PASS. G1-G11 PASS except G5c WARN (8 running counters: 247, 4,043, 59,213, 7,279, 42, 146 ...: the ladder's
  n = round(10^L) and the world count-in; final values 100,000 and 415 are claims). G11 PASS: 307 samples, 99 texts, no overlap, nothing
  across the caption band. G6 phone overflow 596/390 is the shell.
- frames.mjs: 307 frames (every 0.5 s), 1.019 s/frame under that load (<= 1.5), purity identical at 30.6, 76.5, 122.4 s, 0 errors.
- bytes: page 1,291,467 (< 1.3 MB: 8.5 KB of headroom: add nothing without cutting something); film code 79.2 KB (film.js 33.0,
  film.json 27.2, claims.json 19.0); lib/arsenal.gen.js 37.7 KB rides `libs`.
- knobs: 129 (90 of the film's own, 39 camera knobs through toKnobs); every one documented in film.json knobs_doc.
- sample: sample/sample.mp4, 10 s, 3840 x 2160, 300 frames (the first 10 s: HOOK). The gif step errors (-t 0) as the brief said.
- the page, film.js (generated) and film.json (generated by lib/mkfilm.mjs) are reproducible from lib/: node lib/mkfilm.mjs;
  python3 lib/assemble.py; python3 factory/kit2/build.py <dir> --brand ceti-boardwalk-dark --chrome none.
