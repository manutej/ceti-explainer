---
id: text-to-model
title: "textToModel()"
type: Construct
aliases: ["textModel", "3D text", "extruded text"]
sources: [S1, S4, S32, S33, S46, S268]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# textToModel()

## Definition
**[2.x]** `p5.Font.textToModel()` converts text into an extruded 3D model for WEBGL; it is new in 2.0 [S4][S268]. The settings shown include `extrude` and `sampleFactor` [S268][S46].

## Details
- Text models lack texture coordinates, so `texture()` does not work on them [S268].
- The reference spells `textToModel`; the Coding Train video says `textModel` [S46].
- It belongs to the same p5.Font family as [[text-to-contours]] [S32].

## In explainer work
3D titles and extruded labels in WEBGL explainers; combine with [[world-to-screen]] if flat 2D labels must track a 3D scene (inference) [S46][S1].

## Relations
- part_of [[p5-font]] — method [S33]
- part_of [[hub-language-core]] (structural)
- depends_on [[webgl-mode]] — WEBGL only [S4]
- related_to [[text-to-contours]] — outline sibling [S32]
- introduced_in [[release-2-0]] — new in 2.0 [S4]
- related_to [[module-3d]] — 3D geometry [S268]

## Sources
- [S1] — Reference index (v2)
- [S4] — p5.js v2.0.0 release notes
- [S32] — p5.Font textToPoints() reference
- [S33] — loadFont() reference
- [S46] — Coding Train p5.js 2.0 typography
- [S268] — Greetings from p5.js 2.0: Animation, Interaction, and Typography in 2D and 3D
