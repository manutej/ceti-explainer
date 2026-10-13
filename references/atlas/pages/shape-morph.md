---
id: shape-morph
title: "Shape and text morph"
type: Pattern
aliases: ["Vertex-lerp morph", "shape morphing", "Shape morphing by vertex interpolation", "Text to points morph"]
sources: [S46, S268, S309, S334, S341]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# Shape and text morph

## Definition
Shape and text morph samples two shapes to matching point counts and lerps the vertices; the Coding Train circle-morphing challenge teaches it, and 2.x `textToContours` supplies glyph outlines **[2.x]** [S341][S334].

## Details
- `textToContours(str, x, y, options)` returns one array of `{x, y, alpha}` points per contour, so "O" yields two contours; options include `sampleFactor` (default 0.1) and `simplifyThreshold` (radians) [S334].
- Coding Train also shows a point-deletion alternative to resampling [S341].
- Contour counts differ between glyphs: pair contours by area or position and shrink extras to a point (inference) [S334].
- Rotate the start index of the target to minimise travel, or the shape twists (inference) [S341].
- 1.x used `textToPoints` with a flat point list **[1.x only]**, so check the version [S334].
- Text models from `textToModel` lack texture coordinates, which does not matter for contour morphs [S268].

## In explainer work
Morphs let a label become another label or a shape become a diagram node, Manim-style Transform [S341][S334].

## Patterns
```js
function drawMorph(A, B, u) {                 // A, B resampled to equal length
  beginShape();
  for (let i = 0; i < A.length; i++) vertex(lerp(A[i].x, B[i].x, u), lerp(A[i].y, B[i].y, u));
  endShape(CLOSE);
}
```
Pitfalls: resample both outlines by arc length first (see the arc-length page) [S309][S341].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- uses [[text-to-contours]] — glyph outlines in 2.x [S334]
- uses [[lerp]] — per-vertex interpolation [S341]
- teaches [[daniel-shiffman]] — circle-morph challenge [S341]
- related_to [[arc-length-reveal]] — shared resampling [S309]
- related_to [[kinetic-typography]] — title-card use [S46]

## Sources
- [S46] — Coding Train p5.js 2.0 typography
- [S268] — Greetings from p5.js 2.0: Animation, Interaction, and Typography in 2D and 3D
- [S309] — p5.animS README
- [S334] — p5.Font `textToContours()` reference
- [S341] — Coding Challenge #81 Circle Morphing
