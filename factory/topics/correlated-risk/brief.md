# Correlated risk · brief

Film id `correlated-risk`. Working title **"Ten Bets, One Bet"**. Explorer: Opus, 2026-10-08.

## The exec question (one line)
"We're diversified across ten suppliers. What are the odds half of them fail in the same year?"

## The belief to break
Ten positions that each fail 10 % of the time are ten separate coin flips, so a year in which five or
more fail together is essentially impossible (independent answer: 0.16 %, about 1 year in 600).
That holds only if they fail independently. Give them one shared shock (same region, same customer, same
interest-rate or input-price exposure) and each still fails 1 year in 10, but the failures arrive
together: the chance that 5 or more of 10 fail rises to 3.2 % at ρ = 0.3 and 6.9 % at ρ = 0.6,
about 20 and 42 times the independent figure. Diversification counts names; risk counts shocks.

## The numbers (all in claims.json, recomputed twice)
One-factor Gaussian copula (Vasicek 2002; the same structure as Li 2000): supplier j fails in a year
when √ρ·Z + √(1−ρ)·εj < Φ⁻¹(0.10), with Z the shared shock and εj its own. Marginal stays 10 % at every ρ.
P(≥ 5 of 10) = ∫ BinomTail(10, p(z), 5) φ(z) dz with p(z) = Φ((Φ⁻¹(0.1) − √ρ z)/√(1−ρ)).

| ρ | P(≥ 5 of 10), formula | seeded MC, 10,000 years (seed 2008) | counted in the film's 100 years (seed 630) | failures in those 100 years |
|---|---|---|---|---|
| 0 | 0.1635 % | 0.14 % | 0 | 100 |
| 0.3 | 3.2179 % | 3.41 % | 3 | 98 |
| 0.6 | 6.9249 % | 7.11 % | 7 | 99 |

Verified twice: (1) JS quadrature (midpoint, h = 0.001 on ±8, series erf), stored as the claims.json
formulas and re-evaluated from disk in a fresh node vm; (2) an independent Python check (statistics.NormalDist,
Simpson on ±10, 20,000 panels): 0.1635, 3.2179, 6.9249, ratio 42.36. MC agrees within sampling error.
Bonus finding for the try-it panel: correlation also makes *clean* years more common (no failure in
35 % of years independent, 64 % at ρ = 0.6; counted 37 and 65 in the film's draw). Most years look better;
the bad years are much worse. That is why it feels safe.

**On the seed.** The 100-year grid is one seeded draw. Seed 630 was chosen (first of ~1.6 % of seeds 1 to
1,000 that pass) so that the grid's counts equal the formula's rate rounded (0, 3, 7) and its failure
totals sit near 100. The rates on screen come from the formula, not the draw; the draw illustrates them.
NOTES.md must say this. With common random numbers the same draw is re-thresholded as ρ rises, so the
count of bad years rises monotonically 0, 0, 1, 2, 2, 2, 3, 3, 4, 6, 6, 6, 7 over ρ = 0, 0.05, …, 0.6,
and the 3 bad years at ρ 0.3 (years 34, 58, 92) stay bad at ρ 0.6.

## The one real case (CASE beat) and its sources
Mortgage securitisation, 2006 to 2008. The AAA recipe, in Coval, Jurek & Stafford's own worked example
(JEP 2009, two-bond example, verified): two bonds, each with a 10 % default probability, pooled and cut
into a junior and a senior $1 slice. The senior slice defaults only if both bonds default:
**1 %** if defaults are uncorrelated (junior: 19 %). If defaults are perfectly correlated the structure
gives the senior slice no protection: it carries the bonds' **10 %**. Ten times the risk, same rating
inputs. (Their three-bond version: 0.1 %, 2.8 %, 27.1 %; not on screen.) CJS: "roughly 60 percent of all
global structured products were AAA-rated, in contrast to less than 1 percent of the corporate issues"
(citing Fitch 2007). The outcome, FCIC (2011), Conclusions: in 2006 alone Moody's rated about
30 mortgage-related securities triple-A every working day, and **83 %** of the mortgage securities rated
triple-A that year were ultimately downgraded. The shared shock was a nationwide fall in house prices,
which the ratings' low default correlations did not price (Salmon 2009 on Li's copula and its single
correlation number). The case's p = 10 % happens to equal the supplier p, which lets the film reuse one mark.

## The count structure (COUNT beat)
- **What is counted:** supplier failures, one mark per supplier per year. 10 marks per row, 100 rows
  (years), laid out as 4 blocks of 25 rows; 1,000 marks. A failure is a filled red mark.
- **Then:** years with 5 or more red marks are banded and counted: 0 at ρ 0, 3 at ρ 0.3, 7 at ρ 0.6,
  while the total red marks stay about 100 (100, 98, 99). Counts appear only at the three stops.
- **Against the viewer:** the banded rows fly onto a 0 to 10 "bad years per 100" scale as stacks
  (0, 3, 7); the viewer's committed number lands as a YOU marker; then the formula's rules
  0.16, 3.2, 6.9 and only then the percentages 0.16 %, 3.2 %, 6.9 % and "42×".
- **Commit:** "Ten suppliers, each 10 % likely to fail this year. Out of 100 years, in how many do 5
  or more fail?" Integer 0 to 100; film-mode default 1.

## The Monday question
"What one shock would hit five of our ten suppliers at once?" (Then: if one fails, how likely is a
second in the same quarter?)

## Honest-limits line
"These ρ values are illustrative, not measured for your suppliers; the Gaussian copula itself
understates joint crashes." On screen (≤ 60): "Limits: these ρ are illustrative, not your suppliers'."
Also for the page: the CDO example is CJS's stylised two-bond illustration of the recipe, not a
specific 2006 deal; the 83 % is FCIC's outcome figure for Moody's 2006 triple-A mortgage securities and
has more than one cause.

## Sources (full citations)
1. Coval, J. D., Jurek, J. W., & Stafford, E. (2009). The Economics of Structured Finance. *Journal of
   Economic Perspectives*, 23(1), 3–25. doi:10.1257/jep.23.1.3. (Two-bond example: 10 %, 1 %, 19 %,
   perfectly correlated case; "roughly 60 percent … AAA-rated … less than 1 percent of the corporate issues".)
2. Financial Crisis Inquiry Commission (2011). *The Financial Crisis Inquiry Report*. Washington, DC:
   US Government Printing Office. Conclusions of the Commission, p. xxv. govinfo.gov/content/pkg/GPO-FCIC/pdf/GPO-FCIC.pdf.
   (83 % of 2006 Moody's triple-A mortgage securities ultimately downgraded; 30 per working day.)
3. Salmon, F. (2009, 23 February). Recipe for Disaster: The Formula That Killed Wall Street. *Wired*,
   17(03). Reprinted as "The formula that killed Wall Street", *Significance* 9(1), 16–20 (2012),
   doi:10.1111/j.1740-9713.2012.00538.x. (Context: Li's copula, one correlation number; not quoted on screen.)
4. Li, D. X. (2000). On Default Correlation: A Copula Function Approach. *Journal of Fixed Income*,
   9(4), 43–54. doi:10.3905/jfi.2000.319253.
5. Vasicek, O. (2002). The Distribution of Loan Portfolio Value. *Risk*, 15(12), 160–162. (One-factor model used here.)

Verification status: CJS figures confirmed by two independent search passes and by arithmetic
(0.1² = 1 %, 1 − 0.9² = 19 %); FCIC 83 % confirmed in the report text and in Chair Angelides' 2 June 2010
hearing statement. Direct PDF fetches were blocked by this container's egress proxy, so the page
numbers (FCIC p. xxv; CJS section on the two-bond example, around p. 7) should be eyeballed once
against the PDFs by the evaluator. Salmon's market-size figures ($275 bn CDOs in 2000 to $4.7 tn in
2006) appear only in reprints, so the film does not show them.

## What this film is NOT
- Not a lecture on copulas: ρ appears as a three-step dial, never as an equation on screen.
- Not "the formula killed Wall Street": the case shows one recipe and one outcome, not a causal verdict.
- Not a forecast for anyone's suppliers: no ρ is measured; the stops 0.3 and 0.6 are illustrative.
- Not about base rates, the planning fallacy, or the agent loop (Q10); not about expected loss or
  VaR; no dollar amounts.
- Not anti-diversification: ten names still beat one; the point is that ten names exposed to one
  shock are closer to one bet than to ten.
- No charts, icons, dashboards or hand-drawn figures: ink marks on paper, mono numbers (Q6).
