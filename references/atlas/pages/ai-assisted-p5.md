---
id: ai-assisted-p5
title: "AI-assisted p5.js authoring"
type: Concept
aliases: ["Constrained LLM prompting", "LLM prompting for p5", "Reflexa", "Reflexa system", "Spellburst", "Spellburst interface", "Critical AI tutorials", "critical AI series", "Chatting with/about Code tutorial", "Sarah Ciston", "Chatting with/about Code"]
sources: [S11, S62, S252, S274, S282, S283, S284, S285, S286, S287, S290, S291, S317]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# AI-assisted p5.js authoring

## Definition

AI-assisted p5.js authoring covers LLM code generation, agent skills and research tools; evidence is mostly practitioner tooling with no rigorous evaluation. [S252][S283][S290]

## Details

- The p5js.org tutorial "Chatting with/about Code" (Ciston, Martinez, Atairu) recommends small steps, pseudocode, one feature per prompt, retyping, testing and citing; its ChatGPT example got the GIF-saving function wrong. [S252]
- LLM output defaults to 1.x idioms (preload, curveVertex, keyCode === UP_ARROW, 3D-default createVector) that break in 2.x; add a 2.x rules block or the compatibility add-ons, and use P3 not HDR from 2.3.1. **[changed in 2.x]** [S11][S274][S62]
- Agent skills: Anthropic's algorithmic-art skill (~79k installs on one index), Nous Research's hermes-agent p5js skill (HTML/PNG/SVG/MP4/GIF, headless export), and the genart-mcp server (marked inactive). [S282][S283][S284]
- Academic explainer-video generation targets Manim almost exclusively (TheoremExplainAgent, PhysicsSolutionAgent, LLM2Manim); p5 appears in HCI studies: Reflexa (Creativity Support Index 94.7, 18 people) and Spellburst (2023). [S285][S286][S287][S290][S291]
- Install counts come from aggregators and are not authoritative. [S282][S284]
- Not found: any benchmark of LLM-generated p5 explainers, or AI features in the Web Editor. [S252][S290]
- Folded here: Reflexa, Spellburst and the Critical AI tutorials series, a four-part p5js.org set on thoughtful AI use. [S290][S291][S252]

## In explainer work

For explainers, pin p5@2.3.x, give the agent the engine contract (scene code is a function of t, [[explainer-clock]]) and verify output by exporting frames with [[frame-stepped-export]]. [S283][S317]

## Relations

- related_to [[hermes-agent-p5js-skill]] — headless MP4/GIF agent pipeline [S283]
- related_to [[algorithmic-art-skill]] — seeded generative-art skill [S282]
- related_to [[genart-mcp]] — MCP server for sketches [S284]
- related_to [[cdn-version-pinning]] — prevents 1.x/2.x drift in generated code [S274]
- teaches [[p5js-2x]] — Critical AI tutorials teach thoughtful use with p5 [S252]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S11] — p5.js-compatibility add-ons (Processing Foundation, v0.1.2, 15 Apr 2025)
- [S62] — p5.js 2.3.1 release notes (mirror) (GitHub release via newreleases.io, date not shown (page said "2 months ago"))
- [S252] — Chatting with/about Code (Ciston, Martinez, Atairu) (p5js.org, undated (refs 2024))
- [S274] — What's New in p5.js 2.3.0! (Processing Foundation, 2026-06-22)
- [S282] — Anthropic algorithmic-art skill listing (vibeindex (aggregator of anthropics/skills), updated 2026-06-09)
- [S283] — hermes-agent p5js skill (skills.sh listing of nousresearch/hermes-agent, first seen 2026-04-15)
- [S284] — genart-mcp (@genart-dev/mcp-server) (glama.ai MCP directory, undated)
- [S285] — TheoremExplainAgent (Ku, Chong, Leung, Shah, Yu, Chen, 2025-02-26 (v2 2025-05-25))
- [S286] — PhysicsSolutionAgent (Thole, Agrawal, Ramamoorthy, Kumar, 2026-01-19)
- [S287] — LLM2Manim: Pedagogy-Aware AI Generation of STEM Animations (Joshi, Ke, Gajjar, Christian, Wang, Chen (SDSU), 2026-04-07)
- [S290] — Reflexa: LLM-Supported Reflection Scaffolding in Creative Coding (Wang, Li, Luo, Tong, Hui (HKUST), 2026-01-25)
- [S291] — Spellburst: Node-based Interface for Exploratory Creative Coding with Natural Language Prompts (authors not verified, 2023-08 (arXiv 2308))
- [S317] — Remotion 'CSS animations' troubleshooting (Remotion, undated)
