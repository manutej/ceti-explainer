---
id: oscillation
title: "Oscillation and harmonic motion"
type: Concept
aliases: ["Simple harmonic motion", "SHM", "Angular motion", "Pendulum", "Hooke's law spring", "Sinusoidal oscillation"]
sources: [S67, S70, S85, S135, S142]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# Oscillation and harmonic motion

## Definition
Oscillation in p5 is sinusoidal motion built from `sin` of an angle or of frame count over a period, following Nature of Code: `x = amplitude * sin(TWO_PI * frameCount / period)` [S85].

## Details
- With an angle accumulator, `period = TWO_PI / angular velocity`; waves come from offsetting phase across many oscillating circles [S85].
- Angular motion updates angle, angular velocity and angular acceleration like linear motion [S85].
- Springs follow Hooke's law, force proportional to extension and opposing it; the pendulum uses gravity times `sin(theta)` and ignores energy conservation [S85].
- `p5.Vector.fromAngle` converts polar to Cartesian for orbit placement [S85][S67].
- Radians are default; under `angleMode(DEGREES)` use 360 instead of `TWO_PI` [S70].

## In explainer work
Use time from your clock rather than `frameCount` if the frame rate may vary, and use whole cycles of `t` so loops are seamless [S70][S142].

## Patterns
```js
const y = amp * sin(TWO_PI * t / period + phase);   // SHM from a clock value
```
Pitfalls: accumulating an angle each frame does not scrub; compute it from `t` (inference) [S85].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- depends_on [[math-trigonometry]] — sin and cos [S85]
- related_to [[grid-offset-loop]] — phase offsets by position make waves [S142]
- related_to [[frame-count]] — period formula uses it [S85]
- related_to [[p5-vector]] — polar placement [S67]
- enables [[loop-phase-animation]] — `cos(t*TWO_PI)` loop [S135]

## Sources
- [S67] — p5.Vector reference
- [S70] — angleMode() reference (v2.3.1)
- [S85] — The Nature of Code, Oscillation chapter
- [S135] — FOTD: loopsin
- [S142] — Bees & Bombs cube wave challenge page
