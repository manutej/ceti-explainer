# gl-heightfield · a matrix as a lit terrain, with contours and a travelling section cut

**What it is for.** A heatmap that reads in 3D. A plain matrix (rows × cols, 40×25 to 200×120) becomes one
`p5.Geometry` (vertices at cell centres, height = value, normals by central differences). It is drawn in one `model()`
call with a custom GLSL shader that does all the per-pixel work: Lambert light from fixed intensities, a colour ramp
from three pack ROLES (passed as uniforms, so changing the pack needs no rebake), contour lines and the wireframe grid
worked out from world height and the slope of the normal, the cut band, the cut clip and the row-by-row count-in. A section
cut travels column by column and always snaps to a real column, so the profile is data and never an interpolation. The
cut can be a band on the surface, or a clip with a section face plus a 2D profile drawn flat. Pins on the matrix
maximum and on the peak of the cut go through `worldToScreen`, drawn flat with the pack's faces. The camera is a
spherical path (azimuth, elevation, distance keys) eased on t. Pure of t. Synthetic data is seeded (mulberry32) in setup. No fetch.

**When NOT to use.** Data that is not on a grid (use gl-pointcloud). Exact cell values the viewer must read (use a
flat heatmap: perspective hides cells). More than about 65k cells (one 16-bit-safe mesh; split it or downsample). Categorical
matrices (height implies order).

## Params (defaults; ranges) · knobs a film exposes are marked (K)
- `data` matrix (array of rows) or `{cols, rows, values}`. null = synthetic `cols` × `rows` (40-200 × 25-120), `synthRange` [0,100]
- `colorData` second matrix for colour (default = data); `vmin`/`vmax` fix the height scale across scenes (null = data min/max)
- `dp` 0-3 decimals, `unit` suffix: every digit on screen is a data value or count (max, peak on cut, contour step = range/contours)
- `size` 500-900 world width; `hscale` (K) 60-260 height of the max; `slab` 0-30 section floor depth
- `wire` bool, `gridW` 0.6-2 · `contours` (K) 0-20 intervals, `contourW` 0.5-2, `contourRole` chalk|ink|muted
- `ramp` 3 role names (default panel → muted → accent); `amb` 0.2-0.6, `key` 0.4-0.9, `rim` 0-0.3
- `reveal` [a,b] fractions of dur (rows count in) or null · `cut` [a,b] or null (K: `cutStart`, `cutEnd` in s)
- `cutMode` band|section|off, `cutW` 1-4, `cutMargin` cols, `profile` bool, `profileBox` [x,y,w,h] px
- `camT` [a,b]; `camAz` (K) deg keys, `camEl` (K) 1-89 deg keys, `camDist` (K) 0.9-1.6 × width keys; `camLook` centre|cut, `follow` 0-1, `fov` 0.6-1.0
- `pins`, `hud` bools · `count(t, st, params)` returns `{cells, of, rows, cols, contours, cutCol, cutPeak}` for a film's caption

knobs_doc rows: `{name:"hscale", range:[60,260], step:10, what:"height of the matrix max in world units"}`,
`{name:"contours", range:[0,20], step:1, what:"contour intervals over the value range (0 = off)"}`,
`{name:"camSwing", range:[0,90], step:5, what:"camera azimuth travel, deg"}`, `{name:"camEl", range:[10,89], step:1, what:"final camera elevation, deg"}`,
`{name:"cutStart", range:[0,12], step:0.5, what:"s when the section cut starts travelling"}`, `{name:"cutMode", options:["band","section","off"], what:"cut drawn as a band or as a clipped section"}`.

## Variants
1. `wire-40x25`: 1,000 cells, hidden-line wireframe (bg-panel fill, grid in ramp colours), rows count in, pin on the max. The cheap one.
2. `lit-200x120`: 24,000 cells, 47,362 triangles, lit, 12 contours (every fifth major), cut as a band plus a faint plane, pins on the max and on the cut peak. The heaviest.
3. `section-120x80`: the terrain is clipped behind the cut. The section face (accent2) and the 2D profile (rows × value, matrix max as a reference rule) are drawn flat. The camera follows the cut. The max pin ghosts to 35 % with "CUT AWAY" once it has been passed.
4. `plan-80x50`: starts top-down (it reads as a contour heatmap), then tilts into 3D: the "heatmap that reads in 3D" move.

## Atlas
[[webgl-mode]] S58 S349 S64 (GLSL ES 1.00, custom shaders WEBGL only); [[build-geometry]] S262 S256 (bake once, `model()`;
here the p5.Geometry is filled directly: no per-cell callback); [[lights-and-materials]] S357 (p5 lights not used, see cost);
[[p5-strands]] S49 S359 (beta, so raw GLSL); [[world-to-screen]] S4 S335; [[camera-slerp]] S54 S335 and [[camera-choreography]] S54
(spherical keys instead of slerp: a true orbit, not a chord); [[gpu-instancing]] S49 S294 (not needed: one mesh); [[frontier-2026]] S10 S362;
[[derived-geometry]] S314 S317 (cut, profile, pins, count recomputed per frame, never stored).

## Pitfalls and WARNs
- p5 style state persists between direct `draw` calls. A `noFill()` left by the section outline made `model()` draw nothing on
  every later seek (purity still said "identical": both frames were wrong). draw is wrapped in push/pop and the mesh
  sets `fill()`. Shoot more than one t per variant: purity alone does not catch a state leak.
- Contour and grid widths are in world units (no `fwidth`: OES_standard_derivatives is not portable), so far lines thin out.
  The slope comes from the normal: `|∇h| = |n.xz| / |n.y|`.
- Normalised colour value rides in the vertex colour's red channel (`aVertexColor`); a host shader must not expect RGB there.
- Pins ignore occlusion. In `plan-80x50` at t = 0 the max label sits over the peak; in `section` the cut-peak leader can cross the face.
- Clip uses `discard` on `x < cut`; the camera must be on the −x side (camAz negative) to see the face.
- Depth is cleared at the start of draw (a host that seeks directly may not clear it).
- Faces: the pack's faces from arsenal/fonts/fonts.js; a pack without a 3D cut (Fraunces, DM Sans, DM Mono) falls back to the same family at another weight, else Big Shoulders Display 600 / IBM Plex Mono 400 (`st.fontNote`).

## Cost (s/frame, 960×540 ×2, SwiftShader, synced by a 1-px readPixels inside seek; median of 12, host load avg ~15 on 4 cores)
| variant | cells | tris | median s | max s |
|---|---|---|---|---|
| wire-40x25 | 1,000 | 1,872 | 0.06-0.12 | 0.28 |
| lit-200x120 | 24,000 | 47,362 | 0.14-0.26 | 0.37 |
| section-120x80 | 9,600 | 18,802 | 0.11-0.19 | 0.26 |
| plan-80x50 | 4,000 | 7,742 | 0.08-0.10 | 0.14 |
shoot.mjs `ms_per_frame` (all variants, includes screenshots) 115-365 ms under the same load. Setup (mesh build) < 0.1 s at 200×120.

## Renderer / fallback
`webgl`. No beta API (no strands, no `instances()`). If `createShader` fails, nothing is drawn: a film should fall back to a flat
heatmap in p2d (data-marks). Without vendored fonts the pins and HUD are skipped and the mesh still draws.
