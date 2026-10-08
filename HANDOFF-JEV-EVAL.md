# HANDOFF — Jev-typed evaluation of CETI-generated content

**For:** the incoming collaborator on the Jev (TypeSafe AI) evaluation lane.
**Date:** 2026-10-05 · **Status:** suggestions and a starting sequence, not a settled contract.

You are being handed four capabilities to stand up:

1. interview-style questions that evaluate **each frame** of an explainer video,
2. a way to **review those questions** before they are trusted,
3. **clean heuristics for slides**,
4. a **process** around evaluation of CETI-generated content.

Most of the machinery for all four already exists in two repos. The work is mostly
*wiring and measuring*, not building. Read this file, then the reading order below, then
pick workstream W1 — the others depend on its items file.

> **Provenance discipline.** This repo and `JEV-works` both label what is known versus
> assumed, and that discipline is load-bearing here. Every claim below carries a tag:
> **[measured]** — someone ran it and the evidence is in a named file;
> **[published]** — established in the learning-science literature, cited;
> **[proposed]** — my suggestion, never run. Do not promote a **[proposed]** item to a
> rule without measuring it first. Nothing in the four workstreams below has been
> measured end to end yet.

---

## 0 · The toolchain is in this branch, and it runs

`RUN.md` promises that cloning this repo gets you a working engine. Until this branch that
was false — seven listed assets and all of `reference/` were missing. They are now here:
`engine.js`, `gate.mjs`, `snapshot.mjs`, `shell.template.html`, `ceti-tokens.css`,
`_episode-template.js`, and the four reference episodes.

Verified from a clean clone of this branch on 2026-10-05, Node v22.23.2, Python 3:

```
node assets/gate.mjs reference/self-attention.js   PASS · 38.6s · 8 beats · 214 nodes
node assets/gate.mjs reference/oauth.js            PASS · 39.2s · 8 beats · 155 nodes
node assets/gate.mjs reference/tcp.js              PASS · 37.4s · 8 beats · 146 nodes
node assets/gate.mjs reference/binary-search.js    PASS · 40.4s · 8 beats · 129 nodes
python3 assets/build.py reference/self-attention.js "Self-attention"
                                                   77 KB self-contained HTML
node assets/snapshot.mjs reference/self-attention.js 20 /tmp/t.svg
                                                   t=20.0s · beat 5 "Softmax"
node ../../eval/frame-items.mjs reference/self-attention.js /tmp/sa.items.json
                                                   8 frame items
```

Run them from `skills/ceti-explainer/`. Nothing to install.

## 1 · Reading order

| # | Where | Why |
|---|---|---|
| 1 | `JEV-works/llms.txt` | Jev's actual behaviour, compressed, as constraints. Start here |
| 2 | `JEV-works/NETER.md` | 24 properties with evidence and status. `measured here` vs `vendor claim` |
| 3 | `JEV-works/LESSONS.md` | 22+ lessons as happened / why / rule. **The anti-pattern registry you inherit** |
| 4 | `JEV-works/kit/README.md` | The runner. One JSON spec in, a measured report out |
| 5 | `skills/ceti-explainer/SKILL.md` | The 8-beat contract and the MUST NOT list. The craft bar |
| 6 | `contrib/operadic-interview/SKILL.md` | The question instrument. Just uploaded alongside this handoff |
| 7 | `REQUIREMENTS.md`, `contrib/EXPERIMENT-E0.md`, `contrib/SKILLS.md` | The product contract and this repo's inventory |

**The one thing to internalise before writing any question** — from `LESSONS.md`, and it
is the reason this lane exists:

> Most evaluation work measures the model. This measures **the instruments** first,
> because nearly every wrong conclusion came from an instrument being broken rather than
> the model being bad. [measured]

Five broken instruments in `JEV-works/README.md` all produced *plausible numbers*: a gate
that escalated 94% of items, a weighted score that summed a rubric level with a
probability, a rollup that averaged a cost with a benefit, a verdict function that
returned the best verdict on zero data, and a throughput figure reported as latency.
Assume your first frame-eval instrument is broken in one of those ways, and build the
check that would reveal it.

---

## 2 · Why per-frame evaluation is even well-posed here

This is the structural gift of the CETI engine, and it is worth being explicit about:

- An episode is a **pure function of time**. `render(t)` reconstructs the exact frame for
  any `t` — one deterministic clock, build-once-mutate-forever, no `setTimeout`, no
  scroll triggers. (`skills/ceti-explainer/SKILL.md`, MUST list.)
- Therefore **"frame at t" is a reproducible object**, not a screenshot you happened to
  take. The contract even requires that *paused frame == playing frame*, so every frame a
  viewer can scrub to is a frame you are allowed to grade.
- And `assets/snapshot.mjs` renders any `t` headlessly to standalone SVG, with design
  tokens resolved — no browser.

So a frame-level eval corpus is a *derived artifact* of the episode module. Regenerate the
episode, regenerate the corpus, re-run. That is a rare position to be in; build on it.

### 2.1 The division of labour you must respect

`LESSONS.md` L3 is the single most important rule for this lane: **split every candidate
question three ways before writing any policy** — literal → the model; deterministic →
code; requires reasoning → a text model, on the escalate band only. Moving one judgement
out of the model and into code produced **24× the reclaim at zero model cost**. [measured]

Applied to frames:

| Question about a frame | Where it goes | Instrument |
|---|---|---|
| Do two visible blocks overlap? | **code** | `gate.mjs` §15d already computes real bounding boxes every frame and fails the build |
| Are two scenes half-lit in the same region? | **code** | `__REGIONS` + the gate; `ex.seg` vs `ex.pulse` is a mechanical check |
| Is any text below 11px? Any raw hex? | **code** | trivial lint, already in the MUST NOT list |
| How many distinct text elements are on screen? | **code** | count them; see the density heuristic in §6 |
| Does this frame's caption describe what the frame shows? | **Jev** | literal, one record, answerable |
| Does this frame introduce a term it never defined? | **Jev**, with a window state | see §3.2 |
| Is this frame *beautiful*? | **neither** | a vision model or a human. Jev reads text, not pixels |

**Jev cannot see the frame.** It reads a text projection of it. Be honest about that in
every question you write: you are grading the frame's *semantic content*, and geometry,
colour and aesthetics are someone else's instrument. A question that implicitly needs
pixels will come back confident and useless — `LESSONS.md` L5. [measured]

---

## 3 · W1 — Interview-style questions for each frame

### 3.1 Getting the items (tested)

The grid should be the episode's own clock, not an arbitrary sample rate: one frame per
beat midpoint gives 8 items per episode and every item sits inside a single beat, so no
item straddles a transition. That is what **`eval/frame-items.mjs`** does — shipped in this
branch, with `eval/README.md` beside it.

```bash
cd skills/ceti-explainer
node ../../eval/frame-items.mjs reference/self-attention.js /tmp/sa.items.json      # 8 items
node ../../eval/frame-items.mjs reference/self-attention.js /tmp/sa.items.json 3    # 24 items
```

Each item is `{ id, state: { t, beatIndex, beatLabel, caption, visibleText } }`, which is
`itemsFile`-shaped for `JEV-works/kit/run.ts`. Verified against all four references.

A real extracted item, so you can see what Jev would actually read:

```
self-attention@t20.6  beat 5 "Softmax"
  caption:      "Softmax turns the scores into weights that sum to 1 — a pr…"
  visibleText:  ["4%","34%","4%","7%","4%","14%","5%","15%","7%","6%",
                 "The","animal","didn't","cross","the","street","because","it","was","tired",
                 "SCORES → A PROBABILITY THAT SUMS TO 1",
                 "wᵢ = exp(sᵢ) ⁄ Σ exp(sⱼ)",
                 "Bigger scores win an exponentially larger share of the attention.",
                 "Σ wᵢ = 1.00"]
```

Note what that projection gives you for free: the derived figures, the persistent anchor
(the ten sentence tokens, present in every beat), the scene eyebrow, the formula, and the
audit line. That is a genuinely rich state for literal questions.

### 3.2 The frame-relational trap, and how to escape it

`LESSONS.md` L2: a question set made only of **intrinsic-value** questions cannot
discriminate, however well each is written — "does this output contain a measurement?"
kept 96% of items because nearly everything contains one. At least one question must be
**relational**. [measured]

For frames this bites hard, because **continuity is the pedagogy** — the anchor persisting
across all 8 beats is the whole design. The interesting failures are therefore relational:
a term used before it is defined, a number that contradicts an earlier frame, an anchor
that silently moved, a beat that adds two ideas instead of one.

But L3 says the model reads *one* state, literally. So:

- Build a second items file where `state` is a **window**: `{ previous, current }`, or
  `{ beatsSoFar: [...labels], current }`. One record, still literal, now relational.
- Anything needing a comparison across the *whole* episode — "is any number inconsistent
  with any other" — goes in **code**, where it is deterministic anyway. The episode already
  derives every on-screen number in code and asserts them in `window.__AUDIT()`. Extend
  that; do not ask a model.

### 3.3 Candidate frame questions [proposed]

Seeds only. Vet them through W2 before spending calls. Shape follows
`JEV-works/kit/README.md`; types are `noul` (boolean), `choice`, `score`.

```jsonc
{
  "name": "frame-pedagogy",
  "questions": {
    "captionMatchesFrame": { "type": "noul",
      "instructions": "Does the caption describe something that is visible in the frame's text?" },
    "addsExactlyOneIdea":  { "type": "noul",
      "instructions": "Does this frame's caption introduce exactly one new idea, rather than two or more?" },
    "undefinedTerm":       { "type": "noul",
      "instructions": "Does the frame use a technical term that does not appear in any earlier beat label or caption?" },
    "hasConcreteArtifact": { "type": "noul",
      "instructions": "Does the frame show at least one concrete number, payload or named value, rather than only labels?" },
    "redundantCaption":    { "type": "noul",
      "instructions": "Does the caption repeat on-screen text nearly word for word?" },
    "density":             { "type": "score",
      "instructions": "How much is competing for attention in this frame?",
      "criteria": ["one thing to look at","a focus plus supporting detail",
                   "several things with no clear focus","no way to tell where to look"] }
  }
}
```

Then: `node kit/run.ts frame-pedagogy.json --dry-run` to validate and see the call count
before spending anything, then live. Batching is nearly free up to a point — 32 questions
cost the same latency as one, and at 100 latency roughly doubles because the questions
themselves consume the shared 32K budget. [measured, `NETER.md`]

Two cautions specific to this corpus:

- **`density` may belong in code.** You can count text elements deterministically — the
  real episode runs 11 → 53 → 15 across its beats. Measure whether the Jev `score` adds
  anything over the count. If it does not, move it (L3).
- **`privacyScan` runs before any call** and refuses emails, phone numbers and keys in any
  state bound for the API. Client-named frames and slides will trip it. That is correct
  behaviour, not an obstacle to route around.

### 3.4 The real corpus — 30 deployed CCAF episodes

The four references are a *fit* corpus for instrument design: four archetypes, 32 frames.
The corpus that actually matters is **CCAF Animated Explainers**, deployed and public:

**<https://ccaf-explainers.vercel.app/>** — 30 episodes, 5 modules, 40s each, 8 beats each,
~20 min total runtime. **240 frames.** Verified live 2026-10-05 (index HTTP 200; spot-checked
`1-1-agentic-loops` and `5-6-information-provenance`, both HTTP 200, ~339 KB, no auth wall —
so your colleague can open any episode directly).

| Module | Episodes | Share of exam |
|---|---|---|
| 1 · Agentic Architecture | 7 | 27% |
| 2 · Tool Design & MCP | 5 | 18% |
| 3 · Claude Code Configuration | 6 | 20% |
| 4 · Prompt Engineering | 6 | — |
| 5 · Context Management | 6 | 15% |

Source material: `claudecertificationguide.com/learn`. The stated pipeline is
*research → documentation → 8-beat storyboard → animated SVG episode → gate + render
verification → publish*, and every episode claims the layout gate plus a headless
zero-console-error check. **That claim is exactly what W1 exists to test independently** —
a passing layout gate says nothing about whether beat 5 teaches what its caption promises.

Two assets you will want, both local on Manu's machine at
`~/Downloads/CCAFall30explainers/`:

- `storyboards/` — **30 `.md` 8-beat storyboards.** The cheapest corpus in this whole
  handoff: pure text, no rendering, no snapshot step. Caption-level and beat-sequence
  questions can be measured here *before* you spend anything on frames. Start here.
- `explainers/` — the 30 built `.html` files.

**One known snag, scoped as your first task.** `frame-items.mjs` needs an episode *module*
(`.js`); the CCAF episodes exist as built HTML with the module inlined. I confirmed they
come from this same engine — `window.EXPLAINER = (function () {`, plus `__REGIONS`,
`__LAYOUT`, `__AUDIT` and `data-ex-stage` all present — but a one-pass regex extraction of a
runnable module from the HTML did **not** work, because the inlined script boundary is not
clean. So either ask Manu for the 30 source modules (far preferable — they must exist, the
pipeline built from them) or write the extractor properly. Do not burn a day on the regex;
ask first.

---

## 4 · W2 — Reviewing the questions

**Do not write this from scratch. It exists.** `JEV-works/kit/modules/contexts/meta.question-quality.json`
is the question meta-type asked of Jev itself: is a proposed question literal, single,
answerable from one record, decisive? It already screens the three classic defects —
`needsOtherRecords`, `asksForJudgementOfDegree`, `twoQuestionsInOne` — with a deterministic
lint (`meta-type.ts`) running first. Run it over your frame questions as items.

That is the cheap gate. The real gate is **measurement**, and the runner gives it to you
label-free: every run reports **JEV-SAFE / MARGINAL / MOVE-TO-CODE / NO-INFORMATION** per
question. Promote only what measures JEV-SAFE.

The four defects to hunt, all measured in `JEV-works`:

| Defect | Test | Lesson |
|---|---|---|
| Confident but useless — answered identically on every frame | **spread** < 0.08 → cut or rewrite | L5 |
| Needs reasoning, so never decisive | reaches the ends on <10% of items → move to code or escalate band | L3 |
| Wrong statistic for the type | `choice` → count distinct keys selected; `noul`/`score` → range. **Never the same statistic for both** | L24 |
| Dead gate | measure the entropy distribution on *your* corpus and report its max before relying on an entropy gate — one such gate never fired across 18 items because max entropy was 0.24 | L23 |

And the three recombination rules, because this is where plausible numbers come from:

- **Never AND per-question confidences together.** Decompose into many questions, recombine
  into one aggregate, threshold that. A conjunction gate escalated 94% of items. (L1)
- **Always report per-question confidence beside the aggregate.** Ten mid-band inputs sum
  to a decisive-looking number whose sign is an artifact of the weights. (L4)
- **Print per-term contributions, not just the aggregate.** A term pointing the wrong way
  the entire time was invisible to accuracy because a dominant term kept rescuing it. (L25)

And the one that will tempt you most: **when a result disappoints, change the instrument or
the question, never the threshold.** Thresholds get fitted on data you have set aside and
are not reporting. (L6)

### 4.1 Where `operadic-interview` comes in

The skill uploaded alongside this handoff is the *human-respondent* instrument, and it is
the right tool for two jobs here:

- **Eliciting the rubric from Manu** before you encode it. The frame questions should
  express what he actually grades episodes on, and he has not written that down. Generate
  a typed question tree rooted at `() → frame-quality-rubric`, run the interview, and
  read the compose rules off the answers. `references/META-PROMPT.md` is the generator.
- **The composed-vs-collapsed check**, which transfers directly to frame eval. Ask the
  root question *and* its children; where both have answers, compare. Agreement raises
  confidence, **disagreement is the finding** — never silently prefer either. Applied here:
  ask Jev "is this frame good" (collapsed) *and* the six narrow questions (composed), and
  report the gap. That gap is exactly the signal `JEV-works` already measured from the
  other direction: a phishing task scored 62.6% as one broad question and 95.1% decomposed
  into five narrow ones. [measured]
- **Its own failure mode is your failure mode.** The skill's founding law is
  `node.askable`: on regeneration, mid-level questions decay into category headers
  ("The hand-check", "Inventory") that organise their children instead of asking anything.
  `scripts/treelint.py` checks it mechanically — run it on **every** regeneration, not just
  the first generation. Your frame question set will decay the same way.

---

## 5 · W3 — Clean heuristics for slides

A slide is a harder object than a frame: no deterministic clock, no `render(t)`, no audit
function. So the honest sequencing is **extract first, judge second**, and keep the
geometry in code.

**Suggested order** [proposed]:

1. **Decide the projection.** What text does a slide expose, and in what structure —
   title, bullets, speaker notes, figure captions, source lines? That projection *is* the
   `state`. Write it down before writing questions; the frame work above only went
   smoothly because the projection was already decided.
2. **Put the mechanical checks in code**, exactly as the explainer gate does: word count,
   bullet count and depth, smallest type size, contrast, whether every figure carries a
   label, whether every claim line carries a source. All deterministic, all cheap, none of
   them a model's job.
3. **Keep the Jev question set small and literal.** Start from
   `JEV-works/kit/modules/contexts/bank.course-qa.json` — it is already scoped to
   "generated teaching content — a course section, **an explainer beat**, a walkthrough
   step" and ships four questions: `teachesOneThing`, `assumesUndefinedTerm`,
   `hasConcreteExample`, `plainLanguage`. Status is `drafted`, so it needs measuring, not
   designing. `bank.rubric.json` adds `completeness` and `supported` on a 4-level scale —
   note its own warning that polarity was never declared, so declare it before use.
4. **One heuristic per failure you have actually seen.** Not a general-purpose deck rubric.
   `hcsc-summit-library` and `pursuit-path-courseware` are where the real decks are; derive
   the heuristics from those, and record which deck taught you each one.
5. **Hold the brand constraints as code, not taste**: cream `#FAF7F2`, vermillion
   `#D94F30`, ink `#2C2A28`, no purple gradients, no emoji headings, WCAG AA,
   `prefers-reduced-motion`. Those are checkable, so check them.

The trap, stated plainly: a slide rubric is the most inviting place in this whole lane to
write ten questions about "clarity" and "impact". Every one of them will be an
`asksForJudgementOfDegree` defect that `meta.question-quality` already knows how to reject.
Run them through it before you run them on slides.

---

## 6 · Pedagogy — what to build, and what the eval agents should therefore reward

The eval instruments are only as good as the thing they are grading toward. These are the
established findings that bear on CETI's format, each with what it implies for the
questions in W1/W3. All **[published]**; the implications are **[proposed]**.

### 6.1 The findings that matter for this format

| Finding | Source | What it implies here |
|---|---|---|
| **Segmenting** — learner-paced segments beat continuous presentation | Mayer, *Cognitive Theory of Multimedia Learning*; Mayer & Moreno | The 8-beat player with scrub, chapter rail and keyboard *is* segmenting, done right. Preserve learner control; never ship a format that cannot be paused mid-idea |
| **Engagement falls off sharply past ~6 minutes**; shorter, pre-planned chunks hold attention | Guo, Kim & Rubin, *How video production affects student engagement* (L@S '14), 6.9M sessions | The ~40s episode and ~2min feature cut are already inside the good regime. Resist the long cut. If a topic needs 6 minutes, it needs **two anchors**, i.e. two episodes |
| **Coherence / weeding** — removing interesting-but-irrelevant material improves learning | Mayer; Harp & Mayer on seductive details | The MUST NOT list (no new gradients, no emoji, no hype words) is a coherence policy. Eval should penalise decoration that carries no load |
| **Redundancy** — identical narration *and* on-screen text hurts | Mayer, Kalyuga | Directly relevant now that LONGFORM adds voice: captions must **complement** the narration, not duplicate it. This is why `redundantCaption` is in the W1 seed set |
| **Signaling** — cueing the essential element improves transfer | Mayer; de Koning et al. | "One focal animation per beat; what fades as what arrives." The gate's one-scene-visible rule is a signaling guarantee. Eval should ask whether the focus is findable |
| **Spatial & temporal contiguity** — related words and pictures, together | Mayer | The persistent anchor plus a gated detail band is contiguity by construction. A frame that forces the eye across the canvas to pair a label with its figure is a real defect |
| **Worked-example effect** — studying a fully worked example beats unguided problem solving for novices | Sweller & Cooper; Renkl | "One example worked in full, every number derived in code" is the worked-example effect with an integrity check bolted on. **This is CETI's strongest pedagogical asset — grade it hardest** |
| **Element interactivity / intrinsic load** — difficulty scales with elements held simultaneously | Sweller, cognitive load theory | Justifies a *deterministic* density metric over an aesthetic one. Count the elements; do not ask a model how busy it feels |
| **Dual coding / multimedia principle** — words plus pictures beat words alone | Paivio; Mayer | Argues for the animated-diagram format over narrated slides for mechanism content, and against it for list-shaped content. Match format to content shape |
| **Pre-training** — knowing the components first lowers load when the process runs | Mayer | Why the feature cut exists for lay audiences. Beat 1 introduces the anchor; a frame that runs the mechanism before naming its parts is mis-sequenced |
| **Expertise reversal** — scaffolding that helps novices *harms* experts | Kalyuga, Ayres, Chandler & Sweller | **No single rubric is valid across audiences.** Every eval run must declare its audience, or its scores are not comparable |
| **Testing / generation effect** — retrieval practice beats restudy | Roediger & Karpicke | The opportunity in §6.3 |

### 6.2 Which videos to create, concretely

Reading the above against the archetype catalog and the 8-beat contract:

- **Prefer one mechanism with one persistent anchor.** The format's power is continuity;
  a topic with no single anchor is the wrong topic for an episode, not a reason to loosen
  the format. Two anchors = two episodes.
- **Prefer topics with derivable artifacts** — real numbers, a real payload, a real trace.
  The worked-example effect and the `__AUDIT()` contract point the same way. A topic where
  nothing can be derived in code will produce an unverifiable episode.
- **Prefer mechanism over taxonomy.** Dual coding favours the animated diagram where
  structure *moves*; list-shaped or definitional content is better served by slides or
  prose, and forcing it into 8 beats produces category headers instead of ideas — the same
  decay `node.askable` names on the interview side.
- **Match the cut to the audience, and say which.** 40s episode for a known-audience single
  mechanism; 2-min feature cut for lay audiences or broad topics (pre-training). Because
  of expertise reversal, the audience declaration is part of the artifact, not metadata.
- **Beat 8 is the thesis, not a summary.** It is titled exactly "Why it matters" and must
  reuse the anchor rather than introduce new layout. If beat 8 needs new layout, the
  episode was teaching the wrong thing — that is a content finding, and the eval should
  surface it as one.

### 6.3 The opportunity worth raising with Manu [proposed]

A frame-level question tree is, structurally, a **retrieval-practice instrument pointed at
the wrong audience.** The same typed questions that grade a frame could be asked of a
*learner* at that frame — the player already supports scrub and chapters, so the hooks
exist. Retrieval practice is one of the most robust findings in the literature, and it
would turn an eval byproduct into a teaching feature. Flagging it; not in scope here.

---

## 7 · Anti-patterns registry

Real failures with their source, not a generic cautionary list. Keep this file as the place
they accumulate — `LESSONS.md` puts it well: *a lesson nobody encounters again is a diary
entry; a lesson attached to the thing it governs is a guard.* Attach each one to the
instrument it governs.

### 7.1 Instrument anti-patterns [measured — `JEV-works/LESSONS.md`]

| # | Anti-pattern | The rule it produced |
|---|---|---|
| L1 | Gating on a conjunction of per-question confidences — escalated 94% of items, reclaimed 2 tokens | Recombine into one aggregate and threshold that |
| L2 | A question set of only intrinsic-value questions — kept 96% of items | At least one question must be relational |
| L3 | Asking the model something that needs reasoning over a goal or a counterfactual — reached the ends on 7% of 119 items | Split literal / deterministic / requires-reasoning before writing any policy |
| L4 | An aggregate laundering ten mid-band probabilities into a verdict of −1.56 | Report per-question confidence beside the aggregate |
| L5 | A question answered confidently but identically on every item | Check spread, not just confidence; <0.08 means cut it |
| L6 | Retuning thresholds until the number looked better | Change the instrument or the question, never the threshold |
| L23 | An entropy gate that never fired across 18 items; max corpus entropy was 0.24 | Measure the entropy distribution before relying on a gate |
| L24 | Reusing the boolean spread metric on a `choice` question, calling the most informative question in the set NO-INFORMATION | `choice` → distinct keys selected; `noul`/`score` → range |
| L25 | A term pointing the wrong way for the entire run, invisible because accuracy measured the argmax | Print per-term contributions |
| L26 | A question conflating two needs with opposite consequences ("information not in the request" = local filesystem *or* public internet) | Name the **source** of a need, not just the need |

### 7.2 Craft anti-patterns [measured — `skills/ceti-explainer/SKILL.md` MUST NOT]

These are already mechanically gated. Your eval must not duplicate them in a model — but
it must not assume they are clean either, since the gate is only run if someone runs it.

- `ex.pulse` for two scenes sharing a region — pulse spills its fades outside the window,
  so adjacent scenes double-expose into mush. Use `ex.seg`.
- Two visible blocks overlapping — the gate computes real bounding boxes every frame and
  fails the build; it exists because this happened.
- Hand-typing a derived value instead of computing it. Every on-screen number must be
  derived in code, or the frame can contradict itself.
- Unlabelled abstract shapes; SVG text below 11px; raw hex inside the diagram.
- New layout in the final beat instead of reusing the anchor.
- `setTimeout` / `setInterval` / CSS-keyframe sequencing — breaks the single clock, and
  with it every per-frame guarantee this handoff relies on.
- Hype words: unlock, supercharge, revolutionize, powerful, seamless, game-changing.

### 7.3 Instrument-decay anti-pattern [measured — `contrib/operadic-interview/SKILL.md`]

**Question-ness is not conserved across regeneration.** The skill's founding escape was
exactly this: a regenerated tree whose mid-level nodes had decayed from questions into
category headers organising their children — an outline with buckets, not questions within
questions. It is subtle, it survives review, and it is lint-checkable. Run
`scripts/treelint.py` on every regeneration. Expect the same decay in your frame question
set every time you rewrite it.

### 7.4 Pedagogical anti-patterns [published]

| Anti-pattern | Why it fails | Source |
|---|---|---|
| Narration that reads the on-screen text verbatim | Redundancy effect — splits the verbal channel against itself | Mayer; Kalyuga |
| Decorative extras that are interesting but irrelevant | Seductive-details effect — measurably depresses transfer | Harp & Mayer |
| Label and figure separated on the canvas | Split attention / contiguity violation — load spent on integration | Mayer; Sweller |
| One long continuous run instead of learner-paced segments | Segmenting violation; engagement collapse past ~6 min | Mayer; Guo et al. |
| One rubric applied across novice and expert audiences | Expertise reversal — the same scaffold helps one and harms the other | Kalyuga et al. |
| Running the mechanism before naming its parts | Pre-training violation — components and process compete for load | Mayer |

---

## 8 · Suggested first sequence

1. **Read §1, then §2.1.** The literal / deterministic / requires-reasoning split is the
   decision you will get wrong most expensively.
2. **Start on the 30 storyboards, not the frames.** `~/Downloads/CCAFall30explainers/storyboards/`
   is 30 markdown 8-beat briefs — no rendering, no snapshots, immediate. Measure the
   caption-level and beat-sequence questions there first.
3. **Build the instrument against the four references.** `node ../../eval/frame-items.mjs`
   on `self-attention.js` (derivation), `oauth.js` (process), `tcp.js` (state machine),
   `binary-search.js` (code/trace) — four archetypes, 32 items. The archetype spread is the
   point: a question that only works on derivations is not a frame question.
4. **Declare splits before any run** — fit vs test, in the spec. The runner refuses
   overlapping holdouts by id *and* by normalised text, the unit the model reads. Decide the
   split before you have seen a single answer.
5. **Run the seed questions through `meta.question-quality`** (§4) and fix what it rejects.
6. `node kit/run.ts … --dry-run`, read the call count, then run live. Read the label-free
   verdicts first — JEV-SAFE / MARGINAL / MOVE-TO-CODE / NO-INFORMATION — before you look at
   any aggregate.
7. **Then the 240 CCAF frames** (§3.4), once the module-source question is resolved.
8. **Interview Manu with `operadic-interview`** for the real rubric (§4.1), and compare the
   composed rubric against the collapsed one. Report the gaps as findings.
9. Only then the slide heuristics (W3), reusing `bank.course-qa` as the base.
10. Append every failure to §7 with its source, and attach it to the file it governs.

## 9 · Open questions for Manu

1. Does the audience declaration (§6.1, expertise reversal) belong in the episode module's
   `meta`, or alongside the eval spec? It has to live somewhere for scores to be comparable.
2. Which decks are the real slide corpus — `hcsc-summit-library`, `pursuit-path-courseware`,
   both? They carry client material, which interacts with `privacyScan`.
3. Where are the **30 CCAF episode source modules**? The built HTML is in
   `~/Downloads/CCAFall30explainers/explainers/`, but §3.4 needs the `.js` modules and
   recovering them from the HTML is not clean. This is the one thing blocking the 240-frame
   corpus.
4. This branch pushes the engine assets here, which makes `RUN.md` true. But `SKILLS.md`
   still says the live tree at `~/.grok/skills/` is canonical and this repo mirrors it — so
   who wins on the next divergence? Worth settling now that two copies exist.
5. Is the retrieval-practice idea (§6.3) worth a spike, or out of scope?
