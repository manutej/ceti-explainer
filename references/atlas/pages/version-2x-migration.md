---
id: version-2x-migration
title: "1.x to 2.x migration"
type: Concept
aliases: ["2.x migration", "migration guide", "Teachers' Guide to p5.js v2", "v2_transition", "v2 transition guide"]
sources: [S4, S10, S11, S27, S47, S62, S75, S114, S115, S116, S117, S119, S120, S121, S123, S124, S274, S275, S358, S362, S404]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# 1.x to 2.x migration

## Definition
Moving a sketch from p5.js 1.x to 2.x means replacing the `preload` phase with an async setup, renaming the curve and vertex API, adopting pointer-based input, and swapping removed dict and array helpers for native JavaScript; the [[p5js-compatibility]] add-ons bridge most of it [S4][S115][S27]. The official Teachers' Guide to p5.js v2 (folded topic teachers-guide-v2) covers the educator view and says most students and teachers can use v2 without changes [S27].

## Timeline and version anchors
- **2.0.0** released 2025-04-17 (see [[release-2-0]]); npm `latest` moved to 2.x [S4][S362].
- **2.1** added TypeScript types, the Add-on Events API, `color.contrast()` and strands control flow ([[release-2-1]]) [S120].
- **2.2** introduced the experimental WebGPU renderer ([[release-2-2]]); 2.2.1 flattened the p5.strands API; 2.2.3 was published 23 March [S47][S119].
- **2.3.0** added 2D filter shaders in strands, WebGPU compute shaders and a `p5.Vector` refactor ([[release-2-3]]); 2.3.1 (21 Jul) renamed HDR to P3; 2.3.2 (30 Jul) added a loading animation; 2.3.3 (7 Sep) added `MAX_GIF_PIXELS`; 2.3.4 (25 Sep) is the latest [S121][S10][S62].
- **2.4** is in progress on main, with GPU `instances()` ([[release-2-4]]) [S275][S10].
- **1.x** was frozen at the end of March 2026; npm tag `r1` is 1.11.13 ([[p5js-1x]]) [S114][S362].
- **Web Editor** default switched to 2.x on 2026-07-31 (editor v2.22.0) per the issue schedule and editor release notes ([[editor-default-switch]]) [S114][S404].

> **Conflict:** The Foundation blog (March 2026) says 2.x becomes the Editor default in July 2026 [S47], while issue 8870 and the original forum plan say the start of August 2026 [S114][S75]; the issue lists the web editor update as done by 31 July [S114].

> **Conflict:** The 2.3.0 release is dated 28 May on the GitHub release page [S121] but 22 June 2026 in the Foundation write-up [S274].

## Details
### Migration map
- [[preload]] -> [[async-setup]]: `async function setup()` with `await loadImage(...)`; `createCanvas()` moves inside setup; all `load*` functions return promises; 2.0 warns when preload is used, 2.3.4 gives a clearer message [S27][S115][S10].
- `curveVertex` -> [[spline-vertex]] (no doubled end points); `curve`/`curvePoint`/`curveTangent` -> `spline`/`splinePoint`/`splineTangent`; `curveTightness` -> `splineProperty('tightness')`; multi-point `bezierVertex` and `quadraticVertex` -> [[bezier-vertex]] with [[bezier-order]]; `beginGeometry`/`endGeometry` -> [[build-geometry]]; `bezierDetail` -> `curveDetail` (see [[curve-api-1x]]) [S115][S11].
- Input: `touchStarted/Moved/Ended` -> mouse handlers plus `touches`; `mouseButton` equality checks -> object booleans ([[mouse-button-object]]); `keyCode` -> `key`/`code`; `keyIsDown(UP_ARROW)` works in both ([[pointer-events]], [[events-keyboard]]) [S27][S115].
- Data: `createStringDict`, `createNumberDict`, `p5.TypedDict`, `append`, `arrayCopy`, `concat`, `reverse`, `shorten`, `sort`, `splice`, `subset` removed -> native JS ([[module-data]]) [S115].
- Vectors: `createVector()` needs explicit dimensions; `loadTable`'s second argument is a separator; `loadBytes` returns a `Uint8Array` [S115][S121].
- Typography: `textWidth` is a tight box and `fontWidth` includes spaces ([[text-width]]); Google Fonts need [[p5-woff2]] [S116][S11].
- Add-ons: `registerMethod`, `registerPreloadMethod` -> [[register-addon]] with [[lifecycle-hooks]] [S117].
- HDR naming: `RGBHDR`/`P2DHDR` -> `RGBP3`/`P2DP3` from 2.3.1 ([[p3-hdr-color]]) [S62].

### Bridges
- Add-ons `preload.js`, `shapes.js`, `data.js`, `events.js`; try the 1.x sketch on 2.0 first; in the Web Editor add them via Library Management or switch the sketch back to v1 with the version picker [S11][S27].
- Three Web Editor paths: update the code, enable a compat add-on, or switch to v1 [S27].
- Some changes have no add-on (createVector dimensions, buildGeometry, splineProperty) [S115][S11].

### Community friction
- A user measured about 60 fps in 1.11.11 vs about 2 fps in 2.1.2 for per-pixel `set()`; write to `pixels[]` or use a shader ([[perf-regressions-2x]]) [S123].
- Users asked for a structural-changes guide; replies pointed to the compat README; the official full transition list was not directly fetched [S124][S27].
- About a third of 100+ known community libraries had been checked for 2.0 compatibility in the first dev-update post (point in time) [S75].

## In explainer work
Most public explainer code is 1.x (`preload`, `curveVertex`, `keyCode`); translate before reusing and verify against the live 2.x reference [S11]. Pin the p5 version (and `p5.webgpu.js` if used) in the shipped HTML, because behaviour and beta features shift between 2.x minors (see [[cdn-version-pinning]]) [S10][S47].

## Patterns
**Migration checklist.** When: porting a 1.x explainer. Pitfall: leaving a stray global `setup`/`draw`.
```js
// 1. preload() -> async setup + await   2. curveVertex -> splineVertex (drop doubled ends)
// 3. quadraticVertex -> bezierOrder(2)  4. mouseButton === LEFT -> mouseButton.left
// 5. keyCode compares -> key/code       6. dict/array helpers -> native JS
// 7. createVector() -> createVector(0,0)
```

## Relations
- part_of [[hub-language-core]] (structural)
- related_to [[release-2-0]] — origin of the breaks [S4]
- related_to [[p5js-1x]] — the line being left [S114]
- uses [[p5js-compatibility]] — bridge add-ons [S11]
- related_to [[capability-map]] — the 1.x vs 2.x reference deltas [S358]
- related_to [[async-setup]] — headline break [S27]
- related_to [[editor-default-switch]] — when the Editor flipped [S114]
- related_to [[open-questions]] — unresolved date conflicts [S114]

## Sources
- [S4] — p5.js v2.0.0 release notes
- [S10] — p5.js GitHub releases page (v2.3.1 to v2.3.4)
- [S11] — p5.js-compatibility add-ons
- [S27] — Teachers' Guide to p5.js v2
- [S47] — p5.js 2.1 and 2.2: Expanding Graphics Avenues with p5.strands improvements and WebGPU
- [S62] — p5.js 2.3.1 release notes (mirror)
- [S75] — [dev updates] p5.js 2.0: You Are Here
- [S114] — Issue #8870 plan to make 2.x the Editor default
- [S115] — p5.js-compatibility README raw (differences list)
- [S116] — Greetings from p5.js 2.0: Animation, Interaction, and Typography in 2D and 3D
- [S117] — Designing an addon library system for p5.js 2.0
- [S119] — Releases page 2 (2.2.3, 2.3.0 RCs, 1.11.12-1.11.14 RCs)
- [S120] — p5.js v2.1.0 release notes
- [S121] — p5.js v2.3.0 release notes
- [S123] — Speed of set(x, y, color) in p5.js 2.1.2 vs 1.11.11
- [S124] — Looking for a p5 2.x.x tutorial
- [S274] — What's New in p5.js 2.3.0!
- [S275] — Drawing a Forest in One Line: A Preview of Instancing in p5.strands
- [S358] — p5.js-website repo, `v1` branch reference (1.x reference; parsed 905 entries)
- [S362] — npm registry metadata for `p5` (dist-tags latest 2.3.4, r1 1.11.13, beta 2.3.1-rc.2; 2.0.0 published 2025-04-17)
- [S404] — p5.js Web Editor GitHub Releases
