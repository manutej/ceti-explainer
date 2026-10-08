---
id: p5-videorecorder
title: "p5.videorecorder"
type: Library
aliases: []
sources: [S137, S156, S300, S310]
confidence: low
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# p5.videorecorder

## Definition

p5.videorecorder (Caleb Foss) is a real-time MediaRecorder canvas recorder that includes p5.sound output by default. [S310]

## Details

- It is listed under Export on the libraries page with no animation or export library marked v2-compatible. [S156][S300]
- Because MediaRecorder records in real time, it is only for quick takes and cannot be frame-exact. [S310]
- Maintenance 2026 and p5 2.x: not stated in the README. [S310]

## In explainer work

Use it for a quick narrated take with audio, then use [[frame-stepped-export]] with [[audio-post-mux]] for the final. [S310][S137]

## Relations

- integrates_with [[p5-sound]] — records p5.sound output by default [S310]
- alternative_to [[audio-post-mux]] — real-time capture with audio versus post muxing [S310][S137]
- related_to [[p5-capture]] — other listed recorder [S156]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S137] — Export Pipeline (p5js agent-skill reference) (third-party "hermes-agent" skill doc, hosted on a personal domain, undated)
- [S156] — p5.js Libraries page (Processing Foundation/p5.js, checked 2026-10-08)
- [S300] — p5.js Community Libraries directory (Processing Foundation, undated (accessed 2026-10-08))
- [S310] — p5.videorecorder README (Caleb Foss, undated)
