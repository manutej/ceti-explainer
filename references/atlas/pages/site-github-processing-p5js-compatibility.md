---
id: site-github-processing-p5js-compatibility
title: "GitHub: processing/p5.js-compatibility (source site)"
type: Site
aliases: ["github.com/processing/p5.js-compatibility (site)"]
sources: [S11, S91, S115]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
---
# GitHub: processing/p5.js-compatibility (source site)

## Definition
**GitHub: processing/p5.js-compatibility** — the repository of 1.x-compatibility add-ons that restore removed 1.x behaviour in p5.js 2.x; operated by Processing Foundation. [S11]

Kind: **primary**; 3 registered sources, 3 rated primary. It is one of the source sites indexed in [[hub-sites]]. [S11][S91][S115]

## What it contributes
- The compatibility repo provides preload.js, shapes.js, data.js, events.js [S11][S115]
- In 2.x the browser pointer API handles mouse and touch together; mouse functions are defined as usual and the global `touches` array shows active pointers [S11][S91]
- All load* functions return promises in 2.x [S115]

## Pages that cite it

| page (44) | title |
|---|---|
| [[ai-assisted-p5]] | AI-assisted p5.js authoring |
| [[async-setup]] | async setup() |
| [[audio-master-clock]] | Audio master clock |
| [[bezier-order]] | bezierOrder() |
| [[bezier-vertex]] | bezierVertex() |
| [[build-geometry]] | buildGeometry() |
| [[capability-map]] | Capability map of p5.js 2.x |
| [[cdn-version-pinning]] | CDN version pinning |
| [[curve-api-1x]] | 1.x curve API (removed) |
| [[editor-default-switch]] | Web Editor default switch to 2.x |
| [[events-keyboard]] | Keyboard events |
| [[explainer-engine-blueprint]] | Explainer engine blueprint |
| [[frontier-2026]] | Frontier 2026 |
| [[getting-started-with-p5js]] | Getting Started with p5.js |
| [[hub-explainer-production]] | Hub: Explainer production |
| [[hub-motion-rendering]] | Hub: Motion, timing and rendering |
| [[index]] | p5.js Explainer Atlas |
| [[mastery-ladder]] | Mastery ladder |
| [[module-data]] | Data module |
| [[module-dom]] | DOM module |
| [[module-events]] | Events module |
| [[module-io]] | IO module |
| [[module-math]] | Math module |
| [[mouse-button-object]] | mouseButton object |
| [[open-questions]] | Open questions and conflicts |
| [[p5-element]] | p5.Element |
| [[p5-vector]] | p5.Vector |
| [[p5js]] | p5.js |
| [[p5js-1x]] | p5.js 1.x |
| [[p5js-2x]] | p5.js 2.x |
| [[p5js-compatibility]] | p5.js-compatibility add-ons |
| [[p5js-reference]] | p5.js Reference |
| [[p5js-web-editor]] | p5.js Web Editor |
| [[pointer-events]] | Pointer events (2.x) |
| [[preload]] | preload() |
| [[q5js]] | q5.js |
| [[register-addon]] | p5.registerAddon |
| [[release-2-0]] | p5.js 2.0 |
| [[release-2-3]] | p5.js 2.3 |
| [[shape-curves]] | Curves (bezier and spline functions) |
| [[shape-custom-shapes]] | Custom shapes |
| [[spline-vertex]] | splineVertex() |
| [[text-width]] | textWidth() / fontWidth() |
| [[version-2x-migration]] | 1.x to 2.x migration |

## Reliability
- Coverage: 3 sources (3 rated primary, 0 secondary by the researchers); year range 2025–2025, 2 without a recorded date. [S11][S91][S115]
- Noted gap: The compatibility README says createVector requires explicit dimensions with no add-on; the reference says only the no-argument form is deprecated with a warning (not an error). Minor conflict in severity; treat as deprecated-with-warning in 2.3.x. [S11]
- Noted gap: 1.x sunset dates: the Discourse post says no updates after March 2026 and Editor default to 2.0 in August 2026; the compatibility README says 1.x supported until August 2026. These differ; unclear which is authoritative. [S11]
- Noted gap: Conflict: compat README is inconsistent on textWidth vs fontWidth (leading/trailing space handling); 2.1.0 notes a textWidth fix related to spaces. Check the reference before relying. [S115]

## Sources
- [S11] — p5.js-compatibility add-ons (docs; v0.1.2, 15 Apr 2025)
- [S91] — p5.js-compatibility PR #32 README change (primary; undated)
- [S115] — p5.js-compatibility README raw (differences list) (primary; undated)
