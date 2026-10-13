---
id: flow-field
title: "Flow field"
type: Technique
aliases: ["vector field", "angle grid", "Flow-field tracer"]
sources: [S84, S88, S365, S366]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# Flow field

## Definition
A flow field is a grid of angles or vectors that curves or agents follow step by step; in p5 it is typically built from noise mapped to angles [S84][S366].

## Details
- Nature of Code builds a 2D array grid with a resolution; agents look up their cell by dividing position by resolution, constrained to the grid [S84].
- Coding Challenge 24 builds a Perlin flow field, particles with previous-position lines, and animates it with a z offset (`zoff`) on 3D noise [S88].
- Noise values cluster mid-range, so map them to a wider angle range such as 0 to 4*PI to avoid directional bias [S84].
- Tyler Hobbs recommends a grid margin of about 50 percent beyond the canvas, a resolution of about 0.5 percent of image width, and step length of about 0.1 to 0.5 percent of width; he samples noise at about 0.005 per grid step mapped onto 0 to 2*PI [S366].
- Short curves give a furry texture, long curves form fluid leading lines; quantising angles to multiples of pi/10 gives rocky forms; start-point strategy (grid, uniform random, circle packing) matters most for short curves [S366].
- Hobbs warns against stopping at plain Perlin noise, since it looks generic [S366]. Fidenza's flow field has been in use since 2016 [S365].

## In explainer work
Fields visualise wind, gradients, attention flow or data streams (inference); animating `zoff` from `t` keeps the field a function of time [S366][S88].

## Patterns
Field tracer (own sketch; proportions per Hobbs).
```js
function trace(x, y, steps, stepLen) {
  beginShape();
  for (let i = 0; i < steps; i++) {
    vertex(x, y);
    const a = noise(x * 0.002, y * 0.002) * TWO_PI;
    x += cos(a) * stepLen; y += sin(a) * stepLen;
  }
  endShape();
}
```
Pitfalls: without a spacing check curves clump; add collision rejection for Fidenza-like clarity [S366][S365].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- uses [[noise]] — angles from noise [S88]
- enables [[collision-curve-packing]] — curves traced through the field are packed with spacing checks [S366]
- related_to [[steering-behaviors]] — agents follow the field [S84]
- demonstrates [[coding-challenge-24]] — the video build of it [S88]
- related_to [[fidenza]] — flagship use of a flow field [S365]
- related_to [[tyler-hobbs]] — craft essay author [S366]

## Sources
- [S84] — The Nature of Code, Autonomous Agents chapter
- [S88] — Coding Challenge 24: Perlin Noise Flow Field
- [S365] — Fidenza
- [S366] — Flow Fields
