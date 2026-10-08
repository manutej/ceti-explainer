# QUESTION TREE — the explainer-module library, interviewed

**Version:** 1.0 (2026-10-08) · **Instrument:** operadic-interview (TREE-CRAFT, OC-PROTOCOL, META-PROMPT) ·
**Respondent:** our own practice — the films we built and what critics said about them. The research pull is the
composing evidence. **Status:** grown, answered, composed, checked; `treelint.py` PASS (0 critical, 0 warnings).

**How to read it.** Every line at every depth is a real question with its own `▷` slot. Answer at any depth, in
any order, skip freely. A deep answer is composed evidence. A shallow direct answer is its own collapsed valuation.
Holding both at one node is the consistency check built into the shape. ★ = highest yield.

**Convention for this run (FILL rules).** At an internal node, `▷ collapsed:` is what our practice answers directly:
house rules, SKILL.md, the storyboard as built. `Compose:` states the rule and the result composed from the children.
`✓` means they agree. `✗ Fn` means they disagree, and the finding is listed in §2. Leaves quote evidence with a
pointer (`file §`). `[inferred]` marks a placement the evidence implies but does not state. Empty slots stay empty.

Evidence keys: **PED** = research/PEDAGOGY-LEARNING-SCIENCE.md · **NAR** = research/NARRATIVE-STRUCTURES.md ·
**TAX** = research/CONCEPT-TAXONOMY.md · **SB** = films/typesafe/STORYBOARD.md · **CON** = films/typesafe/CONTRACT.md ·
**CA** = typesafe/CRIT-ART.md · **CP** = typesafe/CRIT-PEDAGOGY.md · **BL** = films/agent-loop-blind/BLIND-LOG.md ·
**MOD** = references/modes.md · **NB** = references/notebook-chrome.md · **FC** = references/feature-cut.md ·
**RC** = references/research-channels.md · **OP** = ../../references/operad.md · **SK** = p5-explainer/SKILL.md.

---

## 1. The tree

**R — What library of animation modules lets any concept become a film that teaches?** `() → explainer-module-library`
▷ collapsed: "A 7-movement LONGFORM template (Hook · Core · Mechanism · Scale · Process · Limits · Land), filled per film, with p5 used where it earns count, conservation or response." [SK pipeline; FC table]
Compose: filter-chain Q1 ∧ … ∧ Q8, with Q2 (moves) weighted double because it is the revealed-behaviour question. Each surviving leaf answer that no current film part satisfies becomes a module type (§3). → composed: **a typed catalogue of 14 modules (11 scene modules + 3 combinators) selected by concept type and pedagogical move, on one clock, with fixed chrome and checkable laws.** ✗ F4, F13 (the template is one archetype among twelve; "a film is a module" is not yet true in practice).

---

**Q1 — What kind of concept is this, and what does its "aha" look like?** `topic → (type-pair, aha-shape, misconception, level)`
▷ collapsed: not asked. Every film went straight to "research brief → metaphor". [SK steps 1–2]
Compose: product over Q1.1 × Q1.2 × Q1.3 × Q1.4; Q1.3 counts double, because the misconception decides the archetype. → composed: a 4-tuple that selects the archetype. ✗ F4.

- **Q1.1 — Which of the twelve concept types is the topic's primary, and which is its secondary?**
  ▷ collapsed: undeclared. The typesafe film is organised by movement and spans T1, T3, T4 and T6. [SB movements]
  Compose: pool-then-rank; Q1.1.3 decides ownership. → composed: declare (primary, secondary). The primary owns the persistent object and the archetype; the secondary gets one inset module. ✗ F4.
  - **Q1.1.1 — For Type-safe AI, which type did the taxonomy assign, and which did our film actually build?**
    ▷ The taxonomy assigns T3 Structural primary and T7 Causal secondary, with a "mould and cast" object [TAX Part 2 #9]. The film built T1 mechanism (M3), T4 scale (M4) and T6 comparison (M5) on a switchyard [SB].
  - **Q1.1.2 — For the agent loop (the blind run), did the film build a loop or a pipeline?**
    ▷ The taxonomy has T9 Feedback primary and T2 secondary, with "ledger plus reservoir" [TAX #6]. The blind film built a reservoir. Its M4 and M5 "reuse the same layout … near-duplicates at thumbnail size" [BL step 6/7]: the loop structure was never drawn as a loop. [inferred]
  - **Q1.1.3 — ★ When a topic has two types, which one owns the persistent object and which gets an inset?**
    ▷ TAX "How to use": the primary type chooses the film's shape and the aha; the secondary gets "a second act or an inset". Keep the persistent object on screen the whole film.
- **Q1.2 — What does the moment of understanding look like for this type: a reduction, a revealed spread, or a zoom that breaks the axis?**
  ▷ collapsed: "exactly one payoff at ~70 %" of each scene. That is a timing rule, not a shape. [CON micro-cadence]
  Compose: union of aha shapes per type (Q1.2.2) filtered by whether prediction is needed (Q1.2.3). → composed: each module declares the aha shape it can stage and whether it needs a prior commit. ✗ F3.
  - **Q1.2.1 — Where did the typesafe aha land, at what second, and what moved?**
    ▷ At t≈41 the marks re-seat and 0.42 becomes 0.677. At t≈68 the counter lands on 1,197 [SB M3, M4]. CA ranks the 39.5–41.5 throat as the only window where p5 earns its place [CA §1].
  - **Q1.2.2 — Which aha shapes in the taxonomy have no module that can stage them today?**
    ▷ Six have none: T4 "zoom that breaks the axis", T5 "the single answer hid a spread", T8 "I did it too", T9 "overshoot or runaway", T6 "no free option", T10 "each odd feature is a scar" [TAX Part 1]. Only T1 (re-seat) and T4-compounding (staircase) exist [SB].
  - **Q1.2.3 — Does the aha require the viewer to have predicted first, or can it be shown cold?**
    ▷ Predict-first suits Mech, Caus, Stat, Bias and Scale. People predict linear growth, and only experience or tabulating shifts exponential-growth bias [PED §3.1, §10]. Bias films need the live trap first [TAX T8].
- **Q1.3 — ★ What wrong model does the viewer arrive holding, and how confident are they in it?**
  ▷ collapsed: the limits are stated near the end as paired cards ("Shape, not truth"). The misconception is treated as a caveat, not the target. [SB M6]
  Compose: argmax over candidate misconceptions by (confidence × consequence × runnable). → composed: "valid means correct" is typesafe's central wrong model. It must be **run and broken**, not listed. ✗ F5.
  - **Q1.3.1 — What misconception did the pedagogy crit find the film left standing?**
    ▷ "Types make it right" is implied by "PASS 1.00" and "a promise the model can't break". Refusals and truncation still fail. "Masking a confused model gives confident, well-formed nonsense." [CP §2]
  - **Q1.3.2 — Is the misconception a wrong fact, a wrong mental model, or a category error?**
    ▷ The confusion between shape and truth is a categorical shift (Chi). It needs a new category introduced, not a corrected fact [PED §5]. [inferred placement]
  - **Q1.3.3 — Can the wrong model be run on screen so it visibly fails on a case the viewer cares about?**
    ▷ Yes. A typed invoice with `due: 2026-11-05` passes the type and is wrong [MOD Mode B 1:30]. PED §5 says to show the wrong model running, then the discrepancy, then the better model on the same case.
- **Q1.4 — What audience level is declared: novice or practitioner?**
  ▷ collapsed: none declared in any pipeline. [SK; BL]
  Compose: filter: each support that Q1.4.1 lists is gated by the declared level. → composed: each module carries an `expertise` flag, and a film declares its level. ✗ F12.
  - **Q1.4.1 — Which supports in our films would reverse for an expert?**
    ▷ Step labels, integrated labels, redundant explanation and signalling all reverse for experts [PED §2.3]. In typesafe these are the foot lines and the pre-masking odds label that CP asked for [CP §1.1]. [inferred]
  - **Q1.4.2 — Did any of our pipelines ever declare an audience level?**
    ▷ No. SKILL step 1 asks for "mechanism, worked example, cited value, honest limits, aha line", with no level [SK]. PED caution 3: "Design for a declared audience level, not everyone".
  - **Q1.4.3 — What would the "skip the basics" path cut?**
    ▷ The pre-training parts and the worked step labels go behind an opt-in reveal on the page, or into a second cut for film [PED §2.3, move 24].

---

**Q2 — What must the learner do, beat by beat: what is the move sequence?** `(type-pair, aha, misconception) → move-sequence`
▷ collapsed: "eyebrow → headline → build → one payoff at ~70 % → settle" in every scene, with seven movements in a fixed order. [CON visual law; FC]
Compose: weighted read over Q2.1–Q2.5, with Q2.1 (commit) and Q2.2 (order) counted double. → composed: a per-beat move from the 24-move table [PED synthesis]. The order is gap → commit → parts → instance → compare → name → bounds → retrieve. ✗ F1, F3, F8.

- **Q2.1 — ★ Where does the viewer commit to a prediction before the reveal?**
  ▷ collapsed: nowhere in the dark films. In the Notebook chrome it is the default, but only for non-technical topics. [MOD P2; NB §3]
  Compose: filter-chain: types that admit prediction (Q2.1.3) ∧ a commitment mechanism that is real (Q2.1.2). → composed: commit-predict-reveal is a cross-type combinator. It belongs to no single chrome. ✗ F3.
  - **Q2.1.1 — How many prediction beats did typesafe have, and where did modes.md say they belonged?**
    ▷ It had zero. MOD says they belong at 0:37 ("which survive?") and at 1:04 ("95 % ten times — how many of 2,000 arrive?") [MOD P2].
  - **Q2.1.2 — In a film that nobody can be forced to commit to, what makes the commitment real?**
    ▷ A forced pause, a visible countdown, and a tap or keypress on the page. "Do not claim POE … benefits for a version in which nothing was committed" [PED §3.1, impl. notes]. NB uses a 5 s ink-ring countdown in the MP4 [NB §3].
  - **Q2.1.3 — Which concept types does the research say prediction suits, and which not?**
    ▷ It suits types where the viewer holds some prior model. It is noise with no prior; Brod 2021 says blind guessing reduces the effect [PED §3.1]. Move 2 suits Mech, Caus, Stat, Bias and Scale [PED synthesis].
- **Q2.2 — In what order do parts, instance, rule and name arrive?**
  ▷ collapsed: the name arrives first. The eyebrow and headline ("02 — THE MASK / Only the open tracks") come before the build. [CON; SB]
  Compose: filter-chain over Q2.2.1–Q2.2.3. → composed: parts are pre-trained as pictures, then the instance, then the rule. The principle's name comes after the structure is seen, and labels cue 200–500 ms before the narration names a thing. ✗ F1.
  - **Q2.2.1 — ★ In our scene micro-cadence, does the name arrive before or after the picture it names?**
    ▷ Before: "eyebrow (+0.4 s) → headline (+0.65 s) → build" [CON visual law]. Research: name-it-last; "presenting the principle after the comparison beat before-or-none" (Alfieri d = 1.18 for similarities plus a later principle) [PED §4.2, move 15].
  - **Q2.2.2 — Where did the crit find a part used before it had been introduced?**
    ▷ Three places. At 36–38 the bars are never labelled as the model's own odds. At 32–36 "state" is never named. At 25–32 the schema track has no fork, so the junction arrives as a new idea [CP §1.1–1.4].
  - **Q2.2.3 — Where does concreteness fading apply, and where does it fail?**
    ▷ It is positive in maths and mixed or null in physics and chemistry, where macro, micro and symbolic are levels rather than rungs [PED §4.1, Kokkonen & Schalk 2021]. Morph, do not cut, between levels.
- **Q2.3 — What does the viewer compare, and are the two cases aligned?**
  ▷ collapsed: comparisons exist (three lanes in M5, paired cards in M6) but appear as lists. [SB M5, M6]
  Compose: filter: one variable differs (Q2.3.3) ∧ alignment drawn (Q2.3.1) ∧ the principle comes after (Q2.3.2). → composed: a contrast-split module with element-to-element alignment and a delayed name. ✗ F1 (partial).
  - **Q2.3.1 — Which of our beats were already contrasts, and were they aligned element to element?**
    ▷ The M5 lanes are aligned on x (shared track, three results). The M6 cards are "two cards, eleven lines, nothing moves" [MOD P8], so that contrast is unaligned and text-only.
  - **Q2.3.2 — When is the principle named: before the comparison, or after?**
    ▷ In our films, before: the headline "Hope, check, or constrain" precedes the lanes [SB M5]. Research says after [PED §4.2].
  - **Q2.3.3 — What single variable differs between the two cases?**
    ▷ In M3 `constrain` on/off is a clean single variable [SB interactions]. In M5 the three lanes differ in mechanism and cost together. [inferred]
- **Q2.4 — How is the film segmented, and where does the viewer get to consolidate?**
  ▷ collapsed: "No stretch > 3 s without new motion." The crit flags 4 s holds as dead air. [CON; CP §4]
  Compose: weighted read with Q2.4.1 doubled. → composed: each chunk ends on a declared consolidation hold of 2–4 s (a summary line, a music drop, or a quiet frame) right after a causal payoff. An undeclared static stretch is a defect. ✗ F8.
  - **Q2.4.1 — What did the crit call dead air, and was any of it a legitimate consolidation hold?**
    ▷ 6.0–9.8 is a title hold with no information, which is a defect. 106–110 has both cards filled and stays static for 4 s; it could be a hold if it followed a payoff [CP §4]. PED move 7 asks for a 3–5 s breath per chunk.
  - **Q2.4.2 — Where does a section end with a summary line in our films?**
    ▷ Nowhere. Vox ends each section with a summary line and the music stops there [NAR §1.4, device 14].
  - **Q2.4.3 — Where is the one retrieval question, and how long after the thing it asks about?**
    ▷ There is none in any film. PED §3.4 proposes one mid-film retrieval beat 30–60 s after the content, and one at the end.
- **Q2.5 — How many new things enter per beat, and how is the cue rationed?**
  ▷ collapsed: "one new object per beat" is cited as a principle (P8) but not enforced. [MOD P8]
  Compose: filter: |new| ≤ 1 per beat ∧ at most one live cue ∧ salience = relevance. → composed: a checkable law (METHOD L3) with a cue limiter. ✓ (the direction agrees; enforcement is new).
  - **Q2.5.1 — Which typesafe beat introduced the most new elements at once?**
    ▷ 36–39.5: eight tracks, eight tokens, eight probabilities and 1,000 marks arrive together, with no label [SB M3; CP §1.1].
  - **Q2.5.2 — Is there ever more than one cue live at the same time?**
    ▷ Yes at 44.2–46: the car pulse, the lockup gaining `USD"`, and the ghost branch starting [SB M3]. PED says at most one cue active, each under 1.5 s [PED impl. notes].
  - **Q2.5.3 — Does the salient motion coincide with the causally relevant change?**
    ▷ Not at 40.2, where the "marks fly as a loose spray above the tracks" [CA M3b]. That is salient but off-concept, and novices attend to the salient [PED §1.2, Lowe].

---

**Q3 — What persists on screen, and how does it change?** `move-sequence → (persistent-object, state-vector)`
▷ collapsed: "One persistent object, transformed, never cut" is principle P1, but each chapter hard-cuts to a fresh composition. [MOD P1]
Compose: filter-chain Q3.1 ∧ Q3.2 ∧ Q3.3 ∧ Q3.4. → composed: one persistent object (PO) per film that passes through modules by port, with changes of kind by morph only and a return at the end. ✗ F9, F10.

- **Q3.1 — ★ What single object stays on screen the whole film?**
  ▷ collapsed: the track. It "recurs as switch, trough, rails, pipeline". [MOD P1]
  Compose: argmax over candidate objects by (carries the primary type's state × survives every module). → composed: the taxonomy's object for the primary type, handed over by port. ✓ object / ✗ stage (F9).
  - **Q3.1.1 — In typesafe, how many fresh compositions hard-cut in?**
    ▷ Every chapter: "0:51 grid, 1:38 cards … the object survives; the stage does not" [MOD P1].
  - **Q3.1.2 — Which persistent object did the taxonomy propose for this topic, and does it match what we built?**
    ▷ The taxonomy proposes the mould and cast; we built the switchyard [TAX #9; SB]. Both are legitimate T3 objects. The switchyard better carries T1, and the mould better carries "shape, not truth". [inferred]
  - **Q3.1.3 — When the object must change kind, is the change a morph with shared anchors or a cut?**
    ▷ A cut ("0:51→0:53 wants to be a pull-back … it is a cut") [MOD P4]. Research: "Morph, do not cut, whenever a representation changes level" [PED impl. notes].
- **Q3.2 — What state variables does the object carry, and which visual variable encodes each?**
  ▷ collapsed: "One saturated accent per scene", with the accent rotating M1 copper · M2 peach→sage · … [CON; SB]
  Compose: filter: one variable ↦ one channel for the whole film ∧ magnitude on position or length ∧ one changed variable per beat. → composed: a film-level role table `variable → role`; modules request a role by variable name. ✗ F2.
  - **Q3.2.1 — Is each variable bound to one colour for the whole film, or does colour rotate by scene?**
    ▷ It rotates by scene [SB accent rotation]. MOD P3: "A variable keeps its colour for the whole film". NB: "Colour is semantic, stated once, never broken".
  - **Q3.2.2 — Is magnitude ever encoded by hue or area where position or length was available?**
    ▷ The M3 queue length is proportional to p, which is good (length). The M3 comb read as "grey tiles" (area and value) [CA M3c]. TAX: magnitude goes on position or length first, and hue is selective only.
  - **Q3.2.3 — Which variables changed in the same beat?**
    ▷ At 39.5–41.5, blade state, mark positions and the printed numbers change together [SB M3]. That is defensible as one causal change if the numbers derive from the marks. [inferred]
- **Q3.3 — How does the object hand over between beats?**
  ▷ collapsed: through the shared `TS.G`/`TS.T` in data.js. [CON]
  Compose: union of hand-over failures → port requirements. → composed: typed output ports (`po`, `numbers`, `regions`) that the next module consumes. A number has exactly one canonical function. ✓ direction (FC rule 2) / new as ports.
  - **Q3.3.1 — Where did two renderings of the same number disagree?**
    ▷ The p5 counter showed 315 against SVG's 326 at 64 s, and 1,750 against 2,000 at 73.5 s. "The p5 cut lags its own clock by ~0.6 s" [CA M4].
  - **Q3.3.2 — Which beats rebuilt geometry the previous beat already had?**
    ▷ The M2 schema track (y 300), the M3 entry rail and the M4 mainline are three separate tracks [SB]. MOD P1 calls each a fresh stage.
  - **Q3.3.3 — What would a next module need to receive from the previous one to avoid rebuilding?**
    ▷ The PO's geometry (anchors), its state (mark seats and counts), and the role table. [inferred from FC rule 2, CON layer law "build all per-mark tables in setup"]
- **Q3.4 — How does the film return down the ladder to the opening instance?**
  ▷ collapsed: it lands on an aphorism and the whale. [SB M7]
  Compose: filter: the return shows the opening instance with the new model applied. → composed: a recap/return module that re-runs the opening case. ✗ F10.
  - **Q3.4.1 — Did typesafe return to Marisol's invoice at the end?**
    ▷ No. "1:53 is an aphorism, not Marisol's invoice seen again" [MOD P7].
  - **Q3.4.2 — What earlier scenes could be re-run through the new lens in 15 s?**
    ▷ The M2 four failures re-run constrained (all sage), and the M4 train with stepRate 0.99 [MOD five changes #5; PED move 21].
  - **Q3.4.3 — Does the land line name what the return showed?**
    ▷ "Types don't make it right. They make it checkable." names the bound, not the return [SB M7].

---

**Q4 — What is counted or derived on screen, rather than claimed?** `persistent-object → derivation-set`
▷ collapsed: "Space Mono numbers are always derived … anything else is labelled illustrative." [MOD chrome]
Compose: filter-chain Q4.1 ∧ Q4.3 ∧ Q4.4, with Q4.2 as a sub-rule. → composed: every displayed number has a canonical function, a visible derivation, and an audit assert. Probabilities appear as natural frequencies when the audience is lay. ✓ with ✗ F6 on Q4.2.

- **Q4.1 — ★ Which numbers are counted from marks on screen, and which are only printed?**
  ▷ collapsed: counted in M3 and M4, printed elsewhere. [SB]
  Compose: union of counted numbers; the printed ones must be labelled. → composed: the "remembered number" is always counted. ✓
  - **Q4.1.1 — Which typesafe numbers had a canonical function, and which were literals?**
    ▷ Canonical: arrivals, p′ and mark counts (`TS.audit`) [SB audit]. Literals with sources: GSM8K 86.5 → 23.4 and < 40 µs [SB M3, M6].
  - **Q4.1.2 — Where did counted marks fail to read as a count?**
    ▷ The 2×2 dots "read as hatched bars", and the comb is "65 grey tiles with 4 single-pixel dots" [CA M3].
  - **Q4.1.3 — Which number would a viewer remember, and is it counted?**
    ▷ "1,197 of 2,000" is counted by the train [SB M4]. "0.677" is derived from the re-seat. Both count. [inferred]
- **Q4.2 — When is p5 earned: by count, conservation, or response?**
  ▷ collapsed: when two of count, conservation and response hold, with scale made the event. [SK "What p5 must earn"]
  Compose: filter: the visual criterion (Q4.2.1) ∧ a pedagogical move served (Q4.2.3). → composed: p5 is earned only when the marks *are* the evidence (count-don't-claim, population-as-evidence, conserved re-seat). Spectacle alone is not enough. ✗ F6.
  - **Q4.2.1 — In how many of 38 frames did p5 earn its place, per the art crit?**
    ▷ Six of 38. "In 32 of 38 frames the p5 cut is pixel-identical … except that bars became dot-blocks" [CA §1].
  - **Q4.2.2 — Is "p5 earns" a pedagogical criterion or an economic one?**
    ▷ An economic and visual one (count, conservation, response) [SK]. Research: "Animation per se is not the active ingredient … Pedagogy lives in the moves, not the motion" (Tversky equivalence) [PED caution 2].
  - **Q4.2.3 — Which moves need mass or populations that SVG can't carry?**
    ▷ count-dont-claim (icon arrays of 1,000), population-as-evidence (Primer), conserved mass, and step-the-scale (powers of ten) [PED moves 16–18; NAR A3, A5].
- **Q4.3 — Is the quantity framed as natural frequencies or as probabilities?**
  ▷ collapsed: as probabilities (0.42, 0.95¹⁰, 59.9 %), with runs as counts in M4 only. [SB]
  Compose: filter by audience level (Q1.4). → composed: lay films lead with counts out of N, and the probability comes second as a derived label. ✓ partial.
  - **Q4.3.1 — Where did our films state a probability that could have been a count of N?**
    ▷ In M3: p = .42 .18 … is printed, while 1,000 marks carry it as counts [SB M3]. The count was on screen and the label was a probability. [inferred]
  - **Q4.3.2 — Does the denominator stay visible after the highlight?**
    ▷ TAX symbol 24 says to keep the full grid faint behind the highlight. M3's closed tracks dim to grey, which keeps the denominator [SB M3].
  - **Q4.3.3 — What reference population size makes the count legible at 1080p?**
    ▷ 1,000 marks at 3×3 with a 1-unit gap in ribbons [CA M3]. 2,000 runs as a snake [CA M4]. 10⁵ marks read as grey without a zoom [FC rule 4].
- **Q4.4 — Where does the audit check each derivation?**
  ▷ collapsed: `TS.audit()` checks the arithmetic. [SB audit]
  Compose: union of audit gaps → module-level `audit()`. → composed: the audit also covers types, claims and wording. ✓ direction / gaps in Q4.4.1–2.
  - **Q4.4.1 — Which audit asserts were too weak?**
    ▷ The coupler check "only tests includes('Invoice')", so Decision ≠ Invoice passed [CP §2].
  - **Q4.4.2 — Which claims were wrong in words though right in arithmetic?**
    ▷ "128,256 checked · 4 allowed" should read "masked" and "4 of the top 8". "<40 % → 100 %" is cross-model. "PASS 1.00" should read "SHAPE PASS" [CP §2].
  - **Q4.4.3 — Which modules' numbers can be audited by construction?**
    ▷ Any module whose numbers are counted from its own mark table: re-seat, compound-chain and population grid [FC rule 2]. [inferred]

---

**Q5 — What can the viewer change, and what does each control teach?** `derivation-set → control-set`
▷ collapsed: "Interactions re-run the film's own maths, jump to the moment they change, and never break scrubbing." [FC rule 7]
Compose: filter-chain Q5.1 ∧ Q5.2 ∧ Q5.3. → composed: each module exposes at most one control that re-runs its own arithmetic, with a guiding question and a jump time. ✓

- **Q5.1 — ★ Which control re-runs the film's own arithmetic rather than adding a toy?**
  ▷ collapsed: constrain, stepRate, steps, inject and amount. [SB interactions]
  Compose: argmax over controls by (re-runs arithmetic × teaches the aha). → composed: one control per module, chosen from the module's own parameters. ✓
  - **Q5.1.1 — Which typesafe controls did the crit call teaching, and which weak?**
    ▷ Teaching: constrain ("the argument in one click") and stepRate. Redundant: steps. Weak: amount [CP §5].
  - **Q5.1.2 — What control did the crit propose instead?**
    ▷ "A draw slider u ∈ [0,1) … sampling is random, the mask only removes options, and the prefix case is real" [CP §5].
  - **Q5.1.3 — Does every control carry a guiding question?**
    ▷ No. Research: "an explorable without a prompt, a question, and a goal is a toy" [PED §7].
- **Q5.2 — Which job does the film own, and which the page?**
  ▷ collapsed: one page that holds the film plus a Try-it panel. [SK files]
  Compose: union by the NAR §3 split table. → composed: the film is the tour and the page is the workshop. Each module declares `film` and `page` behaviour. ✓
  - **Q5.2.1 — Where is prediction real, and where only simulated?**
    ▷ Real: page input. Simulated: the film's countdown [NAR §3 table; NB §3].
  - **Q5.2.2 — Where do the edge cases live?**
    ▷ The film names them in one beat, and the page owns the toggles [NAR §3 table].
  - **Q5.2.3 — Does every film beat have a page anchor, and every slider a film still?**
    ▷ That is the rule of thumb in NAR §3. Chapters exist, but there are no per-beat anchors [SB chapters]. [inferred]
- **Q5.3 — Does every interaction stay scrubbable and pure?**
  ▷ collapsed: yes. "render(t, state) stays pure". [SB interactions; CON]
  Compose: filter. → composed: controls write `state` only, and `render` is pure in (t, state). ✓
  - **Q5.3.1 — Does any control introduce accumulated state?**
    ▷ None in typesafe [SB]. NB's commit freezes the clock until commit, and after that the film is f(t, guess) [NB §3].
  - **Q5.3.2 — Does the jump time land the viewer on the moment the control changes?**
    ▷ Each control has a `jump` time [SK interactions].
  - **Q5.3.3 — What does the video render use as defaults, and are they the teaching defaults?**
    ▷ "Video = defaults" [SB]. With constrain = true the MP4 never shows the `"$` failure. [inferred]

---

**Q6 — What does the chrome fix, so that no module has to decide it?** `() → chrome-spec`
▷ collapsed: type system, palette roles, hairline rails, derived numbers, whale bookend, one honesty beat, captions never burned in. [MOD §2]
Compose: union of fixed decisions, filtered against Q6.2 and Q6.3. → composed: the chrome owns bookends, role table, type scale, zones, verbal channel and the honesty slot. Modules own none of these. ✗ F2, F7.

- **Q6.1 — Which chrome, CETI dark or Field Notebook, and what decides it?**
  ▷ collapsed: Notebook is "for non-technical films". [SK refs; NB title]
  Compose: argmax by register (lay or technical) × the evidence type (the viewer's own response vs derivation). → composed: the chrome is chosen by evidence source. Bias and behavioural topics use Notebook; mechanism topics use dark. Every module renders in both. ✓
  - **Q6.1.1 — Which topics did each chrome's worked example cover?**
    ▷ Dark: type-safe AI and the agent loop. Notebook: the rigged wheel (anchoring) and the bat-and-ball (System 1/2) [NB §4].
  - **Q6.1.2 — Is the chrome choice a concept-type decision or an audience decision?**
    ▷ Both. For behavioural topics "the evidence is the viewer's own response", and the hand reads as honesty [NAR §4; NB §1].
  - **Q6.1.3 — Which glyphs are shared, and which are chrome-specific?**
    ▷ Shared by role: token, mass, error, budget, step. Notebook-only: commit card, anchor, fork, scale, remedy check [MOD glyphs; NB glyphs].
- **Q6.2 — ★ Which semantic colour roles are fixed across the whole film?**
  ▷ collapsed: "Copper = probability … Sage = type … Peach = error" [MOD §2], yet the storyboard rotates accents by scene [SB].
  Compose: filter: role ↦ meaning is constant for the film. → composed: a role table bound at film level, at most four semantic roles plus neutral, and one "look now" accent. ✗ F2.
  - **Q6.2.1 — How does the storyboard's accent rotation sit with "a variable keeps its colour"?**
    ▷ It contradicts it. The rotation assigns colour by scene, and P3 assigns it by variable [SB; MOD P3].
  - **Q6.2.2 — What did copper mean in four different beats of typesafe?**
    ▷ Errors at 0:21, surviving mass at 0:40, fail counts at 1:04, and the headline accent at 1:13 [MOD P3].
  - **Q6.2.3 — How many semantic roles does a module need beyond the four?**
    ▷ TAX's colour policy: machine, person, neutral, plus one accent for "look now". NB: amber, blue, red, green. Four plus neutral plus accent is enough. [inferred]
- **Q6.3 — Which verbal channel carries the explanation: narration, captions or labels?**
  ▷ collapsed: captions as soft subtitles and a transcript, never burned in, with a synthesised score and no voice. [MOD §2; SK honest limits]
  Compose: filter by the modality and redundancy principles. → composed: narration (or burned key-term labels at the point of decision) is required. Captions are a fallback, not the channel. ✗ F7.
  - **Q6.3.1 — Does the MP4 have a voice?**
    ▷ No. "The score is synthesised and functional"; there is no VO step in the pipeline [SK].
  - **Q6.3.2 — With captions never burned in, what does a muted autoplay viewer get?**
    ▷ Labels and numbers only. The `--burn` flag exists [SK commands] but contradicts the chrome rule [MOD §2].
  - **Q6.3.3 — Where do on-screen labels duplicate the caption?**
    ▷ The foot lines repeat caption arithmetic, for example "0.95¹⁰ = 0.599" [SB M4]. Redundancy is acceptable for short key terms [PED §1.1].
- **Q6.4 — What are the fixed bookends and type scale?**
  ▷ collapsed: the whale bookend, Fraunces, DM Sans and Space Mono. [MOD §2]
  Compose: union, corrected by crit. → composed: bookend = brand within 3 s and then the gap question by 8 s. The type scale is 40/18/15 with a 13 minimum at 1080p. Zones are head, body and foot. ✓ with fixes.
  - **Q6.4.1 — What does the hook spend its first 10 s on: brand, or the gap?**
    ▷ The brand: the whale and the title hold to 9.8 s [SB M1; CP §4]. NAR: the hook question or puzzle comes in the first 8 %.
  - **Q6.4.2 — What type sizes survived crit at 1080p?**
    ▷ "Headline 40, mono 15 (min 13), sans 18, counters 40" [FC rule 1; CA §4].
  - **Q6.4.3 — What layout zones does every module get?**
    ▷ Head y 30–108, body y 124–440, foot y 456–500. CA says to fill the body to y 130–430 [SB canvas; CA §4].

---

**Q7 — What is honest about the limits?** `film → honesty-ledger`
▷ collapsed: "One beat per film, near the end, that says what the metaphor cannot show." [MOD §2]
Compose: union of every module's limit (Q7.1) and illustrative flag (Q7.2), placed by Q7.3. → composed: each module carries a `honesty` field. The chrome's honesty slot aggregates them, and where a limit can be run, it is run (trap). ✗ F5, F14.

- **Q7.1 — ★ Where does the metaphor stop being true?**
  ▷ collapsed: "shape, not truth" and "a bad schema can crowd out reasoning". [SB M6]
  Compose: union. → composed: per-module limits plus the running-example consistency check. ✗ F14.
  - **Q7.1.1 — Which metaphor limits did the typesafe film name, and which did crit add?**
    ▷ Named: valid ≠ true, schema crowd-out, unenforced keywords [SB M6]. Added by crit: the grammar is invisible unless the schema is in the prompt, refusals and truncation, and the per-step mask [CP §2].
  - **Q7.1.2 — Where was a film example internally inconsistent?**
    ▷ "The invoice said 12,000" contradicts the input "$1,200.00" [CP §1.5]. Also `approve: Invoice → Decision` feeds `pay(Invoice)` [CP §2].
  - **Q7.1.3 — Which module types carry an intrinsic distortion?**
    ▷ Dots standing for people drawn from book means ("our drawing of two numbers") [NB §4A]. Illustrative logits [SB M3]. Fixed-width sorts misstate BPE [MOD Mode C].
- **Q7.2 — Which numbers are illustrative, and are they labelled so?**
  ▷ collapsed: "illustrative logits" is labelled. [SB M3 foot]
  Compose: filter: every non-derived number carries a source tag or "illustrative". → composed: an `illustrative` flag per module parameter. ✓ with gaps.
  - **Q7.2.1 — Which numbers were cross-model or uncited?**
    ▷ "<40 % → 100 %" is two models. "millions of times a day" is uncited. "first try" ignores the compile cost [CP §2].
  - **Q7.2.2 — Where does the film present book means as individual dots?**
    ▷ The rigged wheel's 2,000 figures are re-centred to the book's means, and NB discloses this [NB §5].
  - **Q7.2.3 — Where do we claim a learning benefit the format can't deliver?**
    ▷ The MP4 "Commit beat" fills in "what most people said" [NB §3]. No viewer committed, so the predict-observe-explain (POE) benefit cannot be claimed [PED impl. notes].
- **Q7.3 — Is honesty a beat, or a property of every module?**
  ▷ collapsed: a beat, as cards. [SB M6]
  Compose: weighted read with Q7.3.2 doubled. → composed: both. Each module carries its own limit, and the chrome beat runs the most important one. ✗ F5.
  - **Q7.3.1 — Where was the honesty beat placed, and was it equal-weight cards of text?**
    ▷ 96–110: two cards with eleven lines in total [SB M6; MOD P8 "nothing moves"].
  - **Q7.3.2 — Could the limit be run rather than listed?**
    ▷ Yes. The `amount` and `due` values pass the type and are false. The two-gauge truth-vs-shape glyph [MOD glyphs; Mode B 1:30].
  - **Q7.3.3 — What does the honesty beat aggregate from the modules before it?**
    ▷ The illustrative flags, the sources [Sn], each module's limit, and the expertise scope. [inferred]

---

**Q8 — How will we know the film taught, before any audience sees it?** `film → crit-verdict`
▷ collapsed: a gate (purity and sweep), then an independent art seat and pedagogy seat. [SK steps 5–6]
Compose: filter-chain Q8.1 ∧ Q8.2, with Q8.3 as the external check. → composed: lint the laws mechanically from timeline data, then run the seats with a per-module rubric, then a first A/B. ✗ F13.

- **Q8.1 — ★ What can a gate check mechanically?**
  ▷ collapsed: contract, audit, state-swept frame sweep, purity, lint and type floor. [SK step 5]
  Compose: union with Q8.1.2. → composed: add timeline-level law checks (L1–L9 in METHOD). ✗ F13.
  - **Q8.1.1 — What did feature_gate miss in the blind run?**
    ▷ Overlap and legibility; the SVG cut is not gated by default; G4 times assume dur ≥ 116 s [BL step 5, gaps 5].
  - **Q8.1.2 — Which laws are checkable from timeline data alone?**
    ▷ One-new-thing (count `introduces` per beat), picture-first (label t0 ≥ mark t0), name-last, a cue limiter, and the role table. [inferred from PED impl. notes]
  - **Q8.1.3 — What did the blind run have to reverse-engineer that a module would ship?**
    ▷ The data.js schema, the scene helper kit (~120 lines), the whale geometry and the layer header. "Everything is learned by reverse-engineering films/typesafe" [BL gaps 1, 4].
- **Q8.2 — What must the critic seats judge?**
  ▷ collapsed: the FC crit checklist (contact sheet, emptiest frame, numbers, "name the mechanism"). [FC]
  Compose: union, with conflicts surfaced. → composed: a per-module rubric derived from each module's move and failure modes. ✓
  - **Q8.2.1 — Which crit findings were art and which pedagogy, and where did they conflict?**
    ▷ Art asked for a bigger comb sweep and "make size the event" [CA §3]. Pedagogy asked for labels and less spectacle at 36–38 and called the comb "checked" wrong [CP §1–2]. They conflict on the comb. [inferred]
  - **Q8.2.2 — Would a smart non-specialist name the mechanism after one viewing?**
    ▷ "Mostly yes for mask → renormalise; no for grammar → automaton, and the tokenizer twist is lost" [CP §1].
  - **Q8.2.3 — Who has not built the film?**
    ▷ The blind run had no second agent: "self-reviewed … not done as specified" [BL step 6/7].
- **Q8.3 — What would we A/B first?**
  ▷ collapsed: nothing yet.
  Compose: argmax by (evidence strength × cost). → composed: the same film with and without commit-predict-reveal. ✓ (PED proposes it).
  - **Q8.3.1 — What does the research recommend as the first internal test?**
    ▷ "Plan an A/B on one film (with-prediction vs without) as the first internal test" [PED impl. notes].
  - **Q8.3.2 — What delayed measure could a 2-minute film carry?**
    ▷ An end retrieval question asked again on the next visit (on the page) [PED §3.4].
  - **Q8.3.3 — What would falsify a module?**
    ▷ No difference between the module and a static equivalent equated for information (the Tversky equivalence control) [PED §1.2]. [inferred]

---

## 2. Findings (composed vs. collapsed)

Format per OC-PROTOCOL. The "respondent" is our practice. Each finding goes back as a question, and METHOD.md and
MODULE-OPERAD.md adopt the composed side unless the question is answered the other way.

```
F1 @ Q2.2 / Q2.2.1  — WORDS BEFORE PICTURE
  collapsed : "eyebrow (+0.4 s) → headline (+0.65 s) → build" in every scene (CON visual law); headlines name the idea
  composed  : filter-chain(pre-train parts as pictures, name-it-last, cue 200–500 ms before naming) → picture, then cue, then name
  gap hypothesis : the cadence was inherited from editorial slide design, where the headline is the thesis
  back to us : can a scene open on its picture with only a neutral chapter number, and let the headline land after the payoff?
F2 @ Q3.2 / Q6.2    — COLOUR BY SCENE vs COLOUR BY VARIABLE
  collapsed : "One saturated accent per scene", rotated M1 copper → M2 peach/sage → … (SB, CON)
  composed  : one variable ↦ one role for the whole film (MOD P3, TAX Bertin, NB semantic colours)
  gap hypothesis : the accent law (≤10 % accent) was about pixel budget and got read as "change the accent per scene"
  back to us : keep ≤10 % accent area, but bind the hue to a variable in a film-level role table?
F3 @ Q2.1 / Q1.2.3  — NO PREDICTION WHERE THE TYPE DEMANDS IT
  collapsed : zero commit beats in dark films; prediction is a Notebook-chrome feature (MOD P2, NB §3)
  composed  : commit-predict-reveal suits Mech, Caus, Stat, Bias, Scale; compounding needs it most (exponential bias)
  gap hypothesis : prediction was treated as a chrome style, not a pedagogical move
  back to us : should every film with a T1/T4/T5/T7/T8 primary carry ≥1 CPR, in either chrome?
F4 @ R / Q1.1       — ONE CADENCE FOR EVERY CONCEPT
  collapsed : the seven LONGFORM movements, in order, for every topic (SK, FC)
  composed  : archetype selected by type (NAR §5 selector); typesafe is T3+T7 → A2/A12, not A4-like
  gap hypothesis : the cadence is a proven *production* template, mistaken for a pedagogical one
  back to us : is LONGFORM one archetype (A4 "walkthrough") among twelve?
F5 @ Q1.3 / Q7.3    — THE MISCONCEPTION IS LISTED, NOT RUN
  collapsed : "Shape, not truth" as equal-weight text cards at 96–110 (SB M6)
  composed  : the trap-and-correct order — run the wrong model ("valid = correct"), break it on the film's own case, then the right model (Muller; Posner)
  gap hypothesis : honesty was framed as a disclaimer, so it went to the end
  back to us : is "valid means correct" the film's target misconception rather than its caveat?
F6 @ Q4.2           — p5 EARNS BY SPECTACLE vs BY EVIDENCE
  collapsed : count/conservation/response, "make size the event" (SK, FC rule 4, CA §3)
  composed  : marks earn only when they ARE the evidence of a move; salient ≠ relevant (Lowe), animation not the active ingredient (Tversky)
  gap hypothesis : the rule was written to stop "SVG with texture", and over-corrected toward hero shots
  back to us : the comb sweep — does it carry "masked, precomputed" (CP) or "checked" (CA)?
F7 @ Q6.3           — NO VERBAL CHANNEL IN THE FILM
  collapsed : no voice, synthesised score, captions as soft subtitles, never burned in (SK, MOD §2)
  composed  : modality (narration + graphics) is among the best-supported principles; muted autoplay gets labels only
  gap hypothesis : VO was out of scope for the renderer, so it fell out of the method
  back to us : add VO, or burn key-term labels at the point of decision, with captions as fallback?
F8 @ Q2.4           — THE 3-SECOND RULE FORBIDS CONSOLIDATION
  collapsed : "No stretch > 3 s without new motion"; crit flags 4 s holds (CON, CP §4)
  composed  : segment-and-pause, a 3–5 s breath per chunk after a causal change, a summary line plus music drop (PED move 7, NAR device 14)
  gap hypothesis : dead air (no payoff) and a consolidation hold (after a payoff) were not distinguished
  back to us : legalise a declared `hold` after a payoff, and keep the rule for undeclared stillness?
F9 @ Q3.1           — THE OBJECT SURVIVES, THE STAGE CUTS (partial)
  collapsed : "the track recurs" (MOD P1)
  composed  : one PO, changes of kind by morph with shared anchors (PED impl. notes)
  back to us : which chapter cut can become a morph or a camera move in the module chain?
F10 @ Q3.4          — NO RETURN TO THE OPENING CASE
  collapsed : land on the aphorism and the whale (SB M7)
  composed  : ladder return / re-see-through-the-lens (MOD P7, PED move 21)
  back to us : does every film end on its opening instance, solved?
F11 @ Q7.2.3        — MP4 "COMMIT" WITHOUT A COMMITMENT
  collapsed : the MP4 countdown fills "what most people said" (NB §3)
  composed  : "do not claim POE benefits … in which nothing was committed" (PED impl. notes)
  back to us : label the MP4 beat "pause and guess" and keep POE claims for the page?
F12 @ Q1.4          — AUDIENCE LEVEL NEVER DECLARED
  collapsed : none (SK) · composed : expertise reversal means every support is level-dependent (PED §2.3)
F13 @ R / Q8.1      — "A FILM IS A MODULE" IS NOT YET TRUE
  collapsed : "A film here is a module, not a fork" (SK)
  composed  : the blind run copied about 120 lines of helpers, the whale geometry and the data.js schema from typesafe (BL gaps 1, 4); every film is a fork
  back to us : do modules plus a scaffold become the unit, and the film a list of instances?
F14 @ Q7.1.2        — THE RUNNING EXAMPLE CONTRADICTED ITSELF
  collapsed : running example honoured (MOD P6) · composed : 12,000 vs $1,200.00; Decision ≠ Invoice (CP §1.5, §2)
  back to us : add an audit law: every value the film shows about the running example comes from one record?
```

**Agreements (evidence, not absence of a problem):** Q2.5 (one new thing per beat; only enforcement is new),
Q3.3 (one canonical function per number, FC rule 2), Q5 (controls re-run the film's own maths), Q6.1 (two chromes
chosen by where the evidence comes from), Q4.1 (the remembered numbers are counted).

**Cold-root check.** Re-asked cold, one line: "What library makes any concept a film that teaches?" Our practice
answers "the LONGFORM template plus p5 hero moments". The composed answer is "a typed module catalogue plus laws,
selected by type and move". They disagree on what the unit is: a movement template or a typed move. Hence F4 and F13.

## 3. From the tree to module types (derivation)

Rule: any leaf whose answer names a move, aha shape or object that no current film part can stage becomes a module.
Leaves that name a law become a METHOD law. Leaves that name a fixed decision become chrome.

| Source leaves | What they demand | Becomes | New? |
|---|---|---|---|
| Q2.1.1–3, Q1.2.3, F3 | a commit before the reveal, real on the page, honest on film | **commit-predict-reveal** (combinator, arity 1) | new |
| Q1.3.1–3, Q7.3.2, F5 | run the wrong model, break it on the same case, then the right one | **trap-and-correct** (combinator, arity 2) | new |
| Q2.3.1–3, Q2.2.1 | aligned two-case comparison; the principle comes after | **contrast-split** (combinator, arity 2; counterfactual variant) | new |
| Q2.2.2, Q2.5.1 | parts pre-trained as pictures, then +1 variable per rung | **ladder-build** | generalises SB M2 |
| Q2.2.3, Q3.1.3 | concrete → icon → schema → symbol by morph | **concreteness-fade** | new |
| Q1.4.3, Q2.2 (procedure) | worked example 1 full, example 2 with the last step blank | **worked-fade** | new |
| Q4.2.3, Q4.3.x | population as evidence; count not claim; rule toggle | **population-sim** | generalises SB M4 runs |
| Q1.2.1, Q4.1.3 | conserved mass re-seats under a constraint or evidence | **mass-reseat** | generalises SB M3 |
| Q1.2.3 (scale), Q4.1.3 | quantity carried through k steps (×r or +c), staircase | **compound-chain** | generalises SB M4 |
| Q1.2.2 (T4), FC rule 4 | a zoom across powers of ten with a familiar anchor | **zoom-journey** | new |
| Q1.1.2, Q1.2.2 (T9) | stock, flows, loop polarity, delay, overshoot | **feedback-loop** | new |
| Q1.2.2 (T6), Q2.3.3 | a slider moving a point on a frontier | **tradeoff-frontier** | new |
| Q1.2.2 (T10) | timeline with scars: problem → fix → residue | **timeline-scars** | new |
| Q2.4.3, Q3.4.1–3, F10 | recap card, one retrieval question, ladder return | **recap-retrieve** | new |
| Q6.x, Q7.3.3, F2, F7 | bookends, role table, type, verbal channel, honesty slot | **chrome** (bookend · honesty · land) | refactor |
| Q2.4, Q2.5, Q2.2.1, Q4.4, F8, F14 | consolidation hold, one-new-thing, picture-first, audit-by-record | **METHOD laws L1–L10** | new |

Coverage: 129 slots (root + 128 nodes); 127 filled (98 %). Two leaves are inferred-only: Q3.2.3 and Q5.3.3.
★ hit: 9/9. The root's confidence is limited by Q8.3, which has no evidence until the first A/B runs.

---
*Lint: `python3 …/operadic-interview/scripts/treelint.py QUESTION-TREE.md` → PASS (0 critical, 0 warnings). There are 8 top-level
questions, above the 3–6 guideline and inside the linter's limit of 8. This is deliberate: the brief asked for these eight. Next: METHOD.md adopts the
composed side of F1–F14. MODULE-OPERAD.md types the 14 modules derived above.*
