---
id: p5-anims
title: "p5.animS"
type: Library
aliases: ["animS"]
sources: [S300, S309]
confidence: low
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# p5.animS

## Definition

p5.animS (wixette) animates p5 shapes by replaying how they are drawn over a given number of frames, keeping per-shape state through a unique ID. [S309]

## Details

- Animation length is measured in frames, so it fits frame-indexed export better than ms-based tween add-ons. [S309]
- The directory lists it under Animation, with no animation library marked v2-compatible. [S300]
- Maintenance 2026 and 2.x: not documented. [S309]

## In explainer work

Its progressive-draw idea is what the blueprint's arc-length reveal reimplements as a pure function of t. [S309][S300]

## Relations

- related_to [[track-tween]] — alternative progressive-draw approach [S309]
- related_to [[p5js-libraries-directory]] — listed under Animation [S300]
- related_to [[explainer-engine-blueprint]] — inspiration for reveal patterns [S309]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S300] — p5.js Community Libraries directory (Processing Foundation, undated (accessed 2026-10-08))
- [S309] — p5.animS README (wixette, undated)
