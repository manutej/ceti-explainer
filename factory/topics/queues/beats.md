# queues · beat sheet (75 s: 72 s of material + 3 s brand card)

Stage 960 × 540 design units. Every digit below is a claim id in `claims.json` (in brackets).
Must-read faces ≥ 28 units, labels ≥ 14, chrome ≤ 12 carries no result. Ink on paper; one accent colour,
used only for the viewer's guess. Mono face for every number.

## Timing

| beat | t (s) | structure on stage |
|---|---|---|
| HOOK | 0.0 – 8.0 | S1 hour strip |
| COMMIT | 8.0 – 16.0 | S1 hour strips + S2 commit box (live page holds 8 s at 15.8) |
| CASE | 16.0 – 36.0 | S3 bed grid |
| COUNT | 36.0 – 62.0 | S4 two desks, 100 columns each |
| MONDAY | 62.0 – 72.0 | S4 held, dimmed, with one line of type |
| brand card | 72.0 – 75.0 | plain card: "CETI" wordmark line + takeaway |

## The four structures
1. **S1 · Hour strip.** A day as 10 blocks (64 × 40, gap 6), one row. Inked block = a busy hour.
2. **S2 · Commit box.** Number field "__ job-lengths", 8 s countdown ring, sealed state.
3. **S3 · Bed grid.** 10 × 10 squares (24 × 24, pitch 30); a filled square is an occupied bed.
4. **S4 · Two desks and their columns.** Each desk: a slot holding the live jobs-in-system stack, then a
   field of 100 columns, one per arrival, each a stack of marks = jobs found ahead.

## Captions (14; all ≤ 60 characters; 28 units, bottom band y 470–530)

| # | in | out | text | claims |
|---|---|---|---|---|
| 1 | 0.6 | 3.9 | Your team is 90 % busy. Nobody sits idle. | hook-busy |
| 2 | 4.1 | 7.8 | Everyone fully used, so we are efficient. Right? | |
| 3 | 8.3 | 11.8 | At 50 % busy, a new job waits about one job's length. | anchor-50, anchor-wait-50 |
| 4 | 12.0 | 15.8 | At 90 % busy, how many job-lengths? Pick a number. | hook-busy |
| 5 | 16.4 | 21.8 | 1999, BMJ: a model of an English hospital's beds. | case-year |
| 6 | 22.0 | 27.8 | Above 85 of 100 beds full, the risk of no bed appears. | case-85, case-beds |
| 7 | 28.0 | 31.8 | At 90 of 100: regular shortages, periodic crises. | case-90 |
| 8 | 32.0 | 35.8 | Oct to Dec 2022, England's hospitals ran 92 of 100. | case-2022, case-92 |
| 9 | 36.4 | 47.8 | Same 100 arrivals, two desks. Each mark: one job ahead. | count-jobs |
| 10 | 48.2 | 52.8 | Half-busy desk: 100 arrivals found 99 jobs ahead. | count-a-total |
| 11 | 53.0 | 56.8 | Nine-tenths busy: the same 100 found 837 ahead. | count-b-total |
| 12 | 57.0 | 61.8 | 837 ÷ 100 is 8.4 a job. The long run says 9. | count-b-total, count-b-each, long-run-90 |
| 13 | 62.4 | 67.8 | Monday: which step runs above 85 % busy? What waits? | monday-85 |
| 14 | 68.0 | 71.8 | Limit: one desk, random work. Steadier work waits less. | |

Brand card (72.0–75.0): "CETI" wordmark line; takeaway "Busy is not efficient: at 90 % busy, a job waits
nine." [long-run-90, hook-busy]

## Commit
- Prompt (on the box, 28 units): "At 90 % busy, how many job-lengths does a new job wait?"
  Anchor line above it (20 units): "At 50 % busy: about 1" [anchor-50, anchor-wait-50].
- Input: a whole or decimal number 0 to 100. Live page: pause at 15.8, hold 8 s, then "no answer".
- Film mode default: **2** (film.json `defaultGuess`, claim commit-default): the linear intuition (90/50 ≈ 2).
- Nothing about 4, 8.4, 9 or 19 appears before 53.0.

## Frame by frame

### HOOK 0.0–8.0 (S1)
- 0.0: paper. Eyebrow chrome top-left (12 units): "UTILISATION AND WAITING".
- 0.4–2.2: one hour strip centred (x 133–827, y 230–270) inks its blocks left to right, 0.2 s each, 9 of 10
  [hook-hours]; block 10 stays an outline. Above it (28 units): "YOUR TEAM".
- 2.4: right of the strip, mono 40: "90 % BUSY" [hook-busy].
- 4.5: below the strip (28 units): "FULLY USED = EFFICIENT?"

### COMMIT 8.0–16.0 (S1 + S2)
- 8.0–8.8: the 90 % strip slides down to y 300–340; a second strip appears at y 180–220 inking 5 of 10
  [anchor-50-hours], label "50 % BUSY" [anchor-50, hook-day]. "FULLY USED = EFFICIENT?" fades.
- 9.0: right of the 50 % strip (28 units): "WAITS ≈ 1 JOB" [anchor-wait-50].
- 12.0: right of the 90 % strip: "WAITS ? JOBS"; S2 commit box opens under it (x 300–660, y 370–450).
- Live page: at 15.8 pause, 8 s countdown ring, then resume. Film mode: the countdown ring runs 12.4–15.4;
  at 15.4 the field shows "2" and the box stamps "YOUR GUESS 2 · SEALED" [commit-default].

### CASE 16.0–36.0 (S3)
- 16.0–16.4: S1/S2 clear. Eyebrow chrome: "BAGUST, PLACE & POSNETT · BMJ 1999".
- 16.4–18.4: bed grid draws as outlines, row by row (0.2 s a row), at x 120–414, y 90–384 [case-beds].
- 22.0–23.5: 85 squares fill in reading order (one each 0.0176 s). Readout right (x 500): mono 64 "85",
  then 28 units "OF 100 BEDS FULL", 20 units "THE RISK OF NO BED APPEARS" [case-85].
- 28.0–28.5: 5 more fill (beds 86–90). Readout becomes "90" / "OF 100 BEDS FULL" / "REGULAR SHORTAGES ·
  PERIODIC CRISES" [case-90].
- 32.0–32.3: 2 more fill (91–92). Eyebrow changes to "NHS ENGLAND · OCT–DEC 2022". Readout "92" /
  "OF 100 BEDS FULL" / "ENGLAND, ALL HOSPITALS" [case-92, case-2022]; the eyebrow date is case-2022. 8 outlines remain.

### COUNT 36.0–62.0 (S4)
Geometry: desk label x 40; desk slot x 150–190 (mark 30 × 7, pitch 8.5); field x 220–830, 100 columns
at pitch 6.1 (column i at x = 220 + 6.1 i, mark 4.9 × 7, vertical pitch 8.5); right gutter x 840–950 for
axis ticks. Desk A baseline y 200; desk B baseline y 440. Same vertical scale for both desks (true scale).
Desk labels (28 units "DESK A" / "DESK B", 20 units "BUSY 5 IN 10" / "BUSY 9 IN 10").
Counters sit top-left of each field (desk A x 230 y 112–150; desk B x 230 y 252–300): 14-unit label
"JOBS FOUND AHEAD", value mono 40. These areas are clear of marks (desk A columns top out at y 166; desk B
columns 0–39 top out at y 389).

Data (recompute in film.js; it is the claims' formula):

    mulberry32(seed = 3); for k in 0..2099: ea = -ln(1-r()), es = -ln(1-r()) (in that order)
    A_k += ea / rho  (rho 0.5 for desk A, 0.9 for desk B, same stream for both)
    start_k = max(A_k, D_{k-1}); D_k = start_k + es
    displayed jobs i = k - 2000, i in 0..99; ahead_i = #{ j < k : D_j > A_k }
    film time of arrival  tau(x) = 38 + 10 (x - A_2000) / (A_2099 - A_2000)   (identical for both desks)
    departures map through the same tau, per desk

Expected (gate these): desk A ahead = [0,0,1,0,0,1,2,3,3,3,4,3,0,0,0,0,0,1,2,0,0,1,0,0,1,2,1,1,1,2,3,3,3,0,
1,2,2,0,1,2,2,0,1,2,3,0,0,1,1,0,0,1,1,0,0,0,0,0,1,2,3,4,2,2,0,0,1,2,1,0,0,1,0,1,0,1,2,1,1,2,1,0,0,0,1,1,0,0,
1,2,1,0,1,2,1,0,0,0,0,0], sum 99, max 4, zeros 42. Desk B ahead = [2,1,2,2,0,1,2,3,4,5,6,5,4,5,6,4,2,3,4,3,0,
1,0,0,1,2,3,3,4,5,6,6,5,5,5,6,6,4,5,6,7,6,7,8,9,8,9,10,11,8,8,7,8,5,5,5,6,7,8,8,9,10,10,9,8,9,10,11,11,12,13,
14,15,16,17,18,19,16,15,16,17,16,16,15,16,15,12,13,13,14,15,15,16,16,15,13,13,13,14,15], sum 837, max 19,
zeros 4. Desk A starts empty (0 in system at 38.0), desk B starts with 2; at 48.0 desk A holds 1, desk B 16.
First arrivals at tau 38.00, 38.14, 38.14, 38.27, 38.46 …; last at 48.00. In film time desk B's jobs last
1.8 times as long as desk A's (span 102.16 vs 183.89 model units), which is what "busy 9 in 10" looks like.

- 36.0–38.0: desks, labels, empty fields, baselines and the gutter axis rule fade in. Desk B's slot shows
  its 2 jobs already present. Counters read 0 [count-running].
- 38.0–48.0: arrivals. At tau_i, column i drops its ahead_i marks bottom-up (0.02 s per mark, at most
  0.3 s); a hairline playhead sits on the newest column of both fields. Each desk slot shows n(t) =
  jobs with tau(A) ≤ t < tau(D) as stacked marks from its baseline: the bottom mark solid (in service),
  the rest ruled (waiting). Counters show the running sum of ahead over arrived columns (this is the count;
  no ratio yet).
- 48.0: arrivals stop; slots freeze (A: 1, B: 16). Counters final: 99 [count-a-total], 837 [count-b-total].
- 48.2–52.8: desk A counter at full ink, desk B at 60 % (caption 10). 53.0–56.8: swap (caption 11).
- 53.0: division readouts replace the counter labels: desk A "99 ÷ 100 ≈ 1 A JOB" [count-a-total,
  count-jobs, count-a-each]; desk B "837 ÷ 100 = 8.4 A JOB" [count-b-total, count-b-each], both 28 units.
  Dotted rules across each field at the realised mean height (desk A 0.99 marks, y 191.6; desk B 8.37 marks,
  y 368.9), unlabelled.
- 57.0: the viewer's guess: an accent rule across desk B's field at height g marks (g = 2 → y 423); a
  second readout line under desk B's division, accent colour, 28 units: "YOUR GUESS 2" [commit-default].
  If g > 20, the rule sits at the field top with "↑" before the number; if no answer, "NO GUESS" and no rule.
  At 57.0 also a solid ink rule at height 9 (y 363.5) with gutter label mono 28 "9" and 14-unit
  "LONG RUN" [long-run-90].
- 60.0–61.0: the ladder lights in the gutter, ticks on desk B's axis at heights 1, 4, 9, 19 (y 431.5, 406,
  363.5, 278.5), labels mono 20 "1 · 50 %", "4 · 80 %", "9 · 90 %", "19 · 95 %" [ladder-50, ladder-80,
  long-run-90, ladder-95, ladder-pcts]; "LONG RUN" folds into the "9 · 90 %" tick.

### MONDAY 62.0–72.0 (S4 held)
- 62.0–62.6: S4 dims to 35 % ink except the accent guess rule and the 9 rule.
- 62.4: one line of type top-centre, 36 units: "WHO RUNS ABOVE 85 % BUSY?" [monday-85].
- 68.0: caption 14 only; nothing new on stage.

### Brand card 72.0–75.0
- 72.0: the MONDAY frame holds 0.4 s, then a plain paper card: "CETI" wordmark line, then the takeaway
  (28 units): "Busy is not efficient: at 90 % busy, a job waits nine."

## Notes for the builder
- Pure renderer: everything above is a function of t and state.guess; the simulation is computed once at
  load from params (deterministic), never inside render with fresh randomness.
- Live page honest-limits panel: the seed rule, the 4.5 for perfectly regular jobs [limits-steady],
  and "one run at 90 % can land anywhere from about 1 to 40 a job"; try-it panel default 85 % → 5.7
  [limits-85-mult].
