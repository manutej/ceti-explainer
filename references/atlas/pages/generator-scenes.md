---
id: generator-scenes
title: "Generator scenes"
type: Technique
aliases: ["Generator scene", "function*", "yield*", "Generator authoring"]
sources: [S311, S312, S316, S321]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# Generator scenes

## Definition

Generator scenes write a scene as a function* whose yields mark frames and whose yield* delegates to tweens, the style of Motion Canvas and Revideo. [S311][S312]

## Details

- In Motion Canvas and Revideo each yield marks the current frame ready and yield* delegates to a tween generator for its duration. [S311]
- Calling a property with a value and a duration, such as `.fill(c, 1)`, creates a tween, and `.to()` chains more. [S312]
- Motion Canvas's loop never finishes, so it must run concurrently via yield or spawn. [S311]
- True generator semantics force a replay per seek, so in p5 run the generator once at load to build the schedule and seek the compiled schedule. [S311][S321]
- Motion Canvas animates individual properties whereas Manim transforms whole objects between states. [S316]
- The original Motion Canvas is described as unmaintained with Canvas Commons the active fork; Revideo is another fork. [S316][S311]

## In explainer work

In p5, generators are an authoring convenience only: time lives in the builder cursor ([[timeline-builder]]), and the yields merely pace authoring. [S311] See [[motion-canvas]] and [[revideo]] for the originals. [S312][S311]

## Patterns

### Pattern: compile a generator
When to use: authors want `yield*`-style prose but you need cheap seeking. [S311]
```js
function* scene(tl) { yield tl.play('circle.r', 80, 1); yield tl.wait(0.5); yield tl.play('circle.x', 400, 1); }
function compile(genFn) { const tl = timeline(); for (const _ of genFn(tl)) {} return tl; }
```
Pitfalls: do not rely on yields for timing; the cursor is the clock. [S321]

## Relations

- related_to [[timeline-builder]] — compile target of the generator [S311]
- related_to [[motion-canvas]] — origin of the style [S312]
- related_to [[revideo]] — fork keeping the generator flow API [S311]
- part_of [[explainer-engine-blueprint]] — pattern P4 [S311]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S311] — Revideo 'Animation flow' (Revideo (Motion Canvas fork), undated)
- [S312] — Motion Canvas Quickstart (Motion Canvas, undated)
- [S316] — Motion Canvas tutorial part 1 (Tomáš Sláma, 2024-10-04)
- [S321] — Remotion `useGsapTimeline()` (Remotion, undated (v4.0.517+))
