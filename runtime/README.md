# Atelier runtime 0.1

The shared clock, player, engine and score for p5.js 2.3.4 explainer films: one file, instance mode, p5 only.

## Rules

- **Clock law.** A frame is a pure function of `(t, state, seed)`. Never use `frameCount`, `millis()`, `Date`, `performance.now`, `Math.random` or `p.random`. Use `U.h` and `U.stateAt` instead. Violations are recorded and fail the gate.
- **Build once.** `setup` builds geometry, data textures and atlases, `ctx.layer` caches buffers, and `draw` only renders.
- **Numbers come from the engine** (`AgentLoop`) or are read from the marks. Declare them in `meta()` with a `check`.
- **Banned defaults and positive tests** are listed in `../references/atelier/ART-DIRECTION-v1.md` §2, and the semantic colours in §3.
- Captions: 90 characters or fewer; soft track in the MP4.

## A film

```js
Atelier.film({ id, title, direction, level, duration, size: [960, 540], renderer: 'p2d'|'webgl', fps: 30, seed, ground,
  chapters: [{t, label}], captions: [{t0, t1, text}], state: {…},
  controls: [{key, type: 'toggle'|'range'|'select'|'commit', label, min, max, step, options, jump, countdown}],
  fonts: [{family}], engine: ctx => Atelier.AgentLoop({N, k, seed: ctx.seed}),
  setup(p, ctx) {}, draw(p, t, ctx) {},
  score: ctx => [{t, kind: 'tick'|'clack'|'click'|'tone', gain, freq, dur, pan}],
  meta: ctx => [{label, value, check: {world, k, p, c, N}}] });
```

`ctx` provides `state`, `seed`, `size`, `tokens` (retuned for `ground`), `U`, `engine`, `fonts` (p5.Font), `mode`, `layer(name, {kind, w, h, float, build})`, `caption(t)`, `commit` and `commits`. Draw in design units: `?w=` changes only `pixelDensity`.

A **commit** control holds playback at `jump − countdown` until the viewer commits, and scrubbing past that point snaps back. In film mode the default value is used. Draw the countdown with `ctx.commit.countdown(t)`.

## Atelier.U

- **Randomness and noise:** `h(seed,a,b,c,d)` is a counter hash in [0,1). Also `gauss`, `noise1/2/3`, `fbm`.
- **Easing by role:** `ease.enter/exit/settle/mechanical/hand` give a spring, a trapezoid and minimum-jerk motion. Also `spring`, `seg(t,t0,t1,ease)`, `clamp/lerp/map/smoothstep`.
- **Colour:** `color.mix` (OKLab), `retune(hex, ground)` and `tokensFor(ground)` (keeps the hue).
- **Simulation:** `stateAt(key, t, step, init, advance)` is a fixed-step integrator with a checkpoint LRU. It is exact in any seek order.
- **Drawing and type:** `drawOn(p, pts, u)`, `textContours(p, font, str, size)` (cached), `tabular(n, digits, {pad})` and `fitText`.

## Atelier.AgentLoop

`AgentLoop({N, k, p=.95, c=.8, retry=1, seed})` runs twin worlds on shared draws `h(seed,run,step,0|1|2)`. It returns:

- `failStep.{off,on}`, `events(run, world)`, `alive` and `failedAt`.
- `survivors`, `expected`, `sd`, `saved` and `table()`.

`AgentLoop.exact(k,p,c)` gives p^j and p'^j, where p' = p+(1−p)·c·p = 0.988. `AgentLoop.selfTest()` asserts every step is within 4 sd.

## Score

One event list drives both the live WebAudio (muted until the first gesture) and the offline WAV for the MP4.

## Headless

- **URL parameters:** `?film=1` gives a chromeless canvas at render size. Also `?w=`, `?seed=`, `?t=`.
- **`window.__atelier`:** `ready`, `seek(t)`, `info()`, `setState(o)`, `meta()`, `audio()` (WAV base64), `capture(fmt)`, `violations`.

## Commands

```sh
python3 build.py film.js --out build [--fonts "Inter=path.woff2:400"]
python3 gate.py build/<id>.html
python3 render.py build/<id>.html --out f --stills 1,5,9 --sheet sheet.jpg
python3 render.py build/<id>.html --out f --from 0 --to 4 --workers 2 --mp4 out.mp4
```

`build.py` writes two files:

- `<id>.html` is the offline version, with p5 inlined.
- `<id>.artifact.html` is a fragment that starts with `<title>` and loads p5 from jsDelivr 2.3.4.

Fonts are embedded once as WOFF, because p5 2.3.4 rejects woff2.

## Gotchas

- p5.Font text (WEBGL, textContours) has no glyph fallback. Space Mono latin lacks U+2007, so use `tabular(n, d, {pad: ' '})`.
- For WEBGL per-instance data, read a data texture with `texelFetch(…, gl_InstanceID)` in a GLSL hook (see `examples/smoke-webgl.film.js`).

## Speed

At 960×540 with 2 workers, a frame takes 0.06 s for p2d and 0.49 s for webgl.

## Notes from wave 1 (2026-10-08)
- `build.py film.js --kit a.js b.js --fonts ...` inlines shared kits before the film (no more make.sh glue).
- `score(ctx)` and `meta(ctx)` run BEFORE `setup()`: anything they need must be computed lazily/purely.
- Light grounds (OKLCH L > 0.6) get a curated semantic set (`tokensLight`); copper/peach stay distinct. Pass
  `tokensFor(g, {retune:true})` for the old behaviour.
- Render/gate run Chromium with `--disable-accelerated-2d-canvas` (CPU 2D canvas — heavy path work was 3–9 s/frame on
  SwiftShader-rasterised 2D). For heavy 2D, still prefer drawing to an offscreen `willReadFrequently` canvas and blitting once.
- WEBGL on SwiftShader: `baseMaterialShader` costs ~25 s/frame; a custom GLSL 300 es shader is ~0.6 s. Avoid uniform name `uTint`
  (p5 resets it). p5.Image premultiplies alpha: keep α = 255 for data textures.
- The live readout panel hides engine numbers until every commit beat is committed.
