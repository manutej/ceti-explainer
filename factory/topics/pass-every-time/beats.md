# Pass every time · `pass-every-time` · beats

id: `pass-every-time` · format: **feature-long** · dur **153** s = material 0 to 150 s + CETI brand card 150 to 153 s (gate: 140 to 180, cap 183)
level: **manager** · renderer: **webgl** · chrome: **none** · material: **ink** · commit: **none** (D11) · film.json `"commit": {"enabled": false}`, no COMMIT chapter
brand: **midnight-ink via a film-local copy** of `factory/films/wiring-and-the-whole/brand.midnight-ink.json` (copy kept at `factory/topics/pass-every-time/data/brand.midnight-ink.json`; the drafter puts it at `factory/films/pass-every-time/brand.midnight-ink.json` and passes `--brand` that file; Newsreader 600 display, DM Mono numbers, no Cormorant, because kit2 embeds only style-normal faces). Say so in the film header comment.
windows: HOOK 0–12 · CASE 12–60 · COUNT 60–135 · MONDAY 135–150 · BRAND 150–153. count.at = **21.0** (the first count, 115 tasks, lands; no %, ratio or "N of M" before 36.5 s)
chain (beat order): **gl-instances** (the cubes: CASE + COUNT, layouts `field` then `stack`, `pick` for lit sets) → **gl-camera-rig** (plan→side orbit, still holds, slow drift) → **gl-volume** (the cut plane at the all-4 and all-8 bars, `cutIn/cutFrom/cutTo/cutDim`, `ratioAt`) → **gl-labels** (every pin and the hard-cut callout; `reserve` the caption band)
recipes: chain-recipes §2 R22 (camera as the argument + labels), R24 (a distribution with a cut), R17 (pick an exact subset); grammar arsenal/frontier/R-E-perspective-shift.md (P1, P4, P6, P2, P5, R1–R10, T1–T8)
data: `data/tau_retail_trials.json` (115 tasks × 4 measured tries) · `data/tau_retail_8.json` (the same + 4 modelled tries per task, seed 20261010) · `recompute.py` prints every count and ratio and writes the model; every digit below is a claim id in claims.json; sources and grades in sources.md

## Measured versus modelled (binding, shown on stage)
Tries 1 to 4 of every task are MEASURED (tau-bench published trajectories). Tries 5 to 8 are a MODEL of the published curve and are drawn differently (outlined cube, no fill when failed, a "MODEL" tag at the column top and on every readout built from them). The tau-bench repo publishes four trials per task, not eight, so no eight-try count is data. The model reads about 30 %; the paper's own eight-try sentence says under 25 %. Both are shown, each with its owner. See brief.md "Findings".

## Structures (at most 4; the brand card is not one)
| # | structure | lane | beats | what it is |
|---|---|---|---|---|
| S1 | The field | gl-instances `field` → `stack` | CASE, COUNT | 115 tiles, 4 cubes each (460), later 8 cubes each (920); lit gold = passed, unlit = ghost; plan: each task a 2×2 tile on the floor; side: the same four cubes stacked 1×4 (then 1×8) |
| S2 | The cut | gl-volume (+ `pick`) | COUNT | a translucent plane across the sorted columns at height = bar (all 4, later all 8); columns whose every cube is lit stay bright, the rest `cutDim`; the readout is the exact lit-column count |
| S3 | The PR field and the minute strip | gl-instances `field` (ortho plan) | COUNT | 296 cubes in a 37 × 8 sheet; then a merge filter split; then, as a separate scene, 27 and 289 cubes in two rows (one cube = one minute) |
| S4 | The pins and the type | gl-labels + K.tx | all | counts and ratios as pins/callout; HOOK and MONDAY as set type over the empty floor; no digit in HOOK |

## The moves (R-E sentence: [data op] under [camera], holding [invariant], landing on [view])
Named moves (the three the wave asks for) and the two supporting ones. Invariants I1 same marks, I2 same count, I3 same scale, I4 same world, I5 same lens (R-E §0). ≤ 1 move per 8 s (start to start: 40, 60, 73, 88.5, 110.5); every landing is a stored key so a seek is identical (T8).

| id | R-E | t | sentence | invariants held | landing view |
|---|---|---|---|---|---|
| **M1 plan → side re-projection** | P1 | 40.0–47.0 (7 s, ease inOut) | **re-stack** (2×2 footprint → 1×4 column, per task) and **re-project** (el 89° → 24°) under an orbit of 18° az, holding id-stable cubes | I1 each of 460 cubes keeps its id and its lit/unlit state; I2 460 before and after (readout `count(t)` = 460 on the first and last frame of the move); I3 cube edge fixed; I5 fov fixed (28°) | side oblique el 24°, az 18°; settle 47–52: columns of four, tops unequal |
| **M2 re-sort by passes** | P4 | 60.0–66.0 (6 s, camera still, drift ≤ 3°) | **re-sort** columns by passes (4,3,2,1,0), stable by task id inside a group | I1 same cubes, same lit state; I2 115 columns, 460 cubes; I3, I4 (camera still; only column order changes) | skyline: 44 full columns left, 22 empty right; settle 66–68 |
| **M3 cut plane at the all-tries bar** | P6 | 73.0–77.0 (4 s, camera still) → bar all-4; 88.5–92.0 (3.5 s) → bar all-8 over the extended columns | **slice** at height = bar; dims, never removes (`cutDim`); lit columns above the plane are counted | I1–I4; the lit-column count snaps to a column edge and equals the exact claim (44 at the first bar; 36 in the model at the second) | the plane resting at the bar, readout settled |
| M4 merge filter re-partition | P2 variant, camera held | 110.5–117.5 (7 s, still, drift ≤ 3°) | **re-partition** the 296 lit PRs into "would merge" / "would not merge" blocks, boxes travel, no fade | I1 same 296 cubes, none added or hidden; I2 296 before and after (the readout shows 296 on the first and last frame); the split is schematic (two equal blocks for "about half"), carries no digit | two blocks, the "not merged" block dimmed to outline; settle 117.5–118 |
| M5 (not a move) scene changes | cut/dissolve | 100.0–101.5 tau field → PR sheet; 121.0–122.0 PR sheet → minute strip | different datasets, so I1–I2 do not apply across them; each scene lands its own count with its own hold | each side starts and ends on a stored key | |
Also: the model layer (tries 5 to 8) ARRIVES at 82.5–87.5 as a count-in (new marks appear, camera still); this is a count-in, not a move.

## Beat table
| beat | t (s) | what happens | claims |
|---|---|---|---|
| HOOK | 0.0–12.0 | Midnight floor, a faint grid, STILL camera (no move before 12 s). Set type fades in (Newsreader 600, bone on navy): the belief, then the doubt. No digit, no cube. | none |
| CASE | 12.0–21.0 | A label under the empty floor: "GPT-4o · tau-bench retail · 2024". 13–21 tiles count in (115) in a 23 × 5 floor grid, plan view el 89°, ambient drift ≤ 1°. | model |
| | 21.0 (hold to 23.5) | pin "115 tasks" | tasks |
| | 23.5–28.5 | four cubes per tile count in (2×2 footprint), unlit ghosts | |
| | 28.5 (hold to 31.0) | pin "460 tries" | tries, triesPer (word) |
| | 31.0–34.0 | passes light gold, by pooled order (seed fixed) | |
| | 34.0 (hold to 36.5) | pin "278 passed" | passed |
| | 36.5 (hold to 40.0) | callout "60.4 % of tries pass" | pass1 |
| | 40.0–47.0 | **M1** plan → side | |
| | 47.0–60.0 | settle; 52.0 two hard-cut callouts on two columns, words only ("all lit", "none lit"); 56–60 ambient drift only | |
| COUNT | 60.0–68.0 | **M2** re-sort (60–66), settle | |
| | 68.0 (hold to 70.5) | pin "44 pass all four" on the full-column block | fullyLit4 |
| | 70.5 (hold to 73.0) | pin "22 never pass" on the empty block | neverPass |
| | 73.0–77.0 | **M3a** the plane rises to the all-4 bar; columns below dim | |
| | 77.5 (hold to 79.5) | readout "44 of 115 columns" | fullyLit4, tasks |
| | 79.5 (hold to 82.5) | callout "38.3 % pass all four" (ratio ≥ 1.5 s after the count) | pass4 |
| | 82.5–87.5 | four MODEL cubes arrive on every column (outlined, "MODEL" tag at the top of the skyline); camera still | tries8 (caption) |
| | 87.5–88.5 | settle | |
| | 88.5–92.0 | **M3b** the plane rises to the all-8 bar over the extended columns | |
| | 92.0 (hold to 94.5) | readout "36 of 115 · MODEL" | modelAll8, tasks |
| | 94.5 (hold to 97.0) | callout "31 % · MODEL" | modelAll8Pct |
| | 97.0 (hold to 100.0) | plate attributed to the paper: "The paper's own 8-try run: under 25 %" | paperPass8 |
| | 100.0–105.0 | **M5a** tau field recedes; 296 cubes (37 × 8 sheet) count in, ortho plan, all lit | |
| | 105.0 (hold to 107.5) | pin "296 PRs" | prs |
| | 107.5 (hold to 110.0) | caption + pin "80.9 % top SWE-bench Verified" (a different set: 500 problems, tests only) | swe |
| | 110.5–117.5 | **M4** merge filter | maintainers (caption only) |
| | 118.0 (hold to 121.0) | pin "about half would not be merged" | notMergedHalf |
| | 121.0–124.0 | **M5b** minute strip: legend "one cube = one minute" | perCube |
| | 124.0 (hold to 126.5) | 27 cubes in a row; pin "27 min · 80 % bar" | h80, r80 |
| | 126.5–129.5 | 289 cubes count in, second row | |
| | 129.5 (hold to 132.0) | pin "4 h 49 min · 50 % bar" | h50, r50 |
| | 132.0 (hold to 135.0) | callout "about 10x longer" | horizonRatio |
| MONDAY | 135.0–141.0 | field settles to the plan pose of 0 s (bookend), set type: the question to ask at work. | none |
| | 141.5–150.0 | the honest line ON STAGE as one line of set type (no caption in the band during it): "One 2024 model, and agents that could not revise: newer ones may do better." | year |
| BRAND | 150.0–153.0 | plain navy card: CETI wordmark, takeaway "A pass is not a pass every time." (33 chars) | |

## Labels (gl-labels)
Pins are solved in screen space, `reserve` = the caption band read from the kit. Result-role labels (60.4 %, 38.3 %, 31 %, about 10x) are ≥ 28 u display and at most 2 on screen; none of 115, 460, 278, 44, 22, 296 is in the smallest face. At each move start, labels hard-cut off and hard-cut on after the settle (R5). No label in the caption band while a caption shows. Every k, axis tick or per-column digit is forbidden unless it is a claim (no "try 1 … 8" tick digits; write the word "tries").

## Captions (DM Mono/Newsreader 28 u, ≤ 60 chars; no digit without a claim)
| # | t0 | t1 | text |
|---|---|---|---|
| c1 | 0.8 | 5.8 | An agent that is usually right does most of the work. |
| c2 | 6.2 | 11.6 | Or does it? Count every try, task by task. |
| c3 | 12.4 | 20.6 | A customer-service test: GPT-4o on tau-bench retail. |
| c4 | 21.0 | 28.0 | 115 tasks. One tile each. |
| c5 | 28.5 | 33.5 | Four tries per task: 460 cubes. |
| c6 | 34.0 | 36.4 | 278 passed. A lit cube is a pass. |
| c7 | 36.8 | 39.8 | Tries that pass: 60.4 %. |
| c8 | 40.2 | 46.8 | Now turn the field. Each task becomes a column. |
| c9 | 47.5 | 59.5 | Judge a task by all its tries, not by one. |
| c10 | 60.4 | 66.5 | Sort the same columns by how many tries passed. |
| c11 | 68.0 | 70.4 | 44 tasks pass all four tries. |
| c12 | 70.6 | 72.9 | 22 never pass. |
| c13 | 73.2 | 79.3 | Cut the field at all four tries. |
| c14 | 79.6 | 82.4 | All four tries pass: 38.3 %. |
| c15 | 82.6 | 91.8 | Four more tries each: a model, not data. |
| c16 | 92.0 | 94.4 | Model, all eight tries: 36 of 115 tasks. |
| c17 | 94.6 | 96.9 | Model: 31 % pass all eight. |
| c18 | 97.2 | 99.8 | The paper's own 8-try run: under 25 %. |
| c19 | 100.2 | 104.8 | Passing a benchmark is not the same as shipping. |
| c20 | 105.0 | 107.3 | 296 PRs pass the tests. |
| c21 | 107.5 | 110.3 | Top SWE-bench Verified score: 80.9 %. |
| c22 | 110.6 | 117.8 | 4 maintainers read them. Would they merge? |
| c23 | 118.0 | 120.9 | About half would not be merged. |
| c24 | 121.2 | 123.9 | One more yardstick: how long a task can it do? |
| c25 | 124.0 | 126.4 | 27 minutes at the 80 % bar. |
| c26 | 126.6 | 129.4 | Another agent, same idea: one cube per minute. |
| c27 | 129.5 | 131.9 | 4 h 49 min at the 50 % bar. |
| c28 | 132.0 | 134.8 | About 10 times longer. |
| c29 | 135.3 | 140.8 | Monday: how often does it pass when it must every time? |
| (none) | 141.5 | 150.0 | the honest line is stage type; no caption in the band |
Caption notes. "4 maintainers" renders claim maintainers; "4 h 49 min" renders h50; "8-try" renders tries8; "GPT-4o" renders model; "tau-bench" has no digit. The METR horizon (c24 to c28) and the 80.9 % are for Claude Opus 4.5, NOT the tau-bench GPT-4o, and the 296 PRs come from agents of mid-2024 to late 2025: captions say "another agent", "top score", "PRs", never "the same agent".

## Knobs (every tunable a knob; defaults here)
camPlanEl 89, camSideEl 24, camSideAz 18, camFov 28, m1T0 40 m1T1 47, m2T0 60 m2T1 66, m3aT0 73 m3aT1 77, m3bT0 88.5 m3bT1 92, m4T0 110.5 m4T1 117.5, cubeEdge (world) fixed, gapTile 0.25 cube, gridCols 23 gridRows 5, prCols 37 prRows 8, seedLit 7, modelSeed 20261010 (baked into data/tau_retail_8.json, not recomputed at runtime), ambientDriftDeg 1 (≤ 3 at holds), cutDim 0.18, pinHold 8 frames, maxShown 6 within 1 s of a move and 12 at rest.

## Purity
render(t, state) recomputes cube positions and lit state from t and the data files; no Math.random/Date/performance in the renderer; lit order is a seeded permutation (mulberry32) computed once at load; the model tries are READ from data/tau_retail_8.json, never sampled at run time.

## Checks before building
- count.at 21.0 precedes every ratio (36.5 first); hold ≥ 2.5 s on every new number (table above); ratio ≥ 1.5 s after its count.
- Moves start 40, 60, 73, 88.5, 110.5: min gap 15 s here (rule ≤ 1 per 8 s); every landing ≥ 1.5 s of settle before a pin.
- HOOK carries no digit and no cube. Honest line is on stage once, 141.5–150.
- `python3 -I factory/topics/pass-every-time/recompute.py` passes its asserts (60.4/49.1/43.0/38.3 exact to 0.05; 44 of 115; 278 of 460).
- Every digit on the stage and in a caption is a claim id (claims.json) or a render of one; G11 text-overlap clean; s/frame ≤ 1.5; page < 1.3 MB; film code < 120 KB.
