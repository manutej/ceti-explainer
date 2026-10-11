# Wave WOW · from "decent, sometimes great" to the product-demo bar (2026-10-11)

Owner's words after six films shipped: "decent as videos but still not WOW like Claude motion natively ships in product
demos. We may be missing something to really make it stick. Some neat tricks, but not nailed. Consider with meta research
what else we can do, routing subagents to take this up a level, and the latest libraries that would use the strengths of
WebGL and p5.js in a maximally effective way."

## What we have (so the research measures the gap, not the inventory)
- p5.js 2.3.4 vendored (no runtime fetches, by law); kit2 WEBGL renderer at 960×540, pixelDensity 2; render(t) pure;
  frame-stepped export (arsenal/tools/export.mjs, ~0.4 s/frame at 4K) so any per-frame cost is affordable.
- Arsenal: 37 lanes; Wave GL 13 (instances, heightfield, ribbons, pointcloud, stack-city, camera-rig, post, volume,
  labels, uncertainty-hop, formula-bind, track-unit, scale-anchor). gl-post has linear half-float, DoF with depth, bloom,
  grain, vignette, chroma, PBR Neutral tone map, and `renderAccumulated` (temporal sub-frames: motion blur + AA). The six
  wave films use material "ink" and none of the post stack; their camera moves are cubic in-out; text is flat SVG over
  the canvas; transitions are hard cuts; no lighting beyond flat shading; silent by law.
- Grammar: arsenal/frontier/R-E-perspective-shift.md (moves, holds, label rules). Gate G1–G11.

## The question for this wave
What, concretely and measurably, separates our films from the motion that Apple, Linear, Stripe, Vercel, Figma and
Anthropic ship in product demos, and which of those properties can a pure render(t) in p5 WEBGL reach, with which
libraries or techniques, at what cost in page bytes and seconds per frame?

## Lanes
R-W1 motion craft (what makes it stick): principles, timing, choreography, transitions, type, light; a measurable rubric.
R-W2 p5.js 2.x WebGL frontier: what the current p5 (2.3–2.x, 2026) can do that we do not use.
R-W3 libraries beyond p5: what to vendor, what to borrow as technique, with license, bytes, purity and a D-row proposal.
R-W4 cinematic post, camera and light for data pictures: recipes our kit can run headless.
A-W5 (Opus) gap audit: our six films' frames against the product-demo bar, ranked by what it buys a viewer.
Then: a build wave of arsenal lanes for the top gaps, and one film re-cut as the proof, judged against the rubric.

Research files: factory/research/WOW-{MOTION,P5-FRONTIER,LIBRARIES,CINEMATIC}.md and factory/research/WOW-GAP-AUDIT.md.
Egress blocks WebFetch; WebSearch snippets only; grade claims A/B/C; name versions and dates.
