# Explainer Atelier — Art Direction v1 (after TD, pedagogy and critic consultation)

v0 + consult/TD.md + consult/PEDAGOGY.md + consult/CRITIC.md → this. Builders: this file is your contract;
read v0 only for background. CETI chrome stays the default skin; the directions are about DEPTH.

## 0. What changed from v0 (and why)
1. **Many runs, each pass/fail, counted.** 0.95^k is a fact about *whole runs*. A hero that shows errors
   piling up inside one run teaches 0.05·k (linear) — the opposite lesson. Every shared hero shows an
   **ensemble** (50–2,000 runs), each run visibly passes or fails, and the count is read from the marks.
2. **Twin worlds (common random numbers).** Checks-off and checks-on use the *same* random draw per
   (run, step). The viewer sees *which* runs the check saved — a per-run counterfactual no chart can show.
3. **Truth under the evidence.** Where it fits, the exact probability (dynamic programming over steps) is drawn
   as a faint field and the sampled marks land on it, with a √N band: realised 703 vs expected 717 ± 21 is shown,
   never hidden. Seeds are never cherry-picked.
4. **The Trace opens every Grasp** (concreteness fading): one legible, labelled-"sketch" run of a real task
   first; then it collapses to a dot, multiplies, and the direction's ensemble takes over.
5. **Cut / replaced:** Ink Tank → **Marbling** (closed-form comb maps, no fluid sim); Colony → **Sediment
   Delta**; Paper Theatre → **Bunraku**; Typographic Matter → **The Run (knitted cloth)** for the shared slot
   (typographic matter is kept in reserve for the tokens/context-window native film).
6. **Two honesty beats in every Grasp:** errors assumed independent (correlated errors are worse); checks cost
   time and money.

## 1. The numbers (single source; the runtime's `AgentLoop` engine computes them — never type them)
p = 0.95 per step · check catches c = 0.8 of step errors, one retry → p' = p + (1−p)·c·p = 0.988.
| k | p^k | p'^k | of 2,000 (expected) |
|---|---|---|---|
| 5 | 0.774 | 0.941 | 1,548 / 1,883 |
| 10 | 0.599 | 0.886 | 1,197 / 1,773 |
| 20 | 0.358 | 0.785 | 717 / 1,571 (sd ≈ 21.4 / 18.4) |
| 40 | 0.129 | 0.617 | 257 / 1,234 |
Transfer: 10 steps at 99 % (0.904) vs 20 steps at 97 % (0.544). To get 80 % over 20 steps you need p ≈ 0.989.
Anything else illustrative is labelled **sketch** on screen.

## 2. The doctrine (v0 §2 plus the critic's five)
Banned as defaults: Perlin flow-field backgrounds · additive-glow particle swarms · node-graph "neural nets"
with pulses · spinning polyhedra / orbit-around-nothing · matrix rain · gradient blobs · typewriter reveals ·
random pastel Voronoi · noise-wobble on everything · sparkles-as-data · robot/brain icons · the H1 cream +
hairline + vermilion habit · H6 framed object on an empty page.
Positive tests: **mark rule** true for every element · **impossibility** (one moment no DOM/SVG tween can do) ·
**belief** (key number produced by the marks) · **silence test** · **batch test** (not a palette swap) ·
**etymology ban** (no metaphor from the term's own name — diffusion→ink, agent→ant, token→coin — unless the
mark rule survives with the pun removed) · **the number has an address** (show *where* failure happened) ·
**ruler test** (key figure readable off geometry with numerals hidden) · **thumbnail anonymity** (at 320 px,
no text, it must not read as "about AI") · **one kernel per film** (no two directions share a sim core or a
mark grammar).

## 3. CETI invariants (what keeps it on-brand without making it rigid)
Semantic colour is invariant, ground/material varies: **copper #CE9A6A** = mass/what flows/probability ·
**sage #8FA985** = verified/pass · **peach #D88B5C** = error/cost · **slate #6E8CA8** = structure/system ·
**ink #F5EFE3** on dark grounds (or a dark ink on light grounds) · dim #A39A89. A direction may re-tune L/C for
its ground, never re-assign meaning. Type roles: display / text / mono-numbers (CETI default Fraunces / DM Sans /
Space Mono; swaps allowed where the material demands — say why). Clock law: frame = f(t, state, seed);
paused == playing; seek exact.

## 4. The slate (8 directions). Each proves: SHARED (agent loop) + NATIVE (its own topic).

### A · THE ESCAPEMENT — mechanism as cause (WEBGL 3D · closed-form kinematics)
- Art: horological cutaway plates; principle: every part moves *because of* another part. Plain, machined,
  Rams-modern parts in slate metal on dark glass — no ornament, no rivets, no steampunk.
- Mark rule: each movement is one run; each tooth is one step; each escapement tick is one loop iteration.
- Depth: exact involute gear profiles, Graham deadbeat escapement (lock / impulse / drop); a slip is a tooth that
  physically misses the pallet. θᵢ(t) closed-form → exact seek. Section view: 2D profile clipped, cap faces
  hatched, built once with `buildGeometry`; instanced bank via `model(g, n)`. (`clipPlane` is NOT in 2.3.4.)
- SHARED hero (Glance): open on one movement in section, the four pallets labelled plan/act/observe/check.
  Pull back to a bank of 50 movements running 20 ticks; hands that slip stop, tinted peach, *at the tooth where
  they slipped*. A front counter counts true hands (≈18 of 50 at k=20; realised shown). Twin bank below with a
  sage ratchet pawl (the check): same slips, most caught and re-struck (≈39 of 50).
- NATIVE: "Every handoff adds a step" — a business process as a gear train; each system handoff is an extra
  mesh; watch reliability fall as handoffs are added, then a check pawl at the riskiest mesh.
- Sound: tick per step, dull clack per slip, a sage click per catch. Cost: WEBGL 960×540, noStroke, ~8–12 min/20 s.

### B · MARBLING — irreversible maps (Canvas2D pixel field · closed-form comb maps)
- Art: ebru / Turkish marbling; principle: the pattern is the record of every pass.
- Mark rule: each comb pass is one step; each tile is one run.
- Depth: marbling as exact, composable, invertible maps (drop: radial displacement; tine line: x' = x +
  z·u^|d|; Jaffer/Lu formulation). Pixel colour = colour at inverse-mapped point → analytic seek, no simulation.
- SHARED hero: a wall of 48 small trays, all combed by the same 20 passes. In some trays a peach stray drop falls
  at pass j and every later pass stretches it — the error *propagates* and its address (pass j) is legible from
  how many times it was combed. Count the pristine trays. Twin wall: a sage skimmer lifts the drop the pass it
  lands (80 % of the time).
- NATIVE: "How image generators work: un-combing" — combing is invertible: run the passes backwards and a
  picture re-forms from chaos. Honesty: the generator *learns* to un-comb; the picture is not stored in the noise
  (one noise, three prompts, three pictures).
- Palette: water-tray off-white with CETI semantic inks (avoid H1: no hairlines, no single vermilion).
  Cost: per-pixel inverse map at 480×270 per tray region, cheap.

### C · SEDIMENT DELTA — Living Systems: where failures land (Canvas2D · granular deposition)
- Art: geomorphology, delta aerial photography, Fisk's Mississippi meander maps.
- Mark rule: each grain is one run; each weir is one step.
- Depth: grains flow down a river through 20 weirs; a failed run *settles* as sediment on the bank at the weir
  where it failed (deterministic placement by run-hash, angle-of-repose packing). The bars shrink geometrically,
  so the **riverbank's silhouette is the 0.95^k curve** (ruler test). The mouth fans out and is counted.
  The exact survival curve is drawn faintly under the bars (truth under evidence).
- SHARED hero: 2,000 grains, 20 weirs; the mouth counts ≈717. Twin river (checks): a braided channel where
  caught grains re-enter the flow; ≈1,571 reach the mouth.
- NATIVE: "Correlated failure" — one landslide upstream (a bad shared data source) diverts *every* grain at once;
  checks downstream barely help. The Master transfer from pedagogy.
- Palette: aerial earth (umber/ochre ground), water in slate, CETI semantics for grains. Cost: cheap.

### D · THE LEDGER IN MOTION — Boardroom (Canvas2D · Isotype unit dynamics)
- Art: Isotype (Neurath/Arntz), FT/Economist graphics desks, double-entry bookkeeping.
- Mark rule: each pictogram is one invoice-job (a run of 40 invoices); one symbol = one fixed quantity, never scaled.
- Depth: persistent unit identity through regroups (min-crossing assignment), whole units only, totals read
  from units, tabular figures tick from the marks; review hours debited in the same ledger.
- SHARED hero: 100 job-pictograms pass through 10 steps; a failed job drops *whole* into the exceptions column at
  the step where it failed (address). Counted: ≈60 clean (expected 59.9, realised shown). Twin ledger with checks:
  ≈89 clean, and a review-hours debit appears on the other side of the ledger.
- WIELD (inverse problem): "12 review-hours; a check costs 1 h per 40 invoices; get ≥ 32 of 40 clean through
  10 steps" — place checks, predict, one run.
- NATIVE: "The honest ROI of an AI pilot" — hours saved − review hours − failure cost, conserved and balanced.
- Palette: CETI dark panel ground; type is the craft (tabular figures, real hierarchy). Cost: trivial.

### E · THE MARGIN — Field Notebook (Canvas2D · pen dynamics)
- Art: lab notebooks, Feynman's annotated diagrams, the client's TF&S hub (same family, not a copy).
- Mark rule: each stroke is one thought written down; the viewer's guesses are written in a second hand.
- Depth: Hershey single-line glyphs driven by a spring-mass pen (Dynadraw): speed→width, ink depletion and
  re-dip; bleed into a seeded paper-fibre field following r ∝ √t (closed form → exact seek); finished strokes
  baked to the paper layer.
- SHARED hero: TWO commits. "20 steps, each 95 % — how often does the whole job succeed?" → commit → the pen
  tallies 20 runs-in-a-row as a strip of 50 ticked/crossed rows (natural frequencies), rings 36 %, the viewer's
  guess sits beside it. Then "add a check that catches 4 of 5 slips" → commit again → 79 %; the gap between guess
  and truth visibly shrinks. (Video default: held beats with a visible countdown.)
- NATIVE: "Why AI sounds confident when it's wrong" — the viewer was just confidently wrong; make the mirror
  explicit (fluency ≠ accuracy).
- Palette: green-grey graph paper, blue-black fountain ink, CETI semantics only for annotations (avoid H1).

### F · BUNRAKU — Little Worlds: who holds the rods (WEBGL 2.5D staging)
- Art: Japanese bunraku (three visible puppeteers in black), toy-theatre staging, raking light.
- Mark rule: the puppet is one run; the three operators are plan (copper), act (slate), check (sage) — the honest
  anatomy: model + tools + harness. Each stage is one run.
- Depth: cut-paper planes at true depths, perspective camera, analytic contact shadows (offset silhouette,
  penumbra ∝ gap), per-plane thin-lens depth of field, the falling-paper flutter/tumble ODE for dropped props.
- SHARED hero: one performance of 20 moves on a narrow plank in raking light; a slip — the sage rod's wrist catches
  it mid-fall. Crane up: a district of 50 stages; stages without the check operator go dark when their puppet
  falls (≈18 lit of 50); with the check operator ≈39 lit. Proscenium chalk tally counts lit stages.
- WIELD: gate placement — check at the end vs midway vs every step; run tickets counted on the proscenium.
- NATIVE: "What changes on a team when AI arrives" — who holds which rod; humans move from the puppet to the rods.
- Palette: warm stage black, paper stock, operators in true black, semantic colour only on rods/props.
  No faces, no mascots, no Kurzgesagt look.

### G · THE RUN — knitted cloth (Canvas2D · stitch structure)
- Art: Jacquard weaving, Anni Albers; a dropped stitch in hosiery is literally called *a run* and it ladders down
  the rest of its column.
- Mark rule: each warp column is one agent run; each knitted row is one step.
- Depth: real stitch topology (interlocked loops drawn from a stitch atlas with yarn shading); a dropped stitch
  at row j opens a ladder that unravels every row below it in that column (the address *and* the propagation);
  cloth sags under lost structure (closed-form drape per column).
- SHARED hero: a swatch 2,000 columns wide × 20 rows deep knits row by row (the camera starts on 20 columns at
  macro, pulls back to all 2,000). Ladders open; the selvage counter reads intact columns (≈717). Twin swatch:
  a sage crochet hook darns ladders as they start → ≈1,571.
- NATIVE: "Tokens and the context window" — the swatch has a fixed width; new rows push old ones off the needle
  (sub-word stitches show tokens ≠ words). (Alternative if it fights the cloth: typographic matter, reserve.)
- Palette: undyed wool ground, CETI semantic yarns. Cost: sprite atlas, cheap at 960×540.

### H · EXPOSURE — the light table (Canvas2D float accumulation)
- Art: long-exposure photography, cyanotype, Muybridge; principle: history *is* the image.
- Mark rule: each thread of light is one run; exposure is frequency; the plate builds over (film) time.
- Depth: order-independent additive exposure into a Float32 plate (prefix-sum by run → exact seek),
  Wu-antialiased threads, tone-mapped through a cyanotype H&D curve, seeded film grain; densitometer bars at
  each gate are read from the exposure sums (not brightness judgement).
- SHARED hero: the convergence film — 10 runs (noisy, could be anything), 100, 2,000: the sampled exposure
  converges onto the faint exact field beneath (truth under evidence), the √N band narrows; tallies at each
  gate. This direction teaches *why we trust the number*, distinct from Delta (*where* failures land).
- NATIVE: "Embeddings: meaning as position" — words exposed as points of light that cluster by meaning; drag a
  *query* and watch its neighbours expose. Honesty: 2D is a projection that distorts distance.
- Palette: Prussian-blue ground (not black), cyanotype whites, no bloom halos.

### THE TRACE — universal Grasp opener (rendered in each direction's material)
One labelled-sketch run of "reconcile 40 invoices against purchase orders": goal → plan (text) → tool call
`fetch_purchase_orders` → observation → match → step 7 fails (vendor "Acme Corp" ≠ "ACME Corporation", totals
mismatch) → the check catches it → retry by tax ID → pass → stop. Then the run collapses to one mark of the
direction's grammar and multiplies.

## 5. Reserve (not in first build)
Typographic Matter (tokens/context window, galley of fixed length) · Labanotation (what the agent does with its
time: plans short, tool waits long) · Space-time cube of twin worlds (time as z; the loop as a helix that breaks).

## 6. Differentiation (must hold in the contact sheet)
| | Ground | Dim | Material | Kernel | Teaching move | Audience |
|---|---|---|---|---|---|---|
| A Escapement | dark glass | 3D | machined metal | closed-form kinematics | mechanism/cause | exec+tech |
| B Marbling | tray off-white | 2D field | pigment on water | invertible maps | propagation | general+tech |
| C Delta | umber earth | 2D | sediment | granular deposition | where it fails | tech+exec |
| D Ledger | CETI panel | 2D | print | unit identity/assignment | counting/balancing | exec |
| E Margin | graph paper | 2D | ink on paper | pen dynamics | predict/retrieve | non-technical |
| F Bunraku | stage black | 2.5D | cut paper + black cloth | staging/optics | roles | teams/public |
| G The Run | undyed wool | 2D | yarn | stitch topology | propagation+count | general |
| H Exposure | Prussian blue | 2D field | light | accumulation | convergence/trust | tech+general |

## 7. The ladder in this build
Every direction ships: SHARED at **Glance** (~25–30 s, video + live) with the twin-world contrast and the
**Wield** control on the live page (commit a prediction first, then run); NATIVE at **Glance** (~25–30 s).
Grasp (2 min with the Trace opener) and Master are specified per direction in its README and built for a
flagship after the crit round.
