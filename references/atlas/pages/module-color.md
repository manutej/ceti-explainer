---
id: module-color
title: "Color module"
type: Module
aliases: ["Color", "Color setting (fill, stroke, background, clip)", "Color/Setting", "fill/stroke/background"]
sources: [S1, S4, S30, S36, S41, S42, S120, S123, S357, S358]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# Color module

## Definition
The Color module has 25 entries in two groups: Creating & Reading (12) and Setting (13) [S357]. Setting holds `background`, `beginClip`, `blendMode`, `clear`, `clip`, `colorMode`, `endClip`, `erase`, `fill`, `noErase`, `noFill`, `noStroke`, `stroke`; `blendMode` moved here from Rendering [S357][S358].

## Details
- Creating & Reading: alpha, blue, brightness, color, green, hue, lerpColor, lightness, p5.Color, paletteLerp, red, saturation [S357].
- `colorMode()` widened from RGB, HSB, HSL to include RGBP3, HWB, LAB, LCH, OKLAB and OKLCH **[2.x]** [S30][S4]; see [[color-mode]] and [[color-spaces-2x]].
- Contrast checking arrived with 2.1: [[color-contrast]] [S120].
- Compositing: [[blend-mode]], [[erase]], and clip/beginClip/endClip for masks [S357].
- Color object creation is slower in 2.x because of a new color-conversion library (a user measured about 60 fps in 1.11.11 vs about 2 fps in 2.1.2 for per-pixel `set()`); write to `pixels[]` or use a shader instead [S123].

## In explainer work
Rated **High**: `lerpColor` and `paletteLerp` give state-change color tweens, OKLCH gives perceptually even ramps, and `clip` and `erase` handle masks and wipes [S357].

## Relations
- part_of [[hub-language-core]] (structural)
- part_of [[capability-map]] — top-level reference section [S1]
- uses [[color-mode]] — mode selection [S30]
- uses [[p5-color]] — color object class [S357]
- uses [[lerp-color]] — interpolation [S42]
- uses [[blend-mode]] — compositing [S36]
- uses [[erase]] — subtractive drawing [S41]
- related_to [[color-contrast]] — accessibility check [S120]

## Sources
- [S1] — Reference index (v2)
- [S4] — p5.js v2.0.0 release notes
- [S30] — colorMode() reference
- [S36] — blendMode() reference
- [S41] — erase() reference
- [S42] — lerpColor() reference
- [S120] — p5.js v2.1.0 release notes
- [S123] — Speed of set(x, y, color) in p5.js 2.1.2 vs 1.11.11
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
- [S358] — p5.js-website repo, `v1` branch reference (1.x reference; parsed 905 entries)
