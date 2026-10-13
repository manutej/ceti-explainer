# A bell from dice · `a-bell-from-dice` · beat sheet (123 s = 120 s material + 3 s CETI card)

```
format:   feature            dur: 123 (material 0–120, CETI card 120–123, FILM.brand.at 120)
level:    manager            renderer: webgl            chrome: none            material: ink
look:     {brand: "midnight-ink", chrome: "none", material: "ink"} with a copied brand.midnight-ink.json in the film
          dir (cp factory/films/wiring-and-the-whole/brand.midnight-ink.json factory/films/a-bell-from-dice/)
commit:   none (D11) · film.json "commit": {"enabled": false} · no box, no hold, no default guess
chain:    gl-instances (CASE 12–40) → gl-camera-rig (CASE 40–58 → COUNT 58–66) → gl-volume (COUNT 66–108)
          + gl-labels solver for pins (R22) · recipes R17, R22, R24 · no gl-post
windows:  HOOK 0–12 · CASE 12–58 · COUNT 58–108 · MONDAY 108–120 · CARD 120–123
count:    count.at 24.0 (100,000 rolls [rolls]) · second count 76.0 (1,655 above 25 [simTail]) · first ratio 82.0
data:     factory/topics/a-bell-from-dice/data/{sums,first-die,first-by-sum,checkpoints}.json; or regenerate in JS
          with the generator in brief.md (mulberry32, seed 1733, one stream, draw 5i+j = die j of roll i)
```

Stage 960 × 540 design units (film 1920 × 1080). Silent; captions carry it. Must-read text ≥ 28 u, the count
and every result in the display face (never the smallest face: SEATS top fix), secondary ≥ 14 u, chrome ≤ 12 u
carries no result. midnight-ink roles: bg #0F1A33 ground, ink #EDE6D3 marks, accent #D4AF5A = the tail (sums
26–30) and nothing else, accent2 #8FA6D8 = the exact (combinatorics) layer, muted = the belief's flat line, chalk
= the cut slice. Digits only from claim ids in [brackets].

## The structures (four; the card is not one)
| # | structure | lane | beats | what it is |
|---|---|---|---|---|
| S1 | The throw | flat (K.tx + pips) | HOOK, MONDAY | five dice of roll 0 drawn as pips (2-3-2-5-6), the sum 18 [roll0Sum]; returns at Monday as the question sheet |
| S2 | The 100,000 | gl-instances | CASE 12–40 | one mark per roll, ONE instanced draw; flat-100k waffle 500 × 200 (ortho, screen-aligned), then six stacks by first die |
| S3 | The sum stacks under the rig | gl-instances marks + gl-camera-rig | CASE 40–58, COUNT 58–66 | 26 stacks by sum (5 … 30), one box per roll; the rig is the argument: plan → side → push into the tail |
| S4 | The cut | gl-volume | COUNT 66–108 | the 26 sums as counted cells, a cut travelling along the sum axis to the 25 / 26 edge, tail lit, the exact bell flat over the inset |

## Beat table
| beat | t (s) | structure · lane | focal motion (what moves, and why it is the argument) | claims |
|---|---|---|---|---|
| HOOK | 0.0–12.0 | S1 flat | 0.4 eyebrow "THE CENTRAL LIMIT THEOREM, WITH DICE" (12 u chrome). 2.0–4.0 five dice land one by one (pips, no digits). 4.2 the sum "18" in the display face. 8.2 a muted flat line across an empty 5–30 axis: the belief's picture, no counts yet. | roll0Sum, dice, sumMin, sumMax, tailCut (caption) |
| CASE · count-in | 12.0–24.0 | **S2 gl-instances** `flat-100k` | **gl-instances carries this beat.** 12.4–23.6 all 100,000 rolls count in, arrival order = roll index i (`order: 'given'`, `countIn` [12.4/123, 23.6/123], `win` 0.02), ortho waffle, aa off; running counter in K.tx (WARN-only while ticking). 24.0 the count lands: "100,000 ROLLS" in the display face, still. | rolls (count 1, at 24.0) |
| CASE · first die | 24.0–40.0 | **S2 gl-instances** `stack` | **gl-instances carries this beat (the flat layer).** 28.0–33.0 the same rolls re-partition by the first die into six stacks (`layout: 'stack'`, `shares` 6, `catNames` 1–6, box tops + fronts only). Route a: patched from/to texels, marks travel by rank. Route b: the stacks re-count from 0 in arrival order over 3 s (caption 7 says "the same rolls"). Oblique 3/4 camera; six equal heights. 34.0 pins (gl-labels solve, roles result) on each stack: 16,736 · 16,653 · 16,665 · 16,797 · 16,630 · 16,519; a muted line at 16,667. | faces, first1…first6, firstMin, firstMax, firstExpect |
| CASE · the turn | 40.0–58.0 | **S3 gl-camera-rig** over gl-instances stacks | **gl-camera-rig carries this beat.** 40.0 the camera cranes up to a PLAN view (ortho, straight down). 44.0–47.0 the same rolls re-stack by sum: 26 stacks (route a travel / route b re-count). From above all 26 footprints look alike: the belief's picture, drawn by the camera, not by a caption. 47.0 muted flat line label "EQUAL ODDS · 3,846 EACH". 50.0–55.0 `orbit` from el 89° to el 4° (side elevation, < 180° per key): the heights appear as the camera comes down; the bell is revealed by the move. 55.0–58.0 hold side view; peak pins 10,034 / 10,091 at 17 / 18; end pins 21 at 5, 15 at 30. | nSums, sumMin, sumMax, beliefEach, sim17, sim18, sim5, sim30, modeLo, modeHi |
| COUNT · into the tail | 58.0–66.0 | **S3 gl-camera-rig** | **gl-camera-rig carries this beat.** 58.0–63.0 `lookat` the stack for 26 + `dolly` in (dist above the tallest tail stack, never among the boxes); the five tail stacks turn accent; pins 939 · 462 · 176 · 63 · 15. 63.0–66.0 the tallest middle stack (18) stays in frame at the left edge for scale. Camera moves carry no number of their own; the pins are claims. | sim26…sim30, tailCut |
| COUNT · the cut | 66.0–82.0 | **S4 gl-volume** | **gl-volume carries this beat.** 66.0 cross-fade (0.6 s) from the stacks to the volume at the same side camera (the sums as 26 counted cells, `data` = data/sums.json `simulated`, `dataKind` counts; draft a `hist-1d-extruded`; draft b `hist-2d-slabs` with data/first-by-sum.json, x = sum, z = first die, tail on x). 66.6–70.0 cells grow (`build`). 70.0–76.0 the cut travels along the sum axis from 5 to the 25 / 26 edge (`cutIn` [70/123, 76/123], `cutTo` = edge 25.5); LEFT / RIGHT tick with it. 76.0 the tail cells (26–30) light accent (`tail` 25.5, snapped); **"1,655"** lands in the display face, "ROLLS ABOVE 25 · OF 100,000" beneath (secondary, not chrome). No % until 82.0. | simTail (count 2, at 76.0), rolls, tailCut |
| COUNT · ratio + belief | 82.0–92.0 | S4 gl-volume | 82.0 `ratioAt`: "= 1.6 %" under the count. 86.0 the muted flat line returns over the cells at 3,846 per sum; over the tail it encloses 19,231 rolls; a bracket "EQUAL ODDS: 19,231 · ABOUT 12 TIMES TOO MANY". | tailPctSim, beliefEach, beliefTail, beliefTimes |
| COUNT · exact | 92.0–108.0 | S4 gl-volume inset | 92.0–96.0 the exact bell (accent2 step outline, 26 steps, expected rolls = 100,000 · ways / 7,776) draws flat over the inset histogram, left to right. 96.0 inset label "WAYS OF 7,776" with 1 · 5 · 15 … 780 · 780 … 15 · 5 · 1 under the axis (draft's choice how many). 98.0 tail: "126 WAYS → 1,620 EXPECTED · COUNTED 1,655". 102.0 agreement strip: "LARGEST GAP 0.09 POINTS (SUM 14)"; centre line "MEAN 17.5 · COUNTED 17.50"; width bracket at ±1 sd "SD 3.82 · COUNTED 3.81". | outcomes, ways5…ways30, expect5…expect30, waysTail, expTailRound, tailPctExact, maxGapPts, maxGapSum, meanExact, simMean, sdExact, simSd |
| MONDAY | 108.0–120.0 | S1 flat | 108.0 cells fade; S1 returns: the five dice of roll 0 and, beside them, the 14–21 band "69.8 % OF ROLLS" (counted) as the one picture to keep. 108.2 Monday question (28 u). 114.0 the honest line (one line, 16 u+ on the live page, caption on stage). Hold to 120. | midLo, midHi, simMidPct |
| CARD | 120.0–123.0 | kit | CETI card, takeaway "Add many small chances and the middle wins." | — |

Each WebGL lane has a beat where it carries the argument: gl-instances (the count lands, 24.0; the first die is
flat, 34.0), gl-camera-rig (plan → side reveals the bell, 50–55; the push into the tail, 58–63), gl-volume (the
cut counts the tail, 76.0; the exact bell agrees, 92–108).

## Captions (23; DM Sans-equivalent caption face of the pack, 28 u, ≤ 2 lines of ~50 chars)
| # | t0 | t1 | text | claims |
|---|---|---|---|---|
| 1 | 0.4 | 3.8 | Random means anything can happen. Right? | — |
| 2 | 4.0 | 7.8 | Roll five dice and add them. This roll makes 18. | roll0Sum |
| 3 | 8.0 | 11.8 | Is a sum above 25 as likely as one in the middle? | tailCut |
| 4 | 12.2 | 17.8 | Now roll them 100,000 times. One mark is one roll. | rolls |
| 5 | 18.0 | 23.8 | Every roll counted in, in the order it was thrown. | — |
| 6 | 24.0 | 27.8 | 100,000 rolls. Nothing smoothed, nothing left out. | rolls |
| 7 | 28.0 | 33.8 | Sort the same rolls by the first die alone. | — |
| 8 | 34.0 | 39.8 | Six piles, each between 16,519 and 16,797. Flat. | firstMin, firstMax |
| 9 | 40.0 | 43.8 | One die really is anything-can-happen. | — |
| 10 | 44.0 | 49.8 | Now sort by the sum: 26 piles, from 5 to 30. | nSums, sumMin, sumMax |
| 11 | 50.0 | 53.8 | From above, every sum looks just as likely. | — |
| 12 | 54.0 | 57.8 | From the side: 17 and 18 tower, the ends almost vanish. | modeLo, modeHi |
| 13 | 58.2 | 62.8 | Push in on the right edge: sums from 26 to 30. | nSums, sumMax |
| 14 | 63.0 | 67.8 | Five thin piles. Now count every roll in them. | — |
| 15 | 68.0 | 75.8 | A cut travels along the sums, counting as it goes. | — |
| 16 | 76.0 | 81.8 | Above 25: 1,655 rolls out of 100,000. | tailCut, simTail, rolls |
| 17 | 82.0 | 87.8 | That is 1.6 %. Equal odds would put 19,231 there. | tailPctSim, beliefTail |
| 18 | 88.0 | 91.8 | Equal odds over-count the tail about 12 times. | beliefTimes |
| 19 | 92.0 | 97.8 | Count the ways instead: 126 of 7,776 outcomes. | waysTail, outcomes |
| 20 | 98.0 | 101.8 | That predicts 1,620. The dice gave 1,655. | expTailRound, simTail |
| 21 | 102.0 | 107.8 | All 26 sums agree within 0.09 points. Mean 17.5. | nSums, maxGapPts, meanExact |
| 22 | 108.2 | 113.8 | Monday: is your total a sum of many small, separate parts? | — |
| 23 | 114.0 | 119.8 | Fair dice, rolled independently. Parts that move together break the bell. | — (the honest line) |

Card takeaway (kit): "Add many small chances and the middle wins." (43 chars, no digit).

## Lane notes (from the cards and arsenal/SEATS-GL.md WARNs; read them before drafting)
- **gl-instances.** 100,000 is a claim, never a knob. aa off for the ≥ 50k layer (card). No second layout
  (SEATS fix 3): route a patches `from`/`to` texels + rank stagger in the draft's lib copy (record in NOTES.md
  and keep `count(t)` the instance range); route b re-counts each partition from 0 in arrival order (exact by
  construction). The stack geometry for 26 sums holds 100,000 boxes: render top + front faces only (bars-100k
  went 6 s → 1.0 s with that) and measure s/frame at 56 s (side view, all boxes) and 63 s (dolly). Falling boxes
  cut through column labels in boxes-30k: pins appear only after a stack settles. t = 0 of the lane is empty: it
  starts at 12.4.
- **gl-camera-rig.** Script from `fromKnobs`, keys as knobs: `camPlanT0/T1` (40/43), `camSideT0/T1` (50/55),
  `camSideEl` (4), `camTailT0/T1` (58/63), `camTailTarget` (index of stack 26), `camTailDist` (> hmax of the tail
  stacks), each with a knobs_doc row. Orbit for the 85° swing (slerp < 180° per key). lookat dist above the
  stack or the eye sits among the boxes. Closest dolly frames are the heaviest (1.5–1.7 s under load): keep the
  last frame of the push with the boxes not filling the screen.
- **gl-volume.** Commit-first WARN (t = 0 empty) is moot here (D11), but the cells must not appear before 66.0.
  `tail` 25.5 snaps to the 25 / 26 bin edge so lit cells sum exactly to 1,655. The 1D LEFT / RIGHT split prints
  in the smallest face (SEATS): raise it to secondary (≥ 14 u) or draw it with K.tx; the 1,655 is the result,
  display face. Mono faces lack ≥: write "ABOVE 25", never "≥ 26". Knobs `volTail`, `volCutTo`, `volCutIn`,
  `volOrbit`, `volCutDim`; never a count.
- **Labels.** Pins through the gl-labels solver (`solve(t, t => rig.at(rig, t), anchors)`), same anchors array
  every frame, `sticky: 'window'`.
- Budget: s/frame ≤ 1.5 headless on the heaviest frame; page < 1.3 MB (generate the 500,000 draws in JS at setup,
  ~10 ms, rather than shipping roll data; ship data/sums.json only if the draft wants a cross-check).

## Checks (run before drafting; all PASS at writing)
- [x] `python3 factory/tools/repo_topic.py --check factory/topics/a-bell-from-dice/claims.json` → CHECK PASS · 163.
- [x] Every formula also evaluates in the gate's JS scope (claim ids + params) to its value (node vm, 0 wrong).
- [x] node 22 run of the brief.md generator = recompute.py, count for count (26 sums, 6 first-die piles, tail 1,655).
- [x] Every caption digit is a claim value or a render (100,000 · 16,519 · 16,797 · 26 · 5 · 30 · 17 · 18 · 25
      · 1,655 · 1.6 % · 19,231 · 12 · 126 · 7,776 · 1,620 · 0.09 · 17.5).
- [x] Counts before ratios: count 1 at 24.0, count 2 at 76.0, first ratio (1.6 %) at 82.0; no % before.
- [x] One honest line (caption 23); the CETI card last (120–123); commit none (D11).
- [x] Each of the three WebGL lanes carries a beat (table above); at most four structures.
