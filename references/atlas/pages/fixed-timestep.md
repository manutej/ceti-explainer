---
id: fixed-timestep
title: "Fixed-timestep rendering"
type: Concept
aliases: ["offline rendering"]
sources: [S86, S127, S131, S137, S138, S273]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# Fixed-timestep rendering

## Definition
Fixed-timestep rendering advances the animation by a constant step per output frame regardless of how long each frame takes to draw [S138][S131].

## Details
- CCapture.js implements it by advancing a virtual clock one fixed step per captured frame, so output is smooth regardless of draw time [S138].
- Offline rendering lets each frame take as long as it needs, which suits slow machines and high resolutions [S131].
- Processing practice: use frame-based animation so dropped frames in export do not distort timing [S273].
- A free-running loop during screenshotting causes duplicate or missing frames when screenshots are slow [S137].
- CCapture.js cannot step the Web Animations API, CSS animations or a realtime Web Audio context [S138].

## In explainer work
For final video, step the clock by `1/fps` per saved frame and treat live playback speed as irrelevant [S131][S138]. Integrating physics with a variable `dt` breaks determinism, so use a fixed step when scrubbing (inference) [S86].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- enables [[hi-res-render]] — slow frames are acceptable offline [S131]
- enables [[frame-stepped-export]] — the concept behind stepped capture [S131]
- related_to [[virtual-clock-capture]] — the library-based realisation [S138]
- alternative_to [[real-time-vs-frame-based]] — constant step versus wall-clock step [S127]
- conflicts_with [[delta-time]] — variable step is what it replaces [S138]

## Sources
- [S86] — The Nature of Code, Forces chapter
- [S127] — deltaTime
- [S131] — Best way to export an animation from a p5.js sketch in 2026
- [S137] — Export Pipeline (p5js agent-skill reference)
- [S138] — CCapture.js README
- [S273] — Exporting video in Processing
