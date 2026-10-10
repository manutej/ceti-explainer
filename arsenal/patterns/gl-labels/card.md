# gl-labels · temporally coherent labels for WEBGL scenes (R-A technique 7)

**What it is for.** Numbers that stay readable and attached while the camera moves. `solve(t, camera, anchors, opts)` takes
anchors `[{id, x, y, z, text, sub?, role, priority}]` and a camera (`t => {eye, look, up?, fov | ortho}`, or a static one, or a
p5.Camera). It returns `{placements, counts, why}`, a pure function of t. Each placement is `{id, text, sub, ax, ay, box, lead, tx, ty, sy,
align, size, fam, color, dataRole, subDataRole, cand, overlap, occluded, callout}`. Any gl-* lane calls it. It draws nothing itself:
`drawGL(p, placements, tk, fonts, hud)` draws flat in the WEBGL canvas, and `kit(K, placements, 'labels')` emits `K.ln`/`K.tx` with `data-role`.

**When NOT to use.** Labels that must sit inside the mark (world-space text). Moving anchors with more than ~500 labels per frame
(the greedy is O(n² · 24)). Flat p2d scenes (kit2's own pins are simpler there).

## How it solves (in order)
1. **Projection.** The worldToScreen math is evaluated analytically, so past samples need no GL state. The demo checks it against
   `p.worldToScreen`: max error 4.5e-5 sheet units (`__film.projErr`).
2. **Occlusion.** An **analytic occluder list** of world AABBs is tested with the segment from eye to anchor (slab test). For ortho the
   segment runs from the image plane. There is **no depth readback**: hysteresis needs occlusion at past samples, and a readback only
   sees the frame just drawn (it would cost a scene re-render per sample).
3. **Greedy.** Order: priority desc, then id order (array index). 24 candidates: 8 directions (NE first, which keeps the label off the
   column top: SELECT "labels on column tops") × 3 leader lengths. A box must miss the placed boxes, the placed leaders, the anchor dots, the
   `reserve` rects and the margin. A leader may not cross a placed box.
4. **Hysteresis without mutable state.** The greedy runs on a fixed sample grid `k / fps`. `sticky:'chain'` (default): sample k prefers
   the candidate of sample k-1, a deterministic recursion from k = 0 that is memoised by index (a cache of a pure function). A cold seek to
   t costs t·fps greedies once. Visibility is an exact Schmitt debounce: a label changes state only after its raw state has held for `hold`
   samples. So a visible label stays visible unless it is pushed for ≥ hold frames, and it enters after hold frames free.
   `sticky:'window'` drops the recursion and debounces over the last 4·hold samples (bounded cost; contested labels hide).
5. **Final pass at t.** The callout goes first. Then only the debounced-visible labels, each with its chain candidate first. A label in
   grace that cannot be placed free keeps its box and is flagged `overlap`. Draw order is lowest priority first, so a result is never under it.
6. **Callout.** `callout.schedule [{t, id, text?, sub?}]` is one big label (role result, ≥ 32) that follows one anchor. It **hard cuts**
   between anchors: its candidate chain never crosses a cut, and that anchor's ordinary label is suppressed (no duplicate). There is no
   cross-fade (SELECT: "pins cross-fade over each other").

## Roles (kit data-roles; results never in the smallest face)
`result` 28 disp, must-read (sub: secondary 14 mono) · `secondary` 14 mono (sub: chrome 12) · `chrome` 12 mono, muted. `size` may only raise these sizes.

## Params (solve opts; K = knob a film exposes)
`w,h` 960×540 · `fps` 30 (sample grid) · K `hold` 0-15 frames (0 = naive) · K `leader` 12-40 px · `margin` 8-30 · `pad` 2-6 · `dot` 2-6 ·
`occlusion` bool + `occluders [{min,max}]` · `reserve [[x0,y0,x1,y1]]` (caption, readout) · K `maxShown` 1-∞ · `sticky` chain | window ·
`window` 0 = 4·hold · `callout {schedule, leader 40-90, size 28-48}` · `measure(text,size,fam)` (the pack face; the demo uses p5 textWidth).
knobs_doc: `{name:"hold",range:[0,15],step:1,what:"frames a label must be pushed before it hides"}`, `{name:"leader",range:[12,40],step:2,what:"leader length, sheet units"}`,
`{name:"maxShown",range:[1,60],step:1,what:"label budget per frame"}`. Demo scene params: `cols, rows, cell, gap, hmin, hmax, scale, anchors, results, chromeBelow, data, cam, plate`.
`data` = `[{id, x, z, h, value}]` columns. `count(t, st, params)` → `{total, onscreen, occluded, shown, crowded, overlap, callout}` (the readout
captions counts: "23 LABELS SHOWN OF 30 ANCHORS · 0 BEHIND A COLUMN · 7 CROWDED OUT").

## Variants
1. `orbit-30`: 96 columns, 30 anchors (3 results), the camera orbits 300°, collision only.
2. `occlusion-200`: 200 columns = 200 anchors, priority = value, top 5 results, the low tail chrome, the 200 columns as occluders, orbit + crane.
3. `callout-travel`: 48 columns, 13 secondary labels + a callout that cuts A1 → C5 → F8 → E2 every 3 s while the camera orbits.

## Coherence (whole clip at 30 fps, 361 frames; `__film.flicker`)
| variant (solved = chain, window, naive = hold 0) | toggles | toggles < hold frames apart | candidate jumps solved / window / naive | overlapped label-frames |
|---|---|---|---|---|
| orbit-30 | 141 / 123 / 355 | 0 / 1 / 179 | 243 / 390 / 358 | 327 (of ~6,500) |
| occlusion-200 | 295 / 326 / 1,094 | 0 / 1 / 537 | 196 / 330 / 357 | 467 (of ~11,000) |
| callout-travel (3 cuts, 0 frames with two callouts) | 23 / 23 / 25 | 0 / 0 / 1 | 6 / 17 / 18 | 18 |

## Cost (960×540 ×2, SwiftShader, draw + readPixels; mean of 6 frames, max in brackets; two runs ceti-dark / swiss-grid)
| variant | s/frame | solve cold (chain from 0) | solve warm (next frame) |
|---|---|---|---|
| orbit-30 | 0.34 / 0.30 (0.50) | 15-22 ms | 0.5 ms |
| occlusion-200 (heaviest) | 0.41 / 0.66 (0.80) | 108-115 ms | 1.7-2.3 ms |
| callout-travel (cheap) | 0.17 / 0.39 (0.61) | 5-14 ms | 0.1 ms |
The machine was noisy: the same variant measured 0.15-0.38 s across runs. Rendering dominates (WEBGL text plus plates); the solver is ≤ 2 ms warm.
shoot.mjs: purity identical on all 3 variants in both packs, 0 errors.

## Atlas
[[world-to-screen]] S4 S335 S357 (projection, flat labels after resetMatrix) · [[p5-camera]] S54 S335 · [[camera-slerp]] S54 · [[webgl-mode]] S13 S349 ·
[[build-geometry]] S262 S256 (field baked once) · [[p5-shader]] S58 S64 (Lambert from roles) · [[p5-framebuffer]] S53 S61 (depth readback considered, not
used) · [[frontier-2026]] S10. Research: R-A §2.11 [S24] (Vaaraniemi, temporally coherent labelling) and [S25].

## Pitfalls and WARNs
- WARN grace overlap: while a pushed label waits out `hold`, it can overlap another label (orbit-30: about 5 % of label-frames). Lower `hold`
  or `maxShown` if that reads as clutter. It is flagged in `placement.overlap` and `counts.overlap`.
- Entry lags by `hold` frames (0.27 s at 8). The first frames of a clip count as settled (the run touching t = 0 qualifies).
- A cold seek in `chain` mode is O(t·fps): about 0.11 s at t = 9.6 s for 200 anchors, so about 0.8 s at 70 s, paid once per film load. Use `sticky:'window'` for long films.
- The memo is keyed by the anchors and camera objects: pass the same array and function every frame. A new array starts cold (still pure).
- Off-screen / behind-camera anchors hide at once (not debounced). Analytic occluders must match the drawn geometry (AABBs or a proxy).
- Text widths come from the loaded p5 face; kit2's SVG uses the same family (agreement not measured). `kit()` follows `K.ln`/`K.tx` but is untested in a film.

## Renderer / fallback
`webgl` (the solver is renderer-free and works for p2d too). No beta API (no strands, no `instances()`, no readback), so no fallback is needed.
