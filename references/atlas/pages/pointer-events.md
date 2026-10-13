---
id: pointer-events
title: "Pointer events (2.x)"
type: Capability
aliases: ["Events/Pointer", "pointer API", "touches", "touch array", "1.x touch events (removed)", "touchStarted", "touchMoved", "touchEnded"]
sources: [S4, S10, S11, S89, S91, S92, S102, S107, S357, S358, S385]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# Pointer events (2.x)

## Definition
In p5.js 2.x mouse and touch input are unified through the browser pointer API: mouse handlers also fire for touch and the global `touches` array tracks active pointers, replacing separate 1.x `touchStarted`, `touchMoved` and `touchEnded` **[changed in 2.x]** [S91][S11][S4].

## Details
- Events/Pointer has 22 entries and combines the 1.x Mouse and Touch submodules [S357][S358].
- `touches` entries carry `x`, `y` (canvas-relative), `winX`, `winY` (window-relative) and `id` [S102].
- `mousePressed()` runs on touch start and `mouseClicked()` after `mouseReleased()` or when the touch ends; adding `return false;` prevents browser defaults such as text highlighting [S107][S89].
- 1.x touch events were removed, including from `p5.Element` **[1.x only]** [S11].
- Some mobile browsers may fire press, release and click on a quick tap of a `p5.Element` [S92].
- v2.3.1 fixed `orbitControl` breaking after a touch swipe outside the canvas and `mouseIsPressed` after clicking DOM elements [S10].
- Whether pressure, pointerType, multi-touch gestures or pointer capture are exposed beyond `touches` is not documented in the retrieved pages [S102].

## In explainer work
Write one set of mouse handlers for drag-to-scrub timelines and it works on phones as well [S11]. Shiffman notes the web editor works poorly on mobile and tablet [S385].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- part_of [[module-events]] — Events/Pointer [S357]
- related_to [[mouse-button-object]] — button state is an object in 2.x [S11]
- related_to [[events-keyboard]] — sibling input group [S357]
- related_to [[p5js-compatibility]] — migration table lives there [S11]
- related_to [[version-2x-migration]] — touch-event removal [S11]

## Sources
- [S4] — p5.js v2.0.0 release notes
- [S10] — p5.js GitHub releases page (v2.3.1 to v2.3.4)
- [S11] — p5.js-compatibility add-ons
- [S89] — p5.js reference: mouseClicked()
- [S91] — p5.js-compatibility PR #32 README change
- [S92] — p5.js reference: p5.Element
- [S102] — p5.js reference: touches
- [S107] — p5.js reference: mousePressed()
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
- [S358] — p5.js-website repo, `v1` branch reference (1.x reference; parsed 905 entries)
- [S385] — createCanvas: Interview with Dan Shiffman, part 2
