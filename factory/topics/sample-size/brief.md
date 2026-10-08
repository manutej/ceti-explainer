# sample-size · brief

**Exec question (one line).** "The survey says 60 % of customers want it." How much does that number actually tell me?

**The belief to break.** A percentage from a survey is a measurement of the market. Two wrong halves:
(a) with 30 responses the number is mostly noise: a market split exactly 50/50 hands you 60 % about one
survey in five; (b) piling on responses fixes noise but never fixes *who* answered: 2.4 million ballots
missed by 18 points.

**Two lessons, one sentence each.**
1. Noise shrinks with √n: the 95 % margin for a share near 50 % is 1.96·√(0.25/n) ≈ 1/√n:
   n = 30 → ±18 points, n = 100 → ±10, n = 1,000 → ±3.1, n = 2,376,523 → ±0.06.
2. Bias does not shrink at all: if the people who answer differ from the people you care about, the error
   is the same at 30 or at 2.4 million, and no formula on the page tells you its size.

## The one real case · the 1936 Literary Digest poll

| fact | number | source |
|------|-------:|--------|
| ballots mailed (car registrations, phone books, club lists, its own readers) | 10,000,000 | S3, S4 |
| ballots returned | 2,376,523 ("2.4 million", about 1 in 4 = 23.8 %) | S5, S3 |
| final tally | Landon 1,293,669; Roosevelt 972,897 | S5 (Literary Digest, 31 Oct 1936) |
| Digest verdict | Landon 57 % (57.1 % of Landon + Roosevelt ballots); Roosevelt 43 % | S5, S4 |
| Gallup's forecast, quota sample of about 50,000 | Roosevelt 56 % (55.7 % in Gallup's scorecard) | S4, S6 |
| Gallup's forecast *of the Digest's own result*, from about 3,000 | Roosevelt 44 % (Digest printed 43) | S4 (brief only) |
| result | Roosevelt 60.8 % of the popular vote ("61 %"); Landon 36.5 %; electoral votes 523 to 8 | S6 |
| the Digest's miss on Roosevelt | 60.8 − 42.9 = 17.9 → "18 points" | computed |
| the Digest's 95 % sampling margin at 2,376,523 | ±0.064 → "±0.06 points" | computed (S4 formula) |
| ballots per Gallup interview | 2,376,523 ÷ 50,000 = 47.5 → "48×" | computed |

Why it failed (Squire 1988, using a 1937 Gallup survey that asked people whether they had received and
returned a Digest ballot): **both** the list and the response were biased. The list leaned to people with
cars and telephones, but Roosevelt still carried even those; the larger damage was that Landon voters mailed
their ballots back more often than Roosevelt voters. Squire: with a full response from everyone sampled the
Digest would at least have called the winner. Lusinchi (2012) reaches the same order (non-response the main
cause); Lohr and Brick (2017) show that weighting by the 1932 vote the Digest itself collected would have
predicted Roosevelt. Squire's data is itself a quota sample, and the split between "list" and "response"
bias is still argued; the film only claims "the wrong people were asked, and answered", which all three agree on.

**Basis note (honest arithmetic).** The Digest's 43/57 is a share of Landon + Roosevelt ballots; the 60.8 %
result is a share of all votes. On a like-for-like two-party basis the miss is 62.5 − 42.9 = 19.5 points;
on all ballots 60.8 − 40.9 = 19.9. The film shows the two published figures (43 and 61) and the gap between
them (18); any basis gives 18 to 20 points against a margin of ±0.06, which is the point.

## The count structure

- **What is counted:** customers, one mark each. A market of **1,000 marks, exactly 500 yes (ink) and 500 no
  (hollow)**, laid out by a seeded shuffle (mulberry32 seed 36).
- **The surveys:** 20 surveys of 30 responses, each response an independent draw (with replacement) from the
  1,000 marks, seed 10227. Results, yes out of 30, in order:
  `18, 11, 11, 17, 18, 20, 10, 16, 17, 13, 14, 14, 13, 18, 15, 13, 15, 14, 14, 15`.
  Range 10 to 20 of 30, i.e. 33 % to 67 %; 4 of 20 read 18 or more (60 %+) from a 50 % market (theory: 18 %
  of surveys, 3.6 of 20). **Survey 1 is 18 of 30: the hook's survey is literally the first draw.**
- **Then 1,000:** 20 surveys of 1,000 from the same marks, seed 14: range 474 to 527 of 1,000 (47.4 % to
  52.7 %), all within 3 points; the ±3.1 band.
- **Marks on screen:** 1,000 population marks; 30 sample marks per survey (row); 20 dots on the n = 30 rail
  row; 20 ticks on the n = 1,000 rail row.
- **The committed number is placed against:** the plausible range for the hook's survey, 18 of 30: 95 %
  interval 42 % to 78 % (Wald; Wilson gives 42.3 % to 75.4 %; exact Clopper–Pearson 40.6 % to 77.3 %). The
  viewer's "as low as" sits on the rail against the "42 %" stamp and the 50 % line: below half is inside.

**Commit.** "30 customers answered; 60 % said yes. The true share could plausibly be as low as __ %."
Film-mode default **55**. Answer: **42 %**, i.e. the "majority" could be a minority.

## Monday question
"Out of how many? And who didn't answer?" (Ask both before you read any survey percentage.)

## Honest limits (one line on screen)
"The ± covers chance only, not who chose to answer."
In the brief: the ±1/√n rule assumes a random sample from the population you care about and a share
near 50 % (it is a normal approximation, rough at n = 30); the market and the surveys are a constructed
teaching object (seeded); the 1936 split between list bias and non-response bias is still debated.

## Sources (full citations; claims.json carries the same list)
- S1 Squire, Peverill (1988). "Why the 1936 Literary Digest Poll Failed." *Public Opinion Quarterly* 52(1): 125–133. doi:10.1086/269085
- S2 Lusinchi, Dominic (2012). "'President' Landon and the 1936 Literary Digest Poll: Were Automobile and Telephone Owners to Blame?" *Social Science History* 36(1): 23–54. doi:10.1215/01455532-1461650
- S3 Lohr, Sharon L., and J. Michael Brick (2017). "Roosevelt Predicted to Win: Revisiting the 1936 Literary Digest Poll." *Statistics, Politics and Policy* 8(1): 65–84. doi:10.1515/spp-2016-0006
- S4 Freedman, David, Robert Pisani, and Roger Purves (2007). *Statistics*, 4th ed. W. W. Norton. Ch. 19 (1936 table) and Ch. 20–21 (standard error of a percentage, confidence intervals).
- S5 "Landon, 1,293,669; Roosevelt, 972,897." *The Literary Digest*, 31 October 1936; reproduced by History Matters, George Mason University, https://historymatters.gmu.edu/d/5168/
- S6 Official 1936 returns (Clerk of the U.S. House, *Statistics of the Presidential and Congressional Election of November 3, 1936*), as summarised by Encyclopaedia Britannica, "United States presidential election of 1936"; Gallup final 55.7 %: "The Gallup scorecard," *Christian Science Monitor*, 30 October 1980.
- S7 Wilson, Edwin B. (1927). "Probable Inference, the Law of Succession, and Statistical Inference." *JASA* 22(158): 209–212 (cross-check of the 42 %).
- S8 Constructed teaching object (this film): seeded market and surveys, reproducible from claims.json params.

Verification: web fetches to primary PDFs were blocked by the egress proxy; every 1936 figure above was
confirmed in at least two independent search-indexed sources (tally variants 1,293,699 and 1,293,609 exist
in secondary reprints; all give 57.1 %). Every computed number was recomputed twice (node vm over claims.json,
and an independent Python port incl. mulberry32).

## What this film is NOT
- Not a statistics lecture: no z-scores, no "standard error" label, no formula on screen beyond "√n" on the brand card.
- Not "big data is useless" or "small samples are useless": 1,000 random responses are good to ±3.
- Not about polling or politics today; 1936 is the case, the customer survey is the subject.
- Not a claim that 30 responses can never be acted on; they can, inside ±18.
- Not a fix for bias: no weighting, no quota method, no non-response adjustment taught.
- Not base rates, the planning fallacy or the agent loop (already done).
