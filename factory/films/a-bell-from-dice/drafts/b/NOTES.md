# a-bell-from-dice · draft B · "the rain"

Look: brand midnight-ink (film-local copy `brand.midnight-ink.json`, passed to build.py by path; film.json look.brand
`midnight-ink`), chrome none, material ink, level manager, renderer webgl, format feature, dur 123, commit off (D11:
`"commit": {"enabled": false}`), chapters HOOK 0-12 · CASE 12-58 · COUNT 58-108 · MONDAY 108-120.

Build: `python3 lib/assemble.py && python3 factory/kit2/build.py factory/films/a-bell-from-dice/drafts/b --brand factory/films/a-bell-from-dice/drafts/b/brand.midnight-ink.json --chrome none`

## Register
Rolls fall as marks from above into six flat bins by the first die (the count-in is the rain: roll i is instance i,
`count(t)` = k shows rolls 0..k-1); the camera cranes up to a plan view and the SAME marks travel into 26 columns by
sum; the camera comes down a quarter turn and the bell rises like a skyline; it pushes in on the right edge, where the
five tail columns are the last lit street; then the sums as counted cells (x = sum, z = first die), a cut that counts
RIGHT of itself down to 1,655 at the 25 | 26 edge, and the exact bell as a glass outline the counted bars fill.

## Chain (three WebGL lanes, each carrying a beat) + gl-labels solver
- gl-instances (R17): the 100,000 marks, one chunked `model(geom, n)` draw (256 boxes per instance, top + front faces
  only), data texture uploaded once (`upload`, premultiply off). Carries the count-in (24.0) and the flat first die (34).
- gl-camera-rig (R22): one script in film.json `rig`, compiled from knobs through `fromKnobs(F.rig, K.knob, scene)`;
  all 46 `cam*` knobs come from `toKnobs` (t0/t1/ease + shape per move). Carries plan -> side (50-55: the bell is
  revealed by the move) and the push into the tail (58-63). It also drives gl-volume's camera (patch below).
- gl-volume (R24, `hist-2d-slabs` shape): 26 x 6 counted cells (sum x first die) from the same stream, sorted
  transparency, the cut, the tail snapped to 25.5 (lit cells sum to 1,655). Carries the cut and count 2 (76.0).
- gl-labels: `solve()` only (sticky 'window', hold/leader knobs), pins emitted by the film as K.tx/K.ln with roles.

## Re-partition: route a (two homes per mark)
Each mark carries two texels: its first-die slot (xyz + a re-sort delay = its layer in the sum column / max layer)
and its sum slot (xyz + a tail flag). The film's own two-home vertex shader (film.src.js `VERT`, SEATS-GL fix 3)
mixes them on t (`sortT0`-`sortT1`, `sortStagger`, `sortLift`); the module's FRAG, chunk geometry, upload and
`drawMarks` are reused. Identity is kept: no mark is redrawn or re-counted, the count stays the instance range.

## In-film assertion
setup() regenerates the 500,000 draws (brief.md generator verbatim, seed 1733) and throws unless all 26 sums, the 6
first-die piles, roll 0 (sum 18) and the checkpoints at k = 1 … 100,000 (data/checkpoints.json, copied into film.json
`checks`) match count for count. `window.__bell` reports the result. Nothing numeric is shipped as roll data.

## What I patched in module copies (all as assemble.py CUTS on the generated bundle; lib/*.js stay verbatim)
- gl-instances: demo, density, brush/pick, hud and the module's own camera cut; export `api {FRAG, TEXW, STEP, FACE,
  upload, frontAt, countAt, drawMarks, rgb, norm}`; its VERT is replaced by the film's two-home VERT.
- gl-camera-rig: demo scene cut; export `rig`.
- gl-volume: (1) camera from the rig: `params.camAt(u)` returns the rig pose (2 lines); (2) `params.cutX`: a 2D
  volume can cut along x (the sum axis) instead of z (2 lines); (3) the WEBGL-text inset is a no-op (the inset and every
  readout are SVG through K.tx, so the LEFT/RIGHT "smallest face" WARN of SEATS-GL does not arise); demo variants cut.
- gl-labels: drawing and demo scene cut; export `{ROLES, solve, project}`.

## Assembly and budgets
`lib/assemble.py` writes `lib/arsenal.gen.js` (four modules, cut + stripped, 48.0 KB) inlined through film.json
`libs`, and `film.js` (film.src.js behind a header). Reason: claims.json alone is 43.7 KB of the 120 KB film-code
budget, and the four GL modules inline would put film code near 150 KB; libs count toward the page (1.27 MB < 1.3 MB),
not G8 code. Assemble twice: identical bytes (checked).

## Deviations from the brief (flagged for SELECT)
- **tailPctSim**: claims.json value is 1.7 (1,655 / 100,000 = 1.655 %, Math.round(16.55) = 17), but its `renders` and
  brief.md / caption 17 say "1.6 %". This draft shows the claim value: "= 1.7 %" on screen and caption 17 "That is
  1.7 %."; the exact share stays 1.6 % (tailPctExact, 1.62 %) and is not printed as a ratio. The brief's
  `renders: ["1.6 %"]` on tailPctSim should be corrected to "1.7 %".
- Caption 7 reworded (the rain already sorts by the first die): "Each roll fell into the bin of its first die."
  Caption 23 shortened to the 60-char limit: "Fair, independent dice. Linked parts break the bell." (the full honest line
  is film.json `honest`).
- The tail push centres on sum 24 (camTailTarget 19), not 26, so sum 18 stays at the left edge for scale (beats.md asks
  for both; with the side azimuth the lookat on 26 pushed 18 out of frame).
- No 16,667 / 3,846 labels pinned on the lines themselves (they collided with the pins): each line has a fixed legend
  "THE LINE: …" with a swatch.
- LEFT of the cut is not printed (98,345 is not a claim); only RIGHT ticks, landing on 1,655.

## Gate, frames, warnings (after one fix round)
- gate.json: VERDICT PASS, G1-G10. Only WARN: G5c, 14 running-counter digits during the count-in, 12.4-24 s (counts in
  progress; the final 100,000 is a claim).
- frames.mjs: 247 frames, mean 0.457 s/frame headless, purity identical at 24.6 / 61.5 / 98.4 s, 0 errors (first
  build 0.384 s/frame). Page 1,269,692 B; film code 101.9 KB (film.js 30.4 + film.json 28.9 + claims.json 42.7).
- Knobs: 122 (76 film, 46 `cam*` from the rig's toKnobs). sample/sample.mp4: the first 10 s at 30 fps (export.mjs; gif skipped).
- Fix round 1 (the only one): square column footprints (10 x 10) and bins (16 x 12, gap 100), a near-orthographic plan
  view (fov 14, r x2), the side view re-centred, the tail push re-aimed (sum 18 stays at the left edge), volume poses as
  rig `key` moves (pull / aside) framed to clear the count and the captions, fixed legends for the two muted lines,
  the inset's equal-odds words leaving as the glass arrives, the ratio set beside the count, a plate under the notes.
- Left open (for SELECT): at 98-108 the floor word "ROWS BY FIRST DIE" touches the inset's left edge; "= 1.7 %" sits
  tight against "1,655" (the gap knob is the countSize-based offset in film.src.js, not yet a knob); the plan view
  (44-47) is still a thin band of 26 footprints, so the re-sort reads as a slide more than a rain; the stacks fade
  through dark silhouettes for 0.8 s at 65.4-66.2.
