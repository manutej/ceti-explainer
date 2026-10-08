---
id: p5-font
title: "p5.Font"
type: Construct
aliases: ["font object", "textToPaths()"]
sources: [S4, S32, S33, S46, S357]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# p5.Font

## Definition
`p5.Font` is the font object returned by [[load-font]]; it exposes four methods in the 2.x reference: `textToPoints`, and the new `textToContours`, `textToModel` and `textToPaths` [S33][S32][S357].

## Details
- `textToPoints` returns points with x, y and alpha (path angle); `textToContours` returns arrays of points per contour; `textToPaths` returns a flat array of path commands; `textToModel` builds a 3D model in WEBGL [S32][S4].
- `textBounds` now renders as a global page rather than a `p5.Font` page without the method changing [S357].
- Folded topic text-to-paths: textToPaths is documented only as a flat command array [S32].
- The Coding Train typography lesson says one letter can have multiple contours, each with an angle property [S46].

## In explainer work
Sampled point arrays are the basis for text morphs and draw-on text (see [[shape-morph]]); sampling once per string in setup and reusing the arrays is our own advice (inference) [S357][S32].

## Relations
- part_of [[module-typography]] — class in Typography [S357]
- part_of [[hub-language-core]] (structural)
- related_to [[text-to-points]] — method [S32]
- related_to [[text-to-contours]] — method [S32]
- related_to [[text-to-model]] — method [S33]
- depends_on [[load-font]] — created by loading [S33]
- enables [[kinetic-typography]] — outline-driven text animation [S357]

## Sources
- [S4] — p5.js v2.0.0 release notes
- [S32] — p5.Font textToPoints() reference
- [S33] — loadFont() reference
- [S46] — Coding Train p5.js 2.0 typography
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
