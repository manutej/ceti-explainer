---
id: camera-choreography
title: "Camera choreography"
type: Pattern
aliases: ["keyed camera", "2D keyed camera"]
sources: [S54, S302, S335]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# Camera choreography

## Definition
Camera choreography treats the camera as animated tracks on the same timeline as everything else: 2D keyed `x`, `y`, `zoom` tracks, or in WEBGL keyed `p5.Camera` objects blended with `slerp` [S335][S302].

## Details
- pirelaurent's p5_animationFramework mounts cameras on movable tripods that follow scenario-driven moves and Bezier paths [S302].
- 2D version: `translate(width/2, height/2); scale(z); translate(-cx, -cy)` with `z`, `cx`, `cy` read from tracks [S335] (blueprint pattern).
- WEBGL version: `cam.slerp(camA, camB, ease(u))`; both cameras must share a projection [S335].
- Tween zoom in log space, or deep zooms feel like they accelerate [S335].
- Draw captions after `resetMatrix()` so the camera does not move them [S335].

## In explainer work
Keyed cameras give zoom-ins on diagram parts and pans between regions without mutating scene objects [S302][S335].

## Patterns
```js
function camera2D(t) {
  const z = exp(lerp(log(z0), log(z1), ease(t))), cx = lerp(x0, x1, ease(t)), cy = lerp(y0, y1, ease(t));
  translate(width / 2, height / 2); scale(z); translate(-cx, -cy);
}
```
Pitfalls: apply before scene drawing and reset before captions [S335].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- uses [[camera-slerp]] — WEBGL blend [S335]
- uses [[p5-camera]] — keyed camera objects [S54]
- depends_on [[normalized-time]] — tracks are functions of t [S335]
- related_to [[p5-animation-framework]] — tripod camera idea [S302]
- related_to [[explainer-engine-blueprint]] — blueprint pattern P10 [S335]

## Sources
- [S54] — Reference p5.Camera
- [S302] — p5_animationFramework README
- [S335] — p5.Camera `slerp()` reference
