# gl-instances · 10k to 100k marks as one draw, counted in on t

**For.** The population at true scale: every person, case or account is its own mark (dot, flat square, box, bar), with
per-mark position, size, colour role and alpha read from a data array, all in ONE draw call. Marks arrive in a seeded
order and `count(t)` is exact because the count is the instance range itself. A subset can be lit by a brush rect or by
id (`pick`), with an exact count. A density render shows 100k overlapping marks as a distribution, order-independent.

**Not for.** Fewer than ~2,000 marks (use p2d/SVG); marks needing their own label each; transparency-sorted 3D (boxes and
bars are opaque, alpha mixes toward bg); exec-level films that cannot host WEBGL (kit2 `renderer: webgl` + material ink).

## Route (no instances(), no strands, no raw GL buffers)
`model(geom, n)` on 2.3.4 calls `gl.drawElementsInstanced` (verified in the vendored bundle). The shader is GLSL 300 es; per-mark
data lives in an RGBA32F texture (a `p5.Framebuffer` {format FLOAT, NEAREST, density 1}, filled by `updatePixels()`), read with
`texelFetch` at `gl_InstanceID`. Two texels per mark: `x y z s` and `h c a rank(+0.5 if picked)`. One instance = one CHUNK of
256 boxes / 1,024 quads baked side by side at x = j·4 by `buildGeometry`; the shader recovers j and the mark id
`= instance·chunk + j`. Rows are stored in arrival order, so `model(geom, ceil(k/chunk))` draws exactly k marks (the rest of
the last chunk collapse). Labels: `worldToScreen` while the camera is set, then drawn flat after `resetMatrix()` on a hud camera.

## Data and readouts
- `data`: scatter rows `{x,y in [0,1], c, s, a}` or `[x,y,c,s,a]`; waffle rows `{c,a}` or numbers (id → cell, row-major);
  stack rows `{k}` or category numbers; field = a matrix `rows × cols` of values in [0,1]. `null` → seeded synthetic of the same shape.
- `c` = index into `roles` (token roles, never hex); field uses a ramp roles[0] → roles[1] by value.
- Module API: `count(t, st, params)` (marks shown), `picked(t, st, params)` (picked among them), `pick(p, st, ids)` (re-flag a subset
  by data id, re-uploads the texture, returns the count), `draw` returns `{k, n, brushed, picked}`. Brushed counts are computed on the
  CPU from the same f32 values the shader compares, so the readout and the lit marks agree. Stack columns pin their live counts.

## Params (defaults; ranges) · knobs a film exposes (knobs_doc rows) marked K
- `layout` scatter | waffle | stack | field; `mark` dot | square | box | bar; `render` marks | density; `n` 1,000-100,000; `dur` 10 s
- K `countIn` [0.06, 0.70] fractions of dur (each 0-1); `countEase` smooth | linear; K `win` 0.04 (0.005-0.1: arrival window as a share of N)
- `order` seeded | given | value (arrival order); `drawOrder` arrival | depth (depth: front-to-back + collapse; no gain on SwiftShader)
- K `size` 1 (0.3-3), K `alpha` 1 (0.05-1), `grow` 1.6 (1-3 arrival swell), K `dim` 0.55 (0-1, non-selected mix bg→muted)
- scatter: `plot` world box, `dot` 5.5 px (1-10), `mix` 0.28; K `brush` {rect [x0,y0,x1,y1] data units, span, role}
- waffle: `wcols` 500, `pitch` 1.5, `fill` 0.667 (pitch × density integer keeps squares on the pixel grid), `offset`; K `pick` {ids | n, span, role, label}
- stack: `shares` (6), `catRole`, `catNames`, `footprint` 14, `cube` 4.2, `cubeGap` 1.2, `colGap` 34
- field: `rows` 250, `pitch3` 1.7, `barFill` 0.82-0.96, `hmin` 2, `hmax` 120; `faces` auto | list (`['-y','+z']`); `chunk` 0 (auto)
- density: K `exposure` 0.9 (0.2-3), `accDensity` 1 (0.5-2); `cam` {proj ortho|persp, az, el, zoom|dist, fov, look, span} (K camSwing = az span)

## Variants (≥ 3, the range)
1. `dots-10k` · scatter, 10,000 soft dots, two clusters by role, seeded arrival. The cheap one.
2. `flat-100k` · the 2D count layer: 100,000 flat squares, ortho, screen-aligned, no lighting, no depth, 500 × 200 waffle; then
   `pick` lights 1,250 ids (seeded) in accent, readout "1,250 FLAGGED · OF 100,000 SHOWN". A 2D film hosts this as its count layer.
3. `boxes-30k` · unit chart: 30,000 lit boxes stacked by category (bottom-up by arrival rank), ortho orbit, live column counts pinned.
4. `bars-100k` · a 400 × 250 field of bars, height = value, perspective dolly; top + front faces only; max pinned by row/col.
5. `brushed-50k` · 50,000 dots, a brush rect grows over the cluster; readout = marks in the box of those shown.
6. `density-100k` · 100,000 overlapping gaussian dots, `blendMode(ADD)` = (ONE, ONE) into a HALF_FLOAT framebuffer (rgb·w, w),
   tone-mapped `v = 1 - exp(-exposure · Σw)`, colour = weighted mean role, over bg. No sort, no order artefacts.

## Cost (s/frame, 960×540 ×2, SwiftShader, readPixels-synced in `seek`; max of 5 frames; host load avg ~3.5)
| variant | MSAA on (p5 default, kit2) | antialias off (`?aa=0`) | setup |
|---|---|---|---|
| dots-10k (cheap) | 0.12 | 0.09 | 0.04 |
| flat-100k (cheap, 2D count layer) | 0.27 | 0.16 | 0.09 |
| boxes-30k | 0.36 | 0.20 | 0.04 |
| bars-100k (heaviest) | 1.15 | 0.58 | 0.12 |
| brushed-50k | 0.26 | 0.18 | 0.07 |
| density-100k | 0.44 | 0.35 | 0.11 |
Timings move 2-5× with other lanes on the 4-core host (bars-100k read 6-7 s at load 13). shoot.mjs `ms_per_frame` is true here
(the demo syncs) but averages variants and includes setup. WARN boxes-30k: falling boxes pass through the column labels mid count-in.

## Atlas
[[gpu-instancing]] S49 S275 S278 S10 (released route `model(geom, n)`; `instances()` unreleased); [[build-geometry]] S49 S262 S256;
[[p5-framebuffer]] S257 S53 (FLOAT / HALF_FLOAT, textureFiltering, density); [[webgl-mode]] S58 S62 S13; [[world-to-screen]] S4 S335;
[[p5-strands]] S47 S62 (`instanceIndex` alias, not used: plain GLSL); [[frontier-2026]] S275 S10; [[capability-map]] S360.

## Pitfalls and WARNs
- **p5 leaves `UNPACK_PREMULTIPLY_ALPHA_WEBGL = true` and it also applies to Float32Array uploads**: every texel's rgb was multiplied
  by its alpha (the flag channel 0 zeroed colour/alpha). Upload with it set false, restore after (`upload()`).
- **SwiftShader pays per instance** (~10 µs+ each): 100k one-mark instances cost 1.4-2 s even at zero area. Chunking (one instance =
  1,024 quads) cut flat-100k from 2.2 s to 0.2-0.4 s. Keep the chunk; a real GPU does not care.
- Fill-bound in 3D: bars-100k with all 6 faces 6 s, 4 auto faces 2.4 s, top + front 1.0 s (same frame, loaded host). Sides of
  dense bars are hidden by the next row's front; with `barFill` < 0.9 the gaps show a seam where the eye looks along a column.
- MSAA doubles fill cost on software GL. Recommendation for kit2 (not changed here): antialias false for count layers ≥ 50k.
- Culling: under p5's y-down projection `cull: 'front'` removes back faces (`'back'` showed the insides). Unused with `faces`.
- Dots/squares: DEPTH_TEST off (arrival = paint order). WEBGL `p.text` wraps at spaces: maxWidth 2000. `setAttributes` after `createCanvas`.
- Synthetic field data clamps to [0.01, 1]; the max pin is the data max, not the visually tallest bar.
- Fonts: the pack's disp + mono TTF (arsenal/fonts/fonts.js); absent face → Big Shoulders 600 / IBM Plex Mono 400 (`stats().fontFallback`).

## Renderer / fallback
`webgl`, WebGL2 required (GLSL 300 es, texelFetch, gl_InstanceID); no WebGL2: use patterns/mass canvas2d (≤ 50k). When 2.4 ships
`instances()` the chunked `model()` route stays valid; `instanceIndex` only if a strands hook is wanted.
