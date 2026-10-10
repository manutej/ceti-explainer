#!/bin/sh
# lib/*.js -> film.js (lib/assemble.py) -> page (run from anywhere).
# film.json is the source (edited in place by rounds 1-2 and tier 2): build.sh NEVER regenerates it. lib/mkfilm.py only checks it here
# (knobs used by film.src.js vs film.json); `lib/mkfilm.py --regenerate` would rewrite it from stale tables: do not.
set -e
D=$(cd "$(dirname "$0")" && pwd)
python3 -I "$D/lib/mkfilm.py" && python3 -I "$D/lib/assemble.py" && node --check "$D/film.js" && cd "$D/../../.." && python3 factory/kit2/build.py factory/films/noether-applied --brand ceti-coastal-dark --chrome none --material ink | grep -v "^note"
