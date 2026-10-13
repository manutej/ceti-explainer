---
id: p5-create-loop
title: "p5.createLoop"
type: Library
aliases: ["createLoop", "Petey Hayman", "peteyhayman"]
sources: [S135, S141, S159, S300]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "1.x only"
---

# p5.createLoop

## Definition

p5.createLoop (Petey Hayman) adds createLoop() to p5, exposing a seamless-loop clock as progress (0 to 1) and theta (0 to TWO_PI), looping noise and a gif option. [S141]

## Details

- The default loop is 3 seconds at 30 fps, and the GIF frame delay is set from frameRate(). [S141]
- Noise from animLoop.noise samples a circle in noise space and returns -1 to 1, unlike core noise() at 0 to 1. [S141]
- Maintenance 2026: the latest listed patch is 0.3.0 (README date 2023-04-02); npm shows 0.3.1 last published 2023-02-04 depending on p5 ^0.8.0, so it is effectively frozen. [S141][S159]
- p5 2.x compatibility: unverified; the docs example uses p5 1.2.0 and only script-tag usage is supported; the licence is GPL-3.0. [S141]
- The official libraries directory lists it under Animation and marks no animation library as v2-compatible. [S300]

## In explainer work

Its progress value is the same normalised t you get from computing (frameCount % N) / N yourself, so on 2.x it is safer to hand-roll the loop clock than depend on a frozen add-on. [S141][S135] Loop clocks must divide by total frames, not total minus one, to avoid a doubled frame at the seam. [S135]

## Relations

- alternative_to [[save-gif]] — offers progress/theta and gif export for loops [S141]
- related_to [[explainer-clock]] — supplies a loop-position clock comparable to a normalised t [S141]
- related_to [[noise-loop]] — implements circle-sampled looping noise [S141]
- related_to [[p5js-libraries-directory]] — listed in the Animation category [S300]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S135] — FOTD: loopsin (Keith Peters (BIT-101), 2024-01-27)
- [S141] — p5.createLoop (Petey Hayman, README mentions 0.3.0 dated 04/02/2023)
- [S159] — npm registry metadata (p5, p5.sound, p5.brush, p5.grain, p5.js-svg, p5.fillgradient, p5play, tone, ml5, p5.collide2d, p5.createloop, p5.capture, p5.plotsvg, p5.tree, matter-js, roughjs) (npm, queried 2026-10-08)
- [S300] — p5.js Community Libraries directory (Processing Foundation, undated (accessed 2026-10-08))
