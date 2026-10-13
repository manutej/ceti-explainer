---
id: addon-events-api
title: "Add-on Events API"
type: Capability
aliases: ["addon events"]
sources: [S47, S117, S120, S274]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# Add-on Events API

## Definition
**[2.x]** The Add-on Events API, added in 2.1, lets add-ons hook into events and user-defined functions [S120]. It was announced in the Foundation's 2.1/2.2 write-up as a lifecycle-hooks API for add-ons [S47].

## Details
- Shipped in 2.1.0 together with TypeScript types, `color.contrast()` and `p5.strands` if/else and for [S120].
- Builds on the 2.0 [[lifecycle-hooks]] introduced with [[register-addon]] [S117].
- The notes do not give the API's function names or signatures [S120][S47].

## In explainer work
Potentially useful for add-ons that react to user-defined `keyPressed` or mouse handlers (for example a recorder that starts on a key) but concrete uses are not documented in the sources [S120].

## Relations
- part_of [[hub-language-core]] (structural)
- introduced_in [[release-2-1]] — added in 2.1 [S120]
- related_to [[register-addon]] — extends the add-on system [S117]
- related_to [[lifecycle-hooks]] — complements them [S47]
- related_to [[decorators-api]] — another extension mechanism [S274]

## Sources
- [S47] — p5.js 2.1 and 2.2: Expanding Graphics Avenues with p5.strands improvements and WebGPU
- [S117] — Designing an addon library system for p5.js 2.0
- [S120] — p5.js v2.1.0 release notes
- [S274] — What's New in p5.js 2.3.0!
