---
id: tone-js
title: "Tone.js"
type: Library
aliases: ["Tone"]
sources: [S156, S158, S159, S330, S405]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# Tone.js

## Definition

Tone.js is the Web Audio framework (by Yotam Mann) that the rebuilt p5.sound.js wraps; npm 15.1.22 was published 2025-04-27 and the package was modified on 2026-10-04. [S158][S159]

## Details

- p5.sound 0.4.1 depends on tone ^15.0.2. [S159]
- Direct Tone.js use with p5 beyond p5.sound's wrapping was not researched. [S159]
- The Download page points users to p5.sound 0.4.1 on the CDN for 2.x. [S405]

## In explainer work

For explainers it is the engine under any sound design; sync strategy still follows [[audio-master-clock]]. [S158][S330]

## Relations

- related_to [[p5-sound]] — wrapped by it [S158]
- related_to [[audio-master-clock]] — audio clock source [S330]
- related_to [[p5js-libraries-directory]] — not among directory entries returned [S156]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S156] — p5.js Libraries page (Processing Foundation/p5.js, checked 2026-10-08)
- [S158] — p5.sound.js repo (Processing Foundation, undated)
- [S159] — npm registry metadata (p5, p5.sound, p5.brush, p5.grain, p5.js-svg, p5.fillgradient, p5play, tone, ml5, p5.collide2d, p5.createloop, p5.capture, p5.plotsvg, p5.tree, matter-js, roughjs) (npm, queried 2026-10-08)
- [S330] — Theatre.js 'Using Audio' (Theatre.js, undated)
- [S405] — p5.js Download page (p5.js team, undated)
