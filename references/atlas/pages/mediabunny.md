---
id: mediabunny
title: "Mediabunny"
type: Library
aliases: ["mediabunny.dev", "CanvasSource", "mp4-muxer"]
sources: [S131, S147, S148, S338]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# Mediabunny

## Definition

Mediabunny is a JavaScript media toolkit that supersedes the deprecated mp4-muxer and includes CanvasSource for encoding a canvas straight to video with WebCodecs. [S147][S148]

## Details

- The mp4-muxer repo is marked deprecated in favour of Mediabunny, with no further features or fixes and a roughly 10-minute migration guide linked. [S147]
- CanvasSource accepts an HTMLCanvasElement or OffscreenCanvas plus a VideoEncodingConfig; add(timestamp, duration) takes seconds, encodes the current canvas state and returns a Promise to respect backpressure. [S148]
- The sources did not verify Mediabunny's audio-source API, 4K60 encode throughput or H.264 level limits. [S148]
- Maintenance 2026: documented as the live successor to a deprecated tool; p5 2.x is irrelevant because it consumes a plain canvas, but no p5 recipe was found. [S147][S148]

## In explainer work

After each awaited redraw(), call await source.add(frameIndex / fps, 1 / fps) to get MP4 without ffmpeg; it needs a WebCodecs-capable browser. [S148][S338] This is the in-page alternative to the out-of-browser [[png-sequence-ffmpeg]] route. [S131]

## Relations

- depends_on [[webcodecs]] — encodes frames through WebCodecs [S148]
- enables [[frame-stepped-export]] — backpressure-aware per-frame encode [S148]
- alternative_to [[png-sequence-ffmpeg]] — in-browser encode versus PNG files plus ffmpeg [S147][S148]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S131] — Best way to export an animation from a p5.js sketch in 2026 (Processing Discourse (poster slacle; replies by davepagurek), 2026 (per title))
- [S147] — Vanilagy/mp4-muxer README (Vanilagy, undated)
- [S148] — Mediabunny CanvasSource API (Mediabunny docs, undated)
- [S338] — `redraw()` reference (p5.js, undated)
