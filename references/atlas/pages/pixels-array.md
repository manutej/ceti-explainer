---
id: pixels-array
title: "pixels[] and loadPixels()"
type: Construct
aliases: ["pixels", "loadPixels", "updatePixels", "loadPixels / updatePixels", "set()", "get()", "Image/Pixels", "Density-safe pixel loop"]
sources: [S37, S39, S53, S56, S123, S255, S256, S261, S271]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# pixels[] and loadPixels()

## Definition
`pixels[]` is a 1D RGBA array of the canvas that must be filled by `loadPixels()` before reading or writing and flushed by `updatePixels()`; pixel (0,0) occupies indices 0 to 3 [S37][S261].

## Details
- Its length scales with `pixelDensity`: 160,000 elements for a 100x100 canvas at density 2 [S37].
- `set()` is slower than writing to `pixels[]` and its changes require `updatePixels()` [S39].
- Per-pixel loops are the main known slow path: they run serially on the CPU, and the official tutorial says to move them into filter shaders [S256].
- Halving each dimension of an image reduces iterations to a quarter [S255]. A low-confidence community doc claims step=2 sampling gives about 4x speedup [S271].
- In WebGPU mode `loadPixels()` and `get()` must be awaited **[beta]** [S56]. Framebuffer `pixels` access is slower than drawing [S53].
- A per-pixel `noise()` budget table from a low-confidence community doc (about 5 ms at 540x540, about 35 ms at 1920x1080) has no stated methodology [S271].

## In explainer work
Use `pixels[]` only for data-like effects that shaders cannot do; otherwise use filter shaders [S256].

## Patterns
```js
loadPixels();
const d = pixelDensity();
for (let y = 0; y < height * d; y++) for (let x = 0; x < width * d; x++) {
  const i = 4 * (y * width * d + x); pixels[i] = 255 - pixels[i];
}
updatePixels();
```
Pitfalls: loop over density-scaled dimensions [S37].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- alternative_to [[filter-shaders]] — GPU replacement [S256]
- depends_on [[pixel-density]] — length scaling [S37]
- related_to [[perf-regressions-2x]] — preferred over `set()` in 2.x [S123]
- related_to [[p5-framebuffer]] — read cost [S53]
- related_to [[module-image]] — Image/Pixels group [S37]

## Sources
- [S37] — pixels reference
- [S39] — set() reference
- [S53] — Reference p5.Framebuffer
- [S56] — Contribute: Using WebGPU mode
- [S123] — Speed of set(x, y, color) in p5.js 2.1.2 vs 1.11.11
- [S255] — Optimizing p5.js Code for Performance (wiki)
- [S256] — Optimizing WebGL Sketches (tutorial)
- [S261] — loadPixels() reference
- [S271] — Troubleshooting (p5js skill reference)
