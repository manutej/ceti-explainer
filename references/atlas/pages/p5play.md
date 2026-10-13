---
id: p5play
title: "p5play"
type: Library
aliases: ["p5.play"]
sources: [S159, S160, S169, S171, S223, S224, S396]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "1.x"
---

# p5play

## Definition

p5play is a game engine on p5 or q5 graphics with Box2D (planck) physics, whose author said in June 2025 that p5.js v2 support was subpar. [S169][S160]

## Details

- Maintenance 2026: npm 3.35.5 published 2026-05-14; the licence is the p5play Personal License, with educational and professional use needing separate licences. [S159][S169]
- p5 2.x compatibility: the June 2025 newsletter said p5play v3.31 works with p5 1.10.0 to 1.11.4 and warns on untested versions. **[1.x only]** [S160]
- The repo README presents q5play as its successor (medium confidence: the page fetch was not a numbered source). [S169]
- CodeHS uses it in its game design curriculum, and Code.org Game Lab code can migrate to p5.play. [S224][S223]

## In explainer work

Explainer relevance is simulation demos with collisions; for scrubbable video bake the physics first, as with [[matter-js]]. [S169][S396] Its 2.x gap is a reason to pin p5 1.11.x for such sketches ([[cdn-version-pinning]]). [S160]

## Relations

- integrates_with [[q5js]] — also supports q5 as the renderer [S169]
- conflicts_with [[p5js-2x]] — author calls 2.x support subpar (partial/experimental) [S160]
- alternative_to [[matter-js]] — Box2D game engine versus Matter dynamics [S169][S171]
- related_to [[game-lab]] — underlies CodeHS and Game Lab teaching [S223][S224]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S159] — npm registry metadata (p5, p5.sound, p5.brush, p5.grain, p5.js-svg, p5.fillgradient, p5play, tone, ml5, p5.collide2d, p5.createloop, p5.capture, p5.plotsvg, p5.tree, matter-js, roughjs) (npm, queried 2026-10-08)
- [S160] — p5play progress June 2025 (q5js/p5play author newsletter, June 2025)
- [S169] — p5play README (v3.35.3) (Quinton Ashley, 2026)
- [S171] — Coding Train 6.1 Matter.js Introduction (The Coding Train (Daniel Shiffman), undated)
- [S223] — Migrating Game Lab code off Code.org with p5.play (Code.org forum, undated)
- [S224] — CodeHS p5play library (CodeHS help, undated)
- [S396] — Remotion docs, Third-party libraries (Remotion, undated)
