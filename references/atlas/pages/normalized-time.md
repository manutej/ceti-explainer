---
id: normalized-time
title: "Normalized time t (playhead)"
type: Concept
aliases: ["playhead", "progress"]
sources: [S80, S135, S137, S139, S387, S401]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# Normalized time t (playhead)

## Definition
Normalized time `t` is a playhead in [0,1), computed as the frame index divided by the total number of frames [S135][S139].

## Details
- Dividing by the total frame count rather than count minus one avoids a duplicated frame at the loop point [S135].
- A full cycle is `t * 2 * PI`, and cosine mapped from (1,-1) to (min,max) starts and ends at the minimum, whereas sine starts mid-range [S135].
- canvas-sketch exposes `playhead` (0..1, only when the duration is fixed) beside `time` in seconds and `frame` as an index, with fps default 30 [S139].
- Scene sequencing: define scenes as start and end on a global t, compute a clamped local progress, apply easing, and fade at boundaries instead of hard cuts [S137].
- The canvas-sketch p5 example takes this approach inside the p5 renderer [S401].

## In explainer work
Everything downstream, including easing, loop phase and camera tracks, takes `t` as input; scrubbing sets `t` directly and export steps it by `1/N` [S139][S137].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- enables [[pure-function-of-t]] — the argument of the pure frame function [S139]
- enables [[loop-phase-animation]] — the loop fraction is the same quantity [S387]
- enables [[easing-functions]] — eased progress is a remap of t [S80]
- related_to [[canvas-sketch]] — provides playhead and time [S139]
- related_to [[scene-local-time]] — scenes compute local progress from it [S137]

## Sources
- [S80] — Easing functions cheat sheet
- [S135] — FOTD: loopsin
- [S137] — Export Pipeline (p5js agent-skill reference)
- [S139] — canvas-sketch: Animated Sketches
- [S387] — Coding Challenge #135 Making a GIF Loop
- [S401] — canvas-sketch example animated-p5.js
