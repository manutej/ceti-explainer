---
id: save-canvas
title: "saveCanvas()"
type: Construct
aliases: []
sources: [S129, S131, S137, S144]
confidence: low
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# saveCanvas()

## Definition

saveCanvas() is the p5 built-in that exports a single canvas frame as an image file **[2.x]**; stepped exporters call it once per frame. [S131]

## Details

- The 2026 forum asker was unsure of its limits and received no answer in the thread, so the sources give no documented cap. [S131]
- A stepped-export sketch can call saveCanvas with a zero-padded name such as f0001 for each redraw, then encode with ffmpeg. [S131]
- Bulk browser downloads can be throttled or blocked, so sketches producing thousands of frames should hand blobs to a local server, Electron or Puppeteer instead. [S137][S131]
- A community export sample assigns frameCount before each redraw even though the frameCount reference does not say it is writable; pass the frame index into the draw function instead. [S131][S129]

## In explainer work

Treat saveCanvas as the simplest sink for [[frame-stepped-export]] on small runs, and the part that fails first at scale. [S131][S137] Pair it with [[png-sequence-ffmpeg]] for assembly. [S137]

## Relations

- part_of [[frame-stepped-export]] — the per-frame save step of the stepped loop [S131]
- related_to [[save-frames]] — built-in multi-frame cousin with 15 s / 22 fps caps [S144]
- related_to [[png-sequence-ffmpeg]] — frames saved this way are assembled with ffmpeg [S137]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S129] — frameCount (p5.js reference, undated)
- [S131] — Best way to export an animation from a p5.js sketch in 2026 (Processing Discourse (poster slacle; replies by davepagurek), 2026 (per title))
- [S137] — Export Pipeline (p5js agent-skill reference) (third-party "hermes-agent" skill doc, hosted on a personal domain, undated)
- [S144] — p5.js reference: saveFrames() (p5.js docs, undated)
