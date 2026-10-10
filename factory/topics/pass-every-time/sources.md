# pass-every-time · sources, grades, what was opened (2026-10-10)

Egress: only GitHub hosts (github.com, raw.githubusercontent.com) were reachable. arxiv.org, metr.org, vals.ai, benchmarkingagents.com, emergentmind.com, anthropic.com, x.com all refused (DNS or proxy 403). Everything marked B was read through WebSearch (extended) result text quoting the primary.

| id | claim | source | opened? | grade |
|---|---|---|---|---|
| S1 | retail GPT-4o TC: Pass^1..4 = 0.604 / 0.491 / 0.430 / 0.383 | https://github.com/sierra-research/tau-bench (README, leaderboard) ; also notes the repo's tasks are "outdated" and points to a successor benchmark | yes, twice (WebFetch + raw README) | A |
| S2 | 115 retail tasks; 4 trials each; 278 of 460 passed; passes per task 0/1/2/3/4 = 22/18/9/22/44 | https://raw.githubusercontent.com/sierra-research/tau-bench/main/historical_trajectories/gpt-4o-retail.json (10,813,408 bytes, sha256 df01707894836168ff0ec9616b0bf08f66c7e5afcf313e5fe4f7a2f5c2ec938b); tasks_test.py (TASKS_TEST has 115 Task entries, sha256 6f09468923c6cfb6162e94fe659264d6aee70816c18d51278fb4a581db7765a4) | downloaded and recomputed | A |
| S3 | paper: about 61 % pass^1 retail, "as low as ~25 % for pass^8 on tau-retail"; 115 retail + 50 airline tasks | Yao, Shinn, Razavi, Narasimhan 2024, https://arxiv.org/abs/2406.12045 (PDF https://arxiv.org/pdf/2406.12045) | no (blocked); abstract text seen in search results; task count confirmed from S2 not from the paper | B (the 8-try figure) / A (115) |
| S4 | METR 2026-03-10: 296 PRs, 4 active maintainers, 3 SWE-bench Verified repos (scikit-learn, Sphinx, pytest per secondary coverage), roughly half of test-passing PRs would not be merged after noise adjustment; maintainer decisions about 24 points below the grader; agents could not iterate on feedback | https://metr.org/notes/2026-03-10-many-swe-bench-passing-prs-would-not-be-merged-into-main/ | no (blocked); consistent across the METR snippet, tessl, dev.to, daily.dev, itdoeswhatnow | B |
| S5 | Claude Opus 4.5: 50 % horizon about 4 h 49 min (95 % CI 1 h 49 min to 20 h 25 min), 80 % horizon 27 min (GPT-5.1-Codex-Max 32 min) | METR post Dec 2025 via https://www.techmeme.com/251221/p1 and https://the-decoder.com/anthropics-claude-opus-4-5-can-tackle-some-tasks-lasting-nearly-five-hours/ ; methodology https://arxiv.org/abs/2503.14499 | no (blocked) | B |
| S6 | 80.9 % SWE-bench Verified, Claude Opus 4.5, released 2025-11-24 (vendor-reported) | https://www.anthropic.com/news/claude-opus-4-5 ; research file cites https://www.vals.ai/benchmarks/swebench | no (blocked); many outlets agree | B |
| S7 | model of the published curve | factory/topics/pass-every-time/recompute.py, seed 20261010 | run | simulation (labelled MODEL on stage) |

Research-file items not used on screen: 59.4 % flawed tests (C), 81 vs 69 scaffold (C), OSWorld rows (C/B), 131 and 213 day doublings (B). Not on screen: 24-point maintainer gap, CI bounds, 3 repos.

Reproduce: `python3 -I factory/topics/pass-every-time/recompute.py` (add `--write` to rewrite data/tau_retail_8.json and data/recompute_out.json). To re-extract data/tau_retail_trials.json, download the trajectories file (S2) into an empty directory and read `task_id`, `trial`, `reward` per row.
