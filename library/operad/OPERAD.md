# The Atelier module operad (v0.1)

`operad.json` is generated from the code (`node check.mjs --export operad.json`). Do not edit it by hand. This page
is the readable version. It extends the studio's design operad (`ceti-p5-studio/references/operad.md`) and keeps its
laws (typing, associativity, disjoint slots commute, stream independence, immutability downstream). It adds one level
above it. The colours here are *pedagogical* objects. The operations are teaching beats. **Every image is still made
inside one Material**, which plays the role of the studio operad's `Mark ∘ Compose` subtree.

## 1. Object types (port colours)

| Type | What flows | Produced by |
|---|---|---|
| `Params` | `{N, k, p, c, retry, seed}` (+ per-step `p[]`) | the graph |
| `Ensemble` | an `Atelier.AgentLoop`: twin worlds on common random numbers | `agentLoop` |
| `Run` | one run id with its events in both worlds | `traceOpener` |
| `Trace` | a labelled-sketch worked run `{goal, steps, failAt, r}` | `traceOpener` |
| `Arrangement` | unit rects over time, `grid` or `rack` (sorted by survival) | `gridLayout`, `concretenessFade`, `ensembleRun`, `truthUnderEvidence`, `contrastingTwins` |
| `Number` | `{q, exact, realised, sd, N, source: engine\|marks\|sketch\|given}` | truth, twins, cost, transfer, inverse |
| `Commit` | a viewer prediction `{key, q, N, rect}`; its value lives in `ctx.state` | `predictCommitReveal`, `transferQuestion`, `inverseProblemWield` |
| `Cost` | `{redone, executed, frac}` from the engine's flags | `costOfCheck` |
| `Focus` / `Shot` / `Mix` | a world rect / a camera `t → {x,y,z}` / a transition weight | trace, address; cameras |
| `Evidence` | an evidence-row spec (PEDAGOGY-MAP §5) | PCR, TRF, INV |
| `Material` | the film's one Material (never a port: a film is composed *over* it) | `AM.compose(graph, materialId)` |

## 2. Operations (arity = required inputs)

| id | structure · stage | signature | grade |
|---|---|---|---|
| `agentLoop` | ENG | `() → Ensemble` | — |
| `gridLayout` | LAY (scaffold) | `Ensemble → Arrangement` | — |
| `traceOpener` | CF · concrete | `Ensemble → Trace × Run × Focus` | B |
| `concretenessFade` | CF · morph | `Trace × Ensemble → Arrangement` | B |
| `predictCommitReveal` | PCR | `Ensemble → Commit` | B |
| `ensembleRun` | ENS (+NF) | `Ensemble × Arrangement × Run? → Arrangement × Ensemble` | B |
| `failureAddress` | ENS · address (scaffold) | `Ensemble × Arrangement → Focus` | C |
| `truthUnderEvidence` | ENS · overlay | `Ensemble × Arrangement × Commit? → Arrangement × Number` | B |
| `contrastingTwins` | TW · diff | `Ensemble × Arrangement × Mix? → Arrangement × Number × Number` | C |
| `costOfCheck` | TW · cost | `Ensemble × Arrangement → Cost × Number` | C |
| `correlatedCaveat` | HON (honesty) | `Ensemble × Arrangement → ()` | C |
| `transferQuestion` | TRF | `() → Commit × Number` (owns a fresh far-case engine) | B |
| `workedExampleFade` | WE | `Ensemble → ()` | A |
| `inverseProblemWield` | INV | `() → Commit × Number` (per-step p, budget) | C |
| `frameFocus` · `pullBack` · `addressZoom` | CAM | `Focus → Shot` | — |
| `crane` · `rackFocus` | CAM | `() → Shot` · `() → Mix × Shot` | — |

Grades are copied from PEDAGOGY-MAP §1. Each operation is a factory `{id, structure, cls, in, out, reveals, commits,
dur(P), build(P, ins, ctx, M) → {out, self}, draw(env), captions, score, controls, meta, evidence}`.

## 3. The Material interface (what every kernel must draw)

`{id, source, markRule, nouns, axis: 'x'|'y', cell: {along, across, maxAcross}, nRange, ground, begin(p,ctx,t,cam),
units(S, items, t), mark(S, kind, x, y, o), line(S, pts, role, o), area(S, top, bot, role, o), text(S, str, x, y, o),
num(S, Number, x, y, o), anchor(rect, j, k), end(p, S), voice}`.
`units` receives `[{r, x, y, w, h, k, rows, done, failAt, age, caught[], world, alpha, emph, lost}]`: run, steps,
address and catches in one batch, so pixel kernels (stitch splatter, plate exposure, marbling pull-back) stay
batched. Mark kinds: `address · save · cost · guess · truth · realised · expected · tick`. Line roles: `exact · rule ·
guess · gap · ghost · link`. Text roles: `title · head · text · num · note · sketch`.

## 4. Composition

A film is a **beat graph** over one Material: nodes `{id, module, params, in: {port: "node.port"}, at?, dur?}`.
`at` = number | `"node.start+x"` | `"node.end"`; by default a node follows the previous stage/overlay beat.
Layers: **stage** (one owner at a time; it keeps drawing its last state until the next stage beat, and its words fade
after its window), **overlay** (drawn only inside its window), **camera** (the latest started shot wins), **none**
(build only). Ports are wired lazily, per seed, so `score` and `meta`, which run before `setup`, see the same build.

## 5. Laws (the composer throws on a hard law; `check.mjs` exits 1)

| id | law | grade | hard |
|---|---|---|---|
| TYPE | wires type-match; required ports wired; no reading a port before its node starts | — | ✓ |
| SEED | twins + their ensemble come from one engine node (common random numbers) | C | ✓ |
| P1 | PCR ▷ REVEAL: no number of a committed family before that commit closes | B | ✓ |
| P2 | ENS ▷ NF ▷ percentage | A | ✓ |
| P3 | CF concrete ▷ morph, both before the first ensemble | B | ✓ |
| P4 | WE FULL ▷ GAP1 ▷ TWO-GAPS | A | ✓ |
| P7 | TW needs an ENS upstream on the same engine **and** a COST beat after it | C | ✓ |
| P9 | CAL requires PCR | C | ✓ |
| P10 | TRF is last; its FAR item never names agents/AI/models/loops | B | ✓ |
| P11 | PF only at Wield+ | B | ✓ |
| P12 | INV after PCR and TW | inf | soft |
| MAX | content structures per level (glance 2 · grasp 4 · wield 3+1 · master 5), ≤1 INV/PF/REF/NAR, ≤2 PCR on distinct quantities | inf | soft |
| CAP | N inside the material's `nRange` (marbling/ledger ≤120, pen ≤100, gear ≤300, stitch 2,500, plate/sediment 4,000) | — | ✓ |
| INV | inverse tasks are non-degenerate: per-step p varies and the budget < k | C | ✓ |
| CLOCK | no clock or impure RNG in any module, camera or material (static scan + gate PURE-REP/ORD) | — | ✓ |
| HOUSE | pedagogy and camera code never draws; only the Material draws | — | ✓ |
| BELIEF | results reach the screen only as `AM.Number`; any other digit is declared `given` or `sketch` (runtime guard) | — | ✓ |
| LEGIBLE | must-read roles ≥ 14 px (head 16, title 18); `note` never carries a result (runtime guard) | — | ✓ |

Soft laws become **WAIVED** only with a written `{law, reason}` in the graph. The proof graph carries one waiver:
MAX, since the requested Grasp sequence has five structures (INTERVIEW finding F1).

## 6. Laws every composite satisfies by construction

- **Clock purity.** Modules and cameras are closed-form in local t. Materials cache by render scale only. The gate
  proves it: PURE-REP and PURE-ORD passed on both proof films.
- **Mark rule.** Each Material declares `markRule` {unit, step, address, save, cost}, and every module draws through those roles.
- **Belief.** Every Number is traced to `engine` or `marks`. The formatter writes *expected*, never "exact ±"
  (PEDAGOGY-CRIT defect 2).
- **Address.** `units()` receives `failAt`. Every kernel draws it: a loop, a dot, a ×, a void slip, a stray, a pile, a
  short tooth.
- **Ruler.** `truthUnderEvidence` racks the units by survival. The silhouette *is* the survival curve, and the exact
  curve is drawn over it.
- **No house look.** The commit, the twin, the cost and the ending are all Material calls. Each film has exactly one
  Material, so no shared frame, header strip, modal or closing card can exist.
