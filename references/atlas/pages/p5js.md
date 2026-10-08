---
id: p5js
title: "p5.js"
type: Platform
aliases: ["p5", "p5.js library"]
sources: [S1, S4, S8, S11, S15, S75, S96, S259, S342, S344, S345, S346, S357, S358, S362, S363]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# p5.js

## Definition
p5.js describes itself as a free, open-source JavaScript library for learning to code and making art, aiming to make sketching with code as intuitive as sketching in a notebook [S342]. It is a JavaScript reinterpretation of Processing, stewarded by the Processing Foundation [S346][S345].

## Details
### Lineage
- The work that became p5.js began in 2013 as a Processing Foundation fellowship led by Lauren Lee McCarthy, who was p5.js Creator and Lead from 2013 to 2020 [S346][S342].
- Processing grew out of John Maeda's Aesthetics and Computation Group and Design By Numbers; Reas and Fry began it in 2001 [S344].
- Kit Kuksenok has been p5.js Lead since 2024; Qianqian Ye has been a Lead since 2021 (on leave) [S342].

### Version lines
- **[2.x]** p5.js 2.0.0 was published 2025-04-17; npm `latest` is 2.3.4 (2026-09-25), and the p5js.org reference documents 2.3.3 [S4][S362][S363].
- **[1.x only]** The previous major line stays on the npm dist-tag `r1` (1.11.13) with its reference on the website's v1 branch [S362][S358]. 1.x received no updates after the end of March 2026 per the maintainers' dev update [S75].
- The 2.x reference has 759 documented entries across 17 top-level sections; see [[capability-map]] [S357].

### Programming model
The language is a small set of ideas: a two-phase lifecycle ([[setup]] then [[draw]]), [[immediate-mode]] drawing, a global [[drawing-state]] machine scoped by [[push-pop]], and a choice of [[global-mode]] or [[instance-mode]] [S8][S15][S96].

## In explainer work
p5.js is a sound base for explainers because a frame can be treated as a pure function of time and state, which makes scrubbing, determinism and frame-by-frame export natural (inference built on the draw-loop semantics) [S8][S259]. Mind the version: most tutorials online are 1.x and use [[preload]] and `curveVertex` [S11].

## Relations
- part_of [[hub-language-core]] (structural)
- authored_by [[lauren-lee-mccarthy]] — creator and lead 2013 to 2020 [S342]
- alternative_to [[processing]] — JavaScript reinterpretation of the Java original [S346]
- maintained_by [[processing-foundation]] — Foundation stewards the library [S345]
- is_a [[sketch-concept]] — programs are called sketches [S344]
- related_to [[p5js-1x]] — frozen previous major line [S362]
- related_to [[p5js-reference]] — official documentation generated from JSDoc [S1]

## Sources
- [S1] — Reference index (v2)
- [S4] — p5.js v2.0.0 release notes
- [S8] — draw() reference
- [S11] — p5.js-compatibility add-ons
- [S15] — push() reference
- [S75] — [dev updates] p5.js 2.0: You Are Here
- [S96] — p5.js wiki: Global and instance mode
- [S259] — p5.Graphics reference
- [S342] — p5.js About
- [S344] — A Modern Prometheus (Processing history)
- [S345] — Processing Foundation: About / History
- [S346] — Fellowships 2013: p5.js
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
- [S358] — p5.js-website repo, `v1` branch reference (1.x reference; parsed 905 entries)
- [S362] — npm registry metadata for `p5` (dist-tags latest 2.3.4, r1 1.11.13, beta 2.3.1-rc.2; 2.0.0 published 2025-04-17)
- [S363] — p5.js-website `src/globals/p5-version.ts` (p5Version 2.3.3, p5SoundVersion 0.4.1)
