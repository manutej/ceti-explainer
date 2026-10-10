# H · EXPOSURE — the light table · builder notes

## Mark rule
Each thread of light is one agent run, deposited on a Float32 plate with column-exact Wu coverage (exactly 1 unit
per pixel column crossed), so **exposure is frequency**. A slit is one step (plan · act · observe · check). A failed
run stops at its slit: a peach dot is its address. Height is time against plan (sketch); a retry jogs the thread
later. The plate is metered (each run 1/n of the light): more runs sharpen it, never brighten it. Copper hairlines
are equidensity contours of the exact closed-form field. Densitometer bars are plate column sums ÷ n, asserted equal
to the engine's survivors. Grain is static. Material: H&D curve (toe, line, shoulder) → negative density →
transmitted UV → cyanotype print on a brushed, ragged-edged sensitiser. Highlights clip at the shoulder: no bloom.
Display type is exposed into the plate and develops along the same curve.

## Hero frames
**Shared, 18.5 s:** plate A at n = 2,000, a white-to-cyan fan bending through 20 slits, copper contours on its
tones, peach seams at every slit; thin bars falling geometrically in hairline copper sleeves; "719 of 2,000 · exact
717.0 ± 21.4"; the trust scale with the guess. **Shared, 26.5 s:** the mirror plate (same draws, checks on), lit
only where the check added light. **Native, 23.5 s:** the query reticle among machine words, a light trail from
"a young dog", and "mouse" developed far away among the animals, joined by a copper arc: near in meaning, far on
the map.

## Beats
Shared (34 s): title develops 0–3.5 · one run traced 3.6–5.4 · runs 2–10 · estimate 7.25 · COMMIT 8.5–11.5 ·
n 10 → 2,000 (log) 11.5–17.3 · reveal · plate B by slit sweep 20.6–24.3 · saved light 24.6 · honesty 28.5 ·
bookend 31. Live: commit, plus "draws A/B/C" re-exposes from fresh runs.
Native (30 s): title · sweep exposes 80 words · fog · query "a young dog" 9.5 · drag 15–20.5 · far word 21 ·
bookend 26. Live: pair select (mouse / bank / bass) and drag the reticle.

## Algorithms
Prefix sums by run in `U.stateAt` (checkpoint every 100 runs). Exact field: off p^{j+1}·N(jμ, σ0²+(j+u²)σ²);
on: binomial mixture over retries. Marching squares once → Path2D. 1,024-entry OKLab LUT. Native: hand-set
31-D sketch vectors, cosine, query = softmax blend of words under the reticle, Gaussian PSFs (disk size =
magnitude), 8-sample trailing exposure.

## Doctrine
Impossibility: 2,000 threads settling onto analytic contours; the mirrored twin. Belief: counts are column sums.
Ruler: bars and taper. Thumbnail: a cyanotype photogram. Never: bloom, neon, glow swarms, moving grain, flow
fields, typewriter text, robot icons, invented numbers.

## Iteration log
- **Shared v1:** a dashboard: thin flat cone, white to the end (no taper), fat bars → bar-chart thumbnail; counts
  clipped. → 156 px plates, drift + wider steps (a bending fan), thin bars, brushed edge + paper margin.
- **v2:** grain stippled away the convergence (0.42 → 0.30 stops); contour levels moved into the tail; peach seams
  read as solid bars (smaller dots); "saved" changed nothing → plate S holds only light the check added.
- **v3:** n lingered < 20 (log-linear now); added the trust scale (± 2 sd narrowing as 1/√n, exact, guess); B's
  slits hidden until printed; legend fades before the estimate.
- **Native v1:** mouse never lit (shared heavy cluster base → centroid query). Base 0.6, kernel 20 px, weighted
  senses, `edge` feature; probed headlessly: mouse #6, bank #2, bass #4. Dropped "note" (clusters too close).
- **v2:** a labelled scatter → the drag now exposes a light trail; query text moved to the right column.
- **Perf:** 0.08 s/frame per worker (plate-rect tone, one blit).

## Revision 1 (after JUROR + PEDAGOGY-CRIT)
- **Shared: a round plate where every dimension means something.** Radius = steps survived (20 slit rings); angle =
  share of runs (each run owns 1/n of the circle, stacked by the ring where it stopped). The lit arc at any ring
  *is* the survivors; at the rim it is the share that passes all 20. The meaningless cone and Delta-like
  horizontal channel are gone. The light falls off from a point source (white core → cyan rim), so it reads as
  exposure, not a pie.
- **Commit before any evidence** (defect 9): one run is traced, then the viewer's guess is a grease-pencil mark on
  the rim gauge while an enlarger-timer hand sweeps it. No modal, no countdown digit.
- **10, then 100, then 2,000 on one plate** (held beats) over the latent expected staircase (copper). The loupe
  magnifies the rim: the 95 % band (± 2 sd) is the hero and visibly narrows.
- **Twin = second exposure of the same plate**, not a panel: cyan light fills exactly the wedges the check saved;
  the rim gauge reads 719 (white) and 1,586 (cyan) at their marks, with expected ticks and bands on the gauge.
  **Cost as a mark:** a sage bead for every step done twice (+1,409 steps, 3.9 % more work).
- Header strip, metadata, shared closing sentence and "exact ±" removed ("expected"); 95 % bands ± 43 / ± 37
  (sd 21.4 / 18.4). On-canvas type ≥ 14 px.
- **Native rebuilt as an exposure.** The plate starts unexposed; a query emits, and words accumulate light ∝ cos⁴,
  with faint streaks recording the light's path through meaning. Labels exist only where light developed them.
  It opens on the mouse arc (6.9 s), then a second query double-exposes the plate and the shared word is lit
  from both sides. Honesty beat: context moves a word (sense ghosts, labelled), with "hand-set features,
  flattened" in 14 px. The constellation names, ranked list and formula are gone.
- **What I saw:** r1a was a flat white pie chart (the shoulder clipped everything). → 1/r^1.6 falloff and a lower
  amplitude. The native's first layout crowded the top quarter; I recomposed the clusters so each pair spans
  mid-frame. Still weak: the right column of the shared film is text-heavy after 21 s, and the native's lower
  half is only latent fog.
