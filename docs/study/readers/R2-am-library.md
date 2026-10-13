# R2: Atelier module library "AM"

Scope: `scratchpad/up3/modules/`. Verified by re-running `check.mjs` on a scratch copy (`scratchpad/verify-am/`, runtime copied from `up4-runtime/runtime`). The grasp lint reproduces `demo/out/grasp.check.txt` (modulo trailing spaces), the four negatives reproduce their FAIL lines, `--export` reproduces `operad.json` exactly, and `--scan` finds 0 issues.

## 1. Beat-graph JSON

- Top level: `id`; `concept {claim, claimId?, audience?, level}` (level: glance|grasp|wield|master); `params {N,k,p,c,retry,seed}` (defaults 1000, 20, .95, .8, 1, 1); `waivers [{law, reason}]`; optional `tail` (default 1.2 s); `nodes`.
- Node: `{id, module, params?, in?: {port: "srcId.outPort"}, at?, dur?, layer?, linger?}`. Ids contain no dots.
- `at`: seconds, or `"id.start+x"` / `"id.end-x"` referencing an earlier node. Forward references throw.
- Default start: after the last stage/overlay. Cameras default to the last stage/overlay start. `layer:"none"` starts at 0.
- Layers: **stage** owns the frame until the next stage; **overlay** draws in `[start, end+linger)`; **camera** is the latest started shot; **none** is build-only.

## 2. Port types and registries

`AM.TYPES` declares 13 types. Ten appear as ports: Params, Evidence and Material never do (compose supplies the Material). Registries: `AM.modules` (14 pedagogy), `AM.cameras` (5), `AM.materials` (7: stitch, plate, pen, isotype, maps, sediment, gear), `AMLaws.LAWS` (18). Registration checks required keys, but re-registering an id silently overwrites.

## 3. Laws (`core/laws.js`)

| id | hard | grade | mechanical check |
|---|---|---|---|
| TYPE | H | — | port types match; required ports wired; no unknown port or module; source starts before its reader |
| SEED | H | C | each twin's engine is reached from an ENG node |
| P1 | H | B | no reveal of family F (text before `@`) before a PCR/TRF commit of F closes |
| P2 | H | A | `count` needs an earlier ENS (ENS/TRF/INV exempt); `percent` needs its count earlier |
| P3 | H | B | CF concrete before morph; CF ends before the first ENS |
| P4 | H | A | WE stages ordered full, gap1, twogaps |
| P7 | H | C | each non-cost TW has an ENS before it and a TW-cost node after it, same engine |
| P9 | H | C | any CAL needs a PCR (no CAL module exists) |
| P10 | H | B | TRF is last; FAR text must not match `agents?\|AI\|LLM\|model\|loop\|tool call` |
| P11 | H | B | PF only at wield or master |
| P12 | S | inf | INV after a PCR and a TW |
| MAX | S | inf | content structures ≤ glance 2, grasp 4, wield 4, master 5; ≤1 each INV/PF/REF/NAR; ≤2 commits |
| CAP | H | — | N inside the material's nRange (skipped without `--material`) |
| INV | H | C | pSteps not uniform; budget < k |
| CLOCK | H | — | static regex scan for clock/RNG calls |
| HOUSE | H | — | static scan: modules and cameras make no canvas draw calls |
| BELIEF | H | — | runtime only: `M.text` throws on digits unless `given`/`sketch`; `M.num` needs an AM.Number |
| LEGIBLE | H | — | runtime only, when `size` is passed: title 18, head 16, text/num/sketch 14, note ≥10 px |

Only S laws accept waivers.

## 4. AM.Number and belief

`AM.Number({q, exact, realised, sd, N, source, unit})` is frozen. `source` is `engine`, `marks`, `sketch` or `given`. It needs `realised` or `exact`.

`formatNumber`:
- Default (`realised`): `fmt(realised)`, plus ` of N` when N is set.
- `exact`: `fmt(exact, decimals)`.
- `expected`: `expected fmt(exact)`, plus ` ± fmt(2·sd)` when sd is set.
- `sketch` appends ` (sketch)`. `fmt` adds comma thousands.

Output passes `guardText` with `fromNumber:true`, so its digits are allowed. Gaps: `expected` still prints a ±, so the rule bans only the phrase "exact ±". `expected` without `exact` is unguarded.

## 5. What AM.compose does

1. Merges defaults with `graph.params`; deep-copies the graph; fills node durations.
2. Runs `checkGraph` with the material. Scans source: CLOCK on modules, pedagogy helpers, cameras and material; HOUSE on pedagogy and cameras.
3. Throws one Error listing all hard failures. Soft laws go to `console.warn`.
4. Sets duration = max(end) + tail. Wraps the material in `guard()` (belief and legibility checks on `text`/`num`).
5. Builds lazily per seed: walks the schedule and wires `B.outs[src][sp]`.
6. Dry-runs for controls and state. Clips captions to their node and throws on any over 90 characters.
7. Returns `Atelier.film(def)`. `draw(t)` runs: camera, mix, `M.begin`, last stage, active overlays, `M.end`.
8. `score` maps events to voices; `meta` gives rows; `api.evidence()` gives PEDAGOGY-MAP §5 rows; `api.laws` holds warnings, waived, schedule.

The def holds id, title, `direction:"Module library · <material>"`, level, duration, 960×540, `renderer:'p2d'`, fps 30, seed, ground, chapters, captions, state, controls, `fonts:[]`, engine, setup, draw, score, meta, evidence, laws. `build_film.py` writes `FILM={id,title}`, the GRAPH literal and `AM.compose(GRAPH,"stitch",FILM)`. Evidence rows always carry `conf:null` and `skipped:null`, and `build_hash` is `AM.VERSION` ("0.1.0").

## 6. Lint CLI and gate

Lint: `node check.mjs G.json [--material ID] [--strict] [--json OUT]`, plus `--export` and `--scan`. Exit 1 on a hard failure. Without `--material` the CAP row prints PASS unevaluated.

Gate (`runtime/gate.py`, Playwright). Both grasp films pass 10/10:
- LOAD live: stitch 1.8 s boot, plate 1.4 s; 0 errors.
- LAYOUT 400px: scrollWidth 400 vs 400 (1280: 1280/1280).
- PURE-REP: 5 t re-seeked identical. PURE-ORD: A→B == B→A at 5 pairs.
- CLOCK: source clean. META: 3 rows vs AgentLoop.exact.
- ENGINE: selfTest 12 cases, worst |z| 2.39.
- CAPTIONS: 26, max 90 chars.
- AUDIO: 108 events → 120.12 s WAV; peak 0.15 (stitch) / 0.14 (plate); 14.9 s / 15.3 s offline.
- LOAD film: 0 errors · p2d 960×540.

No row covers BELIEF, LEGIBLE or HOUSE.

## 7. Build pipeline and missing files

`build_film.py` runs `check.mjs --material` and aborts on failure. It writes the src, then calls `python3 ../runtime/build.py` with kits: core/am.js, core/laws.js, the material's kernel and its `@kernel` extras, the material, pedagogy, camera/cameras.js, compose.js. Fonts come from the material's `fonts:` rows.

The modules zip matches `up3/modules` 1:1. It omits:
1. `runtime/` beside modules: atelier.js (63.7 KB), build.py, gate.py, render.py, README.md, examples/. These are in `c27c86b7-runtime.zip`. check.mjs and build_film.py both need it, and it is absent from `up3/`.
2. `vendor/p5-2.3.4.min.js` under the studio root. Absent.
3. CETI fonts, always embedded, from `skills/p5-explainer/assets/fonts/` (Fraunces, DM Sans, Space Mono). Absent.
4. Python fontTools and brotli (not installed here).
5. Playwright, Chromium, PIL (ffmpeg is present).
6. The artifact variant loads p5 from cdn.jsdelivr.net.

Font defects: build_film.py never passes a style, so the italic Cormorant file registers upright. sediment.js declares three weights that differ from the files: Cormorant 600 (file 500), Plex Sans Condensed 500 (file 600), Plex Mono 500 (file 400).

## 8. Layout and camera algebra

Layout (`AM.layout`):
- `grid`: band counts are tried; unit thickness T ≤ maxAcross; length L = k·along/across·T; the largest fitting T wins.
- `rack`: full-depth units, thickness spread/N, sorted by survival, so the silhouette is the survival curve.
- `survivalOrder`: fail step descending (never-failing = k), ties by id. `macro`: one unit at natural aspect, fill .82.

Camera (`AM.cam`, `camera/cameras.js`): shots are `{x,y,z}` in a 960×540 world, identity `{480,270,1}`. `frame(r,m)` fits a rect. `mix` interpolates zoom in log space. Modules: frameFocus (hold, drift 1.04), pullBack (log dolly to identity), crane (min-jerk between from/to), addressZoom (in 25%, hold 50%, out 25%), rackFocus (Mix 0→1, holds framing).

Bug: `mix` with equal zoom never pans. The weight is `0/(0||1e-9)=0`, so the centre stays at `a`. Test: `mix({0,0,2},{100,0,2},.5)` gives x=0. The grasp pullBack ends at z=1, so it is hit only if the focus frame has zoom 1.

## 9. Demo results

- **Grasp lint:** 0 hard, 0 soft, 1 waived (MAX). Schedule: trace 0, fade 22.0, guess 29.0 (overlay), ens 37.0, truth 49.6, twins 62.6, cost 78.6, caveat 87.6, transfer 99.6. Content ends 118.6 s; compose gives 119.82 s. The gate's 120.12 s WAV is unreconciled.
- **Sizes:** grasp-stitch.html 1,457,165 B (1,423 KiB); artifact 466,413 B. grasp-plate.html 1,484,085 B (1,449 KiB); artifact 493,333 B. Smoke films: html 1.38–1.60 MB; artifact 0.39–0.61 MB.
- **Render (smoke, 5 frames), s/frame and boot:** gear .094/.84; isotype .068/.76; maps .204/1.01; pen .24/.96; plate .126/1.53; sediment .124/1.35; stitch .27/1.97. Build times are not recorded. README's "0.05–0.2 s" understates stitch.
- **Passed:** 10/10 gate rows on both grasp films; smoke.graph lints PASS; wield.graph lints PASS. Neither lint has a saved output.
- **Waived:** MAX (grasp); P12 (wield).
- **Negatives** (all FAIL as expected; all reproduced): type-mismatch gives TYPE; reveal-before-commit gives P1 ×2 (survival.off before guess closes at 30.6 s); twins-without-cost gives P7; degenerate-wield-cued-transfer gives P10, INV ×2 (uniform p; budget 10 ≥ k 10), and a P12 warning. No negative covers P2, P3, P4, P9, P11, CAP, CLOCK, HOUSE, BELIEF or LEGIBLE.

## Other findings

- P1 skips INV commits (`inverse@budget`). This is latent, since no other module reveals `inverse@*`.
- CAP is silent without `--material`. AM.module overwrites silently.

## 10. README "Known weaknesses" (verbatim)

- At N=500 the rack is sub-pixel per run. The rack morph aliases into stripes for about 2 s, and the stitch grid partly reads as a barcode.
- The commit beat is quiet: a ruler and three material ticks.
- At N=48, isotype, maps and gear read as textures. They need Glance-scale N to show their edge.
- Sound uses the runtime's four voices, re-pitched per material (Q-M1, Q-M3 are open).
- The caveat's ρ is a labelled sketch. Cost counts redone steps only.
- Bunraku is not a Material yet (its kernel is WEBGL).
- The runtime readout still says "exact ±" (F3).

## Core ideas that should survive

- Pedagogy modules never draw. One Material draws everything, so each film has one look.
- A typed beat graph is linted before any frame, and hard laws fail the build.
- Every number is a typed AM.Number with a source. Digits in text are banned unless marked given or sketch.
- Common random numbers: one engine feeds twins and ensemble.
- Clock purity, gated by PURE-REP and PURE-ORD.
- One graph, two materials: only the art changes.
- Negative lint cases as regression tests for the laws.
- Stage / overlay / camera layering with `at` expressions.
- Rack ordered by survival as the ruler.

## Experiment-specific choices

- The Grasp claim, its 5-structure graph with the MAX waiver, and the agent-loop parameters (N 500, k 20, p .95).
- The A/B/C grades and the PEDAGOGY-MAP / INTERVIEW citations.
- The seven material kernels, their fonts, grounds and N ranges.
- The MAX budgets, the 90-character caption cap, the 0.3 s caption floor and the 1.2 s tail.
- The TRACE_INVOICES text, the ρ = 0.3 and s* = 9 caveat values, and 960×540 at 30 fps.
