# Selection into treatment · brief (film id `selection`)

## Exec question (one line)
"The data clearly shows the feature drives retention": customers who turned it on stayed at 80 % against 50 %; how much of that 30-point gap is the feature?

## The belief to break
If the people who use a thing do better than the people who do not, the thing made them do better. The
break: the people who *chose* it were different before they chose. Comparing choosers with non-choosers
measures the thing plus who chose it. Only a split the customers did not choose (a coin flip, a random
holdout) separates the two.

## The one real case: hormone therapy and heart disease
- **What the observational studies said (1991).** Stampfer and Colditz pooled the epidemiology on
  postmenopausal estrogen and coronary heart disease. Of 16 prospective (cohort) studies, 15 found lower
  risk among users. All studies together: relative risk **0.56** (95 % CI 0.50 to 0.61), i.e. **44 % lower**
  risk for women who took it. The authors judged the evidence strong and unlikely to be explained by confounding.
- **What the randomized trial found (2002).** The Women's Health Initiative assigned **16,608** healthy
  postmenopausal women aged 50 to 79 by lot: **8,506** to estrogen plus progestin, **8,102** to placebo.
  Coronary heart disease: **164** cases against **122**; hazard ratio **1.29** (nominal 95 % CI 1.02 to 1.63),
  i.e. **29 % higher**, not lower. Stopped early, mean follow-up 5.2 years; 7 more CHD events per 10,000
  woman-years. (Check: crude ratio (164/8,506)/(122/8,102) = 1.28, consistent with the Cox HR.)
- **Why (the explanation).** Lawlor, Davey Smith and Ebrahim (2004): the women who chose HRT were
  socially advantaged across the whole life course; in 4,286 British women aged 60 to 79, disadvantage
  in childhood and adulthood predicted *not* using HRT, independent of adult risk factors. Adjusting for adult
  variables cannot remove that, so observational studies credited the pill with what was really who took it.
  Their IJE commentary frames it as the "conundrum" of observational epidemiology.

## The count structure
- **What is counted:** 100 customers, one square mark each (a constructed teaching object, declared on
  screen: "TEACHING SET · 100 CUSTOMERS · SEED 90").
- **Hidden truth in params:** each customer has a fixed pair of outcomes: A stays either way (56), P stays
  only with the feature (10), N leaves either way (34). Who turned it on: 21 A, 3 P, 6 N (30). Who did not:
  35 A, 7 P, 28 N (70). The feature's true effect is 10 points, for adopters and for everyone.
- **Pass 1 (as chosen):** 30 slide into one column, 70 into another. Stayed: 24 of 30, 35 of 70. Only then
  80 % and 50 %: a 30-point gap.
- **Pass 2 (same 100, coin flip):** seeded mulberry32 Fisher-Yates split (seed 90) into 50 and 50; everyone
  in the first half gets the feature. Stayed: 33 of 50 against 28 of 50, 66 % against 56 %: **10 points**.
- **The committed number** (points of the 30 the viewer credits to the feature, 0 to 30; film default 25) is
  placed on the 30-point gap bar against the truth: 10 points the feature, 20 points who chose it.

## The Monday question
"Who turned it on, and would they have stayed anyway?" Then: hold the feature back from a random half
before you credit it.

## Honest-limits line
On film (caption): "HRT was not all selection: when women started may matter." On the page, also: the 100
customers are invented; seed 90 was chosen because its split comes out exactly even. With only 100
customers, 90 % of 10,000 seeded 50/50 splits land between −6 and +26 points, so a real test needs far
more than 100 customers. The 1991 studies were mostly estrogen alone; the 2002 arm was estrogen plus
progestin (the 2004 WHI estrogen-alone arm also found no heart benefit, HR 0.91, 95 % CI 0.75 to 1.12).
Later WHI analyses (Rossouw 2007) suggest timing since menopause modifies the CHD effect (HR 0.76 under
10 years, 1.28 at 20 or more; trend P = .02), so not all of the gap is selection.

## Sources (full citations)
1. Writing Group for the Women's Health Initiative Investigators. Risks and benefits of estrogen plus
   progestin in healthy postmenopausal women: principal results from the Women's Health Initiative
   randomized controlled trial. *JAMA*. 2002;288(3):321-333. doi:10.1001/jama.288.3.321
2. Stampfer MJ, Colditz GA. Estrogen replacement therapy and coronary heart disease: a quantitative
   assessment of the epidemiologic evidence. *Prev Med*. 1991;20(1):47-63. PMID 1826173.
3. Lawlor DA, Davey Smith G, Ebrahim S. Commentary: The hormone replacement–coronary heart disease
   conundrum: is this the death of observational epidemiology? *Int J Epidemiol*. 2004;33(3):464-467.
   doi:10.1093/ije/dyh124
4. Lawlor DA, Davey Smith G, Ebrahim S. Socioeconomic position and hormone replacement therapy use:
   explaining the discrepancy in evidence from observational and randomized controlled trials.
   *Am J Public Health*. 2004;94(12):2149-2154. doi:10.2105/ajph.94.12.2149
5. Rossouw JE, Prentice RL, Manson JE, et al. Postmenopausal hormone therapy and risk of cardiovascular
   disease by age and years since menopause. *JAMA*. 2007;297(13):1465-1477. PMID 17405972.
6. (honest limits only) Women's Health Initiative Steering Committee. Effects of conjugated equine estrogen
   in postmenopausal women with hysterectomy. *JAMA*. 2004;291(14):1701-1712. doi:10.1001/jama.291.14.1701

Verification note: PubMed, JAMA and OUP were blocked by the container's egress proxy; every figure above
was checked against the published abstracts through two independent web searches each (WHI: 16,608,
8,506/8,102, HR 1.29 CI 1.02-1.63, 286 cases = 164 + 122, 5.2 years, 7 per 10,000; Stampfer: 15 of 16,
0.56 CI 0.50-0.61; Lawlor AJPH: 4,286 women aged 60-79). The 164/122 split comes from a reproduction of
the JAMA results table and sums to the abstract's 286; a builder with JAMA access should eyeball it once.

## What this film is NOT
- Not medical advice about hormone therapy, and not a claim that the HRT reversal was all selection.
- Not about sample size or statistical power (it shows one balanced split; the swing is a page note).
- Not survivorship bias, regression to the mean, Simpson's paradox or novelty effects.
- Not a methods tour (no propensity scores, matching, instrumental variables, difference-in-differences).
- Not base rates, the planning fallacy or the AI agent loop (already done; Q10).
