# Simpson's paradox · film id `simpsons` · brief

## The exec question (one line)
"Our new sales process converts worse overall, so we killed it." Was it worse, or did it just get the harder deals?

## The belief to break
A group that does worse overall must do worse inside the parts. In fact an overall rate is a blend: it
depends on how good each part is *and* on how the cases are spread across the parts. Change the
spread and the overall verdict can flip while every part says the opposite.

## The one real case (verified twice, see claims.json)
UC Berkeley graduate admissions, fall 1973, the six largest departments (Bickel, Hammel & O'Connell 1975;
the public table is R's `datasets::UCBAdmissions`, also Freedman, Pisani & Purves, ch. 2).
4,526 applicants: 2,691 men, 1,835 women.

| dept | men applied | men admitted | % | women applied | women admitted | % | higher |
|---|---:|---:|---:|---:|---:|---:|---|
| A | 825 | 512 | 62 | 108 | 89 | 82 | women |
| B | 560 | 353 | 63 | 25 | 17 | 68 | women |
| C | 325 | 120 | 37 | 593 | 202 | 34 | men (+3) |
| D | 417 | 138 | 33 | 375 | 131 | 35 | women |
| E | 191 | 53 | 28 | 393 | 94 | 24 | men (+4) |
| F | 373 | 22 | 6 | 341 | 24 | 7 | women |
| all six | 2,691 | 1,198 | 45 (44.5) | 1,835 | 557 | 30 (30.4) | men |

The mechanism: 1,385 of 2,691 men (51 %) applied to A or B, which admitted 64 % and 63 % of all applicants.
Only 133 of 1,835 women (7 %) did; women applied mostly to C to F, which admitted 6 % to 35 %.

**Corrections to the seed (do not put the seed wording on screen):**
1. "44 % of men, 35 % of women" is the *campus-wide* figure (8,442 men, 4,321 women; Bickel Table 1). Pooled
   over the six departments the film counts, it is 45 % vs 30 % (44.5 / 30.4 per the R documentation). The
   film uses the six-department numbers only, so every mark and every digit reconciles; the campus figure
   appears only in the live page's honest-limits block.
2. "Department by department women were admitted at equal or higher rates" is false for these six: women
   were higher in 4 (A, B, D, F) and lower in 2 (C by 3 points, E by 4). The film says exactly that; it is
   also the commit's answer.
3. Not used anywhere: the admitted counts 3,738 and 1,494 and the "4 of 85 vs 6 of 85 departments" tally
   could not be checked against the paper from this container (paper sites blocked); keep them off screen.

## The count structure
- **What is counted:** applicants. One mark = one applicant, 4,526 marks, in two columns (MEN 2,691,
  WOMEN 1,835), 50 marks per row. Admitted = solid ink square; rejected = pale hollow square.
- **First pooled:** the columns fill, the admitted marks ink and sort to the top: 1,198 of 2,691 vs 557 of
  1,835. Only then 45 % vs 30 %.
- **Then split:** the same marks travel into six department bands (A to F) aligned across the two
  columns, so the viewer *sees the mix*: the men's mass sits in A and B, the women's in C to F.
- **The committed number:** "In how many of the 6 departments did women do worse?" (0 to 6; film default 5).
  It is placed on a 0 to 6 strip against the truth, **2**, beside the department ledger where the two
  rows (C, E) are marked; the gaps there are 3 and 4 points.

## The Monday question
"Did the new process get the same mix of leads as the old one?" Split by segment before you compare.

## Honest-limits line
"Splitting explains this gap. It does not prove fairness." (Six departments, one year; why women applied
to the crowded departments is a separate question the split cannot answer.)

## Sources (full citations)
1. Bickel, P. J., Hammel, E. A., & O'Connell, J. W. (1975). Sex bias in graduate admissions: Data from
   Berkeley. *Science*, 187(4175), 398–404. doi:10.1126/science.187.4175.398
2. R Core Team. *UCBAdmissions: Student Admissions at UC Berkeley* (datasets package documentation and
   data; 4,526 observations, six largest departments, 1973). R: A Language and Environment for
   Statistical Computing. Verified here from the Rdatasets CSV bundled in pydataset 0.2.0 (PyPI).
3. Freedman, D., Pisani, R., & Purves, R. (2007). *Statistics* (4th ed.), chapter 2, section 4
   (the six largest majors, Berkeley 1973). New York: W. W. Norton.
4. Simpson, E. H. (1951). The interpretation of interaction in contingency tables. *Journal of the Royal
   Statistical Society, Series B*, 13(2), 238–241. doi:10.1111/j.2517-6161.1951.tb00088.x
5. Pearl, J. (2014). Comment: Understanding Simpson's paradox. *The American Statistician*, 68(1), 8–13.
   doi:10.1080/00031305.2014.876829

## What this film is NOT
- Not a verdict that Berkeley had no bias; it shows where *this* gap came from.
- Not "always split the data": a split chosen after the fact, or on something the treatment caused, can
  mislead the other way (Pearl 2014). Split on what came before the decision (department, segment).
- Not about the sales numbers: the hook is a digit-free situation; no invented conversion rates on screen.
- Not kidney stones, batting averages or any second case; one fixture only (Q10).
- Not an odds-ratio, chi-square or log-linear lecture; no p-values on screen.
- Not base rates, the planning fallacy or the agent loop.
