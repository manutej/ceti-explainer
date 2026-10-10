# knob-catalogue · every tunable is a knob; names, ranges and practice from the three simpsons-3d drafts

Sources: factory/kit2/README.md (Knobs), build.py `check_knobs`, factory/tools/apply_findings.py, and the knobs as
written in factory/films/simpsons-3d/film.json (52 knobs, final) and drafts/{a (32), b (52), c (52)}/film.json.

## 1. The contract in brief

- film.json: `"knobs": {name: value}` and `"knobs_doc": [{name, range:[lo,hi] | options:[...], step?, what}]`.
- build.py refuses: knobs without a doc entry; a doc entry without a value; value outside range or not in options;
  missing `what`; range not `[lo, hi]` of numbers with lo <= hi; a duplicated name.
- film.js reads `K.knob(name, fallback)` (clamped to range; an option outside `options` falls back) or `K.knobs.name`
  (frozen), once at load (`const KN = {...}`) or per frame. Never hard-code a tunable, never write a knob.
- A knob never carries an on-screen number (digits are claims in claims.json). Counts, rates, labels are not knobs.
- Seconds are absolute film time unless the name says Dur/Step/Hold (a length) - say which in `what`. Start `what`
  with the unit ("s:", "px:", "degrees ...") and say what moves and which direction is bigger/closer/later.
- The evaluator's only numeric lever is a knob. `apply_findings.py` accepts exactly one target per finding:
  `knob` (value inside range/options), `caption_index` (<= 60 chars, no new number that is not a claim value),
  `chapter`/`chapter_index` (new t0 within 2 s, order kept), `brand`/`chrome` (look). film.js, claims.json, beat
  order and on-screen numbers are out of scope. A second finding on the same target in one run is rejected.
- Design ranges as the law's envelope: the range minimum is the legal floor, not a taste. Examples as shipped:
  `pinCount [28, 38]` (must-read floor 28), `pinSub [14, 20]` (secondary floor 14), `pinRate [20, 30]` (round 1
  moved it to 24), `arr0 [16.5, 18]` (never before the commit chapter ends), `hlStart [36, 38]` (count at 36),
  `dv0 [45.5, 50]` (not before the slabs land), `commit` timing is NOT a knob. Time knobs are bounded so the
  beat order, `count.at` and the commit rule (8-16 s) cannot be broken; keep `neonT1`, `revealT` etc. inside a beat.
- A suggested `step` is optional; use it for integers/even counts (`step: 2`) or to stop evaluators proposing
  noise (`0.1` for seconds, `0.05` for 0-1 fractions, `1` for degrees). `options` for modes and easings.
- Every beat that has a camera move, a morph, a reveal or a post pass needs its own timing and look knobs (below).
- Count: 30-50 knobs is normal for a 3D film (a 32, b/c/final 52). A 2d film needs 8-20. Do not pad: a knob nobody
  would move is noise, but any number in `render` that is not a layout constant of the data must be one.
- `__film.info.knobs` lists `{name, value, range|options, step, what}`; `frames.mjs` prints them with the strips.

## 2. Catalogue

"Per beat" = one knob per view/beat (suffix 0/1, Front/Side, or a name for the beat) rather than one global.

### Timing (seconds)
| name (draft names) | range | step | moves | per beat |
|---|---|---|---|---|
| arr0 / arriveT0 / tBuild0 | 16.5-18.5 | .1 | second the first mark of the case arrives (floor: after commit chapter) | CASE |
| arrSec / arriveDur / buildRate | 4-9 s (or 3-9 per s) | .1 | length of the fill; build speed. Counts fill at the same rate for both groups | CASE |
| lit0, lit1 / inkT0, inkDur / tAdmit0, tAdmitDur | 22-29 | .1 | start and end (or length) of the highlight sweep over the counted marks | CASE |
| hookKill / tHookEnd | 3.5-10 | .1 | second the hook payoff (stamp, push-in end) lands | HOOK |
| turn0, turn1 / flyT0, flyT1 / tDollyStart, tDollyEnd | 36.5-50 | .1 | start/arrival of the main camera move; keep equal to split start when the move and the split are one gesture | COUNT |
| split0, split1 / splitT0, riseDur / tUnstack0, unstackDur | 38-48 | .1 | when marks leave the pooled form for the split form; per-item duration | COUNT |
| splitStagger / unstackStagger | 0-1 | .05 | delay between groups as they move (0 = at once) | COUNT |
| trackStart, pairStep, pairHold / dvStep | 0.8-2.6 | .05 | pace of the per-group walk; hold must be below step | COUNT |
| dv0 / pairsT0 | 44.5-50 | .1 | first group call-out; not before the split lands | COUNT |
| hlStart, hlMorph, hlMorphDur, hlStagger, morphDur, morphLead / morphS | .3-1.6 | .05 | headline readout appearance, morph length, left-to-right stagger, lead before the camera arrives | COUNT |
| revealT / tReveal | 50.5-60 | .1 | second of the reveal frame; must meet the reveal caption | COUNT |
| revealDur / neonWidth / neonT0, neonT1 | 1.2-4 | .1 | length of the reveal turn and glow window; post only inside it | COUNT |
| mixT, mixPct | 55-61.6 | .1 | second a follow-up bracket/mix appears, second counts become percentages (counts first) | COUNT |
| capShift | -1..1 | .1 | all captions earlier/later; only if film.js draws captions itself (`captions:false`, `K.caption(t + shift)`) | global |
| idleDeg / orbit | 0-8 / 0-1.2 | .05 | degrees per second of idle drift when nothing is shown (HOOK, COMMIT, MONDAY) | idle beats |
| splitLift / liftArc | 0-200 | 1 | height of the hop a mark makes mid-flight | COUNT |

### Camera
| name | range | step | moves | per beat |
|---|---|---|---|---|
| elev0 / frontEl / camFrontEl | 0-42 deg | 1 | elevation in the front view (higher shows more tops, busier labels) | front view |
| elev1 / sideEl / camSideEl | 4-45 deg | 1 | elevation in the side view (lower flattens a ring through the caption) | side view |
| zoom0, zoom1 / zoomFront, zoomSide | .35-1.4 | .01 | ortho extent multiplier / world units per screen unit (lower = closer) | per view |
| lookY0, lookY1 | -170..-20 | 1 | world y the camera looks at (more negative moves the model down the frame) | per view |
| sideAz / camSideAz / camFrontAz | -30..100 deg | 1 | azimuth of the side/front view | per view |
| turnDeg | 60-120 | 1 | degrees the turntable turns | COUNT |
| turnEase / dollyEase / hlEase | options linear, quad, cubic, expo, sine | - | easing of the turn, dolly, morph | per move |
| camFov, camFrontDist, camSideDist, camHookDist, camWideDist | .5-1.2 rad; 150-2200 | 10 | perspective films: field of view and distance of each shot (smaller = closer) | per shot |
| modelX, modelY | 420-640 / 280-360 | 5 | screen position of the model centre on the 960 x 540 sheet | global |

### Layout (gaps, sizes, scales; world units unless noted)
| name | range | step | moves | per beat |
|---|---|---|---|---|
| boxSize / cell | 4-9.8 | .1-.5 | edge of one counted mark; scales the whole structure | global |
| boxGap | .3-3 | .1 | seam between marks (larger reads as separate items) | global |
| colW, colD, colGap | 8-16, 6-14, 2-10 | 2 | marks across/deep in a pooled column; air between the two columns (even numbers) | CASE |
| slabLayers | 8-26 | 1 | layers in a group block: height every group is normalised to | COUNT |
| slabDepth | 2-6 | 1 | marks deep in a group block (view axis of the side view) | COUNT |
| slabGap | 6-260 | 1-2 | air between groups (the most-used spacing knob; crowded labels) | COUNT |
| pairGap / aisle | 2-110 | 1-2 | gap inside a compared pair / between the two sides | COUNT |
| platterR | 240-420 | 5 | radius of the turntable ring (a ring across the caption line is a legibility cost) | global |
| towerX, splitX, railX, roomSize | 50-1400 | 5 | positions of columns, rail and walls in a scene film | global |
| lightAz, lightEl, lightReach, keyStrength, ambient, fogDensity, reflect | per light | .05 | key light angle/strength, fill, fog, floor reflection (0 = off, saves cost) | global |
| glowStrength | 0-2 | .1 | emissive strength of highlighted marks | CASE |

### Type (units are sheet units or font px as named)
| name | range | step | moves | per beat |
|---|---|---|---|---|
| headSize | 60-170 | 2 | font size of the morphing headline number | COUNT |
| headX, headY | 8-120 / 16-300 | 1 | inset/top of the headline readout on the sheet | COUNT |
| pinCount | 28-38 | 1 | big count in a pin label (must-read floor 28) | per pin |
| pinSub | 14-20 | 1 | small lines in a pin (secondary floor 14) | per pin |
| pinRate | 20-30 | 1 | per-group rates beside the groups (results: never the smallest face) | COUNT |
| revealSize, revealX, revealY | 80-240 px; 300-700; 70-200 | 5-10 | size and position of the extruded reveal numeral | reveal |

### Post (neon/filter)
| name | range | step | moves | per beat |
|---|---|---|---|---|
| neonGain / neonStrength / glowStrength | 0-2 | .1 | strength of the post pass; 0 turns it off (and its cost) | reveal |
| neonRadius | 6-40 px | 1 | reach of the glow | reveal |
| neonThr / neonThresh | .05-.8 | .05 | brightness above which a pixel glows | reveal |
| neonCore | 0-1 | .05 | white-hot core | reveal |
| neonT0, neonT1 (or revealT +- neonWidth) | 54-63 | .1 | window the filter runs in; SwiftShader cost 1.6 s/frame inside it | reveal |

### Look
Not knobs; they are findings targets: `brand` (pack id in arsenal/brands, or `film`), `chrome` (id in factory/kit2/chromes
or factory/chromes, or `none`), both recorded in film.json `look`. `material` is a build flag (ink at exec). A look
choice that must differ per film but is a mode of the renderer (projection `look: ortho | persp`) is an `options` knob.

## 3. What the evaluator used (simpsons-3d findings.r1.json: 11 findings, all applied; findings.r2.json: 5, all applied)

- Round 1: 9 knobs + 2 captions. Timing alignment dominated: `revealT` 55.6 -> 54.4 (reveal caption told the result
  before the picture), `dv0` 46.5 -> 45.5 (stale headline over new evidence), `dvStep` 1.3 -> 1.4, `hlMorphDur` 0.9 -> 0.6
  (half-formed numerals in a third of the frames). Legibility: `pinRate` 20 -> 24 (results in the smallest face).
  Layout/camera: `slabGap` 16 -> 22, `zoom1` 0.86 -> 0.80, `platterR` 270 -> 240, `elev0` 27 -> 20 (ring and labels
  through captions). Captions: 11 (ratio before count -> counts), 10 (frame the reversal in words).
- Round 2: 4 knobs + 1 caption, all fallout of round 1: `zoom1` 0.80 -> 0.83, `elev1` 15 -> 11, `zoom0` 0.56 -> 0.60,
  `slabGap` 22 -> 26 (ring and department letters against the caption line), caption 11 shortened to one line (47 chars).
- Most used: `slabGap` (both rounds), `zoom1` (both rounds), then `revealT`, `dv0`, `dvStep`, `hlMorphDur`, `pinRate`,
  `platterR`, `elev0`, `elev1`, `zoom0`. Findings read frames at 480 x 270, so what they can see: caption collisions,
  caption-versus-picture timing, crowded labels, small result type. Give these a knob each; the order of benefit is
  (1) per-view zoom/elevation, (2) group gap and pin/label sizes, (3) reveal and call-out timing, (4) morph length.
- Each knob change is one finding; make interacting knobs independent (zoom and elevation separate, labels and gap
  separate) so one round of at most two fixes converges. Name the interaction in `what` ("pinRate grows: widen slabGap").
- Not used by the evaluator in either round: neon knobs, light knobs, box geometry. Keep them (cheap) but they are
  not where findings land; timing and framing are.
