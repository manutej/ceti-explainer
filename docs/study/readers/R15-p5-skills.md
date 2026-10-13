# R15: ceti-p5-studio skills

Scope: `e933f5a4-skills.zip` (skills/ only, 75 entries). Path status: Z = in the skills zip; R = in `up6-references/references/`; A = elsewhere in uploads or scratchpad; X = absent everywhere.

## 1. Per skill

**p5-studio** (entry point). Triggers: `/p5-studio`, "make generative art", "p5 sketch of", upgrading an existing sketch. Steps: task list, intake, concept, forge, gate, seats, revise (max 3 passes), ship, capture (LEDGER, atoms, INDEX, studio-habits, tells). Writes: `<work>/<slug>/sketch.html`, CONCEPT.md, renders/, crit/, LEDGER.md. Gates: `gate.py --sweep 8 --inv … --zone …` with verdicts FAIL / COMMON / CANDIDATE; `lint.py` P0. Model routing: none named. Paths: the 13 files under `references/` are R. `scripts/gate.py`, `lint.py`, `render.py`, `ship.py`, `series.py`, `seat_packets.py` are X. `runtime/studio.js` is X as a file.

**p5-concept**. Triggers: "concept for a generative piece", "make it less generic", "diverge before coding". Steps: intake, intent, posture, five approaches with typicality summing to about 1, choose the lowest-typicality approach that serves the intent, unit tree with join scores, witness sentence, streams, palette, invariants written as `--inv` specs, flex, lineage, escape-hatch check. Writes CONCEPT.md. Gates: none run; invariants become gate specs.

**p5-forge**. Triggers: "write the p5 sketch", porting 1.x, shader, audio-reactive. Steps: copy template, one function per unit, scene as data in `setup`, clock choice, surface references, cost budget, self-check (lint, render seeds 1–3, look at contact.png). Reads: `templates/sketch.html` (X), p5/* (R), `runtime/studio.js` (X). Gates: `lint.py` no P0; render determinism.

**p5-crit**. Triggers: "critique this sketch", "is it too generic", "red-team", "evaluate the gallery". Steps: mechanical gate (vetoes), seven isolated seats via `seat_packets.py`, TRIAGE merge, named edits, pairwise re-seat with swap, capture. Reads: `references/seats/*.md` (Z), eval-stack, tells, operad §6 (R). Writes: gate.json, SCORECARD.md, contact.png, crit/*.md, TRIAGE.md. X: `scripts/seat_packets.py`, `series.py`, `metrics.py`, `motion.py`, `templates/calibration/`.

**p5-ship**. Triggers: "export my sketch", print, plotter, render a video, embed in explainer or dashboard. Steps: `ship.py` self-contained HTML, `render.py` exports (PNG at print density, plotter SVG, draw-on SVG, frame-stepped MP4, GIF), `motion.py` flash check, host bridges, colophon. Gates: determinism re-render; at most 3 flashes/s. X: `ship.py`, `render.py`, `motion.py`. External: ffmpeg, vpype.

**p5-explainer** (v0.4). Triggers: "explainer video about X", "long-form explainer with p5", "atelier", "compose from modules". Two modes: two-cut (feature and short) and Atelier. Eight-step pipeline: research, design ideation, storyboard plus `data.js`, parallel build lanes, `feature_gate.py`, independent crit, revise (max 3), film render, composite, parity. Model routing (prose only): Fable for research, design, consult and crit; Opus for build lanes, revisions and modules; Sonnet for atelier research lanes. Paths: all `assets/*` and `references/*.md` are Z. X: `scripts/film_render.py`, `composite.py`, `parity.py`, `feature_gate.py`, `assets/gate16.mjs`. The `$CE` and `$P5` paths in short-tier.md are machine-specific absolute paths.

## 2. The chain

The sketch line is studio, then concept, forge, crit, ship. Hand-offs are files: CONCEPT.md, then sketch.html, then renders/gate.json and crit/*, then the shipped HTML. p5-explainer is a separate line: it is not in studio's routing table, does not call concept, forge, crit or ship. The two share the clock law, the runtime (the bridge reads `window.Studio`) and several references. The only wired link is ship's bridge into the explainer background.

## 3. Crit seats

| Seat | Question | Pass criterion |
|---|---|---|
| Cliché hunter | Nearest known trope; identical, variation, distant cousin, or unfamiliar? | REJECT-AS-CLICHÉ blocks release. A PASS should be rare. |
| Composition | Figure–ground, hierarchy, negative space, rhythm, balance, frame | Wins most A/B criteria. No ties. |
| Colour | Value structure, one dominant plus accent, Itten contrast, chosen vs `random()`, clipping | A/B winner. |
| Craft | Technical moves, defects with line numbers, grade 1–5, one most valuable change | Only seat that sees code. |
| Intent fit | Elements serving «INTENT» versus decoration | A/B winner. |
| Metric auditor | Keep or dismiss each gate.json flag; any visible problem no metric flagged | No unresolved KEEP. |
| Wonder (advisory) | Ten-second look: stop scrolling? wall? rewards a second look? has a mood? | Advisory only. |

Merge rules: min over seats. Release needs Composition, Colour, Craft and Intent to prefer the new version, and Cliché must not be REJECT. Any two seats more than one step apart are recorded as DISAGREEMENT. Findings without evidence are struck. Contradiction: no quick or minimum panel can reach a release verdict.

## 4. The typesafe film

CONTRACT rules: module shape is `window.FEATURE`; `HAS_P5` switches on p5 layers with SVG fallbacks; colours are `--ex-*` roles only; one saturated accent per scene; type ≥11 px, ≤3 sizes; micro-cadence; no stretch over 3 s without motion; `render(t, state)` pure; p5 layers Canvas2D only, ≤12 ms per frame at 1080p, one Path2D per colour, each header states "each mark is one ___".

Storyboard: M1 Hook 0–12; M2 Contract 12–32; M3 Mask 32–56 (1,000 marks re-seat to 0.677/0.145/0.113/0.065, 128,256-token comb); M4 Scale 56–75 (2,000 runs through ten junctions at 0.95, 1,197 arrive); M5 Enforcement 75–96; M6 Limits 96–110; M7 Land 110–120.

Layers (all `P5Film.layer` z 6 except ground): ground (no-op), whale (1,200 marks), contract (≤180 marks), yard (1,000 load marks, 128k comb), runs (2,000 runs through junctions), pour (200 invoices per coupler), moire (two rail sets pitch 12 and 12.12).

film.json fields: film, title, format, description, fps 30, seed 7, w 1920, h 1080, preset "ceti", data, scenes, layers (seven paths), artifactTitles. Duration is `DUR=120` in data.js. No `module`/`src` key, which `build_film.py` needs.

Checks run: `TS.audit()` returns ok; all 20 captions ≤90 chars. Drift: STORYBOARD has 18 caption lines worded differently from data.js's 20; an `amount` control and a 12,000 manifest check in M6 are not in scenes.js; CONTRACT omits contract, pour and moire from its layer table.

## 5. atelier.md

A film is `Atelier.film({...})` with `draw(p, t, ctx)`, pure in (t, state, seed). `Atelier.AgentLoop` runs twin worlds on common random numbers. `U.stateAt` gives fixed-step physics. Commit controls; one score for live audio and WAV. `build.py` writes an offline page and an `.artifact.html`. Wiring: beat graph JSON → `node check.mjs graph --material stitch` → `tools/build_film.py` → `runtime/gate.py` → `render.py --stills --sheet`. Rules: numbers from AgentLoop or marks, else "sketch"; "expected", never "exact ±"; commit, twin, cost and ending live inside the Material; must-read text ≥14 px. Status: Grasp and Master specified per chrome but built only through the module demo; Bunraku is not a Material; REVISE.md referenced but missing. Collisions: `gate.py`, `render.py` and `build_film.py` each exist in three versions: studio, explainer, atelier.

## 6. Engine files: needed versus provided

Present (Z): `bridge.js`, `feature-engine.js`, `feature.template.html`, `shell.p5.template.html`, `build_feature.py`, `build_film.py`. `ce/` is byte-identical to the repo's `skills/ceti-explainer/assets/` (sha256 checked). Seven woff2 fonts and the Fraunces OFL are present.

Missing (X):
1. `vendor/p5-2.3.4.min.js` (alternative: `--p5 cdn`, jsDelivr p5@2.3.4).
2. `runtime/studio.js`: the only recoverable copy is the inlined v0.2.0 in built p5 pages (e.g. `base-rate.p5.html` line 660, ~450 lines). `bridge.js` `makeL` reads `S.seg`, `S.ramp`, `S.ease`, `S.stream` at construction, so the p5 cut fails without it.
3. `scripts/feature_gate.py`, `film_render.py`, `composite.py`, `parity.py`, `motion_film.py`.
4. `scripts/gate.py`, `lint.py`, `render.py`, `ship.py`, `motion.py`, `metrics.py`, `series.py`, `seat_packets.py`.
5. `templates/sketch.html`, `templates/calibration/`, `templates/film.json`, `templates/layer.*.html`.
6. `assets/gate16.mjs` (planned) and `assets/feature_gate.mjs` (cited by CONTRACT).
7. Tools: Playwright, ffmpeg, SwiftShader; fontTools and brotli for atelier.

Layout note: the skills reference `../../references`, `../../runtime`, `../../scripts` and `../../atelier` from `skills/<name>/`. The zip holds only `skills/`, so nothing runs from the zip alone.

## Core ideas for a master plugin

- The skill chain with file hand-offs: intake, concept, forge, gate, seats, revise, ship, capture.
- Divergence with typicality estimates before any code, plus a witness check on the unit tree.
- A mechanical gate as a veto (FAIL / COMMON / CANDIDATE) before any judgement.
- Seat-based crit: isolated seats, evidence required, min-over-seats, disagreement records.
- The forge loop: named edits, re-gate, pairwise re-seat, three passes, failures turned into lint rules and calibration cases.
- The clock law; "what p5 must earn" (count, conservation, response); "each mark is one ___".
- One data file feeding both renderings, with the audit run on the numbers.

## Experiment-specific choices

- CETI tokens, palette, fonts; the switchyard metaphor, the whale, the 120 s length and the seven-movement cadence; the eight atelier directions; named seat traditions; model names; hard-coded absolute paths; p5 2.3.4 as a fixed pin.

## What a master plugin that creates higher-quality plugins needs

1. A runnable root: ship runtime, scripts, templates and vendor together, with a manifest and an install check. About 30 referenced paths are X today.
2. One gate and one manifest: merge the three `gate.py` / `render.py` / `build_film.py` variants; one film manifest schema.
3. A single router: one entry point that picks sketch, explainer or atelier, with shared seats where criteria overlap.
4. Calibration: fixtures with known-good and known-bad cases; track gate false-positive and false-negative rates.
5. Drift control: generate storyboards and captions from data, or lint them against it.
6. Provenance: numbers carry source tags; a checker refuses unsourced claims; SOURCES.md ships alongside.
7. Portability: no absolute paths; extend the `UPSTREAM.sha256` pattern to every vendored file; keep the CDN version rule.
8. Regression films: reference films with expected gate JSON, so runtime or gate changes show up as diffs.
9. Model routing as configuration, and seat isolation as a mechanism rather than an instruction.
