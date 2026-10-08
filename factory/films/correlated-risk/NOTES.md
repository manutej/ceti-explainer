# Ten Bets, One Bet · correlated risk

Film id `correlated-risk`, 75 s (72 s material + 3 s kit brand card), silent, Tender Set chrome from
factory/kit. Brief, claims and beat sheet: factory/topics/correlated-risk/. Built 2026-10-08 by an Opus builder.

## Build
`python3 factory/kit/build.py factory/films/correlated-risk` →
`build/correlated-risk.html`, **1,110,819 bytes**, sha256
`de70c74503bfcdf442fa95c412771b40aa2d92f40339d285858d0b7f33c48433` (film code 20,579 bytes; film.js 15.1 KB,
film.json 5.0 KB, claims.json 21.6 KB).

## Gate (`node factory/tools/gate.mjs … --kit factory/kit/kit.js --kit factory/kit/player.js`; gate.json here)
| row | verdict | evidence |
|---|---|---|
| G1 load | PASS | 0 film / 0 live errors; ready 343 ms |
| G2a canvas purity | PASS | re-seek at 7.5, 22.5, 37.5, 52.5, 67.5 identical; A→B = B→A |
| G2b SVG purity | PASS | re-seek and order identical |
| G3 clock scan | PASS | film.js, kit.js, player.js clean |
| G4a duration | PASS | 72 s material + 3 s brand |
| G4b five beats | PASS | HOOK 0 → COMMIT 8 → CASE 16 → COUNT 36 → MONDAY 62 |
| G4c commit | PASS | commit.at 9 s, film default 1 |
| G4d brand | PASS | "Ten bets that fail together are one bet." |
| G4e honest | PASS | three honest-limits paragraphs |
| G4f sources | PASS | 5 (CJS09, FCIC11, SAL09, LI00, VAS02) |
| G5a formulas | PASS | 33 claims, 26 formulas recompute |
| G5b caption digits | PASS | all 14 captions covered |
| G5c on-screen digits | PASS | every visible SVG number is a claim |
| G6 legibility | PASS | 30 must-read / 32 secondary / 50 chrome, data-role tagged; phone 390 no overflow |
| G7 counts first | PASS | count at 36 s; first percentage "0.16 %" at 58.8 s |
| G8 size | PASS | 41.7 KB code; 1.111 MB page |
| G9 tics | PASS | 0 cards |
| **VERDICT** | **PASS** | no WARN, no FAIL |

The kit probe passed as well: purity at 5, 20, 45, 73 s; live commit shows, takes 55 and "none"; try-it
renders; 0 errors. Fix rounds used: one. At 37.4 to 41.5 s the ρ readout said "ρ →" instead of "ρ 0";
the "%" labels were moved up 6 units, clear of the axis title.

## The seed rule
The 100-year grid is one seeded draw: mulberry32(**630**), Box-Muller with the cosine branch only, drawn as
Z[i] and then EPS[i][0..9] for each year i. Supplier j fails in year i when √ρ·Z[i] + √(1−ρ)·EPS[i][j] < Φ⁻¹(0.1).
Seed 630 was **chosen**: it is one of about 1.6 % of seeds from 1 to 1,000 whose grid counts equal the formula's
rate rounded (0, 3 and 7 bad years at ρ 0, 0.3 and 0.6) and whose failure totals stay within 8 of 100
(100, 98, 99). The rates on screen (0.16, 3.2, 6.9 per 100 years) come from the copula formula, not from the
draw; a separate 10,000-year draw (seed 2008) gives 0.14 %, 3.41 % and 7.11 %. The honest-limits text on the
page says this. In-page check `window.CR_CHECK` = [[0,100,0],[0.3,98,3],[0.6,99,7]], equal to the claims.

## Departures from the beat sheet (factory/topics/correlated-risk/beats.md)
- Geometry was refit to the kit's content box (x 48–664, y 104–400). The kit draws its own captions
  (mono 28, two lines) and brand card, and its commit box sits in the right column (ring 4 → 1, seal at 13.5 s).
- G7 counts every "%" and "N in M", so nothing before the count uses them. The hook says "one year in ten"
  in words. The case reads "1 OF 100 YEARS", "10 OF 100 YEARS" and "83 OF EVERY 100" (counts, not ratios).
  The junior slice's 19 was dropped.
- Nothing was added to the kit. Film-local only: data-role tagging through a wrapper around K.tx, and
  quadrature for the try-it pane.

## Remaining open items
- The FCIC page number (p. xxv) and the CJS page were checked only through web search; this container's
  network proxy blocked the PDFs. Worth one look before external release.
- The 83 % (FCIC) is an outcome with more than one cause; the honest text says so.
