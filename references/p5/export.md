# p5 2.3.4 — Export

*Part of the field guide; index: `../p5-2x-field-guide.md`. Status tags [TESTED]/[SOURCE]/[UNVERIFIED] as in docs/research/01 and 04.*

### 8.1 Stills: `saveCanvas` / `save`

`saveCanvas('name', 'png')` fires a real browser download, which Playwright captures with `expect_download()` `[TESTED]`. `save()` also exists. For a p5.Framebuffer, `fb.get()` returns a p5.Image, which you can then `.save()` `[SOURCE]`.

### 8.2 `saveGif` in 2.x

Still in core: `saveGif(name, duration, { delay, units: 'seconds'|'frames', silent, notificationDuration, notificationID, reset })`, async. A 1 s GIF of a 200×200 sketch came out at 55.9 KB headless `[TESTED]`. 2.3.3 added `MAX_GIF_PIXELS`, a cap on GIF *decoding* (the decompression-bomb fix) per the release summary.

### 8.3 High-resolution print

```js
// [TESTED] 600x400 canvas → 3600x2400 PNG via saveCanvas; SwiftShader MAX_TEXTURE_SIZE = 8192
function setup() {
  createCanvas(600, 400, WEBGL);
  pixelDensity(6);                         // backing store 3600x2400; design in CSS px
  // offscreen at its own density: createFramebuffer({ density: 6 }) or createGraphics(w, h) + g.pixelDensity(k)
}
```

- The ceiling is `MAX_TEXTURE_SIZE / MAX_RENDERBUFFER_SIZE`: 8192 on SwiftShader, typically 16384 on desktop GPUs. Past that, **tile**: render N×M sub-frustums with `frustum()` (WEBGL) or `translate(-tx*W, -ty*H)` (2D) at density 1, save each tile, then stitch with PIL or ImageMagick. Tiling `[UNVERIFIED]`; `@davepagurek/p5.tile` was not found on npm.
- Design in resolution-independent units (fractions of `width`), so density changes don't change the composition.
- Seed everything (`randomSeed`, `noiseSeed`) so the print matches the preview.

### 8.4 SVG and pen plotters

- **p5.js-svg 1.6.0 is broken on p5 2.x** `[TESTED]`: `createCanvas(200,200,SVG)` throws `TypeError: Cannot create property 'id' on string 'svg'`. The package targets p5 1.11, and upstream issue #279 "[WIP] p5.js 2.0 Updates" has been open since 2025-04-04.
- **Recommended 2.x pattern, "geometry-first hybrid":** compute polylines as plain data, then render them twice. One render goes to the canvas for preview, and the other is serialised to an SVG string. This also suits plotters best, since you keep a clean path list with no fills or transforms to flatten.

```js
// [UNVERIFIED-exec, plain JS] polyline model → SVG file
let paths = [];               // [[ [x,y], [x,y], ... ], ...]
function toSVG(paths, w, h, strokeMM = 0.3) {
  const d = paths.map(p => 'M' + p.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join('L')).join(' ');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
         `<path d="${d}" fill="none" stroke="black" stroke-width="${strokeMM}"/></svg>`;
}
function keyPressed() { if (key === 's') downloadFile(new Blob([toSVG(paths, width, height)], { type: 'image/svg+xml' }), 'plot', 'svg'); }
```

`downloadFile` and `writeFile` are core in 2.3.4 `[SOURCE]`.

- **vpype** (Python) is the standard plotter post-processor `[UNVERIFIED; not installed here]`: `vpype read plot.svg linemerge --tolerance 0.1mm linesort reloop linesimplify layout --fit-to-margins 1cm a4 write out.svg`. Then hand the file to AxiDraw, saxi, or `vpype … gwrite` for G-code. Emit **one SVG layer per pen colour**, because vpype reads `<g>` layers.

### 8.5 Video

| Route | How | Determinism | Status |
|---|---|---|---|
| **Deterministic stepping + ffmpeg** (recommended) | `noLoop()`, `t = i/fps`, `await redraw()`, then `canvas.toDataURL()` per frame from Playwright, then `ffmpeg -framerate 30 -i f%05d.png -c:v libx264 -pix_fmt yuv420p -crf 18 out.mp4` | Exact. Wall-clock independent, so slow GPUs don't drop frames. | `[TESTED]` 60 frames in 3.5 s → `render_test/frames.mp4` |
| p5.capture 1.6.1 | `P5Capture.getInstance().start({format:'webm'|'gif'|'mp4'|'png'|'jpg'|'webp', duration:N, framerate})`. Hooks draw(), so it records each rendered frame. | Frame-locked, but encoded in the browser. Single instance; no bundlers. | `[TESTED]` with p5 2.3.4: PNG-zip download |
| p5.record.js 0.3.0 (Processing Foundation, limzykenneth) | `setRecording({frameRate:'manual'})`, `startRecording()`, `stopRecording()`. Uses `captureStream()`/`toBlob`. | `'manual'` ties capture to each draw. Output is VP8 WebM or an image zip. | `[UNVERIFIED]` |
| MediaRecorder (raw) | `new MediaRecorder(canvas.captureStream(fps), {mimeType:'video/webm;codecs=vp9'})` | Real-time, so it **drops frames** on heavy sketches | `[UNVERIFIED-this-run]` |
| CCapture.js | npm `ccapture.js@2.0.0` (modified 2026-07) | Overrides time functions, so it's deterministic | `[UNKNOWN]` on p5 2.x (async draw loop) |

The rule for agents: **never derive animation from `millis()` or `frameCount` when exporting.** Derive it from a `t` the harness controls.

Headless: use `scripts/render.py` (tested recipe: ANGLE+SwiftShader flags for WEBGL; WebGPU does not render headless — verify on a real GPU and always ship a WEBGL fallback).
