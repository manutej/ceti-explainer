# How a network learns · beats

id: `how-a-network-learns` · format: feature · dur 123 s = material 0–120 s + CETI brand card 120–123 s (G4a: material 90–120)
level: manager · renderer: webgl · look: brand `ceti-neosage-dark`, chrome `none`, material `ink`
commit: none (D11): film.json `"commit": {"enabled": false}`, with no box, no hold and no default guess
count.at 61.0 s (`correct_0` lands on the ribbon slabs; no ratio, %, or "N of M" before it) · at most four structures; the card is not one
Windows (wave brief, re-split for D11): HOOK 0–12 · CASE 12–58 · COUNT 58–108 · MONDAY 108–120 · CARD 120–123

Chain (beat order; recipes in skills/atelier-draft/references/chain-recipes.md):
**gl-pointcloud** (R20 `brushed-pins`: 150 flowers, 3 measured axes, pins on species) → **gl-heightfield** (R18
`section-120x80` / `plan-80x50` tilt: the loss surface, the descent path, the section cut) → **gl-ribbons** (R19
`funnel-two-layer` geometry extended to 4 → 8 → 3: width = |weight|, 1 mark = 1 flower) → **gl-pointcloud** again (the
same structure, brushed = right at step k). Pins and readouts go through gl-labels / `K.tx` (labels `none` in the lanes,
`clear:false`). No gl-post (dof stays `null`). Fallbacks per recipe: data-marks scatter (R1/R2), flat heatmap (R9), flat
sankey (R4/R6).

Data the drafters read (frozen; never re-run training in the film; copy what you need into film.json params at draft time):
- `data/train_log.json`: `steps[k] = {k, loss, correct, flags}` for k = 0..1000 (flags: 150 chars, '1' = right),
  `cloud` (150 × [petal_length, petal_width, sepal_length]), `y`, `learned_for_good_at` (per flower; null = never).
- `data/surface.json`: 120 × 80 `values` (rows = axis_b = W1[2,2], cols = axis_a = W2[2,2]), `start_cell`, `final_cell`,
  `path.{a, b, loss_true, loss_on_slice}` per step. Set `vmin` 0 and `vmax` 1.4, because the path starts at 1.393, above the slice max of 1.217.
- `data/network.json`: per checkpoint (0, 10, 50, 100, 1000): `absW1` 4×8, `absW2` 8×3 (ribbon widths), signs, `pred`,
  `confusion[true][pred]`, `routes[n] = [input, hidden, predicted]`.

## Structures (4 at most; 3 used)
1. **S1 · The flower cloud** (gl-pointcloud). 150 discs in a cube. The axes are petal length (x), petal width (y) and
   sepal length (z), in cm. Group roles: setosa `muted`, versicolor `accent2`, virginica `ink`. Brush = right at step k:
   right flowers stay lit and wrong ones dim to `dim` 0.7. Pins on species centroids (CASE) and on rows 84 and 134 (COUNT).
2. **S2 · The loss landscape** (gl-heightfield). The 120 × 80 slice opens top-down (plan, it reads as a contour map) and
   tilts into 3D. A ball (the current weights) rides `path.a/b` at height `loss_true`, with a thin drop line to the
   ground. The path trail is drawn on t. A section cut snaps to `final_cell.col` and travels with the ball, and the 2D
   profile inset shows the valley's flat floor.
3. **S3 · The network in depth** (gl-ribbons). Layers are 4 input slabs (measurements), 8 hidden slabs and 3 output slabs
   (species). Link width = |weight| at the shown checkpoint, eased between checkpoints. 150 marks ride `routes` and land
   on the predicted species' slab. A mark keeps its true species role when right and turns `accent` when wrong. Each
   output slab has a readout of right flowers.
4. (spare: none. The CETI card is the format's card.)

## Beat table

| # | beat | window | structure | focal motion (the argument this lane carries) | claims used |
|---|------|--------|-----------|-----------------------------------------------|-------------|
| 1 | HOOK | 0–12 s | S1 | 150 discs count in (revealBy random, 0.4–4.0 s), unlabelled, slow orbit (camSwing 40°). The question is a caption | n_flowers, step_10 |
| 2a | CASE · fixture | 12–30 s | S1 | species colours come up with 3 pins (gl-labels). The camera turns to the petal-length axis: setosa a separate island, versicolor and virginica interleaved. A translucent band marks 4.5–5.1 cm. **S1 carries: the overlap exists in the data before any network** | anderson_year, fisher_year, n_flowers, n_species, n_measurements, setosa_pl_max, virginica_pl_min, versicolor_pl_max, petal_overlap |
| 2b | CASE · mechanism | 30–58 s | S2 | 30–40: plan view, then a tilt to 3D (camEl 89° → 32°). 40–45: ball at `start_cell`, pin "START · LOSS 1.393". 45–55: the ball runs steps 0→1000 on a **linear step clock** (100 steps/s), so its fall happens in the first 0.3 s and the rest is a crawl along the valley floor. A step counter ticks (running counter, G5c WARN only). 50–58: section cut at the ball, profile inset flat, pin "END · LOSS 0.039". **S2 carries: steep wall, then a long flat valley (the gap's shape, still without a ratio)** | n_measurements, n_hidden, n_species, n_params, n_params_held, steps_total, loss_0, loss_final |
| 3a | COUNT · the count | 58–84 s | S3 | 58–61: ribbons grow at step-0 widths, and the 150 marks ride and land: **13** right (count.at 61.0). 63–66: widths ease to step 10, the marks ride again, and the slabs fill 50 / 39 / 46: headline **135** in the display face, then "OF 150 · 90 %" under it 1 s later. 72–78: steps 50 and 100, with the ribbons thickening and the count barely moving. 78–84: step 1,000: 148, and 2 marks land on the wrong slab in accent. **S3 carries the count and answers the hook** | n_flowers, correct_0, chance_correct, step_10, correct_10, gained_first_10, setosa_right_10, versicolor_right_10, virginica_right_10, acc_10_pct, step_50, correct_50, step_100, correct_100, steps_total, correct_final, wrong_final, acc_final_pct |
| 3b | COUNT · the cost | 84–108 s | S1 | the cloud returns with brush = right at step k, on an eased **log step clock** (k = 0 → 1000 over 84–101 s). The lit set floods at once, then single flowers light slowly inside the overlap band. Pins "STEP 34 · 143 RIGHT", then "STEP 231 · 148". 101–108: camera dolly to the overlap, gl-labels pins "ROW 84 · VERSICOLOR → VIRGINICA" and "ROW 134 · VIRGINICA → VERSICOLOR". **S1 carries: where it struggles is where the species overlap** | pct_90, step_90_drop, correct_at_s90, pct_99, step_99_drop, correct_at_s99, correct_0, milestone_140, step_reach_140, last_8, steps_140_to_148, step_reach_148, steps_after_best, wrong_final, wrong_rows, confused_pair |
| 4 | MONDAY | 108–120 s | S1 (held, dimmed to 30 %) | the question types, then the honest line under it. The last frame holds (Q8) | (none) |
| – | CARD | 120–123 s | kit card | CETI + takeaway "Fast at first. The last few cost the most." | (none) |

## Captions (28 units, ≤ 2 lines of ~50 chars; every digit is a claim id in brackets)

| id | t0 | t1 | text | digits |
|----|---:|---:|------|--------|
| c1 | 0.6 | 5.6 | A small network is shown 150 flowers and their names. | [n_flowers] |
| c2 | 5.8 | 11.6 | After 10 steps of learning, how many does it get right? | [step_10] |
| c3 | 12.4 | 17.4 | Irises measured by Edgar Anderson in 1935; Fisher, 1936. | [anderson_year, fisher_year] |
| c4 | 17.6 | 22.6 | 150 flowers, 3 species, 4 measurements. Three drawn here. | [n_flowers, n_species, n_measurements] |
| c5 | 22.8 | 26.4 | Setosa stands apart: no petal longer than 1.9 cm. | [setosa_pl_max] |
| c6 | 26.6 | 29.8 | Versicolor and virginica overlap: 37 flowers share 4.5–5.1 cm. | [petal_overlap, virginica_pl_min, versicolor_pl_max] |
| c7 | 30.4 | 35.0 | The network: 4 measurements in, 8 hidden units, 3 names out. | [n_measurements, n_hidden, n_species] |
| c8 | 35.2 | 40.0 | 67 weights decide its answers. Wrong answers cost loss. | [n_params] |
| c9 | 40.2 | 45.0 | Two of the weights as ground, loss as height. | (none) |
| c10 | 45.2 | 50.6 | Learning is 1,000 steps downhill. It starts at loss 1.393. | [steps_total, loss_0] renders "1,000" |
| c11 | 50.8 | 57.6 | It falls off the wall at once, then crawls the valley to 0.039. | [loss_final] |
| c12 | 58.4 | 61.0 | The same 150 flowers ride through the network. | [n_flowers] |
| c13 | 61.2 | 66.0 | Step 0, random weights: 13 land on the right name. | [correct_0] |
| c14 | 66.2 | 72.0 | After 10 steps: 135 right. 122 more, in 10 steps. | [step_10, correct_10, gained_first_10] |
| c15 | 72.2 | 77.8 | Step 50: 144. Step 100: 146. The weights keep growing. | [step_50, correct_50, step_100, correct_100] |
| c16 | 78.0 | 83.8 | Step 1,000: 148 of 150. 2 never land right. | [steps_total, correct_final, n_flowers, wrong_final] |
| c17 | 84.2 | 89.6 | Lit = right. 90 % of the loss drop is done by step 34. | [pct_90, step_90_drop] |
| c18 | 89.8 | 95.4 | From 13 to 140 right took 23 steps. The last 8 took 208. | [correct_0, milestone_140, step_reach_140, last_8, steps_140_to_148] |
| c19 | 95.6 | 100.8 | Then 769 more steps, and not one more flower. | [steps_after_best] |
| c20 | 101.0 | 107.6 | The 2 it misses sit where versicolor and virginica overlap. | [wrong_final] |
| c21 | 108.4 | 113.8 | Monday: when the curve goes flat, which cases is it still missing? | (none) |
| c22 | 114.0 | 119.6 | Graded on the 150 it learned from; new flowers untested. | [n_flowers] (the one honest line) |

Pins and readouts (all claims; ≥ 28 units for results, never in the 12-unit face): "SETOSA · VERSICOLOR · VIRGINICA"
(no digit); "START · LOSS 1.393" [loss_0]; "END · LOSS 0.039" [loss_final]; ribbon readout "135" + "OF 150 · 90 %"
[correct_10, n_flowers, acc_10_pct]; slab readouts "50", "39", "46" [setosa_right_10, versicolor_right_10,
virginica_right_10] and at step 1,000 "50", "49", "49" [setosa_right_final, versicolor_right_final,
virginica_right_final]; "STEP 34 · 143 RIGHT" [step_90_drop, correct_at_s90]; "STEP 201 · 99 %" [step_99_drop, pct_99]
(optional); "STEP 231 · 148" [step_reach_148, correct_final]; "ROW 84", "ROW 134" [wrong_rows]. Footnote (14 units,
under S2): "ground: the other 65 held at step 1,000" [n_params_held, steps_total]. Axis labels in S2: the weight names
from `surface_weights` (claim string; it contains the digits 2 and 1, so the drafter renders it as "W2[2,2]" / "W1[2,2]"
or as plain "WEIGHT A" / "WEIGHT B"; choose one and add `renders`).

## Knobs (name them in film.json knobs + knobs_doc; numbers above are defaults, never constants in code)
S1: `pointR`, `sizeCue`, `fog` (≤ 0.3), `revealAt`, `dim`, `camSwing`, `dolly`, `brushClock` (log | linear), `bandAlpha`.
S2: `hscale`, `contours`, `camSwing`, `camEl`, `cutStart`, `cutMode`, `stepsPerSec` (100), `dropLine`.
S3: `zSpread`, `travel`, `grow`, `markSize`, `stripes` (0), `fogK` (≤ 0.35), `curv`, `widthGain` (|w| → band width).

## Drafter WARNs (from the cards and arsenal/SEATS-GL.md)
- t = 0 is an empty frame in heightfield and pointcloud. The film owns its first frame, so start the S1 count-in at 0.4 s on the brand bg.
- Draw with `fill()` set: after `noFill()`, `model()` draws nothing (both cards). Shoot ≥ 2 t per scene.
- Pins ignore occlusion in all three lanes. Route every pin through gl-labels `solve` with `reserve` rects for the readout.
- Ribbons: the middle-layer (8 hidden slabs) pins collide with ribbons, so leave the hidden slabs unlabelled. Stripes are 0.
- Heightfield: the section clip needs camAz negative, and `vmax` 1.4 keeps the ball's start on the scale.
- Pointcloud: no DoF (budget). WEBGL `text()` costs 0.1 s, so draw the pins as SVG via `K.tx`.
- Faces: Fraunces and DM Sans fall back in the GL lanes. Check `stats().fallback` / `st.fontNote` and note it in NOTES.md.
- Budget ≤ 1.5 s/frame. The heaviest frame is likely 3a (ribbons, 150 marks + 4×8 + 8×3 = 56 links; well under the 3,000-mark stress).

## Checks (run before handing to drafters)
- [x] `python3 factory/topics/how-a-network-learns/recompute.py --check` → "check: 34 recomputed claims, OK".
- [x] Every formula in claims.json evaluates to its value in the gate's JS scope (checked with node, 0 bad).
- [x] count.at 61.0 precedes the first ratio (c16 "148 of 150" at 78.0 s; "90 %" readout at ~67 s; c17 at 84.2 s).
      The digits in HOOK and CASE are counts, years, lengths and loss values only.
- [x] One honest line (c22). The CETI card is last. No digit in the takeaway.
- [x] Each WebGL lane carries a beat: S1 the overlap (2a) and the cost (3b), S2 the shape of descent (2b), S3 the count (3a).
- [ ] **Before public use: verify data/iris.csv against UCI (S3), then re-run recompute.py --check.**
