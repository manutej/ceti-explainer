# glyphs-iso · geometric glyphs and an isometric world

**What it is for.** A 15-glyph vocabulary (node, document, server, person, arrow, both-ways, bend, cycle, lock, clock,
gear, database, cloud, search, check), each a list of polyline strokes on a 100-unit box, drawn at ONE stroke weight
with `build(u)` (strokes run in parallel inside a stagger window; arc-length partial `beginShape`/`vertex`). Clock hands
and gear ticks are `dyn(t)` strokes. Plus `ARSENAL.iso`: `make({ox,oy,s,ang})` -> `project(x,y,z)`, `box` (three shaded
faces, grows by height), `grid`, `path`, `ring`, and `ARSENAL.glyphs.flowArrow` (dashes marching along a polyline with
a growing tip). Use for system diagrams as little worlds, status lights, and icon sheets that match the brand.

**When NOT to use.** Photoreal or filled illustration; true 3D with occlusion (use webgl-scene); more than a few
hundred boxes (painter sort is by x+y+z only, no depth buffer).

## Params (pattern.js defaults)
`layout` sheet|system|stack|floors; `lineW` 1..6 px; `ease` cubic|expo|out|linear; `size` 60..120 (sheet glyph px);
`stagger` 0..0.6 s between glyphs; `buildS` 0.4..2 s per glyph; `speed` 0..80 px/s dash march; `dash` [dash,gap];
`isoS` 30..70 px per unit; `fill` 0.6..0.95 box/cell ratio; `litStart`, `litS` s; roles only (ink, accent, accent2,
muted, line, panel, chalk). Glyph API: `ARSENAL.glyphs.draw(p, T, name, cx, cy, size, u, t, {lineW, role, hiRole, glyphStagger})`.

## Variants
1. **sheet**: all 15 glyphs building in, 1 s each, staggered 0.28 s; clock and gear keep turning after.
2. **system**: client (person) -> service (server) -> database, request arrows in accent and response arrows in accent2,
   dashes marching, a lock appearing on the link.
3. **stack**: 3x3x3 boxes grow in by layer, then a diagonal light sweep (seeded jitter in setup) turns them accent;
   dashed path on the floor; a check at the end.
4. **floors**: two floors on posts, racks, a floor path with a looping packet, a vertical link, a cloud glyph.

## Atlas
[[shape-custom-shapes]] S3, S5 (vertex-per-call partial paths, no transforms inside beginShape); [[push-pop]] S15 (scoped
glyph placement); [[math-trigonometry]] S70 (radians; arcs and the 30 degree projection); [[triangle-subdivision]] S372
(seeded organic jitter at fixed depth, here per-box light offsets).

## Pitfalls / WARNs
Painter order: iso boxes sort by i+j+k; free-standing items in `floors` can overlap (a front rack covers part of the path,
the cloud glyph overlaps the tall rack). Dashes use `drawingContext.setLineDash`, reset after each arrow. Cloud outline is
sampled from circle unions: change the circles and re-check the filter. Dots are filled discs, so "one stroke weight"
means all lines; dots scale with it.

## Cost
~6-7 ms per frame at 960x540, density 2 (shoot report). Renderer p2d. No beta APIs, no fallback needed.
