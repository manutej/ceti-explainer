#!/bin/sh
# final pass: gates, contact sheets, MP4s (sequential; the machine is shared)
cd "$(dirname "$0")/.." || exit 1
R=${CETI_ROOT:-../..}/runtime/tools
python3 $R/gate.py build/margin-shared.html --json out/margin-shared.gate.json > out/gate-shared.log 2>&1
python3 $R/gate.py build/margin-native.html --json out/margin-native.gate.json > out/gate-native.log 2>&1
python3 $R/render.py build/margin-shared.html --out out/margin-shared-stills --stills 1.0,3.7,8.6,12.2,15.6,17.6,26.0,28.9,31.4,34.4 --workers 1 --sheet out/margin-shared.sheet.jpg > out/sheet-shared.log 2>&1
python3 $R/render.py build/margin-native.html --out out/margin-native-stills --stills 1.5,4.6,7.6,11.6,15.4,16.6,19.4,23.4,26.4,29.9 --workers 1 --sheet out/margin-native.sheet.jpg > out/sheet-native.log 2>&1
python3 $R/render.py build/margin-shared.html --out ${TMPDIR:-/tmp}/margin-shared-frames --workers 2 --mp4 out/margin-shared.mp4 > out/mp4-shared.log 2>&1
python3 $R/render.py build/margin-native.html --out ${TMPDIR:-/tmp}/margin-native-frames --workers 2 --mp4 out/margin-native.mp4 > out/mp4-native.log 2>&1
echo DONE > out/final.done
