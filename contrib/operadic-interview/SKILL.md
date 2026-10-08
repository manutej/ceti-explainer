---
name: operadic-interview
description: >-
  Turn any decision or brainstorm into an N-LEVEL TYPED QUESTION TREE — questions within
  questions within questions — where every node at every depth is a full, askable question with
  its own answer slot, answers compose upward by stated rules, and a person's direct answer to a
  parent question is checked against what their deeper answers imply (composed vs. collapsed
  consistency). Use for honing a fuzzy decision via structured interview: "help me figure out
  what I actually want", "build a question tree", "peel this question deeper", "operadic
  interview", "interview me about X", "what questions should I even be asking",
  "/operadic-interview". Also use to PARSE free-form talk into an existing tree's slots and
  surface where details contradict the gut. Do NOT use for multi-hop factual QA or pipeline
  verification (meta-operad), planning work agents will execute (meta-planning), or when the
  user already knows what they want and just needs it built.
---

# operadic-interview — the question fractal

An interview instrument, not a questionnaire. The decision under exploration becomes a rooted
tree in which **every node is a question**, children live *inside* their parent, answers flow
upward by explicit compose rules, and inconsistency between levels is surfaced as a finding
rather than silently resolved. Born 2026-07-29 in the deep-noether frontier session; its first
law was minted from its own first escape.

**Core in 6 lines:** every node at every depth is a direct, askable question with an answer slot
(`▷`). Children decompose their parent; a stated compose rule says how child answers produce the
parent's. Answering a parent directly = the *collapsed* answer; answering its children = the
*composed* answer; comparing them where both exist is the consistency check — disagreement is
the most informative signal the interview yields. Depth stops when children could no longer
change the parent's answer. Unanswered branches auto-collapse to their parent. No slot is
mandatory.

## The five moves

### 1. ROOT — type the decision
State the root as one question with a named answer type (e.g. `() → flagship-spec`,
`() → hire/no-hire`, `() → course-topic`). If you cannot name what type of thing an answer
would be, the root is not yet a question — split it.

### 2. GROW — decompose, keeping question-ness conserved
Peel the root into 3–6 child questions, each typed, each a *complete question in interview
voice* — then recurse. Two laws, both violated easily and both lint-checkable:

- **node.askable (the founding law):** every node at every level must parse as a direct question
  a person could answer out loud. The failure mode is real and subtle: on regeneration, mid-level
  questions decay into category headers ("The hand-check", "Inventory") organizing their
  children. That is an outline with buckets, not questions within questions. If a node reads as
  a label, restore its question text.
- **materiality (the depth law):** a deeper level is legal only if its children could change the
  parent's answer. In practice trees bottom out at **lived episodes** — what the person did,
  saw, sent, skipped, was told — because below lived experience, further branching is ceremony.
  Three levels is the common natural depth; N is whatever materiality permits.

Per subtree, write the **compose rule** — how child answers produce the parent's (argmax, filter
∧ filter, union, weighted read — say which, and say which child weighs double if one does).
Mark **★** on the one or two highest-yield questions per subtree so a hurried respondent knows
where to spend.

### 3. ASK — hand over the instrument
Deliver the tree as an answer sheet: nested (children indented inside parents), every node bold
question + `▷` slot, with the answering economics stated up front: *answer at any depth, in any
order, skip freely; deep answers are composed evidence; a shallow direct answer is its own
collapsed valuation; both at different depths = the built-in consistency check.* Podcast voice
throughout — questions should provoke memory and specificity, not abstraction ("narrate your
last pre-send ritual, step by step" beats "describe your quality process").

### 4. FILL — parse responses into slots
Respondents talk in streams, not slots. Parse free-form chat/voice into the tree: quote their
words into the matching `▷`, tag inferred placements as inferred, leave genuinely unanswered
slots empty (never pad). Show the filled tree back so they can correct placements.

### 5. COMPOSE & CHECK — surface the disagreements
Compose leaf→parent→root by the stated rules, making each step auditable. Wherever a node holds
BOTH a direct answer and a composed one, compare: agreement raises confidence; disagreement is a
**finding** — name the node, quote both answers, and ask about the gap ("your gut said courses;
your details point at client decks — which is wrong, the gut or the details?"). Never silently
prefer either. The output is the composed root answer + the findings list + the filled tree as a
durable artifact.

## Conservation lenses on the instrument itself (dogfood registry)

| lens | type | check |
|---|---|---|
| node.askable | critical | every node parses as a direct question with a `▷` slot; zero category labels |
| edge.typed | critical | root and L1 nodes carry named answer types; deeper types optional but never wrong |
| compose.stated | critical | every subtree with children has an explicit compose rule |
| depth.material | soft | spot-check: would each leaf's answer actually change its parent's? |
| episode.grounded | soft | leaves target lived episodes, not abstractions |
| slots.honest | critical | no slot filled with invented content; inferred placements tagged |
| findings.surfaced | critical | every composed-vs-collapsed disagreement reported, none resolved silently |

Run these on every regeneration of a tree — the founding escape was exactly a regeneration that
lost node.askable.

## Composition

Upstream: any fuzzy decision, or a decomposition from meta-prompting/meta-planning wanting a
human in the loop. Downstream: the composed answer feeds specs and plans (e.g. a λ-spec in a
noether-style build); rot mechanisms and hand-checks surfaced by the interview are directly
mintable as candidate conservation lenses. Sibling: meta-operad supplies the underlying algebra
(this skill is its human-respondent specialization — the "model" being consistency-checked is
the person).

## References (the skill's real power — read when you reach the phase)

| When you are… | Read |
|---|---|
| Generating a new tree for any decision domain | `references/META-PROMPT.md` — the example-agnostic generator: typed inputs, growth procedure, output contract, verification gates |
| Writing or repairing questions, choosing depth/breadth, composing rules, placing ★ | `references/TREE-CRAFT.md` — the two laws with failure modes, seven probe patterns, compose-rule vocabulary, regeneration discipline |
| Parsing answers, composing upward, surfacing disagreements, valuating | `references/OC-PROTOCOL.md` — fill/compose/check/valuate/close, the FINDING format, the cold-root check |
| Wanting worked instances | `references/EXAMPLES/` — four instruments across four personas: `instructor-flagship.md` (the founding example, incl. the escape), plus three COLD-GENERATED from META-PROMPT.md alone by agents with no other context: `nurse-director.md` (career/identity decision), `landscaper-expansion.md` (small-business capital go/no-go), `phd-topic.md` (ranked choice with kill-criteria). All four pass `scripts/treelint.py`. |
| Linting any instrument mechanically | `scripts/treelint.py FILE` — deterministic critic: node.askable, node IDs, breadth 3–5, compose.stated, ★ economy. Run on every generation AND every regeneration. |

This SKILL.md is sufficient to operate; the references are depth, not prerequisites.
