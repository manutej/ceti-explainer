---
id: akshat-patil
title: "Akshat Patil"
type: Practitioner
aliases: ["Akshat"]
sources: [S63, S275, S278]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---
# Akshat Patil

## Definition
Akshat Patil is the 2026 OSS micrograntee who built GPU instancing for [[p5-strands]] — the `instances()` API merged for p5.js 2.4 [S275][S278].

## Details
- His Processing Foundation post of 10 August 2026, "Drawing a Forest in One Line", previews the API as `instances(500).sphere(20)`, captioned "Coming in p5.js 2.4" **[main / unreleased]** [S275][S63].
- The forest showcase renders 800 trees in two draw calls; instancing uses WebGPU where available and falls back to WebGL [S275].
- All planned tasks in tracking issue #8911 (alias, `instances()`, primitive integration, WebGL+WebGPU tests, docs) are checked off [S278].
- His work was funded by the [[oss-microgrants]] program [S275].

## In explainer work
- Instancing lets an explainer draw thousands of animated tokens or particles from a few lines, with per-instance placement in a strands hook rather than a JS loop; see [[gpu-instancing]] [S275][S278].

## Relations
- authored_by [[gpu-instancing]] — inverse: built strands instancing [S275]
- related_to [[release-2-4]] — feature targeted at 2.4 [S275]
- related_to [[oss-microgrants]] — funded by microgrant [S275]
- related_to [[hub-people-community]] (structural)
## Sources
- [S275] — instancing preview post
- [S278] — issue #8911
- [S63] — PF dev blog listing
