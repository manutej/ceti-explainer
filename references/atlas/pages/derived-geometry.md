---
id: derived-geometry
title: "Derived geometry (signals-lite)"
type: Pattern
aliases: ["signals-lite"]
sources: [S314, S317, S323]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# Derived geometry (signals-lite)

## Definition

Derived geometry (signals-lite) computes dependent sizes, endpoints and labels inside render(t) from tracked primitives and never stores them, reproducing what Motion Canvas computed signals give for free. [S314]

## Details

- Motion Canvas signals are lazily evaluated and cached; a change to a dependency only marks a computed signal for recalculation. [S314]
- One tweened signal can drive an entire derived diagram, including sizes, line endpoints and labels. [S314]
- In a pure render(t) the same effect needs no reactivity: compute the tip, label text and angles from tl.at(key, t) each frame. [S314]
- Never write derived values back into scene state, which would break seeking. [S317]

## In explainer work

Derived geometry is why a single tracked radius or angle can animate a whole vector diagram with its labels, as in pattern P11 of the [[explainer-engine-blueprint]]. [S314]

## Patterns

### Pattern: derive in render
When to use: many elements depend on one quantity. [S314]
```js
function vectorScene(t) {
  const r = tl.at('r', t), th = tl.at('theta', t);
  const tip = { x: r * cos(th), y: -r * sin(th) };   // derived each frame, never stored
  line(0, 0, tip.x, tip.y); text(`|v| = ${r.toFixed(0)}`, tip.x + 8, tip.y);
}
```
Pitfalls: angleMode affects cos/sin; set it once. [S314]

## Relations

- part_of [[explainer-engine-blueprint]] — pattern P11 [S314]
- related_to [[motion-canvas]] — signals are the model being imitated [S314]
- related_to [[pure-function-of-t]] — derived values are recomputed from t each frame [S317]
- related_to [[track-tween]] — supplies the primitives that derivations read [S323]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S314] — Motion Canvas Signals (Motion Canvas, undated)
- [S317] — Remotion 'CSS animations' troubleshooting (Remotion, undated)
- [S323] — Manim Community `Animation` reference (Manim Community, undated)
