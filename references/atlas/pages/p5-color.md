---
id: p5-color
title: "p5.Color"
type: Construct
aliases: ["color object", "Color/Creating & Reading"]
sources: [S30, S31, S42, S123, S357, S359]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# p5.Color

## Definition
`p5.Color` is the color object returned by `color()`; it keeps the mode it was created in [S30][S31]. The 2.x reference lists 6 members: `contrast` (new), `setAlpha`, `setBlue`, `setGreen`, `setRed`, `toString` [S357].

## Details
- `color()` accepts RGB numbers, HSB/HSL numbers with a matching mode, grayscale, CSS strings, arrays and `p5.Color` objects [S31].
- `contrast()` checks contrast between two colors (see [[color-contrast]]) [S31].
- Source ships `p5.Color.culori.js` and a `color_spaces` folder in `src/color` [S359].
- Creation is slower in 2.x than 1.x, with a user reporting about 2 fps vs 60 fps for per-pixel `set()` [S123].
- In `p5.strands`, `color()` returns a normalized vec4 and `colorMode` has no effect [S31].

## In explainer work
Create palette colors once in setup and reuse them; avoid constructing `p5.Color` objects per pixel or per particle per frame (inference from the reported slowdown) [S123].

## Relations
- part_of [[module-color]] — Creating & Reading group [S357]
- part_of [[hub-language-core]] (structural)
- related_to [[color-mode]] — object remembers its mode [S30]
- uses [[color-contrast]] — contrast() method [S31]
- related_to [[lerp-color]] — interpolates two color objects [S42]
- related_to [[perf-regressions-2x]] — color-creation slowdown [S123]

## Sources
- [S30] — colorMode() reference
- [S31] — color() reference
- [S42] — lerpColor() reference
- [S123] — Speed of set(x, y, color) in p5.js 2.1.2 vs 1.11.11
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
- [S359] — p5.js source at tag v2.3.4 (`src/` folder; JSDoc @module/@submodule/@method/@beta/@deprecated tags parsed)
