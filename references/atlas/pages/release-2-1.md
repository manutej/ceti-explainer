---
id: release-2-1
title: "p5.js 2.1"
type: Release
aliases: ["2.1", "v2.1"]
sources: [S47, S119, S120, S123, S248]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# p5.js 2.1

## Definition
**[2.x]** p5.js 2.1 (v2.1.0/2.1.1) added TypeScript types, the Add-on Events API, `color.contrast()` and `p5.strands` if/else and for loops [S120][S47]. The Foundation write-up (2026-03-09) says 2.1 had 31 co-authors and about 50 people contributed to 2.1 and 2.2 together [S47].

## Details
- Features: [[typescript-types]], [[addon-events-api]], [[color-contrast]], control flow in [[p5-strands]] [S120].
- A 2.1.0 note mentions a `textWidth` fix related to spaces (see [[text-width]]) [S120].
- In 2.1.1, TypeScript global mode needed both `import "p5/global"` and `import p5 from "p5"` [S248].
- A user measured about 2 fps in 2.1.2 vs 60 fps in 1.11.11 for per-pixel `set()` because of the new color-conversion library [S123].
- Exact dates for 2.0.1 to 2.2.2 were not obtained; the notes give month/day only [S119].

## In explainer work
2.1 is the earliest version with the contrast checker; pin it or later if explainer builds call `color.contrast()` [S120].

## Relations
- part_of [[hub-language-core]] (structural)
- part_of [[p5js-2x]] — release in the line [S120]
- supersedes [[release-2-0]] — minor successor [S120]
- related_to [[release-2-2]] — followed by WebGPU [S47]
- related_to [[addon-events-api]] — shipped here [S120]
- related_to [[color-contrast]] — shipped here [S120]

## Sources
- [S47] — p5.js 2.1 and 2.2: Expanding Graphics Avenues with p5.strands improvements and WebGPU
- [S119] — Releases page 2 (2.2.3, 2.3.0 RCs, 1.11.12-1.11.14 RCs)
- [S120] — p5.js v2.1.0 release notes
- [S123] — Speed of set(x, y, color) in p5.js 2.1.2 vs 1.11.11
- [S248] — p5.js issue #8302 (TS + `import p5/global`, v2.1.1)
