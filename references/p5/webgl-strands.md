# p5 2.3.4 — WebGL, framebuffers, p5.strands, instancing

*Part of the field guide; index: `../p5-2x-field-guide.md`. Status tags [TESTED]/[SOURCE]/[UNVERIFIED] as in docs/research/01 and 04.*

### 5.0 Read this first: instance mode, origin, scope (the snippets below are written in global mode)
- **Instance mode** (the studio template): prefix every p5 function inside strands callbacks (`p.sin`, `p.noise`,
  `p.millis`, `p.uniformFloat`, `p.uniformTexture`, `p.getTexture`) and pass `{ p }` as the scope argument.
  Hook objects (`worldInputs`, `filterColor`, `finalColor`) and `[x, y, z]` vector literals stay bare.
- **Scope is re-compiled, not closed over.** For a framebuffer that is swapped every step (ping-pong), pass a
  *mutable holder*: `buildFilterShader(cb, { p, G })` and read `p.uniformTexture(() => G.A)` inside.
- **Origin is the centre in WEBGL.** Blit buffers with `p.image(fb, -w/2, -h/2)` (or `imageMode(CENTER)`);
  wrap 2D-style drawing in `translate(-w/2, -h/2)`.
- **Glow without `blendMode(ADD)`** (a cliché fingerprint): screen-composite in a strands filter,
  `out = 1 − (1 − base) · (1 − light)`, with the light layer in its own framebuffer; earn brightness with value
  structure around it.
- **Numbers for uniforms:** `pal.rgb01('ink')` → `[r, g, b, a]` in 0–1 (Studio runtime parses any CSS colour).

1. **Headless rendering works today for 2D and WebGL** (Playwright Chromium + SwiftShader, no GPU). Recommended flags: `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist`. Plain headless also still works on Chromium 141, but it logs a deprecation warning for the automatic software-WebGL fallback, so don't build on it. Script: `research/render_test.py`; sample outputs: `research/render_test/*.png`.
2. **WebGPU does not render headless here.** `navigator.gpu` hands back a SwiftShader adapter, but `mapAsync` fails, and so does a canvas present, with "A valid external Instance reference no longer exists". A **raw WebGPU** page fails the same way, so the environment is at fault, not p5. Plan on a real GPU for WEBGPU/compute work.
3. **p5.strands is the 2.x shader story.** 2.3.x uses a **hook-object syntax**: `worldInputs.begin() … .end()`, `filterColor.set(…)`, `finalColor`, `pixelInputs`, `combineColors`, `instanceIndex`. It's wrapped in `buildMaterialShader / buildFilterShader / buildColorShader / buildStrokeShader / buildNormalShader / buildComputeShader`. JS `for` and `if` compile to real GLSL `[TESTED]`. The 2.0-era callback style (`getColor((inputs, canvasContent) => …)`) still works in 2.3.4 `[TESTED]`.
4. **GLSL-string hook signatures drift between versions.** In 2.3.4, `getFinalColor` is `(vec4 color, vec2 texCoord)`, and a 1-arg override fails to compile `[TESTED]`. Call `shader.inspectHooks()` before you write any GLSL hook.
5. **Library status on 2.x:** p5.sound 0.4.1 ✅ · p5.capture 1.6.1 ✅ · saveGif ✅ · ml5 1.4.0 ✅ (Promise path; model download not verified offline) · **p5.js-svg 1.6.0 ❌ broken** (TypeError on `createCanvas(…, SVG)`) · @p5-wrapper/react 5 ✅ by peer-dep (p5 ≥ 2, React ≥ 19).
6. **For video, use deterministic stepping over real time.** Drive `t = frame/fps`, `await redraw()` (it is **async in 2.x**), pull `canvas.toDataURL()`, then stitch with ffmpeg. 60 frames at 480×270 WebGL took about 3.5 s headless `[TESTED]`.

### 5.2 Framebuffers (`createFramebuffer`) — the 2.x workhorse

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

### 5.3 p5.strands — JS-authored shaders (2.3.x syntax)

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

### 5.4 Hooks with GLSL strings (`baseMaterialShader().modify({...})`)

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

### 5.5 Raw GLSL: `createShader`, `loadShader`, `createFilterShader`, `filter()`

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

### 5.6 Instancing

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

### 5.7 Experimental WebGPU renderer and compute (verified in source, **not renderable headless here**)

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

### 5.8 Performance tips (WebGL, 2.x)

- Keep feedback, trails and post-FX in **framebuffers**. Avoid `p5.Graphics` as a texture, because it uploads every frame.
- Retained beats immediate: wrap static geometry in `buildGeometry()` and draw it with `model()`. Use instanced `model(g, n)` for thousands of copies.
- Strokes are expensive in WebGL: each one is extruded into quads and has its own shader. Default to `noStroke()` on dense 3D. Note that the `[TESTED]` sphere with a default stroke rendered as a visible wireframe.
- Never call `loadPixels()/get()` per frame. SwiftShader logged "GPU stall due to ReadPixels" whenever we read back.
- Pin `pixelDensity(1)` for live work and raise it only for stills. SwiftShader throughput was ~1–1.7 fps for an 800² feedback + instancing scene (30 frames in 17.7–28.6 s depending on flags). Budget headless WebGL renders accordingly.
- Strands loops must have constant bounds, and both sides of a branch must produce the same type (phi nodes).

---
