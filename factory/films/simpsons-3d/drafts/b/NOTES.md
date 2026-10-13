# simpsons-3d · draft B · "the exhibit"

A dark gallery, two sculptures of boxes lit from one side (key light from the front-right, a pool that follows the camera down the rail),
a reflective floor, a dolly along a rail. One box = one applicant: 2,691 men (coral) and 1,835 women (violet), 10 x 6 boxes per layer.
Brand ceti-boardwalk-dark, chrome none, material ink, level manager (the neon post is not exec-clean, Q6), renderer webgl.

## Beats (75 s: 72 s material + 3 s brand card)
| t (s) | beat | what the frame does |
|---|---|---|
| 0-8 | HOOK | camera pulls back from two empty plinths; "New sales process / Converts worse overall."; KILLED stamp at 4.4 and the gallery lights drop |
| 8-16.5 | COMMIT | lights up, kit2 commit box (default 5), MEN / WOMEN named on the plinths |
| 16.5-36 | CASE | both towers rise at the same layers per second (a clip plane in the shader), counters ride the tops (exact counts per layer), then the admitted boxes light bottom to top: "1,198 / 2,691", "557 / 1,835". No percentage yet. |
| 36-62 | COUNT | 36: headline numbers morph in, 45 % and 30 % (arsenal morph-type kernel); 40-44: six slabs per tower hop off the stack onto the floor while the camera swings out (40-46), then closes on pair A; 46-57: the camera slides along the rail one pair per 1.9 s and both headline numbers morph pair to pair (62/82, 63/68, 37/34, 33/35, 28/24, 6/7); 57: pull-back, the higher column of each pair glows, "WOMEN HIGHER IN 4 OF 6", YOU (5) against TRUTH (2); neon post on the reveal frames only (57.4-60.6) |
| 62-72 | MONDAY | "Same mix of leads?" "Split by segment. Then compare." over the slow-drifting row |
| 72-75 | BRAND | kit2 brand card (takeaway) |

## Gate and cost
Gate (`node factory/tools/gate.mjs ... --kit factory/kit2`): **PASS**, 15 rows PASS, 1 WARN (G5c: the running tower counters 300, 253, 480 ... while
the towers rise; they are counts of boxes on screen below the claimed 2,691 / 1,835, by construction; gate.json is in this folder).
Page 1,251,776 bytes (< 1.3 MB; p5 and fonts dominate), film code 75.1 KB. Purity G2a/G2b identical on re-seek.
Seconds per frame (frames.mjs, headless SwiftShader, 1920x1080, seek + render + GPU sync, other drafters sharing the machine): **0.615 s** mean over 151 frames (< 1.5 s); the neon reveal frames cost more (about 2 s each, filter pass). frames/ holds 151 thumbs and 13 contact strips; frames.json purity identical at 15, 37.5, 60 s. Gate wall time 2 m 39 s.

## How it is built (lib/)
- `exhibit.js` (mine): baked `buildGeometry` slabs (24 models: 6 departments x 2 sexes x lit/dim), one role-fed shader for boxes, one for room surfaces,
  keyed camera rig (az, el, distance, target on two `camera.api.sample` tracks, log-zoom = distance), neon filter (two golden-angle spirals).
  Techniques adapted from `webgl-scene` (baked tiers, role Lambert shader, slerp-style keyed camera, worldToScreen pins) and `shader` (neon taps);
  `webgl-scene.js` and `shader.js` are provenance copies in lib/ and are NOT assembled into film.js (their draw/setup are demos of a 1,000-box field and a coded P2D layer).
- `camera.js` copied verbatim and assembled with the demo scenes cut (api.sample only); `morph-type.js` copied verbatim except ONE line: `P.kit = {...}` exports its pure contour-morph kernel, which film.src.js drives into a p2d layer and shows as a flat image.
- `headline-font.js`: Fraunces 300 italic (vendor woff2, OFL), subset to 0-9 % . , and converted to TTF with fontTools (3.9 KB) because the 3D fonts in arsenal/fonts have no Fraunces. Recipe: fontTools.subset with text `0123456789%., ÷/-+`, flavor None, base64 data URL.
- `film.src.js`: timeline, pins (SVG text through K.tx at `p.worldToScreen` points, so the gate reads them), HUD, claims plumbing. `assemble.py` concatenates (strips comments) into `film.js`; edit lib/, never film.js.
- Rebuild: `python3 lib/assemble.py && python3 factory/kit2/build.py <this dir> --brand ceti-boardwalk-dark --chrome none`.

## Knobs (film.json.knobs, 52, all with a knobs_doc row; read through K.knob)
Camera: camFrontAz/El/Dist, camHookDist, camSideAz/El/Dist (rail), camWideDist, camFov, tHookEnd, tDollyStart/End, trackStart, pairStep (dolly speed along the rail = slabGap / pairStep), pairHold, tWide, tWideEnd, dollyEase, morphDur, morphLead.
Light: lightAz, lightEl, lightReach, keyStrength, ambient, fogDensity, reflect, roomSize. Boxes: boxSize, slabGap, towerX, splitX, liftArc, railX, tBuild0, buildRate, tAdmit0, tAdmitDur, glowStrength, tUnstack0 (keep equal to tDollyStart), unstackStagger, unstackDur.
Type and post: headSize, headX, headY, tReveal, neonStrength (0 turns the post off), neonRadius, neonThresh, neonCore, neonT0, neonT1. Caption timings live in film.json.captions.

## Known limits and warnings
- Neon: the filter's gain is far more sensitive than its code says (0.015 of gain already lifts the lit boxes 25 levels); the shipped gain constant is 0.04 per unit of neonStrength; do not push neonStrength above 1.5 or the lit boxes clip to white. Not understood why (a p5 filter-uniform scale?); the look at 1.0 is a soft halo.
- Pooled towers are stacks of six department slabs, so the lit boxes show as stripes, not one lit base; the 45 % vs 30 % is carried by the headline numbers, the height difference by the column heights (48 vs 33 layers, ragged by up to a layer per slab).
- In the rail shots one pair is centred but its neighbours are large and close (camSideDist 380); raise it for a calmer frame. Department letters sit on the far floor and can touch a block label.
- Tower counters are running numbers (G5c WARN, by design). HOOK and COMMIT are two small plinths in a dim room: quiet by intent, low information.
- The 3D view is not exec-clean (Q6): level manager.
