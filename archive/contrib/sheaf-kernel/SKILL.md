---
name: sheaf-kernel
description: >
  Instantiate a finite capability sheaf for an agent harness: five vertices
  (Localization, Contract, Ordering, Preservation, Verification), six restriction
  maps as field projections, exact CSP Φ as the decision rule, relative cohomology
  as diagnostic only. Generator of the sheaf-* family — the Batruin analogue of
  meta-prompting. Use when a harness has multiple components that must agree on
  shared state, or when sheaf-localize / sheaf-preserve / sheaf-glue / sheaf-repair
  need a typed incidence graph. Trigger on "capability sheaf", "sheaf kernel",
  "harness incidence graph", "L C O P V", "restriction atlas".
---

# sheaf-kernel

The **μ-level** of the sheaf-* family. Zhang et al., *On Meta-Prompting*
(arXiv:2312.06562), gave meta-* its generator: an example-agnostic scaffold.
Batruin, *Capability Sheaves for Compositional Agent-Harness Repair*
(arXiv:2608.13228, 13 Aug 2026), gives this family its generator: a finite
capability sheaf whose global sections are accepted harness runs.

This skill does **not** produce a patch. It instantiates `F`.

Depth lives in `references/`. Read them; do not reinvent them:

- `references/THEORY.md` — stalks, restrictions, Φ, relative class, honesty.
- `references/INCIDENCE.md` — the five vertices and six overlaps, copied from the paper.
- `references/BIBLIOGRAPHY.md` — cite from here.

Sibling skills bind to this kernel:

| Skill | Role | Analog |
|---|---|---|
| `sheaf-localize` | stalks on L, C | meta-planning |
| `sheaf-preserve` | stalks on O, P | meta-design |
| `sheaf-glue` | exact CSP | meta-review |
| `sheaf-repair` | quotients + discrete alignment | meta-operad |

## When to use / when not

**Use** when two or more harness components (retrieval, routing, state, provenance,
verification, skills) share fields and can succeed locally while disagreeing.
**Do not use** for a one-shot edit with no shared state. Do not use to *train*
restriction maps — zero weight updates (see sheaf-repair).

## Kernel (compressed)

1. **Vertices** L, C, O, P, V with typed signature stalks.
2. **Edges** are the six observed overlaps; restriction = literal field projection.
3. **Φ(c)** = (∀v, s_v ∈ G_v) ∧ (∀e=vw, ρ_v s_v = ρ_w s_w). Exact finite CSP.
4. **Relative class** [b − Dx] ∈ coker D is diagnostic / ranking. Necessary for
   linearized gluing, **not sufficient** for executability.
5. **ACV**: critical membership is exact; never average a soft score over a
   restriction failure.

## Workflow

1. Name which harness parts occupy which vertices.
2. Confirm overlaps against the repo (do not invent extra edges).
3. Emit the incidence graph + Φ contract.
4. Hand F to `sheaf-localize` and `sheaf-preserve` (parallel). Then `sheaf-glue`.

## Honesty

Present structure as a **runtime-checked contract**, not a theorem about the
sampler. Batruin’s real-repository gate did not pass; do not claim cohomological
advantage over exact CSP.
