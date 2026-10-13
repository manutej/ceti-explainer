---
id: module-math
title: "Math module"
type: Module
aliases: ["Math", "Quaternions (p5.Quat)", "Math/Quaternion", "p5.Quat", "p5.Matrix"]
sources: [S1, S11, S65, S74, S79, S115, S156, S357, S359, S361]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# Math module

## Definition
The Math module has 39 entries in 2.x: Calculation (18), Noise (3), Random (3), Trigonometry (10), Quaternion (3, new pages) plus two vector entry points (`createVector`, `p5.Vector`) [S357]. Folded topic `math-quaternion`: Quaternion exposes `fromAxisAngle`, `multiply` and `rotateBy`, which existed in 1.x source (`p5.Quat.js`) but now have reference pages [S357][S361].

## Details
- Calculation: abs, ceil, constrain, dist, exp, floor, fract, lerp, log, mag, map, max, min, norm, pow, round, sq, sqrt [S357]. There is no built-in easing or tween API in core [S357][S156].
- Noise: noise, noiseDetail, noiseSeed; Random: random, randomGaussian, randomSeed; Trigonometry: acos, angleMode, asin, atan, atan2, cos, degrees, radians, sin, tan [S357].
- `p5.Vector` has 36 members; `createVector()` with no arguments is deprecated in 2.x, so pass explicit dimensions (the compat README presents this as required) [S74][S115][S357].
- Internal classes `p5.Matrix` and `p5.Quat` live in `src/math` [S359].
- Math functions such as `lerp` and `noise` can be written in JS and run in shaders via `p5.strands` [S65][S79].

> **Conflict:** The reference calls zero-argument `createVector()` deprecated with a warning, while the compat README lists explicit dimensions as a required change with no add-on [S74] vs [S11].

## In explainer work
Rated **High** for Calculation, Trigonometry and `p5.Vector` (a tweening toolkit, oscillation, orbits), **Medium** for Noise and Random (`randomSeed` gives reproducible renders), **Low** for Quaternion (smooth 3D orientation, camera slerps) [S357].

## Relations
- part_of [[hub-language-core]] (structural)
- part_of [[capability-map]] — top-level reference section [S1]
- uses [[lerp]] — Calculation member [S357]
- uses [[p5-vector]] — vector class [S357]
- uses [[math-trigonometry]] — Trigonometry group [S357]
- uses [[noise]] — Noise group [S357]
- uses [[random-seed]] — reproducible randomness [S357]
- related_to [[easing-functions]] — not built in [S357]

## Sources
- [S1] — Reference index (v2)
- [S11] — p5.js-compatibility add-ons
- [S65] — noise() reference (p5.js 2.3.3)
- [S74] — createVector() reference (v2.3.3)
- [S79] — src/math/calculation.js (main branch)
- [S115] — p5.js-compatibility README raw (differences list)
- [S156] — p5.js Libraries page
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
- [S359] — p5.js source at tag v2.3.4 (`src/` folder; JSDoc @module/@submodule/@method/@beta/@deprecated tags parsed)
- [S361] — p5.js source at tag v1.11.10 (1.x baseline for removed/moved diff)
