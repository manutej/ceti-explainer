# PED-L4 — Evidence of understanding: what interactive explainers should ask, log and prove

Scope: Wield and Master levels of the ladder. "Verified" = I read the page this session; "abstract-only" = paywalled; "recalled" = not re-checked, treat as a lead.

## 1. Findings

**Retrieval beats re-exposure; media can host it.** Adesope et al. (2017) conclude practice tests beat restudy and other controls; by secondary summaries the benefit is larger after a delay over one day and covers transfer, and feedback adds only a little (exact g not verified; paywalled). In media: Szpunar, Khan & Schacter (2013) put memory tests between segments of an online lecture; mind-wandering about halved from a ~40% baseline and note-taking roughly tripled. Restudy did not help. Inference: a Grasp film should stop and ask, not just narrate.

**Failing first is useful if feedback follows.** Richland, Kornell & Kao (2009): wrong pre-reading guesses still raised later recall (e.g. 75% vs 56% immediate; 55% vs 45% at one week). Answering beat merely reading the questions (90% vs 78% vs 63% extended study). Factual text only, one passage. Productive failure (problem first, instruction after): Sinha & Kapur synthesise 53 studies / 166 comparisons and say it needs some prior knowledge and suits secondary/adult learners. A separate meta-analysis finds the main contrast not significant (g = 0.22, CI −0.06 to 0.51), though ~0.6 after publication-bias correction. Treat as promising, contested.

**Prediction + confidence.** The hypercorrection effect: high-confidence errors get corrected more often than low-confidence ones. Young adults: .85 vs .76 correction (gamma .51); older adults showed none (Eich, Stern & Metcalfe 2012). The mechanism, surprise driving attention to feedback, is plausible, not proven. Fazio & Marsh found a small effect (gamma ≈ .13, n = 46). Persistence: one cited poster suggests it lasts a week but the confident errors may return, unverified. Design consequence: capture confidence *before* the reveal, then spend the animation budget on the high-confidence misses. Calibration feedback (confidence vs. correctness) is the honest scoreboard; I found no strong source that a calibration display itself improves learning, so log it, don't promise it.

**Compounding is the target misconception.** Schonger & Sele (n = 459): doubling-time framing cut underestimation (90% → 67%); asking "days gained" instead of "cases avoided" helped most; being told people underestimate did not stop the error. Melnik-Leroy et al. (2023, n = 95, no control group): linear axes led to underestimation and log axes to overestimation; a two-slide reading lesson lifted accuracy (e.g. 61% → 93%) but cannot separate content from "look harder". Inference for 0.95^k: this is decay. Linear intuition predicts 1 − 0.05k = 0% at k = 20, while the truth is 36%. Other intuitions anchor on "95% is good" and ignore the chain. The direction is unknown. So *measure it*: log each learner's guess. Reframe as half-life (0.95^k = 50% at k ≈ 13.5) and as "what reliability do I need?".

**Understanding ≠ looking.** ICAP (Chi & Wylie 2014): learning rises passive < active < constructive < interactive, via overt behaviour. Clicking "next" is active at best. Constructive means generating something beyond what was shown (a prediction, a curve, a reason). Caveat: shallow items miss the difference; students may do less than designed.

**When interactivity hurts.** Seductive details (interesting but irrelevant) reduce recall: small to moderate effect over ~35 years; harm is driven by diversion, larger when learners think the details are relevant. A prompt saying they're irrelevant removed it (Springer 2023, verified). Not verified this session: Mayer-style interactivity and load studies; recalled lead only. Rule: every interaction must change what the learner thinks about the *mechanism*. Sliders that merely animate are decoration.

**Transfer.** Retrieval practice reportedly transfers (Adesope, secondary). Barnett & Ceci's near/far taxonomy is recalled, not verified. Operationally: near = same story, new numbers; far = new domain, same structure, no cue that it is the same.

**Stealth assessment / ECD at small scale.** Shute's pattern: competency model (what), task model (what tasks elicit evidence), evidence model (how actions become scores), typically Bayesian networks; claims of validity are encouraging but generalisability needs study, quality is uneven, and privacy worries are real. Small-scale version: per interaction, write a three-line evidence map (claim · observable · rule), keep a Beta-style count per claim, no network.

**Analytics, honestly.** I found no strong empirical source. Recommendation (mine): compute on device; log only choices, confidences, timings, counts; no free text, no identity; show the learner their own calibration; export only opt-in aggregate counters, never individual traces; never show a "score" that the evidence cannot support (n = 3 items is a hint, not a grade).

**Spacing for corporate learning.** Spaced practice yields superior long-term learning, tests amplify it, hundreds of studies (Kang 2016, abstract-only; Cepeda 2006 recalled). Design inference, not sourced: a film is one exposure; add 2–3 low-friction return questions (≈2 days, 2 weeks, 6 weeks) as new numbers on the same structure.

**Gamification: real vs hype.** Sailer & Homner (2020; 38 papers): cognitive g = .49 [.30, .69], motivational .36, behavioural .25, heterogeneity I² 64–75%. In rigorous designs only cognitive held (g = .42, k = 9). Game fiction moved behavioural outcomes only (maybe a measurement artefact). Verdict: small and unstable; I found no evidence that badges or leaderboards beat good retrieval design. Skip points; keep the fiction light.

## 2. Interaction structures

Format: **Name** · learner does · logged · proves · level · animation needs · risk

1. **Predict-Commit-Reveal** · locks a numeric/choice guess before the film resolves · guess, latency · prior model; gap to truth · Wield · hold-frame, deterministic reveal from seed · guess anchored by a visible default.
2. **Confidence wager** · adds low/mid/high after guess · confidence + correctness → calibration · calibration, hypercorrection candidates · Wield · 3-state control; reveal that lingers longer on high-confidence misses · feels like a quiz; make it one tap.
3. **Cold-open pretest** · answers a question before Glance teaches it · answer, confidence · baseline; seeds the surprise · Glance→Wield · question held on screen, answer paid off later · discouraging if too hard; one item.
4. **Interpolated retrieval** · fills a blank or picks the missing step mid-Grasp · answer, response time · encoding of mechanism · Grasp/Wield · pause-safe beat boundaries, blank-able labels · interrupts flow; max one per 40 s.
5. **Inverse dial** · tunes a parameter to hit a target ("≥ 80% over 20 steps") · dial path, final value, moves · invertible model (needs p, not just 0.95^k) · Wield · live curve, target band · trial-and-error without reasoning; log first move.
6. **Goal-free sandbox** · "find three numbers that surprise you" and pins them · pins, parameter ranges · what they notice; novelty-driven explore · Master · free state space, pin tray · aimless play; cap pins at three.
7. **Draw-the-curve** · sketches expected decay, then sees the true one · curve points · shape of intuition (linear / flat / exponential) · Wield · freehand canvas, overlay · motor noise; classify coarsely.
8. **Intervene-and-forecast** · places a check/gate, forecasts the new outcome, then runs · placement, forecast, error · causal model of verification · Wield/Master · drag-drop, seeded trial rain · trials may hide variance; show spread.
9. **Misconception pick** · chooses the explanation among 3, one a plausible wrong model · choice, confidence · specific misconception (e.g. "5% is the total error") · Wield · static options with a diagram each · weak if distractors are straw men.
10. **Spot-the-slip** · taps where a trace first goes wrong · tap step, time · fault localisation; need for checks · Master · scrubbable trace · labelled "sketch" if illustrative.
11. **Transfer capstone** · near item, then far item · structured choice + estimate · does the model travel · Master · new skin on shared engine · confounded if the far item gives itself away.
12. **Return card** · answers 2–3 items days later via link · answers, interval · retention + transfer · post-film · reusable item bank, no login · low return rate; report as a rate, not a result.

## 3. Five designs for "What an AI agent actually does"

Arithmetic (computed): 0.95^10 = 59.9%, ^20 = 35.8%, ^30 = 21.5%; half-life 13.5 steps. With checks catching 80% of slips and retrying on flag (assumption, label as sketch): per-step end-correct = 0.95/0.96 = 98.96%, so 90.1% at 10, 81.1% at 20, 73.0% at 30, at ~1.5× steps for k = 10. Single end-of-run check: 88.2% at 10 for ~1.47× runs.

1. **The Staircase Bet** (Wield; #1, #2, #7). Learner draws the success curve for 0.95/step, then commits an estimate and confidence for k = 10. Two hundred seeded runs fall; 59.9% lands. Then asks k = 20 with no new information. Logs: curve class, estimate error, confidence, k = 20 update. Proves: whether the chain, not the 95%, now drives the guess. Spend extra time on high-confidence misses.
2. **Dial the Run** (Wield; #5). Target: 20 steps finish ≥ 80% of the time. Dial reliability. Required: 0.8^(1/20) = 98.9% per step. Then 50% at 10 steps needs 93.3%. Logs: first guess, moves, final. Proves: invertible understanding; a good wrong guess ("97%") is informative.
3. **Place the Checkpoint** (Wield → Master; #8, #6). Drag a check onto the chain, forecast the end-to-end rate, run. Master unlocks per-step vs end-only vs human gate with a cost meter and a "pin three surprises" tray. Logs: forecast error, placement, pins. Proves: causal model of verification and its trade-off (accuracy vs. retries).
4. **Where Did It Go Wrong?** (Master; #10, #9). Three sketch traces; one slip passes silently at step 6. Learner taps the first wrong step, picks which of three explanations fits, then edits the plan to catch it. Logs: tap, explanation, edit before/after the slip. Proves: diagnostic reasoning. Mark traces "sketch".
5. **Far Transfer + Return** (Master; #11, #12). Expense-approval workflow: 14 steps at 97% each (computed 65.3%), money moves, no mention of agents. Learner forecasts, then chooses shorten / check / gate and wagers on it. A link two days later asks the same structure at k = 8 with 0.9; a second at two weeks. Proves: far transfer and retention; report as aggregate rates only.

## Sources

- Adesope et al. 2017 (abstract): https://journals.sagepub.com/doi/10.3102/0034654316689306 ; summary https://www.learningscientists.org/blog/2017/2/9-1
- Szpunar, Khan & Schacter 2013 (via summary): https://www.sciencedaily.com/releases/2013/04/130404122240.htm
- Richland, Kornell & Kao 2009: https://learninglab.uchicago.edu/Pre-Testing_files/RichlandKornellKao.pdf
- Sinha & Kapur summary: https://www.weforum.org/stories/2021/09/students-who-productively-fail-learn-more/ ; PF meta-analysis: https://www.research-collection.ethz.ch/entities/publication/087241d3-ca0e-469e-a7f3-df9c122e2585
- Eich, Stern & Metcalfe 2012: https://pmc.ncbi.nlm.nih.gov/articles/PMC3604148 ; Fazio & Marsh 2010: https://pmc.ncbi.nlm.nih.gov/articles/PMC4084803
- Schonger & Sele 2020: https://pmc.ncbi.nlm.nih.gov/articles/PMC7725369 ; Melnik-Leroy et al. 2023: https://pmc.ncbi.nlm.nih.gov/articles/PMC9977824
- Chi & Wylie 2014: https://csi.asu.edu/wp-content/uploads/2018/01/ChiWylie2014ICAP.pdf
- Seductive details 2023: https://link.springer.com/article/10.1007/s11251-023-09632-w
- Shute & Rahimi, stealth assessment primer: https://myweb.fsu.edu/vshute/pdf/SA_Primer.pdf
- Kang 2016 (abstract): https://journals.sagepub.com/doi/10.1177/2372732215624708 ; Cepeda 2006: https://pubmed.ncbi.nlm.nih.gov/16719566/
- Sailer & Homner 2020: https://link.springer.com/article/10.1007/s10648-019-09498-w
- Goal-free / cognitive load leads, not read: https://dx.doi.org/10.1007/s11251-012-9237-2 ; https://www.doi.org/10.1007/S10648-007-9054-3
