---
id: site-freecodecamp
title: "freeCodeCamp (source site)"
type: Site
aliases: ["freecodecamp.org (site)"]
sources: [S189, S308]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
---
# freeCodeCamp (source site)

## Definition
**freeCodeCamp** — tutorial articles on p5.js courses and canvas capture; operated by freeCodeCamp. [S189]

Kind: **community**; 2 registered sources, 0 rated primary. It is one of the source sites indexed in [[hub-sites]]. [S189][S308]

## What it contributes
- CCapture is used by calling `capturer.capture(canvas)` at the end of `draw()` [S308]
- Patt Vira's 2024 freeCodeCamp p5 course covers five projects, including 3D kinetic typography. [S189]
- When capturing with CCapture, you should derive duration from `frameCount / framerate`, not `millis()`, because slow renders distort elapsed wall time [S308]

## Pages that cite it

| page (9) | title |
|---|---|
| [[ccapture]] | CCapture.js |
| [[explainer-clock]] | One clock, three modes |
| [[explainer-engine-blueprint]] | Explainer engine blueprint |
| [[frame-stepped-export]] | Frame-stepped export |
| [[hub-explainer-production]] | Hub: Explainer production |
| [[hub-people-community]] | Hub: People, works and community |
| [[open-questions]] | Open questions and conflicts |
| [[patt-vira]] | Patt Vira |
| [[video-export-pipeline]] | Video export pipeline |

## Reliability
- Coverage: 2 sources (0 rated primary, 2 secondary by the researchers); year range 2019–2019, 1 without a recorded date. [S189][S308]
- Noted gap: **CCapture internals.** The freeCodeCamp source does not explain whether CCapture overrides `requestAnimationFrame` or `Date.now`. That claim is common folklore but was not verified here. [S308]
- Editorial: secondary, community-grade evidence.

## Sources
- [S189] — Patt Vira p5.js course writeup (community; undated)
- [S308] — "How to save canvas animations with CCapture" (community; 2019-03-22)
