---
id: module-shape
title: "Shape module"
type: Module
aliases: ["Shape"]
sources: [S1, S357, S360]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# Shape module

## Definition
Shape is the largest drawing module, with five subgroups in the reference: 2D Primitives, 3D Models, 3D Primitives, Curves and Custom Shapes [S1]. The 2.x reference counts 51 global entries across them [S357].

## Details
- 2D Primitives (9): arc, circle, ellipse, line, point, quad, rect, square, triangle; Attributes (7): ellipseMode, noSmooth, rectMode, smooth, strokeCap, strokeJoin, strokeWeight [S357].
- Curves (6): bezier, bezierPoint, bezierTangent plus new spline, splinePoint, splineTangent **[changed in 2.x]**; Custom Shapes (12) add bezierOrder, splineProperty, splineProperties, splineVertex and vertexProperty as new pages [S357].
- 3D Primitives (14) and 3D Models (3) are covered by [[shape-3d-primitives]] and [[shape-3d-models]] [S357].
- **[main / unreleased]** A new Shape/p5.svg submodule (`loadSVG`, `createSVG`, `p5.ShapeCollection`) exists on main; see [[p5-svg-main-branch]] [S360].

## In explainer work
2D Primitives, Curves and Custom Shapes are rated **High**: boxes, arrows, nodes, progress arcs, draw-on reveals and mixed Bezier/spline paths; Attributes **Medium** [S357].

## Relations
- part_of [[hub-language-core]] (structural)
- part_of [[capability-map]] — top-level reference section [S1]
- uses [[shape-2d-primitives]] — subgroup [S357]
- uses [[shape-attributes]] — subgroup [S357]
- uses [[shape-curves]] — subgroup [S357]
- uses [[shape-custom-shapes]] — subgroup [S357]
- related_to [[module-3d]] — 3D primitives and models [S357]
- related_to [[p5-svg-main-branch]] — unreleased SVG submodule [S360]

## Sources
- [S1] — Reference index (v2)
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
- [S360] — p5.js source on `main` (commit aa192a2, 2026-10-07; post-2.3.4 work)
