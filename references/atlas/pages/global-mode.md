---
id: global-mode
title: "Global mode"
type: Concept
aliases: ["global mode sketch"]
sources: [S96, S101, S248, S250]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# Global mode

## Definition
In global mode the p5 API and sketch functions live on `window`; it starts automatically when `setup` or `draw` is found on `window` [S96].

## Details
- It is the default for tutorials and the Web Editor because every function is directly callable (`circle()`, `background()`), a pedagogical convenience [S96].
- Stray global `setup`/`draw` definitions can force global mode unintentionally, even when you meant to mount an [[instance-mode]] sketch [S96].
- Global mode is a poor fit for multi-component pages: it injects the API on `window` and risks collisions with other libraries [S250][S96].
- TypeScript in 2.1.1 needed both `import "p5/global"` and `import p5 from "p5"` for typing global mode [S248].

## In explainer work
Use global mode for one-sketch, one-page explainers and quick prototypes; switch to instance mode when embedding several figures in an article or alongside other JS (inference from the documented rationale for instance mode) [S96][S101].

## Relations
- part_of [[hub-language-core]] (structural)
- alternative_to [[instance-mode]] — namespaced alternative [S96]
- related_to [[setup]] — presence of window.setup triggers it [S96]
- related_to [[draw]] — presence of window.draw triggers it [S96]
- related_to [[typescript-types]] — global-mode typing needed extra imports in 2.1.1 [S248]

## Sources
- [S96] — p5.js wiki: Global and instance mode
- [S101] — p5.js reference: p5() constructor
- [S248] — p5.js issue #8302 (TS + `import p5/global`, v2.1.1)
- [S250] — antfu/p5i README
