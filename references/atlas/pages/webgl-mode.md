---
id: webgl-mode
title: "WEBGL mode"
type: Capability
aliases: ["WEBGL", "WebGL renderer", "p5.RendererGL", "3D mode", "3D renderer"]
sources: [S13, S14, S48, S53, S54, S56, S58, S61, S62, S64, S258, S349, S357, S358]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# WEBGL mode

## Definition
WEBGL mode is p5's GPU-backed 3D renderer, enabled with `createCanvas(w, h, WEBGL)`; it is required for custom 3D shaders and has a centred origin with z pointing toward the viewer [S58][S349].

## Details
- It uses a WebGL2 context when supported, and `setAttributes({version: 1})` forces WebGL1 [S13][S14]; the setAttributes reference gives the default version as 2 with fallback to 1 [S258].
- The official GLSL tutorial describes shaders in GLSL ES 1.00 style (`attribute`, `varying`, `gl_FragColor`, `texture2D`); whether GLSL ES 3.00 is accepted was not verified, though 2.3.1 notes mention a "shader version regex" fix [S64][S62].
- Only filter shaders work in 2D mode; all shaders work in WEBGL [S58].
- Depth of field is not built in; the framebuffer tutorial shows a focal blur from colour and depth buffers but treats the blur shader as out of scope [S61].
- Release 2.3.1 documented that stroke weight is not scaled in WebGL/WebGPU [S62].
- The 2.x reference gives WEBGL mode far more surface: the 3D module grew from 40 to 86 global entries, mostly strands [S357][S358].
- `p5.RendererGL` and `p5.RendererWebGPU` extend a shared 3D renderer base [S56].

## In explainer work
WEBGL remains the safe target for production explainers because WebGPU is experimental [S48]. Layer a 3D diagram into a framebuffer and composite it over 2D annotations [S53][S61].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- part_of [[module-3d]] — 3D module [S357]
- alternative_to [[webgpu-renderer]] — experimental clone on WebGPU [S48]
- enables [[p5-shader]] — custom shaders need it [S58]
- uses [[p5-camera]] — default perspective camera [S54]
- enables [[p5-framebuffer]] — framebuffers are WEBGL-only [S357]

## Sources
- [S13] — createGraphics() reference
- [S14] — createCanvas() reference
- [S48] — WebGPU in p5.js
- [S53] — Reference p5.Framebuffer
- [S54] — Reference p5.Camera
- [S56] — Contribute: Using WebGPU mode
- [S58] — Reference createShader()
- [S61] — Layered Rendering with Framebuffers
- [S62] — p5.js 2.3.1 release notes (mirror)
- [S64] — Introduction to GLSL (tutorial)
- [S258] — setAttributes() reference
- [S349] — Coordinates and Transformations (tutorial)
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
- [S358] — p5.js-website repo, `v1` branch reference (1.x reference; parsed 905 entries)
