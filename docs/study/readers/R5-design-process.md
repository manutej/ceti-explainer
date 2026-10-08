# R5 — Design process (Explainer Atelier)

Sources: BRIEF (91e15fe3), BUILDER (fbf65b3e), AD v0 (16aedd92), AD v1 (7179e1dc) in `/root/.claude/uploads/6930f3f9-…/`; INTERVIEW.md in `scratchpad/up3/modules/`.

## 1. Brief: fixed decisions and constraints
- **Keep the clock, free the look.** Every frame is a pure function of (t, state, seed); paused == playing; live page and MP4 are the same film. Visuals fully open (WEBGL, shaders, 3D); physics only if deterministic.
- **Slate:** Boardroom (execs), Field Notebook (non-technical; predict-commit-reveal), Living Systems (emergence), Little Worlds (public; "illustrated dioramas, metaphor characters"), plus new chromes that are "stunning, beautiful, unique".
- **Proof is both:** one shared concept in every chrome, plus one native concept per chrome.
- **Shared concept:** "What an AI agent actually does" (plan, act, observe, check, repeat/stop); 0.95^k (10 steps ≈ 60%, 20 ≈ 36%). Numbers computed, never invented; illustrative values labelled "sketch".
- **Ladder in every chrome:** Glance (~30 s) → Grasp (~2 min) → Wield (viewer acts) → Master (explorable).
- **Machine:** 2 CPUs, 7 GB, headless Chromium + SwiftShader, no GPU. WEBGL ≤720p. No CDN fetches from the shell.
- **IP:** no known characters, logos, or studio signature looks.
- **House habits to avoid:** cream + hairline + one vermilion; CETI-dark as the only dark; framed object on an empty page.

## 2. Builder contract (BUILDER)
Role: lead motion designer and TD for one direction, two films. "Generic output is failure."
- **Deliverables** in `chromes/<id>/`: `NOTES.md` (written first, ≤700 words); `shared.film.js` (glance, 25–35 s, 960×540, ensemble with twin worlds from `Atelier.AgentLoop`, failure address, commit control, captions ≤90 chars, score events); `native.film.js` (glance, 20–35 s, one Wield-style control); `<id>.kit.js`; `build/` (offline .html + .artifact.html); `out/` (gate JSON both PASS, contact sheets, MP4s with audio); `README.md` (≤500 words: Glance, Grasp, Wield, Master specs, weaknesses).
- **Process:** NOTES → first pass → build → gate → contact sheet → judge the image "like a festival juror" against AD v1 §2 → Iteration log → revise at least twice → native, same → MP4s last. Workers: 1 for stills, 2 only for the final MP4.
- **Rules:** `draw(p,t,ctx)` pure in (t, state, seed); no frameCount/Date/performance/Math.random in draw; precompute in setup. Semantic colours keep their meaning. No edits outside the folder; runtime bugs are worked around and reported (file, line, symptom).
- **Final message ≤220 words:** paths, gate results, strongest frame (time + why), what is still generic, runtime bugs, seconds/frame.

## 3. Art direction v0 → v1
**Changes and why (v1 §0):**
1. **Many runs, counted.** 0.95^k is a fact about whole runs; errors piling up inside one run teach linear 0.05·k, "the opposite lesson". Every shared hero is a 50–2,000-run ensemble, pass/fail per run. (v0 led with one run.)
2. **Twin worlds, common random numbers.** Checks off/on share the draw per (run, step), so the viewer sees which runs the check saved.
3. **Truth under evidence.** Exact DP curve drawn faintly, √N band, "realised 703 vs expected 717 ± 21" shown; seeds never cherry-picked.
4. **Trace opens every Grasp** (concreteness fading).
5. **Cuts:** Ink Tank → Marbling (fluid sim replaced by closed-form comb maps); Colony → Sediment Delta; Paper Theatre → Bunraku; Typographic Matter → The Run.
6. **Two honesty beats in every Grasp:** correlated errors are worse; checks cost time and money.
Also: one engine-computed numbers table; the critic's five added tests; card rewrites (Ledger 40 → 100 job-pictograms plus a Wield; Margin one commit → two; Exposure becomes a convergence film).

**Doctrine (v1 §2).** Banned defaults: Perlin flow fields, additive-glow swarms, node-graph "neural nets", spinning polyhedra/orbit-around-nothing, matrix rain, gradient blobs, typewriter reveals, random pastel Voronoi, noise-wobble, sparkles-as-data, robot/brain icons, the H1 habit, H6 framed object. Positive tests:
- **Mark rule:** "each mark is one ___" is true for every element.
- **Impossibility:** one moment no DOM/SVG tween could make.
- **Belief:** the key number is produced by the marks, not typed.
- **Silence:** with captions off, the idea is still narratable from motion.
- **Batch:** recognisably a different film beside the others.
- **Ruler:** key figure readable from geometry with numerals hidden.
- **Thumbnail anonymity:** at 320 px, no text, must not read as "about AI".
- **Address:** show where the failure happened.
- **Etymology ban:** no metaphor from the term's own name (diffusion→ink, agent→ant, token→coin) unless the mark rule survives without the pun.
- **One kernel per film:** no shared sim core or mark grammar.

**CETI invariants (§3):** copper #CE9A6A = mass/probability; sage #8FA985 = verified/pass; peach #D88B5C = error/cost; slate #6E8CA8 = structure. Meaning fixed, ground free. Type default Fraunces / DM Sans / Space Mono.

**Eight cards, one line each:**
- **A Escapement** (WEBGL): sectioned Graham-deadbeat movement; bank of 50 runs 20 ticks; slips stop at the tooth; sage pawl re-strikes. Native: handoffs as gear meshes.
- **B Marbling** (Canvas2D): 48 trays combed by 20 invertible passes; a stray drop propagates; sage skimmer lifts 80%. Native: un-combing, one noise, three pictures.
- **C Sediment Delta**: 2,000 grains through 20 weirs; failures settle where they failed; bank silhouette is 0.95^k. Native: correlated failure from one landslide.
- **D Ledger** (Canvas2D): 100 job-pictograms; failed jobs drop whole; ≈60 clean (expected 59.9). Wield: 12 review-hours, reach ≥32 of 40. Native: honest AI ROI.
- **E Margin** (graph paper): spring-mass pen; commit → 36%, add a check → 79%. Native: why AI sounds confident when wrong.
- **F Bunraku** (WEBGL 2.5D): cut-paper puppets; operators are plan, act, check; crane over 50 stages (≈18 vs ≈39 lit). Native: what changes on a team.
- **G The Run** (knitted): 2,000×20 swatch; dropped stitch ladders; sage hook darns (≈717 vs ≈1,571). Native: tokens and the context window.
- **H Exposure** (Prussian blue): 2,000 threads onto a Float32 plate; convergence 10→100→2,000 under the exact field. Native: embeddings, drag a query.

**Differentiation (v1 §6):** eight rows (ground, dim, material, kernel, teaching move, audience) that must hold on the contact sheet. Only A (3D) and F (2.5D) leave 2D.

**Ladder (§7):** Glance is built now (shared and native). Grasp and Master are specified in each README and deferred to a flagship after the crit round.

**Reserve (§5):** Typographic Matter; Labanotation; space-time cube of twin worlds.

## 4. INTERVIEW.md
**How it works.** 72 slots in a tree, depth budget 4, root `() → module-library`. Each node holds a collapsed valuation (what the studio claims) and deep children that compose upward by a stated rule, evidence-tagged with `path:line`. Where both exist, the gap is a FINDING. Blank slots count as data. Nine ★ questions form the minimum viable interview.

**B. Composed root = module-library spec.**
1. **Material interface (Q2):** `{id, axis, cell, nRange, layout, units, mark, line, area, text, num, anchor, voice}`; kernels wrapped intact: stitch, plate, pen, isotype, maps, sediment, gear.
2. **Pedagogy modules (Q1, Q4, Q5), never draw:** traceOpener, concretenessFade, predictCommitReveal, ensembleRun, failureAddress, truthUnderEvidence, contrastingTwins, costOfCheck, correlatedCaveat, transferQuestion, inverseProblemWield, workedExampleFade.
3. **Camera (Q3), closed-form in t:** hold, pullBack (log zoom), crane, addressZoom, rackFocus.
4. **Ports (Q6, Q7):** 14 px floor for must-read text; digits declared given or sketch; semantic sound events re-voiced by the material.
5. **Composer (Q8):** compose.js and check.mjs share one law file: typing, same-seed twins, graded precedence (hard), [inf] maxima (soft, waiver), capacity, static clock scan, no-draw-outside-material.

**Findings (collapsed → composed):**
- **F1 (Q1.4):** Trace→ensemble→twins→truth→cost→honesty→transfer Grasp (AD:15–20). Composed: content budget ≤4 [inf] (MAP:99); the sequence needs 5.
- **F2 (Q2.4/Q8.4):** "one kernel per film" (AD:44). Composed: the house look is four pedagogy-layer beats (countdown modal, twin panels, header strip, shared ending), re-typed per film; no kernel is shared.
- **F3 (Q4.1.1):** "use expected" (PC:31). Composed: atelier.js:742 still prints `exact … ± …` on every live page.
- **F4 (Q4.1.2):** seeds never cherry-picked (AD:14). Composed: the juror said "pick seeds within 0.5 sd" (JUR:85); ledger kept a lucky seed 1 (ledger/N:55).
- **F5 (Q3.2):** "twin bank/wall/river/ledger/swatch" (panels). Composed: every passing revision draws the twin as a correction of one object (escapement/N:56, ledger/N:59, margin/N:74, exposure/N:61).
- **F6 (Q4.3):** checks cost time and money (AD:20). Composed: no engine cost model; four units invented; only "steps done twice" is computable (atelier.js:282).
- **F7 (Q2.3):** "50–2,000 runs" for every film (AD:8). Composed: capacity is per material (48, 50, 100, 2,000).
- **F8 (Q1.1.1):** Trace opens every Grasp (AD:15). Composed: 0 of 8 directions built a Grasp or Trace; deferred (AD:193).
- **F9 (Q6.2):** percentages first (AD §4E). Composed: MAP:80 says counts before percentages; margin asks for a percentage first (margin/shared.film.js:38).
- **F10 (Q8.3):** six banned tokens guarantee the clock law (RT:5–7). Composed: the two purity failures came from canvas sampling and shader derivatives (margin/N:84, bunraku/N:57), which no token scan sees.

**D. Questions for Manu (verbatim):**
1. **Q-M1 ★** When you show one of these films to a room, are you talking over it, or does it have to stand on its own with captions? Think of the last session where you played a video: what did you do while it ran?
2. **Q-M2 ★** If a two-minute Grasp has to drop one beat to stay at four structures, which one goes first: the transfer question, the second commit, or the honesty beat?
3. **Q-M3** Picture the CETI film you'd be proudest to send a client. Does it have a voice, a music bed, or just the sound of the material?
4. **Q-M4 ★** Which room is first in line for a Grasp: the execs who want money, the managers who own a workflow, or the engineers who want the model?
5. **Q-M5** Would you ever want to see, across a cohort, how many people guessed above the truth? Opt-in counters only, never an individual.
6. **Q-M6** In an exec room, how much "sketch" can a slide carry before they stop trusting the numbers? Recall the last time a CFO pushed back on an illustrative figure.
7. **Q-M7** After the agent loop, what's the next concept you'll teach with these films? Tokens, embeddings, correlated risk, ROI?
8. **Q-M8** May a CETI film end on a brand card, or must every film end on its material's own last image?

**E. Coverage.** 63 of 72 valued from evidence; 4 `[inferred]` (Q2.2, Q2.4, Q8.1.1, Q8.1.3); 5 hold a part for Manu (Q1.4, Q4.4, Q5.3, Q6.3, and Q7.3, wholly empty). 9 of 9 ★ answered from evidence. Weakest subtree: Q7 (sound), which no crit graded. The cold-root check disagrees by design; that gap is F2. The file cites a treelint PASS, but only says "see README"; unverified.

## 5. Model routing and wave notes
- **Brief:** Fable 5.1 for art direction, design and crit (short, single-pass); Opus for building; the main session coordinates.
- **BUILDER:** read `runtime/README.md` "Notes from wave 1" and wave-1 folders under `chromes/` for working patterns, but the look must differ. Teams share the 2 CPUs with three others.
- **Tensions:** AD v1 §5 reserves Typographic Matter for the tokens native, but The Run already takes tokens. The brief's "metaphor characters" for Little Worlds conflicts with Bunraku's no-faces rule.

## Core ideas that should survive into a master plugin
1. **The interview instrument:** per-node collapsed vs composed, explicit compose rules, FINDINGs with "back to respondent", blank = data. F2 surfaced only this way.
2. **The juror loop:** render 8–10 stills, judge the image against written doctrine, log it, revise at least twice before any MP4.
3. **Doctrine as checkable positive tests** on a still, plus a banned-defaults list.
4. **Engine-only numbers:** a typed Number (exact/expected/realised/sd/N/source); "expected", not "exact"; no re-rolling seeds by outcome.
5. **Clock law** (frame = f(t, state, seed)) with a re-seek/order gate, verified empirically, since source scans miss pixel-level leaks (F10).
6. **Modules never draw;** one material per film draws everything. This is the structural answer to F2.
7. **Semantic colour fixed across grounds;** ground and material free per chrome.
8. **Ladder levels as views of one concept module,** not separate films.
9. **Build-time laws:** graded precedence is hard, budgets are soft with a written waiver; capacity is a material property (F7).
10. **Ownership and reporting:** no edits outside the folder, runtime bugs reported as file:line, bounded deliverables.

## Experiment-specific choices
- The eight directions, materials and kernels, and the slate mapping (Boardroom, Field Notebook, Living Systems, Little Worlds).
- The numbers (p = 0.95, c = 0.8, k 5–40, 2,000 runs, 717/1,571, 36%/79%) and the invoice-reconciliation Trace.
- CETI palette values, Fraunces / DM Sans / Space Mono, and the H1/H6 house habits.
- 960×540, 30 fps, 25–35 s Glance durations, ~2-min Grasp, 720p WEBGL cap, 2-CPU SwiftShader limits.
- Fable 5.1 / Opus routing and the four-way worker split.
- The 72-node tree's content, Manu's Q-M1–M8, and the Marbling / Delta / Bunraku / Run cuts.
