---
name: p5-ship
description: "Ship stage of the p5 studio: makes a verified p5.js 2.3.x sketch into deliverables and plugs it into other work. Self-contained HTML with a seed explorer (studio runtime inlined, optional offline p5), print-resolution PNGs, plotter-ready layered SVG and draw-on SVG paths, deterministic MP4/GIF from frame stepping, React/shadcn embedding, and host contracts for CETI assets (ceti-explainer background layers, field-story plate instruments, editorial-dashboard generative icon sets, silver-hero components, scroll explainers). Use for /p5-ship, \"export my sketch\", \"print version\", \"make it plottable\", \"render a video of the sketch\", \"embed this p5 piece in the explainer / dashboard / page\", or as phase 8 of p5-studio."
---

> Inherits `${CLAUDE_PLUGIN_ROOT}/references/doctrine.md`. Publishing, overwriting and anything leaving the folder need the
> person's yes. Exports always carry the seed in the filename.

# p5-ship — deliverables and bridges

## Self-contained file

```
python3 $STUDIO/scripts/ship.py <work>/<slug>/sketch.html --out <dest>/<slug>.html [--inline-p5] [--title "…"]
```
Inlines `studio.js`; `--inline-p5` makes it fully offline (~1 MB). Adds a quiet seed explorer (← → R,
PNG, SVG when paths were recorded); `?ui=0` hides it; hidden in print. Re-render the shipped file once with
`render.py` to prove it still runs.

## Exports

| Need | How |
|---|---|
| Hero stills | `render.py <file> --seeds <hero seeds>`; filenames carry seed and size |
| Print | `render.py <file> --seeds S --d 3` (or 4–6; SwiftShader max texture 8192 px); compose in fractions so density never changes the layout; beyond the texture limit tile the render (`${CLAUDE_PLUGIN_ROOT}/references/p5/export.md`, high-resolution print) |
| Plotter SVG | record with `Studio.svg.path(pts, {stroke, width, layer, dash})` while drawing; `render.py --svg` writes `seed_N.svg` (one `<g>` layer per pen, fills dropped, colours as hex). In the page: `Studio.svg.toString({plotter:true, mm:[297,420], simplify:0.4})` for physical size and fewer vertices; post-process with vpype (`linemerge linesort linesimplify`) |
| Draw-on SVG (anime.js) | `Studio.svg.toString({currentColor:true, simplify:0.6})` — paths carry `class="line"` and `stroke="currentColor"`; keep path count within the host budget (≤ ~300 paths for a hero draw-on) |
| Video | the sketch exposes a clock (`Studio.harness(p, {clock})`); `render.py <file> --seeds S --frames N --fps 30 --video` steps `window.__renderFrame(i)` and stitches with ffmpeg into `renders/<name>_video/` (never overwrites the gate sweep; only the first seed is filmed) — frame-exact, wall-clock independent. `motion.py <frames dir>` reports flashes/s, loop seam and motion energy |
| GIF | `saveGif` works in 2.x for small loops; for exact loops convert the MP4 (ffmpeg palettegen) |

Motion exports: check the flash rule (≤ 3 luminance flips per second) by looking at the frame strip, and
ship the composed reduced-motion still alongside.

## Bridges into CETI work

Implement the three host contracts in `${CLAUDE_PLUGIN_ROOT}/references/integration.md` (tokens in, clocked not
free-running, polite on the page) — `Studio.host(p, {clock, setState, still})` installs the canonical
`window.__sketch` — then:
- **ceti-explainer** — a p5 background/texture layer behind the SVG stage; low contrast; reads `--ex-*`
  roles; driven by the explainer's `render(t)` via `window.__sketch.renderAt(t)`.
- **field-story** — plate instruments: one `state` mutator (`setState`), IntersectionObserver-gated,
  plate accent tokens, composed reduced-motion still; the hinge plate and the finale (energy decaying to
  stillness) are natural p5 pieces.
- **editorial-dashboard `--deep`** — generative icon/texture systems: one idiom per concept (each icon a
  different technique), rendered once to PNG/data-URI on the cream paper palette.
- **silver-hero-engine** — register as an ANIM/SCENE component; one gold light; accept the host's `rate(t)`.
- **svg-animation-techniques** — SVG out for draw-on; SVG paths in (sigils, the whale mark) as attractors.
- **React / shadcn** — `@p5-wrapper/react` 5 (`P5Canvas`, p5 ≥ 2, React ≥ 19), fixed aspect box,
  `ResizeObserver` → `resizeCanvas`, `"use client"` / no SSR.
- **Video pipelines** (HyperFrames, agentopus) — hand over the MP4 from the frame-stepped render, never a
  screen recording.

## Colophon (ship it with the piece)

Title · intent · posture · units · palette source · lineage citations · seed(s) · p5 2.3.4 · studio version
· verification rung · date. Put it in the HTML `<meta name="description">` and in a visually quiet line
under the canvas when the host allows.

## References (load only what the step needs)

| File | When |
|---|---|
| `${CLAUDE_PLUGIN_ROOT}/references/p5/export.md` | stills, print, SVG, video |
| `${CLAUDE_PLUGIN_ROOT}/references/p5/embedding.md` | React/shadcn, overlays |
| `${CLAUDE_PLUGIN_ROOT}/references/integration.md` | CETI host contracts and bridges |
| `${CLAUDE_PLUGIN_ROOT}/references/doctrine.md` | publishing needs a yes |
