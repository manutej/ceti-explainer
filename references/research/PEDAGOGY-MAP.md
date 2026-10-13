# PEDAGOGY-MAP: from four research lanes to typed modules

**Source keys.** `L1-X` = PED-L1 structure X (A–M). `L2§n` = PED-L2 section. `L3-Rn` = L3 rule n; `L3-Sn` = L3 source; `L3§3` = probability pattern. `L4-In` = L4 interaction n; `L4§` = L4 finding. `AD§n` = ART-DIRECTION-v1. `CRIT§n` / `CRIT-dn` = PEDAGOGY-CRIT section / numbers defect. **[inf]** = my inference, untested.
**Grades.** A = meta-analysis or several convergent studies in a relevant population. B = meta-analysis in an adjacent population, or consistent small studies, or contested. C = framework, practitioner claim or inference.
**Lane conflicts, resolved without new search.** (1) Animation vs static: g 0.23 (L1) vs d 0.37 (L2/L3). Different meta-analyses, so both say "weak lever; interaction and method matter". (2) Productive failure: g 0.36 (L1-E) vs g 0.22, ns, and 0.6 after bias correction (L4§). Graded B, contested. (3) Natural frequencies: strong in students (L3-S13: 42% vs 5%), weak for executives (36.2% vs 26.6%, p=.095, L1-K). So the visual must do the arithmetic. (4) Self-explanation g 0.55 (L1-J) vs no gain when added to worked examples (L1-B). Graded B, restricted to causal joints.

---

## 1. Structures we need (18)

| ID | Structure | One-line definition | Grade, source | Boundary conditions |
|---|---|---|---|---|
| HYG | CTML hygiene | Coherence, signalling, segmenting, pre-training as substrate | A, L1-A, L3-S1–S4 | Weaker for experts (segmenting, pre-training); decoration d≈−0.05 (L3§1.2) |
| NF | Natural-frequency array | Counts of a concrete population, not probabilities | A, L1-K, L3-S13 | Gain smaller for managers, ns for executives; percentage only after counts |
| ENS | Ensemble: sample, land, stack, freeze | Seeded draws leave dots, resolve to a ~50-dot quantile plot | B, L3§3, S10–S12; persistent landing = [inf] | HOP gain is for 2–3 quantities; frame duration and count untested |
| PCR | Predict–commit–reveal | Reasoned guess locked before the outcome; guess stays beside truth. Variant `cold`: asked before teaching | B, L1-F, L4§ (pretesting dz≈0.6), L4-I1/I3 | Needs a counter-intuitive case; confirmed guesses teach little; passive MP4 only simulates commitment |
| CAL | Confidence wager and calibration | One-tap confidence; extra time on high-confidence misses | C, L4§ (hypercorrection small, mixed), L4-I2 | No evidence a calibration display itself helps; log it, don't promise it; older adults showed no effect |
| CF | Concreteness fading | Same object morphs concrete → schematic → symbol | B, L1-C | Counter-evidence (Kaminski 2008); experts may skip the middle |
| WE | Worked example → fading | Full case, then backward-faded gaps | A (example, g=.48), B (fading), L1-B | Expertise reversal; maths evidence; procedures, not concepts |
| CC | Contrasting cases | Minimally different cases side by side, principle named after | A, L1-D (d=.50, 336 tests) | Cases must differ only in critical features; similarities-first beat differences-only |
| PF | Productive failure | Attempt an unfamiliar problem, then canonical instruction | B (contested), L1-E, L4§ | Conceptual, not procedural; adults; needs some prior knowledge; unenforceable in passive video |
| REF | Refutation | State the myth, flag it, replace it with a working mechanism | A, L1-G (g=.41, 44 comp.) | Needs replacement mechanism; myth must not outshine fix |
| ANA | Analogical mapping | Two analogs, explicit role mapping, marked break | B, L1-H | One unscaffolded analog does not help |
| RET | Retrieval and spaced return | Blank a key element, recall, get feedback; revisit at 2 d / 2 w / 6 w | A (testing g≈.5–.67), L1-I, L4§; spacing intervals [inf] | Needs feedback; mechanism, not trivia; film is one exposure |
| SE | Self-explanation | Pause at a causal joint, learner explains, compare to expert | B, L1-J | Self-generated beats MC selection; null inside worked examples |
| MER | Multiple representations with LINK | One view per beat, drawn connector between views | C, L1-L (DeFT) | Translation load; each view must add something |
| NAR | Narrative spine | Goal, attempt, complication, insight, resolution | B, L1-M (g=.55 text, heterogeneous) | Story must be the mechanism; seductive details (58 studies) |
| TW | Twin worlds | Same draw per (run, step) with and without the intervention; saved runs highlighted | C, AD§0.2, L3§3 (design argument, no controlled study) | Cost must be shown as a mark; correlated failure not caught by checks reading the same source (CRIT§3C) |
| INV | Inverse / intervene-and-forecast | Hit a target by dialling or placing a check, forecasting first | C (ICAP "constructive" is B, L4§), L4-I5/I8 | Task must be non-degenerate (CRIT-d10); sliders that only animate are decoration |
| TRF | Transfer capstone | Near item, then far item with new skin, same structure, no cue | B (retrieval transfer), C (far-transfer measure), L4-I11 | Confounded if the far item gives itself away |

Glance and Grasp may be film; Wield and Master must hand over controls (L2§0, L1).

---

## 2. Structure → typed module requirements

**Ports.** `K` kernel (seeded, exact truth function; clock law `f(t,state,seed)`, AD§3). `V` value. `C` ∈ {lo,mid,hi}. `L` viewer ledger (append-only commits). `T` persistent trace (marks that stay). `E` evidence row (§5). Signature: `In → Out [writes; logs]`. Common timing law: every beat boundary is a HOLD ≥2 s and a visible tick (L3-R7); one focal change at a time (L3-R4); any transient stage ≤~1 s, ≤2 stages (L3-R17); every beat seekable (L3-R8).

| ID | Beat pattern | In → Out [writes; logs] | Timing | Trace | Visual must never |
|---|---|---|---|---|---|
| HYG | NAME(parts, 5–10 s) → SIGNAL(1 cue, after one uncued look) → HOLD → UNSIGNAL | Beats, focus F → Beats+ticks | HOLD ≥2 s; cue removed after use | Chapter ticks | Decorate; duplicate narration in text; cue entities only (cue the relation, L3-R10); camera moves hiding the referent |
| NF | POP(100) → SPLIT(per step, live integer) → SURVIVORS(int) → PCT | K(p,k,seed) → survivor set [T] | HOLD ≥2 s on SURVIVORS | Peeled dots keep step address | Show % first; change the reference class; draw uncountable dots (group in tens); use two encodings (screen "36 of 100", caption "a third", CRIT-d3) |
| ENS | SAMPLE(≤3 draws side by side) → LAND(dot per outcome) → STACK → FREEZE(~50 dots) → OVERLAY(exact, "computed") | K(seed,p,k) → dotplot [T]; expected, realised | FREEZE HOLD ≥2 s; HOP frame rate: test | Landed dots | Use one run as the message; cherry-pick seed; write "exact ±" (use *expected*, CRIT-d2); show realised without expected |
| PCR | PROMPT(Q, 2–4 options or slider) → COMMIT(v) → HOLD(4–8 s, visible countdown) → REVEAL(K truth) → GAP(\|v−truth\| drawn) → EXPLAIN | K, Q → [L += (v,t); T = viewer mark; logs E]. `cold`: REVEAL deferred to a payoff beat | Hold 4–8 s; reveal at slow tempo; passive MP4: narrator voices the common guess | Viewer mark stays through EXPLAIN | Display any anchoring number before COMMIT (CRIT-d9: "7 of 10 cleared" before the commit); hold <4 s; pick a case where intuition is right |
| CAL | COMMIT(v) → WAGER(C, one tap) → REVEAL → GAP → LINGER → TALLY(conf vs correct) | L entry → calibration counts [L; E] | LINGER ≥2× GAP on hi-conf miss [inf] | Tally strip | Show a score, points or leaderboard (L4§ gamification); stage the AI's doubt as the lesson (CRIT§3E) |
| CF | CONCRETE → MORPH → SCHEMATIC → SYMBOL(+link labels) | Scene geometry shared across stages → symbol binding map | HOLD ≥2 s per stage; morph ≤2 sub-stages | Same marks persist | Cut instead of morph; morph unrelated marks (L3-R17); leave rich art unstripped; show a symbol with no mapped referent |
| WE | FULL(whole case visible) → GAP1(last step blank, "yours" style) → HOLD → FILL → TWO-GAPS(new case) | Procedure P, 2 cases → [L += fills; E] | Gap HOLD 3–5 s [inf from L1-I] | "Given" vs "yours" styling | Drip-reveal the case; fade too fast; use a single example; gap with no consequence |
| CC | CASE-A ‖ CASE-B(aligned, same scale, same axes) → ALIGN(pairs glow, one at a time) → NOTICE → HOLD(≥3 s [inf]) → NAME | Two cases differing in critical features → principle label | HOLD after NOTICE | Both cases remain | Present sequentially; differ in many ways; name the principle before NOTICE |
| PF | PROBLEM → COMMIT(attempt) → COMPARE(3, incl. flawed) → GAP(where each breaks) → CANON(reuses attempts) | Fully specified problem, K → [L; E] | Attempt hold ≥ PCR hold, "your move" frame | Attempt log | Give the canonical answer first; skip consolidation; run on procedures |
| REF | MYTH(believable speaker, distinct treatment) → FLAG → REPLACE(mechanism does the work) → CONTRAST | Claim m, K → refuted-claim flag | HOLD ≥2 s at CONTRAST | Wrong and right side by side | Make myth richer than fix; end on the myth; put a face on the AI (L2§3) |
| ANA | SRC → TGT → MAP(pairs one at a time, matched position/colour/motion) → SRC2 → EXTRACT → BREAK(marked) | Two scenes, role map → shared structure | HOLD per pair | Map lines | Use surface-only metaphors (AD etymology ban); leave the map implicit; leave the break unmarked |
| RET | BLANK(3–5 s) → RECALL → REVEAL+feedback; later RETURN(new numbers) | Prior beat's element → [L; E]; return-item bank | ≤1 per 40 s (L4-I4) | Blanked label restored | Omit feedback; ask trivia; ask a rhetorical question with no response channel |
| SE | JOINT(causal step shown) → WHY(≥5 s [inf]) → EXPERT | Causal link ℓ → [L; E] | WHY hold ≥5 s | Link highlighted | Prompt on definitions; prompt often; give MC choices; omit the expert answer |
| MER | VIEW1 → LINK(connector, one value↔mark) → VIEW2 | Two views, mapping m → linked pair | HOLD at LINK | Connector | Show 4 panels; repeat the same info; leave mapping implicit |
| NAR | GOAL → ATTEMPT → COMPLICATION → INSIGHT → RESOLUTION | Concept as plot | Per beat | — | Make plot irrelevant to mechanism; use humour mid-chain |
| TW | RUN-A(off) ‖ RUN-B(on, same draw per (run,step)) → DIFF(saved runs lit) → COST(mark + number) | K(seed,p,c,cost) → saved set, cost ledger | HOLD ≥2 s on DIFF | Saved ids, cost bar | Use different seeds; state cost only in words (CRIT§1); say checks catch shared-cause errors |
| INV | GOAL(target band) → DIAL/PLACE(first move logged) → FORECAST → RUN(seeded) → GAP | Invertible K with varied per-step p, budget → [L: first move, n moves, final, forecast error; E] | No time limit; Reset visible (L3-R15) | Move history | Ship a degenerate task (uniform p commutes, budget buys everything, CRIT-d10); unbounded ranges |
| TRF | NEAR → FAR(new skin, no cue) → COMMIT(v,C) → LEVER(choose) → REVEAL | Same structure, new params → [model-consistent flag; E] | PCR hold | Both forecasts | Mention "agents" or hint at the structure in FAR; show a total score |

---

## 3. Audience × ladder matrix

Order is left to right; HYG wraps every cell (omit pre-training for technical). Cells follow L2§1–4, L2§7.

| | Glance (~30 s) | Grasp (~2 min) | Wield | Master |
|---|---|---|---|---|
| **Exec** | PCR(cold, in dollars) → NF → TW (cost as mark); "sketch" label | On pull only: CF (stop at SCHEMATIC) → ENS → NF → TW | PCR → INV as scenario (2–3 levers, money outcome, decision at end) | TRF one-page model with ranges and downside (ENS) |
| **Manager** | NAR(workflow vignette, surprise) → PCR → NF | WE(one workflow, visible human gate) → TW → ENS(same prompt, different outputs) | PCR → INV(place checks) → RET | TRF(swap in own process) |
| **Non-technical** | PCR(cold) → REF(one misconception) → NF; no faces | ANA(one analogy, then retire) → REF → CF | PCR+CAL → INV as safe break-it → TW | RET return card; curiosity-only TRF |
| **Technical** | 10-s header (HYG + NF figure) or skip | CC → MER(LINK) → ENS (real terms, no novice scaffolds) | PCR → INV(seed, perturb, failure injection) → SE | Full explorable: ENS + MER + TRF, show model and code |

---

## 4. Composition rules

**Precedence (A ▷ B means A before B).**
1. PCR ▷ REVEAL of that quantity; no anchoring number before COMMIT. (L1-F, CRIT-d9)
2. ENS ▷ NF ▷ percentage. (L1-K, L3§3)
3. CF: concrete ▷ morph ▷ schematic ▷ symbol, never reversed. (L1-C)
4. WE: FULL ▷ GAP1 ▷ TWO-GAPS ▷ INV or RET on the same procedure. (L1-B)
5. CC: cases ▷ ALIGN ▷ NOTICE ▷ NAME. ANA: SRC2 ▷ EXTRACT ▷ BREAK. (L1-D, L1-H)
6. REF: REPLACE must follow MYTH within the same film. (L1-G)
7. TW ▷ needs ENS or NF upstream (same seed) and COST as a mark. (CRIT§1)
8. RET and SE come after the content they test; ≥1 beat gap; feedback mandatory. (L1-I, L1-J)
9. CAL requires PCR; the tally follows REVEAL. (L4§)
10. TRF is last; FAR is never cued. (L4-I11)
11. PF only at Wield or above, before any EXPLAIN of that concept. (L1-E)
12. INV after PCR and TW so the learner has a model to invert. [inf]

**Conflicts (choose one per concept).**
- PF vs WE: concept → PF; procedure → WE. (L1-B, L1-E)
- CC vs ANA at the same beat: both are comparison, split attention. [inf]
- NAR vs REF: a story wrapper around a refutation brings seductive-detail risk. (L1-M)
- MER vs CF in one beat: CF needs one object; MER needs two views. [inf]
- Cold PCR vs a Glance that already states the answer in the title or caption.

**Maximums per film [inf, from L3-R4, L2§7a].** One claim or misconception per film. Content structures excluding HYG: Glance ≤2, Grasp ≤4, Wield ≤3 plus one priming, Master ≤5. At most one each of INV, PF, REF, NAR. RET ≤1 per 40 s. SE ≤2 per film. PCR ≤2 per film (AD§4E uses two commits; the second must be a different quantity).

---

## 5. Evidence-of-understanding spec

**Logged at every Wield/Master interaction (on device; choices, confidences, timings, counts only; no identity, no free text, L4§).**
`{film_id, build_hash, seed, level, structure_id, item_id, claim_id, t_prompt, t_commit, value, conf, truth, signed_error, first_move, n_moves, final, curve_class, hint_used, skipped, days_since_exposure}`
- Per interaction a three-line evidence map: claim · observable · rule (L4§ stealth assessment).
- Per claim a Beta-style (hits, misses) count; no network.
- Derived: calibration table (conf × correct), curve class (linear / flat / exponential) for draw-the-curve items, guess update after a changed parameter (k=10 → k=20).
- The learner sees their own calibration; export is opt-in aggregate counters only; never an individual trace; never a "score" from n≈3 items (L4§).
- Inference: log `exposure_variant` (cold vs warm PCR) so the pretest effect can be separated.

**Minimal transfer question pattern (TRF).**
`NEAR`: same story, new numbers, same skin → `COMMIT(v, C)`. `FAR`: new domain, same structure, no cue → `COMMIT(v, C)` → `LEVER(shorten / check / gate)` → `REVEAL` from K.
Pass = forecast within tolerance and in the right direction **and** lever consistent with the model (`model_consistent: bool`). Worked FAR from L4: expense approval, 14 steps at 97% (computed 65.3%), no mention of agents. Return card at ~2 d, 2 w, 6 w with new numbers (L4§; intervals [inf]); report as rates, never as a result.

---

## 6. Fifteen gate questions for a crit seat

1. Is there exactly one named claim or misconception, and does every beat serve it? (L2§7a)
2. Does the viewer commit (value, plus confidence at Wield) before any number that could anchor them? (L1-F, CRIT-d9)
3. Is the unit of truth the whole run, counted as "N of 100", with one encoding on screen and captions not repeating it? (AD§0.1, CRIT-d3)
4. Does every moving mark depict something? Does it still teach with the decorative layer removed? (L3-R2, AD§2)
5. Is every beat boundary a ≥2 s hold, and is every beat seekable and identical paused or playing? (L3-R7, R8)
6. Does any state the viewer must later compare leave a persistent trace? (L3-R6 [inf])
7. Can the key figure be read off geometry (ruler test), and is the smallest type free of results and honesty beats? (AD§2, CRIT§4)
8. Is the cost of a check a mark with a number, not only a word? (CRIT§1)
9. Are the order rules in §4 met: concreteness fading, example before gap, cases before name, myth followed by mechanism? (L1-B/C/D/G)
10. Is every number computed from the kernel or labelled "sketch", with *expected* beside realised and no cherry-picked seed? (AD§1, CRIT-d2)
11. Is the native concept true: no impossibility that teaches a falsehood, no inverted moral, honesty beats on independence and cost present? (CRIT§3, AD§0.6)
12. Is the cue relational, added after the first uncued look, and removed after use? (L3-R10, R12)
13. Does it fit the audience: novice scaffolds removable, money for execs, no face on the AI, legible with captions only? (L2§1–6)
14. Does the film hand off to doing: a Wield exists whose task is non-degenerate (placement matters) and has Reset? (L1 fact 2, CRIT-d10, L3-R15)
15. Does Wield/Master log §5 fields on device and include a far-transfer item, with learning claims limited to aggregates? (L4§)
