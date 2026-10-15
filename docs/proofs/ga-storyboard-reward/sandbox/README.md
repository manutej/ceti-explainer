# Proof sandbox

| Dir | Role |
|---|---|
| `baseline/` | Shipped **simpsons-3d** sources + `build/simpsons-3d.ceti-boardwalk-dark.none.html` + committed `gate.json` |
| `evolved/` | Best genome from `factory/films/simpsons-3d/evolve/best.genome.json` (same knob values as baseline for this run) |

Regenerate evolved tree:

```sh
python3 -c "
import json, sys
sys.path.insert(0, 'factory/tools')
import evolve_sequence as ev
g = json.load(open('factory/films/simpsons-3d/evolve/best.genome.json'))
ev.evaluate_genome('factory/films/simpsons-3d', g, 'docs/proofs/ga-storyboard-reward/sandbox/evolved')
"
```
