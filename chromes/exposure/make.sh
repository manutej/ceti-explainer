#!/bin/sh
# make.sh <shared|native> — build one film with the exposure kit and its faces.
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
ROOT=${CETI_ROOT:-$HERE/../..}; RT=$ROOT/runtime/tools
F=$HERE/_npm/node_modules/@fontsource; SS=$F/sofia-sans-extra-condensed/files; RH=$F/red-hat-mono/files
[ -d "$F" ] || { SS=$ROOT/vendor/fonts; RH=$ROOT/vendor/fonts; }   # all five faces are vendored
NAME=${1:-shared}
python3 "$RT/build.py" "$HERE/$NAME.film.js" --kit "$HERE/exposure.kit.js" --out "$HERE/build" --fonts \
  "Sofia Sans Extra Condensed=$SS/sofia-sans-extra-condensed-latin-500-normal.woff2:500" \
  "Sofia Sans Extra Condensed=$SS/sofia-sans-extra-condensed-latin-600-normal.woff2:600" \
  "Sofia Sans Extra Condensed=$SS/sofia-sans-extra-condensed-latin-700-normal.woff2:700" \
  "Red Hat Mono=$RH/red-hat-mono-latin-400-normal.woff2:400" \
  "Red Hat Mono=$RH/red-hat-mono-latin-500-normal.woff2:500" | grep -E '"(id|html_kb)"'
