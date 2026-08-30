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
- **`references/THEORY.md`** — where every construct comes from (Noether → Noether Networks → Tailoring →
  the categorical kernel → the honest theorem-vs-discipline framing → the agent lineage). Read this
  before explaining *why* the loop is shaped this way.
- **`references/APPLICATION.md`** — the four role prompts, lens-design patterns, the soft-judge template,
  the state schema, and copy-pasteable fragments for all six harness targets, plus a worked example and
  a failure-mode table. Read this before building anything.
- **`references/BIBLIOGRAPHY.md`** — annotated sources; cite from here, and attribute precisely.
- **`references/SHEAF-ACV.md`** — sheaf family as exact ACV for `/sheaf-run` and `/sheaf-run course`.
- **`assets/`** — the verbatim μ generator, the fillable `conservation_lens.schema.yaml`, and the
  `closure-verification.md` gate block that every emitted harness must carry.

## The three-level tower — keep it straight

| Level | Name | Emits |
|------:|------|-------|
| **μ** | `assets/meta-meta-prompt.txt` (generator of generators, domain-agnostic) | a **λ meta-prompt** |
| **λ** | meta-prompt (bound to one harness + domain) | a **concrete harness spec** |
| **·** | concrete spec (lens YAML + role prompts + harness fragments) | commits under conservation |

Most users want **level ·** (a harness they can run). Some want **level λ** (a reusable generator for a
whole class of their projects). Decide which before you produce anything (Step 1 below).

## When to use / when not

**Use it** when the deliverable is a *self-correcting coding loop with explicit invariants* — the user
wants an agent that refactors/edits without silently breaking things and that *learns what to guard*.
Also use it to explain, extend, audit, or port such a harness, or to instantiate the attached μ prompt.

**Don't use it** for a one-shot code edit, a plain Q&A about an algorithm, or a non-agentic task — there
is no loop to constrain. And do not use it to *train* anything: the harness's defining constraint is
**zero weight updates** (see Kernel §8). If a request wants fine-tuning/LoRA, this is the wrong skill.

## The kernel (summary — full treatment in `THEORY.md §IV`)

Every emitted harness must realize and **verify** these eight structures. This is the compressed form;
do not operate from it alone for anything subtle — go to `THEORY.md`.

1. **Lens category L (monoidal).** Lenses are objects; reweightings are morphisms. ⊗ combines them:
   **critical** lenses by logical AND (exact veto), **soft** lenses by an *associative* aggregation of
   (score × confidence). Unit = the null lens. The associator ⇒ **judge order-independence**.
2. **State S / proposal P.** State = `(codebase, history, current lens, Meta 2-cell log)`. Morphisms =
   edits, tool calls, reflection steps.
3. **Conservation embedding `g_φ` (internal hom).** Exact `S→C` (deterministic tools) and soft
   `S→(C×[0,1])` (judges + confidence). Its **soft pre-image** must be **non-empty** and **proper
   (`0 < m < d`)** — constrains *some but not all* degrees of freedom.
4. **Tailoring family (approximate retracts).** `Tailor_k : P→P`, each step moves the proposal *closer*
   to the pre-image (or inside the tolerance ball); **sequential closure** holds; a **budget identity
   morphism** makes the inner loop terminate at `INNER_BUDGET`; flaky critical tools get a retry +
   quarantine endomorphism.
5. **Outer Meta = Free ⊣ Forgetful.** Unit **η** proposes new invariants from observed failure/success;
   counit **ε** prunes/demotes with a complexity penalty. Meta is a **2-cell**; its history is
   persistent state.
6. **Dual-loop morphism.** `Propose ▹ Tailor* ▹ Commit ▹ Meta`, preserving the pre-image up to
   tolerance. **Joint stop:** commit ⇔ `(all critical pass) ∧ (soft ≥ τ) ∧ (progress > 0)`.
7. **Soft escape (controlled deformation).** A TTL-bounded, logged enlargement of the tolerance ball for
   ONE soft lens — permitted only when all critical pass and progress is positive. Prevents the freeze;
   **critical lenses are never escapable.**
8. **Hard negative constraint — ZERO weight updates.** No fine-tuning, LoRA, or preference-opt, ever.
   All adaptation is context, memory, lens, or state. Absolute.

## Workflow

### Step 1 — Fix the level and the inputs
Decide: does the user want the **λ meta-prompt** (a reusable generator) or a **concrete harness** (the
runnable thing)? Default to **concrete** unless they ask for the generator. Then gather the μ inputs —
infer from the conversation/codebase where you can; ask only for what you genuinely can't infer:

- `TARGET_HARNESS` — LangGraph | Aider | Cursor | OpenHands | AutoGen | ReAct+tools | custom
- `TASK_DOMAIN` — language(s), critical modules, existing tests, architectural constraints, noise level
- `SEED_INVARIANTS` — any critical/soft quantities they already know they want (optional)
- `INNER_BUDGET` — default **3**
- `SOFT_HARD_BALANCE` — default **0.3** (exact dominates; raise for refactor/exploratory work)
- `DEPTH_MODE` — `minimal` (kernel + protocols) or `full` (complete categorical constructions)
- `THEORETICAL_DEPTH` — how much of `THEORY.md` to surface in the justification section

If the user is vague ("make my agent stop breaking tests"), pick sensible defaults, state them inline,
and proceed — don't stall on an interview.

### Step 2 — Run the generation procedure (`THEORY.md` + `APPLICATION.md` are your source)
1. **Domain analysis** — map their codebase onto the kernel: natural objects in S, the morphisms, which
   **critical tools** and **soft judges** realize `g_φ`, and a measurable **progress proxy**. Use the
   critical-vs-soft heuristics in `APPLICATION.md §2` (deterministic + fast + unambiguous + merge-blocking
   ⇒ critical; valuable-but-not-mechanical ⇒ soft).
2. **Fill the lens** — start from `assets/conservation_lens.schema.yaml`; set `tau`, `SOFT_HARD_BALANCE`,
   `inner_budget`, the escape policy, the progress proxy, and `flaky_policy`.
3. **Emit the four role prompts** — Proposer, Conservator, Tailorer, MetaReflector (`APPLICATION.md §3`),
   bound to their domain. The **Conservator asymmetry is the linchpin**: critical = veto (checked first,
   no averaging), soft = gradient. Never let soft override a critical veto.
4. **Emit the soft-judge template** returning strict `{score, confidence, diagnosis, suggested_repair}`
   (`§4`), and the **state schema** including the append-only `meta_2cell_log` (`§5`).
5. **Emit the harness fragments** for `TARGET_HARNESS` (`§6.1–6.7`) — real, copy-pasteable code/config.
6. **Attach the ACV block** (`assets/closure-verification.md`) — the generation-time checklist and the
   R1–R10 runtime checks — wired into the harness so the loop checks its own preservation each cycle.
7. **Write the theoretical-justification section** at the requested `THEORETICAL_DEPTH`, mapping each
   construct back to Noether / dimensionality reduction / prediction-time tailoring / approximate
   conservation / meta-inductive bias — using `THEORY.md`, and **honestly** (Step 4).

### Step 3 — Deliver as files
A harness is something the user saves and runs, so **write files** to `/mnt/user-data/outputs/` and
present them: the `conservation_lens.yaml`, a `roles/` set (or a single roles doc), the harness
fragment(s) for their framework, and a short `README` explaining how the pieces fit and how to run the
ACV checks. If they asked for the **λ meta-prompt** instead, deliver that as a single self-contained,
loadable block (a file), following the μ generator's output contract.

### Step 4 — Self-verification gates (run before handing over)
Confirm the emitted harness passes the generation-time checklist in `assets/closure-verification.md`:

```
□ Dual-loop closed under the kernel        □ Soft pre-image non-empty & proper (0 < m < d)
□ Tailor steps are approximate retracts    □ Budget identity morphism present
   with sequential closure                 □ Meta is Free ⊣ Forgetful (η AND ε)
□ Soft escape stays a controlled retract   □ Zero weight-update constraint absolute
□ Meta 2-cell history is in state          □ Concrete harness fragments emitted
□ ACV (closure-verification) block present
```

If any line fails, fix the spec before delivering — an un-closed harness is not Noether-compliant.

## Two rules that keep this honest

- **Present structure as a contract with gates, not a proof.** In the LLM setting the categorical
  "guarantees" are **runtime-checked design invariants**, not theorems about the sampler
  (`THEORY.md §V`). This is more useful *and* more truthful — the abstraction is a compiler from
  "principled loop" to "runtime assertions." Do not claim it proves the model will behave.
- **Zero-retrain is absolute.** If any part of a request or a generated fragment implies weight updates,
  stop and route the adaptation into context/memory/lens/state instead. This is the constraint the whole
  lineage exists to honor.

## Command

```
/sheaf-run
/sheaf-run course
```

Tagline: **Glue what the dual-loop conserves.**

See `references/SHEAF-ACV.md` and `ceti-explainer/COURSE-E0.md`.
