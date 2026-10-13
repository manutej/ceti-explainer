---
id: frame-rate
title: "frameRate()"
type: Construct
aliases: ["fps", "setFrameRate"]
sources: [S18, S127, S129, S131, S137, S255, S256]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# frameRate()

## Definition
`frameRate(fps)` sets a target number of `draw()` calls per second, and with no argument returns an approximation of the current rate [S18].

## Details
- The reference warns the target may not be achieved, depending on how much the sketch has to process; it is a request, not a control [S18].
- Most computers default to 60 FPS, and the reference says 24 FPS or higher is generally smooth enough [S18].
- The performance wiki aims for a steady 30 to 60 FPS and suggests reading `frameRate()` with no arguments to check it; the tutorial suggests a moving average over 30 samples for a stable reading [S255][S256].
- The reference pages (v2.3.3) document no 2.x-specific behaviour, though absence on a page is not proof nothing changed [S18].
- Variable frame rate from a free-running loop is a main recording pitfall; do not use the live rate as the clock for export [S137].

## In explainer work
For recorded video, choose the output fps in the export script and derive each frame's time from the frame index, so the live rate never matters [S131]. Reading `frameRate()` is useful only as a profiling readout [S255].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- alternative_to [[delta-time]] — a target rate versus a measurement of the last frame [S18][S127]
- related_to [[performance-profiling]] — used as an FPS readout when profiling [S255]
- related_to [[fixed-timestep]] — export fixes the step regardless of live rate [S131]
- related_to [[frame-count]] — frame index is the reproducible alternative to wall time [S129]

## Sources
- [S18] — frameRate() reference
- [S127] — deltaTime
- [S129] — frameCount
- [S131] — Best way to export an animation from a p5.js sketch in 2026
- [S137] — Export Pipeline (p5js agent-skill reference)
- [S255] — Optimizing p5.js Code for Performance (wiki)
- [S256] — Optimizing WebGL Sketches (tutorial)
