---
id: p5js-compatibility
title: "p5.js-compatibility add-ons"
type: Library
aliases: ["compatibility add-ons", "compat add-ons", "p5.js compatibility add-on", "preload.js", "shapes.js", "data.js", "events.js", "events.js add-on", "preload.js add-on", "shapes.js add-on", "data.js add-on"]
sources: [S4, S11, S27, S75, S115, S117]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# p5.js-compatibility add-ons

## Definition
`p5.js-compatibility` is the official repository of four add-ons that restore 1.x behaviour on 2.x: `preload.js`, `shapes.js`, `data.js` and `events.js`; the latest release noted is v0.1.2 (2025-04-15) and it is described as work in progress [S11].

## Details
- `preload.js` restores [[preload]] and 1.x loader signatures; `shapes.js` restores the 6-argument `bezierVertex`, `quadraticVertex` and `curveVertex`; `data.js` restores removed dict and array helpers; `events.js` restores 1.x `keyCode` behavior [S115][S11].
- The README advises trying a 1.x sketch on 2.0 first and adding an add-on only if it breaks; in the Web Editor add them via Settings > Library Management (teachers' guide: Data & Events, Preload and Shapes) [S11][S27].
- The README omits `events.js` from its introductory add-on list although the table covers it [S11].
- Some changes have no add-on: `createVector` dimensions, `buildGeometry`, `splineProperty`, `textWidth`/`fontWidth`, `loadBytes`, `loadTable` separator [S115][S11].
- Add-ons built on the new add-on system do not run on 1.x [S117].

> **Conflict:** The compat README says 1.x is supported until August 2026, while the 2.0 dev-update post says no 1.x updates after the end of March 2026; they likely describe different things (Editor default vs maintenance releases) [S11] vs [S75].

## In explainer work
Use as a transition aid for existing explainer sketches; new work should be written natively for 2.x (see [[version-2x-migration]]) [S11][S27].

## Relations
- part_of [[hub-language-core]] (structural)
- enables [[preload]] — preload.js [S11]
- enables [[curve-api-1x]] — shapes.js [S11]
- enables [[module-data]] — data.js restores helpers [S115]
- enables [[module-events]] — events.js restores keyCode [S11]
- integrates_with [[release-2-0]] — bridge for the 2.0 breaking changes [S4]
- related_to [[version-2x-migration]] — migration route [S27]

## Sources
- [S4] — p5.js v2.0.0 release notes
- [S11] — p5.js-compatibility add-ons
- [S27] — Teachers' Guide to p5.js v2
- [S75] — [dev updates] p5.js 2.0: You Are Here
- [S115] — p5.js-compatibility README raw (differences list)
- [S117] — Designing an addon library system for p5.js 2.0
