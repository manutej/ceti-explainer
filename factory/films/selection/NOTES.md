# Who chose it · selection into treatment (film id `selection`)

75 s: 72 s of material plus the kit's 3 s CETI brand card. Five beats are tagged on the chapters: HOOK 0, COMMIT 8,
CASE 16, COUNT 36 and MONDAY 62. The commit is at 10.5 s and seals at 15.0 s. The film-mode default guess is 25
points of the 30-point gap.
Topic files are in factory/topics/selection/ (brief.md, beats.md, claims.json, which is a copy of the claims here).

## Build

`python3 factory/kit/build.py factory/films/selection` gives build/selection.html, **1,129,864 bytes**, sha256
`83db587cf0374c9e21f650380ced2a8123a5c6ec30a516f3e53725c25fc0b29e`.
Film code: film.js 14.5 KB, film.json 6.0 KB, claims.json 25.1 KB.

## Gate (factory/tools/gate.mjs, verdict PASS; full record in gate.json)

| row | status | note |
|-----|--------|------|
| G1 load | PASS | 0 errors in film and live mode; ready in about 0.4 s |
| G2a canvas purity | PASS | re-seek identical; seek order A to B gives the same result as B to A |
| G2b SVG purity | PASS | |
| G3 clock scan | PASS | film.js, kit.js and player.js |
| G4a–f format | PASS | 72 + 3 s; five beats in order; commit at 10.5 s; brand card; honest lines; 7 sources |
| G5a formulas | PASS | 53 claims, 51 with formulas, all recompute |
| G5b caption digits | PASS | |
| G5c on-screen digits | WARN | see below |
| G6 legibility | PASS | every film text is tagged with data-role (must-read 28 units or more, secondary 14 or more) |
| G7 counts first | PASS | no % and no "per cent" before count.at = 36 s; the first ratio is at 42 s |
| G8 size | PASS | 44.6 KB of film code; page 1.130 MB |
| G9 tics | PASS | no cards |

Why G5c warns:
- The ticking counters show their in-between values (for example "11 of 16", "27" and "54" while the dots fill).
- The kit's countdown digit shows "3".
- The ledger row is still typing ("…TO 200" on its way to 2002).
None of these are results.

The kit probe passes purity at 5, 20, 45 and 73 s, and the live commit pauses and offers the box. The 8 s timeout seals
"none" (ans2). The probe's typed-answer check returned null. Its fill value '55' is outside this film's range of
0 to 30, so the player rejects it, which is correct.
The probe also crashes on `#tryOut` because this film has no try-it panel. I ran a scratch copy with a null guard.
The fix belongs in the kit.

## Seed rule

**People.** The token list is 21×A1, 3×P1, 6×N1, 35×A0, 7×P0, 28×N0. Read the letter as the type: A stays either way,
P stays only with the feature, N leaves either way. The digit is 1 if the customer turned the feature on.
The list is shuffled with the kit's `shuffle(arr, 7)`: mulberry32, Fisher-Yates from the end. Customer id = list index.

**Coin flip.** The ids 0–99 are shuffled with `shuffle(ids, 90)`, and the first 50 get the feature.
Seed 90 is the first seed counting up from 1 whose half holds exactly 28 A, 5 P and 15 adopters. That makes the split
return the built-in 10-point effect: 33 of 50 against 28 of 50.
This choice is disclosed in the page's honest-limits text: across 10,000 seeds, 90 % of splits land between −6 and +26
points.

## Departures from beats.md

The kit contract moved things after the beat sheet was written:
- Content sits in x 48–664, y 104–400. Captions are drawn by the kit. The commit box sits at the right.
- Commit at 10.5 s rather than 12 s.
- G7 is strict about % before the count. So the HOOK and CASE use natural frequencies instead: "80 per 100",
  "56 per 100" for RR 0.56, and "129 per 100" for HR 1.29. Percentages appear only from 42 s.
- The arc in the CASE was dropped.
- `limit-swing-lo` and `limit-swing-hi` keep their 10,000-seed recomputation in a `check` field. It takes about 1 s,
  over the gate's 200 ms formula budget, so these two claims are sourced to TEACH instead.
- Nothing was added to or patched in the kit.

## Sourcing caveat

The container's proxy blocked PubMed, JAMA and OUP. I verified every figure from the abstracts through two web
searches each. The CHD split of 164 against 122 comes from a reproduction of the JAMA results table. It sums to the
abstract's 286 cases, but should be checked once by someone with JAMA access.
