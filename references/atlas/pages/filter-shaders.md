---
id: filter-shaders
title: "Filter shaders"
type: Construct
aliases: ["createFilterShader", "loadFilterShader", "filter shader", "Post-process via filter shader", "Shader instead of pixel loop", "Contact Shadow filter", "Pagurek shadow filter"]
sources: [S38, S49, S52, S64, S256, S274, S388]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# Filter shaders

## Definition
Filter shaders are fragment-only shaders applied to the whole canvas through `filter(shader)`, built with `createFilterShader` or the strands `buildFilterShader` with a `filterColor` hook **[2.x]** [S64][S49][S38].

## Details
- The fragment shader uses a `tex0` uniform for the canvas content [S38].
- The tutorial demonstrates pixelate and bloom filters as strands examples [S49].
- `createFilterShader()` is the GPU replacement for per-pixel `pixels[]` loops, since the loop runs serially on the CPU [S256].
- Craig Kaplan used Dave Pagurek's Contact Shadow p5 filter, deliberately underpowered, for a pencil look in Genuary 2024 [S388].
- Filter shaders work in 2D mode since 2.3.0 [S274].

## In explainer work
Grain, dither, tint, bloom and pixelate can be applied in one pass; isolate layers first because a filter always covers the entire canvas [S256][S64].

## Patterns
Shader instead of pixel loop.
```js
let f;
function setup() { createCanvas(400, 300, WEBGL); f = buildFilterShader(() => { /* fill the filterColor hook: read canvasContent, return a tinted colour */ }); }
function draw() { background(255); /* scene */ filter(f); }
```
Pitfalls: hook names are experimental [S49][S52].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- depends_on [[filter]] — applied through it [S38]
- alternative_to [[pixels-array]] — GPU versus CPU pixel work [S256]
- uses [[shader-hooks]] — `filterColor` [S49]
- related_to [[layered-compositing]] — whole-canvas caveat [S64]
- related_to [[craig-kaplan]] — pencil-look filter use [S388]

## Sources
- [S38] — filter() reference
- [S49] — p5.strands: Introduction to Shaders (tutorial)
- [S52] — Reference buildMaterialShader()
- [S64] — Introduction to GLSL (tutorial)
- [S256] — Optimizing WebGL Sketches (tutorial)
- [S274] — What's New in p5.js 2.3.0!
- [S388] — Genuary 2024
