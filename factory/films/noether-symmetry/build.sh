#!/bin/sh
# lib/*.js -> film.js (lib/assemble.py) -> page (run from anywhere).
# film.json and claims.json are the source of truth: they carry the tier-1 rounds (apply_findings r1, r2) and the tier-2
# revision. lib/mkfilm.py and lib/mkdata.py are the drafter's history; running them would revert film.json, so this script does not.
set -e
D=$(cd "$(dirname "$0")" && pwd)
python3 "$D/lib/assemble.py" && node --check "$D/film.js" && cd "$D/../../.." && python3 factory/kit2/build.py factory/films/noether-symmetry --brand ceti-coastal-dark --chrome none | grep -v "^note"
