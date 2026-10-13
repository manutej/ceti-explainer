---
id: color-spaces-2x
title: "2.x color spaces (HWB, LAB, LCH, OKLAB, OKLCH)"
type: Concept
aliases: ["OKLCH", "OKLAB", "LAB", "LCH", "HWB", "CIE Lab", "new color spaces", "OKLCH ramp", "Perceptual interpolation"]
sources: [S4, S30, S42, S120, S123, S357]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# 2.x color spaces (HWB, LAB, LCH, OKLAB, OKLCH)

## Definition
**[2.x]** p5.js 2.0 added the colorMode options HWB, LAB, LCH, OKLAB and OKLCH, giving perceptual interpolation and palette generation natively [S4][S30]. HWB, LAB, LCH, OKLAB and OKLCH also got constants with new reference pages [S357].

## Details
- HWB is hue plus whiteness and blackness percentages; LAB is CIE Lab; LCH its lightness-chroma-hue form; OKLAB a corrected Lab with more uniform perception; OKLCH is the lightness-chroma-hue mode of OKLAB, suited to perceptual palettes and hue-stable ramps [S30].
- `lerpColor` in a perceptual mode interpolates in that space; hue-path handling for cylindrical modes is undocumented [S42].
- The reference does not state default ranges for these modes [S30].
- Cost: color creation is slower than 1.x because of a new conversion library; avoid creating `color()` per pixel [S123].
- Where RGBHDR/RGBP3 fit: see [[p3-hdr-color]] [S4].
- Constants: HWB, LAB, LCH, OKLAB, OKLCH have 2.x reference pages [S357].

## In explainer work
Use OKLCH ramps for evenly spaced palettes and crossfade palette colors by setting the target mode before `lerpColor` [S30][S42]. A palette helper can also check caption contrast with [[color-contrast]] [S120].

## Relations
- part_of [[module-color]] — new modes [S30]
- part_of [[hub-language-core]] (structural)
- part_of [[color-mode]] — selectable modes [S30]
- enables [[lerp-color]] — perceptual interpolation [S42]
- introduced_in [[release-2-0]] — added in 2.0 [S4]
- related_to [[p3-hdr-color]] — wide-gamut siblings [S30]
- related_to [[module-constants]] — mode constants [S357]

## Sources
- [S4] — p5.js v2.0.0 release notes
- [S30] — colorMode() reference
- [S42] — lerpColor() reference
- [S120] — p5.js v2.1.0 release notes
- [S123] — Speed of set(x, y, color) in p5.js 2.1.2 vs 1.11.11
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
