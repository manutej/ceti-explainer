---
id: p5js-libraries-directory
title: "p5.js libraries directory"
type: Platform
aliases: ["p5js.org/libraries"]
sources: [S75, S117, S118, S156, S159, S300]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# p5.js libraries directory

## Definition

The p5.js libraries directory on p5js.org lists 54 contributed libraries across 19 categories as of 2026-10-08, and only two entries explicitly mention 2.x, so it is not a compatibility guide. [S156]

## Details

- Entries in scope: p5.brush, p5.fillGradient, p5.collide2d, p5play, ml5.js, p5.Riso; p5.grain, p5.scribble, p5.js-svg, rough.js, matter.js, Tone.js and p5.Polar were not among the entries returned. [S156]
- The two 2.x mentions are p5.tree ("render pipeline for p5.js v2") and a 2.0 VS Code project generator. [S156]
- Animation category: p5.tween, p5.createLoop, p5.animS, p5.glitch, BMWalker.js, HY5; Export: p5.capture, p5.videorecorder, p5.plotSvg, p5.Riso, p5snap; no Animation or Export library is marked v2-compatible. [S300]
- Utilities lists p5.SceneManager; p5.teach.js and LYGIA also appear. [S300][S156]
- Libraries are registered with p5.registerAddon in 2.x; a dual-version library can feature-test it and fall back to registerMethod. [S117][S118]
- The team had tested about a third of 100+ known libraries by early April 2025. [S75]

## In explainer work

Use it for discovery only and verify 2.x compatibility against npm peer dependencies and READMEs, as this atlas does per library. [S156][S159]

## Relations

- related_to [[p5-capture]] — Export category [S300]
- related_to [[p5-create-loop]] — Animation category [S300]
- related_to [[p5-tween]] — Animation category [S300]
- related_to [[p5-tree]] — explicitly mentions v2 [S156]
- related_to [[register-addon]] — 2.x registration mechanism [S118]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S75] — [dev updates] p5.js 2.0: You Are Here (Processing Foundation Discourse, 2025 (exact date not captured))
- [S117] — Designing an addon library system for p5.js 2.0 (Kenneth Lim (limzykenneth), undated)
- [S118] — Creating an Addon Library (p5js.org, undated)
- [S156] — p5.js Libraries page (Processing Foundation/p5.js, checked 2026-10-08)
- [S159] — npm registry metadata (p5, p5.sound, p5.brush, p5.grain, p5.js-svg, p5.fillgradient, p5play, tone, ml5, p5.collide2d, p5.createloop, p5.capture, p5.plotsvg, p5.tree, matter-js, roughjs) (npm, queried 2026-10-08)
- [S300] — p5.js Community Libraries directory (Processing Foundation, undated (accessed 2026-10-08))
