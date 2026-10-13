---
id: p5-fillgradient
title: "p5.fillGradient"
type: Library
aliases: ["fillGradient"]
sources: [S30, S156, S159, S166, S168]
confidence: low
created: "2026-10-08"
updated: "2026-10-08"
version: "1.x"
---

# p5.fillGradient

## Definition

p5.fillGradient (alterebro) provides linear, radial and conic gradient fills via fillGradient(type, props, ctx). [S168]

## Details

- Maintenance 2026: npm 0.2.0 published 2026-01-08, MIT; about 22 stars. [S159][S168]
- The README example loads p5 1.4.1 and states no version range; conic support in browsers is described as poor. [S168]
- p5 2.x compatibility: unverified. [S168]

## In explainer work

Gradient backgrounds are the cheap way to add depth to explainer frames. [S168]

## Patterns

### Pattern: gradient backdrop
When to use: a flat background needs depth. [S168]
```js
fillGradient('linear', { from: [0, 0], to: [0, height], steps: [color(20), color(60)] });
rect(0, 0, width, height);
```
Pitfalls: README tested on p5 1.4.1; conic poorly supported. [S168]

## Relations

- related_to [[p5-grain]] — finishing layer [S168][S166]
- related_to [[p5js-libraries-directory]] — listed there [S156]
- related_to [[color-spaces-2x]] — alternative route to smooth colour ramps [S30]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S30] — colorMode() reference (p5.js docs (v2.3.3), undated)
- [S156] — p5.js Libraries page (Processing Foundation/p5.js, checked 2026-10-08)
- [S159] — npm registry metadata (p5, p5.sound, p5.brush, p5.grain, p5.js-svg, p5.fillgradient, p5play, tone, ml5, p5.collide2d, p5.createloop, p5.capture, p5.plotsvg, p5.tree, matter-js, roughjs) (npm, queried 2026-10-08)
- [S166] — p5.grain repo (meezwhite / Joseph Miclaus, undated)
- [S168] — p5.fillGradient repo (Jorge Moreno (alterebro), undated)
