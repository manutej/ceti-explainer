# Workflow · GA storyboard reward ↔ factory pipeline

How the pilot in `factory/tools/evolve_sequence.py` maps onto the explainer factory and Atelier seats.

## 1 · GA pipeline (bounded clock window)

```mermaid
flowchart LR
  subgraph inputs
    B[brief / beats / findings]
    F[film.json knobs + captions]
    G0[shipped gate.json + seat.json]
  end

  subgraph genotype
    W[window t0,t1]
    GN[sequence genome v0]
    K[timing knob genes]
    W --> GN
    F --> K
    K --> GN
  end

  subgraph evaluate["evaluate (--evaluate)"]
    M[mutate / crossover]
    A[apply genome → film.json]
    BD[kit2 build.py]
    GT[gate.mjs]
    FT[fitness_from_gate]
    M --> A --> BD --> GT --> FT
  end

  subgraph dry["dry-run (default)"]
    M2[mutate / crossover]
    FT2[fitness vs shipped gate.json]
    M2 --> FT2
  end

  B --> F
  G0 --> FT2
  GN --> M
  GN --> M2
  FT --> EL[elite + children]
  FT2 --> EL
  EL --> OUT[best.genome.json · history.json · recipe.json]
```

**Fitness terms** (see `docs/GA-STORYBOARD-REWARD.md`):

- Weighted gate rows (FAIL → −∞; WARN → half credit).
- Anchor penalty on knob drift from shipped baseline.
- Findings alignment (knob time vs caption beat).
- Optional seat.json craft / truth / defects.

## 2 · Factory worker mapping (who does what)

```mermaid
flowchart TB
  subgraph human_atelier["Atelier seats (human / Opus)"]
    BR[atelier-brief · brief.md claims]
    DR[atelier-draft · film.js + knobs]
    SL[atelier-select · frames strips]
    AP[apply_findings.py · film.json only]
  end

  subgraph automated["GA pilot (automated)"]
    EV[evolve_sequence.py]
    SC[score · no build]
    EG[evolve · dry-run or --evaluate]
  end

  subgraph factory_tools["Existing factory tools"]
    K2[kit2/build.py]
    GA[gate.mjs G1–G12]
    FR[frames.mjs contact strips]
    CAT[catalogue.py ship]
  end

  BR --> DR
  DR --> K2
  K2 --> GA
  GA --> FR
  FR --> SL
  SL --> AP
  AP --> DR

  DR --> EV
  EV --> SC
  EV --> EG
  EG --> K2
  EG --> GA
  GA --> EV

  GA --> CAT
  AP --> CAT
```

| Atelier / factory step | GA pilot analogue |
|------------------------|-------------------|
| Draft knobs in `film.json` | Genotype `genes.knobs` |
| Blind select on strips | Fitness replaces pairwise preference (gate + seat + alignment) |
| `apply_findings.py` | Findings-aggregate seed genome + alignment penalty |
| Two tool-applied rounds | `--generations` / `--population` (offline; ship still via findings + NOTES) |
| Gate before ship | `--evaluate` runs full gate per individual |
| Seat.json | Soft term in fitness (not a hard gate) |

## 3 · Recommended proof commands (copy-paste)

```sh
# Baseline score only
python3 factory/tools/evolve_sequence.py score factory/films/simpsons-3d --window 36,58

# Fast GA logic check
python3 factory/tools/evolve_sequence.py evolve factory/films/simpsons-3d \
  --window 36,58 --population 4 --generations 2 --dry-run

# Full loop (WebGL ~2 min on this VM)
python3 factory/tools/evolve_sequence.py evolve factory/films/simpsons-3d \
  --window 36,58 --population 4 --generations 2 --evaluate

# Full loop (2D ledger ~30 s)
python3 factory/tools/evolve_sequence.py evolve factory/films/goodhart/drafts/ledger \
  --window 36,58 --population 4 --generations 2 --evaluate
```

Outputs land in `<film-dir>/evolve/`; this proof copies the simpsons artifacts into `docs/proofs/ga-storyboard-reward/`.
