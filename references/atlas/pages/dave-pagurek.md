---
id: dave-pagurek
title: "Dave Pagurek"
type: Practitioner
aliases: ["davepagurek"]
sources: [S47, S48, S59, S61, S64, S116, S123, S131, S243, S256, S264, S275, S388]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---
# Dave Pagurek

## Definition
Dave Pagurek is the p5.js WebGL/WebGPU steward who led much of [[p5-strands]] and the experimental [[webgpu-renderer]], and who builds the butter.video motion-graphics tool [S47][S48][S59].

## Details
- He describes WebGPU mode as essentially a clone of WebGL mode at feature parity and says WebGPU is intended to become p5's main direction over the next few years [S48].
- His site lists p5.env (June 2026), a strands library for environment lighting, and p5.warp for vertex-shader domain warping [S59].
- He co-wrote the official tutorials on framebuffers, GLSL, optimizing WebGL sketches and general sketch optimization [S61][S64][S256][S243].
- He co-authored the 2.0 typography tutorial with Kit Kuksenok [S116].
- In the March 2026 export thread he recommended p5.record.js manual mode, an Electron wrapper writing PNGs and calling FFmpeg, or server-side rendering via Butter [S131].
- He answered 2.x performance reports on Discourse (set() speed, POINTS rendering) [S123][S264].
- Craig Kaplan used his Contact Shadow filter, deliberately underpowered, for a pencil look in Genuary 2024 [S388].

## In explainer work
- His Electron route renders 1920×1080 at pixelDensity(2), saves PNGs and encodes with libx264 crf 18 yuv420p — a reference recipe for [[electron-ffmpeg-export]] [S131].
- Butter (his tool) renders p5 sketches server-side, with 2K and no-60fps limits as of March 2026; see [[butter]] [S131].
- Strands + instancing, which he stewards, is the 2026 route to mass-element explainer scenes [S47][S275].

## Relations
- maintained_by [[webgpu-renderer]] — inverse: he leads WebGPU mode [S48]
- related_to [[p5-strands]] — led much of the work [S47]
- authored_by [[butter]] — inverse: builds butter.video [S59]
- demonstrates [[electron-ffmpeg-export]] — his client-work setup [S131]
- related_to [[performance-profiling]] — co-author of optimization tutorials [S243][S256]
- related_to [[community-export-pain]] — key responder in the 2026 thread [S131]
- related_to [[hub-people-community]] (structural)
## Sources
- [S47] — PF post on 2.1/2.2, strands and WebGPU
- [S48] — his WebGPU post
- [S59] — personal site
- [S61], [S64], [S256], [S243] — tutorials he co-wrote
- [S116] — typography tutorial
- [S131] — 2026 export thread
- [S123], [S264] — perf threads
- [S388] — Kaplan's Genuary 2024
- [S275] — instancing preview
