---
id: puppeteer-capture
title: "Puppeteer headless capture"
type: Technique
aliases: ["Headless Chrome capture", "Puppeteer frame capture", "headless Chrome export", "Puppeteer + ffmpeg 4K", "Headless Chrome (Puppeteer) capture"]
sources: [S131, S137, S253, S283, S338]
confidence: low
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# Puppeteer headless capture

## Definition

Puppeteer headless capture runs the sketch in headless Chrome, calls redraw() per frame and screenshots the canvas, then assembles the frames with ffmpeg. [S137]

## Details

- The sketch uses noLoop() and sets window._p5Ready; the Node script then loops redraw() and screenshots the canvas. [S137]
- A free-running draw loop during screenshots causes duplicate or missing frames when screenshots are slow. [S137]
- Fixed timeouts are fragile, and the doc recommends frameCount-based timing plus randomSeed/noiseSeed for determinism. [S137]
- Source quality: the doc is an unattributed third-party agent-skill reference on a personal domain, so treat its recipes as plausible community practice. [S137]
- Not covered by sources: headless GPU/WebGL screenshot performance and 4K memory limits per canvas. [S137]
- Community agent skills package this pattern for 2.x with async setup notes. [S253][S283]

## In explainer work

Because redraw() in 2.x returns a Promise, the driver can wait for each frame to finish before capturing, which is the robust version of the _p5Ready handshake. [S338][S137] It is a headless alternative to [[electron-ffmpeg-export]] for pipelines that agents generate. [S253]

## Relations

- uses [[ffmpeg]] — assembles screenshots and muxes audio [S137]
- depends_on [[frame-stepped-export]] — is a driver for stepped capture [S137]
- related_to [[hermes-agent-p5js-skill]] — the skill documents this pipeline [S253][S283]
- alternative_to [[electron-ffmpeg-export]] — headless Chrome rather than Electron [S131][S137]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S131] — Best way to export an animation from a p5.js sketch in 2026 (Processing Discourse (poster slacle; replies by davepagurek), 2026 (per title))
- [S137] — Export Pipeline (p5js agent-skill reference) (third-party "hermes-agent" skill doc, hosted on a personal domain, undated)
- [S253] — hermes-agent p5js creative skill (commit listing) (community, undated)
- [S283] — hermes-agent p5js skill (skills.sh listing of nousresearch/hermes-agent, first seen 2026-04-15)
- [S338] — `redraw()` reference (p5.js, undated)
