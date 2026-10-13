---
id: module-image
title: "Image module"
type: Module
aliases: ["Image", "Image/Image", "Image/Loading & Displaying", "tint", "p5.Image", "image object", "loadImage()"]
sources: [S1, S10, S37, S38, S39, S40, S123, S357]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# Image module

## Definition
The Image module has 18 entries in three groups: Image (4: `createImage`, `p5.Image`, `saveCanvas`, `saveFrames`), Loading & Displaying (6: `image`, `imageMode`, `loadImage`, `noTint`, `saveGif`, `tint`) and Pixels (8: `blend`, `copy`, `filter`, `get`, `loadPixels`, `pixels`, `set`, `updatePixels`) [S357]. Folded topics `p5.Image` and `loadImage()` are described here [S357][S40].

## Details
- `loadImage()` returns a Promise of `p5.Image` and takes a path, URL, base64 data URI or Request; await it in [[async-setup]] **[changed in 2.x]**; remote images can hit CORS [S40].
- `p5.Image` has 21 members including `pause`, `play`, `setFrame`, `numFrames` and `getCurrentFrame` for animated GIFs [S357].
- `pixels[]` is a 1D RGBA array scaled by `pixelDensity`: pixel (0,0) occupies indices 0 to 3, a 100x100 canvas at density 2 has 160,000 elements; call `loadPixels()` before and `updatePixels()` after [S37].
- `set()` is slower than `pixels[]` and needs `updatePixels()` [S39]; 2.x color creation makes per-pixel `set()` far slower (60 vs 2 fps reported) [S123].
- `filter()` uses WebGL in the background by default, even in 2D; `filter(type, false)` switches to CPU; blur differs (box on WebGL, Gaussian on CPU) [S38]. See [[filter]] and [[pixels-array]].
- Export: `saveGif` and `saveFrames` live here (see [[save-gif]], [[save-frames]]); `MAX_GIF_PIXELS` caps GIF size at 16,000,000 by default [S357][S10].

## In explainer work
Rated **High** for export (`saveGif`, `saveFrames`) and **Low** for Pixels because per-pixel work is expensive per frame; `filter()` is handy for blur and focus effects [S357].

## Relations
- part_of [[hub-language-core]] (structural)
- part_of [[capability-map]] — top-level reference section [S1]
- uses [[save-gif]] — GIF export [S357]
- uses [[save-frames]] — PNG sequence export [S357]
- uses [[filter]] — shader/CPU filter presets [S38]
- uses [[pixels-array]] — raw pixel access [S37]
- depends_on [[async-setup]] — loadImage is awaited [S40]

## Sources
- [S1] — Reference index (v2)
- [S10] — p5.js GitHub releases page (v2.3.1 to v2.3.4)
- [S37] — pixels reference
- [S38] — filter() reference
- [S39] — set() reference
- [S40] — loadImage() reference
- [S123] — Speed of set(x, y, color) in p5.js 2.1.2 vs 1.11.11
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
