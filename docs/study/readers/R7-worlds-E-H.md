# R7: Worlds E–H

Scope: lines 887–end and kits read; runtime not read. Realised values: screenshots or formulas.

## E · Margin (p2d)
Technique: single-line glyphs; 2/3 power-law hand; Dynadraw nib; dip-pen reservoir; Washburn bleed; ink oxidises; strokes baked to paper.
Mark rule: each mark is a timed pen gesture. Shared: line = run, loop = step, slip lifts the pen. Peach failure, sage caught.

**E1 margin-native** · 27 s · chapters 0 Draft; 11.3 Which is wrong?; 15.0 Reveal; 18.7 Mirror
Captions: "A toy model (a sketch) that only counts which words it has read together." · "In pencil it weighs the words; the shakier the draft, the less sure it is." · "In ink it writes the answer, in the same steady hand every time." · "The drafts are gone. Three confident answers. Which one is wrong?" · "The shaky one was right. The steady one was wrong. The ink never told you." · "People do it too: a guess can feel as sure as a fact." · "Fluency is not accuracy. Ask an AI to check its work, not how sure it sounds."
Control: `sydney` 0–20, default 14, jump 8.0, no commit. Engine: none; counts give 95, 60, 82%. Camera: 13 keys. Payoff: sage ticks on right answers, peach strike on Sydney. Address: the strike. Realised: deterministic; mirror's "truth: 36%" is hard-coded from the agent question. Sketch labels: 3.

**E2 margin-shared** · 34.5 s · chapters 0 Loop; 4.5 Your mark; 10.0 50 runs; 14.7 Curve; 19.6 Check; 24.3 Checked; 32 Price
Captions: "An AI agent works in a loop: plan, act, observe, check. One loop is one step." · "A job takes 20 steps, and each step goes right 95% of the time." · "Before the pen runs: what share of runs will finish? Mark it on the ruler." · "Fifty runs, one line each, longest first. Where a line stops, that step slipped." · "The line ends trace the curve: about 36% of runs make it to the end." · "Now a check after every step catches 4 slips in 5 and redoes the step. Guess again." · "Same runs, same slips. Each sage ring is a slip the check caught; the line carries on." · "About 79% now. Compare your pencil mark with where the curve lands." · "Each redo costs time: the lines run past the finish. The check is not free."
Controls: `guess1` commit 0–100, default 75, jump 10.0; `guess2` default 90, jump 24.3; 3 s countdown. Engine: AgentLoop N=50, k=20, p=.95, c=.8, retry 1; exact 35.8%, checked 78.5%. Camera: 23 keys. Address: peach cross at the line end.

## F · Bunraku (WebGL, cut paper)
Technique: one GLSL 300 es uber-shader (nine `#define` variants); RGBA32F data textures; cut-paper pyramid atlas; thin-lens DOF; analytic shadows from a 320×180 occlusion pass; Andersen–Pesavento–Wang (2005) RK4 plate ODE; raw GL via a p5 texture-handle patch.
Mark rule: one stage = run; one plank move = step; copper rod plan, slate act, sage check. A fall drops the job slip on the board cell where it fell; a caught move takes double time.

**F1 bunraku-native** · 34.5 s · chapters 0 Title; 3.6 Before; 8.9 Exchange; 14.0 One per stage; 21.4 One per three; 27.0 One per row; 32.0 Rods
Captions: "What changes on a team when AI arrives? Watch who holds which rod." · "Before: one person walks the plank — plans, acts, checks. People slip too (sketch)." · "After: the AI performs. The model plans, tools act, and the person takes the check rod." · "Fifty stages, one person at each check rod. Where a puppet falls, the curtain closes." · "Same fifty runs, same slips. Now each person checks three stages from above." · "One person per row. Sketch: attention splits evenly, so each catch is rarer." · "The work moved from the plank to the rods. How many rods can one hand hold?"
Control: `span` 1 / 2 / 5 / row, default row, jump 27.0; third run uses `spanWorld` (catch = c/k). Engine: AgentLoop as E2. Camera: crane to a 17.7° lens. Payoff: one person's rods across a row. Address: slip on the board. Sketch labels: 3.

**F2 bunraku-shared** · 35 s · chapters 0 Title; 3.8 Rods; 7.8 Performance; 13.7 Your call; 17.8 No check; 26.6 With check; 32.6 Curtain call
Captions: "One stage is one run of a task. The puppet is the work; it cannot move on its own." · "Three operators in black: the model plans, the tools act, the harness checks." · "Twenty moves along a narrow plank. Each move goes right 95 times in 100." · "A slip: the check operator's crook catches it. The move is made again — that costs time." · "Take the check operator away. Of 50 stages, how many will still be lit after 20 moves?" · "Fifty runs, no check. A fallen puppet's curtain closes; its job slip marks the move." · "One chalk stroke per stage still lit. Expect about 36 in 100 — 18 of 50." · "The same fifty runs and the same slips, with the check operator at every step." · "Each caught slip cost a move. Expect about 79 in 100 — 39 of 50 take a bow."
Controls: `guess` commit 0–50, default 25, jump 17.8; `plan` every / mid / end / none, jump 26.6. Camera: crane, then a 17.7° long lens; bow 33–34.7 s. Address: slip on the board; peach "made again" marks. Realised: 19 lit at 28 s against an expected notch near 18.

## G · The Run (p2d, knitted cloth)
Technique: procedural stitch atlas (closed-form yarn shading, rip-mapped); exact-coverage column splatter; closed-form drape; BPE tokenizer trained at load (native).
Mark rule: native: column = token, row = step, a 24-stitch needle is the context window. Shared: column = run, row = step; a slip drops the stitch (peach loop) and a ladder runs up; hang sorted by drop row, so the hem is the survival curve.

**G1 run-native** · 28 s · chapters 0 Title; 3.6 Tokens; 8.0 Knitting; 12.69 Fact dropped; 19.7 Middle; 22.6 Scarf
Captions: "A language model reads and writes text as tokens: pieces of words, not words." · "Each token is one stitch. The needle holds a fixed number: the context window." · "Each new token is knitted as a row through every stitch on the needle." · "The needle is full. This app then drops the oldest token for every new one." · "ACME has been dropped. From this row on, the model cannot see it at all." · "Sketch: even on the needle, models often recall the middle less well than the ends." · "The reply is the whole scarf, but the model only ever sees what is on the needle."
Control: `merges` 0–147, default 147, jump 8.0. Engine: none; at 147, prompt 23 tokens, reply 34, ACME leaves at row 15. Address: ACME struck in the prompt; its column drops. Caveat: caption times are fixed from default merges, so changing `merges` desynchronises them. Sketch labels: 2.

**G2 run-shared** · 34 s · chapters 0 Title; 3.6 One run; 9.5 Marker; 12.5 2,000 runs; 19.2 Hem; 22.5 Hook; 29.2 Both hems
Captions: "An AI agent works in a loop: plan, call a tool, read the result, check, repeat." · "Each column is one run of an agent. Each knitted row is one step of the loop." · "A step slips: the stitch drops, and the ladder undoes every step that run had done." · "Your call: 20 rows, each right 95 % of the time. Where will the whole runs end?" · "All 2,000 runs, knitted row by row. Pale slits are ladders: runs that failed." · "Hang the swatch sorted by the row that dropped: the hem is the survival curve." · "Same runs, same slips. A hook checks every row and latches 4 in 5 drops back up." · "Checking costs a pass on every row of every run, and twice as many runs come out whole."
Control: `guess` commit 0–2000, default 1800, jump 12.5. Engine: AgentLoop, N=2000. Camera: macro 7.6–9.2 s; 34× lens. Payoff: both hems, copper expected threads. Address: peach loop at the stitch.

## H · Exposure (p2d, light table)
Technique: CPU float plate → H&D curve → cyanotype print → OKLab LUT; log-exposure grain; closed-form staircase. Native: cos⁴ exposure per query. `EX.contours` is never used.
Mark rule: shared: ring = step, wedge = share of runs; a ray stops at its slip ring (the address). Native: query = light source; labels appear once developed.

**H1 exposure-native** · 30 s · chapters 0 Query; 6.9 Near in meaning; 12.6 Second exposure; 19.6 Context; 25 Plate
Captions: "An embedding gives each word a position. A query lights the words nearest in meaning." · "One word burns in far away: near in meaning, far on this flat map." · "A second query, same plate. The shared word is lit from both sides." · "Real models learn unnamed dimensions, and context moves a word to fit its sentence." · "This map is a sketch: hand-set features, flattened, so distances are distorted."
Control: `pair` 0 mouse / 1 bank / 2 bass; press-drag sets a query in live mode. Engine: none; 80 words. Camera: static. Payoff: ghosts of the two senses. Address: none. Sketch labels: 2.

**H2 exposure-shared** · 34 s · chapters 0 Plate; 3.5 One run; 6.6 Guess; 9.6 10 runs; 12.6 100 runs; 15.6 2,000 runs; 21 Checks on; 25 Cost; 29 Plate
Captions: "A long exposure of AI agent runs. Each ray of light is one whole run." · "Each ring is one step: plan, act, observe, check. A slip stops the ray at that ring." · "Mark the rim: of 2,000 runs, how many pass all 20 rings? Each step is 95 % right." · "Ten runs, stacked by where they stopped. The rim reads how many cleared. Too few to trust." · "A hundred runs. The staircase edge creeps toward the expected one beneath it." · "2,000 runs: the edge sits on the expected staircase, and the band of doubt is thin." · "Second exposure, same runs, checks on: a check catches 80 % of slips and retries once." · "Each sage bead is a step done twice. Slips are assumed independent." · "White: cleared without checks. Cyan: the runs the check saved. Read both on the rim."
Controls: `guess` commit 0–2000, default 1000, jump 9.6; `draws` A / B / C. Engine: AgentLoop, N=2000. Camera: static; loupe on the rim. Address: peach tick per run; "stopped at ring f+1". Realised: 10 runs, 7 cleared (70%); 2,000 runs: 719 vs 717 ± 43 unchecked, 1,586 vs 1,571 ± 37 checked, 1,409 steps redone.

## Screenshots
- bunraku-shared-9: puppet on plank, copper and slate rods.
- bunraku-shared-28: ruler shows 19 lit against an expected notch near 18.
- margin-native-8: slate tallies beside ink fair copies.
- margin-native-20: "Sydney" struck in peach; "Thimphu" in ink.
- run-native-8: tokenised prompt, ACME in copper, 24-token needle.
- run-native-18: cloth cascades as old tokens drop; "ACME dropped at row 15".
- exposure-shared-10: 7 of 10 cleared against a 36% band.
- exposure-shared-28: white 719 realised vs copper 717 expected; cyan 1,586.

## Cross-film and bugs
- Kits are duplicated per film, identically.
- Uncertainty: Run and Bunraku show ±1 sd; Exposure shows "±2 sd" as "±". "Cost" is measured four ways.
- N = 50 (Margin, Bunraku) vs 2,000 (Run, Exposure) for one story; Margin's 50-run world has no sampling band.
- Bunraku native: `spanWorld` re-derives draws instead of calling `A.events`; "k = 1 equals the engine" unverified.
- Bunraku shared: `W.redo` counts caught events; meta counts caught-and-retried.
- Margin: native mirror hard-codes 36%; shared writes localStorage on `guess1$committed`.

## Core ideas that should survive
1. Time as the only input: each frame is f(t, state, seed) over precomputed plans.
2. Physics as encoding: ink dries, yarn ladders, paper falls, light exposes; failure has a place.
3. Twin worlds on common random numbers, drawn in one object.
4. Expected-versus-realised overlays drawn from the same marks.
5. p5 reaches raw WebGL (data textures, instanced draws, DOF, shadows), CPU float fields and procedural atlases.
6. Real algorithms as content: BPE at load, RK4 ODE, the H&D curve.

## Experiment-specific choices
- The four metaphors and palettes.
- Labelled toy models: Sydney counts, hand-set features, "attention splits evenly".
- Parameters (p .95, c .8), N, durations, chapter timing.
