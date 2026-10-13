---
id: draw
title: "draw()"
type: Construct
aliases: ["draw loop", "draw function"]
sources: [S1, S8, S9, S10, S18, S28, S29, S117, S127, S259, S357]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# draw()

## Definition
`draw()` is the function called repeatedly after [[setup]], targeting 60 runs per second by default; `frameCount` stores how many times it has run [S8]. The concept of the loop is unchanged in 2.x [S1].

## Details
- `noLoop()` stops the loop, `loop()` resumes it and `isLooping()` reports its state [S8][S29].
- `redraw([n])` runs `draw()` n times (default 1) and returns a Promise that should be awaited **[2.x]** [S9].
- Transformations reset at the start of each iteration and are cumulative within a frame; the default origin is top-left in 2D and center in WebGL [S28].
- The actual frame rate varies; `frameRate()` sets only a target [S18][S8].
- Add-ons can hook `predraw` and `postdraw` ([[lifecycle-hooks]]) [S117].
- Performance note: v2.3.2 sped up `beginShape`/`endShape` paths with many vertex calls [S10].

## In explainer work
Keep `draw()` a thin wrapper that calls a pure `renderAt(t)`; step it with `noLoop()` plus `redraw()` for deterministic export [S8][S9]. Derive `t` from `frameCount` or an owned clock, not from `frameRate` or wall-clock time [S18][S357].

## Patterns
**Deterministic frame clock.** When: reproducible explainer frames. Pitfall: frameRate is only a target [S18].
```js
function draw() {
  const t = (frameCount % 240) / 240;
  background(255);
  circle(lerp(50, 350, t), 200, 40);
}
```

## Relations
- part_of [[module-structure]] — Structure group function [S1]
- part_of [[hub-language-core]] (structural)
- depends_on [[setup]] — loop starts after setup [S8]
- related_to [[frame-count]] — counter of draw calls [S8]
- related_to [[loop-control]] — loop/noLoop/redraw gate execution [S29]
- related_to [[immediate-mode]] — redraw-per-frame model [S259]
- enables [[pure-function-of-t]] — thin wrapper over renderAt(t) [S127]

## Sources
- [S1] — Reference index (v2)
- [S8] — draw() reference
- [S9] — redraw() reference
- [S10] — p5.js GitHub releases page (v2.3.1 to v2.3.4)
- [S18] — frameRate() reference
- [S28] — translate() reference
- [S29] — noLoop() reference
- [S117] — Designing an addon library system for p5.js 2.0
- [S127] — deltaTime
- [S259] — p5.Graphics reference
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
