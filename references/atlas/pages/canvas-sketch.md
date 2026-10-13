---
id: canvas-sketch
title: "canvas-sketch"
type: Tool
aliases: ["canvasSketch", "mattdesl/canvas-sketch", "canvas-sketch-cli", "canvas-sketch p5 setting", "canvas-sketch hosts p5", "canvas-sketch p5: true setting", "canvas-sketch-cli --stream"]
sources: [S139, S140, S399, S400, S401, S402]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# canvas-sketch

## Definition

canvas-sketch is Matt DesLauriers' framework that owns the frame loop, sizing and export and makes no assumptions about the drawing library; it has the only first-party p5 example, animated-p5.js. [S399][S400][S401]

## Details

- A render function receives time (seconds), playhead (0 to 1 when duration is fixed), frame index and fps (default 30). [S139]
- The p5 example sets p5: true, animate: true, a 6-second duration and context 'webgl', instantiates p5 into global scope and draws with playhead; which p5 major it targets was not checked, so 2.x compatibility is unverified. [S401][S400]
- Export: Cmd/Ctrl+Shift+S records zero-padded numbered PNGs; canvas-sketch-cli --stream pipes to ffmpeg for MP4 or --stream=gif for GIF, needing ffmpeg, canvas-sketch 0.5.x+ and CLI 1.10.1+. [S140]
- Endless animations with no duration export frames forever; other bundlers fall back to less optimal browser downloads. [S140]
- Experimental Node mode may not work with WebGL and p5. [S140]
- It suggests recording a git commit hash or seed in the export filename for reproducibility. [S140]
- The installation docs show a three.js starter template and no p5 template. [S402]
- Maintenance 2026: undated docs; the p5 example is unversioned. [S399]

## In explainer work

canvas-sketch is the lowest-friction route to a playhead-driven, ffmpeg-streamed p5 render today, and it models the same normalised-t idea as [[normalized-time]] and [[pure-function-of-t]]. [S401][S139] Compare [[png-sequence-ffmpeg]]. [S140]

## Relations

- integrates_with [[p5js]] — documented first-party example [S400][S401]
- exports_to [[ffmpeg]] — --stream pipes frames to ffmpeg for MP4/GIF [S140]
- authored_by [[matt-deslauriers]] — author [S140]
- demonstrates [[normalized-time]] — playhead is a normalised loop position [S139][S401]
- conflicts_with [[p5-node]] — Node mode may not work with p5 [S140]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S139] — canvas-sketch: Animated Sketches (Matt DesLauriers, undated)
- [S140] — canvas-sketch: Exporting Artwork (Matt DesLauriers, undated)
- [S399] — canvas-sketch docs README (Matt DesLauriers, undated)
- [S400] — canvas-sketch docs, WebGL/Three.js/P5.js section (Matt DesLauriers, undated)
- [S401] — canvas-sketch example animated-p5.js (Matt DesLauriers, undated)
- [S402] — canvas-sketch docs, Installation (Matt DesLauriers, undated)
