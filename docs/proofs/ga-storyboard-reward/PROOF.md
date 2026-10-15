# GA storyboard reward · proof pack

Branch: `cursor/ga-storyboard-reward-b921` · film: **simpsons-3d** · window **36–58 s** (overall → split-by-department beat).

Design doc: [GA-STORYBOARD-REWARD.md](../../GA-STORYBOARD-REWARD.md) · tool: `factory/tools/evolve_sequence.py`.

## GA run (dry-run pilot)

Scoring uses the **shipped** `factory/films/simpsons-3d/gate.json` (`pass: true`, pre-G11 era). Mutations in `--dry-run` do not rebuild; fitness is proxy + anchor/alignment on that gate snapshot.

```sh
python3 factory/tools/evolve_sequence.py score factory/films/simpsons-3d --window 36,58
python3 factory/tools/evolve_sequence.py evolve factory/films/simpsons-3d --window 36,58 \
  --population 4 --generations 2 --seed 1973
```

| Individual | Fitness | Notes |
|---|---:|---|
| Shipped baseline (`best.genome.json`) | **108.90** | Winner; all knob deltas 0 vs shipped |
| Draft-b seed | 108.90 | Tie on proxy fitness |
| Gen-1 crossover (shipped × draft-a) | 107.65 | Lower anchor/alignment penalty tradeoff |
| Gen-1 mutant (elev0=27, pinRate=20) | 105.65 | Explored but not selected |

**Verdict:** Evolved **matches** baseline on fitness and knobs; no visual delta expected for `ga-evolved` vs `ga-baseline`.

Outputs (gitignored, regenerate locally): `factory/films/simpsons-3d/evolve/{best.genome.json,recipe.json,history.json,score.json}`.

## Gate for shipped export

```sh
python3 factory/kit2/build.py factory/films/simpsons-3d \
  --brand ceti-boardwalk-dark --chrome none --material ink
# gate snapshot on branch (PASS): factory/films/simpsons-3d/gate.json
```

Sandbox copies: `sandbox/baseline/` (shipped tree + build), `sandbox/evolved/` (best genome via `evaluate_genome`; same knobs as baseline).

## Video proof

MP4s are **not** committed (`*.mp4` gitignored). Cloud Agent artifacts:

| Artifact | Path | Size (bytes) | Content |
|---|---|---:|---|
| `ga-proof-baseline.mp4` | `/opt/cursor/artifacts/ga-proof-baseline.mp4` | 7453516 | Shipped genome, 36–58 s |
| `ga-proof-evolved.mp4` | `/opt/cursor/artifacts/ga-proof-evolved.mp4` | 7453516 | `best.genome.json` (identical to baseline) |
| `ga-proof-window.mp4` | `/opt/cursor/artifacts/ga-proof-window.mp4` | 7453516 | Same clip (window export) |

Export command (660 frames, 1920×1080, ~187 s wall with 4 shards):

```sh
PAGE=factory/films/simpsons-3d/build/simpsons-3d.ceti-boardwalk-dark.none.html
OUT=docs/proofs/ga-storyboard-reward/export
node arsenal/tools/export.mjs "$PAGE" --sel '#stage' --query '?film=1' \
  --fps 30 --gif-seconds 0 --from 36 --to 58 --dsf 1 --samples 1 \
  --shards all/4 --out "$OUT" --name ga-baseline
cp "$OUT/ga-baseline.mp4" "$OUT/ga-evolved.mp4   # best genome == shipped
```

Machine-readable export report: `export/ga-baseline.export.json` (`mp4_frames_match: true`, `window.from/to: 36/58`).

## Blockers / limits

- **`--evaluate` on WebGL** is slow (~1 s/frame); this proof used **dry-run GA** + one gated shipped page for video.
- Re-gating simpsons-3d with current gate (G11 overlap) **FAIL**s on end-card overlap; do not overwrite shipped `gate.json` without a film fix or `--overlap-warn` policy (see `gate_extra_flags` in `evolve_sequence.py`).
- **goodhart** has no `knobs` block — not a GA target in v0.
