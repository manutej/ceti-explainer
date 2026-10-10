# pass-every-time · draft A · "the test floor" · notes

Brief: factory/topics/pass-every-time/{brief.md, beats.md, claims.json (copied unchanged), data/}. Wave AI-STORIES (factory/WAVE-AI-STORIES.md).
Look: brand midnight-ink via the film-local copy `brand.midnight-ink.json` (build.py prefers it; Newsreader 600 display, DM Mono), chrome none,
material ink, level manager, renderer webgl, format feature-long, dur 153 (150 + 3 s card), `"commit": {"enabled": false}`, chapters HOOK, CASE, COUNT, MONDAY.

## Register
A test floor seen from above. 115 task tiles drop onto a faint grid, four cubes per tile (460), 278 light gold: the "60 % lit" picture. The camera
lowers to the side and the SAME 460 cubes stand as one column per task (lit tries at the base of each column, so a column is bright to the top only
if all four passed). Columns re-sort by tries passed; a translucent plane rises to the all-four bar and every column below it dims (none removed): 44
stay bright. Then 296 PR cubes re-partition into two equal blocks (schematic, no digit on the split), and the horizon is two columns of minutes
(27 and 289, one cube a minute, 9 wide). Bookend: the camera rises back to plan over the dimmed floor, where only the 44 bright tops show.
No simulated eight-try readout anywhere (director's choices): the paper's sentence is a caption and one plate marked "not these cubes".

## Moves (R-E sentence, invariants)
| id | t (s) | sentence | I1 same marks | I2 same count | I3 / I5 |
|---|---|---|---|---|---|
| M1 | 40-47 | re-stack (2x2 tile to 1x4 column) + re-project (el 89 to 30) under an 18 deg orbit | cube ids and lit state fixed (data baked once) | 460 cubes before and after (`__pet.count`) | edge fixed; fov 28 fixed |
| M2 | 60-66 | re-sort the 115 columns by passes, camera still (drift <= 1 deg) | same cubes, columns keep their order inside | 115 columns | same |
| M3 | 73-77 | slice: plane rises 0 to the all-four bar; dims, never removes | none added or hidden | 44 of 115 is `QS.filter(q=>q===4)`, asserted at load | same |
| M4 | 110.5-117.5 | re-partition 296 PRs into two equal blocks | 296 before and after | exactly 148 / 148 | same |
Cuts (new datasets, labels hard-cut too): 100 (PR floor), 121 (minute floor), 135 (back to the tau floor, then an orbit to plan 135.4-139.6).
Starts: 40, 60, 73, 110.5, 135.4 (gaps >= 12 s; T2 holds). Every landing is a stored key (rig `at` is pure of t).

## Chain (narrowed, never widened)
- gl-camera-rig: verbatim copy, demo cut; every camera key is a script compiled in setup from knobs (orbit, three cuts, one orbit back).
- gl-labels: verbatim copy, demo cut; every pin and callout is `solve`d in screen space with `reserve` rects (header, caption band y >= 418, legend, the
  projected field box at each rest pose) and the hard-cut callout; drawn as kit2 SVG with data-role. The callout scenes pass the anchor list as a
  function of t that returns only the anchor the callout follows (maxShown > 0 would otherwise show ordinary labels).
- NOT used: gl-instances (no second layout: it cannot re-project the same marks; 1,187 marks need no instancing) and gl-volume (its cut plane lives
  inside its own histogram scene). Replaced by this film's own baked geometry (the technique of gl-stack-city: five faces per cube, homes A/B/C as
  per-vertex properties through `_userVertexPropertyHelper`, a private p5 API: re-test on a p5 upgrade) and a cut plane that follows gl-volume's rule
  (dim, never remove, count snaps to a column edge). No gl-post (no bloom, no tone map, ink and clean).

## Deviations from beats.md (knobs, all documented)
gridCols 12 (rows 10) instead of 23 x 5: a squarer field leaves side margins and keeps the 4-cube columns readable from the side; side elevation 30
instead of 24 (back rows show their top cube, which is the bright-or-not signal). The model layer and its 92-97 s readout are dropped (director); the
gap 82.5-100 s holds the pass^k ratio row (60.4 / 49.1 / 43.0 / 38.3, all grade A, each after the counts) and the paper plate. PR sheet and horizon are
perspective at fov 28 (not ortho): I5 same lens across the whole film.

## Claims and grades
All digits on screen are film.json params copied from claims.json (A: 115, 460, 278, 60.4, 49.1, 43.0, 38.3, 44, 22; B: 296, 80.9, 25, 27, 4 h 49 min,
50, 80, about half, about 10x). `trial` (115 nibbles, one bit per try) is the published per-task outcome table; setup throws if it disagrees with the claims.

## Honest line
On stage, MONDAY 141.5 s, roled SVG text (must-read): "One 2024 model, and agents that could not revise: newer ones may do better." No caption shows after 141.

## Gate (factory/tools/gate.mjs, `--quick`: G5c and G11 sampled every 1 s) · VERDICT PASS, G1-G11 all PASS
- G11 text overlap: PASS (154 samples, 73 distinct texts, nothing across the caption band). A first run found three callout-number x sub-line WARNs (descenders
  on the second line); fixed with the `subGap` knob (3 units). The non-quick 0.5 s G11 sweep was not run: the shared host sat at load 20-36 and a full
  gate takes over 25 minutes there (one run was killed at its time limit). Re-run `node factory/tools/gate.mjs ... ` without `--quick` on a quiet host.
- G1: the first run FAILed only on `ready 6332 ms` (limit 5000) at load 25; the re-run says ready 3323 ms and PASS; standalone ready is about 1.6 s.
- G6 reports the live shell overflowing at 390 px (scrollWidth 400): the shell, not the film.
- s/frame 1.27 under that load (frames.mjs, 307 frames; about 0.5 s expected on an idle host); purity identical; errors 0.
- Bytes: film.js 57.8 KB, film.json 20.4 KB (130 knobs), claims.json 12.6 KB (copied unchanged; object form, build prints a note) = 90.8 KB code; page 1.241 MB.

## Left (for select / revision)
- The sorted columns stand as gold stripes plus dark tops because every column is four cubes tall (lit at the base); a failed try is a dark cube, not a missing one.
- Callouts for the sorted block sit in the top band above the field (anchors on the back row); on a taller field they would need the side margin.
- The PR split is two equal blocks by a seeded shuffle (schematic, marked on stage); the minute columns are 9 cubes wide, so the stray 289th cube sits alone on top.
- The sample MP4 is the first 10 s (HOOK type over the empty floor) because export.mjs has no start offset.
- Build: `python3 lib/make_film_json.py && python3 lib/assemble.py && python3 factory/kit2/build.py <draft> --brand <draft>/brand.midnight-ink.json --chrome none`.

## After tier 1 and tier 2 (ship state)
Rounds r1 (12) and r2 (5) applied by factory/tools/apply_findings.py; tier-2 film.js revision in REVISION.md (edits in
lib/revise_t2.py). lib/make_film_json.py now refuses to write film.json: film.json is the source of truth. Director seat in
seat.json; measures in MEASURES.md.
Data caveat: numbers were read from search snippets (egress blocked); re-verify tau-bench, METR 2025 and the PR study before
public use. The simulated 8-try model (claims modelAll8*) is not on stage.
