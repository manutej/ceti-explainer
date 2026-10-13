---
id: matter-js
title: "Matter.js"
type: Library
aliases: ["physics-driven explainer"]
sources: [S162, S164, S169, S171, S396]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# Matter.js

## Definition

Matter.js is a 2D rigid-body physics engine commonly drawn with p5, taught in The Coding Train's physics-libraries track. [S171]

## Details

- Maintenance 2026: npm 0.20.0 published 2024-06-23, no release since; the Coding Train video is undated and gives no p5 version. [S164][S171]
- The track covers module aliases, bodies, a static ground, friction and restitution, and notes Engine.run is deprecated. [S171]
- Remotion's docs say Matter.js has no integration there and recommend baking physics into a timeline. [S396]
- p5 2.x compatibility: unverified. [S164]

## In explainer work

Physics is stateful, so for a scrubbable explainer bake the simulation into per-frame arrays and read them by t. [S396][S171]

## Patterns

### Pattern: physics-driven explainer
When to use: collisions, gravity, constraints. [S171]
```js
const engine = Matter.Engine.create();
function draw() { Matter.Engine.update(engine, 1000 / 60); /* draw each body's vertices with p5 */ }
```
Pitfalls: use Engine.update rather than deprecated Engine.run; static ground needed. [S171]

## Relations

- integrates_with [[p5js]] — drawn through p5 shape calls [S171]
- alternative_to [[p5-collide2d]] — full dynamics versus boolean tests [S162][S171]
- related_to [[pure-function-of-t]] — must be baked to be a function of t [S396]
- related_to [[p5play]] — another physics-based option [S169]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S162] — p5.collide2D repo (Ben Moren, undated)
- [S164] — matter-js npm entry (via registry) (npm, queried 2026-10-08)
- [S169] — p5play README (v3.35.3) (Quinton Ashley, 2026)
- [S171] — Coding Train 6.1 Matter.js Introduction (The Coding Train (Daniel Shiffman), undated)
- [S396] — Remotion docs, Third-party libraries (Remotion, undated)
