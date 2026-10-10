# who-gains · SELECT (tier 1) · 2026-10-10

Evaluator: Opus, blind (atelier-select). Read: brief.md, beats.md (factory/topics/who-gains), and for each draft
frames/strip-*.png, frames/thumbs, frames/frames.json, film.json, claims.json, gate.json. Not read: film.js, lib/,
NOTES.md of either draft; no browser run. Strips at 0.5 s; strip NN starts at 6(NN-1) s, cell = (t - start)/0.5.
Gate: a PASS (G5c WARN counters; G6 phone scrollWidth 553/390 OVERFLOW; s/frame 1.05; page 1.289 MB; G11 clean).
b PASS (G5c WARN counters; phone 390/390; s/frame 2.30, measured under load; page 1.299 MB; G11 clean).
Commit off (D11): no COMMIT row. Captions of a and b are identical (the brief's 23), so the pictures decide.

## Can the pictures alone show the reversal (captions covered)?
- **b: yes, from 44.0 s** (strip-08 cell 4, t-0044.00): five equal-width skill fifths, the left one almost all gold,
  the middle three low, the right one with no gold; held with on-stage pins +34 % / middle "shown at their average" /
  about 0 from 46.6-49.6 s, the dashed average line across all five at 53.6-59.6 s (strip-10 cells 0-11) and again
  69-75 s. METR: half. The side view at 124-135 s (strip-21 cell 8 to strip-23 cell 6) shows the columns rising past
  the "time without AI" line with a gold cap, but the believed level is not a visible second line.
- **a: yes for the shape at 43-44 s** (strip-08 cells 2-4: gold left, grey right), but the lowest group never carries
  a number on stage (47-53 s, strip-08 cells 10-11, strip-09 cells 0-6: no +34 % pin; only the caption says it).
  METR: yes at 126-134 s (strip-22): the lilac forecast box sits below the dashed baseline beside the taller white
  measured block. That is the best single METR frame of the two drafts.

## Ranking
**1. b (winner).**
Strengths: the main reversal is witnessed and labelled on one held frame (47-59 s, strip-08 cell 11 to strip-10);
equal widths show equal head-counts, so the gold heights are the only difference; the legend is honest ("LIT
HEIGHT = AVERAGE GAIN · ONE SCALE FOR EVERY COLUMN", 22 s on); I2 visible on stage: the 5,179 readout stays (dimmed)
through M1 (strip-07) and "16 / 246" stays through the M2 tilt (strip-20 to strip-21); the M1 turn is 12 -> 98 deg az
(<= 90, turn and re-partition one gesture); split pins cut off for M3 and come back after the settle (59.6 / 68.2 s);
hook has a mark from 0.0 s (strip-01 cell 0); bookend 135 s "+14 % · ONE NUMBER FOR ALL FIVE FIFTHS" (strip-23)
names what the average hid; honest line on stage 138-150 s; card last.
Faults: METR captions run ahead of the counts (102 s caption "16", readout 5/10/15 until 104.6 s, strip-18 cells 0-5;
"246" caption at 105 s, readout 29/135/230 until 108.8 s, strip-18 cells 6-11); in the belief view the 24 % pin points
at the partial last row of the 246 block (13 x 18 + 12), which reads as "the missing notch is 24 %" (strip-19 cell 6,
t-0111.00); the believed-after and forecast ghost frames are barely visible, the 20 % pin sits on the column face
(strip-22 cells 8-11); the agents row stays half-lit and cut by the left edge beside the developers wall 76-101 s, the
developer readout over its tops (strip-14 cell 4, strip-15 cell 10): a cross-study comparison the brief forbids (F6);
caption 21 wraps (strip-23 cells 8-11); honest line wraps to two lines (108 chars); 102.0 s blank after the cut;
s/frame 2.30 vs 1.5 budget (weighed lightly).
**2. a.**
Strengths: METR forecast box vs measured block (126-134 s) shows belief vs stopwatch side by side; cheaper (1.05 s/frame).
Faults, in order: no +34 % on stage at the reveal (47-53 s), the result told by caption only; the legend "LIT HEIGHT =
THE GROUP'S GAIN / OTHER BOXES: NO GAIN" (23 s on, strip-04 cell 11) states that unlit agents gained nothing, a
per-person claim the source does not make (truth defect); 54-59 s "AVERAGE +14 %" pin over the tagged agent and the
lowest column (strip-10 cell 6); 45-59 s "MIDDLE THREE FIFTHS", "HIGHEST-SKILL FIFTH · 1,036" and "about 0" abut
(strip-09); the 5,179 readout vanishes during M1 (strip-06 cell 8 to strip-08 cell 4) and no 246 readout during M2, so the
invariant is not on stage; 96-101 s a camera dive into the developers wall shows nothing and runs gold through the
caption band (strip-17); hook blank to 1.5 s, blank frame at 76 s; phone overflow 553/390.

## Verdicts
- b: the split is seen, counted and labelled on one held frame; METR needs the belief drawn as a level. Winner.
- a: the best METR frame, but the headline +34 % lives only in the caption and the legend says something untrue.

## Winner
b copied unedited to factory/films/who-gains/ (film.json, film.js, claims.json, lib/ incl. lib/assemble.py and
film.src.js, build/, gate.json). film.json already had id "who-gains" and look {brand ceti-neosage-dark, chrome none,
material ink}; kept byte-identical.

## Borrowed beats
From a, not expressible as b knobs: the METR side-by-side (forecast box below the baseline beside the measured block
above it). Listed first under Beyond scope.

## Round 1
findings.r1.json: 9 findings: 0 block, 3 major, 6 minor; dry run accepted 9 of 9 (findings.r1.report.json).
dots1 104.6 -> 103.0; issues1 108.8 -> 107.0; ghostMix 0.7 -> 1.0; frameW 1.6 -> 2.6; readDim 0.6 -> 0.85;
bgFade 0.55 -> 0.85; devLookDz 40 -> -20; caption 21 -> "Before rollout, split the gain by experience."; postLevel
manager -> exec. Check in round 2: 16 and 246 land with their captions (strip-18); the believed-after line reads
below the baseline at 130 s; the frame lines do not read as chart axes; the developers wall is centred, the agents row
out of the readout (strip-14/15); s/frame after exec post; the measured top still reads without bloom.

## Beyond scope (needs film.js; ordered by what it buys a viewer) — for tier 2
1. **METR belief as a visible level** (111-135 s). Draw the forecast (76) and believed-after (80) as marks the side
   view shows below the baseline, next to the measured 119 above it, on one frame: a's 126-134 s layout (forecast box
   beside the measured block, dashed baseline between) is the model. Without it the second reversal (believed +20 %,
   measured -19 %) is caption-carried.
2. **24 % pin anchor** (111-115 s): anchor it to the forecast frame, not the corner of the partial last row; or fill
   the 246 block so the partial row sits at the back (246 has no column count in 12-24 that divides it).
3. **Gold cap = exactly the part above the baseline** (124-135 s, t-0126.50): a grey band shows between the line and
   the gold; if lit means "more time than without AI" it should start at the line, else the 19 % is mis-drawn.
4. **20 % pin placement** (129-135 s): beside its own line, opposite side from the 19 %, never on the column face.
5. **Tag text cut during moves** (34-44 s and 60-68 s): "ONE LOW-SKILL AGENT" rides over travelling boxes; keep the
   accent mark riding (P8) but hard-cut the text pin at move start and back after the settle (R5); today tag0/tag1
   drive colour and pin together.
6. **Developers words-only beat** (95.6-101.4 s): nothing on stage shows "newer hires gained more"; if tier 2 adds
   anything it must imply no group size (F3) — otherwise leave it and accept the beat as caption-only.
7. **102.0 s blank frame** after the cut to METR: show the field (floor, source tag) on the cut frame.
8. **Honest line on one line**: 108 chars at 16 units wraps; a shorter on-stage text (the brief's "Three studies,
   earlier tools, different tasks: a pattern, not a law.") with the journal-rounding note moved to source chrome
   needs a director's call (director's choice put it in the line) and a film.json `honest` edit outside the tool.
9. **Budget**: page 1.299 MB leaves 1 KB under 1.3 MB; any film.js addition must be paid for. If postLevel exec does
   not bring s/frame under 1.5, profile the post pass and the 5,179-box instancing.
Warnings that ship: G5c WARN for the running counters (13-21 s, 77-83 s, 103-108 s), recorded once.
