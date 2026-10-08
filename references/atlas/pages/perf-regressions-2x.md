---
id: perf-regressions-2x
title: "2.x performance regressions"
type: Concept
aliases: ["POINTS slowdown", "pixelDensity not inherited"]
sources: [S4, S10, S47, S123, S264, S265, S266, S267]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# 2.x performance regressions

## Definition
2.x performance regressions are documented slowdowns relative to 1.x: POINTS drawing in WEBGL, a colour-conversion and `noise()` path, and per-pixel `set()`; a partly landed fix exists **[changed in 2.x]** [S264][S265][S123].

## Details
- Reported in 2.0: 50K points in WEBGL ran about 60 fps in 1.11 but well below 10 fps in 2.0 on an M4 Mac; a maintainer said 2.0 draws points with a separate point shader and round versus square caps add negligible cost; workarounds were raw WebGL vertex-shader points or float framebuffers [S264].
- Issue #8316 (2.1.1): about 20,000 rects per frame ran slower and jittery versus 1.x; a sine replacement was equally slow, so `noise()` is not the sole cause; closed after a related PR, but maintainers said performance was not yet back to 1.x levels with a follow-up targeting the colour path [S265].
- The same issue identifies an unbounded `Color.toString` cache behind a long-run crash, with a proposed Map capped near 1,000 entries [S265].
- A community report measured about 60 fps (1.11.11) versus about 2 fps (2.1.2) for per-pixel `set()`; advice was to write to `pixels[]` or use a shader, because colour creation is slower in 2.x with a new conversion library [S123].
- `pixelDensity` is no longer inherited by `createGraphics` (issue #8289) [S266].
- Gains: text rendering for `textToPoints` was reported about 350 percent faster in 2.0, 2.2.2 added strands performance improvements, and 2.3.2 sped up `beginShape`/`endShape` with many vertices [S4][S47][S10].
> **Conflict:** the 2.0 release notes report `textToPoints` about 350 percent faster, while the performance branch found no quantified text-performance data for 2.x and treated typography as a refactor, not a measured speedup [S4] vs [S267].
- Whether the POINTS and density issues are fixed in the latest 2.x was not verified [S264][S266].

## In explainer work
Avoid `color()` per pixel and large `set()` loops; prefer `pixels[]`, shaders or framebuffers, and pin and test the exact 2.x version [S123][S264].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- related_to [[pixels-array]] — preferred over `set()` [S123]
- related_to [[pixel-density]] — inheritance issue [S266]
- related_to [[noise]] — issue context [S265]
- related_to [[p5-framebuffer]] — workaround for points [S264]
- related_to [[version-2x-migration]] — migration-time checks [S123]

## Sources
- [S4] — p5.js v2.0.0 release notes
- [S10] — p5.js GitHub releases page (v2.3.1 to v2.3.4)
- [S47] — p5.js 2.1 and 2.2: Expanding Graphics Avenues with p5.strands improvements and WebGPU
- [S123] — Speed of set(x, y, color) in p5.js 2.1.2 vs 1.11.11
- [S264] — Performance differences with POINTS between 1.11 and 2.0
- [S265] — Issue #8316 "noise() is laggier in 2.x"
- [S266] — Issue #8289 pixelDensity() applies only to the canvas, not p5.Graphics, in 2.x
- [S267] — Issue #7026 Typography module revamp RFC
