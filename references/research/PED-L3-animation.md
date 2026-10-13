# PED-L3: Animation and interactive simulation for learning

Claims are tagged [S#] to the Sources list; unverified ones are marked.

## 1. Findings

**1.1 Animation is not a free win (Tversky, Morrison and Bétrancourt 2002) [S1].** Across studies of complex systems, animation rarely beat equivalent static graphics. Apparent wins were mostly confounds:
- The animation showed more information (microsteps) than the static version.
- It came with interactivity or prediction, which help on their own (Byrne et al. 1999: animation merely matched static graphics plus prediction).
- Viewers could not perceive what was too fast or complex; novices attended to salient surface features, not causal ones (Lowe 1999, as cited).

The paper names two principles. **Congruence**: the structure and content of the graphic should match the structure and content of the concept. **Apprehension**: the graphic must be readily and accurately perceived. It recommends schematizing, slowing down, arrows or highlighting, learner control (pause, replay, speed, zoom), and multiple static frames for discrete steps. Static arrows carry sequence about as well as motion; animation is most plausible for continuous manner of change.

**1.2 Meta-analysis (Höffler and Leutner 2007) [S2].** 26 studies, 76 comparisons, overall d = 0.37.
- **Representational** animation (the topic is depicted): d = 0.40.
- **Decorational** animation (motivational): d = -0.05, which is no benefit.
- By knowledge type: procedural-motor d = 1.06, declarative 0.44, problem-solving 0.24.
- Realism effects are confounded with role and type. Interactive simulations were excluded.

**1.3 Transient information.** Dynamic displays continuously replace content, so learners must hold earlier states in working memory to relate them to later ones. This adds extraneous load [S3, review]. Mitigations from the review [S3]:
- **Segmenting.** Pauses between meaningful units reduce overlapping demands. Hasler et al. 2007 found a benefit with learning time held constant. Mayer and Chandler 2001 found better transfer (cited in S3; the original was not fetched).
- **Event-boundary cueing.** A second proposed mechanism: segmentation marks boundaries and exposes subgoal structure. Whether pauses or boundary cues matter more is unresolved.
- **Learner control.** In Hasler et al., learners who merely had a pause button did better on hard questions, though most did not use it. Many segmenting studies bundled segmenting with learner control.
- **Expertise reversal.** Segmenting helped novices. Learners with higher prior knowledge gained little or nothing (Boucheix and Guignard 2005; Spanjers et al. 2010).
- **Persistent traces** are my inference, not a tested finding here: if load comes from holding vanished states, leaving them visible removes it. S1 supports the neighbouring point that static multi-frame displays allow comparison.

**1.4 Cueing (Boucheix and Lowe) [S4].** In technical animations, perceptual salience (large, fast, bright) is often misaligned with thematic relevance (causally important). In a piano-action study, N = 84:
- Cueing entities by fading the others did little (kinematic test about 45%, versus 38% uncued).
- Cueing relations with a colour band that travels along the causal chain, or with local directional strips at interaction sites, gave about 66% and 61% on the same test.
- Relational cues drew more looking at the low-salience, high-relevance parts (about 52% dwell for local cues versus about 29%).
- Learners only partly obeyed the cues and kept checking elsewhere.
- The authors recommend introducing cues after one uncued cycle, so they read as an add-on to the mechanism.

Caveats: one animation, small sample, cue type confounded with colour.

**1.5 Gesture and embodiment.** Kontra et al. 2015 ran three lab experiments and a randomized college-physics field experiment [S5]. A brief physical experience of the forces behind angular momentum improved quiz scores. Sensorimotor activation mediated the gain. This supports having the viewer act rather than only watch, but it is a physical-force result, not proof that mouse-dragging does the same.

**1.6 Interactive simulations (PhET) [S6].** "Implicit scaffolding" guides students without them feeling guided: an obvious first interaction, familiar controls, immediate feedback, minimal text, a prominent Reset, bounded parameter ranges with boundary-case presets, coordinated representations with consistent colour, scaffolds faded across tabs, and implicit challenges. The evidence is design research plus one student's think-aloud, which the authors call illustrative, so treat the tactics as practitioner-validated, not experimentally proven.

**1.7 Explorable explanations [S7, S8].** Victor: reactive documents, explorable examples, contextual information, with the author still guiding the reader rather than dropping them in a sandbox. Case: use interactivity where it works best (text for abstractions, graphs for relationships, interactives for processes); open with a hook needing no prior knowledge; teach each mechanic in isolation, then combine; playtest (in *Earth: A Primer* explorers skimmed and got confused, so he added gating); guide without controlling.

**1.8 Animated transitions (Heer and Robertson 2007) [S9].** In an experiment with N = 24:
- Animated transitions beat static ones for tracking objects (p < 0.001).
- Staged animation beat direct animation in most conditions, but not for scatter-plot value changes.
- Heavy multi-stage choreography increased error in stacked bars and donuts; axis rescaling raised estimation error.
- The authors suggest stages of about one second.
- Object constancy is argued from the perceptual literature, not measured. Morphing unrelated marks can create false relations.

**1.9 Uncertainty displays.**
- **HOPs (Hullman, Resnick and Adar 2015) [S10].** Animating a finite set of draws gave much more accurate judgments than error bars or violin plots for two or three quantities. For a single quantity, accuracy was similar. HOPs need little statistical background because viewers use counting and integration. Kale et al. 2018 [S11]: HOPs helped viewers identify the correct trend when evidence was weak. Frame duration and count guidance is not in the pages I could read (the PMC article was blocked), so test it.
- **Quantile dotplots (Kay et al. 2016) [S12].** With 50 quantile dots, decisions averaged about 97% of optimal, 5 points better than a no-uncertainty control and less variable. CDFs were nearly as good. Textual uncertainty did worse.
- **Natural frequencies (Binder, Krauss and Bruckmaier 2015; N = 259) [S13].** 42% correct with natural frequencies versus 5% with probabilities. Visual aids lifted natural-frequency problems from 26% to 51%, but probability problems only from 2% to 6%. 2x2 tables and trees performed alike.

**1.10 Sonification.** Evidence is thin and mixed [S14, S15]. S14 reports that sonified recursion beat silent versions, and that sonified sorting improved recall of relative speeds. The page gives no sample sizes and calls one result an experience report. S15 calls the evidence "mixed and mostly preliminary". One cited study found added visuals slowed responses. Its guidance: categories to timbre, continuous variables to pitch or tempo; slow and simplify; explain the mapping in under 30 s first; choose key and mode carefully because they carry emotional associations.

**1.11 Creators on their own principles.**
- **3Blue1Brown [S16].** Visuals before articulating meaning, for "a sense of ownership"; viewers should see they can reach solutions themselves; lead with wonder and story, then go behind the mechanics.
- **Kurzgesagt [S17].** Sourced research, scripts of about a dozen drafts, a visual metaphor chosen per scene, narration timing that guides animators, a composed score per video.
- **The Pudding [S18].** Text-sparse visual essays where data and design carry the story; Blinderman: "Visual stories really need clear, hard, underlying conclusions."
- **Ciechanowski [S19].** No first-person statements found; Wichary observes draggable points everywhere, undo, and colour linking text to the interactive.
- **Primer.** No primary statement of principles found; no claim made.

## 2. Twenty structural rules for animation modules

1. **Earn the motion.** Animate only what changes over time or has a causal manner (a process, a flow, accumulation). Show discrete facts as held frames or small multiples. [S1, S2]
2. **No decorative motion.** Every moving mark is representational. Ambient loops, wobble and parallax are chrome and must never move the thing being explained. [S2]
3. **Congruence.** Animate discrete steps as discrete beats with held states, and continuous change as continuous motion. [S1]
4. **Apprehension budget.** One focal change at a time. Nothing meaningful moves faster or finer than a novice can follow. When two things must be compared, hold one still. [S1, S4]
5. **Schematic by default.** Strip detail that does not carry the mechanism. Add realism only where the realism is the content. [S1; S2 flags realism as confounded]
6. **Persistent trace.** Any transient state the learner must compare leaves a ghost, trail, tally or history lane. (Inference from S3 and the static-frame argument in S1.)
7. **Segment at event boundaries.** Each beat ends in a held pause, minimum 2 s, and the boundary is visibly marked (a chapter tick or a settle). [S3]
8. **Every beat is addressable.** Pause, scrub, step, replay and speed work everywhere. The pure `(t, state, seed)` clock makes this free, so never ship a non-seekable beat. [S1, S3]
9. **Match segmentation to the ladder.** Glance can run continuous. Grasp is segmented. Wield and Master give control to the learner. Offer a skip-to-continuous option for experts. [S3, expertise reversal]
10. **Cue relations, not just entities.** Show the causal link with a travelling colour or pulse along the chain. Do not just dim the bystanders. [S4]
11. **Salience-relevance audit per scene.** Name the one thing the viewer must see. Make it the most salient element by contrast, and shrink or mute large irrelevant movers. [S4, S1]
12. **Cue after the first look.** Show the mechanism uncued once, then add the cue, then fade it as the idea is reused. Expect viewers to look past the cue. [S4, S6]
13. **Predict, commit, reveal.** Prediction is a confound-turned-feature: ask for a guess before animating the outcome. [S1, via Byrne et al.]
14. **First interaction is obvious.** Start in an inviting default state with an obviously draggable object. Use familiar controls, immediate feedback and short labels. [S6]
15. **Safe to explore.** Reset-all is always visible and actions are reversible. Bound slider ranges to productive values and offer boundary-case presets (zero versus maximum). [S6, S19]
16. **Coordinated views.** Linked representations share colour coding and update in sync. Colour links prose to the mark it names. [S6, S19]
17. **Transitions keep object identity.** The same mark persists across data changes. Use simple staging (at most two stages of about 1 s, eased) and never morph unrelated marks. Animate or avoid axis rescales. [S9]
18. **Start small, build big, guide the sandbox.** One mechanic per beat in isolation, then combine. Gate deliberately, and give open play an authored path, challenges or a goal. Playtest with a skimmer. [S7, S8]
19. **Let the body act.** At the Wield rung, make the viewer do the thing (drag, swing, throw) before explaining. Treat this as a hypothesis for screen interaction. [S5, S16]
20. **Sound is additive and declared.** Never put a fact only in audio. Declare the pitch, tempo and timbre mappings in under 30 s up front. Keep key and mode neutral to the claim. Captions mirror sound events. Treat sonification as unproven, so A/B it. [S14, S15]

## 3. Probability and many-runs as animation

The shared concept (0.95^k) is exactly this problem. A single trajectory teaches the wrong thing. The distribution is the message.

**Design pattern: sample, land, stack, freeze.**
1. **Sample.** Show N runs as HOP-style draws. Each draw is seeded, so a film frame stays a pure function of `(t, seed)`. HOPs beat static intervals when viewers compare two or three quantities, such as a 5-step against a 20-step run. For one quantity the gain is small [S10, S11].
2. **Land and stack.** HOPs depend on the viewer integrating across frames, which is the transient-information problem (§1.3). My mitigation, untested in S10 and S11: each draw leaves a persistent dot at its outcome (rule 6), so the animation ends as a histogram.
3. **Freeze to a quantile dotplot.** After the draws, resolve to about 50 quantile dots. Dots are countable, and 50 dots gave near-optimal decisions [S12]. Offer the CDF as an alternate for Master, since CDFs were nearly as good [S12].
4. **Natural frequencies, always.** Say and print "of 100 runs, 60 finish all 10 steps", never "0.599". Use an icon array. This is the single largest effect in the literature here (42% versus 5%), and visualization lifted the frequency format from 26% to 51% [S13]. A probability tree or 2x2 table is no better than the array, so use the array.
5. **Computed, not invented.** Draw the sampled survivors, then overlay the exact expectation 100 × 0.95^k. That gives 95, 90, 86, 81, 77, 74, 70, 66, 63 and 60 at k = 1 to 10, and about 36 at k = 20. Label sampled counts "sketch" and exact values "computed".
6. **Show the variation.** Run two or three seeded draws side by side before collapsing to the expectation. For "what-if", change the check or gate and replay the same seeds.

**Counterfactual caution.** I found no controlled study of what-if animation. Same-seed paired runs make a counterfactual fair, since only the intervention differs, but that is a design argument, not a finding. HOP frame duration and count are unspecified in what I could read, so test with a few non-experts.

## 4. Gaps

- Unreadable: the PMC full text of the HOPs paper (blocked; figures come from the IDL summary) and a Springer page (rate-limited; Mayer and Chandler is cited via S3).
- No primary evidence for persistent traces curing transience (inference), counterfactual animation, or screen-based embodiment.

## Sources

- S1 Tversky, Morrison, Bétrancourt 2002: https://hci.stanford.edu/courses/cs448b/papers/Tversky_AnimationFacilitate_IJHCS02.pdf
- S2 Höffler and Leutner 2007: https://wikicap.ulb.be/images/e/ef/Hoffler_Leutner_2007.pdf
- S3 Spanjers, van Gog, van Merriënboer 2010, segmenting review: https://link.springer.com/doi/10.1007/s10648-010-9135-6 and https://repub.eur.nl/pub/19682/201020040109.pdf
- S4 Boucheix and Lowe, piano animation cueing: https://tecfa.unige.ch/tecfa/teaching/methodo/boucheix-lowe2012.pdf
- S5 Kontra et al. 2015, physical experience and science learning: https://www.psychologicalscience.org/journals/psychological-science/0956797615569355/
- S6 Podolefsky, Moore, Perkins, implicit scaffolding in simulations: https://arxiv.org/pdf/1306.6544
- S7 Bret Victor, Explorable Explanations: https://worrydream.com/ExplorableExplanations/
- S8 Nicky Case, Explorable Explanations: https://blog.ncase.me/explorable-explanations
- S9 Heer and Robertson 2007: https://homes.cs.washington.edu/~jheer/files/2007-AnimatedTrans-InfoVis.pdf (summary: https://idl.uw.edu/papers/animated-transitions)
- S10 Hullman, Resnick, Adar 2015, HOPs: https://idl.uw.edu/papers/hops
- S11 Kale et al. 2018, HOPs for trends: https://idl.uw.edu/papers/hops-trends
- S12 Kay et al. 2016 and Fernandes et al. 2018, quantile dotplots: https://mucollective.northwestern.edu/project/uncertainty-bus and https://mucollective.northwestern.edu/project/when-ish-is-my-bus
- S13 Binder, Krauss, Bruckmaier 2015, natural frequencies and visualization: https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2015.01186/pdf
- S14 Sonification in computing education: https://par.nsf.gov/biblio/10540768
- S15 Sawe, Chafe, Treviño 2020: https://www.frontiersin.org/journals/communication/articles/10.3389/fcomm.2020.00046/pdf
- S16 3Blue1Brown interview, Stanford Daily: https://www.stanforddaily.com/2020/01/24/3blue1brown-creator-grant-sanderson-15-talks-engaging-with-math-using-stories-and-visuals
- S17 Kurzgesagt video process: https://kurzgesagt.org/youtube/
- S18 The Pudding visual essays, Storybench: https://www.storybench.org/?p=8613
- S19 Wichary on Ciechanowski, "Curves and Surfaces": https://unsung.aresluna.org/three-good-interactive-explainers/
