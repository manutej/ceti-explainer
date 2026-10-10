# R-B · What p5.js 2.3.4 really does on the GPU, what 2.4 adds, and where the frontier starts · 2026-10-10

Scope: vendored `vendor/p5-2.3.4.min.js` (990,638 B), checked by grepping the bundle itself, plus the atlas pages
(`webgl-mode, p5-strands, gpu-instancing, release-2-4, p5-framebuffer, filter-shaders, build-geometry, frontier-2026,
open-questions`; the brief's `framebuffer` and `filter-shader` are `p5-framebuffer` and `filter-shaders` here) and web
sources listed at the end. Tags: [BUNDLE] seen in the vendored file, [MEASURED] a number from a lane in this repo,
[WEB] from a cited page, [INFER] my inference, not run. Nothing here was run on a real GPU; every timing is SwiftShader.

## 0. Three corrections to the premise
1. **There is no ANGLE_instanced_arrays on 2.3.4.** The string is absent from the bundle [BUNDLE]. p5 2.3.4 asks for a
   WebGL2 context first (`version: 2`, falls back to 1) and calls `drawElementsInstanced` / `drawArraysInstanced` directly;
   on WebGL1 it logs "Instancing is only supported in WebGL2 mode". Instancing is already public in 2.3.4 as
   `model(geometry, n)` and `endShape(mode, n)`; the strands side reads `instanceIndex` (alias of `instanceID()`, added 2.3.1;
   mapped to `gl_InstanceID`, and since #8691 it also works in the fragment stage as a flat varying).
2. **2.4 is not released.** GitHub lists v2.3.4 (25 Sep) as latest, no 2.4 RC [WEB: releases]. What is on `main` is
   `fn.instances(count)` returning a `p5.InstancesWrapper` with `sphere, box, plane, ellipsoid, cylinder, cone, torus,
   triangle, rect, quad, ellipse, arc, model, line, point, bezier, spline`; `count` may be a number or a StorageBuffer/
   StorageList [WEB: main 3d_primitives.js]. That is sugar over the draw path 2.3.4 already has, not a new GPU capability.
   Issue #8911 (instancing API) closed 2026-07-30 [WEB].
3. **`vertexProperty` is per vertex, never per instance.** The bundle has no `vertexAttribDivisor` [BUNDLE]. Custom
   properties (`vertexProperty(name, v)` in `beginShape`, and `p5.Geometry.vertexProperty(name, data, size)`) become float
   attributes of 1 to 4 components, bound by the name you gave (`aWeight`), rebuilt into buffers per geometry. The 2.4 JSDoc
   mentions "an instanced attribute buffer", but nothing on `main` that I could read shows a divisor-based path [INFER:
   unconfirmed]. Per-instance data therefore comes from a data texture or, on WebGPU only, storage buffers.

## 1. Capability table
Cost column is headless SwiftShader at 960x540 unless stated. "Lane" = a measured pattern already in `arsenal/patterns/`.

| Feature | 2.3.4 status | 2.4 (`main`) | Workaround or route | Cost |
|---|---|---|---|---|
| Instanced draw | `model(g,n)`, `endShape(m,n)`; WebGL2 only; needs a custom shader to place copies | `instances(n).sphere(r)` etc. wrapper; storage list form is WebGPU | Use `model(g,k)` now; `k = count(t)` makes the count-in exact (gl-instances) | 100k bars in one draw: 835 ms/frame [MEASURED]; 30k boxes less |
| Per-instance data | No attributes with divisor; only `gl_InstanceID` | Unconfirmed; WebGPU storage buffers (`createStorage`, `uniformStorage`) | RGBA32F texture (a `createFramebuffer({format:FLOAT, textureFiltering:NEAREST})` filled with `updatePixels`) read with `texelFetch(uData, ivec2(id % W, id / W), 0)` | 2 texels per mark; texture upload once |
| Raw divisor route | `p._renderer.GL` is the WebGL2 context: `createBuffer`, `vertexAttribDivisor` are core | same | Allowed but fragile: p5 tracks enabled attribute slots in `registerEnabled` and the current shader; restore after your draw | about 0.2 KB of glue; unmeasured |
| `vertexProperty` (shape) / `p5.Geometry.vertexProperty` | Present, float 1..4, name is the GLSL attribute; friendly error if counts mismatch | same | Declare `in float aX;` in a `createShader` GLSL 300 es vertex; strands has no builder that reads it in 2.3.4 [BUNDLE: no strands attribute API found] | 4 B x size per vertex in JS arrays then a GL buffer |
| p5.strands uniforms | `uniformFloat/Int/Bool/Vec2/3/4/Texture(name, default?)`, also `shared<Type>` and `varying<Type>` (one generator) | adds matrix types (`uniformMat*`, #8992, #8953) | `shader.setUniform` with arrays for mat4 until then | free |
| strands control flow | `if/else`, `for` since 2.1; no `while` documented | same | Keep loops fixed-count; avoid assigning in both branches (bug below) | per-fragment loops dominate cost |
| strands textures | `getTexture(tex, uv)`, `uniformTexture(name)`; framebuffers pass directly | same | OK | one sample is cheap on GPU, slow per tap on SwiftShader |
| strands outputs | One colour out per hook; compute is WebGPU only (`buildComputeShader`) | same | No MRT; see framebuffers | n/a |
| strands precision | Float literals are printed with 4 decimals: `0.00001` becomes `0.0000` (#8884, open) | same | Pass tiny constants as uniforms | free |
| Framebuffer depth | `fb.depth` is a NEAREST depth texture, 0..1, default `depthFormat: FLOAT` (32F on WebGL2) | same | `texture2D(depth, uv).r`; linearise with the camera's near/far; DoF = gl-post (16-tap gather) | 1 extra pass |
| Framebuffer formats | `UNSIGNED_BYTE` (default), `HALF_FLOAT`, `FLOAT`; `RGB` falls back to `RGBA`; WebGL2 float needs `EXT_color_buffer_float` and `EXT_float_blend` | same | Float for feedback and data textures | 4x to 16x memory per pixel |
| Framebuffer MSAA | `antialias: true|n` uses a multisample renderbuffer, clamped to `MAX_SAMPLES`, then a blit | same | Use on the 3D layer only; set `antialias:false` on data and depth buffers | multiplies fragment cost [INFER] |
| MRT | None: one colour texture per framebuffer, no `COLOR_ATTACHMENT1` in bundle [BUNDLE] | none seen | Several passes, or raw `gl.drawBuffers` on a hand-made FBO (about 60 lines) | each extra pass = a full scene draw |
| Filter shader | `createFilterShader(frag)` (GLSL ES 1.00 with `tex0`, `texelSize`, `canvasSize`) and `buildFilterShader` with a `filterColor` hook; `filter(shader)` | same | See section 3 | 0.4 s plain vs 1.6 s with a 12-tap filter at 1080p backing [MEASURED] |
| `buildGeometry` | Bakes to one `p5.Geometry`; indices go Uint32 past 65,535 (WebGL1 would throw); cache of 1,000 geometries (FIFO eviction bug #8597 closed) | same | Bake once, `model()`; seeded random; `freeGeometry` when done | CPU and GC at build; no published vertex ceiling |
| Transparency | Blend `ONE, ONE_MINUS_SRC_ALPHA`, depth `LEQUAL`, no sorting; #3736 open since 2018 | same | Section 5 | free to bad |
| Text in WEBGL | GPU vector text (not SDF): quadratic curves in 64x64 byte pages, 9x9 grid, 8-bit coords, LRU 200 pages, one draw call per glyph; stroke is disabled | same | `textToContours` (2D polylines), `textToModel` (extruded, no UVs so no `texture()`), `textToPoints` | font TTF 43 KB, 4 KB subset (kit2 `fonts3d`) |
| Lights | ambient, directional, point, spot, image; max 5 of each type; per-pixel Phong by default | same | Material hooks for rim, toon, ramp | Lit shader is 10-50x slower per fragment on software GL: 5-30 s/frame at 1080p [MEASURED, webgl-scene card] |
| Shadows | None. `shadow` occurs 0 times in the bundle [BUNDLE] | none known | Section 6 | one extra depth pass + taps |
| WebGPU | beta add-on, async `createCanvas`; compute and storage | same | Not renderable in the headless sandbox (`mapAsync` fails) [MEASURED, references/p5/webgl-strands.md] | unusable here |

## 2. Instancing, in detail
- **What works today (proven in repo).** `gl-instances` draws 10k dots, 30k boxes, 50k brushed points and 100k bars as one
  `model(geom, k)` under a GLSL 300 es shader; per-mark x, y, z, size, height, colour, alpha, flag come from an RGBA32F
  texture read with `texelFetch(gl_InstanceID)`; arrival order = instance order, so the count-in is the instance count.
  Heaviest variant 835 ms/frame, all variants re-seek identical. No strands, no raw buffers, no `instances()`.
- **Strands route.** A `buildMaterialShader` hook does `worldInputs.position.x += ...instanceIndex...`. The same data
  texture works there through `getTexture`, but strands has no integer `texelFetch`, so use `getTexture` with a half-texel
  offset and NEAREST filtering [INFER].
- **Known instancing bugs.** #8374: a strands instanced shader renders only one instance after the first frame when it is the
  only shader used in the frame (workaround: touch another shader in the same frame) [WEB, open]. #8575: strands globals in
  instance mode [WEB, open]; #9180 (arrow functions with parameters) closed 2026-09-20.
- **What 2.4 changes for us.** Nothing we cannot do: nicer call sites. Do not wait for it; do not vendor `main`.

## 3. Framebuffers and filter shaders
- Depth for DoF: draw the scene into `createFramebuffer({depth:true, antialias:false})`, then bind `fb.depth` in a filter
  shader. Depth is non-linear in perspective; `perspective(fov, aspect, near, far)` defines what 0 and 1 mean. gl-post
  supports window depth and a packed linear depth for orthographic cameras.
- Feedback loop warning (#6928, open): reading `fb.color` as a texture while it is still the render target logs a WebGL
  feedback warning and the image stops updating. End the framebuffer before using it; ping-pong two buffers.
- `filter(shader)` in WEBGL runs on an internal `filterLayer` framebuffer sized to the active target: clear layer, draw,
  copy back; blur is a special two-direction case with a temp layer [BUNDLE]. So each `filter()` is at least two full-size
  passes plus your shader, and chaining N filters is N of those. Own the chain instead: `fbA.begin(); ...; fbA.end();
  fbB.begin(); filter/shader pass reading fbA; fbB.end();` and one final `image()`. Cost is dominated by taps x pixels
  (960x540 at density 2 is 2.07 M backing pixels per tap).
- Changing `width`, `height` or `density` recreates every texture [WEB: p5.Framebuffer.js]; never do it per frame.

## 4. buildGeometry and memory
- Hard facts: retained cache holds 1,000 geometries; past that the oldest is freed (FIFO bug #8597, closed 2026-03-02, the
  bundle now uses a keyed buffer cache). `Geometry` stores vertices as `p5.Vector` objects and normals/uvs/colours as JS
  arrays before upload [BUNDLE], so CPU memory is several times the GPU memory [INFER]. No published vertex ceiling
  exists (atlas open-questions: "no quantitative benchmarks"). Keep one small mark mesh plus instancing; one merged
  Geometry per scene when marks differ (gl-pointcloud: 4 corners per point, one `model()`).
- `curveDetail`, `noStroke()`: strokes are triangle-expanded and slow on software GL; default to `noStroke()` in dense 3D.
- Perf regressions in 2.x [WEB/atlas]: POINTS drawing in WEBGL (50k points under 10 fps vs about 60 in 1.11 on an M4),
  `pixelDensity` not inherited by `createGraphics` (#8289). Use instanced quads, not `point()`.

## 5. Transparency
p5 never sorts. Options, cheapest first: (1) opaque marks whose alpha mixes toward the background colour in the shader
(what gl-instances does); (2) additive or screen blend with `depthMask(false)` for glows (order independent); (3) sort the
data once, back to front, for the keyed camera, because instance order is draw order (arrival order and depth order only
coincide if the film chooses so; re-sort only when the camera changes); (4) screen-door or blue-noise `discard` with
alpha as coverage, then MSAA to smooth it; (5) weighted blended OIT, which needs MRT (not in p5; raw GL). Slabs for
gl-volume: sort slab planes in JS (a few dozen), never per fragment.

## 6. Lights and shadows
No shadow maps (0 hits; Pagurek's "Contact Shadow" is a screen-space filter, not a shadow map, atlas `filter-shaders`).
Workarounds in order of cost:
- **Planar projected shadow**: `applyMatrix` with a projection onto the ground plane, draw the same geometry flat in the
  shadow colour with alpha, `depthMask(false)`. Zero extra passes, exact for floors. Instanced shapes: do it in the vertex
  shader (`pos.y = ground; pos.xz -= pos.y_old * lightDir.xz / lightDir.y`).
- **Baked contact shadow / AO**: darken per-vertex colour or a ground texture from data at setup (pure, free per frame).
- **Hand-made shadow map, all inside p5**: `shadowFb = createFramebuffer({width:1024, height:1024, density:1, antialias:false})`;
  `shadowFb.begin(); setCamera(shadowFb.createCamera()); ortho(...)` then draw the scene with a depth-only shader; in the
  main pass pass `shadowFb.depth` and the light matrix (`setUniform('uLightVP', float16)`) to a `createShader` fragment that
  does a 3x3 PCF compare. Needs a raw `createShader`, since strands has no matrix uniforms in 2.3.4. Cost: one extra scene
  draw plus 9 taps per lit fragment: in the 5-30 s/frame class on software GL at 1080p [INFER from webgl-scene card];
  keep it for stills or one hero chapter.

## 7. Text
Vector text is crisp at any scale with no atlas, but: stroke disabled, single material colour, 200-page LRU, glyph too
complex throws "font is too complex to render in 3D", `.otf/.ttf` only [WEB: text.js]. No SDF/MSDF anywhere in p5. For
labels the factory already pins to 3D points with `worldToScreen` and draws flat SVG (preferred: free, sharp, gated).
For text that must live inside the 3D scene with outlines or glow, build an MSDF atlas offline (a PNG data URL in the
film) and draw glyph quads instanced: about 5 to 20 KB per face, plus a 40-line fragment shader. Not needed today.

## 8. pixelDensity, MSAA and the headless profile
- Density 2 quadruples fragments. kit2 uses density 2 for the 960x540 basis (1920x1080 backing).
- `antialias` default in the bundle is `navigator.userAgent.toLowerCase().includes("safari")`, which is also true in Chrome
  and headless Chromium (their UA contains "Safari") [BUNDLE]. The docs say false except Safari; the code says true on every
  Chromium. Set it explicitly (`setAttributes({antialias:false})` before the first draw; calling it later reinitialises the
  context) and use `fb` `antialias` where wanted.
- Cheap on SwiftShader: instanced draws (vertex-bound), baked `model()` calls, `texelFetch`, a few flat quads.
- Slow: fragment-heavy passes (lit Phong, DoF/bloom gather, `filter()` chains), large or float framebuffers, MSAA, density 2,
  `readPixels` ("GPU stall due to ReadPixels"), anything WebGPU (unusable). Numbers [MEASURED, repo]: 0.4 s plain and 1.6 s
  with a 12-tap filter at 1080p backing; 800x800 feedback plus instancing 1 to 1.7 fps; 100k instanced bars 0.835 s;
  `MAX_TEXTURE_SIZE` 8192; Wave GL budget ≤ 1.5 s/frame heaviest variant.

## 9. Known 2.3.x WEBGL and strands bugs to design around
| Issue | State | Effect | Defence |
|---|---|---|---|
| #8374 instanced strands shader, one instance after frame 1 | open | wrong picture | Use the custom-GLSL route (gl-instances) |
| #9265 strands: else branch overwrites a saved value | open | wrong colour | No variable written in both branches; use `mix`/`step` |
| #9260 updating `inputs.color.rgb` in a strands `for` loop throws | open | build error | Accumulate in a local `vec3`, assign once |
| #9252 `**` crashes the transpiler | open | build error | `pow()` |
| #8884 float literals rounded to 4 decimals | open | silent precision loss | uniforms for small constants |
| #6928 framebuffer feedback warning | open | stale texture | end fb before sampling; ping-pong |
| #9138 framebuffer warning in Safari | open | console noise | none needed headless |
| #3736 no transparency ordering | open | wrong blends | section 5 |
| #8796 no mipmaps for images; #5994 no 16-bit textures; #6439 no UBOs | open | quality/limits | float framebuffer textures; arrays of uniforms |
| #8597 geometry cache FIFO eviction | closed | fixed in bundle | none |
| strands API tagged `@beta`, names moved 4 times in 2.1 to 2.3 | n/a | breakage on upgrade | stay pinned to 2.3.4 |

## 10. The frontier p5 cannot close (or closes only with raw GL)
| Gap | Needed by | Honest verdict |
|---|---|---|
| Per-instance attributes (divisor) | 100k+ marks with per-mark data | Closed by data texture today; raw `vertexAttribDivisor` optional |
| MRT (G-buffer, picking IDs with colour, OIT) | deferred looks, correct transparency | Real gap; about 60 lines of raw GL2 on a hand-made FBO |
| Order-independent transparency | volumes, dense overlays | Gap; approximations in section 5 cover films |
| Shadow maps as a first-class feature | lit 3D scenes | Closable inside p5 by hand (section 6) |
| GPU compute (binning, histograms, sorting) | big data prep on GPU | WebGPU only; broken headless. Do it in JS at setup (pure, seeded) |
| SDF/MSDF text in 3D | text that lives in the scene | Gap, low demand: SVG pins win |
| Instanced lines/ribbons with joins | flows, networks | Build ribbon meshes in JS at setup; width and travel in the shader (gl-ribbons) |
| Mipmaps, anisotropic filtering, 16-bit textures, UBOs | dense textured planes, big arrays | Minor for these films |
| Scene graph, culling, LOD, picking | interactive explorers | Not a film need; the clock is pure |

Net: **nothing the Wave GL lanes need is out of reach of p5 2.3.4 + custom GLSL + framebuffers**, except MRT/OIT, which
no lane has asked for.

## 11. Second renderer next to p5: feasibility and cost
Budget: page < 1.3e6 bytes (G8, raw bytes). p5 is 990,638 B, so everything else, fonts included, has 309 KB, and shipped
films leave about 35 to 50 KB spare [skills/atelier-draft/references/chain-recipes.md]. Law: vendored p5 and fonts only.

| Candidate | Size (measured by me from npm tarballs) | Fit |
|---|---|---|
| three.js 0.186.1 | no prebuilt min file in the package; esbuild tree-shaken minimal renderer (WebGLRenderer, Scene, PerspectiveCamera, InstancedMesh, BoxGeometry, ShaderMaterial, WebGLRenderTarget) = 532,263 B (132,771 gz); `import *` = 742,748 B | p5 + three = 1.52 MB minimum, 220 KB over G8 before fonts. Needs a new tier and budget row; not a trim |
| regl 2.1.1 | `dist/regl.min.js` 86,652 B (28,438 gz), MIT | Fits only if fonts shrink or the cap rises about 40 KB; but it is WebGL1 only: it requests `ANGLE_instanced_arrays` and `WEBGL_draw_buffers` and has no `webgl2` path (#378, #623 open). `regl(gl)` accepts an existing context [BUNDLE], but on p5's WebGL2 context those extensions are not exposed [INFER, not run], so instancing and MRT, the reasons to want it, would fail. Wrong tool |
| House raw-GL2 shim | 4 to 6 KB of our code on `p._renderer.GL` | Fits. Not a vendored library; touches an underscore API, so pin to 2.3.4 |

**Hybrid sanity.**
- *three.js drawing into a p5 framebuffer*: separate canvas then upload as a texture (p5.Texture accepts canvas-backed
  elements) costs a per-frame copy plus, on SwiftShader, a CPU readback; a shared context works (`new WebGLRenderer({canvas,
  context})`, and three documents `resetState()` for contexts shared across libraries [WEB]), but p5 has no equivalent
  reset: it caches the current shader, enabled attribute slots, bound textures and the active framebuffer, so every hand-over
  needs a manual restore. Reverse (p5 pixels into three): `CanvasTexture` from a p5 canvas, same copy. I found no published
  precedent of either pairing with p5 2.x [INFER]. Two clocks, two seeds, two GC profiles also break the one-clock law and
  the G3 clock scan. **Not sane for the factory.**
- regl beside p5 on its own canvas works technically but doubles the context count and loses the shared depth buffer.

## 12. Recommendation
1. **Do not vendor a second renderer.** three.js breaks the size gate by 220 KB; regl is WebGL1-only and cannot use p5's
   context for what we want. No gap in section 10 is a film need except MRT/OIT.
2. **Stay on p5 2.3.4. Do not adopt `main`/2.4 for instancing.** `model(g, k)` plus a data texture is the proven route.
3. **If a lane proves it needs MRT or per-instance attributes**, write `arsenal/core/gl2.js` (≤ 6 KB, house code): a
   `makeFBO(w,h,nTargets,fmt)`, `instancedBuffer(name, data, divisor)`, and `restoreP5State(p)` that rebinds
   framebuffer/program/array buffer. Gate with the existing G3 clock scan; record in the card which route was used.
4. **Decision row (proposed, dated 2026-10-10, for docs/DECISIONS.md):** "D11 · GL below p5. Use of `p._renderer.GL` is
   allowed for instancing, MRT and depth passes, inside a pattern, with the route named in its card; no second vendored
   renderer. Revisit when p5 2.4 ships `instances()` and when a film needs OIT or a size cap above 1.3 MB." A vendored
   renderer (three.js) would be a separate row that also raises the page tier (suggested 1.9 MB for a named "GL3D" tier),
   adds a licence file under `vendor/licenses`, and adds SHA256SUMS entries; I do not recommend it.
5. **Defences to add to the cards of GL lanes:** set `antialias` explicitly; no variable assigned in both branches of a
   strands `if`; no `**`; tiny float constants as uniforms; one `filter()` per reveal window.

## Sources
- p5.js releases (v2.3.4 latest, 25 Sep; no 2.4 RC): https://github.com/processing/p5.js/releases
- Instancing API issue #8911: https://github.com/processing/p5.js/issues/8911
- `instances()` on main: https://github.com/processing/p5.js/blob/main/src/webgl/3d_primitives.js
- Instancing preview (atlas S275): "Drawing a Forest in One Line", Processing Foundation blog
- Strands bugs: https://github.com/processing/p5.js/issues/8374 , /8575 , /8884 , /9252 , /9260 , /9265 , /9180 , /8691
- Strands matrices: https://github.com/processing/p5.js/issues/8992 , https://github.com/processing/p5.js/issues/8953
- Transparency order #3736: https://github.com/processing/p5.js/issues/3736
- Geometry cache #8597: https://github.com/processing/p5.js/issues/8597
- Framebuffer feedback #6928: https://github.com/processing/p5.js/issues/6928
- Mipmaps #8796, 16-bit #5994, UBO #6439: https://github.com/processing/p5.js/issues/8796 , /5994 , /6439
- p5.Framebuffer source v2.3.4: https://raw.githubusercontent.com/processing/p5.js/v2.3.4/src/webgl/p5.Framebuffer.js
- WebGL text source v2.3.4: https://raw.githubusercontent.com/processing/p5.js/v2.3.4/src/webgl/text.js
- RendererGL source v2.3.4: https://raw.githubusercontent.com/processing/p5.js/v2.3.4/src/webgl/p5.RendererGL.js
- WebGL mode architecture (light cap 5, attributes): https://raw.githubusercontent.com/processing/p5.js/main/contributor_docs/webgl_mode_architecture.md
- Strands intro tutorial: https://raw.githubusercontent.com/processing/p5.js-website/main/src/content/tutorials/en/intro-to-p5-strands.mdx
- Layered rendering with framebuffers: https://raw.githubusercontent.com/processing/p5.js-website/main/src/content/tutorials/en/layered-rendering-with-framebuffers.mdx
- Optimizing WebGL sketches: https://raw.githubusercontent.com/processing/p5.js-website/main/src/content/tutorials/en/optimizing-webgl-sketches.mdx
- regl README and issues: https://github.com/regl-project/regl , https://github.com/regl-project/regl/issues/378 , /623 ; npm https://registry.npmjs.org/regl/latest
- three.js npm (0.186.1): https://registry.npmjs.org/three/latest ; `resetState()` in `src/renderers/WebGLRenderer.js` of the tarball
- Local: `vendor/p5-2.3.4.min.js` (greps), `arsenal/patterns/{gl-instances,gl-post,gl-pointcloud,webgl-scene}`,
  `references/p5/webgl-strands.md`, `factory/kit2/README.md` "Renderer webgl", `arsenal/WAVE-GL.md`, atlas pages above.
- Unreachable from this sandbox (DNS): p5js.org, beta.p5js.org, davepagurek.com, threejs.org docs.
