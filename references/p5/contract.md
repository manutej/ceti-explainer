# p5 2.3.4 — The studio contract (non-negotiable)

*Part of the field guide; index: `../p5-2x-field-guide.md`. Status tags [TESTED]/[SOURCE]/[UNVERIFIED] as in docs/research/01 and 04.*

- `<meta charset="utf-8">` first in `<head>` — p5 2.3.4 bundles Greek identifiers (colorjs.io) and dies before `setup()` without it.
- Pin `https://cdn.jsdelivr.net/npm/p5@2.3.4/lib/p5.min.js`; load `studio.js` after it. Instance mode (`new p5(sketch, el)`).
- `Studio.params` → `Studio.begin(p, P)` (canvas, `pixelDensity`, `randomSeed`, `noiseSeed`) → named streams → `Studio.harness(p, {...})` at the end of `setup`; `Studio.frameDone(p)` at the end of `draw`.
- Build the scene as data in `setup`; `draw` renders. Motion is a pure function of `t` (`Studio.clock`) or a fixed-dt simulation; never `millis()`/`frameCount` for exported motion.
- `async setup()` + `await` for assets. Never `preload()`. Never `async draw()`.
- Colours: `colorMode(OKLCH)` uses C on a **0–150** scale (= CSS 0–0.4). CSS strings like `'oklch(0.62 0.19 30)'` parse directly and are what `Studio.palette` emits — prefer them.
