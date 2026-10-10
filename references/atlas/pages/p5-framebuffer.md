---
id: p5-framebuffer
title: "p5.Framebuffer"
type: Construct
aliases: ["createFramebuffer()", "FBO", "Framebuffer depth texture", "FLOAT framebuffer format", "textureFiltering", "Framebuffer begin()/end()", "Framebuffer antialias option", "Framebuffer density option", "Framebuffer format FLOAT/HALF_FLOAT"]
sources: [S53, S61, S62, S256, S257]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# p5.Framebuffer

## Definition
`p5.Framebuffer` (from `createFramebuffer()`) is an off-screen GPU drawing surface that shares the main canvas's WebGL context and exposes colour and depth textures; it is WEBGL-only and generally much faster than `p5.Graphics` when used as a texture [S53][S257].

## Details
- Options: `format` (UNSIGNED_BYTE default, FLOAT, HALF_FLOAT), `channels`, `depth` (default true), `depthFormat`, `stencil`, `antialias`, `width`, `height`, `density`, `textureFiltering` (LINEAR default) [S257].
- `antialias: true` gives 2 samples and an integer gives that sample count; the default follows `setAttributes` [S257].
- Setting width, height or density stops tracking the main canvas, and resizing becomes manual [S257].
- Contents persist until `clear()`; per-pixel depth 0 to 1 is available on `.depth`, usable with `texture()` or `setUniform` [S61][S53].
- The y-axis is flipped relative to images (use a negative height), `pixels` read/write is slower than drawing, and `remove()` frees GPU memory [S53].
- A framebuffer is not shown automatically; display it with `image(layer, x, y, w, h)`, and one layer can be stamped many times [S61].
- Fixes in 2.3.1 include framebuffer sizing with custom pixel densities [S62].
- A drawn framebuffer image is a flat quad that can occlude later geometry in 3D; use `clearDepth()` or push it back in z [S61].

## In explainer work
Layer background, mid and overlay passes, apply shaders to isolated layers, and build feedback trails [S61].

## Patterns
```js
const L = createFramebuffer({ antialias: 4, density: 2 });
L.begin(); clear(); /* draw 3D diagram */ L.end();
image(L, -width / 2, -height / 2, width, height);   // WEBGL origin is the centre
```
Pitfalls: origin at centre, explicit clear, density mismatch [S61][S257].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- alternative_to [[p5-graphics]] — GPU versus CPU surface [S256]
- enables [[ping-pong-feedback]] — two buffers swapped [S61]
- enables [[layered-compositing]] — GPU layer stack [S61]
- depends_on [[webgl-mode]] — WEBGL only [S257]
- related_to [[antialiasing]] — per-buffer antialias option [S257]

## Sources
- [S53] — Reference p5.Framebuffer
- [S61] — Layered Rendering with Framebuffers
- [S62] — p5.js 2.3.1 release notes (mirror)
- [S256] — Optimizing WebGL Sketches (tutorial)
- [S257] — createFramebuffer() reference
