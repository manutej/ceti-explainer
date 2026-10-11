# build-the-agent · sources, grades, what was opened (2026-10-11)

Egress: only the local clone was read for numbers. The paper (arxiv.org) is not opened here; nothing graded B or C is on stage.
Pinned clone: /home/user/data/hyper-tau-bench, commit 6e9f34c685d40fa7a9f5935d8970af6fd9d5f118 (2026-09-06), origin https://github.com/sierra-research/hyper-tau-bench. It is untrusted data: every script that reads it runs with `python3 -I`, and nothing in it is imported or run.

| id | claim | source | opened? | grade |
|---|---|---|---|---|
| S1 | board scores: Claude Code + Claude Opus 5 overall 23.9 (airline 55.9, retail 72.8, telecom 48.2, banking 5.9); expert 82.2 (82.3, 84.0, 93.8, 79.8); weights 6:6:6:35 reproduce 23.92 and 82.14 | web/leaderboard/public/hyper-submissions/*/submission.json and reference.json | yes, parsed by factory/topics/reliability-data/recompute.py section 1 | A |
| S2 | per-scenario pass bits of the 53 sampled builds: 320 scenarios (67/134/119) x 6 builds = 1,920 cubes, 968 lit; 44 solved by none, 43 by all six; telecom by build (31, 35, 40, 62, 35, 52 of 119) and by kind of problem (mms 34/294, mobile data 91/228, service 130/192); banking 35 builds, 1,445 sims, 95 passed; 15,885 logged tool calls, 43 messages to the Client | web/leaderboard/public/build-trajectories/rel001..053.json | yes, section 2 and 3 of the upstream script; data/ copies recomputed by data/recompute.py | A |
| S3 | 53 tasks = 6 airline_plus + 6 retail_plus + 6 telecom + 35 banking_knowledge | data/tau2/hyper/tasks/MANIFEST.md | yes | A |
| S4 | reward = max(0, pass rate - credit overage) x latency gate; board overall = mean over the 53 tasks | src/tau2/hyper/sandbox/orchestrator.py, performance.py | yes (read in the research lane; the definition is restated in hyper-tau-summary.json `reward_definition`) | A |
| S5 | the benchmark: a Developer builds a customer-service agent from business records, a client's requirements, an API and a codebase; "23.9 % of evaluation simulations" and "expert 82.2" are the paper's headline words | Shi, Dhandhania, Narasimhan, Barres 2026, https://arxiv.org/abs/2609.04611 | no (blocked); abstract read through search-result text | B; the film uses the clone's numbers and never the phrase "of simulations" |
| S6 | the luck baseline: per plate, the Poisson-binomial probability that exactly k of six builds solve a scenario, each build at its own pass rate, independent; times the scenario count, summed over the three plates: 8.820 dark, 8.400 full | factory/topics/build-the-agent/data/recompute.py section 1 | run | derived (null model, A inputs) |

Items read in the research file and kept OFF the stage: the paper's "0.3 %" (the recompute gives 0.27 %, A), "fewer than 80 of roughly 1,700 files", "builds with zero questions scored about 5 %" (n = 2, untestable), "ship the first design that works" (B); persona and step-count statistics (not shown); the other five configurations' rows (kept in data/ for the record); GPT-5.6 Sol at 22.0 (A, not used). Honest-line phrase "an LLM judge" is the research file's wording (B, not checked in code here).

Reproduce (repo root):
- `python3 -I factory/topics/build-the-agent/data/recompute.py --check-claims --verify-upstream` prints every number, asserts the checks, evaluates every formula in claims.json and verifies the three JSON copies are byte-identical to factory/topics/reliability-data/.
- To regenerate the copies from the clone: `python3 -I factory/topics/reliability-data/recompute.py --write` then `cp factory/topics/reliability-data/hyper-tau-{matrix,builds,summary}.json factory/topics/build-the-agent/data/`.
- The upstream numbers alone: `python3 -I factory/topics/reliability-data/recompute.py` (reads the clone, writes nothing).
