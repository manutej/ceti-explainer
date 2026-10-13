# goodhart · "Eight Is Great" · Goodhart's law

The 75-second case: 72 s material + 3 s CETI brand card. A bank's "eight products per household" target, the
2016 to 2020 penalties, then 1,000 accounts drawn as marks; the metric counts all of them, the review flags 21,
and the viewer's sealed guess is outlined on the same grid before "21 ÷ 1,000 ≈ 2 IN 100" appears.
Topic research, sources and verification: factory/topics/goodhart/ (brief.md, claims.json, beats.md).

## Build
`python3 factory/kit/build.py factory/films/goodhart` gives build/goodhart.html, 1,105,448 bytes,
sha256 `7280596d4b9026eb47194ada10f68b4af54fad59047ba96dd81e9848fe5415a5` (film code 15,189 bytes).

## Seed rule
The only randomness is the reveal order and positions of the 21 red marks: the first 21 entries of
`K.shuffle([0..999], grid.seed = 2017)` (mulberry32), computed once in setup(). The gather swap is
deterministic from that list: red marks sorted ascending go to slots 0..20; the ink marks they displace go to
the vacated slots in ascending order. Paper ground seed is film.json seed 2017. render(t, s) reads only t and
s.answer.

## Gate (factory/tools/gate.mjs, 2026-10-08; full JSON in gate.json): VERDICT PASS
| row | result | note |
|---|---|---|
| G1 load | PASS | 0 errors film and live; ready 200 ms |
| G2a canvas purity | PASS | re-seek and order identical |
| G2b SVG purity | PASS | re-seek and order identical |
| G3 clock scan | PASS | film.js, kit.js, player.js clean |
| G4a duration | PASS | 72 s material + 3 s brand |
| G4b five beats | PASS | HOOK 0, COMMIT 8, CASE 16, COUNT 36, MONDAY 62 |
| G4c commit | PASS | commit.at 11 s; film default 100 |
| G4d brand | PASS | "When a measure becomes a target, it stops measuring." |
| G4e honest | PASS | three honest-limits paragraphs |
| G4f sources | PASS | 6 sources |
| G5a formulas | PASS | 17 claims, 14 formulas recompute |
| G5b caption digits | PASS | all 14 captions covered |
| G5c on-screen digits | WARN | running tallies (40, 160, 280 … as rows of the grid build; "10" while the default 100 is typed into the commit box). These are counts in progress, not claims; accepted |
| G6 legibility | PASS | text tagged with data-role; the marks layer group is tagged `secondary` so the kit's stamps (ON TARGET, SEALED, at 25 units) are not read as must-read |
| G7 counts first | PASS | first ratio at 54.5 s, count at 36 s |
| G8 size | PASS | film code 18.0 KB; page 1.105 MB |
| G9 tics | PASS | no full-screen cards |

## Fix rounds (1 of 2 used)
1. The HOOK row (8 OF 8, ON TARGET stamp) showed faintly under the commit question. It now fades out fully by 8.6 s.

## Deviations from topics/goodhart/beats.md (to fit the kit's layout contract)
- commit.at is 11 s (seal 15.5 s) instead of 12, because the kit seals at at + 4.5 and CASE starts at 16.
- Grid pitch is 10 and squares are 7 (x0 56, y0 118) to fit content x 48 to 664 and y 104 to 400; the counters
  sit in a right column at x 482.
- Caption 11 is static ("Your guess, outlined. The review found 21.") because the kit draws captions from
  film.json; the guess value appears in the YOUR GUESS counter instead.
- The case figures are typeset in the content area at 28 units (the kit's ledger is chrome at 12 units and must
  not carry results). The kit ledger ("CASE LOG") carries beat names only, with no digits.
- Kit additions in film.js only: a local thousands formatter, data-role tagging, and the marks-layer role tag.
  No kit file was patched.

## Known limits
- The verification relied on search extracts of the primary filings, because the container's egress blocked
  consumerfinance.gov, justice.gov and sec.gov (see the topic brief).
- No try-it panel (optional in the kit).
