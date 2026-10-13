---
id: p5js-1x
title: "p5.js 1.x"
type: Platform
aliases: ["p5 v1", "r1", "p5.js v1.x freeze", "1.x freeze"]
sources: [S10, S11, S21, S27, S75, S114, S119, S161, S358, S362, S374]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "1.x"
---

# p5.js 1.x

## Definition
**[1.x only]** p5.js 1.x is the previous major line: it stays on the npm dist-tag `r1` (1.11.13) with its reference on the website's `v1` branch (hosted at v1.p5js.org), and its updates were planned to stop at the end of March 2026 [S362][S358][S21][S114].

## Details
- The 1.x reference has 905 entries, 396 global items, 46 class folders and 121 constant pages; 2.x has more core API but far fewer sound classes [S358].
- Release candidates for 1.11.12 to 1.11.14 appeared on the releases page [S119][S10].
- 1.x tutorials use `preload()`, `curveVertex` and numeric `keyCode`; the [[p5js-compatibility]] add-ons restore them on 2.x [S11].
- Art Blocks pins p5 at 1.11.11, so 2.x features are not usable there [S374].
- Community add-ons such as p5.js-svg target 1.11.x without mentioning 2.x [S161].
- Web Editor: a version picker lets a sketch be switched back to 1.x [S27].

> **Conflict:** The compat README says 1.x is supported until August 2026, while the 2.0 dev update lists end of March 2026 as the last 1.x update [S11] vs [S75].

## In explainer work
Use 1.x only to run legacy tutorials or platforms pinned to it; plan the move with [[version-2x-migration]] [S27].

## Relations
- part_of [[hub-language-core]] (structural)
- related_to [[p5js-2x]] — the line that replaced it after the 1.x freeze [S114]
- related_to [[preload]] — characteristic 1.x construct [S11]
- related_to [[curve-api-1x]] — removed 1.x API [S11]
- related_to [[p5js-compatibility]] — bridge to run 1.x code [S11]
- related_to [[p5js]] — parent library [S362]

## Sources
- [S10] — p5.js GitHub releases page (v2.3.1 to v2.3.4)
- [S11] — p5.js-compatibility add-ons
- [S21] — p5.js tutorials index
- [S27] — Teachers' Guide to p5.js v2
- [S75] — [dev updates] p5.js 2.0: You Are Here
- [S114] — Issue #8870 plan to make 2.x the Editor default
- [S119] — Releases page 2 (2.2.3, 2.3.0 RCs, 1.11.12-1.11.14 RCs)
- [S161] — p5.js-svg repo
- [S358] — p5.js-website repo, `v1` branch reference (1.x reference; parsed 905 entries)
- [S362] — npm registry metadata for `p5` (dist-tags latest 2.3.4, r1 1.11.13, beta 2.3.1-rc.2; 2.0.0 published 2025-04-17)
- [S374] — Building Your Project (artist docs)
