---
name: p5-explainer
description: "The p5 tier of CETI explainers: two modes, one deterministic clock. Two-cut: one storyboard as the ceti-explainer SVG cut plus a p5.js cut whose canvas layers carry counted mass, thousands of runs or a 128k field, with live interactions, frame-exact MP4 (score, subtitles) and a layered tree. Atelier: an art department of 8 distinct chromes (material, kernel, type, sound), a Glance/Grasp/Wield/Master ladder, and typed modules that compose a film from a beat graph over one material. Use for /p5-explainer, \"make an explainer video about <concept>\", \"long-form explainer with p5\", \"interactive explainer\", \"rehaul ceti-explainer with p5\", \"render the explainer to MP4\", \"atelier\", \"art direction for an explainer\", \"new chrome/material for explainers\", \"compose an explainer from modules\", \"levels of understanding\", or a topic needing cardinality, conserved mass or a field SVG can only label. Not for a single generative piece (p5-studio, archived in archive/skills/) or a short SVG episode with no p5 need (ceti-explainer)."
---

> Inherits `${CLAUDE_PLUGIN_ROOT}/references/doctrine.md`. The clock contract of ceti-explainer is law: one clock, every frame a pure
> function of `(t, state)`, build once / mutate only, paused == playing. p5 never owns time.

# p5-explainer v0.4 — concept → storyboard → two cuts → film, or the Atelier

**Two modes, one clock law.** **Two-cut** (v0.3, below): the CETI skin, with p5 layers under an SVG storyboard, for a
topic that needs count, conservation or response. **Atelier** (v0.4, "Atelier mode"): when the look itself must
teach, for a new chrome or material, art direction, a film per audience, the levels ladder, or composing from modules.
Semantic colours and the clock stay; ground, material, type, camera and sound are free.

A film here is **a module, not a fork**: `data.js` (numbers, geometry, key moments) + `scenes.js` (`window.FEATURE`,
the whole film in SVG) + `layers/*.js` (`P5Film.layer(...)`). `build_feature.py` makes both cuts from the same files.
Worked example, end to end: `${CLAUDE_PLUGIN_ROOT}/archive/films/typesafe/` ("Type-safe AI", 120 s, 7 movements).

## The pipeline (do it in this order)

| # | Step | Owner (model routing) | Gate |
|---|---|---|---|
| 1 | **Research brief** — mechanism, worked example with derivable numbers, cited value, honest limits, aha line | research lane (Fable) | every number sourced `[Sn]` or computed in the brief |
| 2 | **Design ideation** — what p5 earns here; ≥6 metaphor systems with typicality; pick one; per-movement p5 vs SVG; interactions | design lane (Fable) | the "each mark is one ___" sentence exists for every p5 figure |
| 3 | **Storyboard + `data.js`** — 7 movements (LONGFORM cadence), captions ≤90 chars, key-moment table `TS.T`, geometry `TS.G`, `TS.audit()` | orchestrator | `node -e` audit ok; captions fit |
| 4 | **Build in parallel** against `CONTRACT.md` — SVG lane writes `scenes.js` (progressive enhancement: fallbacks only when `!HAS_P5`); p5 lane writes `layers/` | two execution lanes (Opus) | each lane renders and *looks at* its stills |
| 5 | **Gate** — `feature_gate.py` (contract, audit, state-swept frame sweep, purity, lint, type floor) | orchestrator | PASS |
| 6 | **Independent crit** — art director + pedagogy/honesty seats on side-by-side contact sheets | critics who did not build (Fable) | ranked fixes; facts re-checked against the brief |
| 7 | **Revise** (≤3 rounds) — data first (numbers, times, geometry), then both lanes | lanes | crit items closed, re-rendered |
| 8 | **Film** — `film_render.py` (frame workers) → `composite.py` (score, subtitles, mux; layered composite) → `parity.py` | orchestrator | parity PASS on the layered segment; MP4 plays |

## What p5 must earn (the rule that kept the first cut from being "the SVG cut with texture")

A thing goes to a p5 layer only if it passes two of: **count** (≥40 marks and the count is the point), **conservation**
(something is redistributed and the total must visibly hold), **response** (an interaction re-evaluates it at the same t).
Then make the *scale* the event: a 128k field is grey unless the camera zooms from 8 candidates to the whole vocabulary.
Load stays on its rails; marks never spray. Typical hero moments: the throat (mass re-seating through a junction), the
train (2,000 runs thinning into a 0.95ᵏ staircase), the zoom (powers of ten), the pour/spill (break of gauge), a moiré.

## Files

```
assets/feature-engine.js     long-form player: clock, speed chips, resume, poster, chapters, captions, transcript,
                             interaction panel from FEATURE.controls, window.__ctrl {play,pause,seek,setState,state}
assets/feature.template.html page shell (masthead, player, Try-it panel, synthesis, transcript, sources) + ?film=1 frame
assets/bridge.js             P5Film.layer / install: p5 instances under the SVG, drawn synchronously from render(t);
                             window.__film {ready, seek, only(groups), info} for the workers
assets/build_feature.py      <film-dir> → build/<id>.svg.html and build/<id>.p5.html (p5 inline or CDN)
assets/build_film.py         the short 8-beat variant (engine.js unchanged) + shared font/inlining helpers
assets/ce/                   vendored ceti-explainer engine, gate, tokens, presets (UPSTREAM.sha256)
assets/fonts/                Fraunces / DM Sans / Space Mono woff2 (OFL), embedded so headless == browser
${CLAUDE_PLUGIN_ROOT}/scripts/film_render.py frame workers: N headless pages, disjoint shards, --stills, --layers (alpha), --format jpg
${CLAUDE_PLUGIN_ROOT}/scripts/composite.py   score from TS.T + SRT + mux (soft subs; --burn), or layered overlay composite
${CLAUDE_PLUGIN_ROOT}/scripts/parity.py      layered composite vs single pass (MAE, off-share, hash distance)
${CLAUDE_PLUGIN_ROOT}/scripts/feature_gate.py the long-form gate
films/<id>/                  STORYBOARD.md · CONTRACT.md · film.json · data.js · scenes.js · layers/*.js · build/
```

## Commands

```
cd ${CLAUDE_PLUGIN_ROOT}/films/<id>
python3 ${CLAUDE_PLUGIN_ROOT}/skills/p5-explainer/assets/build_feature.py .                                    # both cuts
python3 $STUDIO/scripts/feature_gate.py . --step 0.25                      # PASS before anything ships
python3 $STUDIO/scripts/film_render.py build/<id>.p5.html --out R/full --format jpg --workers 3
python3 $STUDIO/scripts/composite.py . --frames R/full --out R/<id>.mp4 --burn --fontsdir <ttf dir>
# the tree: one sequence per layer (alpha), recomposited, compared
python3 $STUDIO/scripts/film_render.py build/<id>.p5.html --out R/L/bg --layers bg --from 38 --to 44
python3 $STUDIO/scripts/film_render.py build/<id>.p5.html --out R/L/yard --layers yard --from 38 --to 44
python3 $STUDIO/scripts/film_render.py build/<id>.p5.html --out R/L/svg --layers svg --from 38 --to 44
python3 $STUDIO/scripts/film_render.py build/<id>.p5.html --out R/L/single --from 38 --to 44
python3 $STUDIO/scripts/parity.py --single R/L/single --layers bg=R/L/bg,yard=R/L/yard,svg=R/L/svg
```

## Interactions (live page only)

`FEATURE.state` + `FEATURE.controls` (`toggle | range | select | number`, each with a `jump` time). The panel writes
state and re-renders the paused frame; `render(t, ctx)` reads `ctx.state`; p5 layers read `ctx.state` in `draw`.
Video renders use the defaults. Good interactions re-run the film's own arithmetic (the mask with `constrain` off; the
sampling draw `u`; per-step reliability) rather than adding a new toy.

## Atelier mode (v0.4) — `${CLAUDE_PLUGIN_ROOT}/` (runtime/, chromes/, library/)

An art department for educational animation. Doctrine, slate, levels, pipeline, crit lessons: `references/atelier.md`.

- **Runtime** `${CLAUDE_PLUGIN_ROOT}/runtime/` (`atelier.js` + build/gate/render): `Atelier.film({...})` with `draw(p, t, ctx)`
  pure in (t, state, seed); `Atelier.AgentLoop` (twin worlds on common random numbers, expected, sd); `U.stateAt`;
  commit controls; one score for live audio and WAV. `build.py` writes an offline page and a publishable `.artifact.html`.
- **Chromes** `${CLAUDE_PLUGIN_ROOT}/chromes/` (one folder each): escapement · marbling · delta · ledger · margin · bunraku · run · exposure.
  Each holds shared + native films, a kit, a make script, pages, gate JSON and sheets. Copy the shape, never the look.
- **Modules** `${CLAUDE_PLUGIN_ROOT}/library/`: 14 pedagogy modules, 5 cameras, 7 Materials, 18 laws linted by `check.mjs`.
  Pedagogy never draws; the Material draws everything, so one material id re-skins a whole film.
- **Research, crit** `${CLAUDE_PLUGIN_ROOT}/references/research/`, `${CLAUDE_PLUGIN_ROOT}/references/atelier/crit/` (juror, pedagogy seats).

**New direction:** card (mark rule, kernel, native topic, rungs) against the differentiation matrix → consult seats
(Fable) → one Opus team per direction per `${CLAUDE_PLUGIN_ROOT}/references/atelier/BUILDER.md` → gate → batch crit (Fable) →
`${CLAUDE_PLUGIN_ROOT}/references/atelier/REVISE.md (not in the sources)` → extract the kernel into a Material. **New film on existing materials:** beat graph → lint
→ build → gate → look.

```
A=${CLAUDE_PLUGIN_ROOT}
python3 $A/runtime/tools/build.py film.js --kit my.kit.js --out build --fonts "Face=face.woff2:400"
python3 $A/runtime/tools/gate.py build/<id>.html --json out/<id>.gate.json      # PASS before anything ships
python3 $A/runtime/tools/render.py build/<id>.html --out f --stills 1,8,15,22 --sheet out/<id>.sheet.jpg --workers 1
python3 $A/runtime/tools/render.py build/<id>.html --out f --workers 2 --mp4 out/<id>.mp4
sh $A/chromes/escapement/build.sh shared       # rebuild a chrome (escapement, run, exposure, margin use vendor/fonts;
                                               #  the others still need: cd _npm && npm install @fontsource/<face>)
node $A/library/operad/check.mjs $A/films/grasp/grasp.graph.json --material stitch     # the operad laws
python3 $A/library/tools/build_film.py $A/films/grasp/grasp.graph.json plate --id grasp-plate --title "…" --out $A/films/grasp/build
```

Rules: numbers from `AgentLoop` or the marks, else "sketch"; write *expected*, never "exact ±"; never pick seeds;
commit, twin, cost and ending live in the material (no modal, header strip or shared closing card); must-read text
≥ 14 px. Needs Node 18+, fontTools + brotli; the tarball ships without `node_modules`.

## Honest limits

Canvas2D only (headless WEBGL is ~0.5 fps at 1080p and breaks parity). Rendering is CPU-bound: ~0.5–1 s per 1080p
frame per core with SwiftShader; a 2-minute film is ~30–60 min on 2 cores. SVG antialiasing can differ by a pixel
between runs; parity uses tolerances, not equality. The score is synthesised and functional, not composed music. Atelier: WEBGL
chromes (escapement, bunraku) cost ~0.4–1 s/frame; bunraku is not yet a module Material; Grasp and Master levels are
specified per chrome but built only through the module demo (`grasp.graph.json`).

## References (load only what the step needs)

| File | When |
|---|---|
| `${CLAUDE_PLUGIN_ROOT}/archive/films/typesafe/STORYBOARD.md`, `CONTRACT.md` | the worked example and the two-lane contract — copy their shape |
| `references/feature-cut.md` | movement cadence, archetype mapping and the crit checklist for this tier |
| `references/longform.md` | the ceti-explainer long-form cadence this tier inherits (vendored copy) |
| `references/short-tier.md` | the 8-beat variant: engine.js unchanged, `build_film.py`, caption band in film mode |
| `${CLAUDE_PLUGIN_ROOT}/references/p5/performance.md`, `anti-patterns.md`, `tells.md` | before writing any layer |
| `${CLAUDE_PLUGIN_ROOT}/references/integration.md` | host contracts (`Studio.host`, `__sketch`) for the short 8-beat variant |
| `references/atelier.md` | Atelier mode: doctrine, depth ladder, invariants, 8-direction slate, levels, pipeline, crit lessons, composing |
| `${CLAUDE_PLUGIN_ROOT}/references/atelier/ART-DIRECTION-v1.md` | the full direction cards (§4) and differentiation matrix (§6) before designing a chrome |
| `${CLAUDE_PLUGIN_ROOT}/runtime/README.md` | the `Atelier.film` API, `AgentLoop`, headless hooks, wave-1 gotchas |
| `${CLAUDE_PLUGIN_ROOT}/library/operad/README.md`, `${CLAUDE_PLUGIN_ROOT}/library/operad/OPERAD.md` | module catalogue, Material interface, the 18 laws |
| `${CLAUDE_PLUGIN_ROOT}/references/research/PEDAGOGY-MAP.md` | choosing beats per audience and level; crit-seat gate questions |
| `${CLAUDE_PLUGIN_ROOT}/chromes/*/README.md` | one direction's ladder specs and known weaknesses |
