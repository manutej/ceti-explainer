---
id: virtual-clock-capture
title: "Virtual-clock capture"
type: Technique
aliases: ["virtual clock", "Virtual-clock capture of an existing time-based sketch"]
sources: [S131, S137, S138]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# Virtual-clock capture

## Definition

Virtual-clock capture hooks the browser's time APIs so a sketch that already reads millis() or Date advances one fixed step per captured frame without refactoring. [S138]

## Details

- CCapture's TimeWarp always hooks performance.now, requestAnimationFrame and setTimeout/setInterval, and by default also Date.now. [S138]
- It cannot step the Web Animations API or CSS animations and transitions, nor a realtime Web Audio context, so audio-reactive visuals drift unless audio is rendered offline. [S138]
- With p5 you must call noLoop() and drive redraw() from your own requestAnimationFrame while capturing, because p5 owns its loop. [S138]
- Maintenance of the flagship implementation is disputed (see [[ccapture]]). [S131][S138]

## In explainer work

Use it for legacy sketches; for new work prefer [[pure-function-of-t]] scenes with explicit [[frame-stepped-export]], which does not depend on hooking globals. [S138][S137]

## Patterns

### Pattern: capture a time-based sketch unchanged
When to use: the sketch reads millis() and you will not refactor it. [S138]
```js
const cap = new CCapture({ format: 'webm', framerate: 60 });
function startCapture() { noLoop(); cap.start(); tick(); }
function tick() { redraw(); cap.capture(drawingContext.canvas); requestAnimationFrame(tick); }
// on stop: cap.stop(); cap.save(); loop();
```
Pitfalls: Date.now is hooked for every Date object; CSS animations and Web Audio are not stepped. [S138]

## Relations

- depends_on [[ccapture]] — TimeWarp is its reference implementation [S138]
- alternative_to [[frame-stepped-export]] — hooks time instead of passing t [S138]
- conflicts_with [[audio-master-clock]] — real-time audio cannot follow a virtual clock [S138]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S131] — Best way to export an animation from a p5.js sketch in 2026 (Processing Discourse (poster slacle; replies by davepagurek), 2026 (per title))
- [S137] — Export Pipeline (p5js agent-skill reference) (third-party "hermes-agent" skill doc, hosted on a personal domain, undated)
- [S138] — CCapture.js README (spite (Jaume Sanchez), undated)
