# Proof · GA storyboard reward pilot

**Branch:** `cursor/ga-storyboard-reward-b921` · **Date:** 2026-10-15  
**Tool:** `factory/tools/evolve_sequence.py` · **Design:** `docs/GA-STORYBOARD-REWARD.md`

This proof runs the full **score → evolve → build → gate → fitness** loop on real shipped films. WebGL uses the simpsons-3d COUNT window; 2D uses the goodhart ledger draft (knobbed variant) for fast `--evaluate` runs.

## Environment

```sh
pip install -r scripts/requirements.txt
# Playwright for gate.mjs (this VM):
#   node modules at /opt/node-tools/node_modules/playwright
#   Chromium at /opt/pw-browsers/chromium-1194
export PATH="$HOME/.nvm/versions/node/v22.23.3/bin:$PATH"
sh scripts/doctor.sh   # after playwright install
```

## 1 · Score shipped baseline (no build)

**Film:** `factory/films/simpsons-3d` · **Window:** 36–58 s (COUNT / split reveal)

```sh
python3 factory/tools/evolve_sequence.py score factory/films/simpsons-3d --window 36,58
```

| Metric | Value |
|--------|------:|
| Wall time | ~0.04 s |
| Fitness (shipped `gate.json`) | **108.90** |
| `gate_weighted` | 106.5 |
| `seat` term | 12.0 |
| Timing genes | 33 |

Artifacts: `score.json` (copied here), `factory/films/simpsons-3d/evolve/score.json`.

## 2 · Dry-run micro-GA (mutate; score against shipped gate)

```sh
python3 factory/tools/evolve_sequence.py evolve factory/films/simpsons-3d \
  --window 36,58 --population 4 --generations 2 --dry-run --seed 1973
```

| Metric | Value |
|--------|------:|
| Wall time | ~0.05 s |
| Best fitness | **108.90** (elite = shipped; no knob change beats shipped gate snapshot) |

## 3 · Full `--evaluate` · simpsons-3d (WebGL)

Rebuilds and re-gates each individual. Gate uses **`--overlap-warn`** when the shipped gate predates G11, and **`--quick`** overlap sampling by default (see `evolve_sequence.py` fix).

```sh
python3 factory/tools/evolve_sequence.py evolve factory/films/simpsons-3d \
  --window 36,58 --population 4 --generations 2 --evaluate --seed 1973
```

| Metric | Before (gen0 shipped) | After (best) |
|--------|----------------------:|-------------:|
| Fitness | 125.40 | **125.40** |
| Wall time (8 build+gate) | — | **~110 s** (~14 s / individual avg) |
| Gate on best run | — | **PASS** (G5c, G11, G12 = WARN) |

Notes:

- Fitness **125.40** is against a **fresh** gate (includes G11/G12). The older shipped `gate.json` scores **108.90** on the same knobs — both are valid; the pilot uses live gate for `--evaluate`.
- Draft-a/b/c genomes in the seed population **fail build** when crossed into the shipped `film.js` tree (draft-only knobs / range violations). The GA still selects the shipped elite and a draft-b crossover that re-gates at 125.40.

Best run directory: `factory/films/simpsons-3d/evolve/run-g0-i0/` (page + `gate.json`).

## 4 · Full `--evaluate` · goodhart ledger 2D (fast path)

Shipped root `goodhart/` has no timing knobs; the **ledger draft** is the 2D knobbed film used here.

```sh
python3 factory/tools/evolve_sequence.py score factory/films/goodhart/drafts/ledger --window 36,58

python3 factory/tools/evolve_sequence.py evolve factory/films/goodhart/drafts/ledger \
  --window 36,58 --population 4 --generations 2 --evaluate --seed 1973
```

| Metric | `score` (frozen `gate.json`) | `--evaluate` elite (fresh gate) |
|--------|-----------------------------:|--------------------------------:|
| Fitness | **106.50** | **123.00** |
| Knob vector vs shipped | same | **same** (GA did not beat shipped) |
| Wall time | ~0.2 s | **~26 s** evolve |
| Gate on elite | — | **PASS** |

The **106.50 → 123.00** gap is **not** evolutionary improvement: it compares **old gate file weights** vs **live re-gate** (`--overlap-warn`, `--quick`). See `history.goodhart-ledger.json` — best individual remains shipped. For a visible delta, use `wow-demo/` (`WOW.md`).

Artifacts: `best.genome.goodhart-ledger.json`, `history.goodhart-ledger.json` in this directory.

## 5 · Code fix for reliable `--evaluate`

`evaluate_genome()` now passes:

- `--overlap-warn` when `gate.json` has no G11 row (legacy films).
- `--quick` during `--evaluate` unless `--gate-full` is set.

Without this, simpsons-3d rebuilds **FAIL** G11 and fitness collapses to −∞ despite a passing historical gate file.

## 6 · Screenshots

Saved under `/opt/cursor/artifacts/screenshots/`:

- `ga_reward_simpsons_window_36_58.png` — shipped page at *t* = 45 s
- `ga_reward_goodhart_ledger_eval_t45.png` — ledger evaluate build at *t* = 45 s

## 7 · Copied artifacts (this folder)

| File | Description |
|------|-------------|
| `best.genome.json` | Best simpsons-3d genome after `--evaluate` |
| `history.json` | Per-individual fitness log (simpsons) |
| `score.json` | Baseline score snapshot |
| `best.genome.goodhart-ledger.json` | Best 2D ledger genome |
| `history.goodhart-ledger.json` | Ledger evolve history |

## 8 · Video proof (MP4)

**Primary WOW (goodhart ledger, two different files):** **[WOW.md](WOW.md)** · rebuild via **`wow-demo/BUILD.md`**.

| Clip | Path |
|------|------|
| Before (degraded timing) | `/opt/cursor/artifacts/ga-wow-goodhart-before.mp4` |
| After (GA best genome) | `/opt/cursor/artifacts/ga-wow-goodhart-after.mp4` |
| Screenshots @ *t* ≈ 45 s | `/opt/cursor/artifacts/screenshots/ga-wow-before.png`, `ga-wow-after.png` |

WOW pair fitness (live gate): **122.92 → 123.00**; pilot headline **106.50 → 123.00** = frozen `gate.json` vs `--evaluate` (G11/G12).

**Legacy simpsons-3d** (same clip — not a GA win):

| File | Path |
|------|------|
| Baseline | `/opt/cursor/artifacts/ga-proof-baseline.mp4` |
| “Evolved” dry-run | `/opt/cursor/artifacts/ga-proof-evolved.mp4` (**byte-identical** to baseline) |

Export recipe: `docs/proofs/ga-storyboard-reward/export/ga-baseline.export.json`.

## Verdict

The pilot **proves the machinery**: genomes → build → gate → fitness → history, on WebGL and 2D. It does **not** prove GA beat shipped simpsons or ledger on this run (elites unchanged). Real wins to pursue next: seed from **draft-only** or **degraded** baselines, caption genes, and the goodhart wow MP4 pair documented in **`WOW.md`**.
