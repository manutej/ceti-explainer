---
id: redraw
title: "redraw()"
type: Construct
aliases: ["redraw(n)"]
sources: [S9, S100, S129, S131, S137, S338]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# redraw()

## Definition
`redraw()` runs `draw()` once, or `n` times with `redraw(n)`; in the v2.x reference it returns a Promise that can be awaited **[2.x]** [S9][S338].

## Details
- The Promise return matters for stepped capture, because you can await drawing to finish before saving the canvas [S9][S338].
- The 1.x signature was not checked, so whether this is **[changed in 2.x]** is unverified [S9].
- Used with `noLoop()`, each call advances `frameCount` by one, which keeps frames reproducible [S137].
- In event-driven sketches it is called inside input callbacks so that the figure repaints only when something changes [S100].
- Headless-Chrome capture drives a `noLoop()` sketch with `redraw()` and screenshots each frame [S137].

## In explainer work
A frame-stepped exporter loops over frame indices, awaits `redraw()`, then saves the canvas; browser download throttling is why Electron or Puppeteer variants write to disk instead [S131][S137].

## Patterns
Stepped export loop (own sketch; see the export pages for the full pipeline).
```js
async function exportAll(total) {
  noLoop();
  for (let i = 0; i < total; i++) {
    await redraw();               // Promise in 2.x reference
    saveCanvas('f' + nf(i, 4), 'png');
  }
}
```
Pitfalls: assigning `frameCount` yourself is undocumented, so pass the index into the scene instead [S129][S131].

## Relations
- part_of [[hub-motion-rendering]] (structural)
- depends_on [[loop-control]] — manual stepping needs `noLoop()` [S9]
- enables [[frame-stepped-export]] — the awaited call is the core of stepped capture [S131]
- related_to [[event-driven-redraw]] — repaint on input only [S100]
- related_to [[puppeteer-capture]] — headless capture steps with it [S137]
- related_to [[video-export-pipeline]] — part of the offline pipeline [S131]

## Sources
- [S9] — redraw() reference
- [S100] — Discourse: pause/noLoop sketch when not visible
- [S129] — frameCount
- [S131] — Best way to export an animation from a p5.js sketch in 2026
- [S137] — Export Pipeline (p5js agent-skill reference)
- [S338] — `redraw()` reference
