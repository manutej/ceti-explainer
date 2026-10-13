---
id: shape-curves
title: "Curves (bezier and spline functions)"
type: Capability
aliases: ["Curves (Shape/Curves)", "bezier(), bezierPoint(), bezierTangent()", "bezierPoint", "bezierTangent", "Bezier curve functions", "spline(), splinePoint(), splineTangent(), splineProperty()", "splineProperty()", "splinePoint", "splineTangent", "Catmull-Rom curve functions"]
sources: [S1, S4, S5, S6, S11, S12, S22, S23, S115, S357]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# Curves (bezier and spline functions)

## Definition
The Curves subgroup lists `bezier`, `spline`, `bezierPoint`, `splinePoint`, `bezierTangent` and `splineTangent`; `spline`, `splinePoint` and `splineTangent` are new in the 2.x reference as renames of `curve`, `curvePoint` and `curveTangent` **[changed in 2.x]** [S1][S357][S4].

## Details
### Bezier functions
- `bezierPoint(a,b,c,d,t)` works one axis at a time and returns the coordinate at t between 0 and 1 [S23]. `bezierTangent` gives direction for orienting arrowheads [S1].
### Spline functions
- `spline()` draws a Catmull-Rom curve from four points (optional 3D form); splines pass through every point [S12][S4].
- `curveTightness` became `splineProperty('tightness')`; tightness defaults to 0 (Catmull-Rom), negatives loosen and positives tighten [S115][S22].
- `bezierDetail` merged into `curveDetail` [S115].
### Related
- The 1.x names are removed; `shapes.js` restores them; see [[curve-api-1x]] [S11].
- Custom shape equivalents are [[bezier-vertex]] and [[spline-vertex]] [S5][S6].

## In explainer work
Rated **High**: sample `bezierPoint`/`splinePoint` to move a dot along a path and `bezierTangent` to orient arrowheads [S357]. Bezier and spline families are different curves, so they are alternatives rather than interchangeable (`bezierPoint` is not `splinePoint`) [S1].

## Patterns
**Curved arrow.** When: connectors between nodes. Pitfall: arrowhead angle needs the tangent, not the chord.
```js
const p = bezierPoint(ax, c1x, c2x, bx, t);
const q = bezierPoint(ay, c1y, c2y, by, t);
circle(p, q, 8);
```

## Relations
- part_of [[module-shape]] — subgroup [S1]
- part_of [[hub-language-core]] (structural)
- supersedes [[curve-api-1x]] — spline* replaces curve* [S4]
- related_to [[spline-vertex]] — shape-building counterpart of spline() [S5]
- related_to [[bezier-vertex]] — shape-building counterpart of bezier() [S6]
- enables [[arc-length-reveal]] — point-along-curve sampling (inference) [S357]
- alternative_to [[shape-custom-shapes]] — standalone curves vs vertex-built shapes [S1]

## Sources
- [S1] — Reference index (v2)
- [S4] — p5.js v2.0.0 release notes
- [S5] — splineVertex() reference
- [S6] — bezierVertex() reference
- [S11] — p5.js-compatibility add-ons
- [S12] — spline() reference
- [S22] — splineProperty() reference
- [S23] — bezierPoint() reference
- [S115] — p5.js-compatibility README raw (differences list)
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
