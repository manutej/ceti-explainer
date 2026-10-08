---
id: rough-js
title: "rough.js"
type: Library
aliases: ["roughjs"]
sources: [S159, S161, S163, S167]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# rough.js

## Definition

rough.js is a roughly 9 kB framework-agnostic library for sketchy drawing on canvas and SVG, with hachure, solid, zigzag, cross-hatch, dots and dashed fills. [S163]

## Details

- Maintenance 2026: npm 4.6.6 published 2023-11-20, the repo has about 21.2k stars; no release since, though a pure drawing library plausibly still works. [S159][S163]
- The README does not mention p5; its core algorithms were adapted from Processing's handy. [S163]
- No first-party p5 binding exists; use is by drawing to the sketch's canvas element via rough.canvas, unverified in 2.x. [S163]

## In explainer work

Pick it for hand-drawn figures in non-p5 or SVG pipelines; with p5 prefer [[p5-scribble]] to stay in one drawing model. [S163][S167]

## Relations

- alternative_to [[p5-scribble]] — same hand-drawn aim, different integration [S163][S167]
- related_to [[p5js-svg]] — both can target SVG [S163][S161]
- integrates_with [[p5js]] — only through the shared canvas element [S163]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S159] — npm registry metadata (p5, p5.sound, p5.brush, p5.grain, p5.js-svg, p5.fillgradient, p5play, tone, ml5, p5.collide2d, p5.createloop, p5.capture, p5.plotsvg, p5.tree, matter-js, roughjs) (npm, queried 2026-10-08)
- [S161] — p5.js-svg repo (Zeno Zeng, undated)
- [S163] — rough.js repo (Preet Shihn / rough-stuff, undated)
- [S167] — p5.scribble.js repo (generative-light, undated)
