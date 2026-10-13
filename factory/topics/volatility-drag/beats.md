# volatility-drag · beat sheet (75 s = 72 s material + 3 s brand card)

Stage 960 × 540 units. Every digit on stage is a claim id in claims.json (shown in [brackets]).
Faces: numbers and labels in IBM Plex Mono; headlines in Big Shoulders Display 600; captions in DM Sans.
Ink on paper; one accent (red pencil) reserved for the viewer's guess and the "under £1" bracket.
Chrome eyebrow at (48, 40), 12 units, no results in it: "VOLATILITY DRAG · <BEAT>".

## The four structures
1. **S1 · The bet bar** (HOOK, CASE). One £100 bar on a *linear* true scale, 2 units per £, baseline y 430.
   HOOK splits it into two outcome bars; CASE walks one player down it to a hairline.
2. **S2 · The commit box** (COMMIT). Question, £ input, countdown ring, SEALED stamp.
3. **S3 · The hundred** (COUNT). 100 player bars on a log £ axis with a rising expected-value line; then
   ranked, counted, and the viewer's rule laid across it.
4. **S4 · The Monday card** (MONDAY). One question, one honest-limits line, over the dimmed S3.
   (The CETI brand card is the format's closing card, not a film structure.)

## Timings

| beat | t | what |
|------|---|------|
| HOOK | 0.0–8.0 | S1: £100 bar, heads/tails outcomes, the £105 average; the exec's line |
| COMMIT | 8.0–16.0 | S2: the question; live page pauses at 10.0 and holds 8 s; film mode types £150 |
| CASE | 16.0–36.0 | S1: one player, win then loss = £90; ×0.9 per pair; 50 pairs → £0.52, a hairline |
| COUNT | 36.0–62.0 | S3: 100 players × 100 rounds; rank; count; typical; the viewer's rule; the two rates |
| MONDAY | 62.0–72.0 | S4: the question; the honest limit. Material's last frame holds at 71.8–72.0 |
| BRAND | 72.0–75.0 | plain card: "CETI" wordmark line; takeaway "The average is not your outcome." |

## Captions (14; each ≤ 60 characters; DM Sans 28 units at x 48, baseline y 506; fade 0.25 s)

| # | t0–t1 | text | claims |
|---|-------|------|--------|
| 1 | 0.4–3.9 | The bet: heads +50 %, tails −40 %. £100 on the table. | win_pct, loss_pct, stake |
| 2 | 3.9–7.8 | “It’s positive expected value. We should keep doing it.” | — |
| 3 | 8.2–11.9 | Play it 100 times. Everything stays in the pot. | rounds |
| 4 | 11.9–15.8 | What is left of £100 for the typical player? | stake |
| 5 | 16.2–20.4 | Win, then lose: £100, then £150, then £90. | stake, heads_value, pair_value |
| 6 | 20.4–25.4 | Each win-loss pair costs 10 %, in either order. | pair_loss |
| 7 | 25.4–31.0 | The typical run: 50 heads, 50 tails. × 0.9, fifty times. | typical_heads, pair_factor |
| 8 | 31.0–35.8 | £100 becomes 52p. At true scale, a hairline. | stake, typical_final |
| 9 | 36.2–41.0 | Now 100 players, £100 each, the same coin. | players, stake |
| 10 | 41.0–49.6 | The line is the expected value. The bars are the players. | — |
| 11 | 51.8–55.6 | 87 of 100 lost money. 55 have less than £1 left. | sim_lost, sim_under_1 |
| 12 | 55.6–61.8 | The middle player has 52p. The line says £13,150. | typical_final / sim_median, ev_final |
| 13 | 62.2–67.4 | Monday: what does one of us end with if we repeat it? | — |
| 14 | 67.4–71.8 | Limit: a coin game. Bet a fixed sum and the average holds. | — |

Captions are fixed text; nothing that depends on the viewer's guess goes in a caption.
At 28 units DM Sans the longest (57 chars) sets about 800 units wide; keep x 48 to 912.

## The commit
- Prompt (S2 headline, Big Shoulders 32): **WHAT'S LEFT OF £100?** Sub (Plex Mono 16):
  "+50 % OR −40 % A FLIP · 100 ROUNDS · ALL REINVESTED · THE TYPICAL PLAYER". Input "£ ____" at 56 units.
- Live page: at t = 10.0 the clock pauses; input box takes a £ amount (decimals allowed, e.g. 0.5); an 8 s
  bar empties; on Enter or timeout the guess is sealed ("no answer" if empty). Nothing from the answer
  (52p, 87, 55, £13,150) is on stage before 16.0.
- Film mode: default **£150** [default_guess] typed at 12.5 (2.5 chars/s); ring counts 5…1 [countdown]
  from 10.0 to 15.0; SEALED stamp lands at 15.0; box shrinks to a top-right chip "YOUR GUESS · SEALED"
  (no number) at 15.2–16.0. The sealed number re-appears only at 57.6 in COUNT.

## HOOK and CASE on S1 (linear, 2 units per £, baseline y 430)
- 0.0–1.2: £100 bar at x 200–280 grows to height 200 (top y 230). Label "£100" [stake] above, 28 mono.
- 1.2–3.2: from its top, two thin leader rules to two outcome bars at x 520–600 and 680–760:
  HEADS £150 [heads_value] height 300 (top 130), label "HEADS +50 %" [win_pct]; TAILS £60 [tails_value]
  height 120 (top 310), label "TAILS −40 %" [loss_pct]. Labels 28 mono above each bar.
- 3.4–5.0: dashed rule across both outcome bars at £105 (y 220): "AVERAGE £105 · +5 %" [avg_one_round, ev_rate], 28 mono.
- 5.0–8.0: hold; caption 2 carries the exec line.
- COMMIT: S1 dims to 25 % opacity behind S2.
- 16.0–16.6: S1 resets to the single £100 bar, now at x 160–260; ledger column at x 420, lines 28 mono, 44 apart, from y 150.
- 16.6–18.4: "HEADS ×1.5 → £150" [heads_factor, heads_value]; bar eases to 300.
- 18.4–20.2: "TAILS ×0.6 → £90" [tails_factor, pair_value]; bar eases to 180; a dashed ghost outline stays at
  £100 (top y 230); gap 230–250 labelled "−£10" [pair_loss].
- 20.4–23.6: swap demo, ledger line 3: "TAILS FIRST: £60 → £90" [tails_value, pair_value]: bar dips to 120 then
  rises to 180. Ledger line 4: "WIN + LOSS = ×0.9" [pair_factor].
- 25.4–25.6: ledger line 5: "50 HEADS · 50 TAILS" [typical_heads].
- 25.6–30.6: pair counter "PAIR n / 50" [pairs] at 0.1 s per pair; bar height 200 × 0.9^n; readout
  "£" + (100 × 0.9^n) to the penny [case_pair_value], 44 mono, right of the bar. Ease within each 0.1 s.
- 30.6–35.8: final: bar height 1.03 units (a hairline) beside the £100 ghost; label "£0.52 · TRUE SCALE"
  [typical_final] 44 Big Shoulders with leader to the hairline; source chip "PETERS 2019 · NATURE PHYSICS"
  [src_peters_2019] 14 mono bottom-right.

## THE COUNT on S3, precise enough to code from (36.0–62.0)

**Data.** `mulberry32(params.seed = 1)`; for round r = 1..100, for player q = 0..99: heads iff rnd() < 0.5.
Keep H[q][r] = heads so far. Stake w(q, r) = 100 × 1.5^H × 0.6^(r − H). Compute once at load (pure).
Rank at r = 100: sort players ascending by (w, q). Seed 1 ranks have heads from 39 (rank 1) to 65 (rank 100);
ranks 50 and 51 both have 50 heads (£0.5154).

**Geometry.** Slot x(i) = 120 + 7.7·i + 1.4·floor(i/10) for i = 0..99, bar width 5.4 (right edge 900.3;
the 1.4 gap every 10 bars makes tens countable). Log axis: y(w) = 430 − 40·(log10 w + 2), clamped to
[110, 430]: £1M → 110, £10,000 → 190, £100 → 270, £1 → 350, 1p → 430. Bars rise from the floor y 430 to y(w);
a stake under 1p draws as a 2-unit stub (y 428–430). Gridlines 0.6 units at the five levels, £100 at 1.2
units; labels right-aligned at x 108, 14 mono: "£1M" [axis_1m], "£10,000" [axis_10k], "£100" [stake],
"£1" [axis_1], "1p" [axis_1p]. Bars are p5 Canvas2D mass (ink, 0.9 alpha); everything typed is SVG.
Key y values: £13,150 → 185.2; £150 → 263.0; £0.52 → 361.5; top player £479,983 → 122.8.
Headline slot: Big Shoulders 32 at (48, 86). Round counter: Plex Mono 28, right-aligned at (912, 86).

**Frames.**
1. 36.0–36.6: S1 fades out; gridlines and axis labels fade in.
2. 36.4–37.2: 100 bars grow from the floor to £100 (y 270), staggered left to right (bar i starts at
   36.4 + 0.004·i, 0.4 s ease-out). Headline: "100 PLAYERS · £100 EACH" [players, stake].
3. 37.0–37.8: expected-value line appears at y 270: 1.6-unit ink rule from x 116 to 904, drawn left to right
   in 0.4 s. Label above its right end, right-aligned at x 900, y − 6, 16 mono on a paper backing:
   "EXPECTED £100".
4. 37.8–49.8: the rounds. ρ = (t − 37.8) / 0.12, r = floor(ρ), f = ρ − r. Each bar's log height is
   lerp(log w(q, r), log w(q, r+1), easeInOut(min(1, f / 0.7))). Counter "ROUND r / 100" [round_counter].
   Expected-value line at y(100 × 1.05^ρ) (continuous); label "EXPECTED £" + whole pounds of 100 × 1.05^r
   [ev_line], comma-grouped. Headline clears at 38.4. No other numbers move during the run.
   Reference frames (seed 1, for the probe): r 10: 59 bars below £100, EV £163; r 50: 74 below, 26 under £1,
   EV £1,147; r 100: 87 below, 55 under £1, 18 stubs, 2 bars above the line, EV £13,150.
5. 49.8–51.8: re-sort. Each bar slides from slot q to slot rank(q), ease-in-out 1.4 s, start staggered
   0.004 s by destination rank. Result: an ascending staircase, stubs on the left, one tall bar at far right.
6. 51.8–53.6: count the losers. Ranks 1..87 (all below the £100 gridline) turn from ink to graphite (0.35
   alpha) one at a time, left to right, 0.02 s apart. Headline counts up with them: "LOST MONEY  n OF 100",
   ending at 87 [sim_lost]. Ranks 88..100 stay ink.
7. 53.6–55.6: red-pencil bracket under the floor (y 440, ticks up to 434) from rank 1 to rank 55, label
   below it at y 462, 16 mono: "UNDER £1 · 55" [sim_under_1]. Optional: floor label "18 UNDER 1p" [sim_under_1p]
   at 14 mono above the stubs.
8. 55.6–57.6: the typical player. Ranks 50 and 51 get a 1.2-unit ink outline; a leader runs up-left to
   "TYPICAL PLAYER £0.52" [sim_median = typical_final], 28 mono at (150, 320). Expected-value label grows
   to 28 mono: "EXPECTED £13,150" [ev_final]. The headline slot clears; the two labels carry the frame.
9. 57.6–60.6: the viewer's rule. A red-pencil rule at y(guess) drawn left to right over 0.6 s from x 116 to
   904 (clamp to 110 / 430 with "↑" or "↓" when off-axis). Label at its left end above the line, 28 mono:
   "YOUR £150" [default_guess]. Bars with final stake ≥ guess get a red 1-unit outline. Headline:
   "n OF 100 GOT THERE" with n = #{w(q,100) ≥ guess}; film mode n = 12 [sim_reach_guess].
   Live page variants: guess ≤ £0.5154 → "YOU CALLED IT · n OF 100 GOT THERE"; no answer → no rule,
   headline "NO GUESS · THE LINE SAID £13,150". The guess digits are the viewer's own input, echoed.
   Optional at 59.6: "2 ABOVE THE LINE" [sim_above_ev] beside the two right-most bars.
10. 60.6–62.0: the rates, after every count: headline slot becomes two items, 28 mono:
   "AVERAGE +5 % A ROUND" [ev_rate] at x 48 and "TYPICAL −5.1 % A ROUND" [typical_rate] right-aligned at
   912. This is the held "where you sit" frame.

Purity: no Math.random/Date in render; the sim runs once at load from the seed. Hidden pooled elements get
style="" and text cleared. Re-seek to 45.0, 52.5 and 61.0 must give identical canvas and SVG.

## MONDAY on S4 (62.0–72.0)
- 62.0–62.6: S3 dims to 15 %; card panel (paper, 1-unit ink rule) x 96–864, y 120–400.
- Eyebrow "MONDAY" 14 mono. Question, Big Shoulders 36, two lines:
  "IF WE REPEAT THIS AND REINVEST EVERYTHING, / WHAT DOES ONE OF US END WITH?"
- 67.4: honest-limits line, DM Sans 28, two lines: "A coin game, not a market. Bet a fixed sum, or a
  fraction, and the result changes." Sources chip 14 mono: "PETERS 2019 · PETERS & GELL-MANN 2016".
- 71.8–72.0: hold.

## BRAND (72.0–75.0)
Plain paper card, no material. "CETI" wordmark line (Big Shoulders 48, centred, y 250); takeaway
DM Sans 28, centred, y 300: "The average is not your outcome." No digits.

## Try-it panel (page only)
Sliders: heads gain (+10 to +100 %), tails loss (−10 to −60 %), rounds (10 to 200), bet fraction
(25 %, 50 %, 100 %); readouts: expected value, typical (median) outcome, count of 100 seeded players who
lost money. All recomputed from the same formulas; it states the Kelly-style point (a quarter of the pot
makes the typical player grow about 0.6 % a round) only here, not on stage.
