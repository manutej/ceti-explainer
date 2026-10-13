# MODULE-OPERAD — the explainer modules as a coloured operad

**Version:** 1.0 (2026-10-08). The modules are derived from `QUESTION-TREE.md` §3, composed by the laws in
`METHOD.md` §4, and implemented through `BUILD-SPEC.md`. This file extends the style of the studio's design operad
(`../../references/operad.md`) and does not contradict it. That file types the *marks* of one picture (Field,
Paths, Layer…). This one types the *beats* of a film. A module's p5 layer is itself a small design-operad tree
(`Mark(stipple)(Place(…))`), so the two operads stack: a module operation contains a design-operad tree as its
render.

Evidence keys as in QUESTION-TREE (PED, NAR, TAX, SB, CA, CP, MOD, NB, FC). `[Sn]`/`[verify]` = check before
client use. Numbers marked *illus.* are illustrative and must be labelled on screen.

---

## 1. Colours (port types)

A port has three colours: **Λ** (learner state), **V** (visual state) and **τ** (concept type).

| Colour | Values | Notes |
|---|---|---|
| **Λ learner flags** | `gap` · `committed(k)` · `wrong(m)` · `dissatisfied(m)` · `parts(P)` · `instance(i)` · `rule(r)` · `magnitude(q)` · `bounds(b)` · `retrieved(x)` | a set, not an order; modules declare `needs ⊆ Λin`, `gives`, `consumes` |
| **V.po** | `{kind, id, anchors{id→xy}, state}`; kinds: `track` `grid` `stack` `axis` `vessel` `frontier` `timeline` `population` `chain` `cutaway` `form` | one PO per film (L2); anchors are the morph handles |
| **V.regions** | `body` (y 124–440) · `left` (x 40–470) · `right` (x 490–920) · `foot` (y 456–500) · `inset` (180×64, top-right of body) · `full` | a module holds regions for its window; disjoint regions ⇒ parallel lanes |
| **V.roles** | film-level table `variable → role`; roles: `machine` `person` `allowed` `error` `remedy` `neutral` `focus` | read-only to modules (L6); the chrome maps roles to tokens (dark: copper/sage/peach/bone; notebook: amber/blue/red/green) |
| **V.numbers** | `{id → fn(params, state)}` | one canonical function per number (L7); SVG and p5 both read it |
| **τ concept type** | T1–T12 (TAX) | each module serves a declared subset |
| **Time** | the film clock `t`; each module owns a window `[t0, t0+dur)` | modules never own time; phases are fractions of `dur` |

Notation: `name : Λneeds × V → Λgives × V'`. The combinators take modules as inputs:
`CPR : M⟨payoff:k⟩ → M` · `trap : M_wrong × M_right → M` · `split : M × M → M`.

## 2. The catalogue at a glance

| # | Module | Kind | Main move(s) (PED #) | τ served | New vs our films |
|---|---|---|---|---|---|
| 1 | `commit-predict-reveal` | combinator, arity 1 | 2 | T1 T4 T5 T7 T8 | **new** |
| 2 | `trap-and-correct` | combinator, arity 2 | 4, 5, 3 | T1 T3 T5 T6 T7 T8 | **new** |
| 3 | `contrast-split` | combinator, arity 2 | 14, 15, (A12) | T2 T3 T5 T6 T7 T8 | **new** |
| 4 | `ladder-build` | scene | 6, 8, 7 | T1 T2 T3 T9 T11 | generalises SB M2 |
| 5 | `concreteness-fade` | scene | 13 | T3 T4 T5 (maths-like T1) | **new** |
| 6 | `worked-fade` | scene | 11, 12, 19 | T11 T5 T2 | **new** |
| 7 | `population-sim` | scene | 16, 18 | T5 T7 T8 T9 | generalises SB M4 |
| 8 | `mass-reseat` | scene | 16, 8 | T1 T2 T5 | generalises SB M3 |
| 9 | `compound-chain` | scene | 17, 16 | T4 T7 T2 | generalises SB M4 |
| 10 | `zoom-journey` | scene | 17 | T4 T5 | **new** |
| 11 | `feedback-loop` | scene | 18 | T9 T7 | **new** |
| 12 | `tradeoff-frontier` | scene | 18, 14 | T6 T12 | **new** |
| 13 | `timeline-scars` | scene | 22, 21 | T10 T7 | **new** |
| 14 | `recap-retrieve` | scene | 20, 21 | all | **new** |

The **chrome pseudo-modules** use the same interface but are not part of the catalogue: `bookend` (brand ≤ 3 s, gap
question card by 8 s), `honesty` (aggregates every module's `honesty` and stages the top item), `land` (quotable
line + bookend). `hold(d)` is the identity operation (METHOD §4).

Common phase grammar (all modules): **picture → cue (≤ 1.5 s) → label → payoff → hold (declared) → name**. These
are laws L4, L5, L8 and L9. Each phase lists what it `introduces` (≤ 1 item, L3).

---

## 3. Modules

### 1 · `commit-predict-reveal` (CPR) — combinator `M⟨payoff⟩ → M`
- **Move.** commit-a-prediction (PED #2: Crouch et al. 2004; Kestin & Miller 2022 [V]; Brod 2021). NAR device 2 predict-then-reveal; NB §3. Evidence A-/B.
- **τ.** T1 T4 T5 T7 T8. Illegal on a question with no plausible prior (blind guessing is noise, PED §3.1).
- **Ports.** in: `inner` with `payoff:{kind:'number'|'position'|'choice', t, value}`; Λ needs `gap`. Λ gives `committed(k)` at commit; the reveal consumes it and gives `dissatisfied(m)` or `rule(r)`. V: inner's regions + `inset` (commit card). PO passes through untouched.
- **Params.** `question` (≤ 70 chars, handwritten in notebook) · `answerKind` · `range | options` · `filmDefault {value, label, src}` (the common answer, cited) · `countdown` (4 s).
- **f(t, state).** The wrapper splices its phases into the inner's clock at `payoff.t − 0.3 s`: inner runs to its payoff, then **ask** 1.0 s (card draws dashed, question) → **commit** `countdown` s (an ink ring un-draws; `4…1`; page: clock paused until input or an 8 s timeout) → **reveal** (the inner payoff plays) → **gap** 2.5 s (the card rides to the axis beside the true value; a gap bracket in role `error` if outside tolerance, `remedy` if inside) → **hold** 1.5 s. Adds ≈ 9 s. `state.guess` (null in video).
- **SVG / p5.** SVG: card, ring, digits, bracket. p5: none (inner's).
- **Control.** Page: a real input (number field, axis drag, or choice chips). The guess is the only accumulated input, and render stays pure in `(t, state.guess)`.
- **Honesty.** The MP4 shows "pause and guess" and fills the card with `filmDefault`, labelled "a common answer [Sn]" or *illus.* No POE claim for the MP4 (F11). The reveal never shames: the note reads "most of us land here".
- **Example (AI).** `CPR(compound-chain{N0:2000, r:0.95, k:10})`: "Ten steps, each 95 % reliable. Of 2,000 runs, how many arrive?" range 0–2,000. filmDefault 1,900 *illus.* (the linear intuition "95 % → 1,900"). Reveal 1,197 (59.9 %).
- **Example (behavioural).** `CPR(ladder-build{loss-aversion})`: "Coin flip. Lose $100 on tails. What must heads pay before you'd take it?" range $100–$400. filmDefault "about $200" [Kahneman ch. 26: ratio 1.5–2.5]. Reveal: the value curve (α 0.88, λ 2.25) gives neutral at $251. The viewer's card sits on the gain axis beside it.
- **Fails.** Wrapping a no-prior question; a payoff too fast to see after the freeze; two commits for one reveal (CPR∘CPR is illegal); a card that hides the payoff region; a default answer invented without a source.

### 2 · `trap-and-correct` — combinator `M_wrong × M_right → M`
- **Move.** confront-the-misconception + run-the-wrong-model (PED #4, #5: Muller et al. 2008 "feels clearer, learns less"; Posner 1982; Kendeou co-activation; Lewandowsky fact-myth-fallacy-fact). NAR A2 beats 3–5; device 18 steel-man. Evidence B+.
- **τ.** T1 T3 T5 T6 T7 T8.
- **Ports.** in: `wrong` (a lightweight model: `{name, steelman, predict(case)}`, drawn in ghost style), `right` (any scene module that can run on `case`). Λ needs `gap`; gives `wrong(m)` → `dissatisfied(m)` → `rule(r)`, `instance(case)`. V: PO shared. Wrong and right run on the **same anchors**, so the correction is a state change of one object, not a new picture.
- **Params.** `case` (the viewer's case, from the film's running-example record) · `wrong{name, steelman ≤ 90 chars, predict}` · `right` (module instance) · `observed` (truth on `case`, canonical fn) · `fresh` (a second case for the "fruitful" beat).
- **f(t, state).** **steelman** 15 % (the wrong model's logic, credited: "it works when…") → **run-wrong** 20 % (it confidently produces its answer on `case`, dashed outline in role `error`) → **break** 15 % (`observed` arrives; gap bracket; declared hold 2 s) → **right** 40 % (the right module plays on the same anchors) → **fruitful** 10 % (the right model predicts `fresh`; the wrong one would not). `dur = 8 + right.dur + 3` s (25–45 s).
- **SVG / p5.** SVG: the wrong model's labels and ghost marks, bracket, case data. p5: whatever `right` draws.
- **Control.** Page: a case picker with three cases, including one where the wrong model happens to be right (an honest boundary).
- **Honesty.** Credit where the wrong model works. Never end on the wrong model's image. State where the right model also stops (feeds the chrome honesty slot).
- **Example (AI).** Type-safe, "valid means correct": `case` = an invoice whose source reads `$12,000.00` and whose model output is `amount: 1200.00` (one record, so F14 cannot recur). The wrong model is "schema PASS ⇒ correct" and stamps ✓. The break: the source gauge shows 12,000. `right` = `contrast-split(shape-gauge, truth-gauge)`. `fresh` = `due: 2026-11-05` (a valid date, the wrong day).
- **Example (behavioural).** Linda (Kahneman ch. 15): wrong = representativeness ("she *sounds* like a feminist bank teller"), ranks the conjunction higher. Observed: 85–90 % of undergraduates ranked it so [Kahneman ch. 15]. `right` = `population-sim{rule:none}` of 1,000 Lindas: 50 bank tellers *illus.*, of whom 40 are feminist bank tellers *illus.*. The nested set shows the conjunction can never exceed its constituent, whatever the numbers.
- **Fails.** A strawman wrong model (no steelman); wrong and right on different cases; a correction delivered as text; repeating the myth without the stronger alternative (continued influence, PED §5); naming the principle before the break (L5).

### 3 · `contrast-split` — combinator `M × M → M`
- **Move.** contrast-two-cases (PED #14: Alfieri et al. 2013 d = 0.50 [V], similarities-first plus a later principle d = 1.18; Gentner 2003; Schwartz & Bransford 1998) and name-it-last (#15). NAR device 7 side-by-side; A12 / device 6 counterfactual; device 17 mirror.
- **τ.** T2 T3 T5 T6 T7 T8.
- **Ports.** in: two instances `A`, `B` of the **same module** differing in exactly one parameter. Λ needs `instance(i)` or `parts(P)`; gives `rule(r)` (the invariant or the discriminating feature). V: the PO is cloned into `left`/`right` (morph 0.9 s) and re-merged on exit; a shared axis or caption sits in `foot`.
- **Params.** `vary {param, a, b}` (exactly one; the linter checks A and B differ only here) · `mode: 'contrast'|'counterfactual'` (B = A with one part removed) · `align [anchor ids]` · `similar` (what is the same, shown first) · `principle` (name; appears last).
- **f(t, state).** **clone** 8 % → **run** 40 % (both halves on the same clock) → **align** 20 % (matching anchors pulse pairwise in the same role, similarities first) → **differ** 17 % (the one difference cued, one cue at a time) → **name** 15 % (principle chip; then re-merge). `dur` 20–40 s. Counterfactual mode replaces *differ* with **cascade** (first-order, then second-order effect in B).
- **SVG / p5.** SVG: frames, alignment ties, the varied-parameter tag on each half. p5: the inner layers drawn twice with a translate, from one mark table (same seeds, so differences are causal, not random).
- **Control.** Page: a slider over `vary.b` (A stays fixed as the ghost reference) and a mirror button. Equivariance: derived numbers are unchanged by the swap (METHOD §4).
- **Honesty.** Name what was held fixed. If the real-world cases differ on more than one thing, say so.
- **Example (AI).** Prompt-cache layout (counterfactual): A = a 50,000-token stable prefix, then a 500-token tail holding today's date. B = the date line at token 0. Call 2 costs: A 5,500 units (hit), B 63,000 (miss, re-written at 1.25×) [pricing ratios: verify].
- **Example (behavioural).** Framing (Tversky & Kahneman 1981; Kahneman ch. 34): left, "200 of 600 saved" vs a gamble; right, "400 of 600 die" vs the same gamble. Aligned: the 200 saved figures in the left half are the same people as the 400 dead in the right (one 600-dot grid, re-tinted). Choices: 72 % sure option (gain frame) vs 78 % gamble (loss frame) [Kahneman ch. 34].
- **Fails.** More than one difference (confound); the principle named before alignment; two unrelated pictures side by side; nesting (no 4-way split); halves too small to read (each half ≥ 430 units wide).

### 4 · `ladder-build`
- **Move.** pre-train-the-parts (PED #6, Pollock isolated elements), cue-the-cause (#8), segment-and-pause (#7). NAR A7 incremental build; device 22 ladder step (+1 variable).
- **τ.** T1 T2 T3 T9 T11.
- **Ports.** Λ needs `gap`; gives `parts(P)`, `instance(i)`. V: creates or extends the PO (each rung adds anchors); regions `body` + `foot`.
- **Params.** `rungs [{part, glyph, label, introduces, behave(t, state)}]` (2–4 rungs) · `example` record · `emergent {what, payoff}` (what the parts do together).
- **f(t, state).** **rung0** 15 % (the simplest whole, running) → per rung *k*: picture 0.6 s → cue 0.4 s → label → behave 3–5 s → hold 1 s → **integrate** 15 % (all rungs run together; the emergent property is the payoff) → **name** 5 %. `dur = 4 + 6·rungs + 6` s.
- **SVG / p5.** SVG: parts, labels, flow path, the moving token or car. p5: only when a part carries mass (tokens flowing, budget draining).
- **Control.** Page: rung toggles that remove a part and show what breaks ("remove *observe*: the loop goes blind").
- **Honesty.** List what the simplest version omits (feeds the honesty slot).
- **Example (AI).** Agent loop: rung0 one model call → +act (tool call) → +observe (the result appended to context, ≈ 3,000 tokens per turn *illus.*) → +budget (a 100,000-token reservoir). Emergent: each turn re-reads the whole context, so turn *n* costs ≈ 3,000·n and the budget empties at turn 8 (cumulative 108,000), not turn 33.
- **Example (behavioural).** Loss aversion (Kahneman ch. 26; Tversky & Kahneman 1992): rung0 the reference point at the axis origin → +gains (a concave curve, v(150) ≈ 82) → +losses (steeper, λ = 2.25, v(−100) ≈ −129) → emergent: a 50/50 bet of +150/−100 has EV +25 but felt value ≈ −24, so it is refused.
- **Fails.** Labels before pictures (F1); more than one new part per rung; rung0 not runnable; parts that are never used later (decoration).

### 5 · `concreteness-fade`
- **Move.** fade-concrete-to-abstract (PED #13: Goldstone & Son 2005; Fyfe et al. 2014). Contested: Kokkonen & Schalk 2021 [V] (mixed in physics and chemistry); Kaminski et al. 2008. Victor's ladder (RC §3).
- **τ.** T3 T4 T5, and maths-like T1. Not macro/micro/symbolic science content.
- **Ports.** Λ needs `instance(i)`; gives `rule(r)` in symbolic form. V: the PO morphs through rungs with **anchor ids preserved**; out PO = the last rung, or rung0 if `return:true`.
- **Params.** `rungs [concrete, icon, schema, symbol]` (render fns over the same anchor ids) · `bindings {anchor → term}` (which concrete element becomes which symbol) · `example` record · `return`.
- **f(t, state).** **concrete** 25 % → **morph→icon** 15 % (previous rung ghosted at 0.25) → **morph→schema** 25 % → **morph→symbol** 25 % (term-by-term identity-preserving rewrite, as in TransformMatchingTex, RC §1) → **return** 10 % (optional drop back to the concrete case). Morphs ≥ 0.9 s and never cut (PED impl. notes).
- **SVG / p5.** SVG: icon, schema and symbol rungs, and all terms. p5: the concrete rung when it is a population (≥ 40 marks).
- **Control.** Page: a rung scrubber, plus one editable number in the concrete rung that propagates to the symbol.
- **Honesty.** The concrete case's surface features are not part of the rule. Name the domain limit when it applies.
- **Example (AI).** Softmax: four candidate tokens with scores 2.0 / 1.2 / 0.7 / 0.3 (concrete chips) → bars of e^z (icon) → bars rescaled to sum to 1: 0.525 / 0.236 / 0.143 / 0.096 (schema) → `p_i = e^{z_i} / Σ_j e^{z_j}`, with each term bound to its bar (symbol).
- **Example (behavioural).** Bayes from cabs (Kahneman ch. 16): 1,000 cab dots → a frequency tree 150 / 850 → 120 / 170 → `P(Blue | says Blue) = 120 / (120 + 170) = 0.41` → `p(b|B)p(B) / [p(b|B)p(B) + p(b|G)p(G)]`, each term bound to its branch.
- **Fails.** A cut between rungs (the mapping is lost); a concrete rung rich in seductive detail (Son & Goldstone); a symbol rung shown to novices with no return; used where levels are not rungs.

### 6 · `worked-fade`
- **Move.** walk-the-worked-example (PED #11: Sweller & Cooper 1985; Barbieri et al. 2023 g ≈ 0.48), fade-the-scaffold (#12: Renkl & Atkinson 2003, backward fading), prompt-self-explanation (#19: Bisra 2018 g ≈ 0.55). NAR A9.
- **τ.** T11 T5 T2.
- **Ports.** Λ needs `parts(P)`; gives `rule(r)` (the procedure) and `instance(i)`. V: PO kind `form` (the viewer's artefact with stations); regions `body`.
- **Params.** `steps [{subgoal, action, result}]` (3–5) · `examples [ex1, ex2, ex3?]` (same structure, different surface) · `blanks [[], ['last'], ['last','last-1']]` · `why` (a self-explanation prompt).
- **f(t, state).** **ex1** (full; per step: subgoal label → action → result, 5–7 s) → **why** 3 s (prompt + declared hold) → **ex2** (steps run; the last step is an outlined placeholder: 3 s countdown → reveal) → **ex3** optional (two blanks). `dur ≈ 6·steps + 6·steps·0.7 + 6` s.
- **SVG / p5.** SVG throughout; p5 only if a step's result is a population.
- **Control.** Page: inputs in the blanks, checked against the canonical result; "show me" reveals.
- **Honesty.** Worked examples help novices and reverse for experts (expertise flag, skip path). A procedure is not judgement: say which step needs it.
- **Example (AI).** Writing one eval case: subgoals *pick a real input → write the expected property → choose a grader → run and record*. ex1: a refund email → "refunds ≤ $50 and cites the order id" → a rule check → ✓. ex2: invoice extraction → "amount and currency exactly match the source" → **[grader blank]** → reveal: exact match on two fields.
- **Example (behavioural).** Reference-class forecasting (Kahneman ch. 23): *name the reference class → take its baseline → adjust for specifics*. ex1: the curriculum team estimated about 2 years; the reference class took 7–10, and ~40 % never finished [ch. 23]. ex2: a kitchen remodel. The owners expected $18,658 on average and paid $38,769 [ch. 23, verify] → **[adjust blank]**.
- **Fails.** Steps with no subgoal labels; ex2 identical to ex1 on its surface; the blank revealed with no pause; using it with experts in the main cut.

### 7 · `population-sim`
- **Move.** count-dont-claim (PED #16: Gigerenzer & Hoffrage 1995 — natural frequencies lift Bayesian answers from ~10–15 % to ~46–50 %), vary-one-thing (#18), simulation as evidence (MOD P5; NAR A5 "inject at day N", device 17 mirror).
- **τ.** T5 T7 T8 T9.
- **Ports.** Λ needs `gap`; gives `magnitude(q)` and `rule(r)`. V: PO kind `population` (N marks, per-agent table); regions `body` + counter at the bottom-left of the figure (CA §4).
- **Params.** `N` (100–2,000) · `agent {fields}` · `rules {id: step(agent, k, rng)}` (`none` = a static icon array) · `ruleA`, `ruleB` · `inject {step, rule}` · `readouts [{id, fn}]` · `freezeAt [steps]` · `seed`.
- **f(t, state).** **cast** 12 % (marks placed by seeded Poisson over the body, never a floor pile, CA §5) → **run A** 25 % → **freeze-read** 10 % (the counter derives from the marks; hold) → **toggle B / inject** 25 % (same seeds; ghost of the A readout kept) → **mirror** 15 % (optional control) → **name** 13 %. Pure: the whole trajectory is pre-simulated in `setup` into `table[agent][step]`, and `render` interpolates `step = f(t)`.
- **SVG / p5.** p5: marks and piles, ≤ 12 ms per frame. SVG: counters, axis, rule label, the pause glyph.
- **Control.** Page: a rule toggle (A | B), with the seed fixed. A "reseed" button exists on the page only and is labelled.
- **Honesty.** Toy rules; seeded spread is not real variance; dots are not data unless sourced.
- **Example (AI).** 1,000 runs of an 8-step agent at 0.97 per step → 784 complete. Toggle B, "retry a failed step once": per-step 0.9991 → 993 complete. Ghost of 784 kept.
- **Example (behavioural).** Regression to the mean (Kahneman ch. 17, the flight instructors): 1,000 performers, score = skill + luck with equal variance. Round 1's top 100 fall about halfway back to the mean in round 2 with no praise and no blame. Toggle luck → 0, and the regression vanishes. That is the mirror control.
- **Fails.** A chart pretending to be a simulation (marks must visibly move); marks as spray; the readout printed rather than counted; too many agents to see one (zoom to one first).

### 8 · `mass-reseat`
- **Move.** count-dont-claim + cue-the-cause applied to a conserved quantity (the typesafe throat, CA §3 #1). Also Bayesian conditioning as "the denominator changes".
- **τ.** T1 T2 T5.
- **Ports.** Λ needs `parts(P)` (the bins named) and `instance(i)`; gives `rule(r)` ("ratios survive" or "the evidence picks the denominator"). V: PO kind `track|grid` with bins at anchors; mass of N marks conserved across the module (audit).
- **Params.** `bins [{id, label, p}]` · `N` (1,000; per-bin counts by largest remainder) · `keep [ids]` · `variant: 'renormalize'|'condition'` · `paths` (from PO geometry) · `stagger` (0.0012 s per mark).
- **f(t, state).** **queue** 20 % (marks on bins ∝ p as 2-row ribbons on the structure; label "each mark is 1/N") → **close** 10 % (blades or dimming on non-kept bins; one cue) → **reseat** 30 % (renormalize: marks ride their path back through the throat and out along open paths; condition: excluded marks dim in place, so the denominator stays faint, and kept marks gather into one new whole) → **count** 20 % (numbers count up to p′ = p / Σkeep, ratio bracket) → **hold** 10 % → **name** 10 %.
- **SVG / p5.** p5: the N marks (closed-form path positions, per-mark stagger, ≈ 3 ms). SVG: bins, blades, labels, p and p′.
- **Control.** Page: `constrain` on/off; a draw slider `u ∈ [0,1)` showing which bin the sample takes (CP §5).
- **Honesty.** Illustrative logits; per-step only; "masked", not "checked" (CP §2).
- **Example (AI).** Constrained decoding at `currency`: p = .42 .18 .12 .09 .07 .05 .04 .03 over `USD $ dollars US EUR usd MXN "`; keep {USD, US, EUR, MXN} (Σ = 0.62) → 677 · 145 · 113 · 65 marks, p′ = 0.677 · 0.145 · 0.113 · 0.065; u = 0.55 → USD [SB M3].
- **Example (behavioural).** The cab problem as conditioning: 1,000 cabs (150 Blue, 850 Green); keep "witness says Blue" → 120 + 170 = 290 marks remain lit → 41 % Blue (Kahneman ch. 16).
- **Fails.** Marks flying free (load off the rails, CA M3b); dot-matrix bars that read as a bar chart; numbers that land before the marks; the denominator erased in condition mode.

### 9 · `compound-chain`
- **Move.** step-the-scale (PED #17; the exponential-growth bias: Wagenaar & Sagaria 1975, Stango & Zinman 2009), count-dont-claim (#16). Best wrapped in CPR (L11).
- **τ.** T4 T7 T2.
- **Ports.** Λ needs `gap` (ideally `committed(k)`); gives `magnitude(q)`. V: PO kind `chain` (k junctions or steps on one line; sidings or piles below); regions `body` + `foot` (arithmetic) + counter.
- **Params.** `N0` · `k` · `op: 'mul'|'add'` · `r` (mul) or `c[]` (add, per step; first-step override allowed) · `stepLabels` · `compare {r2 | c2}` (ghost staircase) · `unit` label.
- **f(t, state).** **setup** 10 % (chain drawn; N0 at left as a counted train) → **steps** 50 % (each junction thins or accumulates; the pile height ∝ the step's loss or cost, so the staircase is visible; the counter is derived) → **land** 15 % (final count and %) → **compare** 15 % (the second rate replays; the first stays as a dim ghost) → **arithmetic** 10 % (`r^k` or `Σc` appears *after* the count, L4).
- **SVG / p5.** p5: the train and piles (≤ 2,000 movers on a polyline by table lookup). SVG: the chain, counter, foot arithmetic.
- **Control.** Page: an `r` slider (0.80–0.999) and a `k` slider; arrivals = `round(N0·r^k)` (one canonical fn).
- **Honesty.** It assumes independent steps; real failures correlate. *illus.* if `r` is not measured.
- **Example (AI).** N0 = 2,000, r = 0.95, k = 10 → 1,900 · 1,805 · … · 1,197 (59.9 %); ghost r = 0.99 → 1,809 (90.4 %).
- **Example (behavioural).** Conjunctive plans (Tversky & Kahneman 1974): a project of 8 tasks, each 90 % on time; 1,000 such projects → 900 · 810 · … · 430 finish fully on time (43 %). People overestimate conjunctive probabilities; this pairs with the planning fallacy (Kahneman ch. 23).
- **Fails.** The staircase hidden in a smear (CA M4); a counter out of sync with the marks (CA M4, 0.6 s lag); the formula before the count; no prediction first.

### 10 · `zoom-journey`
- **Move.** step-the-scale by powers of ten (PED #17), familiar anchor (NAR device 4), *the turn* (NAR A3 beat 4), overview-detail-return (RC mode 22).
- **τ.** T4 T5.
- **Ports.** Λ needs `instance(i)` (the anchor object); gives `magnitude(q)`. V: PO kind `field` under one camera transform shared by SVG and p5; regions `full`.
- **Params.** `anchor {label, size}` · `levels [{scale, label, comparison}]` (×10ⁿ, 3–6) · `turn` (the level index where the answer changes) · `field(level)` (baked per level) · `return:true`.
- **f(t, state).** **anchor** 10 % → **zoom** 55 % (per level: an eased camera ×10 over ≥ 1.2 s, capped speed; the comparison label appears after the frame settles; a scale ruler counts) → **turn** 15 % (hold at the level where the claim flips) → **return** 20 % (a fast pull back to the anchor: the ladder return).
- **SVG / p5.** p5: the fields, baked once per level (`drawImage` with the camera). SVG: the ruler and labels, re-laid at three preset scales (MOD Mode A risk note), never scaled continuously.
- **Control.** Page: a log-scale scrubber; a hover on a mark shows its unit.
- **Honesty.** Equal visual steps hide ×10 jumps (say so on the ruler); approximate sizes are flagged.
- **Example (AI).** One token → a page (≈ 500 tokens) → a novel (≈ 130,000 *illus.*) → a 200,000-token context window → 15 trillion pretraining tokens (Llama 3 [verify]). Turn: the corpus is 75 million context windows.
- **Example (behavioural).** Denominator neglect (Kahneman ch. 30): one highlighted dot → 1,000 → 1,000,000 dots. At 10⁶ the "1 in a million" dot is invisible at full frame, yet the vivid story of that one person is unchanged. The film shows the gap between the felt and the counted.
- **Fails.** Continuous text scaling (strobing hairlines); a field that reads as grey with no legible step (FC rule 4); no return to the anchor; the turn unmarked.

### 11 · `feedback-loop`
- **Move.** vary-one-thing (PED #18) on a stock-and-flow structure (TAX T9, Meadows); linked dual representation (MOD P9: diagram + time series in one frame).
- **τ.** T9 T7.
- **Ports.** Λ needs `parts(P)` (stock, flows named; via ladder-build or inline); gives `rule(r)` ("the behaviour comes from the structure"). V: PO kind `vessel`; regions `left` (stock-and-flow) + `right` (trace), linked by one clock.
- **Params.** `stocks [{id, init}]` · `flows [{from, to, rate(state)}]` · `delay` · `polarity` (+/−) · `dt` · `steps` · `scenarios [{label, params}]`. Integrated in `setup` with a fixed dt into a table (pure in t).
- **f(t, state).** **structure** 20 % (vessel, pipes, loop sign, one at a time) → **run** 35 % (the level changes and the trace draws in lockstep) → **intervene** 25 % (change gain or delay; the first trace kept as a ghost) → **name** 10 % (overshoot, oscillation or runaway, named after it is seen) → **hold** 10 %.
- **SVG / p5.** p5: units in the vessel (counted). SVG: pipes, polarity, the trace, labels.
- **Control.** Page: a `delay` or `gain` slider; the trace recomputes from the table builder.
- **Honesty.** It is a one-loop toy; real systems have more loops; parameters are *illus.*
- **Example (AI).** Agent budget: stock = 100,000 tokens; outflow per turn = context size, which grows by 3,000 per turn (reinforcing) → empty at turn 8. Intervene: a summarise step caps the context at 9,000, so cost flattens to 9,000 per turn from turn 3 and the budget lasts 12 full turns (cumulative 99,000).
- **Example (behavioural).** The shower (Meadows; Sterman's misperception of feedback): target 38 °C from 20 °C, the hand corrects at k = 0.5/s. Delay 0 s → settles at 38.0. Delay 2 s → overshoots to 47.4 °C before settling. People blame the plumbing, not the delay.
- **Fails.** A static loop diagram (no run); the trace not linked to the vessel; polarity unlabelled; an unstable parameter set shipped as the default (delay 4 s diverges at k = 0.5).

### 12 · `tradeoff-frontier`
- **Move.** vary-one-thing on a frontier (PED #18), with contrast (#14); TAX T6 "a slider moves the point while a second quantity moves opposite".
- **τ.** T6 T12.
- **Ports.** Λ needs `parts(P)` (both axes named); gives `rule(r)` ("no free option; the best point depends on the constraint"). V: PO kind `frontier` (plane, curve, movable point); regions `body` + `foot` (paired readouts).
- **Params.** `axes {x, y, better}` · `frontier(s) → (x, y)`, s ∈ [0, 1] (data or closed form) · `options [{label, s}]` · `dominated [points]` · `constraints [{label, line}]`.
- **f(t, state).** **axes** 10 % → **options** 15 % (dominated points first, then the frontier drawn through the non-dominated ones) → **sweep** 35 % (the point slides; the two readouts move in opposite directions) → **constraint** 25 % (a wall appears; the best point is where it meets the frontier; a second constraint gives a different point, the first ghosted) → **name** 15 %.
- **SVG / p5.** SVG: the plane, curve, point and readouts. p5: only a dense sample cloud (e.g. 500 thresholds).
- **Control.** Page: an `s` slider and a constraint slider.
- **Honesty.** The frontier comes from one dataset or model; do not extrapolate; *illus.* if synthetic.
- **Example (AI).** Guardrail threshold *illus.*: on 1,000 benign and 100 harmful requests, threshold 0.3 blocks 95 harmful and refuses 120 benign; threshold 0.7 blocks 70 and refuses 15. Constraint "≤ 2 % false refusals" → threshold ≈ 0.6.
- **Example (behavioural).** Look-then-leap (the optimal-stopping secretary problem, 100 candidates): skipping the first r and taking the next better one gives P(best) = 0.235 / 0.326 / 0.371 / 0.349 / 0.251 at r = 10 / 20 / 37 / 50 / 70. The search cost rises with r, and the best point is ≈ 37 % (1/e).
- **Fails.** Naming a winner without a constraint; colour used as magnitude; two quantities on separate charts (they must be on one plane or in paired readouts).

### 13 · `timeline-scars`
- **Move.** chain-with-therefore (PED #22: the ABT spine, Olson 2015), re-see-through-the-lens (#21), the historical stuck-point (NAR device 26).
- **τ.** T10 T7.
- **Ports.** Λ needs `gap`; gives `rule(r)` ("each odd feature is a scar") and `instance(i)`. V: PO kind `timeline` (one axis, persistent baseline) + `inset` (anatomy of today's artefact with feature ids).
- **Params.** `events [{year, problem, fix, scar (feature id)}]` (3–6) · `artefact {features}` · `eraRamp` (lightness, not hue; TAX T10).
- **f(t, state).** **today** 10 % (the artefact, odd features unlabelled) → **rewind** 10 % → per event: problem → *but* → *therefore* fix → the scar thread attaches to a feature (60 % in total) → **re-see** 15 % (the artefact again, every feature threaded to its year) → **hold** 5 %.
- **SVG / p5.** SVG throughout. p5 only for a density layer (e.g. counts per year).
- **Control.** Page: a year scrubber; the artefact shows only the features that existed by then.
- **Honesty.** History simplified; contested causation flagged; every date cited.
- **Example (AI).** From tools to MCP: 2022 ReAct (actions parsed from text) → 2023 function calling (JSON-Schema tool definitions; scar: tools are described by schemas) → Nov 2024 MCP (one protocol for N × M integrations; scar: the client/server split) [dates: verify].
- **Example (behavioural).** The heuristics canon: 1974 "Judgment under Uncertainty" (Science) → 1979 prospect theory → 2002 Nobel → 2011 *Thinking, Fast and Slow* → 2012 Kahneman's open letter on priming replications. Scar: today's caveat on the priming chapter [verify].
- **Fails.** A list of dates (no *therefore*); hue for era; no return to today's artefact.

### 14 · `recap-retrieve`
- **Move.** retrieve-once (PED #20: Roediger & Karpicke 2006; Szpunar et al. 2013; Adesope 2017 g ≈ 0.61), re-see / the ladder return (#21; NAR device 23), recap card (device 9).
- **τ.** all.
- **Ports.** Λ needs ≥ 2 of {`rule`, `instance`, `magnitude`} and the opening-instance id; gives `retrieved(x)`. V: the PO returns to its opening state (L13).
- **Params.** `question` (about content ≥ 30 s earlier) · `answerKind` · `answer` (a canonical fn, never a literal) · `recap [3–5 {glyph, line ≤ 40 chars, frameRef}]` · `return {instance, newModel}`.
- **f(t, state).** **ask** 25 % (3 s countdown; page input) → **answer** 15 % (derived on screen) → **recap** 35 % (3–5 items, each a small glyph of the earlier frame, not text alone) → **return** 25 % (the opening case re-run with the new model).
- **SVG / p5.** SVG: card, glyphs, question. p5: the return scene's layers, if any.
- **Control.** Page: an answer input; the page can re-ask on the next visit (the delayed test).
- **Honesty.** One retrieval question is a small dose. Its benefits are measured after delays.
- **Example (AI).** Type-safe: "At 0.99 per step, how many of 2,000 arrive after 10 steps?" → 1,809. Return: Marisol's invoice, constrained, with the three consequences now in role `allowed`.
- **Example (behavioural).** Anchoring (Kahneman ch. 11): "The wheel stopped at 10. Which mean did that group give: 25 % or 45 %?" → 25 %. Return: the viewer's commit card beside both piles.
- **Fails.** Asking about something 5 s ago (that is not retrieval); a recap card that is a bullet list; no return.

---

## 4. Worked compositions (≈ 2 min each, built only from modules)

Notation: `[t0–t1] module{params}`. The chrome bookend, honesty and land are pseudo-modules. Each chain passes
`lint_plan`: L11 is satisfied where it applies, and every CPR wraps a module with a numeric or choice payoff.

### 4a · "Prompt caching: why the second call is cheap" — dark chrome, 120 s
S0 practitioner-novice · S1 T2 primary, T4 secondary · aha: "the cache keeps the *reading*, not the answer" ·
misconception (runnable): "the cache stores the answer" · archetype A12 counterfactual with an A2 trap ·
PO = **a bookmarked stack**: 100 pages × 500 tokens = a 50,000-token manual + a 500-token question card ·
roles {cost: `machine` copper · reused-from-cache: `allowed` sage · miss/stale: `error` peach · unread: `neutral`} ·
units: input-token units at the base price; cache write 1.25×, read 0.10× [verify against current pricing; TTL 5 min].

| t | Module | Params / key moments |
|---|---|---|
| 0–8 | `bookend` | brand ≤ 3 s; card: "One 50,000-token manual. Ten questions. Why is question two cheap?" |
| 8–30 | `ladder-build` | rung0: stack + question → the model reads every page (a prefill sweep, 1 page per 0.04 s) → answer; rung1: meter `50,500 units`; rung2: reading leaves a bookmark state on each page (the KV state; label after the picture, L4); integrate: call 2 *without* a cache re-reads all 100 pages → `50,500` again (payoff t 27) |
| 30–54 | `CPR(trap-and-correct)` | Q "Call 2 asks a different question. With caching on, it costs…" options {0 % (answer reused) · ~10 % · 100 %}; film default "0 %" *illus.*; wrong = "the cache stores the answer" → predicts Q1's answer returned (ghost); break at 44: a new question needs a new answer; right = the stack with bookmarks: 100 pages read from cache (0.10× → 5,000) + the new card (500) → meter `5,500` = **10.9 %** of 50,500 (payoff 48); fresh: a third question, same 5,500 |
| 54–76 | `contrast-split{mode:'counterfactual'}` | vary = the position of one line `Today is 2026-10-08`: A (in the tail) → hit `5,500`; B (at token 0) → every bookmark invalid (peach wave left→right) → re-write `63,000` (1.25×). Align: the pages; differ: the first changed token. Name last: "a cache matches a prefix" (t 72) |
| 76–94 | `CPR(compound-chain{op:'add'})` | Q "Ten calls. Cached total vs uncached?" slider 0–100 %; film default "~10 %" *illus.*; steps: uncached +50,500 per call → 505,000; cached 63,000 then +5,500 → **112,500 = 22.3 %**; the ghost staircase stays; break-even marked at call 2 (68,500 vs 101,000) |
| 94–104 | `honesty` | runs the top limit: a one-off prompt costs **+25 %** (the call-1 bar above the uncached bar); other items: the bookmark expires after 5 min idle (refreshed on each hit); a minimum cacheable prefix; output tokens are never cached; prices relative to base [verify] |
| 104–116 | `recap-retrieve` | Q (content from 54–76; ≥ 30 s): "The date is on line 1 of your system prompt. Hit or miss?" → miss; recap: 3 glyphs (bookmark · prefix ruler · staircase); return: the opening ten-question scene, meter 112,500 |
| 116–120 | `land` | "A cache doesn't remember answers. It remembers having read." |

Control (page): `prefixTokens` 1,000–200,000; `calls` 1–50; `datePosition` head | tail. All numbers come from
`cost(calls, prefix, tail, hit)`.

### 4b · "Base-rate neglect" (Kahneman ch. 16, the cab problem) — Field Notebook, 120 s
S0 novice · S1 T5 primary, T8 secondary · aha: "the denominator decides" · misconception (runnable): "the witness is
80 % reliable, so it's 80 %" · archetype A2 with an A8 commit · PO = **the city: 1,000 cab dots** · roles {Blue cab:
filled dot, Green cab: hollow dot (shape, not hue, so the cab colours don't collide with the semantic colours, L6) ·
the viewer's/witness's judgement: amber · the counted answer: blue · error: red · remedy: green}.

| t | Module | Params / key moments |
|---|---|---|
| 0–8 | `bookend` | the notebook opens; handwritten: "A cab hit someone at night. A witness says it was Blue." |
| 8–24 | `ladder-build` | rung0: 1,000 dots draw in (850 hollow, 150 filled; counts written after the dots, L4); rung1: the witness tested on 100 night scenes: 80 right, 20 wrong (strip of 100 figures) |
| 24–48 | `CPR(trap-and-correct)` | Q "The witness says Blue. Chance the cab was Blue?" slider 0–100; MP4 "pause and guess" (4 s ring); film default "80 % — the most common answer" [Kahneman ch. 16]; wrong = "trust the witness" → an amber meter fills to 80 %; break at 40: "but 850 of the 1,000 cabs are Green"; right = ↓ |
| (right) 40–48 → 48–70 | `mass-reseat{variant:'condition'}` | every dot gets the witness test: 120 filled + 170 hollow are outlined "says Blue"; the other 710 dim but stay (denominator visible); the 290 gather into one block; count → **120 / 290 = 41 %** (blue, payoff 64); name last at 67: "the base rate" |
| 70–90 | `contrast-split` | vary = the framing of the same 85/15: left "85 % of cabs are Green" (statistical) vs right "Green cabs cause 85 % of accidents" (causal); both blocks compute 41 %; amber judged marks: left near 80, right moved toward 41 — **direction only** (a chevron, no invented number; Kahneman reports the causal version moves answers toward Bayes) |
| 90–100 | `honesty` | "A classroom problem, not accident data [Kahneman ch. 16; Tversky & Kahneman]. Our dots are a drawing of the stated proportions. The causal shift is drawn as a direction because the book gives no single number." |
| 100–116 | `recap-retrieve` | Q (content 48–70): "Same witness, but only 5 % of cabs are Blue. Above or below 41 %?" → below: **40 / 230 = 17 %**; recap glyphs: grid · outline · block; return: the opening sentence with the viewer's card beside 41 % |
| 116–120 | `land` | green remedy check: "Before you trust the witness, ask: how many of each are out there?" |

Control (page): `blueShare` 5–50 % (41 % → 17–80 %), `reliability` 0.6–0.99 (0.99 → 94.6 %). One fn: `ppv(base, rel)`.

### 4c · "Why AI agents need evals" — dark chrome, 120 s
S0 practitioner · S1 T11 primary, T5 secondary · aha: "one good run is one draw; a gradebook is the measurement" ·
misconception (runnable): "it worked when I tried it, so it's better" · archetype A2 then A9 · PO = **the gradebook**
(rows = 50 cases, columns = versions; a cell = pass/fail) · roles {pass: `allowed` sage · fail/regression: `error`
peach · the agent's steps: `machine` copper · unrun: `neutral`}. All case data are *illus.*

| t | Module | Params / key moments |
|---|---|---|
| 0–8 | `bookend` | card: "You changed one line of your agent's prompt. Is it better?" |
| 8–32 | `CPR(trap-and-correct)` | wrong = the vibe check: 3 demo runs of v2 pass ✓✓✓ → "it's better"; Q "Those 3 passed. Of 50 real cases, how many pass?" 0–50; film default "45+" *illus.*; break: the gradebook's v2 column fills row by row → **36 / 50**; the v1 column (ghost) → 31 / 50 |
| 32–52 | `compound-chain{N0:1000, r:0.97, k:8}` | why demos mislead: an 8-step agent at 97 % per step → 970 · 941 · … · **784** finish; "a demo is one draw from this train"; ghost r = 0.99 → 923 |
| 52–76 | `worked-fade` | subgoals: real input → expected property → grader → run & record; ex1 refund email, full; why-prompt 3 s; ex2 invoice extraction with the **grader blank** → reveal: exact match on amount + currency |
| 76–96 | `contrast-split` | vary = version (v1 \| v2) on the same 50 rows; align rows; similar: 27 rows pass in both; differ: **9 fixed, 4 broken** (31 − 4 + 9 = 36), the 4 regressions in peach (payoff 90); name last: "compare per case, not per total" |
| 96–106 | `honesty` | runs the top limit: Wilson 95 % intervals, v1 62 % (48–74 %) and v2 72 % (58–83 %), overlap on one axis → "5 more passes on 50 cases is inside the noise; the 4 regressions are not"; also: graders can be wrong; an eval measures only what you wrote |
| 106–116 | `recap-retrieve` | Q (content 32–52): "8 steps at 97 % each. Of 1,000 runs, about how many finish?" → 784; recap glyphs: train · form · paired columns; return: the opening "one line changed" card, now answered by the gradebook |
| 116–120 | `land` | "A demo is an anecdote. An eval is a measurement." |

Control (page): `stepRate` 0.90–0.999, `cases` 20–500 (interval width updates), and a v1|v2|both toggle. Fns:
`arrivals(N0, r, k)`, `wilson(k, n)`, `flips(v1, v2)`.

---

## 5. What the operad buys (and its limits)

- **Typing** rejects, before code, a plan where `recap-retrieve` asks about content 5 s old, a `contrast-split`
  that varies two things, or a CPR around a no-prior question.
- **Associativity** licenses lanes. Modules in disjoint regions with no shared port are built in parallel (OP §4.3).
  The PO-writing modules are sequential.
- **Valuations** (OP §5 style): one plan evaluated as *render* (frames), *duration* (Σ phase lengths),
  *evidence* (∪ PED/NAR pointers → colophon), *honesty* (∪ module limits → chrome slot), *cost* (Σ p5 ms/frame)
  and *ICAP* (max of passive < active < constructive per module: CPR and worked-fade blanks are constructive; the
  rest are active at best in film).
- **Limits.** The learner flags are design claims, not measurements. A module "gives" `rule(r)` only if the seat
  check (METHOD §5) confirms it. Module durations are proposals (PED caution 1). No module has yet been tested
  against a static equivalent (Tversky).
