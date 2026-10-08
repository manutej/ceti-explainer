---
id: algorithmic-art-skill
title: "algorithmic-art skill"
type: Tool
aliases: ["Anthropic algorithmic-art"]
sources: [S128, S137, S282, S283]
confidence: low
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# algorithmic-art skill

## Definition

The algorithmic-art skill is Anthropic's Claude agent skill that writes a philosophy statement and then produces seeded p5.js generative art; it shows about 79,380 installs on one aggregator index. [S282]

## Details

- The install count comes from vibeindex (updated 2026-06-09), a third-party aggregator, and is not authoritative. [S282]
- Anthropic's skills repository could not be reached directly (robots.txt), so the description rests on the aggregator listing. [S282]
- Seeded randomness is the key technique, matching the reproducibility rules used elsewhere in this atlas. [S282][S128]
- p5 2.x use: the skill is listed as using p5.js, but its version pin was not verified. [S282]

## In explainer work

Seeded output means a generated piece can be re-rendered frame by frame later; pair it with [[frame-stepped-export]] for video. [S282][S137]

## Relations

- related_to [[ai-assisted-p5]] — one of the agent skills in the p5 AI landscape [S282]
- related_to [[hermes-agent-p5js-skill]] — sibling skill with export pipeline [S283]
- uses [[p5js]] — targets p5.js output [S282]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S128] — randomSeed() (p5.js reference, undated)
- [S137] — Export Pipeline (p5js agent-skill reference) (third-party "hermes-agent" skill doc, hosted on a personal domain, undated)
- [S282] — Anthropic algorithmic-art skill listing (vibeindex (aggregator of anthropics/skills), updated 2026-06-09)
- [S283] — hermes-agent p5js skill (skills.sh listing of nousresearch/hermes-agent, first seen 2026-04-15)
