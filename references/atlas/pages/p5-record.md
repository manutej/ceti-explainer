---
id: p5-record
title: "p5.record.js"
type: Library
aliases: ["Manual-frame recorder"]
sources: [S131, S233, S338]
confidence: low
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# p5.record.js

## Definition

p5.record.js (limzykenneth) is a community p5 add-on that records sketches to WebM or image-sequence ZIPs and has a manual per-frame mode tied to draw(). [S233]

## Details

- Manual mode ties each recorded frame to a draw() call, suiting noLoop()/redraw() sketches, so slow rendering does not drop frames. [S233][S131]
- It defaults to WebM (VP8) and can emit PNG, JPEG or WebP sequences as an uncompressed ZIP limited to 4 GB and 65,535 entries. [S233]
- It has no dependencies beyond p5.js and is BSD-3-Clause; manual mode works only in supported browsers. [S233]
- davepagurek recommended it in the March 2026 thread for its manual frame capture mode. [S131]
- Maintenance 2026 and p5 2.x compatibility: not stated in the fetched README; the repo was reached only through the author's page, so treat 2.x support as unverified. [S233]

## In explainer work

Manual mode is the closest p5-native equivalent of a deterministic exporter: advance your clock, call redraw(), then record exactly one frame (see [[frame-stepped-export]]). [S233][S338]

## Relations

- enables [[frame-stepped-export]] — manual mode ties one capture to one draw call [S233]
- depends_on [[frame-stepped-export]] — built around noLoop()/redraw() manual stepping [S233]
- alternative_to [[ccapture]] — manual stepping instead of virtual-clock hooks [S131]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S131] — Best way to export an animation from a p5.js sketch in 2026 (Processing Discourse (poster slacle; replies by davepagurek), 2026 (per title))
- [S233] — p5.record.js (limzykenneth, undated)
- [S338] — `redraw()` reference (p5.js, undated)
