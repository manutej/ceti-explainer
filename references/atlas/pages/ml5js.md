---
id: ml5js
title: "ml5.js"
type: Library
aliases: ["ml5", "ml5-next-gen", "Train-then-deploy ML demo"]
sources: [S156, S159, S172, S217, S219, S276, S277]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# ml5.js

## Definition

ml5.js is the friendly browser ML library from NYU ITP/IMA built on TensorFlow.js; ml5-next-gen reached v1.4.0 (7 Aug, 2026 inferred) and its constructors return promises under p5 2.x. [S219][S276][S277]

## Details

- Maintenance 2026: npm 1.4.0 published 2026-08-07, with TensorFlow.js 4.22 and MediaPipe hands/pose/face_mesh and other model dependencies; 0.12.2 and earlier live in an archived repo. [S159][S172]
- p5 2.x compatibility: v1.3.0 updated to p5 2.0.4 and v1.4.0 removed p5 1.x examples; `await ml5.faceMesh()` style constructors are promises, but ml5.neuralNetwork stays synchronous. **[2.x]** [S276][S277]
- It is maintained by NYU ITP/IMA and NYU Shanghai IMA, funded early by a 2018 Google Research Award. [S219]
- The next-gen README says it will keep API compatibility toward a future ml5 2.x and is "in development". [S172]
- Model names were inferred from npm dependency names only. [S159]

## In explainer work

Train in [[teachable-machine]], export, then run with ml5 inside p5 for ML-concept explainers; ITP Camp 2023 taught this flow. [S217] Await constructors in [[async-setup]]. [S277]

## Relations

- integrates_with [[p5js-2x]] — async model constructors for p5 2.x [S277]
- related_to [[teachable-machine]] — trained models run with ml5 [S217]
- depends_on [[async-setup]] — promise-returning constructors [S277]
- related_to [[p5js-libraries-directory]] — listed there [S156]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S156] — p5.js Libraries page (Processing Foundation/p5.js, checked 2026-10-08)
- [S159] — npm registry metadata (p5, p5.sound, p5.brush, p5.grain, p5.js-svg, p5.fillgradient, p5play, tone, ml5, p5.collide2d, p5.createloop, p5.capture, p5.plotsvg, p5.tree, matter-js, roughjs) (npm, queried 2026-10-08)
- [S172] — ml5-next-gen repo (ml5.js, undated)
- [S217] — Teaching the Machine with p5.js and ml5.js (ITP Camp 2023) (NYU ITP, 2023-06-14)
- [S219] — ml5.js About (ml5.js project, undated)
- [S276] — ml5-next-gen releases (ml5.js team, v1.4.0 dated 07 Aug (2026 inferred; see Gaps))
- [S277] — Using ml5.js with p5.js 2.0: Now with Async Model Constructors (Bairui Su / ml5.js, 2025-07-29)
