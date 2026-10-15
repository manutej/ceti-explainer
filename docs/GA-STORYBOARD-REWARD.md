# GA + reward model over a bounded storyboard sequence

**Status:** design + pilot stub (`factory/tools/evolve_sequence.py`) · branch `cursor/ga-storyboard-reward-b921` · 2026-10-15

**Question:** Can we run a genetic / evolutionary loop on a *short* stretch of a film (not the whole timeline), with a
reward model built from gate, seat, and frame signals we already ship — and use shipped films as fitness baselines and
genotype seeds — while keeping lower workers (Sonnet scenes, Haiku caption cards, scripts) inside project laws?

**Short answer:** Yes, for the **tier-1 edit surface** the pipeline already allows: `film.json` **knobs**, **captions**
(≤ 60 chars, claim-safe), and **chapter t0** shifts (≤ 2 s). That is exactly what `apply_findings.py` enforces and what
Opus findings on simpsons-3d, pass-every-time, and the Wave films converged on. A GA loop is feasible **today** as
orchestration over build → gate → (optional) frames → scalar fitness, with **drafts a/b/c and the shipped winner** as
initial population. Structural changes (film.js, module chain order) stay **outside** the genotype unless we add a
Sonnet scene worker with typed contracts (SWARM-DESIGN cards, `library/plan/METHOD.md` S4–S5).

---

## 1. Scope and laws (non-negotiable)

| law | GA implication |
|---|---|
| One clock, `render(t, state)` pure, fixed `seed` | Genotype may not touch `film.js`, `Math.random`, or `Date`. Mutations only on declared knobs / captions / chapter t0. |
| Counts before ratios | Reward includes alignment penalties: caption at *t* must not state a ratio before the count knob lands (see simpsons findings). |
| Gate G1–G10 (+ G11 overlap, G12 rhythm WARN) | Any row **FAIL** → individual discarded (fitness −∞) or never enters the population. |
| Two fix rounds max (PIPELINE) | GA **generations** are a research harness; production still caps at two tool-applied rounds unless DECISIONS changes. |
| No runtime fetches | Reward is computed from local gate JSON, frames.json, seat.json — not an online RM. |

---

## 2. What “sequence” means here

A **bounded sequence** is a window `[t0, t1]` on the master clock plus the **beats/chapters** that intersect it.

Representations already on file:

| artifact | role in GA |
|---|---|
| `factory/topics/<id>/beats.md` | Beat sheet → module chain intent (METHOD S3–S5); seeds **chain genotype** for future work, not mutated in v0 pilot. |
| `film.json` `chapters[]` | Beat boundaries; tier-1 **chapter t0** nudges (≤ 2 s) shift the sequence edge. |
| `film.json` `captions[]` | Timed utterances; tier-1 text variants (same digits / claims). |
| `film.json` `knobs` + `knobs_doc` | Primary **continuous genotype** (52 knobs on simpsons-3d). |
| `frames/frames.json` | Per-half-second caption + chapter + knob snapshot; cheap **phenotype log**. |
| `gate.json` | Objective rows G1–G12. |
| `findings.r*.json` | Human-readable **fitness gradients** (which knob/caption fixed which defect). |
| `seat.json` | Blind rubric (`craft`, `truth[]`, defects); optional scalar for ceiling, not floor. |
| `SELECT.md` + drafts `a|b|c` | **Crossover parents** and baseline ranking. |
| `PROTOTYPE.md` / `MEASURES.md` | Wall time, s/frame, token budgets → multi-objective terms. |

**Not in v0 genotype:** reordering arsenal modules, editing `film.js`, new claims, brand sweeps (that is `atelier-variant`).

---

## 3. Genotype (v0: `SequenceGenome`)

On-disk JSON (written by the pilot tool under `<film-dir>/evolve/`):

```json
{
  "schema": "ceti.sequence_genome/v0",
  "film": "simpsons-3d",
  "window": [36.0, 58.0],
  "seed": 1973,
  "baseline": "factory/films/simpsons-3d/film.json",
  "genes": {
    "knobs": { "split1": 45.4, "dv0": 45.5, "revealT": 54.4, "mixT": 58.8, "mixPct": 60.6 },
    "captions": {},
    "chapters": {}
  },
  "meta": {
    "parents": ["drafts/c", "shipped"],
    "generation": 0
  }
}
```

### 3.1 Gene discovery (automatic)

For window `[t0, t1]`, include a knob *k* when any of:

1. **Caption overlap:** some caption with `t0 ≤ cap.t1 ≤ t1` or `cap.t0 ∈ [t0,t1]` and `knobs_doc[k].what` mentions time, land, reveal, split, turn, mix, orbit, camera, or `%`.
2. **Name heuristic:** `k` matches `(?i)(T\d*|split|turn|reveal|mix|orbit|cam|elev|zoom|dv|hold|fade|stagger)`.
3. **Findings prior:** *k* appears in any `findings.r*.json` for that film.

Everything else is **locked** at baseline values for the pilot (boxSize, neon, etc.).

### 3.2 Genotype extensions (v1, documented not built)

| layer | genes | worker |
|---|---|---|
| Chain order | ordered module ids + params (METHOD `film.plan.json`) | Sonnet scene card per module |
| Caption alleles | index → list of claim-safe strings | Haiku shorten card |
| Look | brand/chrome/material | atelier-variant (zero film.js) |

---

## 4. Variation operators

All operators call the same validators as `apply_findings.py` (ranges, caption length, chapter shift ≤ 2 s, no new digits).

| operator | action |
|---|---|
| **Mutate (continuous)** | For one timing knob: `v' = clamp(v + ε·step, range)` with `ε ~ N(0,1)`, `step` from `knobs_doc` or 0.1 s for times. |
| **Mutate (caption)** | Swap caption *i* text from a **allele pool**: shipped caption, findings `proposed_value`, or Haiku-generated short line (orchestrator card). |
| **Mutate (chapter)** | Shift one chapter `t0` by ±{0.25, 0.5, 1.0} s within neighbour constraints. |
| **Crossover** | Uniform crossover on knob keys between two parents (e.g. draft **b** camera × draft **c** instrument timings). Captions: one-point crossover by time order. |
| **Repair** | After variation, sort chapter t0; enforce `t0 < t1`; re-clamp knobs; if gate FAIL G4/G7, revert the last gene touch. |

**Elitism:** always retain shipped baseline genome + best-of-generation if gate PASS.

---

## 5. Reward model (composite, no neural RM required)

Treat fitness as **maximize** `R` (scripts only). Optional neural RM path in §8.

### 5.1 Hard constraints

```
if gate.pass == false:  R = -1e9
if any row.status == FAIL:  R = -1e9
```

### 5.2 Row scores (from `gate.json`)

| term | weight | notes |
|---|---|---|
| G2 purity | +40 | PASS required; penalize WARN |
| G4 format / beats | +30 | commit order, counts-first |
| G5 claims | +40 | formula recompute |
| G6 legibility | +15 | |
| G7 counts-first | +25 | |
| G11 overlap | +30 | FAIL −∞; each overlap instance −5 (D13) |
| G12 rhythm | +10 | WARN −3 per flag (D16) |
| G8 size / G9 tics | +5 each | tie-break |

Parse row `status`: PASS=1, WARN=0.5, FAIL=−∞.

### 5.3 Performance and cost

| term | weight | source |
|---|---|---|
| s/frame | −10 × max(0, s_frame − target) | `frames.json` build metadata or gate G1 `readyMs` proxy; simpsons target 0.5–0.7 |
| page bytes | −1e−6 × bytes over budget | build log |

### 5.4 Sequence alignment (findings-shaped)

Without a full `measure.mjs` (SWARM-DESIGN §2), v0 uses **knob–caption slack** inside the window:

For each finding in window with a **clock-time knob** (knob value within 3 s of the finding’s *t*; excludes rates,
zooms, gaps in world units):

```
penalty += max(0, |caption.t0 - knob_value| - τ)²   with τ = 0.35 s
```

simpsons-3d shipped findings already encode the correct pairing (`revealT` vs caption 10 at 54.2 s, etc.). Using
findings as **soft constraints** reverse-engineers the evaluator’s intent into a reproducible score.

### 5.5 Baseline anchoring (reverse engineering shipped quality)

Shipped films are **reference phenotypes**, not oracles:

```
R_anchor = -λ · Σ_k (knob_k - knob_k^*)²   with λ small (0.01–0.1)
```

`knob^*` from the gated shipped `film.json`. Prevents the GA from trading a gate PASS for absurd timings. **Drafts** that
passed gate but lost select contribute diversity without replacing the anchor.

### 5.6 Seat rubric (optional ceiling term)

If `seat.json` exists:

```
R_seat = 2 × craft + sum(truth ok) - 3 × major_defects
```

Weight ≤ 20 % of total so scripts own the floor (SWARM-DESIGN: G12 100 % vs judge 13/44).

### 5.7 Combined

```
R = w_g·G + w_p·Perf + w_a·Align + w_s·R_seat - w_anchor·||knob - knob*||²
```

Default weights: `w_g=1`, others 0.2–0.5. Tune on simpsons pilot by correlating with findings severity counts.

---

## 6. Evolutionary loop

```
┌─────────────┐     seeds: shipped + drafts a,b,c + findings-proposed knob sets
│  Init pop   │
└──────┬──────┘
       ▼
┌─────────────┐     script worker: write genome → film.json (knobs only) → kit2 build
│  Evaluate   │     → gate.mjs --json → frames.mjs (window strip only, optional)
└──────┬──────┘     → fitness(R)
       ▼
┌─────────────┐     keep top ε; mutate/crossover; repair
│  Select     │
└──────┬──────┘
       ▼
     stop: max generations, or ΔR < δ for G gens, or budget (wall / build count)
```

**Termination (pilot defaults):** population 6, generations 4, max 30 full builds (~15–45 min for WebGL simpsons window).

**Factory mapping:**

| step | command |
|---|---|
| build | `python3 factory/kit2/build.py <dir> --brand … --chrome … --material …` |
| gate | `node factory/tools/gate.mjs <page> --film <dir> --json gate.json --kit factory/kit2/…` |
| strip | `node factory/tools/frames.mjs <page> --every 0.5 --from t0 --to t1 --out evolve/frames` (when supported; else full strip) |
| apply best | convert best genome → `findings.json`-shaped list OR direct knob write + one `apply_findings`-style validation |

---

## 7. Lower workers (swarm decomposition)

Align with `docs/SWARM-DESIGN.md` tiers:

| tier | GA role |
|---|---|
| **Script** | genome I/O, mutate/crossover, build, gate, fitness, `evolve_sequence.py`, future `measure.mjs` / G13 |
| **Haiku** | caption allele when mutation picks `caption_index`; claim-safe shorten |
| **Sonnet** | *not* in v0 loop; v1 **scene cards** emit one module’s knobs for a window |
| **Opus** | optional final blind compare of top-2 strips (same as SELECT); not per-individual |

Card JSON (`SWARM-DESIGN` §3) wraps Haiku/Sonnet with hashed inputs. The GA orchestrator is a **meta-card** scheduling
script workers; model workers only on caption allele gaps or blocked repairs.

---

## 8. Reverse engineering a build recipe from shipped examples

**Goal:** infer a reproducible “how we got here” from artifacts, not from chat logs.

| source film | what to extract | use in GA |
|---|---|---|
| **simpsons-3d** | `drafts/{a,b,c}/film.json`, `SELECT.md`, `findings.r1/r2`, `PROTOTYPE.md` | Initial population; findings → alignment penalties; 11→5 convergence proof for knob-only search |
| **goodhart** | 2D, commit on, strong G7; legacy G11 WARN | Baseline for **caption + chapter** genotype only (fewer knobs) |
| **pass-every-time** | `MEASURES.md`, 17 findings kinds (SWARM-DESIGN table) | Template for detector→finding→knob mapping when G12(d)(e) land |
| **Wave GL trio** | `MEASURES.md`, chain-recipes R17–R28 | WebGL s/frame ceiling; camera-rig knob groups as correlated genes (`knobs_doc.chain`, planned) |
| **opera-house** | D9 gold standard | Gate calibration weights (G6 sidebar allowed) |

**Recipe emission (output of a successful run):**

1. `evolve/best.genome.json` — winning genes.
2. `evolve/recipe.md` — human steps: knob deltas vs shipped, gate row deltas, s/frame.
3. Optional: auto-generate a **findings-shaped** file for one `apply_findings.py` round (production-safe).

This is **reverse engineering** in the sense of fitting a low-dimensional knob vector and caption set that reproduces
gate+alignment scores of the shipped page, starting from discarded drafts — not inferring film.js.

---

## 9. Recommended first pilot

**Film:** `factory/films/simpsons-3d`  
**Window:** `[36.0, 58.0]` s — **CASE tail → turn → side reveal → mix counts** (chapters `case`/`count` overlap; the
findings-heavy beat).  
**Why:** WebGL proof film; 52 knobs; blind select + two tool rounds documented; findings are almost all timing/sync;
drafts differ mainly in camera vs exhibit vs instrument **knob vectors** while sharing claims.

**Success criteria (pilot):**

1. Population seeds (shipped + 3 drafts) all score > −∞ with `--score-only` on existing gates (drafts may need local rebuild).
2. One generation of `--evolve --dry-run` produces valid genomes passing validators.
3. Optional: one full build of a mutated genome gate PASS and `R ≥ R_baseline − ε`.

**Second pilot (2D, faster builds):** goodhart `[16, 36]` s COUNT beat — caption/chapter genes only.

---

## 10. Risks and mitigations

| risk | mitigation |
|---|---|
| Gate PASS but ugly (G12 vs judge) | Keep Opus blind strip compare for top-2; don’t raise G12 to FAIL without D-row |
| WebGL load failures under parallel builds | Serial builds or render lock (SWARM-DESIGN §1.8) |
| Overfitting findings on one film | Hold out Wave film; anchor term; cross-film λ tuning |
| Scope creep into film.js | Genotype schema rejects non-JSON paths; build.py never invoked on edited js |
| GA violates “two rounds” culture | Run GA offline; ship only via findings + NOTES warnings |

---

## 11. Optional neural reward model path

Not required. If added later:

1. Train a **Bradley–Terry** or pairwise ranker on `(frames strip A, frames strip B) → SELECT preference` from simpsons + Wave drafts (labels already in SELECT.md).
2. Features: gate row one-hot, s/frame, overlap count, 480×270 thumb hashes (not pixels in training loop — use precomputed).
3. Use RM score as **w_rm·P(win)** with weight ≤ 0.3; gate FAIL still −∞.

References: `docs/study/readers/R17-plugin-references.md` (genetic search lane 38); `factory/research/VIZGEN-METHODS-2026.md` §3.2 (Co-Director bandit → `tune.py` with rubric reward).

---

## 12. Tooling

```sh
# Score shipped baseline against its gate (no build)
python3 factory/tools/evolve_sequence.py score factory/films/simpsons-3d --window 36,58

# One generation, dry-run (mutate + validate only)
python3 factory/tools/evolve_sequence.py evolve factory/films/simpsons-3d --window 36,58 --generations 1 --dry-run

# Full micro-pilot (build + gate each individual — slow)
python3 factory/tools/evolve_sequence.py evolve factory/films/simpsons-3d --window 36,58 --population 4 --generations 2
```

See `factory/tools/evolve_sequence.py` for flags and fitness breakdown JSON under `<film-dir>/evolve/`.

---

## 13. Open questions

1. Should GA runs **write** `film.json` in place, or only under `evolve/run-<id>/`? (Pilot: never in place.)
2. Do we promote G12 dwell / one-line caption rules to FAIL before GA trusts alignment penalties alone?
3. Is `--from/--to` on `frames.mjs` already shipped (D15 mentions it on export.mjs)? Window strips may need a small frames flag.
4. Correlated knob **`chain`** in `knobs_doc`: mutate as one gene block?
5. Production path: best genome → single Opus findings pass → one `apply_findings.py` round, or direct knob commit?
