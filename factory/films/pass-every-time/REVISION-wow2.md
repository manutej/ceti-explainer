# pass-every-time · Wave WOW re-cut, round 2 (lane B6b) · 2026-10-11

Re-cut director: Opus, lane B6b. Work list: the blind judge's score of the B6 cut (factory/research/WOW-SCORE-pass-every-time.md:
13 of 44, starred zero P2, four regressions) and the nine items of the brief, in its order. Rubric: WOW-MOTION section 9.
Laws kept: one clock, render(t) pure, seeds fixed; counts before ratios (count.at 12.5, first ratio 35.0); every digit a claim
(G5c now PASS: the count-in tenths are claims); silent with captions; one honest line; the CETI card last; manager level (exec untouched).

Edited: lib/film.src.js (camera, arrivals, shader, shadows, plane, joins; film.js re-assembled), film.json IN PLACE by the new
lib/revise_wow2.py (idempotent; runs after revise_wow.py), claims.json (+4 count-in claims, added by the same script),
brand.midnight-ink.json (ink #EDE6D3 -> #DED7C5, see item 4). The rig file and the arsenal patterns are untouched.
Build: `python3 lib/revise_wow2.py && python3 lib/assemble.py && python3 factory/kit2/build.py factory/films/pass-every-time --chrome none`
-> build/pass-every-time.midnight-ink.none.hero.html (1,299,575 B).
Measured like the judge: export windows at 1080p (page accumulation, shutter 0.35, samples auto), decoded by ffmpeg to 320x180 grey;
visible motion = share of pixels changing by > 12/255 >= 0.2 %, on the grain-free even frame pairs (the grain re-seeds at 15 Hz).

## The nine items (film seconds are the new ones)
1. **P2 settle.** Every camera and plane landing is a closed-form spring (z 0.72, w 9 per move, 1.6 s, overshoot 3.9 %; the u^3 taper
   ends it exactly). The spring alone did not read: under accumulated anti-aliasing a 2.5-3.9 % overshoot is below the 12/255 threshold
   at 320x180 (measured: M1a still at 40.73 s, 98 % at 40.56 s: 0.17 s). So each camera landing also carries a damped 1.6 deg yaw sway
   about the aim point, starting at 30 % of the move and ending at rest with it (`camSway`, `swayU`). Measured on M1a (40.0-41.6):
   98 % at 40.57 s, last visible pair 41.07 s: settle 0.50 s. Marks: M2 98 % about 60.9, last visible 61.67 (0.7 s); the plane
   (71.5-72.7) lands at 71.93 with the dimming 3 frames behind it and the glow easing in over 1 s (visible to 72.93). M4 and the bookend
   use a slower spring (`sprW4` 8). The landing beats (ring, flash, nudge) moved from the end of each spring window to its visual landing
   (`landU` 0.45). Whole film on the delivered MP4: 12 of 16 landings settle visibly for >= 0.4 s; the pull-back, the push, the wide
   pull-out and the 27-minute pull-out do not (a distance change of a small subject: the sway reads only on large subjects).
2. **Re-sort regression.** M2 is 1.6 s (60.0-61.6), one clock for all 115 columns (no stagger: R-E T5), a softer spring (`sprW2` 8, main
   travel spread over 60.2-60.9 instead of 0.3 s) and a narrower shutter during the move (`m2Shutter` 0.4 of 0.35 -> 0.14 frame):
   the 8-frame strip shows every column crisp mid-move (revision/wow2-before-after.jpg, row M2).
3. **P14 and the law.** Count-ins land their marks in tenths: batch b at the power-out time POI((b+1)/10) of the window, so the
   counter only ever shows a landed count, and every value it can show is a claim (claims.json countTiles 1-115, countTries 4-460,
   countLit 3-278, countPrs 0-296, each a list with its formula; G5c PASS, was WARN with 10 strays). Tiles 12.5-17.0: 104 at 15.3, 115 at
   17.0, so the last tenth takes 1.7 of 3.95 s (43 %); the same rule on 460, 278, 296. The weight beat on the final number is 2x the
   text-reveal stroke for 0.5 s (`numWt`, `numPulse`), also on every land(). The 27-minute callout lands with the pulse (no roll: "26 min"
   is gone). No ratio rolls.
4. **P16.** Text: the brand ink was 237/255 in the PNG but the H.264 decode overshot to 254-255 at glyph edges; ink is now #DED7C5
   (PNG max 222, decoded MP4 luma max 92 % at the judge's six times). Floor: a MAX-blended flat quad after the grade (`floorLum` 12/255) so no pixel crushes;
   decoded MP4 grey 0.1st percentile 12-17/255, isolated pixels below 5 in 0.00017 % of all pixels (judge: 0.04-0.10 % at 0). The
   delivery encode has a 0.7 px pre-blur: without it 1.5 Mbps H.264 rang to 255 / 0 at glyph edges (see Cost). Grain sigma 1.2 % (`lookGrain` 0.012, measured 1.0-1.4 % in the delivered MP4), re-seeded per frame index at
   15 Hz (`grainFps`).
5. **P17 and P5.** Two-layer shadow: the tight planar key shadow (0.42) plus a soft ambient disc cast by every tile plate and every PR / minute cube
   (radius 3.5x a tile's half width, 4.9x a cube's; strength 0.18; MIN-blended so overlaps never stack); both are drawn from 0.1 s earlier (`shLag`), so they trail the body by 3 frames and
   settle after it. Rim 0.10 (was 0.05). The dimming trails the plane by 0.1 s (`dimLag`); the ghost dim of M4 starts 0.1 s after its
   visual landing (113.1). Leaders: labels stay off during every move, so there is no moving leader to lag (left).
6. **P8.** No wipe and no hard cut left (film.json `cuts: []`). The PR sheet and the minute floor share the floor with the field (z 1400,
   out of every tau view), and each join is one camera travel (spring, eye lifted 220 in the middle): 99.0-100.8 to the PR sheet, CARRYING
   the cut plane, which rides from the all-four bar to frame the empty sheet and fades as it fills; 119.5-121.1 to the 27-minute column,
   CARRYING its first minute cube, which rises out of the PR sheet and lands first in the column; 136.5-138.1 back to the field, CARRYING the
   plane from the minute floor to the all-four bar again (it fades as the cubes go home). The hook pull-back (10.5) still carries the tile.
   4 of 4 joins carried, 0 hard cuts.
7. **P13.** Eleven camera moves between nine poses. Minute 1: macro (hook) -> wide plan (the field under 0.2 of the frame, 12.1-18.5) ->
   medium plan -> medium side. Minute 2: medium (M2) -> macro on the 44 full columns (64.1-67.5) -> medium (22, the cut) -> wide side (the
   ladder and the paper plate, 79.1-99) -> medium PR sheet. Minute 3: macro on the 27-minute column (121.1-126.5) -> wide minute floor ->
   wide side (return) -> medium plan (Monday). Every minute has three scales, a macro and a wide; no scale holds three shots running.
8. **P9.** The 289 column (128.5-131.5) is a speed ramp with a true x1 end: rate x8 for 45 % of the time, eases to x1 by 68 %, x1 to the
   top (73 % of the column in the first 1.35 s, the last 6.5 % in the last 0.96 s); each cube's drop slows with it. MP4: the column top climbs at about 80-120 px/s (480 wide) to 130.2 s, then about 19 px/s to the top: 4-6x.
9. **P11.** Count-ins land in tenths (dense runs of short gaps), every move chains into its callout or count (camera still -> label within
   0.4 s), and the holds are silent. Whole film (export, judge metric): 130 gaps, 50 % <= 0.3 s, 22 % >= 1.2 s (bar 40 % / 15 %).

## Gate (full) · VERDICT PASS
- GATE pass-every-time pass-every-time.midnight-ink.none.hero.html (film dir factory/films/pass-every-time)
- G1 load PASS film errors 0; live errors 0; charset utf-8; ready 4827 ms; stage sd 30.6s:31.7 76.5s:46.6 122.4s:38.6
- G2a purity · canvas PASS 1 canvas; re-seek at 15.3, 45.9, 76.5, 107.1, 137.7 identical; order A→B = B→A (2 pairs)
- G2b purity · SVG PASS 1 svg; re-seek identical; order identical (2 pairs)
- G3 clock scan PASS clean: film.js, pattern.js, text-reveal.js
- G4a format · duration PASS total 153 s; material 150 s (want 140–180, format feature-long) + brand 3 s; total ≤ 183
- G4b format · beats PASS order HOOK → CASE → COUNT → MONDAY; t0 H0 C12 C60 M136.5
- G4c format · commit time PASS commit disabled (D11): no commit box, no hold, no film-mode default; page info.commit {"enabled":false}
- G4d format · brand card PASS takeaway "A pass is not a pass every time."; frame at 152 s sd 22.3; takeaway text visible in SVG
- G4e format · honest line PASS "One 2024 model, and agents that could not revise: newer ones may do better."
- G4f format · sources PASS 7 sources (want ≥ 3)
- G5a claims · formulas PASS 30 claims, 23 with formula, 23 recompute
- G5b claims · caption digits PASS every number in 29 captions is a claim value or render
- G5c claims · on-screen digits PASS every visible SVG number is a claim value
- G6 legibility PASS 7 must-read / 17 secondary / 12 chrome text reads at 6 times (data-role); phone 390: stage 358px (1 unit = 0.37 px), scrollWidth 400/390 OVERFLOW, shot (scratch)/phone-390.png
- G7 counts first PASS count at 12.5 s (count.at); first ratio "Tries that pass: 60.4 %." at 35 s (caption); commit disabled (D11): no seal, counts-before-ratios only
- G8 size PASS film code 115.1 KB (film.js 73.3, film.json 27.6, claims.json 14.3) < 120 KB; page 1.300 MB < 1.3 MB
- G9 tics PASS 0 full-screen card(s) (0 chapters with card:true; want ≤ 2); no countdown ring
- G10 axes PASS brand midnight-ink, chrome none, material hero, texture paper; level manager; via window.__film.info.axes
- G11 text overlap PASS 307 samples every 0.5 s, 95 distinct texts (texts with data-role), caption showing at 214; no overlap, no text off the stage, nothing across the caption band. Canvas-drawn text (p5 / WEBGL) is not visible to this row.
- G12 rhythm PASS beat 0.5 s (15 frames; +-2 frames): 53/53 starts on the grid = 100 % (captions 29/29, moves 24/24; want >= 80 %); captions holding >= 1.3 s + 0.06 s/char: 29/29; dead holds > 8 s: 0. WARN-only (D16); the moves counted are in data.moves.

## Rubric self-score (WOW-MOTION section 9; judge's B6 score in brackets)
| # | property | judge B6 | self | evidence (film seconds; measured on the delivered MP4 where it says so) |
|---|---|---|---|---|
| P1 ★ | easing | 1 | 1 | springs (camera, plane, marks) and anticipation on marks; no cubic or linear hero move |
| P2 ★ | settle | 0 | 1 | MP4, judge metric: 98 % -> last visible pair >= 0.4 s on 12 of 16 landings (M1a 0.50, in44 0.79, out44 0.66, trav2 0.86, trav3 0.73, M1b 0.82, M2 0.89, plane 0.40, M4 0.92, bookend 0.45; trav1 and bookCam run into the next motion); fails: pull 0.06, push 0.06, wide 0.13, out27 0 (distance changes of a small subject) |
| P3 | overshoot | 1 | 1 | camera and plane 3.9 %, marks 3.84 %, one cycle; 0 on text and numbers |
| P4 | anticipation | 1 | 1 | 2 % counter-move over 4-5 frames on M1b, M2, M4 (unchanged) |
| P5 | follow-through | 0 | 1 | both shadow layers drawn 0.1 s (3 frames) behind every mark; dimming 0.1 s behind the plane; M4 ghost 0.1 s after its landing; glow eases in over 1 s after the plane. No moving leader (labels off in moves) |
| P6 | stagger | 1 | 1 | text waves 3 frames a line; M2 (tracked) has none |
| P7 ★ | one hero | 1 | 1 | camera OR marks; the carried plane / cube ride their travel; count-ins start after landings |
| P8 | carried joins | 0 | 1 | 4 of 4 joins carried (hook tile, plane, minute cube, plane), 0 hard cuts (was 2 wipes + 1 cut); the plane does not hold one screen position mid-travel |
| P9 | speed ramp | 0 | 1 | 289 column: x8 -> x1 by design; MP4 top-of-column speed about 80-120 px/s (480 w) in 128.5-130.2 against about 19 px/s in 130.2-131.0: 4-6x |
| P10 ★ | text entrance | 1 | 1 | unchanged (masked rises) |
| P11 | rhythm | 0 | 1 | MP4, judge metric, whole film: 130 gaps, 50 % <= 0.3 s, 22 % >= 1.2 s (bar 40 / 15) |
| P12 | beat grid | 1 | 1 | G12 53/53 starts on the 0.5 s grid |
| P13 | shot scale | 0 | 1 | macro / wide / medium in every minute (poses, item 7); designed, not measured frame by frame |
| P14 | number arrival | 0 | 1 | tabular, tenths, last tenth 43 % of the count, 2x weight beat for 0.5 s, every shown value a claim (G5c PASS) |
| P15 | leaders | 1 | 1 | unchanged |
| P16 | ladder | 0 | 1 | MP4 at 5/30/55/76/122/145 s: luma max 92.1 / 86.6 / 89.1 / 90.7 / 89.5 / 89.9 %, grey 0.1st percentile 12-17; isolated ringing pixels < 5/255 remain (0.00017 % of all pixels; judge saw 0.04-0.10 %) |
| P17 | shadow + rim | 0 | 1 | tight planar + soft ambient (MIN), rim 0.10 (2x); rim lift not re-measured |
| P18 | grain | 1 | 1 | MP4 sigma 1.0-1.4 % (2-frame pairs, 55 s), 15 Hz; no bands |
| P19 ★ | restraint | 1 | 1 | bloom 0.1 on the glowing columns only; no DoF, no chroma |
| P20 | lens + drift | 1 | 1 | fov 28; drift on holds only |
| P21 | blur | 1 | 1 | page accumulation 4/8/16 sub-frames (mean 6.75 in 0-77 s); M2 shutter narrowed on purpose |
| P22 | silent beats | 1 | 1 | rings at the visual landings now (landU), 29/29 captions hold |
Self-score 22 of 44 (judge's B6: 13), no starred zero. Not 38: no property is clearly at 2, and P2 still fails on four moves.

## Left, and why
- P2: the camera settle is a designed sway, not a pure spring overshoot; the spring alone (<= 4 % overshoot, the P3 ceiling) does not read
  under accumulated AA. A judge measuring position (not pixels) will see a 3.9 % overshoot on the camera.
- P5: leaders never move while attached (labels are off during moves), so "leaders lag" is not exercised; shadows, dimming and ghost lag.
- P13 is designed from the poses (subject heights from the stills), not measured frame by frame.
- The trav1 plane passes close to the camera at mid-travel (it fills the frame for about 0.3 s).
- The wide plan (12.1-18.5) shows the tiles small and dark; the counts read from the callout, the marks only as a texture.
- G6 phone 390 overflow is kit2's shell (unchanged). Page budget: 1,299,575 B of 1,300,000 (film.json knob docs trimmed to one clause).

## Cost
Export (arsenal/tools/export.mjs, page mode, --viewport 1920x1080 --dsf 1: 1080p directly, shutter 0.35, samples auto, no cuts, 3 shards, two
windows 0-77 / 77-153, PNGs dropped after each window): 0-77 s 12.9 s/frame per shard (mean 6.75 sub-frames; the full gate and the strip
ran beside it), 77-153 s 7.9 s/frame; 4.6 h wall; determinism IDENTICAL on every verified frame, 0 errors. A first run was stopped at frame
900: the ambient layer drew a 10x disc from every face of every cube (4x the frame cost); it is now cast by the tile plates and top faces only
(+10 %). Master export-wow/wow2/master-crf14.mp4 (302 MB, 4590 frames). Delivery export-wow/pass-every-time-wow2-1080p.mp4: two-pass
1.5 Mbps x264 (slow, aq-mode 3, psy-rd 0, bt709 tv), 28.4 MB, 4590 frames, with a 0.7 px Gaussian pre-blur: at this bitrate the grain
starves the glyph edges and H.264 rings to 255 / 0 there (decoded max 255 without it, 243 with it; grain kept). Strip: frames/ (307 at 0.5 s,
shutter 0.35, 8 samples), 10.4 s/frame, purity identical, 0 errors. Before/after: revision/wow2-before-after.jpg (12 pairs, 239 KB).
