---
id: module-environment
title: "Environment module"
type: Module
aliases: ["Environment", "sketch environment"]
sources: [S1, S4, S17, S18, S127, S348, S357]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# Environment module

## Definition
Environment covers sketch-level information and settings: `cursor`, `frameRate`, `fullscreen`, `pixelDensity`, display and window sizes, `windowResized`, `describe`, `print`, `screenToWorld` and `worldToScreen` [S1]. The 2.x reference has 28 entries, of which `screenToWorld` and `worldToScreen` are new [S357].

## Details
- Members: cursor, deltaTime, describe, describeElement, displayDensity, displayHeight, displayWidth, focused, frameCount, frameRate, fullscreen, getTargetFrameRate, getURL, getURLParams, getURLPath, gridOutput, height, noCursor, pixelDensity, print, textOutput, webglVersion, width, windowHeight, windowResized, windowWidth [S357].
- `screenToWorld()` and `worldToScreen()` convert between 3D and 2D coordinates and are new in 2.0 **[2.x]**; see [[world-to-screen]] [S1][S4].
- `frameRate()` sets a target and returns an approximate current rate; `pixelDensity` defaults to the display density and `pixelDensity(1)` turns that off [S18][S17].
- Accessibility functions live here: [[describe]] and [[text-output]] [S348].
- `deltaTime` is the previous frame's duration in milliseconds [S127].

## In explainer work
Rated **High**: `frameCount` and `deltaTime` drive deterministic timelines, `describe` and `textOutput` add accessibility, and `pixelDensity` controls export resolution [S357].

## Relations
- part_of [[hub-language-core]] (structural)
- part_of [[capability-map]] — top-level reference section [S1]
- uses [[frame-count]] — timeline counter [S357]
- uses [[delta-time]] — real elapsed time [S127]
- uses [[pixel-density]] — export resolution control [S17]
- uses [[describe]] — screen-reader canvas label [S348]
- uses [[world-to-screen]] — 3D to 2D label placement [S1]

## Sources
- [S1] — Reference index (v2)
- [S4] — p5.js v2.0.0 release notes
- [S17] — pixelDensity() reference
- [S18] — frameRate() reference
- [S127] — deltaTime
- [S348] — Writing Accessible Canvas Descriptions (tutorial)
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
