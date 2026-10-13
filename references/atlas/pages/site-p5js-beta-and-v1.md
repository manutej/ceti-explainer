---
id: site-p5js-beta-and-v1
title: "p5.js beta and v1 mirrors (source site)"
type: Site
aliases: ["beta.p5js.org and v1.p5js.org (site)"]
sources: [S56, S268, S334, S335, S336, S337, S338, S339, S340, S350, S351]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
---
# p5.js beta and v1 mirrors (source site)

## Definition
**p5.js beta and v1 mirrors** — the beta.p5js.org preview site that carried 2.x documentation before the main site switched, plus the frozen v1.p5js.org reference archive; operated by Processing Foundation / p5.js. [S56]

Kind: **docs**; 11 registered sources, 11 rated primary. It is one of the source sites indexed in [[hub-sites]]. [S56][S268][S334]

## What it contributes
- In WebGPU mode loadPixels() and get() must be awaited [S56]
- `deltaTime` holds the milliseconds the previous frame took [S337]
- `saveFrames()` is capped at 15 seconds and 22 fps to limit memory use [S336]
- Tutorial says pixelDensity() can be raised for high-resolution exports [S268]

## Pages that cite it

| page (38) | title |
|---|---|
| [[audio-master-clock]] | Audio master clock |
| [[camera-choreography]] | Camera choreography |
| [[camera-slerp]] | Camera slerp |
| [[easing-functions]] | Easing functions |
| [[explainer-clock]] | One clock, three modes |
| [[explainer-engine-blueprint]] | Explainer engine blueprint |
| [[frame-stepped-export]] | Frame-stepped export |
| [[hi-res-render]] | High-resolution offline render |
| [[hub-explainer-production]] | Hub: Explainer production |
| [[hub-language-core]] | Hub: Language and core API |
| [[hub-motion-rendering]] | Hub: Motion, timing and rendering |
| [[index]] | p5.js Explainer Atlas |
| [[kinetic-typography]] | Kinetic typography |
| [[lerp]] | lerp() |
| [[lifecycle-hooks]] | Add-on lifecycle hooks |
| [[load-font]] | loadFont() |
| [[mastery-ladder]] | Mastery ladder |
| [[mediabunny]] | Mediabunny |
| [[p5-camera]] | p5.Camera |
| [[p5-record]] | p5.record.js |
| [[p5-sound]] | p5.sound |
| [[p5-woff2]] | p5.woff2 add-on |
| [[pixel-density]] | pixelDensity() |
| [[pixels-array]] | pixels[] and loadPixels() |
| [[puppeteer-capture]] | Puppeteer headless capture |
| [[redraw]] | redraw() |
| [[register-addon]] | p5.registerAddon |
| [[save-frames]] | saveFrames() |
| [[shape-3d-models]] | 3D models |
| [[shape-morph]] | Shape and text morph |
| [[steering-behaviors]] | Steering behaviors |
| [[text-to-contours]] | textToContours() |
| [[text-to-model]] | textToModel() |
| [[track-tween]] | Track tween (alpha model) |
| [[video-export-pipeline]] | Video export pipeline |
| [[webgl-mode]] | WEBGL mode |
| [[webgpu-renderer]] | WebGPU renderer |
| [[world-to-screen]] | worldToScreen() / screenToWorld() |

## Reliability
- Coverage: 11 sources (11 rated primary, 0 secondary by the researchers); year range 2025–2025, 10 without a recorded date. [S56][S268][S334]
- Researcher caveat on S56: refers to Dec 2025 browser status. This limits how far the wiki leans on the page [S56]
- Noted gap: **Renderer architecture internals in 2.x** (the "state machines and renderer refactoring" changelog line) are undocumented on the pages fetched. Renderer registration for addons is not covered in the Creating Libraries doc. [S350]

## Sources
- [S56] — Contribute: Using WebGPU mode (docs; undated (refers to Dec 2025 browser stat)
- [S268] — Greetings from p5.js 2.0: Animation, Interaction, and Typography in 2D and 3D (docs; undated)
- [S334] — p5.Font `textToContours()` reference (docs; undated)
- [S335] — p5.Camera `slerp()` reference (docs; undated)
- [S336] — `saveFrames()` reference (docs; undated)
- [S337] — `deltaTime` reference (docs; undated)
- [S338] — `redraw()` reference (docs; undated)
- [S339] — `lerpColor()` reference (docs; undated)
- [S340] — p5.SoundFile `addCue()` (v1 reference) (docs; undated)
- [S350] — Creating Libraries (2.x contributor docs) (docs; undated)
- [S351] — Intro to p5.strands (tutorial) (docs; undated)
