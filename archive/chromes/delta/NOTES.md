# C · SEDIMENT DELTA — builder notes

**Mark rule.** Grain = one agent run. Weir = one step (plan → act → observe). Braid round a weir = a check
(catch 4 in 5, one retry). Water width = runs still alive (a losing river). A failed run settles on the north
bank *at its weir*; a finished run builds the delta. Terrain, contours, sea = ground.

**Material/type.** Aerial survey sheet: hillshaded umber relief from a heightfield, marching-squares contours,
slate water, grey-blue sea with bathymetry, crisp shallow shelf round each lobe. Cartographic lettering:
hydrography in letterspaced italic serif (Cormorant Garamond) set along the river; collar/features in condensed
caps (IBM Plex Sans Condensed); counters in IBM Plex Mono; halos as on printed maps. CETI semantics kept, L/C
re-tuned for umber.

**Algorithms.** (1) Twin worlds on `AgentLoop` common random numbers — twins share lane, release, draws.
(2) Prograding-bar deposition: cell grid, flat top at Hmax (water level); a grain is carried across the flat
top (BFS) to the nearest non-full cell, then avalanches to any neighbour ≥1 layer lower (foreset at repose). Sequential in
arrival order ⇒ prefix-consistent ⇒ pure seek. Flat top ⇒ length ∝ count ⇒ bank silhouette = 0.95^j.
(3) Closed-form kinematics: open-channel velocity profile, sinusoidal flood pulse, braid delays (checks cost
time). (4) Truth under evidence: dashed exact bank lines (W0·p^s), dashed expected bar tips, expected ± sd
band on each lobe. (5) Native: day-level shared-cause sampler on the same hashes.

## SHARED — "What an AI agent actually does" (33 s)
Hero (t≈25): two valleys. Upper river tapers to a thread between pale exposed bed; peach bars shrink weir by
weir under a dashed survey line; its fan stops at the 717 sounding. Lower river keeps its width, lenticular
braids at every weir, a long fan speckled sage with the 867 runs the check saved. Realised vs expected ± sd.
Beats: 0–4 title lettered across the divide · 4–8 legend, braids draw in · 8–11 commit + countdown, guess stake
in the sea · 11–23 flood pulse · 23.4–28.8 count, survey lines, weir 1 vs weir 20 · 28.8–33 record.

## NATIVE — "Correlated failure" (31 s)
Coastal plain, 8 rivers = 8 days × 250 runs, checks everywhere. Season 1 (independent): ≈196 per river.
Season 2 (same draws; ρ of each step's 5 % from one shared source per day): landslide at a weir dams the river,
every grain avulses into a peach splay, the channel below is abandoned. Control ρ re-runs the sampler.
Hero (t≈25): four abandoned channels, four fat deltas; 1,586 vs 964 (exp. 841 ± 334); checks off 36 % either way.

**Doctrine.** Impossibility: 4,000 grains each finding a packing slot by avalanche while its twin detours a
braid. Belief/ruler: counts are settled grains; river width, bar envelope, fan vs soundings carry the numbers
with numerals hidden. Address: bars sit at their weir. Thumbnail: a survey map. Silence: narrowing water.
**Never:** particles on black, glow, pegs/bins, flow-field noise, robots, node graphs, typewriter, wobble.

## Iteration log
- **v1:** "canals with ladder rungs through an orange desert": harsh terrain, invisible narrowing, delta =
  progress bar, braids = hooks, collapsed word spaces, colliding labels.
- **v2:** muted relief; pale exposed bed (narrowing reads at thumbnail); labels re-laid; haloed type; legend.
- **v3:** flow was a slug of static → velocity profile + flood pulse (parabolic front). Delta → fan with
  distributaries and a shelf. Braids → lenticular islands. Bars → wide bank base, rounded front, lean.
- **Perf:** 3–9 s/frame from SwiftShader raster of ~20k AA arcs → CPU (`willReadFrequently`) surface + native
  canvas text, one blit: 0.1–0.5 s/frame.
- **Live:** runtime readout leaked the answer before commit → meta withheld until commit.
- **Native:** at ρ=0.6 seed 1 slid on 2/8 days, late (1,361 vs 985 ± 319): honest but muddy. Default ρ → 0.8
  (labelled parameter; seed unchanged). Landslide "bucket" → debris fan + scarp; splays → fans; the wash
  stopped greying the rivers.
- **Deposition v2** (diagonal spreading) grew 45° arms in the 1,586-grain fan, caught only in the MP4 at 25 s
  → plateau transport (BFS over the flat top) + avalanche: bars flat-topped, fans with rounded foresets.

## Revision 1 (after JUROR + PEDAGOGY-CRIT)
**What changed.**
1. **Terrain is the river network.** Kit v2: arc-length `PathRiver`s; a seeded dendritic tributary tree drains
   into them; valleys are carved into the heightfield from stroke masks of the rivers *and* tributaries before
   hillshading, so the relief is shaped by the drainage (no more noise with a pasted channel).
2. **Shared: one river forks** into a bare branch and a braided branch that share one bay. The fork *is* the
   twin-world split ("the same 2,000 runs go both ways"); no stacked panels. Branches arc round a central island.
3. **Ruler:** bars are bigger (cell 3.0, flat top + repose foreset ⇒ length ∝ failures, 112 at weir 1 → 33 at
   weir 20) under the dashed exact tip line; exact banks dashed; expected ± sd is an isobath + shoal in the bay.
4. **Commit in the material:** a stake in the bay, three survey pins pulled in the gorge, the question lettered
   on the island. No modal, no copper digit, no header strip/seed metadata (seed in the readout).
5. **Cost as a mark:** each braid detour is 1.6 s; sage grains linger in the braids and the braided fan fills
   later. **No shared ending:** the film closes on the inked survey (bars, isobaths, soundings).
6. **Native rebuilt:** four rivers radiate from one spring (the shared price list, read at step 2). A bad day
   = a huge landslide at weir 2 that dams the valley; all 500 grains pile behind it; the channel below is
   abandoned and its checks run dry. Each fan carries a dashed no-checks ghost (engine twin world). Control:
   bad days 0–4 (what-if, sketch); expected = good days × 500 × 0.785 (± sd). No title wipe; ≥14 px type.

**What I saw.** The fork reads instantly at thumbnail and no longer resembles the horizontal-gates layout; the
bank chain visibly shrinks along the bare branch. Native: the dry Wednesday channel and the dam are the
image; the radial drainage reads as a dome, not stripes. Weak: braids still a scalloped chain; the bay is
narrow so soundings crowd; on meanders the day names had to become straight labels.
