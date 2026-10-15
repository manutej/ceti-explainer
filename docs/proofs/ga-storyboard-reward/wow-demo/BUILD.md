# WOW demo · goodhart ledger COUNT window

Rebuild the two sandbox pages and export 1080p clips (36–58 s).

## 1 · Apply genomes (build + gate)

```sh
export PATH="$HOME/.nvm/versions/node/v22.23.3/bin:$PATH"
ROOT=docs/proofs/ga-storyboard-reward/wow-demo

python3 - <<'PY'
import json, sys
sys.path.insert(0, "factory/tools")
import evolve_sequence as ev

ledger = "factory/films/goodhart/drafts/ledger"
for label in ("before", "after"):
    g = json.load(open(f"{ROOT}/{label}/genome.{'degraded' if label == 'before' else 'best'}.json"))
    out = f"{ROOT}/{label}"
    sc, det = ev.evaluate_genome(ledger, g, out, gate_quick=True)
    json.dump({"fitness": sc, "detail": det}, open(f"{out}/evaluate.json", "w"), indent=2)
    print(label, sc, det.get("gate_exit"))
PY
```

## 2 · Export MP4 (1080p, same window)

```sh
HTML_BEFORE="$ROOT/before/build/goodhart.ceti-dark.ledger.html"
HTML_AFTER="$ROOT/after/build/goodhart.ceti-dark.ledger.html"

node arsenal/tools/export.mjs "$HTML_BEFORE" \
  --sel '#stage' --query '?film=1' --viewport 1920x1080 --dsf 1 --fps 30 \
  --from 36 --to 58 --out /opt/cursor/artifacts --name ga-wow-goodhart-before

node arsenal/tools/export.mjs "$HTML_AFTER" \
  --sel '#stage' --query '?film=1' --viewport 1920x1080 --dsf 1 --fps 30 \
  --from 36 --to 58 --out /opt/cursor/artifacts --name ga-wow-goodhart-after
```

Artifacts (not committed): `/opt/cursor/artifacts/ga-wow-goodhart-before.mp4`, `ga-wow-goodhart-after.mp4`.

## 3 · Still frames (t ≈ 45 s)

```sh
mkdir -p /opt/cursor/artifacts/screenshots
ffmpeg -y -ss 9 -i /opt/cursor/artifacts/ga-wow-goodhart-before.mp4 -frames:v 1 \
  /opt/cursor/artifacts/screenshots/ga-wow-before.png
ffmpeg -y -ss 9 -i /opt/cursor/artifacts/ga-wow-goodhart-after.mp4 -frames:v 1 \
  /opt/cursor/artifacts/screenshots/ga-wow-after.png
```
