---
name: sheaf-repair
description: >
  Compositional harness repair via controlled quotients and discrete alignment.
  Diagnoses restriction obstructions, quotients hidden mediators, re-runs exact
  CSP. Analog of meta-operad in the sheaf-* family. Zero weight updates: discrete
  proposals only. Trigger on "sheaf repair", "controlled quotient", "hidden mediator",
  "stale representative", "align restriction maps".
---

# sheaf-repair

If `sheaf-glue` reports ¬Φ, this skill proposes a **discrete** fix and asks glue
to re-check.

## Allowed moves

1. **Align** a shared field to a canonical representative (e.g. path case).
2. **Quotient** a nuisance interior field (workspace prefix, stale handle)
   out of the restriction checks — Batruin’s hidden-mediator construction.
3. Propose a new discrete restriction (still a field projection).

Each move is accepted **only** after `sheaf-glue` re-runs exact CSP and Φ holds
(or the remaining pre-image is still proper and the operator stops).

## Forbidden

- Treating vanishing relative H¹ as acceptance.
- Continuous / sheaf-neural learning of restriction maps (zero-weight violation).
- Overriding a critical CSP veto with a ranking score.

## Honesty (do not overclaim)

Controlled experiment: quotient halved candidate budget 2 000 → 1 000 in 20/20
clusters; exact CSP matched the quotient. SWE-bench Multilingual discovery:
118 vs 116 issues, p = 0.75. Discovery gate failed; confirmatory split sealed.
This skill implements the **invariance mechanism**, not a proven real-world
cohomological advantage.

## Aftercare

Always return to `sheaf-glue`. Repair that does not re-glue is not a global section.
