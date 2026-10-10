# Merge notes: commit 1, "sources in, builds from the repo"

Branch `feature/explainer-atelier`. This step lays the two explainer systems (the plan-compiled explainer library and the
Explainer Atelier) and the ceti-p5-studio skills into this repo, makes the repo root the plugin root, and fixes only the
path assumptions needed for the four proofs below to run from a clean checkout. The architecture this follows is the
C2 plan (repo layout (c), path fixes 1-6 and 9-12, and the small items of "fix first" (e)). No behaviour of the runtime
(`runtime/dist/atelier.js`, sha256 `cd580e362d4a…`) or of the SVG engine changed.

Run all four with `sh tests/proofs.sh` (Playwright Chromium needed for (i); here `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`,
Playwright 1.56.0 with Chromium build 1194).

## The four proofs (run 2026-10-08, from the repo root)

### (i) Atelier chrome film: `sh chromes/escapement/build.sh shared` + `python3 runtime/tools/gate.py …`

```
"id": "escapement-shared", "html_kb": 1477            (1,512,958 bytes; shipped page 1,512,955)
GATE escapement-shared  (escapement-shared.html)
  LOAD live     PASS  2.0s boot; 0 errors
  LAYOUT 400px  PASS  scrollWidth 400 vs 400 at 400 px (1280: 1280/1280)
  PURE-REP      PASS  5 t re-seeked identical
  PURE-ORD      PASS  A→B == B→A at 5 pairs
  CLOCK         PASS  source clean
  META          PASS  4 checked rows vs AgentLoop.exact
  ENGINE        PASS  selfTest 12 cases, worst |z| 2.39
  CAPTIONS      PASS  7 captions, max 88 chars
  AUDIO         PASS  145 events → 34.30s WAV, peak 0.32, 3.0s offline
  LOAD film     PASS  0 errors · webgl 960×540
  VERDICT       PASS
```
The 3-byte difference from the shipped page is the runtime readout word (`exact` → `expected`), already in `runtime/dist`.
Two builds 2 s apart are now byte-identical (sha256 `c3d36874…`, see `tests/baselines/builds.json`).

### (ii) Module operad: `node library/operad/check.mjs films/grasp/grasp.graph.json --material stitch` + `library/tools/build_film.py`

```
CHECK agent-loop-grasp  (grasp.graph.json · material stitch)
  TYPE SEED P1 P2 P3 P4 P7 P9 P10 P11 P12 CAP INV CLOCK HOUSE  PASS · MAX WAIVED · BELIEF LEGIBLE RUNTIME
  schedule: trace@0.0 · camTrace@0.0 · fade@22.0 · camPull@22.0 · guess@29.0 · ens@37.0 · truth@49.6 · twins@62.6 · cost@78.6 · caveat@87.6 · transfer@99.6  → 118.6 s
  VERDICT  PASS (0 hard, 0 soft, 1 waived)
"id": "grasp-stitch", "html": "films/grasp/build/grasp-stitch.html", "html_kb": 1423      (1,457,284 bytes)
```
The check table is line-for-line the shipped `grasp.check.txt`. Also verified: `check.mjs --scan` → `15 files, 0 finding(s)`;
`check.mjs --export` reproduces `library/operad/operad.json` (19 operations, 7 materials, 18 laws, 13 types); the four
negative graphs in `films/grasp/negative/` still FAIL on P10/INV, P1, P7 and TYPE. Extra (not required): the gate on
`grasp-stitch.html` passes 10/10 (26 captions, max 90 chars; 108 events → 120.12 s WAV; p2d 960×540),
`tests/baselines/grasp-stitch.gate.json`.

### (iii) Plan library: `python3 library/plan/core/build_plan.py films/base-rate/plan.json`

```
  L1 … L13  PASS   (L7: 28 number fns, 13 @example refs equal the record)
  P5    PASS  windows   declared p5 cost ≤ 12 ms/frame in every window
  lint: PASS
✓ films/base-rate/build/base-rate.p5.html  (1457 KB)                       (1,491,673 bytes)
```
Byte-identical to the Phase 0 build in the scratch staging tree. It differs from the uploaded 1,478,773-byte page only by
the newer `feature.template.html` (P0 report).

### (iv) SVG episode gate and System 1 module tests

```
node skills/ceti-explainer/assets/gate.mjs skills/ceti-explainer/reference/self-attention.js
PASS · 38.6s · 8 beats · 214 nodes · 65349 attr-sets
- __AUDIT: softmax→1.0000 · animal=34% · q·k=2.70→1.35
library/plan/modules/*/test.mjs:
PASS demo 1 cpr-cabs · PASS demo 1 contrast-cities · PASS demo 1 ladder-build-loss
PASS demo 1 mass-reseat-cabs · PASS demo 1 recap-retrieve-anchoring · PASS demo 1 trap-cabs
node --test tests/node/*.test.mjs   # pass 4, fail 0
```

Also built from the repo, without being part of the proofs: `chromes/run`, `archive/chromes/exposure` and `archive/chromes/margin` shared
films (their faces are all vendored), `runtime/examples/smoke-2d` (plus `render.py` stills, a contact sheet and a 2 s MP4
with burned captions), and `films/typesafe` both cuts (`typesafe.svg.html` 299,090 bytes, same as shipped;
`typesafe.p5.html` 1,380,132 vs 1,380,100 shipped, the difference being the recovered `studio.js`).

## Path patches (file:line in the repo copy, before → after)

Two shared resolvers were added: `scripts/paths.py` (`ceti_root(start)`) and `scripts/root.mjs` (`cetiRoot(start)`). Both
return `$CETI_ROOT`, else `$CLAUDE_PLUGIN_ROOT`, else the first directory above `start` holding `.claude-plugin/plugin.json`,
else `None`/`null`, in which case every caller keeps its original behaviour.

Code:
- `runtime/tools/build.py:22-43` STUDIO `../..` (fallback `../../ceti-p5-studio`) and `FONT_DIR = STUDIO/skills/p5-explainer/assets/fonts` → `ROOT = ceti_root(HERE)`; if found, `STUDIO = ROOT`, `RUNTIME_JS = ROOT/runtime/dist/atelier.js`, `FONT_DIR = ROOT/vendor/fonts`; else the original lines.
- `runtime/tools/build.py:112` `open(runtime or os.path.join(HERE, "atelier.js"))` → `open(runtime or RUNTIME_JS)`.
- `runtime/tools/build.py:65` `TTFont(io.BytesIO(raw))` → `TTFont(io.BytesIO(raw), recalcTimestamp=False)`: the woff2→woff conversion stamped `head.modified` with the build time, so no two builds were byte-identical. (Determinism, not a path fix.)
- `runtime/tools/gate.py:137` (added) `os.makedirs(dirname(--json))`: `--json` into a missing `out/` crashed after the verdict.
- `runtime/tools/render.py:90-114` (added) `vendor_ttf_dir()`: converts vendored Space Mono 400 and DM Sans 400 to TTF in a temp dir. `:122-129` contact-sheet font `/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf` → vendored Space Mono, DejaVu as fallback. `:222-224` burn-in `FontName=DejaVu Sans` → `fontsdir=<tmp>` + `FontName=DM Sans`, DejaVu as fallback (C2 (c)10).
- `runtime/tools/render.py:191,196-197,201-207` (C2 (e)1): recount frames after the rescue passes; any still missing → error, `"missing": n` in render.json, exit 1 and no ffmpeg mux; `--mp4` with `--stills` now says it is ignored.
- `runtime/README.md:10` `../ART-DIRECTION-v1.md` → `../references/atelier/ART-DIRECTION-v1.md`.
- `library/operad/check.mjs:17` (added) optional import of `../../scripts/root.mjs`. `:20-28` `RT = HERE/../runtime/atelier.js` → `ROOT/runtime/dist/atelier.js`, with a `libPath()` map of the logical names (`core/`, `pedagogy/`, `camera/`, `compose.js`) onto `../operad`, `../modules`, `../cameras`; the old `modules/` layout is detected and kept. `:30-32,38,50` `path.join(HERE, f)` → `libPath(f)`. Logical file names (and so all printed output) are unchanged.
- `library/tools/build_film.py:17-45` `RT = MOD/../runtime`, fonts `MOD/fonts` → `RT = ROOT/runtime/tools`, `FONTS = ROOT/vendor/fonts`, `lib()` map as in check.mjs (`check.mjs` → `operad/check.mjs`); old layout kept. `:61,73,79` `os.path.join(MOD, p)` → `lib(p)`. `:81-83` the material font regex now accepts an optional 4th style field and passes it as `:style` (C2 (e)5 plumbing).
- `library/plan/core/build_plan.py:23-36` `ASSETS = LIB/../assets` → if no `build_film.py` there, `ceti_root()/skills/p5-explainer/assets`. `:36` import adds `CE_PRESETS, STUDIO_JS`. `:188` `CE/presets/ceti.css` → `CE_PRESETS/ceti.css`. `:192` `PLUGIN/runtime/studio.js` → `STUDIO_JS`.
- `skills/p5-explainer/assets/build_film.py:19-37` (added) `PLUGIN = ceti_root(HERE) or PLUGIN`; `CE = HERE/ce`, else `skills/ceti-explainer/assets` with `CE_PRESETS = skills/ceti-explainer/presets` (C2 (c)6: `assets/ce/` was byte-identical and is not copied); `FONT_DIR = HERE/fonts`, else `vendor/fonts`; `STUDIO_JS = PLUGIN/runtime/studio.js`, else `runtime/src/studio/studio.js`. `:64` `HERE/fonts/<fn>` → `FONT_DIR/<fn>`. `:91` `CE/presets/…` → `CE_PRESETS/…`. `:111` `PLUGIN/runtime/studio.js` → `STUDIO_JS`.
- `skills/p5-explainer/assets/build_feature.py:15,21,27` same three substitutions (`CE_PRESETS`, `STUDIO_JS`).
- `skills/ceti-explainer/assets/build.py:44-45` `out = a.output or f"{a.title}.html"` (current directory) → next to the episode module, as RUN.md:14 says (C2 (c)11).
- `scripts/channels/channels.py:35-37` (added) in the merged layout `LIB = library/plan`, `SCRIPTS = scripts/`. `scripts/channels/compose.py:22-23` (added) `ASSETS` → `skills/p5-explainer/assets`. `scripts/channels/timeline.mjs:14` `../core/lint_plan.mjs` → `../../library/plan/core/lint_plan.mjs`. (`timeline.mjs` runs; `channels.py` needs `film_render.py`, see open issues.)
- Chrome scripts: `chromes/{escapement/build.sh:5, bunraku/make.sh:4, ledger/make.sh:4, marbling/make.sh:4, run/make.sh:4}` and `chromes/{delta,exposure}/make.sh:5` `RT=$HERE/../../runtime` → `ROOT=${CETI_ROOT:-$HERE/../..}; RT=$ROOT/runtime/tools`. `escapement/build.sh:5` `F=$HERE/fonts` → `F=$ROOT/vendor/fonts`. `run/make.sh:5` and `exposure/make.sh:6-7,10-14` (added) fall back to `vendor/fonts` when `_npm/` is absent. `margin/tools/make.py:6`, `margin/tools/final.sh:4`, `bunraku/tools/finish_mp4.py:7` → `runtime/tools` (honouring `CETI_ROOT`).
- `films/grasp/make.sh:2-3,5` (was `modules/demo/make.sh`) `M=$D/..; RT=$M/../runtime` → `ROOT=${CETI_ROOT:-$D/../..}; M=$ROOT/library; RT=$ROOT/runtime/tools`.

Other small fixes from C2 (e):
- (e)3 `library/operad/am.js:87-88` `AM.cam.mix`: `wz = (1/a.z - 1/z) / ((1/a.z - 1/b.z) || 1e-9)` → if `|1/a.z - 1/b.z| < 1e-9` then `wz = u` (an equal-zoom pan never moved). Test: `tests/node/am-cam-mix.test.mjs`. This changes `grasp-stitch.html` by the patched source text (+116 bytes) and moves any equal-zoom pan.
- (e)5 `library/materials/sediment.js:24-26`: Cormorant row `500-italic` file declared `600` → `500, 'italic'`; Plex Mono `400` file declared `500` → `400`. Both are render-neutral (each is the only face of its family). The Plex Sans Condensed `600` file is still declared `500`, because the kit asks for 500 and the 500 file is not in the sources; a comment marks it.
- (e)6 not edited in `runtime/dist/atelier.js` (kept byte-identical, as C2's M1 acceptance requires). The bound is pinned instead by `tests/node/tokens-light-hue.test.mjs`: every light token is within 20° of its dark hue (peach moves 17.7°, the largest) and light copper vs peach stay 35.9° apart. Correct the `:151` comment ("Meaning is invariant; L/C may be retuned", "keeping hue") when the runtime is split into `runtime/src` (M1).
- (e)10 `runtime/examples/smoke-2d.film.js:74` `· exact 717 ± 21` → `· expected …`; `smoke-webgl.film.js:90-91` `· exact` → `· expected`. The G, H and B chrome sources no longer contain "exact N ±" (only the uploaded built pages did).

Docs (path references only, C2 (c)9):
- `skills/p5-*/**/*.md`: `../../references/` → `${CLAUDE_PLUGIN_ROOT}/references/`; `../../runtime/studio.js` and `$P5|$STUDIO/runtime/studio.js` → `…/runtime/src/studio/studio.js`; `../../atelier/runtime` → `${CLAUDE_PLUGIN_ROOT}/runtime`; `../../atelier/modules` → `…/library` (README/OPERAD → `library/operad/`); `../../atelier/chromes` → `…/chromes`; `../../atelier/{research,crit,BUILDER.md,ART-DIRECTION-v1.md}` → `…/references/{research,atelier/crit,atelier/…}`; `../../scripts/`, `../../templates/` → `${CLAUDE_PLUGIN_ROOT}/…`. `short-tier.md:5` `$CE=/root/.claude/skills/synced/*/ceti-explainer`, `$P5=/home/claude/p5studio/ceti-p5-studio` → `$CE=${CLAUDE_PLUGIN_ROOT}/skills/ceti-explainer`, `$P5=${CLAUDE_PLUGIN_ROOT}`. `p5-explainer/SKILL.md` Atelier command block rewritten to `runtime/tools`, `library/operad/check.mjs`, `library/tools/build_film.py`, `films/grasp/`; `references/atelier.md` §5 steps likewise.
- `films/typesafe/CONTRACT.md:5,72-75` `../../assets/` → `../../skills/p5-explainer/assets/`; `../../../../scripts/` → `../../scripts/`.
- Moves to `contrib/` (with `git mv`; since 2026-10-10 in `archive/contrib/`, D12): `skills/noether-harness`, `skills/sheaf-*` (6), `skills/operadic-interview`, `EXPERIMENT-E0.md`, `skills/ceti-explainer/COURSE-E0.md`, `SKILLS.md`. Pointers updated in `README.md`, `RUN.md:38`, `HANDOFF.md:6,17`, `HANDOFF-JEV-EVAL.md:60-61,450`, `skills/ceti-explainer/SKILL.md:24,157,174`.

## What is where (provenance)

| Repo path | Source |
|---|---|
| `vendor/p5-2.3.4.min.js` | recovered from the `<script data-atelier="p5">` block of the built films; 990,638 B, sha256 `bb8b82b9…ce559` |
| `vendor/fonts/` (34 font files) | 7 CETI woff2 (`p5-explainer/assets/fonts`), 19 woff2 (`modules/fonts`), 8 Escapement woff (`chromes/escapement/fonts`) |
| `runtime/dist/atelier.js`, `runtime/tools/`, `runtime/README.md`, `runtime/examples/*.film.js` | Atelier `runtime/` (renders and `examples/out` not copied) |
| `runtime/src/studio/studio.js` | recovered from `base-rate.p5.html` lines 660-1113 (ceti-p5-studio runtime 0.2.0) |
| `skills/p5-explainer/assets/scene-kit.js` | recovered from `base-rate.p5.html` lines 1515-1829 |
| `library/operad,modules,materials,cameras,tools` | Atelier `modules/` (`core/` + `compose.js` + `check.mjs` → `operad/`; `pedagogy/` → `modules/`; `camera/` → `cameras/`) |
| `library/plan/` | explainer library `core/`, `modules/` (6, without `build/`), the five method docs, `README.md`, `research/` |
| `scripts/channels/` | explainer library `channels/` |
| `chromes/<id>/` | Atelier `chromes/` without `build/`, `_npm/`, jpg, mp4, logs; `out/` keeps the shipped `*.json` only |
| `films/base-rate/` | `plan.json`, `copy.json` |
| `films/typesafe/` | `p5-explainer/films/typesafe/` without `build/` (moved out of the skill, so it is not duplicated) |
| `films/grasp/` | Atelier `modules/demo/` graphs, `negative/` and `make.sh` |
| `references/` | studio references; `atelier/` BRIEF, BUILDER, ART-DIRECTION v0/v1 and `crit/`; `research/` PEDAGOGY-MAP, PED-L1..L4 and `notes/01-06` |
| `skills/p5-{studio,concept,forge,crit,ship,explainer}` | ceti-p5-studio skills; p5-explainer without `assets/ce/`, `assets/fonts/` (now `vendor/fonts`) and `films/` |
| `tests/baselines/` | JSON produced by this merge: escapement-shared and grasp-stitch gate, grasp check, base-rate lint, build sizes and sha256 |

## Open issues (not fixed in this commit)

1. **Five chromes cannot rebuild yet**: bunraku, delta, ledger and marbling read fonts from `_npm/node_modules/@fontsource`, which is not committed (only `package.json` existed in the sources; `npm install` in each `_npm/` restores them). Their faces are not all vendored. Missing: Bodoni Moda 800, Instrument Sans 400/600, Gloock 400 (bunraku); Cormorant Garamond 600 italic, IBM Plex Sans Condensed 500 (delta); Newsreader 500 and 400 italic, IBM Plex Sans Condensed 500 (ledger); IM Fell English 400 italic, DM Mono 500 (marbling). The other faces these scripts name are in `vendor/fonts` (marbling names `.woff` files where the vendored copies are `.woff2`). C2 path fix 3 (`cetix vendor fonts`) is the next step. Escapement, run, exposure and margin build from `vendor/fonts`.
2. **Studio scripts absent from the sources**: `scripts/film_render.py`, `composite.py`, `parity.py`, `feature_gate.py`, `gate.py` (sweep/inv/zone), `lint.py`, `ship.py`, `series.py`, `seat_packets.py`, `render.py` (sketch line), `templates/sketch.html`, `templates/calibration`, and `references/atelier/REVISE.md`. The skills now point at `${CLAUDE_PLUGIN_ROOT}/scripts/…` for them, but the files do not exist, so `scripts/channels/channels.py` (which shells out to `film_render.py`) cannot render. C2 (e)8.
3. **Google Fonts `@import` in `skills/ceti-explainer/assets/ceti-tokens.css:24` is kept.** C2 (c)11 asks to drop it, but the SVG episode build does not embed fonts, so dropping it would change every episode to system fonts online. The film builders already strip it. Drop it once the episode build embeds the CETI faces from `vendor/fonts` (that pushes an episode past the 110 KB cap, so it waits for the per-tier size decision).
4. **`runtime/dist/atelier.js` is unchanged** (tautological META rows (e)2, clock-guard gaps (e)7, the `:151` hue comment (e)6). These wait for the runtime split (M1/M2) so the golden hash holds until then.
5. **Shipped `out/*.gate.json` in the chromes are the originals**; the fresh results are in `tests/baselines/`. Gate JSON for exposure and ledger is named `out/gate-{shared,native}.json`, unlike the other six.
6. **REQUIREMENTS.md not touched** (110 KB cap, cream palette): the Atelier pages are 1.35-1.51 MB. Decision pending (C2 (b) per-tier size table).
7. `library/operad/README.md`, `OPERAD.md` and `INTERVIEW.md` still describe the old `modules/` layout in places (`modules/check.mjs`, `demo/`); `library/plan/README.md`, `BUILD-SPEC.md` and `scripts/channels/README.md` still say `library/channels`, `core/` and `../core/layout.js`. Only the skill files were rewritten here.
8. `cetix` (one toolchain), `runtime/src` split, renderer seam, CI workflow and the films repo are later commits.
