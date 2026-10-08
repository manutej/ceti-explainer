# sample-size · beat sheet (75 s = 72 s material + 3 s brand card)

Stage 960 × 540 units. Ink material (exec). Faces: numbers in IBM Plex Mono 500; headlines Big Shoulders
Display 600; captions per kit. Every digit below is a claim id in claims.json (in brackets).
Colours: ink (yes marks, text), hollow ring (no marks), one accent (the viewer's marker and highlighted
dots), one muted grey (truth line, dimmed elements). No icons, no chart furniture beyond the axis.

## The four structures (whole film)
- **S1 · The respondents.** Customer marks: ink disc = yes, hollow ring = no. Appears as the **row of 30**
  (HOOK, COMMIT, COUNT) and as the **market grid of 1,000** (COUNT). Same glyph throughout.
- **S2 · The share rail.** One horizontal axis, x = 80 → 880 (800 units = 0 → 100 %, 8 units per point),
  baseline y = 430; a second row baseline y = 492 for n = 1,000. Ticks labelled either in counts
  (0, 10, 15, 20, 30 of 30 [axis.counts]) or percent (0, 25, 50, 75, 100 [axis.pct]); tick labels 20 u mono.
- **S3 · Ballots at true scale.** Three horizontal bars, x0 = 80, 800 units = 10,000,000 ballots
  (CASE only).
- **S4 · Brand card.** Black-on-paper "CETI" wordmark line and the takeaway (72–75 s).

## Beats and timings

| beat | t | structure(s) | what happens |
|------|---|--------------|--------------|
| HOOK | 0.0–8.0 | S1 row | 30 marks land one by one in survey-1 order; tally "18 of 30"; headline "60 %" |
| COMMIT | 8.0–16.0 | S1 row (dimmed) + commit box | prompt; 8 s hold on page / countdown in film mode with default 55 |
| CASE | 16.0–36.0 | S3 bars, S2 rail | 10,000,000 → 2,376,523 → 50,000 at true scale; Digest 43, Gallup 56, result 61 on the rail; ±0.06 vs 18 |
| COUNT | 36.0–62.0 | S1 grid + row, S2 rail | 1,000-mark market; 20 surveys of 30 stack on the rail; 20 of 1,000; the viewer's number vs 42 % |
| MONDAY | 62.0–72.0 | S2 rail + S1 row held at 20 % | the question; the honest-limits line |
| BRAND | 72.0–75.0 | S4 | CETI · "Noise shrinks with √n. Bias does not shrink at all." |

## Captions (14; each ≤ 60 characters; 28 units)

| # | t0 | t1 | text | chars |
|--:|---:|---:|------|------:|
| 1 | 0.4 | 4.0 | The survey says 60 % of customers want it. | 42 |
| 2 | 4.0 | 8.0 | Thirty customers answered. Eighteen said yes. | 45 |
| 3 | 8.2 | 15.8 | How low could the true share plausibly be? | 42 |
| 4 | 16.0 | 20.0 | 1936: a magazine mails 10 million ballots. | 42 |
| 5 | 20.0 | 24.0 | 2.4 million come back. Verdict: Landon, 57 %. | 45 |
| 6 | 24.0 | 28.0 | Gallup asks 50,000. Verdict: Roosevelt, 56 %. | 45 |
| 7 | 28.0 | 32.0 | Roosevelt wins 61 %. The 2.4 million missed by 18 points. | 57 |
| 8 | 32.0 | 36.0 | Not too few: the wrong people were asked, and answered. | 55 |
| 9 | 36.0 | 40.0 | A market split exactly 500 yes, 500 no. | 39 |
| 10 | 40.0 | 46.0 | Ask 30 of them. Then again. And again. | 38 |
| 11 | 46.0 | 51.0 | Same market: from 10 to 20 yes out of 30. | 41 |
| 12 | 51.0 | 56.0 | Ask 1,000: every survey lands within 3 points. | 46 |
| 13 | 56.0 | 62.0 | 18 of 30 could come from a market at just 42 %. | 47 |
| 14 | 62.0 | 72.0 | Ask: out of how many, and who didn't answer? | 44 |

Digits in captions: 60 [hook.pct]; Thirty/Eighteen [hook.n, hook.yes]; 1936 [case.year]; 10 million
[case.mailedM]; 2.4 [case.returnedM]; 57 [case.digestLandon]; 50,000 [case.gallupN]; 56 [case.gallupFDR];
61 [case.resultFDR]; 18 points [case.miss]; 500 [count.popYes, count.popNo]; 30 [hook.n]; 10, 20
[count.min30, count.max30]; 1,000 [count.popN]; 3 [count.within1000]; 18 of 30 [hook.yes]; 42 [count.low].

## Commit
- Prompt (on stage, 28 units, two lines): "30 customers answered; 60 % said yes." /
  "The true share could plausibly be as low as [ __ ] %"
- Live page: playback pauses at 8.0 s; input box (integer 0–100) and an 8-second countdown bar; on submit
  or timeout the box seals ("SEALED"; timeout reads "NO ANSWER") and playback resumes. Nothing numeric
  derived from the answer appears before 57.8 s.
- Film mode: the countdown runs 8.0 → 16.0; the default **55** [commit.default] types in at 11.0, seals at 15.0.
- state.guess = integer or null. Placement at 57.8 s uses state.guess (film: 55).

## Frame-by-frame

### HOOK 0.0–8.0
- 0.0: paper ground. Eyebrow (12 u, chrome) top-left at (40, 36): "THE SURVEY". No digits.
- Row geometry for HOOK/COMMIT: 30 slots, pitch 26 u, x_i = 103 + 26·i (i = 0…29, so 103 → 857),
  y = 300, mark radius 9 u. Order and yes/no of slot i = draw i of survey 1 (see "Generator").
- 0.4 + 0.08·i: mark i lands (scale 0 → 1, 0.15 s ease-out). 18 ink, 12 hollow, in draw order.
- 3.0: tally under the row, centred at (480, 350), 32 u mono: "18 of 30" [hook.yes, hook.n].
- 3.8: headline above the row, centred (480, 210), 96 u mono: "60 %" [hook.pct]; sub (20 u): "SAID YES".
- 8.0: hold.

### COMMIT 8.0–16.0
- 8.0–8.4: headline and tally fade to 30 %; row stays at 100 %.
- 8.4: commit box (480 × 120 u) centred at (480, 150): prompt text (28 u), input, countdown bar (4 u
  tall, full width of the box, shrinking over 8 s from 8.0 to 16.0).
- 15.0 (film) / on submit (page): stamp "SEALED" 20 u across the box.
- 15.6–16.0: box and row fade out.

### CASE 16.0–36.0
- Bars (S3), true scale 800 u = 10,000,000. Bar height 26 u. Labels right of the bar end or inside, 20 u mono.
  - 16.3–17.5: bar A grows 0 → 800 u at y = 96: "10,000,000 MAILED" [case.mailed].
  - 18.0–19.2: bar B grows 0 → 190.1 u (800 · 2,376,523 / 10,000,000) at y = 140: "2,376,523 RETURNED"
    [case.returned]; sub 20 u: "1 IN 4 CAME BACK" [case.oneIn4]. Bar A dims to 30 %.
  - 24.0–24.4: bar C appears at y = 184, **4.0 u long** (800 · 50,000 / 10,000,000; true scale, a sliver):
    "50,000 GALLUP" [case.gallupN]; sub 20 u: "48× FEWER BALLOTS" [case.ratio].
- Rail (S2) appears 20.4 (axis draws left → right 0.6 s), ticks 0, 25, 50, 75, 100 [axis.pct], axis title
  14 u: "ROOSEVELT'S SHARE". Marker = vertical stem 40 u tall above the baseline, 3 u wide, label above.
  - 21.2: DIGEST stem at x = 80 + 8·42.92 = 423.4: label "DIGEST 43" [case.digestFDR] 28 u; sub 20 u
    "LANDON 57" [case.digestLandon].
  - 25.2: GALLUP stem at x = 80 + 8·56 = 528: "GALLUP 56" [case.gallupFDR] 28 u.
  - 28.4: RESULT stem at x = 80 + 8·60.8 = 566.4, heavier (5 u): "RESULT 61" [case.resultFDR] 28 u.
  - 29.4–30.4: bracket under the baseline from 423.4 to 566.4 (y = 452), label centred 28 u:
    "18 POINTS OFF" [case.miss].
  - 31.0: at the DIGEST stem, a band ±0.06 points wide = **0.5 u** each side (true scale; it is thinner than
    the stem). Label 20 u to the left of the stem: "NOISE ±0.06" [case.moeDigest]; sub 14 u
    "THINNER THAN THIS LINE".
- 32.0–36.0: hold; caption 8 carries the why. 35.5–36.0: bars fade out; rail stays but its labels and stems
  fade to 0 (the rail is reused).

### COUNT 36.0–62.0
Layout: market grid top-left, survey row top-right, rail below.
- **Market grid (S1):** 40 columns × 25 rows, pitch 8 u, origin (44, 70) → spans x 44–356, y 70–262.
  Cell c (0…999): col = c % 40, row = floor(c / 40); yes if P[c] = 1 (the seeded population array).
  Mark radius 2.6 u (yes = ink disc; no = 1 u ring). Drawn on the canvas (mass), not SVG.
- **Survey row (S1):** 30 slots, pitch 17 u, x_i = 404 + 17·i (404 → 897), y = 120, radius 6 u.
  Tally at (650, 176), 32 u mono: "k of 30".
- **Rail (S2):** baseline y = 430 for n = 30 dots. Count mode first: ticks at k = 0, 10, 15, 20, 30
  [axis.counts] placed at x = 80 + 800·k/30; axis title 14 u "YES OUT OF 30". Truth line: dashed vertical
  at x = 480 (k = 15), y 300–440, muted, label 20 u "TRUTH 15 OF 30" [count.truthCount].
- Dots: radius 5 u; survey s with result k sits at x = 80 + 800·k/30, y = 430 − 6 − 11·m, where m = number
  of earlier surveys with the same k (stack upward). Max stack in this draw is 4 (k = 14).

Timeline:
- 36.0–36.5: rail ticks relabel to count mode.
- 36.5 + 0.04·row (row 0…24): grid rows fade in (36.5 → 37.5).
- 37.5: label under the grid, 28 u mono: "500 YES · 500 NO" [count.popYes, count.popNo]; 14 u above the grid:
  "1,000 CUSTOMERS" [count.popN].
- **Slow surveys s = 0, 1, 2:** T_s = 38.0 + 2.2·s (38.0, 40.2, 42.4).
  - pick i (0…29) at T_s + 0.04·i: grid cell idx_{s,i} gets an accent ring (radius 5 u) for 0.30 s; row slot i
    fills with that cell's glyph; tally updates "y_i of 30" where y_i = yes so far (count goes up live).
  - T_s + 1.3: tally holds the final "k of 30" (18, 11, 11 [count.surveys30]).
  - T_s + 1.5 → T_s + 1.9: a dot copies from the tally and drops (ease-out cubic) to its rail position.
  - T_s + 2.1: row clears (fade 0.1 s).
- **Fast surveys s = 3…19:** T_s = 44.6 + 0.3·(s − 3) (44.6 → 49.4). At T_s all 30 row slots fill at once and
  the 30 grid cells flash for 0.15 s; tally shows the final k; dot drops over 0.25 s. Values
  17, 18, 20, 10, 16, 17, 13, 14, 14, 13, 18, 15, 13, 15, 14, 14, 15.
- 49.8: row and tally fade; counter 20 u at the rail's right end: "20 SURVEYS" [count.nSurveys].
- 50.0: end brackets above the dot stacks at k = 10 and k = 20: "10 OF 30" [count.min30] and "20 OF 30"
  [count.max30], 20 u.
- 50.4: the four dots with k ≥ 18 get accent rings; label 20 u right of the k = 18 stack:
  "4 OF 20 SURVEYS: 18 OR MORE" [count.ge18].
- 51.0–51.6: rail relabels to percent (cross-fade): ticks 0, 25, 50, 75, 100 [axis.pct]; truth label becomes
  "TRUTH 50 %" [count.truthPct]; the bracket labels become "33 %" and "67 %" [count.min30pct,
  count.max30pct]. Band behind the dots from 32.1 % to 67.9 % (x 336.9 → 623.1), y 380–436, 12 % grey, label
  28 u above the band's right edge: "±18" [count.moe30].
- 51.6: grid fades to 25 %. Second rail row: thin baseline at y = 492 (same x scale), label 14 u at left
  "1,000 ASKED" [count.popN].
- 51.8 + 0.14·s (s = 0…19, ends 54.5): tick s drops onto row 2 at x = 80 + 800·v/1000, v from
  [count.surveys1000]; tick = 2 u × 18 u, ink.
- 54.7: label 20 u under row 2: "474 TO 527 OF 1,000" [count.min1000, count.max1000].
- 55.2: band 46.9 % → 53.1 % (x 455.2 → 504.8), y 482–500, label 28 u: "±3.1" [count.moe1000].
- 55.2: ledger, top-right (x 640, y 70 → 150), 20 u mono, rows appear 0.15 s apart:
  "30 · ±18" / "100 · ±10" / "1,000 · ±3.1" / "2,376,523 · ±0.06"
  [count.moe30, count.moe100, count.moe1000, case.moeDigest] with a 14 u header "ASKED · NOISE".
- **Placement 56.0–62.0:**
  - 56.0–56.5: grid, row 2, its band and the ledger fade out; n = 30 dots dim to 25 %.
  - 56.5: survey row returns to the HOOK's survey-1 marks (18 ink, 12 hollow) at the COUNT row position;
    tally "18 of 30" [hook.yes].
  - 56.6–57.6: bracket above the rail at y = 360 from x(42) = 416 to x(78) = 704 (Wald 42.5 % to 77.5 %,
    drawn at the rounded 42 and 78), label 20 u: "PLAUSIBLE: 42 % TO 78 %" [count.low, count.high].
  - 57.8: the viewer's marker: accent stem from y 300 to 436 at x = 80 + 8·guess, label 28 u above:
    "YOU 55 %" (film: [commit.default]; page: the sealed integer). If state.guess is null: no stem; a 20 u
    label at the left "NO ANSWER". If guess is outside 0–100, clamp the stem and print the typed value.
  - 58.6: stamp at x(42) = 416: "AS LOW AS 42 %" [count.low], 32 u, ink.
  - 59.4: the truth line at 50 % re-brightens; label 20 u: "BELOW HALF IS INSIDE".
  - 59.4–62.0: hold.

### MONDAY 62.0–72.0
- 62.0–62.6: everything except the rail, the 42 % stamp and the viewer's stem fades to 20 %.
- 62.6: the question, centred (480, 150), 40 u Big Shoulders: "Out of how many? And who didn't answer?"
- 66.0: honest-limits line, centred (480, 220), 28 u: "The ± covers chance only, not who chose to answer."
- 71.6–72.0: the last material frame holds (no further motion).

### BRAND 72.0–75.0
- Plain paper card: "CETI" wordmark line, then 28 u: "Noise shrinks with √n. Bias does not shrink at all."

## Generator (for the builder; identical to the formula in claims.json)
```js
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);
  t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}}
// population: P[c] = c < 500 ? 1 : 0, then Fisher–Yates (i from 999 down to 1, j = floor(r()*(i+1))) with mulberry32(36)
// surveys of n: one stream q = mulberry32(seed); for s in 0..19, for i in 0..n-1: idx = floor(q()*1000); yes += P[idx]
// n = 30 uses seed 10227 (keep idx_{s,i} for the grid flashes and the row order); n = 1,000 uses seed 14
```
Expected: n = 30 → 18,11,11,17,18,20,10,16,17,13,14,14,13,18,15,13,15,14,14,15;
n = 1,000 → 496,491,518,527,523,514,519,503,499,508,504,474,494,491,500,482,514,488,518,502.
Compute once at load (pure, deterministic); render(t) only indexes the arrays.
