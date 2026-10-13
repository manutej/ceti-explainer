---
id: camera-slerp
title: "Camera slerp"
type: Technique
aliases: ["p5.Camera.slerp", "camera interpolation", "Scripted camera move"]
sources: [S54, S67, S335, S357]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# Camera slerp

## Definition
`p5.Camera.slerp(cam0, cam1, amt)` interpolates a WEBGL camera's position and orientation between two cameras with `amt` in [0,1], and requires the same projection type on all cameras [S54][S335].

## Details
- Camera defaults are position (0,0,800), perspective with `fovy = 2*atan(height/2/800)`, near 80 and far 8000 [S54].
- The camera offers `lookAt`, `pan`, `tilt`, `move`, `setPosition`, `camera()`, `perspective`, `ortho`, `frustum`, `slerp` and `set`; `pan`/`tilt` follow `angleMode()` and work in local space, `lookAt`/`setPosition` work in world space [S54].
- Create separate cameras with `createCamera()`: two keyframes plus one working camera [S54].
- `p5.Camera.roll` and others render as global pages in the 2.x reference but the methods did not change [S357].

## In explainer work
A scripted camera move from a deterministic `t` is reproducible, whereas a wall-clock `t` is not [S54] (inference).

## Patterns
```js
let a, b, cam;
async function setup() {
  await createCanvas(800, 450, WEBGL);
  a = createCamera(); b = createCamera(); cam = createCamera();
  a.setPosition(0, 0, 800); b.setPosition(500, -300, 300); b.lookAt(0, 0, 0);
}
function draw() { background(20); const t = (frameCount % 240) / 240; cam.slerp(a, b, t); setCamera(cam); box(100); }
```
Pitfalls: cameras of different projection types cannot be slerped; use frame-derived `t` [S54].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- depends_on [[p5-camera]] — the object it operates on [S54]
- enables [[camera-choreography]] — keyed viewpoints [S335]
- depends_on [[webgl-mode]] — only meaningful in WEBGL [S54]
- related_to [[normalized-time]] — amt comes from t [S54]
- related_to [[p5-vector]] — vector slerp is a separate method [S67]

## Sources
- [S54] — Reference p5.Camera
- [S67] — p5.Vector reference
- [S335] — p5.Camera `slerp()` reference
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
