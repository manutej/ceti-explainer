# regression · "The Flight Instructors" · regression to the mean

A 75-second case (72 s material + the kit's 3 s CETI brand card). Topic brief, claims and beat sheet:
factory/topics/regression/ (brief.md, claims.json, beats.md). This folder: film.json, film.js, claims.json,
gate.json; build/ is gitignored.

Build: `python3 factory/kit/build.py factory/films/regression` →
build/regression.html, **1,114,715 bytes, sha256 aaea715753770f14187c1388ba8eef099fb44d18c9f7e09d4b6e3609ce55859f**
(film code 24,503 bytes in page; film.js 18.5 KB + film.json 6.0 KB + claims.json 17.7 KB = 41.2 KB).

## Beats and structures
HOOK 0–8 (10 regions, two columns, worst one climbs, no digits) · COMMIT 8–16 (commit.at 9, default 3, the
kit's sealed box; "Of today's 10 best landings, how many land worse tomorrow?") · CASE 16–36 (the instructors'
rule, Tversky & Kahneman 1974 / Kahneman 2011 ch. 17; LANDING = SKILL + LUCK; four skill+luck bars: 65+18=83 →
65−6=59, 32−6=26 → 32+5=37) · COUNT 36–62 (100 pilots as marks in TODAY / TOMORROW columns on one score scale;
top 10 tallied one by one, 8 worse; guess rail YOU vs COUNT 8; bottom 10, 8 better; only then +20 → +10 and
"half the gap was luck") · MONDAY 62–72 (the question, the honest limit) · brand 72–75.
Four structures: two columns, commit box, flight-log bars, Monday card. 14 captions, 0 full-screen cards.

## Seed rule (declared on the page)
landing = skill + luck, mean 50, SD 10, skill and luck equally variable (r = 0.5). skill_i = 50 + round(7.071·Φ⁻¹((i+0.5)/100));
luck1 / luck2 are the same rounded quantiles shuffled by mulberry32 seeds 1468 and 2468. Seeds 1–5000 were scanned;
1468 is the only one whose counts sit at the model's rounded expectations (8 of top 10 worse vs 8.4; 8 of bottom
10 better; 3 stay top 10 vs 3.2), sample r within 0.015 of 0.5 (0.49), no ties at the cuts, no unchanged score in
either end group. The arrays are frozen in film.json.params; claims recompute from them. Arrival order of the
marks: K.shuffle(0..99, 36). Paper ground seed 17.

## Gate (factory/tools/gate.mjs, 2026-10-08) · VERDICT PASS
| row | status | note |
|---|---|---|
| G1 load | PASS | 0 errors film and live; ready ~0.3–0.8 s |
| G2a canvas purity | PASS | re-seek and A→B/B→A identical |
| G2b SVG purity | PASS | identical |
| G3 clock scan | PASS | film.js, kit.js, player.js clean |
| G4a duration | PASS | 72 s material + 3 s brand |
| G4b five beats | PASS | H0 C8 C16 C36 M62 |
| G4c commit | PASS | at 9 s, default 3 |
| G4d brand | PASS | takeaway visible |
| G4e honest | PASS | four paragraphs |
| G4f sources | PASS | 6 |
| G5a formulas | PASS | 42 claims, 39 formulas recompute |
| G5b caption digits | PASS | all 14 captions |
| G5c on-screen digits | WARN | the 0→100 landings counter's in-between values (27, 45, 63, 81, 99) and the running "WORSE 1..7" tally; transient counting chrome, the final values are claims |
| G6 legibility | PASS | data-role tagged; must-read ≥ 28, secondary ≥ 14 |
| G7 counts first | PASS | count.at 36; no ratio anywhere |
| G8 size | PASS | 41.2 KB code; 1.115 MB page |
| G9 tics | PASS | no cards |

Probe (kit/probe.mjs at 35, 54, 70 s): SVG and pixels re-seek identical; live commit pauses, seals, "none" after 8 s;
try-it renders. Fix rounds used: 2 (source line overflowing into the title block, equation anchor jump, faint TODAY
ghosts after the move, block line shortened; then bar row spacing).

## Revision after the blind seat (REVISE: model not named on stage)
Caption c14 is now "Limit: model pilots, not flight data. A quarter can't tell." (59 chars). The Monday stage
limit reads "These are 100 model pilots, not flight data." / "And one quarter cannot judge a manager." Nothing
else changed. Re-gated: VERDICT PASS, same rows as above (G5c WARN unchanged).

## Additions outside the kit (in film.js, kit untouched)
A local `tx` wrapper that sets data-role on every film text; canvas marks, ghosts and lines drawn directly on K.ctx;
the try-it model (bivariate-normal integral) lives in FILM_RENDER.tryit.

## Known limits
The pilots are a constructed sample (honest block says so). The "+5" luck label sits close to the "26" row end label
(legible, not overlapping after round 2). The live-page "YOU" marker shows the viewer's number; "no answer" shows
"YOU —". Hotelling's 1933 review is cited without page numbers (unverified offline).
