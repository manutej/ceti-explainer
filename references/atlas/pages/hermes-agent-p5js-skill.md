---
id: hermes-agent-p5js-skill
title: "hermes-agent p5js skill"
type: Tool
aliases: ["p5 creative skill"]
sources: [S137, S253, S282, S283, S415]
confidence: low
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# hermes-agent p5js skill

## Definition

The hermes-agent p5js skill (Nous Research) is an agent skill pipeline for p5 sketches with headless HTML, PNG, SVG, MP4 and GIF export, first seen 2026-04-15. [S283]

## Details

- Its export-pipeline reference describes Puppeteer frame capture with noLoop(), a ready flag, redraw per frame, and ffmpeg recipes for MP4, audio mux, palette GIF and concat. [S137]
- It recommends randomSeed() and noiseSeed() for reproducibility, and notes 2.0 async setup. [S253][S415]
- Provenance is weak: the docs are hosted on mirrors with no named author, so treat recipes as community practice. [S137][S415]
- Not checked: whether its scripts work on p5 2.3.x. [S253]

## In explainer work

It is the best available worked example of an agent-driven headless explainer pipeline; adopt the structure ([[puppeteer-capture]], [[png-sequence-ffmpeg]]) but verify each recipe. [S137][S253]

## Relations

- exports_to [[ffmpeg]] — MP4 and GIF via ffmpeg [S253][S137]
- uses [[puppeteer-capture]] — headless frame capture [S137]
- related_to [[ai-assisted-p5]] — part of the agent-skill landscape [S283]
- related_to [[algorithmic-art-skill]] — sibling skill [S282]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S137] — Export Pipeline (p5js agent-skill reference) (third-party "hermes-agent" skill doc, hosted on a personal domain, undated)
- [S253] — hermes-agent p5js creative skill (commit listing) (community, undated)
- [S282] — Anthropic algorithmic-art skill listing (vibeindex (aggregator of anthropics/skills), updated 2026-06-09)
- [S283] — hermes-agent p5js skill (skills.sh listing of nousresearch/hermes-agent, first seen 2026-04-15)
- [S415] — Hermes-agent p5js skill file (mirror) (unnamed author, undated)
