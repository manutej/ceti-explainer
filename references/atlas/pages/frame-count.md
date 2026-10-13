---
id: frame-count
title: "frameCount"
type: Construct
aliases: ["frame counter"]
sources: [S85, S127, S129, S131, S135, S137]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# frameCount

## Definition
`frameCount` is the counter of how many times `draw()` has run since the sketch started; it is 0 during `setup()` and increases by one after each `draw()` finishes [S129].

## Details
- Because it only counts draws, it measures frames rather than time: a slower machine plays the same animation slower, but each frame index still produces the same image if the scene is a pure function of it [S129][S137].
- The reference does not state whether `frameCount` is writable, yet a community Electron export sample assigns `frameCount = i` before calling `redraw()` [S129][S131]. Treat assignment as undocumented and prefer passing the index into your own frame function (inference).
- The first `draw()` call sees either 0 or 1 depending on where it is read; the reference only pins the value in `setup()`, so verify the off-by-one before relying on it [S129].
- Nature of Code uses it as the time base in the oscillation formula `amplitude * sin(TWO_PI * frameCount / period)` [S85].
- Under `noLoop()` the counter advances once per `redraw()`, which is what makes stepped capture reproducible [S137].

## In explainer work
Use `frameCount` (or an index you control) as the source of the playhead for exportable clips, never `millis()` [S137]. Divide by the total frame count, not total minus one, to avoid a duplicated frame at a loop point [S135].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- enables [[normalized-time]] — frame index divided by total frames gives the playhead [S135]
- related_to [[real-time-vs-frame-based]] — it is the basis of the frame-based style [S129]
- related_to [[redraw]] — stepping with `redraw()` advances it once per call [S137]
- related_to [[oscillation]] — Nature of Code's period-based sine uses it [S85]
- related_to [[delta-time]] — the wall-clock counterpart that breaks reproducibility [S127]

## Sources
- [S85] — The Nature of Code, Oscillation chapter
- [S127] — deltaTime
- [S129] — frameCount
- [S131] — Best way to export an animation from a p5.js sketch in 2026
- [S135] — FOTD: loopsin
- [S137] — Export Pipeline (p5js agent-skill reference)
