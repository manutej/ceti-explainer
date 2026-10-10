# explorable (the generative-UI format)

**What it is for.** An interactive explorable that is not a film: a page with sliders, chips and a number input beside a 960x540 canvas, sharing the factory's claims discipline (every number comes from a stated formula, one honest limit on the page) but not its clock. Three explorables ship as variants: a sample-size explorer, a queue explorer and a compounding explorer. Use it when the reader should find the shape of a relationship by moving one input, then read the number.

**When NOT to use.** For a narrative with beats, captions and a brand card (use a film). For heavy simulation (the draw is cheap by design). For a claim with no closed-form formula: an explorable must show its formula.

**Contract.** One p5 instance per explorable (instance mode), `noLoop()` plus `redraw()` on `input`/click (no loop). `st.vals` fully determines the drawing; `draw(p, t, st, params, tokens)` ignores t. Scripted time enters only through `pathAt(kind, t, dur)`, which `window.__film.seek(t, variant)` writes into `st.vals` (the same state a user would set). Seeded draws: `mulberry32(seed + run*7919)`.

**Params (state vals, with ranges)**
- sample: `n` 10..10000 (slider log 25..4000), `p` true share 30|50|70 (any 0..100), `run` 1..99 (re-run button)
- queue: `rho` 5..97 (% busy), `svc` 1..60 (minutes)
- compound: `rate` 0..15 (% a year, step 0.5), `years` 1..40
- `dur` 6 (seconds the scripted path spans), `seed` 20260508

**Variants**
- `sample-size`: 20 surveys as dots, the band at +/-1.96 sqrt(p(1-p)/n); path n 25 -> 2500.
- `queue`: wait multiplier rho/(1-rho) curve with a moving point, a pile of waiting-job marks; path rho 30% -> 95%.
- `compounding`: one bar per year (principal grey, interest accent), simple-interest line, 2x line; path years 2 -> 30 at 7%.

**Claims and honest limits (in `CLAIMS`).** margin = 1.96 sqrt(p(1-p)/n) (random sampling error only). Wait = rho/(1-rho) x service time, jobs waiting = rho^2/(1-rho) (M/M/1, long-run average). Balance = 1000(1+r)^y, doubling = ln2/ln(1+r) (constant rate, no inflation, tax or fees).

**Accessibility.** `describe()` on every canvas (FALLBACK, updated each render); native range/number inputs and buttons with labels, `aria-pressed` chips, `aria-valuetext`, visible focus, 40px targets, an `aria-live` readout restating the numbers as text; canvas scales to phone width. Motion-free (nothing animates).

**Atlas.** [[event-driven-redraw]] (S9, S90, S100), [[dom-controls]] (S90, S108, S109, S111), [[instance-mode]] (S96, S101, S105), [[explorable-documents-template]] (S105), [[describe]] (S289, S348), [[access-statement]] (S343), [[pointer-events]] (S11: click handlers cover touch).

**Pitfalls.** Create controls once in setup, never in draw. `seek` calls the render function directly (p5 2.x `redraw()` may be async), so the harness sees pixels synchronously. Hidden canvases are kept but the active one is moved first in the DOM (harness screenshots the first canvas). The number input is not rewritten while focused. Avoid glyphs outside the vendored Latin subset (no sqrt sign): formulas are spelled out.

**Brand.** Roles only (bg, ink, accent, panel, line, muted; disp/mono). `?brand=ceti-dark|neon-lab|swiss-grid|tender-set`; packs are inlined in demo.html for file:// use. `texture` and `tempo` are ignored (static, no animation). WARN: tender-set accent2 is low contrast, so accent2 is unused.

**Cost.** ~10-13 ms per frame (0.01 s) at 960x540 x2 density. Renderer p2d. No beta APIs; no fallback needed.

**Demo.** `demo.html?brand=&variant=sample-size|queue|compounding&t=<0..6>`.
