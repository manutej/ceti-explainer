---
id: p5-grain
title: "p5.grain"
type: Library
aliases: ["p5grain", "seeded grain finish"]
sources: [S157, S159, S166, S168]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# p5.grain

## Definition

p5.grain (meezwhite) adds film grain and texture overlays to p5 sketches with deterministic randomness; API: applyMonochromaticGrain, applyChromaticGrain, tinkerPixels, loopPixels, textureOverlay, textureAnimate. [S166]

## Details

- Maintenance 2026: npm 0.8.0 published 2026-01-21, MIT; the README says the API is still in initial development and names no p5 version range. [S159][S166]
- Builds: full about 44.3 kB, lite about 29.2 kB; it supports deterministic randomness such as for fxhash. [S166]
- p5 2.x compatibility: undocumented. [S166]

## In explainer work

Apply it last in draw on a static frame or with the lite build, because per-pixel loops are costly every frame; grain gives flat vector explainers a print texture. [S166]

## Patterns

### Pattern: seeded grain finish
When to use: flat vector explainers needing a print texture. [S166]
```js
p5grain.setup();
function draw() { /* draw scene */ applyMonochromaticGrain(12); }
```
Pitfalls: per-pixel loops are costly; use once on a static frame or the lite build. [S166]

## Relations

- related_to [[p5-fillgradient]] — another finishing/aesthetic layer [S166][S168]
- related_to [[p5-brush]] — aesthetic layer family [S157]
- related_to [[pure-function-of-t]] — deterministic mode keeps frames reproducible [S166]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S157] — p5.brush repo (Alejandro Campos Uribe, undated)
- [S159] — npm registry metadata (p5, p5.sound, p5.brush, p5.grain, p5.js-svg, p5.fillgradient, p5play, tone, ml5, p5.collide2d, p5.createloop, p5.capture, p5.plotsvg, p5.tree, matter-js, roughjs) (npm, queried 2026-10-08)
- [S166] — p5.grain repo (meezwhite / Joseph Miclaus, undated)
- [S168] — p5.fillGradient repo (Jorge Moreno (alterebro), undated)
