---
id: delta-time
title: "deltaTime"
type: Construct
aliases: []
sources: [S18, S49, S86, S127, S130, S137, S138, S139]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# deltaTime

## Definition
`deltaTime` holds the milliseconds the previous frame took to draw, intended for physics-style real-time motion [S127].

## Details
- It observes the running sketch rather than controlling it, so any scene that reads it is not reproducible between runs or machines [S127].
- The v2.3.3 reference lists no 2.x-specific behaviour **[2.x]** [S127].
- Inside p5.strands callbacks, standard variables including `deltaTime` can be used **[2.x]** [S49].
- Integrating physics with a variable step breaks determinism, so scrubbable or exported scenes should use a fixed step instead (inference) [S86][S138].

## In explainer work
Use `deltaTime` for live, interactive explainers where speed must be device independent; for exportable clips derive time from the frame index or an injected clock [S127][S137]. A hybrid `clock` object can return live time in one mode and `i/N` in export mode (inference) [S139].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- related_to [[millis]] — both read real elapsed time [S127][S130]
- alternative_to [[frame-rate]] — measurement versus target [S127][S18]
- conflicts_with [[fixed-timestep]] — variable step versus constant step per output frame [S138]
- related_to [[real-time-vs-frame-based]] — the real-time half of that choice [S127]

## Sources
- [S18] — frameRate() reference
- [S49] — p5.strands: Introduction to Shaders (tutorial)
- [S86] — The Nature of Code, Forces chapter
- [S127] — deltaTime
- [S130] — millis()
- [S137] — Export Pipeline (p5js agent-skill reference)
- [S138] — CCapture.js README
- [S139] — canvas-sketch: Animated Sketches
