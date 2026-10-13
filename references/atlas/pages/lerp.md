---
id: lerp
title: "lerp()"
type: Construct
aliases: ["linear interpolation"]
sources: [S69, S78, S79, S80, S274, S339, S341]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# lerp()

## Definition
`lerp(start, stop, amt)` returns `start + amt * (stop - start)`; `amt` outside 0..1 extrapolates rather than clamps, so `lerp(0, 10, 1.5)` gives 15 [S69][S79].

## Details
- It is a one-line linear formula in `calculation.js` [S79].
- The 2.x docs note that `lerp` corresponds to GLSL `mix` in p5.strands shader examples **[2.x]** [S79].
- Inside strands code, `lerp()` works in shader callbacks (added across 2.3) **[2.x]** [S274].
- The vector form `p5.Vector.lerp` trims to the shorter dimension, and `lerpColor` clamps `amt` to [0,1], unlike `lerp` [S78][S339].
- Easing is applied before `lerp`: an eased progress value is fed in as `amt` [S80].

## In explainer work
`lerp` plus a clamped, eased `t` is the basic tween: state A to state B across a beat [S69][S79]. It is stateless, so it scrubs correctly [S79] (inference).

## Relations
- part_of [[hub-motion-rendering]] (structural)
- enables [[easing-functions]] — eased `t` feeds `amt` [S80]
- related_to [[map-norm-constrain]] — sibling one-line remap functions [S79]
- related_to [[lerp-color]] — colour counterpart with clamping [S339]
- related_to [[p5-strands]] — maps to `mix` in shader code [S79]
- related_to [[shape-morph]] — vertex-wise lerp is the morph core [S341]

## Sources
- [S69] — lerp() reference
- [S78] — src/math/p5.Vector.js (main branch)
- [S79] — src/math/calculation.js (main branch)
- [S80] — Easing functions cheat sheet
- [S274] — What's New in p5.js 2.3.0!
- [S339] — `lerpColor()` reference
- [S341] — Coding Challenge #81 Circle Morphing
