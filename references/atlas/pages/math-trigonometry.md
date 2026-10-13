---
id: math-trigonometry
title: "Trigonometry and angleMode"
type: Capability
aliases: ["angleMode", "atan2()", "RADIANS", "DEGREES"]
sources: [S4, S67, S70, S73, S85, S135, S357]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# Trigonometry and angleMode

## Definition
p5.js trigonometry works in radians by default, and `angleMode(DEGREES)` switches angle-taking functions, including `atan2` and `rotate`, to degrees [S70][S73].

## Details
- `angleMode()` with no argument returns the current mode [S70].
- `atan2(y, x)` takes y first, returns -PI..PI by default and -180..180 under DEGREES [S73].
- The Math/Trigonometry group has 10 entries: acos, angleMode, asin, atan, atan2, cos, degrees, radians, sin, tan [S357].
- The release notes list only revised trig documentation wording, so whether any trig behaviour changed in 2.x is not stated [S4].
- If `angleMode(DEGREES)` is set, `TWO_PI` is wrong in oscillation formulas; use 360 [S70].
- Nature of Code states radians are the default and that `atan2` or `heading()` handles all four quadrants [S85].

## In explainer work
Trig is rated high relevance for explainers: oscillation, orbits and polar layouts [S357]. Keep radians for loop math since `t * TWO_PI` assumes them [S135].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- part_of [[module-math]] — Math/Trigonometry [S357]
- enables [[oscillation]] — sine-based motion [S85]
- enables [[loop-phase-animation]] — `cos(t * TWO_PI)` loops [S135]
- related_to [[p5-vector]] — `fromAngle` and heading use these conventions [S67]

## Sources
- [S4] — p5.js v2.0.0 release notes
- [S67] — p5.Vector reference
- [S70] — angleMode() reference (v2.3.1)
- [S73] — atan2() reference
- [S85] — The Nature of Code, Oscillation chapter
- [S135] — FOTD: loopsin
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
