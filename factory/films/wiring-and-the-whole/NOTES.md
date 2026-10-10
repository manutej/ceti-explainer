# wiring-and-the-whole · "The Wiring and the Whole" · a repo shown as a few systems and their wiring

A showcase film for github.com/manutej/wiring-and-the-whole (clone at e4ebf58, 2026-10-04, plus the three PR heads
fetched locally as branches pr-46, pr-47, pr-48). The bet, in the repo's words (README.md:5): *a large codebase is not
a pile of files; it is a module of systems.* On stage that is said plainly: a few systems that only touch at their
plugs, joined by wires that only fit matching plugs. 112 s of material plus the 3 s CETI card (`format: feature`);
silent, captions carry it, every caption ≤ 60 characters. Brand midnight-ink, chrome none, material ink.

## Revision 2 (2026-10-08, Manu's review) · what changed
A. **kit2 fix (factory/kit2/kit2.js, commitBox):** the SEALED / NO ANSWER stamp is drawn beside the number, not over
   it: its centre is the number's half-width (advance table) plus the stamp's half-width to the right of the box
   centre, clamped to the box's right edge; scale lands at 0.62. data-role tags unchanged. Confirmed on
   factory/films/goodhart rebuilt with kit2 `--brand ceti-dark --chrome none`: gate VERDICT PASS (its G5c WARN is the
   pre-existing running tally, not the stamp).
B. **Plain language.** "module of systems" → "a few systems that only touch at their plugs"; "gluing" → "wiring";
   "typed interaction patterns" → "wires that only fit the right plugs"; "operadic" and "witness" are gone from the
   stage (the sources keep the paper's words). The 13 check names are said plainly ("the join holds together", "the
   alarm fires on the Money clash"); the WITNESS.json keys stay in claims.json. Stamp "κ FIRES" → "CLASH CAUGHT".
C. **THEORY beat (17–29 s, first in CASE):** 12 document glyphs (arsenal/patterns/glyphs-iso) in three clusters →
   each shows one or two plugs (round accent, square accent2) → wires draw on plug to plug, only matching kinds
   (patterns/reveal) → annotations point: "a plug", "a wire fits a matching plug" (callouts) → the files fade, three
   boxes remain joined by three wires, a square bracket under them "3 systems · 3 wires between them" → titles: "The
   wiring is small. The whole is big." then "Ship the wiring, not the whole."
D. **Dots, not slabs (36.2–38.6 s):** the 16 toybank marks fly as dots along structures.transition (stagger by index,
   arc 40) and unfold into chips only once landed. **Depth beat shows data from its first frame (81.6 s):** ten depth
   columns, two per depth (A ink, B accent), 20 marks each = one mark per 5 %, filled by the pooled strict accuracy
   from E5.1-GRADES.json; the two Sonnet 100 % lines are drawn last (85.6 s).
E. **Ladder (48–55 s, CASE's last shot):** three rungs as a wall of line-ticks at true scale, one tick per 25 lines:
   16 files / 79 lines → 29 files / 1,350 lines → 41 files / 10,270 lines; then "7 slices · 60 Java bodies · 10,663
   lines · a slice in ~9 ms (Rust)"; "NEXT · an outside repo · the 10k rung is not a full Fineract clone yet"; the
   1,923 vs 947 token bars with 947 landing on "about half"; a branch line: 3 open PRs · 46 scale report · 47 sheaf
   export, 1,445 lines · 48 MIT licence.
Also: the sealed guess is now visible (A); the E5 lines were reordered so Sonnet draws last; eyebrows renamed
("E1 · THE TOY BANK", "E3 · READING TEST", "AN OUTSIDE REVIEWER").

## Files
| file | role |
|------|------|
| film.json | `format: feature`; params (every number on screen), commit (10.0 s, default 9 of 13), count.at 55, 5 beat chapters, 29 captions, 11 sources, 3 honest-limits paragraphs, try-it (break-even n*) |
| lib/film.src.js | the film: setup builds the layouts once; render(t, s, K) is pure |
| lib/timeline.js, structures.js, reveal.js, camera.js, glyphs-iso.js, annotations.js | verbatim copies of arsenal/core/timeline.js, arsenal/structures/structures.js and arsenal/patterns/{reveal,camera,glyphs-iso,annotations}/pattern.js |
| lib/assemble.py | writes film.js = the six modules + film.src.js. Each module copy is comment-stripped and blank-collapsed, and top-level demo blocks the film never calls are cut (`CUTS`: annotations' demo scenes; glyphs-iso's iso world, demo layouts and pattern object, keeping ARSENAL.glyphs; camera's demo scenes and pattern object, keeping its `api` verbatim; reveal's demo layouts). Run it before build.py. |
| film.js | GENERATED (93 KB). Do not edit; edit lib/film.src.js |
| claims.json | 99 claims, bare array; every one has a formula and a source `repo:<path>:<line>` (`repo:pr-46:<path>:<line>` for the PR branches), `git:` for counts from the clone, `film:` for film constants |
| facts.json | git facts (repo_topic.py did not exist): 469 files, 70,854 lines, 145 commits, by folder and extension, toybank 16 files / 79 lines, PR branches. No repository code was executed. |
| brand.midnight-ink.json | film-local copy of arsenal/brands/midnight-ink.json with disp = Newsreader 600 (see Deviations) |
| gate.json | the gate's verdict for this build |

## Build
    python3 factory/films/wiring-and-the-whole/lib/assemble.py
    python3 factory/kit2/build.py factory/films/wiring-and-the-whole --brand factory/films/wiring-and-the-whole/brand.midnight-ink.json --chrome none
→ build/wiring-and-the-whole.midnight-ink.none.html, **1,256,849 bytes**, sha256
`ecf870a66aa30b3f62e236a27b6eebf9843a34ea72d9926b717644b1d5a2fd88` (byte-reproducible).

## Arsenal modules used (6)
core/timeline (one compiled timeline, 20 channels, beats per chapter, scene windows), structures (scatter → rows with
transition; grids for every count; the dot flight), patterns/reveal (toybank wires, theory wires, Sonnet lines),
patterns/camera (`api.sample`, log-space zoom into witness/), patterns/glyphs-iso (`ARSENAL.glyphs.draw` document
glyphs), patterns/annotations (callouts and the bracket over the theory picture, custom `annos`, scene-local times).

## Film
- HOOK 0–9: 469 marks rain into a pile. "A codebase is not a pile of files." → "It is a few systems that touch at their plugs."
- COMMIT 9–17: "A 16-file toy bank, wired at its plugs. 13 wiring checks." Commit box HOW MANY?, film-mode guess 9, sealed at 14.5 with the stamp beside the 9.
- CASE 17–55: THEORY (C above) · the repo sorts into rows by folder, the camera flies into witness/ (18 files, 16 the toy bank) · the 16 marks fly as dots into five module boxes and unfold into chips with plugs; reveal draws the wires; the 13 checks light one by one, 13 OF 13, the guess pinned on the same row, CLASH CAUGHT · the ladder (E above).
- COUNT 55–104: E2 one mark per family member (514 / 169 / 54; the first n* pay for the legend) · E3 one mark per answer (60 OF 64 vs 61 OF 64; 2,089 vs 1,316 tokens; then 93.8 % / 95.3 % / 63 % OF A, first ratio at 77 s) · E5 depth columns then the flat line; B − A = −3.7 PTS · the NO-SHIP memo (exit 2; B1 fixed; 6 of 6 shards; ship).
- MONDAY 104–112: "What are the parts, and where do they plug in?"; honest line. Brand card 112–115.

## Gate (node factory/tools/gate.mjs … --kit factory/kit2, 2026-10-08): VERDICT PASS (round 2 of 2)
| row | status | evidence |
|-----|--------|----------|
| G1 load | PASS | 0 errors film and live; ready 277 ms |
| G2a/b purity | PASS | canvas and SVG identical on re-seek; A→B = B→A |
| G3 clock scan | PASS | film.js (with the inlined arsenal), kit2.js, player.js clean |
| G4a duration | PASS | 112 s material + 3 s brand = 115 s (format feature, 90–120) |
| G4b–G4f | PASS | five beats in order; commit 10 s, default 9; brand card visible; honest line; 11 sources |
| G5a/b/c claims | PASS | 99 of 99 formulas recompute; every caption digit and every visible SVG digit is a claim |
| G6 legibility | PASS | 15 must-read / 27 secondary / 12 chrome, all tagged; phone 390 no overflow |
| G7 counts first | PASS | count.at 55; first ratio at 77 s |
| G8 size | PASS | 118.9 KB film code (< 120 KB); page 1.257 MB (< 1.3 MB) |
| G9 tics, G10 axes | PASS | no cards; midnight-ink / none / ink / paper at the exec level |

Round 1 failed on G4a (no `format: feature` yet) and G5a (`rustMs` claimed 10; the stage rounds 9.41 to 9 — the claim
was corrected to 9). Stills looked at once after round 2.

## Claims discipline
Every digit is a claim. Repo numbers: README.md:5/21–24/47–49, E2-RESULTS.md:9, E3-RESULTS.md:11/52,
E3-GRADES.json:82/84, E5-RESULTS.md:2/45, E5.1-GRADES.json:115–162 (per depth) and :347, E5-GRADES.json:170,
WITNESS.json:3, WITNESS-HOW-IT-WORKS.md:62, the two evaluation files (:18, :12). PR 46 numbers:
pr-46:docs/operations/reports/SCALE-REPORT-LATEST.md:27–28, 31, 35–38, 41–42, 138 (9.41 ms, shown as ~9), 8 (corpus
honesty). PR 47: exports/sheaf/fineract-charter-1k.sheafgraph.json, 1,445 lines by wc -l. PR 48: LICENSE:1 (MIT).
"3 open PRs" = the three PR heads fetched locally. **Not verified, so not on stage:** "53 branches" (GitHub's API is
not reachable from this session; the clone shows 6 local branches). The theory picture's 12 / 3 / 3 are film constants
(`film:`), named as a teaching drawing in the honest line.

## Deviations (kit patched only in A)
1. **Brand face.** kit2/build.py embeds only `style: normal` faces; midnight-ink's Cormorant Garamond 500 is vendored
   italic-only, so `--brand midnight-ink` dies. The film builds with a film-local pack copy whose disp is Newsreader 600;
   every colour is midnight-ink's. Fix for the kit owner: accept the lock entry's style in `hit()` and emit `font-style`.
2. **Arsenal delivery.** kit2 inlines only film.js; lib/assemble.py concatenates the module copies with the cuts above
   (needed for the 120 KB gate budget: six modules uncut were 152 KB). The copies in lib/ are verbatim.
3. **Annotation labels are canvas text** (the module's pills), so the gate's G6 does not see them; they are set at 15
   units, over the module's 14 floor, and carry no digit except the claimed 3 / 3.

## Round 3 (orchestrator, 2026-10-08): the two one-line fixes below were applied (E5 title shortened; E2 legend x 130), rebuilt and re-gated PASS; sha256 ecf870a6…

## Previously weak (now fixed except the last two notes)
- 90.2–95 s: the E5 title "Does the reading hold when questions go deep?" and "B − A = −3.7 PTS" (anchor end, 912)
  overlap for ~5 s. One-line fix in lib/film.src.js: shorten the title to 'Does it hold when questions go deep?'.
- 60.4–68 s: the E2 legend line "LEGEND 152 ONCE · 62 → 27 TOK EACH" starts at x 112, too close to the "514". Fix: x 130.
- The depth columns round accuracy to 5 % steps (20 marks); the exact values are in claims.json, not on stage.
- The dot flight is right but brief (2.4 s); the camera's landing positions are computed once in setup (pure).
