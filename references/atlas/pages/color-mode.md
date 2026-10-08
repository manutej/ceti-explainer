---
id: color-mode
title: "colorMode()"
type: Construct
aliases: []
sources: [S4, S15, S30, S31, S42, S357]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# colorMode()

## Definition
`colorMode()` sets how `color()` parameters are interpreted; with no arguments it returns the current mode [S30]. The current reference accepts RGB, HSB, HSL, RGBP3, HWB, LAB, LCH, OKLAB and OKLCH **[changed in 2.x]** [S30].

## Details
- `colorMode(mode, max)` sets one range for all channels and `colorMode(mode, m1, m2, m3, mA)` sets per-channel ranges [S30].
- A `p5.Color` keeps the mode it was created in, so changing the mode later does not alter its appearance [S30].
- Defaults for HWB, LAB, LCH, OKLAB, OKLCH and RGBP3 channel ranges are not stated on the reference page; for single-value grayscale in LAB/LCH/OKLAB/OKLCH the value sets lightness against that channel's maximum [S30].
- The 2.0 notes list the new modes as RGBHDR, HWB, LAB, LCH, OKLAB, OKLCH; RGBP3 appears only in the reference (timing unverified) [S4].
- In `p5.strands` shaders `color()` yields a normalized vec4 and `colorMode()` has no effect [S31].
- `push()` saves the color mode ([[drawing-state]]) [S15].
- Interpolation with [[lerp-color]] depends on the current mode [S42].

## In explainer work
Set explicit maxima for new modes (for example `colorMode(OKLCH, 1, 0.4, 360)`) or verify values empirically; then build palettes with even perceptual steps [S30]. See [[color-spaces-2x]].

## Patterns
**OKLCH ramp.** When: palette steps must look evenly spaced and keep hue. Pitfall: undocumented default ranges.
```js
colorMode(OKLCH);
fill(0.7, 0.15, 250);
```

## Relations
- part_of [[module-color]] — Color/Setting member [S357]
- part_of [[hub-language-core]] (structural)
- uses [[color-spaces-2x]] — perceptual modes [S30]
- related_to [[p3-hdr-color]] — RGBP3 / RGBHDR modes [S30]
- related_to [[lerp-color]] — result depends on mode [S42]
- conflicts_with [[p5-strands]] — colorMode ignored in strands shaders [S31]

## Sources
- [S4] — p5.js v2.0.0 release notes
- [S15] — push() reference
- [S30] — colorMode() reference
- [S31] — color() reference
- [S42] — lerpColor() reference
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
