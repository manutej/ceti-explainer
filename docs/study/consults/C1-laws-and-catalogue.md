# C1: Unified laws, structure catalogue, selection procedure, drawing model

Inputs: R4, R8, R13, R14, R2, R5, R12, R3 (R7, R10 absent). Grades are R14's. [prop] marks proposals, not evidence.

Base decision: the AM runtime and linter (typed beat graph, compose, negative cases, gate) carry the plugin. System 1 adds phase metadata (introduces, labels, cue, hold, payoff, names), decision tables, audit tests and the channel compiler. AM lacks phase metadata, so L3-L5, L8, L9 cannot be checked on it; System 1 has no gate or negative tests.

## (a) Unified law table

H = hard (fails the build), S = soft (waivable with a written reason). Sys: S1, S2, both, or crit (a crit rule that never became a law). "=" marks a merge.

| Id | Law (and mechanical check) | H/S | Source | Sys |
|---|---|---|---|---|
| TYPE | Data ports wired with matching types; learner-state needs (gap, committed, parts, instance, rule, magnitude) covered by accumulated gives; arrangement kind legal or a hand-over exists; no unknown module or port; source starts before reader. = L1 + TYPE | H | L1, TYPE | both |
| ONE-OBJECT | One arrangement id per film; modules receive it, never create one. Id constant. | H | L2 | S1 |
| NO-DRAW | Pedagogy modules and cameras make no draw calls; only Material verbs. Scan plus runtime proxy. = HOUSE | H | HOUSE | S2 |
| CLOCK | Frame pure in (t, state, seed). Static token scan AND gate PURE-REP (re-seek) AND PURE-ORD (A-then-B equals B-then-A); the scan alone missed both real failures (canvas sampling, shader derivatives). = CLOCK + gate | H | CLOCK, F10 | both |
| CRN | Paired conditions (check on/off, case A/B) read one engine node and the same draws. | H | SEED | S2 |
| BELIEF | Every digit is a typed Number {q, exact/expected/realised, sd, N, source} or marked given/sketch; invented values labelled "sketch". Guard at the Material boundary plus `audit()` that `@example` values equal the record. = L7 + BELIEF | H | L7, BELIEF | both |
| EXPECTED-WORD | Never "exact" beside a ±; write "expected x ± 2sd"; sd ≤ √(n/4) for a binomial. String ban plus bound. | H | CRIT-d1,d2, F3 | crit |
| ONE-ENCODING | One encoding per quantity per film ("36 of 100", not 36 % plus "a third"); count and percent agree; one glyph means one unit across the film and its siblings. | H | CRIT-d3,d5 | crit |
| SEED-PICK | No outcome-chosen seeds: every shown realised value within 0.5 sd of expected, or the expectation is the headline. z check. | H | CRIT-d7, F4 | crit |
| VISIBLE-N | N chosen so the effect shows: expected condition gap ≥ 2 sd of the gap at film N; unit ≥ minimum size. = CAP (range) + defect 8 | H | CAP, CRIT-d8 | both |
| COST-BASIS | Any break-even or cost label states its basis (includes the redo or not); text must match the engine's cost fields. | H | CRIT-d6 | crit |
| TRUTH-VETO | Every figure recomputed by script; the pedagogy critic signs the claim and metaphor. A false claim blocks ranking whatever the craft score. | H | PEDAGOGY-CRIT | crit |
| P1 COMMIT-FIRST | No reveal or anchor of family F before a commit of F closes. Control defaults must not anchor (PCR defaults to 70 % of N). = P1 + L11 order | H (B) | P1, CRIT-d9 | both |
| REQ-PRED | Primary type T1/T4/T5/T7/T8 requires ≥1 PCR at Grasp and above; Glance may use one cold commit. Conflict with MAX resolved: the commit counts toward the cap. | H at Grasp+, S at Glance | L11 | S1 |
| P2 COUNT-FIRST | A count needs an earlier ENS; a percent needs its count earlier. Exempt for executives (NF not shown to help them). = P2 + NF | H (A) | P2, MAP | both |
| P3 / P4 | CF concrete before morph, ending before ENS; WE full before gap1 before two gaps. | H | P3, P4 | S2 |
| P5-P6-P8 | CC cases, align, notice, name; ANA source2 before extract; REF replacement follows myth in the same film; RET/SE follow their content by ≥1 beat with feedback. Phase-id order. No law yet; add. | H | MAP §4 | S2 map |
| P7 COST-MARK | A twin needs an earlier ENS/NF on the same engine; every intervention's cost is a mark, not words. Applies to all checks, not only TW. = P7 + CRIT§1 | H (C) | P7, CRIT§1 | both |
| P9-P11 | CAL needs PCR; PF only at Wield+; TRF is last, and its FAR case contains no word from the film's own vocabulary (generalise the agent regex to the film's glossary). | H | P9, P10, P11 | S2 |
| NO-DEGENERATE | A lever film must not be degenerate: per-step rates differ, budget < steps; INV after PCR and TW (soft). = INV + P12 | H / S | INV, P12 | S2 |
| ONE-NEW | ≤1 introduced term per phase; ≤1 module start per 10 s. | H | L3 | S1 |
| PICTURE-FIRST | A label follows its mark by ≥0.3 s. | H | L4 | S1 |
| NAME-LAST | Principle names at or after the payoff. | H | L5 | S1 |
| CUE | ≤1 cue live, ≤1.5 s each, after one uncued look. = L8 + HYG | H | L8, MAP | both |
| HOLD | Motion-free >3 s only as a declared 2-4 s hold ≤0.5 s after a payoff; holds ≥2 s after NF/ENS freeze. = L9 + MAP | H | L9 | both |
| RETURN | Last non-transfer module returns to the opening instance; retrieval ≥30 s after content; ≤1 RET per 40 s. TRF may follow it. Conflict L13 vs P10 resolved this way. | H | L13, P8 | both |
| HONESTY | Every module has non-empty honesty; Grasp and above carry both honesty runs (correlated failure, cost); union shown; MP4 commit caption says "pause". = L10 + AD v1 §0.6 | H (L10), S (two runs) | L10 | both |
| MAX | Content structures per film: Glance 2, Grasp 4, Wield 3 plus 1 priming, Master 5; ≤1 each of INV/PF/REF/NAR; ≤2 commits. Honesty, address, HYG, ENG, LAY do not count. Waivable. | S | MAX | S2 |
| VERBAL | Narration, or a burned label per introduced term (L12); captions ≤90 chars and ≥0.3 s; one channel per takeaway (voice plus labels, or captions only). | H / S | L12, CRIT redundancy | both |
| LEGIBLE | Must-read text (results, honesty, commit) ≥28 design units in the phone layout, ≥14 in a landscape-locked 16:9 page; unit declared per film; smallest type never carries a result. Gate at 400 px. 14 px of a 960 frame is 5.7 px on a 390 phone. | H | LEGIBLE, S1 floor, CRIT§4 | both |
| ROLE | One role per variable; no colour literal in module code; hue families fixed across Materials (copper mass/expected, peach address/error, sage saved/pass, slate structure); every mark kind declared in `markRule`, each mapping to a model quantity (today documentation only). = L6 + markRule | H | L6, AD §2 | both |
| HOUSE-LOOK | No shared structure-layer tic across sibling films (modal countdown, twin panels, header strip, closing slogan), and no banned default. Token scan plus batch dHash of hero frames [prop]. | S | JUROR §2 | crit |
| DOCTRINE | Per-frame tests with times cited: mark rule, address, ruler, silence, impossibility, thumbnail, etymology. Human at crit; ruler scriptable. | S | AD v1 §2 | S2 |
| CHANNEL | Projection only (cannot invent a number): dominant element ≥35 % of safe area, no repeated state (dHash ≤12/256), type minima, brand line once. | H | CHANNELS | S1 |
| EVIDENCE | On-device rows only, no identity, no free text. | S | MAP §5 | S2 |

Conflicts resolved: L13 vs P10 (RETURN), L11 vs MAX (REQ-PRED), 14 px vs 28 u (LEGIBLE), and S1 chrome-dependent role hues (notebook machine = blue) vs AM fixed meaning: AM wins, since meaning must survive the ground; S1's machine/person roles stay as optional extra variables.

## (b) Unified catalogue of teaching structures

Neutral ports. Data: `Trials` (N units, ordered steps, outcomes), `Trial`, `Focus` (unit, step), `Arrangement` (layout, anchors, frozen), `Commit` (family@key), `Number`, `Cost`, `Mix`, `Evidence`. Learner flags: gap, committed, dissatisfied, parts, instance, rule, magnitude. Nodes declare both kinds; TYPE checks both.

The trial interface (R4 §6). The plugin must define an `Engine` contract so no module names "agent", "check", "retry", "p^k": `units(n, seed)`, `outcome(unit, condition)`, `address(unit)` (first failing step or null), `events(unit)`, closed-form `truth(q)` with sd, `pair(a, b)` sharing draws, `cost(condition)`. Two shapes: sequence trials (survival; AgentLoop) and population trials (partition and condition; the base-rate cabs). A film's `@example` record is the engine's seed case.

| Structure | Grade, evidence | Base implementation | Ports (neutral) | Abstract away / fix |
|---|---|---|---|---|
| PCR | B; Richland pretest dz≈.6, Hake .48 vs .23 | S1 combinator shape (wraps any inner reveal) + AM commit typing and evidence row | needs gap or Trials; gives committed, Commit(f@k); reveals tagged f | Commit lives in the Material (marker, pencil), no modal; control default must not anchor; hold 4-8 s; page gate live, "pause" caption in MP4 |
| ENS + NF | ENS B (HOPs, quantile dots); NF A for students, n.s. for executives | AM ensembleRun (built, ordered rack = ruler) + S1 mass-reseat for conditioning | Trials, Arrangement -> Number(count), magnitude | Outcome model p^k and fixed N move into `Engine`. Mass-reseat is the population-shape NF; keep its "mark = 1/N of mass" audit |
| CF | B contested (Fyfe; Kaminski counter) | AM traceOpener + concretenessFade (built); S1 five-phase spec for the return | instance -> Trial, Focus, Arrangement -> rule | Trace is a hand-picked run; label it as one case; fix hard cut at u=5.6; text and "40 invoices" are fixtures |
| WE | A example, B fading | AM workedExampleFade (built) | parts -> instance, rule | Three hard-coded cases; take cases from `Engine`; drop for experts (`expertise`) |
| CONTRAST (CC + TW) | CC A (Alfieri d=.50, similarities-first 1.18); TW C (design argument) | S1 contrast-split (clone, run, align, differ, name) with AM contrastingTwins' CRN pairing | Trials x2 same draws -> Mix, Cost, rule | Twin = contrast with `pair:crn`. Grade of the pairing stays C; "4 slips in 5" is hard-coded copy |
| REF | A (Schroeder & Kucera, texts only) | S1 trap-and-correct (steelman, run wrong, break, right) | gap -> dissatisfied, rule | No Atelier code. Run the wrong model on the film's own case and never end on it; myth must not outshine fix |
| RET (+SE) | RET A; SE B, null inside WE | S1 recap-retrieve (built) | >=2 of {rule, instance, magnitude} -> retrieved | Feedback mandatory. SE folds in as a "why" variant at causal joints, never inside a WE |
| HON | n/a (doctrine) | AM correlatedCaveat + costOfCheck (built) | Trials -> sketch Number, Cost | rho=.3 and step 9 are sketch fixtures. Fix costOfCheck's wrong fraction label |
| TRF | B retrieval transfer, C far measure | AM transferQuestion | committed -> Commit, Number | Owns its own engine (breaks CRN); use `Engine` with a second case. Wield, Master only |
| INV | C | AM inverseProblemWield | Trials -> Commit, Number | p' formula bakes in "check"; toggles past budget silently ignored (fail loudly) |
| Scale and mechanism: zoom, chain, ladder | none, S1 [verify] | S1 zoom-journey, ladder-build (built) with AM cameras (closed-form) | instance -> magnitude, parts | zoom-journey = camera sequence + per-level bake. Compound-chain as a single run teaches linear 0.05k (AD v1 §0.1): demote it to the concrete step of CF, never the lesson |
| Feedback, tradeoff, scars | none | S1 specs (unbuilt); INV is the Wield form of tradeoff-frontier | parts -> rule | Ship as specs |
| Cameras (frameFocus, pullBack, addressZoom, rackFocus) | craft | AM camera module | Focus -> Mix | Fix `mix` equal-zoom no-pan bug; take aspect from layout |

Folded, not shipped as modules: CAL (C; a confidence field in PCR, no promised benefit), MER (a Material showing one quantity two ways), NAR (an archetype, not a module), HYG (laws CUE/HOLD/LEGIBLE). Specs only: PF (contested, g .22-.36, Wield, cap 1), ANA (needs scaffolding).

Drop: the countdown-modal, twin-panel, header-strip and shared-ending tics; hard-coded copy and numbers ("4 slips in 5", "tax ID", "14 sign-offs"); S1's phase fractions as evidence (they are proposals); S1's 8 unimplemented PO kinds; a selected run presented as typical; drifted code (truthUnderEvidence stage/layer mismatch, dead `mix` port); the "exact ±" runtime readout (atelier.js:742).

## (c) Selection procedure

1. Audience and level. Executive -> Glance, then Grasp; Manager -> Grasp, Wield; Non-technical -> Grasp; Technical -> Wield, Master. Caps: Glance 2, Grasp 4 (+ honesty), Wield 3+1, Master 5. Executives skip NF (ENS and a ruler instead). Technical: skip scaffolds flagged `expertise` (expertise reversal).
2. Type. Walk the Table 2 test sentences in S1 order (T8, T5, T4, T9, T6, T7, T1, T2, T11, T10, T3, T12); first true is primary, one secondary allowed.
3. Aha and misconception: one sentence each; is the misconception runnable on the film's own case?
4. Archetype (S1 Table 3, extended [prop]): T5 -> A2 if runnable, else A8; T8 -> A2; T4 -> A3; T1 -> A2 or A7; T2 -> A7; T3 -> A1; T6, T9 -> A5; T7 -> A12; T10 -> A11; T11 -> A9; T12 -> A4.
5. Structure spine (then apply precedence): T5: CF -> PCR -> ENS (+NF) -> CONTRAST/twin + cost -> HON -> RET. T8: PCR -> REF -> NF -> RET. T4: PCR -> zoom/chain -> RET. T1: ladder -> CF -> WE. T3: CONTRAST. T6: tradeoff -> INV. T7: REF + CC. Add REQ-PRED if the type needs a prediction.
6. Over the cap, drop in this order: second commit, SE variant, TRF, CF. Never drop HON, the first commit or COUNT-FIRST. Q-M2 is unanswered; this order is a default.
7. Beat graph: one node per structure; layers and `at` expressions as AM; durations from module `phases(P)` fractions; a stage hand-over needs a legal arrangement transition (same kind direct, different kind via ≥0.9 s morph).
8. Compile, lint (all hard laws), fix, then gate (PURE, LAYOUT 400, META, ENGINE, CAPTIONS), render stills, run the two critics (craft juror, pedagogy critic with veto).

System 2's caps contradict its matrix (R14 §3). Decision: caps are law; the audience matrix is derived by steps 1-6, never hand-filled. Its Glance cells (exec, manager, non-tech) hold three structures against a cap of two. Non-tech Wield holds four against the map's "three plus one priming" and AM MAX's flat 4: unified cap is 3+1. Manager Grasp puts TW before ENS (breaks P7), non-tech Wield has TW without ENS/NF, and INV precedes TW (breaks P12): all invalid. AM's own demo has five content structures at Grasp (CF, PCR, ENS, TW, TRF) under a waiver; fix by moving TRF to Wield/Master, leaving four.

## (d) Drawing models reconciled

System 1: a frozen persistent object (geometry, anchors, state) handed from module to module; SVG for text, labels and diagrams at 960x540; p5 Canvas2D mass layers (each mark = 1/N of the mass); roles table resolves colour. System 2: one Material owns every pixel behind verbs (`units/mark/line/area/text/num/anchor/begin/end/voice`); modules never draw.

The lasting abstraction is the Material verb interface: it enforces one look per film (F2), puts the belief and legibility guards at one choke point, and was proven by one graph on two Materials. System 1's persistent object survives as data, not drawing: it is the `Arrangement` port (geometry plus anchors, frozen, constant id), which AM's `layout` and `stepPoint` already approximate. Its 4 built kinds (track, grid, axis, chain) become Material layout kinds.

SVG-with-labels maps to one Material ("ink") with two surfaces: `text` and `num` write SVG text (crisp at phone width, which fixes the legibility defects every canvas film had); `units/mark/line/area` write a canvas mass layer. The roles table becomes the Material's `markRule` made mechanical: variable -> role -> colour, resolved only inside the Material. The p5 layer's `means` string is the markRule sentence. Any other Material (stitch, plate, pen...) implements the same verbs on canvas only. The plugin ships "ink" as the default CETI Material; each art direction is an optional Material, not a new runtime.

## (e) Open questions for Manu

1. (Q-M1) Do you talk over the film or must it stand alone with captions? Decides VERBAL and the audio gate.
2. (Q-M2) If Grasp must drop a beat, which goes first: transfer, second commit, or honesty? Default above guesses.
3. (Q-M3) Voice, music bed, or only the sound of the material?
4. (Q-M4) First room: execs, managers or engineers? Decides level and NF.
5. (Q-M5) Opt-in cohort counters of guesses above truth? Decides EVIDENCE.
6. (Q-M6) How much "sketch" can a slide carry before a CFO distrusts the numbers?
7. (Q-M7) Next concept after the agent loop: tokens, embeddings, correlated risk, ROI? Decides which T-types to harden.
8. (Q-M8) May a film end on a brand card, or on its material's own last image?
9. When the craft winner is partly false (marbling native), may truth veto always outrank the juror?
10. Is landscape 960x540 the basis, or phone portrait first (reel, LinkedIn video)?
11. Are the invoice Trace ("Acme Corp" vs "ACME Corporation") and p=.95 the canonical CETI fixtures, or must each concept bring its own?
12. How many Materials (art directions) should the plugin ship, one default or several?
13. Will you run the untested experiments (static vs animated, PCR on/off) on a real cohort?
14. Is a page-gated commit acceptable live when the MP4 cannot pause?
15. Should executives still get natural frequencies, given the evidence shows no help for them?
