# Volatility drag · the average is not your outcome  (film id `volatility-drag`)

## The exec question
"It's positive expected value, so we should keep doing it." Should we?

## The belief to break
A bet whose average outcome is positive will, if repeated with the winnings reinvested, make *us* richer.
For compounding (multiplicative) bets this is false: the average across many parallel players grows,
while the typical single player, playing over time, shrinks. The expected value is a fact about a crowd
of parallel worlds; the company lives in one world, one round after another (Peters 2019: the time
average and the ensemble average differ, so the system is non-ergodic).

## The one real case: Peters' coin game
The canonical, published worked example (Peters 2019; Peters & Gell-Mann 2016; Peters 2023 Fig. 2).

| what | number | how |
|------|-------:|-----|
| stake | £100 | |
| heads / tails | +50 % / −40 % | ×1.5 / ×0.6, fair coin |
| one round, average outcome | £105, +5 % | (150 + 60) / 2 |
| one win and one loss, either order | £90, −10 % per pair | 1.5 × 0.6 = 0.9 |
| typical run of 100 rounds | 50 heads, 50 tails | exact median of Binomial(100, ½): P(K≤49) = 0.460, P(K≤50) = 0.540 |
| typical player after 100 rounds | **£0.52 (52p)** | 100 × 0.9^50 = 0.5154 |
| typical growth per round | −5.13 % | √(1.5 × 0.6) − 1 = −0.05132 |
| expected value after 100 rounds | £13,150 (131.5×) | 100 × 1.05^100 = 13,150.13 |

**Correction to the topic note.** "After 100 rounds the average of 1,000 players is up ~130×" is not what a
realised group of 1,000 shows. 131.5× is the *expected value* (an infinite crowd). The 1.05^100 average is
carried by runs of about 71 heads or more (the expectation's mass peaks at 71 to 72 heads); P(K ≥ 71) is
1 in 62,000, so a group of 1,000 almost never contains one.
Simulated over 2,000 seeds (mulberry32, round-major), the realised mean of 1,000 players after 100 rounds
has a median of £2,430 (24×); only 9.2 % of seeds reach 131.5×. For 100 players the median realised mean
is £697. So the film labels the rising line **EXPECTED VALUE**, never "the average of these players".
(Peters' own point: a finite crowd tracks the expectation only for a while, then falls away from it.)

**The seeded simulation (declared; all realised numbers are claims).** 100 players, 100 rounds,
mulberry32(seed 1), draws in round-major order (for round 1..100, for player 0..99), heads iff rnd() < 0.5.
Seed 1 is the first seed; it was checked against seeds 7, 42 and 2019 and the exact binomial expectations,
and its counts sit near them: 87 of 100 lost money (expected 86.4), 55 under £1 (54.0), 12 reached £150
(9.7), 18 under 1p (18.4), 2 above the expected-value line (1.05); realised median £0.5154 equals the exact
typical outcome. Its own mean is £5,232, 92 % of which belongs to one player (65 heads, £479,983).
Re-verified independently in Python with exact fractions and a 32-bit reimplementation of mulberry32.

## The count
- **What is counted:** 100 players, one bar each, every bar starting at £100. Bar height is the
  player's stake on a log axis (1p to £1M, 40 units per decade, gridlines labelled), updated round by round
  for 100 rounds. A horizontal **expected-value line** rises with 100 × 1.05^r while most bars sink.
- **Then:** bars re-sort into rank order; the 87 below £100 are counted off one by one; the 55 under £1
  are bracketed; the middle two bars (ranks 50 and 51, both £0.52) are named the typical player.
- **The viewer's committed number** (film default £150) is drawn as a red-pencil rule across the 100 ranked
  bars: "12 of 100 got there", set against the typical 52p and the expected £13,150. Counts first; the
  only rates (+5 % / −5.1 % a round) appear after all counts.

## The commit
"A bet that gains 50 % or loses 40 % on a coin flip, played 100 times with everything reinvested: what is
left of £100 for the typical player?" Answer in £. Live page: 8 s hold, "no answer" after the timer.
Film mode default: **£150** (the cautious believer's "a bit more than I put in").

## The Monday question
"If we repeat this and reinvest everything, what does one of us end with, not the average of all of us?"

## Honest limits (one line on screen)
"A coin game, not a market: bet a fixed sum and the average holds." Further, for the page:
independent 50/50 flips with fixed payoffs are a thought experiment; the drag needs compounding (gains
reinvested); betting a fraction of the pot changes the result (here a quarter of the pot each round gives the
typical player about +0.6 % a round, the Kelly fraction); whether this overturns expected-utility economics
is disputed (Doctor, Wakker & Wang 2020).

## Sources
1. Peters, O. (2019). The ergodicity problem in economics. *Nature Physics* 15, 1216–1221.
   doi:10.1038/s41567-019-0732-0. (The coin game: ×1.5 / ×0.6, +5 % expected, about −5 % a round over time.)
2. Peters, O. & Gell-Mann, M. (2016). Evaluating gambles using dynamics. *Chaos* 26, 023103.
   doi:10.1063/1.4940236; arXiv:1405.0585. (Time averages versus expectation values; multiplicative dynamics.)
3. Peters, O. (2023). Insurance as an ergodicity problem. *Annals of Actuarial Science* 17, 215–218.
   doi:10.1017/S1748499523000131. (Fig. 2: 100 realisations of the same coin toss under the
   expected-wealth curve, the direct precedent for this count.)
4. Kelly, J. L. Jr. (1956). A new interpretation of information rate. *Bell System Technical Journal* 35(4),
   917–926. doi:10.1002/j.1538-7305.1956.tb03809.x. (Growth-optimal bet sizing; page only.)
5. Doctor, J. N., Wakker, P. P. & Wang, T. V. (2020). Economists' views on the ergodicity problem.
   *Nature Physics* 16, 1168. doi:10.1038/s41567-020-01106-x. (The counterpoint, for honest limits.)

Note: nature.com, arXiv and AIP were not reachable from this container; citations were confirmed through
search indexes, and the Chaos DOI is from the published record as indexed. The builder should not add
figure numbers for Peters 2019.

## What this film is NOT
- Not "the average of 1,000 players is up 130×" (false for a realised group; see the correction).
- Not investment advice, and not a claim that markets are coin flips or that volatility is always bad.
- Not a lesson in bet sizing or the Kelly criterion (one honest-limits clause only).
- Not a verdict on expected-utility theory or on ergodicity economics as a school.
- Not base rates, the planning fallacy or the AI agent loop; its fixture is the coin game alone.
- Not a hand-drawn coin, icon or dashboard: bars, rules and typeset numbers only.
