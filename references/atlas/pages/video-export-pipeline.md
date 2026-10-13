---
id: video-export-pipeline
title: "Video export pipeline"
type: Concept
aliases: ["export decision tree"]
sources: [S9, S10, S131, S132, S134, S135, S136, S137, S138, S140, S141, S143, S144, S145, S146, S147, S148, S149, S150, S151, S152, S153, S155, S159, S233, S272, S308, S310, S317, S338, S401, S405]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# Video export pipeline

## Definition

The video export pipeline is the end-to-end route from a deterministic p5 sketch to a finished MP4 or GIF: pre-flight, frame driver, frame sink, encode, audio mux and verification; no p5 built-in gives frame-accurate 4K/60 video, so the pipeline is offline and frame-stepped. [S131][S144][S143]

## Details

### Why built-ins are not enough
- saveGif is the only built-in that pauses the draw loop while recording, but it is GIF-only (256 colours) and had black-first-frame problems in 2.x. [S143][S149][S151]
- saveFrames is real-time, capped at 15 s and 22 fps, and drops frames on slow or throttled machines (issue #7958; fix PR #9012 still open as of 2026-09-27). [S144][S149][S150]
- Real-time screen recording and real-time recorder modes drop frames: a March 2026 forum user reported this for saveGif quality, p5.capture real-time mode and screen recording. [S131]
- For 4K/60 on a weak machine the community consensus in that thread is PNG sequence plus ffmpeg, or Electron or server-side stepping. [S131]
### Pipeline stages
1. Pre-flight: make the sketch a [[pure-function-of-t]] (frameCount- or index-based, never millis()), seed randomSeed and noiseSeed, set pixelDensity explicitly, choose size, and pin the p5 version. [S137][S272][S405]
2. Frame driver: noLoop(), then redraw() per frame; in 2.x await it. **[2.x]** [S9][S338]
3. Frame sink: write each canvas to PNG, a zip, a stream or a WebCodecs encoder. [S131][S148][S134]
4. Encode: ffmpeg libx264, crf 18, yuv420p, or in-browser MP4/WebM. [S137][S138]
5. Audio: mux the voiceover after rendering. [S137]
6. Verify: check frame count, dark gradients, loop seam and sync (below). [S137][S135]
### Route chooser
- Short seamless loop (up to a few seconds, modest size): [[save-gif]] or compute progress yourself ([[p5-create-loop]] is frozen, 1.x-era). [S143][S141][S135]
- Existing time-based sketch you will not refactor: [[ccapture]] / [[virtual-clock-capture]]. [S138]
- Existing frameCount-based sketch, quick WebM/MP4 from the browser: [[p5-capture]] (draw-hooked) or [[p5-record]] (manual per-frame mode). [S146][S233]
- Final 1080p to 4K deliverable: [[png-sequence-ffmpeg]] via [[electron-ffmpeg-export]], [[puppeteer-capture]] or [[canvas-sketch]] streaming. [S131][S137][S140]
- No ffmpeg, in-browser MP4: [[mediabunny]] CanvasSource over [[webcodecs]]. [S148][S147]
- Hosted stepping: [[butter]], limited to 2K and no 60 fps (Mar 2026). [S131]
- Quick narrated take with audio, accepting real-time pacing: [[p5-videorecorder]]. [S310]
- Node-only p5 rendering ([[p5-node]]): only 2021 evidence, 1.x era; treat as unsupported. [S153][S140]
### Settings cheat sheet
- 4K options: 1920x1080 with pixelDensity(2), or 3840x2160 with pixelDensity(1); on a 2x display createCanvas already yields 2x pixels. [S131][S137][S272]
- Typical encode: `ffmpeg -framerate 60 -i frame-%04d.png -c:v libx264 -crf 18 -pix_fmt yuv420p out.mp4`. [S137][S131]
- Audio mux: `ffmpeg -i v.mp4 -i vo.wav -c:v copy -c:a aac -shortest out.mp4`. [S137]
- GIF: two-pass palette recipe, and keep near 640x360; 2.3.3 added MAX_GIF_PIXELS (default 16,000,000). **[2.x]** [S137][S10]
- Loops: divide by total frames, not total minus one, to avoid a duplicated frame at the seam. [S135][S136]
### Troubleshooting
- Duplicate or missing frames: the live loop ran ahead of slow screenshots; use noLoop() and a ready flag. [S137]
- Dark values crushed to black: yuv420p; check below RGB(8,8,8). [S137]
- Output size differs by machine: pixelDensity not set. [S272]
- Browser blocks bulk downloads: use zip, Electron or Puppeteer. [S137][S134]
- Editor auto-refresh kills a capture; run locally. [S132]
- Audio out of sync: capture is on simulated time; mux afterwards. [S137][S138]
- Odd canvas sizes: CCapture mp4 auto-adjusts odd canvas sizes to even. [S138]

## Library status matrix (2026)

- p5.capture: npm 1.6.1 (2026-04-15); README gives no p5 version or releases; 2.x compatibility not stated; WebM unsupported in Safari. [S159][S145]
- CCapture.js: README describes WebCodecs mp4/webm and gifenc, a forum poster says unmaintained and p5 0.9.0-era; 2.x not stated (disputed). [S138][S131]
- p5.record.js: manual-frame mode recommended by davepagurek; 2.x and maintenance unverified. [S233][S131]
- p5.save-frames: npm only, no version evidence. [S134]
- p5.createLoop: last patch 2023, p5 1.2-era, script tags only. [S141]
- p5.videorecorder: real-time MediaRecorder, status unstated. [S310]
- canvas-capture: 287 commits, no releases, vendors CCapture fork, MP4 via ffmpeg.wasm. [S152]
- Mediabunny: live successor to deprecated mp4-muxer; consumes a plain canvas so p5 version is irrelevant. [S147][S148]
- canvas-sketch: p5 example unversioned; Node mode may not work with p5. [S401][S140]

## Reference driver sketches

#### Browser stepped loop (2.x)
```js
async function exportAll(total, fps) {
  noLoop(); clock.mode = 'export'; clock.fps = fps;
  for (clock.frame = 0; clock.frame < total; clock.frame++) {
    await redraw();
    await sink(drawingContext.canvas, clock.frame);
  }
}
```
This relies on the Promise-returning redraw(). **[2.x]** [S338][S9]
#### Headless Chrome driver (own illustrative Node sketch)
```js
// Node: open the page, wait for window._p5Ready, then for each frame:
await page.evaluate(async i => { window.frameIndex = i; await redraw(); }, i);
const el = await page.$('canvas');
await el.screenshot({ path: `frame-${String(i).padStart(4, '0')}.png` });
```
The ready-flag handshake and redraw-per-frame loop come from the third-party skill doc; the code is a sketch, not that doc's. [S137]

## Verification checklist

- Scrub to frame N in the preview and compare with exported frame N; any difference means a second clock leaked in. [S308][S137]
- Count frames: expected `ceil(duration * fps)`; no duplicates. [S137]
- Inspect dark gradients after yuv420p. [S137]
- For loops, confirm the last frame is not equal to the first. [S135][S136]
- Confirm the pinned p5 version in the page and record it beside the export. [S405][S140]

## Gaps

- No end-to-end published 4K/60 benchmark with timings was found. [S131]
- Not verified at all: raw MediaRecorder/captureStream behaviour, webm-muxer status, Playwright specifics, headless GPU screenshot performance, 4K canvas memory limits, Mediabunny audio-source API and browser H.264 limits. [S155][S148]
- saveGif units semantics and any 2.x changes beyond PR #8130 are undocumented; PR #8130 merge status is unverified. [S143][S151]
- The Hermes skill doc is third-party and unattributed; its recipes are plausible but not authoritative. [S137]
> **Conflict:** CCapture maintenance is described as stale in a March 2026 thread [S131] but as WebCodecs-capable in its current README [S138].

## Relations

- uses [[frame-stepped-export]] — core technique [S131]
- uses [[png-sequence-ffmpeg]] — default endpoint [S131][S137]
- uses [[ffmpeg]] — encoder [S137]
- uses [[audio-post-mux]] — sound stage [S137]
- related_to [[save-gif]] — built-in GIF route [S143]
- related_to [[save-frames]] — built-in frame route [S144]
- related_to [[ccapture]] — virtual-clock recorder [S138]
- related_to [[p5-capture]] — draw-hooked recorder [S146]
- related_to [[p5-record]] — manual-frame recorder [S233]
- related_to [[electron-ffmpeg-export]] — disk-direct frames [S131]
- related_to [[puppeteer-capture]] — headless driver [S137]
- related_to [[mediabunny]] — in-browser encoder [S148]
- related_to [[canvas-sketch]] — streaming host [S140]
- related_to [[explainer-engine-blueprint]] — scene side of the same contract [S317]
- related_to [[butter]] — hosted option [S131]
- related_to [[p5-videorecorder]] — real-time recorder [S310]
- related_to [[p5-node]] — unsupported route [S153]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S9] — redraw() reference (p5.js, undated)
- [S10] — p5.js GitHub releases page (v2.3.1 to v2.3.4) (p5.js maintainers, Jul to 25 Sep (2.3.x))
- [S131] — Best way to export an animation from a p5.js sketch in 2026 (Processing Discourse (poster slacle; replies by davepagurek), 2026 (per title))
- [S132] — How to export your p5.js as a video (UAL Creative Computing Institute Lab, undated)
- [S134] — p5.save-frames (npm package page, undated)
- [S135] — FOTD: loopsin (Keith Peters (BIT-101), 2024-01-27)
- [S136] — Looping Noise Part 1: Ending at the Beginning (Simon Alexander-Adams (Polyhop), TouchDesigner community, 2019-11-24)
- [S137] — Export Pipeline (p5js agent-skill reference) (third-party "hermes-agent" skill doc, hosted on a personal domain, undated)
- [S138] — CCapture.js README (spite (Jaume Sanchez), undated)
- [S140] — canvas-sketch: Exporting Artwork (Matt DesLauriers, undated)
- [S141] — p5.createLoop (Petey Hayman, README mentions 0.3.0 dated 04/02/2023)
- [S143] — p5.js reference: saveGif() (p5.js docs (page links v2.3.3 source), undated)
- [S144] — p5.js reference: saveFrames() (p5.js docs, undated)
- [S145] — tapioca24/p5.capture README (tapioca24, undated)
- [S146] — 'I wrote a new library for recording p5.js sketches' (tapioca24, 2022-03-27)
- [S147] — Vanilagy/mp4-muxer README (Vanilagy, undated)
- [S148] — Mediabunny CanvasSource API (Mediabunny docs, undated)
- [S149] — p5.js issue #7958 saveFrames doesn't honor frame rate (via goodfirstissue.org) (GitHub issue mirror, 2025-07)
- [S150] — p5.js PR #9012 terminate saveFrames by frame count (harshiltewari2004 / ksen0, latest comment 2026-09-27)
- [S151] — p5.js PR #8130 saveGif black initial frames in 2.0+ (GitHub contributor, undated)
- [S152] — amandaghassaei/canvas-capture README (Amanda Ghassaei, undated (footer 2026))
- [S153] — Discourse: server-side render using node-canvas (DCsan, micuat, 2021-04-05)
- [S155] — Search listing only (not opened): canvas-record WebCodecsEncoder, Mediabunny quick-start/writing-media-files, p5.save-frames on npm, abachman/p5.webm-capture, p5.createLoop on npm (URLs in search results of 2026-10-08, kind: community (unverified))
- [S159] — npm registry metadata (p5, p5.sound, p5.brush, p5.grain, p5.js-svg, p5.fillgradient, p5play, tone, ml5, p5.collide2d, p5.createloop, p5.capture, p5.plotsvg, p5.tree, matter-js, roughjs) (npm, queried 2026-10-08)
- [S233] — p5.record.js (limzykenneth, undated)
- [S272] — Basic PPI Question (Processing Discourse, undated)
- [S308] — 'How to save canvas animations with CCapture' (Ibby EL-Serafy, 2019-03-22)
- [S310] — p5.videorecorder README (Caleb Foss, undated)
- [S317] — Remotion 'CSS animations' troubleshooting (Remotion, undated)
- [S338] — `redraw()` reference (p5.js, undated)
- [S401] — canvas-sketch example animated-p5.js (Matt DesLauriers, undated)
- [S405] — p5.js Download page (p5.js team, undated)
