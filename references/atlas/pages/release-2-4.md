---
id: release-2-4
title: "p5.js 2.4"
type: Release
aliases: ["2.4"]
sources: [S10, S275, S278, S357, S360]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---
# p5.js 2.4

## Definition
p5.js 2.4 is the next minor release, in development on `main` as of October 2026, announced to carry the `instances()` GPU instancing API **[main / unreleased]** [S10][S275].

## Details
- `instances(500).sphere(20)` is the merged instancing API, captioned "Coming in p5.js 2.4" [S275].
- All planned instancing tasks in issue #8911 are checked off; `instanceID()` remains for compatibility but is to be deprecated in favour of `instanceIndex` [S278].
- No 2.4 release candidate was listed on GitHub as of 8 October 2026; 2.3.4 notes only say work continues [S10].
- `main` after 2.3.4 also adds native SVG import/export (`loadSVG`, `createSVG`, `saveSVG`) and strands matrix types, per the capability map [S357].

## In explainer work
- 2.4 is where mass-element explainer scenes (thousands of tokens or particles from a few lines) become a beginner-facing API; until release, pin a build from main only for experiments (see [[gpu-instancing]]) [S275][S278].
- Native SVG export on `main` (`saveSVG`, unreleased) would give vector stills for print and thumbnails (inference; see [[p5-svg-main-branch]]) [S360].

## Relations
- introduced_in [[gpu-instancing]] — inverse: targeted at 2.4 [S275]
- supersedes [[release-2-3]] — next minor [S10]
- related_to [[p5-svg-main-branch]] — also on main [S357]
- related_to [[akshat-patil]] — instancing author [S275]
- related_to [[hub-people-community]] (structural)
## Sources
- [S275] — instancing preview
- [S278] — issue #8911
- [S10] — GitHub releases
- [S357] — reference/source survey (capability map)
- [S360] — p5.js source on main (post-2.3.4): Shape/p5.svg submodule
