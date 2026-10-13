---
id: release-2-2
title: "p5.js 2.2"
type: Release
aliases: ["2.2", "v2.2"]
sources: [S47, S48, S62, S119, S124, S238, S274]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---
# p5.js 2.2

## Definition
p5.js 2.2 is the minor release that introduced the experimental WebGPU renderer and flattened the p5.strands API; its WebGPU release candidate was announced around 1 January 2026 [S47][S48].

## Details
- 2.2 introduced the WebGPU-based renderer **[beta]**, loaded as a separate file `lib/p5.webgpu.js` beside `lib/p5.js` [S47][S62].
- WebGPU mode requires an awaited `createCanvas(..., WEBGPU)` because WebGPU initialisation is asynchronous [S48][S62].
- Pagurek describes WebGPU mode as essentially a clone of WebGL mode at feature parity; 2D mode was not WebGPU-optimised [S48].
- As of Dec 2025, WebGPU was on by default in Chrome and Windows Firefox and experimental in Safari [S48].
- 2.2.1 introduced a simpler, flatter API for p5.strands; 2.2.2 added performance improvements and `millis()` inside strands [S47].
- 2.2.3 (23 Mar) shipped a public decorator API and a TypeScript global-mode fix [S119].
- About 50 people contributed to 2.1 and 2.2 together [S47].
- A user migrating a large 2D codebase reported 2.2.0 mostly worked but could not find a structural-changes guide [S124].
- A community workaround pins a jsDelivr script tag to 2.2.2 when Processing's p5 mode lags [S238].

## In explainer work
- `millis()` inside strands (2.2.2) lets GPU materials animate on time, but explainer exports should still feed shader time from frame index rather than wall clock (see [[pure-function-of-t]]) [S47].
- WebGPU in 2.2 is opt-in and experimental; explainers should keep a WebGL fallback (see [[webgpu-renderer]]) [S48].

## Relations
- introduced_in [[webgpu-renderer]] — inverse: renderer introduced in 2.2 [S47]
- related_to [[p5-strands]] — flatter API in 2.2.1 [S47]
- supersedes [[release-2-1]] — next minor after 2.1 [S47]
- related_to [[release-2-3]] — succeeded by 2.3 [S274]
- related_to [[decorators-api]] — public in 2.2.3 [S119]
- related_to [[hub-people-community]] (structural)
## Sources
- [S47] — PF post on 2.1 and 2.2
- [S48] — Pagurek WebGPU post
- [S62] — v2.3.1 notes (WebGPU loading)
- [S119] — releases page 2
- [S124] — Discourse migration thread
- [S238] — Processing p5 mode thread
- [S274] — 2.3.0 post
