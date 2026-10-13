# 04 — Advanced Surfaces: WebGL/strands, Sound, Sensing, Export, Embedding (p5 2.x)

**Lane:** everything past the 2D canvas — GPU, audio, input, export pipelines, headless rendering, embedding.
**Pinned versions:** p5 **2.3.4** (npm, 2026-09-25) · p5.sound **0.4.1** · ml5 **1.4.0** · p5.capture **1.6.1** · p5.js-svg **1.6.0** · @p5-wrapper/react **5.0.4** · Tone.js **15.1.22** · Chromium **141.0.7390.37** (Playwright bundle).
**Date:** 2026-10-05. **For:** `ceti-p5-studio` plugin design.
**Method:** p5js.org was blocked, so API claims below were read from the **p5@2.3.4 source in `node_modules`** (`lib/p5.js`, `dist/**`) and then **executed in headless Chromium** wherever possible. Every recipe carries a status tag:

- `[TESTED]` — ran in this environment on 2026-10-05; output saved under `render_test/`.
- `[SOURCE]` — signature/behaviour read from p5 2.3.4 source or the library's shipped JSDoc, not executed.
- `[UNVERIFIED]` — from general knowledge or third-party docs; check before relying on it.

---

## 0. TL;DR for the plugin

1. **Headless rendering works today for 2D and WebGL** (Playwright Chromium + SwiftShader, no GPU). Recommended flags: `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist`. Plain headless also still works on Chromium 141, but it logs a deprecation warning for the automatic software-WebGL fallback, so don't build on it. Script: `research/render_test.py`; sample outputs: `research/render_test/*.png`.
2. **WebGPU does not render headless here.** `navigator.gpu` hands back a SwiftShader adapter, but `mapAsync` fails, and so does a canvas present, with "A valid external Instance reference no longer exists". A **raw WebGPU** page fails the same way, so the environment is at fault, not p5. Plan on a real GPU for WEBGPU/compute work.
3. **p5.strands is the 2.x shader story.** 2.3.x uses a **hook-object syntax**: `worldInputs.begin() … .end()`, `filterColor.set(…)`, `finalColor`, `pixelInputs`, `combineColors`, `instanceIndex`. It's wrapped in `buildMaterialShader / buildFilterShader / buildColorShader / buildStrokeShader / buildNormalShader / buildComputeShader`. JS `for` and `if` compile to real GLSL `[TESTED]`. The 2.0-era callback style (`getColor((inputs, canvasContent) => …)`) still works in 2.3.4 `[TESTED]`.
4. **GLSL-string hook signatures drift between versions.** In 2.3.4, `getFinalColor` is `(vec4 color, vec2 texCoord)`, and a 1-arg override fails to compile `[TESTED]`. Call `shader.inspectHooks()` before you write any GLSL hook.
5. **Library status on 2.x:** p5.sound 0.4.1 ✅ · p5.capture 1.6.1 ✅ · saveGif ✅ · ml5 1.4.0 ✅ (Promise path; model download not verified offline) · **p5.js-svg 1.6.0 ❌ broken** (TypeError on `createCanvas(…, SVG)`) · @p5-wrapper/react 5 ✅ by peer-dep (p5 ≥ 2, React ≥ 19).
6. **For video, use deterministic stepping over real time.** Drive `t = frame/fps`, `await redraw()` (it is **async in 2.x**), pull `canvas.toDataURL()`, then stitch with ffmpeg. 60 frames at 480×270 WebGL took about 3.5 s headless `[TESTED]`.

---

## 1. WebGL in p5 2.x

### 1.1 Canvas, renderer constants, depth

```js
// [TESTED] (render_test/site/webgl.html)
function setup() {
  createCanvas(800, 800, WEBGL);   // origin at centre; y down; z toward viewer
  pixelDensity(1);                 // export-determinism: pin density, never inherit devicePixelRatio
  // setAttributes('antialias', true)  // [SOURCE] fn.setAttributes exists; call BEFORE drawing
}
```

- Renderer constants in 2.3.4: `P2D`, `P2DP3` (wide gamut 2D), `WEBGL`, `WEBGPU` (addon) `[SOURCE]`. 2.3.1 renamed the HDR colour space to **P3**, a breaking rename per the release summary `[UNVERIFIED-fetch]`.
- `webglVersion` returns `'webgl2'` on SwiftShader `[TESTED]`.
- Depth: `clearDepth()` exists, and framebuffers carry depth by default (`depth: true`, `depthFormat: FLOAT`). Depth can be read as `fb.depth` in a shader `[SOURCE]`.

### 1.2 Framebuffers (`createFramebuffer`) — the 2.x workhorse

Options `[SOURCE]`: `{ format: UNSIGNED_BYTE|FLOAT|HALF_FLOAT, channels: RGB|RGBA, depth: true, depthFormat: UNSIGNED_INT|FLOAT, stencil: true, antialias: bool|samples, width, height, density, textureFiltering: LINEAR|NEAREST }`. Leave out width, height and density and the framebuffer auto-resizes with the canvas.

Framebuffers live entirely on the GPU. Using a `p5.Graphics` as a texture costs a CPU↔GPU upload every frame, and a framebuffer avoids that (arch.md, contributor docs). **Use framebuffers for feedback, trails, post-FX and simulation state.** Use `FLOAT`/`HALF_FLOAT` + `NEAREST` when the texture holds data, not an image.

**Ping-pong feedback** `[TESTED]`. This is the core of `webgl.html` (output: `render_test/sketch_webgl_angle-swiftshader.png`):

```js
let fbA, fbB, decay;
function setup() {
  createCanvas(800, 800, WEBGL); pixelDensity(1);
  fbA = createFramebuffer(); fbB = createFramebuffer();
  decay = buildFilterShader(() => {              // p5.strands filter, JS-authored
    filterColor.begin();
    let uv = (filterColor.texCoord - 0.5) * 0.985 + 0.5;   // slight zoom
    let c = getTexture(filterColor.canvasContent, uv);
    filterColor.set([c.x * 0.95, c.y * 0.96, c.z * 0.985, 1]);
    filterColor.end();
  });
}
function draw() {
  fbB.begin();
    clear();
    imageMode(CENTER); image(fbA, 0, 0);   // previous frame
    filter(decay);                         // filter() applies to the framebuffer being drawn
    /* draw this frame's new marks */
  fbB.end();
  [fbA, fbB] = [fbB, fbA];
  background(0); imageMode(CENTER); image(fbA, 0, 0);
}
```

For **simulation state** (reaction–diffusion, GPU particles in WebGL), use `createFramebuffer({ format: FLOAT, textureFiltering: NEAREST })`. Read the state with `getTexture(myUniformTexture, uv)` in a filter and write the result into the other buffer `[SOURCE pattern; UNVERIFIED as a full sim here]`.

### 1.3 p5.strands — JS-authored shaders (2.3.x syntax)

Entry points (all present in 2.3.4 `[SOURCE]`): `buildMaterialShader`, `buildFilterShader`, `buildColorShader`, `buildStrokeShader`, `buildNormalShader`, `buildComputeShader` (WebGPU only). Each one is literally `baseXShader().modify(callback, scope)`. `load*Shader(file)` variants also exist (`loadMaterialShader`, `loadFilterShader`, `loadColorShader`, `loadStrokeShader`, `loadNormalShader`) and return Promises.

Hook objects (counted in the source): `worldInputs`, `objectInputs`, `cameraInputs` (vertex side); `pixelInputs`, `combineColors`, `finalColor` (fragment side); `filterColor` (filters). Uniform and varying helpers: `uniformFloat/Int/Vec2/Vec3/Vec4/Texture/Storage(() => value)`, `sharedFloat/sharedVec3/sharedVec4` (carry a value from the vertex hook to a fragment hook), and `instanceIndex` (a value; `instanceID()` is the deprecated function alias). Built-ins inside strands include `mix, smoothstep, length, dot, normalize, clamp, abs, floor, sin`, `getTexture(tex, uv)` and, since 2.3.1, strands-side `noise()`, `randomGaussian()` and `color()` (that last pair from the release summary).

**Vertex wobble material** `[TESTED]`:

```js
wobble = buildMaterialShader(() => {
  let t = uniformFloat(() => millis());          // JS closure → uniform, re-evaluated each draw
  worldInputs.begin();
  worldInputs.position.y += 12 * sin(worldInputs.position.x * 0.05 + t * 0.003);
  worldInputs.end();
});
// draw(): lights(); shader(wobble); fill(255,120,60); torus(120, 40, 48, 24);
```

**Control flow: `for` + `if` become real GLSL** `[TESTED]` (`render_test/sketch_strands_control_flow.png`):

```js
rings = buildFilterShader(() => {
  filterColor.begin();
  let uv = filterColor.texCoord - 0.5;
  let acc = 0;
  for (let i = 0; i < 6; i++) {                  // loop bound must be a compile-time constant
    acc += smoothstep(0.012, 0.0, abs(length(uv) - (0.06 + i * 0.065)));
  }
  let col = [acc, acc * 0.6, 0.2 + acc * 0.4, 1];
  if (uv.x > 0) { col = [0.2 + acc * 0.3, acc * 0.8, acc, 1]; }   // branch
  filterColor.set(col);
  filterColor.end();
});
```

The shipped dist has `strands_for.js`, `strands_conditionals.js`, `strands_ternary.js` and `strands_phi_utils.js` (SSA phi nodes for variables reassigned in branches) `[SOURCE]`. This is the 2.1/2.2-era branching and loop support. Array literals act as vecN, and arithmetic between vectors and scalars is overloaded (`[r,g,b,a] * 0.5` works `[TESTED]`).

**Rim light: fragment hook + shared varying** `[SOURCE, from the buildMaterialShader JSDoc]`:

```js
myShader = buildMaterialShader(() => {
  let n = sharedVec3();
  pixelInputs.begin(); n = pixelInputs.normal; pixelInputs.end();
  finalColor.begin();
  finalColor.set(mix([1,1,1,1], finalColor.color, abs(dot(n, [0,0,1]))));
  finalColor.end();
});
```

Other `pixelInputs` fields: `normal, texCoord, ambientLight, ambientMaterial, specularMaterial, emissiveMaterial, color, shininess, metalness`. `combineColors` exposes `baseColor, diffuse, ambientColor, ambient, specularColor, specular, emissive, opacity` `[SOURCE]`.

**Legacy 2.0 callback style** still compiles in 2.3.4 `[TESTED]`:

```js
legacy = baseFilterShader().modify(() => {
  getColor((inputs, canvasContent) => {
    let c = getTexture(canvasContent, inputs.texCoord);
    return [c.x, c.y, c.z, 1] * 0.5 + [0, 0, 0.25, 0.5];
  });
});
```

`getWorldInputs / getObjectInputs / getCameraInputs / getPixelInputs / getFinalColor / getColor` are still documented as `@beta` methods. **Policy for the plugin:** generate the hook-object syntax, accept both on input.

### 1.4 Hooks with GLSL strings (`baseMaterialShader().modify({...})`)

```js
// [TESTED] — note the TWO-argument signature in 2.3.4
glslHook = baseMaterialShader().modify({
  'vec4 getFinalColor': `(vec4 c, vec2 uv) { return vec4(c.rgb * vec3(1.0, 0.85, 1.2), c.a); }`
});
```

Default hook tables for the 2.3.4 material (phong) shader `[SOURCE: dist/webgl/p5.RendererGL.js]`:

- vertex: `void beforeVertex()`, `Vertex getObjectInputs(Vertex)`, `Vertex getWorldInputs(Vertex)`, `Vertex getCameraInputs(Vertex)`, `void afterVertex()`
- fragment: `void beforeFragment()`, `Inputs getPixelInputs(Inputs)`, `vec4 combineColors(ColorComponents)`, `vec4 getFinalColor(vec4 color, vec2 texCoord)`, `void afterFragment()`
- stroke shader: `StrokeVertex getWorldInputs(StrokeVertex)` (fields `position, tangentIn, tangentOut, color, weight`)

**Always call `baseMaterialShader().inspectHooks()`** (also exists for color, stroke, filter and compute) and paste its output into the generation context. The one-arg `getFinalColor(vec4)` from older tutorials fails with `'HOOK_getFinalColor' : no matching overloaded function found`, and the sketch dies in `setup` `[TESTED]`.

### 1.5 Raw GLSL: `createShader`, `loadShader`, `createFilterShader`, `filter()`

```js
// [SOURCE] signatures; GLSL ES 3.00 under WebGL2 (p5 injects a compatibility prefix: IN/OUT macros)
let sh;
async function setup() {
  createCanvas(600, 600, WEBGL);
  sh = await loadShader('shader.vert', 'shader.frag');    // Promise in 2.x — no preload()
  // or: sh = createShader(vertSrc, fragSrc);
  // filter-only: f = createFilterShader(fragSrc)  // fragment receives tex0, vTexCoord, canvasSize, texelSize
}
function draw() { shader(sh); sh.setUniform('uTime', millis() / 1000); plane(width, height); }
```

`filter(shaderOrConstant)` runs on the GPU by default even in **2D mode**: there's a `useWebGL=true` flag, and 2D uses a hidden WebGL layer (`getFilterGraphicsLayer`). Pass `filter(BLUR, 4, false)` to get the CPU path `[SOURCE]`.

### 1.6 Instancing

```js
// [TESTED] 24 instanced spheres placed by instanceIndex (webgl.html)
ball = buildGeometry(() => sphere(14, 16, 12));
ring = buildMaterialShader(() => {
  worldInputs.begin();
  let a = instanceIndex * (6.2831853 / N);
  worldInputs.position.x += 280 * cos(a);
  worldInputs.position.y += 280 * sin(a);
  worldInputs.end();
});
// draw(): shader(ring); model(ball, N);       // model(geometry, count) = WebGL2 instanced draw
```

`endShape(CLOSE, count)` also instances immediate-mode shapes (arch.md). Pair it with `buildGeometry()` for retained geometry, and call `freeGeometry(g)` when you throw a geometry away.

### 1.7 Experimental WebGPU renderer and compute (verified in source, **not renderable headless here**)

Load order `[SOURCE]`: `p5.min.js`, then `p5.webgpu.js` (or `p5.webgpu.esm.js`), then `await createCanvas(w, h, WEBGPU)`. **`createCanvas` is async under WebGPU.** The compute APIs are tagged `@beta @webgpuOnly` and throw a friendly error ("Add the WebGPU add-on to your project and pass WEBGPU as the last argument to createCanvas.") under WEBGL.

```js
// [SOURCE] — straight from p5 2.3.4 JSDoc for buildComputeShader / compute
let particles, sim, disp, inst; const COUNT = 100;
async function setup() {
  await createCanvas(400, 400, WEBGPU);
  let data = [];
  for (let i = 0; i < COUNT; i++) {
    let a = i / COUNT * TWO_PI;
    data.push({ position: createVector(0, 0), velocity: createVector(cos(a) * 2, sin(a) * 2) });
  }
  particles = createStorage(data);          // struct array; or createStorage(Float32Array | count)
  sim  = buildComputeShader(() => {
    let d = uniformStorage(particles);
    let i = index.x;                         // index.{x,y,z} from compute(shader, x, y, z)
    d[i].position = d[i].position + d[i].velocity;
  });
  disp = buildMaterialShader(() => {
    let d = uniformStorage(particles);
    worldInputs.begin(); worldInputs.position.xy += d[instanceIndex].position; worldInputs.end();
  });
  inst = buildGeometry(() => sphere(3));
}
function draw() {
  background(20);
  compute(sim, COUNT);                       // dispatch; also compute(sh, W, H) for 2-D grids
  noStroke(); fill(255, 200, 50); shader(disp); model(inst, COUNT);
}
// other API: storage.update(newData), clearStorage(), baseComputeShader().inspectHooks()
```

Headless result: the setup path completed (`ok: true`), but every frame failed in `mapAsync` and the canvas stayed blank. A raw WebGPU page failed identically, so headless WebGPU counts as **unsupported in this sandbox** `[TESTED-negative]`. The plugin should emit WEBGPU sketches only on request, always ship a WEBGL fallback, and verify them in a GPU-backed browser.

### 1.8 Performance tips (WebGL, 2.x)

- Keep feedback, trails and post-FX in **framebuffers**. Avoid `p5.Graphics` as a texture, because it uploads every frame.
- Retained beats immediate: wrap static geometry in `buildGeometry()` and draw it with `model()`. Use instanced `model(g, n)` for thousands of copies.
- Strokes are expensive in WebGL: each one is extruded into quads and has its own shader. Default to `noStroke()` on dense 3D. Note that the `[TESTED]` sphere with a default stroke rendered as a visible wireframe.
- Never call `loadPixels()/get()` per frame. SwiftShader logged "GPU stall due to ReadPixels" whenever we read back.
- Pin `pixelDensity(1)` for live work and raise it only for stills. SwiftShader throughput was ~1–1.7 fps for an 800² feedback + instancing scene (30 frames in 17.7–28.6 s depending on flags). Budget headless WebGL renders accordingly.
- Strands loops must have constant bounds, and both sides of a branch must produce the same type (phi nodes).

---

## 2. Sound

### 2.1 p5.sound 0.4.x (the 2.x-era rewrite on Tone.js)

The package describes itself as "a minimal wrapper for Tone.js" (dependency `tone ^15`), and the README says it works with p5 1.x and 2.x. **Smoke-tested against p5 2.3.4** `[TESTED]`: a sawtooth oscillator went into FFT(256) and Amplitude. The AudioContext reported `running`, the spectrum had 256 bins, the waveform 1024 samples, and level was 0.255.

Exports in 0.4.1 `[SOURCE]`:

- `p5.SoundFile`, `loadSound` (await-able)
- Analysis: `p5.Amplitude`, `p5.FFT`, `p5.OnsetDetect`
- Input: `p5.AudioIn`
- Oscillators: `p5.Oscillator`, `p5.SinOsc`, `p5.TriOsc`, `p5.SawOsc`, `p5.SqrOsc`, `p5.Pulse`, `p5.Noise`
- Synths and envelopes: `p5.Envelope`, `p5.MonoSynth`, `p5.PolySynth`, `p5.AudioVoice`
- Filters and effects: `p5.Filter`, `p5.LowPass`, `p5.HighPass`, `p5.BandPass`, `p5.Biquad`, `p5.EQ`, `p5.Delay`, `p5.Reverb`, `p5.Convolver`, `p5.Distortion`, `p5.Compressor`, `p5.PitchShifter`
- Routing: `p5.Gain`, `p5.Panner`, `p5.Panner3D`
- Sequencing: `p5.Phrase`, `p5.Part`, `p5.Score`, `p5.SoundLoop`
- Globals: `userStartAudio`, `userStopAudio`, `getAudioContext`, `setAudioContext`

**Breaking differences from 1.x p5.sound** (all `[SOURCE]` / `[TESTED]`). Models trained on 2015–2023 tutorials get these wrong:

| 1.x habit | 0.4.x reality |
|---|---|
| `fft.getEnergy('bass')`, `getCentroid`, `logAverages`, `linAverages` | **Gone** (0 occurrences). Bin the `analyze()` array yourself. |
| `analyze()` returns 0–255 | Returns **0–1 (normalRange)**. Values are small: a full-scale saw peaked at 0.011, so map from ~0–0.1 like the shipped example does. |
| `new p5.FFT()` default 1024 bins, analyses the master out | Default **32** bins, max **1024**, and it hears **only what you `connect()`** to it. |
| `new p5.Amplitude()` hears everything | Needs `src.connect(amp)` (or `setInput`). `getLevel()` is still present. |
| `preload(){ s = loadSound() }` | `async setup(){ s = await loadSound('a.mp3') }` |
| `isLoaded()`, `reverseBuffer()`, `getPeaks()` | Not present in 0.4.1. |

```js
// [TESTED pattern] audio-reactive with p5.sound 0.4.x
let song, fft, amp, started = false;
async function setup() {
  createCanvas(800, 400);
  song = await loadSound('loop.mp3');
  fft = new p5.FFT(256); amp = new p5.Amplitude(0.8);
  song.connect(fft); song.connect(amp);
  describe('Bars that pulse with the music after a click.');
}
function mousePressed() { if (!started) { userStartAudio(); song.loop(); started = true; } }
function draw() {
  background(12);
  const s = fft.analyze();                    // 0..1, length 256
  const bass = s.slice(0, 8).reduce((a, b) => a + b, 0) / 8;   // DIY getEnergy
  noStroke(); fill(240, 200, 120);
  for (let i = 0; i < s.length; i++) rect(i * width / s.length, height, width / s.length, -s[i] * 10 * height);
  circle(width / 2, height / 2, 40 + amp.getLevel() * 800 + bass * 2000);
}
```

### 2.2 Autoplay and `userStartAudio`

Browsers keep the AudioContext suspended until a user gesture. Call `userStartAudio()` (p5.sound) or `getAudioContext().resume()` inside `mousePressed/keyPressed` or a button handler. For headless tests, launch Chromium with `--autoplay-policy=no-user-gesture-required` `[TESTED]`.

### 2.3 Raw Web Audio (no library): the smallest reliable audio-reactive path

```js
// [UNVERIFIED in this run — standard Web Audio API]
let analyser, bins;
async function startAudio() {                       // call from a click handler
  const ctx = new AudioContext();
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });  // or an <audio> element source
  const src = ctx.createMediaStreamSource(stream);
  analyser = ctx.createAnalyser(); analyser.fftSize = 1024; analyser.smoothingTimeConstant = 0.8;
  src.connect(analyser);                             // do NOT connect mic to destination (feedback)
  bins = new Uint8Array(analyser.frequencyBinCount);
}
function draw() { if (analyser) { analyser.getByteFrequencyData(bins); /* 0..255 */ } }
```

Prefer raw Web Audio when you only need analysis. That skips the ~230 KB p5.sound + Tone bundle and the API churn.

### 2.4 Tone.js

Tone 15.1.22 is current. Use it directly for musical structure (Transport, Synths, Sequences): `await Tone.start()` in a gesture, then `const meter = new Tone.Meter(); synth.connect(meter)` and `new Tone.FFT(256)` / `Tone.Waveform` for analysis `[UNVERIFIED-this-run]`. p5.sound bundles its own Tone, so loading Tone separately alongside p5.sound probably creates a second context. Pick one: p5.sound for sketch-style sound, Tone for compositions. `setAudioContext()` exists for sharing a context `[SOURCE]`, but sharing was not tested.

### 2.5 Microphone

`mic = new p5.AudioIn(); mic.start(); mic.connect(amp)` needs https or localhost plus a permission. Headless with `--use-fake-device-for-media-stream --use-fake-ui-for-media-stream`, the mic started without error but `getLevel()` read 0 at sample time (the fake device beeps intermittently). Status: **partial / unverified signal** `[TESTED-inconclusive]`.

---

## 3. Interaction & sensing

### 3.1 Input changes in 2.x `[SOURCE]`

- **Pointer events unify mouse, pen and touch.** `mousePressed/mouseDragged/…` fire for touch, and `touches[]` is still filled from active pointers. `touchStarted/Moved/Ended` survive only in the FES name lists, so don't rely on them. Use mouse* handlers.
- `mouseButton` is now an **object**: `mouseButton.left/.right/.center` (1.x: `mouseButton === LEFT`).
- `keyIsDown('ArrowLeft')` takes **key strings**. `key`/`code` follow KeyboardEvent semantics. Numeric `keyCode` constants moved to the compatibility `events.js` addon.
- `preload()` is **removed**, and FES says so explicitly: "The preload() function has been removed in p5.js 2.0…". Use `async function setup(){ x = await loadImage(...) }`. The `processing/p5.js-compatibility` addons (`preload.js`, `shapes.js`, `data.js`, `events.js`) restore 1.x behaviour.
- Shapes: `curveVertex` became `splineVertex`, and `bezierVertex` takes single points (shapes.js restores the old form).
- New: `pointer lock` (`requestPointerLock/exitPointerLock`), `movedX/movedY`, `deltaTime`, `worldToScreen/screenToWorld` (handy for hit-testing in WEBGL).

### 3.2 Camera: `createCapture`

```js
// [TESTED] with fake device: 320x240, readyState 4, mirrored output confirmed
let cam;
function setup() {
  createCanvas(640, 480);
  cam = createCapture(VIDEO, { flipped: true });   // 2.x option: mirror at source
  cam.size(640, 480); cam.hide();
}
function draw() { image(cam, 0, 0, width, height); }
// constraints form: createCapture({ video: { facingMode: 'user' }, audio: false })
```

Headless: `--use-fake-ui-for-media-stream --use-fake-device-for-media-stream` gives a green test-pattern camera, enough for CI (`render_test/sketch_fake_camera.png`).

### 3.3 ml5.js 1.4.0 with p5 2.x

ml5 1.4.0 sniffs for p5 by checking `p5.prototype.registerMethod`, which is 1.x-only. Under p5 2.x that check fails, so ml5 **promisifies its constructors** instead of using preload `[SOURCE + TESTED: handPose() returned a Promise]`:

```js
// [TESTED up to model fetch — download blocked by this sandbox's proxy, so inference is UNVERIFIED]
let handPose, cam, hands = [];
async function setup() {
  createCanvas(640, 480);
  cam = createCapture(VIDEO, { flipped: true }); cam.size(640, 480); cam.hide();
  handPose = await ml5.handPose({ flipped: true });     // await the Promise under p5 2.x
  handPose.detectStart(cam, r => hands = r);
}
function draw() {
  image(cam, 0, 0);
  for (const h of hands) for (const k of h.keypoints) circle(k.x, k.y, 8);
}
```

The models (handPose, bodyPose, faceMesh, bodySegmentation, imageClassifier, soundClassifier, neuralNetwork, sentiment, depthEstimation in 1.4) download from CDNs at runtime. **Offline or headless pipelines must vendor or cache the model files.**

### 3.4 Accessibility `[SOURCE]`

- `describe(text, LABEL|FALLBACK)` puts a screen-reader description on the canvas. FALLBACK (the default) is hidden; LABEL also shows it visibly.
- `describeElement(name, text, display)` describes a sub-element.
- `textOutput(display)` and `gridOutput(display)` auto-generate shape lists or grids, updated every frame.

**Plugin rule:** every generated sketch calls `describe()` in setup with a concrete, non-generic description, and animated scenes update it via `describe(…, LABEL)` only when the meaning changes.

---

## 4. Export pipelines

### 4.1 Stills: `saveCanvas` / `save`

`saveCanvas('name', 'png')` fires a real browser download, which Playwright captures with `expect_download()` `[TESTED]`. `save()` also exists. For a p5.Framebuffer, `fb.get()` returns a p5.Image, which you can then `.save()` `[SOURCE]`.

### 4.2 `saveGif` in 2.x

Still in core: `saveGif(name, duration, { delay, units: 'seconds'|'frames', silent, notificationDuration, notificationID, reset })`, async. A 1 s GIF of a 200×200 sketch came out at 55.9 KB headless `[TESTED]`. 2.3.3 added `MAX_GIF_PIXELS`, a cap on GIF *decoding* (the decompression-bomb fix) per the release summary.

### 4.3 High-resolution print

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

### 4.4 SVG and pen plotters

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

### 4.5 Video

| Route | How | Determinism | Status |
|---|---|---|---|
| **Deterministic stepping + ffmpeg** (recommended) | `noLoop()`, `t = i/fps`, `await redraw()`, then `canvas.toDataURL()` per frame from Playwright, then `ffmpeg -framerate 30 -i f%05d.png -c:v libx264 -pix_fmt yuv420p -crf 18 out.mp4` | Exact. Wall-clock independent, so slow GPUs don't drop frames. | `[TESTED]` 60 frames in 3.5 s → `render_test/frames.mp4` |
| p5.capture 1.6.1 | `P5Capture.getInstance().start({format:'webm'|'gif'|'mp4'|'png'|'jpg'|'webp', duration:N, framerate})`. Hooks draw(), so it records each rendered frame. | Frame-locked, but encoded in the browser. Single instance; no bundlers. | `[TESTED]` with p5 2.3.4: PNG-zip download |
| p5.record.js 0.3.0 (Processing Foundation, limzykenneth) | `setRecording({frameRate:'manual'})`, `startRecording()`, `stopRecording()`. Uses `captureStream()`/`toBlob`. | `'manual'` ties capture to each draw. Output is VP8 WebM or an image zip. | `[UNVERIFIED]` |
| MediaRecorder (raw) | `new MediaRecorder(canvas.captureStream(fps), {mimeType:'video/webm;codecs=vp9'})` | Real-time, so it **drops frames** on heavy sketches | `[UNVERIFIED-this-run]` |
| CCapture.js | npm `ccapture.js@2.0.0` (modified 2026-07) | Overrides time functions, so it's deterministic | `[UNKNOWN]` on p5 2.x (async draw loop) |

The rule for agents: **never derive animation from `millis()` or `frameCount` when exporting.** Derive it from a `t` the harness controls.

### 4.6 HEADLESS rendering with Playwright: the tested recipe

File: **`research/render_test.py`** (self-contained; serves `render_test/site/` on an ephemeral localhost port).

```python
# condensed from render_test.py — [TESTED] 2026-10-05, Chromium 141.0.7390.37, p5 2.3.4
FLAGS = ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"]
browser = pw.chromium.launch(headless=True, args=FLAGS)          # PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers
page = browser.new_page(viewport={"width": 900, "height": 900}, device_scale_factor=1)
page.goto(f"{base}/webgl.html")                                   # http server, not file://
page.wait_for_function("window.__done === true", timeout=45_000)  # sketch sets it after N frames + noLoop()
page.query_selector("canvas").screenshot(path="out.png")
# frames: page.evaluate("i => window.__renderFrame(i)", i); page.evaluate("canvas.toDataURL('image/png')")
# downloads: ctx = browser.new_context(accept_downloads=True); with page.expect_download() as d: page.evaluate("saveCanvas('x','png')")
```

Sketch contract (put this in every generated sketch so the harness can drive it):

```js
pixelDensity(1); randomSeed(SEED); noiseSeed(SEED);
// static: draw once, then
window.__done = true;
// animated: if (frameCount >= N) { noLoop(); window.__done = true; }
// video:   window.__renderFrame = async i => { T = i / FPS; await redraw(); };
window.__info = { version: p5.VERSION, webglVersion };   // harness logs this
```

Results (`render_test/results.json`):

| Sketch | Flags | Done | Time | Distinct colours (64² sample) | Output |
|---|---|---|---|---|---|
| 2D flow field 800² | none | ✅ | 0.19 s | 341 | `sketch_2d.png` |
| WEBGL feedback + strands + instancing + GLSL hook, 30 frames | none | ✅ (deprecation warning) | 27.7 s | 967 | `sketch_webgl_none.png` |
| same | `--enable-unsafe-swiftshader` | ✅ | 28.6 s | 971 | `sketch_webgl_unsafe-swiftshader-only.png` |
| same | **angle+swiftshader set** | ✅ **no warnings** | **17.7 s** | 953 | `sketch_webgl_angle-swiftshader.png` |
| strands for/if + legacy getColor | angle set | ✅ | 0.26 s | 244 | `sketch_strands_control_flow.png` |
| raw WebGPU clear + mapAsync | webgpu set | ❌ AbortError | — | 1 | `sketch_webgpu_raw.png` (blank) |
| p5 WEBGPU compute + instancing | webgpu set | ❌ timeout | 30 s | — | — |
| frame stepping 60f → mp4 | angle set | ✅ | 3.5 s | — | `frames.mp4`, `frames/f0000{0,1,2}.png` |
| saveCanvas / saveGif downloads | none | ✅ / ✅ 55.9 KB | — | — | `saveCanvas_still.png`, `saveGif_loop.gif` |
| pixelDensity(6) print (one-off probe, `site/hires.html`; not in the default run) | angle set | ✅ 3600×2400 | — | — | `hires_print.png` |
| fake camera, flipped | fake-media + angle | ✅ | — | 75 | `sketch_fake_camera.png` |

Gotchas found: (1) `redraw()` is **async** in 2.x, so `await` it before reading pixels. (2) A shader compile error in `setup` stops `draw()` forever, so the `__done` wait times out. Always surface `pageerror` events. (3) Use device_scale_factor=1 and `pixelDensity(1)`, or screenshots come out at a different size than the canvas. (4) Serve over http: `file://` breaks `loadImage/loadShader/fetch`. (5) A canvas element screenshot is enough. You don't need `toDataURL` except for the frame loop, and that works because p5's WebGL context preserves the drawing buffer.

---

## 5. Embedding

### 5.1 Instance mode (the only mode for apps)

```js
// [SOURCE] — instance mode; async setup is fine
const sketch = (p) => {
  let img;
  p.setup = async () => { p.createCanvas(600, 400, p.WEBGL); img = await p.loadImage('/a.jpg'); };
  p.draw = () => { p.background(240); p.texture(img); p.plane(300, 200); };
};
const inst = new p5(sketch, document.getElementById('stage'));   // later: inst.remove()
```

Strands in instance mode: call `p.buildMaterialShader(cb)`. The transpiler handles instance-mode identifiers (`_runStrandsInGlobalMode` exists for the global case) `[SOURCE; instance-mode strands UNVERIFIED]`.

### 5.2 React / shadcn: @p5-wrapper/react 5.0.4

- v5 breaking changes: `ReactP5Wrapper` became **`P5Canvas`**; peer deps **p5 ≥ 2.0.0, react ≥ 19, react-dom ≥ 19**. Next.js needs `@p5-wrapper/next` (dynamic, no SSR).
- Props reach the sketch through `p5.updateWithProps = props => {…}`. The `updater` prop bridges p5 state back into React, and `fallback`, `loading` and `error` props render alternate UIs.

```tsx
// [SOURCE: package README]
import { P5Canvas, type Sketch } from "@p5-wrapper/react";
const sketch: Sketch<{ hue: number }> = p5 => {
  let hue = 0;
  p5.setup = () => p5.createCanvas(480, 320, p5.WEBGL);
  p5.updateWithProps = props => { hue = props.hue; };
  p5.draw = () => { p5.background(p5.color(`oklch(0.7 0.15 ${hue})`)); };
};
export default function Card({ hue }: { hue: number }) {
  return <div className="rounded-xl border bg-card overflow-hidden"><P5Canvas sketch={sketch} hue={hue} /></div>;
}
```

The README's add-on example imports `"p5/lib/addons/p5.sound"`, but **that path does not exist in p5 2.x**: p5.sound is a separate npm package. The working form is `window.p5 = p5; await import("p5.sound")` `[SOURCE: inspected the packages]`. In shadcn layouts, give the wrapper a fixed aspect box and size the canvas from `ResizeObserver` → `p5.resizeCanvas()`, since `windowResized` only fires on window changes `[UNVERIFIED pattern]`.

### 5.3 DOM/CSS overlays and SVG hybrids

- p5 DOM (`createDiv/createSlider/createButton/…`) still ships in core. For UI, prefer real HTML/CSS layered over the canvas: an `position:absolute` overlay with `pointer-events:none` except on controls. It's crisper, accessible and themeable, and keeps text out of WebGL, where `text()` needs `loadFont` and costs a lot.
- **SVG hybrid:** use an inline `<svg>` sibling with the same viewBox as the canvas for vector labels, annotations or plotter paths. The canvas carries fields, shaders and particles, and the SVG carries crisp geometry and text. Hit-test via `worldToScreen()` in WEBGL.
- CSS blend: `mix-blend-mode` on a transparent WEBGL canvas over HTML (`clear()` each frame) is cheap compositing `[UNVERIFIED]`.

---

## 6. Compatibility matrix (library × p5 2.x)

| Library | Version (npm, 2026-10-05) | p5 2.x status | Evidence |
|---|---|---|---|
| p5 core WEBGL + strands | 2.3.4 | **works** | `[TESTED]` render_test.py |
| p5 WEBGPU addon (`p5.webgpu.js`) | 2.3.4 | **unknown on GPU; broken headless here** | `[TESTED-negative]`; APIs verified in source |
| p5.sound | 0.4.1 | **works** (new API, see §2.1) | `[TESTED]` osc→FFT/Amplitude; README claims 1.x+2.x |
| Tone.js | 15.1.22 | **works** (independent of p5) | `[UNVERIFIED-this-run]`; p5.sound bundles Tone 15 |
| ml5 | 1.4.0 | **partial→works**: Promise constructors under 2.x; models need network | `[TESTED]` integration path; `[SOURCE]` ml5 p5Utils comment "p5 2.x does not have registerMethod" |
| p5.capture | 1.6.1 | **works** | `[TESTED]` png-zip download under 2.3.4 |
| p5.record.js | 0.3.0 | **likely works** (PF-maintained, 2.x era) | `[UNVERIFIED]` npm README |
| saveGif (core) | 2.3.4 | **works** | `[TESTED]` |
| p5.js-svg | 1.6.0 | **broken** | `[TESTED]` TypeError; README "compatible with p5.js v1.11.x"; issue #279 open |
| @p5-wrapper/react | 5.0.4 | **works (requires 2.x)** | `[SOURCE]` peerDeps `p5 >= 2.0.0`, react ≥ 19 |
| p5.js-compatibility (preload/shapes/data/events) | — | **works** (bridges 1.x code) | `[UNVERIFIED-fetch]` GitHub README |
| p5.brush | 2.2.3 | **works (requires 2.x)** | `[SOURCE]` peerDeps `p5 ^2.2` |
| CCapture.js | 2.0.0 | **unknown** | npm metadata only |
| p5.createloop | 0.3.1 (2023) | **unknown/likely stale** | npm metadata only |
| vpype (Python) | — | **n/a (post-process SVG)** | `[UNVERIFIED]` |

---

## 7. Fetch log

| # | URL / source | What | Credibility |
|---|---|---|---|
| 1 | `node_modules/p5@2.3.4/lib/p5.js`, `dist/**` (npm tarball) | Ground truth for every `[SOURCE]` claim: fn list, strands hooks, compute/storage, hook GLSL signatures, redraw async, preload removal, createFramebuffer options, saveGif options | **Highest**: the shipped code |
| 2 | `/tmp/x/arch.md` (prev. agent; p5 contributor_docs "WebGL Mode Architecture") | Framebuffer vs Graphics, retained/immediate, instanced `endShape(…, count)`, default shader uniforms | High (official contributor doc; 1.x-era wording, uniforms list may lag 2.x) |
| 3 | `/tmp/x/{shader,fbo,loading,pointer,describe}.js` (prev. agent; p5 src files) | Cross-check for module docs | High |
| 4 | `node_modules/p5.sound@0.4.1` (dist + README) | Exported classes, FFT/Amplitude semantics, Tone dependency | High |
| 5 | `node_modules/ml5@1.4.0/dist/ml5.js` + `/tmp/x/ml5.md` (README) | p5 2.x detection & promisify path | High |
| 6 | `/tmp/x/capture.md` (p5.capture README) | API, formats, limits | High (author README) |
| 7 | `/tmp/x/svg.md` (p5.js-svg README) | "compatible with p5.js v1.11.x" | High |
| 8 | `/tmp/x/wrapper.md` (@p5-wrapper/react README) | v5 rename, peer deps, updater, plugin import | High (with one stale path flagged) |
| 9 | `npm view` for p5, p5.sound, p5.js-svg, p5.capture, ml5, @p5-wrapper/react, tone, ccapture.js, p5.brush, p5.createloop, p5.tween, p5.record.js | Versions, dates, peer deps, p5.record README | High (registry metadata) |
| 10 | https://github.com/zenozeng/p5.js-svg/issues (WebFetch) | Issue #279 "[WIP] p5.js 2.0 Updates", open since 2025-04-04 | Medium-high (summarised by fetch model) |
| 11 | https://github.com/processing/p5.js/releases (WebFetch) | 2.3.x notes: P3 rename, strands `randomGaussian/color/instanceIndex`, `MAX_GIF_PIXELS`, 2D path perf | Medium: the fetch summary got the **years wrong** (said 2024), so trust npm dates (2.3.0 = 2026-05-28 … 2.3.4 = 2026-09-25) |
| 12 | https://github.com/processing/p5.js-compatibility (WebFetch) | preload.js / shapes.js / data.js / events.js | Medium-high |
| 13 | github.com/processing/p5.js/releases/tag/v2.1.0, v2.2.0 | **Failed** (permission request withdrawn); `gh api` blocked for that repo | — |
| 14 | Local execution: `render_test.py` + probes (Chromium 141, SwiftShader) | All `[TESTED]` rows | Highest for this environment |

---

## 8. Experience notes

- **The previous agent's notes were solid but stopped before execution.** It had the package set installed and READMEs captured, but no headless run. Reusing `/tmp/x/node_modules` saved the install.
- **The first WebGL run failed on all three flag sets for a reason unrelated to flags.** My GLSL `getFinalColor` used the 1-arg signature, and 2.3.4 wants `(vec4, vec2)`. The page reported `info` (WebGL2 on SwiftShader) and then hung. **Lesson:** a hang in headless p5 is usually an exception in `setup`, not a GPU problem. Read `pageerror` before blaming flags.
- **Plain headless still does WebGL on Chromium 141**, contrary to the common advice that it no longer does. It emits a deprecation warning for the automatic SwiftShader fallback, so flags are cheap insurance. The ANGLE/SwiftShader set was also the fastest (17.7 s vs ~28 s), probably because it avoids fallback negotiation. The gap reproduced across three full runs (17.2–19.3 s vs 27.7–30 s).
- **WebGPU in this sandbox:** an adapter is returned, then dies at `mapAsync`. The raw-API control test was decisive and saved time I'd otherwise have spent blaming p5.
- **p5.sound's spectrum is tiny** (max ≈ 0.011 for a full-scale saw). A sketch that maps `analyze()` from 0–255 will look dead. That's the most likely silent failure for model-written audio sketches.
- **ml5 under p5 2.x is cleaner than expected.** Detection is duck-typed on `registerMethod`, so it flips to Promise constructors automatically. The weak point is model download (blocked here).
- **The p5.js-svg breakage is total**, failing at `createCanvas`. Plotter output should not depend on a 1.x-only renderer.
- I didn't run Tone.js, MediaRecorder, p5.record.js, CCapture, vpype, tiling, or React rendering. They're marked `[UNVERIFIED]` and are the next candidates for the harness.

---

## 9. Three knowledge atoms

**Atom 1: Inspect, don't remember (shader hooks drift).** In 2.3.4 the GLSL hook `getFinalColor` takes `(vec4 color, vec2 texCoord)`, and the 1-arg form from older examples fails to compile, which silently halts the sketch. Generators should prefer JS strands with the hook-object syntax (`worldInputs.begin()…end()`, `filterColor.set()`, `instanceIndex`). When GLSL strings are needed, first paste `baseXShader().inspectHooks()` output from the pinned version into context. (Source: p5 2.3.4 `dist/webgl/p5.RendererGL.js` hook table; tested failure and fix in `render_test/`.)

**Atom 2: Headless p5 = http server + SwiftShader flags + a `__done` contract + await redraw.** Chromium (Playwright 141) renders p5 2D and WebGL with no GPU when launched with `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist`. The sketch sets `window.__done` after `noLoop()`, the harness waits on it and screenshots the canvas, and video comes from stepping `t=i/fps` with `await redraw()` (async in 2.x), `toDataURL`, then ffmpeg. WebGPU does not work in this setup, so verify it on real hardware. (Tested 2026-10-05: `render_test.py`, `results.json`.)

**Atom 3: The 2.x add-on map has three cliffs.** These are p5.sound 0.4's new semantics (no `getEnergy`, spectrum 0–1, explicit `connect` into analysers, default 32 bins), p5.js-svg (broken on 2.x, so emit geometry-first SVG instead), and the removal of `preload()` (`await` in async setup, and ml5 constructors become Promises). Everything else checked works, though some only by peer-dependency evidence: p5.capture, saveGif, @p5-wrapper/react 5 and p5.brush. (Tested smoke runs plus npm metadata, 2026-10-05.)
