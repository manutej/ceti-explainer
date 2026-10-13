# sunk-cost · "The Season Ticket" · the sunk cost fallacy

The 75-second case: 72 s of material and the kit's 3 s CETI brand card. The case is Arkes & Blumer (1985), the
Ohio University Theater season-ticket experiment. Topic research, sources and the beat sheet are in
factory/topics/sunk-cost/ (brief.md, claims.json, beats.md). This folder holds film.json, film.js and claims.json.
The film code (14 captions, 5 sources, 34 claims) is 29.9 KB.

## Build
    python3 factory/kit/build.py factory/films/sunk-cost
    -> factory/films/sunk-cost/build/sunk-cost.html  1,108,495 bytes
       sha256 8552cc4056be00717ee5e5444c8131aae9b3ead330b9ecfe140be65c65c90157

## Gate (node factory/tools/gate.mjs …; the full result is in gate.json): VERDICT PASS
| row | status | note |
|-----|--------|------|
| G1 load | PASS | 0 errors film and live; ready 474 ms |
| G2a canvas purity | PASS | re-seek and the A→B / B→A order give identical pixels |
| G2b SVG purity | PASS | byte-identical |
| G3 clock scan | PASS | film.js, kit.js and player.js are clean |
| G4a duration | PASS | 72 s material + 3 s brand |
| G4b five beats | PASS | HOOK 0, COMMIT 8, CASE 16, COUNT 36, MONDAY 62 |
| G4c commit | PASS | at 11.2 s; film-mode default 17 |
| G4d brand | PASS | "What's spent is spent. Decide on what's left." |
| G4e honest | PASS | 4 paragraphs |
| G4f sources | PASS | 5 (AB85, AA99, F07, S76, T80) |
| G5a formulas | PASS | 33 of 33 recompute from film.json.params |
| G5b caption digits | PASS | |
| G5c on-screen digits | WARN | intentional: the "USED" and "EMPTY" counters tick through intermediate integers (0 to 74, and so on) while the squares fill. The final values are all claims. |
| G6 legibility | PASS | every text has a data-role; must-read ≥ 28, secondary ≥ 14 |
| G7 counts first | PASS | the count starts at 36 s; ratios (4.11 = 74 ÷ 18) only from 57.2 s |
| G8 size | PASS | code 29.9 KB, page 1.108 MB |
| G9 tics | PASS | no cards |

There were two fix rounds after the first look at the stills. The tickets' small text overlapped the price, and the
title-block lines ran into the slot column. Both are fixed. The kit probe also shows identical re-seeks at 13, 46 and
68 s. Its last live step throws because this film has no try-it panel (`#tryOut` is missing). That is a probe
assumption, not a film error. The gate's live load is clean.

## Seed rule
The renderer has no randomness. setup() runs two K.shuffle (mulberry32) calls once:
- the 60-buyer deal uses seed = params.season (1982);
- the unused tickets in each band use groups[].seed (15, 13 and 8 for $15, $13 and $8).

The struck couples sit at fixed ranks: $15 at 6 and 13, $13 at 9, $8 at 4, 11 and 16. The paper does not say
which buyers were couples. The paper ground uses film.json.seed 1985.

## Notes
- **How the counts are drawn.** One square is one person's ticket for one of the first five plays, and one column is
  one person. Squares are canvas mass and all text is SVG. The used totals (74, 63, 56) are the only whole numbers
  that give the paper's means for n = 18, 19 and 17. Which squares are empty is illustrative, and the honest limits
  say so.
- **The viewer's guess.** It appears only after the seal, from 48 s: a red outline over the last g squares of the $8
  band, against the 29 that are dotted and counted.
- **Captions and the kit.** Caption 10 is static ("Your guess is in red…"), so no caption depends on state. The
  kit was used as published, with no patches; film.js tags its text with data-role itself.
