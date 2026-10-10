---
id: processingjs
title: "ProcessingJS"
type: Library
aliases: ["Processing.js"]
sources: [S199, S200, S201, S203]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---
# ProcessingJS

## Definition
ProcessingJS (Processing.js) is a JavaScript port of Processing, used in a customised form by Khan Academy for drawing and animation lessons; it is a different lineage from p5.js [S199][S200].

## Details
- Khan Academy's CS curriculum (2012) was built on JavaScript and Processing.js [S199].
- Khan's variant excludes class/extends, restricts images and sounds, and uses degrees for angles by default [S200].
- A 2018 Processing Discourse reply states Khan uses a customised Processing.js [S203].
- Sources conflict on terminology (Processing.js vs "Processing API"), and none confirm any Khan migration to p5.js [S199][S201].

## In explainer work
- Explainer code found in Khan-lineage material uses ProcessingJS idioms (degrees, global functions) that need translation to p5 (e.g. `angleMode(DEGREES)`) (inference from [S200]).

## Relations
- alternative_to [[p5js]] — separate JS port of Processing [S200]
- related_to [[processing]] — ported from Processing [S199]
- related_to [[khan-academy-live-editor]] — Khan's runtime [S201]
- related_to [[hub-people-community]] (structural)
## Sources
- [S199] — Dice
- [S200] — Khan support page
- [S201] — Resig project page
- [S203] — Processing Discourse thread
