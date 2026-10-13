#!/bin/sh
# make.sh <shared|native> … — build each film with the ledger kit and the two faces (Newsreader, IBM Plex Sans Condensed).
set -e
D=$(cd "$(dirname "$0")" && pwd); ROOT="${CETI_ROOT:-$D/../..}"; RT="$ROOT/runtime/tools"; F="$D/_npm/node_modules/@fontsource"
NR="$F/newsreader/files/newsreader-latin"; PX="$F/ibm-plex-sans-condensed/files/ibm-plex-sans-condensed-latin"
for n in "$@"; do
  python3 "$RT/build.py" "$D/$n.film.js" --kit "$D/ledger.kit.js" --out "$D/build" --fonts \
    "Newsreader=$NR-400-normal.woff2:400" "Newsreader=$NR-500-normal.woff2:500" "Newsreader=$NR-600-normal.woff2:600" \
    "Newsreader=$NR-400-italic.woff2:400:italic" \
    "IBM Plex Sans Condensed=$PX-400-normal.woff2:400" "IBM Plex Sans Condensed=$PX-500-normal.woff2:500" "IBM Plex Sans Condensed=$PX-600-normal.woff2:600" \
    | grep -E '"(id|html_kb)"'
done
