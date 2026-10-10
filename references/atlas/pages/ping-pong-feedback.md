---
id: ping-pong-feedback
title: "Ping-pong feedback framebuffers"
type: Technique
aliases: ["ping-pong framebuffers", "feedback buffers", "Feedback trails", "Framebuffer ping-pong feedback"]
sources: [S61, S131, S264, S269, S274]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# Ping-pong feedback framebuffers

## Definition
Ping-pong feedback uses two framebuffers swapped each frame so the previous frame is drawn, slightly faded, into the next, producing trails and feedback effects [S61].

## Details
- Use `format: FLOAT` so colours fade fully rather than stalling from 8-bit rounding [S61].
- In 3D, the previous-frame quad can block new geometry at the depth test; use `clearDepth()` or push the rectangle back in z [S61].
- Framebuffers are cleared only explicitly [S61].
- Feedback is accumulated state, so it does not scrub: a seek requires re-simulating from frame 0 (inference) [S61].
- Processing-Java experience shows GPU-to-CPU readback (`get()` on a buffer) is the main cost; pass buffers to shaders directly [S269].

## In explainer work
Gives motion trails, glow decay and reaction-style looks; for exports render frames in order, because frame N depends on N-1 [S61][S131] (inference).

## Patterns
```js
let a, b;
function setup() { createCanvas(600, 400, WEBGL); a = createFramebuffer({ format: FLOAT }); b = createFramebuffer({ format: FLOAT }); }
function draw() {
  b.begin(); clear(); tint(255, 245); image(a, -width/2, -height/2); noTint(); /* stamp new dots */ b.end();
  image(b, -width/2, -height/2);
  [a, b] = [b, a];                       // swap roles
}
```
Pitfalls: non-FLOAT buffers leave residue; clear depth before stamping [S61].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- depends_on [[p5-framebuffer]] — two surfaces [S61]
- conflicts_with [[pure-function-of-t]] — carries history [S61] (inference)
- related_to [[layered-compositing]] — sibling pattern [S61]
- related_to [[webgpu-compute]] — GPU alternative for simulation [S274]
- related_to [[perf-regressions-2x]] — point-shader slowdown workaround uses float framebuffers [S264]

## Sources
- [S61] — Layered Rendering with Framebuffers
- [S131] — Best way to export an animation from a p5.js sketch in 2026
- [S264] — Performance differences with POINTS between 1.11 and 2.0
- [S269] — Slow performance when passing multiple PGraphics into each other as shader textures
- [S274] — What's New in p5.js 2.3.0!
