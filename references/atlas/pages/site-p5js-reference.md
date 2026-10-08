---
id: site-p5js-reference
title: "p5.js Reference (source site)"
type: Site
aliases: ["p5js.org/reference (site)"]
sources: [S1, S2, S3, S5, S6, S7, S8, S9, S12, S13, S14, S15, S16, S17, S18, S19, S22, S23, S24, S25, S28, S29, S30, S31, S32, S33, S34, S35, S36, S37, S38, S39, S40, S41, S42, S51, S52, S53, S54, S55, S57, S58, S60, S65, S66, S67, S68, S69, S70, S71, S72, S73, S74, S89, S90, S92, S93, S97, S98, S101, S102, S103, S104, S107, S108, S109, S111, S126, S127, S128, S129, S130, S143, S144, S257, S258, S259, S260, S261, S262, S263, S289]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
---
# p5.js Reference (source site)

## Definition
**p5.js Reference** — the official per-function and per-class API reference for p5.js 2.x (p5js.org/reference), generated from the source docs and versioned per release; operated by Processing Foundation / p5.js maintainers. [S1]

Kind: **docs**; 82 registered sources, 82 rated primary. It is one of the source sites indexed in [[hub-sites]]. [S1][S2][S3]

## What it contributes
- The reference pages for pixelDensity, createGraphics and loadPixels do not document pixels[] length scaling or graphics-density interaction [S13][S17][S261]
- DOM helpers return p5.Element; `changed` fires a callback on change [S90][S111]
- Remote image and font URLs may be blocked by browser security (CORS) [S33][S40]
- bezierVertex and splineVertex do not work when an argument (a kind) is passed to beginShape. [S5][S6]
- noLoop() stops the draw loop, loop() resumes it, and isLooping() reports whether it is running. [S8][S29]
- Setting a Framebuffer width, height or density stops it tracking the main canvas; resizing then becomes manual [S257][S259]
- noise() always returns 0..1 per the reference, but the source does not clamp and falloff above 0.5 can exceed 1 [S65][S71]
- translate, rotate, scale and drawing other shapes such as ellipse or rect do not work between beginShape and endShape. [S3][S19]
- The setup() page does not mention preload(). [S2]
- RGBP3 needs a P3 canvas to render accurately [S30]
- createCapture works only locally or over HTTPS [S93]
- erase() strengthFill and strengthStroke default to 255 [S41]

## Pages that cite it

| page (130) | title |
|---|---|
| [[algorithmic-art-skill]] | algorithmic-art skill |
| [[antialiasing]] | Antialiasing (smooth, setAttributes) |
| [[async-setup]] | async setup() |
| [[beats-and-captions]] | Beats and captions |
| [[begin-contour]] | beginContour() / endContour() |
| [[bezier-order]] | bezierOrder() |
| [[bezier-vertex]] | bezierVertex() |
| [[blend-mode]] | blendMode() |
| [[build-geometry]] | buildGeometry() |
| [[camera-choreography]] | Camera choreography |
| [[camera-slerp]] | Camera slerp |
| [[capability-map]] | Capability map of p5.js 2.x |
| [[color-contrast]] | Color contrast checker |
| [[color-mode]] | colorMode() |
| [[color-spaces-2x]] | 2.x color spaces (HWB, LAB, LCH, OKLAB, OKLCH) |
| [[community-export-pain]] | Video export as community pain point |
| [[create-canvas]] | createCanvas() |
| [[delta-time]] | deltaTime |
| [[describe]] | describe() and describeElement() |
| [[dom-controls]] | DOM UI controls (createSlider, createSelect, createInput) |
| [[dom-media]] | DOM media (createVideo, createAudio, createCapture) |
| [[draw]] | draw() |
| [[drawing-state]] | Drawing state |
| [[easing-functions]] | Easing functions |
| [[erase]] | erase() / noErase() |
| [[event-driven-redraw]] | Event-driven redraw |
| [[events-keyboard]] | Keyboard events |
| [[explainer-engine-blueprint]] | Explainer engine blueprint |
| [[filter]] | filter() |
| [[filter-shaders]] | Filter shaders |
| [[fixed-timestep]] | Fixed-timestep rendering |
| [[frame-count]] | frameCount |
| [[frame-rate]] | frameRate() |
| [[frame-stepped-export]] | Frame-stepped export |
| [[friendly-error-system]] | Friendly Error System |
| [[generative-distributions]] | Distributions for generative variety |
| [[global-mode]] | Global mode |
| [[hub-explainer-production]] | Hub: Explainer production |
| [[hub-language-core]] | Hub: Language and core API |
| [[hub-motion-rendering]] | Hub: Motion, timing and rendering |
| [[hub-people-community]] | Hub: People, works and community |
| [[immediate-mode]] | Immediate-mode drawing |
| [[index]] | p5.js Explainer Atlas |
| [[instance-mode]] | Instance mode |
| [[layered-compositing]] | Layered compositing |
| [[lerp]] | lerp() |
| [[lerp-color]] | lerpColor() |
| [[lights-and-materials]] | Lights and materials |
| [[lil-gui]] | lil-gui |
| [[load-font]] | loadFont() |
| [[loop-control]] | noLoop(), loop(), isLooping() |
| [[map-norm-constrain]] | map(), norm(), constrain() |
| [[mastery-ladder]] | Mastery ladder |
| [[math-trigonometry]] | Trigonometry and angleMode |
| [[millis]] | millis() |
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
| [[noise]] | noise() |
| [[noise-loop]] | Seamless noise loop |
| [[open-questions]] | Open questions and conflicts |
| [[oscillation]] | Oscillation and harmonic motion |
| [[p2dhdr]] | P2DHDR canvas |
| [[p3-hdr-color]] | RGBP3 / RGBHDR wide-gamut color |
| [[p5-camera]] | p5.Camera |
| [[p5-color]] | p5.Color |
| [[p5-element]] | p5.Element |
| [[p5-fillgradient]] | p5.fillGradient |
| [[p5-font]] | p5.Font |
| [[p5-framebuffer]] | p5.Framebuffer |
| [[p5-graphics]] | p5.Graphics (createGraphics) |
| [[p5-media-element]] | p5.MediaElement |
| [[p5-save-frames]] | p5.save-frames |
| [[p5-shader]] | p5.Shader |
| [[p5-sound]] | p5.sound |
| [[p5-strands]] | p5.strands |
| [[p5-vector]] | p5.Vector |
| [[p5-woff2]] | p5.woff2 add-on |
| [[p5js]] | p5.js |
| [[p5js-reference]] | p5.js Reference |
| [[pixel-density]] | pixelDensity() |
| [[pixels-array]] | pixels[] and loadPixels() |
| [[pointer-events]] | Pointer events (2.x) |
| [[preload]] | preload() |
| [[pure-function-of-t]] | Pure function of t |
| [[push-pop]] | push() and pop() |
| [[random]] | random() and randomGaussian() |
| [[random-seed]] | randomSeed() and noiseSeed() |
| [[random-walk]] | Random walk |
| [[real-time-vs-frame-based]] | Real-time vs frame-based animation |
| [[redraw]] | redraw() |
| [[save-canvas]] | saveCanvas() |
| [[save-frames]] | saveFrames() |
| [[save-gif]] | saveGif() |
| [[seeded-determinism]] | Seeded determinism |
| [[setup]] | setup() |
| [[shader-hooks]] | Shader hooks |
| [[shape-2d-primitives]] | 2D primitives |
| [[shape-3d-models]] | 3D models |
| [[shape-3d-primitives]] | 3D primitives |
| [[shape-attributes]] | Shape attributes |
| [[shape-curves]] | Curves (bezier and spline functions) |
| [[shape-custom-shapes]] | Custom shapes |
| [[sketch-concept]] | Sketch (sketching with code) |
| [[spline-vertex]] | splineVertex() |
| [[steering-behaviors]] | Steering behaviors |
| [[text-to-contours]] | textToContours() |
| [[text-to-model]] | textToModel() |
| [[text-to-points]] | textToPoints() |
| [[text-weight]] | textWeight() and variable fonts |
| [[text-width]] | textWidth() / fontWidth() |
| [[triangle-subdivision]] | Self-balancing triangle subdivision |
| [[tweakpane]] | Tweakpane |
| [[vertex-property]] | vertexProperty() |
| [[video-export-pipeline]] | Video export pipeline |
| [[webgl-mode]] | WEBGL mode |
| [[webgpu-compute]] | WebGPU compute shaders |
| [[webgpu-renderer]] | WebGPU renderer |
| [[world-to-screen]] | worldToScreen() / screenToWorld() |

## Reliability
- Coverage: 82 sources (82 rated primary, 0 secondary by the researchers); year range no year recorded, 82 without a recorded date. [S1][S2][S3]
- Noted gap: The Custom Shapes tutorial says a bezierVertex shape must begin with vertex(), but its final curved example reportedly starts with bezierVertex; the reference says an initial anchor is only needed when no earlier vertices exist. Reconcile before teaching either form. [S6]
- Noted gap: Naming conflict: the release notes and Coding Train video use textContours/textModel in prose, the reference uses textToContours/textToModel. Use the reference names. [S32]
- Noted gap: The compatibility README says createVector requires explicit dimensions with no add-on; the reference says only the no-argument form is deprecated with a warning (not an error). Minor conflict in severity; treat as deprecated-with-warning in 2.3.x. [S74]

## Sources
- [S1] — Reference index (v2) (docs; undated (v2.3.x))
- [S2] — setup() reference (docs; undated (v2.3.3))
- [S3] — beginShape() reference (docs; undated (v2.3.3))
- [S5] — splineVertex() reference (docs; undated)
- [S6] — bezierVertex() reference (docs; undated)
- [S7] — bezierOrder() reference (docs; undated)
- [S8] — draw() reference (docs; undated)
- [S9] — redraw() reference (docs; undated)
- [S12] — spline() reference (docs; undated)
- [S13] — createGraphics() reference (docs; undated)
- [S14] — createCanvas() reference (docs; undated)
- [S15] — push() reference (docs; undated (v2.3.3))
- [S16] — strokeCap() reference (docs; undated)
- [S17] — pixelDensity() reference (docs; undated)
- [S18] — frameRate() reference (docs; undated)
- [S19] — endShape() reference (docs; undated (v2.3.1))
- [S22] — splineProperty() reference (docs; undated)
- [S23] — bezierPoint() reference (docs; undated)
- [S24] — beginContour() reference (docs; undated)
- [S25] — arc() reference (docs; undated)
- [S28] — translate() reference (docs; undated)
- [S29] — noLoop() reference (docs; undated)
- [S30] — colorMode() reference (docs; undated)
- [S31] — color() reference (docs; undated)
- [S32] — p5.Font textToPoints() reference (docs; undated)
- [S33] — loadFont() reference (docs; undated)
- [S34] — textWeight() reference (docs; undated)
- [S35] — textWidth() reference (docs; undated)
- [S36] — blendMode() reference (docs; undated)
- [S37] — pixels reference (docs; undated)
- [S38] — filter() reference (docs; undated)
- [S39] — set() reference (docs; undated)
- [S40] — loadImage() reference (docs; undated)
- [S41] — erase() reference (docs; undated)
- [S42] — lerpColor() reference (docs; undated)
- [S51] — Reference baseMaterialShader() (docs; undated)
- [S52] — Reference buildMaterialShader() (docs; undated)
- [S53] — Reference p5.Framebuffer (docs; undated)
- [S54] — Reference p5.Camera (docs; undated)
- [S55] — Reference loadModel() (docs; undated)
- [S57] — Reference p5.StorageBuffer.read() (docs; undated (v2.3.3))
- [S58] — Reference createShader() (docs; undated)
- [S60] — Reference buildComputeShader() (docs; undated)
- [S65] — noise() reference (p5.js 2.3.3) (docs; undated (v2.3.3))
- [S66] — randomGaussian() reference (docs; undated (v2.3.3))
- [S67] — p5.Vector reference (docs; undated)
- [S68] — map() reference (docs; undated)
- [S69] — lerp() reference (docs; undated)
- [S70] — angleMode() reference (v2.3.1) (docs; undated)
- [S71] — noiseDetail() reference (docs; undated)
- [S72] — noiseSeed() reference (docs; undated)
- [S73] — atan2() reference (docs; undated)
- [S74] — createVector() reference (v2.3.3) (docs; undated)
- [S89] — p5.js reference: mouseClicked() (docs; v2.3.3 docs, undated)
- [S90] — p5.js reference: createSlider() (docs; v2.3.3 docs)
- [S92] — p5.js reference: p5.Element (docs; v2.3.3 docs)
- [S93] — p5.js reference: createCapture() (docs; v2.3.3 docs)
- [S97] — p5.js reference: keyIsDown() (docs; v2.3.3 docs)
- [S98] — p5.js reference: createVideo() (docs; v2.3.3 docs)
- [S101] — p5.js reference: p5() constructor (docs; v2.3.3 docs)
- [S102] — p5.js reference: touches (docs; v2.3.3 docs)
- [S103] — p5.js reference: p5.MediaElement (docs; v2.3.3 docs)
- [S104] — p5.js reference: createAudio() (docs; v2.3.3 docs)
- [S107] — p5.js reference: mousePressed() (docs; v2.3.3 docs)
- [S108] — p5.js reference: createSelect() (docs; v2.3.3 docs)
- [S109] — p5.js reference: createInput() (docs; v2.3.3 docs)
- [S111] — p5.js reference: changed() (docs; v2.3.3 docs)
- [S126] — mouseX reference (docs; current)
- [S127] — deltaTime (docs; undated)
- [S128] — randomSeed() (docs; undated)
- [S129] — frameCount (docs; undated)
- [S130] — millis() (docs; undated)
- [S143] — p5.js reference: saveGif() (docs; undated)
- [S144] — p5.js reference: saveFrames() (docs; undated)
- [S257] — createFramebuffer() reference (docs; undated)
- [S258] — setAttributes() reference (docs; undated)
- [S259] — p5.Graphics reference (docs; undated)
- [S260] — noSmooth() reference (docs; undated)
- [S261] — loadPixels() reference (docs; undated)
- [S262] — buildGeometry() reference (docs; undated)
- [S263] — p5.Framebuffer pixelDensity() reference (docs; undated)
- [S289] — describe() reference (docs; v2.3.3 reference)
