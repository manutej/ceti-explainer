---
id: performance-profiling
title: "Performance profiling"
type: Technique
aliases: ["Chrome Performance profiler", "Profile first", "Perf budget for animation", "Setup-time caching", "Optimizing sketches tutorial", "How to Optimize Your Sketches"]
sources: [S131, S243, S255, S256, S264, S267, S270]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# Performance profiling

## Definition
Performance profiling in p5 means measuring first: read `frameRate()`, wrap suspect code in `millis()` timings or use the Chrome Performance profiler, and change one thing at a time [S255][S256][S243].

## Details
- The wiki advises optimising the algorithm rather than micro-tuning, targets a steady 30 to 60 FPS, and says `console.log()` slows code [S255].
- Official tutorial guidance: avoid creating new vectors in hot loops, move heavy work to `setup()`, set `p5.disableFriendlyErrors = true` or use the minified build; the wiki says disabling can be up to about 10x faster in some cases [S243][S255].
- Wiki Chrome benchmark of 10,000,000 calls: `random` 283.88 ms (p5) versus 190.01 ms (`Math`); in the Editor 2430.28 versus 85.56 ms; figures date from p5 v0.5.2 and are directional only [S255].
- The tutorial suggests spatial partitioning to cut pairwise collision cost; compare squared magnitudes with `magSq` to avoid `sqrt` [S243][S255].
- GPU levers: framebuffers, `buildGeometry()`, filter shaders in place of `pixels[]` loops, lower `curveDetail()`, `setAttributes({antialias:false})` [S256].
- The tutorial gives no measured speedups [S256].
- Test in multiple browsers; the compositing cost of WEBGL layers on P2D canvases is a forum observation [S270].
- No source quantifies `text()` cost or glyph caching; caching text layers is an inference from the static-graphics tip [S267].

## In explainer work
A perf budget per frame matters for live embeds; for offline export, slowness is acceptable [S131].

## Patterns
Time one block over many runs.
```js
let acc = 0, n = 0;
function draw() {
  const t0 = millis();
  suspectWork();
  acc += millis() - t0; n++;
  if (n === 60) { console.log((acc / n).toFixed(2) + ' ms'); acc = n = 0; }
}
```
Pitfalls: remove logging for final builds [S255].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- uses [[frame-rate]] — FPS readout [S255]
- uses [[millis]] — manual timing [S255]
- related_to [[friendly-error-system]] — FES slows sketches [S243]
- related_to [[build-geometry]] — baking lever [S256]
- related_to [[perf-regressions-2x]] — known 2.x slowdowns [S264]

## Sources
- [S131] — Best way to export an animation from a p5.js sketch in 2026
- [S243] — How to Optimize Your Sketches
- [S255] — Optimizing p5.js Code for Performance (wiki)
- [S256] — Optimizing WebGL Sketches (tutorial)
- [S264] — Performance differences with POINTS between 1.11 and 2.0
- [S267] — Issue #7026 Typography module revamp RFC
- [S270] — Optimization question about WEBGL
