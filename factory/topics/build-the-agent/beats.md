# The Builder · `build-the-agent` · beats

id: `build-the-agent` · format: **feature-long**, 153 s = material 0 to 150 s + CETI brand card 150 to 153 s (gate: 140 to 180, cap 183)
level: **manager** · renderer: **webgl** · brand: **ceti-neosage-dark** (`--brand ceti-neosage-dark`; its Fraunces 300 italic display is vendored italic-only and kit2/build.py honours a pack face's style) · chrome: **none** · material: **hero** (`--material hero`, manager level only) · beat: **0.5** (film.json `"beat": 0.5`, G12 clean) · commit: **none** (D11), film.json `"commit": {"enabled": false}`, no COMMIT chapter
windows: HOOK 0 to 12 · CASE 12 to 60 · COUNT 60 to 135 · MONDAY 135 to 150 · BRAND 150 to 153. `count.at` = **12.5** (the first count, 320 tiles, starts counting in and shows only landed tenths; no %, ratio or "N of M" before 34.5 s)
chain (beat order): **gl-instances** (tiles, cubes, the 15,885-cube call sheet; layouts `field`, `stack`, `sheet`; `pick` for the exact lit set) -> **gl-camera-rig** (plan, side, macro/medium/wide, four carried joins) -> **gl-volume** (the cut plane at six of six, then the two score planes; `cutIn/cutFrom/cutTo/cutDim`, `ratioAt`) -> **gl-labels** (every pin and the callouts, `reserve` the caption band). House libs of the wave: **gl-look** (hero material), **motion-curves** (tokens on every hero move: travel 0.8 to 1.6 s, settle 0.4 to 0.8 s, overshoot on marks only), **text-reveal** (masked rise, tenth-by-tenth count-ins, weight pulse on the landed number). Recipes: chain-recipes section 2 R22 (camera as the argument + labels), R24 (a distribution with a cut), R17 (pick an exact subset); grammar `arsenal/frontier/R-E-perspective-shift.md` (P1, P2, P4, P6).
reference film (match its register: tiles, cubes, light, sort, cut plane, re-stack): `factory/films/pass-every-time/` (film.json, REVISION-wow2.md). Build: `python3 factory/kit2/build.py factory/films/build-the-agent --brand ceti-neosage-dark --chrome none --material hero`.
data: `data/hyper-tau-matrix.json` (pass bits, 12 scenario groups) · `data/hyper-tau-builds.json` (53 builds) · `data/hyper-tau-summary.json` (board rows) · `data/recompute.py` prints and asserts every number (`python3 -I factory/topics/build-the-agent/data/recompute.py --check-claims --verify-upstream`). Every digit below is a claim id in claims.json; sources and grades in sources.md.

## What a mark is (binding, said on stage in words, never a digit)
- **tile** = one customer scenario (a simulated customer case). Airline 67, retail 134, telecom 119: **320 tiles on three plates**.
- **cube** = one build's try at that scenario. Six different builds per scenario: a column of six, **1,920 cubes**. The six differ in builder AND task variant (evidence pack, defects, tier); retail has two Opus builds, telecom two Codex-sol builds. Columns are different builds, never repeats of one build (there are no repeats anywhere in the data).
- **light** = that cube passed: **968 lit**. The lit set is the data (pass bit of scenario x build), not a seeded draw.
- **task tile** (board scene only) = one of the 53 benchmark tasks (6 + 6 + 6 + 35). A scenario is not a task: the board scene is a different unit and says so ("53 tasks", plate pins 6, 6, 6, 35).
- **call cube** (Monday only) = one logged tool call: **15,885**; the 43 that were messages to the simulated Client are the lit ones.
- **plane** = a level on the board's 0 to 100 scale, not a count of cubes: **23.9** (the best build configuration) and **82.2** (the expert). The planes never cut the cube columns: they live over the four task slabs (S5). The board number is a mean over 53 task scores, so the screen never says "% of simulations" (G5b/G5c risk, the research file's gate warning).
- **banking** has no cube plate in this film: 35 of the 53 tasks (66 % of the weight) enter only as the widest slab. Its 1,445 scenario cubes (95 lit, 9 builds with no light; recompute section 3) are available data, not drawn (time; open item 4 of the research file decided here).

## Structures (at most 5; the brand card is not one)
| # | structure | lane | beats | what it is |
|---|---|---|---|---|
| S1 | The field | gl-instances `field` -> `stack` | CASE | three plates of tiles (320), six cubes each (1,920), lit amber (968); plan: each tile a 2 x 3 footprint; side: the same six cubes as a column of 1 x 6 |
| S2 | The skyline | gl-instances `stack` sorted + gl-volume ghost | COUNT | 320 columns sorted by lit count (0 to 6), lit cubes at the foot of each column; an outlined "if luck" skyline over the same axis; the cut plane at six of six |
| S3 | The tanks | gl-instances `stack`, tank fill | COUNT | the 714 telecom cubes regrouped as tanks: six equal tanks by build, then three tanks by kind of problem (width = cubes, fill level = share lit); the fill IS the share |
| S4 | The yardstick | gl-volume planes + slabs | COUNT | 53 task tiles in four plates (6, 6, 6, 35) become four slabs (floor area = task count); best build's domain scores as slab heights, the plane at 23.9; the expert's as ghost slabs, the plane at 82.2; ruler 0 to 100 at the edge |
| S5 | The call sheet | gl-instances `sheet` (ortho plan) | COUNT end, MONDAY | 15,885 call cubes in a 159 x 100 sheet (the last 15 slots empty), 43 lit |
| S6 | The pins and the type | gl-labels + K.reveal | all | pins and callouts as landed numbers; HOOK, MONDAY and the honest line as set type on the empty floor; no digit in HOOK |

## The moves (R-E sentence: [data op] under [camera], holding [invariant], landing on [view])
Invariants I1 same marks (id-stable cubes), I2 same count (the readout shows N on the first and last frame), I3 same scale, I4 same world, I5 same lens (R-E section 0). Every landing is a stored key so a seek is identical (T8). Labels hard-cut off at each move start and on after the settle; no text travels with a mark; no label sits over a mark (gl-labels `occluders`, `reserve` the caption band).

| id | R-E | t | sentence | invariants held | landing view |
|---|---|---|---|---|---|
| **M1 turn** | P1 | 40.0-41.6 (spring) | **re-stack** (2 x 3 footprint to a 1 x 6 column, per scenario) and **re-project** (el 89 to 30) under an 18 deg orbit | I1 each of 1,920 cubes keeps its id and lit state; I2 1,920 before and after; I3 cube edge fixed; I5 fov fixed (28) | medium side oblique; settle 41.6-45 |
| **M2 sort** (named move 1) | P4 | 60.0-61.6, camera still (drift <= 3 deg), one clock for all 320 columns, no stagger | **re-sort** the columns by lit count (0 to 6), stable by plate then scenario index | I1 same cubes and lit state; I2 320 columns, 1,920 cubes; I3, I4 | skyline: 44 empty columns one end, 43 full the other; settle 61.6-64.5 |
| **ghost** (not a move) | | 71.5-74.5 | the "if luck" skyline (outlined steps, widths 8.8, 36.0, 68.8, 85.9, 73.9, 38.1, 8.4 columns for k = 0 to 6) arrives over the real one; camera still; only the two ends carry a number | | |
| **M3 cut plane** (named move 2) | P6 | 79.0-80.6 | **slice** at height = six lit; columns below dim, never removed (`cutDim`); the lit-column count snaps to a column edge and equals the claim (43) | I1-I4 | plane resting at the bar, readout "43 of 320" settled |
| **J1 join** | carried | 88.5-90.1 | the 119 telecom columns leave the skyline (others dim in place) and settle on their plate while the camera travels; the cut plane rides with them and fades | I1 ids; I2 119 columns, 714 cubes | macro on the telecom plate |
| **M4a re-stack by build** (named move 3) | P1 variant | 90.5-92.1 | **re-stack** the 714 cubes from 119 columns of six into six tanks, one per build (119 cubes each; fill = lit share, unlit as ghost above the level) | I1, I2 714; I3 | six tanks, levels 26.1 % to 52.1 % |
| **M4b re-partition by kind** (named move 3) | P2 variant, camera held | 95.5-97.1 | **re-partition** the same 714 cubes into three tanks by kind of problem (49, 38, 32 scenarios; width = cubes) | I1, I2 714, I3 | three tanks, levels 11.6 %, 39.9 %, 67.7 % |
| **J3 join** | carried | 105.5-107.1 | camera travel to the board floor carrying the plane object (it leaves the telecom plate at its resting height and lands as the zero level of the ruler) | | wide board, 53 task tiles empty |
| **slabs + plane (best)** | P6 variant | 112.5-113.7 slabs rise to the best build's four domain scores, 113.7-114.9 the plane lands at 23.9 (spring, overshoot on the plane only) | the plane is the task-weighted mean of the four slabs: it cuts the three tall slabs and floats above the banking slab | | wide board |
| **plane (expert)** | P6 variant | 117.5-119.1 | the expert's four ghost slabs rise behind and the plane rises from 23.9 to 82.2 | | wide board, banking slab dark against its ghost |
| **J4 join** | carried | 126.0-127.6 | camera travel to the call sheet; the expert plane sinks and becomes the sheet's backing plate | | wide plan on an empty sheet |

Named moves of the brief: sort (M2), cut plane (M3, then the score planes), re-stack (M4a/M4b). >= 3 perspective-shift moves (R-E, feature-long): M1, M2, M3, M4a, M4b. Camera scales: minute 1 macro (hook) / wide plan (12.5-40) / medium side (41.6-60); minute 2 medium skyline / macro on the dark and full blocks / medium cut / macro telecom / wide board; minute 3 wide board / macro on the banking slab / wide call sheet / medium (Monday). If a carried join does not read, declare the cut in film.json `cuts` (t, reason); the only candidate is J3 (the unit changes from scenarios to tasks). Planned: `cuts: []`.

## Beat table
| beat | t (s) | what happens | claims |
|---|---|---|---|
| HOOK | 0.0-12.0 | Dark floor, faint grid, STILL macro camera, no move before 12 s. Set type (Fraunces italic): "The best builder makes the best agent." (1.0-5.0), then "Let it build one. Then call it, case by case." (5.5-10.0). No digit, no cube. | none |
| CASE | 12.0-12.5 | floor labels in words: Airline, Retail, Telecom (three plates, wide plan, el 89, drift <= 1 deg) | |
| | 12.5-17.0 | **count 1**: 320 tiles count in, tenth by tenth (landed counts only) | scenarios |
| | 17.0 (hold to 20.0) | pin "320 cases"; small plate pins 67, 134, 119 | scenarios, scenAir, scenRet, scenTel |
| | 20.0-23.5 | six cubes per tile count in (2 x 3 footprint), unlit ghosts | buildsPer (word) |
| | 24.0 (hold to 27.0) | **count 2**: pin "1,920 tries" | tries |
| | 27.5-31.0 | the pass bits light, plate by plate, scenario order | |
| | 31.5 (hold to 34.0) | pin "968 lit" | lit |
| | 34.5 (hold to 38.5) | callout "50.4 % of tries pass" (the first ratio; 3 s after the count) | litPct |
| | 40.0-41.6 | **M1** plan to side; settle to 45.0 | |
| | 45.0-60.0 | words-only hard-cut callouts on two columns, "no build solved it" (50.0-53.5) and "every build solved it" (55.0-58.5); ambient drift only | |
| COUNT | 60.0-61.6 | **M2** sort; settle to 64.5 | |
| | 64.5 (hold to 67.5) | macro on the empty block; pin "44 never lit" | dark |
| | 68.0 (hold to 70.5) | macro on the full block; pin "43 lit in all six" | full |
| | 71.5-74.5 | the luck skyline arrives (camera medium, still) | |
| | 75.0 (hold to 77.5) | pins on the two ends: "luck: 8.8" over the dark end, "luck: 8.4" over the full end | luckDark, luckFull |
| | 79.0-80.6 | **M3** the plane rises to six of six | |
| | 81.0 (hold to 83.5) | readout "43 of 320" (the count before any share) | full, scenarios |
| | 84.5 (hold to 87.0) | callout "13.4 % solved by all six" | fullPct |
| | 88.5-90.1 | **J1** to the telecom plate | |
| | 90.5-92.1 | **M4a** tanks by build | |
| | 92.5 (hold to 95.0) | pins on the lowest and highest tank: "26.1 %" and "52.1 %" | telLo, telHi |
| | 95.5-97.1 | **M4b** tanks by kind of problem | |
| | 97.5 (hold to 100.0) | pins "11.6 %" (MMS problems) and "67.7 %" (service problems); the 39.9 % tank has a word label only | kindMms, kindSvc |
| | 101.5-105.5 | still; the two tank sets side by side in the frame, no new number | |
| | 105.5-107.1 | **J3** to the board floor | |
| | 107.5-110.0 | **count 3**: 53 task tiles in four plates count in | |
| | 110.0 (hold to 112.5) | pin "53 tasks"; plate pins 6, 6, 6, 35; ruler ticks 0 and 100 | taskN, tAir, tRet, tTel, tBank, scaleBase, scaleTop |
| | 112.5-114.9 | slabs rise to the best build's four scores; the plane lands at the weighted mean | |
| | 115.0 (hold to 117.5) | pin on the plane "23.9 out of 100" (best builder) | best |
| | 117.5-119.1 | the expert plane rises to 82.2 over its ghost slabs | |
| | 119.5 (hold to 122.0) | pin "82.2" (the expert, a person who knows the test) | expert |
| | 122.5 (hold to 126.0) | pins on the banking slab and its ghost: "5.9" and "79.8" | bestBank, expBank |
| | 126.0-127.6 | **J4** to the call sheet | |
| | 128.0-132.0 | **count 4**: 15,885 call cubes count in, tenth by tenth | |
| | 132.0 (hold to 135.5) | pin "15,885 tool calls" | calls |
| MONDAY | 135.0-136.5 | the 43 message cubes light, with a small anticipation (0.5 s) and bloom 0.1 so 43 of 15,885 can be seen | |
| | 137.0 (hold to 140.5) | pin "43 questions to the client" | asks |
| | 140.0-150.0 | callout "0.27 % of all tool calls" stays to the end (3 s after the count) | asksPct |
| | 141.5-150.0 | set type, the Monday question: "Ask the client. Test on cases, not on the first design that runs." | none |
| | 143.0-150.0 | the honest line ON STAGE as one statement of set type, no caption in the band after 140.5 | best, taskN |
| BRAND | 150.0-153.0 | plain dark card: CETI wordmark, takeaway "Ask the client. Test on the hard cases." (39 chars) | |

Honest line (exactly one, exactly as the research gives it): "One sampled build per task, builders mixed: columns are different builds, not repeats; 23.9 is a mean over 53 tasks scored by simulated customers and an LLM judge." It is one statement of 163 characters: set it as one sentence in two typeset rows (22 u), do not shorten or split it into two claims; if G6 or G11 objects, change its size, not its words. The digits 23.9 and 53 are claims.

## Layout rules (all text is at rest)
Pins and callouts sit in the left and right margins with leaders (gl-labels), never over cubes or slabs; the caption band at the foot is reserved; set type lives on the empty floor (HOOK, MONDAY) and nothing else is on screen under it. Counters change digits in place, tenth by tenth, and never slide. Result numbers (50.4 %, 13.4 %, 23.9, 82.2, 0.27 %) are the display size, at most two on screen. No axis tick except 0 and 100 on the board ruler; no per-column digit.

## Captions (Space Mono / DM Sans 28 u, one line, <= 50 characters, lay words; each holds >= 1.3 s + 0.06 s per character; starts on the 0.5 s grid)
| # | t0 | t1 | text |
|---|---|---|---|
| c1 | 0.5 | 5.0 | The best builder makes the best agent. |
| c2 | 5.5 | 11.5 | Does it? Test it on real customer cases. |
| c3 | 12.5 | 16.5 | Airline, shop and phone-line customer cases. |
| c4 | 17.0 | 20.0 | 320 cases. One tile each. |
| c5 | 20.0 | 23.5 | Six agent builds tried every case. |
| c6 | 24.0 | 27.0 | 1,920 tries. One cube each. |
| c7 | 27.5 | 31.0 | A lit cube is a try that passed. |
| c8 | 31.5 | 34.0 | 968 cubes are lit. |
| c9 | 34.5 | 38.5 | About half of the tries pass: 50.4 %. |
| c10 | 39.5 | 44.5 | Now turn the field. Each case becomes a column. |
| c11 | 45.0 | 49.0 | A column is one case, tried six ways. |
| c12 | 49.5 | 54.0 | Six different builds, not six repeats of one. |
| c13 | 54.5 | 59.5 | Look for columns that are all dark or all lit. |
| c14 | 60.0 | 64.5 | Sort the cases by how many builds solved them. |
| c15 | 64.5 | 68.0 | 44 cases: no build solved them. |
| c16 | 68.0 | 71.5 | 43 cases: every build solved them. |
| c17 | 71.5 | 75.0 | Now scatter the same wins at random. |
| c18 | 75.0 | 79.0 | Luck would leave 8.8 dark and 8.4 full. |
| c19 | 81.0 | 84.5 | Cut at six of six: 43 of 320 cases. |
| c20 | 84.5 | 88.5 | Only 13.4 % of cases are solved by all six. |
| c21 | 89.0 | 92.5 | Phone lines, regrouped by build. |
| c22 | 92.5 | 96.0 | Six builds: from 26.1 % to 52.1 %. |
| c23 | 97.5 | 101.5 | By kind of problem: 11.6 % to 67.7 %. |
| c24 | 101.5 | 105.5 | So the case matters more than the build. |
| c25 | 107.5 | 111.5 | Now the score: 53 tasks, four businesses. |
| c26 | 112.5 | 116.5 | The best builder scores 23.9 out of 100. |
| c27 | 117.5 | 121.5 | An expert who knows the test scores 82.2. |
| c28 | 122.5 | 126.0 | In banking: 5.9 against 79.8. |
| c29 | 128.0 | 132.0 | Last: what the builders asked the client. |
| c30 | 132.0 | 135.5 | 15,885 tool calls. One cube each. |
| c31 | 137.0 | 140.5 | 43 were questions to the client. |
Caption notes. "Six" renders buildsPer; "1,920" renders tries; "Phone lines" is the telecom plate (no digit). 43 in c16 and c19 is `full`, 43 in c31 is `asks` (same digits, two claims). From 140.5 to 150 no caption is in the band (the honest line is stage type). The wording never says "of simulations", "the same agent" for different builds, or "repeats".

## Knobs (every tunable a knob; defaults here; none carries an on-screen number)
tileT0 12.5, tileT1 17.0, cubeT0 20.0, cubeT1 23.5, litT0 27.5, litT1 31.0, m1T0 40.0, m1T1 41.6, m2T0 60.0, m2T1 61.6, ghostT0 71.5, ghostT1 74.5, m3T0 79.0, m3T1 80.6, j1T0 88.5, j1T1 90.1, m4aT0 90.5, m4aT1 92.1, m4bT0 95.5, m4bT1 97.1, j3T0 105.5, j3T1 107.1, taskT0 107.5, taskT1 110.0, slabT0 112.5, slabT1 113.7, planeBestT1 114.9, planeExpT0 117.5, planeExpT1 119.1, j4T0 126.0, j4T1 127.6, callT0 128.0, callT1 132.0, askT0 135.0, askT1 136.5, camFov 28, camPlanEl 89, camSideEl 30, camSideAz 18, cubeEdge (world) fixed, tileGap 0.35 cube, colsAir 9, colsRet 12, colsTel 12 (plate shapes), sheetCols 159, sheetRows 100, cutDim 0.18, ghostAlpha 0.35, bloomGain <= 0.1 on lit marks only, grainSigma 0.012, pinHold 8 frames, maxShown 6 within 1 s of a move and 12 at rest. Wave defaults kept: shutter 0.35 with accumulation for the master export, a 2-sample preview for iterations.

## Purity
render(t, state) recomputes every position and lit state from t and the data (pass bits of data/hyper-tau-matrix.json, scores of the claims); no Math.random, Date or performance in the renderer; the only seeded thing is ambient grain and drift (mulberry32, seed 20261011, fixed). The lit set is READ from the data, never sampled. The luck skyline is READ from the claims' per-k expectations (recompute section 1), never simulated at run time.

## Checks before building
- `python3 -I factory/topics/build-the-agent/data/recompute.py --check-claims --verify-upstream` passes (it did: 40 claims, 0 problems, copies identical to factory/topics/reliability-data).
- count.at 12.5 precedes every ratio (first at 34.5); hold >= 2.5 s on every new number (table above); every ratio >= 1.5 s after its count (50.4 % 3 s, 13.4 % after the 43 of 320 readout, 0.27 % 3 s).
- HOOK carries no digit and no cube. The honest line is on stage once, 143.0-150.0.
- Moves: no two heroes at once (camera OR marks); the carried plane and tanks ride their travel; every landing >= 1.5 s of settle before a pin.
- G5c: every visible SVG number is a claim value (counters show landed tenths only, each a claim-fraction list as in pass-every-time countTiles); G11 clean; page < 1.3 MB; film code < 120 KB; s/frame <= 1.5 (the 15,885-cube sheet is the dear scene: gl-instances flat-100k measured 0.25 s).
