# The Winner's Curse · beat sheet · `winners-curse`

Duration **75.0 s**: material 0 to 72.0 s, CETI brand card 72.0 to 75.0 s. Silent. Canvas 960 × 540
units. Every digit on screen maps to a claim id in `claims.json` (shown in [brackets]).

## The four structures
| # | structure | used in | what it is |
|---|---|---|---|
| S1 | **The bid sheet** | HOOK, MONDAY | A typeset tender ledger: ten sealed-bid rows "BIDDER A" to "BIDDER J", amounts blank, one row stamped WON. No numbers in HOOK. In MONDAY it comes back with two rows lit: OURS and SECOND. |
| S2 | **The commit box** | COMMIT | The premise in large mono, a `$ __ M` input (28-unit min), an 8 s countdown bar. Film mode shows the default [guess_default] typed in at 15.0 s. |
| S3 | **The ruler bars** | CASE | Horizontal bars on one true-scale ruler per sub-case. North Slope: two bars, $900M and $370M. Jar: a truth tick at $8.00 and two bars, $5.13 (average guess) and $10.01 (average winning bid). |
| S4 | **The auction rows** | COUNT | A $7M to $13M ruler, a $10M truth line, 40 rows × 10 ticks, the winner of each row in red, a right-hand counter column. The viewer's mark is placed on it. |

Brand card (72 to 75 s) is the format's fixed ending, not a structure.

## Beats and timings
| beat | t | structure | on screen |
|---|---|---|---|
| HOOK | 0.0–8.0 | S1 | Bid sheet draws row by row (0.2 to 2.4 s). WON stamp lands on row D at 3.0 s. Eyebrow "SEALED BIDS · ONE BLOCK". |
| COMMIT | 8.0–16.0 | S2 | Premise lines at 8.2 s: "BLOCK VALUE $10M [true_value]", "10 BIDDERS [n_bidders] · EACH OFF BY UP TO ±30 % [error_pct]", "HIGHEST GUESS WINS · PAYS ITS GUESS". The input box appears at 12.0 s. Live page: pause at 12.0 s, hold 8 s, then "no answer". Film: countdown 12.0 to 15.0 s, default [guess_default] typed at 15.0 s, box sealed at 15.6 s. Nothing derived from the answer is shown. |
| CASE | 16.0–36.0 | S3 | 16.0 to 28.8 s, North Slope: eyebrow "1969 [ns_year] · ALASKA NORTH SLOPE · LEASE SALE". Ruler $0 to $1,000M across x 80 to 880 (0.8 units per $1M). Bar "WINNING BIDS $900M [ns_win]" grows 20.2 to 21.4 s (length 720). Bar "NEXT-BEST BIDS, SAME TRACTS $370M [ns_second]" grows 22.0 to 23.0 s (length 296). Bracket over the gap "$530M [ns_gap]" at 23.6 s, sub-label "2.4× · 900 ÷ 370 [ns_ratio]" at 24.4 s. At 25.2 s the Gulf line (caption 6, no digits). 29.0 to 36.0 s, jar: eyebrow "CLASSROOM · 48 [jar_auctions] AUCTIONS · JARS OF COINS". Ruler $0 to $12 (60 units per $1). Truth tick at $8.00 [jar_value]. Bar "AVERAGE GUESS $5.13 [jar_est]" at 29.4 s. Bar "AVERAGE WINNING BID $10.01 [jar_winbid]" at 32.8 s. The red overhang past $8.00 is labelled "−$2.01 [jar_loss]" at 33.6 s. |
| COUNT | 36.0–62.0 | S4 | See frame-by-frame below. |
| MONDAY | 62.0–72.0 | S1 | Bid sheet returns (62.0 to 62.8 s), dimmed except row OURS (red) and row SECOND (ink). A typeset question in 28-unit mono: "WHAT WAS THE SECOND BID?" / "WHY WERE WE HIGHER?". At 67.8 s the honest-limits line sits as a 28-unit caption plus a 16-unit footnote "Sources: Capen, Clapp & Campbell 1971 · Thaler 1988 · Bazerman & Samuelson 1983". The last frame holds 71.8 to 72.0 s. |
| CARD | 72.0–75.0 | card | Plain paper: "CETI" wordmark line, then takeaway "Winning means you guessed highest, not right." (28 units). |

## Captions (14, each ≤ 60 characters)
| # | in | out | text |
|---|---|---|---|
| 1 | 0.5 | 7.6 | We won the deal. So we got a good price. Right? |
| 2 | 8.2 | 11.9 | A block worth $10M. 10 bidders, each off by up to ±30 %. |
| 3 | 12.0 | 15.8 | The highest guess wins and pays it. On average, how much? |
| 4 | 16.2 | 20.0 | 1969, Alaska North Slope: oil leases sold by sealed bid. |
| 5 | 20.2 | 25.0 | Winning bids: $900M. Next-best bids, same tracts: $370M. |
| 6 | 25.2 | 28.8 | Gulf of Mexico leases paid winners less than a credit union. |
| 7 | 29.0 | 32.4 | A classroom jar of coins worth $8.00. Average guess: $5.13. |
| 8 | 32.6 | 35.8 | Average winning bid: $10.01. The winner lost $2.01. |
| 9 | 38.0 | 43.8 | One auction: 10 honest guesses around the truth. 5 high. |
| 10 | 44.0 | 51.8 | 40 auctions. Mark each winner. Count the ones above $10M. |
| 11 | 52.0 | 55.8 | 198 of 400 guesses were high. 40 of 40 winners were. |
| 12 | 56.0 | 61.8 | The winner paid $12.4M on average for a $10M block. |
| 13 | 62.2 | 67.6 | Monday: what was the second bid, and why were we higher? |
| 14 | 67.8 | 71.8 | Limit: real bidders shade bids. These 10 bid their guess. |

Brand card line (not a caption): "Winning means you guessed highest, not right."

## The commit
- Prompt (S2 headline, 28+ units): **"10 bidders each estimate a block worth $10M, each off by up to
  ±30 %. The highest estimate wins and pays it. What does the winner pay, on average?"** Input: `$ __ M`,
  numeric, one decimal place allowed.
- Live page: holds 8 s at 12.0 s; if empty, "no answer" (the COUNT then shows no viewer mark and the
  label "NO GUESS" at the guess slot).
- Film mode default: **$10.5M** (`film.json defaultGuess = 10.5`, claim [guess_default]).

## COUNT frame by frame (36.0 to 62.0 s)
**Geometry (design units).** Value ruler `x(v) = 70 + (v − 7) × 110` for v in [7, 13], so x runs from 70
to 730 and the truth line sits at x(10) = 400. Stack rows `y(a) = 104 + a × 7.5` for a = 0 to 39 (row
centres 104 to 396.5). Axis line at y = 410; tick labels $7M to $13M [ruler_lo, ruler_hi] at y = 428
(16 units, chrome). Counter column at x 760 to 945. Caption band baseline y = 512 (28 units).
Viewer-mark label baseline y = 466 (28 units). Colours: ink for guesses, red for winners and the average
win, ink-black for the viewer's mark, truth line in ink at 1.5 units.

**Data.** `const r = mulberry32(1971); est[a][b] = 10 * (1 + 0.3 * (2 * r() - 1))`, drawn in auction-major
order (a = 0 to 39, b = 0 to 9). `win[a] = max(est[a])`. Precompute once at load, outside render.
Realised: row 0 = 7.24 12.12 7.10 9.83 12.98 11.65 12.17 7.78 11.96 7.90 (winner b = 4, $12.98).

| t (s) | what happens (all a pure function of t) |
|---|---|
| 36.0–37.2 | Axis line draws left to right (ease-out). Tick labels fade in at 0.1 s intervals. |
| 37.2–38.0 | Truth line rises from y 410 to y 92. Label "TRUE $10M" [true_value] at 28 units, anchored end at (394, 84). |
| 38.0–41.6 | **Auction 1, enlarged.** A single row at y = 250. Bidder b's tick (3 × 56 units, ink) drops from y 210 to 250 over 0.25 s starting at 38.4 + 0.32·b (the last lands at 41.53). Under each tick that lands right of the truth line, a small ink dot (r 3) shows it is high. Counter column: "HIGH" (14-unit eyebrow) over a 28-unit running count k that rises as high ticks land (final 5 [a1_above]); "of 10" [n_bidders] next to it. |
| 41.8–43.8 | The max tick (b = 4) turns red and thickens to 5 units. Label "$13.0M · WINS" [a1_win] at 28 units, anchored middle above the tick (clamped so it stays left of x 740). |
| 44.0–44.6 | Row 1 collapses into stack row 0: y 250 to 104, tick height 56 to 6, width 3 to 2 (winner 3). Labels fade out. |
| 44.6–51.8 | Rows a = 1 to 39 land: row a's ticks fade in over 0.15 s from t_a = 44.6 + 0.18·(a − 1) (the last at 51.44 to 51.59). Winner tick red, 3 × 7; others ink at 55 % opacity, 2 × 6. Counter column: eyebrow "WINNERS ABOVE $10M"; big count "k of k" at 28 units, where k = rows landed (rows always land above; k reaches 40 [winners_above] of 40 [n_auctions]). |
| 52.0–56.0 | Settle. At 52.0 the region x > 400 gets a 6 % ink wash. The counter column resolves to three lines, 28 units each, 0.6 s apart: "198 of 400" [marks_above, n_marks] with eyebrow "GUESSES HIGH"; "40 of 40" in red [winners_above, n_auctions] with eyebrow "WINNERS HIGH"; "$10.0M" [crowd_mean] with eyebrow "AVERAGE GUESS". |
| 56.0–57.2 | Average-win line: a red dashed vertical at x(12.364) = 660.0 (claim x_avgwin) drops from y 92 to y 410. Label "AVG WIN $12.4M" [mean_win] at 28 units, anchored start at (665, 84). This label and the truth label never overlap, because the truth label is anchored end at x 394. |
| 57.4–58.8 | **Viewer's mark.** An ink-black vertical at x(guess) from y 96 to y 418, 2.5 units, plus a short notch below the axis. Label "YOU $10.5M" [guess_default or the viewer's value] at 28 units, baseline y 466, anchored middle at x(guess) and clamped to [130, 690]. A guess outside 7 to 13 pins the mark to the ruler end with "‹" or "›" and keeps the true value in the label. No answer: the label reads "NO GUESS" at x 400 with no line. |
| 59.0–60.2 | Overpay bracket: a horizontal red bracket at y 100 from x 400 to x 660, then the label "+$2.4M a deal" [overpay] at 28 units centred above it (at y 70; the eyebrow band is clear by then). |
| 60.6–62.0 | Last item: "24 % over" [overpay_pct] at 28 units in the counter column under "$10.0M", with "2.4 ÷ 10" (16 units) beneath. Counts first: no percentage appears before 60.6 s. |

Hold note: the S4 state at 62.0 s is what MONDAY dims out of (0.8 s cross-fade into S1). Purity: when a
pooled element is hidden, clear its `style` and its text.

## Try-it panel (live page, optional for the builder)
The panel reruns S4 with a seed field and sliders for bidders (2 to 30) and error (±5 % to ±60 %). It
shows the realised average win next to theory `V·(1 + E·(N−1)/(N+1))` ([exp_win] $12.5M at defaults) and
"winner above truth in 1,023 of 1,024" ([p_above_num], [p_above_den]) as `2^N − 1 of 2^N`. The panel also
gives the lowest winning price in the run ([min_win] $10.9M at defaults).
