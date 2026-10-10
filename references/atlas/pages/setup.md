---
id: setup
title: "setup()"
type: Construct
aliases: ["setup function"]
sources: [S1, S2, S4, S8, S10, S14, S32, S33, S117]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# setup()

## Definition
`setup()` is called once at sketch start, before [[draw]] begins looping; it is optional [S2][S8]. In 2.x it may be declared `async` and awaits loaders inside it **[changed in 2.x]** [S2][S4].

## Details
- An async `setup()` pauses at each `await` until the promise resolves; the reference example awaits `loadFont` [S2]. The setup page no longer mentions [[preload]] [S2].
- Typical contents: [[create-canvas]] (call it once, at the start of setup), asset loading, and initial state [S14].
- v2.3.2 added a loading animation shown when `setup()` takes a long time [S10].
- WebGPU needs `await createCanvas(w, h, WEBGPU)` inside an async setup, but WebGL does not [S10][S14].
- Lifecycle hooks `presetup` and `postsetup` let add-ons run around it; see [[lifecycle-hooks]] [S117].

## In explainer work
Do all asset loading and any precomputation (for example glyph-point sampling) here so the first frame is ready and frame counts line up with the exported timeline (inference) [S33][S32].

## Relations
- part_of [[module-structure]] — Structure group function [S1]
- part_of [[hub-language-core]] (structural)
- enables [[draw]] — draw loop starts after setup resolves [S2]
- related_to [[async-setup]] — the 2.x awaited form [S2]
- related_to [[create-canvas]] — usually called first in setup [S14]
- replaced_in_2x [[preload]] — asset phase merged into setup [S4]

## Sources
- [S1] — Reference index (v2)
- [S2] — setup() reference
- [S4] — p5.js v2.0.0 release notes
- [S8] — draw() reference
- [S10] — p5.js GitHub releases page (v2.3.1 to v2.3.4)
- [S14] — createCanvas() reference
- [S32] — p5.Font textToPoints() reference
- [S33] — loadFont() reference
- [S117] — Designing an addon library system for p5.js 2.0
