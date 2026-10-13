# streaks · 75-second beat sheet

Canvas 960 × 540 units. Material 0.0 to 72.0 s, CETI brand card 72.0 to 75.0 s (total 75.0 s). Silent; captions
carry it (kit `caption()`: IBM Plex Mono 500, 28 units, band at y ≈ 474, one line, ≤ 60 chars).
Faces: Big Shoulders Display 600 for headline numbers; IBM Plex Mono 400/500 for every other number and label.
Ink on paper (exec, Q6): kit palette; ink for marks, graphite for the viewer's side, ONE red (`C.accent`) for
the streak under suspicion (hook) and the boxed longest runs (count). No icons, no logos, no basketball imagery.
The kit's right-hand ledger and title block are OFF in every beat (`chrome(t, ch, {ledger:false, block:false})`);
the eyebrow (12, chrome) and chapter title (32) stay.

Up/down grammar used everywhere: one flip = one month = one vertical tick on a baseline. Heads = up
(tick above the line), tails = down (tick below). The generator is always `r() < 0.5 ? up : down`.

## The four structures
| # | structure | beats | what it is |
|---|---|---|---|
| S1 | The 12-month strip | HOOK, MONDAY | 12 up/down ticks, month letters; the last three (down) in red |
| S2 | The commit box | COMMIT | kit `commitBox`, centred: "LONGEST RUN", the question, the 8 s hold / 4 s ring |
| S3 | The fans' tally + guess bars | CASE | 10 × 10 squares (100 fans, 91 filled) and three true-scale bars 50 / 61 / 42 |
| S4 | The rows and their tally | COUNT | 10 rows × 100 ticks with the longest run boxed; the rows collapse into a 1,000-mark tally by longest run |

The brand card (72 to 75 s) is the kit's Q8 card, not a structure. Takeaway (film.json `brand.takeaway`):
**"Chance makes streaks. Ask what a coin would have done."**

## Commit
- Prompt on the box (`title` 28 units): "LONGEST RUN"; `prompt` (14): "IN 100 FAIR FLIPS · SAME SIDE IN A ROW".
  Caption 4 carries the question at 28 units. Input range 1 to 100, integers.
- Live page: pauses at 12.0 s and holds 8 s with the input; Enter commits; timeout = "no answer".
- Film mode: `commit.default: 4` (a typical intuitive guess; claim `guess`), typed at 13.2, ring 12.0 to 16.0,
  stamp "SEALED" at 15.6 (`commitBox(t, s, {at: 12, seal: 15.6, out: 16.0, x: 280, y: 150, w: 400, h: 200})`).
- Nothing numeric derived from the answer appears before 44.0 s.

## Beats and captions (14 captions, all ≤ 60 chars; lengths checked by script)
| # | t0 to t1 (s) | beat | caption | chars |
|---|---|---|---|---|
| 1 | 0.5 to 3.9 | HOOK | Sales fell three months in a row. | 33 |
| 2 | 4.1 to 7.8 | HOOK | The room says: something is wrong. Is it? | 41 |
| 3 | 8.2 to 11.8 | COMMIT | First, a coin. Flip it 100 times. Pure chance. | 46 |
| 4 | 12.0 to 15.8 | COMMIT | Longest run of one side in a row? Pick a number. | 48 |
| 5 | 16.2 to 20.6 | CASE | 1985: Gilovich, Vallone and Tversky ask 100 fans. | 49 |
| 6 | 20.8 to 25.6 | CASE | 91 of 100: likelier to score after 2 or 3 hits than misses. | 59 |
| 7 | 25.8 to 30.6 | CASE | A 50% shooter? They guess 61% after a hit, 42% after a miss. | 60 |
| 8 | 30.8 to 35.8 | CASE | 76ers, 1980–81: no sign that hits bred more hits. | 49 |
| 9 | 36.2 to 40.8 | COUNT | Now pure coin flips: 100 per row, up or down. | 45 |
| 10 | 41.0 to 46.6 | COUNT | Ten rows. The longest run in each one is boxed. | 47 |
| 11 | 47.0 to 52.8 | COUNT | 1,000 rows of pure chance, stacked by longest run. | 50 |
| 12 | 53.0 to 61.8 | COUNT | {g} or less: {c} of 1,000. 7 or more: 546 of 1,000. (default: "4 or less: 33 of 1,000. 7 or more: 546 of 1,000."; no answer: "No guess. 7 or more: 546 of 1,000 rows. Pure chance.") | 48 / ≤ 53 |
| 13 | 62.4 to 67.4 | MONDAY | Monday: would a coin flip have made this streak too? | 52 |
| 14 | 67.6 to 71.8 | MONDAY | Limit: chance makes streaks. A hot hand may still exist. | 56 |

`{g}` is the viewer's number; `{c}` = count of the 1,000 sequences whose longest run ≤ g, thousands comma.
Every digit above is a claim in claims.json (the year 1985 and "76ers"/"1980–81" are year/render exempt but
also claimed). Caption 6 keeps the survey's comparison (after hits vs after misses); do not shorten it away.

## HOOK (0.0 to 8.0) · S1
- Eyebrow "CASE · STREAKS", title "Three bad months". A chrome line (12): "MONTHLY SALES · UP OR DOWN".
- Strip: 12 slots, x_m = 172 + 56 m (m = 0..11), baseline y = 250 (hairline 150 to 810, ink, op 0.35).
  Tick m is a 20-wide rect centred on x_m: up = y 170 to 248; down = y 252 to 330. Month letters
  J F M A M J J A S O N D, mono 14, centred at x_m, y 352 (no digits).
- Data (claims `hookMonths`, `hookFall`, `hookUp3`): first 12 flips of mulberry32(140) =
  `U U U D U D U U U D D D`.
- 0.5 to 4.35: tick m appears at 0.5 + 0.35 m (opacity 0 → 1 over 0.15 s; height grows from the baseline,
  easeOutCubic 0.25 s). All ink.
- 4.6 to 5.2: ticks 9, 10, 11 turn red (colour snap at 4.6, 4.8, 5.0). 5.2: red bracket under them,
  y 362, x 662 to 802, 6-unit end ticks. 5.6: tag "3 MONTHS DOWN" (mono 28, red, right-aligned x 802, y 400).
- The opening three rises stay ink and unlabelled (Monday points back at them). Hold to 8.0.

## COMMIT (8.0 to 16.0) · S2
- 8.0 to 8.6: strip ink eases to 20 % opacity; the red tag fades out.
- 11.0 to 11.8: kit commitBox fades in (x 280, y 150, w 400, h 200).
- 12.0: live page pause / film-mode ring; 13.2 default "4" types in; 15.6 "SEALED" stamp; 16.0 box out.

## CASE (16.0 to 36.0) · S3
- 16.0: strip and box gone. Eyebrow "1985 · COGNITIVE PSYCHOLOGY", title "The fans".
- Fans tally: 10 × 10 squares, 18 × 18, pitch 24, origin x 72, y 120 (spans x 72 to 306, y 120 to 354).
  16.6 to 18.0: outlines appear row by row (row r at 16.6 + 0.14 r), ink stroke 1.2. Label above (14):
  "100 FANS · CORNELL AND STANFORD".
- 20.8 to 22.8: squares k = 0..90 (reading order) fill ink at 20.8 + 0.022 k. Readout right of the grid,
  x 336: count "91" (Big Shoulders 64, y 200) with "OF 100" (mono 28, y 236) under it, counting up in step
  with the fills. Mono 14 under it (y 262 to 296, two lines): "BETTER CHANCE AFTER 2 OR 3 HITS / THAN AFTER
  2 OR 3 MISSES". The 9 empty squares stay outlines.
- 25.8 to 28.2: three true-scale bars, x0 = 520, 4 units per percentage point, height 22:
  y 150 "A 50 % SHOOTER" bar 200 (ink) · y 230 "FANS' GUESS AFTER A HIT" bar 244 (graphite) ·
  y 310 "FANS' GUESS AFTER A MISS" bar 168 (graphite). Labels mono 14 above each bar; value mono 28 at bar
  end + 12 ("50", "61", "42"). A vertical ink hairline at x 720 (the 50 mark) runs through all three bars so
  the 11-point gap above and 8-point gap below read at true scale. Bars grow left to right over 0.6 s,
  staggered 0.8 s.
- 30.8 to 31.4: line in mono 28 at x 520, y 400: "76ERS 1980–81: NO LINK" and mono 14 under it (y 424):
  "NO POSITIVE CORRELATION BETWEEN SUCCESSIVE SHOTS". The two guess bars ease to 40 % opacity at 31.4.
- 35.4 to 36.0: S3 fades out.

## COUNT (36.0 to 62.0) · S4, frame by frame
Data: one stream `r = mulberry32(1985)`; sequence m (m = 0..999) is 100 flips `r() < 0.5 ? up : down`,
generated in order. L[m] = longest run of the same result in sequence m. Rows shown = sequences 0..9.
Precompute once at load (outside render); render(t, state) only reads.

Row data (U = up, D = down; claims `row1`..`row10`; "U@76" = run of ups starting at flip index 76):

| row | flips | L | boxed run(s) |
|---|---|---|---|
| 1 | `DDDUUDUUUUDDUDUDUUUDUDDUUUUDDDUDUUDDDDDDUUDUDDUDDUDUUUDUDDDUDDUDUUUDDUUUUDUDUUUUUUUUDUDUUUUUDDDDDDDU` | 8 | U@76 |
| 2 | `DDUDDDUUDUUDUDDUUDUDDUUDUDDDDUUUUUUDDUUDUUUDUDUDUDDUUDDDDUDDDUDUUUDDDDDDUDDDUDDDUUUDUUDUUUDUDUUDDUDU` | 6 | U@29, D@66 |
| 3 | `DUDDUDDDUDDDUDDUUUDDDUUDUUDDDDUDUUUDDUDUDUDDDUDDUUDUDUDUDDDDUUDUDUUDDDUUUDUDUUDUUDDUDDUUDDUUUDUDUDUU` | 4 | D@26, D@56 |
| 4 | `UDDDUDUUUUDDDDDDUUUDDUUDUDUDDUDUUDDUDUUDDDUDUUDDDDDDDDUUDUUDUUDDUDDDDDDUUDDUDUUDDDDUUDUUUUUUDUUDUDUD` | 8 | D@46 |
| 5 | `DUDDUDDDUUDDDDDUDUDDDUDDDDDUDDDUUDUUDDUUDDUDDDDDUUDDDDDDUDUDUDDUUDDUUDUDDUUUUDUUDDUDUDDUUDUDDUUUUDUD` | 6 | D@50 |
| 6 | `UUDUDDDDDDDUUUDUDUUUDUUUDUUDUDDDUUDDUUUDUDUUDUUDUDDDDDUDDUDUDDUUDDUDDUUDUUDUUDDUUUDUDDDDUUUUDDDDUUUU` | 7 | D@4 |
| 7 | `UUDDUUUUDDUUDUUUUUUUUUUDDUDDDDUUUUDDUUUDDDDUUUDDDUUUDUDUDDUUUDDUDUDDUUDDDDUDDUUUDUDDDDUDDDUUUUDUUDUU` | 10 | U@13 |
| 8 | `DUDDUDUUUDUDUDDDDUDDUDUUDDDDUUDDDUUDDUUDDDUUDDDDUUDUDDDUDUDDUUUDDUDDUDDDUUDDUDUDDDUDUUUUUDDUDUUUDDDD` | 5 | U@84 |
| 9 | `DDUUDDDDUUDUUUUUUUDDUUUUDUUUUUUUDUDUUDUUUUUDUDDUDUUUUDUDUDUUUDUDDUUUDDDDUUUUUUDUDUDDDUDUDDUDUDUUDDUD` | 7 | U@11, U@25 |
| 10 | `DUUDUDDDUDUUUUDDUUDDDDUUUDUUDUDDDUDDUUDDDDDUDUUDDUUDUDUDDUUUUDDDUUDDDDDDDDUDDUDDUUDUUUUDDDDUUUDDDDUD` | 8 | D@66 |

Box every run whose length equals the row's L (ties in rows 2, 3, 9 get two boxes).

Row geometry: row i (i = 0..9) baseline y_i = 118 + 32 i (118 to 406); hairline x 52 to 776, op 0.25.
Flip j: x_j = 56 + 7.2 j; tick 3.2 wide (x_j to x_j + 3.2); up = y_i − 12 to y_i − 1; down = y_i + 1 to
y_i + 12; ink. Box (red, stroke 1.6, no fill): x from x_s − 2 to x_{s+L−1} + 5.2, y from y_i − 15 to y_i + 15.
Right column: header "LONGEST RUN" mono 14, right-aligned x 904, y 100; row value mono 500 28, right-aligned
x 904, baseline y_i + 10.

1. **36.0 to 36.6 · clear.** S3 gone; eyebrow "THE COUNT · PURE CHANCE", title "Rows of 100".
2. **36.6 to 40.2 · row 1, slowly.** Flip j appears at 36.6 + 0.03 j (opacity snap over 0.06 s). While it
   draws, the row-1 value slot shows the CURRENT run length (graphite, mono 28): the length of the run ending
   at the last visible flip; it counts up and resets to 1 on every change, so the viewer watches 8 accumulate
   at flips 76 to 83. 39.6 to 40.1: the box draws on (stroke-dashoffset perimeter → 0); at 40.1 the slot
   snaps to the boxed L = 8 in ink.
3. **40.2 to 44.0 · rows 2 to 10.** Row i (i = 1..9) starts at s_i = 40.2 + 0.28 (i − 1); flip j at
   s_i + 0.012 j (row drawn in 1.2 s); box draws over s_i + 1.2 to s_i + 1.5; value types in at s_i + 1.5
   (no running counter on these rows). Last value lands at 43.94. End state: 1,000 ticks, 13 boxes,
   values 8, 6, 4, 8, 6, 7, 10, 5, 7, 8.
4. **44.0 to 46.8 · the guess on the rows.** If the viewer answered g: the header "LONGEST RUN" is replaced
   by the readout "{k} OF 10 BEAT YOUR {g}" (mono 28, right-aligned x 904, y 96; red for "YOUR {g}"), where
   k = #rows with L > g (default g = 4 → "9 OF 10 BEAT YOUR 4", claim `rowsBeatGuess`). Row values with
   L ≤ g turn graphite with a red underline (x 864 to 904, y_i + 14); values > g stay ink. No answer: the
   header stays; nothing changes.
5. **46.8 to 49.0 · collapse.** Ticks and boxes fade to 0 over 46.8 to 47.6. Each of the 10 row values travels
   (easeInOutCubic, 1.2 s, start 47.0 + 0.08 i) from (904, y_i + 10) to its tally slot (below); in its last
   0.2 s the digits fade out and a 5 × 5 ink square fades in at the slot. The tally axis (step 6 geometry)
   fades in 46.8 to 47.4. ROWS counter shows "10".
6. **49.0 to 53.0 · 990 more.** Sequence m (m = 10..999) lands at t_m = 49.0 + (m − 10) · 4.0 / 990. Each falls
   from y 120 to its slot over 0.25 s (easeOutCubic) and is drawn at its slot when t ≥ t_m + 0.25.
   Tally geometry: columns c = 0..9 for L = 4, 5, …, 12 and 13+ (L ≥ 13); column left x_c = 64 + 72 c, width 60.
   The k-th sequence to arrive in column c (k from 0, arrival order = m order) sits at
   x = x_c + 6 (k mod 10), y = 396 − 6 (⌊k / 10⌋ + 1) + 1, a 5 × 5 square, ink.
   Axis: hairline y 397.5, x 60 to 776; labels "4" … "12", "13+" mono 28 centred at x_c + 30, y 428.
   Count above each column: mono 28 centred x_c + 30, baseline 396 − 6·⌈n_c / 10⌉ − 10, live n_c (shown once
   n_c ≥ 1). Right column (x 800 to 920): "ROWS" mono 14 at y 150; counter Big Shoulders 48 right-aligned
   x 904, y 200 = number of sequences landed (10 → 1,000, thousands comma).
   Final counts (claims `bin4`..`bin13`): 33, 158, 263, 244, 150, 82, 33, 23, 8, 6 (sum 1,000; tallest
   column 263 = 27 layers, top y 234).
7. **53.0 to 56.0 · your number on the tally.** If g given: red rule (stroke 2) at x = 64 + 72·(c_g + 1) − 6
   (the gap right of g's column; for g < 4 at x 58; for g ≥ 13 at x 778), drawn top to bottom y 140 to 400
   over 53.0 to 53.6. Marks left of the rule ease to graphite 50 % (53.6 to 54.0). Label at x rule + 8, y 150,
   mono 28, red: "YOUR {g} · {c} AT OR BELOW" (c from the data, never from the drawing; default
   "YOUR 4 · 33 AT OR BELOW", claim `wallLeGuess`), and under it mono 14 ink: "{1,000 − c} RAN LONGER"
   (default 967, claim `wallGtGuess`). If g ≥ 9 put the label left of the rule, right-aligned at rule − 8.
   No answer: no rule; label "NO GUESS" mono 28 graphite at x 64, y 150.
8. **56.0 to 59.0 · seven or more.** Ink bracket at y 200 from x_3 to x_9 + 60 (x 280 to 772), 8-unit end
   ticks down, drawn left to right 56.0 to 56.5. Label above, mono 28 ink, centred x 526, y 190:
   "7 OR MORE: 546 OF 1,000" (claim `wallGe7`). Columns 7..13+ go full ink (if dimmed by the guess, they stay
   dimmed only where left of the rule).
9. **59.0 to 62.0 · the odds, only now.** Right column, fade in 59.0 to 59.4: "EXACT · EVERY POSSIBLE 100 FLIPS"
   mono 14 at y 250 (wrapped to two lines within x 800 to 920); "54 %" Big Shoulders 48 at y 310 with mono 14
   "RUN OF 7+" under it (y 330); "97 %" Big Shoulders 48 at y 390 with "RUN OF 5+" (y 410)
   (claims `exactGe7`, `exactGe5`). Everything holds to 62.0.

Purity: the only inputs are t and state.answer. Ticks, boxes, arrivals and labels are pure functions of t over
the precomputed arrays; clear `style` and text on every hidden pooled element.

## MONDAY (62.0 to 72.0) · S1 returns
- 62.0 to 62.6: tally fades to 0; S1 strip fades back in at full ink (same geometry, all 12 ticks drawn,
  9 to 11 red, bracket, no tag). Eyebrow "MONDAY", title "The question".
- 63.0: kit stamp over the strip, centred x 480, y 150, text "12 COIN FLIPS" (fs 28), scale 1.4 → 0.9 over 0.22 s.
- 63.6: readout under the strip, mono 28, centred x 480, y 410: "58 OF 100 COIN-FLIP YEARS HAVE ONE"
  and mono 14 under it (y 432): "A 3-MONTH FALL SOMEWHERE IN 12 MONTHS · EXACT" (claims `yearFall`, `years`,
  `hookMonths`, `hookFall`).
- 64.4: the first three (up) ticks (x 162 to 294) get a graphite bracket at y 160 with mono 14 "NOBODY CALLED THIS A TREND".
- 67.6: caption 14 (honest limits) at 28 units. Last material frame holds to 72.0.

## Brand card (72.0 to 75.0)
Kit `brandCard` at `brand.at = 72`: CETI wordmark line, takeaway "Chance makes streaks. Ask what a coin would
have done." No numbers.

## Try-it panel (live page, below the player)
Input n (flips, 10 to 1,000) and g; reruns the exact recursion: P(longest ≥ g+1), expected longest run
(6.98 at n = 100; claim `exactMean`), and a "flip 100" button that draws a fresh seeded row (seed = clicks).
Transcript and sources list the Miller–Sanjurjo note (0.46 after HHH in 100 flips; claim `msBias`).

## film.json seeds for the builder
```json
{ "id": "streaks", "dur": 75, "commit": { "at": 12.0, "hold": 8, "default": 4, "range": [1, 100],
    "unitLabel": "IN 100 FAIR FLIPS · SAME SIDE IN A ROW" },
  "brand": { "at": 72, "takeaway": "Chance makes streaks. Ask what a coin would have done." },
  "honest": "Chance makes streaks; that does not prove the hot hand is a myth. A 2018 re-test (Miller & Sanjurjo) found a bias in the 1985 method. Real sales months are not coin flips; the coin is the comparison, not the diagnosis. The 12-month strip was picked from seeded flips to end on three falls.",
  "params": { "n": 100, "hookSeed": 140, "months": 12, "fall": 3, "wallSeed": 1985, "wallN": 1000,
    "rowsShown": 10, "guessDefault": 4 },
  "chapters": [ ["HOOK", 0, 8], ["COMMIT", 8, 16], ["CASE", 16, 36], ["COUNT", 36, 62], ["MONDAY", 62, 72],
    ["BRAND", 72, 75] ] }
```
Copy `params` and `claims` from `topics/streaks/claims.json` into the film (the gate reads
`films/streaks/claims.json` as a bare array and `film.json.params` for formulas).
