#!/bin/sh
# build.sh <shared|native|all> — inline escapement.kit.js before the film (build.py --kit),
# embed Barlow / Barlow Semi Condensed / IBM Plex Mono (WOFF), write build/<id>.html + .artifact.html.
set -e
HERE=$(cd "$(dirname "$0")" && pwd); ROOT="${CETI_ROOT:-$HERE/../..}"; RT="$ROOT/runtime/tools"; F="$ROOT/vendor/fonts"
mkdir -p "$HERE/build/src"
one() {
  python3 "$RT/build.py" "$HERE/$1.film.js" --kit "$HERE/escapement.kit.js" --out "$HERE/build" --fonts \
    "Barlow=$F/barlow-latin-300-normal.woff:300" "Barlow=$F/barlow-latin-400-normal.woff:400" \
    "Barlow=$F/barlow-latin-500-normal.woff:500" "Barlow=$F/barlow-latin-600-normal.woff:600" \
    "Barlow Semi Condensed=$F/barlow-semi-condensed-latin-500-normal.woff:500" \
    "Barlow Semi Condensed=$F/barlow-semi-condensed-latin-600-normal.woff:600" \
    "IBM Plex Mono=$F/ibm-plex-mono-latin-400-normal.woff:400" "IBM Plex Mono=$F/ibm-plex-mono-latin-500-normal.woff:500" | grep -E '"(id|html_kb)"'
}
case "$1" in all) one shared; one native;; *) one "$1";; esac
