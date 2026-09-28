# HANDOFF — CETI Explainer E0

## State

- Live skill tree restored as source of truth:
  - `ceti-explainer` — full episode engine + `COURSE-E0.md` occupancy
  - `noether-harness` — full dual-loop skill + `references/SHEAF-ACV.md`
  - `ceti-research` — Propose occupant, persist-on-generate
  - `ceti-brand` — cream / vermillion / ink
  - `sheaf-*` family lives in this repo (`skills/sheaf-*`); load from here
- GitHub: `https://github.com/manutej/ceti-explainer` (public). CETI org not available.
- 2-minute episode committed. 5-minute mux abstained; stills conserved.
- Engine, gate, shell, tokens, template, and the four reference modules are now in `skills/ceti-explainer/` (restored from the live tree). All four references gate PASS.
- Meta-prompt layer in place: `META-PROMPT.md` → `briefs/brief.schema.json` → `assets/brief-gate.mjs` → `assets/scaffold.mjs` → `assets/gate.mjs`.
- Episode 1 rebuilt as a deterministic SVG episode: `episodes/01-local-truths.{js,html}` (gate PASS, cream preset, screenshots checked at every beat midpoint and the 7→8 boundary). Refinement log: `skills/ceti-explainer/briefs/local-truths.edits.md`.

## Next agent

1. Read `REQUIREMENTS.md`, `EXPERIMENT-E0.md`, `SKILLS.md`, then `skills/ceti-explainer/META-PROMPT.md`.
   Every new episode starts as a brief JSON that passes `brief-gate.mjs`. No code before PASS.
2. Do not copy ceti-lookbook sentences. Palette and WOW bar only.
3. Episode 2 (Honest translators, functors) only after episode 1 quality is accepted. It is the *comparison* or *transformation* archetype; the comparison row of META-PROMPT.md §7 has no reference yet, so episode 2 doubles as its category-completeness test.
4. If a CETI GitHub org appears, transfer this repo; do not fork a second source of truth.
5. Persist generated media immediately. Generator stores drop paths (Localization failure).
6. Keep live `~/.grok/skills/` and `skills/` in this repo in lockstep.

## Command

```
/sheaf-run course
```

Tagline: Glue what the dual-loop conserves.
