---
id: filter
title: "filter()"
type: Construct
aliases: ["filter presets", "Shader filter for full-frame effects"]
sources: [S38, S48, S64, S256, S274, S357]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# filter()

## Definition
`filter()` applies a preset (INVERT, GRAY, THRESHOLD, OPAQUE, POSTERIZE, BLUR, ERODE, DILATE) or a shader to the whole canvas, backed by WebGL by default because it is faster [S38].

## Details
- `filter(type, false)` in P2D switches to CPU filters; blur kernels differ between paths (WEBGL blur is a box blur while P2D uses Gaussian), so frames may not match across choices [S38].
- Custom shader filters via `filter(shader)` work only in WEBGL and need a `tex0` uniform [S38].
- Filter shaders always apply to the whole canvas [S64].
- Built-in filters such as POSTERIZE already use the strands approach [S48].
- Since 2.3.0 filter shaders also work in 2D sketches **[2.x]** [S274].

## In explainer work
Use presets for quick full-frame looks and a layer buffer when only part of the scene should be affected [S64][S38].

## Patterns
```js
filter(POSTERIZE, 4);          // WebGL-backed by default
filter(BLUR, 3, false);        // CPU path; kernel differs
```
Pitfalls: renderer choice changes blur look; fix the choice for a whole project [S38].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- integrates_with [[filter-shaders]] — custom shader variant [S38]
- related_to [[layered-compositing]] — isolate before filtering [S64]
- related_to [[module-color]] — Color/Setting group neighbourhood [S357]
- related_to [[pixels-array]] — GPU alternative to pixel loops [S256]

## Sources
- [S38] — filter() reference
- [S48] — WebGPU in p5.js
- [S64] — Introduction to GLSL (tutorial)
- [S256] — Optimizing WebGL Sketches (tutorial)
- [S274] — What's New in p5.js 2.3.0!
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
