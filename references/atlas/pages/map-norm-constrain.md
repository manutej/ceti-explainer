---
id: map-norm-constrain
title: "map(), norm(), constrain()"
type: Construct
aliases: ["map()", "norm()", "constrain()", "remap", "clamp", "Math/Calculation", "dist() / mag()", "Remap with clamp"]
sources: [S68, S69, S79, S80, S357]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# map(), norm(), constrain()

## Definition
`map()` linearly remaps a value between ranges without clamping unless a sixth argument is true; `norm()` is `map` to the range 0..1; `constrain()` returns `max(min(n, high), low)` [S68][S79].

## Details
- `map(11, 0, 10, 0, 100)` returns 110, and passing `true` as the sixth argument returns 100 [S68].
- Internally `withinBounds` clamps via `constrain`, and `norm` is unclamped [S79].
- `dist()` returned undefined for argument counts other than 4 or 6 in the file reviewed, and `mag()` is a hypot helper [S79].
- The Math/Calculation group has 18 entries in the 2.x reference [S357].
- For ranges that clamp automatically, use the sixth argument; for time, `constrain(norm(t, t0, t1), 0, 1)` is the usual local-progress idiom [S68][S79].

## In explainer work
These primitives turn a clock value into screen positions and progress per beat; forgetting to clamp causes overshoot after the beat ends [S79][S69].

## Patterns
Clamped remap and local progress.
```js
const x = map(value, 0, 100, 40, width - 40, true);    // clamped remap
const u = constrain(norm(t, t0, t1), 0, 1);            // beat-local progress
```
Pitfalls: `norm`, `map` and `lerp` do not clamp on their own [S68][S79].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- related_to [[lerp]] — shares the linear-formula family [S79]
- enables [[normalized-time]] — `norm` produces the playhead from a range [S79]
- part_of [[module-math]] — Math/Calculation group [S357]
- related_to [[easing-functions]] — remapped progress is eased next [S80]

## Sources
- [S68] — map() reference
- [S69] — lerp() reference
- [S79] — src/math/calculation.js (main branch)
- [S80] — Easing functions cheat sheet
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
