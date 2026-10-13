# women-and-children · draft A · "the manifest" · NOTES (2026-10-10)

Look (from beats.md): brand ceti-boardwalk-dark, chrome none, material ink, level manager, renderer webgl, format feature,
dur 123 (120 s + CETI card), commit off (D11, `"commit": {"enabled": false}`), chapters HOOK 0-12 · CASE 12-58 ·
COUNT 58-108 · MONDAY 108-120. count.at 24.0.

## Register
A ship's manifest rendered as a city of 2,201 boxes, one per person, on a dark planked deck. A ledger strip (MANIFEST rule,
ABOARD / LIVED / DID NOT rows with dotted rules) carries the counts; the camera is a calm ortho orbit (3 degree sway, 60 s
period) whose only real move is the 90 degree turn that rides the split. The split is a slow re-berthing: the class berths
are outlined on the deck first (the empty crew-children berth among them, an honest zero with no pin), then every box
travels on its own arc into its berth. Pins read like ledger entries: "140 OF 144  97 %", class and group under it in mono.

## Chain (beat order) and who carries what
1. gl-stack-city (CASE 12-58): 2,201 boxes rise in three pooled columns (rate form: same height, width = how many, lit
   height = share who lived), survivors light bottom-up 29.8-32, pooled pins 36 (counts) / 37.5 (%), re-berthing 48.5-55.5
   with the turn; tags CHILDREN/THIRD/0 and MEN/FIRST/0 take the accent, a trail, a ghost and a riding pin.
2. gl-labels (CASE pooled pins, COUNT 58.4-84 and 100-108): `solve` over 3 pooled anchors, 11 slab anchors (crew children
   has none) and 2 reveal anchors, `sticky:'window'`, `reserve` for header, ledger, caption band; hard-cut callout
   64 (30 OF 30, with an SVG bracket over both children slabs) → 70 (27 OF 79) → 76 (57 OF 175) → 100 (192 OF 862).
   Drawn as kit2 SVG with data-role (own drawPl, not `kit()`: it splits count and % so the % keeps its own opacity).
3. gl-post (every frame tone map; reveal 84-100): the scene renders in linear light into `st.hdr`; per-face colours are
   pre-shaded in display-linear and sent through `toSceneLinear` (so shading survives the tone curve), the counted pair's
   lit boxes x glowGain, everyone else to maskDim, bloom 86-98, vignette in the reveal window, a slow push-in
   (fitReveal); MONDAY eases exposure to 0.55 with a faint glow left on the pair. Type after `apply`, flat.

## What I patched (module copies stay verbatim; lib/assemble.py CUTS, assembled copy only)
- gl-stack-city PATCH 1: pooled columns in rate form (`poolLayers`, `poolDepth`); the module's fixed `foot` made the
  children column one layer tall, so its lit share could not be read as height.
- PATCH 2: `arriveBy: 'slab'`: each column rises over the whole arrival window (b.ar per column, not per largest column).
  Consequence: the module's `check(t)` expected-box count assumes the unpatched order, so `check` reports ok:false during
  the arrival (12.4-23.6 s) only; boxes, homes, volume, height and unitsResidual 0 hold, and check is ok after arrival.
  The film's own counter is exact (ceil(arr * n - 0.5) per column, the shader's test).
- PATCH 3: export `api: {phase, boxAt, check, drawTags}`; demo data, treemap, module shader, camera, ground, pins and HUD cut.
- gl-labels: demo scene cut, registration reduced to `{ROLES, solve, drawGL, kit, project}`; no line changed.
- gl-post: rides film.json `libs` verbatim (no cut): inlining it put film code at 129 KB because claims.json is 44 KB.
- The empty slab (crew children, n 0) lays out cleanly: a 1 x 1 berth with no boxes; no anchor, no pin, outline only.

## Gate (one run + one fix round)
First run FAIL G8 (film code 129 KB). Fix round: gl-post moved to libs, film.json compact, framing (lookY 0.46, fit 1.42/1.30,
elev1 24) so the city clears the caption band, label priorities (the claims' slabs first), ledger leaves at 57 s.
Second run: VERDICT PASS. Remaining WARN:
- G5c: 12 running-counter values (ABOARD ticking 123 … 2,201 during the arrival, LIVED ticking 29.8-32): counts in
  progress, the final values are claims.

## Left, and why
- gl-labels crowds out 2 of the 11 slab pins in COUNT A (SECOND CLASS · MEN 14 OF 168 and THIRD CLASS · WOMEN 76 OF 165
  at most times; which two depends on the sway). Neither carries a caption claim; the claims' slabs have top priority and
  always show. More air costs either type below the floor or a smaller city. Knobs: pinSize, leader, maxShown, slabGap.
- Slab pin plates (0.72 dark) overlap neighbouring boxes and occasionally a neighbour's leader; plate is a knob.
- The HOOK and MONDAY type sheets echo captions c1 and c19 (beats.md asks for both); the honest line is only in c20.
- Class names are words on screen (FIRST, SECOND, THIRD, CREW): no stray digits from "1ST/2ND/3RD".
- Cells transcribed from memory (brief NOTES): unverified data, inherited.

## Measured
- frames.mjs: 247 frames every 0.5 s, mean 0.379 s/frame headless (SwiftShader 1920 x 1080), purity identical, 0 errors.
  Reveal frames with bloom are the heaviest (about 1 s in a single probe, unsynced).
- Page 1,282,818 B (< 1.3 MB); film code 108.1 KB (film.js 48.9, film.json 16.0, claims.json 43.2); 99 knobs.
- sample/sample.mp4: 10 s at 30 fps from t 0 (export.mjs, 3840 x 2160): the HOOK captions render in the video.
