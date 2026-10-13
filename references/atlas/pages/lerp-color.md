---
id: lerp-color
title: "lerpColor()"
type: Construct
aliases: ["paletteLerp"]
sources: [S30, S42, S123, S357]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# lerpColor()

## Definition
`lerpColor(c1, c2, amt)` interpolates between two colors; the result depends on the current [[color-mode]], and `amt` is clamped to 0..1 [S42]. The Color module also has `paletteLerp` for multi-stop palettes [S357].

## Details
- The reference gives no detail on hue-path handling in cylindrical modes (HSB, LCH, OKLCH) [S42].
- Set the colorMode to the target space (for example OKLCH) before calling to get perceptual interpolation [S42][S30].
- Because color objects are slower to create in 2.x, precompute palette endpoints instead of calling `color()` inside tight loops [S123].
- Listed among the Color/Creating & Reading entries [S357].

## In explainer work
State-change tweens (inactive to active node color) are a staple of timeline explainers; drive `amt` from an eased normalized time rather than from frame count directly [S357]. Easing is not built in; see [[easing-functions]] [S357].

## Relations
- part_of [[module-color]] — Creating & Reading member [S357]
- part_of [[hub-language-core]] (structural)
- depends_on [[color-mode]] — result depends on the mode [S42]
- uses [[color-spaces-2x]] — perceptual spaces [S30]
- related_to [[lerp]] — scalar counterpart [S357]
- related_to [[easing-functions]] — shape the amt parameter [S357]

## Sources
- [S30] — colorMode() reference
- [S42] — lerpColor() reference
- [S123] — Speed of set(x, y, color) in p5.js 2.1.2 vs 1.11.11
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
