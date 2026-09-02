# CETI Explainer

Short-course explainers for sheaves, operads, and cohomology — for people who do not live in journals.

**Episode 01 · Local truths, global maps** is the first of five. This repo keeps the skills, the harness, the field notebooks, and the experiment log.

Public repo: https://github.com/manutej/ceti-explainer

There is no hosted studio yet. The product you can run today is a self-contained HTML episode built from `skills/ceti-explainer/`.

## Tagline

> Glue what the dual-loop conserves.

Command: `/sheaf-run course`

## Run an episode

Needs Node 18+ and Python 3. No npm install. Full steps: [RUN.md](./RUN.md).

```bash
git clone https://github.com/manutej/ceti-explainer.git
cd ceti-explainer/skills/ceti-explainer
cp assets/_episode-template.js my-episode.js
node assets/gate.mjs my-episode.js
python3 assets/build.py my-episode.js "Title"
```

Gold standard: `reference/self-attention.js`. Film occupancy: `COURSE-E0.md`.

## Experiment E0

The Noether dual-loop (Propose → Tailor → Commit → Meta) is the runtime. The sheaf-* family occupies ACV. Two new product skills sit on the loop:

| Stage | Occupant |
|---|---|
| Propose | `ceti-research` + `sheaf-kernel` + localize ∥ preserve |
| Tailor | `ceti-explainer` ⇄ `sheaf-glue` (`sheaf-repair` if ¬Φ) |
| Commit | 2-minute film + lookbook HTML, only if Φ |
| Meta | 5-minute expansion on the **same city**. Zero weight. Abstain if it does not glue. |

Round one result: the 2-minute lecture **committed**. The 5-minute single-file mux **did not glue**; the stills atlas is the conserved record.

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
RUN.md                   clone → gate → build
skills/ceti-explainer/   SVG episode engine + COURSE-E0.md film occupancy
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

- Zhang, Jiang, Zhao — *On Meta-Prompting* (arXiv:2312.06562)
- Alet et al. — *Noether Networks* (NeurIPS 2021, arXiv:2112.03321)
- Batruin — *Capability Sheaves for Compositional Agent-Harness Repair* (arXiv:2608.13228, 13 Aug 2026)
