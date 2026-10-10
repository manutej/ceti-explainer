# Pass every time · film id `pass-every-time` · brief (Wave AI-STORIES, lane 2 of 3)

## Subject
kind: concept with real fixtures · name: agent reliability, one try versus every try · source material: tau-bench (Yao et al. 2024) and its published retail trajectories; METR note 2026-03-10; METR time-horizon measurement of Claude Opus 4.5 (Dec 2025). Research: factory/research/AI-ADOPTION-2026.md §3, §9. Sources, grades and what could be opened: sources.md.

## Audience
manager; a room that buys or approves AI agents and reads vendor benchmark scores.

## Format and look
feature-long, 153 s (150 + 3 s card), level manager, renderer webgl, chrome none, material ink, brand midnight-ink as a film-local copy of factory/films/wiring-and-the-whole/brand.midnight-ink.json (copy in data/). Commit: none (D11). Chain: gl-instances, gl-camera-rig, gl-volume, gl-labels. Windows HOOK 0–12 · CASE 12–60 · COUNT 60–135 · MONDAY 135–150.

## The belief
"An agent that gets it right 60 % of the time does 60 % of the work." (Said in the film without a digit: "usually right does most of the work".)

## The reversal (two pictures)
Belief picture: a field of tries about 60 % lit, so each task is about 60 % done. After the count: turn the field and each task is a column of four tries; only 44 of 115 columns are lit all the way (38.3 %), 22 never light; a model that extends the same tasks to eight tries leaves about 30 % fully lit, and the paper's own eight-try run says under 25 %. Second reversal: of 296 PRs that pass the benchmark's tests, about half would not be merged. Third: at the 80 % reliability bar the horizon is 27 minutes, against 4 h 49 min at 50 %: more than 10 times shorter.

## Fixture
tau-bench, retail domain, GPT-4o with function calling, 2024: 115 tasks, 4 published trials per task (460 tries, 278 passed). Per-task outcomes ARE published (historical_trajectories/gpt-4o-retail.json), so attempts 1 to 4 are measured data, not a simulation; recomputed pass^1..4 = 60.4 / 49.1 / 43.0 / 38.3 exactly. Second fixture: METR, 296 SWE-bench-passing PRs, 4 maintainers. Third: METR horizon of Claude Opus 4.5 (50 %: 4 h 49 min; 80 %: 27 min).

## Count (units; the first lands before any ratio)
1. "one tile is one task": 115 tasks, lands 21.0 s (count.at).
2. "one cube is one try": 115 × 4 = 460 measured tries (278 lit), lands 28.5 s; extended to 8 per task (920 cubes) in COUNT with the 460 added cubes drawn as MODEL.
3. "one cube is one PR": 296, lands 105.0 s.
4. "one cube is one minute": 27 and 289, lands 124.0 / 129.5 s.
Ratios after counts: 60.4 % (36.5 s), 38.3 % (79.5), 31 % model (94.5), about half (118), about 10x (132).

## Mechanism
A pass rate is an average over tries; "every time" is a property of each task. Tasks are not alike: the per-task chance of passing is spread out (22 tasks never pass, 44 always do in four tries), so the share that passes all k tries falls with k and flattens. Turning the field from plan to side re-stacks the same cubes by task, so "60 % lit" becomes "which columns are lit all the way". A benchmark pass is a test result, not a merge decision: reviewers add readability and fit. The horizon gap is the same idea on length: success at 50 % hides how short a task must be before success is reliable.

## Monday
question: "How often does it pass when it has to pass every time, and who checks the merge?"
honest limit (exactly one, on stage): "One 2024 model, and agents that could not revise: newer ones may do better."

## Commit
none (D11).

## Takeaway (card, ≤ 60 chars)
A pass is not a pass every time.

## Cost
not asked.

## Findings (the lane could not fill these as the caller wrote them; decide before drafting)
F1. **Per-task outcomes exist, for 4 trials, not 8.** The caller's fallback (fit a beta, sample) is used only for tries 5 to 8. recompute.py reproduces 60.4 / 49.1 / 43.0 / 38.3 from the data exactly and from a Beta(0.576, 0.375) fit within 0.3 points.
F2. **The beta model does not reach the paper's "under 25 % at eight".** Fitted to pass^1..4 it gives 30.2 % (analytic), 31.3 % (seed 20261010: 36 of 115 columns; 1000-seed range 24 to 42). No two-parameter beta can hold pass^1..4 within 1 point and reach under 25 % at k = 8 (best compromise misses the early points by 1.9). So the repo's 4-trial file (what the leaderboard uses) and the paper's 8-trial figure are not the same run, or the per-task chance is not beta. The film shows both, each owned: "Model: 31 %" and "The paper's own 8-try run: under 25 %". The reversal "under a quarter at eight" therefore rests on the paper's sentence (grade B: abstract read through search results; the PDF is blocked), not on the cubes. If you prefer one number, drop the model readout (92.0 to 97.0 s) and keep the cubes and the paper line.
F3. **Grades.** The research file graded the tau-bench and METR numbers A; this lane could open only GitHub (README, trajectories, tasks_test.py), so 115, 4 trials, 278 of 460, 44 of 115, 60.4 / 49.1 / 43.0 / 38.3 are A (recomputed). The paper abstract's 61 % and "~25 % at pass^8", the METR note (296, 4 maintainers, about half), the horizon (4 h 49 min, 27 min) and 80.9 % are B (several outlets quoting the primary; primaries blocked by egress: arxiv.org, metr.org, vals.ai, anthropic.com all refused). Nothing C is on screen. The research file's LessWrong link for the horizon was not needed; METR's own post as reported by Techmeme and The Decoder is cited instead.
F4. **Three different agents.** tau-bench is GPT-4o (2024); the 80.9 % and the horizon are Claude Opus 4.5 (late 2025); the 296 PRs come from agents of mid-2024 to late 2025. Captions never say "the same agent" across fixtures.
F5. "About half" is METR's noise-adjusted estimate; the merge split is drawn as two equal blocks and carries no digit. The raw unadjusted share is not on screen. METR's average gap of about 24 points between grader score and maintainer decision is not used.
F6. Horizon uncertainty: the 50 % horizon has a 95 % CI of 1 h 49 min to 20 h 25 min (14 samples at the long end), so the ratio is shown as "about 10x" (289 / 27 = 10.7, rounded to the nearest ten), never 10.7.

## Sources (≥ 3)
S1 tau-bench README leaderboard · S2 tau-bench historical trajectories gpt-4o-retail.json · S3 Yao et al. 2024 arXiv 2406.12045 · S4 METR note 2026-03-10 · S5 METR Opus 4.5 time horizon, Dec 2025 · S6 Anthropic Claude Opus 4.5 announcement, 2025-11-24 · S7 recompute.py. URLs and grades in claims.json and sources.md.

## Not this
- A line chart of pass^k with the cubes as decoration: the field is the argument, the curve is at most a readout.
- "Agents are bad": the film is about the metric (one try, a test pass, a 50 % bar), not about capability; newer agents may do better.
- Showing the model's eight-try count as data: it is tagged MODEL wherever it appears.
- Putting "60 %" in HOOK or asking the viewer to guess (commit is off, D11).
- Mixing fixtures into one agent; fusing 80.9 % and the 296 PRs into one population.

## Director's choices (2026-10-10)
- On stage: only the measured four tries (per-task data, grade A): 115 tasks, 460 tries, 44 of 115 columns fully lit = 38.3 %.
  The seeded beta extension to eight tries is NOT drawn (it disagrees with the paper's own eight-try figure); drafters skip
  the 92–97 s model readout. The paper's "under 25 % at eight tries" appears once, as a caption with its source (grade B).
- The 296-PR merge filter and the 27 min vs 4 h 49 min horizon stay as the second and third counts (grade B, captioned with
  their sources).
