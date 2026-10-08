---
id: create-canvas
title: "createCanvas()"
type: Construct
aliases: ["main canvas", "P2D renderer", "P2D", "2D renderer"]
sources: [S1, S4, S10, S13, S14, S17, S27, S37, S349, S357]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# createCanvas()

## Definition
`createCanvas(w, h, [renderer])` creates the main canvas; call it once, at the start of [[setup]]; width and height default to 100 [S14]. Renderers are P2D (default), WEBGL and WEBGPU [S14].

## Details
- In WebGPU mode `createCanvas` must be awaited and needs the separate `p5.webgpu.js` add-on [S14][S10].
- WebGL mode uses a WebGL2 context when supported; `setAttributes({version: 1})` forces WebGL1 [S14][S13].
- In P2D the origin is top-left with y down; in WEBGL it is the center with z out of the screen [S349].
- The reference does not mention P2DHDR, while the 2.0 notes introduce it as a wide-gamut mode (see [[p2dhdr]]) [S14][S4].
- In 2.0, `createCanvas()` moves inside the async setup [S27].
- `pixelDensity` defaults to the display density, so canvas pixel size is `width * density` [S17][S37].

## In explainer work
Fix canvas size and density up front: export resolution depends on `pixelDensity` and size, so choose explicitly (for example 960x540 at density 1) before capture (inference) [S17][S357].

## Relations
- part_of [[module-rendering]] — Rendering group function [S1]
- part_of [[hub-language-core]] (structural)
- depends_on [[setup]] — called once inside setup [S14]
- related_to [[p2dhdr]] — HDR canvas mode [S4]
- depends_on [[webgpu-renderer]] — WEBGPU mode requires add-on and await [S14]
- related_to [[pixel-density]] — scales canvas pixels [S17]

## Sources
- [S1] — Reference index (v2)
- [S4] — p5.js v2.0.0 release notes
- [S10] — p5.js GitHub releases page (v2.3.1 to v2.3.4)
- [S13] — createGraphics() reference
- [S14] — createCanvas() reference
- [S17] — pixelDensity() reference
- [S27] — Teachers' Guide to p5.js v2
- [S37] — pixels reference
- [S349] — Coordinates and Transformations (tutorial)
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
