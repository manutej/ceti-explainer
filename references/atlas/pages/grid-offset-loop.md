---
id: grid-offset-loop
title: "Grid offset loop"
type: Technique
aliases: ["Offset function", "phase offset", "delay field", "Bees and Bombs method"]
sources: [S142, S186, S188, S387]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# Grid offset loop

## Definition
A grid-offset loop repeats a simple element on a grid with timing that depends on grid position, the method popularised by Bees and Bombs [S188][S142].

## Details
- Coding Challenge 86 recreates a Bees and Bombs cube wave using oscillation, the WEBGL renderer and a position-based offset [S142].
- Dave Whyte typically sketches a design on paper before coding [S188]. Bees and Bombs uses Processing rather than p5 [S188].
- Etienne Jacob's loop tutorial describes the same periodic-function-plus-offset idea [S186].
- The offset multiplier sets the visual wavelength; use whole cycles of `t` so the loop is seamless [S142].

## In explainer work
Produces wave, ripple and propagation visuals, for example signals or wavefronts spreading from a source [S142] (inference).

## Patterns
```js
for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
  const d = dist(i, j, cols / 2, rows / 2);
  const h = map(sin(TWO_PI * t - d * 0.4), -1, 1, 10, 80);
  drawBox(i, j, h);
}
```
Pitfalls: a non-integer number of cycles leaves a seam at the loop point [S142].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- depends_on [[loop-phase-animation]] — offsets the shared phase [S387]
- uses [[oscillation]] — sine of phase minus offset [S142]
- demonstrates [[coding-challenges]] — challenge 86 episode [S142]
- authored_by [[dave-whyte]] — popularised the method [S188]
- related_to [[etienne-jacob]] — equivalent tutorial [S186]

## Sources
- [S142] — Bees & Bombs cube wave challenge page
- [S186] — bleuje loop tutorial (periodic function + offset)
- [S188] — Bees and Bombs (AMS blog on math blogs)
- [S387] — Coding Challenge #135 Making a GIF Loop
