# Worse Overall · `simpsons` · Simpson's paradox (Berkeley 1973)

75 s: 72 s of material plus the kit's 3 s CETI card. Brief, claims and beat sheet are in factory/topics/simpsons/.
Build: `python3 factory/kit/build.py factory/films/simpsons` gives build/simpsons.html,
**1,109,814 bytes, sha256 `47c5b15a276630aae263ad10fe39213e7a5e994cbe4e5a074c80112c3a824b14`**
(film code 19,537 bytes in the page; film.js + film.json + claims.json 33.4 KB on disk).

## What it shows
- HOOK 0–8: the verdict sheet: "New sales process / Converts worse overall.", stamped KILLED. No digits.
- COMMIT 8–16.5 (commit.at 11.5): "In how many of 6 departments did women do worse?" The answer is 0 to 6.
  Film mode uses default 5. The live page pauses, waits 8 s, then shows "no answer" (probe: askShown, then
  `none`).
- CASE 16.5–36: 4,526 squares, one per applicant, in two columns of 50 per row: MEN 2,691 and WOMEN 1,835.
  They arrive at the same rate, admitted ones turn ink, and the admitted sort to the top:
  1,198 and 557. No percentage yet.
- COUNT 36–62: 45 % / 30 %, then the same marks travel into six department bands A–F lined up across the two
  columns. The department ledger shows the rates. The sealed guess is placed on a 0–6 strip
  against the truth, 2 (C and E, by 3 and 4 points). Then A and B are bracketed, with 51 % of men applying
  there against 7 % of women.
- MONDAY 62–72: the sheet returns, KILLED struck out: "Same mix of leads? / Split by segment. Then compare."

Four structures: verdict sheet, commit box, mark field, department ledger with guess strip.

## Gate (node factory/tools/gate.mjs, gate.json), final run
| row | verdict | note |
|---|---|---|
| G1 load | PASS | 0 errors film/live; ready 448 ms |
| G2a canvas purity | PASS | re-seek and order identical |
| G2b SVG purity | PASS | |
| G3 clock scan | PASS | film.js, kit.js, player.js |
| G4a–f format | PASS | 72 + 3 s; five beats in order; commit 11.5 s; brand; honest; 6 sources |
| G5a formulas | PASS | 65 claims, 65 recompute |
| G5b caption digits | PASS | |
| G5c on-screen digits | WARN | the arrival counters tick through intermediate values (193, 385, … up to 2,691) for 17–24 s. They are counts in progress, not claims |
| G6 legibility | PASS | data-role on every film text; phone 390 has no overflow, but the 14 to 20-unit ledger text is small at 0.37 px/unit |
| G7 counts first | PASS | marks at 17 s (count.at); first % at 36 s |
| G8 size | PASS | 1.110 MB page |
| G9 tics | PASS | no cards |
| **verdict** | **PASS** | |

Two fix rounds:
1. The column sub-lines collided at 14u, so I shortened them to "1,198 ÷ 2,691".
2. The brand takeaway wrapped with an orphan word. It became "Split by segment before you call it worse."

The claim `where` fields were updated to the built layout.

## Seed rule
The mark identity is deterministic: per sex, department A..F, admitted first. Pooled slots come from the kit's
`shuffle` (mulberry32), seed **1973 for men, 1975 for women**. Sorted slots keep the pooled order, with the admitted
first. Band slot = index within the department. film.json seed 1973 sets the paper ground and the p5 noiseSeed
(pencil wobble). Everything is computed once in setup; render(t, state) reads only t and state.answer.

## Things not in the kit, done in film.js
- `T_()` wraps `kit.tx` and sets `data-role` (must-read / secondary).
- setup sets `data-role="secondary"` on the `marks` layer group, so the kit's commit-box SEALED stamp (about 25u
  while it shrinks) is classed as a label, not must-read.
- The guess strip is the film's own dashed box at the commit box's position (700,150 230×150), so the guess
  comes back where it was sealed. The kit's ledger stays chrome (12u, no results).

## Changes from beats.md
- The layout is rescaled to the kit's content box (x 48–664, y 104–400; pitch 3.6, square 2.8).
- Commit at 11.5 s (box 10.5, seal 16.0).
- Caption 11 is not templated: the guess appears on the strip only.
- Per-department counts are drawn as marks, not printed.
- Brand takeaway changed (see round 2).

## Honest limits (on the page)
Six departments of one year; the split explains this gap and does not prove fairness. The campus-wide 44 % vs
35 % appears in the honest-limits block only. 3,738 / 1,494 and the 85-department tallies are unverified and not used.
