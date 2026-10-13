---
id: spline-vertex
title: "splineVertex()"
type: Construct
aliases: ["Spline path", "Smooth path diagram"]
sources: [S1, S4, S5, S6, S11, S12, S19, S22, S115]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# splineVertex()

## Definition
**[changed in 2.x]** `splineVertex()` replaces `curveVertex()` and draws a smooth Catmull-Rom style curve that passes through every added point, with no duplicated end points [S4][S5].

## Details
- Signatures: (x,y), (x,y,z), (x,y,u,v) and (x,y,z,u,v); z is for WebGL [S5].
- `endShape(CLOSE)` closes a spline smoothly with no doubled points [S4][S19].
- `splineProperty('ends', EXCLUDE)` draws only the middle span, treating outer points as control points; default INCLUDE passes through all points [S5][S22].
- Does not work when a kind is passed to `beginShape` [S5].
- Mixing: can be combined with other curve types in one block [S4].
- `shapes.js` restores `curveVertex` [S11]. Migration: remove the doubled endpoints used with `curveVertex` [S115].

## In explainer work
Smooth path diagrams: `beginShape(); for (const p of pts) splineVertex(p.x,p.y); endShape(CLOSE);` [S115][S5]. For draw-on reveals emit the first N points and do not close until the end [S4].

## Patterns
**Smooth path diagram.** When: organic outlines or curved connectors. Pitfall: pass no kind to `beginShape`; remove 1.x duplicated end points.
```js
beginShape();
for (const p of pts) splineVertex(p.x, p.y);
endShape(CLOSE);
```

## Relations
- part_of [[shape-custom-shapes]] — group member [S1]
- part_of [[hub-language-core]] (structural)
- supersedes [[curve-api-1x]] — replaces curveVertex [S4]
- depends_on [[shape-custom-shapes]] — requires an open beginShape [S5]
- related_to [[shape-curves]] — spline() and splinePoint counterparts [S12]
- related_to [[bezier-vertex]] — Bezier counterpart [S6]
- replaced_in_2x [[curve-api-1x]] — curveVertex renamed [S4]

## Sources
- [S1] — Reference index (v2)
- [S4] — p5.js v2.0.0 release notes
- [S5] — splineVertex() reference
- [S6] — bezierVertex() reference
- [S11] — p5.js-compatibility add-ons
- [S12] — spline() reference
- [S19] — endShape() reference
- [S22] — splineProperty() reference
- [S115] — p5.js-compatibility README raw (differences list)
