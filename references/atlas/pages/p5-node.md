---
id: p5-node
title: "p5-node"
type: Library
aliases: ["jsdom"]
sources: [S131, S137, S140, S153]
confidence: low
created: "2026-10-08"
updated: "2026-10-08"
version: "1.x"
---

# p5-node

## Definition

p5-node (andithemudkip) is an npm package that runs p5 under JSDOM in Node; a 2021 thread found it works for static images but pulls roughly 100 MB of dependencies. [S153]

## Details

- The 2021 Fastify thread hosted p5 1.1.9 via jsdom with runScripts dangerously and pretendToBeVisual. [S153]
- node-canvas is only a drawing surface and leaves p5's loop and runtime unresolved; micuat suggested noLoop. [S153]
- canvas-sketch docs warn that p5 and WebGL may not work in its experimental Node mode. [S140]
- Maintenance 2026 and p5 2.x: no 2.x evidence exists; only 2021 sources, so treat Node-side p5 as unsupported and use a headless browser. [S153][S140]

## In explainer work

For video, prefer [[puppeteer-capture]] or [[electron-ffmpeg-export]] over a DOM shim. [S153][S137]

## Relations

- related_to [[puppeteer-capture]] — headless browser is the dependable route [S153][S137]
- conflicts_with [[canvas-sketch]] — canvas-sketch Node mode may not work with p5 [S140]
- related_to [[electron-ffmpeg-export]] — alternative server-side route [S131]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S131] — Best way to export an animation from a p5.js sketch in 2026 (Processing Discourse (poster slacle; replies by davepagurek), 2026 (per title))
- [S137] — Export Pipeline (p5js agent-skill reference) (third-party "hermes-agent" skill doc, hosted on a personal domain, undated)
- [S140] — canvas-sketch: Exporting Artwork (Matt DesLauriers, undated)
- [S153] — Discourse: server-side render using node-canvas (DCsan, micuat, 2021-04-05)
