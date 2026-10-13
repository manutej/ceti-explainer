#!/bin/sh
# make.sh <shared|native|all> — build film(s) with the kit and the three faces (WOFF via build.py).
set -e
HERE=$(cd "$(dirname "$0")" && pwd); ROOT="${CETI_ROOT:-$HERE/../..}"; RT="$ROOT/runtime/tools"; F="$HERE/_npm/node_modules/@fontsource"
one() {
  python3 "$RT/build.py" "$HERE/$1.film.js" --kit "$HERE/bunraku.kit.js" --out "$HERE/build" --fonts \
    "Bodoni Moda=$F/bodoni-moda/files/bodoni-moda-latin-800-normal.woff:800" \
    "Instrument Sans=$F/instrument-sans/files/instrument-sans-latin-400-normal.woff:400" \
    "Instrument Sans=$F/instrument-sans/files/instrument-sans-latin-600-normal.woff:600" \
    "Gloock=$F/gloock/files/gloock-latin-400-normal.woff:400" | grep -E '"(id|html_kb)"'
}
case "$1" in all) one shared; one native;; *) one "$1";; esac
