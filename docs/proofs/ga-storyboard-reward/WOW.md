# What is actually “new” on this branch

This page separates **machinery we built** from **proof that was overstated** in early PR comments.

## Shipped on the branch (merge-worthy)

| Piece | What it does |
|-------|----------------|
| `factory/tools/evolve_sequence.py` | Offline GA over **timing knobs** in a clock window: seed → mutate/crossover → (optional) kit2 build + gate → scalar fitness → `best.genome.json`. |
| `docs/GA-STORYBOARD-REWARD.md` | Design for bounded storyboard sequences, reward terms, and how this could plug into Atelier workers later. |
| `gate_extra_flags()` | Makes `--evaluate` usable on legacy films (`--overlap-warn`, `--quick`) without false G11 FAIL. |

**Not implemented yet:** caption/chapter genes, neural reward model, module-chain evolution (design only).

## What the proof runs demonstrated

1. **Pipeline works:** genomes → build → gate → fitness → history JSON (simpsons WebGL ~110 s for pop 4 × gen 2 evaluate).
2. **simpsons-3d:** Best genome = **shipped** (no knob change). MP4 “baseline” and “evolved” are **the same clip** — correct for that run, not a product win.
3. **goodhart ledger:** Fitness **106.50** (score against **frozen** `gate.json`) vs **123.00** (**fresh** gate under `--overlap-warn` + `--quick`) is mostly **re-scoring**, not GA discovering new knobs. History shows elite = shipped at **123.0**; mutants score slightly lower.

## Visual demo (goodhart COUNT window)

To show **visible** before/after without duplicating whole film trees in git:

- **Before:** `wow-demo/before/genome.degraded.json` — manually mis-synced COUNT timing (`scanT0`, `gatherT0`, etc.); fitness **~122.92**, gate **PASS**.
- **After:** `wow-demo/after/genome.best.json` — shipped ledger knobs; fitness **123.0**.

Rebuild and export (MP4 not committed):

```sh
# See wow-demo/BUILD.md
```

Artifacts when built on a proof VM:

- `/opt/cursor/artifacts/ga-wow-goodhart-before.mp4` (~512 KB, 22 s window)
- `/opt/cursor/artifacts/ga-wow-goodhart-after.mp4` (export after running BUILD.md step 2)

That pair is the intended **“you can see the beat land differently”** story — separate from simpsons WebGL exports.

## Duplicate work removed from the branch

Earlier agent passes committed **~6.5 MB** of duplicated simpsons `sandbox/baseline` + `sandbox/evolved` (identical knobs). Those trees were **removed**; regenerate from `factory/films/simpsons-3d` using commands in `PROOF.md`.

## Honest “WOW” for reviewers

- **Today:** a **research orchestrator** + **gate-shaped fitness** + **documented path** to combine Sonnet/Haiku workers — not an automatic quality leap on already-shipped films.
- **Next:** run GA on a **degraded or draft-only** baseline, or expand genotype (captions); use goodhart wow pair as the acceptance clip for timing sync.
