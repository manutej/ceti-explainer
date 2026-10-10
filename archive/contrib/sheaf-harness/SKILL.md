---
name: sheaf-harness
description: >
  One command that runs the Noether dual-loop with the sheaf-* family as ACV.
  Tagline: "Glue what the dual-loop conserves." Command: /sheaf-run
  Automatically Propose (kernel, localize, preserve) → Tailor (glue ⇄ repair)
  → Commit (Φ) → Meta (discrete only). Use whenever the user wants the final
  harness, a workflow YAML, or a simple slash command instead of calling
  sheaf skills by hand. Triggers: /sheaf-run, /sheaf, run the harness,
  glue what the dual-loop conserves, sheaf harness, noether sheaf workflow.
---

# sheaf-harness

The **operator**. Not a sixth vertex. The command that runs the other five
inside `noether-harness`.

```
/sheaf-run
```

**Tagline:** Glue what the dual-loop conserves.

## Why this exists

Calling sheaf-kernel, then localize, then preserve, then glue, then repair by
hand is the family used as a library. This skill is the family used as a
**harness**. It is what you put on a workflow, a slash command, or a standing
agent instruction.

## Automatic loop

```
/sheaf-run [<alias>]
        │
        ▼
   PROPOSE          sheaf-kernel
                    sheaf-localize ∥ sheaf-preserve
        ▼
   TAILOR*          sheaf-glue
                    if ¬Φ → sheaf-repair → sheaf-glue     (budget 1 unless YAML says more)
        ▼
   COMMIT           only if Φ
        ▼
   META             discrete ρ / quotient recorded; zero weight
```

Aliases:

| Type this | Scenario |
|---|---|
| `/sheaf-run` | default (broken glue → discrete align) |
| `/sheaf` | same |
| `Run the harness.` | same |
| `/sheaf-run hidden` | quotient a nuisance mediator |
| `/sheaf-run linear` | H¹-vanishes / Φ-fails → abstain |
| `/sheaf-run clean` | already a global section |
| `/sheaf-run course` | CETI explainer E0 (2-min commit, 5-min seam) |

## How it sits on noether-harness

`noether-harness` owns the dual-loop, the conservation embedding, and the
zero-weight law. `sheaf-harness` **fills the slots**:

- Propose’s candidate = typed stalks, not a blob of tool output.
- Tailor’s ACV = exact CSP Φ, not a rubric average.
- Commit’s conserved run = a global section of the capability sheaf.
- Meta’s search = discrete restriction / quotient proposals that must re-pass Φ.

If noether-harness is not loaded, this skill still runs the same four stages
and names the missing conservation lens as a warning. It does not invent
weight updates to compensate.

## Building a workflow

Copy a YAML, change `command` and `issue`, keep the four-stage skeleton.

```yaml
name: my-repair
command: /sheaf-run
tagline: Glue what the dual-loop conserves.
issue: "Session token expiry is not checked in auth/session.ts"
uses: [noether-harness, sheaf-kernel, sheaf-localize, sheaf-preserve, sheaf-glue, sheaf-repair]
loop:
  propose: [sheaf-kernel, sheaf-localize, sheaf-preserve]
  tailor:
    inner: [sheaf-glue, sheaf-repair]
    budget: 1
    decide: exact-csp          # never relative-H1
  commit: when Φ
  meta:
    allow: [discrete-restriction, quotient]
    forbid: [weight-update, accept-on-H1]
invariants:
  critical: [tests, public-api]
  soft: []
```

Standing agent instruction (paste as a user rule):

> When I say **Run the harness** or `/sheaf-run`, load `sheaf-harness` and
> execute the dual-loop. Do not skip glue. Do not accept on H¹.

## Honesty

Same as the family. Exact CSP decides. H¹ ranks. Batruin’s discovery gate
failed. Meta is discrete. Depth: `references/NOETHER-BRIDGE.md`,
`references/COMMAND.md`.
