---
id: save-frames
title: "saveFrames()"
type: Construct
aliases: ["frame download"]
sources: [S131, S137, S144, S149, S150, S336]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# saveFrames()

## Definition

saveFrames(filename, extension, duration, framerate, [callback]) is the p5 built-in that captures PNG or JPG frames, downloading each file or handing an array of frame objects to a callback **[2.x]**. [S144]

## Details

- Duration is capped at 15 s and framerate at 22 fps to conserve memory, and only png and jpg are supported. [S144][S336]
- With a callback, auto-download is skipped and an array of frame objects is passed instead. [S144]
- The docs warn that large canvases can easily crash the sketch or the browser. [S144]
- It runs in real time and does not pause the draw loop, so the frame count depends on device performance (reported on battery versus mains power); issue #7958 was opened in July 2025 and tagged bug and help wanted. [S149]
- PR #9012 changes it to stop on frame count (duration x fps) instead of a wall-clock timeout; as of 2026-09-27 it is open, the maintainer said it looks alright, and CI awaits approval. **[main / unreleased]** [S150]
- Browsers can block bulk downloads of many frames, so large sequences are better written to disk by Electron, Node or Puppeteer. [S137][S131]

## In explainer work

Because of the 15 s / 22 fps ceiling and real-time pacing, saveFrames is unsuitable for full explainers; use it for short stills runs or switch to [[frame-stepped-export]]. [S336][S149] The 2026 forum asker also named the 15 s limit as a reason to leave it. [S131]

## Relations

- alternative_to [[save-gif]] — GIF built-in that pauses the loop while recording [S149]
- related_to [[frame-stepped-export]] — the deterministic alternative that ignores wall time [S131]
- related_to [[png-sequence-ffmpeg]] — typical downstream encode of saved frames [S131][S137]
- uses [[save-canvas]] — conceptually the repeated single-frame save underneath a stepped export [S131]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S131] — Best way to export an animation from a p5.js sketch in 2026 (Processing Discourse (poster slacle; replies by davepagurek), 2026 (per title))
- [S137] — Export Pipeline (p5js agent-skill reference) (third-party "hermes-agent" skill doc, hosted on a personal domain, undated)
- [S144] — p5.js reference: saveFrames() (p5.js docs, undated)
- [S149] — p5.js issue #7958 saveFrames doesn't honor frame rate (via goodfirstissue.org) (GitHub issue mirror, 2025-07)
- [S150] — p5.js PR #9012 terminate saveFrames by frame count (harshiltewari2004 / ksen0, latest comment 2026-09-27)
- [S336] — `saveFrames()` reference (p5.js, undated)
