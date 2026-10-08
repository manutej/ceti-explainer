---
id: module-3d
title: "3D module"
type: Module
aliases: ["3D", "WebGL 3D module", "orbitControl() and debugMode()", "3D/Interaction", "orbitControl", "debugMode()"]
sources: [S349, S357, S358, S359, S360]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# 3D module

## Definition
The 3D module is the reference group for WEBGL: camera, interaction, lights, material and the p5.strands submodule; it grew from 40 to 86 global entries in 2.x [S357][S358].

## Details
- Subgroups: 3D/Camera (9 entries), 3D/Interaction (3: debugMode, noDebugMode, orbitControl), 3D/Lights (10), 3D/Material (17), 3D/p5.strands (47, all beta, 43 new) [S357].
- `debugMode()` draws a grid and axes in WEBGL [S349].
- v2.3.4 source marks p5.strands, parts of material.js, p5.Shader and the 3D renderers `@beta` [S359].
- Main-branch strands matrices and `StorageList` are unreleased **[main / unreleased]** [S360].
- `orbitControl` is for live exploration, not rendered video [S357].

## In explainer work
For 2D diagram explainers the module is mostly optional; reach for it for spatial scenes, shader filters and GPU effects [S357].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- related_to [[capability-map]] — counts live there [S357]
- uses [[p5-camera]] — Camera group [S357]
- uses [[lights-and-materials]] — Lights and Material groups [S357]
- uses [[p5-strands]] — largest 2.x growth [S357]
- related_to [[webgl-mode]] — the renderer it documents [S349]

## Sources
- [S349] — Coordinates and Transformations (tutorial)
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
- [S358] — p5.js-website repo, `v1` branch reference (1.x reference; parsed 905 entries)
- [S359] — p5.js source at tag v2.3.4 (`src/` folder; JSDoc @module/@submodule/@method/@beta/@deprecated tags parsed)
- [S360] — p5.js source on `main` (commit aa192a2, 2026-10-07; post-2.3.4 work)
