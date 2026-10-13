# Narrative and structural templates of the best explanatory media — research pull

Date: 2026-10-08. Extends `typesafe/modes/RESEARCH-CHANNELS.md` (visual grammar: morphs, colour-as-variable, size-coded grids, etc.). That file is about HOW THINGS LOOK; this one is about HOW FILMS ARE BUILT. Purpose: a reusable library of film structures (archetypes) and scene modules for the p5-explainer.

**Evidence tags.** **[F]** = fetched this session from the cited URL. **[K]** = background knowledge, not verified this session; treat as hypothesis and check against the video. **[S]** = synthesis/judgement by the author of this note (e.g. every percentage in a beat sheet). **Read this first:** none of these channels publishes a beat sheet with timings. All "% of runtime" figures below are my own reconstruction from how the films are described and from background viewing knowledge; they are design defaults for a library, not measurements. Where a fetched source supports a beat, it is tagged [F].

---

## 1. Film-level structures, channel by channel

Each entry: **beat sheet** (named beats, typical % of runtime [S]) · **signature move** · **suits** · **example**.

### 1.1 3Blue1Brown — problem-first, "you could have invented this"
- **Evidence.** Sanderson's stated aim is that viewers feel they "could have invented calculus"; he wants the learner to ask what instinct they lacked; he argues for reversing the textbook order (specific, visual first; abstract general statement later); he motivates with "a mystery you need to see resolved" and "puzzles and problems with some intrinsic beauty" **[F antoinebuteau.com]**. Manim is a clip generator; narration is cut in afterwards **[F, 3b1b FAQ, cited in RESEARCH-CHANNELS]**.
- **Beats [S]:** Puzzle (8%) → naive attempt (10%) → friction, where naive breaks (10%) → reframe / change of representation (12%) → guided rediscovery, each step feeling forced (30%) → payoff: the formula is the obvious thing (12%) → generalize (10%) → open thread (8%).
- **Signature move:** the *reframe* — the moment the picture changes (numbers become areas, a sum becomes a rotation) so the next step is nearly free. Persistent object carried across all beats (see RESEARCH-CHANNELS #1).
- **Suits:** derivations, identities, algorithms with a hidden idea, "why does this formula work."
- **Example:** "But what is a neural network?" https://www.youtube.com/watch?v=aircAruvnKk **[K]** (structure: goal "recognise a digit" → naive idea → layers as feature detectors → weights as the dials; ends with a pointer to the next chapter).

### 1.2 Veritasium — misconception-first (Derek Muller)
- **Evidence.** Muller's PhD (Sydney, 2008) was *Designing Effective Multimedia for Physics Education*; he gave the 2012 TEDxSydney talk "The key to effective educational science videos" **[F wikipedia]**. His research summary: students feel they learn from clear, well-illustrated videos but tests show they do not, probably because existing misconceptions are not noticed as contradicted; the format that worked presented common misconceptions alongside the correct concept, making students work harder mentally **[F emergingedtech.com]**. He argues videos "shouldn't just explain correct information, but should tackle misconceptions as well", and that reasoning past a wrong idea is part of learning **[F openculture.com]**. The channel's hallmark is interviewing members of the public to surface misconceptions **[F wikipedia]**.
- **Beats [S]:** Question + street-poll of wrong answers (12%) → viewer commits (6%) → why the wrong answer is tempting (16%) → decisive demo/number (18%) → corrected model built piece by piece (24%) → test on fresh case (12%) → where the wrong idea still lives (8%) → callback (4%).
- **Signature move:** steel-man the wrong answer — give its internal logic before breaking it, so the viewer's confusion is productive.
- **Suits:** counter-intuitive physics and statistics; anything with a widespread plausible wrong belief.
- **Examples:** the falling-Slinky videos and the moon-distance video **[F wikipedia]** (titles only; URLs not fetched). "The Science of Thinking" (bat-and-ball question; System 1 as "Gun", System 2 as "Drew") **[F nerdist.com]**; video URL https://www.youtube.com/watch?v=UBVV8pch1dM **[K]**.

### 1.3 Kurzgesagt — big question → scale journey → human stakes
- **Evidence.** Five-phase pipeline: research (experts check facts, sourcesheet per video) → script (about a dozen drafts, aim: "a new perspective on a topic") → sketch visual metaphors per scene → voice-over sets animation timing → composed score **[F kurzgesagt.org/youtube]**. The page names no act structure or timings; the beat sheet below is from viewing knowledge.
- **Beats [S]:** Hook question / number (8%) → familiar anchor (8%) → zoom steps, each adding an order of magnitude and a comparison (32%) → the turn: the scale where the answer changes (12%) → onward to the extreme (14%) → human stakes (14%) → reframe of the question (8%) → kicker (4%).
- **Signature move:** scale ladder with a bestiary of characters, then a deliberate pivot from cosmic to personal ("optimistic" close **[K]**).
- **Suits:** size, time, quantity, cost, population, biology of the very small.
- **Example:** their "The Egg" short and the immune-system pieces **[K]**; process page https://kurzgesagt.org/youtube/ **[F]**.

### 1.4 Vox explainers — cold open → stakes → walkthrough
- **Evidence.** The black-hole-photo video (Joss Fong, 2019): does not open on the black hole but on aerial telescope shots to establish scale; a deliberate pause after a big idea; the actual photo is a *delayed reveal* so viewers have context before seeing it is blurry; a choral track gives a reflective moment; **each section ends with a summary line and the music stops there**; music changes about every 20 s; narration kept plain because viewers are absorbing sight and sound **[F theopennotebook.com]**. Script editors test for confusing passages because repeated viewing makes a script feel clearer than it is **[F]**.
- **Beats [S]:** Cold open (8%) → stakes (12%) → question stated plainly (5%) → walkthrough 1 (20%) → walkthrough 2 (20%) → complication (15%) → delayed reveal (10%) → summary line (10%).
- **Signature move:** section-ending summary line + music drop-out as a structural punctuation mark.
- **Suits:** institutions, technologies, policy, news-pegged "how does X work."
- **Example:** Vox's Event Horizon Telescope video, documented at https://www.theopennotebook.com/2020/01/07/videogram-how-a-vox-video-explains-the-science-behind-the-first-photo-of-a-black-hole/ **[F]**.

### 1.5 Primer — simulation as experiment, rule changes
- **Evidence.** The aggression video runs a computer evolution experiment: creatures look for food and, when two meet one food item, share or fight; one run starts non-aggressive and injects aggression on day 10, the other starts aggressive and injects non-aggression on day 10; the surprise is that the minority strategy grows in *both* runs; Nash equilibrium (≈50/50) is derived late **[F blogs.cornell.edu]**. Natural-selection sim: traits shift in real time across environments **[F kottke, via RESEARCH-CHANNELS]**.
- **Beats [S]:** Cast and world (12%) → baseline run (14%) → "predict" (6%) → rule change A with trait histogram (18%) → surprise (10%) → rule change B / mirror injection (16%) → equilibrium named, math in one line (14%) → real-world mapping (10%).
- **Signature move:** **inject at day N** — the film is an experiment you watch; the narrator never asserts, it runs and then names. Mirror experiment (swap who is injected) as built-in control.
- **Suits:** emergence, evolution, game theory, markets, contagion.
- **Example:** "Simulating the Evolution of Aggression" (summarised at the Cornell blog above) **[F]**; "Simulating Natural Selection" https://www.kottke.org/19/07/simulating-natural-selection **[F]**.

### 1.6 Welch Labs — questions, history and series cliffhangers
- **Evidence.** Welch says he tries to ask "the most compelling and clear question" he can and answer it as effectively as possible, puts heavy emphasis on history and context, aims for about one 20-minute video a month; blends overhead hand-drawing with Manim **[F aperiodical.com]**. The source does not describe how parts hand off; the cliffhanger structure below is [K]/[S].
- **Beats (single chapter) [S]:** Previously (6%) → question (8%) → history of the failed attempts (16%) → partial answer 1 (20%) → partial answer 2 (20%) → result + the new crack (16%) → cliffhanger (10%) → series map (4%).
- **Signature move:** each part resolves its own question but its resolution *creates* the next question (the "imaginary numbers" series moves from the oddity of √-1 toward rotation-as-meaning **[K]**).
- **Suits:** deep topics needing 3+ parts; history-of-an-idea.
- **Example:** "Imaginary Numbers Are Real" Part 1: Introduction (series listed on Class Central) https://www.classcentral.com/course/youtube-imaginary-numbers-are-real-45679 **[F: search result only; page not opened]**.

### 1.7 Steve Mould — physical demo → mechanism
- **Evidence.** "Demonstration first, then explanation": the self-siphoning-beads video demonstrated the phenomenon and proposed an explanation; Cambridge physicists then wrote it up (the "chain fountain" / "Mould effect") **[F wikipedia]**. Scene-by-scene structure not documented.
- **Beats [S]:** The thing, performed (14%) → reaction / how? (6%) → naive explanation, falsified by variation (16%) → minimal rig (16%) → mechanism isolated and slowed (24%) → parameter-change prediction test (14%) → return to original demo (10%).
- **Signature move:** show the effect *before* naming it; then keep varying the rig until only the real cause survives.
- **Suits:** physical curiosities, engineering oddities.
- **Example:** the self-siphoning beads video (chain fountain) **[F wikipedia]**, URL not fetched.

### 1.8 Bartosz Ciechanowski — incremental interactive build
- **Evidence.** "Interactive articles about science and engineering"; draggable demos and sliders; simplified models with stated idealisations; exaggerated visuals for visibility; builds step by step, e.g. two-body system first, then adds the Sun and the real orbit (essay "Moon", Dec 2024) **[F ciechanow.ski]**. Further device detail in RESEARCH-CHANNELS.
- **Beats [S]:** Simplest whole (12%) → +part 1 (16%) → +part 2 (16%) → +part 3 (16%) → emergent interaction (14%) → full system (14%) → limits (8%) → handoff (4%).
- **Signature move:** each section adds exactly one variable to the *same* scene; the reader owns the pacing.
- **Suits:** machines, optics, orbits, GPS, anything with parts.
- **Example:** https://ciechanow.ski/lights-and-shadows/ **[F]**, https://ciechanow.ski/ (Moon) **[F]**.

### 1.9 Nicky Case — play, then explain
- **Evidence.** Principles from the author's own post: start with a question; start on the ground; climb "this happens, THEREFORE that, BUT that"; end with an open sandbox **[F blog.ncase.me, via RESEARCH-CHANNELS]**. *Parable of the Polygons* structure: framing line ("harmless choices can make a harmful world") → step-by-step explanation → hands-on play (make every shape happy) → automated simulation with a bias slider → sandbox → second part with anti-bias → call to action ("Reach out, beyond your immediate neighbors") **[F wikipedia.org/wiki/Parable_of_the_Polygons]**.
- **Beats [S] (film adaptation):** Invitation to act (10%) → commit (8%) → reveal what happens (12%) → why (14%) → variation (14%) → population-scale zoom-out (16%) → lever (14%) → back to the viewer (12%).
- **Signature move:** the viewer's own action *is* the evidence; the explanation arrives after they have a stake.
- **Suits:** social dynamics, game theory, bias, systems with feedback.
- **Examples:** https://en.wikipedia.org/wiki/Parable_of_the_Polygons **[F]**; *The Evolution of Trust* (ncase.me/trust) **[K]**.

### 1.10 StatQuest — tiny steps plus recap
- **Evidence.** Starmer began with tutorials for co-workers, wants to avoid presenting statistics as "magic," admits he struggles with most concepts he teaches, builds in an upbeat "BAM!!!" register; research → drawings → script → voice-over → edit **[F towardsdatascience.com]**. The "Quest on / recap / triple BAM" structure is [K]; the source did not describe it.
- **Beats [S]:** One-line goal + hook example (8%) → step 1 (14%) → step 2 (14%) → step 3 (14%) → assemble (12%) → recap card (12%) → common mistake (10%) → sign-off (6%) (+ optional Q/A).
- **Signature move:** one running example that never changes; the same few numbers reused; recap as a list of the steps just taken.
- **Suits:** procedures, stats/ML recipes.
- **Example:** statquest.org / YouTube channel **[K]**.

### 1.11 TED-Ed — narrative + animation
- **Evidence.** None fetched (the Wikipedia fetch returned an unrelated page; search returned an Ofcom PDF I did not open). Everything below is [K]/[S].
- **Beats [S]:** Character in a situation (10%) → obstacle (10%) → event 1 (14%) → event 2 with mechanism overlaid (18%) → turn (14%) → mechanism isolated (16%) → modern echo (10%) → moral as a question (8%).
- **Signature move:** an educator's script given to an animator; the story carries the mechanism, which is then lifted out of the story **[K]**.
- **Suits:** history, economics, biology as story.
- **Example:** TED-Ed lessons list https://ed.ted.com **[K]**.

### 1.12 Hank Green / Crash Course — pace
- **Evidence.** Main-series episodes run 6-15 minutes; a ten-minute episode takes about an hour to film; host-led lecture format with recurring segments (World History's "Open Letter" and "Mongoltage", US History's "Mystery Document"); graphics by Thought Café (formerly Thought Bubble); scripts written with subject experts **[F wikipedia Crash_Course_(web_series)]**.
- **Beats [S]:** Topic stated and promised (6%) → chunk 1 (20%) → recurring segment (10%) → chunk 2 (20%) → chunk 3 (20%) → synthesis (12%) → what's next (6%) + credit-roll humour (6%).
- **Signature move:** speed + recurring segments as rhythm markers; the graphic is a flash card, not a scene. Pace figures (words per minute) not verified — **[K]**.
- **Suits:** survey material, timelines, definitions.
- **Example:** https://en.wikipedia.org/wiki/Crash_Course_(web_series) **[F]**.

### 1.13 Others worth stealing from (brief)
- **Karpathy** — build the artefact line by line; every claim checked by running it (RESEARCH-CHANNELS #20).
- **Reducible, Sebastian Lague** — [K] algorithm walk-through with a cursor; engine-as-canvas with debug overlays.
- **Distill** — figure/prose coupling, regime maps (RESEARCH-CHANNELS).

---

## 2. Scene-level devices (28)

Format: **Name** · purpose · typical duration · sits in beat · exemplar. Durations are [S]. Evidence tag after exemplar.

1. **Wrong answer we all give** · surface the default belief so it can be broken · 6-12 s · Misconception/Friction beat (A2 b1-b3) · Veritasium street polls, Muller thesis **[F]**.
2. **Predict-then-reveal (hold)** · force a commitment; makes the reveal land · 2-4 s hold, 4-8 s reveal · before any decisive result · Distill "You Draw It"; bat-and-ball question **[F]**.
3. **Zoom/scale journey** · make a quantity felt via stacked comparisons · 20-40 s · middle · Kurzgesagt, Powers of Ten **[K]**.
4. **Familiar anchor object** · give scale a hand-hold (a banana, a stadium) · 3-5 s · start of a scale journey · Kurzgesagt **[K]**.
5. **Toy model** · smallest system that still shows the effect · 10-25 s · after the hook · Parable of the Polygons shapes **[F]**; Ciechanowski two-body Moon **[F]**.
6. **Counterfactual / remove X** · reveal a part's role by deleting it · 10-20 s · middle · Kurzgesagt "what if" **[K]**; Mould's minimal rig **[F-ish]**.
7. **Side-by-side (same input, two methods)** · expose the difference without argument · 8-15 s · middle/late · Karpathy before/after; heapsort tree+array dual view **[F]**.
8. **Running example that never changes** · lower load: only the idea is new · whole film · all beats · 3b1b attention sentence **[F]**; StatQuest numbers **[K]**.
9. **Recap card** · compress a chunk into 3-5 labelled items · 4-8 s · end of act or film · StatQuest **[K]**, Crash Course **[K]**.
10. **Cliffhanger / open thread** · make the next film inevitable · 5-10 s · last beat · Welch Labs series **[K]**.
11. **"Now you try"** · hand the viewer a task or knob · 4-8 s · final beat or mid-film pause · Case sandbox **[F]**, Muller "work harder mentally" **[F]**.
12. **Cold open** · one striking image before the question · 3-8 s · beat 1 · Vox EHT aerials **[F]**.
13. **Delayed reveal** · hold the famous thing until context exists · beat of 10-15 s · late · Vox black-hole photo **[F]**.
14. **Summary line + music drop** · punctuation: "that was one idea" · 3-5 s · end of each section · Vox **[F]**.
15. **Reframe (change of representation)** · convert the problem to a picture where it is easy · 8-15 s · 40% mark · 3b1b **[F]**.
16. **Inject at day N** · alter a running system and watch the response · 10-20 s · middle · Primer **[F]**.
17. **Mirror experiment** · repeat with roles swapped as a control · 8-12 s · after surprise · Primer aggression **[F]**.
18. **Steel-man the wrong idea** · give the tempting logic first · 6-10 s · early · Muller **[F]**.
19. **Parameter sweep, all runs overlaid** · show a pattern across regimes · 6-12 s · middle · Victor ladder, Distill **[F]**.
20. **Regime map reveal** · plane painted by behaviour · 6-10 s · late · Distill momentum **[F]**.
21. **Strip-down to minimal rig** · remove everything not needed · 8-12 s · middle · Mould **[F-ish]**.
22. **Ladder step (+1 variable)** · add exactly one thing · 8-15 s each · repeated · Ciechanowski **[F]**.
23. **Ladder return** · drop from the abstract mark back to the opening concrete case · 5-8 s · final · Victor, Case **[F]**.
24. **Overview → detail → back** · helicopter view, then one instance · 8-12 s · any · Victor, Distill **[F]**.
25. **Stakes line** · name who is affected and what is lost · 5-10 s · beat 2 · Vox **[K/S]**.
26. **Historical stuck-point** · show who tried and why they stalled, so the solution has weight · 10-20 s · early middle · Welch Labs "history and context" **[F]**.
27. **Reaction surrogate** · character carries viewer affect at the insight · 1-3 s · at reveal · 3b1b pi creatures **[K]**.
28. **Quiet last frame** · hold the final image with silence · 2-4 s · final · Vox music stop **[F]**; 3b1b pause after key reveal **[K]**.

Composition rules [S]: (a) one new device per 10-15 s; (b) devices 2, 13, 18 pair naturally with 1; 16-17 pair with 5; 8 is always on; (c) a film should contain at most one cliffhanger and one cold open, never both in the same 60 s cut.

---

## 3. Interactive explainers: what they add beyond film, and the split

**What interactive structures add [F unless noted]**
- *Reader-controlled pace and order:* Ciechanowski sliders and drags; Patel's diagrams "start with an empty diagram and add a bit at a time", sliders first, direct manipulation later; reserve one colour (red) for the main concept; delete details that don't serve it ("Do I need the red at all?") **[F redblobgames.com/making-of/circle-drawing]**.
- *Direct manipulation / perturbation:* readers change the assumptions and see conclusions update; "like a spreadsheet without the spreadsheet" **[F Victor, Explorable Explanations]**.
- *Scrubbing time:* "We must not be slaves to real time"; replace a time slider with a picture of all time **[F Victor, Ladder]**.
- *Multiple linked representations; details on demand; annotation linking equation terms to diagram parts* **[F Distill, interactive articles]**.
- *Play first, explain after:* Parable of the Polygons — the reader plays before the system-level lesson; sandbox at the end **[F wikipedia]**.
- *Prediction prompts* (You Draw It) **[F]**.

**What film does better [S]:** controlled emotion and rhythm (music drop, silence), guaranteed attention order, a single authored insight moment, voice, shareability, and a fixed duration that a talk or class can embed.

**Suggested split for a film + interactive page pair [S]**

| Job | Film | Interactive page |
|---|---|---|
| Hook / why care | owns it (cold open, stakes) | one-line restatement only |
| First encounter with the idea | owns it: one authored path, ≤ 2 min | skip |
| The reveal / "aha" | film (timed) | optional re-run |
| Parameter intuition | film shows 1 sweep (device 19) | page owns it: sliders, regime map |
| Edge cases, limits | film names them in one beat | page owns: toggles, "what breaks" |
| Prediction/commitment | film pauses 2-4 s (device 2) | page owns real prediction + scoring |
| Recap | film recap card | page keeps a persistent legend |
| Next step | cliffhanger | sandbox + "now you try" |

Rule of thumb [S]: the film is the *tour*, the page is the *workshop*; they share one model, one palette, one running example, and one set of names so that every film beat has a page anchor (`#beat-3`) and every slider has a film still.

---

## 4. Non-technical and behavioural topics

**What the sources show**
- The bat-and-ball question is used as a live test: most people give the reflexive wrong answer, which is framed as the fast System 1; the video then explains why it fails and how to improve the odds **[F nerdist.com on Veritasium's "The Science of Thinking"]**.
- Muller's research claims that videos succeed when they put misconceptions on stage and make the viewer reason past them **[F emergingedtech.com, openculture.com]** — the same mechanism that makes "you be the subject" work.
- Parable of the Polygons turns a social phenomenon (segregation) into a rule with a numeric threshold (content if at least a third of neighbours match), lets the reader run it, then shows the intervention (anti-bias / reaching beyond neighbours) **[F wikipedia]**.
- The 2-4-6 rule task (confirmation bias) is a classic "be the subject" experiment **[F: LessWrong search result only; page not opened; the task itself is standard]**.

**How behavioural explainers differ from technical ones [S]**
1. The evidence is *the viewer's own response*, so the film needs a pause-and-commit beat (2-4 s hold) before the reveal; in a technical film the evidence is the derivation.
2. The mechanism is a *tendency*, not a law: show the distribution (e.g., "most people say 10 cents") rather than a single trajectory; follow with a variation that flips or removes the effect.
3. Agents are heterogeneous and the toy model is a rule over a population (A5/A8), so the zoom-out is "same mechanism, many people" rather than "same mechanism, deeper level."
4. Stakes are moral or financial, so the stakes line (device 25) is long, and the film must end with a *lever* (what to do, or what would change it) rather than a theorem.
5. Honesty hazards: replication status and effect-size humility matter more; a film should say "in this study" and avoid universal claims. [S]
6. Finance/history lean on narrative (A11): a person, a decision, a consequence; the mechanism is overlaid as a diagram on the scene, then lifted out.
7. Emotion is part of the evidence; the music-drop and the quiet-last-frame (devices 14, 28) matter more here.

Recommended archetypes for these: A2 (misconceptions), A8 (be the subject), A11 (narrative case), A12 (counterfactual), A5 (population simulation).

---

## 5. Synthesis: twelve film archetypes

Each is a reusable beat sheet with weights summing to 100. Time columns are computed (seconds). The 60 s version drops beats marked "cut" and renormalises the rest; minimum on-screen beat is about 3 s. Always keep: the opening question/hook, the decisive reveal, and the last-frame beat. Pick an archetype by the concept type (the "Fits" line); if two fit, prefer the one whose hook is the viewer's own prediction.

Quick selector [S]

| Concept type | Primary | Alternate |
|---|---|---|
| Derivation / identity | A1 | A7 |
| Counter-intuitive physics | A2 | A6 |
| Magnitude / cost / scale | A3 | A12 |
| System in the news | A4 | A11 |
| Emergence / evolution / game theory | A5 | A8 |
| Physical curiosity | A6 | A2 |
| Mechanism with parts | A7 | A12 |
| Bias / heuristic / social dynamics | A8 | A5 |
| Procedure / recipe | A9 | A7 |
| Multi-part deep topic | A10 | A1 |
| History / finance story | A11 | A4 |
| "Why does this part exist" | A12 | A7 |

### A1 Rediscovery (problem-first)
**Lineage:** 3Blue1Brown, Sanderson  
**Fits:** derivations, 'why does this formula work', geometry/algebra identities, algorithms with a hidden insight

| # | Beat | % | 60 s | 2 min | 5 min |
|---|---|---|---|---|---|
| 1 | Puzzle / concrete problem | 8 | 5 s | 10 s | 24 s |
| 2 | Naive attempt (it half works) | 10 | 7 s | 12 s | 30 s |
| 3 | Friction: where naive breaks | 10 | 7 s | 12 s | 30 s |
| 4 | Reframe (change of representation) | 12 | 8 s | 14 s | 36 s |
| 5 | Guided rediscovery: each step 'forced' | 30 | 20 s | 36 s | 90 s |
| 6 | Payoff: formula appears as the obvious thing | 12 | 8 s | 14 s | 36 s |
| 7 | Generalize / second instance | 10 | cut | 12 s | 30 s |
| 8 | Open thread + quiet last frame | 8 | 5 s | 10 s | 24 s |

(Weights sum to 100; normalised at render time. 60 s keeps 7 of 8 beats.)

### A2 Misconception autopsy
**Lineage:** Veritasium, Muller  
**Fits:** counter-intuitive physics/statistics, anything where a plausible wrong belief is widespread

| # | Beat | % | 60 s | 2 min | 5 min |
|---|---|---|---|---|---|
| 1 | Ask the question / street-poll (wrong answers shown) | 12 | 8 s | 14 s | 36 s |
| 2 | Commit: viewer predicts | 6 | 4 s | 7 s | 18 s |
| 3 | Why the wrong answer is tempting (its internal logic) | 16 | 11 s | 19 s | 48 s |
| 4 | Decisive demo or number that breaks it | 18 | 12 s | 22 s | 54 s |
| 5 | Corrected model, built piece by piece | 24 | 16 s | 29 s | 72 s |
| 6 | Test the new model on a fresh case | 12 | cut | 14 s | 36 s |
| 7 | Where the wrong idea still lives / stakes | 8 | 5 s | 10 s | 24 s |
| 8 | Callback to the opening question | 4 | 3 s | 5 s | 12 s |

(Weights sum to 100; normalised at render time. 60 s keeps 7 of 8 beats.)

### A3 Scale journey
**Lineage:** Kurzgesagt, Powers of Ten lineage  
**Fits:** size, time, quantity, cost, population; 'how big/much/many is X really'

| # | Beat | % | 60 s | 2 min | 5 min |
|---|---|---|---|---|---|
| 1 | Big question / hook number | 8 | 6 s | 10 s | 24 s |
| 2 | Familiar anchor object | 8 | 6 s | 10 s | 24 s |
| 3 | Zoom step 1-3 (each x10^n with new comparison) | 32 | 22 s | 38 s | 96 s |
| 4 | The turn: the scale where the answer changes | 12 | 8 s | 14 s | 36 s |
| 5 | Journey back or onward to extreme end | 14 | cut | 17 s | 42 s |
| 6 | Human stakes: what it means for a person | 14 | 10 s | 17 s | 42 s |
| 7 | Reframe of the opening question | 8 | 6 s | 10 s | 24 s |
| 8 | Kicker line | 4 | 3 s | 5 s | 12 s |

(Weights sum to 100; normalised at render time. 60 s keeps 7 of 8 beats.)

### A4 Cold open - stakes - walkthrough
**Lineage:** Vox explainers  
**Fits:** systems, institutions, technologies in the news; 'how does X actually work / why is X happening'

| # | Beat | % | 60 s | 2 min | 5 min |
|---|---|---|---|---|---|
| 1 | Cold open: striking image/event, no preamble | 8 | 6 s | 10 s | 24 s |
| 2 | Stakes: who is affected, what is lost/gained | 12 | 8 s | 14 s | 36 s |
| 3 | Question stated plainly | 5 | 4 s | 6 s | 15 s |
| 4 | Walkthrough 1: first mechanism, one sentence + one picture | 20 | 14 s | 24 s | 60 s |
| 5 | Walkthrough 2: second mechanism | 20 | 14 s | 24 s | 60 s |
| 6 | Walkthrough 3 / complication | 15 | cut | 18 s | 45 s |
| 7 | Delayed reveal (the thing from the cold open, now readable) | 10 | 7 s | 12 s | 30 s |
| 8 | Summary line, music out | 10 | 7 s | 12 s | 30 s |

(Weights sum to 100; normalised at render time. 60 s keeps 7 of 8 beats.)

### A5 Rules-change simulation
**Lineage:** Primer  
**Fits:** emergence, evolution, game theory, markets, epidemics, any local-rule -> global-pattern phenomenon

| # | Beat | % | 60 s | 2 min | 5 min |
|---|---|---|---|---|---|
| 1 | Cast + world introduced (one agent type) | 12 | 9 s | 14 s | 36 s |
| 2 | Rule 1 only: baseline run | 14 | 10 s | 17 s | 42 s |
| 3 | Predict what happens when we add X | 6 | 4 s | 7 s | 18 s |
| 4 | Rule change A: rerun, trait histogram shown | 18 | 13 s | 22 s | 54 s |
| 5 | Surprise: result opposes prediction | 10 | 7 s | 12 s | 30 s |
| 6 | Rule change B / reversed injection | 16 | cut | 19 s | 48 s |
| 7 | Equilibrium named; math in one line | 14 | 10 s | 17 s | 42 s |
| 8 | Real-world mapping | 10 | 7 s | 12 s | 30 s |

(Weights sum to 100; normalised at render time. 60 s keeps 7 of 8 beats.)

### A6 Demo then mechanism
**Lineage:** Steve Mould  
**Fits:** physical curiosities, 'wait, what?' phenomena, engineering oddities

| # | Beat | % | 60 s | 2 min | 5 min |
|---|---|---|---|---|---|
| 1 | The thing, performed, no explanation | 14 | 10 s | 17 s | 42 s |
| 2 | Reaction + 'how?' | 6 | 4 s | 7 s | 18 s |
| 3 | Naive explanation tried (and falsified by variation) | 16 | 11 s | 19 s | 48 s |
| 4 | Strip down: minimal rig that still does it | 16 | 11 s | 19 s | 48 s |
| 5 | Mechanism isolated and slowed | 24 | 17 s | 29 s | 72 s |
| 6 | Prediction test: change parameter, it follows | 14 | cut | 17 s | 42 s |
| 7 | Return to original demo, now legible | 10 | 7 s | 12 s | 30 s |

(Weights sum to 100; normalised at render time. 60 s keeps 6 of 7 beats.)

### A7 Incremental build (ladder)
**Lineage:** Ciechanowski, Karpathy, Red Blob  
**Fits:** how-it-works for a machine/algorithm/model with parts; anything with a simplest version

| # | Beat | % | 60 s | 2 min | 5 min |
|---|---|---|---|---|---|
| 1 | Simplest working version, shown whole | 12 | 8 s | 14 s | 36 s |
| 2 | Add part 1 (one new variable) | 16 | 10 s | 19 s | 48 s |
| 3 | Add part 2 | 16 | 10 s | 19 s | 48 s |
| 4 | Add part 3 | 16 | 10 s | 19 s | 48 s |
| 5 | Interaction of parts (the first emergent property) | 14 | 9 s | 17 s | 42 s |
| 6 | Full system, now readable | 14 | 9 s | 17 s | 42 s |
| 7 | Limits / where model lies | 8 | cut | 10 s | 24 s |
| 8 | Handoff: knob to turn or next question | 4 | 3 s | 5 s | 12 s |

(Weights sum to 100; normalised at render time. 60 s keeps 7 of 8 beats.)

### A8 Play-then-explain / you be the subject
**Lineage:** Nicky Case, Kahneman-style demos  
**Fits:** cognitive biases, heuristics, social dynamics, trust, segregation, voting

| # | Beat | % | 60 s | 2 min | 5 min |
|---|---|---|---|---|---|
| 1 | Invitation: a small task/choice to the viewer | 10 | 7 s | 12 s | 30 s |
| 2 | Viewer commits (pause, countdown) | 8 | 6 s | 10 s | 24 s |
| 3 | Reveal: what most people do | 12 | 8 s | 14 s | 36 s |
| 4 | Why the pull is real (System 1 logic) | 14 | 10 s | 17 s | 42 s |
| 5 | Variation that flips the result | 14 | 10 s | 17 s | 42 s |
| 6 | Zoom out: same mechanism at population scale | 16 | 11 s | 19 s | 48 s |
| 7 | What would change it (a lever) | 14 | cut | 17 s | 42 s |
| 8 | Back to the viewer: next time you will notice | 12 | 8 s | 14 s | 36 s |

(Weights sum to 100; normalised at render time. 60 s keeps 7 of 8 beats.)

### A9 Tiny steps + recap
**Lineage:** StatQuest, Crash Course  
**Fits:** procedures, algorithms, taxonomies, definitions that stack (stats, ML recipes, history timelines)

| # | Beat | % | 60 s | 2 min | 5 min |
|---|---|---|---|---|---|
| 1 | What we will learn (1 sentence) + hook example | 8 | 6 s | 10 s | 24 s |
| 2 | Step 1, tiny, with the running example | 14 | 10 s | 17 s | 42 s |
| 3 | Step 2 | 14 | 10 s | 17 s | 42 s |
| 4 | Step 3 | 14 | 10 s | 17 s | 42 s |
| 5 | Assemble: all steps in one picture | 12 | 9 s | 14 s | 36 s |
| 6 | Recap card: the steps as a list | 12 | 9 s | 14 s | 36 s |
| 7 | Edge case / common mistake | 10 | cut | 12 s | 30 s |
| 8 | Sign-off + next topic | 6 | 4 s | 7 s | 18 s |
| 9 | Optional Q/A beat | 10 | cut | 12 s | 30 s |

(Weights sum to 100; normalised at render time. 60 s keeps 7 of 9 beats.)

### A10 Series chapter (cliffhanger)
**Lineage:** Welch Labs, 3b1b chapters  
**Fits:** multi-part builds: one film among several; deep topics that need 3+ episodes

| # | Beat | % | 60 s | 2 min | 5 min |
|---|---|---|---|---|---|
| 1 | Previously: 5-second state of the story | 6 | 4 s | 7 s | 18 s |
| 2 | Today's question (compelling, clear) | 8 | 5 s | 10 s | 24 s |
| 3 | History / context: who tried and why they got stuck | 16 | 10 s | 19 s | 48 s |
| 4 | Partial answer 1 | 20 | 12 s | 24 s | 60 s |
| 5 | Partial answer 2 | 20 | 12 s | 24 s | 60 s |
| 6 | Result, then the new crack it opens | 16 | 10 s | 19 s | 48 s |
| 7 | Cliffhanger: next question, visualized | 10 | 6 s | 12 s | 30 s |
| 8 | Series map card | 4 | cut | 5 s | 12 s |

(Weights sum to 100; normalised at render time. 60 s keeps 7 of 8 beats.)

### A11 Narrative case
**Lineage:** TED-Ed, history/finance stories, Veritasium long-form  
**Fits:** history, finance, economics, anything where a person or event carries the mechanism

| # | Beat | % | 60 s | 2 min | 5 min |
|---|---|---|---|---|---|
| 1 | Character in a situation (in medias res) | 10 | 7 s | 12 s | 30 s |
| 2 | Desire/obstacle | 10 | 7 s | 12 s | 30 s |
| 3 | Event 1 (cause) | 14 | 9 s | 17 s | 42 s |
| 4 | Event 2 (escalation, mechanism shown as diagram over the scene) | 18 | 12 s | 22 s | 54 s |
| 5 | Turn / consequence | 14 | 9 s | 17 s | 42 s |
| 6 | Mechanism isolated from the story | 16 | 11 s | 19 s | 48 s |
| 7 | Modern echo | 10 | cut | 12 s | 30 s |
| 8 | Moral as a question | 8 | 5 s | 10 s | 24 s |

(Weights sum to 100; normalised at render time. 60 s keeps 7 of 8 beats.)

### A12 Counterfactual (remove X)
**Lineage:** Kurzgesagt 'what if', Primer, engineering explainers  
**Fits:** causal systems where one part's role is unclear: why X exists, what X does

| # | Beat | % | 60 s | 2 min | 5 min |
|---|---|---|---|---|---|
| 1 | The system working normally | 12 | 8 s | 14 s | 36 s |
| 2 | Pick one component | 8 | 5 s | 10 s | 24 s |
| 3 | Remove it: first-order effect | 16 | 11 s | 19 s | 48 s |
| 4 | Second-order cascade | 20 | 14 s | 24 s | 60 s |
| 5 | Dose-response: remove half, double | 12 | cut | 14 s | 36 s |
| 6 | Restore it: role named in one sentence | 14 | 10 s | 17 s | 42 s |
| 7 | Where this fails in the real world | 10 | 7 s | 12 s | 30 s |
| 8 | Kicker | 8 | 5 s | 10 s | 24 s |

(Weights sum to 100; normalised at render time. 60 s keeps 7 of 8 beats.)

---

## 6. Using this in the library (suggested)

- Make each device in section 2 a module with `{id, minSec, maxSec, slot, pairsWith}`; make each archetype a list of slots with weights (above).
- 60 s cuts: cold open and cliffhanger are mutually exclusive; recap card optional; running example always on.
- Film + page: assign each beat an anchor id so the interactive page can deep-link.
- Open verification list: watch and time one video per archetype to replace [S] weights with measured ones; the first candidates are 3b1b "But what is a neural network?", Primer aggression, Vox EHT, Veritasium "The Science of Thinking", Welch Labs imaginary-numbers Part 1.

---

## Sources (URL — what was taken)
1. https://www.antoinebuteau.com/lessons-from-grant-sanderson/ [F] — Sanderson: problem-first, mystery, "could have invented", reverse textbook order, visuals first.
2. https://www.theopennotebook.com/2020/01/07/videogram-how-a-vox-video-explains-the-science-behind-the-first-photo-of-a-black-hole/ [F] — Vox EHT video: aerial open, delayed reveal, summary line + music stop, ~20 s music changes, plain narration.
3. https://emergingedtech.com/2014/03/do-video-lessons-reinforce-learning-or-reinforce-incorrect-information [F] — Muller research: misconceptions + correct concepts, learners work harder; videos can feel clear but not teach.
4. https://www.openculture.com/2012/06/expert_gently_asks_whether_khan_academy_videos_promote_meaningful_learning.html [F] — Muller: tackle misconceptions; reasoning past wrong ideas is learning.
5. https://en.wikipedia.org/wiki/Veritasium [F] — channel hallmark (public interviews), thesis title/year, example videos.
6. https://en.wikipedia.org/wiki/Steve_Mould [F] — demo-first, beads/chain fountain.
7. https://kurzgesagt.org/youtube/ [F] — five-phase process, ~12 drafts, VO sets timing.
8. https://towardsdatascience.com/interviewing-statquests-founder-and-ceo-josh-starmer-6f96fe71ec25 [F] — StatQuest tone, origin, process; recap/step structure NOT in source.
9. https://blogs.cornell.edu/info2040/2022/09/12/game-theory-simulating-the-evolution-of-aggression [F] — Primer aggression experiment: injection at day 10 in both directions, Nash ≈ 50/50.
10. https://aperiodical.com/2025/06/eipi-to-watch-welch-labs/ [F] — Welch: compelling clear question, history/context, monthly ~20 min, hand-drawn + Manim. Part hand-off NOT in source.
11. https://ciechanow.ski/ [F] — interactive, step-by-step, stated idealisations, exaggeration; "Moon" essay.
12. https://www.redblobgames.com/making-of/circle-drawing/ [F] — Patel: start from empty diagram, sliders first, reserve colour, hide non-essentials.
13. https://en.wikipedia.org/wiki/Parable_of_the_Polygons [F] — play-then-explain structure, ending.
14. https://nerdist.com/article/the-science-of-thinking-video-veritasium/ [F] — Veritasium "Science of Thinking": bat-and-ball, System 1 "Gun" / System 2 "Drew". Other tasks in the video not described.
15. https://en.wikipedia.org/wiki/Crash_Course_(web_series) [F] — length 6-15 min, recurring segments, Thought Café, expert-written scripts.
16. https://en.wikipedia.org/wiki/3Blue1Brown [F] — Manim, "inventing math" framing, uploads.
17. https://notes.billmill.org/programming/SVG/redblobgames_how_I_write_a_tutorial.html [F, thin] — pointer to Patel's making-of only.
18. Carried from RESEARCH-CHANNELS.md [F there]: Victor Ladder of Abstraction, Explorable Explanations; Nicky Case "How I make an explorable explanation"; Distill "Communicating with Interactive Articles", "Why Momentum Really Works"; 3b1b FAQ, attention and MLP lessons.

**Failed / thin / unverified [K]:** TED-Ed (no usable source fetched); Hank Green pacing in words per minute; Welch Labs series hand-off mechanics; Primer and Welch Wikipedia pages (cache-only, not fetched); Red Blob Games principles page (403); StatQuest recap/"Quest on" structure; Veritasium "Science of Thinking" URL and full task sequence; Kurzgesagt specific video titles/URLs; all video URLs marked [K]; all percentages and durations ([S]).
