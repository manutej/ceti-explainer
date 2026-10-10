#!/bin/sh
# film.js -> page. Run from anywhere: sh factory/films/noether-frontier/lib/build.sh
# Tier-2 revision (2026-10-10): film.json is now the SOURCE (rounds 1-2 and the tier-2 revision edited it in place), so this build
# no longer runs lib/mkfilm.py (which would overwrite film.json with draft A's defaults); mkfilm.py itself refuses to run.
set -e
D=$(cd "$(dirname "$0")/.." && pwd)
python3 "$D/lib/assemble.py" && node --check "$D/film.js" && cd "$D/../../.." && python3 factory/kit2/build.py factory/films/noether-frontier --brand ceti-coastal-dark --chrome none --material ink | grep -v "^note"
