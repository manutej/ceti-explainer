---
id: timeline-builder
title: "Timeline builder (play/wait/all/stagger)"
type: Pattern
aliases: ["Builder with play / wait / all / stagger"]
sources: [S311, S315, S321, S322, S323]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# Timeline builder (play/wait/all/stagger)

## Definition

A timeline builder is the authoring pattern that offers play, wait, all and stagger like Manim's play()/wait() or Motion Canvas's all/sequence, but compiles to absolute time intervals so seeking is a lookup rather than a replay. [S322][S311][S321]

## Details

- Manim scenes call play() and wait(); wait() is a no-op animation. [S322]
- Revideo's sequence starts tasks a fixed delay apart without waiting for each to finish, while chain runs them one after another; stagger must leave the cursor at the latest end, not the last start. [S311]
- A generator must be replayed from the start to reach an arbitrary time, and Remotion pays that same replay cost with GSAP; compiling ahead avoids it. [S321]
- The builder keeps a cursor, per-property track lists and a beats array; its duration is the final cursor. [S322]
- Whether Motion Canvas caches or replays when seeking was not verified in the docs read. [S315]

## In explainer work

This is pattern P3 of the [[explainer-engine-blueprint]]. Authors who prefer `yield*` prose can use [[generator-scenes]] as a compile step on top of it. [S311] Beats and captions come from the same cursor ([[beats-and-captions]]). [S322]

## Patterns

### Pattern: cursor builder
When to use: you want play/wait/all/stagger authoring with O(tracks) seeking. [S322][S311]
```js
function timeline() {
  let cursor = 0; const props = {}, beats = [];
  const api = {
    play(key, to, dur = 1, fn = 'smooth') { (props[key] ??= []).push(track(cursor, dur, api.at(key, cursor), to, fn)); cursor += dur; return api; },
    all(...steps) { const c0 = cursor; let end = c0; for (const s of steps) { cursor = c0; s(api); end = max(end, cursor); } cursor = end; return api; },
    wait(d = 1) { cursor += d; return api; },
    beat(label, caption) { beats.push({ label, caption, start: cursor }); return api; },
    at(key, t) { return (props[key] || []).reduce((v, tr) => t >= tr.start ? sample(tr, t) : v, init[key]); },
    get duration() { return cursor; }, beats };
  return api;
}
```
Pitfalls: stagger must end at the latest end; `init` holds starting values. [S311]

## Relations

- uses [[track-tween]] — emits tracks at absolute times [S323]
- enables [[beats-and-captions]] — beat() records a label at the cursor [S322]
- alternative_to [[generator-scenes]] — declarative cursor versus generator syntax [S311]
- related_to [[motion-canvas]] — borrows all/sequence/chain flow primitives [S311]
- related_to [[manim]] — borrows play()/wait() authoring [S322]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S311] — Revideo 'Animation flow' (Revideo (Motion Canvas fork), undated)
- [S315] — Motion Canvas Rendering (Motion Canvas, undated)
- [S321] — Remotion `useGsapTimeline()` (Remotion, undated (v4.0.517+))
- [S322] — Manim Community `Scene` reference (Manim Community, undated)
- [S323] — Manim Community `Animation` reference (Manim Community, undated)
