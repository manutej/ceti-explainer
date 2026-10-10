# noether-frontier · tier-2 revision (Opus, 2026-10-10)

Input: SELECT.md "Beyond scope, updated" (items 1-7), the v2 director's note's text and point-cloud rules, beats.md (tags binding),
the round-1/2 findings. Edited: lib/film.src.js (re-assembled into film.js), lib/gl-boxes.js (one `tilt` option), film.json
(knobs, knobs_doc, two captions and one panel row, all in place), lib/build.sh, lib/mkfilm.py (guard). claims.json is unchanged,
because no new digit reaches the screen. Before and after frames: revision/before-after.jpg (84, 92, 113 and 132.5 s).

## Build fix (do this first)
- lib/build.sh pointed at `drafts/a` and ran lib/mkfilm.py first. mkfilm.py writes film.json from draft A's defaults, so a rebuild
  would have silently undone rounds 1 and 2 (11 knobs and captions 25 and 32). build.sh now runs assemble.py, then `node --check`,
  then kit2 build.py on factory/films/noether-frontier. mkfilm.py exits with a refusal unless it is given `--overwrite-film-json`.
  From now on, film.json is the source.

## Items, in SELECT's order
1. **The slide as a mark (80-88 s). DONE.** Each layer now has one followed neuron: knobs follow0-follow4 = units 115, 51, 32,
   368 and 314, picked for long, smooth paths (chord about equal to the path length). Each has a drawn head: a white disc
   (headR 4.5) with a thin ring (headRing 2.2) that travels the neuron's own path in the sum picture, over a lit trail
   (cometLen 25 % of the path) and a faintly lit path (pathBase 0.45). The other 475 neurons keep their layer colour, sunk
   by dimOthers 0.6, so they no longer turn into a grey bar. The head moves at an even speed along the path. The path is
   data, but the speed is a choice: the recorded moments are evenly spaced in time, and in step order half of each path is
   covered in the first 0.2 s. No caption or panel claims a speed. Through M3 (88-96 s) the heads ride the morph with their
   own last dot (they are placed by the CPU twin PC.at), so at 92-97 s you can see them leave their layers. At thumb size the
   heads can be followed at 79.5-88 s (strip-14 c3 to strip-15 c8).
   Captions c18 and c19 now read "Now let it train. Follow one neuron per layer." (46 characters) and "Each slides along its
   layer and never leaves it." (48 characters). The old "Every dot starts to slide" was wrong for this picture: a dot is
   one moment of one neuron, and it does not move.
2. **The panel during the leak (88-96 s). DONE.** "8 fixed sums" dims in place to opacity 0.35 over 88.0-88.6 s. This uses
   two new fields in the panel row, r[8] and r[9]. Nothing moves and no new text appears. "Exact only for tiny steps" still
   arrives at 96.0 s, under the dimmed line. The dim starts when M3 starts, the same moment the lay line hard-cuts to "SAME
   DOTS, BIGGER STEPS". Strictly, it is a panel change at a move start (beats.md says the panel changes only at a settle). It
   asks the viewer to read nothing, and it removes the contradiction. Director: accept this or revert it.
3. **The answer cube (109-115 s). DONE.** Each row now ends in one cube: ansS 22, after a gap of ansGap 1.4 sub-answers. The
   cubes are white in all six rows from 109 s and take six colours from 112 s. Each block keeps its own colour (4 accent,
   7 soft, 9 sand), so each row shows its order and the cube shows its answer. The rows are no longer recoloured.
   plateW is now 380 (was 320) and camToyD 925 (was 800), so the plate stays on the stage.
4. **The tree and Monday spacing (135-141 s). DONE by knobs.** camTreeZ 0 → 25 and camWideZ 0 → 30 lift the tree on the stage.
   The Monday lines now clear the plate edge by about 15 px at thumb size (480 wide) at 135.5-138 s, which was about 3 px before. The
   CANDIDATE pin still sits clear above the plate.
5. **The swap at the crossing (132.5 s). PARTLY.** The far-going child and its subtree now lift off the plate (swapLift 32,
   with 3-D links through gl-boxes `tilt`), and the near-going pair steps toward the camera (swapArc 36 → 24). At 132.0 s and
   133.0 s the two groups read as one passing over the other. At 132.5 s they still line up in one column: at an elevation
   of 50 degrees, a lift and a depth step both show as up or down on the screen. I left it there: it lasts half a second,
   and SELECT calls it cosmetic.
6. **The followed run (78.5-80 s). FOLDED into item 1.** The followed run (featRun) is gone. At 78.5 s the five heads and
   their paths fade in at the start of their paths, and they set off at 80 s. Knobs featRun and cometDim were removed.
   Knobs added: pathBase, headR, headRing, follow0-4, ansS, ansGap, swapLift. The total is now 107.
7. **Standing tree. LEFT** for the director's seat (SELECT puts it last; the flat tree can be counted at treeBox 24).

## Laws check
153 s; four camera moves, unchanged (12, 28, 62 and 88 s); no text moves; no new digit; the tags and PROGRAM, NOT A THEOREM
(119-150 s) are unchanged; the honest line is on stage at 141.5-150 s; the card is last. Gate: see gate.json (full run, PASS,
G11 clean). Page 1.264 MB; film code 85.2 KB (< 120). frames/ was re-stripped after the last build.

## Warnings to ship with
- The head's even speed along its path is a display choice (see item 1).
- The dim at the M3 start is a deliberate exception to "the panel changes only at a settle" (see item 2).
- The five followed neurons come from five different runs (one per layer). The picture no longer says "one network".
- The tree crossing at 132.5 s is still a column for about 0.5 s.
- G11 cannot see canvas-drawn marks; the heads, rings and cubes were checked by eye against the panel, the tag and the band.
- Carried over: Marcotte et al. tables, the PRL page and arXiv 2402.08939 were not opened (egress); and there is still no
  DecompressionStream fallback.
