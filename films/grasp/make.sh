#!/bin/sh
# films/grasp/make.sh — build the two proof films from ONE beat graph, gate them, render contact sheets (--workers 1).
#   sh films/grasp/make.sh [build|gate|sheet|all]   (default all)
set -e
D=$(cd "$(dirname "$0")" && pwd); ROOT="${CETI_ROOT:-$D/../..}"; M="$ROOT/library"; RT="$ROOT/runtime/tools"
STEP=${1:-all}
T1="What an AI agent actually does - Grasp in stitch"; T2="What an AI agent actually does - Grasp on the light table"
STILLS="6,13,19,25,33,41,47,53,58,66,71,76,82,86,92,96,104,112,117"
if [ "$STEP" = build ] || [ "$STEP" = all ]; then
  python3 "$M/tools/build_film.py" "$D/grasp.graph.json" stitch --id grasp-stitch --title "$T1" --out "$D/build" | grep -E '"(id|html_kb)"' || true
  python3 "$M/tools/build_film.py" "$D/grasp.graph.json" plate --id grasp-plate --title "$T2" --out "$D/build" | grep -E '"(id|html_kb)"' || true
fi
mkdir -p "$D/out"
if [ "$STEP" = gate ] || [ "$STEP" = all ]; then
  for f in grasp-stitch grasp-plate; do python3 "$RT/gate.py" "$D/build/$f.html" --json "$D/out/$f.gate.json" || true; done
fi
if [ "$STEP" = sheet ] || [ "$STEP" = all ]; then
  for f in grasp-stitch grasp-plate; do python3 "$RT/render.py" "$D/build/$f.html" --out "$D/out/$f-stills" --stills "$STILLS" --workers 1 --sheet "$D/out/$f.sheet.jpg" | tail -2; done
fi
