# Build contract — Type-safe AI (two renderings, one module)

Read first: `STORYBOARD.md` (what is drawn, when, captions), `data.js` (`window.TS`: data, derived numbers,
geometry `TS.G`, key moments `TS.T`, scene windows `TS.SC`, `TS.audit()`), the engine
`../../skills/p5-explainer/assets/feature-engine.js`, the page `../../skills/p5-explainer/assets/feature.template.html`, the bridge `../../skills/p5-explainer/assets/bridge.js`.

## Files and owners

| File | Owner | What |
|---|---|---|
| `data.js` | orchestrator | the only source of numbers, geometry and times. Need a change? Add to it, never fork values. |
| `scenes.js` | SVG lane | `window.FEATURE` — the whole film in SVG (the classic cut), progressive-enhancement aware |
| `layers/ground.js`, `whale.js`, `yard.js`, `runs.js` | p5 lane | `P5Film.layer(id, {z, setup, draw})` — what SVG can't carry |

## The module (`scenes.js`)

```js
window.FEATURE = {
  meta: { id:'typesafe', title:'Type-safe AI', titleHTML:'Type-safe <em>AI</em>', eyebrow:'CETI Explainers · two minutes',
          lede, synthTitle, synthesis, sources:[[tag,title,url],…], dur:TS.DUR, poster:5.6, vw:960, vh:540 },
  chapters: TS.CHAPTERS, captions: TS.CAPTIONS, state: {...TS.STATE}, controls:[…],
  build(svg, ctx), render(t, ctx),           // ctx = { t, dur, state, rm, film, ex }
};
window.__AUDIT = () => TS.audit();
```
`ctx.ex` = `{ ease:{glaser,warmIn,defer,collect,rest,linear}, clamp, lerp, prog, ramp, fade, seg, eo, eio, fmt }` —
`prog(t,a,b)` is linear 0→1 progress; `seg` is the contained same-region window; `fade(t,[a,b])` gates a scene 0.9 s in/out.

**Progressive enhancement.** `const HAS_P5 = !!window.P5Film;` read once in `build`. Where the p5 lane draws the
counted marks, the SVG lane draws a light fallback **only when `!HAS_P5`**:

| Element | SVG cut (`!HAS_P5`) | p5 cut (p5 lane draws) | SVG always draws |
|---|---|---|---|
| Whale (M1, M7) | ~70 sampled circles from `TS.samplePath`, lerped drift → whale, `TS.G.TF1`/`TF7` | 1,200 marks (`whale` layer) | streaks, title, sub, eye ring |
| Load on the 8 tracks (M3) | one bar per track along the queue, length ∝ p then p′ | 1,000 counted marks re-seating (`yard`) | rails, blades, token labels, p and p′ numbers, lockup, car, foot |
| Vocabulary (M3d) | 1,280 cells, 4 lit | ≈128k stubs, 4 lit (`yard`) | counter, labels |
| Runs (M4) | 40 representative cars + siding tallies | 2,000 marks (`runs`) | mainline + siding rails, blades, junction ticks, counter, foot |
| everything else | SVG | — | SVG |

The p5 layers read the same `TS.T`/`TS.G`/`ctx.state`, so both renderings agree frame for frame.

## Visual law (from the storyboard — non-negotiable)

- Token roles only: read `--ex-*` once in `build` via `getComputedStyle(document.documentElement)` into `C`; no hex
  literals in scene or layer code. Fonts: `var(--font-display|sans|mono)`.
- A track is a **pair of rails `TS.G.gauge` (3) apart**, hairline (1 px in viewBox units ≈ 2 px film), straight
  segments and gentle cubic turnouts only; no rounded-corner subway look, no station dots, no arrowheads, no wheels,
  ties, smoke, glow, gradients, `filter`, `blendMode`, shadowBlur. A car = a 10×4 rect between the rails.
- One saturated accent per scene (rotation in STORYBOARD). Ground ≥ 60 % of pixels, accent ≤ 10 %.
- Type ≥ 11 px; ≤ 3 sizes per scene + the Fraunces headline. Mono for numbers/tokens/eyebrows. `getComputedTextLength()`
  for anything placed after text (guard it), never `chars × px`.
- Micro-cadence per scene: eyebrow +0.4 → headline +0.65 → build (stagger 0.12–0.55, rise 12–26) → one payoff at ~70 %
  → settle. No stretch > 3 s without new motion. Nothing exits mid-gesture.
- `render(t, ctx)` is a pure function of `(t, ctx.state)`: no `Math.random`, no `Date`, no accumulated state, no CSS
  transitions/animations, no setTimeout. Scrub to any t → complete frame. Seeded randomness only from a fixed-seed rng
  created in `build` (SVG) or `L.stream(name)` in `setup` (p5).
- `rm` (reduced motion): no drift/breathing; opacity steps still work.

## p5 layer law

`P5Film.layer(id, { z, setup(p, L), draw(p, t, L, ctx) })`. Draw on `L.ctx` (the Canvas2D context) in viewBox units
— the bridge has already set the transform for 960×540 and cleared the canvas. Canvas2D only (no WEBGL, no
`filter()`, no `loadPixels` per frame). Batch: one `Path2D`/`beginPath` per colour, `fillRect` for marks.
Build all per-mark tables (seats, targets, itineraries) in `setup` from `L.stream(name)`; `draw` only interpolates.
Budget ≤ 12 ms per frame at 1920×1080. Return early when the layer's scene is not visible (`L` has `seg/ramp/ease`;
or use `CetiFeature.ex`). Colours: `L.rgba(L.pal.accent, alpha)` etc. Each layer header states `means: "each mark is one ___"`.
z: ground 1 · whale 6 · yard 6 · runs 6 (all under the SVG at z 10, so labels sit on top).

## Build, look, check

```
python3 ../../skills/p5-explainer/assets/build_feature.py . --variant svg|p5|both            # → build/typesafe.{svg,p5}.html
python3 ../../scripts/film_render.py build/typesafe.svg.html --out /tmp/…/stills --stills 5.6,21,29,41,44.7,53,64,68,73.5,80.6,94,106,116 --workers 4
python3 ../../scripts/film_render.py build/typesafe.p5.html --out … --layers yard --stills 41      # one layer, alpha
node ../../skills/p5-explainer/assets/feature_gate.mjs build/typesafe.svg.html            # sweep (orchestrator provides)
```
Look at every still you render (Read the PNG). Describe only what you see. Fix and re-render until each key frame is
composed like a top motion designer's frame: aligned to the grid, generous negative space, one focal point.
