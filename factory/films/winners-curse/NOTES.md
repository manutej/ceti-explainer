# The Winner's Curse · `winners-curse` · 75-second case

The film is built from factory/topics/winners-curse (brief.md, beats.md) with the kit as published. No kit
patches were needed. It runs 72 s of material plus the kit's 3 s CETI brand card (75 s in total). It is
silent, and it uses the Tender Set palette with Big Shoulders Display 600 and IBM Plex Mono 400/500.

## Build
`python3 factory/kit/build.py factory/films/winners-curse` produces build/winners-curse.html:
**1,110,017 bytes**, sha256 `a4fc5a1a53742c5457361bd47c6d4110a4309131184481bdfd5514f7ae5470bf`.
Film code is 19.8 KB (gate count, which includes claims.json: 32.2 KB).

## Gate (`node factory/tools/gate.mjs … --kit factory/kit/kit.js --kit factory/kit/player.js`), verdict PASS
| row | status | note |
|---|---|---|
| G1 load | PASS | 0 errors in film and live mode; ready in 446 ms |
| G2a canvas purity | PASS | re-seek and A→B / B→A give identical pixels |
| G2b SVG purity | PASS | identical |
| G3 clock scan | PASS | film.js, kit.js, player.js |
| G4a duration | PASS | 72 s material + 3 s brand |
| G4b five beats | PASS | HOOK 0 → COMMIT 8 → CASE 16 → COUNT 36 → MONDAY 62 |
| G4c commit | PASS | commit at 11 s, sealed at 15.5 s; film default $10.5M |
| G4d brand | PASS | "Winning means you guessed highest, not right." |
| G4e honest | PASS | three paragraphs (constructed bidders; Hendricks, Porter & Boudreau dispute; private value) |
| G4f sources | PASS | 6 |
| G5a formulas | PASS | 36 of 36 recompute (the simulation claims rerun mulberry32(1971) inline) |
| G5b caption digits | PASS | all 14 captions |
| G5c on-screen digits | WARN | by design: the running counters while rows land ("18 of 40", "35 of 70" …) and the kit's commit countdown "4". Every settled number is a claim. |
| G6 legibility | PASS | phone 390 shows no overflow |
| G7 counts first | PASS | the first ratio ("+$2.4M · 24 %") appears at 60.6 s, after the count at 36 s |
| G8 size | PASS | 32.2 KB code; 1.110 MB page |
| G9 tics | PASS | no cards |

Stills reviewed once. One fix round: the title-block line overflowed into the slot, and the overpay
chip sat on the top rows of the stack. I moved the chip into a clear band, compressed the stack pitch to
4.6 and moved the counter column to x 512.

## Seed rule
`mulberry32(1971)` (1971 is the year of the paper; the seed was not chosen for its result). The 400
estimates are `10 × (1 + 0.3 × (2u − 1))`, drawn auction-major in `setup`. Each winner is the row maximum
and pays its own estimate. Realised: 198 of 400 guesses are high, 40 of 40 winners are high, the average
guess is $10.0M, the average winning price is $12.364M (shown as $12.4M), and the overpay is +$2.4M or
24 %. Theory gives $12.45M and puts the winner high in 1,023 of 1,024 auctions. Every seed tried
(1969, 1971, 1983, 1988, 7, 10, 23, 42) gives 40 of 40.

## Deviations from beats.md
- The COMMIT premise and caption 2 say "off by up to $3M" instead of "±30 %", because a percentage before
  the count would trip G7. A new claim, `error_abs`, covers it.
- The commit opens at 11.0 s because the kit seals at at+4.5. The captions moved to 8.2–11.0 and 11.0–15.8.
- COUNT geometry follows the kit's content box (x 48–664, y 104–400): ruler `x = 60 + (v−7)·70`,
  rows `y = 188 + a·4.6`, counter column at x 512. The viewer's full value goes in the column ("YOU SAID");
  the ruler carries a "YOU" tag.
- Source caveat (from the brief): I read Thaler 1988 and Capen et al. 1971 only through search excerpts,
  because the PDFs were behind the egress block. The 26 % / 77 % tract figures are kept off screen.
