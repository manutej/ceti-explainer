#!/bin/sh
# lib/*.js -> film.js (lib/assemble.py) -> page (run from anywhere).
# film.json and claims.json are the source of truth (v2 edited them in place; see REVISION-v2.md). lib/mkfilm.py is history (it would
# revert film.json). lib/mkdata.py is current: run it after recompute.py --write to rebuild lib/data.js (v2: 100 runs x 100 steps).
set -e
D=$(cd "$(dirname "$0")" && pwd)
python3 "$D/lib/assemble.py" && node --check "$D/film.js" && cd "$D/../../.." && python3 factory/kit2/build.py factory/films/noether-symmetry --brand ceti-coastal-dark --chrome none | grep -v "^note"
