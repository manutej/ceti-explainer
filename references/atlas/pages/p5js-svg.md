---
id: p5js-svg
title: "p5.js-svg"
type: Library
aliases: ["p5.SVG", "SVG renderer", "SVG export of finished frames", "p5.plotSvg", "plotSvg"]
sources: [S137, S156, S159, S161, S163, S360]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "1.x"
---

# p5.js-svg

## Definition

p5.js-svg (Zeno Zeng) adds an SVG canvas mode via createCanvas(w, h, SVG) using svgcanvas, and its README claims compatibility with p5.js 1.11.x only. [S161]

## Details

- Maintenance 2026: latest 1.6.0 published 2025-04-04; the README does not mention 2.x. **[1.x only]** [S159][S161]
- blendMode is not implemented, blur/erode/dilate differ, and elements accumulate so call clear() each frame. [S161]
- For 2.x use p5.plotSvg (npm 0.3.0, 2026-06-22, peer p5 >=1.4.2, by Golan Levin) or the unreleased native SVG work on main. **[main / unreleased]** [S159][S156][S360]
- A third-party doc also says p5 SVG output requires 1.11.x; its provenance is low. [S137]

## In explainer work

Export finished frames as SVG only for editorial or plotter deliverables, on 1.11.x, since video pipelines raster-render anyway. [S161]

## Relations

- alternative_to [[p5-svg-main-branch]] — native SVG export being built on main versus the add-on [S360]
- related_to [[rough-js]] — both can output SVG [S161][S163]
- related_to [[p5js-1x]] — pinned to 1.11.x [S161]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S137] — Export Pipeline (p5js agent-skill reference) (third-party "hermes-agent" skill doc, hosted on a personal domain, undated)
- [S156] — p5.js Libraries page (Processing Foundation/p5.js, checked 2026-10-08)
- [S159] — npm registry metadata (p5, p5.sound, p5.brush, p5.grain, p5.js-svg, p5.fillgradient, p5play, tone, ml5, p5.collide2d, p5.createloop, p5.capture, p5.plotsvg, p5.tree, matter-js, roughjs) (npm, queried 2026-10-08)
- [S161] — p5.js-svg repo (Zeno Zeng, undated)
- [S163] — rough.js repo (Preet Shihn / rough-stuff, undated)
- [S360] — p5.js source on `main` (commit aa192a2, 2026-10-07; post-2.3.4 work) (Processing Foundation, 2026-10-07)
