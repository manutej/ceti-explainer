# Noether applied · `noether-applied` · beats

id: `noether-applied` · format: **feature-long** · dur **153** s = material 0 to 150 s + CETI brand card 150 to 153 s (gate: 140 to 180, cap 183)
level: **manager** · renderer: **webgl** · chrome: **none** · material: **ink** · commit: **none** (D11) · film.json `"commit": {"enabled": false}`, no COMMIT chapter
brand: **ceti-coastal-dark** (roles only: accent = the one that keeps, accent2 = the plain one, muted = ghosts, rings and the stand-in protein; Fraunces 300 italic display, Space Mono, DM Sans; texture none)
windows: HOOK 0-12 · CASE 12-62 · COUNT 62-135 · MONDAY 135-150 · BRAND 150-153. count.at = **26.0** (the first count, 1,000 snapshots per stepper, lands; no ratio before 51.0 s)
chain (beat order): **gl-pointcloud** (REQUIRED: id-stable morph; groups: A keeper 1,000 + plain 1,000; B network 10,000; C spring 200 + 200; D protein 2,180) -> **gl-camera-rig** (orbit <= 70 deg per move, one crane, a full turn of the input) -> **gl-labels** (corner tag, followed-dot pins, hard-cut at every move) -> **gl-ribbons** (fluids only; film-local mesh allowed, brief F5)
recipes: chain-recipes section 2 R20 (3-D scatter), R22 (camera as the argument + labels), R19 (flow in depth, adapted); grammar arsenal/frontier/R-E-perspective-shift.md
data: `data/trace_verlet.csv`, `data/trace_rk4.csv` (1,000 rows each: step, x, y, vx, vy, dE_rel, dL_rel, a_ratio) · `data/ml_traces.csv` (400 rows: model, t, q, p, E_true) · part 1's `../noether-symmetry/data/network.json` (10,000 rows, reused unchanged) · `data/kelvin_loop.csv` (30 frames x 2,000 parcels; ship delta-coded) · `data/recompute_out.json` · `recompute.py` (`--run` rebuilds the caches, about 4 min; default reads them; `--check` compares claims.json) · `data/trace.c`, `verlet_vs_rk4.c`.

## Measured versus modelled (binding, shown on stage)
Published numbers: 170 and 0.38 (Greydanus 2019), 2,180 (Jumper 2021), the years. Everything drawn as dots or ribbons is SIMULATED (integrator runs: exact code, our orbit; toy network pair; point-vortex loop; stand-in chain). Corner tag per scene: SIMULATED, plus PUBLISHED NUMBER on the Greydanus rows. Nothing says "we measured".

## The picture of each scene (same move, four times: dots -> sorted by what stays -> a dot that cannot leave its shell)
| scene | dots | position view (belief) | sorted view (reversal) | shell |
|---|---|---|---|---|
| 1 integrators | 1,000 snapshots per stepper, accent = keeper, accent2 = plain | from above: x, y of the planet at each snapshot, rings look alike; z = steps on a log scale | each snapshot re-plotted by its orbit size (a/a0) and energy off, error stretched for the eye (said in words, no digit); height = steps | a thin tube at a/a0 = 1: keeper dots stay inside; plain dots leave (shrink inward, then fly out) |
| 2a balanced layers | 10,000 training steps, 100 runs (part 1 fixture) | weight space: streaks | the gap between layers per run: 3 shells | run dots do not leave their shell |
| 2b energy-keeping net | 200 snapshots per network, one swinging spring | phase plane (position, momentum) x time: a cylinder | same plot: the plain network's ring drifts outward, the energy-keeping one stays on the ring | ring of the starting energy |
| 3 weather | 2,000 parcels of one loop, 25 strands as ribbons rising with time | the loop at t = 0, a round ring | the loop at the end: stretched 5.5 times and folded; ribbons show the paths | wordless: the "swirl number" is a ring of constant colour, no digit |
| 4 equivariance | 2,180 residues, stand-in chain | the chain, one pose | turned by a random rotation, the output arrows turn with it; a ghost of the old pose stays | not conservation: the shape stays |

## Moves (R-E sentence: [data op] under [camera], holding [invariant], landing on [view]); <= 1 per 8 s (starts 34.0, 74.5, 113.0, 127.5)
| id | R-E | t | sentence | invariants | landing |
|---|---|---|---|---|---|
| **M1 re-plot: place -> what should stay** | P10/P2 | 34.0-42.0 (8 s, inOut) | **re-project** each snapshot from (x, y, steps) to (orbit size, energy off, steps) under a 60 deg orbit and a tilt from top to side, holding id-stable dots | same 2,000 dots, same colours, no fade; `count` = 2,000 on first and last frame | keeper column thin, plain dots peeling off; settle 42.0-44.5 |
| **M3 re-plot: weights -> layer gap** | P10/P2 | 74.5-81.5 (7 s) | **re-project** each training step from 3 weight axes to the 3 layer-gap axes, orbit 60 deg | same 10,000 dots; `count` = 10,000 both ends | 3 shells, one dot per run stays inside its shell; settle 81.5-83.0 then readout |
| **M4 crane over the loop** | P4 | 113.0-121.0 | **crane** from the flat ring (t = 0) to an oblique view of the ribbons rising with time, the loop at the end drawn as dots | same 2,000 parcels | long thin folded ring with ribbons under it |
| **M5 turn the input** | P6 | 127.5-134.5 | **orbit** the camera 0 deg while the chain rotates one full turn about a tilted axis; the output arrows rotate with it; a muted ghost of the first pose stays | same 2,180 dots; arrows tied to dot ids | the chain in its first pose, arrows aligned |
Count-ins (not moves): scene 1 dots arrive 14.0-26.0 (camera rises along the steps axis, <= 20 deg); scene 2a 64.0-72.0; scene 2b 91.0-97.0 (400 dots, camera still). Match cuts (camera key change, stored key at each side): 62.0 to scene 2a; 89.0 to scene 2b; 110.0 to scene 3; 122.5 to scene 4. Holds >= 2.5 s on every new number.

## Beat table
Numbers land in the fixed readout panel (right third, at most two rows), not as flying pins; gl-labels only for the followed dot, the shell name and hard-cut callouts. Time t in s.
| beat | t | what happens | claims |
|---|---|---|---|
| HOOK | 0.0-12.0 | Dark floor, grid, STILL camera. One accent dot circles one ellipse (part 1's picture), faint ghost of the shell. Set type: the question "Where is this used today, outside quantum physics?" fades in at 6 s and stays. No digit. | none |
| CASE | 12.0-14.0 | corner tag "SIMULATED · a planet, stepped by a computer" | |
| | 14.0-26.0 | scene 1 count-in: 2,000 dots in the position view | |
| | 26.0 (hold to 28.5) | readout row "1,000 snapshots each" (first count lands) | snapshots |
| | 28.6 (hold to 31.1) | readout row "1,000,000,000 tiny steps" | steps |
| | 31.4-34.0 | caption only: from above the two look the same (belief) | |
| | 34.0-42.0 | **M1** | |
| | 44.5 (hold to 47.0) | readout row, keeper: "energy off by at most 0.007 %" | verletEPct |
| | 47.0 (hold to 49.5) | readout row, plain: "1.9 % off after 10,000,000 steps" | compareSteps, rk4EPct1e7 |
| | 51.0 (hold to 53.5) | callout "about 270 times more error" (ratio: after the count at 26.0 and 1.5 s after the last number) | integratorRatioWords |
| | 53.5 (hold to 56.0) | readout row, plain: "thrown out by 65 million steps" (plain dots fly off the shell, camera still, labels already on) | rk4StepsGone |
| | 56.0 (hold to 58.5) | readout row, keeper: "spin right to 11 places" | verletLPlaces |
| | 58.7-62.0 | caption: where it is used (whole solar systems); camera eases back to the tube | |
| COUNT | 62.0-64.0 | match cut to scene 2a; tag "SIMULATED · a small network learning" | |
| | 64.0-72.0 | 10,000 dots count in (weight space, tangle) | |
| | 72.0 (hold to 74.5) | readout row "10,000 steps from 100 runs" (second count) | netStates, netRuns |
| | 74.5-81.5 | **M3**; plate (type) "Known since 2018" with tag "Du, Hu, Lee" | duYear |
| | 83.0 (hold to 85.5) | row "weights travelled 0.24" | wMove |
| | 86.0 (hold to 88.5) | row "the layer gap moved 0.00095" | cMove |
| | 89.0-91.0 | match cut to scene 2b; tag "SIMULATED picture · PUBLISHED numbers (Greydanus et al. 2019)" | hnnYear |
| | 91.0-97.0 | 400 dots arrive (two networks, one swinging spring) | |
| | 97.0 (hold to 99.5) | row "200 units · 2,000 training steps each" (counts) | hnnHidden, hnnTrainSteps |
| | 100.0 (hold to 102.5) | row, plain network: "energy error 170" | hnnBase |
| | 102.5 (hold to 105.0) | row, energy-keeping network: "0.38" | hnnHam |
| | 106.5 (hold to 109.0) | callout "about 450 times lower" (ratio) | hnnRatioWords |
| | 110.0-112.0 | match cut to scene 3; tag "SIMULATED · air, stirred"; no row, no digit | |
| | 112.2-122.5 | loop ring, then **M4** 113.0-121.0, ribbons draw on; captions only | |
| | 122.5-124.5 | match cut to scene 4; tag "SIMULATED · a stand-in chain" | |
| | 124.5 (hold to 127.0) | row "2,180 residues" (third count) | residues |
| | 127.5-134.5 | **M5** | |
| MONDAY | 135.0-141.0 | wide frame: the four sorted pictures as four small ghost clouds in a row (tube, shells, ribbon fold, chain), no text over them; caption = the question | none |
| | 141.5-150.0 | the honest line ON STAGE, one line of set type, no caption in the band: "Pictures are simulated. Big steps break it. A turn saves no number." | none |
| BRAND | 150.0-153.0 | plain ground, CETI wordmark, takeaway "Find what stays. Then build so it does." | |

## Captions (28 u, one line, one idea, <= 60 chars; no digit without a claim)
| # | t0 | t1 | text |
|---|---|---|---|
| c1 | 0.8 | 5.8 | Last time: a number that never changes. |
| c2 | 6.2 | 11.6 | Where is that used today, outside quantum physics? |
| c3 | 12.4 | 19.8 | First: a computer moves a planet in tiny steps. |
| c4 | 20.0 | 25.8 | Each dot is a snapshot of that planet. |
| c5 | 26.0 | 28.4 | 1,000 snapshots from each of two ways of stepping. |
| c6 | 28.6 | 31.0 | 1,000,000,000 tiny steps each. |
| c7 | 31.4 | 33.8 | From above, the two look the same. |
| c8 | 34.2 | 41.8 | Now sort by the number that should stay. |
| c9 | 42.2 | 44.3 | One stays on its shell. The other leaves. |
| c10 | 44.5 | 46.8 | The energy-keeper never strays more than 0.007 %. |
| c11 | 47.0 | 49.3 | The plain way: 1.9 % off after 10,000,000 steps. |
| c12 | 51.0 | 53.3 | About 270 times more error. |
| c13 | 53.5 | 55.8 | Then it is thrown out: by 65 million steps. |
| c14 | 56.0 | 58.3 | The spin number stays right to 11 places. |
| c15 | 58.7 | 61.8 | Astronomers run whole solar systems this way. |
| c16 | 62.4 | 71.8 | Next: machines that learn. Each dot is one step. |
| c17 | 72.0 | 74.4 | 10,000 steps from 100 training runs. |
| c18 | 74.8 | 81.2 | Sort by the gap between two layers. |
| c19 | 83.0 | 85.4 | The weights travelled 0.24. |
| c20 | 86.0 | 88.4 | The gap between layers moved 0.00095. |
| c21 | 89.4 | 96.8 | Teach two networks a swinging spring. |
| c22 | 97.0 | 99.4 | Same size: 200 units, 2,000 training steps. |
| c23 | 100.0 | 102.3 | The plain network, energy error: 170. |
| c24 | 102.5 | 104.8 | The energy-keeping network: 0.38. |
| c25 | 106.5 | 108.9 | About 450 times lower. |
| c26 | 112.2 | 116.2 | Weather: tag a loop of air and follow it. |
| c27 | 116.4 | 119.2 | The loop stretches and folds. |
| c28 | 119.4 | 122.4 | The swirl around it stays the same. |
| c29 | 124.5 | 126.9 | One dot per residue: 2,180 in one chain. |
| c30 | 127.6 | 131.2 | Turn the protein. The answer turns with it. |
| c31 | 131.6 | 134.8 | What stays is its shape, not a saved number. |
| c32 | 135.3 | 140.8 | Monday: what must never change in your system? |
| (none) | 141.5 | 150.0 | the honest line is stage type; no caption in the band |
Caption notes. Digits and their claims: "1,000" snapshots; "1,000,000,000" steps; "0.007 %" verletEPct; "1.9 %" rk4EPct1e7; "10,000,000" compareSteps; "270" integratorRatioWords; "65 million" rk4StepsGone; "11 places" verletLPlaces; "10,000" netStates; "100" netRuns; "0.24" wMove; "0.00095" cMove; "200", "2,000" hnnHidden, hnnTrainSteps; "170" hnnBase; "0.38" hnnHam; "450" hnnRatioWords; "2,180" residues; "2018" duYear; "2019" hnnYear. c15 has no digit (Wisdom-Holman, Laskar-Gastineau, S3). c26-c28 and c31 have no digit by the director's rule.

## Labels (gl-labels)
Readout rows: fixed panel, right third, label in the smallest face, value at >= 28 u; numbers update in place, never fly. Pins only: the followed dot (one keeper dot, one plain dot) with leaders outside the cloud's silhouette; the shell name ("energy shell", "layer-gap shell", "starting ring"). At each move start all labels hard-cut off and hard-cut on after the settle (R5). No label in the caption band while a caption shows; the cloud's projected bounds stay clear of the panel and the tag (G11). Axes: words only ("where it is" -> "what should stay", "more steps" up), no ticks.

## Knobs (every tunable a knob; defaults)
camFov 30, camElMain 20, camAzM1 60, m1T0 34 m1T1 42, m3T0 74.5 m3T1 81.5, m4T0 113 m4T1 121, m5T0 127.5 m5T1 134.5, dotR 1.0-1.3 world units (about 1 per the series note) with depth size cue, keeperBright +15 % (not bigger), errorStretch (radial error gain for scene 1 and 2b; a word on stage, never a digit), dimOthers 0.22, ambientDriftDeg 1 (<= 3 at holds), ribbonStrands 25, ribbonWidth constant (width = the same swirl), nodes: none.

## Purity
render(t, state) recomputes dot positions and colours from t and the data files; no Math.random / Date / performance in the renderer; trace, ml and kelvin tables are read as stored (delta-coded Int16 for kelvin); the stand-in chain is rebuilt from the seed in recompute.py D (or stored); the network table is part 1's network.json.

## Checks before building
- count.at 26.0 precedes every ratio (first ratio 51.0 s); every ratio >= 1.5 s after the last number (49.5 -> 51.0; 105.0 -> 106.5).
- Moves start 34.0, 74.5, 113.0, 127.5 (min gap 14.0 s; rule <= 1 per 8 s); landings settle >= 1.5 s before a row (42.0 -> 44.5; 81.5 -> 83.0).
- HOOK carries no digit and no number-claim; the honest line is on stage once, 141.5-150; the card is last.
- At most three text elements besides the caption on any frame (readout panel, tag, one pin); G11 text overlap clean.
- Every on-screen digit is in claims.json with `renders`; weather beat shows none; Kelvin year is not printed.
- Module gaps to close in the draft: id-stable morph (film-local, F6), ribbon mesh for a time-extruded loop (F5), ghost pose in scene 4.
- Cloud sizes: 2,000 / 10,000 / 400 / 2,180 / 2,000 parcels; page < 1.3 MB (kelvin delta-coded; trace tables are 130 KB each as text, round to 6 digits).
