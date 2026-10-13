# streaks · brief

**Film id** `streaks` · **Working title** "Three bad months" · Exec room, ink material, 75 s case format.

## The exec question (one line)
Sales fell three months in a row; is something wrong, or is that what chance looks like?

## The belief to break
"A run means a cause." People expect randomness to alternate; when the same result repeats three, five,
seven times they read a trend, a hot hand, a broken process. In fact long runs are the *normal* texture of
pure noise: in 100 fair coin flips the longest run of one side is 7 or more more often than not.

## The one real case
Gilovich, Vallone & Tversky (1985), "The hot hand in basketball: On the misperception of random sequences",
*Cognitive Psychology* 17(3):295-314.
- Study 1, survey of 100 basketball fans (Cornell and Stanford students who play and watch): **91 %** believed
  a player has a better chance of making a shot after having just made his last two or three shots than after
  having just missed his last two or three shots.
- Same survey: for a hypothetical **50 %** shooter, the fans' mean estimates were **61 %** after a hit and
  **42 %** after a miss.
- Study 2, the **Philadelphia 76ers, 1980-81** field-goal records (nine players): no evidence of a positive
  correlation between the outcomes of successive shots. (Study 3 Celtics free throws and Study 4 Cornell
  controlled shooting: same conclusion.)
- Verification status: 91 %, 61 % / 42 % and the 76ers "no positive correlation" conclusion were confirmed via
  search summaries of the paper (direct PDF fetch is blocked by the container proxy). The N = 100 fans is from the
  paper's Study 1 as widely cited; check the printed page before shipping. The often-quoted pooled 76ers row
  (.46 after three hits, .56 after three misses) could NOT be verified online, so **it is not used on screen**.

The honest limit, as the film must state it: Miller & Sanjurjo (2018), *Econometrica* 86(6):2019-2047, show the
1985 test carries a streak-selection bias: in a finite record, the share of hits right after a streak of hits is
expected to be *below* the base rate even when shots are independent. Recomputed here: in 100 fair flips the
expected share of heads right after three heads is **0.46**, not 0.50 (1,000,000 seeded trials; expected gap
P(H|HHH) - P(H|TTT) = -0.079). Corrected, their re-analysis finds evidence *for* a modest hot hand. So the film
never says "the hot hand is a myth". It claims only: **people see streaks in pure noise, and pure noise makes
long streaks.**

## The count structure
- **What is counted:** coin flips drawn as monthly up/down ticks (up = heads = sales up; down = tails = sales
  down). 100 marks per row. In each row the **longest run of the same result** is boxed and its length set in
  the right column.
- **How many marks:** 10 rows of 100 = 1,000 marks drawn individually; then those 10 rows plus 990 more
  sequences (1,000 sequences in all, one tally mark each) stacked by their longest run, columns 4 to 13+.
  All from one seeded stream: mulberry32(1985), flip = r() < 0.5 ? up : down, sequence after sequence.
- **Realised values (all in claims.json, recomputed by formula):** row longest runs 8, 6, 4, 8, 6, 7, 10, 5, 7, 8;
  tally 4: 33 · 5: 158 · 6: 263 · 7: 244 · 8: 150 · 9: 82 · 10: 33 · 11: 23 · 12: 8 · 13+: 6 (sum 1,000).
  7 or more: **546 of 1,000**; 4 or less: **33 of 1,000**.
- **The viewer's committed number** ("the longest run of the same result in 100 flips"; film default **4**) is
  placed on the tally as a red rule after its column: rows at or below it vs rows beyond it (default: 33 | 967),
  and on the 10 rows ("9 of 10 rows beat your 4").
- **Only after the counts:** the exact odds over every possible 100-flip sequence: **54 %** for a run of 7+,
  **97 %** for a run of 5+.

### Numbers, verified twice
| quantity | exact (Markov recursion, JS) | exact (Fraction DP, Python) | 100,000-trial sim, mulberry32 seed 1 |
|---|---|---|---|
| P(longest >= 7) | 0.54234 | 0.54234 | 0.54372 |
| P(longest >= 5) | 0.97169 | 0.97169 | 0.97240 |
| P(longest <= 4) | 0.02831 | 0.02831 | 0.02760 |
| E[longest] | 6.977 | 6.977 | 6.981 |

Correction to the assignment note: the expected longest run is **6.98**, not 6.6. log2(100) = 6.64 is the
rule-of-thumb *scale* (the longest run of heads alone averages 5.99; the either-side run is about one longer).
Median and typical value: 7. The film shows neither number on stage; the try-it panel may.

Hook link (MONDAY): if each of 12 months is an independent fair up/down, P(some run of 3+ downs) =
1 - 1705/4096 = **0.584**, shown as "58 of 100 years". (24 months: 0.848; 36 months: 0.944.)
The hook strip itself is the first 12 flips of mulberry32(140): `U U U D U D U U U D D D`; it ends in three
falls and also opens with three rises nobody flagged. Disclosed as coin flips in MONDAY.

## The Monday question
"Before we act on this streak: would a coin flip have made it too?" (Concretely: how often does a run this long
show up in this many periods of pure noise? For three falling months in a year: 58 years in 100.)

## Honest-limits line
"Chance makes streaks; that does not prove a hot hand is a myth. A 2018 re-test found a bias in the 1985 method."
Caption form (≤ 60): "Limit: chance makes streaks. A hot hand may still exist."
Also on the page: real sales months are not coin flips (trend, seasonality, autocorrelation); the coin is the
null model to compare against, not a claim that your business is random. The 12-month strip was chosen from
seeded coin flips to end on three falls (disclosed).

## Sources (full citations)
1. Gilovich, T., Vallone, R., & Tversky, A. (1985). The hot hand in basketball: On the misperception of random
   sequences. *Cognitive Psychology*, 17(3), 295-314. doi:10.1016/0010-0285(85)90010-6
2. Miller, J. B., & Sanjurjo, A. (2018). Surprised by the hot hand fallacy? A truth in the law of small numbers.
   *Econometrica*, 86(6), 2019-2047. doi:10.3982/ECTA14943
3. Schilling, M. F. (1990). The longest run of heads. *The College Mathematics Journal*, 21(3), 196-207.
   doi:10.2307/2686886
4. Tversky, A., & Kahneman, D. (1971). Belief in the law of small numbers. *Psychological Bulletin*, 76(2),
   105-110. doi:10.1037/h0031322
5. This film's computation: exact recursion over all 2^100 sequences, and the seeded simulation
   (mulberry32 seeds 1985 for the film, 1 for the 100,000-trial check, 140 for the hook strip, 2018 for the
   Miller-Sanjurjo check); the formulas live in claims.json.

## What this film is NOT
- Not "the hot hand is a myth". The 2018 correction stands; the film only shows that streaks occur in noise.
- Not a forecasting method, a control-chart tutorial or a significance test.
- Not about base rates, the planning fallacy or the agent loop (done elsewhere).
- Not "your sales are random": the coin is the comparison, not the diagnosis.
- Not the gambler's fallacy (expecting a reversal); it is the mirror: reading a run as a cause.
- No basketball imagery, no players, no logos, no icons; numbers in a mono face on paper.
