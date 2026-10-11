# WOW-SCORE · pass-every-time · cut A vs cut B · lane B7 (judge) · 2026-10-11

Rubric: factory/research/WOW-MOTION.md section 9 (22 properties, 0/1/2, bar 38/44 with no starred zero).
Judged blind from frames, the two 1080p MP4s, film.json (both) and gate.json (B). I read no REVISION, NOTES, SELECT or film.js.
- Cut A: scratchpad/wow-before/{film.json, frames/, pass-every-time-1080p.mp4} (material ink).
- Cut B: factory/films/pass-every-time/{film.json, frames/, gate.json, export-wow/pass-every-time-wow-1080p.mp4} (material hero).

## Method (how each number was got)
- Both MP4s decoded at 30 fps to 320x180 grey. Per-frame motion = mean |frame(i+1)-frame(i)|, and "visible motion" =
  share of pixels changing by more than 12/255 ≥ 0.2 % (the rubric's pixel-diff threshold).
- B carries grain that re-seeds every 2nd frame (15 fps). Every odd frame pair is grain plus motion, so B's motion signal
  uses only the even pairs, where the grain does not change (median diff 0.14 there against 1.86 on the odd pairs).
- Position traces: the centroid and edges of a gold-pixel mask (R>110, R-B>45) on 480x270 colour windows around each
  move. Overshoot = largest swing past the final value as a share of the travel. Anticipation = largest counter-move
  before the start, as a share of the travel.
- Settle = from the first frame within 2 % of the final value to the last frame of visible motion.
- Text entrances: single-frame crops at full resolution (1 frame = 0.033 s).
- Luminance: full-resolution PNGs at 5, 30, 55, 76, 122 and 145 s. Grain: the temporal σ of 40x40 flat patches over 12
  frames from 55.0 s, with drift removed by differencing pairs.
- Cut list: single-frame spikes in the diff signal.

## Scores

| # | property | A | B | evidence (film seconds, frames at 30 fps) |
|---|---|---|---|---|
| P1 ★ | hero easing not linear / plain in-out | 0 | 1 | **A:** symmetric bell velocity on every hero move. M1 (40-47 s) rises linearly from 40.2 s to a peak at 43.7 s, then falls to 47.0 s. M2 (60.4-65.4 s) is a flat-topped in-out. Both read as plain in-out. **B:** every hero move has an asymmetric attack (peak velocity at this share of the move): M1a orbit 0.04 (peak on frame 1 at 40.03 s), pull-back 0.26, M2 0.34, M3 0.22, M4 0.30, book camera 0.12. These are expo-out or spring. Not a 2: M1a and the pull-back start at full speed on frame 1, a step in velocity with no ease-in. |
| P2 ★ | settle 98 % → last motion, 0.4-0.8 s | 1 | **0** | **A:** M1 0.57 s (46.43→47.00), M2 0.63 s (64.73→65.37), M3 0.43 s (75.07→75.50), bookend 0.43 s. The long tails come from slow in-out curves, not springs, but they meet the bar as written. **B:** most hero moves stop dead. M1a 0.20 s (40.60→40.80), M3 plane about 0.1-0.17 s (71.57→71.73), M4 positions settle by 112.63 s (the later motion at 113.5 s is the ghost dim, not travel), book camera 0.20 s. Only M2 (0.83 s, 60.63→61.47) and the pull-back (0.47 s, 10.87→11.33) clear 0.4 s: 2 of 6. |
| P3 | overshoot 0.5-4 % objects, 0 on text | 0 | 1 | **A:** 0.1 % on M2 (centroid 225.7→169.8 px), 0 % on M1. No overshoot anywhere. **B:** M2 centroid 223.7→164.6 at 60.77 s, settling to 167.0 by 61.1 s: 4.5 % over a 56.8 px travel, one cycle. That is 0.5 points over the 4 % ceiling, inside the error of a mask centroid. Masked text rises show no overshoot. |
| P4 | anticipation on ≥ 50 % of hero moves | 0 | 1 | **A:** none (M2 counter-move 0.6 % on a single frame, which is noise). **B:** M2 counter-move +1.7 px (3-4.6 % of travel) over 4 frames at 60.10-60.20 s. A pre-roll is also visible 0.23-0.27 s before M3, M4 and the minute column. Amplitude is at or over the 3 % top of the bar. |
| P5 | follow-through, secondary lags 2-4 f on ≥ 80 % | 0 | 0 | **A:** the shadowless cubes have no secondary parts. **B:** on M3 the dimming trails the plane by about 4 frames (dim visible at 70.77 s, plane up at 70.63 s; film.json says 0.12 s). On M4 the ghost dim comes about 1 s after the landing (113.5 s against 112.6 s), far beyond 2-4 frames. On M1b and M2 nothing lags: the contact shadows move rigidly with the cubes. Under 80 %. |
| P6 | stagger 2-3 f chrome / 4-8 f text, wave ≤ 0.8 s | 0 | 1 | **A:** the Monday block fades in as one piece (139.7-140.0 s) and callouts pop, so there is no stagger. **B:** Monday lines rise one after another, five lines from 139.6 to 140.1 s: about 3 frames (0.10 s) per line, total 0.5 s. That is inside the sourced 70-270 ms but at the short end. On the ladder the count line leads its ratio by 1.0 s. |
| P7 ★ | one hero at a time (≥ 90 % of moving frames) | 0 | 1 | **A:** the camera orbit and the 460-cube restack run together through 40-47 s (7 s). The camera rise and cube return run together through 135.4-139.4 s (4 s). That is about 11 s of about 43 s of moving frames (28 % of 4,500 frames move): about 74 %. **B:** M1 is split into the camera move (40.0-40.8 s) and the restack (42.0-43.6 s). The bookend is split into the cubes (135.5-137.0 s) and the camera (137.5-138.3 s). The only overlaps are count-in digits ticking during arrivals (a small area) and the 0.3 s wipe over the sheet filling at 99.7-100.0 s. |
| P8 | ≥ 70 % joins object-carried; ≤ 1 hard cut / 20 s | 0 | 0 | **A:** 3 joins, all hard cuts: 100.00 s (frame 3000, diff 11.7), 121.00 s (frame 3630, 22.2), 135.00 s (frame 4050, 16.2). 0 % carried. **B:** 4 joins. One is carried: the hook tile shrinks into the plan at 10.5-11.3 s. Two are gold light-band wipes, left to right over about 0.3 s, at 99.77-100.03 s and 120.27-120.60 s. These carry no anchor. One is a hard cut at 135.00 s (frame 4050, 15.1). 25 % carried. |
| P9 | speed ramp ≥ 4x easing to x1 | 0 | 0 | **A:** the 289 column fills at a constant stagger (126.6-129.4 s). **B:** the top of the 289 column moves 193→42 px (480 w) from 125.6 to 127.7 s. Speed is about 83 px/s until 127.0 s, then 62, then 33 px/s into the stop. That is a 2.5x ramp, under 4x. |
| P10 ★ | text masked / staggered / blurred, never pops | 0 | 1 | **A:** pops. "44 of 115" goes from absent at 76.95 s to full at 76.98 s (one frame). "44 … pass all four tries" pops at 67.98 s. The 115 label and its leader appear together in one frame at 20.98 s. Stage type fades over 6-10 frames (82.6, 83.4, 91.4 s), which is not on the allowed list. **B:** every non-caption entrance checked is a masked rise. "All four lit" rises over 2 frames (46.45 half, 46.52 s full). "60.4 %" rises over 3 frames (78.03-78.10 s), the "ONE TRY · 278 OF 460" line over 3 frames (77.03-77.10 s), "under 25 %" over 3-4 frames (89.53-89.60 s), the hook over about 4 frames (1.10-1.33 s), and the Monday lines over 3 frames each. Not a 2: 2-3 frame rises are at the limit of reading as pops. |
| P11 | ≥ 40 % gaps ≤ 0.3 s and ≥ 15 % ≥ 1.2 s | 0 | 0 | **A:** 63 gaps between motion runs. 29 % are ≤ 0.3 s and 43 % are ≥ 1.2 s (median 0.73 s). **B:** 83 gaps. 30 % are ≤ 0.3 s and 40 % are ≥ 1.2 s (median 0.77 s). In both, the silences pass and the dense runs are too sparse. |
| P12 | ≥ 80 % starts on the beat grid ±2 f | 0 | 1 | **A:** film.json has no beat. On a 0.5 s grid, 44 of 98 time knobs and caption starts land within 2 frames (45 %), and only 8 of 30 captions do. **B:** beat 0.5 s. Source share 109 of 111 (98 %), gate G12 100 %, captions 29 of 29. Not a 2: half the visible move onsets in the strip are 7-8 frames off-grid (70.23, 99.73, 111.27, 120.23, 125.23 s) because of the pre-rolls. |
| P13 | ≥ 3 shot scales per minute, no scale 3 beats running | 0 | 0 | **A:** 0-60 s is medium only (the field plan and side view, the subject at 0.4-0.5 of frame height). **B:** 0-60 s has macro (hook tile, 0-10.5 s), wide (one tile, 10.9-12 s) and medium (the field). But 60-120 s is medium only (side field, then the PR sheet at about 0.3 height), and the medium scale runs from CASE through COUNT for more than 3 beats. |
| P14 | number arrival: tabular, last 10 % ≥ 40 % of time, weight beat, real values | 0 | 0 | **A:** every number pops, with no count-in. **B:** the tile count-in reads 35 (13.1 s), 89 (14.5), 104 (15.2) and 115 (16.0). The last 10 % (104→115) takes 0.8 s of the 3.0 s count: 27 %, under 40 %. Same-length values keep a steady width (102/104/106), but the final 115 gets no weight or scale emphasis. The interim values are real counts of landed marks, but none is in claims.json (gate G5c WARN). |
| P15 | labels: dot + draw-on leader ≥ 6 f, label after | 0 | 1 | **A:** leader and label pop together in one frame (20.98 s). **B:** the 115 callout shows a dot at 12.53 s, the leader draws from 12.70 to about 12.90 s (6 frames), and the label arrives about 13.0 s. "All four lit": leader at 46.40 s, label 46.45 s. The 22 leader takes about 0.37 s to retract at 70.0-70.37 s, about 0.7x the entrance. |
| P16 | ≥ 4 surface steps, text ≤ 96 %, darkest ≥ 2 %, shadow or rim on every card | 0 | 0 | **A:** 2-5 grey-histogram bins hold more than 2 % of pixels each, flat fills, darkest pixel 3.0-3.9 % (1.0 % at 122 s), hook text peaks at 244/255, Monday text at 255, no shadows. **B:** 6-12 bins above 2 % (light pool, plate, vignette): steps pass. But text peaks at 254-255 (100 %, hook and Monday), and the floor crushes to 0/255 on 0.04-0.10 % of pixels (the grain tail; the 0.1st percentile is 9-12/255). |
| P17 | two-layer shadow + rim at 8-16 % | 0 | 0 | **A:** no shadow, no rim (crop at 137.0 s). **B:** one soft contact shadow under the cubes (macro crop at 5.0 s; floor shadows in the side view at 45-59 s). There is no second, ambient layer, and the edge lift is faint, well under 8 % white. |
| P18 | grain σ 1-3 % changing per frame; no banding | 0 | 1 | **A:** σ 0.01 % (flat patch, 55 s); there is no gradient to band. **B:** σ 1.2-2.0 % across six background patches. It changes on every 2nd frame (15 fps), not every frame. No bands are visible in the dark ramp. |
| P19 ★ | effects restraint | 1 | 1 | **A:** no effects. **B:** bloom gain 0.10 (lookBloom; the bar is ≤ 0.35), threshold 1.0, so only the glowing all-four columns bloom (72-98 s). No depth-of-field rack and no chroma fringe seen. The gold wipe band runs twice, once per join. Level is manager, so the exec rule does not apply. |
| P20 | fov 18-35°, ambient drift 1-2 % on holds (data film: parallax not required) | 0 | 1 | Both fov 28°. **A:** constant 1° yaw. Over the 47-59 s hold the field centroid moves 1.5 px of 320 (0.5 %): under the bar. **B:** dolly drift on holds only. Field width breathes 171→176→171 px of 320 over 47-59 s (about ±1.5 %), and it is still (zero diff) through camera settles. |
| P21 | blur on moves > 300 px/s (N ≥ 4), ghosts ≤ 1.5 px | 0 | 1 | **A:** no blur in any frame. The bookend (137.0 s crop) and the M2 columns render crisp while crossing half the field. **B:** continuous streak blur on the hook drop (0.17 s), the pull-back (10.53 s), M2 (60.27-60.53 s) and M4 (111.97 s full-res crop), with no discrete ghost steps visible at 1080. The sub-frame count N cannot be checked from frames. |
| P22 | a visual beat per hero landing; captions hold ≥ 1.3 s + 0.06 s/char | 0 | 1 | **A:** 15 of 30 captions are too short (for example 34.0 s holds 2.4 s against 3.28 s needed, 85.6 s holds 2.4 s against 3.82 s). There are no impact beats. **B:** 29 of 29 captions hold long enough (film.json, G12). There are ring pulses at 1.07 s (hook tile), 43.53 s (M1b), about 128 s (column top) and about 137 s (bookend), and an edge flash at 71.57 s (M3). None sits over a number. |

## Totals
| | A | B |
|---|---|---|
| total / 44 | **2** | **13** |
| share | 5 % | 30 % |
| starred zeros | P1, P7, P10 | **P2** |

## Verdict
Cut B does not reach the product-demo bar. It scores 13 of 44 against the 38 needed, and it has a starred zero (P2, settle).
B is clearly the better film: 11 more points than A, and it clears three of A's four starred failures (easing, one hero
at a time, text entrance). But it is a "decent", not a "WOW". No five fixes close a 25-point gap. The five below are the
cheapest large moves, in order of how much they move the score (the starred zero first):

1. **P2 settle (★, 0→1).** Give every hero landing a real tail. Replace the 0.8 s expo-out on the M1a orbit, the M3
   plane and the bookend camera with a critically damped spring (ζ 0.75-0.85, settle 0.5 s). Or lengthen the expo-out so
   the last 2 % of travel takes 0.4-0.6 s: for the orbit, 40.0→41.4 s instead of 40.0→40.8 s. Re-measure on the even
   frame pairs.
2. **P14 number arrival (0→1).** Re-curve the count-ins so the last 10 % takes at least 40 % of the time. For example,
   on the tile count (13.0-16.0 s), 104→115 should take at least 1.2 s, not 0.8 s. Add a weight or scale beat on the
   final digit, and set tabular lining figures. Then register or suppress the interim digits (G5c lists 10, including
   "26 min" at 122 s).
3. **P16 luminance ladder (0→1).** Cap all type at 245/255 (96 %), including the hook display and the Monday column.
   Clamp the graded floor at ≥ 5/255 after grain so no pixel crushes to 0.
4. **P17 shadow and rim (0→1).** Add an ambient shadow layer: radius about 4x the contact shadow, alpha about 0.10-0.15,
   under the existing tight one. Raise the rim until edges lift 8-16 % white (about 2x the current lift).
5. **P8 object-carried joins (0→1).** Replace the two wipes and the 135 s hard cut with carried anchors. At 100 s, the
   44 all-four columns collapse into the first row of the PR sheet at the same screen position. At 120.5 s, the
   not-merged block shrinks into the 27-min column. At 135 s, the 289 column folds back into the field. Cut on
   non-zero velocity.

After these, the next to work on: P13 (put a macro shot in 60-120 s, for example on one all-four column at 64.5 s and on
the not-merged row at 115.5 s), P11 (cluster moves into runs with gaps ≤ 0.3 s, separated by ≥ 1.2 s silences), P9 (a
4x ramp on the 289 column) and P5 (shadows and glow trailing 2-4 frames).

## Regressions: where B reads worse than A
- **Settle (P2).** A's slow in-out moves had 0.43-0.63 s tails, which met the bar. B's camera moves stop in 0.10-0.20 s
  (M1a lands at 40.80 s, M3 at about 71.7 s). Read frame by frame, B's landings feel abrupt where A's floated.
- **Followability.** B squeezes the M2 re-sort from about 5 s (A: 60.4-65.4 s) into about 0.8 s (60.1-60.9 s), under
  heavy blur. The mid-move frames at 60.27-60.53 s are an unreadable smear, so no column can be tracked. M4 has the same
  problem as a 1 s scatter (111.6-112.6 s). A's slow moves let a viewer follow a mark. Check this against the
  tracked-mark rule in R-E before more compression.
- **Digits.** The count-ins show 10 on-screen numbers that are not claims (G5c WARN). "26 min" at 122 s sits one second
  before the claim "27 min", and a viewer may read it as a claim. A showed only claim values.
- **Text and floor.** Type peaks at 255/255 (A's hook peaked at 244). Grain pushes 0.04-0.10 % of pixels to pure black
  (A's floor was 3 %).
- **Grain cadence.** The grain re-seeds at 15 fps, so it shimmers on alternate frames and every second frame difference
  carries noise (median 1.86 against 0.14). That costs encoder bitrate and may read as flicker on large flat areas.
- **Caption content.** The unit sentence "One cube, one minute." left the captions at 125 s. Only the top-left chrome
  legend now carries the unit.
- **Unchanged.** The hard cut at 135.00 s is still in B (frame 4050), as in A.
