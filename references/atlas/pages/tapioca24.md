---
id: tapioca24
title: "tapioca24"
type: Practitioner
aliases: ["p5.capture author"]
sources: [S145, S146, S244]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---
# tapioca24

## Definition
tapioca24 is the author of [[p5-capture]], the most-cited frame-accurate recorder for p5 sketches, announced in March 2022 [S146][S244].

## Details
- tapioca24 wrote p5.capture because existing recorders had too many steps and restrictions for sharing on social media [S146].
- p5.capture hooks p5's draw and records each rendered frame, so output stays smooth when live rendering is choppy [S145][S244].
- It exports WebM (default, not in Safari), GIF, MP4 and zipped PNG/JPG/WebP; framerate defaults to 30 [S244].
- Limits: single instance only, no instance-mode multiples, no module bundlers [S244].

## In explainer work
- p5.capture is the default "don't screen-record" answer in community threads, but its README lists no p5 version range, so 2.x compatibility is unverified (inference) [S244].
- It captures after each draw but does not control `millis()`, so wall-clock sketches still export wrong — pair it with [[frame-stepped-export]] discipline [S244].

## Relations
- authored_by [[p5-capture]] — inverse: author [S146]
- related_to [[community-export-pain]] — library built to address it [S146]
- related_to [[frame-stepped-export]] — implements per-draw capture [S145]
- related_to [[hub-people-community]] (structural)
## Sources
- [S146] — dev.to announcement
- [S244] — p5.capture README v1.6.1
- [S145] — p5.capture GitHub README
