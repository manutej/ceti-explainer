---
id: frontier-2026
title: "Frontier 2026"
type: Concept
aliases: ["p5.js frontier"]
sources: [S10, S11, S46, S47, S48, S62, S114, S121, S131, S274, S275, S276, S277, S278, S279, S280, S282, S283, S284, S285, S286, S287, S288, S294, S295, S297, S360, S362, S404]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---
# Frontier 2026

## Definition
Frontier 2026 separates what is genuinely new for p5.js explainer work in the twelve months to October 2026 from what is hype or immature. As of 8 October 2026 p5.js is on 2.3.4 (25 Sep 2026), with 2.4 being built on `main` [S10][S362].

## Details
### Genuinely new (shipped)
- **Experimental WebGPU renderer** — arrived in [[release-2-2]] (RC around 1 Jan 2026), loaded as `p5.webgpu.js` with an awaited `createCanvas(..., WEBGPU)` **[beta]** [S47][S48][S62].
- **WebGPU compute shaders** — added in 2.3.0 (PF post 22 Jun 2026), demonstrated with Game of Life; see [[webgpu-compute]] **[beta]** [S274].
- **p5.strands grew up** — control flow in 2.1; flatter API in 2.2.1; `millis()` in 2.2.2; `random()`, `map()`, `lerp()` and 2D filter shaders in 2.3.0; `randomGaussian()`, `color()` and hex colours in 2.3.1; see [[p5-strands]] [S47][S274][S62].
- **Breaking rename** — v2.3.1 renamed the HDR colour constant to P3; see [[p3-hdr-color]] **[changed in 2.x]** [S62].
- **1.x frozen and 2.x is the default everywhere** — 1.x frozen end of March 2026; npm `latest` = 2.3.4 with `r1` = 1.11.13; Web Editor default switched on 31 July 2026 (editor v2.22.0); see [[editor-default-switch]] [S114][S362][S404].
- **Infrastructure** — a bot builds a testable p5.js for each PR, and a custom-build server is in alpha; see [[custom-build-server]] [S274][S295].
- **ml5.js v1.4.0** (Aug 2026) dropped p5 1.x examples; in 2.x ml5 constructors return promises [S276][S277].
- **Accessibility** — a colour-contrast checker landed in 2.1; `describe()`/`textOutput()` saw fixes, not reinvention [S47][S288].

### Merged, not released **[main / unreleased]**
- **GPU instancing** — `instances(500).sphere(20)` captioned "Coming in p5.js 2.4"; 800 trees in two draw calls; tracking issue fully checked off; see [[gpu-instancing]], [[release-2-4]] [S275][S278].
- **Native SVG import/export and strands matrix types** on main after 2.3.4, which may change before release; see [[p5-svg-main-branch]] [S360].

### Institutional
- PF has been run by executive co-directors since Nov 2024; late Sep–Oct 2026 it announced Riot Games, Mark Cuban Foundation and Jerome Foundation as Fellowship backers and a 2027 Gaming Fellowship; see [[processing-foundation]], [[pf-fellowships]] [S279][S280].
- 2026 OSS microgrants funded strands instancing and GLSL→strands example translation; see [[oss-microgrants]] [S275][S294].
- PCD 2026 events were recommended for October, Processing's 25th year; see [[processing-community-day]] [S297].

### Hype or immature
- **"AI generates p5 explainers"** — agent skills (algorithmic-art, ~79k installs on one aggregator; hermes-agent p5js with headless MP4/GIF export) and MCP servers (genart-mcp, marked inactive) exist, but none has a published evaluation; see [[ai-assisted-p5]], [[algorithmic-art-skill]], [[hermes-agent-p5js-skill]], [[genart-mcp]] [S282][S283][S284].
- **Research explainer agents target Manim, not p5** — TheoremExplainAgent, PhysicsSolutionAgent and LLM2Manim all render with Manim and still report layout or codegen failures; see [[llm-explainer-agents]] [S285][S286][S287].
- **WebGPU as a WebGL replacement** — Pagurek calls WebGPU mode a feature-parity clone of WebGL, says 2D is not optimised, and frames WebGPU as a multi-year direction [S48].
- **New typography** — none found in 2.1–2.3; typography innovation dates from 2.0 [S47][S10].

### What it means for explainer makers
- Bleeding edge: strands + instancing for thousands of animated elements, WebGPU compute for GPU particle systems, 2.0 typography (`textWeight`, `textToContours`, `textToModel`) for kinetic titles [S275][S274][S46].
- Pin versions: LLM training data is dominated by 1.x idioms, and generated code using `HDR` breaks on 2.3.1+ (see [[cdn-version-pinning]]) [S11][S62].
- Export remains the community's unsolved pain; see [[community-export-pain]] and [[video-export-pipeline]] [S131].

> **Conflict:** 2.3.0 date — GitHub notes show 28 May [S121] vs PF post 22 Jun 2026 [S274].

## Relations
- related_to [[release-2-3]] — current line [S274]
- related_to [[release-2-4]] — next release on main [S275]
- related_to [[webgpu-renderer]] — headline new renderer [S48]
- related_to [[llm-explainer-agents]] — AI frontier assessment [S285]
- related_to [[ai-assisted-p5]] — practitioner AI tooling [S283]
- related_to [[open-questions]] — unresolved frontier items [S10]
- related_to [[index]] — atlas entry point [S362]

## Sources
- [S10] — GitHub releases
- [S11] — compatibility README
- [S46] — Coding Train 2.0 typography
- [S47] — PF post on 2.1 and 2.2
- [S48] — Pagurek, WebGPU in p5.js
- [S62] — v2.3.1 notes
- [S114] — issue #8870
- [S121] — v2.3.0 release notes
- [S131] — 2026 export thread
- [S274] — What's new in 2.3.0
- [S275], [S278] — instancing preview; issue #8911
- [S276], [S277] — ml5 releases; ml5 with p5 2.0
- [S279], [S280] — PF co-directors; Riot fellowship news
- [S282], [S283], [S284] — agent skills, MCP
- [S285], [S286], [S287] — Manim explainer agents
- [S288] — PR #8125 accessibility fix
- [S294], [S295], [S297] — microgrants; custom builds; PCD
- [S360] — main-branch source survey
- [S362] — npm registry
- [S404] — Web Editor releases
