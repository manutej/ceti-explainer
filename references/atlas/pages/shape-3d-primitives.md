---
id: shape-3d-primitives
title: "3D primitives"
type: Capability
aliases: ["3d shapes", "curveDetail()", "curve segments"]
sources: [S256, S262, S357, S360, S361]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# 3D primitives

## Definition
The 3D primitives group has 14 entries: box, buildGeometry, cone, curveDetail, cylinder, ellipsoid, freeGeometry, p5.Geometry, plane, saveObj, saveStl, sphere, strokeMode and torus [S357].

## Details
- Three pages are new in 2.x (saveObj, saveStl, strokeMode), though saveObj and saveStl existed in 1.x source [S357][S361].
- `curveDetail()` controls segments of WEBGL curves; lower means fewer triangles [S256].
- `instances()` extends the group on main and is unreleased **[main / unreleased]** [S360].
- Relevance is medium: useful for spatial explainers such as vectors or molecules, overkill for flat diagrams [S357].
- Many primitives drawn per frame are slow; bake them with `buildGeometry()` [S256][S262].

## In explainer work
Use boxes, spheres and planes to depict spatial concepts, and bake repeated ones to stay inside the frame budget [S357][S256].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- part_of [[module-shape]] — Shape/3D Primitives [S357]
- uses [[build-geometry]] — group member for baking [S262]
- related_to [[gpu-instancing]] — instanced primitives on main [S360]
- related_to [[shape-3d-models]] — loaded geometry [S357]
- related_to [[webgl-mode]] — requires WEBGL [S256]

## Sources
- [S256] — Optimizing WebGL Sketches (tutorial)
- [S262] — buildGeometry() reference
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
- [S360] — p5.js source on `main` (commit aa192a2, 2026-10-07; post-2.3.4 work)
- [S361] — p5.js source at tag v1.11.10 (1.x baseline for removed/moved diff)
