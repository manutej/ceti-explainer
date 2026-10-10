---
id: p2dhdr
title: "P2DHDR canvas"
type: Construct
aliases: ["HDR canvas"]
sources: [S4, S10, S14, S62, S357]
confidence: low
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# P2DHDR canvas

## Definition
**[2.x]** `P2DHDR` is a wide-gamut 2D canvas mode introduced in 2.0; a P2DHDR canvas defaults to the `RGBHDR` color mode instead of RGB [S4].

## Details
- Release notes: HDR images can be loaded and shown in an HDR canvas [S4].
- Naming is unstable. 2.0.0 called the mode RGBHDR with a P2DHDR canvas; v2.3.1 renamed "HDR" to "P3" as a breaking change; the reference now lists RGBP3 and P2DP3 [S4][S62][S10].
- The `createCanvas` reference lists P2D, WEBGL and WEBGPU but not P2DHDR [S14].

> **Conflict:** The 2.0.0 notes name the canvas P2DHDR and the mode RGBHDR [S4], while the current constants and reference list P2DP3 and RGBP3 after the 2.3.1 rename [S10].

- Details of the P2DP3 canvas behaviour beyond the rename are not documented in the fetched pages [S14].

## In explainer work
For wide-gamut or HDR video output the canvas mode would matter, but no explainer-specific evidence was found; generated code written for 2.3.1+ must use `P3`, not `HDR` [S62].

## Relations
- part_of [[hub-language-core]] (structural)
- depends_on [[create-canvas]] — selected through the renderer argument [S4]
- enables [[p3-hdr-color]] — default mode RGBHDR/RGBP3 [S4]
- related_to [[module-constants]] — P2DP3 constant [S357]
- introduced_in [[release-2-0]] — shipped in 2.0 [S4]
- related_to [[color-mode]] — default mode depends on the canvas [S4]

## Sources
- [S4] — p5.js v2.0.0 release notes
- [S10] — p5.js GitHub releases page (v2.3.1 to v2.3.4)
- [S14] — createCanvas() reference
- [S62] — p5.js 2.3.1 release notes (mirror)
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
