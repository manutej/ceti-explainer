# METHOD — from any topic to a storyboard, by composing modules

**Version:** 1.0 (2026-10-08). Derived from `QUESTION-TREE.md` (it adopts the composed side of findings F1–F14).
Its siblings are `MODULE-OPERAD.md` (what the modules are) and `BUILD-SPEC.md` (how they run). This file is the
procedure and the laws. It replaces "fill the seven LONGFORM movements" with "type the concept, then compose moves".
LONGFORM survives as archetype A4 (F4).

Inputs: a topic, an audience, and a research brief whose numbers are sourced `[Sn]` (unchanged from SKILL step 1).
Output: `film.plan.json` (the module chain with parameters) plus `STORYBOARD.md`, generated from the plan. The
timeline compiler and the law linter run on the plan before any scene code is written.

---

## 1. The pipeline (ten steps, each with a gate)

| # | Step | Produces | Gate (blocks the next step) |
|---|---|---|---|
| S0 | **Declare** audience level and register | `level: novice\|practitioner`, `chrome: dark\|notebook` | both fields set (F12); chrome follows Table 1 |
| S1 | **Type** the concept | `type: {primary, secondary}` from T1–T12 | Table 2 test sentence passes for the primary |
| S2 | **Aha and misconception card** | `aha` (one line + shape), `misconception` (statement, class, runnable?) | the misconception can be stated as a prediction a viewer would make |
| S3 | **Archetype** (beat sheet) | `archetype: A1–A12`, beats with weights | Table 3; if the misconception is runnable, A2/A8 beat A4 |
| S4 | **Per-beat move** | each beat → one move from the 24 (PED synthesis) | ≤ 1 new move per 10–15 s; CPR coverage law L11 |
| S5 | **Module choice and params** | chain of module instances + params | Table 4; every port type-checks (L1) |
| S6 | **Persistent object, roles, chrome** | `po`, `roles{variable→role}`, bookends | one PO (L2); role table constant (L6) |
| S7 | **Interactions** | ≤ 1 control per module, with question + jump | the control re-runs the module's own arithmetic |
| S8 | **Honesty** | per-module `honesty` items → chrome honesty slot | L10; the most important limit is *run*, not listed (F5) |
| S9 | **Compile and lint** | beat windows, key moments `T`, captions skeleton | `lint_plan` passes L1–L13 |
| S10 | **Crit rubric** | per-module checks for the art and pedagogy seats | §5; critics did not build |

After S10, the existing p5-explainer steps 4–8 (build, gate, crit, revise, film) run unchanged, except that the
lanes now fill module instances instead of free scenes.

---

## 2. Decision tables

### Table 1 — chrome and register (S0)
| Where the evidence comes from | Chrome | Why |
|---|---|---|
| a derivation or mechanism (the machine's arithmetic) | CETI dark | hairline rails, derived mono numbers |
| the viewer's own response (bias, judgement, social) | Field Notebook | the hand reads as honesty; commit card native (NB §1) |
| both (e.g. evals: a procedure plus human judgement of outputs) | the primary type's chrome | the secondary type gets an inset in the same chrome |

### Table 2 — concept type test sentences (S1)
Pick the first sentence that is true of the topic's *central claim*. That type is the primary; the next true one is the secondary.

| Type | Test sentence | Persistent object family |
|---|---|---|
| T8 Bias | "A mind does X where a rule says Y, and you will do it too." | axis + judged mark, crowd |
| T5 Probabilistic | "The answer is a distribution or a rate; one draw misleads." | unit-dot grid (N = 100–1,000) |
| T4 Scale | "Its size changes what kind of thing it is." | scale ladder / staircase |
| T9 Feedback | "The state changes its own rate; delays matter." | vessel + pipes + loop |
| T6 Trade-off | "Gaining one good costs another; the best point depends on you." | frontier plane + point |
| T7 Causal | "The visible symptom is several links downstream." | domino line, root left |
| T1 Mechanism | "Inside, it is a small operation, repeated." | cutaway with one flow path |
| T2 Pipeline | "Items pass through stages; quality is decided at one." | lanes + carrier object |
| T11 Procedure | "You can do these steps on Monday." | stations + the viewer's artefact |
| T10 Historical | "Each odd feature is a scar from a past problem." | one timeline + baseline |
| T3 Structural | "These two things are different (or the same)." | containment / anatomy |
| T12 Strategy | "The real choice is elsewhere; choosing excludes." | option map with walls |

The order is deliberate: the types whose aha needs the viewer's prior (T8, T5, T4) are tested first, so they are not mis-typed as T3.

### Table 3 — archetype from (primary type, misconception runnable?) (S3)
| Primary | Runnable misconception | No runnable misconception | Avoid |
|---|---|---|---|
| T1 Mechanism | A2 autopsy | A7 incremental build | A4 if the parts are not pre-trained |
| T2 Pipeline | A12 counterfactual | A7 / A4 walkthrough | — |
| T3 Structural | A2 autopsy | A9 tiny steps + contrast | a list of definitions |
| T4 Scale | A3 scale journey (+CPR) | A3 | stating "it's exponential" (does not shift bias, PED §10) |
| T5 Probabilistic | A2 / A8 | A9 | percentages alone |
| T6 Trade-off | A2 ("there is a best option") | A12 / frontier-led A9 | naming a winner |
| T7 Causal | A2 | A12 counterfactual | blaming the last link |
| T8 Bias | A8 be-the-subject | A8 | naming the bias first |
| T9 Feedback | A5 rules-change sim | A5 | a static loop diagram only |
| T10 Historical | A11 narrative case | A10 / A11 | a list of dates |
| T11 Procedure | A9 (+ worked-fade) | A9 | showing only the finished artefact |
| T12 Strategy | A2 ("strategy is a document") | A11 | a roadmap picture |

LONGFORM's seven movements = A4. Use A4 only when Table 3 names it (F4).

### Table 4 — move × type → module (S5)
Rows are the moves that need a module. Moves that are rules (pair-sound-shape, cut-decoration, offer-skip) are laws, not modules.

| Move (PED #) | Default module | Type-specific override |
|---|---|---|
| open-the-gap (1) | chrome `bookend` (question card by 8 s) | T8: open directly on the CPR question |
| commit-a-prediction (2) | `commit-predict-reveal`(inner) | — |
| stage-the-struggle (3) | `trap-and-correct` with 2–3 naive attempts | T11: `worked-fade` with a blank first |
| confront / run-wrong-model (4, 5) | `trap-and-correct`(wrong, right) | — |
| pre-train-the-parts (6) | `ladder-build` rung 0 | — |
| segment-and-pause (7) | law L9 (declared `hold`) | — |
| cue-the-cause (8) | law L8 (cue limiter), per-module `cue` phase | — |
| walk-the-worked-example (11), fade-the-scaffold (12) | `worked-fade` | — |
| fade-concrete-to-abstract (13) | `concreteness-fade` | T1/T5 in physics or chemistry: skip (domain-dependent, PED §4.1) |
| contrast-two-cases (14) | `contrast-split`(A, B) | T7/T2: `mode:'counterfactual'` |
| name-it-last (15) | law L5 | — |
| count-dont-claim (16) | `population-sim` (static grid, `rule: none`) | T1 conserved quantity: `mass-reseat` |
| step-the-scale (17) | T4 compounding: `compound-chain`; T4 magnitude: `zoom-journey` | — |
| vary-one-thing (18) | the module's single control; film plays one sweep | T6: `tradeoff-frontier`; T9: `feedback-loop` |
| retrieve-once (20), re-see (21) | `recap-retrieve` | — |
| chain-with-therefore (22) | the archetype's spine; one `therefore` per module boundary | T10: `timeline-scars` |
| name-the-bounds (23) | chrome `honesty` slot fed by every module | — |

### Table 5 — persistent object hand-over (S6)
| Next module needs | Previous module leaves | Hand-over |
|---|---|---|
| same PO kind | same kind | direct (port `po`) |
| a different kind with shared anchors (grid → tree → formula) | any | `concreteness-fade` or a `morph` phase (≥ 0.9 s, anchors matched by id) |
| a population from a single case | an instance | `zoom-journey` (camera out) or a `population-sim` spawn from the instance |
| a split | one PO | `contrast-split` clones the PO; it re-merges on exit |
| no relation | — | **illegal**: re-plan, or open a new chapter with a bookend card (max 1 per film) |

---

## 3. Types: ports, learner states, visual states

A module is an operation `in-ports → out-ports`. A port carries three colours (full catalogue in MODULE-OPERAD §1):

- **Learner state** (a set of flags, not an order): `gap` (has the question), `committed(k)` (holds prediction k),
  `wrong(m)` (holds the identified wrong model m), `dissatisfied(m)`, `parts(P)` (can name the parts in P),
  `instance(i)`, `rule(r)`, `magnitude(q)`, `bounds(b)`, `retrieved(x)`.
  A module declares `needs` (flags that must be present), `gives` (flags added) and `consumes` (flags removed;
  e.g. a reveal consumes `committed`).
- **Visual state**: the PO `{kind, id, anchors, state}`, the regions held (`body`, `left`, `right`, `foot`, `inset`),
  and the film's role table (read-only).
- **Concept type**: the set of types the module serves. An instance's type must be ∈ that set.

## 4. Composition laws (checkable)

Every law is checked by `lint_plan` on the compiled plan (the timeline data), before any frame is rendered.
`introduces`, `labels`, `cues`, `holds`, `payoff`, `numbers` and `honesty` are fields each module emits per phase
(BUILD-SPEC §2).

| Law | Statement | Mechanical check | Source |
|---|---|---|---|
| **L1 typing** | `B` may follow `A` only if `A.out ⊇ B.needs` (learner flags), PO kinds match or a hand-over from Table 5 exists, and B's type set ∋ the film's type | set inclusion on the chain; PO kind equality or legal morph | OP §4.1 |
| **L2 one object** | exactly one PO per film (+ ≤ 1 inset PO); every module reads the PO from its in-port and writes it to its out-port | PO id constant across the chain; no module `build`s a second root object | MOD P1; F9 |
| **L3 one new thing per beat** | each phase introduces ≤ 1 new concept term or visual variable; ≤ 1 new device per 10 s | `len(phase.introduces) ≤ 1`; sliding window of 10 s with ≤ 1 module start | PED §1.3; NAR §2 rule (a) |
| **L4 picture first, words after** | every term's label appears after its mark: `label.t0 ≥ mark.t0 + 0.3 s`; the cue on a mark precedes the caption naming it by 0.2–0.5 s | join `labels` to `marks` by term id; compare t0 | PED §1.3; F1 |
| **L5 name it last** | the principle's name (headline, term chip) appears at or after the module's `payoff` key moment; chapter cards before the payoff carry a number only | `name.t0 ≥ payoff.t` for terms flagged `principle` | PED move 15; F1 |
| **L6 colour = variable** | a film-level role table binds variable → role; modules request roles by variable; the accent role is "look here now", ≤ 10 % area, one live use at a time | one role per variable across all modules; no hex or role literal in module code | MOD P3; TAX colour policy; F2 |
| **L7 counted, not claimed** | every on-screen number has one canonical function and one audit assert; every running-example value comes from one record | `numbers[*].fn` exists; `audit()` passes; `example.*` values equal the record | FC rule 2, 6; F14 |
| **L8 cue budget** | ≤ 1 cue live at any t; each cue ≤ 1.5 s; the cue lands on the causally relevant change, never on decoration | interval overlap on `cues`; duration check | PED impl. notes; Lowe |
| **L9 holds are declared** | stillness (no new motion) > 3 s is legal only as a declared `hold` that starts ≤ 0.5 s after a payoff and lasts 2–4 s; at most one hold per module | detect motion-free windows from phase tables; each must match a `hold` | PED move 7; NAR device 14; F8 |
| **L10 honesty** | every module has non-empty `honesty`; the chrome honesty slot lists all items; the top item is staged as a run (trap or contrast), not as text; MP4 commit beats are labelled "pause and guess" | non-empty fields; slot coverage = union; MP4 caption check | MOD §2; F5, F11 |
| **L11 prediction coverage** | if primary ∈ {T1, T4, T5, T7, T8}, the chain has ≥ 1 `commit-predict-reveal`; ≤ 2 per 2 min | count wrappers | PED §3.1; F3 |
| **L12 verbal channel** | the film carries narration, OR burned key-term labels at the point of decision (≤ 4 words, on the object); soft captions are a fallback, never the only channel | `vo` track present OR every `introduces` term has a burned label | PED §1.1 modality; F7 |
| **L13 return** | the last teaching module before `land` returns to the opening instance with the new model applied (recap-retrieve `return:true` or the trap's right model on the opening case); a retrieval question sits ≥ 30 s after its content | last module check; t difference | MOD P7; PED §3.4; F10 |

**Which modules may follow which (beyond L1).**
- `commit-predict-reveal` wraps a module whose payoff is a number, a position or a choice the viewer could guess. It never wraps a module the viewer has no prior for (PED §3.1, Brod), and it never wraps itself.
- `trap-and-correct(wrong, right)`: `right` must be a module that can run on `wrong`'s case. The trap comes before any module that names the principle.
- `contrast-split(A, B)`: A and B are instances of the same module with one parameter different (`mode:'counterfactual'` = one part removed). The split may not nest (no 4-way splits).
- `concreteness-fade` follows a module that leaves `instance(i)`. Its last rung must be a representation the next module uses.
- `recap-retrieve` is last before `land` and never sits within 30 s of the content its question asks about.
- `zoom-journey` and `compound-chain` need `magnitude` unfixed: they come before any number that states the answer.

**Algebraic properties (where they hold, where they fail).**
- *Identity.* `hold(0)` is a two-sided identity: `hold(0) ; M = M = M ; hold(0)`. `hold(d)` with d > 0 is identity on ports and shifts time only; L9 limits where it may stand.
- *Associativity.* The sequential chain is associative: `(A ; B) ; C = A ; (B ; C)`. The timeline compiler concatenates beat windows and hands ports over, so regrouping a chain for parallel build lanes never changes a frame. A frame hash per grouping detects violations (OP §4.2).
- *Equivariance.* `contrast-split(A, B)` and `contrast-split(B, A)` differ only by a mirror of the layout. No derived number may change under the swap; the linter checks this by evaluating `numbers` both ways.
- *Not idempotent.* `CPR(CPR(M))` is illegal (two commits for one reveal). `trap(trap(…))` is illegal. `CPR(trap(w, r))` is legal and recommended: the viewer predicts what the wrong model will do, and the break is the reveal.
- *Not commutative.* `trap ; ladder-build` ≠ `ladder-build ; trap`. The order of learner flags matters (dissatisfaction before the new model, Posner). The linter enforces the order through `needs`.
- *Parallel lanes.* Modules with disjoint regions and no shared port may be built by separate agents (OP §4.3). Two modules writing the PO are sequential.

---

## 5. Crit rubric (S10, given to seats that did not build)

**Pedagogy seat (per module, from its move):**
1. Did the move happen? (CPR: was there a visible commit with a countdown; trap: did the wrong model visibly fail on the viewer's case; contrast: was the one differing variable obvious; fade: were the anchors matched across levels?)
2. Is the payoff the causally relevant change, and is it the most salient thing at that second (L8)?
3. Can a smart non-specialist name the module's `gives` flag after one viewing? (One sentence each.)
4. Numbers: each number checked against the brief; each illustrative number labelled; the running example consistent (L7).
5. Honesty: is the limit true, and is it shown?

**Art seat (per module, from its failure modes):** emptiest frame; whether the p5 marks are the evidence or texture;
role-table violations; type ≥ 13 at 1080p; anything crossing text; motion-free windows not declared as holds.

**Whole film:** the cold-root check. One line: "what did this film teach?" from someone who watched once. Compare it
with the plan's `aha`. A disagreement is a finding that localises to the module whose `gives` never landed.

**First experiment:** the same film with and without its CPR wrapper, with a retrieval question asked again on the
next page visit (PED impl. notes). A module is falsified if it shows no gain over a static equivalent equated for
information (Tversky).

---

## 6. Worked decision trace (short): "Base-rate neglect"

S0 novice, notebook → S1 T5 primary ("the answer is a rate; one draw misleads"), T8 secondary → S2 aha "the
denominator decides"; misconception "the witness is 80 % reliable, so 80 %", runnable → S3 A2 autopsy (Table 3) →
S4 commit, run-wrong, count, compare, retrieve → S5 `CPR(trap(wrong: confidence-meter, right: mass-reseat on a
1,000-cab grid))`, then `contrast-split(statistical vs causal base rate)`, then `recap-retrieve` → S6 PO = the
1,000-cab grid, roles {blue cab: blue, green cab: amber, said-blue: ink outline, error: red} → S7 control: base-rate
slider 5–50 % → S8 honesty: "classroom problem, not accident data; Kahneman ch. 16" → S9 lint. The full storyboard is
in MODULE-OPERAD §4b.

## 7. Changes to the current p5-explainer pipeline

| SKILL step | Was | Becomes |
|---|---|---|
| 2 Design ideation | metaphor systems, p5 vs SVG per movement | S0–S6: type → archetype → moves → modules; metaphor choice is the PO choice |
| 3 Storyboard + data.js | hand-written 7 movements | `film.plan.json` compiled to beat windows, `T`, `SC`, captions skeleton; STORYBOARD.md generated |
| 4 Build | scenes.js from scratch, helpers copied | module instances on one clock (BUILD-SPEC); lanes own modules, not movements |
| 5 Gate | purity, sweep, type floor | + `lint_plan` (L1–L13) + module `audit()`s |
| 6 Crit | FC checklist | + the §5 rubric per module |
| micro-cadence law | eyebrow → headline → build | picture → cue → label → (payoff) → name; a chapter number may open (L4, L5) |
| accent rotation | one accent per scene | role table per film (L6) |
| "no stretch > 3 s" | absolute | undeclared stillness only (L9) |
