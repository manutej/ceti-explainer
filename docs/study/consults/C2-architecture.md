# C2 · Architecture for the master plugin and the merge into `feature/explainer-atelier`

Inputs: CONTEXT, R1, R2, R3, R5, R6, R8, R9, R11, R12, R13, R15, R16, R17, plus direct reads of the runtime, modules, skills assets, System 1 core, chrome build scripts and the repo (65 tracked files, clean). R7 and R10 do not exist yet. Line numbers are scratch-copy file lines.

Verified facts:
- All 20 built films embed the identical p5 (sha256 `bb8b82b97fcbcd5bb2d5475d1b6a3904f3ab4ed01b821134fd8f1e7710fce559`, 990,638 bytes) and the identical runtime. One core already exists in practice.
- `atelier.js` (63,706 B) touches p5 in only three places (L485 guard, L509 `ctx.layer`, L835-850 canvas mount), so a renderer seam is cheap. Sizes: U 15 KB, AgentLoop 5.5, Score 5.3, player 9.8, `film()` 26.
- `studio.js` v0.2.0 exists only inlined in `base-rate.p5.html` lines 662-1113.
- 4 of 8 material kernels forked from their chrome kits (run, delta, marbling, escapement; e.g. delta 19,362 vs 25,795 B). Exposure, ledger, margin are identical.
- `typesafe.svg.html` is already 299 KB, so REQUIREMENTS L30's "110 KB hard max" is dead for any page with embedded fonts.
- `p5-explainer/assets/ce/` is byte-identical to the repo's `engine.js` and `gate.mjs` (sha256), so it is pure duplication.

---

## (a) ONE runtime: the Atelier core hosts both tiers

**Decision.** Atelier is the single core. The SVG tier does not remain a sibling. It becomes a renderer (`renderer:'svg'`) on the same clock, player, score, commit holds and `window.__atelier` hooks. The episode and feature source modules do not change: adapters wrap them. A sibling tier would leave two clocks, two players, two gates and two sets of hooks (`__atelier` vs `__ctrl`/`__film`), which is exactly the drift R15 lists.

| Option | Verdict |
|---|---|
| Atelier core + renderer seam (chosen) | One gate, one hook surface, exact seek and commit holds for episodes, no source rewrite. Cost: the player UI of the SVG shell is replaced. |
| Sibling SVG tier behind a shared contract only | Cheaper, but keeps two players and two gates. A TypeScript/bundler rewrite would break "one file, no build". |

**Core split (M1, no behaviour change).** `runtime/src/`: `clock.js` (U, stateAt, hash, ease, colour), `engine.js` (AgentLoop), `score.js`, `tokens.js`, `player.js`, `film.js` (queue, ctx, hooks), `renderers/{p5,svg,svg-layers}.js` (svg-layers is the P5Film bridge ported to `U` instead of `Studio`), `adapters/{episode,feature}.js`. `cetix build-runtime` concatenates to `runtime/dist/atelier.js` (committed, with a sha256 file). `--features` drops `engine`, `score` or `p5` when unused. Acceptance: `dist/atelier.js` is byte-identical to today's file (sha256 prefix `cd580e362d4a`) until M2; five frame hashes per film match pre-split goldens for all 20.

**Film-def contract v2** (a superset of v0.1, so the 20 films run unchanged):

| Group | Fields |
|---|---|
| Identity | `id`, `title`, `direction`, `level` (glance, grasp, wield, master), `tier` (episode, feature, atelier), `profile` (selects the gate set) |
| Stage | `renderer` (`svg`, `p2d`, `webgl`), `size`, `fps` (30), `duration`, `seed`, `ground`, `theme` (`ceti`, `owala`, `glaser-paper`, or a token set) |
| Timeline | `chapters[{t,label}]`, `captions[{t0,t1,text}]` (at most 90 characters), `episode:{tag,synthesis}` for the static profile |
| Interaction | `state`, `controls[]` (`commit` with `jump`/`countdown`, `toggle`, `range`, `select`, `number`); `math` toggle replaces `setMath` |
| Numbers | `engine(ctx)`, `meta(ctx)` rows `{label, value, source:'engine'|'marks'|'given'|'sketch', check:{kind:'count'|'prob'|'identity', oracle}}`, `audit(ctx)` (was `__AUDIT`) |
| Layout | `layout(ctx)` returns regions and boxes (was `__REGIONS`/`__LAYOUT`) |
| Lifecycle | `kits[]`, `fonts[{family,file,weight,style}]`, `build(host,ctx)` once (alias `setup(p,ctx)`), `draw(host,t,ctx)` (alias `render(t,ctx)` for svg), `layers[]` (p5 layers over or under SVG, the existing `P5Film.layer` shape) |
| Sound | `score(ctx)` events `{t,kind,gain,freq,dur,pan}` |
| Gate | `gate:{waivers:[{law,reason}], caps:{code_kb,total_kb,s_per_frame}}` |

`host` is the p5 instance (`p2d`, `webgl`) or the `<svg>` root.

**ctx API.** Keep everything in R1 §2: `id, def, mode, duration, fps, seed, state, size{w,h,rw,rh,k}, tokens, U, fonts, engine, commit, commits[key]{value, committed, auto, jump, hold, countdown(t)}, layer(name,opt), caption(t), chapter(t)`. Add:
- `ctx.host`, `ctx.film` (boolean), `ctx.rm` (reduced motion).
- `ctx.ex`, the episode toolkit (`ease.glaser`, `win`, `ramp`, `seg`, `pulse`, `fit`, `fmt`) as thin wrappers over `U`.
- `ctx.N(q, {exact, realised, sd, N, source, unit})`, which is `AM.Number` promoted into the core so every tier gets the Belief law.
- `ctx.stream(name)`, a counter-hash stream replacing `Studio.stream`.
- `ctx.pure(fn)`, the guard wrapper from bug 7.

Hooks (`window.__atelier` v2): keep all of R1 §7; add `hash(t)` (in-page frame hash, for cross-process determinism), `layout()`, `audit()`, `fonts()`, `snapshot(t)` (visible text for `eval/frame-items.mjs`) and `version`. `__ctrl` and `__film` stay as deprecated shims until `channels` and the frame workers move.

**Migration paths.**

| Asset | Path |
|---|---|
| 4 SVG episodes (self-attention, oauth, tcp, binary-search) | Zero source edits. `Atelier.episode(EXPLAINER)` maps `meta` to id, title and tag, `beats` to chapters and captions, `build`/`render` pass through, `setMath` becomes the `math` toggle, `__AUDIT`/`__REGIONS`/`__LAYOUT` map to `audit`/`layout`. Profile `episode-8` keeps the gate.mjs static rules (8 beats, 33-46 s, tag at most 38). Accept when `snapshot.mjs` output matches pre-migration at 40 times and code bytes stay at most 110 KB. Fix `_episode-template.js` lines 41, 97, 109-112, 121 first. |
| Longform `feature-cut-v2` | `Atelier.feature(FEATURE)` adapter; profile `feature-7`. |
| base-rate plan film | `Film.compile(PLAN)` still emits `FEATURE`; it runs through the feature adapter. `lint_plan` runs first. Plan layers go in `layers[]`. |
| typesafe | `film.json` v1 auto-converted by `cetix migrate`. Its 7 layers keep the `P5Film.layer(id,{z,setup,draw})` shape. Fix drift: STORYBOARD has 18 caption lines, `data.js` 20. |
| 16 Atelier films + 2 grasp films | Defs untouched. Kit lists and fonts move from `make.sh`/`build.sh`/`tools/make.py` into each `film.json`. Grasp films come from `grasp.graph.json` via `compose.js`. Goldens recorded before M1. |

Order: M0 vendoring and goldens; M1 split; M2 hardening (bugs 2, 7); M3 episode adapter; M4 feature adapter and plan; M5 delete the `ce/` copies and old shell.

**Size risk.** An episode drops `engine.js` and the shell (684 lines) and gains the trimmed core (about 30 KB raw). I estimate +10 KB over today's 77 KB (not measured). If it passes 110 KB of code bytes, the `episode-8` cap becomes 128 KB by written decision.

---

## (b) ONE toolchain: `cetix`

**Decision.** One Python package `scripts/cetix/` with one entry `scripts/cetix` (also a `bin/` shim for `${CLAUDE_PLUGIN_ROOT}`). Node tools stay Node (`lint_plan.mjs`, `check.mjs`, `gate.mjs`, `snapshot.mjs`, `timeline.mjs`) and are invoked as subprocesses. Playwright is the only browser driver.

| Command | Replaces |
|---|---|
| `cetix doctor`, `cetix vendor verify|fetch|fonts` | new; extends `UPSTREAM.sha256` |
| `cetix lint <plan.json|graph.json>` | `lint_plan.mjs` (L1-L13 + p5 budget) and `check.mjs` (18 laws), schema-detected |
| `cetix build <film.json>` | ce `build.py`, `build_feature.py`, `build_film.py` (x2), `build_plan.py`, runtime `build.py`, every `make.sh`/`build.sh`/`tools/make.py` |
| `cetix gate <html|film.json> [--profile]` | `gate.mjs`, runtime `gate.py`, studio `gate.py`, `feature_gate.py` |
| `cetix render <html> --stills|--sheet|--mp4` | runtime `render.py`, `film_render.py` |
| `cetix channels <film>` | `channels.py`, `compose.py`, `scenes.py`, `qa.py` |
| `cetix new chrome|material|film|plan`, `calibrate`, `publish` | new: generator (d), gate on good/bad fixtures, push to films repo |

**One manifest `film.json`, schema `cetix-film/2`:**
```
id, title, tier, profile, level, renderer, size, fps, seed, theme, chrome,
source: { kind: episode|feature|atelier-def|graph|plan, entry, kits[], data[], layers[], graph, material },
fonts: [{ family, file, weight, style }],        # file is a key into vendor/fonts.lock.json
p5: { mode: inline|cdn|none },
outputs: { html, artifact, channels[] },
gate: { waivers[{law,reason}], caps{code_kb,total_kb,s_per_frame} },
render: { stills[], mp4{} },
sources: [ ... ]                                  # provenance for numbers
```
`cetix migrate` converts typesafe's v1 `film.json` and the Atelier `make.sh` kit lists.

**One gate, one report (`cetix-gate/1`: rows `{id,status:PASS|FAIL|WARN|SKIP,detail,law?}`).** Profiles select rows.
- Static: `LAWS` (check.mjs), `PLAN` (lint_plan), `EPISODE-STATIC` (gate.mjs rules: 8 beats, 33-46 s, tag at most 38, caption at most 118).
- Browser: `LOAD`, `LAYOUT-400`, `PURE-REP`, `PURE-ORD`, `PURE-XPROC` (new: `hash(t)` against `tests/baselines/<id>.frames.json`), `CLOCK` (source scan including kits, plus runtime violations), `META` (independent oracle, bug 2), `META-COVERAGE` (at least one checked row), `ENGINE`, `CAPTIONS`, `AUDIO`, `REGIONS`/`OVERLAP` (from `layout()`), `FONTS` (declared weight and style equal the file's), `SIZE`, `ARTIFACT`.

**Pins and requirements.**
- `vendor/p5-2.3.4.min.js`, 990,638 B, sha256 `bb8b82b97fcbcd5bb2d5475d1b6a3904f3ab4ed01b821134fd8f1e7710fce559` (measured from the embedded copy, identical in 20 of 20 films). `cetix vendor fetch` downloads `p5@2.3.4/lib/p5.min.js` from jsDelivr and must reproduce this hash, otherwise it stops and I investigate (a trailing-newline difference is the likely cause). It also writes the sha384 SRI value. `cetix vendor verify` runs inside `build` and `doctor`.
- Fonts: commit **WOFF** files (p5 2.3.4 rejects woff2; one embedded copy serves CSS and `p5.Font`) in `vendor/fonts/` with `fonts.lock.json` (family, weight, style, sha256, `usWeightClass` read from the file) and an OFL file per family. `cetix vendor fonts` converts from woff2 with fontTools and brotli, so normal builds need neither. The CETI set (Fraunces italic 300/400, DM Sans 400/500/600, Space Mono 400/700) is always embedded; chrome fonts per film. Never `@import` Google Fonts.
- `requirements.txt`: `playwright>=1.45,<2` plus `playwright install chromium`; `fonttools>=4.50`; `brotli>=1.1`; `Pillow>=10`; Node 18 or later; `ffmpeg` on PATH; optional `vpype` for plotter export. Chromium flags live in one constant.
- **Inline vs CDN.** `<id>.html` is authoritative: everything inline, `<meta charset>`, p5 sha-verified, used by gate and render. `<id>.artifact.html` is a fragment: starts with `<title>`, p5 from `cdn.jsdelivr.net/npm/p5@2.3.4` with `integrity` and `crossorigin`, everything else inline, and all inline JS ASCII-escaped (`\uXXXX`) so it does not depend on a charset meta (R11 §2, tell 1). The `ARTIFACT` row runs the fragment with the CDN URL routed to the vendored file.
- **Page-size policy (by tier, enforced by `SIZE`).**

| Tier | Code bytes (no fonts, no vendor) | Total offline | Artifact fragment |
|---|---|---|---|
| episode (svg) | at most 110 KB | at most 320 KB | at most 320 KB |
| feature (svg, with or without layers) | at most 260 KB | at most 520 KB (SVG only) | same |
| atelier (p5) | at most 330 KB | at most 1.7 MB | at most 700 KB |

REQUIREMENTS L30 is rewritten to this table; observed Atelier pages are 1.38-1.60 MB.

Build reads `id` and `title` from `film.json`, not regexes (apostrophe truncation in `build.py`).

---

## (c) Repo layout for `feature/explainer-atelier`

The repo root is the plugin root, as `build_film.py:18` (`HERE/../../..`) and `build.py:27` already assume.

```
.claude-plugin/plugin.json     manifest (name, version, description; skills discovered in skills/)
skills/                        the plugin skills (see (d)); ceti-explainer stays here unchanged in name
runtime/src, runtime/dist      core source modules and the committed built atelier.js + atelier.sha256
runtime/tools/                 gate.mjs, snapshot.mjs, audit-overlaps.js (moved from skills/ceti-explainer/assets/ after M5)
library/
  operad/                      am.js, laws.js, compose.js, check.mjs, operad.json (module operad, 18 laws)
  modules/                     pedagogy modules: the 14 AM beats + System 1 modules, ONE registry
  plan/                        System 1 core: module.js, compile.js, lint_plan.mjs, po/, roles.js, layout.js
  materials/                   7 adapters (stitch, plate, pen, isotype, maps, sediment, gear)
  cameras/                     cameras.js
chromes/<id>/                  8 directions: NOTES.md, README.md, <id>.kit.js, shared.film.js, native.film.js, film.json x2, gate.config.json
films/                         non-chrome source films: svg/{self-attention,oauth,tcp,binary-search}, base-rate/, typesafe/, grasp/ (graph JSON)
scripts/                       cetix package, cetix entry, channels/ (reel, carousel, pdf, video, blog, newsletter), requirements.txt
references/                    doctrine, tells, anti-patterns, technique-atlas, operad, eval-stack, p5/*, tokens/, method/ (METHOD, CHANNELS), atelier/ (ART-DIRECTION-v1, BUILDER, BRIEF, INTERVIEW), research/
templates/                     sketch.html, chrome/, material/, film/, plan/, calibration/
vendor/                        p5-2.3.4.min.js, SHA256SUMS, fonts/*.woff, fonts.lock.json, licenses/
tests/                         node/, py/, calibration/ (good and bad fixtures), baselines/ (frame hashes, gate json), fixtures/
eval/                          existing (frame-items.mjs, README)
notebooks/                     existing hand-authored lookbooks (tracked)
docs/                          README, RUN, REQUIREMENTS (rewritten), HANDOFF-JEV-EVAL, CHANGELOG
contrib/                       noether-harness, sheaf-*, operadic-interview, EXPERIMENT-E0, COURSE-E0 (moved out of skills/, not shipped)
.github/workflows/ci.yml
```

**Excluded from git:** `**/build/`, `**/out/`, `**/_npm/`, `node_modules/`, `__pycache__/`, `*.mp4`, `*.wav`, `*.srt`, `*.artifact.html`, built `<id>.html`, `scratch/`, `renders/`, `.cetix-cache/`, `.DS_Store`, `__MACOSX/`. Allow-list: `!notebooks/*.html`, `!tests/fixtures/**`, `!runtime/dist/atelier.js`. Each chrome holds 3.3-4.2 MB of `build/`; none of it enters git.

**Separate films repo `ceti-explainer-films` (Git LFS).** Tracks html, mp4, wav, png, jpg, pdf, gif: the 20 built pages (about 1.4 MB each), stills and contact sheets, MP4s with audio, and the six base-rate channel outputs. The main repo keeps `films.lock.json` (film id, tier, sha256 of the built page, LFS path, gate-report hash) and the small baselines (`tests/baselines/*.json`). `cetix publish` writes both. Binaries stay out of history; gate JSON diffs stay reviewable.

**Ordered path fixes** (each depends on the one before):
1. Add `paths.py` and `tools/root.mjs`: walk up to `.claude-plugin/plugin.json`; `CETI_ROOT`/`CLAUDE_PLUGIN_ROOT` override. Everything below uses it.
2. Vendor p5 at `vendor/` (R11 §1-2): replaces `build.py:26-32` STUDIO and fallback `../../ceti-p5-studio`, `build_film.py:18,76,79`, `build_feature.py:24`, `build_plan.py:179`.
3. Fonts to `vendor/fonts/`: replaces `build.py` `FONT_DIR`, `build_film.py:46` `HERE/fonts`, `modules/fonts/`, the `_npm/@fontsource` paths in six chrome `make.sh` files, and escapement's local `fonts/` (R11 §3).
4. Runtime to `runtime/dist/atelier.js`: replaces `check.mjs:19`, `modules/tools/build_film.py:17`, `demo/make.sh` (`$M/../runtime`), every chrome `HERE/../../runtime`.
5. Recover `studio.js` from `base-rate.p5.html:662-1113` into `runtime/src/studio/` (sketch line only); it unblocks `build_film.py:93` and `build_feature.py:27`. The bridge moves to `U` and stops needing it.
6. Delete `skills/p5-explainer/assets/ce/`; build from `skills/ceti-explainer/assets/` (byte-identical today).
7. `build_plan.py:21-25` (`ASSETS = LIB/../assets`, `from build_film import …`) and `CORE_FILES` (L28-29): replace with `cetix.build`; keep `lint_plan.mjs:17` requires co-located in `library/plan/`.
8. `channels.py:32-36` imports and the `timeline.mjs` call at L76: move into `scripts/cetix/channels/`.
9. Skills: replace `$CE`/`$P5` absolute paths in `short-tier.md` and every `../../references|runtime|scripts|atelier` with `${CLAUDE_PLUGIN_ROOT}/…` (R15 §6); point the README's `../ART-DIRECTION-v1.md` at `references/atelier/`.
10. `render.py:98` and `:184` (DejaVu): use bundled Space Mono and DM Sans via `fontsdir`.
11. `skills/ceti-explainer/assets/build.py:44` writes to the CWD although RUN.md:14 says next to the module; drop the Google `@import` at `ceti-tokens.css:24`.
12. Add `requirements.txt`; regenerate `examples/out`; delete the colliding `gate.py`/`render.py`/`build_film.py` once `cetix` matches the goldens.
13. Clean dangling references: `LONGFORM.md:5`, `HANDOFF.md:29`, `E/HANDOFF.md:28,79`, `ceti-brand` (`milton/`, `noether-course/`).
14. Palette (REQUIREMENTS L26/L30): CETI-dark `#0E1014` with role tokens is the default; cream/vermilion becomes the `glaser-paper` preset.

**CI (`ci.yml`).**
- `static` (Node 20, no browser): the six module tests and `test_module.mjs`; `lint_plan.mjs` on base-rate; `check.mjs` on grasp, wield and smoke graphs (PASS) and the four negatives (must FAIL on TYPE, P1, P7, P10/INV); `--export` diffed against `operad.json`; `--scan` = 0; `gate.mjs` on the four episodes; `cetix vendor verify`; rebuild `runtime/dist` and diff its sha256.
- `gate-smoke` (Playwright, cached Chromium): build and gate `smoke-2d` and one migrated episode; `PURE-XPROC` against baselines; `cetix calibrate`.
- Nightly `gate-all`: all films, frame hashes against baselines, artifacts to the films repo.
- A PR that changes `runtime/src` updates `dist` and baselines in the same commit, with a stated reason.

---

## (d) Plugin packaging and the chrome/material generator

**Layout of the master plugin** (the repo root above): `.claude-plugin/plugin.json`; `skills/` with
- `atelier` (router and entry point: picks sketch, episode, feature or atelier film; replaces the studio and explainer routing tables);
- `explainer-plan` (System 1 S0-S10 and laws L1-L13);
- `explainer-film` (the former `p5-explainer`);
- `chrome-forge` (scaffolds and reviews chromes and materials);
- `p5-studio`, `p5-concept`, `p5-forge`, `p5-crit` (seats in `references/seats/`), `p5-ship` (the sketch line);
- `ceti-explainer` (the SVG episode skill, kept by name for trigger continuity), `ceti-brand`, `ceti-research`.
Scripts are called as `${CLAUDE_PLUGIN_ROOT}/scripts/cetix …`; no skill reaches outside the plugin directory (an installed plugin is copied to a cache, so `../` breaks).

**`cetix new chrome <id> --renderer p2d|webgl [--standalone <dir>]`** writes:
1. `chromes/<id>/NOTES.md`, at most 700 words: mark rule (five one-sentence slots: run, step, slip, check, expected), doctrine rows (Impossibility, Belief, Ruler, Address, Silence, Thumbnail, Etymology), Never list, beat sheets S and N (a lint compares them to `chapters`, which fixes the seven stale NOTES files in R12), hero frames, iteration log ("what I saw / what I changed"), s/frame, weaknesses.
2. `<id>.kit.js`: an IIFE exporting a pure kernel (`begin/units/end`, `markOp` with an explicit unknown-kind throw), caches keyed by `(k, seed)`, a header "each mark is one ___", and a clock-law banner.
3. `shared.film.js` (glance, 25-35 s, AgentLoop twin worlds on common random numbers, one commit control, failure address, captions at most 90 characters, score, `meta` with independent oracle rows) and `native.film.js` (one Wield-style control).
4. `chrome.json`: id, direction, renderer, ground, `tokensLight` hue declaration, fonts (family, file, weight, style, licence), `nRange`, `cell`, `markRule`, `nouns`, voice Hz, perf budget.
5. `film.json` for each film, and `gate.config.json` (profile `atelier-glance`, caps, waivers).
6. `library/materials/<id>.js`: an `AM.material` adapter with all 16 required keys (`id, source, axis, cell, nRange, ground, begin, units, mark, line, area, text, num, anchor, end, voice`) plus `markRule`, `nouns`, `fonts`; it imports the chrome kit by path with a sha-pinned copy or a `//@export` slice (the fork fix for the 4 diverged kernels).
7. The operad registration: an entry in `library/registry.json`, `operad.json` regenerated by `check.mjs --export`, and the CAP capacity row.
8. `tests/calibration/<id>/`: one good graph and bad variants (uniform p, reveal before commit, a digit in text, a font weight mismatch, `Math.random` in `score()`), plus `tests/baselines/<id>.frames.json` after the first pass.

`--standalone` emits the same files as `<dir>/ceti-chrome-<id>/` with its own `.claude-plugin/plugin.json` and a `skills/<id>-chrome/SKILL.md` (the art direction as a skill); `cetix doctor` verifies the master plugin via `CETI_ROOT`. `cetix new material <id>` writes only items 2, 4, 6, 7, 8.

**Contracts enforced** (each is a gate row or a `check.mjs` law; a scaffold that cannot pass them does not install):
- Clock law: `CLOCK` over film, kits and kernels, and runtime guards that also wrap `score`, `meta`, `engine` and `setup` (bug 7).
- Belief: digits reach the screen only through `ctx.N` / `AM.Number`; the phrase "exact N ±" is banned.
- Legibility floors: title 18, head 16, must-read 14, note 10 px (add gate rows; today nothing covers LEGIBLE, BELIEF or HOUSE).
- Mark-rule completeness: five non-empty slots; every `mark` kind used is declared.
- Modules and cameras never draw; one Material per film.
- Fonts: declared weight and style equal the file's.
- Perf: s/frame within the `chrome.json` budget on SwiftShader.
- `PURE-XPROC`; at least one independent META row; commit before readout; 400 px layout.
- Tokens: semantic roles only; a light theme declares its hue deltas (bug 6).

**Install check (`cetix doctor`):** Python 3.10+; `import playwright` and a Chromium launch with the SwiftShader flags; fontTools, brotli, Pillow; `ffmpeg -version`; Node 18+; p5 sha256; `fonts.lock.json` against files; `dist/atelier.js` equals a fresh rebuild; `check.mjs` negatives fail as expected; `smoke-2d` builds and gates in under 20 s; prints a table, non-zero exit on any failure.

---

## (e) Fix first

1. **`render.py:153-160` (rescue loop) and `:170-198` (mux):** after two rescue passes no check reports frames that are still missing; `errs` takes only worker-reported errors; `ffmpeg` stops at the first gap, so the MP4 is silently truncated. Fix: recount after rescue and exit 1 before muxing. Also `:168` `s_per_frame_per_worker` is mislabelled; `:170` `--stills` with `--mp4` silently skips the MP4.
2. **Tautological META rows: `atelier.js:746-751` (`checkMeta`) and `gate.py:97-102`; example `smoke-2d.film.js:199`.** A probability row compares `exact()` with `exact()` and cannot fail. Fix: an independent Python DP in the gate (p' = p + (1-p)·c·(1-(1-p)^retry)), count rows re-counted from `flags`, a mutation fixture with a wrong value that must FAIL, and the `META-COVERAGE` row (native films have checked rows in only 3 of 8 chromes).
3. **`AM.cam.mix` pan bug: `up3/modules/core/am.js:85-90`.** With equal zoom, `wz = 0/(0||1e-9) = 0`, so the centre never moves. Fix: if `|1/a.z - 1/b.z| < 1e-9` use `wz = u`. Unit test: `mix({0,0,2},{100,0,2},.5).x == 50`.
4. **Plate scale cap: `materials/plate.js:38`** passes `ctx.size.k` to `X.surface`; `am.js:101` defines `renderScale = min(k, 1.5)` and `EX.scale` maps k above 1.6 to 2. Use `AM.renderScale(ctx)`.
5. **Sediment font declarations: `materials/sediment.js:24`.** Cormorant is declared 600 but the file is the 500 italic; Plex Sans Condensed is declared 500 but the file is 600; Plex Mono is declared 500 but the file is 400. `tools/build_film.py` never passes a style, so the italic registers upright. The delta chrome's `make.sh` uses 500 and 600 italic files that `modules/fonts/` does not have. Fix: rows `{family,file,weight,style}`, the `FONTS` gate row, and copy the missing files.
6. **Retune hue contradiction: `atelier.js:151` vs `:168-174`.** The header says "meaning is invariant"; `tokensLight` moves hue (peach 51.4 to 33.7 degrees, copper 63.4 to 69.6, sage 137.1 to 147.5, slate -113.1 to -109.7). Fix: correct the comment, keep the curated set, and test that each shift is at most 20 degrees and copper vs peach stays distinct.
7. **Clock-guard gaps: `atelier.js:558-571`, `:536-543`, `:842-846`.** Guards cover only `Math.random`/`Date.now` inside `draw` and `p.random/randomGaussian/millis` while `busy`. Unguarded: `performance.now`, `new Date()`, `crypto.getRandomValues`, `p.frameCount`, `p.deltaTime`, and everything in `derive()` (`engine`, `score`, `meta`) and `setup`. Fix: `ctx.pure(fn)` around all of them; extend `gate.py` BANNED with `crypto`, `requestAnimationFrame`, `localStorage` in draw (`margin.kit.js:698` `storeGuess`).
8. **Duplicate studio tools.** Three variants each of `gate`, `render`, `build_film` (studio, explainer, atelier), the identical `ce/` copy, and two unrelated files both named `build_film.py`. Merge into `cetix`. The studio and explainer scripts (`gate.py` sweep/inv/zone, `lint.py`, `ship.py`, `series.py`, `seat_packets.py`, `feature_gate.py`, `film_render.py`, `composite.py`, `parity.py`) are absent from the sources and must be written to R15's spec.
9. **Kernel forks:** four of eight `materials/kernels/*` differ from the chrome kits. One source (the chrome kit), a sha-pinned copy, a CI `cmp`.
10. **Readout wording:** `atelier.js:742` already says "expected … ±"; `smoke-2d.film.js:165` and the G, H, B films print "exact 717 ± 21" (the README's F3 is stale). Add a BELIEF scan for `exact N ±` in film source; "sd about 21" is wrong (18.4 at 1,571).
11. **Pedagogy truth defects (R13, R6; re-verify against the post-R1 films):** ledger "break-even 18.8 h" excludes the 20 h redo; escapement native N=60 is too small for its 73%/79% claim; exposure shows "70%" before the commit; escapement caption 6 gain (1.5) disagrees with the code.
12. **Drift:** README speeds vs `render.json`; `markRule`/`nouns` copied at `compose.js:23` but never checked; `AM.module` re-registration silently overwrites (make it throw); P1 skips INV commits (latent).

**Owner may veto:** one player for all tiers; CETI-dark default with cream as a preset; per-tier size budgets; harness and sheaf skills moved to `contrib/` (not deleted).
