# Sheaf ACV occupancy

`noether-harness` owns the dual-loop, the conservation embedding, and the
zero-weight law. The sheaf-* family **fills ACV** so local skill success
cannot commit a run that disagrees on shared fields.

```
Propose  →  Tailor*  →  Commit  →  Meta
              ↑ inner               outer (zero weight)
```

| Stage | Does | Sheaf occupant |
|---|---|---|
| Propose | Candidate state + conservation embedding g_φ | sheaf-kernel + localize + preserve |
| Tailor | Bounded inner refinement. Critical first. | sheaf-glue ⇄ sheaf-repair |
| Commit | Write only if the soft pre-image is non-empty and proper | Φ holds (exact CSP) |
| Meta | Discrete restriction / quotient in context | sheaf-repair proposals, never gradient updates |

## Contract (do not weaken)

1. **Zero weight updates.** Adaptation lives in context, memory, lenses, discrete restriction proposals, and state.
2. **Critical first.** Soft scores never average away a failed critical lens.
3. **Soft pre-image proper.** 0 < m < d.
4. **ACV is exact.** With sheaf-glue installed, ACV is Φ(c). Relative H¹ may rank. It may not accept.

## Command

```
/sheaf-run
/sheaf-run course
```

Tagline: **Glue what the dual-loop conserves.**

See `skills/sheaf-harness` for the workflow YAML and the stage-to-skill map.
See `skills/ceti-explainer/COURSE-E0.md` for the short-course occupancy.
