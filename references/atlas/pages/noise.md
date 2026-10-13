---
id: noise
title: "noise()"
type: Construct
aliases: ["Perlin noise", "value noise", "Math/Noise", "noiseDetail()", "Octave"]
sources: [S65, S71, S72, S76, S83, S84, S87, S133, S265, S357]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# noise()

## Definition
`noise()` is p5's smooth pseudorandom function returning values nominally in 0..1, in 1D, 2D or 3D; it is value noise with cosine interpolation, not Ken Perlin's gradient algorithm [S65][S76][S83].

## Details
- The lookup table has 4096 entries with a bitmask wrap, and negative coordinates are mirrored by negation [S76].
- Default detail is 4 octaves with falloff 0.5; `noiseDetail(lod, falloff)` overrides it, and with falloff above 0.5 output can exceed 1 even though the reference says 0..1 [S76][S71].
- The table is filled lazily from `Math.random` unless `noiseSeed()` was called [S76].
- Values cluster mid-range, so mapping naive noise to angles biases direction; Nature of Code suggests widening the range such as 0 to 4*PI [S84].
- Offset coordinates per axis (Nature of Code uses 0 and 10,000) so two walkers do not move together [S83].
- The 2.3.3 docs show `noise()` usable in p5.strands shaders (cloud-texture filter) **[2.x]** [S65].
- Issue reports in 2.1.1 describe a slowdown in a 20,000-rect sketch, though a sine replacement showed the same, so `noise()` was not the sole cause **[2.x]** [S265].
- The reference says nothing about looping or periodicity [S65].

## In explainer work
Use it for continuous wobble and drift; for exact loops sample a circle through extra dimensions (see [[noise-loop]]) [S65][S133].

## Patterns
Organic drift per entity.
```js
const dx = map(noise(id * 10000 + t * 0.5), 0, 1, -20, 20);
```
Pitfalls: apparent amplitude is smaller than the mapped range because values cluster mid-range [S84]; seed it with `noiseSeed` for repeatability [S72].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- depends_on [[random-seed]] — `noiseSeed` makes it repeatable [S72]
- alternative_to [[random]] — smooth versus uniform variation [S83][S87]
- enables [[flow-field]] — noise-to-angle fields [S84]
- enables [[noise-loop]] — circle sampling in noise space [S133]
- integrates_with [[p5-strands]] — usable in shaders [S65]
- part_of [[module-math]] — Math/Noise group [S357]

## Sources
- [S65] — noise() reference (p5.js 2.3.3)
- [S71] — noiseDetail() reference
- [S72] — noiseSeed() reference
- [S76] — src/math/noise.js (main branch)
- [S83] — The Nature of Code, Randomness chapter
- [S84] — The Nature of Code, Autonomous Agents chapter
- [S87] — I.2 Perlin Noise and p5.js Tutorial
- [S133] — Challenge 137: 4D OpenSimplex Noise Loop
- [S265] — Issue #8316 "noise() is laggier in 2.x"
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
