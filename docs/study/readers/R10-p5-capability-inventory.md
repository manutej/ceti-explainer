# R10: p5.js 2.3.4 capability inventory

Scope: 20 built films (uploads, lines 887 onward), `up3/modules/materials` and kernels, `up1/library/modules/*/module.js`, base-rate `studio.js` (660–1113) and the P5Film bridge (1114–1343). "rt" = the Atelier runtime (lines 6–886, identical in every film). "Pure" = output is a function of (t, seed, state). Grep finds no real use of frameCount, millis, Date, performance, Math.random or p.random in film sections.

## Corrections to the working assumptions

1. No film section uses Web Audio. Audio lives in the runtime (rt 354–410, 763–768, 873) and is shared by all films.
2. createGraphics, loadFont, textToContours and framebuffer layers appear in no film section; they are reached only through the runtime. `loadFont` runs only where `def.fonts` is non-empty (the two grasp films).
3. Most `.camera(` hits are not p5 cameras. Grasp uses `AM.camera` 2D shots; Margin uses `Margin.camera`. True p5 3D appears only in escapement and bunraku.
4. Instancing exists only in the SHARED escapement (`buildMovement` 1427, `drawMovements` 1486). The NATIVE escapement draws each part with its own `p.model` call.
5. Library modules contain zero p5 calls. The only p5 layer in base-rate is `mass-reseat`'s `p5Layer` (module.js 400–406, `costMs: 3`).
6. Absent from every film: p5 input, p5 lights and materials, p5.Vector, p.get, OffscreenCanvas, Workers, textToPoints, textToModel, splines, strands, filterShader, readPixels, WebGPU, `ortho`, `blendMode`, `loadImage`.

## 1. Technique inventory

| Technique | Where | What it achieves | Cost note | Pure in t? |
|---|---|---|---|---|
| Offscreen 2D canvas, one blit per frame | marbling 1150–1151, 1460; margin 1284–1305, 1354; delta 1075–1102, 1515; exposure 998; all seven materials | CPU-painted paper, ink, terrain; Skia antialiasing | margin: "software Skia raster, one blit per frame"; delta: ~20k arcs per frame "costs seconds under SwiftShader", a drawImage per grain "microseconds" | Yes |
| Pixel fields via putImageData / Uint32 view | marbling 1150–1151; exposure 949; delta 1075–1093 | Per-pixel tone maps, mottle | JS loop per frame | Yes |
| Float32Array plates and LUTs | exposure 951, 959, 1244, 980; plate.js:40; marbling 915–917, 989, 1141; margin 1292; run 1328–1331; bunraku 993–1002, 1514, 1529, 1539 | H&D curve, paper tooth, falling-slip ODE | Refilled per frame in exposure | Yes |
| Path2D marching-squares iso-lines | exposure 1043–1045; grasp 1482–1484 | Contours of exposure fields | Cheap; cached | Yes |
| CSS filter and dash on 2D context | margin 1323 (blur); marbling 1601 (setLineDash) | Ink bleed, dashed ghosts | Blur is a raster pass per call | Yes |
| HUD and label layers via `ctx.layer` → createGraphics | escapement 1458, 1439; bunraku 1961, 2126; ledger 1087; rt 523 | Text in a 2D Graphics | Atlas rebuilt only on scale change | Yes |
| Static 3D meshes via buildGeometry | escapement 1103–1153, 1426–1448; bunraku 1199–1233 | Parts extruded once | Built at setup; SwiftShader "pays per vertex" | Yes |
| Perspective and camera | escapement 1462–1463, 1600; bunraku 1869, 2171 | True depth, one elevation | Negligible | Yes |
| Custom GLSL 300 es via createShader + setUniform | escapement VERT 1171 / FRAG 1207, VERT2 1315 / FRAG2 1322; bunraku VERT 1240 / FRAG 1290 | Per-material light, hatch, placement | p5's material shader "loops over light arrays per fragment… that was the cost"; SwiftShader "runs every branch", so 9 `#define` variants | Yes |
| 8-bit data texture for instance state | escapement shared 1268–1290 (`createImage(28,n)`, loadPixels 1467, updatePixels 1485) | 28 texels per movement; 16-bit positions | Canvas-backed, so alpha must stay 255 | Yes |
| Instanced draw: `p.model(geo, n)` + gl_InstanceID + texelFetch | escapement shared 1181, 1293–1312, n=100; bunraku 1252, 1874–1883 | 100 movements in one draw per part | One draw per part per pass | Yes |
| Raw GL RGBA32F data texture | bunraku 935–949 (texImage2D RGBA32F, texSubImage2D), per-frame `upload()` at 2034 | Exact float pose data | Per-frame upload | Yes |
| Depth-off occlusion pass in a framebuffer | bunraku `createFramebuffer` 320×180, depth:false, 1840; pass 1869–1875; `occAt` 1357 | Receiver occlusion | One third resolution | Yes |
| Analytic contact shadows and thin-lens DoF in one shader | bunraku `coc` 1321, `planeOcc` 1323, `rodOcc` 1346, `shade` 1358, `main` 1379; atlas pyramid 3072×2048 (954) | Soft and sharp shadows, per-plane focus | Fragment-heavy; pyramid blurred once | Yes |
| fwidth antialiased hatch | escapement 1216, 1330; bunraku 1393 | AA cut-face hatching | Negligible | Yes |
| Seeded independent PRNG streams | studio.js cyrb128 690, sfc32 705, `stream` 719, `poissonDisc` 755 | Structure, detail and colour stay separate | Negligible | Yes |
| Explicit frame stepping | studio.js `__renderFrame` 931–951; rt 556 (redraw), 844 (preserveDrawingBuffer), 845 (noLoop, randomSeed) | Headless render at exact t | None | Yes |
| Score events to sound | marbling 1477–1489; exposure 1391–1398; grasp 1094–1098 (`AM.voice`) | Semantic sound cues | None | Yes |
| Offline audio render | rt `VOICES` 354–383, `wavB64` 389–403, `renderScore` 405–408; `finish_mp4.py:45` | 48 kHz stereo 16-bit WAV | OfflineAudioContext | Yes |
| Live audio | rt `unlock()` 763–768 | Optional live sound | Off the clock | No |
| Studio FFT / STFT and scripted gestures | studio.js 1051, 1062, 1076–1090 | Offline analysis, replayed pointers; unused by base-rate | None | Yes |
| P5Film layers | bridge 1114–1343 (`mount` 1175, noLoop 1201, `drawLayer` 1238); base-rate 2663; mass-reseat module.js 400–406 | p5 2D layers on the explainer clock | ResizeObserver resize | Yes |
| Font loading from def.fonts | rt 578–586; marbling 1598; ledger.kit.js | Typeface per direction | Fonts are base64 in line 5 | Yes |

Timing comments found: escapement 1082 (44-px cells); bunraku 1200; delta 1148–1149 and 1189; grasp CPU canvases with a 1.5× render-scale cap; grasp disc sprite "microseconds"; module.js 401 (`costMs: 3`). Every film declares `fps: 30` and `size: [960, 540]`. No film records a measured ms-per-frame.

## 2. Fonts and type roles

Every film embeds, in line 5 (`window.ATELIER_FONTS`, base64, about 0.4 MB): Fraunces 300i/400i, DM Sans 400/500/600, Space Mono 400/700.

| Direction | Extra embedded faces | Used in film code |
|---|---|---|
| A Escapement | Barlow 300–600, Barlow Semi Condensed 500/600, IBM Plex Mono 400/500 | Barlow (HUD default) |
| B Marbling | IM Fell English 400/400i, Alegreya Sans 400/500, DM Mono 400/500 | Alegreya Sans, IM Fell, DM Mono |
| C Delta | Cormorant Garamond 500i/600i, IBM Plex Sans Condensed 400/500, IBM Plex Mono 500 | Cormorant, IBM Plex |
| D Ledger | Newsreader 400/400i/500/600, IBM Plex Sans Condensed 400/500/600 | Newsreader, IBM Plex Sans Condensed |
| E Margin | none | Single-line stroke glyphs, no font |
| F Bunraku | Bodoni Moda 800, Instrument Sans 400/600, Gloock 400 | Instrument Sans, Gloock, Bodoni |
| G Run | Jost 400–700 | Jost |
| H Exposure | Sofia Sans Extra Condensed 500–700, Red Hat Mono 400/500 | 1 each |
| Grasp stitch | Jost 400/500/600 | Jost |
| Grasp plate | Sofia Sans XC 500/600, Red Hat Mono 400/500 | Sofia, Red Hat |

`up3/modules/fonts/` holds 19 woff2 files across 10 families; it lacks Fraunces, DM Sans, Space Mono, Barlow, Bodoni Moda, Instrument Sans and Gloock, which come only from the runtime pack.

Type roles (`am.js` 63–72): title ≥18 px, head ≥16, text ≥14, num ≥14, sketch ≥14, note ≥10 and only for labels that carry no result. Enforced at build time by throwing. Digits in text are rejected unless tagged given, sketch or fromNumber.

## 3. The capability ladder proven here (cheapest to most advanced)

1. Pure 2D CPU raster (marbling, margin, delta). No GPU; deterministic; cost is CPU.
2. Float fields and contour paths (exposure E plate, Path2D iso-lines, the H&D curve).
3. p5 2D graphics and 2D layers (`createGraphics` via rt 523, P5Film, mass-reseat's `p5Layer`).
4. p5 3D static meshes with perspective (escapement native parts, bunraku props).
5. Custom GLSL 300 es with uniforms (escapement `partShader`; bunraku uber-shader with 9 variants).
6. Instancing with an 8-bit data texture (escapement shared: 100 movements × 28 texels).
7. Raw GL RGBA32F textures, an FBO occlusion pass, analytic shadows and DoF (bunraku). The only float data path and the only use of `createFramebuffer`.
8. Offline audio render to WAV, muxed into MP4 (runtime plus `finish_mp4.py`).

## 4. p5 2.3.4 capabilities no film used

- p5.strands / shader hooks (`baseMaterialShader().modify`). All shaders are hand-written GLSL. Hooks would reuse p5's lighting pipeline, but escapement 1170 records that p5's per-fragment light loop was the cost. Verify the 2.3.4 API first.
- WebGPU renderer. The bundle carries the `webgpu` constant. No film requests it. Headless SwiftShader renders likely cannot use it; separate gate needed.
- Float framebuffers and depth textures. The runtime wraps `createFramebuffer({format: FLOAT})` (rt 522), but no film calls it. Bunraku's `rawTexture` reaches around p5 with `p._renderer.GL`; a p5 float framebuffer with a depth texture could replace that and its depth-off occlusion pass.
- filterShader / createFilterShader. Candidates: paper grain, bleed or bloom as a full-screen pass.
- textToModel and textToPoints. None used.
- Splines. None used; the cubic Bézier is hand-rolled.
- p5 lights and specular materials. None used; both shader families hand-roll Blinn-Phong.
- p5.sound. Not bundled; hand-rolled Web Audio voices instead.
- Input (orbitControl, mouse and touch handlers). None used; `setState` and scripted gestures replace them for determinism.
- OffscreenCanvas and Workers. None used. The CPU rasters could run across workers.
- Framebuffer readback (`readPixels`, `get()`). None used; it would be the path to GPU-side physics that feeds back to the CPU.
