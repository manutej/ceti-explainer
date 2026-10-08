---
id: site-p5js-tutorials
title: "p5.js Tutorials (source site)"
type: Site
aliases: ["p5js.org/tutorials (site)"]
sources: [S21, S26, S27, S49, S61, S64, S116, S243, S246, S252, S256, S348, S349]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
---
# p5.js Tutorials (source site)

## Definition
**p5.js Tutorials** — the official long-form tutorials on p5js.org, including the 2.0 teachers' guide, typography, p5.strands, framebuffer and optimisation guides; operated by Processing Foundation / p5.js contributors. [S21]

Kind: **docs**; 13 registered sources, 13 rated primary. It is one of the source sites indexed in [[hub-sites]]. [S21][S26][S27]

## What it contributes
- The official Custom Shapes and Smooth Curves tutorial teaches vertex, bezierVertex, beginShape, endShape, and push/pop-scoped translate and scale for placing shapes. [S21][S26]
- Filter shaders always apply to the whole canvas [S64]
- Sketches can be switched back to p5.js v1 in the Web Editor [S27]
- `describe()` should label the whole canvas in 1–3 sentences [S348]
- The tutorial gives no measured speedups for its optimizations [S256]

## Pages that cite it

| page (61) | title |
|---|---|
| [[access-statement]] | Access Statement |
| [[ai-assisted-p5]] | AI-assisted p5.js authoring |
| [[antialiasing]] | Antialiasing (smooth, setAttributes) |
| [[async-setup]] | async setup() |
| [[audio-master-clock]] | Audio master clock |
| [[bezier-vertex]] | bezierVertex() |
| [[build-geometry]] | buildGeometry() |
| [[community-export-pain]] | Video export as community pain point |
| [[create-canvas]] | createCanvas() |
| [[dave-pagurek]] | Dave Pagurek |
| [[delta-time]] | deltaTime |
| [[describe]] | describe() and describeElement() |
| [[drawing-state]] | Drawing state |
| [[events-keyboard]] | Keyboard events |
| [[explainer-engine-blueprint]] | Explainer engine blueprint |
| [[filter]] | filter() |
| [[filter-shaders]] | Filter shaders |
| [[frame-rate]] | frameRate() |
| [[friendly-error-system]] | Friendly Error System |
| [[gpu-instancing]] | GPU instancing (instances()) |
| [[hub-explainer-production]] | Hub: Explainer production |
| [[hub-language-core]] | Hub: Language and core API |
| [[hub-motion-rendering]] | Hub: Motion, timing and rendering |
| [[kit-kuksenok]] | Kit Kuksenok |
| [[layered-compositing]] | Layered compositing |
| [[lights-and-materials]] | Lights and materials |
| [[load-font]] | loadFont() |
| [[mastery-ladder]] | Mastery ladder |
| [[millis]] | millis() |
| [[module-3d]] | 3D module |
| [[module-environment]] | Environment module |
| [[module-transform]] | Transform module |
| [[module-typography]] | Typography module |
| [[mouse-button-object]] | mouseButton object |
| [[open-questions]] | Open questions and conflicts |
| [[p5-framebuffer]] | p5.Framebuffer |
| [[p5-graphics]] | p5.Graphics (createGraphics) |
| [[p5-shader]] | p5.Shader |
| [[p5-strands]] | p5.strands |
| [[p5-woff2]] | p5.woff2 add-on |
| [[p5js-1x]] | p5.js 1.x |
| [[p5js-compatibility]] | p5.js-compatibility add-ons |
| [[p5js-governance]] | p5.js project leadership |
| [[p5js-reference]] | p5.js Reference |
| [[p5js-web-editor]] | p5.js Web Editor |
| [[performance-profiling]] | Performance profiling |
| [[ping-pong-feedback]] | Ping-pong feedback framebuffers |
| [[pixel-density]] | pixelDensity() |
| [[pixels-array]] | pixels[] and loadPixels() |
| [[preload]] | preload() |
| [[push-pop]] | push() and pop() |
| [[shader-hooks]] | Shader hooks |
| [[shape-2d-primitives]] | 2D primitives |
| [[shape-3d-models]] | 3D models |
| [[shape-3d-primitives]] | 3D primitives |
| [[shape-custom-shapes]] | Custom shapes |
| [[text-output]] | textOutput() / gridOutput() |
| [[text-width]] | textWidth() / fontWidth() |
| [[version-2x-migration]] | 1.x to 2.x migration |
| [[webgl-mode]] | WEBGL mode |
| [[world-to-screen]] | worldToScreen() / screenToWorld() |

## Reliability
- Coverage: 13 sources (13 rated primary, 0 secondary by the researchers); year range 2024–2024, 12 without a recorded date. [S21][S26][S27]
- Researcher caveat on S49: links editor v2.3.3. This limits how far the wiki leans on the page [S49]
- Researcher caveat on S116: references 2.0.3. This limits how far the wiki leans on the page [S116]
- Researcher caveat on S252: refs 2024. This limits how far the wiki leans on the page [S252]
- Noted gap: The Custom Shapes tutorial says a bezierVertex shape must begin with vertex(), but its final curved example reportedly starts with bezierVertex; the reference says an initial anchor is only needed when no earlier vertices exist. Reconcile before teaching either form. [S26]
- Noted gap: Editor default date conflicts: Foundation blog says July 2026; compatibility repo says August 2026. Whether it has actually flipped by 2026-10-08 was not verified; the Get Started page pinning version=2.3.3 suggests it is at least linked to 2.x. [S246]
- Noted gap: **p5 2.x compatibility of add-ons is largely undocumented.** The library directory marks none of the animation or export libraries as v2-compatible. p5.capture's README shows an unversioned p5 CDN and does not mention 2.x. The p5.sound.js rebuild post does not state 2.x status, and the v2 teacher guide does not … [S27]

## Sources
- [S21] — p5.js tutorials index (docs; undated)
- [S26] — Tutorial: Custom Shapes and Smooth Curves (docs; undated (v2.3.3))
- [S27] — Teachers' Guide to p5.js v2 (docs; undated)
- [S49] — p5.strands: Introduction to Shaders (tutorial) (docs; undated (links editor v2.3.3))
- [S61] — Layered Rendering with Framebuffers (docs; undated)
- [S64] — Introduction to GLSL (tutorial) (docs; undated (links editor v2.3.3))
- [S116] — Greetings from p5.js 2.0: Animation, Interaction, and Typography in 2D and 3D (docs; undated (references 2.0.3))
- [S243] — How to Optimize Your Sketches (docs; undated)
- [S246] — p5.js Get Started tutorial (editor link pins version=2.3.3) (docs; undated)
- [S252] — Chatting with/about Code (Ciston, Martinez, Atairu) (docs; undated (refs 2024))
- [S256] — Optimizing WebGL Sketches (tutorial) (docs; undated)
- [S348] — Writing Accessible Canvas Descriptions (tutorial) (docs; undated)
- [S349] — Coordinates and Transformations (tutorial) (docs; undated)
