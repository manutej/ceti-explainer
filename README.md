# CETI Explainer

Short-course explainers for sheaves, operads, and cohomology — for people who do not live in journals.

**Episode 01 · Local truths, global maps** is the first of five. This repo keeps the skills, the harness, the field notebooks, and the experiment log.

Public repo: https://github.com/manutej/ceti-explainer

There is no hosted studio yet. The product you can run today is a self-contained HTML episode built from `skills/ceti-explainer/`. Episode 1 is built: `episodes/01-local-truths.html` (open from disk).

## Tagline

> Glue what the dual-loop conserves.

Command: `/sheaf-run course`

## Run an episode

Needs Node 18+ and Python 3. No npm install. Full steps: [RUN.md](./RUN.md).

```bash
git clone https://github.com/manutej/ceti-explainer.git
cd ceti-explainer/skills/ceti-explainer
node assets/brief-gate.mjs briefs/rag.brief.json          # typed brief → PASS + Φ ledger
node assets/scaffold.mjs briefs/rag.brief.json -o rag.js  # brief → module skeleton
node assets/gate.mjs rag.js                               # module → PASS
python3 assets/build.py rag.js "RAG" --preset ceti-course # → one offline HTML
```

Gold standard: `reference/self-attention.js`. Film occupancy: `COURSE-E0.md`.

## The meta-prompt layer

The skill is written as a **meta-prompt** in the sense of Zhang, Yuan & Yao
(*Meta Prompting for AI Systems*): an example-agnostic, typed structure for
the whole category *animated technical explainer*, not a pile of solved
examples. `skills/ceti-explainer/META-PROMPT.md` holds it.

```
brief.json ──brief-gate──▶ scaffold ──author──▶ module.js ──gate──▶ build ──▶ Title.html
     ▲                                                   │
     └──────────────── edit script (refinement pass) ◀───┘
```

| Piece | What it is |
|---|---|
| `briefs/brief.schema.json` | the typed input slot: mechanism, worked example (inputs · derivation · expected), 8 beats with one idea and one focal motion each, conserved motif / claims / duration |
| `assets/brief-gate.mjs` | Propose-stage gate. Prints PASS/FAIL and the sheaf-glue Φ ledger (motif ∧ claims ∧ duration) |
| `assets/scaffold.mjs` | the brief→module functor, mechanised. Immutable slots copied; `__AUDIT` fails until the derivation is code |
| `assets/gate.mjs` | Tailor-stage gate: 8 beats, timeline sweep, one lit scene per region, no block overlap, audit |
| `briefs/<id>.edits.md` | the refinement log: one edit script per pass, appended, never rewritten |

Every binding rule in the meta-prompt names the program that checks it.
A rule no program checks is a wish.

## Experiment E0

The Noether dual-loop (Propose → Tailor → Commit → Meta) is the runtime. The sheaf-* family occupies ACV. Two new product skills sit on the loop:

| Stage | Occupant |
|---|---|
| Propose | `ceti-research` + `sheaf-kernel` + localize ∥ preserve |
| Tailor | `ceti-explainer` ⇄ `sheaf-glue` (`sheaf-repair` if ¬Φ) |
| Commit | 2-minute film + lookbook HTML, only if Φ |
| Meta | 5-minute expansion on the **same city**. Zero weight. Abstain if it does not glue. |

Round one result: the 2-minute lecture **committed**. The 5-minute single-file mux **did not glue**; the stills atlas is the conserved record.

Round two (this branch): episode 1 rebuilt as a deterministic SVG episode through the meta-prompt pipeline. Brief `briefs/sheaf-glue.brief.json` passes Φ (motif ✓ · claims 4/4 ✓ · duration 40.2 s ✓); module `episodes/01-local-truths.js` passes the gate with the audit `g=(−3,−2,5) Σ=0 · glued r 9 p 12 q 20 · misread Σ=−1 → leftover 1 m`.

See [EXPERIMENT-E0.md](./EXPERIMENT-E0.md).

## Quality bar

Lookbook quality is a **bar**, not a corpus to copy. No text overlap with [ceti-lookbook](https://github.com/manutej/ceti-lookbook).

- Cream `#FAF7F2` · vermillion `#D94F30` · ink `#2C2A28`
- Unique signature visual per page
- No purple gradients, no emoji headings, no glassmorphism default
- WCAG AA, `prefers-reduced-motion`, mobile-ready
- Anchored in real concepts

## Course (five episodes)

1. **Local truths, global maps** — this round
2. Honest translators (functors)
3. Nested work (operads)
4. Leftover disagreement (cohomology)
5. The harness as a sheaf

## Repo layout

```
RUN.md                   clone → brief-gate → scaffold → gate → build
episodes/                built course episodes (01-local-truths.js + .html)
skills/ceti-explainer/   SVG episode engine + META-PROMPT.md + COURSE-E0.md
skills/ceti-research/    Propose occupant — conserved storyboard slots
skills/ceti-brand/       cream / vermillion / ink contract
skills/noether-harness/  dual-loop skill + SHEAF-ACV occupancy
skills/sheaf-*/          capability-sheaf family (kernel → glue ⇄ repair)
notebooks/               lookbook-grade HTML + field notebooks
EXPERIMENT-E0.md         occupancy, Φ, what Meta refused
REQUIREMENTS.md          locked product contract
```

Skills in this repo are the versions to load. The live user skill tree
and this folder must stay in sync — update both, then push.

## Org note

This repository lives at `manutej/ceti-explainer`. A CETI GitHub organization was not available on the authenticated account (no org membership). Transfer into a CETI org when that org exists.

## Papers

- Zhang, Yuan, Yao — *Meta Prompting for AI Systems* (arXiv:2311.11482, ICLR 2024 BGPT workshop) — the meta-prompt layer
- de Wynter et al. — *On Meta-Prompting* (arXiv:2312.06562)
- Alet et al. — *Noether Networks* (NeurIPS 2021, arXiv:2112.03321)
- Batruin — *Capability Sheaves for Compositional Agent-Harness Repair* (arXiv:2608.13228, 13 Aug 2026)
