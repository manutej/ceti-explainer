---
id: layered-compositing
title: "Layered compositing"
type: Pattern
aliases: ["Layers via graphics buffers", "Offscreen layers", "Freeze static layers", "Framebuffer layer stack"]
sources: [S4, S13, S61, S64, S256, S257, S259, S266, S357]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# Layered compositing

## Definition
Layered compositing keeps static backgrounds, grids and overlays out of the per-frame redraw by drawing them into `createGraphics()` (P2D) or `createFramebuffer()` (WEBGL) buffers and stamping them with `image()` [S357][S13][S257].

## Details
- The framebuffer tutorial shows depth-based effects: draw the 3D diagram in a framebuffer and read `fb.depth` in a shader for fog or focal blur [S61].
- `p5.Framebuffer` is WEBGL-only; in P2D use `p5.Graphics` [S357].
- A layer can be stamped many times, and layers are not shown until drawn [S61].
- Freeze buffers that never change into `p5.Image` [S256].
- Filter shaders apply to the whole canvas, so isolate layers first [S64].

## In explainer work
Separating layers lets a diagram, annotation and effects pass render independently and be recombined each frame at different resolutions [S61].

## Patterns
Layer stack: freeze static layers, render the animated layer each frame, apply a shader only to the animated layer.
```js
// setup: grid = frozen p5.Image;  fx = createFramebuffer();
image(grid, 0, 0);
fx.begin(); clear(); drawAnimatedDiagram(t); fx.end();
image(fx, -width/2, -height/2);
```
Pitfalls: set densities explicitly and reset buffers manually [S266][S259].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- uses [[p5-graphics]] — P2D layers [S13]
- uses [[p5-framebuffer]] — WEBGL layers [S257]
- related_to [[filter-shaders]] — isolate before filtering [S64]
- related_to [[ping-pong-feedback]] — feedback uses two layers [S61]
- related_to [[world-to-screen]] — overlay labels [S4]

## Sources
- [S4] — p5.js v2.0.0 release notes
- [S13] — createGraphics() reference
- [S61] — Layered Rendering with Framebuffers
- [S64] — Introduction to GLSL (tutorial)
- [S256] — Optimizing WebGL Sketches (tutorial)
- [S257] — createFramebuffer() reference
- [S259] — p5.Graphics reference
- [S266] — Issue #8289 pixelDensity() applies only to the canvas, not p5.Graphics, in 2.x
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
