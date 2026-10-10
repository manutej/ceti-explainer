# Architecture audit · 2026-10-10

Question (owner): is the core too bulky; is the bulk p5 or our code; is there dead or spaghetti code; is there a leaner,
more modular architecture with the same quality. Everything below was measured on the working tree on 2026-10-10 at about
09:00 UTC, read-only (no builds, no proofs run, no git). Two new film dirs (a-bell-from-dice, women-and-children) appeared
while the audit was running, so they are not counted. Scripts used: page splitter (exact substring match of each `<script>`
and `@font-face` against its source file), a Playwright font probe (seek every 0.5 s, record the computed face of every
text node, plus `document.fonts` status and canvas `ctx.font`), fontTools subsets, an acorn function walk, and an
import-closure walk over the npm `p5@2.3.4` ESM `dist/` tree (tarball fetched with `--ignore-scripts`, nothing executed).

## 0. Verdict: the three largest findings

1. **p5 is the bulk, and most films don't use it.** The vendored `p5-2.3.4.min.js` is 990,655 B of every page: 78–89 %
   of the bytes, 66–81 % of the gzip. 15 of the 17 shipped films (every kit-v1 film) call **zero** p5 drawing APIs. They
   draw in SVG and raw Canvas2D (`K.ctx`). The kit needs p5 for 8 calls only: `createCanvas, createGraphics,
   pixelDensity, noLoop, loadPixels, noise, noiseSeed, drawingContext`. Without p5, `simpsons.html` drops from 1,109,814 B
   to 119,184 B (gzip 351,190 → 66,929). A modular p5 build would not get close: in p5 2.3.4, `p5/core` alone pulls 64 %
   of the library.
2. **Our own code is lean per function but copied between layers.** No audited function is longer than 68 lines. The
   mess sits between layers. 20 arsenal modules have been copied into film `lib/` folders (363,658 B, 5,292 lines; 19 are
   byte-identical to the source and 1 has a one-line patch), along with 5 copies of `assemble.py`. `mulberry32` is
   defined again in 33 of the 36 pattern lanes and `clamp` in 35 arsenal files. Only 3 lanes use `arsenal/core`. Six page
   builders and four gates exist side by side, although D1 says "one runtime".
3. **Several layers are not dead, but nothing proves them.** Five skills (p5-concept, p5-forge, p5-ship, p5-studio,
   p5-crit) are broken: they call `$STUDIO/scripts/*.py`, and those scripts do not exist in this plugin. Seven Atelier
   chromes, the drafts (≈5.7 MB including 4 built pages), contrib/, eval/, notebooks/, scripts/channels, films/typesafe and
   four root notes are only referenced from documents. Three library kernels that say "vendored verbatim" have drifted
   from their chrome originals.

Recommendation, in order: (b1) make p5 optional per film, (c) a module loader, (d) font subsetting, (e) the archive move.
Do not take (a) a p5 subset or (b2) a home-grown replacement for the p5 lanes (section 4).

## 1. Page composition

Bytes include the `<script>` / `@font-face` wrapper. claims.json is validated by build.py and **not embedded** (0 B).
`simpsons` is a kit-v1 page (no chrome or material modules); the other two are kit2 with `--chrome none`.

| component | simpsons.html (kit v1) | % | simpsons-3d · boardwalk-dark | % | wiring · midnight-ink | % |
|---|---:|---:|---:|---:|---:|---:|
| vendored p5 2.3.4 (min) | 990,655 | 89.26 | 990,655 | 78.03 | 990,655 | 78.31 |
| fonts (faces embedded) | 59,398 (3) | 5.35 | 113,295 (5) | 8.92 | 82,022 (3) | 6.48 |
| kit (kit.js / kit2.js) | 25,048 | 2.26 | 50,528 | 3.98 | 50,528 | 3.99 |
| player.js | 8,302 | 0.75 | 9,251 | 0.73 | 9,251 | 0.73 |
| chrome module | 0 (in kit.js) | – | 0 (none) | – | 0 (none) | – |
| material module (arsenal/materials/drawn/materials.js) | – | – | 18,812 | 1.48 | 18,812 | 1.49 |
| fonts3d (TTF data URL, subset) | – | – | 10,594 | 0.83 | – | – |
| libs (kit2 `libs`) | – | – | 0 (unused) | – | 0 (unused) | – |
| film.js | 13,666 | 1.23 | 55,493 | 4.37 | 95,581 | 7.56 |
|  … arsenal copies inside film.js (assemble.py) | 0 | | 23,280 | 1.83 | 57,031 | 4.51 |
|  … film's own source (lib/film.src.js) | 13,666 | | 32,195 | 2.54 | 38,532 | 3.05 |
| film.json (window.FILM) | 5,920 | 0.53 | 13,123 | 1.03 | 10,353 | 0.82 |
| KIT2 conf (brand pack JSON) | – | – | 619 | 0.05 | 748 | 0.06 |
| shell HTML/CSS + page text | 6,825 | 0.61 | 7,174 | 0.57 | 7,077 | 0.56 |
| **total** | **1,109,814** | | **1,269,544** | | **1,265,027** | |
| gzip -9 total (p5 alone 284,263) | 351,190 | | 431,144 | | 412,391 | |
| brotli q11 total | 296,975 | | 371,061 | | 352,787 | |
| **page without p5** (gzip) | 119,184 (66,929) | | 278,914 (146,900) | | 274,397 (128,222) | |

Our code (kit, player, material, film, JSON and shell) is 5.4 % / 12.2 % / 15.2 % of the three pages; fonts are 5–9 %.
The 1.3 MB page budget (build.py, gate G8) leaves about 310 KB after p5. wiring's variant page is 1,291,871 B, 8 KB under
the budget. The budget explains assemble.py's custom minifier and demo cuts, and the fonts3d subsetting.

**Fonts: embedded vs used** (probe over the full timeline, DOM + canvas):

| page | embedded | loaded / used | unused | subset to observed glyphs + full ASCII (base64 B) |
|---|---|---|---|---|
| simpsons | Big Shoulders 600, Plex Mono 400, 500 | all 3 | – | 58,928 → 27,644 (−31,284) |
| simpsons-3d | Fraunces 300i, Space Mono 400, 700, DM Sans 400, 600 | 4 | **DM Sans 600 (19,008 B)** | 112,548 → 57,304 (−55,244); −64,156 with DM Sans 600 dropped |
| wiring | Newsreader 600, 400, DM Mono 400 | all 3 | – | 81,572 → 41,552 (−40,020) |

The vendored woff2 files are already Latin subsets (229–280 glyphs). Films use 26–90 distinct characters per face.
fontTools is present (doctor checks it; build.py uses it for fonts3d). One quality note from the probe: the text asks for
Fraunces 600 normal, Space Mono 500 and DM Mono 500/700, and none of these is in the lock. The browser synthesises them
from the italic face or the nearest weight.

**p5 API actually called** (distinct `p.*` names; regex over sources, attributed per file):

| caller | distinct p5 calls | what |
|---|---:|---|
| factory/kit/kit.js, kit2.js 2D path | 8 | createCanvas, createGraphics, pixelDensity, noLoop, loadPixels, noise, noiseSeed, drawingContext |
| kit2.js WEBGL path (adds) | 12 | setAttributes, createCamera, setCamera, loadFont, resetMatrix, resetShader, noLights, background, image, imageMode, push, pop |
| factory/chromes/{ledger,memo,tender-set}.js | 3 | createGraphics, noise, noiseSeed |
| arsenal/materials/drawn/materials.js | 1 | drawingContext |
| 15 kit-v1 films (film.js) | **0** | SVG via `K.tx/ln/rc…` and raw Canvas2D via `K.ctx` |
| wiring-and-the-whole | 38 | from its lanes: annotations 33, reveal 28, glyphs-iso 27, camera 7; film.src.js 2 |
| simpsons-3d | 51 | webgl-scene 41, film.src.js 36, morph-type 12, shader 12 |
| arsenal, 25 Canvas2D lanes | avg 11.8, union ≈ 60 | 9 lanes use ≤ 3 calls; splineVertex, bezierPoint, contours, textFont, lerpColor … |
| arsenal, 13 WEBGL lanes | avg 30, union ≈ 60 | createFramebuffer, createFilterShader, buildGeometry, loadFont, lights, cameras … |

**p5 2.x bundle options** (npm p5@2.3.4): `lib/p5.min.js` 990,638 B (sha256 equals vendor's), `lib/p5.esm.min.js`
1,102,035, `lib/p5.js` 4,579,996, `lib/p5.webgpu.min.js` 148,927 (add-on). `package.json` exports modular ESM entries:
`p5/core, shape, color, math, type, image, webgl, dom, events, io, data, utilities, accessibility, webgpu,
friendlyErrors`. The modules are not separable in practice. The import closure of `dist/core/main.js` is 2,134,084 of the
app's 3,314,445 raw bytes (**64 %**), because core imports webgl/p5.Shader, GeometryBuilder, image/filters,
strands/ir_types, dom/p5.Element, io/csv, libtess, omggif and colorjs.io. Core + shape + color + math is 67 %, with type
added 72 %, with webgl + image added 79 %. The atlas (references/atlas/pages/custom-build-server.md, [S295]) says the
`?modules=` custom-build server is an alpha proof of concept, and that maintainers consider tree-shaking "a major effort
outside current scope". Estimate (from the ratio, not built: no bundler is installed): a 2D-only p5 build would be about
660 KB, saving about 330 KB / 95 KB gzip per page.

## 2. Repository layers and dead code

LOC excludes vendor/, node_modules, build pages, shots/frames/stills and references/atlas/pages. "code" means
js/mjs/py/sh lines.

| top level | files | text lines | code | md | KB |
|---|---:|---:|---:|---:|---:|
| factory | 374 | 72,108 | 23,484 | 6,569 | 6,797 |
| arsenal | 302 | 20,499 | 12,754 | 3,760 | 5,116 |
| library | 79 | 14,287 | 7,847 | 3,609 | 1,062 |
| skills | 73 | 11,521 | 4,716 | 4,357 | 767 |
| chromes | 86 | 10,951 | 9,062 | 993 | 744 |
| references | 57 | 10,664 | 32 | 6,237 | 2,405 |
| films | 29 | 4,314 | 3,050 | 245 | 287 |
| docs | 25 | 3,070 | 0 | 3,070 | 326 |
| runtime | 9 | 2,211 | 2,122 | 89 | 136 |
| scripts | 10 | 2,103 | 1,990 | 104 | 127 |
| contrib | 27 | 1,932 | 66 | 1,866 | 102 |
| (root .md) | 8 | 1,025 | 0 | 1,025 | 72 |
| tests / notebooks / eval | 9 / 3 / 2 | 457 / 300 / 80 | 122 / 0 / 50 | | 17 / 18 / 4 |

Classification. LIVE means a proof in tests/proofs.sh (i–vii) or scripts/doctor.sh builds or tests it. REFERENCED-ONLY
means documents or metadata point at it and nothing builds it. DEAD means nothing points at it, or it cannot run in this
repo. Plain grep misses paths that code builds at run time. Example: `library/plan/core/build_plan.py` imports
`skills/p5-explainer/assets/build_film.py` through a path it assembles itself. Every DEAD verdict was therefore also
checked for path fragments in all code.

| entry | class | evidence |
|---|---|---|
| factory/kit (v1) | LIVE | proofs vi builds the 15 films without `look`; doctor builds kit/smoke. player 96 %, shell 94 % and kit.js 67 % of its lines reappear verbatim in kit2 |
| factory/kit2 | LIVE | proofs vi (simpsons-3d, wiring), doctor (goodhart · ceti-dark · none) |
| factory/kit2/materials/basic.js | DEAD path | inlined only when arsenal/materials/drawn/materials.js is missing, and that file exists |
| `factory/kit2/chromes/` lookup in build.py | DEAD path | the directory does not exist; chromes resolve from factory/chromes |
| factory/chromes (ledger, memo, tender-set) | LIVE by tool, untested | kit2's default chrome is tender-set, but both proof-vi kit2 films use `none`; only kit2/proof/matrix.py builds them |
| factory/kit2/proof, smoke-webgl | REFERENCED-ONLY | PROOF.md / HANDOFF; gate.mjs names the smoke format |
| factory/films/*/drafts (simpsons-3d a/b/c, goodhart/ledger) | REFERENCED-ONLY | PIPELINE.md, PROTOTYPE.md; proofs vi walks only factory/films/*/. 49 files ≈ 5.7 MB, 4 built pages 5.0 MB; drafts/c/film.js is byte-identical to the shipped film.js |
| runtime/ | LIVE | proof i (runtime/tools/build.py, gate.py), ii (via build_film.py), iv (tests/node/_load.mjs loads runtime/dist/atelier.js) |
| chromes/escapement | LIVE | proof i |
| chromes/bunraku, run, marbling | REFERENCED-ONLY (decision-protected) | Q11 flagships; HANDOFF §7: bunraku and marbling need fontsource faces to rebuild |
| chromes/delta, ledger, exposure, margin | REFERENCED-ONLY | Q11: "kernels in library/materials … do not ship films", "Delta and Margin stay as references". operad.json `source` strings only (check.mjs never opens them) |
| library/operad, tools, materials, modules, cameras | LIVE | proof ii (grasp · stitch) |
| library/plan | LIVE | proof iii (base-rate), iv (module tests) |
| library/materials/kernels | LIVE, **drifted** | say "vendored verbatim", but run.kit.js (21 lines), delta.kit.js (225) and marbling.kit.js (25) differ from chromes/*; exposure, ledger and margin match |
| skills/ceti-explainer | LIVE | proof iv (SVG episode gate) |
| skills/p5-explainer | assets LIVE, SKILL.md broken | proof iii imports assets/build_film.py; SKILL.md calls 6 `$STUDIO/scripts` (composite, film_render, parity …) that are missing |
| skills/p5-concept, p5-forge, p5-ship, p5-studio | DEAD | 0 references anywhere; call `$STUDIO/scripts/{series,lint,render,ship,gate,seat_packets}.py`, where $STUDIO is "this plugin's root"; none exist here (they live in p5js-explainer-lab). The plugin still lists them as skills |
| skills/p5-crit | DEAD | 1 reference (references/eval-stack.md); same missing scripts plus crit/TRIAGE.md, studio/LEDGER.md |
| skills/ceti-brand | REFERENCED-ONLY, broken | README, contrib/SKILLS.md; 6 dangling paths (milton/*.md, noether-course/…) |
| skills/ceti-research | REFERENCED-ONLY | README, contrib/SKILLS.md; self-contained |
| films/opera-house, grasp, base-rate | LIVE | proofs v, ii, iii |
| films/typesafe | REFERENCED-ONLY | cited as a source (`../../../films/typesafe/STORYBOARD.md`) by 3 library/plan demo.json; no build script; tests do not open it |
| scripts/channels | REFERENCED-ONLY | MERGE-NOTES, requirements.txt, Q8 ("channels gate"); nothing runs it |
| notebooks/ | REFERENCED-ONLY | README, ART-DIRECTION; .gitignore whitelists `notebooks/*.html` |
| eval/, HANDOFF-JEV-EVAL.md | REFERENCED-ONLY | README, RUN.md, contrib/SKILLS.md; frame-items.mjs is run by nothing |
| contrib/ | REFERENCED-ONLY | D4 ("not shipped"), README |
| MERGE-NOTES.md, REQUIREMENTS.md | REFERENCED-ONLY | proofs.sh header comment, HANDOFF, D3 (the 110 KB rule superseded by the tier table and kit2's 1.3 MB / 120 KB) |
| RUN.md | REFERENCED-ONLY | README; documents skills/ceti-explainer (belongs next to it) |
| references/, docs/study | REFERENCED-ONLY (intended) | atelier-* skills read references/atlas; DECISIONS cites docs/study |
| arsenal/materials/shader vs arsenal/patterns/gl-post | both LIVE (proof vii demos) | each is a full-frame `createFilterShader` stack with its own GLSL `hash`/grain; they share no code (only `clamp`). shader: 8-bit stylised looks (neon, halftone, riso, chalk), used by simpsons-3d. gl-post: linear-light HDR (dof, bloom, tone map, grain), not in any shipped film. They are complementary; extract only a shared grain/hash GLSL snippet |

Doc drift: README.md:128 says built pages are not committed; D10 and .gitignore keep them. HANDOFF §7 says "the kit does
not load arsenal modules", but kit2 has `libs`; no film uses it.

**Per-film copies of arsenal modules** (sha256 against the source):

| module (source) | copies | state |
|---|---:|---|
| arsenal/patterns/camera/pattern.js | 3 (wiring, s3d drafts a, b) | identical |
| arsenal/patterns/webgl-scene/pattern.js | 3 (s3d, drafts b, c) | identical |
| arsenal/materials/shader/pattern.js | 3 (s3d, drafts b, c) as shader.js | identical |
| arsenal/patterns/morph-type/pattern.js | 3 (s3d, drafts c; drafts b) | 2 identical; drafts/b adds 1 line (`P.kit = {…}` export) |
| arsenal/structures/structures.js, patterns/reveal | 2 each (wiring, goodhart drafts/ledger) | identical |
| core/timeline, glyphs-iso, annotations, data-marks | 1 each | identical |
| **total** | **20 files, 363,658 B, 5,292 lines** | plus 5 assemble.py (399 lines; strip() byte-identical in all 5) |

## 3. Spaghetti

| file | bytes | lines | functions | > 40 lines (excl. module wrapper) | longest | window writes | window reads |
|---|---:|---:|---:|---:|---|---|---|
| factory/kit2/kit2.js | 50,511 | 752 | 132 | 0 | commitBox 35, mountGL 28, mount 26, render 25 | KIT | FILM, KIT2, KIT2_FONTS3D, FILM_RENDER, ARSENAL, NOCAP (+ global `p5`) |
| factory/kit2/player.js | 9,234 | 133 | 46 | 0 | tick 11, railFor 8 | __film, __ctrl, __error | KIT, FILM_RENDER |
| factory/tools/gate.mjs | 37,986 | 552 | 118 | 0 | seek/capture block 37, texts 24, finish 16 | __gate (in page) | __film, __ctrl, FILM; hard-codes /opt/node-tools Playwright and /opt/pw-browsers Chromium |
| arsenal/patterns/gl-stack-city | 38,693 | 515 | 126 | 3 | buildBoxes 68, hud 43, layouts 40 | ARSENAL | ARSENAL_FONTS |
| arsenal/patterns/gl-camera-rig | 36,295 | 438 | 88 | 1 | overlay 54, endPose 36, rows 28 | ARSENAL | ARSENAL_FONTS |

The functions are small. Coupling runs through about 10 window names: FILM → KIT2 → KIT → FILM_RENDER → __film/__ctrl, and
ARSENAL/ARSENAL_FONTS. Script order is fixed in shell.html. That works, but it is implicit, and nothing checks it except
the gate's G1 load.

Helpers that each file reimplements (definitions counted in arsenal/ JS files):
`clamp` 35 · `mulberry32` 33 of 36 pattern lanes (49 files repo-wide, 2 body variants) · `smooth` 21 · `lerp` 17 · `txt`
(text helper) 14 · `fmt` 12 · `rgb` 9 · `ease`/`seg` 8 each · WCAG `lum`/`contrast` in kit2.js, kit2/build.py (deliberate
Python mirror), brand_check.py, palette, fields, annotations · `worldToScreen` in camera, gl-camera-rig and the simpsons-3d
films. kit2.js itself redefines mulberry32, clamp, lerp, seg, ease, parseCol, contrast and lum. Only 3 of 36 lanes call
`ARSENAL.core` (timeline.js has EASE, clamp and smooth that the lanes could share).

Parallel engines (D1 says "one runtime"): factory/kit, factory/kit2, runtime/ (atelier.js 881 lines),
skills/ceti-explainer/assets (engine.js 361), library/plan/core + skills/p5-explainer/assets, films/opera-house/build.py.
Each has its own gate: factory/tools/gate.mjs, runtime/tools/gate.py, skills/ceti-explainer/assets/gate.mjs,
library/plan/core/gates.js. Five of the six are pinned by proofs i–vi, so merging them is a migration, not a cleanup.

## 4. Options, with evidence

| option | page bytes saved | lines | risk | effort (agent-h) |
|---|---|---|---|---|
| (a) per-film p5 subset (custom ESM build) | est. −330 KB/page (−26 to −30 %), −95 KB gzip, all films | +≈60 (build script + lock) | high | 8–12 |
| (b1) p5 optional: 2D kit on a Canvas2D shim, p5 only for films that call it | **−990,655 B** on every page with no p5 caller: 15 of 17 today (−89 % on simpsons; gzip −81 %) | +≈120 shim, 0 removed | low–medium | 4–6 |
| (b2) own renderer (Canvas2D + WebGL2) replacing p5 for the lanes | −990 KB on all pages | +5–8 k | very high | 40–80 |
| (c) module loader (`uses` by id) | 0 vs today's assembled pages; −54 % of module bytes for any film that would otherwise inline verbatim via `libs` | −5,292 copied + −399 assemble.py; +≈150 | low | 3–5 |
| (d) fonts on demand + glyph subset | −31 to −64 KB/page (−2.5 to −5 %; woff2 barely gzips, so gzip savings are about the same) | +≈40 | low–medium | 2–3 |
| (e) archive/ for DEAD and REFERENCED-ONLY layers | 0 | ≈ 15–20 k lines out of the live tree (moved, not deleted) | low if the plan below is followed | 2–3 |

**(a) Keep p5, ship a subset.** Needed: a pinned bundler (none is installed), the npm source tree pinned by hash next to
vendor/, a build profile per renderer (2d, webgl), a new SHA256SUMS row, and an LGPL note for a *modified* build
(vendor/LICENSES.md: keep p5 in its own replaceable block). It needs a dated DECISIONS row because the law says "vendored
p5 only". The savings are capped: core is already 64 % of p5, and it imports WebGL, strands and filters itself. The
upstream custom-build path is alpha. Not recommended until upstream ships stable module builds.

**(b) Our own renderer core.** (b1) is the part worth doing. Every 2D kit layer (kit.js, kit2.js 2D, the three factory
chromes, materials.js) uses only the 8 calls listed in section 1. Make build.py inline a ≈120-line shim exposing
`K.p = {createGraphics, pixelDensity, noise, noiseSeed, drawingContext …}`, with p5's noise ported exactly: the 4096-entry
table filled by the LCG `1664525·r + 1013904223 mod 2^32`, as in the vendored file. Inline p5 only when film.json has
`renderer: "webgl"`, `uses`/`libs` names a lane that calls p5, or a static scan of film.js finds `K.p.<api>`. What breaks:
the paper-grain pixels, unless the noise port matches (verify with gate re-seek plus a pixel diff against the current
pages); the hashes of the 15 kit-v1 pages in tests/baselines/builds.json and catalogue.py (rebaseline once, per D10);
any film that reaches `K.p` directly (today only wiring, through its lanes, which keeps p5). (b2) breaks everything else:
25 Canvas2D lanes use about 60 p5 calls (splineVertex semantics, bezierPoint, contours, p5.Font, colour parsing), and 13
WEBGL lanes use framebuffers, filter shaders, buildGeometry, TTF parsing (loadFont/textToModel), cameras and lights.
Every lane demo would need a re-shoot and every seat would need re-evaluation. That rebuilds p5. Not recommended.

**(c) Module loader.** kit2 `libs` already inlines paths in order, but nobody uses it because it is missing six things:
(1) ids: film.json `uses: ["core/timeline", "patterns/reveal", …]` resolved through a registry (arsenal/MODULES.json:
id → path, sha256, deps); (2) dependency order; (3) the deterministic `strip()` from assemble.py moved into build.py
(wiring's six modules: 122,021 → 84,704 chars stripped, → 56,234 with demo cuts); (4) demo fences in each pattern.js
(`/* demo:begin */ … /* demo:end */`) instead of per-film CUTS regexes; (5) module sha256s written into the page meta and
gate.json, so a page can still be refactored against the exact code it shipped (D10); (6) G8 reporting module bytes apart
from film-owned code (today G8 counts only film.js, film.json and claims.json, so `libs` bytes are invisible to the
budget). Acceptance: wiring and simpsons-3d rebuild byte-identical through `uses`, then lib/ and assemble.py go away.

**(d) Fonts on demand.** In build.py, subset each embedded face to printable ASCII plus every non-ASCII character in
film.json, film.js and claims.json (woff2; brotli is already in requirements), and pin the fontTools version for
byte-identical builds. Also stop adding the extra working weights (disp 600, mono 500/700, body 600) unless the film
names them. A gate probe WARN for faces that are embedded and never loaded would have caught DM Sans 600.

**Recommendation.** Do (b1) first: it is 4–6 h for −0.99 MB on 15 films with no law change beyond a DECISIONS row
("p5 is inlined only when a film calls it"). Then (c), which ends copying and makes the arsenal a real dependency. Then
(d), then (e). Leave (a) and (b2). Merging kit v1 into kit2 (`look` recorded for the 15 films, rebaseline, retire
factory/kit, which removes the G10 SKIP branch and the dual path in proof vi) is a natural follow-up to (b1), about 3 h.

## 5. Archive plan (option e)

Move with `git mv` (history kept) into `archive/` and add `archive/README.md`: one row per entry with its class, the
evidence above, the date, and how to restore it. Nothing below is opened by proofs i–vii or by doctor.sh.

| move | to | also fix |
|---|---|---|
| skills/p5-concept, p5-forge, p5-ship, p5-studio, p5-crit | archive/skills/ | references/eval-stack.md link; the plugin's skill list shrinks by five (say so in the commit) |
| skills/ceti-brand | archive/skills/ceti-brand | README, contrib/SKILLS.md links |
| chromes/delta, chromes/ledger, chromes/exposure, chromes/margin | archive/chromes/ | operad.json `source` strings and library/materials/*.js header comments (text only); README chrome list. First decide which kernel copy is canonical for delta (the run and marbling drift stays live under Q11) |
| factory/films/simpsons-3d/drafts, factory/films/goodhart/drafts | archive/drafts/<film>/ | links in PROTOTYPE.md, PIPELINE.md, SELECT.md; .gitignore: add `!archive/**/build/*.html` |
| contrib/ | archive/contrib/ | **D4 names contrib/**: add a dated DECISIONS row; README links (COURSE-E0, EXPERIMENT-E0) |
| eval/, HANDOFF-JEV-EVAL.md | archive/eval/ | README, RUN.md, contrib/SKILLS.md |
| notebooks/ | archive/notebooks/ | **.gitignore whitelists `notebooks/*.html`**: add `!archive/notebooks/**/*.html` or the pages turn untracked; README, ART-DIRECTION links |
| MERGE-NOTES.md, REQUIREMENTS.md | archive/notes/ | proofs.sh line 2 comment, HANDOFF, README, DECISIONS (D3) links |
| scripts/channels | archive/scripts/channels | scripts/requirements.txt comment; Q8 mentions a channels gate (note it in the row) |
| films/typesafe | archive/films/typesafe | 3 library/plan demo.json `sources` paths (citations; tests do not open them) |
| RUN.md | skills/ceti-explainer/RUN.md (relocate, not archive) | README link; assets/build.py comment |

Keep in place: factory/kit (LIVE until the kit2 migration), chromes/escapement (proof i), chromes/bunraku, run, marbling
(Q11 flagships), runtime/, library/, skills/p5-explainer (assets used by proof iii; trim its SKILL.md to what exists),
skills/ceti-research, references/, docs/study, factory/kit2/proof. Delete nothing; remove the two dead paths in kit2
(basic.js fallback, `factory/kit2/chromes` lookup) only together with (b1).

Proofs that must pass after the move, in this order: `sh scripts/doctor.sh` (tools, vendor hashes, kit and kit2 smoke,
brand contrast); `sh tests/proofs.sh i` (escapement · runtime gate, baseline escapement-shared.gate.json), `ii` (grasp:
operad check plus build_film through library/ and library/materials/kernels), `iii` (base-rate plan; imports
skills/p5-explainer/assets), `iv` (SVG episode gate, library/plan module tests, tests/node), `v` (opera-house
byte-identical), `vi` (every factory film builds and gates, `catalogue.py --check` hashes), `vii` (22 brand packs, every
arsenal demo shoots clean). Then `grep -rn` for each moved path across *.md, *.json, *.py, *.mjs and *.js outside
archive/: zero hits except archive/README.md. One commit per row of the table (CLAUDE.md: commit per lane).
