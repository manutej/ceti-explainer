---
id: random-walk
title: "Random walk"
type: Technique
aliases: ["Walker", "Levy flight", "Accept-reject sampling"]
sources: [S72, S77, S83]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# Random walk

## Definition
A random walk is a path built from random steps; it is the basic pattern of Nature of Code's randomness chapter, with a Walker object [S83].

## Details
- Using `noise()` for the step makes motion smooth; the book offsets noise coordinates (0 and 10,000) so x and y move independently, and smaller increments such as 0.01 give smoother output [S83].
- A Levy-flight variant takes mostly small steps with rare large jumps; the book says its example is not an exact Levy flight [S83].
- Accept-reject sampling generates custom distributions by testing a second random value [S83].
- The book cautions that overusing noise or randomness can make designs predictable [S83].

## In explainer work
Seed both generators, and note a walk is accumulated state: to scrub it, pre-compute the path into an array in `setup()` (inference) [S72][S77].

## Patterns
```js
randomSeed(3);
const path = [createVector(0, 0)];
for (let i = 1; i < 500; i++) path.push(p5.Vector.add(path[i - 1], p5.Vector.random2D()));
// draw path[0..floor(t * 500)] for a scrubbable reveal
```
Pitfall: seeds and call order must match across renders [S72].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- uses [[random]] — uniform and Gaussian steps [S83]
- uses [[noise]] — smooth walks [S83]
- teaches [[nature-of-code]] — source chapter [S83]
- related_to [[random-seed]] — repeatable paths [S72]

## Sources
- [S72] — noiseSeed() reference
- [S77] — src/math/random.js (main branch)
- [S83] — The Nature of Code, Randomness chapter
