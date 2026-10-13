---
id: bezier-order
title: "bezierOrder()"
type: Construct
aliases: []
sources: [S4, S6, S7, S11, S20, S115, S357]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# bezierOrder()

## Definition
**[2.x]** `bezierOrder(n)` sets the Bezier order to 2 (quadratic) or 3 (cubic, default); with no argument it returns the current order [S7]. It replaces `quadraticVertex` by unifying quadratic and cubic under [[bezier-vertex]] [S4].

## Details
- Accepts only 2 or 3 [S7].
- Proposed in RFC 6766 to remove `quadraticVertex` [S20].
- Under compat, `shapes.js` restores `quadraticVertex` [S11].
- New entry in the 2.x Custom Shapes reference group [S357].
- `bezierOrder(2)` is documented as the 2.x equivalent of `quadraticVertex` [S11][S115].

## In explainer work
Use quadratic order for simple arcs between labels (3 points per curve instead of 4); keep order explicit near the shape because it is global state that persists across shapes (inference) [S7].

## Relations
- part_of [[shape-custom-shapes]] — group member [S357]
- part_of [[hub-language-core]] (structural)
- supersedes [[curve-api-1x]] — replaces quadraticVertex [S4]
- enables [[bezier-vertex]] — one point per call at chosen order [S6]
- related_to [[p5js-compatibility]] — shapes.js restores quadraticVertex [S11]
- introduced_in [[release-2-0]] — shipped with the vertex API redesign [S4]

## Sources
- [S4] — p5.js v2.0.0 release notes
- [S6] — bezierVertex() reference
- [S7] — bezierOrder() reference
- [S11] — p5.js-compatibility add-ons
- [S20] — RFC issue #6766, vertex function API redesign
- [S115] — p5.js-compatibility README raw (differences list)
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
