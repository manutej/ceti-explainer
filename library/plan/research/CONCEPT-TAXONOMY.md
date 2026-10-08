# CETI.AI Explainer Library: Concept Taxonomy

Scope: 12 concept types, 30 classified topics (each with one "persistent object"), 28 recurring visual symbols with glyph candidates. Written 2026-10-08.

How to use: pick the topic's primary type to choose the film's shape and the "aha". Use the secondary type for a second act or an inset. Keep the persistent object on screen the whole film and let only its state change. The persistent object is the encoding anchor (Bertin: one mark, varying one visual variable at a time).

Design rules that apply to every type:
- One mark carries one meaning. Reuse a glyph across films only for the same concept (Neurath's Isotype principle: one sign, one referent, consistent across charts).
- Change one visual variable per beat. Bertin's variables are position, size, value (lightness), colour (hue), orientation, shape, and texture. Position and size are ordered and quantitative. Hue and shape are only selective or associative, so use them for category, never for magnitude.
- Encode magnitude by position or length first, then angle or area, then colour saturation (Cleveland and McGill's perceptual ranking; see Sources).
- Small multiples (Tufte) are the default way to show "same thing, different input", for example the same prompt at three temperatures.
- Before drawing, state the film's what-why-how (Munzner): what data (the persistent object's state), why (the single task: compare, locate, trace, explain a cause), how (the idiom and the encoding).

---

## Part 1. Concept types

Each entry: definition, typical "aha" shape, typical misconception, best representations (with citation key), and three example topics.

### T1. Mechanism (how a machine works inside)
- **Definition.** A concept explained by the parts of an operating device and how they hand work to each other. Stateless parts, defined inputs and outputs.
- **Aha shape.** "It is just this small operation, repeated." The reveal is that something magical-looking reduces to a simple operation (a weighted lookup, a dot product).
- **Misconception.** The model "understands" or "looks things up" like a person, or it holds a hidden database of facts.
- **Representations.** Exploded or cutaway view with a flow path. Connection (link) marks with a fixed layout, and size or value for weight (Bertin). A single token or signal travelling the path (Munzner: idiom is node-link plus animated trace). Show three or fewer stages at once (Card, Mackinlay and Shneiderman: reduce clutter by progressive reveal).
- **Examples.** Attention, tokens (tokenisation), embeddings (as a lookup).

### T2. Pipeline / process (ordered stages, items flow through)
- **Definition.** Items pass through a fixed sequence of stages. Each stage transforms or filters. Failure can occur at any stage.
- **Aha shape.** "The quality is decided at a stage you were not looking at." The reveal is a bottleneck or a silent loss between stages.
- **Misconception.** Treating the pipeline as one step ("RAG is just search"), or assuming each stage is lossless.
- **Representations.** Left-to-right lanes with a persistent carrier object, quantity shown by stack height (Bertin size). Sankey or funnel when items drop out. Reveal stage by stage with a ghost of the previous stage (Tufte: layering and separation).
- **Examples.** RAG, prompt caching (cache lookup path), fine-tuning data-to-weights.

### T3. Structural / definitional (what a thing IS)
- **Definition.** A concept defined by its parts and relations, with no time. Taxonomy, anatomy, boundary.
- **Aha shape.** "These two things I merged are different (or the reverse)." The reveal is a category cut in a new place.
- **Misconception.** Conflating terms (model vs. product, tool vs. agent, token vs. word, context vs. memory).
- **Representations.** Nested containment, a labelled anatomy, or a two-by-two with position as the classifier (Bertin: association by shape or hue). Isotype-style labelled pictograms. Wayfinding rule from Mijksenaar: label at the point of decision, not in a legend.
- **Examples.** LLM (what it is), context window vs. memory, MCP (a protocol, not a tool).

### T4. Scale and compounding (quantity changes the kind of thing)
- **Definition.** Behaviour governed by magnitude: exponential, power law, many small items summing, orders of magnitude.
- **Aha shape.** "It is far bigger or smaller than my intuition." The reveal is a zoom that breaks the axis.
- **Misconception.** Linear thinking: "twice the context costs twice as much", "a small per-call cost is nothing".
- **Representations.** Powers-of-ten zoom (Eames-style stacked scales), log axis with a visible break, area-proportional squares (use sparingly: area is a weak channel). Small multiples across scales (Tufte).
- **Examples.** Cost and latency at volume, scaling and context length, compounding of model errors across agent steps.

### T5. Probabilistic / statistical (distributions, uncertainty)
- **Definition.** The thing is a distribution or a rate, not a single value. Sampling, base rates, variance.
- **Aha shape.** "The single answer hid a spread." The reveal is the shape of the distribution or the denominator.
- **Misconception.** Treating a sample draw as the truth, ignoring base rates, reading "likely" as "certain".
- **Representations.** Unit-dot charts (frequency format: "10 out of 1,000" beats percentages, per Gigerenzer), density as dot stacks, position on a common scale. Many draws as small multiples. Fan or spaghetti for uncertainty over time.
- **Examples.** Next-token sampling (temperature), base rates, regression to the mean.

### T6. Trade-off / comparison (two or more goods that cannot all be had)
- **Definition.** A frontier: improving one dimension costs another. Choosing means picking a point.
- **Aha shape.** "There is no free option, and the right point depends on my constraint."
- **Misconception.** Believing a best option exists independent of context (the "best model", "the cheapest").
- **Representations.** Scatter with a Pareto frontier, a slider that moves the point while a second quantity moves opposite, side-by-side aligned bars on a common baseline (Cleveland and McGill). Direct labels. Colour reserved for the chosen option.
- **Examples.** Fine-tuning vs. RAG vs. prompting, model size vs. cost vs. latency, guardrail strictness vs. usefulness.

### T7. Causal chain (A leads to B leads to C)
- **Definition.** A linear sequence of causes, each necessary for the next. Distinct from a pipeline because the links are claims about causation, not processing stages.
- **Aha shape.** "The visible symptom is three steps downstream of the real cause."
- **Misconception.** Blaming the last link (the output) rather than the root (the data, the incentive, the framing).
- **Representations.** Domino or dependency line with the root marked by position (leftmost) and size. Ghost the "what if this link were removed" counterfactual. Annotate each link with the mechanism, not just an arrow.
- **Examples.** Hallucination causes, why an eval score misleads, how a bad incentive produces a bad decision.

### T8. Behavioural bias / heuristic (a mind-shaped distortion)
- **Definition.** A systematic gap between what a mind does and what a rule of logic or probability would do. Always has a trigger, a substitution, and a cost.
- **Aha shape.** "I did it too, and it felt reasonable." The film runs a live trap on the viewer first, then names it. This is the "System 1 answers a different, easier question" structure.
- **Misconception.** "Smart people don't do this" or "knowing the name prevents it".
- **Representations.** A first-person question the viewer answers, then a replay with the hidden variable made visible (the anchor number, the denominator). Two-track display: what you saw vs. what was there. Position on one axis for the true value, a distinct mark for the judged value, a visible gap (Bertin: size of the gap = size of the bias).
- **Examples.** Anchoring, availability, loss aversion.

### T9. System dynamics / feedback loop (stocks, flows, delays)
- **Definition.** The state feeds back on its own rate of change. Includes reinforcing and balancing loops and delays.
- **Aha shape.** "The behaviour comes from the loop's structure, not any single actor." The reveal is overshoot, oscillation, or runaway.
- **Misconception.** Expecting immediate, proportional response; ignoring delays; blaming people for structure.
- **Representations.** Stock as a vessel (volume), flow as a pipe whose width encodes rate, delay as a visible lag on a line chart, loop as a closed path with polarity marks (Meadows-style stock and flow). Time-series small multiples for different parameters.
- **Examples.** Agent loop (reservoir of budget draining per turn), planning fallacy (re-planning loop), team trust and delegation.

### T10. Historical / evolution (how and why it came to be)
- **Definition.** A concept explained by a sequence of problems and the fixes that created the present form.
- **Aha shape.** "Each odd feature is a scar from a past problem."
- **Misconception.** Treating current design as inevitable or purpose-built.
- **Representations.** A single timeline with a persistent baseline and branches (Tufte: one axis, dense annotation), small multiples of "then / now" using the same frame. Era encoded by value (light to dark), not hue.
- **Examples.** From rules to statistical models to LLMs, tool use to MCP standardisation, prompt engineering to context engineering.

### T11. Procedure / how-to (do these steps)
- **Definition.** A sequence the viewer is meant to carry out. Includes decision points and checks.
- **Aha shape.** "I can do this on Monday." The reveal is the small checklist that carries the whole method.
- **Misconception.** That the method is secret or needs special tools; skipping the verification step.
- **Representations.** Numbered stations on a path with the persistent object being the viewer's artefact (a draft, a form). Mijksenaar: signage logic, with a "you are here" marker and the next action emphasised. Keep steps to seven or fewer. Show an explicit "check" gate.
- **Examples.** Writing an eval, designing a prompt cache layout, running a pre-mortem.

### T12. Strategy / decision (choosing under constraints and uncertainty)
- **Definition.** A concept about allocating scarce attention or resources among options with uncertain outcomes.
- **Aha shape.** "The question was framed wrongly; the real choice is elsewhere."
- **Misconception.** That strategy is a document or a roadmap rather than a set of choices that exclude things.
- **Representations.** Option space as a map with constraint walls; the decision as a movable marker; stakes shown by size. Decision tree with probabilities as widths (Bertin size, Munzner tree idiom). Cost of being wrong shown as an explicit asymmetric region.
- **Examples.** Build vs. buy, where to start with AI, pre-mortem and kill criteria.

---

## Part 2. Classification of 30 topics

Persistent object = the single thing on screen for the entire film. State changes drive the story.

### A. AI topics (14)

| # | Topic | Primary | Secondary | Persistent object (and what changes) |
|---|---|---|---|---|
| 1 | LLM (what it is) | T3 Structural | T5 Probabilistic | A **dice-shaped autocomplete tray**: a row of word-tiles with a weighted die above; the die's faces re-weight as context changes |
| 2 | Tokens | T1 Mechanism | T4 Scale | A **strip of cloth cut into pieces**: scissors cut text at frequent seams; piece count = cost meter |
| 3 | Embeddings | T3 Structural | T1 Mechanism | A **map** (a city map where nearness means similarity); points drift into neighbourhoods; a pin is a query |
| 4 | Attention | T1 Mechanism | T5 Probabilistic | A **spotlight rig over a sentence**: beam widths are weights summing to one; beams re-aim per word |
| 5 | RAG | T2 Pipeline | T6 Trade-off | A **library cart**: wheeled through shelves, picks passages, wheels to a desk where the answer is written with the cart contents visible |
| 6 | Agent loop | T9 Feedback loop | T2 Pipeline | A **ledger plus a reservoir**: each turn writes a line (thought, action, result) and drains the reservoir (budget); stops at empty or goal |
| 7 | Tool use / MCP | T3 Structural | T10 Historical | A **wall of standard sockets and a power strip**: one plug shape; devices (tools) plug in; a model "hand" reaches out via the socket |
| 8 | Evals | T11 Procedure | T5 Probabilistic | A **gradebook grid**: rows are cases, columns are versions; cells fill pass/fail; the column total is the headline |
| 9 | Type-safe outputs | T3 Structural | T7 Causal | A **mould and cast**: free-form liquid text poured into a typed mould; rejects overflow; what comes out has an exact shape |
| 10 | Prompt caching | T2 Pipeline | T4 Scale | A **bookmarked stack of pages**: a stable prefix is bookmarked; only the new tail is re-read; a cost thermometer drops |
| 11 | Fine-tuning | T6 Trade-off | T2 Pipeline | A **sculpture with a chisel vs. a stick-on label**: base shape (weights) gets small changes; compared with adding instructions |
| 12 | Guardrails | T3 Structural | T7 Causal | A **channel with banked walls**: the flow is output; walls are rules; test water hits the wall at defined places |
| 13 | Cost / latency | T4 Scale | T6 Trade-off | A **taxi meter that also shows a stopwatch**: both run while a request is processed; model size toggles rates |
| 14 | AI strategy | T12 Strategy | T6 Trade-off | A **map with territory and a few flags**: use-cases as locations, effort as distance, a path chosen and others greyed |

### B. Kahneman and thinking (8)

| # | Topic | Primary | Secondary | Persistent object |
|---|---|---|---|---|
| 15 | Anchoring | T8 Bias | T5 Probabilistic | A **wheel and an axis**: a wheel spins to a number, then the viewer's estimate is pulled along an axis toward it |
| 16 | Base rates | T5 Probabilistic | T8 Bias | A **crowd grid of 1,000 dots**: highlight the 10 who have the condition; test result tints dots, so the denominator stays visible |
| 17 | Availability | T8 Bias | T5 Probabilistic | A **shelf of memories with a spotlight**: bright items (vivid) get picked; the shelf behind holds the real frequencies |
| 18 | Loss aversion | T8 Bias | T6 Trade-off | A **kinked scale (balance)**: equal gain and loss weights are placed; the loss pan sinks faster; a value curve is drawn on top |
| 19 | Planning fallacy | T8 Bias | T9 Feedback | A **timeline ribbon that keeps lengthening**: the plan bar vs. the actual bar; the inside view vs. a stack of past projects' actual durations |
| 20 | Regression to the mean | T5 Probabilistic | T7 Causal | A **scatter with a diagonal and a flatter true line**: extremes on round one pull toward the middle in round two; no cause needed |
| 21 | System 1 / System 2 | T3 Structural | T8 Bias | A **two-lane road: fast lane and slow lane**; a car (the question) is routed; a bat-and-ball puzzle takes the wrong lane |
| 22 | Framing effect | T8 Bias | T12 Decision | A **window frame that crops the same landscape** two ways; the choice flips with the crop |

### C. Leadership, decision-making, strategy (8, chosen)

| # | Topic | Primary | Secondary | Persistent object |
|---|---|---|---|---|
| 23 | Pre-mortem | T11 Procedure | T7 Causal | A **tombstone at the project's end date**: team writes the epitaph; each cause becomes a bridge repaired earlier |
| 24 | Delegation and span of control | T9 Feedback | T4 Scale | A **hand with fingers (attention) and strings**: strings to people; each string consumes attention; overload drops items |
| 25 | Opportunity cost / sunk cost | T12 Strategy | T8 Bias | A **fork in a road with a drained fuel tank**: fuel spent can't be recovered; the next mile's choice is what matters |
| 26 | Decision journal | T11 Procedure | T5 Probabilistic | A **notebook page with a predicted-vs-actual dot plot**; calibration curve accumulates over entries |
| 27 | Incentives shape behaviour | T7 Causal | T9 Feedback | A **river with a diversion channel**: the incentive is the channel; the water (behaviour) finds it, whatever the intent |
| 28 | Trust and psychological safety | T9 Feedback | T7 Causal | A **bridge being built from both ends**: each side adds a plank only after the other does; delay and sudden break shown |
| 29 | Strategy as choosing what not to do | T12 Strategy | T6 Trade-off | A **pruned tree**: many branches, a few kept; the cut branches are listed and named |
| 30 | One-way vs. two-way doors | T12 Strategy | T6 Trade-off | A **door that swings both ways vs. a door that locks behind**: decision speed matched to reversibility |

Coverage check: T1 four primary or secondary, T2 six, T3 seven, T4 five, T5 eight, T6 eight, T7 six, T8 eight, T9 six, T10 two (weak; add "Scaling laws history", "From prompt to context engineering" and "Cloud migration lessons" if more are needed), T11 four, T12 six. T10 is the thinnest and should be seeded with more topics.

---

## Part 3. Visual symbol needs (28)

Each: two candidate glyphs (geometry in words) and what to avoid. All glyphs should survive 24 px and be drawn with at most two colours plus the neutral. Consistency across films matters more than novelty (Neurath/Isotype; Mijksenaar).

1. **Token.** (a) A small rounded rectangle tile with a notch on the right edge, like a puzzle piece. (b) A short horizontal bar of fixed height with a variable width. *Avoid:* coins, poker chips, and speech bubbles. A token is not a word.
2. **Probability mass.** (a) Sand in a column whose heights sum to a fixed box. (b) A bar that splits into proportional segments of one full-width strip. *Avoid:* pie charts with many slices, dice clichés in every film.
3. **Vector.** (a) An arrow from the origin with a fixed head, length for magnitude. (b) A column of small cells with shaded value. *Avoid:* 3D axis cubes, Matrix green code.
4. **Step / turn.** (a) A numbered stepping stone on a path. (b) A single notch on a ruler. *Avoid:* circular arrows used for everything.
5. **Budget.** (a) A reservoir (vertical tank) with a level line. (b) A bar that depletes from the right. *Avoid:* piggy banks and dollar signs for non-monetary budgets (tokens, attention).
6. **Error.** (a) A gap bracket between a target mark and an actual mark. (b) A jagged break in a line. *Avoid:* red crosses everywhere, warning triangles.
7. **Truth vs. shape (valid vs. well-formed).** (a) Two stamps: an outline stamp (shape ok) and a filled stamp (true). (b) A mould and a cast that has the right shape but a hollow centre. *Avoid:* thumbs up and down, tick/cross as the only distinction.
8. **Feedback.** (a) A closed loop with a polarity sign (+ or -) at the junction. (b) An arrow that curves back to its own start. *Avoid:* the generic recycling icon.
9. **Delay.** (a) A line with a visible gap and a small hourglass-free "lag" bracket between cause and effect. (b) A ghost copy of a signal shifted right. *Avoid:* hourglass and clock for every wait.
10. **Uncertainty.** (a) A blurred or dotted halo around a mark whose radius equals spread. (b) A fan of translucent paths. *Avoid:* question marks, fog clichés.
11. **Cost.** (a) A weighted block that sinks a balance pan. (b) A meter needle with ticks. *Avoid:* dollar signs unless money specifically.
12. **Time.** (a) A horizontal axis with a moving playhead. (b) A ribbon that unrolls. *Avoid:* analogue clock faces.
13. **A person's judgement.** (a) A hand-drawn, slightly wobbly marker (the person's guess) placed on an axis. (b) A thumb-on-scale mark. *Avoid:* brain icons, light bulbs, lone stick-figure heads.
14. **Rule / constraint.** (a) A wall or a rail on both sides of a channel. (b) A ruler line with a hard stop. *Avoid:* padlocks and shields (use only for security specifically).
15. **Memory.** (a) A shelf with labelled boxes. (b) A stack of index cards. *Avoid:* brain, RAM chip, floppy disk.
16. **Context window.** (a) A rectangular frame sliding along a long strip of text; content outside is dimmed. (b) A lit stage with the audience dark. *Avoid:* browser window chrome.
17. **Query.** (a) A pin dropped on a map with a ring. (b) A torch beam from the left. *Avoid:* magnifying glass (used for search in every UI).
18. **Retrieval.** (a) A hand picking a card from a shelf with a thread back to the query. (b) A magnet pulling filings only from nearby. *Avoid:* downward cloud arrow, database cylinder.
19. **Similarity / distance.** (a) A taut thread between two points; length is distance. (b) Overlapping translucent circles; overlap is similarity. *Avoid:* Venn diagrams for continuous similarity.
20. **Weight / importance.** (a) Line thickness between two points. (b) Beam width of a spotlight. *Avoid:* star ratings.
21. **Tool.** (a) A socket-and-plug pair. (b) A hand-held handle with a named end (the function). *Avoid:* wrench and gear (generic settings), robot arms.
22. **Agent.** (a) A small figure leaving footprints that become a ledger. (b) A cursor with a trailing line. *Avoid:* humanoid robots, glowing brains, the generic "AI sparkle".
23. **Sample / draw.** (a) A single dot dropped from a distribution onto a line. (b) A ball picked from an urn. *Avoid:* slot machines.
24. **Base rate / denominator.** (a) The full grid of dots held faintly behind the highlighted ones. (b) A thin outline box around the whole population. *Avoid:* percentage text alone.
25. **Bias (pull).** (a) An elastic band from the judged mark toward the anchor. (b) A tilted scale with the lean annotated. *Avoid:* devil-on-shoulder, cartoon thought bubbles.
26. **Gain / loss.** (a) Upward and downward steps of equal height with unequal visual weight (loss in a darker value). (b) Two pans of a balance with different sinking speeds. *Avoid:* red/green only (colour-blind issue); also use direction and value.
27. **Version / change.** (a) A stacked series of translucent copies, newer on top. (b) A ruled page with a revision mark. *Avoid:* git-branch icons for non-code material.
28. **Choice / decision.** (a) A fork in a path with a marker at the branch. (b) A switch with two positions and a label for what it excludes. *Avoid:* coin flips, thumbs, "VS" badges.

Colour policy for glyphs: one hue for "the model or machine", one for "the person", neutral for context, one accent reserved for the thing the viewer must look at now. Do not use hue for magnitude (Bertin: hue is selective only). Always pair colour with a second channel (value or shape) for accessibility.

---

## Sources

Search listings consulted (2026-10-08); the rest of the content draws on standard references I know and have not re-verified online in this session. Page-level claims below are from well-known editions.

- Bertin, J. (1967/1983). *Semiology of Graphics: Diagrams, Networks, Maps.* University of Wisconsin Press. Visual variables: position, size, value, colour, orientation, shape, texture. Overview pages found: https://axismaps.com/guide/visual-variables ; https://www3.cs.stonybrook.edu/~mueller/teaching/cse564/bertin.pdf ; https://www.cs.utexas.edu/~mitra/csFall2026/cs329/notes/viz_foundations.html
- Munzner, T. (2014). *Visualization Analysis and Design.* CRC Press. What-why-how framework. Slides: https://www.cs.ubc.ca/~tmm/talks/minicourse14/vad16act.pdf ; https://www.cs.ubc.ca/~tmm/talks/minicourse14/halfdaycourse20.pdf
- Tufte, E. (1983, 2001). *The Visual Display of Quantitative Information*; (1990). *Envisioning Information.* Small multiples, data-ink, layering and separation.
- Card, S., Mackinlay, J., Shneiderman, B. (1999). *Readings in Information Visualization: Using Vision to Think.* Morgan Kaufmann. Mackinlay, J. (1986). "Automating the design of graphical presentations of relational information." *ACM TOG* 5(2). Ranking of encodings by data type.
- Cleveland, W., McGill, R. (1984). "Graphical perception." *JASA* 79(387). Ranking of elementary perceptual tasks.
- Neurath, O. and the Isotype method; Arntz, G. Overview: https://en.wikipedia.org/wiki/Isotype_(picture_language) ; https://isotype.univie.ac.at/en/abstract ; https://isotyperevisited.org/2012/08/introduction.php
- Mijksenaar, P. (1997). *Visual Function: An Introduction to Information Design.* 010 Publishers. Wayfinding and "label at the point of decision" principle (secondary results found via the Isotype search; the book itself was not fetched).
- Kahneman, D. (2011). *Thinking, Fast and Slow.* Farrar, Straus and Giroux. Source for the bias set and the "substitution" structure.
- Gigerenzer, G., Hoffrage, U. (1995). "How to improve Bayesian reasoning without instruction: frequency formats." *Psychological Review* 102(4). Basis for unit-dot base-rate displays.
- Meadows, D. (2008). *Thinking in Systems.* Chelsea Green. Stock and flow, loops, delays.

Caveat: the glyph candidates and persistent-object choices are original proposals (design judgement), not findings from the cited sources. They should be tested for legibility at small size and for colour-blind safety before being locked into the library.
