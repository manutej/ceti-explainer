---
id: text-to-contours
title: "textToContours()"
type: Construct
aliases: ["textContours", "p5.Font.textToContours", "Contour-aware glyph outlines"]
sources: [S4, S32, S46, S268, S334, S357, S374]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# textToContours()

## Definition
**[2.x]** `p5.Font.textToContours(str, x, y, options)` returns one array of `{x, y, alpha}` points per contour, so a letter like "O" yields two contours; it is new in 2.0 for 2D [S4][S334]. Options include `sampleFactor` (default 0.1) and `simplifyThreshold` [S334].

## Details
- The reference name is `textToContours`, but the release notes and the Coding Train lesson also write `textContours`; use the reference name [S46][S32].
- Companion calls: `textToPoints`, `textToPaths` (flat path commands) and `textToModel` (WEBGL) [S32].
- Per-contour grouping lets rings and holes be treated separately, which suits [[begin-contour]] [S46].
- The example flow is `font = await loadFont(...)` then `font.textToContours('flow', 80, 200, {sampleFactor: 0.2}).flat()`; 2.x only because 1.x used `textToPoints` with preload [S268][S334].

## In explainer work
Use contours for outline draw-on and for morphs where glyph topology matters; flatten when per-letter grouping does not matter [S334][S357]. Art Blocks pins p5 at 1.11.11, so this API is not usable there [S374].

## Relations
- part_of [[p5-font]] — method [S334]
- part_of [[hub-language-core]] (structural)
- related_to [[text-to-points]] — flat-sample sibling [S32]
- enables [[shape-morph]] — per-contour interpolation [S334]
- related_to [[begin-contour]] — hole winding [S46]
- related_to [[kinetic-typography]] — downstream technique [S357]
- introduced_in [[release-2-0]] — new in 2.0 [S4]

## Sources
- [S4] — p5.js v2.0.0 release notes
- [S32] — p5.Font textToPoints() reference
- [S46] — Coding Train p5.js 2.0 typography
- [S268] — Greetings from p5.js 2.0: Animation, Interaction, and Typography in 2D and 3D
- [S334] — p5.Font `textToContours()` reference
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
- [S374] — Building Your Project (artist docs)
