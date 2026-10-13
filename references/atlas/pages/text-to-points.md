---
id: text-to-points
title: "textToPoints()"
type: Construct
aliases: ["p5.Font.textToPoints"]
sources: [S4, S32, S33, S45, S357]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# textToPoints()

## Definition
`p5.Font.textToPoints(str, x, y, options)` samples glyph outlines into an array of objects with `x`, `y` and `alpha`, where alpha is the path angle [S32]. The 2.0 notes report it is about 350% faster than in 1.x **[changed in 2.x]** [S4].

## Details
- `sampleFactor` defaults to 0.1; higher values give more points [S32].
- `simplifyThreshold`, when non-zero, removes collinear points by an angle threshold in radians [S32].
- The anchor is the bottom-left of the text bounding box unless `textAlign` changes it [S32].
- Point count follows `sampleFactor` and path length, so two strings rarely give equal counts [S32].
- Whether animating variable-font weight works with `textToPoints` is undocumented; the 1.x community library p5.variableFont could not animate axes with it [S45].

> **Conflict:** The reference signature is (str, x, y, options) [S32], whereas the capability-map pattern passes a font size before the options object [S4]; check the live reference before copying.

## In explainer work
Text-to-points morph: sample two strings, then index the shorter array modulo or resample; `textToContours` keeps per-letter grouping [S357][S32]. A morph is `lerp(a[i].x, b[i%b.length].x, ease(t))` per point (inference) [S4].

## Patterns
**Text to points morph.** When: label to shape or word. Pitfall: unequal point counts.
```js
const a = font.textToPoints('A', 0, 0, {sampleFactor: 0.3});
for (const p of a) circle(lerp(p.x, tx, k), lerp(p.y, ty, k), 3);
```

## Relations
- part_of [[p5-font]] — method [S32]
- part_of [[hub-language-core]] (structural)
- related_to [[text-to-contours]] — contour-grouped sibling [S32]
- enables [[shape-morph]] — point arrays to interpolate [S357]
- depends_on [[load-font]] — needs a loaded font [S33]
- related_to [[kinetic-typography]] — particle-text effects [S32]

## Sources
- [S4] — p5.js v2.0.0 release notes
- [S32] — p5.Font textToPoints() reference
- [S33] — loadFont() reference
- [S45] — p5.variableFont
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
