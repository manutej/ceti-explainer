# track-unit · tag one unit, trace it through a re-partition, count before the ratio

**For.** Object constancy done honestly (R-D M1, M7, M8). Every unit is one mark that keeps its identity while the same
marks re-partition: pooled columns to split slabs (the simpsons move), stack to ring, icon grid to columns. Layout
positions come from `arsenal/structures/structures.js` (`grid`, `ring`, waffle blocks built on `grid`). The in-between
frames come from `structures.transition`, using a seeded per-unit rank and minimal stagger (0.05-0.06). Tagged units
are drawn as **comets**: a fading trail sampled from the unit's own pure path, a dotted history, a dashed **ghost at the
origin**, and a label pinned to the head. A **congruence lint** `check(t)` asserts at any frame that the count, the unique
ids and the total mark area equal the layouts', and that every mark is inside the frame. `lint()` sweeps 48 in-between
frames plus both ends and also checks continuity: no unit moves more than 12 % of the longest path in one sample.
The **numerator/denominator lamp** lights the base units first and counts them, then lights the counted units and
counts them. The ratio (with its formula) prints only after both counts complete.

**Not for.** Chart-type morphs whose mid-frames are not a set of the same units (the lint has nothing to keep).
Counts above about 20k (move to gl-instances or gl-stack-city). Uncertainty: HOPs need hard cuts, never this tween.
Do not use the stagger to create drama: staggering adds little or hurts tracking (R-D S34).

## Data (a film feeds its claims here)
`data: [{id, group, category, value?, hit?}]`, or a preset `'berkeley' | 'screening' | 'invoices'`. `value` sets mark
area (`areaBy:'value'`, side ∝ √value). `hit` is the counted flag (ink in a plain move, the numerator in the lamp).
`groups`/`cats` fix key order. `title`, `caption`, `source`, `unitName` override the preset's lines.

## Params (defaults; ranges) · K = a knob a film would expose
- `from`, `to`: layout specs. `{kind:'bars', by:'group'|'category'|'cell', sort:'hit'|'category'|'shuffle'|'id', box, gap 20-80, cols?, match?}`
  gives pooled or stacked columns of waffle blocks at a shared pitch, so height ∝ count (`match:true` takes the other layout's pitch,
  lane width and column x). `{kind:'split', box, gap, slabGap 4-14}` gives one column per group and one slab per category, rows aligned
  across groups. `{kind:'stack', cols, box}` is one stacked bar. `{kind:'ring', cx, cy, r 120-240, inner}` is donut sectors by category.
  `{kind:'grid', sort, cols?, box}` is an icon array.
- K `move` [t0, t1] s (move length 2.5-5 s); K `stagger` 0-0.15 (0.06); K `arc` 0-80 units; `ease` cubic | quint | smooth (slow-in/slow-out, S33)
- `tags` [{pick:{group?, category?, hit?, nth}, label?, role?}] (1-3); K `tagAt` s (the label is pinned this long before the move); K `trail` 0.2-1.2 s
- `lamp` {base, hit (filters), t0, baseDur 1-4, hitAt, hitDur 0.6-2, ratioAt, baseLabel, hitLabel, baseRole, hitRole, digits 0-1, box}
- `areaBy` unit | value; `sizeMode` common | own (own is the negative control and breaks the area lint); `markRoles` {hit, base}; `labels` true
- knobs_doc rows: `{name:"move_s",range:[2.5,5],step:0.25,what:"seconds the re-partition takes"}`, `{name:"stagger",range:[0,0.15],step:0.01,what:"seeded start spread (keep low: S34)"}`,
  `{name:"arc",range:[0,80],step:5,what:"sideways bend of each path, units"}`, `{name:"trail",range:[0.2,1.2],step:0.1,what:"comet trail length, s"}`,
  `{name:"tagAt",range:[0,6],step:0.1,what:"when the tag label is pinned before the move"}`, `{name:"lamp_baseDur",range:[1,4],step:0.2,what:"seconds to count the base units"}`.

## Variants
1. `pooled-split`: Berkeley 1973, 4,526 applicants (Bickel et al. 1975). MEN 2,691 and WOMEN 1,835 as pooled columns at one pitch
   (admitted ink, at the base), then 2 × 6 department slabs, admitted first. Two comets: a woman admitted in A, a man rejected in F.
2. `stack-ring`: 360 illustrative invoices (seeded, labelled ILLUSTRATIVE), mark area = amount. A stacked bar becomes donut sectors
   with an arc of 40; one TRAVEL invoice is the comet. Each category count stays on its label in both states.
3. `grid-columns-lamp`: 1,000 women screened (Gigerenzer et al. 2007: 1 %, 90 %, 9 %). The lamp counts TESTED POSITIVE 0 → 98, then
   HAVE CANCER 0 → 9, then prints `9 ÷ 98 ≈ 9 %`. Then the icon array gathers into two columns (98 | 902) with the lamp state kept, and one
   positive with cancer is the comet. The film must place its commit prompt before the lamp (law: the viewer commits first).

## Atlas and sources
[[shape-morph]] S46 S268 (identity-matched interpolation, not cross-fade); [[lerp]] S69 S78; [[easing-functions]] S79 S316 (slow-in/slow-out);
[[pure-function-of-t]] S129 S316 (trail = the path sampled at t − kΔ, no history buffer); [[seeded-determinism]] S128 S321 (rank and shuffles in setup);
[[derived-geometry]] S314 S317; [[resolution-independence]] S131 (960 basis); [[layered-compositing]] S13 (marks, labels, comets, lamp in order).
R-D (arsenal/frontier/R-D-moves.md): S3 Heer and Robertson 2007 (congruent in-between frames), S4 Gemini, S24 Atom unit marks, S7 comet charts,
S8 and S25 icon arrays and natural frequencies (the lamp), S33 temporal distortion, S34 staggering, S32 Robertson 2008 (animate, then freeze: the ghost and path stay).

## Pitfalls and WARNs
- WARN pooled-split marks are 4.8 units, below the 7-unit legibility floor (`legible:false`). That is true scale for 4,526 at 960. Comets carry a 11-unit ring.
- WARN tag labels can sit over a slab count or a bar name (pooled-split F row, lamp variant end). In a film, set `nth` or the label offset.
- The negative control (`sizeMode:'own'`) fails the lint on stack-ring and grid-columns-lamp (49 of 50 frames). On pooled-split it passes because
  `match` already shares the pitch, so both sizes are equal.
- `check` measures the *drawn* area (the sum of w·h). Mid-move overlap is allowed: a mid-frame keeps every unit but is not a chart you can read.
- Lamp lighting order is reading order in the `from` layout. Before `lamp.t0` every mark is muted, so no count is given away.
- Fonts: the pack's disp and mono from `arsenal/fonts/fonts.js` via FontFace. A face missing there falls back to sans/monospace, and the demo records it
  in `__film.stats().fontNotes` (none missing for ceti-dark and swiss-grid). Body face unused.

## Verify
`shoot.mjs` (ceti-dark and `--query brand=swiss-grid`): purity identical on all 3 variants, 0 errors. Then `node arsenal/patterns/track-unit/verify.mjs`
merges `lint`, `negative_control`, `bench`, `count_at` into both `shots/report.json`. The lint PASSes in all variants and both packs, with area error 0.
The demo draws the lint line top right (`?lint=0` hides it).

## Cost (960×540 ×2, headless Chromium, draw + 1 px readback, mean of 7)
| variant | s/frame |
|---|---|
| pooled-split (heaviest, 4,526 units) | 0.0053 |
| stack-ring | 0.0012 |
| grid-columns-lamp | 0.0021 |

## Renderer / host / fallback
p2d (Canvas2D on `p.drawingContext`). Needs `structures.js` loaded first. Host: `st = R.setup(p, {seed, tokens}, params)`, then `R.draw(p, t, st, params, tokens)`.
Use `R.count(t)` for captions and `R.positions(t)` for reuse (gl-stack-city can feed the same items to its boxes). No beta API, so no fallback is needed. Exec level: ink, no post.
