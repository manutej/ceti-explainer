# sample-size · "Thirty Customers" · the 75-second case

Sample size and margin of error: noise shrinks with √n; bias does not shrink at all.
Topic research, numbers and sources: factory/topics/sample-size/ (brief.md, claims.json, beats.md).

## Files
| file | bytes | role |
|------|------:|------|
| film.json | 7.1 KB | 75 s (72 material + 3 brand), 5 beat chapters, commit at 9 s (default 55), count.at 3 s, 14 captions, 8 sources, 3 honest paragraphs, try-it, params (seeds and the 40 survey results) |
| film.js | 19.6 KB | renderer; uses the kit as published, no kit patches |
| claims.json | 12.8 KB | 44 claims, 42 with formulas over params (gate vm: all recompute) |
| gate.json | | the gate's verdict as written by gate.mjs |

Build: `python3 factory/kit/build.py factory/films/sample-size` → build/sample-size.html,
**1,117,559 bytes, sha256 836da6218b26344c2dcbf62ff58605ea68acef637ebe327c8977efed68e68c88** (film code 27,309 bytes).

## Gate verdict (node factory/tools/gate.mjs …, 2026-10-08): PASS
| row | status | note |
|-----|--------|------|
| G1 load | PASS | 0 errors film/live; ready 308 ms |
| G2a canvas purity | PASS | re-seek identical, order-independent |
| G2b SVG purity | PASS | |
| G3 clock scan | PASS | film.js, kit.js, player.js |
| G4a duration | PASS | 72 s material + 3 s brand |
| G4b five beats | PASS | HOOK 0 → COMMIT 8 → CASE 16 → COUNT 36 → MONDAY 62 |
| G4c commit | PASS | 9 s, default 55 |
| G4d brand | PASS | "Noise shrinks with √n. Bias does not shrink at all." |
| G4e honest | PASS | |
| G4f sources | PASS | 8 |
| G5a formulas | PASS | 44 claims, 42 formulas recompute |
| G5b caption digits | PASS | (round 1 failed: bare-digit `renders` on the axis claims stripped "50" out of "50,000"; removed) |
| G5c on-screen digits | WARN | advisory: axis ticks 25/75; the live running tallies while a survey fills ("7 of 13"); and "2,376,523" read as "2,376" because the gate's number regex takes one thousands group (gate parser limit; the value is claim case_returned) |
| G6 legibility | PASS | every film text tagged data-role; must-read ≥ 28, secondary ≥ 14, ticks chrome 12 |
| G7 counts first | PASS | count.at = 3.0 s: the hook's 30 marks land (0.4–2.8 s) and "18 of 30" is drawn at 3.0 s before "60 %" appears (3.8 s headline, 4.0 s caption). Inside COUNT the rail is labelled in yes-out-of-30 and switches to % only at 51 s. |
| G8 size | PASS | 39.5 KB film code; 1.118 MB page |
| G9 tics | PASS | no cards |

Kit probe (probe.mjs, 5/20/45/73 s): SVG and pixels identical on re-seek; live commit pauses, seals 55, times out to "none"; try-it renders; 0 errors.
Stills looked at once: no dashboard or icon reading, nothing in the caption band. One fix round used.

## Seed rule
Everything random is computed once in `setup` with mulberry32 (the same function as claims.json formulas):
market = 1,000 marks, the first 500 yes, Fisher–Yates with seed **36** (i from 999 to 1, j = floor(r()·(i+1)));
surveys = one stream per size, 20 surveys, each response `P[floor(q()·1000)]` (with replacement):
n = 30 seed **10227** → 18,11,11,17,18,20,10,16,17,13,14,14,13,18,15,13,15,14,14,15;
n = 1,000 seed **14** → 474 to 527. setup checks the draw equals film.json params (console.warn otherwise).
Survey 1 (18 of 30) is the hook's survey; its draw order is the hook row. render(t) only indexes these arrays.

## Remaining issues / honest notes
- The CASE rail shows the Digest's 43 (share of Landon + Roosevelt ballots) against 61 (share of all votes), as
  published; like for like the miss is 19.5 to 19.9 points. Stated in the honest paragraphs and topic brief.
- The ±0.06 noise band is drawn at true scale (0.36 units each side), i.e. invisible by design; the label says so.
- Commit layout: the full prompt sits in the content area at 28 units; the kit's box (right column) carries the number.
- The kit ledger is not used; the right column carries a 20-unit "ASKED · NOISE" table from 55 s.
