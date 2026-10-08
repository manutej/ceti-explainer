---
id: push-pop
title: "push() and pop()"
type: Construct
aliases: ["push()", "pop()", "style stack", "state stack"]
sources: [S3, S15, S26, S259, S349, S357, S358]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# push() and pop()

## Definition
`push()` saves the current [[drawing-state]] and `pop()` restores it; they must be called as a pair and can be nested [S15]. They moved from Structure to Transform in the 2.x reference [S357][S358].

## Details
- Saved: fill, stroke, strokeWeight/Cap/Join, rectMode, ellipseMode, colorMode, text settings, tint and transforms [S15].
- In WEBGL, `push()` also saves camera, lights, texture, material and shader [S15].
- Experts treat each pair as a lexical scope and keep it balanced; an unmatched `push()` leaks state across frames [S15].
- Transform calls and shape-building calls cannot be mixed: no transforms between `beginShape()` and `endShape()` [S3].
- The official custom-shapes tutorial uses push/pop-scoped translate and scale to place shapes [S26].

## In explainer work
Wrap every diagram glyph as `push(); translate(); rotate(); ...; pop();` so reusable components compose without style leaks [S15]. See the pivot pattern in [[module-transform]] [S349].

## Patterns
**Scoped glyph.** When: any labeled node or arrow. Pitfall: unbalanced pairs.
```js
function arrowAt(x, y, a, c) {
  push(); translate(x, y); rotate(a);
  stroke(c); line(0, 0, 60, 0);
  fill(c); triangle(60, 0, 50, -5, 50, 5);
  pop();
}
```

## Relations
- part_of [[module-transform]] — group member in 2.x [S357]
- part_of [[hub-language-core]] (structural)
- part_of [[drawing-state]] — mechanism for saving state [S15]
- enables [[shape-custom-shapes]] — scoped placement of shapes [S26]
- related_to [[immediate-mode]] — per-frame state discipline [S15]
- related_to [[p5-graphics]] — buffers carry their own state [S259]

## Sources
- [S3] — beginShape() reference
- [S15] — push() reference
- [S26] — Tutorial: Custom Shapes and Smooth Curves
- [S259] — p5.Graphics reference
- [S349] — Coordinates and Transformations (tutorial)
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
- [S358] — p5.js-website repo, `v1` branch reference (1.x reference; parsed 905 entries)
