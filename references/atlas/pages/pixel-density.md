---
id: pixel-density
title: "pixelDensity()"
type: Construct
aliases: ["density"]
sources: [S13, S17, S37, S131, S256, S257, S261, S263, S266, S268, S272, S392]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# pixelDensity()

## Definition
`pixelDensity()` sets or returns the scale between p5 pixels and physical pixels; it defaults to the display density and `pixelDensity(1)` turns matching off [S17].

## Details
- High-DPI screens render four times the pixels at density 2: `pixelDensity(1)` is faster but may look blurry [S256].
- `pixels[]` length scales with density: a 100x100 canvas at density 2 has a 160,000-element array [S37]. The `pixelDensity`, `createGraphics` and `loadPixels` references do not document that interaction [S17][S13][S261].
- It does not change screen PPI; it scales how many physical pixels represent each p5 pixel [S272].
- Framebuffer density defaults to its parent canvas; setting it stops auto-tracking [S263][S257].
- In 2.x, density set on the main canvas is not inherited by later `createGraphics` buffers (issue #8289, reported on 2.1.1) **[changed in 2.x]** [S266].
- The 2.0 tutorial says density can be raised for high-resolution exports [S268].
- Output sizes differ across machines unless density is set explicitly; fxhash suggests `pixelDensity(1)` [S272][S392].

## In explainer work
Pin density in export scripts; combine `createCanvas(1920,1080)` and `pixelDensity(2)` for 4K-equivalent frames [S131].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- related_to [[hi-res-render]] — the export pattern uses it [S131]
- related_to [[p5-graphics]] — not inherited in 2.x [S266]
- related_to [[pixels-array]] — length scales with it [S37]
- related_to [[resolution-independence]] — pin it for stable output [S392]
- related_to [[perf-regressions-2x]] — regression entry [S266]

## Sources
- [S13] — createGraphics() reference
- [S17] — pixelDensity() reference
- [S37] — pixels reference
- [S131] — Best way to export an animation from a p5.js sketch in 2026
- [S256] — Optimizing WebGL Sketches (tutorial)
- [S257] — createFramebuffer() reference
- [S261] — loadPixels() reference
- [S263] — p5.Framebuffer pixelDensity() reference
- [S266] — Issue #8289 pixelDensity() applies only to the canvas, not p5.Graphics, in 2.x
- [S268] — Greetings from p5.js 2.0: Animation, Interaction, and Typography in 2D and 3D
- [S272] — Basic PPI Question
- [S392] — Beginner's guide to fxhash using p5.js
