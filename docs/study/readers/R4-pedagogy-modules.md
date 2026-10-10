# R4 pedagogy modules and cameras

Scope: 14 modules, 5 cameras, _shared.js. Gl/Gr/Wi/Ma = Glance/Grasp/Wield/Master.

## 1. Modules

| Module (code · stage) | cls · grade · layer · levels | Ports; reveals/commits; dur(P) | build → draw (M.* calls) | Captions · controls · meta · evidence · score | Source |
|---|---|---|---|---|---|
| agentLoop (ENG) | engine · — · none · all | ∅ → ens; dur 0 | Calls AgentLoop(N,k,p,c,retry,seed) or reuses ctx.engine. draw: none. | none | runtime |
| traceOpener (CF · concrete) | content · B · stage · Gr Wi Ma | ens → trace, run, focus; dur = traceTimes(k,6).end+2.6 = 22.02 at k=20 | Picks first run with fOff=6, fOn<0, caught∋6; Focus = its rect. M.units, H.head, M.text sketch label, step-tag M.text + M.line leaders, M.mark address/save. | "Step 7 slips: 'Acme Corp' is not 'ACME Corporation'." · score: step per j, fail, save | AD-v1 §0.4, §4; MAP CF (B, L1-C) |
| concretenessFade (CF · morph) | content · B · stage · Gr Wi Ma | trace, ens → arr; dur 7 fixed | Siblings fade in by distance from the trace unit. M.units ×2, bandRules (M.line rule), H.head/H.sub. Flag: trace "reset" is a hard cut at u=5.6, not the morph its doc describes. | "Shrink that run to one mark and lay out N of them." | MAP CF |
| predictCommitReveal (PCR) | content · B · overlay · all four | ens → commit; commits survival.{w}@{k}; dur 8 fixed | H.head (k, p), H.sub, M.line rule, M.text 0/N labels, M.mark tick ×3, M.mark guess + "your guess" at 7.75. controls: commit slider 0..N, countdown 4 s, default 70 % of N (a possible anchor before commit). | "Your call first: k steps at p % each. How many of N finish?" · evidence PCR (t_prompt, t_commit, value, truth, signed_error, skipped) | MAP PCR (B; L1-F; pretest dz≈0.6) |
| gridLayout (LAY) | scaffold · — · none · all | ens → arr; dur 0 | H.grid folded grid. draw: none. | none | material geometry |
| ensembleRun (ENS, +NF) | content · B · stage · all | ens, arr, run? → arr, ens; reveals count:survival.{w}@step; dur 0.8+0.55k+1.8 (13.6 at k=20) | H.bandRules, H.drawRuns (M.units, lost, focus emphasis), M.num "still going after step j", M.mark address (via M.anchor). | "N runs, no check. Each one stops at the step where it slips." · score: step 0.55 each; fail gain min(1, 0.25+√n/10) | MAP ENS/NF (B; L3§3) |
| failureAddress (ENS · address) | scaffold · C · overlay · all | ens, arr → focus; dur 5 | Picks up to 3 failed runs nearest steps 2, k/2, k−2; Focus = first. M.mark address r8, M.num "step v". | "Every stop has an address: the step where that run failed." | AD §2 |
| truthUnderEvidence (ENS · overlay) | content · B · stage* · all | ens, arr, commit? → arr, n; reveals count:survival.{w}@{k}; dur 13 | Racks runs by survival; n = Number(realised, exact, sd). M.units lerp 0.3–3 s, M.line exact (3.2–5), M.text "computed", M.area band (5.2–6.2), M.line rule, H.countAt, guess M.mark + M.line gap + "your guess was X off". *Stage tag says overlay, layer says stage. | "Most guesses land well above the truth." (asserted) · meta 1 row | AD §0.3; MAP ENS; CRIT-d2 |
| contrastingTwins (TW · diff) | content · C · stage · all | ens, arr, mix? → arr, n, saved; reveals count:survival.on@k, count:saved@k; dur 16 | Checked rack; base = fOff+0.5 keeps unchecked failures failed. M.line ghost, M.units off→on (emph saved), lerp re-rack 8.8–11.2, M.line exact, M.area band, H.countAt, M.line link, M.num "N runs saved". Flag: mix port never read. | "…a check after every step catches 4 slips in 5." (hard-coded; c=0.8) · meta 2 rows | AD §0.2; INTERVIEW F5; MAP TW (C) |
| costOfCheck (TW · cost) | content · C · overlay · all | ens, arr → cost, n; reveals count:redone@k, percent:redone@k; dur 9 | M.mark cost per redo at its anchor; M.num "v steps done twice"; M.num share "v % more work than the unchecked runs"; M.text review-time note. Flag: frac = redone/executed in the checked world, so that label is wrong. | "Every caught slip is a step done twice." | CRIT §1; INTERVIEW F6 |
| correlatedCaveat (HON) | honesty · C · stage · Gr Wi Ma | ens, arr → ∅; dur 12 | Shared runs (ρ=0.3 by hash) fail at step 9 (shown as step 10) unless they failed earlier. Number source 'sketch'. M.units morph, H.head sketch, H.sub, H.countAt (expected hidden), two M.text. | "They all fail at the same step…" | AD §0.6; CRIT §3C |
| transferQuestion (TRF) | content · B · stage · Gr Wi Ma | ∅ → commit, n; commits transfer@kFar; reveals count:transfer@kFar; dur 19 | Owns its own AgentLoop (14 steps, p .97, N 100, c .8, seed+97), bypassing the shared engine. M.text ×3, M.units, bandRules, M.line rule/gap/exact, M.mark tick/guess, M.area band, H.countAt. controls: commit 0–100 (default 80 %); select lever (default 'shorten'). | "Computed: 0.97 multiplied 14 times." · meta 1 row · evidence TRF | MAP §5; L4-I11 |
| workedExampleFade (WE) | content · A · stage · Gr Wi | ens → ∅; dur 26 fixed | Cases: engine (0 gaps), 10 steps at p .9 (1 gap), 6 at p .8 (2 gaps); products p^j. M.units per 8 s segment, M.text heads and notes, M.num exact products (2 dp), M.text "?" for blanks. | "Your turn. Work out the last product before it appears." | MAP WE (A, g=.48; L1-B) |
| inverseProblemWield (INV) | content · C · stage · Wi Ma | ∅ → commit, n; commits inverse@budget; reveals count:inverse@budget; dur 16 | pSteps required; p' = p+(1−p)·c·p; best = top-budget by log(p'/p); seeded sim per placement. M.units (AM.items), M.mark save, H.countAt after 11.6 s. controls: one toggle per step (default = best ∧ even index), forecast commit. Toggles beyond budget are silently ignored. | "Place your checks where they buy the most." · evidence INV | MAP INV (C); CRIT-d10 |

## 2. Cameras (camera/cameras.js, closed-form in u)

- frameFocus: z = min(960/(w·m), 540/(h·m)), m = 1.25, centred on the focus; z pushes in by drift 1.04 over 20 s. Use: hold on the Trace's macro focus.
- pullBack: log-z mix (C.mix) from focus frame to identity (480, 270, z=1) over 6 s after a 0.6 s hold; the centre moves by screen-extent fraction so the focus stays in frame. Use: macro to mass.
- crane: minimum-jerk (ease.hand) between two {x, y, z} frames over 4 s. Unused in this slice.
- addressZoom: log-mix from identity to frame(focus, m=3): 25 % in, 50 % hold, 25 % out over 5 s. Use: push onto a failure address.
- rackFocus: holds `at`; outputs Mix = inOut(u/2). Use: onion-skin weight; contrastingTwins does not consume it.

## 3. THE TRACE (AM.TRACE_INVOICES, core/am.js:217–231)

- Goal: "Reconcile 40 invoices against purchase orders."
- Steps (0-indexed j): 0 plan, "match each invoice to its order"; 1 act, "call fetch_purchase_orders"; 2 observe, "the orders come back"; 3 check, "match invoices one by one"; 6 (step 7) fail, "'Acme Corp' ≠ 'ACME Corporation': totals mismatch"; 6 catch, "the check catches it: retry by tax ID"; 19 stop, "all matched: stop".
- Timing at k=20: slip 11.25 s, catch 13.15 s, end 19.42 s, dur 22.02 s.
- Flags: "40 invoices" against 20 steps, unexplained. "totals mismatch" describes a name mismatch. A selected run is what PEDAGOGY-MAP's ENS "don't" column warns against.

## 4. Content structure codes

- CF: concreteness fading (traceOpener, concretenessFade). PCR: predict, commit, reveal.
- ENS: ensemble, "sample, land, stack". TW: twin worlds, same draws with and without the check; cost as a mark.
- TRF: far-transfer question, new skin, no cue. INV: inverse problem, placing checks non-degenerately. WE: worked example with fading.
- HON: honesty, independence assumed. LAY: grid scaffold. ENG: the engine.
- NF: natural frequency, counts before percentages. No module; named in the ENS doc and law P2.
- CAL, PF, REF, ANA, CC, NAR, RET, SE, MER: no module implements any. Meanings per PEDAGOGY-MAP §1: confidence wager, productive failure, refutation, analogy, contrasting cases, narrative, retrieval, self-explanation, multiple representations.

## 5. Core ideas that should survive

- A typed beat graph with stage, overlay, camera and none layers, and ordering laws.
- Modules never draw; one Material draws through a small interface (units, mark, line, area, text, num, anchor).
- Closed-form clock: modules and cameras are pure in local time; hashes, not RNG.
- BELIEF: numbers reach the screen only as typed Numbers with a source, written "expected", never "exact ±".
- Common random numbers: twins and their ensemble share one engine node.
- Commit before reveal, with a countdown; the guess stays on the edge until the gap is drawn.
- Costs of checks as marks; correlated failure as a labelled sketch.

## 6. Experiment-specific choices (abstract these)

- The outcome model: survival product p^k, failStep/caught/retryOk, expected p^j, binomial sd. A library needs a trial interface: units, ordered steps, failure address, catch events, closed-form truth.
- "Check" means retry after check (c, retry); INV's p' formula bakes that in.
- Hard-coded copy and numbers: "4 slips in 5", "step 7/10", "14 sign-offs", "fetch_purchase_orders", "tax ID", "40 invoices".
- TRF builds its own engine with a fixed far case, bypassing the one-engine rule.
- Modules place screen text and leaders (traceOpener, costOfCheck, correlatedCaveat); cameras assume 960×540. That layout belongs to the Material.
- Controls with side effects on logged evidence: PCR's default at 70 % of N, TRF's preselected lever, INV's best-and-even default.
- Counts-only commits (integers 0..N); fixed N (40, 100, 200); fixed stage geometry (848×352 at 56,100).
- Drift: truthUnderEvidence stage/layer mismatch; contrastingTwins mix port dead; costOfCheck frac label; am.js:114 comment says exec adds one redo per catch, the code does not.
