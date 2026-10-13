---
id: shape-3d-models
title: "3D models"
type: Capability
aliases: ["loadModel", "model loading"]
sources: [S49, S55, S268, S292, S357]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# 3D models

## Definition
`loadModel()` loads OBJ and STL geometry and returns a Promise in 2.x **[changed in 2.x]**; `model()` draws it and `createModel` builds one, the Shape/3D Models group of three entries [S55][S357].

## Details
- MTL files next to an OBJ are loaded automatically; coloured STL is not supported [S55].
- Options include `normalize`, `fileType`, `flipU` and `flipV` [S55].
- `textToModel()` extrudes text into a 3D model with `extrude` and `sampleFactor` settings; text models lack texture coordinates, so `texture()` does not work on them [S268].
- No entries in the group are new in 2.x [S357].
- GSoC 2026 includes multi-material `.mtl` support [S292].

## In explainer work
Use `await loadModel(...)` inside `async setup()`; for repeated copies, combine with instancing [S55][S49].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- part_of [[module-shape]] — Shape/3D Models [S357]
- depends_on [[async-setup]] — Promise-based loading [S55]
- related_to [[text-to-model]] — extruded text [S268]
- related_to [[gpu-instancing]] — draw many copies [S49]
- related_to [[webgl-mode]] — WEBGL only [S55]

## Sources
- [S49] — p5.strands: Introduction to Shaders (tutorial)
- [S55] — Reference loadModel()
- [S268] — Greetings from p5.js 2.0: Animation, Interaction, and Typography in 2D and 3D
- [S292] — Announcing our Google Summer of Code Contributors (2026)
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
