# pass-every-time · tier-2 revision · 2026-10-10

Reviser: Opus, tier 2. Inputs: SELECT.md (the "Beyond scope after round 2" list), findings r1/r2 and their reports, the brief and its
Director's choices, R-E, drafts/a/NOTES.md. Edited: lib/film.src.js (film.js re-assembled by lib/assemble.py), film.json edited IN
PLACE by lib/revise_t2.py (knobs, knobs_doc, captions; idempotent). claims.json is unchanged: every new digit on screen
(278, 460, 44, 115) is already a claim value. lib/make_film_json.py is retired: it now refuses to write ../film.json (it would
revert r1, r2 and this round) and writes only to an explicit `--out <other path>`.
Build: `python3 lib/revise_t2.py && python3 lib/assemble.py && python3 factory/kit2/build.py factory/films/pass-every-time --brand factory/films/pass-every-time/brand.midnight-ink.json --chrome none`.
Before/after sheet: revision/before-after.jpg (68.5, 89.0, 100.0, 121.5, 133.5, 145.0 s).

## Gate (full, not --quick) · VERDICT PASS
Run 1: FAIL on G11 only: the new right-hand Monday column ("revise: newer") stayed on under the brand card's takeaway
(151.5-153 s). Fix round 1: the Monday columns and the bookend legend fade out from qOut 149.3 (gone at 149.8). Run 2: PASS on
G1-G11; G11 307 samples at 0.5 s, 78 texts, no overlap, nothing off the stage, nothing across the caption band. G8 film code
93.4 KB < 120 KB; page 1.244 MB < 1.3 MB. G1 ready 3460 ms (host under load). Frames: 307 at 0.5 s, purity identical,
1.235 s/frame (under 1.5; the host was loaded, r2 measured 0.518 on a quiet one).

## The list, in order
1. **Ratio row, 82.6-91.0 s.** The four-result ladder (60.4 / 49.1 / 43.0 / 38.3) is now a pair. Each half shows its count line
   first and its ratio 0.8 s later (ladLead): 82.6 "ONE TRY · 278 OF 460 TRIES", 83.4 "60.4 %"; 85.6 "EVERY TRY · 44 OF 115
   TASKS", 86.4 "38.3 %" (gold); both hold to 91.0. 49.1 % and 43.0 % are gone from the stage and the captions (they have no
   count of their own; pass2/pass3 stay in claims.json, unused on screen). Captions 14-16 rewritten, no new digits: "Count one
   try at a time: 60.4 %." / "Count each task by all four tries: 38.3 %." / "Same cubes, two answers. Which one was quoted?".
   The pair and the paper plate (91.4-97 s) were raised 8-9 units so their small lines clear the cut plane's back edge
   (the sorted field is deeper, item 3). Knobs lad2, lad3 removed; ladLead, ladXL, ladXR added.
2. **Outlines on unlit cubes: left.** SELECT r2 item 6 and a 2x zoom of 47.5 s: at ghostMix 0.45 every unlit cube reads as its
   own slate cube (seams plus face shading); a column always reads as four tries. An edge pass would restyle every mark.
3. **Re-sort layout, 60-73 s.** M2 now lands the 115 columns in five bands by tries passed (4, 3, 2, 1, 0) left to right, an
   aisle between bands, 11 columns deep (sortRows 11, sortAisle 0.7): 44 = one 4 x 11 block, then 22 (2 x 11), 9, 18, 22
   (2 x 11). From 66.5 s the gold height steps down band by band, and "44" (68.0) names a block you can see. Left to right,
   not draft b's front row: every column is four cubes tall, so a front band at el 30 hides the bands behind it and only
   shows tops; left to right shows each band's lit height on its front and side faces. The cut plane, its pin anchor and a
   new label reserve (RECT.sorted) follow the sorted footprint. Same marks, same count (I1, I2); camera still.
4. **Monday bookend, 135-150 s.** After the 135.0 cut, one move 135.4-139.4 (the reverse of M1 + M2): the camera orbits back to
   the exact opening plan pose (az 0, el 89, distance 720, the opening aim) and every cube returns to its 2 x 2 tile. The cut's
   dimming stays on, so the frame from 139.4 is the 37 s frame read again: the 44 tasks that passed all four tries are
   bright gold, every other try is dimmed, never removed. No global dim any more (mondayDim 0). Type sits beside the field, never
   over it: the opening legend corner returns ("GOLD = PASSED ALL FOUR TRIES"), the question in the left column from 139.6, the
   one honest line in gold in the right column from 143.6 (where the opening's 60.4 % callout stood); all fade 149.3-149.8.
   Caption 29 runs 135.3-139.3 during the move; no caption after it. Knobs bookDist, bookLookZ removed; colPad, monY added.
5. **"27 min" pin, 125-135 s.** The reference pin is now the display face at 24 units in gold (refPinSize), next to "about 10x"
   at 132.1-135. The 289 pin no longer flashes for 0.2 s before its callout (shown only from cMin289).
6. **Blank cuts.** 100.0 s: prT0 99.8, so the cut lands on the first row of pull requests arriving; the unit legend is on at the
   cut (it used to fade in during the tau scene). 121.0 s: min27T0 120.8, the 27 minute cubes count in from the cut (121-125)
   under caption 24; the minute legend is on at the cut. Ranges of prT0 and min27T0 widened to allow this.

## Grammar after the revision
Moves start 40, 60, 73, 110.5, 135.4 (cuts at 100, 121, 135): gaps >= 12 s. New numbers hold >= 2.5 s (60.4 % 7.6 s, 38.3 %
4.6 s). Labels off during every move; at most two results in the display face at once (the pair). One honest line on stage;
the CETI card last and alone (150-153). 153 s.

## Warnings to ship with
- The plane pin "THE ALL-FOUR BAR" is solved out (no free room) in r2 and now alike; the caption and the header name the cut.
- The bookend move (4 s) carries both the camera and the cubes; mid-move (136.5-138.5) the field is a scatter of returning cubes.
- 149.8-150.5: about one second of the callback frame alone, no type, before the card (the takeaway would cross the right column).
- The Monday columns are narrow (about 16 characters a line at 28 units): six ragged lines each.
- Phone 390 scrollWidth 400 OVERFLOW (G6 note): kit2's shell, not this film.
- claims.json is the object form {film, claims}; build prints a note (unchanged since the draft).
