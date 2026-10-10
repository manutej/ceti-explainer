#!/bin/sh
# make.sh <shared|native> — build a film with delta.kit.js inlined before it (build.py --kit) and the map fonts.
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
ROOT=${CETI_ROOT:-$HERE/../..}; RT=$ROOT/runtime/tools
F=$HERE/_npm/node_modules/@fontsource
NAME=${1:-shared}
python3 "$RT/build.py" "$HERE/$NAME.film.js" --kit "$HERE/delta.kit.js" --out "$HERE/build" --fonts \
  "Cormorant Garamond=$F/cormorant-garamond/files/cormorant-garamond-latin-500-italic.woff2:500:italic" \
  "Cormorant Garamond=$F/cormorant-garamond/files/cormorant-garamond-latin-600-italic.woff2:600:italic" \
  "IBM Plex Sans Condensed=$F/ibm-plex-sans-condensed/files/ibm-plex-sans-condensed-latin-500-normal.woff2:500" \
  "IBM Plex Sans Condensed=$F/ibm-plex-sans-condensed/files/ibm-plex-sans-condensed-latin-400-normal.woff2:400" \
  "IBM Plex Mono=$F/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2:500" | grep -E '"(id|html_kb)"'
