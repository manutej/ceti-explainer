---
id: triangle-subdivision
title: "Self-balancing triangle subdivision"
type: Technique
aliases: ["longest-edge split", "Chaikin's algorithm", "Chaikin curve"]
sources: [S67, S77, S371, S372, S374]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# Self-balancing triangle subdivision

## Definition
Self-balancing triangle subdivision recursively splits a triangle on its longest edge, which avoids skinny sliver triangles; Chaikin's corner-cutting is used to texture the subdivided edges [S372].

## Details
- Always splitting the longest edge keeps triangle shapes balanced [S372].
- Chaikin's algorithm is a corner-cutting curve smoother applied to the edges [S372].
- Hobbs's essay uses Quil/Clojure code, so p5 users port it [S371][S372] (the toolchain note is shared with the colour essay).
- The essay is dated 2017-07-27 [S372].

## In explainer work
Gives hand-made, mesh-like backgrounds or abstract illustrations from a seed; keep the recursion depth fixed so frames stay reproducible (inference) [S372].

## Patterns
```js
function split(a, b, c, depth) {
  if (depth === 0) { triangle(a.x, a.y, b.x, b.y, c.x, c.y); return; }
  const e = [[a,b],[b,c],[c,a]].sort((p, q) => p5.Vector.dist(q[0], q[1]) - p5.Vector.dist(p[0], p[1]))[0];
  const m = p5.Vector.lerp(e[0], e[1], 0.5), o = [a, b, c].find(v => v !== e[0] && v !== e[1]);
  split(e[0], m, o, depth - 1); split(m, e[1], o, depth - 1);
}
```
Pitfalls: vertices must be `p5.Vector` objects; random split points should use seeded `random` [S372][S77].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- related_to [[tyler-hobbs]] — author of the essay [S372]
- related_to [[probabilistic-palette]] — companion essay on colour [S371]
- uses [[p5-vector]] — edge lengths and midpoints [S67]
- related_to [[seeded-determinism]] — seeded splits [S374]

## Sources
- [S67] — p5.Vector reference
- [S77] — src/math/random.js (main branch)
- [S371] — Working with Color in Generative Art
- [S372] — Aesthetically Pleasing Triangle Subdivision
- [S374] — Building Your Project (artist docs)
