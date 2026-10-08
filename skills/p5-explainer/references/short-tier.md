# p5-explainer — design

The SVG episode plus p5.js 2.3.4 generative layers, rendered live (HTML) and as frame-identical MP4. A superset of `ceti-explainer`, never a fork.

`$CE` = `${CLAUDE_PLUGIN_ROOT}/skills/ceti-explainer`; `$P5` = `${CLAUDE_PLUGIN_ROOT}` (this plugin's root).

## 1. What stays invariant

| Contract | File / symbol | Rule in the new tier |
|---|---|---|
| One clock, `render(t)` pure | `$CE/assets/engine.js` → `CetiExplainer.create`, `loop()`, `seek()` | Not edited; p5 layers are driven *from* it. |
| Module API | `window.EXPLAINER = {meta, beats, build, render, setMath}`; `__AUDIT/__REGIONS/__LAYOUT` | Same; film adds `window.__FILM` beside it. |
| Beat structure | `gate.mjs`: 8 beats, 35–45 s, last = "Why it matters", captions ≤118 | `gate.mjs` must still PASS on the `.js` alone. |
| `ex` toolkit | `ease.{glaser,warmIn,defer,collect,rest}`, `win/ramp/seg/pulse/fit` | p5 layers use the same eases via `Studio.ease` aliases. |
| Brand tokens | `$CE/presets/ceti.css`, `shell.template.html:16-22` (`--ex-*`), fonts Fraunces/DM Sans/Space Mono | p5 reads them with `Studio.palette({css:{ground:'--ex-ground',…}})` — no hex in sketches. |
| Gates | `gate.mjs` §15a/b/d; `$P5/scripts/gate.py` (lint, determinism, `--zone`, `--inv`, `--frames` → `motion.py`) | Both run; §16 is additive. |
| Canvas | `viewBox 0 0 1000 464`, three y-bands | Film frame 2000×928 (2×), 30 fps. |
| p5 host contract | `$P5/runtime/src/studio/studio.js`: `Studio.clock({mode:'sim',dt})`, `Studio.host(p,{clock})` → `window.__sketch.renderAt(t)`, `Studio.harness` → `window.__renderFrame(i)` | The only way a p5 layer receives time. |

## 2. The scene tree

```
Film{id, fps, seed, tokens}            = Export ∘ Animate(sim, dt=1/fps) ∘ Compose(Acts)
 └ Act{id, beats[]}                     (short tier: one Act; feature cut: 7 movements)
    └ Beat{id, label, dur, caption, focal:LayerRef, transition, cue}   ← engine beats, verbatim
       └ Layer[]  (z-ordered)
           p5field  : Ground/Field/Post units   zone=ground, ≤0.15 α of ink   (behind the SVG)
           p5figure : Place/Grow/Mark units     zone=working|anchor, declares bbox → __LAYOUT proxy rect
           svg      : the explainer diagram     (Typeset/Mark; the existing module)
           html     : kinetic type / caption band DOM (engine-owned, `data-ex-caption`)
           caption  : the spoken line (data only)
```

Ports (`$P5/references/operad.md` §2): every layer is `(Seed:Stream, Time, State, Palette) → Layer`; Compose takes `Layer₁…ₙ × Palette → Frame`. `State` is the explainer's own `{flags.math, accent}`. Purity: closed-form `t` (noise(x,y,t), parametric paths) or `sim` with keyframe checkpoints every 30 frames, so `renderAt(t)` rebuilds any instant. Parallel associativity (law 3) licenses one worker per layer.

## 3. Workers and compositor

```
films/<id>/
  film.json · <id>.js (explainer module, unchanged contract)
  layers/ground.html · layers/figure-b4.html   (sketch.html template + Studio.host/harness)
  build/live/<Title>.html      one file: shell.p5 + engine + module + p5 + studio + layers, inline
  build/frames/<layer>/f%05d.png · build/dom/svg/f%05d.png   RGBA sequences
  build/<id>.mp4 · parity.json · gate.json
```

Manifest a worker consumes:

```json
{ "film":"embeddings", "fps":30, "seed":7, "w":2000, "h":928, "preset":"ceti",
  "module":"embeddings.js",
  "layers":[
    {"id":"ground","kind":"p5field","src":"layers/ground.html","z":0,"zone":"ground","alpha_max":0.15,
     "clock":{"mode":"sim","dt":0.0333333},"units":"Post(grain)(Field(curl))"},
    {"id":"figure-b4","kind":"p5figure","src":"layers/figure-b4.html","z":5,"zone":"working",
     "bbox":[60,130,480,292],"window":["b4.start+0.3","b6.end"],"units":"Mark(stipple)(Place(poisson))"},
    {"id":"svg","kind":"svg","z":10}, {"id":"captions","kind":"html","z":20}],
  "beats":[{"id":"b1","focal":"svg","transition":"seg","cue":1.4}, "…"],
  "camera":[{"beat":"why","move":"push","scale":1.04}] }
```

Workers (`scripts/film_render.py`, one process per layer, disjoint writes):
- **p5 layers**: `render.py <src> --frames N --fps 30 --w 2000 --h 928 --seeds <seed>` → `__renderFrame(i)` → `clock.at(i)`; `mode:'sim', dt:1/fps` gives `t = i/fps` exactly. Backgrounds `clear()` so PNGs carry alpha; each layer bakes its own `window` opacity with `Studio.seg` (port of `ex.seg`).
- **svg/html layer**: Playwright loads `build/live/<Title>.html`, per frame `__ctrl.pause(); __ctrl.seek(i/fps)`, hides canvases, screenshots `.ex-stage-frame` on a transparent body.
- **Compositor** (`scripts/composite.py`): ffmpeg `overlay` chain in `z` order, `-framerate 30 -pix_fmt yuv420p`, audio stems at `cue` times via `adelay`. No opacity in ffmpeg — it lives in the layers, one source of truth.
- **Parity** (`scripts/parity.py`): 24 sampled instants, live stage screenshot vs composite frame; pHash ≤2 and mean ΔE ≤1.5, else FAIL naming (t, layer).

Live page = the same stack in CSS: `<canvas>` siblings under `.ex-stage svg`; `assets/bridge.js` wraps `content.render` so each `render(t)` also calls `__sketch[layer].renderAt(t)`. Both paths evaluate the same functions on the same `t_i = i/fps` grid with the same seed.

## 4. Design rules → gates (`gate.mjs` §16, `scripts/motion_film.py`)

| # | Rule | Gate |
|---|---|---|
| 1 | **Type scale**: ≤3 sizes on stage (11 mono / 13 sans / ≥26 Fraunces), ratio ≥1.4; kinetic type arrives by `ramp`, ≤0.12 s stagger, never letter-scatter | §16a: distinct `font-size` ≤3; lint: no per-glyph `<tspan>` animation |
| 2 | **Grid**: 12 columns, 44 px margins; `__LAYOUT` block x-edges snap to column lines ±2 px | §16b bbox walk (reuse §15d walker) |
| 3 | **Curves by role**: arrivals `defer`, exits `collect`, focal `glaser`; opacity never linear; 0.35–0.9 s | lint on `ramp/win/seg` args; energy after a cut decays within 0.9 s |
| 4 | **Hold frames**: every beat ends with ≥0.8 s where stage motion energy < 0.004 | `motion_film.py holds` per beat window |
| 5 | **One focal motion per beat**: ≥70 % of a beat's frame-diff energy lies inside `beats[].focal` bbox | `focal_share` from frame diffs × bbox mask |
| 6 | **Camera grammar**: cuts only at beat boundaries; one `push` ≤1.04 per film; no pans | manifest enum + phase-correlation shift ≈0 outside declared push |
| 7 | **Palette roles** 60/30/10: ground ≥60 %, ink+dim ≤30 %, accent ≤10 %; one accent hue per beat | `metrics.py palette_oklch` vs resolved `--ex-*` |
| 8 | **Transitions carry meaning**: `seg` = same idea continues; `hold` = pause to read; `push` = conclusion only | manifest `transition` ∈ {seg,hold,push}; §15b unchanged |
| 9 | **Texture/grain**: ground layer alone `rms_contrast ≤0.04`, `L_range ≤0.12`; calm over the detail band | `gate.py --inv … --zone 0,0.65,1,1:0.02` on the ground layer |
| 10 | **Sound sync**: each beat's energy peak within 2 frames of `cue` | `motion_film.py cues` |

## 5. MVP today — "Embeddings: meaning as distance" (~38 s, 1140 frames)

A point cloud is a native p5 figure with real meaning; the cosine math is derivable in `__AUDIT`.

1. **Tokens** (3.6 s) — anchor row: `king queen man woman apple`. svg focal.
2. **Numbers** (4.6) — each word becomes a 4-cell strip; derived in DATA.
3. **A space** (5.0) — p5figure: 5 points drift from random seats to projected positions (closed-form lerp). Focal = figure.
4. **Distance** (5.0) — svg draws `king→queen` and `king→apple`; detail band: `cos = 0.92 / 0.11`, computed.
5. **Neighbours** (5.0) — figure stipples a 400-point field; nearest-neighbour lines light by `seg`.
6. **The arithmetic** (5.2) — `king − man + woman ≈ queen`; the result glides to queen; audit asserts.
7. **Where it breaks** (4.4) — `bank` splits into two points; honesty beat.
8. **Why it matters** (5.2) — re-light the anchor; one Fraunces line; the field settles. Camera push.

Create:
```
$CE/../p5-explainer/SKILL.md                   the tier contract
  assets/shell.p5.template.html                shell.template.html + canvas slots + inline p5 + studio.js
  assets/bridge.js                             render(t) → __sketch[layer].renderAt(t); palette from --ex-*
  assets/build_film.py                         build.py + --film film.json
  assets/gate16.mjs                            §16a/b static checks
  scripts/film_render.py · composite.py · parity.py · motion_film.py
  templates/film.json · layer.ground.html · layer.figure.html
films/embeddings/{film.json, embeddings.js, layers/ground.html, layers/figure-b3.html}
$P5/runtime/src/studio/studio.js: add Studio.seg and Studio.film(p,{fps}) = clock(sim,1/fps)+host+harness
```
Run: `gate.mjs` → `build_film.py` → `film_render.py` → `composite.py` → `parity.py` → `gate16.mjs` + `motion_film.py`.

## 6. Risks — and what not to do

- p5 2.x `redraw()` is async: live may lag the SVG one frame; video uses awaited `__renderFrame`. Never screen-record.
- Headless vs browser font metrics: bundle fonts, run `audit-overlaps.js`, let parity tolerance decide.
- A p5figure is invisible to §15d: always register its proxy `<rect>` in `__LAYOUT`.
- Don't edit `engine.js` or existing `gate.mjs` sections; don't inline p5 twice (≈1 MB); don't let the ground compete — the art-director's note was that nothing *behaved* like the work; here the figure moves, the ground never does.
- No physics without checkpoints; no opacity in ffmpeg; never drop the honesty beat.
