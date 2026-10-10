# Seats · Wave GL · blind evaluator verdicts · 2026-10-10

Judged only from card.md, shots/contact.png, shots/swiss-grid/contact.png and shots/report.json of each lane (pattern.js and
demo.html were not opened), against arsenal/WAVE-GL.md, arsenal/frontier/R-A §4, R-D §3 and the R-C ranked list. Cell (r, c):
r = variant in report.json order, c = still in time order (left to right). Severity: S1 blocks, S2 visible defect, S3 doc or polish.
Purity: report.json says `identical` for every variant of every lane in both packs, with 0 errors (13 lanes, 56 variants).
s/frame: the card's readPixels-synced figure (shoot.mjs `ms_per_frame` under-reports for gl-post and gl-volume, and says so).

## 1 · Verdicts

| lane | verdict | heaviest s/frame (≤ 1.5) | cheap < 0.3 | count before ratio | results never smallest | roles (vs swiss-grid) |
|---|---|---|---|---|---|---|
| gl-instances | SHIP-WITH-NOTES | bars-100k 1.15 (0.58 aa off; 6-7 s at load 13) | dots-10k 0.12 | holds | holds | holds |
| gl-heightfield | SHIP-WITH-NOTES | lit-200x120 0.14-0.26 (max 0.37) | wire 0.06-0.12 | n/a (counts only) | holds | holds |
| gl-ribbons | SHIP-WITH-NOTES | sankey 0.34 (0.51) | queue 0.16 | holds ("320 OF 1,000") | FAILS for queue: delay is in the smallest line | holds |
| gl-pointcloud | SHIP-WITH-NOTES | brushed-dof 0.40-0.93 steady, 1.15-1.45 first frames | two-groups 0.07 | holds ("1,219 OF 6,000") | holds | holds |
| gl-stack-city | REVISE | treemap 0.76 (1.11) | k10 0.27 (max 0.39) | FAILS: % lands in the same frame as its count, in a bigger face | FAILS: pooled result in the smallest line | holds (dim reads pale on white, labelled) |
| gl-camera-rig | SHIP-WITH-NOTES | dolly 0.65, max 1.66 (dolly-zoom 1.52, ortho 1.54 max) | orbit-lite 0.32 (0.21-0.25 at lower load) | n/a | holds | holds |
| gl-post | SHIP-WITH-NOTES | reveal 0.97 (1.20 unloaded); accum-8/16 3.85/6.0, offline only | none 0.24 | n/a | holds (type after post) | tone map dE 0 on 18 packs; 5 packs fail dE < 2 on saturated accents |
| gl-volume | SHIP | stress 0.54-0.83 | 1D/2D 0.11-0.25 | exemplary: "2,401" in the display face, "OF 19,996 = 12.0 %" under it | mostly (LEFT/RIGHT split in the smallest face) | holds |
| gl-labels | SHIP-WITH-NOTES | occlusion-200 0.41/0.66 (0.80) | callout 0.17/0.39 (0.61) | n/a | enforced by role sizes | holds |
| uncertainty-hop | SHIP | 0.003-0.004 | yes | exemplary: count (r5,c5), then "4 / 30 = 13%" (r5,c6) | holds; the result sits a face below the draw counter | holds |
| formula-bind | SHIP-WITH-NOTES | 0.0035-0.005 | yes | holds: 37 and 120 (r1,c2) before 30.8 % (r1,c4) | holds | holds; ceti-dark accent2 dots dim |
| track-unit | SHIP-WITH-NOTES | 0.0053 | yes | exemplary lamp: 98, then 9, then "9 ÷ 98 ≈ 9 %" (r3,c3) | slab counts are 11 px in pooled-split | holds |
| scale-anchor | REVISE | 0.006 | yes | n/a (no ratio) | FAILS: "frame = 26.5 × bus", "flagged 212" in the smallest face | FAILS brand faithfulness: the numbers change with the pack |

## 2 · Per lane (cells, laws, frontier)

R-A techniques: T1 true-scale unit marks · T2 same marks, new partition · T3 camera as argument · T4 uncertainty as motion ·
T5 deterministic temporal craft · T6 order-independent density + tone map · T7 coherent labels · T8 DoF as a depth cue ·
T9 data-aware lighting · T10 GPU filter or aggregation as the device. R-D gaps: G1 HOP + qdots · G2 formula-bind ·
G3 track-unit + congruence · G4 scale-anchor · G5 numerator/denominator lamp.

**gl-instances · SHIP-WITH-NOTES.** The promise holds: 100,000 marks in one chunked `model(geom, n)` draw, and the count
is the instance range ((r2,c2) 61,434; (r4,c3) 100,000; (r6,c3) 100,000 additive). Density (r6) reads as a distribution with no
sort artefacts. S2: in flat-100k (r2,c3) and (r2,c4) the 1,250 flagged accounts claimed in the display face are sub-pixel specks
you cannot see. Give picks a minimum size, a halo or a loupe. S2: in boxes-30k (r3,c2) falling boxes slice through the column
counts (3,752 and 2,690 are unreadable; the card warns). S3: in brushed-50k (r3..4 of row 5) the lit subset saturates into a solid
rectangle that reads as a box, not as 12,073 people (cap alpha or use a smaller dot). Cost depends on load: bars-100k ran 1.15 s here
and 6-7 s at load 13. Ship the kit2 aa-off recommendation. t = 0 is an empty frame in every row (c1).
Frontier: T1 delivered; T6 delivered; T10 partial (brush and pick by uniform, with an exact CPU count); T2 missed (no second layout:
the 100k layer cannot re-partition, which is the move R-A ranks second). Fix: carry `from`/`to` texels per mark, as stack-city does.

**gl-heightfield · SHIP-WITH-NOTES.** Count-in by rows leads every row (40, then 880, then 1,000). The flat section profile (r3) is
the right evidence carrier: the cut snaps to a real column. plan-80x50 (r4) is the top-view-then-tilt that R-D asks for when values
are read in perspective. S2: pins ignore occlusion. The cut-peak sub-label "PEAK ON CUT · ROW 61" disappears under the mesh at
(r2,c3), and the max sub-label disappears under the terrain at (r4,c1). S2: at (r3,c4) the profile's value "20.7" spills outside the
inset box. S3: at (r3,c3) the ghosted "100.0 · CUT AWAY" pin floats in empty space with a leader to nothing. Column 1 is a single row
line in every variant. Frontier: T9 delivered (role-ramp Lambert, contours in one shader); T5 delivered; T3 partial (spherical keys);
T7 missed. No R-D gap is addressed (M16 is not a gap row).

**gl-ribbons · SHIP-WITH-NOTES.** Units ride as countable marks and slabs fill as they land. Readouts are count-of-count
("320 OF 1,000 VISITORS · SIGNED UP", (r1,c4)). S2: the queue variant's actual claim (head-of-line seconds, served and arrived) is in
the smallest mono line under "24" at (r3,c2..c4). The cost of delay belongs in the display face. S2: at (r2,c1) the REQUESTS slab sits
on the readout (warned). At (r2,c3) and (r2,c4) REWORK 500, MANUAL 900 and ESCALATED 200 crowd onto the ribbons. S3: the stripes
in sankey and queue are on by default and must be 0 at exec. Marks are one CPU batch: 2,997 marks cost 0.38 s, and the vertex-shader
route above 10k is designed but not built. Frontier: T1 partial (1 mark = 1 visitor at 1,000); T5 delivered; T7 missed; T3 partial.
G5 partial (counts of a whole, no ratio stage).

**gl-pointcloud · SHIP-WITH-NOTES.** One billboard geometry. The brush arrives on t ((r3,c3) 1,212, then (r3,c4) 1,219 OF 6,000).
Roles swap cleanly (accent2 is red, then blue). S2: at (r3,c4) the brush box's edge runs through the pin sub-labels "HIGHEST X+Y+Z"
and "THIRD", and the pin stack sits about 100 px from the right edge. S2: at (r2,c4) the cube edge is drawn over the 20k cloud and
the cube overruns the cell top and bottom. The fog cue is weak: the near band is the bright one. S3: the DoF here is a second DoF
implementation beside gl-post's. brushed-dof steady time is 0.40-0.93 s, with first frames at 1.45 s, so it is near the budget.
Frontier: T8 delivered (focus on the brush, so depth carries the selection); T10 partial; T1 partial (20k); T7 missed.

**gl-stack-city · REVISE.** The machinery is the frontier: both homes per vertex, one shader, `check(t)` OK on 61 samples per
variant, a tagged unit with a trail and a ghost (r1,c3), LOD to 240,002 units at k = 21 (r4). The law fails on its own flagship.
S1 (law): at (r1,c2) and (r2,c2) the pooled pins put "45%" and "30%" in a larger face than their counts "1,198 / 2,691" and
"557 / 1,835", in the same frame. The split pins at (r1,c4) do the same for 12 slabs. Counts must land first and the % after
(reuse track-unit's lamp). S2: the pooled result "POOLED: 30% vs 45%" is in the smallest line under "WOMEN HIGHER IN 4 OF 6"
(r1,c4) and (r2,c4). S2: at (r1,c4) the 34 %, 35 % and 24 % pins collide with the CHECK OK line. At (r4,c2) the G11 and G10 labels
collide. At (r4,c4) the C1..C12 axis runs under the readout, the top-3 pins 4,440 and 5,928 overlap, and the tag label "ONE BOX =
21 UNITS" is buried in the city. Revising this is staging plus gl-labels, not a rebuild.
Frontier: T2 delivered; T1 partial (4,526 at k = 1); T10 partial (cells from unit boxes, hits lit bottom-up); T3 partial (one turn).
G3 delivered in 3D. G5 is attempted (lit height = rate) but defeated by the % pins.

**gl-camera-rig · SHIP-WITH-NOTES.** The instrument is strong: it is pure of t, its slerp matches p5 to 1e-4, its pins match to
0.009 px, and the script round-trips through toKnobs/fromKnobs. The demo does not prove it. S2: focus-pull (r6,c1..c4) reads as four
near-identical frames in ceti-dark, so the move that justifies DoF is invisible (it reads a little better on swiss-grid). S2: at the
look-at hold (r5,c4) the eye is among the boxes (the card warns). The dolly-zoom row (r3) is a street-level wall in every cell, so
the vertigo has no subject. dolly (r2,c2) and (r2,c3) fill the frame with geometry. S2: at the orbit hold (r1,c4) the rank-1 pin is
cut off at the top edge. S3: a vertical seam runs through the field in many cells, e.g. (r1,c3) and (r6,c2) on swiss-grid. Budget:
the max frame is 1.66 s under load (the card says to expect about half on an idle host). orbit-lite at 0.32 s is not clearly under
0.3. Frontier: T3 partial. The tool exists, but no variant makes a claim the move proves ("the pile is taller than the building").
G4 missed. R-D gap row 10 (annotation through a zoom) is partly tested by the pins.

**gl-post · SHIP-WITH-NOTES.** The stack runs in the right order (dof, bloom, chroma, tone map, vignette, grain), and type is
drawn after it. The exec level is proven: reveal-exec (r8) is identical to none (r1). The role-preserving inverse tone curve
(dE 0 on 18 packs) is the best colour work in the arsenal. Bloom on the rank-1 box is the moment (r3,c3). S2: chroma, vignette and
grain (r4..r6) cannot be told apart from none at sheet scale. Fine for a garnish, but the sheet proves nothing for them. S2: on
swiss-grid at (r7,c3) chroma splits the ground-plane edge into an orange fringe, so it needs a light-ground skip like bloom's. S2: the
status line is clipped at the left in (r9,c3) and (r10,c3) (the card warns). The field corner crosses the caption in column 1 of every
row. S3 (contradiction): the card's opening says HALF_FLOAT, its pitfalls say no float colour buffer (UNSIGNED_BYTE with 2 stops of
headroom), and gl-instances renders additive density into a HALF_FLOAT framebuffer on the same SwiftShader. One of them is wrong,
which is R-A's open question (a). accum-8 and accum-16 are 3.85 and 6.0 s, over budget and declared offline.
R-C: #1 tone map delivered; #2 accumulation delivered (Halton, over budget); #3 thresholded bloom delivered; #4 grain and vignette
delivered; #6 DoF single-pass (no lens accumulation); #5 baked AO and shadows, #7 SSAO and #8 the reframe/title-safe contract missed.
R-A: T8 and T5 partial; T6 partial (tone map, no density here).

**gl-volume · SHIP.** This is the GL lane that keeps every law visibly. Counts are exact and the 4, 9, 22 and 142 samples outside
the range are named in the header (r1..r5). The tail count is in the display face with its ratio under it, after it. The cut lights
its slice, and the slice is drawn flat with a digit per cell (r3,c3), or says "NO DIGITS" when cells are too small (r4,c3). Sorting is
deterministic and purity holds. S3: the "DENSEST CELL" sub-label is lost among the cubes at (r3,c3). The 1D split "2,735 LEFT ·
16,041 RIGHT" is in the smallest face at (r1,c3). Column 1 is empty by design (commit first).
Frontier: T6 partial (sorted transparency, not OIT; fine at 11k cells); T10 partial (CPU binning); R-D M16 delivered; G5 delivered
in miniature (count, then ratio).

**gl-labels · SHIP-WITH-NOTES.** It solves what seven other cards list as a pitfall ("pins ignore occlusion"): analytic occluders,
chain hysteresis, 0 toggles faster than hold, a hard-cut callout, result/secondary/chrome roles with sizes. The readout counts its own
work ("31 LABELS SHOWN OF 200 ANCHORS · 88 BEHIND A COLUMN · 81 CROWDED OUT", (r2,c1)). S2: at 30+ labels (r2,c3) and (r2,c4) the
frame is clutter at exec level. Leaders cross other labels (A2, D8) and the result plates cover neighbours (438 over the C13 leader).
Exec should cap `maxShown` near 12. S3: no other lane calls it yet, and `kit()` is untested in a film.
Frontier: T7 delivered as a library, not yet delivered to any film or lane. R-D gap row 10 partly covered.

**uncertainty-hop · SHIP.** This is the commit law made visible. Draws are hard cuts with a draw counter (r1). qdots build
in seeded order (r2, r3). In the commit variants (r5, r6) the "?" freeze shows no number, then the count, then the ratio
((r5,c3) and (r5,c4) "commit now", (r5,c5) "4 of 30", (r5,c6) "4 / 30 = 13%"). The straddling dot at the threshold is counted by
the true quantile, which is honest (r6,c6 swiss-grid). S3: the result sits in the body face below the display-face counter "30 of 30
draws", so the hierarchy is inverted at the payoff. Promote the result line. Only one 1D quantity is built (trend HOPs are not).
R-A T4 and R-D G1 delivered (no ghost trail, but ensemble (r4) is the trail form).

**formula-bind · SHIP-WITH-NOTES.** Terms bind by id and travel, operators never travel, and the result is computed from the
sets. The congruence holds: a subset for the ratio (r1), an area for the product (r2), a length for the sum (r3). The "= ?" holds
until compute (c1). S2: mid-flight frames are unreadable. "FLAGGED" smears along its arc at (r1,c4), "GPUS" and "HOURS" knot at
(r2,c4), and "STORAGE" and "EGRESS" string out across the bar at (r3,c4). The card's own fix, lag 0.1-0.15 (0 at exec), should be the
default. S2: numerals land on labels: "120" over "REVIEWED" at (r1,c3), and "$6.0K" over "STORAGE" at (r3,c3). S3: ceti-dark
accent2 denominator dots are dim (r1). R-D G2 delivered. It pairs with G5 (ratio form).

**track-unit · SHIP-WITH-NOTES.** The lint passes on all three variants with area error 0, and the negative control fails as it
should (49 of 50 frames on stack-ring and grid-columns-lamp). Comets, ghosts and the lamp work: (r3,c2) counting 5 of 9 and 98, then
"9 ÷ 98 ≈ 9 %" only after both counts (r3,c3). S2: pooled-split never states the reversal. The end frame (r1,c4) shows 12 slab
totals in 11 px mono and no admitted counts, so the viewer must compare waffle-row fill fractions. Add the lamp per slab, or the
reversal line stack-city has. S2: mid-frames (r1,c2) and (r3,c3) are clouds. The lint checks count and area, not that the frame is
a readable chart, which is what Heer and Robertson's congruence asks for. Say so in the card, or shorten the move. S3: the tag
label "MAN · DEPT F · REJECTED" runs into the WOMEN F slab at (r1,c3) and (r1,c4). stack-ring (r2,c1) and (r2,c2) are identical
frames. R-D G3 and G5 delivered (the lamp lives inside a variant, not as a module). R-A T2 delivered flat.

**scale-anchor · REVISE.** The log zoom with holds, spiral constancy and tile LOD (r3, with tile sums checked against n) is good.
S1 (laws: one clock, brand faithful): at the same t the pack changes the data on screen. ceti-dark shows 63 units and 7 flagged at
(r1,c2), swiss-grid shows 83 and 8. At (r1,c3) it is 1,585 against 1,204, with "frame = 3.40 × bus" against 3.06. The card says why:
ease '' = tokens.tempo.ease. A brand may change the look, never the number at t. Pin the ease in the module. S2: the payoff
lines are in the smallest face: "frame = 26.5 × bus" (r2,c4), "flagged 12,449" (r1,c4), "ruler spans 106 marks" sub-lines. S2: the
anchor is a legend in the left column at its own 15 px/m, not on the crowd panel, so it never sits beside the crowd at the crowd's
scale, which was the Kurzgesagt point. Draw the silhouette or ruler in the panel. S3: the readout column carries 8-10 tiny mono
lines per frame, which is engineer-level chrome.
R-D G4 partial. R-A T1 partial (10^5 as tiles, 2D).

## 3 · Frontier coverage across the wave

| | delivered | partial | missed |
|---|---|---|---|
| T1 unit marks 100k+ | gl-instances | stack-city (LOD), scale-anchor (2D), ribbons (1k) | |
| T2 same marks, new partition | stack-city (3D), track-unit (2D) | | gl-instances (no 100k morph) |
| T3 camera as argument | | camera-rig (instrument, no proving shot) | every other lane uses a fixed orbit |
| T4 uncertainty as motion | uncertainty-hop | | ghost trail on HOP |
| T5 temporal craft | all pure; gl-post Halton accumulation | (accumulation over budget) | per-mark motion streaks |
| T6 OI density + tone map | gl-instances density, gl-post tone map | gl-volume (sorted) | WBOIT |
| T7 coherent labels | gl-labels (library) | | wired into zero lanes |
| T8 DoF as depth cue | gl-post, gl-pointcloud (two copies) | camera-rig focus cue | lens-accumulation DoF |
| T9 data-aware lighting | heightfield, ribbons, stack-city | | baked AO and one shadow (R-C #5) |
| T10 GPU filter or aggregation | | instances, pointcloud brush; volume (CPU bins) | GPU density to cells |
| R-D G1-G4 | G1 hop, G2 formula-bind, G3 track-unit | G4 scale-anchor | |
| R-D G5 ratio lamp | inside track-unit; gl-volume and formula-bind stage it | | no module; stack-city breaks it |

Cross-lane notes. (a) Seven GL cards say "pins ignore occlusion" while gl-labels solves it. (b) There are four instancing routes:
chunked `model(geom, n)` (instances), per-vertex homes (stack-city, pointcloud), raw `drawArrays` (volume) and a CPU batch (ribbons).
Converge on gl-instances' route. (c) DoF exists twice. (d) The float render target question is unresolved (gl-post against
gl-instances). (e) t = 0 is an empty frame in instances, heightfield, pointcloud, stack-city and volume. That is right for the
commit law, wrong as a film's first frame: the film owns it. (f) Exec-clean still holds by omission. No gate row would catch stripes,
grain or fog left on.

## 4 · The three most valuable fixes, ranked by what they buy a film

1. **Wire gl-labels into every gl-* lane, with `reserve` rects for readouts.** It buys legible digits in every 3D film, and "every
   digit on screen is a claim" needs legible digits. It clears the collisions at heightfield (r2,c3) and (r4,c1), stack-city (r1,c4)
   and (r4,c4), pointcloud (r3,c4), volume (r3,c3), instances (r3,c2), ribbons (r2,c3) and camera-rig (r1,c4) in one stroke, and
   turns T7 from a library into a delivered technique.
2. **Count-then-ratio staging plus results out of the smallest face, as one shared helper (the track-unit lamp).** It buys the
   flagship reversal film (Berkeley in stack-city or track-unit) passing the laws: counts land, then %, then "WOMEN HIGHER IN 4 OF 6",
   with the pooled 30 % against 45 % promoted. The same helper fixes ribbons' delay line, scale-anchor's "26.5 × bus" and
   track-unit's missing reversal line, and it becomes R-D G5 as a module. Pin scale-anchor's ease in the same pass so a brand can
   never change a number.
3. **Give gl-instances the second layout (from/to texels plus rank stagger) and a visible subset (minimum pick size, or a halo).**
   This buys T1 and T2 together: 100,000 units that re-partition with identity kept. R-A calls this the pairing that most separates
   frontier from ordinary, and today it stops at 11k boxes (stack-city) or 4.5k marks (track-unit). It also makes flat-100k's
   "1,250 FLAGGED" visible at (r2,c3), which today is a claim with no visible marks.

## 5 · Verdict

The wave moves the factory most of the way to the frontier R-A and R-D describe, and further on the perception half than the GPU
half. Three of R-A's four "what reads as frontier" items now exist and are pure, purity-identical, role-faithful and inside budget:
the population at true scale (gl-instances, 100k in one draw, density without sort), identity across a re-partition (stack-city and
track-unit with a congruence lint), and uncertainty that moves (uncertainty-hop, the commit law made visible). formula-bind and the
track-unit lamp give the "every digit has a formula" and "counts before ratios" laws their first visual carriers, and gl-post's
role-exact tone map plus a provably clean exec level is better than the research asked for. What is still missing is mostly
integration, not invention. The fourth item, the camera move as the argument, has an instrument but no shot that proves a claim. The
label solver is used by no lane. The 100k layer cannot re-partition. The flagship 3D reversal breaks count-before-ratio. scale-anchor
lets a brand change the numbers. DoF and instancing exist in two and four forms. Baked AO, the reframe contract and lens-accumulation
DoF are absent. None of the thirteen lanes has yet been hosted in a kit2 film and gated, so the frontier is proven on contact sheets,
not on a film.


## After the fix round (2026-10-10, orchestrator)
- gl-stack-city: REVISE → SHIP-WITH-NOTES. Every % now lands ≥ 1.5 s after its count (`ratioDelay`), counts in the larger
  or equal face, the pooled readout at disp 28; check(t) OK on 61 samples per variant; purity identical; 0.12–0.28 s/frame.
  Open: split pins crowd at 18 px; the tag label is buried in the treemap and big variants.
- scale-anchor: REVISE → SHIP. The count at any t is the same under every pack (zoom timing from the module's own `ease`,
  not `tokens.tempo`); pairs recorded in the card.
