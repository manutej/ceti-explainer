---
id: webcodecs
title: "WebCodecs"
type: Platform
aliases: ["VideoEncoder", "WebCodecs in-page encode"]
sources: [S138, S147, S148, S155]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# WebCodecs

## Definition

WebCodecs is the browser API (VideoEncoder) that lets CCapture's mp4/webm modes, and per a search listing canvas-record, encode frames without ffmpeg. [S138][S155]

## Details

- CCapture's mp4 mode (H.264/AV1) and webm mode (VP9/VP8/AV1) use WebCodecs and throw without it. [S138]
- Mediabunny's CanvasSource encodes a canvas through WebCodecs and supersedes the deprecated mp4-muxer. [S147][S148]
- Not verified: browser codec support, H.264 level limits and 4K60 encode throughput in browsers. [S148]
- A search listing, not opened, shows canvas-record 5.5.1 with a WebCodecsEncoder. [S155]

## In explainer work

WebCodecs makes ffmpeg-free in-browser export possible for [[frame-stepped-export]], at the price of browser-support checks. [S138][S148]

## Relations

- enables [[mediabunny]] — Mediabunny encodes through it [S148]
- enables [[ccapture]] — CCapture mp4/webm modes require it [S138]
- related_to [[frame-stepped-export]] — an in-browser sink [S148]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S138] — CCapture.js README (spite (Jaume Sanchez), undated)
- [S147] — Vanilagy/mp4-muxer README (Vanilagy, undated)
- [S148] — Mediabunny CanvasSource API (Mediabunny docs, undated)
- [S155] — Search listing only (not opened): canvas-record WebCodecsEncoder, Mediabunny quick-start/writing-media-files, p5.save-frames on npm, abachman/p5.webm-capture, p5.createLoop on npm (URLs in search results of 2026-10-08, kind: community (unverified))
