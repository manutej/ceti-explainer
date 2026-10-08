---
id: drawing-state
title: "Drawing state"
type: Concept
aliases: ["style state", "render state"]
sources: [S15, S28, S259, S349]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# Drawing state

## Definition
The drawing state is the global machine of current fill, stroke, modes, text settings and transform matrix that every subsequent draw call uses [S15]. It is saved and restored with nested [[push-pop]] pairs [S15].

## Details
- `push()` saves fill, stroke, tint, strokeWeight/Cap/Join, image/rect/ellipse/colorMode, text align/font/size/leading, and transforms [S15].
- In WEBGL, `push()` also saves camera, lights, texture, material and shader [S15].
- `push()` and `pop()` must always be called as a pair and can be nested [S15].
- Transforms in the state change the coordinate system, not the object; translate, rotate and scale accumulate and the recommended order is translate, rotate, scale [S349]. See [[module-transform]].
- The main canvas resets transforms at the start of each draw iteration, but style state such as fill persists unless reset [S259][S28].

## In explainer work
Experts treat each push/pop as a lexical scope and keep it balanced; novices debug leaking colors [S15]. Wrap every labeled diagram element in its own push/pop so styles and transforms cannot leak into the next element [S15].

## Relations
- part_of [[hub-language-core]] (structural)
- related_to [[push-pop]] — the save/restore mechanism [S15]
- related_to [[module-transform]] — transform matrix is part of the state [S349]
- related_to [[color-mode]] — colorMode is saved by push [S15]
- related_to [[immediate-mode]] — state is consumed by redrawn calls [S15]
- related_to [[p5-graphics]] — each buffer carries its own state [S259]

## Sources
- [S15] — push() reference
- [S28] — translate() reference
- [S259] — p5.Graphics reference
- [S349] — Coordinates and Transformations (tutorial)
