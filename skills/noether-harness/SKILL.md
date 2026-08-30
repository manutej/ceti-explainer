---
name: noether-harness
description: >-
  Generate conservation-constrained agentic coding harnesses from the Noether Dual-Loop kernel — a
  μ meta-meta-prompt that emits a λ meta-prompt, which emits a concrete harness (typed
  conservation lens, four role prompts, per-framework fragments) for LangGraph, Aider, Cursor,
  OpenHands, AutoGen, ReAct+tools, or custom loops. Use whenever the user wants a self-refining
  coding agent where tests, type-checks, API stability, and architecture act as conserved
  invariants; a propose→tailor→commit→reflect dual loop with a bounded inner refinement loop and
  an outer invariant-learning loop; prediction-time "tailoring" (Alet et al.) transposed to LLM
  agents; or adaptation with ZERO weight updates / no fine-tuning. Also use to instantiate,
  extend, or explain such a harness. Trigger on "Noether harness", "conservation lens", "dual-loop
  agent", "tailoring loop", "tests-as-invariants harness", or a reference to the Noether
  meta-meta-prompt — even phrased only as "stop my agent breaking tests when it refactors."
---

# Noether Harness — Conservation-Constrained Agentic Coding Systems

This skill packages a **μ-level meta-meta-prompt** (`assets/meta-meta-prompt.txt`) that generates
harnesses in which a coding agent's edit trajectory is confined to a **conservation pre-image** — the
set of states that keep chosen invariants (tests green, types clean, public API stable, architecture
respected) approximately fixed. It is the LLM-agent transposition of **Noether Networks** and
**Tailoring** (Alet et al., NeurIPS 2021): *learn a useful conserved quantity, enforce it at prediction
time by tailoring, prefer approximate conservation* — pushed to its limit with **zero weight updates**.

When sheaf-* skills are loaded, they occupy **ACV**: exact CSP Φ decides;
relative H¹ ranks. Command `/sheaf-run` (alias `/sheaf-run course` for a
CETI explainer run). See **`references/SHEAF-ACV.md`**.

Depth lives in the references; read them, don't reinvent them:
- **`references/THEORY.md`** — Noether → Noether Networks → Tailoring → the categorical kernel.
- **`references/APPLICATION.md`** — four role prompts, lens patterns, harness fragments.
- **`references/BIBLIOGRAPHY.md`** — cite from here.
- **`references/SHEAF-ACV.md`** — sheaf family as exact ACV for `/sheaf-run`.
- **`assets/`** — μ generator, `conservation_lens.schema.yaml`, `closure-verification.md`.

## The three-level tower

| Level | Name | Emits |
|------:|------|-------|
| **μ** | `assets/meta-meta-prompt.txt` | a **λ meta-prompt** |
| **λ** | meta-prompt bound to one harness + domain | a **concrete harness spec** |
| **·** | lens YAML + role prompts + fragments | commits under conservation |

Default to **concrete** unless the user asks for the generator.

## When to use / when not

**Use** for a self-correcting coding loop with explicit invariants, or to explain / port such a harness.
**Do not use** for a one-shot edit, a non-agentic question, or anything that wants fine-tuning.
Zero weight updates is absolute (Kernel §8).

## Kernel (compressed — THEORY.md §IV is the source)

1. **Lens category L.** Critical lenses AND; soft lenses associative (score × confidence). Unit = null lens.
2. **State S / proposal P.** `(codebase, history, current lens, Meta 2-cell log)`.
3. **Conservation embedding `g_φ`.** Exact `S→C`; soft `S→(C×[0,1])`. Soft pre-image non-empty and proper (`0 < m < d`).
4. **Tailor family.** Approximate retracts, sequential closure, budget identity at `INNER_BUDGET`.
5. **Meta = Free ⊣ Forgetful.** η proposes invariants; ε prunes with a complexity penalty. 2-cell history persists.
6. **Dual-loop.** Propose ▹ Tailor* ▹ Commit ▹ Meta. Commit iff all critical pass AND soft ≥ τ AND progress > 0.
7. **Soft escape.** TTL-bounded, logged, only when critical is green and progress is positive. Critical never escapes.
8. **Zero weight updates.** No fine-tune, LoRA, or preference-opt. Adaptation is context, memory, lens, or state.

## Workflow

1. Fix level (λ vs concrete) and inputs: TARGET_HARNESS, TASK_DOMAIN, SEED_INVARIANTS, INNER_BUDGET=3, SOFT_HARD_BALANCE=0.3.
2. Map the domain onto the kernel. Fill `assets/conservation_lens.schema.yaml`.
3. Emit Proposer / Conservator / Tailorer / MetaReflector. Conservator: critical first, never averaged.
4. Emit judge template `{score, confidence, diagnosis, suggested_repair}` and the state schema.
5. Emit harness fragments for TARGET_HARNESS. Attach `assets/closure-verification.md`.
6. Justify at the requested theoretical depth. Be honest: gates, not theorems about the sampler.

## Command

```
/sheaf-run
/sheaf-run course
```

Tagline: **Glue what the dual-loop conserves.**
