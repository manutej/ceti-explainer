# layers · layered compositing, cutout reveals, freeze layers

**For.** Keeping a dense or static layer out of the per-frame redraw and opening windows onto it. A background is drawn once into a
`p5.Graphics`, frozen to a `p5.Image` with `get()`, the Graphics removed, and stamped each frame; only the animated layer (a
veil, a work buffer, a trail layer) is cleared and redrawn. Reveals use `erase()` (hard iris, wipe strips) or a frozen radial
graphics mask composited `destination-out` (soft spotlight). Trails are recomputed from t (path sampled at t - k*dt), never from the previous frame.

**Not for.** Accumulating feedback (smears, reaction looks): that carries history and does not scrub, see [[ping-pong-feedback]].
Not for WEBGL scenes: use `createFramebuffer()` there ([[p5-framebuffer]]); this module is P2D. Not where the field is only ~50 marks (freezing buys nothing).

## Params (`mode`: spot | iris | wipe | comets; all tokens are roles)
| param | default | range | note |
|---|---|---|---|
| dur | 8 | 4-20 s | one loop; spot path and comet orbits close exactly on dur |
| cols, rows | 40, 25 | 8-80 | mark count = cols*rows (1,000) |
| targets | 14 | 0-60 | accent marks, seeded |
| radius | 118 | 40-260 | spotlight radius, units of 960 |
| soft | .45 | .05-.95 | feathered fraction of the mask |
| veil | 232 | 0-255 | veil alpha; higher hides the field harder |
| sweepX, sweepY | 330, 140 | 0-450 | Lissajous half-extents |
| irisEnd | .75 | .2-1 | fraction of dur when the iris is fully open |
| bars | 36 | 8-80 | wipe: values in the before/after |
| hold, edge, slant | .12, 70, .18 | 0-.4, 0-200 px, -.5-.5 | wipe dwell at ends, feather width, edge slope |
| n, trail, span, stars | 5, 80, 1.1, 380 | 1-7, 10-200, .3-3 s, 0-1000 | comets: count, segments, trail seconds |

## Variants
- **spotlight**: 1,000 jittered ticks frozen once; a moving soft window (frozen graphics mask, `destination-out`) in a 91% veil; ADD ring; live count of marks and targets in the window.
- **iris**: same field; `erase()` of a growing disc opens the veil from the centre outward to full frame.
- **wipe**: before (muted raw bars) and after (sorted, accent, ghost outline of origin) frozen; a slanted `erase()` edge with 24 feathered strips moves across a work buffer; ADD edge line.
- **comets**: frozen sky + orbit guides; five comets, 80-segment trails at decaying alpha and width, composited with ADD. Pure of t, so it scrubs.

## Atlas
[[layered-compositing]] S13 S61 S256 S257 S266 S357; [[p5-graphics]] S13 S259 S266; [[erase]] S41; [[blend-mode]] S36 S41;
[[pixel-density]] S266; [[ping-pong-feedback]] S61 (the contrast case); [[p5-framebuffer]] S257 (WEBGL route).

## Pitfalls
- 2.x does not inherit density: every layer calls `pixelDensity(n)` explicitly (`layer()`), or the buffer blurs or doubles.
- `erase()` ignores `image()` and `background()`; erase shapes only. Blend mode is ignored while erasing.
- p5 colour objects are mutable: `setAlpha` on the shared role colour leaked into `background()` and broke purity (state carried between frames). Keep pristine role colours and separate scratch colours.
- Frozen layers need tokens, so they are built on the first draw and rebuilt if the brand changes.
- `p5.Graphics` canvases are appended to the DOM (hidden): a harness must pick the main canvas, which is first.
- A graphic's own transform, style and `drawingContext` state persist; the module save/restores around `destination-out`.

## Cost
About 0.028 s/frame mean over all four variants at 960x540 x2 density (headless Chromium, software GL); comets and wipe are the heaviest.
## Renderer / fallback
p2d. No beta APIs. If `erase()` changed, use `drawingContext.globalCompositeOperation = 'destination-out'` as the spotlight already does.
