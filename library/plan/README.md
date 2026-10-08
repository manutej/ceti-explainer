# Explainer-module library

Plans in, film pages out. `BUILD-SPEC.md` is the contract; `MODULE-OPERAD.md` the catalogue; `METHOD.md` the laws.

    python3 core/build_plan.py modules/<name>/demo.json --all          # → modules/<name>/build/demo-<i>.html
    python3 core/build_plan.py <film.plan.json> [--variant p5|svg]    # → <dir>/build/<id>.<variant>.html
    node core/lint_plan.mjs <plan|demo.json> [--demo i] [--json]       # L1–L13 + p5 budget
    node modules/<name>/test.mjs                                       # both demos lint + phase invariants
    python3 ../../../scripts/film_render.py <page.html> --stills 3,9 --workers 2   # ?film=1, unchanged

Combinators (`commit-predict-reveal`, `trap-and-correct`, `contrast-split`) take module specs in their slots
(`inner` / `right`) and are expanded by `Film.compile` into ordinary definitions (core/wrap.js: nested phases, the
inner's clock, sub-contexts via `ctx.sub`). `core/gates.js` makes the live page wait for a CPR commit.
Channels: `python3 channels/channels.py <plan.json> --channel reel|carousel|linkedin-pdf|linkedin-video|blog|newsletter|all`
— one plan → IG reel (9:16), IG carousel (4:5), LinkedIn PDF + video (4:5), blog (16:9 + OG), email (600 px); every
module re-composes at 9:16 · 4:5 · 1:1 (core/layout.js, `build_plan.py --aspect`); frames.json + qa.json. See channels/README.md.
Films: `films/base-rate/plan.json` (Kahneman ch. 16, 2:04, Field Notebook) — built only from library modules.

core/: module.js (registry) · compile.js (Film.compile: windows, PO hand-over, clock maps, FEATURE, p5 layers) ·
clock.js · wrap.js · gates.js · roles.js (variable → role → token; dark | notebook) · scene-kit.js (LibKit over assets/scene-kit.js) ·
po/{po,track,grid,axis,chain}.js · lint_plan.mjs · build_plan.py · test_module.mjs.
Pages: the unchanged feature engine/template/bridge; `?film=1` for the workers, `?chrome=dark|notebook` to toggle.
