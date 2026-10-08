---
id: real-time-vs-frame-based
title: "Real-time vs frame-based animation"
type: Concept
aliases: ["wall-clock animation", "Frame-based animation", "time-based animation", "Time vs frame-based choice"]
sources: [S18, S127, S129, S130, S137, S139]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# Real-time vs frame-based animation

## Definition
Real-time (wall-clock) animation computes motion from elapsed time via `millis()` or `deltaTime`, so speed is device independent but output is not reproducible; frame-based animation computes it from `frameCount` or an index, so a slower machine plays slower but every frame is reproducible [S127][S130][S129].

## Details
- Interactive or live explainers suit real-time timing; exportable explainers should derive `t` from a frame index or an injected clock [S127][S137].
- Hybrid: one `clock` returns `t`; in live mode `t = (millis() - start) / duration % 1`, in export mode `t = i / N`, and the same frame function renders either way (inference mirroring canvas-sketch time versus playhead) [S139].
- The pages for `frameRate`, `deltaTime` and `frameCount` document no 2.x differences in v2.3.3 [S127][S18][S129].
- Variable frame rate behaviour in background tabs or on 120 or 144 Hz displays was not documented from a primary source [S18].

## In explainer work
Decide per deliverable: live widget (real-time), recorded clip (frame-based), or both through the hybrid clock [S137][S139].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- related_to [[delta-time]] — real-time side [S127]
- related_to [[frame-count]] — frame-based side [S129]
- related_to [[millis]] — real-time side [S130]
- related_to [[pure-function-of-t]] — the frame-based ideal [S139]
- related_to [[explainer-clock]] — the hybrid clock in the engine blueprint [S139]

## Sources
- [S18] — frameRate() reference
- [S127] — deltaTime
- [S129] — frameCount
- [S130] — millis()
- [S137] — Export Pipeline (p5js agent-skill reference)
- [S139] — canvas-sketch: Animated Sketches
