# wiring-and-the-whole · "The Wiring and the Whole" · a repo shown as a module of systems

A showcase film for github.com/manutej/wiring-and-the-whole (clone at e4ebf58, 2026-10-04). The bet, in the
repo's words (README.md:5): *a large codebase is not a pile of files; it is a module of systems.* The film shows
the bet as a structure and then counts the repo's four experiments. 100 s of material plus the 3 s CETI card;
silent, captions carry it. Brand midnight-ink, chrome none, material ink.

## Files
| file | role |
|------|------|
| film.json | params (every number on screen), commit (10.0 s, default 9 of 13), count.at 40, 5 beat chapters, 22 captions, 9 sources, 3 honest-limits paragraphs, try-it (break-even n*) |
| lib/film.src.js | the film: setup builds the layouts once; render(t, s, K) is pure |
| lib/timeline.js, structures.js, reveal.js, camera.js | verbatim copies of arsenal/core/timeline.js, arsenal/structures/structures.js, arsenal/patterns/reveal/pattern.js, arsenal/patterns/camera/pattern.js |
| lib/assemble.py | writes film.js = the four modules (comments and indentation stripped) + film.src.js. kit2 inlines only film.js, so this is how the arsenal reaches the page. Run it before build.py. |
| film.js | GENERATED (79 KB). Do not edit; edit lib/film.src.js |
| claims.json | 55 claims, bare array; every one has a formula over film.json params and a source `repo:<path>:<line>` (or `git:` for the file counts, `film:` for the default guess) |
| facts.json | git ls-files / rev-list / log facts (repo_topic.py did not exist): 469 files, 70,854 lines, 145 commits, files by folder and extension, toybank by module. No repository code was executed. |
| brand.midnight-ink.json | film-local copy of arsenal/brands/midnight-ink.json with disp = Newsreader 600 (see Deviations) |
| gate.json | the gate's verdict for this build |

## Build
    python3 factory/films/wiring-and-the-whole/lib/assemble.py
    python3 factory/kit2/build.py factory/films/wiring-and-the-whole --brand factory/films/wiring-and-the-whole/brand.midnight-ink.json --chrome none
→ build/wiring-and-the-whole.midnight-ink.none.html, **1,240,373 bytes**, sha256
`6f9f015116dd9be5cbf38639ca07e53d9c40ca89583116c471001a5edd19451d` (byte-reproducible; rebuilt twice, same hash).

## Arsenal modules used (4)
- **core/timeline** · one compiled timeline holds every motion channel (pile, sort, chips, boxes, checks, e2in, e2pay,
  e2bc, e3a, e3b, e3tok, e3pct, e5ba, nos, fix, q, lim) with beats per chapter; `scene()` windows give each scene its
  cross-fade alpha. No seg() tables in the film.
- **structures** · `scatter` (the 469-file pile, seed 469) → `rows` (the same marks by top folder, identity kept) with
  `transition` (stagger by x, arc 46); `grid` for every count (514/169/54 family members at one pitch; 16 × 4 answers per arm).
- **patterns/reveal** · arc-length draw-on of the toybank wires (6 Controller→Service→Repository verticals + the two
  report → Money wires, pen tip) and of the four E5 depth lines. Called with a token copy whose bg is transparent, so
  its `background()` is a no-op on the kit's canvas.
- **patterns/camera** · `api.sample` (log-space zoom, cubic) flies into the witness/ row at ×2.5; `worldToScreen` maps
  the marks, and the landing position of each of the 16 toybank marks is where its chip flight starts.

## Film
- HOOK 0–9: 469 marks rain into a pile (this repo's own files). "A codebase is not a pile of files." → "It is a module of systems."
- COMMIT 9–17: "A 16-file toy bank, glued at its interfaces. 13 gluing checks." 13 empty check boxes; commit box HOW MANY?, film-mode guess 9, sealed at 14.5.
- CASE 17–40: the pile sorts into rows by folder (131 · 122 · 79 · 39 · 37 · 18 · 14 · 29), the camera flies into witness/ (18 files, 16 of them the toy bank), the 16 marks fly into five module boxes and unfold into file chips with ports; reveal draws the wires; the two Money wires are the collision. The 13 checks light one by one: 13 OF 13, the viewer's guess pinned on the same row, κ FIRES stamped.
- COUNT 40–92 (counts before ratios; first % at 63 s):
  E2 — one mark per family member at one pitch: 514 handlers, 169 API resources, 54 repository wrappers; the first n* members (5, 2, 2) pay for the legend, the rest flood gold; WIN ×3; "LEGEND 152 ONCE · 62 → 27 TOK EACH".
  E3 — 16 questions × 4 runs per arm, one mark per answer: 60 OF 64 vs 61 OF 64 (the misses are all Q5, the ambiguous question, in both arms); token bars 2,089 vs 1,316; then 93.8% / 95.3% / 63% OF A.
  E5 — D1..D10, Sonnet in both arms flat at 100% (solid bone under dashed gold), Haiku's two arms dip in muted lines; B − A = −3.7 PTS; rule within 5, raw −10.2, ~80% harness artifact.
  NO-SHIP — the independent evaluator's memo: `WIRING_ENGINE=python make slice-matrix-check` → exit 2; NO-SHIP stamp; then B1 fixed, 6 of 6 shards, ship.
- MONDAY 92–100: "What is this a module of?" over the faint repo rows; honest line: the repo's own reported numbers, one author, not replicated.
- Brand card 100–103 (kit2 plain card): CETI · "Ship the wiring, not the whole."
- Structures, four: the file field (pile → rows → zoom), the module board with its check row, the count grids (E2, E3), the depth chart. The memo is a panel, not a full-screen card.

## Gate (node factory/tools/gate.mjs … --kit factory/kit2, 2026-10-08): FAIL on G4a only
| row | status | evidence |
|-----|--------|----------|
| G1 load | PASS | 0 errors film and live; ready 364 ms |
| G2a/b purity | PASS | canvas and SVG identical on re-seek; A→B = B→A |
| G3 clock scan | PASS | film.js (with the inlined arsenal), kit2.js, player.js clean |
| **G4a duration** | **FAIL** | 100 s material + 3 s brand; the gate wants 60–75 s. The brief for this film asked for 90–110 s, so this is by design; the gate has no feature-length mode. |
| G4b–G4f | PASS | five beats in order; commit 10 s, default 9; brand card visible; honest line; 9 sources |
| G5a/b/c claims | PASS | 55 of 55 formulas recompute; every caption digit and every visible SVG digit is a claim |
| G6 legibility | PASS | all text tagged by data-role; must-read ≥ 28, secondary ≥ 14; phone 390 no overflow |
| G7 counts first | PASS | count.at 40; first ratio at 63 s |
| G8 size | PASS | 96.3 KB film code (< 120 KB); page 1.240 MB (< 1.3 MB) |
| G9 tics, G10 axes | PASS | no cards; midnight-ink / none / ink / paper at the exec level |

Stills looked at once (gate --shots, 8 frames). Fix rounds used: 2 of 2 — (1) commit title shortened to HOW MANY?
and box widened, E2 legend line and WIN stamps moved, E5 rule line moved, check names no longer upper-cased (κ read as K),
the missing ratio params that crashed E3 at 57 s; (2) the chip flight (squares fly, then unfold into chips while the
module boxes open), the repo/witness title cross-fade, Sonnet's lines drawn first.

## Claims discipline
Every digit is a claim with `repo:<path>:<line>`: README.md:5/21–24/47–49, E2-RESULTS.md:9, E3-RESULTS.md:11/52,
E3-GRADES.json:82/84 (per-question counts give 60 and 61 of 64), E5-RESULTS.md:2/45, E5.1-GRADES.json:347,
E5-GRADES.json:170, WITNESS.json:3, WITNESS-HOW-IT-WORKS.md:62, the two evaluation files (:18, :12). File counts are
`git:` facts (facts.json). The E5 Haiku lines are drawn from E5.1-GRADES.json per-depth strict accuracy but carry no digits.
"One author": README.md:80 and HANDOFF.md:2 name one operator (CETI); git shows commits by that person and their
coding agents (Cursor Agent 96, cursor[bot] 38, manutej 11).

## Deviations (kit not patched)
1. **Brand face.** kit2/build.py embeds only `style: normal` faces; midnight-ink's display face (Cormorant Garamond 500)
   is vendored italic-only, so `--brand midnight-ink` dies ("not in vendor/fonts.lock.json"). editorial-serif has the same
   problem (Fraunces italic). The film builds with a film-local copy of the pack whose disp is Newsreader 600 (the pack's
   own body family); every colour is midnight-ink's. Fix for the kit owner: accept the lock entry's style in `hit()` and
   write `font-style` from it.
2. **Length.** 103 s total by the brief; G4a FAILs by construction.
3. **Arsenal delivery.** kit2 inlines only film.js; lib/assemble.py concatenates comment-stripped module copies.

## Still weak
- The chip flight (27–29.5 s) reads as a stack of slabs for a moment before the chips unfold.
- The sealed stamp sits over the guess in the commit box (kit behaviour).
- E2/E3 grids are honest but dense; the E5 frame at 69 s is near-empty while the lines start.
