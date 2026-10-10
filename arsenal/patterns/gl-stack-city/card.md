# gl-stack-city · same boxes, new partition (stacked bars / treemap city, WebGL)

**What it is for.** A reversal told with a counts matrix (groups x categories): every unit is a box (or one box per k
units), the boxes first stand pooled by group, then each box travels along its own path to its slab in the split by
category, while the camera turns. One baked `p5.Geometry` holds every box with BOTH homes as per-vertex attributes
(`aFrom`, `aTo`, `aInfo`, `aArr` via `p5.Geometry` user vertex properties); one role-lit vertex shader moves, lights
and masks them from uniforms on t. No dissolve, no re-bake between partitions: object constancy (frontier R-D M1).
Hits (e.g. admitted) sit at the bottom of every slab and light bottom-up, so in `split: 'rate'` lit height = rate.
A `tag` follows named units (accent box, outline over everything, trail of its own path, ghost of its old home,
travelling pin). `check(t)` asserts every in-between frame is a valid chart. The simpsons-3d move, generalised.

**3D is the stylistic choice here.** The evidence-first default for pooled -> split is the flat `track-unit` lane
(2D; R-D M1 says 3D adds nothing to the reading). Use gl-stack-city when the film's register wants a sculpture/city
and the turn itself carries the "different viewpoint" beat; keep its labels and counts as the evidence.

**When NOT to use.** More than 12 groups or 12 categories (uniform arrays); when per-cell counts differ by >100x
and k > 1 (small cells round to 1 box, see pitfalls); occlusion-aware labels (pins ignore occlusion); a strict
0.3 s/frame software budget with the full label set.

## Params (defaults; ranges) · knobs a film exposes are marked K (knobs_doc rows)
- `data` matrix `{groups, cats, n[g][c], hit?[g][c], unit, units, hitWord, source}` | `{synth:{G, C, total, seed, hits, skew}}` | null = Berkeley 1973
- `layout` bars | treemap; `split` rate | count; `arrange` row | grid (bars); `labels` slab | block | axis | none
- K `k` 1-1000 units per box; K `budget` 2,000-40,000 boxes (LOD: k = max(k, ceil(units / budget)); readout says "1 BOX = k")
- `size` 3-12, `gap` 0.4-2 (pitch = size + gap); `foot` [4-16, 4-16] pooled cells; `slabFoot` [2-6, 2-6]; `layers` 8-30; `depth` 2-6
- `slabGap` 6-30, `pairGap` 2-12, `groupGap` 10-60; treemap `cityLayers` 3-12, `slack` 1.1-1.6, `aspect` 0.7-1.6, `street` 4-20
- `pooledSort` hit-cat | cat-hit | hit-seeded; `colorBy` group | cat | none; `dim` 0.4-0.75; `maskDim` 0.5-0.9
- K `dur` 8-40 s; K `beats` {arrive, lit, move, reveal} fractions of dur; K `stagger` 0-0.6 (0.25: minimal, each box still on its own path)
- K `lift` 0-40 (arc height); `drop` 0-100 (arrival fall); `arrW` 0.01-0.1; K `orderMix` 0-1 (0 seeded order, 1 category order)
- K `az` [deg, deg], K `elev` [deg, deg], `drift` 0-10 deg, `fit` [0.8-1.4, 0.8-1.4], `lookY` 0.3-0.6
- `reveal` reversal | none (auto: groups with the highest and lowest pooled rate; categories where the low group wins)
- K `tag` [{g, c, j}] or ['GROUP/CAT/j'] (j-th box of the cell, hits first); `checkLine` bool; `pinsMax` 0-6 (axis labels)
- `count(t, st, params)` -> {boxes, k, units, unitsApprox, phase, move, reversals}; `check(t, st, params)` -> {ok, boxes,
  expected, volume, height, travelling, homes, unitsResidual}

## Variants
1. `bars-2x6`: Berkeley 1973 (Bickel et al. 1975), 4,526 boxes, 2 pooled columns -> 12 rate slabs in a row, 90 deg turn; tag one admitted woman in A; reveal "WOMEN HIGHER IN 4 OF 6".
2. `bars-2x6-k10`: the same claim at 1 box = 10 applicants (454 boxes, bigger boxes): the cheap variant.
3. `treemap-4x8`: illustrative seeded 4 x 8 matrix (6,400 units), squarified treemap city pooled by group -> category blocks with groups nested; same ground.
4. `big-12x12-lod`: illustrative 12 x 12, 240,002 units, budget 12,000 -> k = 21, 11,431 boxes; 12 group columns spread along their rows into a 144-bar grid; axis labels, top-3 cells pinned.

## Atlas
[[webgl-mode]] S58 S349; [[build-geometry]] S262 S256 S49 (baked once; here built as a raw p5.Geometry); [[gpu-instancing]] S275 S49 S10
(`instances()` unreleased on 2.3.4: emulated by per-vertex instance attributes in one geometry, not ANGLE_instanced_arrays);
[[p5-shader]] S58 S64 (GLSL ES 1.00, dynamic uniform-array index in the vertex shader); [[world-to-screen]] S4 S335; [[camera-slerp]] S54
(keyed orbit set every frame, no slerp needed for one arc); [[frontier-2026]] S10 S275.

## Pitfalls and WARNs
- Per-cell rounding at k > 1: boxes = round(n / k), min 1 for n > 0; `unitsResidual` (boxes x k - units) is reported by check(); labels always print exact units.
- User vertex properties: `geo.vertexProperty()` pushes with spread (stack overflow above ~100k values); the module creates the
  property with `_userVertexPropertyHelper` and assigns `geo[name + 'Src']` directly. Private p5 API: re-test on a p5 upgrade.
- Index count > 65,535 switches p5 to Uint32 indices (WebGL2 default; WebGL1 needs OES_element_index_uint).
- The bottom face is not baked (20 vertices per box); never view from below.
- The tag outline is drawn after a depth clear so it shows through slabs: it reads as "inside here", by design.
- Labels: slab mode staggers odd groups 44 px; tiny slabs (Berkeley B women, 25) still crowd. Axis mode labels names, not every bar.
- Synthetic data (variants 3-4) prints its source line as ILLUSTRATIVE; a film feeds its own matrix and source.
- WARN framing: in `bars-2x6` the right-most split label can touch the check line; in `big-12x12-lod` the city's front corner
  runs under the count readout and the category axis labels at t = end. Retune `fit`/`lookY` per film, or turn `checkLine` off.
- WARN light packs: misses are mixed toward a white bg, so dim reads as pale (swiss-grid); fine, but say DIM in the legend (it does).
- Fonts: the pack's disp/mono from arsenal/fonts/fonts.js; a family missing there falls back (st.faceNote says which).

## Cost (s/frame, 960x540 x2, SwiftShader, readPixels-synced, mean/max of 6 frames; machine shared with other lanes)
| variant | boxes | vertices | k | mean | max | setup |
|---|---|---|---|---|---|---|
| bars-2x6 | 4,526 | 90,520 | 1 | 0.47 | 0.70 | 0.26 s |
| bars-2x6-k10 (cheap) | 454 | 9,080 | 10 | 0.27 | 0.39 | 0.01 s |
| treemap-4x8 (heaviest) | 6,400 | 128,000 | 1 | 0.76 | 1.11 | 0.29 s |
| big-12x12-lod | 11,431 | 228,620 | 21 (LOD) | 0.44 | 0.53 | 0.28 s |

Fill is the cost (large faces near the camera), not vertex count: the treemap's flat roofs fill the frame. Labels (p5 WEBGL
text) add ~0.05-0.1 s. shoot.mjs ms_per_frame is honest here (the demo syncs with a 1-px readPixels): 548 dark, 598 swiss-grid.
Purity identical on all 4 variants, both packs. check(t) sweep (61 samples per variant, every frame of the move) all OK;
in report.json under `check`, `cost`, `stats`. Units residual from rounding: 0, 14 (k10), 0, 49 of 240,002 (big).

## Renderer / fallback
`webgl`. If user vertex properties break: pack homes into uv + vertexColors as simpsons-3d does (lattice-recovered centres).
Above ~40k boxes: raise `budget` only with a GPU; on software GL keep k automatic. p5 2.4 `instances()`: move aFrom/aTo to per-instance data.
