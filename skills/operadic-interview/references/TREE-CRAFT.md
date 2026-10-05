# TREE-CRAFT — growing question trees that people actually want to answer

The instrument's power is in the questions. This file is the craft: the laws, the probe
patterns, the compose-rule vocabulary, and the regeneration discipline.

## The two laws, with their failure modes

**node.askable (critical).** Every node at every depth parses as a direct question with an
answer slot. The characteristic violation is not sloppy first drafts — it is *regeneration
decay*: when a tree is expanded or reformatted, mid-level questions quietly become category
headers ("The hand-check", "Inventory") that organize their children instead of asking
anything. The result reads as an outline with buckets. Lint mechanically: every node's text
ends in "?"; every node has its own `▷`. Founding evidence: this skill's own first L3
emission failed exactly this way and was caught by the respondent, not the author.

**materiality (soft, spot-checked).** A child earns its place only if its answer could change
the parent's answer. Two practical corollaries: (1) trees bottom out at **lived episodes** —
below what the respondent has personally done/seen/heard, further branching is ceremony;
(2) uniform depth is a smell — subtrees legitimately differ in depth, and padding a shallow
subtree to match its siblings violates materiality in the other direction.

**edge typing (critical at root/L1, optional deeper).** Name what type of thing each answer
is (`() → family`, `family → Π-source`, `dated → bool`). If you cannot name the type, you do
not understand the question — split it. Deeper levels may go untyped when the type is obvious
from the parent.

## Probe patterns — seven ways to reach lived experience

| Pattern | Shape | When |
|---|---|---|
| **Episode** | "Narrate the last time you … , step by step — what did you touch, in what order?" | Default leaf form; memory beats self-theory |
| **Contrast** | "Which do you do every single time — and which do you skip when tired?" | Separates true invariants from aspirations |
| **Counterfactual** | "What single check would have caught it five minutes after it entered?" | Converts pain into a mintable mechanism |
| **Scar-tissue** | "Which habit exists only because you got burned once — what was the burn?" | Surfaces already-learned laws with evidence attached |
| **Suppressed-demand** | "What would you do MORE often if it were completely safe/free?" | Reveals latent value the current process caps |
| **Surprise** | "Which signal has ever genuinely surprised you negatively?" | Tests whether a feedback source is outside their control |
| **Social-witness** | "What did people literally SAY when they saw it? Who would notice within a month?" | Externalizes value judgments the respondent can't self-report |

Craft rules: one question per node (no "and also" double-barrels); the respondent's own nouns,
not the framework's; concrete artifacts over abstractions ("which filenames carry -final-2"
beats "do you version things"); a question that can be answered badly out loud right now is
well-formed — one that requires preparation is a task, not a question.

## Compose-rule vocabulary

Every subtree states, in one auditable line, how children produce the parent:

- **argmax(f1 × f2 × f3)** — pick the child-evidenced item ranking highest on named factors
- **filter-chain (∧)** — parent = candidates surviving every child's constraint
- **union (∪)** — parent = the merged set of child answers (used for pools and graveyards)
- **weighted read, honesty-doubled** — qualitative weighing where one named child (usually
  the revealed-behavior question, not the aspiration question) counts double
- **pool-then-rank** — one child builds the candidate pool, siblings supply ranking factors

If no rule fits, the decomposition is wrong — regrow the subtree rather than inventing an
exotic rule.

## ★ economy

Mark one or two per subtree, by three criteria: highest expected information about the
parent; hardest to answer dishonestly (episode and surprise probes qualify; aspiration
probes never do); most likely to surprise the respondent themselves. The ★ set is the
minimum viable interview — state that explicitly in the preamble.

Refinement (learned in cold-generation testing): when a parent's compose rule is a product
or filter over ALL its children — no single child can substitute for the parent — starring
one of those children buys a redundant collapsed call, not new evidence. In that case leave
the level unstarred and say so in the preamble ("stars delegated to the per-factor
subtrees"). Never star to silence a lint warning; a documented delegation beats a diluted ★.

## Defaults and regeneration discipline

Breadth 3–6 at L1, 3–5 children per node below. Depth: grow until materiality stops you;
3 levels is the common natural depth for personal/professional decisions. On EVERY
regeneration (expansion, reformat, translation), re-run the full lens registry from
SKILL.md — node.askable decays on regeneration specifically, and the tree that guards
other things must guard itself.
