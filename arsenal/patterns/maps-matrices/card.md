# maps-matrices

Two-dimensional fields as explainer structures, p2d, pure function of t (6 s per variant). It is for any claim whose evidence is a
grid: a confusion matrix, a heatmap, a map of regions, an adjacency table. Every variant counts before it colours: a numeral for the
cells (or cases, or edges), a legend of bin/region counts with hollow swatches, and only then colour, which comes from an OKLCH
ramp built from `tokens.color.accent`. Marks (dot, cross, filled square, route dot, capital letter) carry meaning besides colour.

## When NOT to use
Fewer than about 8 cells (use a plain table or structures.columns); more than ~2000 cells (per-cell paths get slow, use
patterns/mass); real geography (the coastline is noise, not data); n > ~30 for adjacency (labels and cells fall below 7 units).

## Params (defaults in `params`; `mode` picks the drawing)
- `mode` 'confusion' | 'heatmap' | 'territory' | 'adjacency'; `kicker`, `title` strings; `seedOffset` int added to ctx.seed.
- confusion: `classes` 2..4 (2 uses the fixed TP/FN/FP/TN example, else seeded counts), `markPitch` 7..12 px; cases per mark is
  derived (shown as "1 mark = k cases").
- heatmap: `n` 8..28 (grid side), `bins` 3..7.
- territory: `cell` 'hex'|'square', `size` 5..10 (cell radius), `sea` 0.1..0.4 (higher = smaller island), `regions` 3..7 (letters A..).
- adjacency: `n` 9..15, multiple of 3 (three communities; matrix blocks show them).

## Variants
1. confusion-2x2: 200 cases, dots for right calls, crosses for wrong; accuracy, then precision (solid box) and recall (dashed box).
2. confusion-4x4: same grammar at n by n, seeded counts, same metrics for class A.
3. heatmap-20: 400 cells, five equal bins; legend counts first, cells light in value order, ramp bar last, top bin gets dots.
4. territory-hex: noise coastline (largest component kept), regions light outward from capitals, Dijkstra route A to B animates cell by cell.
5. territory-square: same on square cells, 4 regions, different seed.
6. matrix-graph: symmetric adjacency fills row by row (2E cells for E edges), then rows become nodes (left column to force layout, positions
   interpolated) and cells fly to their edges; the highest-degree row and node light together.

## Atlas
[[noise]] S65 S71 S72 S76 (noiseSeed + noiseDetail in setup, coastline, region warp, heat data, route cost); [[lerp-color]] S42 S123 and
[[color-spaces-2x]] S30 (ramp is OKLCH, own maths, built once in setup, not via p5 color objects, because of the 2.x creation cost);
[[pixels-array]] S37 S256 (not used: per-cell drawingContext rects are cheaper than a pixels[] loop at these sizes).

## Pitfalls
- noise() is global state: it is read only in setup after noiseSeed, so re-seeking draws the same frame. Do not call it in draw.
- Brand packs with a light bg flip the ramp direction (dark = high). Low end is the panel colour, so empty cells stay readable.
- Region colours are ramp steps, so adjacent regions can look alike; borders (ink) and capital letters separate them. WARN: with
  `regions` > 5 the steps get close; rely on the letters.
- Warped Voronoi can leave a region as two pieces; the route may cross a third region (that is the point of the route).
- WARN: square cells show gaps (cell drawn smaller than pitch); chrome textures (paper, grain) are not drawn here.
- Fonts come from the pack's type roles; load them before first draw (the demo does).

## Cost
about 5 to 7 ms per frame at 960x540 x2 (shoot.mjs, 24 stills, hex island is the slowest). Setup is one-off.

## Renderer / fallback
p2d only; uses canvas 2D via p.drawingContext plus noiseSeed/noise/describe from p5 2.3.4. No beta API.
