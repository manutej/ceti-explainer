---
id: mouse-button-object
title: "mouseButton object"
type: Construct
aliases: ["mouseButton", "mouseButton.left"]
sources: [S11, S27, S115, S357]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# mouseButton object

## Definition
In p5.js 2.x `mouseButton` is an object of booleans (`left`, `right`, `center`) allowing simultaneous buttons, replacing the single value compared against `LEFT`/`RIGHT`/`CENTER` in 1.x **[changed in 2.x]** [S11][S27].

## Details
- The Teachers' Guide and compatibility README both list the change [S27][S115].
- Code written for 1.x such as `mouseButton === LEFT` needs updating to `mouseButton.left` in 2.x [S11] (inference from the table).
- `mouseButton` is one of 22 entries in Events/Pointer [S357].
- The compat README treats mouse and touch handling as merged under the pointer API [S11].

## In explainer work
Interactive explainers can use right-button or middle-button actions (pan, reset) simultaneously with left drag [S11] (inference).

## Relations
- part_of [[hub-motion-rendering]] (structural)
- part_of [[pointer-events]] — a member of the pointer group [S357]
- related_to [[version-2x-migration]] — breaking input change [S27]
- related_to [[p5js-compatibility]] — compat README documents it [S11]
- related_to [[events-keyboard]] — sibling change; keyboard codes also changed [S11]

## Sources
- [S11] — p5.js-compatibility add-ons
- [S27] — Teachers' Guide to p5.js v2
- [S115] — p5.js-compatibility README raw (differences list)
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
