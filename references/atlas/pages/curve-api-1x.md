---
id: curve-api-1x
title: "1.x curve API (removed)"
type: Construct
aliases: ["curveVertex", "curve()", "curvePoint", "curveTangent", "curveTightness"]
sources: [S4, S11, S115, S358]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "1.x"
---

# 1.x curve API (removed)

## Definition
**[1.x only]** The 1.x curve and vertex names were removed or renamed in 2.0: `curve`, `curvePoint`, `curveTangent`, `curveVertex`, `curveTightness`, `quadraticVertex`, multi-point `bezierVertex`, and `beginGeometry`/`endGeometry` [S11][S358].

## Details
### Mapping
- curve -> spline; curvePoint -> splinePoint; curveTangent -> splineTangent; curveVertex -> [[spline-vertex]] [S115][S4].
- curveTightness -> `splineProperty('tightness')`; `bezierDetail` merged into `curveDetail` [S115].
- quadraticVertex -> [[bezier-order]](2) plus [[bezier-vertex]] [S11].
- beginGeometry/endGeometry -> `buildGeometry` [S115].
### Restoring
- The `shapes.js` add-on in [[p5js-compatibility]] restores the 6-argument bezierVertex, quadraticVertex and curveVertex [S11].
- Splines used to duplicate first and last points; in 2.x they pass through every point [S4].

## In explainer work
Older explainer tutorials use `curveVertex` with doubled endpoints; remove the duplicates when translating [S115]. See [[version-2x-migration]].

## Relations
- part_of [[hub-language-core]] (structural)
- part_of [[p5js-1x]] — belongs to the 1.x line [S358]
- replaced_in_2x [[spline-vertex]] — curveVertex renamed [S4]
- replaced_in_2x [[bezier-order]] — quadraticVertex folded in [S11]
- depends_on [[p5js-compatibility]] — shapes.js restores them [S11]
- related_to [[version-2x-migration]] — one of the headline breaks [S4]

## Sources
- [S4] — p5.js v2.0.0 release notes
- [S11] — p5.js-compatibility add-ons
- [S115] — p5.js-compatibility README raw (differences list)
- [S358] — p5.js-website repo, `v1` branch reference (1.x reference; parsed 905 entries)
