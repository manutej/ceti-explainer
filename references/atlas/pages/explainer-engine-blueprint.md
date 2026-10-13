---
id: explainer-engine-blueprint
title: "Explainer engine blueprint"
type: Concept
aliases: ["engine gates", "Blueprint checklist"]
sources: [S11, S27, S72, S128, S131, S137, S158, S165, S170, S244, S300, S301, S302, S304, S308, S309, S311, S312, S313, S314, S315, S316, S317, S318, S319, S320, S321, S322, S323, S324, S325, S328, S330, S332, S334, S335, S337, S338, S339, S341, S357, S403, S405]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# Explainer engine blueprint

## Definition

The explainer engine blueprint is a layered design for a seekable, scrubbable, exportable p5.js explainer-video engine: Clock, then Timeline (tracks and beats), then pure scene evaluators, Camera, Overlays and an Exporter, with the invariant that every pixel is a function of t alone. [S317][S318]

## Details

### Why a blueprint (state of the art)
- No mature, maintained open-source engine combines a scene/beat system, scrubbable timeline, audio sync and deterministic export on top of p5.js; what exists is a scattered toolkit of tween helpers, scene routers, loop helpers and recorders. [S170][S301][S302][S309]
- The closest p5 Manim ports (p5.teach.js, Manim.js) document neither seekable playback nor audio sync, pirelaurent's scenario/journey framework is only a partial tool, and a 2020 forum request for a p5 timeline got no substantive answer. [S325][S328][S302][S304]
- The good ideas come from outside p5: Remotion (frame as a pure function, nested time shifts), Motion Canvas and Revideo (generator scenes, signals, drag-to-align time events) and Manim (play, alpha, run_time, rate_func, lag_ratio). [S317][S319][S311][S313][S314][S323]
> **Conflict:** no source documents a working p5 explainer engine, so everything below is a design synthesis from cited principles, not a verified product [S170][S302]; the cited tool docs disagree on maintenance status for Motion Canvas ([S316] vs [S312]).
### The central decision
- Decide whether draw() is the clock (mutating state with frameCount or deltaTime) or a renderer of state(t); scrub and export require the second, with t coming from a single clock. [S337][S317]
- Remotion's own docs show the cost of other clocks: CSS animations, Three's useFrame and free-running GSAP flicker or drift unless seeked to the frame. [S317][S320][S321]
### The layers
- Layer 1, Clock: [[explainer-clock]] returns t from frame/fps (export), audio time, wall time or a scrub slider. [S308][S330]
- Layer 2, Timeline: [[track-tween]] values authored with [[timeline-builder]] (or compiled [[generator-scenes]]), compiled to absolute intervals so seeking is a lookup, not a replay. [S323][S311][S321]
- Layer 3, Scenes: [[scene-local-time]] windows call pure render(localT) functions, with [[derived-geometry]] computed inside. [S319][S314]
- Layer 4, Camera: keyed zoom and pan tracks (patterns below), with p5.Camera slerp for WebGL. [S302][S335]
- Layer 5, Overlays: [[beats-and-captions]], drawn after resetMatrix(). [S322]
- Layer 6, Exporter: [[frame-stepped-export]] steps frames at 1/fps; audio is added by [[audio-post-mux]]. [S338][S313][S137]
### Where p5 2.x changes the details
- preload() is gone: assets load with await in [[async-setup]], and a preload.js compatibility add-on restores 1.x behaviour. **[2.x]** [S11][S27]
- redraw(n) returns a Promise, so the export loop can await each frame. **[2.x]** [S338]
- textToContours() returns per-contour points, enabling text morphs ([[kinetic-typography]]). **[2.x]** [S334]
- curveVertex became splineVertex and bezierVertex takes single points with bezierOrder(). **[changed in 2.x]** [S11]
- p5.sound was rebuilt on Tone.js (Dec 2024) and states it works with p5 1 and 2, but its sequencing classes are gone. [S165][S158][S357]
- The p5 libraries directory marks no animation or export library as v2-compatible, so pin versions ([[cdn-version-pinning]]). [S300][S405]

## Build order (actionable)

1. Write `clock` first and ban millis(), frameCount and deltaTime in scene files; lint for them. [S337][S317]
2. Add `track` and `sample`, clamping both ends and fixing colorMode before lerpColor. [S323][S339]
3. Add the `timeline()` builder (play, all, stagger, wait, beat) and compile once at load. [S322][S311]
4. Wrap scenes in time windows with local t; fade across boundaries instead of cutting. [S319][S137]
5. Add captions and voiceover markers as data; switch live mode to the audio clock. [S313][S330]
6. Add the exporter and test that scrubbing to frame N equals exported frame N. [S308]
7. Pin p5 and add-ons, then render with [[frame-stepped-export]]. [S405]

## The 15 patterns

- P1 One clock, three modes: [[explainer-clock]]. [S317]
- P2 Track tween: [[track-tween]]. [S323]
- P3 Builder with play/wait/all/stagger: [[timeline-builder]]. [S322]
- P4 Generator authoring, compiled: [[generator-scenes]]. [S311]
- P5 Scene-local time: [[scene-local-time]]. [S319]
- P6 Beats and captions: [[beats-and-captions]]. [S322]
- P7 Audio master clock and markers: [[audio-master-clock]]. [S313]
- P8 Arc-length reveal (below). [S309]
- P9 Morph: [[kinetic-typography]] (below). [S341][S334]
- P10 Camera choreography (below). [S302][S335]
- P11 Derived geometry: [[derived-geometry]]. [S314]
- P12 Deterministic randomness (below). [S316]
- P13 Frame-stepped export: [[frame-stepped-export]]. [S338]
- P14 Third-party timelines: [[third-party-timeline-driving]]. [S321]
- P15 Gates checklist (below). [S317]

## Patterns without their own page

#### P8 arc-length reveal
When to use: the draw-the-line or write-the-path effect, like p5.animS replaying a shape or Manim's Create. [S309]
```js
function partialPath(pts, u) {            // u = fraction of total length
  const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i-1] + dist(pts[i-1].x, pts[i-1].y, pts[i].x, pts[i].y));
  const target = u * L.at(-1); beginShape();
  for (let i = 0; i < pts.length; i++) {
    if (L[i] <= target) { vertex(pts[i].x, pts[i].y); continue; }
    const k = (target - L[i-1]) / (L[i] - L[i-1]);
    vertex(lerp(pts[i-1].x, pts[i].x, k), lerp(pts[i-1].y, pts[i].y, k)); break; }
  endShape();
}
```
Pitfall: precompute L once per path for big paths. [S309]
#### P9 morph
When to use: a Manim-like Transform; sample both shapes to the same point count and lerp (the Coding Train method), taking text outlines from textToContours. [S341][S334]
```js
function drawMorph(A, B, u) {            // A, B resampled to equal length
  beginShape(); for (let i = 0; i < A.length; i++) vertex(lerp(A[i].x, B[i].x, u), lerp(A[i].y, B[i].y, u)); endShape(CLOSE);
}
```
Pitfalls: "O" has two contours; pair by area or position and rotate B's start index to minimise travel. [S334][S341]
#### P10 camera
When to use: zooming into a diagram region; treat the camera as tracks cam.x, cam.y, cam.zoom on the same timeline (inference; pirelaurent's tripod-mounted camera is the 3D analogue). [S302]
```js
function camera2D(t) {
  translate(width / 2, height / 2); scale(tl.at('cam.zoom', t)); translate(-tl.at('cam.x', t), -tl.at('cam.y', t));
}
// WebGL: blend keyed cameras with cam.slerp(camA, camB, amt); both must share a projection
```
Pitfall: tween zoom in log space or deep zooms feel like they accelerate. [S335]
#### P12 deterministic randomness
When to use: particles, jitter, wobble. Seed per frame or element so output does not depend on render history, as Motion Canvas's useRandom does. [S316]
```js
function renderAt(t) { randomSeed(42); noiseSeed(42); /* random() and noise(x, t) are now functions of t */ }
```
Pitfall: seeding once in setup breaks scrubbing backward or jumping. [S128][S72]
#### P15 gates (all must pass before shipping)
- One clock; scene code reads only t. [S317]
- All motion is clamped tracks. [S323]
- Authoring compiled to absolute intervals. [S311][S321]
- Scenes get local time. [S319]
- Beats carry captions; voiceover markers are data. [S313][S322]
- Seeded randomness. [S316]
- Export steps at 1/fps and ignores wall time. [S308]
- p5 2.x: async setup, Promise redraw, textToContours, splineVertex. [S334][S338][S11]

## Wiring skeleton

```js
let tl;
async function setup() {
  createCanvas(1280, 720); pixelDensity(1);
  tl = compile(sceneScript);                // builder from the timeline pattern
  clock.t0 = performance.now();
}
function renderAt(t) {
  randomSeed(42); noiseSeed(42); background(250);
  push(); camera2D(t); renderScenes(t); pop(); captions(t);
}
function draw() { renderAt(clock.now()); }
```
Export swaps the clock mode and loops, as in [[frame-stepped-export]]. [S308][S338]

## Gaps and caveats

- Motion Canvas seeking (replay versus cache) was not verified from the docs read, while Remotion documents replay-from-zero cost for GSAP. [S315][S321]
- p5.tween internals are unspecified, and a millisecond model suggests wall-clock time, an inference. [S170]
- p5.capture and CCapture do not control wall time inside the sketch, so determinism is the sketch's job. [S244][S308]
- Theatre.js has no documented p5 integration, and GSAP plain-object targets are unconfirmed, so P14 is design, not documented practice. [S403][S332]
- manim-web is agent-generated with reported bugs; use it as an API reference only. [S324]

## Relations

- uses [[explainer-clock]] — layer 1 [S317]
- uses [[track-tween]] — layer 2 values [S323]
- uses [[timeline-builder]] — layer 2 authoring [S322]
- uses [[scene-local-time]] — layer 3 [S319]
- uses [[beats-and-captions]] — layer 5 [S322]
- uses [[audio-master-clock]] — layer 1 live mode [S313]
- uses [[derived-geometry]] — layer 3 helper [S314]
- uses [[frame-stepped-export]] — layer 6 [S338]
- uses [[third-party-timeline-driving]] — optional GSAP/Theatre adapter [S321]
- uses [[generator-scenes]] — optional authoring syntax [S311]
- related_to [[video-export-pipeline]] — the export half expanded [S131]
- depends_on [[async-setup]] — asset loading in 2.x [S11][S27]
- related_to [[pure-function-of-t]] — the invariant [S317]
- related_to [[remotion]] — source of the invariant [S317]
- related_to [[motion-canvas]] — source of generators and time events [S311]
- related_to [[manim]] — source of play/alpha vocabulary [S322]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S11] — p5.js-compatibility add-ons (Processing Foundation, v0.1.2, 15 Apr 2025)
- [S27] — Teachers' Guide to p5.js v2 (p5.js, undated)
- [S72] — noiseSeed() reference (p5.js, undated)
- [S128] — randomSeed() (p5.js reference, undated)
- [S131] — Best way to export an animation from a p5.js sketch in 2026 (Processing Discourse (poster slacle; replies by davepagurek), 2026 (per title))
- [S137] — Export Pipeline (p5js agent-skill reference) (third-party "hermes-agent" skill doc, hosted on a personal domain, undated)
- [S158] — p5.sound.js repo (Processing Foundation, undated)
- [S165] — Announcing the new p5.sound.js library (Processing Foundation, 2024-12-16)
- [S170] — p5.tween repo (Milchreis, undated)
- [S244] — p5.capture README v1.6.1 (library README on jsDelivr, undated)
- [S300] — p5.js Community Libraries directory (Processing Foundation, undated (accessed 2026-10-08))
- [S301] — p5.SceneManager README (mveteanu / CodeGuppy, undated)
- [S302] — p5_animationFramework README (pirelaurent, undated)
- [S304] — 'P5.js Simple Timeline' (Processing Forum, 2020)
- [S308] — 'How to save canvas animations with CCapture' (Ibby EL-Serafy, 2019-03-22)
- [S309] — p5.animS README (wixette, undated)
- [S311] — Revideo 'Animation flow' (Revideo (Motion Canvas fork), undated)
- [S312] — Motion Canvas Quickstart (Motion Canvas, undated)
- [S313] — Motion Canvas Time Events (Motion Canvas, undated)
- [S314] — Motion Canvas Signals (Motion Canvas, undated)
- [S315] — Motion Canvas Rendering (Motion Canvas, undated)
- [S316] — Motion Canvas tutorial part 1 (Tomáš Sláma, 2024-10-04)
- [S317] — Remotion 'CSS animations' troubleshooting (Remotion, undated)
- [S318] — Remotion 'The fundamentals' (Remotion, undated)
- [S319] — Remotion `<Sequence>` (Remotion, undated)
- [S320] — Remotion `<ThreeCanvas>` (Remotion, undated)
- [S321] — Remotion `useGsapTimeline()` (Remotion, undated (v4.0.517+))
- [S322] — Manim Community `Scene` reference (Manim Community, undated)
- [S323] — Manim Community `Animation` reference (Manim Community, undated)
- [S324] — 'Show HN: I ported Manim to TypeScript' (manim-web, github.com/maloyan/manim-web) (maloyan + HN commenters, c. early 2026 ("7 months ago"))
- [S325] — 'p5.teach: Teaching Math through Animations and Simulations' (Aditya Siddheshwar / Processing Foundation, 2021-09-22)
- [S328] — Manim.js README (Jazon Jiao, undated)
- [S330] — Theatre.js 'Using Audio' (Theatre.js, undated)
- [S332] — GSAP core docs (GSAP (Webflow), undated)
- [S334] — p5.Font `textToContours()` reference (p5.js (v2.3.3), undated)
- [S335] — p5.Camera `slerp()` reference (p5.js (v2.3.3), undated)
- [S337] — `deltaTime` reference (p5.js, undated)
- [S338] — `redraw()` reference (p5.js, undated)
- [S339] — `lerpColor()` reference (p5.js, undated)
- [S341] — Coding Challenge #81 Circle Morphing (Daniel Shiffman / The Coding Train, undated)
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types) (Processing Foundation, 2026-09-30)
- [S403] — Theatre.js docs, Sheet Objects (Theatre.js, undated)
- [S405] — p5.js Download page (p5.js team, undated)
