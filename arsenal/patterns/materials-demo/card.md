# materials-demo

**What it is for.** One fixed scene (10x10 grid of dots/rects/slashes, three bars, one arrow, one labelled underline) drawn by
each ARSENAL material, so seats judge the material, not the film. The six variants are the six materials in
`arsenal/materials/drawn/materials.js`: ink, pencil, stitch, chalk, marker, blueprint. Swap `params.material` and nothing else changes.

**When NOT to use.** As a chart. It carries no data. Not for photoreal media or heavy per-frame particle counts (chalk fills cost).

## Material interface (the contract this lane ships)
`ARSENAL.materials[id].mark(p, kind, x, y, w, h, state, tokens)` and `.texture(p, box, tokens)`.
- kinds: rect (box outline) · dot (x,y centre, w diameter) · bar (filled block grows L to R) · line (x,y to x+w,y+h) · arrow (same, head at tip) · label-underline (x,y text baseline-left, w underline length, h font px, state.text).
- state: `{ seed, i, u 0..1 draw fraction, role 'ink|accent|accent2|muted|line|chalk', a alpha, text }`. All randomness from `mulberry32(state.seed + state.i)`: same mark, same wobble, on any re-seek. `u` never changes the random stream, only how much is drawn.
- texture(p, box{x,y,w,h,seed}, tokens): the material's ground. Caller fills `tokens.color.bg` first. ink: grain only if `tokens.texture==='grain'`; pencil: ruled lines + tooth; stitch: weave; chalk: board smudges; marker: dot grid; blueprint: covers the box with blue + 12/60 px grid.
- Tokens: roles only (color.*, type.mono). chalk and blueprint map role `ink` to `chalk` (white on dark / on blue). Blueprint's blue (hsl 214,62%,29%) is intrinsic to the material, the one non-token colour.
- New material: supply three primitives `seg(M,x1,y1,x2,y2,u,o)`, `area(M,x,y,w,h,u)`, `disc(M,x,y,r,u)` (+ `text`), and `make(...)` composes all six kinds; per-kind overrides allowed (blueprint rect/arrow).

## Params
`material` (ink|pencil|stitch|chalk|marker|blueprint, default ink); `dur` seconds (default 4, reveal staggers: grid 0-2.1 s, bars 1.1-3.1, arrow 2.2, underline 2.8-3.6).

## Variants
ink: crisp typeset reference. pencil: wobble, pressure, double stroke, hachure bars, spiral dots. stitch: dashed thread with knots, running-stitch fills, stitched rings. chalk: soft base + seeded dust, ragged edges. marker: three translucent overlapping chisel strokes, zigzag bar fills. blueprint: white on blue, end ticks, crosshair dots, dimension line and width under each bar.

## Atlas
[[p5-scribble]] (bowing/roughness, seed per draw), [[rough-js]] (hachure, double stroke), [[p5-grain]] (seeded speckle), [[p5-brush]] (painterly alternative, not used: needs WEBGL), [[shape-attributes]] (strokeCap/Join choices, round vs butt). Own implementations, no library code.

## Pitfalls
Materials draw with `p.drawingContext` (raw canvas 2D), so p5 stroke/fill state is ignored. Text uses `tokens.type.mono`; the page must load the font (demo uses vendored Plex Mono woff2) or text falls back to monospace. Chalk and marker add many alpha rects/strokes: avoid thousands of bars.

## Cost
About 15 ms/frame at 960x540 x2 density (shoot harness, 24 frames); re-seek purity identical for all six variants.

Renderer: p2d. Fallback: none needed, no beta APIs.
