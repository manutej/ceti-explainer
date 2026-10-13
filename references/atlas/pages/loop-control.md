---
id: loop-control
title: "noLoop(), loop(), isLooping()"
type: Construct
aliases: ["noLoop()", "loop()", "isLooping()"]
sources: [S9, S100, S137, S138, S367]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# noLoop(), loop(), isLooping()

## Definition
`noLoop()` halts the automatic `draw()` cycle, `loop()` resumes it, and `isLooping()` reports whether it is running [S9].

## Details
- Calling `noLoop()` in `setup()` and driving frames manually with `redraw()` is the basis of deterministic stepped capture [S9][S137].
- Static sketches should use `noLoop()`; input-driven sketches use `noLoop()` plus `redraw()` inside input callbacks (forum advice) [S100].
- With `noLoop()` `frameCount` advances once per `redraw()` [S137].
- CCapture.js documentation says p5 owns its loop, so with p5 you call `noLoop()` and drive `redraw()` from your own `requestAnimationFrame` tick while capturing [S138].
- The Art Blocks style single-pass still also uses `noLoop()` after one render [S367].

## In explainer work
Use `noLoop()` to take control of the clock for export, and to pause offscreen figures on a scrolling page [S138][S100].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- enables [[redraw]] — stepping needs the automatic loop stopped [S9]
- enables [[fixed-timestep]] — manual stepping makes constant steps possible [S138]
- related_to [[event-driven-redraw]] — the interaction pattern built from it [S100]
- related_to [[virtual-clock-capture]] — required when capturing p5 with CCapture [S138]

## Sources
- [S9] — redraw() reference
- [S100] — Discourse: pause/noLoop sketch when not visible
- [S137] — Export Pipeline (p5js agent-skill reference)
- [S138] — CCapture.js README
- [S367] — Code Review: Fidenza by Tyler Hobbs
