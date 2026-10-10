# R12 · Chrome process documents (8 chromes)

Read: 8 NOTES.md, 8 README.md, 8 build scripts (margin builds via `tools/make.py`), 16 gate JSONs, tools/ listings. R1 = the post-crit revision each NOTES file records. "pre-R1" marks beat sheets and heroes the notes did not update.

## Per chrome

**A · Escapement (WebGL)**
- Mark: module = run; tooth = step; tick = loop; slipped tooth and hand turn peach; sage pawl = check.
- Heroes (pre-R1): S 29.5 s, two banks of 50, 19 white vs 41 with drum counters. N 23 s, pocket-wheel trains, balls in hatched slots.
- Beats S (33 s, pre-R1): 0–3.2 title · 3.2–7 plan/act/observe/check · 7–11.2 step 8 slips · 12.2–15.2 commit + countdown · 24.4–27.8 counts · 30–33 line. N (30 s): 3–9.6 six handoffs · 9.7 pawl · 10.8–21.4 sixty jobs · 21.6 count.
- Depth: exact involutes; Graham deadbeat solved from contact, tabulated for seek; Sutherland–Hodgman section clips; 100 instanced modules via `texelFetch`; GLSL 300 es.
- Doctrine: Impossibility = 100 solved escapements in 3D; Belief = drums advance only when head passes a home hand; Ruler = count verticals; Address = peach tooth; Thumbnail = no AI iconography.
- Never: brass, rivets, filigree, orbit cameras, glow, show-spinning gears, typed numbers.
- Iteration: S1 25 s/frame, hand hid anchor, pale plates read as icon grid → S2 portrait regulator and LODs (~0.6 s/frame) → S3 black dials, white home hands. Bug: canvas-backed `p5.Image` premultiplied away low-alpha data; fixed by repacking RGB, α 255. N1: balls white because p5 owns `uTint`. R1: pocket discs did not mesh → involute trains; checked bank pushed off-frame → rods on front rack only.
- Specs: Grasp = THE TRACE, tooth 7 slip, retry by tax ID, wall of 2,000. Wield = pawls on a budget, target ≥80% over 20 steps (p≈0.989). Master = explorable wall, hover reads `AgentLoop.events`.
- Weak: modules ~12 px; 28 s re-rack busy; verifier cost is a sketch; native check shown only as expected value.

**B · Marbling (p2d)**
- Mark: tray/lane = run; comb pass = step; peach stray = slip at its pass; sage skimmer = check.
- Heroes (pre-R1): S ≈28.5 s, two walls with fill-level rails; N ≈28.8 s, three trays from one noise. R1 replaced both.
- Beats S (33 s, pre-R1, 96 trays): 3.1–8.7 passes 1–4 · 10.8–13.8 commit · 13.8–22.8 passes 5–20. N (30 s, pre-R1): tulip undo "exact" at 10.6–14.6. R1: one tray, 50 lanes; N undo is now a guess.
- Depth: pull-back through exact inverse maps (Jaffer & Lu), radial drop map, comb LUT, Newton inversion for travelling comb; one CPU blit.
- Doctrine: Impossibility = marble rewound exactly (R1 retracted for native); Ruler = fill level; Address = how combed = pass; Etymology = combing, not diffusion.
- Never: glow, particles, flow fields, Voronoi, nodes, typewriter.
- Iteration: crossing combs went brown → passes reordered so each refines; dead bottom third and 9–13 px type → step strip. Juror: 96 stamps read as wallpaper → one tray. PEDAGOGY-CRIT: "exact inverse" taught the wrong thing → unrecorded noise, dashed original. Bugs: LUT edge gave NaN; raw `ctx.save/clip` desynced p5's stroke cache, fixed inside `p.push/pop`.
- Specs: Grasp = one tray, skimmer lifts stray, redo by tax ID. Wield = commit count before reveal; next "6 skimmers, keep ≥30 of 48". Master = scrub op stack, drag p, c, k.
- Weak: lanes 8.6 px (≈3.5 px on a phone); busy macro; tulip weakest motif.

**C · Sediment Delta (p2d)**
- Mark: grain = run; weir = step; braid = check; water width = runs alive; failed grain settles on its weir's bank.
- Heroes (pre-R1): S ≈25 s, "two valleys". N ≈25 s, four abandoned channels, 1,586 vs 964. R1: one river forks into bare and braided branches sharing a bay.
- Beats S (33 s): 0–4 title · 8–11 commit (countdown, pre-R1) · 11–23 flood · 23.4–28.8 count. N (31 s, pre-R1 "8 rivers × 250"; R1 is 4 × 500). Gate audio: S 35.3 s, N 28.3 s.
- Depth: CRN twin worlds; prograding-bar deposition (BFS across flat top, avalanche to lower neighbour); closed-form flood pulse; braid delay 1.6 s per detour; carved drainage tree.
- Doctrine: Impossibility = 4,000 grains each finding a slot; Belief/Ruler = settled-grain counts, numerals hidden; Address = bars at weir; Thumbnail = survey map; Silence = narrowing water.
- Never: particles on black, glow, pegs/bins, flow-field noise, robots, node graphs, typewriter, wobble.
- Iteration: v1 "canals with ladder rungs" → muted relief, pale exposed bed → velocity profile replaces a static slug. Diagonal deposition grew 45° arms → BFS plus avalanche. Live readout leaked the answer → meta withheld until commit. Native ρ=0.6 looked muddy → 0.8. Perf 3–9 s → 0.1–0.5 s via CPU surface.
- Specs: Grasp = THE TRACE at 1:500, weir-7 Acme slip, hydrograph inset. Wield = "6 braids, ≥1,200 to the sea". Master = seed scrubber with √N band.
- Weak: braids read as a scalloped chain; drainage is not hydraulic; grains speckle at phone width.

**D · Ledger (p2d)**
- Mark: unit posted to an account; slip = job of 40 invoices; hourglass = 20 h; cut units share one place.
- Heroes (pre-R1): S 20.5 s, two pages (sage block vs peach wing). N 20 s, "400 kept vs 681". R1 uses one page; native says 484 kept with checks, −6 without.
- Beats S (34.5 s): 5–8 COMMIT · 8–16 ten turns · 16.1 count · 21.4 one job → 40 invoices · 24.4–27.4 COMMIT 2 · 32.7 bookend.
- Depth: pixel-grid pictogram atlas; Hungarian re-packing on Euclidean distance (crossing-free); CRN twin pages; figures are unit counts.
- Doctrine: Impossibility = optimal re-packing of 100 identities; Ruler = counts from units; Address = exception line; Silence = no words; Thumbnail = a ledger.
- Never: icons in circles, KPI cards, gradients, glow, scaled symbols, fractional jobs, typed totals.
- Iteration: S1 juror: knocked lines plus void slash read as "Z"; ±sd brackets read as crosses → void = one strike, dashed expected. Bug: dangling timing key made hourglasses vanish. n2: cut units left holes → shared place. R1: review cost as hourglasses in the margin; native leads with expectation.
- Specs: Grasp = THE TRACE as a ledger entry, correlated bad vendor file. Wield (built) = one job → 40 invoices, 5-check budget, re-pack. Master = sliders, ROI page with viewer's own hours.
- Weak: native units are 1×; Wield seed 1 is unlucky (22 → 24); ten toggles; hours are sketch.

**E · Margin (p2d)**
- Mark: one stroke = one thought; continuous loop line = run; loop = step; pen lift = address (peach ×); sage ✓ finished; doubled loop ringed sage = caught; guesses in graphite second hand.
- Heroes (pre-R1): S 34.4 s, two strips and number lines. N ≈16.5 s, three answers, shaky one right.
- Beats S (34.5 s, pre-R1): 6.55–9.55 commit (3-2-1 struck) · 10–13.8 fifty runs · 14.9 "← slipped at step N" · 24.2–27.2 retries. N (30 s notes; README 27 s; gate 27.3 s). R1 has 50 full-width rows, pencil-tap commit, no closing slogan.
- Depth: single-line glyphs from EMS Allure/Felix (OFL) with seeded slant; hand speed v = K·κ^(−1/3); Dynadraw spring-mass nib (~26 Hz, ζ 0.72); Washburn bleed r = r∞√(age/τ); dry strokes baked to a 2× layer.
- Doctrine: Impossibility = ink at exact seek; Belief = counts are gates from ✓s; Ruler = strip silhouettes; Address = × on slipped loop; Silence = page carries it; Thumbnail = notebook.
- Never: typewriter reveals, typeset text as handwriting, a drawn hand, typed counts.
- Iteration: S1 too small, ×/✓ invisible → hand-tuned amber vs orange-red; 1.9 s/frame → CPU composite 0.15 s; show-through read as dirt → 2%. Live boot 43 s (filter per stroke) → blurred once. N1: no reference for "steady" → added shaky Thimphu; ’ and … rendered as "?" → normalised. R1 crit (house tics): drawn dip pen with reservoir; pencil drafts → ink fair copies. Gate PURE-REP/ORD fail: smoothed blits read outside source rect → 3 px border.
- Specs: Grasp = THE TRACE as a notebook entry. Wield = commit gates playback; next "place the checks" with 3-check budget. Master = crossed-out written p, c, k, N.
- Weak: pale row hairlines; commit frames are empty paper; toy counts.

**F · Bunraku (WebGL)**
- Mark: puppet on stage = run; move on plank = step (20 chalk ticks); copper rod = plan, slate = act, sage crook = check; dark stage where puppet fell; peach tick = address.
- Heroes: S 11.4 s, puppet tipping; S 34.5 s, hillside of 50 theatres, 19 + 22 = 41 chalk strokes; N 14.3 s, hooded model vs unhooded checker with sage rod.
- Beats S (35 s, pre-R1): 8.2–14.4 twenty moves · 14.6–18.4 commit · 18.4–21 crane to unchecked run · 26.9–31.6 checked · 33.2 expectations. N (31 s; README 34.5 s; gate 34.8 s). R1 ends on a curtain call.
- Depth: perspective camera, cards at true depth; raking tungsten cone, red shift on dim; analytic contact shadows, penumbra R·gap/|P−L| in a 1/3-res pass; thin-lens DOF from a blurred atlas pyramid; falling paper by Andersen–Pesavento–Wang plate ODE (RK4).
- Doctrine: Impossibility = words of light through cut card; Belief = stroke per lit stage; Ruler = warm boxes; Silence = lamps cooling; Address = hanging puppet + peach tick; Thumbnail = hillside of theatres.
- Never: faces, mascots, pastel craft, flat-vector look, glows, particles, floating numbers.
- Iteration: S1 13 s/frame uber-shader → eight `#define` variants, 0.5–0.9 s. Shadow y-flip threw title under card. S3 restaged as a pit. R1: red velvet → black; failed curtain closes; move board 1–20; N kept at 50 because N=25 gives 13 vs 9.0 ± 2.4. Bug: `dFdx` after `discard` undefined on SwiftShader → derivatives moved first.
- Specs: Grasp = tags per move, Acme slip at move 7, lamp circuits share a fuse. Wield (built) = where to stand the check (every step: 41 lit, 33 redone; end only: 26 lit, 480 redone). Native asks how many stages one person checks.
- Weak: district is a "warm dot"; wall at scale; regular drape folds; bald paper head reads as mannequin.

**G · The Run (p2d)**
- Mark: column = run; row = step; knit V = held; peach slack loop = slip; ladder rungs = unravelled work; sage stitch = caught; slate needle = live system.
- Heroes: S ≈21 s, two dark-felt swatches (pre-R1; R1 ground is cream felt); macro ≈6 s; N ≈17 s, needle with bias band and copper ACME bound off.
- Beats S (32 s; README 34 s; gate 34.3 s): 8–11 commit (pre-R1; R1 marker on rod) · 11–21.5 pull-back · 26.5–32 closing card (R1 has none). N (28 s): 3–8 tokenize · 8–21 generation · 21–28 honesty.
- Depth: procedural stockinette atlas, 7 mips; forward column splatter with exact sub-pixel coverage; V-overlap compositing; closed-form drape; ladder front at 30 rows/s.
- Doctrine: Impossibility = yarn to 80,000 stitches; Belief = counters count column states; Address = peach loop at drop row; Ruler = cloth length vs 0–400 (≈36% / ≈79%); Silence = no captions; Thumbnail = a swatch; Etymology = the mark survives without the pun.
- Never: glow, particles, flow fields, typewriter, robot icons, "cream paper + hairline", one run for the ensemble, invented numbers.
- Iteration: S v1 grey barcode at full pull-back → legs widened, rungs thinner, far-LOD specks, linen-tester loupe. N v1 needle off-frame → 24 px right-aligned. Bug: `textWidth` trims leading spaces, so prompt words ran together → `measureText`. R1: "hang 1 is the strongest frame"; macro re-centred.
- Specs: Grasp = yarn trace with correlated cone and skein-meter cost. Wield = "darn budget". Master = loom with ρ and DP survival hem.
- Weak: 0.44 px/column reads as flat sheen; middle-loosening subtle; captions track the default tokenizer.

**H · Exposure (p2d)**
- Mark: light thread = run; slit = step; peach dot = address; plate metered 1/n per run; copper = exact contours; bars = column sums ÷ n.
- Heroes: S 18.5 s, fan at n = 2,000; S 26.5 s, check plate lit only where saved; N 23.5 s, "mouse" far across the map (R1 mouse arc at 6.9 s).
- Beats S (34 s): 3.6–5.4 run traced · 8.5–11.5 COMMIT · 11.5–17.3 n 10 → 2,000 · 20.6–24.3 plate B · 28.5 honesty · 31 bookend. N (30 s): sweep, query 9.5, drag 15–20.5, far word 21.
- Depth: prefix sums in `U.stateAt` (checkpoint every 100); exact field off p^{j+1}·N(·); on = binomial mixture over retries; marching squares → Path2D; 31-D hand-set vectors, softmax, Gaussian PSFs.
- Doctrine: Impossibility = 2,000 threads onto contours; Belief = column sums; Ruler = bars and taper; Thumbnail = cyanotype photogram.
- Never: bloom, neon, glow swarms, moving grain, flow fields, typewriter, robot icons, invented numbers.
- Iteration: S1 dashboard cone and bar-chart thumbnail → round plate. Stipple hid convergence → stops. "Saved" changed nothing → plate S holds only check light. N v1 mouse never lit → base 0.6, 20 px kernel. R1: flat white pie → 1/r^1.6 falloff.
- Specs: Grasp = THE TRACE in slits. Wield = "expose until you'd bet", scored against exact. Master = real embeddings, PCA vs UMAP.
- Weak: right column text-heavy after 21 s; native lower half is latent fog; labels 9–10 px at phone width.

## Measured facts

| Chrome | Renderer | s/frame (notes) | Gates S / N | Fonts |
|---|---|---|---|---|
| Escapement | WebGL | 25 → ~0.6 | PASS / PASS | Barlow 300–600, Barlow Semi Condensed, IBM Plex Mono |
| Marbling | p2d | 0.3; +2–3 s bake | PASS / PASS | IM Fell English, Alegreya Sans, DM Mono |
| Delta | p2d | 3–9 → 0.1–0.5 | PASS / PASS | Cormorant Garamond italic, IBM Plex Sans Condensed, IBM Plex Mono |
| Ledger | p2d | not reported | PASS / PASS | Newsreader, IBM Plex Sans Condensed |
| Margin | p2d | 1.9 → 0.15 | PASS / PASS | pen glyphs from EMS Allure/Felix |
| Bunraku | WebGL | 13 → 0.5–0.9 | PASS / PASS | Bodoni Moda 800, Instrument Sans, Gloock |
| Run | p2d | not reported | PASS / PASS | Jost 400–700 |
| Exposure | p2d | 0.08 per worker | PASS / PASS | Sofia Sans Extra Condensed, Red Hat Mono |

All 16 gate files pass (160 rows, zero FAIL). META shows checked rows in native films only for delta (3), ledger (2) and bunraku (1). Durations disagree across files (notes vs README vs gate audio) for delta N, margin N, bunraku N, run S.

## Cross-chrome synthesis

**Converged by all eight**
- One mark rule shape: run = unit, step = sub-unit, slip = peach address at its stop, check = sage, expected = copper.
- The same doctrine rubric (Impossibility, Belief, Ruler, Address, Silence, Thumbnail) and a Never list that bans glow, particles, flow fields, typewriter reveals, robot icons and typed numbers.
- Twin worlds on AgentLoop common random numbers, with the check's cost drawn as a mark.
- Commit before evidence, in the material (marker, pencil, chalk, curtain), with no modal countdown.
- Spec ladder: every Grasp spec uses THE TRACE on the same "Acme Corp ≠ ACME Corporation" slip at step 7. Four specs quote the same transfer line.
- All eight reject the repo's cream-plus-vermilion house look; ledger and bunraku go dark.

**Renderer.** Six use a CPU canvas with one blit; the two WebGL chromes paid 13–25 s/frame in first passes and then cut cost with variants or lean shaders.

**Recurring runtime bugs**
- SwiftShader makes branch-heavy shaders and per-path rasters cost seconds (bunraku, margin, delta).
- p5 owns names (escapement `uTint`) and raw canvas state desyncs p5 (marbling clip, escapement premultiplied alpha).
- Seek-purity failures caught by the gate: `dFdx` after `discard` (bunraku) and smoothed blits reading outside the source rect (margin).
- Text: `textWidth` trims leading spaces (run); missing glyphs for ’ and … (margin).
- Dangling timing key (ledger); live readout leaking the answer (delta); a 43 s live boot from a filter per stroke (margin).

**Most common iteration lesson.** The first sheet looked like a chart, dashboard, icon grid, barcode, pie or wallpaper in all eight. The fix was a bigger, physical mark at true depth and fewer words, not more annotation. Each R1 crit then cut the same house tics: header strips, modal countdowns, twin panels and closing slogans.

**Strongest and weakest (by the notes' own words).** Run calls hang 1 "the strongest frame of the revision"; escapement says its rack now reads "as a chart made of movements". Weakest self-admissions: bunraku ("district still a wall"), exposure (text-heavy right column, latent fog), margin (pale hairlines, empty commit frames).

## Core ideas that should survive into a master plugin
1. Write the mark rule first, as one sentence each for run, step, slip, check and expected. Every element must map to one of them.
2. Use the doctrine rubric as a review checklist each round, plus a Never list.
3. Seek-exact rendering: pure in time, with gates for repeatability, order independence, clock source, meta before commit, layout at 400 px and audio timing.
4. Twin worlds on common random numbers; check costs appear as marks, not text.
5. Commit before evidence, in the material, with no modal.
6. Iterate from the sheet and keep a "what I saw" log per round. Run a visual juror and a pedagogy critic separately.
7. Measure s/frame in the first pass; default to a CPU canvas, one blit and baked tables.
8. Label every invented number "sketch" and show expected ± sd.
9. Keep the spec ladder: Glance built; Grasp reuses one trace; Wield is a check budget; Master is explorable.
10. Hard floor of 14 px for must-read text; design at phone width.
11. Update beat sheets and heroes when a revision changes the design. Seven of eight NOTES files still describe superseded layouts after R1.

## Experiment-specific choices
- Materials and palettes; typefaces; WebGL versus CPU canvas per film.
- N = 50 versus 2,000 units, and the shared "Acme" fixture as a worked example.
- Metaphor details; the transfer numbers and budget sizes.
