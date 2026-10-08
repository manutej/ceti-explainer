# Selection into treatment · beat sheet (film id `selection`)

Total 75.0 s: material 0.0 to 72.0, CETI brand card 72.0 to 75.0. Stage 960 × 540 units. Every digit is a
claim id in claims.json (in brackets below). Ink on paper; one accent ink (pencil red) reserved for the
viewer's guess. Faces: numbers in IBM Plex Mono 500; words in DM Sans; eyebrows Plex Mono 400 caps.
Captions: baseline y 516, 28 units, centred, max width 880.

## The four structures
- **S1 · The scoreboard** (HOOK): two columns of typeset counts then percentages, and the exec quote.
- **S2 · The gap bar** (COMMIT, returns at the end of COUNT and under MONDAY): a 0 to 30 point bar.
- **S3 · The risk ruler** (CASE): a horizontal ratio ruler (0.4 to 1.6, 1.0 = no difference) with the
  16-study mark row and the two WHI dot blocks above it.
- **S4 · The hundred** (COUNT): 100 square marks, regrouped twice.
The brand card is outside the cap.

## Beats and timings

| beat | t | structure | what happens |
|------|---|-----------|--------------|
| HOOK | 0.0–8.0 | S1 | counts, then 80 % / 50 %, then the quote |
| COMMIT | 8.0–16.0 | S2 | question, input box, 8 s hold (page) / countdown with default 25 (film) |
| CASE | 16.0–36.0 | S3 | 1991: 15 of 16, RR 0.56 · 2002: 164 vs 122, HR 1.29 · why |
| COUNT | 36.0–62.0 | S4 then S2 | as chosen 24/30 vs 35/70 · coin flip 33/50 vs 28/50 · guess on the bar |
| MONDAY | 62.0–72.0 | S2 held, dim | the question; honest-limits caption |
| BRAND | 72.0–75.0 | card | "CETI" wordmark line; takeaway "Who chose it is not what it did." |

## Captions (14; each ≤ 60 characters; [start, end] in s)

| # | in | out | text | claims |
|---|----|-----|------|--------|
| 1 | 0.6 | 4.2 | Feature on: 24 of 30 stayed. Feature off: 35 of 70. | obs-adopters-stayed, obs-adopters, obs-nonadopters-stayed, obs-nonadopters |
| 2 | 4.4 | 7.9 | The deck says the feature clearly drives retention. | — |
| 3 | 8.2 | 11.0 | 80 % against 50 %: a 30-point gap. | obs-rate-on, obs-rate-off, obs-gap |
| 4 | 11.2 | 15.9 | How many of those 30 points did the feature earn? | obs-gap |
| 5 | 16.3 | 20.6 | 1991 review: 15 of 16 cohorts found less heart disease. | case-review-year, case-cohorts-lower, case-cohorts |
| 6 | 20.8 | 25.6 | Women who chose hormones had 44 % lower risk. | case-obs-lower |
| 7 | 25.8 | 30.8 | 2002 trial, 16,608 women by lot: 164 events against 122. | case-whi-year, case-whi-n, case-chd-hormone, case-chd-placebo |
| 8 | 31.0 | 35.8 | 29 % higher. The women who chose it were better off. | case-whi-higher |
| 9 | 36.3 | 41.8 | 100 customers. 30 chose the feature; 24 of them stayed. | count-n, obs-adopters, obs-adopters-stayed |
| 10 | 42.0 | 46.8 | Of the 70 who did not, 35 stayed: 80 % against 50 %. | obs-nonadopters, obs-nonadopters-stayed, obs-rate-on, obs-rate-off |
| 11 | 47.2 | 52.6 | Same 100, split by coin flip: 50 get it, 50 do not. | count-n, count-half |
| 12 | 53.0 | 61.8 | 33 of 50 against 28 of 50: the feature earns 10 points. | count-treated-stayed, count-half, count-control-stayed, count-effect |
| 13 | 62.3 | 67.0 | Who chose it, and would they have stayed anyway? | — |
| 14 | 67.2 | 71.8 | HRT was not all selection: when women started may matter. | — (honest limit; Rossouw 2007) |

Lengths: 51, 51, 34, 49, 55, 45, 56, 52, 55, 52, 51, 55, 48, 57.

## Commit
- Prompt (S2 title, 32 units): **"How many of the 30 points is the feature?"** Sub (16 units): "0 TO 30 POINTS".
- Page: at t = 12.0 playback pauses; an input box (integer 0 to 30) and an 8 s countdown ring; on submit or
  timeout the value is sealed (`state.guess` = number or null → "no answer"); playback resumes at 12.0.
- Film mode: `film.json.defaultGuess = 25` [commit-default]. Countdown ring 8 → 0 over 8.0 to 16.0
  [commit-seconds]; the digits "25" type into the box at 13.0 (one digit per 0.25 s); at 15.0 the box gets
  the stamp "SEALED" (14 units, caps). No number derived from the guess appears before 59.2.

## Frame-by-frame

### HOOK 0.0–8.0 · S1
- 0.0: paper. Eyebrow (12 units, chrome) at (480, 64): "RETENTION REVIEW". Hairline rule y 80, x 120–840.
- 0.3: column labels, 18 units caps, centred at x 300 and x 660, y 150: "TURNED THE FEATURE ON", "LEFT IT OFF".
- 0.6: counts, 40 units mono, y 210: "24 of 30" at x 300, "35 of 70" at x 660 (type on, 0.3 s each, left first).
- 2.4: percentages, 96 units mono, y 320: "80 %" at x 300, "50 %" at x 660 (fade 0.4 s). [obs-rate-on/off]
- 4.4: the quote, 28 units DM Sans italic, centred y 410: “The data clearly shows the feature drives retention.”
- 7.6–8.0: counts and quote fade to 0; the two percentages slide up to y 110 at 40 units (they stay as the
  COMMIT's context line).

### COMMIT 8.0–16.0 · S2
- 8.0: S2 draws left to right over 0.8 s: bar outline x 180–780, y 300–324 (20 units per point,
  x(g) = 180 + 20·g). Ticks below at g = 0, 10, 20, 30, labels 18 units mono at y 352 [commit-ticks].
  Left end label 14 units "NONE OF IT", right end "ALL OF IT", y 376.
- 8.2: bracket above the bar, 14 units: "THE 30-POINT GAP" [obs-gap].
- 11.2: prompt line, 32 units, centred y 190: "How many of the 30 points is the feature?"
- 12.0: input box 160 × 56 centred (480, 245), digits 36 units mono; countdown ring r 18 at (600, 245)
  with the seconds left at 18 units. Page pauses here (see Commit).
- 15.9–16.0: everything clears to paper.

### CASE 16.0–36.0 · S3
Ruler: axis y 400, x(rr) = 180 + 500·(rr − 0.4), from 0.4 (x 180) to 1.6 (x 780); no tick labels except
"1.0" at x 480 (14 units, y 424) with "NO DIFFERENCE" beneath (12 units, chrome). End labels, 14 units,
y 444: "LOWER RISK" left-aligned at x 180, "HIGHER RISK" right-aligned at x 780.
- 16.0–16.8: ruler draws from x 480 outwards both ways.
- 16.3: eyebrow, 14 units caps, x 120 y 96: "1991 · STAMPFER & COLDITZ · POOLED STUDIES" [case-review-year].
- 16.6–19.6: row of 16 square marks, 18 × 18, pitch 24, x 120 + 24·i, y 108–126 [case-cohorts]. Mark i
  draws (outline, 1.5 units) at 16.6 + 0.1·i; then marks 0–14 ink solid one by one from 18.2, 0.08 s each;
  mark 15 stays hollow (Framingham). Counter at x 520, y 126, 28 units mono: "15 of 16" ticking with the fills.
- 20.0: a solid dot r 8 drops onto the ruler at x(0.56) = 260 (0.4 s, ease out). Above it, y 360: "44 % lower",
  28 units mono [case-obs-lower]; and at y 336, 16 units, "RR 0.56" [case-rr-obs].
- 25.8: eyebrow x 120 y 170: "2002 · WHI TRIAL · 16,608 WOMEN BY LOT" [case-whi-year, case-whi-n].
- 26.0–29.0: two dot blocks (p5 canvas, ink dots r 2.6, pitch 8, 10 rows, column-major, top to bottom):
  HORMONES at x 120, y 182–254, 164 dots (17 columns, the last holding 4) [case-chd-hormone];
  PLACEBO at x 500, same rows, 122 dots (13 columns, the last holding 2) [case-chd-placebo].
  Dot k of a block appears at 26.0 + 3.0·k/164 (both blocks share that clock, so placebo finishes first at
  28.23 s). Block labels 14 units caps at y 176 above each block: "HORMONES", "PLACEBO".
  Counters, 28 units mono, baseline y 230: "164" at x 268 and "122" at x 616, each followed by
  " of 8,506" / " of 8,102" in 18 units [case-whi-n-hormone, case-whi-n-placebo].
- 30.0: a second dot drops at x(1.29) = 625; above it, y 360, 28 units mono "29 % higher"
  [case-whi-higher]; y 336, 16 units "HR 1.29" [case-hr].
- 31.5–32.5: a hairline arc from the 0.56 dot to the 1.29 dot, apex 14 units above the axis at x 480, drawn
  left to right.
- 33.0: source line, 16 units, centred y 300: "Who chose hormones: better off since childhood · Lawlor,
  Davey Smith & Ebrahim 2004" [case-lawlor-year]. (If it overflows 880 units, drop "Davey Smith & Ebrahim"
  to "et al.")
- 35.6–36.0: everything fades to paper.

### COUNT 36.0–62.0 · S4, then S2
People (fixed, from params): build the 100-token list 21×A1, 3×P1, 6×N1, 35×A0, 7×P0, 28×N0 in that
order, then shuffle with mulberry32(seedPeople = 7), Fisher-Yates from the end (j = floor(r()·(i+1))), the
same mulberry32 as films/opera-house/film.js line 30. Token at index id is customer id. Resulting grid
(row by row, ids 0–99; first letter = type, digit 1 = turned it on):

    A1 N0 A1 A0 A1 A0 A1 N0 A0 A0
    A0 N0 A1 N0 A1 A0 A0 N1 A0 N0
    N0 N0 A1 N0 N0 A0 N1 A0 N0 N1
    A0 A0 A0 A1 A0 A0 A0 N0 A0 P0
    A0 N0 N1 A1 N0 P0 A0 N0 A1 N0
    A0 A0 N0 N0 N0 A1 N0 P0 N0 N1
    N0 A1 A1 A0 A0 A0 P0 A0 A0 N0
    A0 A1 A0 A0 P1 N0 A1 A1 P0 A1
    N0 N0 A0 N1 A0 A1 A0 N0 A1 P1
    P0 N0 P1 A0 A0 A0 P0 N0 A1 A1

Stayed, as chosen: adopter (digit 1) stays if type A or P; non-adopter stays if type A.
Coin flip: shuffle ids 0–99 with mulberry32(seedSplit = 90); the first 50 get the feature. Sorted:
2,3,6,8,9,11,13,14,18,19,20,23,25,28,30,31,32,33,36,38,41,42,43,44,46,52,53,55,56,57,60,61,62,63,66,68,71,
73,74,75,76,81,85,86,87,92,94,96,97,99. It holds 28 A, 5 P, 17 N and 15 adopters. Stayed: with the
feature, A or P (33); without, A only (28). The types are never shown on screen; only stayed/left.

Mark: square 18 × 18 units, corner 0; "left" = outline 1.5 units ink; "stayed" = solid ink. Pitch 24.
Slots: grid slot for id: x = 363 + 24·(id mod 10), y = 190 + 24·floor(id / 10).
Block slot k for a block with origin bx: column c = floor(k / 10), row r = 9 − (k mod 10) (fills bottom up,
column by column, left to right): x = bx + 24·c, y = 190 + 24·r. Order inside a block: the stayers first
(ascending id), then the leavers (ascending id), so the solid ink reads as a bar from the bottom left.
Block origins: as chosen, ON bx 284 (3 columns), OFF bx 514 (7 columns); coin flip, GETS IT bx 330,
DOES NOT bx 516 (5 columns each). Text: block label 18 units caps at y 124 centred on the block; counter
32 units mono at y 166; percentage 32 units mono at y 462. Chrome bottom-left (12 units, y 492):
"TEACHING SET · 100 CUSTOMERS · SEED 90" from 36.0 to 58.0 [count-n, count-seed].

- 36.0–37.0: the 100 outlines appear row by row (row r at 36.0 + 0.1·r, fade 0.15 s). Counter centred
  y 166: "100 customers" [count-n].
- 37.5–39.5: each mark tweens grid slot → its block slot (ease in-out cubic, 1.2 s, start delayed
  0.006·id s; the last ends 39.29). Labels fade in at 39.0: "TURNED IT ON · 30" over ON, "LEFT IT OFF · 70" over OFF
  [obs-adopters, obs-nonadopters]. The "100 customers" counter fades out.
- 39.5–41.5: ON block stayers ink solid in slot order, one per 0.08 s (24 → ends 41.42). Counter over ON
  ticks "0 of 30" … "24 of 30" [obs-adopters-stayed].
- 42.0–44.1: OFF block stayers ink, one per 0.06 s (35 → ends 44.10). Counter "35 of 70"
  [obs-nonadopters-stayed].
- 45.0: percentages fade in under the blocks: "80 %" under ON, "50 %" under OFF; between the two blocks at
  y 300, 28 units mono: "30 points" with a hairline bracket [obs-rate-on, obs-rate-off, obs-gap].
- 47.0–47.5: all fills drain to outline; labels, counters, percentages fade.
- 47.5–49.3: marks tween back to grid slots (1.2 s, same easing, delay 0.006·id; the last ends 49.29).
- 49.3: counter y 166: "Same 100 · coin flip" (28 units); chrome adds "· COIN FLIP".
- 50.0–51.8: marks tween to the coin-flip blocks (treated → GETS IT, others → DOES NOT; slot order: stayers
  under that arm first). Labels at 51.0: "GETS IT · 50", "DOES NOT · 50" [count-half].
- 51.8–53.8: GETS IT stayers ink, 0.06 s each (33 → ends 53.78); counter "33 of 50" [count-treated-stayed].
- 53.8–55.5: DOES NOT stayers ink, 0.06 s each (28 → ends 55.48); counter "28 of 50" [count-control-stayed].
- 55.6: "66 %" and "56 %" under the blocks; between them, y 300, 28 units: "10 points"
  [count-rate-treated, count-rate-control, count-effect].
- 57.4–58.0: S4 fades out entirely (opacity → 0; clear style and text of pooled SVG when hidden).
- 58.0–58.6: S2 returns at y 300–324 (same geometry as COMMIT), ticks 0/10/20/30.
- 58.6: segment 0–10 fills solid ink, label above it at y 284, 18 units caps + 28 units mono:
  "THE FEATURE 10"; segment 10–30 fills with 45° hatch, label "WHO CHOSE IT 20" [count-effect,
  count-selection].
- 59.2: the viewer's guess: accent pencil tick at x(g) = 180 + 20·g spanning y 290–334, label below at
  y 372, 28 units mono, accent: "YOUR GUESS 25" (film) or the sealed number; if null, no tick and the label
  "NO ANSWER" at x 180 [commit-default]. If g ≤ 10 the label right-aligns to the tick; else left-aligns.
- 60.0–62.0: hold; a 1-unit ink tick at x 380 (g = 10) thickens to 3 units ("the truth").

### MONDAY 62.0–72.0 · S2 held
- 62.0–62.6: S2 dims to opacity 0.35 and moves to y 380–404 (labels with it).
- 62.3: eyebrow 12 units "MONDAY" at (480, 96); question, 36 units DM Sans, two centred lines y 170 and
  y 214: "Who turned it on," / "and would they have stayed anyway?"
- 64.0: sub-line, 22 units, y 270: "Before you credit a feature, hold it back from a random half."
- 67.2: caption 14 carries the honest limit. 71.8–72.0: last frame holds.

### BRAND 72.0–75.0
Cut (0.3 s cross-fade) to a plain paper card: "CETI" wordmark line (Big Shoulders Display 600, 48 units,
centred y 250), hairline below, takeaway 28 units DM Sans y 310: "Who chose it is not what it did." No captions.

## Page-only text (live page, below the stage)
Honest limits (each a claim): "The 100 customers are a teaching set. Seed 90 was picked because its split
comes out even; across 10,000 seeds, 90 % of 50/50 splits land between −6 and +26 points." · "The 1991
studies were mostly estrogen alone; the 2002 arm was estrogen plus progestin. The 2004 estrogen-alone
trial also found no heart benefit (HR 0.91)." · "Timing may matter: women within 10 years of menopause had
HR 0.76, not significant (Rossouw 2007)."
Try-it panel suggestion: sliders for P1 and A1 (who opts in) re-run both passes with the same seeds.
