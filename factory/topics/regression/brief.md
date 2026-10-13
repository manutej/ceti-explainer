# Regression to the mean · film id `regression` · explorer brief

Date 2026-10-08. Format: the 75-second case (factory/FORMAT.md). Fixture is this film's own (Q10).
Every on-screen digit is in `claims.json`; the 100 pilots are in `claims.json → params`.

## The exec question (one line)
"Our worst-performing region got a new manager and improved next quarter: did the manager work?"

## The belief to break
When an extreme result moves back toward normal right after we act, our action caused the move.
Praise "makes people worse", a shouting "fixes them", a new manager "turned the region round".
In fact an extreme result is partly luck, the luck is redrawn next time, and the next result drifts
back toward average with nobody doing anything.

## The one real case
**Flight instructors, Israeli Air Force.** Tversky and Kahneman (1974) report it: instructors noted that
praise after an exceptionally smooth landing was usually followed by a worse landing, and harsh
criticism after a rough one by a better one; they concluded that verbal rewards hurt learning and
verbal punishment helps. Kahneman retells it as his own eureka moment (Thinking, Fast and Slow, 2011,
ch. 17 "Regression to the Mean": a senior instructor who "screamed into a cadet's earphone" after a bad
manoeuvre). His answer: the instructor saw a real pattern and drew the wrong cause. Kahneman's formula
in the same chapter: success = talent + luck.

The story itself carries no data, so its numbers come from **a declared model** (below), stated on the
page and in the honest limits. The one real dataset in the film is Galton (1886): 928 adult children of
205 parent couples; children's heights sat about 2/3 as far from average as their parents' (page
honest-limits block only, to show that r is not always 0.5).

## The model (declared; the gate recomputes everything from it)
- landing score = skill + luck, on a teaching scale with mean 50 and SD 10.
- Skill and luck are equally variable (SD 7.07 each), so the correlation between two landings by the
  same pilot is r = var(skill) / (var(skill) + var(luck)) = 0.5.
- The rule the film teaches: expected next score = average + r × (today − average). The top tenth sits
  on average +17.5 above the mean (normal model, 1.755 SD); expected next time +8.8. Half the gap goes,
  because half the gap was luck.
- Model expectation for the top 10 of 100: 8.4 land worse next time; 3.2 stay in the top 10.
- **The 100 pilots.** skill_i = 50 + round(7.071 · Φ⁻¹((i + 0.5)/100)), i = 0..99 (pilot index = skill rank).
  luck1 and luck2 are the same 100 rounded quantiles (mean 0), each shuffled by mulberry32 (luck1 seed 1468,
  luck2 seed 2468; Fisher-Yates from the top). today = skill + luck1; tomorrow = skill + luck2.
  Ranking ties break by pilot index. Arrays are frozen in `claims.json → params`.
- **Seed rule (honest):** seeds 1 to 5000 were scanned; 1468 is the only one whose counts sit at the model's
  rounded expectations (8 of top 10 worse, 8 of bottom 10 better, 3 stay top 10), sample r within 0.015 of
  0.5, no tie at the top-10 or bottom-10 cut, and no pilot scoring the same twice in either end group. So
  the sample is a typical draw, picked to be typical; the page says so.
- Sample facts: mean 50 both days; sample r = 0.49; top 10 average 69.6 today → 60.4 tomorrow
  (+19.6 → +10.4 above average, shown "+20 → +10"); bottom 10 average 33.4 → 41.8.
  Best landing today: pilot 98, skill 65 + luck 18 = 83; next day luck −6 → 59.
  Worst landing today: pilot 0, skill 32 + luck −6 = 26; next day luck +5 → 37.

## The count structure
- **What is counted:** landings. 100 pilots each land today and tomorrow: 100 marks per column, placed at
  true score on a shared vertical scale (TODAY column, TOMORROW column, one average line across both).
- **The marks that matter:** today's top 10 (lit), tallied one by one as they land tomorrow: 8 worse, 2
  better. Then the bottom 10: 8 better. Nobody praised or shouted at anyone.
- **The viewer's committed number** (commit: "Of today's 10 best landings, how many will be worse
  tomorrow? 0 to 10"; film-mode default 3) is placed as a marker on a 0-to-10 rail against the counted 8.
- Only after the counts: the gap brackets (+20 today → +10 tomorrow) and the word "half" (r = 0.5).

## The Monday question
"Before we credit the fix: what did the other worst units do over the same period without it?"
(Ask for a comparison group picked the same way, or judge the fix on a period not used to pick the unit.)

## Honest-limits line (on stage)
"This does not say the manager failed. One quarter cannot tell."
Page block adds: the pilots are a constructed sample from a declared model (r = 0.5 is a choice; real
KPIs have their own r, Galton's heights kept about 2/3); the instructors' story is an anecdote with no
data; regression does not mean feedback is useless, only that before/after on an extreme unit cannot
measure it.

## Sources (full citations)
1. Tversky A, Kahneman D. Judgment under uncertainty: heuristics and biases. *Science* 1974;185(4157):1124-1131.
   doi:10.1126/science.185.4157.1124. (The flight-training anecdote; "misconceptions of regression".)
2. Kahneman D. *Thinking, Fast and Slow.* New York: Farrar, Straus and Giroux; 2011. Chapter 17,
   "Regression to the Mean". (The instructor story, success = talent + luck.)
3. Galton F. Regression towards mediocrity in hereditary stature. *Journal of the Anthropological Institute
   of Great Britain and Ireland* 1886;15:246-263. doi:10.2307/2841583. (928 adult children, 205 parent couples, ~2/3.)
4. Secrist H. *The Triumph of Mediocrity in Business.* Evanston, IL: Bureau of Business Research,
   Northwestern University; 1933. With Hotelling H., letter, *Journal of the American Statistical
   Association* 1934;29(186):198-199, and his 1933 JASA review of the book. (The business version of the
   exec hook: top and bottom firms "converging" was regression. No Secrist numbers go on screen; his study
   years differ between secondary sources.)
5. Barnett AG, van der Pols JC, Dobson AJ. Regression to the mean: what it is and how to deal with it.
   *International Journal of Epidemiology* 2005;34(1):215-220. doi:10.1093/ije/dyh299. (Monday advice:
   control groups, and selection on baseline makes it worse.)

Verification note: 1, 3, 5 and the 1934 Hotelling letter were confirmed by two independent searches on
2026-10-08; the page range of Hotelling's 1933 review was not, so it is cited without pages. The
"landing" wording is from the 1974 paper; the 2011 book says "aerobatic manoeuvre" and "screamed", so the
film says "landing" and cites both.

## What this film is NOT
- Not "praise works" or "punishment works": it makes no claim about which feedback is better.
- Not a claim that the new manager did nothing; only that one before/after on the worst unit cannot tell.
- Not base rates, the planning fallacy or the agent loop (Q10); not the hot hand; not mean reversion in prices.
- Not a regression-line / least-squares lesson: no scatter plot, no fitted line, no formula beyond
  skill + luck and "half".
- Not real pilot data: the 100 pilots are a constructed sample from a declared model.
- Not Galton's story: he is a limits-block footnote, not the case.
