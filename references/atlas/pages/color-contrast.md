---
id: color-contrast
title: "Color contrast checker"
type: Capability
aliases: ["contrast check"]
sources: [S31, S47, S120, S343, S357]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# Color contrast checker

## Definition
**[2.x]** `color.contrast()` is a core accessibility utility added in p5.js 2.1 for WCAG-aligned checks; it returns a boolean for a pair of colors, and `'all'` returns WCAG 2.1 and APCA details [S120][S47].

## Details
- Added in 2.1.0 alongside TypeScript types, the Add-on Events API and `p5.strands` if/else and for [S120].
- Exposed as a method on [[p5-color]] [S31][S357].
- Fits the project's access-first values (see [[access-statement]]) [S343].

## In explainer work
Run it over caption/background pairs and palette steps (including [[color-spaces-2x]] ramps) in setup so a published explainer meets contrast targets (inference) [S47].

## Relations
- part_of [[module-color]] — added to the Color module [S120]
- part_of [[hub-language-core]] (structural)
- part_of [[p5-color]] — contrast() method [S31]
- introduced_in [[release-2-1]] — added in 2.1 [S120]
- related_to [[access-statement]] — accessibility policy [S343]
- related_to [[addon-events-api]] — same release [S120]

## Sources
- [S31] — color() reference
- [S47] — p5.js 2.1 and 2.2: Expanding Graphics Avenues with p5.strands improvements and WebGPU
- [S120] — p5.js v2.1.0 release notes
- [S343] — p5.js Access Statement
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
