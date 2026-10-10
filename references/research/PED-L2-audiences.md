# PED-L2: What each audience needs, mapped to the ladder

Ladder: **Glance** (~30 s, intuition) / **Grasp** (~2 min, mechanism) / **Wield** (learner acts) / **Master** (explorable).
Evidence tags: [E] empirical study or meta-analysis; [T] theory or practitioner claim; [I] my inference for this studio. Items are flagged where evidence is thin.

## 0. Cross-audience findings (apply to every chrome)

1. **Interaction, not animation, drives learning.** Animation vs. static: d = 0.37 over 26 studies, larger when the motion depicts the content (0.40) and not decoration [E, Hoffler & Leutner 2007]. PhET interviews: students who only watch rarely generate new ideas; learning came from manipulating a sim to answer their own questions [E, Adams et al.]. So Glance/Grasp can be films; Wield/Master must hand over the controls.
2. **Expertise reversal.** Guidance that helps novices (integrated text, worked examples, step-by-step cues) becomes redundant load for experts and can reverse the effect. Reported differences ran roughly d = 0.45 to 2.99, often partial [E, Kalyuga 2007]. Same film, different depth: do not give engineers the novice scaffolding.
3. **Coherence.** PhET: decorative "fun" without conceptual purpose distracted; cluttered lab-bench UIs intimidated; disabled controls with no physical reason frustrated [E]. Every chrome's beauty must carry meaning (the brief's "good but not WOW" risk is real, but ornament that explains nothing costs learning).
4. **"Performance mode."** Learners who think they already know the topic rush through and learn less; those who feel unsure explore more [E, PhET]. Remedy: a prediction before reveal (also exploits the illusion of explanatory depth: people overrate how well they understand mechanisms until asked to explain them [E, Rozenblit & Keil 2002]).
5. **Productive failure / prediction-first** [E, Sinha & Kapur line of meta-analyses; I could not retrieve the 2021 effect sizes, so treat magnitude as unverified]: attempting a problem before instruction tends to help conceptual understanding. Use "commit a guess, then see" at Grasp and Wield.
6. **Trust calibration beats trust.** Algorithm aversion: people lose confidence in an algorithm faster than in a human after the same error [E, Dietvorst et al. 2015]. Automation bias is the opposite failure; both are miscalibration. Show the system being wrong, then show a check catching it.

## 1. C-suite / executives

**Goals.** Decide: fund, stop, govern, sequence. Need a defensible mental model of capability, risk and cost, not a mechanism.
**Constraints.** Time poverty; fixed-schedule short programmes; mixed backgrounds; low personal stakes in a classroom setting [E-limited: Dixit & Jain 1985 on case method in short executive programmes; old, working-paper grade]. Reputational cost of looking uninformed in front of peers [T].
**Misconceptions to target.** "AI is a product you buy, not a process you operate"; confident output = correct output; per-step accuracy ~ end-to-end accuracy (the brief's 0.95^k compounding is exactly the right correction); pilots scale linearly; "the vendor demo is the base rate."
**Works.**
- *Decision framing and cases:* case method and business war-gaming expose assumptions and build shared views across functions; war-game evidence is anecdotal and authored by sellers of the service [T, Treat et al. 1996]. Take the form (a decision with a clock), not the claim of proven effect.
- *Their own currency:* dollars, hours, risk exposure, headcount, regulatory exposure. Compounding as "cost of an unchecked 20-step process: 64% of runs contain an error" beats "p^k" [I].
- *Scenario toggles, not sandboxes:* two or three levers (steps, check placement, human gate) with an outcome in money [I].
**Fails.** Mechanism-first tours; jargon (tokens, embeddings) without a stake; open-ended tinkering with no decision at the end; spectacle with no number. They distrust vendor-polished certainty; show ranges and the downside case [T/I].
**Entry and depth.** Enter at **Glance** (a single decision-relevant claim), Grasp only on pull, Wield as a *scenario* (move a lever, watch the dollar outcome), Master optional (a one-page model they can hand to staff).
**Tone/visual cautions.** Restrained, high-contrast, low-whimsy; no cartoon metaphors for risk. Label every illustrative number "sketch". No unexplained animation; each motion should resolve into a figure.

## 2. Managers / team leads

**Goals.** Redesign workflows; decide where AI fits and where a human reviews; coach staff.
**Constraints.** Between-meetings learning; accountable for process outcomes; mixed trust.
**Misconceptions.** Automation bias (a systematic review of decision-support studies, Goddard et al. 2012, found it a recurrent, real-world phenomenon; the PMC fetch was blocked, so rely on the abstract [E]); "the AI checked itself, so it's checked"; deterministic expectation (same input, same output).
**Works.** Worked examples of one workflow with a visible handoff; "where would you put the human?" as a commit-then-reveal; seeing the same prompt give different outputs. Caveat: in a small within-subjects study (n = 19), showing 10 sampled responses produced no significant change in trust or anthropomorphism, though participants valued cross-checking; underpowered, CS-skewed [E-weak, arXiv 2503.16114].
**Fails.** Abstract architecture diagrams; one-shot demos that hide variance.
**Entry/depth.** Glance, then Grasp (the loop with a gate), then **Wield is the main event** (place checks, see error rate and cost move).
**Tone.** Practical, workflow-shaped visuals (swimlanes, queues); pace allows pausing.

## 3. Non-technical staff

**Goals.** Safe, confident everyday use; know what to verify; not feel stupid.
**Constraints.** Low prerequisite maths, possible tech anxiety; learning is secondary to their job.
**Misconceptions to target (best-evidenced first).**
- *Capability confusion:* in 500 coded chatbot logs, the most frequent misconception was expecting the model to open URLs; others: expecting it to run code, see local files, remember earlier chats, know the "latest" version [E, arXiv 2510.25662; moderate inter-rater reliability, inferred from prompts]. This is the evidence for the "it looks things up" belief.
- *Anthropomorphism and Eliza effect:* people attribute more intelligence to simple systems; folk theories shape use whether or not they are correct [E/T, Long & Magerko 2020].
- *Confidence = correctness:* in a pre-registered experiment (n = 404) first-person hedges ("I'm not sure, but...") lowered agreement with the system and improved accuracy; general hedges did not significantly [E, Kim et al. 2024]. Wording matters; do not teach "hedged = fine".
- *Determinism:* see 2 above.
**Works.** Long & Magerko's design considerations: explainability, embodied interaction, unveil gradually, acknowledge preconceptions, low barrier to entry, critical thinking, contextualise data [E/T, synthesis of the literature]. Their framework's five themes: what is AI, what can it do, how does it work, how should it be used, how do people perceive it. Also OECD/EC (2025) draft AI literacy framework for education (note: schools, not workplaces; a draft [T]).
**Fails.** Maths-first; "magic" framing (reinforces the black box); doom or hype; a lecture over a lecture.
**Entry/depth.** **Glance is the product**: predict, commit, reveal on one misconception. Grasp = one plain mechanism ("it predicts the next piece of text; it does not look up"). Wield = a safe try-it (break it, see it be wrong). Master rarely.
**Tone/visual.** Warm, human-scale, tactile (the brief's Field Notebook fits). Avoid brain-and-circuit cliches, glowing robots and any face on the AI, which feeds anthropomorphism [I].

## 4. Technical learners (engineers, data and ML)

**Goals.** Accurate mental models; failure modes; tuning and architecture decisions; verify claims.
**Constraints.** High expertise in parts, gaps elsewhere; allergic to hand-waving; will read the code.
**Misconceptions.** Overconfidence from adjacent fields; context window "more is better" (listed as plausible in the programming-assistant study); treating evals as ground truth; thinking tool-use = reasoning.
**Works.** Simulations they can perturb (PhET: choose variables including wrongly believed relevant ones, to confront misconceptions; multiple linked representations; make hidden things visible); Victor-style reactive documents where the reader changes assumptions and sees consequences [T, Victor 2011]; animations help high-prior-knowledge learners more than static diagrams (expertise reversal, [E]).
**Fails.** Novice scaffolding (redundancy); decorative motion; ungrounded numbers. PhET also warns of excessive trust in sims: students accepted surprising results even from buggy sims [E], so expose parameters, seed and source.
**Entry/depth.** Enter at **Grasp** (skip Glance or make it a 10-s header). Wield and Master are central: parameter panels, seed control, "show the computation".
**Tone.** Dense, precise, technical-honest; instrument aesthetics (plots, traces) are welcome.

## 5. Adult-learning principles (all audiences)

Knowles' assumptions: self-direction, experience as resource, role-driven readiness, problem-centred orientation, internal motivation. Critiques: weak empirical base, not unique to adults, experiential methods unsuited to heavy new-information loads, and the self-direction premise is culturally North American [T, infed summary]. Use as a *design heuristic*: open with their problem; let experience be summoned (e.g., "think of a process you run"), but do not rely on it for dense mechanism.

## 6. Cross-cultural (20+ countries)

Direct evidence is thin. A four-country e-learning survey (Spain, USA, China, Mexico) grouped learners by autonomy and satisfaction and linked these to Hofstede-style dimensions without dimension-level results [E-weak, Gomez del Rey et al. 2016]. Hofstede dimensions are contested stereotypes at the individual level. Practical, defensible rules [I]:
- Do not rely on voice or text-heavy idiom; make the film legible with captions off and with machine-translated captions (short sentences, no puns, no sports or holiday metaphors).
- Avoid culture-coded colour meaning, gestures, faces and skin tones; avoid "cowboy", "moonshot", baseball metaphors.
- Let self-direction be opt-in: a guided path and a free path. Respect hierarchy-sensitive rooms: a prediction can be submitted privately before being shown.
- Numbers: units and currency switchable; date and decimal formats neutral.
- RTL and CJK type must work in textToPoints-based typography.

## 7. Matrix: audience x ladder level -> structures

| Audience | Glance | Grasp | Wield | Master |
|---|---|---|---|---|
| Executive | One claim in dollars/risk; decision question up front; "sketch" label | Only on pull; mechanism as cost driver (compounding) | Scenario with 2-3 levers and a money outcome; decision at the end | One-page model to hand to staff; ranges and downside case |
| Manager | Workflow vignette with a surprise | Loop with a visible human gate; same prompt, different outputs | Place checks, see error and cost move; commit-then-reveal | Team-ready variant: swap their process; export |
| Non-technical | Predict-commit-reveal on one misconception; no faces on AI | One plain mechanism; one analogy, then retire it | Safe break-it: see it be wrong, see a check catch it | Optional; curiosity branch only |
| Technical | 10-s header or skip | Mechanism with real terms; linked representations | Parameter, seed and perturbation panel; failure injection | Full explorable: expose model, code, assumptions (Victor-style reactive) |
| Cross-cutting | Captions, simple language | Show variance not just mean | Private prediction option | Switchable units/locale |

Design rules distilled: (a) one misconception per film; (b) ask for a prediction before reveal; (c) show an error and its catch; (d) every number computed or labelled "sketch"; (e) novice scaffolds must be removable (expertise reversal); (f) motion must depict, not decorate.

## Sources

- Long, D. & Magerko, B. (2020). What is AI literacy? Competencies and design considerations. CHI. https://aiunplugged.lmc.gatech.edu/wp-content/uploads/sites/36/2020/08/CHI-2020-AI-Literacy-Paper-Camera-Ready.pdf
- Kalyuga, S. (2007). Expertise reversal effect and its implications for learner-tailored instruction. Educ. Psychol. Review. https://www.uky.edu/~gmswan3/EDC608/Kalyuga2007_Article_ExpertiseReversalEffectAndItsI.pdf
- Adams, W. et al. A study of educational simulations Part I: engagement and learning (PhET). https://phet.colorado.edu/publications/archive/PhET%20interview%20Paper%20Part%20I.htm
- Hoffler, T. & Leutner, D. (2007). Instructional animation versus static pictures: a meta-analysis. Learning and Instruction. https://www.leibniz-ipn.de/en/research/publications/instructional-animation-versus-static-pictures-a-meta-analysis
- Victor, B. (2011). Explorable Explanations. https://worrydream.com/ExplorableExplanations/
- Kim, S. et al. (2024). "I'm Not Sure, But...": LLM uncertainty expression, reliance and trust. FAccT. https://www.arxiv.org/abs/2405.00623
- Revealing LLM stochasticity on trust, reliability and anthropomorphization (2025, small study). https://arxiv.org/html/2503.16114v1
- User misconceptions of LLM-based conversational programming assistants (2025). https://arxiv.org/html/2510.25662v2
- Dietvorst, Simmons & Massey (2015). Algorithm aversion. https://repository.upenn.edu/fnce_papers/58
- Goddard, Roudsari & Wyatt (2012). Automation bias: a systematic review. JAMIA. https://academic.oup.com/jamia/article/19/1/121/732254 (full text via https://pmc.ncbi.nlm.nih.gov/articles/PMC3240751 was blocked during retrieval)
- Rozenblit & Keil (2002). The misunderstood limits of folk science (illusion of explanatory depth). Overview: https://en.wikipedia.org/wiki/Illusion_of_explanatory_depth
- Kapur et al. productive failure literature (effect sizes not verified here). Related listing: https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2022.1098967/pdf
- Treat, Thibault & Asin (1996). Dynamic competitive simulation: wargaming as a strategic tool. https://www.strategy-business.com/article/15052
- Dixit & Jain (1985). Experience with case method in short duration executive development programmes. https://www.iima.ac.in/publication/experience-case-method-short-duration-executive-development-programmes
- infed. Andragogy: what is it and does it help thinking about adult learning? https://infed.org/mobi/?p=2909
- Gomez del Rey, Barbera & Fernandez Navarro (2016). Impact of cultural dimensions on online learning. Educ. Technology & Society. https://www.uloyola.es/en/scientific-offer/publications/the-impact-of-cultural-dimensions-on-online-learning-article
- OECD/European Commission draft AI Literacy Framework (2025). https://babl.ai/oecd-and-european-commission-unveil-draft-ai-literacy-framework-for-schools/
- Not used: UNESCO frameworks (not fetched); arxiv 2608.20421 (empty text).
