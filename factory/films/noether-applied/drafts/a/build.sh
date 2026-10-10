#!/bin/sh
# lib/*.js -> film.js (lib/assemble.py) -> page (run from anywhere). lib/mkfilm.py writes film.json from its knob table; lib/mkdata.py writes lib/data.js.
set -e
D=$(cd "$(dirname "$0")" && pwd)
python3 -I "$D/lib/mkfilm.py" && python3 -I "$D/lib/assemble.py" && node --check "$D/film.js" && cd "$D/../../../../.." && python3 factory/kit2/build.py factory/films/noether-applied/drafts/a --brand ceti-coastal-dark --chrome none --material ink | grep -v "^note"
