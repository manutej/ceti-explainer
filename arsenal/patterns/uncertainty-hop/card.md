# uncertainty-hop

**What it is for.** Uncertainty shown as frequency, not as an error bar. A seeded sample table is built once in `setup`;
the draw index is `k = floor((t - start) * rate) + 1`, so every re-seek is identical and `count(t)` = draws shown.
Four looks on one table: **hop** (hypothetical outcome plot: one draw per frame, hard cuts, no tween), **qdots**
(quantile dotplot, 20 or 50 dots at (i+0.5)/n of the sample CDF, built in a seeded order, each dot stacked on the ones
that appeared before it), **ensemble** (draws accumulate as hairlines, older ones fade to a floor, newest marked) and
the **commit** pairing (draws, then a frozen estimate window with no result on screen, then the count, then the ratio).
This is the visual carrier of the law "the viewer commits a number before any number is shown".

**When NOT to use.** Fewer than ~20 draws of a quantity nobody will estimate; exact probabilities (use a table); two or
more correlated quantities or trends (HOP evidence covers 2-3 independent quantities; this module draws one 1D quantity);
audiences who cannot be paused for the estimate window (leave `commit` off). Never run draws through the tween engine.

## Params (pattern.params; every variant overrides `show`)
| param | range / meaning | knob? |
|---|---|---|
| show | `hop` `ensemble` `qdots` | yes |
| data | null, or a plain array of samples (shown in a seeded permutation; qdots use the empirical quantiles) | yes: the film feeds claims here |
| dist | `{type:'normal',mu,sd}` `{type:'lognormal',mu,sigma}` `{type:'uniform',a,b}` `{type:'mixture',parts:[{w,...dist}]}`; used when `data` is null; drawn with `ctx.seed` | yes |
| N | table size 100..5000 (default 1000); quantiles come from it | no |
| K | draws shown by hop/ensemble, 10..N (default 44; 30 in commit) | yes |
| dots | 20 or 50 (any 10..100 works; dot size is auto-fitted) | yes |
| rate | draws per second. hop/ensemble/commit-hop: 2.5..10 (100..400 ms per hard cut; R-D S20, S21). qdots: 1..10 | yes |
| start | seconds before the first draw, 0..2 (default 0.5) | no |
| floor, tau | ensemble: floor alpha 0.03..0.2 (0.08); fade length in draws 3..15 (7) | no |
| zero, domain | `zero:true` starts the axis at 0 when all draws are positive (a hop bar needs it); `domain:[d0,d1]` overrides. A cut axis writes "axis starts at N, not 0" and the hop mark becomes a dot | no |
| commit, estimate, ratioDelay | commit on/off; estimate window 1..6 s (3); seconds from count to ratio (2) | yes |
| threshold, thresholdText | the question line (value in data units); its label | yes |
| title, sub, unit, limits | copy; `limits` replaces the one honest-limits line | yes |
Timeline (commit): draws to `start + K/rate`, estimate window, count (k above the line, "4 of 30"), then ratio ("4 / 30 = 13%").
Default model (a bus, lognormal median 11 min) is illustrative; a film passes its own `data` or `dist`.

## Variants
- `hop`: one bar from a drawn zero per frame, 250 ms hard cuts, a counter "18 of 44 draws"; no value digits shown (the viewer integrates).
- `qdots-20`, `qdots-50`: the same model as 20 or 50 dots; builds in seeded order; the newest dot is accent for one cut.
- `ensemble`: 60 draws as hairlines; age fades alpha to the floor; the newest is accent and thick.
- `commit` (hop) and `commit-qdots`: show, freeze (a "?" and a shrinking bar, caption asks), count, ratio; above-threshold marks light accent.

## kit2 knobs_doc rows (names a film would expose)
`uh.show`, `uh.data`, `uh.dist`, `uh.K`, `uh.dots`, `uh.rate`, `uh.commit`, `uh.estimate`, `uh.threshold`, `uh.title`, `uh.limits`.
`ARSENAL.uncertaintyHop` = `{ count, countAt, stageAt, timing, sampleTable, quantiles, mulberry32 }`; `pattern.count(t, params, state)`; the demo adds `__film.count(t)`.

## Atlas and evidence
[[pure-function-of-t]] (the draw is a function of t); [[seeded-determinism]] and [[random-seed]] (one seeded table in setup,
no Math.random); [[generative-distributions]] (Gaussian and heavy-tail samplers; bounding is the author's job, here the domain
is fitted to the draws shown); [[map-norm-constrain]] (scale); [[text-width]] (type from pack roles). The atlas carries no page on
HOPs or dotplots, so the evidence is arsenal/frontier/R-D-moves.md rows M5, M6: HOPs beat error bars and violins for 2-3
quantities and helped untrained viewers on trends [S19][S20]; hard cuts of about 100-400 ms beat tweens, which hurt
probability judgment [S20][S21]; quantile dotplots of 20-50 dots give about 1.15x lower estimation variance than density
plots and better transit decisions [S22][S23].

## Pitfalls
- No tweens, no easing on a draw, and never stagger them: that is the evidence. Do not feed `t` through the film's ease.
- The freeze window shows no count and no ratio on purpose; do not caption the result into it. The threshold line is the question, not an answer.
- qdots dots sit at bin centres (width = dot size), so a dot beside the line can be counted on the other side; the count uses the true quantile.
- Domain is fitted to the shown draws (first K, or the quantiles), so a heavy tail beyond K draws does not stretch the axis. Pass `domain` to fix it across films.
- Counts and the ratio are from the shown sample, not the model; the limits line says so. Supplied `data` is permuted, so a sorted file does not leak order.
- 11 px footnote only for the limits line; counts and results are 24-34 px. Faces are the pack's; a face that is not loaded falls back visibly.

## Cost
headless chromium, 960x540 x2: 2.7-4.0 ms/frame (0.003-0.004 s/frame) across all six variants, ceti-dark and swiss-grid
(shoot.mjs, 36 frames). Purity: identical for all six variants on both packs.

## Renderer / fallback
`p2d` (Canvas 2D through p5.drawingContext). No beta APIs. WARN: one 1D quantity only; trend HOPs (a line per draw) are not built.
