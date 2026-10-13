---
id: immediate-mode
title: "Immediate-mode drawing"
type: Concept
aliases: ["redraw every frame"]
sources: [S8, S15, S28, S127, S259]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# Immediate-mode drawing

## Definition
Immediate mode means nothing persists on screen unless it is drawn again each frame; the picture is re-derived from state on every call to [[draw]]. No p5 primary source uses the phrase, so the model is inferred from per-frame redraw and per-frame transform reset [S8][S259].

## Details
- The main canvas resets its transformations automatically at the start of each `draw()` call, while `p5.Graphics` buffers need a manual `reset()` [S259].
- Transforms are cumulative within a frame but reset between frames [S28].
- `draw()` targets 60 calls per second and the actual rate varies, so state accumulated per call depends on frame rate [S8].
- A partial exception is retained geometry: WEBGL `buildGeometry` stores a mesh once for reuse (noted by the branch author as an inference) [S8][S259].
- Because style and transform state leak between calls, immediate-mode sketches rely on [[drawing-state]] discipline with [[push-pop]] [S15].

## In explainer work
Treating a frame as a pure function of time (`renderAt(t)`) is the expert reading of immediate mode: scrubbing, replay and frame-by-frame export fall out for free, whereas mutating state per frame (`x += 1`) breaks them (inference) [S8][S127]. Static layers that are expensive to redraw can be cached in a [[p5-graphics]] buffer [S259].

## Relations
- part_of [[hub-language-core]] (structural)
- depends_on [[draw]] — the loop that re-derives the frame [S8]
- related_to [[drawing-state]] — the state redrawn calls consume [S15]
- enables [[pure-function-of-t]] — frame as function of a clock [S127]
- related_to [[loop-control]] — noLoop and redraw gate when frames are produced [S8]
- related_to [[p5-graphics]] — buffers cache layers between frames [S259]

## Sources
- [S8] — draw() reference
- [S15] — push() reference
- [S28] — translate() reference
- [S127] — deltaTime
- [S259] — p5.Graphics reference
