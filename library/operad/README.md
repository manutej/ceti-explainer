# Atelier module library (v0.1)

This library composes CETI explainers from typed modules over **one Material**. Pedagogy modules never draw. The
Material draws every run, step, address, catch, cost, number and word in its own kernel and type. The design comes
from `INTERVIEW.md` (the operadic interview: 72 questions, 10 findings, 8 questions for Manu). The laws live in
`OPERAD.md` and the generated `operad.json`.

## Compose a new explainer

1. **Write a beat graph** (JSON) with `concept {claim, level}`, `params {N, k, p, c, retry, seed}` and `nodes`. Wire
   ports as `"node.port"`. Copy `demo/grasp.graph.json` (the full Grasp) or `demo/smoke.graph.json` (a short one).
2. **Lint it:** `node check.mjs my.graph.json --material stitch`. Hard laws (types, precedence, capacity, purity,
   no-draw) fail the lint. The [inf] budgets warn until you add a `waivers: [{law, reason}]` entry.
3. **Build:** `python3 tools/build_film.py my.graph.json stitch --id my-film --title "..." --out demo/build`. This
   runs the lint again, writes the film file, and calls `runtime/build.py` with the kits and the material's fonts.
4. **Gate and look:** `python3 ../runtime/gate.py demo/build/my-film.html`, then
   `python3 ../runtime/render.py ... --stills ... --sheet s.jpg --workers 1`.
5. **Swap the art:** rebuild the *same* graph with another material id. Nothing else changes.

Each new kernel is one file in `materials/` that implements the interface in OPERAD §3 and declares its `markRule`,
`nouns`, `axis`, `cell` and `nRange`. Each new beat is one `AM.module({...})` that calls only `env.M.*` and declares
`reveals`/`commits` so the precedence laws can see it.

## Catalogue

| id | type signature | source | grade |
|---|---|---|---|
| **pedagogy** | | | |
| agentLoop | `() → Ensemble` | runtime AgentLoop | — |
| gridLayout | `Ensemble → Arrangement` | material cell/aspect | — |
| traceOpener | `Ensemble → Trace × Run × Focus` | AD-v1 §0.4, THE TRACE | B (CF) |
| concretenessFade | `Trace × Ensemble → Arrangement` | MAP §2 CF | B |
| predictCommitReveal | `Ensemble → Commit` | MAP §2 PCR; REVISE | B |
| ensembleRun | `Ensemble × Arrangement × Run? → Arrangement × Ensemble` | MAP ENS + NF | B |
| failureAddress | `Ensemble × Arrangement → Focus` | AD §2 address | C |
| truthUnderEvidence | `Ensemble × Arrangement × Commit? → Arrangement × Number` | AD §0.3; MAP ENS | B |
| contrastingTwins | `Ensemble × Arrangement × Mix? → Arrangement × Number²` | AD §0.2; INTERVIEW F5 | C |
| costOfCheck | `Ensemble × Arrangement → Cost × Number` | PEDAGOGY-CRIT §1; F6 | C |
| correlatedCaveat | `Ensemble × Arrangement → ()` | AD §0.6; PC §3 C | C |
| transferQuestion | `() → Commit × Number` | MAP §5 FAR item | B |
| workedExampleFade | `Ensemble → ()` | MAP WE | A |
| inverseProblemWield | `() → Commit × Number` | MAP INV; PC defect 10 | C |
| **camera** | | | |
| frameFocus · pullBack · addressZoom | `Focus → Shot` | run/marbling log dolly; bunraku | — |
| crane · rackFocus | `() → Shot` · `() → Mix × Shot` | escapement; exposure onion skin | — |
| **materials** (kernel vendored intact under `materials/kernels/`) | | | |
| stitch | axis y, N ≤ 2,500 | chromes/run (stitch atlas, sub-pixel splatter) | — |
| plate | axis x, N ≤ 4,000 | archive/chromes/exposure (float plate, H&D, cyanotype) | — |
| pen | axis x, N ≤ 100 | archive/chromes/margin (glyphs, spring nib, Washburn bleed) | — |
| isotype | axis x, N ≤ 120 | archive/chromes/ledger (pictogram atlas, Hungarian) | — |
| maps | axis x, N ≤ 120 | chromes/marbling (Jaffer–Lu inverse maps) | — |
| sediment | axis x, N ≤ 4,000 | archive/chromes/delta (terrain, sediment bodies) | — |
| gear | axis x, N ≤ 300 | chromes/escapement (involute geometry, extract) | — |

Counts: 14 pedagogy modules, 5 cameras, 7 materials, 18 laws.

## Proof (`demo/`)

- **One graph, two materials:** `grasp.graph.json` (≈120 s) built as `grasp-stitch` and `grasp-plate`. Both gates
  PASS. Sheets are in `out/`. Rendering takes 0.05–0.2 s per frame.
- **Seven materials on one smoke graph:** `out/smoke-materials.sheet.jpg`. Wield (WE + INV): `out/wield-stitch.sheet.jpg`.
- **Negative lint cases** (`negative/`, output in `out/negative-lint.txt`): a type mismatch, P1, P7, INV and P10.
- `sh demo/make.sh all` rebuilds, gates and renders.

## Known weaknesses

- At N=500 the rack is sub-pixel per run. The rack morph aliases into stripes for about 2 s, and the stitch grid partly reads as a barcode.
- The commit beat is quiet: a ruler and three material ticks.
- At N=48, isotype, maps and gear read as textures. They need Glance-scale N to show their edge.
- Sound uses the runtime's four voices, re-pitched per material (Q-M1, Q-M3 are open).
- The caveat's ρ is a labelled sketch. Cost counts redone steps only.
- Bunraku is not a Material yet (its kernel is WEBGL).
- The runtime readout still says "exact ±" (F3).
