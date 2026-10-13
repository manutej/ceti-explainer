# commit-predict-reveal (CPR)

**Move.** commit-a-prediction (PED #2: Crouch et al. 2004; Kestin & Miller 2022; Brod 2021); NAR device 2.
Operad entry: MODULE-OPERAD §1. Combinator `M⟨payoff⟩ → M`, slot `inner`. CPR∘CPR is refused at wrap time.

**Ports.** needs `gap` ∪ inner.needs · gives inner.gives ∪ `dissatisfied` · PO = the inner's (untouched) ·
regions inner ∪ `inset` · τ = {T1 T4 T5 T7 T8} ∩ inner.types.

**Params.** `question` (≤ 70) · `range` · `step` · `unit` · `decimals` · `filmDefault {value, label, short?, src | illus}`
(never invented: cited or labelled *illus.*) · `countdown` (4 s) · `tolerance` · `read` (W.read spec over the inner's
numbers, when the inner has no `reveal()`) · `card {x,y,w}` · `axis {x0,x1,y,label}` (own axis, when the inner has no
`answerAxis()`) · `gapLine` · `notes`.

**Phases.** Two freezes spliced into the inner's clock, both on inner phase boundaries (no inner phase is split):
`… in.* │ ask 1.2 s · commit 4 s │ in.* up to the reveal │ gap 2.5 s (payoff) [· hold 2 s] │ in.* …`.
ask: the dashed card draws (the picture), then the question (L4). commit: the ring un-draws 4…1; the card fills with
the answer. The guess then **rides** from the card to the answer axis and stays through the reveal. gap: the counted
tick lands on the same axis, a bracket shows the distance (`gapMark` outside tolerance, `closeMark` inside) with
"most of us land here". If the inner's next phase is a declared hold, CPR adds none (L9: one hold per module).

**Splice interface (optional, on the inner).** `reveal(P) → {commitBefore, revealAfter, value}` and
`answerAxis(P) → {x0,y0,x1,y1,min,max}`. trap-and-correct implements both (commit before the steelman, reveal after
the right module's payoff, the meter as the axis). Default: commit before / reveal after the first payoff phase.

**Page vs video.** Page: `gates()` → `FEATURE.gates`; `core/gates.js` pauses the clock at `commit`, opens a commit
card (slider + Commit, 8 s timeout, skip), and writes `state['k.guess']`. Render stays pure in `(t, state.guess)`.
Video (`?film=1`): no gate; the card shows `filmDefault` with a visible countdown and "pause and guess"
(L10 checks the plan's ask/commit caption says "pause").

**Numbers.** `guess` (filmDefault) · `truth` (the inner's canonical answer) · `in.*` (inner numbers, prefixed).
Audit: inner audit ∧ question ≤ 70 ∧ filmDefault cited or illus ∧ truth derivable and in range.

**Colour variables.** `guess` · `answer` · `gapMark` · `closeMark` (+ the inner's).

**Fails.** a question with no prior; a card over the payoff region (it collapses before the reveal); two commits for
one reveal; an uncited default.

**Demos.** `build/demo-0.html` (AI, dark: around mass-reseat renormalize — "USD's share after the mask?",
illus. 42 % → counted 68 %) · `build/demo-1.html` (cabs, notebook: 80 % [Kahneman ch. 16] → 41 %). `node test.mjs`.
