---
id: matt-deslauriers
title: "Matt DesLauriers"
type: Practitioner
aliases: ["mattdesl"]
sources: [S139, S140]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---
# Matt DesLauriers

## Definition
Matt DesLauriers (mattdesl) is the author of [[canvas-sketch]], a sketch framework that exposes time, playhead, frame and duration and exports frame sequences — the one hybrid with a first-party p5 example [S139][S140].

## Details
- canvas-sketch exposes `time` (seconds), `playhead` (0..1, only with a fixed duration) and `frame`, with fps defaulting to 30 [S139].
- Its export docs cover frame-sequence export and streaming to MP4/GIF via FFmpeg through canvas-sketch-cli [S140].
- The docs do not explain how determinism is achieved, and his loop essays were not retrieved by the research [S139].

## In explainer work
- canvas-sketch's playhead is the clearest published model of a [[normalized-time]] clock: draw as a function of 0..1, let the framework own the loop and export [S139].
- It is an alternative export route to in-browser recorders like [[p5-capture]] [S140].

## Relations
- authored_by [[canvas-sketch]] — inverse: author [S139]
- related_to [[normalized-time]] — playhead model [S139]
- related_to [[ffmpeg]] — CLI streams to FFmpeg [S140]
- related_to [[hub-people-community]] (structural)
## Sources
- [S139] — canvas-sketch animated-sketches docs
- [S140] — canvas-sketch exporting-artwork docs
