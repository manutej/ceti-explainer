---
id: hi-res-render
title: "High-resolution offline render"
type: Pattern
aliases: ["Hi-res offline render", "4K render"]
sources: [S131, S137, S271, S272, S273, S336]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# High-resolution offline render

## Definition
High-resolution offline render produces 4K-class video by rendering each frame at its own pace at a fixed canvas size and density, saving PNGs, then encoding with FFmpeg [S131][S273].

## Details
- Community example: `createCanvas(1920,1080)` with `pixelDensity(2)` as a 4K-equivalent render, then FFmpeg with libx264, `yuv420p`, `crf 18` [S131].
- Reported problems with real-time routes: `saveGif` poor quality, p5.capture real-time mode dropping frames at high quality, screen recording dropping frames, CCapture.js reportedly unmaintained for about 8 years and `saveFrames` limited to 15 seconds (one poster's claims) [S131].
- The `saveFrames` reference states the cap as 15 seconds and 22 fps [S336].
- Electron lets a sketch write frames directly to disk and call FFmpeg from Node, avoiding browser download limits [S131].
- Offline rendering lets each frame take as long as needed, which suits slow machines [S131].
- Processing practice: time-independent animation so dropped frames do not distort timing [S273].
- No official benchmark covers 4K canvases; a low-confidence community table puts per-pixel `noise()` at roughly 140 ms for 3840x2160 [S271].

## In explainer work
Drive the scene from `t = frame / fps`, never wall time, and set density explicitly [S131][S272].

## Patterns
```js
function setup() { createCanvas(1920, 1080); pixelDensity(2); frameRate(30); noLoop(); }
function renderFrame(f) { const t = f / 30; /* draw using t */ saveCanvas('f' + nf(f, 5), 'png'); }
// ffmpeg -framerate 30 -i f%05d.png -c:v libx264 -pix_fmt yuv420p -crf 18 out.mp4
```
Pitfalls: browser download throttling (use Electron or p5.capture PNG mode); yuv420p can crush very dark values [S131][S137].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- depends_on [[fixed-timestep]] — constant step per frame [S131]
- depends_on [[pixel-density]] — pin output size [S272]
- exports_to [[ffmpeg]] — encoding step [S131]
- related_to [[video-export-pipeline]] — full pipeline hub [S131]
- related_to [[electron-ffmpeg-export]] — disk-direct frames [S131]
- related_to [[save-frames]] — capped built-in route [S336]

## Sources
- [S131] — Best way to export an animation from a p5.js sketch in 2026
- [S137] — Export Pipeline (p5js agent-skill reference)
- [S271] — Troubleshooting (p5js skill reference)
- [S272] — Basic PPI Question
- [S273] — Exporting video in Processing
- [S336] — `saveFrames()` reference
