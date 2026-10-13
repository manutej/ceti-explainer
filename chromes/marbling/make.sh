#!/bin/sh
# make.sh <shared|native>... — build each film with the marbling kit + recipes and the three faces it uses.
set -e
D=$(cd "$(dirname "$0")" && pwd); ROOT="${CETI_ROOT:-$D/../..}"; RT="$ROOT/runtime/tools"; F="$D/_npm/node_modules/@fontsource"
for n in "$@"; do
  python3 "$RT/build.py" "$D/$n.film.js" --out "$D/build" --kit "$D/marbling.kit.js" "$D/marbling.patterns.js" \
    --fonts "IM Fell English=$F/im-fell-english/files/im-fell-english-latin-400-normal.woff:400" \
            "IM Fell English=$F/im-fell-english/files/im-fell-english-latin-400-italic.woff:400:italic" \
            "Alegreya Sans=$F/alegreya-sans/files/alegreya-sans-latin-400-normal.woff:400" \
            "Alegreya Sans=$F/alegreya-sans/files/alegreya-sans-latin-500-normal.woff:500" \
            "DM Mono=$F/dm-mono/files/dm-mono-latin-400-normal.woff:400" \
            "DM Mono=$F/dm-mono/files/dm-mono-latin-500-normal.woff:500"
done
