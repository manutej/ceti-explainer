---
id: webgpu-renderer
title: "WebGPU renderer"
type: Capability
aliases: ["WEBGPU mode", "p5.webgpu.js", "p5.RendererWebGPU", "Opt-in WebGPU with WebGL fallback"]
sources: [S10, S47, S48, S56, S60, S62, S274, S275, S359]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# WebGPU renderer

## Definition
The WebGPU renderer (`WEBGPU` mode) is an experimental clone of WEBGL mode on WebGPU, shipped from p5.js 2.2 as the separate `p5.webgpu.js` add-on and requiring `await createCanvas(w, h, WEBGPU)` **[2.x]** **[beta]** [S48][S56][S47].

## Details
- Dave Pagurek began the work in June 2025; WebGPU mode is essentially a clone of WebGL mode with WebGPU implementations of existing functionality and will not replace it for a while [S48].
- Initial goal is parity with WebGL, not being faster than WebGL or 2D mode; 2D-optimised WebGPU is not a priority; no benchmarks are given and bugs and performance issues are expected [S56][S48].
- In WebGPU mode `loadPixels()` and `get()` must be awaited; draw commands are batched into one render pass per frame, flushed early on draw-target switches or GPU readback [S56].
- As of December 2025 WebGPU was on by default in Chrome and Windows Firefox and experimental elsewhere including Safari [S48].
- Strands shaders work in both WebGL and WebGPU modes; built-in filters such as POSTERIZE already use that approach [S48].
- 2.2 RC was announced around 1 January 2026; 2.3.0 added compute shaders; 2.3.1 added TRIANGLE_FAN in WebGPU [S48][S274][S62].
- The API is tagged beta in v2.3.4 source, and the `webgpu/` folder is new [S359][S10].
- Pagurek says it is intended to become p5's main direction over the next few years, while the official fallback API was still planned [S48].
- Instancing uses WebGPU where available and falls back to WebGL [S275].

## In explainer work
Use it opt-in for heavy GPU scenes (compute particle systems, cellular automata), with a try/catch fallback to WEBGL and both scripts pinned to the same version [S48][S274].

## Patterns
Opt-in with fallback (own sketch).
```js
async function setup() {
  try { await createCanvas(800, 450, WEBGPU); }
  catch (e) { await createCanvas(800, 450, WEBGL); }
}
```
Pitfalls: load `p5.webgpu.js` after core `p5.js` from the same version; Safari support was experimental as of December 2025 [S56][S48].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- alternative_to [[webgl-mode]] — parity-goal clone [S48]
- enables [[webgpu-compute]] — compute needs it [S60]
- depends_on [[p5-strands]] — shared shader language across renderers [S48]
- introduced_in [[release-2-2]] — first shipped there [S47]
- authored_by [[dave-pagurek]] — steward of the renderer [S48]
- related_to [[gpu-instancing]] — runs on either renderer [S275]

## Sources
- [S10] — p5.js GitHub releases page (v2.3.1 to v2.3.4)
- [S47] — p5.js 2.1 and 2.2: Expanding Graphics Avenues with p5.strands improvements and WebGPU
- [S48] — WebGPU in p5.js
- [S56] — Contribute: Using WebGPU mode
- [S60] — Reference buildComputeShader()
- [S62] — p5.js 2.3.1 release notes (mirror)
- [S274] — What's New in p5.js 2.3.0!
- [S275] — Drawing a Forest in One Line: A Preview of Instancing in p5.strands
- [S359] — p5.js source at tag v2.3.4 (`src/` folder; JSDoc @module/@submodule/@method/@beta/@deprecated tags parsed)
