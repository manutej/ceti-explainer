---
id: custom-build-server
title: "Custom build server"
type: Tool
aliases: ["module builds"]
sources: [S274, S295]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# Custom build server

## Definition

The custom build server is an alpha on-demand service that builds p5 with selected modules via ?modules=, discussed in issue #8003 and shipped as a proof of concept, not for production. [S295][S274]

## Details

- Commenters on #8003 cite the roughly 1 MB minified build as heavy for simple projects; tree-shaking is considered a major effort outside current scope. [S295]
- Kenneth Lim is credited on the tool. [S295]
- 2.3 also added a bot that builds a testable p5.js for each PR. **[2.x]** [S274]
- Maintenance 2026: alpha; no stable release. **[beta]** [S274][S295]

## In explainer work

A smaller custom build could matter for embedded explainer widgets, but pin the default build until this leaves alpha. [S295][S274]

## Relations

- authored_by [[kenneth-lim]] — credited on #8003 [S295]
- related_to [[cdn-version-pinning]] — alternative delivery of a pinned build [S295]
- related_to [[release-2-3]] — 2.3 mentions the proof of concept [S274]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S274] — What's New in p5.js 2.3.0! (Processing Foundation, 2026-06-22)
- [S295] — Issue #8003: Distributing custom builds (p5.js 2.0) (processing/p5.js (limzykenneth et al.), undated)
