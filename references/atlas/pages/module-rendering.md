---
id: module-rendering
title: "Rendering module"
type: Module
aliases: ["Rendering", "canvas and offscreen buffers"]
sources: [S1, S10, S13, S14, S257, S259, S357, S358]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# Rendering module

## Definition
Rendering holds canvas and offscreen-surface functions: `createCanvas`, `createGraphics`, `createFramebuffer`, `resizeCanvas`, `noCanvas`, `setAttributes`, `clearDepth` and `drawingContext`, plus the classes `p5.Graphics` and `p5.Framebuffer` [S1][S357]. The 2.x reference lists 10 entries; `blendMode` moved out to Color/Setting [S357][S358].

## Details
- Renderers: P2D (default), WEBGL (WebGL2 when supported; `setAttributes({version:1})` forces WebGL1) and, via the separate add-on, WEBGPU [S13][S14][S10].
- `createGraphics(w,h,renderer)` makes an offscreen `p5.Graphics`; `createFramebuffer()` is WebGL-only and usually much faster as a texture [S13][S257].
- The main canvas resets transforms each frame, but buffers need `reset()` [S259].
- A framebuffer created with explicit size or density stops tracking the canvas [S257].

## In explainer work
Rated **High**: buffers give layers and offscreen compositing; `resizeCanvas` and `setAttributes` help export [S357]. See [[layered-compositing]] and [[p5-framebuffer]] [S259].

## Relations
- part_of [[hub-language-core]] (structural)
- part_of [[capability-map]] — top-level reference section [S1]
- uses [[create-canvas]] — main canvas entry point [S14]
- uses [[p5-graphics]] — offscreen buffer class [S259]
- uses [[p5-framebuffer]] — WebGL framebuffer class [S257]
- related_to [[webgl-mode]] — WEBGL renderer choice [S13]
- related_to [[webgpu-renderer]] — optional renderer [S10]

## Sources
- [S1] — Reference index (v2)
- [S10] — p5.js GitHub releases page (v2.3.1 to v2.3.4)
- [S13] — createGraphics() reference
- [S14] — createCanvas() reference
- [S257] — createFramebuffer() reference
- [S259] — p5.Graphics reference
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
- [S358] — p5.js-website repo, `v1` branch reference (1.x reference; parsed 905 entries)
