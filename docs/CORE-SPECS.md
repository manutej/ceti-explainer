# CORE-SPECS · the laws, five contracts, the dead weight, and a modular plan (lane R-M1, 2026-10-11)

Owner: "a very massive codebase now, it will be difficult to maintain; boil down to core specs, extract specific constraints,
and see how we could do this with swarms of smaller worker agents." This file is the boil-down. Sibling: docs/SWARM-DESIGN.md
(R-M2: worker tiers, task cards, token budgets). That file says how workers run; this one says what a worker must know and
what moves where. Nothing here changes a law; any change to a law or a baseline needs a dated row in docs/DECISIONS.md.

Method. Measured on the working tree on 2026-10-11, read-only. Tracked files: `git ls-files` (2,246). Disk: `find`/`du`. Copies:
`sha1sum`/`sha256sum` against arsenal sources. Lines: `wc -l` over js/mjs/py/sh (vendor, atlas and built pages excluded). Rebuild
test: every film built to a scratch directory with its recorded `look` (kit2 or kit v1), sha256 against the tracked page.
Figures marked (est.) are mine and unmeasured; (audit) comes from docs/ARCHITECTURE-AUDIT.md of 2026-10-10 and was not re-measured.

## 0. What the numbers say

| measure | value |
|---|---|
| tracked files / bytes | 2,246 / 191.4 MB; on disk 3.44 GB (3.11 GB in 11,000 ignored files: draft builds, frames, shots, exports) |
| tracked bytes by kind | html 78.8 MB (79) · png 76.4 MB (60) · json 11.0 MB · js 10.3 MB · md 5.2 MB (867) · jpg 5.1 MB |
| pages that embed p5 | 62 tracked pages = 76.6 MB, of which p5 = 61.4 MB (62 x 990,655 B) = 32 % of every tracked byte |
| code lines (js/mjs/py/sh) | 138,431 in 540 files |
| ... core (kit2, kit v1, chromes, tools, arsenal core/lanes/tools, scripts, tests) | 20,083 = 14.5 % |
| ... film.js and other film-dir code outside lib/ and drafts/ (28 files) | 12,040 = 8.7 % |
| ... per-film lib copies and assemblers (80 files) | 20,877 = 15.1 % |
| ... drafts (179 files) | 54,405 = 39.3 % |
| ... second-generation stacks (library, chromes, runtime, films/, skills/ceti-explainer, p5-explainer) | 20,732 = 15.0 % |
| ... archive 8,211 (5.9 %) · topics 1,988 · other 95 | |
| films / formats | 26 films: 16 case (60-75 s), 4 feature, 6 feature-long; 15 on kit v1, 11 on kit2; 17 keep the commit beat, 9 have it off (D11) |
| rebuild test | 26 of 26 films rebuild byte-identical to their tracked page in 2.0 s total (0.08 s each), no browser |
| hash guard | 64 tracked built pages: 28 guarded by a recorded hash, 36 not (22 drafts, 8 shipped-line variants including the hero page, 6 other) |
| gate | 20 rows (G1-G12 with sub-rows); 12 can run from film.json and the page text; gate.json on file has G11 for 6 of 26 films and G12 for 1 of 26 |
| page budget pressure | the 11 kit2 pages are 1.250-1.300 MB against 1.3 MB; the hero page of pass-every-time is 4,304 B under; film code of how-a-network-learns, wiring, pass-every-time is 115-119 KB against 120 KB |

Reading of the table. The core is 20 k lines and works: 26 of 26 pages rebuild. What makes the tree hard to maintain is
around it: drafts (39 % of lines), copies of the arsenal inside films (15 %), an older generation of engines that five of
seven proofs still pin (15 %), documents that restate each other (section 3g), and a page budget that every kit2 film is
touching, which is why films carry assemblers and hand-cut modules.

## 1. The laws and binding constraints as a typed spec

Types: INV invariant (a FAIL row or a build refusal), FMT format, BUD budget, PRC process. "Check" is the command and row that
proves it; "gap" says what the check does not cover. `sh scripts/doctor.sh` = tools + vendor hashes + builds + brand contrast.
Gate = `node factory/tools/gate.mjs <page> --film <dir> --kit factory/kit2 --json <dir>/gate.json`. Build =
`python3 factory/kit2/build.py <dir>` (kit v1 films: `factory/kit/build.py`).

| id | type | statement | check (command, row) | gap |
|---|---|---|---|---|
| L1 | INV | one clock: every frame is render(t, state), pure, re-seek identical | gate G2a canvas bytes, G2b SVG innerHTML at 5 times; `frames.mjs` purity at 0.2/0.5/0.8 dur; `shoot.mjs` per lane | none |
| L2 | INV | seeds fixed; no Math.random, Date, performance.now, frameCount, millis, rAF, deltaTime, p.random | gate G3 (film.js, libs, kit files, comments blanked) | `noise` without `noiseSeed` is law only |
| L3 | INV | counts before ratios | gate G7 (first %, "N in M" vs count.at); G5b caption digits | SKIP when count.at is absent |
| L4 | INV | commit beat (only if `commit.enabled`): the viewer commits a number before any number is shown | build refuses missing commit.at/prompt/default; gate G4b order, G4c at 8-16 s | "nothing from the answer before the seal" is read from the beats, not measured |
| L5 | INV | every digit on screen is a claim with a formula or a source | gate G5a (formula recomputed in a vm), G5b (caption digits), G4f (>= 3 sources); `apply_findings.py` rejects a new number | G5c (on-screen digits) is WARN only: 19 of 26 films carry the WARN |
| L6 | INV | silent; captions carry it | none: Q3 removed the audio row | add to G3 `AudioContext, new Audio, <audio>, <video>`; `ffprobe` shows no audio stream on export |
| L7 | INV | one honest-limits line | gate G4e (non-empty string or array) | the count of lines is not checked |
| L8 | INV | the CETI card is the last frame | gate G4d (takeaway non-empty; frame at dur - 1 not blank) | the wordmark is not checked |
| L9 | INV | exec level is ink and clean | gate G10 (level exec: material ink, texture none or paper); build refuses `hero` unless level manager, webgl material other than ink/hero | none |
| L10 | INV | vendored p5 and fonts only; no runtime fetch; no Google Fonts | build checks p5 against vendor/SHA256SUMS and each font against fonts.lock.json; doctor.sh | gate.mjs has no request interception or URL scan. 2 live files still load Google Fonts (skills/ceti-explainer/assets/ceti-tokens.css line 24, reference/longform/feature-cut-v2.html lines 8-10) |
| F1 | FMT | stage 960 x 540 design units, 1920 x 1080 in film mode (Q9) | gate G6 reads stage units | none |
| F2 | FMT | material seconds: case 60-75 (total <= 78); feature 90-120 (<= 123); feature-long 140-180 (<= 183); smoke 5-20 (<= 25) | gate G4a | kit2-contract.md lists case/feature/smoke only (10 of 26 films use feature, feature-long) |
| F3 | FMT | beats HOOK, [COMMIT], CASE, COUNT, MONDAY in order | gate G4b | SKIP on a film with no beat-named chapter |
| F4 | FMT | legibility: must-read >= 28 units, secondary >= 14, chrome >= 12 (WARN) | gate G6 (+ phone shot at 390 px) | canvas-drawn text is invisible to G6 and G11 |
| F5 | FMT | no text overlap (D13) | gate G11; `--overlap-warn` for films gated before it | 20 of 26 gate.json predate G11; proofs vi runs them with `--overlap-warn` |
| F6 | FMT | at most 2 full-screen cards | gate G9 | none |
| F7 | FMT | rhythm: caption hold >= 1.3 s + 0.06 s per char; beat grid >= 80 % within 2 frames; no dead hold > 8 s | gate G12, WARN-only until a dated row (D16) | not FAIL-capable |
| F8 | FMT | captions <= 60 chars, 2 lines at 28 units | `apply_findings.py` (<= 60); kit2 draws 2 lines | the gate does not count characters |
| B1 | BUD | built page <= 1.3 MB | gate G8; build prints WARNING | counts module bytes inside the page, not apart from film code |
| B2 | BUD | film code (film.js + film.json + claims.json) < 120 KB | gate G8 | arsenal copies inlined in film.js count (wiring: 57,031 of 95,581 B, audit) |
| B3 | BUD | every tunable is a knob; knobs_doc 1:1; values inside range or options | build refuses (check_knobs) | knobs never carry an on-screen number: not checked |
| B4 | BUD | brand pack = roles only; ink >= 4.5:1, chalk on panel >= 4.5:1, accent and muted >= 3:1; faces in the lock | `python3 arsenal/tools/brand_check.py <pack>`; doctor.sh; proof vii | pack schema is JSON Schema, film.json is not |
| B5 | BUD | `beat` in 0.2-4 s; `hero` only at manager | build refusal | none |
| P1 | PRC | one brief per wave, one contract per module | review only | no check |
| P2 | PRC | one gate run plus at most two fix rounds; ship with warnings in NOTES.md or card.md | pipeline rule; `apply_findings.py` exit code | no counter of rounds |
| P3 | PRC | built page committed beside sources (D10); sources rebuild byte-identical | `python3 factory/tools/catalogue.py --check` | guards 24 of 32 shipped-line pages (2 films have page null, 1 records the plain page not the hero page) |
| P4 | PRC | evaluator is blind to code; no git from a subagent; commit per lane | skill text only | no check |

Constraints that are stale or unenforced (fix in M1, section 4):
- Six stale statements: HANDOFF.md:27 ("D1-D10") and :55 ("G1-G10"), CLAUDE.md:11 ("G1-G10"), skills/atelier-draft/SKILL.md:28 and :93 ("G1-G10"),
  README.md:132 (built pages not committed; D10 commits them). The record has D1-D16 and the gate G1-G12.
- D1 "one runtime": the tree has 8 page builders (kit, kit2, runtime/tools/build.py, library/tools/build_film.py,
  library/plan/core/build_plan.py, skills/ceti-explainer/assets/build.py, skills/p5-explainer/assets/build_film.py,
  films/opera-house/build.py) and 4 gates (gate.mjs, runtime/tools/gate.py, skills/ceti-explainer/assets/gate.mjs, library/plan/core/gates.js).
- D7 (seed sweep, "G8") has no implementation: factory G8 is size. D3's tier table was retired by D12. Q8's channels gate was archived by D12.
- Of 31 decision rows (D1-D16, Q1-Q15): 15 map to a row above (D5, D10-D16, Q1, Q3, Q6, Q8, Q9, Q13, Q14); 4 are retired, superseded or
  unimplemented (D1, D3, D7, D8); 12 are choices already carried out or still open (D2, D4, D6, D9, Q2, Q4, Q5, Q7, Q10, Q11, Q12, Q15).

## 2. The five contracts a worker must know (each fits one page)

A worker card (docs/SWARM-DESIGN.md section 3) names one contract below, at most 40 KB of inputs, and one check command.
Contracts live in core/specs/ as JSON Schema where a schema exists (M2); until then the files named here are the source.

### C1 · A film (factory/films/<id>/)

Files: `film.json` (data), `film.js` (render), `claims.json` (array), `NOTES.md`. Optional: `lib/`, `brand.<pack>.json`, `gate.json`, `seat.json`.
```
film.json  required by build.py: id title eyebrow lede dur chapters captions brand{takeaway} sources honest
           present in all 26: also seed params commit count
  dur       s, including the brand card (case: 72 + 3)       format   case|feature|feature-long|smoke (default case)
  level     exec|manager|engineer (default exec = ink)       renderer 2d|webgl (default 2d)      seed integer (23)
  look      {brand, chrome, material}: flag defaults; apply_findings.py writes it (brand = id in arsenal/brands, or film)
  params    raw data; scope of claim formulas                count    {at, ...numbers}: first second a count is drawn (G7)
  commit    absent | {enabled:false} | {enabled:true, at 8-16, prompt, default, min, max, step}   (D11: off by default)
  chapters  [{id, beat HOOK|COMMIT|CASE|COUNT|MONDAY, t0, t1, eyebrow, title, card?}]   t0 ascending
  captions  [[t0, t1, text]]  <= 60 chars, hold >= 1.3 s + 0.06 s/char, digits only from claims
  brand     {takeaway, at?|dur?}   sources [[key, citation]] >= 3   honest string|string[] (one line)
  knobs     {name: value} + knobs_doc [{name, range [lo,hi] | options [..], step?, what}]  exactly 1:1, values inside
  beat? 0.2-4 s · cuts? [t..] hard cuts (sub-frames never cross) · libs? [paths] · fonts3d? [..] · tryit? (commit on only)
claims.json  [{id, text, value, formula?, tolerance?, source?, renders?[], appears_at?}]   formula or source required
film.js      window.FILM_RENDER = { setup?(p, K) /*may be async*/, render(t, state, K) }   K = window.KIT (kit2-contract.md section 4)
```
Rules: render reads only t, state, K, constants from setup; every tunable via `K.knob(name, fallback)`; text through `K.tx` with a
`data-role` (must-read, secondary, chrome); SVG elements keyed; webgl sets its camera from t every frame; no number on screen
that is not a claim; exec films draw ink only. Forbidden: any clock read (L2), editing kit, arsenal, or the gate (say so in NOTES.md).
Check: build (0.2 s, refusals) then gate (20 rows, 10-20 s); the film is done when the gate has no FAIL after at most two fix rounds.
Writes: `build/<id>.<brand>.<chrome>[.<material>].html`, `gate.json`, `frames/frames.json`. Size: film code < 120 KB, page <= 1.3 MB.

### C2 · An arsenal module (arsenal/patterns/<id>/, 39 lanes today)

Files: `pattern.js`, `demo.html`, `card.md` (<= 80 lines), `shots/contact.png`, `shots/report.json`; new: `lane.json` (below).
```
window.ARSENAL.patterns['<id>'] = {
  id, atlas: [slug..], renderer: 'p2d'|'webgl', rendererFor?(params),
  params: {defaults, each documented in card.md with a range},
  variants: [{name, params, renderer?}] >= 3 showing the range,
  setup(p, ctx, params) -> state      // pure of (params, ctx.seed); may be async; mulberry32(ctx.seed) for every draw
  draw(p, t, state, params, tokens)   // pure of t (s); tokens = brand pack ROLES, never hex; never createCanvas
}                                      // ctx = {seed, w, h, tokens}; no Math.random/Date/frameCount/millis; no fetch; vendored p5 and fonts
lane.json (new, M2) {id, kind: p2d|webgl|solver|material, api: [exported names a film may call], deps: [ids], sections: [names], cost_ms}
```
Card: name; what for; when not to use; params with ranges; the variants; atlas citations [[slug]]; pitfalls; cost (s/frame at 960 x 540 x 2);
renderer; fallbacks. Check: `node arsenal/tools/shoot.mjs arsenal/patterns/<id>/demo.html --out arsenal/patterns/<id>/shots [--query brand=swiss-grid]`
renders each variant at t = 0, 1/3, 2/3, end, re-seeks one frame and compares canvas bytes, writes the contact sheet and
report.json (`"errors":0`, ms/frame). Fix at most twice; ship with WARNs in the card.
Today's drift: 16 of 39 lanes register under an indirect name (a static scan cannot find the id); 5 cards exceed 80 lines (gl-camera-rig 82,
gl-instances 89, gl-look 100, gl-post 91, gl-stack-city 84); 38 of 40 demo.html are not tracked (`*.html` in .gitignore).

### C3 · A gate row (factory/tools/gate.mjs, 20 rows in one 710-line script)

```
row { id: 'G<n>[a-z]', name, needs: 'static' | 'browser',
      run(ctx) -> { status: PASS|FAIL|WARN|SKIP|INFO, evidence: string <= 400 chars, data: object } }
ctx   { page (Playwright, browser rows only), film (film.json), claims, dur, html (page text), seek(t), texts(t), opts }
```
Rules: a row is pure of (page, film dir) and takes no network; FAIL only for a law, a format window or a budget in section 1; a new row
ships WARN-only and becomes FAIL-capable only by a dated D-row (D13, D16 precedent); SKIP says why; evidence names the worst 8
instances, `data` holds all of them. A row is at most 150 lines and has two fixtures (`gate/fixtures/<id>.pass.json`, `.fail.json`);
none exist today. Output: `{film, page, pass, rows:[{id, name, status, evidence, data}]}`; exit 1 on any FAIL; rows sort G1..G12 numerically.
Static-capable rows (12 of 20, runnable from film.json, claims.json and the page text without Chromium): G3, G4a, G4b, G4c, G4e, G4f, G5a, G5b, G8, G9,
G10, G12 (G4c and G10 read `info` today; `window.FILM` and the `<meta name="kit2">` tag in the HTML carry the same values). Browser rows (8): G1, G2a, G2b,
G4d, G5c, G6, G7, G11. G2a and G2b store no hashes in `data`; M0 adds them (acceptance for re-baselines, section 4).
Check: `node factory/tools/gate.mjs <page> --film <dir> --json out.json` equals the previous rows on the 26 films (evidence strings identical).

### C4 · A findings file (factory/films/<id>/findings.r<N>.json; apply_findings.py is the validator)

A JSON array (or `{findings: [...]}`) of 5-12 objects. Evaluator levers: knobs, caption texts, chapter t0, brand id, chrome id. Nothing else.
```
{ t, frame, what, severity: block|major|minor, why,
  <exactly one target>: knob "<name>" | caption_index n | chapter_index n | chapter "<id>" | brand true | chrome true,
  proposed_value }
knob            number inside range [lo,hi] or one of options        (step advisory, not enforced)
caption_index   new text <= 60 chars; every number = a claim value (x100, /1e3, /1e6 allowed) or already in the old text
chapter         new t0: moved <= 2.0 s, strictly between neighbours, first chapter fixed
brand           id in arsenal/brands/ (derived twins and film-local packs are not accepted by id) or "film"
chrome          "none" | id in factory/kit2/chromes or factory/chromes
```
Conflict: two findings on one target in a file are rejected. Rounds: dry run until all accept; apply; strips regenerate; round 2 is last;
remainder to NOTES.md with timestamps. Check: `python3 factory/tools/apply_findings.py <dir> findings.r1.json --dry-run` (report in
`findings.r1.report.json`: applied, rejected + reasons); real run exits 1 if the gate FAILs. `apply_findings.py` is run by no proof (section 3h).

### C5 · An export (arsenal/tools/export.mjs; frames.mjs shares the accumulation)

```
node arsenal/tools/export.mjs <page> --sel '#stage' --query '?film=1' --fps 30 --out <dir> --name <id>
     [--shutter 0.35] [--samples auto|N] [--ssaa k] [--cuts t,t] [--from s --to s] [--shards k/n|n] [--crf 16] [--gif-seconds 0]
```
Needs `window.__film = {ready(), seek(t, variant?), info{dur}}` (sync draw). Time is set per frame, never observed. Sub-times never cross a
declared cut (film.json `cuts`). Writes MP4 (libx264, yuv420p, tagged bt709/tv, no audio track), optional GIF (<= 10 s), `export.json`
(samples of every frame, seconds per frame, SHA-256 of 4 frames re-rendered out of order). Cost: 0.4 s/frame at 4K plain; 5.7-13 s/frame with
accumulation. Preview rule: iteration cuts use 1080p and `--samples 2` (about 1 s/frame); only the master uses `--samples auto`. Exports are
not committed (`*.mp4`, `export/` ignored). Check: `export.json` determinism flag true and `ffprobe` lists no audio stream (L6).

## 3. Duplication and dead-weight inventory

### 3a. Exact duplicate files (sha1 over all tracked files)
72 groups, 231 files, 159 redundant copies, 4,054,479 B. By location: a draft copy + a shipped lib copy + the arsenal source 1,629,176 B (62 redundant files);
a draft copy + a shipped lib copy 983,544 B (45); a draft copy + the arsenal source or a shipped file 777,618 B (35); ds-bundle/img/chromes.png =
factory/chromes/preview.png 388,190 B; archive vs live 106,049 B (4). Largest group: arsenal/patterns/gl-labels/pattern.js x 22 = 668,094 B redundant.
The exact duplicates are small beside p5 (61.4 MB) and drafts (35.1 MB); they go away with the archive and the loader.

### 3b. Per-film lib copies (factory/films/*/lib, tracked, non-draft)
| class | files | bytes | lines |
|---|---:|---:|---:|
| arsenal copies and generated bundles | 38 | 973,663 | 13,355 |
|   of which byte-identical to arsenal today | 24 | 642,024 | |
|   of which drifted, patched or generated (arsenal moved on) | 14 | 331,639 | |
| assemblers and film makers (assemble.py x 11, mkfilm.py x 3, revise_*.py, make_*.py) | 23 | 178,129 | 2,501 |
| film source (film.src.js x 11) | 11 | 389,059 | 4,890 |
| film data (data.js x 4), rig script, knobs, json | 8 | 105,562 | 132 |
| total | 80 | 1,646,413 | 20,878 |

Copies by lane: gl-labels 7 (identical, 222,698 B), gl-camera-rig 4 (3 stale at 36,295 B against 42,336 B in arsenal), gl-pointcloud 4 (3 trimmed to
5,832-7,438 B from 21,708 B), gl-stack-city 2, gl-heightfield 2, gl-post 2 (stale, 24,171 against 27,711), gl-instances (stale, 32,610 against 38,927),
timeline (stale, 15,048 against 18,112), plus 11 single copies. A shipped film therefore runs an older lane than its card describes.
`assemble.py` exists 11 times (997 lines) with 2 variants of `strip()` (8 + 3 copies) and its own cut or patch list (one-query: 11 exact-substring patches).
All 11 kit2 films carry copies in lib/ (film.js assembled from them, or `libs` pointing at lib/); only pass-every-time also loads 4 scripts by arsenal
path (text-reveal, kit2/text-reveal.js, and gl-post and gl-look through the hero look).
Audit: arsenal copies are 41 % of simpsons-3d film.js and 60 % of wiring film.js.

### 3c. Helpers defined again (live arsenal, kit, chromes files)
mulberry32 in 37 files (2 body variants), clamp 42, smooth 22, lerp 19 (all live js: 46, 61, 28, 35). About 15 KB in total (est.): leave it;
the rule is "touch a lane, import core" (M5). The big bytes are elsewhere.

### 3d. p5 and fonts in pages
| item | measure |
|---|---|
| p5 in 62 pages | 61.4 MB tracked; 990,655 B per page = 78-89 % of a page, 66-81 % of its gzip (audit) |
| pages that call no p5 API | 15 kit v1 films + the goodhart kit2 variant = 16 pages, 17.9 MB; each would be about 0.12 MB without p5 (audit: 1,109,814 to 119,184 B) |
| p5 calls the 2D kit needs | 8: createCanvas, createGraphics, pixelDensity, noLoop, loadPixels, noise, noiseSeed, drawingContext |
| fonts embedded per page | 3-5 faces, 59-113 KB; subsetting saves 31-64 KB per page (audit); DM Sans 600 embedded and never loaded in simpsons-3d (19,008 B) |
| arsenal/fonts/fonts.js | 273,290 B of base64 beside the 6 TTFs it encodes (204,456 B) |
| vendor/fonts | 36 locked faces, 51 files, 718,985 B |

### 3e. Engines and builders
8 page builders and 4 gates (section 1). The first-generation stacks are pinned by proofs i-v: runtime 9 files (139 KB), chromes 42 (2.43 MB),
library 79 (1.09 MB), films/ 19 (4.67 MB), skills/ceti-explainer 27 (338 KB), skills/p5-explainer 12 (137 KB): 188 files, 8.80 MB, 20,732 lines.
factory/kit (805 lines) and kit2 (1,878 lines) coexist: 15 films build on kit, 11 on kit2; proofs vi branches on `look`.

### 3f. Drafts and stills
| item | files | tracked bytes | note |
|---|---:|---:|---|
| factory/films/*/drafts | 322 | 35,128,524 | 22 built pages = 28.0 MB; 179 code files = 54,405 lines; 561 MB on disk; proofs vi never opens them |
| arsenal lane contact sheets | 39 | 66,247,883 | JPEG q85 measured 33,112,032 (-50 %) |
| arsenal/ds-bundle | 51 | 3,059,371 | generated by `ds_bundle.py` (78 lines) |
| factory/ stills outside films (kit2 proof, smoke-webgl, chromes preview) | 42 | 6,608,996 | proof outputs |

### 3g. Documents
400 md files outside the atlas and drafts. 16 restate at least 5 of the 9 law phrases (261 KB: CLAUDE.md, HANDOFF, FORMAT, DECISIONS, WAVE-WOW,
factory/README, explainer-factory SKILL, arsenal/README ...). Gate rows are described in 5 places (factory/tools/README 12.7 KB,
atelier-draft/references/gate-rows.md 15.4 KB, kit2 README, SWARM-DESIGN 2.2, HANDOFF); three say G1-G10 (CLAUDE.md, HANDOFF, atelier-draft SKILL). The kit2 contract is in two files
(kit2 README 20.1 KB, kit2-contract.md 19.3 KB). The film.json schema is stated in 8 places (6 documents, 2 programs) and machine-readable in none (JSON Schema exists for
brand packs and the catalogue only). A cold reader's twelve files (CLAUDE, HANDOFF, DECISIONS, audit, kit2 README, PIPELINE, FORMAT,
tools README, arsenal BRIEF and README, ATELIER, WAVE-WOW) are 136,838 B (about 34 k tokens at 4 B/token, est.); a drafter's path is about 280 KB (SWARM-DESIGN).

### 3h. Tools not run by any proof or doctor
Executed: gate.mjs, catalogue.py, brand_check.py, shoot.mjs (4 of 14). Not executed: apply_findings.py (295 lines), frames.mjs (173), export.mjs (273),
new_topic.py (348), repo_topic.py (941), tweak.py (618), sweep.mjs (133), gallery.py (115), ds_bundle.py (78), gallery_gl.py (67) = about 3,040 of
4,140 lines (73 %). Hard-coded environment: gate.mjs, shoot.mjs and the other mjs tools import Playwright from /opt/node-tools and launch /opt/pw-browsers/chromium-1194.
Proof vii on a fresh clone shoots 2 demos, not 40 (38 demo.html are ignored by `*.html`).

## 4. Modularization plan

Principle: change what a worker must read, not what a viewer sees. Every step names its page effect: BI = every shipped page byte-identical
(`scripts/rebuild_all.py`, section 4b); RB = re-baselined with a dated D-row, accepted by render-equivalence (the 5 canvas hashes and 5 SVG hashes of G2a/G2b at
0.1/0.3/0.5/0.7/0.9 dur equal before and after, and every gate row keeps its status).

### 4a. Target layout (lanes loaded by id; films as data)
| lane | holds | comes from | rule |
|---|---|---|---|
| core/ | laws.json (the 10 laws + 8 constraints of section 1, each with its check id), specs/*.schema.json (film, claims, lane, findings, gate-row, card), util.js (one mulberry32, clamp, lerp, smooth, ease), timeline.js | arsenal/core, build.py checks, apply_findings.py | CLAUDE.md law block and the law table in HANDOFF are generated from laws.json: 16 restating documents become 1 source |
| kit/ | kit2.js, player.js, shell.html, commit-off.js, text-reveal.js, shim-p5.js; build/ = pack.py, fonts.py, loader.py, refusals.py, page.py (build.py 510 lines split in 5) | factory/kit2 | kit v1 frozen in legacy/ (4b, M7) |
| gate/ | rows/g01..g12*.mjs, runner.mjs (150 lines), fixtures/, frames.mjs | factory/tools/gate.mjs (710 lines) | static rows run without Chromium |
| arsenal/ | lanes/<id>/{pattern.js, lane.json, demo.html, card.md, contact.png}, MODULES.json (generated), brands/, fonts/ | arsenal/patterns, core, structures, materials | lanes are loaded by id; paths are internal |
| tools/ | `ceti` with subcommands doctor, check, new, build, gate, strips, apply, modules, shoot, export, ship | factory/tools, arsenal/tools, scripts | one entry point, one environment file (Playwright path, Chromium path) |
| films/ | <id>/{film.json, film.js, claims.json, NOTES.md, data/, build/<id>.<look>.html} | factory/films minus lib/, drafts/ | data only: no copied module, no assembler |
| legacy/ | runtime, chromes, library, films/ (3), skills/ceti-explainer, p5-explainer, kit v1, proofs i-v | the 188 files, 8.80 MB of 3e | proven by `prove.sh --legacy`, outside the default tree proof |
| archive/ | drafts (322 files), research waves, notebooks, contrib | factory/films/*/drafts, existing archive/ | read by nobody by default |

Path renames come last (M9) because a `libs` entry writes `/* lib: <path> */` into the page; after M4 the header carries the module id.

### 4b. The loader that replaces per-film lib copies
`film.json "uses": ["gl-camera-rig", {"id": "gl-labels", "sections": ["solver"]}]`, resolved by build.py through `arsenal/MODULES.json`
(generated by `ceti modules --write`; fields id, path, sha256, kind, renderer, api, deps, sections, bytes).
1. Order: dependencies first (topological), then the film's order; each module is its own `<script data-module="id" data-sha="12 hex">`.
2. Sections: a lane fences optional parts with `/*@section demo*/ ... /*@end*/`; the default drops `demo` (this replaces the 11 per-film CUTS lists).
   The film names a section only to keep or add one. Patches (one-query: 11) become lane params or `api` exports, upstreamed once.
3. Strip: the deterministic comment/whitespace pass of assemble.py moves into build.py once (`strip: true` default, 1 variant, not 2).
4. D10 kept: the page `<meta name="modules">` lists id + full sha256 of every module, so a page can be refactored against the code it shipped.
5. G8 splits: film code (film.js + film.json + claims.json) < 120 KB; module bytes reported apart; page <= 1.3 MB.
6. Stale copies become impossible: a film cannot embed a module whose sha256 is not in MODULES.json; `ceti modules --check` fails on a lane whose card
   or demo moved without the registry (replaces "drifted" in 3b).
7. p5 is a module too: `uses` or `renderer: "webgl"` or a scan hit `K.p.<api>` pulls it in; otherwise the 8-call shim (about 120 lines, noise ported with the
   LCG table `1664525 r + 1013904223 mod 2^32`) is inlined (audit option b1).

### 4c. Migration order
| step | change | page effect | acceptance | est. effort |
|---|---|---|---|---|
| M0 lock | `scripts/rebuild_all.py` (the 2.0 s check: 26 of 26); `tests/baselines/pages.json` with sha256 of all 32 shipped-line pages (8 unguarded today); catalogue `pages: []` per film; G2a/G2b write their hashes to gate.json `data` | BI | rebuild_all 26/26 | 1 Sonnet card + 1 script |
| M1 hygiene | un-ignore the 38 lane demos; re-gate 26 films with the current gate (closes 20 missing G11 and 25 missing G12 rows, writes gate.json only); fix the 6 stale statements of section 1; remove Google Fonts from skills/ceti-explainer or archive it; archive drafts (322 files, 35.1 MB, D12's pending row) | BI | rebuild_all 26/26; proofs vi unchanged | 3 Haiku cards + 1 script |
| M2 specs as code | core/specs/*.schema.json derived from build.py, apply_findings.py, BRIEF.md (no new rule); `ceti check` validates 26 films, 39 lanes, 22 packs; laws.json and generated law blocks; gate split into rows/ (output equal row by row) | BI | `ceti check` clean; gate evidence strings identical on 26 films | 2 Sonnet cards, 3 Haiku |
| M3 registry and loader | MODULES.json; `uses` in build.py; pass-every-time moves its 4 path-loaded scripts from `libs` and the hero look to `uses` (its assembled gl-camera-rig and gl-labels wait for M4) | BI (`uses` emits the same header, bytes and order for these scripts) | pass-every-time plain and hero pages sha256 equal | 1 Sonnet card |
| M4a prove coverage | `ceti modules --verify`: rebuild the module portion of each assembled film.js and lib/ copy from the registry and compare bytes | BI | 11 films reproduce or list the delta (stale copies, patches) | 1 Sonnet card |
| M4 modules by id (RB-1, D17) | the 11 kit2 films switch to `uses`; sections fenced in the lanes; patches upstreamed; lib/ copies (38 files, 973,663 B, 13,355 lines) and assemblers (23 files, 2,501 lines) removed; film.src.js becomes film.js | RB: film.js shrinks (wiring by about 57 KB, audit), page meta lists modules | render-equivalence on 11 films; gate rows unchanged; B2 now excludes modules | 11 film cards (Sonnet, parallel, one film each) |
| M5 helpers | by rule: a lane that is touched imports core/util.js; no bulk edit | BI | none | 0 |
| M6 p5 only when called (RB-2, D18) | shim-p5.js in both builders; `p5: true` per film that keeps it; 16 pages lose 990,655 B each (15.85 MB tracked; 1.11 MB to about 0.12 MB) | RB: 16 pages (15 kit v1 + goodhart kit2) | render-equivalence on 16 films incl. paper-grain pixels; a film whose noise differs keeps p5 and is listed | 1 Opus plan, 2 Sonnet cards (est. 4-6 h, audit) |
| M7 fonts on demand (RB-2, same row) | subset to ASCII plus glyphs used; drop unused weights; pin fontTools | RB: all 32 pages, -31 to -64 KB each (audit) | G6, G11 unchanged; render-equivalence | 1 Sonnet card (2-3 h, audit) |
| M8 kit v1 | freeze, do not port: it stays byte-identical in legacy/ (805 lines, 15 films); porting would move 1.5-2.9 % of pixels per page (kit2 README) and needs a seat | BI | rebuild_all 26/26 | 0 |
| M9 moves and renames | arsenal/patterns to arsenal/lanes, tools to one CLI, legacy/ and archive/ moves; one commit per row of archive/MOVES.md; grep for each moved path outside archive/ returns 0 | BI after M4 (headers carry ids) | rebuild_all 26/26; `prove.sh` | 3 Haiku cards |

Order reason: M0 gives every later step a 2-second oracle; M1-M3 cost no page bytes; the first re-baseline (M4) is the one with the largest reader benefit
(a film stops owning module code); M6/M7 give the largest byte saving and share one dated row so the 32 pages move once.
Acceptance to the dated row: the D-row lists the pages, old and new sha256, old and new bytes, and the render-equivalence result per film.

### 4d. Size after the plan (sums of measured parts; est. where marked)
| measure | now | after |
|---|---:|---:|
| active tracked bytes (not archive, not legacy) | 191.4 MB | about 126 MB: minus drafts 35.1, legacy 8.8, ds-bundle 3.1, duplicate png 0.4, p5 15.85, fonts about 1.3 (est.), archive already counted 0.9 |
| ... with contact sheets as JPEG q85 | | about 93 MB |
| active code lines | 138,431 | 39,227 (minus drafts 54,405, lib copies and assemblers 15,856, legacy 20,732, archive 8,211) |
| lines a film worker may not touch (kit, gate, arsenal, tools) | mixed with film files | 20,083 in 4 lanes |
| shipped-line pages guarded by a hash | 24 of 32 | 32 of 32 |

### 4e. What to archive (nothing deleted; one row each in archive/README.md with evidence and restore path)
| item | files | bytes | lines | evidence it is safe |
|---|---:|---:|---:|---|
| factory/films/*/drafts | 322 | 35,128,524 | 54,405 | proofs vi walks factory/films/*/ only; 35 draft files equal files of the shipped film or arsenal (777,618 B) and 45 draft lib files equal shipped lib files (983,544 B); D12 left this row pending |
| arsenal/ds-bundle (untrack, regenerate) | 51 | 3,059,371 | | `python3 arsenal/tools/ds_bundle.py` rebuilds it; no proof opens it |
| factory/chromes/preview.png | 1 | 388,190 | | byte-identical to ds-bundle/img/chromes.png |
| second-generation stacks to legacy/ | 188 | 8,799,462 | 20,732 | pinned by proofs i-v only; moved with their proofs, kept running by `prove.sh --legacy` |
| factory/kit (to legacy/kit1) | 10 | 1,162,723 | 805 | still builds 15 films; frozen, not removed |
| gallery.py, gallery_gl.py, sweep.mjs (the other 7 untested tools stay, each gets a smoke test) | 3 | | 315 | no code caller; named only in README tables |
| research waves (factory/research, arsenal/frontier, references/research) | 40 | 3.9 MB | | cited by cards; keep, but list in one index so a worker never searches them |

## 5. Maintenance budget

### 5a. What a new contributor reads first (3 files, about 20 KB = 5 k tokens at 4 B/token, est.)
1. `CLAUDE.md` (1.4 KB): the laws, in one block, generated from core/laws.json.
2. `docs/CORE-SPECS.md` sections 1 and 2 (this file, 142 lines, 14.6 KB): constraints with checks, five contracts.
3. `HANDOFF.md` sections 1 and 7 (cold start five commands, honest open issues).
Everything else is read on demand through a card: DECISIONS.md by id, kit2 README by section, a lane by its card.md.
Today: 12 files and 136.8 KB (34 k tokens) before the first command (section 3g).

### 5b. The single command that proves the tree
`sh scripts/prove.sh` (replaces `doctor.sh --full` and `tests/proofs.sh all`; the old entry points stay as aliases).
| tier | runs | wall time |
|---|---|---|
| A (default, no browser) | doctor checks; vendor and font hashes; `ceti check` (schemas for 26 films, 39 lanes, 22 packs); `rebuild_all` against pages.json; the 12 static gate rows on 26 films; `ceti modules --check`; tracked-demo check; stale-path grep | 2.0 s measured for the rebuilds; about 15 s total (est.) |
| B `--gate` | the 8 browser rows on 26 films, G11 enforced (no `--overlap-warn` once films pass); apply_findings dry run on a fixture; shoot of 39 lanes | 26 x 10-20 s = 4-9 min sequential (gate README); shoot 39 lanes (est. 5 min) |
| C `--legacy` | proofs i-v of the second-generation stacks | about 3 min (est.) |
Exit code 0 means: every shipped page rebuilds to its recorded hash, every film and lane matches its contract, and every constraint of section 1 has run.
Today `sh tests/proofs.sh all` takes about 10 min (HANDOFF) and does not run L6/L10 checks, `apply_findings.py`, `frames.mjs`, the 8 unguarded pages, or 38 of 40 demos.

### 5c. Ceilings (each is a check in `ceti check`, not a wish)
| ceiling | today | limit |
|---|---|---|
| a contract | C1-C5 each about 25 lines | <= 60 lines |
| a lane card | 5 of 39 over 80 lines | <= 80 lines |
| a code file | 9 files over 800 lines: 6 film.js (up to 1,491), repo_topic.py (941), 2 legacy | core, kit, gate, tools <= 800; film.js <= 1,500 |
| a function | none over 68 lines (audit) | <= 70 |
| a gate row | inline in 710 lines | <= 150 lines, 2 fixtures |
| places that state a law | 16 documents | 1 (laws.json) and generated copies |
| places that state the film.json schema | 8 | 1 (specs/film.schema.json) |
| copies of a module in a film | 38 files | 0 |
| a worker card's inputs | about 280 KB for a drafter (SWARM-DESIGN) | <= 40 KB: C1 about 5 KB + K API 6 KB + up to 3 lane cards (average card 5.1 KB) + the brief |
| pages without a recorded hash | 36 of 64 | 0 of 32 shipped-line pages |
| tools without a test | 10 of 14 | 0 (one smoke test each in tier B) |
| decision rows | 31 (16 D + 15 Q), 6 stale statements | each row names its law id or "retired"; stale count 0 |

### 5d. Where small workers fit (detail in docs/SWARM-DESIGN.md)
Script: `rebuild_all`, `ceti check`, static gate rows, `apply_findings.py`, `ceti modules`, export. Haiku: stale-doc fixes, card-length trims, caption shortening to the C1
rule, path moves (M1, M9). Sonnet: one film scene, one lane, or one gate row against its contract (C1, C2, C3), 40 KB of input, one check command, two fix rounds.
Opus: the plan for M6, the blind pass over strips, directives for structural revision (never film code). A card that fails after two rounds is escalated once
and then written to NOTES.md as a warning (the existing stop rule). The five contracts above are the `contract` field of those cards.

### 5e. Decisions to take (each becomes a dated row)
1. D17: modules by id, G8 splits film code from module bytes (M4). 2. D18: p5 and fonts only when called (M6, M7); renumber nothing already shipped.
3. Freeze kit v1 in legacy/ (M8) or port the 15 films (needs a seat, 15 pixel changes of 1.5-2.9 %). 4. Make G12 FAIL-capable once the 6 wave films hold
100 % on the grid. 5. Archive drafts now (D12's pending row). 6. Track lane demos (reverse the `*.html` ignore for `arsenal/**/demo.html`).
