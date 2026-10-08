---
id: preload
title: "preload()"
type: Construct
aliases: ["preload (removed in 2.0)"]
sources: [S4, S10, S11, S27, S33, S112, S115, S117, S239]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "1.x"
---

# preload()

## Definition
`preload()` was the 1.x asset-loading hook that paused the sketch until assets finished loading **[1.x only]**; it was removed in 2.0 and replaced by awaiting loaders in an async [[setup]] [S4][S27]. The [[p5js-compatibility]] `preload.js` add-on restores it [S11].

## Details
- Release note: "preload is replaced by async setup"; all `load*` functions return promises in 2.x [S4][S115].
- 2.0 shows a warning when `preload` is used; v2.3.4 (2026-09-25) restored a clearer Friendly Error System message for it [S4][S10].
- Library authors lose `registerPreloadMethod`, `_incrementPreload` and `_decrementPreload`; loaders should return promises instead [S112][S117].
- The community q5.js author also wrote about the preload system's removal [S239].
- Migration options: rewrite with `async setup()` or add `preload.js` from the compatibility repo; the repo advises trying the 1.x sketch on 2.x first [S11][S27].

## In explainer work
Many explainer tutorials still use `preload()`; treat them as 1.x and translate (see [[version-2x-migration]]) [S11]. Load in parallel with `Promise.all` and guard `draw()` with a ready flag if needed [S27][S33].

## Relations
- part_of [[hub-language-core]] (structural)
- replaced_in_2x [[async-setup]] — awaited loaders in setup [S4]
- depends_on [[p5js-compatibility]] — add-on that restores it [S11]
- part_of [[p5js-1x]] — belongs to the 1.x line [S4]
- related_to [[version-2x-migration]] — headline breaking change [S4]
- related_to [[friendly-error-system]] — explains the removal at runtime [S10]

## Sources
- [S4] — p5.js v2.0.0 release notes
- [S10] — p5.js GitHub releases page (v2.3.1 to v2.3.4)
- [S11] — p5.js-compatibility add-ons
- [S27] — Teachers' Guide to p5.js v2
- [S33] — loadFont() reference
- [S112] — Asynchronous p5.js 2.0
- [S115] — p5.js-compatibility README raw (differences list)
- [S117] — Designing an addon library system for p5.js 2.0
- [S239] — p5.js preload system removed from v2
