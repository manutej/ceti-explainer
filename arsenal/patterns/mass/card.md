# mass · thousands of marks as a count structure

**For.** Showing a count as the count: N = 1,000 to 50,000 marks laid out as a grid, a scatter or stacked bars. Every mark's state comes from `ctx.seed` and `t`: it arrives (staggered rain), sorts into category order, a subset highlights (rest dims, subset swells), and the viewer's guess is placed on the structure (stepped outline on the grid, a line on bars, a ring at local density on the scatter). Actual count is shown after the guess.

**Not for.** Fewer than ~300 marks (use SVG), marks with individual labels, per-mark shapes other than squares, per-mark state that is not a function of (seed, t) such as physics or interaction.

## Params
| param | default / range | note |
|---|---|---|
| N | 1000 (100..50000) | marks |
| structure | grid / scatter / bars | one of three |
| impl | canvas2d / shape / webgl / instances | `instances` resolves to `webgl` when `p.instances` is absent (recorded in `state.note`); `shape` = p5 beginShape(QUADS) per colour |
| dur | 8 s | phases are fractions of it |
| mix | [.4,.35,.25] (2..4 cats) | category shares; exact counts |
| sort | true | false skips the sort phase |
| hlFrac | 0 (0..0.2) | highlighted random subset |
| guess | count or 0 | viewer's guess, in marks |
| phase | {arrive, sort, hl, guess}: [t0,t1] fractions | each mark moves for 35% of its phase, rest is stagger |

## Variants
- `grid-1000`: canvas2d, arrive then sort into three bands, guess outline of 300 against 400 actual.
- `scatter-10000`: canvas2d, random scatter sorts into three clusters, 4% highlighted in accent, guess ring.
- `bars-50000`: webgl, shuffled waffle sorts into three stacked bars (cells ~1.9 units), guess line.

## Atlas
[[gpu-instancing]] (S275, S278, S10), [[build-geometry]] (S256, S262, S49), [[performance-profiling]] (S255, S256), [[webgl-mode]] (S58, S62), [[perf-regressions-2x]] (S264, S265), [[pixels-array]] (S256: GPU over per-pixel loops), [[p5-framebuffer]] (considered, not used).

## Cost, ms per frame, 960x540 at density 2
Headless Chromium, SwiftShader software GL and CPU raster, grid structure, mean of 6 frames across the timeline, forced sync each frame (getImageData / readPixels). Real GPUs will be faster for the GL rows. `bench.mjs` regenerates `bench.json`.

| N | canvas2d (one ctx path per colour) | shape (beginShape QUADS per colour) | webgl (buildGeometry baked) | instances() |
|---|---|---|---|---|
| 1,000 | 4 | 7 | 103 | = webgl (101) |
| 10,000 | 18 | 185 | 115 | = webgl (102) |
| 50,000 | 48 | **4,005** | 195 | = webgl (183) |

Setup (bake) for webgl: 0.1 s / 0.4 s / 1.5 s. canvas2d setup under 0.1 s. Shoot harness: 0.19 s/frame average (3 variants incl. WEBGL), purity identical, no errors.
Floor of the released instancing route, `model(geom, n)` with strands `instanceID()` (id-derived grid, no per-mark state, p5's full material shader): 162 / 332 / 1,051 ms. So p5.beginShape per colour fails the 1 s budget at 50,000; raw `drawingContext` paths and baked WEBGL both pass with a wide margin; canvas2d wins on software rendering.

## Fallback and findings
- `instances()` is `undefined` on 2.3.4 (checked `typeof instances` and `p5.prototype`). The module detects it and falls back to the baked path; even when present it would need a strands hook for per-instance state, not wired. Real instancing on 2.3.4: `model(g, n)` plus strands `instanceID()` works (probe), but state must derive from the id or a texture.
- `buildGeometry` plus `vertexProperty()` carries per-vertex custom attributes into a custom shader (attributes aS, aA, aB, aD); motion is evaluated in the vertex shader from uniforms. Colours are 0..255 in `fill()` inside buildGeometry.

## Pitfalls
- p5 2.3.4 overflows the stack inside buildGeometry beyond ~8k marks of quads (spread of face arrays); the module bakes in chunks of 4,000.
- A full-canvas `createGraphics` texture drawn each frame cost ~0.8 s/frame in software GL; text goes in a 960x96 band texture, strokes use plain WEBGL calls.
- Custom shader ignores p5 camera: positions are canvas units (0..960, 0..540).
- Strands hooks cannot close over JS variables (bake numbers into the source).
- Texture token (paper, grain) is not applied; marks are squares in every renderer. Renderer for a variant: `ARSENAL.patterns.mass.rendererFor(params)`; the demo recreates the canvas when it changes.
- Roles used: bg, ink, muted, accent2, chalk (categories), accent (highlight), line (frame).
