# Pedagogical structures from learning science, mapped to animation modules

Purpose: a map of pedagogical moves that a 2-5 minute animated explainer (film or interactive page) can implement, so each move becomes one reusable module in the p5-explainer library.

Evidence-confidence key used throughout:
- [V] = figure or claim checked against a primary or abstract page during this pull (URL in Sources).
- [M] = from memory of the literature, citation given; verify the number before quoting it in client material.
- Effect sizes are d or g unless noted. "Contested" is flagged wherever replication or moderators are a live issue.

Three cross-cutting cautions, stated once:
1. Most of this literature is lab or classroom work on 5-60 minute lessons, mostly with students. Transfer to a public 3-minute film is an inference, not a finding. Treat module "durations" below as design proposals.
2. Animation per se is not the active ingredient. The best-known review (Tversky et al. 2002) found most animation advantages vanish when the static comparison is equated for information and interaction. Pedagogy lives in the moves, not the motion.
3. Nearly every effect below has an expertise boundary (it helps novices, shrinks or reverses for experts). Design for a declared audience level, not "everyone".

---

## 1. Mayer's multimedia principles and the animation-specific literature

### 1.1 The principles (Mayer, Multimedia Learning, 3rd ed. 2021; Mayer & Fiorella 2014; Cambridge Handbook of Multimedia Learning)
Median effect sizes as reported in Mayer's own syntheses [M]; treat as approximate and as Mayer-lab-weighted.

| Principle | What it is | Reported median d | Notes / contested |
|---|---|---|---|
| Coherence | Delete interesting-but-irrelevant words, pictures, sounds, music | ~0.86 (extraneous material) | Seductive-details meta-analysis (Rey 2012) found a smaller, d ~0.3 retention cost [M]. Background music and decoration are the usual offenders. |
| Signaling | Cues that highlight organisation or key items (arrows, colour, bolding, spoken emphasis) | ~0.41 | Contested: Richter, Scheiter & Eitel 2016 meta-analysis found small positive effect, mainly on retention and for lower-prior-knowledge learners; effects weaker on transfer; eye-tracking shows attention shifts but not always comprehension [M]. |
| Redundancy | Do not present identical narration plus on-screen text | ~0.86 | Contested at the edges: helps for non-native speakers, very complex/technical text, or when text is short key terms. Yue, Bjork & Bjork 2013 argue reducing verbal redundancy can be an "undesired desirable difficulty" [M]. |
| Spatial contiguity | Put words next to the part of the graphic they describe | ~0.82 | Robust (Ginns 2006 meta-analysis [M]). |
| Temporal contiguity | Present narration and matching visual at the same time | ~1.22 | Strongest in Mayer's table, but few studies, mostly short lessons. |
| Segmenting | Learner-paced or system-paused chunks beat one continuous stream | ~0.67 | Rey et al. 2019 meta-analysis: smaller, with moderators (complexity, pacing) [M]. Spanjers, van Gog & van Merrienboer 2010 give the mechanism [M]. |
| Pre-training | Teach names and behaviours of key components before the process lesson | ~0.75 | Helps novices on complex systems; low-complexity content shows little gain. |
| Modality | Narration plus graphics beats on-screen text plus graphics | ~0.76 | Ginns 2005 meta-analysis [M]. Reverses for learner-paced text, long/complex or symbolic text, or noisy listening conditions. |
| Personalization / voice | Conversational style, human voice | ~1.0 / 0.74 | Ginns, Martin & Marsh 2013: conversational style d ~0.30 [M]. Mayer-lab effects larger than independent replications. |
| Image (speaker's face) | Seeing the narrator's face does not help | ~0 | Useful null: do not spend screen on a talking head for learning reasons. |

Honest summary: the direction of coherence, contiguity, modality, segmenting is well replicated; the magnitudes are inflated by short single-session lab tests with immediate retention/transfer and by author-lab studies. Signaling, redundancy and personalization are the most boundary-condition-sensitive.

### 1.2 Animation-specific findings

- **Tversky, Morrison & Betrancourt (2002), "Animation: can it facilitate?" Int. J. Human-Computer Studies 57:247** [V]. Two principles.
  - Congruence: the structure/content of the external representation should match the structure/content of the mental model you want. Animation suits change over time; it is not automatically congruent (a static diagram of a mechanism can be congruent too).
  - Apprehension: the graphic must be accurately perceivable and comprehensible. Fast, simultaneous, or cluttered animated changes are misperceived; people segment continuous events into discrete steps anyway.
  - Equivalence critique: many pro-animation studies gave the animation more information, interactivity, or prediction tasks than the static control. With controls equated, benefits mostly vanish. Animation may help with fine-grained microsteps and real-time orientation change, and when learner-paced.
- **Hoffler & Leutner (2007), "Instructional animation versus static pictures: a meta-analysis", Learning and Instruction 17:722** [V]. 26 studies, 76 comparisons: overall d = 0.37 (CI 0.25-0.49) favouring animation. Representational animation d = 0.40, decorative animation smaller. Realistic/video-like animation d = 0.76. Procedural-motor knowledge d = 1.06 (largest). So: animation pays off most for "how to do/manipulate a thing", and when the animation depicts the content rather than decorating it. Weaker for abstract conceptual content. (Note this is d around 0.4, "moderate", not a revolution.)
- **Lowe (2003), "Animation and learning: selective processing of information in dynamic graphics", Learning and Instruction 13:157** [M]. Novices attend to what is perceptually salient (large, fast, high contrast), not what is thematically relevant. Result: they miss the causally important but subtle changes. Lowe & Boucheix (2008, 2011) and Boucheix & Lowe (2010) [M]: the Animation Processing Model describes staged building of a mental model (from isolating events to relating them to whole-system causal structure); cueing that guides attention in a *spatially and temporally precise* way helps, but only when the cue matches the processing stage and the viewer is not already overloaded; continuous "internal" cues (e.g., colour/contrast changes in the object) beat added external pointers in some eye-tracking work. Ambiguous overlays can backfire.
- **Betrancourt (2005)** and **Schnotz & Rasch (2005)** [M]: "enabling vs facilitating" animation. Animation helps low-ability/low-spatial learners by doing the mental animation for them (enabling) but can *hurt* high-ability learners by short-circuiting their own mental simulation. Another route to the expertise reversal below.
- **Hegarty (2004), Ainsworth (2008)** [M]: the "transience" problem; each frame vanishes, so working memory must hold the past while processing the present. Pausing, replay, stepping, trails/ghosts of previous states mitigate this.
- **Mayer & Anderson (1991/92)** [M]: concurrent narration with animation beat narration-before/after; the origin of the contiguity result for animations.
- **Fiorella & Mayer (2018), "What works and doesn't work with instructional video"** [M]: review of video-specific guidance: signal, segment, remove decoration, use conversational style; learner-generated activities after video.

### 1.3 What this means for an animation
- On screen: one event at a time; the narrated noun and its visual appear within the same second; labels sit on the object, not in a legend; no ambient music-as-decoration; at most 3-5 elements entering per beat (fuzzy; Cowan 4-chunk limit is the inspiration, not a hard cap).
- When: cue (flash, outline pulse, camera push, colour hold) 200-500 ms *before* the narration names the thing, then release the cue; reserve a pause after any change that is causally critical.
- Viewer does: in film, nothing but watch; in interactive page, controls for step/replay/scrub, and a "pause on the key frame" affordance.
- Backfires: fast transitions that carry the key causal step; decoration; text duplicating narration; cues on everything (cue inflation = no cue).

---

## 2. Cognitive load theory (Sweller, Kalyuga, Paas, Renkl)

Core: working memory is tiny and long-term memory holds schemas. Instruction should minimise extraneous load, manage intrinsic load (element interactivity), and encourage germane processing (schema construction). [Sweller 1988; Sweller, van Merrienboer & Paas 1998; Sweller, Ayres & Kalyuga 2011, all M].

### 2.1 Worked-example effect
- What: for novices, studying fully worked solutions beats solving equivalent problems (Sweller & Cooper 1985; Cooper & Sweller 1987 [M]).
- Evidence: robust across maths, physics, programming; a 2023 meta-analysis of worked examples in mathematics reports g ~ 0.48 (Barbieri et al., Educational Psychology Review) [M]. Strongest for novices on well-structured problems. Contested outside that: CLT is critiqued as hard to falsify (de Jong 2010 [M]) and the "minimal guidance" debate (Kirschner, Sweller & Clark 2006 vs Hmelo-Silver, Duncan & Chinn 2007 [M]) is unresolved for ill-structured domains.
- Helps: novices, high element-interactivity content (a procedure, a derivation, a calculation). Backfires: once learners have the schema (expertise reversal, below), or when learners passively watch without processing (Renkl: need self-explanation).
- Animation implication: "show the whole solved case, step labelled, with the structure of the step visible" (subgoal labels, colour-coded roles). The film *is* a worked example by default. Add self-explanation prompts (Chi et al. 1989; Bisra et al. 2018 meta-analysis g ~ 0.55 [M]) as a pause: "why did that step follow?"

### 2.2 Completion problems and fading
- Completion problem (van Merrienboer): a worked example with a step left blank for the learner. Fading (Renkl & Atkinson 2003; Atkinson, Renkl & Merrill 2003 [M]): backward fading removes solution steps one at a time starting at the end, across successive examples; better than abrupt example-to-problem switch for transfer.
- Animation implication: in a multi-example film or a page with stacked examples, example 1 fully narrated, example 2 last step blank ("you finish it"), example 3 two steps blank. In a film, the "blank" is a 3-second silence with an outlined placeholder, then the reveal. In a page, an input.

### 2.3 Expertise reversal (Kalyuga, Ayres, Chandler & Sweller 2003, Educational Psychologist 38:23; Kalyuga 2007 [M])
- Finding: instructional supports (worked steps, integrated labels, redundant explanation, signaling) that help novices become neutral or harmful for more knowledgeable learners, because processing the support competes with their existing schema.
- Effect direction: interaction effect, reliably replicated across many domains; magnitude varies. Moderately well supported, not universal (Kalyuga 2007 notes measurement of expertise is the hard part).
- Design implication: declare audience level per module; provide a "skip the basics" path (interactive) or two cuts (film). For mixed audiences, put the expert-reversal-prone supports behind opt-in controls (reveal the step labels on demand).
- Related: Sweller's "split attention" (physically integrate related sources) is the CLT parent of Mayer's contiguity.

### 2.4 Nuggets for module design
- Intrinsic load rises with *element interactivity*, not element count. Isolate-then-integrate ("isolated elements", Pollock, Chandler & Sweller 2002 [M]): first present parts one by one without their interactions, then the interacting whole.
- Variability of practice (examples differing in surface) helps only after the schema has a start (Paas & van Merrienboer 1994 [M]).
- Imagination effect: late-stage learners profit from imagining the procedure instead of re-reading (Cooper et al. 2001 [M]); this licenses a "close your eyes" beat for experts.

---

## 3. Prediction, pretesting, generation, retrieval, desirable difficulties

### 3.1 Predict-Observe-Explain (POE) and predict-first demonstrations
- What: learner commits to a prediction, sees the outcome, then reconciles. Origin: Champagne, Klopfer & Anderson (1980); named and systematised by White & Gunstone (1992), "Probing Understanding" [M].
- Evidence: Crouch, Fagen, Callan & Mazur (2004), "Classroom demonstrations: learning tools or entertainment?", Am. J. Phys 72:835 [M]: students who predicted and discussed before a demonstration answered later conceptual questions significantly better than those who just watched; passive-watching of a demo gave little more than no demo. Sokoloff & Thornton's Interactive Lecture Demonstrations and Hake (1998) on interactive engagement are the larger-scale supports [M]. Video-specific: Kestin & Miller (2022), PRPER 18, 010148 [V]: four versions of one physics video; embedded questions with targeted feedback increased learning, and the benefit was largest when combined with enhanced visuals (no effect sizes on the abstract page). Also Kim, Reinecke & Hullman (2017), "Explaining the gap: visualizing one's predictions improves recall and comprehension of data", CHI [M]: drawing a predicted trend before seeing data improved recall (the "You Draw It" pattern).
- Brod (2021), "Predicting as a learning strategy", Psychonomic Bulletin & Review [M]: prediction works partly through error signals and attention to the discrepant feature; effects reduced when the prediction is a blind guess with no relevant prior.
- Helps: when learners hold some prior model (even wrong); phenomena with counter-intuitive outcomes. Backfires: no prior knowledge (guessing is noise); no feedback or explanation after the outcome (can entrench the wrong prediction or leave it unreconciled); public films where nobody actually commits (silent "think about it" is often skipped).
- Animation implication: freeze before the outcome; show the setup and 2-3 plausible outcomes or an input (slider/sketch); the film cannot enforce commitment, so use a forced-pause and a visible countdown, or ask for a tap/keypress; then play the outcome, then explain the gap in the narration ("If you said B, here is what you probably assumed").

### 3.2 Pretesting / errorful generation
- Richland, Kornell & Kao (2009), JEP: Applied 15:243 [M]: unsuccessful retrieval attempts before study improve later learning of the studied material. Kornell, Hays & Bjork (2009) [M]: guessing a cue-target answer wrong then seeing it beats reading it, even though guesses were wrong. Carpenter & Toftness (2017), prequestions before a video lecture improved memory for the pre-questioned content, with weaker spillover to non-pre-questioned content [M]. Pan & Sana (2021): posttesting often beat pretesting for overall gains; pretest benefit is real but often smaller [M]. Net: pretesting is a modest, reliable, *targeted* effect; do not oversell.
- Implication: open with 1-3 questions that the film will answer; later the film explicitly "closes" each. Pairs with curiosity (Section 8).

### 3.3 Generation effect
- Slamecka & Graf (1978) [M]; Bertsch et al. (2007) meta-analysis d ~ 0.40 [M]: self-generated items are remembered better than read items. Boundary: strong for item memory, weaker and sometimes null/negative for complex conceptual material if generation is unconstrained (the learner generates something wrong and remembers that).
- Implication: let the viewer complete the pattern, fill in the number, or draw the curve; always follow with the correct version.

### 3.4 Retrieval practice / testing effect
- Roediger & Karpicke (2006), Psychological Science 17:249; Karpicke & Blunt (2011), Science 331:772 (retrieval practice beat concept mapping) [M]. Meta-analyses: Rowland (2014) g ~ 0.50; Adesope, Trevisan & Sundararajan (2017) g ~ 0.61 [M]. Dunlosky et al. (2013) rates practice testing high-utility [M]. Szpunar, Khan & Schacter (2013), PNAS: interpolated memory tests during a recorded lecture reduced mind-wandering and raised final-test performance [M].
- Contested edges: benefits measured after delays; effect on deep transfer is smaller; testing anxiety; lab-vs-classroom gap narrowing but nonzero.
- Implication: a 3-minute film can insert one retrieval beat (question about something shown 30-60 seconds ago) and one end-of-film recap question. Interactive pages can use spaced re-asks (email/next-visit) but that is out of film scope.

### 3.5 Desirable difficulties (Bjork 1994; Bjork & Bjork 2011) [M]
- Spacing, interleaving, testing, and generation make performance during learning worse but long-term retention/transfer better. Caveat that matters for film design: the benefit is conditional on the learner having the background to succeed with effort (McDaniel & Butler 2011 [M]). Fluency-manipulation "difficulties" such as disfluent fonts failed to replicate (Diemand-Yauman et al. 2011; Rummer et al. 2016 [M]), a standing warning against cargo-cult difficulty. Interleaving (Kornell & Bjork 2008; Rohrer) helps category discrimination, mostly in practice phases, hard to implement in a 3-minute explainer except as "mixed examples" in a comparison.
- Implication: use difficulty that forces the *relevant* processing (predict, compare, complete), never cosmetic obstruction.

---

## 4. Concreteness fading and comparison

### 4.1 Concreteness fading
- What: present the idea first in a concrete, familiar instance, then progressively idealised/schematic, then fully abstract/symbolic, with explicit links between stages. Rooted in Bruner's enactive-iconic-symbolic (1966).
- Evidence: Goldstone & Son (2005), J Learning Sciences 14:69 [M]: concrete-then-idealised simulations (fading) gave best transfer of a scientific principle versus either alone. McNeil & Fyfe (2012), Learning and Instruction 22:440 and Fyfe, McNeil & Borjas (2015) [M]: fading improved transfer for mathematical equivalence/algebra tasks. Fyfe, McNeil, Son & Goldstone (2014), Educational Psychology Review 26:9, systematic review [V title/abstract]: support for the pattern across maths and science, mostly small studies.
- Contested: Kaminski, Sloutsky & Heckler (2008), Science 320:454 [M]: abstract symbols alone gave better transfer than rich concrete contexts (counter-evidence, and its own replication debates). Kokkonen & Schalk (2021), Educational Psychology Review 33:797 [V]: "concreteness fading may not be as generalizable as has been suggested"; positive in maths, mixed or null in physics (some studies favour idealised-first) and chemistry, because concrete/abstract are not one scale there (macro/micro/symbolic are complementary levels, not rungs). Mostly small samples, short tasks.
- Helps: arithmetic/algebraic structure, scale-free principles with an easy familiar instance. Backfires: concrete context that is too rich invites surface features (Son & Goldstone 2009 [M]); when the concrete instance has misleading features; in domains where the concrete level carries essential detail.
- Animation implication: a natural fit. Sequence on screen: (1) the thing itself (real objects, a story), (2) the same thing drawn as simple shapes, *morphing* continuously (same positions) so the mapping is visible, (3) the schematic with labelled roles, (4) the symbol/equation, again by morphing, with the old forms ghosted. The viewer sees correspondence because the objects physically transform. Never cut between levels without a shared anchor.

### 4.2 Comparison / analogical encoding / contrasting cases
- Gentner (1983) structure-mapping; Gentner, Loewenstein & Thompson (2003), J Educational Psychology 95:393 [M]: comparing two cases while explicitly aligning them leads to schema abstraction and transfer much better than studying each separately. Kurtz, Miao & Gentner (2001) "analogical bootstrapping" [M]. Gick & Holyoak (1983) schema induction [M]. Chi, Feltovich & Glaser (1981): novices sort by surface features, experts by deep structure [M].
- Alfieri, Nokes-Malach & Schunn (2013), Educational Psychologist 48:87 [V]: 57 experiments, 336 tests, case comparison d = 0.50 (CI .44-.56) versus other conditions. Moderators: asking learners to find *similarities* was best (and similarities-only with the principle given afterward gave d = 1.18); presenting the principle after the comparison beat before-or-none; effects bigger for perceptual than procedural content; weaker at delayed test. Large heterogeneity, so the headline figure is an average of very mixed designs.
- Schwartz & Bransford (1998), "A time for telling", Cognition and Instruction 16:475 [M]: students analysing contrasting data sets then hearing a lecture outperformed those who only read or only analysed; analysis creates "differentiation" that makes the telling meaningful. Schwartz, Chase, Oppezzo & Chin (2011), J Ed Psych 103:759 [M]: inventing from contrasting cases beat practicing with them for transfer.
- Rittle-Johnson & Star (2007) [M]: comparing two worked solution methods beat studying them sequentially (note: benefit relies on some prior knowledge).
- Helps: concepts defined by invariants across instances; trade-offs; "when to use which". Backfires: novices who cannot yet see the aligned structure; cases differing on too many dimensions; no explicit alignment (they compare surface features).
- Animation implication: split-screen or ghost-overlay of two cases, with matching elements pulsing in the same colour; hold the alignment before narrating the principle; the principle name appears *after* the viewer has seen the invariant. Variants: one-dimension-at-a-time contrast (change one variable, rest fixed).

---

## 5. Conceptual change and misconception confrontation

- Posner, Strike, Hewson & Gertzog (1982), Science Education 66:211 [M]: conceptual change needs (a) dissatisfaction with the existing conception, (b) the new one is intelligible, (c) plausible, and (d) fruitful. Frequently cited as an organising checklist; the "cold" rationalist framing is criticised (Pintrich, Marx & Boyle 1993 on motivation and affect [M]).
- Chi: Chi, Slotta & de Leeuw (1994); Chi (2008) "Three types of conceptual change: belief revision, mental model transformation, and categorical shift" [M]. Hard cases are categorical shifts (e.g., treating heat or current as a substance versus as a process; emergent processes without a controller, Chi 2005). Implication: these need a new *ontological category* introduced, not just a corrected fact; a bare contradiction is insufficient.
- Knowledge-in-pieces (diSessa 1993; Smith, diSessa & Roschelle 1993 "Misconceptions reconceived") [M]: intuitions are fragmentary p-prims, not coherent wrong theories; so instruction should reuse/reorganise productive pieces, not only delete a theory. This is a live theoretical contest with the "naive theory" view (Vosniadou, Carey).
- Refutation texts: Guzzetti, Snyder, Glass & Gamas (1993) meta-analysis found that refutational/conceptual-change text outperformed expository text; Tippett (2010) review; Kendeou & van den Broek, Kendeou et al. (2014): co-activation of the misconception and the correction in the same passage supports knowledge revision [M].
- Misinformation correction: Lewandowsky et al. (2012) PSPI 13:106 and The Debunking Handbook 2020 [M]: lead with the fact, warn before showing the myth, explain why the myth is wrong, restate the fact (fact-myth-fallacy-fact). Familiarity-backfire fears (Skurnik et al. 2005; Schwarz et al. 2007) have largely not held up as general, but repeating a myth without a stronger alternative explanation leaves a gap the myth refills ("continued influence").
- **Misconception-first videos (Muller)**: Muller, Sharma & Reimann (2008), Science Education 92:278 "Raising cognitive load with linear multimedia to promote conceptual change", and Muller, Bewes, Sharma & Reimann (2008), J Computer Assisted Learning 24:144 "Saying the wrong thing: improving learning with multimedia by including misconceptions" [M title/venue; abstract page checked for Muller & Sharma programme: 1000+ students over three years, interviews plus quantitative data; misconceptions give a false sense of knowing, reducing mental effort, and interfere with recall of newly learned concepts; presenting common misconceptions alongside the right explanation helped students overcome these (V)]. Findings are strongest for learners holding the misconception; in the studies, a clean "expert-only" explanation felt clearer and was rated higher, yet produced less learning than the explanation that included the misconception (the "feels clearer, learns less" result). Muller's PhD (Univ. Sydney, 2008) is the primary document. This is the empirical basis for the Veritasium thesis ("start from what people believe"). Caveats: few independent replications; effect sizes not on the abstract page [V: absent]; Veritasium's own channel write-up is not peer review; novices with *no* prior belief may only be confused by a wrong account; the format needs the correct model to be fully worked out afterward.
- Animation implication: show the common wrong model **running** (it should visibly fail on a case the viewer cares about), then the discrepancy, then the better model, then the better model succeeding on that same case. The wrong model gets a name and a colour (red) and is never left as the final image. Keep the failure reproducible by the viewer (same inputs). Order rule (from Posner): dissatisfaction first, then intelligible, plausible, fruitful, so after the new model works, show it predicting something new.

---

## 6. Productive failure and invention activities

- Kapur (2008), Cognition and Instruction 26:379; Kapur (2010, 2014); Kapur & Bielaczyc (2012), J Learning Sciences 21:45; Kapur (2016), Educational Psychologist [M]: students attempt ill-structured problems before instruction (generate and explore solutions, mostly failing), then receive consolidation/instruction. Result: lower initial problem-solving, higher conceptual understanding and transfer on posttest than direct-instruction-first.
- Schwartz & Martin (2004), Cognition and Instruction 22:129 [M]: invention activities ("inventing to prepare for future learning") prepare learners to benefit from subsequent instruction; Loibl, Roll & Rummel (2017), Educational Psychology Review 29:693 propose mechanisms: activation of prior knowledge, awareness of knowledge gaps, then attention to critical features in instruction [M].
- Meta-analysis: Sinha & Kapur (2021), Review of Educational Research 91:761, "When problem solving followed by instruction works: evidence for productive failure" [V study count only]: 53 studies, 166 comparisons; problem-solving-then-instruction outperformed instruction-then-problem-solving on conceptual understanding and transfer, with benefits larger for secondary/undergraduate than primary, in maths/science (no exact effect size on the news pages checked; the paper reports g of about 0.36 overall and higher under high-fidelity PF design [M, verify]). Strongest when: learners can attempt the problem (some prior knowledge, e.g., know the mean before variance), problem is graspable yet requires the target concept, and the instruction afterwards builds on the learner-generated solutions (compare and contrast them).
- Contested: Glogger-Frey et al. (2015) found no benefit of inventing before worked examples for some tasks; Kirschner/Sweller camp argue it fails novices on load grounds; positive findings are concentrated in the Kapur and Schwartz groups [M]. Procedural skills see little or no benefit.
- Animation implication: **a film cannot run a real invention phase for strangers**; the fair proxy is "stage-the-struggle": give the viewer the problem and an interval (10-30 seconds, with a ticking visual) to attempt it in their head or on paper, show 2-3 *typical flawed attempts* (the class's likely solutions), show how each fails on a probe case, then deliver the canonical method as the thing that fixes all of them. For interactive pages, let the viewer drag/sketch a solution before the reveal; log nothing, just show how theirs scores against the canonical.

---

## 7. Dual coding, ladder of abstraction, explorable explanations, research debt

- **Dual coding** (Paivio 1971, 1986; Clark & Paivio 1991, Educational Psychology Review 3:149) [M]: verbal and imagery systems are separate but linked; concrete words/pictures are encoded in both, giving two retrieval routes (picture superiority effect). Solid for item memory of concrete material. Weaker evidence that "adding an image" generally improves understanding of abstract relations; not the same as the discredited "learning styles" (Pashler et al. 2008 [M]): dual coding is about *every* learner benefiting from both codes, not matching a preferred modality. Mayer's modality/multimedia principles are the applied descendant.
- **Ladder of abstraction** (Bret Victor, 2011, "Up and Down the Ladder of Abstraction") [V title: worrydream.com]: design essay, not an empirical study. Idea: show a system's behaviour in a concrete instance, let the reader vary one parameter and watch, climb to the abstraction (the general rule/plot over all parameters), and descend again. Claims to support from the literature: concreteness fading, variation (see Goldstone), and simulations. No direct experimental test of the essay's format that I could find.
- **Explorable explanations** (Victor 2011; Nicky Case et al., explorabl.es; Distill) [M]: reader-manipulable models embedded in text. Empirical anchors for interactive simulation: Rutten, van Joolingen & van der Veen (2012), Computers & Education 58:136: simulations enhance learning in science, particularly when used to supplement traditional instruction [M]; Wieman, Adams & Perkins (2008), Science 322:682 on PhET [M]; Alfieri, Brooks, Aldrich & Tenenbaum (2011), J Ed Psych 103:1: unassisted discovery is worse than explicit instruction, *guided* (feedback, scaffolded, worked-example) discovery is better [M]; de Jong & van Joolingen (1998) on discovery with simulations needing scaffolds [M]; Mayer (2004) "Should there be a three-strikes rule against pure discovery learning?" American Psychologist 59:14 [M].
  - Implication: an explorable without a prompt, a question, and a goal is a toy. Put one guiding question per control ("what happens to the total if you double the rate?") and an explicit "now notice..." caption.
- **Distill's "research debt"** (Olah & Carter 2017, distill.pub/2017/research-debt) [V title]: essay arguing that unexplained, un-distilled ideas impose compounding interpretive labour on every later reader; interpretive labour (explaining, visualising, naming) is under-rewarded. Not evidence about learning effects; it is the rationale for the *library* we are building, and a design norm: invest once in a great visual explanation, amortise across readers.
- Animation implication: every module has a "film mode" (guided path, one parameter at a time) and a "page mode" (the same scene, sliders exposed, one guiding question per slider, reset button). Same scene graph; the pedagogical move is identical.

---

## 8. Narrative and curiosity

- **Information-gap theory** (Loewenstein 1994, Psychological Bulletin 116:75) [M]: curiosity arises when attention is drawn to a gap between what one knows and what one wants to know; it is strongest when the gap is *noticed* and the learner has some (not zero) knowledge. Quantifies as an inverted-U with confidence/prior knowledge (Kang et al. 2009, Psychological Science 20:963; Wade & Kidd 2019, Psychonomic Bulletin & Review [M]).
- **Curiosity and memory**: Kang et al. (2009): high-curiosity trivia questions boosted subsequent memory and reward-circuit activity. Gruber, Gelman & Ranganath (2014), Neuron 84:486 [M]: curiosity states enhanced memory for the target answer and *also incidental material presented during the curious state*, mediated by hippocampus-dopamine interplay. Small samples (tens), lab trivia; effect on memory for incidental items has seen mixed replication (some later studies report weaker spillover) [M, flag contested]. Use as "open a gap early, and the surrounding material rides along", a moderate, plausible claim.
- **Narrative**: Dahlstrom (2014), PNAS 111:13614 [M]: narrative is processed differently from logical-scientific communication, is more engaging and more easily comprehended, but narrative persuasion can bypass critical scrutiny and the cost is transfer of principles if the story swallows the mechanism. Glaser, Garsoffky & Schwan (2009), Communications [M]: narrative-based learning has mixed evidence (engagement and recall up, transfer variable). Seductive details (Harp & Mayer 1998, J Ed Psych 90:414 [M]) are the failure mode: vivid irrelevant story content displaces the explanation.
- **And, But, Therefore (ABT)** (Randy Olson, *Houston, We Have a Narrative*, Univ. Chicago Press, 2015; also Trey Parker and Matt Stone's rule as quoted by Olson) [M]: a three-part skeleton "X and Y; but Z; therefore W" turns a list of facts into causal tension. This is craft heuristic with strong practitioner uptake and little direct experimental evidence. The learning-science justification is indirect: "but" creates an expectation violation (curiosity gap, prediction error), "therefore" forces causal linking (a coherence-building inference, Graesser, Singer & Trabasso 1994 [M]).
- Animation implication: open with the gap, not the thesis: a concrete puzzle or tension in the first 10 seconds; run "and... and... but... therefore" as the beat spine; make the narrative *be* the mechanism (each "therefore" is the next step of the mechanism), not a story pasted around it. Delay but do not hide the answer; resolve explicitly.

---

## 9. Schema and threshold concepts

- **Schema theory** (Bartlett 1932; Rumelhart 1980; Sweller schema acquisition/automation) [M]: understanding means slotting new information into an organised structure; novices lack the structure, so chunk sizes are small and every element costs working memory. Ausubel's advance organizers (1960) show small positive effects at best (Luiten, Ames & Ackerson 1980 meta-analysis, small) [M]; the pre-training principle is the more specific applied form.
- **Threshold concepts** (Meyer & Land 2003, ETL Project Occasional Report 4; 2005, Higher Education 49:373): concepts that are *transformative* (change how the learner sees the field), *irreversible*, *integrative* (reveal hidden connections), often *bounded* and *troublesome*. Learners pass through a **liminal** state of confusion, mimicry (saying the words without grasping them), and eventual re-orientation. Troublesome knowledge (Perkins 1999/2006): ritual, inert, conceptually difficult, foreign, tacit [M].
- Evidence status: mostly qualitative, discipline-by-discipline lists of candidate thresholds. Critiques: Rowbottom (2007), "Demystifying threshold concepts" J Philosophy of Education; Barradell (2013), Higher Education, on identification difficulties; no quantitative test that threshold-aware teaching beats other teaching [M]. Use it as a *design vocabulary*, not an evidence-based intervention.
- Staging for a threshold concept in a short film (design inference, combining Sections 2-6):
  1. Make the old view explicit and give it credit (it works within limits).
  2. Show the failure case that the old view cannot handle (dissatisfaction, liminal entry).
  3. Provide the minimal pre-requisite vocabulary (pre-training), shown as parts before the whole.
  4. Present the new view in a concrete case, then fade to its structure.
  5. Give a "now see everything differently" integrative beat: re-run 2-3 earlier scenes through the new lens (integrative + irreversible, a re-view montage).
  6. Name the new term *last* (labels follow understanding).
  7. Explicitly name the bounds (where the new view stops working), to avoid overgeneralising.

---

## 10. Other well-supported moves worth including (not in the original list)

- **Natural frequencies / count-don't-claim**: Gigerenzer & Hoffrage (1995), Psychological Review 102:684 [M]: Bayesian problems stated as natural frequencies ("8 of 1,000") rather than probabilities lift correct reasoning from ~10-15% to ~46-50% in their studies; Sedlmeier & Gigerenzer (2001) found frequency-format training persisted. Icon arrays (Garcia-Retamero & Cokely 2013 [M]) help low-numeracy audiences. Contested interpretation: whether it is frequency format or nested-set structure doing the work (Barbey & Sloman 2007 [M]); either way, showing countable units improves comprehension.
- **Exponential-growth bias**: people systematically underestimate compounding (Wagenaar & Sagaria 1975; Stango & Zinman 2009, J Finance 64:2807 [M]). Only direct experience or tabulating steps reliably shifts it; telling "it's exponential" does not.
- **Interpolated questions in video**: Szpunar et al. 2013 [M], Kestin & Miller 2022 [V].
- **Self-explanation**: Chi et al. 1989, 1994; Bisra et al. 2018 [M].
- **ICAP framework** (Chi & Wylie 2014, Educational Psychologist 49:219 [M]): Interactive > Constructive > Active > Passive. Gives the rubric for "viewer does": a module is stronger if the viewer does something constructive (predict, draw, explain, choose) than something active (click next), and passive watching sits at the bottom.
- **Video length and pacing**: Guo, Kim & Rubin (2014), L@S: median engagement fell sharply after about 6 minutes; short videos and informal conversational pacing engaged more [M]. Supports the 2-5 minute envelope as an engagement choice, not a learning-gain guarantee.

---

# Synthesis: 24 pedagogical moves

Concept-type key: **Mech** mechanism, **Proc** process, **Scale** scale/compounding, **Cmp** comparison/trade-off, **Caus** causal, **Stat** statistical/probabilistic, **Def** structural/definitional, **Bias** behavioural bias, **Hist** historical/narrative.

Duration = proposed film time (module on the timeline); interactive pages can stretch each. Evidence rating: A = replicated/meta-analytic support in learning outcomes; B = good but narrow or contested; C = theory/practitioner craft, weak direct tests.

| # | Move (verb-noun) | Input learner state → output state | Evidence (rating; key source) | Typical film duration | Suits |
|---|---|---|---|---|---|
| 1 | **open-the-gap** | Indifferent / unaware → curious, aware of what they do not know | B; Loewenstein 1994; Kang 2009; Gruber 2014 (spillover contested) | 8-15 s | all, esp. Caus, Hist, Bias |
| 2 | **commit-a-prediction** | Holds latent model (right or wrong) → has an explicit stake, ready to notice the discrepancy | A-/B; Crouch et al. 2004; Kestin & Miller 2022; Brod 2021 | 10-20 s freeze + reveal | Mech, Caus, Stat, Bias, Scale |
| 3 | **stage-the-struggle** (film proxy for productive failure) | Has prior pieces → has tried, failed, and feels the need for the canonical method | B; Kapur 2008; Sinha & Kapur 2021 (contested) | 20-40 s | Def, Stat, Cmp, Proc |
| 4 | **confront-the-misconception** | Holds a confident wrong model → dissatisfied with it, sees the right model succeed | B+; Posner 1982; Muller et al. 2008; Kendeou refutation; Lewandowsky 2012 | 25-45 s | Mech, Caus, Bias, Scale |
| 5 | **run-the-wrong-model** (sub-move of 4) | Believes wrong model → watches it fail on a case they care about | B; Muller 2008; Chi categorical-shift | 10-20 s | Mech, Caus |
| 6 | **pre-train-the-parts** | Novice, no vocabulary → can name/recognise components | A-; Mayer pre-training; Pollock isolated elements | 15-30 s | Mech, Proc, Def |
| 7 | **segment-and-pause** | Overloaded by a long sequence → each chunk consolidated | A-; Mayer segmenting; Rey 2019; Spanjers 2010 | 1-3 s hold per beat, a 3-5 s breath per chunk | Proc, Mech, Scale |
| 8 | **cue-the-cause** | Attends to salient but irrelevant motion → attends to the causally relevant element | B+; Lowe & Boucheix 2011; Richter 2016 (small, contested) | 0.3-1 s per cue | Mech, Proc, Caus |
| 9 | **pair-the-sound-and-shape** (align narration and visual) | Split attention → one integrated trace | A; temporal/spatial contiguity | continuous | all |
| 10 | **cut-the-decoration** | Distracted by extra material → focused | A-; coherence; Harp & Mayer 1998 | zero cost; a rule | all |
| 11 | **walk-the-worked-example** | Novice, no schema → sees a complete solved case, step labelled | A; Sweller & Cooper 1985; Barbieri 2023 | 30-60 s | Proc, Stat, Def |
| 12 | **fade-the-scaffold** (completion / backward fading) | Has seen a full example → can complete the last step | B+; Renkl & Atkinson 2003 | 10-20 s per example | Proc, Stat |
| 13 | **fade-concrete-to-abstract** | Grasps one concrete case → can map it to the schematic and symbolic form | B; Goldstone & Son 2005; Fyfe 2014 (domain-dependent, Kokkonen & Schalk 2021) | 30-60 s | Def, Scale, Stat, Proc |
| 14 | **contrast-two-cases** | Sees instances only → sees the invariant / the discriminating feature | A-; Alfieri 2013 d 0.50; Gentner 2003; Schwartz & Bransford 1998 | 20-40 s | Cmp, Def, Bias, Stat |
| 15 | **name-it-last** (label after structure) | Has the structure, no term → terminology bound to understanding | B; Schwartz & Bransford 1998 ("telling" after differentiation); Alfieri (principle after comparison) | 5-10 s | Def, Cmp |
| 16 | **count-dont-claim** | Believes a claim or fails to feel magnitude → experiences countable units | B+; Gigerenzer & Hoffrage 1995; icon arrays; exponential-growth bias | 15-30 s | Stat, Scale, Bias |
| 17 | **step-the-scale** (powers, doubling, zoom) | Intuition anchored on linear → sees compounding step by step | B (bias literature strong; explainers' effect on correcting it, weakly tested) | 20-40 s | Scale |
| 18 | **vary-one-thing** (sensitivity sweep) | Sees a static outcome → sees how the outcome depends on one input | B; Goldstone variation; simulation meta-analyses; guided discovery (Alfieri 2011) | 10-25 s film; open in page | Caus, Mech, Scale, Stat |
| 19 | **prompt-self-explanation** | Watches passively → generates a why | A-; Chi 1989, 1994; Bisra 2018 g 0.55 | 5-10 s | Proc, Mech, Caus |
| 20 | **retrieve-once** (interpolated question) | Just saw it → must recall it | A; Roediger & Karpicke 2006; Szpunar 2013; Adesope 2017 | 5-10 s mid-film, 10-15 s at end | all |
| 21 | **re-see-through-the-lens** (integrative replay) | Holds the new model on one case → applies it across earlier scenes / far case | B-/C; Meyer & Land (threshold design vocabulary); transfer literature on varied application | 15-30 s | Def, Mech, Hist, Caus |
| 22 | **chain-with-therefore** (ABT spine) | Facts in a list → causal chain with expectation violations | C/B-; Olson 2015; Graesser 1994; Dahlstrom 2014 (narrative a double-edged tool) | the spine of the whole film | Hist, Caus, Proc |
| 23 | **name-the-bounds** | Overgeneralises the new idea → knows where it stops | C; threshold concepts; expertise-sensitive; common sense in refutation designs | 8-15 s | Def, Mech, Stat |
| 24 | **offer-the-skip** (expertise path) | Expert in a novice cut → not slowed by redundant support | B+; expertise reversal (Kalyuga 2003) | optional branch / 2nd cut | all |

(24 moves; 3 are "rules" with ~zero timeline cost: 9, 10, and 24 as a variant switch. 5 is a sub-move of 4.)

### Move-to-concept-type quick map (primary recommendations)

- **Mechanism**: pre-train-the-parts → commit-a-prediction → cue-the-cause + segment-and-pause → prompt-self-explanation → retrieve-once. Add confront-the-misconception if a common wrong model exists.
- **Process / procedure**: walk-the-worked-example → fade-the-scaffold → segment-and-pause. Animation is strongest here (Hoffler & Leutner procedural-motor d 1.06).
- **Scale / compounding**: count-dont-claim + step-the-scale + vary-one-thing; commit-a-prediction first (people predict linear).
- **Comparison / trade-off**: contrast-two-cases (similarities first, then differences) + name-it-last; vary-one-thing for sensitivity.
- **Causal**: open-the-gap + commit-a-prediction + chain-with-therefore; vary-one-thing as the intervention check.
- **Statistical / probabilistic**: count-dont-claim (natural frequencies, icon arrays) + commit-a-prediction + walk-the-worked-example.
- **Structural / definitional**: contrast-two-cases + fade-concrete-to-abstract + name-it-last + name-the-bounds.
- **Behavioural bias**: commit-a-prediction (let them fall for it) + confront-the-misconception + count-dont-claim. Beware the "debunking handbook" rules: lead with the fact, show the bias in action, explain why it arises, replace it.
- **Historical / narrative**: open-the-gap + chain-with-therefore + stage-the-struggle (put the viewer in the historical actor's position with only their evidence) + re-see-through-the-lens.

### Canonical sequence skeletons (compositions of moves)

A. **Misconception film (Muller/Veritasium pattern), ~3 min**: open-the-gap (10 s) → commit-a-prediction (15 s) → run-the-wrong-model (15 s) → confront (20 s) → pre-train-the-parts (20 s) → right model with cue-the-cause + segment-and-pause (60 s) → retrieve-once (10 s) → name-the-bounds (10 s) → recap/ re-see (15 s).

B. **Procedure film, ~3 min**: open-the-gap (10 s) → pre-train (20 s) → walk-the-worked-example (50 s) → fade-the-scaffold on a second example (30 s) → prompt-self-explanation (10 s) → retrieve-once (15 s).

C. **Compounding/statistics film, ~3 min**: commit-a-prediction (15 s) → count-dont-claim (30 s) → step-the-scale (40 s) → fade-concrete-to-abstract to the formula (40 s) → vary-one-thing (20 s) → retrieve-once (10 s).

D. **Trade-off film, ~3 min**: open-the-gap → contrast-two-cases (35 s) → vary-one-thing (25 s) → name-it-last (10 s) → name-the-bounds (10 s) → retrieve-once.

### Implementation notes for the library
- Each module should declare: inputs (assumed prior knowledge), output state, `film_seconds`, `page_interaction`, `fail_modes`, `expertise_flag`, and a 1-line `evidence_rating` plus pointer to this file.
- A film cannot enforce commitment. The module spec should include a visible countdown and, in page mode, an actual input; do not claim POE or retrieval-practice benefits for a version in which nothing was committed.
- Cue budget: a global limiter (at most one cue active at a time, cue lifetime under 1.5 s) avoids cue inflation (Lowe).
- Morph, do not cut, whenever a representation changes level (fade-concrete-to-abstract, contrast, re-see). Shared anchors carry the mapping.
- Evaluate the library, not just the modules: the strongest evidence is for *combinations* (e.g., Kestin & Miller: visuals x embedded questions). Plan an A/B on one film (with-prediction vs without) as the first internal test.

### Open questions / honest unknowns
- No study found that tests these moves in a public, unsupervised, 3-minute animated film with delayed transfer measures; every module is extrapolated from classroom or lab work.
- Effect sizes for Mayer principles are from Mayer-lab syntheses; independent meta-analyses give smaller figures for signaling, personalization, segmenting.
- Concreteness fading may not generalise to physics and chemistry (Kokkonen & Schalk 2021); test per domain.
- Productive-failure effect size and its mechanism remain debated; the film proxy ("stage-the-struggle") is far weaker than the classroom intervention.
- Curiosity-spillover to incidental material is a moderately contested finding; prefer "curiosity improves memory for the target" as the safer claim.

---

## Sources (URL + what was taken)

Checked during this pull ([V]):
- https://www.leibniz-ipn.de/en/research/publications/instructional-animation-versus-static-pictures-a-meta-analysis : Hoffler & Leutner 2007 abstract: 26 studies, 76 comparisons, d = 0.37; representational d = 0.40; realistic d = 0.76; procedural-motor d = 1.06.
- https://hci.stanford.edu/courses/cs448b/papers/Tversky_AnimationFacilitate_IJHCS02.pdf : Tversky, Morrison & Betrancourt 2002 full text: congruence and apprehension principles; the equivalence critique; where animation may help.
- https://www.lrdc.pitt.edu/Schunn/papers/ContrastingCasesMeta-AlfieriEtAl2013.pdf : Alfieri, Nokes-Malach & Schunn 2013: 57 experiments, d = 0.50; similarities best; principle after comparison; d = 1.18 for similarities plus later principle.
- https://link.springer.com/article/10.1007/s10648-020-09581-7 : Kokkonen & Schalk 2021 (Educational Psychology Review 33:797): concreteness fading may not generalise; domain breakdown (maths positive; physics, chemistry mixed).
- https://pc.cogs.indiana.edu/?p=885 : listing for Fyfe, McNeil, Son & Goldstone 2014 systematic review of concreteness fading.
- https://serl.fas.harvard.edu/publications/harnessing-active-engagement-educational-videos-enhanced-visuals-and : Kestin & Miller 2022 (PRPER 18, 010148): embedded questions raise video learning, most with enhanced visuals. Open access: https://link.aps.org/doi/10.1103/PhysRevPhysEducRes.18.010148
- https://openjournals.library.sydney.edu.au/IISME/article/view/6345 : Muller & Sharma programme summary: misconceptions give false sense of knowing, interfere with recall, including them in multimedia helps; >1000 students over three years. Muller author page: https://ixdf.org/literature/author/derek-a-muller
- https://www.weforum.org/stories/2021/09/students-who-productively-fail-learn-more/ and https://swissinfo.ch/eng/eth-zurich-researchers-pin-down-top-learning-strategy/46921118 : Sinha & Kapur 2021 meta-analysis coverage: 53 studies, 166 comparisons; conditions (prior knowledge, secondary+ students, maths/science). Paper DOI listed at https://doi.org/10.3102/00346543211019105 (full text not read).
- https://www.research-collection.ethz.ch/entities/publication/93a6fe24-dde9-4f59-ad42-fc4476064bdf : Kapur group "Problem-solving followed by instruction: state of the art" (listing only).

Cited from memory ([M]) and worth retrieving before external quotation (all findable by title plus author):
- Mayer, R. E. (2021) Multimedia Learning, 3rd ed., Cambridge UP; Mayer & Fiorella (2014) in Cambridge Handbook of Multimedia Learning, 2nd ed. (principle list and median effect sizes). Overview page: https://blog.stcloudstate.edu/ims/2021/07/10/mayers-12-principles-of-multimedia
- Lowe (2003) Learning and Instruction 13:157; Lowe & Boucheix (2008, 2011); Boucheix & Lowe (2010); Betrancourt (2005); Schnotz & Rasch (2005); Hegarty (2004); Ainsworth (2008); Fiorella & Mayer (2018) Computers in Human Behavior 89:465.
- Sweller (1988); Sweller, van Merrienboer & Paas (1998); Sweller, Ayres & Kalyuga (2011) Cognitive Load Theory; Kalyuga, Ayres, Chandler & Sweller (2003) Educational Psychologist 38:23; Renkl & Atkinson (2003); Barbieri et al. (2023) worked-examples meta-analysis, Educational Psychology Review; de Jong (2010); Kirschner, Sweller & Clark (2006); Hmelo-Silver, Duncan & Chinn (2007).
- Champagne, Klopfer & Anderson (1980); White & Gunstone (1992); Crouch, Fagen, Callan & Mazur (2004) Am J Phys 72:835; Kim, Reinecke & Hullman (2017) CHI; Brod (2021) Psychonomic Bulletin & Review; Richland, Kornell & Kao (2009); Kornell, Hays & Bjork (2009); Carpenter & Toftness (2017); Pan & Sana (2021); Slamecka & Graf (1978); Bertsch et al. (2007); Roediger & Karpicke (2006); Karpicke & Blunt (2011); Rowland (2014); Adesope et al. (2017); Szpunar, Khan & Schacter (2013) PNAS; Bjork (1994); Bjork & Bjork (2011); McDaniel & Butler (2011); Diemand-Yauman et al. (2011) and Rummer et al. (2016); Dunlosky et al. (2013) PSPI 14:4.
- Goldstone & Son (2005) J Learning Sciences 14:69; McNeil & Fyfe (2012); Fyfe, McNeil & Borjas (2015); Kaminski, Sloutsky & Heckler (2008) Science 320:454; Son & Goldstone (2009); Gentner, Loewenstein & Thompson (2003) J Ed Psych 95:393; Gick & Holyoak (1983); Chi, Feltovich & Glaser (1981); Schwartz & Bransford (1998) Cognition & Instruction 16:475; Schwartz et al. (2011); Rittle-Johnson & Star (2007); Kurtz, Miao & Gentner (2001).
- Posner, Strike, Hewson & Gertzog (1982) Science Education 66:211; Chi (2005, 2008); Chi, Slotta & de Leeuw (1994); diSessa (1993); Smith, diSessa & Roschelle (1993); Guzzetti et al. (1993); Tippett (2010); Kendeou et al. (2014); Lewandowsky et al. (2012) PSPI 13:106 and Debunking Handbook 2020; Skurnik et al. (2005); Schwarz et al. (2007); Muller, Sharma & Reimann (2008) Science Education 92:278; Muller, Bewes, Sharma & Reimann (2008) J Computer Assisted Learning 24:144; Muller PhD thesis (Univ. Sydney 2008).
- Kapur (2008) Cognition & Instruction 26:379; Kapur & Bielaczyc (2012); Kapur (2016); Schwartz & Martin (2004); Loibl, Roll & Rummel (2017); Sinha & Kapur (2021) RER 91:761; Glogger-Frey et al. (2015).
- Paivio (1971, 1986); Clark & Paivio (1991) Educational Psychology Review 3:149; Pashler et al. (2008); Victor (2011) "Up and Down the Ladder of Abstraction" http://worrydream.com/LadderOfAbstraction/ and "Explorable Explanations" http://worrydream.com/ExplorableExplanations/ ; Olah & Carter (2017) https://distill.pub/2017/research-debt/ ; Rutten et al. (2012); Wieman, Adams & Perkins (2008) Science 322:682; Alfieri et al. (2011) J Ed Psych 103:1; de Jong & van Joolingen (1998); Mayer (2004) American Psychologist 59:14.
- Loewenstein (1994) Psychological Bulletin 116:75; Kang et al. (2009) Psychological Science 20:963; Gruber, Gelman & Ranganath (2014) Neuron 84:486; Wade & Kidd (2019); Dahlstrom (2014) PNAS 111:13614; Glaser, Garsoffky & Schwan (2009); Harp & Mayer (1998); Graesser, Singer & Trabasso (1994); Olson (2015) Houston, We Have a Narrative.
- Meyer & Land (2003, 2005 Higher Education 49:373); Perkins (1999/2006); Rowbottom (2007); Barradell (2013); Ausubel (1960); Luiten, Ames & Ackerson (1980).
- Gigerenzer & Hoffrage (1995) Psychological Review 102:684; Sedlmeier & Gigerenzer (2001); Garcia-Retamero & Cokely (2013); Barbey & Sloman (2007); Wagenaar & Sagaria (1975); Stango & Zinman (2009) J Finance 64:2807; Chi & Wylie (2014) Educational Psychologist 49:219; Chi et al. (1989, 1994); Bisra et al. (2018); Guo, Kim & Rubin (2014) L@S.
