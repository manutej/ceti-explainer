---
id: pure-function-of-t
title: "Pure function of t"
type: Concept
aliases: ["scrubbable animation", "stateless frame", "Frame as a function of time", "Deterministic frame clock", "Pure-function-of-t draw"]
sources: [S129, S131, S135, S137, S139, S316, S321]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# Pure function of t

## Definition
A pure function of t is a design in which every frame's image depends only on a playhead (or frame index) and fixed seeds, not on accumulated state or the wall clock; it is a synthesis across the sources, not a p5 construct [S135][S139].

## Details
- It is how canvas-sketch frames a scene: `time`, `playhead` (0..1 when duration is fixed) and `frame` are provided, and drawing is derived from them [S139].
- Anything mutated across frames (particles, accumulators, `random()` inside `draw()`) breaks scrubbing and backward seeks [S137] (inference).
- p5 offers no native timeline; hand-rolled playheads are the observed norm, with GSAP timelines and canvas-sketch-style playheads borrowed in practice [S139] (inference).
- Derived values should be computed inside the frame function each time and never stored, so each frame needs no history [S316] (inference).
- Seed randomness per frame or per element so output does not depend on render history [S321][S316].

## In explainer work
It is the foundation for scrub bars, chapter jumps, unit-testable frames and frame-accurate export [S139][S131]. Express beats as intervals on a global t and eased local progress [S137].

## Patterns
Frame function plus clock.
```js
const N = 120;
function setup() { createCanvas(400, 400); randomSeed(7); noiseSeed(7); noLoop(); }
function frameAt(t) {                     // t in [0,1)
  background(20);
  const r = map(cos(t * TWO_PI), 1, -1, 40, 120);
  circle(width / 2, height / 2, r);
}
function draw() { frameAt(((frameCount - 1) % N) / N); }
```
Pitfalls: check the `frameCount` off-by-one in your version; normalise by `N`, not `N - 1` [S129][S135].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- depends_on [[normalized-time]] — the playhead it reads [S135]
- enables [[frame-stepped-export]] — any frame can be rendered independently [S131]
- depends_on [[seeded-determinism]] — randomness must also be a function of t [S321]
- conflicts_with [[millis]] — wall-clock reads break purity [S137]
- related_to [[explainer-engine-blueprint]] — the blueprint builds on this stance [S316]

## Sources
- [S129] — frameCount
- [S131] — Best way to export an animation from a p5.js sketch in 2026
- [S135] — FOTD: loopsin
- [S137] — Export Pipeline (p5js agent-skill reference)
- [S139] — canvas-sketch: Animated Sketches
- [S316] — Motion Canvas tutorial part 1
- [S321] — Remotion `useGsapTimeline()`
