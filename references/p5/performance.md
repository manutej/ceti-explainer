# p5 2.3.4 — Performance & limits

*Part of the field guide; index: `../p5-2x-field-guide.md`. Status tags [TESTED]/[SOURCE]/[UNVERIFIED] as in docs/research/01 and 04.*

- **Pixel density.** It defaults to display density (2 on retina), which means 4× the fill work. `pixelDensity(1)` for speed and for deterministic headless output. Framebuffers inherit the canvas density unless `{density}` is set.
- **FES** (non-minified `p5.js`) can slow sketches by up to about 10×. Ship `p5.min.js` (990 KB, ~285 KB gzip) or set `p5.disableFriendlyErrors = true`. The full `p5.js` is 4.6 MB.
- **WebGL.** Prefer `p5.Framebuffer` over `p5.Graphics` for layers and textures. Replace static `p5.Graphics` with `p5.Image`. Cache shapes that don't change with `buildGeometry()`. Use shaders instead of per-frame `pixels[]` loops. `strokeMode(SIMPLE)` gives cheap lines. `setAttributes({antialias:false})` and lower `curveDetail` reduce work further. Instance with `model(geom, N)` + `instanceID()`.
- **Filters.** Built-in `filter()` runs on the GPU even in 2D (`useWebGL=true` by default). The first call lazily creates a WebGL context (FilterRenderer2D). `filter(BLUR)` on large canvases is still costly every frame.
- **`loadPixels()` in 2D** warns about `willReadFrequently`. For per-frame readback, create the canvas with that attribute or move the work to a shader.
- **`saveFrames`** is capped at 15 s and 22 fps. `saveGif` can be long-running; set `silent:true` for headless.
- **WebGPU.** It's experimental, explicitly "not aiming to be a more efficient renderer". Draws are batched and submitted at the end of the frame. Pixel reads are async. Headless SwiftShader exposes `navigator.gpu` but hits buffer-size limits (`createBuffer … size (10240) is too large … mappedAtCreation`). **Don't use WEBGPU for headless/CI renders**; use WEBGL.
- **Strands** compiles shaders once at build time; call `build*Shader` in `setup()`, never in `draw()`. `uniformFloat(() => expr)` re-evaluates the JS closure each frame. Note the closure **is** re-created by `new Function`, so only globals and scope keys are visible inside it.
- **Spinner.** `.loading-indicator` (position: fixed, z-index 9999) covers the page during async setup. It is removed on success but **stays if setup throws**. Screenshot only after `__done`.
- **Startup.** Global mode starts after `DOMContentLoaded` + `load` + the FES translator promise (`Promise.all([waitForDocumentReady(), waitingForTranslator])`). Rough harness timings: a 2D still at 400² rendered in ~0.4 s and a WEBGL still in ~0.9 s.
