# AI adoption and capability stories that reverse when re-partitioned (2024-2026)

Research lane, written 2026-10-10. Lane output only; no film decision is made here.

## Read this first: evidence limits of this pass
- WebFetch was blocked by egress policy (metr.org, census.gov, arxiv.org, epoch.ai, stanford.edu all refused). Every number below
  comes from WebSearch (extended) result text that names the URL given. No PDF/table was opened. So no row is verified against
  the primary table; "A" means a primary publisher is the named source, not that the cell was read.
- Grades: A = primary publisher named and the number appeared in search text; B = secondary report of a primary; C = blog,
  aggregator, vendor, conflicting versions, or an estimate. Every film digit must still be re-read from its primary before use (law).
- 2026 leaderboard rows (HLE, ARC-AGI-3, FrontierMath v2, SWE-bench Verified top scores) conflict between aggregators and cite
  model names seen only on those aggregators. Treat all post-June-2026 leaderboard values as C and do not put them on screen.
- Questions are re-partitioned in the same data wherever possible (counts first, then ratios).

## Summary table
| # | Default assumption | Re-partition that reverses it | Grade |
|---|---|---|---|
| 1 | AI slows or speeds everyone equally | by experience: novices +34 %, experts ~0 or negative | A/B |
| 2 | AI is eating young and old jobs alike | by age within exposed jobs: 22-25 down, older up | B |
| 3 | Agents that score 60-80 % get the job done | by repeats (pass^k) and by merge test: falls to <25 % / half | A/B |
| 4 | 1 in 5 firms use AI; big firms lead and keep rising | by weighting (firms vs workers), size, sector, year | A |
| 5 | 95 % of pilots fail | by buy vs build, by function, by definition | B |
| 6 | Hard benchmarks stay hard | by benchmark and by year: 5 % to 98 % in 14 months; new ones reset | B/C |
| 7 | Open models are far behind | by public vs private benchmark; by year | A/B |
| 8 | Smarter models and search hallucinate less | by task type and tool | B |
| 9 | Tokens got 50x cheaper, so tasks did | per token vs per solved task | C |
| 10 | Release pace is accelerating everywhere | flagship vs point release | C |
| 11 | Usage up means trust up | by measure: use up, trust down | A |
| 12 | AI is a copilot | by channel: API is 77 % automation | A |

## 1. Who gains: novices vs experts (productivity RCTs)
Default: "AI makes developers faster" (pooled field experiment +26 %) or "AI makes experts slower" (METR). Both are true in different cells.
| value | unit | date | source URL |
|---|---|---|---|
| 16 | developers, experienced OSS maintainers | Jul 2025 | https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/ |
| 246 | real issues, randomised allow/forbid AI | Jul 2025 | same |
| +19 (CI +2 to +39) | % longer completion with AI | Jul 2025 | same |
| 24 / 20 | % speedup forecast before / believed after | Jul 2025 | same |
| -18 (CI -38 to +9); -4 (CI -15 to +9) | % time change, returning / new devs, follow-up | Feb 2026 | https://metr.org/blog/2026-02-24-uplift-update/ |
| 30 to 50 | % of devs withholding tasks they would not do without AI | Feb 2026 | same (METR calls estimate biased, redesigning) |
| 5,179 | support agents | 2023, QJE 2025 | https://www.nber.org/papers/w31161 |
| +14 avg; +34 novice; minimal experienced | % issues resolved per hour | 2023-25 | same |
| 4,867 | developers in 3 field RCTs (Microsoft, Accenture, Fortune 100) | 2024-25 | https://economics.mit.edu/sites/default/files/inline-files/draft_copilot_experiments.pdf |
| +26.08 (SE 10.3) | % completed tasks pooled; juniors gain more | same | same |
| 758 | BCG consultants; inside-frontier +12.2 % tasks, +25.1 % faster, +40 % quality | 2023, Org Sci 2026 | https://pubsonline.informs.org/doi/full/10.1287/orsc.2025.21838 |
| -19 pp | correctness on a task outside the frontier (blog-only figure) | same | same (grade C) |
Reversal: the same tool is +34 % for a novice agent and ~0 for an expert, and an expert who feels +20 % measured -19 %.
Honest limit: n=16 is tiny; Jul 2025 tools (Cursor, Claude 3.5/3.7) are two years old; METR itself says early-2026 speedup is probably higher but its new data is "very weak evidence"; the GPT-3 support tool is one firm.
Confidence: A (METR, NBER, QJE named) / B for BCG details.

## 2. Canaries: exposed jobs, split by age
Default: "AI will cut jobs broadly" or, per null-result studies, "AI has not touched jobs".
| value | unit | date | source URL |
|---|---|---|---|
| -13 | % relative employment, age 22-25, most-exposed vs least-exposed jobs (firm-time controls) | Aug 2025 | https://digitaleconomy.stanford.edu/publication/canaries-in-the-coal-mine-six-facts-about-the-recent-employment-effects-of-artificial-intelligence/ |
| -16 | same, later specification | Nov 2025 | same family (PDF CanariesintheCoalMine_Nov25) |
| -19 | gap, 22-25 in exposed jobs vs peers, "widened steadily" | Aug 2026 | https://digitaleconomy.stanford.edu/news/canariesaug26/ |
| flat or rising | older/experienced workers in same jobs; where use complements | 2025-26 | same |
| >9 (secondary) | % growth, ages 35-49 in exposed jobs | 2025 | https://arxiviq.substack.com/p/canaries-in-the-coal-mine-six-facts (C) |
| 0 | economy-wide: occupational mix shift not unusual vs history | Oct 2025 | https://budgetlab.yale.edu/sites/default/files/page_to_pdf/1154/publication_1154.pdf |
| 25,000 / 7,000 | workers / workplaces, Denmark, 11 exposed occupations | 2025 | https://bfi.uchicago.edu/working-papers/large-language-models-small-labor-market-effects/ |
| ~0 (CI excludes >1 to 2 %) ; 2.8-3 | earnings/hours effect; % time saved | 2025 | same |
Reversal: pooled, employment shows no AI dent; cut to ages 22-25 in substitution-type jobs, it is -13 to -19 % while older colleagues grow.
Honest limit: one payroll vendor (ADP); correlation with a cooling market and post-2021 trend is argued by Yale; paper numbers change by version, so quote version and date.
Confidence: B (the August 2026 figure arrives only through the lab news page snippet).

## 3. Agent reliability: benchmark score vs repeat and vs merge
Default: "an agent at 60-80 % does 60-80 % of the work reliably."
| value | unit | date | source URL |
|---|---|---|---|
| >60 | % single-trial retail success, GPT-4o | Jun 2024 | https://arxiv.org/pdf/2406.12045 |
| <25 | % pass^8 (all 8 tries succeed), same agent | Jun 2024 | same |
| 60.4 / 49.1 / 43.0 / 38.3 | % pass^1..pass^4 retail, GPT-4o leaderboard | 2024 | https://github.com/sierra-research/tau-bench (via search) |
| 80.9 | % SWE-bench Verified, Claude Opus 4.5 | late 2025 | https://www.vals.ai/benchmarks/swebench |
| ~50 | % of test-passing SWE-bench PRs maintainers would not merge | Mar 2026 | https://metr.org/notes/2026-03-10-many-swe-bench-passing-prs-would-not-be-merged-into-main/ |
| 296 | PRs reviewed by 4 maintainers, 3 repos | same | same |
| 59.4 | % of audited hard tasks with flawed tests (OpenAI audit, hard slice only) | Feb 2026 | https://stackfutures.com/blog/openai-retires-swe-bench-verified/ (C) |
| 81 vs 69 | % same model with heavy scaffolding vs standalone | 2026 | same (C) |
| 12.24 | % best model OSWorld | 2024 | http://osworld-v1.xlang.ai/ |
| 72.36 | % human baseline OSWorld (2024 sample, never re-measured) | 2024 | same |
| 72.6 ; 77.29 | % OSWorld agents, Agent S3 ; Agent Alpha | late 2025 ; early 2026 | https://arxiv.org/pdf/2510.02250 ; https://arxiv.org/pdf/2602.02995 |
| 20.6 | % best on OSWorld 2.0 (harder suite) | 2026 | https://benchmarkingagents.com/osworld/ (C) |
| 50 vs 80 | % success horizon: Opus 4.5 about 4 h 49 min vs 27 min | late 2025 | https://www.lesswrong.com/posts/q5ejXr4CRuPxkgzJD/claude-opus-4-5-achieves-50-time-horizon-of-around-4-hrs-49 (C) |
| 131 ; 213 | days doubling of 50 % horizon (v1.1 suite) ; 80 % horizon (orig.) | 2026 ; 2025 | https://arxiv.org/html/2503.14499v1 + search (B) |
Reversal: one try at 60 % becomes under 25 % when all eight tries must work, and half of "passes" are not mergeable; the same agent at the 80 % bar has a 10x shorter horizon.
Honest limit: tau-bench GPT-4o numbers are mid-2024 models; METR says agents were not allowed to iterate on maintainer feedback; OSWorld-Verified is not comparable with 2024 OSWorld.
Confidence: A (tau-bench paper, METR note) / C for 2026 leaderboards.

## 4. Adoption by firm size, sector, weighting, year (Census BTOS)
Default: "about one in five US firms use AI, large firms lead, and everything is rising."
| value | unit | date | source URL |
|---|---|---|---|
| 14 -> 12 | % firms 250+ emp., six-survey average, fell | Jun -> Aug 2025 | https://www.apolloacademy.com/ai-adoption-rate-trending-down-for-large-companies/ ; https://fortune.com/2025/09/10/ai-adoption-declines-big-companies-human-skills-premium-education-gen-z/ |
| 6.3 -> 8.8 vs 11.1 | % firms <250 emp. rose vs 250+ (gap closing) | 2025 | https://advocacy.sba.gov/wp-content/uploads/2025/09/Research-Spotlight-AI-in-Business-Small-Firms-Closing-In_-092425.pdf |
| 19.8 | % firms national | to 3 May 2026 | https://www.census.gov/library/stories/2026/05/ai-use-businesses.html |
| 37 / 32 / <20 | % firms 250+ / 100-249 / 1-4 emp. | to 3 May 2026 | same |
| 39.7 / 33.9 | % Information / Finance & Insurance | to 3 May 2026 | same |
| <10 | % in agriculture, transport, accommodation-food, construction | 2026 | https://www.minneapolisfed.org/article/2026/ai-adoption-in-business-grows-steadily-but-unevenly |
| 18 -> 32 | % firms vs employment-weighted, any business function | Nov 2025-Jan 2026 | https://www2.census.gov/library/working-papers/2026/adrm/ces/CES-WP-26-25.pdf |
| 50-60 (60-70 weighted) | % very large firms in Info, Prof. services, Finance | same | same |
| 17-20 | % firms Dec 2025-May 2026; no significant change <20 emp. | 2026 | census story above |
Reversal: by firm count it is 1 in 5; by workers' employer it is 1 in 3; large firms dipped in 2025 while small firms rose, and sector spreads 40 % vs under 10 %.
Honest limit: Census changed the AI question in Nov 2025 ("any business function"), roughly doubling the rate (Minneapolis Fed); series before and after must not share one axis (Fed note: https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-ai-adoption-in-the-u-s-economy-20260403.html). The 2025 dip is a smoothed series with disputed size (9 to 12 %).
Confidence: A for 2026 levels (Census named), B for the 2025 dip.

## 5. Enterprise pilots: 95 % fail, then who succeeds
Default: "nearly all enterprise AI pilots fail"; counter-default: "88 % of firms use AI so it works."
| value | unit | date | source URL |
|---|---|---|---|
| 95 | % of GenAI pilots with no measurable P&L return | Jul-Aug 2025 | https://fortune.com/2025/08/18/mit-report-95-percent-generative-ai-pilots-at-companies-failing-cfo/ |
| 150 / 350 / 300 | leader interviews / employee surveys / public deployments (other sources: 52 / 153 / 300) | 2025 | same ; https://mlq.ai/media/quarterly_decks/v0.1_State_of_AI_in_Business_2025_Report.pdf |
| ~5 | % that reach "rapid revenue acceleration" (the success bar) | 2025 | Fortune above |
| 67 vs 33 | % success bought/partnered vs internal build | 2025 | https://www.gartner.com/peer-community/post/mits-nanda-report-state-ai-business-report-2025-finds-95-enterprise-ai-initiatives-have-delivered-zero-roi-buy-strategies (C, relayed) |
| 50-70 | % of exec-sample AI budget to sales and marketing; back-office pilots succeed more | 2025 | https://www.forbes.com/sites/andreahill/2025/08/21/why-95-of-ai-pilots-fail-and-what-business-leaders-should-do-instead/ (C) |
| 88 ; ~33 ; 39 ; 23 | % use AI in >=1 function ; scaling ; any EBIT impact ; scaling agents | 2025 | https://www.mckinsey.com/capabilities/operations/our-insights/the-state-of-ai |
| 5.5 | % of 1,933 respondents (109) with >5 % EBIT from AI (secondary analysis) | 2025 | source page not pinned (C) |
| >40 | % agentic projects Gartner expects cancelled by end 2027 (forecast) | Jun 2025 | https://www.rcrwireless.com/20250627/business/agentic-ai-gartner |
Reversal: "95 % fail" is "95 % lack P&L at six months", and bought, back-office tools succeed about 2 in 3 while 88 % "use" and 39 % see any EBIT effect.
Honest limit: preliminary, not peer reviewed, small and interview-based sample, success defined narrowly, authors build agent infrastructure (Sify critique: https://www.sify.com/ai-analytics/95-companies-failing-with-ai-an-mit-nanda-report-misread-by-all/). Shadow-AI 40 %/90 % figures could not be confirmed and are omitted.
Confidence: B (report relayed; McKinsey headline numbers B+).

## 6. Benchmark saturation vs headroom (partition by benchmark and year)
Default: "benchmarks stay hard; AI is plateauing" or "benchmarks are all solved." Neither holds across benchmarks.
| value | unit | date | source URL |
|---|---|---|---|
| >90 ; ~9 | % MMLU frontier ; % questions with errors (ceiling about 91) | 2023-24 | https://www.lxt.ai/blog/llm-benchmarks/ (C) |
| ~83 -> 94.3 | % GPQA Diamond cluster ; Gemini 3.1 Pro | 2025 ; Feb 2026 | https://epoch.ai/gradient-updates/gpqa-diamond-whats-left ; https://intuitionlabs.ai/articles/gpqa-diamond-ai-benchmark |
| 8.0 -> 25.3 -> 37.5 | % Humanity's Last Exam best: o1, GPT-5, Gemini 3 Pro | Jan 2025, mid-2025, early 2026 | https://intuitionlabs.ai/articles/humanitys-last-exam-ai-benchmark (C) |
| 55 to 65 | % HLE top, Oct 2026, leaderboards disagree (59.1 AA / 65 BenchLM / 60.6 Scale) | Oct 2026 | https://pricepertoken.com/leaderboards/benchmark/hle ; https://benchlm.ai/benchmarks/hle (C) |
| 53.0 / 3.0 | % o3 (medium) ARC-AGI-1 / ARC-AGI-2 | May 2025 | https://arcprize.org/results |
| 93.0 ($1.88/task) ; 90.5 ($11.64/task) | % ARC-AGI-1 Opus 4.6 ; GPT-5.2 Pro | 2026 | https://arxiv.org/html/2603.13372v1 |
| 84.6 ($13.62/task) | % ARC-AGI-2 Gemini 3 Deep Think | 2026 | same |
| 24 | % ARC-AGI-2 best Kaggle entry under compute limits (NVARC) | 2025 | same |
| <1 ; 100 | % frontier ; % humans, ARC-AGI-3 | Mar 2026 | https://arxiv.org/html/2603.24621v1 |
| 62.7 vs 99.95 | % ARC-AGI-3 leader: BenchLM vs ARC Prize page, conflict | Sep-Oct 2026 | https://benchlm.ai/benchmarks/arcagi3 ; https://arcprize.org/results (C) |
| 5 -> 98 | % FrontierMath Tier 4 top score, 11 Jul 2025 to Sep 2026 (Epoch: "saturated") | 2025-26 | https://epochai.substack.com/p/gpt-54-set-a-new-record-on-frontiermath + Epoch post cited in search (B) |
| 38 ; 39.6 ; 52.4 | % Tier 4 GPT-5.4 Pro ; GPT-5.5 Pro ; Tier 1-3 GPT-5.5 Pro | Mar ; Apr 2026 | same |
| 42 | % of original problems with errors found by audit; v2 released 12 Jun 2026 | 2026 | https://www.digitalapplied.com/blog/epoch-frontiermath-v2-error-corrected-ai-benchmark-analysis (C) |
Reversal: each "unsaturable" benchmark fell in about 14 months (FrontierMath T4 5 -> 98 %), yet every new interactive benchmark (ARC-AGI-3, OSWorld 2.0) opens near 0-20 %; headroom is a property of the benchmark's age, not of AI.
Honest limit: scores are on test sets that get corrected (MMLU 9 % errors, FrontierMath v2 42 %), contamination is documented for coding sets, and company-reported results are unaudited.
Confidence: B for 2025 rows, C for the Sep-Oct 2026 rows.

## 7. Open vs closed frontier
Default: "open models trail by a year or more" or "open has caught up."
| value | unit | date | source URL |
|---|---|---|---|
| 3.5 | months for open to match closed SOTA (ECI, Jan 2023-Oct 2025) | Oct 2025 | https://epoch.ai/data-insights/open-closed-eci-gap |
| 4 ; 8 (CI 7-11) | months lag ; ECI points gap, since Jan 2026 | 29 May 2026 | same (updated) |
| 4-6 vs 8-10 | months lag on public vs private benchmarks (17 benchmarks) | May 2026 | Epoch post cited at https://itdoeswhatnow.com/m/2026-05-29-epoch-ai-open-models-lag-closed-frontier-by/ (B) |
| +250 -> low double digits -> ~0 -> ~30 | Arena Elo lead of proprietary leader, 3 years | 2023 -> early 2025 -> May 2026 | https://x.com/arena/status/2052455463573426452 |
| 44-46 vs 58 | Artificial Analysis Intelligence Index, best open vs best closed | Sep 2026 | https://slash-digital.io/en/insights/open-weight-models-2026/ (C) |
Reversal: on the human-preference public arena open nearly tied (0 gap in Jan 2025); on private held-out tests the lag is 8-10 months, about double.
Honest limit: closed labs may leave unpublished models out of comparisons, so lags are lower bounds; Arena is vulnerable to selective submission (https://arxiv.org/pdf/2504.20879).
Confidence: A (Epoch, Arena named).

## 8. Hallucination and citation accuracy by task and tool
Default: "bigger reasoning models and AI search are more reliable."
| value | unit | date | source URL |
|---|---|---|---|
| 14.8 ; 16 ; 33 ; 48 | % PersonQA hallucination: o3-mini ; o1 ; o3 ; o4-mini | Apr 2025 | https://www.techzine.eu/news/applications/130720/new-openai-models-hallucinate-more-often-than-their-predecessors/ (B) |
| 3.3 ; 13.6 ; >10 | % Vectara summarisation: Gemini 2.5 Flash-Lite ; Gemini 3 Pro ; GPT-5, Sonnet 4.5, Grok-4, R1 | late 2025 | https://www.vectara.com/blog/introducing-the-next-generation-of-vectaras-hallucination-leaderboard |
| 11.3 vs 6.1 | % DeepSeek R1 vs V3, same task (aggregator) | 2026 | https://www.elitecontentmarketer.com/ai-hallucination-statistics/ (C) |
| 200 ; 8 | tests ; AI search engines, quote-to-source task | Mar 2025 | https://www.cjr.org/tow_center/we-compared-eight-ai-search-engines-theyre-all-bad-at-citing-news.php |
| >60 ; 37 ; 94 | % wrong overall ; Perplexity (best) ; Grok 3 (worst) | Mar 2025 | same ; https://www.niemanlab.org/2025/03/ai-search-engines-fail-to-produce-accurate-citations-in-over-60-of-tests-according-to-new-tow-center-study/ |
| 2,709 ; 22 ; 18 ; 14 | core responses ; media orgs ; countries ; languages | Oct 2025 | https://www.etavrian.com/news/ai-news-answers-audit-sourcing-gaps (B, EBU primary not opened) |
| 45 ; 81 ; 31 | % >=1 significant issue ; any issue ; serious sourcing problems | Oct 2025 | same |
| 76 vs <=37 | % Gemini vs others significant issues (sourcing: 72 vs <25) | Oct 2025 | same |
Reversal: the pooled "AI search is 60 % wrong" splits into 37 % to 94 % by tool, and in the news audit one assistant causes most of the error; on PersonQA the newer reasoning model hallucinates twice the older one while on summarisation the best is a small non-reasoning model.
Honest limit: Tow Center task (name the source of a quote) is narrow and a year old; hallucination metrics measure different tasks and do not rank across them; paid tiers were more confidently wrong than free ones.
Confidence: B.

## 9. Price per token vs price per solved task
Default: "AI got 50x cheaper."
| value | unit | date | source URL |
|---|---|---|---|
| 9x to 900x (median 50x) | per year fall in price to reach a fixed benchmark score | Mar 2025 | https://epoch.ai/data-insights/llm-inference-price-trends |
| 5x-10x ; 13x | per year, frontier-level ; reasoning-era | 2025-26 | https://arxiv.org/html/2511.23455v1 ; https://epoch.ai/publications/the-plunging-price-of-thought |
| 1.88 vs 11.64 | USD per ARC-AGI-1 task for 93.0 % vs 90.5 % (6x cost for lower score) | 2026 | https://arxiv.org/html/2603.13372v1 |
Reversal: at a fixed score the price falls steeply; at the frontier a small score gain costs 6x per task. Claim "bill did not fall" has no measured source in this pass (omit).
Honest limit: Epoch excluded reasoning models from the main fit and warns the fastest declines may not persist.
Confidence: C.

## 10. Release cadence
Default: "models now ship faster than anyone can adopt."
| value | unit | date | source URL |
|---|---|---|---|
| ~12 ; ~14 ; ~30 ; >20 | notable releases 2023 ; 2024 ; 2025 ; Jan-Jul 2026 (count rule undefined) | 2026 | https://www.digitalapplied.com/blog/frontier-model-release-velocity-index-q2-2026 (C) |
| 46 -> 26 | days between Anthropic frontier-model releases, H1 -> H2 2026 | 2026 | https://finance.yahoo.com/technology/ai/articles/why-ai-model-releases-feel-102100600.html (C) |
| 4-5x | per year growth of frontier training compute | to May 2024 | https://epoch.ai/publications/training-compute-of-frontier-ai-models-grows-by-4-5x-per-year |
Reversal: the count of point releases doubles each year while the interval between genuinely new flagships has not changed in 2026.
Honest limit: no authoritative release database was reached; counts depend on what counts as a release.
Confidence: C.

## 11. Developer use up, trust down
| value | unit | date | source URL |
|---|---|---|---|
| 76 -> 84 | % use or plan to use AI tools | 2024 -> 2025 | https://stackoverflow.co/company/press/archive/stack-overflow-2025-developer-survey/ |
| 31 -> 46 | % who do not trust output accuracy | 2024 -> 2025 | same |
| 72.0 -> 59.7 | % favourable sentiment | 2024 -> 2025 | https://windowsforum.com/news/stack-overflow-survey-ai-coding-use-soars-as-developer-trust-falls.446666/post-1011216 (B) |
Reversal: every adoption measure rose while accuracy trust fell by 15 points. Limit: self-selected survey; trust figure varies (29 or 33 % trust) by Stack Overflow page. Confidence: A.

## 12. Copilot vs automation, by channel
| value | unit | date | source URL |
|---|---|---|---|
| 77 vs 12 | % API transcripts automation vs augmentation | Sep 2025 | https://www.anthropic.com/research/anthropic-economic-index-september-2025-report |
| 47 | % automation-dominant on Claude.ai (near-even split) | Sep 2025 | same |
| 57 / 43 | % augmented / automated, first report, different data | Mar 2025 | same family |
Reversal: consumer chat is half assisting; business API traffic is three-quarters delegating whole tasks. Limit: one vendor's own traffic, classifier-labelled, and the 27 -> 39 % trend figure is unverified (omit). Confidence: A.

## Ranked shortlist: the 4 best stories for a film
1. Story 1, who gains (experience level). Cleanest partition on counts: 16 devs/246 tasks, 5,179 agents, perception gap 20 % believed vs 19 % measured, then novice +34 % vs expert ~0. Commit beat: "guess the speedup". Needs the METR 2026 update on screen as the honest limit.
2. Story 2, canaries (age within exposed jobs). Same data, pooled flat, cut by age a -13 to -19 % vs older workers rising; Yale null as the pooled view. Version drift must be shown (13, 16, 19).
3. Story 3, agent reliability (repeats and merge test). 60 % single try, <25 % at eight tries, half of passes not mergeable; ties to counts (k, 296 PRs). Pair with the 50 % vs 80 % horizon gap.
4. Story 4, adoption weighted by firms vs workers (Census BTOS). Only story with a government primary; 18 % of firms vs 32 % weighted, 40 % vs under 10 % by sector, and the 2025 large-firm dip. Must carry the Nov 2025 question-change warning.
Reserve: Story 6 (FrontierMath Tier 4 5 -> 98 % in 14 months vs new benchmarks resetting) once Epoch's primary page is read; Story 5 (95 %) for a debunk-the-headline cut.
