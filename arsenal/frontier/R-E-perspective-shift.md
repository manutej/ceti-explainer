# R-E · the grammar of perspective-shift data storytelling · 2026-10-10

Purpose: let a drafter COMPOSE a new move from parts, not copy women-and-children, a-bell-from-dice or simpsons-3d.
Method and honesty. WebSearch (extended) worked; WebFetch failed on every host (getaddrinfo ENOTFOUND), so no page was
opened: V = finding seen in search-result text, S = secondary report, U = from memory. Local facts (L) are read from
arsenal/patterns/gl-*/card.md and factory/films/*/film.json. Anything marked PROPOSED is a design default of this note,
not a finding: verify it with a check frame before it becomes law. Complements R-D (moves) and R-A (GPU).

## 0. The grammar in one page
A move is a sentence: **[data operation] under [camera path], holding [invariant], landing on [view]**, then a settle.
- Data operations (what happens to the marks): re-partition (pooled -> split), re-sort (same marks, new key), re-stack
  (rows -> heights), re-scale (units per mark, axis, zoom), re-project (perspective -> ortho -> plan), slice (cut plane),
  aggregate / disaggregate (one -> all, all -> one). Looking along an axis of a counts array IS a sum over that axis.
- Camera verbs (gl-camera-rig L): orbit (az, el, radius), dolly (push/pull), crane (straight rise, aim follows), look-at
  (a data point), tilt (elevation change: plan -> elevation), focus pull (rack), dolly-zoom (vertigo), key / cut (raw pose).
- Five invariants, checked every move (3Blue1Brown's Transform keeps ONE object and bends it; TransformMatchingShapes
  moves matched parts and fades the rest [E1][E2] - we allow only the first, so no mark ever fades in or out mid-move):
  I1 same marks (id-stable; a unit keeps its path, `check(t)` where the lane has it); I2 same count (N on screen or in
  the readout before and after); I3 same scale (1 mark = k units never changes inside a move; LOD says so); I4 same
  world (no re-layout of unmoved marks; the camera moves, the data op is the only other change); I5 same lens (fov
  and projection fixed inside a move unless the move IS the lens, P10/P11).
- Pairing table (data op x camera): re-partition x orbit <= 90 deg (best), hold (ok), dolly (avoid: parallax of marks in
  flight), cut (never: identity lost). Re-sort x hold or <= 3 deg drift (best). Re-stack x tilt plan->elevation (best).
  Re-scale x dolly or ortho zoom (best). Re-project x tilt, ortho swap. Slice x hold + slow orbit. Aggregate x look-at
  then dolly out. Rack focus pairs with NO data op. Cut only when the anchor mark keeps its screen place (P13).
- Evidence for why (V unless marked): object constancy and valid in-between frames [E3][E4][E5]; viewpoint animation
  helps users rebuild the spatial layout, with no time penalty [E6]; story-driven camera and resolution of scale are
  named cinematic techniques, author-defined tracks dominate (16 of 22 article examples) [E7]; immersion raises interest
  and persuasion, NOT understanding [R-D S1]; depth cues cost accuracy next to neighbours [E8]. So the camera carries
  where-to-look and what-is-the-whole; the number is read where the view is flat and still.

## 1. Catalogue of moves (13). Each: Learns/Holds | Path/Op | Lanes+knobs | Breaks
P1 **Plan-to-elevation tilt** (a-bell 40-43 s plan, 52-55 s side)
 Learns: from above, 26 piles have equal footprints (the belief); from the side, 17 and 18 tower (the count). Holds: I1-I3, same az.
 Path: orbit el 89 -> 4 round a fixed centre, 3 s inout. Op: re-stack (footprint -> height) / re-project.
 Lanes: gl-instances `layout: stack`, gl-camera-rig orbit; knobs camPlanEl 89, camPlanAz, camPlanT0/T1, camSideEl 4, camSideT0/T1.
 Breaks: el <= 8 deg hides back rows; perspective foreshortens tops (print the count on the tallest pile, land per P10).
P2 **Quarter-turn re-partition** (women-and-children 24 -> 102 deg; simpsons-3d)
 Learns: the pooled rate flips once the same boxes are split. Holds: box count (`check(t)` ok, unitsResidual 0 at k=1), no fade.
 Path: orbit <= 90 deg, >= 4 s, elevation constant, while boxes travel. Op: re-partition (group -> class or department).
 Lanes: gl-stack-city `split rate|count`, `layout`, `beats.move [0.52,0.74]`, `dur` 8-40, `stagger` <= 0.25, `lift`, `elev`, `drift`, `az`.
 Breaks: pooled label covered the unlit top of a column (W&C open item); 12 split pins at 18 px crowd small slabs; no bottom face.
P3 **Marginal pair** (simpsons-3d: front view men ahead 30-40 s, side view women ahead in 4 of 6, 48-58 s)
 Learns: two axis-aligned views of one 3-way count array give opposite headlines. Holds: ortho or fov <= 35 deg, same scale.
 Path: orbit 90 deg between two held stops (az 0 / 90). Op: aggregate / disaggregate by projection (sum over an axis).
 Lanes: gl-stack-city bars `az`, `elev`; gl-volume `orbit [az0,az1]`, `elev`, 3-D counts. simpsons-3d predates the lanes (webgl-scene + camera).
 Breaks: no label is readable mid-turn; back pairs hide in the side view; the front view must not be called "the answer".
P4 **Re-sort in place** (a-bell 28-50 s: by first die = 6 flat piles of 16,519-16,797; by sum = 26 piles)
 Learns: the pile shape belongs to the sorting key, not to the marks. Holds: N = 100,000, only order changes, camera still.
 Path: hold (oblique 24 deg, zoom drift 1.05 -> 1.15). Op: re-sort / re-partition by key.
 Lanes: gl-instances `layout`, `order seeded|given|value`, `countIn`, `win`; knobs camObliqueEl, camObliqueZoom, camStartZoom.
 Breaks: viewers track ~4 targets [E9], so the CLOUD is the figure; a moving camera on a 100k flow buries it; zoomed-out marks smear.
P5 **Push-in and pull-back** (a-bell 58-63 s tail, 66.6-70 s wide)
 Learns: 1,655 of 100,000 become countable only when large; the pull-back returns the denominator. Holds: other piles stay (dimmed).
 Path: look-at + dolly, 5 s, ease inout (expo to push). Op: re-scale (view) + disaggregate (select the tail).
 Lanes: gl-camera-rig look-at/dolly; gl-instances `brush`, `pick`, `dim`; gl-volume `tail`, `tailAxis`; knobs camTailTarget 21, camTailDist 2400, camTailZoom 2.3, camWideZoom 0.75.
 Breaks: near piles look taller in perspective (the tail is magnified, not just nearer); dist < hmax puts the eye among boxes; thin piles lose pins (a-bell: 4 of 6 shown).
P6 **Cut-plane sweep** (a-bell 68-76 s: a cut travels along the sums, counting)
 Learns: a running total accrues in the order the marks sit. Holds: lit cells sum to the exact N (tail snapped to a bin edge).
 Path: hold, or <= 10 deg slow orbit. Op: slice + cumulative aggregate.
 Lanes: gl-volume `cutIn`, `cutFrom`, `cutTo`, `cutDim` (dims, never removes), `tailIn`, `ratioAt` (after the count); knobs volCutIn, volCutTo, volCutDim.
 Breaks: the readout showed one sum at a time, not a running tally (a-bell open item); a camera move during the sweep hides the front.
P7 **Street-to-aerial crane** (gl-camera-rig `crane`, `sequence`; no shipped film)
 Learns: one mark at eye height (the human-scale anchor), then the pile it belongs to. Holds: I3 strictly (mark size in world units).
 Path: straight rise, aim follows 12 %, 5-6 s. Op: re-scale (view only), no data change.
 Lanes: gl-camera-rig `crane` (`rise`, `follow`); gl-instances `waffle`/`stack`; add a ruler tick (scale-anchor lane, R-D rank 4, not built).
 Breaks: a ground plane doubled s/frame on SwiftShader; foreground parallax magnifies near marks; text waits for the aerial.
P8 **Follow one mark** (gl-stack-city `tag`)
 Learns: one unit keeps its identity through the re-partition, then it is one of 4,526. Holds: the tag rides its real path, plus ghost of its old home.
 Path: look-at the tag, then dolly out. Op: aggregate <-> disaggregate (one <-> all).
 Lanes: gl-stack-city `tag [{g,c,j}]`, `checkLine`; gl-camera-rig look-at `target`; 2-D twin: track-unit (flat, evidence-first, R-D M1).
 Breaks: tag outline shows through slabs by design; "ONE BOX = k" is buried in the treemap; label must land after the settle.
P9 **Rack focus between planes** (gl-camera-rig `focus-pull`, gl-post DoF via `rig.dof`)
 Learns: which plane carries the evidence and which the claim. Holds: geometry and camera frozen. Path: focus only. Op: none (attention).
 Lanes: gl-camera-rig `focus` (front -> back -> middle), `aperture` 0-1; gl-post. Off by default at exec level (ink and clean).
 Breaks: blur defeats digits; it persuades more than it explains [R-D S1]; a label outside the focal plane goes soft.
P10 **Land flat** (persp -> ortho -> plan or elevation; rig `ortho-orbit`, a-bell 86-91.5 s `camFlat`)
 Learns: values read without perspective distortion. Holds: I3, I5 (the lens changes once, announced). Path: orbit into an axis-aligned ortho pose.
 Op: re-project. Rule: every 3-D sequence ENDS on a view where the film's key numbers are read.
 Lanes: gl-camera-rig script `proj: ortho`; gl-instances `cam {proj, az, el, zoom}`. GAP: no perspective<->ortho tween; swap at a P13 cut.
 Breaks: a-bell's tilt/flat keys are perspective (camFlatEl 3, camFlatAz 20): comparisons across depth still lie by a few percent.
P11 **Dolly-zoom** (rig `dolly-zoom`: dist 1,300 -> 330, fov 18 -> 64 deg)
 Learns: apparent depth and size relations are products of the lens (the honest-limits move). Holds: subject width constant. Path: dolly + fov.
 Op: re-project (lens only). Use at most once, never under a number, never as decoration.
 Lanes: gl-camera-rig `dolly-zoom`; knobs follow the rig rule `cam<Id><Param>` (fov, dist, t0, t1). Breaks: nausea, persuasion; background mark counts stay but read as moving.
P12 **Ambient orbit** (3Blue1Brown ambient rotation [E1]; W&C `orbitAmp 3`, `orbitPeriod 60`; stack-city `drift` 0-10)
 Learns: depth is real (motion parallax) and a held number does not look frozen. Holds: everything. Path: constant rate, amplitude <= 3 deg (shipped).
 Op: none. Lanes: gl-camera-rig `orbit-lite`; gl-stack-city `drift`; W&C knobs az0, az1, orbitAmp, orbitPeriod.
 Breaks: label solver flicker if the rate is high; PROPOSED cap 1 deg/s under any must-read number; stop during a count-in.
P13 **Match cut** (gl-camera-rig `cut`/`key`; gl-labels callout hard-cuts between anchors)
 Learns: a new framing with zero travel; use when a path would cross occluders or turn > 90 deg. Holds: an anchor mark keeps its screen place and size.
 Cut rules from film: >= 30 deg between framings or it reads as a jump; keep screen direction (left-to-right group order never flips: 180 deg rule) [E10].
 Evidence is mixed: continuous motion keeps spatial awareness, cuts can disorient with few landmarks but track rotation better [E11].
 Breaks: no shared landmark; labels not re-solved at the cut (hard-cut them, P-rule R5); a cut inside a re-partition destroys I1.

## 2. Text in 3D scenes: anti-overlap rules (R1-R10)
Observed breakage in shipped films (L): pins cross-fading over each other (simpsons-3d 47 s, 52.5 s); pooled label over an unlit
column top (W&C); 12 pins at 18 px colliding on small slabs; only 4 of 6 first-die pins shown (a-bell); 100,000 readout and
agreement lines in small faces. Temporal coherence outranks per-frame optimal placement [E12]. N is in sheet units (960 x 540).
R1 **Solve in screen space first.** Project with `rig.worldToScreen` (max 0.009 px vs p5) then `gl-labels.solve`: greedy, 24
   candidates (8 directions NE first x 3 leaders), boxes and leaders must miss placed boxes, anchors and `reserve` rects.
R2 **Never two must-read numbers close.** Role `result` (>= 28 px disp) at most 2 on screen; PROPOSED N: padded boxes (pad 12)
   disjoint and centres >= 56 units apart (2 x cap height); the pair must be a comparison, else show them in separate beats.
R3 **One new number per hold.** Count first; its ratio >= 1.5 s later (`ratioDelay` floor 1.5); results never in the 10-12 px face.
R4 **Captions band reserved.** Caption, readout and CHECK line are `reserve` rects read from the kit, not hard-coded; frame the
   scene (`fit`, `lookY`, `zoom`) so the tallest label stays out of the band at every sampled t (30 fps sweep).
R5 **Hard cut on viewpoint change, never cross-fade.** At move start labels cut off; they cut on after the settle (>= 1.0 s).
   The callout hard-cuts between anchors (shipped, chain never crosses a cut). Cross-fading two values shows one number morphing.
R6 **Pins drop when the camera tilts past a threshold.** PROPOSED: drop every pin while |d el/dt| > 12 deg/s or |d az/dt| > 15 deg/s,
   when el < 8 deg (grazing, columns hide anchors) or el > 80 deg (plan, tops coincide). `worldToScreen` ignores occlusion:
   pass AABB `occluders` to the solver instead of trusting a pin's `on` flag.
R7 **Budget.** `maxShown` <= 12 at rest (W&C), <= 6 within 1 s of a move; `hold` 8 frames (0.27 s Schmitt debounce), `leader` 20;
   `sticky: window` once the film passes about 60 s (chain cold-seek is O(t x fps)).
R8 **Stable side.** A label keeps its quadrant through a move; if it cannot, hard-cut it (R5). No label over the unlit part of
   the mark it names: add that region as an occluder rect.
R9 **Flat text only.** Labels are drawn flat after resetMatrix, never as world-space text, except a ground plate seen near plan.
R10 **Gate it.** A sweep of `counts.overlap` and `crowded` per frame; any frame with two `result` boxes closer than R2 fails.
   Open gap: the solver is blind to camera velocity; R6 needs a velocity input (a knob `pinDropRate`, not built).

## 3. Storyboard template: three views of the same marks (2-3 min; shown at 150 s)
View 1 **the belief**: the framing in which the common headline is true (pooled, plan, equal footprints, whole pile).
View 2 **the count**: the framing in which every unit is countable (oblique, close, lit vs unlit; counts before ratios).
View 3 **the reversal**: the partition or projection that flips the conclusion; end by returning to view 1's pose (bookend).
| t (s) | beat | view / camera | marks and data op | new number (hold) |
|---|---|---|---|---|
| 0-8 | hook | wide, STILL (no move before 8 s) | 3 s in, count-in begins | none, a question caption |
| 8-35 | V1 belief | pooled, oblique 24 deg, ambient <= 3 deg | all N counted in (I2) | N, then headline % >= 1.5 s later (2.5 s) |
| 35-40 | move 1 | P1 tilt or P12 settle | none | none (settle >= 1.5 s) |
| 40-62 | V2 count | elevation, held | re-sort or re-stack (P4) | the 2-3 counts that carry the claim (2.5 s each) |
| 62-70 | move 2-3 | P5 push-in, then settle | disaggregate one subset | subset count, then % (2.5 s each) |
| 70-82 | move 4 | P5 pull-back to the whole | denominator restored | N again, `ratioAt` after the count |
| 82-110 | V3 reversal | P2 or P3 turn (<= 90 deg, >= 4 s) | re-partition under the turn | the flipped numbers, one per hold |
| 110-125 | move 6 | P10 land flat, ortho | none | the figure to quote (2.5 s, still) |
| 125-140 | bookend | return to V1 pose (P13 cut or orbit back) | same N, new labels | "the same N people" line |
| 140-150 | close | still | none | the honest-limits line, then the CETI card last |
Timing rules (PROPOSED unless cited):
T1 Hold >= 2.5 s, camera still, on any new number; shipped captions run 4-6 s (L), so the digit sits through the caption.
T2 <= 1 move per 8 s, start to start. Audit of a-bell camera starts (L): 26, 40, 52, 58, 66.6, 70, 86 s: gaps 14, 12, 6, 8.6, 3.4, 16;
   the 6 s and 3.4 s gaps break T2 (wide ends at 70 s as tilt starts: zero settle). Budget 6-8 moves for 150 s, 3-6 s each.
T3 Settle >= 1.5 s after every move: no motion beyond ambient <= 1 deg/s; labels (R5) and numbers wait for it.
T4 Ease inout always, expo for pushes; never linear: slow-in/slow-out drew 38 % of correct answers, constant 31 %, fast 15 % [E13].
T5 One change at a time: camera OR partition, except P2/P3 where the turn and the box travel share one beat; never also
   change colour, scale or labels inside it. Stagger <= 0.25: staggering did not help tracking and can hurt it [E14].
T6 Slow the crowd: lengthen a move while many marks cross (adaptive slowing [E13]); the 100k re-sort needs the camera still (P4).
T7 Staged beats help identification at some cost in time [E15]: stage re-sort, then turn, then labels. Count / sum / max
   transitions are confused with each other [E15]: caption which operation it is ("sorted", "summed", "counted").
T8 Landings: every move ends on a held pose with the same az/el/zoom as a stored key, so a seek lands identically (pure of t).
Before a drafter composes a new move: name the sentence of section 0; list I1-I5 and how each is checked; choose the landing view;
write the label policy (R5-R6) and the settle; set knobs with t0/t1 first, shape second; run the 30 fps sweep (R10).

## 4. Sources (V seen in result text · S secondary · U memory/unverified)
E1  V manim (3b1b) ThreeDScene/camera: `move_camera` animates, `set_camera_position` jumps; ambient rotation; ManimGL `camera.frame`,
    `set_euler_angles`: https://docs.manim.community/en/stable/reference/manim.scene.three_d_scene.ThreeDScene.html ; https://github.com/adithya-s-k/manim_skill/blob/main/skills/manimce-best-practices/rules/camera.md ; https://3b1b.github.io/manim/getting_started/whatsnew.html
E2  V TransformMatchingShapes (matches by normalised point-hash; `transform_mismatches`, `fade_transform_mismatches`, `key_map`; fade behaviour of the
    rest NOT confirmed): https://docs.manim.community/en/stable/reference/manim.animation.transform_matching_parts.TransformMatchingShapes.html
E3  V Heer and Robertson, Animated Transitions in Statistical Data Graphics, TVCG 2007 (taxonomy, staging, two experiments: animation improves perception):
    https://idl.cs.washington.edu/files/2007-AnimatedTransitions-InfoVis.pdf ; https://www.microsoft.com/en-us/research/publication/animated-transitions-in-statistical-data-graphics/
E4  V Tversky, Morrison, Betrancourt 2002, congruence and apprehension: https://hci.stanford.edu/courses/cs448b/papers/Tversky_AnimationFacilitate_IJHCS02.pdf
E5  V Gemini (grammar for transitions): https://arxiv.org/pdf/2009.01429 ; Robertson 2008, animation vs small multiples: https://dl.acm.org/doi/10.1109/TVCG.2008.125
E6  V Bederson and Boltman 1999, animation helps rebuild the information space, no time penalty (flat space, no zoom): https://www.cs.umd.edu/hcil/jazz/learn/papers/CS-TR-3964.pdf
E7  V Conlen, Heer et al., Cinematic Techniques in Narrative Visualization (50 examples; in-situ narrator, resolution of scale, anthropocentric
    perspective, story-driven camera): https://arxiv.org/abs/2301.03109 ; GeoCamera https://arxiv.org/pdf/2303.06460
E8  V 3-D depth cues in bar charts, gaze and accuracy: https://doi.org/10.3390/digital4040046 ; Talbot et al. bar-chart perception: http://vis.cs.ucdavis.edu/vis2014papers/TVCG/papers/2152_20tvcg12-talbot-2346320.pdf
E9  V Multiple object tracking, about 4 targets, falls with speed and proximity: https://link.springer.com/article/10.3758/s13414-017-1338-1 ; https://perception.yale.edu/papers/99-Scholl-Pylyshyn-CogPsych.pdf
E10 V 30-degree and 180-degree rules, screen direction: https://en.wikipedia.org/wiki/30-degree_rule ; https://en.wikipedia.org/wiki/180-degree_rule ; https://en.wikipedia.org/wiki/Continuity_editing
E11 V Viewpoint transitions and spatial awareness (animated interpolation helps awareness, adds sickness; teleport tracks rotation better; ROI alignment
    across cuts preferred): https://www.researchgate.net/publication/329332173_Scene_Transitions_and_Teleportation_in_Virtual_Reality_and_the_Implications_for_Spatial_Awareness_and_Sickness ; https://dl.acm.org/doi/full/10.1145/3613904.3642412 (VR, not film: transfer is an assumption)
E12 V Vaaraniemi, Treib, Westermann, temporally coherent labelling (coherence supersedes optimal placement): https://dl.acm.org/doi/10.1145/2345316.2345337
E13 V Dragicevic et al., Temporal Distortion for Animated Transitions, CHI 2011 (SI/SO 38 %, constant 31 %, FI/FO 15 % of correct answers;
    adaptive best when complexity is at the endpoints): https://dl.acm.org/doi/10.1145/1978942.1979233
E14 V Chevalier, Dragicevic, Franconeri, Not-so-Staggering Effect, TVCG 2014: https://visualthinking.psych.northwestern.edu/publications/ChevalierDragicevicFranconeri2014.pdf
E15 V Kim, Correll, Heer, Animated Transitions to Convey Aggregate Operations, CGF 2019: https://onlinelibrary.wiley.com/doi/abs/10.1111/cgf.13709
E16 V Ciechanowski: bare WebGL, hand-made animation, drag and sliders, camera `up` aligned to the body's axis (HN thread, a forum quote - S):
    https://ciechanow.ski/ ; https://news.ycombinator.com/item?id=27000223
E17 V Bret Victor, Up and Down the Ladder of Abstraction (move between concrete and aggregate via one control variable; avoid staying on the ground
    or in the clouds - read via secondary pages): https://transportist.org/2011/10/12/up_and_down_the_ladder_of_abst/ ; original essay URL https://worrydream.com/LadderOfAbstraction/ (U, not opened)
E18 V NYT three-story-controls (CameraRig pan/tilt/dolly, scroll-scrubbed camera animation, story-point transitions, Camera Helper): https://github.com/nytimes/three-story-controls ;
    NYT Beirut piece (aerial photos -> 3-D render of the scene before the blast; moviescroller): https://data.europa.eu/apps/data-visualisation-guide/scrollytelling-moviescroller
E19 V Reuters Graphics tools include Cinema 4D for 3-D (Design Week 2020, no piece-level camera detail): https://www.designweek.co.uk/issues/27-january-2-february-2020/in-house-teams-how-reuters-graphics-visualises-catastrophic-world-events/
E20 V Apple Keynote Magic Move (objects on both slides move, the rest fade; Keynote help says it does not apply to charts): https://support.apple.com/guide/keynote/add-transitions-tanff5ae749e/mac ; https://macmost.com/creating-animated-magic-charts-in-keynote.html
Not found, so not claimed: piece-level camera moves of FT, Bloomberg or Reuters 3-D graphics; Apple keynote data-animation craft (U).
Local: arsenal/patterns/{gl-stack-city,gl-camera-rig,gl-instances,gl-volume,gl-labels}/card.md ; factory/films/{women-and-children,a-bell-from-dice,simpsons-3d}/{film.json,NOTES.md,MEASURES.md,PROTOTYPE.md} ; arsenal/frontier/R-A-gpu-dataviz.md, R-D-moves.md.
