---
id: frame-stepped-export
title: "Frame-stepped export"
type: Technique
aliases: ["deterministic capture", "Offline stepped export", "Offline frame-by-frame export", "Offline stepped capture", "manual frame mode", "noLoop/redraw manual stepping", "Frame-accurate export"]
sources: [S9, S129, S130, S131, S137, S138, S144, S146, S148, S149, S233, S272, S308, S338]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# Frame-stepped export

## Definition

Frame-stepped export is the technique of stopping p5's own loop and advancing time by exactly 1/fps per captured frame, so output is identical regardless of how long each frame takes to render. [S146][S308]

## Details

### The recipe
- Seed random and noise, call noLoop(), then advance with redraw(); with noLoop, frameCount advances once per redraw so frames are reproducible. [S137]
- In 2.x redraw(n) returns a Promise you can await until drawing has finished, which makes an async export loop straightforward. **[2.x]** [S9][S338]
- Derive time from the frame index (t = frame / fps), not millis(); millis() counts since sketch start and is wall-clock. [S130][S137]
- A free-running draw loop during screenshots causes duplicate or missing frames when screenshots are slow. [S137]
### Sinks (where each frame goes)
- Built-in saveFrames is real-time and capped at 15 s and 22 fps, so it is not a stepped exporter. [S144][S149]
- p5.capture records after each draw finishes and stays smooth under load; p5.record.js adds an explicit manual frame mode; CCapture steps a virtual clock instead. [S146][S233][S138]
- Heavy runs should write frames outside the browser: Electron/Node, Puppeteer, or a server, because browsers throttle bulk downloads. [S131][S137]
- Unreliable detail: a community Electron sample sets frameCount before redraw, but the reference does not say frameCount is writable, so pass the index into your frame function. [S131][S129]
### Hi-res rules
- 4K can be 1920x1080 with pixelDensity(2) or 3840x2160 with pixelDensity(1); on a 2x display createCanvas already yields 2x pixels, so set pixelDensity explicitly. [S131][S272]
- Encode with libx264, crf 18, yuv420p; yuv420p can crush values below roughly RGB(8,8,8) to black. [S131][S137]
> **Conflict:** several capture libraries are described as unmaintained or untested on 2.x ([S131] vs [S138] for CCapture), so the sink is the part to verify, not the stepping idea.

## In explainer work

This is the final-render path for every explainer: the [[explainer-clock]] switches to export mode, scene code stays a [[pure-function-of-t]], and each frame is handed to [[png-sequence-ffmpeg]] or [[mediabunny]]. [S308][S148] Audio is never captured by these paths, so voiceover is added later by [[audio-post-mux]]. [S137][S138]

## Patterns

### Pattern: stepped export loop
When to use: any final render; scene code must already be pure in t. [S137]
```js
async function exportAll(total, fps) {
  noLoop();
  for (let i = 0; i < total; i++) {
    clock.frame = i; clock.fps = fps;      // clock.now() = frame / fps
    await redraw();                         // 2.x returns a Promise
    await sink(drawingContext.canvas, i);   // server, zip, Mediabunny...
  }
}
```
Pitfalls: do not read millis() or Date in scene code; pick a sink that does not rely on browser downloads. [S9][S137]

## Relations

- uses [[pure-function-of-t]] — requires scene code that depends only on t [S137]
- enables [[png-sequence-ffmpeg]] — produces the numbered frames that ffmpeg encodes [S137]
- uses [[loop-control]] — noLoop() plus redraw() drive the stepping [S9]
- alternative_to [[virtual-clock-capture]] — explicit stepping versus hooking time APIs [S138]
- related_to [[explainer-clock]] — export is one of the three clock modes [S146][S308]
- related_to [[video-export-pipeline]] — the end-to-end blueprint that contains this step [S131]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S9] — redraw() reference (p5.js, undated)
- [S129] — frameCount (p5.js reference, undated)
- [S130] — millis() (p5.js reference, undated)
- [S131] — Best way to export an animation from a p5.js sketch in 2026 (Processing Discourse (poster slacle; replies by davepagurek), 2026 (per title))
- [S137] — Export Pipeline (p5js agent-skill reference) (third-party "hermes-agent" skill doc, hosted on a personal domain, undated)
- [S138] — CCapture.js README (spite (Jaume Sanchez), undated)
- [S144] — p5.js reference: saveFrames() (p5.js docs, undated)
- [S146] — 'I wrote a new library for recording p5.js sketches' (tapioca24, 2022-03-27)
- [S148] — Mediabunny CanvasSource API (Mediabunny docs, undated)
- [S149] — p5.js issue #7958 saveFrames doesn't honor frame rate (via goodfirstissue.org) (GitHub issue mirror, 2025-07)
- [S233] — p5.record.js (limzykenneth, undated)
- [S272] — Basic PPI Question (Processing Discourse, undated)
- [S308] — 'How to save canvas animations with CCapture' (Ibby EL-Serafy, 2019-03-22)
- [S338] — `redraw()` reference (p5.js, undated)
