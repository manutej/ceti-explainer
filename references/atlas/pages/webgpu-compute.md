---
id: webgpu-compute
title: "WebGPU compute shaders"
type: Capability
aliases: ["buildComputeShader", "compute shader", "p5.StorageBuffer", "createStorage"]
sources: [S47, S57, S60, S274, S275, S360]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# WebGPU compute shaders

## Definition
WebGPU compute shaders were added to the experimental WebGPU renderer in p5.js 2.3.0 (22 June 2026): `buildComputeShader` runs a callback as a parallel "for loop" over an index vector, with data held in storage buffers **[2.x]** **[beta]** [S274][S60].

## Details
- Data lives in storage created via `createStorage` and linked with `uniformStorage` [S60].
- `p5.StorageBuffer.read()` returns a Promise, copies GPU data to the CPU, and can be slow if called every frame [S57].
- `buildComputeShader` requires `p5.webgpu.js` and is marked experimental; reference Examples sections were empty [S60].
- 2.3.0 demonstrated it with Game of Life [S274]. In March 2026 compute shaders were described as in active development [S47].
- A `p5.StorageList` and strands matrices are on main and unreleased **[main / unreleased]** [S360].
- No performance numbers are published for compute [S60].

## In explainer work
Compute enables GPU particle systems, cellular automata and agent simulations beyond CPU budgets; readbacks must be limited [S57][S274].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- depends_on [[webgpu-renderer]] — requires the add-on [S60]
- part_of [[p5-strands]] — strands builder [S60]
- introduced_in [[release-2-3]] — 2.3.0 feature [S274]
- related_to [[gpu-instancing]] — both aim at mass-element scenes [S275]
- related_to [[perf-regressions-2x]] — readback cost caveat [S57]

## Sources
- [S47] — p5.js 2.1 and 2.2: Expanding Graphics Avenues with p5.strands improvements and WebGPU
- [S57] — Reference p5.StorageBuffer.read()
- [S60] — Reference buildComputeShader()
- [S274] — What's New in p5.js 2.3.0!
- [S275] — Drawing a Forest in One Line: A Preview of Instancing in p5.strands
- [S360] — p5.js source on `main` (commit aa192a2, 2026-10-07; post-2.3.4 work)
