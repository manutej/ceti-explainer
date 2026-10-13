---
id: p5-save-frames
title: "p5.save-frames"
type: Library
aliases: ["save-frames extension"]
sources: [S134, S137, S144]
confidence: low
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# p5.save-frames

## Definition

p5.save-frames is an npm p5 add-on that saves frames without the built-in 15 s cap, in a sync mode that follows the render rate or an async mode with a separate capture rate, packing PNG or JPG into a zip. [S134]

## Details

- It has no duration limit, unlike the built-in saveFrames. [S134][S144]
- It supports only p5 global mode. [S134]
- Maintenance 2026 and p5 2.x compatibility: the source is only an npm package page with no version evidence, so both are unverified. [S134]

## In explainer work

Zip output avoids the browser bulk-download problem, after which the frames go to [[png-sequence-ffmpeg]]. [S134][S137]

## Relations

- alternative_to [[save-frames]] — removes the 15 s duration cap [S134][S144]
- exports_to [[png-sequence-ffmpeg]] — zip of PNG/JPG then ffmpeg [S134]
- related_to [[frame-stepped-export]] — supports a decoupled capture rate [S134]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S134] — p5.save-frames (npm package page, undated)
- [S137] — Export Pipeline (p5js agent-skill reference) (third-party "hermes-agent" skill doc, hosted on a personal domain, undated)
- [S144] — p5.js reference: saveFrames() (p5.js docs, undated)
