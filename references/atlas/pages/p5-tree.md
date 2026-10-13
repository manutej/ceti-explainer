---
id: p5-tree
title: "p5.tree"
type: Library
aliases: ["p5.tree render pipeline"]
sources: [S156, S159]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# p5.tree

## Definition

p5.tree is listed in the libraries directory as a render pipeline for p5 v2, covering camera, visibility and post-processing. [S156]

## Details

- Maintenance 2026: npm 0.0.62 published 2026-10-02 with peer p5 ^2.3.4, so it tracks the latest 2.x. **[2.x]** [S159]
- It is one of only two directory entries explicitly mentioning 2.x. [S156]
- Evidence is limited to the directory description and npm metadata; the API was not read. [S159]

## In explainer work

Relevant for 3D explainers needing camera and visibility control; verify API against the repo before depending on it. [S156][S159]

## Relations

- related_to [[p5js-libraries-directory]] — listed there [S156]
- related_to [[p5-camera]] — provides a camera pipeline [S156]
- related_to [[webgl-mode]] — targets 3D rendering [S156]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S156] — p5.js Libraries page (Processing Foundation/p5.js, checked 2026-10-08)
- [S159] — npm registry metadata (p5, p5.sound, p5.brush, p5.grain, p5.js-svg, p5.fillgradient, p5play, tone, ml5, p5.collide2d, p5.createloop, p5.capture, p5.plotsvg, p5.tree, matter-js, roughjs) (npm, queried 2026-10-08)
