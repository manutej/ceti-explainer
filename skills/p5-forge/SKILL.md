---
name: p5-forge
description: "Implementation stage of the p5 studio: turns a CONCEPT.md unit tree into a correct, seeded, harness-ready p5.js 2.3.4 sketch using the studio template and runtime (named random streams, shaped distributions, Poisson disc, OKLCH palettes, clocks for still/loop/sim, SVG path recorder, headless contract). Covers 2D, WEBGL with p5.strands shaders and framebuffers, sound (p5.sound 0.4 / Web Audio), pointer and camera input, and print/plotter/video-ready code. Use for /p5-forge, \"write the p5 sketch\", \"implement this generative concept\", \"port my p5 1.x sketch to 2.x\", \"p5 shader\", \"audio-reactive p5\", or as phase 3 of p5-studio. Do NOT use to invent the concept (p5-concept) or to judge it (p5-crit)."
---

> Inherits `${CLAUDE_PLUGIN_ROOT}/references/doctrine.md`. Target p5 **2.3.4**. Never a 1.x idiom. Render before you describe.

# p5-forge — from unit tree to running code

## Start from the template, always

Copy `${CLAUDE_PLUGIN_ROOT}/templates/sketch.html` to `<work>/<slug>/sketch.html` and fill the header block (Intent,
Posture, Units, Lineage, where randomness enters). Do **not** copy `studio.js` beside it: `render.py`
serves the plugin's runtime (`$STUDIO/runtime/src/studio/studio.js`) and `ship.py` inlines it, so a local copy would
silently differ from what is rendered. The template already does the non-negotiables: UTF-8, pinned p5, instance mode,
`Studio.params → Studio.begin → streams → palette → a11y → harness`, `frameDone`.

## Shape of the code (mirrors the unit tree)

- **One function per unit**, named after it: `field(x, y)`, `partition()`, `place(regions)`,
  `grow(points, field)`, `mark(paths, layer)`, `compose()`. Pure where the unit is pure: inputs in, data out,
  only its own named stream. This makes the operad laws hold in code (refactors keep the frame hash) and lets
  separate agents build disjoint units.
- **Scene as data in `setup()`**; `draw()` only renders. Stills call `Studio.frameDone(p)` (stops the loop).
- **Streams**: `Studio.stream('structure' | 'detail' | 'colour' | …)` with `.gauss`, `.pareto`,
  `.weighted`, `.chance`, `.pick`, `.shuffle`; `Studio.poissonDisc(w, h, r, stream, k, accept)` for
  placement. `p.random`/`p.noise` are seeded by `Studio.begin` too; prefer streams for anything structural.
- **Units in normalized space**: positions and sizes as fractions of `min(w, h)` so print density and
  format changes keep the composition.
- **Colour**: `Studio.palette({...})` with OKLCH CSS strings; `pal.pick(stream)` for weighted roles. Inside a
  host page use `{css:[…role tokens…]}`. No raw hex in drawing code when tokens exist.

## Clocks

| Mode | When | Rule |
|---|---|---|
| `still` | posters, prints, plates | `frames=1`; `Studio.frameDone` stops the loop; seed in every filename |
| still from a sim | growth, accumulation, feedback shown as one image | run N fixed-dt steps **inside setup (or one draw)**, keep `frames=1`; the still is the state after N steps |
| `loop` | seamless motion | `t = clock.tick()` at the top of `draw()`; everything a pure function of `t`/`clock.phase()`; period closes the loop. Plays live forever; headless renders (`?render=1`) stop after `frames`. `?t=` / `gate.py --t` picks the measured moment |
| `sim` | growth, agents, particles over time | fixed `dt`; state from frame 0; keyframe checkpoints for scrubbing; `frames=N` for renders |
| interactive | pointer/keyboard pieces | render = scripted `Studio.gestures(stream, …)` replayed through the same handler code live input uses; call `Studio.live(p)` in the first real input handler to resume live play |
| host / scroll | explainers, plates, silver-hero | `Studio.host(p, {clock, setState, still})` installs `window.__sketch` (renderAt, setState, rate, still) |

`Studio.harness(p, {clock})` installs `window.__renderFrame(i)` for frame-exact video: it pauses live play,
sets `t` for frame i, and holds it so your `clock.tick()` does not advance it again. **Build the scene once;
frames only advance the clock** — never rebuild scene data from the random streams inside `onFrame`
(tells #20: every video frame became a different field).

Animated pieces also need a **composed reduced-motion still** (`Studio.a11y(...).reducedMotion`) and must
not flash more than 3 times per second.

## Surfaces

Read the matching file under `${CLAUDE_PLUGIN_ROOT}/references/p5/` before writing (index: `${CLAUDE_PLUGIN_ROOT}/references/p5-2x-field-guide.md`):
- **WEBGL / strands** (`${CLAUDE_PLUGIN_ROOT}/references/p5/webgl-strands.md`) — origin is the canvas centre (`image(fb, -w/2, -h/2)` or `imageMode(CENTER)`;
  `translate(-w/2, -h/2)` for 2D-style drawing). In instance mode prefix p5 calls inside strands (`p.sin`,
  `p.getTexture`, `p.uniformTexture`) and pass `{ p }` in scope; for ping-pong buffers pass a mutable holder
  (`{ p, G }` with `p.uniformTexture(() => G.A)`). Numeric colours for uniforms: `pal.rgb01(name)`. Glow
  without `blendMode(ADD)`: a screen composite `1 − (1 − base)(1 − light)` in a strands filter. Framebuffers for feedback and layers (never `createGraphics` as a texture),
  `build*Shader` once in setup, hook-object syntax, pass locals via the scope argument (closures are lost),
  `inspectHooks()` before any GLSL hook, `model(geom, n)` + `instanceIndex` for instancing, `noStroke()`
  on dense 3D. WEBGPU only on request, always with a WEBGL fallback.
- **Sound** (`${CLAUDE_PLUGIN_ROOT}/references/p5/sound.md`) — p5.sound 0.4 API (normalized `analyze()`, `connect()` to analysers), start on a
  gesture. For headless and reproducible renders, drive the visuals from a **recorded or synthesized
  Signal** (`Listen` unit) so the still is deterministic: synthesize samples from a stream, then
  `Studio.stft(samples, {size, hop, sampleRate})` (radix-2 `Studio.fft` underneath). Live audio is a runtime mode.
- **Input** (`${CLAUDE_PLUGIN_ROOT}/references/p5/input.md`) — `mouseButton.left`, `keyIsDown('ArrowLeft')`, pointer events for touch. For renders,
  script the pointer path as data (a `Signal`) so every seed is reproducible.
- **Export** (`${CLAUDE_PLUGIN_ROOT}/references/p5/export.md`) — `Studio.svg.path(...)` alongside drawing for plotter/draw-on; design in fractions for
  `pixelDensity` print; motion via `window.__renderFrame` (installed by `Studio.harness`).

## Performance budget (cost algebra)

Before finishing, total the cost per frame. Over budget → the escape hatches in
`${CLAUDE_PLUGIN_ROOT}/references/anti-patterns.md` §3: render static layers once to a framebuffer/graphics and blit;
batch into one `beginShape(POINTS|LINES)`; move per-pixel work to a strands filter; or leave p5 for that
layer, or draw thousands of strokes through one `p.drawingContext` `Path2D` per colour (fast, still
deterministic). Never `loadPixels()`/`get()` inside `draw()`.

## Self-check before handing to the gate

1. `python3 $STUDIO/scripts/lint.py <work>/<slug>/sketch.html --brief <still|motion|interactive>` → no P0.
2. `python3 $STUDIO/scripts/render.py <work>/<slug>/sketch.html --seeds 1,2,3` → all ok, determinism identical.
3. Open `renders/sketch/contact.png` and look (Read the image). Describe only what you see.
Then hand to `p5-crit`. Do not judge originality yourself. Assert your exact invariants in code (a throw in
`setup()` sets `__error` and FAILS the gate) and report measured ones in `window.__meta` for `--inv meta.*`.

## Porting a 1.x sketch

Run `lint.py`; fix every API-* finding with the table in `${CLAUDE_PLUGIN_ROOT}/references/p5/breaking-1x-habits.md` (preload → async setup;
curveVertex → splineVertex; one-point bezierVertex; mouseButton object; key strings; font.textToPoints);
then wrap in the template (seed, harness, a11y). Render seeds before and after; the port is done when the
2.x render matches the intent of the original and the gate passes.

## References (load only what the step needs)

| File | When |
|---|---|
| `${CLAUDE_PLUGIN_ROOT}/templates/sketch.html` | always — the starting file |
| `${CLAUDE_PLUGIN_ROOT}/references/p5/contract.md` | always |
| `${CLAUDE_PLUGIN_ROOT}/references/p5/breaking-1x-habits.md` | porting, or any API-* lint finding |
| `${CLAUDE_PLUGIN_ROOT}/references/p5/webgl-strands.md` | WEBGL, shaders, framebuffers |
| `${CLAUDE_PLUGIN_ROOT}/references/p5/sound.md` | sound / Listen unit |
| `${CLAUDE_PLUGIN_ROOT}/references/p5/input.md` | interactive pieces |
| `${CLAUDE_PLUGIN_ROOT}/references/p5/export.md` | SVG, print, video |
| `${CLAUDE_PLUGIN_ROOT}/references/p5/performance.md` | cost budget |
| `${CLAUDE_PLUGIN_ROOT}/references/anti-patterns.md` | §3 escape hatches |
| `${CLAUDE_PLUGIN_ROOT}/runtime/src/studio/studio.js` | API of the runtime (header comment lists it) |
