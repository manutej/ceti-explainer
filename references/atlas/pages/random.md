---
id: random
title: "random() and randomGaussian()"
type: Construct
aliases: ["randomGaussian()", "Math/Random"]
sources: [S62, S66, S77, S83, S87, S274, S357, S370, S374]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# random() and randomGaussian()

## Definition
`random()` returns a uniform random number (or a random array element) and `randomGaussian()` returns a normally distributed sample, by default mean 0 and standard deviation 1 [S77][S66].

## Details
- `random()` with one number returns [0, arg), with an array returns a uniformly chosen element, with two arguments swaps bounds if min exceeds max [S77].
- `randomGaussian` uses the polar Box-Muller method with rejection, returning one value and caching the second for the next call; one argument sets the mean only; there is no fixed min or max [S77][S66].
- Unseeded `random()` falls back to `Math.random()`; seeded calls use an LCG [S77].
- Nature of Code shows the 68/95/99.7 percent rule for Gaussian samples and cautions that overusing randomness makes designs predictable [S83].
- Tyler Hobbs says the Gaussian is the distribution he uses most and recommends bounding it [S370].
- 2.3.1 added `randomGaussian()` and 2.3 added `random()` inside strands code **[2.x]** [S62][S274].

## In explainer work
Seeded randomness keeps scatter and jitter identical across scrubs and exports; see [[seeded-determinism]] [S77][S374].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- depends_on [[random-seed]] — repeatability [S66]
- related_to [[generative-distributions]] — Gaussian and power-law use [S370]
- alternative_to [[noise]] — uniform versus smooth [S87]
- part_of [[module-math]] — Math/Random group [S357]
- enables [[random-walk]] — step source [S83]

## Sources
- [S62] — p5.js 2.3.1 release notes (mirror)
- [S66] — randomGaussian() reference
- [S77] — src/math/random.js (main branch)
- [S83] — The Nature of Code, Randomness chapter
- [S87] — I.2 Perlin Noise and p5.js Tutorial
- [S274] — What's New in p5.js 2.3.0!
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
- [S370] — Probability Distributions for Algorithmic Artists
- [S374] — Building Your Project (artist docs)
