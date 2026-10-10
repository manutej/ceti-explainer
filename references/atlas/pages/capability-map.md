---
id: capability-map
title: "Capability map of p5.js 2.x"
type: Concept
aliases: ["p5.js capability map", "relevance matrix", "reference counts", "Foundation module", "Foundation", "JS basics"]
sources: [S1, S4, S10, S11, S156, S158, S357, S358, S359, S360, S361, S362, S363, S364]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# Capability map of p5.js 2.x

## Definition
A backbone index of the p5.js 2.x reference: 17 top-level sections, 759 documented entries (439 global), 33 class folders, 140 constants and 5 types, counted by parsing every `.mdx` in the website repo's reference folder (last commit 2026-09-30) [S357]. The live reference documents 2.3.3; npm `latest` is 2.3.4 (2026-09-25) [S363][S362]. The 1.x reference has 905 entries, 396 global items and 46 class folders [S358]. Folded topic **Foundation** (aka JS basics, `module-foundation`) is the 8-entry section `async_await` (new), `class`, `console`, `for`, `function`, `if`, `let`, `while`, rated **Low** for explainers [S357].

## Summary of change
- Biggest growth: the 3D module went from 40 to 86 global entries, mostly the new **p5.strands** submodule (47 entries, 43 new, all beta) [S357][S358][S359].
- Typography was rebuilt from 12 to 21 items **[changed in 2.x]**; shapes and curves reworked (`curve*` -> `spline*`, plus `bezierOrder`, `splineProperty`, `vertexProperty`, `strokeMode`) [S357][S11].
- Events: Mouse and Touch merged into Pointer; Data shrank from 37 to 19; `preload()` replaced by async/await [S358][S357][S4].
- p5.sound became a thin layer over Tone.js (v0.4.1, 24 classes); sequencing, synth, recorder and peak-detect classes were dropped [S158][S364][S358].
- v2.3.4 `src/` has 17 folders including new `strands/` and `webgpu/` [S359].

## Details
### Module and group inventory
- [[module-shape]] (51 global): 2D Primitives 9 ([[shape-2d-primitives]]), Attributes 7 ([[shape-attributes]]), Curves 6 ([[shape-curves]]), Custom Shapes 12 ([[shape-custom-shapes]]), 3D Primitives 14 ([[shape-3d-primitives]]), 3D Models 3 ([[shape-3d-models]]) [S357].
- [[module-color]] (25): Creating & Reading 12, Setting 13; `blendMode` moved here from Rendering [S357][S358].
- [[module-typography]] (21, 9 new) [S357].
- [[module-image]] (18): Image 4, Loading & Displaying 6, Pixels 8 [S357].
- [[module-transform]] (12); `push` and `pop` moved here from Structure [S357][S358].
- [[module-environment]] (28, 2 new: `screenToWorld`, `worldToScreen`) [S357].
- [[module-3d]]: Camera 9, Interaction 3, Lights 10, Material 17 (2 new: `imageShader`, `strokeShader`), p5.strands 47 [S357].
- [[module-rendering]] (10) [S357].
- [[module-math]] (39): Calculation 18, Noise 3, Random 3, Trigonometry 10, Quaternion 3 (new pages) plus 2 vector entry points [S357].
- [[module-io]] (28): Input 19 (4 new), Table 2 (deprecated), Time & Date 7 [S357][S359].
- [[module-events]] (49): Pointer 22, Keyboard 8 (`code` new), Acceleration 19 [S357].
- [[module-dom]] (24; `addElement` new) [S357].
- [[module-data]] (19, down from 37) [S357][S358].
- [[module-structure]] (10; `registerAddon` new) [S357].
- [[module-constants]] (140; 19 with new reference pages) [S357].
- p5.sound: globals 10 (7 new), classes 24; see [[p5-sound]] [S357].

### Class member counts
- p5.Vector 36 ([[p5-vector]]), p5.Element 36 ([[p5-element]]), p5.Table 26 (all deprecated), p5.Image 21, p5.Camera 20 ([[p5-camera]]), p5.MediaElement 19 ([[p5-media-element]]), p5.XML 17, p5.SoundFile 16, p5.Framebuffer 15 ([[p5-framebuffer]]), p5.Geometry 14, p5.Color 6 ([[p5-color]]), p5.File 6, p5.TableRow 6, p5.Shader 5 ([[p5-shader]]), p5.Font 4 ([[p5-font]]), p5.Graphics 3 ([[p5-graphics]]), p5.StorageBuffer 3 [S357].

### Status flags
- In the v2.3.4 source, p5.strands, parts of `material.js`, `p5.Shader`, `p5.Renderer3D` and `p5.RendererWebGPU` carry `@beta` tags **[beta]** [S359].
- `p5.Table`, `p5.TableRow`, `splitTokens`, `p5.Vector.array()` and `instanceID` are deprecated; `createVector()` without arguments is deprecated [S357][S359].
- WEBGPU canvases need the separate `p5.webgpu.js` build and an awaited `createCanvas` (see [[webgpu-renderer]]) [S10][S357].
- v2.3.1 renamed `HDR` to `P3` (RGBP3, P2DP3; see [[p3-hdr-color]]); v2.3.3 added `MAX_GIF_PIXELS` (16,000,000) [S10].

### Main branch (post-2.3.4, unreleased)
- **[main / unreleased]** `loadSVG`, `createSVG`, `p5.ShapeCollection` (see [[p5-svg-main-branch]]), `instances(count)` for GPU instancing ([[gpu-instancing]]), `p5.StorageList` and strands matrix/transform helpers (`mat2`-`mat4`, `transformPoint`, `rotateAxisAngle`) [S360].

### Hidden and moved items
- `loading` (core/loading.js) is a reference file with no module; the Decorators API (`p5.registerDecoration`) has no reference page (see [[decorators-api]]) [S357][S10].
- Some items changed class owner without changing behavior: `p5.Camera.roll`, `p5.Geometry.saveObj/saveStl`, `p5.Font.textBounds`, `p5.PrintWriter` write/close, `input`/`changed` [S357][S361].
- A raw JSDoc diff v1.11.10 to v2.3.4 lists 239 public tags missing in 2.x, mostly documentation reorganisation, not functional removals [S361][S359].

### Libraries directory
- The directory lists p5.capture and p5.videorecorder under Export and p5.createLoop and p5.animS under Animation; only p5.tree is labeled v2-targeted; no easing library appears (see [[p5js-libraries-directory]]) [S156].

## Relevance matrix for explainer animation
Ratings are the branch author's analytical judgement grounded in documented capabilities, not source claims [S357][S156].
- **High**: Shape/2D Primitives (diagram vocabulary), Shape/Curves (`bezierPoint`/`splinePoint` for points on paths), Shape/Custom Shapes (draw-on reveals, holes), Color (`lerpColor`, `paletteLerp`, OKLCH, `clip`/`erase`), Typography, Image export (`saveGif`, `saveFrames`), Transform, Environment (`frameCount`, `deltaTime`, `pixelDensity`), Rendering (layers), Math/Calculation, Math/Trigonometry, p5.Vector, Structure [S357][S4].
- **Medium**: Shape/Attributes, 3D Primitives and Models, 3D/Camera (slerp transitions), 3D/Material (filter shaders), 3D/p5.strands (powerful but beta and churning), Math/Noise, Math/Random (`randomSeed`), IO/Input, IO/Time & Date, Events (key-driven stepping), DOM (scrubbers, `addCue`), Constants, p5.sound (FFT/Amplitude, SoundFile) [S357][S359][S10].
- **Low**: Image/Pixels, 3D/Interaction (`orbitControl`), 3D/Lights, Math/Quaternion, IO/Table (deprecated), Data, Foundation [S357][S359].
- There is no easing or tween API in core: `lerp`, `map`, `constrain`, `norm` are the tweening toolkit (see [[easing-functions]]) [S357].

## In explainer work
### Patterns anchored on the map
- **Draw-on path reveal** (Custom Shapes): emit the first N `splineVertex` points from progress `t`; close only at t=1 (see [[shape-custom-shapes]]) [S4].
- **Text-to-points morph** (Typography): sample two strings, index modulo or resample; use `textToContours` to keep per-letter grouping (see [[text-to-points]], [[text-to-contours]]) [S357][S4].
- **Deterministic frame export**: derive `t = frameCount / (FPS * DUR)`, never `millis`; stop with `noLoop()`; large GIFs hit `MAX_GIF_PIXELS` and `pixelDensity` multiplies output size (see [[save-gif]], [[frame-stepped-export]]) [S10][S357].
- **Layered compositing**: `createGraphics` (2D) or `createFramebuffer` (WEBGL) for static backgrounds; the framebuffer is WEBGL-only (see [[layered-compositing]]) [S357].
- **Async asset loading**: `await loadFont(...)` in setup; `preload()` gives a clear error from 2.3.4 (see [[async-setup]]) [S10][S11].

## Relations
- part_of [[hub-language-core]] (structural)
- related_to [[version-2x-migration]] — the delta between 1.x and 2.x maps [S358]
- related_to [[p5js-reference]] — source of the counts [S357]
- uses [[module-shape]] — top-level section [S357]
- uses [[module-math]] — top-level section [S357]
- uses [[module-3d]] — largest growth section [S357]
- related_to [[p5-strands]] — 47-entry beta submodule [S359]
- related_to [[p5-svg-main-branch]] — unreleased additions [S360]
- related_to [[p5js-1x]] — comparison baseline [S358]

## Sources
- [S1] — Reference index (v2)
- [S4] — p5.js v2.0.0 release notes
- [S10] — p5.js GitHub releases page (v2.3.1 to v2.3.4)
- [S11] — p5.js-compatibility add-ons
- [S156] — p5.js Libraries page
- [S158] — p5.sound.js repo
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
- [S358] — p5.js-website repo, `v1` branch reference (1.x reference; parsed 905 entries)
- [S359] — p5.js source at tag v2.3.4 (`src/` folder; JSDoc @module/@submodule/@method/@beta/@deprecated tags parsed)
- [S360] — p5.js source on `main` (commit aa192a2, 2026-10-07; post-2.3.4 work)
- [S361] — p5.js source at tag v1.11.10 (1.x baseline for removed/moved diff)
- [S362] — npm registry metadata for `p5` (dist-tags latest 2.3.4, r1 1.11.13, beta 2.3.1-rc.2; 2.0.0 published 2025-04-17)
- [S363] — p5.js-website `src/globals/p5-version.ts` (p5Version 2.3.3, p5SoundVersion 0.4.1)
- [S364] — npm registry metadata for `p5.sound` (latest 0.4.1)
