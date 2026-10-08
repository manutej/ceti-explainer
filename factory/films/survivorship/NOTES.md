# survivorship · The Missing Planes

The 75-second case on survivorship bias. Case: Abraham Wald, Statistical Research Group, Columbia, 1943; the
numbers are the worked example in Part I of his memo *A Method of Estimating Plane Vulnerability Based on
Damage of Survivors* (CNA reprint CRC 432, 1980). Topic research: factory/topics/survivorship/ (brief, claims,
beats).

## Files
| file | bytes |
|---|---:|
| film.json | 5,275 |
| film.js | 11,969 |
| claims.json | 6,746 (24 claims, every one with a formula and a source) |
| build/survivorship.html | 1,107,514, sha256 `484bccb63f752fb0633425bb61b8ed292d2966f4ac59cd8dd09e23c1e5f991f3` |

Build: `python3 factory/kit/build.py factory/films/survivorship`. Gate output: gate.json.

## Gate verdict (factory/tools/gate.mjs, 2026-10-08): PASS
| row | status | evidence |
|---|---|---|
| G1 load | PASS | 0 errors film and live; ready 265 ms |
| G2a purity · canvas | PASS | re-seek 7.5 / 22.5 / 37.5 / 52.5 / 67.5 identical; A→B = B→A |
| G2b purity · SVG | PASS | identical, order identical |
| G3 clock scan | PASS | film.js, kit.js, player.js clean |
| G4a duration | PASS | 72 s material + 3 s brand = 75 s |
| G4b five beats | PASS | HOOK 0 → COMMIT 8 → CASE 16 → COUNT 36 → MONDAY 62 |
| G4c commit time | PASS | 10.5 s; film default 10 |
| G4d brand card | PASS | "The data you have is the data that survived." |
| G4e honest line | PASS | three paragraphs |
| G4f sources | PASS | 5 |
| G5a formulas | PASS | 24/24 recompute |
| G5b caption digits | PASS | all 14 captions |
| G5c on-screen digits | PASS | every visible number is a claim (round 1 removed count-up tickers that showed intermediate digits) |
| G6 legibility | PASS | 36 must-read / 33 secondary / 50 chrome, all tagged with data-role; phone 390 no overflow |
| G7 counts first | PASS | count at 36 s; first ratio "1 in 4" at 54.5 s |
| G8 size | PASS | film code 23.4 KB; page 1.108 MB |
| G9 tics | PASS | 0 cards, no ring outside the commit |

No WARN or FAIL remains. Kit probe: purity at 5 / 30 / 58 / 66 s identical; live commit pauses, seals a
number and seals "none" after 8 s; try-it returns 20 of 80, 25 in 100; 0 errors.

## The count
400 squares, one per plane, 20 by 20, in the memo's groups: rows 1-16 = 320 came home unhit (pale), rows
17-19 = 60 came home holed (ink, 1 to 5 paper hole dots each per the memo's 32 / 20 / 4 / 2 / 2), row 20 =
20 never came home (red dashed outlines, then filled red as the truth). Bracket: 80 hit. The sealed guess g
fills round(g × 80 / 100) cells in blue from the start of row 20 (overflowing upward if g > 25); film default
10 → 8 of 80, against 20 of 80, then "1 in 4" with "20 ÷ 80", then 10 in 100 vs 25 in 100.

## Seed rule
film.json seed 1943 (paper ground and p5 noiseSeed). Hole-dot positions: mulberry32(1943 + i) for holed plane
i = 0..59, rejection at 2.7 units spacing, computed once in setup. Every fill is in reading order, so there is no shuffle.
render(t, state) reads only t, state.answer and precomputed arrays.

## Departures from the beat sheet, and kit notes
- Layout fitted to the kit's LAYOUT: the structure stays inside x 48-664, y 104-400; the grid is 13.5-unit pitch with
  11-unit squares at x 48-316, labels at x 340. The kit's commit box sits in the right column.
- commit.at is 10.5 (it seals at 15.0) so the seal lands inside the COMMIT beat. Caption 3 runs 8.2-9.9 and
  caption 4 (the prompt) runs 10.0-15.8, so the prompt is fully visible while the page holds. The prompt is also set on
  stage at 36 units.
- Count-up tickers were dropped (round 1): labels appear when each fill completes, so no unclaimed digit shows.
- Kit gap worked around in film.js: the kit's SEALED stamp text (about 25 units, a device, not a result) has no
  data-role, so setup tags the `marks` layer group `data-role="secondary"`. Only that stamp's text lives in the
  marks layer. A kit-level `data-role` on stamp() would remove the need for this.
- The blue "you" colour is not a kit palette key; it lives in film.json `you` (#2D5DA8).

## Honest limits (as on the page)
Wald's 400 is a worked example, not a combat log. The count rests on the memo's model: an unhit plane always
returns, so all 20 lost planes were hit. The 4 / 2 / 2 split of the last 8 planes is reconstructed from the memo's
equation (it reproduces q = 0.851). The primary PDF was not reachable from this container, so a human check of
Part I is advised. No per-area hole numbers are shown (Ellenberg's table has no traced source). The business
mapping is an analogy.
