# R6: Worlds A–D

Scripts: `/tmp/claude-0/<id>-<name>.js`. Dupes: 1aff3e4a = 00190b0c; e3be6909 = 57bcd0f2.

## A · Escapement (WEBGL)
- **Technique:** exact involute gears; Graham pallets; contact-solved, tabulated escape angle; instanced GLSL.
- **Mark rule:** shared: movement = run, tooth = step, tick = loop. Native: wheel = system, ball = job, mesh = handoff.

**A1 escapement-native** (4306a7e4), "The Escapement — every handoff adds a step", 30 s. Chapters: The train 0; Two handoffs 2.4; Six 4.6; Twelve 8.4; Read the trays 23.5.
1. A process as a gear train. Each wheel is a system; each ball is one job.
2. At every mesh the job hops to the next system. A missed hop drops the job right there.
3. The same train with six handoffs: the same forty jobs, so it can only lose more.
4. Twelve handoffs. The reliabilities are a sketch; the multiplying is not.
5. Each tray is one draw. The dashed line is what to expect: about 37, 30 and 21 of 40.
6. One check at the weakest handoff buys back about one job. Cutting six handoffs buys eight.

- **Controls:** `handoffs` 1–12, jump 10.0 s. **Hero:** 12-handoff train; payoff trays. **Address:** dropped ball lands at its mesh. **Realised:** tray count.
- **Finding:** caption 6 is off: the code gives a gain of 1.5 (22.9 vs 21.3).

**A2 escapement-shared** (f45f9da7), "The Escapement — what an AI agent actually does", 34 s. Chapters: One run 0; Anatomy 3.0; A slip 7.0; Your call 11.2; Fifty runs, twice 16.4; Racked 26.8; Read it 30.0.
1. An AI agent as a clock movement. One movement is one run of a task.
2. Each tick is one loop: plan, act, observe, check. Each tooth is one step, 20 to a run.
3. A slip: a tooth passes the pallet with no impulse. The movement stops inside that step.
4. Fifty runs, 20 steps each, every step right 95 % of the time. How many come home?
5. Same draws twice. Behind, a verifier pawl catches 4 slips in 5; each catch costs a beat.
6. Racked by the step where each one stopped, the runs draw their own survival curve.
7. Expected: about 18 of 50 home with no check, about 39 with one. Each run is one draw.

- **Controls:** commit `guess` 0–50, jump 16.4 s. **Engine:** AgentLoop N=50, k=20. **Hero:** step-8 slip; payoff rack (27–31). **Camera:** eased keyframes to top-down. **Address:** stopped movement goes dark; tooth peach. **Realised:** "home" vs "expected X.X".

## B · Marbling (Canvas2D)
- **Technique:** Jaffer & Lu invertible maps; each pixel pulled back through the ops.
- **Mark rule:** spec: pass = step, tile = run, 48 trays. Built: lane = run, column = step, one tray (deviates).

**B1 marbling-native** (00190b0c), "Marbling — un-combing: how image generators work", 30 s, no engine. Chapters: A tulip 0; Combed, with noise 4.8; Back: a guess 10.6; Training (sketch) 14.9; One noise, three prompts 17.7.
1. A marbler makes a tulip from drops of paint on size-water and two strokes of a needle.
2. Comb it ten times, and each pass let a few drops of noise fall in: the tulip is gone.
3. Combing alone could be run backwards exactly. The noise kept no record.
4. Run it back and a tulip appears, but not yours: the dashed line is the one you made.
5. A generator trains on millions of pictures made noisy. It learns to guess one step back.
6. Now start from fresh noise: the same noise in all three trays, with no picture in it.
7. Each prompt steers its own way back (the copper comb): coarse shapes first, detail last.
8. One noise, three prompts, three pictures: learned from training, not hidden in the noise.

- **Controls:** `noise` 1–6. **Hero:** tulip with dashed original (14–15 s). **Address:** none; unrecorded sprinkles are the failure. **Sketch:** "Training (sketch)".
- **Finding:** caption 8 claims "learned from training"; the ghost combs are hand-written.

**B2 marbling-shared** (f3373e4e), "Marbling — what an AI agent actually does", 34.5 s. Chapters: The tray 0; One lane, one run 4.9; Your guess 11.4; 50 runs, 20 steps 14.4; Stacked by where it fell 21.4; Again, with checks 24.2; Both in one stack 30.2.
1. An AI agent works in a loop: plan, act with a tool, look at the result, check, repeat.
2. Each lane of this tray is one run. The needle is the agent: one column per step.
3. A stray drop is a slip. The needle runs through it and drags it into every later step.
4. Fifty runs, the same twenty steps, each step right 95 % of the time.
5. Your call: how many of the 50 lanes reach step 20 with no stray?
6. Where a stray fell is the step that failed; its thread is everything that came after.
7. Stack the lanes by where the stray fell: their heads trace how fast clean runs run out.
8. Same tray, same strays, now with a check: the needle waits, a paper strip lifts the stray.
9. Every check costs time, and every catch means doing the step again.
10. Restacked: sage rings mark the runs the checks saved, at the step where each was caught.

- **Controls:** commit `guess` 0–50, jump 14.4 s. **Engine:** AgentLoop N=50, k=20. **Hero:** first saved lane; payoff restack (30.2–31.7). **Address:** stray head at its step. **Realised:** "N of 50 clean" vs "expected X.X". **Sketch:** "¼ step a check".

## C · Sediment Delta (Canvas2D)
- **Technique:** Catmull-Rom rivers; fBm terrain carved by river masks; prograding-bar deposition.
- **Mark rule:** grain = run; weir = step. Native adds river = day.

**C1 delta-native** (edaeb5bb), "Correlated failure", 28 s. Chapters: Four days, one spring 0; The flood 6.0; Soundings 17.6; The record 22.6.
1. Four days of an AI agent: 500 runs a day, a check at every step.
2. The spring is a shared source: a price list that every run reads at step 2.
3. One day the price list is wrong. Every run reads it, so every run stops at step 2.
4. The checks downstream read the same price list. They catch slips, not this.
5. Good days: checks lift a fan from about 36 to 79 of 100. The bad day: none either way.
6. Checks that read the same source cannot catch it. Check the source with something else.

- **Controls:** `bad` 0–4 (what-if), jump 6.0 s. **Engine:** AgentLoop N=2000. **Hero:** landslide and dam (6–11.5). **Address:** grains settle at their weir; lake at weir 2. **Realised:** fan counts vs "expected with N bad days: X ± sd". **Sketch:** "what-if, sketch".

**C2 delta-shared** (97723556), "What an AI agent actually does", 35 s. Chapters: The river 0; Weirs and braids 4; Your stake 7.5; The flood 10.5; Soundings 27.0; The survey 30.8.
1. One river, 2,000 grains of sand. Each grain is one run of an AI agent doing a 20-step job.
2. Each weir is one step: plan, call a tool, read the result. 95 of 100 grains pass each one.
3. The river forks; the same grains go both ways. How many reach the sea on the bare branch?
4. A run that fails settles on the bank at the weir where it failed. The bare branch shrinks.
5. The braided branch has a check at every weir: a detour that catches 4 slips in 5.
6. The detours cost time: the braided branch reaches the sea later.
7. Each weir keeps 95 of 100. Twenty in a row keep about 36 of 100. With checks, about 79.
8. Dashed lines are the exact expectation. The sand is one draw from it.

- **Controls:** commit `guess` 0–2000, jump 10.5 s. **Engine:** AgentLoop N=2000; twin worlds. **Hero:** fork and flood; payoff bay counts (27–35). **Address:** "N FAILED AT WEIR 1", "N AT WEIR 20". **Realised:** bay counts vs dashed exact tips and ± sd band.
- **Finding:** "each detour cost them 1.6 s" is the braid duration; the code's net delay is smaller, unlabelled.

## D · Ledger (Canvas2D)
- **Technique:** Isotype atlas; Hungarian re-packing; exact binomial tail.
- **Mark rule:** shared: slip = job (40 invoices, 10 turns); hourglass = 20 review-hours; stamp = check. Native: hourglass = 20 h of work.

**D1 ledger-native** (40b73721), "The honest ROI of an AI pilot — the ledger", 28 s. Chapters: The claim 0; No checks 2.6; Re-kept with checks 8.6; Twelve months 12.2; Break-even 20.4.
1. The vendor slide: the pilot saves 2,000 hours a month. Keep an average month honestly.
2. Without checks about 40 of 100 jobs fail, and each is done again by hand: 20 hours.
3. Then each failure has to be found and fixed. On average nothing of the claim is left.
4. Re-keep the same month with a check at every turn. Every hour moves; none is lost.
5. Review costs about 950 hours, but far fewer failures. About 480 hours are really kept.
6. Twelve real months, one draw each. Single months scatter around the expectation.
7. The month in the first film was a lucky one. Judge a pilot on the expectation.
8. Checks pay when a failure costs more than the review it takes to catch it.

- **Controls:** `fix` hours 0–40 (default 30), jump 4.9 s. **Engine:** AgentLoop N=100, k=10 (N=1200 for the year). **Hero:** re-pack; payoff year strip. **Address:** none per turn. **Realised:** average month vs twelve ticks. **Sketch:** "Hours are sketch".
- **Finding:** caption 7's "lucky" month is never shown; the marked month is unverified.

**D2 ledger-shared** (57bcd0f2), "What an AI agent actually does — the ledger", 35 s. Chapters: The page 0; Your estimate 2.4; Ten turns 5.9; Corrected: checks 14.4; Your turn 21.6; One run 27.0; The riskiest five 31.4.
1. An AI agent works in turns: plan, call a tool, read what came back. Ten turns per job.
2. Each turn comes out right 95 % of the time. Of 100 jobs, how many get through clean?
3. A job that slips at any turn is filed, whole, on the line of the turn where it failed.
4. Expected: 60 of 100 (0.95 to the 10th). This month ran a little lucky.
5. Now correct the books as if a check stood at every turn. Same jobs, same slips.
6. Rescued jobs are reversed back into the clean block. Each check costs review time.
7. With checks: about 89 of 100 expected. The price: nearly a thousand review-hours.
8. Your turn: one job, 40 invoices, only 5 checks. Some turns are riskier than others.
9. The outlines show where exceptions are expected. How many invoices come through?
10. One run with your checks. Target: 32 clean.
11. Same invoices, checks moved to the five riskiest turns. Where you check matters.

- **Controls:** commit `guess` 0–100, jump 5.9 s; toggles `c0`–`c9` (budget 5); commit `guess2` 0–40, jump 27.0 s. **Engine:** act 1 AgentLoop N=100, k=10; act 2 own hash draws. **Hero:** correction (14.4–20); payoff riskiest-five re-pack. **Address:** exceptions on the failing turn's line. **Realised:** folio vs dashed 60 → 88.6; P(≥32) vs this run.
- **Checked:** default plan expects 29.0 (P 0.19); riskiest five 33.1 (P 0.75). **Findings:** "ran a little lucky" is hard-coded; act 2 "sketch" is meta-only.

## Screenshots (shared)
escapement 8.5 pre-slip; 28.5 rods, no numerals. delta 10 fork; 26 bay 719 and 1,583 vs expected 717 and 1,571. ledger 10 78 in process; 26 act 2, target 32. marbling 10 zoomed strays; 26 19 of 50 vs expected 17.9.

## Core ideas that should survive
1. Closed-form maps and contact-solved tables give exact seek.
2. Instanced GLSL with a data texture makes 100 moving parts cheap.
3. Common random numbers for twin worlds; counts read from marks.
4. The argument lives in the marks and algorithms, not the renderer.
5. Software GL forced low-LOD meshes; re-check on a real GPU.

## Experiment-specific
Palettes; camera moves; N; hand-set Ledger reliabilities; 1 h review and 1.6 s braid costs; type.
