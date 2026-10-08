# contrast-split

**Move.** contrast-two-cases (PED #14: Alfieri et al. 2013; Gentner 2003) + name-it-last (#15); NAR device 7 / 17.
Operad entry: MODULE-OPERAD §3. Combinator `M × M → M`: slot `inner` is A; B is the **same spec** with exactly one
parameter replaced (`vary.param ← vary.b`), resolved by the compiler. No nesting (no 4-way split).

**Ports.** needs = A.needs · gives A.gives ∪ `rule` · PO = A's, cloned into `left`/`right` (same id, label hidden) ·
τ = {T2 T3 T5 T6 T7 T8} ∩ A.types.

**Params.** `vary {param, b, tagA, tagB}` · `read` (each half's answer) · `scale` · `unit` · `decimals` · `pace`
(inner speed, holds keep 2 s) · `startPhase` (inner phases skipped; the halves open on that state) · `box` (the
inner's content box, its own coords) · `top` · `align {at, line, arcY?}` (a matched anchor: what is the same) ·
`differ {at, w, h, line {left} {right}}` · `principle {term, line}` · `hideLabel` · `notes`.

**Phases.** clone 2 s (the one object shrinks into the left half; a copy appears on the right) → flip 2 s (the rule
flips on the right as a **continuous wipe** from A's picture to B's — same seed, same cells — then B's tag is written)
→ `a.*` (the inner's phases, both halves on one clock) → align 3 s (a tie between matched anchors; similarities first)
→ differ 3 s (payoff: the one difference cued on both answers, ≠) → name 2.5 s (principle chip, last). The halves'
own foot lines and chips step back at align.

**p5.** The inner's layer drawn per half under translate + scale (and a clip while the wipe runs); one seed for A, the
A-copy and B. Declared cost = 3 × the inner's.

**Control.** `mirror` (swap the halves). Equivariance: no derived number changes under the swap — also checked in
`audit()` with the "exactly one parameter differs" check, the type floor (≥ 13 px at 1080p) and "the halves differ".

**Colour variables.** `tie` · `answer` · `principle` (+ the inner's).

**Fails.** more than one difference; the principle before alignment; halves too small; two unrelated pictures.

**Demos.** `build/demo-0.html` (AI, dark: two schemas on one junction — USD p′ 0.677 vs 0.857) ·
`build/demo-1.html` (cabs: a 15 % Blue city vs a half-Blue city — 41 % vs 80 %). `node test.mjs`.
