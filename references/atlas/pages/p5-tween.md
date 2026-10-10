---
id: p5-tween
title: "p5.tween"
type: Library
aliases: ["Milchreis/p5.tween"]
sources: [S159, S170, S300, S323]
confidence: low
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# p5.tween

## Definition

p5.tween (Milchreis) is a p5 add-on for chained property tweens with named easings and loop/end callbacks, timed in milliseconds. [S170]

## Details

- Registration is addTween(object, name), chaining addMotion(key, target, duration, easing) steps, then startTween() or startLoop(). [S170]
- Easings are linear plus In/Out/InOut variants of Quad, Cubic, Quart, Quint, Sin and Elastic; it has 42 commits and an MIT licence. [S170][S159]
- The README does not say how tweens update each frame or mention p5 2.x, and ms durations suggest wall-clock time (inference), which would break deterministic export. [S170]
- The official libraries directory lists it under Animation and marks no animation library as v2-compatible. [S300]
- Maintenance 2026: unverified from sources; no stated p5 version. [S170][S159]

## In explainer work

For explainers prefer tracks that are pure functions of t ([[track-tween]]); p5.tween suits interactive UI motion only. [S170][S323]

## Relations

- alternative_to [[gsap]] — p5-native but wall-clock tweening [S170]
- conflicts_with [[frame-stepped-export]] — millisecond clock may desync from stepped time [S170]
- related_to [[track-tween]] — the deterministic alternative pattern [S323]
- related_to [[p5js-libraries-directory]] — listed under Animation [S300]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S159] — npm registry metadata (p5, p5.sound, p5.brush, p5.grain, p5.js-svg, p5.fillgradient, p5play, tone, ml5, p5.collide2d, p5.createloop, p5.capture, p5.plotsvg, p5.tree, matter-js, roughjs) (npm, queried 2026-10-08)
- [S170] — p5.tween repo (Milchreis, undated)
- [S300] — p5.js Community Libraries directory (Processing Foundation, undated (accessed 2026-10-08))
- [S323] — Manim Community `Animation` reference (Manim Community, undated)
