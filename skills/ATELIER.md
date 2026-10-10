# The atelier skill family · workhorses for a category of films

Five skills, one per stage, each a reusable structure (typed slots, procedure, binding rules, output contract) with
references loaded only when needed. Together they encode the arsenal playbook so a film of any subject, chain,
brand or format is produced the same way.

| skill | category it serves | reads on demand |
|---|---|---|
| `atelier-brief` | any subject → a verifiable topic package (claims, count, commit, chain, look) | subject-kinds, formats |
| `atelier-draft` | a brief → one gated draft with every tunable a knob (2D or WebGL chains) | chain-recipes, kit2-contract, knob-catalogue, gate-rows |
| `atelier-select` | N drafts → blind ranking, winner, tool-applicable findings | frame-rubric, findings-schema |
| `atelier-pipeline` | topic(s) → shipped films through DRAFT ×3 → SELECT → FIX ×2 → SHIP with agents | agent-briefs, ship-checklist |
| `atelier-variant` | a finished film → client brand, chrome, material, level or cut with zero film edits | brand-packs, tweak-recipes |

Routing: one hand-built film → `explainer-factory`; anything with more than one agent or more than one draft →
`atelier-pipeline`, which calls the others. Laws live in `CLAUDE.md` and `factory/FORMAT.md`; the stage contract in
`factory/PIPELINE.md`; measured costs in `factory/films/simpsons-3d/PROTOTYPE.md`.
