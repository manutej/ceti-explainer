---
id: release-2-0
title: "p5.js 2.0"
type: Release
aliases: ["2.0.0", "v2.0.0"]
sources: [S4, S11, S75, S115, S117, S120, S362]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# p5.js 2.0

## Definition
p5.js 2.0.0 was released on 2025-04-17 as an opt-in major release; the release page shows only "17 Apr" but the Processing forum post gives April 2025, and npm records 2.0.0 published 2025-04-17 [S4][S75][S362]. It is the origin of the 2.x line (see [[p5js-2x]]).

## Details
### Headline changes
- [[preload]] replaced by [[async-setup]]; all `load*` functions return promises [S4][S115].
- Custom-shape API rewritten: [[spline-vertex]], [[bezier-vertex]] plus [[bezier-order]]; multiple curve types in one block [S4].
- Unified pointer events with `touches` and an object-valued `mouseButton`; `keyCode` deprecated [S4][S115].
- New color modes (RGBHDR, HWB, LAB, LCH, OKLAB, OKLCH) and the [[p2dhdr]] canvas; see [[color-spaces-2x]] [S4].
- Typography refactor: `textToContours`, `textToModel`, `textWeight`, variable fonts, a `textToPoints` reported about 350% faster [S4].
- Shader authoring: `strokeShader`, `imageShader`, `vertexProperty`, `p5.strands`, `linesMode(SIMPLE)`, `worldToScreen`/`screenToWorld`, `buildGeometry` [S4][S115].
- New add-on system around [[register-addon]] and [[lifecycle-hooks]] [S117].
- Removed dict and array helpers (see [[module-data]]); `p5.Table` and `splitTokens` deprecated [S4].
### Rollout
- `npm latest` moved to 2.x; the 2.x reference stayed on beta.p5js.org while 1.x stayed on p5js.org, and the Editor defaulted to 1.x until at least August 2026 per the notes [S4].
- An opt-in 1.x bridge shipped as [[p5js-compatibility]] [S11].

## In explainer work
2.0 is the baseline for every 2.x pattern in this atlas; assets via `await`, shapes via spline/bezier vertices, and typography via contours all require 2.0+ [S4].

## Relations
- part_of [[hub-language-core]] (structural)
- part_of [[p5js-2x]] — first release of the line [S362]
- supersedes [[p5js-1x]] — new major line [S362]
- related_to [[release-2-1]] — next minor [S120]
- related_to [[version-2x-migration]] — what broke [S4]
- related_to [[async-setup]] — headline change [S4]
- depends_on [[p5js-compatibility]] — bridge add-ons [S11]

## Sources
- [S4] — p5.js v2.0.0 release notes
- [S11] — p5.js-compatibility add-ons
- [S75] — [dev updates] p5.js 2.0: You Are Here
- [S115] — p5.js-compatibility README raw (differences list)
- [S117] — Designing an addon library system for p5.js 2.0
- [S120] — p5.js v2.1.0 release notes
- [S362] — npm registry metadata for `p5` (dist-tags latest 2.3.4, r1 1.11.13, beta 2.3.1-rc.2; 2.0.0 published 2025-04-17)
