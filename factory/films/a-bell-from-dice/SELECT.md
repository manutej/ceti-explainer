# a-bell-from-dice · SELECT (blind)

Evaluator: Opus, 2026-10-10. I read frames/strip-01..21.png, frames/thumbs/, frames/frames.json, film.json,
claims.json and gate.json for drafts a and b, plus the brief and beats in factory/topics/a-bell-from-dice/. I did
not read film.js, lib/, NOTES.md or shots/, and I ran no browser. Both drafts gate PASS (G1 to G10). Each has the
expected G5c WARN for the running counter during the count-in (12 to 22 s). Draft b has four more, from its
running cut counter (99,979 to 15,111, 70 to 74 s). Commit is off (D11), so the COMMIT row is skipped and HOOK runs
0 to 12 s. Strips are 6 s each, so strip-NN covers 6(NN-1) to 6(NN-1)+5.5 s, at 0.5 s per cell. Cost: a measured
1.51 s/frame (under heavy host load; 0.3 to 0.6 s when quiet) and b measured 0.46. Both pages are 1.27 MB, and film
code is a 96.3 KB, b 101.9 KB. I used cost only as a tie-breaker, and it was not needed.

## Can the pictures alone carry the gap? (captions covered)
- **a: yes, from 56 s, and the whole chain by 96 s.**
  - Flat by first die, 34 to 39.5 s (strip-06 cell 11, t-0035.50): six equal stacks. They read as a slight
    staircase, though (see faults).
  - Bell by sum, with the equal-odds line on the same frame, 55 to 57.5 s (strip-10, t-0056.50).
  - The twelve-times gap as a picture, 87 to 91.5 s (strip-15 cells 6-11, t-0089.50): a dashed belief box over the
    tail stands on the flat 3,846 line, with the five tiny gold tail bars inside it, on the full-size histogram.
  - The exact bell agrees, 93 to 107 s (strip-16 cell 6 to strip-18, t-0104.00): the accent2 step outline hugs the
    counted bars, one structure, full frame.
- **b: yes for flat and bell, only partly for the gap.**
  - Flat by first die is the best frame of either draft, 34 to 39.5 s (strip-06 cell 8, t-0034.00): front
    elevation, all six pinned, the 16,667 line across the tops.
  - Bell, 54 to 57.5 s.
  - The count of 1,655 lands as a moment: the counter runs down "ROLLS RIGHT OF THE CUT" from 99,979 to 1,655 as
    the cut moves (70 to 76 s, strip-12/13).
  - The comparison with equal odds is moved to a one-third-size inset. At 87 to 91.5 s (t-0089.50) that inset shows
    only the flat line and an empty dashed box, with no counted bars, and "19,231 ... 12 TIMES" is in the 14-unit
    face. The tail it compares against is a few gold cells on a translucent 2D-slab ridge. The exact bell and the
    belief box share one frame only from 96 s, and only inside the inset.

## Ranking

### 1. a (1D extruded histogram), the winner
Strengths:
- The case shows one mark per roll. From 12.4 to 24 s (strip-03 to strip-05) the 500 x 200 waffle fills in arrival
  order, and the 100,000 marks are visible as marks.
- The camera move is the argument. In plan view, 47 to 50 s (strip-09, t-0048.00), there is a row of alike
  footprints. The orbit then brings the bell up out of them, 51 to 55 s.
- The comparison with equal odds and the exact count are on the main picture, at full size (89.5 s, 104 s). This
  is the reversal the brief asks for, visible without captions.
- MONDAY returns the five dice and the 14 to 21 band, labelled "69.8 % OF ROLLS · 69,773 ROLLS" (strip-19/20). The
  CETI card comes last (121 to 123 s), and the frame at 122 s holds the takeaway.

Faults (most are knobs or captions; see Round 1):
- Only two of the six first-die pins show, 34 to 39.5 s. The caption names 16,519 and 16,797, and neither is on
  stage.
- The stacks recede on a -18 deg sweep, so their tops climb like a staircase (t-0035.50).
- The shuffle at 29 to 31.5 s fills the lower third and puts white marks under the caption (t-0030.00). It reads as
  a jumble before it settles.
- Caption 10 ("From above ...") stays up while the bell is already rising, 52 to 53.8 s.
- The cut readout is clipped by the top edge of the canvas, 72 to 76 s (t-0074.00).
- 1,655 is no bigger than "EQUAL ODDS: 19,231" (89.5 s).
- The 462 tail pin is missing at 61 to 65 s.
- Captions 11, 21 and 22 wrap.
- The landed "100,000" at 24 s is in a small face (beyond scope).

### 2. b (2D slabs sum x first die, inset glass)
Strengths:
- It has the clearest flat-by-first-die frame (34 to 39.5 s).
- The 100,000 ROLLS and 1,655 counts are in the display face. The cut counter is a real running tally (70 to 76 s).
- The Monday sheet is the cleanest of the two: dice, "ONE ROLL: 18", and a small bell with "69.8 % OF ROLLS" in
  the must-read face (strip-19/20).
- It is the cheaper film (0.46 s/frame).

Faults:
- The count-in pours straight into six first-die bins (13 to 23 s), so the 100,000 marks read as streaks and bars,
  not as marks.
- The comparison with equal odds and the exact agreement are in an inset that is empty of counted bars at 87 to
  91.5 s. The 19,231 and "12 times" are in the 14-unit face.
- Two structures compete for 87 to 107 s: the 3D ridge and the inset. The closing COUNT frame is crowded, with the
  display number, five text lines, the ridge and the inset (t-0104.00).
- "ROWS BY FIRST DIE" overprints the inset at 87 to 88 s.
- 66 to 68 s shows an empty floor under "Five thin piles", then cells cut by the left edge (t-0067.00, t-0068.00).
- The 2D slabs make the bell harder to read at thumb size than a's 1D bars.
- Its faults are mostly layout in film.js, not knobs.

## Verdicts
- **a**: wins. Both halves of the gap, twelve times too many and the exact count agreeing, are shown on one
  full-size picture. Its faults are mostly camera, size and caption knobs.
- **b**: second. It has the best flat frame and the best count landing, but it tells the reversal in an inset with
  small type, and its faults need film.js.

## Winner
Draft a was copied unedited (cp -r) to factory/films/a-bell-from-dice/: film.json, brand.midnight-ink.json,
film.js, claims.json, lib/, build/ and gate.json. film.json already carries `id` "a-bell-from-dice" and `look`
{brand "midnight-ink", chrome "none", material "ink"}, so no edit was needed. gate.json still names the draft's
page path until the round-1 apply regenerates it.

## Borrowed from b (knob or caption level only)
- **Front-on first-die row.** b's 34 s frame, through `camObliqueAz` -18 → 0 in a.
- **The count in the display face.** b's countSize 56 at 1,655, through `readSize` 56 → 76 in a.
- **Honest-line wording "linked parts".** b's caption 22, shortened to one line.
- **Running "right of the cut" tally.** This one is beyond scope; see below.

## Round 1
findings.r1.json has 10 findings: 0 block, 6 major, 4 minor. The dry run accepted 10 of 10 (findings.r1.report.json).
- Majors:
  - `fdGap` 50 (six pins)
  - `camObliqueAz` 0 (level tops)
  - `camObliqueZoom` 1.15 (caption clear during the shuffle)
  - `camSideT0` 52 (plan held under "From above", side lands under "From the side")
  - `camWideZoom` 0.85 (cut readout in frame)
  - `readSize` 76 (1,655 dominant)
- Minors:
  - `camTailZoom` 2.3 (462 pin)
  - Caption shortening for 11, 21 and 22, with no new digits. All three get shorter, so film code shrinks.

Check in round 2:
- six pins and level tops at 35.5 s, and the row still fits the frame
- the caption is clear at 29 to 31.5 s
- 52.5 s is still the plan view
- the side view holds 55 to 58 s
- the readout is fully in frame at 74 s, with the tail cells still visible at 77 s
- 1,655 does not collide with "= 1.7 %"
- five tail pins at 62.5 s, with the boxes not filling the frame (cost)
- captions 11, 21 and 22 each on one line

## Beyond scope (film.js, the brief or claims.json; for the pipeline or the next draft)
- **24 s, the landed count is in a small face.** "100,000" is at about 28 units, not the display face the beats ask
  for, and no knob sizes it. Owner: film.js.
- **70 to 76 s, the cut readout shows one sum at a time.** It reads "rolls in the sum the cut is on", not a running
  tally, and the brief asks for LEFT / RIGHT to tick with the cut. b's "ROLLS RIGHT OF THE CUT" running count is the
  model. Owner: film.js.
- **56 to 57.5 s, peak pin overprint.** The 10,034 pin overprints a bar and sits against 10,091. There is no offset
  knob. Owner: film.js.
- **87 to 91.5 s, belief label overprint.** "EQUAL ODDS: 19,231" overprints the bars of sums 22 and 23. Owner:
  film.js (label anchor).
- **102 to 107 s, agreement lines too small.** "LARGEST GAP 0.09 POINTS · MEAN 17.5 · SD 3.82" and the 126-ways
  line are results set in the smallest face. Raise them to secondary or must-read. Owner: film.js.
- **Both drafts, honest line not on stage.** The honest limit is in caption 22 only. The rubric wants one on-stage
  line in MONDAY as well. Owner: film.js.
- **1.0 s, hook blank.** The thumb at 1.0 s shows only the eyebrow (both drafts). `diceT0`'s floor of 1.4 cannot
  reach it. Note only.
- **claims.json and brief, tailPctSim mismatch.** tailPctSim has `value` 1.7, which is right: 1,655 / 100,000 =
  1.655 %, and Math.round gives 1.7. But its `renders` say "1.6 %", and brief.md says "the dice gave 1.6 %". The
  film shows 1.7 %, which agrees with the value. Owner: the BRIEF lane, to fix the renders and the brief text. Do
  not edit claims.json in the findings rounds.
- **G5c WARN, ships.** The running counter at 12 to 22 s (10 values) is expected.

## Round 2
I re-read the regenerated frames/ (strips and thumbs) after round 1. Gate PASS, with only the expected G5c WARN.
Film code is now 90.6 KB (was 96.3), and frames measured 0.80 s/frame.

What each round-1 change did in the picture:
| # | change | result | frame |
|---|---|---|---|
| 0 | `fdGap` 24 → 50 | Half. 4 of 6 pins now (16,736, 16,653, 16,665, 16,797). 16,630 and 16,519 are still missing, and two pins overprint their stacks. | t-0036.00 (strip-07 cell 0) |
| 1 | `camObliqueAz` -18 → 0 | Worked on its target: the six tops are level on the dashed 16,667 line, 35-39.5 s. It backfired downstream: the plan sweep (+18) now lands diagonal, 42-52.5 s, and later poses carry the extra 18 deg. | t-0036.00; t-0048.00 (strip-09 cell 0) |
| 2 | `camObliqueZoom` 1.5 → 1.15 | Worked. During the shuffle the field sits above the caption band, and "Sort the same rolls" reads at 29-31.5 s. | t-0030.00 (strip-06 cell 0) |
| 3 | `camSideT0` 50 → 52 | Worked. The plan holds to 52.5 s under "From above". The bell rises at 53-54 s and the side view lands at 55 s under "From the side", held to 58 s. | strip-09 cells 8-11, strip-10 cells 2-7 |
| 4 | `camWideZoom` 1 → 0.85 | Half. The readout is in frame from 73 s, but it is still clipped at 71-72.5 s. | t-0071.50 (strip-12 cell 11) |
| 5 | `readSize` 56 → 76 | Worked. 1,655 is now the largest number at 77-107 s, with no collision with "= 1.7 %". As a side effect, "EQUAL ODDS: 19,231" no longer overprints the bars. | t-0089.50 (strip-15 cell 11) |
| 6 | `camTailZoom` 2 → 2.3 | Worked. All five tail pins show at 61-66 s, including 462. | t-0062.00 (strip-11 cell 4) |
| 7-9 | captions 11, 21, 22 | Worked. All three are on one line. | strip-10, strip-19, strip-20 |

findings.r2.json has 3 findings: 0 block, 2 major, 1 minor. The dry run accepted 3 of 3. That converges from 10 to
3, with no block and no reversal of a round-1 value.
- **`camPlanAz` 18 → 0.** This undoes the downstream effect of #1. The sweeps add up, so the plan view returns to
  square. It is a different knob from #1, not a reversal.
- **`fdGap` 50 → 60.** This is the top of the knob's range. If the pins still read 4 of 6, the cause is the label
  solver (film.js). Park it in NOTES.md: caption 7 names 16,519 and 16,797, which would still not be pinned.
- **`camWideZoom` 0.85 → 0.75.** Last step, to clear the readout at 71-72.5 s.

Still beyond scope after round 2 (for NOTES.md), plus every item in the round-1 list above:
- the 10,034 pin overprint at 56-57 s
- the per-sum cut readout instead of a running tally
- the 24 s count in a small face
- the agreement lines in the smallest face
- the honest line not on stage
- the tailPctSim renders "1.6 %" mismatch in claims.json and the brief
