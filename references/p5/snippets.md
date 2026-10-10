# p5 2.3.4 — Snippets that run in 2.3.4

*Part of the field guide; index: `../p5-2x-field-guide.md`. Status tags [TESTED]/[SOURCE]/[UNVERIFIED] as in docs/research/01 and 04.*

- `fill('oklch(0.25 0.03 60 / 0.3)')` — CSS colours with slash-alpha parse directly in P2D.
- `font.textToContours(str, x, y, {sampleFactor})` uses the **current `textSize()`** (a `fontSize` option is
  ignored); returns contours of `{x, y, angle, alpha}` with no fill-rule metadata — use even-odd point-in-polygon.
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
