---
id: canvas-capture
title: "canvas-capture"
type: Library
aliases: ["amandaghassaei/canvas-capture"]
sources: [S138, S145, S152]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# canvas-capture

## Definition

canvas-capture (amandaghassaei/canvas-capture) is a generic canvas recorder that outputs MP4, GIF, PNG or JPEG sequences and is not p5-specific. [S152]

## Details

- MP4 is recorded as WebM and then converted with ffmpeg.wasm, not WebCodecs, which requires SharedArrayBuffer cross-origin isolation headers. [S152]
- ffmpeg-core loads from unpkg by default, so MP4 export needs internet unless you self-host it. [S152]
- GIF output uses CCapture.js; video and GIF cannot be recorded at the same time; alpha 0 renders black in JPEG and GIF. [S152]
- It vendors a CCapture.js fork (npm-fix branch) and the repo shows 287 commits with no GitHub Releases; the README footer shows 2026. [S152]
- Maintenance 2026: repo active enough to show a 2026 footer but no releases; p5 2.x compatibility is not stated. [S152]

## In explainer work

Useful when you want one recorder for p5 plus other canvas libraries, but its ffmpeg.wasm path adds header requirements that complicate hosting. [S152] For p5-specific work compare [[p5-capture]] and [[ccapture]]. [S145][S138]

## Relations

- depends_on [[ccapture]] — GIF export goes through a vendored CCapture fork [S152]
- depends_on [[ffmpeg]] — MP4 conversion uses ffmpeg.wasm [S152]
- alternative_to [[p5-capture]] — generic recorder versus p5-hooked recorder [S145][S152]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S138] — CCapture.js README (spite (Jaume Sanchez), undated)
- [S145] — tapioca24/p5.capture README (tapioca24, undated)
- [S152] — amandaghassaei/canvas-capture README (Amanda Ghassaei, undated (footer 2026))
