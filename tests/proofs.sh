#!/bin/sh
# tests/proofs.sh — the six "builds from the repo" proofs of the merge (MERGE-NOTES.md). Run from anywhere:
#   sh tests/proofs.sh [i|ii|iii|iv|v|vi|vii|all]   (default all; exit 1 on the first failure)
# Needs: Python 3.10+ with scripts/requirements.txt, Node 18+, a Playwright Chromium (proof i; set PLAYWRIGHT_BROWSERS_PATH).
set -e
ROOT=$(cd "$(dirname "$0")/.." && pwd); cd "$ROOT"
STEP=${1:-all}
run() { [ "$STEP" = all ] || [ "$STEP" = "$1" ]; }
if run i; then
  echo "== (i) escapement-shared: build + gate"
  sh chromes/escapement/build.sh shared
  python3 runtime/tools/gate.py chromes/escapement/build/escapement-shared.html --json chromes/escapement/out/escapement-shared.gate.json
fi
if run ii; then
  echo "== (ii) grasp: operad check + build (stitch)"
  node library/operad/check.mjs films/grasp/grasp.graph.json --material stitch
  python3 library/tools/build_film.py films/grasp/grasp.graph.json stitch --id grasp-stitch \
    --title "What an AI agent actually does - Grasp in stitch" --out films/grasp/build --no-check | grep -E '"(id|html|html_kb)"'
fi
if run iii; then
  echo "== (iii) base-rate: plan lint + build"
  python3 library/plan/core/build_plan.py films/base-rate/plan.json
fi
if run iv; then
  echo "== (iv) SVG episode gate + System 1 module tests + node tests"
  node skills/ceti-explainer/assets/gate.mjs skills/ceti-explainer/reference/self-attention.js
  for t in library/plan/modules/*/test.mjs; do node "$t" | tail -1; done
  node --test tests/node/*.test.mjs | grep -E '^# (pass|fail)'
fi
if run v; then
  echo "== (v) opera-house: rebuild byte-identical to the page as uploaded"
  python3 films/opera-house/build.py --check
fi
if run vi; then
  echo "== (vi) factory: build every film, gate it, check the catalogue hashes"
  for d in factory/films/*/; do
    id=$(basename "$d")
    [ -f "$d/film.json" ] && [ -f "$d/film.js" ] && [ -f "$d/claims.json" ] || continue
    look=$(python3 -c "import json,sys;l=json.load(open(sys.argv[1])).get('look');print(l['brand']+' '+l['chrome'] if l else '')" "$d/film.json")
    if [ -n "$look" ]; then
      # kit2 film: film.json.look records brand and chrome; page is build/<id>.<brand>.<chrome>.html
      set -- $look; brand=$1; chrome=$2
      pack="$brand"; [ -f "$d/brand.$brand.json" ] && pack="$d/brand.$brand.json"   # a film-local pack copy wins
      python3 factory/kit2/build.py "$d" --brand "$pack" --chrome "$chrome" | tail -1
      page="$d/build/$id.$brand.$chrome.html"; kitargs="--kit factory/kit2"
    else
      python3 factory/kit/build.py "$d" | tail -1
      page="$d/build/$id.html"; kitargs="--kit factory/kit/kit.js --kit factory/kit/player.js"
    fi
    [ -f "$d/gate.json" ] || { echo "   $id: no gate.json yet, gate skipped"; continue; }
    node factory/tools/gate.mjs "$page" --film "$d" $kitargs \
      --json "$d/build/$id.gate.json" --quick > "$d/build/$id.gate.log" 2>&1 \
      || { grep -E 'FAIL|VERDICT|Error' "$d/build/$id.gate.log"; echo "   $id: gate FAIL"; exit 1; }
    grep -E '^ *VERDICT' "$d/build/$id.gate.log" | sed "s/^ */   $id: /"
  done
  python3 factory/tools/catalogue.py --check
fi
if run vii; then
  echo "== (vii) arsenal: brand packs pass contrast; every demo shoots clean with identical re-seek"
  for b in arsenal/brands/*.json; do [ "$(basename $b)" = schema.json ] && continue; python3 arsenal/tools/brand_check.py "$b" | tail -1; done
  for d in arsenal/patterns/*/demo.html arsenal/materials/*/demo.html; do
    node arsenal/tools/shoot.mjs "$d" --out /tmp/arsenal-shoot/$(basename $(dirname $d)) --times 0,0.5 | grep -q '"errors":0' || { echo "FAIL $d"; exit 1; }
  done
  echo "arsenal demos: OK"
fi
echo "== proofs: OK"
