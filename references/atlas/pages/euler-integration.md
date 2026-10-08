---
id: euler-integration
title: "Motion algorithm (Euler integration)"
type: Technique
aliases: ["Motion algorithm", "applyForce", "force accumulation"]
sources: [S82, S84, S86, S138]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# Motion algorithm (Euler integration)

## Definition
The motion algorithm of Nature of Code is Euler integration: position changes by velocity, velocity changes by acceleration, and acceleration is reset each update [S82][S86].

## Details
- `applyForce` divides a force by mass and adds it to acceleration; copy the vector first (or use the static `div`) because vectors pass by reference [S86].
- Drag opposes velocity with magnitude coefficient times speed squared; gravitational attraction is `G*m1*m2/d^2` with distance constrained [S86].
- Mouse-directed acceleration overshoots, which motivates steering [S82].
- `random2D` acceleration yields smoother motion than a traditional random walker [S82].
- Only the first 100k characters of the Forces chapter were read [S86].

## In explainer work
Accumulated state does not scrub; use a fixed step for exports and precompute or re-simulate from frame 0 when you need a seekable timeline (inference) [S86][S138].

## Patterns
```js
applyForce(f) { this.acc.add(p5.Vector.div(f, this.mass)); }   // static div: no mutation
update() { this.vel.add(this.acc); this.pos.add(this.vel); this.acc.mult(0); }
```
Pitfalls: clamp distance in attraction formulas [S86].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- depends_on [[p5-vector]] — position, velocity, acceleration [S82]
- enables [[steering-behaviors]] — steering is a force [S84]
- conflicts_with [[pure-function-of-t]] — accumulated state is not a function of t [S86] (inference)
- related_to [[fixed-timestep]] — use a constant `dt` [S138]
- related_to [[nature-of-code]] — the teaching source [S82]

## Sources
- [S82] — The Nature of Code, Vectors chapter
- [S84] — The Nature of Code, Autonomous Agents chapter
- [S86] — The Nature of Code, Forces chapter
- [S138] — CCapture.js README
