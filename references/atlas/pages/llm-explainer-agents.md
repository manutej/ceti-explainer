---
id: llm-explainer-agents
title: "LLM explainer-video agents"
type: Concept
aliases: ["TheoremExplainAgent", "TheoremExplainBench", "PhysicsSolutionAgent", "LLM2Manim"]
sources: [S283, S284, S285, S286, S287, S290]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---
# LLM explainer-video agents

## Definition
LLM explainer-video agents are research systems that generate narrated educational animations from a prompt; the published work targets Manim almost exclusively, not p5.js [S285][S286][S287].

## Details
- TheoremExplainAgent (Feb 2025) generates long-form Manim theorem videos and reports 93.8% video-generation success with o3-mini on a 240-theorem benchmark [S285].
- PhysicsSolutionAgent (Jan 2026) generates up to 6-minute Manim physics videos with a VLM feedback loop, reaching 100% completion and 3.8/5 automated score with GPT-5-mini; it names reliable Manim code generation as a key limitation [S286].
- LLM2Manim (Apr 2026) is a human-in-the-loop, pedagogy-aware pipeline; its animations beat PowerPoint slides on adjusted post-test (83.4 vs 78.1, n=100 undergrads) [S287].
- No arXiv benchmark evaluating LLM-generated p5.js explainers was found; p5 appears instead in HCI creativity-support studies such as Reflexa [S290].

## In explainer work
- The research gap is an opening: p5-based agent pipelines (skills, MCP servers) exist but have no published evaluation; see [[ai-assisted-p5]] [S283][S284].
- Lessons transfer: these agents report layout failures even on Manim, so any p5 agent pipeline needs visual verification passes [S285][S286].

## Relations
- uses [[manim]] — render target of all three systems [S285][S287]
- alternative_to [[ai-assisted-p5]] — research Manim route vs community p5 tooling [S283]
- related_to [[frontier-2026]] — AI-frontier assessment [S285]
- related_to [[hermes-agent-p5js-skill]] — p5 practitioner analogue [S283]
- related_to [[hub-people-community]] (structural)
## Sources
- [S285] — TheoremExplainAgent
- [S286] — PhysicsSolutionAgent
- [S287] — LLM2Manim
- [S290] — Reflexa
- [S283] — hermes-agent p5js skill
- [S284] — genart-mcp
