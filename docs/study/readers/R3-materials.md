# R3: Materials slice (seven Materials, shared helpers, fonts)

Scope: the seven material adapters and their kernels, `_shared.js`, `core/am.js`, `compose.js`, `build_film.py`, `fonts/`. Timings are from `demo/out/smoke-*.log`.

## 1. The seven Materials

| id | title · kernel source | axis · cell (along/across/max) | nRange | ground | fonts |
|---|---|---|---|---|---|
| stitch | Knitted cloth · run.kit.js | y · .72/1/34 | 1–2500 | #2A231E | Jost 400/500/600 |
| plate | Cyanotype light table · exposure.kit.js | x · 1/.12/14 | 1–4000 | #0E2C4F | Sofia Sans Extra Cond. 500/600; Red Hat Mono 400/500 |
| pen | Field notebook · margin.kit.js + margin.glyphs.js | x · 1.6/1/22 | 1–100 | #DCE4D6 | none (single-stroke glyphs) |
| isotype | Ledger in motion · ledger.kit.js | x · 1.25/1/30 | 1–120 | #171B23 | Newsreader 400/600; Plex Sans Cond. 400/600 |
| maps | Marbling on size-water · marbling.kit.js | x · .9/1/40 | 1–120 | #D2D4CA | IM Fell English 400; Alegreya Sans 400/500; DM Mono 400 |
| sediment | Delta survey sheet · delta.kit.js | x · 1/.16/16 | 1–4000 | #3A2D21 | Cormorant Garamond (declared 600); Plex Sans Cond. 400/500; Plex Mono 500 |
| gear | Escapement plate · escapement-geometry.js | x · 1/.55/26 | 1–300 | #12161C | DM Sans, Space Mono (CETI set, always embedded) |

markRule (unit · step · address · save · cost):

| id | unit · step | address | save | cost |
|---|---|---|---|---|
| stitch | column (run) · row (row 0 top) | peach slack loop at dropped row | sage stitch, re-knit | sage bead per row knit twice |
| plate | thread of light · slit | thread stops; peach dot | thread jogs; sage bead | sage bead per slit exposed twice |
| pen | ruled loop line (run) · loop | pen lifts; peach × | doubled loop ringed sage | sage tick per loop written twice |
| isotype | job slip (run) · turn | slip stops whole, struck peach | dog-ear (checked, redone) | slate hourglass per redone turn |
| maps | tray strip (run) · comb pass | peach stray drop at its pass | sage skimmer lifts drop | sage skim line per redone pass |
| sediment | grain (run) · weir | grain settles on bank at weir | sage braid round weir | sage grain per weir crossed twice |
| gear | involute rack (run) · tooth | tooth cut short, peach; rack stops | sage pawl re-engages | sage pawl per tooth cut twice |

Nouns (unit · step · edge · check): stitch column/row/hem/hook; plate thread/slit/rim/catch; pen line/loop/margin/check; isotype slip/turn/edge/review; maps tray/pass/edge/skimmer; sediment runnel/weir/bank/braid; gear rack/tooth/ends/pawl.

Voice (step tick, fail clack, reveal tone; Hz): stitch 2600/160/330; plate 5200/140/262; pen 5200/220/349; isotype 3000/200/440; maps 1800/240/294; sediment 1500/120/220; gear 3400/190/392. Save and commit are clicks; cost is a tick.

## 2. Kernel techniques

- **stitch.** Procedural stockinette atlas: 13 sprite variants (knit, loose, bar, crimp, loop, bind), each shaded per pixel (Lambert tube lobe, 2-ply twist phase, fuzz, AO), 2×2 supersampled and rip-mapped to 7×7 levels. Columns are forward-splatted into a float accumulator with exact sub-pixel horizontal coverage. Felt ground and cloth shadow come from four box-blur passes. Ladder (crimp) rows descend at 30 rows/s in closed form.
- **plate.** CPU float plate. Each thread is a Gaussian splat with exact column coverage. The field passes an H&D curve, D(l)=0.07+2.45/(1+e^{−(l−0.35)/0.72}), then a cyanotype print P=(1−e^{−3T})/(1−e^{−3T_m}), baked into a 1,024-entry OKLab LUT over log2 E in [−9, 7]. Static grain (0.30 stops), brushed sensitiser edge, shoulder clip, no bloom. Titles are photogram masks developed along the curve in `end()`.
- **pen.** Dynadraw spring–mass nib (ω=2π·26 Hz, ζ 0.72, 1,500 Hz integration) following a two-thirds-power hand (v=K·κ^{−1/3}). Pressure-shaded downstrokes, a depleting reservoir with dry skips, re-dips. Washburn bleed r=r∞·√(age/τ); iron-gall ink oxidises from wet blue to blue-black. Rows are simulated once per (k, failAt, caught, seed mod 7) and are scale-free. Hand A (EMS Allure, results) and hand B (EMS Felix, graphite) are OFL single-stroke glyphs.
- **isotype.** Pixel-grid pictograms (job, fail, ear, clean, hourglass, stamp) drawn once into a 2× atlas. Slips are blitted unscaled at their progress point; the ruled line behind them is the path travelled. The kit also ships a Hungarian assignment (Kuhn–Munkres with potentials, O(n²m); `LG.assign`), which this adapter never calls.
- **maps.** Jaffer–Lu closed-form maps: drop x'=c+(x−c)√(1+r²/|x−c|²); comb x'=x+z·φ(q)·M with q invariant, φ a tabulated periodic cosh-kernel sum. `MK.pull` carries each pixel back through every op, newest first. Mottle is a 3-octave 64² value-noise table sampled in pre-image space. Each frame does a full per-pixel pull over a cached op list.
- **sediment.** Terrain: fBm with a ridged term, hypsometric tint, Lambert hillshade, 25 marching-squares contour levels, bathymetry. Grains are sprite-batched discs in rim, body and three tones. The adapter adds deposition: a failed grain settles at its weir column and stacks at angle of repose, rolling to a lower neighbour, in item order.
- **gear.** Exact 20° involute (`ESCG.involute`). A rack is the involute of infinite radius, so its teeth are straight-flanked 20° trapezoids. A failed tooth is omitted and drawn as a peach half-tooth. At focus a z=12 pinion rolls with rack travel r·θ. `escapeTeeth` (Graham escape wheel) is extracted but unused.

## 3. The Material contract

`AM.material` (core/am.js:47) throws at registration unless these keys exist: id, source, axis, cell, nRange, ground, begin, units, mark, line, area, text, num, anchor, end, voice. `check.mjs` uses the same list. Title, markRule, nouns, fonts and tokens (stitch only) are conventional; `setup` is optional. `compose.js:23` copies markRule and nouns into metadata and nothing checks them. Mark kinds and line roles are free strings, and an unknown kind silently draws nothing (plate's `markOp` has no fallback).

Per frame (compose.js:131–136): `begin(p,ctx,t,cam)` returns S; modules call `M.units(S, items, t)` once per beat with the whole batch; then `mark/line/area/text/num`; then `end(p,S)` flushes. Compose wraps text and num. Digits are allowed only through `num` with an `AM.Number`, or with `given`/`sketch`. Role floors: title 18, head 16, text/num/sketch 14, note at least 10 px.

`begin` reuses or allocates a raster at `AM.renderScale(ctx)` (min(k, 1.5)). `units` is the only pixel path. `mark/line/area/text/num` queue into `S.q` (stitch, plate, maps, sediment) or draw immediately (pen, isotype, gear). `anchor` is `AM.stepPoint` except pen and gear. `end` composites: stitch adds a cloth shadow, plate tone-maps, the rest blit.

## 4. Shared helpers (pedagogy/_shared.js)

STAGE rect (56,100,848,352). `grid` is cached by id/N/k/stage. `rackRect` is axis-aware: x leaves 208 px on the right for the count edge; y leaves 34 px at the bottom. Also `edgePoint`, `curve` (survival polyline revealed to u), `band` (±2 sd), `bandRules`, `drawRuns` (= `M.units(AM.items(...))`), `head`/`sub` with a fade, and `countAt` (realised and expected markers with labels). It never draws.

## 5. Differences

- **Address.** Plate: peach dot, thread stops. Stitch: peach loop at the row; crimp ladder if lost. Pen: peach pencil × at (f+0.75)/(k+0.6). Isotype: struck sprite. Maps: stray drop that later passes comb. Sediment: grains pile on the bank, the only kernel where failures build geometry. Gear: peach half-tooth.
- **Rack and batching.** All use `AM.layout` (grid, or rack sorted by survival). Stitch paints one batch per screen band; plate, pen, isotype and gear loop per item; maps pulls per pixel per item; sediment batches by radius after piling.
- **Commit (guess mark).** Plate: grease-pencil cross. Stitch: bone split-ring marker. Pen: graphite cross. Isotype: grey T-bar. Maps: ink cross. Sediment: survey stake. Gear: ink cross.
- **Numbers.** Text role `num`; compose formats the string ("x of N", "(sketch)"). Num faces: plate Red Hat Mono 17; stitch Jost 600 22; pen hand A at x-height 8.6; isotype Newsreader 600 18; maps DM Mono 16; sediment Plex Mono 16; gear Space Mono 16. Expected is a copper marker; realised is ink (sage in stitch).

## 6. Caching and cost

Caches: stitch renderer per scale, atlas once in `setup`, felt per renderer. Plate surface per (R, seed), global LUT, reused energy buffer. Pen paper per scale, rows scale-free. Isotype ground per scale, atlas via `ctx.layer`. Maps ground per frame size, op lists per (k, failAt, Lx), cleared past 4,000 entries. Sediment terrain once at 960×540, CPU canvas per k. Gear ground per scale.

Measured per frame (smoke graph: N=48, k=20, headless, 1 worker, 5 frames, module work included): stitch 0.27 s, pen 0.24, maps 0.20, plate 0.13, sediment 0.12, gear 0.09, isotype 0.07. The README reports 0.05–0.2 s/frame at N=500 (grasp films). Estimated, not measured: maps scales with pixels × ops; stitch with covered pixels × visible rows (area-bound, not N-bound); plate with one W·H tone pass plus splats; the rest with item count. One-off builds (pen paper, stitch atlas and felt, sediment terrain) are unmeasured.

## 7. p5 2.3.4 features

The host is a p5 instance (renderer `p2d`, 960×540). The seven files make no p5 drawing calls (grep-confirmed); they write to `p.drawingContext` and blit with `drawImage`. `createGraphics` appears only via the runtime's `ctx.layer` (isotype atlas). `createFramebuffer`, `textToContours`, `loadFont` (`def.fonts` is `[]`), shaders and `buildGeometry` are not used here. The main technique is pixel work on Float32/Uint32 buffers and ImageData. Fonts are embedded by build.py as `@font-face`.

## 8. Findings

1. **Sediment font mis-declared.** sediment.js declares `cormorant-garamond-latin-500-italic` as weight 600, upright. build.py defaults style to `normal`, so upright title, head and sketch text renders with italic outlines. Two more declarations disagree with their files: Plex Sans Cond. 600 is declared 500 (the caps text role uses it), and Plex Mono 400 is declared 500.
2. **Plate ignores the 1.5× cap.** plate.js:38 passes `ctx.size.k`, not `AM.renderScale`, and `EX.scale` maps k>1.6 to 2. On a 2× page this means a 1920×1080 surface and a full tone pass each frame. That contradicts am.js:100.
3. **Maps steps rather than glides.** `units` sets every op's progress to 1 and counts whole passes (tag < done), so combs and the stray drop appear in jumps. The kernel's partial-pass (sweep) support is unused. The other six animate continuously. Needs a render check.
4. **markRule is documentation only** (see section 3).
5. **Unused or risky kernel code.** `LG.assign`, `escapeTeeth` and `Deposit` are unused. In margin.kit.js, `Page` is unused, and `storeGuess` writes localStorage, which is per-viewer state the purity law forbids if anyone calls it.
6. **Sediment terrain** is built at 960×540 and upscaled, so it is soft at k>1. The coast sits at x=1400, so the whole sheet is land.

## 9. Core ideas that should survive

- The Material contract: one Material per film, modules never draw, the begin→units→marks→end lifecycle, and registration-time validation.
- Batched `units()`: all runs in one call with failAt, caught[], done, lost and age. Every kernel draws the address.
- A declared mark rule and a fixed semantic colour set: copper = probability or expected, peach = address or failure, sage = save, caught or cost, slate/ink = structure. All seven use it.
- Belief and legibility guards at the Material boundary (digits only through `num`).
- Clock purity, with caches keyed only by inputs and render scale.
- Verbatim kernel plus thin adapter, and the one-graph, two-materials proof (grasp stitch vs plate).
- Pedagogical mappings: the survival-sorted rack, frequency as exposure (plate: more runs sharpen, never brighten), and the count edge with its realised/expected pair.

## 10. Experiment-specific choices

- The seven metaphors and their palettes, fonts, voice pitches and ground colours.
- Individual kernels: H&D cyanotype, Dynadraw nib, Jaffer–Lu maps, the knit atlas, angle-of-repose sediment, the involute rack.
- Cell geometry and nRange values, tuned per kernel.
- The handwriting hands and the field-notebook paper.
