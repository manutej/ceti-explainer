# P0: Phase 0 proof, run in this container (2026-10-08)

Goal: show that every system rebuilds and gates from sources alone, with the files that were missing from the uploads recovered.

## Recovered files (from the built pages, byte-exact)
- `vendor/p5-2.3.4.min.js`: 990,638 bytes, sha256 `bb8b82b97fcbcd5bb2d5475d1b6a3904f3ab4ed01b821134fd8f1e7710fce559`, header `r="2.3.4"`. Taken from `<script data-atelier="p5">` (line 3 of any Atelier film page). Reproducible from the npm package `p5@2.3.4/lib/p5.min.js`.
- `runtime/studio.js` (ceti-p5-studio runtime v0.2.0, 454 lines): from `base-rate.p5.html` lines 660–1113. Loads in node; exports `Studio.{VERSION, seg, ramp, params, stream, poissonDisc, palette, presets, rgb, hex, withAlpha, ease, clock, harness, frameDone, live, host, filename, svg, rdp, fft, stft, gestures, a11y, begin}`.
- `skills/p5-explainer/assets/scene-kit.js` (315 lines): from `base-rate.p5.html` lines 1515–1829.

## Staging layout used (scratchpad/stage/, mirrors the original plugin root)
```
stage/
  vendor/p5-2.3.4.min.js
  runtime/studio.js  scene-kit.js
  skills/p5-explainer/assets/   (bridge.js, feature-engine.js, feature.template.html, build_film.py, build_feature.py, scene-kit.js, fonts/*.woff2, ce/)
  skills/p5-explainer/library/  (System 1: core/, modules/, channels/, films/base-rate/, research/, *.md)
  atelier/runtime/   (atelier.js, build.py, gate.py, render.py, README.md, examples/)
  atelier/modules/   (AM library)
  atelier/chromes/   (8 directions)
```
build.py resolves STUDIO as `../..` from `atelier/runtime/`, so the plugin root must hold `vendor/` and `skills/p5-explainer/assets/fonts/`.

## Dependencies installed
- `pip install fonttools brotli pillow playwright==1.56.0` (Playwright 1.56.x matches the Chromium 1194 build under `/opt/pw-browsers`; 1.63 wanted build 1243 and failed to launch). `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`.
- ffmpeg present at `/usr/bin/ffmpeg`. Node 22.

## Results
1. `sh atelier/chromes/escapement/build.sh shared` → `escapement-shared.html` 1,512,958 bytes; shipped build 1,512,955. The only diff is one word in the runtime readout (`exact` → `expected`), which the runtime zip already carries (fix F3). `.artifact.html` 522,206 bytes (CDN p5).
2. `python3 atelier/runtime/gate.py build/escapement-shared.html` → VERDICT PASS, 10/10 rows: LOAD live 2.9 s boot; LAYOUT 400px; PURE-REP; PURE-ORD; CLOCK; META 4 rows; ENGINE worst |z| 2.39; CAPTIONS 7 ≤ 88 chars; AUDIO 145 events → 34.30 s WAV; LOAD film webgl 960×540.
3. `node atelier/modules/check.mjs demo/grasp.graph.json --material stitch` → PASS (0 hard, 0 soft, 1 waived MAX), identical to the shipped `grasp.check.txt`.
4. `python3 atelier/modules/tools/build_film.py demo/grasp.graph.json stitch …` → `grasp-stitch.html` 1,457,168 bytes vs shipped 1,457,165; same one-word runtime diff.
5. `python3 skills/p5-explainer/library/core/build_plan.py films/base-rate/plan.json` → lint PASS (L1–L13 + p5 budget), `base-rate.p5.html` 1,491,673 bytes. Differs from the shipped 1,478,585-byte page only in the page template (mastheader grid and a `.variant` chip style), i.e. the uploaded page was built with an older `feature.template.html`. Functionally the same film.
6. Node-level checks already run by readers: all six System 1 module `test.mjs` PASS; `node core/lint_plan.mjs films/base-rate/plan.json` PASS; AM negative lint cases reproduce their FAILs; `check.mjs --export` reproduces `operad.json`.

## Not yet run here
- `render.py --stills/--mp4` (frames and MP4) for any film; `channels.py` for base-rate; `gate.py` on the grasp films (shipped gate json says PASS 10/10).
