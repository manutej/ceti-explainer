# The Cost of Waiting · film `cost-of-delay`

The 75-second case on cost of delay. The exec hook is "We'll start with the biggest project; the small ones
can wait." The film has 72 s of material and the kit's 3 s CETI brand card at 72 s. Topic files (brief, all six
orders, sources, verification notes) are in factory/topics/cost-of-delay/.

## Build

    python3 factory/kit/build.py factory/films/cost-of-delay
    -> factory/films/cost-of-delay/build/cost-of-delay.html  1,112,568 bytes
       sha256 85b9c679a37b27259d314cc5d20074c04c130ff6112a6238ea27ec3e7463dda3  (film code 22,285 bytes)

Fonts: Big Shoulders Display 600, IBM Plex Mono 400 and 500. All three are vendored and in the lock.

## Gate (factory/tools/gate.mjs, run 3 of 3, gate.json in this folder): VERDICT PASS

| row | status | evidence |
|-----|--------|----------|
| G1 load | PASS | 0 errors in film and live mode; ready in 323 ms; stage s.d. 25.5 / 26.1 / 32.8 |
| G2a purity · canvas | PASS | re-seek at 7.5, 22.5, 37.5, 52.5, 67.5 identical; A→B = B→A |
| G2b purity · SVG | PASS | re-seek identical; order identical |
| G3 clock scan | PASS | film.js, kit.js, player.js clean |
| G4a duration | PASS | 72 s material + 3 s brand = 75 s |
| G4b five beats | PASS | HOOK 0 → COMMIT 8 → CASE 16 → COUNT 36 → MONDAY 62 |
| G4c commit | PASS | at 9 s; film-mode default £500k |
| G4d brand | PASS | "Do first what loses the most per month of work." |
| G4e honest | PASS | two paragraphs (teaching object; when WSJF is optimal; Maersk figure is an estimate) |
| G4f sources | PASS | 5 (Reinertsen 2009; Arnold & Yüce 2013; Arnold, Cost of Delay; authors' repost; Smith 1956) |
| G5a formulas | PASS | 37 claims; 36 have formulas and all 36 recompute |
| G5b caption digits | PASS | all 14 captions covered |
| G5c on-screen digits | WARN | 15 numbers: the counters' in-between values (Maersk 0→38, tally 0→29/24), e.g. 12, 17, 22. They are running counts, not claims; each final value is a claim |
| G6 legibility | PASS | 31 must-read / 74 secondary / 53 chrome, all tagged with data-role |
| G7 counts first | PASS | count.at 36 s; no ratio before it; the value ÷ months figures appear at 58 s, after all three counts |
| G8 size | PASS | film code 31.4 KB; page 1.113 MB |
| G9 tics | PASS | 0 cards |

Probe (kit/probe.mjs, 46.6 s): SVG and pixels are the same on re-seek; the live commit pauses, takes an answer
and gives "none" after 8 s; the try-it panel reruns all six orders; 0 errors.

## The count (what the gate cannot see)
- Each mark is £50k not yet earned in a month. The marks are stacked per month column and copied into a
  36-slot tally row.
- Marks per month: biggest first (A C B) 7 7 7 3 3 2 = 29, £1,450k. Cheapest first (B C A) 7 5 5 4 4 4 = 29,
  £1,450k. CD3 order (B A C) 7 5 5 5 1 1 = 24, £1,200k. The 5 slots saved (£250k) get a red dashed outline.
- The viewer's sealed number becomes a red pin at guess ÷ 50 slots. The gap label is sign-aware ("more than",
  "less than" or "exactly what you said"). With no answer the film shows "no number sealed".
- CASE: 46 week cells, 38 shaded as waiting, one $200k chip per waiting week, then 38 × $200k = $7.6M against
  Maersk's own "nearly $8M". The 38 weeks are drawn as one run; the source does not give their order.

## Seed rule
film.json seed 31 sets the paper ground and the p5 noiseSeed. Nothing is shuffled. Every mark's time and
position comes from film.json `orders` (t0, step, stag) through `plan()` in setup, so render(t, state) uses
only t and state.

## Additions in film.js, not in the kit
- The commit box is called with `seal: Infinity` and the film draws its own SEALED stamp at full scale (28
  units). The kit's stamp ends at 0.9 × 28 = 25 units, below the must-read floor.
- Ledger rows are passed only once their time has come, so at most 2 rows show while the commit box is up.

## Known limits
- B and C use light ink tints that are close to each other; the stack order (A, then B, then C) helps tell
  them apart.
- Stills checked once; two fix rounds: (1) shortened the title-block lines, ledger row F and the CD3 legend;
  (2) lifted the red brackets clear of their labels.
- The Maersk figures were confirmed through search results that quote the primary pages; the container's
  network blocks the publisher sites. Reinertsen's chapter number for WSJF is not confirmed (see the brief).
