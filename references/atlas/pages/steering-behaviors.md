---
id: steering-behaviors
title: "Steering behaviors"
type: Technique
aliases: ["Steering force"]
sources: [S46, S67, S82, S84, S86, S334]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# Steering behaviors

## Definition
A steering force is the desired velocity minus the current velocity, with the desired vector scaled to a maximum speed and the resulting steering limited to a maximum force [S84].

## Details
- It is the core move of Nature of Code's Autonomous Agents chapter; agents follow targets or a flow field by steering rather than jumping to a direction [S84].
- Implementation uses `p5.Vector` `sub`, `setMag` and `limit` [S84][S67].
- Mouse-directed acceleration overshoots, which is the motivation for steering [S82].
- Coding Train reworked its Steering Behaviors challenge for 2.0 using glyph contours from `textToContours`, so agents seek points on letters **[2.x]** [S46][S334].
- Steering accumulates state frame to frame, so it does not scrub without re-simulation (inference) [S86].

## In explainer work
Good for showing attraction, flocking intuition or points converging onto text; pre-simulate or fix the step if the clip must be seekable [S84][S46].

## Patterns
```js
const desired = p5.Vector.sub(target, pos).setMag(maxSpeed);
const steer = p5.Vector.sub(desired, vel).limit(maxForce);
acc.add(steer);
```
Pitfalls: static methods return new vectors so shared vectors are not mutated [S67].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- depends_on [[euler-integration]] — steering is applied as a force [S84]
- uses [[p5-vector]] — `limit` and `setMag` [S67]
- related_to [[flow-field]] — agents follow field vectors [S84]
- related_to [[text-to-contours]] — 2.x kinetic-type variant [S46]

## Sources
- [S46] — Coding Train p5.js 2.0 typography
- [S67] — p5.Vector reference
- [S82] — The Nature of Code, Vectors chapter
- [S84] — The Nature of Code, Autonomous Agents chapter
- [S86] — The Nature of Code, Forces chapter
- [S334] — p5.Font `textToContours()` reference
