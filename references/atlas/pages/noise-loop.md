---
id: noise-loop
title: "Seamless noise loop"
type: Technique
aliases: ["Noise-circle loop", "looping noise", "4D noise loop", "Simon Alexander-Adams", "Polyhop"]
sources: [S65, S133, S135, S136, S141]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# Seamless noise loop

## Definition
A seamless noise loop moves along a circle through extra noise dimensions so the sampled noise returns to its start after one period [S133][S141].

## Details
- The Coding Train challenge 137 loops noise by moving through polar coordinates in one plane of higher-dimensional OpenSimplex noise (Processing/Java) [S133].
- `p5.createLoop` samples noise on a circle whose radius acts like frequency, returns -1..1 rather than core p5's 0..1, and defaults to a 3 second duration at 30 fps [S141].
- Core `noise()` is documented for 1D, 2D and 3D only, so a true 4D circle needs a library or a 3D approximation [S65].
- Simon Alexander-Adams's TouchDesigner tutorial recreates a looping Etienne Jacob sketch the same way [S136].
- No p5.js-specific periodic-noise write-up from primary sources was found [S133].

## In explainer work
Use for organic motion in a GIF or video loop, such as breathing or wobble, when a hard loop point would be visible [S141].

## Patterns
```js
function loopNoise(x, t, radius = 1) {
  const a = t * TWO_PI;
  return noise(x, radius * cos(a) + 10, radius * sin(a) + 10);   // 3D approximation
}
```
Pitfalls: radius sets how fast the field changes; the spatial input is limited to one axis here [S141][S65].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- uses [[noise]] — circle sampling [S65]
- depends_on [[normalized-time]] — the angle is `t * TWO_PI` [S135]
- related_to [[loop-phase-animation]] — periodic counterpart [S135]
- related_to [[p5-create-loop]] — library implementation [S141]
- related_to [[touchdesigner]] — tutorial recreation [S136]
- related_to [[daniel-shiffman]] — challenge presenter [S133]

## Sources
- [S65] — noise() reference (p5.js 2.3.3)
- [S133] — Challenge 137: 4D OpenSimplex Noise Loop
- [S135] — FOTD: loopsin
- [S136] — Looping Noise Part 1: Ending at the Beginning
- [S141] — p5.createLoop
