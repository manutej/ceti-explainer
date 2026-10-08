---
id: electron-ffmpeg-export
title: "Electron + ffmpeg export"
type: Technique
aliases: ["Electron frame export", "Electron export wrapper", "Electron wrapper", "Node bridge export"]
sources: [S131, S137, S238]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# Electron + ffmpeg export

## Definition

Electron plus ffmpeg export is davepagurek's client-work setup: run the sketch in Electron, save each canvas frame as a PNG through Node, then run ffmpeg afterwards. [S131]

## Details

- The sample renders at 1920x1080 with pixelDensity(2), saves each frame via toDataURL as PNG, and calls ffmpeg with libx264, crf 18, yuv420p. [S131]
- Each frame is tied to its index (set frameCount, redraw, wait a requestAnimationFrame, save canvas) rather than wall-clock time. [S131]
- davepagurek says it gives full control over mixing and quality via ffmpeg. [S131]
- Thread pitfalls named: Node does not expand `~` in paths, and pixelDensity changes the output size. [S131]
- The official Processing p5.js Mode is Electron-based and can call Node and ffmpeg, but its experimental 2.x version had platform problems in May 2026. [S131][S238]

## In explainer work

Choose it for 4K or 60 fps on weak hardware or whenever browser downloads would throttle; it is the offline half of [[frame-stepped-export]] feeding [[png-sequence-ffmpeg]]. [S131][S137]

## Relations

- uses [[ffmpeg]] — encodes the saved PNGs [S131]
- demonstrates [[dave-pagurek]] — described by the p5 contributor in the 2026 thread [S131]
- related_to [[processing-p5-mode]] — Processing p5.js Mode offers Electron with Node and ffmpeg access [S131]
- alternative_to [[puppeteer-capture]] — Electron renderer versus headless Chrome driver [S131][S137]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S131] — Best way to export an animation from a p5.js sketch in 2026 (Processing Discourse (poster slacle; replies by davepagurek), 2026 (per title))
- [S137] — Export Pipeline (p5js agent-skill reference) (third-party "hermes-agent" skill doc, hosted on a personal domain, undated)
- [S238] — How to manually modify the P5js plugin (stable version) to use the 2.0 version? (Processing Discourse (EricRogerGarcia, glv, quark), 2026-05-14 to 2026-06-01)
