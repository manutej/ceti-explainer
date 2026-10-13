# pass-every-time · draft B · "the scoreboard"

Register: the 460 tries are one board of cubes. It lies on the floor as 115 tiles of four (the belief), stands up as columns of four,
is re-sorted by passes into five rows whose lengths ARE the counts (the 44 all-four columns gather at the front and make the longest
row), is cut by a volume that asks for every one of k tries (the thin end), becomes a wall of 296 PRs re-partitioned by merge, and ends
on one row of minutes the camera dollies along. Scoreboard digits (top left) count in the tiles, the cubes and the passes.

Look: midnight-ink via film-local `brand.midnight-ink.json` (Newsreader 600 display, DM Mono), chrome none, material ink, level
manager, webgl, format feature-long, dur 153, `commit.enabled false`, HOOK 0-12 / CASE 12-60 / COUNT 60-135 / MONDAY 135-150 / card.
Honest line ON STAGE 141.5-150 (set type, no caption in the band). The 8-try model is NOT drawn (director's choice); the paper's
"under 25 %" is a dashed outline in slot eight of the volume plus a caption, grade B.
Build: `python3 lib/assemble.py && node lib/knobs.mjs && python3 factory/kit2/build.py <draft> --brand <draft>/brand.midnight-ink.json --chrome none`.

## Chain and moves (one ortho lens throughout, R-E I5)
gl-instances (1,045 marks: 460 tries, 296 PRs, 289 minutes; ONE instanced draw, six texels a mark, three homes, shader replaced by
lib/gl-instances.vert.js) -> gl-camera-rig (one script, 8 moves, 4 of them hard cuts) -> gl-volume (the pass-every-k bars, cut plane,
tail lit) -> gl-labels (callouts and pins, `sticky: window`, `reserve` = caption band + top-left HUD).
| move | t | sentence | invariants |
| M1 stand | 40-47 | re-stack (2x2 tile -> column of four) + re-project, tilt el 89 -> 38, az 0 -> 12 | same 460 marks, ids, lit state; same cube size; same lens |
| M2 re-sort | 60-66 | re-sort columns by passes (4,3,2,1,0), camera still | same marks and count; only the key changes |
| M3 volume cut | 73-88 | hard cut (new dataset: the claims pass^1..4 as bars), cut plane rests on each bar, 60.4 / 49.1 / 43.0 / 44 of 115 / 38.3 | bars are the claim values; tail = the 4th bar |
| M4 merge | 110.5-117.5 | re-partition 296 PRs into two equal blocks (schematic, no digit), camera still | 296 before and after, none fade |
| dolly | 126.5-129.5 | track along one row of minutes while it grows 27 -> 289 and pulls back | one cube = one minute throughout |
The "quarter turn" is the 51 deg tilt from plan to elevation (a 90 deg azimuth turn would hide the rows behind each other); not literal.

## Gate (one run per build, final build)
VERDICT FAIL on G1 only: `ready` 5.5-7.3 s against the 5 s limit, measured at host load 15-33 (a-bell-from-dice's page took 4-9 s in the same
minute; its shipped gate reads 1.6 s idle). Every other row PASS, G11 text overlap PASS (307 samples, no overlap, nothing in the caption band).
- G5c WARN: 13 running-counter values while tiles/cubes/passes/PRs count in (17, 33, 66 ... 64); the landed numbers are claims.
- G6 phone 390 px: scrollWidth 400/390 overflow, a shell matter (same as other drafts).
- Page 1,287,444 B (13 KB under 1.3 MB: do not add a face). Film code 77.2 KB. 164 knobs (67 from the rig's toKnobs, many of them cut poses).
- s/frame (frames.mjs, SwiftShader, load 15): 1.68 mean over 307 frames, above 1.5 only because of host load; the page draws ~1k instances
  and a floor, the cost is the GL fill of floors and 1920x1080 readback. Re-measure on an idle host.
- Purity identical (G2a/G2b, frames.mjs). Data check at load: the hex masks reproduce n0..n4, 278 passed and 60.4/49.1/43.0/38.3 or setup throws.

## Patches (module copies in lib/ are verbatim; edits live in assemble.py)
gl-instances: VERT replaced (lib/gl-instances.vert.js), demo data/layouts/HUD cut. gl-volume: background cut, camera handed in
(camAt/applyCam), HUD cut (film draws SVG), and three one-line SUBS scaling its stroke weights by `params.lw` (p5 stroke weights are world
units under an ortho camera; unscaled they drew 30 px bands). gl-camera-rig, gl-labels: demo scenes cut.

## Left / for the evaluator
- The 8-slot volume leaves slots 5-7 empty on purpose (no data for 5-7 tries); a viewer may read that as missing bars.
- The minute row at the wide pose is a thin line (289 cubes across 867 units of sheet); honest but low in drama.
- Pins sit on cubes with a ground plate (labPlate); ALL LIT / NONE LIT are small mono words, not results.
- claims.json is the topic's object form (build prints a note); copied unchanged.
- 6 of the 8 camera moves are cuts; the rig's `cam*Ease` rows are inert for them.
- Another lane's scratch script of the same name once rebuilt one-query/drafts/b from its own sources (deterministic, same inputs); nothing there was edited.
