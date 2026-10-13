---
id: genart-mcp
title: "genart-mcp"
type: Tool
aliases: ["@genart-dev/mcp-server"]
sources: [S283, S284]
confidence: low
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# genart-mcp

## Definition

genart-mcp (@genart-dev/mcp-server) is an MCP server that lets agents create, fork, screenshot and export sketches across p5, Three.js, GLSL, Canvas2D and SVG, but it is marked Inactive. [S284]

## Details

- p5.js is one of five renderers it supports, with headless screenshot capture. [S284]
- The Glama directory listing is undated and the "Inactive" label is the only maintenance evidence. [S284]
- p5 2.x compatibility: not stated. [S284]

## In explainer work

Do not depend on it for production explainers; at most it is a reference for MCP-style sketch tooling. [S284]

## Relations

- related_to [[ai-assisted-p5]] — listed with other agent tools [S284]
- integrates_with [[p5js]] — one of five renderers [S284]
- related_to [[hermes-agent-p5js-skill]] — alternative agent tooling [S283]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S283] — hermes-agent p5js skill (skills.sh listing of nousresearch/hermes-agent, first seen 2026-04-15)
- [S284] — genart-mcp (@genart-dev/mcp-server) (glama.ai MCP directory, undated)
