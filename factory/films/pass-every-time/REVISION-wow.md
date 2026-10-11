# pass-every-time · Wave WOW re-cut (lane B6) · 2026-10-11

Re-cut director: Opus, lane B6 of factory/WAVE-WOW.md. Work list: factory/research/WOW-GAP-AUDIT.md (gaps 1-9); rubric:
factory/research/WOW-MOTION.md section 9. The story, claims (claims.json untouched), chapter windows (HOOK 0-12, CASE 12-60,
COUNT 60-135, MONDAY 135-150), the honest line and the CETI card are unchanged. Every digit is still a claim value, or a
running count of marks on screen (the count-ins); counts before ratios; silent with captions; commit off (D11).

Edited: lib/film.src.js (rewritten render path; film.js re-assembled by lib/assemble.py, which now also comment-strips the film
part for the page budget), lib/gl-camera-rig.js (re-copied verbatim from arsenal/patterns/gl-camera-rig/pattern.js: the B1
motion tokens as `rig.curves`), film.json edited IN PLACE by the new lib/revise_wow.py (idempotent: knobs, knobs_doc, captions,
`beat`, `cuts`, `libs`, `look.material`, `count.at`).
Build: `python3 lib/revise_wow.py && python3 lib/assemble.py && python3 factory/kit2/build.py factory/films/pass-every-time --chrome none`
(film.json `look` now says material `hero`; brand from the film-local brand.midnight-ink.json) →
build/pass-every-time.midnight-ink.none.hero.html. The previous ink page (…none.html) is left in build/ for the catalogue diff.
Before/after: revision/wow-before-after.jpg (9 pairs; "before" = the tier-2 ship strip).

## Gate (full, not --quick) · VERDICT PASS
Run 1: FAIL on G11 only (15 FAIL / 22 WARN): (a) a callout's number rose from below into its own sub-line mid-entrance (G11 reads
getBBox, the mask is invisible to it); (b) the rig's generic eye drift rolled the near top-down plan views (el 89: the up vector is
almost the view axis) by several degrees, pushing the PR callout off the stage and under the header. Fix round 1: the number now
drops in from above its slot while the sub rises from below (they never cross); the drift is the film's own hold-only dolly + yaw
about the aim point. Run 2: PASS G1-G12. G11: 307 samples, 97 texts, no overlap, nothing off the stage or across the caption band.
G12: 46/46 starts on the 0.5 s grid (captions 29/29, moves 17/17), 29/29 captions hold >= 1.3 s + 0.06 s/char, 0 dead holds.
G5c WARN (10 numbers "not in claims"): the running values of the count-ins (30, 73, 101, 130, 313, 421 …), each a count of marks
landed (text-reveal card, kit2 README defect 7). G8: film code 109.9 KB < 120; page 1,295,920 B < 1.3 MB. G1 ready 1,635 ms.
Frames: frames/ (307 at 0.5 s, shutter 0.35, 8 samples, page-mode accumulation), purity identical, 0 errors, 5.67 s/frame
(with the export running on the other 3 cores).

## The work list, in order (film seconds are the new ones)
1. **Hero moves on tokens, 1.0-1.5 s, holds after landing.** Every hero move is now a closed-form token, evaluated in the vertex
   shader for marks (GLSL copies of spring-hero z .72 w 11, spring-snappy, expo-out) and by the rig for the camera:
   pull-back 10.5-12.0 (expo-out), M1a orbit plan→side 40.0-41.5 (expo-out), M1b re-stack 42.0-43.5 (spring + 2 % anticipation,
   stagger 0.25), M2 sort 60.0-61.5 (spring + anticipation, lifted arc), M3 plane 70.5-71.5 (expo-out, no overshoot: its height is the
   bar), M4 re-partition 111.5-113.0 (spring + anticipation), bookend cubes 135.5-137.0 (spring) then camera 137.5-139.0 (expo-out).
   Before: 40-47 (7 s), 60-66 (6 s), 73-75.5, 110.5-117.5 (7 s), 135.4-139.4 (4 s, camera and cubes together), all quintic/cubic.
   One hero move at a time: M1 and the bookend were one joint camera+marks move; each is now two moves, camera OR marks (R-E T5).
   The freed seconds went to the holds after landing (M1 lands 43.5, hold to 60; M2 61.5, M3 71.5, M4 113.0).
   Overshoot only on marks (3.9 % peak, clamped so no cube sinks into its tile); 0 on text, numbers, opacity, the plane and the camera.
   Ambient drift on holds: 1.2 % dolly + 0.8 deg yaw about the aim point, zero during a camera move, through a 0.4 s settle after it,
   and at the next move start (knobs camDriftAmp, driftYaw, camHoldSettle).
   Count-in processes (tiles 12.5-17.5, cubes 20.5-25.0, lighting 28.5-31.0, PRs 99.5-103.0, 27 minutes 120.5-123.0) use the
   text-reveal count rate (power-out 2.6) so the number on screen is exactly the marks landed; the 289 tower 125.5-128.0 is a
   speed ramp (k 6, easing to x1 at the top).
2. **Every label, panel and readout through text-reveal.** Header phases, legend lines, hook type (eyebrow + two lines, 3-frame
   stagger), the ratio pair, the paper plate, the schematic tag and both Monday columns go through `K.reveal.tx/land`
   (factory/kit2/text-reveal.js): masked rise, exit at 0.6x in reverse order. Callouts and pins use the pattern's `attach`
   (dot 0.18 s, leader draws on in 9 frames, then the label) over the ground plate, painted by the film (same K.tx/K.ln/K.rc and
   clip bands as the adapter) because a callout also carries a count-in or a pulse: 115 / 460 / 278 / 296 / "27 min" count in with
   the marks landing (tabular digits, the last 10 % takes 41 % of the time, a weight pulse on landing); 60.4 %, 44, 22, 44 of 115,
   38.3 %, 80.9 %, 4 h 49 min and about 10x land with the pulse and never roll. Labels stay off during every hero move.
3. **Beat 0.5 s, captions rebalanced.** film.json `beat: 0.5`; every caption start and every timed knob that starts a move is a
   multiple of 0.5 s (G12 100 %). Captions: 30 → 29; "At the 50 % bar, the agent reaches much further." dropped (its claim is the
   next caption's) and "One cube, one minute." folded into the minute legend, so the minute scene's four captions fit 120.5-135;
   every caption holds its 1.3 s + 0.06 s/char (before 15/30). Time came from the dead holds (the 74-98 s plane hold, 115-121 s).
4. **The hero material at manager level.** `look.material: hero` (factory/kit2/materials/hero.js → arsenal/patterns/gl-look through
   gl-post): luminance ladder (bg 6.6 % → light pool → floor plate under each scene's subject → tile plates → unlit marks →
   lit marks capped at 55 % → the glowing all-four columns), key/fill/hemisphere rig, Fresnel rim 0.05 on cube edges, baked wall
   AO, a planar contact shadow under the cubes (the same draw flattened along the key, MIN-blended), seeded grain sigma 1.5 % at 15 fps
   (also the dither of the dark floor ramp), PBR Neutral tone map. Bloom 0.1, threshold 1.0: only the 44 all-four columns pass it,
   from the plane landing (71.5) to the plane fade (96), and not while the one-try count lifts the dim (77-80.5). The floor grid is
   now in the floor shader, anti-aliased (fwidth) and faded with the pool, so no moiré and no bright horizon band. The film's
   mark shader is its own (one draw, five faces per cube, three homes per cube) and binds the look's uniforms through
   `look.bind`; without the look it draws the stock ink picture.
5. **Joins and hook.** 100 s and 120.5 s: a left-to-right light wipe (0.6 s, emphasized curve) carries each join: the new scene is
   drawn left of the front and the old one right of it (scissored in the HDR frame), with a thin band of gold light at the front;
   the PR sheet is already filling as the wipe passes. The 121 s join moved to 120.5 (on the beat, and the four minute captions
   fit). 135 s stays the one hard cut (back to the same field; declared). HOOK: a real task that passed three of its four tries,
   at macro scale (the tile fills about half the frame height): its four tries drop in from 0.0 s (two have landed by 0.5 s), three
   light gold at 1.5 s, the belief and the doubt are set beside it, and the camera pulls back 10.5-12.0 to the plan pose: that tile is
   the first of the field (the count-ins start from it: 1 tile, 4 cubes, 3 passes). Silent beats: one 3-frame ring (and a <= 5 %
   nudge of the marks that landed) at each mark hero landing: hook 1.05, M1b 43.5, M2 61.5, M3 71.5 (with an edge flare of the
   plane), M4 113.0, the 289 tower 128.0, bookend 137.0. None is over a digit (labels are off during moves; callouts attach later).
   The 74-98 s plane hold also moves now: the dim lifts while "count one try at a time" is on (every lit try shows) and returns for
   "every try".
6. **Cuts for the exporter.** film.json `cuts: [135.0]` (the only hard cut left; the wipes are continuous pictures, so sub-frames
   may cross 100 and 120.5).

## Rubric self-score (WOW-MOTION section 9; before = the gap audit's 5/44)
| # | property | before | after | evidence |
|---|---|---|---|---|
| P1★ | easing | 0 | 2 | no cubic/quintic hero move left; marks: anticipate + spring-hero (attack 0-50 % 0.26 s, release 50-98 % 0.44 s); camera: expo-out (82 % of travel in 0.37 s of 1.5 s) |
| P2★ | settle | 1 | 1 | marks 0.50 s (2 % band at 0.70 s of a 1.2 s per-mark move), camera 0.66 s, plane 0.44 s: all in 0.4-0.8 |
| P3 | overshoot | 0 | 1 | marks 3.9 %, one cycle; 0 on text, digits, opacity, plane, camera |
| P4 | anticipation | 0 | 1 | 2 % counter-move over 3.6 frames on 3 of 5 mark hero moves (re-stack, sort, re-partition); none on camera |
| P5 | follow-through | 0 | 0 | dim lags the plane 0.12 s, ghost dim 0.5 s after M4, glow 0.6 s after the plane; the columns themselves have no lagging part |
| P6 | stagger | 0p | 1 | text waves 3 frames a line, <= 0.8 s; tracked marks keep the R-E T5 cap 0.25 (the rubric says none: conflict logged) |
| P7★ | one hero at a time | 1 | 1 | camera and marks split in M1 and the bookend; labels off during moves; drift 0 during camera moves (it runs, at ~0.1 %/s, under mark moves) |
| P8 | carried joins | 0p | 0p | 2 of 5 scene joins carried by an object (hook→field, field→sort), 2 light wipes, 1 hard cut (1 per 153 s); a wipe carries no anchor |
| P9 | speed ramp | 0 | 1 | the 289 tower (ramp k 6, x1 at the top); count-ins power-out |
| P10★ | text entrance | 0 | 1 | 0 single-frame text appearances outside the captions (the header left line is on from frame 0); eyebrow 12 vs legend 14 is under the 1.4 step |
| P11 | rhythm | 0 | 1 | export, grain-free frame pairs at 192x108, still < 0.1/255: gaps <= 0.3 s 61 %, >= 1.2 s 23 %, longest rest 3.9 s (before, same measure: 86 % / 8 %, 6.5 s) |
| P12 | beat grid | 0 | 2 | 46/46 starts on the 0.5 s grid (G12) |
| P13 | shot scale | 0p | 0p | macro (0-10.5), medium (field), wide (PR sheet, horizon); minute 2 (60-120) has two scales |
| P14 | number arrival | 0 | 1 | tabular digits, last 10 % of a count = 41 % of its time, weight pulse, real counts only |
| P15 | leaders | 0p | 1 | every callout and pin: dot, 9-frame leader, then label; exit 0.6x |
| P16 | luminance ladder | 0p | 1 | >= 4 near-neutral steps (bg, pool, plate, tile plates, marks), lit capped, one glowing tier |
| P17 | shadow + rim | 0 | 1 | rim 0.05 (+11-14 % code), baked AO + planar contact shadow (hard; softened only by accumulation) |
| P18 | grain / banding | 0 | 1 | sigma 1.5 %, seeded, 15 fps (changes every second frame, not every frame); the dark ramp dithers |
| P19★ | restraint | 1 | 1 | bloom 0.1 on the glowing columns only (71.5-96 s), no DoF, no chroma, no vignette |
| P20 | lens + drift | 1 | 1 | fov 28 fixed; 1.2 % dolly + 0.8 deg yaw on holds only |
| P21 | blur | 1 | 1 | page accumulation, shutter 0.35: 16 sub-frames on hero moves, 8 on count-ins, 4 jittered on holds (temporal AA); the rubric's 0.5 shutter is not used (brief: 0.35) |
| P22 | silent beats + captions | 0 | 1 | a 3-frame ring at 7 mark landings; captions 29/29 hold, on the beat; camera landings have no beat |
Total: 22 of 44 (before 5 of 44; the audit's target for this re-cut was about 22). No starred zero. Not 38: see "Left".

## Left, and why
- P5/P8/P13 (the 0p rows): secondary parts that lag the columns, anchors carried through the two data-set joins, and a third shot
  scale in minute 2 need new scene design, not knobs; the two wipes are the brief's chosen carrier.
- The ending lock-up (audit gap 10) was not in this brief: MONDAY is the bookend move then type beside the field, as before.
- The planar shadow is hard (one key direction); a soft penumbra needs a jittered light in the accumulation (not built).
- The macro hook cubes are unlit-dark until 1.5 s; the first half second is a dark tile on a dark floor with one cube dropping.
- The 120.5 s wipe passes over a nearly empty frame (the 27-minute column starts as the wipe passes): the join reads as light, not as an object.
- Export: `--ssaa 2` was not used. kit2 fixes the canvas at pixelDensity 2, so ssaa 2 only re-renders the SVG type at twice the master's 4K (measured at device
  scale 4: the screenshot alone is 2.5-8 s/frame, the export would have taken 12-16 h, and 4590 such PNGs cannot fit on this disk). Canvas AA comes from the in-page Halton jitter instead
  (4 sub-frames on holds). Exporter mode (no page accumulation) was measured first and abandoned: drift and grain make every frame
  "moving", so auto never picks N = 1 (>= 10 renders/frame, about 2 min/frame at ssaa 2).
- G5c WARN on the count-in values (gate-side defect 7). Phone 390 overflow is kit2's shell (unchanged).
- Page budget: 1,295,920 B of 1,300,000 (4.1 KB left). The hero material replaced the drawn-materials module (-16 KB); film.js is now
  comment-stripped at assembly (-13.5 KB). Anything new needs bytes found first.

## Cost
s/frame: 0.85-0.9 s for a single live render at 1920 x 1080 (shoot harness, 1 sub-frame); 2-5.5 s per frame with page
accumulation (4-16 sub-frames) + 0.7-2.8 s screenshot; frames.mjs 5.67 s/frame (loaded host).
Export (arsenal/tools/export.mjs, page mode, shutter 0.35, samples auto, 3 shards): 6.0-6.2 s/frame per shard, about 2.05 s/frame wall;
samples per frame 4 (holds, jittered) / 8 (count-ins) / 16 (hero moves), mean 4.7-6.4 per window; deterministic re-renders IDENTICAL in
every window. Run in four windows (0-68, 68-96, 96-124, 124-153 s): the first full run filled the disk (a 4K frame PNG with grain is
4.4 MB; 4590 of them do not fit), so each window was encoded and its PNGs dropped; window 0-68 s comes from the first run's frames,
spot-checked against a fresh browser (frames 1260-1262 IDENTICAL, export-wow/w1check). Master: export-wow/pass-every-time.midnight-ink.none.hero.mp4
(3840 x 2160, the 1920 x 1080 canvas under 4K type, 4590 frames, bt709 tv, crf 16, 620 MB; window reports in export-wow/w*/).
1080p copies: `-crf 20` gives 135.6 MB (export-wow/pass-every-time-wow-1080p-crf20.mp4): the seeded grain and the hold drift cost
H.264 bits on every frame, and denoising before the encode saved only 10 %. The delivered copy export-wow/pass-every-time-wow-1080p.mp4
is a two-pass 1.45 Mbps encode (aq-mode 3, bt709 tags), 27.4 MB, 4590 frames: the size cap won over the crf; mild blocking shows in
the dimmed plane region on close inspection.
Page: 1,295,920 B (film code 109.9 KB).
