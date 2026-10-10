---
id: gpu-instancing
title: "GPU instancing (instances())"
type: Capability
aliases: ["instances()", "instanceIndex", "instanceID", "Instancing in strands", "Mass-element explainer scenes"]
sources: [S10, S49, S62, S275, S278, S294]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# GPU instancing (instances())

## Definition
GPU instancing in p5.strands draws N copies of a primitive or model in one call; the merged `instances(n)` API, for example `instances(500).sphere(20)`, is captioned "Coming in p5.js 2.4" and is unreleased as of 2.3.4 **[main / unreleased]** [S275][S10].

## Details
- Released route: `buildGeometry()` makes a model and `model(geometry, n)` draws n instances with a custom shader; a custom shader is required [S49].
- Per-instance index: `instanceID` was renamed to `instanceIndex` (2.3.1 added the alias) to match WebGPU naming, with `instanceID()` kept for compatibility but to be deprecated; whether it is a value or a function was still open in the tracking issue [S62][S278].
- All planned tasks (alias, `instances()`, primitive integration, WebGL and WebGPU tests, docs) are checked off in issue #8911; the Foundation preview of 2026-08-10 by Akshat Patil funded by an OSS microgrant shows 800 trees in two draw calls [S278][S275][S294].
- It uses WebGPU where available and falls back to WebGL [S275].
- No 2.4 release candidate existed as of 8 October 2026 [S10].

## In explainer work
Hundreds or thousands of animated tokens, particles or data points without CPU loops, such as attention heads, embedding clouds or packets [S275].

## Patterns
Mass-element scene (2.4 preview API; verify names on release).
```js
let grid;
async function setup() { await createCanvas(600, 400, WEBGL); grid = instances(1000); }
function draw() { background(12); grid.sphere(3); }   // per-instance placement in a strands hook
```
Pitfalls: unreleased; placement must happen in a strands hook rather than JS [S275][S278].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- part_of [[p5-strands]] — strands feature [S275]
- introduced_in [[release-2-4]] — slated for 2.4 [S275]
- uses [[build-geometry]] — models to instance [S49]
- authored_by [[akshat-patil]] — built under a microgrant [S275]
- related_to [[webgpu-renderer]] — preferred backend [S275]

## Sources
- [S10] — p5.js GitHub releases page (v2.3.1 to v2.3.4)
- [S49] — p5.strands: Introduction to Shaders (tutorial)
- [S62] — p5.js 2.3.1 release notes (mirror)
- [S275] — Drawing a Forest in One Line: A Preview of Instancing in p5.strands
- [S278] — Issue #8911: p5.strands instancing API tracking
- [S294] — OSS Microgrants 2026: Dorine Tipo
