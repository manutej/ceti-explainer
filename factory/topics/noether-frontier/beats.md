# Noether at the frontier · `noether-frontier` · beats (Wave NOETHER, Part 3)

id: `noether-frontier` · format: **feature-long** · dur **153** s = material 0 to 150 s + CETI brand card 150 to 153 s (gate: 140 to 180, cap 183)
level: **manager** · renderer: **webgl** · chrome: **none** · material: **ink** · commit: **none** (D11) · film.json `"commit": {"enabled": false}`, no COMMIT chapter
brand: **ceti-coastal-dark** (arsenal/brands/ceti-coastal-dark.json, same family as Part 1: bg #161C1D, ink #F2F8F7, accent #B0F2E2, accent2 #9BCEF3, Fraunces 300 italic display, Space Mono, DM Sans; texture none). Check `stats().fallback` on the pointcloud: families outside arsenal/fonts/fonts.js fall back (WARN, not FAIL).
windows: HOOK 0–12 · CASE 12–62 · COUNT 62–135 · MONDAY 135–150 · BRAND 150–153. **count.at = 21.0** (the first count, 30,000 dots, lands on the panel; no %, ratio or "N of M" before 115.1 s; no digit at all before 21.0)
chain (beat order): **gl-pointcloud** (REQUIRED: group 0 = 30,000 recall dots, group 1 = 24,000 training dots; `reveal`, `dim`/ghost, id-stable `morph` between coordinate sets, per-dot `feature rank` for the comet) → **gl-camera-rig** (4 moves, drift ≤ 3° at holds, match cuts) → **gl-labels** (the panel, the corner tag and the one pin placed by `solve` with `reserve` = caption band; hard-cut at moves) → **gl-instances** (the toy of 3 marks and its 6 rows; the 19-node question tree; `layout scatter` with explicit x, y from data/question_tree.json and data/toy.json). formula-bind is NOT used (the toy sum is a static panel line "4 + 7 + 9 = 20", digits are claims).
recipes: chain-recipes §2 R20 (3-D scatter with a brushed subset), R22 (camera as the argument + labels); grammar arsenal/frontier/R-E-perspective-shift.md (P2, P10, R1–R10, T1–T8)
data (all under factory/topics/noether-frontier/data/, sizes after `--write`): `neurons.json` (238 KB compact: 480 neurons × 50 moments × (a, b) for the small and the big step, ×1000, delta coded; quantise to 2 decimals if the page nears 1.3 MB) · `question_tree.json` (19 nodes: id, level, parent, deterministic x, y; **titles are never drawn**) · `toy.json` (the 6 orders and the toy model's colours) · the recall cloud is **Part 1's** `factory/topics/noether-symmetry/data/orbit_table.json` (300 orbits × 100 moments, rebuilt by the Kepler solution; not copied) · `recompute.py` prints every count and every check; every digit below is a claim id in claims.json.

## Measured versus modelled (binding, shown on stage by the corner tag)
Nothing in this film is measured by us. Four kinds of picture, four tags, each from its first frame to its last:
- **RECAP · SIMULATED** (0–12) and **SIMULATED** (12–28): Part 1's 30,000 orbit dots, exact Kepler states.
- **ILLUSTRATION · SIMULATED** (28–38.5): our plain blind search over 22 simple terms (it is NOT Liu and Tegmark's program; it finds 4 constants, the same four Part 1 used). **ILLUSTRATION** (98.5–115): the toy of 3 sub-answers, numbers chosen by the author.
- **PUBLISHED RESULT** (38.5–50.5 and 115–119): a number and a name from a paper, cloud dimmed to a ghost so no dot is read as their data.
- **SIMULATED · A TINY NETWORK** (50.5–98.5): 60 runs of a toy ReLU net, 8 neurons, trained here.
- **PROGRAM, NOT A THEOREM** (119–150): from the first frame of the tree scene to the last frame of the material. Counts in that scene are counts of the tree (what exists); nothing is measured and nothing is called a charge.

## Structures (at most 4 plus the toy; the brand card is not one)
| # | structure | lane | beats | what it is |
|---|---|---|---|---|
| S1 | The recall cloud | gl-pointcloud group 0 | HOOK, CASE 12–50 | 30,000 dots, one per moment of one orbit (300 × 100). Two coordinate sets: place (x, y, z) and spin (Lx, Ly, Lz); colour = energy level (5), shells = spin length (6) as in Part 1. One orbit's 100 dots a little brighter in HOOK |
| S2 | The training cloud | gl-pointcloud group 1 | CASE 50.5 – COUNT 98.5 | 24,000 dots, one per neuron per moment (60 × 8 × 50). Three coordinate sets: place P = (a, b, time) with a = size of the in-weights, b = size of the out-weight; sum C = (a, b, a² − b²) for the small step; sum-big C′ = (a, b, a² − b²) for the big step. Colour = starting layer (5) |
| S3 | The question marks | gl-instances | COUNT 98.5–119 | the toy: 3 big marks in a row, then 6 rows (the 6 orders); row colour = the answer (one colour when the total is the same; six colours for the order-sensitive toy model). **Never a swarm of "answer dots"**: nothing here is data |
| S4 | The question tree | gl-instances | COUNT 119–135, MONDAY | 19 boxes (level colour 4/8/7), thin bars for parent links, from data/question_tree.json. No text on nodes. At 131–135 the two children of Q2 swap places (a drawn re-ordering); one node keeps a ring (the candidate) |

## The moves (R-E sentence: [data op] under [camera], holding [invariant], landing on [view])
Invariants I1 same marks, I2 same count, I3 same scale, I4 same world, I5 same lens (R-E §0). ≤ 1 move per 8 s (start to start: 12.0, 28.0, 62.0, 88.0; min gap 16 s); every landing is a stored key so a seek is identical (T8). Four perspective shifts (the format wants ≥ 3).

| id | R-E | t | sentence | invariants held | landing view |
|---|---|---|---|---|---|
| M0 un-sort | P10/P2 | 12.0–20.0 (8 s, ease inOut) | **re-project** each recall dot from the tip of its orbit's spin arrow (Lx, Ly, Lz) to where the planet is (x, y, z) under an orbit of +50° az, el 20°, holding id-stable dots | I1 each of 30,000 dots keeps id, orbit id, colour (no fade, no add); I2 count 30,000 on the first and last frame; I3 dot radius; I5 fov 30° | the tangle, settle 20.0–21.0 |
| M1 blind search | P10/P2 | 28.0–36.0 (8 s, ease inOut) | **re-project** the same dots from place back to spin under an orbit of −50° az, holding id-stable dots | as M0; the landing equals the HOOK frame up to the camera key | 6 shells, settle 36.0–38.5 |
| M2 training re-project | P10/P2 | 62.0–70.0 (8 s, orbit 60°) | **re-project** each training dot from (a, b, time) to (a, b, a² − b²) under an orbit of 60° az, el 22° → 15°, holding id-stable dots | I1 24,000 dots, neuron ids, colours; I2 24,000 first/last; I3; I5 | 5 flat layers (each layer: dots on one hyperbola), settle 70.0–72.5 |
| M3 bigger steps | P2 | 88.0–96.0 (8 s, dolly + el 15° → 6°) | **re-partition** each dot (same neuron, same moment, same start) from its small-step place to its big-step place, camera lowering until the layers are seen edge-on | I1 same 24,000 ids; I2; I3; I5 (dolly ≤ 15 %) | layers smeared; median drift of the sum 0.10, a fifth of the gap between layers (claim driftBigMedian, off screen) |
Not moves: group 0 reveal 0.0–3.0; group 1 count-in 50.5–56.5 (camera still, new dots appear, group 0 removed by the cut); the comet 80.0–88.0 (a per-dot light that runs along each neuron's arc in step order; camera drift ≤ 3°); scene cuts at 98.5 (toy), 119.0 (tree); the sibling swap 131.0–135.0 (two marks exchange places over 3 s; nothing else moves).

## Beat table
| beat | t (s) | what happens | claims |
|---|---|---|---|
| HOOK | 0.0–3.0 | dark coast floor; group 0 reveals (shell by shell), already sorted: 6 shells. Tag RECAP · SIMULATED at 1.0. Camera still, ambient drift ≤ 1°. **No digit** | none |
| | 3.0–12.0 | one orbit's 100 dots a little brighter; its dot slides along its shell and never leaves it (a feature rank, not a pin); no panel, no pin | none |
| CASE | 12.0–20.0 | **M0** the shells un-sort into the tangle (the rule is "taken away") | |
| | 20.0–21.0 | settle | |
| | 21.0 (hold to 28.0) | panel: MOMENTS · "30,000" (first count lands) | states (orbits, perOrbit) |
| | 28.0–36.0 | **M1** a blind search sorts the tangle onto shells; tag ILLUSTRATION · SIMULATED; panel empty | (blindFound off screen) |
| | 36.0–38.5 | settle | |
| | 38.5 (hold to 50.5) | tag PUBLISHED RESULT; cloud dims to a ghost; panel: LIU AND TEGMARK · 2021 / "5 test systems" / "every exact law found" | liuSystems, liuYear |
| | 50.5–56.5 | match cut to group 1 (group 0 removed); 24,000 training dots count in; tag SIMULATED · A TINY NETWORK; panel empty | |
| | 58.5 (hold to 72.5) | panel: TRAINING MOMENTS · "24,000" (second count) | netDots (runs, neurons, recSteps) |
| COUNT | 62.0–70.0 | **M2** each dot re-plotted by the sum of its neuron's weights (a² − b²): 5 flat layers | |
| | 70.0–72.5 | settle | |
| | 72.5 (hold to 75.5) | panel: "8 neurons" | neurons |
| | 75.5 (hold to 98.5) | panel adds "8 fixed sums" (label KUNIN ET AL. · MARCOTTE ET AL.) | laws (lawsPerNeuron) |
| | 78.5–80.0 | one run's neurons brighten, the rest dim (0.4) | |
| | 80.0–88.0 | the comet: each neuron's dots light in step order; every dot slides along its arc and never changes layer | |
| | 88.0–96.0 | **M3** bigger steps: the same dots at the big step; layers leak (camera edge-on) | |
| | 96.0 (to 98.5) | panel note: "exact only for tiny steps" (words) | |
| | 98.5 | hard cut to the toy (gl-instances); groups hidden; tag ILLUSTRATION from the first frame; 3 marks appear | |
| | 101.0 (hold to 106.0) | panel: "3 questions" | toyQuestions |
| | 106.0 (hold to 109.0) | 6 rows count in (one per order); panel: "3 questions · 6 orders" | orders |
| | 109.0 (hold to 115.0) | all 6 rows one colour; panel: "4 + 7 + 9 = 20" / "in every order" | toyA, toyB, toyC, toySum |
| | 112.0–115.0 | rows recolour to six colours (the order-sensitive toy model); panel stays; no digit | (toyDistinct off screen) |
| | 115.0 (hold to 119.0) | tag PUBLISHED RESULT; rows dim to ghost; panel: CHEN ET AL. · ICML 2024 / "more than 30 %" / "worse, in some tests" (a ratio: after the count at 21.0) | premiseDrop, chenYear |
| | 119.0 | hard cut to the tree; tag **PROGRAM, NOT A THEOREM** from the first frame; 19 boxes count in 119.0–121.5 | |
| | 122.0 (hold to 125.0) | panel: "19 questions" | treeNodes (level1, level2, level3), treeLayers |
| | 125.0 (hold to 128.0) | panel adds "4 · 8 · 7" (by layer; layers coloured) | level1, level2, level3 |
| | 128.0 (hold to 131.0) | panel: "9 modules · 22 sources" | modules, sources |
| | 131.0–135.0 | panel empty; the two children of Q2 swap places (3 s); one node keeps a ring; pin "candidate" (static, outside the silhouette, hard-cut on at 132.0) | |
| MONDAY | 135.0–141.0 | camera eases back to a wide frame (drift only); set type: the question to ask at work (2 lines of Fraunces italic) | none |
| | 141.5–150.0 | the honest line ON STAGE as one sentence of set type, no caption in the band during it | none |
| BRAND | 150.0–153.0 | plain ground card: CETI wordmark, takeaway "Ask what stays when the order changes." (39 chars); tag gone | |

## Labels (gl-labels)
One panel (right third, fixed), one corner tag (top left, fixed, its lay axis words beneath it), the caption band. At most 3 text elements besides the caption on any frame (panel, tag, one pin). One pin in the film ("candidate", 132.0–135.0); **no pin ever sits on a moving dot or follows a move** (no text moves). Result-role numbers (30,000, 5, 24,000, 8, 20, more than 30 %, 19) are ≥ 28 u display; at most 2 on screen. Tag axis words: recall P "where it is" · spin "spin, energy"; training P "weights · time" · C "weights · the sum"; none for the toy and the tree. At each move start the panel is empty or unchanged (it changes only at settle); hard-cut on at the settle. `reserve` = the caption band read from the kit; panel and tag are `reserve`d zones for the pin solver; the cloud's projected bounds stay clear of them (G11).
Words that are never on stage: "conserved charge", "Noether current", "insight mass", "conservation of truth", "Noether's theorem for knowledge", "AI discovers new laws of nature", "equivariance = conservation", "the machine proved". Words that are: "number that never changes", "a change that changes nothing", "program", "candidate". The course's node titles (which contain "Noether current" and "conserved") are not drawn.

## Captions (Space Mono/DM Sans 28 u, one line, ≤ 60 chars; no digit without a claim; one idea each)
| # | t0 | t1 | text |
|---|---|---|---|
| c1 | 0.8 | 5.8 | Last time, a dot could not leave its shell. |
| c2 | 6.2 | 11.6 | Each shell is a number that never changes. |
| c3 | 12.4 | 19.6 | Now take the rule away. Plot only where things are. |
| c4 | 20.0 | 22.8 | Each dot is one moment of one orbit. |
| c5 | 23.0 | 27.6 | That is 30,000 moments, tangled, with no rule. |
| c6 | 28.2 | 35.8 | A computer hunts for any number that stays put. |
| c7 | 36.1 | 38.5 | It lands on the same shells, told nothing. |
| c8 | 38.6 | 41.4 | In 2021, a team tried this on 5 test systems. |
| c9 | 41.6 | 44.4 | It found every number that truly never changes. |
| c10 | 44.6 | 47.4 | It also flagged numbers that only nearly hold. |
| c11 | 47.6 | 50.4 | Small, clean systems; the laws were already known. |
| c12 | 50.6 | 54.4 | Now something that learns: a small network. |
| c13 | 54.6 | 58.4 | Each dot is one neuron at one moment of training. |
| c14 | 58.6 | 61.9 | 24,000 dots, tangled like before. |
| c15 | 62.4 | 69.6 | Plot each by one sum of its neuron's weights. |
| c16 | 72.6 | 75.4 | Each network here has 8 neurons. |
| c17 | 75.6 | 78.4 | Each neuron keeps one sum fixed: 8 in all. |
| c18 | 78.6 | 82.4 | Now let it train. Every dot starts to slide. |
| c19 | 82.6 | 87.8 | They slide, but never change layer. |
| c20 | 88.2 | 95.8 | Take bigger steps, and the layers start to leak. |
| c21 | 96.1 | 98.45 | The fixed sums hold only for tiny steps. |
| c22 | 98.6 | 100.8 | Now try it on questions. |
| c23 | 101.0 | 105.8 | 3 questions that don't need each other. |
| c24 | 106.2 | 108.9 | They can be asked in 6 orders. |
| c25 | 109.2 | 111.9 | The total is 20 in every order. |
| c26 | 112.1 | 114.95 | A model that cares about order contradicts itself. |
| c27 | 115.1 | 118.9 | Reordered facts cut scores by more than 30 % in some tests. |
| c28 | 119.2 | 121.9 | Our own program starts with a tree of questions. |
| c29 | 122.2 | 124.9 | 19 questions, in 3 layers. |
| c30 | 125.2 | 127.9 | 4 broad, 8 narrower, 7 narrowest. |
| c31 | 128.2 | 130.9 | Behind it: 9 modules and 22 sources. |
| c32 | 131.2 | 134.8 | Idea: a claim that survives reordering is a candidate. |
| c33 | 135.3 | 140.8 | Monday: reorder a question's parts. Same answer? |
| (none) | 141.5 | 150.0 | the honest line is stage type; no caption in the band |
Caption notes. c5, c14, c16, c17, c23–c25, c29–c31 render claims by number. "2021" renders liuYear, "5 test systems" liuSystems, "more than 30 %" premiseDrop. "Part 1" is never written (a digit with no claim); say "last time". c9 is scoped by c11 in the next 3 s: the exact laws were found in 5 small test systems and were known already. c26 is the toy ("a model that cares about order") and carries the tag ILLUSTRATION; the real claim is c27, from a paper. c32 uses "candidate", never "charge".

## Stage type (set type, no caption in the band while the honest line shows)
- Monday (135.0–141.0), Fraunces 300 italic, 2 lines, bone on ink: "Ask your AI the same question with its parts in another order. Does the answer stay?" (the sibling-permutation test, the one thing a viewer can run).
- Honest line (141.5–150.0), ONE sentence, once: **"Nobody has proved a Noether theorem for questions; this is a program, not a result."** (84 chars; may break after the semicolon only if the width forces it; the tag PROGRAM, NOT A THEOREM stays up). It names what the film does not prove: the symmetry of reordering is real and testable, the "charge" is the part nobody has defined.

## Knobs (every tunable a knob; defaults here)
camFov 30, camElMain 20, m0 {az +50, t 12–20}, m1 {az −50, t 28–36}, m2 {az 60, el 22→15, t 62–70}, m3 {el 15→6, dolly −12 %, t 88–96}, ambientDriftDeg 1 (≤ 3 at holds), dotR 1.0–1.3 world units with the depth size cue (about 1; tens of thousands of fine dots), dotRNet 1.0, brightFollow +25 % (the followed orbit's dots, not bigger), dimOthers 0.22, ghost 0.18, cometLen 8 dots, cometPeriod 8 s (80–88), layerColours by starting layer, swapSecs 3, toyRowGap 1.6, treeSpread 1.0 (x ∈ [−1, 1], y ∈ {1, 0, −1}), neuronQuant 3 decimals (2 if the page is over budget), fogMax 0.3 (manager level), `dof: null`. Seeds baked into data/: 20261012 (recompute.py); the film trains nothing and searches nothing at run time.

## Purity
render(t, state) rebuilds the 30,000 recall states from Part 1's orbit_table.json by the Kepler solution (Newton, 60 iterations), reads the 24,000 training dots from data/neurons.json, the tree from data/question_tree.json, the toy from data/toy.json. No Math.random/Date/performance in the renderer. Counts are `count(t)` of the pointcloud and equal the claim values on the first and last frame of each move.

## Checks before building (run by the brief; the gate repeats them)
- count.at 21.0 precedes every ratio (the first and only ratio is "more than 30 %" at 115.1); each new number holds ≥ 2.5 s (panel table above: 21.0→28.0, 38.5→50.5, 58.5→72.5, 72.5→75.5, 75.5→98.5, 101.0→106.0, 106.0→109.0, 109.0→115.0, 115.0→119.0, 122.0→125.0, 125.0→128.0, 128.0→131.0).
- Moves start 12.0, 28.0, 62.0, 88.0 (gaps 16, 34, 26); every landing has ≥ 1.0 s settle before a panel change (20.0→21.0; 36.0→38.5; 70.0→72.5; 96.0→98.5).
- HOOK carries no digit. The honest line is on stage once. Eight tags in all and every picture has its tag from its first frame; PROGRAM, NOT A THEOREM from 119.0 to 150.0.
- Counts on screen of what exists only: the tree 19 (4/8/7), 9 modules, 22 sources. The course's 19 wiki entries are never shown (one 19 only).
- Text overlap (G11): panel, tag, pin, plate and caption never share a window beyond the three-element rule; nothing over the cloud.
- `python3 -I factory/topics/noether-frontier/recompute.py` passes all checks (about 70 s); `python3 factory/tools/repo_topic.py --check factory/topics/noether-frontier/claims.json` passes (32 claims).
- Module gaps to close in the draft (brief F7): id-stable morph through three coordinate sets in gl-pointcloud (P → C → C′) and a per-dot feature rank (the comet); a ghost state for a whole group; gl-instances: explicit x, y from data, a swap of two ids, a ring on one id.
