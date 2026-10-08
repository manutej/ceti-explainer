---
id: p5js-2x
title: "p5.js 2.x"
type: Platform
aliases: ["p5 v2", "p5@2", "p5 2.x line", "p5 npm latest dist-tag"]
sources: [S4, S10, S11, S47, S75, S114, S274, S275, S280, S283, S362, S374, S404]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---
# p5.js 2.x

## Definition
p5.js 2.x is the current major line: 2.0.0 was published 17 April 2025, the latest release is 2.3.4 (25 Sep 2026), and it is npm `latest` and the Web Editor default [S4][S362][S404].

## Details
- npm dist-tags: `latest` = 2.3.4, `r1` = 1.11.13, `beta` = 2.3.1-rc.2 [S362].
- 1.x was frozen at the end of March 2026 for further updates; GitHub still shows a 1.x release candidate (1.11.14-rc.2) [S114][S10].
- The Web Editor switched its default to 2.x on 31 July 2026 (editor v2.22.0) [S404].
- 2.0's headline breaks: `preload()` replaced by async setup, `curveVertex` → `splineVertex`, single-point `bezierVertex` with `bezierOrder`, plus new OKLCH/LAB colour modes and strands **[changed in 2.x]** [S4][S11].
- Minor lines since: [[release-2-1]] (types, add-on events, contrast), [[release-2-2]] (WebGPU), [[release-2-3]] (compute, filter shaders), with [[release-2-4]] on main [S47][S274][S275].
- Survey respondents were often unfamiliar with 2.0 and worried about breaking changes, prompting compatibility guides [S75].

## In explainer work
- LLM training data is dominated by 1.x idioms, so agent-generated explainer code must be pinned to `p5@2.3.x` with a 2.x rules block or the compatibility add-ons (see [[ai-assisted-p5]], [[cdn-version-pinning]]) [S11][S283].
- Art Blocks offers no 2.x, so 2.x-only features like async `loadFont` and `textToContours` are unavailable there [S374].

## Relations
- supersedes [[p5js-1x]] — current major line [S4]
- maintained_by [[processing-foundation]] — steward [S280]
- related_to [[version-2x-migration]] — migration path [S11]
- related_to [[editor-default-switch]] — became editor default [S404]
- related_to [[release-2-0]] — first release of the line [S4]
- related_to [[hub-people-community]] (structural)
## Sources
- [S4] — v2.0.0 release notes
- [S362] — npm registry metadata
- [S404] — Web Editor releases
- [S114] — issue #8870
- [S10] — GitHub releases
- [S11] — compatibility README
- [S47], [S274], [S275] — minor-release posts
- [S75] — dev-updates thread
- [S283] — hermes-agent p5js skill
- [S374] — Art Blocks docs
- [S280] — PF fellowship news
