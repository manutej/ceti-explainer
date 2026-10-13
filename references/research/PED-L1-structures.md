# PED-L1: Pedagogical structures for an animated explainer

Effect sizes are as reported in the cited abstracts or papers; "recalled" means I could not retrieve the number.

**Three cross-cutting facts that shape everything below**
1. Animation itself is a weak lever. Animation beats static graphics by only g = 0.23 (61 studies); gains are larger with system pacing (0.31), narration (0.34) and no extra text (0.88) ([Berney & Bétrancourt 2016](https://archive-ouverte.unige.ch/unige:92234)). Many animation wins were confounded by extra information, interactivity or prediction, and animations are often too fast or complex to perceive; the Congruence and Apprehension principles demand a visual that matches the target structure and is readable ([Tversky et al. 2002](https://hci.stanford.edu/courses/cs448b/papers/Tversky_AnimationFacilitate_IJHCS02.pdf)). Learning comes from the method inside the animation, not the motion.
2. Video supplements beat replacements: g = 0.80 added to teaching, 0.28 replacing it ([Noetel et al. 2021](https://www.aera.net/Newsroom/Video-Improves-Learning-in-Higher-Education-A-Systematic-Review)). The film should hand off to doing.
3. Expertise reversal: supports that help novices can hurt experts ([Kalyuga et al. 2003](https://ro.uow.edu.au/edupapers/136)). This is explained by element interactivity ([Chen, Kalyuga & Sweller 2017](https://link.springer.com/10.1007/s10648-016-9359-1)). Audience (C-suite vs engineers) therefore sets pacing and scaffolding.

---

## A. Mayer's CTML principles (the baseline hygiene layer)
**Definition.** Design rules from the Cognitive Theory of Multimedia Learning for extraneous, essential and generative processing.
**Evidence.** Median d from [Mayer 2017](https://www.synapsesocial.com/es/papers/69dbbbdacebd566818835a69): multimedia 1.67, coherence 0.70, signalling 0.46, redundancy 0.87, spatial contiguity 0.79, temporal contiguity 1.30, segmenting 0.70, pre-training 0.46, modality 0.72, personalization 0.79, voice 0.74, embodiment 0.36. These are medians of short lab comparisons. Independent meta-analyses are smaller: signalling d = 0.38 (29 studies) ([Alpizar et al. 2020](https://rex.libraries.wsu.edu/esploro/outputs/journalArticle/A-meta-analysis-of-signaling-principle-in/99900601052901842)); segmenting small to medium, larger for high-prior-knowledge learners on retention ([Rey et al. 2019](https://is.tuebingen.mpg.de/publications/rey2018segmenting)); seductive details harm learning across 58 studies, worse when placed beside the relevant diagram ([Sundar & Adesope 2020](https://news.wsu.edu/2020/03/19/seductive-details-inhibit-learning/)). Boundary: stronger for low-knowledge learners ([Mayer 2017](https://www.synapsesocial.com/es/papers/69dbbbdacebd566818835a69)); modality means spoken, not printed, words ([interview](https://cepsj.si/index.php/cepsj/article/download/1238/595)).
**Use.** Always, as substrate. Relax pre-training and segmenting for experts.
**Requires.**
- COHERENCE: cut decorative particles, parallax and texture; beauty must be load-bearing.
- SIGNAL: one cue at a time (colour, motion, camera push) on the element being narrated, removed after use.
- SEGMENT: hard beat boundaries with a real HOLD (1.5–3 s stillness); paused-equals-playing supports learner-paced stepping.
- PRE-TRAIN: a 5–10 s NAME-THE-PARTS beat before dynamics.
- MODALITY, CONTIGUITY: narration lands with its visual; on-screen text is labels only, placed on the object.
**Failure modes.** Camera moves that hide the referent; text duplicating narration; stale signals; a showpiece shader behind the content.

## B. Worked examples → fading
**Definition.** Show a complete solved case, then progressively remove steps until the learner solves alone ([Renkl & Atkinson 2003](https://asu.elsevierpure.com/en/publications/structuring-the-transition-from-example-study-to-problem-solving--2)).
**Evidence.** Worked-example effect on mathematics: g = 0.48 across 55 studies; correct examples beat incorrect ones; adding self-explanation prompts to examples did not help on average ([Barbieri et al. 2023](https://link.springer.com/article/10.1007/s10648-023-09745-1)). Renkl and Atkinson report supporting evidence for fading; numbers not retrieved.
**Use.** Procedures, novices ("how the loop runs once").
**Requires.** Beat pattern: FULL-CASE → SAME-CASE-WITH-A-GAP (the viewer must fill the last step; backward fading) → NEW-CASE-WITH-TWO-GAPS. Hold on each gap; visually distinguish "given" from "yours." Show the whole case at once, not a drip that taxes memory.
**Failure modes.** Fading too fast; a gap with no consequence; a single example (overfits to surface).

## C. Concreteness fading
**Definition.** Move from concrete, familiar objects to a bridging idealised picture to abstract symbols, with explicit linking ([Fyfe, McNeil, Son & Goldstone 2014](https://link.springer.com/article/10.1007/s10648-014-9249-3)).
**Evidence.** Moderate, mostly lab and maths. Fading beat either extreme (Goldstone & Son 2005), gave best transfer (McNeil & Fyfe 2012), and beat the reverse order with children (Fyfe et al. 2015). Counter-evidence: generic-only won in Kaminski 2008; rich material alone can hurt. Three-stage vs two-stage is untested directly ([Fyfe & Nathan review](https://scholarworks.iu.edu/iuswrrest/api/core/bitstreams/2c814639-f4c7-4091-a6eb-5e6e834bc546/content)).
**Use.** Abstractions with a physical analogue (compounding error, gradient descent); novices and execs; experts may skip the middle.
**Requires.** CONCRETE-SCENE → MORPH (shapes persist while detail drains away; a literal continuous transform) → SCHEMATIC → SYMBOL/EQUATION, with the SAME object tracked through all stages. The morph is the pedagogy, and p5 can share geometry between stages.
**Failure modes.** Rich art never stripped; a cut instead of a morph; symbols with no mapped referent.

## D. Contrasting cases (and invention)
**Definition.** Present minimally different examples side by side so learners notice the critical features before any explanation ([Schwartz et al. 2011](https://www.cadrek12.org/resources/practicing-versus-inventing-contrasting-cases-effects-telling-first-learning-and-transfer)).
**Evidence.** Case comparison overall d = 0.50 over 336 tests. Seeking similarities beat seeking differences alone (d = −0.19), and principle-after-comparison beat principle-before; similarities-then-principle reached d = 1.18 ([Alfieri et al. 2013](https://www.lrdc.pitt.edu/Schunn/papers/ContrastingCasesMeta-AlfieriEtAl2013.pdf)). Inventing before telling gave equal procedure application but better transfer.
**Use.** Distinctions (agent vs chatbot; RAG vs fine-tune).
**Requires.** CASE-A, CASE-B (simultaneous, aligned layouts, same scale and axes) → ALIGN (matched parts glow in pairs) → NOTICE-PROMPT ("what's the same? what drives the difference?") → HOLD → NAME-THE-PRINCIPLE. Cases must differ in exactly the features that matter.
**Failure modes.** Sequential display; cases differing in many ways; naming the principle first.

## E. Productive failure (problem first, then instruction)
**Definition.** Learners attempt an unfamiliar problem unaided, then get the canonical solution built on their attempts (Kapur).
**Evidence.** 53 studies, 166 comparisons: conceptual knowledge and transfer g = 0.36; procedural g = −0.03 (no difference); stronger with high-fidelity designs (0.37–0.58) and older learners; favoured instruction-first for grades 2–5 ([Sinha & Kapur 2021](https://journals.sagepub.com/doi/10.3102/00346543211019105)).
**Use.** Conceptual "why" for adults (why compounding bites, why a verifier changes the maths). Not for procedures or anchor-less novices.
**Requires.** PROBLEM (concrete, unsolved) → COMMIT (viewer proposes a solution, with a visible attempt log) → COMPARE (several plausible attempts shown, including flawed ones) → GAP (show exactly where each breaks) → CANONICAL-SOLUTION that explicitly reuses their attempts. A film cannot enforce an attempt: use a timed hold and a "your move" frame; real PF needs the Wield rung.
**Failure modes.** Solution too soon; under-specified problem; no consolidation.

## F. Predict–observe–explain (POE) / prediction before reveal
**Definition.** Commit to a prediction with a reason, watch the outcome, reconcile the two ([White & Gunstone 1992, summarised by NZCER](https://arbs.nzcer.org.nz/node/7187)).
**Evidence.** Widely used but mostly small qualitative studies; I found no meta-analysis. Supporting pieces: interactive-engagement courses (including prediction) reached normalized gain 0.48 vs 0.23 for traditional courses across 62 courses ([Hake 1998](https://physicscourses.colorado.edu/phys4810/phys4810_fa08/4810_readings/hake.pdf)); the pretesting effect averages dz ≈ 0.6 even when guesses are wrong ([Richland et al. 2009](https://learninglab.uchicago.edu/Pre-Testing_files/RichlandKornellKao.pdf); [later pretesting study](https://link.springer.com/article/10.3758/s13421-021-01218-6)). Predictions should be reasoned, not guesses.
**Use.** Counter-intuitive outcomes (0.95^k collapse).
**Requires.** SETUP → PREDICT (frame with 2–4 options or a slider; 4–8 s timed hold, with a visible countdown) → REASON ("why?") → OBSERVE (play result at a slow, clear tempo) → EXPLAIN (mechanism overlay) → RECONCILE (the viewer's guess stays on screen against the result). In passive MP4 commitment is implicit, so voice the common guess aloud.
**Failure modes.** Hold too short; rushed reveal; confirmed predictions teach little, so pick cases where intuition fails.

## G. Refutation / misconception confrontation
**Definition.** State the misconception, flag it as wrong, then give the correct account with its mechanism.
**Evidence.** Refutation texts g = 0.41 across 44 comparisons ([Schroeder & Kucera 2022](https://link.springer.com/article/10.1007/s10648-021-09656-z)). Physics videos that included misconceptions helped 1,000+ students ([Muller et al.](https://openjournals.library.sydney.edu.au/IISME/article/view/6345)).
**Use.** Strong wrong models ("AI understands", "more steps is smarter").
**Requires.** VOICE-THE-MYTH (shown in a believable "speaker", not a strawman) → FLAG ("this fails because...") → MECHANISM-REPLACEMENT (show the correct model doing the work the wrong one claimed) → CONTRAST-FRAME (wrong and right side by side). Give the myth a distinct treatment so it is not mistaken for the answer.
**Failure modes.** Myth richer than the fix; wrong model lingers; no replacement mechanism.

## H. Analogical encoding and structure-mapping (incl. multiple analogies)
**Definition.** Align relational structure between a familiar source and a new target; comparing two analogs induces the schema (Gentner).
**Evidence.** Studying two cases by comparison beat studying them separately in negotiation transfer ([Gentner, Loewenstein & Thompson 2003](https://www.kellogg.northwestern.edu/academics-research/research/detail/2003/learning-and-transfer-a-general-role-for-analogical-encoding)). With one analog, summaries, principles and diagrams did not help; with two they did ([Gick & Holyoak 1983](https://deepblue.lib.umich.edu/items/196ea13e-fb69-4a74-a6f9-864c81aed465)). Two analogs help only if scaffolded ([Gray & Holyoak 2020](https://par.nsf.gov/servlets/purl/10330103)).
**Use.** New mechanisms ("agent like a thermostat").
**Requires.** SOURCE-SCENE → TARGET-SCENE → MAP (draw lines between corresponding roles, shown one pair at a time) → SECOND-ANALOG (different surface, same structure) → EXTRACT (what both share) → BREAK-THE-ANALOGY (where it fails). Matched roles share position, colour and motion across scenes.
**Failure modes.** Surface-only metaphor; implicit map; unmarked break.

## I. Generation and retrieval effects
**Definition.** Producing or retrieving information, even before or instead of re-studying, strengthens memory.
**Evidence.** Testing effect g ≈ 0.50–0.61 in lab meta-analyses and 0.54–0.67 in classrooms; feedback increases it, and low retrievability without feedback removes it ([review in Greving & Richter 2018](https://www.frontiersin.org/articles/10.3389/fpsyg.2018.02412/pdf)). A generation-effect meta-analysis exists ([Bertsch et al. 2007](https://pubmed.ncbi.nlm.nih.gov/17645161/)); I did not retrieve its effect size (recalled as medium).
**Use.** Recap; Grasp→Wield handoff.
**Requires.** BLANK a key element (HOLD 3–5 s) → RECALL → REVEAL with feedback; space recalls across the film and sessions. Use a fill-in diagram, not a quiz slide.
**Failure modes.** No feedback; trivia instead of mechanism; rhetorical questions with no interaction.

## J. Self-explanation prompts
**Definition.** Prompts to explain why a step or fact holds.
**Evidence.** g = 0.55 across 64 studies; self-generated beat instructor-provided; multiple-choice selection was weakest; metacognitive prompts weaker ([Bisra et al. 2018 summary](https://bps.org.uk/research-digest/self-explanation-powerful-learning-technique-according-meta-analysis-64-studies)). But Barbieri found prompts added to worked examples did not help in maths.
**Use.** Mechanism beats; Wield rung.
**Requires.** PAUSE-WITH-WHY frame at causal joints ("why did the second step fail?"), then an EXPERT-EXPLANATION beat to compare against. Prompts go on causal links, not on definitions.
**Failure modes.** Prompts too frequent; pause too short; no answer to check against.

## K. Natural frequencies (Gigerenzer) for probability
**Definition.** Counts of a concrete population ("of 1,000 runs, 600 finish") instead of "0.95 probability".
**Evidence.** Bayesian-consistent answers about 46–50% with frequency formats vs 16–28% with probabilities ([Gigerenzer & Hoffrage 1995](https://pages.ucsd.edu/~scoulson/203/GG_How_1995.pdf)). With managers the gain was smaller and for executives not significant (36.2% vs 26.6%, p = 0.095); overall 38.8% vs 19.7% ([managers study, Frontiers 2015](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2015.00642/full)). So let the visual do the arithmetic.
**Use.** Compounding reliability, false positives, risk.
**Requires.** POPULATION (a dot grid of 1,000) → SPLIT (dots peel off at each step, counted live) → SURVIVORS (final count labelled as a whole number) → only then the percentage. Computed, not invented: 0.95^10 ≈ 0.60 so 599 of 1,000.
**Failure modes.** Percentages first; shifting reference class; uncountable dots (group in 100s).

## L. Multiple external representations (Ainsworth's DeFT)
**Definition.** Design, Functions, Tasks: representations complement, constrain or construct understanding, but learners must translate between them ([Ainsworth 2006](https://nottingham-repository.worktribe.com/output/23577631/deft-a-conceptual-framework-for-considering-learning-with-multiple-representations)).
**Evidence.** Conceptual framework; benefits often fail because of translation load. No meta-analytic effect size found.
**Use.** Mechanism plus number (loop diagram with a success-versus-steps curve).
**Requires.** One representation per beat unless it is a LINK beat: a drawn connector tying a value in one view to a mark in the other (a bar rises as the loop turns). Each view must add something the other lacks.
**Failure modes.** Redundant views; four panels at once; no explicit mapping.

## M. Narrative structure
**Definition.** Protagonist, goal, obstacle, turn, resolution.
**Evidence.** Stories are better understood and remembered: g = 0.55 over 37 articles; memory 0.72, comprehension 0.48; very heterogeneous, with possible publication bias ([Mar et al. 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC8219577)). It compares narrative with expository texts, not story wrappers on mechanism; seductive details are the warning.
**Use.** Glance spine; anything with a human stake.
**Requires.** GOAL → ATTEMPT → COMPLICATION (the compounding failure) → INSIGHT → RESOLUTION, with the concept as the plot, not decoration.
**Failure modes.** Plot irrelevant to mechanism; humour breaking the causal chain.

---

## Summary table

| Structure | Beat pattern | Interaction | Best concept type | Risk |
|---|---|---|---|---|
| CTML hygiene | NAME → SIGNAL → HOLD | Pause, step | All; best for novices | Decoration as clutter |
| Worked example + fading | FULL → GAP → TWO-GAPS | Fill the gap | Procedures | Expertise reversal |
| Concreteness fading | CONCRETE → MORPH → SCHEMA → SYMBOL | Scrub the morph | Physical-analogue abstractions | Cut not morph |
| Contrasting cases | A, B → ALIGN → NOTICE → NAME | Drag to align | Distinctions, categories | Name given before noticing |
| Productive failure | PROBLEM → COMMIT → COMPARE → GAP → SOLUTION | Enter attempt | Conceptual "why" (adults) | Unenforceable in passive video |
| POE / prediction | SETUP → PREDICT → OBSERVE → EXPLAIN | Choose, then run | Counter-intuitive outcomes | Short hold |
| Refutation | MYTH → FLAG → REPLACE → CONTRAST | Vote on myth | Entrenched misconceptions | Myth outshines fix |
| Analogy / mapping | SOURCE → TARGET → MAP → 2ND → BREAK | Click to map | New mechanisms | Surface-only metaphor |
| Generation / retrieval | BLANK → RECALL → FEEDBACK | Fill-in, spaced | Retention, recap | No feedback; trivia |
| Self-explanation | JOINT → WHY → EXPERT | Type or say | Causal chains | Fatigue |
| Natural frequencies | POPULATION → SPLIT → SURVIVORS → % | Set per-step rate | Compounding, base rates | Percentage first |
| Multiple representations | ONE view → LINK → second | Hover to link | Mechanism plus quantity | Translation load |
| Narrative | GOAL → ATTEMPT → COMPLICATION → INSIGHT | Optional branch | Glance spine | Seductive details |

**Implications.** Chromes should differ in how they express moves, not which moves exist; HOLD, GAP and PREDICT are first-class beats. Pairings: compounding reliability = POE + natural frequencies + concreteness fading; "what an agent is" = contrasting cases + refutation; "why checks help" = productive failure + worked example. Passive MP4 only simulates commitment and generation; the Wield rung earns them.
