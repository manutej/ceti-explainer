---
id: processing-p5-mode
title: "Processing p5.js Mode"
type: Tool
aliases: ["p5.js mode"]
sources: [S131, S238]
confidence: low
created: "2026-10-08"
updated: "2026-10-08"
version: "1.x"
---

# Processing p5.js Mode

## Definition

Processing p5.js Mode is the Electron-based Processing editor mode for p5 sketches; it can call Node and ffmpeg, but its experimental 2.x version had platform problems in 2026. [S131][S238]

## Details

- davepagurek noted it can call Node and ffmpeg, which makes it an Electron export route. [S131]
- As of May to June 2026 the stable plugin was not on 2.x; users edited the generated index.html or used VS Code with a CDN link. [S238]
- On 2026-05-16 another user could not get the experimental mode working on Windows 10 or 11; these are single-thread reports, not a confirmed bug list. [S238]
- The community workaround is plain VS Code with a jsDelivr script tag pinned to 2.2.2; the mode is named "1.6" and no official source states its bundled p5 version. [S238]

## In explainer work

For explainer export prefer a dedicated [[electron-ffmpeg-export]] setup, and pin p5 explicitly per [[cdn-version-pinning]]. [S131][S238]

## Relations

- enables [[electron-ffmpeg-export]] — Electron plus Node plus ffmpeg access [S131]
- conflicts_with [[p5js-2x]] — 2026 platform issues with 2.x [S238]
- related_to [[processing]] — plugin for the Processing editor [S238]
- related_to [[vscode-live-server]] — the common workaround [S238]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S131] — Best way to export an animation from a p5.js sketch in 2026 (Processing Discourse (poster slacle; replies by davepagurek), 2026 (per title))
- [S238] — How to manually modify the P5js plugin (stable version) to use the 2.0 version? (Processing Discourse (EricRogerGarcia, glv, quark), 2026-05-14 to 2026-06-01)
