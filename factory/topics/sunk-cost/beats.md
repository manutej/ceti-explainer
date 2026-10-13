# sunk-cost · beat sheet (75 s = 72 s of material + 3 s CETI brand card)

Canvas 960 × 540 design units. Silent. Ink material, exec level (Q6): typeset numbers in IBM Plex Mono
400/500, display in Big Shoulders Display 600, paper ground, one red pencil colour reserved for the viewer's
guess. Every digit below is a claim id in claims.json (in brackets).

## Timeline

| beat | t (s) | structure | what happens |
|------|-------|-----------|--------------|
| HOOK | 0.0–8.0 | S1 spend bar | The project bar: spent block "$4M" [hook.spent] in ink, the rest a dashed outline "TO FINISH · ?"; CONTINUE / STOP beneath, a pencil tick drifts to CONTINUE at 4.0. |
| COMMIT | 8.0–16.0 | S2 tickets + commit box | Two season tickets: "$15" and "$8" (the $15 struck, "$7 OFF"). 10.8: "17 PEOPLE · 85 TICKETS" under the $8 ticket. Commit box. |
| CASE | 16.0–36.0 | S2 tickets → S3 grid | Three tickets $15 / $13 / $8, "SEASON 1982–83". 60 buyer marks queue, are dealt 20 / 20 / 20, six are struck (couples), the 54 left each grow a row of five hollow squares: the grid. |
| COUNT | 36.0–62.0 | S3 ticket grid | Fill $15, fill $8, sort, your guess vs 29, fill $13, then per-person 4.11 / 3.32 / 3.29. Frame-by-frame below. |
| MONDAY | 62.0–72.0 | S1 spend bar | Grid fades; the spend bar returns; the spent block greys out "GONE EITHER WAY"; the Monday question typeset; honest-limits caption. Last frame holds 71.8–72.0. |
| BRAND | 72.0–75.0 | S4 brand card | Plain paper card: "CETI" wordmark line; takeaway "What's spent is spent. Decide on what's left." |

## The four structures
1. **S1 · The spend bar** (HOOK, MONDAY). A rule at y 230 from x 120 to 840. Spent block x 120–520, solid
   ink, label above at 32 u: "SPENT · $4M". Remainder x 520–840 as a dashed outline, label 28 u "TO FINISH · ?".
   Beneath at y 300, 28 u: "CONTINUE" (x 300) and "STOP" (x 620). The block's length is not a number and is
   never labelled as a fraction.
2. **S2 · The season tickets** (COMMIT, CASE). Typeset ticket cards 180 × 90, no logo, no art: a thin border,
   "SEASON TICKET · 1982–83" at 14 u, the price at 40 u mono 500. In the COMMIT two cards sit at cx 300 and
   660, y 120–210, with the commit box at y 300–400. In the CASE three cards (180 × 80) sit at cx 220 / 480 /
   740, y 10–90, clear of the stacks below, and at 33.8–35.8 shrink into the column headers of S3.
3. **S3 · The ticket grid** (CASE end, COUNT). One square per holder per play. Specified below.
4. **S4 · The brand card** (72–75). Q8.
The commit box and the caption band are player chrome, not structures.

## Captions (14; each ≤ 60 characters; 28 u; one at a time)

| # | in | out | text | chars |
|---|----|-----|------|------:|
| 1 | 0.6 | 3.8 | We've already spent $4M on this. We can't stop now. | 51 |
| 2 | 4.0 | 7.8 | That money is gone either way. Does it still steer us? | 54 |
| 3 | 8.2 | 10.6 | A season ticket: five plays. Some paid $15, some $7 less. | 57 |
| 4 | 10.8 | 15.8 | 17 people got $7 off: 85 tickets. How many went unused? | 55 |
| 5 | 16.2 | 22.0 | Ohio University Theater, 1982. The first 60 season buyers. | 58 |
| 6 | 22.2 | 28.6 | Each was sold a $15, $13 or $8 ticket, at random. | 49 |
| 7 | 28.8 | 35.8 | Six bought as couples, set aside. Who came to plays 1–5? | 56 |
| 8 | 36.4 | 41.8 | Paid $15: 18 people, 90 tickets. 74 used, 16 empty. | 51 |
| 9 | 42.0 | 47.8 | Got $7 off: 17 people, 85 tickets. 56 used, 29 empty. | 53 |
| 10 | 48.0 | 53.8 | You said 17 unused. The stubs say 29. | 37 |
| 11 | 54.0 | 57.0 | $2 off was no better: 63 of 95 used. | 36 |
| 12 | 57.2 | 61.8 | Per person: 4.11 of 5 plays at $15; 3.29 at $8. | 47 |
| 13 | 62.4 | 66.6 | If the $4M weren't spent, would we fund the rest today? | 55 |
| 14 | 66.8 | 71.8 | One theatre, 54 people; by plays 6–10 the gap had faded. | 56 |

Caption 10 is templated on the viewer's guess g: "You said {g} unused. The stubs say 29." (g = 17 in film
mode, [commit.default]); with no answer: "No guess. The stubs say 29." (27 chars).

## The commit
- Prompt (box, 28 u): **"17 people got $7 off: 85 tickets. How many went unused?"** Integer input 0–85.
- Film mode (Q13): box visible 8.4–16.0; countdown digit = ceil(16 − t), 8 … 1 [commit.hold]; the default
  **17** [commit.default] types in at 13.0; "SEALED" stamp (14 u chrome) at 15.2. `film.json.defaultGuess = 17`.
- Live page: playback pauses at t = 11.2 (caption 4 on screen), holds 8 s real time or until Enter; empty at the
  timer ends as "no answer". The guess is stored in state and first appears at 48.0.
- Nothing about the answer is on screen before 36.4: no used counts, no means, no empty count, no full-price
  attendance. 17 and 85 are setup, not answer.
- Why one number, not the brief's two (full price vs $7 off): the format allows one committed number, and a
  count of unused tickets lands directly on the grid as squares, so the viewer's number is placed on the
  same marks as the truth. The full-price column beside it carries the comparison.

## CASE frames (16–36), for the hand-off into S3
- 16.0–16.6: tickets $15 / $13 / $8 fade in at cx 220 / 480 / 740.
- 16.2–21.6: 60 buyer marks (8 × 8 u squares, ink) enter a queue at y 300 from the left, one every 0.09 s.
- 22.2–26.4: marks are dealt to the three tickets in a seeded order (mulberry32 seed 1982, a shuffled list
  of 20 × "15", 20 × "13", 20 × "8"); each stacks under its ticket at pitch 17 from y 100: 20 / 20 / 20.
  14 u label under each stack: "20" [case.perGroup].
- 28.8–30.4: six marks struck through and dimmed to 25 %: in $15 the marks at rows 6 and 13, in $13 row 9,
  in $8 rows 4, 11 and 16 (fixed, not data: the paper does not say which buyers). 14 u label at y 470:
  "6 BOUGHT AS COUPLES · SET ASIDE · 54 COUNTED" [case.couples, case.analysed].
- 30.4–31.2: struck marks fade out; the remaining marks close ranks: 18 / 19 / 17 rows.
- 31.2–33.8: each mark grows rightward into its holder row of five hollow squares (S3 rest state); 14 u
  "PLAYS 1–5" above the $15 column.
- 33.8–35.8: tickets shrink into the column headers. End state = COUNT at t 36.0.

## COUNT · frame by frame (36.0–62.0)

### Geometry (design units)
- Columns, left to right by price: `$15` cx 220 (n 18), `$13` cx 480 (n 19), `$8` cx 740 (n 17).
- Square side s = 14, pitch 17 (gap 3). Row width 82. Column left xl = cx − 41.
- Slot k = r·5 + p (holder row r = 0..n−1, play p = 0..4). Rest position: x = xl + 17·(k mod 5),
  y = 100 + 17·floor(k / 5). Tallest column (19 rows) ends at y 420.
- Header: price at baseline y 62, 32 u mono 500, centred on cx. Sub-label baseline y 84, 14 u:
  "18 PEOPLE · 90 TICKETS", "19 PEOPLE · 95 TICKETS", "17 PEOPLE · 85 TICKETS".
- Counter: baseline y 456, 28 u, centred on cx: "{used} USED".
- Brackets: truth bracket on the right of a column at x = cx + 51, label 28 u at x = cx + 61, vertically
  centred on the bracket. The viewer's bracket only on `$8`, red pencil, at x = cx + 111 (851), label "{g}"
  28 u red at x 861 with "YOUR GUESS" 14 u chrome above it.
- Caption band: baseline y 515, 28 u.

### Which squares are empty (pure, seeded)
For each column, list slot indices 0..5n−1, Fisher–Yates shuffle with mulberry32(seed), seeds 15, 13, 8 for
$15, $13, $8; the first E indices are unused, the rest used. E = 16, 32, 29; used U = 74, 63, 56
[count.empty15/13/8, count.used15/13/8]. The arrangement is illustrative (the paper reports totals only); the
totals are exact. Compute once at load; never in render.

### Square states
- **hollow** (not yet revealed): 1 u outline, ink at 35 %.
- **used** (revealed): solid ink fill, 100 %.
- **unused** (revealed): 1.5 u outline, ink at 100 %, paper inside.
- Reveal of slot (r, p) in a column with start T0 and sweep length D: tr = T0 + p·D + (r / n)·0.6·D; the state
  cross-fades hollow → used/unused over 0.15 s from tr. Counter(t) = number of used slots with tr ≤ t
  (an integer from t alone; it ticks).

### Sort (pure)
Sorted index: the j-th used slot (in original k order) → j; the j-th unused slot → U + j. So unused squares
end at the bottom in reading order: `$15` rows 0–13 full, row 14 = 4 used + 1 unused, rows 15–17 unused
(16 = 1 + 15); `$8` rows 0–10 full, row 11 = 1 used + 4 unused, rows 12–16 unused (29 = 4 + 25); `$13` rows
0–11 full, row 12 = 3 used + 2 unused, rows 13–18 unused (32 = 2 + 30). For slot k with sort start Ts:
u = easeInOutCubic(clamp((t − Ts − 0.3·k/(5n)) / 0.7, 0, 1)); position = lerp(rest(k), rest(sorted(k)), u).

### Frames
- **36.0** Grid at rest, all 270 squares hollow. Headers in ink for `$15` and `$8`; `$13` header and squares at
  40 % until 54.0.
- **36.4–41.0** `$15` sweep, T0 36.4, D 1.0: play 1 for all 18 rows, then play 2 … 5. Counter ticks 0 → 74.
- **41.0–41.8** `$15` holds: "74 USED". Caption 8.
- **42.0–46.6** `$8` sweep, T0 42.0, D 1.0. Counter ticks 0 → 56. Caption 9.
- **47.0–48.0** `$15` and `$8` sort together (Ts 47.0). Empties settle to the bottom.
- **48.0–48.6** The viewer's guess: on `$8`, the last g slots in sorted order (indices 85 − g … 84) get a 2 u
  red outline, and the red bracket at x 851 spans from the top of the row holding index 85 − g to the
  bottom of row 16; label "{g}" and "YOUR GUESS". g = 17: the bracket covers row 13 (last 2 squares) to row
  16. If g > 29 the red outline runs up into inked squares; if g = 0, a red tick at the column foot reading
  "0". No answer: label "NO GUESS", no red marks. Caption 10 from 48.0.
- **48.8–51.2** The truth: on `$8`, each unused square gets a small ink dot in sorted order (one every
  0.083 s); the truth bracket at x 791 grows with them; its label counts 0 → 29. At the same time, on `$15`,
  bracket at x 271 grows over its 16 empties, label 0 → 16.
- **51.2–53.8** Hold: `$15` 16 · `$8` 29 against the red guess. Nothing else moves.
- **54.0–56.0** `$13` comes to full ink; sweep T0 54.0, D 0.44; counter 0 → 63. Caption 11.
- **56.4–57.0** `$13` sorts (Ts 56.4, compressed: (t − Ts − 0.15·k/95) / 0.45); bracket at x 531 grows, label
  "32" at 57.0.
- **57.2–58.0** Counters cross-fade to the per-person readout, baseline y 456, 32 u mono 500: "4.11",
  "3.32", "3.29" [count.mean15/13/8]; beneath at y 476, 14 u: "74 ÷ 18 · OF 5", "63 ÷ 19 · OF 5",
  "56 ÷ 17 · OF 5". Counts were drawn first; the ratio always carries its division (Q14). Caption 12.
- **58.0–61.8** Hold the full comparison.
- **62.0** Hand-off to MONDAY: grid fades to 0 over 62.0–62.6.

## MONDAY frames (62–72)
- 62.4–63.4: S1 returns as in the hook. 63.4–64.4: the spent block slides down 40 u and dims to 25 %; its label
  becomes "GONE EITHER WAY" (28 u). The dashed "TO FINISH · ?" part brightens to full ink.
- 64.4–71.8: the question typeset at 28 u, centred, y 390 and 424: "If the $4M were not already spent," /
  "would we fund the rest today?". Captions 13, then 14 (honest limits).
- 71.8–72.0: last frame holds.

## Brand card (72–75)
72.0–72.4 fade to a plain paper card: "CETI" wordmark line (Big Shoulders Display 600, 48 u), beneath at 28 u:
"What's spent is spent. Decide on what's left." No numbers.

## Notes for the builder
- Chapters: HOOK 0, COMMIT 8, CASE 16, COUNT 36, MONDAY 62, CETI 72.
- Seeds: buyer deal 1982; empties 15 / 13 / 8. No other randomness.
- The second-half means (2.28, 1.54, 2.18) and t values are for the page's sources and limits blocks, not the
  stage. If the page shows them, add claims first (1.54 is the paper's figure, though 29/19 = 1.53).
- On the page, honest limits (long form) and the five sources come from brief.md.
