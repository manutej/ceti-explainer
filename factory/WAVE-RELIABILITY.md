# Wave RELIABILITY · new films from the 2026 agent-reliability papers (2026-10-11)

Owner's brief: apply the factory, with the Wave WOW craft as the default, to a set of 2026 papers. The reference film is
pass-every-time (the hero cut): tiles for tasks, cubes for tries, light for success, sorting, cut planes, re-stacking,
turning reliability metrics into "usually right" versus "pass every time". The owner's reading of the papers (their
numbers are the owner's notes until a lane verifies them; grade A/B/C by what a search snippet or the open data confirms):

Data papers (films):
1. Towards a Science of AI Agent Reliability (Rabanser, Kapoor, Kirgis, Liu, Utpala, Narayanan; ICML 2026, arXiv
   2602.16666): twelve metrics across four dimensions (consistency, robustness, predictability, safety), 15 models on
   GAIA and τ-bench; accuracy slope about 0.23/year vs reliability about 0.03/year on GAIA; outcome and resource
   consistency low; calibration improves more than discrimination; safety gains with persistent high-severity failures.
   Dashboard hal.cs.princeton.edu/reliability. Film: the sequel to pass-every-time: "accuracy climbed, reliability did not".
2. τ²-Bench / Hyper-τ-Bench (Shi, Dhandhania, Narasimhan, Barres; Sierra, 2026-09, arXiv 2609.04611): can a coding agent
   BUILD a customer-service agent from business records, requirements, an API and a codebase; 53 tasks, four domains;
   best configuration 23.9 % of evaluation simulations vs an expert-authored ceiling 82.2 %; failures: shallow queries,
   little client communication, shipping the first design that runs. Open data cloned at /home/user/data/hyper-tau-bench.
   Film: "build the agent": the per-task matrix as a field, the expert ceiling as a plane.
3. Agents Are Systems, Not Models (arXiv 2610.01618, 2026-10): four scientific tasks; about 54 % of outcome variance from
   repeating the same configuration; information given to the agent matters more than time budget or model size and also
   improves calibration and cost; 18,000+ trajectories, cloned at /home/user/data/rethinking-agent-evaluation.
   Film: "same setup, different answer": the variance as a cloud, the ablations as re-stacks.
4. Agent Evaluation Reliability: More Tasks Won't (Always) Fix a Leaderboard (Hardy et al., arXiv 2610.00651): 22
   benchmarks; fixed model-scaffold systems rank reliably (0.935–0.994) while underlying models do not (0.148–0.841);
   infinite similar tasks add at most about 0.097; pooling diverse benchmarks lifts 0.44 to 0.75 at the same budget.
5. Reliability of AI Agents: Rater Effects, Drift, and the Return to an Evaluation Program (Zhang and Esposito, arXiv
   2610.07003): 2,611 rubric-scored interviews from a deployed interviewing agent; reviewers differ by 0.79 SD; adjusted
   reliability +0.53 SD March to August 2026; interview tickets fall about 10 %/month relative to technical tickets.
   (4 and 5 are candidates for a fourth film or for beats inside 1.)

Methods papers (pipeline research, not films): DataMagic (arXiv 2609.33403, IEEE VIS 2026: DVSpec binding charts,
narration and animation to data fields with provenance; generate-then-orchestrate; 3.89/5 vs 2.13), PlotCraft /
PlotCraftor (ICML 2026), VIS-GEN (arXiv 2609.26208: intent, candidates, critique, refinement; +16 points), FigTree
(arXiv 2609.01006: figures as recursive SVG programs with a render-critic loop), Sci-VBench, Co-Director-style stacks.

Defaults for every film in this wave (the Wave WOW lanes are now the house style for feature films): motion-curves tokens
on every hero move (0.8–1.6 s travel, settle 0.4–0.8 s, overshoot on marks only), text-reveal for every label and
readout, `beat` 0.5 with G12 clean, the hero material at manager level, declared `cuts`, accumulation export for the
master and a 2-sample preview for iterations; the laws unchanged (counts before ratios; every digit a claim; silent;
one honest line; CETI card last). Format feature-long 153 s, chapters HOOK 0–12 · CASE 12–60 · COUNT 60–135 · MONDAY
135–150. Pipeline: research (verify, extract open data with recompute scripts) → brief → 2 drafts → blind select +
r1/r2 by tool → one Opus revision → rubric.mjs + judge → seat → ship. Lean: scripts before models; task cards small.
