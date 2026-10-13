#!/bin/sh
# lib -> film.json + film.js -> page (run from the repo root or anywhere)
set -e
D=$(cd "$(dirname "$0")/.." && pwd)
python3 "$D/lib/mkfilm.py" && python3 "$D/lib/assemble.py" && cd "$D/../../../../.." && python3 factory/kit2/build.py factory/films/who-gains/drafts/a --brand ceti-neosage-dark --chrome none | grep -v "^note"
