---
id: bezier-vertex
title: "bezierVertex()"
type: Construct
aliases: ["Curved arrow with Bezier"]
sources: [S1, S4, S5, S6, S7, S11, S23, S26]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# bezierVertex()

## Definition
**[changed in 2.x]** `bezierVertex()` adds one Bezier control or anchor point per call; the curve order is set by [[bezier-order]] (3 cubic by default, 2 quadratic) [S6][S7]. The old multi-point overloads and `quadraticVertex` were removed [S4].

## Details
- A cubic segment takes three calls (two controls then an anchor); two cubic segments need 7 points (1 anchor + 3 + 3), and with order 2 two segments need 5 [S6].
- A shape of only Bezier curves needs one initial anchor `vertex()` first; the number of `bezierVertex` calls must be a multiple of the order [S6].
- Does not work when a kind is passed to `beginShape` [S6].
- Accepts optional texture coordinates (u, v) in 3D, but the notes found no description of u and v [S5][S6].
- `shapes.js` from [[p5js-compatibility]] restores the 6-argument 1.x form and `quadraticVertex` [S11].

## In explainer work
Curved arrows: `vertex(a); bezierVertex(c1); bezierVertex(c2); bezierVertex(b)` with `noFill()` because fill is on by default; compute arrowhead direction from `bezierTangent` or by differencing `bezierPoint` near t=1 [S6][S23]. See [[shape-curves]].

## Patterns
**Curved arrow with Bezier.** When: arrows between nodes. Pitfall: tutorial inconsistency about the initial vertex (see [[shape-custom-shapes]]) [S26].
```js
noFill(); beginShape();
vertex(ax, ay);
bezierVertex(c1x, c1y); bezierVertex(c2x, c2y); bezierVertex(bx, by);
endShape();
```

## Relations
- part_of [[shape-custom-shapes]] — group member [S1]
- part_of [[hub-language-core]] (structural)
- depends_on [[bezier-order]] — order determines points per segment [S6]
- supersedes [[curve-api-1x]] — replaces multi-point overloads (inference of grouping) [S4]
- related_to [[spline-vertex]] — spline counterpart [S5]
- related_to [[shape-curves]] — bezierPoint/bezierTangent for sampling [S23]

## Sources
- [S1] — Reference index (v2)
- [S4] — p5.js v2.0.0 release notes
- [S5] — splineVertex() reference
- [S6] — bezierVertex() reference
- [S7] — bezierOrder() reference
- [S11] — p5.js-compatibility add-ons
- [S23] — bezierPoint() reference
- [S26] — Tutorial: Custom Shapes and Smooth Curves
