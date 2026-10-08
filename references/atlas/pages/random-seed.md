---
id: random-seed
title: "randomSeed() and noiseSeed()"
type: Construct
aliases: ["randomSeed()", "noiseSeed()", "Numerical Recipes LCG"]
sources: [S66, S72, S76, S77, S128]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# randomSeed() and noiseSeed()

## Definition
`randomSeed()` seeds `random()` and `randomGaussian()` and `noiseSeed()` seeds `noise()`, so sequences repeat across runs; they are two separate seeding paths [S128][S72][S77].

## Details
- Both use the Numerical Recipes LCG (a=1664525, c=1013904223, m=2^32) when seeded [S76][S77].
- `noise()` uses its own lookup table; `random()` uses `_lcg_random_state`, so seeding one does not seed the other [S72][S76][S77].
- `randomSeed(null)` picks a seed from `Math.random()`, and seeding resets the Gaussian cache flag [S77].
- `randomSeed` covers `random()` and `randomGaussian()` only [S128].
- Documented guarantee is same seed, same sequence within a run; bit-identical output across p5 1.x versus 2.x or browsers was not found [S128][S72].
- These sources read main-branch code, not a pinned tag [S76].

## In explainer work
Call both seeds in `setup()` before any draw; for scrubbing, reseed per frame or derive per-entity values from a hash of an index (inference) [S128][S72].

## Patterns
```js
function frameAt(t) {
  randomSeed(42); noiseSeed(42);        // reseed per frame
  for (let i = 0; i < 50; i++) { const a = random(TWO_PI);
    circle(200 + cos(a + t * TWO_PI) * 100, 200 + sin(a + t * TWO_PI) * 100, 6); }
}
```
Pitfall: seeding once only reproduces if draws happen in the same order and count, which fails under backward scrubs (inference) [S128].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- enables [[seeded-determinism]] — the mechanism [S128][S72]
- enables [[random]] — repeatable draws [S66]
- enables [[noise]] — repeatable field [S72]
- conflicts_with [[noise]] — `randomSeed` does not seed noise [S72][S77]

## Sources
- [S66] — randomGaussian() reference
- [S72] — noiseSeed() reference
- [S76] — src/math/noise.js (main branch)
- [S77] — src/math/random.js (main branch)
- [S128] — randomSeed()
