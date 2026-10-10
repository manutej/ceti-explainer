# scale-anchor · log zoom from 1 to 10^5 units against a constant-size anchor

**For.** Resolution of scale with the anthropocentric anchor (R-D move M11; Kurzgesagt keeps every comparison next to the human body so magnitude survives [S27]; "resolution of scale" and the anthropocentric view are named cinematic techniques [S13]). The crowd of n(t) = round(10^L(t)) units is framed by a camera whose zoom is log in n (pitch p = P / (10^(L/2) + 2) px per cell, P = 408), while an ANCHOR stays at constant size: a ruler tick equal to one mark at n = 1 (it then "spans 106 marks"), or a silhouette set (person 1.7 m, door 2 m, car 4.5 m, bus 12 m) drawn in plain strokes at 15 px/m, with the frame's width read off in those units ("frame 12 m = 1.00 bus"). The anchor's own count is printed ("one mark = one person", "frame holds n anchors"). LOD: individual marks up to `budget`, then s x s tiles (batch factor f = s^2 printed as "1 tile = 16 marks"), cross-faded over `swapW` decades, with the swap marked on the ladder. Pause ladder: holds at 1, 10, 100, 1,000, 10,000, 100,000 for `dwell` s so a caption can land. Units are the first n cells of a square spiral, so a mark never moves as the crowd grows (object constancy). Pure of t; seeded flags; roles only.

**Not for.** Real maps or parallax (3D, use gl-camera-rig); unit counts above 10^5 (NMAX); marks with their own labels; a zoom INTO one object (this zooms out on a population). Count-then-ratio stays the film's job: this module prints counts and one derived length, never a ratio headline.

## Params (defaults; * = a film exposes it as a knob, kit knobs_doc rows)
| param | default | range |
|---|---|---|
| anchor | 'ruler' | 'ruler' \| 'silhouettes' |
| mark | 'dot' | 'dot' \| 'person' (pictogram once pitch >= ~9 px) \| 'square' |
| dwell* | 1.2 s | 0..5, hold per rung (0 = no pause; with ease 'linear' a continuous zoom) |
| move* | 1.3 s | >0, time between rungs; dur = (top+1)*dwell + top*move (13.7 s) |
| ease | 'cubic' | linear, quad, cubic, sine, expo (per segment, on L); fixed by the module, never read from the pack, so count(t) cannot depend on the brand |
| top | 5 | 1..5, highest rung 10^top |
| budget* | 2500 | marks drawn individually up to n = budget (swap level log10 budget) |
| tile* | 4 | 2..16 cells per tile side; batch factor f = tile^2 |
| swapW | .2 | decades of n over which marks and tiles cross-fade |
| lod | 'auto' | 'auto' \| 'marks' \| 'tiles' |
| showSwap, loupe, tileStroke | false | flash the frame at the swap; inset "1 tile = f marks"; outline tiles |
| flagFrac*, flagLabel | .125, 'flagged' | seeded share of flagged units (accent), printed as a COUNT; unit 0 is never flagged |
| data* | null | plain array of 0/1 per unit (spiral order, <= 100,000); overrides the seed |
| m2PerPerson | 1 | silhouettes variant: m^2 one mark stands for; assumption, set it to your data |
| note | text | the one honest-limits line under the panel |

API: `ARSENAL.patterns['scale-anchor'].count(t, params)` (what the frame shows), `.timeline(params)` = `{dur, rungs:[{k, n, t0, t1}]}` (caption windows are `t0..t1`), `.level(t, params)`, `.lodAlpha(L, params)`. `draw` returns `{count, flagged, pitch, lod, tiles, tileSum, batch, drawn}`.

## Claims on screen (each has a formula)
n = round(10^L) = marks drawn, or the sum of tile counts (checked: tileSum == n at every 0.1 s on all variants); ruler spans T/p marks (T = P/3); frame = (10^(L/2)+2) marks wide = x metres at sqrt(m2PerPerson) m per mark; flagged = prefix sum of the seeded/data flags.

## Variants
- **dots-ruler**: dots, ruler anchor, budget 2,500, tile 4 (f = 16); flagged share in accent.
- **people-ladder**: person pictograms (dots below ~9 px pitch), silhouette set anchor; at 1 person/m^2 the frame is 12 m (one bus) at 100 units and 318 m at 10^5.
- **tiles-lod**: squares, budget 400, tile 5 (f = 25), tile outlines, swap flash, ladder notch and loupe so the LOD swap is itself shown.

## Atlas
[[camera-choreography]] S54 S302 S335 (log-space zoom, keyed holds); [[world-to-screen]] S4 S357 (pitch and origin derived each frame); [[easing-functions]] S80 S81 S335; [[derived-geometry]] S314 (readouts derived, never stored); [[pure-function-of-t]] S129 S131 S316; [[seeded-determinism]] S128 S140 S316 (flags in setup); [[gpu-instancing]] S10 S275 S278 (LOD/instancing context; here Canvas2D Path2D batches, 10^5 marks never drawn individually). R-D sources: S13 Conlen et al. cinematic techniques; S27 FlowingData on Kurzgesagt human-scale comparison; S28 Veritasium (page only, technique not read).

## Pitfalls
- Marks appear in spiral order (ring by ring), so zooming out reads as a crowd growing, not a camera moving over a fixed larger world; say "10 times as many people".
- The anchor equals one mark only at L = 0; after that it is the reference, not the unit. The ruler length is P/3 = 136 px.
- Silhouette sizes (1.7, 2, 4.5, 12 m) are typical, not sourced; the density assumption is a param, not a fact.
- Below ~1.3 px pitch marks are sub-pixel squares (0.7 p); the picture is a texture, the count is the claim. Boundary tiles draw their member cells individually.
- Text >= 11 px; the right column is 176 px wide, long labels in a pack with wide faces shrink-to-fit (big count) or should be shortened.
- Brand switch: marks ink, flags accent, anchor accent2, panel `panel`; all roles. Light packs verified (swiss-grid). A pack changes colour, type and texture only; it never touches the zoom timeline.
- **Brand invariance.** count(t) (flagged in parens) is identical under ceti-dark and swiss-grid at the four shot times, all three variants (read from the on-screen readout via `__film.seek`): t=0 -> 1 vs 1 (0); t=4.52 -> 63 vs 63 (7 vs 7); t=9.18 -> 1,585 vs 1,585 (212 vs 212); t=13.70 -> 100,000 vs 100,000 (12,449 vs 12,449). people-ladder flags are 0 in both. Earlier fault (63 vs 83, 1,585 vs 1,204) came from ease '' = tokens.tempo.ease (ceti-dark cubic, swiss-grid expo); fixed 2026-10-10.

## Cost (headless Chromium, 960x540 x2, 137 frames per variant incl. getImageData)
dots-ruler 3.3 ms/frame, people-ladder 4.3 ms, tiles-lod 5.9 ms; shoot harness 6.7 ms/frame (0.007 s). Setup (100,000-cell spiral table, flags, prefix sums) is a few ms. Renderer p2d.

## Fallback / status
No beta APIs. Uses `Path2D`, `ctx.roundRect` (Chromium 99+, Safari 16+, Firefox 112+). A film exceeding 10^5 units needs a larger NMAX and a second tile tier (tile side s^2); not built. WARN: counts of tiles at the swap are in the hundreds, so budget 2,500 with tile 4 leaves a visible grid at n ~ 3,000; raise tile or lower budget to taste.
