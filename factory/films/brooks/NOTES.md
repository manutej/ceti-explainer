# Brooks' Law · film `brooks` · the 75-second case

Adding people to a late project. Topic brief, claims and beat sheet: factory/topics/brooks/.
Build: `python3 factory/kit/build.py factory/films/brooks` gives build/brooks.html, **1,111,502 bytes,
sha256 be95e706603583f3ce552b13fe5c786bd1480ef0436ebe21c5fc737ae615c45b** (film code 21,188 bytes as
counted by build.py; film.js 15.2 KB, film.json 6.0 KB, claims.json 9.1 KB).

## The film
| beat | t (s) | structure |
|---|---|---|
| HOOK | 0 to 8 | the ring: 5 dots, 10 paths drawn one by one; PEOPLE 5 · PATHS 10 counters |
| COMMIT | 8 to 16 | 5 dashed empty seats; "10 PEOPLE. HOW MANY PATHS?"; kit commit box at 9.5, seal 14.0; film default 20 |
| CASE | 16 to 36 | OS/360 ledger (1964; over 1,000 people; about 5,000 man-years 1963–1966), then Brooks's own Ch. 2 worked example as a man-month grid (12 man-months, 3 people, 4 months; milestone met at month 2; +2 people; training 3 man-months; over 7 left, 5 people, 1 month; "as late as adding no one") |
| COUNT | 36 to 62 | ring + tally: 35 new paths drawn one at a time (10 → 45), one tick per path; the sealed guess as a red bracket over ticks 1..g; only then ×2 people (10 ÷ 5) vs ×4.5 paths (45 ÷ 10); 20 people, 190 paths; OS/360 peak, 1,000 people: 499,500 possible paths |
| MONDAY | 62 to 72 | the ring held faint; "Before you add people: who trains them, and how does the work split again?"; honest line |
| brand | 72 to 75 | kit CETI card: "Double the team: 10 paths become 45." |

## Gate verdict: PASS (node factory/tools/gate.mjs, --kit kit.js and player.js; gate.json in this folder)
| row | status | evidence |
|---|---|---|
| G1 load | PASS | 0 film / 0 live errors; charset utf-8; ready about 0.2 to 0.7 s; stage not blank |
| G2a purity · canvas | PASS | re-seek at 7.5, 22.5, 37.5, 52.5, 67.5 identical; A→B = B→A |
| G2b purity · SVG | PASS | re-seek and order identical |
| G3 clock scan | PASS | film.js, kit.js, player.js clean |
| G4a duration | PASS | 75 s = 72 s material + 3 s brand |
| G4b five beats | PASS | HOOK → COMMIT → CASE → COUNT → MONDAY at 0, 8, 16, 36, 62 |
| G4c commit time | PASS | 9.5 s, film default 20 |
| G4d brand card | PASS | takeaway visible at 74 s |
| G4e honest line | PASS | three honest-limits paragraphs on the page, one on stage |
| G4f sources | PASS | 4 (Brooks 1975, Brooks 1995, Abdel-Hamid & Madnick 1991, McConnell 1999) |
| G5a formulas | PASS | 34 claims, 32 formulas recompute |
| G5b caption digits | PASS | all 14 captions covered (OS/360 covered as a render of the name) |
| G5c on-screen digits | WARN | intended: the PATHS and PEOPLE counters tick through every value (6, 15, 17, 22, 25 … 189) as each line lands; and the ledger row "REV C · OS/360, 1964" is caught mid-typing ("196"). Every resting number is a claim |
| G6 legibility | PASS | all text tagged by data-role; must-read ≥ 28, secondary ≥ 14 |
| G7 counts first | PASS | count.at 36; no percentage or ratio anywhere; the ×2 / ×4.5 ratios appear at 51 s with their counts beneath |
| G8 size | PASS | 29.5 KB film code; 1.112 MB page |
| G9 tics | PASS | no full-screen cards |

Probe (factory/kit/probe.mjs at 12, 34.5, 68, 74 s): 0 errors, SVG and canvas re-seek identical; the live
commit shows, seals a typed number, and gives "no answer" on the timer; try-it reruns n(n−1)/2.

## Seed rule
No randomness at all in the renderer: the path order is fixed (people join slots 0,4,8,12,16, then
2,6,…,18, then the odd slots; each newcomer's paths go to everyone before it, in join order), and every
time is closed-form in t. film.json `seed` 31 only seeds the kit's paper ground and p5 noiseSeed.

## Things done in film.js rather than the kit
- `data-role="secondary"` is set once in setup on the kit's `marks` layer group, so the kit's stamps
  (SEALED at 25 units, the grid verdict) are classed as labels, not must-read headline numbers.
- Ledger rows are cut to 2 while the commit box shows (README: at most 4), because the kit draws the row
  rules for every row even before it types them, and those rules crossed the box.

## Differences from the topic beat sheet (factory/topics/brooks/beats.md)
Geometry was refitted to the kit's content box (x 48–664, y 104–400; captions at y 406–490): ring centre
(190, 252), radius 138; counters and tally at x 360–660. The tally first appears at 36 s (not in the hook);
PEOPLE 5 / PATHS 10 stay visible during the commit (nothing about 10 people is shown). The kit's film-mode
countdown is a 4-second ring, so caption 4 no longer says "eight seconds"; the live page still holds 8 s.

## Honest about the case
The 12 man-month grid is Brooks's own hypothetical (Ch. 2) and is labelled "his worked example, Ch. 2".
The book gives OS/360's scale, not an "added N people, slipped M months" figure, and the film claims none.
Quotes were verified through search excerpts (the container blocks the full text), so sources cite
chapters, not pages.
