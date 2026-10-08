---
id: hub-motion-rendering
title: "Hub: Motion, timing and rendering"
type: Concept
aliases: ["C2 hub"]
sources: [S1, S4, S9, S10, S11, S17, S18, S47, S48, S54, S56, S58, S72, S76, S77, S79, S80, S82, S84, S85, S97, S100, S123, S127, S128, S129, S130, S131, S133, S135, S137, S138, S139, S142, S255, S256, S257, S262, S264, S265, S266, S274, S309, S316, S335, S341, S357, S365, S366, S367, S370, S372, S387]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# Hub: Motion, timing and rendering

## Definition
This hub covers how p5.js sketches move, keep time, render and perform: clocks and determinism, math and easing, generative technique, WEBGL and WebGPU rendering, shaders and p5.strands, buffers, render quality, performance and pointer or keyboard input; it spans 67 pages and sits between [[hub-language-core]] and [[hub-explainer-production]] [S139][S47][S255].

## Details
The cluster's thesis is that every frame of an explainer should be a pure function of a playhead plus fixed seeds, rendered either live from a wall clock or offline from a frame index through the same code path [S135][S139][S316]. The rest of the pages supply the ingredients (math, easing, noise), the renderers (P2D, WEBGL, experimental WebGPU), the GPU tools (framebuffers, shaders, strands) and the quality and speed knobs. Version anchors: 2.0.0 released 2025-04-17, 2.1 and 2.2 brought strands control flow and the WebGPU renderer, 2.3.0 added compute shaders on 2026-06-22, 2.3.4 is latest (2026-09-25) and 2.4 on main carries `instances()` [S4][S47][S274][S10].

## Clocks, time and determinism
- Observations versus controls: `frameRate()` sets only a target, while `deltaTime` and `millis()` observe real elapsed time, so any scene reading them is not reproducible [S127][S18][S130]. See [[frame-rate]], [[delta-time]], [[millis]], [[frame-count]].
- Reproducible architecture: normalise to `t` in [0,1), divide by total frames (not minus one) to avoid a duplicate loop frame, and fix `randomSeed` and `noiseSeed` [S135][S128][S72]. See [[pure-function-of-t]], [[normalized-time]], [[seeded-determinism]], [[random-seed]].
- Driving frames: `noLoop()` plus an awaited `redraw()` steps the sketch one frame at a time, which is what frame-accurate capture needs [S9][S138]. See [[loop-control]], [[redraw]], [[fixed-timestep]], [[real-time-vs-frame-based]].
- A hybrid clock returns live time in interactive mode and `i/N` in export mode (inference mirroring canvas-sketch) [S139]; export itself is covered under [[video-export-pipeline]].

## Math, easing and motion
- Primitives: `lerp`, `map`, `norm` and `constrain` are unclamped one-liners except where told; easing remaps progress before `lerp` [S79][S80]. See [[lerp]], [[map-norm-constrain]], [[easing-functions]], [[math-trigonometry]].
- Randomness: `noise()` is value noise seeded separately from `random()`, so full determinism needs both seeds [S76][S72][S77]. See [[noise]], [[random]], [[p5-vector]] (n-dimensional in 2.x).
- Simulation: Nature of Code's motion algorithm, oscillation and steering are accumulated-state methods and need a fixed step or re-simulation to scrub [S82][S85][S84]. See [[euler-integration]], [[oscillation]], [[steering-behaviors]], [[random-walk]].

## Loops and generative technique
- Loop families: phase-driven loops, noise on a circle, and position-offset waves [S387][S133][S142]. See [[loop-phase-animation]], [[noise-loop]], [[grid-offset-loop]].
- Flow fields and Fidenza-style craft: field tracing, spacing checks, weighted palettes and distributions, triangle subdivision, reference-width geometry [S366][S365][S370][S372][S367]. See [[flow-field]], [[collision-curve-packing]], [[probabilistic-palette]], [[generative-distributions]], [[triangle-subdivision]], [[resolution-independence]].
- Diagram motion: arc-length draw-on, vertex-lerp morphs and keyed cameras [S309][S341][S335]. See [[arc-length-reveal]], [[shape-morph]], [[camera-choreography]], [[camera-slerp]].

## Renderers, buffers and shaders
- WEBGL is the safe production target; WebGPU is an experimental clone aiming at parity, loaded as a separate add-on with an awaited `createCanvas` [S48][S56]. See [[webgl-mode]], [[webgpu-renderer]], [[webgpu-compute]].
- 3D content: camera, lights, materials, models and baked geometry [S54][S357][S262]. See [[module-3d]], [[p5-camera]], [[world-to-screen]], [[lights-and-materials]], [[shape-3d-primitives]], [[shape-3d-models]], [[build-geometry]].
- Offscreen surfaces: framebuffers stay on the GPU and are much faster than `p5.Graphics` as textures [S257]. See [[p5-graphics]], [[p5-framebuffer]], [[layered-compositing]], [[ping-pong-feedback]].
- Shader tiers: raw GLSL, hooks, and p5.strands (JS to GLSL), all marked experimental in the reference [S47][S58]. See [[p5-shader]], [[shader-hooks]], [[p5-strands]], [[gpu-instancing]], [[filter]], [[filter-shaders]], [[lgm-2026-strands-talk]].

## Quality and performance
- Output size is canvas size times `pixelDensity`; density is not inherited by `createGraphics` in 2.x [S17][S266]. See [[pixel-density]], [[antialiasing]], [[hi-res-render]].
- Measure first, then freeze static layers, bake geometry and replace pixel loops with shaders [S255][S256]. See [[performance-profiling]], [[pixels-array]], [[perf-regressions-2x]].
- Documented 2.x regressions (POINTS, colour path, per-pixel `set()`) and the lack of official benchmarks mean figures here are directional [S264][S265][S123][S255].

## Input
- Mouse and touch are unified under pointer handling; `mouseButton` is an object; `keyIsDown` rejects numeric codes [S11][S97]. See [[pointer-events]], [[mouse-button-object]], [[events-keyboard]], [[event-driven-redraw]].

## Decision guide
- Interactive widget: wall-clock time, pointer input, `noLoop()` plus `redraw()` for static figures [S100][S127].
- Exported clip: frame index, seeds in the frame function, stepped capture [S137][S131].
- Heavy GPU scene: framebuffers and strands on WEBGL first, WebGPU opt-in with fallback [S48].

## Page index

### Module
- [[module-3d]] — 3D module

### Capability
- [[antialiasing]] — Antialiasing (smooth, setAttributes)
- [[events-keyboard]] — Keyboard events
- [[gpu-instancing]] — GPU instancing (instances())
- [[lights-and-materials]] — Lights and materials
- [[math-trigonometry]] — Trigonometry and angleMode
- [[p5-strands]] — p5.strands
- [[pointer-events]] — Pointer events (2.x)
- [[shape-3d-models]] — 3D models
- [[shape-3d-primitives]] — 3D primitives
- [[webgl-mode]] — WEBGL mode
- [[webgpu-compute]] — WebGPU compute shaders
- [[webgpu-renderer]] — WebGPU renderer
- [[world-to-screen]] — worldToScreen() / screenToWorld()

### Construct
- [[build-geometry]] — buildGeometry()
- [[delta-time]] — deltaTime
- [[filter]] — filter()
- [[filter-shaders]] — Filter shaders
- [[frame-count]] — frameCount
- [[frame-rate]] — frameRate()
- [[lerp]] — lerp()
- [[loop-control]] — noLoop(), loop(), isLooping()
- [[map-norm-constrain]] — map(), norm(), constrain()
- [[millis]] — millis()
- [[mouse-button-object]] — mouseButton object
- [[noise]] — noise()
- [[p5-camera]] — p5.Camera
- [[p5-framebuffer]] — p5.Framebuffer
- [[p5-graphics]] — p5.Graphics (createGraphics)
- [[p5-shader]] — p5.Shader
- [[p5-vector]] — p5.Vector
- [[pixel-density]] — pixelDensity()
- [[pixels-array]] — pixels[] and loadPixels()
- [[random]] — random() and randomGaussian()
- [[random-seed]] — randomSeed() and noiseSeed()
- [[redraw]] — redraw()

### Concept
- [[easing-functions]] — Easing functions
- [[fixed-timestep]] — Fixed-timestep rendering
- [[generative-distributions]] — Distributions for generative variety
- [[normalized-time]] — Normalized time t (playhead)
- [[oscillation]] — Oscillation and harmonic motion
- [[perf-regressions-2x]] — 2.x performance regressions
- [[pure-function-of-t]] — Pure function of t
- [[real-time-vs-frame-based]] — Real-time vs frame-based animation
- [[resolution-independence]] — Resolution independence
- [[shader-hooks]] — Shader hooks

### Pattern
- [[arc-length-reveal]] — Arc-length path reveal
- [[camera-choreography]] — Camera choreography
- [[event-driven-redraw]] — Event-driven redraw
- [[hi-res-render]] — High-resolution offline render
- [[layered-compositing]] — Layered compositing
- [[seeded-determinism]] — Seeded determinism
- [[shape-morph]] — Shape and text morph

### Technique
- [[camera-slerp]] — Camera slerp
- [[collision-curve-packing]] — Collision-checked curve packing
- [[euler-integration]] — Motion algorithm (Euler integration)
- [[flow-field]] — Flow field
- [[grid-offset-loop]] — Grid offset loop
- [[loop-phase-animation]] — Loop-phase animation
- [[noise-loop]] — Seamless noise loop
- [[performance-profiling]] — Performance profiling
- [[ping-pong-feedback]] — Ping-pong feedback framebuffers
- [[probabilistic-palette]] — Probabilistic palette
- [[random-walk]] — Random walk
- [[steering-behaviors]] — Steering behaviors
- [[triangle-subdivision]] — Self-balancing triangle subdivision

### Work
- [[lgm-2026-strands-talk]] — LGM 2026 p5.strands talk

## Relations
- part_of [[index]] — cluster entry point of the atlas [S139]
- related_to [[hub-language-core]] (structural)
- related_to [[hub-explainer-production]] (structural)
- related_to [[video-export-pipeline]] — stepped capture hub [S131]
- related_to [[explainer-engine-blueprint]] — track and tween architecture built on the playhead [S316]
- related_to [[version-2x-migration]] — migration checks for the changed items here [S11]
- related_to [[capability-map]] — reference counts for the 3D and Math modules [S357]
- related_to [[open-questions]] — unresolved items from this cluster [S129]

## Sources
- [S1] — Reference index (v2)
- [S4] — p5.js v2.0.0 release notes
- [S9] — redraw() reference
- [S10] — p5.js GitHub releases page (v2.3.1 to v2.3.4)
- [S11] — p5.js-compatibility add-ons
- [S17] — pixelDensity() reference
- [S18] — frameRate() reference
- [S47] — p5.js 2.1 and 2.2: Expanding Graphics Avenues with p5.strands improvements and WebGPU
- [S48] — WebGPU in p5.js
- [S54] — Reference p5.Camera
- [S56] — Contribute: Using WebGPU mode
- [S58] — Reference createShader()
- [S72] — noiseSeed() reference
- [S76] — src/math/noise.js (main branch)
- [S77] — src/math/random.js (main branch)
- [S79] — src/math/calculation.js (main branch)
- [S80] — Easing functions cheat sheet
- [S82] — The Nature of Code, Vectors chapter
- [S84] — The Nature of Code, Autonomous Agents chapter
- [S85] — The Nature of Code, Oscillation chapter
- [S97] — p5.js reference: keyIsDown()
- [S100] — Discourse: pause/noLoop sketch when not visible
- [S123] — Speed of set(x, y, color) in p5.js 2.1.2 vs 1.11.11
- [S127] — deltaTime
- [S128] — randomSeed()
- [S129] — frameCount
- [S130] — millis()
- [S131] — Best way to export an animation from a p5.js sketch in 2026
- [S133] — Challenge 137: 4D OpenSimplex Noise Loop
- [S135] — FOTD: loopsin
- [S137] — Export Pipeline (p5js agent-skill reference)
- [S138] — CCapture.js README
- [S139] — canvas-sketch: Animated Sketches
- [S142] — Bees & Bombs cube wave challenge page
- [S255] — Optimizing p5.js Code for Performance (wiki)
- [S256] — Optimizing WebGL Sketches (tutorial)
- [S257] — createFramebuffer() reference
- [S262] — buildGeometry() reference
- [S264] — Performance differences with POINTS between 1.11 and 2.0
- [S265] — Issue #8316 "noise() is laggier in 2.x"
- [S266] — Issue #8289 pixelDensity() applies only to the canvas, not p5.Graphics, in 2.x
- [S274] — What's New in p5.js 2.3.0!
- [S309] — p5.animS README
- [S316] — Motion Canvas tutorial part 1
- [S335] — p5.Camera `slerp()` reference
- [S341] — Coding Challenge #81 Circle Morphing
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
- [S365] — Fidenza
- [S366] — Flow Fields
- [S367] — Code Review: Fidenza by Tyler Hobbs
- [S370] — Probability Distributions for Algorithmic Artists
- [S372] — Aesthetically Pleasing Triangle Subdivision
- [S387] — Coding Challenge #135 Making a GIF Loop
