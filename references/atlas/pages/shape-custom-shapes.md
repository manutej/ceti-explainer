---
id: shape-custom-shapes
title: "Custom shapes"
type: Capability
aliases: ["beginShape", "endShape", "beginShape / endShape", "beginShape/vertex/endShape", "vertex()", "shape builder", "custom shape", "Custom Shapes and Smooth Curves tutorial", "sparkle stickers tutorial", "Vertex API RFC #6766", "RFC 6766"]
sources: [S1, S3, S4, S5, S6, S10, S11, S19, S20, S24, S26, S357]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# Custom shapes

## Definition
Custom Shapes is the Shape subgroup of 12 entries: `beginShape`, `vertex`, `endShape`, `bezierVertex`, `splineVertex`, `beginContour`, `endContour`, `normal`, plus new `bezierOrder`, `splineProperty`, `splineProperties` and `vertexProperty` [S1][S357]. In 2.0 it was redesigned around a one-vertex-per-call API **[changed in 2.x]** [S4].

## Details
- `beginShape(kind)` accepts PATH (default), POINTS, LINES, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, QUADS and QUAD_STRIP [S3].
- Transforms and other primitives do not work between `beginShape` and `endShape`; `bezierVertex` and `splineVertex` do not work if a kind is passed [S3][S5][S6].
- Multiple curve types can be mixed in one block, and WebGL supports per-control-point texture coordinates and fills [S4].
- `endShape(CLOSE)` closes a spline smoothly; the second `endShape` argument (count, WebGL only) draws instanced copies with a custom shader [S19][S4].
- The design came from RFC issue 6766 (single-vertex functions plus `bezierOrder`, `splineProperty`; `arcVertex` was proposed but is not in the reference index) [S20].
- The official "Custom Shapes and Smooth Curves" tutorial teaches vertex, bezierVertex and push/pop-scoped placement [S26].
- v2.3.2 sped up paths with many vertex calls; v2.3.1 fixed TRIANGLE_FAN in WebGL and WebGPU [S10].

> **Conflict:** The tutorial says a Bezier shape must begin with `vertex()`, but its final example reportedly starts with `bezierVertex`, while the reference says an initial anchor is needed only when no earlier vertices exist [S26] vs [S6].

## In explainer work
Rated **High**: draw-on reveals by emitting the first N vertices, holes via [[begin-contour]], and mixed Bezier/spline paths in one shape [S357][S4]. Close only at t=1 on partial reveals [S4].

## Patterns
**Draw-on path reveal.** When: reveal a curve progressively. Pitfall: `endShape(CLOSE)` on a partial spline looks wrong.
```js
function drawPartial(pts, t) {
  const n = floor(t * (pts.length - 1)) + 1;
  beginShape();
  for (let i = 0; i < n; i++) splineVertex(pts[i].x, pts[i].y);
  endShape();
}
```

## Relations
- part_of [[module-shape]] — subgroup [S1]
- part_of [[hub-language-core]] (structural)
- uses [[bezier-vertex]] — one point per call [S6]
- uses [[spline-vertex]] — passes through all points [S5]
- uses [[begin-contour]] — holes [S24]
- uses [[vertex-property]] — per-vertex attributes [S357]
- enables [[shape-morph]] — vertex arrays make interpolation natural (inference) [S20]
- related_to [[p5js-compatibility]] — shapes.js restores 1.x forms [S11]

## Sources
- [S1] — Reference index (v2)
- [S3] — beginShape() reference
- [S4] — p5.js v2.0.0 release notes
- [S5] — splineVertex() reference
- [S6] — bezierVertex() reference
- [S10] — p5.js GitHub releases page (v2.3.1 to v2.3.4)
- [S11] — p5.js-compatibility add-ons
- [S19] — endShape() reference
- [S20] — RFC issue #6766, vertex function API redesign
- [S24] — beginContour() reference
- [S26] — Tutorial: Custom Shapes and Smooth Curves
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
