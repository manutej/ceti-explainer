---
id: world-to-screen
title: "worldToScreen() / screenToWorld()"
type: Capability
aliases: ["worldToScreen", "screenToWorld", "coord conversion"]
sources: [S1, S4, S116, S257, S335, S357]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# worldToScreen() / screenToWorld()

## Definition
`worldToScreen()` and `screenToWorld()` convert between 3D world coordinates and 2D screen coordinates and are new in 2.0, listed in the Environment group **[2.x]** [S1][S4][S357].

## Details
- They are the Environment group's only two new entries among 28 [S357].
- Aliases in the sources describe them as coordinate conversion between 3D and 2D [S4][S116].
- Typical use is 2D labels over a 3D scene: compute the projected point, then draw HTML or P2D text there (inference) [S4].
- The Typography-2.0 tutorial context places them among 2.0 animation and interaction features [S116].

## In explainer work
Lets a WEBGL diagram carry crisp, accessible 2D captions anchored to 3D points, after `resetMatrix()` or in an overlay layer [S4][S335].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- part_of [[module-environment]] — Environment group [S357]
- depends_on [[p5-camera]] — projection uses the current camera [S4]
- related_to [[webgl-mode]] — meaningful in 3D [S4]
- related_to [[layered-compositing]] — pair with overlay layers [S257]
- related_to [[release-2-0]] — introduced there [S4]

## Sources
- [S1] — Reference index (v2)
- [S4] — p5.js v2.0.0 release notes
- [S116] — Greetings from p5.js 2.0: Animation, Interaction, and Typography in 2D and 3D
- [S257] — createFramebuffer() reference
- [S335] — p5.Camera `slerp()` reference
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
