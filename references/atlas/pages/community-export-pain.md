---
id: community-export-pain
title: "Video export as community pain point"
type: Concept
aliases: ["export pain point"]
sources: [S131, S143, S146, S229, S233, S236, S240, S242, S243, S244]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---
# Video export as community pain point

## Definition
Video export is the dominant recurring pain point in p5 community threads: real-time screen recording drops frames, and no p5 built-in gives frame-accurate high-resolution video, so the community converges on frame-stepped capture [S131][S236][S143].

## Details
- A March 2026 asker wanted 4K high-bitrate MP4; real-time capture dropped frames and screen recording topped out at 1600×900 [S131].
- Dave Pagurek replied with p5.record.js manual mode, an Electron wrapper writing PNGs and calling FFmpeg, or server-side rendering via Butter (2K, no 60 fps) [S131].
- The asker said CCapture.js had not been updated in years and `saveFrames` was capped at 15 seconds; no reply addressed CCapture's viability [S131].
- In 2021 a user found OpenProcessing's export heavily compressed; replies recommended CCapture, whose GIF output needs a separate gif.worker.js [S236].
- p5.capture (2022) hooks draw for smooth output but is single-instance, bundler-free and has no WebM in Safari [S146][S244].
- p5.webm-capture captures per frame into WebM, targets Chrome, defaults to 600 frames, and fixed a first/last-frame race in v1.3.2 [S240].
- p5.record.js defaults to WebM and can emit zipped PNG/JPEG/WebP sequences up to 4 GB / 65,535 entries [S233].
- A 2026 comparison positions Remotion, Motion Canvas and Manim as dedicated code-to-video tools, with benchmarks from one laptop [S229].
- The Genuary 2026 vanilla-canvas repo exported frames with `toDataURL` PNG [S242].

> **Conflict:** CCapture.js described as unmaintained for years [S131] vs p5.webm-capture building on ccapture.js 2.0.0 with WebCodecs [S240]; repository status unchecked.

## In explainer work
- Export is a design constraint, not a final step: derive all motion from frame index so slowed-down capture matches playback (see [[pure-function-of-t]], [[frame-stepped-export]]) [S146][S240].
- For 4K or high bitrate, write PNGs to disk and encode with FFmpeg (see [[png-sequence-ffmpeg]], [[video-export-pipeline]]) [S131].
- Recorder compatibility with p5 2.x is undocumented for p5.capture, p5.webm-capture and p5.record.js [S244][S240].
- Optimization guidance (measure first, disable FES, hoist allocations) shortens render time for long exports [S243].

## Relations
- related_to [[p5-capture]] — most-cited recorder [S244]
- related_to [[p5-record]] — recommended manual mode [S131]
- related_to [[ccapture]] — legacy recorder [S236]
- related_to [[electron-ffmpeg-export]] — maintainer-recommended route [S131]
- related_to [[butter]] — server-side option [S131]
- related_to [[dave-pagurek]] — key responder [S131]
- related_to [[open-questions]] — export conflicts listed [S131]
- related_to [[hub-people-community]] (structural)
## Sources
- [S131] — 2026 Discourse export thread
- [S236] — 2021 high-quality video thread
- [S143] — saveGif reference
- [S146], [S244] — p5.capture
- [S240] — p5.webm-capture
- [S233] — p5.record.js
- [S229] — 2026 code-to-video comparison
- [S242] — Genuary 2026 repo
- [S243] — optimization tutorial
