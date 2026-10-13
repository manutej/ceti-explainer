# 01 — p5.js 2.x Official Documentation, Read Deeply

**Lane:** official p5.js 2.x docs (source JSDoc, contributor docs, website repo, compatibility repo)
**Target version:** p5 **2.3.4** (npm `latest`, published 2026-09-25). `r1` tag = 1.11.13 (legacy, unmaintained).
**Date:** 2026-10-05
**Method:** p5js.org is blocked here, so docs were read from source: shallow clones of `processing/p5.js` (tag `v2.3.4` **and** `main`), `processing/p5.js-website`, `processing/p5.js-compatibility`, plus a blob-less history clone for changelogs. Every API listed was checked against the installed `p5@2.3.4` build, and most were **executed** in headless Chromium 1194 (Playwright, SwiftShader GL) through a harness in `/tmp/p5check/h/`.

**Confirmation legend** (the "Src" column in the cheat-sheet):
- **R**: run. Executed in headless Chromium against `lib/p5.js` 2.3.4 and behaved as documented.
- **L**: in the lib. Present on `p5.prototype`/instance or as a static in the 2.3.4 build, and documented in the v2.3.4 JSDoc, but not exercised.
- **D**: documented only. Appears in the tag's JSDoc or the docs, but its runtime behaviour wasn't verified (usually WebGPU, because of the headless GPU limits below).
- **✗**: not in 2.3.4 at all. Removed, renamed, or so far only on `main`.

---

## 1. Executive summary

**What changed in 2.x.** p5.js 2.0 (beta in early 2025, 2.0.0 stable around 2025) was a ground-up rewrite on ES modules. Seven things change how code must be written:

1. **Async loading replaces `preload()`.** Every `load*()` call returns a `Promise`. Write `async function setup()` and `await loadImage(...)`. `preload` no longer exists (confirmed: `typeof preload === 'undefined'`). Callbacks still work. Since 2.3.2 p5 shows a CSS loading spinner while an async `setup()` runs.
2. **The custom-shape API was unified.** `curveVertex` became `splineVertex`, `curve` became `spline`, and `curvePoint`/`curveTangent` became `splinePoint`/`splineTangent`. `curveTightness(t)` is now `splineProperty('tightness', t)`. `quadraticVertex` was removed. **`bezierVertex(x, y)` now takes one point per call**, and `bezierOrder(2|3)` sets quadratic or cubic. `endShape(CLOSE)` closes splines smoothly, so the duplicated end points are no longer needed. `beginGeometry`/`endGeometry` were removed in favour of `buildGeometry(cb)`. `bezierDetail` was removed; `curveDetail` covers both.
3. **Color is built on colorjs.io.** `colorMode()` accepts `RGB, HSB, HSL, HWB, LAB, LCH, OKLAB, OKLCH, RGBP3`. A canvas can be created as `P2DP3` (Display-P3 wide gamut). The 2.0 notes called these `RGBHDR`/`P2DHDR`; PR #8975 in the 2.3.x line renamed them to **P3**. New in 2.x: `paletteLerp()`, `color.contrast()` (WCAG21/APCA) and `color.toString(format)`.
4. **Typography was rewritten.** `loadFont` accepts `.ttf`/`.otf` files, CSS URLs (Google Fonts) and `@font-face` strings; CSS fonts work in 2D only. `textWeight()` drives variable fonts. `font.textToPoints()`, `font.textToContours()`, `font.textToPaths()` and `font.textToModel()` (extruded 3D) are **methods on `p5.Font`**, not globals. **`textWidth()` now returns a tight bounding box that ignores leading and trailing spaces**; `fontWidth()` is the old, looser measure.
5. **Input changes.** `mouseButton` is an object `{left, right, center}`. Keyboard handling uses `key` (character), `code` (physical key, e.g. `'KeyA'`, `'ArrowUp'`) and `keyIsDown()`. Constants are strings: `UP_ARROW === 'ArrowUp'`, `ENTER === 'Enter'`. Mouse and touch go through the Pointer API, and `touches[]` holds the active pointers. The `touchStarted`/`touchMoved`/`touchEnded` handlers are gone.
6. **Shaders: p5.strands (beta/experimental).** You write shader logic in JavaScript with `buildMaterialShader(cb)`, `buildFilterShader(cb)`, `buildColorShader`, `buildStrokeShader` and `buildNormalShader`. The equivalent long form is `baseXShader().modify(cb)`. Inside the callback you edit hook blocks (`worldInputs.begin() … .end()`, `filterColor.set(...)`, `finalColor`, and others). There are also `strokeShader()` and `imageShader()`. In 2.x, **`shader()` always applies to fills**; p5 no longer switches it off silently.
7. **WebGPU (experimental, 2.2+) and compute shaders (2.3+)** ship as a separate add-on file, `p5.webgpu.js`. `await createCanvas(w, h, WEBGPU)`, `createStorage(data)`, `buildComputeShader(cb)`, `compute(shader, x, y?, z?)` and `uniformStorage()`. In WebGPU, `loadPixels()`/`get()` must be awaited.

Other removals: `createStringDict`, `createNumberDict`, `append`, `arrayCopy`, `concat`, `reverse`, `shorten`, `sort`, `splice`, `subset` (use native JS). The add-on API is now `p5.registerAddon((p5, fn, lifecycles) => …)`; `registerPreloadMethod` is gone.

**What an agent must know to write correct 2.x code (the short list):**

- `async function setup()` + `await` for all assets. Never write `preload()`. Never make `draw()` async: the source says rAF does not await it, so frames overlap.
- **Always put `<meta charset="utf-8">` in the HTML**, or serve JS with a UTF-8 charset. The 2.3.4 bundle contains Greek identifiers (`const ε`, `κ`, `π` from colorjs.io). Decoded as Latin-1, p5 dies with `SyntaxError: Missing initializer in const declaration` before `setup()` runs. *Verified by bisection.*
- Write curves as `splineVertex` or `bezierVertex(x, y)` with one point per call; never use `curveVertex`, `quadraticVertex` or the 6-argument `bezierVertex`.
- Write `createVector(0, 0)` or `createVector(0, 0, 0)` explicitly. Vectors can have any dimension; the no-argument form is still 3D but triggers an FES warning.
- Call `font.textToPoints(str, x, y, {sampleFactor})` on the font object. In WEBGL, text needs a **file** font loaded with `loadFont`.
- **p5.strands callbacks are re-compiled from source with `new Function`, so closures over local variables are lost.** Pass locals in the `scope` argument, `buildMaterialShader(cb, { amp, p })`, or use top-level globals. In **instance mode**, prefix every p5 function inside the callback (`p.sin`, `p.noise`, `p.millis`, `p.uniformFloat`, `p.getTexture`) and pass `{ p }`. Hook objects (`worldInputs`, `filterColor`, `finalColor`) and the `[x, y]` vector literals stay bare. *All verified at runtime.*
- For deterministic headless renders: `pixelDensity(1)`, `randomSeed(s)`, `noiseSeed(s)`, set `window.__done` at the end of the last `draw()`, and use WEBGL rather than WEBGPU. Two renders with the same seed produced byte-identical PNGs in 2D and WEBGL.

---

## 2. API cheat-sheet by domain (2.3.4)

Status: **new** (in 2.x) / **chg** (changed) / **rm** (removed) / **same**. Src column uses the legend above.

### 2.1 Lifecycle / environment
| Signature | Status | Src | Notes |
|---|---|---|---|
| `async function setup()` | chg | R | Awaited by p5 (`await context.setup()`). Canvases created during setup stay hidden until it finishes. |
| `function draw()` | same | R | **Do not make it async**: rAF won't await it (comment in `main.js`). |
| `preload()` | **rm** | R(✗) | Not called. The `preload.js` compat add-on restores it. |
| `createCanvas(w=100, h=100, renderer?, canvasEl?)` → `p5.Renderer` | chg | R | Renderers: `P2D`, `WEBGL`, `WEBGL2`, `P2DP3`; `WEBGPU` returns a **Promise**. A default 100×100 canvas always exists. |
| `resizeCanvas(w,h,noRedraw?)`, `noCanvas()` | same | L | |
| `createGraphics(w,h,renderer?,canvas?)` | same | R | Inherits pixelDensity. |
| `pixelDensity(val?)` / `displayDensity()` | same | R | Defaults to display density. `pixelDensity(1)` gives backing size = width × height (verified 200×120). |
| `frameRate(fps?)`, `getTargetFrameRate()`, `deltaTime`, `millis()`, `frameCount` | same | R | `millis()` restarts at 0 when draw begins. |
| `noLoop()/loop()/isLooping()/redraw()` | same | R | |
| `push()/pop()` | same | L | |
| `describe()/textOutput()/gridOutput()` | same | L | text/gridOutput skipped with a warning in WEBGL. |
| `p5.disableFriendlyErrors = true` | same | L | FES can cost up to about 10× (website tutorial). `p5.min.js` already strips most of FES. |
| Loading spinner (`loading` add-on, 2.3.2+) | **new** | D | Fixed-position `.loading-indicator` div while setup runs. If setup throws, it **stays** (seen in harness). |

### 2.2 Async loading / IO
| Signature | Status | Src | Notes |
|---|---|---|---|
| `await loadImage(path, [ok], [fail])` → `Promise<p5.Image>` | chg | R | Callback form verified. A 404 **rejects** the promise (`Not Found`), so wrap it in try/catch. |
| `await loadFont(path, [name], [options], [ok], [fail])` | chg | R | path = .ttf/.otf, CSS URL, or `@font-face` string (CSS forms are 2D only). `options.sets` (experimental). |
| `loadJSON/loadStrings/loadXML/loadBytes/loadBlob/loadModel/loadShader/loadTable` | chg | L | `loadBytes` returns `Uint8Array` directly. `loadTable(file, separator, header)` replaced the extension argument. `loadBlob` is new. |
| `loadFilterShader(file)` (beta) | **new** | L | The file can be a p5.strands `.js` or a GLSL fragment. |
| `loadMaterialShader/loadStrokeShader/loadColorShader/loadNormalShader` | **new** | L | |
| `httpGet/httpPost/httpDo` | same | L | Return promises. |
| `Promise.all([...])` for parallel loads | — | D | Website example `16_parallel_loading_promise`. |

### 2.3 Shape
| Signature | Status | Src | Notes |
|---|---|---|---|
| `beginShape(kind=PATH)` | chg | R | kinds: `PATH` (default), `POINTS, LINES, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, QUADS, QUAD_STRIP`. |
| `endShape(mode?, count?)` | chg | R | `CLOSE` closes splines smoothly. `count` instances the shape (WebGL). |
| `vertex(x,y,[z],[u],[v])` | same | R | |
| `bezierVertex(x,y,[z],[u],[v])` | **chg** | R | **One point per call.** The first call anchors; after that, each group of `bezierOrder()` points is one curve. |
| `bezierOrder(2\|3)` / `bezierOrder()` | **new** | R | Default 3. |
| `splineVertex(x,y,[z],[u],[v])` | **new** (was curveVertex) | R | |
| `splineProperty('tightness'\|'ends', v)` / `splineProperties({tightness, ends})` | **new** | R | `ends`: `INCLUDE` (default, passes through endpoints) / `EXCLUDE`. Calling `splineProperties()` with no args triggers an FES warning in 2.3.4 but still returns `{tightness}`. |
| `spline(x1..y4)`, `splinePoint`, `splineTangent` | **new** (rename) | L | |
| `bezier(x1..y4)`, `bezierPoint`, `bezierTangent` | same | L | |
| `beginContour()` / `endContour(mode=OPEN)` | chg | L | Default is now OPEN; use `endContour(CLOSE)`. |
| `curveDetail(res)` | chg | L | WebGL only; covers Bézier and spline. |
| `vertexProperty(name, data)` | **new** | L | Custom per-vertex attributes. |
| `buildGeometry(cb)` / `freeGeometry(g)` / `model(g, count?)` | chg | R | `model(geom, N)` instances. `beginGeometry`/`endGeometry` removed. |
| `curveVertex, curve, curvePoint, curveTangent, curveTightness, quadraticVertex, bezierDetail, beginGeometry, endGeometry` | **rm** | R(✗) | All `undefined` in 2.3.4. |
| 2D primitives `arc ellipse circle rect square line point quad triangle`, `ellipseMode rectMode strokeCap strokeJoin strokeWeight` | same | L | |

### 2.4 Color
| Signature | Status | Src | Notes |
|---|---|---|---|
| `colorMode(mode, [max] \| [max1,max2,max3,[maxA]])` → current mode | chg | R | Modes `RGB HSB HSL HWB LAB LCH OKLAB OKLCH RGBP3` (string constants `'rgb'`, `'oklch'`…). |
| Default ranges | — | R | RGB/RGBP3 `255,255,255,255`; HSB/HSL/HWB `360,100,100,1`; LAB/OKLAB `100,[-125,125],[-125,125],1`; LCH/OKLCH `100,150,360,1`. In OKLCH the **C range 0–150 maps to CSS chroma 0–0.4**: `color(70,30,250)` gives `oklch(70% 0.08 250)`. Use `colorMode(OKLCH, 1, 0.4, 360, 1)` for CSS-native numbers. |
| `color(...)` (numbers, CSS string incl. `oklch()`, array, p5.Color) | chg | R | CSS `oklch(...)` strings are parsed. |
| `color.toString(fmt?)` | chg | R | e.g. `'#rrggbb'`. The default output is CSS in the color's own space. |
| `lerpColor(c1,c2,amt)` | chg | R | Interpolates in the **current** colorMode, so OKLCH gives perceptual ramps. |
| `paletteLerp([[c,stop],...], amt)` | **new** | R | |
| `color.contrast(other, 'WCAG21'\|'APCA'\|'all')` | **new** (2.1) | L | |
| `red/green/blue/alpha/hue/saturation/brightness/lightness` | chg | L | Respect current maxes. |
| `background/fill/stroke/noFill/noStroke/clear(r,g,b,a normalized)` | same | R | |
| `blendMode(BLEND\|ADD\|MULTIPLY\|SCREEN\|…)`, `erase/noErase` | same | L | |
| `beginClip/endClip/clip(cb, {invert})` | same | L | |
| `P2DP3` canvas | **new** (renamed from P2DHDR) | L | Sets default colorMode to `RGBP3`. `RGBHDR`/`P2DHDR` are **absent** in 2.3.4. |

### 2.5 Transform
| Signature | Status | Src | Notes |
|---|---|---|---|
| `translate rotate rotateX/Y/Z scale shearX shearY applyMatrix resetMatrix` | same | L | |
| `worldToScreen(x,y,z)` / `screenToWorld(x,y,z?)` | **new** | R | Returns p5.Vector. Passing a vector works but triggers an FES warning. |
| `transform2D()/transform3D()` (strands) | ✗ | ✗ | **On `main` only, unreleased**; don't use. |

### 2.6 Typography
| Signature | Status | Src | Notes |
|---|---|---|---|
| `text(str, x, y, [maxW], [maxH])` | same | L | |
| `textFont(font\|cssName\|object, [size])` | chg | R | `textFont('Georgia')` works with system fonts. |
| `textSize textStyle textAlign textLeading textWrap(WORD\|CHAR) textDirection` | same | L | |
| `textWeight(n)` | **new** | R | Variable fonts. Sets `font-variation-settings`. |
| `textProperty(prop, v)` / `textProperties(obj)` | **new** | L | Raw access to canvas text props (e.g. `letterSpacing`, `fontVariant`). |
| `textWidth(str)` | **chg** | R | **Tight box; leading and trailing spaces ignored** (`'  Hi  '` gave 27px). |
| `fontWidth(str)` | **new** | R | Loose width with spaces (`'  Hi  '` gave 73.6px). This is the old `textWidth` behaviour. |
| `textBounds(str,x,y,[w],[h])` tight / `fontBounds(...)` loose → `{x,y,w,h}` | chg/new | L | |
| `textAscent/textDescent/fontAscent/fontDescent` | chg | L | |
| `font.textToPoints(str,x,y,[w],[h],{sampleFactor=0.1, simplifyThreshold=0})` → `[{x,y,angle,alpha}]` | chg | R | Method on p5.Font; **not global** (`typeof textToPoints === 'undefined'`). |
| `font.textToContours(str,x,y,...)` → `[[{x,y,...}]]` per contour | **new** | R | `'O'` gives 2 contours. |
| `font.textToPaths(...)` → path commands | **new** | L | |
| `font.textToModel(str,x,y,[w],[h],{extrude, sampleFactor})` → p5.Geometry | **new** | R | WEBGL. |
| `font.variations()`, `font.metadata()` | new | R | Lora-Variable.ttf returned `{}` and warned "No glyph data … retrying as FontFace". Variable `.ttf` may fall back to FontFace, in which case **textToPoints may not work on it**. |
| Google Fonts woff2 | — | D | Needs the `p5.woff2` add-on script (typography-2.0 tutorial). |

### 2.7 Image / pixels
| Signature | Status | Src | Notes |
|---|---|---|---|
| `image(img, x,y,[w,h], [sx,sy,sw,sh], [fit CONTAIN\|COVER], [xAlign], [yAlign])` | same | L | |
| `imageMode tint noTint createImage` | same | L | |
| `loadPixels()/pixels[]/updatePixels()` | same | R | Synchronous in 2D and WEBGL. **Async (await) in WEBGPU.** |
| `get(x,y)` → `[r,g,b,a]` | same | R | |
| `set copy blend` / `img.mask()` | same | L | |
| `filter(GRAY\|INVERT\|THRESHOLD\|OPAQUE\|POSTERIZE\|BLUR\|ERODE\|DILATE, param?, useWebGL=true)` | chg | R | Built-ins run on the GPU by default, even in 2D. |
| `filter(shader)` | chg | R | Works on a **P2D** canvas with a strands filter shader (verified). |

### 2.8 WebGL / 3D
| Signature | Status | Src | Notes |
|---|---|---|---|
| `createCanvas(w,h,WEBGL)` | same | R | WebGL2 by default (`webglVersion === 'webgl2'`). Origin at the centre. |
| `setAttributes({antialias, …})` | same | L | |
| `camera perspective ortho frustum createCamera setCamera orbitControl` | chg | L | `createCamera()` **no longer makes the camera active**; call `setCamera(cam)`. |
| `lights ambientLight directionalLight pointLight spotLight imageLight panorama noLights lightFalloff` | same | L | |
| `box sphere plane cylinder cone torus ellipsoid` | same | R | |
| `normalMaterial ambientMaterial emissiveMaterial specularMaterial shininess metalness texture textureMode textureWrap` | same | L | |
| `strokeMode(SIMPLE\|FULL)` | **new** (2.0 notes called it `linesMode`) | R | `SIMPLE` turns off caps, joins and per-vertex stroke color for speed. `linesMode` is undefined. |
| `linePerspective(bool)` | same | L | |
| `debugMode/noDebugMode` | same | L | |
| `instances(n).shape()` | ✗ | ✗ | `main` only. In 2.3.4, use `model(geom, n)` / `endShape(mode, n)` + `instanceID()`. |

### 2.9 Framebuffers
| Signature | Status | Src | Notes |
|---|---|---|---|
| `createFramebuffer({format: UNSIGNED_BYTE\|FLOAT\|HALF_FLOAT, channels, depth, depthFormat, stencil, antialias, width, height, density, textureFiltering: LINEAR\|NEAREST})` | same | R | Matches the canvas size and density by default. |
| `fb.begin()/fb.end()`, `fb.draw(cb)`, `fb.color`, `fb.depth`, `fb.resize()`, `fb.pixelDensity()` | same | R | Use FLOAT for feedback/fade trails (tutorial). |
| `image(fb, …)` / `texture(fb)` | same | R | |

### 2.10 Shaders & p5.strands (all `@beta`)
| Signature | Status | Src | Notes |
|---|---|---|---|
| `buildMaterialShader(cb \| hooksObj, scope?)` | **new** (2.2+) | R | Same as `baseMaterialShader().modify(cb)`. Apply it with `shader()`. |
| `buildColorShader / buildNormalShader / buildStrokeShader(cb, scope?)` | **new** | R (color) | Stroke shaders go through `strokeShader()`. |
| `buildFilterShader(cb, scope?)` | **new** | R | Apply with `filter(s)`. Hook: `filterColor.{texCoord, canvasSize, texelSize, canvasContent}` + `.set(vec4)`. |
| `baseMaterialShader/baseColorShader/baseNormalShader/baseStrokeShader/baseFilterShader()` + `.modify(cb)` + `.inspectHooks()` | new (2.0) | R | `inspectHooks()` logs the hook GLSL signatures. |
| **Block hooks** (2.2+ style): `objectInputs`, `worldInputs`, `cameraInputs` (vertex: `position, normal, texCoord, color`), `pixelInputs` (`normal, texCoord, ambientLight, ambientMaterial, specularMaterial, emissiveMaterial, color, shininess, metalness, …`), `combineColors` (`baseColor, diffuse, ambientColor, ambient, specularColor, specular, emissive, opacity` + `.set`), `finalColor` (`color, texCoord` + `.set`), `filterColor` | **new** | R | Pattern: `hook.begin(); hook.prop = …; hook.end();` |
| **Callback hooks** (2.0 style): `getWorldInputs(inputs => inputs)`, `getPixelInputs`, `getFinalColor(c => c)`, `beforeFragment`, `afterFragment`, … | chg | R (getWorldInputs) | Still work in 2.3.4. Prefer the block style for new code. |
| GLSL hooks object `{ 'vec4 getFinalColor': '(vec4 color) { … }' }` | new | R(err) | The signature must match `inspectHooks()` exactly; a mismatch gives a compile error. |
| `uniformFloat/Int/Vec2/Vec3/Vec4/Bool/Mat*/Texture(name?, defaultOrFn)` | new | R | `uniformFloat(() => millis())` updates every frame. |
| `varyingFloat/...`, `sharedFloat/...` | new | L | |
| `instanceID()` (alias `instanceIndex` added in 2.3.x) | new | L | Per-instance index in strands. |
| Strands built-ins | new | R | `sin cos … mix clamp smoothstep step fract floor dot cross length normalize reflect …`. Also in strands: `noise()` (3D), `random()`, `randomGaussian()`, `map()`, `lerp()`, `color()`, `millis()`, `width/height/mouseX/frameCount`. Vectors are `[x,y,z]` array literals; operators `+ - * /` work on vectors; swizzles `.xy .rgb`. `if`/`for`/ternary are transpiled. |
| `shader(s)` / `strokeShader(s)` / `imageShader(s)` / `resetShader()` | chg | R | `shader()` **always** applies to fills now. Scope it with push/pop or resetShader. |
| `createShader(vert, frag)` / `createFilterShader(frag)` / `s.setUniform(name, v)` | same | L | GLSL ES 3.00 (WebGL2) or 1.00. |

### 2.11 WebGPU / compute (experimental, add-on `p5.webgpu.js`)
| Signature | Status | Src | Notes |
|---|---|---|---|
| `<script src="p5.js"></script><script src="p5.webgpu.js"></script>` | **new** (2.2) | R | npm/CDN `lib/p5.webgpu(.min).js`. ESM: `p5/webgpu`. |
| `await createCanvas(w,h,WEBGPU)` | **new** | R | Returns a Promise (verified). |
| `createStorage(countOrArrayOrObjects)` → `p5.StorageBuffer` (`.update(data)`, `.set(i,v)`, `.read()`) | **new** (2.3) | R(build) | Arrays of `{position: createVector(..), velocity: ..}` structs, or `Float32Array`. |
| `buildComputeShader(cb)` / `baseComputeShader()` | **new** (2.3) | R(build) | Inside: `index.x/.y/.z`, `uniformStorage(buf)`, `data[i].field = …`. |
| `compute(shader, x, y=1, z=1)` | **new** (2.3) | D | Dispatch. Large counts auto-spread (PR #8696). Execution in headless SwiftShader **failed** (`createBuffer … too large`), an environment limit, not a p5 bug. |
| `uniformStorage(name?, bufOrFnOrSchema)` | **new** | L | Also readable in material and filter shaders, e.g. `data[instanceID()].position`. |
| `clearStorage()` | new | L | Listed in the website reference. |
| `await loadPixels()` / `await get()` in WebGPU | chg | D | contributor_docs/webgpu.md. |
| WGSL backend for strands | — | D | Same strands JS targets GLSL and WGSL. |

### 2.12 Events / input
| Signature | Status | Src | Notes |
|---|---|---|---|
| `mouseButton` → `{left, right, center}` booleans | **chg** | R | `mouseButton === LEFT` no longer works. |
| `mouseX/Y pmouseX/Y winMouseX/Y movedX/Y mouseIsPressed` | same | R | |
| `mousePressed/Released/Clicked/Moved/Dragged/Wheel(event)`, `doubleClicked` | chg | L | Pointer-API based; fires for touch too. |
| `touches[]` (`{x, y, winX, winY, id}`) | chg | R (empty array) | `touchStarted/Moved/Ended` **removed**. |
| `key` (char), `code` (physical, e.g. `'KeyA'`, `'ArrowUp'`), `keyCode` (number), `keyIsPressed` | **chg** | R | `UP_ARROW === 'ArrowUp'`, `ENTER === 'Enter'` (strings). Compare against `code`, or use `keyIsDown()`. |
| `keyIsDown(codeOrString)` | chg | L | Recommended in both v1 and v2. |
| `keyPressed/keyReleased/keyTyped(event)` | same | L | |
| `requestPointerLock/exitPointerLock` | same | L | |
| `deviceMoved/Turned/Shaken`, `setShakeThreshold` | same | L | |

### 2.13 DOM
| Signature | Status | Src | Notes |
|---|---|---|---|
| `createSlider/Button/Div/P/Span/Input/Select/Checkbox/Radio/ColorPicker/FileInput/Capture/Video/Audio/Img/A/Element`, `select/selectAll/removeElements` | same | L | |
| `el.changed/input/value/style/position/size/...` | same | L | |

### 2.14 Math / noise / random
| Signature | Status | Src | Notes |
|---|---|---|---|
| `random([min],[max])`, `random(array)`, `randomGaussian(mean, sd)`, `randomSeed(n)` | same | R | Seeded sequences repeat exactly. |
| `noise(x,[y],[z])`, `noiseDetail(lod, falloff)`, `noiseSeed(n)` | same | R | |
| `createVector(...components)` | **chg** | R | N-dimensional. `createVector()` is 3D zero with an FES warning; `createVector(1,2)` is 2D. `fromAngle` returns 2D. Mismatched-dimension math uses the smaller dimension (2.3) and warns. |
| `map lerp constrain dist mag norm sq fract …`, `angleMode` | same | L | |
| `shuffle` | same | L | Seeded by randomSeed. |
| `p5.Quat`, `p5.Matrix` | new | L | statics present. |

### 2.15 Export / save
| Signature | Status | Src | Notes |
|---|---|---|---|
| `saveCanvas([cnv], [name], [ext])` | same | L | |
| `save(obj, name)`, `saveJSON`, `saveStrings`, `saveTable` | same | L | |
| `saveFrames(prefix, ext, duration≤15, fps≤22, [cb])` | same | L | |
| `saveGif(name, duration, {delay, units:'seconds'\|'frames', silent, notificationDuration, notificationID})` | same | L | |
| `saveObj(geom)` / `saveStl(geom)` | new | L | |
| Headless: `canvas.toDataURL('image/png')` after `window.__done` | — | R | What the harness uses. |

### 2.16 Add-ons / instance mode
| Signature | Status | Src | Notes |
|---|---|---|---|
| `p5.registerAddon((p5, fn, lifecycles) => { fn.myFn = function(){…}; lifecycles.presetup = …})` | **new** | R | Hooks: `presetup, postsetup, predraw, postdraw, remove` (they can be async). Use `function`, not arrows, for `fn` methods. Clean up listeners with `{signal: this._removeSignal}`. |
| `p5.registerDecorator(pattern, fn)` | new | L | Internal-ish. |
| `new p5(sketch, nodeOrId)` | same | R | `p.setup = async () => {…}` works. |
| `import p5 from 'p5'` (ESM default `dist/app.js`); `'p5/node'`, `'p5/webgpu'`, and modular subpaths `p5/core`, `p5/color`… | **new** | L | package.json `exports`. |
| `registerPreloadMethod` | **rm** | — | See the compat README pattern for supporting both v1 and v2. |

### 2.17 p5.sound status
- The old 1.x `p5.sound` **does not work with 2.x**. The new `p5.sound.js` (npm `p5.sound@0.4.1`, separate repo `processing/p5.sound.js`) works with v1 and v2. `await loadSound(...)` returns a promise.
- Removed classes (deprecated alerts point to Tone.js): `MonoSynth, PolySynth, EQ, Convolver, Distortion, Compressor, Filter, Effect, OnsetDetect, AudioVoice, Part, Phrase, Pulse, Score, SoundLoop`. Bridge to Tone.js with `Tone.setContext(getAudioContext())`.
- A sound context needs a user gesture to start. Headless renders should not depend on audio.

---

## 3. 1.x habits that break in 2.x

| 1.x habit | What happens in 2.3.4 | Correct 2.x form |
|---|---|---|
| `function preload(){ img = loadImage('a.png'); }` | never called; `img` undefined | `async function setup(){ img = await loadImage('a.png'); }` |
| `img = loadImage('a.png')` used directly in setup | `img` is a Promise | `await` it, or use a callback |
| `async function draw()` with `await` | frames overlap (rAF doesn't await) | load in setup; keep draw synchronous |
| `curveVertex(x,y)` with duplicated end points | `undefined` function | `splineVertex(x,y)`; `endShape(CLOSE)` for a smooth loop; `splineProperty('ends', EXCLUDE)` to get the old control-point behaviour |
| `bezierVertex(cx1,cy1,cx2,cy2,x,y)` | treated as `(x,y,z,u,v)`, so the geometry is wrong | `bezierVertex(cx1,cy1); bezierVertex(cx2,cy2); bezierVertex(x,y);` (after a `vertex`/`bezierVertex` anchor) |
| `quadraticVertex(cx,cy,x,y)` | undefined | `bezierOrder(2); bezierVertex(cx,cy); bezierVertex(x,y);` |
| `curve(...)`, `curveTightness(t)`, `curvePoint`, `curveTangent` | undefined | `spline(...)`, `splineProperty('tightness', t)`, `splinePoint`, `splineTangent` |
| `bezierDetail(n)` | undefined | `curveDetail(n)` (WebGL only) |
| `beginGeometry(); …; endGeometry()` | undefined | `buildGeometry(() => { … })` |
| `endContour()` expecting closed | open contour | `endContour(CLOSE)` |
| `mouseButton === LEFT` | always false | `mouseButton.left` |
| `keyCode === UP_ARROW` | `UP_ARROW` is now `'ArrowUp'` (string), so it never matches the number | `keyIsDown(UP_ARROW)` or `code === UP_ARROW` |
| `touchStarted()/touchMoved()` | not called | `mousePressed()/mouseDragged()` + `touches[]` |
| `textWidth('  hi  ')` for layout | tight box, spaces dropped | `fontWidth('  hi  ')` |
| `textToPoints(font, …)` or `textToPoints(...)` as a global | undefined | `font.textToPoints(str, x, y, {sampleFactor})` |
| `createVector()` treated as 2D | 3D zero vector + warning | `createVector(0, 0)` |
| `createStringDict()`, `append()`, `sort()`, `subset()`, `shorten()`, `arrayCopy()` | undefined | native objects / `Map`, `arr.push`, `arr.sort`, `arr.slice`… |
| `loadBytes(f).bytes` | returns `Uint8Array` directly | use the result directly |
| `loadTable(f, 'csv', 'header')` | 2nd arg is now the separator | `loadTable(f, ',', 'header')` |
| `shader(s)` expecting it to switch off under `lights()` | still applies | scope with `push/pop` or `resetShader()` |
| `createCamera()` expecting it to become active | not active | `cam = createCamera(); setCamera(cam);` |
| `linesMode(SIMPLE)` (2.0 beta notes) | undefined | `strokeMode(SIMPLE)` |
| `colorMode(RGBHDR)` / `createCanvas(w,h,P2DHDR)` (2.0 notes) | undefined constants | `RGBP3` / `P2DP3` |
| p5.strands callback reading a local variable | `ReferenceError: x is not defined` | `buildXShader(cb, { x })` or top-level global |
| instance mode: `sin()`, `noise()`, `millis()`, `uniformFloat()`, `getTexture()` inside strands | `ReferenceError` | `p.sin()`, `p.noise()`… and pass `{ p }` as scope |
| old `p5.sound` bundled | breaks | new `p5.sound.js` (0.4.x) or Tone.js |
| HTML without `<meta charset="utf-8">` | `SyntaxError: Missing initializer in const declaration` at load | always declare UTF-8 |
| `p5.prototype.registerPreloadMethod(...)` in add-ons | undefined | return a Promise from your loader; register with `p5.registerAddon` |

---

## 4. Performance & limits notes

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

---

## 5. Minimal correct 2.x sketch templates

Both templates were **tested** in headless Chromium against the 2.3.4 build. Same seed gave byte-identical PNGs; a different seed gave a different PNG; no console errors. Copies are at `/tmp/p5check/h/tpl_global.html` and `/tmp/p5check/h/tpl_instance.html`.

### 5.1 Global mode (P2D, OKLCH, seeded)
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"> <!-- REQUIRED: p5 2.x bundle contains non-ASCII identifiers -->
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>p5 2.x sketch</title>
  <script src="https://cdn.jsdelivr.net/npm/p5@2.3.4/lib/p5.min.js"></script>
  <style>html,body{margin:0;padding:0;background:#111;}canvas{display:block;}</style>
</head>
<body>
<script>
const Q = new URLSearchParams(location.search);
const SEED    = Number(Q.get('seed') ?? 20261005);
const W       = Number(Q.get('w') ?? 800);
const H       = Number(Q.get('h') ?? 800);
const DENSITY = Number(Q.get('d') ?? 1);       // 1 = deterministic pixel size for headless
const FRAMES  = Number(Q.get('frames') ?? 1);  // 1 = still image

window.__done = false;
window.__error = null;
window.addEventListener('error', e => { window.__error = String(e.message); window.__done = true; });
window.addEventListener('unhandledrejection', e => { window.__error = String(e.reason); window.__done = true; });

let palette;

async function setup() {
  createCanvas(W, H);          // P2D; use WEBGL for 3D / shaders
  pixelDensity(DENSITY);
  randomSeed(SEED);            // random(), randomGaussian(), random(array), shuffle()
  noiseSeed(SEED);             // noise()

  // Assets: await inside async setup (no preload() in 2.x)
  // const font = await loadFont('assets/MyFont.ttf');
  // const img  = await loadImage('assets/photo.jpg');

  colorMode(OKLCH);            // L 0-100, C 0-150 (=0-0.4 CSS), H 0-360, A 0-1
  palette = [color(25, 20, 260), color(70, 90, 40), color(90, 40, 100)];
  if (FRAMES <= 1) noLoop();
}

function draw() {
  background(palette[0]);
  noStroke();
  for (let i = 0; i < 400; i++) {
    const x = random(width), y = random(height);
    const n = noise(x * 0.004, y * 0.004);
    fill(lerpColor(palette[1], palette[2], n));
    circle(x, y, 4 + 40 * n);
  }
  if (frameCount >= FRAMES) {
    noLoop();
    window.__done = true;      // signal AFTER the last frame is drawn
  }
}
</script>
</body>
</html>
```

### 5.2 Instance mode (WEBGL + p5.strands filter, seeded)
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>p5 2.x instance sketch</title>
  <script src="https://cdn.jsdelivr.net/npm/p5@2.3.4/lib/p5.min.js"></script>
  <style>html,body{margin:0;background:#111;}canvas{display:block;}</style>
</head>
<body>
<main id="stage"></main>
<script>
const Q = new URLSearchParams(location.search);
const CFG = {
  seed: Number(Q.get('seed') ?? 20261005),
  w: Number(Q.get('w') ?? 800), h: Number(Q.get('h') ?? 800),
  density: Number(Q.get('d') ?? 1), frames: Number(Q.get('frames') ?? 1),
};
window.__done = false;
window.__error = null;
window.addEventListener('error', e => { window.__error = String(e.message); window.__done = true; });
window.addEventListener('unhandledrejection', e => { window.__error = String(e.reason); window.__done = true; });

const sketch = (p) => {
  let palette, warp;

  p.setup = async () => {
    p.createCanvas(CFG.w, CFG.h, p.WEBGL);   // origin = canvas centre
    p.pixelDensity(CFG.density);
    p.randomSeed(CFG.seed);
    p.noiseSeed(CFG.seed);
    // const img = await p.loadImage('assets/photo.jpg');

    p.colorMode(p.OKLCH);
    palette = [p.color(20, 15, 280), p.color(75, 110, 30)];

    // p5.strands in INSTANCE mode: pass { p } as scope and prefix p5 functions
    // with p. (p.sin, p.noise, p.millis, p.uniformFloat, p.getTexture).
    // Hook objects (filterColor, worldInputs, finalColor) stay bare.
    warp = p.buildFilterShader(() => {
      filterColor.begin();
      const uv = filterColor.texCoord;
      const off = [0.01 * p.sin(uv.y * 40.0), 0];
      filterColor.set(p.getTexture(filterColor.canvasContent, uv + off));
      filterColor.end();
    }, { p });

    if (CFG.frames <= 1) p.noLoop();
  };

  p.draw = () => {
    p.background(palette[0]);
    p.noStroke();
    p.fill(palette[1]);
    p.lights();
    p.rotateY(0.6);
    p.rotateX(0.3 + p.random(-0.5, 0.5)); // seeded variation
    p.torus(p.width * 0.22, p.width * 0.07, 48, 24);
    p.filter(warp);
    if (p.frameCount >= CFG.frames) {
      p.noLoop();
      window.__done = true;
    }
  };
};

new p5(sketch, document.getElementById('stage'));
</script>
</body>
</html>
```

**Headless harness contract.** Load the page, wait for `window.__done === true`, check `window.__error === null`, then `document.querySelector('canvas').toDataURL('image/png')`. Serve over HTTP rather than `file://`, because loaders use `fetch`.

### 5.3 Snippets an agent will reach for (all run in 2.3.4)
```js
// Shapes
beginShape(); splineVertex(20,100); splineVertex(60,20); splineVertex(120,90); endShape();
beginShape(); bezierOrder(2); bezierVertex(20,20); bezierVertex(100,0); bezierVertex(180,20); endShape();

// Text to points (method on the font)
const font = await loadFont('assets/Font.ttf');
const pts = font.textToPoints('Hi', 10, 80, { sampleFactor: 0.2 });   // [{x,y,angle,alpha}]
const contours = font.textToContours('O', 10, 80, { sampleFactor: 0.2 }); // [[...],[...]]

// Strands material (global mode)
const wave = buildMaterialShader(() => {
  const t = uniformFloat(() => millis());
  worldInputs.begin();
  worldInputs.position.y += 10 * sin(t * 0.001 + worldInputs.position.x * 0.05);
  worldInputs.end();
});
// draw: shader(wave); sphere(40);

// Strands filter (works on P2D canvas too)
const invert = buildFilterShader(() => {
  filterColor.begin();
  let c = getTexture(filterColor.canvasContent, filterColor.texCoord);
  filterColor.set([1 - c.r, 1 - c.g, 1 - c.b, c.a]);
  filterColor.end();
});
// draw: filter(invert);

// WebGPU compute (experimental; needs p5.webgpu.js; not headless-safe)
// await createCanvas(400, 400, WEBGPU);
// particles = createStorage([{ position: createVector(0,0), velocity: createVector(1,0) }, ...]);
// sim = buildComputeShader(() => { let d = uniformStorage(particles); let i = index.x;
//   d[i].position = d[i].position + d[i].velocity; });
// draw: compute(sim, N);
```

---

## 6. Fetch log

| # | URL / command | What it gave | Credibility |
|---|---|---|---|
| 1 | `npm i p5@2.3.4` in /tmp/p5check | Built package: `lib/p5(.min).js`, `p5.esm.js`, `p5.webgpu(.min).js`, `dist/` modules, `types/p5.d.ts` + `global.d.ts` | **Primary**: the shipped artifact |
| 2 | `npm view p5 dist-tags time` | Full release timeline 2.1.0 (2025-11-10) → 2.3.4 (2026-09-25); 1.11.13 on 2026-04-08 | Primary |
| 3 | `gh release list -R processing/p5.js` | **Failed**: GraphQL blocked | — |
| 4 | `gh api repos/processing/p5.js/releases` | **Failed**: repo not enabled for this session (403) | — |
| 5 | `git clone --depth 1 github.com/processing/p5.js` (main @ e1b320b, 2026-10-04) | Source plus contributor_docs. **Main is ahead of 2.3.4** (has `instances()`, `transform3D`, p5.svg experimental) | Primary, but unreleased |
| 6 | `git clone --depth 1 --branch v2.3.4 …p5.js` → p5tag | Authoritative JSDoc for 2.3.4 (shapes, color, type, strands, compute) | **Primary** |
| 7 | `git clone --filter=blob:none …p5.js` → p5hist; `git log --merges vA..vB` | Merged-PR titles per release (changelog proxy for 2.1, 2.2, 2.3, 2.3.x) | Primary (commit metadata) |
| 8 | `git ls-remote --tags` | All tags v2.0.0-beta.1 … v2.3.4 | Primary |
| 9 | `git clone processing/p5.js-website` (2026-09-30) | Tutorials: `v2_transition.mdx`, `typography-2.0.mdx`, `intro-to-p5-strands.mdx`, `optimizing-webgl-sketches.mdx`, `how-to-optimize-your-sketches.mdx`, `layered-rendering-with-framebuffers.mdx`; 441 reference pages incl. compute/storage | High (official), some pages stale |
| 10 | `git clone processing/p5.js-compatibility` README | Full 1.x→2.x breaking-change list, compat add-ons (preload.js, shapes.js, data.js, events.js), p5.sound migration | **High**: the official migration guide |
| 11 | contributor_docs/`webgpu.md`, `p5.strands.md`, `creating_libraries.md` (tag + main) | WebGPU design and compute intent; strands internals and builtin list; registerAddon + lifecycle hooks | High |
| 12 | WebFetch github.com/…/releases/tag/v2.0.0 | Small-model summary of 2.0 notes (async, shapes, color modes incl. RGBHDR/P2DHDR, `linesMode`, typography) | Medium: summarised, and some names are now stale |
| 13 | WebFetch …/releases/tag/v2.1.0, v2.2.0, v2.3.0 | **Failed**: permission prompt timed out | — |
| 14 | `npm view p5.sound` | 0.4.1 latest (modified 2026-07-21) | Primary |
| 15 | Headless Chromium harness `enum.html` | Presence/type of ~300 API names on a live 2.3.4 instance; constants; p5 statics | **Primary (runtime)** |
| 16 | Harness `behave.html` | Runtime behaviour: async loading, 404 rejection, fonts, textWidth vs fontWidth, OKLCH ranges, splines, seeding, vectors, filters, WEBGL strands/framebuffer/textToModel | **Primary (runtime)** |
| 17 | Harness `strands*.html`, `sg*.html` | Strands scoping rules (closures, scope arg, instance-mode prefixing); the **UTF-8 charset failure** found by bisection | **Primary (runtime)** |
| 18 | Harness `gpu.html` | WEBGPU createCanvas is a Promise; createStorage/buildComputeShader build; dispatch fails under SwiftShader limits | Primary, but env-limited |
| 19 | Harness `tpl.mjs` | Both templates: same-seed identical, different-seed different, no errors | Primary (runtime) |
| 20 | `grep` over `lib/p5.js` / `p5.webgpu.js` | Absence of RGBHDR/P2DHDR/linesMode/transform3D; presence of RGBP3/P2DP3/strokeMode; Greek identifiers | Primary |

---

## 7. Experience notes

**Hard-to-find things**
- **The UTF-8 trap.** `lib/p5.js` 2.3.4 inlines colorjs.io with identifiers like `const ε$3`, `κ$1`, `π$1` (590 non-ASCII lines). A page with no `<meta charset>`, served without a charset header, decodes the bundle as windows-1252 and throws `Missing initializer in const declaration` before `setup`. No stack, no FES message. Nothing in the docs mentions it.
- **Strands closures.** `buildStrandsCallback` re-creates the callback from source with `new Function('__p5', ...scopeKeys, body)`. Function-local variables, including those captured inside `uniformFloat(() => local)`, are lost. Only true globals (top-level `let`/`var` in a classic script work) and keys of the `scope` argument are visible. The JSDoc mentions `scope` only as "An optional scope object passed to .modify()".
- **Instance-mode strands.** Hook objects and vector literals work bare, but `sin`, `noise`, `millis`, `uniformFloat` and `getTexture` must be `p.`-prefixed with `{ p }` in scope. PR #8878 "fix builtin global accessors for instance mode in strands" exists, but the bare forms still failed in 2.3.4 in this harness.
- OKLCH chroma uses a **0–150 scale mapped to 0–0.4**, not the CSS number. That's easy to get wrong when porting CSS palettes.
- `textToPoints` points carry `angle` as well as `alpha`.
- During async setup the canvas is created hidden (`data-hidden`) and revealed after setup. A spinner overlay appears and persists on setup failure.

**Contradictions between sources**
- The 2.0.0 release notes say `RGBHDR`/`P2DHDR` and `linesMode(SIMPLE)`. The 2.3.4 build has `RGBP3`/`P2DP3` (PR #8975 "Rename HDR to P3") and `strokeMode(SIMPLE)`.
- The website tutorial `how-to-optimize-your-sketches.mdx` still says "Add a `preload()` function". That is stale for 2.x.
- The compatibility README says v2 is now the default on p5js.org and in the Editor, and v1 is unmaintained (reference at v1.p5js.org). The 2.0.0 release text said the Editor would stay on 1.x until at least August 2026. The two are consistent with today's date: the switch has happened.
- The compat README's `textWidth`/`fontWidth` paragraph is confusingly worded ("2.x textWidth calculates tight bbox, which is what 1.x fontWidth does"; 1.x had no `fontWidth`). Runtime confirms: 2.x `textWidth` is tight and `fontWidth` is loose.
- The teacher guide shows `key === UP_ARROW` as v1 code; v1 actually used `keyCode === UP_ARROW`.
- JSDoc for `textToPoints` shows `(str, x, y, options)`. The implementation signature is `(str, x, y, width, height, options)` with argument parsing; both forms work.
- `main` documents `instances(n).sphere()`, `transform3D()` and the p5.svg experimental area. **None of these are in 2.3.4.** An agent reading GitHub `main` will write code that doesn't run.

**Open questions**
- WebGPU compute correctness on real GPUs. It couldn't be verified headless (SwiftShader buffer-size limits).
- Whether variable `.ttf` fonts (which fall back to FontFace) support `textToPoints`/`textToModel`. Lora-Variable reported no glyph data.
- The exact release notes for 2.1/2.2/2.3. GitHub release pages were not fetchable (permission timeout); merged-PR titles were used as a proxy.
- The `textToModel` docs show `(str,x,y,w,h,opts)`, while the tutorial passes options as the 4th argument. Both are parsed by `_parseArgs`; only the 6-argument form was tested.
- The GLSL hook-object form (`{'vec4 getFinalColor': '...'}`) failed to compile on `buildColorShader` in the harness. The exact signature should be taken from `inspectHooks()` per shader; this needs follow-up.

---

## 8. Three knowledge atoms

1. **p5 2.x pages must declare UTF-8.** Always emit `<meta charset="utf-8">`. Without it, p5 2.3.4's bundled colorjs.io code (Greek identifiers `ε κ π`) fails to parse as Latin-1 and the sketch dies before `setup()` with "Missing initializer in const declaration". *Verified by bisection in headless Chromium.*
2. **p5.strands callbacks are re-compiled, not closed over.** Any value a `build*Shader(cb)` callback uses must be a true global or be passed in the scope argument: `buildMaterialShader(cb, { amp, p })`. In instance mode, also prefix p5 functions (`p.sin`, `p.noise`, `p.millis`, `p.uniformFloat`, `p.getTexture`); hook objects (`worldInputs`, `filterColor`, `finalColor`) stay bare. *Verified at runtime.*
3. **2.3.4 is the target, not GitHub `main`.** Shipping 2.3.4 uses `RGBP3`/`P2DP3` (not RGBHDR/P2DHDR), `strokeMode` (not linesMode), and `model(geom, n)` + `instanceID()` for instancing. `instances()`, `transform2D/3D()` and p5.svg exist only on unreleased `main`. Curves use `splineVertex` and one-point `bezierVertex` with `bezierOrder`. Text→points is `font.textToPoints()`. `textWidth` is tight and `fontWidth` is loose. OKLCH chroma 0–150 maps to CSS 0–0.4.
