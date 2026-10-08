---
id: kinetic-typography
title: "Kinetic typography"
type: Technique
aliases: ["Kinetic type from glyph contours", "Kinetic typography in 2.x"]
sources: [S46, S47, S62, S268, S334, S341]
confidence: high
created: "2026-10-08"
updated: "2026-10-08"
version: "2.x"
---

# Kinetic typography

## Definition

Kinetic typography in p5 2.x animates text through variable-font textWeight(), glyph outlines from textToContours(), and extruded 3D text from textToModel(). [S46][S334][S62]

## Details

- Fonts load with `await loadFont(...)` inside async setup; Google Fonts URLs need p5.woff2. **[2.x]** [S268][S334]
- textToContours(str, x, y, options) returns one array of {x, y, alpha} points per contour, so "O" yields two; sampleFactor defaults to 0.1 and simplifyThreshold removes collinear points. **[2.x]** [S334]
- textWeight() sets or animates variable-font weight, and textModel/textToModel extrudes 3D text; reference and tutorial spellings differ (textToContours versus textContours). [S46][S62]
- In 1.x the equivalent was textToPoints with preload, a flat point list. **[1.x only]** [S268][S334]
- The Coding Train reworked its Steering Behaviors challenge with this in 2.0. [S46][S268]
- Morphing needs equal point counts: resample by arc length, pair contours by area or position, rotate the start index to minimise travel. [S341][S334]
- No new typography features were found in 2.1 to 2.3. [S47]

## In explainer work

Kinetic type gives title cards and morphing labels without a second engine; run the morph as a pure function of t so it scrubs and exports. [S341][S334]

## Patterns

### Pattern: contour point cloud
When to use: text that draws itself, morphs or turns into particles. [S334][S268]
```js
let font, pts;
async function setup() {
  createCanvas(800, 300);
  font = await loadFont('MyFont.ttf');
  pts = font.textToContours('flow', 80, 200, { sampleFactor: 0.2 }).flat();
}
function draw() { background(255); for (const p of pts) point(p.x, p.y); }
```
Pitfalls: glyphs have different contour counts; 2.x only. [S334][S268]

## Relations

- uses [[text-to-contours]] — outline source [S334]
- uses [[text-weight]] — variable-font animation [S46]
- uses [[text-to-model]] — extruded 3D titles [S46][S62]
- related_to [[explainer-engine-blueprint]] — pattern P9 morph [S341]
- related_to [[load-font]] — async font loading [S268]
- part_of [[hub-explainer-production]] (structural)
## Sources

- [S46] — Coding Train p5.js 2.0 typography (The Coding Train, undated)
- [S47] — p5.js 2.1 and 2.2: Expanding Graphics Avenues with p5.strands improvements and WebGPU (Processing Foundation, 2026-03-09)
- [S62] — p5.js 2.3.1 release notes (mirror) (GitHub release via newreleases.io, date not shown (page said "2 months ago"))
- [S268] — Greetings from p5.js 2.0: Animation, Interaction, and Typography in 2D and 3D (p5.js, undated)
- [S334] — p5.Font `textToContours()` reference (p5.js (v2.3.3), undated)
- [S341] — Coding Challenge #81 Circle Morphing (Daniel Shiffman / The Coding Train, undated)
