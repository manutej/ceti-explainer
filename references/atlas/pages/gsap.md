---
id: gsap
title: "GSAP"
type: Library
aliases: ["GreenSock", "gsap.timeline"]
sources: [S159, S170, S321, S329, S332, S333, S397]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# GSAP

## Definition

GSAP is the JavaScript tweening and timeline engine whose timelines support seek(seconds) and progress(0..1), and which Webflow made free for everyone including commercial use. [S332][S333]

## Details

- Remotion's integration builds a paused GSAP timeline and seeks it from the frame number, because GSAP's own ticker follows the wall clock. [S397][S321]
- Webflow made GSAP and the formerly paid Club plugins free; the post gives no original date (page last updated 2026-06-16). [S333]
- GSAP 3.15.0 exists on npm (2026-04-13), but p5 integration was not researched. [S159]
- The fetched docs show only selector examples, so tweening plain objects as p5 state is unconfirmed. [S332]
- p5.tween (Milchreis) is the p5-native tween alternative but is millisecond wall-clock based. [S170]

## In explainer work

Use GSAP as a paused value store that p5 seeks each frame ([[third-party-timeline-driving]]), never as a free-running clock, or exports will desync. [S397][S321] Maintenance 2026: active; p5 2.x is irrelevant because it only writes numbers into a plain state object (inference). [S333][S332]

## Relations

- alternative_to [[p5-tween]] — richer timeline and seek API versus ms-based tween add-on [S170][S332]
- related_to [[third-party-timeline-driving]] — pattern for seeking it from p5 [S397]
- related_to [[remotion]] — official paused-timeline integration [S397]
- related_to [[theatre-js]] — other timeline toolkit [S329]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S159] — npm registry metadata (p5, p5.sound, p5.brush, p5.grain, p5.js-svg, p5.fillgradient, p5play, tone, ml5, p5.collide2d, p5.createloop, p5.capture, p5.plotsvg, p5.tree, matter-js, roughjs) (npm, queried 2026-10-08)
- [S170] — p5.tween repo (Milchreis, undated)
- [S321] — Remotion `useGsapTimeline()` (Remotion, undated (v4.0.517+))
- [S329] — Theatre.js @theatre/core API (Theatre.js, undated)
- [S332] — GSAP core docs (GSAP (Webflow), undated)
- [S333] — 'Webflow makes GSAP 100% free' (Webflow, 2025 (last updated 2026-06-16))
- [S397] — Remotion docs, GSAP (Remotion, undated)
