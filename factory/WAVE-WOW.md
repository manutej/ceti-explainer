# Wave WOW · from "decent, sometimes great" to the product-demo bar (2026-10-11)

Owner's words after six films shipped: "decent as videos but still not WOW like Claude motion natively ships in product
demos. We may be missing something to really make it stick. Some neat tricks, but not nailed. Consider with meta research
what else we can do, routing subagents to take this up a level, and the latest libraries that would use the strengths of
WebGL and p5.js in a maximally effective way."

## What we have (so the research measures the gap, not the inventory)
- p5.js 2.3.4 vendored (no runtime fetches, by law); kit2 WEBGL renderer at 960×540, pixelDensity 2; render(t) pure;
  frame-stepped export (arsenal/tools/export.mjs, ~0.4 s/frame at 4K) so any per-frame cost is affordable.
- Arsenal: 37 lanes; Wave GL 13 (instances, heightfield, ribbons, pointcloud, stack-city, camera-rig, post, volume,
  labels, uncertainty-hop, formula-bind, track-unit, scale-anchor). gl-post has linear half-float, DoF with depth, bloom,
  grain, vignette, chroma, PBR Neutral tone map, and `renderAccumulated` (temporal sub-frames: motion blur + AA). The six
  wave films use material "ink" and none of the post stack; their camera moves are cubic in-out; text is flat SVG over
  the canvas; transitions are hard cuts; no lighting beyond flat shading; silent by law.
- Grammar: arsenal/frontier/R-E-perspective-shift.md (moves, holds, label rules). Gate G1–G11.

## The question for this wave
What, concretely and measurably, separates our films from the motion that Apple, Linear, Stripe, Vercel, Figma and
Anthropic ship in product demos, and which of those properties can a pure render(t) in p5 WEBGL reach, with which
libraries or techniques, at what cost in page bytes and seconds per frame?

## Lanes
R-W1 motion craft (what makes it stick): principles, timing, choreography, transitions, type, light; a measurable rubric.
R-W2 p5.js 2.x WebGL frontier: what the current p5 (2.3–2.x, 2026) can do that we do not use.
R-W3 libraries beyond p5: what to vendor, what to borrow as technique, with license, bytes, purity and a D-row proposal.
R-W4 cinematic post, camera and light for data pictures: recipes our kit can run headless.
A-W5 (Opus) gap audit: our six films' frames against the product-demo bar, ranked by what it buys a viewer.
Then: a build wave of arsenal lanes for the top gaps, and one film re-cut as the proof, judged against the rubric.

Research files: factory/research/WOW-{MOTION,P5-FRONTIER,LIBRARIES,CINEMATIC}.md and factory/research/WOW-GAP-AUDIT.md.
Egress blocks WebFetch; WebSearch snippets only; grade claims A/B/C; name versions and dates.

## Build wave (2026-10-11, after the five lanes landed)
Research: factory/research/WOW-{MOTION,P5-FRONTIER,LIBRARIES,CINEMATIC,GAP-AUDIT}.md. The audit scores the six films 3–5
of 44 on the rubric (bar 38): every move is cubic in-out over 4.5–11 s, text pops, holds are dead, the post stack is off.
Verdict: the gap is craft inside the frame, not the engine (Claude Motion is code rendered to MP4, like our exporter).
Vendor nothing; write the primitives (≤ 10 KB each), pure in t, seeded, no runtime fetches.

| lane | owns (no other lane edits these) | delivers |
|---|---|---|
| B1 motion-curves | arsenal/patterns/motion-curves/, arsenal/core/timeline.js (EASE table), arsenal/patterns/gl-camera-rig/ (EASE table, ambient drift, settle) | closed-form spring-hero (ζ≈0.7, ≤ 4 % overshoot), spring-snappy, expo-out, emph (0.2,0,0,1) bezier solver, ramp (time-warp), settle, anticipate; stagger(linear, centre, grid); demo + card + sheet |
| B2 text-reveal | arsenal/patterns/text-reveal/, kit2 overlay helpers in factory/kit2/text-reveal.js (new file, opt-in) | masked rise / per-line stagger for every label and panel; dot → draw-on leader (≥ 6 frames) → label; removal at 0.6×; tabular-nums; count-in of real counts with a weight pulse on landing (ratios never roll); G11-safe; demo + card |
| B3 beat-grid | factory/kit2/build.py + README (film.json `beat`), factory/tools/gate.mjs (new row G12: beat snapping, caption hold ≥ 1.3 s + 0.06 s/char, WARN first), skills/atelier-* references that name gate rows | the pulse a silent film can carry; the caption rule enforced |
| B4 gl-look | arsenal/patterns/gl-look/ (new), arsenal/patterns/gl-instances/ (rim/fresnel + baked AO in the instance shader, opt-in), factory/kit2 material "hero" (manager level only; exec stays ink) | luminance ladder floor gradient + plate, key/fill/rim, planar contact shadow, seeded grain/dither, tone map via gl-post; measured s/frame; demo + card |
| B5 export-accum | arsenal/tools/export.mjs, arsenal/patterns/gl-post/pattern.js (renderAccumulated cut clamp), factory/tools/frames.mjs (shutter flag) | accumulation motion blur + temporal AA on export (shutter 0.35, N 8/16 adaptive, Halton jitter, cut clamp), bt709 colour tags, samples logged in export.json |
| B6 re-cut | factory/films/pass-every-time/ (Opus, after B1–B5) | the proof: hero moves 0.8–1.6 s on springs with the freed time given to holds after landing, text reveals, beat grid and captions rebalanced, hero material at manager level, accumulation export; REVISION-wow.md with before/after |
| B7 judge | factory/research/WOW-SCORE-pass-every-time.md (Opus, blind) | rubric score before and after, per property, from the strips |

Laws hold: one clock, render(t) pure, seeds fixed; counts before ratios; every digit a claim; silent with captions; one
honest line; the CETI card last; exec level ink and clean; vendored p5 and fonts only. New decision rows at ship: D14 hero
look (manager level), D15 accumulation-aware export, D16 beat grid and G12.

## Results so far (2026-10-11) and the preview rule
- Blind rubric scores for pass-every-time (factory/research/WOW-SCORE-pass-every-time.md): the 2026-10-10 ship 2/44;
  round 1 (hero cut) 13/44 with one starred zero (settle) and four regressions (a smeared 0.8 s re-sort, rolling non-claim
  counters, text at 255, shimmering grain); round 2 fixes those (settle tails, 1.6 s re-sort, registered count-ins, text
  ≤ 92 %, grain 1–1.4 %, two-layer shadows, carried joins, shot scales, a ramp, rhythm) and awaits its score.
- Owner on round 1: "much better, more crisp feel and professional".
- Preview rule (so reviews never wait on accumulation): an iteration cut exports a 1080p preview with `--samples 2`
  (about 1 s/frame); only the final master gets `--samples auto` with the 4K path. Round 1 and 2 spent 5 and 8 hours of
  wall time almost entirely in accumulation exports (7–13 s/frame with 9–33 sub-frames).
