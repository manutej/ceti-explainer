# The Module Library — an operadic interview instrument (filled from evidence)

*Version 1.0 · 2026-10-08 · respondent: the Explainer Atelier's own folder (art direction, research, crits, eight
directions' NOTES/README/code, the runtime) plus Manu for the slots only he can fill · answer type of the root:
`() → module-library` · depth budget 4 · skill: operadic-interview (`treelint.py` PASS, see the end)*

---

## How to read and answer this

Answer any node at any depth, in any order, and **skip freely**: a blank slot is data too.

- A set of **deep (child) answers** composes upward into the parent's answer by the stated rule. That is *evidence-built*
  (here: quoted from files, `path:line`).
- A **direct answer at a shallow node** is its own *collapsed valuation*. Here the collapsed answers are what the
  studio *claims* (ART-DIRECTION-v1, the direction cards, NOTES headlines).
- Where a node holds **both**, the gap is the built-in consistency check. Every disagreement is listed as a
  **FINDING** in §C. None is silently resolved.

Evidence tags: `AD` = ART-DIRECTION-v1.md · `MAP` = research/PEDAGOGY-MAP.md · `JUR` = crit/JUROR.md · `PC` =
crit/PEDAGOGY-CRIT.md · `RT` = runtime/README.md, `atelier.js` = runtime/atelier.js · `<dir>/N` = chromes/<dir>/NOTES.md ·
`<dir>/R` = chromes/<dir>/README.md · `[inferred]` = my placement, not a quote · `(empty — Manu)` = only the client can
answer; collected in §D.

If you answer nothing else, answer the **★ questions**: that starred set is the minimum viable interview. Q0's children
compose as a **filter-chain**, so no single L1 node can stand in for the root. The stars therefore sit one level down,
one or two per subtree.

---

**Q0 — What library of reusable animation modules lets any CETI explainer be composed — any concept, any audience, any ladder level, any material — without a film collapsing into generic p5 or into a house look?**  `() → module-library`
▷ *Collapsed (the studio's own claim, AD §3 + §6):* "Semantic colour is invariant, ground/material varies"; eight
directions, "one kernel per film" (AD:44), each with its own teaching move. On that reading the library is *eight films
plus a runtime*. → The composed answer is in §B.

> **Compose (root):** filter-chain (∧) over Q1–Q8. A module earns a place only if it passes Q8's laws (typing,
> precedence, purity, no house look), serves a structure that Q1 grades, draws only through a Q2 material interface, and
> emits numbers that pass Q4. Q3, Q5, Q6 and Q7 add the ports a module must expose. Q8 counts double: it is the only
> subtree that can *reject* a composite at build time.

---

- **Q1 — Which pedagogical structures must the library carry as modules, in which order, and how many per film?**  `(concept, audience, level) → typed beat-pattern set`
  ▷ *Collapsed (AD §0, §7):* every Grasp = Trace + ensemble + twins + truth-under-evidence + two honesty beats; every
  Glance = ensemble + twins + commit.
  - **Q1.1 — ★ When a Grasp plays end to end, which beats actually have to happen, in what order, for the 0.95^k idea to land?**
    ▷ MAP:69 (Exec Grasp) "CF (stop at SCHEMATIC) → ENS → NF → TW"; MAP:70 (Manager) "WE → TW → ENS"; MAP:72 (Technical)
    "CC → MER(LINK) → ENS". AD:15 "The Trace opens every Grasp (concreteness fading)". AD:20 "Two honesty beats in
    every Grasp".
    - **Q1.1.1 — How did the Trace (one labelled-sketch run) open a film in any direction that actually built it?**
      ▷ None did. All eight READMEs file it under "Grasp (2 min, spec)" (run/R:22, delta/R:19, escapement/R:20,
      exposure/R:20, ledger/R:23, marbling/R:17, margin/R:17, bunraku/R:25). It exists only as prose: "step 7 fails
      (vendor 'Acme Corp' ≠ 'ACME Corporation')… the check catches it → retry by tax ID → pass" (AD §4 THE TRACE).
    - **Q1.1.2 — In the films that worked, what did the viewer see first: one run, or many?**
      ▷ Many, after one. "A hero that shows errors piling up inside one run teaches 0.05·k (linear) — the opposite
      lesson" (AD:7–9). PC §1 row F: "The featured run slips three times in 20 moves… which teaches 'errors pile up'."
      → the one-run beat must be a *labelled sketch* and must collapse into the ensemble before any count.
    - **Q1.1.3 — Where did the transfer question sit in the built films?**
      ▷ Nowhere in a film. MAP:73 puts TRF at Master ("Full explorable: ENS + MER + TRF"); MAP:113–115 gives the worked
      FAR item ("expense approval, 14 steps at 97% (computed 65.3%), no mention of agents"). delta/R:30 and
      escapement/R:26 list "Transfer: 10 steps at 99 % (0.904) vs 20 at 97 % (0.544)" as spec only.
    - **Q1.1.4 — Which beat did the crits say was missing most often?**
      ▷ Cost as a mark. PC:17 "Five of the eight leave cost as words. Only C, D and H make it a mark."

    > **Compose Q1.1:** union of beats that are *built and graded* (Q1.1.2, Q1.1.4), ordered by MAP §4 precedence;
    > beats that exist only as spec (Q1.1.1, Q1.1.3) enter as *new* modules, not extracted ones.
  - **Q1.2 — What must stay on screen after a beat ends so the viewer can compare?**
    ▷ MAP:38 "every beat boundary is a HOLD ≥2 s and a visible tick"; MAP §2 Trace column: ENS "Landed dots", PCR
    "Viewer mark stays through EXPLAIN", TW "Saved ids, cost bar", CF "Same marks persist". MAP gate Q6: "Does any
    state the viewer must later compare leave a persistent trace?"
  - **Q1.3 — How does a beat hand the controls to the viewer?**
    ▷ MAP:32 "Glance and Grasp may be film; Wield and Master must hand over controls."
    - **Q1.3.1 — ★ Narrate the last Wield a viewer could actually play: what did they place, and did placement change the outcome?**
      ▷ ledger/N (Revision 1, item 4): "per-turn reliabilities differ (sketch), budget 5 checks binds… Expected 29.0 →
      33.1". Before that, PC:39: "12 h pays for a check at all 10 turns, and with a uniform 95 % the product commutes,
      so placement cannot matter."
    - **Q1.3.2 — Where does the commit happen, on the canvas or in the side panel?**
      ▷ Both. The runtime commit control holds playback in the panel (RT:27 "holds playback at jump − countdown");
      the on-canvas presentation was the loudest tic: JUR:29 "Every shared film stops for 'how many…? pause and
      guess' with a copper '2'". REVISE: "Design the predict/commit beat IN your material."
    - **Q1.3.3 — Which films let the viewer re-run the film's own computation?**
      ▷ Natives: delta ρ slider, run BPE merges, margin "times it read Sydney", escapement handoffs 1–12 (delta/N,
      run/N, margin/N, escapement/N). Shared: ledger Wield toggles; bunraku gate placement (bunraku/R:20–23).

    > **Compose Q1.3:** filter-chain: a Wield module ships only if its task is non-degenerate (Q1.3.1) **and** its
    > commit is drawn by the material (Q1.3.2); re-run controls (Q1.3.3) are the mechanism.
  - **Q1.4 — How many content structures may one film carry at each ladder level?**
    ▷ MAP:99 "Glance ≤2, Grasp ≤4, Wield ≤3 plus one priming, Master ≤5. At most one each of INV, PF, REF, NAR… PCR
    ≤2 per film" — tagged **[inf]** by the map itself. Whether to hold that line when a client wants the full Grasp
    sequence: (empty — Manu; §D Q-M2).

  > **Compose Q1:** weighted read, honesty-doubled: what was *built and crit-graded* (Q1.1, Q1.3) counts double against
  > what the art direction *specifies* (Q1 collapsed). Budget (Q1.4) is a soft filter because it is [inf].

---

- **Q2 — Which material kernels exist in the code, what does each do that nothing else can, and what single interface lets any of them draw any pedagogy?**  `directions → Material interface + kernels`
  ▷ *Collapsed (AD §6 table):* eight kernels, one per direction: kinematics, invertible maps, granular deposition,
  unit identity, pen dynamics, staging/optics, stitch topology, accumulation.
  - **Q2.1 — For each direction, what is the one technique that would be lost if you swapped in another direction's code?**
    ▷ JUR:111 names the edge: "G-shared, t = 5.80s. Macro stockinette with true yarn shading… The address is physical,
    SVG cannot reproduce it."
    - **Q2.1.1 — Which kernels compute a pixel field (each pixel is a function, not a stroke)?**
      ▷ Marbling: "Pixel pull-back through exact inverse maps (Jaffer/Lu), no simulation" (marbling/N:10). Exposure:
      "order-independent additive exposure into a Float32 plate… tone-mapped through a cyanotype H&D curve"
      (AD §4H; exposure.kit.js:18–27 `density`, `printP`). Run's stitch atlas is per-pixel tube shading
      (run.kit.js:39–62).
    - **Q2.1.2 — Which kernels are counted sprites with persistent identity?**
      ▷ Ledger: "Pixel-grid pictograms… Re-packing by Hungarian assignment on Euclidean distance: the min-sum
      Euclidean matching is crossing-free" (ledger/N:17–20; ledger.kit.js:58–82). Run: "a forward column splatter
      with exact horizontal coverage" (run/N:40–41).
    - **Q2.1.3 — Which kernels are gestures in time (a mark is made at a moment)?**
      ▷ Margin: "Dynadraw spring-mass nib (≈26 Hz, ζ 0.72)… Washburn bleed r = r∞·√(age/τ)… oxidation by age"
      (margin/N:19–22; margin.kit.js `simPath`, `drawInk`).
    - **Q2.1.4 — Which kernels are spatial/physical (placement, mechanism, light)?**
      ▷ Delta: "Prograding-bar deposition… avalanches to any neighbour ≥1 layer lower (foreset at repose). Sequential
      in arrival order ⇒ prefix-consistent ⇒ pure seek" (delta/N:14–16; delta.kit.js:43–106). Escapement: "Exact
      involute profiles… Graham deadbeat escapement solved from contact" (escapement/N:28–30). Bunraku: "Analytic
      contact shadows… penumbra R·gap/|P−L|… Falling paper: Andersen–Pesavento–Wang (2005)" (bunraku/N:32–36).

    > **Compose Q2.1:** union; each kernel is kept *with its edge technique intact* and wrapped, not rewritten.
  - **Q2.2 — What does every kernel have to be able to draw so a pedagogy module never draws pixels itself?**
    ▷ [inferred from the mark rules in all eight NOTES] Every mark rule names the same five roles: a unit = one run,
    a sub-mark = one step, an address = where it failed, a catch = the check, a cost = work redone. Plus numbers and
    words in the material's own type.
    - **Q2.2.1 — ★ In each NOTES file, what is "one run" and what is "one step"?**
      ▷ run/N:5 "Column = one agent run. Row = one step"; delta/N:4 "Grain = one agent run. Weir = one step";
      exposure/N:4 "Each thread of light is one agent run… A slit is one step"; margin/N:5 "One continuous ink line
      of loops = one agent run; one loop = one step"; ledger/N:5 "slip = one job"; marbling/N:3 "Tray = one agent run.
      Comb pass = one step"; escapement/N:4–5 "One module = one run. One tooth… = one step"; bunraku/N:4–6 "One
      cut-paper puppet on one stage = one run. One move along the plank = one step".
    - **Q2.2.2 — How is the failure address drawn in each?**
      ▷ run "peach slack loop"; delta "settles on the north bank at its weir"; exposure "a peach dot is its address";
      margin "the pen lifts mid-loop… a peach-pencil × marks it"; ledger "drop whole onto their turn's line";
      marbling "how combed the peach is = its pass"; escapement "peach tooth + hand"; bunraku "the puppet hangs where
      it fell and the peach tick is the address" (each `<dir>/N` mark-rule paragraph).
    - **Q2.2.3 — How is a number put on screen in each, and is it read from the marks?**
      ▷ exposure/N:8 "Densitometer bars are plate column sums ÷ n, asserted equal to the engine's survivors";
      ledger/N:23 "Every figure is a count of units at t"; escapement/N:36 "drums advance only when the head passes a
      home hand"; margin/N:44 "counts are gates made from the ✓s".

    > **Compose Q2.2:** the interface = the intersection of Q2.2.1–Q2.2.3: `units(items)` (run/step/address/catch in
    > one call, so the kernel batches), `mark(kind)` for address/save/cost/guess/truth/tick, `line(role)` and
    > `area(role)` for exact field and band, `text(role)` and `num(Number)` in the material's type, and
    > `layout(kind)` so each kernel packs units at its own natural aspect.
  - **Q2.3 — How many runs can each kernel show legibly at 960×540?**
    ▷ From the code: run, delta, exposure 2,000 (run/N:13, delta/N:22, exposure/N:15); ledger 100 (ledger/N:26);
    escapement and bunraku 50 (escapement/N:14, bunraku/N:17); margin 50 rows (margin/N:28); marbling 48 trays
    (marbling/N:17). AD:8 claims "50–2,000 runs" uniformly.
  - **Q2.4 — What did the kernels end up sharing that the doctrine says they must not?**
    ▷ JUR:27–38 "there is a house look": countdown modal, twin panels, header strip, shared endings, "A-shared and
    F-shared are both a dark wall of ~50 lit/unlit miniatures". [inferred] None of these is a *kernel*; all are
    pedagogy-layer beats re-implemented by hand in each film.

  > **Compose Q2:** pool-then-rank: Q2.1 pools the kernels; Q2.2 is the interface every kernel must satisfy (it counts
  > double: a kernel that cannot draw an address is rejected); Q2.3 gives each kernel its capacity; Q2.4 says which
  > layer the house look lives in (not here).

---

- **Q3 — What camera and transition grammar turns one run into many, shows the twin without panels, and points at an address, while staying pure in t?**  `beats → Shot modules`
  ▷ *Collapsed (AD §4):* per-direction moves: "Pull back to a bank of 50" (A), "each half dollies out" (B), "the camera
  starts on 20 columns at macro, pulls back to all 2,000" (G), "Crane up: a district of 50 stages" (F).
  - **Q3.1 — ★ How did the best pull-back keep the viewer oriented from one run to the mass?**
    ▷ run/N:19 "camera pulls back 48 px → 2.2 px per column"; marbling/N:46 "each half a true log-zoom dolly from its
    tray, neighbours fading in"; run/shared.film.js:118 log-interpolated scale `Math.exp(U.lerp(Math.log(s0),
    Math.log(s1), e))`. JUR:101 asks G for "one continuous sheen swatch", not five strips.
  - **Q3.2 — How were the twin worlds shown once the panels were banned?**
    ▷ escapement/N:56 "The checked bank stands behind the unchecked one in depth"; ledger/N:59 "One page, not twin
    panels… posted without checks, then corrected"; margin/N:74 "Twin worlds in one object: the same lines carried on
    by the check"; exposure/N:61 "Twin = second exposure of the same plate".
    - **Q3.2.1 — Which of those keeps the off-world visible while the on-world appears?**
      ▷ exposure ("lights only where the check added light", exposure/N:16) and margin (same lines carried on). Both
      are onion-skin: the first state stays as a ghost, the second is drawn over it.
    - **Q3.2.2 — Which of those keeps object identity (the same run is the same mark)?**
      ▷ ledger "rescued jobs are reversed out of the exception rows back into the block" (ledger/N:60); escapement
      "re-rack by the step each run stopped at (object identity kept)" (escapement/N:62).
    - **Q3.2.3 — Which one broke a law while doing it?**
      ▷ run kept stacked swatches (run/N:13 "Top (checks off)… Bottom (checks on)") — JUR:30 lists G under "stacked".

    > **Compose Q3.2:** filter-chain: onion-skin (Q3.2.1) ∧ identity kept (Q3.2.2) ∧ no panels (Q3.2.3) → *correction in
    > one object*: the same racked units grow from the off-world silhouette to the on-world one, with the old
    > silhouette left as a ghost line.
  - **Q3.3 — How does the camera show *where* a run failed?**
    ▷ margin/N:55 "camera follows the pen"; bunraku/R:44 "At district scale the puppet is a warm dot. The address
    reads only in the medium shot"; JUR:52–55 "Address: Lost in A-shared… and B-shared (the stray's pass is unreadable
    at tile size)". → an address zoom is needed whenever units are smaller than their address mark.
  - **Q3.4 — Which moves are banned or failed in practice?**
    ▷ AD:37 "spinning polyhedra / orbit-around-nothing"; escapement/N:40 "orbit cameras"; JUR:70 A "Stay in 3D. Cut the
    flat grids" (a cut, not a move, broke continuity); MAP §2 HYG "camera moves hiding the referent".

  > **Compose Q3:** union of the moves that survived crit (Q3.1 log pull-back, Q3.2 correction-in-one-object, Q3.3 address
  > zoom), minus Q3.4. All are closed-form in t (no integrator), so they compose with the clock law for free.

---

- **Q4 — Where does every number come from, how is realised shown against expected, and which honesty beats are mandatory?**  `engine → Number{exact, realised, sd} discipline`
  ▷ *Collapsed (AD §1):* "the runtime's AgentLoop engine computes them — never type them"; RT:9 "Numbers come from
  the engine (AgentLoop) or are read from the marks".
  - **Q4.1 — ★ For one number on screen, trace its path: engine, marks, or typed?**
    ▷ atelier.js:279–327 AgentLoop returns `survivors`, `expected`, `sd`, `saved`, per-run `events`; gate META checks
    rows "within 4 sd" (gate.py docstring). D-native r0 typed a lucky month in big type: JUR:46 "'kept 400' without
    checks beside '−6 expected', so the seed invents a positive ROI."
    - **Q4.1.1 — What word does the screen use for the computed value: exact or expected?**
      ▷ PC:31 (defect 2): "'exact 717 ± 21'… 'Exact ±' contradicts itself for a lay viewer. Use expected." The runtime
      readout still prints `exact … ± …` (atelier.js:742).
    - **Q4.1.2 — What happens when the realised draw lands far from expectation?**
      ▷ JUR:85 (D fix 1) "Re-seed. Pick seeds within 0.5 sd of expected"; AD:14 "Seeds are never cherry-picked";
      REVISE:27 "never cherry-pick… increase N, show the distribution/ensemble, or lead with the exact expectation";
      ledger/N:55 "Seed 1 is a lucky month… shown, not re-rolled".
    - **Q4.1.3 — How are illustrative values marked?**
      ▷ AD §1 "Anything else illustrative is labelled sketch on screen"; PC §3 C "ρ=0.8 needs a sketch label".

    > **Compose Q4.1:** filter-chain: engine-or-marks ∧ the word *expected* ∧ fixed seed (no outcome-based choice) ∧
    > sketch label on anything else. Implementation: a typed `Number{q, exact, realised, sd, N, source}` that the
    > material's `num()` refuses to draw unless it has that type.
  - **Q4.2 — How is realised-vs-expected shown without a footnote line?**
    ▷ REVISE "the truth-vs-realised statement must be integrated into the image (a sounding, a densitometer, a selvage
    count, a folio total), not a footnote line"; JUR:32 "All eight have an 'expected ± sd' footnote".
    - **Q4.2.1 — Which film let the ruler test pass with numerals hidden?**
      ▷ JUR:57 "Passes in D, E and B (the 24s sort)"; delta/N:16 "Flat top ⇒ length ∝ count ⇒ bank silhouette =
      0.95^j"; escapement/N:62 "re-rack… so their silhouettes are the survival curves".
    - **Q4.2.2 — Which film showed the √N band narrowing as N grew?**
      ▷ exposure/N:59 "10, then 100, then 2,000 on one plate… The loupe magnifies the rim: the 95 % band (± 2 sd) is
      the hero and visibly narrows."
    - **Q4.2.3 — Where was the exact field drawn relative to the evidence?**
      ▷ Under it: "the exact probability… drawn as a faint field and the sampled marks land on it" (AD:12–13);
      delta/N:18 "dashed exact bank lines (W0·p^s)"; margin/N:72 "copper staircase traced through the row ends over the
      dashed exact curve".

    > **Compose Q4.2:** union → one module, *truth-under-evidence*: rack the units by survival (silhouette = curve,
    > Q4.2.1), draw the exact curve under them (Q4.2.3), the ±2 sd band at the count edge (Q4.2.2), and realised beside
    > expected as marks on that edge.
  - **Q4.3 — What do checks cost, in a unit the engine can compute?**
    ▷ Every direction invented its own unit: escapement "each catch holds that movement one extra beat… sketch cost
    model" (escapement/R:39); exposure "a sage bead for every step done twice (+1,409 steps, 3.9 % more work)"
    (exposure/N:63); ledger "review cost is debited as 2× hourglasses" (ledger/N:62); margin "the price as gates of
    'steps done twice'" (margin/N:76). Only "steps done twice" is computable from AgentLoop flags (bit1 caught,
    atelier.js:282).
  - **Q4.4 — Which honesty beats are mandatory, and what does each claim?**
    ▷ AD:20 "errors assumed independent (correlated errors are worse); checks cost time and money". PC §3 C: "'Checks
    cannot catch a shared cause' over-generalises. → 'Checks that read the same source.'" How much "sketch" an exec
    room tolerates: (empty — Manu; §D Q-M6).

  > **Compose Q4:** filter-chain over Q4.1–Q4.4, with Q4.1 doubled (a typed number is the only gate that is mechanical).

---

- **Q5 — What does a viewer do, what is logged, and how is understanding tested without a cue?**  `controls → Commit, Evidence`
  ▷ *Collapsed (AD §7):* "the Wield control on the live page (commit a prediction first, then run)".
  - **Q5.1 — ★ In the revised films, what does the commit look like in the material itself?**
    ▷ escapement/N:61 "a pendulum beating three times beside the question"; ledger/N:65 "a pencil rule across the
    block with a pencilled figure and three pencil strokes as the countdown"; exposure/N:57 "the viewer's guess is a
    grease-pencil mark on the rim gauge while an enlarger-timer hand sweeps it"; margin/N:77 "the viewer's pencil
    tapping three ticks, then marking the ruler".
  - **Q5.2 — What makes an inverse (Wield) task non-degenerate?**
    ▷ MAP:58 INV "Ship a degenerate task (uniform p commutes, budget buys everything, CRIT-d10)".
    - **Q5.2.1 — Which parameter must vary across steps?**
      ▷ PC:39 "Vary the per-turn reliabilities (sketch)".
    - **Q5.2.2 — How tight must the budget be?**
      ▷ PC:39 "set the budget to 5 h"; ledger/N:66 "budget 5 checks binds".
    - **Q5.2.3 — What is logged from the first move?**
      ▷ MAP:58 "[L: first move, n moves, final, forecast error; E]".

    > **Compose Q5.2:** filter-chain: non-uniform p ∧ binding budget ∧ first move logged; the composer rejects an INV
    > module whose per-step p is uniform.
  - **Q5.3 — What evidence is logged, where, and who may see it?**
    ▷ MAP:106 the row `{film_id, build_hash, seed, level, structure_id, item_id, claim_id, t_prompt, t_commit, value,
    conf, truth, signed_error, first_move, n_moves, final, curve_class, hint_used, skipped, days_since_exposure}`;
    MAP:110 "export is opt-in aggregate counters only; never an individual trace". Whether CETI will ever collect
    cohort aggregates: (empty — Manu; §D Q-M5).
  - **Q5.4 — How is transfer asked without giving the structure away?**
    ▷ MAP:114 "FAR: new domain, same structure, no cue → COMMIT(v, C) → LEVER(shorten / check / gate) → REVEAL from
    K"; MAP:59 TRF "Mention 'agents' or hint at the structure in FAR" is a never.

  > **Compose Q5:** union of required ports: `Commit` (drawn in-material, Q5.1), `Evidence` row spec (Q5.3), the INV
  > degeneracy filter (Q5.2) and the TRF no-cue rule (Q5.4).

---

- **Q6 — What type and legibility rules must every module obey, whatever the material?**  `material type → text roles + limits`
  ▷ *Collapsed (AD §3):* "Type roles: display / text / mono-numbers… swaps allowed where the material demands".
  - **Q6.1 — ★ On a phone-width frame, which text carried a result or an honesty beat at a size nobody could read?**
    ▷ PC:71 "the smallest type must never carry the result or an honesty beat. C-native, G at 30.5 s and H at 29.8 s
    all break it"; PC §1 G "Cost and independence are in 7-px type at 30.5 s". REVISE "≥ 14 px at 960×540 for
    anything that must be read".
  - **Q6.2 — How many encodings of one quantity may be on screen at once?**
    ▷ PC:32 (defect 3) "The screen says '36 % / 79 %' while the caption says '1 in 3 / 4 in 5'… Pick one, ideally
    '36 of 100'." MAP:80 "ENS ▷ NF ▷ percentage". margin's first commit asks for a percentage before any count
    (margin/shared.film.js:38 `'Share of runs that finish, no check (%)'`).
  - **Q6.3 — Is the verbal channel captions or voice-over?**
    ▷ PC:73 "The audio is SFX only, so the .srt is the verbal channel… Choose one approach: VO… or captions only".
    (empty — Manu; §D Q-M1).
  - **Q6.4 — Whose typeface sets the words: the house's or the material's?**
    ▷ The material's: delta "Cartographic lettering… Cormorant Garamond… IBM Plex" (delta/N:9–10); ledger "Newsreader…
    IBM Plex Sans Condensed" (ledger/N:13–15); exposure "Display type is exposed into the plate" (exposure/N:11);
    run "knitted colourwork title" (run/N:25).

  > **Compose Q6:** filter-chain: material typeface (Q6.4) ∧ must-read ≥ 14 px (Q6.1, doubled) ∧ one encoding, counts
  > before percentages (Q6.2). Q6.3 stays open.

---

- **Q7 — What does a module sound like, and who decides the timbre?**  `beats → score events`
  ▷ *Collapsed (AD §4A):* "Sound: tick per step, dull clack per slip, a sage click per catch."
  - **Q7.1 — What drives the sound in every built film?**
    ▷ RT:46–48 "One event list drives both the live WebAudio… and the offline WAV"; every direction's score uses only
    the four runtime voices tick/clack/click/tone (counted from `kind:` in each shared.film.js).
  - **Q7.2 — ★ Where did a material want a sound the runtime could not make?**
    ▷ delta/R:49 "Audio uses the runtime's primitive voices; there is no water bed"; margin "a soft scratch per pen
    stroke… nib against the inkwell rim" (margin.kit.js `scratchScore`) is built from `tick` and `click`.
  - **Q7.3 — Should CETI films carry a voice, a bed, or silence plus SFX?**
    ▷ (empty — Manu; §D Q-M3).

  > **Compose Q7:** modules emit *semantic* events (step, fail, save, reveal, commit); the material maps each to a voice
  > and pitch. Q7.3 decides whether a bed/VO port is ever needed.

---

- **Q8 — Which composition laws decide what may plug into what, what must precede what, and what every composite must satisfy?**  `operad → laws`
  ▷ *Collapsed (studio operad, ceti-p5-studio/references/operad.md §4):* "Typing. f ∘ᵢ g is legal only if g's output
  color equals f's i-th input color"; associativity; "Stream independence"; "Immutability downstream".
  - **Q8.1 — ★ Which wiring mistakes did the crits catch that a type checker would have caught first?**
    ▷ PC:38 (defect 9) "'7 of 10 cleared: 70 %' (+2.2 sd) comes right before the commit and anchors the guess" →
    a revealed Number before its Commit. PC:34 (defect 4) "B's 48 trays produce '19 of 48'… against '19 of 50'" →
    N mismatched across films sharing one claim. PC §1 H "height = time against plan… reads as drift building inside
    one run" → a mark with no typed meaning.
    - **Q8.1.1 — Which types flow between beats?**
      ▷ [inferred from the runtime and MAP §2 ports] Params, Ensemble (AgentLoop + world), Run, Trace, Arrangement
      (unit rects), Number, Commit, Evidence, Focus/Shot, Cost.
    - **Q8.1.2 — Which edges need the *same seed*?**
      ▷ MAP:85 "TW ▷ needs ENS or NF upstream (same seed)"; AD:10 "the same random draw per (run, step)".
    - **Q8.1.3 — Which edge carries the material?**
      ▷ [inferred] one Material per film: "no two directions share a sim core or a mark grammar" (AD:44) implies a film
      is one material, and a module may not bring its own.

    > **Compose Q8.1:** union of edge types; a wire is legal only if the types match and, for TW, the Ensemble comes
    > from the same engine node.
  - **Q8.2 — What must precede what?**
    ▷ MAP:79–90 rules 1–12 (PCR ▷ REVEAL; ENS ▷ NF ▷ %; CF concrete ▷ symbol; WE order; CC/ANA order; REF REPLACE after
    MYTH; TW needs ENS + COST; RET/SE after content; CAL needs PCR; TRF last; PF at Wield+; INV after PCR and TW [inf]).
    Grades: rules 1–11 cite studies (A/B); rule 12 and the maxima are [inf].
  - **Q8.3 — How is the clock law guaranteed for a composite, not just for one film?**
    ▷ RT:7 "Never use frameCount, millis(), Date, performance.now, Math.random or p.random… Violations are recorded and
    fail the gate." In practice purity broke *outside* those tokens: margin/N:84 "smoothed scratch→frame blits sample a
    pixel just outside the source rect"; bunraku/N:57 "dFdx after discard reads undefined helper lanes".
    - **Q8.3.1 — Which state may a module keep between frames?**
      ▷ RT:33 `stateAt` "exact in any seek order"; RT:8 "Build once. setup builds geometry… draw only renders".
    - **Q8.3.2 — When do score and meta run relative to setup?**
      ▷ RT:82 "score(ctx) and meta(ctx) run BEFORE setup(): anything they need must be computed lazily/purely."
    - **Q8.3.3 — What proves purity after composition?**
      ▷ gate.py PURE-REP and PURE-ORD (re-seek and order-swap hashes at 5 t).

    > **Compose Q8.3:** filter-chain: static token scan of every module ∧ lazy, seed-keyed build (Q8.3.2) ∧ caches keyed
    > by render scale only (Q8.3.1) ∧ the gate (Q8.3.3).
  - **Q8.4 — What stops the house look from coming back when films are composed from shared parts?**
    ▷ JUR:27–40 the tics; REVISE "make the set stop looking like one studio's template". [inferred] Shared parts are
    exactly how a house look spreads, so the rule must be structural: *pedagogy and camera modules never draw*; only
    the film's one Material draws; the commit, the twin and the ending are material calls.

  > **Compose Q8:** filter-chain, hard laws first: types (Q8.1) ∧ graded precedence (Q8.2, A/B) ∧ purity (Q8.3) ∧
  > no-draw-outside-material (Q8.4). [inf] laws (maxima, rule 12) are soft: they warn and need a written waiver.

---

## B. Composed root answer (= the module library spec)

Composition, leaf → root, by the stated rules:

1. **Q2 → the Material interface.** `{id, axis, cell, nRange, layout(kind,N,k,rect), units(S,items,t),
   mark(S,kind,x,y,o), line(S,pts,role,o), area(S,top,bot,role,o), text(S,str,x,y,o), num(S,Number,x,y,o),
   anchor(rect,j,k), voice}`. Kernels wrapped intact: stitch (run), plate (exposure), pen (margin), isotype (ledger),
   maps (marbling), sediment (delta), gear (escapement). Each declares `nRange` (Q2.3).
2. **Q1 + Q4 + Q5 → pedagogy modules** that never draw: traceOpener + concretenessFade (CF), predictCommitReveal (PCR),
   ensembleRun (ENS+NF), failureAddress, truthUnderEvidence (ENS overlay: rack + exact + √N band + realised),
   contrastingTwins (TW as correction-in-one-object), costOfCheck (TW.COST from engine flags), correlatedCaveat
   (honesty), transferQuestion (TRF), inverseProblemWield (INV, non-degenerate), workedExampleFade (WE).
3. **Q3 → camera modules**, closed-form in t: hold, pullBack (log zoom), crane (minimum-jerk), addressZoom,
   rackFocus (onion-skin mix for the twin).
4. **Q6 + Q7 → ports and limits** on every module: text roles with a 14 px floor for must-read roles; a digit in a
   string must be declared *given* or *sketch* (results go through `num`); semantic sound events re-voiced by the
   material.
5. **Q8 → the composer** (compose.js) and the lint (check.mjs), sharing one law file: typing, same-seed TW, graded
   precedence (hard), [inf] maxima (soft + waiver), material capacity, static clock scan, and the
   no-draw-outside-material law.

**Root, in five lines:** (1) A film is a beat graph of typed pedagogy modules over one Material. (2) Modules never
draw; the Material draws every unit, address, catch, cost, number and word in its own kernel and type. (3) Every number
is a typed engine Number shown as *expected* beside *realised*, read off a racked silhouette. (4) Order is enforced by
graded precedence laws at build time; [inf] budgets warn and need a waiver. (5) Cameras and transitions are closed-form
in t, so composition preserves the clock law, and the gate proves it.

## C. Findings (collapsed vs composed)

```
FINDING F1 @ Q1.4 / Q1
  collapsed : AD:15–20 "The Trace opens every Grasp… Two honesty beats in every Grasp" (+ brief: Trace → ensemble → twins → truth → cost → honesty → transfer)
  composed  : MAP:99 "Grasp ≤4" content structures [inf]; that sequence is CF + PCR + ENS + TW + TRF = 5, and MAP:73 places TRF at Master
  gap hypothesis : the art direction was written before the map's budgets; the budget is itself [inf]
  back to respondent : is the full Grasp sequence worth breaking an [inf] budget, or does transfer move to Wield?
```
```
FINDING F2 @ Q2.4 / Q8.4
  collapsed : AD:44 "one kernel per film (no two directions share a sim core or a mark grammar)" — the house look is a kernel problem
  composed  : JUR:27–38 the house look is four *pedagogy-layer* beats (countdown modal, twin panels, header strip, shared ending); no kernel is shared
  gap hypothesis : the doctrine policed the wrong layer; every team re-typed the same beat shapes by hand
  back to respondent : accept "modules never draw" as the structural fix?
```
```
FINDING F3 @ Q4.1.1
  collapsed : PC:31 "Use expected"; REVISE "('exact ±' removed)"
  composed  : the runtime readout still prints `exact … ± …` (atelier.js:742) on every live page
  gap hypothesis : the fix landed in films, not in the shared player
  back to respondent : patch the runtime label (runtime team), or let the library override the readout?
```
```
FINDING F4 @ Q4.1.2
  collapsed : AD:14 "Seeds are never cherry-picked"; REVISE:27 "never cherry-pick"
  composed  : JUR:85 (D fix 1) "Re-seed. Pick seeds within 0.5 sd of expected"; ledger kept seed 1 (ledger/N:55)
  gap hypothesis : the juror optimised the image; the doctrine optimises honesty
  back to respondent : the library fixes the seed in the graph and never selects it by outcome — confirm?
```
```
FINDING F5 @ Q3.2 / Q1
  collapsed : AD §4 cards: "Twin bank below" (A), "Twin wall" (B), "Twin river" (C), "Twin ledger" (D), "Twin swatch" (G)
  composed  : every revision that passed crit drew the twin as a correction of one object (escapement/N:56, ledger/N:59, margin/N:74, exposure/N:61)
  gap hypothesis : the card language described panels; the crit taught one-object counterfactuals
  back to respondent : make correction-in-one-object the only twin the library ships?
```
```
FINDING F6 @ Q4.3
  collapsed : AD:20 "checks cost time and money" (a required beat)
  composed  : the engine has no cost model; four directions invented four units (beats, beads, hourglasses, gates); only "steps done twice" is computable from flags
  gap hypothesis : cost was specified as a story beat, not as an engine output
  back to respondent : is "steps done twice" (+ a sketch-labelled time conversion) enough for an exec room?
```
```
FINDING F7 @ Q2.3
  collapsed : AD:8 "every shared hero shows an ensemble (50–2,000 runs)" as if any N fits any material
  composed  : capacities in code are 48 (marbling), 50 (margin, escapement, bunraku), 100 (ledger), 2,000 (run, delta, exposure)
  gap hypothesis : N is a material property, not a film property
  back to respondent : the composer refuses a graph whose N is outside the material's range — acceptable?
```
```
FINDING F8 @ Q1.1.1
  collapsed : AD:15 "The Trace opens every Grasp"
  composed  : 0 of 8 directions built a Grasp or a Trace; all eight READMEs file it as spec
  gap hypothesis : Grasp was deferred "for a flagship after the crit round" (AD:193)
  back to respondent : the library's demo is the first built Trace; judge it as the flagship candidate?
```
```
FINDING F9 @ Q6.2
  collapsed : AD §4E "'20 steps, each 95 % — how often does the whole job succeed?'… rings 36 %"
  composed  : MAP:80 "ENS ▷ NF ▷ percentage"; margin's first commit asks for a percentage before any count (margin/shared.film.js:38)
  gap hypothesis : the card was written in percentages before the natural-frequency research landed
  back to respondent : commits are always counts ("of 1,000") — confirm?
```
```
FINDING F10 @ Q8.3
  collapsed : RT:5–7 the clock law is guaranteed by banning six tokens
  composed  : the two purity failures in the log came from canvas sampling and shader derivatives (margin/N:84, bunraku/N:57), which no token scan sees
  gap hypothesis : purity is a property of pixels, not of source text
  back to respondent : none; the library keeps both the static scan and the gate (PURE-REP/ORD) as required
```

Agreements recorded (they raise confidence): Q4.2 (truth-under-evidence) — AD:12, delta, exposure, margin and escapement
all agree on exact-under-evidence; Q7.1 — every film uses the one event list; Q2.2.1 — all eight mark rules share the
run/step/address/catch shape, which is why one interface fits.

## D. Questions for Manu (podcast voice)

1. **Q-M1 ★** When you show one of these films to a room, are you talking over it, or does it have to stand on its own
   with captions? Think of the last session where you played a video: what did you do while it ran?
2. **Q-M2 ★** If a two-minute Grasp has to drop one beat to stay at four structures, which one goes first: the
   transfer question, the second commit, or the honesty beat?
3. **Q-M3** Picture the CETI film you'd be proudest to send a client. Does it have a voice, a music bed, or just the
   sound of the material?
4. **Q-M4 ★** Which room is first in line for a Grasp: the execs who want money, the managers who own a workflow, or
   the engineers who want the model?
5. **Q-M5** Would you ever want to see, across a cohort, how many people guessed above the truth? Opt-in counters
   only, never an individual.
6. **Q-M6** In an exec room, how much "sketch" can a slide carry before they stop trusting the numbers? Recall the last
   time a CFO pushed back on an illustrative figure.
7. **Q-M7** After the agent loop, what's the next concept you'll teach with these films? Tokens, embeddings,
   correlated risk, ROI?
8. **Q-M8** May a CETI film end on a brand card, or must every film end on its material's own last image?

## E. Coverage and confidence readout

Slots: 72 nodes. 63 are valued from evidence, 4 carry an [inferred] placement (Q2.2, Q2.4, Q8.1.1, Q8.1.3), and 5 keep a
part for Manu (Q1.4, Q4.4, Q5.3, Q6.3; Q7.3 is wholly empty). ★ coverage: 9 of 9 starred questions answered from evidence. Weakest link: Q7 (sound) — three slots, one empty, no crit ever graded audio, so the
library's sound design is the least evidenced subtree. Cold-root check: re-read Q0 against §B. The collapsed claim
("eight films plus a runtime") and the composed answer ("one interface, modules that never draw, laws at build time")
disagree. That disagreement is F2 and is the reason this library exists.

*Lint: `python3 /mnt/skills/organization/operadic-interview/scripts/treelint.py INTERVIEW.md --min-l1 3` → see README.*
