---
id: ffmpeg
title: "FFmpeg"
type: Tool
aliases: []
sources: [S131, S137, S140, S152, S273, S315]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# FFmpeg

## Definition

ffmpeg is the command-line encoder used in nearly every p5 export pipeline for PNG-sequence assembly, audio muxing, palette GIFs and concatenation. [S137][S131]

## Details

- Recipes: PNG sequence to H.264 (crf 18, preset slow, yuv420p), audio mux with -c:a aac -shortest, two-pass palette GIF, and the concat demuxer with -c copy. [S137]
- canvas-sketch streams frames straight into ffmpeg for MP4 (or GIF with --stream=gif) via its CLI, needing ffmpeg installed. [S140]
- Motion Canvas treats ffmpeg as an external step after rendering an image sequence. [S315]
- Browser-hosted variant: canvas-capture converts WebM to MP4 with ffmpeg.wasm, which needs cross-origin isolation headers. [S152]
- Brendan Dawes documents the same frames-then-ffmpeg approach for Processing. [S273]

## In explainer work

Treat ffmpeg as the last mile, not the renderer: scenes stay deterministic ([[frame-stepped-export]]) and ffmpeg mixes audio ([[audio-post-mux]]). [S137]

## Relations

- enables [[png-sequence-ffmpeg]] — is the encoder of the technique [S137]
- enables [[audio-post-mux]] — performs the muxing [S137]
- related_to [[canvas-sketch]] — streams frames to it with --stream [S140]
- related_to [[canvas-capture]] — uses an ffmpeg.wasm build [S152]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S131] — Best way to export an animation from a p5.js sketch in 2026 (Processing Discourse (poster slacle; replies by davepagurek), 2026 (per title))
- [S137] — Export Pipeline (p5js agent-skill reference) (third-party "hermes-agent" skill doc, hosted on a personal domain, undated)
- [S140] — canvas-sketch: Exporting Artwork (Matt DesLauriers, undated)
- [S152] — amandaghassaei/canvas-capture README (Amanda Ghassaei, undated (footer 2026))
- [S273] — Exporting video in Processing (Brendan Dawes, undated)
- [S315] — Motion Canvas Rendering (Motion Canvas, undated)
