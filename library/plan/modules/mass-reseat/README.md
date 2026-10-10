# mass-reseat

**Move.** count-dont-claim + cue-the-cause on a conserved quantity (PED #16, #8). Generalised from the type-safe
film's M3 throat (`archive/films/typesafe/scenes.js` u3 + `layers/yard.js`): any bins, any probabilities, any kept subset.
Operad entry: MODULE-OPERAD §8.

**Ports.** needs `parts`, `instance` · gives `rule` · PO `track | grid` (out: same, state gains `reseated`) ·
regions body + foot · τ T1 T2 T5.

**Params.** `bins [{id,label,p,group?,short?}]` (2–10, Σp = 1) · `N` (100–2,000; per-bin counts by largest remainder) ·
`keep [ids]` · `variant renormalize|condition` · `focus` (the answer bin) · `u` (the draw) · `means` (p5 header) ·
`legend`, `keepLabel`, `answerLabel` (condition) · `foot {queue,close,reseat,count,countOff}` with placeholders
`{N} {kept} {dropped} {mass} {droppedPct} {droppedN} {keptN} {focusN} {groupN} {groupPct} {answer} {u} {drawn} {n:<bin>}` ·
`principle {term,line}` · `control {label,question,on,off}` · `notes`.

**Variants.**
- `renormalize` (PO track): closed tracks' marks ride back through J and out along the open tracks; p′ = p ÷ Σkept.
- `condition` (PO grid): the evidence rings the kept marks; the rest dim **in place** (denominator stays visible);
  kept marks gather into one block; answer = count(focus) ÷ count(kept).

**Phases (20 s).** queue .20 (marks; "each mark is 1/N") · close .10 (cue ≤ 0.8 s) · reseat .30 · count .20 (payoff:
numbers land after the marks) · hold .10 · name .10 (principle chip). Roles: `mass kept dropped answer`
(+ `evidence` and each bin `group` in condition mode; shapes via `shape:filled|hollow`).

**Contract.** The marks are one pure function `_frame(lt, on)`; the p5 layer (`means` = P.means, ≈ 3 ms) and the
SVG-cut fallback draw the same buckets. Every printed number comes from `numbers()`. Audit: Σp = 1, marks conserved
before and after, Σp′ = 1, kept ratios preserved, focus kept, counted answer = p′ (condition).

**Control.** one toggle `on` (mask / evidence on-off), jumps to `close`; the result line is the canonical answer.

**Honesty it carries.** renormalize: "illustrative logits · per step only · masked (precomputed), not checked".
condition: "a classroom problem: the dots draw the stated proportions · assumes independent evidence" (+ `notes`).

**Fails.** marks flying free (off the rails); dot-matrix bars that read as a bar chart; numbers before the marks;
the denominator erased in condition mode; a bin label longer than ~12 chars (ribbons start after the longest label).

**Demos.** `demo.json` → `build/demo-0.html` (AI, constrained decoding at `currency`: p′ .677 .145 .113 .065, u .55 → USD)
and `build/demo-1.html` (behavioural, Kahneman ch. 16 cabs: 120 / 290 = 41 %). `node test.mjs` lints both.
