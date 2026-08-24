---
name: sheaf-glue
description: >
  Exact CSP for a capability sheaf. Accept iff every local section is good and
  every restriction agrees. Relative H¹ is ranking/diagnostic only — never the
  decision. Analog of meta-review in the sheaf-* family. Use when local skills
  report success and you need to know whether they form a global section.
  Trigger on "sheaf glue", "exact CSP", "global section", "Φ(c)", "restriction mismatch".
---

# sheaf-glue

Decision skill. Occupies **V** (verification stalk) and evaluates Φ on the whole
sheaf.

## Predicate

Φ(c) = ∧_v [s_v ∈ G_v] ∧ ∧_{e=vw} [ρ_v s_v = ρ_w s_w]

Also report:

- mismatch ledger (edge, field, left, right)
- whether the linearized relative class vanishes

## Hard rules

1. Never accept on vanishing H¹ alone.
2. Never let a soft score override a restriction failure.
3. If the class vanishes and Φ fails, name it: linearization missed a discrete
   type mismatch (string path vs integer handle, etc.).
4. Verification still **executes** tests. This skill is not a substitute for
   running the oracle.

## Requires

`sheaf-localize` and `sheaf-preserve` have filled L, C, O, P. Kernel graph present.

## On failure

Hand the mismatch ledger to `sheaf-repair`. Do not patch fields in this skill.
