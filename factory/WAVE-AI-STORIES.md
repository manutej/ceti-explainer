# Wave AI-STORIES · three 2–3 minute films, AI and business by the numbers · 2026-10-10

One brief for every lane. Stage contract factory/PIPELINE.md; skills skills/ATELIER.md; laws CLAUDE.md and factory/FORMAT.md
(commit beat OFF, D11). Research the numbers come from: factory/research/AI-ADOPTION-2026.md and AI-ECONOMICS-2026.md
(grades A/B/C per number; only A and B numbers go on screen; every digit a claim with its URL). The perspective-shift
grammar the drafters must compose from: arsenal/frontier/R-E-perspective-shift.md (landing now; read it before drafting).
Text overlap is gated (gate row G11, landing now): a must-read collision is a FAIL.

## Why
The owner liked one thing most: the same marks re-partitioned while the camera moves, so the reversal is witnessed.
These films do that for AI and business, in the register of a 3blue1brown essay: one belief, real numbers, a count at
true scale, a second viewpoint that changes what the numbers mean, no narrator, captions carry it, no sealed answer.

## Shape of every film
- format `feature`, `dur` 150–183 (147–180 s of material + the 3 s card; the gate's feature cap is raised to 183 for this
  wave, see factory/tools/gate.mjs `format:"feature"` → the wave sets film.json `format: "feature-long"`: 140–180 s).
- level manager, renderer webgl, chrome none, material ink; brand per film below.
- Beats: HOOK 0–12 (the belief, no digits) · CASE 12–60 (the fixture, the count lands) · COUNT 60–135 (the second and
  third views; every ratio after its count) · MONDAY 135–150+ (the question to ask at work; one honest-limits line ON
  STAGE, not only in a caption) · card.
- At least three 3-D movements of data per film (re-partition, re-sort, re-stack, re-scale, slice: R-E's catalogue), each
  with the invariant stated (same marks, same count); ≤ 1 move per 8 s; ≥ 2.5 s hold on any new number.
- Labels through gl-labels; results never in the smallest face; no text within the caption band while a caption shows.
- Every tunable a knob; s/frame ≤ 1.5; page < 1.3 MB; film code < 120 KB (put stripped modules through `libs`).

## The three films
| id | story (default assumption → reversal) | the marks | moves | lanes | brand |
|---|---|---|---|---|---|
| who-gains | "AI makes everyone faster" → the same tool is +34 % for a novice, about 0 for an expert, and experts who believed +20 % measured −19 % (METR); pooled +26 % (3 field RCTs, 4,867 devs) and +14 % (5,179 support agents) hide the split | one box per worker (5,179 agents; 4,867 developers as a second count; the 16 METR developers and their 246 issues as the close-up) | pooled column → split by experience quintile (re-partition); a forecast-vs-measured tilt (the belief view is the forecast, the side view the measured time) | gl-stack-city, gl-camera-rig, gl-labels (+ track-unit for one tagged worker) | ceti-neosage-dark |
| pass-every-time | "an agent at 60 % does 60 % of the work" → one try at 60.4 % becomes 38.3 % at four tries and under 25 % at eight (tau-bench, GPT-4o retail); 80.9 % on SWE-bench Verified, yet about half of passing PRs would not be merged (METR, 296 PRs, 4 maintainers); at the 80 % bar the time horizon is about 10× shorter than at 50 % | one cube per task × attempt (a field of tasks seen from above lit 60 %; rotate to the side: per-task columns, only fully-lit columns count) | plan → side (re-project); columns re-sorted by passes; a cut plane at the "all 8" bar; the merge filter as a second re-partition | gl-instances, gl-camera-rig, gl-volume, gl-labels | midnight-ink (film-local pack from factory/films/wiring-and-the-whole/brand.midnight-ink.json) |
| one-query | "AI uses too much energy" and "AI uses almost no energy" are both told with true numbers → 0.24 Wh per median Gemini text prompt (Google 2025) is a human-scale nothing, yet AI data centres are ~1.5 % of world electricity, about half of US demand growth and 23 % of Ireland's grid (IEA 2025/2026): the picture depends on the denominator | one mark per query (scale-anchor: a query, a household, a data centre, a grid), then the same energy re-partitioned by country share | human-scale anchor + log zoom (re-scale); re-partition by denominator (per query / per data centre / per grid); a terrain of demand by country with a section cut | scale-anchor, gl-heightfield, gl-camera-rig, gl-labels | ceti-boardwalk-dark |

## Stages and roles (lean)
1. BRIEF (Sonnet, one lane per film, now): factory/topics/<id>/{brief.md, claims.json, beats.md, data/, recompute.py or
   sources.md}; re-read every number from the research file, keep only A/B numbers on screen, note grade per claim;
   beats.md header: format feature-long, dur, level manager, renderer webgl, chrome none, brand, chain, and the three
   named moves from R-E with their invariants.
2. DRAFT ×2 (Sonnet, parallel, distinct registers) per atelier-draft; frames + G11 clean before hand-back.
3. SELECT + FINDINGS r1 (Opus, blind, tier 1) → tool → FINDINGS r2 (Opus) → tool.
4. FINAL REVISION (Opus, tier 2): the beyond-scope list, one film.js round, re-gate, G11 clean, re-strip.
5. SHIP: seat, MEASURES.md, catalogue, gallery, artifact, MP4 (4K + 1080p), commit per lane, push.
No git from any lane; the orchestrator commits.

## Fourth film, added 2026-10-10 at the owner's request: `noether-symmetry`
| id | story | the marks | moves | lanes | brand |
|---|---|---|---|---|---|
| noether-symmetry | Noether's theorem for a lay audience: every continuous symmetry hides a conserved quantity, and it is not a quantum fact: the default assumption is "conservation laws are rules handed down"; the reversal is that they fall out of symmetry, visible when the same motion is re-projected into the conserved coordinates; then the modern non-quantum uses (classical orbits, fluids, learning dynamics in neural networks, economics or control where the research is solid) | one mark per state of a simulated system (thousands of orbit states as a point cloud; the same points re-projected onto (energy, angular momentum) collapse onto shells), plus one real fixture with grade-A numbers (e.g. Earth at perihelion and aphelion: distance × speed equal within a fraction of a percent, NASA fact sheet) | re-projection (position space → conserved-quantity space, the cloud collapses onto surfaces), re-partition by symmetry (rotation / time / translation), a cut plane through the shell; formula terms flying into the marks | gl-pointcloud (required), gl-camera-rig, gl-labels, formula-bind (+ gl-volume if a shell needs it) | ceti-coastal-dark |
Format feature-long, dur 153–183, level manager, webgl, commit off (D11). Research first (factory/research/NOETHER-NONQUANTUM.md), then the brief, then two drafts, the same tiers.
