---
id: p5-strands
title: "p5.strands"
type: Capability
aliases: ["strands", "JS shaders", "3D/p5.strands", "shader authoring in JS", "Material tweak with strands", "Strands builder functions", "buildMaterialShader", "buildFilterShader", "buildColorShader", "buildNormalShader", "buildStrokeShader", "p5.env", "generative environment lighting", "p5.warp", "vertex shader domain warping", "3D/p5.strands main-branch additions"]
sources: [S47, S48, S49, S50, S52, S58, S59, S60, S62, S65, S79, S274, S275, S296, S357, S359]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# p5.strands

## Definition
p5.strands is a JavaScript-syntax shader API, introduced in p5.js 2.0, that transpiles to GLSL (and targets WebGPU) so built-in shaders can be modified without writing GLSL **[2.x]** **[beta]** [S47][S49][S296].

## Details
- Evolution: 2.1 added if/else branching and for-loops; 2.2.1 delivered a simpler, flatter API; 2.2.2 added performance improvements and `millis()`; 2.3.0 added `random()`, `map()`, `lerp()`, `instanceID()` and filter shaders in 2D; 2.3.1 added `randomGaussian()`, `color()`, hex colours and the `instanceIndex` alias [S47][S274][S62].
- Builders: `buildColorShader`, `buildMaterialShader` (auto-applied when lights exist), `buildNormalShader`, `buildStrokeShader`, `buildFilterShader`, plus `buildComputeShader` [S49][S60].
- Vectors use array or `vec4()` syntax with swizzling; standard p5 variables (`width`, `mouseX`, `frameCount`, `deltaTime`) work inside callbacks; framebuffers pass with `uniformTexture(framebuffer)` [S49].
- The reference group has 47 entries, all beta, 43 new in 2.x [S357]; v2.3.4 source tags strands `@beta` [S359].
- A cube-of-cubes example shows JS loops slowing with count while strands keeps GLSL-level speed; no numbers are given [S47].
- Shaders written for WebGL are meant to work in WebGPU, called a goal, not a finished feature [S47].
- The strands tutorial lacks a limitations section; maturity is inferred from API churn (2.1, 2.2.1, 2.2.2, 2.3.1) [S49].
- Pagurek's `p5.env` (environment lighting, 2026-06-19) and `p5.warp` (vertex-shader domain warping with automatic differentiation) are libraries built on this approach [S59].
- Math functions such as `noise()` and `lerp()` appear in strands examples [S65][S79].

## In explainer work
It is the route to GPU-speed filters, instanced token clouds and material tweaks with readable code [S49][S275]. Pin the p5 version and re-test, because API names moved more than once [S47][S62].

## Patterns
Rim-light material tweak (illustrative skeleton; hook bodies omitted, see the strands tutorial).
```js
let s;
function setup() { createCanvas(400, 400, WEBGL); s = buildMaterialShader(() => { /* fill the finalColor hook: brighten edges by a Fresnel term */ }); }
function draw() { background(20); shader(s); sphere(100); }
```
Pitfalls: experimental API; consult the current reference for hook argument names [S52].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- uses [[shader-hooks]] — fills named stages [S52]
- enables [[webgpu-renderer]] — shared shaders [S48]
- enables [[gpu-instancing]] — per-instance shaders [S275]
- introduced_in [[release-2-0]] — arrived in 2.0 [S47]
- alternative_to [[p5-shader]] — JS versus hand-written GLSL [S58]
- maintained_by [[dave-pagurek]] — led the work [S47]
- teaches [[lgm-2026-strands-talk]] — design talk [S50]

## Sources
- [S47] — p5.js 2.1 and 2.2: Expanding Graphics Avenues with p5.strands improvements and WebGPU
- [S48] — WebGPU in p5.js
- [S49] — p5.strands: Introduction to Shaders (tutorial)
- [S50] — Beginner-Friendly Shader Programming in p5.js v2 (LGM 2026 talk page)
- [S52] — Reference buildMaterialShader()
- [S58] — Reference createShader()
- [S59] — Dave Pagurek personal site
- [S60] — Reference buildComputeShader()
- [S62] — p5.js 2.3.1 release notes (mirror)
- [S65] — noise() reference (p5.js 2.3.3)
- [S79] — src/math/calculation.js (main branch)
- [S274] — What's New in p5.js 2.3.0!
- [S275] — Drawing a Forest in One Line: A Preview of Instancing in p5.strands
- [S296] — LGM 2026 talk: p5.js beginner-friendly shader programming
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
- [S359] — p5.js source at tag v2.3.4 (`src/` folder; JSDoc @module/@submodule/@method/@beta/@deprecated tags parsed)
