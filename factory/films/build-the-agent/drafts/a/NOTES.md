# build-the-agent · draft A · "the four plates" · notes

Brief: factory/topics/build-the-agent/{brief.md, beats.md, claims.json, data/} (Wave RELIABILITY film 1, "The Builder"). Look: brand ceti-neosage-dark (film-local
copy, see Deviations), chrome none, material hero, level manager, renderer webgl, feature-long 153 s (150 + 3 s CETI card), beat 0.5, commit off (D11),
`cuts: []`. Build: `python3 lib/make_film_json.py && python3 lib/assemble.py && python3 factory/kit2/build.py factory/films/build-the-agent/drafts/a --brand ceti-neosage-dark --chrome none --material hero`.

## Register: the four plates
A dark bench with four low plates in a row: airline, retail, telecom (each a grid of scenario tiles, one tile = one customer case, 67 / 134 / 119) and banking
(empty at first, the fourth plate). Each tile carries a 2 x 3 footprint of six cubes, one per build; 968 of the 1,920 are lit amber (the recorded pass bits, read
from data/hyper-tau-matrix.json, never sampled). Moves: M1 re-stack + re-project (2 x 3 footprint to a 1 x 6 column, el 89 to 30); M2 re-sort the 320 columns into
seven bands by builds that passed (the luck roofs, drawn as lavender slabs of band depth luck_k / 6 rows, arrive over the real bands); M3 the cut plane at six of six
(the columns below it dim, never removed); J1 the 119 telecom columns leave the block for a new telecom plate; M4a the 714 telecom cubes re-stack into six tanks by
build (lit first, bottom up, 26.1 % to 52.1 %), M4b re-partition into three tanks by kind of problem (11.6 / 39.9 / 67.7 %); J3 the camera travels to the board
carrying the plane, which lands as the zero level; 53 task tiles on the same four plates (6, 6, 6, 35), slabs rise to the best build's four scores, the plane
rises to 23.9; the expert's ghost slabs rise and the expert's plane DESCENDS from above the frame onto 82.2 (spring-hero); a push to the banking slab (5.9 vs
79.8); J4 to the call sheet (15,885 cells, one textured plane, the plane sinks to be its backing plate); the 43 questions stand up as real cubes; a tilt to the
Monday view, the question and the one limit as set type on the empty floor above the sheet. Camera: 10 moves, 4 carried joins (hook pull, J1, J3, J4), spring z .83
+ a damped landing sway; ambient drift on holds only.

## Chain (narrowed, never widened)
- gl-camera-rig: curves (motion-curves tokens) + worldToScreen only. assemble.py cuts the easing copies, the script compiler, knob rows and the demo scene in the
  assembled copy (3 KB left). The poses/moves are this film's own `poseAt` (the reference film's approach), 10 moves from knobs.
- gl-labels: `solve` for every callout (reserve rects: header, caption band, legend, the projected marks at each rest pose). Pins that have no room in the
  solver's 24 candidates (the tanks, the roofs, the board plates, the banking slab) are placed by hand with the same placement fields (`mpin`). drawGL and kit cut.
- text-reveal (K.reveal + pattern): every label, readout, count-in (tenths, landed counts only), land (ratios), the 3-frame landing rings (8).
- gl-look via `--material hero`: ladder floor, key/fill/rim, AO, planar + ambient shadow (trailing 3 frames), grain, bloom 0.1 on the glowing marks only.
- NOT used: gl-instances (the marks re-home six times and need id-stable per-mark keys; the reference film's baked-geometry route, six home positions per mark
  as per-vertex properties through the private `_userVertexPropertyHelper`: re-test on a p5 upgrade) and gl-volume (its cut plane lives inside its own histogram;
  the cut and the score planes follow its rule: dim, never remove, count snaps to a column edge). The sheet's 15,885 cells are one analytic plane (shader), not
  instances.

## Deviations from beats.md (all knobs/constants, listed)
- Hook pull-back 10.5-12.1 (the wide plan needs to be there at 12.0): the hook is still to 10.5, not to 12.
- Dark / full macro pins: camera pushes 62.5-64.1, pans 67.0-68.6, pulls out 71.5-73.1, so the luck roofs arrive 73.5-76.0, pins 76.0-78.5 (M3 79.0 unchanged).
- Board block moved 1.5 s earlier (J3 104.0), the banking push added (123.0-124.6, pins 125.0), J4 128.0-129.6, count 4 130.0-133.5, the 43 light 136.0-137.5,
  the 0.27 % lands 142.5 (4.5 s after its count), tilt 140.5-142.1. Captions re-timed to fit (holds all >= 1.3 s + 0.06 s/char, starts on the 0.5 s grid).
- Callout sub-lines are short words (the legend carries "one tile = one case").
- Banking is an empty plate on the bench from the start (named, never counted) and a slab on the board.
- The luck roofs use luck_k per band as geometry only (recompute section 1: 8.8, 36.0, 68.8, 85.9, 73.9, 38.1, 8.4); only the two ends carry a digit (claims).
- The 43 question cells sit at seeded cells INSIDE their own build's block of the sheet (the data holds per-build counts, not call positions): `seedAsk`.
- Honest line on stage once (144.5-149.5), two rows at 20 u, whole, in amber.
- claims.json: the 40 claims unchanged + four list-valued count-in claims WITH formulas (countTiles, countTries, countLit, countCalls: the landed tenths a counter can
  show) so G5c passes; lib/make_film_json.py writes them.
- brand.ceti-neosage-dark.json (film-local, the kit's sanctioned "face swap"): identical to the library pack except `type.body` = Space Mono 400, so the unused DM Sans
  400/600 are not embedded (-38 KB). Without it the page is 1.318 MB. Nothing in the film sets the body face.
- film.json `type.disp` = Newsreader only so the kit's display-face compensation reads 1.0 (Fraunces is not in its metric table and would shrink every display text to 0.66).

## Gate (factory/tools/gate.mjs, full, 0.5 s G11 sweep) · rows PASS except G1 on load
G2a/G2b purity identical, G3 clean, G4a-f PASS, G5a 44 claims (43 formulas) recompute, G5b, G5c PASS (every visible number is a claim), G6 PASS (phone 390 overflow is
the kit shell, as in the reference film), G7 PASS (count 12.5, first ratio 34.5), G8 PASS (code 105.4 KB: film.js 68.9, film.json 19.9, claims.json 16.6; page
1.280 MB), G9, G10 PASS, G11 PASS (307 samples, 120 texts, no overlap, nothing in the caption band), G12 PASS (56/56 starts on the grid = 100 %, captions 31/31 hold).
G1: the only FAIL is `ready` 7.0-10.8 s (three runs) against a 5 s limit while the host ran at load 25-39 on 4 cores (three gates and several exports in parallel); standalone
the page is ready in about 2 s (bake 0.18 s, look 0.07 s: the film's own setup is cheap; the reference film measured 8-12 s on the same host at the same time).
Re-run on a quiet host (the full sweep takes 35-40 min at that load).

## Left
- The cut plane and the zero-level plane read as a pale slab in mid-travel (J1, J3); lowering `planeAlpha` / `lineLav` flattens them further.
- The 43 question cubes are small in the wide plan (5 units); they read in the Monday tilt.
- The knob table has 164 documented knobs; the layout and grade constants live in film.src.js between the `/*KC*/` markers (written by make_film_json.py).

## Frames, preview, cost
- frames/ (frames.json committed; strip-01..26.png every 0.5 s with shutter 0.35, 4 samples): errors 0, purity identical at 30.6 / 76.5 / 122.4 s. s/frame 20.3 headless
  with the 4-sample accumulation on a host at load 35-55 (the first idle-host single-sample stills took 1.4-3 s); a held single-sample frame is about 0.5 s of GPU work.
  Thumbs for every beat looked at: hook, plan count-ins, M1, columns callouts, M2, macro bands, luck roofs, cut, J1, both tank sets, J3, board, slabs, planes, banking, sheet, 43, Monday, card.
- preview/build-the-agent.preview.mp4: 1920 x 1080, 4590 frames at 30 fps (153.0 s), H.264 crf 16, 2-sample accumulation (page mode, shutter 0.35). Rendered at 4K css-scale
  by export.mjs's defaults (viewport 1920 x 1080 x dsf 2) and downscaled with lanczos at the mux, so it is 2 samples x 4x pixels; PNG frames deleted after muxing.
  Export notes: the shared host (load 40-70) killed several browser pages mid-export (blank WebGL frames, 794 of them found by file size and re-rendered; none remain);
  the exporter's own "verify" line printed DIFF for the first frame of some windows where the page had just been (re)started, while direct re-renders of 118.4 s,
  57.9 s, 91.8 s and 134.0 s are byte-identical (purity: gate G2a/G2b and frames.mjs agree).
