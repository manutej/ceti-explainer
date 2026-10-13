---
id: motion-canvas
title: "Motion Canvas"
type: Tool
aliases: ["motioncanvas.io", "Tomáš Sláma", "slama.dev", "Canvas Commons", "waitUntil", "time events", "Signal", "useRandom", "Latex component (Motion Canvas)", "flow primitives"]
sources: [S227, S228, S229, S230, S231, S311, S312, S313, S314, S315, S316, S324]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# Motion Canvas

## Definition

Motion Canvas is an open-source TypeScript animation tool with generator-based imperative timelines, a browser editor, signals and drag-to-align time events, drawing to a single canvas. [S312][S313][S227]

## Details

- Scenes are generator functions: yield marks a frame, yield* delegates to tweens, and flow combinators all, any, chain, sequence, delay and loop manage concurrency. [S311][S312]
- Signals are lazily evaluated and cached reactive values that can be tweened; one signal can drive a whole derived diagram. [S314]
- waitUntil time events are dragged in the editor to line up with a voiceover. [S313]
- Rendering produces an image sequence (PNG, JPEG or WebP) with ffmpeg as an external step, and preview and render frame rates can differ. [S315]
- A built-in Latex component splits formula parts; shared parts tween between positions, parts only in the start fade out and parts only in the target fade in; fill must be set or nothing shows. [S231]
- useRandom is its seeded PRNG for deterministic renders. [S316]
- Maintenance status: Sláma and HN commenters say the original is unmaintained with Canvas Commons as the active fork, yet motioncanvas.io docs were fetchable on 2026-10-08. [S316][S324][S312]
- A 2026 comparison rates it the steepest learning curve of the three because of generators. [S229]
> **Conflict:** the original project is reported unmaintained and its site offline [S316][S324], but docs pages loaded on 2026-10-08 [S312][S313][S314]; possibly a mirror or restored site.

## In explainer work

Motion Canvas is the model for [[generator-scenes]], [[derived-geometry]] and [[audio-master-clock]] (time events). [S311][S314][S313] It has first-class LaTeX where p5 has no documented equivalent, so a formula-heavy explainer may use it beside p5 for custom visuals (inference). [S231][S229]

## Relations

- alternative_to [[remotion]] — imperative procedural versus declarative keyframe style [S227]
- related_to [[revideo]] — fork aimed at headless API-driven rendering [S228][S230]
- uses [[generator-scenes]] — scene authoring style [S312]
- uses [[derived-geometry]] — signals [S314]
- related_to [[manim]] — Manim is stronger for equation morphing [S229]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S227] — Remotion vs Motion Canvas (Remotion docs) (Remotion team, undated)
- [S228] — Remotion vs Motion Canvas vs Revideo programmatic video 2026 (PkgPulse, 2026 (exact date not seen))
- [S229] — Remotion vs Motion Canvas vs Manim: Best Code-to-Video Tool 2026 (beginnersinai.org, 2026)
- [S230] — Revideo docs, Designing animations (Revideo, undated)
- [S231] — Motion Canvas docs, LaTeX (Motion Canvas, undated)
- [S311] — Revideo 'Animation flow' (Revideo (Motion Canvas fork), undated)
- [S312] — Motion Canvas Quickstart (Motion Canvas, undated)
- [S313] — Motion Canvas Time Events (Motion Canvas, undated)
- [S314] — Motion Canvas Signals (Motion Canvas, undated)
- [S315] — Motion Canvas Rendering (Motion Canvas, undated)
- [S316] — Motion Canvas tutorial part 1 (Tomáš Sláma, 2024-10-04)
- [S324] — 'Show HN: I ported Manim to TypeScript' (manim-web, github.com/maloyan/manim-web) (maloyan + HN commenters, c. early 2026 ("7 months ago"))
