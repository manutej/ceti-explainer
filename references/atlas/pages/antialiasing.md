---
id: antialiasing
title: "Antialiasing (smooth, setAttributes)"
type: Capability
aliases: ["smooth()", "noSmooth()", "smooth() / noSmooth()", "setAttributes()", "WebGL context attributes", "edge smoothing", "MSAA", "Edge quality checklist"]
sources: [S131, S256, S257, S258, S260]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# Antialiasing (smooth, setAttributes)

## Definition
Antialiasing in p5 is controlled in three places: `setAttributes({antialias})` for the main WEBGL canvas, the `antialias` option for framebuffers, and `smooth()`/`noSmooth()` for shape edges [S258][S257][S260].

## Details
- WEBGL canvas antialias defaults to false (true in Safari) [S258].
- `setAttributes()` called after the canvas exists reinitialises the drawing context, and the object form resets undeclared attributes to defaults; other defaults: `preserveDrawingBuffer` true, `perPixelLighting` true, WebGL version 2 with fallback to 1 [S258].
- Framebuffer `antialias: true` gives 2 samples and an integer gives the count (for example 4); the default follows `setAttributes` [S257].
- `setAttributes({antialias: false})` skips edge smoothing for speed [S256].
- `noSmooth()` in 2D affects image scaling, not shapes or fonts; in WebGL it aliases shapes but not images or fonts [S260].
- Sample counts and resolve quality across browsers are not documented [S257].

## In explainer work
Edge quality checklist: set `antialias: true` before the first WEBGL draw, use the framebuffer option for offscreen layers, and reserve `noSmooth()` for pixel-art image scaling [S258][S257][S260].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- related_to [[p5-framebuffer]] — per-buffer sample count [S257]
- related_to [[webgl-mode]] — attribute applies there [S258]
- related_to [[hi-res-render]] — pair with density for crisp frames [S131]
- related_to [[performance-profiling]] — speed trade-off [S256]

## Sources
- [S131] — Best way to export an animation from a p5.js sketch in 2026
- [S256] — Optimizing WebGL Sketches (tutorial)
- [S257] — createFramebuffer() reference
- [S258] — setAttributes() reference
- [S260] — noSmooth() reference
