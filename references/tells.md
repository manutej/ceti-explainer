# Tells — lesson atoms, read at the start of every critique ("attack these first")

One row per lesson. Class = the failure family; Attack = the cheapest check that finds it; Caught by = the
rule id that now catches it automatically (or "seat" if only a judge can). Append; never delete — mark
superseded rows instead.

| # | Date | Class | Tell | Attack that found it | Caught by |
|---|---|---|---|---|---|
| 1 | 2026-10-05 | version | p5 2.3.4 dies before `setup()` with "Missing initializer in const declaration" when the page lacks `<meta charset="utf-8">` (Greek identifiers in the bundled colorjs.io) | bisection in headless Chromium | CON-UTF8 |
| 2 | 2026-10-05 | version | Docs on GitHub `main` describe `instances()`, `transform3D()`, p5.svg — none ship in 2.3.4 | grep the installed build, not the repo | API-MAIN-ONLY |
| 3 | 2026-10-05 | version | 2.0 release notes say `RGBHDR`/`P2DHDR`/`linesMode`; 2.3.4 ships `RGBP3`/`P2DP3`/`strokeMode` | runtime enumeration of constants | API-HDR, API-LINESMODE |
| 4 | 2026-10-05 | strands | p5.strands callbacks are re-compiled with `new Function`: closures over locals vanish (`ReferenceError`) | run a strands shader that reads a local | seat (craft) — pass `{ scope }` |
| 5 | 2026-10-05 | strands | GLSL hook `getFinalColor` takes `(vec4 color, vec2 texCoord)` in 2.3.4; the 1-arg tutorial form fails to compile and setup hangs | `inspectHooks()` | render FAIL (timeout + pageerror) |
| 6 | 2026-10-05 | sound | p5.sound 0.4.x `analyze()` returns 0–1 with tiny peaks (~0.011), FFT defaults to 32 bins and hears only what is `connect()`ed — old tutorial code looks silent | oscillator → FFT smoke test | seat (craft) |
| 7 | 2026-10-05 | export | p5.js-svg 1.6.0 throws on `createCanvas(…, SVG)` under 2.x | render the library's own example | use `Studio.svg` |
| 8 | 2026-10-05 | harness | Inlined libraries (p5 itself) contain the string `</body>`; a naive `replace('</body>')` injects UI *inside* the library | ship with `--inline-p5`, render | ship.py uses the LAST `</body>` |
| 9 | 2026-10-05 | harness | A JS comment containing `</script>` terminates an inline script block | ship + render | ship.py escapes `</script` |
| 10 | 2026-10-05 | aesthetic | A lint-clean, deterministic, palette-disciplined sketch can still be oatmeal (even Poisson dots: every seed "different", none distinct) | coarse-structure metric over a seed sweep | MET-texture-only, batch OATMEAL |
| 11 | 2026-10-05 | agent | Models collapse to ~5 techniques regardless of prompt; individual outputs look original, the set does not | judge the batch, not the piece | cliché seat over the batch; divergence step |
| 12 | 2026-10-05 | judging | VLM judges score badly but rank well; off-the-shelf aesthetic scorers penalise long-tail originality | pairwise with swap; never LAION-aes as a judge | eval-stack.md |
| 13 | 2026-10-05 | judging | The coarse-structure (oatmeal) metric is scale-dependent: the same scatter rendered at half size with fixed-pixel element sizes reads as "structured" (0.28 → 0.40+). A tile-permutation null did not separate flow fields from scatter either. Oatmeal is a perceptual, population-level judgement | render the calibration twin at two sizes | metric is a prior only; the cliché seat over the batch is authoritative |
| 14 | 2026-10-05 | judging | One shared manifest leaked each piece's intent line to seats that must describe pixels first (colour, composition, wonder said so) | ask each seat what it saw before describing | scripts/seat_packets.py (per-seat packets; intents only after describing) |
| 15 | 2026-10-05 | studio | 8 pieces each passed their own gate, yet the set collapsed into one house look (cream ground 6/8, hairline ink, one vermilion accent 4/8, fixed layouts) | run the cliché seat over the batch; compare grounds/accents across pieces | scripts/series.py HOUSE-LOOK + references/studio-habits.md |
| 16 | 2026-10-05 | gate | `--intent` invariants were keyword-matched, never checked; a piece broke its own negative-space band and passed | builders read gate.py | gate.py --inv metric:lo:hi, --zone, window.__meta.invariants → FAIL |
| 17 | 2026-10-05 | metrics | Sparse line art (95% blank) was reported as 'texture-only' and the edit table prescribed Silence — the opposite fix | builder notes (3 pieces) | MET-sparse-flat (edit: Graft a mass) |
| 18 | 2026-10-05 | runtime | A loop/interactive piece built from the template never played live (frames=1 + frameDone stopped it); clock.tick() under __renderFrame was off by one | play the shipped file | studio.js 0.2: render-only stop, Studio.live, clock hold |
| 19 | 2026-10-05 | lint | `p.push()` (matrix stack) matched the unbounded-array rule — every instance-mode sketch got a false P1 | lint the gallery | PERF-UNBOUNDED excludes p.push()/push() |
| 20 | 2026-10-05 | craft | Frame export rebuilt the scene from random streams that had already advanced, so every video frame showed a different field from the still | render frame 0 and compare to the still | seat (craft) — build scene once; frames only advance the clock |
| 21 | 2026-10-05 | typography | `font.textToContours` ignores a fontSize option and uses the current textSize() | probe with two sizes | references/p5/snippets.md note |
| 22 | 2026-10-07 | version | p5 2.3.4 `loadFont` rejects woff2; fonts must be converted to WOFF (atelier build.py does it; needs `pip install brotli`) | load a woff2 in headless | atelier/runtime/build.py |
| 23 | 2026-10-07 | typography | p5.Font text (WEBGL, textContours) has no glyph fallback: U+2007 figure space renders as tofu | render tabular numbers in WEBGL | `Atelier.U.tabular(…, {pad:' '})` |
| 24 | 2026-10-08 | perf | Headless Chromium with SwiftShader GPU-rasterises the 2D canvas: heavy path work costs 3–9 s/frame at capture | profile seek vs capture | render.py `--disable-accelerated-2d-canvas`; willReadFrequently offscreen + one blit |
| 25 | 2026-10-08 | webgl | `baseMaterialShader` ≈25 s/frame on SwiftShader; custom GLSL 300 es ≈0.6 s | time one frame | seat (craft) |
| 26 | 2026-10-08 | webgl | p5 owns uniform `uTint` (reset to white every draw); p5.Image premultiplies alpha so data texels with α<255 lose bytes | debug a data texture | seat (craft) |
| 27 | 2026-10-08 | runtime | A live readout of engine numbers spoils predict-commit-reveal | builder report | atelier.js renderMeta hides until committed |
| 28 | 2026-10-08 | webgl | SwiftShader executes every branch: one big shader with early returns cost 5.5 CPU-s/frame; split into small shaders | profile per-shader | seat (craft) |
| 29 | 2026-10-08 | webgl | `dFdx` after `discard` is non-deterministic (broke purity); p5 Framebuffer sampled at gl_FragCoord needs y flipped; `updatePixels` on FLOAT framebuffers resamples | purity gate | seat (craft) |
| 30 | 2026-10-08 | p5 | Calling `drawingContext.save()/clip()` directly in draw desyncs p5's cached stroke state; clip inside p.push()/p.pop() | rims turned black | seat (craft) |
| 31 | 2026-10-08 | harness | render.py waited on workers with no timeout; a stalled SwiftShader worker hung the render | builder report | render.py watchdog + rescue passes |
| 32 | 2026-10-08 | harness | build.py --kit read id/title from the first match in kit+film | builder report | build.py id_src |
| 33 | 2026-10-08 | runtime | Atelier `score(ctx)` and `meta(ctx)` run BEFORE `setup()`; a film that computed its timeline in setup shipped a silent WAV and empty meta | gate AUDIO/META rows | atelier/runtime/README "Notes from wave 1": compute lazily/purely |
| 34 | 2026-10-08 | version | `clipPlane` is not in p5 2.3.4: section views need a 2D profile clipped once and capped with hatched faces (`buildGeometry`, instanced via `model(g, n)`) | grep the installed build | seat (craft) |
| 35 | 2026-10-08 | pedagogy | Showing errors piling up inside ONE run teaches 0.05·k (linear), the opposite of 0.95^k; the unit of truth is the whole run, many runs, each pass/fail, counted | pedagogy consult on the v0 heroes | atelier ART-DIRECTION-v1 §0.1; module `ensembleRun` |
| 36 | 2026-10-08 | pedagogy | A number shown before the commit anchors the guess ("7 of 10 cleared: 70 %" just before predict); "exact ± sd" contradicts itself for lay viewers (say *expected*); two encodings at once ("36 %" on screen, "a third" in captions) | pedagogy seat over all sheets | modules P1 law (check.mjs); AM.Number formatter |
| 37 | 2026-10-08 | judging | Lucky seeds: realised 68 vs expected 59.9 (+1.65 sd) and a single month whose seed flipped an ROI sign; small N (≤60) can invert the lesson inside the noise | compare realised vs expected per film | never pick seeds; raise N, show the ensemble, or lead with the expectation |
| 38 | 2026-10-08 | studio | Eight explainer chromes each passed their own gates yet shared a house look: centred "pause and guess" countdown modal, twin panels side-by-side/stacked, tracked small-caps header strip + seed metadata, the same "36 % … 79 %" ending with an "expected ± sd" footnote | juror over all 16 contact sheets | atelier REVISE.md batch fixes; modules route commit/twin/ending through the Material |
| 39 | 2026-10-08 | pedagogy | An inverse "place the checks" Wield is degenerate when per-step p is uniform (the product commutes) or the budget buys every check | pedagogy seat | modules INV law (per-step p varies, budget < k) |
