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

Gold standard: `reference/self-attention.js`. Film occupancy: [`contrib/COURSE-E0.md`](./contrib/COURSE-E0.md).

## Experiment E0

The Noether dual-loop (Propose → Tailor → Commit → Meta) is the runtime. The sheaf-* family occupies ACV. Two new product skills sit on the loop:

| Stage | Occupant |
|---|---|
| Propose | `ceti-research` + `sheaf-kernel` + localize ∥ preserve |
| Tailor | `ceti-explainer` ⇄ `sheaf-glue` (`sheaf-repair` if ¬Φ) |
| Commit | 2-minute film + lookbook HTML, only if Φ |
| Meta | 5-minute expansion on the **same city**. Zero weight. Abstain if it does not glue. |

Round one result: the 2-minute lecture **committed**. The 5-minute single-file mux **did not glue**; the stills atlas is the conserved record.

See [contrib/EXPERIMENT-E0.md](./contrib/EXPERIMENT-E0.md).

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
skills/ceti-explainer/   SVG episode engine
skills/ceti-research/    Propose occupant — conserved storyboard slots
skills/ceti-brand/       cream / vermillion / ink contract
contrib/                 noether-harness, sheaf-*, operadic-interview, EXPERIMENT-E0.md, COURSE-E0.md, SKILLS.md (not shipped)
notebooks/               lookbook-grade HTML + field notebooks
REQUIREMENTS.md          locked product contract
```

The p5 film tier and the rest of the merged plugin are described in **Layout** below.

Skills in this repo are the versions to load. The live user skill tree
and this folder must stay in sync — update both, then push.

## Layout

The repo root is the plugin root (`.claude-plugin/plugin.json`, `ceti-explainer-atelier` 0.2.0). Tools find it by
walking up to that file (`scripts/paths.py`, `scripts/root.mjs`); set `CETI_ROOT` to override. Notes on the merge,
the path patches and what is still open: [MERGE-NOTES.md](./MERGE-NOTES.md).

```
.claude-plugin/plugin.json   plugin manifest; skills are discovered in skills/
skills/                      ceti-explainer (SVG episodes), ceti-brand, ceti-research, p5-studio, p5-concept, p5-forge,
                             p5-crit, p5-ship, p5-explainer (feature cut, plan and Atelier film tiers)
runtime/                     Atelier runtime: dist/atelier.js (+ atelier.sha256), tools/{build,gate,render}.py,
                             src/studio/studio.js (ceti-p5-studio runtime 0.2.0), examples/ (smoke films), README
library/operad/              AM module operad: am.js, laws.js, compose.js, check.mjs, operad.json, OPERAD/README/INTERVIEW
library/modules/             AM pedagogy modules (core, evidence, transfer beats)
library/materials/           7 materials + kernels/ (vendored chrome kernels)
library/cameras/             cameras.js
library/tools/               build_film.py (beat graph + material → film page)
library/plan/                plan-compiled explainer library: core/ (compile, lint_plan, build_plan), modules/ (6),
                             METHOD, MODULE-OPERAD, BUILD-SPEC, CHANNELS, QUESTION-TREE, research/
chromes/<id>/                8 art directions: NOTES, README, kit, shared + native films, build script, out/*.gate.json
films/                       base-rate (plan + copy), typesafe (feature-cut worked example), grasp (beat graphs, negatives)
references/                  studio doctrine, tells, technique atlas, p5 2.x notes, atelier/ (BRIEF, BUILDER,
                             ART-DIRECTION v0/v1, crit/), research/ (pedagogy map, PED-L1..L4, notes/01-06)
scripts/                     paths.py, root.mjs, requirements.txt, channels/ (reel, carousel, PDF, video, blog, newsletter)
vendor/                      p5-2.3.4.min.js (LGPL-2.1), fonts/ (34 files, OFL), fonts.lock.json, SHA256SUMS, LICENSES.md
tests/                       proofs.sh, node/ (unit tests), baselines/ (gate, check, lint and build JSON)
factory/                     the 75-second case factory: FORMAT.md, kit/, kit2/ (the default build: brand, chrome, material
                             injected), tools/ (gate.mjs, catalogue.py, new_topic.py, repo_topic.py: a git repo to a topic),
                             topics/, films/ (15 shipped), CATALOGUE.md; README: factory/README.md
arsenal/                     pattern and material library (24 lanes), core/ (timeline, generator), structures/, 22 brand packs
                             in brands/, tools/ (shoot, export, brand_check, tweak, ds_bundle), ds-bundle/; index: arsenal/README.md
references/atlas/            the p5 atlas: pages/<slug>.md that the arsenal cards cite
docs/                        DECISIONS.md (binding: D1 to D10, Q1 to Q15), study/
scripts/doctor.sh            cold-start check (tools, vendor hashes, kit and kit2 builds, brand contrast)
[HANDOFF.md](./HANDOFF.md)                   the orchestrator's state-of-the-repo note, written at each hand-off; read it first
eval/, notebooks/            unchanged
```

### Cold start

```bash
sh scripts/doctor.sh          # tools, vendor hashes, kit and kit2 builds, brand packs
sh tests/proofs.sh all        # every film and demo rebuilds and gates (about 10 minutes)
open factory/CATALOGUE.md     # the shipped films; HANDOFF.md (written by the orchestrator) says where things stand
```


Built pages (`build/`, `*.html` outside `notebooks/`), renders and `_npm/` are not committed (see `.gitignore`).

### Build from the repo: the four proofs

Setup once: `pip install -r scripts/requirements.txt` and a Playwright Chromium (`python3 -m playwright install chromium`,
or point `PLAYWRIGHT_BROWSERS_PATH` at an installed one). Then, from the repo root:

```bash
# (i) an Atelier chrome film: build, then the 10-row gate
sh chromes/escapement/build.sh shared
python3 runtime/tools/gate.py chromes/escapement/build/escapement-shared.html
# (ii) the module operad: lint a beat graph, then compose and build it in one material
node library/operad/check.mjs films/grasp/grasp.graph.json --material stitch
python3 library/tools/build_film.py films/grasp/grasp.graph.json stitch --id grasp-stitch --title "Grasp in stitch" --out films/grasp/build
# (iii) the plan library: lint (L1-L13 + p5 budget) and build the base-rate film
python3 library/plan/core/build_plan.py films/base-rate/plan.json
# (iv) the SVG episode gate and the plan-module tests
node skills/ceti-explainer/assets/gate.mjs skills/ceti-explainer/reference/self-attention.js
for t in library/plan/modules/*/test.mjs; do node "$t"; done
```

`sh tests/proofs.sh` runs all four (plus `node --test tests/node/*.test.mjs`).

## Org note

This repository lives at `manutej/ceti-explainer`. A CETI GitHub organization was not available on the authenticated account (no org membership). Transfer into a CETI org when that org exists.

## Papers

- Zhang, Jiang, Zhao — *On Meta-Prompting* (arXiv:2312.06562)
- Alet et al. — *Noether Networks* (NeurIPS 2021, arXiv:2112.03321)
- Batruin — *Capability Sheaves for Compositional Agent-Harness Repair* (arXiv:2608.13228, 13 Aug 2026)
