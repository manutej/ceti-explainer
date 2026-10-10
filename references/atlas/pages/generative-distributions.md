---
id: generative-distributions
title: "Distributions for generative variety"
type: Concept
aliases: ["Gaussian distribution", "Power-law distribution", "Pareto"]
sources: [S66, S83, S365, S370]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# Distributions for generative variety

## Definition
Distributions for generative variety are the probability distributions behind random choices; Tyler Hobbs names the Gaussian as the one he uses most and the power law for skewed sizes [S370].

## Details
- He recommends bounding the Gaussian, and used a pseudo-Pareto distribution for polygon sizes in his Community series [S370].
- A power-law distribution gives many small and few large items [S370].
- p5 supplies `randomGaussian()`, which has no fixed min or max, so bounding is the author's job [S66].
- Nature of Code shows 68/95/99.7 percent within 1/2/3 standard deviations, and custom distributions by accept-reject sampling [S83].

## In explainer work
Pick distributions to make scatter look natural: Gaussian for similar-but-varied values, power law for hierarchy (inference) [S370].

## Patterns
```js
const size = constrain(randomGaussian(20, 5), 8, 40);       // bounded Gaussian
const big = 4 / Math.pow(1 - random(), 1 / 1.8);            // pareto-like heavy tail
```
Pitfalls: unbounded tails produce outliers that break layout [S370].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- uses [[random]] — Gaussian and uniform sources [S66]
- related_to [[probabilistic-palette]] — weights [S365]
- related_to [[tyler-hobbs]] — essay author [S370]
- related_to [[random-walk]] — step distributions [S83]

## Sources
- [S66] — randomGaussian() reference
- [S83] — The Nature of Code, Randomness chapter
- [S365] — Fidenza
- [S370] — Probability Distributions for Algorithmic Artists
