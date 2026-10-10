# arsenal/tools

All tools use the page hook `window.__film = { ready(), seek(t, variant?), info: { dur, variants? } }` (a synchronous
draw inside `seek`; time is set, never observed). Playwright comes from `/opt/node-tools`, Chromium from `/opt/pw-browsers`.

## shoot.mjs  (verify a demo)
`node arsenal/tools/shoot.mjs <demo.html> [--out dir] [--times 0,0.33,0.67,1] [--query brand=<id>]` (`--query` is appended to the page URL, e.g. to shoot a demo under another pack)
Renders every variant at fractions of `info.dur`, checks re-seek purity (canvas `toDataURL` identical after seeking
away and back), writes stills, `contact.png` (needs Pillow) and `report.json`. Exit 1 on any console error.

## export.mjs  (frame-stepped video)
`node arsenal/tools/export.mjs <demo.html> --variant v --fps 30 --out dir`
Options: `--sel canvas` (element to screenshot; use `#stage` for kit films), `--query "?film=1"`, `--viewport 960x540`,
`--dsf 2` (device scale factor; 960x540 x2 = 1920x1080 output), `--dur s` (override `info.dur`), `--gif-seconds 10`,
`--gif-width 480`, `--name base`.
Pipeline: for i in 0..N-1 seek(i/fps) and PNG-screenshot the element into `dir/frames/`; ffmpeg ->
`<name>.mp4` (libx264, yuv420p, crf 16, faststart) and `<name>.gif` (<= 10 s, 15 fps, palettegen/paletteuse);
ffprobe confirms the MP4 holds exactly N frames. Determinism check: three frames (10%, 50%, last) are re-rendered after
scrambling the page's time and their SHA-256 must equal the exported PNG's. Prints seconds per frame and totals,
writes `<name>.export.json`. Exit 1 if a hash differs, the frame count mismatches or the page logged an error.
For kit films (factory/kit, 1920x1080 stage, `?film=1`, no variants):
`node arsenal/tools/export.mjs factory/kit/smoke/build/kit-smoke.html --sel '#stage' --query '?film=1' --viewport 1920x1080 --dsf 1 --out dir`
No audio: mux separately ([[audio-post-mux]]); runtime/tools/render.py does that for factory films.

## brand_check.py  (validate a brand pack)
`python3 arsenal/tools/brand_check.py arsenal/brands/*.json [--emit-js out.js]`
Validates against `arsenal/brands/schema.json`, checks every type face exists in `vendor/fonts.lock.json`, applies
WCAG contrast gates (ink/bg 4.5, chalk/panel 4.5, accent/bg 3, muted/bg 3). Exit 1 on failure.

## core/generator.js  (authoring, not a tool)
`ARSENAL.generator.scene(function*(s){ yield* tween(...); yield wait(s); yield* all(...) }, {init, dur})` compiles once
to absolute intervals; `scene.at(t)` is a binary-search lookup. See arsenal/patterns/generator/card.md.
