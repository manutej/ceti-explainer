---
id: probabilistic-palette
title: "Probabilistic palette"
type: Technique
aliases: ["weighted palette", "Weighted choice", "wc()", "Weighted features and palettes"]
sources: [S365, S367, S368, S370, S371, S374]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# Probabilistic palette

## Definition
A probabilistic palette defines colours with probabilities and picks via weighted choice, giving controlled variety with rare looks [S365][S371].

## Details
- Fidenza has 14 probabilistic palettes; Luxe is the most common with 16 colours, and Luxe-Derived is made deliberately rarest because its results are unpredictable [S365].
- The code review reports weighted palette selection with Luxe at 55 percent [S367].
- Hobbs argues for HSB over RGB for artistic colour control [S371].
- Rare settings with unreliable results lower average quality; Hobbs set his bar at 99 percent of outputs [S368].

## In explainer work
Use for thumbnail variants, B-roll and series art where some looks should be rare, with a seed controlling each pick [S365][S367] (inference).

## Patterns
```js
function wchoice(pairs) {                 // [[value, weight], ...]
  let t = random(pairs.reduce((s, p) => s + p[1], 0));
  for (const [v, w] of pairs) { if ((t -= w) < 0) return v; }
}
const palette = wchoice([[LUXE, 55], [COOL, 25], [MONO, 20]]);
```
Pitfalls: seed `random` first so the choice is reproducible [S374].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- depends_on [[random]] — weighted draw [S367]
- demonstrates [[fidenza]] — 14 palettes [S365]
- related_to [[generative-distributions]] — weights are a discrete distribution [S370]
- related_to [[color-mode]] — HSB advice [S371]

## Sources
- [S365] — Fidenza
- [S367] — Code Review: Fidenza by Tyler Hobbs
- [S368] — In Conversation with Tyler Hobbs on Fidenza
- [S370] — Probability Distributions for Algorithmic Artists
- [S371] — Working with Color in Generative Art
- [S374] — Building Your Project (artist docs)
