# Correlated risk · beat sheet ("Ten Bets, One Bet")

75 s total: material 0 to 72 s, CETI brand card 72 to 75 s. Silent; captions carry it. Stage 960 × 540
units. Ink material (Q6): paper ground, ink #1b1b1b, one red #b3261e for failure, red band at 14 % alpha.
Faces: Big Shoulders Display 600 (headlines), IBM Plex Mono 500 (every number), DM Sans (captions, labels;
captions are proportional so 60 characters fit at 28 units). Every digit on screen is a claims.json id,
named in brackets below.

## The four structures
1. **S1 Supplier row**: ten unfilled marks, 56 × 36, in one row (HOOK, COMMIT). It becomes year 1 of S3.
2. **S2 Tranche ladder**: two mortgage marks feeding a two-slice pool, with readouts (CASE).
3. **S3 The 100-year grid**: 100 rows × 10 marks, red = failed; bands on years with 5+ (COUNT).
4. **S4 The bad-years scale**: 0 to 10 bad years per 100; counted stacks, the YOU marker, formula rules
   (COUNT end; held under MONDAY as the material's last frame).
The brand card (Q8) is not a structure.

## Beats and timings
| beat | t (s) | what happens |
|---|---|---|
| HOOK | 0.0–8.0 | S1 draws in; "WE'RE DIVERSIFIED ACROSS 10 SUPPLIERS"; "EACH 10 % LIKELY TO FAIL THIS YEAR" |
| COMMIT | 8.0–16.0 | prompt + input box + 8 s countdown; page holds at 8.0; film types default 1 at 13.0 |
| CASE | 16.0–36.0 | S2: two mortgages at 10 %, senior slice 1 in 100, tie → 10 in 100, ledger 83 % |
| COUNT | 36.0–62.0 | S1 → year 1; S3 fills; counters at ρ 0 / 0.3 / 0.6; S4: stacks, YOU, rules, % and 42× |
| MONDAY | 62.0–72.0 | Monday question over held S4; honest-limits caption |
| BRAND | 72.0–75.0 | plain CETI card with the takeaway |

## The commit
- Prompt (two lines, Plex Mono 28): **"OUT OF 100 YEARS, IN HOW MANY / DO 5 OR MORE OF THE 10 FAIL?"**
  [commit-years, commit-k, hook-n]. Above it the row and "EACH 10 % LIKELY TO FAIL THIS YEAR" [hook-p] stay.
- Input: integer 0 to 100, box 160 × 60 at (400, 300), value in Plex Mono 40.
- Live page: pause at t = 8.0, focus the box, countdown 8 → 1 [commit-hold]; Enter or timeout resumes;
  timeout writes "NO NUMBER" (DM Sans 28). Nothing numeric derived from the answer before 56.5 s.
- Film mode: countdown digit = 8 − floor(t − 8) for t in [8, 16) at (600, 340), Plex 28; default guess
  **1** [commit-default] (film.json `defaultGuess: 1`) types in at 13.0; at 15.2 the box locks
  (ink underline, label "HELD", DM Sans 16).

## Captions (14; each ≤ 60 characters; DM Sans 28, centred, box y 478–520)
| # | in | out | text | chars |
|---|---|---|---|---|
| 1 | 0.4 | 4.0 | "We're diversified: ten suppliers, not one." | 44 |
| 2 | 4.2 | 7.8 | Each has a 10 % chance of failing this year. | 44 |
| 3 | 8.2 | 12.0 | Out of 100 years, how many see 5 or more fail? | 46 |
| 4 | 12.2 | 15.8 | Hold your number. The count will place it. | 42 |
| 5 | 16.3 | 20.5 | The AAA recipe: pool two loans, each 10 % likely to fail. | 57 |
| 6 | 20.7 | 25.5 | The top slice fails only if both fail: 1 in 100. | 48 |
| 7 | 25.7 | 30.0 | Unless they fail together. Then it is 10 in 100. | 48 |
| 8 | 30.2 | 35.6 | Moody's 2006 triple-A mortgage bonds: 83 % downgraded. | 54 |
| 9 | 36.3 | 41.5 | Back to your ten. One row per year, 100 years. | 46 |
| 10 | 41.7 | 47.5 | No shared shock: 100 failures, scattered. Zero bad years. | 57 |
| 11 | 47.7 | 54.5 | Add one shared shock: about as many failures, in clumps. | 56 |
| 12 | 54.7 | 61.6 | Bad years per 100: 0.16 apart, 6.9 when they move together. | 59 |
| 13 | 62.3 | 67.0 | Monday: what one shock hits five of our ten at once? | 52 |
| 14 | 67.2 | 71.8 | Limits: these ρ are illustrative, not your suppliers'. | 54 |

Claims used: 2 hook-p; 3 commit-years, commit-k; 5 case-p; 6 case-senior-indep; 7 case-senior-corr;
8 case-year, case-83; 9 commit-years; 10 grid-fail-0 (100), grid-bad-0 ("Zero"); 12 truth-0, truth-06
(per 100 years; same values as the %). A "bad year" is a year in which 5 or more of the 10 fail.

## HOOK and COMMIT (0 to 16 s), S1
- 0.0–0.6: paper fades in. Eyebrow (chrome, DM Sans 12) "CASE · CORRELATED RISK" at (40, 40).
- 0.4–1.6: ten marks draw in left to right, stagger 0.12 s, 56 × 36, stroke 2 ink, unfilled,
  x = 128 + 72·j, y = 200 (j = 0..9; row spans 128 to 832).
- 0.6: headline Big Shoulders 40, centre (480, 140): "WE'RE DIVERSIFIED ACROSS 10 SUPPLIERS" [hook-n].
- 4.2: Plex Mono 28 centre (480, 280): "EACH 10 % LIKELY TO FAIL THIS YEAR" [hook-p].
- 8.0–8.3: headline fades; the two prompt lines write at y 96 and 136 (Plex 28, centred); box and
  countdown appear below the label (box (400, 300, 160, 60)).
- 16.0–16.8: S1 slides up 40 and fades to 0 (its geometry is kept for 36 s); the box shrinks to a tag
  "YOUR NUMBER · HELD" (DM Sans 14) at top right (900, 40, right-aligned) and stays there to 56.5 s.

## CASE (16 to 36 s), S2
- 16.3: eyebrow "CASE · 2006 · THE AAA RECIPE" [case-year]. Marks A at (200, 160) and B at (200, 260),
  56 × 36; labels "MORTGAGE A", "MORTGAGE B" (DM Sans 16) left of each, right-aligned at x 188;
  "10 %" (Plex 28) at x 270 beside each [case-p].
- 17.5–19.5: two ink lines (1.5) run from the right edges of A and B to a pool block at x 420:
  rect 160 × 160 (y 130–290) split into two slices of 80. Top slice: "SENIOR · RATED AAA" (DM Sans 16,
  inside); bottom: "JUNIOR".
- 20.7: senior readout at x 620: "FAILS ONLY IF BOTH FAIL" (DM Sans 16, y 150), "1 in 100" (Plex 40,
  y 190) [case-senior-indep]. Junior readout: "FAILS IF EITHER FAILS" (14, y 240), "19 in 100" (Plex 20,
  y 266) [case-junior-indep].
- 25.7–26.3: a 4-unit ink tie joins A and B at x 176 (vertical bracket y 160–296), label "FAIL TOGETHER"
  (DM Sans 16) left of it; A and B fill red together (one 0.4 s pulse, then stay red). The "1 in 100"
  gets a strike line (ink 2); "10 in 100" writes in red Plex 40 at y 236 [case-senior-corr]. The junior
  readout fades to 0 (its 19 is not true under the tie; clear its text and style when hidden).
- 30.2: hairline rule y 352 from x 120 to 840. Chrome above it: "RATED AS IF THEY FAIL APART"
  (DM Sans 14, (120, 344)). Ledger: "MOODY'S · 2006 · TRIPLE-A MORTGAGE SECURITIES" (DM Sans 16,
  (120, 392)); "83 %" red Plex 48 right-aligned at (760, 400) [case-83]; "LATER DOWNGRADED" (16, (770, 392)).
- 35.6–36.0: S2 fades out.

## COUNT (36 to 62 s), S3 then S4: frame-by-frame

### Data (computed once at init; pure, seeded)
- c = Φ⁻¹(0.1) = −1.2815515655446004 (or compute by bisection as the claims do).
- r = mulberry32(630) (the standard one in claims.json). Normal: `u1 = 1 − r(); u2 = r();
  z = sqrt(−2 ln u1) · cos(2π u2)` (one normal per two uniforms, cosine branch only).
- Draw order: for year i = 0..99: Z[i] = normal(); then for j = 0..9: E[i][j] = normal().
- fail(i, j, ρ) = √ρ·Z[i] + √(1−ρ)·E[i][j] < c. F(i, ρ) = Σj fail. Bad year: F ≥ 5.
- Check strings (F per year, i = 0..99), must match exactly:
  - ρ 0:   `0020101002001120121001220200201111220100220212100130012112110113000133012110122110020013410310021021` (sum 100, bad 0)
  - ρ 0.3: `0000000002000100001200020100200115220010200200200420012215110123040114002100112110140101310800040002` (sum 98, bad i = 33, 57, 91)
  - ρ 0.6: `0000000001000100000200020000100016120000100100400820003648110022050014001000100020140100010900050004` (sum 99, bad i = 33, 49, 55, 57, 65, 91, 95)

### Grid geometry
Block b = floor(i / 25), row r = i mod 25. Mark 15 × 9, pitch x 18, pitch y 12.4. Block width 177, gap 40,
x0 = 66, so block x = 66 + 217·b; mark x = 66 + 217·b + 18·j; row y = 128 + 12.4·r (last row ends 434.6).
Unfilled mark: stroke 1 ink, no fill. Failed: fill red, stroke red. Band for a bad year: rect
(blockX − 4, rowY − 2, 185, 13), red at 14 % alpha, plus a red tick 4 × 9 at blockX + 183.
Header: chrome "100 YEARS · 10 SUPPLIERS" (DM Sans 14, (66, 52)) [commit-years, hook-n]; ρ readout
"ρ 0" Plex 28 at (66, 96) with "NO SHARED SHOCK" DM Sans 16 after it; counters right: label "FAILURES"
(14, (600, 52)) value Plex 32 at (600, 96); label "YEARS WITH 5+ OF 10" (14, (760, 52)) value Plex 32 at
(760, 96) [commit-k, hook-n].

### Frames
- 36.0–37.4: S1's ten marks tween (ease-in-out) from (128 + 72j, 200, 56 × 36) to year 0's slots
  (66 + 18j, 128, 15 × 9). Year 0 has F = 0 at every ρ, so it stays unfilled throughout.
- 37.4: header and "ρ 0 · NO SHARED SHOCK" fade in (0.3 s).
- 37.4–41.4: years 1..99 appear in order: year i fades in over 0.15 s starting at 37.4 + 0.04·i, already
  showing its ρ 0 failures. No running counter (no unclaimed digits).
- 41.5: counters type in: FAILURES **100** [grid-fail-0]; YEARS WITH 5+ OF 10 **0** [grid-bad-0].
- 41.5–47.7: hold.
- 47.7–50.5: ρ(t) = 0.3 · smoothstep((t − 47.7)/2.8). Every frame re-thresholds all 1,000 marks from
  Z, E. Bands switch on live as F(i, ρ(t)) ≥ 5 (they may only be added: the count is monotone for this
  seed). Counter values show an en dash at 40 % ink (text "–"); ρ value shows "→"; no other digits.
- 50.5: ρ exactly 0.3. Counters: FAILURES **98** [grid-fail-03], BAD **3** [grid-bad-03]; readout
  "ρ 0.3" [rho-03] "SOME SHARED SHOCK". Bands on i = 33, 57, 91.
- 50.5–51.8: hold.
- 51.8–54.5: ρ(t) = 0.3 + 0.3 · smoothstep((t − 51.8)/2.7); same rules as above.
- 54.5: ρ exactly 0.6. FAILURES **99** [grid-fail-06], BAD **7** [grid-bad-06]; "ρ 0.6" [rho-06]
  "STRONG SHARED SHOCK". Bands on i = 33, 49, 55, 57, 65, 91, 95.
- 54.7–56.5 (S4 enters): unbanded grid rows and the header fade to 0 (clear style and text when hidden). Axis:
  hairline x 120 → 840 at y 400, x(u) = 120 + 72·u for u in [0, 10]; end labels "0" and "10" (Plex 14,
  y 416) [axis-max]; axis title "BAD YEARS PER 100 YEARS" (DM Sans 14, right-aligned at (840, 434),
  clear of the 6.9 label which spans ~590–645) [commit-years].
  The 7 banded rows (ρ 0.6 colouring) fly (ease-in-out, stagger 0.08 s) to a stack centred on x(7) = 624:
  scale 0.62 (row width 110), stacked upward from y 388 with pitch 9. A second stack of the 3 rows
  i = 33, 57, 91 coloured at ρ 0.3 fades in centred on x(3) = 336. At x(0) = 120 no stack.
  Above each stack its count in Plex 28 and, above that, its ρ in DM Sans 14: ρ 0.6 stack top y 325,
  "7" baseline 315, "ρ 0.6" baseline 292 [grid-bad-06, rho-06]; ρ 0.3 stack top y 361, "3" baseline 351,
  "ρ 0.3" 328 [grid-bad-03, rho-03]; at x(0): "0" baseline 386, "ρ 0" 363 [grid-bad-0, rho-0].
- 56.5–57.5 (YOU): the tag "YOUR NUMBER · HELD" flies down to the axis: ink triangle (14 wide, apex
  down) at (x(g), 392); "YOU" DM Sans 16 above it; g in Plex 28 above that [commit-default in film mode;
  the viewer's own number on the page]. g > 10: marker at x 840 with "→" after the value. No answer:
  no marker; "NO NUMBER HELD" (DM Sans 16) at (130, 372).
- 57.5–58.8 (formula rules): three red rules (1.5) below the axis, y 400 to 430, at x(0.1635) = 131.8,
  x(3.218) = 351.7, x(6.925) = 618.6, each with its value in red Plex 28 centred under it, baseline 462:
  "0.16", "3.2", "6.9" [truth-0, truth-03, truth-06]. Counted stacks above the axis, formula below it.
- 58.8: each label gains " %": "0.16 %", "3.2 %", "6.9 %" (same claims; counts were shown first).
- 59.5–61.0: an ink bracket from x 131.8 to 618.6 at y 268 (ends dropping 8 units) with "≈ 42×"
  (Plex 28) centred at (375, 256) [truth-ratio].
- 61.0–62.0: hold. This is the material's final frame; it holds under MONDAY.

Layout check: YOU at g = 1 sits at x 192 above the axis (triangle 392, "YOU" ~372, g ~346), clear of the
"0" count at x 120 (111–129) and of the ρ 0.3 stack (281–391). The "0.16 %" label (~82–182, baseline 462)
is below the axis, so it never meets the YOU marker; captions start at y 478. Axis end labels: "0" right-aligned at
(112, 416) and "10" left-aligned at (848, 416), so neither meets a rule label (baseline 462).

## MONDAY (62 to 72 s)
- 62.0–62.6: S4 dims to 25 %; a paper panel (760 × 150, paper at 94 % alpha) centred at (480, 190).
- 62.3: eyebrow "ASK ON MONDAY" (DM Sans 14, (480, 128)); question Big Shoulders 40, two lines centred
  at y 176 and 220: "WHAT ONE SHOCK WOULD HIT" / "FIVE OF OUR TEN AT ONCE?".
- 67.2: caption 14 carries the honest-limits line (28 units, must-read). The page's honest-limits block
  also says the case is CJS's stylised two-bond example and the 83 % has more than one cause.
- 71.8–72.0: hold.

## BRAND (72 to 75 s)
Hard cut to a plain card: paper; "CETI" Big Shoulders 64 centred at y 240; hairline 120 wide at y 268;
takeaway DM Sans 32 at y 316: **"Ten bets that fail together are one bet."** No digits. Holds to 75.0.

## Try-it panel (page only; suggestion for the builder)
A ρ slider with stops 0, 0.3, 0.6 re-thresholds the same 100-year draw and shows the claimed counts at
the stops only, plus the clean-year counts 37 and 65 [grid-zero-0, grid-zero-06] and the formula vs
seeded-MC cross-check (0.14 %, 3.41 %, 7.11 %) [mc-0, mc-03, mc-06]. Any other digit needs a claim.
