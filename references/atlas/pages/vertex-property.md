---
id: vertex-property
title: "vertexProperty()"
type: Capability
aliases: ["custom vertex attributes"]
sources: [S3, S4, S357]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# vertexProperty()

## Definition
**[2.x]** `vertexProperty()` adds per-vertex data (custom attributes) to shapes for use in custom shaders; it is a new entry in the Custom Shapes group, with a matching `p5.Geometry.vertexProperty` [S4][S357].

## Details
- Listed among the 2.0 additions with `strokeShader`, `imageShader` and `p5.strands` [S4].
- Custom-shape usage with `normal()`, and contour behaviour, is only partly verified; the `beginShape` reference does not cover it [S3].
- Shader-side consumption goes through [[p5-strands]] hooks or custom shaders [S4][S357].

## In explainer work
Per-vertex data (for example an arrival time per vertex) lets one shader reveal a path without re-emitting geometry each frame (inference) [S4].

## Relations
- part_of [[shape-custom-shapes]] — new group member [S357]
- part_of [[hub-language-core]] (structural)
- related_to [[p5-shader]] — attributes feed shaders [S4]
- related_to [[p5-strands]] — shader authoring layer [S4]
- introduced_in [[release-2-0]] — listed in 2.0 additions [S4]

## Sources
- [S3] — beginShape() reference
- [S4] — p5.js v2.0.0 release notes
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
