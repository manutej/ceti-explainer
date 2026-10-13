---
id: cdn-version-pinning
title: "CDN version pinning"
type: Pattern
aliases: ["CDN pin", "Pinned CDN script", "VS Code + CDN script tag workflow", "Version-pinned 2.x"]
sources: [S11, S47, S62, S114, S140, S238, S254, S274, S283, S362, S404, S405, S406, S407]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# CDN version pinning

## Definition

CDN version pinning means loading an exact p5 version (and matching add-on versions) from a CDN rather than a floating tag, because unpinned tags drift between 1.x and 2.x and between releases. [S238][S405]

## Details

- p5 2.3.4 was latest on npm (published 2026-09-25) with r1 pinned to 1.11.13, and jsDelivr and cdnjs also showed 2.3.4 on 2026-10-08. **[2.x]** [S362][S406][S407]
- The p5js.org Download page still showed 2.3.3 in its snippets while recommending a pinned jsDelivr link and offering an unpinned-minor `p5@2` link for the latest 2.x. [S405]
- The Web Editor made 2.x the default on 2026-07-31 (editor v2.22.0), having defaulted to 1.11.13 since 10 April. **[2.x]** [S404][S114]
- 1.x was frozen at the end of March 2026; the npm tag r1 holds 1.11.13. **[1.x only]** [S114][S362]
- WebGPU mode loads as lib/p5.webgpu.js alongside lib/p5.js, so pin both to the same version. **[beta]** [S47][S62]
- LLM-generated sketches default to 1.x idioms (preload, curveVertex, 3D-default createVector); pin p5@2.3.x and add a 2.x rules block or the compatibility add-ons. [S11][S274]
- 2.3.1 renamed the HDR colour constant to P3, so generated code using HDR needs updating. **[changed in 2.x]** [S62]
- Community workaround for editor tooling that lags: plain VS Code with a jsDelivr script tag pinned to 2.2.2. [S238]
- The Download page warns the Complete Library zip's p5.sound.js is outdated and incompatible with 2.x and points to p5.sound 0.4.1 on the CDN. [S405]
> **Conflict:** the Foundation blog said the editor default would be July 2026 [S47] while the compatibility README said August 2026 [S11]; the editor release log shows 31 July [S404].

## In explainer work

For shared explainers, pin an exact version such as p5@2.3.4 and bump it deliberately; a floating `p5@2` or bare package name can change rendering between visits. [S405][S362] This matters doubly for exported video because reproducibility includes the library version. [S140]

## Patterns

### Pattern: exact pin with a visible version
When to use: any shared or exported sketch. [S405]
```html
<script src="https://cdn.jsdelivr.net/npm/p5@2.3.4/lib/p5.min.js"></script>
<!-- WebGPU users: load lib/p5.webgpu.js from the same version -->
```
Pitfalls: floating tags drift; keep a note of the pinned version beside exports so frames can be re-rendered. [S405][S47]

## Relations

- related_to [[p5js-web-editor]] — default version switched on 2026-07-31 [S404]
- related_to [[p5js-compatibility]] — add-ons that restore 1.x behaviour when a pin cannot move [S11]
- related_to [[vscode-live-server]] — pinned script tag is the usual workflow there [S238][S254]
- related_to [[ai-assisted-p5]] — agents need the pin and a rules block [S274][S283]
- related_to [[version-2x-migration]] — pinning is step zero of migration [S11]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S11] — p5.js-compatibility add-ons (Processing Foundation, v0.1.2, 15 Apr 2025)
- [S47] — p5.js 2.1 and 2.2: Expanding Graphics Avenues with p5.strands improvements and WebGPU (Processing Foundation, 2026-03-09)
- [S62] — p5.js 2.3.1 release notes (mirror) (GitHub release via newreleases.io, date not shown (page said "2 months ago"))
- [S114] — Issue #8870 plan to make 2.x the Editor default (processing/p5.js, 2026)
- [S140] — canvas-sketch: Exporting Artwork (Matt DesLauriers, undated)
- [S238] — How to manually modify the P5js plugin (stable version) to use the 2.0 version? (Processing Discourse (EricRogerGarcia, glv, quark), 2026-05-14 to 2026-06-01)
- [S254] — Oliver Steele, VS Code for p5.js (Oliver Steele, undated)
- [S274] — What's New in p5.js 2.3.0! (Processing Foundation, 2026-06-22)
- [S283] — hermes-agent p5js skill (skills.sh listing of nousresearch/hermes-agent, first seen 2026-04-15)
- [S362] — npm registry metadata for `p5` (dist-tags latest 2.3.4, r1 1.11.13, beta 2.3.1-rc.2; 2.0.0 published 2025-04-17) (npm, accessed 2026-10-08)
- [S404] — p5.js Web Editor GitHub Releases (Processing Foundation, day/month only (year not shown))
- [S405] — p5.js Download page (p5.js team, undated)
- [S406] — jsDelivr package page for p5 (jsDelivr, fetched 2026-10-08)
- [S407] — cdnjs library page for p5.js (cdnjs, fetched 2026-10-08)
