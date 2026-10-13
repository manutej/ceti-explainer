# gl-ribbons · flows as 3D ribbons between node slabs, units riding as countable marks

**What it is for.** A sankey in depth for queues, funnels and cost of delay. Nodes are slabs (height = units through the
node). Links are cubic splines in x, y, z, resampled at uniform arc length, baked once as bands or tubes whose width is
proportional to quantity. Each ribbon grows source to target in the fragment shader (uv.x = arc length, `discard` past
`uGrow`). Units ride the ribbons as marks (1 mark = `unit` units), and target slabs fill as marks land. So every
caption is a count: `count(t)` returns marks riding, units landed per node and per link, and in the queue model
arrived / waiting / served / head-of-line wait / unit-seconds of delay. Pure of t. Seeds are used in setup only
(mulberry32): departures, lanes and Poisson arrivals are solved there, and draw only compares them with t. No fetch.

**When NOT to use.** Cyclic flows or back edges (layers come from the longest path from a source, so there are no
cycles). More than ~15 nodes per layer, where labels collide. Flows whose quantity changes along a link. A 2D sankey
read at a glance with no depth argument (use p2d). Occlusion-aware labels (pins ignore depth).

## Data (plain arrays; a film feeds its claims here)
`data: [[source, target, q, role?], ...]` (nodes inferred, label = id) or `{ nodes: [{id, label, layer?, z?, role?, show?, slabW?}],
links: [[s,t,q,role] | {s,t,q,role}] }`. Queue model: `data: { arrivals: [seconds...], labels: {src, queue, done} }`, or none
(seeded Poisson from `queue.lambda`). `role` is a token role name (accent, accent2, muted, ink, chalk); never hex.

## Params (defaults; ranges) · knobs a film would expose are marked K
- `model` flow | queue; `shape` band | tube; `dur` 12 s; `readout` `{node: id}` (big count + "OF <source total> <unitName> · <label>")
- layout: `X` 400-760 layer spread; `H` 240-380 stack height; `gap` 8-50; `k` 0 = auto (units to world px); `slabW` 12-90; `slabD` 10-60;
  K `zSpread` 0-120 (depth between nodes of one layer); K `curv` 0.3-0.7; K `thick` 4-40 band depth; `tubeMax` 20-90; `seg` 24-64; `ring` 8-16
- marks: `unit` 1-100 units per mark (the caption line says so); `unitName`/`unitSingular`; K `markSize` 1.2-7; `markRole` chalk; `markFlat` 0-1
- timing (flow): K `lead` 0-2 s; `tail` 0.5-3 s; K `grow` 0.3-2 s (ribbon draw-on); K `travel` 0 = auto, 0.6-3 s; `overlap` 0-0.6 (stages overlap); `jitter` 0-1
- queue: `queue.lambda` arrivals/s 2-15; `queue.mu` services/s 1-15; `t0`/`t1` arrival window; `travel1`/`travel2` s; `queueW` 50-120 slab width
- look: K `stripes` 0-1 (travelling stripes; **0 at exec level**); `stripeLen` 12-60; `stripeSpeed` 0-2; `amb` 0.4-0.9; `fog` [near, far]; K `fogK` 0-0.6; `ribbonMix` 0.5-1
- `cam` keyed cameras `[{t (fraction of dur), eye, look, fov}]` slerped on t; `labels` gl | none; `pinBig` 18-34; `clear` true
knobs_doc rows: `{name:"zSpread",range:[0,120],step:5,what:"depth between nodes of one layer"}`, `{name:"travel",range:[0.6,3],step:0.1,what:"seconds a mark rides one ribbon"}`,
`{name:"grow",range:[0.3,2],step:0.1,what:"ribbon draw-on seconds"}`, `{name:"markSize",range:[1.2,7],step:0.2,what:"mark side, world px"}`,
`{name:"stripes",range:[0,1],step:0.1,what:"flow stripes gain (0 = exec)"}`, `{name:"fogK",range:[0,0.6],step:0.05,what:"depth fog toward bg"}`, `{name:"curv",range:[0.3,0.7],step:0.05,what:"spline handle length"}`.

## Variants
1. `funnel-two-layer`: 1,000 visitors to SIGNED UP 320 / LEFT 680. Bands, 1 mark = 1 visitor (1,000 marks), readout "320 OF 1,000 VISITORS · SIGNED UP".
2. `sankey-multistage`: 4 layers, 8 nodes, 13 links, 2,400 requests, 1 mark = 10. `zSpread` 70 puts ribbons in depth; stripes on; the camera orbits 3 keys. Readout REOPENED 280.
3. `queue-arrivals`: seeded Poisson arrivals (lambda 8/s) into a FIFO server (mu 5.2/s). Waiting marks stack as a grid on the queue slab. The readout is waiting now, with arrived, served and head-of-line seconds.
4. `funnel-tubes`: the same funnel, one stage further (PAID 48), as elliptic tubes; data given as a bare links array.

## Atlas
[[webgl-mode]] S58 S349; [[build-geometry]] S262 S256 (ribbons baked once, `model()` per link); [[shape-curves]] S23 S12 (cubic bezier evaluated by hand
so the frame and arc length are exact); [[spline-vertex]] S5 (considered; not used because a band needs per-sample frames); [[vertex-property]] S4 (considered; uv
via `vertex(x,y,z,u,v)` carries arc length instead); [[world-to-screen]] S4 S335; [[camera-slerp]] S54 S335; [[p5-shader]] S64 S58 (GLSL ES 1.00 custom
Lambert); [[gpu-instancing]] S275 S49 and [[frontier-2026]] S10 S275 (`instances()` unreleased on 2.3.4).

## Instancing: which route
None of the GPU routes is used. Marks are emulated as one CPU batch per frame (`beginShape(TRIANGLES)`, 2 triangles per mark, positions from the baked
arc-length frames), because mark state (lane, ride fraction, queue slot) is t-dependent per unit. The mass card measured this route at 7 ms per 1,000
quads. Measured here: 3,000 marks on screen at once, 0.38 s/frame. Above ~10,000 on screen, move the marks to a vertex shader (bezier control points as
uniforms, departure time and lane as attributes). That route is designed but not built.

## Pitfalls and WARNs
- WARN sankey-multistage t = 0: the first key puts the REQUESTS slab's pin near the readout (overlap for about 1 s). Retime the camera key in a film.
- Middle-layer pins sit above their slab and can overlap incoming ribbons. A bg plate (alpha 0.8) keeps them legible. Pins ignore occlusion.
- Queue slots jump one place at each service start (discrete FIFO rank). Ease it with a film-side lag if the jump reads as jitter.
- `p.textureMode(NORMAL)` is set during the bake so uv stays 0-1 (restored to IMAGE). Bake with `noStroke()`, or edges become stroke geometry.
- Tubes deeper than `slabD` poke through slab faces (`tubeMax` 70 vs `slabD` 34 in variant 4, accepted). Bands clamp depth to `min(thick, width)`.
- Jittered departures are sorted, so landed counts are monotone in t. The last mark of a link carries the remainder, so units landed = min(q, marks x unit).
- Light packs: lighting is scalar (ambient + key x Lambert) on role colours, not chalk-as-light. swiss-grid (chalk = black) renders correctly.
- Fonts: the pack's disp/mono come from `ARSENAL_FONTS` (TTF). A family missing there (e.g. Fraunces) falls back to Big Shoulders 600 / IBM Plex Mono and
  the fallback is recorded in `state.fontNote`. WEBGL text adds a hidden canvas, which the demo parks.
- Demo `seek` ends with a 1-px `readPixels`, so the shoot.mjs `ms_per_frame` waits for the GPU (it is honest here, unlike webgl-scene's).

## Cost (960x540 x2, SwiftShader, headless; draw + GPU finish; mean of 6 frames, max in brackets; two runs, ceti-dark / swiss-grid)
| variant | s/frame | marks on screen (t = 6 s) |
|---|---|---|
| funnel-two-layer | 0.26 / 0.31 (0.49) | 300 |
| sankey-multistage (heaviest) | 0.34 / 0.24 (0.51) | 184 |
| queue-arrivals (cheap) | 0.16 / 0.23 (0.34) | 34 |
| funnel-tubes | 0.18 / 0.24 (0.45) | 25 |
| stress: funnel at 10,000 units | 0.38 (0.49) | 2,997 |
Setup (bake 4 variants + fonts): 0.5-0.6 s. shoot.mjs: purity identical on all 4 variants in both packs, 0 errors, ms_per_frame 155 / 189.

## Renderer / host / fallback
`webgl`. kit2: `st = await R.setup(p, {seed, tokens: K.tokens, fonts: {disp: K.font3d('disp'), mono: K.font3d('mono')}}, params)`, then call
`R.draw(p, t, st, params, tokens)` in render with `labels:'none', clear:false`. Draw the returned `pins` / `readout` / `unitLine` with `K.tx` (role them). Material
`ink`, no post at exec (`stripes:0`, `fogK` ≤ 0.35). No beta API is used (no strands, no `instances()`), so no fallback is needed.
