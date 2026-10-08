# Regression to the mean · beat sheet (75 s = 72 s material + 3 s brand card)

Stage 960 × 540 design units. Silent; captions carry it. Must-read text ≥ 28 units, other text ≥ 14,
chrome ≤ 12 carries no result. Ink material (exec, Q6): paper ground, one ink, one accent (red pencil),
numbers in IBM Plex Mono, heads in Big Shoulders Display 600. Digits on screen: only claim ids in [brackets].

## The four structures
- **S1 · Two columns** (HOOK, COUNT): two vertical columns on one shared score scale, left "before",
  right "after", one dashed average line across both; each unit is a short horizontal mark at its true
  score. Hook: 10 regions, no digits. Count: 100 pilots.
- **S2 · Commit box** (COMMIT): a centred card with the question, a one-number input, a countdown.
- **S3 · The flight log** (CASE): quote lines, then LANDING = SKILL + LUCK, then four horizontal
  skill+luck bars for two cadets on a shared scale with the average line.
- **S4 · Monday card** (MONDAY): one question, one honest-limits line, held as the last image.
- The CETI brand card (72 to 75 s) is the format's plain card, not a structure.

Shared scale for S1: `yOf(s) = 480 − (s − 20) × 5.5` (s = 83 → 133.5; 50 → 315; 26 → 447).
Columns: left cx = 270, right cx = 600. Right panel x 760 to 940.

## Timing

| beat | t (s) | structure | what happens |
|---|---|---|---|
| HOOK | 0.0–8.0 | S1 | 10 region marks, worst one lit, everything moves one quarter on, worst climbs |
| COMMIT | 8.0–16.0 | S2 | the question; page holds 8 s; film types default 3 at 13.0 |
| CASE | 16.0–36.0 | S3 | instructors' rule (16–25.4), skill + luck (25.4–30.4), two cadets' bars (30.4–36) |
| COUNT | 36.0–62.0 | S1 | 100 marks today, top 10 lit, tomorrow, tally 8, guess vs 8, bottom 10 = 8, half |
| MONDAY | 62.0–72.0 | S4 | the question; the limit line; last frame holds |
| BRAND | 72.0–75.0 | card | CETI wordmark line + takeaway |

## Captions (14; all ≤ 60 characters; bottom band y 490–530, 28 units)

| id | t0 | t1 | text | chars |
|---|---|---|---|---|
| c1 | 0.6 | 4.2 | Your worst region got a new manager. | 36 |
| c2 | 4.4 | 7.8 | Next quarter it climbed. So the manager worked? | 47 |
| c3 | 8.4 | 15.8 | Before the case, commit to a number. | 36 |
| c4 | 16.4 | 21.0 | Flight instructors: praise a great landing, next is worse. | 58 |
| c5 | 21.2 | 25.4 | Scream at a bad one, the next is better. So shouting works? | 59 |
| c6 | 25.6 | 30.4 | Kahneman: a landing is skill plus luck. Luck is redrawn. | 56 |
| c7 | 30.6 | 35.8 | Best: 83 = skill 65 + luck 18. Next day, luck −6: 59. | 53 |
| c8 | 36.4 | 40.8 | Today: 100 pilots, 100 landings. Top 10 marked. | 47 |
| c9 | 41.0 | 46.8 | Tomorrow: same pilots. No praise. No shouting. | 46 |
| c10 | 47.0 | 51.8 | 8 of the top 10 land worse. Nobody said a word. | 47 |
| c11 | 52.0 | 55.8 | You said 3. The count says 8. | 29 |
| c12 | 56.0 | 61.8 | Bottom 10: 8 of 10 land better. Both ends drift halfway. | 56 |
| c13 | 62.4 | 67.4 | Monday: what did the worst regions do with no fix? | 50 |
| c14 | 67.6 | 71.8 | Limit: the manager may help. One quarter can't show it. | 55 |

Digits: c7 [cadetA_today, cadetA_skill, cadetA_luck_today, cadetA_luck_tomorrow, cadetA_tomorrow];
c8 [n_pilots, top_k]; c9 none; c10 [top10_worse, top_k]; c11 [default_guess or live answer, top10_worse];
c12 [top_k, bottom10_better]. c11 on the live page: "You said {n}. The count says 8." or, with no answer,
"No answer. The count says 8." (28 chars).

## The commit
- Prompt (32 units, two lines): "Of today's 10 best landings," / "how many land worse tomorrow?"
- Sub (14 units): "100 pilots · nobody praises or shouts · 0 to 10"  [n_pilots, top_k]
- Input: one box 120 × 72, digit at 48 units mono, accepts 0–10. Countdown "8" → "1" at 28 units
  [commit_seconds]; at 0 shows "no answer".
- Live page: pauses at 8.0 and holds 8 s or until Enter. Film mode: `defaultGuess: 3` [default_guess]
  types into the box at 13.0, the box stamps COMMITTED (12-unit chrome) at 15.0, and at 15.6–16.0 the
  card shrinks into a chip "YOU · 3" (14 units) at top right (x 860, y 28), held until 62.0.
- Default 3 represents the "the best stay best" intuition (skill persists, nobody pushed them down).

## HOOK (0–8), S1 with regions, no digits
- 0.0–0.6: paper ground, dashed average line at y 315 from x 150 to 720 fades in; column heads at y 78,
  14 units: "LAST QUARTER" (cx 270) and "THIS QUARTER" (cx 600).
- 0.3–1.8: 10 region marks (60 × 4, ink) drop into the left column at yOf(last), staggered 0.12 s, in
  list order. Values (last → this): 71→63, 61→68, 56→44, 54→52, 51→56, 47→39, 46→59, 44→48, 40→36,
  **34→42** (the worst). They are pilots ranked 5th, 15th, …, 95th today in the sample, relabelled as
  regions (brief.md, the model); no number is shown.
- 1.8–2.6: the worst mark turns accent; a 14-unit label "WORST · NEW MANAGER" appears left of it,
  right-aligned at x 230.
- 3.8–6.0: all 10 marks travel to the right column at yOf(this) along straight lines (easeInOutCubic,
  stagger 0.05 s); the worst leaves a 1.5-unit accent trail; the other 9 leave nothing.
- 6.0–8.0: hold. The worst now sits 8th of 10 (two below it: 39, 36). A small accent up-tick appears
  at its right end. Fade all S1 to 25 % at 7.6–8.0 as S2 rises.

## CASE (16–36), S3 the flight log
- 16.0–16.4: eyebrow (12-unit chrome) top-left "THE CASE · FLIGHT SCHOOL · ISRAELI AIR FORCE".
- 16.4: line 1 (32 units, x 80, y 170): "Praise a smooth landing → the next one is worse."
- 21.2: line 2 (32 units, y 220): "Harsh words after a rough one → the next is better."
- 23.4: verdict (32 units, accent, y 290): "Verdict: punishment works."
- 16.4 on: source line (14 units, y 400): "Tversky & Kahneman, Science, 1974 · Kahneman, Thinking, Fast and
  Slow, 2011, ch. 17"  [tvk_year, tfs_year, tfs_chapter]
- 25.4–26.0: lines 1–2 fade to 30 %; the verdict gets a 2-unit accent strike-through drawn left to right.
- 26.0–30.4: centre (y 250) at 44 units: "LANDING = SKILL + LUCK"; under it at 28 units: "skill stays · luck
  is redrawn every flight".
- 30.4–30.6: the equation slides to y 120 at 28 units; quotes and verdict clear (empty text, style="").
- Bars (x0 = 200, 6 units per point; height 24): average line, dashed, vertical at x = 200 + 50 × 6 = 500
  from y 236 to 436, label "50 · AVERAGE" at y 228 (14 units) [mean_today].
  Row labels right-aligned at x 192, 14 units: "BEST · TODAY" (y 260), "NEXT DAY" (y 300),
  "WORST · TODAY" (y 370), "NEXT DAY" (y 410).
  - 30.6–31.6 best today: skill segment 0→65 solid ink, then luck +18 segment 65→83 accent;
    labels "65" in the skill segment, "+18" in the luck segment (20 units, paper on ink),
    end label "83" at 28 units right of the bar [cadetA_skill, cadetA_luck_today, cadetA_today].
  - 31.8–32.8 next day: skill 0→65, then luck −6 drawn as an accent hatched block from 59 to 65 that
    "bites back" (bar ends at 59); labels "65", "−6", end "59" [cadetA_luck_tomorrow, cadetA_tomorrow].
  - 33.0–34.0 worst today: skill 0→32, luck −6 bite 26→32; labels "32", "−6", end "26"
    [cadetZ_skill, cadetZ_luck_today, cadetZ_today].
  - 34.2–35.2 next day: skill 0→32, luck +5 segment 32→37; labels "32", "+5", end "37"
    [cadetZ_luck_tomorrow, cadetZ_tomorrow].
  - 35.2–36.0 hold: both "next day" ends sit closer to the average line than their "today" ends.

## COUNT (36–62), S1 with 100 pilots, frame by frame
Data: `params.skill`, `params.luck1`, `params.luck2` in claims.json; today T = skill + luck1, tomorrow
M = skill + luck2. Ranking by score descending, ties by pilot index ascending. top = first 10, bottom = last 10.
Mark: rect 18 × 3 centred at (cx + (k − (n − 1)/2) × 21, yOf(score)), where n is how many pilots share
that score in that column and k is this pilot's position among them by index (max n = 9, so a column
spans cx ± 84). Ink marks at 100 %; "dim" = 30 %.

1. **36.0–36.4** clear S3 (empty text, style=""). Column heads "TODAY" / "TOMORROW" (14 units, y 78);
   dashed average line y 315 from x 150 to 720; label "50 · AVERAGE" at x 44, y 311 (14 units) [mean_today].
2. **36.4–39.6** 100 marks drop into TODAY: arrival order = mulberry32(seed 36) Fisher-Yates of 0..99;
   pilot j-th in order starts at 36.4 + j × 0.028 s, falls 40 units with easeOutCubic over 0.35 s.
   Counter at right panel (x 760, y 120, 28 units mono): "0" → "100" = marks landed, with "LANDINGS" at
   14 units under it [n_pilots].
3. **39.6–40.8** top 10 (T ≥ 63) turn accent; all others dim. Right panel: counter fades; label
   "TOP 10 TODAY" (14 units, y 140) and a row of 10 empty boxes 16 × 16 at x 760 + j × 18, y 152 [top_k].
4. **41.0–42.2** the 90 dim marks slide together to TOMORROW (straight line, easeInOutCubic, 1.0 s,
   stagger 0.002 s by index). No lines drawn for them.
5. **42.4–47.0** the top 10 move one at a time in today-rank order: pilot of rank q (0..9) starts at
   42.4 + q × 0.45, travels 0.6 s, leaving a 1.5-unit accent line from its today position to its
   tomorrow position (lines stay). On landing, box q fills: solid accent if M < T ("worse"), outlined
   with a small up-tick if M > T ("better"). Order and outcome: 83→59 W, 78→64 W, 71→62 W, 71→73 B,
   71→63 W, 68→48 W, 65→49 W, 63→61 W, 63→66 B, 63→59 W. Running tally under the boxes (28 units,
   y 196): "WORSE n" increments 1..8 [top10_worse].
6. **47.0–51.8** headline in the right panel: "8" at 64 units mono (x 760, y 270, accent) and "of 10 land
   worse" at 28 units on two lines ("of 10" / "land worse", y 304 and y 336) [top10_worse, top_k].
   "2 better" at 14 units under it [top10_better].
7. **52.0–55.8** the guess rail: y 400, x 760 to 940 (11 ticks, step 18), end labels "0" and "10" at 14
   units. "YOU 3" (28 units, ink) with a down-triangle above the rail at x 760 + 3 × 18 = 814; "COUNT 8"
   (28 units, accent) with an up-triangle below at x 760 + 8 × 18 = 904, text right-aligned at 940.
   Live page: YOU uses the committed answer; "no answer" shows "YOU —" at the left end, dimmed.
   [default_guess, top10_worse]
8. **56.0–59.4** bottom 10 (T ≤ 38; rank 90 scores 39) turn a second ink (ink at 100 %, lines in ink, not accent) and draw
   lines from their TODAY marks to their TOMORROW marks, all together, 0.8 s, stagger 0.08 s by rank
   from the bottom. Right panel (guess rail stays): "BOTTOM 10" (14 units, y 440) and "8 land better"
   (28 units, y 472) [bottom10_better]. Note y 472 is above the caption band (490).
9. **59.4–62.0** halfway, after all counts: two thin vertical brackets with end caps: TODAY bracket at
   x 172 from y 315 to yOf(69.6) = 207.2; TOMORROW bracket at x 696 from y 315 to yOf(60.4) = 257.8; short
   accent horizontals across each column at those heights (the top-10 averages). Right panel clears
   (tally, rail, bottom label fade 0.3 s) and shows: "+20 → +10" at 40 units mono (y 250),
   "half the gap was luck" at 28 units (y 290), "model: r = 0.5, declared" at 14 units (y 316)
   [top10_gap_today, top10_gap_tomorrow, r_declared]. Hold to 62.0.

## MONDAY (62–72), S4
- 62.0–62.6: S1 clears; the "YOU · 3" chip goes. Eyebrow (12 units) "MONDAY".
- 62.4: question at 36 units, x 80, y 200 and 248: "The worst region improved." / "What did the other
  worst regions do with no new manager?" (wrap at 800 units).
- 67.6: honest-limits line at 28 units, y 340: "This does not say the manager failed." / "One quarter cannot
  tell." A 14-unit pointer under it: "sources and limits below the film" (live page only; omit in film mode).
- 71.8–72.0: last frame holds unchanged (Q8).

## BRAND (72–75)
Plain paper card. "CETI" wordmark line (Big Shoulders, 28 units, letterspaced) at y 230; takeaway at
32 units, y 290 and 330: "The extremes drift back on their own." / "Credit needs a comparison." No digits.

## Try-it panel (live page; numbers from claims, where = live page)
A slider for r (0.1 to 0.9, default 0.5) recomputes the model lines: top tenth +17.5 → expected +8.8
[model_top_decile_gap_today, model_top_decile_gap_tomorrow]; expected worse 8.4 of 10; expected still
top 10, 3.2 [model_expected_worse, model_expected_stay]; and shows the sample facts: 3 of 10 stayed top
10, bottom 10 average 33 → 42, sample r 0.49 [top10_stay, bottom10_avg_today, bottom10_avg_tomorrow,
r_sample]. The slider only changes the model lines, never the drawn sample. Galton line in the limits
block [galton_children, galton_couples, galton_slope, galton_year].
