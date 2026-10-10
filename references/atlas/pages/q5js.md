---
id: q5js
title: "q5.js"
type: Library
aliases: ["q5", "Quinton Ashley"]
sources: [S4, S11, S169, S239]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# q5.js

## Definition

q5.js is Quinton Ashley's lightweight p5-compatible renderer that keeps preload by default and positions itself as more backward compatible than p5 2.x. [S239][S169]

## Details

- Ashley argues the preload removal outdates lessons and tutorials and that sequential awaits can load more slowly; the compatibility add-on allows either preload or async setup, not both. [S239]
- p5play also supports q5 as its renderer. [S169]
- Read the critique with bias: the q5 author is a competitor to p5. [S239]
- Maintenance 2026 and p5 2.x relation: it is an alternative runtime, not a 2.x add-on; no versions were checked here. [S239]

## In explainer work

Consider q5 only when you must keep 1.x-style code and want a smaller runtime; for new explainers stay on p5 2.x with async setup ([[async-setup]]). [S239][S4]

## Relations

- alternative_to [[p5js-2x]] — p5-alike that preserves preload [S239]
- integrates_with [[p5play]] — supported renderer [S169]
- related_to [[preload]] — keeps it by default [S239]
- related_to [[p5js-compatibility]] — the p5-side bridge for the same concern [S239][S11]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S4] — p5.js v2.0.0 release notes (p5.js maintainers, 2025)
- [S11] — p5.js-compatibility add-ons (Processing Foundation, v0.1.2, 15 Apr 2025)
- [S169] — p5play README (v3.35.3) (Quinton Ashley, 2026)
- [S239] — p5.js preload system removed from v2 (Quinton Ashley (q5.js author), Substack, 2025-01-20 (modified 2025-11-19))
