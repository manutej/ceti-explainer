# gl-volume · a distribution as a cloud of counted cells

**What it is for.** Distributions and tails in an exec film. Samples (or an already-binned 1D/2D/3D histogram) become cells
with exact integer counts, drawn as transparent slabs (1D, 2D: height = count) or cubes (3D: size and opacity = count).
Every frame the visible cells are sorted back to front for the current camera (squared distance to the eye, ties by cell
id: deterministic), and inside each box the back faces go before the front faces, so the transparency is right from any
angle. A cut plane travels on t; it sits inside the sorted stream (cells behind it, the plane, cells in front), the slice
it cuts lights in chalk, the swept side dims, and the slice is drawn flat at the right as a 2D histogram (3D), a profile
(2D) or the whole histogram with the cut line and LEFT/RIGHT counts (1D), with the pack's faces. Cells beyond a tail
threshold light in accent and the tail count lands in the display face, before its ratio.

**When NOT to use.** Fewer than ~5 bins per axis (use data-marks bars); a claim that needs per-sample marks (gl-pointcloud);
continuous density surfaces (gl-heightfield); a cut along x or y of a 3D volume (only z is implemented).

## Params (defaults; ranges) · knobs a film would expose (knobs_doc rows)
- `data` null | samples (numbers, or [x,y] / [x,y,z] arrays) | counts (array, matrix, 3D array); `dataKind` samples | counts
- `dims` 1-3 and `n` 1e3-3e5, `tailFrac` 0-0.4: the seeded demo generator, used only when `data` is null (body + skewed lobe)
- `bins` [nx, ny, nz] 4-48 each; `range` [[lo,hi] per axis] (null = data min/max; samples outside are counted and named in the header)
- `size` world extents [x, y(height), z]; `gap` 0-0.4 (slab gap); `cubeMin` / `cubeMax` 0.2-1 (cube side vs cbrt(count/max)); `alpha` [min, max] 0.03-0.9
- `tail` threshold; `tailAxis` x (snapped to a bin edge, so lit cells sum to the exact sample count) | r (cell centre radius from `tailCenter`)
- `tailIn` [a, b] fractions of dur (tail fade-in); `ratioAt` (ratio line appears; always after the count)
- `build` [a, b], `stagger` 0.1-1 (cells grow in: 1D/2D left to right, 3D densest first)
- `cutIn` [a, b], `cutFrom` / `cutTo` 0-1 along the cut axis (1D: x; 2D, 3D: z), `cutDim` 0-1 (opacity of the swept side)
- `orbit` [az0, az1] deg, `elev` [e0, e1] deg, `dist`, `fov` rad, `look` [x,y,z] (the scene sits left of the inset)
- `inset` [x, y, w, h] css px; `pin` (densest cell pinned via worldToScreen); `source` header text; `axisNames`
- knobs_doc rows: `volTail` {range [lo,hi] of axis 0, what: tail threshold}, `volCutTo` {range [0,1], what: where the cut stops},
  `volCutIn` {range [0,12] s, what: cut start}, `volOrbit` {range [-90, 90], what: final azimuth}, `volCutDim` {range [0,1]}. Never a knob: any count.

## Counts (every digit is a claim)
`count(t, st, params)` (also the return of `draw`) = `{cells, occupied, samples, total, outside, tailOn, tailCells, tailSamples, tau,
cutOn, slice, slices, sliceSamples, dims}`. samples = sum of counts of cells grown in by t; tailSamples = sum of counts of tail cells;
sliceSamples = sum of the slice; ratio = tailSamples / total (binned samples; `outside` are excluded and stated on screen). The
1D LEFT/RIGHT figures are the bin sums strictly left / right of the cut bin. Axis ticks are `range` values; nothing is rounded but %.

## Variants (12 s each; occupied cells drawn)
1. `hist-1d-extruded`: 20,000 samples, 48 bins as extruded slabs, tail x >= 2 (snapped), cut along x with LEFT/RIGHT counts (38 cells).
2. `hist-2d-slabs`: a 20 x 16 COUNTS matrix fed through `data` (the film path), slabs, cut along z leaves the row profile (185).
3. `cloud-3d-cut`: 20,000 samples in 12 x 10 x 12 cubes, radial tail r > 2.6, cut along z, flat 2D slice with a digit per cell (413).
4. `cloud-3d-fine`: 60,000 samples, 24 x 20 x 24; inset cells too small for digits (says so; slice total + max cell stay) (2,468).
5. `cloud-3d-stress`: 300,000 samples, 40 x 32 x 40, the heaviest (11,183 cubes, 400k triangles per frame, one draw).

## Atlas
[[webgl-mode]] S58 S349 (WEBGL origin, GLSL ES 1.00 shaders); [[p5-camera]] S54 and [[camera-slerp]] S54 (camera(), perspective(), separate
cameras; this module keys azimuth/elevation on t instead of slerp); [[world-to-screen]] S4 S335 (pins, tick labels); [[blend-mode]] S36
(BLEND is the default; transparency here sets blendFuncSeparate on raw GL); [[build-geometry]] S262 S256 (why not: geometry and order change
every frame); [[gpu-instancing]] S275 S49 (instances() unreleased on 2.3.4); [[p5-shader]] S64 (aPosition/uProjectionMatrix naming,
highp); [[p5-framebuffer]] S61 (depth-cleared overlay idea); [[frontier-2026]] S10 S275.

## Pitfalls and WARNs
- Instancing: NOT p5 `instances()` (absent) and not ANGLE_instanced_arrays: one dynamic vertex buffer per frame (36 vertices per box,
  pos + rgba, Lambert per face precomputed in JS from token roles), one `drawArrays` on `p._renderer.GL` with a 2-line shader. The
  module saves and restores program, ARRAY_BUFFER, blend func/equation, depth mask and cull state, and disables only attribute
  locations p5's `registerEnabled` does not own; p5 re-points its attributes every draw. A p5 upgrade can break this: re-shoot.
- Cells write no depth (depthMask false) but test against the opaque floor/frame; plane rim lines are drawn after and show through cells.
- Sorting is per cell centre: two overlapping boxes can mis-order at grazing angles (not seen at these gaps).
- Radial tail uses cell centres, not samples: the tail count is "samples in cells whose centre lies beyond r", and the caption says so.
- The mono faces lack the >= and arrow glyphs (drawn as boxes): captions use ">=" in ASCII.
- WEBGL text inserts a hidden 1x1 canvas; the demo parks it (as webgl-scene). Fonts come from arsenal/fonts/fonts.js by the pack's
  `type.disp`/`type.mono` key, falling back to Big Shoulders 600 / IBM Plex Mono 400 (`st.fontWarn` lists any fallback).
- t = 0 shows only the floor and frame (the build starts at 0.03 of dur): a film commits its number before the cells grow.
- shoot.mjs `ms_per_frame` (34-65 ms) does not wait for the GPU; the cost below does (1-pixel readPixels after each seek).

## Cost (s/frame, 960x540 x2, SwiftShader headless, 8 frames per variant after a warm-up, 4 runs incl. swiss-grid; host load avg 11-15)
| variant | cells | s/frame (min-max) |
|---|---|---|
| hist-1d-extruded | 38 | 0.11-0.25 |
| hist-2d-slabs | 185 | 0.12-0.22 |
| cloud-3d-cut | 413 | 0.16-0.33 |
| cloud-3d-fine | 2,468 | 0.29-0.48 |
| cloud-3d-stress | 11,183 | 0.54-0.83 |
Cheap variant under 0.3 s on an idle host: the 1D/2D slabs. Budget (1.5 s) holds for the stress variant. Most of the cheap cost is text.

## Renderer / fallback
`webgl` (p5 2.3.4, WebGL2 context; drawArrays only, so no uint32 index extension needed). Purity: re-seek identical, all 5 variants,
ceti-dark and swiss-grid. If raw GL is unavailable, there is no fallback in this module: use data-marks (p2d) for 1D/2D.
