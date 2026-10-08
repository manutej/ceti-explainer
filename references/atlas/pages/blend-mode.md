---
id: blend-mode
title: "blendMode()"
type: Construct
aliases: []
sources: [S36, S41, S357, S358]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# blendMode()

## Definition
`blendMode()` selects the compositing mode; there are 16 modes, split between 2D and WEBGL support [S36]. It moved from Rendering to Color/Setting in the 2.x reference [S357][S358].

## Details
- 2D-only: DIFFERENCE, OVERLAY, HARD_LIGHT, SOFT_LIGHT, DODGE, BURN; WEBGL-only: SUBTRACT [S36].
- Both: BLEND, ADD, DARKEST, LIGHTEST, EXCLUSION, MULTIPLY, SCREEN, REPLACE, REMOVE [S36].
- After `erase()`, `fill()`, `stroke()` and `blendMode()` have no effect (see [[erase]]) [S41].

## In explainer work
`ADD` and `SCREEN` give glow layers; `MULTIPLY` darkens overlays; mind that renderer-specific modes make a sketch non-portable between P2D and WEBGL [S36].

## Relations
- part_of [[module-color]] — Color/Setting member [S357]
- part_of [[hub-language-core]] (structural)
- conflicts_with [[erase]] — erase ignores blend mode [S41]
- related_to [[module-constants]] — blend constants [S36]
- related_to [[webgl-mode]] — SUBTRACT is WEBGL-only [S36]
- related_to [[layered-compositing]] — layer composition [S357]

## Sources
- [S36] — blendMode() reference
- [S41] — erase() reference
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
- [S358] — p5.js-website repo, `v1` branch reference (1.x reference; parsed 905 entries)
