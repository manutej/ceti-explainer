---
id: third-party-timeline-driving
title: "Driving third-party timelines from p5"
type: Pattern
aliases: ["Paused GSAP timeline", "Theatre.js values into p5"]
sources: [S320, S321, S329, S332, S333, S396, S397, S398, S400, S401, S403]
confidence: low
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# Driving third-party timelines from p5

## Definition

Driving third-party timelines from p5 means treating GSAP or Theatre.js as value stores that p5 seeks each frame, never as clocks that tick themselves. [S321][S320][S397]

## Details

- Remotion's GSAP package exists because GSAP's ticker follows the wall clock while Remotion needs each frame to depend only on the frame number; it builds a paused timeline and seeks it from useCurrentFrame(). [S397][S321]
- Remotion's hook re-renders the timeline from time zero each frame for determinism, costing time on large timelines, and forbids builder code from calling play/seek/progress. [S321]
- GSAP timelines support seek(seconds) and progress(0..1); GSAP became free for commercial use in 2025. [S332][S333]
- Theatre.js sequence.position is a settable playhead in seconds, object.value gives current values, and onValuesChange(cb) fires on any prop change and returns an unsubscribe function. [S329][S403]
- Theatre docs show DOM and THREE targets only, with no p5 integration documented. [S403]
- canvas-sketch is the only documented hybrid with p5: it owns the loop, resizing and export while the sketch draws from playhead. [S401][S400]
- Remotion's third-party page lists three.js and GSAP integrations and does not mention p5; Lottie frames are sought with goToAndStop and expressions may flicker. [S396][S398]
- No sourced example of p5 inside Remotion, GSAP-driven p5, or p5 in Motion Canvas exists; every such hybrid below is an inference. [S396][S403]
> **Conflict:** the GSAP docs fetched show only selector examples, so whether GSAP tweens plain objects is unconfirmed, while Remotion's hook restricts tweens to elements. [S332] vs [S321]

## In explainer work

Use GSAP or Theatre.js only if you need its position syntax or visual keyframe editor; otherwise keep tracks in the [[timeline-builder]]. [S332][S329] See [[canvas-sketch]] for the one documented p5 host. [S401]

## Patterns

### Pattern: paused GSAP as a value store
When to use: you want GSAP easing and sequencing for p5 parameters. [S397]
```js
const s = { x: 0, a: 0 };
const g = gsap.timeline({ paused: true }).to(s, { x: 300, duration: 1 }).to(s, { a: 1, duration: 0.5 }, '<');
function draw() { g.seek(clock.now()); circle(s.x, 200, 40); }   // GSAP never ticks itself
// Theatre: sheet.sequence.position = clock.now(); const { x } = obj.value;
```
Pitfalls: test plain-object targets before relying on them; never let GSAP autoplay during capture. [S332][S397]

## Relations

- related_to [[gsap]] — seek/progress API is what makes it drivable [S332]
- related_to [[theatre-js]] — settable playhead and onValuesChange [S329][S403]
- related_to [[remotion]] — establishes the rule that the host owns the clock [S321]
- related_to [[canvas-sketch]] — documented p5 hybrid [S401]
- part_of [[explainer-engine-blueprint]] — pattern P14 [S321]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S320] — Remotion `<ThreeCanvas>` (Remotion, undated)
- [S321] — Remotion `useGsapTimeline()` (Remotion, undated (v4.0.517+))
- [S329] — Theatre.js @theatre/core API (Theatre.js, undated)
- [S332] — GSAP core docs (GSAP (Webflow), undated)
- [S333] — 'Webflow makes GSAP 100% free' (Webflow, 2025 (last updated 2026-06-16))
- [S396] — Remotion docs, Third-party libraries (Remotion, undated)
- [S397] — Remotion docs, GSAP (Remotion, undated)
- [S398] — Remotion docs, Lottie (Remotion, undated)
- [S400] — canvas-sketch docs, WebGL/Three.js/P5.js section (Matt DesLauriers, undated)
- [S401] — canvas-sketch example animated-p5.js (Matt DesLauriers, undated)
- [S403] — Theatre.js docs, Sheet Objects (Theatre.js, undated)
