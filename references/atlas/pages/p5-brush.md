---
id: p5-brush
title: "p5.brush"
type: Library
aliases: ["p5.brush.js"]
sources: [S137, S156, S157, S159, S167]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# p5.brush

## Definition

p5.brush (Alejandro Campos Uribe) provides custom brushes, natural fills, hatching and vector-field strokes for p5, and is the clearest 2.x-native add-on. [S157]

## Details

- Maintenance 2026: npm 2.2.3 published 2026-09-20 with a peer dependency on p5 ^2.2, depending on simplex-noise; MIT. [S159][S157]
- p5 2.x compatibility: the p5 build requires p5.js 2.x and a WEBGL canvas; a standalone build needs only WebGL2. **[2.x]** [S157]
- brush.add() returns a Promise so setup must be async for image brushes; in instance mode call brush.instance(p). **[2.x]** [S157]
- It is listed in the libraries directory. [S156]

## In explainer work

It supplies a hand-painted editorial look for explainer diagrams, but its WEBGL requirement and per-frame cost mean seeded, frame-stepped export is the safe way to ship it (inference). [S157][S137]

## Relations

- depends_on [[webgl-mode]] — needs a WEBGL canvas in the p5 build [S157]
- depends_on [[async-setup]] — brush.add() returns a Promise [S157]
- alternative_to [[p5-scribble]] — painterly versus sketchy aesthetic [S157][S167]
- related_to [[p5js-libraries-directory]] — listed [S156]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S137] — Export Pipeline (p5js agent-skill reference) (third-party "hermes-agent" skill doc, hosted on a personal domain, undated)
- [S156] — p5.js Libraries page (Processing Foundation/p5.js, checked 2026-10-08)
- [S157] — p5.brush repo (Alejandro Campos Uribe, undated)
- [S159] — npm registry metadata (p5, p5.sound, p5.brush, p5.grain, p5.js-svg, p5.fillgradient, p5play, tone, ml5, p5.collide2d, p5.createloop, p5.capture, p5.plotsvg, p5.tree, matter-js, roughjs) (npm, queried 2026-10-08)
- [S167] — p5.scribble.js repo (generative-light, undated)
