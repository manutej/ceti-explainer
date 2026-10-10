---
id: arc-length-reveal
title: "Arc-length path reveal"
type: Pattern
aliases: ["Progressive diagram build", "draw-on path reveal"]
sources: [S4, S80, S302, S309, S341, S360]
confidence: medium
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# Arc-length path reveal

## Definition
An arc-length reveal draws a path progressively by a fraction `u` of its total length, giving the "draw the line" effect used in progressive diagram builds [S309].

## Details
- p5.animS replays how a shape is drawn over a given number of frames and keeps per-shape state by ID [S309].
- The method precomputes cumulative length per point, finds the point where cumulative length crosses `u * total`, and interpolates the last segment [S309] (own pattern).
- Precompute the length table once per path; rebuilding it per frame is fine for small paths but wasteful for large ones [S309].
- Native SVG import/export is unreleased on main, so SVG path animation requires manual parsing in released versions **[main / unreleased]** [S360].
- The capability map lists a draw-on pattern in the pattern section [S4].

## In explainer work
Used for axes, arrows, curves and connectors appearing in step with narration, driven by an eased track value [S309][S4].

## Patterns
```js
function partialPath(pts, u) {
  const L = [0];
  for (let i = 1; i < pts.length; i++) L.push(L[i-1] + dist(pts[i-1].x, pts[i-1].y, pts[i].x, pts[i].y));
  const target = u * L[L.length - 1];
  beginShape();
  for (let i = 0; i < pts.length; i++) {
    if (L[i] <= target) { vertex(pts[i].x, pts[i].y); continue; }
    const k = (target - L[i-1]) / (L[i] - L[i-1]);
    vertex(lerp(pts[i-1].x, pts[i].x, k), lerp(pts[i-1].y, pts[i].y, k)); break;
  }
  endShape();
}
```
Pitfalls: pass an eased, clamped `u`; guard against zero-length segments [S309] (inference).

## Relations
- part_of [[hub-motion-rendering]] (structural)
- depends_on [[lerp]] — interpolating the final segment [S309]
- related_to [[p5-animation-framework]] — framework family of progressive drawing [S302]
- related_to [[shape-morph]] — shares arc-length resampling [S341]
- related_to [[explainer-engine-blueprint]] — blueprint pattern P8 [S309]
- related_to [[easing-functions]] — eased `u` [S80]

## Sources
- [S4] — p5.js v2.0.0 release notes
- [S80] — Easing functions cheat sheet
- [S302] — p5_animationFramework README
- [S309] — p5.animS README
- [S341] — Coding Challenge #81 Circle Morphing
- [S360] — p5.js source on `main` (commit aa192a2, 2026-10-07; post-2.3.4 work)
