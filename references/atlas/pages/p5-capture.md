---
id: p5-capture
title: "p5.capture"
type: Library
aliases: ["P5Capture", "tapioca24/p5.capture"]
sources: [S131, S145, S146, S154, S159, S244, S300]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# p5.capture

## Definition

p5.capture (tapioca24) is a GUI plus P5Capture API recorder that hooks p5's draw and records each rendered frame as WebM, GIF, MP4, or zipped PNG/JPG/WebP. [S145][S146]

## Details

- Options include framerate (default 30), bitrate (MP4 only, default 5000 kbps), quality, width, height and duration in max frames; setDefaultOptions must run before p5 initialises. [S145][S146]
- It works with global mode; instance mode supports only one instance and module bundlers are unsupported. [S145]
- WebM is the default format and is not supported in Safari per its compatibility table. [S145]
- It adds a frame only after draw finishes, so exported video plays smoothly even when live rendering stutters. [S146]
- It does not control millis() or deltaTime, so a sketch that reads wall time can still export wrongly. [S244]
- Maintenance 2026: npm 1.6.1 published 2026-04-15 bundling gif.js, webm-writer and h264-mp4-encoder; the GitHub README has no version statement, an empty Releases section, 208 commits and 12 open issues. [S159][S145]
- p5 2.x compatibility: not stated; the README install snippet loads p5 unpinned and references 1.6.1, and the p5 libraries directory marks no export library as v2-compatible. [S145][S300]
- A March 2026 forum user on a very old laptop found its real-time video mode dropped frames at high quality. [S131]

## In explainer work

Use p5.capture on frameCount-driven sketches so output is reproducible; the UAL guide starts capture at frameCount 1 and saves at the end of draw(). [S159][S154] It is a draw-hooked recorder, not a virtual clock, so determinism still depends on [[pure-function-of-t]] scene code. [S244]

## Relations

- alternative_to [[ccapture]] — draw-hooked recorder versus virtual-clock recorder [S146]
- alternative_to [[save-frames]] — records smoothly after each draw rather than in real time [S146]
- exports_to [[png-sequence-ffmpeg]] — PNG-in-ZIP mode feeds an ffmpeg encode [S145]
- authored_by [[tapioca24]] — announced 2022-03-27 on dev.to [S146]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S131] — Best way to export an animation from a p5.js sketch in 2026 (Processing Discourse (poster slacle; replies by davepagurek), 2026 (per title))
- [S145] — tapioca24/p5.capture README (tapioca24, undated)
- [S146] — 'I wrote a new library for recording p5.js sketches' (tapioca24, 2022-03-27)
- [S154] — UAL Creative Computing Institute wiki: export p5 as a video (UAL, undated)
- [S159] — npm registry metadata (p5, p5.sound, p5.brush, p5.grain, p5.js-svg, p5.fillgradient, p5play, tone, ml5, p5.collide2d, p5.createloop, p5.capture, p5.plotsvg, p5.tree, matter-js, roughjs) (npm, queried 2026-10-08)
- [S244] — p5.capture README v1.6.1 (library README on jsDelivr, undated)
- [S300] — p5.js Community Libraries directory (Processing Foundation, undated (accessed 2026-10-08))
