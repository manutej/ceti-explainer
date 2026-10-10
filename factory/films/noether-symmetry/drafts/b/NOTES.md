# noether-symmetry · draft B · "the glass box"

Register: the 3,000 orbit states live inside a measured glass cube (edges, unnumbered ticks, a floor grid) whose axes are named in
plain words ("how far across / deep / up"). The big move is a CUT, not a flight: at 60.0 s the axes re-label in one frame ("spin arrow,
across / deep / up") and the same 3,000 dots slide to their new places while the camera HOLDS. The Earth fixture is a close-up on two
marks drawn as dots beside a Sun mark; distance x speed is run twice as a formula whose two numbers fly in from their pins. After the
shells: a slow dolly in with a section plane at the equator (62 orbits, 620 dots lit, the rest dimmed, never removed); a second re-label
(shells to energy layers) under a quarter turn; a pan to a second glass box where the training cloud repeats the move; a wide frame with
both boxes; the honest line on stage as set type (141.5-150 s, one line, no caption).

Look: brand ceti-coastal-dark, chrome none, material ink, level manager, renderer webgl, format feature-long, dur 153 (150 + card),
`commit.enabled false` (D11). Chapters HOOK 0-12 · CASE 12-60 · COUNT 60-135 · MONDAY 135-150. count.at 26.0.
Build: `python3 lib/prep.py && python3 lib/assemble.py && python3 lib/mkfilm.py && python3 factory/kit2/build.py <draft> --brand ceti-coastal-dark --chrome none`.

## Chain
gl-pointcloud (patched copy) -> gl-camera-rig -> gl-labels. formula-bind was NOT used (narrowed, recorded): its `product` form multiplies two
COUNTS into a grid, and distance x speed are measured values (147.095 x 30.29); the film runs the card's own moves (set, bind, fly,
compute, with the term numbers travelling by id from their pins into the formula slots) in SVG with K.tx.
- gl-pointcloud, patched (F4 of the brief): lib/gl-pointcloud.js stays verbatim; lib/pc-morph.js replaces its body from `const VERT` in the
  assembled copy only. Per-point home coordinates (aPosition = place home A, aVertexColor = spin home B + a stagger), a `mix` uniform for
  A to B (uM1) and B to C (uM2), where C (energy layers) is derived in the shader from B and the class; a lit band on B (|B.y| < band |B|, so
  all ten dots of an orbit light together); one orbit highlight; a reveal order. Same 3,000 vertices all along: no dot fades, adds or
  leaves. Two clouds (orbits, training), a 3-dot cloud for the Earth pair and a 528-dot torus for the wordless smoke-ring plate.
- gl-camera-rig: demo scene, dof, sample and knob-row code cut. Landings are stored keys (T8): `key` moves for the Earth push, the pull-back,
  the pan and the wide frame; a rig `dolly` and `orbit` for the section and the quarter turn. A sway of 0.8 deg (knob, 0 = still) from 16 s.
- gl-labels: demo scene and drawGL cut. Pins are solved in screen space per "page" of anchors (sticky window), drawn as SVG with a plate.
  The Earth pages reserve the Sun disc; the cloud pages reserve the left HUD column. No pin while the camera moves.
Data: lib/prep.py packs data/orbit_table.json (int16, rotation x 32767) and data/network.json (PCA weights as int8, step 0.025; each run's
invariant triple as int16 x 10000, the mean over its 30 steps) into lib/data.js (23 KB). The page rebuilds the 3,000 orbit states with the
Kepler solution in setup and CHECKS the section: 62 orbits in the band (claim cutOrbits) or setup throws (`window.__noether`).
Honest on the data: the training dots' invariant is drawn as the run's mean (its drift, median 0.00095, is below a pixel at this scale and is a
claim from recompute.py); the weight picture is quantised and carries no axis reading; the "Earth" marks are two extra marks, not two of the 3,000.

## Gate (one run after the fix round)
VERDICT PASS. G1-G4, G5a, G5b, G6-G11 PASS; G11 clean (307 samples). First run failed G5b and G11; the fix round:
- G5b: the gate masks short renders ("6", "5 layers") inside longer numbers, so "620" and "1869" in captions read as unknown. Captions
  reworded without them (620 lives on stage in SVG; the Kelvin year is dropped). Brief/claims untouched.
- G11: the two flying numerals started on the same point; they now start at their own pins.
- G5c WARN: 10 running counter values in the count-in (14-26 s). Counts in progress; the landed 3,000 is a claim.
- G6 note: phone 390 reports scrollWidth 741/390 (shell, not film).
Size: film code 64.9 KB (film.js 31.9 stripped, film.json 16.2, claims.json 16.8), page 1,290,706 B (9 KB under 1.3 MB: no new face or lib).
Cost: frames.mjs 0.324 s/frame, purity identical at 30.6/76.5/122.4 s, 0 errors. Knobs: 85 (every time, camera key, size, dim, label, type).

## Left open
- The HOOK is the empty cube plus two type lines: still by law, but sparse.
- Axes say "how far" for all three place axes; "how fast" appears only on the Earth speed pins (the cube shows place, not speed).
- Colour is energy level (a cool-to-pale ramp from the pack roles); five levels are close in value on a dark ground.
- The section dolly stops outside the shells (900 was too close and cropped the cube); "through the shells" is the plane, not the eye.
- Smoke ring: one picture of dots, no words; caption only. Samples: sample/sample.mp4 = first 10 s (HOOK); sample/sample-cut.mp4 = 59.5-69.5 s (the cut).
