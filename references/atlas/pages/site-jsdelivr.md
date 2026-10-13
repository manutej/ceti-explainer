---
id: site-jsdelivr
title: "jsDelivr (source site)"
type: Site
aliases: ["cdn.jsdelivr.net (site)"]
sources: [S169, S244, S305, S406]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
---
# jsDelivr (source site)

## Definition
**jsDelivr** — the CDN that serves npm package files and READMEs for p5 add-ons; operated by jsDelivr. [S169]

Kind: **primary**; 4 registered sources, 4 rated primary. It is one of the source sites indexed in [[hub-sites]]. [S169][S244][S305]

## What it contributes
- jsDelivr's p5 package page showed version 2.3.4 [S406]
- p5.capture does not support multiple instances or module bundlers [S244]
- p5play npm 3.35.5 (2026-05-14); license is the p5play Personal License (educational and commercial need separate licenses). [S169]

## Pages that cite it

| page (11) | title |
|---|---|
| [[cdn-version-pinning]] | CDN version pinning |
| [[community-export-pain]] | Video export as community pain point |
| [[explainer-engine-blueprint]] | Explainer engine blueprint |
| [[hub-explainer-production]] | Hub: Explainer production |
| [[matter-js]] | Matter.js |
| [[open-questions]] | Open questions and conflicts |
| [[p5-capture]] | p5.capture |
| [[p5play]] | p5play |
| [[q5js]] | q5.js |
| [[tapioca24]] | tapioca24 |
| [[timeplate]] | JS timeline micro-libraries |

## Reliability
- Coverage: 4 sources (4 rated primary, 0 secondary by the researchers); year range 2026–2026, 2 without a recorded date. [S169][S244][S305]
- Noted gap: **p5 2.x compatibility of add-ons is largely undocumented.** The library directory marks none of the animation or export libraries as v2-compatible. p5.capture's README shows an unversioned p5 CDN and does not mention 2.x. The p5.sound.js rebuild post does not state 2.x status, and the v2 teacher guide does not … [S244]
- Noted gap: **p5.capture determinism.** It captures after each draw, but it does not control `millis()` or `deltaTime`. If a sketch reads wall time, the export can still be wrong. The README does not address this. [S244]
- Noted gap: Version discrepancy to note: p5js.org Download/Tutorials pages still pin 2.3.3 in snippets while npm, jsDelivr and cdnjs show 2.3.4; the Download page's `p5@2` link gives the newest 2.x. I could not read jsDelivr's or cdnjs's raw API (permission request withdrawn, proxy 403), so the "latest" claim rests on their package pages. [S406]

## Sources
- [S169] — p5play README (v3.35.3) (docs; 2026)
- [S244] — p5.capture README v1.6.1 (community; undated)
- [S305] — timeplate README (primary; undated)
- [S406] — jsDelivr package page for p5 (primary; fetched 2026-10-08)
