# C · Sediment Delta

**The direction.** Aerial geomorphology as a teaching surface. Each grain of sand is one agent run; each weir
is one step. A run that fails drops out and settles on the bank *at the weir where it failed*. The landscape
keeps the record: the bank's chain of bars, the losing river's width and the delta's reach against the
soundings all read 0.95^k with numerals hidden. The teaching move is *where* failure happens. Audience:
technical people and executives who trust maps.

Files: two films, `delta.kit.js` and `make.sh` (kit + film → `build.py`).

## Ladder

**Glance (built).**
- *Shared:* one river forks into a bare branch and a braided (checked) branch sharing one bay: the fork is
  the twin-world split. Stake in the bay, flood, bank bars, fans against expected isobaths.
- *Native:* "Correlated failure": four days radiate from one spring (a shared price list read at step 2).
  A bad day is a landslide dam at weir 2; checks that read the same source catch nothing.

**Grasp (2 min, spec).**
- **THE TRACE** at 1:500: one grain, italic margin notes per weir (plan, tool call, observation, match).
- At weir 7 it snags: "Acme Corp" ≠ "ACME Corporation". The braid takes it round, the retry by tax ID passes,
  and it reaches the sea.
- The scale bar rolls to 1:50,000 and the grain becomes one of 2,000.
- Two honesty beats:
  - A hydrograph inset shows the checked river's flood arriving later and flatter (checks cost time).
  - A landslide teaser: errors were assumed independent.

**Wield (spec; partly live).** Live: playback holds until the stake is planted; the native bad-days slider re-runs
the season on the same draws. Full: one-run inverse problem, "6 braids; get ≥ 1,200 to the sea"; transfer:
10 weirs at 99 % (0.904) vs 20 at 97 % (0.544).

**Master (spec).** An explorable sheet:
- p, c, retry, k, N and ρ as controls, and a seed scrubber that shows the √N band.
- Drag the mouth to "80 % over 20 steps" and the sheet solves for p ≈ 0.989.
- A "second source" braid, the only check that survives landslides.

## Numbers
All from `Atelier.AgentLoop` (seed 1). Native: bad days are a what-if count (0–4, sketch); expected =
good days × 500 × 0.785 ± sd; bad days deliver 0 with or without checks. sd at 1,571 is 18.4.

## Known weaknesses
- Braids read a little like a decorative scalloped chain at thumbnail size.
- The checked river's bars resemble the unchecked river's late bars; the contrast lives in width and delta.
- Drainage is a carved tributary tree, not a hydraulic-erosion simulation.
- At phone width, grains in flight read as speckle.
- The native's bad-day count is a scenario, not a sampled probability.
- The angle of repose is a discrete avalanche rule in plan view.
- Audio uses the runtime's primitive voices; there is no water bed.
- For speed, drawing goes to a CPU canvas with native text: p5 hosts, it does not render.
