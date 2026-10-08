---
id: mastery-ladder
title: "Mastery ladder"
type: Concept
aliases: ["mastery curriculum", "expert vs novice mental models"]
sources: [S3, S4, S8, S9, S11, S13, S15, S18, S46, S47, S96, S127, S143, S170, S186, S188, S257, S259, S274, S328, S347, S348, S349, S350, S351, S357, S367, S374, S386, S387]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---
# Mastery ladder

## Definition
The mastery ladder is a novice→expert progression for building explainer animations in p5.js 2.x: fourteen rungs ordered by construct dependency, followed by expert mental models and production lessons. The ordering is a **synthesis** (the research branch calls it an inference from construct dependencies); each rung's facts are sourced [S8][S15][S349].

## Details
How to read: each rung lists what to learn, the pages that own it, and the sourced fact that makes it matter. Lines marked *(synthesis)* are the atlas's own ordering or judgement.

### Rungs 1–5: the sketch model (novice)
1. **Canvas and coordinates** — pixel grid, top-left origin, y down; primitives use the current fill and stroke; origin moves to centre in WEBGL. Pages: [[create-canvas]], [[shape-2d-primitives]], [[module-shape]] [S349][S3].
2. **Lifecycle** — `setup()` once, `draw()` repeatedly at ~60 fps; `background()` in draw clears the frame; `noLoop()`/`loop()`/`isLooping()`. Pages: [[setup]], [[draw]], [[loop-control]], [[sketch-concept]] [S8].
3. **Immediate mode** — nothing persists between frames; the main canvas resets transforms at the start of each draw. The term itself is not used in p5 docs *(synthesis)*. Page: [[immediate-mode]] [S259].
4. **Drawing state as a machine** — fill, stroke and modes persist until changed; `push()`/`pop()` scope them. Pages: [[drawing-state]], [[push-pop]] [S15].
5. **Transforms as coordinate-system edits** — order matters (translate, rotate, scale), pivots, symmetry. Page: [[module-transform]] [S349].

### Rungs 6–10: explainer craft (intermediate)
6. **Time** — `frameCount` vs `deltaTime` vs an owned clock; render as `renderAt(t)`; deltaTime is real elapsed ms, so it is for live playback, not export. Pages: [[frame-count]], [[delta-time]], [[millis]], [[pure-function-of-t]], [[normalized-time]], [[easing-functions]] [S127][S8].
7. **Custom geometry** — beginShape kinds, contours, 2.x Bézier (`bezierOrder`) and spline semantics **[changed in 2.x]**. Pages: [[shape-custom-shapes]], [[bezier-vertex]], [[spline-vertex]], [[begin-contour]] [S3][S4].
8. **Colour as a design system** — `colorMode`, perceptual OKLCH/LAB palettes **[2.x]**, contrast checks. Pages: [[color-mode]], [[color-spaces-2x]], [[color-contrast]] [S4][S47].
9. **Typography** — async `loadFont`, `textToContours` for animated letterforms, variable-font `textWeight` **[2.x]**. Pages: [[load-font]], [[text-to-contours]], [[text-weight]], [[kinetic-typography]] [S4][S46].
10. **Composition** — graphics buffers as layers; instance mode for embedding. Pages: [[p5-graphics]], [[layered-compositing]], [[instance-mode]] [S13][S96].

### Rungs 11–14: production (advanced → expert)
11. **Renderer choice** — P2D vs WEBGL (centre origin, camera, lights), framebuffers, `worldToScreen` for 2D labels on 3D. Pages: [[webgl-mode]], [[p5-framebuffer]], [[world-to-screen]], [[p5-camera]] [S349][S257][S4].
12. **Shaders via p5.strands** — filter and material hooks for post-effects; strands gained control flow (2.1) and math built-ins (2.3) **[beta]**. Pages: [[p5-strands]], [[shader-hooks]], [[filter-shaders]] [S351][S47][S274].
13. **Extending p5** — `registerAddon` lifecycle hooks, e.g. a predraw clock or postdraw capture add-on. Pages: [[register-addon]], [[lifecycle-hooks]], [[explainer-clock]] [S350].
14. **Shipping** — `describe()`/`textOutput()` accessibility, disabling FES for speed, deterministic export. Pages: [[describe]], [[text-output]], [[friendly-error-system]], [[save-gif]], [[frame-stepped-export]], [[video-export-pipeline]] [S347][S348][S143].

### Expert vs novice mental models (synthesis grounded in cited constructs)
- Novices think of objects that move; experts think of a frame re-derived from state and time, so scrubbing, export and determinism come free (see [[pure-function-of-t]]) [S8][S259].
- Novices transform shapes; experts transform coordinate systems and read code as nested frames [S15][S349].
- Novices draw everything every frame; experts cache invariant layers in buffers and pick a framebuffer when GPU texture use matters [S259][S257].
- Novices use global mode everywhere; experts treat it as a teaching convenience and embed with instance mode [S96].
- Experts recognise 1.x idioms (`preload`, `curveVertex`, `keyCode`) and translate them to 2.x (see [[version-2x-migration]]) [S4][S11].

### Production lessons from practitioners and engines
- Timing primitives are observations, not controls: `frameRate()` sets a target only, so reproducible export means stepping frames with `noLoop()` + `redraw()` (a Promise in 2.x) [S18][S9].
- Loop math divides frame index by total frames (not total minus one) and drives motion through periodic functions plus per-element offsets — the Jacob and Bees and Bombs method (see [[loop-phase-animation]], [[grid-offset-loop]]) [S186][S188].
- Seeded, hash-only randomness and resolution-relative geometry, as enforced by Art Blocks, make any frame re-renderable at any size (see [[seeded-determinism]], [[resolution-independence]]) [S374][S367].
- No mature p5 explainer engine exists; experts hand-roll a clock, track tweens and scenes (see [[explainer-engine-blueprint]], [[track-tween]], [[timeline-builder]]) [S170][S328].
- Package every episode with a runnable sketch, chapters and a showcase (see [[coding-train-episode-package]]) [S386].
- Sketch the beat on paper first, as both Shiffman and Whyte advise [S387][S188].

## Relations
- related_to [[capability-map]] — rungs map onto reference modules [S357]
- related_to [[explainer-engine-blueprint]] — rung 13–14 target architecture [S170]
- related_to [[version-2x-migration]] — expert translation of 1.x idioms [S11]
- related_to [[hub-language-core]] (structural)
- related_to [[hub-motion-rendering]] (structural)
- related_to [[hub-explainer-production]] (structural)
- related_to [[index]] — atlas entry point [S8]

## Sources
- [S3] — beginShape reference
- [S4] — v2.0.0 release notes
- [S8] — setup/draw lifecycle reference
- [S9] — redraw reference (Promise in 2.x)
- [S11] — compatibility README
- [S13] — p5.Graphics reference
- [S15] — push/pop reference
- [S18] — frameRate reference
- [S46] — Coding Train 2.0 typography
- [S47] — PF 2.1/2.2 post
- [S96] — instance mode docs
- [S127] — deltaTime reference
- [S143] — saveGif reference
- [S170] — p5.tween / engine survey
- [S186], [S188] — loop technique sources
- [S257], [S259] — framebuffer, graphics/transform reset
- [S274] — 2.3.0 post
- [S328] — Manim.js
- [S347], [S348] — FES contributor doc; accessibility docs
- [S349], [S350], [S351] — transform tutorial; creating libraries; strands
- [S357] — reference survey
- [S367], [S374] — Fidenza review; Art Blocks docs
- [S386], [S387] — Coding Train challenge pages
