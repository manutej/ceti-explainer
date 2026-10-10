---
id: p3-hdr-color
title: "RGBP3 / RGBHDR wide-gamut color"
type: Construct
aliases: ["RGBP3", "RGBHDR", "P3 color space", "Display P3 RGB", "HDR color mode"]
sources: [S4, S10, S30, S62, S357]
confidence: low
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# RGBP3 / RGBHDR wide-gamut color

## Definition
**[changed in 2.x]** `RGBHDR` (2.0.0 notes) was renamed `RGBP3`: v2.3.1 renamed the "HDR" color space to "P3" as a breaking change, and the current reference lists RGBP3 and the canvas constant P2DP3 [S4][S62][S10][S30].

## Details
- RGBP3 is a wide-gamut RGB colorMode that needs a P3-capable canvas to render accurately [S30].
- A P2DHDR canvas defaults to RGBHDR; HDR images can load and display on an HDR canvas (see [[p2dhdr]]) [S4].
- Default numeric ranges are not documented on the colorMode page [S30].

> **Conflict:** The 2.0.0 notes call the mode RGBHDR and the canvas P2DHDR, the 2.3.1 notes rename "HDR" to "P3", and the reference lists RGBP3 (which the 2.0 notes do not mention) [S4] vs [S62] vs [S30].

## In explainer work
Generated or older code that uses `HDR` must use `P3` from 2.3.1 onward [S62]. Treat wide-gamut output as optional: no explainer-specific evidence was found (see [[color-mode]]) [S30].

## Relations
- part_of [[hub-language-core]] (structural)
- part_of [[color-mode]] — mode options [S30]
- depends_on [[p2dhdr]] — needs a wide-gamut canvas [S4]
- supersedes [[p2dhdr]] — P3 naming replaced HDR (constant rename) [S10]
- related_to [[module-constants]] — RGBP3, P2DP3 constants [S357]
- related_to [[release-2-3]] — rename landed in 2.3.1 [S62]

## Sources
- [S4] — p5.js v2.0.0 release notes
- [S10] — p5.js GitHub releases page (v2.3.1 to v2.3.4)
- [S30] — colorMode() reference
- [S62] — p5.js 2.3.1 release notes (mirror)
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
