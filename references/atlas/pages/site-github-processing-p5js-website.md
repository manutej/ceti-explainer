---
id: site-github-processing-p5js-website
title: "GitHub: processing/p5.js-website (source site)"
type: Site
aliases: ["github.com/processing/p5.js-website (site)"]
sources: [S357, S358, S363]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
---
# GitHub: processing/p5.js-website (source site)

## Definition
**GitHub: processing/p5.js-website** — the repository that builds p5js.org, holding reference content per branch and the site's version constants; operated by Processing Foundation. [S357]

Kind: **primary**; 3 registered sources, 3 rated primary. It is one of the source sites indexed in [[hub-sites]]. [S357][S358][S363]

## What it contributes
- Transform: 12 entries. push and pop moved here from Structure [S357][S358]
- The website pins p5.sound version 0.4.1, which matches npm `latest` [S363]
- Shape/2D Primitives: 9 entries, none new [S357]

## Pages that cite it

| page (84) | title |
|---|---|
| [[async-setup]] | async setup() |
| [[bezier-order]] | bezierOrder() |
| [[blend-mode]] | blendMode() |
| [[build-geometry]] | buildGeometry() |
| [[camera-slerp]] | Camera slerp |
| [[capability-map]] | Capability map of p5.js 2.x |
| [[color-contrast]] | Color contrast checker |
| [[color-mode]] | colorMode() |
| [[color-spaces-2x]] | 2.x color spaces (HWB, LAB, LCH, OKLAB, OKLCH) |
| [[create-canvas]] | createCanvas() |
| [[curve-api-1x]] | 1.x curve API (removed) |
| [[decorators-api]] | Decorators API |
| [[describe]] | describe() and describeElement() |
| [[dom-controls]] | DOM UI controls (createSlider, createSelect, createInput) |
| [[dom-media]] | DOM media (createVideo, createAudio, createCapture) |
| [[draw]] | draw() |
| [[erase]] | erase() / noErase() |
| [[events-keyboard]] | Keyboard events |
| [[explainer-engine-blueprint]] | Explainer engine blueprint |
| [[filter]] | filter() |
| [[hub-language-core]] | Hub: Language and core API |
| [[hub-motion-rendering]] | Hub: Motion, timing and rendering |
| [[index]] | p5.js Explainer Atlas |
| [[layered-compositing]] | Layered compositing |
| [[lerp-color]] | lerpColor() |
| [[lights-and-materials]] | Lights and materials |
| [[load-font]] | loadFont() |
| [[map-norm-constrain]] | map(), norm(), constrain() |
| [[mastery-ladder]] | Mastery ladder |
| [[math-trigonometry]] | Trigonometry and angleMode |
| [[millis]] | millis() |
| [[module-3d]] | 3D module |
| [[module-color]] | Color module |
| [[module-constants]] | Constants module |
| [[module-data]] | Data module |
| [[module-dom]] | DOM module |
| [[module-environment]] | Environment module |
| [[module-events]] | Events module |
| [[module-image]] | Image module |
| [[module-io]] | IO module |
| [[module-math]] | Math module |
| [[module-rendering]] | Rendering module |
| [[module-shape]] | Shape module |
| [[module-structure]] | Structure module |
| [[module-transform]] | Transform module |
| [[module-typography]] | Typography module |
| [[mouse-button-object]] | mouseButton object |
| [[noise]] | noise() |
| [[open-questions]] | Open questions and conflicts |
| [[p2dhdr]] | P2DHDR canvas |
| [[p3-hdr-color]] | RGBP3 / RGBHDR wide-gamut color |
| [[p5-camera]] | p5.Camera |
| [[p5-color]] | p5.Color |
| [[p5-element]] | p5.Element |
| [[p5-font]] | p5.Font |
| [[p5-graphics]] | p5.Graphics (createGraphics) |
| [[p5-media-element]] | p5.MediaElement |
| [[p5-sound]] | p5.sound |
| [[p5-strands]] | p5.strands |
| [[p5-vector]] | p5.Vector |
| [[p5js]] | p5.js |
| [[p5js-1x]] | p5.js 1.x |
| [[p5js-reference]] | p5.js Reference |
| [[pointer-events]] | Pointer events (2.x) |
| [[push-pop]] | push() and pop() |
| [[random]] | random() and randomGaussian() |
| [[register-addon]] | p5.registerAddon |
| [[release-2-3]] | p5.js 2.3 |
| [[release-2-4]] | p5.js 2.4 |
| [[shape-2d-primitives]] | 2D primitives |
| [[shape-3d-models]] | 3D models |
| [[shape-3d-primitives]] | 3D primitives |
| [[shape-attributes]] | Shape attributes |
| [[shape-curves]] | Curves (bezier and spline functions) |
| [[shape-custom-shapes]] | Custom shapes |
| [[text-output]] | textOutput() / gridOutput() |
| [[text-to-contours]] | textToContours() |
| [[text-to-points]] | textToPoints() |
| [[text-weight]] | textWeight() and variable fonts |
| [[text-width]] | textWidth() / fontWidth() |
| [[version-2x-migration]] | 1.x to 2.x migration |
| [[vertex-property]] | vertexProperty() |
| [[webgl-mode]] | WEBGL mode |
| [[world-to-screen]] | worldToScreen() / screenToWorld() |

## Reliability
- Coverage: 3 sources (3 rated primary, 0 secondary by the researchers); year range 2026–2026, 0 without a recorded date. [S357][S358][S363]
- Noted gap: **Version mismatch:** the live reference documents 2.3.3, while 2.3.4 is GitHub/npm latest. Since 2.3.4 is a patch, the API surface should be identical. I confirmed this with a source diff: no public @method/@property in 2.3.4 is missing from main, though I did not diff 2.3.3 itself. [S363]
- Noted gap: **Hidden items:** `loading` (core/loading.js) appears as a reference file with no module and is not shown on the index. The Decorators API (`p5.registerDecoration`) is cited in release notes, but I found no reference page for it. [S357]
- Noted gap: **p5.sound changelog:** the full list of p5.sound.js additions and deprecations is in an external spreadsheet I could not access. My "removed" list comes from diffing the 1.x and 2.x reference folders only. [S357][S358]

## Sources
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types) (primary; 2026-09-30)
- [S358] — p5.js-website repo, `v1` branch reference (1.x reference; parsed 905 entries) (primary; 2026-10-02)
- [S363] — p5.js-website `src/globals/p5-version.ts` (p5Version 2.3.3, p5SoundVersion 0.4.1) (primary; 2026-09-30)
