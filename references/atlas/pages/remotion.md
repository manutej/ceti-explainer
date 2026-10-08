---
id: remotion
title: "Remotion"
type: Tool
aliases: ["remotion.dev", "useCurrentFrame()", "Sequence (Remotion)", "Composition (Remotion)", "interpolate (Remotion)", "useGsapTimeline", "@remotion/gsap", "@remotion/three", "@remotion/lottie", "Business Source License", "BSL"]
sources: [S227, S228, S235, S317, S318, S319, S320, S321, S396, S397, S398]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "n/a"
---

# Remotion

## Definition

Remotion is a React framework that treats a video as a function of the current frame: useCurrentFrame() is the only input to animation logic, and frames render independently in headless Chromium. [S317][S318][S228]

## Details

- A Composition holds a component plus fps, durationInFrames, width and height; the first frame is 0 and the last is durationInFrames minus 1. [S318]
- Because frames render independently and not necessarily in order, CSS animations, timers and free-running clocks flicker or show the wrong progress. [S317]
- A Sequence with from=30 shifts children's time and nested sequences add offsets, though the docs no longer recommend Sequence for new code. [S319]
- Integrations: @remotion/three (ThreeCanvas, frameloop 'never'), @remotion/gsap (paused timeline re-seeked from frame zero), @remotion/lottie (goToAndStop, expressions may flicker); p5 is not listed and no p5-in-Remotion example was found. [S320][S397][S398][S396]
- Licensing: source-available, paid company licence required; one 2026 comparison puts the threshold at $1M ARR; a 2023 planning issue proposed counting freelancers toward headcount but was only a plan. [S227][S228][S235]
- It renders in headless Chromium so web CSS, SVG and fonts work, and it offers Lambda cloud rendering. [S228]
> **Conflict:** the comparison articles are aggregator-grade and vendor-authored in places ([S227] is Remotion's own page), so treat feature and licence comparisons as opinion.

## In explainer work

Remotion is the clearest statement of the invariant behind [[explainer-clock]]; copy the idea, not the framework. [S317] A p5 inside Remotion would need instance mode, noLoop() and redraw() driven from the frame (undocumented inference). [S396][S317] Related: [[third-party-timeline-driving]], [[scene-local-time]]. [S321][S319]

## Relations

- alternative_to [[motion-canvas]] — declarative frame function versus imperative generator timeline [S227]
- related_to [[gsap]] — @remotion/gsap seeks a paused timeline each frame [S397]
- related_to [[three-js]] — @remotion/three integration [S396][S320]
- related_to [[lottie]] — @remotion/lottie integration [S398]
- related_to [[explainer-clock]] — source of the frame-as-function invariant [S317]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S227] — Remotion vs Motion Canvas (Remotion docs) (Remotion team, undated)
- [S228] — Remotion vs Motion Canvas vs Revideo programmatic video 2026 (PkgPulse, 2026 (exact date not seen))
- [S235] — Remotion 5.0 planning issue #3310 (Remotion maintainers, 2023-12-29)
- [S317] — Remotion 'CSS animations' troubleshooting (Remotion, undated)
- [S318] — Remotion 'The fundamentals' (Remotion, undated)
- [S319] — Remotion `<Sequence>` (Remotion, undated)
- [S320] — Remotion `<ThreeCanvas>` (Remotion, undated)
- [S321] — Remotion `useGsapTimeline()` (Remotion, undated (v4.0.517+))
- [S396] — Remotion docs, Third-party libraries (Remotion, undated)
- [S397] — Remotion docs, GSAP (Remotion, undated)
- [S398] — Remotion docs, Lottie (Remotion, undated)
