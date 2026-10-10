# how-a-network-learns · draft B · "the night garden"

Look (beats.md header): brand ceti-neosage-dark, chrome none, material ink, level manager, renderer webgl, format feature,
dur 123 (120 + CETI card). Commit off (D11): `"commit": {"enabled": false}`; chapters HOOK 0–12 → CASE 12–58 → COUNT 58–108 → MONDAY 108–120.

Register: the flowers are a cloud in the dark with fog; the loss surface rises out of the ground (plan → tilt, height scales
from 0) as the steps count; the 150 flowers ride the ribbons as points of light, and the ribbons brighten as the signal passes;
one travelling gl-labels callout (hard cuts: 1.9 CM → 37 FLOWERS → LOSS 1.393 → LOSS 0.039 → 143 RIGHT → 148 RIGHT → ROW 84 →
ROW 134); the right-at-step-k brush arrives like dawn (lit flowers keep the species colour, the rest dim; a low amber glow rises behind the cloud as k → 1,000).

Chain: gl-pointcloud (S1, HOOK/CASE) → gl-heightfield (S2, CASE mechanism) → gl-ribbons (S3, COUNT) → gl-pointcloud brushed
(COUNT cost, MONDAY held). Pins: gl-labels `solve` (one anchor list + one camera function for the whole film, `kit()` → SVG with
data-role, plates behind boxes) and `K.tx`. Three WebGL structures; no gl-post, no DoF.

## Build
`python3 lib/data_pack.py` (packs frozen topic data into film.json params.data; re-runs recompute.py's own train() only for
the final biases, asserting it matches train_log.json) → `python3 lib/assemble.py` (byte-reproducible, checked) →
kit2 build → gate → frames.

## Module copies (lib/*.js verbatim; changes are CUT replacements in assemble.py only)
- gl-pointcloud: exact brush. The module brushes by rank (nearest first); "right at step k" is not monotone (159 flips), so
  VERT gets `uniform vec4 uLit[38]` + `uExact` (lit flag per rank, set by the film from per-flower flip steps) and `uHiMix`
  (lit keeps the species colour). hud → no-op (it cleared depth; the band and dawn glow need it). DoF, synth, variants cut.
- gl-heightfield: flat layer → no-op (canvas digits never drawn, depth kept for ball/trail), synth/variants cut. The cut col
  is steered without an edit (`cut [-2,-1]`, `cutMargin = cols-1-col`).
- gl-ribbons: exports `frameAt, depthOf`; queue model, canvas labels, variants cut.
- gl-labels: keeps `solve, kit, project, ROLES`; drawGL and the demo scene cut.

## Data honesty
- The loss slice is RECOMPUTED in setup from the final weights (W2[2,2], W1[2,2] varied, 65 held): matches surface.json
  to 1e-5 (start cell 0.21619, final cell 0.03906). The path (every step to 40, then every 10th) is drawn at its real
  height with a drop line to the slice; footnote (14 units) "GROUND: THE OTHER 65 HELD AT STEP 1,000 · HEIGHT: LOSS".
- Axis names "WEIGHT A / WEIGHT B" (no digits; claims.json copied unchanged, no renders added).
- Ribbon widths = |weight| at checkpoints 0/10/50/100/1000, one module state each; widths do NOT ease between checkpoints:
  each ride regrows the ribbons layer by layer (the signal front). Marks ride network.json `routes`; per-slab readouts only
  at steps 10 and 1,000 (the claimed ones); headline counts 13/135/144/146/148 land when the last mark is in its tray.
- iris.csv still carries the brief's DATA WARNING (typed from memory; verify against UCI before public use).

## Gate (one run + one fix round): VERDICT PASS
- WARN G5c: running step counters "STEP k" in S2 and the brushed cloud (counts in progress; the claims are in the callouts).
- G8 film code ~117 KB of 120 (claims.json 17.4 KB alone); page ~1.294 MB of 1.3: almost no headroom for growth.
- frames.mjs 0.136 s/frame mean (heaviest: ribbons ~0.3 s); ready ~2.2 s (5 ribbon bakes + slice recompute).
- Fix round: ROW 84 / ROW 134 labels stacked during the dolly → each anchor is live only while it holds the callout.

## Left as is
- Hidden slabs unlabelled (card WARN). Stripes 0 (knob). Fraunces/DM Sans GL fallback irrelevant: no WEBGL text, all text SVG.
- The section face (accent2) is large at camAzCut −58; the 1.9 CM callout sits over the setosa discs (plate keeps it legible).
- 92+3 knobs in film.json knobs_doc (timeline, S1, S2, S3, labels).
