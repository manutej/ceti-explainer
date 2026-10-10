---
id: begin-contour
title: "beginContour() / endContour()"
type: Construct
aliases: ["beginContour", "endContour", "holes"]
sources: [S1, S3, S24, S32, S41, S46]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# beginContour() / endContour()

## Definition
`beginContour()` and `endContour()` cut a hole in a flat custom shape; the vertices of the hole must wind opposite to the outer shape [S24]. They are part of the Custom Shapes group [S1].

## Details
- Usage: draw the outer outline, then wrap the hole's vertices in a contour block inside the same `beginShape`/`endShape` [S24].
- Works only for flat shapes in the reference description [S24].
- Related text API: letter holes (O, A) come back as separate rings from [[text-to-contours]], which can be fed into contour blocks (inference) [S32][S46].
- Contour behaviour with `vertexProperty` and `normal` is only partly verified [S3].

## In explainer work
Use for ring or donut glyphs, cut-out callouts and masks where `erase()` is not suitable; see [[erase]] for the layer-based alternative [S24][S41].

## Patterns
**Holes.** When: ring-like glyphs. Pitfall: same winding as the outer shape fills the hole instead of cutting it.
```js
beginShape();
for (const p of outer) vertex(p.x, p.y);
beginContour();
for (const p of innerReversed) vertex(p.x, p.y);
endContour();
endShape(CLOSE);
```

## Relations
- part_of [[shape-custom-shapes]] — Custom Shapes member [S1]
- part_of [[hub-language-core]] (structural)
- related_to [[text-to-contours]] — glyph rings with holes [S46]
- alternative_to [[erase]] — cut-out via compositing instead of geometry [S41]
- depends_on [[shape-custom-shapes]] — needs beginShape [S24]

## Sources
- [S1] — Reference index (v2)
- [S3] — beginShape() reference
- [S24] — beginContour() reference
- [S32] — p5.Font textToPoints() reference
- [S41] — erase() reference
- [S46] — Coding Train p5.js 2.0 typography
