---
id: p5js-reference
title: "p5.js Reference"
type: Tool
aliases: ["p5js.org/reference"]
sources: [S1, S5, S11, S21, S357, S358, S362, S363]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# p5.js Reference

## Definition
The p5.js Reference at p5js.org/reference is the official API documentation, generated from JSDoc in `src/`; the live site documents 2.3.3 while a separate v1 reference is hosted at v1.p5js.org [S1][S363][S5][S21].

## Details
- The website pins `p5Version = "2.3.3"` and p5.sound 0.4.1, while GitHub and npm `latest` are on 2.3.4; since 2.3.4 is a patch, the public surface should be identical (source diff against main found no missing public tag) [S363][S362][S357].
- Counts: 759 entries (439 global), 33 class folders, 140 constants and 5 types for 2.x, versus 905 entries for 1.x [S357][S358]; see [[capability-map]].
- Top-level sections: Shape, Color, Typography, Image, Transform, Environment, 3D, Rendering, Math, IO, Events, DOM, Data, Structure, Constants, Foundation, plus p5.sound [S1].
- Some pages moved class owner between references without a method change (for example `p5.Camera.roll`, `p5.PrintWriter` write/close, `input`/`changed`) [S357].

## In explainer work
Always check the page's version note: many Examples sections were empty in fetches and tutorials may be 1.x [S1][S11].

## Relations
- part_of [[hub-language-core]] (structural)
- related_to [[capability-map]] — counts derived from it [S357]
- related_to [[p5js-1x]] — separate v1 reference [S21]
- related_to [[p5js]] — documents the library [S1]
- related_to [[p5js-2x]] — documents the 2.x line [S363]

## Sources
- [S1] — Reference index (v2)
- [S5] — splineVertex() reference
- [S11] — p5.js-compatibility add-ons
- [S21] — p5.js tutorials index
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
- [S358] — p5.js-website repo, `v1` branch reference (1.x reference; parsed 905 entries)
- [S362] — npm registry metadata for `p5` (dist-tags latest 2.3.4, r1 1.11.13, beta 2.3.1-rc.2; 2.0.0 published 2025-04-17)
- [S363] — p5.js-website `src/globals/p5-version.ts` (p5Version 2.3.3, p5SoundVersion 0.4.1)
