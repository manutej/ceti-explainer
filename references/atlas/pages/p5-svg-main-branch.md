---
id: p5-svg-main-branch
title: "Native SVG import/export (unreleased)"
type: Capability
aliases: ["Shape/p5.svg", "loadSVG", "createSVG", "p5.ShapeCollection", "Shape/p5.svg (main branch, unreleased)"]
sources: [S161, S360]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "main / unreleased"
---

# Native SVG import/export (unreleased)

## Definition
**[main / unreleased]** The p5.js `main` branch (commit aa192a2, 2026-10-07) adds native SVG support under a new Shape/p5.svg submodule: `loadSVG`, `createSVG` and the `p5.ShapeCollection` class with `getSVG` and `saveSVG` (plus `begin`, `end`, `buildShape`, `createShape`, `shape`) [S360]. These are not in the published 2.3.4 reference [S360].

## Details
- Companion main-branch additions: an `instances(count)` wrapper for GPU-instanced drawing, `p5.StorageList` and strands matrix and transform helpers [S360].
- Features are unreleased and may change names or shape before the next minor [S360].
- Until release, SVG export in 1.x/2.x is by the community library p5.js-svg, which targets 1.11.x and does not mention 2.x [S161].

## In explainer work
Native SVG export would give vector frames for post-production without a third-party renderer; do not depend on it for pipelines pinned to 2.3.x (inference) [S360].

## Relations
- part_of [[module-shape]] — new Shape/p5.svg submodule [S360]
- part_of [[hub-language-core]] (structural)
- exports_to [[p5js-svg]] — functionally replaces the community SVG renderer (inference) [S161]
- related_to [[release-2-4]] — likely next minor [S360]
- related_to [[gpu-instancing]] — instances() also on main [S360]
- related_to [[capability-map]] — tracked as unreleased [S360]

## Sources
- [S161] — p5.js-svg repo
- [S360] — p5.js source on `main` (commit aa192a2, 2026-10-07; post-2.3.4 work)
