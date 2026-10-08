---
id: module-constants
title: "Constants module"
type: Module
aliases: ["Constants", "p5 constants"]
sources: [S1, S10, S16, S36, S357, S358, S359]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# Constants module

## Definition
Constants is a flat list that includes `WEBGL`, `WEBGL2`, `P2D`, `P2DP3`, `WEBGPU`, `PI`, `HALF_PI`, `QUARTER_PI`, `TAU`, `TWO_PI`, `AUTO`, `INCLUDE`, `EXCLUDE` and `VERSION` [S1]. The 2.x reference documents 140 constants (1.x: 121 constant pages) [S357][S358].

## Details
- 19 constants have reference pages new in 2.x: AUDIO, VIDEO, DEG_TO_RAD, RAD_TO_DEG, EMPTY_PATH, EXCLUDE, INCLUDE, FULL, SIMPLE, PATH, HWB, LAB, LCH, OKLAB, OKLCH, RGBP3, P2DP3, MAX_GIF_PIXELS and WEBGPU [S357].
- v2.3.1 renamed the `HDR` color-space constant to `P3`, so the constants are now RGBP3 and P2DP3 **[changed in 2.x]**; see [[p3-hdr-color]] [S10].
- v2.3.3 added `MAX_GIF_PIXELS`, a 16,000,000-pixel default cap on GIF size [S10].
- `SIMPLE` and `FULL` are the `strokeMode` values for WebGL, trading caps, joins and stroke color for speed [S359].
- `strokeCap` options are ROUND (default), SQUARE and PROJECT [S16].
- Constants such as angleMode values and endShape modes were not separately verified in the fetched index [S1].

## In explainer work
Rated **Medium**: blend modes, color modes and CLOSE are used constantly; the GIF cap matters for export sizing [S357][S10].

## Relations
- part_of [[hub-language-core]] (structural)
- part_of [[capability-map]] — top-level reference section [S1]
- related_to [[p3-hdr-color]] — RGBP3 and P2DP3 naming [S10]
- related_to [[color-spaces-2x]] — HWB, LAB, LCH, OKLAB, OKLCH constants [S357]
- related_to [[save-gif]] — MAX_GIF_PIXELS caps GIF export [S10]
- related_to [[blend-mode]] — blend constants [S36]

## Sources
- [S1] — Reference index (v2)
- [S10] — p5.js GitHub releases page (v2.3.1 to v2.3.4)
- [S16] — strokeCap() reference
- [S36] — blendMode() reference
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
- [S358] — p5.js-website repo, `v1` branch reference (1.x reference; parsed 905 entries)
- [S359] — p5.js source at tag v2.3.4 (`src/` folder; JSDoc @module/@submodule/@method/@beta/@deprecated tags parsed)
