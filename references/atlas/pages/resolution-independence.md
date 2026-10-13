---
id: resolution-independence
title: "Resolution independence"
type: Concept
aliases: ["relative coordinates", "Resolution-relative geometry"]
sources: [S131, S272, S367, S374, S392]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# Resolution independence

## Definition
Resolution independence means drawing relative to canvas size so the same sketch fills any viewport or output size; Art Blocks requires it and Fidenza scales geometry against a 2000-unit reference width [S374][S367].

## Details
- Art Blocks requires output to fill any viewport using relative coordinates, redrawing on resize via `windowResized()` [S374].
- Fidenza keeps a 1.2 height-to-width ratio and scales sizes and stroke weights against the reference width [S367].
- `pixelDensity` differences change output size unless pinned; the fxhash guide suggests `pixelDensity(1)` [S392].
- On a 2x display `createCanvas(w, h)` already yields 2x pixels, so output size differs by machine unless density is set explicitly [S272].

## In explainer work
Render the same scene at 1080p for video, 4K for stills and a phone-sized embed by multiplying everything by `s = width / REF` [S367][S374].

## Patterns
```js
const REF = 2000; let s;
function setup() { createCanvas(windowWidth, windowHeight); s = width / REF; }
function draw() { strokeWeight(4 * s); circle(width / 2, height / 2, 300 * s); }
function windowResized() { resizeCanvas(windowWidth, windowHeight); s = width / REF; redraw(); }
```
Pitfalls: hard-coded pixel offsets break the scale [S367].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- related_to [[pixel-density]] — pin it for stable output [S392]
- related_to [[hi-res-render]] — same scene at multiple sizes [S131]
- related_to [[seeded-determinism]] — twin Art Blocks requirement [S374]
- related_to [[art-blocks]] — origin of the rule [S374]

## Sources
- [S131] — Best way to export an animation from a p5.js sketch in 2026
- [S272] — Basic PPI Question
- [S367] — Code Review: Fidenza by Tyler Hobbs
- [S374] — Building Your Project (artist docs)
- [S392] — Beginner's guide to fxhash using p5.js
