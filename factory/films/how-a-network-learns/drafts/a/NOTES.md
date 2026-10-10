# how-a-network-learns · draft A · "the laboratory"

Look: brand ceti-neosage-dark, chrome none, material ink, level manager, renderer webgl, format feature, dur 123.
Commit off (D11): `"commit": {"enabled": false}`, chapters HOOK 0–12 → CASE 12–58 → COUNT 58–108 → MONDAY 108–120.
Register: clinical. The 150 flowers sit as a point cloud in a measured box (whole-cm ticks, only claim values labelled:
1.9, 4.5, 5.1). The loss slice is a lit terrain: plan view, then a crane down. The descent is a travelling bead at its real
loss with a drop line. The layers are ribbons in a cutaway. Captions are the only prose.

## Chain (beat order)
1. gl-pointcloud (R20), 0–30 s: count-in, species colours, pins, the shared band 4.5–5.1 cm.
2. gl-heightfield (R18 `section-120x80` + `plan-80x50` tilt), 30–58 s: the bead rides the real path at
   `loss_true` (above the slice at first). The path is drawn solid, plus an x-ray ghost (`ghost`) where the ground hides
   it. The section cut snaps to the bead's column from `cutStart`; the profile inset is drawn flat. Footnote (14):
   "ground: the other 65 held at step 1,000".
3. gl-ribbons (R19, 4 → 8 → 3), 58–84 s: band width = |weight|, eased between checkpoints. 150 marks ride each
   checkpoint's `routes` and land as a grid on the predicted slab (true-species colour if right, accent if wrong). A count
   holds until the next ride lands.
4. gl-pointcloud again, 84–120 s: lit = right at step k on a log step clock. A flat log step chart (SVG) sits beside it.
   The dolly runs to the overlap, then pins go on rows 84 and 134. MONDAY dims the cloud to 30 %.
Pins go through gl-labels `solve` (reserve rects: caption band, HUD, profile inset), drawn as SVG with data-role. No gl-post.

## Module copies (lib/*.js verbatim; every change is a CUT in lib/assemble.py, applied to the assembled copy only)
- gl-pointcloud: the VERT shader is replaced. Brush = right at step k, decoded per flower from packed flip steps
  (aTexCoord.x = t1 + 2048·t2, .y = order + 256·(t3 + 2048·s0)); wrong flowers dim, lit ones keep their species colour.
  Other cuts: rows may carry `u`/`v` uvs; `cam.look` sets the target; `params.uniforms` is set before `model()`.
  DoF, fonts, synth, hud and variants are cut, so no WEBGL text is drawn and no depth clear happens after the cloud.
- gl-heightfield: `cutAt` takes `params.cutCol` (the film names the column). `flat()` is a no-op, so pins and HUD are
  SVG and depth stays intact for the bead. Synth, faces and variants are cut.
- gl-ribbons: exported as an api (VERT/FRAG, splineOf, frameAt, useShader, slab). The bands are drawn in immediate mode
  per frame (front face) so widths can ease. Layout, timing, queue, labels and bake are cut.
- gl-labels: solve/project only. The drawGL demo is cut.
Data: lib/prep.py packs topic data into lib/data.js. The slice is uint8 of loss/1.4 (±0.003). The path keeps every step to
50, then every 10, linear between kept steps. Self-check in page `window.__hnl`: right at steps 0/10/34/231/1000 =
13/135/143/148/148; per-species 50/39/46 at step 10 and 50/49/49 at step 1,000.

## Gate, cost, size
- Gate VERDICT PASS. One WARN, G5c: 12 running "STEP n" digits from the bead's step counter (45–55 s). These are
  counts in progress; the final values are claims.
- frames.mjs: 0.17 s/frame mean. Heaviest seek is 0.63 s at 58.6 s (ribbon draw-on plus marks). Purity identical; 0 errors.
- Page 1,294,853 B (< 1.3 MB, 5 KB headroom). Film code 117.6 KB (< 120 KB, 2.4 KB headroom): adding data or a knob
  needs a trim first.
- Knobs: 94, all in knobs_doc. Fonts: all text is SVG in the pack faces (Fraunces / DM Sans / Space Mono). There is no
  WEBGL text, so the GL-lane font fallback never applies.
- sample/sample.mp4: 10 s, 30 fps, 3840 × 2160 (the GIF step errored as expected and was removed).

## Left open
- The ribbon widths between checkpoints are an eased transition, not training data (only steps 0/10/50/100/1000 are data).
- At step 1,000 the bands are wide and cross a lot (busy, but they are the data). Lower `widthGain` if it reads as noise.
- The section face is the module's flat face, re-toned to a neutral "cut material" so the bead keeps the amber.
- The topic's DATA WARNING stands: verify iris.csv against UCI before public use, then re-run recompute.py and lib/prep.py.
