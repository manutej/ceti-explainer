# p5 2.3.4 — 1.x habits that break in 2.x

*Part of the field guide; index: `../p5-2x-field-guide.md`. Status tags [TESTED]/[SOURCE]/[UNVERIFIED] as in docs/research/01 and 04.*

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
