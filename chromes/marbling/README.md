# B · MARBLING — the pattern is the record of every pass

Ebru (Turkish paper marbling) as exact, composable, invertible maps (Jaffer & Lu): drops push the size-water
radially, combs and needles shear it, and every pixel is coloured by pulling it back through those maps to the
drop that made it. No fluid simulation: any frame is a closed-form function of time, so seek is exact. The material
teaches **propagation**: a stray drop at step *j* is dragged by every later pass, and how combed it is tells you
when it fell.

Files: `marbling.kit.js` (maps + painter) · `marbling.patterns.js` (recipes) · two films · `make.sh` · `build/` · `out/`.

## The ladder
**Glance (built, revision 1).** *Shared* (34.5 s): one tray, 50 lanes = 50 runs, 20 step columns; each needle carries
a stray's ink from the step it fell to the end (address + propagation). Stacked by where it fell, the heads trace the
survival curve under the expected one (19 vs 17.9). Replayed with checks: needles lag, caught strays peel away on a
sage strip, steps are redone; restacked, 41 clean, 22 saved rings sit on the old curve, checking time beside each lane.
*Native* (30 s): a tulip combed with unrecorded noise; the way back is a guess (a different tulip, the original
dashed over it); then ONE noise becomes three pictures, each prompt with its own ghost comb.

**Grasp (2 min, spec).** Open with THE TRACE as one large tray, the goal lettered on its rim; each pass is a labelled
loop step (plan = choose the comb, act = `fetch_purchase_orders` is the drag, observe = the loupe, check = the
skimmer). Step 7: a stray "Acme Corp ≠ ACME Corporation" lands; the skimmer lifts it; the pass is redone by tax ID.
The tray shrinks into the wall and the Glance runs at N = 48 → 480. Honesty beats in the material: *correlated
errors* — one dusty brush spoils many trays at the same pass, and checks help less; *checks cost* — each lift adds a
re-pass, shown as extra comb time in a strip under each tray.

**Wield (built).** Shared: commit a count before the wall is combed (reveal and readout locked until then).
Native: draw new noise — every tray re-runs; subject stays, variant changes. Next: "6 skimmers, 20 passes, keep ≥ 30
of 48" — place them on the step strip, predict, run once.

**Master (spec).** Scrub the op stack, toggle passes, drag p, c, k, switch on correlated errors, and watch the exact
level (pᵏ, p′ᵏ) move under the sampled wall; pair any prompt with any noise.

## Known weaknesses
- Lanes are 8.6 px: on a phone the marbling is texture; the peach threads and heads carry the read.
- The macro is busy (raw gel-git ahead of the needle), and the replay's un-combed region reads as stripes.
- The native's generation is a sketch: motif ops grow beneath the combing; it is not a trained model (labelled).
  The tulip is the weakest motif (an emblem more than a flower).
- The opening tray is chosen by a fixed rule (first saved run whose stray falls at pass 2), not by seed-picking.
- Checking costs (¼ step per inspection, ~1.65 steps per catch) are sketch values.
- Cost: ~0.5–1 s/frame/worker (CPU canvas); the bakes add ~2–3 s per load.
