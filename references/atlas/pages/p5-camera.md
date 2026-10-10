---
id: p5-camera
title: "p5.Camera"
type: Construct
aliases: ["createCamera()", "3D/Camera", "camera object"]
sources: [S4, S54, S56, S335, S357]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# p5.Camera

## Definition
`p5.Camera` (from `createCamera()`) is the WEBGL camera object offering perspective, ortho, frustum, `lookAt`, `pan`, `tilt`, `move`, `setPosition`, `slerp` and `set` [S54].

## Details
- Defaults: position (0,0,800), perspective `fovy = 2*atan(height/2/800)`, near 80, far 8000 [S54].
- `pan`/`tilt` follow `angleMode()` and work in local space, while `lookAt`/`setPosition` work in world space [S54].
- `slerp` requires cameras with the same projection [S54].
- The 3D/Camera group has 9 entries: camera, createCamera, frustum, linePerspective, ortho, p5.Camera, perspective, roll, setCamera [S357].
- `orbitControl` (3D/Interaction) is for live exploration, not rendered video [S357].
- The camera is part of the shared renderer delegation: Geometry, Framebuffer, Texture, Camera and Shader delegate to the renderer [S56].

## In explainer work
Create keyframe cameras and one working camera for scripted moves (see [[camera-slerp]]); use `worldToScreen` to attach 2D labels to 3D points [S54][S4].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- part_of [[module-3d]] — 3D/Camera [S357]
- depends_on [[webgl-mode]] — WEBGL object [S54]
- enables [[camera-slerp]] — interpolation between cameras [S54]
- related_to [[camera-choreography]] — keyed moves [S335]
- related_to [[world-to-screen]] — project camera space to labels [S4]

## Sources
- [S4] — p5.js v2.0.0 release notes
- [S54] — Reference p5.Camera
- [S56] — Contribute: Using WebGPU mode
- [S335] — p5.Camera `slerp()` reference
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
