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

## Index · documentation and artifacts the skills cite

Documentation (repo-local, no network needed)
| need | where | how the skills use it |
|---|---|---|
| p5.js 2.x behaviour, techniques, migration traps | `references/atlas/` (300 cited pages, hubs, `atlas.html` reader; `pages/index.md` is the home) | `skills/atelier-draft/references/p5-index.md` maps a need to the atlas page, the arsenal module and the p5 call in two hops |
| the arsenal modules | `arsenal/README.md`, each lane's `card.md` (with atlas backlinks), `arsenal/BRIEF.md` (module contract) | chain-recipes §1 and §2 |
| the kit | `factory/kit2/README.md` (film.json, K API, WebGL, knobs, libs) | kit2-contract.md |
| the format and the laws | `factory/FORMAT.md`, `CLAUDE.md`, `docs/DECISIONS.md` | every skill's rules section |
| the gate | `factory/tools/README.md`, `factory/tools/gate.mjs` | gate-rows.md |
| the pipeline | `factory/PIPELINE.md`, `docs/PROTOTYPES.md`, `factory/films/simpsons-3d/PROTOTYPE.md` | atelier-pipeline |
| brands | `arsenal/brands/*.json`, `schema.json`, `arsenal/SWEEP.md` | brand-packs.md, tweak-recipes.md |

Artifacts (published pages; private until shared)
| what | where |
|---|---|
| every shipped film, the showcase, the Opera House gold standard | `factory/ARTIFACTS.md` (id, title, link) and the film gallery it names |
| the arsenal gallery (contact sheets of every lane, kit2 brand-by-chrome matrices) | `factory/ARTIFACTS.md` §Arsenal gallery |
| the Design canvas with the blueprint and the brand packs | `HANDOFF.md` §6; Claude Design project "CETI Explainer Arsenal" (`arsenal/ds-bundle/`) |
| the atlas reader | `references/atlas/atlas.html` (open locally; publish as an artifact when a team needs it) |

Rules: a skill cites the atlas page (its S-id) when it writes or changes a card; a film that ships is published as an
artifact and added to `factory/ARTIFACTS.md` in the same commit; a drafter who needs a p5 call it has not used before
goes to p5-index.md first, then the atlas page, then the module card; nothing is fetched from the network at runtime.
