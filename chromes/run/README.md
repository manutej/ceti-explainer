# G · THE RUN — knitted cloth

A dropped stitch in a stocking is a *run*: it ladders down its column and undoes all the work below it, as one
failed step does to an agent run. **Column = one run. Row = one step.** Peach slack loop = the step that slipped
(address); crimped rungs = work unravelled; sage stitch = a slip the hook caught and re-knit. Undyed ecru wool
on undyed black-fleece felt. Every count is read from column states driven by `Atelier.AgentLoop`.

**Kernel:** procedural stockinette atlas (tube-shaded plied legs, twist, fuzz, AO), rip-mapped 7×7; a forward
column splatter with exact sub-pixel coverage, so one renderer runs from 48 px stitches to 80,000 stitches at
2.2 px; V-overlap compositing; closed-form drape; cloth shadow.

## Built (Glance) — revision 1
- **shared** (34 s): knitted colourwork title. A travelling needle knits a macro of 15 columns. One continuous
  2,000-column swatch follows, with a linen-tester loupe that keeps true stitches in view. A marker is clipped
  on the rod (commit). The swatch is hung sorted by drop row, so its hem is the survival curve against a copper
  strand pinned on the expected curve (719 vs 717 ± 21). The same swatch is then replayed with a hook: a sage
  basting pass on every row is the cost, caught ladders latch up, and it re-hangs (1,586 vs 1,571 ± 18, 867
  saved). The first hem stays as a peach ghost.
- **native** (28 s): a real BPE is trained in setup, and each token is a stitch. A 24-stitch needle (sketch)
  makes a bias band; the app drops the oldest stitch. ACME is dropped at a computed row. Lost-in-the-middle is
  shown as a sketch. The film pulls back to the whole scarf. **Wield:** the BPE-merges slider re-knits; at 0
  merges, ACME never fits.

## Grasp (2 min, spec)
1. **The Trace in yarn:** one wide column, a stitch per step of "reconcile 40 invoices", each with a swing tag
   (plan, `fetch_purchase_orders`, observation, match); step 7 slips (Acme Corp ≠ ACME Corporation), the hook
   re-knits by tax ID, cast off. Sketch.
2. It shrinks to one wale, multiplies to 2,000, knits (the Glance hero).
3. Honesty: a **correlated slip** (one bad cone drops a whole row; the hook can't keep up) and **cost** (the
   hook consumes a second yarn; skein meter).
4. Transfer: 10 rows at 99 % vs 20 at 97 %.

## Wield (spec)
"Darn budget": n hook passes; place them on rows (every, every 5th, last), predict whole columns, knit once.
Log prediction error.

## Master (spec)
Explorable loom: p, c, k, retry, correlation ρ, hook placement; scrub any column's history; the exact DP
survival curve drawn as the hem silhouette.

## Known weaknesses
- At 0.44 px/column the far swatch and the final whole block read as flat sheen; the loupe carries stitches.
- Native: the middle-loosening beat is subtle; captions follow the default tokenizer's timing, not the slider.

Build: `./make.sh shared native` (build.py `--kit run.kit.js`; embeds Jost from `_npm`).
