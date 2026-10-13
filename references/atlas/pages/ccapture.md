---
id: ccapture
title: "CCapture.js"
type: Library
aliases: ["TimeWarp", "p5.webm-capture", "enableCapture"]
sources: [S131, S132, S137, S138, S146, S240, S308]
confidence: low
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# CCapture.js

## Definition

CCapture.js is a virtual-clock canvas recorder (TimeWarp plus FrameWrap) that renders at machine speed while time advances one fixed step per captured frame. [S138]

## Details

- Its README now lists mp4 (H.264/AV1 via WebCodecs, default), webm (VP9/VP8/AV1 via WebCodecs), webm-legacy (Chromium-only), gif, and png/jpg/webp in tar. [S138]
- mp4 throws without WebCodecs and auto-adjusts odd canvas sizes to even; GIF is 256-colour via gifenc and plays back at roughly 50 fps when 60 is requested. [S138]
- TimeWarp hooks performance.now, requestAnimationFrame and timers always, and Date.now by default; hookDate alters getTime() for every Date object, breaking date arithmetic during capture. [S138][S137]
- It cannot step realtime Web Audio or CSS and Web Animations; renderAudioFrames() exists for audio-reactive visuals. [S138]
- For p5 the README says call noLoop(), drive redraw() from your own requestAnimationFrame tick while capturing, call capture(canvas) each tick, then loop() on stop. [S138]
- Derive durations from frameCount divided by framerate, never millis(), because slow renders distort elapsed wall time. [S308]
- p5.webm-capture is a Chrome-oriented per-frame WebM recorder built on ccapture.js 2.0.0 with WebCodecs, defaulting to 600 frames. [S240]
- Maintenance 2026: GitHub shows about 3.8k stars, 139 commits and no Releases; the README describes WebCodecs encoders, yet a March 2026 forum poster said it was unmaintained for 8 years and last worked with p5 0.9.0. p5 2.x compatibility is not stated anywhere. [S138][S131]
> **Conflict:** the current README describes WebCodecs mp4/webm and a p5 recipe [S138], while a March 2026 forum poster called it 8 years stale and p5 0.9.0-era [S131]; the last-commit date was never seen.

## In explainer work

CCapture is the route when an existing sketch already reads millis() or Date and you will not refactor it (see [[virtual-clock-capture]]); the cost is that audio cannot be stepped and it breaks audio sync because audio plays in real time. [S138][S137] A UAL web-editor template uses it with webm-writer, starting at frameCount 1 and stopping at a fixed count, and warns editor auto-refresh can crash a capture. [S132]

## Relations

- uses [[webcodecs]] — mp4 and webm encoders are WebCodecs-based in the current README [S138]
- enables [[virtual-clock-capture]] — TimeWarp is the canonical virtual clock [S138]
- alternative_to [[p5-capture]] — older virtual-clock recorder versus draw-hooked recorder [S146]
- conflicts_with [[audio-post-mux]] — cannot keep real-time audio in sync; audio must be muxed after [S137][S138]
- related_to [[frame-stepped-export]] — a virtual-clock way to get stepped frames [S138]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S131] — Best way to export an animation from a p5.js sketch in 2026 (Processing Discourse (poster slacle; replies by davepagurek), 2026 (per title))
- [S132] — How to export your p5.js as a video (UAL Creative Computing Institute Lab, undated)
- [S137] — Export Pipeline (p5js agent-skill reference) (third-party "hermes-agent" skill doc, hosted on a personal domain, undated)
- [S138] — CCapture.js README (spite (Jaume Sanchez), undated)
- [S146] — 'I wrote a new library for recording p5.js sketches' (tapioca24, 2022-03-27)
- [S240] — p5.webm-capture (GitHub repo README (abachman), undated)
- [S308] — 'How to save canvas animations with CCapture' (Ibby EL-Serafy, 2019-03-22)
