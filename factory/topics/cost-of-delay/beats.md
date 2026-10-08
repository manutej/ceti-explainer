# Cost of delay · beat sheet (75 s: 72 s of material, then a 3 s brand card)

Stage 960 × 540 design units. Caption band reserved: y 470 to 530 (caption 28 units, DM Sans 500, left
x 48, max width 864; red tick at x 48, y 478). All stage content lives in y 20 to 456.
Faces: Big Shoulders Display 600 (letters, counters), IBM Plex Mono 400/500 (every number), DM Sans
(captions, prompts). Ink on paper; one red pencil accent (the viewer's pin, the savings bracket). No icons.
Every digit on screen is a claim id in claims.json (named in brackets below).

## Timeline

| beat | t (s) | what is on stage |
|---|---|---|
| HOOK | 0.0 to 8.0 | the board (S1) draws: month heads, three rows, bars in the plan's order (biggest first) |
| COMMIT | 8.0 to 16.0 | board dims; the sealed number box (S2); live page holds 8 s; film mode types the default |
| CASE | 16.0 to 36.0 | Maersk strip (S3): 46 week cells, 38 waiting, 38 marks of $200k, the product |
| COUNT | 36.0 to 62.0 | board returns with the mark area and the tally row (S4); three orders counted (38.0–43.85, 48.0–50.65, 53.5–55.75); pin at 45.0; CD3 labels last (58.0) |
| MONDAY | 62.0 to 72.0 | final board holds at 0.35; Monday question and honest-limits line in captions |
| BRAND | 72.0 to 75.0 | last frame holds to 72.2; plain paper card: "CETI" wordmark line and the takeaway |

## The four structures
1. **S1 The board**: three feature rows (A, B, C) on six month columns; bars are the work; rows never move,
   bars slide horizontally to change the order. Under it, the mark area (stacked £50k marks per month).
2. **S2 The sealed number**: one input box, "£ ___ k", an 8 s countdown ring, the SEALED stamp; it parks in
   the ledger and returns as the red pin.
3. **S3 The Maersk strip**: 46 week cells; 38 marked as waiting; one $200k mark per waiting week.
4. **S4 The tally**: a row of 36 slots (one per £50k) that fills in step with the mark area, a big counter,
   and a four-line ledger (three orders and YOU SAID).

## Commit prompt and default
- Prompt (in the box, 22 units): "Biggest first, as planned. Six months of waiting costs, in total:"
- Input: "£ [   ] k" (mono 40 units). Live page: pauses at 8.2 s, holds 8 s, then "no answer".
- Film mode default (film.json `defaultGuess`): **500** [guess] → shown "£500k".
- Nothing derived from the answer appears before 45.0 s.

## Captions (14; each ≤ 60 characters; [t0, t1, text])
```
[ 0.5,  4.1, "“Start with the biggest. The small ones can wait.”"]
[ 4.3,  7.9, "Three features. Each earns only once it ships."]
[ 8.2, 15.8, "Biggest first. Seal a number: what does waiting cost?"]
[16.3, 20.6, "Maersk Line: one feature, 82 hours of work."]
[20.8, 25.6, "It took 46 weeks to ship. 38 were spent waiting."]
[25.8, 30.6, "Each week of waiting: over $200,000 not earned."]
[30.8, 35.8, "38 × $200k = $7.6M. Their own estimate: nearly $8M."]
[36.3, 41.6, "Your three. One mark: £50k not yet earned, per month."]
[44.0, 47.4, "Biggest first: 29 marks. £1.45M."]
[50.9, 53.6, "Cheapest first: 29 marks. The same £1.45M."]
[56.0, 59.0, "Reordered: 24 marks. £1.2M. Same work, same team."]
[59.2, 62.0, "The rule: £ a month ÷ months of work. Highest first."]
[62.2, 66.8, "Monday: what does a month of delay cost, for each item?"]
[67.0, 71.8, "Teaching numbers. Real cost of delay is an estimate."]
```
Claim ids by caption: 1, 2, 3, 12 to 14 carry no digits (the box prompt's "six months" is [horizon]); 4 → mHours; 5 → mWeeks, mWait;
6 → mWeekly; 7 → mWait, mWeekly, mLost, mEstimate; 8 → unit; 9 → marksBig, costBig; 10 → marksCheap,
costCheap; 11 → marksCD3, costCD3.
Brand card takeaway (not a caption): "Do first what loses the most per month of work."

## HOOK (0 to 8) · S1
- 0.0: paper. Eyebrow 12 units chrome at (24, 34): "COST OF DELAY".
- 1.0 to 1.6: month heads "1" to "6" [horizon], 16 units mono, centred on columns at y 70; "MONTH" chrome
  12 at (196, 52). Grid: x0 = 196, column width 90 (x 196 to 736). Hairline column rules y 76 to 380, 0.5 ink.
- 2.0 / 2.6 / 3.2: row labels appear, rows at bar-top y A 84, B 124, C 164 (bar height 30):
  letter at x 24 (Big Shoulders 28); "£200k/mo" at x 52, baseline y+14 (mono 18) [codA]; "3 mo" at x 52,
  baseline y+30 (mono 14) [durA]. Same for B (£100k/mo, 1 mo) [codB, durB] and C (£50k/mo, 2 mo) [codC, durC].
- Tones: A solid ink; B ink at 55 %; C paper fill with 1.5 ink stroke and 45° hatch at 6 units. Marks use the
  same tone as their feature.
- 4.4 to 5.0: bar A draws left to right over months 1 to 3; 5.0 to 5.4: C over months 4 to 5;
  5.4 to 5.7: B over month 6. (Plan = biggest first: A, C, B.)
- 5.8: eyebrow "PLAN · BIGGEST FIRST" chrome 12 at (196, 34).
- 6.2: a short vertical ship tick (2 units wide, 10 tall) at each bar's right end, "SHIPS" chrome 12 above A's.

## COMMIT (8 to 16) · S2
- 8.0 to 8.4: board opacity 1 → 0.45.
- 8.4 to 8.9: box fades in, rect x 276 to 684, y 236 to 376, 1.5 ink stroke, paper fill. Prompt at
  (300, 270) DM Sans 22. "£ [ ] k" at (300, 336), mono 40; caret blinks by t (period 1 s, from t only).
  Countdown ring r 18 at (650, 262), sweeps 8.2 → 16.2.
- Film mode: digits "5", "0", "0" type at 10.0, 10.3, 10.6 [guess]. Live page: pause at 8.2, hold 8 s.
- 15.0: red "SEALED" stamp rotates in over the digits (stamp at (480, 316), w 150, h 52, fs 28).
- 15.4 to 15.9: box scales to 0.3 and slides to the ledger slot YOU SAID (right panel, y 236), shows "SEALED".

## CASE (16 to 36) · S3
- 16.0 to 16.4: board and ledger fade to 0 (clear style and text on hide). Eyebrow "THE CASE · MAERSK LINE".
  Source tag chrome 12 right-aligned at (936, 34): "ARNOLD & YÜCE · AGILE 2013" [year].
- 16.4 to 17.2: headline "82 hours of work." mono 500, 32 units, at (66, 130) [mHours].
- 20.8 to 22.6: 46 week cells draw left to right (stagger 0.04 s): cell pitch 18, width 15, height 40,
  x from 66 (66 + 46·18 = 894), y 190 to 230; outline 1 ink. Ruler under: "0" at x 66 and "46 WEEKS" right-
  aligned at x 894, y 252, 14 units mono [mWeeks].
- 23.2 to 24.8: cells 1 to 38 fill with 30 % ink (queue tone), stagger 0.04 s; bracket under cells 1 to 38 at
  y 262 with "38 WEEKS WAITING IN QUEUES" chrome 14 centred [mWait]. Cells 39 to 46 stay empty [mOther];
  no label (the source does not split them; do not imply calendar order).
- 25.8: legend at (66, 300): one solid ink chip 15 × 15 then "= over $200,000 not earned, that week",
  mono 16 [mWeekly].
- 26.4 to 30.2: one solid chip lands in each waiting cell, cell 1 to 38, stagger 0.1 s (38 · 0.1 = 3.8 s).
  Counter at right (x 894 right-aligned, y 140): Big Shoulders 56, counts 0 → 38 in step [mWait].
- 30.8 to 31.6: product line at (66, 360), mono 500, 36 units: "38 × $200k = $7.6M" [mWait, mWeekly, mLost].
- 31.8: second line at (66, 398), mono 20: "Maersk's own estimate: nearly $8M" [mEstimate].
- Hold to 36.0.

## COUNT (36 to 62) · S1 + S4 (code from this)
Geometry. Mark area: per month column m (1..6), column centre cx = 196 + 90·(m − 0.5); a mark is a rect
56 × 12 at x = cx − 28; stack step 16, bottom mark top at y 366, k-th mark (k from 0) top at y 366 − 16k
(7 marks reach y 270). Stack order bottom-up: A's 4, then B's 2, then C's 1, only for features still
unshipped in month m (a feature is unshipped in month m if its ship month ≥ m).
Tally row: 36 slots (36 · £50k = £1.8M), slot pitch 15, x from 196, mark 12 × 22 at y 404; slot outlines
0.5 ink. Red pin: 2-unit line at x = 196 + 15·(guess ÷ 50) − 1.5, y 398 to 432, clamped to x 196..736 with
an arrow head if beyond; tag "YOU" chrome 14 red, centred above at y 396.
Right panel x 756 to 944: ledger entries (label chrome 12, value mono 20) at y 86 BIGGEST FIRST, 136
CHEAPEST FIRST, 186 BY CD3, 236 YOU SAID; counter "MARKS" chrome 12 at y 290, number Big Shoulders 56 at
y 344, money mono 28 at y 380.
Marks per month (from claims): biggest first A C B [colsBig] 7 7 7 3 3 2; cheapest first B C A [colsCheap]
7 5 5 4 4 4; CD3 B A C [colsCD3] 7 5 5 5 1 1.

Frames.
- 36.0 to 36.4: strip fades out; board returns to opacity 1 in the plan's order (A 1–3, C 4–5, B 6);
  ledger returns (YOU SAID still SEALED).
- 36.4 to 37.2: legend at (196, 252): one A-tone mark then "= £50k not yet earned, that month", mono 16
  [unit]. 36 tally slot outlines draw left to right (stagger 0.02 s). Counter shows "0".
- 37.4: playhead (0.75 ink hairline, y 60 to 380) appears at x 196.
- Order 1, biggest first. Month m starts at T1(m) = 38.0 + 1.15·(m − 1). Playhead eases to the column's
  right edge over 1.15 s. Within the month, mark k pops at T1(m) + 0.1·k (scale 0.6 → 1 and opacity 0 → 1
  over 0.12 s); the same instant one mark fills the next tally slot (tone of its feature) and the counter
  increments. Month 1: 7 marks; 2: 7; 3: 7; 4: 3 (A shipped at end of month 3: A's ship tick turns solid at
  T1(4)); 5: 3; 6: 2 (C's tick solid at T1(6)). Last mark at 43.75 + 0.1 = 43.85. Counter 29 [marksBig].
- 44.2 to 44.5: money "£1,450k" types under the counter [costBig]; ledger BIGGEST FIRST "29 · £1,450k".
- 45.0 to 45.6: YOU SAID unseals: "SEALED" stamp lifts, "£500k" in red mono 20 [guess]; the red pin drops
  onto the tally row at slot 10 [guessMarks].
- 45.8 to 46.3: red bracket at y 440 from the pin to the end of slot 29; 46.3: label centred under it at
  y 452, mono 18 red: "£950k more than you said" [guessGap]. Sign-aware: guess > 1450 → "£Xk less than you
  said"; equal → "exactly what you said"; no answer → no pin, label "no number sealed".
- 47.4 to 48.0: bracket and its label fade; marks fade (0.3 s); tally fill clears leaving a hairline ghost
  tick at slot 29; bars slide (0.6 s, ease in-out) to B month 1, C months 2–3, A months 4–6; ship ticks
  return to hollow; playhead back to x 196; counter resets to 0. Pin stays.
- Order 2, cheapest first: T2(m) = 48.0 + 0.5·(m − 1), mark stagger 0.05 s. Columns 7 5 5 4 4 4 (B ships
  at T2(2), C at T2(4)). Month 6 starts 50.5; last mark 50.5 + 0.05·3 = 50.65. Counter 29 [marksCheap];
  50.9: money "£1,450k" [costCheap]; ledger CHEAPEST FIRST "29 · £1,450k". Caption 10 only now (50.9).
- 53.0 to 53.5: same reset; bars slide to B month 1, A months 2–4, C months 5–6.
- Order 3, CD3: T3(m) = 53.5 + 0.45·(m − 1), stagger 0.05 s. Columns 7 5 5 5 1 1 (B ships at T3(2), A at
  T3(5)). Month 6 starts 55.75 with its one mark. Counter 24 [marksCD3]; 55.9: money "£1,200k" [costCD3];
  ledger BY CD3 "24 · £1,200k". Caption 11 only now (56.0).
- 56.2 to 57.0: slots 25 to 29 get a red dashed outline (1.5); red bracket over them at y 440; label at
  y 452, mono 18 red: "5 marks · £250k" [savedMarks, saved]. The pin and its slot stay visible.
- 58.0 to 59.2: only now the ratio appears (every count is drawn). Header chrome 12 at (196, 52) changes to
  "£k A MONTH ÷ MONTHS OF WORK". Inside each bar, centred, mono 500 20: B "100" [cd3B], A "67" [cd3A],
  C "25" [cd3C] (paper-coloured text on A and B, ink on C), typed at 58.0, 58.4, 58.8.
- 59.2 to 62.0: hold. The highest ratio sits first, left to right: 100, 67, 25. Caption 12 states the rule.

Order-1 rule restated for code: caption 9 starts at 44.0, after the 29th mark (43.85). No caption names a
count before its last mark is drawn.

## MONDAY (62 to 72)
- 62.0 to 62.4: everything on stage to opacity 0.35 except the three CD3 figures and the tally row
  (hold at 1). No new stage text; captions 13 and 14 carry the beat.
- 71.8 to 72.0: captions off; last frame holds.

## BRAND (72 to 75)
- 72.2 to 72.6: plain paper card fades in over the held frame (opacity 0 → 1).
- "CETI" wordmark line, Big Shoulders 40, centred at y 240; takeaway DM Sans 28 centred at y 300:
  "Do first what loses the most per month of work." Hold to 75.0.

## Try-it panel (live page only)
Three sliders per feature (value £k a month, months of work) and an order picker with all six orders;
reruns the same Σ value × ship month and the CD3 sort; shows the viewer's sealed number against the chosen
order. Defaults are the teaching values; the six totals are in brief.md (1,300 / 1,450 / 1,200 / 1,450 /
1,700 / 1,600 £k for ABC, ACB, BAC, BCA, CAB, CBA).
