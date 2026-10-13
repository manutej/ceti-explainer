# queues · Busy is not fast (utilisation and waiting)

75 s exec film in the kit's Tender Set chrome: 72 s of material + the kit's 3 s CETI brand card.
Topic brief, beat sheet and the full claim derivation: `factory/topics/queues/` (brief.md, beats.md, claims.json).

Build: `python3 factory/kit/build.py factory/films/queues` → `build/queues.html`,
1,108,580 bytes, sha256 `4743e73dcfc458458d9b4394251a93ed9c04b9a14db68dda4e55aed4f60d2c0c` (film code 18.3 KB).

## Beats and structures
HOOK 0–8 (a day as 10 hour blocks, 9 inked) · COMMIT 8–16 (half-busy strip, "≈ 1 job-length"; commit at 11,
seals 15.5, film default 2) · CASE 16–36 (100-bed grid filling to 85, 90, 92: Bagust BMJ 1999; NHS England
KH03 Oct–Dec 2022) · COUNT 36–62 (two desks, same 100 arrivals; one mark per job found ahead; counters 99 and
837, then 99 ÷ 100 ≈ 1 and 837 ÷ 100 = 8.4; the guess as a red rule against the long-run 9; ladder 1/4/9/19)
· MONDAY 62–72 ("Who runs above 85 % busy?", honest line in caption 14). Four structures: hour strips,
commit box, bed grid, desks + columns.

Counts first: utilisation is said as "9 hours of 10" until the count; the first percentage on screen is the
ladder at 60.5 s (count.at 38).

## The seeded run and the seed rule
M/M/1, mulberry32(seed 3); per job one exponential gap then one exponential size from the same stream, so both
desks share the arrival rhythm (common random numbers); 2,000 warm-up jobs discarded, 100 counted. "Jobs ahead"
= jobs in the system at the arrival instant. **Seed rule:** the first seed from 1 upward whose two 100-job
counts both land within 10 % of the long run (100 and 900) — seed 3 (seeds 1 and 2 give 70/405 and 108/726).
Single runs at 90 % vary from 137 to 4,076 across seeds 1–60; the page's honest-limits panel says so.
The claims' formulas rerun this simulation in the gate's vm, and film.js recomputes it in setup.

## Gate (node factory/tools/gate.mjs …, 2026-10-08) · VERDICT PASS
| row | status | evidence |
|---|---|---|
| G1 load | PASS | 0 errors film and live; ready 428 ms |
| G2a purity · canvas | PASS | re-seeks identical, both orders |
| G2b purity · SVG | PASS | re-seeks identical, both orders |
| G3 clock scan | PASS | film.js, kit.js, player.js clean |
| G4a duration | PASS | 72 s material + 3 s brand |
| G4b five beats | PASS | HOOK → COMMIT → CASE → COUNT → MONDAY |
| G4c commit time | PASS | 11 s, default 2 |
| G4d brand card | PASS | "Busy is not fast: at 90 %, a job waits nine." |
| G4e honest line | PASS | 3 paragraphs |
| G4f sources | PASS | 7 (5 external + SIM + FILM) |
| G5a formulas | PASS | 32 of 32 recompute |
| G5b caption digits | PASS | all 14 captions |
| G5c on-screen digits | WARN | the running counters' partial sums (e.g. 20, 33, 61 during 38–48 s) and the kit's commit countdown "3"; each partial sum is the cumulative sum of the per-arrival series declared in topics/queues/beats.md (claim count-running) |
| G6 legibility | PASS | data-role tagged; 32 must-read / 32 secondary / 52 chrome |
| G7 counts first | PASS | first ratio "50 %" at 60.5 s; count at 38 s |
| G8 size | PASS | film code 26.8 KB; page 1.109 MB |
| G9 tics | PASS | no cards |

One fix round after the stills: desk slots moved clear of the "BUSY n OF 10" labels, shorter division
readouts (clear of desk B's tallest columns), shorter chrome source line and title-block lines (they ran into
the title block), commit prompt fitted to the box, brand takeaway shortened to one line.

## Known limits
- The kit has no data-role on its own chrome; this film tags its own text only (gate classes the rest by layer).
- The case is many beds; the count is one desk. Said in captions 14 and the honest-limits panel.
- Primary pages for Bagust (bmj.com, PubMed) and KH03 (england.nhs.uk) are blocked from this container; the
  figures were confirmed from search extracts in two separate searches each (see the topic brief).
