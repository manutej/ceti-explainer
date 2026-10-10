---
name: atelier-draft
description: "Build ONE draft of a factory film from a topic package: factory/films/<id>/[drafts/<x>/]{film.json, film.js, claims.json, lib/, NOTES.md}, assembled from arsenal modules, every tunable a documented knob, built with kit2, gated with gate.mjs, frame-stripped with frames.mjs. Covers 2D (structures, reveal, data-marks, layers…) and WebGL (webgl-scene, camera, morph-type, shader post) chains, any brand pack, chrome and level. Use this whenever a brief exists and a film, draft, variant draft, reel draft or showcase must be BUILT: 'draft the film', 'build this brief', 'draft a / b / c', 'make the webgl version', 'implement the beat sheet', 'build it with the arsenal', or as the DRAFT stage of atelier-pipeline. Not for choosing the subject (atelier-brief), judging drafts (atelier-select) or re-skinning a finished film (atelier-variant)."
---

> Inherits `${CLAUDE_PLUGIN_ROOT}/references/doctrine.md` and the laws in `${CLAUDE_PLUGIN_ROOT}/CLAUDE.md`. Use the kit
> as published: never patch `factory/kit2/`, `factory/tools/` or `arsenal/`; copy a module into `lib/` and change the
> copy. No git from this skill.

# atelier-draft · brief → one gated draft with knobs

The category: **a beat sheet with fixed claims, rendered as a pure function of time by a chain of arsenal modules,
with every tunable exposed so an evaluator who never reads code can still change the film.** Instances differ in
chain, renderer, look and register; the contract below never does.

## Typed slots

```
Brief:        factory/topics/<id>/{brief.md, claims.json, beats.md}      // immutable: numbers, beat order, chain
Register:     str                       // this draft's one-line look-and-motion idea (given by the pipeline, or chosen)
Target:       factory/films/<id>/ | factory/films/<id>/drafts/<x>/
Look:         {brand, chrome, material, level, renderer}                 // from beats.md header
Chain:        list[ModuleId]            // from beats.md; may be narrowed, never silently widened
Modules:      lib/<module>.js copies + lib/film.src.js + lib/assemble.py → film.js
Knobs:        film.json.knobs {name: value} + knobs_doc [{name, range|options, step, what}]
Captions:     film.json.captions [{t0, t1, text}]                        // digits only from claims.json
Page:         build/<id>.<brand>.<chrome>.html
Gate:         gate.json (VERDICT PASS | FAIL, rows G1–G10)
Frames:       frames/ (strips every 0.5 s, frames.json, s/frame)
Notes:        NOTES.md: register, chain, what you patched in a module copy, warnings left, s/frame, bytes
```

## Procedure

1. **Read the brief as law, the chain as a plan.** Look and chain come from beats.md's header when the brief has
   one, else from the pipeline's message; if neither names them, choose per the recipes and write the choice at the
   top of NOTES.md. Copy claims.json into the target unchanged. Read
   `references/chain-recipes.md` for the chain's recipe: what each module contributes, which tunables it exposes,
   its pitfalls. If a module in the chain cannot do the job (wrong renderer, cost, occlusion), swap it for the
   recipe's fallback and record why in NOTES.md.
2. **Set up the lib.** `lib/<module>.js` copies, `lib/film.src.js` (your code), `lib/assemble.py` concatenating
   them into `film.js` (shape in chain-recipes §3; every module you cut needs its own CUT pattern, written against its
   registration line; run assemble twice and diff). kit2's `libs` is the alternative when a module needs no patch.
   Module pitfalls that bite on first contact (a `background()` wipe inside a draw, canvas-drawn digits that are not
   claims, an alpha the module sets itself) are listed per module in chain-recipes §1 and §2; read the module's draw
   before you call it.
3. **Write film.js against the kit2 contract** (`references/kit2-contract.md`): `window.FILM_RENDER = {setup(p, K),
   render(t, state, K)}`; render pure in t; all seeded orders made once in setup; captions, commit, cards and brand
   card belong to the kit, not to you; text you draw gets a `data-role` through `K.tx`. Captions are static strings
   in film.json (no templates: write the resolved words). The commit box's own timing is the kit's (it fades in from
   `commit.at − 1`, rings for 4 s, seals at `+4.5`); beats.md timings for it are advisory. A chrome other than `none`
   scales your whole film box (ledger ≈ 0.78, memo ≈ 0.89) and keeps text at its floor: lay out on the 960×540 sheet
   and let the kit scale; never take beats.md's absolute geometry literally under a chrome. For `renderer: "webgl"`:
   origin at centre (`K.world`), set your camera every frame, `fonts3d` from the vendored faces, post filters only
   in the reveal window.
4. **Make every tunable a knob as you write it**, never afterwards: times a viewer could feel, camera keys, gaps,
   sizes, gains, looks. `references/knob-catalogue.md` lists the names practice converged on; read a value with
   `K.knob(name, fallback)` and document it in `knobs_doc` in the same edit. A number on screen is a claim, never a
   knob.
5. **Build, gate, strip, look once.**
   ```
   python3 factory/kit2/build.py <target> --brand <pack|path> --chrome <chrome>
   node factory/tools/gate.mjs <page> --film <target> --kit factory/kit2 --json <target>/gate.json --shots <target>/shots
   node factory/tools/frames.mjs <page> --every 0.5 --out <target>/frames
   ```
   Read `references/gate-rows.md` for what a row means before touching code. Look at the stills once; fix what
   breaks a law first, then what breaks the picture; at most one fix round in this skill (the pipeline owns the
   evaluator rounds).
6. **Write NOTES.md and hand back** (≤ 150 words): register, gate verdict and WARN rows, s/frame, bytes, knob count,
   what you patched in a module copy, what you left and why.

## Rules that bind the slots

- Claims and beat order are immutable; a caption may be re-worded but introduces no digit absent from claims.json.
- Counts before ratios, the commit before any number, one honest line, the brand card last (the kit enforces the
  card; you enforce the order).
- Render purity: no Math.random, Date, performance, frameCount, millis, rAF in film.js or libs (gate G3).
- Budgets: film code < 120 KB, page < 1.3 MB, s/frame < 1.5 headless (webgl post frames may touch it).
- Legibility floors 28/14/12 units through `data-role`; results never in the smallest face.
- Exec level: material ink, texture none; manager or engineer may use webgl and materials.

## Output contract

The target directory holds exactly: film.json, film.js, claims.json, lib/ (sources and assemble.py), NOTES.md,
gate.json, build/<page>, frames/ (frames.json committed, strips regenerated), shots/ (ignored). The build must be
byte-reproducible from lib/ (run assemble.py twice: identical film.js).

## References (read on demand)

- `references/chain-recipes.md` — the arsenal playbook: module table, recipes by visual job, assembly, costs.
- `references/kit2-contract.md` — film.json fields, the K API, coordinates, purity, hooks, build flags.
- `references/knob-catalogue.md` — the knobs practice converged on, by group, with ranges.
- `references/gate-rows.md` — G1–G10: what each checks, the usual cause, the fix that keeps the laws.
- Shipped examples to pattern-match shape, not content: `factory/films/simpsons-3d/` (webgl chain),
  `factory/films/wiring-and-the-whole/` (2D layers chain), `factory/kit2/smoke-webgl/` (minimal webgl).

## Documentation and artifacts

The family index `skills/ATELIER.md` §Index names where p5.js 2.x documentation (the atlas under `references/atlas/`,
mapped by `skills/atelier-draft/references/p5-index.md`), the arsenal cards, the kit contract and every published
artifact live. Cite the atlas page when you write a card; publish what you ship and record it in `factory/ARTIFACTS.md`.
