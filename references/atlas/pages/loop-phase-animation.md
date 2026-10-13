---
id: loop-phase-animation
title: "Loop-phase animation"
type: Technique
aliases: ["Cyclic time", "periodic phase loop", "loop phase", "Loop-phase plus easing", "loopsin (looping sine)", "looping sine", "Keith Peters", "BIT-101"]
sources: [S133, S135, S136, S141, S142, S186, S387]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# Loop-phase animation

## Definition
Loop-phase animation drives every motion from a 0 to 1 loop fraction, usually with easing, so each frame is a pure function of the phase [S387][S135].

## Details
- Coding Challenge 135 teaches loops via the core idea of a loop, paper sketching first, easing functions, `saveFrame()` export and a record variable; Golan Levin's loop templates are referenced [S387].
- `loopsin` maps `cos(t * 2 * PI)` from (1,-1) to (min,max) so a value starts and ends at min; sine would start mid-range [S135].
- Divide by total frames, not total minus one, to avoid a duplicated frame at the loop point [S135]. A TouchDesigner tutorial gives the same tip about not doubling the last frame [S136].
- Etienne Jacob's tutorial uses a periodic function plus an offset per element [S186].
- `p5.createLoop` exposes progress (0..1) and theta (0..TWO_PI); its README targets old p5 versions, so 2.x compatibility is unverified [S141].

## In explainer work
It is the motion backbone of a beat: tie every property to `t`, never `millis()`, and use whole cycles for seamless loops [S387][S142].

## Patterns
```js
const N = 120;                                  // frames per loop
function draw() {
  const t = (frameCount % N) / N;
  const e = t < .5 ? 4*t*t*t : 1 - pow(-2*t + 2, 3) / 2;   // easeInOutCubic
  background(250); circle(lerp(100, width - 100, e), height / 2, 40);
}
```
Pitfalls: motion tied to wall-clock time makes frame captures non-deterministic [S387].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- depends_on [[normalized-time]] — the loop fraction [S135]
- uses [[easing-functions]] — easing the phase [S387]
- enables [[grid-offset-loop]] — offset the phase by position [S186]
- related_to [[noise-loop]] — organic counterpart [S133]
- related_to [[p5-create-loop]] — library giving progress and theta [S141]
- related_to [[etienne-jacob]] — periodic function plus offset tutorial [S186]
- related_to [[golan-levin-loop-templates]] — referenced templates [S387]

## Sources
- [S133] — Challenge 137: 4D OpenSimplex Noise Loop
- [S135] — FOTD: loopsin
- [S136] — Looping Noise Part 1: Ending at the Beginning
- [S141] — p5.createLoop
- [S142] — Bees & Bombs cube wave challenge page
- [S186] — bleuje loop tutorial (periodic function + offset)
- [S387] — Coding Challenge #135 Making a GIF Loop
