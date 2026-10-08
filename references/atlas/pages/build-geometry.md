---
id: build-geometry
title: "buildGeometry()"
type: Construct
aliases: ["baked geometry", "p5.Geometry", "beginGeometry/endGeometry replacement", "Bake geometry"]
sources: [S49, S77, S115, S256, S262, S357, S360]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# buildGeometry()

## Definition
`buildGeometry()` bakes unchanging shapes into a `p5.Geometry` once, drawn each frame via `model()`; it runs faster than redrawing the pieces [S262][S256].

## Details
- The optimisation tutorial's slow example redraws about 400 spheres per frame; building once and drawing with `model()` is the fix [S256][S262].
- It is in the Shape/3D Primitives group of 14 entries alongside box, cone, cylinder, ellipsoid, plane, sphere and torus [S357].
- Related unreleased main-branch additions include `instances(count)` for GPU instancing **[main / unreleased]** [S360].
- Lowering `curveDetail()` reduces triangle count in WEBGL curves [S256].
- In strands, `buildGeometry()` makes a model and `model(geometry, n)` draws n instances with a custom shader [S49].
- `buildGeometry` is the 2.x replacement for `beginGeometry()`/`endGeometry()` **[changed in 2.x]**; `bezierDetail` was merged into `curveDetail` at the same time [S115].

## In explainer work
Bake static grids, axes and repeated glyph meshes; keep animation in transforms or shaders [S256][S49].

## Patterns
```js
let forest;
function setup() {
  createCanvas(600, 400, WEBGL);
  forest = buildGeometry(() => { for (let i = 0; i < 400; i++) { push(); translate(random(-250, 250), 0, random(-250, 250)); sphere(8); pop(); } });
}
function draw() { background(20); model(forest); }
```
Pitfalls: geometry is frozen at build time; seeded `random` keeps it reproducible [S262][S77].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- part_of [[shape-3d-primitives]] — group member [S357]
- enables [[gpu-instancing]] — models are instanced in strands [S49]
- related_to [[performance-profiling]] — optimisation advice [S256]
- related_to [[webgl-mode]] — WEBGL feature [S256]
- related_to [[p5-framebuffer]] — sibling GPU residency tool [S256]

## Sources
- [S49] — p5.strands: Introduction to Shaders (tutorial)
- [S77] — src/math/random.js (main branch)
- [S115] — p5.js-compatibility README raw (differences list)
- [S256] — Optimizing WebGL Sketches (tutorial)
- [S262] — buildGeometry() reference
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
- [S360] — p5.js source on `main` (commit aa192a2, 2026-10-07; post-2.3.4 work)
