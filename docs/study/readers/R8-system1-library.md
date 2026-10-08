# R8: System 1 (explainer-library) report

Read-only checks run: `node core/lint_plan.mjs films/base-rate/plan.json` (L1–L13 and p5 budget, all PASS) and `node modules/<m>/test.mjs` for the six built modules (all 12 demos PASS).

## 1. Pipeline and decision tables (METHOD.md v1.0)

**Steps:** S0 level + chrome · S1 type (T1–T12) · S2 aha + misconception · S3 archetype · S4 per-beat move (24 PED moves) · S5 module choice (Table 4) · S6 persistent object (PO), roles, bookends · S7 controls (≤1 per module) · S8 honesty · S9 compile + lint · S10 crit rubric, applied by seats that did not build.

**Concept types (Table 2 test sentence; primary = first true, in this order):** T8 Bias "A mind does X where a rule says Y, and you will do it too." · T5 Probabilistic "The answer is a distribution or a rate; one draw misleads." · T4 Scale "Its size changes what kind of thing it is." · T9 Feedback "The state changes its own rate; delays matter." · T6 Trade-off "Gaining one good costs another." · T7 Causal "The visible symptom is several links downstream." · T1 Mechanism "Inside, it is a small operation, repeated." · T2 Pipeline "Quality is decided at one stage." · T11 Procedure "You can do these steps on Monday." · T10 Historical "Each odd feature is a scar." · T3 Structural "These two things are different (or the same)." · T12 Strategy "The real choice is elsewhere."

**Archetypes (NARRATIVE §5):** A1 rediscovery · A2 misconception autopsy · A3 scale journey · A4 cold open–stakes–walkthrough (LONGFORM) · A5 rules-change simulation · A6 demo then mechanism · A7 incremental build · A8 play-then-explain · A9 tiny steps + recap · A10 series chapter · A11 narrative case · A12 counterfactual. Table 3 picks by (primary type, runnable misconception): T5 → A2/A8, else A9; T4 → A3; T1 → A2, else A7; T11 → A9; T10 → A11.

**Move → module (Table 4):** open-the-gap → bookend chrome · commit → CPR · run-wrong → trap · pre-train → ladder rung 0 · cue → L8 · segment → L9 hold · walk/fade → worked-fade · fade concrete→abstract → concreteness-fade · contrast → contrast-split · count → mass-reseat / population-sim · scale → compound-chain / zoom-journey · vary → feedback-loop / tradeoff-frontier · retrieve → recap-retrieve · therefore → timeline-scars.

**PO hand-over (Table 5):** same kind → direct · different kind with shared anchors → concreteness-fade or a ≥0.9 s morph · single case → population → zoom-journey or spawn · split → contrast clones the PO and re-merges · no relation → illegal (re-plan, or one bookend chapter).

## 2. Modules (MODULE-OPERAD §2–3)

| # | Module | Ports (needs → gives) | Phases | p5 | Built |
|---|---|---|---|---|---|
| 1 | commit-predict-reveal (CPR) | gap → committed → dissatisfied/rule | ask 1 s, commit 4 s, reveal, gap 2.5 s, hold; adds ~9 s | none (inner's) | yes |
| 2 | trap-and-correct | gap → wrong, dissatisfied, rule | steelman 15, run-wrong 20, break 15, right 40, fruitful 10 | forwards inner | yes |
| 3 | contrast-split | instance/parts → rule | clone 8, run 40, align 20, differ 17, name 15 | inner drawn twice | yes |
| 4 | ladder-build | gap → parts, instance | rung0 15, rungs, integrate 15, name 5 | SVG only | yes |
| 5 | concreteness-fade | instance → symbolic rule | concrete 25, icon 15, schema 25, symbol 25, return 10 | concrete rung if ≥40 marks | no |
| 6 | worked-fade | parts → rule, instance | ex1, why 3 s, ex2 with blank, ex3 | only if population | no |
| 7 | population-sim | gap → magnitude, rule | cast 12, run 25, freeze 10, toggle 25, mirror 15, name 13 | yes, ≤12 ms | no |
| 8 | mass-reseat | parts, instance → rule | queue 20, close 10, reseat 30, count 20, hold 10, name 10 (20 s) | yes, ~3 ms | yes |
| 9 | compound-chain | gap → magnitude | setup 10, steps 50, land 15, compare 15, arithmetic 10 | yes, ≤2,000 movers | no |
| 10 | zoom-journey | instance → magnitude | anchor 10, zoom 55, turn 15, return 20 | yes, baked per level | no |
| 11 | feedback-loop | parts → rule | structure 20, run 35, intervene 25, name 10, hold 10 | units in vessel | no |
| 12 | tradeoff-frontier | parts → rule | axes 10, options 15, sweep 35, constraint 25, name 15 | dense cloud only | no |
| 13 | timeline-scars | gap → rule, instance | today 10, rewind 10, events 60, re-see 15, hold 5 | optional | no |
| 14 | recap-retrieve | ≥2 of {rule, instance, magnitude} → retrieved | ask 5 s, answer 4, hold 2, recap 7, return 5 | none (SVG) | yes |

Chrome pseudo-modules (bookend, honesty, land, hold) are in the operad and `module.js` has a `chrome` kind, but `core/chrome/` does not exist. `module.js` declares 12 PO kinds; `core/po/` implements 4 (track, grid, axis, chain). Only mass-reseat draws its own p5 layer among the six built modules.

## 3. Laws L1–L13 (METHOD §4)

- **L1 typing:** a module's needs are covered by the accumulated gives; PO kind is legal. Check: set inclusion on the chain.
- **L2 one object:** one PO id through the chain. Check: id constant; no second create.
- **L3 one new thing:** ≤1 introduced term per phase; ≤1 module start per 10 s.
- **L4 picture first:** a label follows its mark by ≥0.3 s.
- **L5 name last:** principle names come at or after the payoff.
- **L6 colour = variable:** one role per variable; no hex or role literals in module code.
- **L7 counted, not claimed:** every shown number is a `numbers` fn; `@example` values match the record. Check: `audit()`.
- **L8 cue budget:** ≤1 cue live, ≤1.5 s each.
- **L9 declared holds:** motion-free >3 s only as a 2–4 s hold ≤0.5 s after a payoff.
- **L10 honesty:** non-empty per module; slot = union; MP4 CPR caption says "pause".
- **L11 prediction:** T1/T4/T5/T7/T8 primary ⇒ ≥1 CPR.
- **L12 verbal channel:** narration, or a burned label per introduced term.
- **L13 return:** the last module before land returns to the opening instance; retrieval ≥30 s after its content.

## 4. Module interface and compile

`Module.define(name, def)` validates at define time. Required: `kind` (scene | combinator | chrome), `ports` ({needs, gives, consumes, po:{in,out}, regions}), `params` schema, `duration(P)`, `phases(P)` (id, f, introduces, labels, cue, hold, payoff, names, still), `numbers(P)`, `audit(P)`, `honesty(P)`. Non-combinators also need `build(svg,ctx,P)` and `render(lt,ctx,P)`, pure in local time. `p5Layer` needs `means`. Optional: `out(P,po)`, `controls(P)`, `expertise`. Combinators add `arity` and `wrap(inners,P,R)`.

`Film.compile(plan, {aspect})`: 1 resolve · 2 window (t0[k+1] = t1[k] + 0.9 s cross-fade) · 3 static PO hand-over · 4 clock maps (seq | freeze) · 5 emit `FEATURE`. BUILD-SPEC adds combinator expansion before windowing and CPR page gates.

## 5. plan.json format

`meta` {id, title, chrome, level, vo, eyebrow, titleHTML, lede, synthTitle, synthesis, sources} · `type` {primary, secondary} · `archetype` · `aha` · `misconception` {text, runnable} · `roles` {variable → role or `shape:filled`} · `po` {kind, id, n, cols, pitch, x0, y0, label} · `example` (one record, referenced as `@example.x`) · `given` {flags} · `modules[]` of {use, head {eyebrow, title, chapter}, params, inner? {use, params, right?}, captions {phaseId → text}}. Channel copy lives in `copy.json`. The base-rate plan has no bookend, honesty or land entries.

## 6. Channels

**Design:** one plan, six channels; each channel is a projection that reads the compiled timeline, never edits it, and cannot invent a number. Beat classes: hook, commit, wrong, break, build, count, contrast, name, honesty, recap, land.

**Survival:** the reel moves break to a 0–1.8 s cold open, keeps count, drops contrast and recap. The carousel keeps film order (the swipe is the commit). The LinkedIn doc has 8–12 pages with a sources page. The LinkedIn video is 45–75 s, text-first. The blog embeds the film with a ~900–1,400-word narrative. The newsletter is ~300 words with one bold number and a GIF.

**Aspect re-layout:** `core/layout.js` gives region tables for 16:9 (960×540, the design basis; 13 stills pixel-identical), 9:16, 4:5 and 1:1. Other modules are FIT (scaled, flagged in qa.json). Type floor 28 u = 11.4 CSS px on a 390-px phone.

**QA:** (a) dominant element ≥35 % of the safe area, (b) no repeated figure state (dHash ≤12/256), (c) type minimums (headline ≥72, body ≥36, labels ≥28, numeral ≥200 px), (d) the brand line once per carousel, PDF or reel. Human checks Q1, Q2, Q4, Q5, Q7, Q9 only listed in `eyes_on_checklist`. All automated gates PASS.

**Reconciled platform numbers:** reel safe zone top 240 u, bottom from y 1111 u, sides 58 u, right rail x >756 u; LinkedIn doc 100 MB and 300 pages; LinkedIn video 45–75 s; carousel 20 slides, 30 MB; email GIF ≤1 MB target, 1.5 MB hard, 600 px, HTML <102 KB; OG 1200×630.

**Not done:** portrait for track, axis and chain figures (FIT only); interaction substitutes; general label-placement solver; human QA; hosted URLs.

## 7. The base-rate film as built

- Duration 123.9 s. Windows: ladder-build 0.5–30.0 s · CPR(trap(right = mass-reseat)) 30.9–73.6 · contrast-split(mass-reseat) 74.5–99.0 · recap-retrieve 99.9–122.9.
- 7 instances of 6 distinct definitions. Notebook chrome, novice, T5 primary, T8 secondary, A2, vo false.
- Numbers: 150 Blue and 850 Green cabs; witness right 80 of 100. 120/290 = 41 %. City B: 400/500 = 80 %. Fresh case: 680/710 = 96 %. Recap at 5 % Blue: 40/230 = 17 %.
- Outputs: reel 9:16 MP4 23.6 s 3.98 MB; carousel 7 slides; linkedin-pdf 10 pages 3.17 MB; linkedin-video 4:5 51.97 s 6.01 MB; blog post.md + embed.html 1.52 MB + og.png; newsletter email.html 5.2 KB + count.gif 246 KB; frames.json 178 frames. Page 1.48 MB.
- Flags: posts cite `cetiai.co/explainers/base-rate`, not hosted. README counts drift (12 vs 10 PDF pages, 9 vs 7 slides, 6 vs 7 stills); reel count beat 4.0 s vs ~6.6 s claimed.

## 8. Research corpus

- CONCEPT-TAXONOMY.md: T1–T12; 30 classified topics; 28 visual symbols; Bertin variables and Cleveland–McGill ranking; Munzner.
- NARRATIVE-STRUCTURES.md: 13 channels analysed; 28 scene devices; 12 archetypes with beat percentages (author's synthesis).
- PEDAGOGY-LEARNING-SCIENCE.md: 24 moves rated A–C and four skeletons. Mayer medians: coherence ~0.86, signaling ~0.41, redundancy ~0.86, spatial contiguity ~0.82, temporal ~1.22, segmenting ~0.67, pre-training ~0.75, modality ~0.76, personalization ~1.0. Höffler & Leutner 2007 animation vs static d = 0.37 (procedural-motor 1.06). Tversky 2002: advantages vanish when static control is equated. Worked examples g ≈ 0.48; self-explanation g ≈ 0.55; backward fading; expertise reversal. Predict-first demos (Crouch 2004); Brod 2021 blind guesses no benefit. Retrieval g ≈ 0.50–0.61. Concreteness fading contested in physics/chemistry. Alfieri 2013 comparison d = 0.50, similarities-first d = 1.18. Muller 2008 misconception-first. Productive failure g ≈ 0.36 contested. Gigerenzer & Hoffrage natural frequencies 10–15 % → 46–50 %. ICAP. Guo 2014 engagement falls after ~6 min.
- CHANNEL-SPECS.md: platform specs checked 2026-10-07; open items.

## Core ideas that should survive

1. The unit is a typed move, not a movement template: concept type → archetype → move → module.
2. Mechanical laws (L1–L13) run on the compiled timeline before any frame.
3. One persistent object per film, with state changes only.
4. Predict only where a prior exists (L11). Run the wrong model on the film's own case, and never end on it.
5. Counted, not claimed: every number is one function of one example record, shared across channels.
6. Colour is bound to variables through a film-level role table, not to scenes.
7. Picture, then cue, then label, then payoff, then name. Holds are declared, one new thing per beat.
8. Honesty is a run, not an end card.
9. The film returns to its opening instance.
10. Channels are projections of one plan, with safe-zone and type-floor gates.

## Experiment-specific choices

- Chrome: CETI dark vs Field Notebook; 960×540 basis; palettes.
- All phase fractions and durations (proposals); archetype percentages.
- The 14 modules and the six built; the cab problem; hook formulas; platform numbers (partly [verify]); AI examples [verify].

## What System 1 has that System 2 lacks

- A typed taxonomy with decision tables, a plan format linted before render, a test per module.
- Explicit ports and learner-state flags, combinators (CPR, trap, split) and an operad.
- A channel compiler: one plan to six outputs with QA gates.
- Aspect re-layout and page gates for predictions.

## What System 2 has that System 1 lacks

- Breadth: eight art directions, including WebGL worlds, knitted cloth and a light table. System 1 has one chrome pair.
- A shared control film per world on one topic.
- Material kernels and a camera module, about 16 shipped films.

Neither system has been tested against a static equivalent. System 1's CPR on/off experiment is not run. In System 1, bookend, honesty and land are not built, 8 of 14 modules are unbuilt, and only 4 of 12 PO kinds exist.
