# noether-applied · REVISION (tier 2, film.js) · 2026-10-10

Input: rounds 1-2 applied (SELECT.md), Beyond-scope list after round 2. Edited: lib/film.src.js (re-assembled to film.js), film.json knobs and
captions IN PLACE (no regeneration), build.sh, lib/mkfilm.py. claims.json unchanged (no new digit on screen). Gate (full): PASS G1-G11, G11 clean
(307 samples, 71 texts, no overlap, nothing across the band); G5b/G5c PASS; page 1.267 MB (< 1.3); film code 87.4 KB (< 120); purity identical;
frames re-stripped (frames/, 307 thumbs). Before/after: revision/before-after.jpg. All thumbs looked at for every change.

## Items, in the order worked
| # | item | film seconds | what changed |
|---|---|---|---|
| 8 | MUST-FIX build.sh vs film.json | - | build.sh no longer regenerates film.json. lib/mkfilm.py now only CHECKS film.json (knobs used by film.src.js = film.json knobs = knobs_doc) and exits; `--regenerate` would rewrite from its stale tables (never from build.sh). Verified: build.sh leaves film.json byte-identical. |
| 1 | the two cyans that merge | 14-62, 89-110, 127.5-135 | The plain group is a film-local warm role `PLN #E8A867` (the brand's "warm sand"; 9.6:1 on the ground), replacing accent2 in dots, rows, pins and arrows. Keeper stays accent mint. The sun dot went from sand to ink so warm means only "plain". At 480 px the mint tube and the warm funnel (45.5 s) and the mint ring vs the warm track (101 s) separate at a glance. |
| 2 | swirl stays (draft b's wall) | 110-122.5, 135-150 | The time-extruded "vase" is gone (knobs hz, bandA, strandA, strandW removed). The loop now lies on the floor with b's wall standing on it; the wall's height is the loop's CIRCULATION computed in setup each stored frame (sum of velocity x segment over 2,000 segments) over its start value, times wallH: max change 0.14 % (off screen; claim kelvinCircDriftMax 0.30 % is recompute.py's), so the top stays visibly level. A muted ghost of the starting wall's top and foot stays. Stirring 111.8-116.8 under a still camera (el 55), then the crane 117.0-120.0 to el 9 (side view: flat top level with the ghost), hold 120.0-122.5 (2.5 s). Tag lay line "WALL HEIGHT: THE SWIRL". Captions 25-27 retimed (110.6 / 114.0 / 119.6 s, words unchanged). Wide frame shows the walled loop. |
| 3 | arrows with width and heads | 124.5-135 | 11 answer arrows (arrowEvery 36 -> 200), arrowLen 30 -> 55, width 3.2, four-barb heads (b's helper). Mint arrows turn with the chain; the warm plain-layer twin fades in once the turn starts and keeps its old direction. Turn 1 -> 0.5 (180 deg, 127.5-132.5 s, hold 2.5 s) so the pairs end pointing apart. Residues quieted to grey. Caption 29 back to "Turn the chain. Its answer arrows turn with it." (round 2's wording wrapped to two lines at 130 s). Tag: "TURNS WITH IT · PLAIN LAYER" in their colours from 127.5 s. |
| 4 | the followed run's visible track | 72-89 | followRun 37 -> 89 (outer shell; track 94.5 world units vs 19.7). Its whole track is drawn as a bright ink line (trackW 2.6) from 72 s and follows the sort; from 82.5 s a dot walks it (82.8-88.4 s) along the outer shell's rim. The pin still names it. runDim left at 0.60. |
| 5 | too much text | 14-62, 89-110 | Both two-line legends removed. The tag's lay line is the only key: KEEPER / PLAIN (ENERGY-KEEPING / PLAIN) set in their own colours, then the axis words. Panel stays <= 3 rows (3 only at 51.0-53.5 and 106.5-110). Per frame: tag, panel, at most one pin, caption. |
| 6 | honest line on one row | 141.5-149.9 | Set as one text at 28 px from x 48 (no wrap); real width about 805 units on the 960 sheet. Wording unchanged. |
| 7 | the stray streak | 26-62 | The thrown-out snapshots (step >= 64,686,077, from the data) now end in a warm outward arrow (flungLen 40) that rides with them through the re-plot; the pins' x clears its tip. Without the pin (42-53.5 s) it reads as "this one leaves". |

New knobs (film.json, documented): stirT0, stirT1, wallH, wallA, wallEdge, flungLen, arrowW, trackW, walkR, tagAdv. Changed: followRun 89,
m4T0 117.0, m4T1 120.0, camS3El0 55, camS3El1 9, camS3Dist0 900, camS3Dist1 700, arrowEvery 200, arrowLen 55, turns 0.5, m5T1 132.5.
Camera moves start 14, 34, 74.5, 117.0 s (<= 1 per 8 s); the stirring and the chain's turn run under a still camera; every hold >= 2.5 s.

## Left, and why
- Keeper pin's leader (44.5-53.5 s) crosses the foot of the thrown-out streak. I tried moving the pin text below the arrow; it then sat on the
  panel's first row label (one line "STAYS INSIDE KEEPER · ENERGY OFF"), which is worse; reverted.
- Draft b's still "distances" pad under the chain: not ported (it would be a fourth text element and costs page budget; the turning arrows
  now carry idea 4).
- Mint arrows read a little smaller than the warm ones when foreshortened (130 s); both have heads and read at 480 px.
- "THE WEIGHTS TRAVELLED 0.24" is now warm (the thing that moves) beside the mint 0.00095 (the thing that stays): intended.
- PLN is a film-local colour, not a brand-pack role (the brief fixes the pack). A coastal pack role for "plain" would make it reusable: factory.

## Warnings to ship with
- G6 phone 390: scrollWidth 587/390 OVERFLOW (kit2 / player level, not this film).
- Circulation in the wall is our dt 0.01 re-integration (recompute.py uses 0.005); the on-screen picture shows no digit.
- Open before ship (brief F4/F8): Greydanus Table 1 (170 / 0.38), Du 2018, Jumper Fig. 1d (2,180) were not opened (egress).
- The chain is a seeded stand-in (tag says so); the plain layer is drawn as "does not turn", not the paper's matrix test.
