---
id: hub-language-core
title: "Hub: Language and core API"
type: Concept
aliases: ["C1 hub"]
sources: [S1, S3, S4, S8, S15, S27, S47, S96, S101, S114, S121, S259, S274, S342, S343, S349, S350, S357, S362, S404]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# Hub: Language and core API

## Definition
Entry point for cluster C1 of the p5.js explainer atlas: the language model (sketch, lifecycle, immediate mode, drawing state, global vs instance mode), the 17 reference modules, the core constructs and capabilities, and the 1.x to 2.x change set [S8][S96][S1]. Two synthesis pages anchor it: [[capability-map]] (what exists, how much, how relevant) and [[version-2x-migration]] (what broke and how to bridge it) [S357][S27].

## Details
### How the language works
- A [[sketch-concept]] runs a two-phase lifecycle, [[setup]] once then [[draw]] at about 60 fps, using [[immediate-mode]] drawing where nothing persists unless redrawn [S8][S259].
- Style and transform state form the [[drawing-state]], scoped with [[push-pop]]; transforms edit the coordinate system, not the object, in order translate, rotate, scale [S15][S349].
- [[global-mode]] is a pedagogical convenience; [[instance-mode]] is the production embed path for multiple sketches per page [S96][S101].
- In 2.x, assets load through [[async-setup]] instead of [[preload]], and the project values behind this and other design choices are in the [[access-statement]] [S4][S343].

### Version context
- **[2.x]** 2.0.0 shipped 2025-04-17; 2.3.4 (2026-09-25) is latest; 2.4 is on main; 1.x was frozen at the end of March 2026 (npm tag `r1` = 1.11.13); the Web Editor default flipped to 2.x on 2026-07-31 [S362][S114][S404]. See [[release-2-0]], [[release-2-1]], [[p5js-1x]].
- Open dating and naming disagreements for this cluster (editor-default month, 2.3.0 date, HDR/P3 naming, textWidth vs fontWidth, decorator-API date) are collected in [[open-questions]] [S47][S114][S121][S274].

### Reading paths
- Beginner to expert ladder: canvas and coordinates, lifecycle, immediate mode, drawing state, transforms, time, custom geometry, color, typography, composition, renderers, shaders, add-ons, shipping (see [[mastery-ladder]]) [S349][S3].
- Explainer-first path: [[capability-map]] relevance matrix, then [[shape-custom-shapes]], [[color-spaces-2x]], [[text-to-contours]], [[module-image]] export, [[register-addon]] [S357][S350].

## Index of cluster pages

### Modules

- [[module-color]] — Color module
- [[module-constants]] — Constants module
- [[module-data]] — Data module
- [[module-dom]] — DOM module
- [[module-environment]] — Environment module
- [[module-events]] — Events module
- [[module-image]] — Image module
- [[module-io]] — IO module
- [[module-math]] — Math module
- [[module-rendering]] — Rendering module
- [[module-shape]] — Shape module
- [[module-structure]] — Structure module
- [[module-transform]] — Transform module
- [[module-typography]] — Typography module

### Capabilities

- [[addon-events-api]] — Add-on Events API
- [[color-contrast]] — Color contrast checker
- [[decorators-api]] — Decorators API
- [[dom-controls]] — DOM UI controls (createSlider, createSelect, createInput)
- [[dom-media]] — DOM media (createVideo, createAudio, createCapture)
- [[friendly-error-system]] — Friendly Error System
- [[p5-svg-main-branch]] — Native SVG import/export (unreleased)
- [[shape-2d-primitives]] — 2D primitives
- [[shape-attributes]] — Shape attributes
- [[shape-curves]] — Curves (bezier and spline functions)
- [[shape-custom-shapes]] — Custom shapes
- [[vertex-property]] — vertexProperty()

### Constructs

- [[async-setup]] — async setup()
- [[begin-contour]] — beginContour() / endContour()
- [[bezier-order]] — bezierOrder()
- [[bezier-vertex]] — bezierVertex()
- [[blend-mode]] — blendMode()
- [[color-mode]] — colorMode()
- [[create-canvas]] — createCanvas()
- [[curve-api-1x]] — 1.x curve API (removed)
- [[describe]] — describe() and describeElement()
- [[draw]] — draw()
- [[erase]] — erase() / noErase()
- [[lerp-color]] — lerpColor()
- [[load-font]] — loadFont()
- [[p2dhdr]] — P2DHDR canvas
- [[p3-hdr-color]] — RGBP3 / RGBHDR wide-gamut color
- [[p5-color]] — p5.Color
- [[p5-element]] — p5.Element
- [[p5-font]] — p5.Font
- [[p5-media-element]] — p5.MediaElement
- [[preload]] — preload()
- [[push-pop]] — push() and pop()
- [[register-addon]] — p5.registerAddon
- [[setup]] — setup()
- [[spline-vertex]] — splineVertex()
- [[text-output]] — textOutput() / gridOutput()
- [[text-to-contours]] — textToContours()
- [[text-to-model]] — textToModel()
- [[text-to-points]] — textToPoints()
- [[text-weight]] — textWeight() and variable fonts
- [[text-width]] — textWidth() / fontWidth()

### Concepts

- [[access-statement]] — Access Statement
- [[capability-map]] — Capability map of p5.js 2.x
- [[color-spaces-2x]] — 2.x color spaces (HWB, LAB, LCH, OKLAB, OKLCH)
- [[drawing-state]] — Drawing state
- [[global-mode]] — Global mode
- [[immediate-mode]] — Immediate-mode drawing
- [[instance-mode]] — Instance mode
- [[lifecycle-hooks]] — Add-on lifecycle hooks
- [[sketch-concept]] — Sketch (sketching with code)
- [[version-2x-migration]] — 1.x to 2.x migration

### Libraries

- [[p5-woff2]] — p5.woff2 add-on
- [[p5js-compatibility]] — p5.js-compatibility add-ons

### Platforms

- [[p5js]] — p5.js
- [[p5js-1x]] — p5.js 1.x

### Releases

- [[release-2-0]] — p5.js 2.0
- [[release-2-1]] — p5.js 2.1

### Tools

- [[p5js-reference]] — p5.js Reference

## Relations
- related_to [[hub-motion-rendering]] (structural)
- related_to [[hub-explainer-production]] (structural)
- related_to [[hub-people-community]] (structural)
- related_to [[index]] — atlas entry page [S1]
- related_to [[mastery-ladder]] — ordered curriculum built from these constructs [S349]
- related_to [[open-questions]] — unresolved disagreements [S114]
- related_to [[capability-map]] — hub covers the same surface (see map for counts) [S357]

## Sources
- [S1] — Reference index (v2)
- [S3] — beginShape() reference
- [S4] — p5.js v2.0.0 release notes
- [S8] — draw() reference
- [S15] — push() reference
- [S27] — Teachers' Guide to p5.js v2
- [S47] — p5.js 2.1 and 2.2: Expanding Graphics Avenues with p5.strands improvements and WebGPU
- [S96] — p5.js wiki: Global and instance mode
- [S101] — p5.js reference: p5() constructor
- [S114] — Issue #8870 plan to make 2.x the Editor default
- [S121] — p5.js v2.3.0 release notes
- [S259] — p5.Graphics reference
- [S274] — What's New in p5.js 2.3.0!
- [S342] — p5.js About
- [S343] — p5.js Access Statement
- [S349] — Coordinates and Transformations (tutorial)
- [S350] — Creating Libraries (2.x contributor docs)
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
- [S362] — npm registry metadata for `p5` (dist-tags latest 2.3.4, r1 1.11.13, beta 2.3.1-rc.2; 2.0.0 published 2025-04-17)
- [S404] — p5.js Web Editor GitHub Releases
