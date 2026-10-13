---
id: module-transform
title: "Transform module"
type: Module
aliases: ["Transform", "matrix stack", "translate/rotate/scale", "transforms", "Model matrix", "Scoped transforms", "Pivot transform"]
sources: [S1, S3, S15, S28, S349, S357, S358]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# Transform module

## Definition
Transform is a flat list of 12 entries: `applyMatrix`, `pop`, `push`, `resetMatrix`, `rotate`, `rotateX/Y/Z`, `scale`, `shearX/Y`, `translate`; `push` and `pop` moved here from Structure in the 2.x reference [S1][S357][S358].

## Details
- A transform changes the coordinate system, not the object; calls accumulate (two `translate(50,0)` equal one `translate(100,0)`) [S349].
- Recommended order is translate, then rotate, then scale; to pivot, translate to the pivot, transform, then translate back [S349].
- Origin is top-left in P2D and the center in WEBGL, where z points toward the viewer; angles are radians unless `angleMode(DEGREES)` [S349][S28].
- Transforms reset at the start of each `draw()` and cannot be applied between `beginShape()` and `endShape()` [S28][S3].
- Transform calls feed the model matrix, which combines with view and projection in 3D [S349].

## In explainer work
Rated **High**: `push`, `translate`, `rotate` and `scale` are the basis of hierarchical, scene-graph-like motion [S357]. Use a pivot pattern for hinges and wrap each glyph in its own [[push-pop]] [S349][S15].

## Patterns
**Pivot transform.** When: rotate or scale a component about a hinge. Pitfall: forgetting to translate back.
```js
push(); translate(px, py); rotate(theta); translate(-px, -py);
drawPart();
pop();
```

## Relations
- part_of [[hub-language-core]] (structural)
- part_of [[capability-map]] — top-level reference section [S1]
- uses [[push-pop]] — style/transform stack [S357]
- related_to [[drawing-state]] — matrix is part of the state [S15]
- related_to [[module-shape]] — transforms fail inside beginShape [S3]
- related_to [[world-to-screen]] — maps transformed 3D points to 2D [S1]

## Sources
- [S1] — Reference index (v2)
- [S3] — beginShape() reference
- [S15] — push() reference
- [S28] — translate() reference
- [S349] — Coordinates and Transformations (tutorial)
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
- [S358] — p5.js-website repo, `v1` branch reference (1.x reference; parsed 905 entries)
