# Noether at the frontier: what Part 3 can stand on (2022-2026) and what must stay a program

Research lane for Wave NOETHER, Part 3 (`noether-frontier`, 153 s). Compiled 2026-10-10. Writers: read "Read this first", section A4 and section D; the rest is lookup.

## Read this first (provenance and grading)
- Egress: WebFetch is blocked. Part B is graded from WebSearch snippets only (no page opened). Part A was read from disk, quotes verbatim, line refs are to the
  tag-stripped text of `index.html` (the course is a single page whose modules are also in `parts/part0-3.js`; `parts/*.js` hold the same HTML as JS strings).
- Grades (same rule as the other NOETHER files): A = primary paper or venue page, figure came back in the abstract or a venue listing; B = reputable secondary,
  or a derived number from sourced inputs (marked "derived"); C = single snippet or a preprint nobody has reviewed. Only A and B go on screen. Every C is marked.
- Open before shipping: any number tagged "verify" below. No number on screen should come from this file alone.
- Dates: "2026" papers cited here exist as arXiv IDs 2603-2608 and as ICML 2026 listings; treat anything 2606+ as freshly posted and unreplicated.

---
## A. The owner's own program

### A1. Where it lives (paths)
| thing | path |
|---|---|
| Course (one page, 91 KB) | `/home/user/manutej/noether-operadic-course/index.html` (also `index.min.html`, `cdn-index.html`, `parts/part0-3.js`, `part0-3.js`) |
| Course README | `/home/user/manutej/noether-operadic-course/README.md` ("9 curriculum modules; Operadic question tree with PDF links; Internal wiki; Thesis (12 sections); Sources / NotebookLM block") |
| Typed wiki | `/home/user/manutej/noether-wiki/` (`README.md`, `STRUCTURE.md`, `domain.package.yaml`, `skills/sheaf-ingest/SKILL.md`, `wiki/INDEX.md`, `wiki/series/*.md`, `data/jane-street/puzzles.json`, `public/index.html`) |
| Related (not read in depth) | `/home/user/manutej/cell-sheaf/` (HTML design template for a "cellular sheaf volume"; glue statuses ok / strange / broken / missing) |

### A2. What "Noether structure on QA-graphs" claims, in the course's own words
1. **The metaphor of the claim.** Glossary, "Conserved quantity" (index.html ~l.984-986): "An invariant associated to a symmetry; in research trees, an insight core that survives substitution and collapse." and "In this course's metaphor: a claim or structural fact that remains fixed under reordering of independent sub-questions, partial collapses, and literature re-alignment."
2. **Question tree, node L1-Q2** (the Noether branch, ~l.763-767): "How can Noether's theorem be operadically extended to identify symmetries in the graph architecture of question-answer mappings for complex systems?" ... "Conserved: Noether currents on the QA-graph are the conserved quantities under collapse."
3. **Module 6 "QA-Graphs & Noether on Question Trees"** (subtitle "Symmetries of the answer space", ~l.542-559). The QA-graph: "Nodes: questions and answers ... Edges: 'is sub-question of', 'answers', 'substitutes into'." Symmetries of interest: "permuting independent sibling sub-questions; replacing a sub-tree by another with the same compositional type; continuous deformations in embedding space that preserve answer equality up to tolerance." Candidate conserved quantities: "claims that survive all sibling permutations; facts present in every consistent collapse; structural types (arity signatures) invariant under substitution." Candidate currents: "how 'insight mass' flows along edges when a tree is rewritten - still metaphorical until a precise generator map is fixed (Baez's lesson)."
4. **"Conservation of truth" / dual-loop pedagogy** (Module 0 "How this course conserves truth", ~l.204-217). Verbatim: "Noether dual-loop pedagogy: every fact is grounded, every lesson respects prerequisites, design identity is locked, and learner knowledge is monotone." and "Your knowledge state only grows." Four "conserved quantities of this courseware": Truth ("every factual claim traces to a primary source with a live URL"), Design identity, Access, Learner knowledge ("a lesson may only use concepts already taught ... The concept graph is a DAG - no circular prerequisites"). Key term: "Conserved quantity (courseware) - A property that must hold after every rewrite: truth, design, access, learner-K."
   Reading: here "conserved" is an engineering invariant (a check that must pass after each edit), not a Noether charge. Say so on stage if used.
5. **The loop** (Module 7, ~l.596-614): "decompose -> align literature -> answer leaves -> collapse -> extract conserved quantities -> recurse." Failure modes named: "Premature category collapse", "Unprovenanced synthesis: merging papers without citation - breaks truth conservation", "Fidelity loss", "Broken coherence". Multi-agent form: "researchers fan out by topic; a single wiki-writer merges with provenance; lesson agents may only read the wiki; a meta-reviewer adversarially checks contradictions and hype."
6. **Sibling-permutation test.** Thesis section 8: "What we can already use operationally: operadic consistency as a collapse invariant; sibling-permutation tests for claim stability; citation-backed wiki discipline as a sociological conservation law for research artifacts." (~l.1214).

### A3. Proven vs program: the course is candid, use its words
- Module 6 (~l.558): "A fully rigorous Noether theorem for discrete QA-graphs with LLM-valued algebras is not a standard textbook theorem as of 2026. This module maps a research program, not a closed proof."
- Thesis section 8 title (~l.1210): "Towards Noether structure on QA-graphs (program, not theorem)". Body: "We outline a research program, explicitly not a theorem". The five-step program: (i) formalize QA-graphs, (ii) identify symmetry groupoids (sibling permutation, type-preserving rewrites), (iii) seek Lie-algebraic infinitesimal models via graph complexes, (iv) define candidate charges as predicates invariant under those symmetries, (v) relate charges to operadic consistency "as an empirical shadow of invariance under collapse".
- Gaps, verbatim: "LLM answer maps are stochastic and non-linear; discrete graphs lack the smooth variational structure of classical Noether; non-degeneracy of charges needs definition; no published construction yet identifies a Noether current for Q-algebras in the literature surveyed here."
- Section 11 "Future work (potential, not claimed results)": five open problems A-E (symmetry groupoid of a finite QA-graph incl. stochastic algebras; a Lie bracket on edge derivations satisfying Jacobi; relate consistency scores to approximate conservation "with concentration bounds"; double-operadic model of tool-using agents; machine-checked fact substrate). "None of A-E is claimed as solved in this thesis."
- Thesis on the published pair (~l.1169): "We emphasize what these papers do claim (an operadic framework and an empirical metric) and what they do not (a full deformation theory of Q-algebras, or a Noether theorem)."
- What IS published and checkable (my search, A): Bottman, Liu, Richardson, **arXiv 2606.13634** "Operads for compositional reasoning in LLMs" (ICML 2026 listing) and **arXiv 2606.13649** "Operadic consistency: a label-free signal for compositional reasoning failures in LLMs". Snippet: "Across twelve instruction-tuned LLMs (4B to 671B parameters) on four multi-hop QA datasets, OC is strongly correlated with accuracy on every dataset. Chain-of-thought self-consistency matches OC on HotpotQA and DROP but drops to about 0.45 on MuSiQue and StrategyQA." Caveats: the ICML page says "eight models" for the framework paper (verify which count is final); the course's gloss "outperforming temperature-based self-consistency baselines" is stronger than the snippet. Operadic consistency = direct answer agrees with the answer composed from a stated decomposition. It is NOT a sibling-permutation invariance and NOT a Noether charge.
- Unverified citation inside the course: "Gwilliam et al., Factorization algebras and Noether theorems, arXiv:2504.05626" (course bibliography ~l.1419). My search could not find that ID (the Costello-Gwilliam book, vol. 2, Part 3 "A Factorization Enhancement of Noether's Theorem", is real, A). Do not show the ID until opened.

### A4. Numbers in the owner's material (counts first)
| count | value | where | grade | note |
|---|---|---|---|---|
| curriculum modules | 9 (Module 0 Orientation ... Module 8 "Wiki, dualities, and meta-structure") | README.md; index.html l.99, module cards | A (counted on disk) | Module 4 = Noether and conserved quantities; Module 6 = QA-graphs |
| wiki entries | 19 ("19 substrate entries") | index.html l.99, l.905 | A | the page's own total |
| sources | 22 ("22 entries - open PDFs in a new tab") | index.html l.99, l.1264 | A | arXiv-heavy list |
| thesis sections | 12 | README.md, section headings s1-s12 | A | |
| question-tree nodes | 19 = 4 level-1 + 8 level-2 + 7 level-3 | index.html l.755-880 | A (I counted the `L1-/L2-/L3-` ids: Q1-Q4; 1a 1b 2a 2b 3a 3b 4a 4b; 1a-i 1a-ii 1b-i 2a-i 2a-ii 2b-i 2b-ii) | coincides with 19 wiki entries; show only one of them, or the film looks like an error |
| Noether branch of the tree | L1-Q2 with 2 level-2 and 4 level-3 children = 7 nodes | same | A | |
| sibling permutations of 3 sub-questions | 3! = 6 | derived | A (arithmetic) | used for the demo, see D |
| Jane Street puzzles indexed (noether-wiki) | 25, Sep 2024 - Sep 2026 | `data/jane-street/puzzles.json` (`window.count: 25`), README | A | a different corpus: a puzzle trainer, not the QA-graph |
| hand-written series pages | 5 (hooks, knight-moves, number-cross, robot, tiling) | `wiki/series/` | A | catalogue tags more series (e.g. "fences"); do not say "5 series" |

What the sheaf tooling does (README, STRUCTURE.md, `skills/sheaf-ingest/SKILL.md`, `domain.package.yaml`): takes a folder, "build a typed index, draw it as a lattice, leave a structure you can run on the next folder". Four outputs: index of parts (each with a locator like `catalog#<id>` or `wiki/<page>#heading`), `lattice.json`, `domain.package.yaml`, `STRUCTURE.md`. Typed fields per part: `{page, title, year_month, series, technique, structure}`. Links are "observed only": `belongs_to_series`, `successor_of`, markdown links, `sourced_from`; rules "Do not invent links", "No complete graph. No invented 'related to' edges", "Fill sections with random numbers" is a MUST NOT. Its `residualMeaning` is "two puzzles disagree on which invariant they are conserving - partition, path measure, or search bound". Rank in the trainer: "Unopened -> Working -> Committed -> Section" (a section = "you attempted, then read the official write-up, then can say what was conserved"); stalks-and-sections vocabulary: a tiling "is a global section of local matching rules" (`public/index.html`). Provenance = locators + observed edges + official URLs; copyrighted solutions are not ingested.
Honest finding: the README promises `data/jane-street/triples.jsonl` and `docs/examples/`; neither exists in the repo, and `wiki/INDEX.md` links `wiki/puzzles/*.md` which does not exist. So "triples" has no count. Do not put a triple count on screen.

### A5. What can honestly go on screen as a count, and what must stay a program
**May show as counts (owner's artifacts, A):** "9 modules", "22 sources", "19 questions in the tree (4 / 8 / 7 by depth)", "12 thesis sections", "25 puzzles indexed" (if the sheaf tool appears), "6 orderings of 3 sub-questions" (arithmetic).
**May show as a published result (A, not the owner's):** operadic consistency across 12 LLMs and 4 datasets (see B7), premise-order drop > 30% (B6).
**Must be labelled "program" on stage, never as a result:** that Noether currents exist on a QA-graph; that "insight mass" flows; that a claim fixed under sibling reordering is a Noether charge; any conservation "law" for knowledge; any number that implies measured conservation of truth. Also not a result: the "four conserved quantities of the courseware" (these are checks a build must pass, not physics).
**Wording that stays true:** "A claim that does not change when you reorder independent sub-questions" (a definition, fine). "Conserved under collapse" must be followed by "candidate". Never "Noether's theorem for knowledge".

---
## B. The published frontier, 2022-2026 (plus the roots)

Template per item: lay sentence / invariant / symmetry / numbers (grade) / quoted snippet / point-cloud picture.

### B1. Machines that find conservation laws from trajectories (Liu and Tegmark)
- Lay: give a computer only the motion of a system, no equations; it finds the numbers that never change.
- Invariant: any function H(state) constant along trajectories (energy, angular momentum, ...). Symmetry: implicit; the paper finds the conserved function, not the group.
- Numbers: Phys. Rev. Lett. 126, 180604 (6 May 2021), arXiv 2011.04698, method "AI Poincare". "tested on five Hamiltonian systems, including the gravitational three-body problem. It recovered all exactly conserved quantities and also found periodic orbits, phase transitions, and breakdown timescales for approximate conservation laws." (A, abstract). Successor: **AI Poincare 2.0**, Liu, Madhavan, Tegmark, Phys. Rev. E 106, 045307 (2022), arXiv 2203.12610: starts from the differential equations, finds all conservation laws as networks or formulas, enforces functional independence ("a nonlinear generalization of singular value decomposition"), validated on "the 3-body problem, the KdV equation, and the nonlinear Schrodinger equation" (A). Root: **AI Feynman**, Udrescu and Tegmark, Science Advances 6, eaay2631 (15 Apr 2020): "recovered all 100 [Feynman Lectures] equations, while the previous publicly available software recovered only 71"; harder set "from 15% to 90%" (A; 2020, outside the window, use only as the root).
- Later: Doshi, hybrid Neural-ODE plus Transformer plus symbolic verifier, arXiv 2511.00102, NeurIPS 2025 listing (B); Ray, "From Data to Laws: Neural Discovery of Conservation Laws Without False Positives" (NGCG), arXiv 2603.20474: "robustness to noise (sigma = 0.1), sample efficiency (50-100 trajectories), runtime under one minute per system" (C, single preprint). Noether Networks (Alet et al., NeurIPS 2021, arXiv 2112.03321): meta-learn a conserved quantity as a loss inside the predictor (A; 2021).
- Point cloud: 30,000 dots of one orbit family on a hidden 3-D surface; the camera slides until the dots lie flat on a level set; a ribbon of colour shows H = constant; a few dots start off the surface and are pulled on (the "approximate law" breaking). Reuses Part 1's shells.

### B2. Machines that find the symmetry itself (LieGAN and descendants)
- Lay: the computer is shown data and asked "what can I do to every point that leaves the cloud looking the same?"
- Invariant: the data distribution. Symmetry: a Lie group learned as a basis of generators (rotations, boosts).
- Numbers: **LieGAN**, Yang, Walters, Dehmamy, Yu, "Generative Adversarial Symmetry Discovery", ICML 2023, arXiv 2302.00236 (submitted 1 Feb 2023). "A generator learns a group of transformations applied to the data, which preserve the original distribution and fool the discriminator." Recovers "the rotation group SO(n), and the restricted Lorentz group SO(1,3)+ in trajectory prediction and top-quark tagging tasks" (A). No quotable accuracy number came back; do not invent one.
- Descendants: Symmetry-Informed Governing Equation Discovery (Yang, Rao, Dehmamy, Walters, Yu, arXiv 2405.16756, 2024; equivariance constraints shrink SINDy/genetic-programming search, B); DI-SINDy, differential invariants as library terms (arXiv 2505.18798, ICML 2025 listing, B); Symmetry Discovery for Different Data Types (arXiv 2410.09841, B); Shaw et al., "Symmetry discovery beyond affine transformations" (NeurIPS 2024, B); Discovering Symmetry Groups with Flow Matching (arXiv 2512.20043, C); **Noether's Razor** (van der Ouderaa, van der Wilk, de Haan, NeurIPS 2024, arXiv 2410.08087): learns Hamiltonian and conserved quantities jointly by Bayesian model selection; "correctly identifies the correct conserved quantities and U(n) and SE(n) symmetry groups" on n-harmonic oscillators and n-body systems (A, proof of principle). A 2024 critique: LieGAN-type methods "need the data distribution to be already highly symmetric" and a wrong number of generators gives wrong bases (B, from 2410.09841's intro).
- Point cloud: a ring of dots; a hidden rotation turns all dots together, the ring stays; then a lopsided cloud where the same turn visibly fails (symmetry absent). Id-stable morph: dots keep identity, so "same cloud" is checkable.

### B3. Conservation laws inside training (Kunin; Marcotte, Gribonval, Peyre)
- Lay: while a network learns, some numbers about its weights stay exactly fixed, because of a symmetry in how the weights are wired.
- Invariant: for a hidden neuron with input weights u and output weights v, |u|^2 - |v|^2 does not change under gradient flow ("balancedness"). Symmetry: rescaling u by a and v by 1/a leaves the network's function unchanged (ReLU) or a rotation of hidden units (linear).
- Numbers:
  - **Kunin, Sagastuy-Brena, Ganguli, Yamins, Tanaka, "Neural Mechanics"**, ICLR 2021, arXiv 2012.04728 (A): "symmetries built into a network's architecture produce conservation laws during training, analogous to Noether's theorem"; finite learning rates break them; validated "on VGG-16 trained on Tiny ImageNet".
  - **Marcotte, Gribonval, Peyre, "Abide by the Law and Follow the Flow"**, NeurIPS 2023 (oral listing nips.cc/virtual/2023/oral/73829), arXiv 2307.00144 (A): conservation laws are "maximal sets of independent quantities conserved during gradient flows"; "find the exact number of these quantities by performing finite-dimensional algebraic manipulations on the Lie algebra generated by the Jacobian of the model"; SageMath code; for linear and ReLU architectures "all known laws are recovered ... and there are no other laws" (B: summary of the abstract, caveat below).
  - Counts for a width-r two-layer net (derived, grade B, **verify against the paper's tables before screening**): ReLU, one law per hidden neuron = r; linear, one law per entry of the symmetric r x r matrix U^T U - V^T V = r(r+1)/2. Example r = 8: 8 and 36. Snippet support: "for every symmetric matrix A, the quantity <U,UA> - <V,VA> is conserved ... matches all the conservation laws" (linear) and "for each neuron i, ||U_i||^2 - ||V_i||^2 is conserved" (ReLU), as reported by a later paper. A 2025/26 paper says a downstream proof that relies on completeness "is insufficient", so do not say "proved there are no others" for general networks.
  - **Keep the Momentum** (ICML 2024, arXiv 2405.12888, A): momentum laws "depend on time and are generally fewer in number"; one summary says for ReLU nets with momentum "no conservation law remains" (C, secondary).
  - **Transformative or Conservative?** (ICML 2025, arXiv 2506.06194, A): "residual blocks have the same conservation laws as the same block without a skip connection"; "for a single attention layer, the authors fully characterize all conservation laws".
  - **Conservation Laws for Modern Neural Architectures** (Tran et al., arXiv 2606.17816, accepted ICML 2026, B): extends to GELU, SiLU, SwiGLU, multihead attention with sinusoidal and rotary encodings, mixture-of-experts; "resolving the open problem" for multihead attention. Fresh (June 2026), unreplicated.
- Point cloud: each hidden neuron is a dot at (|u|, |v|); during training every dot slides along its own hyperbola |u|^2 - |v|^2 = c (the dot cannot leave); switch to a big step size and the dots drift off their curves (Kunin's broken law). Direct echo of Part 1 ("a dot cannot leave its shell"). Honest limit: laws are exact for continuous-time gradient flow, approximate under SGD, and absent for many modern parts.

### B4. Geometric deep learning: symmetry as the design rule (Bronstein et al.)
- Lay: build the symmetry into the network so it does not have to learn it.
- Invariant/symmetry: a network is "equivariant" if transforming the input transforms the output the same way (rotate a molecule, rotate the prediction).
- Numbers: Bronstein, Bruna, Cohen, Velickovic, "Geometric Deep Learning: Grids, Groups, Graphs, Geodesics, and Gauges", arXiv 2104.13478 (27 Apr 2021), 156 pages (A); "geometric unification" inspired by Klein's Erlangen Program, one framework for CNNs, RNNs, GNNs, Transformers (A, abstract); Section 3.5 "The Blueprint of Geometric Deep Learning" (A, table of contents only).
- AlphaFold 2: median GDT_TS 92.4 on CASP14, 87 of 92 domains high accuracy (B, a review); Invariant Point Attention makes the structure module "invariant to translation and rotations" (B, secondary). **AlphaFold 3 dropped IPA** for a diffusion model and "no longer explicitly guarantees SE(3) equivariance" (B, blog). So equivariance is a design choice, not a law of the field.
- Point cloud: a protein-like cloud rotates; the output cloud rotates with it, dot for dot.
- Honest limit: equivariance guarantees a symmetry of the MODEL; it says nothing about conserving a quantity in time. Do not conflate with Noether charges.

### B5. Do big weather models conserve anything?
- Lay: they are very good forecasters, but they do not obey the book-keeping rules of physics unless someone adds them.
- Numbers: **GraphCast**, Lam et al., Science 382, 1416-1421 (2023), arXiv 2212.12794 (A, abstract): "hundreds of weather variables for the next 10 days at 0.25 degree resolution globally in under 1 minute"; "outperforms the most accurate operational deterministic systems on 90% of 1380 verification targets". **Aurora**, Bodnar et al., Nature 641, 1180-1187 (29 May 2025), doi 10.1038/s41586-025-09005-y (A): "trained on over one million hours of geophysical data"; 1.3 billion parameters (B: Microsoft blog and arXiv 2405.13063; not seen in the Nature snippet).
- Conservation: Bonavita (2023) on Pangu-Weather: forecasts lack "the fidelity and physical consistency of physics-based models" (B). NCAR, J. Adv. Model. Earth Syst. (2025), "Improving AI weather prediction models using global mass and energy conservation schemes" (arXiv 2501.05648, B; tested on FuXi, not GraphCast): AI models "often lack physical consistency". **PhysMetrics.Weather**, arXiv 2606.10642 (Kasteleyn, Maier, Lauer, Eyring, Gentine, Lucic; B for existence); a search summary said GraphCast "loses dry air mass while simultaneously generating water mass" and Pangu "dries the atmosphere" over 240 h (C: not in the quoted abstract, not peer reviewed; do not screen). NeuralGCM (physics solver plus ML) "stays stable" (C).
- Verdict for the film: the true line is "equivariant networks are everywhere; conservation in them is not automatic, and has to be built or checked". Fits the series: Part 2 already covers weather; here one sentence at most.
- Point cloud: air parcels (dots) with a total-mass counter; a model run drifts the counter; the conservation fix pins it.

### B6. Symmetry in LLM reasoning: the symmetry models break (peer-reviewed, A)
Strict result: no peer-reviewed work found that proves or measures a Noether conservation law in an LLM agent pipeline or a knowledge graph. What does exist is evidence about the symmetry itself: reordering independent items should not change the answer, and for LLMs it does.
- **Premise Order Matters in Reasoning with LLMs** (Chen, Chi, Wang, Zhou, Google DeepMind), ICML 2024, PMLR 235:6596-6620, arXiv 2402.08939 (A): "permuting the premise order can cause a performance drop of over 30%"; benchmark R-GSM; models do best when premises follow the order of the needed reasoning steps. (A later paper cites "up to 40%"; use 30%.)
- **LLMs Are Not Robust Multiple-Choice Selectors** (Zheng et al.), ICLR 2024 Spotlight, arXiv 2309.03882 (A): "20 LLMs on three benchmarks"; models "prefer to select specific option IDs as answers" (token bias, e.g. "A"); debiasing method PriDe.
- **Order Doesn't Matter, But Reasoning Does** (He et al.), EMNLP 2025, arXiv 2502.19907 (B): shuffle independent premises using a DAG over reasoning steps ("commutativity"); training on valid reorderings improves reasoning.
- KG side: **Gao, Zhou, Ribeiro 2023**, "Double equivariance for inductive link prediction" (arXiv 2302.01313, B): knowledge graphs as doubly exchangeable, equivariance to permuting entities AND relations. **Flock** (arXiv 2510.01510, ICLR 2026 poster listing, B). These are permutation-symmetry results for KG models, not conserved quantities.
- Point cloud: 6 coloured copies (3! orderings) of the same question cloud; a published model's answers split into clusters (answers that should coincide do not); a consistent model's six copies fuse. This is the bridge from published fact to the owner's program: the symmetry is real and testable, the "charge" is the part nobody has defined.

### B7. The one close published neighbour of the owner's idea
Operadic consistency (Bottman, Liu, Richardson; see A3): direct answer versus answer composed from a stated decomposition, "label-free", correlates with accuracy over 12 LLMs (4B to 671B) and 4 multi-hop QA sets (A for the numbers 12 / 4 / 4B-671B; the correlation value did not come back; CoT self-consistency "about 0.45 on MuSiQue and StrategyQA"). It is an empirical invariance under collapse. It is not a conserved current. Use it as "the part that is already measured".

### B8. What is NOT established (say none of these)
- No theorem gives a Noether charge for question graphs or LLM pipelines (the owner's own thesis says so; my search found none).
- Equivariance is not conservation (B4). Training laws hold for gradient flow, not for all real training (B3). ML weather models are not conservative by default (B5).
- Machine discovery works on small, clean, noise-controlled systems (5 Hamiltonian systems; n-body toys), not on messy data at scale; symmetry-discovery methods are demonstrated on benchmarks and need the right number of generators (B2).

---
## C. Point-cloud kit for Part 3 (suggested; writers decide)
| scene | cloud | move | count on the readout |
|---|---|---|---|
| S1 recall | 30,000 dots in shells (Part 1) | camera orbit | "shells: stays fixed" |
| S2 machine finds the shell | orbit samples, no labels | dots settle on level set | "5 systems, every exact law found" |
| S3 machine finds the symmetry | ring/lopsided blob | joint turn, ring survives | "learned: rotation" (qualitative; no accuracy number) |
| S4 training | 8 hidden-neuron dots on hyperbolas | slide, then drift at big step | "8 laws (ReLU, width 8); 36 (linear)" if verified, else just "1 per neuron" |
| S5 questions | 19-node tree as cloud (4 / 8 / 7 by layer) | permute 3 siblings, 6 copies | "3! = 6 orderings" ; "published: order shuffles cost > 30% accuracy" |
| S6 collapse | 6 copies fuse onto one claim | collapse | label ON STAGE: "PROGRAM - not yet a theorem" |
Chain: gl-pointcloud + gl-camera-rig + gl-labels (+ gl-instances for S5 copies). Text rules: one readout, one caption band, one corner tag; nothing over the cloud. Program label lives in the corner tag, not on the cloud.

## D. Proposed story spine for Part 3 (153 s, honest, counts first)
Question: What happens when we ask for numbers that never change in knowledge itself?
| t (s) | beat | caption (lay, one line) | readout / corner tag | source (grade) |
|---|---|---|---|---|
| 0-12 | Recall: dots stay on their shells | "A symmetry hides a number that never changes." | corner: PART 3 | Part 1 |
| 12-40 | Machine finds the number | "Show a computer only the motion. It finds what stays." | "5 systems · every exact law found" | Liu-Tegmark 2021 (A) |
| 40-62 | Machine finds the symmetry | "Or ask: what can I do to every dot and change nothing?" | "learned: rotation, then Lorentz boosts" | LieGAN 2023 (A) |
| 62-95 | Inside learning itself | "While a network learns, some numbers about its weights cannot move." | "1 law per neuron" ; "8 neurons = 8 laws" (verify) ; then drift: "big steps break it" | Kunin 2021, Marcotte 2023 (A/B) |
| 95-112 | The turn: knowledge | "Now take questions. Put three side by side." | "3 questions · 6 orders" | arithmetic (A) |
| 112-132 | The symmetry models break | "Reorder facts that do not depend on each other. A good reasoner should not care. Real models do: up to 30% less accurate." | "published: ICML 2024" | Chen et al. 2024 (A) |
| 132-146 | The owner's program, labelled | "A question tree: 19 questions. The idea: some claims survive every reordering. We call them candidates." | corner tag: PROGRAM, NOT A THEOREM | course (A for count) |
| 146-153 | Honest line + CETI card | "No one has proved a Noether law for knowledge. This is a map of where to look." | CETI card | thesis s8 (A) |
Alternative to shorten: drop LieGAN beat (B2) and give training dynamics 20 s more; keep Liu-Tegmark because it is the only "machine discovers a conserved quantity" with a clean count.
Honest-limits line (pick one): "Nobody has proved a Noether theorem for questions; this is a program, not a result." (matches the owner's own wording "program, not theorem").
Do not say: "Noether's theorem for knowledge", "conservation of truth" as physics, "AI discovers new laws of nature" (all five systems were known), "weather AI conserves energy", "equivariance = conservation".
On stage labelling: when the question tree appears, the corner tag reads PROGRAM from the first frame of that scene to the end of the film; counts in that scene are counts of the tree (what exists), never of conserved charges (nothing is measured).
Optional honest toy (label "illustration, not data", fixed seed, in-film arithmetic): three independent sub-answers a, b, c with a claim = their sum; all 6 orderings give the same sum (the invariant), while a toy "model" whose answer depends on order shows 6 different values. Gives the viewer the sibling-permutation test without implying a measurement. Every digit still needs its formula on the card.

## E. Verification list before any number ships
1. Marcotte-Gribonval-Peyre tables: r and r(r+1)/2 counts and the exact completeness conditions (spanning condition on loss gradients).
2. Aurora 1.3 B parameters in the Nature paper (not in the snippet).
3. Whether the framework paper states "eight" or "twelve" models (ICML page vs arXiv).
4. Premise-order 30% is "up to" and depends on model/benchmark; quote as "more than 30% in some tests".
5. Course arXiv:2504.05626 (Gwilliam 2025) unverified; remove from any on-screen reference list.
6. PhysMetrics GraphCast mass-loss claim is C; keep off screen.
7. Count collision: 19 tree nodes and 19 wiki entries; show one.

## F. Sources (URLs from search results; open before shipping)
- https://arxiv.org/abs/2011.04698 and https://link.aps.org/accepted/10.1103/PhysRevLett.126.180604 (AI Poincare); https://arxiv.org/pdf/2203.12610 (2.0); https://arxiv.org/abs/1905.11481 (AI Feynman)
- https://arxiv.org/abs/2302.00236 (LieGAN); https://arxiv.org/pdf/2405.16756 ; https://arxiv.org/pdf/2505.18798 ; https://arxiv.org/pdf/2410.09841 ; https://arxiv.org/pdf/2410.08087 (Noether's Razor); https://arxiv.org/abs/2112.03321 (Noether Networks); https://arxiv.org/pdf/2511.00102 ; https://arxiv.org/abs/2603.20474
- https://arxiv.org/abs/2012.04728 ; https://arxiv.org/pdf/2307.00144 ; https://nips.cc/virtual/2023/oral/73829 ; https://arxiv.org/pdf/2405.12888 ; https://arxiv.org/html/2506.06194 ; https://arxiv.org/html/2606.17816
- https://arxiv.org/abs/2104.13478 (Bronstein et al.); https://arxiv.org/pdf/2212.12794 (GraphCast); https://arxiv.org/pdf/2405.13063 and doi 10.1038/s41586-025-09005-y (Aurora); https://arxiv.org/pdf/2501.05648 ; https://arxiv.org/pdf/2606.10642
- https://arxiv.org/abs/2402.08939 and https://proceedings.mlr.press/v235/chen24i.html ; https://arxiv.org/abs/2309.03882 ; https://arxiv.org/pdf/2502.19907 ; https://arxiv.org/abs/2302.01313 ; https://arxiv.org/html/2510.01510v2
- https://arxiv.org/pdf/2606.13634 ; https://arxiv.org/pdf/2606.13649 (questions operad; operadic consistency)
- Owner files: /home/user/manutej/noether-operadic-course/index.html ; /home/user/manutej/noether-wiki/{README.md,STRUCTURE.md,domain.package.yaml,skills/sheaf-ingest/SKILL.md,data/jane-street/puzzles.json}
