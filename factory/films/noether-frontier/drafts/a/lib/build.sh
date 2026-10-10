#!/bin/sh
# film.json -> film.js -> page. Run from anywhere: sh factory/films/noether-frontier/drafts/a/lib/build.sh
set -e
D=$(cd "$(dirname "$0")/.." && pwd)
python3 -I "$D/lib/mkfilm.py" && python3 "$D/lib/assemble.py" && node --check "$D/film.js" && cd "$D/../../../../.." && python3 factory/kit2/build.py factory/films/noether-frontier/drafts/a --brand ceti-coastal-dark --chrome none --material ink | grep -v "^note"
