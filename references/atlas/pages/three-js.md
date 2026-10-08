---
id: three-js
title: "three.js"
type: Library
aliases: ["threejs"]
sources: [S320, S396, S400, S402, S410]
confidence: low
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# three.js

## Definition

three.js is a 3D library with scenes, lights, shadows, materials and textures layered over WebGL; its manual's basic loop updates rotations from the timestamp and calls renderer.render each frame. [S410]

## Details

- Remotion integrates it through @remotion/three, where animation must come from useCurrentFrame and frameloop is 'never' during rendering. [S320][S396]
- canvas-sketch can host three.js and ships a three starter template. [S400][S402]
- No sourced head-to-head with p5 WEBGL mode was found. [S410]
- Maintenance 2026 and p5 2.x: independent library; not checked. [S410]

## In explainer work

Choose three.js for heavy 3D scene-graph work; the same rule applies as for p5: drive it from t, not its own render clock. [S320][S410]

## Relations

- alternative_to [[webgl-mode]] — scene graph on WebGL versus p5 immediate mode [S410]
- related_to [[remotion]] — official integration [S320]
- related_to [[canvas-sketch]] — can host it [S400]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S320] — Remotion `<ThreeCanvas>` (Remotion, undated)
- [S396] — Remotion docs, Third-party libraries (Remotion, undated)
- [S400] — canvas-sketch docs, WebGL/Three.js/P5.js section (Matt DesLauriers, undated)
- [S402] — canvas-sketch docs, Installation (Matt DesLauriers, undated)
- [S410] — three.js manual, Fundamentals (three.js, undated)
