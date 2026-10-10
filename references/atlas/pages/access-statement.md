---
id: access-statement
title: "Access Statement"
type: Concept
aliases: ["p5.js access statement"]
sources: [S20, S47, S342, S343, S347, S348, S354]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# Access Statement

## Definition
The p5.js Access Statement is the policy that new features are admitted only if they increase access (inclusion and accessibility) [S343]. It favours slowness and accountability over speed and growth [S343].

## Details
- Priority groups include non-English speakers, disabled people, newcomers, children and elders, and people with limited internet access [S343].
- API consistency counts as access work because it helps beginners, for example adding `arcVertex()` to match other shape functions [S343].
- Performance improvements for less powerful hardware also count as access work [S343].
- It shows up in the API as the [[friendly-error-system]], translated messages, screen-reader functions ([[describe]], [[text-output]]) and consistency decisions such as the 2.0 vertex API [S347][S348][S20].
- The website rebuild targeted fast loading on slow connections and multiple languages [S354].

## In explainer work
The statement justifies shipping accessible explainers: describe the canvas, check contrast, avoid motion-only meaning (inference from the policy's priority groups) [S343][S47].

## Relations
- part_of [[hub-language-core]] (structural)
- enables [[friendly-error-system]] — access-driven feature [S343]
- enables [[describe]] — screen-reader support [S348]
- related_to [[color-contrast]] — accessibility utility [S47]
- related_to [[p5js-governance]] — project values [S342]

## Sources
- [S20] — RFC issue #6766, vertex function API redesign
- [S47] — p5.js 2.1 and 2.2: Expanding Graphics Avenues with p5.strands improvements and WebGPU
- [S342] — p5.js About
- [S343] — p5.js Access Statement
- [S347] — Friendly Error System (contributor docs)
- [S348] — Writing Accessible Canvas Descriptions (tutorial)
- [S354] — Bocoup: p5.js website rebuild
