# volatility-drag · "The average is not your outcome"

The 75 s case, made with factory/kit as published (no kit patches). It is 72 s of material plus the kit's
3 s CETI brand card. Topic brief, claims and beat sheet: factory/topics/volatility-drag/.

| beat | t | structure |
|------|---|-----------|
| HOOK | 0–8 | S1 the bet: a £100 bar splits into £150 (×1.5) and £60 (×0.6), dashed £105 average; the exec line in caption 2 |
| COMMIT | 8–16 | S2 the kit commit box (at 10 s, seal 14.5 s), "WHAT IS LEFT OF £100?"; film-mode default £150 |
| CASE | 16–36 | S1 again: one player, win then loss is £90, ×0.9 per pair, 50 pairs, then £0.52 drawn at true scale (0.72 units) beside the £100 ghost |
| COUNT | 36–62 | S3: 100 player bars on a log £ axis (1p to £1M), 100 rounds at 0.12 s each under the rising expected-value line; re-sort by rank; 87 of 100 lost money; 55 under £1; typical £0.52; the viewer's rule and "n OF 100 GOT TO YOUR £x"; then the rates |
| MONDAY | 62–72 | S4: the question and the honest limit on clean paper |

## Seed rule
mulberry32(params.seed = 1). Draws go round by round (for round 1..100, for player 0..99); a draw below 0.5 is heads.
Seed 1 is simply the first seed. It was checked against seeds 7, 42 and 2019 and against the exact binomial
expectations, and it sits near them: 87 vs 86.4 lost money, 55 vs 54.0 under £1, 12 vs 9.7 reached £150. Its
median is £0.5154, the exact typical value. Each realised count is a claim whose formula re-runs the simulation.
The rising line is labelled EXPECTED VALUE, never "the average of these players". The 100 players'
own mean is £5,232, 92 % of it held by one player (claims sim_mean and sim_top_share, page only).

## Gate (factory/tools/gate.mjs; gate.json in this folder): VERDICT PASS
| row | status | note |
|-----|--------|------|
| G1 load | PASS | 0 errors film and live; ready about 300 ms |
| G2a canvas purity | PASS | re-seek and order identical |
| G2b SVG purity | PASS | re-seek and order identical |
| G3 clock scan | PASS | film.js, kit.js, player.js clean |
| G4a duration | PASS | 72 s material + 3 s brand |
| G4b five beats | PASS | HOOK → COMMIT → CASE → COUNT → MONDAY |
| G4c commit | PASS | at 10 s, default 150 |
| G4d brand | PASS | "The average is not your outcome." |
| G4e honest | PASS | four paragraphs on the page, one line on stage |
| G4f sources | PASS | 6 (Peters 2019, Peters & Gell-Mann 2016, Peters 2023, Kelly 1956, Doctor-Wakker-Wang 2020, SIM) |
| G5a formulas | PASS | 32 claims, 32 recompute |
| G5b caption digits | PASS | |
| G5c on-screen digits | WARN | the moving readouts are not individual claims: ROUND n, PAIR n, £100 × 0.9^n during the case, the EXPECTED £ label during the rounds, the "LOST MONEY n" count-up, the kit's commit ring and typed default. Each follows a claimed formula (ev_final, case_final, sim_lost); the end values are claims |
| G6 legibility | PASS | every film text tagged with data-role; must-read is 28 units or more, secondary 14 or more |
| G7 counts first | PASS | first ratio at 60.6 s, count at 36.4 s; the hook states the bet as ×1.5 / ×0.6 and £, with no % |
| G8 size | PASS | film code 33.1 KB; page 1.113 MB |
| G9 tics | PASS | no cards |

Probe (factory/kit/probe.mjs): 0 errors. Re-seek purity holds at 12, 33, 53, 61.5 and 70 s. The live commit pauses and seals, and "no answer" comes after 8 s.

## Build
`python3 factory/kit/build.py factory/films/volatility-drag` → build/volatility-drag.html, 1,112,917 bytes,
sha256 0f1f544b53a4cd6a875a4cf415a58b9262aa63d122bb93ff562e5f44c5829e08.

## Added in film.js, not in the kit
- `role()` tags each text with data-role.
- My own SEALED stamp on the commit box (commitBox is called with seal: 1e9), because the kit's stamp does not
  return its text element, so it cannot be tagged.
- The kit could export a stamp that returns its text and accept a role option on tx.

## Known limits
- The fixture is Peters' published thought experiment, not a market record.
- nature.com, arXiv and AIP were unreachable from the container; citations were confirmed via search indexes.
- During the 1.2 s re-sort, bars cross each other (a transition frame).
