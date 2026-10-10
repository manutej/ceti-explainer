---
id: module-structure
title: "Structure module"
type: Module
aliases: ["Structure", "sketch lifecycle"]
sources: [S1, S4, S9, S10, S117, S347, S357, S358]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# Structure module

## Definition
Structure is the reference group for the sketch lifecycle: `setup`, `draw`, `remove`, `p5()`, `loop`, `noLoop`, `redraw`, `isLooping`, `registerAddon` and `disableFriendlyErrors` [S1]. The 2.x reference lists 10 entries, of which `registerAddon` is new [S357].

## Details
- `push` and `pop` moved out of Structure into [[module-transform]] in the 2.x reference [S357][S358].
- A `loading` core hook (a loading indicator during setup) exists in source but is not shown in the reference index [S357][S10].
- The draw loop is unchanged in concept; the main 2.x change is [[async-setup]] replacing [[preload]] [S1][S4].
- `redraw([n])` returns a Promise in 2.x; `remove()` tears a sketch down; see [[loop-control]] for the stepping trio [S9].
- `registerAddon` is the entry point of the new add-on API; see [[register-addon]] and [[lifecycle-hooks]] [S117].
- `disableFriendlyErrors` switches off [[friendly-error-system]] checks [S347].

## In explainer work
Structure is rated **High** relevance: `loop`, `noLoop` and `redraw` control frame stepping and deterministic export [S357].

## Relations
- part_of [[hub-language-core]] (structural)
- part_of [[capability-map]] — one of 17 top-level reference sections [S1]
- uses [[setup]] — group member [S1]
- uses [[draw]] — group member [S1]
- uses [[register-addon]] — group member, new in 2.x [S357]
- related_to [[friendly-error-system]] — disableFriendlyErrors lives here [S1]
- related_to [[loop-control]] — loop, noLoop, redraw, isLooping [S1]

## Sources
- [S1] — Reference index (v2)
- [S4] — p5.js v2.0.0 release notes
- [S9] — redraw() reference
- [S10] — p5.js GitHub releases page (v2.3.1 to v2.3.4)
- [S117] — Designing an addon library system for p5.js 2.0
- [S347] — Friendly Error System (contributor docs)
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
- [S358] — p5.js-website repo, `v1` branch reference (1.x reference; parsed 905 entries)
