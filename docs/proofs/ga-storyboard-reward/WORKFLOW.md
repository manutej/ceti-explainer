# GA storyboard reward · proof workflow

How this proof pack was produced and how to reproduce it.

```mermaid
flowchart LR
  subgraph inputs
    F[film.json knobs + captions]
    G[gate.json PASS snapshot]
    W[window 36-58s]
  end
  subgraph ga
    E[evolve_sequence.py evolve]
    B[best.genome.json]
  end
  subgraph ship
    K[kit2 build.py]
    V[export.mjs --from/--to]
    A[/opt/cursor/artifacts/*.mp4]
  end
  F --> E
  G --> E
  W --> E
  E --> B
  F --> K
  B --> K
  K --> V
  V --> A
```

## End-to-end GA loop (workers)

```mermaid
flowchart TB
  subgraph seeds["Population seeds"]
    S1[Shipped film.json]
    S2[Drafts a / b / c]
    S3[Findings knob hints]
  end
  subgraph tier1["Tier-1 genotype (v0)"]
    K[knobs + captions + chapter t0]
  end
  subgraph eval["Evaluate (script orchestrator)"]
    B[kit2 build.py]
    G[gate.mjs G1–G12]
    F[frames.mjs window strip optional]
    R[evolve_sequence fitness R]
  end
  subgraph workers["Lower workers (future / parallel)"]
    D[Sonnet draft lanes]
    H[Haiku caption tune cards]
    O[Opus blind SELECT / seat]
  end
  seeds --> K
  K --> B --> G --> R
  G --> F --> R
  D -.->|distinct registers| seeds
  H -.->|residual captions| K
  O -.->|rank strips not code| R
  R -->|select mutate crossover| K
```

Production path (not this proof): offline GA → `best.genome.json` → optional Opus findings → one `apply_findings.py` round → SHIP.

## Steps

1. **Doctor** — `sh scripts/doctor.sh` (Playwright Chromium for export/gate).
2. **Score / evolve** — `factory/tools/evolve_sequence.py` on `factory/films/simpsons-3d` with `--window 36,58`. Use `--evaluate` only when you need per-individual rebuilds (slow on WebGL).
3. **Sandbox** — `docs/proofs/ga-storyboard-reward/sandbox/{baseline,evolved}/` hold film sources + built HTML for audit.
4. **Build** — `python3 factory/kit2/build.py factory/films/simpsons-3d --brand ceti-boardwalk-dark --chrome none --material ink`.
5. **Gate** — Trust shipped `gate.json` on the branch for proof; full re-gate may fail G11 until overlap is fixed.
6. **Export** — `arsenal/tools/export.mjs` with `--sel '#stage'`, `--query '?film=1'`, `--from 36 --to 58`, shard for wall time.
7. **Artifacts** — Copy MP4s to `/opt/cursor/artifacts/ga-proof-{baseline,evolved,window}.mp4`; document sizes in `PROOF.md`.

## PR

Post artifact names on PR #8 after push so reviewers can download the clips without building WebGL locally.
