# The Builder · film id `build-the-agent` · brief (Wave RELIABILITY, film 1 of the wave)

## Subject
kind: concept with a real fixture · name: agent construction, "the best builder makes the best agent" · source material: Hyper-tau-Bench (tau^tau-bench; Shi, Dhandhania, Narasimhan, Barres, Sierra, arXiv 2609.04611, 2026-09-04) and its open data (github.com/sierra-research/hyper-tau-bench at 6e9f34c, cloned at /home/user/data/hyper-tau-bench). Research: factory/research/AGENT-RELIABILITY-2026.md sections 2 and 6 (Film 1; the thesis, objects, moves, Monday and honest line are the director's choices). Data: factory/topics/reliability-data/ (copied into data/, recompute.py reads the copies). Sources, grades and what was opened: sources.md.

## Audience
manager: a room that buys or approves AI coding agents to build customer-service agents, and reads leaderboard scores to pick the builder.

## Format and look
feature-long, 153 s (150 + 3 s CETI card), level manager, renderer webgl, brand **ceti-neosage-dark**, chrome **none**, material **hero**, beat **0.5**, Wave WOW craft (motion-curves, text-reveal, gl-look, accumulation export, declared cuts: planned none, four carried joins). Commit: none (D11). Chain: gl-instances, gl-camera-rig, gl-volume, gl-labels. Windows HOOK 0-12 · CASE 12-60 · COUNT 60-135 · MONDAY 135-150. Register to match: factory/films/pass-every-time/ (film.json, REVISION-wow2.md).

## The belief
"Give the job to the best model and you get the best agent." (Said in the film without a digit: "The best builder makes the best agent.")

## The reversal (two pictures)
Belief picture: the builder is what varies, so the six builds of one customer case would win and lose in a scatter, and the best builder's score would be near the ceiling a good builder can reach. After the count: of 320 customer cases tried by six builds each, 44 were solved by none and 43 by all six, against 8.8 and 8.4 if the wins were scattered by luck (a 5-times excess at both ends): the cases are hard or easy for every builder alike. In telecom the six builds range from 26.1 % to 52.1 % of cases, while the three kinds of problem range from 11.6 % to 67.7 %. And the ceiling is not the cases: an expert human scores 82.2 on the board against the best builder's 23.9, with banking (35 of the 53 tasks) at 79.8 against 5.9. Second reversal, the Monday: the builders sent 43 messages to the simulated client in 15,885 tool calls (0.27 %).

## Fixture
Hyper-tau-Bench: a coding agent (the Developer) is given a client's business records, requirements, an API and a codebase, and must build a customer-service agent; the agent is then run against held-out simulated customers. 53 tasks in four domains (airline_plus 6, retail_plus 6, telecom 6, banking_knowledge 35). Six developer configurations on the board (best: Claude Code with Claude Opus 5, 23.9; runner-up 22.0; last 14.9) and an expert-authored reference at 82.2. The open data holds ONE sampled build per task (builders mixed) with the 0/1 result of every evaluation simulation: for the first three domains the six builds of a domain all faced the same scenarios (67, 134, 119), which gives 320 scenarios x 6 builds = 1,920 tries; 968 passed. Nothing is simulated or modelled by this film: every cube is a recorded result.

## Count (units; the first lands before any ratio)
1. "one tile is one customer scenario": 320 (67 + 134 + 119), counts in 12.5 to 17.0 s, pin 17.0.
2. "one cube is one build's try": 320 x 6 = 1,920, pin 24.0; 968 lit, pin 31.5. First ratio: 50.4 % at 34.5 s.
3. "one tile is one benchmark task": 53 (6 + 6 + 6 + 35), pin 110.0; then the planes 23.9 (115.0) and 82.2 (119.5).
4. "one cube is one logged tool call": 15,885, pin 132.0; 43 lit, pin 137.0; then 0.27 % (140.0).
Counts before ratios: 968 lit of 1,920 before 50 %; 43 of 320 before any share (13.4 %); 53 tasks before either plane; 43 of 15,885 before 0.27 %.

## Mechanism
A leaderboard score averages over cases that are not alike. Draw every case as a column of the six builds' tries and sort the columns by how many builds passed: the staircase has a tall dark end and a tall full end, five times what independent luck leaves, so most of what a build gets right is decided by the case, not the builder. Regroup the same telecom tries by build and the six levels sit between 26 % and 52 %; regroup them by kind of problem and the levels run from 12 % to 68 %. The expert plane shows the cases are solvable (82.2); the best build's plane (23.9) is dragged down by the widest slab, banking, where the best build gets 5.9. Why the builders fall short is not measured here, except one behaviour the log shows: how rarely they ask the client.

## Monday
question: "Ask the client. Test on cases, not on the first design that runs."
honest limit (exactly one, on stage): "One sampled build per task, builders mixed: columns are different builds, not repeats; 23.9 is a mean over 53 tasks scored by simulated customers and an LLM judge."

## Commit
none (D11).

## Takeaway (card, <= 60 chars)
Ask the client. Test on the hard cases.

## Cost
not asked.

## Findings (decide before drafting; none blocks the draft)
F1. **8.8, not 8.9.** The research table gives "8.9 expected dark columns": it adds three rounded domain terms (0.8 + 0.2 + 7.9). The exact Poisson-binomial sum over the three plates is 8.820, so the claims say 8.8 (and 8.4, exact 8.400). Everything else in the director's list reproduces: 968 of 1,920; 44 and 43 of 320; 23.9; 82.2; 0.27 %.
F2. **0.27 % has a wide denominator.** 43 messages in 15,885 logged tool calls is all 53 builds; 28 of them had no simulated Client to ask. Counting only the 25 builds that had one: 43 in 7,497 calls = 0.57 % (A, recompute section 5). The film uses the director's 0.27 % and says "of all tool calls" on the callout; if the room should hear the stricter number, swap claim asksPct and the call-sheet count (7,497) together.
F3. **The planes are on the board scale, not on the cube scale.** 23.9 and 82.2 are means over 53 task scores (reward = pass rate less a credit overage, times a latency gate); the three-plate cubes pass 50.4 %, the whole sample's pooled simulations 31.6 %, the sample's mean final score 20.1 %. So the planes never cut the cube columns: they live over four task slabs whose floor area is the task count (6, 6, 6, 35) and whose heights are the best build's and the expert's domain scores; the plane at 23.9 is exactly the task-weighted mean of the four slab heights (recomputed 23.92). The screen never says "% of simulations".
F4. **Two different units.** Scenario (customer case, 320 in three plates) and task (benchmark task, 53) are different things; the board scene is introduced by its own count (53 tasks). Banking is not drawn as cubes (1,445 scenario cubes, 95 lit, 9 of its 35 builds with no light are in the data, recompute section 3): time, and its weight enters as the widest slab.
F5. **Builder is confounded with the task variant.** The six builds of a domain differ in builder and in variant (evidence pack, defects, tier). Retail has two Opus builds and no Codex-sol; telecom has two Codex-sol builds and no Opus. So pooling cubes by builder across plates (35.7 % to 75.2 %) mixes domains and is not used; the re-stack by build is done inside telecom only (same 119 scenarios, six builds). The luck baseline is a null model (each build solves scenarios at its own rate, independently), not a statement of cause.
F6. **Honest line is long** (163 characters) and its "LLM judge" is the research file's wording from the paper's commentary (B), not checked in the code here. Set as one statement in two rows; do not shorten without the director.
F7. **B items kept off the stage:** the paper's 0.3 % (we recompute 0.27 %), "fewer than 80 of roughly 1,700 files" opened, "zero questions scored about 5 %" (n = 2 here, untestable), "ship the first design that works". The Monday question says "the first design that runs" as advice, not as a measured fact.
F8. **Expert 82.2 is the printed row;** the four domain scores weighted 6:6:6:35 give 82.14. The best 23.9 recomputes (23.92), so best is a formula claim and expert a source claim.
F9. Persona does not matter in telecom (31.7 / 36.0 / 39.4 %) and steps and questions do not separate builds in banking (Spearman -0.28 and -0.03): recorded in the research file, not used.

## Sources (>= 3)
S1 board rows and reference.json · S2 build-trajectories rel001-053 · S3 MANIFEST.md · S4 reward code · S5 Shi et al. 2026 (abstract, B, no number on stage) · S6 data/recompute.py. URLs and grades in claims.json and sources.md.

## Not this
- A leaderboard bar chart of six builders: the argument is the column and the case, not the rank.
- "Agents are bad" or "models are bad": the film is about where a score comes from. An expert reaches 82.2; the cases are solvable.
- "23.9 % of simulations": 23.9 is a mean of 53 task scores.
- Repeats of one build: there are none in the data; columns are six different builds.
- A causal claim that asking the client fixes it: the data cannot say (n = 2 who never asked); the Monday is a question to ask, not a result.
- A commit question or a number in HOOK (commit is off, D11).

## Director's choices (2026-10-11, as given)
Counts before every ratio (968 lit of 1,920 before 50 %; 43 of 320 before any share); the expert ceiling is a plane at 82.2 and the best build a plane at 23.9, both landing after their counts; the "cases every builder fails" beat (44 dark columns vs 8.8 expected from luck, 43 full vs 8.4) is the reversal that makes a viewer question "better model, better agent"; the client-question count (0.27 % of calls) is the Monday; honest line as the research gives it; brand ceti-neosage-dark, material hero (manager), chrome none; beat 0.5; declared cuts; every number A-grade from the recompute, nothing from snippets on stage; captions one line, lay words; no text moves; nothing over the marks.

## Director's choices (2026-10-11)
- Luck baselines are the exact values: 8.8 dark columns and 8.4 full columns expected (not the rounded sums).
- The Monday count comes before the ratio: "28 of 53 builders never asked the client anything" lands as a count, then
  "0.27 % of all tool calls were questions" as the ratio; among the 25 builders that had a client it is 0.57 %, in the claims
  and in the honest line, not as a second readout.
- The 23.9 and 82.2 planes stand over the four task slabs; banking is a slab, never cubes.
- The honest line stays whole on two rows (as who-gains).
- House style: motion-curves tokens on every hero move (0.8–1.6 s travel, settle 0.4–0.8 s, overshoot on marks only),
  text-reveal for every label and readout, beat 0.5 with G12 clean, material hero at manager level, declared cuts; the
  drafts export a 2-sample 1080p preview only; the master waits for the ship.
