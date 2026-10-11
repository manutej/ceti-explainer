# WOW-P5-FRONTIER · what p5.js 2.x WEBGL can do that our films do not use · lane R-W2 · 2026-10-11

Extends `arsenal/frontier/R-B-p5-gpu.md` (instancing, MRT, bugs, second renderer: not repeated) and `arsenal/frontier/R-C-cinematic.md`
(post stack, accumulation: not repeated). This file is about the **look** side of p5: light, material, hooks, type, camera,
glass, shadow. Everything marked [MEASURED] was run today on the vendored `vendor/p5-2.3.4.min.js`.

Grades for outside claims: **A** official p5.js reference, tutorial or release note; **B** Processing Foundation blog or
repo issue by a maintainer; **C** forum, third-party library, or my inference. `[BUNDLE]` = seen in the vendored file,
`[TESTED-REPO]` = proven by `references/p5/webgl-strands.md`, `[UNVERIFIED]` = not run.
Egress blocks page fetches; every web claim below is from WebSearch result text, so none is graded above what a snippet shows.

## 0. Verdict in six lines
1. Our films use p5 WEBGL as a flat-ink painter: `noLights()`, `ink` material, cubic in-out camera, hard cuts. p5 2.3.4 already
   ships a Phong/image-based lighting pipeline, a hookable material shader, a font-to-mesh call, and a camera slerp. None is used.
2. **The cost of lighting is fixed, not per light.** A lit frame (40 spheres, 1920x1080 backing) is 1.2 to 1.4 s whether it has
   one directional light or four lights plus specular; flat is 0.11 s [MEASURED]. Export is frame-stepped (about 0.4 s/frame
   budget today, 1.5 s for the heaviest Wave GL variant), so "lit" costs a 10 to 12x slowdown, then everything else is nearly free.
3. The best value per byte is **three small things on top of lighting**: a strands fresnel rim (0.4 KB, +0 s), a procedural
   studio environment for `imageLight` (0 KB if generated, +0 s over lit), and slerp camera arcs (0 s).
4. **Do not use `filter(BLUR)`**: 8.4 s/frame at 1080p backing [MEASURED]. A hand 16-tap gather is 2.4 s; a half-res blur is 0.3 s.
5. Strands is `@beta`, API names moved four times in 2.1 to 2.3, and instance mode needs `p.` prefixes and a scope argument.
   Pin 2.3.4 and keep a GLSL-string fallback for each hook.
6. **p5 2.4 is not out as of 2026-10-11** (no release found; latest 2.3.4, 25 Sep 2026 [C: search found nothing newer; B: R-B
   read GitHub releases on 10-10]). `main` adds `instances()`, strands matrix uniforms, SVG import/export: sugar, not new looks.

## 1. State of p5 2.x relevant here (versions, dates)
| Version | Date | What matters for WEBGL looks | Grade |
|---|---|---|---|
| 2.0 | 2025 | `textToModel`, `textToContours`, `textToPoints` (350 % faster than 1.x), `buildGeometry`, `splineVertex`, `textWeight`; strands born | A/B |
| 2.1 | early 2026 | strands `if/else` and `for` | B (PF post) |
| 2.2, 2.2.1, 2.2.2 | 2026 | WebGPU renderer (beta, unusable headless); flatter strands API; `millis()` in strands | B |
| 2.3.0 | 28 May or 22 Jun | `random() map() lerp()` in strands; filter shaders in 2D; material shader from `finalColor` alone | B |
| 2.3.1 | 21 Jul | `randomGaussian() color()` hex in strands; `instanceIndex`; HDR constant renamed P3 (breaking) | B |
| 2.3.2 to 2.3.4 | 30 Jul, 7 Sep, 25 Sep | faster `beginShape` with many vertices; GIF pixel limit; `preload()` error text | B |
| 2.4 | not released | `instances(n)` wrapper, strands `uniformMat*`, native SVG | B (blog, issue #8911) |
Sources: https://newreleases.io/project/github/processing/p5.js/release/v2.3.1 (B),
https://processingfoundation.org/blog/p5js-21-and-22-expanding-graphics-avenues-with-p5strands-improvements-and-webgpu (B),
https://processingfoundation.org/blog/drawing-a-forest-in-one-line-a-preview-of-instancing-in-p5strands (B). Atlas pages:
`references/atlas/pages/{p5-strands,shader-hooks,release-2-3,release-2-4,frontier-2026}.md`.

**WebGL2 defaults, [MEASURED] on this machine:** context `WebGL 2.0 (OpenGL ES 3.0 Chromium)`, renderer ANGLE/SwiftShader
(Vulkan 1.3), backing store 1920x1080 at density 2, context attributes `antialias:true` (main canvas is already MSAA, so a
film that never calls `setAttributes` gets it), `preserveDrawingBuffer:true`, `stencil:true`, `depth:true`, `alpha:true`.
Float colour buffers need `EXT_color_buffer_float` (present: a FLOAT framebuffer built and drew, 0.75 s vs 0.71 s byte).

## 2. Measured costs (one probe, shared by every technique below)
Probe: standalone page, vendored p5 2.3.4, `createCanvas(960,540,WEBGL)`, `pixelDensity(2)`, Playwright Chromium with
`--use-gl=angle --use-angle=swiftshader`, same flags as `arsenal/tools/shoot.mjs`. Scene: 40 spheres r=40 spread over a 520x280
region with z in [-240,0] (about 14 % of the frame covered). Time = one draw + 1-px `readPixels` sync, median of 3 after one
warm-up. Rows marked * were timed through `redraw()` plus a JPEG `toDataURL` of the 1080p canvas, which adds about 0.10 to
0.15 s; subtract it when comparing. Load average was 5 to 16 on 4 cores (other lanes running): treat as upper bounds. Probe
files: scratchpad `probe/{scenes,scenes2,scenes4,scenes5}.html` (not committed; ~120 lines of JS each).

| Case (1920x1080 backing) | s/frame | Note |
|---|---|---|
| flat `noLights()` fill, 40 spheres | 0.11 | baseline |
| `normalMaterial()` | 0.07 | unlit |
| lit: 1 directional + ambient, no specular | 1.34 | Phong per fragment |
| lit: 1 directional + `specularMaterial` + `shininess` | 1.24 | |
| lit: ambient + directional + 2 point + specular | 1.33 | **same as one light** |
| lit + strands fresnel rim + vertex wave | 1.32 (1.46*) | strands adds nothing measurable |
| lit + strands noise displace + alpha fade | 1.30 (1.96*) | the * run overlaps transparent spheres |
| lit + GLSL-string `getFinalColor` with `discard` | 1.38 | |
| `imageLight(img)` + `specularMaterial` + `metalness(80)` | 1.32 | no direct light needed |
| `imageLight` + one `pointLight` + metal | 1.44 (1.56*) | |
| `imageLight` only (no specular set) | 2.73 | one noisy run; do not set up this way |
| scene to `createFramebuffer` then `image()` (byte) | 0.71 | the blit costs about 0.6 s on its own |
| same, `antialias:4` / `format:FLOAT` | 0.64 / 0.75 | no visible penalty on software GL |
| own 16-tap depth-texture DoF `filter(shader)` | 2.39 | R-C's gl-post figure is 0.77 with fewer fetches |
| built-in `filter(BLUR, 8)` | **8.36** | never use it |
| `textToModel('REVENUE $4.2M', extrude 24, sampleFactor 1)` | build 46 ms, 2,784 vertices; draw 22 ms | lit draw is cheap: area small |
| `textToModel('1,247', extrude 18, sampleFactor 0.4)` | build 25 to 55 ms, 288 vertices, 174 faces, **no UVs** | |
| `buildGeometry`, 2,000 spheres (126,000 vertices) | bake 0.5 to 1.2 s once; draw flat 0.106, lit 0.109 | tiny spheres: fragment area decides |
| `splineVertex` x 400 with 3 px stroke (3D helix) | 0.09; with a stroke shader 0.14* | |
| planar shadow of 40 flat spheres (second draw) | +0.05 | geometry-bound |
| 10 lit spheres + lit floor + 10 planar shadows | 0.60* | fine |
| full-screen strands noise gradient on a `plane` | 0.43* (about 0.3) | one `buildColorShader` fragment, 2 noise calls |
| backdrop glass: scene + 480x270 fb + 81-tap blur + textured quad | 0.41* | |
| `Camera.slerp` x 4 | under 1 ms | |
Shader compile adds 0.1 to 0.8 s on a shader's first use (cold vs warm runs): pay it in `setup`, not in `render(t)`.

**Reading the table.** Lit shading costs about 1.2 s at 1080p regardless of light count (all fragment loops run over p5's
fixed-size light arrays). A film that goes lit pays once; adding the rim, the environment, the specular and four lights is
free after that. Fragment area is the lever: the same lit material on 2,000 small spheres costs 0.1 s.

## 3. Hook surface in 2.3.4 [MEASURED via `shader.inspectHooks()`]
```
baseMaterialShader  vertex:   beforeVertex, getObjectInputs(Vertex), getWorldInputs(Vertex), getCameraInputs(Vertex), afterVertex
                    fragment: beforeFragment, getPixelInputs(Inputs), combineColors(ColorComponents), getFinalColor(vec4 color, vec2 texCoord), afterFragment
baseColorShader     vertex: same three Vertex hooks      fragment: getFinalColor(vec4, vec2)
baseNormalShader    same as colour
baseStrokeShader    vertex: StrokeVertex x3 (position, tangentIn, tangentOut, color, weight)
                    fragment: getPixelInputs, getFinalColor, shouldDiscard(bool outside)
baseFilterShader    fragment: getColor(FilterInputs inputs, in sampler2D canvasContent)
```
`combineColors` default adds `diffuse*baseColor + ambient*ambientColor + specular*specularColor + emissive`, alpha = opacity.
In strands the same hooks are objects: `worldInputs`, `objectInputs`, `cameraInputs`, `pixelInputs`, `combineColors`,
`finalColor`, `filterColor`, each used as `hook.begin(); ...; hook.end()` (A: https://p5js.org/reference/p5/buildMaterialShader/ ;
[TESTED-REPO] `references/p5/webgl-strands.md` section 5.3). `pixelInputs` fields: `normal, texCoord, ambientLight, ambientMaterial,
specularMaterial, emissiveMaterial, color, shininess, metalness`. A GLSL-string override takes the exact two-argument
`getFinalColor(vec4, vec2)`; the one-argument form from old tutorials fails to compile.

**Instance-mode rules found today [MEASURED].** kit2 passes `p`. Inside a strands callback every p5 function needs `p.`
(`p.sin p.pow p.abs p.noise p.mix p.smoothstep p.uniformFloat` all compiled), hook objects and `[x,y,z]` literals stay bare,
and the scope is passed as `{p}`: `p.buildMaterialShader(() => {...}, {p})`. Un-prefixed `uniformFloat` threw
"uniformFloat is not defined". Closures are lost (the callback is re-compiled with `new Function`), so read time through a
global such as `T` set before each draw (`p.uniformFloat(() => T)`): the film's `render(t)` writes `T = t`, which keeps purity.

## 4. The ten techniques, each with API, doc, sketch, what it buys, cost

### T1 · Key/fill/rim light rig with real specular (stop shading flat)
- **API.** `ambientLight(v)`, `directionalLight(r,g,b,dx,dy,dz)`, `pointLight(r,g,b,x,y,z)`, `spotLight(...)`, `lightFalloff(c,l,q)`,
  `specularMaterial(c)`, `shininess(n)`, `specularColor(c)`, `emissiveMaterial(c)`, `noLights()`. Max 5 of each type (R-B, A: p5
  contributor doc `webgl_mode_architecture.md`). Atlas: `lights-and-materials.md`. Doc: https://p5js.org/reference/p5/pointLight/ (A, by name).
- **Sketch** (instance mode; call after the camera, before drawing marks).
```js
function rig(p){
  p.ambientLight(60);
  p.directionalLight(255,240,220,-0.4,0.6,-1);        // key, warm, upper left
  p.pointLight(80,160,255,-300,-200,200);               // fill, brand cool
  p.pointLight(255,120,60, 300, 200,150);               // rim from behind-right
  p.specularMaterial(255); p.shininess(60);
}
```
- **Buys.** Form: highlights and falloff on every sphere, bar and slab; the single biggest step from "diagram" to "render".
  Probe frame shows four distinct coloured speculars per sphere. **Cost.** +1.2 s/frame at 1080p, independent of light count;
  0 bytes beyond about 0.3 KB. **Risk.** Brand tokens are flat colours: use `post.toScene` (gl-post) so lit faces tone-map back to
  the role colour; exec level stays ink (law), so gate the rig behind the same `look` knob that gates post.

### T2 · Procedural studio environment with `imageLight` + `metalness`
- **API.** `imageLight(p5.Image)` (ambient light "from all directions", image acts as a surrounding sphere; diffuse follows
  `fill()`, reflections follow `specularMaterial()` and `shininess()`), `metalness(n)`, `panorama(img)` for a visible backdrop.
  A: https://p5js.org/reference/p5/imageLight/ , https://p5js.org/reference/p5/panorama/ . Atlas: none (`lights-and-materials` is
  thin). No `p5.env` page found by search (C: the atlas names Pagurek's `p5.env` library, unverified).
- **Sketch.** The environment is a 256x128 image the film paints in setup from tokens (zero bytes shipped):
```js
const env = p.createImage(256,128); env.loadPixels();
for (let y=0;y<128;y++) for (let x=0;x<256;x++){ const i=4*(y*256+x), k=y/128,
  soft=Math.exp(-((x-60)**2/900+(y-30)**2/200));          // one big softbox, upper left
  env.pixels[i]=40+54*k+215*soft; env.pixels[i+1]=60+80*(1-k)+200*soft; env.pixels[i+2]=110+120*(1-k)+190*soft; env.pixels[i+3]=255; }
env.updatePixels();
// render: p.imageLight(env); p.specularMaterial(255); p.shininess(80); p.metalness(80); p.fill(brandAccent); marks();
```
- **Buys.** Smooth, soft, non-pointy reflections: the "glossy product" look (Apple, Linear 3D icons). Probe frame: spheres
  pick up a gradient from the sky colour with a single soft highlight; no lights needed. **Cost.** 1.32 s with metal, 1.44 s
  plus a point light; 0 bytes (procedural) or 2 to 8 KB as a data-URL JPEG for a photographic softbox (page cap 1.3 MB, G8).
  **Risk.** Environment orientation and gamma are not documented; the metal setting tinted the probe spheres purple, so tune on
  a still. Set `specularMaterial` explicitly (without it the probe took 2.7 s and showed little).

### T3 · Strands fresnel rim and emissive edge (the signature product glow)
- **API.** `p.buildMaterialShader(cb, {p})` (= `baseMaterialShader().modify(cb, scope)`), hook `pixelInputs`, field
  `emissiveMaterial`, `normal` (view space). A: https://p5js.org/reference/p5/buildMaterialShader/ and
  https://p5js.org/reference/p5.Shader/ ; [TESTED-REPO] rim sketch in `references/p5/webgl-strands.md`.
- **Sketch** (compiled and rendered today; the probe image shows a blue edge glow on every sphere).
```js
const rim = p.buildMaterialShader(() => {
  pixelInputs.begin();
  let f = p.pow(1.0 - p.abs(pixelInputs.normal.z), 3.0);   // view-space normal: exact for ortho, good for perspective
  pixelInputs.emissiveMaterial = [0.1,0.5,1.0] * f * 1.2;  // brand accent in 0..1, scaled by the post knob
  pixelInputs.end();
}, {p});
// render: rig(p); p.shader(rim); p.fill(base); marks();
```
- **Buys.** A bright, brand-coloured silhouette: separates objects from the ground, reads as "lit from inside", survives
  H.264. **Cost.** +0 s over T1 (1.32 vs 1.33 s); 0.4 KB. **Risk.** Beta API; `shader()` applies to fills only in 2.x; true
  view-vector fresnel needs a GLSL `vViewPosition` hook (present in the lit shader [BUNDLE]) if perspective error shows.
  Needs the T1 rig to be on; bloom (gl-post) wants emission above 1 to catch it.

### T4 · Extruded 3D numerals and headlines from our own fonts
- **API.** `await loadFont(dataURL)` then `font.textToModel(str, x, y, {extrude, sampleFactor})` returning a `p5.Geometry`; draw
  with `model(g)`. A: https://p5js.org/reference/p5.Font/textToModel/ (extrude default 0, sampleFactor default 1),
  https://beta.p5js.org/tutorials/typography-20 (A). kit2 already loads TTFs: film.json `"fonts3d":[{"key":"Big Shoulders Display|600","text":"0123456789,.$%"}]`
  gives a 4 KB subset (`factory/kit2/README.md`). `textToPoints`/`textToContours` give outline samples for morph or draw-on.
- **Sketch.**
```js
// setup (async): const big = K.fonts3d['Big Shoulders Display|600'].textToModel('1,247', 0, 0, {extrude: 18, sampleFactor: 0.6});
// render: rig(p); p.push(); p.scale(1,-1,1); p.translate(-w/2,0,0); p.scale(5); p.fill(ink); p.model(big); p.pop();
```
- **Buys.** A hero number with real depth and glints, rotating under the key light: the Apple spec-sheet reveal. **Cost.** 25 to
  55 ms to build 288 to 2,784 vertices, 22 ms to draw lit; 4 KB font subset already budgeted. **Risk, honest.** (1) Output is
  in font-size units (a 12 px default): the probe's unscaled model was a 130 px smear until scaled. (2) **No UVs**, so no
  `texture()`. (3) Digits painted in the canvas are not read by G5/G7 text gates, which see SVG. Law "every digit is a claim":
  keep the SVG label in place (transparent or as the caption) and let the 3D numeral be the visual. (4) Complex glyphs can throw
  "font is too complex to render in 3D" (R-B). (5) Fraunces has no 3D cut in kit2.

### T5 · Camera arcs with `Camera.slerp` and keyed holds
- **API.** `createCamera()`, `cam.setPosition(x,y,z)`, `cam.lookAt(x,y,z)`, `cam.camera(ex,ey,ez,cx,cy,cz,ux,uy,uz)`, `cam.perspective`,
  `cam.frustum` (lens shift), `cam.pan/tilt/roll`, **`cam.slerp(a, b, amt)`**, `setCamera(cam)`. Same projection type required.
  A: https://p5js.org/reference/p5.Camera/slerp/ (by name; snippet via atlas `camera-slerp.md`).
- **Measured.** A at (0,0,800), B at (500,-300,300) looking at the origin: slerp eye at amt 0 / .25 / .5 / 1 =
  (0,0,800), (187,-87,733), (338,-170,618), (500,-300,300). Distance from origin 800, 733-ish, 724, 656: the eye **swings on an arc**
  (mid-radius 724 vs a straight lerp's 624), it does not cut the chord. Under 1 ms.
- **Sketch.**
```js
// setup: A=p.createCamera(); B=p.createCamera(); C=p.createCamera(); A.setPosition(0,0,800); B.setPosition(500,-300,300); B.lookAt(0,0,0);
// render(t): C.slerp(A, B, easeOutExpo(u)); p.setCamera(C);     // u from the shot's keyed time; keep K.cam0 for flat SVG-aligned beats
```
- **Buys.** Orbit-style moves that read as a rig (dolly-and-orbit), the thing cubic in-out position lerps cannot give.
  Combine with R-W1's easing (critically damped, expo out). **Cost.** 0 s, about 0.2 KB. **Risk.** Projection must match
  (perspective with perspective); fov is not slerped, so animate `cam.perspective(fov(t),...)` yourself for a dolly zoom; the
  `worldToScreen` label pins in `gl-labels` must be read from the same `C`.

### T6 · Vertex-hook dissolve, assemble and displace (transitions that are not cuts)
- **API.** strands `worldInputs.position/normal` in the vertex hook, `finalColor.set([r,g,b,a])` in the fragment hook,
  `p.noise()` in strands (2.3.0+). Per-vertex data via `p5.Geometry.vertexProperty(name, data, size)` (R-B: per vertex only).
  A: `buildMaterialShader` reference; atlas `vertex-property.md`.
- **Sketch** (compiled and rendered today).
```js
const dis = p.buildMaterialShader(() => {
  const k = p.uniformFloat(() => T);                       // 0..1 progress
  worldInputs.begin();
  let n = p.noise(worldInputs.position.x*0.02, worldInputs.position.y*0.02, worldInputs.position.z*0.02);
  worldInputs.position += worldInputs.normal * p.smoothstep(0.0,1.0,k) * n * 40.0;   // marks burst along their normals
  worldInputs.end();
  finalColor.begin(); finalColor.set([finalColor.color.x, finalColor.color.y, finalColor.color.z, 1.0 - k]); finalColor.end();
}, {p});
```
- **Buys.** Scene-to-scene transitions inside the world (assemble from noise, burst, wipe by world-x) instead of hard cuts.
  **Cost.** same as T1 (1.30 s); a baked mesh of 100k vertices costs vertex time only. **Risk.** p5 has **no transparency
  sorting** (#3736), and the probe shows back faces and overlaps through alpha; prefer opaque dissolve by shrinking along the
  normal (`position -= normal*k*r`) or a screen-door `discard` in the GLSL-string route (measured 1.38 s). Strands has no
  `discard` builder, so use `modify({'vec4 getFinalColor': ...})` for that one.

### T7 · Stroke shader and spline curves for flows, not for text
- **API.** `splineVertex(x,y,z)` + `splineProperty('ends', EXCLUDE)` (replaces `curveVertex`), `buildStrokeShader` with
  `worldInputs.weight|color|position` and a GLSL `shouldDiscard(bool)` hook, `linePerspective(bool)`, `strokeWeight`.
  A: atlas `spline-vertex.md` (from the p5 reference); https://p5js.org/reference/p5/buildFilterShader/ for sibling builders.
- **Measured.** 400-vertex 3D helix, 6 px stroke: 0.09 s; the stroke shader built and ran (0.14 s*) but my
  `weight *= 1 + 0.8 sin(...)` edit produced no visible width change in the still [UNVERIFIED: either the hook runs before
  width is applied or the weight is clamped]; use it only after a still confirms. Draw-on by emitting the first N vertices is
  free and exact (R-B: `arc-length-reveal` pattern).
- **Buys.** Smooth 3D arcs for flows and trajectories (gl-ribbons already builds ribbons as meshes). Low priority.

### T8 · Animated mesh-gradient backdrop with `buildColorShader`
- **API.** `p.buildColorShader(cb, {p})` with `finalColor.texCoord`, `p.noise`, `p.mix`, `p.smoothstep`, applied with `shader(s);
  plane(w,h)`. A: `buildColorShader` is in the strands builders list (atlas `p5-strands.md`).
- **Sketch** (compiled and rendered today; see caveat on noise).
```js
const bg = p.buildColorShader(() => {
  const uT = p.uniformFloat(() => T);
  finalColor.begin();
  let uv = finalColor.texCoord;
  let a = p.noise(uv.x*1.2 + uT*0.05, uv.y*1.2, 1.0), b = p.noise(uv.x*1.6 - uT*0.04 + 10.0, uv.y*1.6 + 5.0, 2.0);
  let c = p.mix([0.04,0.05,0.12,1.0], [0.25,0.30,0.95,1.0], p.smoothstep(0.30,0.80,a));
  finalColor.set(p.mix(c, [0.95,0.45,0.35,1.0], p.smoothstep(0.55,0.90,b) * 0.6));
  finalColor.end();
}, {p});
// render, first: p.push(); p.translate(0,0,-900); p.shader(bg); p.plane(5000,2800); p.pop();   // behind everything
```
- **Buys.** The living gradient field behind Linear, Stripe and Vercel hero frames; one pass, no texture. **Cost.** about
  0.3 s at 1080p; 0.3 KB. **Risk.** Strands `noise()` follows p5's default fractal (4 octaves, falloff 0.5): at frequency 2 to 3 the
  probe came out as torn clouds, not a smooth gradient. Call `noiseDetail(1, 0)` before building (inference C), lower the
  frequency as in the sketch, and let the grain pass of gl-post dither the 8-bit banding. A gradient is a brand-token job: draw
  colours from the pack, never hard-code.

### T9 · Planar projected shadow and baked contact shadow (ground the marks)
- **API.** `applyMatrix(16 numbers, column-major)`, `depthMask`-style draws via alpha, `noLights()`, a floor `plane`. p5 has no
  shadow maps (R-B: "shadow" occurs 0 times in the bundle); this is the cheap exact route for floors.
- **Sketch** (rendered today; light direction (0.5,1,-0.35), floor y = 229, p5 y points down).
```js
const lx=0.5, ly=1.0, lz=-0.35, fy=229;
p.push(); p.noLights(); p.fill(0,0,0,110);
p.applyMatrix(1,0,0,0,  -lx/ly,0,-lz/ly,0,  0,0,1,0,  lx/ly*fy, fy, lz/ly*fy, 1);   // flattens y onto the floor along the light
drawMarks(); p.pop();
```
- **Buys.** Marks stop floating: contact shadows under bars, spheres, towers; with soft accumulation (R-C jitters the light
  across sub-frames) the edge softens for free. **Cost.** +0.05 s; 0 bytes. **Risk.** Coplanar z-fighting speckled the shadow in
  the probe: lift `fy` by 0.5 or draw shadows first with the floor's depth write off. Floors only; instanced marks need the same
  matrix in the vertex shader. A hand-made shadow map is possible (R-B section 6) but costs a second scene draw and 9 taps.

### T10 · Backdrop-blur glass panel (the Apple and Linear frosted card)
- **API.** `createFramebuffer({width, height, density, antialias})`, `fb.begin()/end()`, `createFilterShader(frag)` or
  `buildFilterShader`, then `texture(fb)` on a quad with `textureMode(NORMAL)` and screen-aligned UVs. A:
  https://p5js.org/reference/p5/createFramebuffer/ (format `UNSIGNED_BYTE|FLOAT|HALF_FLOAT`, `depthFormat`, `antialias` true = 2
  samples or an integer, `textureFiltering`), https://p5js.org/tutorials/layered-rendering-with-framebuffers/ .
- **Sketch** (the probe's blur and quad; framing was off, see risk).
```js
// setup: glass = p.createFramebuffer({width:480, height:270, density:1, antialias:false}); blur = p.createFilterShader(frag9x9);
// render: scene(); glass.begin(); p.clear(); sceneWith(glass.createCamera()); p.filter(blur); glass.end();
//   p.push(); p.textureMode(p.NORMAL); p.texture(glass); p.beginShape();
//   for (const [x,y] of quad) p.vertex(x, y, z, (x+W/2)/W, (y+H/2)/H); p.endShape(p.CLOSE); p.pop();   // then SVG label on top
```
- **Buys.** A frosted card with the real scene softly blurred behind it, plus a hairline SVG border: the commonest "product UI"
  surface. **Cost.** 0.41 s* total with an 81-tap blur at quarter pixel count; scales with panel area. **Risk.** In the probe the
  half-res buffer used its own default camera, so the blurred spheres did not line up: "a camera used inside `fb.begin()` must be
  `fb.createCamera()`" (kit2 README); the buffer is y-flipped; keep density equal or the texture shifts. **Never** `filter(BLUR)`.

## 5. Ranking: product-demo look per cost
Value V 1 to 5 (my judgement against the Wave WOW bar). Cost class = 1 + B + S + R where B bytes (0 under 0.5 KB, 1 under 2 KB,
2 under 8 KB), S seconds added per frame (0 under 0.1, 1 under 0.5, 2 under 1.5, 3 more), R risk 0 to 3. Score = V / cost.
| Rank | Technique | V | B | S | R | Score | Note |
|---|---|---|---|---|---|---|---|
| 1 | T3 fresnel rim (strands) | 4 | 0 | 0 | 1 | 2.00 | conditional on T1 being on |
| 2= | T5 slerp camera arcs | 3 | 0 | 0 | 1 | 1.50 | no render cost at all |
| 2= | T9 planar and contact shadow | 3 | 0 | 0 | 1 | 1.50 | floors only |
| 4= | T1 key/fill/rim light rig | 4 | 0 | 2 | 0 | 1.33 | pays the 1.2 s lit tax once |
| 4= | T8 mesh-gradient backdrop | 4 | 0 | 1 | 1 | 1.33 | noise tuning needed |
| 6= | T2 procedural `imageLight` + metal | 4 | 1 | 2 | 1 | 0.80 | needs a tuned still |
| 6= | T10 backdrop-blur glass | 4 | 1 | 1 | 2 | 0.80 | fb camera and UV care |
| 8 | T4 extruded numerals | 3 | 1 | 0 | 2 | 0.75 | digits-in-canvas vs the SVG gate |
| 9 | T6 vertex-hook dissolve | 3 | 1 | 1 | 2 | 0.60 | transparency has no sort |
| 10 | T7 stroke shader and spline | 2 | 1 | 0 | 2 | 0.50 | width hook unconfirmed |
**Do as one bundle: T1 + T3 + T5 + T9 first** (look, rim, move, ground), then T8, then T2 and T10 as chapter hero moments.
T1 gates T3 and T2: do not ship either without it. All ten are pure functions of `t` (no state), so G2 re-seek purity holds.

## 6. Everything else the brief asked about (not in the ten)
| Topic | 2.3.4 status | Use | Cost |
|---|---|---|---|
| `baseFilterShader` / `buildFilterShader` | `filterColor.begin(); ... filterColor.set(...)`; tex via `getTexture(filterColor.canvasContent, uv)`; works in 2D since 2.3.0 | colour grade, vignette, pixelate, glitch; chain by hand with two framebuffers (R-B section 3) | one pass about 0.3 to 0.7 s at 1080p; `filter()` allocates its own layer: 2 passes |
| Built-in `filter(BLUR/ERODE/...)` | **8.4 s** for BLUR 8 [MEASURED] | never | |
| Depth texture for DoF and fog | `fb.depth` (NEAREST, FLOAT by default) in a filter; linearise with near/far | gl-post already does DoF; **depth fog** = mix toward the background by linear depth: one cheap filter | DoF 0.8 to 2.4 s; fog about 0.4 s |
| Float framebuffers | `format: FLOAT|HALF_FLOAT`, needs `EXT_color_buffer_float` (present) | linear HDR before tone map (gl-post) | 0.75 vs 0.71 s |
| MSAA framebuffers | `antialias: true|n`; main canvas already `antialias:true` | set explicitly | 0.64 vs 0.71 s (no penalty seen) |
| `buildGeometry` / baked meshes | one `p5.Geometry`; per-vertex `fill` colours kept; 126,000 vertices baked in 0.5 to 1.2 s | static grids, towers, point clouds; bake AO into vertex colours | draw 0.1 s |
| `splineVertex`, curve props | 3D `splineVertex(x,y,z)`; `splineProperty('ends', EXCLUDE)` | flows, trajectories | 0.09 s |
| `p5.Camera.slerp`, `frustum` | see T5; `frustum` gives off-axis lens shift for a "tilt-shift" feel | rigs without `orbitControl` | 0 |
| Lights beyond key/fill/rim | `spotLight(c, pos, dir, angle, conc)`, `lightFalloff` | a pool of light on the one claim | same lit tax |
| Instancing | R-B: `model(g, n)` with a data texture; `instanceIndex` in strands (since 2.3.1) | marks | R-B |
| Shadows | none built in; planar (T9), baked AO, hand shadow map (R-B section 6), screen-space contact shadow (Pagurek filter, C) | | T9 cheapest |
| WebGL2 extras | float textures, `texelFetch`, integer attributes through raw `GL` | R-B route 3 | |
| WebGPU, compute | beta, unusable headless | skip | |

## 7. Known limitations and bugs that touch these techniques (SwiftShader and p5)
| Item | Evidence | Defence |
|---|---|---|
| Lit shader is 12x slower than flat on software GL | 1.3 s vs 0.11 s [MEASURED] | frame-stepped export only; skip lights at exec level |
| `filter(BLUR)` | 8.4 s [MEASURED] | own half-res blur |
| Strands `@beta`; hook names moved 4 times | atlas `p5-strands`; 2.2.1 flat API; legacy `getWorldInputs(fn)` still compiles in 2.3.4 [TESTED-REPO] | pin 2.3.4, record the style in the card |
| Instance mode needs `p.` prefixes and `{p}` | [MEASURED] error text | wrap in one helper |
| Strands float literals print with 4 decimals; `**` crashes; else-branch overwrite; `for` assigning `inputs.color.rgb` | R-B section 9 (#8884 #9252 #9265 #9260) | uniforms for small constants, `pow()`, locals |
| No transparency sort (#3736) | probe: back faces show through alpha | opaque dissolves, `discard`, order data once |
| `textToModel`: no UVs, font-size units, may throw on complex glyphs | [MEASURED]/R-B | scale yourself; subset glyphs |
| `imageLight`: orientation and gamma undocumented | probe tint | tune on a still |
| Strands `noise()` is fractal by default | probe image | `noiseDetail(1,0)` |
| Shader compile on first use 0.1 to 0.8 s | cold vs warm [MEASURED] | compile in setup by drawing once off-screen |
| WebGPU `mapAsync` fails headless | `references/p5/webgl-strands.md` item 2 | not used |
| Main canvas hidden until first frame in async setup; Playwright `locator.screenshot` times out | [MEASURED] "element is not visible" | read `canvas.toDataURL()` inside `evaluate`, as kit2 does |
| `toDataURL` right after drawing inside `async setup` returned a blank frame | [MEASURED] | draw from `draw()`/`redraw()` or kit2's seek |

## 8. What to build (proposals, no edits made here)
1. **`arsenal/patterns/gl-look` (new lane):** `rig(p, tokens, level)` (T1), `rimShader(p, accent)` (T3), `studioEnv(p, tokens)` (T2),
   `meshGradient(p, tokens)` (T8), `planarShadow(p, ...)` (T9). One file under 6 KB; every colour from tokens; at `exec` it returns
   the flat look unchanged (D-law "exec is ink and clean"). Card records the cost row above.
2. **`gl-camera-rig` extension:** slerp-based keyed shots with eased `u`, plus `fov(t)`; keep the cubic path only as a fallback.
3. **Proof film:** re-cut one shipped film with the bundle (T1 + T3 + T5 + T9 + T8), judge against the R-W1 rubric, report the
   s/frame delta (expect +1.3 s lit, +0.3 s gradient, +0.05 s shadow).
4. **Decision row (proposed, for `docs/DECISIONS.md`):** "D12 · strands on a pinned p5. Strands hooks are allowed in a pattern when
   the card names the hook style (object or legacy), the p5 version (2.3.4), and a GLSL-string fallback; the film's `render(t)`
   feeds shaders only through a global time value (purity)."

## 9. Reproduce
`probe/scenes4.html` (scratchpad) loads `p5-2.3.4.min.js` and a Big Shoulders TTF beside it; Playwright launches
`/opt/pw-browsers/chromium-1194/chrome-linux/chrome` with `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader`
at `deviceScaleFactor 2`; for each key it sets `window.cur`, `await p5.redraw()`, reads one pixel, then `canvas.toDataURL`.
The JS in sections 3 and 4 is the content of those probes, shortened. To reproduce a cost row, copy the sketch into a kit2 film's
`render` and run `arsenal/tools/shoot.mjs`, whose `ms_per_frame` is the same measure.

## Sources
- A https://p5js.org/reference/p5.Font/textToModel/ ; https://beta.p5js.org/tutorials/typography-20 ; https://thecodingtrain.com/tracks/p5js-2.0/p5js-2.0/typography/ (B, video track)
- A https://p5js.org/reference/p5/createFramebuffer/ ; https://p5js.org/tutorials/layered-rendering-with-framebuffers/
- A https://p5js.org/reference/p5/imageLight/ ; https://p5js.org/reference/p5/panorama/
- A https://p5js.org/reference/p5/buildMaterialShader/ ; https://p5js.org/reference/p5/buildFilterShader/ ; https://p5js.org/reference/p5.Shader/ ; https://p5js.org/reference/p5/worldInputs/ (via search snippet)
- B https://newreleases.io/project/github/processing/p5.js/release/v2.3.1 ; https://processingfoundation.org/blog/p5js-21-and-22-expanding-graphics-avenues-with-p5strands-improvements-and-webgpu ; https://processingfoundation.org/blog/drawing-a-forest-in-one-line-a-preview-of-instancing-in-p5strands
- C https://github.com/processing/p5.js/issues/8171 (strands uniform pattern) ; https://discourse.processing.org/t/wrong-blending-of-flat-elements-in-webgl-mode/47402 (transparency, depth peeling) ; https://github.com/arthurcloche/p5.variableFont
- Local: `vendor/p5-2.3.4.min.js` (greps and live probe), `references/p5/webgl-strands.md`, `references/atlas/pages/{p5-strands,shader-hooks,lights-and-materials,camera-slerp,text-to-model,text-to-points,build-geometry,spline-vertex,filter-shaders,p5-framebuffer,release-2-3,release-2-4,frontier-2026}.md`, `arsenal/frontier/{R-B-p5-gpu,R-C-cinematic}.md`, `arsenal/patterns/gl-post/card.md`, `factory/kit2/README.md`.
