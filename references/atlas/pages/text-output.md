---
id: text-output
title: "textOutput() / gridOutput()"
type: Construct
aliases: ["textOutput", "gridOutput"]
sources: [S288, S343, S348, S357]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# textOutput() / gridOutput()

## Definition
`textOutput()` and `gridOutput()` auto-generate screen-reader descriptions of canvas shapes: a shape list and a spatial table respectively [S348][S288]. Both live in the Environment group [S357].

## Details
- Call them in `draw()` so the generated description tracks the animation; PR 8125 fixed broken examples and reviewers asked for calls in `draw()` to show live updates [S288].
- Do not combine `textOutput()` with `describeElement()` [S348].
- They complement the manual `describe()` label (see [[describe]]) [S348].

## In explainer work
Use for exploratory sketches where shapes change often; for authored explainers, a written `describe()` per beat conveys the intended narrative better (inference) [S288][S348].

## Relations
- part_of [[module-environment]] — Environment-group entries [S357]
- part_of [[hub-language-core]] (structural)
- conflicts_with [[describe]] — not to be combined with describeElement [S348]
- related_to [[access-statement]] — accessibility values [S343]
- related_to [[draw]] — should be called each frame [S288]

## Sources
- [S288] — PR #8125: fix textOutput()/gridOutput() examples
- [S343] — p5.js Access Statement
- [S348] — Writing Accessible Canvas Descriptions (tutorial)
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
