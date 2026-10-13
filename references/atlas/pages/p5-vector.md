---
id: p5-vector
title: "p5.Vector"
type: Construct
aliases: ["createVector()", "vector", "Math/Vector entry points", "p5.Vector.slerp", "p5.Vector.fromAngle", "Polar placement and orbits"]
sources: [S4, S11, S67, S74, S78, S82, S84, S85, S86, S274, S357]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# p5.Vector

## Definition
`p5.Vector` is p5's vector class; in 2.x it stores components in a `values` array with arbitrary dimensions **[changed in 2.x]**, and `createVector()` accepts any number of numeric components [S67][S78][S74].

## Details
- Fields `x`, `y`, `z` and `dimensions` exist; methods include add, sub, mult, div, rem, mag, magSq, dot, cross, dist, normalize, limit, setMag, heading, setHeading, rotate, angleBetween, reflect, lerp, slerp, array, getValue, setValue, clampToZero [S67].
- `add` is documented as N-dimensional; mixed sizes operate on the smaller dimension (`[1,2,3]+[4,5]` gives `[5,7]`); `lerp` trims to the shorter dimension [S67][S78].
- v2.0.0 notes list n-dimensional vectors with a matrix interface [S4].
- Calling `createVector()` with no arguments is deprecated and warns **[changed in 2.x]**; the compatibility README says explicit dimensions are required [S74][S11]. In 2.3.0 blank vectors must declare dimension [S274].
> **Conflict:** the reference says the zero-argument form is deprecated with a warning, while the compatibility README lists "createVector requires explicit dimensions" as a change; severity differs [S74] vs [S11].
- Static methods return new vectors, instance methods mutate [S67][S82].
- `slerp` interpolates heading and magnitude, unlike `lerp`, and falls back to `lerp` for zero-length or near-parallel vectors [S67][S78].
- A review of main found the `setHeading` 2D check reads `_values`, so it appears ineffective (single-source) [S78].
- Static `fromAngle`, `fromAngles`, `random2D`, `random3D` are constructors [S67].

## In explainer work
Vectors carry position, velocity, forces and polar placement; n-D vectors can stand in for colour or embedding-style state (inference) [S67][S85].

## Patterns
```js
const a = createVector(1, 2, 3, 4), b = createVector(0, 0, 0, 0);
a.lerp(b, 0.25);                       // n-D lerp; mismatched sizes truncate
const p = p5.Vector.fromAngle(ang).mult(r);   // polar placement
```
Pitfalls: instance methods mutate; copy or use static forms [S86].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- part_of [[module-math]] — Math group vector entry points [S357]
- enables [[euler-integration]] — position, velocity, acceleration [S82]
- enables [[steering-behaviors]] — `limit` and `setMag` [S84]
- related_to [[oscillation]] — `fromAngle` for orbits [S85]
- related_to [[version-2x-migration]] — n-D change and `createVector()` deprecation [S4]

## Sources
- [S4] — p5.js v2.0.0 release notes
- [S11] — p5.js-compatibility add-ons
- [S67] — p5.Vector reference
- [S74] — createVector() reference (v2.3.3)
- [S78] — src/math/p5.Vector.js (main branch)
- [S82] — The Nature of Code, Vectors chapter
- [S84] — The Nature of Code, Autonomous Agents chapter
- [S85] — The Nature of Code, Oscillation chapter
- [S86] — The Nature of Code, Forces chapter
- [S274] — What's New in p5.js 2.3.0!
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
