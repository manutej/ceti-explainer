---
id: collision-curve-packing
title: "Collision-checked curve packing"
type: Technique
aliases: ["minimum spacing"]
sources: [S365, S366, S367, S368, S373]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# Collision-checked curve packing

## Definition
Collision-checked curve packing stops or rejects a curve when it comes within a margin of existing curves, giving minimum spacing between flow-field strokes [S366][S367].

## Details
- Fidenza's shapes (drawn along non-colliding flow-field curves) avoid overlapping by default, with Relaxed (partial overlap) and Anything Goes (no collision checks) variants [S365].
- Start-point strategies include a regular grid, uniform random and circle packing [S366].
- A code review of the shipped minified JS found p5 calls (setup, draw, noLoop, vertex, strokeWeight) and weighted palette selection, with the original source reportedly in Quil/Clojure rather than hand-written p5 [S367][S373].
> **Conflict:** the reviewer says the original source is "Quill" (presumably Quil), Hobbs says he works in Clojure, and which p5 version Fidenza's script type declares could not be confirmed; describe it as shipping p5-style JS and authored in Clojure/Quil (reported) [S367] vs [S373].
- Hobbs aimed for 99 percent of outputs to meet his quality standard [S368].

## In explainer work
Spacing checks keep field illustrations legible instead of clumped (inference); the technique is O(n) per step against existing geometry unless a spatial hash is used [S366].

## Patterns
```js
function tooClose(p, placed, minD) {
  return placed.some(q => dist(p.x, p.y, q.x, q.y) < minD);
}
// while tracing: stop the curve (or reject it) when tooClose(next, allPoints, minD)
```
Pitfalls: stopping rules change density; test over many seeds [S368].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- depends_on [[flow-field]] — curves are traced in the field [S366]
- demonstrates [[fidenza]] — core of the piece [S365]
- authored_by [[tyler-hobbs]] — essay and artwork author [S366]
- related_to [[probabilistic-palette]] — other Fidenza ingredient [S365]

## Sources
- [S365] — Fidenza
- [S366] — Flow Fields
- [S367] — Code Review: Fidenza by Tyler Hobbs
- [S368] — In Conversation with Tyler Hobbs on Fidenza
- [S373] — Remembrance of Things Future: A Conversation with Tyler Hobbs
