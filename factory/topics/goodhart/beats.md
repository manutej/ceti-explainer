# goodhart · 75-second beat sheet

Canvas 960 × 540 units. Material 72.0 s + brand card 72.0 to 75.0 s (total 75.0 s). Silent; captions carry it.
Captions sit in a band at y 478 to 520, IBM Plex Mono 500 at 28 units, centred, max one line (≤ 60 chars).
Faces: Big Shoulders Display 600 for headline numbers; IBM Plex Mono 400/500 for every other number and label.
Ink on paper (exec, Q6): paper `#f4f1ea`, ink `#1d1d1b`, graphite `#6b6b66` (viewer's marks), one red
`#b3261e` (flagged accounts only). No icons, no logos, no hand-drawn figures.

## The four structures
| # | structure | beats | what it is |
|---|---|---|---|
| S1 | The household row + ledger | HOOK, CASE | 8 square slots (the target) filling with ink; under it a 3-row typeset ledger (2016 / 2017 / 2020) in CASE |
| S2 | The commit box | COMMIT | the question, a number box (0 to 1,000), an 8 s countdown |
| S3 | The 1,000-mark grid | COUNT | 40 × 25 squares, the metric's view; 21 turn red; the viewer's guess outlined on the same grid |
| S4 | The Monday card | MONDAY | the question in 32 units, the honest-limits line as caption 14 |

The brand card (72 to 75 s) is the Q8 plain card, not a structure: "CETI" wordmark line, then the takeaway
"When a measure becomes a target, it stops measuring." (Big Shoulders 600, 36 units), nothing else.

## Commit
- Prompt (on the box, 30 units, two lines): "Of every 1,000 accounts opened, how many did customers never
  authorise?"  Helper (14 units): "0 to 1,000 · type a number".
- Live page: pauses at 12.0 s and holds 8 s with the input; Enter commits; timer out = "no answer".
- Film mode: `defaultGuess: 100` from film.json, typed into the box at 13.0 s, countdown 8 → 0 drawn 12.0 to 15.8.
- Nothing numeric derived from the answer appears before 51.0 s (COUNT).

## Beats and captions (14 captions, all ≤ 60 chars; lengths checked)
| # | t0 to t1 (s) | beat | caption | chars |
|---|---|---|---|---|
| 1 | 0.5 to 7.6 | HOOK | Target: 8 products per customer. Your team is hitting it. | 57 |
| 2 | 8.2 to 11.8 | COMMIT | One bank ran on that exact target. Your guess first. | 52 |
| 3 | 12.0 to 15.8 | COMMIT | Of 1,000 accounts opened, how many were never authorised? | 57 |
| 4 | 16.2 to 20.4 | CASE | Wells Fargo, 2002 to 2016: "Eight is great." | 44 |
| 5 | 20.6 to 25.4 | CASE | Feb 2015: 6.13 on average. One household in four had 8+. | 56 |
| 6 | 25.6 to 30.6 | CASE | 2016: 2.1 M accounts flagged. 5,300 fired. $185 M fines. | 56 |
| 7 | 30.8 to 35.8 | CASE | 2017: the full review says 3.5 M. 2020: $3 B to settle. | 55 |
| 8 | 36.2 to 40.8 | COUNT | 165 M accounts opened, 2009 to 2016. Here are 1,000. | 52 |
| 9 | 41.0 to 43.8 | COUNT | The metric counted every one as a product sold. | 47 |
| 10 | 44.0 to 48.8 | COUNT | The review flagged 21. The metric still counted them. | 53 |
| 11 | 51.0 to 56.0 | COUNT | You guessed {g}. The review found 21.  (no answer: "No guess. The review found 21.") | ≤ 39 |
| 12 | 57.0 to 61.8 | COUNT | 21 is the floor. Unused products sold were counted too. | 55 |
| 13 | 62.4 to 67.4 | MONDAY | Monday: what could move this number with nothing behind it? | 59 |
| 14 | 67.6 to 71.8 | MONDAY | Limits: 3.5 M is an estimate. One bank, one metric. | 51 |

`{g}` is formatted with a thousands comma (1,000). Every digit above is a claim in claims.json.

## HOOK (0.0 to 8.0) · S1
- 0.0: paper, eyebrow (12 units, chrome) "CASE · GOODHART". Household row: 8 empty squares, 60 × 60, pitch 72,
  x0 = 198, y = 170, stroke ink 1.5.
- 0.6 to 4.6: slots fill with ink one by one, slot k at 0.6 + 0.5k (fill eases 0.25 s). Counter right of row,
  mono 48: "k / 8". Label under row (14): "PRODUCTS PER CUSTOMER · TARGET 8".
- 4.6 to 8.0: hold at 8 / 8; tag "ON TARGET" (mono 28) appears at 5.0. This is the viewer's team, not Wells.

## COMMIT (8.0 to 16.0) · S2
- 8.0 to 8.6: row slides up and fades to 20 % ink; commit box fades in centred (560 × 180 at y 160).
- 12.0: live page pauses (hold 8 s). Film mode: countdown digits 8 → 0 at the box's right edge (mono 28), the
  default 100 types in at 13.0, stamps "COMMITTED" at 15.8.

## CASE (16.0 to 36.0) · S1 returns with its ledger
- 16.0: box out; row back at full ink, all slots empty; eyebrow "WELLS FARGO · COMMUNITY BANK".
- 20.6 to 22.6: slots fill to 6.13: six full, the 7th filled 0.13 of its width (7.8 units) from the left; slot 8
  stays empty with a dashed outline. Labels: left "6.13 AVERAGE · FEB 2015" (mono 28), right "TARGET 8".
  At 23.0, "1 IN 4 HOUSEHOLDS AT 8+" (mono 14 chrome; the caption carries it at 28).
- Ledger under the row at x 198, rows at y 300 / 348 / 396, mono 28, typed on as each caption lands:
  - 25.6: `2016   2.1 M flagged · 5,300 fired · $185 M`
  - 30.8: `2017   3.5 M after the full review`
  - 32.8: `2020   $3 B to settle`
- 35.4 to 36.0: S1 fades out.

## COUNT (36.0 to 62.0) · S3, frame by frame
Geometry: 40 cols × 25 rows, pitch 13, square 10 × 10. Grid origin x0 = 60, y0 = 112 (grid spans x 60 to 577,
y 112 to 434). Slot index i: col = i % 40, row = floor(i / 40), x = x0 + 13·col, y = y0 + 13·row.
Right column x = 620 to 920: three counters, eyebrow mono 14 above value Big Shoulders 48:
ACCOUNTS OPENED (y 150), FLAGGED (y 250, red), YOUR GUESS (y 350, graphite). Grid eyebrow above grid (12,
chrome): "1 MARK = 165,000 ACCOUNTS · JAN 2009 TO SEP 2016".
Flagged set: mulberry32(seed 2017); Fisher–Yates shuffle of 0..999; F = first 21 entries, in that order
(this order is the reveal order). Pure function of t; no state but the guess.

1. **36.0 to 40.0 · build.** Row r appears at t_r = 36.0 + 0.16 r (r = 0..24); each square's opacity eases
   0 → 1 over 0.12 s from t_r. ACCOUNTS OPENED = 40 × (number of rows whose t_r ≤ t), so it reads 40, 80, …
   1,000 exactly when the marks do. All squares ink.
2. **40.0 to 43.8 · the metric counts.** A 1-unit graphite scan line sweeps the grid top to bottom
   40.2 to 42.2 (y = y0 − 2 + (322 + 4)·ease); beneath ACCOUNTS OPENED a line "COUNTED 1,000" (mono 28) appears
   at 42.2. No square changes colour.
3. **44.0 to 48.4 · the review.** Square F[k] turns red at 44.0 + 0.2 k (k = 0..20; colour snap with a 0.1 s
   1.0 → 1.15 → 1.0 scale pulse). FLAGGED counts 0 → 21 in step. At 48.4 all 21 are red, scattered; 979 ink.
4. **48.6 to 50.8 · gather.** Swap map: R = F sorted ascending; red square R[j] moves to slot j (j = 0..20).
   D = slots in 0..20 not in F (ascending) are ink squares displaced; V = slots of F that are ≥ 21 (ascending)
   are vacated; |D| = |V|, and D[m] moves to V[m]. Every moving square travels a straight line, easeInOutCubic
   over 1.6 s, start staggered 0.02 × its index in R (ink squares use 0.02 m). End state: slots 0..20 red
   (row 0, cols 0..20), every other slot ink.
5. **51.0 to 53.0 · the guess.** If g ≥ 1: draw a graphite outline (stroke 2, no fill) around slots 0..g−1:
   the staircase polygon of full rows 0..⌊g/40⌋−1 plus the partial row of g mod 40 slots, outset 2 units;
   draw on by stroke-dashoffset from perimeter to 0 over 2.0 s. YOUR GUESS shows g (Big Shoulders 48,
   graphite) at 51.0. If no answer: no outline; YOUR GUESS shows "—" and the caption uses its no-answer form.
   g = 0 shows "0" and no outline. Red squares sit inside the outline whenever g ≥ 21.
6. **54.0 to 57.0 · the ratio, only now.** Under FLAGGED: "21 ÷ 1,000 ≈ 2 in 100" (mono 28), fade 0.4 s.
7. **57.0 to 62.0 · the floor.** The 979 ink squares ease to 35 % opacity over 1.0 s; the 21 red hold at 100 %;
   the graphite outline holds. Right column adds (mono 14, chrome): "UNUSED PRODUCTS SOLD WITH CONSENT:
   COUNTED, NOT FLAGGED". 61.6 to 62.0: grid holds.

## MONDAY (62.0 to 72.0) · S4
- 62.0 to 62.6: grid fades to 10 %; card text in, centred, ink, Big Shoulders 600, 32 units, two lines:
  "What could move this number / with nothing real behind it?"; under it mono 14 "AND WHO WOULD NOTICE?".
- 67.6: caption 14 (honest limits) at 28 units; the card holds to 72.0 (the material's last frame).

## Brand card (72.0 to 75.0)
Plain paper, "CETI" wordmark line (Big Shoulders 600, 28), takeaway (36): "When a measure becomes a target,
it stops measuring." No numbers.

## film.json seeds for the builder
`{ "id": "goodhart", "dur": 75, "defaultGuess": 100, "guessRange": [0, 1000], "commitAt": 12.0, "commitHold": 8,
   "grid": { "cols": 40, "rows": 25, "pitch": 13, "size": 10, "x0": 60, "y0": 112, "flagged": 21, "seed": 2017 } }`
