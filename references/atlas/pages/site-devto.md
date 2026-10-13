---
id: site-devto
title: "DEV Community (dev.to) (source site)"
type: Site
aliases: ["dev.to (site)"]
sources: [S112, S117, S146, S241]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
---
# DEV Community (dev.to) (source site)

## Definition
**DEV Community (dev.to)** — developer blog posts by p5.js contributors and library authors; operated by DEV / individual authors. [S112]

Kind: **community**; 4 registered sources, 2 rated primary. It is one of the source sites indexed in [[hub-sites]]. [S112][S117][S146]

## What it contributes
- Addons using registerAddon do not run on 1.x [S117]
- 2.0 removes preload; assets load via async setup with await [S112]
- p5.capture needs setDefaultOptions called before p5 initializes [S146]

## Pages that cite it

| page (27) | title |
|---|---|
| [[addon-events-api]] | Add-on Events API |
| [[async-setup]] | async setup() |
| [[ccapture]] | CCapture.js |
| [[community-export-pain]] | Video export as community pain point |
| [[decorators-api]] | Decorators API |
| [[dom-media]] | DOM media (createVideo, createAudio, createCapture) |
| [[draw]] | draw() |
| [[explainer-clock]] | One clock, three modes |
| [[frame-stepped-export]] | Frame-stepped export |
| [[hub-explainer-production]] | Hub: Explainer production |
| [[hub-people-community]] | Hub: People, works and community |
| [[kenneth-lim]] | Kenneth Lim |
| [[lifecycle-hooks]] | Add-on lifecycle hooks |
| [[module-structure]] | Structure module |
| [[open-questions]] | Open questions and conflicts |
| [[p5-capture]] | p5.capture |
| [[p5-woff2]] | p5.woff2 add-on |
| [[p5js-compatibility]] | p5.js-compatibility add-ons |
| [[p5js-libraries-directory]] | p5.js libraries directory |
| [[preload]] | preload() |
| [[register-addon]] | p5.registerAddon |
| [[release-2-0]] | p5.js 2.0 |
| [[setup]] | setup() |
| [[tapioca24]] | tapioca24 |
| [[text-weight]] | textWeight() and variable fonts |
| [[version-2x-migration]] | 1.x to 2.x migration |
| [[video-export-pipeline]] | Video export pipeline |

## Reliability
- Coverage: 4 sources (2 rated primary, 2 secondary by the researchers); year range 2022–2025, 2 without a recorded date. [S112][S117][S146]
- Researcher caveat on S117: contributor blog. This limits how far the wiki leans on the page [S117]
- Noted gap: **p5.capture determinism.** It captures after each draw, but it does not control `millis()` or `deltaTime`. If a sketch reads wall time, the export can still be wrong. The README does not address this. [S146]
- Editorial: secondary, community-grade evidence.

## Sources
- [S112] — Asynchronous p5.js 2.0 (community; undated)
- [S117] — Designing an addon library system for p5.js 2.0 (community; undated)
- [S146] — "I wrote a new library for recording p5.js sketches" (community; 2022-03-27)
- [S241] — Make JavaScript art with p5.js 2.0 (This Week in JavaScript) (community; 2025-04-28)
