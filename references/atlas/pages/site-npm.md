---
id: site-npm
title: "npm registry and npmjs.com (source site)"
type: Site
aliases: ["npmjs.com (site)"]
sources: [S134, S159, S164, S176, S362, S364, S376]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
---
# npm registry and npmjs.com (source site)

## Definition
**npm registry and npmjs.com** — the package registry whose metadata gives versions and dist-tags for p5 and its add-ons; operated by npm, Inc.. [S134]

Kind: **primary**; 7 registered sources, 5 rated primary. It is one of the source sites indexed in [[hub-sites]]. [S134][S159][S164]

## What it contributes
- p5.save-frames supports only p5 global mode [S134]
- p5 npm latest is 2.3.4, published 2026-09-25. [S159]
- matter-js npm 0.20.0 was published 2024-06-23. [S164]
- p5.js 2.0.0 was published to npm on 2025-04-17 [S362]

## Pages that cite it

| page (39) | title |
|---|---|
| [[art-blocks]] | Art Blocks |
| [[capability-map]] | Capability map of p5.js 2.x |
| [[cdn-version-pinning]] | CDN version pinning |
| [[chromie-squiggle]] | Chromie Squiggle |
| [[editor-default-switch]] | Web Editor default switch to 2.x |
| [[frontier-2026]] | Frontier 2026 |
| [[gsap]] | GSAP |
| [[hub-explainer-production]] | Hub: Explainer production |
| [[hub-language-core]] | Hub: Language and core API |
| [[hub-people-community]] | Hub: People, works and community |
| [[index]] | p5.js Explainer Atlas |
| [[matter-js]] | Matter.js |
| [[ml5js]] | ml5.js |
| [[open-questions]] | Open questions and conflicts |
| [[p5-brush]] | p5.brush |
| [[p5-capture]] | p5.capture |
| [[p5-collide2d]] | p5.collide2D |
| [[p5-create-loop]] | p5.createLoop |
| [[p5-fillgradient]] | p5.fillGradient |
| [[p5-grain]] | p5.grain |
| [[p5-save-frames]] | p5.save-frames |
| [[p5-scribble]] | p5.scribble |
| [[p5-sound]] | p5.sound |
| [[p5-tree]] | p5.tree |
| [[p5-tween]] | p5.tween |
| [[p5js]] | p5.js |
| [[p5js-1x]] | p5.js 1.x |
| [[p5js-2x]] | p5.js 2.x |
| [[p5js-libraries-directory]] | p5.js libraries directory |
| [[p5js-reference]] | p5.js Reference |
| [[p5js-svg]] | p5.js-svg |
| [[p5play]] | p5play |
| [[release-2-0]] | p5.js 2.0 |
| [[release-2-3]] | p5.js 2.3 |
| [[rough-js]] | rough.js |
| [[snowfro]] | Snowfro (Erick Calderon) |
| [[tone-js]] | Tone.js |
| [[version-2x-migration]] | 1.x to 2.x migration |
| [[video-export-pipeline]] | Video export pipeline |

## Reliability
- Coverage: 7 sources (5 rated primary, 2 secondary by the researchers); year range 2026–2026, 3 without a recorded date. [S134][S159][S164]
- Noted gap: Easing/tween: p5.tween details verified; a "p5.easing" library and the p5-easing npm package were only seen as search-result titles. GSAP 3.15.0 exists on npm (2026-04-13) but its p5 integration was not researched. [S176]
- Noted gap: matter.js with p5 2.x: the Coding Train video is undated and gives no p5 version; matter-js has had no release since 0.20.0 (2024-06). [S164]
- Noted gap: **Version mismatch:** the live reference documents 2.3.3, while 2.3.4 is GitHub/npm latest. Since 2.3.4 is a patch, the API surface should be identical. I confirmed this with a source diff: no public @method/@property in 2.3.4 is missing from main, though I did not diff 2.3.3 itself. [S362]

## Sources
- [S134] — p5.save-frames (community; undated)
- [S159] — npm registry metadata (p5, p5.sound, p5.brush, p5.grain, p5.js-svg, p5.fillgradient, p5play, tone, ml5, p5.collide2d, p5.createloop, p5.capt (primary; queried 2026-10-08)
- [S164] — matter-js npm entry (via registry) (primary; queried 2026-10-08)
- [S176] — Search result: p5.tween / p5-easing npm · https://npmjs.com/package/p5-easing · undated · kind: comm (community; )
- [S362] — npm registry metadata for `p5` (dist-tags latest 2.3.4, r1 1.11.13, beta 2.3.1-rc.2; 2.0.0 published 2025-04-17) (primary; accessed 2026-10-08)
- [S364] — npm registry metadata for `p5.sound` (latest 0.4.1) (primary; accessed 2026-10-08)
- [S376] — artblocks npm package (docs; undated)
