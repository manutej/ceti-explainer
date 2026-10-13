---
id: erase
title: "erase() / noErase()"
type: Construct
aliases: ["noErase()", "Cutout reveal with erase"]
sources: [S24, S41, S357]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "both"
---

# erase() / noErase()

## Definition
`erase()` makes subsequently drawn shapes subtract from the canvas to transparency, revealing the page behind; `noErase()` ends it [S41].

## Details
- After `erase()`, `fill()`, `stroke()` and `blendMode()` have no effect; `strengthFill` and `strengthStroke` default to 255 [S41].
- `erase()` does not affect drawing done with `image()` or `background()` [S41].
- Both functions are in the Color/Setting group, alongside clip, beginClip and endClip [S357].

## In explainer work
Cutout reveal: draw a layer, call `erase()`, draw the hole shape, call `noErase()` for spotlight and mask effects [S41]. For geometry-based holes see [[begin-contour]] [S24].

## Patterns
**Cutout reveal.** When: spotlight a region of a layer. Pitfall: `image()` and `background()` ignore erase.
```js
// layer drawn first
erase(); circle(mouseX, mouseY, 120); noErase();
```

## Relations
- part_of [[module-color]] — Color/Setting member [S357]
- part_of [[hub-language-core]] (structural)
- conflicts_with [[blend-mode]] — blend mode ignored while erasing [S41]
- alternative_to [[begin-contour]] — compositing vs geometric holes [S24]
- related_to [[layered-compositing]] — used with buffers (inference) [S41]

## Sources
- [S24] — beginContour() reference
- [S41] — erase() reference
- [S357] — p5.js-website repo, `src/content/reference/en` (main branch, last commit 2026-09-30; parsed 759 .mdx entries + 140 constants + 5 types)
