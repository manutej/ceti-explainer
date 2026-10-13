# Noether at the frontier · film id `noether-frontier` · brief (Wave NOETHER, Part 3)

## Subject
kind: concept with three published fixtures, one simulation and the owner's program · name: what happens when the "number that never changes" idea (Parts 1 and 2) is pushed to its edge: machines that find such numbers, the numbers hidden inside a learning network, and the open question of whether anything like it exists for knowledge itself · source material: factory/WAVE-NOETHER.md (Part 3 row), factory/research/NOETHER-FRONTIER.md (§D spine, §E verification list, its "do not say" list is binding), factory/research/NOETHER-FOUNDATIONS.md (lay statements), factory/topics/noether-symmetry/v2-director-note.md (text rules, point-cloud spec), the owner's course /home/user/manutej/noether-operadic-course/index.html (+ parts/*.js), recompute.py (seed 20261012). Sources, grades and what could be opened: sources.md.

## Audience
manager; a room that has heard "AI" daily, saw Part 1 (a dot cannot leave its shell) and Part 2 (the same picture in four real systems), and is now asked the hard question: does this reach knowledge? No jargon without a picture: "a number that never changes", "a change that changes nothing", "a tree of questions", "a candidate". A 10-year-old follows each caption. The words operad, functor, sheaf, Lie algebra, groupoid, gradient flow never appear.

## Format and look
feature-long, 153 s (150 + 3 s card), level manager, renderer webgl, brand ceti-coastal-dark (same family as Part 1), chrome none, material ink. Commit: none (D11). Chain: gl-pointcloud (required: id-stable morph, tens of thousands of fine dots) + gl-camera-rig + gl-labels + gl-instances (the toy and the question tree). Windows HOOK 0–12 · CASE 12–62 · COUNT 62–135 · MONDAY 135–150. Text rules for the series: no text ever moves; one readout panel, one caption band, one corner tag (plus at most one still pin); nothing over the cloud; one-line lay captions.

## The belief
"A number that never changes is something for planets and physics labs. Knowledge, and the AI that works with it, is too messy to have one." (Said in the film without a digit; the HOOK is the recall of Part 1 and the doubt in the last second: "Each shell is a number that never changes.")

## The reversal (two pictures)
Belief picture: the shells of Part 1 are the end of the story: sorted dots in a physics cloud, nothing to say about a computer or a question. After the count: (1) a computer that is given only the motion (30,000 tangled moments) sorts it onto the same shells, and a published program did this for 5 test systems and found every exact law; (2) inside a small network that learns (24,000 dots, 8 neurons) each neuron keeps one sum fixed, 8 fixed sums, and the dots slide along their layers without leaving them, until a bigger step makes them leak; (3) for questions, the same kind of test is available: reorder things that should not matter. 3 sub-questions can be asked in 6 orders, a sound total is 20 in every order, and real models fail the test (scores fell by more than 30 % in some tests); (4) the owner's program asks which claims would survive every reordering, a tree of 19 questions (4/8/7), 9 modules, 22 sources; and nobody has proved the law.
The gap in one sentence: the belief says there is no symmetry to speak of in knowledge; the picture says the symmetry (reordering) is real, testable and broken by today's models, while the "number it would fix" is the part nobody has defined.

## Fixture
Four, none measured by us: (a) Liu and Tegmark, PRL 126, 180604 (2021): five Hamiltonian systems, every exactly conserved quantity recovered (A, abstract). (b) Training dynamics: Du–Hu–Lee 2018, Kunin et al. ICLR 2021, Marcotte–Gribonval–Peyré NeurIPS 2023; our toy of 60 runs, 8 ReLU neurons each, shows the sums staying fixed at the small step and leaking at the big step (A for the theory, simulation for the picture). (c) Chen et al., ICML 2024: premise order, "more than 30 % in some tests" (A). (d) The owner's course: the question tree and its candid statement "program, not theorem" (A for the counts, thesis §8 for the wording).

## Count (units; the first lands before any ratio)
1. "one dot is one moment of one orbit": 300 orbits × 100 moments = 30,000, panel at 21.0 s (count.at). Part 1's cloud, read from its orbit_table.json.
2. "one dot is one neuron at one moment of training": 60 runs × 8 neurons × 50 moments = 24,000, panel at 58.5 s.
3. "one mark is one sub-question": 3 questions, 6 orders (3 × 2 × 1), the total 4 + 7 + 9 = 20 in every order (ILLUSTRATION), panel 101.0–115.0 s.
4. "one mark is one question in the owner's tree": 19 = 4 + 8 + 7, with 9 modules and 22 sources (counts of what exists), panel 122.0–131.0 s.
Ratios after counts: one only, "more than 30 %" (115.1 s). Counts 1–2 are simulations (tagged); 3 is arithmetic (tagged ILLUSTRATION); 4 is a count of an artefact (tagged PROGRAM, NOT A THEOREM).

## Mechanism
A symmetry is a change that changes nothing, and Noether (Part 1) says each one fixes a number. Three ways to meet that idea at the frontier. A machine can be given only the motion and asked for any number that stays put (CASE; our own plain search finds the same 4 constants in the 30,000 states, a picture of the idea, not their program). Inside learning, each hidden neuron can be rescaled in (×s) and out (÷s) without changing what the network computes, so the sum "in-weights squared minus out-weight squared" stays fixed while it learns (COUNT; exact for tiny steps, leaky for big ones). For questions, reordering sub-questions that do not depend on each other is a change that should change nothing: a sound total comes out the same in all 6 orders. Real models do not (a published result), so the symmetry is there and breakable; whether some claim is fixed by it in a way that deserves the name "charge" is what the owner's program asks, and no one has proved it.

## Monday
question: "Reorder the parts of a question you give your AI. Does the answer stay?" (the sibling-permutation test: it can be run this week, with no code).
honest limit (exactly one, on stage, 141.5–150 s): **"Nobody has proved a Noether theorem for questions; this is a program, not a result."** It names what the film does not prove: the symmetry of reordering is real and testable, the quantity it would fix is undefined; every other thing on stage is a published result, a simulation or a count of what exists.

## Commit
none (D11).

## Takeaway (card, ≤ 60 chars)
Ask what stays when the order changes. (39)

## Cost
not asked.

## Sources (≥ 3)
S1 Part 1 package · S2 Liu and Tegmark 2021 · S3 AI Poincaré 2.0 (context) · S4 Du–Hu–Lee 2018 and Kunin et al. 2021 · S5 Tanaka and Kunin 2021 (context) · S6 Marcotte–Gribonval–Peyré 2023 · S7 Chen et al. 2024 · S8 the owner's course (counts) · S9 the owner's thesis §8 and Module 6 (wording) · S10 recompute.py · S11 the in-film toy. URLs and grades in claims.json and sources.md.

## Not this
- A fourth lecture on Noether or Lagrangians: Parts 1 and 2 did the concept; this film starts from the picture they ended on.
- "Noether's theorem for knowledge", "conservation of truth", "insight mass", "Noether current", "conserved charge", "AI discovers new laws of nature" (all five systems were known laws), "weather AI conserves energy", "equivariance = conservation": the research file's do-not-say list, binding. Nothing in the program is called a charge or a quantity that is conserved; the tag says PROGRAM, NOT A THEOREM and the word on the pin is "candidate".
- The LieGAN beat (machines that find the symmetry itself, ICML 2023): dropped for the 153 s; it would take 20 s and adds a second discovery story. Held in sources.md for a longer cut.
- Any linear-network count (r(r+1)/2 = 36): that count needs input and output widths at least r; this toy has 24 parameters, fewer than 36. Only the ReLU count (one law per neuron: 8) is shown.
- Operadic consistency numbers (12 models, 4 datasets; or eight models on the other page): unresolved, not on screen. Also off screen: Aurora's 1.3 billion parameters, GraphCast/PhysMetrics mass-loss claims (C), "up to 40 %", the course's "four conserved quantities of the courseware" (engineering checks, not physics), Jane Street's 25 puzzles and any "triples" count (the file the README promises is missing), the Noether branch's 7 nodes (collides with level 3 = 7), 12 thesis sections, the Gwilliam arXiv ID (unverified).
- Both 19s: the tree has 19 questions and the course's wiki has 19 entries. Only the tree's 19 is shown.
- A swarm of dots around each question "for the point cloud": it would be invented data. The cloud lives where there is a cloud (orbits, training); the tree is 19 honest marks.
- Drawing the course's question titles on nodes: they contain "Noether current" and "conserved" as open questions, which would read as claims.

## Director's choices (2026-10-10)
Format feature-long, dur 153, commit off; chain gl-pointcloud (id-stable morph, tens of thousands of fine dots) + gl-camera-rig + gl-labels, plus gl-instances for the question tree; keep Liu–Tegmark and the training-dynamics beat (counts verified by the recompute, else "some" with no digit); LieGAN dropped; the premise-order result quoted as "more than 30 % in some tests"; the toy of three independent sub-answers allowed, tagged ILLUSTRATION, every digit a formula; the owner's program on stage with the corner tag PROGRAM, NOT A THEOREM from its first frame, counts only of what exists (9 modules, the 19-node tree 4/8/7, 22 sources, never both 19s), nothing called a conserved charge; the honest line as quoted; brand ceti-coastal-dark, material ink, chrome none, level manager; only A/B-grade numbers on screen; captions one line, lay words, one idea each; no text ever moves; nothing over the cloud.

## Findings (decide or accept before drafting)
F1. **The count "8 laws" is verified by the recompute, graded B.** recompute.py C: for each of the 60 starting activation regions the Lie algebra generated by the model's gradient fields has dimension 24 and leaves 24 − 16 = 8 independent conserved functions; the 8 gradients of the sums are independent (rank 8); the same method gives 2, 3, 4 for widths 2, 3, 4. The Marcotte–Gribonval–Peyré tables and exact conditions are NOT opened (research E1), and the count needs dense data and distinct neuron directions (the toy has 1,024 points and one input direction per 45 degrees; with 128 points a region gave 9, because empty sectors of the input plane leave directions undetermined, and with two neurons pointing the same way 3 of 60 regions gave 9; both are findings about small data and degenerate nets, not about the theory). **Fallback rule:** if E1 fails or the page is cut, replace panel "8 neurons / 8 fixed sums" and captions c16 and c17 by "Each neuron keeps one sum fixed." (no digit), set `neurons` and `laws` onscreen false; nothing else changes.
F2. **Part 1's claims.json still says perOrbit 10 (3,000 states) while its orbit_table.json says 100 (30,000).** This package reads the table (300 × 100 = 30,000). If Part 1 ships at 3,000, the recall count and c5/panel change (claims `perOrbit`, `states`) and the "tens of thousands" cloud for the recall must be rebuilt from 100 moments anyway.
F3. **Nothing was opened.** Egress blocks the paper pages; Liu–Tegmark's "five systems", Chen's "over 30%" and the Kunin/Marcotte statements are read from the research lane's abstracts (grade A there). Open the PRL page, arXiv 2402.08939 and arXiv 2307.00144 before shipping (E1, E4).
F4. **The blind search is ours.** Our 22-term search finds 4 constants (Lx, Ly, Lz, E) in the 30,000 states, which makes the "machine sorts the tangle" picture true to what a search returns, but it is not Liu and Tegmark's method; the beat is tagged ILLUSTRATION · SIMULATED until 38.5 s, then PUBLISHED RESULT. `blindFound` (4) is off screen; promote it only with the ILLUSTRATION tag.
F5. **Big step chosen at lr 0.4** (small 0.005, same training time 19.6): median drift of the sum 0.10, a fifth of the gap between layers; 60 of 60 runs stay finite (at 0.6 one run diverges). At the small step the median drift is 0.0005. The edge-on camera at 88–96 s is what makes 0.10 readable.
F6. **Page budget.** neurons.json 238 KB compact, Part 1's orbit_table.json 31 KB, question_tree.json about 5 KB (without titles about 2 KB), toy.json 0.5 KB. Part 1 shipped at 1.29 MB with a 190 KB network file; at 2-decimal quantisation neurons.json is about 160 KB. The drafter decides the budget; the series limit is 1.3 MB per page.
F7. **Module gaps** (as in Part 1's F4): gl-pointcloud has no id-stable morph through three coordinate sets, no per-dot feature rank (the comet) and no ghost state for a whole group; gl-instances needs explicit x, y from data, a swap of two ids and a ring on one id. Part 1's patched lib/gl-pointcloud.js is the starting point.
F8. **No node of the tree has exactly three siblings** (level 1 has four, the rest two). The "3 sub-questions, 6 orders" toy is therefore separate from the tree, and the tree scene swaps only the two children of Q2 (2 orders, no digit).
F9. **The course's own wording is kept.** "Program, not theorem" is the course's own title for thesis §8; "a claim … that remains fixed under reordering of independent sub-questions" is its definition, said on stage as "a claim that survives reordering" with the word "candidate".
F10. **Time.** The film is tight at 153 s; if the draft runs long, drop c10 and c11 (the "nearly hold" pair, 44.6–50.4) and end the PUBLISHED RESULT panel at 44.6; nothing else moves.
