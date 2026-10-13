# amdahl · "Ten Times Faster" · Amdahl's law as a count of hours

The 75-second case (factory/FORMAT.md) for the exec claim "AI will make this 10× faster". Built on
factory/kit as published, with no kit patches. Topic brief: factory/topics/amdahl/ (brief.md, claims.json,
beats.md).

## Files
| file | role |
|------|------|
| film.json | window.FILM: params, the 10 steps, commit (at 9.0 s, default 4×), count.at 36, 5 beat chapters, 14 captions, 9 ledger rows, brand, 8 sources, 3 honest-limits paragraphs, try-it |
| film.js | FILM_RENDER: setup builds the per-hour step kinds; render(t, state, K) is pure; tryit reruns 100 ÷ (untouched + touched ÷ speed) |
| claims.json | 26 claims, every one with a formula over film.json.params plus a source key |
| gate.json | the gate's verdict for this build |

Build: `python3 factory/kit/build.py factory/films/amdahl` gives build/amdahl.html, **1,111,964 bytes**,
sha256 `d400603042adca17557c267b75146fda822ddab5818390b854f1c66ea2dd7613`. Film code (film.js + film.json +
claims.json) is 28.0 KB.

## Film
- HOOK (0 to 8 s): the claim line over a row of 100 hour-marks (10 steps, 4 of them queues at half ink).
- COMMIT (8 to 16 s): drafting (30 of the 100 hours) turns red. The commit box asks for the whole
  process's speed-up. Film mode types 4 and the page holds at 9.0 s. The SEALED stamp lands at 13.5 s.
- CASE (16 to 36 s): IBM Credit at true scale. 7 working days as a 588-unit hatched strip, 90 minutes of
  work as a 15.75-unit red sliver. Making the work instant moves the end by 90 minutes. The redesign
  without handoffs is a 42-unit bar labelled 4 HOURS. The sources sit in the ledger.
- COUNT (36 to 62 s): the first tally runs 0 to 100. 27 drafting marks lift out, the row closes up and
  the counter reads 73. The second tally counts the 70 untouched marks. Then three pins go on the same
  hour axis: PROMISE 10× at hour 10, YOU g× at hour 100 ÷ g, TRUE 1.37× at hour 73. Only after that does
  the ratio 100 ÷ 73 = 1.37× appear. Instant drafting gives 100 ÷ 70 = 1.43×, "THE CEILING · AMDAHL, 1967".
- MONDAY (62 to 72 s): "Of every 100 hours it takes, how many does the AI touch?", then "Half the hours?
  Never more than 2×.", then the honest-limits lines at 30 units. Brand card 72 to 75 s (kit).
- Structures, four: the hour row, the commit box, the IBM strip, the brand card. There are no
  full-screen question cards.

## Gate verdict (node factory/tools/gate.mjs …, 2026-10-08): PASS
| row | status | evidence |
|-----|--------|----------|
| G1 load | PASS | 0 errors film and live; ready 252 ms |
| G2a purity · canvas | PASS | re-seek at 7.5, 22.5, 37.5, 52.5, 67.5 identical; A→B = B→A |
| G2b purity · SVG | PASS | re-seek and order identical |
| G3 clock scan | PASS | film.js, kit.js, player.js clean |
| G4a duration | PASS | 72 s material + 3 s brand = 75 s |
| G4b five beats | PASS | HOOK 0 → COMMIT 8 → CASE 16 → COUNT 36 → MONDAY 62 |
| G4c commit time | PASS | 9 s, default 4 |
| G4d brand card | PASS | takeaway visible at 74 s |
| G4e honest line | PASS | 3 paragraphs |
| G4f sources | PASS | 8 |
| G5a formulas | PASS | 26 of 26 recompute |
| G5b caption digits | PASS | all 14 captions covered |
| G5c on-screen digits | WARN | the running tally counters (e.g. "15 HOURS", "52 HOURS" at 38 to 40 s, "UNTOUCHED 45") show intermediate counts. These are the count being performed, not claims; the end values 100, 73 and 70 are claimed. Accepted. |
| G6 legibility | PASS | 33 must-read / 22 secondary / 63 chrome, all tagged with data-role; phone 390 has no overflow |
| G7 counts first | PASS | no percentage or "N in M" anywhere; the ratio first appears at 54 s (caption) and 55 s (stage), after count.at 36 |
| G8 size | PASS | 28.0 KB code; 1.112 MB page |
| G9 tics | PASS | 0 cards |

The probe (factory/kit/probe.mjs at 11, 45, 51, 56, 68 s) re-seeks with SVG and pixels identical. In the
live run, the ask is shown and seals with 55, then with "none". The try-it shows "73 OF 100 HOURS … 1.37×".
Errors: 0.

## Fix rounds (1 of 2 used)
After the first stills: "UNTOUCHED n" collided with "30 → 3", so it moved to y 366. The commit box
prompt overflowed the box, so it now reads "× FASTER · WHOLE JOB". The "90 MINUTES OF WORK" label dims
once the work goes instant.

## Seed rule
film.json seed 23 drives the paper ground and p5 noiseSeed (set by the kit before and after setup). The
film uses no shuffle and no randomness. Every mark position, tally and counter is a closed-form function of
t: floor of a linear ramp, eased slides, and fixed per-mark stagger starts. The renderer never calls
Math.random, Date, performance, frameCount or millis.

## Deviations from beats.md (layout forced by the kit)
- The kit reserves x 700 to 930 for the ledger, commit box and title block. The row therefore spans
  x 56 to 656 at 6 units per hour (not 8.4) and the IBM strip is 588 units (15.75-unit sliver, 42-unit
  after-strip). claims.json carries the new geometry.
- The kit's commit ring counts 4 to 1 over A to A + 4 and the stamp lands at A + 4.5. The page player
  runs the 8-second hold. The film draws its own SEALED stamp at 32 units (commitBox seal: Infinity) so
  that the stamp classes as must-read at ≥ 28. This was done in film.js; the kit was not patched.
- The source chrome lives in the ledger rows, not on the stage.
- The honest-limits and Monday lines use the display face at 30 units so they fit the 616-unit content
  width.

## Open items
- The source for "4 hours" (IBM Credit after the redesign) was confirmed only through secondary
  summaries, because primary fetches were blocked in this container. See factory/topics/amdahl/brief.md.
  The shipper should spot-check Hammer & Champy (1993), ch. 3.
- The try-it panel computes but does not redraw the row with the viewer's values. That was not needed
  for the gate.
