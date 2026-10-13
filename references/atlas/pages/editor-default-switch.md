---
id: editor-default-switch
title: "Web Editor default switch to 2.x"
type: Concept
aliases: ["p5.js Web Editor default version", "editor default"]
sources: [S11, S47, S114, S362, S404, S405]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---
# Web Editor default switch to 2.x

## Definition
The p5.js Web Editor made p5.js 2.x the default version for new sketches on 31 July 2026, in editor release v2.22.0, which includes PR #4232 "Set p5.js v2 to Default" [S404][S114].

## Details
- Issue #8870 scheduled the switch for the start of August 2026; it says nothing about CDN, npm `latest` or site switch dates [S114].
- Editor v2.20.8 (10 Apr) had set the default to 1.11.13, so 1.11.13 was the default before the switch [S404].
- Editor v2.21.2 (14 Jul) added a banner announcing the v2.0 default; v2.22.1 (11 Aug) pointed the autocomplete hinter at p5js.org for v2 [S404].
- The editor releases page omits years; the 2026 attribution rests on cross-matching issue #8870 and npm publish dates [S404][S114].
- npm `latest` for p5 is 2.3.4, with `r1` pinned to 1.11.13 **[2.x]** [S362].
- The Download and Tutorials pages still open the editor with `version=2.3.3`, a lag rather than a conflict [S405].

> **Conflict:** The March 2026 PF article said July 2026 while the plan issue said start of August [S47] vs [S114]; resolved by the editor release dated 31 Jul [S404].

## In explainer work
- Old shared sketches and tutorials written for 1.x (preload, curveVertex) now open against 2.x by default; pin `p5@2.3.x` or the compatibility add-ons explicitly (see [[cdn-version-pinning]], [[p5js-compatibility]]) [S405][S11].

## Relations
- related_to [[p5js-web-editor]] — switch happened in the editor [S404]
- supersedes [[p5js-1x]] — 2.x replaced 1.11.13 as default [S404]
- related_to [[p5js-2x]] — new default line [S362]
- related_to [[version-2x-migration]] — migration consequence [S11]
- related_to [[open-questions]] — resolved item [S404]
- related_to [[hub-people-community]] (structural)
## Sources
- [S404] — Web Editor GitHub releases
- [S114] — issue #8870
- [S362] — npm registry metadata
- [S405] — p5js.org Download page
- [S47] — PF 2.1/2.2 post
- [S11] — p5.js-compatibility README
