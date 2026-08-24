---
name: noether-harness
description: >
  Dual-loop coding harness with a conservation lens and zero weight updates
  (Alet et al., Noether Networks, NeurIPS 2021). Stages: Propose, Tailor,
  Commit, Meta. Critical lenses never averaged. Soft pre-image must stay
  non-empty and proper. Use as the outer runtime; sheaf-* skills plug into
  ACV as the local-to-global gate. Triggers: noether-harness, dual-loop,
  conservation lens, zero weight updates, /sheaf-run, run the harness.
---

# noether-harness

Runtime for conserved agent work. The sheaf-* family does **not** replace this
skill. It occupies the ACV (closure-verification) slot so local skill success
cannot commit a run that disagrees on shared fields.

## Dual-loop

```
Propose  →  Tailor*  →  Commit  →  Meta
              ↑ inner               outer (zero weight)
```

| Stage | Does | Sheaf occupant |
|---|---|---|
| Propose | Emit a candidate state and a conservation embedding g_φ | sheaf-kernel + localize + preserve |
| Tailor | Bounded inner refinement. Critical checks first. | sheaf-glue ⇄ sheaf-repair |
| Commit | Write only if the soft pre-image is non-empty and proper | Φ holds (exact CSP) |
| Meta | Search new invariants / discrete restriction maps in context | sheaf-repair proposals, never gradient updates |

## Conservation contract (do not weaken)

1. **Zero weight updates.** Adaptation lives in context, memory, lenses, discrete restriction proposals, and state. No fine-tuning.
2. **Critical first.** Soft scores never average away a failed critical lens.
3. **Soft pre-image proper.** 0 < m < d. Empty = nothing conserved; full = the lens is vacuous.
4. **ACV is exact.** With sheaf-glue installed, ACV is Φ(c). Relative H¹ may rank. It may not accept.

## Command

Do not invoke the dual-loop by listing stages. Use the composer:

```
/sheaf-run
```

Tagline: **Glue what the dual-loop conserves.**

Aliases: `/sheaf`, `Run the harness.`

See `sheaf-harness` for the workflow YAML and the stage-to-skill map.
