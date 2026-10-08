#!/bin/sh
# scripts/doctor.sh — cold-start check for the explainer plugin. Exit 1 on the first hard failure.
#   sh scripts/doctor.sh            quick: tools, vendor hashes, kit smoke build
#   sh scripts/doctor.sh --full     also runs tests/proofs.sh all
set -e
ROOT=$(cd "$(dirname "$0")/.." && pwd); cd "$ROOT"
ok(){ printf '  ok    %s\n' "$1"; }; bad(){ printf '  FAIL  %s\n' "$1"; exit 1; }; warn(){ printf '  warn  %s\n' "$1"; }
echo "== doctor · $ROOT"
[ -f .claude-plugin/plugin.json ] && ok "plugin root (.claude-plugin/plugin.json)" || bad "not at the plugin root"
command -v node >/dev/null && ok "node $(node -v)" || bad "node missing"
command -v python3 >/dev/null && ok "python3 $(python3 -V 2>&1 | cut -d' ' -f2)" || bad "python3 missing"
command -v ffmpeg >/dev/null && ok "ffmpeg" || warn "ffmpeg missing (render.py and export.mjs need it)"
python3 -c "import fontTools, PIL" 2>/dev/null && ok "fontTools, Pillow" || bad "pip install -r scripts/requirements.txt"
PW=${PLAYWRIGHT_BROWSERS_PATH:-/opt/pw-browsers}
[ -d "$PW" ] && ok "playwright browsers at $PW" || warn "PLAYWRIGHT_BROWSERS_PATH not found; gate, shoot and render need a Chromium"
[ -f /opt/node-tools/node_modules/playwright/index.mjs ] && ok "node playwright at /opt/node-tools" || warn "node playwright not at /opt/node-tools (edit the import path in factory/tools and arsenal/tools)"
(cd vendor && sha256sum -c SHA256SUMS >/dev/null 2>&1) && ok "vendor hashes (p5 2.3.4, $(ls vendor/fonts/*.woff* | wc -l | tr -d ' ') font files)" || bad "vendor/SHA256SUMS mismatch"
python3 factory/kit/build.py factory/kit/smoke >/dev/null 2>&1 && ok "kit smoke film builds" || bad "factory/kit/build.py failed on the smoke film"
python3 factory/kit2/build.py factory/films/goodhart --brand ceti-dark --chrome none >/dev/null 2>&1 && ok "kit2 builds goodhart under ceti-dark/none" || warn "kit2 build failed (see factory/kit2/README.md)"
for b in arsenal/brands/*.json; do case "$b" in *schema.json) continue;; esac; python3 arsenal/tools/brand_check.py "$b" >/dev/null 2>&1 || bad "brand pack fails contrast: $b"; done; ok "brand packs pass contrast"
if [ "$1" = "--full" ]; then sh tests/proofs.sh all; fi
echo "== doctor: OK"
