---
id: release-2-3
title: "p5.js 2.3"
type: Release
aliases: ["2.3", "v2.3.4", "PR preview builds bot"]
sources: [S10, S11, S62, S121, S274, S362, S363]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---
# p5.js 2.3

## Definition
p5.js 2.3 is the current minor line (latest patch v2.3.4, 25 Sep 2026); 2.3.0 added compute shaders to the experimental WebGPU renderer and filter shaders in 2D [S274][S10].

## Details
- 2.3.0 added compute shader support to WebGPU mode (demonstrated with Game of Life), filter shaders in 2D sketches, and `random()`, `map()`, `lerp()` inside strands [S274].
- In 2.3.0 a shader material can be written using only the `finalColor` hook [S274].
- 2.3.0 requires blank vectors to declare dimension, e.g. `createVector(0,0)` for 2D **[changed in 2.x]** [S274][S11].
- 2.3.0 credited 16 contributors, six first-time; a bot now builds a testable p5.js for each PR [S274].
- v2.3.1 (21 Jul) renamed the HDR colour constant to P3 (breaking), and added `randomGaussian()` and `color()` in strands, hex colours in shaders, TRIANGLE_FAN and a round-rect primitive [S62].
- v2.3.2 (30 Jul) sped up beginShape/endShape with many vertices and added a loading animation for slow `setup()` [S10].
- v2.3.3 (7 Sep) added a `MAX_GIF_PIXELS` limit (default 16,000,000) and an initial Decorators API guide [S10].
- v2.3.4 (25 Sep) fixed `p5.VERSION` and added a clearer error when `preload()` is used [S10][S362].
- The live p5js.org reference documents 2.3.3 while npm and GitHub `latest` are 2.3.4 [S363][S362].

> **Conflict:** 2.3.0 release date — GitHub release notes show 28 May [S121] vs the PF announcement post dated 22 Jun 2026 [S274]; likely tag vs blog date.

## In explainer work
- Compute shaders make GPU particle systems and cellular automata feasible for explainers, but only in experimental WebGPU mode (see [[webgpu-compute]]) [S274].
- Generated code must use `P3`, not `HDR`, from 2.3.1 on — a common LLM-codegen break (see [[p3-hdr-color]]) [S62].

## Relations
- introduced_in [[webgpu-compute]] — inverse: compute arrived in 2.3.0 [S274]
- supersedes [[release-2-2]] — next minor [S274]
- related_to [[release-2-4]] — work continues toward 2.4 [S10]
- related_to [[p3-hdr-color]] — HDR→P3 rename in 2.3.1 [S62]
- related_to [[filter-shaders]] — 2D filter shaders [S274]
- related_to [[hub-people-community]] (structural)
## Sources
- [S274] — "What's New in p5.js 2.3.0"
- [S10] — GitHub releases page
- [S62] — v2.3.1 release notes
- [S11] — compatibility README
- [S121] — v2.3.0 release notes
- [S362] — npm registry metadata
- [S363] — website version pin
