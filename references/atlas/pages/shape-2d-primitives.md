---
id: shape-2d-primitives
title: "2D primitives"
type: Capability
aliases: ["2d shapes"]
sources: [S1, S3, S10, S15, S25, S349, S357]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# 2D primitives

## Definition
The 2D Primitives subgroup of the Shape module lists nine functions: `arc`, `circle`, `ellipse`, `line`, `point`, `quad`, `rect`, `square` and `triangle`; none are new in 2.x [S1][S357].

## Details
- `arc(x,y,w,h,start,stop,mode,detail)` uses radians and supports modes OPEN, CHORD and PIE; `detail` applies to WebGL only [S25].
- Primitives draw with the current fill and stroke from the [[drawing-state]] [S349].
- v2.3.1 fixed `rect()`, `line()`, `point()`, `triangle()` and `quad()` and added a rounded-rectangle primitive [S10].
- Primitives cannot be drawn between `beginShape()` and `endShape()` [S3].
- `rectMode` and `ellipseMode` come from [[shape-attributes]]; `rectMode(CENTER)` simplifies layout [S357].

## In explainer work
Rated **High**: these are the base vocabulary of diagram explainers (boxes, arrows built from `line` and `triangle`, nodes, and `arc` for progress rings) [S357].

## Relations
- part_of [[module-shape]] — subgroup [S1]
- part_of [[hub-language-core]] (structural)
- related_to [[shape-attributes]] — mode and stroke settings apply [S1]
- related_to [[shape-custom-shapes]] — alternative for arbitrary outlines [S3]
- related_to [[push-pop]] — scope styles per glyph [S15]
- related_to [[capability-map]] — rated High for explainers [S357]

## Sources
- [S1] — Reference index (v2)
- [S3] — beginShape() reference
- [S10] — p5.js GitHub releases page (v2.3.1 to v2.3.4)
- [S15] — push() reference
- [S25] — arc() reference
- [S349] — Coordinates and Transformations (tutorial)
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
