---
id: millis
title: "millis()"
type: Construct
aliases: ["IO/Time & Date"]
sources: [S127, S130, S137, S138, S139, S255, S256, S357]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# millis()

## Definition
`millis()` returns the milliseconds elapsed since the sketch started running; with asynchronous loading, timing begins when the async code starts [S130].

## Details
- It is a wall-clock reading, so scenes that depend on it differ between runs and machines [S130].
- It sits in the IO/Time and Date group of the reference [S357].
- A simple profiling technique is to wrap suspect code in `millis()` timings and average several runs [S255][S256].
- Community guidance: keep `millis()`, `Date.now` and `deltaTime` out of scene code that will be exported as video [S137].
- CCapture-style libraries get around this by replacing the browser clock with a virtual fixed-step clock [S138].

## In explainer work
A live explainer can map `(millis() - start) / duration` to the playhead, while the export path substitutes `frame / total`; both feed the same frame function [S139] (inference).

## Relations
- part_of [[hub-motion-rendering]] (structural)
- related_to [[delta-time]] — the per-frame sibling [S127][S130]
- conflicts_with [[pure-function-of-t]] — reading it inside scene code makes frames non-reproducible [S137]
- related_to [[virtual-clock-capture]] — such libraries replace the clock [S138]
- related_to [[performance-profiling]] — used for manual timing [S255]

## Sources
- [S127] — deltaTime
- [S130] — millis()
- [S137] — Export Pipeline (p5js agent-skill reference)
- [S138] — CCapture.js README
- [S139] — canvas-sketch: Animated Sketches
- [S255] — Optimizing p5.js Code for Performance (wiki)
- [S256] — Optimizing WebGL Sketches (tutorial)
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
