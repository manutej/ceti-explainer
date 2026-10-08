#!/bin/sh
# tests/proofs.sh — the four "builds from the repo" proofs of the merge (MERGE-NOTES.md). Run from anywhere:
#   sh tests/proofs.sh [i|ii|iii|iv|all]      (default all; exit 1 on the first failure)
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
echo "== proofs: OK"
