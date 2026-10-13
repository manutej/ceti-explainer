# H · EXPOSURE — the light table

**What it is.** A house grammar in which history *is* the image. Every agent run is a thread of light exposed onto
a metered float plate, and the plate is printed as a cyanotype (Prussian ground, cyan mids, paper-white
highlights, brushed sensitiser edge). Every number is read from the plate (column sums ÷ n). Under the evidence lie copper contours of the exact field,
so the viewer watches noise settle onto truth. Delta teaches *where* runs fail; Exposure teaches *why we can
trust the number*.

**Built (Glance).** `shared.film.js` (34 s): a round plate where radius = steps survived and angle = share of
runs (wedges stacked by the ring where they stopped), so the lit arc at the rim *is* the pass rate. One run is
traced, the guess is grease-pencilled on the rim, then 10, 100 and 2,000 runs expose over the latent expected
staircase while a loupe shows the 95 % band narrowing. A second exposure (same runs, checks on) lights only the
saved wedges, and sage beads mark every step done twice. `native.film.js` (30 s): a query *emits*; words burn
in ∝ cos⁴; "mouse" lights far across the map; a second query double-exposes it; context ghosts show that real
models move a word.
`./make.sh shared|native` builds.

## Ladder
- **Glance (built):** convergence + twin plate; star plate + one far word.
- **Grasp (2 min, spec).** Opens with **THE TRACE** in this material: the invoice-reconciliation run is exposed slit
  by slit, each slit a contact strip carrying its plan text, the `fetch_purchase_orders` call and the observation.
  At slit 7 the thread stops on "Acme Corp ≠ ACME Corporation" (peach); on the twin plate a sage catch retries by
  tax ID and the thread jogs later and continues. The strip collapses to one thread, the plate meters for n, and the
  Glance film plays at half speed. Honesty beats: correlated slips (one shared bad source shifts every thread at
  once, so the field no longer matches: the contours visibly miss), and checks cost time (B's later fan).
- **Wield (spec; partly live).** "Expose until you'd bet": the viewer chooses n with a run budget, says when they
  trust the estimate within ±2 points, and is scored on whether the band they stopped at contains the exact
  value. Native: find a word that is near in
  meaning but far on the map yourself.
- **Master (spec).** Explorable plate: p, catch rate, retries, k and correlation sliders re-expose live; plate
  subtraction any-vs-any; densitometer readout on click; the native version
  loads real embedding vectors (PCA vs UMAP projections side by side, both labelled as distorting).

## Known weaknesses
- The convergence reads best on a large screen; at phone width the stippled tail and 9–10 px labels are small.
- The shared right column carries too much text after 21 s; the gauge's copper band reads grey on blue.
- The native's vectors are hand-set sketches, honest but toy; its lower half is mostly latent fog.
