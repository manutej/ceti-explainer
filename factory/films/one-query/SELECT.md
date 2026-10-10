# one-query · SELECT (stage 3, blind, tier 1)

Evaluator: Opus, 2026-10-10. Read for each draft: frames/strip-01..26.png and thumbs/ (read as 4 x 3 contact grids at
1 s and as 2x pairs at the key beats), frames/frames.json, film.json, claims.json, gate.json; and the brief
(factory/topics/one-query/{brief.md, beats.md, sources.md}, with the director's choices). Not read: film.js, lib/,
NOTES.md, sample/. No browser was run. Both drafts gate PASS (G1-G11). Both have a G5c WARN for running counters: a
lists 8 (ladder 247, 4,043, 59,213; tiles 7,279; count-in 42 to 353), b lists 4 (count-in 19 to 365). Both have the
G6 phone note scrollWidth about 600/390 OVERFLOW. Both use the same claims.json (61 claims, all recompute). Commit is off
(D11). Timestamps are film seconds. A strip-NN covers 6(NN-1) to 6(NN-1)+5.5 s, 12 cells at 0.5 s.

## The first question: with the captions covered, do the pictures carry both halves?
- **b**: yes for the first half, from 23 s. At strip-04 cells 10-11 / strip-05, the lone mark sits beside the
  microwave (0.86 s) and the bulb (14 s). The ladder (36-55 s, strip-07..10) then scales the anchor with the crowd:
  8.6 s, 86 s, 14 min, 2.4 h, then 24 h of microwave per rung, against 2.4 Wh to 24 kWh. That is the human scale
  felt, not stated.
  The second half is partly carried. The 1.5 % sliver in the world field holds at 77.4-83 s (strip-13 cell 11 to
  strip-14), but the grey field has no legend. The four counted cube stacks hold at 88-98 s. Ireland is the tallest
  mesa at 110-120 s, but the picture undersells it (see faults). The denominator is the one thing on stage the whole
  time: per query, then per site (56 s), per grid (66 s), per own grid (99 s), and MONDAY asks the same three
  questions. That spine is visible with the captions covered.
- **a**: yes for both halves, but the denominator is shown less. The lone mark and the anchors hold at 24-31 s
  (strip-05). The world sliver holds at 78-81 s (strip-14), with the legend "GREY = THE REST OF THE WORLD'S GRID".
  The Ireland slab dwarfs every other mesa at 108-120 s (strip-19/20), and this is the best frame either draft has
  for 23 %. The denominator lives in small legends (14 u) and in the captions. The ladder shows counts only, and its
  per-query anchors never grow, so the crowd's energy is not felt in kitchen terms until "24 kWh" at 52 s.
- Neither draft shows "about half of US demand growth" (both 128-135 s). It is a pin or readout over the US mesa,
  told and not drawn.

## Ranking

### 1. b, "the denominator" (the winner)
Strengths, in time order:
- HOOK (strip-01/02). The mark is lit from 0 s. The two headline words swap over the same still mark, and ALMOST
  NONE is set in the second accent, so the two beliefs read as two voices. There is no digit, and the camera is still
  until the 8 s push.
- CASE (strip-03..10).
  - The first count, 0.24 Wh, lands at 17.2 s in the result face and holds 18 s.
  - The anchors arrive one per hold (23 s, 28.8 s).
  - On the ladder, the count is hidden while the crowd is in transit, so it never ticks through intermediate rungs
    (contrast a's 247 / 4,043 / 59,213).
  - From 56 to 65 s the site-day is built from nested tiles. The 10^5 field shrinks into one tile among six, and
    dashed frames keep "what each earlier view was" (strip-10 cells 4-8, t 57.0). I1 is visible.
  - The readout says "AT FULL LOAD (ASSUMED)" on stage (strip-10 cell 4).
- COUNT, M2 (strip-12..17).
  - From 66 to 71.4 s the 415 cubes count in, centre out, on a 3-D field. They are crisp and countable.
  - The pull-back runs 74-77 s and settles before 1.5 % lands at 77.4 s, which is 6 s after the count.
  - The regroup and quarter-turn run 83-88 s. They land on four cube stacks whose volumes are counts. Pins come on
    after the settle (88.4 s, R5), and the counts come before the shares: 187 at 88.4 s, 104 at 92, 62 at 93.8,
    shares at 95.8.
- COUNT, M3 (strip-17..23). The cut runs from 99 s, and the plan then tilts (104.5-109 s). This is the P1 sentence:
  footprints first, heights after. The section plane snaps to the Irish column, then hops to the US column with
  Ireland still in frame (121-128 s). Every pin carries its year (the director's choice).
- MONDAY (strip-23..26).
  - The terrain dims at 135 s.
  - The three denominator questions repeat the tags.
  - The honest line ON STAGE names the vendor median and all four assumptions (138 s, on a plate).
  - Caption 27 repeats it, and the CETI card comes last (151-153 s).
- Gate: 4 G5c WARNs, against a's 8. Page 1.287 MB, film code 69.7 KB, s/frame 0.75 (a: 1.02).

Faults:
- **Terrain proportions, major (knob).** At 108-135 s (strip-19 cell 8, t 112; strip-22 cell 4, t 128):
  - Each mesa is a 25-row ridge seen at el 22°, so the top surface projects as height.
  - Ireland (23 %) reads about 2-3x its neighbours, and World (1.5 %) about a quarter of Ireland. The picture
    contradicts caption 23, "15 times the world's 1.5 %".
  - Round 1 attacks this with zStretch, camTiltEl and hscale.
- **The grey field has no legend, major (caption).** At 77-83 s, 1.5 % lands against an unexplained texture: only
  "1 MARK = 1 TWh" is on stage. Draft a had the legend.
- **The ladder ruler label is stale, major (scope).** The tick stays a fixed screen length labelled "1 MARK = 1 QUERY,
  SAME SIZE, EVERY RUNG" while the marks shrink, from 36 s on (strip-07 cell 0, t 36.0; strip-08 cell 6, t 45.0).
  At 56 s it becomes "FIRST QUERY, TO SCALE" while the first query is a dot.
- **Digits on stage without their own claim, law (claims.json).** The per-rung readouts 24 Wh, 86 s, 240 Wh,
  14 min, 2.4 kWh, 2.4 h and 24 h (40-55 s) are correct arithmetic, but G5c passed them only by coincidence: 14 min
  matches bulbS 14, 24 h matches hoursDay, and 2.4 h matches dayWh.
- **Region colour arrives inside the regroup, minor (scope).** At 84-87 s (strip-15 cell 2, t 85) the colours appear
  while the cubes fly (T5), and the orbit pushes in to radius 0.3 while marks are in flight (R-E: re-partition x
  dolly, avoid). The shuffle reads as a jumble at 85 s.
- **The share readout plate covers the China stack, minor (scope).** At 95.8-98.4 s (strip-17 cells 0-4, t 96) the
  "45 % · 25 % · 15 %" plate covers the China stack, and three new numbers land in one readout (R3).
- **A number lands while the camera moves, minor (scope).** The tilt runs 104.5-109 s while 7,663 GWh and its caption
  land at 105 s (T1).
- **Caption collides with the terrain, minor.** At 105-112 s (strip-19 cell 1, t 108.5) the Ireland mesa's base and
  the cut line run through the caption "Cut at Ireland". Round 1's lower elevation and shallower cells should lift
  it clear; check in round 2.
- **MONDAY text sits on the terrain, minor (knob).** At 139-150 s "per grid?" sits on the Ireland mesa, and the honest
  plate overprints the mesa row.
- **Plan-view pins are incomplete, minor (scope).** At 99-104 s only 3 of 7 places are pinned (Netherlands, Germany,
  France), and they sit under the strip.

### 2. a, "the ledger"
Strengths:
- The best single frame of the film is a's: the Ireland slab at 108-120 s (strip-19/20), cut in salmon and towering
  over a low serrated row with World smallest at the back. 23 % and "15 times" read from the picture.
- The flat world field with its legend (strip-14, 78-81 s) is the most honest picture of 1.5 % (P10, land flat).
- The check line "187 + 104 + 62 + 62 = 415 TWh · SAME MARKS" at 96.6 s makes I2 visible. b has no check line.
- The honest line names the assumptions and "not independently verified" (strip-24/25, 139-150 s).

Faults:
- 8 counters tick on stage through values with no claim: 247 at 43 s, 4,043 at 47, 59,213 at 51, 7,279 at 59, and
  42 to 353 at 67-70 (G5c).
- The ruler plate "ONE SECOND OF MICROWAVE" sits on top of the crowd for the whole ladder (strip-07..10). It is
  occluded evidence and the same stale-scale fault as b.
- The per-query anchors never grow, so the crowd's energy is shown only at rung 10 and rung 10^5.
- The site-day is a hard swap to one tile plus a ticking counter (56-60 s), so the invariant is told, not seen.
- The caption sits over a light lavender grid at 66-76 s with low contrast, and the "TWh · DATA CENTRES, ALL KINDS"
  sub-label is lost in it (strip-13 cell 0, t 72).
- Moiré on the field mid-pull at 76 s.
- The tower pillars are thin (3 x 3 footprint), so the counts are pins on sticks.
- When the cut moves to the US (122 s) Ireland is cut away, so 4.4 % is never on one frame with 23 %.
- No denominator device.
- The hook frame at 0.0 s is blank.
- The terrain un-dims for one frame at 150.0 s before the card.
- s/frame is 1.02.

## Verdicts
- **b wins.** It carries the first half better than a (the anchor grows with the crowd), and it puts the film's
  thesis, the denominator, on stage as a running tag that MONDAY calls back. Its one major picture fault (the terrain
  understates Ireland) sits on documented knobs.
- **a is the runner-up.** It has the truest Ireland and world frames, but it carries more film.js faults (ticking
  counters, an occluding ruler plate, a hard tile swap, no denominator device) and costs a third more per frame.

## Winner
Draft b was copied unedited to factory/films/one-query/: film.json, film.js, claims.json, lib/ (which holds the build
script lib/assemble.py and film.src.js), build/ and gate.json.
- film.json already has `id: "one-query"` and `look {brand: ceti-boardwalk-dark, chrome: none, material: ink}`.
- The film.json eyebrow still reads "... · draft B (the denominator)". Strip it at ship (tier 2).

## Borrowed from a (knob or caption level only)
- a's legend for the grey field becomes b's caption 15: "Against the grey, all the world's electricity: 1.5 %."
- a's tall-Ireland proportions are approached through b's own knobs: zStretch 0.4 → 0.2, camTiltEl 22 → 14,
  hscale 110 → 150.
- a's check line and its "not independently verified" phrase need film.js or the honest text. See Beyond scope.

## Grammar audit of the winner (R-E T1-T8)
| item | status |
|---|---|
| Moves, start to start | push 8; ladder 34.6 (one keyed move); swap 55.4; cut 66; dolly 74; regroup 83; drift 88.6 (ambient, 0.8°/s); cut 99; tilt 104.5; swing 121. Every gap between real moves is ≥ 8 s; cuts are not moves |
| Holds ≥ 2.5 s on a new number | met everywhere except 7,663 GWh at 105 s, which lands mid-tilt and then holds 15 s still |
| Settle ≥ 1.5 s | met after the dolly and the regroup |
| Invariant visible | yes: nested dashed frames (56-65 s), "1 MARK = 1 TWh", "the same marks, sorted by region", and the count-in to 415 |
| Labels hard-cut on viewpoint change | pins off through the regroup (on at 88.4 s) and the tilt (pinsOn1 110) |
| Ease | inout throughout |
| Three movements of data | re-scale (ladder), re-partition (region), slice (section cut), plus a plan→elevation tilt |

## Round 1
findings.r1.json holds 7 findings: 0 block, 4 major, 3 minor. The dry run accepted 7 of 7.
- Majors: zStretch 0.2, camTiltEl 14, hscale 150, and caption 15.
- Minors: camSwingEl 14 (the US swing becomes azimuth only), dimA 0.8, and caption 27 ("One vendor's median text
  prompt. The anchors are assumed.").

Check in round 2:
1. Ireland towers over World, at about 5x on screen or better.
2. Ireland does not hide the Netherlands at el 14.
3. The Ireland top clears the 7,663 GWh readout plate.
4. The terrain base and the cut line leave the caption band at 105-112 s.
5. The MONDAY question and the honest line read clean on the heavier veil.

If the terrain still reads flat after round 1, the cause is the ridge geometry in film.js (item 5 below), not more
knob travel.

## Beyond scope (tier-2 revision, film.js / claims.json; ordered by what it buys a viewer)
Law, before ship:
- Add claims for the per-rung anchors on stage (40-55 s): rung energy n x gemWh (24 Wh, 240 Wh, 2.4 kWh) and rung
  microwave time n x microS (86 s, 14 min, 2.4 h, 24 h), each with its formula and the 1,000 W assumption. Today they
  pass G5c only by numeric coincidence.
- Record the count-in WARN at 67-70 s (G5c, 1 to 415 marks counted in) in NOTES.md.

Ordered by what it buys a viewer:
1. **Draw "about half of US demand growth"** (128-135 s, both drafts). It is the only part of the second half that is
   told and not shown. Add a small stack of 2025 US new demand beside the US mesa, half of it inked, landing after
   4.4 % on the held elevation view. This completes "large per grid" for a business viewer.
2. **Fix the stale ladder ruler** (36-60 s). Either scale the tick with the zoom and relabel it per rung ("1 MARK = 1
   QUERY" only at rung 10^0), or keep a fixed tick and relabel it with the rung's true span. Today the label
   contradicts the picture for 24 s.
3. **Land the 1.5 % flat with a legend on stage** (77-83 s). Use an ortho or plan pose for the world field (P10) and
   an on-stage "grey = the rest of the world's grid" (a's legend). A share read on a trapezoid lies by perspective.
4. **Show I2 for the regroup** (96-99 s). Add a's check line "187 + 104 + 62 + 62 = 415 TWh · same marks". Stagger the
   three shares as pins on their stacks (one new number per hold, R3) instead of one plate that covers the China
   stack.
5. **Make the terrain piecewise constant** (99-135 s). The mesas render with rounded shoulders. The brief's I4 says
   the height between two countries is not data. Use flat tops and vertical steps, so a section reads as a step
   profile and the ratio is read on the wall, not on a slope.
6. **Stage the regroup cleanly** (83-88 s). Assign region colour after the cubes land, not in flight (T5), and orbit
   at constant radius instead of a push to 0.3 while the marks fly.
7. **Settle before 7,663 GWh** (104.5-109 s). Stage tilt, then cut, then number (T7). Today the tilt and the cut band
   share a start and the readout lands mid-tilt.
8. **Pin all seven places with their years** in the plan view (99-104 s), above the strip, not under it.
9. **Honest line**: append Google's own caveat "not independently verified" (a had it) to the stage string and
   film.json honest.
10. **MONDAY callback** to the hook's single lit mark (the film opens on one query and never returns to it).
11. **Ship hygiene.** Remove the eyebrow's draft suffix. Fix the phone 390 overflow (scrollWidth 604/390, kit or page
    level, both drafts).
