# streaks · "Three bad months" · streaks in random sequences

A 75 s case film (72 s material + 3 s CETI brand card) built on factory/kit as published; no kit patches.
Topic folder: factory/topics/streaks/ (brief.md, claims.json, beats.md). Built page:
`build/streaks.html`, **1,111,705 bytes**, sha256 `7d00abd4032bc3d28d2d5298f4e7b20d8309de9e831a0343a5321abde6ace778`
(film code 21,463 bytes; fonts Big Shoulders Display 600, IBM Plex Mono 400/500; Tender Set palette).

## Beats and structures
HOOK 0–8 (a 12-month up/down strip that ends in three red falls) · COMMIT 8–16 (kit commit box, `at` 11.0,
film default 4, sealed 15.5) · CASE 16–36 (GVT 1985: 100 fans as 10 × 10 squares, 91 filled; true-scale bars
50 / 61 / 42; "76ers 1980–81: no link") · COUNT 36–62 (10 rows × 100 ticks, longest run boxed; the rows
collapse into a 1,000-mark tally by longest run; the viewer's number as a red rule; "7 or more: 546 of
1,000"; only then the exact odds 54 % and 97 %) · MONDAY 62–72 (the strip returns, stamped "12 coin flips";
"58 of 100 coin-flip years have one"; honest-limits caption) · brand 72–75.
Four structures: strip, commit box, fans tally + bars, rows → tally.

## Seed rule
Every mark comes from mulberry32, flip = `r() < 0.5 ? up : down`, computed once in `setup`:
- seed **1985**: one stream, 1,000 sequences of 100 flips generated in order; sequences 0–9 are the rows,
  all 1,000 are the tally (arrival order = generation order).
- seed **140**: the 12-month strip (first 12 flips: UUUDUDUUUDDD). It was selected to end on three falls;
  the page's honest limits say so. Seed 1985 was not shopped.
- p5 noiseSeed and the paper ground: film seed 23.
render(t, state) reads only t and state.answer.

## Gate (node factory/tools/gate.mjs …, gate.json in this folder)
| row | verdict | note |
|---|---|---|
| G1 load | PASS | 0 errors film and live; ready 370 ms |
| G2a purity canvas | PASS | re-seek and order identical |
| G2b purity SVG | PASS | re-seek and order identical |
| G3 clock scan | PASS | film.js, kit.js, player.js clean |
| G4a duration | PASS | 72 s + 3 s brand |
| G4b five beats | PASS | H0 C8 C16 C36 M62 |
| G4c commit | PASS | 11 s, default 4 |
| G4d brand | PASS | takeaway visible |
| G4e honest | PASS | three paragraphs (Miller–Sanjurjo bias, coin is a null model, strip selected) |
| G4f sources | PASS | 5 |
| G5a formulas | PASS | 54 claims, 49 formulas recompute (row values and tally counts re-run the seeded stream in the vm) |
| G5b caption digits | PASS | |
| G5c on-screen digits | WARN | 46 transient values: the live counters (fans 0→91, the column counts and ROWS 10→1,000 as marks land). Every final value is a claim. |
| G6 legibility | PASS | data-role on every text; the "12 COIN FLIPS" stamp raised to 28.8 units in fix round 1 |
| G7 counts first | PASS | first ratio "54 %" at 59.5 s, count at 36 s; the CASE avoids % ("50 of 100", "61 after a hit") |
| G8 size | PASS | film code 49.4 KB; page 1.112 MB |
| G9 tics | PASS | no cards |
| **VERDICT** | **PASS** | |

Fix round 1 (of 2 allowed): stamp size (G6), the 97 % line spacing, the 50-line drawn only through the bars,
the "N OF 10 BEAT YOUR g" readout lifted off row 1. Probe (kit/probe.mjs at 2, 45, 66, 73 s): SVG and pixels
re-seek identical; live commit pauses, seals a typed answer and times out to "none"; 0 errors.

## Known limits and differences from beats.md
- The kit's caption band and commit-box position forced the geometry: rows at y 116 + 30 i, tally baseline
  356, hook strip at x 80 + 50 m, commit at 11.0 (seal 15.5) instead of 12.0. The right column (x 800–904) is
  used for row values, the ROWS counter and the exact odds, with ledger and title block off.
- Caption 7 reworded to avoid "%" before the count (G7); caption 12 is static (the kit draws captions from
  film.json), the guess-specific numbers are on the stage.
- The 1,000-row tally is one seeded draw: 546 reach 7+ against 542 expected; the page labels 54 % as exact.
- Not verified against print (proxy blocks the PDF): N = 100 fans; the 91 %, 61 / 42 figures and the 76ers
  conclusion were confirmed through search summaries of GVT 1985.
