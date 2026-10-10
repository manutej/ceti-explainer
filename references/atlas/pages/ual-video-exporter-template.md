---
id: ual-video-exporter-template
title: "UAL CCI video exporter template"
type: Work
aliases: ["Video Exporter Template"]
sources: [S131, S132, S233]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---
# UAL CCI video exporter template

## Definition
The UAL Creative Computing Institute video exporter template is a p5 web-editor template that captures WebM via CCapture.js with webm-writer and download.js [S132].

## Details
- It captures at 60 fps by starting at frameCount 1 and saving at a set capture length [S132].
- It warns to turn off editor auto-refresh, which can crash capture, and its variable naming (capture vs capturer) is inconsistent [S132].
- The page is undated (about three years old per the page), so it likely targets 1.x-era p5 (inference) [S132].
- CCapture.js was described in a 2026 thread as not updated in years; its actual maintenance status is unverified [S131].

## In explainer work
- Workable for quick WebM exports, but for current explainer work prefer maintained recorders or manual frame stepping (see [[p5-capture]], [[p5-record]], [[frame-stepped-export]]) [S131][S233].

## Relations
- uses [[ccapture]] — capture library [S132]
- uses [[p5js-web-editor]] — template host [S132]
- related_to [[community-export-pain]] — community workaround [S131]
- related_to [[hub-people-community]] (structural)
## Sources
- [S132] — UAL CCI wiki page
- [S131] — 2026 export thread
- [S233] — p5.record.js
