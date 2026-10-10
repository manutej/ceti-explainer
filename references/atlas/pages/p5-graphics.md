---
id: p5-graphics
title: "p5.Graphics (createGraphics)"
type: Construct
aliases: ["createGraphics()", "graphics buffer", "offscreen buffer", "p5.Graphics.remove()", "p5.Graphics.reset()"]
sources: [S13, S61, S256, S259, S266, S270, S357]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# p5.Graphics (createGraphics)

## Definition
`p5.Graphics`, created with `createGraphics()`, is an offscreen drawing surface in P2D or WEBGL, displayed with `image()`; the reference says separate buffers can help performance and organisation [S13][S259].

## Details
- `createGraphics` supports P2D or WEBGL renderers and can wrap an existing canvas [S13].
- The main canvas resets transforms each `draw()`, but a Graphics buffer needs a manual `reset()` for transforms and lighting [S259].
- `remove()` removes its canvas; to free memory also set every reference to undefined [S259].
- A WEBGL Graphics can create a Framebuffer sharing its context, which enables the texture speedup [S259].
- Forum answer: drawing a WEBGL Graphics layer onto a P2D canvas adds compositing overhead versus an all-WEBGL sketch [S270].
- In 2.x, `pixelDensity(n)` on the main canvas is not inherited by Graphics created afterwards; call `pixelDensity` on each buffer (reported on 2.1.1, apparently unresolved when fetched) **[changed in 2.x]** [S266].
- A buffer that never changes should be frozen into a `p5.Image` with `get()` so p5 stops re-uploading the texture each frame, then removed [S256].

## In explainer work
Use buffers for static grids, backgrounds and label layers; in P2D use Graphics, in WEBGL prefer framebuffers [S357][S61].

## Patterns
Freeze a static layer.
```js
let bg = createGraphics(width, height);
bg.pixelDensity(1);                     // set explicitly in 2.x
bg.background(250); bg.line(0, 0, 100, 100);
const img = bg.get(); bg.remove(); bg = undefined;   // then image(img, 0, 0) per frame
```
Pitfalls: set density explicitly and drop all references [S266][S259].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- alternative_to [[p5-framebuffer]] — CPU canvas versus GPU surface [S256]
- enables [[layered-compositing]] — layer storage [S259]
- related_to [[perf-regressions-2x]] — density inheritance regression [S266]
- related_to [[pixel-density]] — must be set per buffer [S266]
- related_to [[module-rendering]] — Rendering group [S357]

## Sources
- [S13] — createGraphics() reference
- [S61] — Layered Rendering with Framebuffers
- [S256] — Optimizing WebGL Sketches (tutorial)
- [S259] — p5.Graphics reference
- [S266] — Issue #8289 pixelDensity() applies only to the canvas, not p5.Graphics, in 2.x
- [S270] — Optimization question about WEBGL
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
