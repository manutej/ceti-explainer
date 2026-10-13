---
id: friendly-error-system
title: "Friendly Error System"
type: Capability
aliases: ["FES", "p5.disableFriendlyErrors", "disableFriendlyErrors"]
sources: [S1, S10, S237, S243, S255, S343, S347]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# Friendly Error System

## Definition
The Friendly Error System (FES) prints plain-language console messages that supplement browser errors, with reference links, and validates function parameters against the inline documentation [S347]. Setting `p5.disableFriendlyErrors = true` turns it off; `p5.min.js` omits it [S347].

## Details
- Messages are translated through i18next with locale files such as `translations/es-PE`; contributors are asked to avoid figures of speech [S347].
- `disableFriendlyErrors` is a Structure-group entry [S1].
- Performance: error checks slow sketches; official guidance is to disable FES or use the minified build, and the optimization wiki says up to about 10x speedup in some cases (figures tied to p5 v0.5.2) [S243][S255].
- In 2.0.5, FES warnings pointed to a line inside p5 rather than the sketch line; maintainers called this expected because FES logs without throwing [S237].
- **[2.x]** v2.3.4 (2026-09-25) added a clearer FES message when `preload()` is used (see [[preload]]) [S10].
- Whether FES parameter validation changed in 2.x was not found [S347].
- FES is one expression of the project's access values (see [[access-statement]]) [S343].

## In explainer work
Develop with FES on, then set `p5.disableFriendlyErrors = true` (or use the minified build) for final renders and exports to recover frame time [S243][S255].

## Relations
- part_of [[hub-language-core]] (structural)
- part_of [[module-structure]] — disableFriendlyErrors lives there [S1]
- conflicts_with [[performance-profiling]] — checks cost time [S243]
- related_to [[access-statement]] — access-first design [S343]
- related_to [[preload]] — 2.3.4 error message [S10]
- related_to [[version-2x-migration]] — runtime hints for removed APIs (inference) [S10]

## Sources
- [S1] — Reference index (v2)
- [S10] — p5.js GitHub releases page (v2.3.1 to v2.3.4)
- [S237] — Friendly Error points to executing line in the p5.js file (issue #8212)
- [S243] — How to Optimize Your Sketches
- [S255] — Optimizing p5.js Code for Performance (wiki)
- [S343] — p5.js Access Statement
- [S347] — Friendly Error System (contributor docs)
