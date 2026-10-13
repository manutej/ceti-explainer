# The Explainer Atelier — doctrine, slate, pipeline, composition

Paths are relative to the plugin root; the atelier is `atelier/`. The contract is `atelier/ART-DIRECTION-v1.md`.

## 1. Doctrine: technique as argument

Generic p5 is technique as texture (a flow field behind a title). The atelier's edge is **technique as
argument**: every mark is a unit of the idea, every motion a computation the viewer watches happen, so they can say
*"I saw it happen"*, not *"I was told."*

**Depth ladder** (what each rung explains that the one below cannot):

| Rung | What moves | Explains | DOM/SVG? |
|---|---|---|---|
| 1 Tween | A → B | sequence, emphasis | yes (never the main event) |
| 2 Transformation | one object becomes another, identity kept | equivalence, abstraction | barely |
| 3 Simulation-as-evidence | the system runs; numbers emerge from marks | probability, compounding, cause | no |
| 4 Material | the medium has physics (ink, paper, sand, light) | conservation, diffusion, wear | no |
| 5 Space | a camera through a structure; scale is the event | hierarchy, magnitude | no |
| 6 Field | every pixel computes | vocabularies, embeddings, noise vs signal | no |
| 7 Agency | viewer input re-runs the same model at the same t | prediction, intervention | partly |
| 8 Sonification | sound driven by the same data as the marks | rhythm, audible failure | no |

Every hero reaches rung ≥3 and combines **two rungs from 3–8**; peaking at rung 2 means an SVG film (v0.3 tier).

**Banned as defaults:** Perlin flow-field backgrounds · additive-glow particle swarms · node-graph "neural nets"
with pulses · spinning polyhedra / orbit-around-nothing · matrix rain · gradient blobs · typewriter reveals · random
pastel Voronoi · noise-wobble on everything · sparkles-as-data · robot/brain icons · the H1 habit (cream + hairline +
one vermilion) · H6 (framed object on an empty page).

**Positive tests:**
- **Mark rule:** "each mark is one ___" is true for every element.
- **Impossibility:** at least one moment no DOM/SVG tween can make.
- **Belief:** the key number is produced by the marks (counted, accumulated, measured), not typed.
- **Silence:** with captions off, the motion still narrates the idea.
- **Batch:** beside the others it is a different film, not a palette swap.
- **Etymology ban:** no metaphor from the term's own name (diffusion → ink, agent → ant, token → coin) unless the
  mark rule survives with the pun removed.
- **Address:** the number has an address: show *where* the failure happened.
- **Ruler:** the key figure is readable off geometry with the numerals hidden.
- **Thumbnail anonymity:** at 320 px with no text it must not read as "about AI".
- **One kernel per film:** no two directions share a sim core or a mark grammar.

## 2. CETI invariants (on-brand without rigidity)

- **Semantic colour is fixed; ground and material are free.** Copper #CE9A6A = mass/what flows/probability · sage
  #8FA985 = verified/pass · peach #D88B5C = error/cost · slate #6E8CA8 = structure · ink #F5EFE3 on dark (dark ink
  on light) · dim #A39A89. Re-tune L/C for the ground (`U.color.tokensFor(ground)`); never re-assign meaning.
- **Type roles:** display / text / mono-numbers. CETI default is Fraunces / DM Sans / Space Mono; swap when the
  material demands it and say why (the ledger needs tabular figures).
- **Clock law:** frame = f(t, state, seed); paused == playing; seek is exact; the live page and the MP4 are the same
  film. Physics only if deterministic: closed form, or fixed-step from t=0 memoised (`U.stateAt`).
- **Numbers:** from `Atelier.AgentLoop` (p .95, check c .8 + one retry → p′ .988; k=20: 717 vs 1,571 of 2,000,
  sd 21.4 / 18.4) or read from the marks; anything else is labelled **sketch** on screen. Say *expected*, never "exact ±".

## 3. The slate: 8 directions (`chromes/<id>/`)

Each proves SHARED ("What an AI agent actually does": many runs, twin worlds on common random numbers, the address,
truth under evidence) plus a NATIVE topic. Each ships Glance films + a live Wield; Grasp/Master are specified in its README.

| Id · direction | Mark rule | Kernel · renderer | Native topic |
|---|---|---|---|
| `escapement` A · The Escapement | module = run, tooth = step, tick = loop | involute train + Graham escapement, closed-form kinematics · WEBGL | every handoff adds a step |
| `marbling` B · Marbling | lane/tray = run, comb pass = step | Jaffer–Lu invertible maps, pixel pull-back · 2D | image generators as un-combing |
| `delta` C · Sediment Delta | grain = run, weir = step; failures settle at their weir | terrain + angle-of-repose deposition · 2D | correlated failure (landslide) |
| `ledger` D · Ledger in Motion | pictogram = one job of 40 invoices, never scaled | Isotype units, min-crossing re-pack · 2D | the honest ROI of a pilot |
| `margin` E · The Margin | stroke = one thought; viewer's guess in a second hand | Hershey glyphs, spring-mass pen, √t bleed · 2D | why AI sounds confident when wrong |
| `bunraku` F · Bunraku | stage/puppet = run; rods = plan/act/check | cut-paper planes, analytic shadows, DoF · WEBGL | who holds which rod when AI arrives |
| `run` G · The Run | column = run, row = step; a dropped stitch ladders down | stitch atlas, sub-pixel splatter, drape · 2D | tokens and the context window |
| `exposure` H · Exposure | thread of light = run; exposure = frequency | float plate, H&D curve, cyanotype · 2D | embeddings as position |

**Audience picks** (PEDAGOGY-CRIT §5): C-suite → Ledger + Delta; non-technical all-hands → Margin + Bunraku;
engineers → Exposure + Delta native. Strongest frames (juror): G-shared 5.8 s, F-shared 11.4 s, B-native 28.8 s.

## 4. Levels and pedagogical structures

**Ladder:** **Glance** (~30 s, intuition) → **Grasp** (~2 min, mechanism; opens with **THE TRACE**, one
labelled-sketch "reconcile 40 invoices" run where step 7 fails on "Acme Corp" ≠ "ACME Corporation", is caught and
retried by tax ID, then collapses to one mark and multiplies) → **Wield** (the viewer acts: commit, then place checks
or set p) → **Master** (explorable). It is one concept module viewed four ways, not four films. Glance and Grasp may
be film; Wield and Master must hand over controls. Every Grasp carries two honesty beats: errors are assumed
independent (correlated errors are worse) and checks cost time/money.

**Structures** (18, graded A/B/C in `atelier/research/PEDAGOGY-MAP.md` §1; read that before designing beats):
natural frequencies (NF, counts before percentages) · ensemble (ENS) · predict–commit–reveal (PCR) · concreteness
fading (CF) · worked example → fading (WE) · contrasting cases · twin worlds (TW, cost shown as a mark) · inverse task
(INV, non-degenerate) · transfer capstone (TRF, last, uncued far item) · refutation · analogy · retrieval ·
self-explanation · linked representations · narrative · productive failure · calibration · CTML hygiene.
Precedence: PCR ▷ reveal (no anchoring number before commit); ENS ▷ NF ▷ %; CF concrete ▷ symbol; TW needs an
ensemble upstream and a cost beat after. Maximum content structures: Glance 2 · Grasp 4 · Wield 3+1 · Master 5.
The audience × level matrix is MAP §3; the 15 crit-seat gate questions are MAP §6.

## 5. The art-department pipeline (model routing)

| # | Step | Owner | Artifact |
|---|---|---|---|
| 1 | Brief + art direction v0 (thesis, ladder, slate) | coordinator | `BRIEF.md`, `ART-DIRECTION-v0.md` |
| 2 | Consult seats: TD (algorithms, costs), pedagogy, critic (cuts, replacements) | **Fable**, isolated, single-pass | `consult/*.md` → `ART-DIRECTION-v1.md` |
| 3 | Research lanes (structures, audiences, animation evidence, assessment) | **Sonnet** | `research/PED-L1..L4.md` → `PEDAGOGY-MAP.md` |
| 4 | Build: **one team per direction**, two films each, NOTES.md first, look at the sheets, iterate ≥2× | **Opus** | `chromes/<id>/` per `BUILDER.md` |
| 5 | Batch crit over all contact sheets: juror + pedagogy seats who did not build | **Fable** | `crit/JUROR.md`, `crit/PEDAGOGY-CRIT.md` |
| 6 | Revision round on the crit + batch fixes | Opus (fresh agent per direction) | `REVISE.md` |
| 7 | Module architect: operadic interview → typed library over Materials | **Opus** | `modules/` (INTERVIEW, OPERAD, check.mjs) |

Budget (2 CPUs, SwiftShader): `--workers 1` for stills, `--workers 2` for the final MP4; custom GLSL, never
`baseMaterialShader` (tells 24–29).

## 6. Batch-crit lessons (what to kill before the crit sees it)

- **The house look.** All eight shared films stopped on a centred "pause and guess" **modal** with a copper countdown
  digit; used **twin panels** side-by-side or stacked; carried a tracked small-caps **header strip** with seed
  metadata top-right; and closed on the **same ending** ("about 36 % … 79 %" plus an "expected ± sd" footnote).
  Fix: design the commit IN the material (chalk on the proscenium, a marker on the knitting rod, a pin in the bank);
  find the material's own twin (onion-skin, recto/verso, a fork in one river, a replay with a ghost); end on the
  material's final image with truth-vs-realised integrated (a sounding, a selvage count, a folio total).
- **Lucky seeds.** Ledger showed 68 clean vs 59.9 expected (+1.65 sd), and a single lucky month flipped an ROI sign.
  Never pick seeds: raise N, show the distribution, or lead with the expectation (realised = one draw).
- **Cost as a mark.** Draw what checks cost (redone steps, hours, a slower river).
- **Mark-rule drift.** The best material decayed into a bar chart at the payoff (G at 24.8 s, A's flat icon grids).
  Rack by survival instead: the silhouette *is* the curve (ruler test).
- **Text load.** Must-read text ≥ 14 px at 960×540; one encoding ("36 of 100"), not repeated in captions.

## 7. Compose a new film from the module library

`library/` (operad, modules, materials, cameras, tools) composes explainers from typed pedagogy modules over **one Material** (7 materials vendored from
the chromes: `stitch` (run), `plate` (exposure), `pen` (margin), `isotype` (ledger), `maps` (marbling),
`sediment` (delta), `gear` (escapement); bunraku is not yet a Material). Pedagogy and camera modules never draw;
the Material draws every run, step, address, catch, cost, number and word, so no house look can exist.

1. **Beat graph** (JSON): `concept {claim, level}`, `params {N, k, p, c, retry, seed}`, `nodes` wired `"node.port"`.
   Start from `films/grasp/grasp.graph.json` (full Grasp: trace → fade → guess → ensemble → truth → twins → cost → caveat →
   transfer) or `films/grasp/smoke.graph.json`.
2. **Lint**: `node library/operad/check.mjs my.graph.json --material stitch`. Hard laws: TYPE, SEED, P1–P11, CAP (N within the
   material's range), INV, CLOCK, HOUSE, BELIEF, LEGIBLE. Soft budgets (MAX, P12) need a written `waivers` entry.
3. **Build**: `python3 library/tools/build_film.py my.graph.json stitch --id my-film --title "…" --out build`.
4. **Gate and look**: `python3 runtime/tools/gate.py build/my-film.html`, then
   `python3 runtime/tools/render.py build/my-film.html --out s --stills 6,19,33,47 --sheet s.jpg --workers 1`. Read the sheet.
5. **Swap the art**: rebuild the same graph with another material id. A new kernel is one file in `library/materials/`
   (interface: OPERAD §3); a new beat is one `AM.module({...})` that calls only `env.M.*`.

A new **chrome** (direction) instead: write its card against §1–§3 and the differentiation matrix (AD-v1 §6), brief
an Opus team with `BUILDER.md`, build on `runtime/` (`Atelier.film({...})`), gate, batch-crit, revise, then
extract its kernel into a Material.
