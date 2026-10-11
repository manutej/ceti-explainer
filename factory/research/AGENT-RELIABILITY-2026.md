# AGENT-RELIABILITY-2026 · lane R-R1 of Wave RELIABILITY (2026-10-11)

Scope: verify the owner's reading of five 2026 agent-reliability papers (factory/WAVE-RELIABILITY.md), recompute what the two
open-data clones allow, and rank three films. No git. Every number below is graded.

Grades (same convention as pass-every-time): **A** = opened or recomputed here from a primary data file, with the command.
**B** = the primary page is blocked by egress; read through quoted search-result text (WebSearch returns a summarising layer, so
a B quote is a paraphrase of page text, not the page). **C** = one secondary source, or not found. Nothing graded C may be on screen.

Reproduce everything in section 2 and 3 from the repo root:

    python3 -I factory/topics/reliability-data/recompute.py            # prints every number, writes nothing
    python3 -I factory/topics/reliability-data/recompute.py --write    # regenerates the five JSON files below

Inputs (read as untrusted data, never imported or run): `/home/user/data/hyper-tau-bench`, `/home/user/data/rethinking-agent-evaluation`
(override with two positional arguments). Stdlib only, deterministic, asserts the checks marked "assert" below.

---------------------------------------------------------------------------------------------------------------------------------

## 0. Verdict on the owner's numbers

| # | Owner's claim | Verdict | Grade |
|---|---|---|---|
| 2 | best configuration 23.9 %, expert ceiling 82.2 % | **True**, both in the clone's leaderboard rows (Claude Code + Claude Opus 5 = 23.9; `reference.json` = 82.2) | A |
| 2 | 53 tasks, four domains | **True**: 6 airline_plus + 6 retail_plus + 6 telecom + 35 banking_knowledge (MANIFEST.md, parsed, assert) | A |
| 2 | "of evaluation simulations" | **Needs care.** The board number is the mean over the 53 tasks of each task's final reward (pass rate, minus a credit-overage penalty, times a latency gate); the secondary summary says "simulations". It is not a pooled simulation count (section 2.4) | A / B |
| 2 | the per-task x configuration matrix | **Does not exist in the data.** One sampled build per task, builders mixed. What exists is a scenario x build grid (section 2.3), better for a film | A |
| 3 | about 54 % of outcome variance from repeating one configuration | In the paper's listing text; **not recomputable**: the clone holds no trajectories (they are on Hugging Face, blocked) | B |
| 3 | 18,000+ trajectories | Grid specs design **18,240** runs (full + oracle-full), 18,260 with smoke grids; designed, not confirmed completed | A (design) |
| 3 | information beats time budget and model size, and improves calibration and cost | In the paper's listing text; axes confirmed in the code | B |
| 1 | 15 models | **Conflict.** arXiv abstract and Princeton write-up: 14. ICML listing and dashboard pages: 15 ("rank #1 of 15 agents") | B |
| 1 | accuracy slope about 0.23/yr, reliability about 0.03/yr | **Not found** in any snippet (five searches). Do not put on screen | C |
| 1 | 12 metrics, four dimensions | **True** (names in section 1.3) | B |
| 4 | 22 benchmarks; 0.935-0.994 vs 0.148-0.841; about 0.097 | Matches the blog summary of the paper | B |
| 4 | pooling lifts 0.44 to 0.75 | **Not found** in the one source read | C |
| 5 | 2,611 interviews; 0.79 SD; +0.53 SD; about 10 %/month | Matches the abstract text returned | B |

---------------------------------------------------------------------------------------------------------------------------------

## 1. Paper 1 · Towards a Science of AI Agent Reliability (arXiv 2602.16666, ICML 2026)

Authors Rabanser, Kapoor, Kirgis, Liu, Utpala, Narayanan (Princeton). Submitted 2026-02-18, v2 2026-02-23, PMLR vol 306.

### 1.1 Claims and snippets

| Claim | Snippet (as returned) | Grade |
|---|---|---|
| Venue, authors | "submitted to arXiv on 18 February 2026 ... published at ICML 2026, in PMLR volume 306" | B |
| Accuracy hides operational problems | "single-number accuracy hides operational problems ... ignores whether agents behave consistently across runs, withstand perturbations, fail predictably, or have bounded error severity" | B |
| Twelve metrics, four dimensions | "twelve metrics that decompose agent reliability along four key dimensions: consistency, robustness, predictability, and safety" | B |
| Models | arXiv: "14 models"; ICML listing and dashboard: 15; "the dashboard says it evaluates 15 agents across 2 benchmarks" (a landing page snippet also said 14) | B, conflict |
| Benchmarks and design | "GAIA and TauBench. Each task was run five times, with instructions paraphrased"; "injected tool and environment faults, and elicited the agents' confidence" | B |
| Headline | "recent capability gains have produced only small reliability improvements"; "despite 18 months of significant accuracy improvements, overall reliability shows only modest progress, particularly on open-ended tasks like GAIA" | B |
| Outcome consistency low | "Outcome consistency scores ranged from about 30% to 75% across models" (paper-note summary) | B |
| Resource consistency low | dashboard: "resource consistency is similarly low, with high variance in token and compute usage across runs" | B |
| Weak points | "consistency and predictability are the biggest gaps" | B |
| Robustness | "fault robustness and structural robustness show ceiling effects across most models, while prompt robustness remains a key differentiator" | B |
| Overall index | "arithmetic mean of three dimension scores"; "safety is reported separately and not included in the overall aggregate" (dashboard methodology) | B |
| Calibration improves more than discrimination | **not seen** in any snippet; only "calibration checks whether stated confidence matches observed success rates. Discrimination checks whether confidence scores separate successes from failures" | C |
| Safety gains, persistent high-severity failures | **not seen** | C |
| Slopes 0.23 and 0.03 per year | **not seen** ("I could not find a per-year rate that compares reliability gains with accuracy gains") | C |

### 1.2 The dashboard's numbers that snippets carry (GAIA; hal.cs.princeton.edu/reliability)

Nine models have both accuracy and overall reliability; twelve have some consistency values. Snapshots drift (Opus 4.5 is 0.85
in one result and 0.87 in another; Gemini 3.5 Flash 0.84 and 0.85): a film must say "snapshot read 2026-10-11" and use one set.
File: `factory/topics/reliability-data/princeton-dashboard.json`.

| Model | GAIA accuracy % | Overall reliability | Rank of 15 | Outcome | Traj-dist | Traj-seq | Resource |
|---|---|---|---|---|---|---|---|
| Claude Opus 4.5 | 68.5 | 0.85 | 1 | 0.838 | 0.886 | 0.752 | 0.774 |
| Claude Opus 4.7 | 73.3 | 0.84 | 2 | 0.844 | 0.865 | 0.742 | 0.772 |
| Gemini 3.5 Flash | 79.2 | 0.84 | 3 | | | | |
| Gemini 3.1 Pro | 76.2 | 0.82 | 4 | 0.828 | 0.811 | 0.608 | 0.731 |
| Claude Sonnet 4 | 54.7 | 0.82 | 6 | 0.763 | 0.872 | 0.749 | 0.759 |
| GPT-5.5 | 62.8 | 0.79 | 8 | 0.599 | 0.705 | 0.527 | 0.607 |
| GPT-4o Mini | 26.3 | 0.76 | 10 | (cons 0.73, pred 0.58, rob 0.97) | | | |
| GPT-5.2 (medium) | 31.8 | 0.72 | 14 | 0.655 | 0.742 | 0.555 | 0.562 |
| Claude 3 Haiku | 12.9 | 0.69 | 15 | | | | |
| Gemini 2.5 Pro | 52.5 | | | 0.731 | 0.865 | 0.711 | 0.654 |
| Gemini 2.5 Flash | 46.7 | | | 0.731 | 0.823 | 0.642 | 0.644 |
| GPT-5.2 | 33.2 | | | 0.583 | 0.766 | 0.539 | 0.542 |

Recomputed from those inputs (recompute.py section 5; the inputs are grade B, the arithmetic is exact):
accuracy spans 12.9 to 79.2 (x6.1, +66.3 points); overall reliability spans 0.69 to 0.85 (x1.23, +0.16). Highest accuracy on a
ranked page (Gemini 3.5 Flash, 79.2) is reliability rank 3. Spearman(accuracy, reliability) = +0.81 over 9 models: the two do
move together across models, so the film's thesis is **how little** reliability moves (range 0.16 on a 0-1 scale while accuracy
moves 0.66), never "they are unrelated". Gemini 3.1 Pro has the second-best accuracy of the nine yet the lowest trajectory-sequence
consistency of the Claude/Gemini set (0.608); the GPT-5.x rows sit lowest on every consistency column (0.53-0.77).

### 1.3 The twelve metrics (names)

Consistency (4): outcome C_out, trajectory-distribution (JSD), trajectory-sequence (Levenshtein), resource C_res.
Robustness (3): fault, environment, prompt (perturbed accuracy over baseline, capped at 1).
Predictability (3): calibration (ECE), discrimination (AUROC), Brier.
Safety (2): compliance, harm severity (LLM judge). Overall = mean(consistency, robustness, predictability); safety separate.
The repeat-run design is 5 runs per task, the same as the pass-every-time cubes. Sources: dashboard methodology snippet, paper-note
summary; individual formulas not seen (grade B for names, C for formulas).

### 1.4 What the film can and cannot use

Can: the 9-12 model snapshot above; the four consistency columns; the 12 metric names; "5 runs per task". Cannot: the two slopes,
the 15-model per-year trend, any tau-bench per-model row, any safety value. Release dates are not in the snippets, so a
"per year" axis would need an outside, graded source for each model's release month.

---------------------------------------------------------------------------------------------------------------------------------

## 2. Paper 2 · tau-tau-bench / Hyper-tau-bench (Shi, Dhandhania, Narasimhan, Barres; arXiv 2609.04611, 2026-09-04)

### 2.1 Claims and snippets

| Claim | Snippet | Grade |
|---|---|---|
| Task | "The benchmark gives a developer agent business records, a client's requirements, a production API, an inherited codebase, and limits on serving cost and models ... scored by running it against held-out simulated users" | B |
| 53 tasks, four domains | "53 tasks across four domains" | B, and A from MANIFEST.md |
| Headline | "Claude Opus 5 under Claude Code, passes just 23.9% of evaluation simulations, while an expert-authored reference scores 82.2%" | B, and A from the clone |
| Domain spread | "Banking was the weakest at 5.9%, against 72.8% on retail" | B, and A (table 2.2) |
| Shallow queries | "searched the corpus by keyword rather than reading it deeply. On banking, they opened fewer than 80 of roughly 1,700 files" | B (not recomputed; the kit corpus is an unreadable index in the clone) |
| Little client communication | "Clarifying questions were asked in only 0.3% of tool calls, and builds with zero questions scored about 5% on tasks where the reference scored 95-100%" | B; the 0.3 % is A (2.3) |
| First design that runs | "models try too few architectures and serving-cost options, and ship the first design that works" | B |
| Runner-up | "GPT-5.6 Sol in Codex scored 22%" | B, and A |
| Limits | "client and user simulators are single LLMs with fixed requirements ... evaluation ends at submission"; a commentary: user simulator and rubric judges "lack human calibration" | B |

### 2.2 Leaderboard recomputed (A; `hyper-tau-summary.json`)

The clone's `hyper-submissions/*/submission.json` and `reference.json`. The board's overall equals the task-weighted mean of the
four domain means with weights 6:6:6:35 (assert within 0.06 for all six; the expert row recomputes to 82.14 against the printed
82.2, a 0.06 rounding in the source rows).

| Configuration (builder) | Overall | Airline | Retail | Telecom | Banking | Build min | Build USD | Points / USD |
|---|---|---|---|---|---|---|---|---|
| Claude Code + Claude Opus 5 | **23.9** | 55.9 | 72.8 | 48.2 | 5.9 | 216.3 | 42.0 | 0.57 |
| Codex + GPT-5.6-sol | 22.0 | 49.8 | 59.2 | 32.9 | **9.0** | 47.9 | 18.2 | 1.21 |
| Codex + GPT-5.6-terra | 18.0 | 44.5 | 46.6 | 27.2 | 6.9 | 30.0 | 7.0 | 2.57 |
| OpenCode + Kimi K3 | 17.9 | 43.8 | 52.1 | 27.6 | 6.0 | 360.3 | 15.1 | 1.19 |
| Kimi Code + Kimi K3 | 16.1 | 42.3 | 49.1 | 24.9 | 4.4 | 205.7 | 13.5 | 1.19 |
| Claude Code + Claude Sonnet 5 | 14.9 | 41.9 | 50.2 | 21.1 | 3.2 | 235.5 | 30.0 | 0.50 |
| **Expert human** ("one who knows this benchmark's ins and outs unusually well") | **82.2** | 82.3 | 84.0 | 93.8 | 79.8 | | | |

Task counts per domain: 6, 6, 6, 35. Ceiling ratio 82.2 / 23.9 = 3.44; gap 58.3 points; best is 29.1 % of the expert.
Best-of-six against the expert, per domain: airline 55.9 vs 82.3 (gap 26.4), retail 72.8 vs 84.0 (11.2), telecom 48.2 vs 93.8 (45.6),
banking 9.0 vs 79.8 (**70.8**). The best overall builder (Opus 5) is not best in banking (Codex sol, 9.0). Costliest is not best per
dollar: Opus 5 is $42 and 216 min for 23.9; terra is $7 and 30 min for 18.0. Serve-credit ratio (fraction of the serving budget
used) runs 0.38 to 0.76 for builders against 0.96 for the expert.

### 2.3 The real grid: 3,365 simulations in 53 builds (A; `hyper-tau-matrix.json`, `hyper-tau-builds.json`)

`web/leaderboard/public/build-trajectories/rel001..053.json`: one sampled build per release task ("mixed across the six developer
configurations"), each with the 0/1 reward of every evaluation simulation (`eval_tasks`; every reward is exactly 0 or 1, assert).
The six airline builds all faced the same 67 scenarios, the six retail the same 134, the six telecom the same 119; banking falls
into nine scenario sets of 3-5 builds (140 distinct scenarios). So each scenario in the first three domains has a column of
six different builds. Caveat that must be on screen: the six builds differ in builder **and** task variant (evidence pack,
defects, tier); this is agreement across builds, not repeats of one build. There are no repeats of any build.

| Domain | Scenarios | Builds each | Cells | Lit (passed) | Solved by none | (if builds were independent) | Solved by all | (if independent) | Solved by any |
|---|---|---|---|---|---|---|---|---|---|
| airline_plus | 67 | 6 | 402 | 206 (51.2 %) | 7 | 0.8 | 11 | 1.0 | 60 |
| retail_plus | 134 | 6 | 804 | 507 (63.1 %) | 4 | 0.2 | 25 | 7.2 | 130 |
| telecom | 119 | 6 | 714 | 255 (35.7 %) | 33 | 7.9 | 7 | 0.2 | 86 |
| three shared domains | **320** | | **1,920** | **968** | **44** | **8.9** | **43** | **8.4** | |
| banking (nine sets) | 373 scenario-slots (140 distinct) | 3-5 | 1,445 | 95 (6.6 %) | 312 | 287.9 | 2 | 0.1 | 61 |
| all | | | 3,365 | 1,063 (31.6 %) | | | | | |

"If independent" = the Poisson-binomial expectation given each build's own pass rate. The shape that matters: histogram of
lit builds out of six, airline [7, 11, 10, 11, 9, 8, 11], retail [4, 9, 15, 25, 37, 19, 25], telecom [33, 22, 21, 9, 13, 14, 7]
(k = 0..6). Observed "none" and "all" are 5 times the independent expectation (44 vs 8.9; 43 vs 8.4): **the cases are hard or
easy for every builder alike**, which is the film's finding. Telecom, by issue type (119 scenarios, six builds): mms_issue 49
scenarios pass 11.6 %, mobile_data_issue 38 pass 39.9 %, service_issue 32 pass 67.7 %. Persona (Easy/Hard/None) does not matter
(31.7 / 36.0 / 39.4 %).

### 2.4 What "23.9 %" is, and the sample of 53 (A)

Reward = max(0, pass rate - credit overage) x latency gate (`src/tau2/hyper/sandbox/orchestrator.py`, `performance.py`). In the
sample, 7 of 53 builds end below their simulation pass rate; 6 of them end at exactly 0 though 70 simulations passed (slots 018,
022, 028, 029, 035, 049). The sampled builds (mixed configurations) average 20.1 % final, 21.8 % mean simulation rate, 31.6 %
pooled simulations: pooling simulations gives banking 43 % of the weight (1,445 of 3,365) instead of its 66 % task share (35 of 53), so the film says "23.9 out of 100 on average
over 53 builds", never "23.9 % of all simulations". By domain, mean final: airline 50.2, retail 63.1, telecom 28.4, banking 6.1;
nine of the 35 sampled banking builds pass zero simulations.

### 2.5 Behaviour (A; section 3 of recompute.py)

43 messages from builders to the simulated Client in 15,885 logged tool calls = **0.27 %** (the paper's 0.3 % reproduced, grade A).
Of the 25 sampled builds whose task has a Client, 23 asked at least once (1.9 questions each); two asked nothing. The "zero questions
scores 5 %" claim cannot be tested with n = 2; asking is not what separates builds in this sample (Spearman of questions with pass
rate in banking = -0.03, n = 35). More steps did not help: Spearman(steps, pass rate) = -0.28 in banking (n = 35); mean steps per
build ran 269 (OpenCode Kimi) to 1,266 (Claude Code Sonnet 5). Do not claim a causal driver from this.

### 2.6 Files (each < 60 KB, JSON, regenerated by recompute.py)

| File | Bytes | Contents |
|---|---|---|
| `hyper-tau-summary.json` | 5,275 | six configs x four domains, expert row, domain gaps, roll-ups, telecom facets, client counts, reward definition |
| `hyper-tau-builds.json` | 22,436 | 53 builds: slot, domain, builder, steps, calls, client questions, local tests, passed / total, final, flags |
| `hyper-tau-matrix.json` | 23,033 | 12 scenario groups: pass-bit rows (one char per build), build ids, k-histograms, independent expectation, telecom facets |

---------------------------------------------------------------------------------------------------------------------------------

## 3. Paper 3 · Agents Are Systems, Not Models (arXiv 2610.01618, 2026-10)

### 3.1 Claims and snippets

| Claim | Snippet | Grade |
|---|---|---|
| Five axes | "task information, reasoning, self-verification, time budget, and backbone model" | B, and A (axes.py) |
| Repeat variance | "Repeating the same configuration accounts for about 54% of the outcome variance, so run-to-run variability is substantial" | B |
| Information dominates | "Across configurations, the information given to the agent has the largest effect, larger than time budget or model size, and it also lowers cost and improves calibration" | B |
| Time needs something to use | "extra time only helps when the agent has enough information or a capable enough model to use it" | B |
| Trajectories | repo README: "agent trajectories ... on Hugging Face: lusxvr/agentic-science-trajectories"; 18,000+ not in any snippet | A (README), C (count) |

### 3.2 What the clone holds (A) and does not (A)

It holds code, grids, anchors and answer keys. It holds **no run directories, no `score.json`, no trajectories, no analysis output**
(226 files; the only data are four `solution.csv`). The 54 % and every effect size are therefore not recomputable here. The
trajectories sit at the Hugging Face URL above; egress blocks it (a direct fetch was refused by the sandbox classifier and not
retried). If a later lane can mount that dataset, `icc_oneway()` and `c_out()` in recompute.py already implement the paper's
section 9-10 formulas (self-check on a toy table with a hand-computed answer, assert).

Recomputed from the clone (`rethinking-design.json`):
- Design: 4 information levels (none < identity < interface < protocol, cumulative) x 3 harness x 4 verification x 3 budgets (300,
  600, 1200 s) = **144 cells** per model tier, **5 replicates** = **720 runs** per task per tier; 4 tasks.
- Designed runs: full-small 2,880, full-medium 2,880, full-large 2,880, full-claude-sonnet-5 2,880, full-step37 1,920 (no act-only),
  oracle-full-medium 2,880, oracle-full-step37 1,920: **18,240** (18,260 with the four 5-run smoke grids). Matches "18,000+".
- Anchors per task (REFERENCE = the specialist model operated correctly; BACKBONE = the backbone alone; MARGIN = noise threshold):
  redshift R2 0.7534 vs -2.7011 (gap_positive, margin 0.25, 20 test rows); promoter MCC 0.7460 vs -0.0298 (positive, 0.10, 613 rows);
  RNA folding F1 0.7350 vs 0.0000 (positive, 0.10, 300 rows); astronomy MMLU accuracy 0.6711 vs 0.9671 (**gap_negative**: the
  specialist is worse, 152 rows). Row counts match the answer keys (assert).
- Formulas: gap_closed = (score - BACKBONE) / (REFERENCE - BACKBONE); calibration error = expected - score (positive = overconfident);
  outcome consistency C_out = mean of (2p - 1)^2 over cells; noise floor ICC = between / (between + MS_within), one-way, unbalanced.
- Information snippets (redshift): identity names the model; interface shows how to load it; protocol gives the recipe (a
  126,907-galaxy pre-embedded catalog, required preprocessing, k-NN with 64 neighbours).
- List prices in axes.py (USD per 1M tokens, in / out): Qwen 35B 0.25/2.00, 122B 0.40/3.20, 397B 0.60/3.60, Step 0.20/1.15, Sonnet 5 2.00/10.00.

A film from this paper may show the design (144 cells x 5 = 720) and the paper's 54 % as a sourced claim, but must not animate
outcomes. See film 3.

---------------------------------------------------------------------------------------------------------------------------------

## 4. Paper 4 · Agent Evaluation Reliability: More Tasks Won't (Always) Fix a Leaderboard (arXiv 2610.00651)

Source: one blog post (redreamality.com, 2026-10-03), reading the preprint of 2026-09-30. Authors Hardy, Azam, Reuel, Kochenderfer,
Koyejo. The blog says its numbers were "not checked against the arXiv PDF".

| Claim | Snippet | Grade |
|---|---|---|
| Method | "Bayesian variance-decomposition framework from Generalizability theory ... 22 benchmarks from the Holistic Agent Leaderboard (HAL) and the Harbor Index" | B |
| Systems rank reliably | "Fixed model-scaffold systems rank reliably, at E-rho-squared = 0.935-0.994" | B |
| Models do not | "Ranking reliability for underlying models is much lower, at 0.148-0.841" | B |
| More tasks cap | "Even infinitely many similar tasks raise model-ranking reliability by at most about 0.097 when scaffold variation dominates" | B |
| Central claim | "reliability is claim-dependent: an evaluation that reliably ranks deployed systems may not reliably rank underlying models or produce reliable absolute scores" | B |
| Pooling 0.44 to 0.75 | not found in the post's excerpt | C |
| Related | arXiv 2608.11323: "the agent's main effect explains less than 3% of variance across three benchmarks", agent-by-task 7-23 % | B (not asked for) |

Use: a beat inside film 2 or film 3 (the same model, a different scaffold, a different rank), never a film of its own: no open data.

## 5. Paper 5 · Reliability of AI Agents: Rater Effects, Drift, and the Return to an Evaluation Program (Zhang, Esposito; arXiv 2610.07003)

| Claim | Snippet | Grade |
|---|---|---|
| Data | "2,611 rubric-scored production interviews from a deployed voice-and-video interviewing agent, overlapping human reviewers, the agent's change log, and support tickets ... March through August 2026 across 14 batches, using a nine-family rubric" | B |
| Rater effect | "Two reviewers assessing the same batches differed by 0.79 standard deviations on the composite index, and a shift in reviewer composition flattened the raw trend" | B |
| Adjusted trend | "After adjusting for reviewer effects and smoothing batch-level estimates, evaluated reliability increased by 0.53 standard deviations from March to August 2026" | B |
| Deploys | "reliability also shifted materially across logged deploys ... forecast uncertainty reaches the magnitude of the largest observed deploy contrast after about five weeks" (imprecise, few step changes) | B |
| Tickets | "interview-related support tickets fell by about 10% per month relative to technical-issue tickets" | B |
| Caveat | "these data do not identify a causal effect of evaluation on performance" | B |

Use: the MONDAY beat of any film (a second measurer changes the reading: 0.79 SD between two reviewers is larger than the 0.53 SD
trend). No open data; do not make a film.

---------------------------------------------------------------------------------------------------------------------------------

## 6. Ranked films (house style: feature-long 153 s, HOOK 0-12 / CASE 12-60 / COUNT 60-135 / MONDAY 135-150; laws unchanged)

### Film 1 (make first) · "The Builder" (paper 2) · slug `build-the-agent`

- **Thesis:** The best agent-builder gets 24 of 100 on average and the expert 82, and the cases it fails are the cases every builder fails.
- **Counted objects:** tile = one customer scenario (320 tiles on three plates: airline 67, retail 134, telecom 119); cube = one
  build's try at that tile (a column of six, 1,920 cubes); light = that cube passed (968 lit); banking is a fourth plate of 35
  task-tiles (1,445 cubes, 95 lit, 9 builds with no light). The expert is a plane, not a cube: 82.2.
- **Three 3-D moves:** (1) **Sort**: tiles slide into a staircase by number of lit cubes (0 to 6), showing 44 dark columns and 43
  fully lit against 8.9 and 8.4 expected from luck. (2) **Cut plane**: a plane at "six of six" slices the field (43 of 320), then the
  expert plane rises from 23.9 to 82.2 through the four domain plates, banking 5.9 against 79.8 last. (3) **Re-stack**: cubes regroup
  by builder (six stacks, heights 14.9 to 23.9) and then by telecom issue type, where mms_issue is 11.6 % and service_issue 67.7 %,
  showing the difficulty lives in the case, not the builder.
- **Beats:** MONDAY = ask the client (0.27 % of calls were questions) and test on cases, not on the first design that runs.
- **Honest-limits line:** "One sampled build per task, builders mixed: columns are different builds, not repeats; 23.9 is a mean over 53 tasks scored by simulated customers and an LLM judge."
- Data ready: summary, builds, matrix JSON (section 2.6). Gate risk: the screen must never say "23.9 % of simulations".

### Film 2 · "Smarter, Not Steadier" (paper 1, sequel to pass-every-time) · slug `accuracy-climbed`

- **Thesis:** Across the models on the dashboard, accuracy rose six-fold but the reliability index moved 0.16 on a scale of one.
- **Counted objects:** tile = a model on GAIA (9 with both numbers, up to 12 with consistency, snapshot 2026-10-11); two columns
  per tile: height of the first = accuracy, height of the second = overall reliability; cube = one of the four consistency
  readings (outcome, trajectory-distribution, trajectory-sequence, resource) on the tile; light = reading at or above 0.80.
- **Three 3-D moves:** (1) **Sort by accuracy** (12.9 to 79.2): the accuracy columns climb a ramp while the reliability columns stay a
  low shelf (0.69 to 0.85). (2) **Cut plane** at reliability 0.80 and at consistency 0.80: GPT-5.x tiles drop through it (0.53-0.77),
  the two Opus tiles stand above (0.74-0.89 on all four readings). (3) **Re-stack by reliability**: the order flips (Gemini 3.5 Flash, top accuracy, is rank 3; Opus 4.5, 68.5,
  is rank 1); a closing beat can borrow paper 4 (same model, different scaffold, different rank) as a sourced claim.
- **MONDAY:** run it five times (the paper's design) before you believe a score; a second reviewer shifts the reading by 0.79 SD (paper 5, grade B).
- **Honest-limits line:** "A snapshot of a live dashboard read through search text on 2026-10-11, GAIA only; models range 14-15 by source; the slopes of the paper are not shown."
- Data ready: `princeton-dashboard.json`. Blocked items: no slopes, no tau-bench rows, no safety values. Lower than film 1 because it is
  grade B throughout and has no per-run data to light; it should not ship if the dashboard cannot be re-read once to freeze one snapshot.

### Film 3 (conditional) · "Same Setup, Different Answer" (paper 3) · slug `same-setup`

- **Thesis:** Run the identical agent setup again and about half of the difference in outcome is chance, so what you tell the agent matters more than how long it works or how big it is.
- **Counted objects:** tile = a configuration cell (144 per task per model tier: information x harness x verification x budget);
  cube = a replicate (5 per cell, 720 per task per tier); light = the run beat the trivial baseline by more than MARGIN. Plus four
  anchor planes per task (TRIVIAL, BACKBONE, REFERENCE).
- **Three 3-D moves:** (1) **Cloud**: the 5 cubes of a cell scatter vertically by score, the width of the cloud being the 54 %.
  (2) **Re-stack by information level** (none, identity, interface, protocol): the clouds climb the ladder faster than they rise with
  budget (300 to 1200 s) or model size. (3) **Cut plane** at REFERENCE: how many clouds clear the specialist's score; the
  astronomy task reverses it (the specialist at 0.6711 is below the backbone at 0.9671).
- **Honest-limits line:** "Only the paper's reported 54 % and the experiment's design are measured here; no run is drawn, and the effects come from one summary of one paper."
- **Blocker:** with the clone alone no cube may be lit (no outcomes). Ship only after a lane mounts
  `lusxvr/agentic-science-trajectories` and extends recompute.py to recompute the 54 %, the axis effect sizes, calibration error and
  cost; until then it is a design explainer at best. If the data arrive, it overtakes film 2 on novelty (replicates, the
  strongest "same setup, different answer" picture of the wave).

### Beats, not films
Paper 4 (leaderboard reliability) and paper 5 (rater drift) have no open data; use as one sourced beat each (grade B).

---------------------------------------------------------------------------------------------------------------------------------

## 7. Open items for the next lane

1. Re-read the Princeton dashboard once (a lane with egress) and freeze one snapshot: resolve 14 versus 15, and find the 12-metric values for all models and the tau-bench rows.
2. Mount the Hugging Face trajectories for paper 3; extend recompute.py (section 4) with the ANOVA, calibration and cost tables.
3. Read the primary PDFs of papers 2, 4 and 5 for the exact definitions behind each snippet (especially "evaluation simulations" in paper 2).
4. Decide whether film 1 draws the banking plate as 35 task tiles (95 lit of 1,445) or leaves it as a single bar; it is 66 % of the task weight (35 of 53) and dominates the 23.9.
