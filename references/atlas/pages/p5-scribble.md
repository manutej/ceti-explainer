---
id: p5-scribble
title: "p5.scribble"
type: Library
aliases: ["p5.scribble.js", "hand-drawn explainer look"]
sources: [S137, S157, S159, S163, S167]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# p5.scribble

## Definition

p5.scribble.js (generative-light) gives hand-drawn, sketchy 2D primitives (scribbleLine, Curve, Rect, RoundedRect, Ellipse, Filling) as a port of Processing's handy. [S167]

## Details

- Parameters include bowing, roughness and maxOffset, and it respects randomSeed for reproducibility. [S167]
- It is MIT with 24 commits and about 277 stars; the npm name p5.scribble did not resolve in the registry query. [S167][S159]
- p5 2.x compatibility and 2026 maintenance: the README names no version and nothing was tested. [S167]

## In explainer work

For a whiteboard feel call randomSeed at the top of draw so strokes do not shimmer every frame, which also keeps export reproducible. [S167][S137]

## Patterns

### Pattern: whiteboard-look diagram
When to use: sketchy diagrams matching a whiteboard feel. [S167]
```js
const s = new Scribble(); s.roughness = 1.5;
function draw() { randomSeed(7); s.scribbleRect(50, 50, 120, 80); }
```
Pitfalls: unseeded randomness makes lines shimmer; check 2.x behaviour yourself. [S167]

## Relations

- alternative_to [[rough-js]] — same lineage from Processing handy [S163][S167]
- alternative_to [[p5-brush]] — sketchy versus painterly [S157][S167]
- related_to [[pure-function-of-t]] — seeded strokes keep frames pure [S167]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S137] — Export Pipeline (p5js agent-skill reference) (third-party "hermes-agent" skill doc, hosted on a personal domain, undated)
- [S157] — p5.brush repo (Alejandro Campos Uribe, undated)
- [S159] — npm registry metadata (p5, p5.sound, p5.brush, p5.grain, p5.js-svg, p5.fillgradient, p5play, tone, ml5, p5.collide2d, p5.createloop, p5.capture, p5.plotsvg, p5.tree, matter-js, roughjs) (npm, queried 2026-10-08)
- [S163] — rough.js repo (Preet Shihn / rough-stuff, undated)
- [S167] — p5.scribble.js repo (generative-light, undated)
