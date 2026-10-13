---
id: png-sequence-ffmpeg
title: "PNG sequence + ffmpeg"
type: Technique
aliases: ["image-sequence assembly"]
sources: [S131, S137, S140, S272, S273]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# PNG sequence + ffmpeg

## Definition

PNG sequence plus ffmpeg is the technique of rendering numbered frames offline and encoding them with ffmpeg (libx264, yuv420p), the route the 2026 community consensus names for 4K/60 on weak hardware. [S131][S137]

## Details

- A representative encode is `ffmpeg -framerate 60 -i frame-%04d.png -c:v libx264 -crf 18 -pix_fmt yuv420p out.mp4`; one recipe adds preset slow. [S137][S131]
- The 2026 asker wanted 4K, 30 or 60 fps, high-bitrate MP4 on a weak laptop and judged PNG sequence plus ffmpeg the best option. [S131]
- For 4K use pixelDensity(1) with an explicit 3840x2160 canvas; larger output can tile with ImageMagick montage. [S137]
- yuv420p can crush dark values below about RGB(8,8,8) to black, and tens of thousands of PNGs need disk space. [S137]
- Brendan Dawes makes the same case for Processing: use time-independent animation so dropped frames in export do not distort timing. [S273]
- canvas-sketch exports zero-padded numbered frames by default, matching this layout. [S140]
- An exported frame at pixelDensity 2 on a 1920x1080 canvas gives 3840x2160 pixels. [S131][S272]

## In explainer work

This is the dependable endpoint of [[frame-stepped-export]]: PNGs are lossless, tool-agnostic and let ffmpeg mix audio later ([[audio-post-mux]]). [S131][S137] Frames can be produced by [[electron-ffmpeg-export]], [[puppeteer-capture]] or [[canvas-sketch]]. [S131][S137][S140]

## Patterns

### Pattern: PNG sequence to 4K H.264
When to use: final deliverable, any resolution.
```js
// render side: name frames with zero padding
saveCanvas('frame-' + nf(i, 4), 'png');
// shell side:
// ffmpeg -framerate 60 -i frame-%04d.png -c:v libx264 -crf 18 -pix_fmt yuv420p out.mp4
```
Pitfalls: set pixelDensity explicitly so output size is the same on every machine; check dark gradients after yuv420p. [S137][S272]

## Relations

- uses [[ffmpeg]] — libx264 encode of the numbered frames [S137]
- enables [[audio-post-mux]] — a silent video is muxed with voiceover afterwards [S137]
- related_to [[electron-ffmpeg-export]] — one way to write the frames to disk [S131]
- related_to [[puppeteer-capture]] — another way to write the frames to disk [S137]
- related_to [[video-export-pipeline]] — step of the full pipeline [S131]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S131] — Best way to export an animation from a p5.js sketch in 2026 (Processing Discourse (poster slacle; replies by davepagurek), 2026 (per title))
- [S137] — Export Pipeline (p5js agent-skill reference) (third-party "hermes-agent" skill doc, hosted on a personal domain, undated)
- [S140] — canvas-sketch: Exporting Artwork (Matt DesLauriers, undated)
- [S272] — Basic PPI Question (Processing Discourse, undated)
- [S273] — Exporting video in Processing (Brendan Dawes, undated)
