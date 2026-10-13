# WOW-RUBRIC-SCRIPT · lane B8 · the deterministic rubric scorer · 2026-10-11

`factory/tools/rubric.mjs` (page, film.json, gate.json, text) and `factory/tools/rubric-px.mjs` (pixels) measure the scriptable
properties of WOW-MOTION section 9, so a judge reads numbers instead of frames. Usage and options: factory/tools/README.md.
This note says how each property is measured, then checks the script against the Opus judge (WOW-SCORE-pass-every-time.md) on
cut A and cut C, and lists where they disagree and why.

    node factory/tools/rubric.mjs <page.html> --film <film-dir> [--mp4 file] --json out.json

## 1. What is scripted

Same inputs, same JSON: no dates, frames and text samples are merged by index, and ids are first-seen order after a warm-up walk.
Checked on cut A: two fresh runs (no caches) give byte-identical JSON, and `--workers 1` gives byte-identical JSON to `--workers 3`.
Cost with `--mp4`: about 1.5 to 3 minutes (DOM pass 60 to 120 s, ffmpeg decode 35 s, analyses 20 s). Without it the page renders
the frames (software GL, 3 to 5 s each when idle; 412 frames at `--stride 6`, 770 at `--stride 3`; see 2.3).

| property | status | what is measured | bar used |
|---|---|---|---|
| P1 easing (★) | reader | per hero move: peak-velocity share of the move, peak px/s | asymmetric attack: share < 0.4 |
| P2 settle (★) | script | per hero move: first frame whose trace is at 98 % of travel to the end of the motion run that follows (mask-local diff > 12/255 on >= 0.2 % of the frame; the run ends at the first quiet gap of 4 frames) | 1 when >= 60 % of hero moves have >= 0.4 s |
| P3 overshoot | script | trace past the final value after 98 %, as a share of travel | 1 when >= 50 % of traceable moves sit in 0.5-5 % and none above 8 % |
| P4 anticipation | script | the third-largest counter-move frame before the move (so one noisy frame does not count), share of travel | 1 when >= 50 % of moves sit in 1-5 % |
| P5, P7, P9 | reader | lag knobs (frames); seconds two hero moves overlap; peak speed over the speed of the last 20 % | |
| P6 stagger | script | waves of >= 3 entrances closer than 0.4 s: median step in frames, span | 1 when a wave has step 2-8 f and span <= 0.8 s; 2 when all waves do with step >= 4 |
| P8 joins | partial | joins = chapter starts, `cuts`, knobs named `…Cut`; hard = frame-diff spike (mean luma diff >= 6 and >= 2.5 times both neighbours) within 0.25 s | 0 when > 1 hard cut per 20 s or > 30 % of joins are hard; carried joins stay with the reader |
| P10 text entrance (★) | script | every non-caption text: first partial frame to 90 % of its plateau; absent to full in one frame, or re-bound in place at full opacity to a text with other letters, is a pop | 0 with any pop; 2 when the median rise >= 4 f |
| P11 rhythm | reader | gaps between motion runs: share <= 0.3 s, share >= 1.2 s, median | |
| P12 beat grid | script | G12's rules (knob starts and caption starts within 2 frames of a beat line; cross-checked with gate.json) | 0 without a `beat`; 1 at >= 80 %; 2 at >= 95 % and >= 80 % of visible onsets |
| P13 shot scale | script | height fraction (2nd-98th percentile rows) of the data mask, text boxes left out, every 1 s; macro > 0.5, medium 0.2-0.5, wide < 0.2 | 1 when every minute has >= 3 scales of >= 3 s each |
| P14 number arrival | script | each element whose text is one rising number (>= 4 values): last-10 % share of time (first value >= 0.9 of the final), longest hold, width spread over same-length values, weight or height change at arrival | 1 when every count-in is tabular (<= 0.6 px) with last 10 % >= 40 %; 2 also needs an arrival beat, no hold > 35 %, G5c PASS; 0 when numbers appear with no count-in |
| P15, P17, P20 | reader | label entrances; rim, shadow, ambient knobs; fov and drift knobs | |
| P16 ladder | script | at <= 8 stills at full resolution: 16-level histogram bins >= 2 % of pixels, text peak in the DOM boxes, share of pixels under 2 % luma | 1 when median bins >= 4, text <= 245, floor <= 0.01 % |
| P18 grain | script | flat 40x40 cells (temporal-mean s.d. < 1/255, drift < 1.5) over 13 frames in the 3 longest holds: sigma of the frame difference / sqrt 2, even and odd pairs | 1 when median sigma is 0.75-3 % (0.75 because video coding smooths grain); 2 when it changes every frame |
| P19 effects (★) | script | bloom, chroma, DoF knobs (knob names, so a film must name them so) | bloom <= 0.35, chroma <= 1, none at exec level |
| P21 fast moves | script | moves above 300 px/s: 20-80 % edge rise of the accent mask at the peak frame against the per-frame step; accent runs per scanline against the same frame at rest | 0 when blur is missing (edge rise < 15 % of the step) on half of them or runs >= 2 times the rest (ghosts) |
| P22 substitutes | partial | caption holds (>= 1.3 s + 0.06 s per character) | 0 when any caption is short; the impact beat stays with the reader |

Moves are the knob pairs `…T0` / `…T1` plus `rig.moves`. A pair whose T0 doc names an arrival sequence ("start to land", "a tenth
at a time", "first … arrives") is an arrival, not a move (it is the count-in's business, P14), and a move counts as a hero move
when it changes >= 3 % of the frame. Trace = the accent mask (chroma > 45, max channel > 110: gold here) centroid, or an edge
when that travels twice as far; if the accent has < 30 pixels or < 3 px of travel the data mask is used. Frames are 320x180 luma.

## 2. Agreement with the judge

Sources: cut A = scratchpad/wow-before (page, film.json and MP4 from the same build). Cut C = the hero page, film.json and
`export-wow/pass-every-time-wow2-1080p.mp4`. **C moved under the judge**: the MP4 is from 18:08, the page from 18:45, and film.json,
film.js and claims.json were rewritten at 19:02, so for C the DOM pass reads a newer build than the pixels. The G12 numbers are
the live film.json's and still match the judge's (53 of 53, 29 of 29).

### 2.1 Numbers the judge printed

| measurement | judge | script |
|---|---|---|
| A hard cuts | 100.00 s (11.7), 121.00 s (22.2), 135.00 s (16.2) | 100.00 s (11.3), 121.00 s (22.1), 135.00 s (16.1); no other spike |
| C hard cuts | none; one mid-shot spike at 141.13-141.17 s (11.8 against 3-4) | no hard join; mid-shot spikes at 141.17 s (11.6 against 3.6) and 141.60 s (12.0 against 1.3, new) |
| A settle, M2 | 64.73 -> 65.37 s = 0.63 s | 64.77 -> 65.37 s = 0.60 s |
| A settle, M3 / bookend | 0.43 / 0.43 s | 0.30 / 0.50 s |
| A settle, M1 | 0.57 s (46.43 -> 47.00) | 0 s (the trace is at 98 % at 46.27 and the pixel diff is under 0.2 % from 46.27) |
| C settle, M2 | 60.73 -> 61.60 s = 0.87 s | 60.73 -> 61.60 s = 0.87 s (travel 217 px, judge 223 px) |
| C settle, M4 | 112.13 -> 112.93 s = 0.80 s | 0 s (the centroid trace of the re-partition is wrong; see 3) |
| C settle, in44 / out44 / M1a | about 0.6 / 0.7 / 0.5 s | 1.00 / 0.90 / 0.20 s |
| C settle, book camera / wide / out27 / pull-back / M3 | about 0.4 / 0.25 / 0.2 / 0.25 / < 0.1 s | 0.10 / 0.13 / 0.13 / 0.07 / 0.80 s |
| C M2 overshoot and counter-move | 6.8 % and 8.5 % | 8.7 % and 8.5 % |
| A M2 overshoot, counter-move | 0.1 %, noise | 0.1 %, 1.0 % |
| A late-count pops | "44 of 115" at 76.98 s, "44 ..." at 67.98 s, "115" label at 20.98 s, one frame each | pops at 77.00, 68.00 and 21.00 s (35 pops in all: every callout is a pop) |
| C text rises | "44 of 115" over 2 frames, Monday lines about 3 frames | Monday wave 11 items at 3 frames, span 0.87 s; median rise 4 frames, shortest 1 |
| C tile count-in, last 10 % | 44 % (104 -> 115, 15.3 -> 17.1 s) | 42.5 % of 13 -> 17 s, longest hold 42.5 % |
| A 22 / C 22 caption holds | 15 of 30 short / 0 short | 15 of 30 short / 0 short |
| A / C P12 | 45 % (8 of 30 captions) / source 100 %, captions 29 of 29 | 36.6 % (8 of 30; 41 events, not the judge's 98) / 53 of 53, 29 of 29 |
| C luminance | type 224-234, darkest 1.7-4/255 on a handful of pixels | text peak 241 (box maximum), floor 0.0009 % of pixels under 5/255; A: text 255 |
| C grain sigma | 0.6-1.35 % | 0.98, 0.55, 0.35 % (even/odd pair maximum, three holds) |

### 2.2 Scores (0/1/2), judge against script

| property | A judge | A script | C judge | C script | where they differ and why |
|---|---|---|---|---|---|
| P2 settle ★ | 1 | 0 | 1 | 0 | Both are share-of-moves rules (judge: 6 of 10 hero moves >= 0.4 s). The script takes every non-arrival move that changes >= 3 % of the frame: 5 in A (2 pass), 17 in C (7 pass), against the judge's 4 and 10. Where the measure is the same it agrees (A M2, C M2, M2's overshoot). A M1: the judge counts the landing flash at 47.00 s as "last motion"; by the written definition (pixel diff under 0.2 %) the slow cubic tail of M1 is already invisible. C M3, in44, out44: the script's motion run after 98 % includes ring beats and callouts that the judge excluded by eye. C M4: the centroid of a re-partition is not a position. |
| P3 overshoot | 0 | 0 | 0 | 0 | agree; C has 5 of 16 traceable moves over 8 % (stack and M3 have noisy centroids) |
| P4 anticipation | 0 | 0 | 0 | 0 | agree; C M2 8.5 % over the 5 % ceiling, as the judge |
| P6 stagger | 0 | 1 | 1 | 1 | A: the script finds 3-item waves at 3 frame steps that the judge read as "one piece" (the Monday block stepping at 7 frames, span 0.23 s). Judge: A fades as one. |
| P8 joins | 0 | 0 | 1 | 1 | agree. The script scores only the hard-cut half; carried-ness stays with the reader. C's second mid-shot spike (141.60 s) is not a join and is not counted. |
| P10 text ★ | 0 | 0 | 1 | 2 | A agrees (all three of the judge's pops are in the list). C: the script has no pop and a median rise of 4 frames, which is its bar for 2; the judge called 2-3 frame rises "at the limit". The page is newer than the MP4, so rises can differ. |
| P12 beat grid | 0 | 0 | 1 | 1 | agree. Visible onsets in C: 24 % within 2 frames (judge: 13 of 20), because the script's onset is the first frame at 2 % of the trace and pre-rolls count. |
| P13 shot scale | 0 | 0 | 1 | 0 | A: the judge reads 0.4-0.5 height; the script reads 0.57 for the plan field, 0.42 for the side view; both give A less than 3 scales in minute 0. C: the judge counted a wide shot at 119.7-121 s (1.3 s); the script needs 3 s of a scale in the minute, so minute 1 has 2 scales. |
| P14 arrival | 0 | 0 | 1 | 0 | A agrees (no count-in, 13 number texts appear at once). C: the tile count passes tabular and last-10 % (42.5 %), but the PR count-in (30 -> 296, 101.5-104 s) puts its last 10 % at 0 %, and the script fails the property if any count-in fails; the judge checked only the tile count. The judge's weight beat on 115 (17.10 s, from the MP4) is not in the live page: its SVG text keeps weight 600 and a 34 px box from 104 to 115, so the script reports no arrival beat (the page is newer than the MP4). |
| P16 ladder | 0 | 0 | 1 | 1 | agree (A fails on text 255, C passes: 5 bins, text 241, floor 0.0009 %) |
| P18 grain | 0 | 0 | 1 | 0 | A agrees (sigma 0). C: the judge's four patches gave 0.6-1.35 % and a 1; the script's medians over the flat cells are 0.98, 0.55 and 0.35 %, median 0.55 %, under its 0.75 % floor. The judge accepted two of four patches under 1 %. |
| P19 effects ★ | 1 | 1 | 1 | 1 | agree (bloom 0.10) |
| P21 fast moves | 0 | 0 | 0 | 0 | same score for different reasons. A: no edge rise on any of its 4 fast moves (judge: no blur). C: blur found on 3 of 14 fast moves (pull-back, M1a, wide; the others have an edge rise under 15 % of the per-frame step, M2 included, where the judge saw a continuous streak), and one ghost flag (book camera, 141 s: 6.7 accent runs per scanline against 2.4 at rest). The judge's 0 is the strobe of the spinning plane at 99.5-99.9 s; the script's trav1 frame (peak speed, 1953 px/s) reads 1 run against 5.9 at rest and is not flagged. **Treat P21 as weak.** |
| P22 substitutes | 0 | 0 | 1 | 1 | agree on the caption half; the impact-beat half is not scripted |

Scripted totals (14 properties, max 28): A 2, C 8. The judge's totals over all 22 (max 44): A 2, C 16. They are not comparable (the script
leaves 8 properties and the carried-join and beat halves to a reader). Starred properties: the script's A zeros are P2 and P10 (judge: P1, P7,
P10; P1 and P7 are reader properties), and C has one starred zero, P2 (judge: none).

Score agreement on the 14 scripted properties: A 12 of 14 (P2, P6 differ), C 9 of 14 (P2, P10, P13, P14, P18 differ; P21 agrees by accident).

### 2.3 Page mode (no MP4)

Without `--mp4` the page renders the frames (software GL) and the analyses run on the `--stride` grid. Two checks on cut C.

**Stride** (MP4 frames sampled on the same grid: the motion threshold is 0.2 % of the frame times the stride, the quiet gap is 4 frames):

| | stride 1 | stride 3 | stride 6 |
|---|---|---|---|
| hero moves with settle >= 0.4 s (P2 needs 60 %) | 7 of 17 | 8 of 17 | 10 of 17 |
| settle M1a / M2 / in44 / M4 | 0.20 / 0.87 / 1.0 / 0 s | 0.7 / 0.8 / 1.0 / 0.1 s | 0.8 / 0.8 / 1.0 / 0.2 s |
| scores (14 properties) | as 2.2 | identical | identical |

Strides above 3 smear the settle tail by up to a stride (M1a 0.2 -> 0.8 s), so keep `--stride` at 3 or less for P2.

**Page render against MP4 frames, both at stride 6** (412 frames rendered in about 55 minutes with the machine at load 25 to 44; 3 to 5 s a frame when idle):
the same 13 of 14 scores (P2 is 11 of 17 moves against 10 of 17, either side of the 60 % line). Travel is within 2 %
(M2 224 against 219 px, in44 583 against 588), t98 within one stride, overshoot differs (M2 1.5 % against 8.1 %: the page is a newer build and
six frames apart is coarse), and two pixel properties move: **text peak 215 from the page against 241 from the MP4** (the encoder adds
ringing; judge 224-234), grain sigma 0.65, 0.65, 0.92 % from the page against 0.98, 0.55, 0.35 % from the MP4 (which also smooths grain).
Page mode finds no mid-shot spike (it scans the declared joins only) and does not compute P11.
Use the MP4 for P2 P3 P4 and the cut scan, the page for P16 and P18 when the exact pixels matter.

## 3. Known limits

- **The trace is an accent centroid.** It works for marks (gold) and fails for re-partitions (M4), growth (zoom) and moves with no accent; `trace`
  in the moves list says which mask was used. A reader should treat settle on a data-mask or energy trace as indicative.
- **Settle is a share rule, and its denominator is the move list.** The judge picks hero moves by eye; the script by rule (>= 3 % of the frame,
  not an arrival). Change the list in `knobs_doc` ("start to land" wording) and the score changes; the moves, with their numbers, are in the JSON.
- **Pops are strict.** Any new text bound in place at full opacity counts, so a callout pair that appears together in one frame is two pops.
- **P21 and P18 depend on the encoder.** P18 reads video-coded grain (an MP4 smooths it), so its floor is 0.75 %; P21's edge test is a
  proxy, not a ghost-spacing measurement. For ghost spacing render with `frames.mjs --shutter` strips and read the crop.
- **Needs a reader (unchanged):** P1 quality of the curve, P5, P7, P9, P11, P15, P17, P20, the carried half of P8, the impact half of P22,
  and P18 banding. Their raw numbers are in `props.Pn.raw`.
- **Not in the script:** P19's A/B render (effects off against on); the gate's G5c status is read from gate.json when it is there.
