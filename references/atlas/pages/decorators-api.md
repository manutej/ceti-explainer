---
id: decorators-api
title: "Decorators API"
type: Capability
aliases: ["p5.registerDecoration"]
sources: [S10, S47, S117, S119, S121, S274, S357]
confidence: low
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# Decorators API

## Definition
**[2.x]** The Decorators API (`p5.registerDecoration`) is an add-on extension mechanism used to refactor `p5.Vector` in 2.3.0, with an initial guide added in 2.3.3 [S274][S10].

## Details
- Release notes cite it, but no reference page for it was found [S357][S10].
- 2.2.3 (23 March) is described as adding a public decorator API and a TypeScript global-mode fix [S119].
- The 2.3.0 write-up lists a `p5.Vector` refactor and a modular custom-build testing tool [S121][S274].

> **Conflict:** The decorator API is dated to 2.2.3 [S119] in one source and to 2.3.0 with a guide in 2.3.3 in others [S274][S10].

## In explainer work
Of interest to library authors extending core classes; no explainer-specific use is documented [S274].

## Relations
- part_of [[hub-language-core]] (structural)
- related_to [[register-addon]] — add-on API family [S117]
- related_to [[addon-events-api]] — sibling mechanism [S47]
- related_to [[release-2-3]] — used in 2.3.0 [S274]
- related_to [[p5-vector]] — class refactored with it [S274]

## Sources
- [S10] — p5.js GitHub releases page (v2.3.1 to v2.3.4)
- [S47] — p5.js 2.1 and 2.2: Expanding Graphics Avenues with p5.strands improvements and WebGPU
- [S117] — Designing an addon library system for p5.js 2.0
- [S119] — Releases page 2 (2.2.3, 2.3.0 RCs, 1.11.12-1.11.14 RCs)
- [S121] — p5.js v2.3.0 release notes
- [S274] — What's New in p5.js 2.3.0!
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
