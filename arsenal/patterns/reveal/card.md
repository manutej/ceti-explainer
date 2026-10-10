# reveal · arc-length draw-on

**What it is for.** Draws paths on by a fraction of their true length, so a stroke grows at constant visual speed
whatever its geometry. Paths are bezier chains (`bezierOrder(3)`, `bezierVertex`) or Catmull-Rom splines
(`splineVertex`), sampled with `bezierPoint` / `splinePoint` into a cumulative length table once in `setup`.
Strokes can be solid, dashed (dash cut by arc length, so dashes never stretch), tapered, tipped with a pen marker
or an arrowhead. Many paths stagger from one parameter. Progress is eased with a selectable family.
Use for axes, arrows, curves, connectors and signatures appearing in step with narration.

**When NOT to use.** Filled shapes (use morph or cutout reveal), text that must stay legible while it types,
closed shapes (do not close a partial spline), anything needing a true SVG path import (unreleased on main;
paths here are authored as points).

## Params (defaults in pattern.js)
- `layout` 'diagram' | 'signature' | 'network'; or `paths: [{spec:{kind:'line'|'bezier'|'spline', pts:[[x,y]..]}, st:{role,w,dash,head,pen,penRole,taper,alpha}}]`
- `ease` 'cubic' | 'expo' | 'back'; `easeMode` 'inOut' | 'out'
- `stagger` 0..1 (0 together, 1 strictly sequential); `dur` s (default 4); `hold` 0..0.4 trailing fraction at full reveal
- `lineW` px 0.5..8 at 960 basis; `dashed` bool; `dash` [dash, gap] px; `pen` bool; `guide` 0..0.5 ghost of the whole path
- `st.role` is a token role (ink, accent, accent2, muted, line, chalk, panel); never hex.

## Variants
1. **diagram**: axes with arrowheads and ticks, dashed asymptote and drop line, a 3-segment bezier response curve
   with pen tip, a dashed spline model curve; cubic inOut, stagger 0.55, faint native ghost. Labels fade in as paths arrive.
2. **signature**: one 26-point spline stroke with taper and an accent pen tip, then an underline flourish;
   expo inOut, stagger 0.8.
3. **network**: 40 bezier connectors across 6-8-6 nodes, every fifth dashed, nodes light when a connector lands;
   back out, stagger 0.35, seeded wiring (`ctx.seed`).

## Atlas
[[arc-length-reveal]] S309 (length table, interpolated last segment), S4; [[shape-curves]] S357, S23 (`bezierPoint`,
`splinePoint`); [[shape-custom-shapes]] S4, S5, S6 (`bezierVertex`, `splineVertex`, `bezierOrder`);
[[easing-functions]] S80, S81 (cubic, expo, back formulas).

## Pitfalls
- `back` overshoots; `u` is clamped to 0..1, so the overshoot reads as a brief flat, not a spill past the end.
- Taper draws one `line` per sampled segment; keep to a few paths (cost rises with path length).
- Dash count = length / (dash+gap); very short dashes on long paths multiply `beginShape` calls.
- `splinePoint` and `bezierPoint` are per-axis; sampling is called with x and y separately.
- Partial paths are polylines (sample density 4-5 px), native curve calls are used only for the ghost guide.
- WARN: the ghost `guide` renders with p5 2.3.4 `bezierVertex`/`splineVertex`; those shape calls are the 2.x API only.

## Cost
8.1 ms/frame at 960x540, density 2 (shoot.mjs mean over 12 renders, headless Chromium). Renderer: p2d.

## Fallback
None needed for released 2.3.4. On p5 1.x, replace the ghost guide with `bezier()`/`curve()` and use own Bezier and
Catmull-Rom sampling in `sample()`; everything else is plain 2D calls.
