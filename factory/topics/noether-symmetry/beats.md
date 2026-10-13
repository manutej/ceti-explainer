# Noether's symmetry · `noether-symmetry` · beats

id: `noether-symmetry` · format: **feature-long** · dur **153** s = material 0 to 150 s + CETI brand card 150 to 153 s (gate: 140 to 180, cap 183)
level: **manager** · renderer: **webgl** · chrome: **none** · material: **ink** · commit: **none** (D11) · film.json `"commit": {"enabled": false}`, no COMMIT chapter
brand: **ceti-coastal-dark** (arsenal/brands/ceti-coastal-dark.json: bg #161C1D, ink #F2F8F7, accent #B0F2E2, accent2 #9BCEF3, Fraunces 300 italic display, Space Mono, DM Sans; texture none). Check `stats().fallback` on the pointcloud: families outside arsenal/fonts/fonts.js fall back to Big Shoulders / Plex Mono (WARN, not FAIL).
windows: HOOK 0–12 · CASE 12–60 · COUNT 60–135 · MONDAY 135–150 · BRAND 150–153. count.at = **26.0** (the first count, 3,000 moments, lands; no %, ratio or "N of M" before 53.5 s)
chain (beat order): **gl-pointcloud** (REQUIRED: the 3,000 + 3,000 marks, two groups; `reveal`, `brush` for the cut, `dim`, id-stable `morph`) → **gl-camera-rig** (look-at the Earth pair, orbit ≤ 90° for the re-projection, slow drift, match cut to the network group) → **gl-labels** (every pin and callout, hard-cut at moves, `reserve` the caption band) → **formula-bind** (`product`: distance × speed, run twice, at the closest and the farthest point)
recipes: chain-recipes §2 R20 (3-D scatter with a brushed subset), R26 (a formula that computes on screen), R22 (camera as the argument + labels); grammar arsenal/frontier/R-E-perspective-shift.md (P2, P4, P6, P10, R1–R10, T1–T8)
data: `data/orbit_table.json` (300 orbits: spin shell, energy level, phase offset, 3×3 rotation → the film rebuilds the 3,000 states with the Kepler solution) · `data/network.json` (3,000 rows: run, shell, step, 3 PCA weight coordinates, 3 conserved coordinates c0 c1 c2, loss) · `data/orbits.json` (full state table, for checking, not shipped) · `data/recompute_out.json` · `recompute.py` prints every count and ratio; every digit below is a claim id in claims.json; sources and grades in sources.md

## Measured versus modelled (binding, shown on stage)
Only the Earth numbers (distances, speeds, their products, 0.011 %) are measured data. The 3,000 orbit dots and the 3,000 training dots are SIMULATED (exact Kepler states; a toy 2-layer ReLU net) and carry a small "SIMULATED" tag on every scene and every readout built from them. The conserved quantities of the orbit cloud are constant by construction; the film says "simulated" and never "we measured".

## Structures (at most 4; the brand card is not one)
| # | structure | lane | beats | what it is |
|---|---|---|---|---|
| S1 | The cloud | gl-pointcloud | CASE, COUNT | group 0: 3,000 dots, one per moment (300 orbits × 10); group 1: 3,000 dots, one per recorded training step (100 runs × 30). Position space first (tangle), then the conserved space: group 0 on 6 shells of the spin arrow (Lx, Ly, Lz), colour = energy level (5); group 1 on 3 shells of (c0, c1, c2) |
| S2 | The Earth pair | gl-pointcloud (brush) + gl-labels + formula-bind | CASE | two highlighted marks, "closest" and "farthest", and the product formula run twice; the only measured data in the film |
| S3 | The cut | gl-pointcloud `brushed` flag + a drawn plane | COUNT | a plane at Lz = 0; the 620 dots of the 62 orbits with |Lz| < 20 % of |L| stay lit, the rest `dim` (never removed) |
| S4 | The pins and the type | gl-labels + K.tx | all | counts and ratios as pins/callouts; HOOK, the smoke-ring plate, MONDAY as set type; no digit in HOOK |

## The moves (R-E sentence: [data op] under [camera], holding [invariant], landing on [view])
Named moves (the three the wave asks for) and the supporting ones. Invariants I1 same marks, I2 same count, I3 same scale, I4 same world, I5 same lens (R-E §0). ≤ 1 move per 8 s (start to start: 60.0, 78.5, 88.0, 112.0); every landing is a stored key so a seek is identical (T8).

| id | R-E | t | sentence | invariants held | landing view |
|---|---|---|---|---|---|
| **M1 re-projection: place → spin** | P10/P2 | 60.0–68.0 (8 s, ease inOut) | **re-project** each dot from (x, y, z) in space to the tip of its orbit's spin arrow (Lx, Ly, Lz) under an orbit of 70° az, el 20°, holding id-stable dots | I1 each of 3,000 dots keeps its id, orbit id and colour (no fade, no add); I2 the readout `count(t)` = 3,000 on the first and last frame of the move; I3 dot radius fixed; I5 fov fixed (30°); dots of one orbit travel to ONE point | the 300 specks on 6 shells, settle 68.0–70.5 |
| **M3 cut plane through the shells** | P6 | 78.5–83.5 (5 s, camera hold + drift ≤ 8°) | **slice** at Lz = 0: a plane enters from above and stops at the equator; dots outside the band `dim` (never leave) | I1–I4; the lit count snaps to whole orbits: 62 orbits, 620 dots (the band is 20 % of |L|, a knob) | six rings of specks, readout settled |
| **M2 re-partition by symmetry: shells → layers** | P2 | 88.0–96.0 (8 s, orbit 60°) | **re-partition** the 300 specks from 6 shells (rotation symmetry) into 5 layers by energy (time-shift symmetry): the 10 dots of an orbit travel together, no fade | I1 same 3,000 dots; I2 3,000 before and after; I3; I5 | 5 stacked discs of 6 rings, settle 96.0–97.5 |
| M4 the same re-projection in a network | P10/P2 | 112.0–119.0 (7 s, orbit 60°) | **re-project** each training dot from weight space (3 PCA axes) to its run's invariant triple (c0, c1, c2) | I1 same 3,000 dots (group 1); I2 3,000 before and after; I3; I5 | the 100 specks on 3 shells, settle 119.0–121.0 |
| M5 (not a move) scene changes | cut | 31.0–34.0 look-at/dolly to the Earth pair (cloud `dim`, no data change); 102.0–103.5 match cut to group 1 (the camera key changes, group 0 stays in the world) | different datasets, so I1–I2 do not apply across them; each side starts and ends on a stored key | |
Also: group 0 ARRIVES at 14.0–26.0 and group 1 at 103.5–108.5 as count-ins (new dots appear, camera still); these are count-ins, not moves.

## Beat table
| beat | t (s) | what happens | claims |
|---|---|---|---|
| HOOK | 0.0–12.0 | Dark coast floor, faint grid, STILL camera (no move before 12 s). Set type fades in (Fraunces 300 italic, bone on ink): the belief, then the doubt. No digit, no dot. | none |
| CASE | 12.0–14.0 | small plate under the empty floor: "Emmy Noether · 1918" | noetherYear |
| | 14.0–26.0 | group 0 counts in, 3,000 dots in position space (x, y, z), plain tangle, ambient drift ≤ 1°; tag "SIMULATED" | |
| | 26.0 (hold to 28.5) | pin "3,000 moments · 300 orbits" (the first count lands; one new number pair, one hold) | states, orbits |
| | 28.6–31.0 | tag "SIMULATED, units G·M = 1"; the cloud stays a tangle | |
| | 31.0–34.0 | camera look-at + dolly to two highlighted marks beside a Sun mark (not to scale: the 3.4 % is invisible by design); cloud dims | |
| | 34.0 (hold to 36.5) | pin "closest to the Sun · 147.095 million km" | rp |
| | 36.5 (hold to 39.0) | pin "30.29 km/s" | vp |
| | 39.0 (hold to 41.5) | pin "farthest · 152.100 million km" | ra |
| | 41.5 (hold to 44.0) | pin "29.29 km/s" | va |
| | 44.0–47.5 | formula-bind (product): "distance × speed" binds, flies and computes for the closest end | |
| | 47.5 (hold to 50.0) | result "4,455.5" | rvPeri |
| | 50.0–50.5 | formula resets to the farthest end | |
| | 50.5 (hold to 53.0) | result "4,455.0" | rvAph |
| | 53.5 (hold to 56.5) | callout "only 0.011 % apart" (a ratio: after the count at 26.0 and ≥ 1.5 s after the last number) | rvDiffPct |
| | 56.5–60.0 | cloud returns to full colour; plate "closer: faster · farther: slower · the product stays"; a pin labels the idea: "spin = how much an orbit swirls (angular momentum)" | |
| COUNT | 60.0–68.0 | **M1** place → spin arrow | |
| | 68.0–70.5 | settle; pin "same 3,000 dots" (no new digit besides the claim) | states |
| | 70.5 (hold to 73.0) | pin "300 specks" on the specks (callout of one speck: its 10 dots sit on top of each other, a leader to a stack) | orbits, perOrbit |
| | 73.0 (hold to 75.5) | pin "6 shells" on a shell | lShells |
| | 75.5 (hold to 78.5) | callout "inside one orbit: spin and energy vary by less than 1 in a trillion"; a ghost label from the first scene "positions swing by about half" | trillion, posRelPct (word) |
| | 78.5–83.5 | **M3** cut plane | |
| | 85.0 (hold to 87.5) | readout "62 orbits lit · 620 of 3,000 dots" | cutOrbits, cutMarks, states |
| | 88.0–96.0 | **M2** shells → layers | |
| | 97.5 (hold to 100.0) | pin "5 layers" on a disc (settle 96.0–97.5) | eLevels |
| | 100.0–102.0 | plate: "Rotation gives the shells. Time gives the layers." (the table of what each symmetry gives is words only; a third row, "a shift in place gives momentum", appears greyed: not used, the Sun is the centre) | |
| | 102.0–103.5 | match cut to group 1 (camera key); group 0 dims to a ghost at the left of the frame | |
| | 103.5–108.5 | group 1 counts in: 3,000 dots, one per recorded step of 100 training runs of a tiny network; tag "SIMULATED · a tiny network, 16 units" | hidden |
| | 108.5 (hold to 111.0) | pin "3,000 steps · 100 runs" (second count) | netStates, netRuns |
| | 111.0–112.0 | plate "Known since 2018: some sums stay fixed while a network trains" with the formula as type: "(in-weights)² − (out-weight)² for each unit" | duYear |
| | 112.0–119.0 | **M4** weight space → conserved space | |
| | 121.0 (hold to 123.5) | pin "3 shells" | netShells |
| | 123.5 (hold to 126.0) | pin "weights travelled 0.24" (median per run) | wMove |
| | 126.0 (hold to 128.5) | pin "the sum moved 0.00095" | cMove |
| | 128.5 (hold to 131.5) | callout "about 250 times less" (a ratio: after both counts, ≥ 1.5 s after the last number) | netRatio |
| | 131.5–135.0 | camera eases back; plate on the shells: "Smoke rings too (Kelvin, 1869): swap which air is which, the swirl stays." | kelvinYear |
| MONDAY | 135.0–141.0 | wide frame: the orbit shells (left) and the network shells (right) side by side, the bookend of "the same picture twice"; set type: the question to ask at work | none |
| | 141.5–150.0 | the honest line ON STAGE as one line of set type (no caption in the band during it): "Simulated orbits, a toy network, ideal laws: real systems drift a little." | none |
| BRAND | 150.0–153.0 | plain ground card: CETI wordmark, takeaway "Every symmetry hides something that stays." (42 chars) | |

## Labels (gl-labels)
Pins are solved in screen space, `reserve` = the caption band read from the kit. Result-role labels (4,455.5, 4,455.0, 0.011 %, about 250 times) are ≥ 28 u display and at most 2 on screen; none of 3,000, 300, 62, 620, 147.095 is in the smallest face. At each move start, labels hard-cut off and hard-cut on after the settle (R5). No label in the caption band while a caption shows. Axes are NOT labelled with digits (no tick numbers); the axis names are words ("where", "spin"). The three PCA axes of the weight picture carry no label at all (they have no meaning to read).

## Captions (Space Mono/DM Sans 28 u, ≤ 60 chars; no digit without a claim)
| # | t0 | t1 | text |
|---|---|---|---|
| c1 | 0.8 | 5.8 | Everything moves. A few things never change. |
| c2 | 6.2 | 11.6 | A rule handed down? Or something that follows? |
| c3 | 12.4 | 19.8 | In 1918, Emmy Noether found where such rules come from. |
| c4 | 20.0 | 25.8 | Each dot is one moment of one orbit. |
| c5 | 26.0 | 28.4 | 3,000 dots: ten moments of each of 300 orbits. |
| c6 | 28.6 | 30.8 | Simulated orbits: tangled, no pattern. |
| c7 | 31.2 | 33.8 | Now one real orbit: Earth around the Sun. |
| c8 | 34.0 | 36.4 | Closest to the Sun: 147.095 million km. |
| c9 | 36.6 | 38.9 | Speed there: 30.29 km/s. |
| c10 | 39.1 | 41.4 | Farthest: 152.100 million km. |
| c11 | 41.6 | 43.9 | Speed there: 29.29 km/s. |
| c12 | 44.1 | 47.3 | Multiply distance by speed. |
| c13 | 47.5 | 49.9 | Closest: 4,455.5. |
| c14 | 50.5 | 52.9 | Farthest: 4,455.0. |
| c15 | 53.5 | 56.4 | Only 0.011 % apart. |
| c16 | 56.8 | 59.8 | Why does it stay? Back to the 3,000 dots. |
| c17 | 60.4 | 67.6 | Re-plot each orbit by its spin, not its place. |
| c18 | 68.2 | 70.4 | Same 3,000 dots. |
| c19 | 70.6 | 72.9 | 300 orbits, 300 specks. |
| c20 | 73.2 | 75.4 | The specks sit on 6 shells. |
| c21 | 75.6 | 78.4 | Spin and energy: under 1 in a trillion apart. |
| c22 | 78.8 | 83.4 | Slice through the shells. Each cut shows rings. |
| c23 | 85.0 | 87.4 | 62 orbits lit: 620 of the 3,000 dots. |
| c24 | 88.2 | 95.8 | Regroup the same dots by energy. |
| c25 | 97.5 | 99.9 | Energy sorts them into 5 layers. |
| c26 | 100.2 | 101.9 | Rotation gives shells. Time gives layers. |
| c27 | 102.2 | 104.0 | Now no planets: a tiny network learning. |
| c28 | 104.2 | 108.4 | Each dot is one step of training. |
| c29 | 108.6 | 110.9 | 3,000 steps from 100 runs. |
| c30 | 111.1 | 113.8 | Known since 2018: some sums stay fixed. |
| c31 | 114.0 | 118.8 | Re-plot each run by the sum that should not change. |
| c32 | 121.0 | 123.4 | The same picture: 3 shells. |
| c33 | 123.6 | 125.9 | The weights travel 0.24. |
| c34 | 126.1 | 128.4 | The fixed sum moves 0.00095. |
| c35 | 128.6 | 131.4 | About 250 times less. |
| c36 | 131.6 | 134.8 | Smoke rings too (Kelvin, 1869): same swirl. |
| c37 | 135.3 | 140.8 | Monday: what stays fixed in your data while it moves? |
| (none) | 141.5 | 150.0 | the honest line is stage type; no caption in the band |
Caption notes. "1918" renders noetherYear; "ten" renders perOrbit; "1 in a trillion" renders trillion; "2018" renders duYear; "1869" renders kelvinYear. c3 sits over the count-in start (14.0) by 5.8 s; c4 names the unit before the count lands. The words "spin" (angular momentum) and "energy" are each pictured the first time they appear: spin as an arrow from the speck's orbit (pin at 56.5), energy as colour (legend swatches at 70.5).

## Knobs (every tunable a knob; defaults here)
camFov 30, camElMain 20, camAzM1 70, m1T0 60 m1T1 68, m3T0 78.5 m3T1 83.5, m2T0 88 m2T1 96, m4T0 112 m4T1 119, cutBandPct 20 (a claim param; changes cutOrbits and cutMarks, which then change), cutPlaneOp 0.18, dotR 2.6, dotRNet 2.6, dimOthers 0.22, morphEase inOut, ambientDriftDeg 1 (≤ 3 at holds), pinHold 8 frames, maxShown 6 within 1 s of a move and 12 at rest, earthPairOffset (visual only), fogMax 0.3 (manager level: fog ≤ 0.3, `dof: null`), orbitSeed 20261010 and netSeed 20261011 (baked into data/, not recomputed at runtime), netQuant 3 (decimals kept for the page).

## Purity
render(t, state) recomputes dot positions and colours from t and the data files; no Math.random/Date/performance in the renderer; the 3,000 orbit states are rebuilt from data/orbit_table.json by the Kepler solution (Newton on E − e sin E = M, 60 iterations, no randomness); the network rows are READ from data/network.json, never trained at run time. Counts are `count(t)` of the pointcloud and must equal the claim values on the first and last frame of each move.

## Checks before building
- count.at 26.0 precedes every ratio (53.5 first); hold ≥ 2.5 s on every new number (table above; 34.0–36.5, 36.5–39.0, 39.0–41.5, 41.5–44.0, 47.5–50.0, 50.5–53.0, 53.5–56.5, 108.5–111.0 etc.); a ratio ≥ 1.5 s after its count.
- Moves start 60.0, 78.5, 88.0, 112.0: min gap 9.5 s (rule ≤ 1 per 8 s); every landing ≥ 1.5 s of settle before a pin (68.0→70.5, 83.5→85.0; 96.0→97.5; 119.0→121.0).
- HOOK carries no digit and no dot. The honest line is on stage once, 141.5–150.
- Text overlap (G11): the stage-type plates at 111.0, 131.5, 135.0 and 141.5 are alone in their windows; no plate overlaps a pin.
- Module gaps to close in the draft (brief F4): id-stable morph in gl-pointcloud, a drawn cut plane, two groups in one cloud.
