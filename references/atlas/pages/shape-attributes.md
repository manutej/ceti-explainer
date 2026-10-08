---
id: shape-attributes
title: "Shape attributes"
type: Capability
aliases: ["Attributes module", "strokeWeight", "rectMode"]
sources: [S1, S4, S15, S16, S357, S359]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# Shape attributes

## Definition
The Shape Attributes group has seven functions: `rectMode`, `ellipseMode`, `strokeWeight`, `strokeCap`, `strokeJoin`, `smooth` and `noSmooth`; none are new in 2.x [S1][S357].

## Details
- `strokeCap` options are ROUND (default), SQUARE and PROJECT [S16].
- `push()`/`pop()` save strokeWeight, strokeCap, strokeJoin, rectMode and ellipseMode as part of the [[drawing-state]] [S15].
- WebGL `strokeMode(SIMPLE|FULL)` trades caps, joins and stroke color for speed, and 2.0 added `linesMode(SIMPLE)`; the notes use both names, which is unresolved [S359][S4].
- strokeJoin constants and ellipseMode/rectMode values were not individually verified in the source notes [S1].

## In explainer work
Rated **Medium**: `strokeCap` and `strokeJoin` matter for clean line art and arrowheads; `rectMode(CENTER)` simplifies layout [S357].

## Relations
- part_of [[module-shape]] — subgroup [S1]
- part_of [[hub-language-core]] (structural)
- related_to [[shape-2d-primitives]] — modes alter primitive placement [S357]
- related_to [[drawing-state]] — attributes are saved by push [S15]
- related_to [[module-constants]] — ROUND, SQUARE, PROJECT, SIMPLE, FULL [S16]
- related_to [[push-pop]] — scope attribute changes [S15]

## Sources
- [S1] — Reference index (v2)
- [S4] — p5.js v2.0.0 release notes
- [S15] — push() reference
- [S16] — strokeCap() reference
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
- [S359] — p5.js source at tag v2.3.4 (`src/` folder; JSDoc @module/@submodule/@method/@beta/@deprecated tags parsed)
