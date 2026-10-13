---
id: easing-functions
title: "Easing functions"
type: Concept
aliases: ["easing", "easing curve", "Easing families", "easings.net", "Deterministic eased tween", "Easing function"]
sources: [S69, S79, S80, S81, S316, S332, S335, S387]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# Easing functions

## Definition
An easing function maps progress 0..1 to eased progress and is applied before `lerp`; p5 has no built-in easing library in the pages reviewed, so explainers hand-write or borrow them [S80] (the no-built-in point is an inference [S69]).

## Details
- easings.net lists ten families (Sine, Quad, Cubic, Quart, Quint, Expo, Circ, Back, Elastic, Bounce), each with In, Out and InOut variants [S80].
- `easeInOutCubic` is `4x^3` for `x<0.5`, else `1-(-2x+2)^3/2`; `easeInOutSine` is `(1-cos(PI x))/2`; `easeOutExpo` is `1-2^(-10x)` except 1 at x=1 [S81].
- `easeOutBack` uses c1=1.70158 and c3=c1+1; `easeOutElastic` uses c4=2*PI/3; `easeOutBounce` is piecewise with n1=7.5625 and d1=2.75 [S81].
- Coding Challenge 135 teaches loops via easing functions after sketching on paper first [S387].
- Tween zoom in log space (`exp(lerp(log z0, log z1, a))`), or deep zooms feel like they accelerate [S335].

## In explainer work
Every beat is `lerp(a, b, ease(clamp(norm(t, t0, t1))))`; ease changes feel without changing duration [S80][S79].

## Patterns
Deterministic eased tween.
```js
const easeInOutCubic = x => x < 0.5 ? 4*x*x*x : 1 - Math.pow(-2*x + 2, 3) / 2;
function tween(a, b, t0, t1, t) {
  const u = constrain(norm(t, t0, t1), 0, 1);
  return lerp(a, b, easeInOutCubic(u));
}
```
Pitfalls: `norm`, `lerp` and `map` do not clamp, so overshoot appears after `t1` without `constrain` [S79][S69].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- depends_on [[lerp]] — eased value is the `amt` [S69]
- depends_on [[map-norm-constrain]] — local progress [S79]
- enables [[loop-phase-animation]] — loop fraction plus easing [S387]
- related_to [[track-tween]] — engine tween store applies easing [S316]
- related_to [[gsap]] — external timeline library with its own easing [S332]

## Sources
- [S69] — lerp() reference
- [S79] — src/math/calculation.js (main branch)
- [S80] — Easing functions cheat sheet
- [S81] — easingsFunctions.ts
- [S316] — Motion Canvas tutorial part 1
- [S332] — GSAP core docs
- [S335] — p5.Camera `slerp()` reference
- [S387] — Coding Challenge #135 Making a GIF Loop
