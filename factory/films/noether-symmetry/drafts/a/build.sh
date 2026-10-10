#!/bin/sh
# lib -> film.json + film.js -> page (run from anywhere)
set -e
D=$(cd "$(dirname "$0")" && pwd)
python3 -I "$D/lib/mkdata.py" >/dev/null && python3 "$D/lib/mkfilm.py" && python3 "$D/lib/assemble.py" && node --check "$D/film.js" && cd "$D/../../../../.." && python3 factory/kit2/build.py factory/films/noether-symmetry/drafts/a --brand ceti-coastal-dark --chrome none | grep -v "^note"
