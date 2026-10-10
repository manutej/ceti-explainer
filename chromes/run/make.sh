#!/bin/sh
# make.sh <shared|native>... — build with runtime/build.py --kit run.kit.js (Jost embedded from _npm).
set -e
D=$(cd "$(dirname "$0")" && pwd); ROOT="${CETI_ROOT:-$D/../..}"; RT="$ROOT/runtime/tools"; J="$D/_npm/node_modules/@fontsource/jost/files"
[ -d "$J" ] || J="$ROOT/vendor/fonts"   # the four Jost files are vendored
for n in "$@"; do
  python3 "$RT/build.py" "$D/$n.film.js" --kit "$D/run.kit.js" --out "$D/build" \
    --fonts "Jost=$J/jost-latin-400-normal.woff2:400" "Jost=$J/jost-latin-500-normal.woff2:500" "Jost=$J/jost-latin-600-normal.woff2:600" "Jost=$J/jost-latin-700-normal.woff2:700" | grep -E '"(id|html_kb)"'
done
