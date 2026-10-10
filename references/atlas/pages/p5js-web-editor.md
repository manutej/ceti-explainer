---
id: p5js-web-editor
title: "p5.js Web Editor"
type: Platform
aliases: ["editor.p5js.org", "Web Editor"]
sources: [S11, S27, S47, S75, S114, S132, S142, S246, S383, S385, S404]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# p5.js Web Editor

## Definition

The p5.js Web Editor is the browser IDE (editor.p5js.org) that made p5.js 2.x its default on 2026-07-31 (editor v2.22.0), keeping a version picker and compatibility add-ons for 1.x sketches. [S404][S114][S27]

## Details

- Release v2.21.2 (14 Jul) added a banner announcing the 2.0 default; v2.22.0 (31 Jul) includes PR #4232 "Set p5.js v2 to Default"; v2.20.8 (10 Apr) had set the default to 1.11.13; v2.22.1 (11 Aug) made the autocomplete hinter link to p5js.org for v2. **[2.x]** [S404]
- Issue #8870 listed the web editor update (July 31) as done; the editor release page omits years, so 2026 is inferred. [S114][S404]
- Migration paths: update code, enable a compat add-on via Settings > Library Management, or switch the sketch to v1 with the version picker. **[changed in 2.x]** [S27][S11]
- The Get Started page opens the editor with version=2.3.3. [S246]
- Concerns raised: a roughly 5 MiB upload cap, and the editor works poorly on mobile and tablet. [S75][S385]
- The Coding Train and Nature of Code sketches are hosted there. [S385][S142][S383]
- A UAL template runs CCapture inside the editor; editor auto-refresh can crash a capture. [S132]
> **Conflict:** the Foundation blog said July 2026 [S47] while the compatibility README said August 2026 [S11]; the release log shows 31 July [S404].

## In explainer work

For explainers, share sketches by editor link only with an explicit version pin; for export prefer a local setup because editor auto-refresh and download limits hurt capture ([[cdn-version-pinning]], [[frame-stepped-export]]). [S132][S246]

## Relations

- integrates_with [[p5js-compatibility]] — add-ons enabled via Library Management [S11]
- related_to [[cdn-version-pinning]] — default switch makes pinning important [S404]
- related_to [[ual-video-exporter-template]] — template runs CCapture here [S132]
- supersedes [[p5js-1x]] — 2.x became default replacing 1.11.13 [S404][S114]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S11] — p5.js-compatibility add-ons (Processing Foundation, v0.1.2, 15 Apr 2025)
- [S27] — Teachers' Guide to p5.js v2 (p5.js, undated)
- [S47] — p5.js 2.1 and 2.2: Expanding Graphics Avenues with p5.strands improvements and WebGPU (Processing Foundation, 2026-03-09)
- [S75] — [dev updates] p5.js 2.0: You Are Here (Processing Foundation Discourse, 2025 (exact date not captured))
- [S114] — Issue #8870 plan to make 2.x the Editor default (processing/p5.js, 2026)
- [S132] — How to export your p5.js as a video (UAL Creative Computing Institute Lab, undated)
- [S142] — Bees & Bombs cube wave challenge page (The Coding Train, undated)
- [S246] — p5.js Get Started tutorial (editor link pins version=2.3.3) (p5js.org, undated)
- [S383] — noc-book-2 repo (Nature of Code, undated)
- [S385] — createCanvas: Interview with Dan Shiffman, part 2 (Processing Foundation, 2019-11-15)
- [S404] — p5.js Web Editor GitHub Releases (Processing Foundation, day/month only (year not shown))
